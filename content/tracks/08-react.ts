import type { Track } from "../types";

export const track: Track = {
  slug: "react",
  order: 8,
  title: "React",
  tagline: "Describe the UI for any state — React keeps the screen in sync",
  outcome:
    "Build typed React 19 components with props, state, events, forms, effects, reducers, context and custom hooks — and understand when and why they re-render.",
  badge: "RCT",
  color: "#61dafb",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Thinking in React
    // ─────────────────────────────────────────────────────────────
    {
      slug: "thinking-in-react",
      title: "Thinking in React",
      summary: "UI = f(state): you describe what the screen should look like, React figures out how to get there.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Before React, building an interactive page meant writing **instructions**: find this element, change its text, add a class, remove that row. Every feature added more instructions, and every instruction had to know about every other one. Forget one place and the screen lies: the badge says 3 leads, the list shows 4.",
        },
        {
          type: "p",
          text: "React flips this around. You write a function that says **what the UI should look like for a given state**. When the state changes, React calls your function again and updates the real DOM to match. You stop managing transitions and only describe destinations.",
        },
        {
          type: "compare",
          left: {
            label: "Imperative DOM (you manage every change)",
            lang: "js",
            code: `const list = document.querySelector("#leads");
const badge = document.querySelector("#count");
let leads = [];

function addLead(name) {
  leads.push(name);
  const li = document.createElement("li");
  li.textContent = name;
  list.appendChild(li);
  badge.textContent = leads.length; // don't forget!
  if (leads.length === 1) {
    document.querySelector("#empty").remove(); // or this!
  }
}
// ...and removeLead() must undo all of it, in the right order`,
          },
          right: {
            label: "React (you describe the result)",
            lang: "tsx",
            code: `function LeadPanel({ leads }: { leads: string[] }) {
  return (
    <section>
      <span id="count">{leads.length}</span>
      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul>
          {leads.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
// Adding or removing a lead = new state. Same function.`,
          },
        },
        { type: "h", text: "UI = f(state)" },
        {
          type: "p",
          text: "That formula is the whole mental model. A **component** is a function that takes data (props and state) and returns a description of the UI. It doesn't touch the DOM. It just returns plain objects that say \"a `section` containing a `span` with the text 3, then a `ul` with these items\". This description is often called the **virtual DOM** or element tree.",
        },
        {
          type: "list",
          items: [
            "**Components** are functions whose names start with a capital letter (`LeadPanel`, `InvoiceRow`). They return elements.",
            "**Elements** are cheap plain objects like `{ type: \"li\", props: { children: \"Garage Tremblay\" } }`. Creating thousands of them is fine.",
            "**State** is data that changes over time (what the user typed, which tab is open, the cart). When it changes, React re-runs the components that depend on it.",
            "**Reconciliation**: React compares the new element tree with the previous one and applies only the differences to the real DOM.",
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Trigger", text: "Something asks for an update: the first render, or a state setter like `setLeads(...)` being called." },
            { title: "Render", text: "React calls your component functions. They return a fresh element tree. Nothing on screen has changed yet — this step must be pure." },
            { title: "Commit", text: "React diffs the new tree against the previous one and applies the minimal DOM changes (insert this `li`, change that text)." },
            { title: "Browser paint", text: "The browser draws the updated DOM. Then effects run (more in the useEffect lesson)." },
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "\"Render\" doesn't mean \"paint\"",
          text: "In React vocabulary, **rendering** means *calling your component function*. It's a calculation. If the result is identical to last time, React touches nothing in the DOM. That's why components must be pure: same inputs, same output, no side effects while rendering.",
        },
        { type: "h", text: "Build a tiny React (without the DOM)" },
        {
          type: "p",
          text: "The best way to demystify React is to build the core idea yourself. Below, `h(type, props, ...children)` creates element objects — this is exactly what JSX compiles to (React calls it `createElement` / `jsx`). `renderToString` walks the tree and produces HTML. Function components are just called with their props.",
        },
        {
          type: "run",
          title: "toy createElement + renderToString",
          code: `// h = "hyperscript": creates a plain element object
function h(type, props, ...children) {
  return { type, props: { ...props, children: children.flat() } };
}

function renderToString(node) {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(renderToString).join("");
  // A function component: call it with its props, render what it returns
  if (typeof node.type === "function") return renderToString(node.type(node.props));
  const { children, ...attrs } = node.props;
  const attrText = Object.entries(attrs)
    .map(([k, v]) => " " + (k === "className" ? "class" : k) + '="' + v + '"')
    .join("");
  return "<" + node.type + attrText + ">" + renderToString(children) + "</" + node.type + ">";
}

// Components = functions that return elements
function LeadItem(props) {
  return h("li", { className: props.hot ? "hot" : "cold" }, props.name);
}

function LeadPanel(props) {
  return h("section", null,
    h("h2", null, "Leads (", props.leads.length, ")"),
    props.leads.length === 0
      ? h("p", null, "No leads yet.")
      : h("ul", null, props.leads.map((l) => h(LeadItem, l))),
  );
}

// UI = f(state): same function, different state
let state = { leads: [] };
console.log(renderToString(h(LeadPanel, state)));

state = { leads: [{ name: "Garage Tremblay", hot: true }, { name: "Boulangerie Ste-Rose", hot: false }] };
console.log(renderToString(h(LeadPanel, state)));

// The element tree itself is just data:
console.log(JSON.stringify(h("li", { className: "hot" }, "Garage Tremblay")));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "This is literally what Next.js does on the server",
          text: "When a Next.js App Router page loads, React runs your components **on the server**, turns the element tree into HTML (like our `renderToString`, but streaming) and sends it to the browser. In the browser, React then *hydrates*: it attaches event handlers to that existing HTML so it becomes interactive.",
        },
        {
          type: "challenge",
          title: "Finish the renderer",
          prompt: "`h` is given. Implement `renderToString(node)` so that it: renders strings and numbers as text, skips `null`, `undefined`, `true` and `false`, renders arrays by concatenating their items, **calls function components** with their props, renders `className` as `class`, and **escapes** `<`, `>` and `&` in text (`&lt;`, `&gt;`, `&amp;`) — React does this for you, which is why `{userInput}` is safe from HTML injection.",
          starter: `function h(type, props, ...children) {
  return { type, props: { ...props, children: children.flat() } };
}

function escapeHtml(text) {
  // TODO: replace & first, then < and >
  return text;
}

function renderToString(node) {
  // TODO
  return "";
}`,
          solution: `function h(type, props, ...children) {
  return { type, props: { ...props, children: children.flat() } };
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderToString(node) {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return escapeHtml(String(node));
  if (Array.isArray(node)) return node.map(renderToString).join("");
  if (typeof node.type === "function") return renderToString(node.type(node.props));
  const { children, ...attrs } = node.props;
  const attrText = Object.entries(attrs)
    .map(([k, v]) => " " + (k === "className" ? "class" : k) + '="' + v + '"')
    .join("");
  return "<" + node.type + attrText + ">" + renderToString(children) + "</" + node.type + ">";
}`,
          tests: [
            { name: "renders a simple element with text", code: `return renderToString(h("p", null, "Bonjour")) === "<p>Bonjour</p>";` },
            { name: "className becomes class", code: `return renderToString(h("span", { className: "badge" }, "New")) === '<span class="badge">New</span>';` },
            { name: "skips null/false/true children, renders numbers", code: `return renderToString(h("ul", null, false, h("li", null, 3), null, true)) === "<ul><li>3</li></ul>";` },
            { name: "calls function components with their props", code: `const Badge = (props) => h("b", null, props.label);
return renderToString(h("div", null, h(Badge, { label: "VIP" }))) === "<div><b>VIP</b></div>";` },
            { name: "escapes text so user input can't inject HTML", code: `return renderToString(h("p", null, "<script>alert(1)</script> & co")) === "<p>&lt;script&gt;alert(1)&lt;/script&gt; &amp; co</p>";` },
          ],
          hint: "Handle the cases in order: nothing to render → text → array → function component → regular element. For a function component, `node.type(node.props)` gives you a new node to render recursively.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In React vocabulary, what does \"rendering a component\" mean?",
              options: [
                "Calling the component function to compute a new element tree",
                "Repainting the pixels of that component on screen",
                "Writing HTML into `innerHTML`",
                "Downloading the component's JavaScript",
              ],
              answer: 0,
              why: "Rendering is a calculation. React then *commits* only the differences to the DOM, and the browser paints. A render that produces the same output changes nothing on screen.",
            },
            {
              q: "Why must a component be pure (no side effects while rendering)?",
              options: [
                "Because JSX can't contain function calls",
                "Because TypeScript requires it",
                "Because React may call it many times, at moments it chooses, and expects the same output for the same inputs",
              ],
              answer: 2,
              why: "React can render components more than once (StrictMode does it on purpose in dev), pause renders or throw them away. Side effects during render would happen an unpredictable number of times.",
            },
            {
              q: "What is a React element?",
              options: [
                "A real DOM node",
                "A plain object describing what should appear, like `{ type: \"li\", props: {...} }`",
                "A class instance with lifecycle methods",
              ],
              answer: 1,
              why: "Elements are lightweight descriptions. React compares them between renders and decides which real DOM nodes to create, update or remove.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. JSX & components
    // ─────────────────────────────────────────────────────────────
    {
      slug: "jsx-and-components",
      title: "JSX & components",
      summary: "JSX is just function calls with HTML-like syntax — learn its rules, conditionals, lists and why keys matter.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Writing `h(\"ul\", null, h(\"li\", null, ...))` by hand gets unreadable fast. **JSX** lets you write the same thing with HTML-like syntax. It's not HTML and it's not a string: a compiler (TypeScript, SWC in Next.js, Babel) turns every tag into a function call that creates an element object.",
        },
        {
          type: "compare",
          left: {
            label: "What you write (.tsx)",
            lang: "tsx",
            code: `function InvoiceBadge({ paid }: { paid: boolean }) {
  return (
    <span className="badge">
      {paid ? "Paid" : "Due"}
    </span>
  );
}

<InvoiceBadge paid={false} />`,
          },
          right: {
            label: "What the compiler outputs",
            lang: "js",
            code: `import { jsx as _jsx } from "react/jsx-runtime";

function InvoiceBadge({ paid }) {
  return _jsx("span", {
    className: "badge",
    children: paid ? "Paid" : "Due",
  });
}

_jsx(InvoiceBadge, { paid: false });`,
          },
        },
        {
          type: "p",
          text: "Once you see that JSX is function calls, most of its rules make sense: a lowercase tag (`span`) becomes a string type (a DOM element), a capitalized tag (`InvoiceBadge`) becomes a reference to your function. That's why **components must start with a capital letter** — `<invoiceBadge />` would be treated as an unknown HTML tag.",
        },
        { type: "h", text: "The rules of JSX" },
        {
          type: "table",
          rows: [
            ["Rule", "Example", "Why"],
            ["Curly braces hold any JS **expression**", "`{client.name}`, `{total * 1.14975}`, `{format(date)}`", "The value becomes a function argument. Statements (`if`, `for`) can't go there."],
            ["`className`, not `class`", "`<div className=\"card\">`", "Props are JS object keys; `class` is a reserved word. Same for `htmlFor` instead of `for`."],
            ["camelCase attributes & events", "`onClick`, `tabIndex`, `aria-label` stays as-is", "They map to DOM properties. `aria-*` and `data-*` keep their dashes."],
            ["`style` takes an object", "`style={{ marginTop: 8 }}`", "Outer braces = expression, inner braces = object literal. Numbers get `px`."],
            ["Return one root", "`<>...</>` (a Fragment)", "A function returns one value. Fragments group without adding a DOM node."],
            ["Close every tag", "`<img />`, `<input />`", "JSX is stricter than HTML: self-closing tags need the slash."],
          ],
        },
        {
          type: "code",
          lang: "tsx",
          title: "ClientCard.tsx",
          code: `type Client = { name: string; city: string; logoUrl?: string; overdue: number };

export function ClientCard({ client }: { client: Client }) {
  return (
    <>
      <h3 className="text-lg font-semibold">{client.name}</h3>
      <p style={{ color: "gray" }}>{client.city.toUpperCase()}</p>
      {client.logoUrl && <img src={client.logoUrl} alt={client.name + " logo"} />}
      <label htmlFor="notes">Notes</label>
      <textarea id="notes" defaultValue="" />
    </>
  );
}`,
        },
        { type: "h", text: "Conditional rendering" },
        {
          type: "p",
          text: "Because JSX is expressions, you choose what to show with normal JS: a ternary for either/or, `&&` for \"show or nothing\", or an early `return` for whole-component cases. `null`, `undefined`, `true` and `false` render nothing.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function InvoiceStatus({ invoice }: { invoice: Invoice | null }) {
  if (!invoice) return <p>Loading…</p>;             // early return

  return (
    <div>
      {invoice.paid ? <PaidBadge /> : <DueBadge />}    {/* either / or */}
      {invoice.overdueDays > 30 && <Warning />}        {/* show or nothing */}
    </div>
  );
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "The `0 &&` trap",
          text: "`{leads.length && <LeadList />}` renders a literal **0** on the page when the list is empty, because `0 && x` evaluates to `0`, and numbers are rendered. Use a real boolean: `{leads.length > 0 && <LeadList />}`.",
        },
        { type: "h", text: "Lists and keys" },
        {
          type: "p",
          text: "To render a list, `map` your data to elements. Each element in the array needs a `key`: a string or number that is **stable** and **unique among its siblings** — usually the database id.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function ProductList({ products }: { products: Product[] }) {
  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>
          {p.title} — {p.price.toFixed(2)} $
        </li>
      ))}
    </ul>
  );
}`,
        },
        {
          type: "p",
          text: "Why does React care? When the list changes, React must decide which old item corresponds to which new item. **The key is the identity.** Same key = same component instance, so its state (what's typed in its input, whether it's expanded) and its DOM node are kept. Without keys (or with array indexes), React matches by *position* — and if you insert at the top, every item's state shifts onto the wrong row.",
        },
        {
          type: "run",
          title: "key = identity: index vs id",
          code: `// Each row has an <input> where the user typed a note.
