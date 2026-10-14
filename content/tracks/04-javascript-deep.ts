import type { Track } from "../types";

export const track: Track = {
  slug: "javascript-deep",
  order: 4,
  title: "JavaScript Under the Hood",
  tagline: "Scope, closures, this, prototypes and the event loop, demystified",
  outcome:
    "Predict what any JavaScript snippet will do (including the log order of async code) and confidently debug closure, `this`, mutation and promise bugs.",
  badge: "JS+",
  color: "#f59e0b",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Scope & hoisting
    // ─────────────────────────────────────────────────────────────
    {
      slug: "scope-and-hoisting",
      title: "Scope & hoisting",
      summary: "Where a variable is visible, when it starts to exist, and why `let`/`const` replaced `var`.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "\"Why is this variable `undefined` here?\" and \"why does this throw `ReferenceError`?\" are two of the most common questions in JavaScript. Both are answered by **scope** (where a name is visible) and **hoisting** (when a name starts to exist). Once you know the rules, these errors stop being mysterious and start being predictable.",
        },
        { type: "h", text: "Three kinds of scope" },
        {
          type: "list",
          items: [
            "**Module / global scope**: the top level of a file. In ES modules (every file in a Next.js or modern Node project), top-level names are private to that file unless you `export` them.",
            "**Function scope**: everything declared inside a function lives only inside that function. `var` only respects this kind of scope.",
            "**Block scope**: any `{ ... }`: the body of an `if`, a `for`, a `while`, or a bare block. `let`, `const` and `class` are block-scoped.",
          ],
        },
        {
          type: "run",
          title: "var leaks out of blocks, let does not",
          code: `function applyDiscount(total, isVip) {
  if (isVip) {
    var label = "VIP";     // function-scoped: visible in the whole function
    let rate = 0.15;       // block-scoped: only exists inside this if
    total = total * (1 - rate);
  }
  console.log("label after the if:", label);
  try {
    console.log(rate);
  } catch (e) {
    console.log("rate after the if →", e.constructor.name + ":", e.message);
  }
  return total;
}

console.log(applyDiscount(1000, true));
console.log("---");
console.log(applyDiscount(1000, false)); // label exists but was never assigned`,
        },
        { type: "h", text: "Lexical scope: scopes nest like boxes" },
        {
          type: "p",
          text: "When JavaScript meets a name, it looks in the current scope, then in the enclosing scope, then the next one out, up to the module level. That path is the **scope chain**. The key word is **lexical**: the chain is decided by where the function is *written* in the source code, not by where it is *called* from.",
        },
        {
          type: "run",
          code: `const agency = "Omnigo";

function makeReportTitle(client) {
  const year = 2026;
  function title() {
    // title looks in: its own scope → makeReportTitle → module level
    return agency + " × " + client + " — report " + year;
  }
  return title();
}

function somewhereElse() {
  const year = 1999;               // irrelevant to title(): it was not WRITTEN in here
  return makeReportTitle("Atelier Nordik");
}

console.log(makeReportTitle("Boulangerie Lamarre"));
console.log(somewhereElse());`,
        },
        { type: "h", text: "Shadowing" },
        {
          type: "p",
          text: "If an inner scope declares a name that already exists outside, the inner one **shadows** (hides) the outer one inside that scope. It is legal, but it is a classic source of \"why didn't my variable change?\" bugs.",
        },
        {
          type: "run",
          code: `let status = "draft";

function publish() {
  let status = "published";   // a NEW variable that hides the outer one
  console.log("inside publish:", status);
}

publish();
console.log("outside:", status); // still "draft": publish never touched it`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Accidental shadowing",
          text: "It often sneaks in with common names: `const data = await getLeads()` at the top of a component, then `.then((data) => ...)` lower down. Inside the callback, `data` is the callback's parameter, not your outer variable. ESLint's `no-shadow` rule flags it.",
        },
        { type: "h", text: "Hoisting: what exists before its line runs" },
        {
          type: "p",
          text: "Before running a scope, the engine scans it and registers every declaration in it. That is **hoisting**: declarations are known from the very top of their scope. What differs is the *initial value* each kind of declaration gets.",
        },
        {
          type: "table",
          rows: [
            ["Declaration", "Hoisted?", "Before its line runs, it is…"],
            ["`function save() {}`", "Yes", "the complete function: you can call it"],
            ["`var x = 1`", "Yes", "`undefined` (the name exists, the value doesn't yet)"],
            ["`let` / `const` / `class`", "Yes", "uninitialized: touching it throws `ReferenceError` (TDZ)"],
            ["`const fn = () => {}`", "Follows `const`", "uninitialized: calling it early throws"],
          ],
        },
        {
          type: "run",
          code: `console.log(formatPrice(19.5));   // works: function declarations are fully hoisted

function formatPrice(n) {
  return n.toFixed(2) + " $";
}

console.log(taxRate);              // undefined: var is hoisted, its value is not
var taxRate = 0.14975;

try {
  console.log(currency);           // in the temporal dead zone
} catch (e) {
  console.log(e.constructor.name + ":", e.message);
}
const currency = "CAD";

try {
  console.log(toCents(10));        // an arrow in a const follows const rules
} catch (e) {
  console.log(e.constructor.name + ":", e.message);
}
const toCents = (n) => Math.round(n * 100);`,
        },
        { type: "h", text: "The temporal dead zone (TDZ)" },
        {
          type: "p",
          text: "The TDZ is the period between the start of a block and the moment the `let`/`const` line actually *executes*. It is about **time**, not position: a function may mention a `const` that is declared further down, as long as the function is *called* after that line has run.",
        },
        {
          type: "run",
          code: `function describeTotal() {
  return "Total: " + total + " $";  // refers to a const declared below
}

// Calling describeTotal() here would throw: total is still in its TDZ.
const total = 250;

console.log(describeTotal());       // fine: by now total is initialized`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Why the TDZ is a feature",
          text: "With `var`, reading a variable too early silently gives `undefined`, and the bug surfaces far away as `NaN` or `\"undefined\"` in an invoice. The TDZ turns that into a loud error at the exact line. That's one of the reasons `var` has no place in new code.",
        },
        {
          type: "compare",
          left: {
            label: "var: leaks and can be re-declared",
            lang: "js",
            code: `for (var i = 0; i < 3; i++) {}
console.log(i);   // 3: i leaked out of the loop

var client = "Nordik";
var client = "Lamarre"; // no error: silently overwritten`,
          },
          right: {
            label: "let / const: scoped and strict",
            lang: "js",
            code: `for (let i = 0; i < 3; i++) {}
console.log(i);   // ReferenceError: i is not defined

let client = "Nordik";
let client = "Lamarre"; // SyntaxError: already declared`,
          },
        },
        {
          type: "callout",
          tone: "stack",
          title: "In your projects",
          text: "Every `.ts`/`.tsx` file in Next.js is an ES module, so a `const supabase = createClient(...)` at the top of `lib/supabase.ts` is invisible to other files until you `export` it. Modules are also always in strict mode. In an old-school `<script>` tag, a top-level `var` would even become `window.x`: one more reason to forget `var` exists.",
        },
        {
          type: "challenge",
          title: "Fix three scope bugs",
          prompt: "This billing code has three scope bugs. Fix them so that: `addInvoice(amount)` adds to the shared `totalRevenue` and returns the new running total; `invoiceHeader(client)` returns `\"INV-\"` followed by the client name in uppercase; `lateFee(daysLate)` returns `50` when more than 30 days late, otherwise `0`.",
          starter: `let totalRevenue = 0;

function addInvoice(amount) {
  let totalRevenue = 0;
  totalRevenue += amount;
  return totalRevenue;
}

function invoiceHeader(client) {
  const header = prefix + client.toUpperCase();
  const prefix = "INV-";
  return header;
}

function lateFee(daysLate) {
  if (daysLate > 30) {
    const fee = 50;
  } else {
    const fee = 0;
  }
  return fee;
}
`,
          solution: `let totalRevenue = 0;

function addInvoice(amount) {
  totalRevenue += amount;   // no inner declaration: we update the outer variable
  return totalRevenue;
}

function invoiceHeader(client) {
  const prefix = "INV-";    // declared before it is used: no TDZ
  const header = prefix + client.toUpperCase();
  return header;
}

function lateFee(daysLate) {
  let fee;                  // declared in the function's scope, assigned in the blocks
  if (daysLate > 30) {
    fee = 50;
  } else {
    fee = 0;
  }
  return fee;
}
`,
          tests: [
            {
              name: "addInvoice keeps a running total across calls",
              code: `const a = addInvoice(100);
const b = addInvoice(50);
return b - a === 50 && totalRevenue === b;`,
            },
            {
              name: 'invoiceHeader("atelier nordik") returns "INV-ATELIER NORDIK"',
              code: `return invoiceHeader("atelier nordik") === "INV-ATELIER NORDIK";`,
            },
            { name: "lateFee(45) is 50", code: `return lateFee(45) === 50;` },
            { name: "lateFee(30) is 0 (exactly 30 days is not late yet)", code: `return lateFee(30) === 0 && lateFee(0) === 0;` },
          ],
          hint: "Bug 1 is shadowing (remove the inner `let`). Bug 2 is the TDZ (swap two lines). Bug 3 is block scope: declare `let fee` before the `if`, then assign it inside each branch.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `console.log(x); var x = 5;` print?",
              options: ["5", "undefined", "ReferenceError", "null"],
              answer: 1,
              why: "`var x` is hoisted and initialized to `undefined`; the assignment `= 5` stays on its line and hasn't run yet.",
            },
            {
              q: "What does `console.log(y); let y = 5;` do?",
              options: ["Prints undefined", "Prints 5", "Throws ReferenceError: Cannot access 'y' before initialization"],
              answer: 2,
              why: "`let` is hoisted too, but stays uninitialized until its line runs. Accessing it in that temporal dead zone throws.",
            },
            {
              q: "A nested function reads a variable named `year`. Which `year` does it get?",
              options: [
                "The closest one in the scopes surrounding where the function is written",
                "The one in the function that calls it",
                "Always the global one",
                "The most recently assigned `year` anywhere in the program",
              ],
              answer: 0,
              why: "JavaScript uses lexical scope: lookup follows the nesting of the source code, not the call stack.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Closures
    // ─────────────────────────────────────────────────────────────
    {
      slug: "closures",
      title: "Closures",
      summary: "Functions remember the scope they were created in: the engine behind factories, memoization and React hooks.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Lexical scope has a powerful consequence: a function keeps access to the variables around it **even after the outer function has returned**. A function plus the variables it remembers is called a **closure**. Every JavaScript function is a closure; you use them constantly (event handlers, `.map` callbacks, React components) whether you notice or not.",
        },
        {
          type: "run",
          title: "Private state with a closure",
          code: `function createCounter() {
  let count = 0;                 // private: nothing outside can read or reset it
  return function increment() {
    count += 1;
    return count;
  };
}

const leadsToday = createCounter();
const leadsThisWeek = createCounter();

leadsToday();
leadsToday();
leadsThisWeek();

console.log("today:", leadsToday());      // 3
console.log("this week:", leadsThisWeek()); // 2: a separate count
// console.log(count) → ReferenceError: count only lives inside the closure`,
        },
        {
          type: "steps",
          items: [
            { title: "createCounter() runs", text: "A fresh scope is created for this call, containing `count = 0`." },
            { title: "It returns increment", text: "The inner function carries a hidden reference to that scope." },
            { title: "createCounter() finishes", text: "Normally its scope would be garbage-collected, but `increment` still points to it, so it stays alive." },
            { title: "Each call gets its own scope", text: "Calling `createCounter()` again makes a brand-new scope, which is why the two counters are independent." },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Closures capture variables, not values",
          text: "A closure doesn't take a snapshot. It holds a live link to the variable, so if the variable changes later, the closure sees the new value.",
        },
        {
          type: "run",
          code: `let currency = "CAD";
const formatAmount = (amount) => amount.toFixed(2) + " " + currency;

console.log(formatAmount(10));
currency = "USD";
console.log(formatAmount(10)); // the closure reads the CURRENT value`,
        },
        { type: "h", text: "Factories: configure once, use many times" },
        {
          type: "run",
          code: `function makeTaxCalculator(province) {
  const rates = { QC: 0.14975, ON: 0.13, AB: 0.05 };
  const rate = rates[province];   // looked up once, remembered forever
  return (subtotal) => Math.round(subtotal * (1 + rate) * 100) / 100;
}

const quebecTotal = makeTaxCalculator("QC");
const ontarioTotal = makeTaxCalculator("ON");

console.log("QC:", quebecTotal(200));
console.log("ON:", ontarioTotal(200));`,
        },
        { type: "h", text: "once() and memoize(): closures as tools" },
        {
          type: "p",
          text: "Many utility functions you install from npm are just closures. Here are two you can now write yourself: `once` (run a function a single time, e.g. a welcome email) and `memoize` (cache results of an expensive call).",
        },
        {
          type: "run",
          code: `function once(fn) {
  let called = false;
  let result;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result;
  };
}

const sendWelcomeEmail = once((client) => {
  console.log("sending welcome email to", client);
  return "sent";
});
sendWelcomeEmail("marie@exemple.ca");
sendWelcomeEmail("marie@exemple.ca"); // ignored: the closure remembers \`called\`

function memoize(fn) {
  const cache = new Map();       // lives as long as the returned function
  return (key) => {
    if (cache.has(key)) return cache.get(key);
    const value = fn(key);
    cache.set(key, value);
    return value;
  };
}

let computations = 0;
const shippingQuote = memoize((postalCode) => {
  computations++;
  return postalCode.startsWith("H") ? 12 : 20; // pretend this is slow
});
shippingQuote("H2X 1Y4");
shippingQuote("H2X 1Y4");
shippingQuote("G1R 2B5");
console.log("real computations:", computations); // 2, not 3`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Closures keep memory alive",
          text: "Anything a closure references can't be garbage-collected. A `memoize` cache in a long-running Node server (on Railway, for example) grows forever unless you cap it. Use an LRU cache or a size limit for anything keyed by user input.",
        },
        { type: "h", text: "The classic loop bug" },
        {
          type: "p",
          text: "This puzzle shows up in interviews and in real code. Each callback closes over the loop variable. With `var` there is **one** `i` for the whole function, and by the time the callbacks run, the loop has pushed it to 3. With `let`, each iteration gets its **own** fresh binding.",
        },
        {
          type: "run",
          code: `const results = [];

for (var i = 0; i < 3; i++) {
  setTimeout(() => results.push("var: " + i), 0);
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => results.push("let: " + j), 0);
}

await new Promise((resolve) => setTimeout(resolve, 10)); // wait for the timers
console.log(results);`,
        },
        { type: "h", text: "Stale closures in React" },
        {
          type: "p",
          text: "A React component is a function that runs again on every render. Each render creates **new** handlers and effects that close over **that render's** props and state. A function created during an old render keeps seeing old values: a *stale closure*.",
        },
        {
          type: "run",
          title: "Simulating renders",
          code: `function render(state) {
  // every "render" creates a new handler bound to that render's state
  return { onClick: () => console.log("clicked with count =", state.count) };
}

const firstRender = render({ count: 0 });
const latestRender = render({ count: 5 });

firstRender.onClick();   // 0: a stale closure from the first render
latestRender.onClick();  // 5`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "components/LeadCounter.tsx",
          code: `function LeadCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);   // ❌ \`count\` is frozen at 0 from the first render
    }, 1000);
    return () => clearInterval(id);
  }, []);                    // the effect never re-runs, so the closure never refreshes

  return <p>{count} new leads</p>;
}

// ✅ Fix: use the updater form, which always receives the latest value
// setCount((c) => c + 1);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Why hooks have dependency arrays",
          text: "The dependency array of `useEffect`, `useMemo` and `useCallback` exists *because* of closures: it tells React when to recreate the function so it closes over fresh values. The `react-hooks/exhaustive-deps` ESLint rule (on by default in Next.js) catches most stale closures before they ship.",
        },
        {
          type: "challenge",
          title: "Independent invoice numberers",
          prompt: "`createInvoiceNumberer(prefix)` must return a function that produces `PREFIX-0001`, `PREFIX-0002`, … (4 digits, zero-padded). The current code uses a shared counter, so two numberers interfere with each other. Use a closure so each numberer has its own private counter.",
          starter: `let next = 1; // shared by every numberer... is that a problem?

function createInvoiceNumberer(prefix) {
  return function () {
    const n = next;
    next += 1;
    return prefix + "-" + String(n).padStart(4, "0");
  };
}
`,
          solution: `function createInvoiceNumberer(prefix) {
  let next = 1; // private to THIS numberer
  return function () {
    const n = next;
    next += 1;
    return prefix + "-" + String(n).padStart(4, "0");
  };
}
`,
          tests: [
            {
              name: "A new numberer starts at 0001",
              code: `const nextNumber = createInvoiceNumberer("INV");
return nextNumber() === "INV-0001" && nextNumber() === "INV-0002";`,
            },
            {
              name: "Two numberers count independently",
              code: `const quotes = createInvoiceNumberer("QUO");
const invoices = createInvoiceNumberer("INV");
quotes(); quotes(); quotes();
return invoices() === "INV-0001" && quotes() === "QUO-0004";`,
            },
            {
              name: "The 10th number is zero-padded as 0010",
              code: `const n = createInvoiceNumberer("CR");
let last;
for (let i = 0; i < 10; i++) last = n();
return last === "CR-0010";`,
            },
          ],
          hint: "Move the `let next = 1` *inside* `createInvoiceNumberer`. Each call then creates a new scope with its own `next`, and the returned function closes over it.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What is a closure?",
              options: [
                "A function that has finished running",
                "A function together with the variables from the scope where it was created",
                "An object with private fields",
                "A function that runs immediately after being defined",
              ],
              answer: 1,
              why: "A closure is a function plus a live link to the scope it was created in, which keeps those variables alive after the outer function returns.",
            },
            {
              q: "Why does `for (var i = 0; i < 3; i++) setTimeout(() => log(i))` log 3, 3, 3?",
              options: [
                "setTimeout copies the value of i at the end of the program",
                "The callbacks run before the loop starts",
                "All callbacks share the single function-scoped `i`, which is 3 when they finally run",
              ],
              answer: 2,
              why: "`var` creates one binding for the whole function. `let` creates a new binding per iteration, which gives 0, 1, 2.",
            },
            {
              q: "An interval inside `useEffect(..., [])` keeps calling `setCount(count + 1)` but the counter is stuck at 1. Best fix?",
              options: [
                "Wrap the component in `React.memo`",
                "Use a `var` instead of `const` for `count`",
                "Increase the interval delay",
                "Use the updater form `setCount((c) => c + 1)`",
              ],
              answer: 3,
              why: "The interval's callback closed over `count` from the first render (0). The updater form receives the latest state, so it doesn't depend on the stale closure.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. this, call/apply/bind & arrow functions
    // ─────────────────────────────────────────────────────────────
    {
      slug: "this-and-binding",
      title: "this, call/apply/bind & arrow functions",
      summary: "`this` depends on how a function is called, except in arrow functions, which borrow it from outside.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Almost everything in JavaScript is looked up lexically (where code is written). `this` is the big exception: for regular functions, `this` is decided **at call time, by how the function is called**. That's why the same method can work in one place and crash in another.",
        },
        { type: "h", text: "The four binding rules (plus arrows)" },
        {
          type: "table",
          rows: [
            ["How the function is called", "`this` is…", "Example"],
            ["With `new`", "the brand-new object being built", "`new Invoice(\"Nordik\", 400)`"],
            ["With `call` / `apply` / `bind`", "the object you pass explicitly", "`format.call(invoice)`"],
            ["As a method: `obj.fn()`", "the object left of the dot", "`invoice.total()`"],
            ["As a plain function: `fn()`", "`undefined` in strict mode", "`const t = invoice.total; t()`"],
            ["Arrow function", "whatever `this` was where the arrow was written", "`() => this.items`"],
          ],
        },
        {
          type: "p",
          text: "When several could apply, they win in that order: `new` beats explicit binding, which beats method calls, which beat plain calls. Arrows ignore all of them.",
        },
        {
          type: "run",
          title: "Implicit binding: the object left of the dot",
          code: `const invoice = {
  client: "Atelier Nordik",
  items: [400, 250],
  total() {
    return this.items.reduce((sum, n) => sum + n, 0);
  },
  describe() {
    return this.client + ": " + this.total() + " $";
  },
};

console.log(invoice.describe());

// Same functions, borrowed by another object → different \`this\`
const other = { client: "Café Bonheur", items: [90], total: invoice.total, describe: invoice.describe };
console.log(other.describe());`,
        },
        { type: "h", text: "The method-extraction bug" },
        {
          type: "p",
          text: "The moment you take a method *off* its object (store it in a variable, pass it as a callback), there's no \"left of the dot\" anymore. It becomes a plain call, and in strict mode `this` is `undefined`.",
        },
        {
          type: "run",
          code: `const invoice = {
  client: "Atelier Nordik",
  describe() {
    return "Invoice for " + this.client;
  },
};

const describe = invoice.describe;      // pulled off the object
try {
  describe();
} catch (e) {
  console.log("extracted →", e.constructor.name + ":", e.message);
}

// Exactly the same bug when passing a method as a callback:
function later(callback) {
  return callback();
}
try {
  later(invoice.describe);
} catch (e) {
  console.log("as a callback →", e.message);
}

console.log(later(() => invoice.describe()));        // fix 1: wrap in an arrow
console.log(later(invoice.describe.bind(invoice)));  // fix 2: bind`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Strict vs sloppy mode",
          text: "In old non-strict scripts, a plain call sets `this` to the global object (`window`), so the bug becomes a silent `undefined` instead of an error. ES modules, classes and this course's runner are always strict, so you get the loud, helpful `TypeError`.",
        },
        { type: "h", text: "call, apply and bind" },
        {
          type: "run",
          code: `function formatLine(currency, locale) {
  const money = new Intl.NumberFormat(locale, { style: "currency", currency }).format(this.amount);
  return this.label + ": " + money;
}

const line = { label: "Logo design", amount: 1200 };

console.log(formatLine.call(line, "CAD", "fr-CA"));     // args one by one
console.log(formatLine.apply(line, ["USD", "en-US"]));  // args as an array

const formatForQuebec = formatLine.bind(line, "CAD", "fr-CA"); // returns a NEW function
console.log(formatForQuebec());                          // this + args are locked in`,
        },
        {
          type: "list",
          items: [
            "`fn.call(obj, a, b)` calls `fn` **now** with `this = obj`.",
            "`fn.apply(obj, [a, b])` is the same, with arguments as an array (mostly replaced by spread: `fn.call(obj, ...args)`).",
            "`fn.bind(obj, a)` does **not** call anything: it returns a new function whose `this` is permanently `obj`. A later `call` can't change it (only `new` can).",
          ],
        },
        { type: "h", text: "Arrow functions don't have their own this" },
        {
          type: "p",
          text: "An arrow function has no `this` of its own. It uses the `this` of the scope it was written in, exactly like any other variable (lexical). That makes arrows perfect for callbacks *inside* methods.",
        },
        {
          type: "run",
          code: `const campaign = {
  name: "Spring promo",
  channels: ["Meta", "Google", "TikTok"],
  withArrow() {
    // the arrow borrows withArrow's \`this\` → campaign
    return this.channels.map((ch) => this.name + " on " + ch);
  },
  withFunction() {
    // a regular function gets its own \`this\`: map calls it plainly → undefined
    return this.channels.map(function (ch) {
      return this.name + " on " + ch;
    });
  },
};

console.log(campaign.withArrow());
try {
  campaign.withFunction();
} catch (e) {
  console.log("withFunction →", e.message);
}`,
        },
        {
          type: "p",
          text: "The flip side: an arrow is the **wrong** choice for an object method, because it takes `this` from *outside* the object.",
        },
        {
          type: "run",
          code: `const cart = {
  items: [10, 20],
  count: () => {
    // \`this\` here is the outer this (undefined at the top of a module), NOT cart
    try {
      return this.items.length;
    } catch (e) {
      return "error: " + e.message;
    }
  },
  countFixed() {
    return this.items.length;
  },
};

console.log(cart.count());
console.log(cart.countFixed());`,
        },
        { type: "h", text: "new and class fields" },
        {
          type: "p",
          text: "With `new`, `this` is the object under construction (details in the next lesson). In classes, regular methods are shared on the prototype and follow the call-site rules, so they suffer from the extraction bug. An **arrow class field** is created per instance and captures `this` for good.",
        },
        {
          type: "run",
          code: `class LeadForm {
  leads = [];

  // arrow field: \`this\` is locked to the instance, safe to pass around
  handleSubmit = (lead) => {
    this.leads.push(lead);
  };

  // regular method: \`this\` depends on how it's called
  addLead(lead) {
    this.leads.push(lead);
  }
}

const form = new LeadForm();

const onSubmit = form.handleSubmit;  // extracted: still works
onSubmit({ email: "marie@exemple.ca" });

const onAdd = form.addLead;          // extracted: loses \`this\`
try {
  onAdd({ email: "luc@exemple.ca" });
} catch (e) {
  console.log("regular method extracted →", e.message);
}

console.log("leads saved:", form.leads.length);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where you still meet this",
          text: "React function components and hooks barely use `this` (no more `this.handleClick = this.handleClick.bind(this)` in constructors, one big reason hooks won). You still run into it with SDK clients (`const shopify = new ShopifyClient(...)`, then passing `shopify.request` as a callback), Node's `EventEmitter` listeners, and classes you write for services. Rule of thumb: pass `(x) => obj.method(x)`, not `obj.method`.",
        },
        {
          type: "challenge",
          title: "Keep this attached",
          prompt: "`makeNotifier(channel)` (don't change it) returns an object whose `send(message)` method uses `this`. Fix `notifyAll(notifier, messages)` so it returns one formatted line per message, and `createSender(notifier)` so it returns a standalone function that still works when called on its own.",
          starter: `// Provided: do not change
function makeNotifier(channel) {
  return {
    channel,
    sent: [],
    send(message) {
      const line = "[" + this.channel + "] " + message;
      this.sent.push(line);
      return line;
    },
  };
}

function notifyAll(notifier, messages) {
  return messages.map(notifier.send);
}

function createSender(notifier) {
  return notifier.send;
}
`,
          solution: `// Provided: do not change
function makeNotifier(channel) {
  return {
    channel,
    sent: [],
    send(message) {
      const line = "[" + this.channel + "] " + message;
      this.sent.push(line);
      return line;
    },
  };
}

function notifyAll(notifier, messages) {
  return messages.map((message) => notifier.send(message));
}

function createSender(notifier) {
  return notifier.send.bind(notifier);
}
`,
          tests: [
            {
              name: "notifyAll returns one formatted line per message",
              code: `const n = makeNotifier("#ventes");
const lines = notifyAll(n, ["New lead", "Invoice paid"]);
return lines.join("|") === "[#ventes] New lead|[#ventes] Invoice paid" && n.sent.length === 2;`,
            },
            {
              name: "createSender returns a function that works on its own",
              code: `const n = makeNotifier("#support");
const send = createSender(n);
return send("Ticket 42 opened") === "[#support] Ticket 42 opened";`,
            },
            {
              name: "Each sender stays tied to its own notifier",
              code: `const sales = makeNotifier("#ventes");
const dev = makeNotifier("#dev");
const sendSales = createSender(sales);
const sendDev = createSender(dev);
sendDev("Deploy done");
sendSales("Deal won");
return sales.sent.length === 1 && dev.sent[0] === "[#dev] Deploy done";`,
            },
            {
              name: "notifyAll with no messages returns an empty array",
              code: `const r = notifyAll(makeNotifier("#x"), []);
return Array.isArray(r) && r.length === 0;`,
            },
          ],
          hint: "`messages.map(notifier.send)` passes the method without its object, so `this` is `undefined`. Wrap it in an arrow: `(m) => notifier.send(m)`. For `createSender`, `bind` returns a function with `this` locked in.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In strict mode, `const f = invoice.describe; f();`: what is `this` inside `describe`?",
              options: ["invoice", "globalThis", "undefined", "f"],
              answer: 2,
              why: "Once extracted, it's a plain call: no object left of the dot. In strict mode that means `this` is `undefined`.",
            },
            {
              q: "Where does an arrow function get its `this`?",
              options: [
                "From the object it's called on",
                "From the surrounding scope where the arrow was written",
                "It is always globalThis",
                "From whatever you pass to `.call()`",
              ],
              answer: 1,
              why: "Arrows have no own `this`; they read it lexically like a normal variable. `.call()` and `.bind()` can't change it.",
            },
            {
              q: "What's the difference between `fn.call(obj)` and `fn.bind(obj)`?",
              options: [
                "There is none",
                "`bind` works only on arrow functions",
                "`call` permanently changes `fn`'s `this`",
                "`call` invokes fn now; `bind` returns a new function with `this` fixed, without calling it",
              ],
              answer: 3,
              why: "`call`/`apply` run immediately. `bind` creates a new function you can store or pass around, and its `this` stays locked.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Prototypes & the object model
    // ─────────────────────────────────────────────────────────────
    {
      slug: "prototypes",
      title: "Prototypes & the object model",
      summary: "Every object links to another object. Property lookup walks that chain, and classes are built on top of it.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Where does `.map` come from when you create an array? Why does `{}` already have a `.toString()`? Every JavaScript object has a hidden link to another object called its **prototype**. When you read a property the object doesn't have, JavaScript follows that link, then the next one, and so on: the **prototype chain**. Classes, `instanceof` and inheritance are all built on this one mechanism.",
        },
        {
          type: "run",
          code: `const leads = ["marie@exemple.ca", "luc@exemple.ca"];

console.log(Object.hasOwn(leads, "map"));                          // false: not on the array itself
console.log(Object.getPrototypeOf(leads) === Array.prototype);     // true
console.log(Object.hasOwn(Array.prototype, "map"));                // true: found one level up
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype));              // null: end of the chain`,
        },
        {
          type: "steps",
          items: [
            { title: "leads.hasOwnProperty?", text: "Is it an own property of `leads`? No → follow the link." },
            { title: "Array.prototype?", text: "Not there either → follow the next link." },
            { title: "Object.prototype?", text: "Found it. Call it with `this = leads`." },
            { title: "Not found anywhere?", text: "When the chain reaches `null`, the result is `undefined` (calling it throws \"is not a function\")." },
          ],
        },
        { type: "h", text: "Object.create: build a chain by hand" },
        {
          type: "run",
          code: `const baseClient = {
  currency: "CAD",
  greet() {
    return "Bonjour " + this.name + " (" + this.currency + ")";
  },
};

const lamarre = Object.create(baseClient);   // lamarre's prototype is baseClient
lamarre.name = "Boulangerie Lamarre";
console.log(lamarre.greet());
console.log("own name?", Object.hasOwn(lamarre, "name"), "| own currency?", Object.hasOwn(lamarre, "currency"));

const maple = Object.create(baseClient);
maple.name = "Maple & Co";
maple.currency = "USD";          // creates an OWN property that shadows the inherited one
console.log(maple.greet(), "| base still:", baseClient.currency);

baseClient.currency = "EUR";     // change the shared prototype...
console.log(lamarre.greet());    // ...every object inheriting from it sees the change`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Reads walk the chain, writes don't",
          text: "Reading `obj.x` searches up the chain. Assigning `obj.x = ...` always creates or updates an **own** property on `obj` and never modifies the prototype (unless the prototype defines a setter for `x`).",
        },
        { type: "h", text: "Classes are sugar over prototypes" },
        {
          type: "p",
          text: "`class` (ES2015) did not add a new object model. It's a nicer syntax that sets up the same prototype links people used to write by hand. Both versions below produce essentially the same objects.",
        },
        {
          type: "compare",
          left: {
            label: "class syntax",
            lang: "js",
            code: `class Invoice {
  constructor(client, amount) {
    this.client = client;
    this.amount = amount;
  }
  withTax() {
    return this.amount * 1.14975;
  }
}`,
          },
          right: {
            label: "what it means underneath",
            lang: "js",
            code: `function Invoice(client, amount) {
  this.client = client;
  this.amount = amount;
}
Invoice.prototype.withTax = function () {
  return this.amount * 1.14975;
};`,
          },
        },
        {
          type: "run",
          code: `class Invoice {
  constructor(client, amount) {
    this.client = client;
    this.amount = amount;
  }
  withTax() {
    return Math.round(this.amount * 1.14975 * 100) / 100;
  }
}

const a = new Invoice("Café Bonheur", 200);
const b = new Invoice("Atelier Nordik", 50);

console.log(typeof Invoice);                                  // "function"
console.log(Object.getPrototypeOf(a) === Invoice.prototype);  // true
console.log(Object.keys(a));                                  // only OWN data: client, amount
console.log(Object.hasOwn(a, "withTax"));                     // false: it lives on the prototype
console.log(a.withTax === b.withTax);                         // true: ONE function shared by all`,
        },
        {
          type: "steps",
          items: [
            { title: "Create", text: "`new Invoice(...)` creates an empty object." },
            { title: "Link", text: "Its prototype is set to `Invoice.prototype` (where the methods live)." },
            { title: "Construct", text: "The constructor runs with `this` = the new object, adding own properties." },
            { title: "Return", text: "The new object is returned (unless the constructor explicitly returns another object)." },
          ],
        },
        { type: "h", text: "extends: a longer chain" },
        {
          type: "run",
          code: `class Invoice {
  constructor(client, amount) {
    this.client = client;
    this.amount = amount;
  }
  label() {
    return this.client + ": " + this.amount + " $";
  }
}

class RecurringInvoice extends Invoice {
  constructor(client, amount, months) {
    super(client, amount);       // must run before you can use \`this\`
    this.months = months;
  }
  label() {
    return super.label() + " × " + this.months + " months"; // reuse the parent's version
  }
}

const hosting = new RecurringInvoice("Boulangerie Lamarre", 25, 12);
console.log(hosting.label());
console.log(hosting instanceof RecurringInvoice, hosting instanceof Invoice);

// The chain: hosting → RecurringInvoice.prototype → Invoice.prototype → Object.prototype → null
let p = hosting;
const chain = ["hosting"];
while ((p = Object.getPrototypeOf(p))) chain.push(p.constructor.name + ".prototype");
console.log(chain.join(" → ") + " → null");`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Two habits",
          text: "Never add methods to built-in prototypes (`Array.prototype.last = ...`): it affects every array in the app and in every library. And prefer `Object.hasOwn(obj, key)` over `obj.hasOwnProperty(key)`: the latter breaks on objects created with `Object.create(null)` or that have their own `hasOwnProperty` key.",
        },
        { type: "h", text: "Prototypes don't survive serialization" },
        {
          type: "run",
          code: `class Invoice {
  constructor(client, amount) {
    this.client = client;
    this.amount = amount;
  }
  withTax() {
    return this.amount * 1.14975;
  }
}

const original = new Invoice("Café Bonheur", 100);
const viaJson = JSON.parse(JSON.stringify(original));
const viaClone = structuredClone(original);

console.log(viaJson, viaJson instanceof Invoice, typeof viaJson.withTax);
console.log(viaClone instanceof Invoice, typeof viaClone.withTax);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Next.js and Supabase",
          text: "Data crossing a boundary (an API response, a Supabase row, props from a Server Component to a Client Component) travels as plain data: only own, serializable properties survive and the prototype is lost. Next.js even refuses class instances as props to Client Components (\"Only plain objects… can be passed to Client Components\"). Keep data as plain objects and put behaviour in functions, like `withTax(invoice)`.",
        },
        {
          type: "challenge",
          title: "Walk the chain yourself",
          prompt: "Write two under-the-hood helpers. `whereIs(obj, key)` returns how many prototype hops it takes to find `key` as an **own** property (`0` = on the object itself, `1` = on its prototype, …) or `-1` if it's nowhere in the chain. `myNew(Constructor, ...args)` must behave like `new Constructor(...args)`: create an object linked to `Constructor.prototype`, run the constructor with that object as `this`, and return it (or the object the constructor returns, if it returns one).",
          starter: `function whereIs(obj, key) {
  // TODO: walk the chain with Object.getPrototypeOf(), check with Object.hasOwn()
  return Object.hasOwn(obj, key) ? 0 : -1;
}

function myNew(Constructor, ...args) {
  const obj = {};
  Constructor.apply(obj, args);
  return obj;
}
`,
          solution: `function whereIs(obj, key) {
  let current = obj;
  let depth = 0;
  while (current !== null) {
    if (Object.hasOwn(current, key)) return depth;
    current = Object.getPrototypeOf(current);
    depth++;
  }
  return -1;
}

function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  const returnedAnObject = result !== null && (typeof result === "object" || typeof result === "function");
  return returnedAnObject ? result : obj;
}
`,
          tests: [
            {
              name: "whereIs finds own properties at depth 0",
              code: `return whereIs({ plan: "pro" }, "plan") === 0;`,
            },
            {
              name: "whereIs finds inherited methods (map at 1, hasOwnProperty at 2 for arrays)",
              code: `return whereIs([], "map") === 1 && whereIs([], "hasOwnProperty") === 2;`,
            },
            {
              name: "whereIs returns -1 when missing, even on null-prototype objects",
              code: `return whereIs({}, "nope") === -1 && whereIs(Object.create(null), "toString") === -1;`,
            },
            {
              name: "myNew links the object to the prototype and runs the constructor",
              code: `function Lead(email) { this.email = email; }
