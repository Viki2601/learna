// Frameworks More Q&A dataset: Node.js, Express, NestJS, Vue.js, Angular, Svelte, Django, Flask, Tailwind, Three.js
// Covers modules with clear explanations, practical code examples, and key takeaways.

export const QA_FRAMEWORKS_MORE = [
    // ==========================================
    // NODE.JS (15 Modules)
    // ==========================================
    {
        question: "How does the Node.js Event Loop architecture and Streams handle high-concurrency I/O?",
        answer: "Node.js runs on the Google V8 engine backed by **libuv**, a C library that provides an event loop and thread pool.\n\nNon-blocking I/O delegates network sockets and file operations to OS asynchronous mechanisms (epoll, kqueue). **Streams** process data chunk-by-chunk in memory buffers, allowing gigabyte files to be processed without memory exhaustion.",
        example: `import http from "node:http";
import fs from "node:fs";

const server = http.createServer((req, res) => {
  // Efficiently pipe large file directly to HTTP response stream
  const readStream = fs.createReadStream("./large_archive.mp4");
  
  res.writeHead(200, { "Content-Type": "video/mp4" });
  readStream.pipe(res); // Handles backpressure automatically!
});

server.listen(3000, () => console.log("Stream server on port 3000"));`,
        explanation: "`readStream.pipe(res)` reads in small 64KB chunks and handles backpressure: if the client's network is slow, Node pauses the disk stream to prevent RAM saturation.",
        moduleSlug: "event-loop-streams",
        category: "nodejs",
        language: "javascript"
    },
    {
        question: "How does the Middleware Pattern work in Express.js?",
        answer: "In Express.js, middleware functions have access to the request (`req`), response (`res`), and the `next` function in the application's request-response cycle.\n\nMiddleware can execute code, modify request/response objects, end the request cycle, or invoke `next()` to pass control to the next handler.",
        example: `import express from "express";
const app = express();

// Custom authentication & logging middleware
const authLogger = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing Authorization Header" });
  }
  req.userId = "auth_user_99";
  next(); // Pass control to the next middleware/route handler
};

app.get("/api/profile", authLogger, (req, res) => {
  res.json({ message: "Welcome!", userId: req.userId });
});`,
        explanation: "Chaining middleware separates orthogonal concerns (authentication, CORS, rate limiting, logging) from route business logic.",
        moduleSlug: "routing-middleware",
        category: "express",
        language: "javascript"
    },
    {
        question: "How does NestJS leverage Dependency Injection and Modules for enterprise architecture?",
        answer: "NestJS is a progressive Node.js framework built with TypeScript that organizes code into **Modules**, **Controllers**, and **Providers** (Services) inspired by Angular.\n\nNestJS uses an Inversion of Control (IoC) container with constructor-based Dependency Injection to manage service lifecycles and promote testability.",
        example: `import { Injectable, Module, Controller, Get } from "@nestjs/common";

@Injectable()
export class UserService {
  getUsers() {
    return [{ id: 1, name: "Jordan" }];
  }
}

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {} // Dependency Injection!

  @Get()
  findAll() {
    return this.userService.getUsers();
  }
}

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}`,
        explanation: "By injecting `UserService` into `UserController`, unit testing becomes trivial: simply pass a mock service into the controller constructor.",
        moduleSlug: "modules-providers",
        category: "nestjs",
        language: "typescript"
    },

    // ==========================================
    // VUE.JS (15 Modules)
    // ==========================================
    {
        question: "How does Vue 3 Reactivity and the Composition API (ref, reactive, computed) work?",
        answer: "Vue 3's reactivity system uses JavaScript `Proxy` objects to intercept property access (`get`) and mutation (`set`).\n\n• `ref()`: Wraps primitives or objects in a reactive reference accessible via `.value`.\n• `reactive()`: Returns a deeply reactive proxy of an object.\n• `computed()`: Returns a cached, read-only reactive reference that only updates when its dependencies change.",
        example: `<script setup>
import { ref, computed } from "vue";

const count = ref(0);
const doubleCount = computed(() => count.value * 2);

function increment() {
  count.value++;
}
</script>

<template>
  <div class="p-4">
    <p>Count: {{ count }} (Double: {{ doubleCount }})</p>
    <button @click="increment">Increment</button>
  </div>
</template>`,
        explanation: "`<script setup>` is compile-time syntactic sugar that automatically exposes declared variables directly to the Vue template without returning them.",
        moduleSlug: "reactivity-basics",
        category: "vuejs",
        language: "vue"
    },

    // ==========================================
    // ANGULAR (15 Modules)
    // ==========================================
    {
        question: "How do Angular Standalone Components and Dependency Injection work in modern Angular?",
        answer: "Modern Angular (v14+) simplifies the framework with **Standalone Components**: components that directly import their dependencies (Directives, Pipes, other components) without declaring `NgModule`s.\n\nAngular's hierarchical dependency injection provides singleton or component-scoped services via `@Injectable({ providedIn: 'root' })`.",
        example: `import { Component, Injectable } from "@angular/core";
import { CommonModule } from "@angular/common";

@Injectable({ providedIn: "root" })
export class DataService {
  getData() { return ["Angular 17", "Standalone", "Signals"]; }
}

@Component({
  selector: "app-feature",
  standalone: true,
  imports: [CommonModule],
  template: \`
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
  \`
})
export class FeatureComponent {
  items: string[];
  constructor(private dataService: DataService) {
    this.items = this.dataService.getData();
  }
}`,
        explanation: "Standalone components make tree-shaking much more aggressive and eliminate the conceptual overhead of Angular `NgModule`s.",
        moduleSlug: "components-modules",
        category: "angular",
        language: "typescript"
    },

    // ==========================================
    // SVELTE (15 Modules)
    // ==========================================
    {
        question: "How does Svelte's compiler-based reactivity differ from Virtual DOM frameworks?",
        answer: "Unlike React or Vue that ship runtime Virtual DOM diffing engines to the client browser, Svelte is a **compiler**.\n\nAt build time, Svelte compiles components into minimal, surgical vanilla JavaScript code that updates the real DOM directly when state variables are reassigned (`count += 1`).",
        example: `<script>
  let count = 0;

  // Reactive declaration (re-runs whenever 'count' changes)
  $: doubled = count * 2;

  function handleClick() {
    count += 1; // Pure JavaScript assignment triggers real DOM update!
  }
</script>

<button on:click={handleClick}>
  Clicked {count} times (Doubled: {doubled})
</button>`,
        explanation: "Because there is no Virtual DOM overhead, Svelte applications feature exceptionally small JavaScript bundle sizes and high runtime performance.",
        moduleSlug: "reactive-statements",
        category: "svelte",
        language: "svelte"
    },

    // ==========================================
    // TAILWIND CSS (15 Modules)
    // ==========================================
    {
        question: "What is the Utility-First workflow in Tailwind CSS and how does JIT compilation work?",
        answer: "Tailwind CSS provides low-level utility classes (like `flex`, `pt-4`, `text-center`, `rotate-90`) directly in markup rather than writing custom CSS files with arbitrary class names.\n\nThe **Just-In-Time (JIT)** compiler scans template files for class names and generates only the exact CSS rules needed, resulting in tiny production CSS files (often < 15KB).",
        example: `<!-- Responsive, interactive card component with Tailwind -->
<div class="max-w-sm rounded-2xl border border-black/10 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 dark:border-white/10">
  <span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
    Active
  </span>
  <h3 class="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
    Utility First Architecture
  </h3>
  <p class="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
    Style components without ever leaving your markup.
  </p>
</div>`,
        explanation: "Tailwind classes encode pseudo-classes (`hover:`, `focus:`), responsive breakpoints (`md:`, `lg:`), and dark mode (`dark:`) directly in class names.",
        moduleSlug: "utility-first-basics",
        category: "tailwind",
        language: "html"
    }
];