// React stores that component state under the row's key.
const leads = [
  { id: "lead_17", name: "Garage Tremblay" },
  { id: "lead_42", name: "Boulangerie Ste-Rose" },
];

// The user typed a note in the FIRST row (Garage Tremblay)
const stateByIndexKey = new Map([[0, "Call back Monday"]]);
const stateByIdKey = new Map([["lead_17", "Call back Monday"]]);

// A new lead arrives at the top of the list
const next = [{ id: "lead_99", name: "Clinique Dentaire Laval" }, ...leads];

function show(label, items, stateMap, getKey) {
  console.log(label);
  items.forEach((item, index) => {
    const note = stateMap.get(getKey(item, index)) ?? "";
    console.log("  " + item.name.padEnd(26) + " note: " + (note || "-"));
  });
}

show("key={index}  (state follows the POSITION):", next, stateByIndexKey, (_, i) => i);
show("key={lead.id} (state follows the ITEM):", next, stateByIdKey, (item) => item.id);`,
        },
        {
          type: "list",
          items: [
            "Use ids from your data (`invoice.id`, Shopify's `product.id`, Supabase's `uuid`).",
            "Index keys are OK **only** if the list never reorders, filters or inserts (a static footer menu).",
            "Never generate keys during render (`key={crypto.randomUUID()}`): a new key every render means React destroys and recreates every row, losing state and focus.",
            "Keys only need to be unique among siblings, not globally. The `key` is not passed to your component as a prop.",
          ],
        },
        {
          type: "challenge",
          title: "Think like the reconciler",
          prompt: "Write `diffKeys(prevKeys, nextKeys)` that returns `{ added, removed, kept, duplicates }`: `added` = keys in next but not prev (in next order), `removed` = keys in prev but not next (in prev order), `kept` = keys in both (in next order, each once), `duplicates` = keys appearing more than once in next (each listed once, in order of first repeat) — React warns about those in the console.",
          starter: `function diffKeys(prevKeys, nextKeys) {
  // TODO
  return { added: [], removed: [], kept: [], duplicates: [] };
}`,
          solution: `function diffKeys(prevKeys, nextKeys) {
  const prev = new Set(prevKeys);
  const next = new Set(nextKeys);
  const seen = new Set();
  const duplicates = [];
  for (const key of nextKeys) {
    if (seen.has(key) && !duplicates.includes(key)) duplicates.push(key);
    seen.add(key);
  }
  return {
    added: [...next].filter((k) => !prev.has(k)),
    removed: [...prev].filter((k) => !next.has(k)),
    kept: [...next].filter((k) => prev.has(k)),
    duplicates,
  };
}`,
          tests: [
            { name: "inserting at the top: one added, others kept", code: `const r = diffKeys(["a", "b"], ["z", "a", "b"]);
return JSON.stringify(r.added) === '["z"]' && JSON.stringify(r.kept) === '["a","b"]' && r.removed.length === 0;` },
            { name: "a pure reorder adds and removes nothing", code: `const r = diffKeys(["a", "b", "c"], ["c", "a", "b"]);
return r.added.length === 0 && r.removed.length === 0 && JSON.stringify(r.kept) === '["c","a","b"]';` },
            { name: "filtering removes keys (in prev order)", code: `const r = diffKeys(["inv_1", "inv_2", "inv_3"], ["inv_2"]);
return JSON.stringify(r.removed) === '["inv_1","inv_3"]';` },
            { name: "detects duplicate keys once each", code: `const r = diffKeys([], ["x", "y", "x", "x", "y"]);
return JSON.stringify(r.duplicates) === '["x","y"]' && JSON.stringify(r.added) === '["x","y"]';` },
            { name: "empty lists give empty results", code: `const r = diffKeys([], []);
