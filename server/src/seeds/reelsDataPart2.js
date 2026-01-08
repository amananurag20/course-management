// Continuation of reels data - Part 2

const remainingReelsData = [
    {
        title: "Math.abs() in JavaScript",
        description: "Get the absolute value of numbers using Math.abs()",
        youtubeUrl: "https://youtube.com/shorts/vOaOPsNBI98?si=y8kQR3VPwdiMuKcm",
        embedUrl: "https://www.youtube.com/embed/vOaOPsNBI98",
        author: "JavaScript Expert",
        order: 6,
        article: {
            title: "Understanding Math.abs() - Absolute Values in JavaScript",
            content: `Math.abs() returns the absolute value of a number - essentially the distance from zero, always as a positive number (or zero).

## Basic Syntax

\`\`\`javascript
Math.abs(x)
\`\`\`

## How It Works

\`\`\`javascript
Math.abs(5);      // 5
Math.abs(-5);     // 5
Math.abs(0);      // 0
Math.abs(-0);     // 0
Math.abs(3.14);   // 3.14
Math.abs(-3.14);  // 3.14
\`\`\`

**Key Concept**: Absolute value removes the sign, giving you the magnitude.

## Common Use Cases

### 1. Calculate Distance
\`\`\`javascript
function getDistance(point1, point2) {
  return Math.abs(point2 - point1);
}

console.log(getDistance(10, 5));   // 5
console.log(getDistance(5, 10));   // 5
console.log(getDistance(-5, 5));   // 10
\`\`\`

### 2. Compare Values
\`\`\`javascript
function areClose(a, b, tolerance = 0.001) {
  return Math.abs(a - b) < tolerance;
}

console.log(areClose(0.1 + 0.2, 0.3));  // true
console.log(areClose(5.001, 5.002, 0.01)); // true
\`\`\`

### 3. Temperature Difference
\`\`\`javascript
function getTempDifference(temp1, temp2) {
  return Math.abs(temp1 - temp2);
}

console.log(getTempDifference(25, 18));  // 7°
console.log(getTempDifference(-5, 10));  // 15°
\`\`\`

### 4. Price Change
\`\`\`javascript
function getPriceChange(oldPrice, newPrice) {
  const change = newPrice - oldPrice;
  return {
    amount: Math.abs(change),
    direction: change >= 0 ? 'increase' : 'decrease'
  };
}

console.log(getPriceChange(100, 120)); // { amount: 20, direction: 'increase' }
console.log(getPriceChange(100, 80));  // { amount: 20, direction: 'decrease' }
\`\`\`

### 5. Validation
\`\`\`javascript
function isWithinBudget(spent, budget, tolerance = 10) {
  return Math.abs(spent - budget) <= tolerance;
}

console.log(isWithinBudget(105, 100, 10)); // true
console.log(isWithinBudget(115, 100, 10)); // false
\`\`\`

## Real-World Examples

### Game Development: Collision Detection
\`\`\`javascript
function checkCollision(obj1, obj2, threshold) {
  const dx = Math.abs(obj1.x - obj2.x);
  const dy = Math.abs(obj1.y - obj2.y);
  return dx < threshold && dy < threshold;
}
\`\`\`

### Data Analysis: Deviation
\`\`\`javascript
function getAverageDeviation(numbers) {
  const avg = numbers.reduce((a, b) => a + b) / numbers.length;
  const deviations = numbers.map(n => Math.abs(n - avg));
  return deviations.reduce((a, b) => a + b) / deviations.length;
}
\`\`\`

### Financial: Profit/Loss Magnitude
\`\`\`javascript
function getTransactionMagnitude(amount) {
  return {
    magnitude: Math.abs(amount),
    type: amount >= 0 ? 'profit' : 'loss'
  };
}
\`\`\``,
            readTime: "5 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Math", "Absolute Value", "Numbers"],
            relatedLinks: [
                { title: "MDN: Math.abs()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/abs" },
            ],
            codeExamples: [
                {
                    title: "Basic Absolute Value",
                    code: "console.log(Math.abs(-5));   // 5\nconsole.log(Math.abs(5));    // 5\nconsole.log(Math.abs(-3.14)); // 3.14",
                    language: "javascript",
                },
                {
                    title: "Distance Calculation",
                    code: "function distance(a, b) {\n  return Math.abs(b - a);\n}\nconsole.log(distance(10, 5)); // 5",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Math.floor() in JavaScript",
        description: "Round numbers down to the nearest integer with Math.floor()",
        youtubeUrl: "https://youtube.com/shorts/MxYF0hJGgv4?si=HZB1eOtO8lh-BJJ3",
        embedUrl: "https://www.youtube.com/embed/MxYF0hJGgv4",
        author: "JavaScript Expert",
        order: 7,
        article: {
            title: "Understanding Math.floor() - Rounding Down in JavaScript",
            content: `Math.floor() rounds a number DOWN to the nearest integer. Think of it as the "floor" - it always rounds down.

## Basic Syntax

\`\`\`javascript
Math.floor(x)
\`\`\`

## How It Works

\`\`\`javascript
Math.floor(4.9);   // 4
Math.floor(4.1);   // 4
Math.floor(4);     // 4
Math.floor(-4.1);  // -5 (rounds down, away from zero)
Math.floor(-4.9);  // -5
\`\`\`

**Important**: For negative numbers, floor rounds away from zero (which is "down" on the number line).

## Common Use Cases

### 1. Convert to Integer
\`\`\`javascript
const price = 19.99;
const dollars = Math.floor(price); // 19
\`\`\`

### 2. Random Integer Generation
\`\`\`javascript
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

console.log(getRandomInt(10)); // 0-9
\`\`\`

### 3. Array Index Calculation
\`\`\`javascript
function getMiddleIndex(array) {
  return Math.floor(array.length / 2);
}

const arr = [1, 2, 3, 4, 5];
console.log(arr[getMiddleIndex(arr)]); // 3
\`\`\`

### 4. Time Calculations
\`\`\`javascript
function getHoursFromMinutes(minutes) {
  return Math.floor(minutes / 60);
}

console.log(getHoursFromMinutes(125)); // 2 hours
\`\`\`

### 5. Pagination
\`\`\`javascript
function getCurrentPage(index, itemsPerPage) {
  return Math.floor(index / itemsPerPage) + 1;
}

console.log(getCurrentPage(15, 10)); // Page 2
\`\`\`

## Comparison with Other Methods

\`\`\`javascript
const num = 4.7;

Math.floor(num);  // 4 (round down)
Math.ceil(num);   // 5 (round up)
Math.round(num);  // 5 (round to nearest)
Math.trunc(num);  // 4 (remove decimal)
\`\`\`

## Real-World Examples

### Currency Conversion
\`\`\`javascript
function convertCurrency(amount, rate) {
  return Math.floor(amount * rate * 100) / 100;
}
\`\`\`

### Game Score
\`\`\`javascript
function calculateLevel(xp) {
  return Math.floor(xp / 1000) + 1;
}
\`\`\`

### Grid Position
\`\`\`javascript
function getGridCell(x, cellSize) {
  return Math.floor(x / cellSize);
}
\`\`\``,
            readTime: "5 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Math", "Rounding", "Numbers"],
            relatedLinks: [
                { title: "MDN: Math.floor()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor" },
            ],
            codeExamples: [
                {
                    title: "Basic Floor",
                    code: "console.log(Math.floor(4.9));  // 4\nconsole.log(Math.floor(4.1));  // 4\nconsole.log(Math.floor(-4.1)); // -5",
                    language: "javascript",
                },
                {
                    title: "Random Integer",
                    code: "function randomInt(max) {\n  return Math.floor(Math.random() * max);\n}\nconsole.log(randomInt(10));",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Ternary Operator in JavaScript",
        description: "Write concise conditional statements with the ternary operator",
        youtubeUrl: "https://youtube.com/shorts/ZMx3TgX-bfY?si=cMWnwJksuYrBMoXn",
        embedUrl: "https://www.youtube.com/embed/ZMx3TgX-bfY",
        author: "JavaScript Expert",
        order: 8,
        article: {
            title: "Mastering the Ternary Operator (? :) in JavaScript",
            content: `The ternary operator is a concise way to write conditional statements. It's the only JavaScript operator that takes three operands.

## Basic Syntax

\`\`\`javascript
condition ? expressionIfTrue : expressionIfFalse
\`\`\`

## Simple Examples

\`\`\`javascript
const age = 20;
const canVote = age >= 18 ? 'Yes' : 'No';
console.log(canVote); // 'Yes'

const score = 85;
const grade = score >= 90 ? 'A' : 'B';
console.log(grade); // 'B'
\`\`\`

## vs if-else Statement

### Traditional if-else
\`\`\`javascript
let message;
if (isLoggedIn) {
  message = 'Welcome back!';
} else {
  message = 'Please log in';
}
\`\`\`

### Ternary Operator
\`\`\`javascript
const message = isLoggedIn ? 'Welcome back!' : 'Please log in';
\`\`\`

## Common Use Cases

### 1. Conditional Rendering (React)
\`\`\`javascript
return (
  <div>
    {isLoading ? <Spinner /> : <Content />}
  </div>
);
\`\`\`

### 2. Default Values
\`\`\`javascript
const username = user.name ? user.name : 'Guest';
// Or use nullish coalescing
const username = user.name ?? 'Guest';
\`\`\`

### 3. Dynamic Class Names
\`\`\`javascript
const buttonClass = isActive ? 'btn-active' : 'btn-inactive';
\`\`\`

### 4. Inline Calculations
\`\`\`javascript
const price = isMember ? basePrice * 0.9 : basePrice;
\`\`\`

### 5. Array Operations
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const result = numbers.map(n => n % 2 === 0 ? 'even' : 'odd');
\`\`\`

## Nested Ternary Operators

\`\`\`javascript
const score = 85;
const grade = score >= 90 ? 'A' :
              score >= 80 ? 'B' :
              score >= 70 ? 'C' :
              score >= 60 ? 'D' : 'F';
\`\`\`

**Warning**: Nested ternaries can reduce readability. Use sparingly!

## Advanced Patterns

### Multiple Conditions
\`\`\`javascript
const status = isOnline && hasMessages ? 'active' : 'inactive';
\`\`\`

### Function Calls
\`\`\`javascript
const result = isValid ? processData() : showError();
\`\`\`

### Object Property Access
\`\`\`javascript
const value = obj ? obj.property : defaultValue;
\`\`\`

## Best Practices

1. **Keep it simple**: Use for simple conditions only
2. **Readability first**: If it's hard to read, use if-else
3. **Avoid deep nesting**: Max 2 levels of nesting
4. **Use parentheses**: For complex conditions
5. **Consider alternatives**: Sometimes if-else is clearer

## Real-World Examples

### API Response Handling
\`\`\`javascript
const data = response.ok ? await response.json() : null;
\`\`\`

### Form Validation
\`\`\`javascript
const errorMessage = email.includes('@') ? '' : 'Invalid email';
\`\`\`

### Theme Switching
\`\`\`javascript
const theme = isDark ? 'dark-mode' : 'light-mode';
\`\`\``,
            readTime: "6 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Operators", "Conditional Logic", "Ternary"],
            relatedLinks: [
                { title: "MDN: Conditional Operator", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator" },
            ],
            codeExamples: [
                {
                    title: "Basic Ternary",
                    code: "const age = 20;\nconst status = age >= 18 ? 'Adult' : 'Minor';\nconsole.log(status); // 'Adult'",
                    language: "javascript",
                },
                {
                    title: "With Functions",
                    code: "const result = isValid ? processData() : handleError();\nconsole.log(result);",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Truthy and Falsy Values in JavaScript",
        description: "Understand how JavaScript evaluates values as true or false",
        youtubeUrl: "https://youtube.com/shorts/5o0fxqCHKLs?si=vTJaFMFUqPl0bp6m",
        embedUrl: "https://www.youtube.com/embed/5o0fxqCHKLs",
        author: "JavaScript Expert",
        order: 9,
        article: {
            title: "Complete Guide to Truthy and Falsy Values in JavaScript",
            content: `In JavaScript, every value has an inherent boolean value - it's either "truthy" or "falsy". Understanding this is crucial for writing effective conditional logic.

## Falsy Values

There are only **8 falsy values** in JavaScript:

\`\`\`javascript
false         // The boolean false
0             // The number zero
-0            // Negative zero
0n            // BigInt zero
""            // Empty string
''            // Empty string (single quotes)
\`\`           // Empty string (backticks)
null          // null
undefined     // undefined
NaN           // Not a Number
\`\`\`

## Truthy Values

**Everything else is truthy!** Including:

\`\`\`javascript
true          // Boolean true
1, -1, 100    // Any non-zero number
"0"           // String containing zero
"false"       // String containing "false"
[]            // Empty array
{}            // Empty object
function(){}  // Any function
new Date()    // Date objects
\`\`\`

## Testing Truthy/Falsy

\`\`\`javascript
// Using if statement
if (value) {
  console.log('Truthy!');
} else {
  console.log('Falsy!');
}

// Using Boolean()
console.log(Boolean(0));        // false
console.log(Boolean("hello"));  // true
console.log(Boolean([]));       // true
console.log(Boolean({}));       // true

// Using double NOT (!!)
console.log(!!0);        // false
console.log(!!"hello");  // true
\`\`\`

## Common Use Cases

### 1. Default Values
\`\`\`javascript
function greet(name) {
  name = name || 'Guest';
  console.log(\`Hello, \${name}!\`);
}

greet();          // "Hello, Guest!"
greet('John');    // "Hello, John!"
\`\`\`

### 2. Conditional Rendering
\`\`\`javascript
// React example
{user && <Profile user={user} />}
{items.length && <ItemList items={items} />}
\`\`\`

### 3. Guard Clauses
\`\`\`javascript
function processData(data) {
  if (!data) {
    return;  // Exit early if data is falsy
  }
  // Process data...
}
\`\`\`

### 4. Short-Circuit Evaluation
\`\`\`javascript
const value = userInput || defaultValue;
const result = isValid && processData();
\`\`\`

## Common Pitfalls

### Empty Array/Object are Truthy!
\`\`\`javascript
if ([]) {
  console.log('This runs!'); // Arrays are truthy
}

if ({}) {
  console.log('This runs!'); // Objects are truthy
}

// Check length instead
if (array.length) {
  console.log('Array has items');
}

// Check keys instead
if (Object.keys(obj).length) {
  console.log('Object has properties');
}
\`\`\`

### String "0" is Truthy
\`\`\`javascript
if ("0") {
  console.log('This runs!'); // "0" is truthy
}

// Convert to number first
if (Number("0")) {
  console.log('This does not run');
}
\`\`\`

### NaN is Falsy
\`\`\`javascript
if (NaN) {
  console.log('This does not run');
}

// Check for NaN specifically
if (isNaN(value)) {
  console.log('Value is NaN');
}
\`\`\`

## Logical Operators

### AND (&&)
Returns first falsy value or last value:
\`\`\`javascript
console.log(true && "hello");   // "hello"
console.log(false && "hello");  // false
console.log("" && "hello");     // ""
console.log("hi" && "hello");   // "hello"
\`\`\`

### OR (||)
Returns first truthy value or last value:
\`\`\`javascript
console.log(false || "hello");  // "hello"
console.log("" || "hello");     // "hello"
console.log("hi" || "hello");   // "hi"
console.log(0 || null);         // null
\`\`\`

### Nullish Coalescing (??)
Returns right side only if left is null/undefined:
\`\`\`javascript
console.log(0 ?? 10);          // 0
console.log("" ?? "default");  // ""
console.log(null ?? "default");// "default"
console.log(undefined ?? 10);  // 10
\`\`\`

## Best Practices

1. **Be explicit**: Use strict equality (===) when needed
2. **Check specifically**: Don't rely on truthiness for numbers
3. **Use nullish coalescing**: For null/undefined checks
4. **Document intent**: Make your conditions clear
5. **Test edge cases**: Consider all falsy values

## Real-World Examples

### Form Validation
\`\`\`javascript
function validateForm(data) {
  if (!data.email || !data.password) {
    return 'Missing required fields';
  }
  return null;
}
\`\`\`

### API Response
\`\`\`javascript
function handleResponse(response) {
  if (!response || !response.data) {
    throw new Error('Invalid response');
  }
  return response.data;
}
\`\`\`

### Configuration
\`\`\`javascript
const config = {
  timeout: userTimeout || 5000,
  retries: userRetries ?? 3,  // Use ?? for 0 to be valid
};
\`\`\``,
            readTime: "7 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Boolean Logic", "Truthy", "Falsy", "Type Coercion"],
            relatedLinks: [
                { title: "MDN: Truthy", url: "https://developer.mozilla.org/en-US/docs/Glossary/Truthy" },
                { title: "MDN: Falsy", url: "https://developer.mozilla.org/en-US/docs/Glossary/Falsy" },
            ],
            codeExamples: [
                {
                    title: "Falsy Values",
                    code: "console.log(Boolean(0));         // false\nconsole.log(Boolean(''));        // false\nconsole.log(Boolean(null));      // false\nconsole.log(Boolean(undefined)); // false",
                    language: "javascript",
                },
                {
                    title: "Truthy Values",
                    code: "console.log(Boolean('0'));       // true\nconsole.log(Boolean([]));        // true\nconsole.log(Boolean({}));        // true\nconsole.log(Boolean('false'));   // true",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Map Function in JavaScript",
        description: "Transform arrays with the powerful map() method",
        youtubeUrl: "https://youtube.com/shorts/CXiNKGt7MQ0?si=5KD-53kSvqHT1Yvq",
        embedUrl: "https://www.youtube.com/embed/CXiNKGt7MQ0",
        author: "JavaScript Expert",
        order: 10,
        article: {
            title: "Mastering Array.map() in JavaScript",
            content: `The map() method creates a new array by calling a function on every element of the original array. It's one of the most useful array methods in JavaScript.

## Basic Syntax

\`\`\`javascript
array.map(callback(element, index, array))
\`\`\`

## How It Works

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(numbers); // [1, 2, 3, 4, 5] (original unchanged)
\`\`\`

**Key Points:**
- Creates a new array
- Doesn't modify the original array
- Returns undefined if you don't return a value

## Common Use Cases

### 1. Transform Data
\`\`\`javascript
const users = [
  { firstName: 'John', lastName: 'Doe' },
  { firstName: 'Jane', lastName: 'Smith' }
];

const fullNames = users.map(user => \`\${user.firstName} \${user.lastName}\`);
console.log(fullNames); // ['John Doe', 'Jane Smith']
\`\`\`

### 2. Extract Properties
\`\`\`javascript
const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Phone', price: 699 }
];

const prices = products.map(product => product.price);
console.log(prices); // [999, 699]
\`\`\`

### 3. Format Data
\`\`\`javascript
const dates = ['2024-01-01', '2024-02-01', '2024-03-01'];
const formatted = dates.map(date => new Date(date).toLocaleDateString());
\`\`\`

### 4. Add Properties
\`\`\`javascript
const items = [{ name: 'Item 1' }, { name: 'Item 2' }];
const withIds = items.map((item, index) => ({
  ...item,
  id: index + 1
}));
\`\`\`

### 5. Convert Types
\`\`\`javascript
const strings = ['1', '2', '3', '4'];
const numbers = strings.map(Number);
console.log(numbers); // [1, 2, 3, 4]
\`\`\`

## Advanced Examples

### Chaining Methods
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0);

console.log(result); // 12
\`\`\`

### With Index
\`\`\`javascript
const items = ['a', 'b', 'c'];
const numbered = items.map((item, index) => \`\${index + 1}. \${item}\`);
console.log(numbered); // ['1. a', '2. b', '3. c']
\`\`\`

### Nested Arrays
\`\`\`javascript
const matrix = [[1, 2], [3, 4], [5, 6]];
const flattened = matrix.map(row => row.map(num => num * 2));
console.log(flattened); // [[2, 4], [6, 8], [10, 12]]
\`\`\`

## React Examples

### Rendering Lists
\`\`\`javascript
const items = ['Apple', 'Banana', 'Orange'];

return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
\`\`\`

### Component Mapping
\`\`\`javascript
const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];

return (
  <div>
    {users.map(user => (
      <UserCard key={user.id} user={user} />
    ))}
  </div>
);
\`\`\`

## Common Mistakes

### Not Returning a Value
\`\`\`javascript
// Wrong
const doubled = numbers.map(n => {
  n * 2;  // Missing return!
});

// Correct
const doubled = numbers.map(n => {
  return n * 2;
});

// Or use implicit return
const doubled = numbers.map(n => n * 2);
\`\`\`

### Modifying Original Array
\`\`\`javascript
// Wrong - mutates original
const users = [{ name: 'John' }];
users.map(user => user.age = 30);

// Correct - creates new objects
const updated = users.map(user => ({ ...user, age: 30 }));
\`\`\`

## map() vs forEach()

\`\`\`javascript
// forEach - no return value
numbers.forEach(n => console.log(n));

// map - returns new array
const doubled = numbers.map(n => n * 2);
\`\`\`

## Performance Tips

1. **Use for transformations**: Perfect for creating new arrays
2. **Avoid side effects**: Don't modify external variables
3. **Consider filter**: Use filter() before map() for efficiency
4. **Return early**: Use conditional returns when needed

## Best Practices

1. **Pure functions**: Keep map callbacks pure
2. **Descriptive names**: Use clear variable names
3. **Arrow functions**: Use for concise syntax
4. **Avoid nesting**: Extract complex logic to functions
5. **Key prop in React**: Always provide unique keys`,
            readTime: "7 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Arrays", "Map Function", "Functional Programming"],
            relatedLinks: [
                { title: "MDN: Array.map()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map" },
                { title: "JavaScript Array Methods", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array" },
            ],
            codeExamples: [
                {
                    title: "Basic Map",
                    code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]",
                    language: "javascript",
                },
                {
                    title: "Object Transformation",
                    code: "const users = [{name: 'John', age: 30}];\nconst names = users.map(u => u.name);\nconsole.log(names); // ['John']",
                    language: "javascript",
                },
            ],
        },
    },
];

module.exports = remainingReelsData;
