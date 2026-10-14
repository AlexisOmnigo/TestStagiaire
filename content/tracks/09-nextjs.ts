import type { Track } from "../types";

export const track: Track = {
  slug: "nextjs",
  order: 9,
  title: "Next.js",
  tagline: "React with a router, a server and a build pipeline",
  outcome:
    "Build and ship production Next.js App Router apps: routes and layouts, server and client components, data fetching and caching, server actions, route handlers, proxy-based auth, env vars and Vercel deploys.",
  badge: "NEXT",
  color: "#d4d4d8",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. What Next.js adds to React
    // ─────────────────────────────────────────────────────────────
    {
      slug: "what-nextjs-adds",
      title: "What Next.js adds to React",
      summary: "React renders UI. Next.js decides URLs, where code runs, how data loads and how the app gets built and shipped.",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "React is a **library**: you give it state, it gives you UI. It deliberately says nothing about how URLs map to screens, where data is loaded, how your code is bundled, how the first HTML reaches the browser quickly, or where your secret API keys live. Every real client project needs answers to all of those questions.",
        },
        {
          type: "p",
          text: "Next.js is a **framework** built on React that answers them with conventions. Instead of wiring a router, a bundler, an Express API and an SSR setup yourself, you put files in the right folders and Next.js does the plumbing.",
        },
        {
          type: "table",
          rows: [
            ["Need", "Plain React SPA (e.g. Vite)", "Next.js App Router"],
            ["Routing", "Install a router, declare routes in code", "Folders in `app/` *are* the routes"],
            ["First paint", "Empty HTML, download JS, then render", "Server sends ready-to-show HTML"],
            ["Data", "`useEffect` + `fetch` from the browser", "`async` server components read the DB directly"],
            ["Backend endpoints", "A separate Node/Express server", "Route handlers and server actions in the same project"],
            ["Bundling", "Vite config", "Turbopack (default in Next 16), split per route automatically"],
            ["Images, fonts, SEO", "DIY", "`next/image`, `next/font`, the Metadata API"],
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Versions that matter",
          text: "This track targets the **App Router** on Next.js 15 and 16. Key milestones: 13.4 made the App Router stable. 15 brought React 19, made `params`, `searchParams`, `cookies()` and `headers()` async, stopped caching `fetch` by default and added `next.config.ts`. 16 made **Turbopack** the default bundler for `next dev` and `next build`, renamed `middleware.ts` to `proxy.ts`, shipped **Cache Components** (`\"use cache\"`) as an opt-in, and removed the `next lint` command.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Two routers, one name",
          text: "If a tutorial uses a `pages/` folder, `getServerSideProps`, `getStaticProps` or `import { useRouter } from \"next/router\"`, it's the older **Pages Router**. It still works, but new projects (and this track) use the `app/` directory. Don't mix advice from the two.",
        },
        { type: "h", text: "Create a project" },
        {
          type: "code",
          lang: "bash",
          title: "terminal",
          code: `npx create-next-app@latest client-portal
# ✔ Would you like to use the recommended Next.js defaults? › Yes
#   → TypeScript, ESLint, Tailwind CSS, App Router, Turbopack, "@/*" import alias

cd client-portal
npm run dev
# ▲ Next.js 16.x (Turbopack)
# - Local: http://localhost:3000`,
        },
        { type: "h", text: "A tour of the project" },
        {
          type: "code",
          lang: "text",
          title: "client-portal/",
          code: `client-portal/
├─ app/
│  ├─ layout.tsx      ← root layout: <html> and <body>, wraps every page
│  ├─ page.tsx        ← the "/" route
│  ├─ globals.css     ← global styles (Tailwind entry point)
│  └─ favicon.ico
├─ public/            ← served as-is: public/logo.svg → /logo.svg
├─ next.config.ts     ← framework config (images, redirects, feature flags)
├─ tsconfig.json      ← includes the "@/*" path alias
├─ next-env.d.ts      ← generated types, don't edit, don't commit changes to it
├─ eslint.config.mjs
└─ package.json`,
        },
        {
          type: "code",
          lang: "json",
          title: "package.json (scripts)",
          code: `{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}`,
        },
        {
          type: "table",
          rows: [
            ["Script", "What it does", "When"],
            ["`npm run dev`", "Dev server with Fast Refresh; renders every route on demand", "While coding"],
            ["`npm run build`", "Type-checks, bundles, prerenders static routes into `.next/`", "Before deploying (Vercel runs it for you)"],
            ["`npm run start`", "Serves the built `.next/` output in production mode", "On a Node host (e.g. Railway), after `build`"],
          ],
        },
        {
          type: "code",
          lang: "ts",
          title: "next.config.ts",
          code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow next/image to optimize product photos from Shopify's CDN
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com" }],
  },
};

export default nextConfig;`,
        },
        { type: "h", text: "What happens when someone opens /clients" },
        {
          type: "steps",
          items: [
            { title: "Request", text: "The browser asks the server for `/clients`." },
            { title: "Match", text: "Next.js maps the URL to `app/clients/page.tsx` (plus every `layout.tsx` above it)." },
            { title: "Render on the server", text: "Server components run — they can `await` the database — and produce HTML plus an **RSC payload** (a compact description of the component tree)." },
            { title: "Paint", text: "The browser shows the HTML immediately, before any JavaScript runs." },
            { title: "Hydrate", text: "The JS for *client* components loads and React attaches event handlers. Only interactive parts ship JS." },
            { title: "Navigate", text: "Clicking a `<Link>` afterwards fetches only the RSC payload for the new route — no full page reload, layouts stay mounted." },
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "You're using one right now",
          text: "Dev Path itself is a Next.js App Router app. The lesson you're reading is a dynamic route rendered on the server from plain TypeScript data; the editor and the **Run** button are client components that hand your code to a Web Worker.",
        },
        { type: "h", text: "From file to URL" },
        {
          type: "p",
          text: "The core idea of the App Router fits in one function: a `page.tsx` file's folder path *is* its URL. Folders in parentheses are ignored in the URL, and folders starting with `_` are private (never routable). Run it, then you'll write it yourself.",
        },
        {
          type: "run",
          code: `const files = [
  "app/page.tsx",
  "app/clients/page.tsx",
  "app/clients/[id]/page.tsx",
  "app/(marketing)/pricing/page.tsx",
  "app/clients/layout.tsx",
  "app/_components/ClientCard.tsx",
];

for (const file of files) {
  const parts = file.split("/");
  const isPage = parts.at(-1) === "page.tsx";
  const folders = parts.slice(1, -1); // drop "app" and the file name
  const isPrivate = folders.some((f) => f.startsWith("_"));
  if (!isPage || isPrivate) {
    console.log(file.padEnd(36), "→ (not a route)");
    continue;
  }
  const url = "/" + folders.filter((f) => !f.startsWith("(")).join("/");
  console.log(file.padEnd(36), "→", url);
}`,
        },
        {
          type: "challenge",
          title: "routeFromFile",
          prompt: "Write `routeFromFile(file)` that returns the URL a file in `app/` serves, or `null` if it is not a page. Rules: only files named `page.tsx`, `page.ts`, `page.jsx` or `page.js` are pages; the path must start with `app/`; folders in parentheses (route groups) are removed from the URL; any folder starting with `_` makes the file private (`null`). Dynamic segments like `[id]` stay as-is. The root page returns `\"/\"`.",
          starter: `function routeFromFile(file) {
  // TODO
  return file.replace("app", "").replace("/page.tsx", "");
}`,
          solution: `function routeFromFile(file) {
  const parts = file.split("/");
  if (parts[0] !== "app") return null;
  const name = parts.at(-1);
  if (!["page.tsx", "page.ts", "page.jsx", "page.js"].includes(name)) return null;
  const folders = parts.slice(1, -1);
  if (folders.some((f) => f.startsWith("_"))) return null;
  return "/" + folders.filter((f) => !(f.startsWith("(") && f.endsWith(")"))).join("/");
}`,
          tests: [
            { name: 'root page "app/page.tsx" → "/"', code: 'return routeFromFile("app/page.tsx") === "/";' },
            {
              name: "nested and dynamic pages keep their folder path",
              code: 'return routeFromFile("app/clients/page.tsx") === "/clients" && routeFromFile("app/clients/[id]/page.tsx") === "/clients/[id]";',
            },
            { name: "route groups like (marketing) vanish from the URL", code: 'return routeFromFile("app/(marketing)/pricing/page.js") === "/pricing";' },
            {
              name: "layouts and components are not routes",
              code: 'return routeFromFile("app/clients/layout.tsx") === null && routeFromFile("app/clients/ClientCard.tsx") === null;',
            },
            { name: "edge case: private _folders are never routable", code: 'return routeFromFile("app/_components/page.tsx") === null;' },
          ],
          hint: "Split on `/`. The first part must be `app`, the last part is the file name, everything in between is folders. Check the file name, check for `_` folders, then drop `(group)` folders and join with `/`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which import tells you a tutorial is written for the old Pages Router?",
              options: ["`import Link from \"next/link\"`", "`import { useRouter } from \"next/router\"`", "`import Image from \"next/image\"`", "`import type { Metadata } from \"next\"`"],
              answer: 1,
              why: "`next/router` is the Pages Router API. In the App Router you import `useRouter`, `usePathname` and friends from `next/navigation`.",
            },
            {
              q: "What does `npm run build` do that `npm run dev` doesn't?",
              options: [
                "Starts a server on port 3000",
                "Enables Fast Refresh",
                "Type-checks, bundles for production and prerenders static routes",
                "Installs dependencies",
              ],
              answer: 2,
              why: "`next build` produces the optimized `.next/` output: it compiles, type-checks and prerenders whatever can be static. `next start` then serves that output.",
            },
            {
              q: "Where should `logo.svg` go so it's served at `https://site.com/logo.svg`?",
              options: ["`public/logo.svg`", "`app/logo.svg`", "`assets/logo.svg`", "`.next/static/logo.svg`"],
              answer: 0,
              why: "Files in `public/` are served from the site root as-is. `.next/` is build output — never put files there by hand.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Routing
    // ─────────────────────────────────────────────────────────────
    {
      slug: "app-router-routing",
      title: "Routing with the App Router",
      summary: "Folders are routes, page.tsx makes them public, brackets make them dynamic, and Link moves between them without reloads.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Why file-system routing? Because the URL structure of the app is visible in the folder tree. There is no central route list to keep in sync, and a new teammate can find the code for `/clients/42/invoices` by opening `app/clients/[id]/invoices/`.",
        },
        {
          type: "table",
          rows: [
            ["File", "Matches", "params"],
            ["`app/page.tsx`", "`/`", "—"],
            ["`app/clients/page.tsx`", "`/clients`", "—"],
            ["`app/clients/[id]/page.tsx`", "`/clients/42`", "`{ id: \"42\" }`"],
            ["`app/docs/[...slug]/page.tsx`", "`/docs/setup/vercel` (not `/docs`)", "`{ slug: [\"setup\", \"vercel\"] }`"],
            ["`app/shop/[[...slug]]/page.tsx`", "`/shop` and `/shop/men/shoes`", "`{}` or `{ slug: [\"men\", \"shoes\"] }`"],
            ["`app/(marketing)/about/page.tsx`", "`/about`", "— (the group is not in the URL)"],
            ["`app/_lib/db.ts`", "nothing", "private folder, never routable"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Colocation is safe",
          text: "A folder only becomes publicly reachable when it contains a `page.tsx` (or a `route.ts`). You can keep `ClientCard.tsx`, `queries.ts` or tests right next to the page that uses them.",
        },
        {
          type: "p",
          text: "**Route groups** — `(marketing)`, `(dashboard)` — let you organize folders and give different sections different layouts without changing URLs. A typical agency app: `app/(marketing)/` for the public site with a big footer, `app/(dashboard)/` for the logged-in portal with a sidebar.",
        },
        { type: "h", text: "Dynamic segments: params is a Promise" },
        {
          type: "code",
          lang: "tsx",
          title: "app/clients/[id]/page.tsx",
          code: `import { notFound } from "next/navigation";
import { getClient } from "@/lib/clients";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;          // Next 15+: await it
  const client = await getClient(id);
  if (!client) notFound();              // renders the closest not-found.tsx

  return <h1>{client.name}</h1>;
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Changed in Next 15",
          text: "Up to Next 14, `params` and `searchParams` were plain objects and `params.id` worked directly. Since Next 15 they are **Promises**: `const { id } = await params` in server components, or `const { id } = use(params)` in client components. Next 15 still allowed synchronous access with a warning; Next 16 removed it. Old tutorials and AI suggestions often get this wrong.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Typed for free",
          text: "Since Next 15.5, Next generates global helpers from your folders: `export default async function Page(props: PageProps<\"/clients/[id]\">)` gives you `props.params` typed as `Promise<{ id: string }>`. There's also `LayoutProps<\"/dashboard\">`.",
        },
        { type: "h", text: "Query strings: searchParams" },
        {
          type: "code",
          lang: "tsx",
          title: "app/invoices/page.tsx",
          code: `// /invoices?status=overdue&page=2
export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { status = "all", page = "1" } = await searchParams;
  // ?tag=a&tag=b gives tag: ["a", "b"], so values can be arrays
  const invoices = await listInvoices({ status: String(status), page: Number(page) });
  return <InvoiceTable invoices={invoices} />;
}`,
        },
        {
          type: "p",
          text: "Only pages receive `searchParams` — layouts don't, because a layout is shared between URLs and isn't re-rendered when only the query string changes. Reading `searchParams` also makes the page render per request (more in the caching lesson).",
        },
        { type: "h", text: "Moving around: Link and useRouter" },
        {
          type: "code",
          lang: "tsx",
          title: "app/clients/page.tsx",
          code: `import Link from "next/link";

export default async function ClientsPage() {
  const clients = await listClients();
  return (
    <ul>
      {clients.map((client) => (
        <li key={client.id}>
          <Link href={\`/clients/\${client.id}\`}>{client.name}</Link>
        </li>
      ))}
    </ul>
  );
}`,
        },
        {
          type: "p",
          text: "`<Link>` renders a real `<a>` (good for SEO and accessibility) but intercepts the click to navigate client-side. In production, links that scroll into view are **prefetched**, so the next page is often ready before the click. Shared layouts stay mounted; only the segment that changed re-renders.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "components/SaveAndGoBack.tsx",
          code: `"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function SaveAndGoBack() {
  const router = useRouter();
  const pathname = usePathname();          // "/clients/42/edit"
  const searchParams = useSearchParams();  // read-only URLSearchParams

  return (
    <button
      onClick={async () => {
        await save();
        router.push("/clients");   // navigate in code
        router.refresh();          // re-fetch server components for fresh data
      }}
    >
      Save
    </button>
  );
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Use the right import",
          text: "In the App Router, hooks come from `next/navigation`. Importing `useRouter` from `next/router` throws \"NextRouter was not mounted\". Also: these hooks only work in client components (`\"use client\"`). Prefer `<Link>` for normal navigation; reach for `router.push` only after an action (save, then go).",
        },
        { type: "h", text: "Not found" },
        {
          type: "code",
          lang: "tsx",
          title: "app/clients/[id]/not-found.tsx",
          code: `import Link from "next/link";

export default function ClientNotFound() {
  return (
    <div>
      <h2>This client doesn't exist (or was archived).</h2>
      <Link href="/clients">Back to all clients</Link>
    </div>
  );
}`,
        },
        {
          type: "p",
          text: "Calling `notFound()` from `next/navigation` stops rendering and shows the closest `not-found.tsx` with a 404 status. `app/not-found.tsx` handles any URL that matches no route at all.",
        },
        { type: "h", text: "How a URL is compared to a pattern" },
        {
          type: "p",
          text: "Before matching, the router splits the pathname into segments and decodes them. The query string is handled separately. The standard `URL` class does this split for you:",
        },
        {
          type: "run",
          code: `const url = new URL("https://portal.omnigo.ca/clients/caf%C3%A9-du-port/invoices?status=overdue&page=2");

console.log("pathname:", url.pathname);
const segments = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
console.log("segments:", segments);

console.log("status:", url.searchParams.get("status"));
console.log("page:", Number(url.searchParams.get("page")));

// pattern app/clients/[id]/invoices/page.tsx → params
const params = { id: segments[1] };
console.log("params:", params);`,
        },
        {
          type: "challenge",
          title: "matchRoute(pattern, path)",
          prompt: "Implement `matchRoute(pattern, path)`. It returns a params object when the path matches the pattern, otherwise `null`. Support: static segments (must be equal), `[name]` (exactly one segment → string), `[...name]` (one or more remaining segments → array), `[[...name]]` (zero or more → array, and the key is omitted when there are zero). Ignore leading/trailing slashes and decode each path segment with `decodeURIComponent`.",
          starter: `function matchRoute(pattern, path) {
  // TODO: handle [param], [...param] and [[...param]]
  return pattern === path ? {} : null;
}`,
          solution: `function matchRoute(pattern, path) {
  const split = (s) => s.split("/").filter(Boolean);
  const pSegs = split(pattern);
  const uSegs = split(path).map(decodeURIComponent);
  const params = {};

  for (let i = 0; i < pSegs.length; i++) {
    const seg = pSegs[i];
    if (seg.startsWith("[[...") || seg.startsWith("[...")) {
      const optional = seg.startsWith("[[...");
      const name = optional ? seg.slice(5, -2) : seg.slice(4, -1);
      const rest = uSegs.slice(i);
      if (!optional && rest.length === 0) return null;
      if (rest.length > 0) params[name] = rest;
      return params; // catch-alls are always last
    }
    if (i >= uSegs.length) return null;
    if (seg.startsWith("[")) params[seg.slice(1, -1)] = uSegs[i];
    else if (seg !== uSegs[i]) return null;
  }
  return uSegs.length === pSegs.length ? params : null;
}`,
          tests: [
            {
              name: "static: /clients matches itself, not /invoices",
              code: `const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
return eq(matchRoute("/clients", "/clients"), {}) && matchRoute("/clients", "/invoices") === null;`,
            },
            {
              name: "dynamic: /clients/[id] on /clients/42 → { id: \"42\" }",
              code: `const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
return eq(matchRoute("/clients/[id]", "/clients/42"), { id: "42" });`,
            },
            {
              name: "segment count must match for non catch-all patterns",
              code: `return matchRoute("/clients/[id]", "/clients/42/edit") === null && matchRoute("/clients/[id]", "/clients") === null;`,
            },
            {
              name: "catch-all [...slug] needs at least one segment",
              code: `const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
return eq(matchRoute("/docs/[...slug]", "/docs/setup/vercel"), { slug: ["setup", "vercel"] }) && matchRoute("/docs/[...slug]", "/docs") === null;`,
            },
            {
              name: "optional catch-all [[...slug]] also matches zero segments",
              code: `const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
return eq(matchRoute("/shop/[[...slug]]", "/shop"), {}) && eq(matchRoute("/shop/[[...slug]]", "/shop/men/shoes"), { slug: ["men", "shoes"] });`,
            },
            {
              name: "edge case: trailing slash ignored and segments decoded",
              code: `const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
return eq(matchRoute("/clients/[id]", "/clients/caf%C3%A9/"), { id: "café" });`,
            },
          ],
          hint: "Split both strings on `/` and drop empty parts. Walk the pattern segments: a catch-all consumes the rest of the path (`uSegs.slice(i)`) and returns; `[name]` captures one segment; anything else must be equal. At the end, both arrays must have the same length.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In Next 15+, how do you read `id` in `app/clients/[id]/page.tsx` (a server component)?",
              options: ["`params.id`", "`useParams().id` at the top of the async page", "`const { id } = await params`", "`router.query.id`"],
              answer: 2,
              why: "`params` is a Promise since Next 15 — await it in server components (or unwrap with `use(params)` in client components). `router.query` is Pages Router.",
            },
            {
              q: "Which URL does `app/(dashboard)/settings/page.tsx` serve?",
              options: ["`/dashboard/settings`", "`/settings`", "`/(dashboard)/settings`", "None — groups are private"],
              answer: 1,
              why: "Parentheses create a route group: it organizes files and can have its own layout, but it's removed from the URL.",
            },
            {
              q: "`app/docs/[...slug]/page.tsx` exists. What happens on `/docs`?",
              options: [
                "It's a 404 unless there's also an `app/docs/page.tsx` (or you use `[[...slug]]`)",
                "It matches with `slug: []`",
                "It matches with `slug: undefined`",
                "It redirects to the first doc",
              ],
              answer: 0,
              why: "A catch-all needs at least one segment. Use the optional catch-all `[[...slug]]` to also match the bare `/docs`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Layouts & special files
    // ─────────────────────────────────────────────────────────────
    {
      slug: "layouts-and-special-files",
      title: "Layouts, templates & special files",
      summary: "Shared UI that persists across navigations, plus file conventions for loading, errors, 404s and SEO metadata.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Most screens of a client portal share chrome: a top bar, a sidebar, an auth check. A **layout** renders that shared UI once and wraps every page below it. Crucially, layouts **persist** across navigations: going from `/dashboard/clients` to `/dashboard/invoices` re-renders only the page, so the sidebar's scroll position and open menus are kept.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/layout.tsx (root layout, required)",
          code: `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Omnigo Portal", template: "%s | Omnigo" },
  description: "Projects, invoices and reports for Omnigo clients.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/(dashboard)/dashboard/layout.tsx",
          code: `import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />                      {/* stays mounted between dashboard pages */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}`,
        },
        {
          type: "p",
          text: "Layouts nest by folder. For `/dashboard/clients/42`, Next renders every `layout.tsx` found on the way down, outermost first, with the page in the middle:",
        },
        {
          type: "run",
          code: `const existing = new Set([
  "app/layout.tsx",
  "app/dashboard/layout.tsx",
  "app/dashboard/clients/[id]/layout.tsx",
  "app/dashboard/clients/[id]/page.tsx",
]);

function renderTree(folders) {
  const chain = [];
  for (let i = 0; i <= folders.length; i++) {
    const dir = ["app", ...folders.slice(0, i)].join("/");
    if (existing.has(dir + "/layout.tsx")) chain.push(dir + "/layout.tsx");
  }
  chain.push(["app", ...folders, "page.tsx"].join("/"));
  chain.forEach((file, depth) => console.log("  ".repeat(depth) + "<" + file + ">"));
}

// URL /dashboard/clients/42 → folders dashboard / clients / [id]
renderTree(["dashboard", "clients", "[id]"]);`,
        },
        { type: "h", text: "The special files" },
        {
          type: "table",
          rows: [
            ["File", "Purpose", "Notes"],
            ["`layout.tsx`", "Shared UI wrapping the segment and its children", "Persists across navigations; root layout must render `<html>` and `<body>`"],
            ["`page.tsx`", "The unique UI of a route; makes it public", "Receives `params` and `searchParams`"],
            ["`loading.tsx`", "Instant loading UI while the page's data loads", "Wraps the page in `<Suspense>` for you"],
            ["`error.tsx`", "Catches errors thrown below it", "Must be a client component"],
            ["`not-found.tsx`", "UI for `notFound()` and unknown URLs", "Returns a 404 status"],
            ["`template.tsx`", "Like a layout, but remounts on every navigation", "Rarely needed"],
            ["`global-error.tsx`", "Catches errors in the root layout itself", "Must render its own `<html>`/`<body>`"],
          ],
        },
        {
          type: "p",
          text: "Under the hood, Next composes them for each segment in a fixed order — knowing it explains which file catches what:",
        },
        {
          type: "code",
          lang: "tsx",
          title: "what Next builds for one segment (conceptually)",
          code: `<Layout>
  <Template>
    <ErrorBoundary fallback={<Error />}>
      <Suspense fallback={<Loading />}>
        <NotFoundBoundary fallback={<NotFound />}>
          <Page />
        </NotFoundBoundary>
      </Suspense>
    </ErrorBoundary>
  </Template>
</Layout>`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "error.tsx doesn't protect its own layout",
          text: "Since the error boundary sits *inside* the layout, an error thrown in `app/dashboard/layout.tsx` is not caught by `app/dashboard/error.tsx` — it bubbles to the parent segment's `error.tsx`. Errors in the root layout need `app/global-error.tsx`.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/dashboard/loading.tsx",
          code: `export default function Loading() {
  return <div className="h-32 animate-pulse rounded-lg bg-zinc-200" />;
}`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/dashboard/error.tsx",
          code: `"use client"; // error boundaries are client components

import { useEffect } from "react";

export default function DashboardError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void; // Next 16.3+. On Next 15 / early 16, use reset() instead.
}) {
  useEffect(() => {
    console.error(error); // send to Sentry or similar
  }, [error]);

  return (
    <div>
      <h2>We couldn't load your dashboard.</h2>
      <button onClick={() => retry()}>Try again</button>
    </div>
  );
}`,
        },
        {
          type: "callout",
          tone: "info",
          title: "No leaked secrets in error messages",
          text: "In production, errors thrown in server components reach `error.tsx` with a generic message and a `digest` hash. The real message (which might contain a SQL query or an API key) stays in your server logs, where you can find it by that digest.",
        },
        {
          type: "p",
          text: "**template.tsx** wraps children like a layout, but gets a fresh instance on each navigation: state resets and effects re-run. Use it for per-page enter animations or logging a page view in an effect; otherwise stick with layouts.",
        },
        { type: "h", text: "Metadata & SEO" },
        {
          type: "p",
          text: "Every client asks about SEO. Instead of hand-writing `<head>` tags, server components export `metadata` (static) or `generateMetadata` (computed from params or data). Next merges metadata from the root layout down to the page.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/(dashboard)/clients/page.tsx",
          code: `import type { Metadata } from "next";

// with the root template "%s | Omnigo" this becomes "Clients | Omnigo"
export const metadata: Metadata = { title: "Clients" };`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/products/[handle]/page.tsx",
          code: `import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";

// cache() dedupes the call: generateMetadata and the page share one query per request
const getProduct = cache(async (handle: string) => shopify.productByHandle(handle));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Product not found" };
  return {
    title: product.title,
    description: product.seo.description ?? product.description.slice(0, 155),
    openGraph: { images: [product.featuredImage.url] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  return <h1>{product.title}</h1>;
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "More SEO file conventions",
          text: "`app/sitemap.ts`, `app/robots.ts` and `opengraph-image.tsx` generate `sitemap.xml`, `robots.txt` and social share images from code — handy for a Shopify headless storefront where products change daily. Metadata exports only work in server components.",
        },
        {
          type: "challenge",
          title: "Resolve the page title",
          prompt: "Simulate how Next resolves `<title>`. `resolveTitle(chain)` receives the metadata objects from the root layout down to the page. A `title` can be: a string; `{ default, template }`; or `{ absolute }`. Rules: a string title is formatted with the nearest **ancestor's** template (replace `%s`), or used as-is if there is none; `absolute` ignores templates; `default` is used when no deeper segment sets a title; a segment's own `template` only applies to segments *below* it. Return `\"\"` when nothing sets a title.",
          starter: `function resolveTitle(chain) {
  let title = "";
  for (const meta of chain) {
    if (typeof meta.title === "string") title = meta.title;
  }
  return title;
}`,
          solution: `function resolveTitle(chain) {
  let title = "";
  let template = null;
  for (const meta of chain) {
    const t = meta.title;
    if (t === undefined) continue;
    if (typeof t === "string") {
      title = template ? template.replace("%s", t) : t;
    } else {
      if (t.absolute) title = t.absolute;
      else if (t.default) title = t.default;
      if (t.template) template = t.template; // applies to children only
    }
  }
  return title;
}`,
          tests: [
            {
              name: "root default is used when the page sets no title",
              code: `const root = { title: { default: "Omnigo Portal", template: "%s | Omnigo" } };
return resolveTitle([root, {}]) === "Omnigo Portal";`,
            },
            {
              name: "page string title goes through the root template",
              code: `const root = { title: { default: "Omnigo Portal", template: "%s | Omnigo" } };
return resolveTitle([root, { title: "Clients" }]) === "Clients | Omnigo";`,
            },
            {
              name: "absolute ignores the template",
              code: `const root = { title: { default: "Omnigo Portal", template: "%s | Omnigo" } };
return resolveTitle([root, { title: { absolute: "Sign in" } }]) === "Sign in";`,
            },
            {
              name: "the nearest ancestor template wins",
              code: `const root = { title: { default: "Omnigo Portal", template: "%s | Omnigo" } };
const admin = { title: { template: "%s · Admin" } };
return resolveTitle([root, admin, { title: "Users" }]) === "Users · Admin";`,
            },
            { name: "edge case: no title anywhere → empty string", code: `return resolveTitle([{}, {}]) === "";` },
          ],
          hint: "Walk the chain from root to page, keeping two variables: the current `title` and the current `template`. Compute the segment's title *before* updating `template`, so a template only affects deeper segments.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You navigate from `/dashboard/clients` to `/dashboard/invoices`. What happens to `app/dashboard/layout.tsx`?",
              options: ["It unmounts and remounts", "It stays mounted; only the page segment re-renders", "It re-renders and loses its state", "It's re-fetched from the server with the page"],
              answer: 1,
              why: "Layouts persist across navigations between their child routes. That's their main difference from `template.tsx`, which remounts.",
            },
            {
              q: "Your `app/dashboard/layout.tsx` throws. Which file shows the fallback?",
              options: ["`app/dashboard/error.tsx`", "`app/dashboard/not-found.tsx`", "`app/dashboard/loading.tsx`", "The parent's `error.tsx` (e.g. `app/error.tsx`)"],
              answer: 3,
              why: "A segment's error boundary is rendered inside its layout, so it can't catch that layout's errors. They bubble up to the parent segment.",
            },
            {
              q: "Why must `error.tsx` start with `\"use client\"`?",
              options: [
                "React error boundaries and the retry button need to run in the browser",
                "Server components can't render HTML",
                "So the error message is hidden",
                "It doesn't need to — it's optional",
              ],
              answer: 0,
              why: "Error boundaries are a client-side React feature, and the fallback typically has an interactive \"try again\" button.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Server vs Client Components
    // ─────────────────────────────────────────────────────────────
    {
      slug: "server-and-client-components",
      title: "Server vs Client Components",
      summary: "Components run on the server by default. \"use client\" marks where interactivity — and shipped JavaScript — begins.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "In the App Router, **every component is a Server Component by default**. It runs only on the server (at build time or per request), its code is never sent to the browser, it can be `async`, and it can talk to your database or use secret keys directly. What reaches the browser is its *output*.",
        },
        {
          type: "p",
          text: "**Client Components** are the React you know from the React track: `useState`, `useEffect`, `onClick`, `localStorage`. You opt in with `\"use client\"`. Their JavaScript is shipped to the browser so they can be interactive.",
        },
        {
          type: "callout",
          tone: "info",
          title: "\"Client\" doesn't mean \"browser only\"",
          text: "Client components are still pre-rendered to HTML on the server for the first load, then **hydrated** in the browser. So `window` is undefined during that server pass — access it inside `useEffect` or event handlers.",
        },
        {
          type: "table",
          rows: [
            ["I need to…", "Server Component", "Client Component"],
            ["Query the DB / call a private API", "✅ directly", "⚠️ only through an action or route handler"],
            ["Use secret env vars", "✅", "❌ never"],
            ["`useState`, `useEffect`, `useReducer`", "❌", "✅"],
            ["`onClick`, `onChange`, forms with live validation", "❌", "✅"],
            ["Browser APIs (`localStorage`, `window`)", "❌", "✅ (in effects/handlers)"],
            ["Be an `async function`", "✅", "❌ (unwrap promises with `use()`)"],
            ["JavaScript sent to the browser", "none", "the component and its imports"],
          ],
        },
        { type: "h", text: "The \"use client\" boundary" },
        {
          type: "p",
          text: "`\"use client\"` at the top of a file marks a **boundary**: that file *and everything it imports* becomes part of the client bundle. You don't put it on every interactive component — only on the entry points that server components import.",
        },
        {
          type: "compare",
          left: {
            label: "app/clients/page.tsx (server)",
            lang: "tsx",
            code: `import { ClientSearch } from "./ClientSearch";
import { db } from "@/lib/db";

export default async function ClientsPage() {
  // runs on the server only
  const clients = await db.client.findMany({
    select: { id: true, name: true, city: true },
  });

  return (
    <section>
      <h1>Clients</h1>
      <ClientSearch clients={clients} />
    </section>
  );
}`,
          },
          right: {
            label: "app/clients/ClientSearch.tsx (client)",
            lang: "tsx",
            code: `"use client";

import { useState } from "react";

type Row = { id: string; name: string; city: string };

export function ClientSearch({ clients }: { clients: Row[] }) {
  const [q, setQ] = useState("");
  const shown = clients.filter((c) =>
    c.name.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <>
      <input value={q} onChange={(e) => setQ(e.target.value)} />
      <ul>{shown.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
    </>
  );
}`,
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: "Push \"use client\" to the leaves",
          text: "Keep pages and layouts as server components and make only the interactive bit (a search box, a dropdown, a chart) a client component. Putting `\"use client\"` on a whole page ships everything it imports to the browser and loses direct data access.",
        },
        { type: "h", text: "Server components inside client components" },
        {
          type: "p",
          text: "A client file can't *import* a server component (it would become client code). But a client component can receive server-rendered content as `children` or any other JSX prop:",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/invoices/[id]/page.tsx",
          code: `import { Collapsible } from "@/components/Collapsible"; // "use client" inside
import { InvoiceLines } from "./InvoiceLines";          // async server component

export default async function InvoicePage({ params }: PageProps<"/invoices/[id]">) {
  const { id } = await params;
  return (
    <Collapsible title="Line items">
      {/* rendered on the server, passed through as already-rendered output */}
      <InvoiceLines invoiceId={id} />
    </Collapsible>
  );
}`,
        },
        { type: "h", text: "What can cross the boundary" },
        {
          type: "p",
          text: "Props passed from a server component to a client component are **serialized** into the RSC payload and sent over the network. Allowed: strings, numbers, booleans, `null`/`undefined`, bigint, plain objects and arrays, `Date`, `Map`, `Set`, Promises, JSX, and Server Actions. Not allowed: ordinary functions (event handlers!), class instances (a Stripe client, a Supabase client, a Prisma `Decimal`), and symbols.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Everything you pass is public",
          text: "The RSC payload is embedded in the page and readable in the browser's dev tools. Passing a full DB row to a client component can leak `internal_notes`, `stripe_customer_id` or a client's margin. Select or map only the fields the UI needs.",
        },
        {
          type: "run",
          code: `// A row straight from the database...
const clientRow = {
  id: "cli_42",
  name: "Boulangerie Saint-Roch",
  city: "Québec",
  monthly_retainer: 2400,
  internal_notes: "Late payer. Negotiate deposit next time.",
  stripe_customer_id: "cus_9sd8f7",
};

// ...passed as a prop ends up in the page source:
console.log("RSC payload (roughly):", JSON.stringify(clientRow));

// Map to a DTO with only what the UI needs
function toClientCard(row) {
  return { id: row.id, name: row.name, city: row.city };
}
console.log("Safer:", JSON.stringify(toClientCard(clientRow)));`,
        },
        {
          type: "challenge",
          title: "canPassToClient",
          prompt: "Write `canPassToClient(value)` that returns `true` when a value could be passed as a prop from a server component to a client component, using this simplified rule set: primitives are fine except `symbol` and functions; `null`/`undefined` are fine; `Date` is fine; arrays, `Map` and `Set` are fine if **all their contents** are; plain objects (prototype is `Object.prototype` or `null`) are fine if all their values are; any other object (a class instance) is not. Ignore Server Actions here.",
          starter: `function canPassToClient(value) {
  return typeof value !== "function";
}`,
          solution: `function canPassToClient(value) {
  if (value === null || value === undefined) return true;
  const t = typeof value;
  if (t === "function" || t === "symbol") return false;
  if (t !== "object") return true; // string, number, boolean, bigint
  if (value instanceof Date) return true;
  if (Array.isArray(value)) return value.every(canPassToClient);
  if (value instanceof Map) {
    return [...value].every(([k, v]) => canPassToClient(k) && canPassToClient(v));
  }
  if (value instanceof Set) return [...value].every(canPassToClient);
  const proto = Object.getPrototypeOf(value);
  if (proto !== Object.prototype && proto !== null) return false;
  return Object.values(value).every(canPassToClient);
}`,
          tests: [
            {
              name: "a plain invoice with nested lines and a Date passes",
              code: `return canPassToClient({ id: "inv_1", total: 1250.5, paid: false, dueAt: new Date(), lines: [{ label: "SEO audit", qty: 1 }] }) === true;`,
            },
            {
              name: "an object containing an onClick function fails",
              code: `return canPassToClient({ label: "Pay", onClick: () => {} }) === false;`,
            },
            {
              name: "class instances fail, even deeply nested",
              code: `class StripeClient { constructor() { this.key = "sk_live_x"; } }
return canPassToClient(new StripeClient()) === false && canPassToClient({ deps: [{ stripe: new StripeClient() }] }) === false;`,
            },
            {
              name: "Map and Set are checked by content",
              code: `const ok = canPassToClient(new Map([["cli_1", { name: "Voltix" }]])) && canPassToClient(new Set(["a", "b"]));
const bad = canPassToClient(new Map([["fn", () => 1]]));
return ok === true && bad === false;`,
            },
            {
              name: "edge case: symbols fail, bigint and undefined pass",
              code: `return canPassToClient(Symbol("x")) === false && canPassToClient(10n) === true && canPassToClient({ a: undefined }) === true;`,
            },
          ],
          hint: "Handle the easy cases first with `typeof`. For objects, check `instanceof Date / Map / Set` and `Array.isArray`, recurse into contents, then use `Object.getPrototypeOf(value)` to tell plain objects from class instances.",
        },
        { type: "h", text: "Keeping secrets on the server" },
        {
          type: "code",
          lang: "ts",
          title: "lib/shopify-admin.ts",
          code: `import "server-only"; // build error if a client component ever imports this file

const endpoint = \`https://\${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-10/graphql.json\`;

export async function shopifyAdmin<T>(query: string, variables?: object): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!, // secret
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error("Shopify Admin API error");
  return json.data as T;
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Which keys must never leave the server",
          text: "Supabase's `service_role` key, Clerk's `CLERK_SECRET_KEY`, Shopify Admin tokens, Stripe secret keys, OpenAI/Anthropic API keys. Put the code that uses them in modules that start with `import \"server-only\"` (install the `server-only` package). If someone later imports that module into a `\"use client\"` file, the build fails instead of silently shipping your key.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A component has no directive at the top of its file and is imported by a page. Where does it run?",
              options: ["Only in the browser", "On the server (it's a Server Component by default)", "Both, always", "It depends on whether it uses `async`"],
              answer: 1,
              why: "In the App Router, components are Server Components unless they are in (or imported from) a `\"use client\"` module.",
            },
            {
              q: "Why can't you pass `onClick={() => archive(id)}` from a server component to a client `<Button>`?",
              options: [
                "Buttons can't be client components",
                "Arrow functions are not allowed in JSX",
                "Server components can't use JSX attributes",
                "Plain functions can't be serialized across the server→client boundary",
              ],
              answer: 3,
              why: "Props are serialized into the RSC payload; a closure can't be. Define the handler inside the client component, or pass a Server Action (`\"use server\"`), which is serialized as a reference.",
            },
            {
              q: "What does `import \"server-only\"` give you?",
              options: [
                "A build-time error if the module is ever imported into client code",
                "Faster server rendering",
                "Encryption of environment variables",
                "Automatic authentication",
              ],
              answer: 0,
              why: "It's a guard rail: the module can only be part of the server graph, so secrets inside can't accidentally end up in the browser bundle.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Data fetching
    // ─────────────────────────────────────────────────────────────
    {
      slug: "data-fetching",
      title: "Data fetching",
      summary: "Async server components fetch data where it lives, in parallel, and stream slow parts in with Suspense.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "In a classic React SPA, data loading is a relay race: download HTML → download JS → render a spinner → `useEffect` fires `fetch` → your API queries the DB → render again. You also need an API endpoint for every read, and you must be careful not to expose keys.",
        },
        {
          type: "p",
          text: "In the App Router, a server component is just an `async` function. It awaits the data **before** sending HTML, right next to the database, with no extra endpoint and no loading state in the browser.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/(dashboard)/clients/page.tsx",
          code: `import { createClient } from "@/lib/supabase/server";

export default async function ClientsPage() {
  const supabase = await createClient(); // server client, reads the auth cookie
  const { data: clients, error } = await supabase
    .from("clients")
    .select("id, name, city")
    .order("name");

  if (error) throw error; // caught by the nearest error.tsx

  return (
    <ul>
      {clients.map((c) => <li key={c.id}>{c.name} — {c.city}</li>)}
    </ul>
  );
}`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/blog/page.tsx — calling an external API",
          code: `export default async function BlogPage() {
  const res = await fetch("https://cms.example.com/api/posts?locale=fr-CA");
  if (!res.ok) throw new Error(\`CMS responded \${res.status}\`);
  const posts: { slug: string; title: string }[] = await res.json();
  return posts.map((p) => <a key={p.slug} href={\`/blog/\${p.slug}\`}>{p.title}</a>);
}`,
        },
        { type: "h", text: "Waterfalls vs parallel requests" },
        {
          type: "p",
          text: "Each `await` pauses the function. If the second query doesn't depend on the first, awaiting them one after another adds their durations together — a **waterfall**. Start them together and await them with `Promise.all`.",
        },
        {
          type: "compare",
          left: {
            label: "Waterfall: ~450 ms",
            lang: "tsx",
            code: `const client = await getClient(id);      // 150 ms
const invoices = await getInvoices(id);  // 200 ms
const projects = await getProjects(id);  // 100 ms`,
          },
          right: {
            label: "Parallel: ~200 ms",
            lang: "tsx",
            code: `const [client, invoices, projects] = await Promise.all([
  getClient(id),
  getInvoices(id),
  getProjects(id),
]);`,
          },
        },
        {
          type: "run",
          code: `const wait = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));
const getClient = (id) => wait(150, { id, name: "Voltix" });
const getInvoices = (id) => wait(200, [{ total: 1200 }, { total: 800 }]);
const getProjects = (id) => wait(100, [{ name: "Shopify migration" }]);

let t = Date.now();
await getClient("cli_7");
await getInvoices("cli_7");
await getProjects("cli_7");
console.log("sequential:", Date.now() - t, "ms");

t = Date.now();
await Promise.all([getClient("cli_7"), getInvoices("cli_7"), getProjects("cli_7")]);
console.log("parallel:  ", Date.now() - t, "ms");`,
        },
        { type: "h", text: "Streaming with Suspense" },
        {
          type: "p",
          text: "Even in parallel, the page waits for its slowest query. If the revenue chart takes 2 seconds, why should the client's name wait? Wrap the slow part in `<Suspense>`: Next sends the shell and fallback immediately, then **streams** the finished chunk into the same HTTP response when its data arrives.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/(dashboard)/clients/[id]/page.tsx",
          code: `import { Suspense } from "react";

export default async function ClientPage({ params }: PageProps<"/clients/[id]">) {
  const { id } = await params;
  const client = await getClient(id); // fast: needed for the header

  return (
    <>
      <h1>{client.name}</h1>
      <Suspense fallback={<p>Loading revenue…</p>}>
        <RevenueChart clientId={id} />   {/* async, slow: streams in later */}
      </Suspense>
      <Suspense fallback={<p>Loading tickets…</p>}>
        <OpenTickets clientId={id} />
      </Suspense>
    </>
  );
}

async function RevenueChart({ clientId }: { clientId: string }) {
  const months = await getRevenueByMonth(clientId); // 2 s analytics query
  return <Chart data={months} />;
}`,
        },
        {
          type: "run",
          code: `// Simulating what the browser receives over one streamed response
const start = Date.now();
const log = (msg) => console.log(String(Date.now() - start).padStart(4) + " ms │ " + msg);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

log("shell: <h1>Voltix</h1> + 2 fallbacks");

const boundaries = [
  wait(400).then(() => log("chunk: <RevenueChart> replaces 'Loading revenue…'")),
  wait(150).then(() => log("chunk: <OpenTickets> replaces 'Loading tickets…'")),
];
await Promise.all(boundaries);
log("response complete");`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "loading.tsx vs Suspense",
          text: "`loading.tsx` is a `<Suspense>` around the whole page — quick and good enough for many screens. Add your own `<Suspense>` boundaries when parts of the page have very different speeds.",
        },
        {
          type: "p",
          text: "You can also start a query in a server component and hand the **Promise** to a client component, which unwraps it with React 19's `use()`. The fetch starts on the server early; the client component suspends until it resolves:",
        },
        {
          type: "code",
          lang: "tsx",
          title: "passing a promise to a client component",
          code: `// page.tsx (server)
const leadsPromise = getLeads(); // not awaited
return (
  <Suspense fallback={<Spinner />}>
    <LeadsTable leadsPromise={leadsPromise} />
  </Suspense>
);

// LeadsTable.tsx
"use client";
import { use } from "react";
export function LeadsTable({ leadsPromise }: { leadsPromise: Promise<Lead[]> }) {
  const leads = use(leadsPromise);
  // ...interactive sorting/filtering with useState
}`,
        },
        { type: "h", text: "Prerendering dynamic routes: generateStaticParams" },
        {
          type: "p",
          text: "A blog or a product catalogue has dynamic URLs, but the list of posts is known at build time. `generateStaticParams` tells Next which params to prerender into static HTML during `next build`. Unknown params are still rendered on demand by default.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/blog/[slug]/page.tsx",
          code: `export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug })); // [{ slug: "launch-checklist" }, ...]
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <article dangerouslySetInnerHTML={{ __html: post.html }} />;
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "No more API routes just for reads",
          text: "With Supabase, use the server client from `@supabase/ssr` in server components so queries run with the logged-in user's session and RLS applies. You don't need an `/api/clients` endpoint just so your own pages can read data — that was the SPA way.",
        },
        {
          type: "challenge",
          title: "Load a client dashboard in parallel",
          prompt: "Write `async function loadClientDashboard(id)` using the provided fake data functions (each takes ~120 ms). Fetch the client, its invoices and its projects **in parallel**. If the client doesn't exist, return `null` (a real page would call `notFound()`). Otherwise return `{ client, invoices, projects, openTotal }`, where `openTotal` is the sum of `total` for invoices whose `status` is not `\"paid\"`.",
          starter: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const DB = {
  clients: { cli_1: { id: "cli_1", name: "Voltix" } },
  invoices: { cli_1: [{ total: 1200, status: "paid" }, { total: 800, status: "sent" }, { total: 450, status: "overdue" }] },
  projects: { cli_1: [{ name: "Shopify migration" }] },
};
const getClient = (id) => wait(120, DB.clients[id] ?? null);
const getInvoices = (id) => wait(120, DB.invoices[id] ?? []);
const getProjects = (id) => wait(120, DB.projects[id] ?? []);

async function loadClientDashboard(id) {
  const client = await getClient(id);
  const invoices = await getInvoices(id);
  const projects = await getProjects(id);
  // TODO: parallel, null for unknown clients, openTotal
  return { client, invoices, projects };
}`,
          solution: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const DB = {
  clients: { cli_1: { id: "cli_1", name: "Voltix" } },
  invoices: { cli_1: [{ total: 1200, status: "paid" }, { total: 800, status: "sent" }, { total: 450, status: "overdue" }] },
  projects: { cli_1: [{ name: "Shopify migration" }] },
};
const getClient = (id) => wait(120, DB.clients[id] ?? null);
const getInvoices = (id) => wait(120, DB.invoices[id] ?? []);
const getProjects = (id) => wait(120, DB.projects[id] ?? []);

async function loadClientDashboard(id) {
  const [client, invoices, projects] = await Promise.all([
    getClient(id),
    getInvoices(id),
    getProjects(id),
  ]);
  if (!client) return null;
  const openTotal = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  return { client, invoices, projects, openTotal };
}`,
          tests: [
            {
              name: "returns the client and its projects",
              code: `const d = await loadClientDashboard("cli_1");
return d.client.name === "Voltix" && d.projects.length === 1;`,
            },
            {
              name: "openTotal sums unpaid invoices (800 + 450)",
              code: `const d = await loadClientDashboard("cli_1");
return d.openTotal === 1250;`,
            },
            {
              name: "runs the three queries in parallel (< 250 ms)",
              code: `const t = Date.now();
await loadClientDashboard("cli_1");
return Date.now() - t < 250;`,
            },
            {
              name: "edge case: unknown client → null",
              code: `return (await loadClientDashboard("cli_404")) === null;`,
            },
          ],
          hint: "`const [a, b, c] = await Promise.all([f(), g(), h()])` starts all three before waiting. Then `filter` the unpaid invoices and `reduce` their totals.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A page awaits `getClient()` (150 ms) then `getInvoices()` (200 ms), which don't depend on each other. How long does the data take?",
              options: ["~150 ms", "~200 ms", "~350 ms", "~50 ms"],
              answer: 2,
              why: "Sequential awaits add up: 150 + 200. With `Promise.all` it would be ~200 ms (the slowest one).",
            },
            {
              q: "What does wrapping `<RevenueChart />` in `<Suspense fallback={…}>` achieve?",
              options: [
                "The chart is cached forever",
                "The rest of the page is sent immediately and the chart streams in when ready",
                "The chart becomes a client component",
                "The chart is rendered at build time",
              ],
              answer: 1,
              why: "Suspense lets Next flush everything outside the boundary right away and stream the boundary's content later in the same response.",
            },
            {
              q: "What is `generateStaticParams` for?",
              options: [
                "Validating params at runtime",
                "Generating TypeScript types for params",
                "Reading query string parameters",
                "Listing which dynamic route params to prerender at build time",
              ],
              answer: 3,
              why: "It returns the list of params (e.g. every published post slug) so `next build` can prerender those pages to static HTML.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Caching & rendering strategies
    // ─────────────────────────────────────────────────────────────
    {
      slug: "caching-and-rendering",
      title: "Caching & rendering strategies",
      summary: "Static or dynamic, cached or fresh: how Next decides, how to revalidate, and the newer opt-in \"use cache\" model.",
      minutes: 16,
      blocks: [
        {
          type: "p",
          text: "Every route answers two questions. **When is the HTML produced?** Once at build time (static) or on every request (dynamic). **How long can data be reused?** Never, for an hour, until something changes. Get them right and pages load instantly from a CDN; get them wrong and a client sees yesterday's prices — or every visit hammers their Shopify API.",
        },
        {
          type: "table",
          rows: [
            ["", "Static", "Dynamic"],
            ["HTML produced", "At `next build` (or on revalidation)", "On each request"],
            ["Served from", "CDN edge cache — very fast", "A server function — slower, scales with traffic"],
            ["Can use", "Data that's the same for everyone", "Cookies, headers, the logged-in user, query strings"],
            ["Typical pages", "Marketing site, blog, product pages", "Dashboards, carts, search results"],
          ],
        },
        { type: "h", text: "What makes a route dynamic" },
        {
          type: "p",
          text: "Without extra config, Next tries to prerender every route at build time. It switches a route to dynamic rendering as soon as the route needs something that only exists at request time:",
        },
        {
          type: "list",
          items: [
            "`await cookies()` or `await headers()` — and anything that calls them: Clerk's `auth()`, the Supabase server client.",
            "Reading the page's `searchParams`.",
            "`await connection()` from `next/server` — an explicit \"wait for a real request\".",
            "`fetch(url, { cache: \"no-store\" })`.",
            "`export const dynamic = \"force-dynamic\"` in the page or layout.",
          ],
        },
        {
          type: "run",
          code: `const REQUEST_TIME_APIS = ["cookies()", "headers()", "searchParams", "connection()", "fetch no-store"];

function renderMode(route) {
  if (route.config === "force-dynamic") return "ƒ dynamic (forced by config)";
  const hit = route.uses.filter((u) => REQUEST_TIME_APIS.includes(u));
  return hit.length ? "ƒ dynamic (uses " + hit.join(", ") + ")" : "○ static";
}

const routes = [
  { path: "/", uses: ["fetch cached"] },
  { path: "/pricing", uses: [] },
  { path: "/dashboard", uses: ["cookies()"] },        // Clerk auth()
  { path: "/search", uses: ["searchParams"] },
  { path: "/status", uses: [], config: "force-dynamic" },
];

for (const r of routes) console.log(r.path.padEnd(12), renderMode(r));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "The shared-layout trap",
          text: "Calling `auth()` or `cookies()` in the **root layout** (e.g. to show the user's avatar in the header) makes *every* route under it dynamic, including your marketing pages. Move the user-specific bit into its own component (wrapped in `<Suspense>`), or into the `(dashboard)` group's layout only.",
        },
        { type: "h", text: "fetch caching: the Next 15 change" },
        {
          type: "table",
          rows: [
            ["Call", "Next 14", "Next 15 and 16 (default model)"],
            ["`fetch(url)`", "Cached indefinitely (`force-cache`)", "**Not cached** — but see the warning below"],
            ["`fetch(url, { cache: \"force-cache\" })`", "Cached", "Cached"],
            ["`fetch(url, { next: { revalidate: 3600 } })`", "Cached, refreshed at most hourly", "Cached, refreshed at most hourly"],
            ["`fetch(url, { cache: \"no-store\" })`", "Fresh every request, route dynamic", "Fresh every request, route dynamic"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "\"Not cached\" ≠ \"fresh on every visit\"",
          text: "In Next 15+, a plain `fetch` isn't stored in the data cache, but if the route uses no request-time API, Next still **prerenders the whole page at build time** — so the data is frozen into static HTML until the next deploy. If a page must always be fresh, make it dynamic on purpose (e.g. `await connection()`), or give it a `revalidate` time.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/products/page.tsx — time-based revalidation (ISR)",
          code: `// Option A: per fetch
const res = await fetch(\`\${SHOP}/api/2025-10/graphql.json\`, {
  method: "POST",
  body: JSON.stringify({ query: PRODUCTS_QUERY }),
  next: { revalidate: 3600, tags: ["products"] }, // max 1 h old, taggable
});

// Option B: for the whole route segment
export const revalidate = 3600;`,
        },
        { type: "h", text: "How time-based revalidation actually behaves" },
        {
          type: "steps",
          items: [
            { title: "Build", text: "`next build` renders `/products` and stores the HTML + data." },
            { title: "Within the window", text: "For the next hour, every visitor gets the cached version instantly." },
            { title: "First request after the window", text: "That visitor *still* gets the stale page (fast), and Next regenerates it in the background." },
            { title: "Afterwards", text: "Once regeneration succeeds, the cache is replaced and later visitors see fresh data. If it fails, the old page keeps being served." },
          ],
        },
        {
          type: "p",
          text: "This is **stale-while-revalidate**: nobody waits for a slow rebuild, at the cost of one visitor seeing slightly old data. You'll implement exactly that in the challenge below.",
        },
        { type: "h", text: "On-demand revalidation" },
        {
          type: "p",
          text: "Waiting up to an hour after a client edits a product is often not acceptable. On-demand revalidation invalidates the cache *when the data changes* — from a server action after a mutation, or from a webhook when Shopify/a CMS tells you something changed.",
        },
        {
          type: "code",
          lang: "ts",
          title: "app/admin/actions.ts",
          code: `"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";

export async function publishPost(id: string) {
  await db.post.update({ where: { id }, data: { published: true } });

  revalidatePath("/blog");          // re-render this path on its next visit
  revalidateTag("posts", "max");    // Next 16: mark everything tagged "posts" stale
}

export async function renameProject(id: string, name: string) {
  await db.project.update({ where: { id }, data: { name } });
  updateTag(\`project-\${id}\`);      // Next 16, actions only: expire now, the user sees their edit immediately
}`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Version note: revalidateTag",
          text: "In Next 15, `revalidateTag(\"posts\")` takes one argument. In Next 16 the one-argument form is deprecated: pass a cache-life profile as the second argument (`\"max\"` is the recommended default), which serves stale content while fresh data loads. For \"I just saved, show me my change\" inside a server action, Next 16 adds `updateTag(tag)`.",
        },
        { type: "h", text: "The newer model: Cache Components and \"use cache\"" },
        {
          type: "p",
          text: "Next 16 ships **Cache Components**, an **opt-in** model that flips the defaults. Once enabled, nothing is cached implicitly: data is fetched at request time unless you mark a function or component with the `\"use cache\"` directive. Next then prerenders a static shell out of everything cached and streams the request-time parts into `<Suspense>` boundaries (*Partial Prerendering*, shown as `◐` in the build output).",
        },
        {
          type: "code",
          lang: "ts",
          title: "next.config.ts",
          code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true, // opt in (replaces Next 15's experimental dynamicIO / useCache flags)
};

export default nextConfig;`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/shop/page.tsx (with cacheComponents: true)",
          code: `import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { cookies } from "next/headers";

async function getFeaturedProducts() {
  "use cache";              // result cached; arguments become part of the cache key
  cacheLife("hours");       // built-in profiles: seconds, minutes, hours, days, weeks, max
  cacheTag("products");     // invalidate later with revalidateTag("products", "max")
  return shopifyStorefront(FEATURED_QUERY);
}

export default async function ShopPage() {
  const products = await getFeaturedProducts();  // part of the static shell
  return (
    <>
      <ProductGrid products={products} />
      <Suspense fallback={<CartSkeleton />}>
        <Cart />                                   {/* request-time: streamed in */}
      </Suspense>
    </>
  );
}

async function Cart() {
  const cartId = (await cookies()).get("cartId")?.value;
  return <CartSummary cart={await getCart(cartId)} />;
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Two caching models coexist",
          text: "Most existing Next 15/16 codebases still use the model above (`fetch` options, `export const revalidate`, `export const dynamic`). With `cacheComponents: true`, those segment configs are replaced by `\"use cache\"` + `cacheLife` and using them is an error. Check `next.config.ts` first to know which world a project lives in. Also: don't read `cookies()`/`headers()` *inside* a `\"use cache\"` function — read them outside and pass values as arguments.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Caching Supabase or Prisma queries",
          text: "DB clients don't go through your own `fetch(…, { next })` options, so the old model can't cache them per call (except with the older `unstable_cache` helper). With Cache Components you just put `\"use cache\"` + `cacheTag(\"clients\")` in the query function. Never cache per-user data under a shared key — pass the user/org id as an argument so it's part of the key.",
        },
        {
          type: "challenge",
          title: "A tiny revalidating cache",
          prompt: "Build `createCache(now)` (`now()` returns the current time in ms — tests use a fake clock). It returns `{ cached, revalidateTag }`. `cached(key, loader, { revalidate, tags })`: on a miss, await `loader()`, store it with the time and tags, return it. If the entry is younger than `revalidate` **seconds**, return it without calling `loader`. If it's older (stale), return the **stale value immediately** and refresh it in the background (call `loader()` without awaiting; when it resolves, store the new value and time). `revalidateTag(tag)` deletes every entry carrying that tag, so the next call is a miss.",
          starter: `function createCache(now) {
  const store = new Map();

  async function cached(key, loader, { revalidate, tags = [] }) {
    // TODO: hit / miss / stale-while-revalidate
    return loader();
  }

  function revalidateTag(tag) {
    // TODO
  }

  return { cached, revalidateTag };
}`,
          solution: `function createCache(now) {
  const store = new Map(); // key -> { value, storedAt, tags, refreshing }

  async function cached(key, loader, { revalidate, tags = [] }) {
    const entry = store.get(key);
    if (!entry) {
      const value = await loader();
      store.set(key, { value, storedAt: now(), tags, refreshing: false });
      return value;
    }
    const ageMs = now() - entry.storedAt;
    if (ageMs < revalidate * 1000) return entry.value; // fresh hit

    if (!entry.refreshing) {
      entry.refreshing = true;
      loader()
        .then((value) => store.set(key, { value, storedAt: now(), tags, refreshing: false }))
        .catch(() => { entry.refreshing = false; }); // keep serving stale on failure
    }
    return entry.value; // stale, but instant
  }

  function revalidateTag(tag) {
    for (const [key, entry] of store) {
      if (entry.tags.includes(tag)) store.delete(key);
    }
  }

  return { cached, revalidateTag };
}`,
          tests: [
            {
              name: "a miss calls the loader and returns its value",
              code: `let t = 0;
const c = createCache(() => t);
const v = await c.cached("products", async () => ["hoodie", "cap"], { revalidate: 60 });
return v.length === 2;`,
            },
            {
              name: "a fresh hit doesn't call the loader again",
              code: `let t = 0, calls = 0;
const c = createCache(() => t);
const load = async () => ++calls;
await c.cached("products", load, { revalidate: 60 });
t = 30000; // 30 s later
const v = await c.cached("products", load, { revalidate: 60 });
return v === 1 && calls === 1;`,
            },
            {
              name: "after the window: stale value now, fresh value on the next call",
              code: `let t = 0, calls = 0;
const c = createCache(() => t);
const load = async () => ++calls;
await c.cached("products", load, { revalidate: 60 });
t = 61000;
const stale = await c.cached("products", load, { revalidate: 60 });
await new Promise((r) => setTimeout(r, 10)); // let the background refresh finish
const fresh = await c.cached("products", load, { revalidate: 60 });
return stale === 1 && fresh === 2 && calls === 2;`,
            },
            {
              name: "revalidateTag purges only entries with that tag",
              code: `let t = 0, p = 0, cl = 0;
const c = createCache(() => t);
const loadP = async () => ++p;
const loadC = async () => ++cl;
await c.cached("products", loadP, { revalidate: 3600, tags: ["products"] });
await c.cached("clients", loadC, { revalidate: 3600, tags: ["clients"] });
c.revalidateTag("products");
const pv = await c.cached("products", loadP, { revalidate: 3600, tags: ["products"] });
const cv = await c.cached("clients", loadC, { revalidate: 3600, tags: ["clients"] });
return pv === 2 && cv === 1;`,
            },
            {
              name: "edge case: different keys never share values",
              code: `let t = 0;
const c = createCache(() => t);
const a = await c.cached("client:1", async () => "Voltix", { revalidate: 60 });
const b = await c.cached("client:2", async () => "Monia", { revalidate: 60 });
return a === "Voltix" && b === "Monia";`,
            },
          ],
          hint: "Store `{ value, storedAt, tags }` in a `Map`. Age = `now() - storedAt`; compare with `revalidate * 1000`. For the stale case, call `loader().then(v => store.set(...))` *without* `await`, then `return entry.value`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In Next 15+, a page does a plain `fetch(url)` and uses no cookies, headers or searchParams. What happens?",
              options: [
                "The fetch runs on every request",
                "The page is prerendered at build time, so the data is frozen until a revalidation or redeploy",
                "The build fails",
                "The fetch is cached for one hour by default",
              ],
              answer: 1,
              why: "The fetch isn't data-cached, but the route is still static: Next fetches once during `next build` and bakes the result into HTML.",
            },
            {
              q: "A Shopify webhook says a product changed. What's the best way to update the product pages?",
              options: [
                "Redeploy the site",
                "Set `revalidate = 1` on every page",
                "In the webhook handler, call `revalidateTag(\"products\", \"max\")` for data tagged \"products\"",
                "Call `router.refresh()`",
              ],
              answer: 2,
              why: "On-demand revalidation invalidates exactly the tagged data when it changes. `router.refresh()` only refreshes the current browser's view.",
            },
            {
              q: "Which statement about `\"use cache\"` is correct?",
              options: [
                "It's enabled by default in every Next 16 app",
                "It only works on `fetch` calls",
                "It replaces the need for `<Suspense>`",
                "It's part of Cache Components, an opt-in enabled with `cacheComponents: true`",
              ],
              answer: 3,
              why: "Cache Components must be turned on in `next.config.ts`. Then `\"use cache\"` can mark any async function or component — DB queries included — as cacheable.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Server Actions & forms
    // ─────────────────────────────────────────────────────────────
    {
      slug: "server-actions-and-forms",
      title: "Server Actions & forms",
      summary: "Mutate data with async functions that run on the server — validated, authorized, and wired straight into forms.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Saving a form in a classic SPA means: write an API endpoint, `fetch` it from the client, track loading and errors, then refetch the list. **Server Actions** collapse that: you write an `async` function marked `\"use server\"`, pass it to a `<form action>`, and Next creates the endpoint, sends the form data and refreshes the UI.",
        },
        {
          type: "code",
          lang: "ts",
          title: "app/(dashboard)/leads/actions.ts",
          code: `"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function addLead(formData: FormData) {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  if (!name || !email.includes("@")) throw new Error("Invalid lead");

  await db.lead.create({ data: { name, email, orgId, createdBy: userId } });

  revalidatePath("/leads");  // the list shows the new lead
  redirect("/leads");        // navigate back (throws internally — keep it outside try/catch)
}`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/(dashboard)/leads/new/page.tsx",
          code: `import { addLead } from "../actions";

export default function NewLeadPage() {
  return (
    <form action={addLead} className="space-y-3">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <button type="submit">Add lead</button>
    </form>
  );
}`,
        },
        {
          type: "p",
          text: "Notice: no `\"use client\"`, no `useState`, no `onSubmit`. The form even works **before JavaScript loads** (progressive enhancement) because it's a real HTML form posting to the server.",
        },
        { type: "h", text: "Form data is always strings" },
        {
          type: "p",
          text: "Whatever the input type, `formData.get()` returns a string (or a `File`, or `null` if the field is absent). Numbers, dates and checkboxes must be parsed and validated on the server. `URLSearchParams` has the same `.get()` API, so we can see the traps here:",
        },
        {
          type: "run",
          code: `// what a form with <input type="number" name="hours"> etc. really sends
const form = new URLSearchParams("clientId=cli_1&hours=7.5&amount=&rush=on");

console.log("hours:", form.get("hours"), "→", typeof form.get("hours"));
console.log("Number(amount) where amount is '':", Number(form.get("amount")), "← 0, not an error!");
console.log("Number('12,50') (French decimal):", Number("12,50"));
console.log("checked checkbox:", form.get("rush"));
console.log("unchecked checkbox (absent):", form.get("urgent"));
console.log("as an object:", Object.fromEntries(form));`,
        },
        { type: "h", text: "Validation with Zod" },
        {
          type: "code",
          lang: "ts",
          title: "app/(dashboard)/invoices/actions.ts",
          code: `"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const InvoiceSchema = z.object({
  clientId: z.string().min(1, "Choose a client"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  dueDate: z.iso.date("Use YYYY-MM-DD"),
});

export type InvoiceState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof InvoiceSchema>, string[]>>;
};

export async function createInvoice(prev: InvoiceState, formData: FormData): Promise<InvoiceState> {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return { ok: false, message: "Unauthorized" };

  const parsed = InvoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    // Zod 4. In Zod 3: parsed.error.flatten().fieldErrors
    return { ok: false, errors: z.flattenError(parsed.error).fieldErrors };
  }

  await db.invoice.create({ data: { ...parsed.data, orgId, createdBy: userId } });
  revalidatePath("/invoices");
  return { ok: true, message: "Invoice created" };
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "z.coerce.number() and empty strings",
          text: "`z.coerce.number()` turns `\"\"` into `0`. Here `.positive()` catches it, but for optional numeric fields add an explicit check (e.g. preprocess `\"\"` to `undefined`) — you just saw `Number(\"\") === 0` above.",
        },
        { type: "h", text: "Showing errors and pending state: useActionState" },
        {
          type: "code",
          lang: "tsx",
          title: "app/(dashboard)/invoices/new/InvoiceForm.tsx",
          code: `"use client";

import { useActionState } from "react";
import { createInvoice, type InvoiceState } from "../actions";

const initial: InvoiceState = { ok: false };

export function InvoiceForm() {
  // the action now receives (previousState, formData)
  const [state, formAction, isPending] = useActionState(createInvoice, initial);

  return (
    <form action={formAction}>
      <input name="amount" inputMode="decimal" />
      {state.errors?.amount && <p className="text-red-600">{state.errors.amount[0]}</p>}

      <input name="dueDate" type="date" />
      {state.errors?.dueDate && <p className="text-red-600">{state.errors.dueDate[0]}</p>}

      <button disabled={isPending}>{isPending ? "Saving…" : "Create invoice"}</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Return errors, throw bugs",
          text: "Expected problems (invalid input, not allowed) → *return* a state object the form can display. Unexpected failures (DB down) → let them throw so `error.tsx` and your logs catch them.",
        },
        { type: "h", text: "Security: every action is a public endpoint" },
        {
          type: "p",
          text: "Under the hood, each action is reachable with a POST request carrying an action ID. Next makes those IDs hard to guess and drops unused actions from the build, but anyone who can load your page can call the action **with any arguments they like**. Hiding the button in the UI is not protection.",
        },
        {
          type: "list",
          ordered: true,
          items: [
            "**Authenticate**: who is calling? (`await auth()` with Clerk, `supabase.auth.getUser()` with Supabase).",
            "**Authorize**: may *this* user touch *this* record? Check that the invoice's `orgId` matches theirs.",
            "**Validate**: parse every input; never trust hidden fields like `<input type=\"hidden\" name=\"ownerId\">`.",
            "**Derive** sensitive values on the server (owner, prices, discounts) instead of reading them from the form.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Defense in depth with Supabase",
          text: "Even with checks in your actions, keep Row Level Security policies on in Supabase. If an action forgets an authorization check, RLS (with the user-scoped server client, not the `service_role` key) still blocks cross-tenant writes.",
        },
        {
          type: "challenge",
          title: "A safe createInvoice action",
          prompt: "Implement `createInvoice(prevState, formData)` (`formData` has a `.get(name)` method). Use the provided `auth()` and `invoices` array. 1) If `auth()` returns no `userId`, return `{ ok: false, message: \"Unauthorized\" }`. 2) Validate: `clientId` non-empty after trim; `amount` a non-empty string converting to a finite number > 0; `dueDate` matching `YYYY-MM-DD`. If any fail, return `{ ok: false, errors }` where `errors` has a message per invalid field, and insert nothing. 3) On success push `{ clientId, amount, dueDate, ownerId }` (amount as a **number**, `ownerId` from `auth()`, **never** from the form) and return `{ ok: true, message: \"Invoice created\" }`.",
          starter: `let currentUser = { id: "user_alexis" };
const auth = async () => ({ userId: currentUser ? currentUser.id : null });
const invoices = [];

async function createInvoice(prevState, formData) {
  const data = Object.fromEntries(formData);
  invoices.push({ ...data });
  return { ok: true, message: "Invoice created" };
}`,
          solution: `let currentUser = { id: "user_alexis" };
const auth = async () => ({ userId: currentUser ? currentUser.id : null });
const invoices = [];

async function createInvoice(prevState, formData) {
  const { userId } = await auth();
  if (!userId) return { ok: false, message: "Unauthorized" };

  const clientId = String(formData.get("clientId") ?? "").trim();
  const rawAmount = String(formData.get("amount") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim();
  const amount = Number(rawAmount);

  const errors = {};
  if (!clientId) errors.clientId = "Choose a client";
  if (rawAmount === "" || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be a number greater than 0";
  }
  if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(dueDate)) errors.dueDate = "Use YYYY-MM-DD";
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  invoices.push({ clientId, amount, dueDate, ownerId: userId });
  return { ok: true, message: "Invoice created" };
}`,
          tests: [
            {
              name: "valid form → ok, stored with a numeric amount",
              code: `const before = invoices.length;
const res = await createInvoice({}, new URLSearchParams({ clientId: "cli_1", amount: "1250.50", dueDate: "2026-11-01" }));
const saved = invoices[invoices.length - 1];
return res.ok === true && invoices.length === before + 1 && saved.amount === 1250.5;`,
            },
            {
              name: "empty or non-numeric amount → errors.amount, nothing stored",
              code: `const before = invoices.length;
const a = await createInvoice({}, new URLSearchParams({ clientId: "cli_1", amount: "", dueDate: "2026-11-01" }));
const b = await createInvoice({}, new URLSearchParams({ clientId: "cli_1", amount: "abc", dueDate: "2026-11-01" }));
return a.ok === false && !!a.errors.amount && !!b.errors.amount && invoices.length === before;`,
            },
            {
              name: "reports every invalid field at once",
              code: `const res = await createInvoice({}, new URLSearchParams({ clientId: "  ", amount: "-5", dueDate: "01/11/2026" }));
return res.ok === false && !!res.errors.clientId && !!res.errors.amount && !!res.errors.dueDate;`,
            },
            {
              name: "signed-out callers get Unauthorized and nothing is stored",
              code: `const before = invoices.length;
currentUser = null;
const res = await createInvoice({}, new URLSearchParams({ clientId: "cli_1", amount: "100", dueDate: "2026-11-01" }));
currentUser = { id: "user_alexis" };
return res.ok === false && res.message === "Unauthorized" && invoices.length === before;`,
            },
            {
              name: "edge case: a forged ownerId field in the form is ignored",
              code: `await createInvoice({}, new URLSearchParams({ clientId: "cli_2", amount: "99", dueDate: "2026-12-01", ownerId: "user_attacker" }));
return invoices[invoices.length - 1].ownerId === "user_alexis";`,
            },
          ],
          hint: "Check `auth()` first. Read each field with `String(formData.get(name) ?? \"\").trim()`, collect problems in an `errors` object, and return early if it has any keys. Build the stored object field by field instead of spreading the form.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Your delete button is only rendered for admins. Is the `deleteClient` server action safe without an auth check inside it?",
              options: [
                "No — anyone can POST to the action; it must check auth and permissions itself",
                "Yes — non-admins never see the button",
                "Yes — action IDs are secret",
                "Yes, if the page uses Clerk's proxy",
              ],
              answer: 0,
              why: "Server actions are public HTTP endpoints. UI visibility, obscure IDs and route-level protection don't replace an authorization check inside the action.",
            },
            {
              q: "With `useActionState(action, initial)`, what does the action receive?",
              options: ["Only `formData`", "`(event, formData)`", "`(previousState, formData)`", "Nothing — it reads the form from the DOM"],
              answer: 2,
              why: "`useActionState` passes the previous state as the first argument so the action can return the next state (errors, messages).",
            },
            {
              q: "What does `formData.get(\"amount\")` return for `<input type=\"number\" name=\"amount\" value=\"12\">`?",
              options: ["The number `12`", "A string or null (here `\"12\"`)", "`undefined` until validated", "A `File`"],
              answer: 1,
              why: "Form data is text on the wire. Convert and validate it on the server (e.g. `z.coerce.number()`).",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Route Handlers
    // ─────────────────────────────────────────────────────────────
    {
      slug: "route-handlers",
      title: "Route Handlers (API)",
      summary: "Real HTTP endpoints in app/: JSON APIs, file exports and signed webhooks from Stripe, Shopify or Clerk.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Server components read data and server actions mutate it — both for *your own UI*. But sometimes **someone else** needs to call your app over HTTP: Stripe sending a payment event, Shopify announcing an order, a Zapier/Make scenario posting a lead, a mobile app, a cron job, or a browser downloading a CSV. That's what **Route Handlers** are for.",
        },
        {
          type: "p",
          text: "A `route.ts` file exports functions named after HTTP methods. They receive a standard Web `Request` (extended as `NextRequest`) and return a standard `Response` (or `NextResponse`).",
        },
        {
          type: "code",
          lang: "ts",
          title: "app/api/leads/route.ts",
          code: `import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

// GET /api/leads?source=facebook
export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  const leads = await db.lead.findMany({ where: source ? { source } : {} });
  return NextResponse.json({ leads });
}

// POST /api/leads — called by a landing page form or an automation tool
export async function POST(request: NextRequest) {
  if (request.headers.get("x-api-key") !== process.env.LEADS_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lead = await db.lead.create({ data: parseLead(body) }); // validate with Zod in parseLead
  return NextResponse.json({ lead }, { status: 201 });
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "app/api/invoices/[id]/pdf/route.ts",
          code: `export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }   // or: ctx: RouteContext<"/api/invoices/[id]/pdf">
) {
  const { id } = await params;
  const pdf = await renderInvoicePdf(id);           // Uint8Array
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": \`attachment; filename="invoice-\${id}.pdf"\`,
    },
  });
}`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Good to know",
          text: "Unsupported methods get an automatic `405 Method Not Allowed`. Since Next 15, `GET` handlers are **not cached** by default (opt in with `export const dynamic = \"force-static\"`). A folder can't have both `page.tsx` and `route.ts` — keep APIs under `app/api/` by convention.",
        },
        { type: "h", text: "Webhooks: trust, but verify the signature" },
        {
          type: "p",
          text: "A webhook URL is public: anyone can POST a fake \"order paid\" event to it. Providers prevent this by **signing** each request with a secret only you and they know. Your handler must recompute the signature and reject mismatches before doing anything.",
        },
        {
          type: "steps",
          items: [
            { title: "Provider signs", text: "It computes an HMAC-SHA256 of the **raw request body** with your shared webhook secret and sends it in a header (`X-Shopify-Hmac-Sha256`, `Stripe-Signature`, Svix headers for Clerk)." },
            { title: "Read the raw body", text: "`await request.text()` — the exact bytes. Not `request.json()`: parsing and re-serializing changes the bytes." },
            { title: "Recompute and compare", text: "HMAC the raw body with your secret and compare with a constant-time comparison." },
            { title: "Reject or process", text: "Mismatch → `401`. Match → handle the event **idempotently** (providers retry, so the same event can arrive twice — store the event id)." },
            { title: "Answer fast", text: "Return `200` quickly; push slow work to a queue or `after()` so the provider doesn't time out and retry." },
          ],
        },
        {
          type: "code",
          lang: "ts",
          title: "app/api/webhooks/shopify/route.ts",
          code: `import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const rawBody = await request.text(); // exact bytes Shopify signed
  const received = request.headers.get("x-shopify-hmac-sha256") ?? "";
  const expected = createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET!)
    .update(rawBody, "utf8")
    .digest("base64");

  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response("Invalid signature", { status: 401 });
  }

  const topic = request.headers.get("x-shopify-topic");          // e.g. "products/update"
  const webhookId = request.headers.get("x-shopify-webhook-id"); // for idempotency
  if (await alreadyProcessed(webhookId)) return new Response(null, { status: 200 });

  if (topic?.startsWith("products/")) revalidateTag("products", "max");
  return new Response(null, { status: 200 });
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "Stripe and Clerk ship helpers for the same idea",
          code: `// app/api/webhooks/stripe/route.ts
const event = stripe.webhooks.constructEvent(
  await request.text(),
  request.headers.get("stripe-signature")!,
  process.env.STRIPE_WEBHOOK_SECRET!
); // throws if the signature is wrong

// app/api/webhooks/clerk/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";
const evt = await verifyWebhook(request); // uses CLERK_WEBHOOK_SIGNING_SECRET, throws if invalid
if (evt.type === "user.created") await createProfile(evt.data.id);`,
        },
        {
          type: "p",
          text: "Why insist on the raw body? Watch what parsing does to a Shopify-style payload. (The signing function below is a toy stand-in for HMAC-SHA256 so it runs here — the principle is identical.)",
        },
        {
          type: "run",
          code: `// Toy keyed hash (NOT secure) standing in for HMAC-SHA256
function toySign(secret, body) {
  let h = 2166136261;
  for (const ch of secret + "|" + body) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0; // time doesn't depend on where the first difference is
}

const secret = "whsec_shared_with_shopify";
const rawBody = '{"id": 820982911946154508, "total_price": "199.00"}';
const header = toySign(secret, rawBody); // what Shopify sends

console.log("verify raw body:     ", safeEqual(toySign(secret, rawBody), header));

const reserialized = JSON.stringify(JSON.parse(rawBody));
console.log("re-serialized body:  ", reserialized);
console.log("verify re-serialized:", safeEqual(toySign(secret, reserialized), header));

const forged = rawBody.replace("199.00", "0.01");
console.log("verify forged body:  ", safeEqual(toySign(secret, forged), header));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Two bugs hiding in that output",
          text: "Re-serializing removed the spaces **and** changed the id: `820982911946154508` is larger than `Number.MAX_SAFE_INTEGER`, so `JSON.parse` rounded it. Always verify against `await request.text()`, and treat big numeric ids from Shopify as strings (use the `admin_graphql_api_id` / GID instead).",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Let webhooks through your auth",
          text: "If Clerk's `clerkMiddleware` protects everything, mark `/api/webhooks/(.*)` as a public route — Stripe and Shopify have no Clerk session. Webhooks authenticate with their signature instead.",
        },
        { type: "h", text: "Route handler or server action?" },
        {
          type: "table",
          rows: [
            ["Situation", "Use"],
            ["A form or button in your own Next.js UI changes data", "Server Action"],
            ["Reading data for your own pages", "Neither — fetch in a server component"],
            ["A third party calls you (Stripe, Shopify, Clerk, Zapier)", "Route Handler"],
            ["Non-HTML responses: CSV, PDF, RSS, images", "Route Handler"],
            ["A public/versioned JSON API for a mobile app or partner", "Route Handler"],
            ["A Vercel Cron job", "Route Handler (GET, check the `CRON_SECRET` header)"],
          ],
        },
        {
          type: "challenge",
          title: "A mini /api/leads handler",
          prompt: "Implement `handleLeads(req)` where `req` is `{ method, headers, body }` (`headers` keys are lowercase, `body` is the raw string). Return `{ status, body }`. Rules, in order: methods other than GET/POST → `405`. GET → `200` with `{ leads }`. POST: if `headers[\"x-api-key\"] !== API_KEY` → `401`; if the body isn't valid JSON → `400`; if `name` (non-empty after trim) or `email` (must contain `@`) is invalid → `422` with `{ errors }` naming each bad field; otherwise create `{ id: crypto.randomUUID(), name, email, source }` (`source` defaults to `\"website\"`), push it into `leads` and return `201` with `{ lead }`.",
          starter: `const API_KEY = "test_key_123";
const leads = [];

async function handleLeads(req) {
  const data = JSON.parse(req.body);
  leads.push(data);
  return { status: 201, body: { lead: data } };
}`,
          solution: `const API_KEY = "test_key_123";
const leads = [];

async function handleLeads(req) {
  if (req.method === "GET") return { status: 200, body: { leads } };
  if (req.method !== "POST") return { status: 405, body: { error: "Method not allowed" } };

  if (req.headers["x-api-key"] !== API_KEY) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  let data;
  try {
    data = JSON.parse(req.body);
  } catch {
    return { status: 400, body: { error: "Invalid JSON" } };
  }

  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  const errors = {};
  if (!name) errors.name = "Name is required";
  if (!email.includes("@")) errors.email = "A valid email is required";
  if (Object.keys(errors).length) return { status: 422, body: { errors } };

  const lead = { id: crypto.randomUUID(), name, email, source: data.source ?? "website" };
  leads.push(lead);
  return { status: 201, body: { lead } };
}`,
          tests: [
            {
              name: "DELETE → 405",
              code: `const r = await handleLeads({ method: "DELETE", headers: {}, body: "" });
return r.status === 405;`,
            },
            {
              name: "POST without the right x-api-key → 401",
              code: `const r = await handleLeads({ method: "POST", headers: { "x-api-key": "wrong" }, body: '{"name":"Ana","email":"ana@resto.ca"}' });
return r.status === 401;`,
            },
            {
              name: "malformed JSON → 400 (without throwing)",
              code: `const r = await handleLeads({ method: "POST", headers: { "x-api-key": API_KEY }, body: "{name: Ana" });
return r.status === 400;`,
            },
            {
              name: "missing name and bad email → 422 listing both fields",
              code: `const r = await handleLeads({ method: "POST", headers: { "x-api-key": API_KEY }, body: '{"name":"  ","email":"ana.resto.ca"}' });
return r.status === 422 && !!r.body.errors.name && !!r.body.errors.email;`,
            },
            {
              name: "valid lead → 201, default source, then visible via GET",
              code: `const r = await handleLeads({ method: "POST", headers: { "x-api-key": API_KEY }, body: '{"name":"Marc Tremblay","email":"marc@plomberie.ca"}' });
const list = await handleLeads({ method: "GET", headers: {}, body: "" });
return r.status === 201 && r.body.lead.source === "website" && list.body.leads.some((l) => l.email === "marc@plomberie.ca");`,
            },
          ],
          hint: "Handle the cheap checks first (method, API key), then wrap `JSON.parse` in `try/catch`. Build an `errors` object and return 422 if it has keys. Only push a lead you constructed yourself.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Why must a webhook handler verify the signature against `await request.text()` rather than `await request.json()`?",
              options: [
                "`json()` is slower",
                "The signature was computed over the exact raw bytes; parsing and re-serializing can change them",
                "`json()` doesn't work in route handlers",
                "Because webhooks are always XML",
              ],
              answer: 1,
              why: "Whitespace, key order and number precision can all change when you parse and re-stringify. Verify the raw text, then `JSON.parse` it.",
            },
            {
              q: "A \"Save\" button in your dashboard updates a project's name. What should it call?",
              options: ["A Route Handler via `fetch`", "A Server Action", "A webhook", "`generateStaticParams`"],
              answer: 1,
              why: "Mutations from your own UI are what Server Actions are for: less code, typed arguments, integrated revalidation. Route handlers are for outside callers and non-HTML responses.",
            },
            {
              q: "Your route.ts only exports `GET`. What does a `POST` to that URL return?",
              options: ["404", "500", "405 Method Not Allowed", "It runs `GET`"],
              answer: 2,
              why: "Next responds `405` automatically for HTTP methods the route doesn't export.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 9. Proxy (middleware), auth & env vars
    // ─────────────────────────────────────────────────────────────
    {
      slug: "proxy-auth-and-env",
      title: "Proxy (middleware), auth & env vars",
      summary: "Run code before routes render to redirect and protect pages, and understand which env vars reach the browser.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Some decisions must happen **before** any page renders: send signed-out users to the sign-in page, redirect an old URL after a site migration, pick a locale, add security headers. Next lets you run one function in front of every matching request for that.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Same feature, new name in Next 16",
          text: "Up to Next 15 this file is `middleware.ts` exporting a `middleware` function. **Next 16 renamed it to `proxy.ts`** exporting `proxy` — same capabilities, clearer name (it sits in front of your app like a network proxy). `middleware.ts` is deprecated but you'll see it in most existing projects and tutorials. Migrate with `npx @next/codemod@canary middleware-to-proxy .` In Next 16, Proxy runs on the Node.js runtime.",
        },
        {
          type: "compare",
          left: {
            label: "middleware.ts (Next ≤ 15)",
            lang: "ts",
            code: `import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/old-pricing") {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`,
          },
          right: {
            label: "proxy.ts (Next 16)",
            lang: "ts",
            code: `import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/old-pricing") {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`,
          },
        },
        {
          type: "p",
          text: "The file lives at the project root (or in `src/`), next to `app/`. Its function can return `NextResponse.next()` (continue), `NextResponse.redirect(url)` (the browser goes elsewhere, URL changes), `NextResponse.rewrite(url)` (serve another route, URL stays the same) or a `Response` directly. The `matcher` limits which paths run it — without one, it runs for every request, including JS chunks and images.",
        },
        { type: "h", text: "Protecting routes with Clerk" },
        {
          type: "code",
          lang: "ts",
          title: "proxy.ts (middleware.ts on Next ≤ 15)",
          code: `import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",   // Stripe/Shopify/Clerk authenticate with signatures
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // signed out → redirected to sign-in
  }
});

export const config = {
  // Clerk's docs provide a longer matcher that also skips static files; this is the idea:
  matcher: ["/((?!_next|.*\\\\..*).*)", "/(api|trpc)(.*)"],
};`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "The proxy is the first gate, not the only one",
          text: "Keep checking auth where data is read or written: in server components (`await auth()`), server actions and route handlers. A matcher typo can leave a route unprotected, and in March 2025 a vulnerability (CVE-2025-29927) let attackers skip middleware entirely with a crafted header on unpatched Next versions. Defense in depth — and keep Next updated.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Keep it light",
          text: "Proxy runs before *every* matched request, so avoid slow work like database queries there. Read a cookie or session token, decide, move on. Next's own docs describe it as a last resort for things that can't be done elsewhere.",
        },
        {
          type: "challenge",
          title: "Write the proxy's decision logic",
          prompt: "Implement `proxyDecision({ pathname, search = \"\", userId = null, role = null })` returning `{ action: \"next\" }`, `{ action: \"redirect\", to }` or `{ action: \"rewrite\", to }`. Rules: 1) Skip (`next`) anything under `/_next/`, any path whose last segment contains a `.` (a file), and anything under `/api/webhooks/`. 2) A signed-in user visiting `/sign-in` → redirect to `/dashboard`. 3) `/dashboard` and `/admin` (and anything below them) require a user: if none, redirect to `/sign-in?redirect_url=…` with the original `pathname + search`, URL-encoded. 4) Under `/admin`, a signed-in user whose role isn't `\"admin\"` → rewrite to `/403`. 5) Everything else → `next`. Note: `/dashboard-old` is *not* under `/dashboard`.",
          starter: `function proxyDecision({ pathname, search = "", userId = null, role = null }) {
  if (pathname.startsWith("/dashboard") && !userId) {
    return { action: "redirect", to: "/sign-in" };
  }
  return { action: "next" };
}`,
          solution: `function proxyDecision({ pathname, search = "", userId = null, role = null }) {
  const last = pathname.split("/").pop() ?? "";
  if (pathname.startsWith("/_next/") || last.includes(".") || pathname.startsWith("/api/webhooks/")) {
    return { action: "next" };
  }

  const under = (base) => pathname === base || pathname.startsWith(base + "/");

  if (under("/sign-in") && userId) return { action: "redirect", to: "/dashboard" };

  if (under("/dashboard") || under("/admin")) {
    if (!userId) {
      const qs = new URLSearchParams({ redirect_url: pathname + search });
      return { action: "redirect", to: "/sign-in?" + qs };
    }
    if (under("/admin") && role !== "admin") return { action: "rewrite", to: "/403" };
  }

  return { action: "next" };
}`,
          tests: [
            {
              name: "static files, Next assets and webhooks pass through when signed out",
              code: `return ["/_next/static/chunks/main.js", "/logo.svg", "/api/webhooks/shopify"].every((p) => proxyDecision({ pathname: p }).action === "next");`,
            },
            {
              name: "signed-out /dashboard/clients?tab=open → /sign-in with an encoded redirect_url",
              code: `const r = proxyDecision({ pathname: "/dashboard/clients", search: "?tab=open" });
if (r.action !== "redirect") return false;
const u = new URL(r.to, "https://portal.test");
return u.pathname === "/sign-in" && u.searchParams.get("redirect_url") === "/dashboard/clients?tab=open";`,
            },
            {
              name: "a signed-in member can use /dashboard but gets /403 on /admin",
              code: `const a = proxyDecision({ pathname: "/dashboard", userId: "user_1", role: "member" });
const b = proxyDecision({ pathname: "/admin/users", userId: "user_1", role: "member" });
return a.action === "next" && b.action === "rewrite" && b.to === "/403";`,
            },
            {
              name: "an admin can open /admin",
              code: `return proxyDecision({ pathname: "/admin", userId: "user_2", role: "admin" }).action === "next";`,
            },
            {
              name: "signed-in users on /sign-in go to /dashboard",
              code: `const r = proxyDecision({ pathname: "/sign-in", userId: "user_1" });
return r.action === "redirect" && r.to === "/dashboard";`,
            },
            {
              name: "edge case: /dashboard-old and /pricing are public",
              code: `return proxyDecision({ pathname: "/dashboard-old" }).action === "next" && proxyDecision({ pathname: "/pricing" }).action === "next";`,
            },
          ],
          hint: "Write a helper `under(base)` that is true for `base` itself or anything starting with `base + \"/\"` — that avoids the `/dashboard-old` trap. Build the query string with `new URLSearchParams({ redirect_url: pathname + search })`.",
        },
        { type: "h", text: "Environment variables" },
        {
          type: "p",
          text: "Your app needs configuration that differs per environment and must not live in Git: API keys, database URLs, Clerk keys. Next loads them from `.env*` files into `process.env` — on the **server**. The browser only ever sees variables whose name starts with `NEXT_PUBLIC_`.",
        },
        {
          type: "code",
          lang: "bash",
          title: ".env.local (never committed)",
          code: `# Safe in the browser (meant to be public)
NEXT_PUBLIC_SUPABASE_URL=https://abcd1234.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...        # protected by RLS, designed to be public
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

# Server only — no prefix
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...            # bypasses RLS!
CLERK_SECRET_KEY=sk_test_...
SHOPIFY_ADMIN_TOKEN=shpat_...
SHOPIFY_WEBHOOK_SECRET=...`,
        },
        {
          type: "p",
          text: "**Why the prefix?** During `next build`, Next replaces every literal `process.env.NEXT_PUBLIC_SOMETHING` in client code with the actual value, as text, inside the JavaScript bundle that every visitor downloads. The prefix is an explicit \"yes, publish this\" so a secret can never end up there by accident. Unprefixed variables are simply `undefined` in the browser.",
        },
        {
          type: "run",
          code: `// What next build does to a client component's code (simplified)
const env = {
  NEXT_PUBLIC_SUPABASE_URL: "https://abcd1234.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOi...SECRET",
};

const clientSource = \`const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = process.env.SUPABASE_SERVICE_ROLE_KEY;
const name = "SUPABASE_URL";
const dynamic = process.env["NEXT_PUBLIC_" + name];\`;

function inlineForBrowser(source, env) {
  return source.replace(/process\\.env\\.([A-Z0-9_]+)/g, (match, name) =>
    name.startsWith("NEXT_PUBLIC_") ? JSON.stringify(env[name]) : "undefined"
  );
}

console.log(inlineForBrowser(clientSource, env));
// Note the last line: dynamic lookups are NOT inlined, so they're undefined in the browser.`,
        },
        {
          type: "table",
          rows: [
            ["File", "Loaded when", "Commit it?"],
            ["`.env`", "Always", "Yes — non-secret defaults only"],
            ["`.env.development` / `.env.production`", "`next dev` / `next build` + `next start`", "Yes — non-secret"],
            ["`.env.local`", "Always, except in tests", "**Never** (gitignored)"],
            ["`.env.development.local` etc.", "That environment", "Never"],
            ["Real environment variables (Vercel, Railway)", "Always — they win over every file", "Set in the host's dashboard"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Public vars are frozen at build time",
          text: "Because `NEXT_PUBLIC_` values are pasted into the bundle during the build, changing one in the Vercel dashboard does nothing until you **redeploy**. Server-only variables are read at runtime, but still need a redeploy on Vercel to reach new functions. Also, `process.env[name]` with a computed name is never inlined.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Your stack's keys at a glance",
          text: "Supabase *anon/publishable* key and URL: public by design (RLS protects data). Supabase *service_role* key: server only, bypasses RLS. Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` public, `CLERK_SECRET_KEY` server. Shopify Admin token, Stripe secret key, AI API keys: always server only. Use `vercel env pull` to download a project's development variables into `.env.local`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You upgrade a project to Next 16. What happens to its `middleware.ts`?",
              options: [
                "It's deprecated in favor of `proxy.ts` (exporting `proxy`); a codemod renames it",
                "It's deleted automatically",
                "It must be moved into `app/`",
                "Nothing — the name never changed",
              ],
              answer: 0,
              why: "Next 16 renamed the convention to Proxy. `middleware.ts` still works for now but is deprecated; `npx @next/codemod@canary middleware-to-proxy .` migrates it.",
            },
            {
              q: "A client component reads `process.env.STRIPE_SECRET_KEY`. What does it get in the browser?",
              options: ["The secret key", "An empty string", "A build error", "`undefined`"],
              answer: 3,
              why: "Only `NEXT_PUBLIC_` variables are inlined into client bundles. That's the safety net that keeps the secret out of the browser.",
            },
            {
              q: "Proxy redirects signed-out users away from `/dashboard`. Do the dashboard's server actions still need to check auth?",
              options: [
                "No, the proxy already did it",
                "Yes — actions are POST endpoints and the proxy is only a first gate",
                "Only in development",
                "Only if they use Supabase",
              ],
              answer: 1,
              why: "Matchers can miss paths, and proxy bypass bugs have happened. Verify the user where the data is accessed.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 10. Images, fonts, scripts & production
    // ─────────────────────────────────────────────────────────────
    {
      slug: "optimizations-and-production",
      title: "Images, fonts, scripts & production",
      summary: "Built-in components for fast pages, reading next build output, deploying to Vercel and fixing common build errors.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Clients judge a site by how fast it feels, and Google ranks it partly on **Core Web Vitals**: LCP (how fast the main content shows), CLS (does the layout jump), INP (how fast it reacts). Unoptimized images, web fonts and third-party tags are the usual culprits. Next ships components that fix them by default.",
        },
        { type: "h", text: "next/image" },
        {
          type: "code",
          lang: "tsx",
          title: "app/products/[handle]/page.tsx",
          code: `import Image from "next/image";
import heroBanner from "./hero-banner.jpg"; // static import: size known at build time

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const product = await getProduct(handle);
  return (
    <>
      <Image src={heroBanner} alt="Fall collection" placeholder="blur" preload />
      <Image
        src={product.featuredImage.url}            // remote: needs remotePatterns
        alt={product.featuredImage.altText ?? product.title}
        width={800}
        height={800}
        sizes="(max-width: 768px) 100vw, 33vw"     // which width to download per viewport
      />
    </>
  );
}`,
        },
        {
          type: "list",
          items: [
            "**Resizes and converts** to modern formats (WebP/AVIF) on demand via `/_next/image`, and generates a `srcset` so phones don't download desktop-sized photos.",
            "**Reserves space** using `width`/`height` (or `fill` inside a positioned parent), so the layout doesn't jump when the image loads (CLS).",
            "**Lazy-loads** images below the fold by default.",
            "For the hero / LCP image, set `preload` (Next 16; it was called `priority` before) — or `loading=\"eager\"` with `fetchPriority=\"high\"`.",
          ],
        },
        {
          type: "code",
          lang: "ts",
          title: "next.config.ts",
          code: `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;`,
        },
        {
          type: "p",
          text: "Why an allow-list? Without it, anyone could use your optimizer (and your bill) to resize any image on the internet. A remote URL that doesn't match a pattern makes `next/image` throw an error. The challenge below implements that check.",
        },
        {
          type: "challenge",
          title: "isAllowedRemote",
          prompt: "Implement `isAllowedRemote(src, patterns)` — `true` if the URL matches at least one pattern. Each pattern has `protocol` (e.g. `\"https\"`, compare with `url.protocol` which ends in `:`), `hostname` and an optional `pathname`. Hostname: exact match; `*.example.com` = exactly **one** extra label (`a.example.com`, not `a.b.example.com`); `**.example.com` = one or more labels. Pathname: if it ends with `/**`, the path must start with the prefix + `/`; otherwise exact match; if absent, any path. Invalid URLs → `false`.",
          starter: `function isAllowedRemote(src, patterns) {
  return patterns.some((p) => src.includes(p.hostname));
}`,
          solution: `function hostMatches(host, pattern) {
  if (pattern.startsWith("**.")) return host.endsWith("." + pattern.slice(3));
  if (pattern.startsWith("*.")) {
    const base = pattern.slice(2);
    if (!host.endsWith("." + base)) return false;
    const sub = host.slice(0, -(base.length + 1));
    return sub.length > 0 && !sub.includes(".");
  }
  return host === pattern;
}

function pathMatches(path, pattern) {
  if (pattern.endsWith("/**")) return path.startsWith(pattern.slice(0, -2));
  return path === pattern;
}

function isAllowedRemote(src, patterns) {
  let url;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  return patterns.some(
    (p) =>
      (!p.protocol || url.protocol === p.protocol + ":") &&
      hostMatches(url.hostname, p.hostname) &&
      (!p.pathname || pathMatches(url.pathname, p.pathname))
  );
}`,
          tests: [
            {
              name: "Shopify CDN product image under /s/files/ is allowed",
              code: `const patterns = [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" }];
return isAllowedRemote("https://cdn.shopify.com/s/files/1/0612/products/hoodie.jpg", patterns) === true;`,
            },
            {
              name: "same host, wrong path or http → rejected",
              code: `const patterns = [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" }];
return isAllowedRemote("https://cdn.shopify.com/other/hoodie.jpg", patterns) === false &&
  isAllowedRemote("http://cdn.shopify.com/s/files/1/hoodie.jpg", patterns) === false;`,
            },
            {
              name: "*.supabase.co allows one subdomain level only",
              code: `const patterns = [{ protocol: "https", hostname: "*.supabase.co" }];
return isAllowedRemote("https://abcd1234.supabase.co/storage/v1/object/public/logos/a.png", patterns) === true &&
  isAllowedRemote("https://a.b.supabase.co/x.png", patterns) === false;`,
            },
            {
              name: "**.example.com allows any depth of subdomains",
              code: `return isAllowedRemote("https://img.cdn.example.com/a.png", [{ protocol: "https", hostname: "**.example.com" }]) === true;`,
            },
            {
              name: "edge case: look-alike hosts and invalid URLs are rejected",
              code: `const patterns = [{ protocol: "https", hostname: "*.supabase.co" }];
return isAllowedRemote("https://supabase.co.evil.com/x.png", patterns) === false &&
  isAllowedRemote("not a url", patterns) === false;`,
            },
          ],
          hint: "Parse with `new URL(src)` inside `try/catch`. Write `hostMatches` and `pathMatches` helpers. For `*.`, strip the base and check that the remaining prefix is non-empty and has no dot.",
        },
        { type: "h", text: "next/font" },
        {
          type: "code",
          lang: "tsx",
          title: "app/layout.tsx",
          code: `import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],          // includes é, è, à, ç for French content
  variable: "--font-inter",    // exposed as a CSS variable for Tailwind
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}`,
        },
        {
          type: "p",
          text: "`next/font` downloads the font **at build time** and serves it from your own domain: no request to Google from the visitor's browser (faster, and better for privacy laws like Québec's Law 25), and it computes a size-adjusted fallback font so text doesn't jump when the web font arrives. With Tailwind v4, map it in CSS: `@theme inline { --font-sans: var(--font-inter); }`.",
        },
        { type: "h", text: "next/script" },
        {
          type: "code",
          lang: "tsx",
          title: "app/(marketing)/layout.tsx",
          code: `import Script from "next/script";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {\`window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag("js", new Date());
        gtag("config", "G-XXXXXXX");\`}
      </Script>
      <Script src="https://widget.example-chat.com/loader.js" strategy="lazyOnload" />
    </>
  );
}`,
        },
        {
          type: "table",
          rows: [
            ["strategy", "Loads", "Good for"],
            ["`beforeInteractive`", "Before the page hydrates (put it in the root layout)", "Consent managers, bot detection — rarely needed"],
            ["`afterInteractive` (default)", "Right after the page becomes interactive", "Analytics, tag managers, Meta Pixel"],
            ["`lazyOnload`", "When the browser is idle", "Chat widgets, social embeds"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Official wrappers",
          text: "For Google Tag Manager and Google Analytics, `@next/third-parties/google` provides `<GoogleTagManager gtmId=\"GTM-…\" />` and `<GoogleAnalytics gaId=\"G-…\" />`, which load them with good defaults.",
        },
        { type: "h", text: "Reading next build output" },
        {
          type: "code",
          lang: "text",
          title: "npm run build",
          code: `▲ Next.js 16.x (Turbopack)

  Creating an optimized production build ...
✓ Compiled successfully
  Running TypeScript ...
✓ Generating static pages (9/9)

Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /api/webhooks/shopify
├ ● /blog/[slug]
│ ├ /blog/launch-checklist
│ └ /blog/shopify-vs-woocommerce
├ ƒ /dashboard
└ ƒ /pricing

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand`,
        },
        {
          type: "p",
          text: "Read the symbols as a checklist: marketing and blog pages should be `○` or `●`; dashboards and webhooks are expected to be `ƒ`. With Cache Components enabled you'll also see `◐` (Partial Prerender: static shell + streamed parts). Next 16 no longer prints per-route JS sizes — use `next experimental-analyze` or your browser's network tab for bundle size.",
        },
        {
          type: "run",
          code: `const output = \`┌ ○ /
├ ○ /_not-found
├ ƒ /api/webhooks/shopify
├ ● /blog/[slug]
│ ├ /blog/launch-checklist
│ └ /blog/shopify-vs-woocommerce
├ ƒ /dashboard
└ ƒ /pricing\`;

const MEANING = { "○": "static", "●": "ssg", "ƒ": "dynamic", "◐": "partial" };
const shouldBeStatic = ["/", "/pricing", "/blog/[slug]"];

const routes = [];
for (const line of output.split("\\n")) {
  const m = line.match(/([○●ƒ◐])\\s+(\\S+)/);
  if (m) routes.push({ path: m[2], mode: MEANING[m[1]] });
}
console.table(routes);

for (const r of routes) {
  if (shouldBeStatic.includes(r.path) && r.mode === "dynamic") {
    console.log("⚠️ " + r.path + " is dynamic — look for cookies()/headers()/auth() in its page or layouts");
  }
}`,
        },
        { type: "h", text: "Deploying to Vercel" },
        {
          type: "steps",
          items: [
            { title: "Push to GitHub", text: "The project lives in a GitHub repo (see the Git track)." },
            { title: "Import in Vercel", text: "New Project → pick the repo. Vercel detects Next.js and uses `next build` automatically." },
            { title: "Set environment variables", text: "Add each variable for **Production**, **Preview** and **Development** as needed. Secrets never go in the repo." },
            { title: "Preview deployments", text: "Every push to a branch / every PR gets its own URL — send it to the client for approval." },
            { title: "Production", text: "Merging into `main` deploys to production and your custom domain. Rollbacks are one click." },
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Not on Vercel? Railway works too",
          text: "Next.js is a Node app: on Railway (or any Docker host) run `npm run build` then `npm run start`. Setting `output: \"standalone\"` in `next.config.ts` produces a minimal server folder that makes Docker images much smaller. Vercel adds a CDN, image optimization and preview URLs out of the box; on other hosts check how caching and images are handled.",
        },
        { type: "h", text: "Common build errors and what they mean" },
        {
          type: "table",
          rows: [
            ["Error (abridged)", "Cause", "Fix"],
            ["`Type error: …`", "`next build` type-checks; dev doesn't stop on type errors", "Fix the types — don't set `ignoreBuildErrors`"],
            ["`You're importing a component that needs useState…`", "A hook in a server component", "Add `\"use client\"` to that component (keep it small)"],
            ["`Functions cannot be passed directly to Client Components…`", "A server component passes an `onClick`-style function prop", "Move the handler into the client component, or use a Server Action"],
            ["`Module not found: Can't resolve 'fs'`", "Server-only code imported into a client component", "Keep it behind the server boundary; add `import \"server-only\"`"],
            ["`useSearchParams() should be wrapped in a suspense boundary`", "A client component reads search params on a static page", "Wrap that component in `<Suspense>`"],
            ["`Error occurred prerendering page \"/pricing\"`", "The page threw during build-time rendering (DB unreachable, env var missing)", "Read the stack trace; set env vars for the build, or make the page dynamic"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Build locally before you push",
          text: "`npm run dev` renders on demand and tolerates a lot; `npm run build` prerenders, type-checks and enforces boundaries. Running `npm run build` locally before opening a PR catches most deployment failures in seconds instead of minutes.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `next/image` need to avoid layout shift for a remote image?",
              options: ["`width` and `height` (or `fill` in a sized parent)", "`preload`", "`placeholder=\"blur\"`", "A `.webp` file"],
              answer: 0,
              why: "Knowing the dimensions (or using `fill` with a sized container) lets the browser reserve space before the image arrives.",
            },
            {
              q: "Your `/pricing` page shows `ƒ` in the build output, but it's the same for everyone. Most likely cause?",
              options: [
                "It uses `next/image`",
                "It's in a route group",
                "A layout above it reads cookies/headers, e.g. Clerk's `auth()` for the header avatar",
                "It uses `next/font`",
              ],
              answer: 2,
              why: "Request-time APIs anywhere in the route's layouts or page make the whole route dynamic. Move the user-specific part into a Suspense-wrapped component or a different layout.",
            },
            {
              q: "Why does `next/font` serve Google Fonts from your own domain?",
              options: [
                "Google requires it",
                "No extra connection to Google at runtime: faster, more private, and fallback metrics avoid layout shift",
                "To make fonts editable",
                "It doesn't — it links to fonts.googleapis.com",
              ],
              answer: 1,
              why: "Fonts are downloaded at build time and self-hosted, removing a third-party request and letting Next tune the fallback font to prevent jumps.",
            },
            {
              q: "You change `NEXT_PUBLIC_SITE_URL` in Vercel's dashboard. When does the browser code see the new value?",
              options: ["Immediately", "After the CDN cache expires", "After a hard refresh", "After the next deployment (build)"],
              answer: 3,
              why: "`NEXT_PUBLIC_` values are inlined into the bundle at build time, so only a new build picks them up.",
            },
          ],
        },
      ],
    },
  ],
};