return r.added.length + r.removed.length + r.kept.length + r.duplicates.length === 0;` },
          ],
          hint: "Build `Set`s from both arrays: `set.has(key)` answers \"is it in the other list?\". Spreading a Set (`[...set]`) keeps insertion order and removes duplicates.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`{cart.length && <CartSummary />}` with an empty cart renders…",
              options: ["Nothing", "The text \"false\"", "The number 0", "An error"],
              answer: 2,
              why: "`0 && x` evaluates to `0`, and React renders numbers. Use `cart.length > 0 && …` so the left side is a boolean.",
            },
            {
              q: "Why does `<invoiceRow />` (lowercase) not render your `invoiceRow` component?",
              options: [
                "Lowercase tags compile to a string type, so React creates an unknown HTML element `<invoicerow>`",
                "Component files must be named in PascalCase",
                "Lowercase components are server-only",
              ],
              answer: 0,
              why: "JSX uses capitalization to decide: lowercase → `jsx(\"invoiceRow\", …)` (a DOM tag), capitalized → `jsx(InvoiceRow, …)` (your function).",
            },
            {
              q: "Which is the best key for a list of Supabase rows?",
              options: ["The array index", "`Math.random()`", "The row's `id` column", "The row's `name`"],
              answer: 2,
              why: "The primary key is stable across renders and unique. Index breaks on reorder/insert, random changes every render, and names can collide or change.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Props
    // ─────────────────────────────────────────────────────────────
    {
      slug: "props-and-composition",
      title: "Props & composition",
      summary: "Pass data down with typed props, use children to compose, and prefer small building blocks over giant configurable components.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Props are to components what arguments are to functions. A parent passes data down; the child uses it to decide what to render. Data flows **one way**: from parent to child. A child never changes its props — if something needs to change, the parent owns that state and passes down new props (or a callback).",
        },
        {
          type: "code",
          lang: "tsx",
          title: "ProductCard.tsx",
          code: `type ProductCardProps = {
  title: string;
  price: number;              // in cents, from Shopify or Supabase
  currency?: "CAD" | "USD";   // optional
  onSale?: boolean;
  onAddToCart: (id: string) => void;
  id: string;
};

export function ProductCard({
  id,
  title,
  price,
  currency = "CAD",           // default value via destructuring
  onSale = false,
  onAddToCart,
}: ProductCardProps) {
  const formatted = new Intl.NumberFormat("fr-CA", { style: "currency", currency }).format(price / 100);
  return (
    <article className="rounded-xl border p-4">
      <h3>{title}</h3>
      <p>{formatted} {onSale && <span className="text-red-600">Solde!</span>}</p>
      <button onClick={() => onAddToCart(id)}>Ajouter</button>
    </article>
  );
}

// Usage — TypeScript checks every prop:
<ProductCard id="p_1" title="Café moulu" price={1499} onAddToCart={addToCart} />
// ❌ <ProductCard title="Café" price="14.99" />
//    Type 'string' is not assignable to type 'number'.
//    Property 'onAddToCart' is missing...`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Type props with a `type` next to the component",
          text: "Destructure in the signature, give defaults there, and keep the props type right above. Avoid `React.FC` — plain function signatures are simpler and it's what the React and Next.js docs use.",
        },
        { type: "h", text: "children: components that wrap other components" },
        {
          type: "p",
          text: "Whatever you put between a component's opening and closing tags arrives as the special `children` prop. Its type is `React.ReactNode` (anything renderable: elements, strings, numbers, arrays, `null`). This is how you build layouts, cards, modals and other containers that don't care what's inside.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `import type { ReactNode } from "react";

type CardProps = { title: string; actions?: ReactNode; children: ReactNode };

function Card({ title, actions, children }: CardProps) {
  return (
    <section className="rounded-xl border p-4">
      <header className="flex justify-between">
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}

// Any content, decided by the parent:
<Card title="Facture #1042" actions={<button>Envoyer</button>}>
  <InvoiceLines lines={lines} />
  <p>Total: 1 149,75 $</p>
</Card>`,
        },
        { type: "h", text: "Composition over configuration" },
        {
          type: "p",
          text: "A common trap: one component that does everything through flags. Every new client request adds a prop, and the component becomes a maze of conditions. The React way is to make **small pieces** and let the parent assemble them.",
        },
        {
          type: "compare",
          left: {
            label: "Configuration (grows forever)",
            lang: "tsx",
            code: `<Modal
  title="Supprimer le client?"
  showIcon
  iconType="warning"
  showCancel
  cancelLabel="Annuler"
  confirmLabel="Supprimer"
  confirmVariant="danger"
  showCheckbox
  checkboxLabel="Supprimer aussi les factures"
/>`,
          },
          right: {
            label: "Composition (flexible, readable)",
            lang: "tsx",
            code: `<Modal>
  <Modal.Title>
    <WarningIcon /> Supprimer le client?
  </Modal.Title>
  <Checkbox>Supprimer aussi les factures</Checkbox>
  <Modal.Actions>
    <Button variant="ghost">Annuler</Button>
    <Button variant="danger">Supprimer</Button>
  </Modal.Actions>
</Modal>`,
          },
        },
        {
          type: "code",
          lang: "tsx",
          title: "Extending native elements",
          code: `import type { ComponentProps } from "react";

// Accept every prop a <button> accepts (type, disabled, onClick, aria-*...)
type ButtonProps = ComponentProps<"button"> & { variant?: "primary" | "danger" | "ghost" };

export function Button({ variant = "primary", className, ...rest }: ButtonProps) {
  return <button className={cx("btn", "btn-" + variant, className)} {...rest} />;
}
// In React 19, \`ref\` is a normal prop too — no more forwardRef needed.`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Props are read-only",
          text: "Never do `props.client.name = \"...\"` or `props.items.push(...)`. You'd be mutating the parent's data behind React's back: nothing re-renders and other components see corrupted data. Compute new values instead (`const label = client.name.toUpperCase()`).",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Tailwind + className merging",
          text: "With Tailwind, reusable components usually accept a `className` prop and merge it with their own classes. Libraries like `clsx` (and `tailwind-merge`, used by shadcn/ui's `cn()` helper) do this. You're about to write your own.",
        },
        {
          type: "run",
          title: "Props are just an object",
          code: `// A component is a function of its props. Calling it twice with the
// same props gives the same result — that's what makes it predictable.
function InvoiceRow({ number, client, amount, paid = false }) {
  const status = paid ? "payée" : "à payer";
  return "#" + number + " " + client.padEnd(22) + amount.toFixed(2).padStart(9) + " $  (" + status + ")";
}

const invoices = [
  { id: 1, number: 1042, client: "Garage Tremblay", amount: 1149.75, paid: true },
  { id: 2, number: 1043, client: "Boulangerie Ste-Rose", amount: 312.5 },
];

for (const inv of invoices) console.log(InvoiceRow(inv));

// React freezes props in development so accidental mutation fails loudly:
const props = Object.freeze({ client: "Garage Tremblay" });
try {
  props.client = "Hacked";
} catch (e) {
  console.log("Mutating props:", e.constructor.name, "-", e.message);
}`,
        },
        {
          type: "challenge",
          title: "Write your own `cx` (className helper)",
          prompt: "Write `cx(...args)` that builds a className string. Accept strings, falsy values (`false`, `null`, `undefined`, `\"\"`, `0` — skipped), objects (`{ \"bg-red-500\": isLate }` — include keys whose value is truthy) and arrays (possibly nested, handled recursively). Join with single spaces.",
          starter: `function cx(...args) {
  return args.join(" ");
}`,
          solution: `function cx(...args) {
  const out = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === "string") out.push(arg);
    else if (Array.isArray(arg)) {
      const inner = cx(...arg);
      if (inner) out.push(inner);
    } else if (typeof arg === "object") {
      for (const [key, on] of Object.entries(arg)) if (on) out.push(key);
    }
  }
  return out.join(" ");
}`,
          tests: [
            { name: "joins plain strings", code: `return cx("btn", "btn-primary") === "btn btn-primary";` },
            { name: "skips falsy values", code: `const isLate = false;
return cx("badge", isLate && "badge-red", null, undefined, "", 0) === "badge";` },
            { name: "object syntax includes only truthy keys", code: `return cx("row", { "bg-red-50": true, "line-through": false, "font-bold": 1 }) === "row bg-red-50 font-bold";` },
            { name: "handles nested arrays", code: `return cx(["p-4", ["rounded", false, { shadow: true }]], "border") === "p-4 rounded shadow border";` },
            { name: "returns an empty string when nothing applies", code: `return cx(false, null, {}, []) === "";` },
          ],
          hint: "Loop over `args` and branch on the type of each one. For arrays, call `cx(...arg)` recursively. For objects, `Object.entries(obj)` gives `[className, condition]` pairs.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A child component needs to change a value it received as a prop. What's the React way?",
              options: [
                "Assign to the prop directly",
                "The parent owns the state and passes down a callback (e.g. `onChange`) the child calls",
                "Copy the prop to a global variable",
              ],
              answer: 1,
              why: "Data flows down, events flow up. The owner of the state updates it; the new value flows down as props on the next render.",
            },
            {
              q: "What type should a `children` prop usually have?",
              options: ["`string`", "`JSX.Element[]`", "`any`", "`React.ReactNode`"],
              answer: 3,
              why: "`ReactNode` covers everything React can render: elements, strings, numbers, arrays, fragments, `null`, booleans.",
            },
            {
              q: "Your `<Table>` has 14 boolean props and keeps growing. What usually helps?",
              options: [
                "Split it into smaller composable parts (`<Table.Header>`, `<Table.Row>`...) the parent assembles",
                "Merge the booleans into one big `options` object",
                "Convert it to a class component",
              ],
              answer: 0,
              why: "Composition moves the decisions to the place that knows the context (the parent) and keeps each piece simple.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. useState
    // ─────────────────────────────────────────────────────────────
    {
      slug: "state-with-usestate",
      title: "State with useState",
      summary: "Give components memory: how state triggers re-renders, why state is a snapshot, and how to update objects and arrays immutably.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Props come from outside. **State** is a component's own memory: the value in a search box, whether a menu is open, the items in a cart. Why can't a normal variable do this? Two reasons: a local variable is re-created on every render (the function runs again from the top), and changing it doesn't tell React to re-render.",
        },
        {
          type: "compare",
          left: {
            label: "❌ Local variable",
            lang: "tsx",
            code: `function LikeButton() {
  let likes = 0;
  return (
    <button onClick={() => { likes++; }}>
      ♥ {likes}
    </button>
  );
}
// Clicking changes 'likes'... but React never
// re-renders, and if it did, likes would be 0 again.`,
          },
          right: {
            label: "✅ useState",
            lang: "tsx",
            code: `import { useState } from "react";

function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ♥ {likes}
    </button>
  );
}
// setLikes stores the new value AND
// schedules a re-render.`,
          },
        },
        {
          type: "list",
          items: [
            "`useState(initial)` returns a pair: the current value and a setter. Name them `[thing, setThing]`.",
            "React keeps the value **outside** your function, tied to this component's position in the tree. Each `<LikeButton />` on the page has its own.",
            "Calling the setter **queues** an update and a re-render. On the next render, `useState` returns the new value.",
            "Hooks (`useState`, `useEffect`, …) must be called at the top level of a component — never inside `if`, loops or nested functions. React identifies them by call order.",
          ],
        },
        { type: "h", text: "State is a snapshot" },
        {
          type: "p",
          text: "Inside one render, `likes` is a **constant**. Calling `setLikes` doesn't change the variable you're holding; it asks for a *future* render with a new value. This surprises everyone once:",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function Counter() {
  const [count, setCount] = useState(0);

  function addThree() {
    setCount(count + 1); // count is 0 in this render → "set to 1"
    setCount(count + 1); // count is STILL 0 → "set to 1"
    setCount(count + 1); // → "set to 1"
    console.log(count);  // 0 — the snapshot didn't change
  }

  function addThreeForReal() {
    setCount((c) => c + 1); // updater: "take the latest value, add 1"
    setCount((c) => c + 1);
    setCount((c) => c + 1); // → 3 more
  }
  // ...
}`,
        },
        {
          type: "p",
          text: "React **batches** all the updates from one event and processes them in order before re-rendering. A plain value means \"replace with this\"; a function means \"compute from the previous pending value\". Let's simulate the queue:",
        },
        {
          type: "run",
          title: "How React processes a state update queue",
          code: `function processQueue(baseState, queue) {
  let state = baseState;
  for (const update of queue) {
    state = typeof update === "function" ? update(state) : update;
  }
  return state;
}

const count = 0; // the snapshot for this render

// setCount(count + 1) three times → three "replace with 1"
console.log("values:  ", processQueue(count, [count + 1, count + 1, count + 1]));

// setCount(c => c + 1) three times → chained
console.log("updaters:", processQueue(count, [(c) => c + 1, (c) => c + 1, (c) => c + 1]));

// Mixed: replace with 5, then +1 → 6, then replace with 42
console.log("mixed:   ", processQueue(count, [5, (c) => c + 1, 42]));`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "When to use an updater",
          text: "Use `setX(prev => ...)` whenever the new value depends on the old one and the update may run more than once or later (multiple calls in one handler, timers, async callbacks). It always reads the latest value instead of a stale snapshot.",
        },
        { type: "h", text: "Objects and arrays: replace, don't mutate" },
        {
          type: "p",
          text: "React decides whether state changed with `Object.is(oldValue, newValue)`. If you mutate an object and call `setCart(cart)`, it's the **same reference** — React sees no change and may skip the re-render. Worse, past snapshots (used by other renders) are silently altered. So treat state as **read-only**: build a new object or array with the change.",
        },
        {
          type: "run",
          title: "Immutable update patterns",
          code: `const client = { name: "Garage Tremblay", address: { city: "Laval", postal: "H7N 1A1" }, tags: ["auto"] };

// ❌ Mutation: same reference, React can't tell anything changed
const mutated = client;
mutated.name = "Garage Tremblay inc.";
console.log("mutation, same ref?", Object.is(client, mutated)); // true → no re-render

// ✅ Objects: spread then override
const renamed = { ...client, name: "Garage Tremblay & Fils" };
console.log("spread, same ref?", Object.is(client, renamed));    // false → re-render

// ✅ Nested: copy every level you change
const moved = { ...client, address: { ...client.address, city: "Montréal" } };
console.log(moved.address.city, "| original still:", client.address.city);

// ✅ Arrays
const leads = [
  { id: 1, name: "Clinique Laval", status: "new" },
  { id: 2, name: "Resto Le Phare", status: "new" },
  { id: 3, name: "Plomberie Roy", status: "won" },
];
const added    = [...leads, { id: 4, name: "Café Nord", status: "new" }];
const removed  = leads.filter((l) => l.id !== 2);
const updated  = leads.map((l) => (l.id === 1 ? { ...l, status: "contacted" } : l));
const inserted = [...leads.slice(0, 1), { id: 5, name: "Vélo Plus", status: "new" }, ...leads.slice(1)];
const sorted   = leads.toSorted((a, b) => a.name.localeCompare(b.name)); // ES2023, non-mutating

console.log(added.length, removed.map((l) => l.id), updated[0].status, inserted[1].name, sorted[0].name);
console.log("original untouched:", leads.map((l) => l.status).join(","));
// Unchanged items keep their reference → cheap, and memoized children can skip work
console.log("updated[2] === leads[2]?", updated[2] === leads[2]);`,
        },
        {
          type: "table",
          rows: [
            ["Goal", "Avoid (mutates)", "Prefer (returns new)"],
            ["Add", "`push`, `unshift`", "`[...arr, item]`, `[item, ...arr]`"],
            ["Remove", "`splice`, `pop`, `shift`", "`filter`"],
            ["Replace / update", "`arr[i] = x`, `item.qty++`", "`map` + `{ ...item, qty: item.qty + 1 }`"],
            ["Sort / reverse", "`sort`, `reverse`", "`toSorted`, `toReversed` (or copy first: `[...arr].sort()`)"],
            ["Change one key", "`obj.key = x`", "`{ ...obj, key: x }`"],
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Same rule everywhere in your stack",
          text: "Immutable updates aren't React trivia: Redux/Zustand stores, `useReducer`, TanStack Query caches and Next.js server-cached data all rely on \"new reference = changed\". For deeply nested state, the `immer` library (`use-immer`) lets you write mutation-style code that produces immutable copies.",
        },
        {
          type: "challenge",
          title: "Immutable cart helpers",
          prompt: "A cart is an array of `{ id, name, price, qty }`. Write three pure helpers that **never mutate** their input: `addItem(cart, product)` (adds with `qty: 1`, or increments `qty` if the id is already there), `removeItem(cart, id)`, and `updateQty(cart, id, qty)` (a `qty` of 0 or less removes the item). Unchanged items should keep their original object reference.",
          lang: "ts",
          starter: `type CartItem = { id: string; name: string; price: number; qty: number };

// These "work"... but they mutate. React wouldn't see the changes.
function addItem(cart: CartItem[], product: { id: string; name: string; price: number }): CartItem[] {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  return cart;
}

function removeItem(cart: CartItem[], id: string): CartItem[] {
  const index = cart.findIndex((i) => i.id === id);
  if (index !== -1) cart.splice(index, 1);
  return cart;
}

function updateQty(cart: CartItem[], id: string, qty: number): CartItem[] {
  const item = cart.find((i) => i.id === id);
  if (item) item.qty = qty;
  return cart;
}`,
          solution: `type CartItem = { id: string; name: string; price: number; qty: number };

function addItem(cart: CartItem[], product: { id: string; name: string; price: number }): CartItem[] {
  const exists = cart.some((i) => i.id === product.id);
  if (exists) {
    return cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
  }
  return [...cart, { ...product, qty: 1 }];
}

function removeItem(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((i) => i.id !== id);
}

function updateQty(cart: CartItem[], id: string, qty: number): CartItem[] {
  if (qty <= 0) return removeItem(cart, id);
  return cart.map((i) => (i.id === id ? { ...i, qty } : i));
}`,
          tests: [
            { name: "addItem appends a new product with qty 1 without touching the original", code: `const cart = Object.freeze([]);
const next = addItem(cart, { id: "p1", name: "Café", price: 15 });
return cart.length === 0 && next.length === 1 && next[0].qty === 1 && next !== cart;` },
            { name: "addItem increments an existing item with a NEW item object", code: `const item = { id: "p1", name: "Café", price: 15, qty: 2 };
const cart = [item];
const next = addItem(cart, { id: "p1", name: "Café", price: 15 });
return next[0].qty === 3 && item.qty === 2 && next[0] !== item && next !== cart;` },
            { name: "removeItem returns a new array without the item", code: `const cart = [{ id: "a", name: "A", price: 1, qty: 1 }, { id: "b", name: "B", price: 2, qty: 1 }];
const next = removeItem(cart, "a");
return next.length === 1 && next[0].id === "b" && cart.length === 2;` },
            { name: "updateQty with 0 removes the item", code: `const cart = [{ id: "a", name: "A", price: 1, qty: 4 }];
const next = updateQty(cart, "a", 0);
return next.length === 0 && cart.length === 1 && cart[0].qty === 4;` },
            { name: "unchanged items keep their reference", code: `const a = { id: "a", name: "A", price: 1, qty: 1 };
const b = { id: "b", name: "B", price: 2, qty: 1 };
const next = updateQty([a, b], "b", 5);
return next[0] === a && next[1] !== b && next[1].qty === 5 && b.qty === 1;` },
          ],
          hint: "`map` for updating one item (spread it: `{ ...i, qty: i.qty + 1 }`, return others as-is), `filter` for removing, `[...cart, newItem]` for adding. `some` tells you whether the id already exists.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`count` is 5. A click handler runs `setCount(count + 1); setCount(count + 1);`. What's `count` on the next render?",
              options: ["5", "6", "7", "It depends on timing"],
              answer: 1,
              why: "Both calls use the snapshot `count = 5`, so both say \"replace with 6\". Use `setCount(c => c + 1)` twice to get 7.",
            },
            {
              q: "Why doesn't `items.push(newItem); setItems(items);` reliably update the screen?",
              options: [
                "`push` is too slow",
                "Arrays can't be stored in state",
                "`setItems` only accepts functions",
                "It's the same array reference, so `Object.is` says nothing changed",
              ],
              answer: 3,
              why: "React compares references. Create a new array: `setItems([...items, newItem])`.",
            },
            {
              q: "Where can you call `useState`?",
              options: [
                "At the top level of a component or custom hook, unconditionally",
                "Anywhere, including inside `if` blocks and loops",
                "Only inside `useEffect`",
              ],
              answer: 0,
              why: "React matches hook calls to their stored state by call order. Conditional hooks would shift that order between renders.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Events & forms
    // ─────────────────────────────────────────────────────────────
    {
      slug: "events-and-forms",
      title: "Events & forms",
      summary: "Handle clicks and typing, build controlled inputs, validate, and use React 19 form actions with useActionState and useFormStatus.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Interactivity in React follows one loop: the user does something → an **event handler** runs → it updates state → React re-renders with the new state. Event handlers are the one place where side effects are welcome: submitting, saving, navigating, logging.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "Event handlers",
          code: `function CampaignActions({ campaignId, onArchive }: { campaignId: string; onArchive: (id: string) => void }) {
  function handlePause(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();          // don't trigger the row's onClick
    pauseCampaign(campaignId);
  }

  return (
    <div>
      <button onClick={handlePause}>Pause</button>
      {/* Need an argument? Wrap it in an arrow function */}
      <button onClick={() => onArchive(campaignId)}>Archiver</button>
    </div>
  );
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Pass the function, don't call it",
          text: "`onClick={handleDelete}` passes the function; React calls it on click. `onClick={handleDelete()}` **calls it during render** (deleting immediately, on every render) and passes its return value. With arguments, wrap it: `onClick={() => handleDelete(id)}`.",
        },
        {
          type: "list",
          items: [
            "Naming convention: props are `onSomething` (`onArchive`), handler functions are `handleSomething` (`handlePause`).",
            "React events are **synthetic**: the same API in every browser, with `e.target`, `e.preventDefault()` and `e.stopPropagation()`.",
            "Typing: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent<HTMLFormElement>`. Inline handlers get their types inferred for free.",
          ],
        },
        { type: "h", text: "Controlled inputs" },
        {
          type: "p",
          text: "A **controlled** input gets its value from state and reports every keystroke via `onChange`. React state is the single source of truth, so you can validate as the user types, format values, or enable a button only when the form is valid.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "LeadForm.tsx (controlled)",
          code: `"use client";
import { useState } from "react";

export function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", budget: "5000" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));    // one handler for every field
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();                                 // stop the full-page reload
    sendLead(form);
  }

  const canSubmit = form.name.trim() !== "" && form.email.includes("@"); // derived, not state

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" type="email" value={form.email} onChange={handleChange} />
      <select name="budget" value={form.budget} onChange={handleChange}>
        <option value="5000">5 000 $</option>
        <option value="15000">15 000 $+</option>
      </select>
      <button disabled={!canSubmit}>Envoyer</button>
    </form>
  );
}`,
        },
        {
          type: "compare",
          left: {
            label: "Controlled",
            lang: "tsx",
            code: `const [email, setEmail] = useState("");

<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
// React state = what's on screen.
// Re-renders on each keystroke.`,
          },
          right: {
            label: "Uncontrolled",
            lang: "tsx",
            code: `<form action={subscribe}>
  <input name="email" defaultValue="" />
</form>

// The DOM keeps the value. You read it
// on submit via FormData:
// formData.get("email")`,
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: "`value` without `onChange` = frozen input",
          text: "If you pass `value` but no `onChange`, the input becomes read-only (React warns in the console). Use `defaultValue` for an uncontrolled input with an initial value. Also avoid switching between `value={undefined}` and a string — initialize with `\"\"`.",
        },
        {
          type: "p",
          text: "Validation is pure logic: a function from form values to errors. Keep it outside the component so you can test it and reuse it on the server (never trust client-side validation alone).",
        },
        {
          type: "challenge",
          title: "Validate a booking form",
          prompt: "Write `validateBooking(values, today)` returning an object of error messages (empty `{}` when valid). `values` comes straight from inputs, so everything is a string. Rules: `name` must have at least 2 characters after trimming; `email` must match `something@something.tld` (no spaces); `guests` must be a whole number from 1 to 20; `date` (`YYYY-MM-DD`) is required and cannot be before `today` (also `YYYY-MM-DD`). Only add a key for fields that fail.",
          lang: "ts",
          starter: `type BookingValues = { name: string; email: string; guests: string; date: string };
type BookingErrors = Partial<Record<keyof BookingValues, string>>;

function validateBooking(values: BookingValues, today: string): BookingErrors {
  const errors: BookingErrors = {};
  if (!values.name) errors.name = "Name is required";
  // TODO: email, guests, date
  return errors;
}`,
          solution: `type BookingValues = { name: string; email: string; guests: string; date: string };
type BookingErrors = Partial<Record<keyof BookingValues, string>>;

function validateBooking(values: BookingValues, today: string): BookingErrors {
  const errors: BookingErrors = {};
  if (values.name.trim().length < 2) errors.name = "Name must have at least 2 characters";
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.email.trim())) errors.email = "Invalid email";
  const guests = Number(values.guests);
  if (values.guests.trim() === "" || !Number.isInteger(guests) || guests < 1 || guests > 20) {
    errors.guests = "Guests must be between 1 and 20";
  }
  if (!values.date) errors.date = "Pick a date";
  // ISO dates (YYYY-MM-DD) compare correctly as strings
  else if (values.date < today) errors.date = "Date is in the past";
  return errors;
}`,
          tests: [
            { name: "valid booking returns {}", code: `const e = validateBooking({ name: "Marie Roy", email: "marie@clinique.ca", guests: "4", date: "2026-11-02" }, "2026-10-14");
return Object.keys(e).length === 0;` },
            { name: "name of 1 char (after trim) is rejected", code: `const e = validateBooking({ name: "  J ", email: "j@x.ca", guests: "2", date: "2026-11-02" }, "2026-10-14");
return typeof e.name === "string" && Object.keys(e).length === 1;` },
            { name: "rejects bad emails", code: `const bad = ["marie", "marie@", "marie@clinique", "ma rie@clinique.ca"];
return bad.every((email) => "email" in validateBooking({ name: "Marie", email, guests: "2", date: "2026-11-02" }, "2026-10-14"));` },
            { name: "guests must be a whole number from 1 to 20", code: `const check = (guests) => "guests" in validateBooking({ name: "Marie", email: "m@x.ca", guests, date: "2026-11-02" }, "2026-10-14");
return check("0") && check("21") && check("2.5") && check("") && check("abc") && !check("1") && !check("20");` },
            { name: "date is required and can't be in the past (today is OK)", code: `const v = { name: "Marie", email: "m@x.ca", guests: "2" };
return "date" in validateBooking({ ...v, date: "" }, "2026-10-14")
  && "date" in validateBooking({ ...v, date: "2026-10-13" }, "2026-10-14")
  && !("date" in validateBooking({ ...v, date: "2026-10-14" }, "2026-10-14"));` },
          ],
          hint: "For the email, a regex like `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` reads: some non-space non-@ chars, an @, more, a dot, more. For guests, `Number(\"\")` is 0 and `Number(\"abc\")` is `NaN` — `Number.isInteger` rejects `NaN` and `2.5`.",
        },
        { type: "h", text: "React 19: form actions" },
        {
          type: "p",
          text: "React 19 lets you pass a **function** to `<form action={...}>`. On submit, React calls it with the form's `FormData` — no `preventDefault`, no state per field. It runs inside a *transition*, so React tracks the pending state for you, and resets uncontrolled fields after success. Combined with Next.js **Server Actions** (functions marked `\"use server\"`), the same form posts straight to server code.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "ContactForm.tsx — useActionState + useFormStatus",
          code: `"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLead } from "./actions"; // a "use server" function in Next.js

type State = { ok: boolean; errors: Record<string, string>; message?: string };
const initialState: State = { ok: false, errors: {} };

// useFormStatus reads the status of the PARENT <form> — so it lives in a child component
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Envoi…" : "Envoyer"}</button>;
}

export function ContactForm() {
  // createLead(prevState, formData) => Promise<State>
  const [state, formAction, isPending] = useActionState(createLead, initialState);

  return (
    <form action={formAction}>
      <input name="email" type="email" />
      {state.errors.email && <p className="text-red-600">{state.errors.email}</p>}
      <textarea name="message" />
      <SubmitButton />
      {state.ok && <p>{state.message}</p>}
    </form>
  );
}`,
        },
        {
          type: "p",
          text: "The action passed to `useActionState` works like a reducer that can be async: it receives the **previous state** and the **form data**, and returns the next state. Here's that contract simulated in plain JS (a `Map` has the same `.get(name)` shape as `FormData`):",
        },
        {
          type: "run",
          title: "Simulating useActionState",
          code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// The action: (prevState, formData) => Promise<nextState>
async function createLead(prevState, formData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) {
    return { ok: false, errors: { email: "Courriel invalide" }, attempts: prevState.attempts + 1 };
  }
  await sleep(100); // pretend we insert into Supabase
  return { ok: true, errors: {}, message: "Merci! On vous rappelle sous 24 h.", attempts: prevState.attempts + 1 };
}

// A tiny stand-in for what React does on each submit
function useActionStateSim(action, initialState) {
  let state = initialState;
  let isPending = false;
  return {
    get state() { return state; },
    get isPending() { return isPending; },
    async submit(formData) {
      isPending = true;
      state = await action(state, formData);
      isPending = false;
    },
  };
}

const form = useActionStateSim(createLead, { ok: false, errors: {}, attempts: 0 });

await form.submit(new Map([["email", "marie.clinique.ca"]]));
console.log("1st submit:", JSON.stringify(form.state));

await form.submit(new Map([["email", "marie@clinique.ca"]]));
console.log("2nd submit:", JSON.stringify(form.state));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "In Next.js",
          text: "Put `createLead` in an `actions.ts` file starting with `\"use server\"`. The form then works even before JavaScript loads (progressive enhancement), and the action can write to Supabase with the server-side client, check `auth()` from Clerk, and call `revalidatePath()`. Always re-validate on the server — the client check is only for UX. You'll build this in the Next.js track.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What's wrong with `<button onClick={archive(campaign.id)}>`?",
              options: [
                "Nothing, it's the recommended syntax",
                "`archive` runs during every render instead of on click",
                "`onClick` must be lowercase",
                "Buttons can't receive arguments",
              ],
              answer: 1,
              why: "The braces evaluate the call immediately. Pass a function: `onClick={() => archive(campaign.id)}`.",
            },
            {
              q: "Where must `useFormStatus()` be called to see a form's pending state?",
              options: [
                "In the same component that renders the `<form>`",
                "In a Server Action",
                "In a component rendered inside that `<form>`",
              ],
              answer: 2,
              why: "`useFormStatus` reads the status of the nearest parent form, so it only works in a child component like a `<SubmitButton />`.",
            },
            {
              q: "What does the action passed to `useActionState(action, initialState)` receive?",
              options: [
                "`(event)`",
                "`(formData)` only",
                "`(state, setState)`",
                "`(previousState, formData)`",
              ],
              answer: 3,
              why: "It's like an async reducer: previous state in, form data in, next state out. `useActionState` returns `[state, formAction, isPending]`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. useEffect
    // ─────────────────────────────────────────────────────────────
    {
      slug: "useeffect-and-syncing",
      title: "useEffect & syncing with the outside",
      summary: "Effects synchronize a component with systems outside React — learn when to use them, when not to, cleanup, stale closures and data fetching.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Rendering must be pure. But some components need to talk to the **outside world**: start a timer, subscribe to a WebSocket, set the document title, connect a chat widget, measure the DOM. These aren't caused by a specific click — they're caused by the component *being on screen with certain values*. That's what `useEffect` is for: **synchronizing** with an external system.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `import { useEffect, useState } from "react";

function UnreadBadge({ count }: { count: number }) {
  useEffect(() => {
    // runs AFTER React has committed to the DOM
    document.title = count > 0 ? "(" + count + ") Omnigo CRM" : "Omnigo CRM";
  }, [count]); // re-run only when count changes

  return <span>{count}</span>;
}`,
        },
        {
          type: "table",
          rows: [
            ["Dependency array", "The effect runs…"],
            ["(none) `useEffect(fn)`", "After **every** render. Rarely what you want."],
            ["`[]`", "After the first render only (on mount), cleanup on unmount."],
            ["`[clientId, page]`", "After the first render and whenever `clientId` or `page` changed (compared with `Object.is`)."],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Don't lie about dependencies",
          text: "Every reactive value the effect reads (props, state, values derived from them) belongs in the array. The `react-hooks/exhaustive-deps` ESLint rule (on by default in Next.js) tells you what's missing. If adding a dependency causes problems, change the code, not the array.",
        },
        { type: "h", text: "You might not need an effect" },
        {
          type: "p",
          text: "The #1 effect mistake is using one to compute something you could compute **during render**. An effect that sets state from other state causes an extra render with stale data in between, and more code to maintain.",
        },
        {
          type: "compare",
          left: {
            label: "❌ Derived state in an effect",
            lang: "tsx",
            code: `const [invoices, setInvoices] = useState(data);
const [filter, setFilter] = useState("all");
const [visible, setVisible] = useState([]);

useEffect(() => {
  setVisible(
    invoices.filter((i) => filter === "all" || i.status === filter)
  );
}, [invoices, filter]);
// render 1: stale 'visible' → effect → render 2`,
          },
          right: {
            label: "✅ Compute during render",
            lang: "tsx",
            code: `const [invoices, setInvoices] = useState(data);
const [filter, setFilter] = useState("all");

const visible = invoices.filter(
  (i) => filter === "all" || i.status === filter
);
// Always in sync, one render, less code.
// Expensive? Wrap it in useMemo (lesson 8).`,
          },
        },
        {
          type: "list",
          items: [
            "**Transforming data for display** (filtering, sorting, totals) → compute during render.",
            "**Reacting to a user action** (submit, click \"Send invoice\") → do it in the event handler, not in an effect watching a flag.",
            "**Resetting state when a prop changes** (switching clients) → give the component a `key`: `<ClientNotes key={clientId} />` remounts it fresh.",
            "**Synchronizing with something outside React** (timers, subscriptions, browser APIs, third-party widgets) → that's an effect.",
          ],
        },
        { type: "h", text: "Cleanup" },
        {
          type: "p",
          text: "If an effect starts something, it must stop it. Return a **cleanup function**: React calls it before re-running the effect (when deps change) and when the component unmounts. In development, StrictMode deliberately runs mount → cleanup → mount once to catch missing cleanups — if your effect breaks when run twice, it was already broken.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `function LiveOrders({ shopId }: { shopId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("orders-" + shopId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" },
        (payload) => setOrders((prev) => [payload.new as Order, ...prev]))
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // unsubscribe: unmount or shopId change
    };
  }, [shopId]);

  return <OrderList orders={orders} />;
}`,
        },
        { type: "h", text: "Stale closures" },
        {
          type: "p",
          text: "Each render has its own props and state (remember: snapshots). An effect's function **closes over** the values of the render that created it. If the effect only runs once (`[]`) but reads `count`, it sees `count` from the first render forever.",
        },
        {
          type: "run",
          title: "Stale closure, step by step",
          code: `// Each "render" creates new functions that capture THAT render's count.
