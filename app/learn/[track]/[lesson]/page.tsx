import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allLessons, getLesson, getTrack, neighbours, tracks } from "@/content";
import { Inline } from "@/lib/inline";
import { LessonBlocks } from "@/components/LessonBlocks";
import { CompleteButton, VisitTracker } from "@/components/ProgressBits";

type Params = Promise<{ track: string; lesson: string }>;

export function generateStaticParams() {
  return allLessons.map(({ track, lesson }) => ({ track: track.slug, lesson: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { track, lesson } = await params;
  const l = getLesson(track, lesson);
  return { title: l?.title, description: l?.summary };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { track: trackSlug, lesson: lessonSlug } = await params;
  const track = getTrack(trackSlug);
  const lesson = getLesson(trackSlug, lessonSlug);
  if (!track || !lesson) notFound();

  const id = `${track.slug}/${lesson.slug}`;
  const { prev, next } = neighbours(track.slug, lesson.slug);
  const position = track.lessons.indexOf(lesson) + 1;
  const trackIndex = tracks.indexOf(track);

  return (
    <article className="page lesson">
      <VisitTracker id={id} />
      <div className="crumbs">
        <Link href="/">Path</Link> <span>/</span>
        <Link href={`/learn/${track.slug}`}>
          {String(trackIndex).padStart(2, "0")} · {track.title}
        </Link>
        <span>/</span> <span>
          Lesson {position} of {track.lessons.length}
        </span>
      </div>
      <header className="lesson-head">
        <span className="badge" style={{ "--c": track.color } as React.CSSProperties}>
          {track.badge}
        </span>
        <h1>{lesson.title}</h1>
        <p className="lead">
          <Inline text={lesson.summary} />
        </p>
        <span className="muted small">~{lesson.minutes} min</span>
      </header>

      <LessonBlocks blocks={lesson.blocks} lessonKey={id} />

      <CompleteButton
        id={id}
        nextHref={next ? `/learn/${next.track.slug}/${next.lesson.slug}` : undefined}
        nextLabel={next?.lesson.title}
      />

      <nav className="pager">
        {prev ? (
          <Link href={`/learn/${prev.track.slug}/${prev.lesson.slug}`} className="pager-link">
            <span className="muted small">← Previous</span>
            <span>{prev.lesson.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/learn/${next.track.slug}/${next.lesson.slug}`} className="pager-link right">
            <span className="muted small">{next.track.slug !== track.slug ? `Next track: ${next.track.title}` : "Next"} →</span>
            <span>{next.lesson.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
