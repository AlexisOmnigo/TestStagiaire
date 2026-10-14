"use client";

import { useSyncExternalStore } from "react";

/**
 * Progress lives in localStorage: it is per-browser, needs no account,
 * and survives reloads. A tiny external store keeps every component that
 * shows progress (sidebar, home, lesson footer) in sync.
 */

export interface ProgressState {
  /** lessonId -> ISO date completed */
  lessons: Record<string, string>;
  /** `${lessonId}#${blockIndex}` -> true when the challenge passed */
  challenges: Record<string, true>;
  /** last lesson opened, for "continue where you left off" */
  last?: string;
}

const KEY = "devpath:progress:v1";
const EMPTY: ProgressState = { lessons: {}, challenges: {} };

let state: ProgressState = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    // storage unavailable (private mode, blocked) — progress just won't persist
  }
}

function save(next: ProgressState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    state = EMPTY;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export const progress = {
  setLessonDone(id: string, done: boolean) {
    const lessons = { ...state.lessons };
    if (done) lessons[id] = new Date().toISOString();
    else delete lessons[id];
    save({ ...state, lessons });
  },
  setChallengePassed(id: string) {
    if (state.challenges[id]) return;
    save({ ...state, challenges: { ...state.challenges, [id]: true } });
  },
  visit(id: string) {
    if (state.last === id) return;
    save({ ...state, last: id });
  },
  reset() {
    save(EMPTY);
  },
};

/** Per-block code drafts so learners don't lose work on reload. */
export const drafts = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(`devpath:draft:${key}`);
    } catch {
      return null;
    }
  },
  set(key: string, code: string) {
    try {
      window.localStorage.setItem(`devpath:draft:${key}`, code);
    } catch {
      // ignore
    }
  },
  clear(key: string) {
    try {
      window.localStorage.removeItem(`devpath:draft:${key}`);
    } catch {
      // ignore
    }
  },
};
