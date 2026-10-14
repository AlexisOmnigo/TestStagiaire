"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { progress, useProgress } from "@/lib/progress";

/** Remembers the last opened lesson for "continue where you left off". */
export function VisitTracker({ id }: { id: string }) {
  useEffect(() => progress.visit(id), [id]);
  return null;
}

export function CompleteButton({ id, nextHref, nextLabel }: { id: string; nextHref?: string; nextLabel?: string }) {
  const done = Boolean(useProgress().lessons[id]);
  const router = useRouter();
  return (
    <div className="complete">
      {done ? (
        <>
          <span className="complete-done">✓ Lesson completed</span>
          <button type="button" className="btn-ghost btn-xs" onClick={() => progress.setLessonDone(id, false)}>
            Undo
          </button>
          {nextHref && (
            <Link className="btn" href={nextHref}>
              Next: {nextLabel} →
            </Link>
          )}
        </>
      ) : (
        <button
          type="button"
          className="btn btn-lg"
          onClick={() => {
            progress.setLessonDone(id, true);
            if (nextHref) router.push(nextHref);
          }}
        >
          Mark complete{nextHref ? " & continue →" : ""}
        </button>
      )}
    </div>
  );
}

export function LessonDoneMark({ id }: { id: string }) {
  const done = Boolean(useProgress().lessons[id]);
  return done ? <span className="lesson-check" aria-label="completed">✓</span> : <span className="lesson-check empty" />;
}

export function TrackMeter({ ids }: { ids: string[] }) {
  const { lessons } = useProgress();
  const n = ids.filter((id) => lessons[id]).length;
  return (
    <div className="meter">
      <div className="bar">
        <div className="bar-fill" style={{ width: `${ids.length ? (n / ids.length) * 100 : 0}%` }} />
      </div>
      <span className="muted small">
        {n}/{ids.length} done
      </span>
    </div>
  );
}

export function ContinueLink({ titles, first }: { titles: Record<string, string>; first: string }) {
  const { last, lessons } = useProgress();
  const started = Object.keys(lessons).length > 0 || last;
  const target = last && titles[last] ? last : first;
  return (
    <Link href={`/learn/${target}`} className="btn btn-lg">
      {started ? `Continue: ${titles[target]}` : "Start from the beginning"} →
    </Link>
  );
}

export function ResetProgress() {
  return (
    <button
      type="button"
      className="btn-ghost btn-xs"
      onClick={() => {
        if (window.confirm("Reset all progress? Your code drafts are kept.")) progress.reset();
      }}
    >
      Reset progress
    </button>
  );
}
