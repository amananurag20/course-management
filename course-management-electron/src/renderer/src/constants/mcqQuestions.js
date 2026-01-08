const mcqQuestions = [
  {
    id: "react-hooks",
    topic: "React Hooks",
    title: "Master React Hooks",
    timeLimit: 1,
    description:
      "Test your knowledge of React Hooks including useState, useEffect, useContext, and more",
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of useState hook?",
        options: [
          "To handle side effects",
          "To manage state in functional components",
          "To create context",
          "To optimize performance",
        ],
        correctAnswer: 1,
        explanation:
          "useState hook is used to add state management capabilities to functional components in React.",
      },
      {
        id: 2,
        question:
          "Which hook should be used to perform side effects in a React component?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1,
        explanation:
          "useEffect is used for handling side effects like data fetching, subscriptions, or DOM mutations.",
      },
      {
        id: 3,
        question: "What is the purpose of useCallback hook?",
        options: [
          "To memoize values",
          "To memoize functions",
          "To handle side effects",
          "To manage state",
        ],
        correctAnswer: 1,
        explanation:
          "useCallback is used to memoize functions to prevent unnecessary re-renders.",
      },
      {
        id: 4,
        question: "When does useEffect run by default?",
        options: [
          "Only on component mount",
          "Only on state updates",
          "After every render",
          "Never automatically",
        ],
        correctAnswer: 2,
        explanation:
          "By default, useEffect runs after every completed render unless dependencies are specified.",
      },
      {
        id: 5,
        question: "What is the purpose of the dependencies array in useEffect?",
        options: [
          "To store local variables",
          "To specify when the effect should run",
          "To optimize component rendering",
          "To define component props",
        ],
        correctAnswer: 1,
        explanation:
          "The dependencies array tells React when to re-run the effect based on which values have changed.",
      },
      {
        id: 6,
        question: "What is the purpose of useMemo hook?",
        options: [
          "To memoize functions",
          "To memoize values",
          "To handle side effects",
          "To manage state",
        ],
        correctAnswer: 1,
        explanation:
          "useMemo is used to memoize values to prevent expensive recalculations on every render.",
      },
      {
        id: 7,
        question: "What is the main use case for useContext hook?",
        options: [
          "To handle forms",
          "To manage local state",
          "To share data across components without prop drilling",
          "To optimize performance",
        ],
        correctAnswer: 2,
        explanation:
          "useContext is primarily used to consume context and share data across components without passing props through multiple levels.",
      },
    ],
  },
  {
    id: "js-basics",
    topic: "JavaScript Basics",
    title: "JavaScript Fundamentals",
    timeLimit: 10,
    description:
      "Test your understanding of JavaScript fundamentals including types, scoping, and common operations",
    questions: [
      {
        id: 1,
        question: "What is the output of console.log(typeof null)?",
        options: ["null", "undefined", "object", "number"],
        correctAnswer: 2,
        explanation:
          "In JavaScript, typeof null returns 'object'. This is a known bug in JavaScript that has persisted for historical reasons.",
      },
      {
        id: 2,
        question: "What will be the output of: console.log(0.1 + 0.2 === 0.3)?",
        options: ["true", "false", "undefined", "error"],
        correctAnswer: 1,
        explanation:
          "Due to floating-point precision in JavaScript, 0.1 + 0.2 is actually 0.30000000000000004",
      },
      {
        id: 3,
        question: "What is the output of: console.log([] == ![])?",
        options: ["true", "false", "undefined", "TypeError"],
        correctAnswer: 0,
        explanation:
          "Due to type coercion in JavaScript, both sides are converted to numbers, resulting in true",
      },
      {
        id: 4,
        question: "What is event bubbling in JavaScript?",
        options: [
          "Events are captured from innermost to outermost element",
          "Events are bubbled from outermost to innermost element",
          "Events are bubbled from innermost to outermost element",
          "Events don't bubble at all",
        ],
        correctAnswer: 2,
        explanation:
          "Event bubbling is the process where an event triggers on the innermost element and 'bubbles up' through its parent elements",
      },
      {
        id: 5,
        question: "What is the output of: console.log(typeof NaN)?",
        options: ["NaN", "undefined", "number", "object"],
        correctAnswer: 2,
        explanation: "In JavaScript, NaN is actually of type 'number'",
      },
    ],
  },
  {
    id: "data-structures",
    topic: "Data Structures",
    title: "enchance your skills more",
    timeLimit: 20,
    description:
      "Test your knowledge of common data structures and their operations",
    questions: [
      {
        id: 1,
        question:
          "What is the time complexity of accessing an element in an array by index?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation:
          "Array access by index is constant time O(1) because the memory location can be calculated directly",
      },
      {
        id: 2,
        question:
          "Which data structure uses LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        correctAnswer: 1,
        explanation:
          "Stack follows LIFO principle where the last element added is the first one to be removed",
      },
      {
        id: 3,
        question: "What is the main advantage of a hash table?",
        options: [
          "Ordered storage",
          "Constant time access",
          "Memory efficiency",
          "Sequential access",
        ],
        correctAnswer: 1,
        explanation:
          "Hash tables provide constant time O(1) access for insertions and lookups on average",
      },
      {
        id: 4,
        question:
          "In a binary search tree, where is the smallest element located?",
        options: [
          "Root node",
          "Rightmost leaf",
          "Leftmost leaf",
          "Random location",
        ],
        correctAnswer: 2,
        explanation:
          "In a binary search tree, the smallest element is always found at the leftmost leaf node",
      },
      {
        id: 5,
        question:
          "What is the time complexity of inserting at the beginning of a linked list?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        correctAnswer: 0,
        explanation:
          "Inserting at the beginning of a linked list is O(1) as it only requires updating the head pointer",
      },
    ],
  },
  {
    id: "algorithms",
    topic: "Algorithms",
    title: "algorithum your skills more",
    timeLimit: 25,
    description:
      "Test your understanding of common algorithms and their complexities",
    questions: [
      {
        id: 1,
        question:
          "What is the time complexity of QuickSort in the average case?",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctAnswer: 1,
        explanation:
          "QuickSort has an average time complexity of O(n log n) due to its divide-and-conquer approach",
      },
      {
        id: 2,
        question: "Which sorting algorithm is stable by nature?",
        options: ["QuickSort", "HeapSort", "Merge Sort", "Selection Sort"],
        correctAnswer: 2,
        explanation:
          "Merge Sort is stable as it preserves the relative order of equal elements",
      },
      {
        id: 3,
        question:
          "What is the space complexity of recursive fibonacci implementation?",
        options: ["O(1)", "O(n)", "O(log n)", "O(2^n)"],
        correctAnswer: 1,
        explanation:
          "The space complexity is O(n) due to the recursive call stack",
      },
      {
        id: 4,
        question:
          "Which algorithm is best for finding the shortest path in an unweighted graph?",
        options: ["Dijkstra's Algorithm", "BFS", "DFS", "Floyd-Warshall"],
        correctAnswer: 1,
        explanation:
          "BFS (Breadth-First Search) is optimal for finding shortest paths in unweighted graphs",
      },
      {
        id: 5,
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correctAnswer: 1,
        explanation:
          "Binary search has a time complexity of O(log n) as it divides the search space in half each time",
      },
    ],
  },
];

export default mcqQuestions;