Lead.prototype.domain = function () { return this.email.split("@")[1]; };
const lead = myNew(Lead, "marie@omnigo.ca");
return lead instanceof Lead && lead.domain() === "omnigo.ca" && Object.hasOwn(lead, "email");`,
            },
            {
              name: "myNew returns the constructor's object if it returns one",
              code: `function Cached() { return { cached: true }; }
return myNew(Cached).cached === true;`,
            },
          ],
          hint: "For `whereIs`, loop while `current !== null`, checking `Object.hasOwn(current, key)` and moving up with `Object.getPrototypeOf(current)`. For `myNew`, start from `Object.create(Constructor.prototype)` instead of `{}`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`const arr = [];` Where does `arr.map` actually live?",
              options: ["On `arr` itself", "On `Object.prototype`", "On `Array.prototype`", "It's copied into every array"],
              answer: 2,
              why: "`map` is defined once on `Array.prototype`. Every array finds it by following its prototype link.",
            },
            {
              q: "`child = Object.create(parent); child.currency = \"USD\";` What happens to `parent.currency`?",
              options: [
                "Nothing: the assignment creates an own property on `child`",
                "It becomes \"USD\" too",
                "It's deleted",
              ],
              answer: 0,
              why: "Assignments create or update own properties. The inherited value is only shadowed for `child`.",
            },
            {
              q: "What is a JavaScript `class` under the hood?",
              options: [
                "A completely separate object system copied from Java",
                "A constructor function whose methods live on its `prototype` object",
                "A frozen object",
                "A TypeScript-only feature",
              ],
              answer: 1,
              why: "`typeof SomeClass === \"function\"`. Methods are placed on `SomeClass.prototype` and shared by all instances via the prototype chain.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Values vs references
    // ─────────────────────────────────────────────────────────────
    {
      slug: "values-and-references",
      title: "Values vs references & immutability",
      summary: "Why changing one object changed another, why `{} !== {}`, and why React wants new objects.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "\"I edited the draft and the original quote changed too!\" This is one of the most frequent bugs in JavaScript apps, and it comes from one rule: **primitives are copied, objects are shared**. The same rule explains why React sometimes doesn't re-render when you think it should.",
        },
        {
          type: "table",
          rows: [
            ["", "Primitives", "Objects"],
            ["Types", "string, number, boolean, null, undefined, bigint, symbol", "objects, arrays, functions, Map, Set, Date…"],
            ["A variable holds…", "the value itself", "a **reference** (an address) to the object"],
            ["`b = a` copies…", "the value", "the reference: both names point to the same object"],
            ["`===` compares…", "the values", "identity: is it the *same* object?"],
            ["Can be changed in place?", "No (immutable)", "Yes (mutable)"],
          ],
        },
        {
          type: "run",
          code: `let price = 100;
let promoPrice = price;   // copies the number
promoPrice -= 20;
console.log(price, promoPrice);   // 100 80

const quote = { client: "Café Bonheur", total: 100 };
const draft = quote;      // copies the REFERENCE: same object, two names
draft.total = 150;
console.log(quote.total);         // 150: surprise!
console.log(quote === draft);     // true

console.log({ total: 1 } === { total: 1 });  // false: two different objects
console.log([1, 2] === [1, 2]);              // false
console.log("lead" === "lead");              // true: primitives compare by value`,
        },
        { type: "h", text: "Functions receive a copy of the reference" },
        {
          type: "p",
          text: "Passing an object to a function copies the *reference*, so the function can mutate the caller's object. But re-assigning the parameter only moves the function's local label; the caller is unaffected.",
        },
        {
          type: "run",
          code: `function applyPromo(cart) {
  cart.items.push({ sku: "PROMO10", price: -10 });  // mutates the caller's cart!
  return cart;
}

const cart = { items: [{ sku: "TSHIRT", price: 30 }] };
const promoCart = applyPromo(cart);
console.log(cart.items.length, promoCart === cart);   // 2 true: the original was modified

function reset(c) {
  c = { items: [] };   // only re-points the local parameter
}
reset(cart);
console.log(cart.items.length);                       // still 2`,
        },
        { type: "h", text: "Copy instead of mutate" },
        {
          type: "compare",
          left: {
            label: "Mutating (risky)",
            lang: "js",
            code: `function applyPromo(cart) {
  cart.items.push(promoLine);
  cart.total -= 10;
  return cart;
}`,
          },
          right: {
            label: "Immutable (safe)",
            lang: "js",
            code: `function applyPromo(cart) {
  return {
    ...cart,
    items: [...cart.items, promoLine],
    total: cart.total - 10,
  };
}`,
          },
        },
        {
          type: "p",
          text: "Spread (`...`) makes a **shallow** copy: the top level is new, but nested objects are still shared. For a full independent copy, use `structuredClone`.",
        },
        {
          type: "run",
          code: `const order = {
  id: 7,
  client: { name: "Atelier Nordik" },
  lines: [{ sku: "LOGO", qty: 1 }],
};

const shallow = { ...order };
shallow.id = 8;                      // fine: top-level property is a copy
shallow.client.name = "CHANGED";     // nested object is SHARED
console.log(order.id, order.client.name);

const deep = structuredClone(order);
deep.lines[0].qty = 99;
console.log(order.lines[0].qty);     // 1: deep copy is fully independent`,
        },
        {
          type: "table",
          rows: [
            ["Tool", "Depth", "Notes"],
            ["`{ ...obj }`, `[...arr]`, `Object.assign`, `arr.slice()`", "Shallow", "Fast; the usual tool for state updates"],
            ["`structuredClone(obj)`", "Deep", "Handles Date, Map, Set, cycles; drops functions and class prototypes"],
            ["`JSON.parse(JSON.stringify(obj))`", "Deep-ish", "Turns Dates into strings, drops `undefined`, Map, Set: avoid"],
          ],
        },
        { type: "h", text: "Object.freeze and non-mutating array methods" },
        {
          type: "run",
          code: `const plans = Object.freeze({ basic: 49, pro: 149, addons: { seo: 99 } });

try {
  plans.pro = 0;                 // strict mode: writing to a frozen object throws
} catch (e) {
  console.log(e.constructor.name + ":", e.message);
}
plans.addons.seo = 0;            // freeze is SHALLOW: nested objects are not frozen
console.log(plans.pro, plans.addons.seo);

// sort() and reverse() MUTATE. Their ES2023 twins return new arrays:
const leads = [{ name: "Luc", score: 40 }, { name: "Marie", score: 90 }, { name: "Ana", score: 65 }];
const ranked = leads.toSorted((a, b) => b.score - a.score);
console.log(ranked.map((l) => l.name), "| original order:", leads.map((l) => l.name));
const updated = leads.with(0, { ...leads[0], score: 45 }); // replace index 0 in a copy
console.log(updated[0].score, leads[0].score);`,
        },
        {
          type: "callout",
          tone: "info",
          title: "=== vs Object.is",
          text: "React compares with `Object.is`, which is `===` except for two edge cases: `Object.is(NaN, NaN)` is `true` and `Object.is(0, -0)` is `false`. For objects, both mean \"same reference\".",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Why React needs new objects",
          text: "When you call `setState(next)`, React checks `Object.is(previous, next)`. If you mutated the old array and passed it back, it's the **same reference**, so React may skip the re-render and your UI goes stale. Same story for `useEffect` / `useMemo` dependencies: an object literal created during render is a new reference every time, so the effect re-runs on every render.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/leads/LeadList.tsx",
          code: `// ❌ mutate + same reference → React may not re-render
leads.push(newLead);
setLeads(leads);

// ✅ new array
setLeads([...leads, newLead]);

// ✅ update one item: new array, new object for the changed item, others reused
setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: "won" } : l)));`,
        },
        {
          type: "challenge",
          title: "Immutable invoice updates",
          prompt: "Rewrite both helpers so they never mutate their inputs. `markPaid(invoices, id)` returns a **new** array where the invoice with that `id` has `status: \"paid\"`; the other invoices must keep their **same references** (that's what lets React skip re-rendering unchanged rows). `addLine(invoice, line)` returns a **new** invoice with `line` appended to a new `lines` array.",
          starter: `function markPaid(invoices, id) {
  const invoice = invoices.find((inv) => inv.id === id);
  if (invoice) invoice.status = "paid";
  return invoices;
}

function addLine(invoice, line) {
  invoice.lines.push(line);
  return invoice;
}
`,
          solution: `function markPaid(invoices, id) {
  return invoices.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv));
}

function addLine(invoice, line) {
  return { ...invoice, lines: [...invoice.lines, line] };
}
`,
          tests: [
            {
              name: "markPaid sets status \"paid\" on the right invoice",
              code: `const result = markPaid([{ id: 1, status: "sent" }, { id: 2, status: "sent" }], 2);
return result[1].status === "paid" && result[0].status === "sent";`,
            },
            {
              name: "markPaid does not mutate the original array or invoices",
              code: `const original = [{ id: 1, status: "sent" }, { id: 2, status: "sent" }];
const result = markPaid(original, 1);
return result !== original && original[0].status === "sent";`,
            },
            {
              name: "Unchanged invoices keep their reference (React-friendly)",
              code: `const original = [{ id: 1, status: "sent" }, { id: 2, status: "sent" }];
const result = markPaid(original, 2);
return result[0] === original[0] && result[1] !== original[1];`,
            },
            {
              name: "addLine returns a new invoice and leaves the original untouched",
              code: `const inv = { id: 9, client: "Café Bonheur", lines: [{ sku: "LOGO", price: 800 }] };
const next = addLine(inv, { sku: "CARDS", price: 120 });
return next !== inv && next.lines !== inv.lines && inv.lines.length === 1 &&
  next.lines.length === 2 && next.lines[1].sku === "CARDS" && next.client === "Café Bonheur";`,
            },
            {
              name: "markPaid with an unknown id returns an equal, untouched list",
              code: `const original = [{ id: 1, status: "sent" }];
const result = markPaid(original, 99);
return result.length === 1 && result[0].status === "sent" && original[0].status === "sent";`,
            },
          ],
          hint: "`invoices.map(...)` already returns a new array. Return `{ ...inv, status: \"paid\" }` for the matching invoice and `inv` itself for the others. For `addLine`, spread the invoice and build `lines: [...invoice.lines, line]`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`const a = { n: 1 }; const b = a; b.n = 2;` What is `a.n`?",
              options: ["1", "2", "undefined", "TypeError, because a is const"],
              answer: 1,
              why: "`b = a` copies the reference; both names point to the same object. `const` only stops re-assigning `a`, not mutating the object.",
            },
            {
              q: "Which creates a fully independent copy of `{ client: { name: \"X\" } }`?",
              options: ["`{ ...obj }`", "`Object.assign({}, obj)`", "`const copy = obj`", "`structuredClone(obj)`"],
              answer: 3,
              why: "Spread and `Object.assign` are shallow (nested objects stay shared); `copy = obj` doesn't copy at all. `structuredClone` copies deeply.",
            },
            {
              q: "You `leads.push(newLead)` then `setLeads(leads)`. The list doesn't update. Why?",
              options: [
                "React compares references: it's the same array, so React sees no change",
                "push is asynchronous",
                "setState only accepts strings",
              ],
              answer: 0,
              why: "`Object.is(prev, next)` is `true` because you passed back the same array. Create a new one: `setLeads([...leads, newLead])`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. The event loop
    // ─────────────────────────────────────────────────────────────
    {
      slug: "event-loop",
      title: "The event loop",
      summary: "One thread, a call stack and two queues: why setTimeout(0) runs after promises, and why heavy loops freeze everything.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "JavaScript runs your code on **a single thread**: one thing at a time, one call stack. Yet a browser tab handles clicks, animations and network responses, and one Node process serves thousands of requests. The trick is the **event loop**: slow things (timers, network, disk) are handed off to the runtime, and their callbacks are queued to run later, when the stack is free. Knowing the exact rules lets you predict log order and avoid freezing your app.",
        },
        {
          type: "steps",
          items: [
            { title: "Call stack", text: "The functions currently running. JavaScript only does one thing: whatever is on top of the stack." },
            { title: "The runtime (browser / Node)", text: "Timers, `fetch`, file reads and DB sockets run outside your JS. When they finish, they queue a callback." },
            { title: "Task queue (macrotasks)", text: "Callbacks from `setTimeout`, `setInterval`, I/O, UI events like clicks." },
            { title: "Microtask queue", text: "Promise reactions (`.then`, `.catch`, `.finally`), code after an `await`, and `queueMicrotask`." },
            { title: "The loop", text: "Run the current task until the stack is empty → run **all** microtasks (including any added meanwhile) → the browser may render → take the **next one** task. Repeat forever." },
          ],
        },
        {
          type: "table",
          rows: [
            ["Code", "When the callback runs"],
            ["`setTimeout(fn, 0)` / `setInterval`", "Task queue: after the current code AND all microtasks"],
            ["UI events, network/I/O callbacks", "Task queue"],
            ["`promise.then(fn)`, code after `await`", "Microtask queue: as soon as the stack is empty"],
            ["`queueMicrotask(fn)`", "Microtask queue"],
            ["`new Promise((resolve) => { ... })` executor", "Immediately, synchronously!"],
          ],
        },
        {
          type: "run",
          title: "Predict, then run",
          code: `console.log("1 sync: start");

setTimeout(() => console.log("6 task: setTimeout 0"), 0);

Promise.resolve().then(() => console.log("4 microtask: .then"));

queueMicrotask(() => console.log("5 microtask: queueMicrotask"));

new Promise((resolve) => {
  console.log("2 sync: the Promise executor runs right away");
  resolve();
});

console.log("3 sync: end");

await new Promise((r) => setTimeout(r, 10)); // just lets the runner wait for every log`,
        },
        {
          type: "p",
          text: "Microtasks run **between** tasks. After each `setTimeout` callback, the whole microtask queue is drained before the next timer gets a turn.",
        },
        {
          type: "run",
          code: `setTimeout(() => {
  console.log("timeout 1");
  Promise.resolve().then(() => console.log("  microtask queued by timeout 1"));
}, 0);

setTimeout(() => console.log("timeout 2"), 0);

await new Promise((r) => setTimeout(r, 20));`,
        },
        { type: "h", text: "Where await fits" },
        {
          type: "p",
          text: "An `async` function runs **synchronously** until its first `await`. At that point it returns a pending promise to its caller, and the rest of the function is scheduled as a microtask once the awaited value is ready.",
        },
        {
          type: "run",
          code: `async function loadClient() {
  console.log("B inside loadClient, before await");
  await null;
  console.log("D after await (resumed as a microtask)");
}

console.log("A");
loadClient();
console.log("C loadClient returned at its first await");

await new Promise((r) => setTimeout(r, 0));`,
        },
        { type: "h", text: "Blocking the loop" },
        {
          type: "p",
          text: "While synchronous code runs, **nothing else can happen**: no timers fire, no clicks are handled, the page can't repaint, and a Node server can't even start answering the next request. A `setTimeout(fn, 10)` is a *minimum* delay, not a guarantee.",
        },
        {
          type: "run",
          code: `const start = Date.now();
setTimeout(() => console.log("timer wanted 10ms, actually fired after", Date.now() - start, "ms"), 10);

// Heavy synchronous work, e.g. scoring 200 000 leads in one go
let iterations = 0;
while (Date.now() - start < 300) {
  iterations++;
}
console.log("busy loop finished after", Date.now() - start, "ms");

await new Promise((r) => setTimeout(r, 20));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "On a Node server, this hurts everyone",
          text: "A Node/Express/Next.js server on Railway handles all requests on one thread. If one route parses a 50 MB JSON, hashes passwords with a `*Sync` function or loops over 1 million rows, **every other request on that instance waits**. Fixes: use async APIs, paginate, move heavy work to a background job/queue or `worker_threads`. In the browser, tasks over 50 ms are \"long tasks\" that freeze the UI and hurt the INP Core Web Vital.",
        },
        { type: "h", text: "Breaking up long work" },
        {
          type: "p",
          text: "If you must process a lot in the main thread, split it into chunks and **yield** between them with a `setTimeout(0)` promise. Each chunk becomes its own task, so waiting events get a turn in between.",
        },
        {
          type: "run",
          code: `async function processInChunks(items, chunkSize, handle) {
  for (let i = 0; i < items.length; i += chunkSize) {
    items.slice(i, i + chunkSize).forEach(handle);
    await new Promise((r) => setTimeout(r, 0)); // yield: let queued tasks run
  }
}

// a "click" that arrives while we're working
setTimeout(() => console.log(">> click handler got its turn between chunks"), 0);

const leads = Array.from({ length: 7 }, (_, i) => "lead-" + (i + 1));
await processInChunks(leads, 3, (lead) => console.log("scored", lead));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Microtasks can freeze you too",
          text: "Yielding with `await Promise.resolve()` does **not** help: it's a microtask, and microtasks all run before the next task or repaint. An infinite chain of `.then` callbacks freezes a page as surely as `while (true)`.",
        },
        {
          type: "code",
          lang: "js",
          title: "Node-only extras (read-only)",
          code: `// Node has two more queues you'll see in older code and libraries:
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));              // "check" phase, after I/O
process.nextTick(() => console.log("nextTick"));           // runs even before promise microtasks
Promise.resolve().then(() => console.log("promise"));

// Output in a CommonJS script: nextTick, promise, then timeout/immediate
// (the order of those last two can vary from the main module).
// Quirk: in an ES module, "promise" can print before "nextTick", because the
// module itself is evaluated inside a microtask.`,
        },
        {
          type: "challenge",
          title: "Predict the order (and yield properly)",
          prompt: "Part 1 and 2: without running them, fill `prediction1` and `prediction2` with the labels in the exact order the provided puzzles push them. Part 3: write `yieldToEventLoop()` that returns a promise resolving on a **later task**, so timers that were already queued get to run first.",
          starter: `// --- Provided puzzles: don't change them ---
function puzzle1() {
  const log = [];
  setTimeout(() => log.push("timeout"), 0);
  Promise.resolve().then(() => log.push("then"));
  log.push("sync");
  return new Promise((r) => setTimeout(() => r(log), 5));
}

async function puzzle2() {
  const log = [];
  async function save() {
    log.push("save start");
    await null;
    log.push("save end");
  }
  setTimeout(() => log.push("timeout"), 0);
  save().then(() => log.push("save resolved"));
  queueMicrotask(() => log.push("microtask"));
  log.push("sync end");
  await new Promise((r) => setTimeout(r, 5));
  return log;
}

// --- Your answers ---
const prediction1 = [];
const prediction2 = [];

function yieldToEventLoop() {
  return Promise.resolve();
}
`,
          solution: `// --- Provided puzzles: don't change them ---
function puzzle1() {
  const log = [];
  setTimeout(() => log.push("timeout"), 0);
  Promise.resolve().then(() => log.push("then"));
  log.push("sync");
  return new Promise((r) => setTimeout(() => r(log), 5));
}

async function puzzle2() {
  const log = [];
  async function save() {
    log.push("save start");
    await null;
    log.push("save end");
  }
  setTimeout(() => log.push("timeout"), 0);
  save().then(() => log.push("save resolved"));
  queueMicrotask(() => log.push("microtask"));
  log.push("sync end");
  await new Promise((r) => setTimeout(r, 5));
  return log;
}

// --- Your answers ---
const prediction1 = ["sync", "then", "timeout"];
const prediction2 = ["save start", "sync end", "save end", "microtask", "save resolved", "timeout"];

function yieldToEventLoop() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
`,
          tests: [
            {
              name: "prediction1 matches puzzle1's real order",
              code: `const actual = await puzzle1();
return JSON.stringify(actual) === JSON.stringify(prediction1);`,
            },
            {
              name: "prediction2 matches puzzle2's real order",
              code: `const actual = await puzzle2();
return JSON.stringify(actual) === JSON.stringify(prediction2);`,
            },
            {
              name: "yieldToEventLoop lets an already-queued timer run first",
              code: `const log = [];
setTimeout(() => log.push("timer"), 0);
await yieldToEventLoop();
return log.includes("timer");`,
            },
            {
              name: "yieldToEventLoop returns a promise",
              code: `const p = yieldToEventLoop();
await p;
return p instanceof Promise;`,
            },
          ],
          hint: "Sync code first, then every microtask in the order queued, then timers. In puzzle2, `save()` runs synchronously until `await null`; its `.then` callback can only be queued after \"save end\" runs. For part 3, a `setTimeout(resolve, 0)` puts the resolution in the task queue *behind* the timer already waiting there.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which logs first: `setTimeout(() => log(\"A\"), 0)` or `Promise.resolve().then(() => log(\"B\"))` (written in that order)?",
              options: ["A, because it was written first", "It's random", "B, because microtasks run before the next task"],
              answer: 2,
              why: "After the current code, the event loop drains the whole microtask queue (promise callbacks) before taking the next task (the timer).",
            },
            {
              q: "When does the function passed to `new Promise(fn)` run?",
              options: [
                "Immediately and synchronously, inside the `new Promise` call",
                "On the next microtask",
                "After a setTimeout of 0",
                "Only when someone calls `.then`",
              ],
              answer: 0,
              why: "The executor runs synchronously. Only the reactions (`.then`/`.catch`/`await` continuations) are deferred.",
            },
            {
              q: "A Node API route runs a synchronous loop for 2 seconds. What happens to other incoming requests on that instance?",
              options: [
                "They're handled in parallel on other threads",
                "They wait until the loop finishes, since the single JS thread is busy",
                "They get an automatic 503",
                "Node pauses the loop to serve them",
              ],
              answer: 1,
              why: "One thread, one call stack: nothing else runs until the current synchronous work finishes. Make heavy work async, chunked, or move it off the main thread.",
            },
            {
              q: "Why doesn't `await Promise.resolve()` inside a long loop keep the UI responsive?",
              options: [
                "`await` is ignored inside loops",
                "Promises are slower than timers",
                "It yields to the microtask queue, which is fully drained before rendering or handling clicks",
                "It actually does keep the UI responsive",
              ],
              answer: 2,
              why: "Rendering and input events are handled between tasks. A microtask yield returns control before the browser ever gets a chance; use a task (`setTimeout`) to yield.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Promises
    // ─────────────────────────────────────────────────────────────
    {
      slug: "promises",
      title: "Promises",
      summary: "Create, chain and combine promises, handle errors properly, and wrap old callback APIs.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "A **promise** is an object standing in for a value that isn't available yet: a client loaded from Supabase, a Shopify order, an email being sent. It starts **pending**, then **settles** exactly once: either **fulfilled** with a value or **rejected** with an error. Before promises, async code used nested callbacks, and every level had to handle errors by hand.",
        },
        {
          type: "compare",
          left: {
            label: "Callbacks (\"pyramid of doom\")",
            lang: "js",
            code: `getOrder(42, (err, order) => {
  if (err) return handle(err);
  getClient(order.clientId, (err, client) => {
    if (err) return handle(err);
    sendReceipt(client.email, (err) => {
      if (err) return handle(err);
      console.log("done");
    });
  });
});`,
          },
          right: {
            label: "Promises (flat chain, one catch)",
            lang: "js",
            code: `getOrder(42)
  .then((order) => getClient(order.clientId))
  .then((client) => sendReceipt(client.email))
  .then(() => console.log("done"))
  .catch(handle);`,
          },
        },
        { type: "h", text: "Creating a promise" },
        {
          type: "run",
          code: `function fetchClient(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("Client " + id + " not found"));
      else resolve({ id, name: "Client #" + id, plan: "pro" });
    }, 50);
  });
}

const pending = fetchClient(7);
console.log(pending);                 // a pending promise: the value isn't there yet

pending.then((client) => console.log("got", client.name));
fetchClient(0).catch((err) => console.log("failed:", err.message));

await new Promise((r) => setTimeout(r, 80));`,
        },
        {
          type: "list",
          items: [
            "A promise settles **once**. Calling `resolve` or `reject` again later is silently ignored.",
            "If the executor **throws**, the promise is rejected with that error.",
            "Always reject with an `Error` object (not a string): you get a message *and* a stack trace.",
          ],
        },
        { type: "h", text: "Chaining" },
        {
          type: "p",
          text: "`.then()` always returns a **new** promise, resolved with whatever your callback returns. If the callback returns a promise, the chain **waits** for it. That's what lets you flatten a sequence of async steps.",
        },
        {
          type: "run",
          code: `const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

const getOrder = (id) => wait(20, { id, clientId: 3, total: 480 });
const getClient = (id) => wait(20, { id, name: "Atelier Nordik", email: "info@nordik.example" });
const sendReceipt = (email, total) => wait(20, "Receipt for " + total + " $ sent to " + email);

await getOrder(42)
  .then((order) => getClient(order.clientId).then((client) => ({ order, client })))
  .then(({ order, client }) => sendReceipt(client.email, order.total))
  .then((message) => console.log(message))
  .finally(() => console.log("finally: runs after success OR failure"));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "The forgotten return",
          text: "Using braces in a `.then` callback without `return` breaks the chain: `.then((order) => { getClient(order.clientId); })` returns `undefined`, so the next step receives `undefined` immediately instead of waiting for the client. Either return the promise or use an expression body without braces.",
        },
        { type: "h", text: "Error propagation" },
        {
          type: "p",
          text: "A rejection (or an error thrown inside any `.then`) skips every following `.then` until it reaches a `.catch`. If the `.catch` returns a value, the chain **recovers** and continues as fulfilled.",
        },
        {
          type: "run",
          code: `await Promise.resolve(100)
  .then((total) => {
    if (total < 500) throw new Error("Minimum order is 500 $");
    return total;
  })
  .then(() => console.log("never runs: skipped because the chain is rejected"))
  .catch((err) => {
    console.log("caught:", err.message);
    return 0;                            // recover with a fallback value
  })
  .then((value) => console.log("chain continues with", value));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Unhandled rejections crash Node",
          text: "Since Node 15, a rejected promise that nobody handles terminates the process by default. Every chain needs a `.catch` at the end, or must be `await`ed inside a `try/catch`.",
        },
        { type: "h", text: "Combining promises" },
        {
          type: "table",
          rows: [
            ["Method", "Fulfills when", "Rejects when", "Typical use"],
            ["`Promise.all`", "all fulfill (values in input order)", "the first one rejects", "Load everything a page needs"],
            ["`Promise.allSettled`", "all settle (never rejects)", "never", "Send 50 emails, report which failed"],
            ["`Promise.race`", "the first to settle fulfills", "the first to settle rejects", "Timeouts"],
            ["`Promise.any`", "the first one fulfills", "all reject (`AggregateError`)", "Fastest of several sources"],
          ],
        },
        {
          type: "run",
          code: `const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (ms, msg) => new Promise((_, reject) => setTimeout(() => reject(new Error(msg)), ms));

console.log("all:", await Promise.all([wait(30, "clients"), wait(10, "invoices")]));

try {
  await Promise.all([wait(30, "clients"), fail(10, "invoices API down")]);
} catch (e) {
  console.log("all rejected:", e.message);
}

const settled = await Promise.allSettled([wait(10, "email A sent"), fail(5, "email B bounced")]);
console.log("allSettled:", settled.map((r) => (r.status === "fulfilled" ? r.value : "FAILED " + r.reason.message)));

console.log("race:", await Promise.race([wait(40, "slow API"), wait(10, "cache")]));

console.log("any:", await Promise.any([fail(5, "mirror 1 down"), wait(20, "mirror 2")]));

try {
  await Promise.any([fail(5, "a down"), fail(5, "b down")]);
} catch (e) {
  console.log("any rejected:", e.constructor.name, e.errors.map((x) => x.message));
}`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Promises don't cancel",
          text: "When `Promise.all` or `Promise.race` settles early, the other operations **keep running**: their results are just ignored. Real cancellation needs an `AbortController` (next lesson).",
        },
        { type: "h", text: "Turning callbacks into promises" },
        {
          type: "p",
          text: "Older Node APIs and libraries use **error-first callbacks**: `callback(err, result)`. Wrapping them in a promise once lets the rest of your code use `.then` / `await`.",
        },
        {
          type: "run",
          code: `// An old-style API, like many pre-2017 npm packages
function geocodeLegacy(address, callback) {
  setTimeout(() => {
    if (!address) callback(new Error("Address required"));
    else callback(null, { lat: 45.5, lng: -73.57 });
  }, 20);
}

function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}

const geocode = promisify(geocodeLegacy);
console.log(await geocode("1000 rue Sherbrooke, Montréal"));
try {
  await geocode("");
} catch (e) {
  console.log("rejected:", e.message);
}`,
        },
        {
          type: "code",
          lang: "js",
          title: "In Node, you rarely need to write it yourself",
          code: `import { promisify } from "node:util";
import { readFile } from "node:fs/promises";   // most core modules ship a promise version
import { setTimeout as sleep } from "node:timers/promises";

const text = await readFile("clients.csv", "utf8");
await sleep(100);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Not every failure is a rejection",
          text: "`fetch` only rejects on network failure: a 404 or 500 response **fulfills**, so you must check `res.ok`. The Supabase client resolves with `{ data, error }` and does not reject on a database error (unless you call `.throwOnError()`), so always check `error`. Know which style each API uses.",
        },
        {
          type: "challenge",
          title: "Timeouts and bulk sending",
          prompt: "Write `withTimeout(promise, ms)`: it settles like `promise`, unless `ms` milliseconds pass first, in which case it rejects with `new Error(\"Timed out after <ms>ms\")`. Then write `sendAll(emails, sendFn)`: call `sendFn(email)` for every address **in parallel** and resolve with `{ sent, failed }`, two arrays of addresses (in input order). One failure must not stop the others.",
          starter: `function withTimeout(promise, ms) {
  // TODO: race the promise against a timer that rejects
  return promise;
}

async function sendAll(emails, sendFn) {
  // TODO: use Promise.allSettled
  return { sent: [], failed: [] };
}
`,
          solution: `function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timed out after " + ms + "ms")), ms);
  });
  return Promise.race([promise, timeout]);
}

async function sendAll(emails, sendFn) {
  const results = await Promise.allSettled(emails.map((email) => sendFn(email)));
  const sent = [];
  const failed = [];
  results.forEach((result, i) => {
    (result.status === "fulfilled" ? sent : failed).push(emails[i]);
  });
  return { sent, failed };
}
`,
          tests: [
            {
              name: "withTimeout resolves with the value when the promise is fast enough",
              code: `const fast = new Promise((r) => setTimeout(() => r("report"), 10));
return (await withTimeout(fast, 60)) === "report";`,
            },
            {
              name: 'withTimeout rejects with "Timed out after 30ms" when too slow',
              code: `const slow = new Promise((r) => setTimeout(() => r("late"), 100));
try {
  await withTimeout(slow, 30);
  return false;
} catch (e) {
  return e instanceof Error && e.message === "Timed out after 30ms";
}`,
            },
            {
              name: "sendAll reports sent and failed addresses without stopping",
              code: `const send = (email) => new Promise((resolve, reject) =>
  setTimeout(() => (email.includes("@") ? resolve("ok") : reject(new Error("invalid"))), 5));
const r = await sendAll(["marie@exemple.ca", "oops", "luc@exemple.ca"], send);
return r.sent.join(",") === "marie@exemple.ca,luc@exemple.ca" && r.failed.join(",") === "oops";`,
            },
            {
              name: "sendAll sends in parallel (3 × 40ms takes well under 120ms)",
              code: `const send = () => new Promise((r) => setTimeout(r, 40));
const start = Date.now();
const r = await sendAll(["a@x.ca", "b@x.ca", "c@x.ca"], send);
return Date.now() - start < 100 && r.sent.length === 3;`,
            },
            {
              name: "sendAll with an empty list returns two empty arrays",
              code: `const r = await sendAll([], async () => "ok");
return r.sent.length === 0 && r.failed.length === 0;`,
            },
          ],
          hint: "`Promise.race([promise, timeoutPromise])` settles with whichever finishes first. For `sendAll`, `Promise.allSettled(emails.map(sendFn))` gives you one `{ status }` per email, in the same order as `emails`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `.then(callback)` return?",
              options: [
                "The value returned by the callback",
                "A new promise that resolves with what the callback returns",
                "The same promise it was called on",
                "undefined",
              ],
              answer: 1,
              why: "Every `.then` creates a new promise. That's what makes chaining work, and why a callback returning a promise makes the chain wait.",
            },
            {
              q: "You need to send 200 newsletter emails and report which ones failed. Which combinator?",
              options: ["Promise.all", "Promise.race", "Promise.any", "Promise.allSettled"],
              answer: 3,
              why: "`allSettled` waits for every promise and never rejects, giving you a status per item. `Promise.all` would reject at the first failure.",
            },
            {
              q: "`const res = await fetch(\"/api/leads\")` and the server answers 500. What happens?",
              options: [
                "The promise fulfills; `res.ok` is `false` and you must handle it yourself",
                "The promise rejects with the 500 error",
                "fetch retries automatically",
              ],
              answer: 0,
              why: "`fetch` only rejects on network-level failures. HTTP error statuses are normal responses: check `res.ok` / `res.status`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. async/await
    // ─────────────────────────────────────────────────────────────
    {
      slug: "async-await",
      title: "async/await in practice",
      summary: "Write async code that reads like sync code: error handling, parallel requests, timeouts with AbortController and retries.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "`async`/`await` is syntax on top of promises, not a new mechanism. An `async` function **always returns a promise**. `await` pauses **that function only** (not the thread, not the server) until a promise settles, then resumes it as a microtask. The result reads top-to-bottom like synchronous code, with ordinary `try/catch` for errors.",
        },
        {
          type: "compare",
          left: {
            label: "Promise chain",
            lang: "js",
            code: `function getReceipt(orderId) {
  return getOrder(orderId)
    .then((order) =>
      getClient(order.clientId).then((client) =>
        sendReceipt(client.email, order.total)
      )
    )
    .catch((err) => {
      console.error(err);
      return null;
    });
}`,
          },
          right: {
            label: "async/await",
            lang: "js",
            code: `async function getReceipt(orderId) {
  try {
    const order = await getOrder(orderId);
    const client = await getClient(order.clientId);
    return await sendReceipt(client.email, order.total);
  } catch (err) {
    console.error(err);
    return null;
  }
}`,
          },
        },
        {
          type: "run",
          code: `async function getPlan() {
  return "pro";                 // wrapped automatically: Promise<"pro">
}
console.log(getPlan() instanceof Promise);
console.log(await getPlan());

async function chargeCard() {
  throw new Error("Card declined");   // becomes a rejected promise
}
try {
  await chargeCard();
} catch (e) {
  console.log("caught:", e.message);
}`,
        },
        { type: "h", text: "Errors, finally and the loading pattern" },
        {
          type: "p",
          text: "Here's a realistic loader using a fake `fetch` (each run block defines its own, since real network access isn't available here). Note the explicit `res.ok` check: `fetch` does not throw on HTTP errors.",
        },
        {
          type: "run",
          code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function fakeFetch(url) {
  await wait(30);
  if (url.includes("broken")) {
    return { ok: false, status: 500, json: async () => ({ error: "Server error" }) };
  }
  return { ok: true, status: 200, json: async () => ({ url, leads: 3 }) };
}

async function loadDashboard(url) {
  let loading = true;
  try {
    const res = await fakeFetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.log("could not load", url, "→", err.message);
    return null;
  } finally {
    loading = false;              // always runs: spinners, cleanup, closing connections
    console.log("loading:", loading);
  }
}

console.log(await loadDashboard("/api/leads"));
console.log(await loadDashboard("/api/broken"));`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "return await inside try",
          text: "Inside a `try` block, write `return await somePromise`, not `return somePromise`. Without `await`, the function returns before the promise settles, so a rejection escapes your `catch` and `finally` runs too early.",
        },
        { type: "h", text: "Sequential vs parallel" },
        {
          type: "p",
          text: "`await` in a loop runs requests **one after another**. That's correct when each step depends on the previous one, but a waste of time when they're independent. Start them all, then await them together with `Promise.all`.",
        },
        {
          type: "run",
          code: `const wait = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));
const fetchStats = (client) => wait(50, { client, leads: client.length });
const clients = ["Lamarre", "Nordik", "Bonheur", "Maple"];

let t = Date.now();
const sequential = [];
for (const c of clients) {
  sequential.push(await fetchStats(c));   // waits for each before starting the next
}
console.log("sequential:", Date.now() - t, "ms");

t = Date.now();
const parallel = await Promise.all(clients.map((c) => fetchStats(c))); // all start at once
console.log("parallel:  ", Date.now() - t, "ms");
console.log(parallel.map((s) => s.client + "=" + s.leads).join(", "));`,
        },
        {
          type: "run",
          title: "forEach doesn't wait",
          code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const synced = [];

["lead-1", "lead-2"].forEach(async (lead) => {
  await wait(20);
  synced.push(lead);
});
console.log("after forEach:", synced);      // [] : forEach ignores the returned promises

await wait(40);
console.log("40ms later:", synced);

// ✅ use for...of (sequential) or Promise.all + map (parallel) instead`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Waterfalls in Next.js",
          text: "In a Server Component, `const client = await getClient(id); const invoices = await getInvoices(id);` makes the page wait for both requests *one after the other*. If they don't depend on each other, use `const [client, invoices] = await Promise.all([getClient(id), getInvoices(id)])`. When you must stay sequential (Shopify's API rate limits, for example), do it on purpose.",
        },
        { type: "h", text: "Timeouts and cancellation with AbortController" },
        {
          type: "p",
          text: "A promise can't be cancelled by itself. The standard cancellation tool is `AbortController`: you pass its `signal` to an operation, and calling `controller.abort()` tells that operation to stop. `fetch` supports it natively, and `AbortSignal.timeout(ms)` gives you a signal that aborts on its own.",
        },
        {
          type: "run",
          code: `// A fake fetch that honours an AbortSignal, like the real one does
function fakeFetch(url, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);
    const timer = setTimeout(() => resolve({ url, body: "report ready" }), 80);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);         // actually stop the work
      reject(signal.reason);
    }, { once: true });
  });
}

// 1. Manual abort (user left the page, typed a new search…)
const controller = new AbortController();
const pending = fakeFetch("/api/report", { signal: controller.signal });
setTimeout(() => controller.abort(), 20);
try {
  await pending;
} catch (e) {
  console.log("manual abort →", e.name);
}

// 2. Automatic timeout
try {
  await fakeFetch("/api/report", { signal: AbortSignal.timeout(30) });
} catch (e) {
  console.log("timeout →", e.name);
}

// 3. Fast enough: the signal never fires
console.log(await fakeFetch("/api/report", { signal: AbortSignal.timeout(500) }));`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "Real-world usage",
          code: `// Server side: never let a slow third-party API hang your route forever
const res = await fetch("https://api.example.com/leads", {
  signal: AbortSignal.timeout(5000),
});

// React: cancel the previous request when the query changes or the component unmounts
useEffect(() => {
  const controller = new AbortController();
  fetch(\`/api/search?q=\${encodeURIComponent(query)}\`, { signal: controller.signal })
    .then((res) => res.json())
    .then(setResults)
    .catch((err) => {
      if (err.name !== "AbortError") setError(err);
    });
  return () => controller.abort();
}, [query]);`,
        },
        { type: "h", text: "Retry with exponential backoff" },
        {
          type: "p",
          text: "Networks fail and APIs rate-limit you (Shopify answers `429 Too Many Requests` when you go too fast). A retry loop with **exponentially growing** delays plus a bit of random **jitter** gives the service room to recover instead of hammering it.",
        },
        {
          type: "run",
          code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let attempt = 0;
async function flakyShopifyCall() {
  attempt++;
  await wait(5);
  if (attempt < 3) throw new Error("429 Too Many Requests");
  return { products: 12 };
}

async function retry(fn, { retries = 3, baseMs = 10 } = {}) {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i >= retries) throw err;                               // out of attempts
      const delay = baseMs * 2 ** i + Math.random() * baseMs;    // 10, 20, 40… + jitter
      console.log("attempt " + (i + 1) + " failed (" + err.message + "), retrying in " + Math.round(delay) + "ms");
      await wait(delay);
    }
  }
}

console.log(await retry(flakyShopifyCall));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Retry only what's safe to retry",
          text: "Retry transient failures (network errors, 429, 502/503/504), not 400 or 401: those will fail every time. Respect a `Retry-After` header when there is one. And make retried *writes* idempotent (e.g. Stripe's `Idempotency-Key`) so a retry can't charge a client twice.",
        },
        {
          type: "challenge",
          title: "A fast, resilient dashboard loader",
          prompt: "Using the provided fake `api` (each call takes ~40 ms), write `async function loadDashboard(clientId)`. It must fetch the client and their invoices **in parallel**, and return `{ name, unpaidTotal }` where `unpaidTotal` is the sum of `amount` for invoices whose `status` is not `\"paid\"`. If any request fails, it must **not throw**: return `{ name: null, unpaidTotal: 0, error: <the error message> }`.",
          starter: `// Provided fake API: don't change it
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const api = {
  async getClient(id) {
    await delay(40);
    if (id === 404) throw new Error("Client not found");
    return { id, name: "Atelier Nordik" };
  },
  async getInvoices(clientId) {
    await delay(40);
    return [
      { id: 1, amount: 400, status: "paid" },
      { id: 2, amount: 250, status: "sent" },
      { id: 3, amount: 100, status: "overdue" },
    ];
  },
};

async function loadDashboard(clientId) {
  const client = await api.getClient(clientId);
  const invoices = await api.getInvoices(clientId);
  const unpaidTotal = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  return { name: client.name, unpaidTotal };
}
`,
          solution: `// Provided fake API: don't change it
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const api = {
  async getClient(id) {
    await delay(40);
    if (id === 404) throw new Error("Client not found");
    return { id, name: "Atelier Nordik" };
  },
  async getInvoices(clientId) {
    await delay(40);
    return [
      { id: 1, amount: 400, status: "paid" },
      { id: 2, amount: 250, status: "sent" },
      { id: 3, amount: 100, status: "overdue" },
    ];
  },
};

async function loadDashboard(clientId) {
  try {
    const [client, invoices] = await Promise.all([
      api.getClient(clientId),
      api.getInvoices(clientId),
    ]);
    const unpaidTotal = invoices
      .filter((inv) => inv.status !== "paid")
      .reduce((sum, inv) => sum + inv.amount, 0);
    return { name: client.name, unpaidTotal };
  } catch (err) {
    return { name: null, unpaidTotal: 0, error: err.message };
  }
}
`,
          tests: [
            {
              name: "Returns the client name and the unpaid total (250 + 100)",
              code: `const d = await loadDashboard(7);
return d.name === "Atelier Nordik" && d.unpaidTotal === 350;`,
            },
            {
              name: "Fetches both in parallel (≈40ms, not ≈80ms)",
              code: `const start = Date.now();
await loadDashboard(7);
return Date.now() - start < 70;`,
            },
            {
              name: "Returns an error object instead of throwing when the API fails",
              code: `try {
  const d = await loadDashboard(404);
  return d.name === null && d.unpaidTotal === 0 && d.error === "Client not found";
} catch {
  return false;
}`,
            },
          ],
          hint: "`const [client, invoices] = await Promise.all([api.getClient(clientId), api.getInvoices(clientId)])` starts both calls at once. Wrap the whole body in `try { ... } catch (err) { return { name: null, unpaidTotal: 0, error: err.message }; }`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does an `async` function always return?",
              options: ["Whatever value you `return`", "A promise", "undefined until it finishes", "A callback"],
              answer: 1,
              why: "Returned values are wrapped in a fulfilled promise and thrown errors become a rejected promise, so callers always get a promise.",
            },
            {
              q: "`for (const id of ids) await fetchClient(id)` with 5 ids, each taking 100 ms, takes about…",
              options: ["100 ms", "It depends on the CPU count", "500 ms", "0 ms, since await doesn't block"],
              answer: 2,
              why: "Each `await` waits for the previous request before starting the next: 5 × 100 ms. `Promise.all(ids.map(fetchClient))` would take about 100 ms.",
            },
            {
              q: "How do you make a `fetch` give up after 5 seconds?",
              options: [
                "`fetch(url, { timeout: 5000 })`",
                "Wrap it in `setTimeout(..., 5000)`",
                "`await fetch(url); await sleep(5000)`",
                "`fetch(url, { signal: AbortSignal.timeout(5000) })`",
              ],
              answer: 3,
              why: "`fetch` has no `timeout` option. An `AbortSignal` that aborts after 5 s actually cancels the request and rejects with a `TimeoutError`.",
            },
            {
              q: "While an `async` route handler is paused on `await db.query(...)`, can the Node server handle other requests?",
              options: [
                "Yes: `await` only pauses that function and frees the thread for other work",
                "No: `await` blocks the whole thread",
                "Only if the query takes over 1 second",
              ],
              answer: 0,
              why: "`await` hands control back to the event loop. That's exactly how one Node thread serves many concurrent requests, as long as nobody runs long synchronous code.",
            },
          ],
        },
      ],
    },
  ],
};
