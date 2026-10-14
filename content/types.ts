/**
 * The whole course is plain data. Each track is a list of lessons,
 * each lesson is a list of blocks rendered top-to-bottom.
 *
 * Inline text (p, list items, callouts, quiz text) supports a tiny
 * markdown subset: `inline code`, **bold**, *italic* and [links](https://...).
 */

export type CodeLang =
  | "js"
  | "ts"
  | "tsx"
  | "jsx"
  | "bash"
  | "json"
  | "sql"
  | "html"
  | "css"
  | "graphql"
  | "text";

export type Block =
  /** A paragraph. */
  | { type: "p"; text: string }
  /** A sub-heading inside the lesson. */
  | { type: "h"; text: string }
  /** Bullet list (or numbered with ordered: true). */
  | { type: "list"; items: string[]; ordered?: boolean }
  /** Read-only, syntax highlighted code. `title` is usually a file name. */
  | { type: "code"; lang: CodeLang; code: string; title?: string }
  /**
   * Editable code the learner can run in the browser (inside a Web Worker).
   * `lang: "ts"` strips types before running (types are NOT checked).
   * No DOM, no `import`/`require`. console.log / console.error output is shown.
   * Top-level `await` works.
   */
  | { type: "run"; code: string; lang?: "js" | "ts"; title?: string }
  /** Highlighted aside. */
  | { type: "callout"; tone: "tip" | "warn" | "info" | "stack"; title?: string; text: string }
  /** Two code samples side by side (e.g. "before / after", "JS / TS"). */
  | {
      type: "compare";
      left: { label: string; lang: CodeLang; code: string };
      right: { label: string; lang: CodeLang; code: string };
    }
  /** Ordered steps, e.g. a request lifecycle. */
  | { type: "steps"; items: { title: string; text: string }[] }
  /** Simple 2+ column table. First row is the header. */
  | { type: "table"; rows: string[][] }
  /**
   * A graded coding exercise. The learner's code runs, then each test body
   * runs in the same scope as an async function body and must `return true`
   * to pass (returning anything else or throwing = fail).
   */
  | {
      type: "challenge";
      title: string;
      prompt: string;
      starter: string;
      solution: string;
      tests: { name: string; code: string }[];
      lang?: "js" | "ts";
      hint?: string;
      /** LeetCode-style difficulty; challenges with one appear on the Practice page filters */
      difficulty?: "easy" | "medium" | "hard";
      /** LeetCode-style worked examples shown under the prompt */
      examples?: { input: string; output: string; explanation?: string }[];
      /** e.g. "1 <= nums.length <= 10^5" */
      constraints?: string[];
      /** short topic tags, e.g. ["hash map", "two pointers"] */
      tags?: string[];
      /** the complexity the reference solution achieves, e.g. "O(n) time, O(1) space" */
      complexity?: string;
    }
  /** Multiple choice questions. `answer` is the index of the correct option. */
  | {
      type: "quiz";
      questions: { q: string; options: string[]; answer: number; why: string }[];
    };

export interface Lesson {
  /** url-safe, unique inside its track */
  slug: string;
  title: string;
  /** one sentence, shown in lists */
  summary: string;
  /** estimated reading + doing time */
  minutes: number;
  blocks: Block[];
}

export interface Track {
  slug: string;
  /** 0-based position in the path */
  order: number;
  title: string;
  /** short phrase shown under the title */
  tagline: string;
  /** what you will be able to do after this track */
  outcome: string;
  /** a short label used as the track badge, e.g. "JS", "TS", "N" */
  badge: string;
  /** css color used for the badge */
  color: string;
  lessons: Lesson[];
}
