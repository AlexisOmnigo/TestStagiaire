import type { Track } from "../types";

export const track: Track = {
  slug: "typescript",
  order: 7,
  title: "TypeScript",
  tagline: "JavaScript with a safety net that runs before your code does",
  outcome:
    "Type real app code with confidence: model data with unions and generics, use utility types, validate untrusted data at runtime boundaries, and configure TypeScript in a Next.js project.",
  badge: "TS",
  color: "#3178c6",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Why TypeScript
    // ─────────────────────────────────────────────────────────────
    {
      slug: "why-typescript",
      title: "Why TypeScript",
      summary: "A type checker on top of JavaScript: it reads your code before it runs, then disappears.",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "JavaScript happily runs code that is obviously wrong. It will let you read `invoice.totl` (a typo) and give you `undefined`. It will let you add a number to a string and give you `\"10015\"`. You find out when a client emails a screenshot, not when you write the bug.",
        },
        {
          type: "p",
          text: "**TypeScript** is JavaScript plus a description of the *shapes* of your values (types), and a program called the **type checker** that reads your code and complains when the shapes don't fit. Almost every valid JS file is valid TS. TypeScript adds syntax; it does not change how JavaScript behaves.",
        },
        {
          type: "compare",
          left: {
            label: "JavaScript — runs, silently wrong",
            lang: "js",
            code: `function invoiceTotal(invoice) {
  return invoice.subtotal + invoice.tax;
}

const inv = { subtotal: 100, taxes: 14.98 };
invoiceTotal(inv); // NaN — "tax" vs "taxes"
                   // nobody notices until prod`,
          },
          right: {
            label: "TypeScript — caught while typing",
            lang: "ts",
            code: `type Invoice = { subtotal: number; tax: number };

function invoiceTotal(invoice: Invoice): number {
  return invoice.subtotal + invoice.tax;
}

const inv = { subtotal: 100, taxes: 14.98 };
invoiceTotal(inv);
// ❌ Argument of type '{ subtotal: number;
//    taxes: number; }' is not assignable to
//    parameter of type 'Invoice'.
//    Property 'tax' is missing in type ...`,
          },
        },
        { type: "h", text: "Compile time vs runtime: types are erased" },
        {
          type: "p",
          text: "This is the single most important idea of the whole track. TypeScript works in two separate moments, and types only exist in the first one.",
        },
        {
          type: "steps",
          items: [
            {
              title: "You write .ts / .tsx",
              text: "Code plus type annotations like `amount: number` and declarations like `type Invoice = {...}`.",
            },
            {
              title: "Compile time: the checker reads it",
              text: "Your editor (live, as you type) or `tsc` analyses every expression. Mismatches become red squiggles / build errors. Nothing runs yet.",
            },
            {
              title: "Types are stripped",
              text: "A compiler (`tsc`, SWC in Next.js, esbuild, Node's built-in type stripping…) deletes every annotation and outputs plain JavaScript.",
            },
            {
              title: "Runtime: plain JS runs",
              text: "The browser or Node runs the JavaScript. There are no types left — no `Invoice`, no `number` checks. If bad data shows up now, TypeScript cannot stop it.",
            },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "How the run blocks in this track work",
          text: "The editable `run` blocks and challenges here use `lang: \"ts\"`: types are **stripped, not checked**, then the JS runs — exactly what happens at runtime. So a type error will *not* stop a run block. When we want to show what the checker would say, we use a read-only code block with a `// ❌ ...` comment containing the real compiler message.",
        },
        {
          type: "p",
          text: "Watch the erasure happen. The second call below would be a red squiggle in your editor (`\"100\"` is not a `number`), but once the types are gone, JavaScript runs it anyway and string concatenation wins:",
        },
        {
          type: "run",
          lang: "ts",
          code: `function withShipping(total: number): number {
  return total + 15;
}

console.log(withShipping(100));   // 115 — fine

// In your editor: ❌ Argument of type 'string' is not assignable to parameter of type 'number'.
// At runtime there are no types, so this runs:
console.log(withShipping("100" as any)); // "10015" 😬

// typeof checks are JavaScript, so they still work at runtime:
console.log(typeof withShipping);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "TypeScript trusts what you tell it",
          text: "Types describe what you *believe* the data is. Data coming from outside your code (form inputs, `fetch` responses, env variables, webhooks) is not checked at runtime just because you wrote a type for it. Lesson 8 is entirely about this.",
        },
        { type: "h", text: "What it actually buys you" },
        {
          type: "list",
          items: [
            "**Typos and missing properties** — `client.emial` is an error, not `undefined`.",
            "**`null` / `undefined` bugs** — with `strict` on, TS forces you to handle `user` possibly being `null` before you read `user.email`.",
            "**Wrong arguments** — swapped parameters, missing ones, a string where a number is expected.",
            "**Fearless refactors** — rename a field in a type and every place that uses it lights up. On a client project you haven't touched in six months, this is gold.",
            "**Autocomplete as documentation** — type `lead.` and your editor lists every field. You stop opening other files to remember shapes.",
            "**Missed cases** — add a new `status` to an order and TS points at every `switch` that forgot it (lesson 4).",
          ],
        },
        { type: "h", text: "Where TypeScript runs in your stack" },
        {
          type: "table",
          rows: [
            ["Tool", "Checks types?", "What it does"],
            ["Your editor (VS Code, Cursor…)", "Yes, live", "Runs the TS language server in the background: squiggles, autocomplete, rename, go-to-definition."],
            ["`tsc` (the TypeScript compiler)", "Yes", "`npx tsc --noEmit` checks the whole project without writing files — perfect for CI."],
            ["`next dev`", "No", "Compiles with SWC (strip + transform) for speed. Type errors show in your editor, not in the dev server."],
            ["`next build`", "Yes", "Runs a full type check and **fails the build** on type errors — so a Vercel deploy fails too."],
            ["Node 22.18+ / 24", "No", "Can run `.ts` files directly by stripping types (\"erasable syntax\" only, e.g. no `enum`)."],
            ["`tsx`, esbuild, Vite", "No", "Fast strippers/bundlers. Pair them with `tsc --noEmit` for actual checking."],
          ],
        },
        {
          type: "p",
          text: "Pattern to remember: **one tool checks, other tools strip.** Fast tools skip checking; the editor and `tsc` (or `next build`) do the checking.",
        },
        { type: "h", text: ".ts vs .tsx" },
        {
          type: "list",
          items: [
            "`.ts` — plain TypeScript: utilities, API route handlers (`route.ts`), Server Actions files, Supabase helpers, types.",
            "`.tsx` — TypeScript **plus JSX**: React components, `page.tsx`, `layout.tsx`. Only use it when the file contains JSX.",
            "Two syntax quirks in `.tsx`: the old `<Lead>value` cast syntax is not allowed (use `value as Lead`), and a generic arrow function needs a trailing comma `<T,>(x: T) => x` so it isn't read as a JSX tag.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "In a Next.js project",
          text: "`create-next-app` sets everything up: a `tsconfig.json`, a `next-env.d.ts` (generated, don't edit it) and the `@/` import alias. Next.js also generates types for your routes in `.next/types`, which is how it can tell you a page's `params` are wrong. Lesson 9 walks through the config.",
        },
        {
          type: "challenge",
          title: "Prices from a form are strings",
          lang: "ts",
          prompt:
            "A Québec client's quote form sends prices as text, sometimes with a decimal comma (`\"19,99\"`) and stray spaces. The type `(input: string) => number` documents the contract, but *you* still have to do the conversion at runtime. Write `toCents(input: string): number` that returns the price in integer cents: `\"19.99\"` → `1999`, `\"19,99\"` → `1999`, `\" 5 \"` → `500`.",
          starter: `function toCents(input: string): number {
  // The type says number... but is it really?
  return Number(input) * 100;
}`,
          solution: `function toCents(input: string): number {
  const normalized = input.trim().replace(",", ".");
  const dollars = Number(normalized);
  // Math.round fixes floating point noise: 19.99 * 100 = 1998.9999999999998
  return Math.round(dollars * 100);
}`,
          tests: [
            { name: 'toCents("19.99") is exactly 1999 (no floating point noise)', code: 'return toCents("19.99") === 1999;' },
            { name: 'toCents("19,99") handles the Québec decimal comma', code: 'return toCents("19,99") === 1999;' },
            { name: 'toCents(" 5 ") trims spaces → 500', code: 'return toCents(" 5 ") === 500;' },
            { name: "always returns an integer number", code: 'const r = toCents("0,10"); return typeof r === "number" && Number.isInteger(r) && r === 10;' },
          ],
          hint: "Three steps: `.trim()`, replace `,` with `.`, then `Math.round(Number(x) * 100)`. Floating point math makes `19.99 * 100` slightly less than 1999.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Your `Invoice` type says `total: number`, but an API returns `{ \"total\": \"42\" }`. What happens at runtime?",
              options: [
                "TypeScript throws a TypeError when the response arrives",
                "The value is automatically converted to the number 42",
                "Nothing special — `total` is the string \"42\"; types don't exist at runtime",
              ],
              answer: 2,
              why: "Types are erased before the code runs. TypeScript can only check what it can see at compile time; external data must be validated at runtime (lesson 8).",
            },
            {
              q: "Which command actually checks types (rather than just stripping them)?",
              options: ["`npx tsc --noEmit`", "`next dev`", "`node --experimental-strip-types app.ts`", "`npx tsx app.ts`"],
              answer: 0,
              why: "`tsc` is the type checker. `next dev`, Node's type stripping and `tsx` remove types for speed without checking them. `next build` also checks.",
            },
            {
              q: "Where should a React component with JSX live?",
              options: ["`Button.ts`", "`Button.tsx`", "`Button.d.ts`"],
              answer: 1,
              why: "JSX syntax is only allowed in `.tsx` files. `.d.ts` files contain only type declarations, no code.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Basic types & inference
    // ─────────────────────────────────────────────────────────────
    {
      slug: "basic-types",
      title: "Basic types & inference",
      summary: "Annotate where it helps, let inference do the rest, and know the difference between any and unknown.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "A **type annotation** is a colon after a name: `let total: number`. But you'll write far fewer annotations than you'd think, because TypeScript **infers** types from values. Good TypeScript code annotates the *edges* (function parameters, exported APIs, external data) and lets inference handle the middle.",
        },
        {
          type: "code",
          lang: "ts",
          title: "primitives",
          code: `let clientName: string = "Boulangerie Rivard";
let hours: number = 12.5;          // ints and floats are both number
let isPaid: boolean = false;
let big: bigint = 9007199254740993n;
let nothing: null = null;
let notSet: undefined = undefined;

// Inference: same types, less noise. Prefer this.
let projectName = "Site vitrine";  // string
let budget = 4500;                 // number

budget = "4500";
// ❌ Type 'string' is not assignable to type 'number'.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Lowercase types",
          text: "Use `string`, `number`, `boolean` — never `String`, `Number`, `Boolean` (those are the wrapper object types and almost never what you want).",
        },
        { type: "h", text: "Arrays and tuples" },
        {
          type: "code",
          lang: "ts",
          code: `const tags: string[] = ["seo", "ads"];
const scores: Array<number> = [92, 87];  // same thing, generic syntax

tags.push(42);
// ❌ Argument of type 'number' is not assignable to parameter of type 'string'.

// A tuple: fixed length, each position has its own type
const geo: [number, number] = [45.5019, -73.5674];      // lat, lng
const entry: [sku: string, qty: number] = ["MUG-01", 3]; // labelled positions

// Read-only arrays: no push/splice/sort-in-place
const provinces: readonly string[] = ["QC", "ON"];
provinces.push("BC");
// ❌ Property 'push' does not exist on type 'readonly string[]'.`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "You already use tuples",
          text: "React's `const [count, setCount] = useState(0)` returns a tuple: `[number, Dispatch<SetStateAction<number>>]`. That's why you can name the two parts whatever you want.",
        },
        { type: "h", text: "let vs const inference, and literal types" },
        {
          type: "p",
          text: "A **literal type** is a type with exactly one value: `\"draft\"`, `42`, `true`. TypeScript picks a literal type when the value cannot change, and a wider type when it can:",
        },
        {
          type: "table",
          rows: [
            ["Declaration", "Inferred type", "Why"],
            ["`let status = \"draft\"`", "`string`", "`let` can be reassigned to any string later"],
            ["`const status = \"draft\"`", "`\"draft\"`", "a `const` string can never be anything else"],
            ["`const lead = { status: \"new\" }`", "`{ status: string }`", "object properties are mutable, so they widen"],
            ["`const lead = { status: \"new\" } as const`", "`{ readonly status: \"new\" }`", "`as const` = deeply readonly + literal types"],
            ["`const ids = [1, 2]`", "`number[]`", "arrays can grow"],
            ["`const ids = [1, 2] as const`", "`readonly [1, 2]`", "a fixed tuple of literals"],
          ],
        },
        {
          type: "p",
          text: "Literal types become really useful when combined: `let status: \"draft\" | \"sent\" | \"paid\"` only accepts those three strings — and your editor autocompletes them. That's a **union**, which gets its own lesson. `as const` is the quick way to build one from real data:",
        },
        {
          type: "code",
          lang: "ts",
          code: `const PLANS = ["starter", "growth", "agency"] as const;
type Plan = (typeof PLANS)[number];   // "starter" | "growth" | "agency"

let plan: Plan = "growth";  // ✅
plan = "enterprise";
// ❌ Type '"enterprise"' is not assignable to type '"starter" | "growth" | "agency"'.`,
        },
        {
          type: "p",
          text: "One source of truth: the array exists at runtime (you can loop over it to render a `<select>`), and the type is derived from it at compile time. `(typeof PLANS)[number]` reads as \"the type of any element of PLANS\" — lesson 7 explains that syntax.",
        },
        {
          type: "run",
          lang: "ts",
          code: `const TAX_RATES = {
  QC: 0.14975, // GST 5% + QST 9.975%
  ON: 0.13,    // HST
  AB: 0.05,    // GST only
} as const;

type Province = keyof typeof TAX_RATES; // "QC" | "ON" | "AB"

function withTax(subtotal: number, province: Province): number {
  return Math.round(subtotal * (1 + TAX_RATES[province]) * 100) / 100;
}

console.log(withTax(1000, "QC")); // 1149.75
console.log(withTax(1000, "AB")); // 1050

// \`as const\` makes TAX_RATES.QC readonly — but ONLY for the checker:
// ❌ Cannot assign to 'QC' because it is a read-only property.
(TAX_RATES as any).QC = 0;      // ...still works at runtime!
console.log("QC after mutation:", TAX_RATES.QC);
console.log("Use Object.freeze if you need runtime protection.");`,
        },
        { type: "h", text: "any vs unknown" },
        {
          type: "p",
          text: "Both mean \"could be anything\", but they behave in opposite ways. `any` **turns off** the checker for that value — and everything it touches. `unknown` is the safe version: you can hold the value, but you must **prove** what it is before using it.",
        },
        {
          type: "compare",
          left: {
            label: "any — the checker gives up",
            lang: "ts",
            code: `const data: any = JSON.parse(body);

data.clinet.name.toUpperCase();
// no error... crashes at runtime

const total: number = data.total;
// no error, even if total is "42"
// any spreads silently through your code`,
          },
          right: {
            label: "unknown — prove it first",
            lang: "ts",
            code: `const data: unknown = JSON.parse(body);

data.client;
// ❌ 'data' is of type 'unknown'.

if (typeof data === "object" && data !== null
    && "total" in data
    && typeof data.total === "number") {
  const total: number = data.total; // ✅
}`,
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: "any is contagious",
          text: "Every value derived from an `any` is also `any`, so one `any` can quietly disable checking across a whole feature. Use `unknown` for \"I don't know yet\". With `strict` on, `catch (err)` gives you `err: unknown` for exactly this reason.",
        },
        {
          type: "list",
          items: [
            "`void` — a function returns nothing useful (`function log(msg: string): void`).",
            "`never` — a value that cannot exist: a function that always throws, or a branch that should be impossible (lesson 4 uses it).",
            "`null` and `undefined` — with `strictNullChecks` (part of `strict`), they are their own types and not allowed in a `string` unless you say `string | null`.",
            "`object` — any non-primitive. Rarely useful; describe the actual shape instead (next lesson).",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Prefer unions of literals over enum",
          text: "TypeScript has an `enum` keyword, but it generates runtime code, which means Node's type stripping and the `erasableSyntaxOnly` flag reject it. A union like `\"draft\" | \"sent\"` or an `as const` object gives you the same safety with zero runtime cost. Most modern codebases (and Supabase's generated types) use string unions.",
        },
        {
          type: "challenge",
          title: "Sum only the real numbers",
          lang: "ts",
          prompt:
            "A spreadsheet import gives you `unknown[]` — cells can be numbers, strings, `null`, `NaN`… Write `safeTotal(values: unknown[]): number` that adds up only the values that are actual **finite numbers** and ignores everything else.",
          starter: `function safeTotal(values: unknown[]): number {
  let total = 0;
  for (const v of values) {
    total += v as number; // "trust me" — but should we?
  }
  return total;
}`,
          solution: `function safeTotal(values: unknown[]): number {
  let total = 0;
  for (const v of values) {
    // typeof narrows unknown -> number; isFinite rules out NaN and Infinity
    if (typeof v === "number" && Number.isFinite(v)) {
      total += v;
    }
  }
  return total;
}`,
          tests: [
            { name: "[10, 20, 30] → 60", code: "return safeTotal([10, 20, 30]) === 60;" },
            { name: 'ignores strings and null: [10, "20", null, 5] → 15', code: 'return safeTotal([10, "20", null, 5]) === 15;' },
            { name: "ignores NaN and Infinity: [NaN, Infinity, 3] → 3", code: "return safeTotal([NaN, Infinity, 3]) === 3;" },
            { name: "empty array → 0", code: "return safeTotal([]) === 0;" },
          ],
          hint: "`v as number` is a lie the runtime doesn't care about. Narrow `unknown` with `typeof v === \"number\"`, then exclude `NaN`/`Infinity` with `Number.isFinite(v)`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What type does TypeScript infer for `const status = \"paid\"`?",
              options: ["`string`", "`\"paid\"`", "`any`", "`String`"],
              answer: 1,
              why: "A `const` primitive can never change, so TypeScript infers the literal type `\"paid\"`. With `let` it would widen to `string`.",
            },
            {
              q: "You receive a webhook payload and don't know its shape yet. Which type should you give it?",
              options: ["`any`", "`object`", "`{}`", "`unknown`"],
              answer: 3,
              why: "`unknown` forces you to check the value before using it. `any` disables checking entirely and spreads to everything derived from it.",
            },
            {
              q: "`const PLANS = [\"starter\", \"growth\"] as const` — what does `as const` change at runtime?",
              options: [
                "Nothing — it only changes the inferred type (readonly tuple of literals)",
                "It freezes the array like Object.freeze",
                "It converts the array into an enum",
              ],
              answer: 0,
              why: "`as const` is a type-level instruction that is erased like all types. Use `Object.freeze` if you need runtime immutability.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Objects
    // ─────────────────────────────────────────────────────────────
    {
      slug: "object-types",
      title: "Objects: type aliases & interfaces",
      summary: "Describe the shape of your data: optional and readonly fields, dictionaries, and composing types.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Most of the data in a client app is objects: a client, a lead, an invoice, a Shopify product. Describing those shapes once, and reusing the description everywhere, is where TypeScript pays for itself. There are two ways to name an object shape: a **type alias** and an **interface**.",
        },
        {
          type: "compare",
          left: {
            label: "type alias",
            lang: "ts",
            code: `type Client = {
  id: string;
  name: string;
  email?: string;              // optional
  readonly createdAt: string;  // can't be reassigned
};`,
          },
          right: {
            label: "interface",
            lang: "ts",
            code: `interface Client {
  id: string;
  name: string;
  email?: string;
  readonly createdAt: string;
}`,
          },
        },
        {
          type: "p",
          text: "For plain object shapes they're interchangeable. Using it is the same either way:",
        },
        {
          type: "code",
          lang: "ts",
          code: `const c: Client = { id: "c_1", name: "Voltix", createdAt: "2026-01-12" };

c.email;              // string | undefined — must be handled before use
c.email.toLowerCase();
// ❌ 'c.email' is possibly 'undefined'.
c.email?.toLowerCase(); // ✅ optional chaining

c.createdAt = "2026-02-01";
// ❌ Cannot assign to 'createdAt' because it is a read-only property.

const d: Client = { id: "c_2", name: "Intik" };
// ❌ Property 'createdAt' is missing in type '{ id: string; name: string; }' but required in type 'Client'.`,
        },
        {
          type: "list",
          items: [
            "`email?: string` means the property may be **absent** — reading it gives `string | undefined`.",
            "`readonly` is compile-time only and shallow: `readonly tags: string[]` stops reassigning `tags`, not `tags.push()` (use `readonly string[]` for that).",
            "Separate members with `;` or `,` — both work; `;` is the convention.",
          ],
        },
        { type: "h", text: "Structural typing: shape is what matters" },
        {
          type: "p",
          text: "In TypeScript, a value fits a type if it **has the right shape** — not because it was declared with that name. This is called *structural typing*, and it matches how JavaScript is actually used.",
        },
        {
          type: "run",
          lang: "ts",
          code: `type Contact = { name: string; email: string };

function emailLine(contact: Contact): string {
  return contact.name + " <" + contact.email + ">";
}

// Neither object was declared as Contact — they just have the right shape.
const lead = { name: "Marie Tremblay", email: "marie@cafe.ca", source: "meta" };
const client = { id: "c_9", name: "Studio Nord", email: "allo@studionord.ca", plan: "growth" };

console.log(emailLine(lead));    // ✅ extra fields are fine for variables
console.log(emailLine(client));  // ✅

// Passing an object LITERAL with extra fields is flagged (likely a typo):
// emailLine({ name: "Luc", email: "luc@x.ca", emial: "..." })
// ❌ Object literal may only specify known properties, and 'emial' does not exist in type 'Contact'.`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Excess property checks",
          text: "Extra properties are fine when you pass an existing variable, but an **object literal written inline** with unknown properties is an error — TypeScript assumes you made a typo. It's a targeted check, not a contradiction of structural typing.",
        },
        { type: "h", text: "Dictionaries: index signatures and Record" },
        {
          type: "p",
          text: "Sometimes the keys aren't known in advance: stock by SKU, totals by campaign id. Use an **index signature** or the built-in `Record<Keys, Value>` helper:",
        },
        {
          type: "code",
          lang: "ts",
          code: `type StockBySku = { [sku: string]: number };
type StockBySku2 = Record<string, number>;  // same thing, more common

const stock: StockBySku2 = { "MUG-01": 12, "TEE-BLK-M": 0 };
stock["CAP-02"] = 5;  // ✅ any string key

// With a union of keys, Record requires EVERY key:
type Province = "QC" | "ON" | "AB";
const shipping: Record<Province, number> = { QC: 12, ON: 15 };
// ❌ Property 'AB' is missing in type '{ QC: number; ON: number; }'
//    but required in type 'Record<Province, number>'.`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Record<string, X> lies a little",
          text: "`stock[\"NOPE\"]` is typed as `number`, but at runtime it's `undefined`. The `noUncheckedIndexedAccess` option (lesson 9) fixes this by typing it `number | undefined`.",
        },
        { type: "h", text: "Composing types: extends and &" },
        {
          type: "code",
          lang: "ts",
          code: `interface Timestamps { createdAt: string; updatedAt: string }

// interface: extends
interface Invoice extends Timestamps {
  id: string;
  clientId: string;
  amountCents: number;
  status: "draft" | "sent" | "paid";
}

// type: intersection with &  ("has everything from both")
type Lead = Timestamps & {
  id: string;
  email: string;
  source: "google" | "meta" | "referral";
};

// Nested shapes are just more types
type Order = {
  id: string;
  customer: { name: string; email: string };
  lines: { sku: string; qty: number; unitPriceCents: number }[];
};`,
        },
        { type: "h", text: "type or interface?" },
        {
          type: "table",
          rows: [
            ["", "type", "interface"],
            ["Object shapes", "✅", "✅"],
            ["Unions (`A | B`), tuples, primitives, mapped types", "✅", "❌ objects only"],
            ["Extending", "`&` intersection", "`extends` (clearer errors on conflicts)"],
            ["Declaration merging (re-open & add fields)", "❌", "✅ — used to augment library types"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Pick one, stay consistent",
          text: "A practical rule: use `type` by default (it does everything, and you'll need it for unions anyway), and use `interface` when you need `extends` hierarchies or to augment a library's types. Don't agonize — both compile to nothing.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Declaration merging in the wild",
          text: "Clerk lets you type your custom session claims by re-opening a global interface: `declare global { interface CustomJwtSessionClaims { metadata: { role?: \"admin\" | \"staff\" } } }`. That only works because interfaces merge.",
        },
        {
          type: "challenge",
          title: "Total quantity per SKU",
          lang: "ts",
          prompt:
            "Given the lines of several Shopify orders, return a dictionary of the total quantity per SKU. Write `qtyBySku(lines: OrderLine[]): Record<string, number>`. Don't mutate the input.",
          starter: `type OrderLine = { sku: string; qty: number };

function qtyBySku(lines: OrderLine[]): Record<string, number> {
  const result: Record<string, number> = {};
  // your code here
  return result;
}`,
          solution: `type OrderLine = { sku: string; qty: number };

function qtyBySku(lines: OrderLine[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const line of lines) {
    result[line.sku] = (result[line.sku] ?? 0) + line.qty;
  }
  return result;
}`,
          tests: [
            {
              name: "sums quantities of the same SKU",
              code: `const r = qtyBySku([{ sku: "MUG", qty: 2 }, { sku: "TEE", qty: 1 }, { sku: "MUG", qty: 3 }]);
return r.MUG === 5 && r.TEE === 1;`,
            },
            {
              name: "only contains SKUs that appear",
              code: `const r = qtyBySku([{ sku: "CAP", qty: 4 }]);
return Object.keys(r).length === 1 && r.CAP === 4;`,
            },
            { name: "empty list → empty object", code: "return Object.keys(qtyBySku([])).length === 0;" },
            {
              name: "does not mutate the input lines",
              code: `const lines = [{ sku: "MUG", qty: 2 }, { sku: "MUG", qty: 3 }];
qtyBySku(lines);
return lines[0].qty === 2 && lines[1].qty === 3 && lines.length === 2;`,
            },
          ],
          hint: "Loop over the lines. For each one, `result[line.sku] = (result[line.sku] ?? 0) + line.qty` — the `?? 0` handles the first time you see a SKU.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "With `type Client = { email?: string }`, what is the type of `client.email`?",
              options: ["`string`", "`string | null`", "`string | undefined`"],
              answer: 2,
              why: "An optional property may be absent, and reading an absent property gives `undefined`. (It is not `null` — null has to be written explicitly.)",
            },
            {
              q: "A function takes `{ email: string }`. You pass a variable holding `{ email: \"a@b.ca\", phone: \"514…\" }`. What happens?",
              options: [
                "It compiles — the object has the required shape (structural typing)",
                "Error — the object has an extra `phone` property",
                "Error — the variable wasn't declared with the parameter's type name",
              ],
              answer: 0,
              why: "TypeScript compares shapes, not names. Excess property errors only apply to object literals written inline.",
            },
            {
              q: "Which can ONLY be written with `type`, not `interface`?",
              options: [
                "`{ id: string; name: string }`",
                "A shape that extends another shape",
                "A shape with an optional property",
                "`\"draft\" | \"sent\" | \"paid\"`",
              ],
              answer: 3,
              why: "Interfaces only describe object shapes. Unions, tuples and other non-object types need a `type` alias.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Unions & narrowing
    // ─────────────────────────────────────────────────────────────
    {
      slug: "unions-and-narrowing",
      title: "Unions & narrowing",
      summary: "Model \"one of these\" values, let TypeScript follow your if-checks, and make impossible states impossible.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Real data is often *one of several things*: an id can be a string or a number, a payment can be by card or by Interac, a request can be loading, done or failed. A **union type** `A | B` says \"either A or B\". It's the feature that makes TypeScript genuinely better at modelling app state than most languages.",
        },
        {
          type: "code",
          lang: "ts",
          code: `type InvoiceId = string | number;
type Status = "draft" | "sent" | "paid" | "void";

function label(id: InvoiceId) {
  return id.toUpperCase();
  // ❌ Property 'toUpperCase' does not exist on type 'string | number'.
  //    Property 'toUpperCase' does not exist on type 'number'.
}`,
        },
        {
          type: "p",
          text: "With a union you can only use what is valid for **every** member. To do more, you **narrow**: you write a normal JavaScript check, and TypeScript understands that inside that branch the type is more specific. This is called *control flow analysis*.",
        },
        { type: "h", text: "The narrowing toolbox" },
        {
          type: "code",
          lang: "ts",
          code: `function label(id: string | number) {
  if (typeof id === "string") {
    return id.toUpperCase();      // id: string
  }
  return "#" + id.toFixed(0);     // id: number (the only option left)
}

// Truthiness / equality — great for null checks
function greet(name: string | null) {
  if (!name) return "Bonjour!";   // handles null AND ""
  return "Bonjour " + name;       // name: string
}

// "in" — checks for a property
type Card = { last4: string };
type Interac = { email: string };
function payLabel(p: Card | Interac) {
  return "last4" in p ? "Card •••• " + p.last4 : "Interac to " + p.email;
}

// instanceof — for classes (Date, Error, your own)
function toIso(d: Date | string) {
  return d instanceof Date ? d.toISOString() : d;
}

// Array.isArray
function asList(tags: string | string[]) {
  return Array.isArray(tags) ? tags : [tags];
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "typeof null === \"object\"",
          text: "A JavaScript classic: `typeof x === \"object\"` is also true for `null`. TypeScript knows this and will still complain that `x` is possibly `null` until you add `&& x !== null`.",
        },
        { type: "h", text: "Discriminated unions" },
        {
          type: "p",
          text: "The most useful pattern in this whole track. Give every variant of a union a shared property with a different **literal** value — the *discriminant* (often `status`, `type` or `kind`). Checking that one property narrows the whole object.",
        },
        {
          type: "compare",
          left: {
            label: "❌ Bag of optionals",
            lang: "ts",
            code: `type LeadsState = {
  isLoading: boolean;
  leads?: Lead[];
  error?: string;
};
// Allows nonsense:
// { isLoading: true, leads: [...], error: "x" }
// Every reader must guess which combo is valid.`,
          },
          right: {
            label: "✅ Discriminated union",
            lang: "ts",
            code: `type LeadsState =
  | { status: "loading" }
  | { status: "success"; leads: Lead[] }
  | { status: "error"; error: string };
// Each state carries exactly its own data.
// Impossible states can't be represented.`,
          },
        },
        {
          type: "code",
          lang: "ts",
          code: `function render(state: LeadsState) {
  state.leads;
  // ❌ Property 'leads' does not exist on type 'LeadsState'.
  //    Property 'leads' does not exist on type '{ status: "loading"; }'.

  switch (state.status) {
    case "loading":
      return "Loading…";
    case "success":
      return state.leads.length + " leads";  // state: { status: "success"; leads: Lead[] }
    case "error":
      return "Error: " + state.error;        // state: { status: "error"; error: string }
  }
}`,
        },
        { type: "h", text: "Exhaustiveness with never" },
        {
          type: "p",
          text: "Six months later someone adds `{ status: \"idle\" }`. Will every `switch` be updated? Make the compiler check it: in the `default` branch, every case has been handled, so the remaining type is `never` (\"no possible value\"). Assigning to `never` fails as soon as a case is missing.",
        },
        {
          type: "code",
          lang: "ts",
          code: `function assertNever(value: never): never {
  throw new Error("Unhandled case: " + JSON.stringify(value));
}

function render(state: LeadsState) {
  switch (state.status) {
    case "loading": return "Loading…";
    case "success": return state.leads.length + " leads";
    case "error":   return "Error: " + state.error;
    default:        return assertNever(state);
    // After adding { status: "idle" } to LeadsState:
    // ❌ Argument of type '{ status: "idle"; }' is not assignable to parameter of type 'never'.
  }
}`,
        },
        {
          type: "p",
          text: "Notice `assertNever` does two jobs: at **compile time** it flags missing cases; at **runtime** it throws if something unexpected sneaks in anyway (for example a status coming from an API that you haven't typed yet).",
        },
        {
          type: "run",
          lang: "ts",
          code: `type Payment =
  | { kind: "card"; last4: string; brand: "visa" | "mastercard" }
  | { kind: "interac"; email: string }
  | { kind: "invoice"; dueDays: number };

function describe(p: Payment): string {
  switch (p.kind) {
    case "card":
      return p.brand.toUpperCase() + " •••• " + p.last4;
    case "interac":
      return "Interac e-Transfer to " + p.email;
    case "invoice":
      return "Invoice, net " + p.dueDays;
    default: {
      const unreachable: never = p;
      throw new Error("Unknown payment: " + JSON.stringify(unreachable));
    }
  }
}

const payments: Payment[] = [
  { kind: "card", last4: "4242", brand: "visa" },
  { kind: "interac", email: "compta@voltix.ca" },
  { kind: "invoice", dueDays: 30 },
];
payments.forEach((p) => console.log(describe(p)));

// Data from outside can still break the rules at runtime:
try {
  describe({ kind: "crypto" } as any);
} catch (e) {
  console.log("Caught:", (e as Error).message);
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Supabase already returns a discriminated union",
          text: "`const { data, error } = await supabase.from(\"leads\").select()` is typed as *either* `{ data: Lead[]; error: null }` *or* `{ data: null; error: PostgrestError }`. That's why `if (error) throw error;` makes `data` non-null on the next line — narrowing on `error` narrows `data` too. Same pattern for Server Action results like `{ ok: true } | { ok: false; message: string }`.",
        },
        {
          type: "challenge",
          title: "Render a leads request",
          lang: "ts",
          prompt:
            "Write `statusMessage(state: LeadsState): string` for a dashboard widget: `idle` → `\"Click to load leads\"`, `loading` → `\"Loading…\"`, `success` → `\"No leads yet\"` / `\"1 lead\"` / `\"N leads\"`, `error` → `\"Error: \"` + the message. Any unknown status (bad data at runtime) must **throw** an Error — use the `assertNever` pattern.",
          starter: `type Lead = { id: string; email: string };
type LeadsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; leads: Lead[] }
  | { status: "error"; error: string };

function statusMessage(state: LeadsState): string {
  if (state.status === "loading") return "Loading…";
  return "Click to load leads";
}`,
          solution: `type Lead = { id: string; email: string };
type LeadsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; leads: Lead[] }
  | { status: "error"; error: string };

function assertNever(value: never): never {
  throw new Error("Unhandled state: " + JSON.stringify(value));
}

function statusMessage(state: LeadsState): string {
  switch (state.status) {
    case "idle":
      return "Click to load leads";
    case "loading":
      return "Loading…";
    case "success": {
      const n = state.leads.length;
      if (n === 0) return "No leads yet";
      return n === 1 ? "1 lead" : n + " leads";
    }
    case "error":
      return "Error: " + state.error;
    default:
      return assertNever(state);
  }
}`,
          tests: [
            { name: 'idle → "Click to load leads"', code: 'return statusMessage({ status: "idle" }) === "Click to load leads";' },
            { name: 'loading → "Loading…"', code: 'return statusMessage({ status: "loading" }) === "Loading…";' },
            {
              name: 'success pluralizes: 0 → "No leads yet", 1 → "1 lead", 3 → "3 leads"',
              code: `const l = { id: "l1", email: "a@b.ca" };
return statusMessage({ status: "success", leads: [] }) === "No leads yet"
  && statusMessage({ status: "success", leads: [l] }) === "1 lead"
  && statusMessage({ status: "success", leads: [l, l, l] }) === "3 leads";`,
            },
            { name: 'error → "Error: " + message', code: 'return statusMessage({ status: "error", error: "Network down" }) === "Error: Network down";' },
            {
              name: "an unknown status from bad data throws",
              code: `try { statusMessage({ status: "archived" }); return false; } catch (e) { return e instanceof Error; }`,
            },
          ],
          hint: "Use `switch (state.status)`. Inside `case \"success\"`, TypeScript knows `state.leads` exists. In `default`, call an `assertNever(state)` function that throws.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In `if (typeof x === \"string\") { ... } else { ... }` where `x: string | number`, what is `x` in the else branch?",
              options: ["`string | number`", "`number`", "`unknown`", "`never`"],
              answer: 1,
              why: "Control flow analysis removes `string` from the union in the else branch, leaving `number`.",
            },
            {
              q: "What makes a union \"discriminated\"?",
              options: [
                "Every variant has a common property with a different literal value (like `status: \"error\"`)",
                "It is declared with `interface` instead of `type`",
                "It contains `null`",
              ],
              answer: 0,
              why: "The shared literal property (the discriminant) lets one check — `state.status === \"error\"` — narrow the entire object to that variant.",
            },
            {
              q: "Why does `const x: never = state` in a `default` branch catch missing cases?",
              options: [
                "`never` throws an error at compile time automatically",
                "It makes the switch run every case",
                "If a case was forgotten, `state` still has that variant's type, which isn't assignable to `never`",
              ],
              answer: 2,
              why: "When every variant is handled, nothing is left and the type is `never`. A forgotten variant remains in the type, and assigning it to `never` is an error.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Typing functions
    // ─────────────────────────────────────────────────────────────
    {
      slug: "typing-functions",
      title: "Typing functions",
      summary: "Parameters, return types, optional and default values, callbacks, overloads and async functions.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Functions are the contracts of your codebase: callers rely on what goes in and what comes out. That's why function **parameters are the #1 place to annotate** — TypeScript can't guess what callers will pass. Return types can usually be inferred, but writing them on exported functions turns a silent change into a loud error.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// Parameters: always annotate. Return type: inferred here as number.
function lineTotal(unitPriceCents: number, qty: number) {
  return unitPriceCents * qty;
}

// Explicit return type: TS checks EVERY return path against it.
export function invoiceStatus(paidCents: number, totalCents: number): "unpaid" | "partial" | "paid" {
  if (paidCents === 0) return "unpaid";
  if (paidCents < totalCents) return "partial";
  return "paid";
}

// Arrow functions work the same way
const toDollars = (cents: number): string => (cents / 100).toFixed(2);

lineTotal(1999);
// ❌ Expected 2 arguments, but got 1.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "When to write the return type",
          text: "Annotate return types on exported functions, Server Actions and anything other files depend on. Inside a module, inference is fine. If you skip annotating a parameter, `strict` mode stops you: `Parameter 'qty' implicitly has an 'any' type.`",
        },
        { type: "h", text: "Optional, default and rest parameters" },
        {
          type: "code",
          lang: "ts",
          code: `// Optional: may be omitted -> type is string | undefined inside
function greet(name: string, company?: string) {
  return company ? \`Bonjour \${name} de \${company}\` : \`Bonjour \${name}\`;
}

// Default: may be omitted, but inside it's always a number (type inferred from the default)
function addTax(subtotal: number, rate = 0.14975) {
  return subtotal * (1 + rate);
}

// Options object: the idiomatic way past 2-3 parameters
function sendInvoice(id: string, opts: { cc?: string[]; remind?: boolean } = {}) {
  const { cc = [], remind = true } = opts;
  // ...
}

// Rest parameters are typed as an array
function sumCents(...amounts: number[]) {
  return amounts.reduce((a, b) => a + b, 0);
}`,
        },
        { type: "h", text: "Function types and callbacks" },
        {
          type: "p",
          text: "A function is a value, so it has a type too. The syntax looks like an arrow function: `(params) => ReturnType`. You'll write these for callbacks, event handlers and props like `onSave`.",
        },
        {
          type: "code",
          lang: "ts",
          code: `type Lead = { id: string; email: string; score: number };

type LeadFilter = (lead: Lead) => boolean;
type OnSave = (lead: Lead) => void;

const hot: LeadFilter = (lead) => lead.score >= 80;   // lead inferred as Lead

function filterLeads(leads: Lead[], keep: LeadFilter): Lead[] {
  return leads.filter(keep);
}

// Inline callbacks get their parameter types from context ("contextual typing"):
leads.map((lead) => lead.email);   // lead: Lead — no annotation needed`,
        },
        {
          type: "callout",
          tone: "info",
          title: "void means \"I won't use the result\"",
          text: "A callback typed `() => void` is *allowed* to return something — the caller just promises to ignore it. That's why `ids.forEach((id) => list.push(id))` compiles even though `push` returns a number. A function *declaration* with `: void`, however, may not return a value.",
        },
        { type: "h", text: "Overloads (the basics)" },
        {
          type: "p",
          text: "Sometimes the return type depends on the input type. **Overload signatures** list the allowed call shapes; one implementation handles them all. Use sparingly — a union or a generic (next lesson) is often simpler.",
        },
        {
          type: "code",
          lang: "ts",
          code: `function formatCents(cents: number): string;
function formatCents(cents: number[]): string[];
function formatCents(cents: number | number[]): string | string[] {
  const fmt = (c: number) => (c / 100).toFixed(2) + " $";
  return Array.isArray(cents) ? cents.map(fmt) : fmt(cents);
}

const one = formatCents(1999);         // string
const many = formatCents([1999, 500]); // string[]  — callers get precise types`,
        },
        { type: "h", text: "Async functions return Promise<T>" },
        {
          type: "code",
          lang: "ts",
          code: `type Client = { id: string; name: string };

async function getClient(id: string): Promise<Client | null> {
  const res = await fetch(\`/api/clients/\${id}\`);
  if (res.status === 404) return null;
  return res.json(); // ⚠️ res.json() is Promise<any> — see lesson 8
}

const client = getClient("c_1");
client.name;
// ❌ Property 'name' does not exist on type 'Promise<Client | null>'.
//    Did you forget to use 'await'?

const c = await getClient("c_1");  // Client | null
c?.name;                           // ✅`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Server Actions are just typed async functions",
          text: "In Next.js, a Server Action like `export async function createLead(formData: FormData): Promise<{ ok: true } | { ok: false; message: string }>` is an async function with a typed contract. The client component calling it gets autocomplete on the result — but `formData` itself is untrusted input (lesson 8).",
        },
        {
          type: "run",
          lang: "ts",
          code: `type Booking = { id: string; client: string; hours: number; rate: number };
type Rule = (b: Booking) => Booking;

// Callbacks with a named function type
const minimumTwoHours: Rule = (b) => ({ ...b, hours: Math.max(b.hours, 2) });
const loyaltyDiscount: Rule = (b) => (b.client === "Voltix" ? { ...b, rate: b.rate * 0.9 } : b);

function applyRules(booking: Booking, ...rules: Rule[]): Booking {
  return rules.reduce((acc, rule) => rule(acc), booking);
}

// Simulated async API call returning Promise<Booking[]>
function fetchBookings(): Promise<Booking[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve([
      { id: "b1", client: "Voltix", hours: 1, rate: 120 },
      { id: "b2", client: "Studio Nord", hours: 5, rate: 100 },
    ]), 100),
  );
}

const bookings = await fetchBookings();
for (const b of bookings) {
  const final = applyRules(b, minimumTwoHours, loyaltyDiscount);
  console.log(final.client, "→", final.hours * final.rate, "$");
}`,
        },
        {
          type: "challenge",
          title: "A configurable price formatter",
          lang: "ts",
          prompt:
            "Write `makePriceFormatter(options?: { locale?: string; currency?: string }): (cents: number) => string`. It **returns a function** that formats an amount in cents with `Intl.NumberFormat` (`style: \"currency\"`). Defaults: locale `\"fr-CA\"`, currency `\"CAD\"`. Each option can be given independently.",
          starter: `type FormatOptions = { locale?: string; currency?: string };

function makePriceFormatter(options?: FormatOptions): (cents: number) => string {
  return (cents) => String(cents / 100);
}`,
          solution: `type FormatOptions = { locale?: string; currency?: string };

function makePriceFormatter(
  { locale = "fr-CA", currency = "CAD" }: FormatOptions = {},
): (cents: number) => string {
  // Create the formatter once, reuse it for every call
  const nf = new Intl.NumberFormat(locale, { style: "currency", currency });
  return (cents) => nf.format(cents / 100);
}`,
          tests: [
            {
              name: "with no options: fr-CA + CAD",
              code: `const expected = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" }).format(19.99);
return makePriceFormatter()(1999) === expected;`,
            },
            {
              name: "returns a function",
              code: `return typeof makePriceFormatter() === "function";`,
            },
            {
              name: "both options: en-CA + USD",
              code: `const expected = new Intl.NumberFormat("en-CA", { style: "currency", currency: "USD" }).format(12.5);
return makePriceFormatter({ locale: "en-CA", currency: "USD" })(1250) === expected;`,
            },
            {
              name: "only currency given → locale still defaults to fr-CA",
              code: `const expected = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "EUR" }).format(1234.5);
return makePriceFormatter({ currency: "EUR" })(123450) === expected;`,
            },
          ],
          hint: "Destructure with defaults in the parameter: `({ locale = \"fr-CA\", currency = \"CAD\" }: FormatOptions = {})`. The trailing `= {}` handles calling it with no argument at all. Divide cents by 100 before formatting.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Inside `function addTax(subtotal: number, rate = 0.15)`, what is the type of `rate`?",
              options: ["`number | undefined`", "`0.15`", "`number`", "`any`"],
              answer: 2,
              why: "The default value guarantees a value inside the function, and its type is inferred (and widened) from the default: `number`. Callers may still omit it.",
            },
            {
              q: "`const c = getClient(\"c_1\"); c.name;` errors with \"Property 'name' does not exist on type 'Promise<Client>'\". Why?",
              options: [
                "The `await` is missing, so `c` is the Promise, not the client",
                "`Client` has no `name` property",
                "Async functions can't return objects",
              ],
              answer: 0,
              why: "An async function always returns a `Promise<T>`. You need `await` (or `.then`) to get the `T` out.",
            },
            {
              q: "What does a callback type `(lead: Lead) => void` tell the caller?",
              options: [
                "The callback must not contain a return statement",
                "The callback must return `undefined` explicitly",
                "The return value will be ignored, so any return is accepted",
              ],
              answer: 2,
              why: "For function *types*, `void` means \"the result won't be used\". That's why `forEach((x) => arr.push(x))` is fine even though `push` returns a number.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Generics
    // ─────────────────────────────────────────────────────────────
    {
      slug: "generics",
      title: "Generics",
      summary: "Write one function or type that works for many types without losing information.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Say you write a helper that returns the first item of an array. It should work for leads, invoices, products… What type do you give it?",
        },
        {
          type: "code",
          lang: "ts",
          code: `function firstAny(items: any[]): any { return items[0]; }
const a = firstAny(leads);       // any — autocomplete gone, typos allowed

function firstUnknown(items: unknown[]): unknown { return items[0]; }
const b = firstUnknown(leads);   // unknown — safe, but now you must re-check it's a Lead

// ✅ Generic: a type PARAMETER, filled in at each call
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const c = first(leads);          // Lead | undefined
const d = first(["QC", "ON"]);   // string | undefined
const e = first<number>([]);     // explicit: number | undefined`,
        },
        {
          type: "p",
          text: "`<T>` declares a **type variable**. Think of it as a parameter for types: when you call `first(leads)`, TypeScript sees a `Lead[]` argument, *infers* `T = Lead`, and the return type becomes `Lead | undefined`. The relationship \"what comes out is the same type as what goes in\" is preserved. You rarely write `<Lead>` explicitly — inference does it.",
        },
        {
          type: "callout",
          tone: "info",
          title: "You already use generics",
          text: "`Array<T>`, `Promise<T>`, `Map<K, V>`, `Set<T>`, `Record<K, V>`, React's `useState<T>()`, Supabase's `createClient<Database>()`. Every angle bracket you've seen is a generic type being given its type argument.",
        },
        { type: "h", text: "Constraints with extends" },
        {
          type: "p",
          text: "Sometimes the function needs *something* from `T`. `T extends { id: string }` means \"any type, as long as it has a string `id`\" — and the full type is still preserved.",
        },
        {
          type: "code",
          lang: "ts",
          code: `function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));  // item.id is allowed
}

const byId = indexById(invoices);   // Map<string, Invoice> — not Map<string, {id}>
byId.get("inv_42")?.amountCents;    // ✅ full Invoice type kept

indexById([1, 2, 3]);
// ❌ Type 'number' is not assignable to type '{ id: string; }'.

// Multiple type params + keyof (lesson 7): K must be a key of T
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}
const emails = pluck(leads, "email");  // string[]
pluck(leads, "emial");
// ❌ Argument of type '"emial"' is not assignable to parameter of type 'keyof Lead'.`,
        },
        { type: "h", text: "Generic types" },
        {
          type: "p",
          text: "Types can take parameters too. This is how you describe a wrapper whose *content* varies: an API response, a paginated list, a form state.",
        },
        {
          type: "code",
          lang: "ts",
          code: `type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
};

// Compose them
async function listInvoices(page: number): Promise<ApiResponse<Paginated<Invoice>>> { /* ... */ }

const res = await listInvoices(1);
if (res.ok) {
  res.data.items[0];   // Invoice (well, Invoice | undefined with noUncheckedIndexedAccess)
}

// Default type parameters, like default function parameters
type ActionResult<T = void> = { ok: true; data: T } | { ok: false; message: string };
type DeleteResult = ActionResult;           // data: void
type CreateResult = ActionResult<{ id: string }>;`,
        },
        {
          type: "run",
          lang: "ts",
          code: `type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

// A generic wrapper: whatever the async function returns, we keep its type.
async function safely<T>(fn: () => Promise<T>): Promise<ApiResponse<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

type Product = { id: string; title: string; priceCents: number };

const fakeShopify = (fail: boolean) =>
  new Promise<Product[]>((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error("Throttled (429)")) : resolve([
      { id: "gid://shopify/Product/1", title: "Tuque Omnigo", priceCents: 2999 },
      { id: "gid://shopify/Product/2", title: "Tasse TechGuys", priceCents: 1899 },
    ])), 50));

for (const fail of [false, true]) {
  const res = await safely(() => fakeShopify(fail)); // ApiResponse<Product[]>
  if (res.ok) {
    console.log("Products:", res.data.map((p) => p.title).join(", "));
  } else {
    console.log("Failed:", res.error);
  }
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Don't make everything generic",
          text: "A type parameter should *link* two things (input to output, or two inputs). If `T` appears only once — `function log<T>(x: T): void` — it adds nothing; `x: unknown` says the same. And in `.tsx` files, write generic arrows as `<T,>(x: T) => …` so the parser doesn't read `<T>` as a JSX tag.",
        },
        {
          type: "challenge",
          title: "A generic groupBy",
          lang: "ts",
          prompt:
            "Write `groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Record<K, T[]>`. It groups items into arrays by the key returned from `getKey`, keeping the original order inside each group. Don't mutate the input. (Modern runtimes ship `Object.groupBy` — write it yourself here to practice the types.)",
          starter: `function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  // your code here
  return groups;
}`,
          solution: `function groupBy<T, K extends string>(items: T[], getKey: (item: T) => K): Record<K, T[]> {
  const groups = {} as Record<K, T[]>;
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}`,
          tests: [
            {
              name: "groups leads by source, preserving order",
              code: `const leads = [
  { id: "1", source: "meta" },
  { id: "2", source: "google" },
  { id: "3", source: "meta" },
];
const g = groupBy(leads, (l) => l.source);
return g.meta.length === 2 && g.meta[0].id === "1" && g.meta[1].id === "3"
  && g.google.length === 1 && g.google[0].id === "2";`,
            },
            {
              name: "works with any item type (numbers → even/odd)",
              code: `const g = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? "even" : "odd"));
return JSON.stringify(g.odd) === "[1,3,5]" && JSON.stringify(g.even) === "[2,4]";`,
            },
            {
              name: "groups contain the original objects (same references)",
              code: `const a = { id: "a", tier: "gold" };
const g = groupBy([a], (x) => x.tier);
return g.gold[0] === a;`,
            },
            {
              name: "empty input → empty object, input not mutated",
              code: `const input = [{ id: "x", s: "k" }];
groupBy(input, (x) => x.s);
return Object.keys(groupBy([], () => "k")).length === 0 && input.length === 1 && input[0].id === "x";`,
            },
          ],
          hint: "Loop over items, compute `const key = getKey(item)`, then create the array if missing and push: `(groups[key] ??= []).push(item)`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Given `function first<T>(items: T[]): T | undefined`, what is the type of `first([42, 7])`?",
              options: ["`any`", "`unknown`", "`T`", "`number | undefined`"],
              answer: 3,
              why: "TypeScript infers `T = number` from the argument, so the return type `T | undefined` becomes `number | undefined`.",
            },
            {
              q: "What does `<T extends { id: string }>` mean?",
              options: [
                "T must be a class that extends another class",
                "T can be any type that has at least a string `id` property",
                "T is exactly `{ id: string }` and nothing more",
              ],
              answer: 1,
              why: "`extends` in a type parameter is a constraint: T must be assignable to `{ id: string }`, but it keeps all its other properties.",
            },
            {
              q: "Which declaration gets real value from being generic?",
              options: [
                "`function wrap<T>(value: T): { value: T }`",
                "`function log<T>(value: T): void`",
                "`function count<T>(n: number): number`",
              ],
              answer: 0,
              why: "In `wrap`, T links the input to the output type. In `log`, T appears once (use `unknown`), and in `count` it isn't used at all.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Utility & advanced types
    // ─────────────────────────────────────────────────────────────
    {
      slug: "utility-types",
      title: "Utility & advanced types",
      summary: "Derive new types from existing ones instead of copy-pasting: keyof, typeof, Pick, Omit, Partial, mapped types and satisfies.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Your `Client` type has 12 fields. The create form needs all of them except `id` and `createdAt`. The update form needs any subset. The list view needs only `id`, `name` and `status`. Copy-pasting three variants means they drift apart the day someone adds a field. Instead, **derive** types from one source of truth.",
        },
        { type: "h", text: "Type operators: keyof, typeof, indexed access" },
        {
          type: "code",
          lang: "ts",
          code: `type Client = {
  id: string;
  name: string;
  email: string;
  plan: "starter" | "growth" | "agency";
  createdAt: string;
};

type ClientKey = keyof Client;   // "id" | "name" | "email" | "plan" | "createdAt"
type Plan = Client["plan"];      // "starter" | "growth" | "agency"  (indexed access)

// typeof (in a type position) = "the type of this runtime value"
const defaultSettings = { theme: "dark", currency: "CAD", taxIncluded: false };
type Settings = typeof defaultSettings;
// { theme: string; currency: string; taxIncluded: boolean }

// Combine them: derive a union from a runtime array
const SOURCES = ["google", "meta", "referral"] as const;
type Source = (typeof SOURCES)[number];   // "google" | "meta" | "referral"`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Two different typeofs",
          text: "In normal code, `typeof x` is JavaScript and returns a string at runtime (`\"object\"`). After a colon or in a `type` declaration, `typeof x` is TypeScript and gives you x's *type* at compile time. Same keyword, two worlds.",
        },
        { type: "h", text: "The built-in utility types" },
        {
          type: "table",
          rows: [
            ["Utility", "Gives you", "Typical use"],
            ["`Partial<T>`", "every property optional", "update/patch payloads"],
            ["`Required<T>`", "every property required", "config after defaults are applied"],
            ["`Readonly<T>`", "every property readonly", "props, frozen config"],
            ["`Pick<T, K>`", "only keys K", "list views, public subsets"],
            ["`Omit<T, K>`", "all keys except K", "create payloads (no `id`, `createdAt`)"],
            ["`Record<K, V>`", "object with keys K, values V", "lookup tables, dictionaries"],
            ["`Exclude<U, X>` / `Extract<U, X>`", "remove / keep union members", "`Exclude<Status, \"void\">`"],
            ["`NonNullable<T>`", "T without null/undefined", "after a check"],
            ["`ReturnType<F>` / `Parameters<F>`", "a function's return / params tuple", "typing from a function you don't own"],
            ["`Awaited<T>`", "unwraps a Promise", "`Awaited<ReturnType<typeof getClient>>`"],
          ],
        },
        {
          type: "code",
          lang: "ts",
          code: `type NewClient = Omit<Client, "id" | "createdAt">;          // what the create form sends
type ClientUpdate = Partial<Omit<Client, "id" | "createdAt">>; // any subset of editable fields
type ClientListItem = Pick<Client, "id" | "name" | "plan">;
type ActivePlan = Exclude<Client["plan"], "starter">;          // "growth" | "agency"

async function getClient(id: string) {
  return { id, name: "Voltix", plan: "growth" as const };
}
type FetchedClient = Awaited<ReturnType<typeof getClient>>;
// { id: string; name: string; plan: "growth" }

function updateClient(id: string, patch: ClientUpdate) { /* ... */ }
updateClient("c_1", { plan: "agency" });  // ✅
updateClient("c_1", { id: "c_2" });
// ❌ Object literal may only specify known properties, and 'id' does not exist in type 'ClientUpdate'.`,
        },
        { type: "h", text: "Mapped types: how Partial is built" },
        {
          type: "p",
          text: "Utility types aren't magic — they're written in TypeScript with **mapped types**: loop over the keys of a type and produce a new property for each. You won't write these daily, but reading them demystifies library types.",
        },
        {
          type: "code",
          lang: "ts",
          code: `// "for each key K in keyof T, make an optional property of type T[K]"
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };   // "-" removes a modifier

// Your own: a form's error messages, one optional string per field
type FieldErrors<T> = { [K in keyof T]?: string };
type NewClientErrors = FieldErrors<NewClient>;
// { name?: string; email?: string; plan?: string }`,
        },
        { type: "h", text: "satisfies: check without widening" },
        {
          type: "p",
          text: "Annotating a constant (`const x: Type = …`) checks it but also **replaces** its type with the annotation, so you lose the precise literal info. `satisfies` (TS 4.9+) checks the value against a type while **keeping** the inferred type.",
        },
        {
          type: "compare",
          left: {
            label: "Annotation — checked, but widened",
            lang: "ts",
            code: `type Route = { path: string; auth: boolean };

const routes: Record<string, Route> = {
  dashboard: { path: "/dashboard", auth: true },
  pricing: { path: "/pricing", auth: false },
};

routes.dashbaord.path;
// no error! keys are just "string"
// -> crashes at runtime`,
          },
          right: {
            label: "satisfies — checked, precise",
            lang: "ts",
            code: `type Route = { path: string; auth: boolean };

const routes = {
  dashboard: { path: "/dashboard", auth: true },
  pricing: { path: "/pricing", auth: false },
} satisfies Record<string, Route>;

routes.dashbaord.path;
// ❌ Property 'dashbaord' does not exist.
//    Did you mean 'dashboard'?`,
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: "`as` is not `satisfies`",
          text: "`value as Lead` is a **type assertion**: it tells the checker \"trust me\" and checks almost nothing. It's how bad data sneaks in (`await res.json() as Lead`). Prefer annotations, `satisfies`, or real runtime validation. Reserve `as` for cases where you genuinely know more than the compiler.",
        },
        {
          type: "run",
          lang: "ts",
          code: `type Client = { id: string; name: string; email: string; plan: "starter" | "growth"; mrrCents: number };

// A runtime helper whose TYPE mirrors the Pick utility
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const out = {} as Pick<T, K>;
  for (const key of keys) out[key] = obj[key];
  return out;
}

const client: Client = { id: "c_1", name: "Voltix", email: "allo@voltix.ca", plan: "growth", mrrCents: 120000 };

// Public subset for a client portal — mrrCents is not exposed
const publicClient = pick(client, ["id", "name", "plan"]); // Pick<Client, "id" | "name" | "plan">
console.log(publicClient);

// satisfies keeps literal keys while checking each entry
const PLAN_LIMITS = {
  starter: { seats: 1, campaigns: 2 },
  growth: { seats: 5, campaigns: 20 },
} satisfies Record<Client["plan"], { seats: number; campaigns: number }>;

console.log("Voltix can run", PLAN_LIMITS[client.plan].campaigns, "campaigns");`,
        },
        {
          type: "challenge",
          title: "Apply a partial update safely",
          lang: "ts",
          prompt:
            "Write `applyPatch<T extends object>(record: T, patch: Partial<T>): T`. It returns a **new** object with the patch applied. Because `Partial<T>` allows `undefined` values (e.g. a form field left untouched), a key whose patch value is `undefined` must **not** overwrite the existing value. `null` is a real value (\"clear this field\") and must be applied.",
          starter: `function applyPatch<T extends object>(record: T, patch: Partial<T>): T {
  return { ...record, ...patch } as T;
}`,
          solution: `function applyPatch<T extends object>(record: T, patch: Partial<T>): T {
  const result = { ...record };
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const value = patch[key];
    if (value !== undefined) {
      result[key] = value as T[keyof T];
    }
  }
  return result;
}`,
          tests: [
            {
              name: "overwrites the fields present in the patch, keeps the others",
              code: `const r = applyPatch({ name: "Voltix", email: "a@voltix.ca", plan: "starter" }, { plan: "growth" });
return r.name === "Voltix" && r.email === "a@voltix.ca" && r.plan === "growth";`,
            },
            {
              name: "a key set to undefined does not erase the existing value",
              code: `const r = applyPatch({ name: "Voltix", phone: "514-555-0101" }, { phone: undefined });
return r.phone === "514-555-0101";`,
            },
            {
              name: "null is applied (it means: clear this field)",
              code: `const r = applyPatch({ name: "Voltix", phone: "514-555-0101" }, { phone: null });
return r.phone === null;`,
            },
            {
              name: "returns a new object and does not mutate the original",
              code: `const original = { name: "Voltix", plan: "starter" };
const r = applyPatch(original, { plan: "agency" });
return r !== original && original.plan === "starter";`,
            },
          ],
          hint: "Copy the record with `{ ...record }`, then loop over `Object.keys(patch)` and only assign when `patch[key] !== undefined`. You'll need `as (keyof T)[]` because `Object.keys` returns `string[]`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which type describes the payload to create a client (everything except `id` and `createdAt`)?",
              options: [
                "`Pick<Client, \"id\" | \"createdAt\">`",
                "`Partial<Client>`",
                "`Omit<Client, \"id\" | \"createdAt\">`",
                "`Exclude<Client, \"id\" | \"createdAt\">`",
              ],
              answer: 2,
              why: "`Omit` removes properties from an object type. `Pick` would keep only those two; `Exclude` works on union members, not object keys.",
            },
            {
              q: "What's the difference between `const x: Config = {...}` and `const x = {...} satisfies Config`?",
              options: [
                "Both check against Config, but `satisfies` keeps the more precise inferred type",
                "`satisfies` skips the check and only documents intent",
                "There is none; `satisfies` is just newer syntax",
              ],
              answer: 0,
              why: "An annotation replaces the value's type with `Config`. `satisfies` validates the value against `Config` but leaves its own (narrower) type in place.",
            },
            {
              q: "What is `Awaited<ReturnType<typeof getClient>>` when `getClient` is `async (id: string) => Client`?",
              options: ["`Promise<Client>`", "`Client`", "`(id: string) => Client`"],
              answer: 1,
              why: "`typeof getClient` is the function type, `ReturnType` gives `Promise<Client>`, and `Awaited` unwraps the Promise to `Client`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Types at runtime boundaries
    // ─────────────────────────────────────────────────────────────
    {
      slug: "runtime-validation",
      title: "Types at runtime boundaries",
      summary: "Types vanish at runtime, so validate external data with type guards and Zod before you trust it.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Inside your codebase, TypeScript checks that every piece fits. But data also arrives from **outside**: API responses, form submissions, URL params, environment variables, webhooks. The checker never sees that data — it only exists at runtime, when the types are already gone. Each of those entry points is a **boundary**, and it's where most production type bugs come from.",
        },
        {
          type: "code",
          lang: "ts",
          code: `type Lead = { id: string; email: string; budget: number };

const res = await fetch("/api/leads/42");
const lead = (await res.json()) as Lead;   // res.json() returns Promise<any>
// "as Lead" checks NOTHING. If the API sends { "budget": "5000" } or an
// error object { "message": "Not found" }, TypeScript still calls it a Lead.

lead.budget * 1.15;  // NaN or a crash, 3 functions later, far from the cause`,
        },
        {
          type: "p",
          text: "The fix is always the same idea: treat outside data as `unknown`, **check it at runtime once, at the edge**, and from then on the rest of the code can trust the type.",
        },
        {
          type: "list",
          items: [
            "Responses from third-party APIs (Shopify, Meta Ads, a client's legacy system).",
            "Request bodies in Route Handlers and the `FormData` of Server Actions — anyone can POST anything.",
            "URL `searchParams` and dynamic route `params` — always strings, and user-controlled.",
            "Environment variables — `process.env.X` is `string | undefined`, and may be missing on Vercel/Railway.",
            "Webhooks (Stripe, Clerk, Shopify), `localStorage`, `JSON.parse`, Postgres `jsonb` columns.",
          ],
        },
        { type: "h", text: "Type guards: x is T" },
        {
          type: "p",
          text: "A **type guard** is a function returning a boolean with a special return type `x is Lead`. It does a real runtime check, and tells the checker: \"if I return `true`, treat `x` as a `Lead`\".",
        },
        {
          type: "code",
          lang: "ts",
          code: `function isLead(x: unknown): x is Lead {
  return (
    typeof x === "object" && x !== null &&
    "id" in x && typeof x.id === "string" &&
    "email" in x && typeof x.email === "string" &&
    "budget" in x && typeof x.budget === "number"
  );
}

const data: unknown = await res.json();
if (isLead(data)) {
  data.budget;      // ✅ data: Lead
} else {
  data.budget;      // ❌ 'data' is of type 'unknown'.
}

// Assertion function: throws instead of returning false
function assertLead(x: unknown): asserts x is Lead {
  if (!isLead(x)) throw new Error("Invalid lead payload");
}
assertLead(data);
data.email;          // ✅ Lead from here on`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "A type guard is a promise you must keep",
          text: "TypeScript does not verify that your guard's body actually checks what `x is Lead` claims. A guard that returns `true` too easily is just an `as` cast in disguise. Test your guards — especially the rejection cases.",
        },
        {
          type: "run",
          lang: "ts",
          code: `type Lead = { id: string; email: string; budget: number };

function isLead(x: unknown): x is Lead {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.email === "string" && typeof o.budget === "number";
}

// Pretend this came from JSON.parse(webhookBody)
const payload: unknown[] = [
  { id: "l1", email: "marie@cafe.ca", budget: 5000 },
  { id: "l2", email: "luc@garage.ca", budget: "8000" }, // string budget!
  { message: "rate limited" },
  null,
];

// .filter with a type guard narrows the array: Lead[]
const leads = payload.filter(isLead);
console.log("Valid leads:", leads.length);
console.log("Pipeline total:", leads.reduce((sum, l) => sum + l.budget, 0), "$");

const rejected = payload.filter((x) => !isLead(x));
console.log("Rejected:", JSON.stringify(rejected));`,
        },
        { type: "h", text: "Zod: one schema, both worlds" },
        {
          type: "p",
          text: "Hand-written guards get long, and the type and the check can drift apart. **Zod** solves both: you write a *schema* (a runtime object that validates), and Zod **infers the TypeScript type from it**. One source of truth. It's the standard choice in the Next.js ecosystem (Server Actions, forms, env, tRPC, AI SDK tool inputs).",
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/schemas.ts (Zod 4)",
          code: `import { z } from "zod";

export const LeadSchema = z.object({
  id: z.string(),
  email: z.email(),                                 // Zod 4; v3 wrote z.string().email()
  source: z.enum(["google", "meta", "referral"]),
  budget: z.number().int().positive().optional(),
  createdAt: z.iso.datetime(),
});

// The type is DERIVED from the schema — never written twice
export type Lead = z.infer<typeof LeadSchema>;
// { id: string; email: string; source: "google" | "meta" | "referral";
//   budget?: number | undefined; createdAt: string }

// parse: returns typed data or THROWS a ZodError
const lead = LeadSchema.parse(await res.json());   // lead: Lead

// safeParse: never throws, returns a discriminated union
const result = LeadSchema.safeParse(body);
if (!result.success) {
  console.error(result.error.issues);   // [{ path: ["email"], message: "Invalid email address", ... }]
} else {
  result.data.source;                    // "google" | "meta" | "referral"
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "app/leads/actions.ts — validating a form in a Server Action",
          code: `"use server";
import { z } from "zod";

const LeadForm = z.object({
  email: z.email("Courriel invalide"),
  company: z.string().trim().min(1, "Requis"),
  budget: z.coerce.number().int().min(500),   // form values are strings -> coerce
});

export async function createLead(formData: FormData) {
  const parsed = LeadForm.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false as const, errors: z.flattenError(parsed.error).fieldErrors };
  }
  // parsed.data: { email: string; company: string; budget: number }
  // ...insert into Supabase
  return { ok: true as const };
}`,
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/env.ts — fail fast on missing env vars",
          code: `import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SHOPIFY_ADMIN_TOKEN: z.string().startsWith("shpat_"),
});

// Throws at startup with a clear message instead of a mysterious 500 later
export const env = EnvSchema.parse(process.env);
env.SHOPIFY_ADMIN_TOKEN;   // string (not string | undefined)`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where the boundaries are in your stack",
          text: "Validate in: Server Actions and Route Handlers (request input), webhook handlers (Clerk, Shopify — verify the signature *and* the shape), and anywhere you call a third-party API without generated types. Supabase queries are already typed from your schema (lesson 9), so you don't re-validate rows — but a `jsonb` column comes back as `Json`, which you still have to parse.",
        },
        {
          type: "challenge",
          title: "Write isLead by hand",
          lang: "ts",
          prompt:
            "Write a type guard `isLead(x: unknown): x is Lead` for the type below. It must return `true` only if: `x` is a non-null object, `id` is a string, `email` is a string containing `@`, `source` is one of `\"google\"`, `\"meta\"`, `\"referral\"`, and `budget` is either absent/undefined or a finite number.",
          starter: `type Lead = {
  id: string;
  email: string;
  source: "google" | "meta" | "referral";
  budget?: number;
};

function isLead(x: unknown): x is Lead {
  return typeof x === "object" && x !== null;
}`,
          solution: `type Lead = {
  id: string;
  email: string;
  source: "google" | "meta" | "referral";
  budget?: number;
};

const SOURCES: readonly string[] = ["google", "meta", "referral"];

function isLead(x: unknown): x is Lead {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" && o.email.includes("@") &&
    typeof o.source === "string" && SOURCES.includes(o.source) &&
    (o.budget === undefined || (typeof o.budget === "number" && Number.isFinite(o.budget)))
  );
}`,
          tests: [
            {
              name: "accepts a complete lead",
              code: 'return isLead({ id: "l1", email: "marie@cafe.ca", source: "meta", budget: 5000 }) === true;',
            },
            {
              name: "accepts a lead without the optional budget",
              code: 'return isLead({ id: "l2", email: "luc@garage.ca", source: "referral" }) === true;',
            },
            {
              name: "rejects null, strings, arrays and empty objects",
              code: 'return [null, undefined, "lead", [], {}].every((x) => isLead(x) === false);',
            },
            {
              name: 'rejects an unknown source ("tiktok") and an email without @',
              code: `return isLead({ id: "l3", email: "a@b.ca", source: "tiktok" }) === false
  && isLead({ id: "l4", email: "not-an-email", source: "google" }) === false;`,
            },
            {
              name: 'rejects a budget sent as a string ("5000") or NaN',
              code: `return isLead({ id: "l5", email: "a@b.ca", source: "google", budget: "5000" }) === false
  && isLead({ id: "l6", email: "a@b.ca", source: "google", budget: NaN }) === false;`,
            },
          ],
          hint: "First rule out non-objects and `null`. Then cast to `Record<string, unknown>` so you can read properties, and check each one with `typeof`. For `source`, check membership in an array of allowed values. For `budget`: `o.budget === undefined || (typeof o.budget === \"number\" && Number.isFinite(o.budget))`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `const lead = (await res.json()) as Lead` verify at runtime?",
              options: [
                "That every required property of Lead exists",
                "That the response is valid JSON and matches Lead",
                "That the HTTP status is 200",
                "Nothing about the shape — `as` only changes the compile-time type",
              ],
              answer: 3,
              why: "Type assertions are erased. `res.json()` only checks that the body is valid JSON; nothing checks it's a Lead.",
            },
            {
              q: "Why is `z.infer<typeof LeadSchema>` better than writing a `Lead` type next to the schema by hand?",
              options: [
                "It's faster at runtime",
                "The type is derived from the validator, so they can never drift apart",
                "Hand-written types are not allowed with Zod",
              ],
              answer: 1,
              why: "One source of truth: change the schema and the type follows. Two hand-maintained definitions eventually disagree.",
            },
            {
              q: "In a Server Action, a form field `budget` arrives as `\"5000\"`. Which Zod schema turns it into a number?",
              options: ["`z.coerce.number()`", "`z.number()`", "`z.string().number()`"],
              answer: 0,
              why: "`FormData` values are strings. `z.number()` would reject `\"5000\"`; `z.coerce.number()` converts it with `Number()` first, then validates.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 9. tsconfig & TS in real projects
    // ─────────────────────────────────────────────────────────────
    {
      slug: "typescript-in-real-projects",
      title: "tsconfig & TS in real projects",
      summary: "Read a Next.js tsconfig, turn on the flags that catch real bugs, and use generated and third-party types.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Every TypeScript project has a `tsconfig.json`: it tells the checker which files belong to the project and **how strict** to be. You'll rarely write one from scratch — `create-next-app` generates it — but you need to read it, and a few flags make a big difference.",
        },
        {
          type: "code",
          lang: "json",
          title: "tsconfig.json (typical Next.js app, annotated)",
          code: `{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],  // which built-in APIs exist (DOM + modern JS)
    "allowJs": true,                            // .js files allowed alongside .ts
    "skipLibCheck": true,                       // don't type-check node_modules' .d.ts (faster)
    "strict": true,                             // ⭐ the important one
    "noUncheckedIndexedAccess": true,           // ⭐ worth adding (not default)
    "noEmit": true,                             // tsc only checks; Next.js/SWC does the compiling
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",              // resolve imports the way bundlers do
    "resolveJsonModule": true,                  // import data from "./x.json"
    "isolatedModules": true,                    // each file must compile alone (needed by SWC)
    "jsx": "react-jsx",                         // Next.js sets this for you
    "incremental": true,
    "plugins": [{ "name": "next" }],            // Next-specific checks in your editor
    "paths": { "@/*": ["./*"] }                 // import from "@/lib/supabase"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,
        },
        { type: "h", text: "strict: one flag, many checks" },
        {
          type: "p",
          text: "`\"strict\": true` turns on a family of checks. Never turn it off on a new project — without it, TypeScript misses the most common bugs (`null` access, implicit `any`). New strict checks added in future TS versions are enabled automatically too.",
        },
        {
          type: "table",
          rows: [
            ["Flag", "What it catches"],
            ["`strictNullChecks`", "Using a value that may be `null`/`undefined` (`user.email` when `user` can be `null`)"],
            ["`noImplicitAny`", "Parameters/variables that silently fall back to `any`"],
            ["`useUnknownInCatchVariables`", "`catch (e)` gives `e: unknown`, not `any` — you must check it's an `Error`"],
            ["`strictFunctionTypes`", "Passing callbacks with incompatible parameter types"],
            ["`strictPropertyInitialization`", "Class fields that are never assigned"],
            ["`noUncheckedIndexedAccess` *(extra)*", "`arr[i]` and `record[key]` include `| undefined`"],
            ["`exactOptionalPropertyTypes` *(extra)*", "Distinguishes \"absent\" from \"explicitly `undefined`\""],
            ["`noFallthroughCasesInSwitch` *(extra)*", "A `case` that forgets to `break`/`return`"],
          ],
        },
        { type: "h", text: "noUncheckedIndexedAccess" },
        {
          type: "p",
          text: "By default, TypeScript assumes array indexes and dictionary lookups always hit something. That's false, and it's one of the most common crashes in real apps:",
        },
        {
          type: "compare",
          left: {
            label: "Default — optimistic",
            lang: "ts",
            code: `const leads: Lead[] = [];
const top = leads[0];      // Lead  (it's undefined!)
top.email;                 // compiles, crashes

const rates: Record<string, number> = { QC: 0.14975 };
const r = rates["BC"];     // number (it's undefined!)
total * r;                 // NaN`,
          },
          right: {
            label: "noUncheckedIndexedAccess — honest",
            lang: "ts",
            code: `const leads: Lead[] = [];
const top = leads[0];      // Lead | undefined
top.email;
// ❌ 'top' is possibly 'undefined'.
top?.email;                // ✅

const r = rates["BC"];     // number | undefined
if (r === undefined) throw new Error("No rate");
total * r;                 // ✅ number`,
          },
        },
        {
          type: "run",
          lang: "ts",
          code: `const leads: { email: string }[] = [];
const rates: Record<string, number> = { QC: 0.14975, ON: 0.13 };

// What the types claim vs what the runtime actually does:
console.log("leads[0]:", leads[0]);          // undefined
console.log("rates.BC:", rates["BC"]);       // undefined
console.log("1000 * rates.BC:", 1000 * (rates["BC"] as number)); // NaN

// Plain objects also inherit keys from Object.prototype!
const key = "toString";
console.log("rates.toString is a", typeof rates[key]);    // "function" — not a number
console.log("own key?", Object.hasOwn(rates, key));       // false — the safe check`,
        },
        { type: "h", text: "Path aliases: @/" },
        {
          type: "code",
          lang: "ts",
          code: `// Without an alias, deep files get fragile relative imports:
import { createClient } from "../../../lib/supabase/server";

// With "paths": { "@/*": ["./*"] } (or ["./src/*"] if you use a src/ folder):
import { createClient } from "@/lib/supabase/server";`,
        },
        {
          type: "callout",
          tone: "info",
          title: "paths is for the checker",
          text: "`paths` tells *TypeScript* how to resolve `@/…`. The tool that runs your code must understand it too: Next.js reads it from `tsconfig.json` automatically; a plain Node script does not (use relative imports there, or Node's own `\"imports\"` field in `package.json` with `#` aliases).",
        },
        { type: "h", text: "Declaration files and @types" },
        {
          type: "list",
          items: [
            "A **`.d.ts`** file contains only types, no code. It describes JavaScript that lives elsewhere. Libraries ship them so you get types for their JS.",
            "Most modern packages bundle their own types (`zod`, `@supabase/supabase-js`, `@clerk/nextjs`, `next`). Nothing to install.",
            "Older JS-only packages have community types on **DefinitelyTyped**, installed as dev dependencies: `npm i -D @types/node @types/react`.",
            "No types at all? Write a minimal `declare module \"legacy-lib\";` in a `types.d.ts` file to silence the error, or type just what you use.",
            "`skipLibCheck: true` skips checking `.d.ts` files in `node_modules` — faster builds, and avoids errors in libraries you can't fix.",
          ],
        },
        {
          type: "code",
          lang: "ts",
          title: "types/globals.d.ts — augmenting existing types",
          code: `export {}; // makes this file a module, which "declare global" requires

declare global {
  // Type your env vars (complements runtime validation with Zod)
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      SHOPIFY_ADMIN_TOKEN: string;
    }
  }

  // Clerk: type the custom claims you put in the session token
  interface CustomJwtSessionClaims {
    metadata: { role?: "admin" | "staff" | "client" };
  }
}`,
        },
        { type: "h", text: "Generated types: let the database write them" },
        {
          type: "p",
          text: "The best types are the ones you don't write. If a tool knows your schema, have it **generate** the TypeScript. With Supabase, the CLI reads your Postgres tables and outputs a `Database` type:",
        },
        {
          type: "code",
          lang: "bash",
          code: `# regenerate after every migration (add it as an npm script)
npx supabase gen types typescript --project-id "$PROJECT_REF" > lib/database.types.ts`,
        },
        {
          type: "code",
          lang: "ts",
          title: "lib/supabase.ts",
          code: `import { createClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert } from "@/lib/database.types";

const supabase = createClient<Database>(url, anonKey);

type Lead = Tables<"leads">;              // a row, exactly as in Postgres
type NewLead = TablesInsert<"leads">;     // defaults/nullable columns become optional

const { data, error } = await supabase.from("leads").select("id, email, status");
// data: { id: string; email: string; status: "new" | "won" | "lost" }[] | null
// (Postgres enums become string unions; a typo in "id, emial" is a type error)`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Same idea across the stack",
          text: "Shopify's GraphQL Admin API: `@shopify/api-codegen-preset` generates types from your queries. Next.js generates route types so `PageProps<\"/clients/[id]\">` knows your params. Wire `\"typecheck\": \"tsc --noEmit\"` into CI (GitHub Actions) so type errors block the merge, not just the Vercel build.",
        },
        { type: "h", text: "Preview: typing React props" },
        {
          type: "p",
          text: "Everything from this track applies directly to React components (next track). Props are just an object type; a union of literals becomes a `variant` prop; `children` has the type `React.ReactNode`.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "components/Button.tsx",
          code: `import type { ComponentProps, ReactNode } from "react";

type ButtonProps = {
  variant?: "primary" | "ghost";
  children: ReactNode;
} & ComponentProps<"button">;   // + every native <button> prop (onClick, disabled, type…)

export function Button({ variant = "primary", children, ...rest }: ButtonProps) {
  return <button className={variant === "primary" ? "bg-blue-600" : "bg-transparent"} {...rest}>{children}</button>;
}

// <Button variant="danger">  ❌ Type '"danger"' is not assignable to type '"primary" | "ghost" | undefined'.

// app/clients/[id]/page.tsx — in Next.js 15+, params is a Promise
export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}`,
        },
        {
          type: "challenge",
          title: "A tax lookup that can't silently fail",
          lang: "ts",
          prompt:
            "Write `taxFor(province: string, subtotal: number): number` using `TAX_RATES`. Return the tax amount rounded to cents (e.g. `taxFor(\"ON\", 200)` → `26`). Think like `noUncheckedIndexedAccess`: a lookup may miss. If the province isn't an **own** key of `TAX_RATES`, throw an Error whose message includes the province — and beware of inherited keys like `\"toString\"`.",
          starter: `const TAX_RATES: Record<string, number> = { QC: 0.14975, ON: 0.13, AB: 0.05 };

function taxFor(province: string, subtotal: number): number {
  const rate = TAX_RATES[province]; // the type says number... always?
  return Math.round(subtotal * rate * 100) / 100;
}`,
          solution: `const TAX_RATES: Record<string, number> = { QC: 0.14975, ON: 0.13, AB: 0.05 };

function taxFor(province: string, subtotal: number): number {
  // Object.hasOwn ignores inherited keys like "toString" or "constructor"
  const rate = Object.hasOwn(TAX_RATES, province) ? TAX_RATES[province] : undefined;
  if (rate === undefined) {
    throw new Error("Unknown province: " + province);
  }
  return Math.round(subtotal * rate * 100) / 100;
}`,
          tests: [
            { name: 'taxFor("ON", 200) → 26', code: 'return taxFor("ON", 200) === 26;' },
            { name: 'taxFor("QC", 1000) → 149.75 (rounded to cents)', code: 'return taxFor("QC", 1000) === 149.75;' },
            {
              name: 'unknown province "BC" throws an Error mentioning "BC"',
              code: `try { taxFor("BC", 100); return false; } catch (e) { return e instanceof Error && e.message.includes("BC"); }`,
            },
            {
              name: 'inherited keys like "toString" are not provinces (throws)',
              code: `try { taxFor("toString", 100); return false; } catch (e) { return e instanceof Error; }`,
            },
          ],
          hint: "`TAX_RATES[province]` is `undefined` for missing keys — and a *function* for `\"toString\"`. Guard with `Object.hasOwn(TAX_RATES, province)` and throw before doing math.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "With `noUncheckedIndexedAccess` on, what is the type of `leads[0]` when `leads: Lead[]`?",
              options: ["`Lead`", "`Lead[]`", "`Lead | undefined`", "`unknown`"],
              answer: 2,
              why: "The array might be empty or the index out of range, so the flag adds `| undefined` to every index access, forcing you to handle the miss.",
            },
            {
              q: "You import `@/lib/utils` in a Next.js app. What makes `@/` work?",
              options: [
                "The `paths` option in tsconfig.json, which Next.js also reads when bundling",
                "Node.js resolves `@/` to the project root by default",
                "An npm package named `@`",
              ],
              answer: 0,
              why: "`paths` maps `@/*` to a folder for the type checker, and Next.js reads the same config for its bundler. Plain Node does not.",
            },
            {
              q: "Where should the TypeScript types for your Supabase tables come from?",
              options: [
                "Hand-written types copied from the dashboard",
                "`supabase gen types typescript`, regenerated after each migration",
                "`@types/supabase` from DefinitelyTyped",
                "`any`, since the database is outside TypeScript",
              ],
              answer: 1,
              why: "Generated types come straight from your real schema, so they stay correct as long as you regenerate after migrations. Pass them to `createClient<Database>()`.",
            },
          ],
        },
      ],
    },
  ],
};
