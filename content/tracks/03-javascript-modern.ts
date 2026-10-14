import type { Track } from "../types";

export const track: Track = {
  slug: "javascript-modern",
  order: 3,
  title: "Modern JavaScript",
  tagline: "The ES2015+ syntax every React and Next.js file is made of",
  outcome:
    "Read and write idiomatic modern JavaScript: array pipelines, destructuring, spread and immutable updates, optional chaining, modules, classes, solid error handling and locale-aware formatting for Québec clients.",
  badge: "ES+",
  color: "#fbbf24",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Array methods
    // ─────────────────────────────────────────────────────────────
    {
      slug: "array-methods",
      title: "map, filter, reduce & friends",
      summary: "Transform lists by describing *what* you want instead of writing loops — the way every React list is built.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "A `for` loop tells the computer **how** to walk through a list: create a counter, check the length, push into a result. Array methods let you say **what** you want instead: *keep the paid invoices*, *turn each one into a total*, *add them up*. The code reads like the business rule, and — just as important — these methods return **new arrays** instead of modifying the original. That second property is exactly what React needs, so you'll see `.map()` and `.filter()` in nearly every component you open.",
        },
        {
          type: "compare",
          left: {
            label: "Loop: how",
            lang: "js",
            code: `let paidTotal = 0;
for (let i = 0; i < invoices.length; i++) {
  if (invoices[i].status === "paid") {
    paidTotal += invoices[i].amount;
  }
}`,
          },
          right: {
            label: "Methods: what",
            lang: "js",
            code: `const paidTotal = invoices
  .filter((inv) => inv.status === "paid")
  .reduce((sum, inv) => sum + inv.amount, 0);`,
          },
        },
        { type: "h", text: "The big three" },
        {
          type: "list",
          items: [
            "`map(fn)` — same length, each item **transformed**. 5 invoices in → 5 somethings out.",
            "`filter(fn)` — same items, **fewer of them**. Keeps those where `fn` returns a truthy value.",
            "`reduce(fn, initial)` — **boils the list down** to one value: a total, an object, a count, anything.",
          ],
        },
        {
          type: "run",
          title: "invoices.js",
          code: `const invoices = [
  { id: "INV-101", client: "Café Nordik", amount: 2400, status: "paid" },
  { id: "INV-102", client: "Studio Érable", amount: 850, status: "overdue" },
  { id: "INV-103", client: "Clinique Boréale", amount: 1200, status: "paid" },
  { id: "INV-104", client: "Café Nordik", amount: 3100, status: "draft" },
  { id: "INV-105", client: "Toitures Laurier", amount: 640, status: "overdue" },
];

// map: one output per input
const ids = invoices.map((inv) => inv.id);
console.log("ids:", ids);

// map to new objects (the ... is "spread", see lesson 3)
const withTax = invoices.map((inv) => ({
  ...inv,
  totalWithTax: Math.round(inv.amount * 1.14975 * 100) / 100, // GST + QST
}));
console.log("first with tax:", withTax[0]);

// filter: keep some
const overdue = invoices.filter((inv) => inv.status === "overdue");
console.log("overdue:", overdue.map((inv) => inv.client));

// reduce: boil down to one number...
const paidTotal = invoices
  .filter((inv) => inv.status === "paid")
  .reduce((sum, inv) => sum + inv.amount, 0);
console.log("paid total:", paidTotal);

// ...or to an object: total billed per client
const perClient = invoices.reduce((acc, inv) => {
  acc[inv.client] = (acc[inv.client] ?? 0) + inv.amount;
  return acc;
}, {});
console.log("per client:", perClient);

console.log("original untouched:", invoices.length, "invoices");`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Always give reduce a starting value",
          text: "`[].reduce((sum, x) => sum + x)` throws `TypeError: Reduce of empty array with no initial value`. With `reduce(fn, 0)` an empty list simply gives `0`. Filters often produce empty arrays, so this bites in production, not in your demo data.",
        },
        { type: "h", text: "Finding and checking" },
        {
          type: "table",
          rows: [
            ["Method", "Returns", "Use it to…"],
            ["`find(fn)`", "first matching item or `undefined`", "get one client by id"],
            ["`findIndex(fn)`", "index or `-1`", "know *where* the item is"],
            ["`findLast(fn)`", "last matching item or `undefined`", "get the most recent payment"],
            ["`some(fn)`", "`true` if at least one matches", "\"is anything overdue?\""],
            ["`every(fn)`", "`true` if all match", "\"are all line items valid?\""],
            ["`includes(value)`", "`true` / `false`", "check a simple value in a list of strings/numbers"],
            ["`at(i)`", "item at index, negatives count from the end", "`list.at(-1)` for the last item"],
          ],
        },
        {
          type: "run",
          code: `const leads = [
  { id: 1, name: "Julie Tremblay", source: "google", score: 72 },
  { id: 2, name: "Marc Gagnon", source: "meta", score: 35 },
  { id: 3, name: "Sofia Roy", source: "referral", score: 90 },
];

console.log(leads.find((l) => l.id === 3));     // the whole object
console.log(leads.find((l) => l.id === 99));    // undefined — handle it!
console.log(leads.some((l) => l.score > 80));   // true
console.log(leads.every((l) => l.score > 50));  // false
console.log(["google", "meta"].includes("tiktok")); // false
console.log(leads.at(-1).name);                 // last lead

// Gotcha: every() on an empty list is true ("nothing failed")
console.log([].every((l) => l.score > 50));     // true`,
        },
        { type: "h", text: "flatMap: lists inside lists" },
        {
          type: "p",
          text: "Orders contain line items; campaigns contain ads. `flatMap` maps each item to an *array* and flattens the result one level, so you get one flat list instead of a list of lists.",
        },
        {
          type: "run",
          code: `const orders = [
  { id: "A-1", items: [{ sku: "MUG", qty: 2 }, { sku: "TEE", qty: 1 }] },
  { id: "A-2", items: [{ sku: "MUG", qty: 1 }] },
  { id: "A-3", items: [] },
];

const nested = orders.map((o) => o.items);
console.log("map:", nested);              // [[...], [...], []]

const allItems = orders.flatMap((o) => o.items);
console.log("flatMap:", allItems);        // one flat list

const mugsSold = allItems
  .filter((item) => item.sku === "MUG")
  .reduce((sum, item) => sum + item.qty, 0);
console.log("mugs sold:", mugsSold);`,
        },
        { type: "h", text: "Sorting without mutating" },
        {
          type: "callout",
          tone: "warn",
          title: "sort() has two traps",
          text: "1) `sort()` **mutates** the array in place (and returns the same array). 2) Without a compare function it compares items **as strings**, so `[10, 9, 1].sort()` gives `[1, 10, 9]`. Always pass a compare function: `(a, b) => a - b` for numbers, `a.localeCompare(b)` for text.",
        },
        {
          type: "p",
          text: "ES2023 added non-mutating twins that return a fresh copy: `toSorted()`, `toReversed()`, `toSpliced()` and `with(index, value)`. Prefer them whenever the array is shared — React state, props, or data you received from somewhere else.",
        },
        {
          type: "run",
          code: `const amounts = [850, 2400, 640, 1200];

const asc = amounts.toSorted((a, b) => a - b);
const desc = amounts.toSorted((a, b) => b - a);
console.log("asc:", asc, "desc:", desc);
console.log("original still:", amounts);

console.log("reversed copy:", amounts.toReversed());
console.log("copy with [1] replaced:", amounts.with(1, 9999));

// French names: plain sort puts "É" after "Z". localeCompare knows better.
const clients = ["Toitures Laurier", "Épicerie Fine", "Café Nordik"];
console.log("sort():       ", clients.toSorted());
console.log("localeCompare:", clients.toSorted((a, b) => a.localeCompare(b, "fr-CA")));

// Grouping (ES2024)
const invoices = [
  { id: 1, status: "paid" }, { id: 2, status: "overdue" }, { id: 3, status: "paid" },
];
console.log(Object.groupBy(invoices, (inv) => inv.status));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "In React and Next.js",
          text: "Rendering a list is a `map`: `{clients.map((c) => <li key={c.id}>{c.name}</li>)}`. In a Server Component you can `filter`/`reduce` data right before rendering. But for large tables, filter and sort **in the database** (`supabase.from(\"invoices\").select().eq(\"status\", \"paid\").order(\"amount\")`) instead of downloading everything and filtering in JS.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Readable chains",
          text: "Put one step per line, name the callback parameter after the item (`inv`, `lead`, not `x`), and use `map` only when you need the returned array. For side effects (logging, sending emails) use `for...of` or `forEach`.",
        },
        {
          type: "challenge",
          title: "Monthly invoice report",
          prompt: "Write `buildReport(invoices)` that returns an object with:\n- `paidTotal`: the sum of `amount` for invoices whose `status` is `\"paid\"`\n- `overdueClients`: the **unique** client names with status `\"overdue\"`, sorted alphabetically with `localeCompare(…, \"fr-CA\")`\n- `hasDraft`: `true` if at least one invoice is a `\"draft\"`\nIt must not modify the `invoices` array it receives.",
          starter: `function buildReport(invoices) {
  // 1. paidTotal: sum of amounts where status === "paid"
  // 2. overdueClients: unique client names with status "overdue", sorted (fr-CA)
  // 3. hasDraft: true if at least one invoice is a "draft"
  return { paidTotal: 0, overdueClients: [], hasDraft: false };
}`,
          solution: `function buildReport(invoices) {
  const paidTotal = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueClients = invoices
    .filter((inv) => inv.status === "overdue")
    .map((inv) => inv.client)
    .filter((name, i, all) => all.indexOf(name) === i) // keep first occurrence only
    .toSorted((a, b) => a.localeCompare(b, "fr-CA"));

  const hasDraft = invoices.some((inv) => inv.status === "draft");

  return { paidTotal, overdueClients, hasDraft };
}`,
          tests: [
            {
              name: "paidTotal adds only the paid invoices",
              code: `const r = buildReport([
  { client: "Café Nordik", amount: 2400, status: "paid" },
  { client: "Studio Érable", amount: 850, status: "overdue" },
  { client: "Clinique Boréale", amount: 1200, status: "paid" },
  { client: "Café Nordik", amount: 3100, status: "draft" },
]);
return r.paidTotal === 3600;`,
            },
            {
              name: "overdueClients is unique and sorted French-style (É next to E, not after Z)",
              code: `const r = buildReport([
  { client: "Toitures Laurier", amount: 100, status: "overdue" },
  { client: "Épicerie Fine", amount: 200, status: "overdue" },
  { client: "Café Nordik", amount: 300, status: "overdue" },
  { client: "Toitures Laurier", amount: 400, status: "overdue" },
  { client: "Studio Érable", amount: 500, status: "paid" },
]);
return JSON.stringify(r.overdueClients) === JSON.stringify(["Café Nordik", "Épicerie Fine", "Toitures Laurier"]);`,
            },
            {
              name: "hasDraft is true only when a draft exists",
              code: `const withDraft = buildReport([{ client: "A", amount: 1, status: "draft" }]);
const without = buildReport([{ client: "A", amount: 1, status: "paid" }]);
return withDraft.hasDraft === true && without.hasDraft === false;`,
            },
            {
              name: "an empty list gives 0, [] and false",
              code: `const r = buildReport([]);
return r.paidTotal === 0 && Array.isArray(r.overdueClients) && r.overdueClients.length === 0 && r.hasDraft === false;`,
            },
            {
              name: "the input array is not modified",
              code: `const input = [
  { client: "Zeta", amount: 1, status: "overdue" },
  { client: "Alpha", amount: 2, status: "overdue" },
];
const before = JSON.stringify(input);
buildReport(input);
return JSON.stringify(input) === before;`,
            },
          ],
          hint: "Chain `filter` → `reduce(…, 0)` for the total. For unique names: `filter((name, i, all) => all.indexOf(name) === i)` (or `[...new Set(names)]`, see lesson 3). Sort with `toSorted((a, b) => a.localeCompare(b, \"fr-CA\"))` and use `some` for the boolean.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `[10, 9, 1].sort()` return?",
              options: ["`[1, 9, 10]`", "`[1, 10, 9]`", "`[10, 9, 1]`"],
              answer: 1,
              why: "Without a compare function, `sort` converts items to strings and compares them character by character: `\"1\" < \"10\" < \"9\"`. Use `sort((a, b) => a - b)` for numbers.",
            },
            {
              q: "What does `find` return when no item matches?",
              options: ["An empty array", "`-1`", "`undefined`", "`null`"],
              answer: 2,
              why: "`find` returns the first match or `undefined`. (`findIndex` is the one that returns `-1`.) Always handle the not-found case before reading properties.",
            },
            {
              q: "Why prefer `toSorted()` over `sort()` on React state?",
              options: [
                "It returns a new array and leaves the original untouched",
                "It sorts numbers correctly without a compare function",
                "It is the only one that works on arrays of objects",
              ],
              answer: 0,
              why: "`sort()` mutates the array in place; mutating state confuses React. `toSorted()` returns a copy. Note it still compares as strings by default — you still need a compare function for numbers.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Destructuring
    // ─────────────────────────────────────────────────────────────
    {
      slug: "destructuring",
      title: "Destructuring",
      summary: "Unpack values from objects and arrays into variables in one line — the syntax behind React props and Supabase results.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Most of your day is spent pulling fields out of objects: props passed to a component, a row returned by Supabase, the JSON body of a webhook. **Destructuring** is a declaration that mirrors the *shape* of the data: you write the pattern on the left, and JavaScript fills the variables from the value on the right. Less repetition, and the variables you depend on are listed right at the top.",
        },
        {
          type: "compare",
          left: {
            label: "Without",
            lang: "js",
            code: `const name = lead.name;
const email = lead.email;
const city = lead.company.city;`,
          },
          right: {
            label: "With destructuring",
            lang: "js",
            code: `const { name, email, company: { city } } = lead;`,
          },
        },
        { type: "h", text: "Objects: by name" },
        {
          type: "p",
          text: "Object patterns match by **property name**, so order doesn't matter. You can rename (`source: channel`), give defaults (`score = 0`), dig into nested objects, and collect the rest.",
        },
        {
          type: "run",
          code: `const lead = {
  id: 17,
  name: "Julie Tremblay",
  email: "julie@cafenordik.ca",
  source: "google",
  company: { name: "Café Nordik", city: "Québec" },
};

// basic
const { name, email } = lead;
console.log(name, email);

// rename: take "source", call the variable "channel"
const { source: channel } = lead;
console.log("channel:", channel);

// default when the property is missing (undefined)
const { score = 0, budget = "unknown" } = lead;
console.log("score:", score, "budget:", budget);

// nested + rename (two different "name"s!)
const { company: { name: companyName, city } } = lead;
console.log(companyName, "in", city);

// rest: everything you didn't pick
const { id, ...contact } = lead;
console.log("id:", id, "rest:", contact);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Defaults only kick in for undefined",
          text: "A default is used when the value is `undefined` — **not** when it's `null`. Databases love `null` (`budget: null` from a nullable Postgres column), so `const { budget = 0 } = row` leaves `budget` as `null`. Use `row.budget ?? 0` when nulls are possible (lesson 4).",
        },
        {
          type: "run",
          code: `const row = { plan: null, seats: undefined };
const { plan = "basic", seats = 1 } = row;
console.log("plan:", plan);    // null — default ignored!
console.log("seats:", seats);  // 1

const safePlan = row.plan ?? "basic";
console.log("with ??:", safePlan);

// Destructuring undefined itself throws:
try {
  const { name } = undefined;
} catch (e) {
  console.log("Error:", e.message);
}`,
        },
        { type: "h", text: "Arrays: by position" },
        {
          type: "p",
          text: "Array patterns match by **position**. You can skip slots with an empty comma, use defaults, and grab the rest. That's why React's `useState` returns an array: you choose the variable names.",
        },
        {
          type: "run",
          code: `const ranking = ["Sofia Roy", "Julie Tremblay", "Marc Gagnon", "Léa Côté"];

const [first, second] = ranking;
console.log(first, second);

const [, , third] = ranking;           // skip two
console.log("third:", third);

const [winner, ...others] = ranking;  // rest
console.log(winner, "beat", others.length, "others");

const [a = "nobody"] = [];             // default
console.log(a);

// swap without a temp variable
let left = "draft", right = "sent";
[left, right] = [right, left];
console.log(left, right);

// The pattern you'll use most: looping over entries
const budgets = { google: 1200, meta: 800, tiktok: 300 };
for (const [platform, amount] of Object.entries(budgets)) {
  console.log(platform.padEnd(7), amount);
}`,
        },
        { type: "h", text: "In function parameters" },
        {
          type: "p",
          text: "You can destructure **directly in the parameter list**. The function then takes one options object with named fields: callers can't mix up the order, optional fields get defaults, and adding a field later doesn't break existing calls. Add `= {}` so calling it with no argument doesn't crash.",
        },
        {
          type: "run",
          code: `function createQuote({ client, hours, rate = 125, currency = "CAD", rush = false } = {}) {
  const subtotal = hours * rate * (rush ? 1.25 : 1);
  return \`\${client}: \${subtotal} \${currency}\${rush ? " (rush)" : ""}\`;
}

console.log(createQuote({ client: "Café Nordik", hours: 12 }));
console.log(createQuote({ hours: 4, client: "Studio Érable", rush: true }));  // order doesn't matter
console.log(createQuote()); // no crash thanks to "= {}" (but undefined values)`,
        },
        {
          type: "code",
          lang: "jsx",
          title: "components/InvoiceRow.jsx",
          code: `// React props are one object — destructure it in the signature
export function InvoiceRow({ invoice, currency = "CAD", onPay }) {
  const { id, client, amount, status } = invoice;
  return (
    <tr>
      <td>{id}</td>
      <td>{client}</td>
      <td>{amount} {currency}</td>
      <td>{status === "paid" ? "✓" : <button onClick={() => onPay(id)}>Mark paid</button>}</td>
    </tr>
  );
}

// useState returns [value, setter] — array destructuring picks the names
const [filter, setFilter] = useState("all");`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Supabase and Next.js",
          text: "Supabase queries resolve to `{ data, error }`, so you'll write `const { data: clients, error } = await supabase.from(\"clients\").select()` — renaming `data` to something meaningful. In Next.js 15+, `params` in a page is a Promise: `const { id } = await params;`.",
        },
        {
          type: "challenge",
          title: "Describe a lead",
          prompt: "Write `describeLead(lead)` that returns `\"<name> (<company name>, <city>) via <source>\"`, e.g. `\"Julie Tremblay (Café Nordik, Québec) via referral\"`. Use destructuring **in the parameter list**, with defaults:\n- missing `company` → company name `\"Independent\"` and city `\"Unknown\"`\n- missing `company.city` → `\"Unknown\"`\n- missing `source` → `\"website\"`",
          starter: `function describeLead(lead) {
  return lead.name + " (" + lead.company.name + ", " + lead.company.city + ") via " + lead.source;
}`,
          solution: `function describeLead({
  name,
  source = "website",
  company: { name: companyName = "Independent", city = "Unknown" } = {},
}) {
  return \`\${name} (\${companyName}, \${city}) via \${source}\`;
}`,
          tests: [
            {
              name: "a complete lead is described",
              code: `return describeLead({ name: "Julie Tremblay", source: "referral", company: { name: "Café Nordik", city: "Québec" } })
  === "Julie Tremblay (Café Nordik, Québec) via referral";`,
            },
            {
              name: "missing source defaults to \"website\"",
              code: `return describeLead({ name: "Marc Gagnon", company: { name: "Studio Érable", city: "Laval" } })
  === "Marc Gagnon (Studio Érable, Laval) via website";`,
            },
            {
              name: "missing company defaults to Independent / Unknown (no crash)",
              code: `return describeLead({ name: "Sofia Roy", source: "meta" }) === "Sofia Roy (Independent, Unknown) via meta";`,
            },
            {
              name: "company without a city uses \"Unknown\"",
              code: `return describeLead({ name: "Léa Côté", source: "google", company: { name: "Clinique Boréale" } })
  === "Léa Côté (Clinique Boréale, Unknown) via google";`,
            },
          ],
          hint: "Nested pattern with a rename and a default for the whole object: `company: { name: companyName = \"Independent\", city = \"Unknown\" } = {}`. The `= {}` at the end is what prevents the crash when `company` is missing.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`const { status = \"new\" } = { status: null };` — what is `status`?",
              options: ["`\"new\"`", "`null`", "`undefined`"],
              answer: 1,
              why: "Defaults only apply when the value is `undefined`. `null` is a real value, so it is kept. Use `?? \"new\"` to also cover `null`.",
            },
            {
              q: "`const [first, , third] = [\"a\", \"b\", \"c\"];` — what is `third`?",
              options: ["`\"c\"`", "`\"b\"`", "A SyntaxError"],
              answer: 0,
              why: "Array destructuring is positional; the empty slot between the commas skips `\"b\"`.",
            },
            {
              q: "`const { data: clients } = response;` — which variable(s) does this create?",
              options: ["`data`", "`data` and `clients`", "`clients` only"],
              answer: 2,
              why: "`data: clients` means *read the property `data`, store it in a variable named `clients`*. No `data` variable is created.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Spread & rest
    // ─────────────────────────────────────────────────────────────
    {
      slug: "spread-and-rest",
      title: "Spread & rest",
      summary: "Copy, merge and update data without mutating it — the core skill behind React state updates.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "React decides whether to re-render by checking if your state is a **different object** than before (`Object.is(old, new)`). If you `push` into the same array or change a property on the same object, the reference hasn't changed, so React may skip the update and your UI shows stale data. The fix is to *create a new value* every time — and the three dots `...` make that cheap to write.",
        },
        {
          type: "p",
          text: "The same `...` syntax has two jobs depending on where it sits: **spread** *expands* an array/object into a new one (right side of `=`, in function calls), while **rest** *collects* the leftovers into one variable (in destructuring patterns and parameter lists).",
        },
        { type: "h", text: "Spread: copy and merge" },
        {
          type: "run",
          code: `// Arrays
const services = ["SEO", "Google Ads"];
const more = [...services, "Meta Ads"];           // copy + add at the end
const withWeb = ["Website", ...services];         // add at the start
const all = [...services, ...["Shopify", "Supabase"]]; // merge
console.log(more, withWeb, all);
console.log("original:", services);

// Unique values: spread a Set back into an array
const tags = ["vip", "b2b", "vip", "québec"];
console.log([...new Set(tags)]);

// Objects: later properties win
const defaults = { currency: "CAD", locale: "fr-CA", taxes: true };
const options = { locale: "en-CA" };
const config = { ...defaults, ...options };
console.log(config);

// Spread a list into function arguments
const amounts = [850, 2400, 640];
console.log("max:", Math.max(...amounts));`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Order matters",
          text: "`{ ...defaults, ...options }` lets options override defaults. `{ ...options, ...defaults }` silently does the opposite. Put the thing you want to *win* last.",
        },
        { type: "h", text: "Immutable updates: the React patterns" },
        {
          type: "table",
          rows: [
            ["Goal", "Mutating (avoid on state)", "Immutable (new value)"],
            ["Add item", "`list.push(item)`", "`[...list, item]`"],
            ["Remove item", "`list.splice(i, 1)`", "`list.filter((x) => x.id !== id)`"],
            ["Update one item", "`list[i].status = \"paid\"`", "`list.map((x) => x.id === id ? { ...x, status: \"paid\" } : x)`"],
            ["Change a field", "`obj.plan = \"pro\"`", "`{ ...obj, plan: \"pro\" }`"],
            ["Sort", "`list.sort(fn)`", "`list.toSorted(fn)`"],
          ],
        },
        {
          type: "run",
          code: `const clients = [
  { id: 1, name: "Café Nordik", status: "active" },
  { id: 2, name: "Studio Érable", status: "lead" },
];

const added = [...clients, { id: 3, name: "Toitures Laurier", status: "lead" }];
const removed = clients.filter((c) => c.id !== 1);
const converted = clients.map((c) => (c.id === 2 ? { ...c, status: "active" } : c));

console.log("added:", added.length, "removed:", removed.length);
console.log("converted:", converted);
console.log("original unchanged:", clients[1].status);

// New array, but untouched items are re-used (cheap!)
console.log("new array?", converted !== clients);
console.log("same object for client 1?", converted[0] === clients[0]);
console.log("new object for client 2?", converted[1] !== clients[1]);`,
        },
        {
          type: "code",
          lang: "jsx",
          title: "ClientList.jsx",
          code: `const [clients, setClients] = useState(initialClients);

// ❌ Same array reference: React may not re-render
function addBad(client) {
  clients.push(client);
  setClients(clients);
}

// ✅ New array, built from the latest state
function add(client) {
  setClients((prev) => [...prev, client]);
}

function markActive(id) {
  setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: "active" } : c)));
}`,
        },
        { type: "h", text: "Shallow vs deep copies" },
        {
          type: "p",
          text: "Spread copies **one level**. Nested objects inside are still shared between the copy and the original. Change one, and you change both. To update something nested you spread each level you touch, or make a full deep copy with `structuredClone`.",
        },
        {
          type: "run",
          code: `const order = { id: "A-1", customer: { name: "Julie", city: "Québec" }, items: ["MUG"] };

const shallow = { ...order };
shallow.customer.city = "Lévis";          // oops: nested object is shared
console.log("original city:", order.customer.city);

// Fix 1: spread every level you change
const moved = { ...order, customer: { ...order.customer, city: "Montréal" } };
console.log("moved:", moved.customer.city, "| original:", order.customer.city);

// Fix 2: deep copy everything
const deep = structuredClone(order);
deep.items.push("TEE");
console.log("deep items:", deep.items, "| original items:", order.items);

// structuredClone keeps Dates and Maps; JSON round-trips do not
const withDate = { due: new Date(2026, 9, 31) };
console.log(structuredClone(withDate).due instanceof Date);           // true
console.log(JSON.parse(JSON.stringify(withDate)).due instanceof Date); // false (a string)`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "structuredClone limits",
          text: "`structuredClone` throws a `DataCloneError` on functions, and class instances come back as plain objects (methods lost). Use it for *data*. Also: you rarely need deep copies in React — spreading the levels you change is cheaper and keeps unchanged parts shared.",
        },
        { type: "h", text: "Rest: collect the leftovers" },
        {
          type: "run",
          code: `// Rest parameters: any number of arguments, as a real array
function total(...amounts) {
  return amounts.reduce((sum, n) => sum + n, 0);
}
console.log(total(100, 250, 75), total());

// First argument named, the rest collected
function tagClient(client, ...tags) {
  return \`\${client}: \${tags.join(", ") || "no tags"}\`;
}
console.log(tagClient("Café Nordik", "vip", "b2b"));

// Object rest: omit fields before sending data to the browser
const user = { id: 9, email: "julie@cafenordik.ca", passwordHash: "x9$…", role: "admin" };
const { passwordHash, ...publicUser } = user;
console.log(publicUser);

// Array rest
const [latest, ...older] = ["INV-105", "INV-104", "INV-103"];
console.log(latest, older);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Rest in components",
          text: "A common React pattern: `function Button({ variant = \"primary\", ...props }) { return <button className={styles[variant]} {...props} />; }` — pick the props you handle, forward everything else (`onClick`, `disabled`, `aria-*`) to the real element with spread.",
        },
        {
          type: "challenge",
          title: "Update a cart without mutating it",
          prompt: "Write `updateQuantity(cart, sku, quantity)` for a cart shaped like `{ customer, items: [{ sku, name, quantity }] }`. It must return a **new** cart where the item with that `sku` has the new `quantity`. If `quantity` is `0` or less, the item is removed. The original cart (and its items) must not change, and items you didn't touch should be the very same objects (no needless copies).",
          starter: `function updateQuantity(cart, sku, quantity) {
  const item = cart.items.find((i) => i.sku === sku);
  item.quantity = quantity; // ❌ mutates the original!
  return cart;
}`,
          solution: `function updateQuantity(cart, sku, quantity) {
  const items =
    quantity <= 0
      ? cart.items.filter((item) => item.sku !== sku)
      : cart.items.map((item) => (item.sku === sku ? { ...item, quantity } : item));
  return { ...cart, items };
}`,
          tests: [
            {
              name: "the item gets the new quantity",
              code: `const cart = { customer: "Julie", items: [{ sku: "MUG", name: "Mug", quantity: 1 }, { sku: "TEE", name: "T-shirt", quantity: 2 }] };
const next = updateQuantity(cart, "MUG", 3);
return next.items.find((i) => i.sku === "MUG").quantity === 3 && next.customer === "Julie";`,
            },
            {
              name: "returns a new cart and a new items array",
              code: `const cart = { customer: "Julie", items: [{ sku: "MUG", name: "Mug", quantity: 1 }] };
const next = updateQuantity(cart, "MUG", 5);
return next !== cart && next.items !== cart.items;`,
            },
            {
              name: "the original cart is left untouched",
              code: `const cart = { customer: "Julie", items: [{ sku: "MUG", name: "Mug", quantity: 1 }, { sku: "TEE", name: "T-shirt", quantity: 2 }] };
const before = JSON.stringify(cart);
updateQuantity(cart, "MUG", 4);
updateQuantity(cart, "TEE", 0);
return JSON.stringify(cart) === before;`,
            },
            {
              name: "quantity 0 removes the item",
              code: `const cart = { customer: "Julie", items: [{ sku: "MUG", name: "Mug", quantity: 1 }, { sku: "TEE", name: "T-shirt", quantity: 2 }] };
const next = updateQuantity(cart, "TEE", 0);
return next.items.length === 1 && next.items[0].sku === "MUG";`,
            },
            {
              name: "untouched items are re-used, not copied",
              code: `const cart = { customer: "Julie", items: [{ sku: "MUG", name: "Mug", quantity: 1 }, { sku: "TEE", name: "T-shirt", quantity: 2 }] };
const next = updateQuantity(cart, "MUG", 2);
return next.items[1] === cart.items[1];`,
            },
          ],
          hint: "Build the new `items` with `map` (spread only the matching item: `{ ...item, quantity }`) or `filter` (when removing), then return `{ ...cart, items }`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What is `{ ...{ plan: \"basic\", seats: 3 }, ...{ plan: \"pro\" } }`?",
              options: ["`{ plan: \"pro\" }`", "`{ plan: \"basic\", seats: 3 }`", "`{ plan: \"pro\", seats: 3 }`"],
              answer: 2,
              why: "Both objects are spread into a new one; when keys collide the later one wins. `seats` survives because the second object doesn't have it.",
            },
            {
              q: "`items.push(newItem); setItems(items);` — why might the UI not update?",
              options: [
                "`push` is asynchronous",
                "It's the same array reference, so React sees no change",
                "`setItems` only accepts arrays created with `Array.from`",
              ],
              answer: 1,
              why: "React compares the old and new state with `Object.is`. Mutating and passing the same array means *same reference* — use `setItems((prev) => [...prev, newItem])`.",
            },
            {
              q: "`const copy = { ...order }; copy.customer.name = \"Marc\";` — what happens to `order.customer.name`?",
              options: ["It also becomes `\"Marc\"`", "It's unchanged", "A TypeError is thrown"],
              answer: 0,
              why: "Spread is shallow: `copy.customer` and `order.customer` are the same object. Spread the nested level too (`{ ...order, customer: { ...order.customer, name: \"Marc\" } }`) or use `structuredClone`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Modern operators & literals
    // ─────────────────────────────────────────────────────────────
    {
      slug: "modern-operators",
      title: "Modern operators & literals",
      summary: "Template literals, `?.`, `??`, `??=`, shorthand and computed keys — small syntax that removes a lot of defensive code.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Real data is messy: a lead without a company, an order with no shipping address, a discount that is legitimately `0`. Before ES2020 you protected yourself with long chains like `order && order.shipping && order.shipping.city`. The operators in this lesson make that defensive code short and — more importantly — *correct*.",
        },
        { type: "h", text: "Template literals" },
        {
          type: "p",
          text: "Backtick strings can span multiple lines and embed any expression with `${…}`. No more `\"Hi \" + name + \",\"` chains.",
        },
        {
          type: "run",
          code: `const client = { name: "Café Nordik", contact: "Julie" };
const amount = 1250;

const email = \`Bonjour \${client.contact},

Your invoice for \${client.name} is ready.
Total with taxes: \${(amount * 1.14975).toFixed(2)} $
Status: \${amount > 1000 ? "payable in 30 days" : "payable on receipt"}\`;

console.log(email);`,
        },
        {
          type: "p",
          text: "A **tagged template** puts a function name in front of the backticks. The function receives the literal string parts and the embedded values *separately*, and can return anything. Libraries use this to escape values safely.",
        },
        {
          type: "run",
          code: `function show(strings, ...values) {
  console.log("strings:", strings);
  console.log("values: ", values);
}
const id = 42;
show\`select * from clients where id = \${id} and active = \${true}\`;

// A toy version of what SQL libraries do: values never get glued into the query text
function sql(strings, ...values) {
  const text = strings.reduce((query, part, i) => query + "$" + i + part);
  return { text, values };
}
const evil = "42; DROP TABLE clients";
console.log(sql\`select * from clients where id = \${evil}\`);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Tagged templates in the wild",
          text: "Postgres clients like `postgres` (postgres.js) and Neon's serverless driver expose a `sql` tag: every `${value}` you embed is sent as a **parameter**, never glued into the query text, which prevents SQL injection. GraphQL tooling uses a `graphql`/`gql` tag for Shopify queries, and `styled-components` uses a `css` tag.",
        },
        { type: "h", text: "Optional chaining ?." },
        {
          type: "p",
          text: "`a?.b` means: *if `a` is `null` or `undefined`, stop and give `undefined`; otherwise read `b`*. It works for properties (`?.`), dynamic keys and indexes (`?.[ ]`) and calls (`?.()`).",
        },
        {
          type: "run",
          code: `const clients = [
  { name: "Café Nordik", billing: { address: { city: "Québec" } }, getPlan() { return "pro"; } },
  { name: "Studio Érable" }, // no billing, no getPlan
];

for (const c of clients) {
  console.log(c.name, "→ city:", c.billing?.address?.city, "| plan:", c.getPlan?.());
}

console.log("index:", clients[5]?.name);      // no client #5 → undefined
const tags = undefined;
console.log("first tag:", tags?.[0]);

try {
  console.log(clients[1].billing.address.city);
} catch (e) {
  console.log("Without ?. →", e.message);
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Don't sprinkle ?. everywhere",
          text: "If a value **must** exist (an invoice always has an id), `invoice?.id` just hides a bug: you get `undefined` silently instead of a clear error at the right spot. Use `?.` for data that is *legitimately* optional.",
        },
        { type: "h", text: "Nullish coalescing ?? vs ||" },
        {
          type: "p",
          text: "`a ?? b` gives `b` only when `a` is `null` or `undefined`. The older `a || b` gives `b` whenever `a` is **falsy** — which also includes `0`, `\"\"` and `false`, all perfectly valid values.",
        },
        {
          type: "table",
          rows: [
            ["value of x", "`x || 15`", "`x ?? 15`"],
            ["`undefined`", "15", "15"],
            ["`null`", "15", "15"],
            ["`0`", "15 ❌", "0 ✅"],
            ["`\"\"`", "15", "\"\""],
            ["`false`", "15", "false"],
            ["`20`", "20", "20"],
          ],
        },
        {
          type: "run",
          code: `const settings = { discount: 0, note: "", seats: null };

console.log("discount ||", settings.discount || 15);  // 15 — the client gets a discount they shouldn't!
console.log("discount ??", settings.discount ?? 15);  // 0
console.log("note ??", JSON.stringify(settings.note ?? "(none)"));
console.log("seats ??", settings.seats ?? 1);

// Combine with ?. for safe reads with a fallback
const order = {};
const city = order.shipping?.address?.city ?? "Pickup in store";
console.log(city);`,
        },
        { type: "h", text: "Logical assignment: ??=, ||=, &&=" },
        {
          type: "run",
          code: `// x ??= y  →  "if x is null/undefined, set it to y"
const formatters = {};
function getFormatter(locale) {
  formatters[locale] ??= new Intl.NumberFormat(locale, { style: "currency", currency: "CAD" });
  return formatters[locale];
}
console.log(getFormatter("fr-CA").format(1999.5));
console.log(getFormatter("fr-CA") === getFormatter("fr-CA")); // created once, cached

const lead = { name: "Marc", tags: null };
lead.tags ??= [];
lead.tags.push("webinar");
console.log(lead);

// &&= only assigns when the current value is truthy
const draft = { title: "  Q4 campaign  " };
draft.title &&= draft.title.trim();
console.log(JSON.stringify(draft.title));`,
        },
        { type: "h", text: "Shorthand properties & computed keys" },
        {
          type: "run",
          code: `const name = "Julie Tremblay";
const email = "julie@cafenordik.ca";

// Shorthand: { name: name, email: email } → { name, email }
// Method shorthand: describe() { … } instead of describe: function () { … }
const lead = {
  name,
  email,
  describe() {
    return \`\${this.name} <\${this.email}>\`;
  },
};
console.log(lead.describe());

// Computed keys: the key comes from an expression
function updateField(form, field, value) {
  return { ...form, [field]: value };
}
let form = { name: "", email: "", budget: "" };
form = updateField(form, "email", "marc@studioerable.ca");
form = updateField(form, "budget", "5000");
console.log(form);

const platform = "meta";
console.log({ [\`\${platform}Budget\`]: 800 });`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "One handler for a whole form",
          text: "In React forms you'll see `setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))`: spread + computed key, so one `onChange` handler serves every input whose `name` matches a field.",
        },
        { type: "h", text: "Short-circuit patterns" },
        {
          type: "p",
          text: "`&&` returns the first falsy value or the last value; `||` returns the first truthy value. That's why `isAdmin && showPanel()` only calls the function when `isAdmin` is truthy. Handy, but know what it *returns*.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "The React 0 bug",
          text: "`{unread && <Badge count={unread} />}` renders a literal **0** on the page when `unread` is `0`, because `0 && …` returns `0` and React renders numbers. Write `{unread > 0 && <Badge … />}` or use a ternary.",
        },
        {
          type: "challenge",
          title: "Order summary from messy data",
          prompt: "Write `getOrderSummary(order)` returning `{ customer, city, discount, firstItem }`:\n- `customer`: `order.customer.name`, or `\"Guest\"` when there is no customer\n- `city`: `order.shipping.address.city`, or `\"Pickup\"` when any part is missing\n- `discount`: `order.discount`, or `5` when missing — but a discount of `0` must stay `0`\n- `firstItem`: the `name` of the first item in `order.items`, or `null`\nIt must never throw, even for `{}`.",
          starter: `function getOrderSummary(order) {
  return {
    customer: order.customer.name || "Guest",
    city: order.shipping.address.city || "Pickup",
    discount: order.discount || 5,
    firstItem: order.items[0].name || null,
  };
}`,
          solution: `function getOrderSummary(order) {
  return {
    customer: order.customer?.name ?? "Guest",
    city: order.shipping?.address?.city ?? "Pickup",
    discount: order.discount ?? 5,
    firstItem: order.items?.[0]?.name ?? null,
  };
}`,
          tests: [
            {
              name: "a complete order is summarized",
              code: `const s = getOrderSummary({
  customer: { name: "Julie" },
  shipping: { address: { city: "Québec" } },
  discount: 10,
  items: [{ name: "Mug" }, { name: "T-shirt" }],
});
return s.customer === "Julie" && s.city === "Québec" && s.discount === 10 && s.firstItem === "Mug";`,
            },
            {
              name: "an empty order {} gets all the fallbacks without throwing",
              code: `const s = getOrderSummary({});
return s.customer === "Guest" && s.city === "Pickup" && s.discount === 5 && s.firstItem === null;`,
            },
            {
              name: "a discount of 0 stays 0",
              code: `return getOrderSummary({ discount: 0 }).discount === 0;`,
            },
            {
              name: "customer: null and items: [] are handled",
              code: `const s = getOrderSummary({ customer: null, items: [], shipping: { address: null } });
return s.customer === "Guest" && s.firstItem === null && s.city === "Pickup";`,
            },
          ],
          hint: "Replace each `.` that might hit `null`/`undefined` with `?.` (`order.items?.[0]?.name`) and replace `||` with `??` so `0` survives.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What do `0 ?? 5` and `0 || 5` evaluate to?",
              options: ["`5` and `5`", "`0` and `5`", "`0` and `0`", "`5` and `0`"],
              answer: 1,
              why: "`??` only falls back on `null`/`undefined`, so `0` is kept. `||` falls back on any falsy value, and `0` is falsy.",
            },
            {
              q: "`client.getPlan?.()` when `client` has no `getPlan` method gives…",
              options: ["`undefined`", "`TypeError: client.getPlan is not a function`", "`null`"],
              answer: 0,
              why: "`?.()` checks the function itself: if it's `null`/`undefined`, the call is skipped and the expression is `undefined`.",
            },
            {
              q: "In React, `{unread && <Badge />}` with `unread = 0` renders…",
              options: ["Nothing", "The badge", "The text `0`"],
              answer: 2,
              why: "`0 && …` evaluates to `0`, and React renders numbers. Use `unread > 0 && …` to get a real boolean.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Modules
    // ─────────────────────────────────────────────────────────────
    {
      slug: "modules",
      title: "Modules: import & export",
      summary: "How files share code with `import`/`export`, why each file has its own scope, and the ESM vs CommonJS story.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Early JavaScript had no modules: every `<script>` dumped its variables into one global scope, so two files declaring `total` silently overwrote each other. **ES modules** (2015) fixed this. Each file is a module with its **own scope**; nothing leaks out unless you `export` it, and nothing comes in unless you `import` it. Because imports are written statically at the top, tools like Next.js can read the dependency graph *before* running anything, and drop code nobody imports (tree shaking).",
        },
        {
          type: "callout",
          tone: "info",
          title: "Read-only in this lesson",
          text: "The in-browser runner executes one snippet at a time, so it can't `import` other files. Module syntax is shown in code blocks; the runnable parts simulate what modules do for you.",
        },
        { type: "h", text: "Named exports" },
        {
          type: "code",
          lang: "js",
          title: "lib/money.js",
          code: `export const QC_TAX_RATE = 0.14975; // GST 5% + QST 9.975%

export function withTaxes(amount) {
  return Math.round(amount * (1 + QC_TAX_RATE) * 100) / 100;
}

function round2(n) {        // not exported: private to this file
  return Math.round(n * 100) / 100;
}

export function formatCAD(amount, locale = "fr-CA") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CAD" }).format(round2(amount));
}`,
        },
        {
          type: "code",
          lang: "js",
          title: "app/invoices/summary.js",
          code: `// Import exactly the names you need, inside { }
import { withTaxes, formatCAD } from "../lib/money.js";

// Rename on import to avoid clashes
import { QC_TAX_RATE as TAX } from "../lib/money.js";

// Or grab everything as a namespace object
import * as money from "../lib/money.js";
money.formatCAD(100);`,
        },
        { type: "h", text: "Default exports" },
        {
          type: "p",
          text: "A module can also have **one** default export. The importer picks any name it likes, without braces.",
        },
        {
          type: "compare",
          left: {
            label: "components/InvoiceTable.jsx",
            lang: "jsx",
            code: `export default function InvoiceTable({ invoices }) {
  return <table>{/* … */}</table>;
}

// also allowed alongside the default:
export const PAGE_SIZE = 25;`,
          },
          right: {
            label: "app/invoices/page.jsx",
            lang: "jsx",
            code: `// any name, no braces, for the default
import InvoiceTable, { PAGE_SIZE } from "@/components/InvoiceTable";
import Table from "@/components/InvoiceTable"; // also works

export default function Page() { /* … */ }`,
          },
        },
        {
          type: "table",
          rows: [
            ["", "Named export", "Default export"],
            ["How many per file", "As many as you want", "At most one"],
            ["Import syntax", "`import { formatCAD } from …`", "`import AnyName from …`"],
            ["Name at import", "Must match (or use `as`)", "Chosen by the importer"],
            ["Refactoring / autocomplete", "Easier: one name everywhere", "Names can drift between files"],
            ["Typical use", "Utilities, hooks, most components", "Framework entry points (Next.js pages, layouts)"],
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Next.js conventions",
          text: "Files like `app/**/page.tsx`, `layout.tsx`, `loading.tsx` and `error.tsx` **must** `export default` their component — that's how Next.js finds it. Route handlers (`route.ts`) use *named* exports per HTTP method: `export async function GET() {}`. And the `\"use client\"` / `\"use server\"` directives must be the very first statement of a module, above the imports.",
        },
        { type: "h", text: "What module scope gives you" },
        {
          type: "list",
          items: [
            "**Private by default** — top-level variables and helpers stay in the file unless exported.",
            "**Strict mode automatically** — no need for `\"use strict\"`.",
            "**Evaluated once** — the first `import` runs the file; every later import gets the *same* cached instance. Great for a shared config or client, dangerous for per-user data on a server.",
            "**Live, read-only bindings** — importers see the exporter's current value but can't reassign it.",
            "**Top-level `await`** — a module can `await` while loading (importers wait for it).",
          ],
        },
        {
          type: "run",
          title: "a tiny module loader (simulation)",
          code: `// This is roughly what the runtime does for you behind import statements.
const registry = new Map();

function defineModule(path, factory) {
  registry.set(path, { factory, exports: undefined, evaluated: false });
}

function importModule(path) {
  const mod = registry.get(path);
  if (!mod.evaluated) {
    console.log(\`(evaluating \${path})\`);
    mod.exports = mod.factory();  // runs the module body ONCE
    mod.evaluated = true;
  }
  return mod.exports;             // everyone shares the same exports
}

defineModule("lib/counter.js", () => {
  let count = 0;                  // module-private state
  return {
    increment: () => ++count,
  };
});

const a = importModule("lib/counter.js"); // file A imports it
const b = importModule("lib/counter.js"); // file B imports it — no re-evaluation
a.increment();
a.increment();
console.log("B sees:", b.increment());   // 3 — shared instance
console.log("same object?", a === b);
console.log("count reachable from outside?", typeof count); // "undefined"`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Module state on a server is shared by everyone",
          text: "A server process keeps modules loaded between requests. A top-level `let currentUser` in a Next.js server file can leak one visitor's data into another visitor's request. Keep per-request data inside functions (read cookies/headers per request). Module-level state is fine for things that are the same for everyone: config, constants, a cache of public data.",
        },
        { type: "h", text: "Dynamic import()" },
        {
          type: "code",
          lang: "js",
          title: "loading heavy code on demand",
          code: `async function exportPdf(invoice) {
  // Only downloaded when the user clicks "Export" — not in the initial bundle
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  doc.text(\`Invoice \${invoice.id}\`, 10, 10);
  doc.save(\`\${invoice.id}.pdf\`);
}

// In Next.js, next/dynamic wraps this for components:
// const Chart = dynamic(() => import("@/components/RevenueChart"), { ssr: false });`,
        },
        { type: "h", text: "ES modules vs CommonJS" },
        {
          type: "p",
          text: "Node.js existed before ES modules, so it invented its own system: **CommonJS** (`require` / `module.exports`). You'll still meet it in older packages, config files (`*.config.cjs`) and Stack Overflow answers.",
        },
        {
          type: "compare",
          left: {
            label: "CommonJS (older Node)",
            lang: "js",
            code: `const { formatCAD } = require("./money");

function createInvoice() { /* … */ }

module.exports = { createInvoice };`,
          },
          right: {
            label: "ES modules (standard)",
            lang: "js",
            code: `import { formatCAD } from "./money.js";

export function createInvoice() { /* … */ }`,
          },
        },
        {
          type: "list",
          items: [
            "`require` is a normal function call: it runs synchronously, can sit inside an `if`, and hands you values as they are at that moment (no live bindings). `import` is static syntax, analysed before the code runs.",
            "Node treats `.mjs` files (or `.js` files when `package.json` has `\"type\": \"module\"`) as ES modules, and `.cjs` as CommonJS.",
            "In plain Node ESM, relative imports need the file extension (`./money.js`). Bundlers like Next.js and TypeScript's bundler resolution let you omit it.",
            "Recent Node versions (22.12+) can even `require()` an ES module that doesn't use top-level `await`, which smooths the transition. The Node.js track goes deeper.",
          ],
        },
        { type: "h", text: "Barrel files" },
        {
          type: "code",
          lang: "ts",
          title: "components/ui/index.ts",
          code: `// A "barrel" re-exports several modules from one entry point
export { Button } from "./Button";
export { Card, CardHeader } from "./Card";
export { default as Modal } from "./Modal"; // re-export a default under a name
export * from "./Badge";                     // everything Badge exports

// Elsewhere: one tidy import line
// import { Button, Card, Modal } from "@/components/ui";`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Barrels have a cost",
          text: "Importing one name from a big barrel can make the bundler load *every* module it re-exports, slowing dev builds and sometimes shipping extra code. Next.js mitigates this for popular libraries (`optimizePackageImports`), but keep your own barrels small, and never mix server-only code (database, secrets) and client components in the same barrel.",
        },
        {
          type: "challenge",
          title: "Fake a module with a closure",
          prompt: "Before ES modules, developers created private scope with a function that runs immediately (an IIFE). Create `invoiceNumbers` so that:\n- `invoiceNumbers.next()` returns `\"INV-0001\"`, then `\"INV-0002\"`, … (always 4 digits)\n- `invoiceNumbers.reset()` restarts the sequence\n- the counter is **private**: `invoiceNumbers` only exposes functions, and there is no top-level `counter` variable.",
          starter: `let counter = 0;

const invoiceNumbers = {
  next() {
    counter++;
    return "INV-" + counter;
  },
};`,
          solution: `const invoiceNumbers = (() => {
  let counter = 0; // private: lives in the closure, like a module-level variable

  return {
    next() {
      counter += 1;
      return \`INV-\${String(counter).padStart(4, "0")}\`;
    },
    reset() {
      counter = 0;
    },
  };
})();`,
          tests: [
            {
              name: "next() gives INV-0001 then INV-0002",
              code: `invoiceNumbers.reset();
return invoiceNumbers.next() === "INV-0001" && invoiceNumbers.next() === "INV-0002";`,
            },
            {
              name: "numbers are padded to 4 digits (10th is INV-0010)",
              code: `invoiceNumbers.reset();
let last;
for (let i = 0; i < 10; i++) last = invoiceNumbers.next();
return last === "INV-0010";`,
            },
            {
              name: "reset() restarts the sequence",
              code: `invoiceNumbers.next();
invoiceNumbers.reset();
return invoiceNumbers.next() === "INV-0001";`,
            },
            {
              name: "the counter is private (no top-level counter, only functions exposed)",
              code: `return typeof counter === "undefined" && Object.values(invoiceNumbers).every((v) => typeof v === "function");`,
            },
          ],
          hint: "Wrap everything in `(() => { let counter = 0; return { next() {…}, reset() {…} }; })()`. Pad with `String(counter).padStart(4, \"0\")`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`InvoiceTable.jsx` contains `export default function InvoiceTable() {}`. Which import works?",
              options: [
                "`import { Table } from \"./InvoiceTable\"`",
                "`import * from \"./InvoiceTable\"`",
                "`import Table from \"./InvoiceTable\"`",
              ],
              answer: 2,
              why: "A default export is imported without braces, and the importer chooses the name. `{ Table }` would look for a *named* export called `Table`; `import *` needs `as name`.",
            },
            {
              q: "`lib/config.js` is imported by 5 different files. How many times does its top-level code run?",
              options: ["Once — the module is cached and shared", "5 times", "Once per function call"],
              answer: 0,
              why: "A module is evaluated the first time it's imported; every other import receives the same instance.",
            },
            {
              q: "Why is a top-level `let currentUser` risky in a Next.js server module?",
              options: [
                "Modules can't contain `let`",
                "The module instance is shared across requests, so one user's data can leak to another",
                "It is reset on every request, so it's always empty",
              ],
              answer: 1,
              why: "Server modules stay loaded between requests. Per-request data must live inside the function handling the request.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Classes
    // ─────────────────────────────────────────────────────────────
    {
      slug: "classes",
      title: "Classes",
      summary: "Class syntax, private fields, getters, static methods and inheritance — and when plain functions are the better choice.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "A **class** is a blueprint for objects that bundle data with the behaviour that works on it. Modern React code is mostly functions, so why learn classes? Because you *use* them constantly — `new Date()`, `new Map()`, `new URL()`, `new Intl.NumberFormat()`, SDK clients, and every `Error` — and because custom error classes (next lesson) are the main place you'll write one yourself. Under the hood, classes are syntax over JavaScript's prototypes; the *JS under the hood* track explains that machinery.",
        },
        {
          type: "run",
          code: `class Booking {
  // public field with a default
  status = "pending";
  // private field: only code inside this class body can touch it
  #history = [];

  // runs on "new Booking(...)"
  constructor(client, date) {
    this.client = client;
    this.date = date;
    this.#log("created");
  }

  // method (shared by all instances)
  confirm() {
    this.status = "confirmed";
    this.#log("confirmed");
    return this; // returning this allows chaining
  }

  // getter: read like a property, computed on access
  get isConfirmed() {
    return this.status === "confirmed";
  }

  get history() {
    return [...this.#history]; // hand out a copy, not the private array
  }

  // private method
  #log(event) {
    this.#history.push(event);
  }

  // static: belongs to the class itself, not to instances
  static fromRow(row) {
    return new Booking(row.client_name, row.booked_for);
  }
}

const b = new Booking("Clinique Boréale", "2026-11-03");
console.log(b.isConfirmed);           // false
b.confirm();
console.log(b.isConfirmed, b.history); // true [ 'created', 'confirmed' ]
console.log(Object.keys(b));           // private fields don't show up

const fromDb = Booking.fromRow({ client_name: "Café Nordik", booked_for: "2026-11-10" });
console.log(fromDb instanceof Booking, fromDb.client);`,
        },
        {
          type: "table",
          rows: [
            ["Feature", "Syntax", "What it's for"],
            ["Constructor", "`constructor(a, b) { this.a = a; }`", "Set up a new instance"],
            ["Public field", "`status = \"pending\";`", "Per-instance data with a default"],
            ["Private field / method", "`#history = [];` / `#log() {}`", "Internal state nobody outside can read or break"],
            ["Method", "`confirm() {}`", "Behaviour shared by all instances"],
            ["Getter / setter", "`get total() {}` / `set total(v) {}`", "Computed or validated properties"],
            ["Static", "`static fromRow(row) {}`", "Factories and helpers called on the class: `Booking.fromRow()`"],
          ],
        },
        {
          type: "run",
          title: "setters validate",
          code: `class Campaign {
  #budget = 0;

  constructor(name, budget) {
    this.name = name;
    this.budget = budget; // goes through the setter below
  }

  get budget() {
    return this.#budget;
  }

  set budget(value) {
    if (typeof value !== "number" || value < 0) {
      throw new RangeError(\`Invalid budget for \${this.name}: \${value}\`);
    }
    this.#budget = value;
  }
}

const c = new Campaign("Black Friday", 1500);
c.budget += 500;
console.log(c.name, c.budget);

try {
  c.budget = -100;
} catch (e) {
  console.log(e.name + ":", e.message);
}
console.log("still", c.budget);`,
        },
        { type: "h", text: "Inheritance: extends & super" },
        {
          type: "p",
          text: "`class B extends A` makes B a specialised A: it inherits A's methods and can add or override some. In B's constructor you **must** call `super(...)` (A's constructor) before touching `this`. Inside methods, `super.method()` calls the parent's version.",
        },
        {
          type: "run",
          code: `class Notifier {
  constructor(recipient) {
    this.recipient = recipient;
  }
  format(message) {
    return \`To \${this.recipient}: \${message}\`;
  }
  send(message) {
    console.log("[log]", this.format(message));
  }
}

class SmsNotifier extends Notifier {
  constructor(recipient, phone) {
    super(recipient);          // must come first
    this.phone = phone;
  }
  format(message) {            // override, but reuse the parent
    const text = super.format(message);
    return text.length > 60 ? text.slice(0, 57) + "..." : text;
  }
}

const email = new Notifier("julie@cafenordik.ca");
const sms = new SmsNotifier("Julie", "+1 418 555-0199");
email.send("Your invoice INV-105 is ready.");
sms.send("Your appointment with Clinique Boréale is confirmed for Tuesday 10:30, see you soon!");
console.log(sms instanceof SmsNotifier, sms instanceof Notifier);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Methods lose `this` when detached",
          text: "Passing `booking.confirm` as a callback (`setTimeout(booking.confirm)`, `onClick={booking.confirm}`) passes the *function* without the object, so inside it `this` is `undefined` and you get a TypeError. Wrap it in an arrow: `() => booking.confirm()`.",
        },
        {
          type: "run",
          code: `class Booking {
  constructor(client) { this.client = client; }
  confirm() { return \`\${this.client} confirmed\`; }
}
const booking = new Booking("Studio Érable");

const detached = booking.confirm;
try {
  detached();
} catch (e) {
  console.log("Detached:", e.message);
}

const wrapped = () => booking.confirm();
console.log("Wrapped:", wrapped());`,
        },
        { type: "h", text: "Classes vs plain objects and functions" },
        {
          type: "compare",
          left: {
            label: "Class",
            lang: "js",
            code: `class Cart {
  #items = [];
  add(item) { this.#items.push(item); }
  get count() { return this.#items.length; }
}
const cart = new Cart();`,
          },
          right: {
            label: "Factory function + closure",
            lang: "js",
            code: `function createCart() {
  const items = [];
  return {
    add: (item) => items.push(item),
    count: () => items.length,
  };
}
const cart = createCart();`,
          },
        },
        {
          type: "list",
          items: [
            "**Reach for a class** when you need many instances with shared methods and internal state, `instanceof` checks (custom errors!), or a library expects you to `extend` something.",
            "**Prefer plain objects + functions** for data (what you fetch, store and send as JSON) and for most app logic. They serialize cleanly, are easy to test, and fit React's \"data in, UI out\" model.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Classes in React & Next.js",
          text: "Older React code used `class Dashboard extends React.Component` with `this.state` — you'll see it in legacy projects, but new code uses function components and hooks. Server Components can only pass **serializable data** (plain objects, arrays, strings, numbers, Dates…) to Client Components, so a class instance with methods can't cross that boundary: map it to a plain object first.",
        },
        {
          type: "challenge",
          title: "An Invoice class",
          prompt: "Create `class Invoice`:\n- `constructor(client)` stores a public `client` property\n- a **private** `#lines` array (nothing else public on the instance)\n- `addLine(description, amount)` adds `{ description, amount }` and returns `this` so calls can be chained\n- getter `total`: the sum of all amounts\n- `static fromLines(client, lines)` builds an invoice from an array of `{ description, amount }`\n\nThen create `class RecurringInvoice extends Invoice` with `constructor(client, months)` (store `months`) and a getter `contractTotal` = `total × months`.",
          starter: `class Invoice {
  constructor(client) {
    this.client = client;
    this.lines = []; // should be private
  }

  addLine(description, amount) {
    this.lines.push({ description, amount });
  }
}

// class RecurringInvoice extends Invoice { ... }`,
          solution: `class Invoice {
  #lines = [];

  constructor(client) {
    this.client = client;
  }

  addLine(description, amount) {
    this.#lines.push({ description, amount });
    return this;
  }

  get total() {
    return this.#lines.reduce((sum, line) => sum + line.amount, 0);
  }

  static fromLines(client, lines) {
    const invoice = new Invoice(client);
    for (const { description, amount } of lines) invoice.addLine(description, amount);
    return invoice;
  }
}

class RecurringInvoice extends Invoice {
  constructor(client, months) {
    super(client);
    this.months = months;
  }

  get contractTotal() {
    return this.total * this.months;
  }
}`,
          tests: [
            {
              name: "addLine is chainable and total adds the amounts",
              code: `const inv = new Invoice("Café Nordik").addLine("Website", 4000).addLine("Hosting", 300);
return inv.total === 4300;`,
            },
            {
              name: "a new invoice has a total of 0",
              code: `return new Invoice("Studio Érable").total === 0;`,
            },
            {
              name: "lines are private: only `client` is a public key",
              code: `const inv = new Invoice("Café Nordik").addLine("SEO", 900);
return JSON.stringify(Object.keys(inv)) === JSON.stringify(["client"]);`,
            },
            {
              name: "Invoice.fromLines builds an Invoice",
              code: `const inv = Invoice.fromLines("Clinique Boréale", [{ description: "Ads", amount: 1200 }, { description: "Report", amount: 150 }]);
return inv instanceof Invoice && inv.client === "Clinique Boréale" && inv.total === 1350;`,
            },
            {
              name: "RecurringInvoice extends Invoice and computes contractTotal",
              code: `const r = new RecurringInvoice("Toitures Laurier", 12).addLine("Maintenance", 250);
return r instanceof Invoice && r.months === 12 && r.total === 250 && r.contractTotal === 3000;`,
            },
          ],
          hint: "Declare `#lines = [];` at the top of the class body. `addLine` must end with `return this;`. In the subclass, call `super(client)` before `this.months = months`, and use `this.total` inside the `contractTotal` getter.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What happens if code outside the class reads `account.#balance`?",
              options: [
                "It returns `undefined`",
                "A SyntaxError: private names only exist inside the class body",
                "It returns the value",
              ],
              answer: 1,
              why: "Private `#names` are checked when the code is parsed. Outside the class body, `#balance` isn't even valid syntax — that's real privacy, unlike the old `_balance` convention.",
            },
            {
              q: "In a subclass constructor, what must you do before using `this`?",
              options: ["Call `super(...)`", "Call `this.init()`", "Nothing special"],
              answer: 0,
              why: "The parent constructor creates and initialises the object. Using `this` before `super()` throws a ReferenceError.",
            },
            {
              q: "`const add = invoice.addLine; add(\"SEO\", 900);` — what happens?",
              options: [
                "It works the same as `invoice.addLine(…)`",
                "The line is added to `globalThis`",
                "A TypeError: `this` is `undefined` inside the method",
              ],
              answer: 2,
              why: "`this` is decided by how a function is *called*. Called without an object in front, `this` is `undefined` (class bodies are strict mode). Use `() => invoice.addLine(…)` or `.bind(invoice)`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Errors
    // ─────────────────────────────────────────────────────────────
    {
      slug: "errors",
      title: "Errors & validation",
      summary: "throw, try/catch/finally, error types, custom errors with `cause` — and when to return a result instead of throwing.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Things fail: a client submits a form with a bad date, the Shopify API times out, an environment variable is missing on Vercel. Good error handling answers two questions: **who** can deal with this failure, and **how** do they find out? JavaScript gives you exceptions (`throw` / `catch`) for the first case and plain return values for the second. Using each in the right place is what separates a robust app from one that shows a white screen.",
        },
        { type: "h", text: "throw, try, catch, finally" },
        {
          type: "p",
          text: "`throw` stops the current function and unwinds the call stack until a `try` block catches it. `catch` receives what was thrown. `finally` **always** runs afterwards — success, caught error, even an early `return` — which makes it the place for cleanup like hiding a spinner or closing a connection.",
        },
        {
          type: "run",
          code: `function parseWebhook(body) {
  console.log("→ parsing", JSON.stringify(body));
  try {
    const payload = JSON.parse(body);         // may throw SyntaxError
    if (!payload.orderId) {
      throw new Error("Missing orderId");     // throw your own
    }
    return payload.orderId;
  } catch (err) {
    console.log("  caught", err.name + ":", err.message);
    return null;
  } finally {
    console.log("  finally: release lock");   // runs in every case
  }
}

console.log("result:", parseWebhook('{"orderId": "A-1"}'));
console.log("result:", parseWebhook('{"total": 12}'));
console.log("result:", parseWebhook("not json"));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Throw Error objects, not strings",
          text: "`throw \"Invalid email\"` works, but a string has no `name`, no `stack` and fails `instanceof Error` checks in logging tools like Sentry or Vercel's logs. Always `throw new Error(\"Invalid email\")` (or a subclass).",
        },
        { type: "h", text: "Built-in error types" },
        {
          type: "table",
          rows: [
            ["Type", "Typical cause"],
            ["`TypeError`", "Using a value the wrong way: reading a property of `undefined`, calling a non-function"],
            ["`ReferenceError`", "Using a variable that doesn't exist (typo, out of scope)"],
            ["`SyntaxError`", "Invalid code, or invalid input to `JSON.parse`"],
            ["`RangeError`", "A number outside the allowed range: `toFixed(200)`, `new Array(-1)`"],
            ["`AggregateError`", "Several errors at once, e.g. when every promise in `Promise.any` rejects"],
          ],
        },
        {
          type: "run",
          code: `const attempts = [
  () => { const client = null; return client.name; },
  () => totalAmount + 1, // never declared
  () => JSON.parse("{ bad json }"),
  () => (12.5).toFixed(200),
];

for (const attempt of attempts) {
  try {
    attempt();
  } catch (err) {
    console.log(err.name.padEnd(15), "|", err.message);
    console.log("   instanceof Error?", err instanceof Error);
  }
}`,
        },
        { type: "h", text: "Custom error classes" },
        {
          type: "p",
          text: "Extend `Error` to give failures a **type** your code can check with `instanceof`, plus extra fields (which form field, which HTTP status). Set `this.name` so logs show `ValidationError` instead of `Error`.",
        },
        {
          type: "run",
          code: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} \${id} not found\`);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

function handle(fn) {
  try {
    return fn();
  } catch (err) {
    if (err instanceof ValidationError) return \`400 — fix the "\${err.field}" field: \${err.message}\`;
    if (err instanceof NotFoundError) return \`\${err.status} — \${err.message}\`;
    throw err; // unknown problem: don't swallow it
  }
}

console.log(handle(() => { throw new ValidationError("email", "Email is required"); }));
console.log(handle(() => { throw new NotFoundError("Client", 42); }));
try {
  handle(() => { throw new TypeError("bug!"); });
} catch (err) {
  console.log("re-thrown:", err.name);
}`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Catch narrowly, re-throw the rest",
          text: "A `catch` that swallows everything hides real bugs. Handle the error types you *expect* and `throw err` for anything else so it reaches your error boundary and your logs.",
        },
        { type: "h", text: "Adding context with cause" },
        {
          type: "p",
          text: "Low-level errors are often cryptic (`fetch failed`, `ECONNRESET`). Wrap them in a higher-level message and keep the original in `cause` (ES2022), so logs show both *what you were doing* and *what actually broke*.",
        },
        {
          type: "run",
          code: `function fetchClient(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 42) resolve({ id, name: "Café Nordik" });
      else reject(new Error(\`Client \${id} not found (HTTP 404)\`));
    }, 50);
  });
}

async function loadDashboard(clientId) {
  try {
    const client = await fetchClient(clientId); // await turns a rejection into a throw
    return \`Dashboard for \${client.name}\`;
  } catch (err) {
    throw new Error(\`Could not load dashboard for client \${clientId}\`, { cause: err });
  }
}

console.log(await loadDashboard(42));
try {
  await loadDashboard(7);
} catch (err) {
  console.log(err.message);
  console.log("  cause:", err.cause.message);
}`,
        },
        {
          type: "code",
          lang: "js",
          title: "async gotcha",
          code: `try {
  saveInvoice(invoice);        // ❌ no await: the promise rejects LATER,
} catch (err) {                //    after this try/catch has already finished
  showToast("Save failed");    //    → never runs; you get an "unhandled rejection"
}

try {
  await saveInvoice(invoice);  // ✅ the rejection becomes a throw right here
} catch (err) {
  showToast("Save failed");
}`,
        },
        { type: "h", text: "Throw or return?" },
        {
          type: "p",
          text: "Not every failure is exceptional. A user typing an invalid email is *expected* — the caller needs to show a message, so return it as data. A database that's down or a bug in your code is *unexpected* — throw, and let a boundary higher up show a generic error page and log it.",
        },
        {
          type: "compare",
          left: {
            label: "Throw: unexpected failures",
            lang: "js",
            code: `function getEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(\`Missing env var \${name}\`);
  }
  return value;
}`,
          },
          right: {
            label: "Return: expected failures",
            lang: "js",
            code: `function validateEmail(email) {
  if (!email.includes("@")) {
    return { ok: false, error: "Invalid email" };
  }
  return { ok: true, value: email.trim() };
}`,
          },
        },
        {
          type: "callout",
          tone: "stack",
          title: "Your stack uses both styles",
          text: "**Supabase** never throws for query errors: it resolves to `{ data, error }`, and if you forget to check `error` you'll render `null` without noticing. **Next.js** recommends returning expected errors from Server Actions as values (shown in the form via `useActionState`), while uncaught exceptions bubble to the nearest `error.tsx` boundary — and in production their message is hidden from the browser. **Zod** offers both: `parse()` throws, `safeParse()` returns `{ success, data | error }`.",
        },
        { type: "h", text: "Validating input" },
        {
          type: "p",
          text: "Anything that crosses a boundary — form data, query strings, webhooks, JSON from an API — is untrusted. Validate it once, at the edge, with **guard clauses** that fail early; the rest of your code can then assume clean data. In TypeScript projects you'll usually reach for a schema library like Zod (TypeScript track), but the idea is the same.",
        },
        {
          type: "run",
          code: `function validateLead(input) {
  const errors = {};
  if (typeof input?.name !== "string" || input.name.trim() === "") {
    errors.name = "Name is required";
  }
  if (typeof input?.email !== "string" || !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(input.email)) {
    errors.email = "Email looks invalid";
  }
  const budget = Number(input?.budget);
  if (!Number.isFinite(budget) || budget < 500) {
    errors.budget = "Minimum budget is 500 $";
  }
  return Object.keys(errors).length === 0
    ? { ok: true, lead: { name: input.name.trim(), email: input.email.toLowerCase(), budget } }
    : { ok: false, errors };
}

console.log(validateLead({ name: " Julie ", email: "Julie@CafeNordik.ca", budget: "2500" }));
console.log(validateLead({ name: "", email: "nope", budget: "abc" }));
console.log(validateLead(null));`,
        },
        {
          type: "challenge",
          title: "Validate a booking request",
          prompt: "1. Create `class ValidationError extends Error` whose constructor takes `(field, message)`, sets `name` to `\"ValidationError\"` and stores `field`.\n2. Write `parseBooking(input)` that returns `{ client, date, guests }` or throws a `ValidationError`:\n- `input` must be an object (else field `\"input\"`)\n- `client`: non-empty string once trimmed (field `\"client\"`); return it trimmed\n- `date`: a string in `YYYY-MM-DD` format (field `\"date\"`)\n- `guests`: an **integer** from 1 to 20 (field `\"guests\"`)\n3. Write `safeParseBooking(input)` that never throws for invalid input: it returns `{ ok: true, booking }` or `{ ok: false, field, message }`.",
          starter: `class ValidationError extends Error {
  // constructor(field, message) { ... }
}

function parseBooking(input) {
  // validate input, client, date, guests — throw ValidationError on problems
  return { client: input.client, date: input.date, guests: input.guests };
}

function safeParseBooking(input) {
  // never throw for invalid input
  return { ok: true, booking: parseBooking(input) };
}`,
          solution: `class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function parseBooking(input) {
  if (typeof input !== "object" || input === null) {
    throw new ValidationError("input", "Expected an object");
  }
  const { client, date, guests } = input;
  if (typeof client !== "string" || client.trim() === "") {
    throw new ValidationError("client", "Client name is required");
  }
  if (typeof date !== "string" || !/^\\d{4}-\\d{2}-\\d{2}$/.test(date)) {
    throw new ValidationError("date", "Date must look like YYYY-MM-DD");
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 20) {
    throw new ValidationError("guests", "Guests must be a whole number from 1 to 20");
  }
  return { client: client.trim(), date, guests };
}

function safeParseBooking(input) {
  try {
    return { ok: true, booking: parseBooking(input) };
  } catch (err) {
    if (err instanceof ValidationError) {
      return { ok: false, field: err.field, message: err.message };
    }
    throw err; // a real bug: let it surface
  }
}`,
          tests: [
            {
              name: "a valid request is returned with the client name trimmed",
              code: `const b = parseBooking({ client: "  Clinique Boréale ", date: "2026-11-03", guests: 4 });
return b.client === "Clinique Boréale" && b.date === "2026-11-03" && b.guests === 4;`,
            },
            {
              name: "0 guests throws a ValidationError for the \"guests\" field",
              code: `try {
  parseBooking({ client: "Café Nordik", date: "2026-11-03", guests: 0 });
  return false;
} catch (err) {
  return err instanceof ValidationError && err instanceof Error && err.name === "ValidationError" && err.field === "guests";
}`,
            },
            {
              name: "2.5 guests and a date like \"03/11/2026\" are rejected",
              code: `let fields = [];
for (const input of [
  { client: "A", date: "2026-11-03", guests: 2.5 },
  { client: "A", date: "03/11/2026", guests: 2 },
]) {
  try { parseBooking(input); } catch (err) { fields.push(err.field); }
}
return fields.join(",") === "guests,date";`,
            },
            {
              name: "safeParseBooking reports a blank client without throwing",
              code: `const r = safeParseBooking({ client: "   ", date: "2026-11-03", guests: 2 });
return r.ok === false && r.field === "client" && typeof r.message === "string" && r.message.length > 0;`,
            },
            {
              name: "safeParseBooking(null) returns field \"input\" instead of crashing",
              code: `const r = safeParseBooking(null);
const good = safeParseBooking({ client: "Studio Érable", date: "2026-12-01", guests: 20 });
return r.ok === false && r.field === "input" && good.ok === true && good.booking.guests === 20;`,
            },
          ],
          hint: "In the class: `super(message)` first, then set `this.name` and `this.field`. Check `input` before destructuring it. `Number.isInteger(2.5)` is `false`. The date regex is `/^\\d{4}-\\d{2}-\\d{2}$/`. In `safeParseBooking`, wrap the call in try/catch and only convert `ValidationError`s.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "When does a `finally` block run?",
              options: [
                "Only when no error was thrown",
                "Only when an error was caught",
                "Always — after `try`/`catch`, even if they `return` or throw",
              ],
              answer: 2,
              why: "`finally` is guaranteed cleanup. It runs whether the `try` succeeded, the `catch` handled an error, or either of them returned early.",
            },
            {
              q: "A Supabase query targets a table that doesn't exist: `const { data, error } = await supabase.from(\"clientz\").select()`. What happens?",
              options: [
                "It throws, so you need try/catch",
                "`error` is set and `data` is `null` — you must check `error`",
                "`data` is `[]` and `error` is `undefined`",
              ],
              answer: 1,
              why: "supabase-js returns errors as values instead of throwing. Always check `if (error) …` before using `data`.",
            },
            {
              q: "Why write `throw new Error(\"Could not sync orders\", { cause: err })`?",
              options: [
                "To add context while keeping the original error (and its stack) attached",
                "To make the error asynchronous",
                "To hide the original error from logs",
              ],
              answer: 0,
              why: "`cause` chains errors: the new message explains what you were doing, `err.cause` keeps the low-level reason for debugging.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Dates, numbers & Intl
    // ─────────────────────────────────────────────────────────────
    {
      slug: "dates-numbers-intl",
      title: "Dates, numbers & Intl",
      summary: "Format money and dates for fr-CA and en-CA with Intl, and avoid the classic Date and time-zone traps.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "A Québec client expects `1 234,50 $` in French and `$1,234.50` in English. Their customers book appointments in Eastern time while your server on Vercel runs in UTC. Hand-rolling these rules with string concatenation always breaks somewhere. The built-in **`Intl`** APIs know the formatting rules of every locale, and a few habits keep `Date` from biting you.",
        },
        { type: "h", text: "Money with Intl.NumberFormat" },
        {
          type: "run",
          code: `const amount = 1234.5;

const frCAD = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" });
const enCAD = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });
const usCAD = new Intl.NumberFormat("en-US", { style: "currency", currency: "CAD" });

console.log("fr-CA:", frCAD.format(amount));
console.log("en-CA:", enCAD.format(amount));
console.log("en-US:", usCAD.format(amount), "← adds CA$ to disambiguate");

// Percentages, compact numbers, plain numbers
const pct = new Intl.NumberFormat("fr-CA", { style: "percent", maximumFractionDigits: 1 });
console.log("conversion rate:", pct.format(0.1534));
console.log("reach:", new Intl.NumberFormat("fr-CA", { notation: "compact" }).format(1250000));
console.log("reach:", new Intl.NumberFormat("en-CA", { notation: "compact" }).format(1250000));
console.log("clicks:", new Intl.NumberFormat("fr-CA").format(48210));`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Create formatters once",
          text: "Building an `Intl.NumberFormat` is relatively expensive; calling `.format()` is cheap. Create the formatter once (module level, or cached with `??=`) and reuse it in loops and table rows.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Formatted strings contain special spaces",
          text: "fr-CA output uses **non-breaking spaces** (`U+00A0`, sometimes the narrow `U+202F`) between thousands and before `$`. A test comparing against a string you typed with normal spaces will fail. Never parse formatted strings back into numbers — keep the number and format only for display.",
        },
        {
          type: "run",
          title: "money is not a float",
          code: `console.log(0.1 + 0.2);                   // 0.30000000000000004
console.log(19.99 * 100);                 // not exactly 1999

// Store and compute in integer cents, format at the very end
const lineItemsCents = [1999, 4550, 125];
const totalCents = lineItemsCents.reduce((sum, c) => sum + c, 0);
const taxCents = Math.round(totalCents * 0.14975);
const fmt = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" });
console.log("subtotal:", fmt.format(totalCents / 100));
console.log("taxes:   ", fmt.format(taxCents / 100));
console.log("total:   ", fmt.format((totalCents + taxCents) / 100));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Money in your APIs",
          text: "Shopify's GraphQL Admin API returns money as `MoneyV2 { amount, currencyCode }` where `amount` is a **decimal string** like `\"19.99\"` — convert carefully before doing math. Stripe uses integer cents (`1999`). In Postgres/Supabase, use `numeric` (or integer cents), never `float`, for money columns.",
        },
        { type: "h", text: "Date: the classic traps" },
        {
          type: "table",
          rows: [
            ["Trap", "Example", "What to do"],
            ["Months start at 0", "`new Date(2026, 1, 1)` is **February** 1", "Use ISO strings or comment the month"],
            ["Date-only strings are UTC", "`new Date(\"2026-10-14\")` = midnight UTC = evening of Oct 13 in Montréal", "Format with an explicit `timeZone`, or add a time: `\"2026-10-14T00:00\"` (local)"],
            ["Dates are mutable", "`d.setDate(d.getDate() + 3)` changes `d` itself", "Copy first: `new Date(d)`"],
            ["Comparing objects", "`dateA === dateB` compares references", "Compare `getTime()` values"],
            ["Invalid dates don't throw", "`new Date(\"14/10/2026\")` → Invalid Date", "Check `Number.isNaN(d.getTime())`"],
          ],
        },
        {
          type: "run",
          code: `const jan15 = new Date(2026, 0, 15);          // month 0 = January
console.log("month index:", jan15.getMonth());

const utcMidnight = new Date("2026-10-14");          // date-only → UTC
const localMidnight = new Date("2026-10-14T00:00");  // date + time → local time zone
console.log("date-only:", utcMidnight.toISOString());
console.log("local:    ", localMidnight.toISOString(), "(depends on your time zone)");

// Mutability
const due = new Date(2026, 9, 31);
const reminder = new Date(due);         // copy!
reminder.setDate(reminder.getDate() - 3);
console.log("due day:", due.getDate(), "| reminder day:", reminder.getDate());

// Comparing
const a = new Date("2026-10-14T12:00:00Z");
const b = new Date("2026-10-14T12:00:00Z");
console.log("a === b:", a === b, "| same time:", a.getTime() === b.getTime());
console.log("a before due?", a < due);  // < and > convert to numbers, so they work

// Invalid dates
const bad = new Date("14/10/2026");
console.log(String(bad), Number.isNaN(bad.getTime()));`,
        },
        { type: "h", text: "Intl.DateTimeFormat and time zones" },
        {
          type: "p",
          text: "A `Date` is just a moment in time (milliseconds since 1970-01-01 UTC). Which *day* and *hour* that moment is depends on the time zone you display it in. Pass `timeZone` explicitly — `\"America/Toronto\"` is the IANA zone used for Montréal and Québec City — so the result doesn't depend on whichever machine runs the code.",
        },
        {
          type: "run",
          code: `const meeting = new Date("2026-10-14T18:30:00Z"); // stored in UTC
const tz = "America/Toronto";

const show = (locale, options) =>
  new Intl.DateTimeFormat(locale, { timeZone: tz, ...options }).format(meeting);

console.log(show("fr-CA", { dateStyle: "full", timeStyle: "short" }));
console.log(show("en-CA", { dateStyle: "medium", timeStyle: "short" }));
console.log(show("fr-CA", { weekday: "long", day: "numeric", month: "long" }));
console.log(show("en-CA", {}), "← en-CA default is ISO-like");

// The date-only trap, made visible:
const dueDate = new Date("2026-10-14");
console.log("Montréal:", new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeZone: tz }).format(dueDate));
console.log("UTC:     ", new Intl.DateTimeFormat("fr-CA", { dateStyle: "long", timeZone: "UTC" }).format(dueDate));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Hydration mismatches in Next.js",
          text: "Vercel functions run in UTC; your visitor's browser runs in their local zone. A date formatted without `timeZone` during server rendering can differ from the one React renders in the browser, producing a hydration mismatch warning and a flicker. Store timestamps as `timestamptz` in Supabase (they come back as ISO strings in UTC) and format with an explicit `timeZone`.",
        },
        { type: "h", text: "Relative time, lists and plurals" },
        {
          type: "run",
          code: `const rtf = new Intl.RelativeTimeFormat("fr-CA", { numeric: "auto" });
console.log(rtf.format(-1, "day"), "|", rtf.format(3, "day"), "|", rtf.format(-2, "week"));

function timeAgo(date, now, locale = "fr-CA") {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  const fmt = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return fmt.format(Math.round(seconds / size), unit);
  }
  return fmt.format(seconds, "second");
}
const now = new Date("2026-10-14T15:00:00Z");
console.log(timeAgo(new Date("2026-10-14T12:00:00Z"), now));
console.log(timeAgo(new Date("2026-10-11T15:00:00Z"), now, "en-CA"));

// Lists: commas and the right conjunction
const clients = ["Café Nordik", "Studio Érable", "Clinique Boréale"];
console.log(new Intl.ListFormat("fr-CA", { type: "conjunction" }).format(clients));
console.log(new Intl.ListFormat("en-CA", { type: "conjunction" }).format(clients));

// Plurals: French treats 0 as singular, English as plural
const fr = new Intl.PluralRules("fr-CA");
const en = new Intl.PluralRules("en-CA");
console.log("0 →", fr.select(0), "(fr) vs", en.select(0), "(en)");`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Temporal is coming",
          text: "**Temporal** is the modern replacement for `Date`: immutable values, real time-zone support and separate types for plain dates vs exact instants. It has started shipping in browsers but isn't available everywhere yet (nor in Node 22). Until it is, use `Date` + `Intl` carefully, or a small library like `date-fns`.",
        },
        {
          type: "challenge",
          title: "Invoice formatting helpers",
          prompt: "Write two functions:\n- `formatCAD(cents, locale = \"fr-CA\")` takes an **integer amount in cents** and returns it formatted as Canadian dollars with `Intl.NumberFormat` (e.g. `123450` → `\"1 234,50 $\"` in fr-CA, `\"$1,234.50\"` in en-CA).\n- `daysBetween(fromIso, toIso)` takes two `\"YYYY-MM-DD\"` strings and returns the whole number of days from the first to the second (negative if `toIso` is earlier). It must give the same answer in every time zone.",
          starter: `function formatCAD(cents, locale = "fr-CA") {
  // return a formatted string
}

function daysBetween(fromIso, toIso) {
  // return a whole number of days
}`,
          solution: `function formatCAD(cents, locale = "fr-CA") {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CAD" }).format(cents / 100);
}

function daysBetween(fromIso, toIso) {
  const toUtc = (iso) => {
    const [year, month, day] = iso.split("-").map(Number);
    return Date.UTC(year, month - 1, day); // month is 0-based!
  };
  return Math.round((toUtc(toIso) - toUtc(fromIso)) / 86_400_000);
}`,
          tests: [
            {
              name: "formatCAD(123450, \"fr-CA\") gives 1 234,50 $ (spaces normalized)",
              code: `return formatCAD(123450, "fr-CA").replace(/\\s/g, " ") === "1 234,50 $";`,
            },
            {
              name: "formatCAD(123450, \"en-CA\") gives $1,234.50",
              code: `return formatCAD(123450, "en-CA") === "$1,234.50";`,
            },
            {
              name: "formatCAD defaults to fr-CA and handles small amounts (500 → 5,00 $)",
              code: `return formatCAD(500).replace(/\\s/g, " ") === "5,00 $";`,
            },
            {
              name: "daysBetween counts days, including across the March DST change",
              code: `return daysBetween("2026-03-01", "2026-03-31") === 30 && daysBetween("2026-03-07", "2026-03-09") === 2;`,
            },
            {
              name: "daysBetween is negative when the second date is earlier, 0 for the same day",
              code: `return daysBetween("2026-10-14", "2026-10-01") === -13 && daysBetween("2026-10-14", "2026-10-14") === 0;`,
            },
          ],
          hint: "Divide cents by 100 before formatting. For dates, convert both strings to UTC timestamps (`Date.UTC(year, month - 1, day)`), subtract, divide by `86_400_000` ms per day and `Math.round` the result.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which date does `new Date(2026, 1, 1)` represent?",
              options: ["January 1, 2026", "February 1, 2026", "Invalid Date"],
              answer: 1,
              why: "The month argument is 0-based: 0 = January, 1 = February. Days, however, start at 1.",
            },
            {
              q: "Why can `new Date(\"2026-10-14\")` display as October 13 for a user in Montréal?",
              options: [
                "Date-only ISO strings are parsed as midnight UTC, which is still October 13 in Eastern time",
                "fr-CA counts days from 0",
                "It's a bug in Intl.DateTimeFormat",
              ],
              answer: 0,
              why: "`\"YYYY-MM-DD\"` alone means midnight **UTC**. Displayed in `America/Toronto` (UTC−4 in October) that's 8 p.m. the previous day. Pass a `timeZone` or include a time.",
            },
            {
              q: "What's the safest way to store and compute invoice amounts?",
              options: [
                "Floats like `19.99`",
                "Formatted strings like `\"19,99 $\"`",
                "Integer cents like `1999`, formatted only for display",
              ],
              answer: 2,
              why: "Floats can't represent most decimal fractions exactly (`0.1 + 0.2 !== 0.3`). Integers are exact; `Intl.NumberFormat` handles the display.",
            },
          ],
        },
      ],
    },
  ],
};
