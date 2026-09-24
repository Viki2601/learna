// Frameworks & Libraries Q&A dataset: React, Next.js, Vue.js, Angular, Svelte, Node.js, Express, NestJS, Tailwind, Three.js, etc.
// Covers 15 modules with detailed explanations, practical code examples, and key takeaways.

export const QA_FRAMEWORKS = [
  // ==========================================
  // REACT (15 Modules)
  // ==========================================
  {
    question:
      "How do useState and useEffect work and what are the rules of React Hooks?",
    answer:
      "Hooks allow functional components to manage local state and lifecycle side effects without writing class components.\n\n• `useState`: Declares a state variable and an updater function that triggers re-rendering when state changes.\n• `useEffect`: Runs side effects (API calls, DOM manipulation, event listeners) after the component renders.\n\n**Rules of Hooks**:\n1. Only call hooks at the **top level** of components (never inside loops, conditions, or nested functions).\n2. Only call hooks from React function components or custom hooks.",
    example: `import { useState, useEffect } from "react";

export function CounterTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set up timer side effect
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    // Clean-up function runs when component unmounts or before re-running effect
    return () => clearInterval(interval);
  }, []); // Empty dependency array = runs once on mount

  return (
    <div className="p-4 border rounded">
      <p>Seconds elapsed: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
    explanation:
      "The returned cleanup function inside `useEffect` prevents memory leaks by reliably clearing the interval timer when the component unmounts.",
    moduleSlug: "hooks-fundamentals",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How do React.memo, useMemo, and useCallback optimize component performance?",
    answer:
      "React re-renders components whenever their parent re-renders. Performance optimization hooks prevent unnecessary calculations and re-renders:\n\n• `React.memo`: Higher-order component that memoizes a component, skipping re-rendering if its props have not changed (shallow comparison).\n• `useMemo`: Caches the *result* of an expensive calculation between renders.\n• `useCallback`: Caches a *function reference* between renders so child components receiving it as a prop do not re-render unnecessarily.",
    example: `import { useState, useMemo, useCallback } from "react";

export function ProductList({ products }) {
  const [filter, setFilter] = useState("");

  // useMemo: Only re-sorts products when products array or filter changes
  const filteredProducts = useMemo(() => {
    console.log("Filtering products...");
    return products.filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()));
  }, [products, filter]);

  // useCallback: Stable function reference passed to child components
  const handleSelect = useCallback((id) => {
    console.log("Selected product ID:", id);
  }, []);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      {filteredProducts.map((p) => (
        <ProductItem key={p.id} item={p} onSelect={handleSelect} />
      ))}
    </div>
  );
}`,
    explanation:
      "Without `useCallback`, `handleSelect` would be re-created with a new memory address on every render, causing memoized children to invalidate and re-render.",
    moduleSlug: "performance-memoization",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How does React Context API work and how does it compare to Redux or Zustand?",
    answer:
      "The Context API provides a way to share data through the component tree without passing props manually down every level (prop drilling).\n\n• Context: Ideal for low-frequency global state (themes, authenticated user profile, localization).\n• State Management Libraries (Zustand, Redux): Better for high-frequency, complex state updates because Context re-renders **all consumers** whenever its value changes, whereas Zustand supports fine-grained selector subscriptions.",
    example: `import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return <button onClick={toggleTheme}>Current Theme: {theme}</button>;
}`,
    explanation:
      "Wrapping the app with `ThemeProvider` enables any deeply nested child component to access theme state directly with `useContext(ThemeContext)`.",
    moduleSlug: "context-state-management",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How does the Virtual DOM and React Reconciliation algorithm (Diffing) work?",
    answer:
      "The Virtual DOM (VDOM) is a lightweight in-memory JavaScript representation of the actual browser DOM. When component state changes, React creates a new VDOM tree and compares it with the previous one using its **Reconciliation / Diffing Algorithm**:\n\n1. Elements of different types produce different trees (React tears down the old tree).\n2. Elements of the same type update only changed attributes.\n3. Keys differentiate children in list reconciliations, minimizing expensive real DOM node re-creations.",
    example: `// When updating state, React compares these VDOM objects:
// Old VDOM:
// { type: 'div', props: { className: 'alert', children: 'Saving...' } }

// New VDOM:
// { type: 'div', props: { className: 'alert success', children: 'Saved!' } }

