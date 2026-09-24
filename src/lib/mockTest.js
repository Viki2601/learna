// Mock test generator: curated MCQ banks per module + a deterministic
// fallback that derives multiple-choice questions from the module's Q&A.

const CURATED_TESTS = {
    "closures-scope": [
        {
            question: "What is a closure in JavaScript?",
            options: [
                "A function bundled together with references to its outer lexical environment, even after the outer function has returned",
                "A function that always runs immediately without being called",
                "A special block that closes unused variables to free memory",
                "A callback registered to run when the page finishes loading"
            ],
            correctIndex: 0
        },
        {
            question: "Which statement about var, let, and const is correct?",
            options: [
                "var is function-scoped, while let and const are block-scoped",
                "All three declarations are block-scoped to the nearest curly braces",
                "let is function-scoped, while var and const are block-scoped",
                "const creates a block-scoped binding that can still be reassigned"
            ],
            correctIndex: 0
        },
        {
            question: "What does this code log?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}",
            options: ["0, 1, 2", "3, 3, 3", "0, 0, 0", "1, 2, 3"],
            correctIndex: 1
        },
        {
            question: "Lexical (static) scoping determines variable access based on what?",
            options: [
                "The physical location of declarations in the source code, fixed at parse time",
                "Where a function is called at runtime",
                "The order in which functions are invoked",
                "The value of this when the callback executes"
            ],
            correctIndex: 0
        },
        {
            question: "In the classic counter example, why does counter.count evaluate to undefined?",
            options: [
                "count is private inside the closure — only the returned methods can access it",
                "count is declared with var, so it is hoisted as undefined",
                "count was garbage-collected as soon as createCounter returned",
                "count exists, but console.log cannot print numbers stored on objects"
            ],
            correctIndex: 0
        }
    ],
    "event-loop-deep-dive": [
        {
            question: "What is the correct execution order?\n\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');",
            options: ["A, B, C, D", "A, D, C, B", "A, D, B, C", "A, C, D, B"],
            correctIndex: 1
        },
        {
            question: "Which statement about microtasks and macrotasks is true?",
            options: [
                "All pending microtasks run to completion before the next macrotask is picked up",
                "Macrotasks always run before microtasks in every tick",
                "Both share a single queue processed strictly in FIFO order",
                "setTimeout callbacks are queued as microtasks"
            ],
            correctIndex: 0
        },
        {
            question: "Why doesn't setTimeout(fn, 0) execute immediately?",
            options: [
                "Its callback is queued as a macrotask and must wait for the call stack — and all microtasks — to drain",
                "Timers set to 0 milliseconds are disabled in browsers",
                "setTimeout always executes its callback synchronously",
                "A 0ms delay signals the highest priority, so it runs last"
            ],
            correctIndex: 0
        },
        {
            question: "What does a 'Maximum call stack size exceeded' error indicate?",
            options: [
                "Unbounded recursion pushed frames beyond the stack's fixed memory limit",
                "The event loop is blocked by a long-running macrotask",
                "Too many microtasks were queued before a render",
                "The Web Worker pool has been exhausted"
            ],
            correctIndex: 0
        },
        {
            question: "What happens when an async function hits an await expression?",
            options: [
                "The function pauses, and its continuation is scheduled as a microtask once the awaited promise resolves",
                "The entire JavaScript thread blocks until the promise settles",
                "The function immediately returns undefined forever",
                "An error is thrown unless await is wrapped in try/catch"
            ],
            correctIndex: 0
        }
    ]
};

const GENERIC_DISTRACTORS = [
    (m) => `It only applies to compiled, statically-typed ${m.category || "languages"} code.`,
    (m) => `It is purely a build-tool configuration concern with no runtime effect.`,
    (m) => `\`${m.title || "This topic"}\` was deprecated and removed from modern runtimes.`,
    (m) => `It behaves identically in strict and sloppy mode — no developer impact.`
];

// Deterministic PRNG so server and client always render the same option order
function hashSeed(str) {
    let h = 2166136261;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffle(list, rng) {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

function firstMeaningfulParagraph(text, maxLen = 170) {
    if (!text) return "";
    const para = String(text)
        .split(/\n+/)
        .map((s) => s.trim())
        .find(Boolean) || "";
    const cleaned = para.replace(/\s+/g, " ").trim();
    if (cleaned.length <= maxLen) return cleaned;
    const cut = cleaned.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(" ");
    return cut.slice(0, lastSpace > maxLen * 0.6 ? lastSpace : maxLen).trim() + "…";
}

function buildFallbackTest(module = {}, qaList = []) {
    const list = (qaList || []).filter((q) => q?.question && q?.answer);
    if (list.length === 0) return [];

    const rng = mulberry32(hashSeed(module.slug || module.title || "mock-test"));
    const size = Math.min(5, list.length);
    const stride = list.length / size;
    const picked = [];
    for (let i = 0; i < size; i++) {
        picked.push(list[Math.floor(i * stride)]);
    }

    const pool = [...new Set(list.map((q) => firstMeaningfulParagraph(q.answer)).filter(Boolean))];
    let genericIndex = 0;

    return picked.map((qa) => {
        const correct = firstMeaningfulParagraph(qa.answer);
        const others = pool.filter((s) => s !== correct);
        shuffle(others, rng);

        const options = [correct];
        for (const distractor of others) {
            if (options.length >= 4) break;
            options.push(distractor);
        }
        while (options.length < 4) {
            options.push(GENERIC_DISTRACTORS[genericIndex++ % GENERIC_DISTRACTORS.length](module));
        }

        shuffle(options, rng);
        return {
            question: qa.question,
            options,
            correctIndex: options.indexOf(correct)
        };
    });
}

export function getMockTest(module = {}, qaList = []) {
    const curated = CURATED_TESTS[module.slug];
    if (curated && curated.length > 0) {
        const rng = mulberry32(hashSeed(module.slug));
        return curated.map((q) => {
            const correctText = q.options[q.correctIndex];
            const options = shuffle([...q.options], rng);
            return {
                question: q.question,
                options,
                correctIndex: options.indexOf(correctText)
            };
        });
    }
    return buildFallbackTest(module, qaList);
}
