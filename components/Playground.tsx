"use client";

import { useEffect, useRef, useState } from "react";
import { runCode, type LogLine, type RunHandle } from "@/lib/runner";
import { drafts } from "@/lib/progress";
import { CodeEditor } from "./CodeEditor";

export function Output({ logs, error, running, ms }: { logs: LogLine[]; error?: string; running: boolean; ms?: number }) {
  const empty = !logs.length && !error;
  return (
    <div className="output" role="log" aria-live="polite">
      <div className="output-head">
        <span>Output</span>
        <span className="muted">{running ? "running…" : ms !== undefined ? `${ms} ms` : ""}</span>
      </div>
      <div className="output-body">
        {empty && !running && <div className="muted">Nothing logged yet. Use console.log() to print values.</div>}
        {logs.map((l, i) => (
          <div key={i} className={`out-line out-${l.level}`}>
            {l.text}
          </div>
        ))}
        {error && <div className="out-line out-error">✖ {error}</div>}
      </div>
    </div>
  );
}

export function useRunner() {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string>();
  const [ms, setMs] = useState<number>();
  const handle = useRef<RunHandle | null>(null);

  useEffect(() => () => handle.current?.stop(), []);

  async function run(code: string, lang: "js" | "ts", tests?: { code: string }[]) {
    handle.current?.stop();
    setLogs([]);
    setError(undefined);
    setMs(undefined);
    setRunning(true);
    const h = runCode({ code, lang, tests, onLog: (line) => setLogs((prev) => [...prev, line].slice(-500)) });
    handle.current = h;
    const outcome = await h.done;
    if (handle.current !== h) return null;
    setRunning(false);
    setError(outcome.error === "Stopped." ? undefined : outcome.error);
    setMs(outcome.ms);
    return outcome;
  }

  function stop() {
    handle.current?.stop();
    setRunning(false);
  }

  return { logs, running, error, ms, run, stop };
}

export function Playground({
  code: initial,
  lang = "js",
  title,
  draftKey,
}: {
  code: string;
  lang?: "js" | "ts";
  title?: string;
  draftKey: string;
}) {
  const [code, setCode] = useState(initial);
  const { logs, running, error, ms, run, stop } = useRunner();

  useEffect(() => {
    const saved = drafts.get(draftKey);
    if (saved !== null && saved !== initial) setCode(saved);
  }, [draftKey, initial]);

  function change(v: string) {
    setCode(v);
    drafts.set(draftKey, v);
  }

  return (
    <section className="playground">
      <div className="pg-head">
        <span className="pg-title">
          <span className="pill">{lang === "ts" ? "TS" : "JS"}</span> {title ?? "Try it — edit and run"}
        </span>
        <span className="pg-actions">
          {code !== initial && (
            <button
              type="button"
              className="btn-ghost btn-xs"
              onClick={() => {
                setCode(initial);
                drafts.clear(draftKey);
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
            <button type="button" className="btn btn-sm" onClick={() => run(code, lang)} title="Ctrl/⌘ + Enter">
              ▶ Run
            </button>
          )}
        </span>
      </div>
      <CodeEditor value={code} onChange={change} lang={lang} onRun={() => run(code, lang)} label={title ?? "Code playground"} />
      {(running || logs.length > 0 || error || ms !== undefined) && <Output logs={logs} error={error} running={running} ms={ms} />}
    </section>
  );
}
