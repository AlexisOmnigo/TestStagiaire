import type { Block } from "@/content/types";
import { Inline } from "@/lib/inline";
import { CodeBlock } from "./CodeBlock";
import { Playground } from "./Playground";
import { Challenge } from "./Challenge";
import { Quiz } from "./Quiz";

const CALLOUT_LABEL = { tip: "Tip", warn: "Watch out", info: "Good to know", stack: "In your stack" } as const;

export function LessonBlocks({ blocks, lessonKey }: { blocks: Block[]; lessonKey: string }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        const key = `${lessonKey}#${i}`;
        switch (b.type) {
          case "p":
            return (
              <p key={key}>
                <Inline text={b.text} />
              </p>
            );
          case "h":
            return <h2 key={key}>{b.text}</h2>;
          case "list": {
            const items = b.items.map((item, j) => (
              <li key={j}>
                <Inline text={item} />
              </li>
            ));
            return b.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
          }
          case "code":
            return <CodeBlock key={key} code={b.code} lang={b.lang} title={b.title} />;
          case "run":
            return <Playground key={key} code={b.code} lang={b.lang} title={b.title} draftKey={key} />;
          case "callout":
            return (
              <aside key={key} className={`callout callout-${b.tone}`}>
                <div className="callout-title">{b.title ?? CALLOUT_LABEL[b.tone]}</div>
                <div>
                  <Inline text={b.text} />
                </div>
              </aside>
            );
          case "compare":
            return (
              <div key={key} className="compare">
                <div>
                  <div className="compare-label">{b.left.label}</div>
                  <CodeBlock code={b.left.code} lang={b.left.lang} />
                </div>
                <div>
                  <div className="compare-label">{b.right.label}</div>
                  <CodeBlock code={b.right.code} lang={b.right.lang} />
                </div>
              </div>
            );
          case "steps":
            return (
              <ol key={key} className="steps">
                {b.items.map((s, j) => (
                  <li key={j}>
                    <span className="step-num">{j + 1}</span>
                    <div>
                      <div className="step-title">
                        <Inline text={s.title} />
                      </div>
                      <div className="step-text">
                        <Inline text={s.text} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            );
          case "table": {
            const [head, ...rows] = b.rows;
            return (
              <div key={key} className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      {head.map((c, j) => (
                        <th key={j}>
                          <Inline text={c} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          case "challenge":
            return <Challenge key={key} id={key} {...b} />;
          case "quiz":
            return <Quiz key={key} questions={b.questions} />;
        }
      })}
    </div>
  );
}
