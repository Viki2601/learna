import { RESULTS } from "./category";
import { QA_LANGUAGES } from "./qa/languages";
import { QA_LANGUAGES_MORE } from "./qa/languages_more";
import { QA_LANGUAGES_EXTRA } from "./qa/languages_extra";
import { QA_FRAMEWORKS } from "./qa/frameworks";
import { QA_FRAMEWORKS_MORE } from "./qa/frameworks_more";
import { QA_DATABASES } from "./qa/databases";
import { QA_DEVOPS } from "./qa/devops";
import { QA_DEVOPS_MORE } from "./qa/devops_more";

// Aggregate all curated Q&A collections
export const ALL_QA = [
    ...QA_LANGUAGES,
    ...QA_LANGUAGES_MORE,
    ...QA_LANGUAGES_EXTRA,
    ...QA_FRAMEWORKS,
    ...QA_FRAMEWORKS_MORE,
    ...QA_DATABASES,
    ...QA_DEVOPS,
    ...QA_DEVOPS_MORE
];

// Backwards compatibility export
export const QA_JAVASCRIPT = ALL_QA.filter((qa) => qa.category === "javascript");

// Helper to normalize slugs (handles promises-asyncawait vs promises-async-await)
function normalizeSlug(str) {
    return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Generate high-quality contextual questions and code examples for any module
function generateModuleQA(module) {
    const { title, category, level, slug } = module;

    const languageMap = {
        javascript: "javascript",
        typescript: "typescript",
        python: "python",
        java: "java",
        csharp: "csharp",
        cplusplus: "cpp",
        c: "c",
        go: "go",
        rust: "rust",
        php: "php",
        ruby: "ruby",
        kotlin: "kotlin",
        swift: "swift",
        dart: "dart",
        html5: "html",
        css3: "css",
        react: "javascript",
        nextjs: "typescript",
        vuejs: "vue",
        angular: "typescript",
        svelte: "svelte",
        nodejs: "javascript",
        express: "javascript",
        nestjs: "typescript",
        django: "python",
        flask: "python",
        spring: "java",
        laravel: "php",
        rails: "ruby",
        flutter: "dart",
        reactnative: "javascript",
        tailwind: "html",
        threejs: "javascript",
        sql: "sql",
        postgresql: "sql",
        mongodb: "javascript",
        redis: "bash",
        sqlite: "sql",
        firebase: "javascript",
        docker: "dockerfile",
        kubernetes: "yaml",
        git: "bash",
        github: "yaml",
        gitlab: "yaml",
        figma: "json",
        webpack: "javascript",
        vitejs: "javascript",
        aws: "bash",
        azure: "bash",
        gcp: "bash",
        linux: "bash",
        nginx: "nginx",
        graphql: "graphql",
        jest: "javascript"
    };

    const lang = languageMap[category] || "javascript";

    // Produce three distinct, highly relevant questions for the topic
    return [
        {
            question: `What are the core concepts and architecture of ${title} in ${category.toUpperCase()}?`,
            answer: `${title} is a fundamental concept in ${category.toUpperCase()} that developers must understand for ${level.toLowerCase()}-level engineering.\n\nIt establishes the primary design patterns, state lifecycles, and operational boundaries necessary to write robust, maintainable, and bug-free code.\n\nUnderstanding how ${title} functions under the hood ensures that applications scale efficiently without unexpected runtime performance bottlenecks or memory leaks.`,
            example: `// Example demonstrating ${title} in ${category.toUpperCase()}
// Practical production-ready implementation

function demonstrate${title.replace(/[^a-zA-Z0-9]/g, "")}() {
  console.log("Initializing ${title} in ${category}...");
  
  const configuration = {
    feature: "${title}",
    level: "${level}",
    status: "active",
    timestamp: new Date().toISOString()
  };

  // Perform core operation
  const result = executeOperation(configuration);
  return result;
}

function executeOperation(config) {
  // Safe processing and state handling
  return {
    success: true,
    data: config,
    message: "Successfully executed ${title} workflow."
  };
}

const outcome = demonstrate${title.replace(/[^a-zA-Z0-9]/g, "")}();
console.log("Execution Outcome:", outcome);`,
            explanation: `This implementation establishes a clear separation of concerns when working with ${title}. By isolating configuration parameters and validating execution states, error boundaries remain protected and code readability is maximized.`,
            moduleSlug: slug,
            category: category,
            language: lang
        },
        {
            question: `What are the most common pitfalls or mistakes developers make with ${title}?`,
            answer: `When implementing ${title} in ${category}, developers frequently encounter several critical pitfalls:\n\n1. Inefficient resource handling or forgetting teardown/cleanup logic, leading to memory leaks.\n2. Overcomplicating straightforward implementations instead of leveraging native framework capabilities.\n3. Failing to handle asynchronous race conditions or edge-case error states gracefully.\n4. Ignoring concurrency constraints or thread-safety guarantees.`,
            example: `// Anti-pattern vs Recommended Pattern in ${title}

// ❌ Anti-pattern: Unchecked, potential failure or leak
// function riskyImplementation() {
//   let resource = acquireResource();
//   // If error thrown here, resource is never released!
//   process(resource);
// }

// ✅ Recommended Pattern: Guarded execution with guaranteed cleanup
async function robustImplementation() {
  let resource = null;
  try {
    resource = await acquireResourceSafe();
    const result = await processResource(resource);
    return result;
  } catch (error) {
    console.error("Error in ${title}:", error.message);
    throw error;
  } finally {
    if (resource) {
      await releaseResourceSafe(resource);
    }
  }
}`,
            explanation: `Guaranteed cleanup in the \`finally\` block ensures that regardless of whether the operation succeeds or throws an exception, external resources and memory handles are reclaimed safely.`,
            moduleSlug: slug,
            category: category,
            language: lang
        },
        {
            question: `What are the industry best practices and performance optimization techniques for ${title}?`,
            answer: `To maximize throughput, maintainability, and responsiveness when working with ${title}, adhere to the following best practices:\n\n• Maintain immutability and avoid unexpected side-effects in shared state.\n• Leverage caching strategies (memoization, LRU caches, or HTTP cache headers) to eliminate redundant calculations.\n• Write modular, decoupled components with single responsibilities to ensure testability.\n• Instrument code with logging and metrics to detect regressions in production.`,
            example: `// Performance Optimization Pattern for ${title}

class ${title.replace(/[^a-zA-Z0-9]/g, "")}Manager {
  private cache = new Map();

  async getOrCompute(key, computeFn) {
    // 1. Fast cache hit
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // 2. Compute on cache miss
    const computedValue = await computeFn(key);
    this.cache.set(key, computedValue);
    
    return computedValue;
  }

  invalidate(key) {
    this.cache.delete(key);
  }
}`,
            explanation: `Using in-memory cache lookups bounds runtime latency, providing sub-millisecond responses for repeated queries while preserving clean invalidation semantics.`,
            moduleSlug: slug,
            category: category,
            language: lang
        }
    ];
}

/**
 * Retrieve Q&A list for a given module slug.
 * 1. Checks curated ALL_QA for exact slug match.
 * 2. Checks curated ALL_QA for normalized slug match.
 * 3. If module exists in RESULTS, returns curated or dynamically generated rich Q&A.
 */
export function getQAByModuleSlug(slug) {
    if (!slug) return [];

    const normTarget = normalizeSlug(slug);

    // 1. Exact match in curated list
    const exactMatches = ALL_QA.filter((qa) => qa.moduleSlug === slug);
    if (exactMatches.length > 0) return exactMatches;

    // 2. Normalized match in curated list (e.g. promises-asyncawait vs promises-async-await)
    const normMatches = ALL_QA.filter((qa) => normalizeSlug(qa.moduleSlug) === normTarget);
    if (normMatches.length > 0) return normMatches;

    // 3. Match against RESULTS in category.js
    const courseModule = RESULTS.find(
        (r) => r.slug === slug || normalizeSlug(r.slug) === normTarget
    );

    if (courseModule) {
        // Check if there are curated Q&As for this category that match by title or slug
        const categoryCurated = ALL_QA.filter(
            (qa) => qa.category === courseModule.category && normalizeSlug(qa.moduleSlug) === normTarget
        );
        if (categoryCurated.length > 0) return categoryCurated;

        // Generate contextual, elaborated Q&A for this specific module
        return generateModuleQA(courseModule);
    }

    return [];
}