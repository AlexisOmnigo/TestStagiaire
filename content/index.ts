import type { Lesson, Track } from "./types";
import { track as foundations } from "./tracks/00-foundations";
import { track as devEnvironment } from "./tracks/01-dev-environment";
import { track as javascriptBasics } from "./tracks/02-javascript-basics";
import { track as javascriptModern } from "./tracks/03-javascript-modern";
import { track as nextjs } from "./tracks/09-nextjs";
import { track as yourStack } from "./tracks/10-your-stack";
import { track as javascriptDeep } from "./tracks/04-javascript-deep";
import { track as algorithmsPatterns } from "./tracks/04a-algorithms-patterns";
import { track as algorithmsAdvanced } from "./tracks/04c-algorithms-advanced";
import { track as javascriptBrowser } from "./tracks/05-javascript-browser";
import { track as nodejs } from "./tracks/06-nodejs";
import { track as typescript } from "./tracks/07-typescript";
import { track as react } from "./tracks/08-react";

export type { Block, Lesson, Track } from "./types";

export const tracks: Track[] = [
  foundations,
  devEnvironment,
  javascriptBasics,
  javascriptModern,
  javascriptDeep,
  algorithmsPatterns,
  algorithmsAdvanced,
  javascriptBrowser,
  nodejs,
  typescript,
  react,
  nextjs,
  yourStack,
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
