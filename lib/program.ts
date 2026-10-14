/**
 * Builds the body of an async function that runs the learner's code
 * and returns one async function per test. Shared by the in-browser
 * worker and the content checker so both behave identically.
 */
export function buildProgram(userCode: string, tests: { code: string }[] = []): string {
  const testFns = tests.map((t) => `async () => {\n${t.code}\n}`).join(",\n");
  return `"use strict";\n${userCode}\n;return [${testFns}];`;
}

/** Strips TypeScript syntax so the code can run as plain JavaScript. */
export function stripTypes(code: string, transform: (code: string, opts: { transforms: ("typescript")[]; disableESTransforms: boolean; keepUnusedImports: boolean }) => { code: string }): string {
  return transform(code, {
    transforms: ["typescript"],
    disableESTransforms: true,
    keepUnusedImports: true,
  }).code;
}
