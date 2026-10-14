import type { Track } from "../types";

export const track: Track = {
  slug: "your-stack",
  order: 10,
  title: "Your Stack, End to End",
  tagline: "Tailwind, Supabase, Clerk, Vercel, Railway and Shopify, wired together",
  outcome:
    "Understand every tool around your code — styling, database, security, auth, hosting, workers and third-party APIs — and ship a real client app from empty repo to production launch.",
  badge: "STK",
  color: "#3ecf8e",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Tailwind CSS
    // ─────────────────────────────────────────────────────────────
    {
      slug: "tailwind-css",
      title: "Tailwind CSS",
      summary: "Utility-first styling: why it works, responsive and state variants, dark mode, Tailwind v4's CSS-first config, cn() and shadcn/ui.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Classic CSS asks you to invent a class name (`.lead-card`, `.lead-card__title--urgent`), switch to another file, write the styles, and hope nobody else's rule overrides yours. Six months later the stylesheet is 4,000 lines and nobody dares delete anything, because nobody knows what is still used.",
        },
        {
          type: "p",
          text: "**Tailwind** flips this: you compose small, single-purpose classes (`p-4`, `rounded-lg`, `text-sm`) directly in your markup. Each class does one thing. The build step scans your files and only ships the CSS for classes you actually used. Delete a component and its styles disappear with it.",
        },
        {
          type: "compare",
          left: {
            label: "Classic CSS",
            lang: "html",
            code: `<!-- LeadCard.html -->
<div class="lead-card">
  <h3 class="lead-card__title">Café Olimpico</h3>
  <span class="lead-card__badge">New</span>
</div>

<!-- styles.css (another file, another name to invent)
.lead-card { padding: 1rem; border-radius: .5rem;
  background: white; box-shadow: ... }
.lead-card__title { font-weight: 600; font-size: .875rem; }
.lead-card__badge { ... } -->`,
          },
          right: {
            label: "Tailwind",
            lang: "html",
            code: `<div class="rounded-lg bg-white p-4 shadow-sm">
  <h3 class="text-sm font-semibold">Café Olimpico</h3>
  <span class="rounded-full bg-emerald-100 px-2 py-0.5
               text-xs text-emerald-700">
    New
  </span>
</div>`,
          },
        },
        {
          type: "p",
          text: "The real win is not shorter code, it's **constraints**. `p-4` isn't any padding, it's step 4 of a spacing scale (`0.25rem × 4 = 1rem`). Colours come from a palette, font sizes from a type scale. A whole team ends up using the same 12 spacings instead of 87 slightly different pixel values.",
        },
        {
          type: "table",
          rows: [
            ["Class", "CSS it produces", "Note"],
            ["`p-4` / `px-2` / `mt-6`", "padding: 1rem / padding-inline: .5rem / margin-top: 1.5rem", "spacing scale: n × 0.25rem"],
            ["`text-sm` / `font-semibold`", "font-size: .875rem (+ line-height) / font-weight: 600", "type scale"],
            ["`bg-emerald-500` / `text-slate-700`", "background-color / color from the palette", "50 → 950 shades"],
            ["`flex items-center gap-3`", "display:flex; align-items:center; gap:.75rem", "layout in one line"],
            ["`w-full max-w-md`", "width:100%; max-width:28rem", "sizing"],
            ["`w-[37px]` / `bg-[#3ecf8e]`", "width:37px / that exact colour", "arbitrary values — escape hatch"],
          ],
        },
        { type: "h", text: "Responsive design: mobile-first prefixes" },
        {
          type: "p",
          text: "Prefix any class with a breakpoint to apply it **from that width and up**. Unprefixed classes apply everywhere, so you style for phones first, then layer on changes for bigger screens.",
        },
        {
          type: "table",
          rows: [
            ["Prefix", "Applies when the viewport is at least…"],
            ["(none)", "0 — every screen"],
            ["`sm:`", "40rem (640px)"],
            ["`md:`", "48rem (768px)"],
            ["`lg:`", "64rem (1024px)"],
            ["`xl:`", "80rem (1280px)"],
            ["`2xl:`", "96rem (1536px)"],
          ],
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/projects/page.tsx",
          code: `// 1 column on phones, 2 on tablets, 3 on laptops
<ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {projects.map((p) => (
    <li key={p.id} className="p-4 text-sm md:p-6 md:text-base">{p.title}</li>
  ))}
</ul>`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "sm: does not mean 'on small screens'",
          text: "`sm:hidden` hides the element from 640px **up**, so it stays visible on phones. To target phones only, use the unprefixed class and undo it later: `block md:hidden`. Tailwind v4 also has `max-md:` for 'below md'.",
        },
        { type: "h", text: "States: hover, focus, disabled, group" },
        {
          type: "p",
          text: "Variants work the same way for interaction states. Stack them freely: `md:hover:bg-emerald-600` means 'on hover, from md up'.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "components/BookButton.tsx",
          code: `<button
  disabled={isSaving}
  className="rounded-md bg-emerald-600 px-4 py-2 text-white
             hover:bg-emerald-700
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600
             disabled:cursor-not-allowed disabled:opacity-50"
>
  Book a call
</button>

// group-*: style a child based on the parent's state
<a href="/clients/42" className="group block rounded-lg p-4 hover:bg-slate-50">
  <span className="font-medium group-hover:underline">Boulangerie Ste-Anne</span>
</a>`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "focus-visible, not focus",
          text: "`focus-visible:` shows a ring for keyboard users but not after a mouse click. Never remove focus styles entirely: keyboard and screen-reader users need them (and some clients have accessibility requirements, e.g. Québec government projects).",
        },
        { type: "h", text: "Dark mode" },
        {
          type: "p",
          text: "Prefix with `dark:` to style the dark theme: `bg-white dark:bg-slate-900`. By default `dark:` follows the operating system (`prefers-color-scheme`). If the client wants a manual toggle, you switch the variant to a class on `<html>` (see the config below) and toggle that class with a little JS (libraries like `next-themes` do this for you).",
        },
        { type: "h", text: "Tailwind v4: configuration lives in CSS" },
        {
          type: "p",
          text: "Tailwind v4 (released in 2025, what `create-next-app` installs today) dropped the JavaScript config file. Everything is configured in your main CSS file. Source files are detected automatically, so there's no `content: [...]` array to maintain.",
        },
        {
          type: "code",
          lang: "css",
          title: "app/globals.css",
          code: `@import "tailwindcss";

/* Design tokens → generate utilities AND CSS variables */
@theme {
  --color-brand-50: oklch(0.97 0.03 160);
  --color-brand-500: oklch(0.72 0.17 160);   /* bg-brand-500, text-brand-500, border-brand-500… */
  --color-brand-700: oklch(0.52 0.14 160);
  --font-display: "Inter Tight", sans-serif; /* font-display */
  --breakpoint-3xl: 120rem;                  /* 3xl: variant */
}

/* Make dark: follow a .dark class instead of the OS setting */
@custom-variant dark (&:where(.dark, .dark *));

/* Your own utility, usable with variants: hover:scrollbar-none */
@utility scrollbar-none {
  scrollbar-width: none;
}`,
        },
        {
          type: "code",
          lang: "js",
          title: "postcss.config.mjs",
          code: `// Next.js uses PostCSS; Tailwind v4 ships its own plugin
export default {
  plugins: { "@tailwindcss/postcss": {} },
};`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "v3 vs v4 in client repos",
          text: "Older client projects use Tailwind v3: a `tailwind.config.js` with `content` and `theme.extend`, and `@tailwind base; @tailwind components; @tailwind utilities;` in the CSS. New projects use v4: `@import \"tailwindcss\"` and `@theme`. The official `npx @tailwindcss/upgrade` tool migrates most of a v3 project automatically.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Never build class names dynamically",
          text: "Tailwind finds classes by scanning your source files as plain text. `bg-${color}-500` never appears in full, so the CSS is never generated and the badge silently has no colour. Map values to **complete** class names instead (see the code below).",
        },
        {
          type: "run",
          title: "Map data to complete class names",
          code: `// ✅ Every full class name appears literally in the source, so Tailwind generates it
const statusClasses = {
  new: "bg-sky-100 text-sky-700",
  won: "bg-emerald-100 text-emerald-700",
  lost: "bg-rose-100 text-rose-700",
};

function badgeClass(status) {
  return "rounded-full px-2 py-0.5 text-xs " + (statusClasses[status] ?? "bg-slate-100 text-slate-600");
}

for (const status of ["new", "won", "lost", "archived"]) {
  console.log(status.padEnd(9), "→", badgeClass(status));
}`,
        },
        { type: "h", text: "Conditional classes: the cn() pattern" },
        {
          type: "p",
          text: "Components often need classes that depend on props: an `active` tab, a `disabled` button, a `className` passed by the parent. Gluing strings with `+` and ternaries gets messy fast. Almost every Next.js + Tailwind codebase has this tiny helper:",
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/utils.ts",
          code: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage in a component
<button
  className={cn(
    "rounded-md px-4 py-2",
    isActive && "bg-brand-500 text-white",
    { "opacity-50": disabled },
    className, // whatever the parent passed, e.g. "px-8"
  )}
/>`,
        },
        {
          type: "list",
          items: [
            "**clsx** handles the *conditions*: it keeps truthy strings, skips `false`/`null`/`undefined`, flattens arrays and includes object keys whose value is truthy.",
            "**tailwind-merge** handles *conflicts*: in `\"px-4 px-8\"` both classes exist in the CSS and the one defined *later in the stylesheet* wins — not the one later in the attribute. `twMerge` removes `px-4` so the parent's `px-8` reliably wins.",
          ],
        },
        {
          type: "run",
          title: "Why tailwind-merge is a real library",
          code: `// A naive merge: keep the last class of each "group" (text before the last dash)
function naiveMerge(classes) {
  const byGroup = new Map();
  for (const c of classes.split(" ").filter(Boolean)) {
    const group = c.includes("-") ? c.slice(0, c.lastIndexOf("-")) : c;
    byGroup.set(group, c);
  }
  return [...byGroup.values()].join(" ");
}

console.log(naiveMerge("px-4 py-2 px-8"));          // ✅ "px-8 py-2"
console.log(naiveMerge("text-sm text-lg"));          // ✅ "text-lg"
console.log(naiveMerge("bg-red-500 bg-emerald-600")); // ❌ keeps both: groups "bg-red" vs "bg-emerald"
console.log(naiveMerge("text-sm text-red-500"));     // happens to work, but by luck
// tailwind-merge knows Tailwind's real groups (colour vs size vs spacing…),
// which is why you install it instead of writing this yourself.`,
        },
        {
          type: "challenge",
          title: "Write your own cn() (the clsx half)",
          prompt:
            "Implement `cn(...inputs)` that returns one class string. Rules: keep non-empty strings; skip falsy values (`false`, `null`, `undefined`, `0`, `\"\"`); flatten arrays (even nested ones); for objects, include each key whose value is truthy. Separate classes with exactly one space and never leave leading/trailing spaces.",
          starter: `function cn(...inputs) {
  // TODO: handle falsy values, arrays and objects
  return inputs.join(" ");
}`,
          solution: `function cn(...inputs) {
  const out = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed) out.push(trimmed);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) out.push(inner);
    } else if (typeof input === "object") {
      for (const [name, on] of Object.entries(input)) {
        if (on) out.push(name);
      }
    }
  }
  return out.join(" ");
}`,
          tests: [
            { name: 'cn("px-4", "py-2") returns "px-4 py-2"', code: `return cn("px-4", "py-2") === "px-4 py-2";` },
            {
              name: "falsy values are skipped without double spaces",
              code: `return cn("btn", false, null, undefined, "", 0, "active") === "btn active";`,
            },
            {
              name: "object keys are included only when their value is truthy",
              code: `return cn("btn", { "bg-brand-500": true, "opacity-50": false, "font-bold": 1 }) === "btn bg-brand-500 font-bold";`,
            },
            { name: "nested arrays are flattened", code: `return cn(["rounded", ["p-4", false]], "shadow") === "rounded p-4 shadow";` },
            { name: "nothing truthy gives an empty string", code: `return cn() === "" && cn(false, null, [undefined]) === "";` },
          ],
          hint: "Loop over `inputs`; `continue` on falsy values; for arrays call `cn(...array)` recursively; for objects use `Object.entries` and push keys whose value is truthy. Finish with `join(\" \")`.",
        },
        { type: "h", text: "shadcn/ui: components you own" },
        {
          type: "p",
          text: "**shadcn/ui** is not an npm component library. It's a CLI that **copies** the source code of well-built components (Button, Dialog, Dropdown, Form…) into your repo, usually under `components/ui`. They're built on accessible headless primitives (Radix UI), styled with Tailwind, and use `cn()` plus variants. Because the code is yours, you can change anything for the client's brand.",
        },
        {
          type: "code",
          lang: "bash",
          code: `npx shadcn@latest init          # sets up components.json, CSS variables, lib/utils.ts (cn)
npx shadcn@latest add button dialog form`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/leads/page.tsx",
          code: `import { Button } from "@/components/ui/button";

<Button variant="outline" size="sm" className="gap-2">Export CSV</Button>`,
        },
        {
          type: "callout",
          tone: "stack",
          text: "In a shadcn project, the theme colours are CSS variables (`--primary`, `--background`…) wired into Tailwind with `@theme`. Rebranding for a new client is mostly editing those variables in `globals.css`, not touching every component.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `hidden md:block` do?",
              options: [
                "Visible on phones, hidden from 768px up",
                "Hidden on phones, visible from 768px up",
                "Hidden only between 640px and 768px",
                "Always hidden; md:block is ignored",
              ],
              answer: 1,
              why: "Unprefixed classes apply everywhere (hidden), and `md:` overrides from 48rem/768px **up** (block). Tailwind is mobile-first.",
            },
            {
              q: "In Tailwind v4, where do you add a brand colour so that `bg-brand-500` works?",
              options: [
                "`theme.extend.colors` in tailwind.config.js",
                "An inline `style` attribute",
                "A `--color-brand-500` variable inside `@theme` in your CSS",
              ],
              answer: 2,
              why: "v4 is CSS-first: variables in the `--color-*` namespace inside `@theme` generate the colour utilities. The JS config is the v3 way.",
            },
            {
              q: "Why does a class built at runtime, like `'bg-' + color + '-500'`, often render with no background?",
              options: [
                "Tailwind only generates classes it finds written in full in your source files",
                "Template literals are not allowed in className",
                "Colours must be hex values",
              ],
              answer: 0,
              why: "Tailwind scans files as text. A partial name built at runtime never matches, so its CSS is never generated. Use a map of complete class names.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Databases & SQL basics
    // ─────────────────────────────────────────────────────────────
    {
      slug: "sql-basics",
      title: "Databases & SQL basics",
      summary: "Tables, keys, SELECT/JOIN/GROUP BY, writes and indexes — modelled on clients, projects and invoices.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Arrays in memory vanish when the server restarts. A spreadsheet breaks when two people edit it at once and can't enforce 'every invoice belongs to a real client'. A **relational database** stores data on disk in tables with a fixed shape, enforces rules (constraints), lets many users read and write safely at the same time (transactions), and answers questions through one language: **SQL**.",
        },
        {
          type: "p",
          text: "Postgres is the database inside Supabase, so everything in this lesson is exactly what you'll type in the Supabase SQL editor.",
        },
        {
          type: "table",
          rows: [
            ["Term", "Meaning", "Agency example"],
            ["Table", "A collection of one kind of thing", "`clients`, `projects`, `invoices`"],
            ["Row", "One record", "the client 'Boulangerie Ste-Anne'"],
            ["Column", "One typed field present on every row", "`email text`, `amount_cents integer`"],
            ["Primary key (PK)", "Column that uniquely identifies a row", "`id uuid`"],
            ["Foreign key (FK)", "Column that points at another table's PK", "`projects.client_id → clients.id`"],
            ["Index", "A lookup structure that makes searches fast", "index on `invoices.status`"],
          ],
        },
        { type: "h", text: "Modelling clients → projects → invoices" },
        {
          type: "p",
          text: "One client has many projects; one project has many invoices. You never copy the client's name into each invoice: you store a **foreign key** and *join* when you need the name. Change the client's name once, and every invoice shows the new name.",
        },
        {
          type: "code",
          lang: "sql",
          title: "supabase/migrations/20261001120000_billing.sql",
          code: `create table clients (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text unique,
  created_at timestamptz not null default now()
);

create table projects (
  id         uuid primary key default gen_random_uuid(),
  client_id  uuid not null references clients(id) on delete cascade,
  title      text not null,
  status     text not null default 'active' check (status in ('active', 'paused', 'done'))
);

create table invoices (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete restrict,
  amount_cents integer not null check (amount_cents >= 0),
  status       text not null default 'draft' check (status in ('draft', 'sent', 'paid')),
  issued_on    date not null default current_date
);`,
        },
        {
          type: "list",
          items: [
            "`references clients(id)` is the foreign key: Postgres refuses a project whose `client_id` doesn't exist.",
            "`on delete cascade`: deleting a client deletes their projects. `on delete restrict`: you can't delete a project that still has invoices — a deliberate safety net for accounting data.",
            "`check (...)` constraints reject bad data at the source, whatever app or script writes it.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Money is never a float",
          text: "`0.1 + 0.2 === 0.30000000000000004` in JavaScript. Store money as integer cents (`amount_cents integer`) or Postgres `numeric(12,2)`, and format for display at the very end.",
        },
        { type: "h", text: "Reading: SELECT, WHERE, ORDER BY, LIMIT" },
        {
          type: "code",
          lang: "sql",
          code: `-- The 10 most recent unpaid invoices over $1,000
select id, amount_cents, status, issued_on
from invoices
where status <> 'paid' and amount_cents > 100000
order by issued_on desc
limit 10;

-- Clients whose name contains "café", case-insensitive
select name, email from clients where name ilike '%café%';`,
        },
        { type: "h", text: "JOIN: putting tables back together" },
        {
          type: "p",
          text: "A **JOIN** matches rows from two tables using a condition, almost always 'this FK equals that PK'. `inner join` keeps only rows that have a match on both sides. `left join` keeps every row of the left table, filling the right side with `null` when there's no match — essential for questions like 'every client, even those with no invoices'.",
        },
        {
          type: "code",
          lang: "sql",
          code: `-- Each invoice with its project title and client name
select c.name as client, p.title as project, i.amount_cents, i.status
from invoices i
join projects p on p.id = i.project_id
join clients  c on c.id = p.client_id;

-- Paid revenue per client, including clients who never paid (left join + coalesce)
select c.name, coalesce(sum(i.amount_cents), 0) as paid_cents
from clients c
left join projects p on p.client_id = c.id
left join invoices i on i.project_id = p.id and i.status = 'paid'
group by c.id, c.name
order by paid_cents desc;`,
        },
        {
          type: "p",
          text: "`group by` collapses rows into one row per group; aggregate functions (`sum`, `count`, `avg`, `max`) compute a value per group. To understand what the database does, here is the same idea over plain arrays:",
        },
        {
          type: "run",
          title: "JOIN and GROUP BY, by hand",
          code: `const clients = [
  { id: "c1", name: "Boulangerie Ste-Anne" },
  { id: "c2", name: "Café Olimpico" },
  { id: "c3", name: "Studio Nord" },
];
const projects = [
  { id: "p1", client_id: "c1", title: "Online ordering" },
  { id: "p2", client_id: "c1", title: "Loyalty app" },
  { id: "p3", client_id: "c2", title: "Shopify theme" },
];
const invoices = [
  { id: "i1", project_id: "p1", amount_cents: 450000, status: "paid" },
  { id: "i2", project_id: "p1", amount_cents: 120000, status: "sent" },
  { id: "i3", project_id: "p2", amount_cents: 300000, status: "paid" },
  { id: "i4", project_id: "p3", amount_cents: 800000, status: "paid" },
];

// select ... from invoices i join projects p on p.id = i.project_id join clients c on c.id = p.client_id
// A hash join: build a Map on one side, probe it with the other (what Postgres often does)
const projectById = new Map(projects.map((p) => [p.id, p]));
const clientById = new Map(clients.map((c) => [c.id, c]));
const joined = invoices.map((i) => {
  const p = projectById.get(i.project_id);
  const c = clientById.get(p.client_id);
  return { client: c.name, project: p.title, amount_cents: i.amount_cents, status: i.status };
});
console.table(joined);

// select client, sum(amount_cents) ... where status = 'paid' group by client
const totals = new Map();
for (const row of joined) {
  if (row.status !== "paid") continue;
  totals.set(row.client, (totals.get(row.client) ?? 0) + row.amount_cents);
}
console.log(Object.fromEntries(totals));
// Notice "Studio Nord" is missing: that's inner-join behaviour. A LEFT JOIN would keep it with 0.`,
        },
        { type: "h", text: "Writing: INSERT, UPDATE, DELETE" },
        {
          type: "code",
          lang: "sql",
          code: `insert into clients (name, email)
values ('Studio Nord', 'bonjour@studionord.ca')
returning id;                       -- Postgres can hand back the generated id

update invoices
set status = 'paid'
where id = 'b6c1e7a2-...';          -- ALWAYS a where clause

delete from projects where status = 'done' and client_id = '...';`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "UPDATE without WHERE updates every row",
          text: "`update invoices set status = 'paid';` marks *every* invoice of *every* client as paid. Write the `where` first, run it as a `select` to see which rows match, then turn it into the `update`. On production data, wrap risky changes in `begin; ... rollback;` to rehearse.",
        },
        { type: "h", text: "Indexes: why some queries are instant and others crawl" },
        {
          type: "p",
          text: "Without an index, `where client_id = '...'` makes Postgres read **every row** (a sequential scan). An index is a sorted structure (a B-tree) that jumps straight to matching rows, like the index at the back of a book. Primary keys and `unique` columns get an index automatically. **Foreign keys don't** in Postgres — add one yourself for columns you filter or join on.",
        },
        {
          type: "code",
          lang: "sql",
          code: `create index projects_client_id_idx on projects (client_id);
create index invoices_project_status_idx on invoices (project_id, status);

-- Ask Postgres how it will run a query
explain analyze select * from projects where client_id = '...';`,
        },
        {
          type: "run",
          title: "Scan vs index, felt",
          code: `const rows = Array.from({ length: 200000 }, (_, n) => ({ id: "inv_" + n, client_id: "c" + (n % 5000) }));

let t = performance.now();
let scanned = 0;
for (let k = 0; k < 200; k++) scanned += rows.filter((r) => r.client_id === "c" + k).length;
console.log("200 lookups with a full scan:", Math.round(performance.now() - t), "ms");

t = performance.now();
const index = new Map(); // client_id → rows (built once, like CREATE INDEX)
for (const r of rows) {
  if (!index.has(r.client_id)) index.set(r.client_id, []);
  index.get(r.client_id).push(r);
}
let found = 0;
for (let k = 0; k < 200; k++) found += index.get("c" + k).length;
console.log("build index + 200 lookups:", Math.round(performance.now() - t), "ms", scanned === found);
// Indexes cost space and slow down writes a little: add them for real query patterns, not everywhere.`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Supabase is Postgres",
          text: "Everything here runs as-is in Supabase's SQL editor and migrations. supabase-js even turns foreign keys into joins for you: `.from('projects').select('title, clients(name)')` follows `projects.client_id → clients.id`.",
        },
        {
          type: "challenge",
          title: "Revenue per client (a LEFT JOIN + GROUP BY)",
          prompt:
            "Implement `revenueByClient(clients, invoices)`. Each invoice has `client_id`, `amount_cents` and `status`. Return one object `{ name, paidCents }` **per client** (including clients with no paid invoices, at `0`), summing only invoices with status `\"paid\"`. Sort by `paidCents` descending, then by `name` ascending for ties.",
          starter: `function revenueByClient(clients, invoices) {
  // This is an INNER join: clients without invoices disappear, and unpaid invoices count.
  const totals = {};
  for (const inv of invoices) {
    const client = clients.find((c) => c.id === inv.client_id);
    totals[client.name] = (totals[client.name] ?? 0) + inv.amount_cents;
  }
  return Object.entries(totals).map(([name, paidCents]) => ({ name, paidCents }));
}`,
          solution: `function revenueByClient(clients, invoices) {
  const paid = new Map();
  for (const inv of invoices) {
    if (inv.status !== "paid") continue;
    paid.set(inv.client_id, (paid.get(inv.client_id) ?? 0) + inv.amount_cents);
  }
  return clients
    .map((c) => ({ name: c.name, paidCents: paid.get(c.id) ?? 0 }))
    .sort((a, b) => b.paidCents - a.paidCents || a.name.localeCompare(b.name));
}`,
          tests: [
            {
              name: "sums only paid invoices per client",
              code: `const r = revenueByClient(
  [{ id: "c1", name: "Café Olimpico" }],
  [
    { client_id: "c1", amount_cents: 1000, status: "paid" },
    { client_id: "c1", amount_cents: 500, status: "paid" },
    { client_id: "c1", amount_cents: 9999, status: "sent" },
  ],
);
return r.length === 1 && r[0].name === "Café Olimpico" && r[0].paidCents === 1500;`,
            },
            {
              name: "clients with no paid invoices are kept with 0 (LEFT JOIN)",
              code: `const r = revenueByClient(
  [{ id: "c1", name: "A" }, { id: "c2", name: "Studio Nord" }],
  [{ client_id: "c1", amount_cents: 200, status: "paid" }, { client_id: "c2", amount_cents: 300, status: "draft" }],
);
const nord = r.find((x) => x.name === "Studio Nord");
return r.length === 2 && nord && nord.paidCents === 0;`,
            },
            {
              name: "sorted by paidCents desc, then name asc",
              code: `const r = revenueByClient(
  [{ id: "a", name: "Zeta" }, { id: "b", name: "Alpha" }, { id: "c", name: "Mid" }],
  [{ client_id: "c", amount_cents: 50, status: "paid" }, { client_id: "a", amount_cents: 10, status: "paid" }, { client_id: "b", amount_cents: 10, status: "paid" }],
);
return r.map((x) => x.name).join(",") === "Mid,Alpha,Zeta";`,
            },
            { name: "no clients gives an empty array", code: `const r = revenueByClient([], []); return Array.isArray(r) && r.length === 0;` },
          ],
          hint: "Start from `clients` (that's what makes it a LEFT join), not from `invoices`. Pre-sum paid invoices into a `Map` keyed by `client_id`, then `map` each client to `{ name, paidCents: totals.get(id) ?? 0 }` and sort with `b.paidCents - a.paidCents || a.name.localeCompare(b.name)`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You need 'every client and their number of projects, including clients with none'. Which join?",
              options: ["inner join", "left join from clients to projects", "no join, two separate queries is required"],
              answer: 1,
              why: "A left join keeps every row of the left table (clients) even when no project matches; `count(p.id)` then gives 0 for them.",
            },
            {
              q: "Which column does Postgres NOT index automatically?",
              options: ["The primary key", "A column declared `unique`", "A foreign key column like `projects.client_id`"],
              answer: 2,
              why: "PKs and unique constraints create indexes. Foreign keys only add a constraint, so you usually add `create index` on them yourself.",
            },
            {
              q: "What is the safest way to store an invoice amount?",
              options: ["`amount_cents integer` (or `numeric`)", "`amount real` (floating point)", "`amount text` like '1 200,00 $'"],
              answer: 0,
              why: "Floats can't represent most decimal amounts exactly. Integer cents (or exact `numeric`) keep accounting correct; format for display at the end.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Supabase
    // ─────────────────────────────────────────────────────────────
    {
      slug: "supabase",
      title: "Supabase",
      summary: "Postgres plus auth, storage, realtime, edge functions and an auto-generated API — and how to use it properly from Next.js.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Every client app needs the same backend chores: a database, user accounts, file uploads, maybe live updates, and an API in front of all that. **Supabase** gives you a real Postgres database and builds those services around it, so instead of writing a CRUD API by hand you design tables and security rules, and the API exists automatically.",
        },
        {
          type: "table",
          rows: [
            ["Piece", "What it is", "Typical use"],
            ["Database", "A full Postgres instance", "leads, bookings, invoices"],
            ["Data API", "REST API generated from your schema (PostgREST)", "`supabase.from('leads').select()`"],
            ["Auth", "Users, sessions, OAuth, magic links (optional if you use Clerk)", "sign-in for a client portal"],
            ["Storage", "File buckets with access rules", "PDF quotes, product photos"],
            ["Realtime", "Subscribe to database changes over websockets", "live order board"],
            ["Edge Functions", "Server-side TypeScript functions (Deno runtime)", "webhook receivers, small jobs"],
          ],
        },
        { type: "h", text: "Keys: one public, one very secret" },
        {
          type: "table",
          rows: [
            ["Key", "Old name", "Where it may live", "What it can do"],
            ["Publishable key `sb_publishable_…`", "anon key", "Browser, mobile app, public env vars", "Only what Row Level Security policies allow"],
            ["Secret key `sb_secret_…`", "service_role key", "Server only (route handlers, workers)", "Everything — bypasses RLS"],
          ],
        },
        {
          type: "p",
          text: "Newer projects show publishable/secret keys; older projects (and lots of tutorials) use the legacy `anon` and `service_role` JWT keys. They play the same roles. The next lesson explains why a public key is safe *only* because of Row Level Security.",
        },
        { type: "h", text: "The supabase-js client" },
        {
          type: "code",
          lang: "ts",
          title: "querying with supabase-js",
          code: `import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

// SELECT id, name, status FROM leads WHERE status = 'open' ORDER BY created_at DESC LIMIT 20
const { data: leads, error } = await supabase
  .from("leads")
  .select("id, name, status")
  .eq("status", "open")
  .order("created_at", { ascending: false })
  .limit(20);

// One row (error if 0 or >1 rows match)
const { data: lead } = await supabase.from("leads").select("*").eq("id", leadId).single();

// Join through a foreign key: each project comes with its client
const { data: projects } = await supabase.from("projects").select("id, title, clients ( name, email )");

// Writes — add .select() to get the inserted/updated rows back
const { data: created, error: insertError } = await supabase
  .from("leads")
  .insert({ name: "Studio Nord", email: "bonjour@studionord.ca", source: "google-ads" })
  .select()
  .single();

await supabase.from("leads").update({ status: "won" }).eq("id", leadId);
await supabase.from("leads").delete().eq("id", leadId);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Queries don't throw: check error",
          text: "supabase-js resolves to `{ data, error }` instead of throwing. A permission problem, a typo in a column name or a violated constraint all come back as `error` with `data: null`. If you only destructure `data`, the bug looks like 'the list is empty'. Always check `error` (and decide: throw, show a message, or log).",
        },
        {
          type: "p",
          text: "How does a chain of method calls become a query you can `await`? Each method records something and returns the same builder; the builder has a `then` method, so `await` triggers the actual request. Here's a toy version over an array:",
        },
        {
          type: "run",
          title: "A tiny thenable query builder",
          code: `const db = {
  leads: [
    { id: 1, name: "Café Olimpico", status: "open", created_at: "2026-09-02" },
    { id: 2, name: "Studio Nord", status: "won", created_at: "2026-09-10" },
    { id: 3, name: "Boulangerie Ste-Anne", status: "open", created_at: "2026-09-21" },
  ],
};

function from(table) {
  const filters = [];
  let columns = "*";
  let sort = null;
  const builder = {
    select(cols = "*") { columns = cols; return builder; },
    eq(col, value) { filters.push((row) => row[col] === value); return builder; },
    order(col, { ascending = true } = {}) { sort = { col, ascending }; return builder; },
    // Having then() makes the builder "thenable": await calls it.
    then(resolve) {
      const rows = db[table];
      if (!rows) return resolve({ data: null, error: { message: 'relation "' + table + '" does not exist' } });
      let result = rows.filter((row) => filters.every((f) => f(row)));
      if (sort) {
        result = [...result].sort((a, b) => (a[sort.col] < b[sort.col] ? -1 : 1) * (sort.ascending ? 1 : -1));
      }
      if (columns !== "*") {
        const keep = columns.split(",").map((c) => c.trim());
        result = result.map((row) => Object.fromEntries(keep.map((k) => [k, row[k]])));
      }
      resolve({ data: result, error: null });
    },
  };
  return builder;
}

const { data, error } = await from("leads").select("id, name").eq("status", "open").order("created_at", { ascending: false });
console.log(error, data);

const oops = await from("lead").select();   // typo in the table name
console.log(oops); // no exception, just { data: null, error: {...} }`,
        },
        {
          type: "challenge",
          title: "Load open leads, the right way",
          prompt:
            "Write `async function loadOpenLeads(supabase)` using the supabase-js API. It must query the `leads` table for `\"id, name, status\"`, keep only rows where `status` equals `\"open\"`, order by `created_at` newest first (`{ ascending: false }`), and **return the rows** (`data`). If the result has an `error`, throw a new `Error` with the error's `message`. The tests pass in a fake client that records your calls.",
          starter: `async function loadOpenLeads(supabase) {
  const result = await supabase.from("leads").select("id, name, status");
  return result; // TODO: filter, order, handle the error, return only the rows
}`,
          solution: `async function loadOpenLeads(supabase) {
  const { data, error } = await supabase
    .from("leads")
    .select("id, name, status")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}`,
          tests: [
            {
              name: "returns the rows (data), not the { data, error } wrapper",
              code: `const calls = [];
const b = { select: (...a) => (calls.push(["select", ...a]), b), eq: (...a) => (calls.push(["eq", ...a]), b), order: (...a) => (calls.push(["order", ...a]), b), then: (res) => res({ data: [{ id: 7, name: "Studio Nord", status: "open" }], error: null }) };
const rows = await loadOpenLeads({ from: (t) => (calls.push(["from", t]), b) });
return Array.isArray(rows) && rows[0].id === 7;`,
            },
            {
              name: 'queries the "leads" table filtered on status = "open"',
              code: `const calls = [];
const b = { select: (...a) => (calls.push(["select", ...a]), b), eq: (...a) => (calls.push(["eq", ...a]), b), order: (...a) => (calls.push(["order", ...a]), b), then: (res) => res({ data: [], error: null }) };
await loadOpenLeads({ from: (t) => (calls.push(["from", t]), b) });
return calls.some((c) => c[0] === "from" && c[1] === "leads") && calls.some((c) => c[0] === "eq" && c[1] === "status" && c[2] === "open");`,
            },
            {
              name: "orders by created_at, newest first",
              code: `const calls = [];
const b = { select: (...a) => (calls.push(["select", ...a]), b), eq: (...a) => (calls.push(["eq", ...a]), b), order: (...a) => (calls.push(["order", ...a]), b), then: (res) => res({ data: [], error: null }) };
await loadOpenLeads({ from: (t) => (calls.push(["from", t]), b) });
const o = calls.find((c) => c[0] === "order");
return !!o && o[1] === "created_at" && o[2] && o[2].ascending === false;`,
            },
            {
              name: "throws an Error carrying the Supabase message when error is set",
              code: `const b = { select: () => b, eq: () => b, order: () => b, then: (res) => res({ data: null, error: { message: "permission denied for table leads" } }) };
try {
  await loadOpenLeads({ from: () => b });
  return false;
} catch (e) {
  return e instanceof Error && e.message.includes("permission denied");
}`,
            },
          ],
          hint: "Destructure `const { data, error } = await supabase.from(\"leads\").select(...).eq(...).order(...)`; then `if (error) throw new Error(error.message);` and `return data;`.",
        },
        { type: "h", text: "Supabase in Next.js: browser vs server clients" },
        {
          type: "p",
          text: "In the App Router, code runs in two places: the browser (Client Components) and the server (Server Components, Server Actions, Route Handlers, proxy/middleware). The user's session lives in **cookies**, and each place reads cookies differently. The `@supabase/ssr` package gives you one helper for each.",
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/supabase/client.ts",
          code: `"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/supabase/server.ts",
          code: `import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";

export async function createClient() {
  const cookieStore = await cookies(); // async since Next.js 15

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component (read-only cookies): the proxy/middleware refreshes the session instead.
          }
        },
      },
    },
  );
}`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/leads/page.tsx (Server Component)",
          code: `import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads, error } = await supabase.from("leads").select("id, name, status");
  if (error) throw error; // shows the nearest error.tsx

  return <ul>{leads.map((l) => <li key={l.id}>{l.name}</li>)}</ul>;
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "On the server, verify the user — don't just read the cookie",
          text: "If you use Supabase Auth, protect server code with `supabase.auth.getUser()` (asks the Auth server) or `supabase.auth.getClaims()` (verifies the JWT signature). `getSession()` just reads the cookie, which a user can tamper with, so never trust it for authorization on the server.",
        },
        { type: "h", text: "Generated types: let the schema type your code" },
        {
          type: "code",
          lang: "bash",
          code: `# from the live project
npx supabase gen types typescript --project-id abcdefghijklmnop > lib/database.types.ts
# or from your local stack
npx supabase gen types typescript --local > lib/database.types.ts`,
        },
        {
          type: "code",
          lang: "ts",
          code: `import type { Database, Tables } from "@/lib/database.types";

type Lead = Tables<"leads">;                      // { id: string; name: string; status: string; ... }
const supabase = createClient<Database>(url, key);

const { data } = await supabase.from("leads").select("id, name");
// data: { id: string; name: string }[] | null — inferred from the select string!
await supabase.from("leads").insert({ nme: "typo" });
// ❌ Object literal may only specify known properties, and 'nme' does not exist...`,
        },
        { type: "h", text: "Migrations: schema changes as code" },
        {
          type: "p",
          text: "Clicking around the dashboard is fine for exploring, but a real project needs its schema in Git: every table, index and policy as a timestamped SQL file. Then the dev, staging and production databases can be rebuilt identically, and code review covers the database too.",
        },
        {
          type: "steps",
          items: [
            { title: "supabase init", text: "Creates the `supabase/` folder (config + `migrations/`) in your repo." },
            { title: "supabase start", text: "Runs the whole stack locally in Docker: Postgres, Auth, Storage, Studio." },
            { title: "supabase migration new add_leads", text: "Creates `supabase/migrations/<timestamp>_add_leads.sql`. Write your `create table`, indexes and RLS policies there." },
            { title: "supabase db reset", text: "Rebuilds the local database from all migrations (+ `seed.sql`). If it works from scratch, it will work on prod." },
            { title: "supabase link + supabase db push", text: "Links the remote project and applies migrations it hasn't run yet. Many teams run this from CI on merge to `main`." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          text: "Changed something in the dashboard anyway? `supabase db diff -f my_change` generates a migration from the difference so Git stays the source of truth.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`const { data } = await supabase.from('leads').select()` returns `data: null`. What should you check first?",
              options: ["Whether supabase-js threw an exception", "The `error` field of the result", "The browser's network cache"],
              answer: 1,
              why: "supabase-js doesn't throw on query failures; it returns `{ data: null, error }`. The error message (RLS, missing column, bad filter) tells you what went wrong.",
            },
            {
              q: "Which helper do you use inside a Server Component to query Supabase as the signed-in user?",
              options: [
                "`createBrowserClient` from @supabase/ssr",
                "`createClient` with the secret key",
                "`createServerClient` from @supabase/ssr, wired to Next's `cookies()`",
              ],
              answer: 2,
              why: "The server client reads the session from cookies so queries run as that user (and RLS applies). The secret key would bypass RLS entirely.",
            },
            {
              q: "Why keep schema changes in `supabase/migrations` instead of only clicking in the dashboard?",
              options: [
                "So every environment can be rebuilt identically and changes are code-reviewed",
                "The dashboard can't create tables",
                "Migrations make queries faster",
              ],
              answer: 0,
              why: "Migrations are the history of your schema in Git: reproducible, reviewable, and appliable to dev, staging and prod in the same order.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Row Level Security
    // ─────────────────────────────────────────────────────────────
    {
      slug: "row-level-security",
      title: "Row Level Security",
      summary: "Why the public key is safe only with RLS, how policies with auth.uid() work, and why the secret key must never reach the browser.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Open any Supabase-powered site, open DevTools → Network, and you'll see the project URL and the publishable (anon) key in plain sight. That's by design: the browser needs them to call the Data API. Which raises the scary question: what stops a curious visitor from doing this?",
        },
        {
          type: "code",
          lang: "bash",
          code: `curl "https://abcdefghijklmnop.supabase.co/rest/v1/invoices?select=*" \\
  -H "apikey: sb_publishable_xxx"
# Without RLS: every invoice of every client. With RLS: only what a policy allows (here: nothing).`,
        },
        {
          type: "p",
          text: "The answer is **Row Level Security (RLS)**, a Postgres feature. Once enabled on a table, every query against it gets an invisible extra `WHERE` built from your **policies**. No policy matching? No rows. The key only identifies the *project*; the policies decide what each *user* can see. RLS is your real security boundary, not your React code.",
        },
        {
          type: "code",
          lang: "sql",
          title: "supabase/migrations/20261002090000_leads_rls.sql",
          code: `alter table leads enable row level security;   -- from now on: deny by default

-- Read: users see their own leads
create policy "Owners can read their leads"
on leads for select
to authenticated
using ( (select auth.uid()) = owner_id );

-- Insert: you can only create leads that belong to you
create policy "Owners can create leads"
on leads for insert
to authenticated
with check ( (select auth.uid()) = owner_id );

-- Update: must own the row before AND after the change
create policy "Owners can update their leads"
on leads for update
to authenticated
using ( (select auth.uid()) = owner_id )
with check ( (select auth.uid()) = owner_id );`,
        },
        {
          type: "table",
          rows: [
            ["Clause", "Checked against", "Used by", "Question it answers"],
            ["`using (...)`", "existing rows", "select, update, delete", "Which rows can you see / touch?"],
            ["`with check (...)`", "the new row values", "insert, update", "Is the row you're writing allowed?"],
          ],
        },
        {
          type: "list",
          items: [
            "`auth.uid()` returns the user id from the request's JWT (or `null` for anonymous requests). `auth.jwt()` returns all its claims.",
            "`to authenticated` / `to anon` restrict a policy to signed-in or anonymous requests. These are Postgres roles Supabase picks based on the token.",
            "Wrapping it as `(select auth.uid())` lets Postgres compute it once per query instead of once per row — a recommended performance habit.",
            "Policies are OR-ed: a row is visible if **any** select policy allows it.",
          ],
        },
        { type: "h", text: "Agency reality: multi-tenant data" },
        {
          type: "p",
          text: "In a client portal, users belong to an organization (the client company) and should see their org's data, never another client's. Model membership in a table and check it in the policy:",
        },
        {
          type: "code",
          lang: "sql",
          code: `create table memberships (
  org_id  uuid not null references orgs(id) on delete cascade,
  user_id uuid not null,
  role    text not null default 'member' check (role in ('member', 'admin')),
  primary key (org_id, user_id)
);

create policy "Members read their org's projects"
on projects for select
to authenticated
using (
  exists (
    select 1 from memberships m
    where m.org_id = projects.org_id
      and m.user_id = (select auth.uid())
  )
);`,
        },
        {
          type: "run",
          title: "RLS is an automatic WHERE clause",
          code: `const invoices = [
  { id: "i1", org_id: "boulangerie", owner_id: "u_marie", amount_cents: 450000 },
  { id: "i2", org_id: "boulangerie", owner_id: "u_luc", amount_cents: 120000 },
  { id: "i3", org_id: "studio-nord", owner_id: "u_sam", amount_cents: 800000 },
];
const memberships = [
  { org_id: "boulangerie", user_id: "u_marie" },
  { org_id: "boulangerie", user_id: "u_luc" },
  { org_id: "studio-nord", user_id: "u_sam" },
];

// The policy: "members can read their org's invoices"
const policy = (uid, row) => uid !== null && memberships.some((m) => m.org_id === row.org_id && m.user_id === uid);

// What Postgres effectively does with: select * from invoices;
function query(uid, { bypassRls = false } = {}) {
  return bypassRls ? invoices : invoices.filter((row) => policy(uid, row));
}

console.log("anon        →", query(null).map((r) => r.id));
console.log("u_marie     →", query("u_marie").map((r) => r.id));
console.log("u_sam       →", query("u_sam").map((r) => r.id));
console.log("secret key  →", query(null, { bypassRls: true }).map((r) => r.id), "⚠️ sees everything");`,
        },
        {
          type: "challenge",
          title: "Simulate a set of policies",
          prompt:
            "Implement `canRead(user, row)` and `visibleRows(user, rows)`. `user` is either `null` (anonymous) or `{ id, orgId, role }`. A row has `owner_id`, `org_id` and `is_public`. Rules (any one is enough, like OR-ed policies): (1) anyone, including anonymous, can read rows with `is_public === true`; (2) a signed-in user can read rows they own (`owner_id === user.id`); (3) a signed-in user with `role === \"admin\"` can read every row of **their own** org. Everything else is denied. `visibleRows` returns the rows `canRead` allows, in their original order.",
          starter: `function canRead(user, row) {
  // TODO: anonymous users, public rows, owners, org admins
  return row.org_id === user.orgId;
}

function visibleRows(user, rows) {
  return rows;
}`,
          solution: `function canRead(user, row) {
  if (row.is_public === true) return true;
  if (!user) return false;
  if (row.owner_id === user.id) return true;
  if (user.role === "admin" && row.org_id === user.orgId) return true;
  return false;
}

function visibleRows(user, rows) {
  return rows.filter((row) => canRead(user, row));
}`,
          tests: [
            {
              name: "anonymous users see public rows only (and don't crash)",
              code: `return canRead(null, { owner_id: "u1", org_id: "o1", is_public: true }) === true
  && canRead(null, { owner_id: "u1", org_id: "o1", is_public: false }) === false;`,
            },
            {
              name: "owners can read their own private rows",
              code: `return canRead({ id: "u1", orgId: "o1", role: "member" }, { owner_id: "u1", org_id: "o1", is_public: false }) === true;`,
            },
            {
              name: "members cannot read a colleague's private row",
              code: `return canRead({ id: "u2", orgId: "o1", role: "member" }, { owner_id: "u1", org_id: "o1", is_public: false }) === false;`,
            },
            {
              name: "admins read their own org, never another org",
              code: `const admin = { id: "u9", orgId: "o1", role: "admin" };
return canRead(admin, { owner_id: "u1", org_id: "o1", is_public: false }) === true
  && canRead(admin, { owner_id: "u5", org_id: "o2", is_public: false }) === false;`,
            },
            {
              name: "visibleRows filters like an automatic WHERE",
              code: `const rows = [
  { id: 1, owner_id: "u1", org_id: "o1", is_public: false },
  { id: 2, owner_id: "u2", org_id: "o1", is_public: false },
  { id: 3, owner_id: "u3", org_id: "o2", is_public: true },
];
const ids = visibleRows({ id: "u1", orgId: "o1", role: "member" }, rows).map((r) => r.id).join(",");
return ids === "1,3" && visibleRows(null, rows).length === 1;`,
            },
          ],
          hint: "Check the public rule first, then return `false` early when `user` is `null` (so you never read `user.id` on null). Then the owner rule, then `role === \"admin\" && row.org_id === user.orgId`.",
        },
        { type: "h", text: "The secret key: the master key to every row" },
        {
          type: "p",
          text: "Requests made with the secret (service_role) key run as a role that **bypasses RLS completely**. That's exactly what you want in trusted server code — a Stripe or Shopify webhook writing an order, a Railway worker syncing inventory, an admin script — and exactly what you must never ship to a browser.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Never NEXT_PUBLIC_ a secret",
          text: "Any env var starting with `NEXT_PUBLIC_` is copied into the JavaScript bundle that every visitor downloads. `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is a full data breach. Keep it as `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`), use it only in server files, and add `import \"server-only\";` at the top of the module that creates the admin client so an accidental client import fails the build.",
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/supabase/admin.ts",
          code: `import "server-only";
import { createClient } from "@supabase/supabase-js";

// Bypasses RLS. Only for webhooks, cron jobs and admin tasks — never for user-facing reads.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!,
  { auth: { persistSession: false } },
);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "RLS is not on by default everywhere",
          text: "Tables created in the dashboard's Table Editor get RLS enabled, but `create table` in a SQL migration does **not**: add `alter table ... enable row level security;` in the same migration, every time. Supabase's Security Advisor (Database → Advisors) flags public tables without RLS — check it before every launch.",
        },
        {
          type: "callout",
          tone: "tip",
          text: "Test policies as a real user: the SQL editor lets you run a query while impersonating a role or a specific user, and in automated tests you can query with a real user's session and assert that another org's rows don't come back.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "RLS is enabled on `invoices` but no policies exist. What does a signed-in user's `select * from invoices` return through the Data API?",
              options: ["All rows", "Only rows they created", "An empty result"],
              answer: 2,
              why: "Enabling RLS means deny by default. Without a policy granting access, no rows are visible to anon or authenticated users.",
            },
            {
              q: "Which clause stops a user from inserting a lead with someone else's `owner_id`?",
              options: ["`with check ( (select auth.uid()) = owner_id )`", "`using ( (select auth.uid()) = owner_id )`", "A `unique` constraint on `owner_id`"],
              answer: 0,
              why: "`with check` validates the new row values on insert/update. `using` filters which existing rows are visible or targetable.",
            },
            {
              q: "Where is it acceptable to use the Supabase secret / service_role key?",
              options: [
                "In a Client Component, as long as the code is minified",
                "In a Route Handler that receives a verified Shopify webhook",
                "In `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` so both sides can use it",
              ],
              answer: 1,
              why: "The secret key bypasses RLS, so it belongs only in trusted server code. Minification hides nothing, and `NEXT_PUBLIC_` ships the value to every visitor.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Authentication with Clerk
    // ─────────────────────────────────────────────────────────────
    {
      slug: "auth-with-clerk",
      title: "Authentication with Clerk",
      summary: "Sessions vs tokens, JWT anatomy, Clerk in the Next.js App Router, organizations, webhooks, and using Clerk with Supabase.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Two different questions hide behind the word 'auth'. Mixing them up is the root of most security bugs.",
        },
        {
          type: "table",
          rows: [
            ["", "Authentication (authN)", "Authorization (authZ)"],
            ["Question", "Who are you?", "What are you allowed to do?"],
            ["Answered by", "Clerk (sign-in, MFA, Google OAuth…)", "Your app: RLS policies, role checks, ownership"],
            ["Failure", "401 Unauthorized — please sign in", "403 Forbidden — signed in, but not allowed"],
            ["Example", "Marie proved she owns marie@boulangerie.ca", "Marie can see Boulangerie's invoices, not Studio Nord's"],
          ],
        },
        { type: "h", text: "Sessions vs tokens" },
        {
          type: "compare",
          left: {
            label: "Server session",
            lang: "text",
            code: `Cookie: sid=8f3a91c2...   (random, meaningless)

Each request:
  server looks up "8f3a91c2" in a sessions table
  → { userId: "u_marie", expires: ... }

+ revoke instantly (delete the row)
- a database lookup on every request`,
          },
          right: {
            label: "Token (JWT)",
            lang: "text",
            code: `Authorization: Bearer eyJhbGciOi...   (signed claims)

Each request:
  server verifies the signature with a public key
  → { sub: "user_2abc", exp: 1760000000, ... }

+ no lookup, works across services (Supabase, APIs)
- valid until it expires: keep lifetimes short`,
          },
        },
        {
          type: "p",
          text: "Clerk combines both: a long-lived session managed by Clerk, plus a **very short-lived session JWT** (about 60 seconds) stored in the `__session` cookie and refreshed automatically in the background. Your server verifies the short token on each request with no network call; revoking the session stops new tokens from being issued.",
        },
        { type: "h", text: "Anatomy of a JWT" },
        {
          type: "p",
          text: "A JWT is three **base64url** chunks joined by dots: `header.payload.signature`. The header says how it was signed (e.g. `RS256`), the payload holds the **claims**, and the signature proves the first two parts weren't modified. base64url is base64 with `-` instead of `+`, `_` instead of `/`, and no `=` padding, so it's safe in URLs and cookies.",
        },
        {
          type: "table",
          rows: [
            ["Claim", "Meaning", "Example"],
            ["`sub`", "Subject: the user id", "`user_2abcXYZ`"],
            ["`exp` / `iat` / `nbf`", "Expires at / issued at / not before (Unix seconds)", "`1760000060`"],
            ["`iss`", "Issuer: who signed it", "`https://clerk.portal.client.ca`"],
            ["`azp`", "Authorized party: the origin that requested it", "`https://portal.client.ca`"],
            ["`sid`", "Session id", "`sess_2xyz…`"],
          ],
        },
        {
          type: "run",
          title: "Build and read a token",
          code: `const toBase64Url = (obj) =>
  btoa(JSON.stringify(obj)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");

const header = { alg: "RS256", typ: "JWT" };
const payload = { sub: "user_2abcXYZ", sid: "sess_91", iat: 1760000000, exp: 1760000060 };
const token = toBase64Url(header) + "." + toBase64Url(payload) + ".fake-signature";

console.log(token);
console.log(token.split(".").map((part) => part.length + " chars"));

// Anyone can read the payload: it's encoded, NOT encrypted.
const middle = token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
console.log(JSON.parse(atob(middle.padEnd(Math.ceil(middle.length / 4) * 4, "="))));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Decoding is not verifying",
          text: "Anyone can decode a JWT and anyone can craft one with `\"sub\": \"admin\"`. Only the **signature check** (with the issuer's public key, fetched from its JWKS endpoint) makes the claims trustworthy. Never put secrets in a payload, and never make an authorization decision from a token you only decoded. Clerk's `auth()` verifies for you.",
        },
        {
          type: "challenge",
          title: "Decode a JWT payload",
          prompt:
            "Implement `decodeJwtPayload(token)`: split on `.` and throw an `Error` if there aren't exactly 3 parts; take the middle part, convert base64url to base64 (`-`→`+`, `_`→`/`, then pad with `=` to a multiple of 4), decode with `atob` and `JSON.parse` it. Also implement `isExpired(payload, nowSeconds)`: `true` when `exp` is missing (fail closed) or `exp <= nowSeconds`.",
          starter: `function decodeJwtPayload(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload)); // TODO: base64url → base64, padding, validation
}

function isExpired(payload, nowSeconds) {
  return payload.exp < nowSeconds;
}`,
          solution: `function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT: expected 3 parts");
  let b64 = parts[1].replaceAll("-", "+").replaceAll("_", "/");
  while (b64.length % 4 !== 0) b64 += "=";
  return JSON.parse(atob(b64));
}

function isExpired(payload, nowSeconds) {
  if (typeof payload.exp !== "number") return true;
  return payload.exp <= nowSeconds;
}`,
          tests: [
            {
              name: "decodes a simple token's payload",
              code: `const enc = (o) => btoa(JSON.stringify(o)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const t = enc({ alg: "RS256" }) + "." + enc({ sub: "user_2abc", exp: 1760000060 }) + ".sig";
const p = decodeJwtPayload(t);
return p.sub === "user_2abc" && p.exp === 1760000060;`,
            },
            {
              name: "handles base64url characters (- and _) and missing padding",
              code: `const enc = (o) => btoa(JSON.stringify(o)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const body = enc({ sub: "user_2xyz", note: "?>?>~~", exp: 1893456000 });
const p = decodeJwtPayload(enc({ alg: "RS256" }) + "." + body + ".sig");
return /[-_]/.test(body) && p.note === "?>?>~~" && p.sub === "user_2xyz";`,
            },
            {
              name: "throws an Error when the token doesn't have 3 parts",
              code: `try { decodeJwtPayload("not-a-jwt"); return false; } catch (e) { return e instanceof Error; }`,
            },
            {
              name: "isExpired compares exp to now, and treats a missing exp as expired",
              code: `return isExpired({ exp: 100 }, 99) === false
  && isExpired({ exp: 100 }, 100) === true
  && isExpired({ exp: 100 }, 200) === true
  && isExpired({ sub: "user_2abc" }, 50) === true;`,
            },
          ],
          hint: "`replaceAll(\"-\", \"+\")` and `replaceAll(\"_\", \"/\")`, then `while (b64.length % 4 !== 0) b64 += \"=\"`. For `isExpired`, check `typeof payload.exp !== \"number\"` first.",
        },
        {
          type: "callout",
          tone: "info",
          text: "`atob` returns one character per byte, so non-ASCII names (like 'Hélène') come out garbled. Production decoders turn the bytes into a `Uint8Array` and use `new TextDecoder().decode(...)`. Libraries like `jose` handle this and signature verification.",
        },
        { type: "h", text: "Clerk in a Next.js App Router project" },
        {
          type: "steps",
          items: [
            { title: "Install", text: "`npm install @clerk/nextjs`, then copy the keys from the Clerk dashboard into `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (public) and `CLERK_SECRET_KEY` (server only)." },
            { title: "Wrap the app", text: "Put `<ClerkProvider>` around your root layout so every component can read the session." },
            { title: "Add clerkMiddleware()", text: "It runs before every matched request, reads and verifies the session, and lets you protect routes." },
            { title: "Read the user on the server", text: "`await auth()` for the ids (fast, from the token), `await currentUser()` for the full profile (an API call)." },
            { title: "Add sign-in UI", text: "Drop in `<SignIn />`, `<UserButton />` and friends, or build your own with Clerk's hooks." },
          ],
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/layout.tsx",
          code: `import { ClerkProvider, UserButton } from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="fr-CA">
        <body>
          <header className="flex justify-end p-4"><UserButton /></header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "proxy.ts (Next.js 16) — middleware.ts on Next.js 15",
          code: `import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/api/webhooks(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // signed out → redirected to sign-in (API requests get an error response instead)
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "middleware.ts → proxy.ts",
          text: "Next.js 16 renamed `middleware.ts` to `proxy.ts`. Clerk's `clerkMiddleware()` works in both; just use the file name your Next.js version expects (client repos still on Next 15 use `middleware.ts`).",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/dashboard/page.tsx + app/api/quotes/route.ts",
          code: `import { auth, currentUser } from "@clerk/nextjs/server";

// Server Component
export default async function Dashboard() {
  const { userId } = await auth();          // from the verified session token
  const user = await currentUser();         // full profile (Backend API call)
  return <h1>Bonjour {user?.firstName} ({userId})</h1>;
}

// Route Handler
export async function POST(req: Request) {
  const { userId, orgId, has } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });         // authN
  if (!has({ role: "org:admin" })) return new Response("Forbidden", { status: 403 }); // authZ
  // ... create the quote for orgId
  return Response.json({ ok: true });
}`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/sign-in/[[...sign-in]]/page.tsx",
          code: `import { SignIn } from "@clerk/nextjs";

// The optional catch-all lets Clerk handle its sub-steps (verification, MFA...)
export default function Page() {
  return <div className="grid min-h-screen place-items-center"><SignIn /></div>;
}
// .env.local → NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`,
        },
        { type: "h", text: "Organizations: B2B in one switch" },
        {
          type: "p",
          text: "Most agency portals are B2B: a user belongs to a client company and acts on its behalf. Clerk **Organizations** model this: members, invitations, roles (`org:admin`, `org:member`, or custom ones) and permissions. The active organization comes through as `orgId` / `orgRole` in `auth()`, `has({ role })` / `has({ permission })` checks access, and `<OrganizationSwitcher />` lets users who belong to several companies switch between them.",
        },
        { type: "h", text: "Webhooks: keep your database in sync" },
        {
          type: "p",
          text: "Clerk owns the user records, but your database needs them too (to join invoices with a name, to send emails, to enforce foreign keys). Clerk sends webhooks (`user.created`, `user.updated`, `user.deleted`, `organizationMembership.created`…) signed with a secret. Verify, then upsert.",
        },
        {
          type: "code",
          lang: "ts",
          title: "app/api/webhooks/clerk/route.ts",
          code: `import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req); // checks the signature with CLERK_WEBHOOK_SIGNING_SECRET
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const u = evt.data;
    await supabaseAdmin.from("profiles").upsert({
      clerk_id: u.id,
      email: u.email_addresses[0]?.email_address,
      full_name: [u.first_name, u.last_name].filter(Boolean).join(" "),
    }, { onConflict: "clerk_id" }); // upsert = safe if Clerk retries the same event
  }

  if (evt.type === "user.deleted" && evt.data.id) {
    await supabaseAdmin.from("profiles").delete().eq("clerk_id", evt.data.id);
  }

  return new Response("ok");
}`,
        },
        {
          type: "callout",
          tone: "warn",
          text: "The webhook route must be **public** in your middleware/proxy (Clerk calls it without a session — the signature is the authentication), and it can be delivered more than once, so make it idempotent (upsert, not insert).",
        },
        { type: "h", text: "Clerk + Supabase: third-party auth" },
        {
          type: "p",
          text: "You can use Clerk for sign-in and Supabase for data with RLS. Enable the **Clerk integration** in Supabase (Authentication → Third-party auth) and in Clerk's dashboard: Supabase then trusts Clerk-issued session tokens. You pass the token to supabase-js, and policies read the Clerk user id from the JWT. Clerk ids look like `user_2abc…` (not UUIDs), so use `text` columns and `auth.jwt()->>'sub'`.",
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/supabase/clerk-server.ts",
          code: `import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export function createClerkSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      // Called before each request: hand Supabase the current Clerk session token
      async accessToken() {
        return (await auth()).getToken();
      },
    },
  );
}
// Client side: same idea with useSession() → session?.getToken() ?? null`,
        },
        {
          type: "code",
          lang: "sql",
          code: `create table quotes (
  id      uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt()->>'sub'),   -- the Clerk user id
  title   text not null
);
alter table quotes enable row level security;

create policy "Users read their own quotes"
on quotes for select to authenticated
using ( (select auth.jwt()->>'sub') = user_id );`,
        },
        {
          type: "callout",
          tone: "stack",
          text: "Older tutorials create a 'supabase' **JWT template** in Clerk and share the Supabase JWT secret. That approach is deprecated: the native third-party auth integration is simpler and doesn't require sharing secrets.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A signed-in member calls an admin-only endpoint. Which status code fits best?",
              options: ["401 Unauthorized", "500 Internal Server Error", "403 Forbidden"],
              answer: 2,
              why: "They are authenticated (we know who they are) but not authorized. 401 is for 'we don't know who you are'.",
            },
            {
              q: "Why is it unsafe to trust the claims of a JWT you only decoded with `atob`?",
              options: [
                "atob is too slow for production",
                "Anyone can create a token with any payload; only the signature check proves it came from the issuer",
                "The payload is encrypted and atob shows random data",
              ],
              answer: 1,
              why: "The payload is just base64url-encoded JSON. Trust comes from verifying the signature with the issuer's public key.",
            },
            {
              q: "In the Clerk + Supabase integration, how does an RLS policy identify the Clerk user?",
              options: ["`auth.jwt()->>'sub'` compared to a text column", "`auth.uid()` compared to a uuid column", "A `CLERK_USER_ID` env var"],
              answer: 0,
              why: "Clerk ids aren't UUIDs, so read the `sub` claim from the verified token with `auth.jwt()->>'sub'` and store it in a `text` column.",
            },
            {
              q: "Why must the Clerk webhook handler use an upsert rather than a plain insert?",
              options: ["Inserts don't work with the secret key", "Webhooks can be delivered more than once", "Clerk requires it"],
              answer: 1,
              why: "Webhook senders retry on timeouts and errors, so the same event can arrive twice. An idempotent handler gives the same result either way.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Deploying on Vercel
    // ─────────────────────────────────────────────────────────────
    {
      slug: "deploying-on-vercel",
      title: "Deploying on Vercel",
      summary: "Git-connected deploys, preview vs production, environment variables, domains, functions, logs and the failures you'll actually hit.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Vercel (the company behind Next.js) turns a Git repository into a running website. It builds your app, puts static files on a global CDN, and runs your server code (Server Components, Route Handlers, Server Actions) as **functions** that start on demand. No server to patch, and every pull request gets its own live URL.",
        },
        {
          type: "steps",
          items: [
            { title: "git push", text: "You push a branch or merge a PR. GitHub notifies Vercel through the Git integration." },
            { title: "Build", text: "Vercel clones the commit, installs dependencies (with your lockfile), and runs `next build` with that environment's variables." },
            { title: "Deploy", text: "The output becomes an **immutable deployment**: static assets to the CDN, server code to functions. Each deployment has its own unique URL forever." },
            { title: "Assign URLs", text: "Pushes to the production branch (`main`) update your domains. Other branches get preview URLs and a comment on the PR." },
          ],
        },
        {
          type: "table",
          rows: [
            ["", "Preview", "Production"],
            ["Triggered by", "Any non-production branch / PR", "The production branch (usually `main`) or `vercel --prod`"],
            ["URL", "`project-git-feature-quotes-team.vercel.app`", "your custom domain, e.g. `portal.client.ca`"],
            ["Env vars", "'Preview' values (test Stripe/Shopify keys, staging DB)", "'Production' values (live keys, prod DB)"],
            ["Typical use", "Client review, QA, design sign-off", "Real users"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Previews are a client-service superpower",
          text: "Send the client the preview link of a PR so they can approve a new page before it's merged. Previews are protected by Vercel Authentication by default; use a shareable link or a protection bypass if the client doesn't have a Vercel account. Bad production deploy? **Instant Rollback** re-points the domain to the previous deployment in seconds.",
        },
        { type: "h", text: "Environment variables per environment" },
        {
          type: "p",
          text: "Each variable is assigned to one or more environments: **Development** (pulled to your machine), **Preview** and **Production**. Preview variables can also be limited to a specific Git branch, which overrides the general preview value. That's how a long-running `staging` branch can point to a staging database while other previews use a dev one.",
        },
        {
          type: "code",
          lang: "bash",
          code: `npm i -g vercel
vercel link                      # connect this folder to the Vercel project
vercel env pull .env.local       # download Development variables for local dev
vercel env add SHOPIFY_ADMIN_TOKEN production
vercel                           # deploy a preview from your machine
vercel --prod                    # deploy to production (normally Git does this)`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "NEXT_PUBLIC_ values are frozen at build time",
          text: "Next.js replaces `process.env.NEXT_PUBLIC_…` with the literal value *while building*. Changing it in the dashboard does nothing until you **redeploy**. Server-only variables are read at runtime, but a new deployment is still needed for them to be picked up.",
        },
        {
          type: "run",
          title: "What 'inlined at build time' means",
          code: `const source = \`const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SHOPIFY_ADMIN_TOKEN;\`;

function build(code, env) {
  // Next.js replaces NEXT_PUBLIC_ references with string literals in the client bundle
  return code.replace(/process\\.env\\.(NEXT_PUBLIC_\\w+)/g, (_, name) => JSON.stringify(env[name] ?? ""));
}

const bundleV1 = build(source, { NEXT_PUBLIC_SUPABASE_URL: "https://old.supabase.co", SHOPIFY_ADMIN_TOKEN: "shpat_..." });
console.log(bundleV1);
// Changing the variable later doesn't touch bundleV1: it's already text in the JS file.
const bundleV2 = build(source, { NEXT_PUBLIC_SUPABASE_URL: "https://new.supabase.co" });
console.log("\\nafter a redeploy:\\n" + bundleV2);
// Note: SHOPIFY_ADMIN_TOKEN was never inlined — non-public vars stay on the server.`,
        },
        {
          type: "challenge",
          title: "Resolve variables like Vercel does",
          prompt:
            "Implement `resolveEnv(vars, target, branch)`. Each var is `{ key, value, targets, gitBranch? }` where `targets` is an array of `\"production\"`, `\"preview\"`, `\"development\"`. Return an object `{ KEY: value }` with the vars whose `targets` include `target`. For `\"preview\"`, a var that has a `gitBranch` only applies when it equals `branch`, and then it **overrides** a general preview var with the same key, whatever their order in the array.",
          starter: `function resolveEnv(vars, target, branch) {
  const env = {};
  for (const v of vars) {
    if (v.targets.includes(target)) env[v.key] = v.value;
  }
  return env;
}`,
          solution: `function resolveEnv(vars, target, branch) {
  const env = {};
  // 1) general values
  for (const v of vars) {
    if (v.targets.includes(target) && !v.gitBranch) env[v.key] = v.value;
  }
  // 2) branch-specific preview values override them
  if (target === "preview") {
    for (const v of vars) {
      if (v.targets.includes("preview") && v.gitBranch && v.gitBranch === branch) env[v.key] = v.value;
    }
  }
  return env;
}`,
          tests: [
            {
              name: "production only gets production values",
              code: `const vars = [
  { key: "DB_URL", value: "prod-db", targets: ["production"] },
  { key: "DB_URL", value: "dev-db", targets: ["preview", "development"] },
];
const env = resolveEnv(vars, "production", "main");
return env.DB_URL === "prod-db" && Object.keys(env).length === 1;`,
            },
            {
              name: "a branch-specific preview var overrides the general one, even if listed first",
              code: `const vars = [
  { key: "DB_URL", value: "staging-db", targets: ["preview"], gitBranch: "staging" },
  { key: "DB_URL", value: "dev-db", targets: ["preview", "development"] },
];
return resolveEnv(vars, "preview", "staging").DB_URL === "staging-db";`,
            },
            {
              name: "branch-specific vars don't leak into other preview branches",
              code: `const vars = [
  { key: "DB_URL", value: "dev-db", targets: ["preview"] },
  { key: "DB_URL", value: "staging-db", targets: ["preview"], gitBranch: "staging" },
  { key: "ONLY_STAGING", value: "1", targets: ["preview"], gitBranch: "staging" },
];
const env = resolveEnv(vars, "preview", "feature/quotes");
return env.DB_URL === "dev-db" && !("ONLY_STAGING" in env);`,
            },
            {
              name: "development gets development values",
              code: `const vars = [{ key: "SHOPIFY_STORE", value: "dev-store.myshopify.com", targets: ["development"] }];
return resolveEnv(vars, "development").SHOPIFY_STORE === "dev-store.myshopify.com" && Object.keys(resolveEnv(vars, "production", "main")).length === 0;`,
            },
          ],
          hint: "Do two passes: first apply every matching var *without* `gitBranch`, then (for preview only) apply the vars whose `gitBranch === branch`, so they win regardless of order.",
        },
        { type: "h", text: "Domains & DNS" },
        {
          type: "p",
          text: "Add the domain in Project → Settings → Domains, then create the DNS records Vercel shows you at the client's registrar or DNS host (GoDaddy, Cloudflare, Namecheap…). Vercel issues and renews the HTTPS certificate automatically once DNS points to it.",
        },
        {
          type: "table",
          rows: [
            ["Record", "Used for", "Example"],
            ["A", "Apex/root domain (`client.ca`) → an IP address", "`client.ca → <IP shown by Vercel>`"],
            ["CNAME", "Subdomain (`www`, `portal`) → another hostname", "`portal.client.ca → <value shown by Vercel>`"],
            ["TXT", "Proving ownership, email (SPF), verification", "`_vercel` verification record"],
            ["MX", "Email delivery — leave the client's existing ones alone!", "`client.ca → mx.google.com`"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          text: "Changing nameservers moves *all* DNS (including the client's email MX records) to the new provider. When the client's email is on Google Workspace or Microsoft 365, prefer adding A/CNAME records at the existing DNS host. DNS changes can take minutes to hours to propagate; lower the TTL ahead of a launch.",
        },
        { type: "h", text: "Functions: where your server code runs" },
        {
          type: "p",
          text: "Each server route becomes a **Vercel Function** running on Node.js (with Fluid compute, instances are reused across requests). They're perfect for request → response work: render a page, handle a form, receive a webhook. They have a maximum duration (configurable, measured in minutes) and are not meant to hold websocket connections or run endless loops — that's what the next lesson's Railway is for. An Edge runtime also exists, but the Node.js runtime is the default and recommended choice.",
        },
        {
          type: "code",
          lang: "ts",
          title: "app/api/cron/sync-orders/route.ts",
          code: `export const maxDuration = 60; // seconds this function may run

export async function GET(req: Request) {
  // Vercel sends "Authorization: Bearer <CRON_SECRET>" when the CRON_SECRET env var is set
  if (req.headers.get("authorization") !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new Response("Unauthorized", { status: 401 });
  }
  // ... small, quick sync job
  return Response.json({ ok: true });
}`,
        },
        {
          type: "code",
          lang: "json",
          title: "vercel.json",
          code: `{
  "crons": [{ "path": "/api/cron/sync-orders", "schedule": "0 6 * * *" }]
}`,
        },
        { type: "h", text: "Logs, build cache and the failures you'll meet" },
        {
          type: "p",
          text: "Each deployment has **build logs** (install + `next build` output) and **runtime logs** (your `console.log` and errors from functions, filterable by route and level). Builds reuse a cache of `node_modules` and `.next/cache`; when a build behaves strangely after a dependency change, redeploy with 'Use existing Build Cache' unchecked.",
        },
        {
          type: "table",
          rows: [
            ["Symptom", "Usual cause", "Fix"],
            ["Builds locally, fails on Vercel: 'Module not found'", "Import case mismatch (`./Button` vs `button.tsx`): macOS forgives, Linux doesn't", "Match the file name exactly"],
            ["Build fails on a type or lint error", "`next build` type-checks; your dev server didn't", "Run `npm run build` locally before pushing"],
            ["Works in preview, broken in prod", "A variable only set for Preview, or test vs live keys", "Compare env vars per environment"],
            ["New env value ignored", "No redeploy, or it's a `NEXT_PUBLIC_` var baked into the old build", "Redeploy"],
            ["504 / 'Task timed out'", "Function exceeded its max duration (slow API, huge loop)", "Speed it up, raise `maxDuration`, or move it to a worker"],
            ["Install fails", "Lockfile out of sync, or wrong Node version", "Commit the lockfile; set Node version in project settings / `engines`"],
          ],
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You changed `NEXT_PUBLIC_SUPABASE_URL` in Vercel's dashboard but the site still uses the old one. Why?",
              options: [
                "The value was inlined into the JS during the previous build; you must redeploy",
                "Vercel caches env vars for 24 hours",
                "Public variables can't be changed after creation",
              ],
              answer: 0,
              why: "`NEXT_PUBLIC_` variables are replaced by their literal values at build time. A new build is the only way to change them.",
            },
            {
              q: "Which job does NOT fit well in a Vercel Function?",
              options: ["Handling a Shopify webhook", "A websocket server that keeps connections open for hours", "Rendering a product page"],
              answer: 1,
              why: "Functions are request/response with a max duration. Long-lived connections and processes belong on a server platform like Railway.",
            },
            {
              q: "A build passes on your Mac but fails on Vercel with 'Module not found: ./components/Header'. The file is `header.tsx`. What happened?",
              options: ["Vercel doesn't support .tsx", "The build cache is corrupted", "Linux file systems are case-sensitive"],
              answer: 2,
              why: "macOS file systems are case-insensitive by default; Vercel's Linux build machines are not, so the import must match the file name's casing exactly.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Railway
    // ─────────────────────────────────────────────────────────────
    {
      slug: "railway",
      title: "Railway",
      summary: "When you need a long-running process: services, variables and references, deploying an API or worker, cron and volumes.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Vercel Functions follow a strict model: a request comes in, a response goes out, and the instance may be paused or recycled. Some jobs don't fit: a worker that processes a queue all day, a websocket server, a bot that listens to Discord, a 20-minute import of 30,000 Shopify products. Those need a **process that stays alive**. **Railway** runs exactly that: containers built from your repo (or a Docker image), plus managed databases, with usage-based pricing.",
        },
        {
          type: "table",
          rows: [
            ["Need", "Vercel", "Railway"],
            ["Next.js front-end, SSR, Server Actions", "✅ best fit", "possible, but you lose previews/CDN niceties"],
            ["Short API routes & webhooks", "✅", "✅"],
            ["Long jobs (> a few minutes), queue workers", "❌ max duration", "✅ always-on process"],
            ["Websockets / persistent connections", "❌", "✅"],
            ["Cron that runs a script for 10 minutes", "short crons only", "✅ cron service"],
            ["Postgres / Redis next to your code", "via marketplace integrations", "✅ one click, private network"],
          ],
        },
        { type: "h", text: "Railway's building blocks" },
        {
          type: "table",
          rows: [
            ["Concept", "What it is"],
            ["Project", "A canvas grouping everything for one client app"],
            ["Environment", "`production`, `staging`, or a PR environment — a full copy of the services with their own variables"],
            ["Service", "One deployable thing: an API, a worker, a cron script, a Postgres or Redis database"],
            ["Deployment", "One build + run of a service (from a commit or image); roll back by redeploying an older one"],
            ["Variables", "Env vars per service, with references to other services' variables"],
            ["Volume", "Persistent disk mounted into one service; everything else in the container is wiped on redeploy"],
            ["Private network", "Services talk to each other at `<service>.railway.internal` without going through the internet"],
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Browser → Vercel (Next.js)", text: "The client's staff clicks 'Sync all products'. A Server Action inserts a row in a `jobs` table in Supabase and returns immediately." },
            { title: "Railway worker", text: "An always-on Node process polls the `jobs` table (or a Redis queue), picks the job and marks it `running`." },
            { title: "Shopify Admin API", text: "The worker pages through 30,000 products with cursors, respecting rate limits — 15 minutes, no timeout." },
            { title: "Supabase", text: "Results are upserted with the secret key; the job is marked `done` with stats." },
            { title: "Back to the browser", text: "The dashboard sees the job status change through Supabase Realtime (or polling) and shows 'Sync complete'." },
          ],
        },
        { type: "h", text: "Deploying a Node/Express API or worker" },
        {
          type: "p",
          text: "Connect the GitHub repo to a service and Railway builds it automatically with **Railpack** (it detects Node, installs, runs `build` and `start` from `package.json`), or with your `Dockerfile` if there is one. Two rules make a service behave: listen on the `PORT` Railway gives you, and shut down cleanly on `SIGTERM` (sent when a new deployment replaces the old one).",
        },
        {
          type: "code",
          lang: "ts",
          title: "src/server.ts",
          code: `import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true })); // used by the healthcheck

app.post("/jobs/sync-products", async (req, res) => {
  if (req.headers.authorization !== \`Bearer \${process.env.WORKER_TOKEN}\`) return res.sendStatus(401);
  // enqueue, then respond fast
  res.status(202).json({ queued: true });
});

const port = Number(process.env.PORT ?? 3000); // Railway injects PORT
const server = app.listen(port, () => console.log(\`API listening on \${port}\`));

process.on("SIGTERM", () => {
  console.log("SIGTERM: finishing in-flight requests…");
  server.close(() => process.exit(0));
});`,
        },
        {
          type: "code",
          lang: "json",
          title: "railway.json (config as code)",
          code: `{
  "$schema": "https://railway.com/railway.schema.json",
  "build": { "builder": "RAILPACK", "buildCommand": "npm run build" },
  "deploy": {
    "startCommand": "node dist/server.js",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 5
  }
}`,
        },
        {
          type: "code",
          lang: "bash",
          code: `npm i -g @railway/cli
railway login
railway link                 # pick the project/environment/service
railway up                   # deploy the current folder (CI usually deploys from Git instead)
railway logs                 # stream logs
railway run npm run migrate  # run a local command with the service's variables injected`,
        },
        { type: "h", text: "Variables and references" },
        {
          type: "p",
          text: "Instead of copy-pasting a database URL into three services (and forgetting one when it changes), Railway variables can **reference** other variables with `${{ ... }}`. The value is resolved at deploy time.",
        },
        {
          type: "code",
          lang: "text",
          title: "worker service → Variables",
          code: `DATABASE_URL        = \${{Postgres.DATABASE_URL}}           # from the Postgres service
API_INTERNAL_URL    = http://\${{api.RAILWAY_PRIVATE_DOMAIN}}:\${{api.PORT}}
SHOPIFY_API_VERSION = \${{shared.SHOPIFY_API_VERSION}}      # project-wide shared variable
SUPABASE_SECRET_KEY = sb_secret_…                          # sealed / plain secret`,
        },
        {
          type: "challenge",
          title: "Resolve variable references",
          prompt:
            "Implement `resolveReferences(vars, services)`. `vars` maps names to strings that may contain references like `${{Postgres.DATABASE_URL}}` (spaces inside the braces are allowed: `${{ api.PORT }}`), possibly several per string. `services` maps a service name (or `shared`) to its variables. Return a new object with every reference replaced. If a reference points to an unknown service or variable, throw an `Error` whose message contains the reference (e.g. `Postgres.DATABSE_URL`) — failing fast beats deploying with an empty URL.",
          starter: `function resolveReferences(vars, services) {
  // TODO: replace \${{Service.VAR}} with services[Service][VAR]
  return { ...vars };
}`,
          solution: `function resolveReferences(vars, services) {
  const pattern = /\\$\\{\\{\\s*([\\w-]+)\\.(\\w+)\\s*\\}\\}/g;
  const out = {};
  for (const [name, raw] of Object.entries(vars)) {
    out[name] = raw.replace(pattern, (_match, service, key) => {
      const value = services[service]?.[key];
      if (value === undefined) throw new Error("Unresolved reference: " + service + "." + key);
      return String(value);
    });
  }
  return out;
}`,
          tests: [
            {
              name: "replaces a whole-value reference",
              code: `const r = resolveReferences({ DATABASE_URL: "\${{Postgres.DATABASE_URL}}" }, { Postgres: { DATABASE_URL: "postgres://pg.railway.internal:5432/app" } });
return r.DATABASE_URL === "postgres://pg.railway.internal:5432/app";`,
            },
            {
              name: "handles several references in one value, with spaces inside the braces",
              code: `const r = resolveReferences(
  { API_URL: "http://\${{ api.RAILWAY_PRIVATE_DOMAIN }}:\${{api.PORT}}/v1" },
  { api: { RAILWAY_PRIVATE_DOMAIN: "api.railway.internal", PORT: "8080" } },
);
return r.API_URL === "http://api.railway.internal:8080/v1";`,
            },
            {
              name: "plain values pass through unchanged, and the input isn't mutated",
              code: `const vars = { NODE_ENV: "production", V: "\${{shared.SHOPIFY_API_VERSION}}" };
const r = resolveReferences(vars, { shared: { SHOPIFY_API_VERSION: "2026-07" } });
return r.NODE_ENV === "production" && r.V === "2026-07" && vars.V.startsWith("\${{");`,
            },
            {
              name: "throws an Error naming an unknown reference",
              code: `try {
  resolveReferences({ DATABASE_URL: "\${{Postgres.DATABSE_URL}}" }, { Postgres: { DATABASE_URL: "x" } });
  return false;
} catch (e) {
  return e instanceof Error && e.message.includes("Postgres.DATABSE_URL");
}`,
            },
          ],
          hint: "A global regex with two capture groups does it: `/\\$\\{\\{\\s*([\\w-]+)\\.(\\w+)\\s*\\}\\}/g`. Use `string.replace(pattern, (_, service, key) => ...)`, look up `services[service]?.[key]`, and throw when it's `undefined`.",
        },
        { type: "h", text: "Workers, cron and volumes" },
        {
          type: "p",
          text: "A **worker** is just a service with no public domain that loops forever: fetch a job, process it, repeat. A **cron service** is a service with a cron schedule in its settings (e.g. `0 6 * * *`, in UTC): Railway starts it on schedule, it does its work and must **exit**. If the previous run is still going, the next one is skipped.",
        },
        {
          type: "run",
          title: "A worker loop, simulated",
          code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const queue = [
  { id: "job_1", type: "sync-products", attempts: 0 },
  { id: "job_2", type: "send-invoice", attempts: 0 },
  { id: "job_3", type: "sync-products", attempts: 0 },
];
let flaky = true;

async function handle(job) {
  await sleep(20); // pretend to call Shopify / send an email
  if (job.id === "job_2" && flaky) {
    flaky = false;
    throw new Error("Mail API 503");
  }
}

let stopping = false; // in real life: set to true on SIGTERM
let idleTicks = 0;
while (!stopping) {
  const job = queue.shift();
  if (!job) {
    idleTicks++;
    if (idleTicks > 3) stopping = true; // demo only: a real worker keeps polling
    await sleep(30);
    continue;
  }
  try {
    job.attempts++;
    await handle(job);
    console.log("✓", job.id, job.type, "(attempt " + job.attempts + ")");
  } catch (e) {
    console.log("✗", job.id, e.message, "→ requeued");
    if (job.attempts < 3) queue.push(job);
  }
}
console.log("worker stopped cleanly");`,
        },
        {
          type: "callout",
          tone: "tip",
          text: "With Postgres as a queue, let several workers grab jobs safely with `select ... for update skip locked limit 1` inside a transaction (libraries like pg-boss wrap this). With Redis, BullMQ is the usual choice.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "The container's disk is temporary",
          text: "Files written inside a service vanish on every redeploy. If something must persist on disk (SQLite file, cache), attach a **volume** at a mount path (e.g. `/data`), one volume per service. For user uploads and generated PDFs, Supabase Storage or an S3 bucket is usually the better home.",
        },
        {
          type: "callout",
          tone: "stack",
          text: "A common agency split: Next.js on Vercel for everything user-facing; a Railway project with one worker (plus maybe Redis) for heavy Shopify syncs and scheduled reports; Supabase as the shared database both talk to.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Your import takes 25 minutes and must run every night. Best home?",
              options: ["A Railway cron service that exits when done", "A Vercel Route Handler with a long `maxDuration`", "A Client Component with `useEffect`"],
              answer: 0,
              why: "Long batch jobs fit a Railway cron service: it starts on schedule, runs as long as it needs, then exits.",
            },
            {
              q: "What does `${{Postgres.DATABASE_URL}}` in a Railway variable do?",
              options: [
                "It's a JavaScript template literal evaluated by Node",
                "It references the `DATABASE_URL` variable of the `Postgres` service, resolved at deploy time",
                "It encrypts the database URL",
              ],
              answer: 1,
              why: "Reference variables keep one source of truth: when the database's URL changes, every service referencing it picks up the new value on redeploy.",
            },
            {
              q: "Why should a Railway service handle `SIGTERM`?",
              options: ["Railway sends it every minute as a health check", "It's required to read `PORT`", "It's sent when a deployment is replaced, so the process can finish in-flight work and exit cleanly"],
              answer: 2,
              why: "On redeploys and restarts the old container receives SIGTERM before being killed. Closing the server/queue gracefully avoids half-processed jobs.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Third-party APIs & Shopify
    // ─────────────────────────────────────────────────────────────
    {
      slug: "third-party-apis-shopify",
      title: "Third-party APIs: REST, GraphQL & Shopify",
      summary: "Tokens, REST vs GraphQL, Shopify's Admin GraphQL API, rate limits, cursor pagination, retries and webhook HMAC verification.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Almost every client project talks to someone else's API: Shopify for products and orders, Stripe for payments, a CRM for leads, Google or Meta for campaign data. The rules are always the same: authenticate, ask for data in the provider's shape, respect their limits, page through big lists, retry carefully, and verify the events they push to you.",
        },
        { type: "h", text: "Keys and tokens" },
        {
          type: "list",
          items: [
            "**API key / access token**: a long secret string sent in a header (`Authorization: Bearer …`, or a custom one like Shopify's `X-Shopify-Access-Token`). Whoever has it *is* your app.",
            "**OAuth**: the user (e.g. a merchant) clicks 'Install' and approves scopes; the provider gives your app a token for *their* account. Shopify apps and Google Ads work this way.",
            "**Scopes**: ask for the minimum (`read_products`, not `write_orders`, if you only display products).",
            "Tokens live in server env vars only — never in `NEXT_PUBLIC_`, never in Git.",
          ],
        },
        { type: "h", text: "REST vs GraphQL" },
        {
          type: "compare",
          left: {
            label: "REST: many URLs, fixed shapes",
            lang: "text",
            code: `GET /products?limit=50
→ every field of 50 products (body_html, images, options…)

GET /products/123/variants
GET /products/124/variants
...  one extra request per product (N+1)`,
          },
          right: {
            label: "GraphQL: one URL, you pick the shape",
            lang: "graphql",
            code: `# POST /graphql.json
query {
  products(first: 50) {
    nodes {
      title
      variants(first: 5) { nodes { sku price } }
    }
  }
}`,
          },
        },
        {
          type: "table",
          rows: [
            ["", "REST", "GraphQL"],
            ["Endpoints", "One per resource (`/orders`, `/orders/42`)", "One (`/graphql`), always POST"],
            ["Response shape", "Decided by the server", "Exactly the fields you asked for"],
            ["Related data", "Extra requests", "Nested in the same query"],
            ["Errors", "HTTP status codes (404, 422…)", "Often HTTP 200 with an `errors` array"],
            ["Caching", "Easy (HTTP caching on GET URLs)", "Harder (everything is a POST)"],
          ],
        },
        { type: "h", text: "Shopify's Admin GraphQL API" },
        {
          type: "p",
          text: "Shopify's Admin API is GraphQL-first: the REST Admin API is legacy, and new public apps must use GraphQL. You POST to a **versioned** endpoint (versions are quarterly, like `2026-07`, each supported for at least a year), authenticated with your app's Admin API access token. Pin the version in an env var and upgrade deliberately.",
        },
        {
          type: "code",
          lang: "graphql",
          title: "products.graphql",
          code: `query ActiveProducts($first: Int!, $after: String) {
  products(first: $first, after: $after, query: "status:active", sortKey: UPDATED_AT) {
    nodes {
      id                # gid://shopify/Product/8123456789
      title
      handle
      totalInventory
      variants(first: 10) {
        nodes { id sku price inventoryQuantity }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/shopify.ts (server only)",
          code: `import "server-only";

const endpoint = \`https://\${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/\${process.env.SHOPIFY_API_VERSION}/graphql.json\`;

export async function shopifyAdmin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(\`Shopify HTTP \${res.status}\`);       // 401, 429, 5xx…
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);   // query-level errors, HTTP 200!
  return json.data as T;
}`,
        },
        {
          type: "code",
          lang: "graphql",
          title: "mutations report problems in userErrors",
          code: `mutation RenameProduct($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { id title }
    userErrors { field message }   # validation problems come back here, not in "errors"
  }
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "200 OK doesn't mean it worked",
          text: "GraphQL APIs return HTTP 200 even when the query failed (`errors`) or a mutation was rejected (`userErrors`). Check all three layers: HTTP status, `errors`, and the mutation's `userErrors`.",
        },
        { type: "h", text: "Rate limits" },
        {
          type: "p",
          text: "Every API protects itself. REST APIs typically answer **429 Too Many Requests**, often with a `Retry-After` header. Shopify's GraphQL API uses a **cost-based leaky bucket**: each query has a calculated cost (roughly, the number of objects it could return), your bucket refills a fixed number of points per second, and each response tells you where you stand:",
        },
        {
          type: "code",
          lang: "json",
          code: `"extensions": {
  "cost": {
    "requestedQueryCost": 112,
    "actualQueryCost": 61,
    "throttleStatus": { "maximumAvailable": 2000, "currentlyAvailable": 1939, "restoreRate": 100 }
  }
}`,
        },
        {
          type: "p",
          text: "Ask for fewer fields and smaller nested `first:` values to lower the cost. For truly huge exports (every order of the year), Shopify's **bulk operations** run the query asynchronously and give you a JSONL file to download.",
        },
        { type: "h", text: "Cursor-based pagination" },
        {
          type: "p",
          text: "Offset pagination (`?page=3&limit=50`) breaks when data changes between requests: insert one product and page 3 shows one item twice. **Cursors** are opaque bookmarks: 'give me 50 items after this exact item'. Shopify returns `pageInfo { hasNextPage endCursor }`; you pass `endCursor` as `after` until `hasNextPage` is false.",
        },
        {
          type: "challenge",
          title: "Fetch every product, page by page",
          prompt:
            "Implement `async function fetchAllProducts(fetchPage, pageSize = 50)`. `fetchPage({ first, after })` returns a Promise of `{ nodes, pageInfo: { hasNextPage, endCursor } }`. Start with `after: null`, keep requesting with the previous `endCursor` while `hasNextPage` is true, and return all nodes in order.",
          starter: `async function fetchAllProducts(fetchPage, pageSize = 50) {
  const page = await fetchPage({ first: pageSize, after: null });
  return page.nodes; // TODO: keep going while there are more pages
}`,
          solution: `async function fetchAllProducts(fetchPage, pageSize = 50) {
  const all = [];
  let after = null;
  while (true) {
    const { nodes, pageInfo } = await fetchPage({ first: pageSize, after });
    all.push(...nodes);
    if (!pageInfo.hasNextPage) break;
    after = pageInfo.endCursor;
  }
  return all;
}`,
          tests: [
            {
              name: "collects all 7 products across 3 pages of 3",
              code: `const catalog = Array.from({ length: 7 }, (_, i) => ({ id: "gid://shopify/Product/" + (i + 1) }));
const fakeApi = async ({ first, after }) => {
  const start = after ? Number(after.slice(4)) : 0;
  const nodes = catalog.slice(start, start + first);
  const end = start + nodes.length;
  return { nodes, pageInfo: { hasNextPage: end < catalog.length, endCursor: "cur_" + end } };
};
const all = await fetchAllProducts(fakeApi, 3);
return all.length === 7 && all[6].id === "gid://shopify/Product/7";`,
            },
            {
              name: "passes first: pageSize, starts with after: null, then uses endCursor",
              code: `const calls = [];
const fakeApi = async (args) => {
  calls.push(args);
  return calls.length === 1
    ? { nodes: [{ id: 1 }], pageInfo: { hasNextPage: true, endCursor: "abc" } }
    : { nodes: [{ id: 2 }], pageInfo: { hasNextPage: false, endCursor: "def" } };
};
await fetchAllProducts(fakeApi, 25);
return calls.length === 2 && calls[0].first === 25 && calls[0].after === null && calls[1].after === "abc";`,
            },
            {
              name: "an empty store returns [] after a single request",
              code: `let n = 0;
const all = await fetchAllProducts(async () => { n++; return { nodes: [], pageInfo: { hasNextPage: false, endCursor: null } }; });
return Array.isArray(all) && all.length === 0 && n === 1;`,
            },
          ],
          hint: "Use a `while (true)` loop with a `let after = null`. Push the page's nodes, `break` when `hasNextPage` is false, otherwise set `after = pageInfo.endCursor`.",
        },
        { type: "h", text: "Retries with exponential backoff" },
        {
          type: "p",
          text: "Networks fail and APIs hiccup. Retry **transient** failures — 429, 500/502/503/504, timeouts, connection resets — but never 400/401/403/404/422: those will fail again identically. Wait longer after each attempt (exponential backoff), add randomness (jitter) so a hundred workers don't retry in sync, honour `Retry-After` when given, and cap the attempts.",
        },
        {
          type: "run",
          title: "withRetry, simulated",
          code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class HttpError extends Error {
  constructor(status) { super("HTTP " + status); this.status = status; }
}
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

async function withRetry(fn, { attempts = 4, baseMs = 20 } = {}) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn(attempt);
    } catch (e) {
      const retryable = RETRYABLE.has(e.status);
      if (!retryable || attempt >= attempts) throw e;
      const delay = baseMs * 2 ** (attempt - 1) + Math.random() * baseMs; // backoff + jitter
      console.log("  attempt " + attempt + " failed (" + e.message + "), retrying in " + Math.round(delay) + "ms");
      await sleep(delay);
    }
  }
}

// A flaky Shopify call: throttled twice, then OK
let calls = 0;
const data = await withRetry(async () => {
  calls++;
  if (calls <= 2) throw new HttpError(429);
  return { products: 50 };
});
console.log("✓ got", data, "after", calls, "calls");

// A 401 is not retried: the token is wrong, waiting won't fix it
try {
  await withRetry(async () => { throw new HttpError(401); });
} catch (e) {
  console.log("✗ gave up immediately:", e.message);
}`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Retry only what's safe to repeat",
          text: "Reads are safe to retry. Writes may have succeeded before the connection dropped: retrying 'create order' can create two. Use idempotency keys where the API offers them (Stripe does), or design writes as upserts keyed on an external id.",
        },
        { type: "h", text: "Webhooks and HMAC verification" },
        {
          type: "p",
          text: "Polling 'any new orders?' every minute is wasteful. With **webhooks**, Shopify POSTs to your URL when something happens (`orders/create`, `products/update`, `app/uninstalled`…). But your URL is public: anyone could POST a fake 'order paid'. So Shopify signs each delivery.",
        },
        {
          type: "steps",
          items: [
            { title: "Shopify signs", text: "It computes an HMAC-SHA256 of the **raw request body** using your app's client secret, base64-encodes it and sends it in the `X-Shopify-Hmac-SHA256` header." },
            { title: "You recompute", text: "Your handler computes the same HMAC over the exact raw bytes it received, with the same secret." },
            { title: "Compare in constant time", text: "Equal → genuine and unmodified. Different → reject with 401. Use a timing-safe comparison so attackers can't guess the signature byte by byte." },
            { title: "Acknowledge fast", text: "Return 200 within a few seconds and do the heavy work asynchronously (queue a job for the Railway worker). Slow or failing endpoints get retried, and repeated failures can get the subscription removed." },
          ],
        },
        {
          type: "code",
          lang: "ts",
          title: "app/api/webhooks/shopify/route.ts",
          code: `import { createHmac, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  const rawBody = await req.text(); // the RAW body: re-serialised JSON would change the bytes
  const received = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const expected = createHmac("sha256", process.env.SHOPIFY_API_SECRET!).update(rawBody, "utf8").digest("base64");

  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response("Invalid HMAC", { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic");          // e.g. "orders/create"
  const webhookId = req.headers.get("x-shopify-webhook-id"); // same id on retries → dedupe on it
  await supabaseAdmin.from("webhook_events").upsert(
    { id: webhookId, topic, payload: JSON.parse(rawBody) },
    { onConflict: "id", ignoreDuplicates: true },
  );
  return new Response("ok"); // a worker processes webhook_events asynchronously
}`,
        },
        {
          type: "callout",
          tone: "stack",
          text: "Same pattern everywhere: Clerk webhooks (via `verifyWebhook`), Stripe (`stripe.webhooks.constructEvent`), GitHub (`X-Hub-Signature-256`). Raw body, shared secret, HMAC, constant-time compare, idempotent processing.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Shopify returns HTTP 200 for your GraphQL mutation. Is the product updated?",
              options: [
                "Yes, 200 always means success",
                "Not necessarily — check the top-level `errors` and the mutation's `userErrors`",
                "No, mutations always return 201",
              ],
              answer: 1,
              why: "GraphQL reports query errors in `errors` and validation failures in `userErrors`, both with HTTP 200.",
            },
            {
              q: "Why prefer cursor pagination over `?page=N` when syncing a catalog that changes?",
              options: [
                "Cursors are shorter strings",
                "Offsets are not supported by HTTP",
                "A cursor points at a specific item, so inserts and deletes don't shift pages and cause duplicates or gaps",
              ],
              answer: 2,
              why: "Offsets are positions; when rows are added or removed between requests, positions move. A cursor resumes after a specific item.",
            },
            {
              q: "Which error should your retry helper NOT retry?",
              options: ["401 Unauthorized", "429 Too Many Requests", "503 Service Unavailable"],
              answer: 0,
              why: "A 401 means the credentials are wrong; it fails the same way every time. 429 and 503 are transient.",
            },
            {
              q: "Why must the HMAC be computed over the raw body text?",
              options: [
                "JSON.parse is too slow",
                "Parsing and re-stringifying can change the bytes (spacing, key order, escaping), so the HMAC wouldn't match",
                "Shopify sends the body as XML",
              ],
              answer: 1,
              why: "An HMAC is over exact bytes. Any re-serialisation can change them, making genuine webhooks fail verification.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 9. Putting it all together
    // ─────────────────────────────────────────────────────────────
    {
      slug: "putting-it-all-together",
      title: "Putting it all together",
      summary: "A capstone architecture — Next.js on Vercel, Clerk, Supabase, Shopify and a Railway worker — from request flow and secrets to launch day.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Time to assemble everything. Our fictional client, **Fromagerie Laurentides**, sells online with Shopify. They want a **wholesale portal**: restaurant buyers sign in, see their negotiated prices and past orders, request quotes, and the fromagerie's staff get a nightly inventory sync and a live order board.",
        },
        {
          type: "table",
          rows: [
            ["Piece", "Job", "Runs on"],
            ["Next.js (App Router) + Tailwind + shadcn/ui", "Portal UI, Server Components, Server Actions, webhook routes", "Vercel"],
            ["Clerk", "Sign-in, MFA, organizations (one per restaurant), roles", "Clerk (hosted)"],
            ["Supabase", "Postgres: orgs, quotes, price lists, jobs, synced products; RLS; Realtime", "Supabase (hosted)"],
            ["Shopify Admin GraphQL API", "Source of truth for products, inventory, orders", "Shopify"],
            ["Worker", "Queue processing, nightly sync, PDF quotes, emails", "Railway"],
          ],
        },
        { type: "h", text: "Request flow: a buyer opens their dashboard" },
        {
          type: "steps",
          items: [
            { title: "DNS", text: "`portal.fromagerie.ca` resolves (CNAME) to Vercel, which terminates HTTPS at the nearest edge." },
            { title: "Proxy / middleware", text: "`clerkMiddleware()` verifies the `__session` cookie. No session on a protected route → redirect to `/sign-in`." },
            { title: "Server Component", text: "`/dashboard` calls `await auth()` → `userId` and `orgId` (the restaurant). No database call needed to know who they are." },
            { title: "Supabase as the user", text: "A supabase-js client created with Clerk's session token queries `quotes` and `orders`. RLS policies check `auth.jwt()` and return only this restaurant's rows." },
            { title: "Render", text: "HTML is streamed to the browser; Client Components hydrate (filters, the quote form) and subscribe to Realtime for order status changes." },
          ],
        },
        { type: "h", text: "Event flow: a new Shopify order" },
        {
          type: "steps",
          items: [
            { title: "Shopify → Vercel", text: "`orders/create` webhook hits `/api/webhooks/shopify`. The route verifies the HMAC, upserts the event keyed on `X-Shopify-Webhook-Id`, and answers 200 in milliseconds." },
            { title: "Railway worker", text: "Picks the event from the queue, fetches extra order details through the Admin GraphQL API, maps the customer to a restaurant org." },
            { title: "Supabase", text: "Writes the order with the secret key (trusted server code, RLS bypassed on purpose)." },
            { title: "Realtime → browser", text: "The staff order board and the buyer's dashboard update live, still filtered by RLS." },
          ],
        },
        {
          type: "run",
          title: "The whole request path, in miniature",
          code: `// --- Clerk: verify the session (here: just look it up) ---
const sessions = { "sess_marie": { userId: "user_marie", orgId: "org_bistro", orgRole: "org:admin", exp: 2000000000 } };
function auth(cookie, now) {
  const s = sessions[cookie];
  if (!s || s.exp <= now) return { userId: null };
  return s;
}

// --- Supabase: rows + an RLS policy using the token's claims ---
const quotes = [
  { id: "q1", org_id: "org_bistro", title: "Brie de Meaux x 20" },
  { id: "q2", org_id: "org_bistro", title: "Oka classique x 12" },
  { id: "q3", org_id: "org_cafe", title: "Cheddar 2 ans x 40" },
];
const rls = (claims, row) => claims.orgId != null && row.org_id === claims.orgId;
const selectQuotes = (claims) => quotes.filter((row) => rls(claims, row));

// --- Next.js: proxy + Server Component ---
function handleRequest(path, cookie) {
  const now = 1760000000;
  const session = auth(cookie, now);
  if (path.startsWith("/dashboard") && !session.userId) return { status: 307, location: "/sign-in" };
  const rows = selectQuotes(session);
  return { status: 200, body: rows.map((q) => q.title) };
}

console.log("Marie        →", handleRequest("/dashboard", "sess_marie"));
console.log("no cookie    →", handleRequest("/dashboard", undefined));
console.log("forged cookie→", handleRequest("/dashboard", "sess_admin"));`,
        },
        { type: "h", text: "Where every secret lives" },
        {
          type: "table",
          rows: [
            ["Variable", "Lives in", "In the browser?"],
            ["`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`", "Vercel (all envs)", "Yes — safe thanks to RLS"],
            ["`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`", "Vercel", "Yes — identifies the Clerk instance"],
            ["`CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET`", "Vercel", "Never"],
            ["`SUPABASE_SECRET_KEY`", "Vercel (webhook routes) + Railway worker", "Never — bypasses RLS"],
            ["`SHOPIFY_ADMIN_TOKEN`, `SHOPIFY_API_SECRET`", "Vercel + Railway", "Never"],
            ["`CRON_SECRET`, `WORKER_TOKEN`", "Vercel + Railway", "Never"],
            ["Everything above, for local dev", "`.env.local` (git-ignored, from `vercel env pull`)", "—"],
          ],
        },
        {
          type: "challenge",
          title: "Audit an environment before launch",
          prompt:
            "Implement `auditEnv(env, required)`. `env` is an object of variable names → values; `required` is an array of names. Return `{ missing, leaked }`, both sorted alphabetically: `missing` lists required names that are absent or set to an empty string; `leaked` lists names that start with `NEXT_PUBLIC_` **and** contain (case-insensitive) one of `SECRET`, `SERVICE_ROLE`, `PRIVATE`, `PASSWORD` or `TOKEN`. Publishable keys like `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are fine.",
          starter: `function auditEnv(env, required) {
  const missing = required.filter((name) => !(name in env));
  const leaked = [];
  return { missing, leaked };
}`,
          solution: `function auditEnv(env, required) {
  const SENSITIVE = ["SECRET", "SERVICE_ROLE", "PRIVATE", "PASSWORD", "TOKEN"];
  const missing = required.filter((name) => env[name] === undefined || env[name] === "").sort();
  const leaked = Object.keys(env)
    .filter((name) => name.startsWith("NEXT_PUBLIC_") && SENSITIVE.some((word) => name.toUpperCase().includes(word)))
    .sort();
  return { missing, leaked };
}`,
          tests: [
            {
              name: "flags secrets exposed with NEXT_PUBLIC_",
              code: `const r = auditEnv({
  NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: "eyJ...",
  NEXT_PUBLIC_SHOPIFY_ADMIN_TOKEN: "shpat_...",
  NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
}, []);
return r.leaked.join(",") === "NEXT_PUBLIC_SHOPIFY_ADMIN_TOKEN,NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY";`,
            },
            {
              name: "publishable keys and server-only secrets are not flagged",
              code: `const r = auditEnv({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_live_...",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_...",
  CLERK_SECRET_KEY: "sk_live_...",
  SUPABASE_SECRET_KEY: "sb_secret_...",
}, []);
return r.leaked.length === 0;`,
            },
            {
              name: "missing includes absent and empty-string variables, sorted",
              code: `const r = auditEnv({ CLERK_SECRET_KEY: "", SHOPIFY_API_VERSION: "2026-07" }, ["SHOPIFY_API_VERSION", "SUPABASE_SECRET_KEY", "CLERK_SECRET_KEY"]);
return r.missing.join(",") === "CLERK_SECRET_KEY,SUPABASE_SECRET_KEY";`,
            },
            {
              name: "detection is case-insensitive",
              code: `const r = auditEnv({ NEXT_PUBLIC_stripe_Secret: "sk_live" }, []);
return r.leaked.length === 1;`,
            },
          ],
          hint: "`missing`: `required.filter(n => env[n] === undefined || env[n] === \"\")`. `leaked`: `Object.keys(env).filter(n => n.startsWith(\"NEXT_PUBLIC_\") && words.some(w => n.toUpperCase().includes(w)))`. Don't forget `.sort()` on both.",
        },
        { type: "h", text: "From empty repo to production launch" },
        {
          type: "steps",
          items: [
            { title: "1. Repository", text: "Create the GitHub repo, protect `main` (PRs + passing checks required), add a README with setup steps and a `.env.example` listing every variable (names only)." },
            { title: "2. Scaffold", text: "`npx create-next-app@latest` with TypeScript, ESLint, Tailwind and the App Router; `npx shadcn@latest init`; add `lib/utils.ts` (cn) and your folder conventions." },
            { title: "3. Supabase", text: "Create separate dev and production projects. `supabase init`, write migrations for every table **with RLS and policies in the same file**, generate types, seed data for local dev." },
            { title: "4. Clerk", text: "Create the application (development instance first), enable Organizations if B2B, set up the Supabase third-party auth integration, add the user-sync webhook." },
            { title: "5. Vercel", text: "Import the repo, set env vars per environment (Preview → dev Supabase/Clerk/test store, Production → live), check that PR previews work, share one with the client." },
            { title: "6. Railway", text: "Create the project, add the worker service from the same or a separate repo, wire variables with references, healthcheck and restart policy, cron service for nightly sync." },
            { title: "7. Shopify", text: "Create the app with the minimum scopes, store the token server-side, pin the API version, register webhooks pointing at the **production** URL (and a dev store for testing)." },
            { title: "8. Domains", text: "Add `portal.client.ca` in Vercel, create the DNS records at the client's DNS host without touching MX records. Switch Clerk to a **production instance** (it needs its own DNS records on the client's domain) and update the keys." },
            { title: "9. Observe", text: "Error tracking (e.g. Sentry), Vercel runtime logs, Railway logs and alerts, Supabase backups / point-in-time recovery for production." },
            { title: "10. Launch & hand off", text: "Run the checklist below, deploy, watch logs for the first hours, then hand the client documentation and access (they should own their accounts)." },
          ],
        },
        {
          type: "list",
          items: [
            "Every table has RLS enabled and policies tested with two different orgs; Supabase Security Advisor is clean.",
            "No secret has a `NEXT_PUBLIC_` prefix; the secret key is imported only from `server-only` modules.",
            "Production uses live keys everywhere (Clerk production instance, live Shopify store, production Supabase).",
            "Webhooks (Clerk, Shopify) point at the production domain and their signatures are verified.",
            "Server Actions and Route Handlers check `auth()` themselves — the proxy is not your only guard.",
            "`npm run build` passes locally; previews were tested on a phone (responsive) and with the keyboard (focus styles).",
            "Custom 404 and error pages, page titles/metadata, favicon, analytics if the client wants them.",
            "Rollback plan: you know how to Instant Rollback on Vercel and redeploy a previous Railway deployment.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Defence in depth",
          text: "Notice how many layers protect one invoice: Clerk authenticates, the proxy blocks anonymous visitors, the Server Action re-checks `auth()`, RLS filters rows in the database, and secrets never reach the browser. Any single layer can have a bug; together they make a breach unlikely.",
        },
        { type: "h", text: "What to learn next" },
        {
          type: "list",
          items: [
            "**Testing**: Vitest for logic, Playwright for end-to-end flows (sign in, request a quote), tests for your RLS policies.",
            "**CI/CD**: GitHub Actions running lint, type-check, tests and `supabase db push` on merge.",
            "**Observability**: Sentry, structured logs, OpenTelemetry traces across Vercel and Railway.",
            "**Queues & background jobs**: pg-boss, BullMQ, or hosted tools like Inngest and Trigger.dev.",
            "**Caching & performance** in Next.js: caching data and pages, revalidation, image optimisation, Core Web Vitals.",
            "**Payments**: Stripe Checkout, subscriptions and webhooks.",
            "**AI features**: calling LLM APIs (like the Claude API) from Route Handlers, streaming responses, tool use.",
            "**Security**: the OWASP Top 10, rate limiting your own endpoints, Québec's Law 25 obligations for personal data.",
          ],
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In this architecture, where should the Shopify `orders/create` webhook do its heavy processing?",
              options: [
                "Inside the webhook route before answering, however long it takes",
                "In the buyer's browser",
                "In the Railway worker, after the route has verified, stored the event and answered 200",
              ],
              answer: 2,
              why: "Webhook endpoints must answer fast. Verify, persist, acknowledge — then let a long-running worker do the slow work and retries.",
            },
            {
              q: "The proxy already blocks signed-out users from `/dashboard`. Do Server Actions still need to call `auth()`?",
              options: [
                "Yes — Server Actions are POST endpoints that can be called directly, so each must check auth itself",
                "No, the proxy covers everything",
                "Only in development",
              ],
              answer: 0,
              why: "Server Actions are reachable endpoints. Matchers can miss routes and refactors move things around: check `auth()` where the data is touched.",
            },
            {
              q: "Which variable is safe to expose to the browser?",
              options: ["`SUPABASE_SECRET_KEY`", "`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`", "`SHOPIFY_ADMIN_TOKEN`"],
              answer: 1,
              why: "The publishable key only identifies the project; RLS decides what it can read. The other two grant full access to data.",
            },
          ],
        },
      ],
    },
  ],
};
