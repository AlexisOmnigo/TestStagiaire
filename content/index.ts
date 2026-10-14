import type { Lesson, Track } from "./types";
import { track as foundations } from "./tracks/00-foundations";
import { track as devEnvironment } from "./tracks/01-dev-environment";
import { track as javascriptBasics } from "./tracks/02-javascript-basics";
import { track as javascriptBrowser } from "./tracks/05-javascript-browser";

export type { Block, Lesson, Track } from "./types";

export const tracks: Track[] = [
  foundations,
  devEnvironment,
  javascriptBasics,
  javascriptBrowser,
].sort((a, b) => a.order - b.order);

export function getTrack(slug: string): Track | undefined {
  return tracks.find((t) => t.slug === slug);
}

export function getLesson(trackSlug: string, lessonSlug: string): Lesson | undefined {
  return getTrack(trackSlug)?.lessons.find((l) => l.slug === lessonSlug);
}

/** A stable id used for progress tracking. */
export const lessonId = (track: Track, lesson: Lesson) => `${track.slug}/${lesson.slug}`;

/** Every lesson in path order, with its track. */
export const allLessons = tracks.flatMap((track) => track.lessons.map((lesson) => ({ track, lesson })));

export function neighbours(trackSlug: string, lessonSlug: string) {
  const i = allLessons.findIndex((x) => x.track.slug === trackSlug && x.lesson.slug === lessonSlug);
  return { prev: allLessons[i - 1], next: allLessons[i + 1] };
}

export const totalMinutes = allLessons.reduce((sum, x) => sum + x.lesson.minutes, 0);
