"use client";

import { buildProgram, stripTypes } from "./program";

/**
 * Runs learner code in a throwaway Web Worker so that infinite loops can be
 * stopped (worker.terminate()) and nothing can touch the page itself.
 */

export type LogLevel = "log" | "warn" | "error" | "info";
export interface LogLine {
  level: LogLevel;
  text: string;
}
export interface TestResult {
  pass: boolean;
  error?: string;
}
export interface RunOutcome {
  /** set when the code itself failed (syntax error, uncaught throw, timeout) */
  error?: string;
  results: TestResult[];
  ms: number;
}

const HARD_TIMEOUT_MS = 5000;
/** keep the worker alive briefly after it finishes so late setTimeout logs still show */
const GRACE_MS = 2500;

const WORKER_SOURCE = String.raw`
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const send = (m) => self.postMessage(m);

function fmt(v, depth, seen, nested) {
  if (typeof v === "string") return nested ? JSON.stringify(v) : v;
  if (typeof v === "bigint") return v + "n";
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") {
    if (/^class\s/.test(Function.prototype.toString.call(v))) return "[class " + (v.name || "anonymous") + "]";
    return "[Function: " + (v.name || "anonymous") + "]";
  }
  if (v === null || typeof v !== "object") return String(v);
  if (seen.has(v)) return "[Circular]";
  if (v instanceof Error) return v.name + ": " + v.message;
  if (v instanceof Date) return isNaN(v) ? "Invalid Date" : v.toISOString();
  if (v instanceof RegExp) return String(v);
  if (v instanceof Promise) return "Promise { <pending?> }";
  if (typeof Response !== "undefined" && v instanceof Response) return "Response { status: " + v.status + ", ok: " + v.ok + " }";
  if (v instanceof URL) return "URL { href: " + JSON.stringify(v.href) + " }";
  if (v instanceof URLSearchParams) return "URLSearchParams { " + [...v].map(([k, x]) => JSON.stringify(k) + " => " + JSON.stringify(x)).join(", ") + " }";
  if (depth > 4) return Array.isArray(v) ? "[Array]" : "[Object]";
  seen.add(v);
  let out;
  const inner = (x) => fmt(x, depth + 1, seen, true);
  if (Array.isArray(v)) {
    const items = v.slice(0, 100).map(inner);
    if (v.length > 100) items.push("... " + (v.length - 100) + " more items");
    out = oneOrMany("[", items, "]", depth);
  } else if (v instanceof Map) {
    out = "Map(" + v.size + ") " + oneOrMany("{", [...v].map(([k, x]) => inner(k) + " => " + inner(x)), "}", depth);
  } else if (v instanceof Set) {
    out = "Set(" + v.size + ") " + oneOrMany("{", [...v].map(inner), "}", depth);
  } else {
    const proto = Object.getPrototypeOf(v);
    const name = proto && proto !== Object.prototype && proto.constructor && proto.constructor.name;
    const keys = Object.keys(v);
    const items = keys.map((k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)) + ": " + inner(v[k]));
    out = (name ? name + " " : proto === null ? "[Object: null prototype] " : "") + oneOrMany("{", items, "}", depth);
  }
  seen.delete(v);
  return out;
}

function oneOrMany(open, items, close, depth) {
  if (!items.length) return open + close;
  const one = open + " " + items.join(", ") + " " + close;
  if (one.length <= 72 && !one.includes("\n")) return one;
  const pad = "  ".repeat(depth + 1);
  return open + "\n" + items.map((i) => pad + i.replace(/\n/g, "\n" + pad)).join(",\n") + "\n" + "  ".repeat(depth) + close;
}

const show = (args) => args.map((a) => fmt(a, 0, new WeakSet(), false)).join(" ");

function table(data) {
  if (data === null || typeof data !== "object") return show([data]);
  const rows = Object.entries(data);
  const cols = [];
  for (const [, row] of rows) {
    if (row && typeof row === "object") for (const k of Object.keys(row)) if (!cols.includes(k)) cols.push(k);
  }
  const header = ["(index)", ...(cols.length ? cols : ["Values"])];
  const body = rows.map(([i, row]) => [i, ...(cols.length ? cols.map((c) => (row && c in row ? fmt(row[c], 1, new WeakSet(), true) : "")) : [fmt(row, 1, new WeakSet(), true)])]);
  const widths = header.map((h, c) => Math.max(h.length, ...body.map((r) => String(r[c]).length)));
  const line = (cells) => "│ " + cells.map((x, c) => String(x).padEnd(widths[c])).join(" │ ") + " │";
  const sep = (l, m, r) => l + widths.map((w) => "─".repeat(w + 2)).join(m) + r;
  return [sep("┌", "┬", "┐"), line(header), sep("├", "┼", "┤"), ...body.map(line), sep("└", "┴", "┘")].join("\n");
}

const counters = {};
const timers = {};
const con = {
  log: (...a) => send({ type: "log", level: "log", text: show(a) }),
  info: (...a) => send({ type: "log", level: "info", text: show(a) }),
  debug: (...a) => send({ type: "log", level: "log", text: show(a) }),
  warn: (...a) => send({ type: "log", level: "warn", text: show(a) }),
  error: (...a) => send({ type: "log", level: "error", text: show(a) }),
  dir: (...a) => send({ type: "log", level: "log", text: show(a) }),
  table: (d) => send({ type: "log", level: "log", text: table(d) }),
  group: (...a) => a.length && send({ type: "log", level: "log", text: show(a) }),
  groupEnd: () => {},
  count: (l = "default") => send({ type: "log", level: "log", text: l + ": " + (counters[l] = (counters[l] || 0) + 1) }),
  time: (l = "default") => { timers[l] = performance.now(); },
  timeEnd: (l = "default") => send({ type: "log", level: "log", text: l + ": " + (performance.now() - timers[l]).toFixed(1) + "ms" }),
  assert: (ok, ...a) => { if (!ok) send({ type: "log", level: "error", text: "Assertion failed" + (a.length ? ": " + show(a) : "") }); },
};
self.console = con;

const errText = (e) => (e instanceof Error ? e.name + ": " + e.message : "Uncaught " + fmt(e, 0, new WeakSet(), true));
self.addEventListener("unhandledrejection", (e) => { e.preventDefault(); send({ type: "log", level: "error", text: "Unhandled promise rejection → " + errText(e.reason) }); });
self.addEventListener("error", (e) => { e.preventDefault(); send({ type: "log", level: "error", text: "Uncaught " + (e.error ? errText(e.error) : e.message) }); });

self.onmessage = async (event) => {
  const { source } = event.data;
  let tests;
  try {
    const fn = new AsyncFunction("console", source);
    tests = await fn(con);
  } catch (e) {
    send({ type: "done", error: errText(e), results: [] });
    return;
  }
  const results = [];
  for (const t of tests) {
    try {
      const r = await t();
      results.push(r === true ? { pass: true } : { pass: false, error: r === false || r === undefined ? undefined : "returned " + fmt(r, 0, new WeakSet(), true) });
    } catch (e) {
      results.push({ pass: false, error: errText(e) });
    }
  }
  send({ type: "done", results });
};
`;

