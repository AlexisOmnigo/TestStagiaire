import type { Track } from "../types";

export const track: Track = {
  slug: "foundations",
  order: 0,
  title: "How the Web Works",
  tagline: "The big picture before you write a line of code",
  outcome:
    "Explain what happens between typing a URL and seeing a page, read HTTP requests and responses, point a domain at a host, tell SSR from CSR, and describe how code goes from your laptop to production.",
  badge: "WEB",
  color: "#a78bfa",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. The big picture
    // ─────────────────────────────────────────────────────────────
    {
      slug: "the-big-picture",
      title: "The big picture",
      summary: "What really happens between typing a URL and seeing a page, and where every tool in your stack fits.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Before learning React, Next.js or Supabase, it helps to know **what problem each of them solves**. Every web app you will build for a client is the same story told over and over: a **client** (usually a browser) asks for something, a **server** answers, and somewhere behind the server a **database** remembers things. Every tool you use lives somewhere on that path.",
        },
        { type: "h", text: "Client and server" },
        {
          type: "p",
          text: "A **client** is the program that *asks*. Most of the time it's a browser (Chrome, Safari, Firefox) running on someone's laptop or phone, but a mobile app, a script, or another server can be a client too. A **server** is a program that *listens* for requests and *answers* them. It runs on a machine you (or Vercel, or Railway) control, usually far away in a data centre.",
        },
        {
          type: "p",
          text: "They talk using **HTTP**, a text-based protocol: the client sends a **request** (\"give me `/clients/42`\"), the server sends back a **response** (\"here's some HTML\" or \"here's some JSON\" or \"that doesn't exist\"). That's it. Everything else is detail.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Key idea",
          text: "The browser and the server are **two different computers**. They don't share variables, memory or files. The only thing that crosses the gap is the text of requests and responses. Many confusing bugs (\"why is this undefined on the server?\") come from forgetting this.",
        },
        { type: "h", text: "From URL to page: the request lifecycle" },
        {
          type: "p",
          text: "Here's what happens when a client of the agency opens `https://app.lavalpizza.ca/orders` in their browser:",
        },
        {
          type: "steps",
          items: [
            {
              title: "1. Parse the URL",
              text: "The browser splits the URL into a protocol (`https`), a host (`app.lavalpizza.ca`) and a path (`/orders`). It now knows *who* to ask and *what* to ask for.",
            },
            {
              title: "2. DNS lookup",
              text: "Computers find each other by IP address, not by name. The browser asks the **DNS** system: what IP address is `app.lavalpizza.ca`? The answer points at the hosting platform, e.g. one of Vercel's servers.",
            },
            {
              title: "3. Connect securely",
              text: "The browser opens a connection to that IP and performs a **TLS handshake** so that everything that follows is encrypted. This is the S in HTTPS.",
            },
            {
              title: "4. Send the HTTP request",
              text: "`GET /orders` plus some headers (which browser, which languages it accepts, any cookies such as your login session).",
            },
            {
              title: "5. The server does the work",
              text: "The server (your Next.js app running on Vercel) runs your code: checks who you are (Clerk), loads data (Supabase), and builds a response, often an HTML page.",
            },
            {
              title: "6. The response comes back",
              text: "A status code (`200 OK`), headers (`Content-Type: text/html`, maybe `Set-Cookie`) and a body (the HTML).",
            },
            {
              title: "7. The browser renders",
              text: "It reads the HTML, builds the page structure (the DOM), downloads the CSS, JavaScript, images and fonts it references (each one is *another* HTTP request), then paints pixels.",
            },
            {
              title: "8. JavaScript makes it interactive",
              text: "React's JavaScript runs in the browser and attaches click handlers, forms and state. From now on, clicking a button may send more requests (fetching JSON, submitting a form) without reloading the whole page.",
            },
          ],
        },
        { type: "h", text: "Frontend, backend, database" },
        {
          type: "list",
          items: [
            "**Frontend**: what runs in the user's browser. HTML for structure, CSS for looks, JavaScript for behaviour. Anyone can open DevTools and read it, so it must never contain secrets.",
            "**Backend**: code that runs on a server you control. It can hold secrets (API keys), talk to the database, check permissions, call Shopify or Stripe.",
            "**Database**: where data survives after everyone closes their browser: clients, invoices, bookings, leads. The backend reads and writes it; the browser should only reach it through rules you control.",
          ],
        },
        {
          type: "p",
          text: "Modern tools blur those lines on purpose. A Next.js project contains **both** frontend and backend code in the same repository, and sometimes in the same file. That's convenient, but you still need to know which side each line runs on.",
        },
        { type: "h", text: "Where your tools sit" },
        {
          type: "table",
          rows: [
            ["Tool", "Layer", "What it does for you"],
            ["Browser (Chrome, Safari…)", "Client", "Downloads HTML/CSS/JS, renders pages, runs your frontend JavaScript"],
            ["React", "Frontend (and server)", "Describes the UI as components; runs in the browser, and on the server for server rendering"],
            ["Tailwind CSS", "Frontend", "Utility classes compiled into a regular CSS file the browser downloads"],
            ["Next.js", "Frontend + backend framework", "Routing, server rendering, API endpoints (route handlers), server actions, the build"],
            ["Node.js", "Server runtime", "Runs JavaScript outside the browser: your Next.js server code, scripts, CLIs, `npm`"],
            ["TypeScript", "Development time", "Checks your code for type mistakes before it runs, then disappears (compiled to JS)"],
            ["Vercel", "Hosting", "Builds your Next.js app and serves it worldwide; preview URL per branch"],
            ["Railway", "Hosting", "Runs long-lived servers, workers, cron jobs and databases"],
            ["Supabase", "Database + backend services", "Postgres database, auth, file storage, auto-generated API"],
            ["Clerk", "Identity", "Sign-up, sign-in, sessions, organizations; tells your server *who* is making a request"],
            ["Shopify", "External platform", "E-commerce backend you talk to through its GraphQL Admin API"],
            ["GitHub", "Source code", "Stores your code and its history; triggers builds and deployments on push"],
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "One request, the whole stack",
          text: "A logged-in client opens their dashboard: the **browser** sends a request with Clerk's session cookie → **Vercel** routes it to your **Next.js** code running on **Node.js** → Clerk's helper reads the cookie and says \"this is user_123\" → your code asks **Supabase** for that user's invoices → **React** turns them into HTML → the browser shows it. The code itself got there because you pushed it to **GitHub** and Vercel built it.",
        },
        { type: "h", text: "Simulate a round trip" },
        {
          type: "p",
          text: "Below is a toy version of that trip in plain JavaScript. The \"network\" is just a delay, the \"database\" is a `Map`. Run it and read the order of the logs: the browser waits for the server, which waits for the database.",
        },
        {
          type: "run",
          title: "browser → server → database",
          code: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// The "database": survives between requests
const clients = new Map([
  ["42", { id: "42", name: "Boulangerie Saint-Roch", plan: "Pro" }],
]);

async function queryDatabase(id) {
  await wait(40); // a network hop + the query itself
  return clients.get(id) ?? null;
}

// The "server": receives a request, returns a response
async function server(request) {
  console.log("  [server] received", request.method, request.path);
  const id = request.path.split("/").pop();
  const client = await queryDatabase(id);
  if (!client) {
    return { status: 404, body: "<h1>Client not found</h1>" };
  }
  return { status: 200, body: "<h1>" + client.name + "</h1><p>Plan: " + client.plan + "</p>" };
}

// The "browser": turns a URL into a request, then renders the response
async function browser(url) {
  const start = Date.now();
  console.log("[browser] user typed", url);
  const { pathname } = new URL(url);
  await wait(30); // DNS + TLS handshake
  const response = await server({ method: "GET", path: pathname });
  console.log("[browser] got", response.status, "after ~" + (Date.now() - start) + "ms");
  console.log("[browser] renders:", response.body);
  console.log("");
}

await browser("https://app.omnigo.ca/clients/42");
await browser("https://app.omnigo.ca/clients/99");`,
        },
        {
          type: "challenge",
          title: "Write a tiny server",
          prompt:
            "Write `handleRequest(request, bookings)`. `request` is `{ method, path }` and `bookings` is a `Map` from id to booking object. `GET /bookings/<id>` with an existing id returns `{ status: 200, body: booking }`. An unknown id, or any other path, returns `{ status: 404, body: { error: \"Not found\" } }`. Any method other than `GET` returns `{ status: 405, body: { error: \"Method not allowed\" } }`.",
          starter: `function handleRequest(request, bookings) {
  // request looks like { method: "GET", path: "/bookings/b1" }
  return { status: 200, body: null };
}`,
          solution: `function handleRequest(request, bookings) {
  if (request.method !== "GET") {
    return { status: 405, body: { error: "Method not allowed" } };
  }
  const [, resource, id] = request.path.split("/");
  if (resource === "bookings" && bookings.has(id)) {
    return { status: 200, body: bookings.get(id) };
  }
  return { status: 404, body: { error: "Not found" } };
}`,
          tests: [
            {
              name: "GET an existing booking returns 200 and the booking",
              code: `const db = new Map([["b1", { id: "b1", client: "Spa Nordik", date: "2026-11-02" }]]);
const res = handleRequest({ method: "GET", path: "/bookings/b1" }, db);
return res.status === 200 && res.body.client === "Spa Nordik";`,
            },
            {
              name: "GET an unknown booking returns 404",
              code: `const db = new Map([["b1", { id: "b1" }]]);
const res = handleRequest({ method: "GET", path: "/bookings/nope" }, db);
return res.status === 404 && res.body.error === "Not found";`,
            },
            {
              name: "An unknown route like /invoices/b1 returns 404",
              code: `const db = new Map([["b1", { id: "b1" }]]);
return handleRequest({ method: "GET", path: "/invoices/b1" }, db).status === 404;`,
            },
            {
              name: "DELETE returns 405 Method not allowed",
              code: `const db = new Map([["b1", { id: "b1" }]]);
const res = handleRequest({ method: "DELETE", path: "/bookings/b1" }, db);
return res.status === 405 && res.body.error === "Method not allowed";`,
            },
          ],
          hint: "Check the method first. Then `\"/bookings/b1\".split(\"/\")` gives `[\"\", \"bookings\", \"b1\"]`: destructure it with `const [, resource, id] = …`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Where does it make sense to keep a secret API key (e.g. a Shopify Admin token)?",
              options: [
                "In a React component, since React is your frontend",
                "In server-side code / server environment variables",
                "In the HTML, hidden with CSS",
                "In the browser's localStorage",
              ],
              answer: 1,
              why: "Everything sent to the browser (HTML, CSS, JS, storage) can be read by the user in DevTools. Secrets only belong on the server.",
            },
            {
              q: "What is DNS for?",
              options: [
                "Encrypting the connection",
                "Rendering HTML into pixels",
                "Turning a domain name into an IP address",
                "Storing your app's data",
              ],
              answer: 2,
              why: "Computers connect by IP address. DNS is the phone book that maps `app.lavalpizza.ca` to an IP. Encryption is TLS's job.",
            },
            {
              q: "Which statement about Next.js is true?",
              options: [
                "One Next.js project contains both browser code and server code",
                "Next.js only runs in the browser",
                "Next.js is a database",
                "Next.js replaces the need for HTTP",
              ],
              answer: 0,
              why: "Next.js is a full-stack framework: some of your code is sent to the browser, some only ever runs on the server. Knowing which is which is a core skill.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. HTTP in practice
    // ─────────────────────────────────────────────────────────────
    {
      slug: "http-in-practice",
      title: "HTTP in practice",
      summary: "Requests, responses, methods, status codes, headers, JSON, cookies and why HTTP forgets you between requests.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Every interaction in a web app is an HTTP exchange: loading a page, submitting a lead form, fetching products from Shopify, a Stripe webhook hitting your server. If you can read a request and a response, you can debug almost anything, because the **Network** tab in DevTools shows you exactly these.",
        },
        { type: "h", text: "What a request and a response look like" },
        {
          type: "p",
          text: "Here is a request to create an invoice and the server's reply, written out in HTTP/1.1 text form. (HTTP/2 and HTTP/3, which browsers use today, encode this in binary for speed, but the meaning — method, path, headers, body, status — is identical.)",
        },
        {
          type: "compare",
          left: {
            label: "Request (client → server)",
            lang: "text",
            code: `POST /api/invoices HTTP/1.1
Host: app.omnigo.ca
Content-Type: application/json
Accept: application/json
Cookie: __session=eyJhbGciOi...

{"clientId":"c_42","amount":1250,"currency":"CAD"}`,
          },
          right: {
            label: "Response (server → client)",
            lang: "text",
            code: `HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/invoices/inv_901
Cache-Control: no-store

{"id":"inv_901","clientId":"c_42","amount":1250,"status":"draft"}`,
          },
        },
        {
          type: "list",
          items: [
            "**Request line**: method (`POST`), path (`/api/invoices`), protocol version.",
            "**Headers**: `Name: value` pairs of metadata. What format the body is in, what format I accept back, who I am (cookies, `Authorization`), caching rules…",
            "**Blank line**, then the optional **body**: the actual data. For APIs it's usually JSON.",
            "**Status line** in the response: a 3-digit **status code** plus a short reason (`201 Created`).",
          ],
        },
        { type: "h", text: "Methods: what do you want to do?" },
        {
          type: "table",
          rows: [
            ["Method", "Meaning", "Has a body?", "Safe?", "Idempotent?"],
            ["GET", "Read something (`GET /api/products`)", "No", "Yes", "Yes"],
            ["POST", "Create something / trigger an action (`POST /api/leads`)", "Yes", "No", "No"],
            ["PUT", "Replace a whole resource (`PUT /api/clients/42`)", "Yes", "No", "Yes"],
            ["PATCH", "Update part of a resource (`PATCH /api/clients/42`)", "Yes", "No", "Not guaranteed"],
            ["DELETE", "Remove something (`DELETE /api/bookings/7`)", "Usually not", "No", "Yes"],
          ],
        },
        {
          type: "p",
          text: "**Safe** means it shouldn't change anything on the server. **Idempotent** means doing it twice has the same effect as doing it once: deleting booking 7 twice still leaves booking 7 deleted, but POSTing the same lead twice creates two leads. That's why browsers warn before re-submitting a form, and why payment APIs ask for an *idempotency key*.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Never change data on GET",
          text: "Browsers, link previewers (Slack, iMessage) and crawlers freely send GET requests: prefetching links, generating previews. A link like `/api/invoices/9/delete` that deletes on GET *will* get triggered by accident one day. Use POST/DELETE for anything that changes data.",
        },
        { type: "h", text: "Status codes: how did it go?" },
        {
          type: "p",
          text: "The first digit tells you the category. Learn these by heart; you will see them every day.",
        },
        {
          type: "table",
          rows: [
            ["Code", "Name", "Typical situation"],
            ["200", "OK", "Page or data returned fine"],
            ["201", "Created", "Your POST created a new lead / invoice"],
            ["204", "No Content", "Success, nothing to send back (often after DELETE)"],
            ["301 / 308", "Moved Permanently", "Old URL redirects forever (`http` → `https`, old blog paths)"],
            ["302 / 307", "Found / Temporary Redirect", "Redirect for now, e.g. to `/sign-in` when logged out"],
            ["304", "Not Modified", "Your cached copy is still good, no body sent"],
            ["400", "Bad Request", "The request is malformed (invalid JSON, missing field)"],
            ["401", "Unauthorized", "Actually means *unauthenticated*: we don't know who you are"],
            ["403", "Forbidden", "We know who you are, and you're not allowed"],
            ["404", "Not Found", "No such page / record"],
            ["409", "Conflict", "Clashes with current state (that time slot is already booked)"],
            ["422", "Unprocessable Content", "Well-formed but invalid data (email has no @)"],
            ["429", "Too Many Requests", "Rate limited, e.g. by Shopify's API. Slow down and retry"],
            ["500", "Internal Server Error", "Your code threw an exception"],
            ["502 / 504", "Bad Gateway / Gateway Timeout", "A proxy couldn't get a (timely) answer from the server behind it"],
            ["503", "Service Unavailable", "Server overloaded or down for maintenance"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "4xx vs 5xx: whose fault?",
          text: "**4xx** = the client sent something wrong (fix the request). **5xx** = the server broke (go read the server logs, e.g. in Vercel's Logs tab). This one distinction cuts debugging time in half.",
        },
        { type: "h", text: "Headers worth knowing" },
        {
          type: "list",
          items: [
            "`Content-Type`: the format of *this* body. `application/json`, `text/html; charset=utf-8`, `multipart/form-data` for file uploads.",
            "`Accept`: the formats the client would like back.",
            "`Authorization`: credentials, typically `Bearer <token>` for APIs.",
            "`Cookie` (request) / `Set-Cookie` (response): small values the browser stores and sends back automatically.",
            "`Cache-Control`: how long this response may be reused by browsers and CDNs.",
            "`Location`: where to go next, used by redirects and by `201 Created`.",
          ],
        },
        { type: "h", text: "JSON bodies" },
        {
          type: "p",
          text: "HTTP only carries **text** (well, bytes). To send an object you **serialize** it to a JSON string with `JSON.stringify`, and the other side **parses** it back with `JSON.parse`. Note what doesn't survive the trip: `Date` objects become strings, `undefined` fields disappear, functions vanish.",
        },
        {
          type: "run",
          title: "serialize → send → parse",
          code: `// What the browser does when you submit a lead form via fetch
const lead = {
  name: "Garage Roy",
  email: "info@garageroy.ca",
  budget: 5000,
  submittedAt: new Date("2026-10-14T13:30:00Z"),
  notes: undefined,
};

const request = {
  method: "POST",
  url: "/api/leads",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(lead), // ← an object becomes a string
};
console.log("body on the wire:", request.body);
console.log("typeof body:", typeof request.body);

// What the server does when it receives it
const received = JSON.parse(request.body);
console.log("budget is a number again:", received.budget + 1);
console.log("submittedAt is now a", typeof received.submittedAt, "→", received.submittedAt);
console.log("notes survived?", "notes" in received);

// The server answers
const response = {
  status: 201,
  headers: { "Content-Type": "application/json", Location: "/api/leads/ld_77" },
  body: JSON.stringify({ id: "ld_77", ...received }),
};
console.log(response.status, response.headers.Location);`,
        },
        {
          type: "p",
          text: "In real code you rarely build requests by hand; you use `fetch`. This is what the browser side of that exchange looks like (read-only here, because the sandbox can't reach the network):",
        },
        {
          type: "code",
          lang: "ts",
          title: "submitting a lead with fetch",
          code: `const res = await fetch("/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Garage Roy", email: "info@garageroy.ca" }),
});

if (!res.ok) {                 // res.ok is true for 200–299 only
  throw new Error(\`Lead not saved: \${res.status}\`);
}
const saved = await res.json(); // parses the JSON body`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "fetch does not throw on 404 or 500",
          text: "`fetch` only rejects when the network itself fails (offline, DNS error). A `500` is still a *successful* HTTP exchange, so you must check `res.ok` or `res.status` yourself.",
        },
        { type: "h", text: "URLs and query strings" },
        {
          type: "p",
          text: "For GET requests, parameters travel in the **query string**: `/api/products?category=pizza&page=2`. Building these by string concatenation breaks as soon as a value contains a space, `&` or an accent. Use `URL` and `URLSearchParams`, which encode correctly. Both exist in browsers and in Node.",
        },
        {
          type: "run",
          title: "URLSearchParams",
          code: `const url = new URL("https://shop.lavalpizza.ca/api/products");
url.searchParams.set("category", "pizzas & calzones");
url.searchParams.set("city", "Montréal");
url.searchParams.set("page", 2);
console.log(url.toString());

// Reading them back on the server side
const incoming = new URL("https://shop.lavalpizza.ca/api/products?category=pizzas+%26+calzones&page=2");
console.log(incoming.searchParams.get("category")); // decoded for you
console.log(incoming.searchParams.get("page"), typeof incoming.searchParams.get("page")); // always strings!
console.log(incoming.searchParams.get("missing")); // null

// Build from an object
const params = new URLSearchParams({ status: "unpaid", sort: "-dueDate" });
console.log("/api/invoices?" + params);`,
        },
        { type: "h", text: "Statelessness and cookies" },
        {
          type: "p",
          text: "HTTP is **stateless**: each request stands alone, and the server doesn't remember the previous one. Then how does a site know you're logged in? **Cookies.** After you sign in, the server responds with a `Set-Cookie` header; the browser stores it and attaches it in a `Cookie` header to every following request to that domain. The server reads it and knows who you are, request after request.",
        },
        {
          type: "code",
          lang: "text",
          title: "a session cookie, set then sent back",
          code: `HTTP/1.1 200 OK
Set-Cookie: session=s_8f2a91; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

--- later, every request to that site carries: ---

GET /dashboard HTTP/1.1
Cookie: session=s_8f2a91`,
        },
        {
          type: "list",
          items: [
            "`HttpOnly`: JavaScript in the page can't read it (protects it from injected scripts).",
            "`Secure`: only sent over HTTPS.",
            "`SameSite=Lax`: not sent on most cross-site requests, which blocks a large class of forged-request attacks.",
            "`Max-Age` / `Expires`: when it dies. Without it, it's a *session cookie* deleted when the browser closes.",
          ],
        },
        {
          type: "run",
          title: "reading a Cookie header",
          code: `// What a server receives: one string with every cookie for this domain
const cookieHeader = "theme=dark; __session=eyJhbGciOi.abc; lang=fr-CA";

function parseCookies(header) {
  const cookies = {};
  for (const pair of header.split(";")) {
    const [name, ...rest] = pair.trim().split("=");
    cookies[name] = decodeURIComponent(rest.join("="));
  }
  return cookies;
}

const cookies = parseCookies(cookieHeader);
console.log(cookies);
console.log("Who is this?", cookies.__session ? "a signed-in user" : "anonymous");`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "In your stack",
          text: "Clerk keeps your session in a cookie named `__session` (a short-lived signed token), so `auth()` in Next.js can tell who's calling on every request. Supabase's SSR helpers do the same with `sb-<project>-auth-token` cookies. Neither \"remembers\" you on the server: they re-verify the cookie on every request, exactly because HTTP is stateless.",
        },
        {
          type: "challenge",
          title: "Classify a status code",
          prompt:
            "Write `classifyStatus(code)` that returns `\"informational\"` (100–199), `\"success\"` (200–299), `\"redirect\"` (300–399), `\"client error\"` (400–499) or `\"server error\"` (500–599). Anything else, including non-integers, returns `\"invalid\"`.",
          starter: `function classifyStatus(code) {
  if (code === 200) return "success";
  return "server error";
}`,
          solution: `function classifyStatus(code) {
  if (!Number.isInteger(code) || code < 100 || code > 599) return "invalid";
  const categories = ["informational", "success", "redirect", "client error", "server error"];
  return categories[Math.floor(code / 100) - 1];
}`,
          tests: [
            { name: "200 and 201 are success", code: `return classifyStatus(200) === "success" && classifyStatus(201) === "success";` },
            { name: "301 and 304 are redirects", code: `return classifyStatus(301) === "redirect" && classifyStatus(304) === "redirect";` },
            {
              name: "401, 404 and 429 are client errors",
              code: `return [401, 404, 429].every((c) => classifyStatus(c) === "client error");`,
            },
            { name: "500 and 503 are server errors", code: `return classifyStatus(500) === "server error" && classifyStatus(503) === "server error";` },
            {
              name: "99, 600 and 200.5 are invalid",
              code: `return classifyStatus(99) === "invalid" && classifyStatus(600) === "invalid" && classifyStatus(200.5) === "invalid";`,
            },
          ],
          hint: "Validate first with `Number.isInteger` and a range check. Then `Math.floor(code / 100)` gives you the first digit.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A logged-out visitor requests `/dashboard` and gets `401`. A logged-in *employee* requests `/admin` and gets `403`. What's the difference?",
              options: [
                "They mean the same thing",
                "401 is a server bug, 403 is a client bug",
                "403 means the page doesn't exist",
                "401 = we don't know who you are; 403 = we know, and you're not allowed",
              ],
              answer: 3,
              why: "Despite its name, 401 means unauthenticated. 403 means authenticated but not authorized.",
            },
            {
              q: "Your `fetch('/api/leads')` call gets a 500 response. What does `fetch` do?",
              options: [
                "It resolves normally; `res.ok` is false",
                "It throws a NetworkError",
                "It retries automatically",
                "It returns undefined",
              ],
              answer: 0,
              why: "fetch only rejects on network failure. HTTP errors are normal responses, so check `res.ok`.",
            },
            {
              q: "Which method is idempotent?",
              options: ["POST", "DELETE", "Neither", "Both"],
              answer: 1,
              why: "Deleting the same resource twice leaves the server in the same state as deleting it once. POSTing twice usually creates two records.",
            },
            {
              q: "How does a server know that two separate requests come from the same signed-in user?",
              options: [
                "HTTP keeps the connection's identity forever",
                "The server stores the browser's IP address",
                "The browser sends a cookie (or token) with every request",
                "The URL always contains the password",
              ],
              answer: 2,
              why: "HTTP is stateless. Identity is re-sent on every request, usually as a cookie set at sign-in.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. URLs, DNS, domains & HTTPS
    // ─────────────────────────────────────────────────────────────
    {
      slug: "urls-dns-https",
      title: "URLs, DNS, domains & HTTPS",
      summary: "Anatomy of a URL, how a domain finds your Vercel app, what DNS records do, and why HTTPS matters.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Sooner or later a client will say: \"we bought `lavalpizza.ca` at GoDaddy, can you make it point to the new site?\" To do that confidently you need three things: how a URL is built, how DNS turns a name into an address, and how HTTPS proves the site is really yours.",
        },
        { type: "h", text: "Anatomy of a URL" },
        {
          type: "code",
          lang: "text",
          code: `https://admin:secret@shop.lavalpizza.ca:8443/menu/pizzas?size=large&vegan=1#reviews
└─┬─┘   └────┬─────┘ └──────┬────────────┘└┬─┘└────┬─────┘└─────────┬────────┘└──┬───┘
protocol  credentials     hostname        port   pathname          search        hash
          (avoid!)        └ sub.domain.tld`,
        },
        {
          type: "list",
          items: [
            "**Protocol** (scheme): `https:` almost always. `http:` only for local development.",
            "**Hostname**: `shop` is a *subdomain*, `lavalpizza` the domain, `.ca` the top-level domain (TLD). `lavalpizza.ca` alone is called the **apex** (or root) domain.",
            "**Port**: which door on the server. Hidden when it's the default (443 for https, 80 for http). In dev you'll see `localhost:3000`.",
            "**Pathname**: which page/resource. In Next.js, this maps to folders in `app/`.",
            "**Search** (query string): extra parameters, sent to the server.",
            "**Hash** (fragment): **never sent to the server**. The browser uses it to scroll to `id=\"reviews\"`.",
          ],
        },
        {
          type: "run",
          title: "taking a URL apart",
          code: `const url = new URL("https://shop.lavalpizza.ca:8443/menu/pizzas?size=large&vegan=1#reviews");

console.log("protocol:", url.protocol);
console.log("hostname:", url.hostname);
console.log("port:    ", url.port);
console.log("host:    ", url.host);   // hostname + port
console.log("origin:  ", url.origin); // protocol + host: the security boundary
console.log("pathname:", url.pathname);
console.log("search:  ", url.search);
console.log("size =", url.searchParams.get("size"));
console.log("hash:    ", url.hash);

// Relative URLs are resolved against a base, exactly like links in a page
console.log(new URL("../checkout", "https://shop.lavalpizza.ca/menu/pizzas").href);

// Default ports disappear
console.log(new URL("https://lavalpizza.ca:443/").host);`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Origin",
          text: "The **origin** (protocol + hostname + port) is the browser's security boundary. `https://app.omnigo.ca` and `https://api.omnigo.ca` are *different* origins, so a page on one can't freely call the other. That rule is what **CORS** headers relax. You'll meet it when your frontend calls an API on another domain.",
        },
        { type: "h", text: "DNS: the internet's phone book" },
        {
          type: "p",
          text: "When the browser needs the IP of `www.lavalpizza.ca`, it doesn't know it. It asks a **resolver** (from the ISP, or a public one like 1.1.1.1), which, if it hasn't cached the answer, walks the hierarchy:",
        },
        {
          type: "steps",
          items: [
            { title: "Root servers", text: "\"Who handles `.ca`?\" → the `.ca` registry's nameservers." },
            { title: "TLD servers", text: "\"Who handles `lavalpizza.ca`?\" → the domain's **nameservers** (set at the registrar: GoDaddy, Namecheap, Cloudflare…)." },
            { title: "Authoritative nameservers", text: "\"What's the record for `www.lavalpizza.ca`?\" → the actual answer, from the DNS records *you* configure." },
            { title: "Caching", text: "The answer is cached for its **TTL** (time to live, in seconds) by the resolver, the OS and the browser. That's why DNS changes can take minutes to hours to be seen everywhere: \"propagation\" is mostly caches expiring." },
          ],
        },
        { type: "h", text: "The DNS records you'll actually touch" },
        {
          type: "table",
          rows: [
            ["Type", "Points a name to…", "Typical use in your work"],
            ["A", "an IPv4 address (`76.76.21.21`)", "Apex domain `lavalpizza.ca` → Vercel"],
            ["AAAA", "an IPv6 address", "Same as A, for IPv6"],
            ["CNAME", "another hostname (an alias)", "`www.lavalpizza.ca` → Vercel's hostname; `api.client.ca` → a Railway hostname"],
            ["TXT", "arbitrary text", "Proving you own the domain (Vercel, Google, Resend), email SPF/DKIM policies"],
            ["MX", "mail servers", "Where the domain's email is delivered (Google Workspace, Outlook)"],
            ["NS", "nameservers", "Which provider is authoritative for the zone"],
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Pointing a client domain at Vercel",
          text: "In the Vercel project → **Settings → Domains**, add `lavalpizza.ca` and `www.lavalpizza.ca`. Vercel then shows the exact records to create at the registrar: typically an **A** record for the apex (historically `76.76.21.21`) and a **CNAME** for `www` (historically `cname.vercel-dns.com`; newer projects may show a project-specific value). Always copy the values from the dashboard. If the domain is already used by another Vercel account, it also asks for a **TXT** record on `_vercel` to prove ownership. Railway works the same way: it gives you a CNAME target for a custom domain.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Don't break the client's email",
          text: "A CNAME can't coexist with other records on the same name, which is why the apex uses an A record. And when you change DNS, **never delete MX or TXT records you don't understand**: they're probably what makes the client's email work. Change only the A/CNAME records for the website.",
        },
        {
          type: "run",
          title: "a toy DNS resolver",
          code: `// A simplified zone. Real resolvers ask several servers; the idea is the same.
const records = {
  "lavalpizza.ca": { type: "A", value: "76.76.21.21" },
  "www.lavalpizza.ca": { type: "CNAME", value: "cname.vercel-dns.com" },
  "cname.vercel-dns.com": { type: "A", value: "76.76.21.21" },
  "api.lavalpizza.ca": { type: "CNAME", value: "lavalpizza-api.up.railway.app" },
  "lavalpizza-api.up.railway.app": { type: "A", value: "66.33.22.11" },
};

function resolve(name, depth = 0) {
  if (depth > 5) throw new Error("CNAME loop!");
  const record = records[name];
  if (!record) return null; // NXDOMAIN: no such name
  console.log("  ".repeat(depth) + name + " → " + record.type + " " + record.value);
  return record.type === "CNAME" ? resolve(record.value, depth + 1) : record.value;
}

for (const host of ["lavalpizza.ca", "www.lavalpizza.ca", "api.lavalpizza.ca", "blog.lavalpizza.ca"]) {
  console.log("IP:", resolve(host));
  console.log("");
}`,
        },
        { type: "h", text: "HTTPS and TLS" },
        {
          type: "p",
          text: "HTTPS is HTTP inside an encrypted **TLS** connection. It gives you three guarantees: **confidentiality** (nobody on the café Wi-Fi can read the password or cookie), **integrity** (nobody can inject ads or scripts into the page in transit), and **authenticity** (you're really talking to `lavalpizza.ca`, not an impostor).",
        },
        {
          type: "p",
          text: "Authenticity comes from a **certificate**: a file saying \"this public key belongs to `lavalpizza.ca`\", signed by a **certificate authority** (CA) that browsers trust, such as Let's Encrypt. During the handshake the server proves it holds the matching private key. Certificates expire (about 90 days for Let's Encrypt, and the industry is moving to even shorter lifetimes), so they must be renewed automatically.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Vercel and Railway do this for you",
          text: "Once DNS points at Vercel (or Railway), the platform requests and renews the certificate automatically and redirects `http://` to `https://`. If a new domain shows a certificate error, it's almost always because DNS isn't pointing at the platform yet. Wait for propagation and check the Domains page.",
        },
        {
          type: "p",
          text: "What HTTPS doesn't hide: the **hostname** you're visiting (visible during the handshake and in DNS) and how much data you send. The path, query string, headers, cookies and body are all encrypted. Still, don't put secrets in URLs: they end up in browser history and server logs.",
        },
        { type: "h", text: "Environments: local, preview, production" },
        {
          type: "table",
          rows: [
            ["Environment", "Example URL", "Who uses it", "Data"],
            ["Local (development)", "`http://localhost:3000`", "You, while coding (`npm run dev`)", "A dev / test database"],
            ["Preview", "`https://lavalpizza-git-new-menu-omnigo.vercel.app`", "You, teammates, the client for review", "Usually a staging database"],
            ["Production", "`https://lavalpizza.ca`", "Real customers", "The real database. Handle with care"],
          ],
        },
        {
          type: "p",
          text: "`localhost` is a special name that always means *this computer* (`127.0.0.1`), so nobody else can open your `localhost:3000`. Each environment gets its own **environment variables** (API keys, database URLs). On Vercel you set them separately for Development, Preview and Production, which is how a preview can talk to a test Stripe account while production charges real cards.",
        },
        {
          type: "challenge",
          title: "Which environment is this?",
          prompt:
            "Write `environmentOf(urlString, productionDomain)` returning `\"local\"` for `localhost` or `127.0.0.1`, `\"preview\"` for any `*.vercel.app` host, `\"production\"` for the production domain **or one of its subdomains** (e.g. `www.`), and `\"unknown\"` otherwise. Careful: `notlavalpizza.ca` is *not* a subdomain of `lavalpizza.ca`.",
          starter: `function environmentOf(urlString, productionDomain) {
  if (urlString.includes("localhost")) return "local";
  if (urlString.includes(productionDomain)) return "production";
  return "unknown";
}`,
          solution: `function environmentOf(urlString, productionDomain) {
  const { hostname } = new URL(urlString);
  if (hostname === "localhost" || hostname === "127.0.0.1") return "local";
  if (hostname.endsWith(".vercel.app")) return "preview";
  if (hostname === productionDomain || hostname.endsWith("." + productionDomain)) return "production";
  return "unknown";
}`,
          tests: [
            {
              name: "localhost and 127.0.0.1 are local",
              code: `return environmentOf("http://localhost:3000/menu", "lavalpizza.ca") === "local"
  && environmentOf("http://127.0.0.1:3000", "lavalpizza.ca") === "local";`,
            },
            {
              name: "a *.vercel.app URL is a preview",
              code: `return environmentOf("https://lavalpizza-git-new-menu-omnigo.vercel.app/", "lavalpizza.ca") === "preview";`,
            },
            {
              name: "apex and www are production",
              code: `return environmentOf("https://lavalpizza.ca/menu?size=large", "lavalpizza.ca") === "production"
  && environmentOf("https://www.lavalpizza.ca", "lavalpizza.ca") === "production";`,
            },
            {
              name: "a look-alike domain is unknown",
              code: `return environmentOf("https://notlavalpizza.ca", "lavalpizza.ca") === "unknown";`,
            },
            {
              name: "the domain appearing in the path or query doesn't count",
              code: `return environmentOf("https://evil.example/?next=lavalpizza.ca", "lavalpizza.ca") === "unknown";`,
            },
          ],
          hint: "Parse with `new URL(...)` and only look at `.hostname`. A subdomain ends with `\".\" + productionDomain`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "For `https://lavalpizza.ca/menu#reviews`, what does the server receive?",
              options: ["`/menu#reviews`", "Only `lavalpizza.ca`", "Nothing, the hash triggers a client-side route", "`/menu` (the hash stays in the browser)"],
              answer: 3,
              why: "The fragment after `#` is never sent in the HTTP request; the browser keeps it.",
            },
            {
              q: "Which record do you typically create for `www.client.ca` to point it at Vercel?",
              options: ["CNAME", "MX", "TXT", "NS"],
              answer: 0,
              why: "A subdomain is usually aliased to the platform's hostname with a CNAME. The apex uses an A record because a CNAME can't sit alongside the apex's other records.",
            },
            {
              q: "You just added DNS records and the new domain still shows the old site. Most likely reason?",
              options: [
                "HTTPS is broken",
                "Cached DNS answers haven't expired yet (TTL)",
                "Vercel only supports `.com` domains",
                "You need to rebuild the app",
              ],
              answer: 1,
              why: "Resolvers cache records for their TTL. Waiting, or checking with a tool that queries fresh, usually resolves it.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. HTML, CSS & JavaScript
    // ─────────────────────────────────────────────────────────────
    {
      slug: "html-css-javascript",
      title: "HTML, CSS & JavaScript: who does what",
      summary: "Structure, style and behaviour; what the DOM is; and why frameworks like React exist.",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "Whatever framework you use, the browser only understands three languages. React components, Tailwind classes and TypeScript all end up as **HTML**, **CSS** and **JavaScript**. Knowing what each one is responsible for tells you where to look when something is wrong.",
        },
        {
          type: "table",
          rows: [
            ["Language", "Job", "If it's wrong you see…"],
            ["HTML", "Structure and meaning: headings, paragraphs, links, forms, buttons", "Missing content, broken links, bad SEO, screen readers confused"],
            ["CSS", "Presentation: colours, spacing, layout, fonts, responsive design", "Things in the wrong place or the wrong colour, broken mobile layout"],
            ["JavaScript", "Behaviour: reacting to clicks, fetching data, updating the page", "Buttons that do nothing, errors in the console, stale data"],
          ],
        },
        { type: "h", text: "HTML: structure" },
        {
          type: "code",
          lang: "html",
          title: "index.html",
          code: `<!doctype html>
<html lang="fr-CA">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lead form – Garage Roy</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main>
      <h1>Request a quote</h1>
      <form id="lead-form">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />
        <button type="submit">Send</button>
      </form>
      <p id="status"></p>
    </main>
    <script src="/app.js" defer></script>
  </body>
</html>`,
        },
        {
          type: "p",
          text: "Use elements for what they **mean**: `<button>` for actions, `<a>` for navigation, `<h1>`–`<h6>` for headings, `<label>` tied to inputs. Search engines and assistive technologies rely on it, and you get keyboard support for free. A clickable `<div>` is not a button.",
        },
        { type: "h", text: "CSS: style" },
        {
          type: "compare",
          left: {
            label: "Plain CSS",
            lang: "css",
            code: `.cta {
  background: #a78bfa;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}
@media (min-width: 768px) {
  .cta { padding: 0.75rem 1.5rem; }
}`,
          },
          right: {
            label: "Tailwind (compiles to CSS like the left)",
            lang: "html",
            code: `<button class="bg-violet-400 text-white
  px-4 py-2 rounded-lg
  md:px-6 md:py-3">
  Send
</button>`,
          },
        },
        {
          type: "callout",
          tone: "stack",
          title: "Tailwind is still CSS",
          text: "Tailwind scans your files for class names and generates a normal stylesheet containing only the utilities you used. The browser never knows Tailwind exists. When a class \"doesn't work\", inspect the element in DevTools and look at the computed CSS, the same as with plain CSS.",
        },
        { type: "h", text: "JavaScript and the DOM" },
        {
          type: "p",
          text: "When the browser reads HTML, it builds a tree of objects in memory called the **DOM** (Document Object Model). Every element becomes a node with properties and children. JavaScript changes the page by changing the DOM; the browser then re-renders what changed. The HTML file itself is never modified.",
        },
        {
          type: "code",
          lang: "js",
          title: "app.js: vanilla DOM code (runs in a browser, not in this sandbox)",
          code: `const form = document.querySelector("#lead-form");
const status = document.querySelector("#status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();                  // stop the full-page reload
  status.textContent = "Sending…";
  const email = new FormData(form).get("email");
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  status.textContent = res.ok ? "Thanks! We'll be in touch." : "Something went wrong.";
});`,
        },
        { type: "h", text: "Why frameworks exist" },
        {
          type: "p",
          text: "The code above is fine for one form. Now imagine a dashboard with a list of leads, filters, a counter in the header, a \"won\" badge, and live updates. Every time data changes you must remember **every** DOM node that depends on it and update each by hand. Forget one and the page lies. That's *imperative* UI: you describe the *steps*.",
        },
        {
          type: "p",
          text: "Frameworks like React flip this around: you describe what the UI should look like **for a given state**, as a function, and the framework works out which DOM changes are needed. That's *declarative* UI: `UI = f(state)`. You change the data; the screen follows.",
        },
        {
          type: "run",
          title: "UI = f(state)",
          code: `// A pure function from state to markup. This is the core idea behind React components.
function renderDashboard(state) {
  const won = state.leads.filter((l) => l.status === "won").length;
  const items = state.leads.map((l) => "<li>" + l.name + " (" + l.status + ")</li>").join("");
  return "<h2>Leads: " + state.leads.length + " (" + won + " won)</h2><ul>" + items + "</ul>";
}

let state = {
  leads: [
    { name: "Café Lune", status: "new" },
    { name: "Garage Roy", status: "contacted" },
  ],
};
console.log(renderDashboard(state));

// Something happens: a lead is won and a new one arrives.
// We don't touch the "DOM": we produce new state and render again.
state = {
  leads: [
    ...state.leads.map((l) => (l.name === "Garage Roy" ? { ...l, status: "won" } : l)),
    { name: "Spa Nordik", status: "new" },
  ],
};
console.log(renderDashboard(state));`,
        },
        {
          type: "p",
          text: "React adds the clever part: instead of replacing the whole page, it compares the new output with the previous one and applies only the minimal DOM changes. The React track covers how.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Never trust text you put into HTML",
          text: "If a lead's name is `<img src=x onerror=alert(1)>` and you insert it as raw HTML, that code runs in your admin's browser. This is **XSS** (cross-site scripting). React escapes text by default, which is one more reason to use it, but string-built HTML (emails, PDFs, `dangerouslySetInnerHTML`) must escape `<`, `>`, `&` and quotes.",
        },
        {
          type: "challenge",
          title: "Render a lead list safely",
          prompt:
            "Write `renderLeads(leads)` where each lead is `{ name, status }`. Return `<ul>` with one `<li>Name (status)</li>` per lead, e.g. `<ul><li>Café Lune (new)</li></ul>`. For an empty array return `<p>No leads yet</p>`. Escape `&`, `<`, `>`, `\"` and `'` in names (`&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`).",
          starter: `function renderLeads(leads) {
  return "<ul>" + leads.map((l) => "<li>" + l.name + "</li>").join("") + "</ul>";
}`,
          solution: `function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderLeads(leads) {
  if (leads.length === 0) return "<p>No leads yet</p>";
  const items = leads.map((l) => "<li>" + escapeHtml(l.name) + " (" + escapeHtml(l.status) + ")</li>");
  return "<ul>" + items.join("") + "</ul>";
}`,
          tests: [
            {
              name: "renders one <li> per lead with its status",
              code: `return renderLeads([{ name: "Café Lune", status: "new" }, { name: "Garage Roy", status: "won" }])
  === "<ul><li>Café Lune (new)</li><li>Garage Roy (won)</li></ul>";`,
            },
            { name: "an empty list shows 'No leads yet'", code: `return renderLeads([]) === "<p>No leads yet</p>";` },
            {
              name: "HTML in a name is escaped, not executed",
              code: `const html = renderLeads([{ name: "<b>Roy</b> & Fils", status: "new" }]);
return html === "<ul><li>&lt;b&gt;Roy&lt;/b&gt; &amp; Fils (new)</li></ul>";`,
            },
            {
              name: "quotes are escaped too",
              code: `return renderLeads([{ name: "L'Atelier \\"Bois\\"", status: "new" }]).includes("L&#39;Atelier &quot;Bois&quot;");`,
            },
          ],
          hint: "Escape `&` **first**, otherwise you'll double-escape the `&` inside `&lt;`. `String.prototype.replaceAll` is handy here.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A button is centred on desktop but overflows on mobile. Which language is most likely involved?",
              options: ["HTML", "JavaScript", "CSS", "JSON"],
              answer: 2,
              why: "Layout and responsive behaviour are CSS's job (including Tailwind classes, which are CSS).",
            },
            {
              q: "What is the DOM?",
              options: [
                "The browser's in-memory tree of the page, which JavaScript can read and change",
                "The HTML file on the server",
                "A database for web pages",
                "React's virtual copy of the HTML",
              ],
              answer: 0,
              why: "The browser parses HTML into the DOM. Scripts manipulate the DOM, never the original file.",
            },
            {
              q: "What's the main idea behind declarative UI frameworks like React?",
              options: [
                "They make JavaScript run faster than HTML",
                "They remove the need for CSS",
                "They run your UI only on the server",
                "You describe the UI for a given state; the framework updates the DOM to match",
              ],
              answer: 3,
              why: "`UI = f(state)`: you change data, the framework figures out the DOM operations.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Rendering strategies
    // ─────────────────────────────────────────────────────────────
    {
      slug: "rendering-strategies",
      title: "Rendering: server, client, static & hybrid",
      summary: "Where the HTML gets built (SSR, CSR, SSG) and why Next.js mixes all of them.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Someone has to turn your data (\"3 unpaid invoices\") into HTML. The big question in web architecture is **where and when** that happens: on the server for every request, in the browser, or once at build time. Each choice trades off speed, freshness, SEO and cost.",
        },
        { type: "h", text: "A short history" },
        {
          type: "steps",
          items: [
            {
              title: "Server-rendered pages (1995 → today)",
              text: "PHP, WordPress, Rails: every click requests a new page, the server builds complete HTML and sends it. Simple, SEO-friendly, but each navigation reloads the whole page.",
            },
            {
              title: "Single-page apps, SPA (≈2010 →)",
              text: "The server sends an almost empty HTML shell plus a big JavaScript bundle. The browser fetches JSON and builds the UI itself (client-side rendering, **CSR**). Navigation feels instant after the first load, but the first load is slow and crawlers may see an empty page.",
            },
            {
              title: "Static site generation, SSG",
              text: "Build all pages once at **build time** and serve the files from a CDN. Blazing fast and cheap, but content is frozen until the next build.",
            },
            {
              title: "Hybrid (Next.js, today)",
              text: "Choose per page, even per component: prerender what can be static, render on the server what's personalised, and send JavaScript only for the parts that need interactivity.",
            },
          ],
        },
        { type: "h", text: "The strategies side by side" },
        {
          type: "table",
          rows: [
            ["Strategy", "HTML built…", "Great for", "Watch out for"],
            ["SSR (server-side rendering)", "On the server, on every request", "Personalised or fresh data: dashboards, order status", "Server work on every request; slower if data is slow"],
            ["CSR (client-side rendering)", "In the browser, after JS loads", "Highly interactive widgets: drag-and-drop planners, live filters", "Blank or spinner first; bigger JS bundles; weaker SEO"],
            ["SSG (static generation)", "Once, at build time", "Marketing pages, blog posts, docs", "Stale until rebuilt"],
            ["ISR / revalidation", "At build time, then refreshed in the background", "Product catalogue, menu: mostly static, changes sometimes", "Visitors may briefly see the previous version"],
          ],
        },
        {
          type: "p",
          text: "Notice what matters to the visitor: **when does meaningful content appear**, and **when can I click**. Server and static rendering put content in the very first response. Client rendering delays content until JavaScript has downloaded, run and fetched data.",
        },
        {
          type: "run",
          title: "time to content: SSR vs CSR (simulated)",
          code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const NETWORK = 50;   // one round trip browser ↔ server
const DB = 40;        // query time
const JS_BUNDLE = 120; // download + parse the JavaScript

async function ssr() {
  const t0 = Date.now();
  await wait(NETWORK / 2);            // request travels
  await wait(DB);                     // server queries the DB (close by, in the data centre)
  await wait(NETWORK / 2);            // full HTML travels back
  console.log("[SSR] content visible at", Date.now() - t0, "ms");
  await wait(JS_BUNDLE);              // JS loads to make buttons work (hydration)
  console.log("[SSR] interactive at   ", Date.now() - t0, "ms");
}

async function csr() {
  const t0 = Date.now();
  await wait(NETWORK);                // empty HTML shell
  console.log("[CSR] blank shell at   ", Date.now() - t0, "ms");
  await wait(JS_BUNDLE);              // download + run the app
  await wait(NETWORK + DB);           // app now fetches /api/invoices
  console.log("[CSR] content visible at", Date.now() - t0, "ms (interactive too)");
}

async function ssg() {
  const t0 = Date.now();
  await wait(NETWORK / 3);            // file served from a nearby CDN, no DB at all
  console.log("[SSG] content visible at", Date.now() - t0, "ms");
}

await ssr();
await csr();
await ssg();`,
        },
        { type: "h", text: "Hydration" },
        {
          type: "p",
          text: "Server-rendered HTML is just a picture of the page: the buttons don't work yet. **Hydration** is React, running in the browser, attaching itself to that existing HTML: wiring up click handlers and state so the page becomes interactive. Until hydration finishes, the page is visible but not fully clickable.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Hydration mismatch",
          text: "If the browser's first render produces different HTML than the server did (e.g. you print `new Date().toLocaleTimeString()` or read `localStorage` during render), React warns about a hydration mismatch. The server and the first client render must agree.",
        },
        { type: "h", text: "Why Next.js mixes them" },
        {
          type: "p",
          text: "Real apps aren't one kind of page. A typical client project has a marketing homepage (same for everyone: static), a product catalogue (changes daily: revalidated), a customer dashboard (personal: rendered per request), and an interactive booking calendar (needs browser state: client-side). Next.js lets each piece use the right strategy inside the same app.",
        },
        {
          type: "code",
          lang: "tsx",
          title: "app/dashboard/page.tsx (preview: the Next.js track explains every line)",
          code: `import { auth } from "@clerk/nextjs/server";
import { BookingCalendar } from "./booking-calendar"; // a "use client" component

// A Server Component: runs on the server, can talk to the database directly,
// and sends HTML (not this code) to the browser.
export default async function DashboardPage() {
  const { userId } = await auth();            // reads the session cookie
  const invoices = await getInvoicesFor(userId); // e.g. a Supabase query

  return (
    <main>
      <h1>{invoices.length} unpaid invoices</h1>
      {/* Only this part ships JavaScript and runs in the browser */}
      <BookingCalendar />
    </main>
  );
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "In the App Router",
          text: "Components are **Server Components** by default: they render on the server and send no JavaScript of their own. Add `\"use client\"` at the top of a file to make a **Client Component** that hydrates and can use state, effects and event handlers. Next.js decides whether a route can be prerendered at build time or must render per request (for example when it reads cookies, headers or search params), and newer caching APIs let you control that per component. You'll go deep on this in the Next.js track; for now, remember the question it is always answering: *where and when is this HTML built?*",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A restaurant's \"About us\" page changes twice a year. Best fit?",
              options: ["Client-side rendering", "Static generation (prerendered at build)", "Server-side rendering on every request", "A WebSocket"],
              answer: 1,
              why: "Same content for everyone, rarely changes: build it once and serve it from the CDN.",
            },
            {
              q: "Why can a pure CSR page be bad for SEO and first load?",
              options: [
                "The initial HTML is mostly empty until JavaScript runs and fetches data",
                "Browsers can't run JavaScript",
                "CSR pages can't use CSS",
                "CSR pages are always served over HTTP instead of HTTPS",
              ],
              answer: 0,
              why: "Content appears only after the bundle downloads, executes and fetches data; crawlers and slow phones pay for that.",
            },
            {
              q: "What is hydration?",
              options: [
                "Refreshing static pages in the background",
                "Compressing HTML before sending",
                "Loading data from the database",
                "React in the browser attaching event handlers and state to server-rendered HTML",
              ],
              answer: 3,
              why: "Hydration turns the server's static HTML into a live, interactive React app.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Code to production
    // ─────────────────────────────────────────────────────────────
    {
      slug: "code-to-production",
      title: "From code to production",
      summary: "Source → install → build → deploy → run: what each step does, what CI is, and how preview deployments work.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "The code in your editor is not what runs on `lavalpizza.ca`. Between the two there's a pipeline that installs dependencies, transforms your TypeScript and JSX into optimised files, checks that nothing is broken, and ships the result to servers around the world. When a deploy fails, knowing which stage failed tells you where to look.",
        },
        {
          type: "steps",
          items: [
            {
              title: "1. Write & commit",
              text: "You change code locally, test it with `npm run dev`, and commit it with Git. A commit is a snapshot of the whole project.",
            },
            {
              title: "2. Push to GitHub",
              text: "`git push` sends your commits to the shared repository. This push is the trigger for everything that follows.",
            },
            {
              title: "3. CI checks",
              text: "**Continuous Integration**: a fresh machine (e.g. GitHub Actions) installs the project and runs lint, type-check and tests. If anything fails, the pull request shows a red ✗ and nobody should merge.",
            },
            {
              title: "4. Install dependencies",
              text: "The build machine runs `npm ci`: it installs the exact versions recorded in `package-lock.json` into `node_modules`. Same lockfile, same code, on every machine.",
            },
            {
              title: "5. Build",
              text: "`npm run build` (→ `next build`) compiles TypeScript and JSX to plain JavaScript, bundles and minifies it, generates the CSS, prerenders static pages, and prepares server functions for dynamic routes. Type errors fail the build here.",
            },
            {
              title: "6. Deploy",
              text: "The build output is uploaded: static files to a CDN close to visitors, server code to functions that run on demand. Each deploy is **immutable** and gets its own URL.",
            },
            {
              title: "7. Run",
              text: "Requests arrive; static files are served from the CDN; dynamic routes run your server code. Logs and errors show up in the platform's dashboard.",
            },
          ],
        },
        { type: "h", text: "What \"build\" actually means" },
        {
          type: "p",
          text: "Browsers don't understand TypeScript, JSX or `import \"@clerk/nextjs\"` from `node_modules`. The build translates your *developer-friendly* source into *browser- and server-friendly* output: plain JavaScript, split into small chunks so each page only downloads what it needs, with comments and whitespace stripped. It's also where many mistakes surface for the first time.",
        },
        {
          type: "code",
          lang: "json",
          title: "package.json: the commands every platform runs",
          code: `{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}`,
        },
        {
          type: "code",
          lang: "bash",
          title: "reproduce a production build locally",
          code: `npm ci            # clean install from the lockfile
npm run build     # the same build Vercel runs
npm run start     # serve the production build on http://localhost:3000`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "\"Works on my machine\"",
          text: "`npm run dev` is forgiving: it compiles pages on demand and skips some checks. Before pushing something important, run `npm run build` locally. If it fails there, it would have failed on Vercel too, and you find out in seconds instead of minutes.",
        },
        { type: "h", text: "Build time vs run time" },
        {
          type: "p",
          text: "Some things are decided **once at build time** and baked into the output; others are read **at run time** on each request. Mixing them up is a classic source of \"I changed the variable but nothing happened\".",
        },
        {
          type: "callout",
          tone: "warn",
          title: "NEXT_PUBLIC_ variables are baked in",
          text: "In Next.js, environment variables prefixed `NEXT_PUBLIC_` are copied into the browser JavaScript *during the build*. Change one in the Vercel dashboard and nothing changes until you **redeploy**. They are also visible to anyone, so never prefix a secret with `NEXT_PUBLIC_`. Server-only variables (no prefix) are read on the server and never sent to the browser.",
        },
        { type: "h", text: "CI: robots that check every push" },
        {
          type: "code",
          lang: "text",
          title: ".github/workflows/ci.yml",
          code: `name: CI
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test`,
        },
        {
          type: "p",
          text: "A pipeline is a chain of steps where **the first failure stops everything after it**. There's no point building if the types are broken, and definitely no point deploying a failed build. Let's simulate one.",
        },
        {
          type: "run",
          title: "a pipeline that stops at the first failure",
          code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const steps = [
  { name: "install",   run: async () => { await wait(30); return true; } },
  { name: "lint",      run: async () => { await wait(10); return true; } },
  { name: "typecheck", run: async () => { await wait(20); return false; } }, // a type error!
  { name: "build",     run: async () => { await wait(50); return true; } },
  { name: "deploy",    run: async () => { await wait(20); return true; } },
];

for (const step of steps) {
  const ok = await step.run();
  console.log((ok ? "✓ " : "✗ ") + step.name);
  if (!ok) {
    console.log("Pipeline failed at '" + step.name + "'. Production is untouched.");
    break;
  }
}
// Change typecheck to return true and run again.`,
        },
        { type: "h", text: "Preview deployments and promotion" },
        {
          type: "list",
          items: [
            "**Every push to a branch** gets its own Vercel **preview deployment** with a unique URL. Vercel posts it on the pull request, so the client or a teammate can click through the change before it goes live.",
            "**Merging into `main`** (the production branch) triggers a **production deployment**, which then receives the real domain.",
            "Because deployments are immutable, **rolling back** is instant: point the domain back at the previous deployment. Nothing is rebuilt.",
            "Previews use the **Preview** environment variables, so they should talk to test databases and test payment keys, never to production data by accident.",
          ],
        },
        {
          type: "callout",
          tone: "stack",
          title: "Vercel vs Railway",
          text: "**Vercel** is optimised for frameworks like Next.js: it builds on every push, serves static files from its CDN and runs dynamic code as functions that start on demand. **Railway** runs your app as a long-lived process (a container), which suits things that must stay running: a Node worker processing a queue, a WebSocket server, a Shopify sync cron job, or a database. Both follow the same idea: push → build → deploy → run.",
        },
        {
          type: "challenge",
          title: "Run a pipeline",
          prompt:
            "Write `async function runPipeline(steps)`. Each step is `{ name, run }` where `run` is an async function returning `true` (success) or `false` (failure); it may also **throw**, which counts as failure. Run the steps in order and stop at the first failure. Return `{ ok, completed, failedAt }`: `completed` lists the names of steps that succeeded, `failedAt` is the failing step's name or `null`.",
          starter: `async function runPipeline(steps) {
  const completed = [];
  for (const step of steps) {
    // TODO: actually run the step and stop at the first failure
    completed.push(step.name);
  }
  return { ok: true, completed, failedAt: null };
}`,
          solution: `async function runPipeline(steps) {
  const completed = [];
  for (const step of steps) {
    let ok;
    try {
      ok = await step.run();
    } catch {
      ok = false;
    }
    if (ok !== true) {
      return { ok: false, completed, failedAt: step.name };
    }
    completed.push(step.name);
  }
  return { ok: true, completed, failedAt: null };
}`,
          tests: [
            {
              name: "all steps pass → ok with every step completed",
              code: `const r = await runPipeline([
  { name: "install", run: async () => true },
  { name: "build", run: async () => true },
]);
return r.ok === true && r.failedAt === null && r.completed.join(",") === "install,build";`,
            },
            {
              name: "a failing step stops the pipeline (later steps never run)",
              code: `let deployed = false;
const r = await runPipeline([
  { name: "install", run: async () => true },
  { name: "typecheck", run: async () => false },
  { name: "deploy", run: async () => { deployed = true; return true; } },
]);
return r.ok === false && r.failedAt === "typecheck" && r.completed.join(",") === "install" && !deployed;`,
            },
            {
              name: "a step that throws counts as a failure",
              code: `const r = await runPipeline([
  { name: "build", run: async () => { throw new Error("Module not found"); } },
  { name: "deploy", run: async () => true },
]);
return r.ok === false && r.failedAt === "build" && r.completed.length === 0;`,
            },
            {
              name: "an empty pipeline is ok",
              code: `const r = await runPipeline([]);
return r.ok === true && r.completed.length === 0 && r.failedAt === null;`,
            },
          ],
          hint: "Use a `for…of` loop so you can `await` each step in order. Wrap `await step.run()` in `try/catch`, and `return` early as soon as a step fails.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You changed `NEXT_PUBLIC_SUPABASE_URL` in Vercel's settings but the live site still uses the old value. Why?",
              options: [
                "Vercel caches environment variables for 24 hours",
                "Supabase rejected the new URL",
                "`NEXT_PUBLIC_` values are inlined at build time; you need to redeploy",
                "Environment variables only work locally",
              ],
              answer: 2,
              why: "Public variables are baked into the JavaScript during the build. A new build picks up the new value.",
            },
            {
              q: "What does `npm ci` do differently from `npm install`?",
              options: [
                "It installs exactly what `package-lock.json` specifies, starting from a clean `node_modules`",
                "It runs the tests",
                "It deploys the app",
                "It upgrades every dependency to the latest version",
              ],
              answer: 0,
              why: "`npm ci` is the reproducible install for CI and build servers: lockfile versions only, and it fails if `package.json` and the lockfile disagree.",
            },
            {
              q: "A teammate opens a pull request. What does Vercel typically do?",
              options: [
                "Deploys it straight to the production domain",
                "Nothing until it's merged",
                "Deletes the previous production deployment",
                "Builds a preview deployment with its own URL",
              ],
              answer: 3,
              why: "Each branch/PR gets an isolated preview deployment. Only the production branch updates the real domain.",
            },
          ],
        },
      ],
    },
  ],
};
