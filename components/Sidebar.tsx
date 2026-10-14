"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useProgress } from "@/lib/progress";

export interface NavTrack {
  slug: string;
  title: string;
  badge: string;
  color: string;
  lessons: { slug: string; title: string }[];
}

export function Sidebar({ tracks }: { tracks: NavTrack[] }) {
  const pathname = usePathname();
  const { lessons: done } = useProgress();
  const [open, setOpen] = useState(false);
  const activeTrack = pathname.split("/")[2];
  const [expanded, setExpanded] = useState<string | undefined>(activeTrack);

  useEffect(() => {
    setOpen(false);
    if (activeTrack) setExpanded(activeTrack);
  }, [pathname, activeTrack]);

  const total = tracks.reduce((n, t) => n + t.lessons.length, 0);
  const completed = Object.keys(done).length;

  return (
    <>
      <header className="topbar">
        <button type="button" className="menu-btn" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span />
          <span />
          <span />
        </button>
        <Link href="/" className="brand">
          <span className="brand-mark">{"{ }"}</span> Dev Path
        </Link>
      </header>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <nav className={`sidebar ${open ? "is-open" : ""}`} aria-label="Course">
        <Link href="/" className="brand sidebar-brand">
          <span className="brand-mark">{"{ }"}</span> Dev Path
        </Link>
        <div className="side-progress">
          <div className="side-progress-label">
            <span>Your progress</span>
            <span>
              {completed}/{total}
            </span>
          </div>
          <div className="bar">
            <div className="bar-fill" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
          </div>
        </div>
        <ol className="side-tracks">
          {tracks.map((t, ti) => {
            const doneInTrack = t.lessons.filter((l) => done[`${t.slug}/${l.slug}`]).length;
            const isOpen = expanded === t.slug;
            return (
              <li key={t.slug} className={activeTrack === t.slug ? "is-active" : ""}>
                <button type="button" className="side-track" onClick={() => setExpanded(isOpen ? undefined : t.slug)} aria-expanded={isOpen}>
                  <span className="badge" style={{ "--c": t.color } as React.CSSProperties}>
                    {t.badge}
                  </span>
                  <span className="side-track-title">
                    <span className="muted small">{String(ti).padStart(2, "0")}</span> {t.title}
                  </span>
                  <span className={`side-count ${doneInTrack === t.lessons.length ? "full" : ""}`}>
                    {doneInTrack}/{t.lessons.length}
                  </span>
                </button>
                {isOpen && (
                  <ol className="side-lessons">
                    <li>
                      <Link href={`/learn/${t.slug}`} className={pathname === `/learn/${t.slug}` ? "is-current" : ""}>
                        <span className="dot dot-overview" /> Overview
                      </Link>
                    </li>
                    {t.lessons.map((l) => {
                      const href = `/learn/${t.slug}/${l.slug}`;
                      return (
                        <li key={l.slug}>
                          <Link href={href} className={pathname === href ? "is-current" : ""}>
                            <span className={`dot ${done[`${t.slug}/${l.slug}`] ? "dot-done" : ""}`} /> {l.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