function render(count) {
  return {
    count,
    tick: () => console.log("  timer callback sees count =", count),
  };
}

const render1 = render(0);
// useEffect(() => { setInterval(r1.tick, 1000) }, []) — set up ONCE, with render 1's closure
const intervalCallback = render1.tick;

const render2 = render(1); // user clicked, state is now 1
const render3 = render(2); // and now 2

console.log("Screen shows:", render3.count);
intervalCallback(); // still 0! The closure is from render 1.

// Fix A: list count in the deps so the effect (and its closure) is recreated.
// Fix B: don't read count at all — use an updater: setCount(c => c + 1).
let state = 2;
const setCount = (update) => { state = typeof update === "function" ? update(state) : update; };
setCount((c) => c + 1);
console.log("With an updater, the timer works on the latest state:", state);`,
        },
        {
          type: "code",
          lang: "tsx",
          code: `useEffect(() => {
  const id = setInterval(() => {
    setSeconds((s) => s + 1);   // ✅ no stale read of 'seconds'
  }, 1000);
  return () => clearInterval(id);
}, []);`,
        },
        {
          type: "callout",
          tone: "info",
          title: "useEffectEvent (React 19.2)",
          text: "Sometimes an effect needs to *read* the latest value of something without re-running when it changes (e.g. log analytics with the current `theme` when a chat connects). `useEffectEvent` wraps such logic so it always sees fresh values but isn't a dependency.",
        },
        { type: "h", text: "Fetching data in an effect" },
        {
          type: "p",
          text: "Fetching is synchronization too: \"keep this component's data in sync with `clientId`\". The classic bug is a **race condition**: the user clicks client A then client B; A's response arrives *last* and overwrites B's. The fix: in cleanup, mark the old request as ignored (or abort it).",
        },
        {
          type: "code",
          lang: "tsx",
          code: `useEffect(() => {
  let ignore = false;
  setLoading(true);
  fetch("/api/clients/" + clientId)
    .then((res) => res.json())
    .then((data) => {
      if (!ignore) {            // only the latest request may update state
        setClient(data);
        setLoading(false);
      }
    });
  return () => { ignore = true; };
}, [clientId]);`,
        },
        {
          type: "run",
          title: "The race condition, simulated",
          code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Client A's API call is slow, client B's is fast
async function fetchClient(id) {
  await sleep(id === "A" ? 200 : 50);
  return { id, name: id === "A" ? "Garage Tremblay" : "Boulangerie Ste-Rose" };
}

async function run(withIgnoreFlag) {
  let shown = null;                 // what's on screen
  let cleanupPrevious = () => {};

  function effect(clientId) {       // what useEffect would run
    cleanupPrevious();              // React runs the previous cleanup first
    let ignore = false;
    fetchClient(clientId).then((data) => {
      if (!withIgnoreFlag || !ignore) shown = data;
    });
    cleanupPrevious = () => { ignore = true; };
  }

  effect("A");   // user selects A...
  effect("B");   // ...then quickly B
  await sleep(300);
  console.log((withIgnoreFlag ? "with ignore flag:   " : "without ignore flag:") + " selected B, screen shows " + shown.name);
}

await run(false);
await run(true);`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Next.js often removes the need for this",
          text: "In the App Router, a **Server Component** can simply `const client = await getClient(id)` (Supabase query, Shopify GraphQL call…) and render the result — no effect, no loading state, no race, no API key in the browser. For data that must be fetched on the client (live search, infinite scroll), use a library like TanStack Query or SWR, which handles caching, dedupe and races for you.",
        },
        {
          type: "challenge",
          title: "Only the latest response wins",
          prompt: "Write `latestOnly(fn)`: it returns a new async function that calls `fn(...args)` and resolves to the result **only if no newer call was started in the meantime**; otherwise it resolves to `undefined`. This is the ignore-flag pattern, packaged so a search box can't show stale results.",
          starter: `function latestOnly(fn) {
  return (...args) => fn(...args);
}`,
          solution: `function latestOnly(fn) {
  let latestCall = 0;
  return async (...args) => {
    const callId = ++latestCall;
    const result = await fn(...args);
    return callId === latestCall ? result : undefined;
  };
}`,
          tests: [
            { name: "a single call returns the result and passes the args", code: `const search = latestOnly(async (q, page) => q + ":" + page);
return (await search("garage", 2)) === "garage:2";` },
            { name: "slow first call is ignored when a newer one finishes first", code: `const api = (q) => new Promise((r) => setTimeout(() => r("results for " + q), q === "ga" ? 80 : 10));
const search = latestOnly(api);
const [first, second] = await Promise.all([search("ga"), search("garage")]);
return first === undefined && second === "results for garage";` },
            { name: "a call is stale even if it finishes first, once a newer call started", code: `const api = (q) => new Promise((r) => setTimeout(() => r(q), q === "fast" ? 10 : 60));
const search = latestOnly(api);
const p1 = search("fast");
const p2 = search("slow");
return (await p1) === undefined && (await p2) === "slow";` },
            { name: "sequential calls (awaited one after another) both return", code: `const search = latestOnly(async (q) => q.toUpperCase());
const a = await search("laval");
const b = await search("québec");
return a === "LAVAL" && b === "QUÉBEC";` },
          ],
          hint: "Keep a counter in the closure. Each call takes a ticket (`const callId = ++latest`), awaits `fn`, then checks whether its ticket is still the latest one.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You need `fullName` from `firstName` and `lastName` state. Best approach?",
              options: [
                "`const fullName = firstName + \" \" + lastName` during render",
                "A `fullName` state updated in a `useEffect`",
                "A `useEffect` with no dependency array",
              ],
              answer: 0,
              why: "Anything computable from existing props/state should be computed during render. An effect adds an extra render and can be momentarily out of sync.",
            },
            {
              q: "When does React call an effect's cleanup function?",
              options: [
                "Only when the page is closed",
                "Before the effect re-runs because a dependency changed, and when the component unmounts",
                "After every click",
                "Never in production",
              ],
              answer: 1,
              why: "Cleanup undoes the previous synchronization: before re-syncing with new values, and when the component leaves the screen.",
            },
            {
              q: "An interval set up in `useEffect(..., [])` logs `count`, which always prints 0. Why?",
              options: [
                "Intervals don't work in React",
                "`count` must be declared with `var`",
                "StrictMode resets state",
                "The callback closes over `count` from the first render, and the effect never re-runs",
              ],
              answer: 3,
              why: "That's a stale closure. Use an updater (`setCount(c => c + 1)`), include `count` in deps, or reach for `useEffectEvent` for read-only access to the latest value.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. useReducer, context & custom hooks
    // ─────────────────────────────────────────────────────────────
    {
      slug: "usereducer-context-custom-hooks",
      title: "useReducer, context & custom hooks",
      summary: "Centralize complex state logic in a reducer, share values deep in the tree with context, and package reusable logic as custom hooks.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "A booking form with five `useState`s and event handlers that each update three of them is hard to follow: the rules of \"what can change and how\" are scattered everywhere. A **reducer** gathers all of them in one pure function: `(state, action) => newState`. Event handlers no longer *set* state; they *describe what happened* (\"the user changed the email\", \"the submit failed\") by dispatching an action.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "BookingForm.tsx",
          code: `import { useReducer } from "react";

type State = { status: "editing" | "submitting" | "done" | "error"; email: string; error: string | null };

// A discriminated union: TypeScript knows which fields each action has
type Action =
  | { type: "email_changed"; value: string }
  | { type: "submitted" }
  | { type: "failed"; error: string }
  | { type: "succeeded" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "email_changed": return { ...state, email: action.value };
    case "submitted":     return { ...state, status: "submitting", error: null };
    case "failed":        return { ...state, status: "error", error: action.error };
    case "succeeded":     return { ...state, status: "done" };
  }
}

export function BookingForm() {
  const [state, dispatch] = useReducer(reducer, { status: "editing", email: "", error: null });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch({ type: "submitted" });
    try {
      await saveBooking(state.email);
      dispatch({ type: "succeeded" });
    } catch (err) {
      dispatch({ type: "failed", error: "Le serveur ne répond pas." });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={state.email} onChange={(e) => dispatch({ type: "email_changed", value: e.target.value })} />
      <button disabled={state.status === "submitting"}>Réserver</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
}`,
        },
        {
          type: "p",
          text: "Because a reducer is a plain pure function, you can run it — and test it — without React at all. Replay a list of actions and you get every intermediate state, which is exactly how tools like Redux DevTools offer \"time travel\".",
        },
        {
          type: "run",
          title: "A reducer is just a function",
          lang: "ts",
          code: `type Lead = { id: number; name: string; stage: "new" | "contacted" | "won" | "lost" };
type Action =
  | { type: "added"; lead: Lead }
  | { type: "moved"; id: number; stage: Lead["stage"] }
  | { type: "deleted"; id: number };

function leadsReducer(leads: Lead[], action: Action): Lead[] {
  switch (action.type) {
    case "added":   return [...leads, action.lead];
    case "moved":   return leads.map((l) => (l.id === action.id ? { ...l, stage: action.stage } : l));
    case "deleted": return leads.filter((l) => l.id !== action.id);
    default:        return leads;
  }
}

const actions: Action[] = [
  { type: "added", lead: { id: 1, name: "Clinique Laval", stage: "new" } },
  { type: "added", lead: { id: 2, name: "Resto Le Phare", stage: "new" } },
  { type: "moved", id: 1, stage: "contacted" },
  { type: "moved", id: 1, stage: "won" },
  { type: "deleted", id: 2 },
];

// reduce() is where the name comes from: fold actions into state
let state: Lead[] = [];
for (const action of actions) {
  state = leadsReducer(state, action);
  console.log(action.type.padEnd(8), JSON.stringify(state.map((l) => l.name + ":" + l.stage)));
}
console.log("Same as:", JSON.stringify(actions.reduce(leadsReducer, [])) === JSON.stringify(state));`,
        },
        {
          type: "challenge",
          title: "Reducer for a booking form",
          prompt: "Write `bookingReducer(state, action)`. Actions: `field_changed` (`{ field, value }`: set `fields[field]`), `guests_changed` (`{ delta }`: add to `fields.guests`, clamped between 1 and 20), `submitted` (status → `\"submitting\"`, error → `null`; **ignored** if already submitting — return the same state), `failed` (`{ error }`: status → `\"error\"`, store the message), `succeeded` (status → `\"done\"`), `reset` (back to `initialBookingState`). Unknown actions return the **same** state object. Never mutate.",
          lang: "ts",
          starter: `type BookingState = {
  status: "editing" | "submitting" | "done" | "error";
  fields: { name: string; email: string; guests: number };
  error: string | null;
};

const initialBookingState: BookingState = {
  status: "editing",
  fields: { name: "", email: "", guests: 2 },
  error: null,
};

function bookingReducer(state: BookingState, action: any): BookingState {
  switch (action.type) {
    case "reset":
      return initialBookingState;
    // TODO: field_changed, guests_changed, submitted, failed, succeeded
    default:
      return state;
  }
}`,
          solution: `type BookingState = {
  status: "editing" | "submitting" | "done" | "error";
  fields: { name: string; email: string; guests: number };
  error: string | null;
};

const initialBookingState: BookingState = {
  status: "editing",
  fields: { name: "", email: "", guests: 2 },
  error: null,
};

function bookingReducer(state: BookingState, action: any): BookingState {
  switch (action.type) {
    case "field_changed":
      return { ...state, fields: { ...state.fields, [action.field]: action.value } };
    case "guests_changed": {
      const guests = Math.min(20, Math.max(1, state.fields.guests + action.delta));
      return { ...state, fields: { ...state.fields, guests } };
    }
    case "submitted":
      if (state.status === "submitting") return state;
      return { ...state, status: "submitting", error: null };
    case "failed":
      return { ...state, status: "error", error: action.error };
    case "succeeded":
      return { ...state, status: "done" };
    case "reset":
      return initialBookingState;
    default:
      return state;
  }
}`,
          tests: [
            { name: "field_changed updates one field without mutating", code: `const s0 = structuredClone(initialBookingState);
const s1 = bookingReducer(s0, { type: "field_changed", field: "email", value: "marie@clinique.ca" });
return s1.fields.email === "marie@clinique.ca" && s0.fields.email === "" && s1 !== s0 && s1.fields !== s0.fields && s1.fields.guests === 2;` },
            { name: "guests_changed is clamped between 1 and 20", code: `const low = bookingReducer(initialBookingState, { type: "guests_changed", delta: -5 });
const high = bookingReducer(initialBookingState, { type: "guests_changed", delta: 50 });
const plus = bookingReducer(initialBookingState, { type: "guests_changed", delta: 1 });
return low.fields.guests === 1 && high.fields.guests === 20 && plus.fields.guests === 3 && initialBookingState.fields.guests === 2;` },
            { name: "submitted → failed → submitted flow", code: `let s = bookingReducer(initialBookingState, { type: "submitted" });
if (s.status !== "submitting") return false;
s = bookingReducer(s, { type: "failed", error: "Serveur indisponible" });
if (s.status !== "error" || s.error !== "Serveur indisponible") return false;
s = bookingReducer(s, { type: "submitted" });
return s.status === "submitting" && s.error === null;` },
            { name: "double submit is ignored (same state object)", code: `const s1 = bookingReducer(initialBookingState, { type: "submitted" });
return bookingReducer(s1, { type: "submitted" }) === s1;` },
            { name: "reset and unknown actions", code: `const s1 = bookingReducer(initialBookingState, { type: "succeeded" });
return s1.status === "done"
  && bookingReducer(s1, { type: "reset" }) === initialBookingState
  && bookingReducer(s1, { type: "does_not_exist" }) === s1;` },
          ],
          hint: "Nested update: `{ ...state, fields: { ...state.fields, [action.field]: action.value } }` — the computed key `[action.field]` sets whichever field is named. For clamping: `Math.min(20, Math.max(1, n))`.",
        },
        { type: "h", text: "Context: skip the prop drilling" },
        {
          type: "p",
          text: "Some values are needed by many components at many depths: the current user, the theme, the active locale, the selected workspace. Passing them through every intermediate component (\"prop drilling\") is noisy. **Context** lets a parent provide a value that any descendant can read directly.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "workspace-context.tsx",
          code: `"use client";
import { createContext, use, useState, type ReactNode } from "react";

type Workspace = { id: string; name: string; locale: "fr-CA" | "en-CA" };
type WorkspaceContextValue = { workspace: Workspace; switchTo: (w: Workspace) => void };

// 1. Create it (the default is used when there's no provider above)
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

// 2. Provide it — React 19: render the context itself, no ".Provider" needed
export function WorkspaceProvider({ initial, children }: { initial: Workspace; children: ReactNode }) {
  const [workspace, switchTo] = useState(initial);
  return <WorkspaceContext value={{ workspace, switchTo }}>{children}</WorkspaceContext>;
}

// 3. Read it through a custom hook with a helpful error
export function useWorkspace() {
  const ctx = use(WorkspaceContext);      // or useContext(WorkspaceContext)
  if (!ctx) throw new Error("useWorkspace must be used inside <WorkspaceProvider>");
  return ctx;
}

// Anywhere below, no props needed:
function InvoiceTotal({ cents }: { cents: number }) {
  const { workspace } = useWorkspace();
  return <span>{(cents / 100).toLocaleString(workspace.locale, { style: "currency", currency: "CAD" })}</span>;
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Context is not a free global store",
          text: "When a provider's `value` changes, **every** component reading that context re-renders. Keep contexts focused (theme separate from cart), avoid putting fast-changing values (mouse position, input text) in a widely-used context, and remember that a new object literal `value={{...}}` on each render counts as a change. For big shared client state, a store like Zustand is often a better fit.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "You already use context every day",
          text: "`<ClerkProvider>` + `useUser()` / `useAuth()`, `<ThemeProvider>` + `useTheme()` from `next-themes`, TanStack Query's `<QueryClientProvider>`: all are a context plus a custom hook, exactly the pattern above. In Next.js, providers are Client Components, typically wrapped around `{children}` in the root `layout.tsx`.",
        },
        { type: "h", text: "Custom hooks: reuse stateful logic" },
        {
          type: "p",
          text: "A **custom hook** is a function whose name starts with `use` and that calls other hooks. It lets you extract logic (not UI) and reuse it across components. Each component that calls it gets its **own independent state** — hooks share logic, not data.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "hooks.ts",
          code: `import { useEffect, useState } from "react";

// Returns 'value', but only after it stopped changing for 'delay' ms
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);   // a new keystroke cancels the pending update
  }, [value, delay]);
  return debounced;
}

