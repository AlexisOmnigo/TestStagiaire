import { CopyButton } from "./CopyButton";
import { Highlighted } from "./Highlighted";

const LANG_LABEL: Record<string, string> = {
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  bash: "Terminal",
  json: "JSON",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  graphql: "GraphQL",
  text: "Text",
};

export function CodeBlock({ code, lang, title }: { code: string; lang: string; title?: string }) {
  return (
    <figure className="code-block">
      <figcaption className="code-head">
        <span className="code-title">{title ?? LANG_LABEL[lang] ?? lang}</span>
        <span className="code-actions">
          {title && <span className="code-lang">{LANG_LABEL[lang] ?? lang}</span>}
          <CopyButton text={code} />
        </span>
      </figcaption>
      <pre className="code-pre">
        <code>
          <Highlighted code={code} lang={lang} />
        </code>
      </pre>
    </figure>
  );
}
