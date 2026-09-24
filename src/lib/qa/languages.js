// Languages Q&A dataset: JavaScript, TypeScript, Python, Java, C#, C++, C, Go, Rust, PHP, Ruby, Kotlin, Swift, Dart, HTML5, CSS3
// Covers all 15 modules for each language with detailed explanations, practical code examples, and key takeaways.

export const QA_LANGUAGES = [
  // ==========================================
  // JAVASCRIPT (15 Modules - Upgraded)
  // ==========================================
  {
    question:
      "What is a closure in JavaScript and how does it retain access to outer variables?",
    answer:
      "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment).\n\nIn JavaScript, closures are created every time a function is created, at function creation time. This allows an inner function to access variables from an outer enclosing function's scope even after the outer function has executed and returned from the call stack.\n\nClosures are widely used for data privacy, state encapsulation, factory functions, and event-driven callbacks.",
    example: `function createCounter(initialValue = 0) {
  let count = initialValue; // Private state encapsulated by closure

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log(counter.increment()); // 11
console.log(counter.increment()); // 12
console.log(counter.decrement()); // 11
console.log(counter.count);       // undefined (Encapsulated!)`,
    explanation:
      "Even though `createCounter` finished running, its lexical environment remains in memory because `increment`, `decrement`, and `getCount` maintain references to `count`. Direct modification of `count` from outside is impossible.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How does lexical scoping work in JavaScript?",
    answer: "Lexical scoping (also known as static scoping) means that variable accessibility is determined purely by the physical location of variables and functions in the written source code.\n\nInner functions contain the scope of parent functions, meaning the scope chain is established at author/parse time, regardless of where or when the function is eventually called at runtime.",
    example: `const globalGreeting = "Hello from Global";

function outerFunction() {
  const outerMessage = "Hello from Outer";

  function innerFunction() {
    const innerNote = "Hello from Inner";
    // Can access its own scope, parent scope, and global scope
    console.log(innerNote);
    console.log(outerMessage);
    console.log(globalGreeting);
  }

  return innerFunction;
}

const runInner = outerFunction();
runInner(); // Still accesses outerMessage via lexical scope!`,
    explanation: "Because JavaScript uses lexical scoping, `innerFunction` resolves `outerMessage` based on where it was declared inside `outerFunction`, not where `runInner()` is executed.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the difference between var, let, and const in terms of scope?",
    answer: "• var: Function-scoped (or globally scoped if declared outside a function). It ignores curly-brace blocks `{}` like `if` or `for` and gets hoisted with an initial value of `undefined`.\n• let & const: Block-scoped. They exist exclusively within the nearest enclosing curly braces `{}` and reside in the Temporal Dead Zone (TDZ) before declaration.\n• const: Disallows variable reassignment, though object properties can still be mutated.",
    example: `function scopeComparison() {
  if (true) {
    var functionScoped = "Available throughout function";
    let blockScoped = "Available only in this if-block";
    const constantVal = "Block scoped constant";
  }

  console.log(functionScoped); // Works!
  // console.log(blockScoped);  // ReferenceError: blockScoped is not defined
  // console.log(constantVal);  // ReferenceError: constantVal is not defined
}

scopeComparison();`,
    explanation: "`var` leaks outside `if` statements and loops, which often leads to subtle variable overwriting bugs. Always prefer `const` by default and `let` when reassignment is needed.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the classic 'loop + closure' interview problem and how do you fix it?",
    answer: "When using `var` in a `for` loop with asynchronous callbacks (like `setTimeout`), only a single shared `i` binding exists for the entire loop.\n\nBy the time the timer callbacks execute on the macrotask queue, the loop has already completed, printing the final loop value (e.g. 3, 3, 3) instead of each iteration's index (0, 1, 2).\n\nFixes:\n1. Use `let` instead of `var`: `let` creates a fresh, separate lexical binding for each loop iteration.\n2. Wrap the callback in an IIFE to capture the current value by argument closure.",
    example: `// ❌ Problem with var:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var index:", i), 100);
}
// Output: 3, 3, 3

// ✅ Modern Fix with let (Per-iteration lexical scope binding):
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let index:", j), 100);
}
// Output: 0, 1, 2`,
    explanation: "Because `let` is block-scoped, JavaScript creates a new lexical scope and captures a fresh copy of `j` on every single iteration of the loop.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the Module Pattern and how does it use closures for data encapsulation?",
    answer: "The Module Pattern uses an Immediately Invoked Function Expression (IIFE) that returns a public interface object.\n\nInternal variables and helper functions remain strictly private inside the IIFE closure, exposing only authorized methods to external consumers. This was the foundation of modular JavaScript before ES Modules.",
    example: `const BankingModule = (function () {
  // Private variables and functions inaccessible from outside
  let balance = 1000;

  function logTransaction(type, amount) {
    console.log(\`[\${new Date().toISOString()}] \${type}: $\${amount}\`);
  }

  // Exposed Public API
  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Invalid deposit amount");
      balance += amount;
      logTransaction("DEPOSIT", amount);
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
})();

console.log(BankingModule.deposit(250)); // 1250
console.log(BankingModule.getBalance()); // 1250
console.log(BankingModule.balance);       // undefined (Encapsulated!)`,
    explanation: "The module pattern guarantees that external code cannot corrupt the internal `balance` variable without going through the validated `deposit` method.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "Can closures cause memory leaks and how do you prevent them?",
    answer: "Yes. Because closures hold live references to their outer enclosing scope, any variables captured in that scope cannot be garbage collected as long as the closure itself remains referenced.\n\nIf a closure captures large data structures (buffers, large arrays, DOM elements) and is attached to long-lived objects (like global event listeners or `setInterval` timers), the captured memory will leak.",
    example: `function setupEventListener() {
  const heavyDataBuffer = new Array(1000000).fill("heavy_payload");
  const button = document.getElementById("action-btn");

  const handleClick = () => {
    // Closure holds reference to heavyDataBuffer!
    console.log("Button clicked, buffer length:", heavyDataBuffer.length);
  };

  button.addEventListener("click", handleClick);

  // Return teardown function to clean up listener and allow Garbage Collection
  return function teardown() {
    button.removeEventListener("click", handleClick);
  };
}

const cleanup = setupEventListener();
// Call cleanup() when component unmounts to prevent memory leaks!`,
    explanation: "Removing event listeners and clearing intervals severs the reference to the closure, allowing the JavaScript Garbage Collector to reclaim the retained memory.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the Scope Chain and how does JavaScript resolve variable references?",
    answer: "The Scope Chain is the hierarchical sequence of scopes that the JavaScript engine traverses when resolving an identifier.\n\nWhen a variable is evaluated, JavaScript first checks the **Local Scope**. If not found, it checks the outer enclosing scope, continuing up the chain until it reaches the **Global Scope**. If the variable is still not found, it throws a `ReferenceError`.",
    example: `const level1 = "Global";

function scopeA() {
  const level2 = "Outer Function";

  function scopeB() {
    const level3 = "Inner Function";
    // Scope Chain: scopeB (Local) -> scopeA -> Global
    console.log(level3); // Found in Local Scope
    console.log(level2); // Found in scopeA
    console.log(level1); // Found in Global Scope
    // console.log(unknownVar); // Throws ReferenceError!
  }

  scopeB();
}

scopeA();`,
    explanation: "Scope resolution is strictly one-way (inside to outside). Outer scopes cannot access variables defined inside inner child scopes.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is Variable Shadowing in JavaScript scopes?",
    answer: "Variable Shadowing occurs when an inner scope declares a variable with the exact same name as an outer scope variable.\n\nWithin that inner scope, the inner variable 'shadows' (hides) the outer variable. Once execution leaves the inner scope, the outer variable becomes accessible again.",
    example: `const username = "AlexGlobal";

function displayUser() {
  const username = "AlexLocal"; // Shadows outer 'username'
  console.log("Inside function:", username); // "AlexLocal"

  if (true) {
    const username = "AlexBlock"; // Shadows function-level 'username'
    console.log("Inside block:", username); // "AlexBlock"
  }
}

displayUser();
console.log("In global scope:", username); // "AlexGlobal"`,
    explanation: "While variable shadowing is valid syntax, excessive shadowing can make code confusing. Use distinct descriptive variable names to maintain clarity.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How is Function Currying implemented using closures in modern JavaScript?",
    answer: "Currying is a functional programming technique where a function with multiple arguments is transformed into a sequence of unary functions (functions taking one argument at a time).\n\nEach returned nested function forms a closure over the previously passed arguments, storing them in memory until all required arguments are collected, at which point the final computation is executed.",
    example: `// Curried logger using closures
const createLogger = (serviceName) => (logLevel) => (message) => {
  const timestamp = new Date().toISOString();
  console.log(\`[\${timestamp}] [\${serviceName}] [\${logLevel.toUpperCase()}]: \${message}\`);
};

// Partially configuring the logger
const authLogger = createLogger("AuthService");
const authErrorLogger = authLogger("error");
const authInfoLogger = authLogger("info");

// Reusable calls with closed-over service & level
authInfoLogger("User logged in successfully (UID: 4892)");
authErrorLogger("Invalid password attempt for admin account");`,
    explanation: "Currying leverages closures to preserve context across multiple invocations, enabling clean function composition, point-free programming, and reusable partial configurations.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How do closures enable Partial Application of functions, and how does it differ from Currying?",
    answer: "Partial Application fixes a subset of a function's arguments upfront and returns a new function that accepts the remaining arguments.\n\nWhile currying transforms an N-ary function into N nested 1-argument functions, partial application can fix any number of arguments at once. Closures hold the preset arguments in their lexical scope.",
    example: `// Generic partial application helper
function partial(fn, ...presetArgs) {
  return function (...remainingArgs) {
    // Closure retains presetArgs
    return fn(...presetArgs, ...remainingArgs);
  };
}

const calculateTotal = (taxRate, discount, price) => {
  return (price - discount) * (1 + taxRate);
};

// Partially apply standard tax (8%) and loyalty discount ($10)
const calculateStoreTotal = partial(calculateTotal, 0.08, 10);

console.log("Item A Total: $" + calculateStoreTotal(100).toFixed(2)); // (100-10)*1.08 = $97.20
console.log("Item B Total: $" + calculateStoreTotal(250).toFixed(2)); // (250-10)*1.08 = $259.20`,
    explanation: "Closures retain presetArgs across all invocations of calculateStoreTotal, avoiding the need to pass repetitive configuration arguments throughout your application.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How does the Factory Function pattern use closures to create stateful objects without class or this?",
    answer: "Factory functions return new object literals with methods that close over local variables declared within the factory's body.\n\nThis pattern provides true private variables (encapsulation) without relying on the ES private #field syntax or worrying about the dynamic binding quirks of the this keyword, making methods safe to pass directly as callbacks.",
    example: `function createUserSession(username, initialRole = "guest") {
  // Completely private state - inaccessible from outside
  let role = initialRole;
  let lastActive = Date.now();

  return {
    getUsername: () => username,
    getRole: () => role,
    promoteToAdmin: (authSecret) => {
      if (authSecret === "SUPER_SECRET_KEY") {
        role = "admin";
        lastActive = Date.now();
        return "Promoted successfully";
      }
      throw new Error("Unauthorized");
    },
    touch: () => { lastActive = Date.now(); },
    getLastActive: () => new Date(lastActive).toLocaleTimeString()
  };
}

const session = createUserSession("dev_tamil");
console.log(session.getUsername()); // "dev_tamil"
console.log(session.getRole());     // "guest"
console.log(session.role);          // undefined (True privacy!)`,
    explanation: "Because methods don't use this, you can safely pass session.getUsername directly into map, setTimeout, or React props without breaking context.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is an IIFE (Immediately Invoked Function Expression) and how does it prevent global namespace pollution?",
    answer: "An IIFE is a function that runs immediately as soon as it is defined: `(function() { ... })();`.\n\nVariables declared inside an IIFE exist solely within its own local execution scope. Before ES6 modules and let/const, IIFEs were the primary mechanism in JavaScript to avoid polluting the global window object and preventing collision of third-party libraries.",
    example: `// Global scope remains clean
const myApp = (function () {
  // Private helper constants and counters
  const API_ENDPOINT = "https://api.example.com/v1";
  let requestCounter = 0;

  function trackRequest() {
    requestCounter++;
    console.log(\`Total API calls made: \${requestCounter}\`);
  }

  return {
    async fetchMetrics() {
      trackRequest();
      return { endpoint: API_ENDPOINT, status: "healthy" };
    }
  };
})();

// Outside code cannot access requestCounter or API_ENDPOINT directly
myApp.fetchMetrics();
// console.log(API_ENDPOINT); // ReferenceError: API_ENDPOINT is not defined`,
    explanation: "IIFEs leverage JavaScript's function scope boundary to isolate internal state, preventing namespace clashes in large scripts and libraries.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How do closures power Event Listeners and Callbacks with contextual state?",
    answer: "In GUI and web development, event listeners are executed asynchronously when user events occur (clicks, inputs, scrolls). Closures allow event callback functions to retain access to the parameters, IDs, and state of the component or loop where the listener was initially registered.",
    example: `function attachButtonHandlers(buttons) {
  buttons.forEach((btn, index) => {
    let clickCount = 0; // Each button maintains its own closed-over counter

    btn.addEventListener("click", () => {
      clickCount++;
      console.log(\`Button #\${index} (id: \${btn.id}) clicked \${clickCount} time(s).\`);
      
      if (clickCount >= 3) {
        btn.disabled = true;
        console.log(\`Button #\${index} disabled after maximum clicks reached.\`);
      }
    });
  });
}`,
    explanation: "Each button's callback closes over both index and its own private clickCount, maintaining independent per-element state across multiple user clicks.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the Memoization pattern and how do closures cache expensive function computations?",
    answer: "Memoization is an optimization technique that caches the return values of expensive pure function calls based on their input arguments.\n\nA closure provides a persistent, private cache object (such as a JavaScript Map or object dictionary) that outlives the memoized function invocations without polluting outer scopes.",
    example: `function memoize(fn) {
  const cache = new Map(); // Private cache retained across calls via closure

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(\`⚡ Cache Hit for args: \${key}\`);
      return cache.get(key);
    }

    console.log(\`⚙️ Cache Miss - Computing for args: \${key}\`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive recursive Fibonacci
const fib = memoize((n) => {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.log(fib(20)); // Instant calculation via cached sub-problems
console.log(fib(20)); // Instant cache hit!`,
    explanation: "The inner wrapper function preserves access to cache in its lexical scope, delivering O(1) lookups for subsequent calls with identical arguments.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What are the key differences between Lexical Scope and Dynamic Scope?",
    answer: "• Lexical Scope (Static Scope): Scope is resolved based on where functions and variables are physically declared in the source code at compile/parse time. JavaScript uses Lexical Scope exclusively.\n• Dynamic Scope: Scope is resolved based on the call stack at runtime (who called the function). In dynamically scoped languages, an inner function accesses variables of the caller rather than where it was written.",
    example: `const value = "GLOBAL";

function printValue() {
  // In Lexical Scoping (JS): looks up 'value' where printValue was defined -> "GLOBAL"
  // In Dynamic Scoping: would look up 'value' where printValue was CALLED -> "LOCAL"
  console.log(value);
}

function callerFunction() {
  const value = "LOCAL";
  printValue(); // Calls printValue
}

callerFunction(); // Outputs: "GLOBAL" in JavaScript`,
    explanation: "Lexical scoping ensures predictability: you can inspect a function's declarations statically in your code editor and know exactly which variables it can access regardless of runtime call sequences.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How does the V8 / modern JavaScript engine optimize memory allocation for unused variables in closures?",
    answer: "Modern JavaScript engines (like Google Chrome's V8, SpiderMonkey, and JavaScriptCore) analyze scopes during compilation.\n\nIf a parent function declares 10 local variables, but the returned closure only references one of them, the engine's optimizer will avoid capturing the unreferenced variables whenever possible. However, if two closures share the same lexical scope and one accesses an object, the shared scope object may keep both alive, which developers must remain mindful of.",
    example: `function createLeakyClosureScenario() {
  const giantBuffer = new Uint8Array(50000000); // 50MB
  const smallMetadata = "User_12345";

  // Optimization: If closure ONLY uses smallMetadata:
  return function getMetadata() {
    return smallMetadata; // V8 will optimize out giantBuffer from the closure context!
  };
}

const getMeta = createLeakyClosureScenario();
console.log(getMeta()); // "User_12345"
// giantBuffer is eligible for Garbage Collection because getMetadata doesn't touch it.`,
    explanation: "Never keep unnecessary references to huge data structures inside functions that return long-lived closures. Nullify them or isolate the closure in a narrower scope.",
    moduleSlug: "closures-scope",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How does the JavaScript Event Loop coordinate the Call Stack, Microtasks, and Macrotasks?",
    answer:
      "JavaScript is single-threaded, meaning it has a single call stack that executes one operation at a time. The Event Loop continuously monitors the call stack and task queues to enable non-blocking asynchronous I/O.\n\nExecution order:\n1. Synchronous code on the Call Stack runs to completion.\n2. When the stack is empty, the Event Loop flushes the entire **Microtask Queue** (Promise callbacks, `queueMicrotask`, `process.nextTick`).\n3. The browser performs UI rendering if necessary.\n4. The Event Loop picks and executes the oldest task from the **Macrotask Queue** (`setTimeout`, `setInterval`, I/O callbacks).\n5. The cycle repeats continuously.",
    example: `console.log("1: Synchronous start");

setTimeout(() => {
  console.log("4: Macrotask (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Microtask (Promise)");
});

console.log("2: Synchronous end");

// Output Order:
// 1: Synchronous start
// 2: Synchronous end
// 3: Microtask (Promise)
// 4: Macrotask (setTimeout)`,
    explanation:
      "Even though `setTimeout` has a 0ms delay, it is queued as a macrotask. All microtasks (like Promise `.then`) are guaranteed to drain completely before the next macrotask runs.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the Call Stack in JavaScript and what causes a 'Maximum call stack size exceeded' error?",
    answer: "The Call Stack is a LIFO (Last In, First Out) data structure that keeps track of the currently executing function contexts in the single-threaded JavaScript runtime.\n\nEvery time a function is called, a new execution frame is pushed onto the stack. When the function returns, its frame is popped off.\n\nA RangeError: Maximum call stack size exceeded (stack overflow) occurs when functions call each other recursively without a valid terminating base case, exceeding the memory limit allocated for stack frames.",
    example: `// ❌ Stack overflow: Unbounded recursion fills the call stack
function infiniteRecursion(count = 0) {
  return infiniteRecursion(count + 1); // Never returns!
}

// infiniteRecursion(); // RangeError: Maximum call stack size exceeded (~10,000 frames in V8)

// ✅ Solution: Iterative loop preserves a single constant stack frame
function safeFactorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result; // O(1) stack frames
}

console.log("Safe Factorial(5):", safeFactorial(5)); // 120`,
    explanation: "The call stack is synchronous and fixed in size. To handle massive recursive trees, use iterative loops or break the recursion into macrotasks using setTimeout or queueMicrotask.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is the exact execution priority between Microtasks (Promise.then) and Macrotasks (setTimeout)?",
    answer: "The execution order in every Event Loop tick is strictly defined:\n1. Execute all synchronous code currently on the Call Stack.\n2. When the Call Stack empties, flush all pending microtasks in the Microtask Queue one by one until the queue is completely empty (including microtasks queued by other microtasks during this flush).\n3. Allow the browser to perform render/paint steps if due.\n4. Take exactly one macrotask from the Macrotask Queue and push its callback onto the Call Stack.\n5. Repeat the loop.",
    example: `console.log("1: Start (Sync)");

setTimeout(() => {
  console.log("5: Macrotask 1 (setTimeout)");
  Promise.resolve().then(() => console.log("6: Microtask inside Macrotask"));
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3: Microtask 1");
    return "Microtask 2";
  })
  .then((msg) => {
    console.log("4:", msg);
  });

console.log("2: End (Sync)");

// Execution Order:
// 1: Start (Sync)
// 2: End (Sync)
// 3: Microtask 1
// 4: Microtask 2
// 5: Macrotask 1 (setTimeout)
// 6: Microtask inside Macrotask`,
    explanation: "Microtasks always preempt macrotasks. All microtasks drain completely before the runtime picks up the next macrotask.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "Why doesn't setTimeout(fn, 0) execute immediately after 0 milliseconds?",
    answer: "There are two main reasons:\n\n1. Event Loop Macrotask Queuing: setTimeout(fn, 0) does not run synchronously on the call stack. Instead, the timer Web API schedules the callback to be added to the macrotask queue. It must wait until the call stack finishes running all current synchronous code AND all pending microtasks before it can be picked up.\n2. Browser Timer Clamping: The HTML5 specification mandates a minimum 4ms delay clamp for nested setTimeout calls that exceed a nesting depth of 5.",
    example: `console.log("A: Beginning");

const timerStart = performance.now();
setTimeout(() => {
  const elapsed = performance.now() - timerStart;
  console.log(\`D: setTimeout(0) executed after \${elapsed.toFixed(2)}ms\`);
}, 0);

// Simulate heavy synchronous task blocking the main thread
for (let i = 0; i < 1e7; i++) {
  // Heavy computation blocks Call Stack
}

console.log("B: Heavy sync loop finished");

// Output Order:
// A: Beginning
// B: Heavy sync loop finished
// D: setTimeout(0) executed after ~15-30ms (Delayed by blocking sync code!)`,
    explanation: "The delay in setTimeout(fn, delay) represents the minimum time before the task is queued, NOT the exact time the function will execute.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How does queueMicrotask() work and when should you use it over Promise.resolve().then() or setTimeout()?",
    answer: "queueMicrotask(callback) is a standardized JavaScript API that queues a callback directly onto the microtask queue without the overhead of creating, wrapping, and rejecting a Promise instance.\n\nUse cases:\n• When you need to defer an action until immediately after the current synchronous execution context concludes, but before any UI rendering, repaint, or macrotask executes.\n• For consistent API behavior when a function could return synchronously in cache hits but asynchronously on misses.",
    example: `function logUserAction(action) {
  console.log("1. Recording user action synchronously:", action);

  // Schedules callback into microtask queue without Promise overhead
  queueMicrotask(() => {
    console.log("3. Microtask telemetry flush for:", action);
  });

  console.log("2. Sync method completed.");
}

logUserAction("LOGIN_CLICK");
// Output:
// 1. Recording user action synchronously: LOGIN_CLICK
// 2. Sync method completed.
// 3. Microtask telemetry flush for: LOGIN_CLICK`,
    explanation: "queueMicrotask() provides lower memory and CPU overhead than Promise.resolve().then(), and executes before UI paints unlike setTimeout.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How does async/await syntax map to Microtasks in the Event Loop?",
    answer: "Under the hood, an async function is syntactic sugar over native Promises and generator coroutines.\n\nWhen the JavaScript engine hits an await promise expression:\n1. It evaluates the expression to the right of await.\n2. It pauses execution of the async function and exits its call stack frame.\n3. The rest of the function (the continuation) is scheduled as a microtask triggered when the awaited Promise resolves.\n4. Synchronous code following the async function call continues running.",
    example: `async function fetchAccount() {
  console.log("2: Inside async before await");
  
  await Promise.resolve(); // Pauses here and yields to call stack!
  
  console.log("4: Inside async after await (Resumed as microtask)");
}

console.log("1: Before calling async function");
fetchAccount();
console.log("3: After calling async function (Sync continued)");

// Output Order:
// 1: Before calling async function
// 2: Inside async before await
// 3: After calling async function (Sync continued)
// 4: Inside async after await (Resumed as microtask)`,
    explanation: "Code up to the first await runs synchronously. Code after await is queued as a microtask callback.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What happens when long-running synchronous code blocks the Event Loop, and how do you resolve it?",
    answer: "Because JavaScript runs on a single main thread, any CPU-heavy synchronous loop or calculation completely freezes the Call Stack.\n\nWhile the stack is occupied:\n• The Event Loop cannot tick.\n• Microtasks and macrotasks cannot run.\n• User input (clicks, typing, scrolling) is dropped or queued.\n• Browser animations and UI repaints freeze (the 'Page Unresponsive' dialog appears).\n\nSolutions:\n1. Break heavy computations into chunks using setTimeout, requestIdleCallback, or scheduler.yield().\n2. Offload calculations to a Web Worker.",
    example: `// Chunking a heavy task across event loop turns
function processLargeArrayInChunks(items, processItem, chunkSize = 1000) {
  let index = 0;

  function doChunk() {
    const end = Math.min(index + chunkSize, items.length);
    for (; index < end; index++) {
      processItem(items[index]);
    }

    if (index < items.length) {
      // Yield control back to Event Loop so UI stays responsive
      setTimeout(doChunk, 0);
    } else {
      console.log("All chunks successfully processed without freezing UI!");
    }
  }

  doChunk();
}`,
    explanation: "Yielding back to the event loop using setTimeout(doChunk, 0) allows the browser to process clicks, animations, and repaints between chunks.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How does requestAnimationFrame (rAF) fit into the Browser Event Loop and rendering pipeline?",
    answer: "requestAnimationFrame(callback) schedules a callback to execute right before the browser's next screen repaint (typically 60Hz or 120Hz, every 16.6ms or 8.3ms).\n\nUnlike setTimeout which is a macrotask scheduled by timer clocks with inaccurate drift, rAF callbacks are tightly synchronized with the monitor's vertical sync (VSync) refresh rate, preventing screen tearing, stuttering, and dropped frames during animations.",
    example: `let position = 0;
const box = document.getElementById("animated-box");

function animateBox() {
  position += 2;
  if (box) box.style.transform = \`translateX(\${position}px)\`;

  if (position < 400) {
    // Synchronized with display refresh rate before next paint
    requestAnimationFrame(animateBox);
  }
}

requestAnimationFrame(animateBox);`,
    explanation: "rAF callbacks automatically pause when user switches browser tabs, saving CPU cycles and battery life compared to setInterval.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is Microtask Starvation and how can recursive microtasks freeze the browser?",
    answer: "Microtask Starvation occurs when microtasks recursively schedule additional microtasks without returning control to the Event Loop.\n\nBecause the Event Loop specification requires the microtask queue to be drained completely before moving to the rendering step or macrotask queue, an endless stream of microtasks will indefinitely lock the main thread, freezing all UI rendering and user interactions.",
    example: `// ⚠️ WARNING: Microtask starvation freezes the page completely
function starveEventLoop() {
  Promise.resolve().then(() => {
    // Endless microtask loop: Call stack empties, but microtask queue is NEVER empty!
    // starveEventLoop(); 
  });
}

// Compare with setTimeout (Macrotask):
function safeLoop() {
  setTimeout(() => {
    // Each tick allows Call Stack + Microtasks + UI Rendering to execute!
    console.log("Heartbeat - UI is not frozen");
  }, 1000);
}`,
    explanation: "Never queue unbounded recursive microtasks. Use macrotasks (setTimeout or setImmediate) when continuous asynchronous looping is necessary to allow the Event Loop to process UI repaints.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What is requestIdleCallback and how does cooperative multitasking work in modern frameworks?",
    answer: "requestIdleCallback(callback) queues a function to run during the browser's idle periods at the end of a frame, when there is spare time before the next frame deadline.\n\nModern web architectures and frameworks (like React Fiber's scheduler) use cooperative multitasking: work is divided into small units, and each unit is checked against deadline.timeRemaining(). If time expires, execution yields back to the browser.",
    example: `const analyticsQueue = ["click_btn1", "scroll_depth_50", "view_pricing"];

function flushAnalyticsWhenIdle(deadline) {
  // Run tasks as long as browser has remaining idle time in this frame
  while (deadline.timeRemaining() > 1 && analyticsQueue.length > 0) {
    const event = analyticsQueue.shift();
    console.log("Flushing telemetry during idle time:", event);
  }

  if (analyticsQueue.length > 0) {
    // Schedule remaining events for the next idle slice
    requestIdleCallback(flushAnalyticsWhenIdle);
  }
}

if (typeof window !== "undefined" && "requestIdleCallback" in window) {
  requestIdleCallback(flushAnalyticsWhenIdle);
}`,
    explanation: "Cooperative scheduling guarantees non-urgent tasks like analytics, prefetching, and logging run without degrading 60fps user interactions.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What are the core differences between the Browser Event Loop and the Node.js Event Loop?",
    answer: "• Browser Event Loop: Managed by the browser engine (Chromium, WebKit, Gecko). Focuses on user interactions, DOM layout, CSS rendering pipelines, rAF, and single Macrotask / Microtask queues.\n• Node.js Event Loop: Powered by the libuv C library. Has no DOM or rendering steps. Instead, it is partitioned into distinct phases executed in a strict round-robin sequence:\n  1. Timers: Executes callbacks from setTimeout & setInterval.\n  2. Pending Callbacks: Executes I/O callbacks deferred from previous loops.\n  3. Idle/Prepare: Internal libuv phase.\n  4. Poll: Retrieves new I/O events (network sockets, disk I/O).\n  5. Check: Executes setImmediate() callbacks.\n  6. Close Callbacks: Handles socket closures (e.g. socket.on('close')).",
    example: `// Node.js specific phase demonstration
const fs = require("fs");

setTimeout(() => console.log("1: Timers Phase (setTimeout)"), 0);

setImmediate(() => console.log("2: Check Phase (setImmediate)"));

fs.readFile(__filename, () => {
  // Inside I/O cycle, Check phase ALWAYS runs before Timers phase
  setTimeout(() => console.log("4: Nested Timer"), 0);
  setImmediate(() => console.log("3: Nested Immediate"));
});`,
    explanation: "In Node.js, setImmediate is designed to execute in the Check phase right after the Poll phase, while setTimeout runs in the Timers phase.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "In Node.js, what is the difference between process.nextTick() and setImmediate()?",
    answer: "Despite their names, their timings are counter-intuitive:\n\n• process.nextTick(): Does NOT belong to the libuv event loop phases. It runs on a dedicated high-priority queue immediately after the current operation finishes on the call stack, before the event loop proceeds to any other phase or microtask.\n• setImmediate(): Runs in the libuv Check phase of the event loop after the Poll (I/O) phase.",
    example: `console.log("1: Synchronous start");

setImmediate(() => {
  console.log("4: setImmediate (Check phase)");
});

Promise.resolve().then(() => {
  console.log("3: Promise microtask");
});

process.nextTick(() => {
  console.log("2: process.nextTick (Runs before Promise microtasks!)");
});

console.log("1b: Synchronous end");

// Node.js Output Order:
// 1: Synchronous start
// 1b: Synchronous end
// 2: process.nextTick
// 3: Promise microtask
// 4: setImmediate`,
    explanation: "process.nextTick() has higher priority than standard Promise microtasks, making it the fastest deferred execution mechanism in Node.js.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How do Web Workers enable multi-threading without blocking the main Event Loop?",
    answer: "Web Workers run scripts in background threads completely isolated from the main thread. A worker has its own dedicated Call Stack, Event Loop, and memory space.\n\nBecause workers do not share memory by default and cannot access the DOM or window object directly, they prevent race conditions. Communication happens safely via message passing (postMessage and onmessage) or shared zero-copy ArrayBuffer transfers.",
    example: `// main.js (Main Thread)
const worker = new Worker("worker.js");

console.log("1: Main thread sends heavy computation task");
worker.postMessage({ numbers: [5000000, 3000000, 8000000] });

worker.onmessage = function (event) {
  console.log("3: Result received from Web Worker:", event.data.sum);
};

console.log("2: Main thread continues smoothly (UI remains 60fps responsive!)");

// worker.js (Background Thread)
// self.onmessage = function (e) {
//   const sum = e.data.numbers.reduce((acc, n) => acc + n, 0);
//   self.postMessage({ sum });
// };`,
    explanation: "Web Workers offload heavy computations (image processing, crypto, parsing big JSON) so the main UI event loop never stutters.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "How do you systematically predict console output order for complex nested asynchronous code in interview questions?",
    answer: "Follow this 4-step mental algorithm:\n1. Step 1 (Synchronous): Run all synchronous code top to bottom. When encountering new Promise(executor), execute executor synchronously! When encountering .then(), register the callback into the Microtask Queue.\n2. Step 2 (Timers/Macrotasks): When encountering setTimeout, register it with the Web API timer, and schedule its callback into the Macrotask Queue.\n3. Step 3 (Drain Microtasks): As soon as the call stack is empty, execute all microtasks in FIFO order. If a microtask schedules another microtask, run it before any macrotask.\n4. Step 4 (Macrotask Turn): Take the first macrotask, run it, and go back to Step 1.",
    example: `console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
}, 0);

new Promise((resolve) => {
  console.log("4"); // Synchronous executor!
  resolve();
}).then(() => {
  console.log("5");
});

console.log("6");

// Step 1: Sync logs "1", queues setTimeout (macrotask), logs "4", queues .then (microtask), logs "6"
// Step 2: Call stack empty -> Drain Microtasks -> logs "5"
// Step 3: Run first Macrotask -> logs "2", queues microtask -> logs "3"
// Final Output: 1, 4, 6, 5, 2, 3`,
    explanation: "Remember: the Promise constructor executor function executes synchronously immediately; only the .then() callbacks are deferred to microtasks.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question: "What are the best practices for preventing Event Loop lag and maintaining 60 FPS in production applications?",
    answer: "Key production best practices:\n• Keep synchronous call stack tasks under 16ms (ideally < 5ms) to preserve 60fps.\n• Avoid deeply nested microtask chains that cause starvation.\n• Use requestAnimationFrame for DOM visual changes, not setTimeout or setInterval.\n• Debounce or throttle high-frequency events (scroll, resize, mousemove).\n• Offload heavy parsing (e.g. >10MB JSON, crypto, sorting) to Web Workers.\n• Use PerformanceObserver with longtask entry types to monitor event loop delays in real user monitoring (RUM).",
    example: `// Monitoring Event Loop Long Tasks (>50ms) in production
if (typeof window !== "undefined" && "PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.warn(
        \`🚨 Long Task detected! Duration: \${entry.duration.toFixed(2)}ms. Event loop was blocked.\`
      );
      // Send telemetry alert to Datadog / Sentry
    }
  });

  observer.observe({ entryTypes: ["longtask"] });
}`,
    explanation: "Observing longtask metrics provides proactive visibility into blocking scripts before they cause user churn.",
    moduleSlug: "event-loop-deep-dive",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How do Promises work and how does async/await simplify asynchronous control flow?",
    answer:
      "A Promise is an object representing the eventual completion or failure of an asynchronous operation, existing in one of three states: `pending`, `fulfilled`, or `rejected`.\n\n`async/await` is syntactic sugar built on top of Promises and generators. An `async` function always returns a Promise. The `await` keyword pauses function execution until the awaited Promise settles, allowing asynchronous code to be read and written sequentially with standard `try/catch` error handling.",
    example: `// Helper that simulates an async network fetch
const fetchUserData = (userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 0) resolve({ id: userId, name: "Alex" });
      else reject(new Error("Invalid User ID"));
    }, 500);
  });
};

async function loadProfile(id) {
  try {
    console.log("Fetching user...");
    const user = await fetchUserData(id); // Pauses until resolved
    console.log("User retrieved:", user.name);
    return user;
  } catch (error) {
    console.error("Failed to load user:", error.message);
  } finally {
    console.log("Operation finished.");
  }
}

loadProfile(1);`,
    explanation:
      "`await` unwraps the resolved Promise value directly into `user`. If the Promise rejects, execution jumps straight to the `catch` block, eliminating messy `.then().catch()` nesting.",
    moduleSlug: "promises-asyncawait",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "What is prototypal inheritance and how does the prototype chain resolve properties?",
    answer:
      "Unlike classical class-based languages where classes inherit from classes, JavaScript uses prototypal inheritance: objects inherit directly from other objects.\n\nEvery JavaScript object has an internal `[[Prototype]]` link (accessible via `Object.getPrototypeOf(obj)`). When you access a property on an object, the JavaScript engine first checks the object's own properties. If not found, it walks up the prototype chain until it finds the property or reaches `null`.\n\nES6 `class` syntax is purely syntactic sugar over this prototypal mechanism.",
    example: `const animal = {
  eats: true,
  walk() {
    return "Animal is walking";
  }
};

// Create a new object with 'animal' as its prototype
const rabbit = Object.create(animal);
rabbit.jumps = true;

console.log(rabbit.jumps); // true (own property)
console.log(rabbit.eats);  // true (inherited from animal prototype)
console.log(rabbit.walk()); // "Animal is walking" (inherited method)
console.log(rabbit.fly);   // undefined (reaches top of chain: Object.prototype -> null)`,
    explanation:
      "Methods defined on prototypes are shared in memory among all instances, preventing redundant method allocations on every created object.",
    moduleSlug: "prototypal-inheritance",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How is the 'this' keyword determined in JavaScript and how do call, apply, and bind work?",
    answer:
      "The value of `this` inside a function is determined by **how the function is called** (its execution context), not where it was declared:\n\n1. Method invocation (`obj.fn()`): `this` refers to `obj`.\n2. Standalone function call (`fn()`): `this` refers to the global object (`window`/`global`), or `undefined` in strict mode.\n3. Constructor call (`new Fn()`): `this` refers to the newly instantiated instance.\n4. Arrow functions: Do not have their own `this`; they capture `this` lexically from their enclosing scope.\n\n`call` and `apply` invoke a function immediately with an explicit `this`. `bind` returns a new function with `this` permanently locked.",
    example: `const user = {
  name: "Morgan",
  greet(punctuation) {
    return \`Hello, \${this.name}\${punctuation}\`;
  }
};

const admin = { name: "Taylor" };

// 1. call: passes arguments individually
console.log(user.greet.call(admin, "!")); // "Hello, Taylor!"

// 2. apply: passes arguments as an array
console.log(user.greet.apply(admin, ["?"])); // "Hello, Taylor?"

// 3. bind: creates a new function with bound context
const boundGreet = user.greet.bind(admin, ".");
console.log(boundGreet()); // "Hello, Taylor."`,
    explanation:
      "`bind` is especially vital when passing methods as event listeners or timers, preventing `this` from detaching and defaulting to `undefined`.",
    moduleSlug: "this-keyword-binding",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "What is hoisting and how does the Temporal Dead Zone (TDZ) apply to let and const?",
    answer:
      "Hoisting is the behavior in JavaScript where variable and function declarations are registered into memory during the compilation phase before code execution starts.\n\n• Function Declarations: Completely hoisted (both identifier and implementation), allowing them to be called before declaration.\n• `var`: Hoisted and initialized to `undefined`, so accessing before declaration yields `undefined`.\n• `let` and `const`: Hoisted into their block scope but **not initialized**. The span from entering the block until the declaration is reached is the **Temporal Dead Zone (TDZ)**; accessing the variable during the TDZ throws a `ReferenceError`.",
    example: `// 1. Function declaration hoisting
console.log(calculateTotal(5, 10)); // 15 (Works!)
function calculateTotal(a, b) {
  return a + b;
}

// 2. var hoisting vs let TDZ
console.log(legacyVar); // undefined (No error, but bug-prone)
var legacyVar = "legacy";

// console.log(modernLet); // Throws ReferenceError: Cannot access 'modernLet' before initialization
let modernLet = "modern";`,
    explanation:
      "The TDZ was introduced in ES6 to catch silent bugs early by forcing developers to declare variables before referencing them.",
    moduleSlug: "hoisting-tdz",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "What is the difference between Debouncing and Throttling in JavaScript performance optimization?",
    answer:
      "Both are rate-limiting techniques for functions that execute in response to high-frequency events (like scrolling, window resizing, or keystrokes):\n\n• **Debounce**: Delays function execution until a specified delay has elapsed since the *last* invocation. If invoked again before the timer ends, the timer resets. Best for search inputs and auto-saving forms.\n• **Throttle**: Guarantees that the function executes at most once every specified time interval, regardless of how many times the event fires. Best for scroll handlers and game loops.",
    example: `// Practical Debounce implementation
function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId); // Reset timer on each trigger
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const handleSearch = debounce((query) => {
  console.log("Searching API for:", query);
}, 300);

// Typing "hello" triggers search only ONCE after typing stops for 300ms`,
    explanation:
      "Debounce avoids flooding backend APIs with every single letter typed, firing only when the user finishes their input sequence.",
    moduleSlug: "debounce-throttle",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How do map, filter, and reduce work in JavaScript and why are they considered immutable?",
    answer:
      "Array transformations using `map`, `filter`, and `reduce` are functional programming primitives that process arrays without mutating the original source array:\n\n• `map(fn)`: Transforms every element and returns a new array of identical length.\n• `filter(fn)`: Tests each element against a predicate and returns a new array containing only matching elements.\n• `reduce(fn, initial)`: Combines array elements into a single accumulated result (e.g. sum, object, or grouped array).",
    example: `const transactions = [
  { id: 1, type: "income", amount: 2000 },
  { id: 2, type: "expense", amount: 150 },
  { id: 3, type: "income", amount: 450 },
  { id: 4, type: "expense", amount: 50 }
];

// Chain filter, map, and reduce immutably
const totalIncome = transactions
  .filter((tx) => tx.type === "income")
  .map((tx) => tx.amount)
  .reduce((sum, amount) => sum + amount, 0);

console.log("Total Income:", totalIncome); // 2450
console.log("Original untouched:", transactions.length); // 4`,
    explanation:
      "Because none of these methods mutate the original `transactions` array, state predictability is preserved, eliminating unexpected side-effects.",
    moduleSlug: "array-methods-mapfilterreduce",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How do destructuring and the spread/rest operators work in modern JavaScript?",
    answer:
      "• Destructuring: Allows unpacking values from arrays or properties from objects into distinct variables with concise syntax.\n• Spread (`...`): Expands an iterable into individual elements (e.g. creating shallow copies of objects or merging arrays).\n• Rest (`...`): Collects multiple remaining elements or function arguments into a single array parameter.",
    example: `// Object destructuring with renaming and default values
const config = { host: "localhost", port: 8080 };
const { host, port, timeout = 5000 } = config;

// Rest parameters in functions
function sumAll(multiplier, ...numbers) {
  return numbers.map((n) => n * multiplier);
}
console.log(sumAll(2, 10, 20, 30)); // [20, 40, 60]

// Spread operator for shallow merging
const baseUser = { id: 1, name: "Sam" };
const updatedUser = { ...baseUser, role: "admin", updatedAt: "2026-03-01" };`,
    explanation:
      "Spread syntax provides an elegant, non-mutating way to copy and update objects without calling `Object.assign`.",
    moduleSlug: "destructuring-spreadrest",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "What is currying and how do higher-order functions enable functional composition?",
    answer:
      "A Higher-Order Function is a function that takes one or more functions as arguments, returns a function, or both.\n\n**Currying** is the functional technique of translating a function with multiple arguments into a sequence of unary functions (functions taking one argument each). Currying enables **Partial Application**, where you pre-configure common arguments to create specialized reusable functions.",
    example: `// Standard function: add(a, b)
// Curried function: a => b => a + b
const multiply = (a) => (b) => a * b;

// Create specialized utility functions
const double = multiply(2);
const triple = multiply(3);

console.log(double(10)); // 20
console.log(triple(10)); // 30

// Useful in array transformations
const numbers = [1, 2, 3, 4];
console.log(numbers.map(double)); // [2, 4, 6, 8]`,
    explanation:
      "Currying breaks complex operations into modular pipelines, allowing configuration to be supplied upfront and applied repeatedly.",
    moduleSlug: "currying-higher-order-functions",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How does Garbage Collection work in V8 and what causes memory leaks in JavaScript?",
    answer:
      "JavaScript engines like V8 use an automatic Garbage Collector (GC) based primarily on the **Mark-and-Sweep** algorithm: memory is reclaimed if an object is unreachable from any active root reference (global variables, call stack frames).\n\nCommon memory leaks occur when references are unintentionally retained:\n1. Forgotten event listeners on removed DOM elements.\n2. Uncleared `setInterval` or `setTimeout` timers.\n3. Closures retaining large unneeded outer variables.\n4. Detached DOM nodes referenced in JavaScript arrays.",
    example: `// Memory Leak Example: Forgotten timer retaining parent scope
function startMonitoring() {
  const largeDataBuffer = new Array(1000000).fill("leak_data");
  
  // LEAK: Timer runs forever in the background retaining largeDataBuffer
  const timerId = setInterval(() => {
    console.log("Checking status...");
  }, 1000);

  // FIX: Provide a clean-up method to cancel timer and allow GC
  return () => clearInterval(timerId);
}

const stop = startMonitoring();
// Later when component unmounts:
stop(); // Timer cleared, largeDataBuffer can be garbage collected!`,
    explanation:
      "Always clear timers and remove event listeners when components unmount to allow the GC to collect captured references.",
    moduleSlug: "memory-leaks-garbage-collection",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "What is the difference between ES Modules (ESM) and CommonJS (CJS)?",
    answer:
      "• CommonJS (`require` / `module.exports`): The original Node.js module system. Modules are loaded **synchronously** at runtime. Dynamic imports (`require(path)`) are supported anywhere, but static analysis for tree-shaking is difficult.\n• ES Modules (`import` / `export`): The official ECMAScript standard. Modules are parsed and loaded **asynchronously** before execution. Static module declarations enable bundlers (Webpack, Vite) to perform dead code elimination (tree-shaking).",
    example: `// 1. ES Module (ESM) syntax (Recommended)
import { readFile } from "node:fs/promises";
export async function getFileData(path) {
  return await readFile(path, "utf-8");
}

// 2. CommonJS (CJS) syntax (Legacy)
// const fs = require("node:fs");
// module.exports = { getFileData };`,
    explanation:
      'Modern Node.js and browser environments prefer ESM. Use `"type": "module"` in `package.json` to enable ESM project-wide.',
    moduleSlug: "modules-esm-vs-commonjs",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How does the Fetch API handle HTTP requests and error status codes?",
    answer:
      "The `fetch()` API makes asynchronous network requests returning a Promise that resolves to a `Response` object.\n\nCrucial Gotcha: `fetch()` **does not reject on HTTP error status codes** (like 404 or 500). It only rejects on network failures or blocked requests (CORS). You must manually check `response.ok` (which is true for 200–299 status codes).",
    example: `async function fetchPost(id) {
  try {
    const response = await fetch(\`https://jsonplaceholder.typicode.com/posts/\${id}\`, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    // Check HTTP status code
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch request failed:", error.message);
  }
}

fetchPost(1);`,
    explanation:
      "Checking `response.ok` ensures application logic correctly catches 4xx and 5xx API errors rather than attempting to parse erroneous response bodies.",
    moduleSlug: "web-apis-fetch",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "How do you create Custom Error Classes in JavaScript and why are they beneficial?",
    answer:
      "Custom error classes allow applications to classify and differentiate errors based on business logic (e.g. `ValidationError`, `AuthenticationError`, `NotFoundError`).\n\nYou create them by extending the native `Error` class, calling `super(message)`, and setting the `name` property. Handlers can then use `instanceof` to route errors appropriately.",
    example: `class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function registerUser(username) {
  if (!username) {
    throw new ValidationError("Username is required", "username");
  }
  return { username, registered: true };
}

try {
  registerUser("");
} catch (err) {
  if (err instanceof ValidationError) {
    console.error(\`Validation failed on field "\${err.field}": \${err.message}\`);
  } else {
    console.error("Unexpected error:", err);
  }
}`,
    explanation:
      "`instanceof` checks allow fine-grained error recovery: user validation errors can render a form alert, while unexpected errors trigger logging and alerts.",
    moduleSlug: "error-handling-custom-errors",
    category: "javascript",
    language: "javascript",
  },
  {
    question:
      "What are common Design Patterns in JavaScript (Singleton, Factory, Observer)?",
    answer:
      "Design patterns provide battle-tested architectural templates for common software problems:\n\n• Singleton: Guarantees a class has only one instance and provides a global access point.\n• Factory: Delegates object creation to a function without specifying the exact class.\n• Observer (Pub/Sub): An object (subject) maintains a list of subscribers and notifies them automatically of state changes.",
    example: `// Observer Pattern Implementation
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push(listener);
    return () => {
      this.events[eventName] = this.events[eventName].filter((l) => l !== listener);
    };
  }

  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => listener(data));
    }
  }
}

const emitter = new EventEmitter();
const unsubscribe = emitter.on("userLogin", (user) => console.log("Welcome,", user));
emitter.emit("userLogin", "Riley"); // Logs: "Welcome, Riley"`,
    explanation:
      "The Observer pattern decouples components: the triggering code (`emitter.emit`) has no direct knowledge or dependency on the consuming listeners.",
    moduleSlug: "design-patterns-in-js",
    category: "javascript",
    language: "javascript",
  },

  // ==========================================
  // TYPESCRIPT (15 Modules)
  // ==========================================
  {
    question:
      "What is the difference between Types and Interfaces in TypeScript?",
    answer:
      "Both `type` and `interface` define object contracts, but they differ in capabilities:\n\n• Interfaces: Can be declared multiple times to merge declarations (declaration merging). Ideal for public library APIs and standard object contracts.\n• Type Aliases: More expressive. Can represent union types (`type ID = string | number`), primitives, tuples, and mapped types. Cannot be re-opened for merging.",
    example: `// Interface declaration merging
interface User {
  id: string;
  name: string;
}
interface User {
  role: "admin" | "member"; // Automatically merged!
}

// Type alias with union & intersection
type Status = "pending" | "approved" | "rejected";
type UserWithStatus = User & { status: Status };

const activeUser: UserWithStatus = {
  id: "u_1",
  name: "Jordan",
  role: "admin",
  status: "approved"
};`,
    explanation:
      "Use `interface` for object models and public API definitions. Use `type` when union types, tuples, or complex conditional transformations are required.",
    moduleSlug: "types-interfaces",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "How do Generics work in TypeScript and how do you constrain generic types?",
    answer:
      "Generics allow writing flexible, reusable code components that work over a variety of types rather than a single one, while maintaining compile-time type safety.\n\nYou constrain generic types using the `extends` keyword, ensuring the generic argument possesses specific properties.",
    example: `// Generic constraint: T must have an 'id' property
interface HasId {
  id: string | number;
}

function findById<T extends HasId>(items: T[], targetId: string | number): T | undefined {
  return items.find((item) => item.id === targetId);
}

interface Product {
  id: number;
  title: string;
  price: number;
}

const inventory: Product[] = [{ id: 101, title: "Laptop", price: 999 }];
const item = findById(inventory, 101);
console.log(item?.title); // Fully typed as Product!`,
    explanation:
      "The generic `<T extends HasId>` guarantees that `findById` can access `item.id`, while returning the exact input type `Product` rather than losing type specificity.",
    moduleSlug: "generics",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What are essential TypeScript Utility Types (Partial, Pick, Omit, Record)?",
    answer:
      "TypeScript includes built-in utility types to transform existing types without duplication:\n\n• `Partial<T>`: Makes all properties in T optional.\n• `Required<T>`: Makes all properties in T mandatory.\n• `Pick<T, K>`: Selects a subset of keys K from T.\n• `Omit<T, K>`: Removes keys K from T.\n• `Record<K, T>`: Constructs an object type whose property keys are K and values are T.",
    example: `interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date;
}

// Omit 'id' and 'publishedAt' for creation payload
type CreateArticleDTO = Omit<Article, "id" | "publishedAt">;

// Partial for update mutations
type UpdateArticleDTO = Partial<CreateArticleDTO>;

// Record for dictionary mapping
type ArticleCache = Record<string, Article>;`,
    explanation:
      "Using utility types keeps your codebase DRY by deriving mutation, creation, and cache shapes from a single source of truth.",
    moduleSlug: "utility-types",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "How does Type Narrowing and Custom Type Guards work in TypeScript?",
    answer:
      "Type Narrowing is TypeScript's ability to refine a variable from a broader type to a more specific type using control flow analysis (`typeof`, `instanceof`, `'prop' in obj`).\n\nA **Custom Type Guard** is a function whose return type is a type predicate (`param is Type`), allowing runtime logic to safely narrow types in the compiler.",
    example: `interface Dog {
  bark(): void;
}
interface Fish {
  swim(): void;
}

// Custom Type Guard with type predicate 'pet is Fish'
function isFish(pet: Dog | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function handlePet(pet: Dog | Fish) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows 'pet' is definitely Fish
  } else {
    pet.bark(); // TypeScript knows 'pet' is definitely Dog
  }
}`,
    explanation:
      "Type guards link runtime boolean checks directly to compile-time type resolution, eliminating dangerous `any` or explicit casting.",
    moduleSlug: "type-narrowing-guards",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What is the difference between numeric Enums, string Enums, and Literal Types?",
    answer:
      "• Numeric Enums: Assign auto-incrementing numbers (0, 1, 2) and support reverse mapping. However, they can allow out-of-bounds numbers.\n• String Enums: Bind keys to explicit string values with strong readability.\n• String Literal Unions (`type Direction = 'north' | 'south'`): Lightweight, zero runtime JavaScript bundle overhead, and widely preferred in modern TypeScript.",
    example: `// String Literal Union (Zero JS runtime footprint)
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// String Enum (Generates a runtime JavaScript object)
enum UserRole {
  Admin = "ADMIN",
  Editor = "EDITOR",
  Viewer = "VIEWER"
}

function sendRequest(url: string, method: HttpMethod, role: UserRole) {
  console.log(\`Sending \${method} to \${url} for \${role}\`);
}`,
    explanation:
      "Literal unions disappear completely during compilation into JavaScript, resulting in smaller bundles while preserving strict type safety.",
    moduleSlug: "enums-literal-types",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "How do Mapped Types and Conditional Types work in advanced TypeScript?",
    answer:
      "• Mapped Types: Create new types by iterating over keys using `[K in keyof T]`.\n• Conditional Types: Express type relationships based on conditions using the ternary syntax `T extends U ? X : Y`.",
    example: `// Mapped type: Make all fields readonly and nullable
type NullableReadonly<T> = {
  readonly [K in keyof T]: T[K] | null;
};

// Conditional type: Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : T;

type NumberList = number[];
type SingleNum = ElementType<NumberList>; // resolved to: number`,
    explanation:
      "Conditional types with `infer` allow pulling internal types out of complex wrapper structures like Promises, functions, and arrays.",
    moduleSlug: "mapped-conditional-types",
    category: "typescript",
    language: "typescript",
  },
  {
    question: "How do Decorators work in TypeScript (Stage 3 vs experimental)?",
    answer:
      "Decorators are functions applied to classes, methods, accessors, or properties to observe or modify their behavior. TypeScript supports ECMAScript Stage 3 standard decorators.",
    example: `function logged(target: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  return function (this: any, ...args: any[]) {
    console.log(\`Entering method: \${methodName}\`);
    const result = target.apply(this, args);
    console.log(\`Exiting method: \${methodName}\`);
    return result;
  };
}

class PaymentProcessor {
  @logged
  charge(amount: number) {
    return \`Charged $\${amount}\`;
  }
}`,
    explanation:
      "The `@logged` decorator wraps the `charge` method transparently, providing aspect-oriented logging without modifying the core business logic.",
    moduleSlug: "decorators",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What is the difference between ES Modules and Namespaces in TypeScript?",
    answer:
      "• Namespaces: Legacy TypeScript feature (`namespace MySpace { ... }`) designed before ES6 had a module standard. They pollute global scope or require complex bundling flags.\n• ES Modules: The standard (`import`/`export`). Code is isolated per file. Always prefer ES Modules in modern TypeScript projects.",
    example: `// Prefer ES Modules
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
}

export function formatResponse<T>(data: T): ApiResponse<T> {
  return { data, statusCode: 200 };
}`,
    explanation:
      "Standard ES Modules enable tree-shaking, static analysis, and direct interoperability with modern bundlers and runtime engines.",
    moduleSlug: "modules-namespaces",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What are the most critical tsconfig.json compiler options for production safety?",
    answer:
      "Essential compiler options for strict production reliability:\n\n• `strict: true`: Enables all strict type-checking options.\n• `noImplicitAny: true`: Forbids variables with undeclared `any` types.\n• `strictNullChecks: true`: Guarantees `null` and `undefined` are not assignable to other types unless explicitly unioned.\n• `noUncheckedIndexedAccess: true`: Adds `undefined` to index access lookups (e.g. `array[0]`).",
    example: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true
  }
}`,
    explanation:
      "Enabling `noUncheckedIndexedAccess` prevents runtime `TypeError: Cannot read properties of undefined` bugs when accessing array elements that might not exist.",
    moduleSlug: "tsconfig-deep-dive",
    category: "typescript",
    language: "json",
  },
  {
    question:
      "How does Type Inference work in TypeScript and when should you omit explicit annotations?",
    answer:
      "TypeScript's compiler automatically infers types based on variable initializers, return values, and contextual usage. Writing redundant type annotations clutters code without adding safety.",
    example: `// 1. Inferred automatically as 'string' (no need for ': string')
