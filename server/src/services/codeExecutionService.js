const Docker = require("dockerode");
const docker = new Docker();
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const LANGUAGE_CONFIGS = {
  javascript: {
    image: "node:20",
    filename: "solution.js",
    command: ["node", "solution.js"],
    timeout: 3000,
  },
  python: {
    image: "python:3.9",
    filename: "solution.py",
    command: ["python", "solution.py"],
    timeout: 5000,
  },
  java: {
    image: "openjdk:11",
    filename: "Solution.java",
    command: ["bash", "-c", "javac Solution.java && java Solution"],
    timeout: 5000,
  },
  cpp: {
    image: "gcc:latest",
    filename: "solution.cpp",
    command: [
      "bash",
      "-c",
      "g++ -std=c++17 -O2 solution.cpp -o solution && ./solution",
    ],
    timeout: 5000,
  },
};

// Function to ensure Docker image exists
async function ensureImageExists(imageName) {
  try {
    const images = await docker.listImages();
    const imageExists = images.some(
      (img) => img.RepoTags && img.RepoTags.includes(imageName)
    );

    if (!imageExists) {
      console.log(`Pulling Docker image: ${imageName}`);
      await new Promise((resolve, reject) => {
        docker.pull(imageName, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      });
      console.log(`Successfully pulled image: ${imageName}`);
    }
  } catch (error) {
    console.error(`Error ensuring image exists: ${error.message}`);
    throw new Error(`Failed to prepare Docker image: ${error.message}`);
  }
}

async function createContainer(language, code, problem) {
  const config = LANGUAGE_CONFIGS[language.toLowerCase()];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  await ensureImageExists(config.image);

  const submissionId = uuidv4();
  const workDir = path.join(__dirname, "../../temp", submissionId);
  await fs.mkdir(workDir, { recursive: true });

  // Find the code stub for the selected language
  const codeStub = problem.codeStubs.find(
    (stub) => stub.language.toUpperCase() === language.toUpperCase()
  );

  if (!codeStub) {
    throw new Error(`No code stub found for language: ${language}`);
  }

  // Combine the code stub with user code
  const fullCode = `${codeStub.startSnippet}\n${code}\n${codeStub.endSnippet}`;
  console.log("Full code to execute:", fullCode);

  const filePath = path.join(workDir, config.filename);
  await fs.writeFile(filePath, fullCode);

  // Create container that stays running
  const container = await docker.createContainer({
    Image: config.image,
    Cmd: ["/bin/bash", "-c", "while true; do sleep 1; done"], // Keep container alive
    WorkingDir: "/app",
    AttachStdin: false,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    HostConfig: {
      Binds: [`${workDir}:/app`],
      Memory: 512 * 1024 * 1024,
      MemorySwap: 512 * 1024 * 1024,
      CpuPeriod: 100000,
      CpuQuota: 50000,
      NetworkMode: "none",
      PidsLimit: 50, // Increased for compilation processes
      Ulimits: [
        {
          Name: "nofile",
          Soft: 1024,
          Hard: 1024,
        },
      ],
    },
  });

  return { container, workDir, config };
}

async function cleanupContainer(container) {
  try {
    const containerInfo = await container.inspect();
    if (containerInfo.State.Running) {
      await container.stop({ t: 0 });
    }
    await container.remove({ force: true });
  } catch (error) {
    console.error("Container cleanup error:", error);
  }
}

// Helper function to execute command with timeout
async function execWithTimeout(container, cmd, timeoutMs = 5000) {
  return new Promise(async (resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Execution timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    try {
      const exec = await container.exec({
        Cmd: cmd,
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: false,
        Tty: false,
      });

      const stream = await exec.start({
        hijack: true,
        stdin: false,
        stdout: true,
        stderr: true,
      });

      let stdout = "";
      let stderr = "";

      // Better stream handling
      stream.on("data", (chunk) => {
        // Docker multiplexes stdout/stderr, need to demux
        if (chunk.length >= 8) {
          const header = chunk.slice(0, 8);
          const streamType = header[0];
          const size = header.readUInt32BE(4);
          const data = chunk.slice(8, 8 + size).toString();

          if (streamType === 1) {
            // stdout
            stdout += data;
          } else if (streamType === 2) {
            // stderr
            stderr += data;
          }
        }
      });

      stream.on("end", async () => {
        clearTimeout(timeoutId);
        try {
          const inspectResult = await exec.inspect();
          resolve({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            exitCode: inspectResult.ExitCode,
          });
        } catch (inspectError) {
          resolve({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            exitCode: null,
          });
        }
      });

      stream.on("error", (error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
    } catch (error) {
      clearTimeout(timeoutId);
      reject(error);
    }
  });
}

async function executeCode({ code, language, problem, testCases }) {
  let container;
  let workDir;

  try {
    // Create and start container
    const {
      container: newContainer,
      workDir: newWorkDir,
      config,
    } = await createContainer(language, code, problem);
    container = newContainer;
    workDir = newWorkDir;

    await container.start();
    console.log("Container started successfully");

    const results = {
      passed: 0,
      total: testCases.length,
      cases: [],
      time: 0,
      memory: 0,
    };

    // Prepare execution command based on language
    let execCommand;
    if (language.toLowerCase() === "java") {
      // For Java, compile first then run for each test
      const compileResult = await execWithTimeout(
        container,
        ["bash", "-c", "cd /app && javac Solution.java"],
        10000
      );

      if (compileResult.exitCode !== 0) {
        throw new Error(`Compilation failed: ${compileResult.stderr}`);
      }

      execCommand = ["bash", "-c", "cd /app && java Solution"];
    } else if (language.toLowerCase() === "cpp") {
      // For C++, compile first
      const compileResult = await execWithTimeout(
        container,
        [
          "bash",
          "-c",
          "cd /app && g++ -std=c++17 -O2 solution.cpp -o solution",
        ],
        10000
      );

      if (compileResult.exitCode !== 0) {
        throw new Error(`Compilation failed: ${compileResult.stderr}`);
      }

      execCommand = ["bash", "-c", "cd /app && ./solution"];
    } else {
      execCommand = config.command;
    }

    // Run each test case
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const startTime = Date.now();

      try {
        console.log(`Running test case ${i + 1}/${testCases.length}`);

        // Parse input and expected output
        const input = JSON.parse(testCase.input);
        const expectedOutput = JSON.parse(testCase.output);

        // Create input file for the program if needed
        const inputStr = JSON.stringify(input);
        await fs.writeFile(path.join(workDir, "input.txt"), inputStr);

        // Execute with the test input
        const execResult = await execWithTimeout(
          container,
          [
            ...execCommand.slice(0, -1),
            `${execCommand[execCommand.length - 1]} '${inputStr}'`,
          ],
          config.timeout
        );

        const executionTime = Date.now() - startTime;

        console.log(`Test ${i + 1} - stdout:`, execResult.stdout);
        console.log(`Test ${i + 1} - stderr:`, execResult.stderr);
        console.log(`Test ${i + 1} - exitCode:`, execResult.exitCode);

        // Parse and compare output
        let actualOutput;
        try {
          const rawOutput = execResult.stdout.trim();
          if (!rawOutput) {
            actualOutput = "";
          } else if (
            rawOutput.startsWith("{") ||
            rawOutput.startsWith("[") ||
            rawOutput.match(/^["0-9]/) ||
            rawOutput === "true" ||
            rawOutput === "false" ||
            rawOutput === "null"
          ) {
            actualOutput = JSON.parse(rawOutput);
          } else {
            actualOutput = rawOutput;
          }
        } catch (e) {
          console.error("Failed to parse output:", e);
          actualOutput = execResult.stdout.trim();
        }

        const passed =
          JSON.stringify(actualOutput) === JSON.stringify(expectedOutput);

        results.cases.push({
          passed,
          input: testCase.input,
          output: actualOutput,
          expected: testCase.output,
          time: executionTime,
          error: execResult.stderr || null,
          exitCode: execResult.exitCode,
        });

        if (passed) {
          results.passed++;
          results.time = Math.max(results.time, executionTime);
        }
      } catch (error) {
        console.error(`Test case ${i + 1} execution error:`, error);
        results.cases.push({
          passed: false,
          input: testCase.input,
          error: error.message,
          expected: testCase.output,
          time: Date.now() - startTime,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Code execution error:", error);
    throw new Error(`Code execution failed: ${error.message}`);
  } finally {
    if (container) {
      await cleanupContainer(container);
    }
    if (workDir) {
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (error) {
        console.error("Directory cleanup error:", error);
      }
    }
  }
}

module.exports = {
  executeCode,
};
