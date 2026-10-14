import type { Track } from "../types";

export const track: Track = {
  slug: "javascript-browser",
  order: 5,
  title: "JavaScript in the Browser",
  tagline: "The DOM, events, forms, fetch and performance — by hand",
  outcome:
    "Manipulate the DOM, handle events and forms, talk to APIs with fetch, keep state in the URL, storage and cookies, and reason about rendering performance — so you know exactly what React and Next.js automate for you.",
  badge: "DOM",
  color: "#e34c26",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. THE DOM
    // ─────────────────────────────────────────────────────────────
    {
      slug: "the-dom",
      title: "The DOM: the page as a tree",
      summary: "The browser turns HTML into a tree of objects. JavaScript reads and changes that tree, and the screen follows.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "When the browser downloads an HTML file, it does not keep it as text. It **parses** it into a tree of objects called the **DOM** (Document Object Model). Every tag becomes an *element node*, every piece of text becomes a *text node*, and every node knows its parent and children. The screen you see is drawn from this tree — so when JavaScript changes the tree, the page changes.",
        },
        {
          type: "code",
          lang: "html",
          title: "leads.html",
          code: `<body>
  <h1>New leads</h1>
  <ul id="leads">
    <li class="lead hot" data-id="1">Boulangerie Ste-Rose</li>
    <li class="lead" data-id="2">Garage Laval</li>
  </ul>
  <button id="add">Add lead</button>
</body>`,
        },
        {
          type: "code",
          lang: "text",
          title: "the tree the browser builds",
          code: `document
└── html
    ├── head
    └── body
        ├── h1 ── "New leads"
        ├── ul#leads
        │   ├── li.lead.hot[data-id=1] ── "Boulangerie Ste-Rose"
        │   └── li.lead[data-id=2]     ── "Garage Laval"
        └── button#add ── "Add lead"`,
        },
        {
          type: "callout",
          tone: "info",
          title: "The DOM is not your HTML file",
          text: "The DOM is a *live* object model. If JavaScript adds an element, it exists in the DOM but not in the HTML you shipped. That is why \"View source\" and the DevTools **Elements** panel can show different things: source is the original text, Elements is the current tree.",
        },
        { type: "h", text: "Selecting elements" },
        {
          type: "p",
          text: "Before you can change something, you need a reference to it. The modern way is `querySelector` (first match) and `querySelectorAll` (all matches), which take the **same selectors you write in CSS**.",
        },
        {
          type: "code",
          lang: "js",
          title: "selecting",
          code: `const list = document.querySelector("#leads");          // first match or null
const hotLeads = document.querySelectorAll(".lead.hot"); // static NodeList
const firstLead = list.querySelector("li");             // search inside an element

hotLeads.forEach((li) => console.log(li.textContent));
const asArray = [...hotLeads];                           // to use map/filter

// Walk up the tree: nearest ancestor (or itself) matching a selector
const card = firstLead.closest("ul");

// Older but still fine
document.getElementById("add");`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "null is the classic crash",
          text: "`querySelector` returns `null` when nothing matches. `document.querySelector(\"#leds\").textContent` throws *Cannot read properties of null*. A typo in a selector, or running your script before the element exists, are the two usual causes.",
        },
        { type: "h", text: "Reading and changing content, attributes and classes" },
        {
          type: "code",
          lang: "js",
          title: "changing things",
          code: `const lead = document.querySelector('[data-id="2"]');

// Text
lead.textContent;                    // "Garage Laval"
lead.textContent = "Garage Laval inc."; // safe: always treated as text

// Attributes
lead.getAttribute("data-id");        // "2"
lead.setAttribute("title", "Called on Monday");
lead.dataset.id;                     // "2"  (data-* attributes)
lead.dataset.status = "contacted";   // adds data-status="contacted"

// Classes
lead.classList.add("hot");
lead.classList.remove("hot");
lead.classList.toggle("selected");   // add if missing, remove if present
lead.classList.contains("lead");     // true

// Inline style (prefer classes for anything non-trivial)
lead.style.backgroundColor = "#fff4e5";`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "innerHTML + user data = XSS",
          text: "`el.innerHTML = lead.name` parses the string as HTML. If a lead typed `<img src=x onerror=\"stealCookies()\">` in your contact form, that code now runs in your admin dashboard. Use `textContent` for text. Only use `innerHTML` with markup you control, or escape it first.",
        },
        { type: "h", text: "Creating and removing elements" },
        {
          type: "code",
          lang: "js",
          title: "creating & removing",
          code: `const list = document.querySelector("#leads");

const li = document.createElement("li");
li.className = "lead";
li.dataset.id = "3";
li.textContent = "Clinique Verdun";
list.append(li);              // add as last child (also: prepend, before, after)

list.querySelector('[data-id="1"]').remove(); // remove from the tree

// Replace all children at once
list.replaceChildren();       // empties the list

// Adding many nodes? Build them off-screen, insert once.
const fragment = document.createDocumentFragment();
for (const name of ["A", "B", "C"]) {
  const item = document.createElement("li");
  item.textContent = name;
  fragment.append(item);
}
list.append(fragment);        // one insertion instead of three`,
        },
        { type: "h", text: "Why direct DOM updates get messy" },
        {
          type: "p",
          text: "For one button, imperative DOM code is fine. For a real dashboard — leads that can be filtered, marked hot, deleted, counted in a badge, shown in two places — every change needs *you* to remember every DOM spot that depends on it. Forget one and the UI lies. That is the problem React solves.",
        },
        {
          type: "compare",
          left: {
            label: "Imperative: patch every spot by hand",
            lang: "js",
            code: `function markHot(id) {
  leads.find((l) => l.id === id).hot = true;
  // now update the DOM... everywhere
  document.querySelector(\`[data-id="\${id}"]\`)
    .classList.add("hot");
  const badge = document.querySelector("#hot-count");
  badge.textContent = String(Number(badge.textContent) + 1);
  // ...and the sidebar? the export button state?
}`,
          },
          right: {
            label: "Declarative: UI = f(state)",
            lang: "js",
            code: `function markHot(id) {
  leads = leads.map((l) =>
    l.id === id ? { ...l, hot: true } : l
  );
  render(); // describe the WHOLE UI from data again
}

// render() builds a description of the UI;
// a library compares it with the previous one
// and applies only the needed DOM changes.`,
          },
        },
        {
          type: "p",
          text: "The trick behind the declarative style: describe the UI as **plain objects** (cheap to create and compare), then turn that description into real DOM. Below, we build a tiny \"virtual DOM\" and render it to an HTML string. This is, in miniature, what JSX and React do.",
        },
        {
          type: "run",
          title: "A tiny virtual DOM",
          code: `// A "virtual" node is just a plain object describing what we want.
function h(tag, props, ...children) {
  return { tag, props: props || {}, children: children.flat() };
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function render(node) {
  if (typeof node === "string" || typeof node === "number") return escapeHtml(node);
  const attrs = Object.entries(node.props)
    .map(([key, value]) => \` \${key}="\${escapeHtml(value)}"\`)
    .join("");
  const inner = node.children.map(render).join("");
  return \`<\${node.tag}\${attrs}>\${inner}</\${node.tag}>\`;
}

// UI = f(state): a "component" is a function from data to a tree.
function LeadList(leads) {
  return h("ul", { id: "leads" },
    leads.map((lead) =>
      h("li", { "data-id": lead.id, class: lead.hot ? "lead hot" : "lead" }, lead.name)
    )
  );
}

let leads = [
  { id: 1, name: "Boulangerie Ste-Rose", hot: true },
  { id: 2, name: "Garage <Laval>", hot: false }, // note: escaped, no XSS
];

const tree = LeadList(leads);
console.log(JSON.stringify(tree, null, 2));
console.log(render(tree));

// State changed? Don't patch: describe again and re-render.
leads = [...leads, { id: 3, name: "Clinique Verdun", hot: true }];
console.log(render(LeadList(leads)));`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "This is what JSX compiles to",
          text: "`<li className=\"lead\">{lead.name}</li>` compiles to a call like `jsx(\"li\", { className: \"lead\", children: lead.name })`, which returns a plain object just like our `h()`. React DOM compares the new tree with the previous one (*reconciliation*) and calls `createElement`, `textContent =`, `classList`… only where something changed. Next.js Server Components go one step further and render the tree to HTML on the server — like our `render()`.",
        },
        {
          type: "challenge",
          title: "Write your own querySelectorAll",
          prompt: "A node is either a string (text) or `{ tag, props, children }`. Write `findByClass(node, className)` that returns **every element** whose `props.class` contains `className` as a whole class name (classes are separated by spaces). Return them in **document order**: a parent comes before its children, siblings left to right. Text nodes are never returned.",
          starter: `// node: string | { tag, props, children }
function findByClass(node, className) {
  const found = [];
  // walk the tree depth-first and collect matching elements
  return found;
}`,
          solution: `function findByClass(node, className) {
  const found = [];
  function walk(current) {
    if (typeof current === "string") return;
    const classes = (current.props?.class ?? "").split(" ").filter(Boolean);
    if (classes.includes(className)) found.push(current);
    current.children.forEach(walk);
  }
  walk(node);
  return found;
}`,
          tests: [
            {
              name: "finds a match nested deep in the tree",
              code: `const h = (tag, props, ...children) => ({ tag, props, children });
const tree = h("div", {}, h("section", {}, h("ul", {}, h("li", { class: "lead" }, "Café Saint-Denis"))));
const result = findByClass(tree, "lead");
return result.length === 1 && result[0].children[0] === "Café Saint-Denis";`,
            },
            {
              name: 'matches one class among several (class="lead hot")',
              code: `const h = (tag, props, ...children) => ({ tag, props, children });
const tree = h("ul", {}, h("li", { class: "lead hot" }, "A"), h("li", { class: "lead" }, "B"));
return findByClass(tree, "hot").length === 1 && findByClass(tree, "lead").length === 2;`,
            },
            {
              name: 'does not match partial names ("hot" must not match "hotel")',
              code: `const h = (tag, props, ...children) => ({ tag, props, children });
const tree = h("ul", {}, h("li", { class: "hotel" }, "Hôtel Le Germain"));
return findByClass(tree, "hot").length === 0;`,
            },
            {
              name: "returns results in document order (parent before its children)",
              code: `const h = (tag, props, ...children) => ({ tag, props, children });
const inner = h("span", { class: "card" }, "inner");
const second = h("p", { class: "card" }, "second");
const outer = h("div", { class: "card" }, inner);
const tree = h("main", {}, outer, second);
const r = findByClass(tree, "card");
return r.length === 3 && r[0] === outer && r[1] === inner && r[2] === second;`,
            },
            {
              name: "includes the root itself when it matches; elements without class are skipped",
              code: `const tree = { tag: "ul", props: { class: "leads" }, children: [{ tag: "li", props: {}, children: ["x"] }] };
const r = findByClass(tree, "leads");
return r.length === 1 && r[0] === tree;`,
            },
          ],
          hint: "Use a recursive inner function `walk(current)`: return early for strings, split `current.props.class` on spaces, push the node if it matches, then call `walk` on each child. Pushing *before* visiting children gives document order.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `document.querySelector(\".lead\")` return when no element has the class `lead`?",
              options: ["An empty NodeList", "`undefined`", "`null`", "It throws an error"],
              answer: 2,
              why: "`querySelector` returns `null` on no match (`querySelectorAll` returns an empty NodeList). Accessing a property on that `null` is what throws.",
            },
            {
              q: "You need to display a client's company name that came from a public form. Which is safe?",
              options: ["`el.textContent = name`", "`el.innerHTML = name`", "`el.outerHTML = name`", "They are all equally safe"],
              answer: 0,
              why: "`textContent` never parses HTML, so `<script>` or `onerror=` in the name is shown as text. The HTML setters would execute attacker-controlled markup (XSS).",
            },
            {
              q: "What problem does a declarative \"UI = f(state)\" approach (like React) mainly solve?",
              options: [
                "It makes the browser parse HTML faster",
                "You no longer have to track and patch every DOM spot that depends on a piece of data",
                "It removes the need for the DOM entirely",
                "It prevents all security issues",
              ],
              answer: 1,
              why: "You describe the whole UI from data; the library figures out the minimal DOM updates. The DOM is still there — React just manipulates it for you.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. EVENTS
    // ─────────────────────────────────────────────────────────────
    {
      slug: "events",
      title: "Events: reacting to the user",
      summary: "addEventListener, the event object, bubbling and capturing, preventDefault and event delegation.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Browser code is **event-driven**: your script runs once at load, registers functions, then *waits*. When something happens — a click, a key press, a form submit, a scroll, a response arriving — the browser calls the functions you registered. Understanding exactly *who* gets called and *in what order* explains a lot of \"why did my click fire twice?\" bugs.",
        },
        {
          type: "code",
          lang: "js",
          title: "listening",
          code: `const button = document.querySelector("#add");

function handleClick(event) {
  console.log(event.type);          // "click"
  console.log(event.target);        // the element actually clicked
  console.log(event.currentTarget); // the element this listener is attached to
}

button.addEventListener("click", handleClick);
button.removeEventListener("click", handleClick); // must be the SAME function

// Useful options
button.addEventListener("click", handleClick, { once: true });     // auto-removed after 1 call
window.addEventListener("scroll", onScroll, { passive: true });    // promise not to preventDefault

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) openSearch();
});`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "You can't remove an anonymous listener",
          text: "`el.removeEventListener(\"click\", () => save())` does nothing: it's a *new* function, not the one you added. Keep a reference, or pass `{ signal }` from an `AbortController` and call `controller.abort()` to remove every listener registered with it at once.",
        },
        { type: "h", text: "Capturing and bubbling" },
        {
          type: "p",
          text: "A click on a button inside a list item inside a list is also a click on the list item, the list, the body… The browser handles this by sending the event along the **path** from the top of the tree down to the target and back up.",
        },
        {
          type: "steps",
          items: [
            { title: "Capture phase", text: "The event travels from `window` down to the target's parent. Only listeners registered with `{ capture: true }` run here." },
            { title: "Target phase", text: "The event reaches the element that was actually clicked (`event.target`). Its listeners run." },
            { title: "Bubble phase", text: "The event travels back up from the target to `window`. Normal listeners (the default) run here. Most events bubble; a few like `focus` and `mouseenter` don't." },
          ],
        },
        {
          type: "p",
          text: "`event.stopPropagation()` stops the journey: nodes further along the path won't be notified. Use it sparingly — it breaks analytics scripts and delegation that rely on events reaching the top. Here is a simplified model of the dispatch algorithm you can play with:",
        },
        {
          type: "run",
          title: "Simulating propagation",
          code: `// Path from the top of the tree down to the clicked element
const path = ["window", "document", "body", "ul#leads", "li[data-id=42]", "button.delete"];

let listeners = []; // { node, handler, capture }
function on(node, handler, capture = false) {
  listeners.push({ node, handler, capture });
}

function runPhase(nodes, capture, event) {
  for (const node of nodes) {
    if (event.stopped) return; // stopPropagation: later nodes are skipped
    event.currentTarget = node;
    for (const l of listeners) {
      if (l.node === node && l.capture === capture) l.handler(event);
    }
  }
}

function dispatch(path) {
  const event = {
    target: path[path.length - 1],
    currentTarget: null,
    stopped: false,
    stopPropagation() { this.stopped = true; },
  };
  runPhase(path, true, event);               // capture: top → target
  runPhase([...path].reverse(), false, event); // bubble: target → top
}

on("document", (e) => console.log("capture  @", e.currentTarget, "target =", e.target), true);
on("button.delete", (e) => console.log("target   @", e.currentTarget));
on("li[data-id=42]", (e) => console.log("bubble   @", e.currentTarget));
on("ul#leads", (e) => console.log("bubble   @", e.currentTarget, "(delegation lives here)"));
on("body", (e) => console.log("bubble   @", e.currentTarget));

console.log("--- click #1");
dispatch(path);

console.log("--- click #2, the <li> calls stopPropagation()");
on("li[data-id=42]", (e) => e.stopPropagation());
dispatch(path);`,
        },
        { type: "h", text: "preventDefault: cancel the browser's built-in action" },
        {
          type: "p",
          text: "Some events have a **default action**: a click on a link navigates, a submit sends the form and reloads the page, a key press types a character. `event.preventDefault()` cancels that action (it does *not* stop propagation — those are two different things).",
        },
        {
          type: "code",
          lang: "js",
          code: `document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();       // no page reload; we'll send the data with fetch
  saveBooking(new FormData(e.currentTarget));
});

document.querySelector("a.open-modal").addEventListener("click", (e) => {
  e.preventDefault();       // don't navigate to href
  openModal();
});`,
        },
        { type: "h", text: "Event delegation" },
        {
          type: "p",
          text: "Because events bubble, you don't need one listener per row. Put **one** listener on a stable ancestor and look at `event.target` to see what was clicked. It uses less memory and — the real win — works for rows added *later*, which per-row listeners would miss.",
        },
        {
          type: "code",
          lang: "js",
          title: "one listener for every lead row, present and future",
          code: `document.querySelector("#leads").addEventListener("click", (e) => {
  // target might be the <svg> icon inside the button: climb to the button
  const button = e.target.closest("button[data-action]");
  if (!button) return;                       // click elsewhere in the list

  const id = button.closest("li").dataset.id;
  if (button.dataset.action === "delete") deleteLead(id);
  if (button.dataset.action === "mark-hot") markHot(id);
});`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "React uses delegation for you",
          text: "When you write `<button onClick={...}>`, React does **not** call `addEventListener` on that button. Since React 17 it registers one listener per event type on your app's root container and dispatches to your handlers itself — event delegation. Your handler gets a *SyntheticEvent* wrapping the native one; `e.preventDefault()` and `e.stopPropagation()` work as you'd expect.",
        },
        {
          type: "p",
          text: "Under the hood, the browser's `EventTarget` is a list of listeners per event type. Building one yourself is the best way to understand `addEventListener` — and the same pattern (the *emitter* or *pub/sub*) appears in Node.js, Supabase realtime channels and state libraries.",
        },
        {
          type: "challenge",
          title: "Build an event emitter",
          prompt: "Write `createEmitter()` returning an object with:\n`on(type, fn)` — registers `fn` and **returns a function that unsubscribes it**;\n`off(type, fn)` — removes `fn`;\n`once(type, fn)` — like `on`, but `fn` runs at most one time;\n`emit(type, payload)` — calls every listener for `type`, in registration order, with `payload`. Emitting a type nobody listens to must not crash.",
          starter: `function createEmitter() {
  const listeners = {}; // type -> array of functions

  return {
    on(type, fn) {
      // add fn, return a function that removes it
    },
    off(type, fn) {},
    once(type, fn) {},
    emit(type, payload) {},
  };
}`,
          solution: `function createEmitter() {
  const listeners = {}; // type -> array of functions

  const emitter = {
    on(type, fn) {
      (listeners[type] ??= []).push(fn);
      return () => emitter.off(type, fn);
    },
    off(type, fn) {
      listeners[type] = (listeners[type] ?? []).filter((f) => f !== fn);
    },
    once(type, fn) {
      const wrapper = (payload) => {
        emitter.off(type, wrapper);
        fn(payload);
      };
      return emitter.on(type, wrapper);
    },
    emit(type, payload) {
      // copy first: a once-listener removes itself while we loop
      for (const fn of [...(listeners[type] ?? [])]) fn(payload);
    },
  };
  return emitter;
}`,
          tests: [
            {
              name: "on + emit calls the listener with the payload",
              code: `const bus = createEmitter();
let got = null;
bus.on("lead:created", (lead) => { got = lead; });
bus.emit("lead:created", { id: 7, name: "Café Saint-Denis" });
return got !== null && got.id === 7;`,
            },
            {
              name: "several listeners run in the order they were added",
              code: `const bus = createEmitter();
const order = [];
bus.on("save", () => order.push("analytics"));
bus.on("save", () => order.push("toast"));
bus.emit("save");
return order.join(",") === "analytics,toast";`,
            },
            {
              name: "the function returned by on() unsubscribes, and off() works too",
              code: `const bus = createEmitter();
let a = 0, b = 0;
const stop = bus.on("tick", () => a++);
const fnB = () => b++;
bus.on("tick", fnB);
bus.emit("tick");
stop();
bus.off("tick", fnB);
bus.emit("tick");
return typeof stop === "function" && a === 1 && b === 1;`,
            },
            {
              name: "once() listeners run only one time",
              code: `const bus = createEmitter();
let count = 0, always = 0;
bus.once("paid", () => count++);
bus.on("paid", () => always++);
bus.emit("paid");
bus.emit("paid");
return count === 1 && always === 2;`,
            },
            {
              name: "emitting an event nobody listens to does nothing (no crash)",
              code: `const bus = createEmitter();
bus.emit("nobody-cares", 42);
return true;`,
            },
          ],
          hint: "Store an array per type (`listeners[type] ??= []`). `off` filters the function out. `once` registers a *wrapper* that removes itself, then calls the real `fn`. In `emit`, loop over a copy of the array so removals during the loop don't skip anyone.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A listener on `<ul id=\"leads\">` handles a click on a `<button>` inside an `<li>`. What are `event.target` and `event.currentTarget`?",
              options: [
                "target = ul, currentTarget = button",
                "Both are the button",
                "Both are the ul",
                "target = button, currentTarget = ul",
              ],
              answer: 3,
              why: "`target` is where the event started (the clicked button); `currentTarget` is the element whose listener is running (the ul). Delegation relies on reading `target`.",
            },
            {
              q: "What does `e.preventDefault()` do inside a form's submit listener?",
              options: [
                "Stops parent elements from receiving the event",
                "Cancels the browser's default action (sending the form and reloading the page)",
                "Removes the listener",
                "Clears the form fields",
              ],
              answer: 1,
              why: "preventDefault cancels the default action only. Stopping propagation is `stopPropagation()` — a separate method.",
            },
            {
              q: "Why is event delegation useful for a list of leads that grows over time?",
              options: [
                "One listener on the parent also handles rows added later, because events bubble up to it",
                "It makes events fire in the capture phase",
                "It's required for click events to work on `<li>`",
                "It prevents the default action automatically",
              ],
              answer: 0,
              why: "Rows inserted later have no listeners of their own, but their clicks still bubble to the parent's single listener.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. FORMS & VALIDATION
    // ─────────────────────────────────────────────────────────────
    {
      slug: "forms-and-validation",
      title: "Forms & validation",
      summary: "How form submission works, reading data with FormData, built-in validation, and writing your own validate(values) function.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Forms are where client sites make money: contact forms produce leads, booking forms produce appointments, checkout forms produce orders. A broken or confusing form is lost revenue. Let's see what the browser does for free, what you have to do yourself, and why validation must exist on **both** sides.",
        },
        {
          type: "code",
          lang: "html",
          title: "contact-form.html",
          code: `<form id="lead-form" action="/api/leads" method="post">
  <label>
    Name
    <input name="name" required minlength="2" autocomplete="name" />
  </label>

  <label>
    Email
    <input name="email" type="email" required autocomplete="email" />
  </label>

  <label>
    Monthly budget ($)
    <input name="budget" type="number" min="500" step="50" />
  </label>

  <fieldset>
    <legend>Services</legend>
    <label><input type="checkbox" name="services" value="seo" /> SEO</label>
    <label><input type="checkbox" name="services" value="google-ads" /> Google Ads</label>
  </fieldset>

  <label><input type="checkbox" name="consent" required /> I agree to be contacted</label>

  <button>Send</button>
</form>`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Use real labels and the right input types",
          text: "A `<label>` wrapping (or `for=`-linked to) its input makes it clickable and readable by screen readers. `type=\"email\"`, `type=\"tel\"`, `type=\"number\"` give mobile users the right keyboard. `autocomplete` lets browsers fill the form in one tap — fewer abandoned leads.",
        },
        { type: "h", text: "What happens when the user clicks Send" },
        {
          type: "steps",
          items: [
            { title: "Constraint validation", text: "The browser checks `required`, `type`, `min`, `minlength`, `pattern`… If something fails, it shows a native bubble on the first invalid field and stops. No submit event fires." },
            { title: "submit event", text: "The `submit` event fires on the `<form>`. This is your hook: listen to `submit` (not to the button's click) so the Enter key works too." },
            { title: "Default action", text: "Unless you call `preventDefault()`, the browser serialises the fields and navigates to `action` with `method` — a full page load." },
            { title: "Or: you take over", text: "With `preventDefault()` you read the fields with `FormData`, validate, send with `fetch`, and update the page yourself (spinner, success message, errors)." },
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "taking over the submit",
          code: `const form = document.querySelector("#lead-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);          // reads every named field

  const res = await fetch("/api/leads", {
    method: "POST",
    body: data,                             // sent as multipart/form-data
  });
  if (res.ok) form.reset();
});`,
        },
        { type: "h", text: "FormData: what you actually get" },
        {
          type: "p",
          text: "`FormData` collects every field that has a `name`. It has a few surprises that bite everyone once: **every value is a string**, unchecked checkboxes are **missing entirely**, and repeated names need `getAll`.",
        },
        {
          type: "run",
          title: "FormData behaviour",
          code: `// In the browser: const data = new FormData(formElement)
// Here we fill one by hand to see how it behaves.
const data = new FormData();
data.append("name", "  Julie Tremblay ");
data.append("email", "Julie@Cafe-MTL.ca");
data.append("budget", "2500");
data.append("services", "seo");
data.append("services", "google-ads");
// the "consent" checkbox was left unchecked → simply not sent

console.log(data.get("budget"), typeof data.get("budget")); // a string!
console.log(data.get("consent"));                           // null
console.log(data.get("services"));                          // only the first
console.log(data.getAll("services"));                       // all of them
console.log(Object.fromEntries(data));                      // keeps the LAST "services"

// Normalise into clean, typed values before validating
const values = {
  name: String(data.get("name") ?? "").trim(),
  email: String(data.get("email") ?? "").trim().toLowerCase(),
  budget: data.get("budget") ? Number(data.get("budget")) : null,
  services: data.getAll("services"),
  consent: data.get("consent") === "on", // a checked box without value= sends "on"
};
console.log(values);`,
        },
        { type: "h", text: "Built-in validation" },
        {
          type: "table",
          rows: [
            ["Attribute", "Checks", "Example"],
            ["`required`", "Field is not empty (checkbox is checked)", "`<input name=\"email\" required>`"],
            ["`type`", "Format of email, url, number…", "`type=\"email\"`"],
            ["`min` / `max` / `step`", "Number and date ranges", "`min=\"500\" step=\"50\"`"],
            ["`minlength` / `maxlength`", "Text length", "`minlength=\"2\"`"],
            ["`pattern`", "Regex the whole value must match", "`pattern=\"[A-Z][0-9][A-Z] ?[0-9][A-Z][0-9]\"` (postal code)"],
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "the constraint validation API",
          code: `const email = form.elements.email;

email.validity.valueMissing;   // true if required and empty
email.validity.typeMismatch;   // true if not an email
email.checkValidity();         // true/false, no UI
form.reportValidity();         // shows the native bubbles

// Custom message (empty string = valid again)
email.setCustomValidity(email.value.endsWith("@test.com") ? "Use a real address" : "");

// <form novalidate> turns the native bubbles off so you can show your own UI.
// CSS: input:user-invalid { border-color: crimson; } (only after the user interacts)`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Client-side validation is UX, not security",
          text: "Anyone can open DevTools, delete `required`, or call your API with `curl`. Validation in the browser gives fast feedback; validation on the **server** is what protects your database. Always do both — ideally with the *same* rules.",
        },
        { type: "h", text: "Writing validate(values) → errors" },
        {
          type: "p",
          text: "The cleanest pattern: a **pure function** that takes plain values and returns an object of error messages keyed by field name. Empty object = valid. Because it doesn't touch the DOM, you can run it on every keystroke, on submit, in tests, *and* on the server.",
        },
        {
          type: "challenge",
          title: "Validate a lead",
          prompt: "Write `validateLead(values)` where `values` is `{ name, email, budget, consent }`. Return an object containing **only** the fields that fail, with these exact messages:\n`name`: empty after trimming → `\"Name is required\"`.\n`email`: empty after trimming → `\"Email is required\"`; otherwise it must match `/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/` → `\"Email is invalid\"`.\n`budget`: optional (`null`, `undefined` or `\"\"` are fine); otherwise `Number(budget)` must be a number ≥ 500 → `\"Budget must be at least 500\"`.\n`consent`: must be `true` → `\"Consent is required\"`.",
          starter: `function validateLead(values) {
  const errors = {};
  if (!values.name) errors.name = "Name is required";
  // email, budget, consent...
  return errors;
}`,
          solution: `function validateLead(values) {
  const errors = {};
  const name = String(values.name ?? "").trim();
  const email = String(values.email ?? "").trim();

  if (!name) errors.name = "Name is required";

  if (!email) errors.email = "Email is required";
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) errors.email = "Email is invalid";

  const hasBudget = values.budget !== null && values.budget !== undefined && values.budget !== "";
  if (hasBudget) {
    const budget = Number(values.budget);
    if (Number.isNaN(budget) || budget < 500) errors.budget = "Budget must be at least 500";
  }

  if (values.consent !== true) errors.consent = "Consent is required";

  return errors;
}`,
          tests: [
            {
              name: "a valid lead returns {} (no errors)",
              code: `const e = validateLead({ name: "Julie", email: "julie@cafe-mtl.ca", budget: 1200, consent: true });
return Object.keys(e).length === 0;`,
            },
            {
              name: "a name made only of spaces is rejected",
              code: `const e = validateLead({ name: "   ", email: "julie@cafe-mtl.ca", budget: null, consent: true });
return e.name === "Name is required" && Object.keys(e).length === 1;`,
            },
            {
              name: "missing email and malformed email get different messages",
              code: `const base = { name: "Julie", budget: null, consent: true };
return validateLead({ ...base, email: "" }).email === "Email is required"
  && validateLead({ ...base, email: "julie@cafe" }).email === "Email is invalid"
  && validateLead({ ...base, email: "julie cafe@mtl.ca" }).email === "Email is invalid";`,
            },
            {
              name: 'budget is optional ("" and null are OK) but 300 and "abc" are rejected',
              code: `const base = { name: "Julie", email: "julie@cafe-mtl.ca", consent: true };
return !("budget" in validateLead({ ...base, budget: "" }))
  && !("budget" in validateLead({ ...base, budget: null }))
  && !("budget" in validateLead({ ...base, budget: "500" }))
  && validateLead({ ...base, budget: 300 }).budget === "Budget must be at least 500"
  && validateLead({ ...base, budget: "abc" }).budget === "Budget must be at least 500";`,
            },
            {
              name: "an empty form reports name, email and consent (but not budget)",
              code: `const e = validateLead({ name: "", email: "", budget: "", consent: false });
return Object.keys(e).sort().join(",") === "consent,email,name";`,
            },
          ],
          hint: "Trim strings first (`String(values.name ?? \"\").trim()`). For email, check emptiness *before* the regex with `if / else if`. For budget, only validate when it is present; `Number(\"abc\")` is `NaN`, so check `Number.isNaN` too. Consent must be strictly `true`.",
        },
        { type: "h", text: "Controlled data flow" },
        {
          type: "p",
          text: "Instead of reading the DOM when you need a value, keep the form's **values in a JavaScript object** and treat the inputs as a *view* of that object: input event → update state → derive errors → re-render. The state object is the single source of truth.",
        },
        {
          type: "compare",
          left: {
            label: "Vanilla JS: state → render",
            lang: "js",
            code: `const state = { values: { name: "", email: "" }, errors: {} };

form.addEventListener("input", (e) => {
  state.values[e.target.name] = e.target.value; // 1. event → state
  state.errors = validateLead(state.values);    // 2. derive
  render();                                     // 3. state → UI
});

function render() {
  for (const field of ["name", "email"]) {
    form.querySelector(\`#\${field}-error\`).textContent =
      state.errors[field] ?? "";
  }
  form.querySelector("button").disabled =
    Object.keys(state.errors).length > 0;
}`,
          },
          right: {
            label: "React: the same flow, automated",
            lang: "tsx",
            code: `function LeadForm() {
  const [values, setValues] = useState({ name: "", email: "" });
  const errors = validateLead(values); // derived, not stored

  return (
    <form>
      <input
        name="name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
      />
      <p>{errors.name}</p>
      <button disabled={Object.keys(errors).length > 0}>Send</button>
    </form>
  );
}`,
          },
        },
        {
          type: "callout",
          tone: "stack",
          title: "In Next.js, FormData goes all the way to the server",
          text: "A Next.js **Server Action** used as `<form action={createLead}>` receives the same `FormData` object you saw above — on the server. React 19's `useActionState` gives you the pending state and the returned errors. Run your `validateLead` (or a Zod schema) inside the action: that is the server-side validation that actually protects Supabase.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A form has `<input type=\"checkbox\" name=\"newsletter\">` that the user left unchecked. What does `new FormData(form).get(\"newsletter\")` return?",
              options: ["`false`", "`\"off\"`", "`\"\"`", "`null`"],
              answer: 3,
              why: "Unchecked checkboxes are not submitted at all, so the key is absent and `get` returns `null`. A checked box without `value=` sends `\"on\"`.",
            },
            {
              q: "Why listen to the form's `submit` event rather than the button's `click`?",
              options: [
                "`click` doesn't bubble",
                "`submit` also fires when the user presses Enter in a field, and only after built-in validation passes",
                "`submit` is faster",
                "Buttons can't have listeners",
              ],
              answer: 1,
              why: "Submitting can happen via Enter or a button; `submit` covers all ways, and the browser fires it only after constraint validation succeeds.",
            },
            {
              q: "Your form has `required` and `type=\"email\"`. Do you still need validation in your API route?",
              options: [
                "Yes — browser checks can be bypassed; the server must validate",
                "No — the browser guarantees the data is valid",
                "Only if you use `novalidate`",
                "Only for GET requests",
              ],
              answer: 0,
              why: "Anyone can send a request without your form (DevTools, curl, a bot). Client validation is for UX; server validation is for correctness and security.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. FETCH
    // ─────────────────────────────────────────────────────────────
    {
      slug: "fetch",
      title: "Talking to servers with fetch",
      summary: "The fetch API, JSON, checking res.ok, error handling, loading/error states, cancelling, and what CORS really is.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Modern web apps load a page once, then talk to servers in the background: load a client list, save a booking, search Shopify products. The browser's tool for that is `fetch`. Almost every library you use — the Supabase client, Clerk, Shopify's SDKs — calls `fetch` under the hood, so knowing its quirks pays off everywhere.",
        },
        {
          type: "code",
          lang: "js",
          title: "GET and POST",
          code: `// GET: read data
const res = await fetch("/api/clients?status=active");
const clients = await res.json();   // parse the body as JSON

// POST: send JSON
const created = await fetch("/api/bookings", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ clientId: 42, date: "2026-11-03", service: "photo-shoot" }),
});`,
        },
        {
          type: "steps",
          items: [
            { title: "fetch() sends the request", text: "It returns a Promise immediately; your code keeps going until you `await` it." },
            { title: "Promise resolves when headers arrive", text: "You get a `Response` with `status`, `ok`, `headers` — but the body may still be downloading." },
            { title: "You read the body", text: "`await res.json()`, `res.text()` or `res.blob()` — another Promise. The body is a stream and can be read **only once**." },
            { title: "Promise rejects only on network failure", text: "DNS error, offline, CORS block, aborted. A 404 or 500 is a *successful* fetch of an error response." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "fetch does not throw on 404 or 500",
          text: "This is the #1 fetch bug. `await fetch(url)` happily resolves with a 500 response, then `res.json()` parses the error body and your code treats it as data. Always check `res.ok` (true for status 200–299) or `res.status`.",
        },
        {
          type: "p",
          text: "Let's see it with a fake server. `Response` is a real built-in, so our fake fetch returns the same kind of object the browser gives you.",
        },
        {
          type: "run",
          title: "res.ok, status codes and network errors",
          code: `// A fake server: route → response. Real Response objects, fake network.
async function fakeFetch(url) {
  await new Promise((r) => setTimeout(r, 30)); // latency
  const json = (body, status) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

  if (url === "/api/clients") return json([{ id: 1, name: "Café Saint-Denis" }, { id: 2, name: "Garage Laval" }], 200);
  if (url === "/api/offline") throw new TypeError("Failed to fetch");
  return json({ error: "Not found" }, 404);
}

// ❌ Naive: a 404 slips through as "data"
const naive = await (await fakeFetch("/api/clients/999")).json();
console.log("naive result:", naive);

// ✅ Check the status
async function getJSON(url) {
  const res = await fakeFetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status + " on " + url);
  return res.json();
}

for (const url of ["/api/clients", "/api/clients/999", "/api/offline"]) {
  try {
    const data = await getJSON(url);
    console.log("OK", url, data);
  } catch (err) {
    console.log("FAILED", url, "→", err.name + ": " + err.message);
  }
}

// The body is a one-shot stream
const res = await fakeFetch("/api/clients");
await res.json();
try {
  await res.text();
} catch (err) {
  console.log("Reading twice:", err.message);
}`,
        },
        { type: "h", text: "Loading, error and success states" },
        {
          type: "p",
          text: "A request takes time and can fail, so the UI has (at least) four states: **idle**, **loading**, **success**, **error**. Forgetting the loading state gives double-submitted forms; forgetting the error state gives a spinner forever. Model the state explicitly:",
        },
        {
          type: "code",
          lang: "js",
          title: "explicit request state",
          code: `let state = { status: "idle", data: null, error: null };

async function loadClients() {
  state = { status: "loading", data: null, error: null };
  render();                                     // show spinner, disable button
  try {
    const data = await getJSON("/api/clients");
    state = { status: "success", data, error: null };
  } catch (err) {
    state = { status: "error", data: null, error: err.message };
  }
  render();                                     // list, or message + "Retry"
}`,
        },
        { type: "h", text: "Timeouts and cancelling" },
        {
          type: "p",
          text: "fetch has no default timeout: a hung server means a request that waits a very long time. Pass an `AbortSignal` to cancel — on a timeout, or when the user types a new search and the old results no longer matter.",
        },
        {
          type: "run",
          title: "AbortSignal.timeout",
          code: `// A slow fake endpoint that respects the abort signal, like real fetch does
function slowFetch(url, { signal } = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(new Response('"report ready"')), 500);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

try {
  // In the browser: await fetch(url, { signal: AbortSignal.timeout(5000) })
  await slowFetch("/api/reports/monthly", { signal: AbortSignal.timeout(100) });
} catch (err) {
  console.log("Gave up:", err.name); // "TimeoutError"
}

// Manual cancel: e.g. the user typed again before the last search finished
const controller = new AbortController();
const pending = slowFetch("/api/products?q=caf", { signal: controller.signal });
controller.abort();
try {
  await pending;
} catch (err) {
  console.log("Cancelled:", err.name); // "AbortError"
}`,
        },
        {
          type: "challenge",
          title: "A safe getJSON",
          prompt: "Write `async function getJSON(fetchFn, url)` that calls `fetchFn(url)` and returns the parsed JSON body **only if** the response is OK. Otherwise throw an `Error` whose message contains the status code (e.g. `\"HTTP 404\"`) and which has a `status` property equal to the status. Network errors (when `fetchFn` rejects) should simply propagate.",
          starter: `async function getJSON(fetchFn, url) {
  const res = await fetchFn(url);
  return res.json();
}`,
          solution: `async function getJSON(fetchFn, url) {
  const res = await fetchFn(url);
  if (!res.ok) {
    const error = new Error("HTTP " + res.status + " for " + url);
    error.status = res.status;
    throw error;
  }
  return res.json();
}`,
          tests: [
            {
              name: "returns the parsed JSON on a 200",
              code: `const fake = async () => new Response(JSON.stringify([{ id: 1, name: "Café Saint-Denis" }]), { status: 200 });
const data = await getJSON(fake, "/api/clients");
return Array.isArray(data) && data[0].name === "Café Saint-Denis";`,
            },
            {
              name: "throws an Error with the status in the message and .status === 404",
              code: `const fake = async () => new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
try {
  await getJSON(fake, "/api/clients/999");
  return false;
} catch (e) {
  return e instanceof Error && e.message.includes("404") && e.status === 404;
}`,
            },
            {
              name: "throws on a 500 too (any non-2xx status)",
              code: `const fake = async () => new Response("Internal error", { status: 500 });
try {
  await getJSON(fake, "/api/invoices");
  return false;
} catch (e) {
  return e.status === 500;
}`,
            },
            {
              name: "lets network errors propagate",
              code: `const fake = async () => { throw new TypeError("Failed to fetch"); };
try {
  await getJSON(fake, "/api/clients");
  return false;
} catch (e) {
  return e instanceof TypeError && e.message === "Failed to fetch";
}`,
            },
          ],
          hint: "After `await fetchFn(url)`, check `res.ok`. Build the error with `new Error(\"HTTP \" + res.status)`, then set `error.status = res.status` before `throw error`.",
        },
        { type: "h", text: "CORS, explained" },
        {
          type: "p",
          text: "The browser enforces the **same-origin policy**: JavaScript on `https://client-site.ca` may *send* requests anywhere, but may only *read* responses from the same **origin** (scheme + host + port). Otherwise any website you visit could read your Gmail using your cookies. **CORS** (Cross-Origin Resource Sharing) is how a server opts in to being read by other origins.",
        },
        {
          type: "steps",
          items: [
            { title: "Browser adds an Origin header", text: "`Origin: https://client-site.ca` is sent with the cross-origin request." },
            { title: "Preflight (sometimes)", text: "For \"non-simple\" requests — e.g. `Content-Type: application/json`, an `Authorization` header, or methods like PUT/DELETE — the browser first sends an `OPTIONS` request asking permission." },
            { title: "Server answers with CORS headers", text: "`Access-Control-Allow-Origin: https://client-site.ca` (plus `-Methods` / `-Headers` for preflights)." },
            { title: "Browser decides", text: "If the headers allow this origin, your JS gets the response. If not, fetch rejects with a vague `TypeError` and the console shows a CORS error. The request may still have reached the server!" },
          ],
        },
        {
          type: "code",
          lang: "text",
          title: "a successful preflight",
          code: `OPTIONS /v1/leads HTTP/1.1
Origin: https://client-site.ca
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://client-site.ca
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type`,
        },
        {
          type: "callout",
          tone: "info",
          title: "CORS is a browser rule, not a server firewall",
          text: "Servers, `curl` and Node scripts don't enforce CORS at all. So CORS errors are fixed **on the server you're calling** (by sending the right headers) — or by not calling that API from the browser in the first place. Cookies are only sent cross-origin with `credentials: \"include\"`, and then the server must reply with a specific origin (not `*`) and `Access-Control-Allow-Credentials: true`.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Call third-party APIs from your server",
          text: "A Shopify Admin API token or a Stripe secret key must never reach the browser. Call those APIs from a Next.js Route Handler or Server Action: it's server-to-server (no CORS), and the secret stays in Vercel/Railway environment variables. The Supabase JS client uses `fetch` too, but instead of throwing it returns `{ data, error }` — always check `error`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "`const res = await fetch(\"/api/invoices/77\")` and the server answers 404. What happens?",
              options: [
                "The await throws a TypeError",
                "The promise never resolves",
                "The promise resolves; `res.ok` is false and `res.status` is 404",
                "`res` is `null`",
              ],
              answer: 2,
              why: "fetch only rejects on network-level failures. HTTP errors are normal responses you must check with `res.ok` / `res.status`.",
            },
            {
              q: "Your browser code gets a CORS error calling `https://api.partner.com`. Where is the fix?",
              options: [
                "In `api.partner.com`'s response headers, or by calling the API from your own server instead",
                "Add `mode: \"no-cors\"` and read the JSON",
                "Wrap the fetch in try/catch",
                "Set `Access-Control-Allow-Origin` on your request",
              ],
              answer: 0,
              why: "Only the responding server can grant access via CORS headers. `no-cors` gives an opaque response you can't read. Server-to-server calls are not subject to CORS.",
            },
            {
              q: "Why can't you call `res.json()` and then `res.text()` on the same response?",
              options: [
                "`text()` only works on HTML",
                "The body is a stream that can only be consumed once",
                "JSON responses have no text",
                "You can — both work fine",
              ],
              answer: 1,
              why: "Response bodies are streams; once read, `bodyUsed` is true and reading again throws. Use `res.clone()` if you really need two reads.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. STORAGE & STATE
    // ─────────────────────────────────────────────────────────────
    {
      slug: "storage-and-url-state",
      title: "Browser storage & state",
      summary: "localStorage, sessionStorage, cookies (and why auth lives in httpOnly cookies), and using the URL as state.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Variables in your JavaScript vanish when the user reloads the page. Every piece of state needs a home, and choosing the right one decides whether a filter survives a refresh, whether a link can be shared with a colleague, and whether a session token can be stolen. Here are the options the browser gives you:",
        },
        {
          type: "table",
          rows: [
            ["Where", "Lives until", "Shared with", "Sent to server?", "Good for"],
            ["JS memory (variables, React state)", "Reload / tab close", "That page only", "No", "UI state: open modal, hover, form drafts"],
            ["URL (path + `?query`)", "Forever (it's a link)", "Anyone you send the link to", "Yes, it is the request", "Filters, search, pagination, selected tab"],
            ["`sessionStorage`", "Tab is closed", "That tab, same origin", "No", "Multi-step form progress in one tab"],
            ["`localStorage`", "Cleared by user/code", "All tabs, same origin", "No", "Preferences: theme, dismissed banners"],
            ["Cookies", "Expiry you set", "Same site (configurable)", "Yes, automatically", "Sessions / auth, server-read preferences"],
            ["Server (Postgres/Supabase)", "You delete it", "Every device of the user", "It is the server", "Anything that matters: leads, orders, settings"],
          ],
        },
        { type: "h", text: "localStorage and sessionStorage" },
        {
          type: "code",
          lang: "js",
          title: "Web Storage API",
          code: `localStorage.setItem("theme", "dark");
localStorage.getItem("theme");      // "dark"
localStorage.getItem("missing");    // null
localStorage.removeItem("theme");

// Only strings! Objects need JSON
localStorage.setItem("dashboard", JSON.stringify({ columns: ["name", "budget"] }));

function readPrefs() {
  try {
    return JSON.parse(localStorage.getItem("dashboard")) ?? { columns: [] };
  } catch {
    return { columns: [] };           // corrupted value, or storage blocked
  }
}

// Fires in OTHER tabs of the same origin when a value changes
window.addEventListener("storage", (e) => {
  if (e.key === "theme") applyTheme(e.newValue);
});`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Web Storage gotchas",
          text: "It's synchronous (big writes block the page), limited to roughly 5 MB per origin, strings only, and can throw in private modes. It also **doesn't exist on the server**: reading `localStorage` in a Next.js Server Component, or during the first render of a Client Component, crashes with *localStorage is not defined* — read it in `useEffect` or an event handler. And any script on the page (including an XSS payload) can read it, so **never store auth tokens there**.",
        },
        { type: "h", text: "Cookies, and why auth tokens live there" },
        {
          type: "p",
          text: "A cookie is a small key/value the **server** usually sets with a `Set-Cookie` header. From then on, the browser automatically attaches it to every request to that site. That automatic sending is what makes cookies perfect for sessions: the server knows who you are on every request, including the very first HTML request — before any JavaScript runs.",
        },
        {
          type: "code",
          lang: "text",
          title: "a well-configured session cookie",
          code: `Set-Cookie: session=eyJhbGciOi...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`,
        },
        {
          type: "table",
          rows: [
            ["Attribute", "What it does", "Why it matters"],
            ["`HttpOnly`", "JavaScript cannot read it (`document.cookie` won't show it)", "An XSS bug can't steal the session token"],
            ["`Secure`", "Only sent over HTTPS", "No leaking on public Wi-Fi"],
            ["`SameSite=Lax`", "Not sent on cross-site sub-requests (images, fetch, form POSTs from other sites)", "Blocks most CSRF attacks; `Lax` is the browser default"],
            ["`Max-Age` / `Expires`", "When it dies", "Without it, it's a session cookie (gone when the browser closes)"],
            ["`Path` / `Domain`", "Which URLs receive it", "Scope it as narrowly as you can"],
          ],
        },
        {
          type: "code",
          lang: "js",
          code: `// Non-HttpOnly cookies are readable (and writable) from JS — one awkward string:
document.cookie;                  // "locale=fr-CA; seen_banner=1"
document.cookie = "locale=en-CA; Path=/; Max-Age=31536000; SameSite=Lax";`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Clerk, Supabase and Next.js all use cookies",
          text: "Clerk keeps a short-lived session token in a `__session` cookie so your Next.js middleware and Server Components can call `auth()` on every request. `@supabase/ssr` stores the Supabase session in cookies for the same reason. In Next.js 15+, `cookies()` from `next/headers` is **async**: `const store = await cookies()`.",
        },
        { type: "h", text: "The URL as state" },
        {
          type: "p",
          text: "If a project manager filters the client list to \"active Shopify clients, page 2\" and sends you the link, you should see the same thing. That only works if the filters live in the **URL**. Bonus: the back button works, the page can be rendered on the server with the right data, and reloading keeps the view. `URLSearchParams` does the parsing and encoding for you.",
        },
        {
          type: "run",
          title: "Filter state in the query string",
          code: `const url = new URL("https://dashboard.example.com/clients?status=active&tag=shopify&tag=seo&page=2");
const params = url.searchParams;

console.log(params.get("status"));             // "active"
console.log(params.getAll("tag"));             // ["shopify", "seo"]
console.log(params.get("page"), typeof params.get("page")); // strings only
console.log(params.get("search"));             // null when absent
console.log(params.has("tag"));                // true

// Change the state → new URL (encoding is automatic)
params.set("page", "1");                       // replaces
params.delete("tag");
params.append("tag", "google-ads");            // adds (repeatable)
params.set("search", "café & co");
console.log(url.pathname + url.search);

// Build from an object
const qs = new URLSearchParams({ status: "lead", sort: "-createdAt" });
console.log(qs.toString());

// Leading "?" is fine when parsing
console.log(Object.fromEntries(new URLSearchParams("?status=paid&page=3")));`,
        },
        {
          type: "code",
          lang: "tsx",
          title: "the same idea in Next.js",
          code: `// Server Component page: searchParams is a Promise in Next.js 15+
export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status = "all", page = "1" } = await searchParams;
  const clients = await getClients({ status, page: Number(page) }); // server-side query
  return <ClientTable clients={clients} />;
}

// Client Component: read & update the URL
"use client";
const searchParams = useSearchParams();
const router = useRouter();
function setStatus(status: string) {
  const params = new URLSearchParams(searchParams);
  params.set("status", status);
  router.replace("?" + params.toString());
}`,
        },
        {
          type: "challenge",
          title: "Serialize filters to a query string (and back)",
          prompt: "Filters look like `{ search: string, status: string, tags: string[], page: number }` with defaults `{ search: \"\", status: \"all\", tags: [], page: 1 }`.\nWrite `toQuery(filters)` returning a query string **without** `?`, in the order `search`, `status`, one `tag` per tag, `page` — and **omitting any value equal to its default** (so default filters give `\"\"`).\nWrite `fromQuery(qs)` that accepts a string with or without a leading `?` and returns a complete filters object: missing keys get defaults, `tag` keys become the `tags` array, and `page` becomes a number (anything that isn't a positive integer → `1`).",
          starter: `const DEFAULTS = { search: "", status: "all", tags: [], page: 1 };

function toQuery(filters) {
  return new URLSearchParams(filters).toString();
}

function fromQuery(qs) {
  return { ...DEFAULTS };
}`,
          solution: `const DEFAULTS = { search: "", status: "all", tags: [], page: 1 };

function toQuery(filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status && filters.status !== DEFAULTS.status) params.set("status", filters.status);
  for (const tag of filters.tags ?? []) params.append("tag", tag);
  if (filters.page && filters.page !== DEFAULTS.page) params.set("page", String(filters.page));
  return params.toString();
}

function fromQuery(qs) {
  const params = new URLSearchParams(qs);
  const page = Number(params.get("page"));
  return {
    search: params.get("search") ?? DEFAULTS.search,
    status: params.get("status") ?? DEFAULTS.status,
    tags: params.getAll("tag"),
    page: Number.isInteger(page) && page > 0 ? page : DEFAULTS.page,
  };
}`,
          tests: [
            {
              name: 'default filters serialize to "" (nothing in the URL)',
              code: `return toQuery({ search: "", status: "all", tags: [], page: 1 }) === "";`,
            },
            {
              name: "full filters: right order, repeated tag keys, encoded accents",
              code: `const qs = toQuery({ search: "café", status: "active", tags: ["seo", "google-ads"], page: 2 });
return qs === "search=caf%C3%A9&status=active&tag=seo&tag=google-ads&page=2";`,
            },
            {
              name: "fromQuery fills defaults and turns tags into an array",
              code: `const f = fromQuery("?tag=shopify");
return f.search === "" && f.status === "all" && f.page === 1
  && Array.isArray(f.tags) && f.tags.length === 1 && f.tags[0] === "shopify";`,
            },
            {
              name: 'page is a number; "abc", "0" and "-3" fall back to 1',
              code: `return fromQuery("page=4").page === 4
  && fromQuery("page=abc").page === 1
  && fromQuery("page=0").page === 1
  && fromQuery("page=-3").page === 1;`,
            },
            {
              name: "round trip: fromQuery(toQuery(f)) gives back the same filters",
              code: `const f = { search: "boulangerie & café", status: "lead", tags: ["seo", "ads"], page: 3 };
return JSON.stringify(fromQuery(toQuery(f))) === JSON.stringify(f);`,
            },
          ],
          hint: "Build with `new URLSearchParams()` and `set` / `append` only when a value differs from its default — `append` once per tag. To parse, `new URLSearchParams(qs)` already ignores a leading `?`; use `getAll(\"tag\")` and check the page with `Number.isInteger(page) && page > 0`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Why should a session token live in an `HttpOnly` cookie rather than `localStorage`?",
              options: [
                "Cookies can hold more data",
                "localStorage is slower",
                "Cookies never expire",
                "JavaScript (including an injected XSS script) can't read an HttpOnly cookie",
              ],
              answer: 3,
              why: "Any script on the page can read localStorage. HttpOnly cookies are invisible to JS but still sent automatically to the server.",
            },
            {
              q: "Which state belongs in the URL?",
              options: [
                "Whether a dropdown menu is open",
                "The search term and filters of a client list",
                "The user's password",
                "A Shopify Admin API token",
              ],
              answer: 1,
              why: "Filters and search should survive reloads and be shareable — exactly what URLs do. Never put secrets in URLs: they end up in history, logs and analytics.",
            },
            {
              q: "`new URLSearchParams(\"?page=2\").get(\"page\")` returns…",
              options: ["`\"2\"` (a string)", "`2` (a number)", "`null` because of the `?`", "`[\"2\"]`"],
              answer: 0,
              why: "The leading `?` is ignored, and every value in a query string is a string. Convert with `Number()` and validate.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. PERFORMANCE
    // ─────────────────────────────────────────────────────────────
    {
      slug: "rendering-and-performance",
      title: "Performance & the rendering pipeline",
      summary: "How the browser turns code into pixels, what makes pages slow, debouncing and throttling, lazy loading, and Core Web Vitals.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Slow sites lose visitors: every extra second of loading costs conversions, and Google uses page experience signals (Core Web Vitals) in search ranking. For an agency, performance is a deliverable the client can measure. To fix slowness you need a mental model of what the browser does between \"bytes arrive\" and \"pixels on screen\".",
        },
        { type: "h", text: "From HTML to pixels" },
        {
          type: "steps",
          items: [
            { title: "Parse HTML → DOM", text: "The parser reads HTML top to bottom and builds the DOM tree. A classic `<script>` **pauses** parsing until it is downloaded and executed." },
            { title: "Parse CSS → CSSOM", text: "Stylesheets are **render-blocking**: the browser won't paint until the CSS in `<head>` is loaded, to avoid a flash of unstyled content." },
            { title: "Style", text: "Match every CSS rule to every element and compute final styles (the render tree; `display: none` elements are left out)." },
            { title: "Layout (reflow)", text: "Compute the size and position of every box. Changing widths, fonts or content can force the browser to redo this for much of the page." },
            { title: "Paint", text: "Fill in pixels: text, colours, borders, shadows, images — into layers." },
            { title: "Composite", text: "The GPU stacks the layers. Changing only `transform` or `opacity` can skip layout and paint and just re-composite — that's why those animate smoothly." },
          ],
        },
        {
          type: "code",
          lang: "html",
          title: "loading scripts without blocking the parser",
          code: `<head>
  <link rel="stylesheet" href="/styles.css" />          <!-- render-blocking: keep it small -->
  <link rel="preload" href="/hero.avif" as="image" />    <!-- fetch the hero image early -->

  <script src="/legacy.js"></script>                     <!-- ❌ blocks parsing -->
  <script src="/app.js" defer></script>                  <!-- ✅ runs after parsing, in order -->
  <script src="/analytics.js" async></script>            <!-- runs as soon as downloaded, any order -->
  <script type="module" src="/main.js"></script>         <!-- modules are deferred by default -->
</head>`,
        },
        { type: "h", text: "Layout thrashing" },
        {
          type: "p",
          text: "Reading a layout property (`offsetHeight`, `getBoundingClientRect()`) right after writing a style forces the browser to run layout *immediately* to give you a correct answer. Do that in a loop and you trigger dozens of layouts per frame.",
        },
        {
          type: "compare",
          left: {
            label: "❌ read, write, read, write…",
            lang: "js",
            code: `for (const card of cards) {
  const h = card.offsetHeight;        // read → forces layout
  card.style.height = h + 20 + "px";  // write → invalidates it
}
// N cards = N forced layouts`,
          },
          right: {
            label: "✅ batch reads, then writes",
            lang: "js",
            code: `const heights = cards.map((c) => c.offsetHeight); // 1 layout
cards.forEach((card, i) => {
  card.style.height = heights[i] + 20 + "px";      // writes only
});
// browser lays out once, at the next frame`,
          },
        },
        { type: "h", text: "One main thread" },
        {
          type: "p",
          text: "Your JavaScript, style, layout, paint and input handling share **one main thread**. While a function runs, nothing else happens: clicks wait, animations freeze. A task longer than 50 ms is called a *long task*. Watch a timer that asked for 0 ms wait behind a busy loop:",
        },
        {
          type: "run",
          title: "Blocking the main thread",
          code: `const start = Date.now();
setTimeout(() => {
  console.log("Timer asked for 0 ms, actually waited", Date.now() - start, "ms");
}, 0);

// Pretend we filter a huge product catalogue synchronously on every keystroke
const until = Date.now() + 300;
let iterations = 0;
while (Date.now() < until) iterations++;
console.log("Busy work finished after", Date.now() - start, "ms");

// In a browser, a click during those 300 ms would also wait → bad INP.
await new Promise((r) => setTimeout(r, 20));`,
        },
        { type: "h", text: "Debouncing and throttling" },
        {
          type: "p",
          text: "Some events fire extremely often: `input` on every keystroke, `scroll` and `resize` dozens of times per second. Running expensive work (an API search, a layout read) on each one wastes the main thread and your API quota. Two classic fixes:",
        },
        {
          type: "table",
          rows: [
            ["Technique", "Behaviour", "Use it for"],
            ["**Debounce**", "Wait until the events *stop* for N ms, then run once with the latest value", "Search-as-you-type, autosave, validating a field after the user pauses"],
            ["**Throttle**", "Run at most once every N ms while events keep coming", "Scroll position, resize, drag, infinite-scroll checks"],
          ],
        },
        {
          type: "run",
          title: "Throttling simulated scroll events",
          code: `function throttle(fn, interval) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn(...args);
    }
  };
}

let raw = 0;
let handled = 0;
const onScroll = throttle((y) => {
  handled++;
  console.log("handle scroll at y =", y);
}, 50);

// 20 scroll events, one every 10 ms (like a fast scroll)
for (let i = 1; i <= 20; i++) {
  await new Promise((r) => setTimeout(r, 10));
  raw++;
  onScroll(i * 40);
}
console.log(raw, "events fired,", handled, "handled");`,
        },
        {
          type: "challenge",
          title: "Implement debounce",
          prompt: "Write `debounce(fn, wait)` that returns a new function. Each call **restarts** a timer; `fn` only runs once `wait` ms have passed with no new call, and it receives the arguments of the **latest** call (all of them).",
          starter: `function debounce(fn, wait) {
  return (...args) => {
    fn(...args);
  };
}`,
          solution: `function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}`,
          tests: [
            {
              name: "three rapid calls → fn runs once, with the last value",
              code: `const calls = [];
const search = debounce((q) => calls.push(q), 30);
search("c"); search("ca"); search("caf");
await new Promise((r) => setTimeout(r, 80));
return calls.length === 1 && calls[0] === "caf";`,
            },
            {
              name: "does not run before the wait has passed",
              code: `const calls = [];
const save = debounce((v) => calls.push(v), 50);
save("draft");
await new Promise((r) => setTimeout(r, 10));
const tooEarly = calls.length;
await new Promise((r) => setTimeout(r, 80));
return tooEarly === 0 && calls.length === 1;`,
            },
            {
              name: "each call restarts the timer",
              code: `const calls = [];
const d = debounce((v) => calls.push(v), 50);
d(1);
await new Promise((r) => setTimeout(r, 20));
d(2);
await new Promise((r) => setTimeout(r, 20));
d(3);
await new Promise((r) => setTimeout(r, 20));
const midway = calls.length;   // ~60 ms after the first call, only 20 after the last
await new Promise((r) => setTimeout(r, 70));
return midway === 0 && calls.length === 1 && calls[0] === 3;`,
            },
            {
              name: "two bursts separated by a pause → two calls",
              code: `const calls = [];
const d = debounce((v) => calls.push(v), 20);
d("a"); d("b");
await new Promise((r) => setTimeout(r, 50));
d("c");
await new Promise((r) => setTimeout(r, 50));
return calls.join(",") === "b,c";`,
            },
            {
              name: "passes along every argument",
              code: `let got = null;
const d = debounce((...args) => { got = args; }, 10);
d("lead", 42, { hot: true });
await new Promise((r) => setTimeout(r, 40));
return got !== null && got.length === 3 && got[1] === 42 && got[2].hot === true;`,
            },
          ],
          hint: "Keep a `timer` variable in the closure. On every call: `clearTimeout(timer)`, then `timer = setTimeout(() => fn(...args), wait)`.",
        },
        { type: "h", text: "Lazy loading: don't load what nobody sees yet" },
        {
          type: "code",
          lang: "html",
          code: `<!-- Below-the-fold images and embeds: let the browser defer them -->
<img src="/portfolio/cafe.avif" alt="Café Saint-Denis website" width="800" height="600" loading="lazy" />
<iframe src="https://www.youtube.com/embed/..." loading="lazy" title="Client testimonial"></iframe>

<!-- The hero image (likely your LCP): do NOT lazy-load it, prioritise it -->
<img src="/hero.avif" alt="..." width="1600" height="900" fetchpriority="high" />`,
        },
        {
          type: "code",
          lang: "js",
          code: `// Load heavy JS only when needed (code splitting)
button.addEventListener("click", async () => {
  const { openMapPicker } = await import("./map-picker.js");
  openMapPicker();
});

// React when something scrolls into view
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) loadMoreProducts();
  }
}, { rootMargin: "200px" });   // start a bit before it is visible
observer.observe(document.querySelector("#load-more"));`,
        },
        { type: "h", text: "Core Web Vitals" },
        {
          type: "p",
          text: "Google measures three user-centric metrics from real Chrome users (the CrUX dataset) and uses them as a ranking signal. A page \"passes\" when the **75th percentile** of visits is in the good range.",
        },
        {
          type: "table",
          rows: [
            ["Metric", "Measures", "Good", "Common causes / fixes"],
            ["**LCP** — Largest Contentful Paint", "Loading: when the biggest image/text block appears", "≤ 2.5 s", "Slow server, huge hero image, render-blocking CSS/JS → optimise & preload the hero, use a CDN"],
            ["**INP** — Interaction to Next Paint", "Responsiveness: delay between a click/key and the next frame", "≤ 200 ms", "Long tasks on the main thread → split work, debounce, ship less JS"],
            ["**CLS** — Cumulative Layout Shift", "Visual stability: how much content jumps around", "≤ 0.1", "Images without `width`/`height`, late-loading fonts, ads/banners injected above content"],
          ],
        },
        {
          type: "callout",
          tone: "info",
          title: "Lab vs field data",
          text: "Lighthouse (in DevTools) is **lab** data: one simulated load on one machine — it can't measure INP, so it reports Total Blocking Time instead. PageSpeed Insights shows both Lighthouse and **field** data from real users. INP replaced FID as a Core Web Vital in March 2024.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "What Next.js and Vercel do for you",
          text: "`next/image` requires dimensions (no CLS), lazy-loads by default, serves modern formats and lets you mark the hero with `priority`. `next/font` self-hosts fonts with size-adjusted fallbacks so text doesn't jump. Server Components send HTML instead of JavaScript, which keeps INP low. Vercel Speed Insights reports real-user Core Web Vitals per route.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A search box calls your API on every keystroke. Which technique fits best?",
              options: ["Throttle at 1 call per second", "Lazy loading", "Debounce (e.g. 300 ms)", "`defer` on the script"],
              answer: 2,
              why: "Debounce waits until the user pauses typing, then sends one request with the final value. Throttling would still send requests mid-word.",
            },
            {
              q: "Images without `width` and `height` attributes mostly hurt which metric?",
              options: ["LCP", "INP", "TTFB", "CLS"],
              answer: 3,
              why: "Without dimensions, the browser reserves no space; when the image loads, content below jumps down — a layout shift.",
            },
            {
              q: "Why does animating `transform` usually perform better than animating `top`/`left`?",
              options: [
                "`transform` can be handled at the compositing step, skipping layout and paint",
                "`top` and `left` are deprecated",
                "`transform` runs in a Web Worker",
                "There is no difference",
              ],
              answer: 0,
              why: "Changing `top`/`left` changes geometry and triggers layout + paint every frame; `transform` and `opacity` can be applied by the compositor on the GPU.",
            },
            {
              q: "What does `<script src=\"/app.js\" defer>` do?",
              options: [
                "Runs the script immediately and blocks parsing",
                "Downloads in parallel and runs after the HTML is parsed, in document order",
                "Never runs the script until the user clicks",
                "Runs the script on the server",
              ],
              answer: 1,
              why: "`defer` downloads without blocking the parser and executes after parsing, preserving order. `async` executes as soon as it's downloaded, in any order.",
            },
          ],
        },
      ],
    },
  ],
};
