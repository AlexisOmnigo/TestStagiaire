"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useProgress } from "@/lib/progress";

export interface Problem {
  id: string;
  href: string;
  title: string;
  difficulty?: "easy" | "medium" | "hard";
  tags: string[];
  lang: "js" | "ts";
  track: { slug: string; title: string; badge: string; color: string };
  lesson: string;
}

type Diff = "all" | "easy" | "medium" | "hard";
type Kind = "algorithms" | "all" | "lessons";
type Status = "all" | "todo" | "solved";

export function PracticeList({ problems, tracks }: { problems: Problem[]; tracks: Problem["track"][] }) {
  const { challenges } = useProgress();
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("algorithms");
  const [diff, setDiff] = useState<Diff>("all");
  const [status, setStatus] = useState<Status>("all");
  const [track, setTrack] = useState("all");
  const [tag, setTag] = useState("all");
  const [q, setQ] = useState("");

  const allTags = useMemo(() => [...new Set(problems.flatMap((p) => p.tags))].sort(), [problems]);

  const shown = problems.filter((p) => {
    if (kind === "algorithms" && !p.difficulty) return false;
    if (kind === "lessons" && p.difficulty) return false;
    if (diff !== "all" && p.difficulty !== diff) return false;
    if (track !== "all" && p.track.slug !== track) return false;
    if (tag !== "all" && !p.tags.includes(tag)) return false;
    const solved = Boolean(challenges[p.id]);
    if (status === "solved" && !solved) return false;
    if (status === "todo" && solved) return false;
    if (q && !`${p.title} ${p.lesson} ${p.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const algo = problems.filter((p) => p.difficulty);
  const count = (d: Problem["difficulty"]) => {
    const list = algo.filter((p) => p.difficulty === d);
    return `${list.filter((p) => challenges[p.id]).length}/${list.length}`;
  };
  const solvedTotal = problems.filter((p) => challenges[p.id]).length;

  function pickRandom() {
    const pool = shown.filter((p) => !challenges[p.id]);
    const list = pool.length ? pool : shown;
    if (list.length) router.push(list[Math.floor(Math.random() * list.length)].href);
  }

  return (
    <>
      <div className="practice-summary">
        <div className="practice-stat">
          <span className="muted small">Solved overall</span>
          <strong>
            {solvedTotal}/{problems.length}
          </strong>
        </div>
        <div className="practice-stat">
          <span className="diff diff-easy">easy</span>
          <strong>{count("easy")}</strong>
        </div>
        <div className="practice-stat">
          <span className="diff diff-medium">medium</span>
          <strong>{count("medium")}</strong>
        </div>
        <div className="practice-stat">
          <span className="diff diff-hard">hard</span>
          <strong>{count("hard")}</strong>
        </div>
      </div>

      <div className="practice-filters">
        <div className="seg" role="group" aria-label="Problem set">
          {(
            [
              ["algorithms", `Algorithms (${algo.length})`],
              ["lessons", `Lesson challenges (${problems.length - algo.length})`],
              ["all", "All"],
            ] as const
          ).map(([k, label]) => (
            <button key={k} type="button" className={kind === k ? "on" : ""} onClick={() => setKind(k)}>
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-sm" onClick={pickRandom}>
          🎲 Random unsolved
        </button>
      </div>
      <div className="practice-filters">
        <input type="search" placeholder="Search problems, topics…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={diff} onChange={(e) => setDiff(e.target.value as Diff)} aria-label="Difficulty">
          <option value="all">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select value={tag} onChange={(e) => setTag(e.target.value)} aria-label="Topic">
          <option value="all">Any topic</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Track">
          <option value="all">Any track</option>
          {tracks.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} aria-label="Status">
          <option value="all">Any status</option>
          <option value="todo">Unsolved</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      <div className="table-wrap">
        <table className="problem-table">
          <thead>
            <tr>
              <th aria-label="Status" />
              <th>Problem</th>
              <th>Difficulty</th>
              <th className="hide-sm">Topic</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((p) => (
              <tr key={p.id}>
                <td className="status">{challenges[p.id] ? "✓" : ""}</td>
                <td>
                  <Link href={p.href}>{p.title}</Link>
                  <div className="muted small">
                    {p.track.title} · {p.lesson}
                  </div>
                </td>
                <td>
                  {p.difficulty ? <span className={`diff diff-${p.difficulty}`}>{p.difficulty}</span> : <span className="muted small">lesson</span>}
                </td>
                <td className="hide-sm">
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={4} className="muted">
                  No problems match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
