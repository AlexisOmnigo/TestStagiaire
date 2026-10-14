"use client";

import { useLayoutEffect, useRef, type KeyboardEvent } from "react";
import { Highlighted } from "./Highlighted";

/**
 * A lightweight code editor: a transparent <textarea> laid exactly over a
 * highlighted <pre>. Both wrap lines the same way, so they stay aligned
 * without syncing scroll positions.
 */
export function CodeEditor({
  value,
  onChange,
  lang,
  onRun,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  lang: string;
  onRun?: () => void;
  label: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  function edit(el: HTMLTextAreaElement, insert: string, from: number, to: number, caret: number) {
    const next = value.slice(0, from) + insert + value.slice(to);
    onChange(next);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = caret;
    });
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = el;
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.key === "Tab" && !e.shiftKey && start === end) {
      e.preventDefault();
      edit(el, "  ", start, end, start + 2);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !e.altKey && start === end) {
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const indent = value.slice(lineStart, start).match(/^\s*/)?.[0] ?? "";
      const extra = /[{[(]\s*$/.test(value.slice(lineStart, start)) ? "  " : "";
      if (!indent && !extra) return;
      e.preventDefault();
      const insert = "\n" + indent + extra;
      edit(el, insert, start, end, start + insert.length);
    }
  }

  return (
    <div className="editor">
      <pre className="editor-layer" aria-hidden="true">
        <Highlighted code={value} lang={lang} />
        {/* keeps a trailing newline visible */}
        {"\n"}
      </pre>
      <textarea
        ref={ref}
        className="editor-input"
        value={value}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
