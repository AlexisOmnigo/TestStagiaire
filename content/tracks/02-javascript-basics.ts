import type { Track } from "../types";

export const track: Track = {
  slug: "javascript-basics",
  order: 2,
  title: "JavaScript Fundamentals",
  tagline: "The language everything else is built on",
  outcome: "Read and write everyday JavaScript: values, variables, conditions, loops, functions, arrays and objects.",
  badge: "JS",
  color: "#f7df1e",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Values & variables
    // ─────────────────────────────────────────────────────────────
    {
      slug: "values-and-variables",
      title: "Values & variables",
      summary: "Everything in a program is a value. Variables are names you give to values.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "A program is a list of instructions that create, transform and move **values** around. `42` is a value. `\"hello\"` is a value. `true` is a value. A **variable** is just a label that points at a value so you can use it later.",
        },
        {
          type: "code",
          lang: "js",
          title: "declaring variables",
          code: `const name = "Alexis";   // cannot be re-assigned
let visits = 0;          // can be re-assigned
visits = visits + 1;

var old = "avoid me";    // the pre-2015 way, function-scoped, has surprises`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rule of thumb",
          text: "Use `const` by default. Switch to `let` only when you *must* re-assign. Never use `var` in new code.",
        },
        { type: "h", text: "Try it" },
        {
          type: "p",
          text: "Edit the code below and press **Run** (or `Ctrl/⌘ + Enter`). `console.log` prints to the output panel — it's your best friend for understanding what code does.",
        },
        {
          type: "run",
          code: `const city = "Montréal";
let temperature = -12;

console.log("City:", city);
console.log("Temperature:", temperature);

temperature = temperature + 20;
console.log("After a warm day:", temperature);

// Uncomment the next line and run again — what happens?
// city = "Québec";`,
        },
        { type: "h", text: "const does not mean frozen" },
        {
          type: "p",
          text: "`const` protects the **label**, not the value. If the value is an object or array, you can still change what is *inside* it.",
        },
        {
          type: "run",
          code: `const cart = ["coffee"];
cart.push("croissant");   // allowed: we change the array's content
console.log(cart);

// cart = [];             // TypeError: Assignment to constant variable.`,
        },
        { type: "h", text: "Naming things" },
        {
          type: "list",
          items: [
            "Use `camelCase` for variables and functions: `invoiceTotal`, `isPaid`, `clientName`.",
            "Name booleans like yes/no questions: `isActive`, `hasPaid`, `canEdit`.",
            "Use `UPPER_SNAKE_CASE` for true constants that never change and are known before the program runs: `MAX_UPLOAD_MB`, `TAX_RATE_QC`.",
            "Names are case-sensitive: `total` and `Total` are two different variables.",
            "Prefer a long clear name (`unpaidInvoiceCount`) over a short cryptic one (`uic`). Your future self is the main reader.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "You'll see const everywhere in React",
          text: "In a React component you'll write `const [count, setCount] = useState(0);`. It's `const` even though the count changes — because every render runs the function again and creates **fresh** variables. Nothing is ever re-assigned inside one render.",
        },
        {
          type: "challenge",
          title: "Count the visits",
          prompt: "Declare a variable `visits` starting at `0`, then add `1` to it three times so it ends at `3`. Also declare a constant `site` equal to `\"omnigo.ca\"`.",
          starter: `// your code here
`,
          solution: `const site = "omnigo.ca";
let visits = 0;
visits = visits + 1;
visits += 1;
visits++;`,
          tests: [
            { name: "visits is 3", code: "return visits === 3;" },
            { name: 'site is "omnigo.ca"', code: 'return site === "omnigo.ca";' },
          ],
          hint: "`let` for the one that changes, `const` for the one that doesn't. `x += 1` and `x++` are shortcuts for `x = x + 1`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which keyword should you reach for first when declaring a variable?",
              options: ["var", "let", "const"],
              answer: 2,
              why: "`const` makes intent clear (this label won't be re-pointed) and prevents accidental re-assignment. Use `let` only when re-assigning.",
            },
            {
              q: "`const list = [1]; list.push(2);` — what happens?",
              options: ["TypeError", "list is now [1, 2]", "list is still [1]"],
              answer: 1,
              why: "`const` prevents re-assigning `list`, not mutating the array it points to.",
            },
            {
              q: "Which is the best name for a variable that tells whether an invoice was paid?",
              options: ["isPaid", "paid_status_flag", "p", "Invoice"],
              answer: 0,
              why: "Booleans read best as yes/no questions in `camelCase`: `if (isPaid) …` reads like English.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Types
    // ─────────────────────────────────────────────────────────────
    {
      slug: "types",
      title: "Types: strings, numbers & friends",
      summary: "Every value has a type that decides what you can do with it — and JavaScript has a few famous quirks.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Why care about types? Because the **type** of a value decides what operations make sense. You can divide a number, uppercase a string, or check a boolean. Most bugs in client projects are a type surprise: a price that arrives as the string `\"19.99\"`, an empty field that is `null` instead of `\"\"`, a total that shows `0.30000000000000004`.",
        },
        { type: "h", text: "Primitives vs objects" },
        {
          type: "p",
          text: "JavaScript has exactly **seven primitive types** — simple, immutable values — and then **objects**, which are everything else (arrays, functions, dates, maps, your own `{ … }` records).",
        },
        {
          type: "table",
          rows: [
            ["Type", "Example", "Typical use"],
            ["string", "`\"Acme Inc.\"`", "Text: names, emails, IDs, URLs"],
            ["number", "`42`, `19.99`, `-3`", "Integers *and* decimals — one type for both"],
            ["boolean", "`true`, `false`", "Yes/no flags: `isPaid`, `isAdmin`"],
            ["undefined", "`undefined`", "\"No value was ever given\" (JS sets it)"],
            ["null", "`null`", "\"Deliberately empty\" (you or the database set it)"],
            ["bigint", "`9007199254740993n`", "Integers too big for `number` (rare: huge IDs)"],
            ["symbol", "`Symbol(\"id\")`", "Unique keys, mostly used by libraries"],
            ["object", "`{ name: \"Acme\" }`, `[1, 2]`", "Everything else: records, lists, functions…"],
          ],
        },
        { type: "h", text: "Asking a value its type: typeof" },
        {
          type: "run",
          code: `console.log(typeof "Acme");        // "string"
console.log(typeof 19.99);         // "number"
console.log(typeof true);          // "boolean"
console.log(typeof undefined);     // "undefined"
console.log(typeof 10n);           // "bigint"
console.log(typeof Symbol("id"));  // "symbol"
console.log(typeof { a: 1 });      // "object"

// The quirks:
console.log(typeof null);          // "object"   ← a 1995 bug, kept forever
console.log(typeof [1, 2, 3]);     // "object"   ← arrays are objects
console.log(typeof function () {}); // "function" ← special-cased object

// The reliable checks:
console.log(Array.isArray([1, 2, 3]));  // true
const value = null;
console.log(value === null);            // true`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "typeof null === \"object\"",
          text: "This is a bug from the very first version of JavaScript that can never be fixed without breaking the web. To check for `null`, compare directly: `value === null`. To check for an array, use `Array.isArray(value)`.",
        },
        { type: "h", text: "Numbers: one type, a few traps" },
        {
          type: "p",
          text: "JavaScript stores every `number` as a 64-bit floating-point value (IEEE 754), the same as most languages' `double`. That's fast and handles decimals, but some decimals can't be stored exactly in binary — just like 1/3 can't be written exactly in decimal.",
        },
        {
          type: "run",
          code: `console.log(0.1 + 0.2);              // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3);      // false 😱

// Fix 1: round for display
console.log((0.1 + 0.2).toFixed(2)); // "0.30" (a string!)

// Fix 2 (best for money): work in cents, which are integers
const priceCents = 1999;              // 19.99 $
const totalCents = priceCents * 3;    // 5997 — exact
console.log(totalCents / 100);        // 59.97

// Integers are exact only up to 2^53 - 1
console.log(Number.MAX_SAFE_INTEGER);              // 9007199254740991
console.log(9007199254740992 === 9007199254740993); // true (!) precision lost
console.log(9007199254740992n + 1n);               // 9007199254740993n — bigint is exact

// You cannot mix bigint and number
try {
  console.log(10n + 1);
} catch (e) {
  console.log("Error:", e.message);
}

// Division by zero does not throw
console.log(1 / 0);   // Infinity`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Money in your stack",
          text: "Stripe sends amounts as integer **cents** (`1999`) precisely to avoid float errors. Shopify's GraphQL Admin API returns `MoneyV2.amount` as a **string** like `\"19.99\"` (a `Decimal` scalar), so you must convert it explicitly before doing math. For display, let `Intl.NumberFormat(\"fr-CA\", { style: \"currency\", currency: \"CAD\" })` format it — you'll get `19,99 $`.",
        },
        { type: "h", text: "NaN: \"Not a Number\" (that is a number)" },
        {
          type: "p",
          text: "When a math operation can't produce a meaningful number, you get `NaN`. It's contagious (anything + `NaN` is `NaN`) and it's the only value not equal to itself.",
        },
        {
          type: "run",
          code: `console.log(Number("42"));       // 42
console.log(Number(" 42 "));     // 42 (whitespace is trimmed)
console.log(Number("12px"));     // NaN
console.log(parseInt("12px"));   // 12 — reads digits until it can't
console.log(Number(""));         // 0  ← surprise: empty string becomes 0
console.log(Number(undefined));  // NaN

const qty = Number("three");
console.log(qty, typeof qty);    // NaN "number"
console.log(qty * 10 + 5);       // NaN — it spreads everywhere
console.log(qty === qty);        // false — NaN is never equal to anything
console.log(Number.isNaN(qty));  // true — the right way to check`,
        },
        { type: "h", text: "null vs undefined" },
        {
          type: "list",
          items: [
            "`undefined` means *nothing was ever assigned*: a declared-but-empty variable, a missing object property, a function that doesn't `return`.",
            "`null` means *someone deliberately said \"empty\"*. Databases use it: a Supabase row with no phone number gives you `phone: null`.",
            "Both are \"nothing\", and you'll often handle them together (see `??` in the next lesson).",
          ],
        },
        { type: "h", text: "Strings" },
        {
          type: "p",
          text: "Strings hold text. You can use `\"double\"`, `'single'` or `` `backtick` `` quotes. Strings are **immutable**: every method returns a *new* string and leaves the original untouched.",
        },
        {
          type: "run",
          code: `const email = "  Alexis@Omnigo.ca  ";

console.log(email.length);                 // 20 (spaces count)
const clean = email.trim().toLowerCase();
console.log(clean);                        // "alexis@omnigo.ca"
console.log(email);                        // unchanged — strings are immutable

console.log(clean.includes("@"));          // true
console.log(clean.startsWith("alexis"));   // true
console.log(clean.endsWith(".ca"));        // true
console.log(clean.indexOf("@"));           // 6 (-1 if not found)
console.log(clean.slice(0, 6));            // "alexis" (from index 0 up to, not including, 6)
console.log(clean.slice(-3));              // ".ca" (negative = from the end)
console.log(clean.split("@"));             // [ 'alexis', 'omnigo.ca' ]
console.log(clean[0], clean.at(-1));       // "a" "a"

console.log("Facture 42".replace("42", "43"));   // "Facture 43"
console.log("a-b-c".replaceAll("-", " / "));     // "a / b / c"
console.log(String(42).padStart(5, "0"));        // "00042" — invoice numbers!`,
        },
        { type: "h", text: "Template literals" },
        {
          type: "p",
          text: "Backtick strings let you embed any expression with `${…}` and span multiple lines. They replace almost all `+` concatenation.",
        },
        {
          type: "compare",
          left: {
            label: "Concatenation",
            lang: "js",
            code: `const msg = "Hi " + client + ", invoice #" +
  number + " of " + total + " $ is due " +
  "on " + dueDate + ".";`,
          },
          right: {
            label: "Template literal",
            lang: "js",
            code: `const msg = \`Hi \${client}, invoice #\${number} of \${total} $ is due on \${dueDate}.\`;`,
          },
        },
        {
          type: "run",
          code: `const client = "Voltix";
const items = 3;
const totalCents = 129900;

console.log(\`\${client} ordered \${items} item\${items === 1 ? "" : "s"}.\`);
console.log(\`Total: \${(totalCents / 100).toFixed(2)} $\`);

const formatter = new Intl.NumberFormat("fr-CA", { style: "currency", currency: "CAD" });
console.log(\`Formatted: \${formatter.format(totalCents / 100)}\`);

const emailBody = \`Bonjour \${client},

Your invoice is ready.
— The Omnigo team\`;
console.log(emailBody);`,
        },
        {
          type: "challenge",
          title: "Invoice label",
          prompt: "Write a function `invoiceLabel(client, cents)` that returns a label like `\"ACME: 12.50 $\"`. The client name must be trimmed and uppercased, and the amount (given in integer **cents**) must be shown in dollars with exactly two decimals.",
          starter: `function invoiceLabel(client, cents) {
  return client + ": " + cents + " $";
}

console.log(invoiceLabel("  acme  ", 1250));`,
          solution: `function invoiceLabel(client, cents) {
  const name = client.trim().toUpperCase();
  const dollars = (cents / 100).toFixed(2);
  return \`\${name}: \${dollars} $\`;
}

console.log(invoiceLabel("  acme  ", 1250));`,
          tests: [
            { name: 'invoiceLabel("acme", 1250) is "ACME: 12.50 $"', code: 'return invoiceLabel("acme", 1250) === "ACME: 12.50 $";' },
            { name: "trims spaces around the client name", code: 'return invoiceLabel("  voltix ", 999) === "VOLTIX: 9.99 $";' },
            { name: "whole dollars still show two decimals", code: 'return invoiceLabel("Studio Intik", 3000) === "STUDIO INTIK: 30.00 $";' },
            { name: "zero cents gives 0.00", code: 'return invoiceLabel("Free", 0) === "FREE: 0.00 $";' },
          ],
          hint: "Chain `.trim().toUpperCase()` on the name. Divide cents by `100`, then `.toFixed(2)` gives a string with exactly two decimals.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `typeof null` return?",
              options: ["\"null\"", "\"undefined\"", "\"object\"", "It throws an error"],
              answer: 2,
              why: "A historical bug kept for compatibility. Check for null with `value === null` instead.",
            },
            {
              q: "What's the safest way to handle money amounts in JavaScript?",
              options: [
                "Store integer cents and convert to dollars only for display",
                "Use regular decimals like 19.99 and hope for the best",
                "Store them as strings and add the strings together",
              ],
              answer: 0,
              why: "Integers (up to 2^53) are exact, so cents never suffer from `0.1 + 0.2` errors. Stripe does exactly this.",
            },
            {
              q: "`const s = \"hello\"; s.toUpperCase();` — what is `s` afterwards?",
              options: ["\"HELLO\"", "\"hello\"", "undefined"],
              answer: 1,
              why: "Strings are immutable. `toUpperCase()` returns a new string; you must store it: `const loud = s.toUpperCase()`.",
            },
            {
              q: "How do you correctly check whether `x` is NaN?",
              options: ["x === NaN", "x == NaN", "typeof x === \"NaN\"", "Number.isNaN(x)"],
              answer: 3,
              why: "`NaN` is never equal to anything, including itself, and its `typeof` is `\"number\"`. `Number.isNaN` is the reliable check.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Operators, comparisons & coercion
    // ─────────────────────────────────────────────────────────────
    {
      slug: "operators-and-coercion",
      title: "Operators, comparisons & coercion",
      summary: "Do math, compare values and combine conditions — and learn where JavaScript silently converts types behind your back.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Operators are the verbs of a language: `+`, `===`, `&&`… The twist in JavaScript is **coercion**: when an operator gets values of the wrong type, JS doesn't complain — it quietly converts them. Knowing *when* that happens is what separates \"why is my total `\"1005\"`?\" from shipping working code.",
        },
        { type: "h", text: "Arithmetic" },
        {
          type: "run",
          code: `console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333333333333335
console.log(10 % 3);   // 1  — remainder ("modulo")
console.log(2 ** 10);  // 1024 — exponent

// % is handy: is this row even or odd?
console.log(7 % 2 === 0 ? "even" : "odd");

// + is ALSO string concatenation. If either side is a string, it concatenates:
console.log("5" + 1);    // "51"
console.log(1 + 2 + "3"); // "33" (left to right: 1+2=3, then 3+"3")
// Other math operators convert strings to numbers:
console.log("5" - 1);    // 4
console.log("5" * "2");  // 10

// Convert explicitly and the mystery disappears:
const qtyFromForm = "5";
console.log(Number(qtyFromForm) + 1); // 6`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Form values are always strings",
          text: "Every value from an `<input>` — even `type=\"number\"` — and every `URLSearchParams` value is a string. In a Next.js Server Action, `formData.get(\"qty\")` returns a string (or `null`). Convert with `Number(…)` before doing math, or you'll get `\"5\" + 1 === \"51\"`.",
        },
        { type: "h", text: "Equality: === vs ==" },
        {
          type: "p",
          text: "`===` (strict equality) is true only if both values have the **same type and the same value**. `==` (loose equality) first coerces the values to a common type using rules nobody remembers. Look:",
        },
        {
          type: "table",
          rows: [
            ["Expression", "== (loose)", "=== (strict)"],
            ["`0` vs `\"\"`", "true 😬", "false"],
            ["`0` vs `\"0\"`", "true", "false"],
            ["`\"\"` vs `\"0\"`", "false (!)", "false"],
            ["`null` vs `undefined`", "true", "false"],
            ["`null` vs `0`", "false", "false"],
            ["`[]` vs `false`", "true 😱", "false"],
            ["`NaN` vs `NaN`", "false", "false"],
          ],
        },
        {
          type: "run",
          code: `console.log(0 == "");          // true
console.log(0 == "0");         // true
console.log("" == "0");        // false — so == isn't even transitive!
console.log([] == false);      // true

console.log(0 === "");         // false
console.log(1 === 1);          // true
console.log("1" === 1);        // false — different types

// Use !== for "not equal"
const status = "paid";
console.log(status !== "unpaid"); // true`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Always use === and !==",
          text: "Make it a habit. The only common exception you'll see in real code is `value == null`, which is a deliberate shortcut for `value === null || value === undefined`.",
        },
        { type: "h", text: "Other comparisons" },
        {
          type: "run",
          code: `console.log(100 > 99);        // true
console.log(100 >= 100);      // true

// Strings compare character by character (by code), not numerically:
console.log("10" < "9");      // true! "1" comes before "9"
console.log(10 < 9);          // false

// Mixed string/number: the string is converted to a number
console.log("10" < 9);        // false

// Uppercase letters come before lowercase ones:
console.log("Zoé" < "alex");  // true`,
        },
        { type: "h", text: "Truthy and falsy" },
        {
          type: "p",
          text: "When a value is used where a boolean is expected (in an `if`, with `!`, `&&`, `||`), JS converts it. Only **eight values** are *falsy* — memorize them, because everything else is *truthy*:",
        },
        {
          type: "list",
          items: [
            "`false`",
            "`0`, `-0` and `0n` (zero as number or bigint)",
            "`\"\"` (the empty string)",
            "`null`",
            "`undefined`",
            "`NaN`",
          ],
        },
        {
          type: "run",
          code: `console.log(Boolean(""));        // false
console.log(Boolean(0));         // false
console.log(Boolean(null));      // false

// Surprising truthy values:
console.log(Boolean("0"));       // true — non-empty string
console.log(Boolean("false"));   // true — non-empty string
console.log(Boolean([]));        // true — every object is truthy
console.log(Boolean({}));        // true

const cart = [];
if (cart) console.log("This runs even though the cart is empty!");
if (cart.length > 0) console.log("This does not run.");`,
        },
        { type: "h", text: "Logical operators: !, &&, ||, ??" },
        {
          type: "p",
          text: "`!` flips truthiness into a real boolean. `&&` and `||` are more subtle: they don't return `true`/`false` — they return **one of their operands**, and they *short-circuit* (stop as soon as the answer is known).",
        },
        {
          type: "list",
          items: [
            "`a && b` → if `a` is falsy, return `a`; otherwise return `b`. \"Do b only if a.\"",
            "`a || b` → if `a` is truthy, return `a`; otherwise return `b`. \"a, or fall back to b if a is *falsy*.\"",
            "`a ?? b` (nullish coalescing) → return `a` unless it's `null` or `undefined`, then `b`. \"a, or fall back only if a is *missing*.\"",
            "`!!a` → the boolean version of `a` (`!!\"hi\"` is `true`).",
          ],
        },
        {
          type: "run",
          code: `const client = { name: "Voltix", discount: 0, note: "" };

// || falls back on ANY falsy value — including legit 0 and ""
console.log(client.discount || 10);   // 10  ❌ we lost the real 0% discount
console.log(client.discount ?? 10);   // 0   ✅ only null/undefined fall back
console.log(client.missing ?? 10);    // 10

console.log(client.note || "No note"); // "No note" — here || is what we want

// && guards: only read .name if user exists
const user = null;
console.log(user && user.name);       // null — no crash
const admin = { name: "Alexis" };
console.log(admin && admin.name);     // "Alexis"

// ! and !!
console.log(!true, !0, !"hello");     // false true false
console.log(!!"hello", !!0);          // true false`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "|| vs ?? — the 0 bug",
          text: "`quantity || 1` turns a real quantity of `0` into `1`. `price || \"N/A\"` hides a free product. When `0`, `\"\"` or `false` are valid values, use `??`.",
        },
        { type: "h", text: "The ternary operator" },
        {
          type: "p",
          text: "`condition ? valueIfTrue : valueIfFalse` is an *expression* — it produces a value — so it fits inside template literals, JSX and assignments, where an `if` statement can't go.",
        },
        {
          type: "run",
          code: `const balance = 0;
const label = balance === 0 ? "Paid" : "Balance due";
console.log(label);

const count = 1;
console.log(\`\${count} booking\${count === 1 ? "" : "s"}\`);

// Readable as long as it's one level. Nested ternaries get unreadable fast:
const score = 72;
const grade = score >= 90 ? "A" : score >= 70 ? "B" : "C"; // ok... borderline
console.log(grade);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "In React you'll use these daily",
          text: "JSX can only hold expressions, so conditional UI is written with them: `{isLoading ? <Spinner /> : <Table />}` and `{error && <p>{error}</p>}`. Careful: `{items.length && <List />}` renders a literal `0` when the list is empty — use `items.length > 0 &&`.",
        },
        {
          type: "challenge",
          title: "Normalize an order",
          prompt: "Write `normalizeOrder(input)` that returns a new object with: `quantity` — the input quantity, defaulting to `1` **only** when it's missing (`null`/`undefined`); a quantity of `0` must stay `0`. `giftNote` — the note, or `\"No note\"` if it's empty or missing. `isVip` — a real boolean: `true` if `input.vipSince` has any truthy value. `shipping` — `0` if `input.subtotal` is `100` or more, otherwise `15`.",
          starter: `function normalizeOrder(input) {
  return {
    quantity: input.quantity || 1,
    giftNote: input.giftNote,
    isVip: input.vipSince,
    shipping: 15,
  };
}`,
          solution: `function normalizeOrder(input) {
  return {
    quantity: input.quantity ?? 1,
    giftNote: input.giftNote || "No note",
    isVip: !!input.vipSince,
    shipping: input.subtotal >= 100 ? 0 : 15,
  };
}`,
          tests: [
            { name: "quantity 0 stays 0", code: "return normalizeOrder({ quantity: 0, subtotal: 50 }).quantity === 0;" },
            { name: "missing quantity defaults to 1", code: "return normalizeOrder({ subtotal: 50 }).quantity === 1 && normalizeOrder({ quantity: null, subtotal: 50 }).quantity === 1;" },
            { name: 'empty gift note becomes "No note"', code: 'return normalizeOrder({ giftNote: "", subtotal: 50 }).giftNote === "No note" && normalizeOrder({ giftNote: "Merci!", subtotal: 50 }).giftNote === "Merci!";' },
            { name: "isVip is a real boolean (true or false)", code: 'return normalizeOrder({ vipSince: "2024-03-01", subtotal: 1 }).isVip === true && normalizeOrder({ subtotal: 1 }).isVip === false;' },
            { name: "free shipping starts at exactly 100", code: "return normalizeOrder({ subtotal: 100 }).shipping === 0 && normalizeOrder({ subtotal: 99.99 }).shipping === 15;" },
          ],
          hint: "`??` for the quantity, `||` for the note, `!!` to turn anything into a boolean, and a ternary for shipping. Remember the boundary: `>=`, not `>`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What is `\"5\" + 2`?",
              options: ["7", "\"52\"", "NaN", "TypeError"],
              answer: 1,
              why: "If either side of `+` is a string, `+` concatenates. Convert first: `Number(\"5\") + 2`.",
            },
            {
              q: "Which of these values is **truthy**?",
              options: ["0", "\"\"", "null", "\"0\""],
              answer: 3,
              why: "`\"0\"` is a non-empty string, so it's truthy. Only `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined` and `NaN` are falsy.",
            },
            {
              q: "`const stock = 0;` — what does `stock ?? 5` return?",
              options: ["0", "5", "false"],
              answer: 0,
              why: "`??` only falls back on `null` or `undefined`. `0` is a real value, so it's kept. `stock || 5` would return `5`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Conditionals
    // ─────────────────────────────────────────────────────────────
    {
      slug: "conditionals",
      title: "Conditionals: if, else & switch",
      summary: "Make your code take decisions — and keep those decisions readable with early returns and guard clauses.",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "Client apps are full of **business rules**: apply Québec taxes, block bookings in the past, only admins can delete invoices. Each rule is a decision, and decisions in code are conditionals. The goal isn't just correct branches — it's branches the next developer can read in five seconds.",
        },
        { type: "h", text: "if / else if / else" },
        {
          type: "run",
          code: `const subtotal = 240;

if (subtotal >= 500) {
  console.log("Free shipping + gift");
} else if (subtotal >= 100) {
  console.log("Free shipping");
} else {
  console.log("Shipping: 15 $");
}

// Conditions are checked top to bottom; the FIRST true branch wins.
// Order matters: if you test >= 100 first, the >= 500 branch never runs.`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Always use braces",
          text: "`if (x) doThing();` without `{ }` works, but adding a second line later silently puts it *outside* the `if`. Braces cost nothing. (Prettier and ESLint will help you here.)",
        },
        { type: "h", text: "switch: one value, many cases" },
        {
          type: "p",
          text: "When you compare the **same value** against many fixed options, `switch` reads better than a long `else if` chain. It compares with `===`.",
        },
        {
          type: "run",
          code: `function salesTaxRate(province) {
  switch (province) {
    case "QC":
      return 0.14975;  // GST 5% + QST 9.975%
    case "ON":
      return 0.13;     // HST
    case "BC":
      return 0.12;     // GST 5% + PST 7%
    case "AB":
    case "YT":         // several cases can share one branch
      return 0.05;     // GST only
    default:
      return 0.05;
  }
}

console.log(salesTaxRate("QC"));  // 0.14975
console.log(salesTaxRate("YT"));  // 0.05
console.log(salesTaxRate("qc"));  // 0.05 — "qc" !== "QC"! Normalize input first.

// Without return, you need break — or execution "falls through":
const status = "confirmed";
switch (status) {
  case "confirmed":
    console.log("Send confirmation email");
    // forgot break here...
  case "cancelled":
    console.log("Send cancellation email");  // ...so this ALSO runs 🐛
    break;
  default:
    console.log("Do nothing");
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Forgotten break",
          text: "Each `case` keeps running into the next one until it hits `break` or `return`. That's useful for grouping cases on purpose (like `AB`/`YT` above) and a classic bug when accidental.",
        },
        {
          type: "p",
          text: "For pure value-to-value mappings, a plain object lookup is often even shorter: `const rates = { QC: 0.14975, ON: 0.13 }; const rate = rates[province] ?? 0.05;` — you'll learn objects in the last lesson of this track.",
        },
        { type: "h", text: "Early returns & guard clauses" },
        {
          type: "p",
          text: "Deeply nested `if`s push the important code to the right and make you track every open brace in your head. A **guard clause** handles the \"invalid\" cases first and returns early, so the happy path is flat and at the bottom.",
        },
        {
          type: "compare",
          left: {
            label: "Nested (hard to follow)",
            lang: "js",
            code: `function canBook(user, slot) {
  if (user) {
    if (user.isActive) {
      if (slot.isFree) {
        if (slot.start > Date.now()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}`,
          },
          right: {
            label: "Guard clauses (flat)",
            lang: "js",
            code: `function canBook(user, slot) {
  if (!user) return false;
  if (!user.isActive) return false;
  if (!slot.isFree) return false;
  if (slot.start <= Date.now()) return false;

  return true;
}`,
          },
        },
        {
          type: "run",
          code: `function bookingMessage(booking) {
  if (!booking) return "No booking found.";
  if (booking.status === "cancelled") return "This booking was cancelled.";
  if (booking.guests > 8) return "Groups over 8: please call us.";

  // Happy path — no nesting needed
  return \`Booked for \${booking.guests} on \${booking.date}.\`;
}

console.log(bookingMessage(null));
console.log(bookingMessage({ status: "cancelled" }));
console.log(bookingMessage({ status: "confirmed", guests: 12 }));
console.log(bookingMessage({ status: "confirmed", guests: 4, date: "2026-11-20" }));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Guards protect every server endpoint",
          text: "In a Next.js Route Handler or Server Action you'll start with guards: `const { userId } = await auth(); if (!userId) return new Response(\"Unauthorized\", { status: 401 });` (Clerk), then validate the input, *then* touch Supabase. Bail out early, do the work last.",
        },
        {
          type: "challenge",
          title: "Score a lead",
          prompt: "Write `leadPriority(lead)` returning a string. If `lead` is missing or has no `email`, return `\"invalid\"`. Otherwise use `lead.budget` (treat a missing budget as `0`): `10000` or more → `\"hot\"`, `2000` or more → `\"warm\"`, else `\"cold\"`. Exception: a lead whose `source` is `\"referral\"` is never colder than `\"warm\"`.",
          starter: `function leadPriority(lead) {
  if (lead.budget > 10000) {
    return "hot";
  } else {
    return "cold";
  }
}`,
          solution: `function leadPriority(lead) {
  if (!lead || !lead.email) return "invalid";

  const budget = lead.budget ?? 0;
  if (budget >= 10000) return "hot";
  if (budget >= 2000) return "warm";
  if (lead.source === "referral") return "warm";
  return "cold";
}`,
          tests: [
            { name: "null lead or missing email is \"invalid\"", code: 'return leadPriority(null) === "invalid" && leadPriority({ budget: 50000 }) === "invalid";' },
            { name: "budget of exactly 10000 is \"hot\"", code: 'return leadPriority({ email: "a@b.ca", budget: 10000 }) === "hot";' },
            { name: "budget of 5000 is \"warm\"", code: 'return leadPriority({ email: "a@b.ca", budget: 5000 }) === "warm";' },
            { name: "small or missing budget is \"cold\"", code: 'return leadPriority({ email: "a@b.ca", budget: 500 }) === "cold" && leadPriority({ email: "a@b.ca" }) === "cold";' },
            { name: "a referral is at least \"warm\" but can still be \"hot\"", code: 'return leadPriority({ email: "a@b.ca", budget: 0, source: "referral" }) === "warm" && leadPriority({ email: "a@b.ca", budget: 20000, source: "referral" }) === "hot";' },
          ],
          hint: "Start with the guard: `if (!lead || !lead.email) return \"invalid\";`. Then check budgets from highest to lowest with `>=`, and handle the referral right before the final `return \"cold\"`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In an `if / else if` chain, how many branches run when several conditions are true?",
              options: ["All the true ones", "Only the first true one", "Only the last true one"],
              answer: 1,
              why: "Conditions are evaluated top to bottom and the first match wins; the rest are skipped. That's why order matters.",
            },
            {
              q: "What happens in a `switch` when a `case` has no `break` or `return`?",
              options: [
                "A syntax error",
                "The switch exits",
                "The default case runs",
                "Execution falls through into the next case",
              ],
              answer: 3,
              why: "Fall-through is by design (it lets cases share code) but is a frequent bug when the `break` was just forgotten.",
            },
            {
              q: "What's the main benefit of guard clauses?",
              options: [
                "They keep the happy path flat and handle invalid cases up front",
                "They make the code run faster",
                "They replace the need for else entirely in every situation",
              ],
              answer: 0,
              why: "It's about readability: each guard is one rule, and the main logic isn't buried under nested braces.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Loops
    // ─────────────────────────────────────────────────────────────
    {
      slug: "loops",
      title: "Loops: doing things many times",
      summary: "Repeat work with for, while and for...of — and avoid off-by-one errors, infinite loops and for...in on arrays.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Send a reminder for *each* unpaid invoice. Sum *every* line of a cart. Fetch *all* pages of a Shopify product list. Whenever you think \"for each…\" or \"until…\", you need a loop.",
        },
        { type: "h", text: "The classic for loop" },
        {
          type: "steps",
          items: [
            { title: "Initialize", text: "`let i = 0` runs once, before anything else. `i` is the index." },
            { title: "Check", text: "`i < invoices.length` is checked before **every** pass. If it's false, the loop ends." },
            { title: "Body", text: "The code inside `{ }` runs with the current `i`." },
            { title: "Update", text: "`i++` runs after each pass, then back to *Check*." },
          ],
        },
        {
          type: "run",
          code: `const invoices = [
  { number: 101, amount: 1200, paid: true },
  { number: 102, amount: 450, paid: false },
  { number: 103, amount: 3000, paid: false },
];

let unpaidTotal = 0;
for (let i = 0; i < invoices.length; i++) {
  const invoice = invoices[i];
  console.log(\`#\${invoice.number} (index \${i}): \${invoice.amount} $\`);
  if (!invoice.paid) {
    unpaidTotal += invoice.amount;
  }
}
console.log("Unpaid total:", unpaidTotal);`,
        },
        { type: "h", text: "Off-by-one errors" },
        {
          type: "p",
          text: "Arrays start at index `0`, so an array of 3 items has indexes `0`, `1`, `2`. The last index is always `length - 1`. Writing `<=` instead of `<` makes the loop run one time too many:",
        },
        {
          type: "run",
          code: `const leads = ["Anne", "Bruno", "Chloé"];

for (let i = 0; i <= leads.length; i++) {   // 🐛 <= should be <
  console.log(i, leads[i]);                 // the last pass prints: 3 undefined
}

// With objects this becomes a crash: invoices[3].amount →
// TypeError: Cannot read properties of undefined`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "The off-by-one checklist",
          text: "Start at `0`, stop with `< length`. If you see `<= length` or `length + 1`, be suspicious. Better yet: use `for...of` (below), which has no index to get wrong.",
        },
        { type: "h", text: "while: loop until something changes" },
        {
          type: "p",
          text: "Use `while` when you don't know the number of passes in advance — you just know when to stop.",
        },
        {
          type: "run",
          code: `let balance = 1000;
const payment = 300;
let month = 0;

while (balance > 0) {
  month++;
  balance -= payment;
  console.log(\`Month \${month}: balance \${Math.max(balance, 0)} $\`);
}
console.log(\`Paid off in \${month} months\`);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Infinite loops",
          text: "If the condition never becomes false (you forgot `balance -= payment`), the loop never ends and freezes the tab or the server. Always make sure something inside the loop moves you toward the exit. This runner stops code after a few seconds, but a browser or Node process won't.",
        },
        {
          type: "p",
          text: "Here's a real `while` use case: paginating an API. Shopify's GraphQL Admin API returns products in pages, with `pageInfo.hasNextPage` and an `endCursor` to request the next one. The fake API below behaves the same way:",
        },
        {
          type: "run",
          code: `// A fake paginated API (simulates network latency)
const pages = {
  start: { products: ["Mug", "T-shirt"], hasNextPage: true, endCursor: "c2" },
  c2: { products: ["Hoodie", "Cap"], hasNextPage: true, endCursor: "c3" },
  c3: { products: ["Sticker"], hasNextPage: false, endCursor: null },
};
async function fetchProducts(after) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return pages[after ?? "start"];
}

const all = [];
let cursor = null;
let hasNextPage = true;

while (hasNextPage) {
  const page = await fetchProducts(cursor);
  for (const product of page.products) {
    all.push(product);
  }
  hasNextPage = page.hasNextPage;
  cursor = page.endCursor;
}
console.log(\`Fetched \${all.length} products:\`, all);`,
        },
        { type: "h", text: "for...of: the everyday loop" },
        {
          type: "p",
          text: "`for...of` gives you each **value** of an array (or string, Map, Set…) directly. No index, no `length`, no off-by-one. It's what you'll write most of the time.",
        },
        {
          type: "run",
          code: `const products = ["Mug", "Hoodie", "Cap"];

for (const product of products) {
  console.log("Product:", product);
}

// Need the index too? Use .entries()
for (const [index, product] of products.entries()) {
  console.log(\`\${index + 1}. \${product}\`);
}

// Strings are iterable too
for (const letter of "Omni") {
  console.log(letter);
}`,
        },
        { type: "h", text: "for...in: for object keys — not arrays" },
        {
          type: "p",
          text: "`for...in` loops over the **keys** of an object. On arrays it technically works, but the keys are *strings* (`\"0\"`, `\"1\"`…), and it can also pick up extra properties someone added. It's a trap:",
        },
        {
          type: "run",
          code: `const client = { name: "Voltix", city: "Laval", plan: "Pro" };
for (const key in client) {
  console.log(key, "→", client[key]);  // fine for plain objects
}

const scores = [10, 20, 30];
for (const i in scores) {
  console.log(i + 1);   // "01", "11", "21" — i is a STRING!
}
for (const score of scores) {
  console.log(score + 1); // 11, 21, 31 — what you wanted
}`,
        },
        {
          type: "table",
          rows: [
            ["You want to…", "Use"],
            ["Go through every item of an array", "`for...of`"],
            ["Need the index too", "`for...of` with `.entries()`, or a classic `for`"],
            ["Loop until a condition changes (pages, retries)", "`while`"],
            ["Go through an object's keys and values", "`Object.entries()` + `for...of` (see the Objects lesson)"],
            ["Transform or filter a list into a new list", "`map` / `filter` — next track"],
          ],
        },
        { type: "h", text: "break and continue" },
        {
          type: "run",
          code: `const bookings = [
  { id: 1, status: "cancelled" },
  { id: 2, status: "confirmed" },
  { id: 3, status: "pending" },
  { id: 4, status: "confirmed" },
];

// continue: skip this item, go to the next one
for (const booking of bookings) {
  if (booking.status === "cancelled") continue;
  console.log("Remind booking", booking.id);
}

// break: stop the loop entirely
let firstPending = null;
for (const booking of bookings) {
  if (booking.status === "pending") {
    firstPending = booking;
    break;  // no need to look further
  }
}
console.log("First pending:", firstPending);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where loops show up in your stack",
          text: "In React you'll render lists with `items.map(…)` rather than a loop (it's an expression, so it fits in JSX). Plain loops shine in Node scripts, data migrations, seed scripts for Supabase and pagination like the Shopify example above.",
        },
        {
          type: "challenge",
          title: "Fix the invoice loops",
          prompt: "`totalUnpaid(invoices)` should return the sum of `amount` for invoices whose `status` is `\"unpaid\"` — but it crashes because of an off-by-one. Fix it. Then write `findInvoice(invoices, number)` that returns the invoice with that `number`, or `null` if there is none — stop looping as soon as you find it.",
          starter: `function totalUnpaid(invoices) {
  let total = 0;
  for (let i = 0; i <= invoices.length; i++) {
    if (invoices[i].status === "unpaid") {
      total += invoices[i].amount;
    }
  }
  return total;
}

function findInvoice(invoices, number) {
  // your code here
}`,
          solution: `function totalUnpaid(invoices) {
  let total = 0;
  for (const invoice of invoices) {
    if (invoice.status === "unpaid") {
      total += invoice.amount;
    }
  }
  return total;
}

function findInvoice(invoices, number) {
  for (const invoice of invoices) {
    if (invoice.number === number) return invoice;
  }
  return null;
}`,
          tests: [
            {
              name: "totalUnpaid sums only unpaid invoices",
              code: `const list = [
  { number: 1, amount: 100, status: "unpaid" },
  { number: 2, amount: 250, status: "paid" },
  { number: 3, amount: 40, status: "unpaid" },
  { number: 4, amount: 999, status: "cancelled" },
];
return totalUnpaid(list) === 140;`,
            },
            { name: "totalUnpaid of an empty list is 0", code: "return totalUnpaid([]) === 0;" },
            {
              name: "findInvoice returns the matching invoice object",
              code: `const list = [{ number: 7, amount: 10 }, { number: 8, amount: 20 }];
return findInvoice(list, 8) === list[1];`,
            },
            {
              name: "findInvoice returns null when there's no match",
              code: "return findInvoice([{ number: 7 }], 99) === null && findInvoice([], 1) === null;",
            },
          ],
          hint: "Replace the classic `for` with `for (const invoice of invoices)` — no index, no off-by-one. In `findInvoice`, `return` inside the loop exits immediately; put `return null` *after* the loop.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "An array has 5 items. What's the index of the last one?",
              options: ["5", "4", "6", "-1"],
              answer: 1,
              why: "Indexes start at 0, so the last one is `length - 1`. (`arr.at(-1)` is a handy shortcut to read it.)",
            },
            {
              q: "Why avoid `for...in` on arrays?",
              options: [
                "It's slower than every other loop",
                "It skips the first item",
                "It doesn't work in strict mode",
                "It gives string keys and can include non-index properties",
              ],
              answer: 3,
              why: "`for...in` is designed for object keys. On arrays, `i` is `\"0\"`, `\"1\"`… so `i + 1` concatenates. Use `for...of`.",
            },
            {
              q: "What does `continue` do inside a loop?",
              options: ["Skips to the next iteration", "Exits the loop", "Restarts the loop from the beginning"],
              answer: 0,
              why: "`continue` skips the rest of the current pass. `break` exits the loop entirely.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Functions
    // ─────────────────────────────────────────────────────────────
    {
      slug: "functions",
      title: "Functions",
      summary: "Package logic into named, reusable, testable pieces — and pass them around like any other value.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "A function gives a **name** to a piece of logic. Instead of copy-pasting the Québec tax calculation in five places (and fixing a bug in only four), you write `withTax(amount)` once. Functions are also how you **test** code: give inputs, check the output.",
        },
        { type: "h", text: "Declaring and calling" },
        {
          type: "code",
          lang: "js",
          title: "anatomy of a function",
          code: `//   name      parameters
function withTax(amount, rate) {
  const total = amount * (1 + rate);   // body
  return total;                        // the result handed back
}

//       arguments
withTax(100, 0.14975);   // → 114.975`,
        },
        {
          type: "p",
          text: "**Parameters** are the placeholder names in the definition; **arguments** are the actual values you pass when calling. Calling a function runs its body; `return` hands a value back to the caller and stops the function immediately.",
        },
        { type: "h", text: "Three ways to write a function" },
        {
          type: "run",
          code: `// 1. Function declaration
function fullName(first, last) {
  return first + " " + last;
}

// 2. Function expression — a function stored in a variable
const initials = function (first, last) {
  return first[0] + last[0];
};

// 3. Arrow function — the modern short form
const greet = (name) => {
  return \`Bonjour \${name}!\`;
};

// Arrow with a single expression: the braces AND return can go
const double = (n) => n * 2;

// Returning an object literal? Wrap it in parentheses,
// otherwise { } is read as the function body.
const makeLead = (email) => ({ email: email, status: "new" });

console.log(fullName("Marie", "Tremblay"));
console.log(initials("Marie", "Tremblay"));
console.log(greet("Marie"));
console.log(double(21));
console.log(makeLead("marie@client.ca"));`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Which one should I use?",
          text: "Both are everywhere in modern code. A common convention: `function` declarations for top-level named functions (they're **hoisted**, so you can call them before the line where they're defined), arrow functions for short callbacks. The other differences (like how `this` works) are covered in *JS under the hood*.",
        },
        { type: "h", text: "Parameters, defaults and missing arguments" },
        {
          type: "run",
          code: `function invoiceDue(amount, days = 30) {
  return \`\${amount} $ due in \${days} days\`;
}

console.log(invoiceDue(500));            // days uses the default: 30
console.log(invoiceDue(500, 15));        // 15
console.log(invoiceDue(500, undefined)); // undefined → default applies: 30
console.log(invoiceDue(500, null));      // null is a value → "null days" 🐛
console.log(invoiceDue());               // amount is undefined — no error!
console.log(invoiceDue(500, 15, "extra")); // extra arguments are ignored`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "JavaScript doesn't check your arguments",
          text: "Pass too few and the rest are `undefined`; pass too many and they're ignored; pass the wrong type and nothing complains. That's exactly the gap TypeScript fills later in the path.",
        },
        { type: "h", text: "Return values" },
        {
          type: "run",
          code: `function noReturn() {
  const x = 1 + 1;
}
console.log(noReturn());   // undefined — every function returns something

// Arrow function with braces needs an explicit return:
const triple = (n) => { n * 3 };      // 🐛 braces = body, no return
const tripleFixed = (n) => n * 3;      // ✅ concise body returns automatically
console.log(triple(5), tripleFixed(5)); // undefined 15

// return exits immediately — perfect for guard clauses
function discountFor(code) {
  if (!code) return 0;
  if (code === "OMNI10") return 0.1;
  return 0;
}
console.log(discountFor("OMNI10"));`,
        },
        { type: "h", text: "Pure functions vs side effects" },
        {
          type: "p",
          text: "A **pure function** only computes a result from its inputs: same inputs → same output, and it changes nothing outside itself. A **side effect** is anything else: modifying an outside variable or object, logging, writing to a database, sending an email, reading the current time.",
        },
        {
          type: "compare",
          left: {
            label: "Impure",
            lang: "js",
            code: `let total = 0;

function addToTotal(cart, price) {
  cart.push(price);   // mutates the caller's array
  total += price;     // changes an outside variable
  return total;       // depends on hidden state
}`,
          },
          right: {
            label: "Pure",
            lang: "js",
            code: `function cartTotal(prices) {
  let sum = 0;
  for (const p of prices) sum += p;
  return sum;  // depends ONLY on prices,
}              // changes nothing`,
          },
        },
        {
          type: "p",
          text: "Side effects aren't bad — saving an invoice *is* the point of the app. The skill is to keep the **calculations** pure (easy to test, easy to reuse) and push the side effects to the edges (the click handler, the Server Action, the API route).",
        },
        {
          type: "callout",
          tone: "stack",
          title: "React components must be pure",
          text: "React calls your component function whenever it wants to re-render, possibly twice in development (Strict Mode) to catch impurity. So rendering must be pure: same props and state → same JSX. Side effects (fetching, subscriptions, analytics) go in event handlers, `useEffect`, or on the server.",
        },
        { type: "h", text: "Functions are values (callbacks)" },
        {
          type: "p",
          text: "In JavaScript a function is a value like a number or a string: you can store it in a variable, put it in an array, and **pass it to another function**. A function you pass to be called later is a **callback**. This is the backbone of event handlers, `setTimeout`, `array.map`, and React's `onClick`.",
        },
        {
          type: "run",
          code: `const prices = [10, 25, 99];

// A function that takes another function as an argument
function applyToAll(list, transform) {
  const result = [];
  for (const item of list) {
    result.push(transform(item));  // call the callback for each item
  }
  return result;
}

const withQcTax = (price) => Math.round(price * 1.14975 * 100) / 100;
const inCents = (price) => price * 100;

console.log(applyToAll(prices, withQcTax)); // pass the function, don't call it!
console.log(applyToAll(prices, inCents));
console.log(applyToAll(prices, (p) => \`\${p} $\`)); // inline arrow callback

// Built-in functions take callbacks too
setTimeout(() => console.log("Reminder sent (100 ms later)"), 100);
await new Promise((resolve) => setTimeout(resolve, 150));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Pass the function, don't call it",
          text: "`applyToAll(prices, withQcTax)` passes the function. `applyToAll(prices, withQcTax())` *calls* it right away (with no argument) and passes its result. Same in React: `onClick={save}` ✅, `onClick={save()}` ❌ runs on every render.",
        },
        {
          type: "challenge",
          title: "Discounts and callbacks",
          prompt: "1) Write a **pure** function `applyDiscount(price, percent)` where `percent` defaults to `10`. It returns the discounted price rounded to 2 decimals (`Math.round(x * 100) / 100`). 2) Write `processOrders(orders, fn)` that returns a **new** array containing `fn(order)` for each order (call `fn` with just the order). It must not modify `orders`.",
          starter: `function applyDiscount(price, percent) {
  return price * percent / 100;
}

function processOrders(orders, fn) {
  return orders;
}`,
          solution: `function applyDiscount(price, percent = 10) {
  const discounted = price * (100 - percent) / 100;
  return Math.round(discounted * 100) / 100;
}

function processOrders(orders, fn) {
  const results = [];
  for (const order of orders) {
    results.push(fn(order));
  }
  return results;
}`,
          tests: [
            { name: "applyDiscount(50) uses the 10% default → 45", code: "return applyDiscount(50) === 45;" },
            { name: "applyDiscount(100, 25) → 75", code: "return applyDiscount(100, 25) === 75;" },
            { name: "rounds to 2 decimals: applyDiscount(19.99, 15) → 16.99", code: "return applyDiscount(19.99, 15) === 16.99;" },
            {
              name: "processOrders calls the callback for each order",
              code: `const out = processOrders([10, 20, 30], (x) => x * 2);
return out.length === 3 && out[0] === 20 && out[2] === 60;`,
            },
            {
              name: "processOrders returns a new array and leaves the input untouched",
              code: `const input = [100, 200];
const out = processOrders(input, applyDiscount);
return out !== input && input[0] === 100 && out[0] === 90 && out[1] === 180;`,
            },
          ],
          hint: "Default parameters look like `function f(a, b = 10)`. For `processOrders`, start with an empty array, loop with `for...of`, and `push(fn(order))`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `const half = (n) => { n / 2 };` return for `half(10)`?",
              options: ["5", "10", "undefined", "A syntax error"],
              answer: 2,
              why: "With braces, the arrow has a block body and needs an explicit `return`. Write `(n) => n / 2` or `(n) => { return n / 2; }`.",
            },
            {
              q: "`function f(x = 5) { return x; }` — what is `f(null)`?",
              options: ["5", "null", "undefined"],
              answer: 1,
              why: "Defaults only apply when the argument is `undefined` (or missing). `null` is a real value and is used as-is.",
            },
            {
              q: "Which function is pure?",
              options: [
                "One that saves the invoice to Supabase",
                "One that logs to the console",
                "One that pushes into an array it received",
                "One that returns the total of the prices it receives",
              ],
              answer: 3,
              why: "Saving, logging and mutating inputs are side effects. Computing a return value only from the arguments is pure.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Arrays
    // ─────────────────────────────────────────────────────────────
    {
      slug: "arrays",
      title: "Arrays",
      summary: "Ordered lists of values: add, remove, copy, search, sort — and know which methods change the original.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Almost every screen you build shows a **list**: leads in a CRM, products in a Shopify store, bookings for the week. In JavaScript, lists are **arrays**: ordered collections where each item has a numeric index starting at `0`.",
        },
        { type: "h", text: "Creating and reading" },
        {
          type: "run",
          code: `const products = ["Mug", "Hoodie", "Cap"];
const empty = [];
const prices = [12, 65, 25];

console.log(products.length);   // 3
console.log(products[0]);       // "Mug" — first item
console.log(products[2]);       // "Cap"
console.log(products.at(-1));   // "Cap" — last item, the modern way
console.log(products[products.length - 1]); // "Cap" — the classic way
console.log(products[10]);      // undefined — no error, just nothing there
console.log(empty.length);      // 0

// Replace an item by index
products[1] = "Zip hoodie";
console.log(products);

// An array can hold anything, including objects and other arrays
const lineItems = [
  { name: "Mug", qty: 2 },
  { name: "Cap", qty: 1 },
];
console.log(lineItems[1].name); // "Cap"`,
        },
        { type: "h", text: "Adding and removing at the ends" },
        {
          type: "table",
          rows: [
            ["Method", "Does", "Returns", "Mutates?"],
            ["`push(x)`", "Add to the end", "New length", "Yes"],
            ["`pop()`", "Remove from the end", "The removed item", "Yes"],
            ["`unshift(x)`", "Add to the start", "New length", "Yes"],
            ["`shift()`", "Remove from the start", "The removed item", "Yes"],
          ],
        },
        {
          type: "run",
          code: `const queue = ["lead-1", "lead-2"];

queue.push("lead-3");       // end
console.log(queue);         // [ 'lead-1', 'lead-2', 'lead-3' ]

queue.unshift("lead-0");    // start
console.log(queue);         // [ 'lead-0', 'lead-1', 'lead-2', 'lead-3' ]

const last = queue.pop();
const first = queue.shift();
console.log(first, last);   // lead-0 lead-3
console.log(queue);         // [ 'lead-1', 'lead-2' ]`,
        },
        { type: "h", text: "slice vs splice" },
        {
          type: "p",
          text: "The two most confused methods in JavaScript. **`slice`** *copies* a portion and leaves the original alone. **`splice`** *cuts* items out of (and/or inserts into) the original, and returns what it removed.",
        },
        {
          type: "run",
          code: `const week = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// slice(start, end) — end NOT included. Original untouched.
console.log(week.slice(1, 3));  // [ 'Tue', 'Wed' ]
console.log(week.slice(-2));    // [ 'Thu', 'Fri' ]
const copy = week.slice();      // full copy
console.log(week);              // unchanged

// splice(start, deleteCount, ...itemsToInsert) — CHANGES the original
const removed = week.splice(1, 2);           // remove 2 items at index 1
console.log(removed);           // [ 'Tue', 'Wed' ]
console.log(week);              // [ 'Mon', 'Thu', 'Fri' ]

week.splice(1, 0, "Holiday");   // insert without removing
console.log(week);              // [ 'Mon', 'Holiday', 'Thu', 'Fri' ]
console.log(copy);              // the slice copy still has all 5 days`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "React state: never mutate",
          text: "React only re-renders when state is a **new** array. `items.push(x); setItems(items)` does nothing visible. Write `setItems([...items, x])` instead. Modern JS (Node 20+, all current browsers) also has non-mutating twins: `toSorted()`, `toReversed()`, `toSpliced()` and `with(index, value)`.",
        },
        { type: "h", text: "Searching: includes and indexOf" },
        {
          type: "run",
          code: `const tags = ["vip", "newsletter", "québec"];

console.log(tags.includes("vip"));     // true
console.log(tags.includes("VIP"));     // false — case-sensitive
console.log(tags.indexOf("québec"));   // 2
console.log(tags.indexOf("ontario"));  // -1 means "not found"

if (tags.indexOf("vip") !== -1) console.log("old style check");
if (tags.includes("vip")) console.log("modern, clearer check");

// Objects are compared by reference, not by content:
const leads = [{ email: "a@b.ca" }];
console.log(leads.includes({ email: "a@b.ca" }));  // false!
// (To search by a property, use .find() — next track.)`,
        },
        { type: "h", text: "Sorting — and its famous gotcha" },
        {
          type: "p",
          text: "`sort()` without arguments converts every item to a **string** and sorts alphabetically by character code. Fine for simple words, wrong for numbers. And it **mutates** the array.",
        },
        {
          type: "run",
          code: `const amounts = [100, 25, 9, 1000];
amounts.sort();
console.log(amounts);   // [ 100, 1000, 25, 9 ] 😱 sorted as text: "100" < "1000" < "25" < "9"

// Pass a compare function: return negative if a goes first, positive if b goes first
amounts.sort((a, b) => a - b);   // ascending
console.log(amounts);   // [ 9, 25, 100, 1000 ]
amounts.sort((a, b) => b - a);   // descending
console.log(amounts);   // [ 1000, 100, 25, 9 ]

// Text with accents and mixed case: use localeCompare
const names = ["Zoé", "émilie", "Alex", "Éric"];
console.log([...names].sort());   // [ 'Alex', 'Zoé', 'Éric', 'émilie' ] — wrong for humans
console.log(names.toSorted((a, b) => a.localeCompare(b, "fr")));
// [ 'Alex', 'émilie', 'Éric', 'Zoé' ]

// Sort objects by a property
const products = [{ name: "Cap", price: 25 }, { name: "Mug", price: 12 }];
products.sort((a, b) => a.price - b.price);
console.log(products);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "sort() mutates",
          text: "`sorted = list.sort(…)` also reorders `list` itself — both names point to the same array. If you need to keep the original order, copy first (`list.slice().sort(…)`) or use `list.toSorted(…)`.",
        },
        { type: "h", text: "join and split" },
        {
          type: "run",
          code: `const tags = ["vip", "newsletter", "québec"];
console.log(tags.join(", "));    // "vip, newsletter, québec"
console.log(tags.join(""));      // "vipnewsletterquébec"

const csvLine = "Voltix,Laval,Pro";
const fields = csvLine.split(",");
console.log(fields);             // [ 'Voltix', 'Laval', 'Pro' ]
console.log(fields.join(" | "));`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Coming next: map, filter, reduce",
          text: "Most array work in real code uses methods that take a callback: `map` (transform each item), `filter` (keep some), `find`, `some`/`every`, `reduce`. They're the heart of the *Modern JavaScript* track — and they build on the loops and callbacks you've just learned.",
        },
        {
          type: "challenge",
          title: "Top products",
          prompt: "Write `topProducts(products, n)` that returns an array with the **names** of the `n` most expensive products, most expensive first. Each product looks like `{ name, price }` and prices are numbers. Don't modify the `products` array (its order must stay the same). If `n` is bigger than the list, return all names.",
          starter: `function topProducts(products, n) {
  products.sort();
  return products.slice(0, n);
}`,
          solution: `function topProducts(products, n) {
  const sorted = products.slice().sort((a, b) => b.price - a.price);
  const names = [];
  for (const product of sorted.slice(0, n)) {
    names.push(product.name);
  }
  return names;
}`,
          tests: [
            {
              name: "returns the 2 most expensive names, highest first",
              code: `const list = [
  { name: "Mug", price: 9 },
  { name: "Hoodie", price: 100 },
  { name: "Cap", price: 25 },
  { name: "Sticker", price: 3 },
];
return JSON.stringify(topProducts(list, 2)) === JSON.stringify(["Hoodie", "Cap"]);`,
            },
            {
              name: "does not reorder the original array",
              code: `const list = [{ name: "Mug", price: 9 }, { name: "Hoodie", price: 100 }];
topProducts(list, 1);
return list[0].name === "Mug" && list[1].name === "Hoodie";`,
            },
            {
              name: "n bigger than the list returns every name",
              code: `const list = [{ name: "A", price: 1 }, { name: "B", price: 2 }];
return JSON.stringify(topProducts(list, 10)) === JSON.stringify(["B", "A"]);`,
            },
            { name: "n = 0 returns an empty array", code: 'return topProducts([{ name: "A", price: 1 }], 0).length === 0;' },
          ],
          hint: "Copy with `products.slice()` before sorting. Sort descending with `(a, b) => b.price - a.price`. Then take the first `n` with `slice(0, n)` and collect each `.name` in a new array.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `[10, 1, 5].sort()` produce?",
              options: ["[1, 5, 10]", "[10, 5, 1]", "[1, 10, 5]", "[5, 10, 1]"],
              answer: 2,
              why: "Without a compare function, items are compared as strings: `\"1\" < \"10\" < \"5\"`. Use `.sort((a, b) => a - b)` for numbers.",
            },
            {
              q: "Which method returns a portion of an array **without** changing the original?",
              options: ["slice", "splice", "pop", "shift"],
              answer: 0,
              why: "`slice` copies. `splice`, `pop` and `shift` all mutate the original array.",
            },
            {
              q: "`[\"vip\", \"pro\"].indexOf(\"basic\")` returns…",
              options: ["undefined", "null", "-1", "false"],
              answer: 2,
              why: "`indexOf` returns `-1` when the item isn't found. For a yes/no question, `includes` is clearer.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Objects
    // ─────────────────────────────────────────────────────────────
    {
      slug: "objects",
      title: "Objects",
      summary: "Group related data under named keys, loop over them, copy them safely, and turn them into JSON.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "An array answers \"what's the 3rd item?\". An **object** answers \"what's this client's email?\". Objects group related values under named **keys** (also called properties). Almost all data you'll handle — API responses, Supabase rows, Shopify products, React props — is objects, often nested inside arrays.",
        },
        { type: "h", text: "Object literals and reading values" },
        {
          type: "run",
          code: `const client = {
  name: "Voltix",
  city: "Laval",
  monthlyBudget: 4500,
  isActive: true,
  "billing-email": "compta@voltix.ca",  // keys with dashes need quotes
};

// Dot notation: the everyday way
console.log(client.name);           // "Voltix"

// Bracket notation: for keys stored in a variable or with special characters
console.log(client["billing-email"]);
const field = "city";
console.log(client[field]);         // "Laval" — client.field would look for a key named "field"

// Missing keys give undefined, not an error
console.log(client.phone);          // undefined`,
        },
        { type: "h", text: "Adding, updating and deleting keys" },
        {
          type: "run",
          code: `const lead = { email: "marie@client.ca" };

lead.status = "new";            // add
lead.status = "contacted";      // update
lead["source"] = "LinkedIn";    // add with brackets
console.log(lead);

delete lead.source;             // remove a key
console.log(lead);

// Does a key exist?
console.log("status" in lead);           // true
console.log(Object.hasOwn(lead, "source")); // false

// Computed key names
const channel = "meta";
const spend = { [channel]: 1200 };
console.log(spend);              // { meta: 1200 }`,
        },
        { type: "h", text: "Nesting" },
        {
          type: "run",
          code: `const order = {
  id: "ORD-1042",
  customer: { name: "Studio Intik", address: { city: "Montréal", postal: "H2X 1Y4" } },
  items: [
    { sku: "MUG-01", qty: 2, price: 12 },
    { sku: "CAP-02", qty: 1, price: 25 },
  ],
};

console.log(order.customer.address.city);  // "Montréal"
console.log(order.items[1].sku);           // "CAP-02"
console.log(order.items.length);           // 2

// Reading through something that doesn't exist crashes:
try {
  console.log(order.shipping.carrier);
} catch (e) {
  console.log("Error:", e.message);
}
// The fix is optional chaining (?.), covered in the Modern JS track:
// order.shipping?.carrier → undefined instead of a crash`,
        },
        { type: "h", text: "Methods" },
        {
          type: "p",
          text: "A function stored in an object is called a **method**. Inside it, `this` refers to the object the method was called on. (How `this` really works has a whole lesson in *JS under the hood* — for now, just this simple case.)",
        },
        {
          type: "run",
          code: `const invoice = {
  number: 1042,
  amount: 800,
  taxRate: 0.14975,
  total() {
    return Math.round(this.amount * (1 + this.taxRate) * 100) / 100;
  },
  describe() {
    return \`Invoice #\${this.number}: \${this.total()} $\`;
  },
};

console.log(invoice.total());     // 919.8
console.log(invoice.describe());
// Built-in values have methods too: "abc".toUpperCase(), [1, 2].join("-")`,
        },
        { type: "h", text: "Looping: Object.keys, values, entries" },
        {
          type: "run",
          code: `const adSpend = { google: 2400, meta: 1800, linkedin: 600 };

console.log(Object.keys(adSpend));    // [ 'google', 'meta', 'linkedin' ]
console.log(Object.values(adSpend));  // [ 2400, 1800, 600 ]
console.log(Object.entries(adSpend)); // [ [ 'google', 2400 ], ... ]

// entries + for...of + destructuring = the cleanest way to loop over an object
let total = 0;
for (const [channel, amount] of Object.entries(adSpend)) {
  console.log(\`\${channel.padEnd(10)} \${amount} $\`);
  total += amount;
}
console.log("Total:", total);

// How many keys?
console.log(Object.keys(adSpend).length);  // 3

// And back: turn [key, value] pairs into an object
console.log(Object.fromEntries([["qc", 0.14975], ["on", 0.13]]));`,
        },
        { type: "h", text: "References vs copies" },
        {
          type: "p",
          text: "This is the single most important idea of the lesson. A variable doesn't *contain* an object — it holds a **reference** (an address) to it. Assigning an object to another variable copies the reference, not the object. Both names now point to the **same** object.",
        },
        {
          type: "run",
          code: `const original = { name: "Voltix", plan: "Basic" };
const alias = original;     // NOT a copy — same object
alias.plan = "Pro";
console.log(original.plan); // "Pro" 😮 — changed through the other name

// === on objects compares references, not contents
console.log({ a: 1 } === { a: 1 });  // false — two different objects
console.log(alias === original);     // true  — same object

// Shallow copy: a new top-level object
const copy = { ...original };          // spread (or Object.assign({}, original))
copy.plan = "Enterprise";
console.log(original.plan, copy.plan); // "Pro" "Enterprise" ✅

// ...but nested objects/arrays are still SHARED in a shallow copy
const client = { name: "Voltix", tags: ["vip"] };
const shallow = { ...client };
shallow.tags.push("newsletter");
console.log(client.tags);              // [ 'vip', 'newsletter' ] 😬

// Copy the nested part too — or deep clone everything
const safe = { ...client, tags: [...client.tags, "québec"] };
const deep = structuredClone(client);
deep.tags.push("deep-only");
console.log(client.tags, safe.tags, deep.tags);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Why React insists on new objects",
          text: "React decides whether state changed by comparing references (`Object.is`). `client.name = \"New\"; setClient(client)` passes the *same* reference, so React may skip the re-render. Write `setClient({ ...client, name: \"New\" })` — a new object — and update nested arrays the same way.",
        },
        { type: "h", text: "JSON: objects as text" },
        {
          type: "p",
          text: "**JSON** (JavaScript Object Notation) is the text format every API speaks. `JSON.stringify` turns a value into a JSON string (to send or store it); `JSON.parse` turns a JSON string back into values. JSON is stricter than JS: keys must be double-quoted, and there are no functions, `undefined`, dates or comments.",
        },
        {
          type: "run",
          code: `const booking = {
  id: 7,
  client: "Paysages Boudreau",
  date: new Date("2026-11-20T14:00:00Z"),
  notes: undefined,
  confirm() {},
};

const json = JSON.stringify(booking);
console.log(json);
// date became a string, notes and confirm disappeared

console.log(JSON.stringify({ a: 1, b: [1, 2] }, null, 2)); // pretty-printed

const back = JSON.parse(json);
console.log(typeof back.date);  // "string" — not a Date anymore!
console.log(new Date(back.date).getUTCFullYear()); // convert it back yourself

// Invalid JSON throws — always guard parse() on outside input
try {
  JSON.parse("{ name: 'Voltix' }");  // keys and strings need double quotes
} catch (e) {
  console.log("Invalid JSON:", e.name);
}

// JSON round-trip is also a (limited) deep copy:
const deepCopy = JSON.parse(JSON.stringify({ tags: ["vip"] }));
console.log(deepCopy);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "JSON is everywhere in your stack",
          text: "`await res.json()` parses an API response; a Next.js Route Handler's `Response.json(data)` stringifies one. Supabase returns rows as JSON, so a `timestamptz` column like `created_at` arrives as a string such as `\"2026-10-14T13:05:00+00:00\"`, not a `Date`. And a Postgres `jsonb` column stores exactly what `JSON.stringify` would produce.",
        },
        {
          type: "challenge",
          title: "Tag a client without side effects",
          prompt: "Write `withTag(client, tag)` that returns a **new** client object whose `tags` array includes `tag`. The original `client` and its `tags` array must stay unchanged. If the tag is already there, don't add it twice. All other fields must be kept.",
          starter: `function withTag(client, tag) {
  client.tags.push(tag);
  return client;
}`,
          solution: `function withTag(client, tag) {
  if (client.tags.includes(tag)) {
    return { ...client, tags: [...client.tags] };
  }
  return { ...client, tags: [...client.tags, tag] };
}`,
          tests: [
            {
              name: "the returned client has the new tag",
              code: `const c = { name: "Voltix", tags: ["vip"] };
return withTag(c, "newsletter").tags.includes("newsletter");`,
            },
            {
              name: "the original client and its tags array are unchanged",
              code: `const c = { name: "Voltix", tags: ["vip"] };
const result = withTag(c, "newsletter");
return result !== c && result.tags !== c.tags && c.tags.length === 1;`,
            },
            {
              name: "other fields are preserved",
              code: `const c = { name: "Voltix", city: "Laval", tags: [] };
const result = withTag(c, "vip");
return result.name === "Voltix" && result.city === "Laval";`,
            },
            {
              name: "an existing tag is not duplicated",
              code: `const c = { name: "Voltix", tags: ["vip"] };
const result = withTag(c, "vip");
return result.tags.length === 1 && result.tags[0] === "vip";`,
            },
          ],
          hint: "A shallow copy `{ ...client }` still shares the `tags` array — so copy the array too: `{ ...client, tags: [...client.tags, tag] }`. Check `includes` first to avoid duplicates.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `{ id: 1 } === { id: 1 }` return?",
              options: ["true", "false", "It throws"],
              answer: 1,
              why: "`===` on objects compares references. These are two different objects that happen to have the same content.",
            },
            {
              q: "`const key = \"city\";` — how do you read the `city` property of `client` using `key`?",
              options: ["client.key", "client.[key]", "client{key}", "client[key]"],
              answer: 3,
              why: "Bracket notation evaluates the expression inside. `client.key` looks for a property literally named `\"key\"`.",
            },
            {
              q: "`const b = { ...a };` where `a.tags` is an array. You `b.tags.push(\"x\")`. What happens to `a.tags`?",
              options: [
                "It also contains \"x\" — the shallow copy shares the nested array",
                "It's unchanged — spread copies everything deeply",
                "It throws because a is const",
              ],
              answer: 0,
              why: "Spread makes a shallow copy: top-level keys are copied, but nested objects and arrays are still shared references. Copy them too, or use `structuredClone`.",
            },
            {
              q: "What does `JSON.stringify({ a: 1, b: undefined })` produce?",
              options: ["'{\"a\":1,\"b\":undefined}'", "'{\"a\":1,\"b\":null}'", "'{\"a\":1}'", "It throws"],
              answer: 2,
              why: "JSON has no `undefined`, so keys with `undefined` values are dropped from objects. (In arrays they become `null`.)",
            },
          ],
        },
      ],
    },
  ],
};
