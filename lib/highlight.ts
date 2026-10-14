/**
 * A deliberately small syntax highlighter. It is not a parser: it splits
 * code into tokens with one regex per language, which is plenty for
 * teaching snippets and keeps the app dependency-free.
 */
export type TokenKind = "comment" | "string" | "keyword" | "number" | "fn" | "type" | "tag" | "attr" | "prop" | "plain";
export interface Token {
  text: string;
  kind: TokenKind;
}

const JS_KEYWORDS = new Set(
  (
    "const let var function return if else for while do switch case default break continue new delete typeof instanceof in of " +
    "class extends super this import export from as async await try catch finally throw yield void null undefined true false " +
    "static get set type interface enum implements private public protected readonly declare namespace keyof infer satisfies is abstract"
  ).split(" "),
);
const SQL_KEYWORDS = new Set(
  (
    "select from where and or not insert into values update set delete create table alter drop add primary key foreign references " +
    "join left right inner outer on group by order having limit offset as distinct count sum avg min max null is in like " +
    "index unique default constraint returning policy enable row level security using with check for to grant revoke " +
    "begin commit rollback cascade function language returns uuid text integer int bigint numeric boolean timestamptz serial now auth"
  ).split(" "),
);
const BASH_COMMANDS = new Set(
  "npm npx pnpm yarn bun node git cd ls pwd mkdir rm mv cp cat echo touch curl export source sudo code nvm fnm vercel railway supabase tsc next brew grep which chmod".split(
    " ",
  ),
);
const GRAPHQL_KEYWORDS = new Set("query mutation subscription fragment on true false null".split(" "));

const STR = String.raw`"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`;
const TPL = String.raw`\x60(?:\\.|[^\x60\\])*\x60`;

const PATTERNS: Record<string, RegExp> = {
  js: new RegExp(
    String.raw`(\/\/.*|\/\*[\s\S]*?\*\/)|(${STR}|${TPL})|(<\/?[A-Za-z][\w.:-]*)|(\b\d[\d_]*(?:\.\d+)?n?\b)|([A-Za-z_$][\w$]*)`,
    "g",
  ),
  bash: new RegExp(String.raw`(#.*)|(${STR})|(\s--?[A-Za-z][\w-]*)|(\b\d+\b)|([A-Za-z_][\w.-]*)`, "g"),
  json: new RegExp(String.raw`(\/\/.*)|("(?:\\.|[^"\\\n])*"(?=\s*:))|(${STR})|(\b-?\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)`, "g"),
  sql: new RegExp(String.raw`(--.*)|('(?:''|[^'])*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)`, "g"),
  html: new RegExp(String.raw`(<!--[\s\S]*?-->)|(${STR})|(<\/?[A-Za-z][\w-]*|\/?>)|([A-Za-z-]+(?==))`, "g"),
  css: new RegExp(String.raw`(\/\*[\s\S]*?\*\/)|(${STR})|(@[\w-]+)|(-?\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|ms|s)?\b)|([a-z-]+(?=\s*:))`, "g"),
  graphql: new RegExp(String.raw`(#.*)|(${STR})|(\$[A-Za-z_]\w*)|(\b\d+\b)|([A-Za-z_]\w*)`, "g"),
};

function pattern(lang: string): RegExp | undefined {
  if (lang === "ts" || lang === "tsx" || lang === "jsx") return PATTERNS.js;
  return PATTERNS[lang];
}

export function highlight(code: string, lang: string): Token[] {
  const re = pattern(lang);
  if (!re) return [{ text: code, kind: "plain" }];
  const tokens: Token[] = [];
  let last = 0;
  re.lastIndex = 0;
  for (const m of code.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) tokens.push({ text: code.slice(last, start), kind: "plain" });
    tokens.push({ text: m[0], kind: classify(lang, m, code, start) });
    last = start + m[0].length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), kind: "plain" });
  return tokens;
}

function nextChar(code: string, from: number): string {
  const rest = code.slice(from).match(/^\s*(.)/);
  return rest ? rest[1] : "";
}

function classify(lang: string, m: RegExpMatchArray, code: string, start: number): TokenKind {
  const end = start + m[0].length;
  switch (lang) {
    case "js":
    case "ts":
    case "tsx":
    case "jsx": {
      if (m[1]) return "comment";
      if (m[2]) return "string";
      if (m[3]) {
        // "<" followed by a name is only a tag in JSX/TSX/HTML-ish code; in TS it can be a generic.
        if (lang === "tsx" || lang === "jsx") return "tag";
        return "plain";
      }
      if (m[4]) return "number";
      const word = m[5];
      if (JS_KEYWORDS.has(word)) return "keyword";
      if (nextChar(code, end) === "(") return "fn";
      if (/^[A-Z]/.test(word)) return "type";
      if (code[start - 1] === "." ) return "prop";
      return "plain";
    }
    case "bash": {
      if (m[1]) return "comment";
      if (m[2]) return "string";
      if (m[3]) return "attr";
      if (m[4]) return "number";
      return BASH_COMMANDS.has(m[5]) ? "fn" : "plain";
    }
    case "json":
      if (m[1]) return "comment";
      if (m[2]) return "prop";
      if (m[3]) return "string";
      if (m[4]) return "number";
      return "keyword";
    case "sql":
      if (m[1]) return "comment";
      if (m[2]) return "string";
      if (m[3]) return "number";
      if (SQL_KEYWORDS.has(m[4].toLowerCase())) return "keyword";
      return nextChar(code, end) === "(" ? "fn" : "plain";
    case "html":
      if (m[1]) return "comment";
      if (m[2]) return "string";
      if (m[3]) return "tag";
      return "attr";
    case "css":
      if (m[1]) return "comment";
      if (m[2]) return "string";
      if (m[3]) return "keyword";
      if (m[4]) return "number";
      return "prop";
    case "graphql": {
      if (m[1]) return "comment";
      if (m[2]) return "string";
      if (m[3]) return "attr";
      if (m[4]) return "number";
      const word = m[5];
      if (GRAPHQL_KEYWORDS.has(word)) return "keyword";
      if (/^[A-Z]/.test(word)) return "type";
      return nextChar(code, end) === "(" ? "fn" : "plain";
    }
  }
  return "plain";
}
