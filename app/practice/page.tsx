import type { Metadata } from "next";
import { allLessons } from "@/content";
import { PracticeList, type Problem } from "@/components/PracticeList";

export const metadata: Metadata = {
  title: "Practice",
  description: "Every coding problem in the course in one LeetCode-style list, filterable by difficulty, topic and status.",
};

export default function PracticePage() {
  const problems: Problem[] = allLessons.flatMap(({ track, lesson }) =>
    lesson.blocks.flatMap((b, i) =>
      b.type === "challenge"
        ? [
            {
              id: `${track.slug}/${lesson.slug}#${i}`,
              href: `/learn/${track.slug}/${lesson.slug}#challenge-${i}`,
              title: b.title,
              difficulty: b.difficulty,
              tags: b.tags ?? [],
              lang: b.lang ?? "js",
              track: { slug: track.slug, title: track.title, badge: track.badge, color: track.color },
              lesson: lesson.title,
            },
          ]
        : [],
    ),
  );
  const tracks = [...new Map(problems.map((p) => [p.track.slug, p.track])).values()];

  return (
    <div className="page">
      <h1>Practice</h1>
      <p className="lead">
        Every coding problem in the course, LeetCode-style. Algorithm problems have a difficulty; the rest are the hands-on
        challenges from each lesson. Each one opens inside its lesson, right after the concept it practises.
      </p>
      <PracticeList problems={problems} tracks={tracks} />
    </div>
  );
}