// React calculates the minimal DOM delta:
// element.className = 'alert success';
// element.textContent = 'Saved!';`,
    explanation:
      "Because direct browser DOM operations trigger layout recalculation and repainting, batching updates in memory via the VDOM produces high rendering efficiency.",
    moduleSlug: "virtual-dom-reconciliation",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "What are the common pitfalls and best practices of useEffect dependencies?",
    answer:
      "Common `useEffect` pitfalls include:\n1. Omitting dependencies from the dependency array, causing stale closure bugs.\n2. Passing non-primitive objects or inline functions as dependencies, causing infinite re-render loops.\n3. Forgetting cleanup functions, leading to unhandled memory leaks.\n\nBest practice: Use the `eslint-plugin-react-hooks` linter to enforce exhaustive dependencies.",
    example: `import { useState, useEffect } from "react";

export function UserStatus({ userId }) {
  const [status, setStatus] = useState("offline");

  useEffect(() => {
    let isSubscribed = true;

    async function checkStatus() {
      const response = await fetch(\`/api/status/\${userId}\`);
      const data = await response.json();
      // Guard against updating state if component unmounted or userId changed
      if (isSubscribed) {
        setStatus(data.status);
      }
    }

    checkStatus();

    return () => {
      isSubscribed = false; // Cleanup flag
    };
  }, [userId]); // Re-runs cleanly whenever userId changes

  return <span>User status: {status}</span>;
}`,
    explanation:
      "Using an `isSubscribed` boolean guard avoids the common React error: 'Can't perform a React state update on an unmounted component'.",
    moduleSlug: "useeffect-deep-dive",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How do Custom Hooks encapsulate stateful logic and promote code reuse?",
    answer:
      "A Custom Hook is a JavaScript function whose name starts with `use` and that can call other React hooks. Custom hooks do not share state; they share **stateful logic**.",
    example: `import { useState, useEffect } from "react";

// Custom hook to detect window dimensions
export function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
}

// In any component:
// const { width } = useWindowDimensions();`,
    explanation:
      "Any component can now consume window dimensions reactively with a single line of code, keeping resize listener cleanup isolated.",
    moduleSlug: "custom-hooks",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How do functional component lifecycles map to class component lifecycle methods?",
    answer:
      "• `componentDidMount`: `useEffect(() => { ... }, [])` (runs once on mount).\n• `componentDidUpdate`: `useEffect(() => { ... }, [dependencies])` (runs on mount and dependency change).\n• `componentWillUnmount`: The cleanup function returned by `useEffect`.\n• `getDerivedStateFromError`: Still requires class Error Boundaries or libraries like `react-error-boundary`.",
    example: `import { useEffect } from "react";

export function LifecycleDemo({ propValue }) {
  useEffect(() => {
    console.log("Mounted!");
    return () => console.log("Unmounting/Cleanup!");
  }, []);

  useEffect(() => {
    console.log("propValue updated to:", propValue);
  }, [propValue]);

  return <div>Value: {propValue}</div>;
}`,
    explanation:
      "`useEffect` unifies mount, update, and unmount concerns by co-locating setup and teardown logic within a single function.",
    moduleSlug: "component-lifecycle",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "What is the difference between Controlled and Uncontrolled Components in React?",
    answer:
      "• Controlled Components: Form input state is driven entirely by React state (`value` and `onChange`). React acts as the single source of truth.\n• Uncontrolled Components: Form input data is handled by the browser DOM itself. Values are retrieved on demand using a `ref` (`useRef`).",
    example: `import { useState, useRef } from "react";

export function FormComparison() {
  // 1. Controlled Input
  const [controlledEmail, setControlledEmail] = useState("");

  // 2. Uncontrolled Input using Ref
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", controlledEmail);
    console.log("Password:", passwordRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={controlledEmail} onChange={(e) => setControlledEmail(e.target.value)} />
      <input ref={passwordRef} type="password" defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}`,
    explanation:
      "Controlled inputs allow real-time validation, masking, and conditional disabling, while uncontrolled inputs can reduce re-renders for large complex forms.",
    moduleSlug: "controlled-vs-uncontrolled-components",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "Why are unique keys essential when rendering lists in React and why should you avoid index as a key?",
    answer:
      "Keys help React identify which items in a list have changed, been added, or been removed during reconciliation.\n\nUsing array indices as keys (`key={index}`) causes rendering bugs, incorrect component state retention, and performance penalties when list items are sorted, filtered, or prepended.",
    example: `// BAD: key={index} causes re-ordering and input focus bugs!
// {todos.map((todo, index) => <TodoItem key={index} {...todo} />)}

// GOOD: Use stable, unique database IDs
export function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className="py-2">
          {todo.title}
        </li>
      ))}
    </ul>
  );
}`,
    explanation:
      "Stable unique keys enable React to move existing DOM nodes during list reordering rather than unnecessarily recreating them.",
    moduleSlug: "react-keys-lists",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How do Error Boundaries catch runtime errors in React component trees?",
    answer:
      "Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole application.\n\nError boundaries must be implemented as class components using `static getDerivedStateFromError()` and `componentDidCatch()`.",
    example: `import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-50 text-red-700">Something went wrong.</div>;
    }
    return this.props.children;
  }
}`,
    explanation:
      "Wrapping feature widgets in Error Boundaries ensures an unhandled runtime error in one widget does not blank out the entire page.",
    moduleSlug: "error-boundaries",
    category: "react",
    language: "javascript",
  },
  {
    question: "How do useRef and forwardRef work in React?",
    answer:
      "• `useRef`: Returns a mutable ref object whose `.current` property persists across renders without triggering a re-render when mutated. Used to hold DOM references or timers.\n• `forwardRef`: Allows a parent component to pass a ref down into a child functional component's internal DOM node.",
    example: `import { forwardRef, useRef } from "react";

// Child component exposing internal input ref to parent
const CustomInput = forwardRef((props, ref) => {
  return <input ref={ref} className="border p-2" {...props} />;
});
CustomInput.displayName = "CustomInput";

export function ParentForm() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus(); // Direct DOM access
  };

  return (
    <div>
      <CustomInput ref={inputRef} placeholder="Type here..." />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}`,
    explanation:
      "`forwardRef` is essential when building reusable UI design system primitives like custom inputs, buttons, and modals.",
    moduleSlug: "refs-forwardref",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "How do React.lazy and Suspense enable code-splitting and loading states?",
    answer:
      "`React.lazy` dynamically imports components only when they are rendered, splitting them into separate bundle chunks. `Suspense` wraps lazy components to specify a fallback UI (like a loading spinner) while the bundle is loaded over the network.",
    example: `import { lazy, Suspense } from "react";

// Lazily load heavy charting library component
const HeavyAnalyticsChart = lazy(() => import("./HeavyAnalyticsChart"));

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard Overview</h1>
      <Suspense fallback={<div className="animate-pulse">Loading chart...</div>}>
        <HeavyAnalyticsChart />
      </Suspense>
    </div>
  );
}`,
    explanation:
      "Code splitting prevents heavy analytics or charting bundles from delaying the initial page load for first-time visitors.",
    moduleSlug: "suspense-lazy-loading",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "What is 'Lifting State Up' and when should it be applied in React?",
    answer:
      "Lifting State Up is the pattern of moving shared state to the closest common ancestor of two or more components that need to share that state.\n\nThe parent passes the state down as props, and passes callback functions allowing children to request state updates.",
    example: `import { useState } from "react";

function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <div>
      <label>Enter temperature in {scale}:</label>
      <input value={temperature} onChange={(e) => onTemperatureChange(e.target.value)} />
    </div>
  );
}

export function Calculator() {
  const [temp, setTemp] = useState("");

  return (
    <div>
      <TemperatureInput scale="Celsius" temperature={temp} onTemperatureChange={setTemp} />
      <TemperatureInput scale="Fahrenheit" temperature={temp} onTemperatureChange={setTemp} />
    </div>
  );
}`,
    explanation:
      "By lifting `temp` to `Calculator`, both inputs stay synchronized without duplicate state or complex syncing events.",
    moduleSlug: "state-lifting",
    category: "react",
    language: "javascript",
  },
  {
    question: "What are Higher-Order Components (HOC) in React?",
    answer:
      "A Higher-Order Component (HOC) is an advanced technique in React for reusing component logic. A HOC is a pure function that takes a component as an argument and returns a new enhanced component.",
    example: `import React from "react";

export function withAuthentication(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const isAuthenticated = Boolean(localStorage.getItem("authToken"));

    if (!isAuthenticated) {
      return <div>Access Denied. Please log in.</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage:
// const ProtectedDashboard = withAuthentication(Dashboard);`,
    explanation:
      "HOCs wrap components with reusable cross-cutting concerns like authentication, error logging, and analytics tracking.",
    moduleSlug: "higher-order-components",
    category: "react",
    language: "javascript",
  },
  {
    question:
      "What is the React Fiber Architecture and how does concurrent rendering work?",
    answer:
      "React Fiber is the complete rewrite of React's core reconciliation algorithm introduced in React 16. The legacy stack reconciler executed synchronously and could not be paused, causing dropped frames during heavy updates.\n\nFiber represents units of work as a linked list of **Fiber Nodes**. It enables **Concurrent Mode**: React can pause, resume, prioritize, or discard rendering work to keep the browser responsive to user clicks and typing.",
    example: `// Priority scheduling in React 18 Concurrent Mode
import { useState, useTransition } from "react";

export function FilterSearch() {
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 1. High priority urgent update: update text input immediately
    setInput(e.target.value);

    // 2. Low priority non-urgent update: can be interrupted by user typing
    startTransition(() => {
      setList(generateHugeList(e.target.value));
    });
  };

  return <input value={input} onChange={handleChange} />;
}`,
    explanation:
      "Fiber prioritizes the text input update so the user feels zero typing lag, while deferring the heavy list filtering in the background.",
    moduleSlug: "react-fiber-architecture",
    category: "react",
    language: "javascript",
  },

  // ==========================================
  // NEXT.JS (15 Modules)
  // ==========================================
  {
    question:
      "How does the Next.js App Router structure pages, layouts, and routing?",
    answer:
      "The Next.js App Router uses a folder-based routing hierarchy inside the `app` directory:\n\n• `page.tsx`: Defines the unique UI for a route segment.\n• `layout.tsx`: Shared UI that wraps child pages and preserves state across navigations.\n• `loading.tsx`: Automatically wraps routes in a React Suspense boundary.\n• `error.tsx`: Wraps route segments in an Error Boundary.\n• Route Groups `(group)`: Organize routes without altering URL paths.",
    example: `// app/dashboard/layout.tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">Dashboard Nav</aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return <h1>Welcome to your Dashboard</h1>;
}`,
    explanation:
      "Navigating between child pages inside `/dashboard` preserves the sidebar layout state without re-rendering or re-fetching sidebar data.",
    moduleSlug: "app-router-basics",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "What is the difference between React Server Components (RSC) and Client Components in Next.js?",
    answer:
      "By default, all components in the Next.js App Router are **React Server Components (RSC)**.\n\n• Server Components: Render exclusively on the server. They have direct access to backend resources (databases, secrets, file system), send zero JavaScript bundle bytes to the client, and cannot use state, effects, or browser APIs.\n• Client Components (marked with `'use client'`): Render on the server into HTML, then hydrate on the client. They support interactivity, `useState`, `useEffect`, and browser event handlers.",
    example: `// app/users/page.tsx (Server Component by default)
import db from "@/lib/db";
import { UserCard } from "./UserCard"; // Client component

export default async function UsersPage() {
  // Direct database query on server - zero client bundle weight!
  const users = await db.query("SELECT * FROM users LIMIT 10");

  return (
    <div>
      <h1>User Directory</h1>
      {users.map((u) => (
        <UserCard key={u.id} user={u} />
      ))}
    </div>
  );
}`,
    explanation:
      "Server Components keep heavy backend libraries and database logic off the client device, resulting in significantly faster mobile load times.",
    moduleSlug: "server-components",
    category: "nextjs",
    language: "typescript",
  },
  {
    question: "How does data fetching and caching work in Next.js?",
    answer:
      "Next.js extends the native `fetch` API to provide fine-grained caching and revalidation controls on the server:\n\n• Default (cached): Reuses cached data indefinitely.\n• Time-based (`next: { revalidate: 60 }`): Revalidates data in the background after 60 seconds.\n• Dynamic (`cache: 'no-store'`): Always fetches fresh data on every request.",
    example: `export default async function ProductPage({ params }: { params: { id: string } }) {
  // Revalidate price cache every 60 seconds
  const res = await fetch(\`https://api.store.com/products/\${params.id}\`, {
    next: { revalidate: 60, tags: ["products"] }
  });
  const product = await res.json();

  return <div>{product.title} - \${product.price}</div>;
}`,
    explanation:
      "Combining cache tags with `revalidateTag('products')` allows programmatic on-demand cache invalidation after mutations.",
    moduleSlug: "data-fetching-caching",
    category: "nextjs",
    language: "typescript",
  },
  {
    question: "What is the difference between SSG, SSR, and ISR in Next.js?",
    answer:
      "• SSG (Static Site Generation): HTML is generated at build time. Ultra-fast TTFB via CDN edge delivery.\n• SSR (Server-Side Rendering): HTML is generated dynamically on each request. Best for user-personalized, real-time data.\n• ISR (Incremental Static Regeneration): Serves static HTML while regenerating pages in the background as requests arrive.",
    example: `// Pre-render static paths at build time (SSG)
export async function generateStaticParams() {
  const posts = await getTopPosts();
  return posts.map((post) => ({ slug: post.slug }));
}`,
    explanation:
      "Generating static params at build time serves thousands of content pages instantly from global CDN edges with zero database queries.",
    moduleSlug: "static-vs-server-rendering-ssgssr",
    category: "nextjs",
    language: "typescript",
  },
  {
    question: "How do API Routes and Route Handlers work in Next.js?",
    answer:
      "Route Handlers (`route.ts`) define custom request handlers for a given route using the Web Request and Response APIs. They support standard HTTP verbs: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.",
    example: `// app/api/orders/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  
  if (!body.itemId) {
    return NextResponse.json({ error: "itemId required" }, { status: 400 });
  }

  // Process order in database
  return NextResponse.json({ success: true, orderId: "ord_101" }, { status: 201 });
}`,
    explanation:
      "Route Handlers run in Node.js or Edge runtime environments, providing complete serverless API endpoints within your Next.js application.",
    moduleSlug: "api-routes",
    category: "nextjs",
    language: "typescript",
  },
  {
    question: "How does Middleware work in Next.js and when should you use it?",
    answer:
      "Next.js Middleware (`middleware.ts`) runs before a request is completed. It executes on the lightweight Edge Runtime, allowing request interception, header modification, rewriting, redirects, and session validation before pages render.",
    example: `// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // Protect all /admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};`,
    explanation:
      "Middleware rejects unauthenticated requests at the Edge before rendering or running database queries, enhancing performance and security.",
    moduleSlug: "middleware",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "How does Dynamic Routing and Catch-all Segments work in Next.js?",
    answer:
      "• Dynamic Segments: Folder named with brackets `[slug]`, accessible via `params.slug`.\n• Catch-all Segments: `[...slug]` matches all subsequent path segments into an array.\n• Optional Catch-all: `[[...slug]]` also matches the base route without segments.",
    example: `// app/docs/[...slug]/page.tsx
export default async function DocPage({ params }: { params: { slug: string[] } }) {
  // Navigating to /docs/api/v1/auth makes params.slug = ['api', 'v1', 'auth']
  return <div>Document Section: {params.slug.join(" > ")}</div>;
}`,
    explanation:
      "Catch-all routes are ideal for documentation portals, multi-level category navigation, and CMS-driven landing pages.",
    moduleSlug: "dynamic-routing",
    category: "nextjs",
    language: "typescript",
  },
  {
    question: "How does next/image optimize images for core web vitals?",
    answer:
      "The `next/image` component automatically:\n1. Converts images to modern formats (AVIF/WebP).\n2. Resizes images based on device screen sizes using `sizes`.\n3. Prevents Cumulative Layout Shift (CLS) by requiring explicit width/height or `fill`.\n4. Lazy-loads images by default.",
    example: `import Image from "next/image";

export function HeroBanner() {
  return (
    <div className="relative h-96 w-full">
      <Image
        src="/hero-banner.jpg"
        alt="Hero visual"
        fill
        priority // Preloads critical above-the-fold image for Largest Contentful Paint (LCP)
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
      />
    </div>
  );
}`,
    explanation:
      "Using `priority` on above-the-fold hero banners optimizes the Largest Contentful Paint (LCP) Core Web Vital score.",
    moduleSlug: "image-optimization",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "How does Incremental Static Regeneration (ISR) update static content in production?",
    answer:
      "ISR allows updating static pages in the background without rebuilding the entire website. When a request comes in after the `revalidate` period, Next.js serves the cached page while asynchronously triggering a regeneration.",
    example: `// app/blog/[id]/page.tsx
export const revalidate = 300; // Regenerate at most once every 5 minutes

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id);
  return <article>{post.content}</article>;
}`,
    explanation:
      "ISR provides the speed of static sites with the freshness of dynamic sites, handling millions of views without straining origin databases.",
    moduleSlug: "incremental-static-regeneration",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "What is the difference between Layouts and Templates in the Next.js App Router?",
    answer:
      "• Layouts (`layout.tsx`): Preserve state across navigation, do not re-render, and do not re-mount child DOM nodes.\n• Templates (`template.tsx`): Similar to layouts, but create a brand new instance for each child route navigation. State is reset, and `useEffect` hooks re-run. Ideal for enter/exit animations and page view tracking.",
    example: `// app/template.tsx
"use client";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Runs on EVERY page navigation!
    console.log("Track page view analytics");
  }, []);

  return <div className="animate-fade-in">{children}</div>;
}`,
    explanation:
      "Use `template.tsx` when you need animations or analytics that must fire on every page transition.",
    moduleSlug: "layouts-templates",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "How does the Metadata API handle SEO and Open Graph tags in Next.js?",
    answer:
      "Next.js supports static metadata objects or dynamic metadata functions (`generateMetadata`) to inject `<title>`, `<meta>`, and OpenGraph tags into the HTML document `<head>` on the server.",
    example: `import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await fetchItem(params.id);
  return {
    title: \`\${item.title} | Learna\`,
    description: item.summary,
    openGraph: {
      images: [item.coverImage]
    }
  };
}`,
    explanation:
      "Server-rendered metadata guarantees search engines and social media scrapers (Twitter, LinkedIn) receive accurate OpenGraph previews.",
    moduleSlug: "metadata-api",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "How does Next.js handle environment variables and public exposure?",
    answer:
      "By default, environment variables in `.env` are private and accessible **only on the server** (Node.js runtime).\n\nTo expose a variable to the browser/client-side code, it must be prefixed with `NEXT_PUBLIC_`.",
    example: `# .env.local
DATABASE_URL="postgres://admin:secret@localhost:5432/app" # PRIVATE: Server only!
NEXT_PUBLIC_API_URL="https://api.production.com"          # PUBLIC: Exposed to client JS!`,
    explanation:
      "The `NEXT_PUBLIC_` prefix prevents accidentally leaking database credentials and secret API keys to the browser bundle.",
    moduleSlug: "environment-variables",
    category: "nextjs",
    language: "bash",
  },
  {
    question:
      "How do Server Actions perform form mutations without API routes in Next.js?",
    answer:
      "Server Actions are asynchronous functions that execute directly on the server, invoked from forms or event handlers. Annotated with `'use server'`.\n\nThey eliminate the need to write separate REST API endpoints for form submissions.",
    example: `// app/actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title");
  await saveToDatabase({ title });
  revalidatePath("/posts"); // Invalidate cache and update UI
}

// In component:
// <form action={createPost}><input name="title" /><button>Submit</button></form>`,
    explanation:
      "Server Actions work with progressive enhancement: forms can submit even if JavaScript has not finished loading on the client.",
    moduleSlug: "route-handlers",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "How does Streaming and Suspense reduce Time-to-First-Byte (TTFB) in Next.js?",
    answer:
      "Streaming allows breaking down the page's HTML into smaller chunks and progressively sending them from the server to the client over an open HTTP connection.\n\nFast parts of the page (like headers and sidebars) render immediately, while slow data-fetching components stream in as their promises resolve.",
    example: `import { Suspense } from "react";
import { RecentOrders, OrdersSkeleton } from "./Orders";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard (Renders immediately!)</h1>
      {/* Streaming slow data component */}
      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrders />
      </Suspense>
    </div>
  );
}`,
    explanation:
      "Streaming prevents slow backend queries from blocking initial page rendering, significantly improving perceived user responsiveness.",
    moduleSlug: "streaming-suspense",
    category: "nextjs",
    language: "typescript",
  },
  {
    question:
      "What is the difference between Node.js and Edge Runtime deployment in Next.js?",
    answer:
      "• Node.js Runtime: Default environment. Full access to Node.js APIs (`fs`, `child_process`), npm packages, and native C++ bindings.\n• Edge Runtime: Lightweight V8 environment based on Web standard APIs. Starts instantly with zero cold boot time, deployed across global CDN edges, but does not support full Node.js modules.",
    example: `// Opt into Edge Runtime for instant global execution
export const runtime = "edge";

export async function GET() {
  return new Response("Hello from Edge CDN!");
}`,
    explanation:
      "Edge runtime is ideal for geolocation routing, lightweight API proxies, and A/B test variations with sub-10ms global latency.",
    moduleSlug: "deployment-edge-runtime",
    category: "nextjs",
    language: "typescript",
  },
];