let userGreeting = "Welcome back!";

// 2. Return type automatically inferred as 'number'
const addNumbers = (a: number, b: number) => a + b;

// 3. 'as const' infers literal types and readonly arrays
const ROLES = ["admin", "editor", "guest"] as const;
type Role = typeof ROLES[number]; // "admin" | "editor" | "guest"`,
    explanation:
      "Using `as const` instructs TypeScript to infer the narrowest possible literal types and mark array elements as `readonly`.",
    moduleSlug: "type-inference",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What are Discriminated Unions and how do they enable exhaustive pattern matching?",
    answer:
      "A Discriminated Union (or Tagged Union) is a pattern where multiple object types share a common literal discriminator property (e.g. `type`, `kind`, `status`).\n\nTypeScript uses this discriminator to narrow the exact type in `switch` statements and enforce exhaustive checking via the `never` type.",
    example: `type NetworkState =
  | { state: "loading" }
  | { state: "success"; response: string }
  | { state: "failed"; code: number };

function renderNetwork(status: NetworkState) {
  switch (status.state) {
    case "loading":
      return "Loading spinner...";
    case "success":
      return \`Data: \${status.response}\`;
    case "failed":
      return \`Error code: \${status.code}\`;
    default:
      // Exhaustiveness check: fails compilation if any state is unhandled
      const _exhaustiveCheck: never = status;
      return _exhaustiveCheck;
  }
}`,
    explanation:
      "If a developer adds a new state (like `{ state: 'idle' }`), TypeScript immediately produces a compile-time error at the `default` branch until it is handled.",
    moduleSlug: "discriminated-unions",
    category: "typescript",
    language: "typescript",
  },
  {
    question: "How do Function Overloads work in TypeScript?",
    answer:
      "Function overloads allow defining multiple function signatures for different argument counts or types, backed by a single shared implementation function.",
    example: `// Overload signatures
function parseInput(input: string): string[];
function parseInput(input: number): number[];

// Single implementation signature (must be compatible with all overloads)
function parseInput(input: string | number): (string | number)[] {
  if (typeof input === "string") {
    return input.split("");
  }
  return [input];
}

const chars = parseInput("hello"); // Type is string[]
const nums = parseInput(42);       // Type is number[]`,
    explanation:
      "Callers get precise return types based on their input argument types, preventing ambiguous `string[] | number[]` return unions.",
    moduleSlug: "function-overloads",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "How do Index Signatures work in TypeScript and what are their safety limitations?",
    answer:
      "Index signatures define types for objects where property names are not known upfront, but the value types are known.\n\nHowever, standard index signatures assume every key returns a valid value, which can cause runtime crashes if a key is missing. Pair with `Record` or enable `noUncheckedIndexedAccess`.",
    example: `// Index signature for dynamic error messages
interface FormErrors {
  [fieldName: string]: string | undefined;
}

const errors: FormErrors = {
  email: "Invalid email format"
};

// Safe access
if (errors.password) {
  console.log(errors.password.toUpperCase());
}`,
    explanation:
      "Declaring `string | undefined` forces code to verify property existence before calling methods, eliminating runtime crashes.",
    moduleSlug: "index-signatures",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What is Declaration Merging and when is it useful in TypeScript?",
    answer:
      "Declaration Merging occurs when the TypeScript compiler merges two separate declarations with the exact same name into a single definition.\n\nIt is commonly used to extend third-party library types or augment global scopes (e.g. adding custom properties to `window` or Express `Request`).",
    example: `// Augment the global Express Request object
declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        email: string;
      };
    }
  }
}

// In an Express handler:
// req.currentUser.id is now fully recognized by TypeScript!`,
    explanation:
      "Declaration merging allows safely extending external types without modifying node_modules source files.",
    moduleSlug: "declaration-merging",
    category: "typescript",
    language: "typescript",
  },
  {
    question:
      "What are best practices for strict type safety and avoiding 'any' in TypeScript?",
    answer:
      "1. Replace `any` with `unknown` for values of unknown origin, forcing type validation before use.\n2. Enable `strict: true` in tsconfig.\n3. Use `as const` for immutable lookup arrays.\n4. Avoid type assertions (`as Type`) unless interfacing with dynamic DOM APIs or legacy code.\n5. Leverage Discriminated Unions for state management.",
    example: `// UNHEALTHY: Bypasses compiler
function parseBad(raw: any) {
  return raw.toUpperCase(); // Runtime crash if raw is not string!
}

// HEALTHY: Forces type guard check
function parseSafe(raw: unknown): string {
  if (typeof raw === "string") {
    return raw.toUpperCase(); // Safe!
  }
  throw new Error("Expected string input");
}`,
    explanation:
      "Using `unknown` instead of `any` ensures that all dynamic runtime inputs are safely validated before operations are performed.",
    moduleSlug: "strict-mode-type-safety",
    category: "typescript",
    language: "typescript",
  },

  // ==========================================
  // PYTHON (15 Modules)
  // ==========================================
  {
    question:
      "How do List, Dict, and Set Comprehensions work in Python and when should they be avoided?",
    answer:
      "Comprehensions provide a concise syntactic way to build new sequences from existing iterables. They are faster than manual `for` loops because the looping bytecode executes directly in optimized C.\n\nAvoid them when the logic has complex nested conditions or multiple side effects, which impairs readability.",
    example: `# 1. List Comprehension with filtering
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
evens_squared = [n ** 2 for n in numbers if n % 2 == 0]
# [4, 16, 36, 64, 100]

# 2. Dict Comprehension
users = [("u1", "Alice"), ("u2", "Bob")]
user_lookup = {uid: name for uid, name in users}
# {'u1': 'Alice', 'u2': 'Bob'}

# 3. Set Comprehension (Automatic Deduplication)
words = ["apple", "banana", "apple", "cherry"]
unique_lengths = {len(w) for w in words}
# {5, 6}`,
    explanation:
      "Comprehensions express mapping and filtering declaratively in a single readable line without temporary variable allocation.",
    moduleSlug: "list-comprehensions",
    category: "python",
    language: "python",
  },
  {
    question: "How do Decorators and Generators operate in Python?",
    answer:
      "• Decorator: A function that takes another function as an argument, extends or alters its behavior, and returns a callable. Used for logging, authentication, and memoization.\n• Generator: A function containing `yield`. Instead of returning all elements at once into memory, it returns an iterator that lazily produces elements on demand, conserving RAM.",
    example: `import time
from functools import wraps

# Decorator to measure execution time
def timeit(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        duration = time.perf_counter() - start
        print(f"{func.__name__} took {duration:.4f}s")
        return result
    return wrapper

# Generator producing infinite sequence lazily
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

@timeit
def calculate_fib():
    gen = fibonacci()
    return [next(gen) for _ in range(10)]

print(calculate_fib()) # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
    explanation:
      "Using `@wraps(func)` preserves function metadata (like `__name__` and docstrings). The `fibonacci` generator consumes virtually zero memory even for infinite streams.",
    moduleSlug: "decorators-generators",
    category: "python",
    language: "python",
  },
  {
    question:
      "What are the core OOP principles in Python (Inheritance, Polymorphism, super())?",
    answer:
      "Python supports object-oriented programming with multiple inheritance, method overriding, and duck typing. `super()` delegates method calls to the next class in the Method Resolution Order (MRO).",
    example: `class Vehicle:
    def __init__(self, brand: str):
        self.brand = brand

    def describe(self) -> str:
        return f"Vehicle brand: {self.brand}"

class ElectricCar(Vehicle):
    def __init__(self, brand: str, battery_kwh: int):
        super().__init__(brand) # Calls parent constructor
        self.battery_kwh = battery_kwh

    def describe(self) -> str:
        return f"{super().describe()}, Battery: {self.battery_kwh}kWh"

car = ElectricCar("Tesla", 82)
print(car.describe()) # Vehicle brand: Tesla, Battery: 82kWh`,
    explanation:
      "`super()` ensures cooperative multi-inheritance calls and guarantees the entire inheritance hierarchy is properly initialized.",
    moduleSlug: "oop-fundamentals",
    category: "python",
    language: "python",
  },
  {
    question:
      "What is the Global Interpreter Lock (GIL) in CPython and how do you bypass it for concurrency?",
    answer:
      "The GIL is a mutex in CPython that prevents multiple native OS threads from executing Python bytecodes simultaneously. It was designed to protect CPython's reference-counting memory management from race conditions.\n\n• For I/O-bound tasks (network, disk): Standard `threading` or `asyncio` works great because threads release the GIL while waiting on I/O.\n• For CPU-bound tasks (math, data science): Standard threads cannot achieve parallelism. Use `multiprocessing` or `concurrent.futures.ProcessPoolExecutor` to spawn separate processes with independent Python interpreters and memory spaces.",
    example: `from concurrent.futures import ProcessPoolExecutor

def heavy_computation(number):
    return sum(i * i for i in range(number))

if __name__ == "__main__":
    numbers = [5_000_000, 6_000_000, 7_000_000]
    
    # Bypasses the GIL by running across multiple CPU cores
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(heavy_computation, numbers))
    print("Computed parallel results:", results)`,
    explanation:
      "`ProcessPoolExecutor` launches separate worker processes, allowing true parallel CPU utilization across all computer cores.",
    moduleSlug: "gil-multithreading",
    category: "python",
    language: "python",
  },
  {
    question:
      "How do Context Managers and the 'with' statement manage resources in Python?",
    answer:
      "Context managers guarantee that resources (file descriptors, database connections, locks) are safely acquired and released, even if an unhandled exception occurs.\n\nYou create them by implementing `__enter__` and `__exit__`, or using the `@contextmanager` generator decorator from `contextlib`.",
    example: `from contextlib import contextmanager

@contextmanager
def managed_database_session():
    print("Opening database session...")
    session = {"connected": True}
    try:
        yield session # Hand control over to the with-block
    finally:
        print("Safely closing database session.")
        session["connected"] = False

with managed_database_session() as db:
    print("Performing queries on db...")
    # Even if an error happens here, the finally block still closes the session!`,
    explanation:
      "Context managers eliminate resource leaks by making clean-up deterministic, replacing boilerplate `try...finally` structures.",
    moduleSlug: "context-managers",
    category: "python",
    language: "python",
  },
  {
    question:
      "How do *args and **kwargs handle variable positional and keyword arguments?",
    answer:
      "• `*args`: Collects extra positional arguments passed to a function into a `tuple`.\n• `**kwargs`: Collects extra keyword (named) arguments into a `dict`.\n• They can also be used as unpack operators when calling functions.",
    example: `def log_event(event_type, *tags, **metadata):
    print(f"Event: {event_type}")
    print(f"Tags tuple: {tags}")
    print(f"Metadata dict: {metadata}")

log_event("USER_SIGNUP", "mobile", "ios", user_id=402, ip="192.168.1.1")
# Output:
# Event: USER_SIGNUP
# Tags tuple: ('mobile', 'ios')
# Metadata dict: {'user_id': 402, 'ip': '192.168.1.1'}`,
    explanation:
      "`*args` and `**kwargs` allow writing flexible wrapper functions, decorators, and generic API clients.",
    moduleSlug: "args-kwargs",
    category: "python",
    language: "python",
  },
  {
    question:
      "What is the difference between an Iterator and an Iterable in Python?",
    answer:
      "• Iterable: Any Python object capable of returning its members one at a time (implements `__iter__()`, e.g. list, tuple, set, dict).\n• Iterator: The stateful object that performs the traversal. It implements `__next__()` and raises `StopIteration` when no more elements remain.",
    example: `numbers = [10, 20] # Iterable

# Get the iterator
iterator = iter(numbers)

print(next(iterator)) # 10
print(next(iterator)) # 20
# next(iterator) -> Raises StopIteration!`,
    explanation:
      "Python's `for item in sequence:` loop under the hood calls `iter()` on the sequence and repeatedly calls `next()` until `StopIteration` is caught.",
    moduleSlug: "iterators-generators",
    category: "python",
    language: "python",
  },
  {
    question:
      "How does Exception Handling work in Python with try, except, else, and finally?",
    answer:
      "• `try`: The block of code to monitor for exceptions.\n• `except SpecificError`: Catches and handles specific error types.\n• `else`: Executes only if **no exception** was thrown in the `try` block.\n• `finally`: Executes unconditionally, regardless of whether exceptions were caught.",
    example: `def calculate_average(items):
    try:
        total = sum(items)
        avg = total / len(items)
    except ZeroDivisionError:
        print("Cannot calculate average of an empty list.")
        return 0
    except TypeError as e:
        print(f"Invalid item type: {e}")
        return None
    else:
        print("Calculation successful!")
        return avg
    finally:
        print("Operation completed.")`,
    explanation:
      "Using specific exception types prevents masking unexpected programming bugs that a bare `except:` would hide.",
    moduleSlug: "exception-handling",
    category: "python",
    language: "python",
  },
  {
    question:
      "What are Python Data Classes and how do they compare to standard classes?",
    answer:
      "Introduced in Python 3.7, `@dataclass` automatically generates boilerplate methods like `__init__()`, `__repr__()`, and `__eq__()` based on class type annotations.\n\nSetting `frozen=True` makes data classes immutable and hashable (usable as dictionary keys or set elements).",
    example: `from dataclasses import dataclass

@dataclass(frozen=True)
class Customer:
    id: int
    name: str
    email: str
    active: bool = True

c1 = Customer(1, "Dana", "dana@example.com")
print(c1) # Customer(id=1, name='Dana', email='dana@example.com', active=True)
# c1.name = "New" -> Raises FrozenInstanceError!`,
    explanation:
      "Data classes eliminate hundreds of lines of repetitive constructor and comparison code while promoting typed data modeling.",
    moduleSlug: "data-classes",
    category: "python",
    language: "python",
  },
  {
    question:
      "How do Python Virtual Environments (venv) and modern packaging tools (Poetry, UV) manage dependencies?",
    answer:
      "Python packages installed via `pip` globally can cause version conflicts across projects. Virtual environments isolate site-packages and Python binaries per project.\n\nModern tools like **uv** and **Poetry** resolve dependencies deterministically using lockfiles (`poetry.lock`), providing reproducible environments across machines.",
    example: `# Create virtual environment using standard venv
python -m venv .venv

# Activate on Linux/macOS
source .venv/bin/activate

# Activate on Windows PowerShell
# .venv\\Scripts\\Activate.ps1

# Install requirements
pip install -r requirements.txt`,
    explanation:
      "Activating `.venv` redirects the shell's `python` and `pip` paths to the project folder, preventing system-level package corruption.",
    moduleSlug: "virtual-environments-packaging",
    category: "python",
    language: "bash",
  },
  {
    question:
      "How do Lambda functions and the functools module work in Python?",
    answer:
      "• `lambda`: Anonymous inline functions for simple expressions: `lambda x: x * 2`.\n• `functools`: Standard module with utilities like `partial` (pre-fill arguments), `reduce` (fold iterable), and `@lru_cache` (memoization).",
    example: `from functools import lru_cache, partial

# 1. Memoized recursive function with LRU cache
@lru_cache(maxsize=128)
def fib(n: int) -> int:
    if n < 2: return n
    return fib(n - 1) + fib(n - 2)

# 2. Partial application
def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
print(square(5)) # 25`,
    explanation:
      "`@lru_cache` caches expensive function outputs in memory, reducing exponential O(2^N) recursion to linear O(N) performance.",
    moduleSlug: "lambda-functional-tools",
    category: "python",
    language: "python",
  },
  {
    question:
      "What are Magic / Dunder Methods in Python and how do they enable operator overloading?",
    answer:
      "Dunder (Double Underscore) methods allow custom classes to hook into Python's built-in syntax:\n• `__str__` / `__repr__`: String representations.\n• `__len__`: Hook for `len(obj)`.\n• `__add__`: Hook for the `+` operator.\n• `__getitem__`: Hook for index access `obj[key]`.",
    example: `class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

v1 = Vector(2, 3)
v2 = Vector(5, 7)
print(v1 + v2) # Vector(7, 10)`,
    explanation:
      "Implementing dunder methods makes custom objects feel like native Python types, integrating seamlessly with standard operators.",
    moduleSlug: "magicdunder-methods",
    category: "python",
    language: "python",
  },
  {
    question:
      "How does Memory Management and Reference Counting work in Python?",
    answer:
      "CPython manages memory primarily through **Reference Counting**: every object tracks how many variables refer to it. When the count drops to 0, memory is immediately deallocated.\n\nTo handle **Reference Cycles** (e.g. Object A references B, and B references A), CPython runs a generational cyclic garbage collector that tracks container objects.",
    example: `import sys

data = ["hello", "world"]
print(sys.getrefcount(data)) # Reference count (includes getrefcount argument)

alias = data
print(sys.getrefcount(data)) # Incremented by 1

del alias # Decremented by 1`,
    explanation:
      "Avoid creating circular references in complex graph objects, or use `weakref` to prevent memory leaks that require generational GC sweeps.",
    moduleSlug: "memory-management-gc",
    category: "python",
    language: "python",
  },
  {
    question:
      "How do Type Hints and Static Type Checking with Mypy work in modern Python?",
    answer:
      "Python 3.5+ supports optional static type annotations (`int`, `str`, `List`, `Dict`, `Optional`). Python itself does not enforce types at runtime, but static analyzers like **Mypy** and IDEs detect type bugs before execution.",
    example: `from typing import Optional

def format_user(user_id: int, nickname: Optional[str] = None) -> str:
    if nickname is not None:
        return f"User #{user_id}: {nickname.upper()}"
    return f"User #{user_id}"

# Mypy flag check:
# mypy script.py --strict`,
    explanation:
      "Type annotations act as executable documentation and prevent common runtime `AttributeError` and `TypeError` bugs.",
    moduleSlug: "type-hints",
    category: "python",
    language: "python",
  },
  {
    question:
      "How does asyncio enable asynchronous concurrent programming in Python?",
    answer:
      "The `asyncio` module provides an event loop that runs cooperative multitasking using `async` coroutines and `await`.\n\nCoroutines pause execution at `await` expressions, returning control back to the event loop so other tasks can progress without blocking the thread.",
    example: `import asyncio

async def fetch_api(source_id: int):
    print(f"Task {source_id} started...")
    await asyncio.sleep(1) # Non-blocking async sleep
    print(f"Task {source_id} completed!")
    return f"Result {source_id}"

async def main():
    # Run multiple async operations concurrently
    results = await asyncio.gather(
        fetch_api(1),
        fetch_api(2),
        fetch_api(3)
    )
    print("All tasks finished:", results)

asyncio.run(main()) # Takes ~1 second total instead of 3 seconds!`,
    explanation:
      "`asyncio.gather` fires all three coroutines concurrently, finishing all I/O operations in parallel within the time of the longest task.",
    moduleSlug: "async-io",
    category: "python",
    language: "python",
  },
];
