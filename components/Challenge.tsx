"use client";

import { useEffect, useState } from "react";
import type { TestResult } from "@/lib/runner";
import { drafts, progress, useProgress } from "@/lib/progress";
import { CodeEditor } from "./CodeEditor";
import { Highlighted } from "./Highlighted";
import { Output, useRunner } from "./Playground";
import { Inline } from "@/lib/inline";

export function Challenge({
  id,
  title,
  prompt,
  starter,
  solution,
  tests,
  hint,
  lang = "js",
}: {
  id: string;
  title: string;
  prompt: string;
  starter: string;
  solution: string;
  tests: { name: string; code: string }[];
  hint?: string;
  lang?: "js" | "ts";
}) {
  const [code, setCode] = useState(starter);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const { logs, running, error, ms, run, stop } = useRunner();
  const passedBefore = Boolean(useProgress().challenges[id]);

  useEffect(() => {
    const saved = drafts.get(id);
    if (saved !== null) setCode(saved);
  }, [id]);

  function change(v: string) {
    setCode(v);
    drafts.set(id, v);
  }

  async function check() {
    setResults(null);
    const outcome = await run(code, lang, tests);
    if (!outcome) return;
    setAttempts((a) => a + 1);
    if (outcome.error) {
      setResults(tests.map(() => ({ pass: false, error: "code did not finish running" })));
      return;
    }
    setResults(outcome.results);
    if (outcome.results.length === tests.length && outcome.results.every((r) => r.pass)) {
      progress.setChallengePassed(id);
    }
  }

  const passCount = results?.filter((r) => r.pass).length ?? 0;
  const allPass = results !== null && passCount === tests.length;

  return (
    <section className={`challenge ${allPass ? "is-pass" : ""}`}>
      <div className="challenge-head">
        <span className="challenge-kicker">Challenge{passedBefore && " · solved ✓"}</span>
        <h3>{title}</h3>
        <p>
          <Inline text={prompt} />
        </p>
      </div>
      <div className="pg-head">
        <span className="pg-title">
          <span className="pill">{lang === "ts" ? "TS" : "JS"}</span> Your solution
        </span>
        <span className="pg-actions">
          {code !== starter && (
            <button
              type="button"
              className="btn-ghost btn-xs"
              onClick={() => {
                setCode(starter);
                drafts.clear(id);
                setResults(null);
              }}
            >
              Reset
            </button>
          )}
          {running ? (
            <button type="button" className="btn btn-sm btn-danger" onClick={stop}>
              Stop
            </button>
          ) : (
            <button type="button" className="btn btn-sm" onClick={check} title="Ctrl/⌘ + Enter">
              ✓ Run tests
            </button>
          )}
        </span>
      </div>
      <CodeEditor value={code} onChange={change} lang={lang} onRun={check} label={`Challenge: ${title}`} />

      <ul className="tests">
        {tests.map((t, i) => {
          const r = results?.[i];
          return (
            <li key={t.name} className={r ? (r.pass ? "test-pass" : "test-fail") : "test-idle"}>
              <span className="test-icon">{r ? (r.pass ? "✓" : "✗") : "○"}</span>
              <span>
                <Inline text={t.name} />
                {r && !r.pass && r.error && <span className="test-err"> — {r.error}</span>}
              </span>
            </li>
          );
        })}
      </ul>

      {results && (
        <div className={`verdict ${allPass ? "verdict-pass" : "verdict-fail"}`}>
          {allPass ? "All tests pass. Nice work!" : `${passCount} / ${tests.length} tests passing. Keep going.`}
        </div>
      )}

      {(logs.length > 0 || error) && <Output logs={logs} error={error} running={running} ms={ms} />}

      <div className="challenge-help">
        {hint && (
          <button type="button" className="btn-ghost btn-xs" onClick={() => setShowHint((s) => !s)}>
            {showHint ? "Hide hint" : "Hint"}
          </button>
        )}
        {(attempts > 0 || passedBefore) && (
          <button type="button" className="btn-ghost btn-xs" onClick={() => setShowSolution((s) => !s)}>
            {showSolution ? "Hide solution" : "Show a solution"}
          </button>
        )}
        {attempts === 0 && !passedBefore && <span className="muted small">Run the tests once to unlock the solution.</span>}
      </div>
      {showHint && hint && (
        <div className="hint">
          <Inline text={hint} />
        </div>
      )}
      {showSolution && (
        <div className="solution">
          <div className="solution-head">
            <span>One possible solution</span>
            <button type="button" className="btn-ghost btn-xs" onClick={() => change(solution)}>
              Load into editor
            </button>
          </div>
          <pre className="code-pre">
            <code>
              <Highlighted code={solution} lang={lang} />
            </code>
          </pre>
        </div>
      )}
    </section>
  );
}
