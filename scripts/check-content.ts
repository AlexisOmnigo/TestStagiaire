/**
 * Validates every track in content/tracks:
 *  - structure (unique slugs, quiz answers in range, required fields)
 *  - every `run` block executes without throwing
 *  - every challenge solution passes all its tests
 *  - every challenge starter fails at least one test
 *
 * Usage: npm run check:content [-- <file-name-filter>]
 */
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { inspect } from "node:util";
import { createRequire } from "node:module";
import { buildProgram, stripTypes } from "../lib/program.ts";

const require = createRequire(import.meta.url);
const { transform } = require("sucrase");

const here = dirname(fileURLToPath(import.meta.url));
const tracksDir = join(here, "..", "content", "tracks");
const filter = process.argv[2];

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const TIMEOUT_MS = 3000;
const NODE_ONLY = ["process", "Buffer", "require", "module", "exports", "global", "__dirname", "__filename", "setImmediate"];

let errors = 0;
let warnings = 0;
const err = (where: string, msg: string) => {
  errors++;
  console.log(`  \x1b[31m✗ ${where}\x1b[0m ${msg}`);
};
const warn = (where: string, msg: string) => {
  warnings++;
  console.log(`  \x1b[33m! ${where}\x1b[0m ${msg}`);
};

async function execute(code: string, lang: string | undefined, tests: { code: string }[]) {
  const logs: string[] = [];
  const fakeConsole = {
    log: (...a: unknown[]) => logs.push(a.map((x) => (typeof x === "string" ? x : inspect(x))).join(" ")),
  } as Record<string, (...a: unknown[]) => void>;
  fakeConsole.info = fakeConsole.warn = fakeConsole.error = fakeConsole.table = fakeConsole.log;
  const source = lang === "ts" ? stripTypes(code, transform) : code;
  // Shadow console for the snippet only.
  // Node-only globals are shadowed so snippets behave like they will in the browser worker.
  const fn = new AsyncFunction("console", ...NODE_ONLY, buildProgram(source, tests));
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`timed out after ${TIMEOUT_MS}ms`)), TIMEOUT_MS));
  const testFns = (await Promise.race([fn(fakeConsole), timeout])) as (() => Promise<unknown>)[];
  const results: { pass: boolean; error?: string }[] = [];
  for (const t of testFns) {
    try {
      const r = await Promise.race([t(), timeout]);
      results.push({ pass: r === true });
    } catch (e) {
      results.push({ pass: false, error: String(e) });
    }
  }
  return { logs, results };
}

const files = readdirSync(tracksDir)
  .filter((f) => f.endsWith(".ts"))
  .filter((f) => !filter || f.includes(filter))
  .sort();

const trackSlugs = new Set<string>();
for (const file of files) {
  const mod = await import(pathToFileURL(join(tracksDir, file)).href);
  const track = mod.track ?? mod.default;
  console.log(`\n${file}`);
  if (!track) {
    err(file, "must `export const track: Track`");
    continue;
  }
  if (trackSlugs.has(track.slug)) err(file, `duplicate track slug ${track.slug}`);
  trackSlugs.add(track.slug);
  for (const k of ["slug", "title", "tagline", "outcome", "badge", "color"]) {
    if (!track[k]) err(file, `track missing ${k}`);
  }
  const lessonSlugs = new Set<string>();
  for (const lesson of track.lessons) {
    const at = `${track.slug}/${lesson.slug}`;
    if (!/^[a-z0-9-]+$/.test(lesson.slug)) err(at, "slug must be lowercase-kebab");
    if (lessonSlugs.has(lesson.slug)) err(at, "duplicate lesson slug");
    lessonSlugs.add(lesson.slug);
    if (!lesson.title || !lesson.summary || !lesson.minutes) err(at, "missing title/summary/minutes");
    if (!lesson.blocks?.length) err(at, "no blocks");
    if (!lesson.blocks.some((b: { type: string }) => b.type === "quiz")) warn(at, "no quiz");
    for (const [i, b] of lesson.blocks.entries()) {
      const where = `${at} #${i} (${b.type})`;
      try {
        if (b.type === "quiz") {
          for (const q of b.questions) {
            if (!(q.answer >= 0 && q.answer < q.options.length)) err(where, `answer out of range: ${q.q}`);
            if (!q.why) err(where, `missing why: ${q.q}`);
          }
        } else if (b.type === "run") {
          await execute(b.code, b.lang, []);
        } else if (b.type === "challenge") {
          if (!b.tests?.length) err(where, "no tests");
          const sol = await execute(b.solution, b.lang, b.tests);
          sol.results.forEach((r, ti) => {
            if (!r.pass) err(where, `solution fails test "${b.tests[ti].name}" ${r.error ?? ""}`);
          });
          try {
            const st = await execute(b.starter, b.lang, b.tests);
            if (st.results.every((r) => r.pass)) warn(where, "starter already passes every test");
          } catch {
            // starter throwing is fine
          }
        } else if (b.type === "table") {
          const w = b.rows[0]?.length;
          if (!b.rows.every((r: string[]) => r.length === w)) err(where, "table rows have different lengths");
        }
      } catch (e) {
        err(where, `threw: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  console.log(`  ${track.lessons.length} lessons checked`);
}

console.log(`\n${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
