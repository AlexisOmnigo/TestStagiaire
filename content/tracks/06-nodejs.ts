import type { Track } from "../types";

export const track: Track = {
  slug: "nodejs",
  order: 6,
  title: "Node.js",
  tagline: "JavaScript outside the browser: servers, scripts and APIs",
  outcome:
    "Understand what runs behind your Next.js app: write Node scripts, read files and env vars safely, build and route an HTTP API, use middleware, and keep the event loop free.",
  badge: "NODE",
  color: "#5fa04e",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. What Node is
    // ─────────────────────────────────────────────────────────────
    {
      slug: "what-is-node",
      title: "What Node.js actually is",
      summary: "V8 + libuv + a standard library: JavaScript with access to files, the network and the OS, built around non-blocking I/O.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "For its first 14 years, JavaScript only ran inside browsers. In 2009, Ryan Dahl took Chrome's JavaScript engine (**V8**), bolted on a library for talking to the operating system (**libuv**), and added a set of built-in modules for files, networking and processes. That's **Node.js**: not a language, not a framework, but a *runtime* — a program that executes JavaScript files on a computer or server.",
        },
        {
          type: "p",
          text: "Why should you care? Because almost everything in your stack runs on it: `npm`, the Next.js dev server, the server side of every Next.js page and route handler, Vercel Functions, your Railway workers, the Tailwind compiler, ESLint, the Supabase and Shopify CLIs. When something breaks *on the server*, it's Node you're debugging.",
        },
        { type: "h", text: "The three pieces" },
        {
          type: "table",
          rows: [
            ["Piece", "What it does", "Example"],
            ["V8", "Compiles and runs your JavaScript (same engine as Chrome)", "`const total = items.reduce(...)`"],
            ["libuv", "Event loop + async I/O: files, sockets, timers, a small thread pool", "Waiting for Postgres without freezing"],
            ["Built-in modules", "The Node standard library, imported with the `node:` prefix", "`node:fs`, `node:http`, `node:path`, `node:crypto`"],
          ],
        },
        {
          type: "steps",
          items: [
            { title: "You type `node scripts/send-invoices.js`", text: "The OS starts the `node` program and gives it your file path as an argument." },
            { title: "Node loads the file", text: "It decides if it's an ES module or CommonJS (next lesson), resolves imports, and hands the code to V8." },
            { title: "V8 runs the top-level code", text: "Synchronous code runs top to bottom. Async work (reading a file, an HTTP call) is handed to libuv with a callback." },
            { title: "The event loop takes over", text: "While anything is still pending (a timer, an open server socket, a file read), Node keeps looping and calls your callbacks as results come in." },
            { title: "Nothing left to do → exit", text: "When no work is pending, the process exits with code `0`. A server never exits because its listening socket is always pending." },
          ],
        },
        { type: "h", text: "Browser vs Node" },
        {
          type: "table",
          rows: [
            ["", "Browser", "Node.js"],
            ["DOM (`document`, `window`)", "Yes", "No — there's no page"],
            ["Global object", "`window` / `globalThis`", "`global` / `globalThis`"],
            ["File system", "No (sandboxed)", "Yes — `node:fs`"],
            ["Environment & process info", "No", "`process.env`, `process.argv`, `process.exit()`"],
            ["`fetch`, `URL`, `AbortController`, `crypto.randomUUID`", "Yes", "Yes (built in since Node 18)"],
            ["CORS restrictions", "Yes", "No — a server can call any URL"],
            ["Who picks the version", "Your visitor's browser", "You (`package.json` `engines`, Vercel/Railway settings)"],
            ["Security model", "Sandboxed, untrusted code", "Full access to the machine: be careful what you run"],
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "globals.mjs",
          code: `// No import needed for these — they're globals in Node:
console.log(process.version);      // "v22.20.0"
console.log(process.platform);     // "darwin", "linux", "win32"
console.log(process.cwd());        // folder you ran \`node\` from
console.log(process.argv);         // ["/usr/bin/node", "/path/globals.mjs", ...your args]
console.log(globalThis === global); // true — globalThis works everywhere, prefer it

console.log(typeof window);        // "undefined" — no browser here
console.log(typeof document);      // "undefined"`,
        },
        { type: "h", text: "Running code" },
        {
          type: "code",
          lang: "bash",
          title: "terminal",
          code: `node                      # opens the REPL (Read-Eval-Print Loop). Ctrl+D to quit
> 0.1 + 0.2
0.30000000000000004
> .help                   # REPL commands: .exit, .load, .editor…

node invoices.js          # run a file
node --watch server.js    # re-run automatically when files change (built in since Node 18)
node -e "console.log(crypto.randomUUID())"   # run a one-liner
node --version            # check which Node you have`,
        },
        { type: "h", text: "Event-driven, non-blocking I/O" },
        {
          type: "p",
          text: "Here's the idea that makes Node good at servers. Your JavaScript runs on **one main thread**. When it needs something slow — a database row, a file, an HTTP response from Shopify — it doesn't sit and wait. It asks libuv to do it, registers a callback (or a Promise), and immediately moves on to the next request. When the result arrives, the event loop calls your code back.",
        },
        {
          type: "p",
          text: "Think of a single waiter in a busy café. They don't stand at the espresso machine for 40 seconds per coffee; they take an order, pass it to the barista, take the next order, and deliver drinks as they're ready. One waiter, many tables. The waiter is your JS thread; the barista is the OS and libuv's thread pool.",
        },
        {
          type: "run",
          title: "Waiting in sequence vs. waiting together",
          code: `// Simulated I/O: each "query" takes ~150 ms
const query = (name, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(name + " loaded"), ms));

let start = Date.now();
await query("clients");
await query("invoices");
await query("leads");
console.log("one after another:", Date.now() - start, "ms");

start = Date.now();
const results = await Promise.all([query("clients"), query("invoices"), query("leads")]);
console.log(results);
console.log("all at once:     ", Date.now() - start, "ms");`,
        },
        {
          type: "p",
          text: "Same three queries, a third of the time. The single thread wasn't doing anything during the wait — it was free. That's why one Node process can juggle thousands of open connections. The flip side: if *your* code hogs the thread (a giant loop, a synchronous file read in a request handler), **everyone** waits. We'll come back to this in the last lesson.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where Node runs in your stack",
          text: "In Next.js, Server Components, Server Actions and `route.ts` handlers run in Node.js on the server (on Vercel, inside Vercel Functions). Client Components run in the browser. That's why you can read `process.env.SUPABASE_SERVICE_ROLE_KEY` in a Server Component but not in a `\"use client\"` file. Next.js also has an *Edge* runtime, which is **not** Node: it lacks `node:fs` and most built-ins.",
        },
        {
          type: "challenge",
          title: "Load the dashboard in parallel",
          prompt: "Write `async function loadDashboard(api)` that calls `api.getClients()`, `api.getInvoices()` and `api.getLeads()` (each returns a Promise) and resolves to `{ clients, invoices, leads }`. The three calls are independent, so they must run **at the same time**, not one after another.",
          starter: `async function loadDashboard(api) {
  const clients = await api.getClients();
  const invoices = await api.getInvoices();
  const leads = await api.getLeads();
  return { clients, invoices, leads };
}`,
          solution: `async function loadDashboard(api) {
  const [clients, invoices, leads] = await Promise.all([
    api.getClients(),
    api.getInvoices(),
    api.getLeads(),
  ]);
  return { clients, invoices, leads };
}`,
          tests: [
            {
              name: "returns clients, invoices and leads",
              code: `const api = {
  getClients: async () => ["Voltix", "Pro Quai"],
  getInvoices: async () => [{ id: "INV-001", total: 1250 }],
  getLeads: async () => [],
};
const d = await loadDashboard(api);
return d.clients.length === 2 && d.invoices[0].id === "INV-001" && Array.isArray(d.leads);`,
            },
            {
              name: "the three calls run concurrently (3 × 120 ms finishes in < 250 ms)",
              code: `const slow = (v) => () => new Promise((r) => setTimeout(() => r(v), 120));
const api = { getClients: slow([]), getInvoices: slow([]), getLeads: slow([]) };
const start = Date.now();
await loadDashboard(api);
return Date.now() - start < 250;`,
            },
            {
              name: "if one call fails, loadDashboard rejects",
              code: `const api = {
  getClients: async () => [],
  getInvoices: async () => { throw new Error("Supabase down"); },
  getLeads: async () => [],
};
try {
  await loadDashboard(api);
  return false;
} catch (e) {
  return e.message === "Supabase down";
}`,
            },
          ],
          hint: "Start all three Promises first, then wait for them together with `Promise.all([...])` and destructure the resulting array.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What is Node.js?",
              options: [
                "A JavaScript framework like React",
                "A runtime that executes JavaScript outside the browser, built on V8 and libuv",
                "A new programming language based on JavaScript",
                "A database for JavaScript apps",
              ],
              answer: 1,
              why: "Node is a runtime: V8 executes the JS, libuv provides the event loop and async I/O, and Node adds built-in modules like `fs` and `http`.",
            },
            {
              q: "Which of these is NOT available in Node.js?",
              options: ["`fetch`", "`process.env`", "`globalThis`", "`document.querySelector`"],
              answer: 3,
              why: "There's no page in Node, so no DOM. `fetch`, `globalThis` and `process` all exist.",
            },
            {
              q: "Why can a single Node process serve many requests at once?",
              options: [
                "While waiting on I/O (database, network, files), the JS thread is free to handle other requests",
                "Node starts a new thread for every request",
                "V8 runs JavaScript in parallel on all CPU cores automatically",
              ],
              answer: 0,
              why: "Node's I/O is non-blocking: slow work is handed off and the event loop calls you back. One thread, many in-flight requests — as long as nobody hogs the thread with CPU work.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Modules
    // ─────────────────────────────────────────────────────────────
    {
      slug: "modules-esm-commonjs",
      title: "Modules: ESM vs CommonJS",
      summary: "Two module systems live side by side in Node. Learn how each works, how Node picks one, and how to avoid the interop traps.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "A real project is hundreds of files. **Modules** let each file keep its own private scope and explicitly choose what it shares (exports) and what it needs (imports). Without them, every variable would be global and two files declaring `total` would clash.",
        },
        {
          type: "p",
          text: "JavaScript had no module system until 2015, so Node invented one in 2009: **CommonJS** (`require` / `module.exports`). Then the language standardised **ES Modules** (`import` / `export`), which browsers and bundlers use. Node supports both, and a lot of the ecosystem's confusion comes from having two.",
        },
        {
          type: "compare",
          left: {
            label: "CommonJS (.cjs, or .js by default)",
            lang: "js",
            code: `// taxes.cjs
const TPS = 0.05;
const TVQ = 0.09975;

function withTaxes(amount) {
  return amount * (1 + TPS + TVQ);
}

module.exports = { withTaxes, TPS, TVQ };

// invoice.cjs
const { withTaxes } = require("./taxes.cjs");
const fs = require("node:fs");
console.log(withTaxes(1000)); // 1149.75`,
          },
          right: {
            label: "ES Modules (.mjs, or .js with \"type\": \"module\")",
            lang: "js",
            code: `// taxes.mjs
const TPS = 0.05;
const TVQ = 0.09975;

export function withTaxes(amount) {
  return amount * (1 + TPS + TVQ);
}

export { TPS, TVQ };

// invoice.mjs
import { withTaxes } from "./taxes.mjs";
import fs from "node:fs";
console.log(withTaxes(1000)); // 1149.75`,
          },
        },
        { type: "h", text: "The real differences" },
        {
          type: "table",
          rows: [
            ["", "CommonJS", "ES Modules"],
            ["Syntax", "`require()` / `module.exports`", "`import` / `export`"],
            ["When imports resolve", "At runtime, line by line (synchronous)", "Before any code runs (static, analysable)"],
            ["Can be conditional", "Yes: `if (x) require(\"a\")`", "Static `import` no; use `await import(\"a\")`"],
            ["Top-level `await`", "No", "Yes"],
            ["`__dirname`, `__filename`", "Yes", "No — use `import.meta.dirname` / `import.meta.filename`"],
            ["File extensions in relative imports", "Optional (`./taxes`)", "Required (`./taxes.js`)"],
            ["Tree-shaking by bundlers", "Hard", "Easy (that's why the web uses it)"],
          ],
        },
        { type: "h", text: "How Node decides which one a file is" },
        {
          type: "list",
          items: [
            "`.mjs` → always ESM. `.cjs` → always CommonJS.",
            "`.js` → looks at the nearest `package.json`: `\"type\": \"module\"` means ESM, `\"type\": \"commonjs\"` (or no field) means CommonJS.",
            "Recent Node versions (22.7+) also *detect* ESM syntax in an ambiguous `.js` file and run it as ESM — handy, but set `\"type\"` explicitly so nobody has to guess.",
          ],
        },
        {
          type: "code",
          lang: "json",
          title: "package.json",
          code: `{
  "name": "omnigo-scripts",
  "type": "module"
}`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Use the node: prefix for built-ins",
          text: "Write `import fs from \"node:fs\"`, not `\"fs\"`. The prefix makes it obvious the module is built in, can't be hijacked by an npm package with the same name, and some newer built-ins (`node:test`, `node:sqlite`) only exist with the prefix.",
        },
        { type: "h", text: "How require() works under the hood" },
        {
          type: "p",
          text: "CommonJS is surprisingly simple. Node wraps each file's code in a function, gives it a fresh `module` object, runs it once, and **caches** `module.exports`. Every later `require` of the same file returns the cached object — which is why a module's top-level code runs only once, and why two files that require the same module share its state.",
        },
        {
          type: "run",
          title: "A hand-made module wrapper",
          code: `// What Node does (roughly) with the file taxes.cjs:
function taxesModule(exports, require, module, __filename, __dirname) {
  // ---- your file's code starts here ----
  console.log("taxes.cjs is running");
  const TPS = 0.05;
  module.exports = { withTPS: (amount) => amount * (1 + TPS) };
  // ---- your file's code ends here ----
}

const cache = {};
function myRequire(name) {
  if (cache[name]) return cache[name].exports; // already loaded → reuse
  const mod = { exports: {} };
  cache[name] = mod;
  taxesModule(mod.exports, myRequire, mod, "/app/taxes.cjs", "/app");
  return mod.exports;
}

const a = myRequire("./taxes.cjs");
const b = myRequire("./taxes.cjs"); // no second "is running" log
console.log(a.withTPS(200));
console.log("same object?", a === b);`,
        },
        { type: "h", text: "Interop pain points (and fixes)" },
        {
          type: "list",
          items: [
            "**ESM importing CommonJS** works: `import pkg from \"some-cjs-lib\"` gives you `module.exports` as the default. Named imports (`import { x }`) work only when Node can statically detect them — if one fails, use the default import and destructure.",
            "**CommonJS requiring ESM**: historically impossible (`ERR_REQUIRE_ESM`). Since Node 22.12, `require()` can load ESM files as long as they don't use top-level `await`. In older code you'll see `const { x } = await import(\"esm-lib\")` as the workaround.",
            "**`__dirname is not defined`** in ESM: replace with `import.meta.dirname` (Node 20.11+).",
            "**`Cannot find module './taxes'`** in ESM: add the extension — `./taxes.js`.",
            "**Importing JSON** in ESM needs an import attribute: `import data from \"./rates.json\" with { type: \"json\" }`.",
            "**`exports = { ... }`** in CommonJS does nothing: it re-points the local variable. Use `module.exports = { ... }` or `exports.name = ...`.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "In your Next.js projects",
          text: "You always write `import`/`export` in Next.js because a bundler (Turbopack) processes your code. But config and scripts run in plain Node, which is why you see `next.config.mjs` or `next.config.ts`, and why a `scripts/seed.js` might fail with `Cannot use import statement outside a module` until you add `\"type\": \"module\"` or rename it `.mjs`.",
        },
        {
          type: "challenge",
          title: "Build your own require()",
          prompt: "Write `createRequire(registry)`. `registry` maps module names to factory functions `(module, exports, require) => { ... }`. It returns a `require(name)` function that: runs the factory with a fresh `module = { exports: {} }`, returns `module.exports`, **caches** the result so each factory runs only once, passes itself as `require` so modules can load other modules, and throws an `Error` for unknown names.",
          starter: `function createRequire(registry) {
  return function require(name) {
    const module = { exports: {} };
    // TODO: run the factory for \`name\`, cache the module, handle unknown names
    return module.exports;
  };
}`,
          solution: `function createRequire(registry) {
  const cache = {};
  function require(name) {
    if (cache[name]) return cache[name].exports;
    const factory = registry[name];
    if (!factory) throw new Error("Cannot find module '" + name + "'");
    const module = { exports: {} };
    cache[name] = module; // cache before running, like Node (handles cycles)
    factory(module, module.exports, require);
    return module.exports;
  }
  return require;
}`,
          tests: [
            {
              name: "returns whatever the module assigns to module.exports",
              code: `const req = createRequire({
  invoice: (module) => { module.exports = { total: 1149.75 }; },
});
return req("invoice").total === 1149.75;`,
            },
            {
              name: "the exports.name = ... shorthand works",
              code: `const req = createRequire({
  rates: (module, exports) => { exports.tps = 0.05; exports.tvq = 0.09975; },
});
const r = req("rates");
return r.tps === 0.05 && r.tvq === 0.09975;`,
            },
            {
              name: "a module's code runs only once (cached)",
              code: `let runs = 0;
const req = createRequire({
  db: (module) => { runs++; module.exports = { connected: true }; },
});
const a = req("db");
const b = req("db");
return runs === 1 && a === b;`,
            },
            {
              name: "modules can require other modules",
              code: `const req = createRequire({
  rates: (module) => { module.exports = { tps: 0.05 }; },
  taxes: (module, exports, require) => {
    const { tps } = require("rates");
    module.exports = (amount) => amount * (1 + tps);
  },
});
return req("taxes")(100) === 105;`,
            },
            {
              name: "an unknown module throws an Error",
              code: `const req = createRequire({});
try {
  req("left-pad");
  return false;
} catch (e) {
  return e instanceof Error;
}`,
            },
          ],
          hint: "Keep a `cache` object outside the inner function. Look up `registry[name]`, create `{ exports: {} }`, store it in the cache, call `factory(module, module.exports, require)`, return `module.exports`. Declare `require` as a named function so you can pass it to the factory.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Your `package.json` has `\"type\": \"module\"`. How is `scripts/report.cjs` treated?",
              options: ["As an ES module", "As CommonJS", "Node refuses to run it", "It depends on its contents"],
              answer: 1,
              why: "File extensions win: `.cjs` is always CommonJS and `.mjs` is always ESM, whatever `\"type\"` says.",
            },
            {
              q: "In an ES module, what replaces `__dirname`?",
              options: ["`process.cwd()`", "`module.dirname`", "`import.meta.dirname`", "`globalThis.__dirname`"],
              answer: 2,
              why: "`import.meta.dirname` is the folder of the current file. `process.cwd()` is where you *launched* Node from, which is often different.",
            },
            {
              q: "Why does a module's top-level `console.log` print only once even if 10 files `require` it?",
              options: [
                "Node caches each module's exports after the first load",
                "console.log deduplicates identical messages",
                "Only the first require is allowed; the others throw",
              ],
              answer: 0,
              why: "Modules are singletons: evaluated once, then served from cache. ESM behaves the same way.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. npm & package.json
    // ─────────────────────────────────────────────────────────────
    {
      slug: "npm-and-package-json",
      title: "npm & package.json deep dive",
      summary: "Scripts, dependency types, version ranges, lockfiles, npx, workspaces, engines — and how to not get hacked through node_modules.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "`package.json` is your project's ID card and control panel: what it's called, what it depends on, which commands it exposes, and which Node version it needs. `npm` (Node Package Manager) reads it to install code from the npm registry into `node_modules`. Understanding it means fewer \"works on my machine\" bugs and fewer surprise breakages on Vercel.",
        },
        {
          type: "code",
          lang: "json",
          title: "package.json (a typical agency Next.js app)",
          code: `{
  "name": "voltix-portal",
  "version": "1.4.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "db:types": "supabase gen types typescript --linked > lib/database.types.ts",
    "sync:products": "node --env-file=.env.local scripts/sync-shopify.js"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.2.0",
    "@supabase/supabase-js": "^2.58.0",
    "@clerk/nextjs": "^6.33.0"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "eslint": "^9.36.0",
    "@types/node": "^22.18.0"
  },
  "engines": {
    "node": ">=22"
  }
}`,
        },
        { type: "h", text: "Scripts" },
        {
          type: "list",
          items: [
            "`npm run <name>` runs a script. `npm start` and `npm test` work without `run`.",
            "Inside scripts, `node_modules/.bin` is on the PATH — that's why `\"build\": \"next build\"` works without a global install of `next`.",
            "Pass extra flags after `--`: `npm run lint -- --fix`.",
            "`pre<name>` / `post<name>` scripts run automatically before/after `<name>` (e.g. `prebuild`). Use sparingly; they hide behaviour.",
            "Scripts are just shell commands: keep them short and cross-platform, and move complex logic into a `scripts/*.js` file.",
          ],
        },
        { type: "h", text: "Dependency types" },
        {
          type: "table",
          rows: [
            ["Field", "Meaning", "Examples"],
            ["`dependencies`", "Needed at runtime by the app", "`next`, `react`, `@supabase/supabase-js`, `zod`"],
            ["`devDependencies`", "Needed only to develop/build/test", "`typescript`, `eslint`, `@types/*`, `vitest`"],
            ["`peerDependencies`", "A library saying \"I need the host app to provide this\"", "A React component lib peers on `react`"],
            ["`optionalDependencies`", "Install if possible, don't fail if not", "Platform-specific native binaries"],
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Does the dev/prod split matter for Next.js?",
          text: "Less than you'd think: Next.js bundles what it needs at build time, and Vercel installs devDependencies to run the build. It matters a lot for plain Node servers deployed with `npm ci --omit=dev` (smaller, safer images) and for libraries you publish.",
        },
        { type: "h", text: "Version ranges (semver)" },
        {
          type: "p",
          text: "Versions follow **semantic versioning**: `MAJOR.MINOR.PATCH`. A major bump may break your code, a minor adds features, a patch fixes bugs. Ranges say which future versions you accept:",
        },
        {
          type: "table",
          rows: [
            ["Range", "Accepts", "Use when"],
            ["`19.2.0`", "Exactly 19.2.0", "You need full control"],
            ["`~5.9.3`", "5.9.3 up to (not incl.) 5.10.0 — patches only", "Tools that break on minors (TypeScript!)"],
            ["`^19.2.0`", "19.2.0 up to (not incl.) 20.0.0", "The default `npm install` writes"],
            ["`^0.4.2`", "0.4.2 up to 0.5.0 — below 1.0, minors may break", "Pre-1.0 packages"],
          ],
        },
        { type: "h", text: "The lockfile" },
        {
          type: "p",
          text: "Ranges are flexible, so two installs a month apart could pick different versions. `package-lock.json` records the **exact** version (and integrity hash) of every package in the tree. Commit it. On CI and servers use `npm ci`: it installs exactly what the lockfile says, fails if it disagrees with `package.json`, and starts from a clean `node_modules`.",
        },
        {
          type: "compare",
          left: {
            label: "npm install",
            lang: "bash",
            code: `# day-to-day development
npm install              # install everything, may update the lockfile
npm install zod          # add a dependency
npm install -D vitest    # add a devDependency
npm uninstall moment     # remove one
npm outdated             # see what's behind`,
          },
          right: {
            label: "npm ci",
            lang: "bash",
            code: `# CI, Docker, Railway, Vercel
npm ci                   # exact lockfile install, clean slate
npm ci --omit=dev        # production server: skip devDependencies

# never edit package-lock.json by hand`,
          },
        },
        { type: "h", text: "bin & npx" },
        {
          type: "p",
          text: "A package can expose command-line tools through its `\"bin\"` field; npm links them into `node_modules/.bin`. `npx <tool>` runs such a command: the local one if installed, otherwise it downloads it temporarily. That's how one-off generators work: `npx create-next-app@latest`, `npx supabase login`, `npx shadcn@latest add button`.",
        },
        {
          type: "code",
          lang: "json",
          title: "package.json of a tiny internal CLI",
          code: `{
  "name": "@omnigo/invoice-cli",
  "bin": { "invoice": "./bin/invoice.js" }
}
// after install, \`npx invoice --client voltix\` runs ./bin/invoice.js
// (the file starts with the line  #!/usr/bin/env node )`,
        },
        { type: "h", text: "engines, workspaces" },
        {
          type: "list",
          items: [
            "`\"engines\": { \"node\": \">=22\" }` documents the Node version you support. npm only warns by default, but **Vercel reads it** to pick the Node version for your build and functions. Pair it with an `.nvmrc` file so `nvm use` picks the same version locally.",
            "`\"workspaces\": [\"apps/*\", \"packages/*\"]` turns a repo into a **monorepo**: several packages (say a Next.js app and a shared `@omnigo/ui` library) installed together, linked to each other, with one lockfile. pnpm and Turborepo are popular for this at scale.",
          ],
        },
        { type: "h", text: "Supply-chain security" },
        {
          type: "p",
          text: "Every dependency is code from a stranger that runs with full access to your machine and your `.env`. Attacks are real: in September 2025, widely used packages such as `chalk` and `debug` were briefly published with malicious code after a maintainer was phished, and a self-spreading worm (\"Shai-Hulud\") stole tokens from developers' machines through compromised packages.",
        },
        {
          type: "list",
          items: [
            "Commit the lockfile and use `npm ci` so a new malicious version can't sneak in on deploy.",
            "Run `npm audit` to list known vulnerabilities; `npm audit fix` applies compatible upgrades. Read before you `--force`.",
            "Check before adding: weekly downloads, last publish, maintainers, typos in the name (`reactt`, `supabase-jss`).",
            "Install scripts (`postinstall`) run arbitrary code. `npm install --ignore-scripts` is a strong default for untrusted packages; pnpm doesn't run them unless allowed.",
            "Prefer fewer dependencies. Node now has `fetch`, `crypto.randomUUID`, `util.parseArgs`, `node:test` and `--env-file` built in.",
          ],
        },
        {
          type: "run",
          title: "Inspect a package.json",
          code: `const pkg = JSON.parse(\`{
  "name": "voltix-portal",
  "scripts": { "dev": "next dev", "build": "next build", "lint": "eslint ." },
  "dependencies": { "next": "^16.0.0", "react": "^19.2.0", "@supabase/supabase-js": "^2.58.0" },
  "devDependencies": { "typescript": "~5.9.3", "eslint": "^9.36.0" }
}\`);

console.log("Scripts you can run:");
for (const [name, cmd] of Object.entries(pkg.scripts)) {
  console.log(\`  npm run \${name.padEnd(6)} → \${cmd}\`);
}

const all = { ...pkg.dependencies, ...pkg.devDependencies };
const exact = Object.entries(all).filter(([, range]) => !/^[\\^~]/.test(range));
console.log("Total direct deps:", Object.keys(all).length);
console.log("Pinned to an exact version:", exact.length ? exact : "none");`,
        },
        {
          type: "challenge",
          title: "Does this version satisfy the range?",
          prompt: "Write `satisfies(version, range)` for versions like `\"1.4.2\"` and ranges that are either exact (`\"1.4.2\"`), tilde (`\"~1.4.2\"` → `>=1.4.2 <1.5.0`) or caret (`\"^1.4.2\"` → `>=1.4.2 <2.0.0`). Caret below 1.0 is stricter: `^0.4.2` → `<0.5.0`, and `^0.0.3` → `<0.0.4`. Return `true` or `false`.",
          starter: `function satisfies(version, range) {
  return version === range;
}`,
          solution: `const parse = (v) => v.split(".").map(Number);

function compare(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function satisfies(version, range) {
  const v = parse(version);
  const op = range[0];
  if (op !== "^" && op !== "~") return compare(v, parse(range)) === 0;

  const min = parse(range.slice(1));
  if (compare(v, min) < 0) return false;

  let max;
  if (op === "~") max = [min[0], min[1] + 1, 0];
  else if (min[0] > 0) max = [min[0] + 1, 0, 0];
  else if (min[1] > 0) max = [0, min[1] + 1, 0];
  else max = [0, 0, min[2] + 1];

  return compare(v, max) < 0;
}`,
          tests: [
            { name: "exact range only matches the same version", code: `return satisfies("19.2.0", "19.2.0") && !satisfies("19.2.1", "19.2.0");` },
            {
              name: "caret accepts newer minors/patches, rejects the next major and older versions",
              code: `return satisfies("19.3.1", "^19.2.0") && satisfies("19.2.0", "^19.2.0")
  && !satisfies("20.0.0", "^19.2.0") && !satisfies("19.1.9", "^19.2.0");`,
            },
            {
              name: "compares numerically, not as text (1.10.0 > 1.9.0)",
              code: `return satisfies("1.10.0", "^1.9.0") && !satisfies("1.8.0", "^1.9.0");`,
            },
            {
              name: "tilde accepts patches only",
              code: `return satisfies("5.9.7", "~5.9.3") && !satisfies("5.10.0", "~5.9.3") && !satisfies("5.9.2", "~5.9.3");`,
            },
            {
              name: "caret below 1.0 locks the minor (and ^0.0.x locks the patch)",
              code: `return satisfies("0.4.9", "^0.4.2") && !satisfies("0.5.0", "^0.4.2")
  && satisfies("0.0.3", "^0.0.3") && !satisfies("0.0.4", "^0.0.3");`,
            },
          ],
          hint: "Split each version into three numbers. Compute the exclusive upper bound from the operator (tilde: next minor; caret: bump the first non-zero part), then check `min <= version < max` with a small compare function that walks major, minor, patch.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which command should your CI or Railway build use to install dependencies?",
              options: ["`npm install`", "`npm update`", "`npx install`", "`npm ci`"],
              answer: 3,
              why: "`npm ci` installs exactly what the lockfile pins, from a clean slate, and fails if `package.json` and the lockfile disagree. Reproducible and safer.",
            },
            {
              q: "`\"typescript\": \"~5.9.3\"` allows which upgrade?",
              options: ["5.9.8", "5.10.0", "6.0.0", "None"],
              answer: 0,
              why: "Tilde allows patch updates within the same minor: `>=5.9.3 <5.10.0`.",
            },
            {
              q: "Why does `\"build\": \"next build\"` work even though you never installed `next` globally?",
              options: [
                "npm downloads it on every run",
                "npm adds `node_modules/.bin` to the PATH when running scripts",
                "Next.js is bundled with Node",
              ],
              answer: 1,
              why: "Packages with a `bin` field get linked into `node_modules/.bin`, which npm puts on the PATH for scripts. `npx` uses the same folder.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Files & paths
    // ─────────────────────────────────────────────────────────────
    {
      slug: "files-and-paths",
      title: "Files & paths",
      summary: "Read and write files with node:fs/promises, build paths safely with node:path, handle JSON, and stream large files line by line.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Browsers can't touch your disk; Node can. That's what makes it the tool for agency chores: importing a client's CSV of leads, generating a JSON report for a monthly meeting, writing Supabase seed data, migrating product exports from an old site to Shopify.",
        },
        { type: "h", text: "node:fs/promises" },
        {
          type: "p",
          text: "Node's `fs` module comes in three flavours: callbacks (`fs.readFile(path, cb)`, the 2009 style), synchronous (`fs.readFileSync`, blocks the thread) and Promises (`node:fs/promises`). Use the Promise API with `await` in almost all code.",
        },
        {
          type: "code",
          lang: "js",
          title: "scripts/report.mjs",
          code: `import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";

// Read text (always pass the encoding, or you get a Buffer of bytes)
const csv = await readFile("data/leads.csv", "utf8");

// Write text (creates the file or overwrites it)
await writeFile("out/summary.txt", "42 new leads this month\\n");

// Append instead of overwrite
import { appendFile } from "node:fs/promises";
await appendFile("logs/sync.log", \`\${new Date().toISOString()} sync ok\\n\`);

// Create nested folders (no error if they exist)
await mkdir("out/2026/10", { recursive: true });

// List a folder and get file info
for (const name of await readdir("invoices")) {
  const info = await stat(\`invoices/\${name}\`);
  console.log(name, info.size, "bytes");
}`,
        },
        {
          type: "code",
          lang: "js",
          title: "Reading and writing JSON",
          code: `import { readFile, writeFile } from "node:fs/promises";

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return fallback; // file doesn't exist yet
    throw err;                                   // invalid JSON, permissions… → real error
  }
}

async function writeJson(path, data) {
  // null, 2 → pretty-printed with 2-space indent, nice for git diffs
  await writeFile(path, JSON.stringify(data, null, 2) + "\\n");
}

const clients = await readJson("data/clients.json", []);
clients.push({ name: "Pro Quai", plan: "growth" });
await writeJson("data/clients.json", clients);`,
        },
        {
          type: "table",
          rows: [
            ["Error code", "Means"],
            ["`ENOENT`", "No such file or directory"],
            ["`EACCES` / `EPERM`", "Permission denied"],
            ["`EEXIST`", "Already exists (e.g. `mkdir` without `recursive`)"],
            ["`EISDIR`", "You tried to read a folder as a file"],
            ["`EROFS`", "Read-only file system (hello, serverless)"],
          ],
        },
        { type: "h", text: "node:path — never glue paths with +" },
        {
          type: "p",
          text: "Paths look like strings, but they have rules: Windows uses `\\`, macOS/Linux use `/`, and `\"data/\" + \"/leads.csv\"` gives a double slash. `node:path` handles all of it.",
        },
        {
          type: "code",
          lang: "js",
          title: "node:path essentials",
          code: `import path from "node:path";

path.join("data", "clients", "voltix.json");    // "data/clients/voltix.json"
path.join("data/", "/exports/", "../leads.csv"); // "data/leads.csv" — normalised
path.resolve("data", "leads.csv");              // absolute: "/Users/alexis/project/data/leads.csv"
path.basename("/exports/leads-2026-10.csv");     // "leads-2026-10.csv"
path.basename("/exports/leads-2026-10.csv", ".csv"); // "leads-2026-10"
path.extname("logo.final.png");                  // ".png"
path.dirname("/exports/2026/leads.csv");         // "/exports/2026"

// Paths relative to THIS file, not to where node was launched:
const dataFile = path.join(import.meta.dirname, "data", "leads.csv");`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Relative paths are relative to the cwd",
          text: "`readFile(\"data/leads.csv\")` resolves from `process.cwd()` — the folder you ran `node` from — not from the script's folder. Run the script from another directory and it breaks. Use `path.join(import.meta.dirname, ...)` when the file lives next to your code.",
        },
        {
          type: "run",
          title: "Path logic is just string logic",
          code: `// A simplified posix path.join, to see what normalising means
function join(...parts) {
  const out = [];
  for (const segment of parts.join("/").split("/")) {
    if (segment === "" || segment === ".") continue; // skip empty and "."
    if (segment === "..") out.pop();                  // go up one level
    else out.push(segment);
  }
  return out.join("/");
}

console.log(join("data/", "/exports/", "../leads.csv"));
console.log(join("invoices", "2026", ".", "10", "INV-042.pdf"));

// Build a safe output file name for each client
const clients = ["Voltix", "Pro Quai", "Boulangerie Ouellet & Fils"];
for (const name of clients) {
  const slug = name.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  console.log(join("reports", "2026-10", slug + ".json"));
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Path traversal",
          text: "Never build a path straight from user input: `path.join(\"uploads\", req.query.file)` with `file=../../.env` serves your secrets. Resolve the final path and check it still starts with the folder you intended, or better, look files up by ID.",
        },
        { type: "h", text: "Streams for big files" },
        {
          type: "p",
          text: "`readFile` loads the whole file into memory. Fine for a 50 KB config, a disaster for a 3 GB Shopify order export on a 512 MB Railway container. A **stream** reads the file in chunks (64 KB by default) so memory stays flat whatever the size.",
        },
        {
          type: "code",
          lang: "js",
          title: "scripts/count-orders.mjs",
          code: `import { createReadStream, createWriteStream } from "node:fs";
import { createInterface } from "node:readline";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

// 1. Process a huge CSV line by line
const lines = createInterface({ input: createReadStream("exports/orders.csv") });
let count = 0;
for await (const line of lines) {
  if (line.includes(",paid,")) count++;
}
console.log(count, "paid orders");

// 2. Compress a file: read → gzip → write, with backpressure handled for you
await pipeline(
  createReadStream("exports/orders.csv"),
  createGzip(),
  createWriteStream("exports/orders.csv.gz"),
);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Files on Vercel and Railway",
          text: "On Vercel, functions run on a **read-only** file system (only `/tmp` is writable, and it's wiped between invocations). Railway containers can write, but the disk is reset on every deploy unless you attach a Volume. Anything that must persist — uploads, generated PDFs — belongs in Supabase Storage or another object store, not on local disk.",
        },
        {
          type: "challenge",
          title: "Parse a CSV of leads",
          prompt: "A client exported their leads as CSV. Write `parseCsv(text)` that returns an array of objects, one per data row, using the first row as keys. Trim keys and values. It must handle: values in double quotes that contain commas (`\"Boulangerie Ouellet, Inc.\"`), doubled quotes inside quoted values (`\"\"` → `\"`), Windows line endings (`\\r\\n`), and blank lines (skip them). Values stay strings. Empty input returns `[]`.",
          starter: `function parseCsv(text) {
  const [header, ...rows] = text.split("\\n");
  const keys = header.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return Object.fromEntries(keys.map((k, i) => [k, values[i]]));
  });
}`,
          solution: `function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\\n" || c === "\\r") {
      if (c === "\\r" && text[i + 1] === "\\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }

  const nonBlank = rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
  if (nonBlank.length === 0) return [];
  const keys = nonBlank[0].map((k) => k.trim());
  return nonBlank.slice(1).map((r) =>
    Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()]))
  );
}`,
          tests: [
            {
              name: "parses a simple CSV using the header row as keys",
              code: `const rows = parseCsv("name,email,budget\\nVoltix,info@voltix.ca,5000\\nPro Quai,hello@proquai.ca,12000");
return rows.length === 2 && rows[1].name === "Pro Quai" && rows[0].email === "info@voltix.ca" && rows[0].budget === "5000";`,
            },
            {
              name: "keeps commas inside quoted values",
              code: `const rows = parseCsv('name,city\\n"Boulangerie Ouellet, Inc.",Laval');
return rows.length === 1 && rows[0].name === "Boulangerie Ouellet, Inc." && rows[0].city === "Laval";`,
            },
            {
              name: 'turns doubled quotes "" into a single quote',
              code: `const rows = parseCsv('name,note\\n"Studio ""Intik""",VIP');
return rows[0].name === 'Studio "Intik"' && rows[0].note === "VIP";`,
            },
            {
              name: "handles \\r\\n line endings, blank lines and a trailing newline",
              code: `const rows = parseCsv("name, email \\r\\nAXELR , axelr@example.com\\r\\n\\r\\nSafeX,safex@example.com\\r\\n");
return rows.length === 2 && rows[0].name === "AXELR" && rows[0].email === "axelr@example.com" && rows[1].name === "SafeX";`,
            },
            {
              name: "empty input returns an empty array",
              code: `const rows = parseCsv("");
return Array.isArray(rows) && rows.length === 0;`,
            },
          ],
          hint: "Splitting on commas can't work once quotes are involved. Walk the text one character at a time with an `inQuotes` flag: a comma or newline only ends a field when you're *not* inside quotes. Collect rows of raw strings first, then map them to objects with the header row.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which call reads a text file without blocking the event loop?",
              options: [
                "`fs.readFileSync(\"a.txt\", \"utf8\")`",
                "`JSON.parse(\"a.txt\")`",
                "`await readFile(\"a.txt\", \"utf8\")` from `node:fs/promises`",
                "`require(\"a.txt\")`",
              ],
              answer: 2,
              why: "The Promise API hands the read to libuv and resumes your function when it's done. `readFileSync` stops the whole process until the read completes.",
            },
            {
              q: "Why use `path.join` instead of `dir + \"/\" + file`?",
              options: [
                "It's faster",
                "It normalises separators, duplicate slashes and `..`, and works on Windows",
                "It checks that the file exists",
              ],
              answer: 1,
              why: "`path.join` only builds a string — it doesn't touch the disk — but it builds a *correct* one on every platform.",
            },
            {
              q: "You need to process a 2 GB CSV export on a small server. Best approach?",
              options: [
                "Read it with a stream / readline and handle it line by line",
                "`readFile` it, then `split(\"\\n\")`",
                "Increase the server's memory to 8 GB",
                "Convert it to JSON first",
              ],
              answer: 0,
              why: "Streams keep memory usage flat by processing chunks as they arrive, regardless of file size.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. process, env & config
    // ─────────────────────────────────────────────────────────────
    {
      slug: "process-env-config",
      title: "process, environment variables & config",
      summary: "How configuration and secrets reach your code, why every env var is a string, and how to validate config before your app starts.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "The same code runs on your laptop, in a Vercel preview and in production — but with different databases, API keys and feature flags. **Environment variables** are how the outside world hands that configuration to a process, without baking it into the code (or into git).",
        },
        { type: "h", text: "The process object" },
        {
          type: "code",
          lang: "js",
          title: "scripts/sync-shopify.mjs",
          code: `// node scripts/sync-shopify.mjs --store voltix --dry-run
console.log(process.argv.slice(2));   // ["--store", "voltix", "--dry-run"]

import { parseArgs } from "node:util";
const { values } = parseArgs({
  options: { store: { type: "string" }, "dry-run": { type: "boolean" } },
});
console.log(values.store, values["dry-run"]); // "voltix" true

console.log(process.env.SHOPIFY_ADMIN_TOKEN); // a string, or undefined
console.log(process.cwd());                  // working directory
console.log(process.memoryUsage().rss);      // bytes used

process.on("SIGTERM", () => {                // Railway/Docker asks you to stop
  console.log("shutting down cleanly");
  process.exit(0);                            // 0 = success, anything else = failure
});`,
        },
        {
          type: "p",
          text: "Exit codes matter: CI pipelines, cron schedulers and `&&` in npm scripts all look at them. If a script fails, end with `process.exitCode = 1` (lets pending work finish) or `process.exit(1)` (stops immediately) so the failure is visible.",
        },
        { type: "h", text: ".env files" },
        {
          type: "p",
          text: "Typing variables in the terminal every time is tedious, so by convention they live in a `.env` file. For years you needed the `dotenv` package; modern Node reads them itself.",
        },
        {
          type: "code",
          lang: "bash",
          title: ".env.local  (NEVER committed)",
          code: `DATABASE_URL=postgresql://postgres:secret@db.abcd.supabase.co:5432/postgres
CLERK_SECRET_KEY=sk_test_...
SHOPIFY_ADMIN_TOKEN=shpat_...
PORT=3001
ENABLE_EMAILS=false`,
        },
        {
          type: "code",
          lang: "bash",
          title: "terminal",
          code: `node --env-file=.env.local server.js              # Node 20.6+
node --env-file-if-exists=.env.local server.js    # Node 22.9+: no error if missing

# or from code: process.loadEnvFile(".env.local")  (Node 20.12+)`,
        },
        {
          type: "list",
          items: [
            "Add `.env*` to `.gitignore` **before** your first commit. Commit a `.env.example` with the variable names and fake values instead.",
            "A secret that reached git is compromised, even if you delete it in the next commit — the history keeps it. **Rotate** the key (generate a new one, revoke the old).",
            "In production, set variables in the Vercel / Railway dashboard, not in files.",
            "Real environment variables win over the `.env` file when both define the same name.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Next.js and NEXT_PUBLIC_",
          text: "Next.js loads `.env.local` automatically. Variables are server-only by default; any variable prefixed `NEXT_PUBLIC_` is **inlined into the browser bundle at build time** — anyone can read it. `NEXT_PUBLIC_SUPABASE_URL` and the publishable/anon key are fine there (Supabase relies on RLS). `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY` and Shopify admin tokens must never get that prefix.",
        },
        { type: "h", text: "Every env var is a string" },
        {
          type: "run",
          title: "The classic config bugs",
          code: `// This is what process.env looks like: strings, or undefined
const env = { ENABLE_EMAILS: "false", PORT: "3001", MAX_RETRIES: "", TIMEOUT_MS: "5s" };

if (env.ENABLE_EMAILS) {
  console.log("Bug 1: emails are ON — \\"false\\" is a non-empty string, so it's truthy");
}

console.log("Bug 2:", env.PORT + 1);             // "30011", string concatenation
console.log("Bug 3:", Number(env.MAX_RETRIES));  // 0 — empty string becomes 0, silently
console.log("Bug 4:", Number(env.TIMEOUT_MS));   // NaN — and NaN > 1000 is false
console.log("Bug 5:", env.API_KEY);              // undefined — typo or missing, no error

// Correct parsing
const enableEmails = env.ENABLE_EMAILS === "true";
const port = Number.parseInt(env.PORT, 10);
console.log({ enableEmails, port });`,
        },
        { type: "h", text: "Validate config at startup (fail fast)" },
        {
          type: "p",
          text: "If `DATABASE_URL` is missing, you want the deploy to fail **immediately** with a clear message — not to boot happily and crash on the first customer request at 2 a.m. The pattern: read every variable in one place at startup, parse and validate it, then export a typed, frozen config object. The rest of the app imports `config`, never `process.env`.",
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/config.ts (with zod)",
          code: `import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().startsWith("sk_"),
  PORT: z.coerce.number().int().positive().default(3000),
  ENABLE_EMAILS: z.enum(["true", "false"]).default("false").transform((v) => v === "true"),
});

// Throws with a readable list of every problem if the env is wrong
export const config = schema.parse(process.env);`,
        },
        {
          type: "challenge",
          title: "Write loadConfig(env)",
          prompt: "Write `loadConfig(env)` (env is a plain object like `process.env`). Required: `DATABASE_URL` and `CLERK_SECRET_KEY` — if any are missing or empty, throw **one** `Error` whose message names **all** missing variables. `PORT` defaults to `3000`, must be a positive integer, otherwise throw. `ENABLE_EMAILS` accepts `\"true\"`/`\"1\"` → `true` and `\"false\"`/`\"0\"` → `false` (default `false`); anything else throws. Return `{ databaseUrl, clerkSecretKey, port, enableEmails }`.",
          starter: `function loadConfig(env) {
  return {
    databaseUrl: env.DATABASE_URL,
    clerkSecretKey: env.CLERK_SECRET_KEY,
    port: env.PORT || 3000,
    enableEmails: Boolean(env.ENABLE_EMAILS),
  };
}`,
          solution: `function loadConfig(env) {
  const required = ["DATABASE_URL", "CLERK_SECRET_KEY"];
  const missing = required.filter((name) => !env[name] || env[name].trim() === "");
  if (missing.length > 0) {
    throw new Error("Missing required env vars: " + missing.join(", "));
  }

  const rawPort = env.PORT ?? "";
  const port = rawPort.trim() === "" ? 3000 : Number(rawPort);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(\`PORT must be a positive integer, got "\${rawPort}"\`);
  }

  const rawEmails = (env.ENABLE_EMAILS ?? "false").trim().toLowerCase();
  const booleans = { true: true, "1": true, false: false, "0": false };
  if (!(rawEmails in booleans)) {
    throw new Error(\`ENABLE_EMAILS must be true/false/1/0, got "\${env.ENABLE_EMAILS}"\`);
  }

  return Object.freeze({
    databaseUrl: env.DATABASE_URL,
    clerkSecretKey: env.CLERK_SECRET_KEY,
    port,
    enableEmails: booleans[rawEmails],
  });
}`,
          tests: [
            {
              name: "parses a complete env into the right types",
              code: `const c = loadConfig({ DATABASE_URL: "postgres://db", CLERK_SECRET_KEY: "sk_test_1", PORT: "8080", ENABLE_EMAILS: "true" });
return c.databaseUrl === "postgres://db" && c.clerkSecretKey === "sk_test_1" && c.port === 8080 && c.enableEmails === true;`,
            },
            {
              name: 'defaults PORT to 3000 and treats ENABLE_EMAILS="false" as false',
              code: `const c = loadConfig({ DATABASE_URL: "postgres://db", CLERK_SECRET_KEY: "sk_test_1", ENABLE_EMAILS: "false" });
return c.port === 3000 && c.enableEmails === false;`,
            },
            {
              name: "one error lists ALL missing variables",
              code: `try {
  loadConfig({ PORT: "3000", CLERK_SECRET_KEY: "" });
  return false;
} catch (e) {
  return e.message.includes("DATABASE_URL") && e.message.includes("CLERK_SECRET_KEY");
}`,
            },
            {
              name: 'rejects a PORT that is not a number ("abc")',
              code: `try {
  loadConfig({ DATABASE_URL: "postgres://db", CLERK_SECRET_KEY: "sk_test_1", PORT: "abc" });
  return false;
} catch (e) {
  return e instanceof Error;
}`,
            },
            {
              name: 'rejects ENABLE_EMAILS="yes" instead of guessing',
              code: `try {
  loadConfig({ DATABASE_URL: "postgres://db", CLERK_SECRET_KEY: "sk_test_1", ENABLE_EMAILS: "yes" });
  return false;
} catch (e) {
  return e instanceof Error;
}`,
            },
          ],
          hint: "Collect missing names with `filter` before throwing, so the message lists them all. For the port, treat missing/empty as 3000, otherwise `Number(...)` and check `Number.isInteger(port) && port > 0`. For booleans, map the four allowed strings explicitly and throw on anything else.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`process.env.ENABLE_EMAILS` is `\"false\"`. What does `if (process.env.ENABLE_EMAILS)` do?",
              options: ["Skips the block", "Runs the block", "Throws a TypeError", "Depends on the Node version"],
              answer: 1,
              why: "Env vars are always strings, and any non-empty string — including `\"false\"` — is truthy. Compare explicitly: `=== \"true\"`.",
            },
            {
              q: "You accidentally committed a `.env` with your Shopify admin token, then deleted it in the next commit. What now?",
              options: [
                "Nothing, it's deleted",
                "Make the repo private",
                "Add `.env` to `.gitignore` and you're safe",
                "Rotate the token: revoke it and generate a new one",
              ],
              answer: 3,
              why: "Git history (and any clone or fork) still contains the secret. The only real fix is to make the leaked token useless by rotating it — then also add `.env` to `.gitignore`.",
            },
            {
              q: "In Next.js, which variable can safely be prefixed with `NEXT_PUBLIC_`?",
              options: ["The Supabase project URL", "The Supabase service role key", "`CLERK_SECRET_KEY`"],
              answer: 0,
              why: "`NEXT_PUBLIC_` values are shipped to every visitor's browser. Only public values belong there; the service role key bypasses RLS and must stay server-side.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. HTTP server
    // ─────────────────────────────────────────────────────────────
    {
      slug: "http-server",
      title: "Building an HTTP server",
      summary: "Under every API framework: node:http, requests and responses, routing by method and path, JSON bodies and status codes.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Express, Fastify and Next.js route handlers all sit on top of the same thing: Node's built-in `node:http` module. Building a small server by hand once demystifies all of them. When a Next.js API route returns a 405 or a request body comes back empty, you'll know exactly which layer is responsible.",
        },
        { type: "h", text: "What travels over the wire" },
        {
          type: "compare",
          left: {
            label: "Request (client → server)",
            lang: "text",
            code: `POST /leads?source=meta HTTP/1.1
Host: api.voltix.ca
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{"name":"Marie","email":"marie@example.com"}`,
          },
          right: {
            label: "Response (server → client)",
            lang: "text",
            code: `HTTP/1.1 201 Created
Content-Type: application/json
Location: /leads/43

{"id":43,"name":"Marie","email":"marie@example.com"}`,
          },
        },
        {
          type: "p",
          text: "A request has a **method** (what to do), a **URL** (path + query string: what to do it to), **headers** (metadata) and an optional **body**. A response has a **status code**, headers and a body. Everything an API does is: look at the request, decide, write a response.",
        },
        { type: "h", text: "The smallest server" },
        {
          type: "code",
          lang: "js",
          title: "server.mjs",
          code: `import { createServer } from "node:http";

const server = createServer((req, res) => {
  // Called once per request. req = IncomingMessage, res = ServerResponse
  console.log(req.method, req.url);   // "GET" "/leads?status=new"

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ ok: true }));  // ALWAYS end the response, or the client hangs
});

const port = Number(process.env.PORT ?? 3000);
server.listen(port, () => console.log(\`Listening on http://localhost:\${port}\`));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "PORT on Railway",
          text: "Railway (like most hosts) tells your app which port to listen on through the `PORT` env var. Hard-code `3000` and the deploy looks healthy but nothing answers. Always `listen(process.env.PORT ?? 3000)`.",
        },
        { type: "h", text: "Reading a JSON body" },
        {
          type: "p",
          text: "The body is **not** on `req` when your handler starts — it arrives over the network in chunks, because `req` is a readable stream. You collect the chunks, join them, then parse. Frameworks do this for you (`express.json()`, `await request.json()`), but this is what they do:",
        },
        {
          type: "code",
          lang: "js",
          title: "readJson helper",
          code: `async function readJson(req, limitBytes = 1_000_000) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {          // req is an async-iterable stream
    size += chunk.length;
    if (size > limitBytes) throw Object.assign(new Error("Body too large"), { status: 413 });
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw Object.assign(new Error("Invalid JSON"), { status: 400 });
  }
}`,
        },
        { type: "h", text: "Routing by method + path" },
        {
          type: "code",
          lang: "js",
          title: "server.mjs (with routing)",
          code: `import { createServer } from "node:http";

const leads = [{ id: 1, name: "Voltix", email: "info@voltix.ca" }];

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost"); // req.url is only "/leads?x=1"
    const route = \`\${req.method} \${url.pathname}\`;

    if (route === "GET /leads") {
      const status = url.searchParams.get("status");
      return send(res, 200, status ? leads.filter((l) => l.status === status) : leads);
    }
    if (route === "POST /leads") {
      const body = await readJson(req);
      if (!body.email) return send(res, 400, { error: "email is required" });
      const lead = { id: leads.length + 1, ...body };
      leads.push(lead);
      return send(res, 201, lead);
    }
    send(res, 404, { error: "Not found" });
  } catch (err) {
    console.error(err);                       // log the details for you…
    send(res, err.status ?? 500, { error: err.status ? err.message : "Internal error" }); // …not for the client
  }
}).listen(process.env.PORT ?? 3000);`,
        },
        {
          type: "run",
          title: "Parsing req.url",
          code: `// req.url only contains the path and query, so give URL a dummy base
const url = new URL("/leads?status=new&source=meta&page=2", "http://localhost");

console.log(url.pathname);                         // "/leads"
console.log(url.searchParams.get("status"));       // "new"
console.log(Number(url.searchParams.get("page"))); // 2 (strings again!)
console.log(url.searchParams.get("missing"));      // null
console.log(Object.fromEntries(url.searchParams)); // all params as an object

// Splitting the path to find an id: "/leads/42" → ["leads", "42"]
const parts = new URL("/leads/42", "http://localhost").pathname.split("/").filter(Boolean);
console.log(parts, "→ id", Number(parts[1]));`,
        },
        { type: "h", text: "Status codes you'll actually use" },
        {
          type: "table",
          rows: [
            ["Code", "Name", "When"],
            ["200", "OK", "Successful GET / update, with a body"],
            ["201", "Created", "A POST created something (return it)"],
            ["204", "No Content", "Success, nothing to return (e.g. DELETE)"],
            ["400", "Bad Request", "Malformed JSON, failed validation"],
            ["401", "Unauthorized", "Not logged in / no valid token"],
            ["403", "Forbidden", "Logged in, but not allowed (another client's invoice)"],
            ["404", "Not Found", "No such route or no such record"],
            ["405", "Method Not Allowed", "The path exists, but not for this method"],
            ["409", "Conflict", "Duplicate (email already registered)"],
            ["429", "Too Many Requests", "Rate limited (Shopify will send you these!)"],
            ["500", "Internal Server Error", "Your bug. Log it, don't leak the stack trace"],
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Next.js route handlers",
          text: "In Next.js App Router, `app/api/leads/route.ts` exporting `GET` and `POST` functions *is* this router: Next.js matches method + path for you, gives you a web-standard `Request` (`await request.json()` reads the body) and you return a `Response` (`Response.json(lead, { status: 201 })`). Unexported methods automatically get a 405.",
        },
        {
          type: "challenge",
          title: "A leads API as a pure function",
          prompt: "Implement `handle({ method, url, body })` returning `{ status, body }` for an in-memory `leads` array. Routes: `GET /leads` → 200 + all leads (ignore any query string). `GET /leads/:id` → 200 + the lead, or 404. `POST /leads` → if `body.email` is a string containing `@`, add `{ id, name, email }` with the next id and return 201 + the lead; otherwise 400. Any other method on `/leads` or `/leads/:id` → 405. Unknown paths → 404.",
          starter: `const leads = [
  { id: 1, name: "Voltix", email: "info@voltix.ca" },
  { id: 2, name: "Pro Quai", email: "hello@proquai.ca" },
];

function handle({ method, url, body }) {
  if (method === "GET" && url === "/leads") {
    return { status: 200, body: leads };
  }
  return { status: 404, body: { error: "Not found" } };
}`,
          solution: `const leads = [
  { id: 1, name: "Voltix", email: "info@voltix.ca" },
  { id: 2, name: "Pro Quai", email: "hello@proquai.ca" },
];
let nextId = 3;

const notAllowed = { status: 405, body: { error: "Method not allowed" } };

function handle({ method, url, body }) {
  const { pathname } = new URL(url, "http://localhost");
  const parts = pathname.split("/").filter(Boolean); // "/leads/2" → ["leads", "2"]

  if (parts[0] !== "leads" || parts.length > 2) {
    return { status: 404, body: { error: "Not found" } };
  }

  if (parts.length === 1) {
    if (method === "GET") return { status: 200, body: leads };
    if (method === "POST") {
      if (!body || typeof body.email !== "string" || !body.email.includes("@")) {
        return { status: 400, body: { error: "A valid email is required" } };
      }
      const lead = { id: nextId++, name: body.name ?? "", email: body.email };
      leads.push(lead);
      return { status: 201, body: lead };
    }
    return notAllowed;
  }

  if (method !== "GET") return notAllowed;
  const lead = leads.find((l) => l.id === Number(parts[1]));
  return lead
    ? { status: 200, body: lead }
    : { status: 404, body: { error: "Lead not found" } };
}`,
          tests: [
            {
              name: "GET /leads?status=new returns 200 and the list (query string ignored)",
              code: `const r = handle({ method: "GET", url: "/leads?status=new" });
return r.status === 200 && Array.isArray(r.body) && r.body.length >= 2;`,
            },
            {
              name: "GET /leads/2 returns that lead; GET /leads/999 returns 404",
              code: `const found = handle({ method: "GET", url: "/leads/2" });
const missing = handle({ method: "GET", url: "/leads/999" });
return found.status === 200 && found.body.name === "Pro Quai" && missing.status === 404;`,
            },
            {
              name: "POST /leads creates a lead (201) that can then be fetched",
              code: `const r = handle({ method: "POST", url: "/leads", body: { name: "Marie", email: "marie@example.com" } });
if (r.status !== 201 || typeof r.body.id !== "number") return false;
const again = handle({ method: "GET", url: "/leads/" + r.body.id });
return again.status === 200 && again.body.email === "marie@example.com";`,
            },
            {
              name: "POST /leads without a valid email returns 400",
              code: `const noBody = handle({ method: "POST", url: "/leads" });
const bad = handle({ method: "POST", url: "/leads", body: { email: "not-an-email" } });
return noBody.status === 400 && bad.status === 400;`,
            },
            {
              name: "wrong method → 405, unknown path → 404",
              code: `return handle({ method: "DELETE", url: "/leads" }).status === 405
  && handle({ method: "PUT", url: "/leads/1" }).status === 405
  && handle({ method: "GET", url: "/invoices" }).status === 404;`,
            },
          ],
          hint: "Parse with `new URL(url, \"http://localhost\")` and split the `pathname` on `/` (filtering empty strings). Branch first on the path shape (`[\"leads\"]` vs `[\"leads\", id]`), then on the method. Remember `Number(\"2\")` to compare ids.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A logged-in client requests another client's invoice. Which status fits best?",
              options: ["401 Unauthorized", "400 Bad Request", "403 Forbidden", "500 Internal Server Error"],
              answer: 2,
              why: "401 means \"we don't know who you are\". 403 means \"we know who you are, and you're not allowed\". (Some APIs return 404 to avoid revealing the invoice exists — also defensible.)",
            },
            {
              q: "Why isn't the request body available as `req.body` in a plain `node:http` handler?",
              options: [
                "Node strips bodies for security",
                "The body arrives as a stream of chunks you must read and parse yourself",
                "Only GET requests can have a body",
              ],
              answer: 1,
              why: "`req` is a readable stream. Frameworks add `req.body` by reading the stream for you (`express.json()`), Next.js gives you `await request.json()`.",
            },
            {
              q: "Your handler catches an error. What should the client receive?",
              options: [
                "A generic 500 message, while the full error is logged server-side",
                "The full stack trace, to help debugging",
                "Nothing — leave the response open",
              ],
              answer: 0,
              why: "Stack traces leak file paths, library versions and sometimes data. Log details for yourself; always end the response with a safe message.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Express & middleware
    // ─────────────────────────────────────────────────────────────
    {
      slug: "express-and-middleware",
      title: "Express & middleware",
      summary: "Why frameworks exist, how a middleware chain with next() works, error middleware, and how Express compares to Fastify, Hono and Next.js.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "The raw `node:http` server from last lesson works, but every project would re-write the same plumbing: route parameters, JSON body parsing, logging, auth checks, CORS, error handling. **Express** (2010) packaged that plumbing, and its central idea — **middleware** — is now everywhere, including Next.js.",
        },
        {
          type: "code",
          lang: "js",
          title: "server.mjs (Express 5)",
          code: `import express from "express";

const app = express();

// Middleware: runs for every request, in the order you register it
app.use(express.json());                     // parses JSON bodies into req.body

app.use((req, res, next) => {                // a logger
  const start = Date.now();
  res.on("finish", () => console.log(req.method, req.url, res.statusCode, Date.now() - start + "ms"));
  next();                                    // pass control to the next middleware
});

function requireApiKey(req, res, next) {     // route-specific middleware
  if (req.get("x-api-key") !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ error: "Invalid API key" }); // stop here: no next()
  }
  next();
}

app.get("/leads/:id", async (req, res) => {  // :id → req.params.id
  const lead = await db.leads.find(Number(req.params.id));
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json(lead);
});

app.post("/leads", requireApiKey, async (req, res) => {
  const lead = await db.leads.create(req.body);
  res.status(201).json(lead);
});

// Error middleware: 4 arguments. Express 5 also forwards rejected promises here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).json({ error: "Something went wrong" });
});

app.listen(process.env.PORT ?? 3000);`,
        },
        { type: "h", text: "The middleware chain" },
        {
          type: "steps",
          items: [
            { title: "Request arrives", text: "Express builds `req` and `res` and starts at the first registered middleware." },
            { title: "Each middleware decides", text: "It can read/modify `req` and `res`, then either call `next()` to continue, or send a response and stop the chain." },
            { title: "Route handler", text: "If everyone called `next()`, the matching route handler sends the response." },
            { title: "Errors skip ahead", text: "Calling `next(err)` (or throwing in an async handler in Express 5) jumps straight to the error middleware, skipping normal ones." },
          ],
        },
        {
          type: "p",
          text: "Because `next()` returns to the caller once the rest of the chain is done, a middleware can run code **before** and **after** everything downstream. This is called the *onion model*: the request goes in through each layer and the response comes back out through them in reverse. Koa and Hono make it explicit with `await next()`.",
        },
        {
          type: "run",
          title: "The onion, by hand",
          code: `const log = [];

const timing = async (ctx, next) => {
  log.push("timing: start");
  await next();
  log.push("timing: end (" + ctx.status + ")");
};
const auth = async (ctx, next) => {
  log.push("auth: user is " + ctx.user);
  if (!ctx.user) { ctx.status = 401; return; } // no next() → stop
  await next();
};
const handler = async (ctx) => {
  log.push("handler: loading invoices");
  ctx.status = 200;
};

// Hand-wired chain: each next() calls the following layer
const ctx = { user: "alexis" };
await timing(ctx, () => auth(ctx, () => handler(ctx)));
console.log(log.join("\\n"));

// The same chain for an anonymous user
log.length = 0;
const anon = { user: null };
await timing(anon, () => auth(anon, () => handler(anon)));
console.log("\\n" + log.join("\\n"));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Forgetting next() (or a response)",
          text: "A middleware that neither calls `next()` nor sends a response leaves the request hanging until the client times out — no error, no log. Also never send a response *and* call `next()`: you'll get `ERR_HTTP_HEADERS_SENT` when the next handler tries to respond again.",
        },
        { type: "h", text: "Alternatives" },
        {
          type: "table",
          rows: [
            ["Framework", "Style", "Good for"],
            ["Express 5", "`(req, res, next)`, huge ecosystem", "Classic APIs, tutorials, existing code"],
            ["Fastify", "Schema-based validation, plugins, very fast", "High-throughput Node APIs on Railway"],
            ["Hono", "Web-standard `Request`/`Response`, `await next()`", "Runs on Node, Bun, Deno, Cloudflare, Vercel"],
            ["Next.js route handlers", "File-based routes, export `GET`/`POST`", "APIs living next to your Next.js frontend"],
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "What Next.js replaces",
          text: "In a Next.js app you rarely need Express: `app/**/route.ts` gives you routing, `request.json()` body parsing, and Server Actions cover most form submissions. The middleware idea survives as `proxy.ts` (called `middleware.ts` before Next.js 16), which runs before matching routes — that's where `clerkMiddleware()` protects pages. A separate Express/Fastify/Hono service still makes sense for long-running workers, webhooks with heavy processing, or an API shared by several apps.",
        },
        {
          type: "challenge",
          title: "Implement compose()",
          prompt: "Write `compose(middlewares)` returning `run(ctx)`, which runs the middlewares in order. Each middleware is `(ctx, next) => ...` and may be async. Calling `next()` runs the next middleware and returns a Promise that resolves when the rest of the chain is done (so code after `await next()` runs on the way back out). If a middleware doesn't call `next()`, the chain stops. Errors thrown anywhere downstream must reject that `next()` promise (so an outer middleware can `try/catch` it), and `run(ctx)` itself returns a Promise.",
          starter: `function compose(middlewares) {
  return async function run(ctx) {
    for (const mw of middlewares) {
      await mw(ctx, () => {});
    }
  };
}`,
          solution: `function compose(middlewares) {
  return function run(ctx) {
    let lastIndex = -1;
    function dispatch(i) {
      if (i <= lastIndex) return Promise.reject(new Error("next() called multiple times"));
      lastIndex = i;
      const mw = middlewares[i];
      if (!mw) return Promise.resolve(); // end of the chain
      try {
        return Promise.resolve(mw(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);      // synchronous throw → rejected promise
      }
    }
    return dispatch(0);
  };
}`,
          tests: [
            {
              name: "runs middlewares in order",
              code: `const ctx = { log: [] };
await compose([
  async (c, next) => { c.log.push("cors"); await next(); },
  async (c, next) => { c.log.push("auth"); await next(); },
  async (c) => { c.log.push("handler"); },
])(ctx);
return ctx.log.join(",") === "cors,auth,handler";`,
            },
            {
              name: "code after await next() runs on the way back out (onion)",
              code: `const ctx = { log: [] };
await compose([
  async (c, next) => { c.log.push("timing:start"); await next(); c.log.push("timing:end"); },
  async (c) => { c.log.push("handler"); },
])(ctx);
return ctx.log.join(",") === "timing:start,handler,timing:end";`,
            },
            {
              name: "a middleware that doesn't call next() stops the chain",
              code: `const ctx = { user: null, handled: false };
await compose([
  async (c, next) => { if (!c.user) { c.status = 401; return; } await next(); },
  async (c) => { c.handled = true; c.status = 200; },
])(ctx);
return ctx.status === 401 && ctx.handled === false;`,
            },
            {
              name: "async work before next() is awaited",
              code: `const ctx = { log: [] };
await compose([
  async (c, next) => { await new Promise((r) => setTimeout(r, 30)); c.log.push("loaded user"); await next(); },
  async (c) => { c.log.push("handler"); },
])(ctx);
return ctx.log.join(",") === "loaded user,handler";`,
            },
            {
              name: "an error thrown downstream can be caught by an outer middleware",
              code: `const ctx = {};
await compose([
  async (c, next) => { try { await next(); } catch (e) { c.status = 500; c.error = e.message; } },
  async () => { throw new Error("Shopify timeout"); },
])(ctx);
return ctx.status === 500 && ctx.error === "Shopify timeout";`,
            },
          ],
          hint: "Write a recursive `dispatch(i)` that calls `middlewares[i](ctx, () => dispatch(i + 1))` and returns a Promise. When `i` is past the end, return `Promise.resolve()`. Wrap the call in `Promise.resolve(...)` and a try/catch so sync throws become rejections.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "How does Express recognise error-handling middleware?",
              options: [
                "It's registered with `app.error()`",
                "Its name ends in `Error`",
                "It must be the first middleware",
                "It takes four arguments: `(err, req, res, next)`",
              ],
              answer: 3,
              why: "Express checks the function's arity. Four parameters = error handler, skipped during normal flow and called when something calls `next(err)` or throws.",
            },
            {
              q: "In `async (ctx, next) => { const t = Date.now(); await next(); log(Date.now() - t); }`, what does the log measure?",
              options: [
                "Nothing useful — next() returns immediately",
                "The time taken by all downstream middleware and the handler",
                "Only this middleware's own time",
              ],
              answer: 1,
              why: "`await next()` resolves only after the rest of the chain finishes, so the difference covers everything downstream — the onion model.",
            },
            {
              q: "In a Next.js 16 app, where does code that should run before matching routes (like Clerk's auth check) live?",
              options: ["`proxy.ts`", "`next.config.ts`", "`app/layout.tsx`", "An Express server"],
              answer: 0,
              why: "Next.js 16 renamed `middleware.ts` to `proxy.ts`. It runs before routes are rendered, which is where `clerkMiddleware()` goes.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Events, streams, event loop, scripts
    // ─────────────────────────────────────────────────────────────
    {
      slug: "events-streams-event-loop",
      title: "Events, streams & the event loop",
      summary: "EventEmitter, streams and backpressure, keeping the event loop free, worker threads, and running scripts and cron jobs.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Node is *event-driven*: a server emits `request`, a stream emits `data` and `end`, a process emits `SIGTERM`. Underneath almost all of these is one small class, `EventEmitter`. Understanding it, plus streams and the event loop, explains most \"why is my server slow / leaking / hanging\" problems.",
        },
        { type: "h", text: "EventEmitter" },
        {
          type: "code",
          lang: "js",
          title: "orders.mjs",
          code: `import { EventEmitter } from "node:events";

const orders = new EventEmitter();

orders.on("paid", (order) => sendReceipt(order));             // every time
orders.on("paid", (order) => notifySlack(\`💰 \${order.total} $\`));
orders.once("paid", () => console.log("first sale today!"));   // only the first time

orders.emit("paid", { id: 1042, total: 249.99 }); // calls the listeners synchronously, in order

orders.off("paid", sendReceipt);                   // remove a listener

// Special case: emitting "error" with no listener THROWS and can crash the process
orders.on("error", (err) => console.error("order pipeline failed", err));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "MaxListenersExceededWarning",
          text: "If you see this warning, you're probably adding a listener on every request (e.g. `db.on(\"error\", ...)` inside a handler) and never removing it. That's a memory leak: listeners pile up forever. Register once at startup, or remove with `off()`.",
        },
        {
          type: "challenge",
          title: "Build a tiny EventEmitter",
          prompt: "Write a class `Emitter` with `on(event, fn)`, `off(event, fn)`, `once(event, fn)` and `emit(event, ...args)`. Listeners are called in the order they were added, with the emitted arguments. `once` listeners run at most one time and can be removed with `off` using the original function. `emit` returns `true` if there were listeners, `false` otherwise. `on`, `off` and `once` return `this` so calls can be chained.",
          starter: `class Emitter {
  constructor() {
    this.listeners = {};
  }
  on(event, fn) {
    (this.listeners[event] ??= []).push(fn);
    return this;
  }
  emit(event, ...args) {
    for (const fn of this.listeners[event] ?? []) fn(...args);
  }
}`,
          solution: `class Emitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
    return this;
  }

  off(event, fn) {
    const list = this.#listeners.get(event);
    if (list) {
      this.#listeners.set(event, list.filter((l) => l !== fn && l.original !== fn));
    }
    return this;
  }

  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      fn(...args);
    };
    wrapper.original = fn; // so off(event, fn) can find it
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list || list.length === 0) return false;
    for (const fn of [...list]) fn(...args); // copy: listeners may remove themselves
    return true;
  }
}`,
          tests: [
            {
              name: "on + emit calls every listener in order with the arguments",
              code: `const e = new Emitter();
const calls = [];
e.on("paid", (o) => calls.push("receipt " + o.id));
e.on("paid", (o, by) => calls.push("slack " + o.total + " " + by));
e.emit("paid", { id: 1042, total: 250 }, "stripe");
return calls.join("|") === "receipt 1042|slack 250 stripe";`,
            },
            {
              name: "off removes a listener",
              code: `const e = new Emitter();
let n = 0;
const fn = () => n++;
e.on("lead", fn);
e.emit("lead");
e.off("lead", fn);
e.emit("lead");
return n === 1;`,
            },
            {
              name: "once runs only the first time",
              code: `const e = new Emitter();
let n = 0;
e.once("deploy", () => n++);
e.emit("deploy");
e.emit("deploy");
e.emit("deploy");
return n === 1;`,
            },
            {
              name: "emit returns true with listeners, false without",
              code: `const e = new Emitter();
const before = e.emit("refund");
e.on("refund", () => {});
return before === false && e.emit("refund") === true;`,
            },
            {
              name: "a once listener can be removed with the original function, and calls chain",
              code: `const e = new Emitter();
let n = 0;
const fn = () => n++;
const returned = e.once("sync", fn).off("sync", fn);
e.emit("sync");
return n === 0 && returned === e;`,
            },
          ],
          hint: "Store an array of listeners per event name. For `once`, register a wrapper that removes itself and then calls the original; attach the original as a property on the wrapper (`wrapper.original = fn`) so `off` can match either. In `emit`, iterate over a copy of the array.",
        },
        { type: "h", text: "Streams and backpressure" },
        {
          type: "p",
          text: "Streams are EventEmitters for data that arrives over time: HTTP requests and responses, files, sockets, `process.stdout`. There are four kinds: **Readable** (a source), **Writable** (a destination), **Duplex** (both, like a socket) and **Transform** (modifies data passing through, like gzip or CSV parsing).",
        },
        {
          type: "p",
          text: "The key problem streams solve is **backpressure**: what if the source is faster than the destination? Reading a file from SSD is far faster than uploading it to S3. Without backpressure, the chunks pile up in memory until the process crashes. With it, the writer tells the reader *\"slow down\"*: `writable.write()` returns `false` when its buffer is full, and the reader pauses until the writer emits `drain`. `pipeline()` and `for await` handle this for you — prefer them over wiring `data` events by hand.",
        },
        {
          type: "run",
          title: "Pull-based streaming with an async generator",
          code: `// A "readable": produces order rows only when the consumer asks for the next one.
async function* readOrders(total) {
  for (let i = 1; i <= total; i++) {
    await new Promise((r) => setTimeout(r, 5)); // simulated disk read
    console.log("  read  order", i);
    yield { id: i, total: Math.round(Math.random() * 500) };
  }
}

// A slow "writable": e.g. pushing each order to the Shopify API
async function upload(order) {
  await new Promise((r) => setTimeout(r, 30));
  console.log("  wrote order", order.id);
}

// for await pulls one item, waits for the upload, then pulls the next:
// the reader never gets ahead of the writer → memory stays flat.
for await (const order of readOrders(4)) {
  await upload(order);
}
console.log("done — never more than one order in memory at a time");`,
        },
        { type: "h", text: "Don't block the event loop" },
        {
          type: "p",
          text: "(The *JS under the hood* track covers the event loop in detail.) The short version for servers: there is one JS thread per Node process. While it runs **your synchronous code**, it can't accept connections, run timers or resolve promises. A 300 ms loop means every other user waits 300 ms.",
        },
        {
          type: "run",
          title: "Watch a timer get delayed",
          code: `const start = Date.now();
setTimeout(() => {
  console.log("timer fired after", Date.now() - start, "ms (asked for 10 ms)");
}, 10);

// Simulate CPU-heavy work: e.g. generating a big PDF report synchronously
function busyFor(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // nothing else can run during this loop
}
busyFor(250);
console.log("heavy work done at", Date.now() - start, "ms");

// Fix: split the work into chunks and yield to the event loop between them
const invoices = Array.from({ length: 30_000 }, (_, i) => ({ id: i, amount: i % 700 }));
let sum = 0;
const t2 = Date.now();
for (let i = 0; i < invoices.length; i += 5_000) {
  for (const inv of invoices.slice(i, i + 5_000)) sum += inv.amount;
  await new Promise((r) => setTimeout(r, 0)); // let timers and requests run
}
console.log("chunked total:", sum, "in", Date.now() - t2, "ms, with breathing room between chunks");`,
        },
        {
          type: "list",
          items: [
            "Avoid `*Sync` functions (`readFileSync`, `execSync`, `crypto.pbkdf2Sync`) in request handlers. They're fine in startup code and one-off scripts.",
            "Watch out for huge `JSON.parse` / `JSON.stringify` calls and catastrophic regexes on user input — they're synchronous too.",
            "Paginate database queries instead of loading 100 000 rows and looping over them.",
            "Truly CPU-heavy work (image resizing, PDF generation, big CSV transforms) belongs in a **worker thread**, a background job, or a separate service.",
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "worker threads (briefly)",
          code: `// main.mjs — offload CPU work to another thread with its own event loop
import { Worker } from "node:worker_threads";

function generateReport(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./report-worker.mjs", import.meta.url), { workerData: data });
    worker.once("message", resolve);
    worker.once("error", reject);
  });
}

// report-worker.mjs
import { parentPort, workerData } from "node:worker_threads";
parentPort.postMessage(buildHugeReport(workerData)); // runs in parallel, main thread stays free`,
        },
        { type: "h", text: "Scripts and cron jobs" },
        {
          type: "p",
          text: "Not everything is a server. Agencies run lots of small **scripts**: nightly Shopify inventory syncs, monthly Google Ads report exports, cleaning up stale Supabase rows. A good script reads config from env, logs what it does, is safe to re-run, and **exits** with the right code.",
        },
        {
          type: "code",
          lang: "js",
          title: "scripts/sync-inventory.mjs",
          code: `#!/usr/bin/env node
// Run: node --env-file=.env.local scripts/sync-inventory.mjs
// Node 22.18+ can also run .ts files directly (types are stripped, not checked).

async function main() {
  const started = Date.now();
  const products = await fetchShopifyProducts();       // paginate!
  let updated = 0;
  for (const p of products) {
    if (await upsertInventory(p)) updated++;           // idempotent: safe to re-run
  }
  console.log(\`Synced \${products.length} products, \${updated} updated in \${Date.now() - started}ms\`);
}

main().catch((err) => {
  console.error("Inventory sync failed:", err);
  process.exitCode = 1;                                 // scheduler/CI sees the failure
});`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Cron on Railway and Vercel",
          text: "On **Railway**, give a service a cron schedule (e.g. `0 7 * * *`, in UTC) and a start command like `node scripts/sync-inventory.mjs`. Railway starts the process on schedule and expects it to **exit** when done — if it's still running at the next tick, that run is skipped, so close DB connections and don't leave servers listening. On **Vercel**, Cron Jobs instead call one of your routes over HTTP (`GET /api/cron/sync`) on a schedule; check the `CRON_SECRET` bearer token so strangers can't trigger it, and remember function time limits.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What happens when an EventEmitter emits `\"error\"` and nobody is listening for it?",
              options: [
                "Nothing, the event is ignored",
                "It's logged as a warning",
                "The error is thrown, which can crash the process",
                "Node retries the event",
              ],
              answer: 2,
              why: "`error` is special: with no listener, `emit(\"error\", err)` throws `err`. Always attach an error listener to streams, sockets and emitters you create.",
            },
            {
              q: "What is backpressure?",
              options: [
                "A destination signalling a faster source to pause until it catches up",
                "Compressing data before sending it",
                "Retrying a failed HTTP request",
              ],
              answer: 0,
              why: "When a writable's buffer fills, `write()` returns `false`; the source pauses until `drain`. `pipeline()` and `for await` do this automatically, keeping memory flat.",
            },
            {
              q: "An endpoint generates a large PDF synchronously and takes 2 s. What do other users experience meanwhile?",
              options: [
                "Nothing — Node handles each request on its own thread",
                "Their requests wait, because the single JS thread is busy",
                "Their requests fail with 503",
                "They get a cached response",
              ],
              answer: 1,
              why: "Synchronous CPU work blocks the event loop for everyone in that process. Move it to a worker thread or a background job.",
            },
            {
              q: "Your Railway cron job finishes its work but the next scheduled runs keep getting skipped. Most likely cause?",
              options: [
                "The cron expression is in local time",
                "The script forgot to call `console.log`",
                "Railway only runs cron jobs once",
                "The process never exits (an open DB connection or server keeps the event loop alive)",
              ],
              answer: 3,
              why: "Node exits only when nothing is pending. An open connection pool or listening server keeps it alive, so Railway considers the previous run still active. Close resources, or set `process.exitCode` and exit explicitly.",
            },
          ],
        },
      ],
    },
  ],
};
