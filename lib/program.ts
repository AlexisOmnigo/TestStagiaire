/**
 * Helpers available to every snippet and test, LeetCode-style. They live in
 * an outer scope, so learner code can freely redeclare any of these names.
 */
export const PRELUDE = String.raw`
class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
/** [1,2,3] -> 1 -> 2 -> 3 (returns the head, or null for []) */
function toList(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
}
/** head of a linked list -> array of values (stops after 10,000 nodes to survive cycles) */
function fromList(head) {
  const out = [];
  while (head && out.length < 10000) { out.push(head.val); head = head.next; }
  return out;
}
/** level-order array (LeetCode format, null = missing child) -> root TreeNode */
function toTree(values) {
  if (!values.length || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let i = 1;
  while (queue.length && i < values.length) {
    const node = queue.shift();
    if (i < values.length && values[i] !== null) queue.push((node.left = new TreeNode(values[i])));
    i++;
    if (i < values.length && values[i] !== null) queue.push((node.right = new TreeNode(values[i])));
    i++;
  }
  return root;
}
/** root TreeNode -> level-order array (LeetCode format, trailing nulls trimmed) */
function fromTree(root) {
  const out = [];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    if (!node) { out.push(null); continue; }
    out.push(node.val);
    queue.push(node.left, node.right);
  }
  while (out.length && out[out.length - 1] === null) out.pop();
  return out;
}
/** structural equality for primitives, arrays, plain objects, Maps and Sets */
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (a instanceof Map || b instanceof Map) {
    if (!(a instanceof Map && b instanceof Map) || a.size !== b.size) return false;
    for (const [k, v] of a) if (!b.has(k) || !deepEqual(v, b.get(k))) return false;
    return true;
  }
  if (a instanceof Set || b instanceof Set) {
    if (!(a instanceof Set && b instanceof Set) || a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
  }
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k]));
}
/** same items in any order (items compared with deepEqual; nested arrays keep their own order) */
function sameMembers(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const key = (x) => JSON.stringify(x);
  const sa = a.map(key).sort(), sb = b.map(key).sort();
  return sa.every((x, i) => x === sb[i]);
}
`;

/**
 * Builds the body of an async function that runs the learner's code
 * and returns one async function per test. Shared by the in-browser
 * worker and the content checker so both behave identically.
 */
export function buildProgram(userCode: string, tests: { code: string }[] = []): string {
  const testFns = tests.map((t) => `async () => {\n${t.code}\n}`).join(",\n");
  return `"use strict";\n${PRELUDE}\nreturn (async () => {\n${userCode}\n;return [${testFns}];\n})();`;
}

/** Strips TypeScript syntax so the code can run as plain JavaScript. */
export function stripTypes(
  code: string,
  transform: (
    code: string,
    opts: { transforms: "typescript"[]; disableESTransforms: boolean; keepUnusedImports: boolean },
  ) => { code: string },
): string {
  return transform(code, {
    transforms: ["typescript"],
    disableESTransforms: true,
    keepUnusedImports: true,
  }).code;
}
