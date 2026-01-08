const mongoose = require("mongoose");
const Reel = require("../models/Reel");
require("dotenv").config();

const reelsData = [
    {
        title: "Arrow Functions in JavaScript",
        description: "Master arrow functions and understand their syntax, benefits, and use cases",
        youtubeUrl: "https://youtube.com/shorts/dg0QhMxU31U?si=V-EkOx7fS0GxnjpC",
        embedUrl: "https://www.youtube.com/embed/dg0QhMxU31U",
        author: "JavaScript Expert",
        order: 1,
        article: {
            title: "Complete Guide to Arrow Functions in JavaScript",
            content: `Arrow functions are a concise way to write functions in JavaScript, introduced in ES6. They provide a shorter syntax and have some important differences from traditional functions.

## Syntax

**Traditional Function:**
\`\`\`javascript
function add(a, b) {
  return a + b;
}
\`\`\`

**Arrow Function:**
\`\`\`javascript
const add = (a, b) => a + b;
\`\`\`

## Key Features

### 1. Concise Syntax
Arrow functions allow you to write functions in a more compact way:
- Single parameter: \`x => x * 2\`
- Multiple parameters: \`(x, y) => x + y\`
- No parameters: \`() => console.log('Hello')\`

### 2. Implicit Return
When the function body is a single expression, you can omit the curly braces and the return keyword:
\`\`\`javascript
const square = x => x * x;  // Implicit return
const multiply = (a, b) => a * b;
\`\`\`

### 3. Lexical 'this' Binding
Unlike regular functions, arrow functions don't have their own \`this\` context. They inherit \`this\` from the parent scope:

\`\`\`javascript
class Counter {
  constructor() {
    this.count = 0;
  }
  
  increment() {
    // Arrow function inherits 'this' from Counter
    setInterval(() => {
      this.count++;
      console.log(this.count);
    }, 1000);
  }
}
\`\`\`

## When to Use Arrow Functions

✅ **Use arrow functions for:**
- Short, simple functions
- Callbacks and array methods (map, filter, reduce)
- When you need to preserve the parent's \`this\` context
- Functional programming patterns

❌ **Avoid arrow functions for:**
- Object methods (when you need \`this\` to refer to the object)
- Functions that need \`arguments\` object
- Constructor functions
- Functions that need to be hoisted

## Common Use Cases

### Array Methods
\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// Map
const doubled = numbers.map(n => n * 2);

// Filter
const evens = numbers.filter(n => n % 2 === 0);

// Reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);
\`\`\`

### Event Handlers
\`\`\`javascript
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
\`\`\`

### Promises and Async Operations
\`\`\`javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

## Best Practices

1. **Keep it simple**: If your function is complex, consider using a regular function
2. **Use parentheses**: Always use parentheses for multiple parameters
3. **Be mindful of \`this\`**: Remember that arrow functions don't have their own \`this\`
4. **Readability first**: Don't sacrifice readability for brevity

## Common Pitfalls

### Returning Objects
When returning an object literal, wrap it in parentheses:
\`\`\`javascript
// Wrong
const getUser = id => { name: 'John', id: id };

// Correct
const getUser = id => ({ name: 'John', id: id });
\`\`\`

### No \`arguments\` Object
Arrow functions don't have the \`arguments\` object:
\`\`\`javascript
// Use rest parameters instead
const sum = (...args) => args.reduce((a, b) => a + b, 0);
\`\`\``,
            readTime: "6 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "ES6", "Functions", "Arrow Functions"],
            relatedLinks: [
                { title: "MDN: Arrow Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions" },
                { title: "JavaScript.info: Arrow Functions", url: "https://javascript.info/arrow-functions-basics" },
            ],
            codeExamples: [
                {
                    title: "Basic Arrow Function",
                    code: "const greet = name => `Hello, ${name}!`;\nconsole.log(greet('World')); // Hello, World!",
                    language: "javascript",
                },
                {
                    title: "Arrow Function with Array Methods",
                    code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Spread Operator in JavaScript",
        description: "Learn how to use the spread operator for arrays, objects, and function arguments",
        youtubeUrl: "https://youtube.com/shorts/me60nOHfdt8?si=6NXXvhCjnn-8Dnwi",
        embedUrl: "https://www.youtube.com/embed/me60nOHfdt8",
        author: "JavaScript Expert",
        order: 2,
        article: {
            title: "Mastering the Spread Operator (...) in JavaScript",
            content: `The spread operator (...) is one of the most powerful features in modern JavaScript. It allows you to expand iterables like arrays and objects in places where multiple elements or properties are expected.

## What is the Spread Operator?

The spread operator uses three dots (\`...\`) to "spread" or expand elements. It's incredibly versatile and can be used with arrays, objects, and function arguments.

## Spread with Arrays

### Copying Arrays
\`\`\`javascript
const original = [1, 2, 3];
const copy = [...original];

console.log(copy); // [1, 2, 3]
console.log(copy === original); // false (different reference)
\`\`\`

### Combining Arrays
\`\`\`javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];

console.log(combined); // [1, 2, 3, 4, 5, 6]
\`\`\`

### Adding Elements
\`\`\`javascript
const numbers = [2, 3, 4];
const moreNumbers = [1, ...numbers, 5];

console.log(moreNumbers); // [1, 2, 3, 4, 5]
\`\`\`

## Spread with Objects

### Copying Objects
\`\`\`javascript
const user = { name: 'John', age: 30 };
const userCopy = { ...user };

console.log(userCopy); // { name: 'John', age: 30 }
\`\`\`

### Merging Objects
\`\`\`javascript
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { theme: 'dark' };
const settings = { ...defaults, ...userPrefs };

console.log(settings); // { theme: 'dark', lang: 'en' }
\`\`\`

### Adding/Updating Properties
\`\`\`javascript
const user = { name: 'John', age: 30 };
const updatedUser = { ...user, age: 31, city: 'New York' };

console.log(updatedUser); 
// { name: 'John', age: 31, city: 'New York' }
\`\`\`

## Spread with Function Arguments

### Passing Array Elements as Arguments
\`\`\`javascript
const numbers = [1, 2, 3];

// Old way
Math.max.apply(null, numbers);

// With spread
Math.max(...numbers); // 3
\`\`\`

### Combining with Other Arguments
\`\`\`javascript
function sum(a, b, c, d) {
  return a + b + c + d;
}

const nums = [2, 3];
console.log(sum(1, ...nums, 4)); // 10
\`\`\`

## Common Use Cases

### 1. React State Updates
\`\`\`javascript
// Adding item to array
setState(prevState => ({
  items: [...prevState.items, newItem]
}));

// Updating object
setState(prevState => ({
  ...prevState,
  user: { ...prevState.user, name: 'Jane' }
}));
\`\`\`

### 2. Array Manipulation
\`\`\`javascript
// Remove duplicates
const numbers = [1, 2, 2, 3, 3, 4];
const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4]

// Convert string to array
const str = 'hello';
const chars = [...str];
console.log(chars); // ['h', 'e', 'l', 'l', 'o']
\`\`\`

### 3. Immutable Operations
\`\`\`javascript
// Insert at specific position
const arr = [1, 2, 5, 6];
const newArr = [...arr.slice(0, 2), 3, 4, ...arr.slice(2)];
console.log(newArr); // [1, 2, 3, 4, 5, 6]

// Remove item
const items = ['a', 'b', 'c', 'd'];
const filtered = [...items.slice(0, 2), ...items.slice(3)];
console.log(filtered); // ['a', 'b', 'd']
\`\`\`

## Spread vs Rest

While they look the same, spread and rest operators work differently:

**Spread**: Expands an array/object
\`\`\`javascript
const arr = [1, 2, 3];
console.log(...arr); // 1 2 3
\`\`\`

**Rest**: Collects multiple elements into an array
\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
\`\`\`

## Performance Considerations

- Spread creates shallow copies (nested objects/arrays are still referenced)
- For deep copying, use libraries like lodash or structuredClone()
- Spread is generally fast, but be mindful with very large arrays/objects

## Best Practices

1. **Use for immutability**: Perfect for creating new arrays/objects without mutating originals
2. **Shallow copy awareness**: Remember that nested objects are still referenced
3. **Readability**: Spread makes code more readable than traditional methods
4. **Order matters**: Later properties override earlier ones in object spread`,
            readTime: "7 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "ES6", "Spread Operator", "Arrays", "Objects"],
            relatedLinks: [
                { title: "MDN: Spread Syntax", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax" },
                { title: "JavaScript.info: Rest and Spread", url: "https://javascript.info/rest-parameters-spread" },
            ],
            codeExamples: [
                {
                    title: "Array Spread",
                    code: "const fruits = ['apple', 'banana'];\nconst moreFruits = [...fruits, 'orange', 'mango'];\nconsole.log(moreFruits);",
                    language: "javascript",
                },
                {
                    title: "Object Spread",
                    code: "const user = { name: 'John', age: 30 };\nconst updatedUser = { ...user, city: 'NYC' };\nconsole.log(updatedUser);",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Optional Chaining in JavaScript",
        description: "Safely access nested object properties without errors using optional chaining",
        youtubeUrl: "https://youtube.com/shorts/_1uNQJEVjgo?si=nRRoxdVeoqowSYG4",
        embedUrl: "https://www.youtube.com/embed/_1uNQJEVjgo",
        author: "JavaScript Expert",
        order: 3,
        article: {
            title: "Optional Chaining (?.) - Safe Property Access in JavaScript",
            content: `Optional chaining (?.) is a game-changing feature in JavaScript that allows you to safely access deeply nested object properties without worrying about null or undefined errors.

## The Problem

Before optional chaining, accessing nested properties was risky:

\`\`\`javascript
const user = {
  name: 'John',
  address: {
    city: 'New York'
  }
};

// This works
console.log(user.address.city); // 'New York'

// But this throws an error
const user2 = { name: 'Jane' };
console.log(user2.address.city); // TypeError: Cannot read property 'city' of undefined
\`\`\`

### Old Solution (Verbose)
\`\`\`javascript
const city = user2 && user2.address && user2.address.city;
\`\`\`

## The Solution: Optional Chaining

\`\`\`javascript
const city = user2?.address?.city;
console.log(city); // undefined (no error!)
\`\`\`

## How It Works

The \`?.\` operator checks if the value before it is null or undefined:
- If it is, the expression short-circuits and returns undefined
- If it isn't, it continues to access the property

## Use Cases

### 1. Object Property Access
\`\`\`javascript
const user = {
  name: 'John',
  profile: {
    bio: 'Developer'
  }
};

console.log(user?.profile?.bio); // 'Developer'
console.log(user?.settings?.theme); // undefined
\`\`\`

### 2. Array Element Access
\`\`\`javascript
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
];

console.log(users?.[0]?.name); // 'John'
console.log(users?.[5]?.name); // undefined
\`\`\`

### 3. Function Calls
\`\`\`javascript
const user = {
  getName: () => 'John'
};

console.log(user.getName?.()); // 'John'
console.log(user.getAge?.()); // undefined (no error!)
\`\`\`

### 4. Dynamic Property Access
\`\`\`javascript
const propName = 'address';
const user = { name: 'John' };

console.log(user?.[propName]?.city); // undefined
\`\`\`

## Real-World Examples

### API Response Handling
\`\`\`javascript
fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    // Safe access to nested data
    const street = data?.user?.address?.street;
    const phone = data?.user?.contact?.phone;
    
    console.log(street ?? 'No street info');
    console.log(phone ?? 'No phone info');
  });
\`\`\`

### React Component Props
\`\`\`javascript
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user?.name ?? 'Anonymous'}</h1>
      <p>{user?.profile?.bio ?? 'No bio available'}</p>
      <img src={user?.avatar?.url ?? '/default-avatar.png'} />
    </div>
  );
}
\`\`\`

### Event Handling
\`\`\`javascript
button.addEventListener('click', (event) => {
  const value = event?.target?.dataset?.value;
  const id = event?.currentTarget?.id;
  
  console.log(value, id);
});
\`\`\`

## Combining with Nullish Coalescing (??)

Optional chaining works great with the nullish coalescing operator:

\`\`\`javascript
const user = { name: 'John' };

// Get city or default value
const city = user?.address?.city ?? 'Unknown';

// Get theme or default
const theme = user?.settings?.theme ?? 'light';
\`\`\`

## Important Notes

### Short-Circuiting
Once a nullish value is encountered, the entire chain stops:

\`\`\`javascript
const user = null;
let count = 0;

user?.profile?.getName(count++);
console.log(count); // 0 (function never called)
\`\`\`

### Not for Assignment
You can't use optional chaining on the left side of an assignment:

\`\`\`javascript
// This doesn't work
user?.profile?.name = 'John'; // SyntaxError
\`\`\`

### Doesn't Work with Delete
\`\`\`javascript
// This doesn't work
delete user?.profile?.name; // SyntaxError
\`\`\`

## Best Practices

1. **Use for uncertain data**: Perfect for API responses, user input, or optional props
2. **Don't overuse**: If a property should always exist, don't use optional chaining
3. **Combine with defaults**: Use with ?? for fallback values
4. **Type safety**: Works great with TypeScript for type-safe property access

## Common Patterns

### Checking Method Existence
\`\`\`javascript
// Call method only if it exists
obj.method?.();

// With arguments
obj.method?.(arg1, arg2);
\`\`\`

### Array Methods
\`\`\`javascript
const users = data?.users;
const names = users?.map(u => u.name) ?? [];
\`\`\`

### Nested Callbacks
\`\`\`javascript
const callback = options?.callbacks?.onSuccess;
callback?.();
\`\`\`

## Browser Support

Optional chaining is supported in:
- Chrome 80+
- Firefox 74+
- Safari 13.1+
- Edge 80+
- Node.js 14+

For older browsers, use Babel to transpile your code.`,
            readTime: "6 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "ES2020", "Optional Chaining", "Safe Navigation"],
            relatedLinks: [
                { title: "MDN: Optional Chaining", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" },
                { title: "TC39 Proposal", url: "https://github.com/tc39/proposal-optional-chaining" },
            ],
            codeExamples: [
                {
                    title: "Basic Optional Chaining",
                    code: "const user = { name: 'John' };\nconsole.log(user?.address?.city); // undefined\nconsole.log(user?.name); // 'John'",
                    language: "javascript",
                },
                {
                    title: "With Nullish Coalescing",
                    code: "const user = { name: 'John' };\nconst city = user?.address?.city ?? 'Unknown';\nconsole.log(city); // 'Unknown'",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Math.random() in JavaScript",
        description: "Generate random numbers and understand how Math.random() works",
        youtubeUrl: "https://youtube.com/shorts/y1LhJChNXBA?si=gU5ZmE_3DqiZ2n5e",
        embedUrl: "https://www.youtube.com/embed/y1LhJChNXBA",
        author: "JavaScript Expert",
        order: 4,
        article: {
            title: "Complete Guide to Math.random() in JavaScript",
            content: `Math.random() is a built-in JavaScript function that generates pseudo-random numbers. It's essential for games, simulations, random selections, and many other applications.

## Basic Usage

\`\`\`javascript
const random = Math.random();
console.log(random); // e.g., 0.7392847592847593
\`\`\`

**Key Points:**
- Returns a floating-point number between 0 (inclusive) and 1 (exclusive)
- The number is pseudo-random (not truly random)
- Each call generates a different number

## Common Patterns

### Random Number in a Range

#### Random Integer Between 0 and Max
\`\`\`javascript
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

console.log(getRandomInt(10)); // 0 to 9
console.log(getRandomInt(100)); // 0 to 99
\`\`\`

#### Random Integer Between Min and Max
\`\`\`javascript
function getRandomIntInRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomIntInRange(1, 6)); // Dice roll: 1 to 6
console.log(getRandomIntInRange(10, 20)); // 10 to 20
\`\`\`

#### Random Float in Range
\`\`\`javascript
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

console.log(getRandomFloat(1.5, 5.5)); // e.g., 3.7492847592847593
\`\`\`

## Practical Examples

### 1. Random Color Generator
\`\`\`javascript
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return \`rgb(\${r}, \${g}, \${b})\`;
}

console.log(getRandomColor()); // e.g., 'rgb(123, 45, 200)'
\`\`\`

### 2. Random Hex Color
\`\`\`javascript
function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

console.log(getRandomHexColor()); // e.g., '#a3c5f2'
\`\`\`

### 3. Random Array Element
\`\`\`javascript
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const fruits = ['apple', 'banana', 'orange', 'mango'];
console.log(getRandomElement(fruits)); // Random fruit
\`\`\`

### 4. Shuffle Array
\`\`\`javascript
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const numbers = [1, 2, 3, 4, 5];
console.log(shuffleArray(numbers)); // e.g., [3, 1, 5, 2, 4]
\`\`\`

### 5. Random Boolean
\`\`\`javascript
function getRandomBoolean() {
  return Math.random() < 0.5;
}

console.log(getRandomBoolean()); // true or false
\`\`\`

### 6. Weighted Random
\`\`\`javascript
function weightedRandom(weights) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * total;
  
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) return i;
    random -= weights[i];
  }
  return weights.length - 1;
}

// 50% chance of 0, 30% chance of 1, 20% chance of 2
const weights = [0.5, 0.3, 0.2];
console.log(weightedRandom(weights));
\`\`\`

### 7. Random String Generator
\`\`\`javascript
function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

console.log(generateRandomString(10)); // e.g., 'aB3xY9mK2p'
\`\`\`

### 8. Random Date Generator
\`\`\`javascript
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const startDate = new Date(2024, 0, 1);
const endDate = new Date(2024, 11, 31);
console.log(getRandomDate(startDate, endDate));
\`\`\`

## Important Considerations

### Pseudo-Random vs True Random
- Math.random() is pseudo-random (deterministic algorithm)
- For cryptographic purposes, use \`crypto.getRandomValues()\`
- Suitable for games, simulations, and non-security applications

### Seeding
- JavaScript's Math.random() cannot be seeded
- For reproducible random sequences, use libraries like seedrandom

### Performance
- Math.random() is very fast
- Suitable for real-time applications and games

## Cryptographically Secure Random

For security-sensitive applications:

\`\`\`javascript
// Browser
const array = new Uint32Array(1);
crypto.getRandomValues(array);
const secureRandom = array[0] / (0xffffffff + 1);

// Node.js
const crypto = require('crypto');
const secureRandom = crypto.randomBytes(4).readUInt32BE() / (0xffffffff + 1);
\`\`\`

## Common Use Cases

1. **Games**: Dice rolls, card shuffling, enemy spawning
2. **Simulations**: Monte Carlo simulations, random sampling
3. **UI/UX**: Random animations, color schemes, content rotation
4. **Testing**: Generating test data, fuzzing
5. **Randomization**: A/B testing, random selections

## Best Practices

1. **Use helper functions**: Create reusable random number generators
2. **Avoid floating-point issues**: Use Math.floor() for integers
3. **Consider distribution**: Math.random() is uniformly distributed
4. **Security**: Don't use for passwords, tokens, or encryption
5. **Testing**: Use seeded random for reproducible tests`,
            readTime: "7 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Math", "Random Numbers", "Algorithms"],
            relatedLinks: [
                { title: "MDN: Math.random()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random" },
                { title: "Crypto.getRandomValues()", url: "https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues" },
            ],
            codeExamples: [
                {
                    title: "Random Integer",
                    code: "function getRandomInt(min, max) {\n  return Math.floor(Math.random() * (max - min + 1)) + min;\n}\nconsole.log(getRandomInt(1, 10));",
                    language: "javascript",
                },
                {
                    title: "Random Array Element",
                    code: "const colors = ['red', 'blue', 'green', 'yellow'];\nconst randomColor = colors[Math.floor(Math.random() * colors.length)];\nconsole.log(randomColor);",
                    language: "javascript",
                },
            ],
        },
    },
    {
        title: "Math.ceil() in JavaScript",
        description: "Round numbers up to the nearest integer with Math.ceil()",
        youtubeUrl: "https://youtube.com/shorts/MufXIv-PJdA?si=OEtbhw4gX4x04z0V",
        embedUrl: "https://www.youtube.com/embed/MufXIv-PJdA",
        author: "JavaScript Expert",
        order: 5,
        article: {
            title: "Understanding Math.ceil() - Rounding Up in JavaScript",
            content: `Math.ceil() is a built-in JavaScript function that rounds a number UP to the nearest integer. The name "ceil" comes from "ceiling" - think of it as rounding up to the ceiling.

## Basic Syntax

\`\`\`javascript
Math.ceil(x)
\`\`\`

Where \`x\` is a number.

## How It Works

Math.ceil() always rounds UP to the next integer:

\`\`\`javascript
Math.ceil(4.1);   // 5
Math.ceil(4.5);   // 5
Math.ceil(4.9);   // 5
Math.ceil(5);     // 5 (already an integer)
Math.ceil(-4.1);  // -4 (rounds toward zero)
Math.ceil(-4.9);  // -4
\`\`\`

**Key Point**: For negative numbers, ceiling rounds toward zero (which is "up" on the number line).

## Common Use Cases

### 1. Pagination Calculation
\`\`\`javascript
function getTotalPages(totalItems, itemsPerPage) {
  return Math.ceil(totalItems / itemsPerPage);
}

console.log(getTotalPages(100, 10)); // 10 pages
console.log(getTotalPages(101, 10)); // 11 pages
console.log(getTotalPages(95, 10));  // 10 pages
\`\`\`

### 2. Progress Percentage
\`\`\`javascript
function getProgressPercentage(completed, total) {
  return Math.ceil((completed / total) * 100);
}

console.log(getProgressPercentage(7, 10));  // 70%
console.log(getProgressPercentage(3, 7));   // 43%
\`\`\`

### 3. Minimum Required Items
\`\`\`javascript
function getMinimumBoxes(items, boxCapacity) {
  return Math.ceil(items / boxCapacity);
}

console.log(getMinimumBoxes(25, 10)); // 3 boxes needed
console.log(getMinimumBoxes(30, 10)); // 3 boxes needed
console.log(getMinimumBoxes(31, 10)); // 4 boxes needed
\`\`\`

### 4. Time Calculations
\`\`\`javascript
function getMinutesFromSeconds(seconds) {
  return Math.ceil(seconds / 60);
}

console.log(getMinutesFromSeconds(59));  // 1 minute
console.log(getMinutesFromSeconds(60));  // 1 minute
console.log(getMinutesFromSeconds(61));  // 2 minutes
\`\`\`

### 5. Grid Layout Calculations
\`\`\`javascript
function getGridRows(items, columns) {
  return Math.ceil(items / columns);
}

// 10 items in 3 columns
console.log(getGridRows(10, 3)); // 4 rows needed
\`\`\`

### 6. Price Rounding
\`\`\`javascript
function roundUpPrice(price) {
  return Math.ceil(price);
}

console.log(roundUpPrice(19.99)); // 20
console.log(roundUpPrice(19.01)); // 20
\`\`\`

## Comparison with Other Rounding Methods

\`\`\`javascript
const num = 4.3;

Math.ceil(num);   // 5 (round up)
Math.floor(num);  // 4 (round down)
Math.round(num);  // 4 (round to nearest)
Math.trunc(num);  // 4 (remove decimal)
\`\`\`

### Visual Comparison
\`\`\`javascript
const numbers = [4.1, 4.5, 4.9, -4.1, -4.5, -4.9];

numbers.forEach(num => {
  console.log(\`
    Number: \${num}
    ceil:   \${Math.ceil(num)}
    floor:  \${Math.floor(num)}
    round:  \${Math.round(num)}
    trunc:  \${Math.trunc(num)}
  \`);
});
\`\`\`

## Advanced Examples

### Custom Ceiling to Decimal Places
\`\`\`javascript
function ceilToDecimal(number, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.ceil(number * factor) / factor;
}

console.log(ceilToDecimal(4.123, 2));  // 4.13
console.log(ceilToDecimal(4.121, 2));  // 4.13
console.log(ceilToDecimal(4.129, 2));  // 4.13
\`\`\`

### Round Up to Nearest Multiple
\`\`\`javascript
function ceilToMultiple(number, multiple) {
  return Math.ceil(number / multiple) * multiple;
}

console.log(ceilToMultiple(23, 5));   // 25
console.log(ceilToMultiple(27, 10));  // 30
console.log(ceilToMultiple(100, 25)); // 100
\`\`\`

### Batch Processing
\`\`\`javascript
function getBatchCount(items, batchSize) {
  return Math.ceil(items.length / batchSize);
}

const data = Array(105).fill(0);
console.log(getBatchCount(data, 10)); // 11 batches
\`\`\`

## Real-World Applications

### E-commerce: Shipping Calculation
\`\`\`javascript
function calculateShippingBoxes(weight, maxWeightPerBox) {
  return Math.ceil(weight / maxWeightPerBox);
}

const totalWeight = 45; // kg
const maxWeight = 20;   // kg per box
console.log(calculateShippingBoxes(totalWeight, maxWeight)); // 3 boxes
\`\`\`

### Video Player: Buffer Segments
\`\`\`javascript
function getBufferSegments(videoDuration, segmentLength) {
  return Math.ceil(videoDuration / segmentLength);
}

console.log(getBufferSegments(125, 10)); // 13 segments
\`\`\`

### File Upload: Chunks
\`\`\`javascript
function getUploadChunks(fileSize, chunkSize) {
  return Math.ceil(fileSize / chunkSize);
}

const fileSizeMB = 25;
const chunkSizeMB = 5;
console.log(getUploadChunks(fileSizeMB, chunkSizeMB)); // 5 chunks
\`\`\`

## Edge Cases

\`\`\`javascript
Math.ceil(0);        // 0
Math.ceil(-0);       // -0
Math.ceil(Infinity); // Infinity
Math.ceil(-Infinity);// -Infinity
Math.ceil(NaN);      // NaN
Math.ceil(null);     // 0
Math.ceil(undefined);// NaN
Math.ceil('5.5');    // 6 (string coerced to number)
Math.ceil('abc');    // NaN
\`\`\`

## Performance Tips

1. **Direct use**: Math.ceil() is highly optimized
2. **Avoid unnecessary calls**: Cache results when possible
3. **Type checking**: Ensure input is a number for predictable results

## Common Mistakes

### Mistake 1: Expecting floor behavior
\`\`\`javascript
// Wrong assumption
Math.ceil(4.1); // Expecting 4, but gets 5
\`\`\`

### Mistake 2: Negative number confusion
\`\`\`javascript
Math.ceil(-4.9); // -4, not -5
// Remember: ceil rounds toward zero for negatives
\`\`\`

### Mistake 3: Decimal precision
\`\`\`javascript
// Floating point issues
Math.ceil(0.1 + 0.2); // 1, not 0.3
\`\`\`

## Best Practices

1. **Use for upward rounding**: When you need the next integer
2. **Pagination**: Perfect for calculating total pages
3. **Resource allocation**: Calculate minimum resources needed
4. **Combine with validation**: Check for valid numbers first
5. **Document intent**: Make it clear why you're rounding up`,
            readTime: "6 min read",
            difficulty: "Beginner",
            topics: ["JavaScript", "Math", "Rounding", "Numbers"],
            relatedLinks: [
                { title: "MDN: Math.ceil()", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil" },
                { title: "JavaScript Math Object", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math" },
            ],
            codeExamples: [
                {
                    title: "Basic Ceiling",
                    code: "console.log(Math.ceil(4.1));  // 5\nconsole.log(Math.ceil(4.9));  // 5\nconsole.log(Math.ceil(-4.1)); // -4",
                    language: "javascript",
                },
                {
                    title: "Pagination Example",
                    code: "function getTotalPages(items, perPage) {\n  return Math.ceil(items / perPage);\n}\nconsole.log(getTotalPages(95, 10)); // 10",
                    language: "javascript",
                },
            ],
        },
    },
];

// Add remaining reels data (Math.abs, Math.floor, Ternary, Truthy/Falsy, Map) in next part...
// Due to length, I'll create them in a separate seed file or continue here

module.exports = reelsData;