// useState that survives a page reload
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  // localStorage doesn't exist on the server: read it after mount
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw !== null) setValue(JSON.parse(raw) as T);
  }, [key]);
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

// Usage: search Shopify products without one request per keystroke
function ProductSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [view, setView] = useLocalStorage<"grid" | "list">("product-view", "grid");
  // ...fetch with debouncedQuery (or pass it to TanStack Query)
}`,
        },
        {
          type: "run",
          title: "What useDebounce does, in plain JS",
          code: `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pendingTimer = null;
let debouncedValue = "";

// Called on every "render" with the new input value (like the effect)
function onValueChange(value, delay) {
  clearTimeout(pendingTimer);                 // the effect's cleanup
  pendingTimer = setTimeout(() => {
    debouncedValue = value;
    console.log("  → search sent for:", JSON.stringify(value));
  }, delay);
}

// Simulate fast typing, then a pause, then more typing
const keystrokes = ["c", "ca", "caf", "café"];
for (const value of keystrokes) {
  console.log("typed:", value);
  onValueChange(value, 120);
  await sleep(40);                            // faster than the delay
}
await sleep(200);                             // user pauses
onValueChange("café moulu", 120);
console.log("typed: café moulu");
await sleep(200);
console.log("Requests sent: 2 instead of 5. Final debounced value:", debouncedValue);`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rules of hooks",
          text: "Only call hooks at the top level of components or custom hooks (never in conditions, loops or after an early `return`), and always name custom hooks `useSomething` so the linter can check them. If a function doesn't call any hook, it's just a regular function — don't prefix it with `use`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Two components both call `useLocalStorage(\"view\", \"grid\")`. What do they share?",
              options: [
                "Nothing at all — they can't use the same key",
                "The same React state: updating one instantly re-renders the other",
                "The logic, but each has its own independent state (they only meet through localStorage)",
              ],
              answer: 2,
              why: "Custom hooks reuse stateful *logic*. Each call creates its own state. To share live state, lift it up or use context/a store.",
            },
            {
              q: "What should a reducer do with an action it doesn't recognize?",
              options: [
                "Return the current state unchanged (or throw, to catch typos)",
                "Return `undefined`",
                "Reset to the initial state",
                "Mutate the state to add an error flag",
              ],
              answer: 0,
              why: "Returning the same state means \"nothing changed\" so React can bail out. Some teams throw instead to catch misspelled action types early; TypeScript's discriminated unions catch most at compile time.",
            },
            {
              q: "In React 19, how do you provide a context value?",
              options: [
                "`<ThemeContext.Consumer value={theme}>`",
                "`provide(ThemeContext, theme)`",
                "Context values can only be set at module level",
                "`<ThemeContext value={theme}>…</ThemeContext>` (`.Provider` still works but isn't needed)",
              ],
              answer: 3,
              why: "React 19 lets you render the context object directly as the provider. Read it with `use(Ctx)` or `useContext(Ctx)`.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 8. Rendering & performance
    // ─────────────────────────────────────────────────────────────
    {
      slug: "rendering-and-performance",
      title: "Rendering & performance",
      summary: "Know exactly when components re-render, when memo/useMemo/useCallback help, what the React Compiler does, and how Suspense, lazy and use() fit in.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Performance work in React starts with an accurate model of **when** a component renders. Most \"React is slow\" problems come from rendering far more than needed, or from expensive work done on every render. Most of the time, though, React is fast enough without any tuning — measure before optimizing.",
        },
        { type: "h", text: "What triggers a re-render" },
        {
          type: "list",
          items: [
            "**Its own state changed** (a `setX` with a different value — `Object.is` decides).",
            "**Its parent re-rendered.** By default, when a component renders, *all* its children render too — whether their props changed or not.",
            "**A context it reads changed** its value.",
            "Props changing is *not* a trigger by itself: props only change because the parent rendered.",
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Re-rendering is usually cheap",
          text: "A render is a function call that produces objects. If the output is the same, React touches nothing in the DOM. Rendering 200 table rows is typically a few milliseconds. It becomes a problem when a render is expensive (heavy computation, huge lists) or happens extremely often (every keystroke re-rendering the whole page).",
        },
        { type: "h", text: "Lifting state up (and pushing it down)" },
        {
          type: "p",
          text: "When two siblings need the same data, move the state to their **closest common parent** and pass it down. The opposite move matters for performance: keep fast-changing state as **low** as possible, so typing in a search box re-renders the search box, not the whole dashboard.",
        },
        {
          type: "compare",
          left: {
            label: "Lift up: siblings share a selection",
            lang: "tsx",
            code: `function ClientsPage({ clients }: { clients: Client[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-2">
      <ClientList clients={clients} selectedId={selectedId} onSelect={setSelectedId} />
      <ClientDetails client={clients.find((c) => c.id === selectedId)} />
    </div>
  );
}`,
          },
          right: {
            label: "Push down: isolate fast-changing state",
            lang: "tsx",
            code: `// ❌ query state in Dashboard → every keystroke
//    re-renders Charts, Table, Sidebar...
// ✅ move it into the component that needs it:
function Dashboard() {
  return (
    <>
      <SearchBox />        {/* owns its own query state */}
      <RevenueCharts />
      <InvoiceTable />
    </>
  );
}`,
          },
        },
        { type: "h", text: "memo, useMemo, useCallback" },
        {
          type: "p",
          text: "Three tools, one idea: **skip work when inputs haven't changed**, judged by reference equality (`Object.is`).",
        },
        {
          type: "code",
          lang: "tsx",
          code: `import { memo, useCallback, useMemo, useState } from "react";

// memo: skip re-rendering this component if its props are shallowly equal
const InvoiceTable = memo(function InvoiceTable({ rows, onOpen }: Props) {
  return /* hundreds of rows */;
});

function InvoicesPage({ invoices }: { invoices: Invoice[] }) {
  const [status, setStatus] = useState("all");
  const [note, setNote] = useState("");

  // useMemo: cache a computed VALUE between renders
  const rows = useMemo(
    () => invoices.filter((i) => status === "all" || i.status === status)
                  .toSorted((a, b) => b.total - a.total),
    [invoices, status],   // recompute only when these change
  );

  // useCallback: cache a FUNCTION so its reference stays stable
  const handleOpen = useCallback((id: string) => router.push("/invoices/" + id), []);

  // Typing in the note re-renders InvoicesPage, but rows & handleOpen keep
  // their references, so memo(InvoiceTable) skips its render entirely.
  return (
    <>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      <InvoiceTable rows={rows} onOpen={handleOpen} />
    </>
  );
}`,
        },
        {
          type: "p",
          text: "Why do you need all three together? Because inline objects, arrays and functions are **new on every render**. `memo` compares props with `Object.is`; a fresh `onOpen={() => ...}` is never equal to the previous one, so `memo` alone would be useless.",
        },
        {
          type: "run",
          title: "Why memo needs stable references",
          code: `function shallowEqual(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => Object.hasOwn(b, k) && Object.is(a[k], b[k]));
}

// A toy memo(): only calls the component if props changed shallowly
function memo(component) {
  let lastProps = null;
  let lastOutput = null;
  let renders = 0;
  const wrapped = (props) => {
    if (lastProps && shallowEqual(lastProps, props)) return lastOutput;
    renders++;
    lastProps = props;
    lastOutput = component(props);
    return lastOutput;
  };
  wrapped.renders = () => renders;
  return wrapped;
}

const InvoiceTable = memo((props) => props.rows.length + " rows");

// Parent renders 5 times (e.g. the user types in a note field)
const rows = [{ id: 1 }, { id: 2 }];          // stable (like useMemo)
const handleOpen = (id) => id;                 // stable (like useCallback)
for (let i = 0; i < 5; i++) {
  InvoiceTable({ rows, onOpen: handleOpen });
}
console.log("Stable props   → table rendered", InvoiceTable.renders(), "time(s)");

const InvoiceTable2 = memo((props) => props.rows.length + " rows");
for (let i = 0; i < 5; i++) {
  InvoiceTable2({ rows: [{ id: 1 }, { id: 2 }], onOpen: (id) => id }); // new each render
}
console.log("Inline props   → table rendered", InvoiceTable2.renders(), "time(s)");
console.log("[] === []?", [] === [], "| (() => {}) === (() => {})?", (() => {}) === (() => {}));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "The React Compiler does this for you",
          text: "The **React Compiler** (stable since v1.0, October 2025) analyzes your components at build time and inserts the equivalent of `memo`/`useMemo`/`useCallback` automatically, more precisely than humans do. In Next.js 16 enable it with `reactCompiler: true` in `next.config.ts` (it needs `babel-plugin-react-compiler`). With it on, write plain code and reserve manual memoization for rare, measured cases. It relies on your components following the rules (pure renders, no mutation) — another reason to follow them.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Don't memoize everything by reflex",
          text: "Memoization has a cost (memory, comparisons, code noise) and silently breaks if one dependency is unstable. Reach for it when the React DevTools Profiler shows a slow component, or when a value feeds an effect's dependencies and must stay stable.",
        },
        {
          type: "challenge",
          title: "Build a one-slot cache (like useMemo)",
          prompt: "Write `memoOne(fn)` that returns a function with the same arguments. It remembers **only the last call**: if called again with the same number of arguments and every argument is `Object.is`-equal to the previous one, return the cached result without calling `fn`; otherwise call `fn`, store args and result, and return it. That's essentially how `useMemo` compares its dependency array.",
          starter: `function memoOne(fn) {
  return (...args) => fn(...args);
}`,
          solution: `function memoOne(fn) {
  let lastArgs = null;
  let lastResult;
  return (...args) => {
    const same =
      lastArgs !== null &&
      lastArgs.length === args.length &&
      args.every((arg, i) => Object.is(arg, lastArgs[i]));
    if (same) return lastResult;
    lastResult = fn(...args);
    lastArgs = args;
    return lastResult;
  };
}`,
          tests: [
            { name: "same primitive args → computed once", code: `let calls = 0;
const total = memoOne((a, b) => { calls++; return a + b; });
total(10, 5); total(10, 5); const r = total(10, 5);
return r === 15 && calls === 1;` },
            { name: "different args → recomputed", code: `let calls = 0;
const tax = memoOne((amount) => { calls++; return Math.round(amount * 14.975) / 100; });
tax(100); tax(200);
return calls === 2 && tax(200) === 29.95 && calls === 2;` },
            { name: "a NEW object with the same content counts as a change", code: `let calls = 0;
const count = memoOne((list) => { calls++; return list.length; });
const rows = [1, 2, 3];
count(rows); count(rows); count([1, 2, 3]);
return calls === 2;` },
            { name: "only remembers the LAST call (a, b, a → 3 computes)", code: `let calls = 0;
const up = memoOne((s) => { calls++; return s.toUpperCase(); });
up("laval"); up("québec"); up("laval");
return calls === 3;` },
            { name: "uses Object.is: NaN equals NaN, and arg count matters", code: `let calls = 0;
const f = memoOne((...xs) => { calls++; return xs.length; });
f(NaN); f(NaN);
if (calls !== 1) return false;
f(NaN, undefined);
return calls === 2;` },
          ],
          hint: "Keep `lastArgs` and `lastResult` in the closure. Compare lengths first, then `args.every((arg, i) => Object.is(arg, lastArgs[i]))`.",
        },
        { type: "h", text: "Suspense, lazy and use()" },
        {
          type: "p",
          text: "`<Suspense>` lets a part of the tree say \"I'm not ready yet\" and shows a **fallback** in the meantime, while the rest of the page stays interactive. Things that can suspend: code that isn't loaded yet (`lazy`), and data read with `use(promise)` or fetched in async Server Components.",
        },
        {
          type: "code",
          lang: "tsx",
          code: `import { lazy, Suspense, use } from "react";

// 1. Code splitting: the chart library is only downloaded when this renders
const RevenueChart = lazy(() => import("./RevenueChart"));

// 2. Reading a promise: use() suspends until it resolves (errors go to the nearest error boundary)
function CampaignStats({ statsPromise }: { statsPromise: Promise<Stats> }) {
  const stats = use(statsPromise);
  return <p>{stats.clicks} clics · CPC {stats.cpc.toFixed(2)} $</p>;
}

export function Dashboard({ statsPromise }: { statsPromise: Promise<Stats> }) {
  return (
    <>
      <h1>Tableau de bord</h1>
      <Suspense fallback={<p>Chargement des stats…</p>}>
        <CampaignStats statsPromise={statsPromise} />
      </Suspense>
      <Suspense fallback={<div className="h-64 animate-pulse bg-gray-100" />}>
        <RevenueChart />
      </Suspense>
    </>
  );
}`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Don't create the promise during render",
          text: "`use(fetch(...))` inside a Client Component creates a **new** promise on every render, so it suspends forever. The promise must be created once and passed in — typically by a Server Component (`const statsPromise = getStats()` without `await`, passed as a prop) or cached by a library. In Next.js, `loading.tsx` is an automatic Suspense boundary around a route, and `next/dynamic` is the Next flavour of `lazy`.",
        },
        { type: "h", text: "Measure with React DevTools" },
        {
          type: "steps",
          items: [
            { title: "Install", text: "Add the React Developer Tools browser extension (Chrome, Firefox, Edge). It adds **Components** and **Profiler** tabs to DevTools." },
            { title: "Inspect", text: "The **Components** tab shows the tree, each component's props, state and hooks, and lets you edit them live. Components optimized by the React Compiler show a \"Memo ✨\" badge." },
            { title: "Highlight", text: "In settings, enable **Highlight updates when components render**: every render flashes on screen. Type in a field and see how much of the page lights up." },
            { title: "Profile", text: "In the **Profiler** tab, record an interaction. The flame graph shows which components rendered, how long each took, and *why* it rendered (enable \"Record why each component rendered\")." },
            { title: "Fix the biggest bar", text: "Push state down, split a component, memoize the one expensive computation, or virtualize a 5 000-row list. Then profile again to confirm." },
          ],
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A parent re-renders. Its child receives exactly the same props and isn't wrapped in `memo` (no React Compiler). What happens?",
              options: [
                "The child is skipped automatically",
                "The child re-renders too",
                "React throws a warning",
              ],
              answer: 1,
              why: "By default, rendering a component renders all its children. `memo` (or the React Compiler) is what enables skipping when props are shallowly equal.",
            },
            {
              q: "`<Row onClick={() => open(id)} />` with `Row = memo(...)`. Does memo prevent re-renders?",
              options: [
                "Yes, always",
                "Only in production",
                "Only if `id` is a number",
                "No: the inline arrow is a new function every render, so props are never equal",
              ],
              answer: 3,
              why: "Shallow comparison uses `Object.is`; a new function is a new reference. Stabilize it with `useCallback`, or let the React Compiler handle it.",
            },
            {
              q: "Typing in a search box makes the whole dashboard sluggish. What's the first thing to try?",
              options: [
                "Move the search state down into the search component so only it re-renders",
                "Wrap every component in `memo`",
                "Replace `useState` with a global variable",
                "Use `useEffect` to update the input",
              ],
              answer: 0,
              why: "Colocating fast-changing state limits how much of the tree re-renders on each keystroke. It's free, and often removes the need for memoization.",
            },
            {
              q: "What does `<Suspense fallback={...}>` do?",
              options: [
                "Catches JavaScript errors in its children",
                "Delays rendering by a fixed time",
                "Shows the fallback while something inside (lazy code, `use(promise)`, async data) isn't ready",
              ],
              answer: 2,
              why: "Suspense handles *waiting*. Errors are handled by error boundaries (`error.tsx` in Next.js).",
            },
          ],
        },
      ],
    },
  ],
};
