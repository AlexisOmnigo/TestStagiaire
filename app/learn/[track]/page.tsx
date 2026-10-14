import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrack, tracks } from "@/content";
import { Inline } from "@/lib/inline";
import { LessonDoneMark, TrackMeter } from "@/components/ProgressBits";

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }): Promise<Metadata> {
  const track = getTrack((await params).track);
  return { title: track?.title, description: track?.outcome };
}

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const track = getTrack((await params).track);
  if (!track) notFound();
  const index = tracks.indexOf(track);
  const prev = tracks[index - 1];
  const next = tracks[index + 1];
  const minutes = track.lessons.reduce((s, l) => s + l.minutes, 0);
  const counts = track.lessons.reduce(
    (acc, l) => {
      for (const b of l.blocks) {
        if (b.type === "run") acc.run++;
        if (b.type === "challenge") acc.challenge++;
      }
      return acc;
    },
    { run: 0, challenge: 0 },
  );

  return (
    <article className="page">
      <div className="crumbs">
        <Link href="/">Path</Link> <span>/</span> <span>Track {String(index).padStart(2, "0")}</span>
      </div>
      <header className="track-hero">
        <span className="badge badge-lg" style={{ "--c": track.color } as React.CSSProperties}>
          {track.badge}
        </span>
        <div>
          <h1>{track.title}</h1>
          <p className="lead">{track.tagline}</p>
        </div>
      </header>
      <div className="outcome">
        <span className="outcome-label">By the end you will</span>
        <p>
          <Inline text={track.outcome} />
        </p>
        <div className="stats">
          <span>{track.lessons.length} lessons</span>
          <span>~{Math.round(minutes / 5) * 5} min</span>
          <span>{counts.run} playgrounds</span>
          <span>{counts.challenge} challenges</span>
        </div>
        <TrackMeter ids={track.lessons.map((l) => `${track.slug}/${l.slug}`)} />
      </div>

      <ol className="lesson-list">
        {track.lessons.map((l, i) => (
          <li key={l.slug}>
            <Link href={`/learn/${track.slug}/${l.slug}`} className="lesson-row">
              <span className="lesson-num">{i + 1}</span>
              <span className="lesson-info">
                <span className="lesson-title">{l.title}</span>
                <span className="lesson-summary">
                  <Inline text={l.summary} />
                </span>
              </span>
              <span className="muted small nowrap">{l.minutes} min</span>
              <LessonDoneMark id={`${track.slug}/${l.slug}`} />
            </Link>
          </li>
        ))}
      </ol>

      <nav className="pager">
        {prev ? (
          <Link href={`/learn/${prev.slug}`} className="pager-link">
            <span className="muted small">← Previous track</span>
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/learn/${next.slug}`} className="pager-link right">
            <span className="muted small">Next track →</span>
            <span>{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