let workerUrl: string | null = null;
function getWorkerUrl() {
  if (!workerUrl) workerUrl = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: "text/javascript" }));
  return workerUrl;
}

let sucrase: Promise<typeof import("sucrase")> | null = null;
async function toJavaScript(code: string, lang: "js" | "ts") {
  if (lang === "js") return code;
  sucrase ??= import("sucrase");
  const { transform } = await sucrase;
  return stripTypes(code, transform);
}

export interface RunHandle {
  done: Promise<RunOutcome>;
  stop: () => void;
}

export function runCode(opts: {
  code: string;
  lang?: "js" | "ts";
  tests?: { code: string }[];
  onLog: (line: LogLine) => void;
}): RunHandle {
  let worker: Worker | null = null;
  let finished = false;
  let hardTimer: ReturnType<typeof setTimeout> | undefined;
  let graceTimer: ReturnType<typeof setTimeout> | undefined;
  let resolveDone!: (o: RunOutcome) => void;
  const done = new Promise<RunOutcome>((r) => (resolveDone = r));
  const started = performance.now();

  const kill = () => {
    clearTimeout(hardTimer);
    clearTimeout(graceTimer);
    worker?.terminate();
    worker = null;
  };
  const finish = (o: Omit<RunOutcome, "ms">) => {
    if (finished) return;
    finished = true;
    resolveDone({ ...o, ms: Math.round(performance.now() - started) });
  };

  (async () => {
    let js: string;
    try {
      js = await toJavaScript(opts.code, opts.lang ?? "js");
    } catch (e) {
      finish({ error: `SyntaxError: ${e instanceof Error ? e.message : String(e)}`, results: [] });
      return;
    }
    worker = new Worker(getWorkerUrl());
    worker.onmessage = (event: MessageEvent) => {
      const msg = event.data;
      if (msg.type === "log") opts.onLog({ level: msg.level, text: msg.text });
      if (msg.type === "done") {
        clearTimeout(hardTimer);
        finish({ error: msg.error, results: msg.results });
        graceTimer = setTimeout(kill, GRACE_MS);
      }
    };
    hardTimer = setTimeout(() => {
      kill();
      finish({
        error: `Stopped after ${HARD_TIMEOUT_MS / 1000}s — is there an infinite loop or a promise that never settles?`,
        results: [],
      });
    }, HARD_TIMEOUT_MS);
    worker.postMessage({ source: buildProgram(js, opts.tests) });
  })();

  return {
    done,
    stop: () => {
      kill();
      finish({ error: "Stopped.", results: [] });
    },
  };
}
