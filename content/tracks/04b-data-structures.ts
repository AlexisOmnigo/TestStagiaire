import type { Track } from "../types";

export const track: Track = {
  slug: "data-structures",
  order: 4.2,
  title: "Data Structures",
  tagline: "Stacks, queues, lists, trees and heaps — the LeetCode toolbox",
  outcome:
    "Recognise which data structure a problem is asking for, implement stacks, queues, linked lists, trees and heaps from scratch in JavaScript, and solve 45+ classic LeetCode problems with them — from Valid Parentheses to Median of Two Sorted Arrays.",
  badge: "DS",
  color: "#14b8a6",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Stacks & queues
    // ─────────────────────────────────────────────────────────────
    {
      slug: "stacks-and-queues",
      title: "Stacks & queues",
      summary: "Last-in-first-out and first-in-first-out: the two simplest structures, and the monotonic stack trick that solves a whole family of 'next greater' problems.",
      minutes: 50,
      blocks: [
        {
          type: "p",
          text: "A **stack** is a pile of plates: you add on top and take from the top. Last in, first out (**LIFO**). A **queue** is the line at a café: you join at the back and leave from the front. First in, first out (**FIFO**). They sound trivial, but an enormous number of interview problems are \"spot that this is secretly a stack\".",
        },
        {
          type: "callout",
          tone: "info",
          title: "LeetCode-style helpers are predefined",
          text: "Like on LeetCode, `ListNode` and `TreeNode` already exist in every code box of this track, along with `toList([1,2,3])` (array → linked list head), `fromList(head)` (back to an array), `toTree([3,9,20,null,null,15,7])` / `fromTree(root)` (LeetCode's level-order format), `deepEqual(a, b)` and `sameMembers(a, b)`. Tests use them; you can too. Redeclaring them in your own code is allowed.",
        },
        { type: "h", text: "When to reach for a stack" },
        {
          type: "list",
          items: [
            "**Matching pairs / nesting**: brackets, HTML tags, nested JSON — the most recently opened thing must close first.",
            "**\"Most recent\"** anything: undo history, browser back button, the call stack of your own program.",
            "**\"Next greater / next smaller element\"**, \"how many days until…\", \"span\", \"largest rectangle\" — that's a *monotonic* stack (end of this lesson).",
            "**Evaluating expressions**: calculators, Reverse Polish Notation, decoding `3[ab]`-style strings.",
          ],
        },
        { type: "h", text: "A JavaScript array is already a great stack" },
        {
          type: "table",
          rows: [
            ["Operation", "Array method", "Cost", "Why"],
            ["push on top", "`stack.push(x)`", "O(1) amortized", "Writes one slot at the end (occasionally the array grows its storage)"],
            ["pop from top", "`stack.pop()`", "O(1)", "Removes the last slot, nothing else moves"],
            ["peek top", "`stack[stack.length - 1]` or `stack.at(-1)`", "O(1)", "Just an index read"],
            ["remove from front", "`queue.shift()`", "**O(n)**", "Every remaining element moves down one index"],
            ["add to front", "`queue.unshift(x)`", "**O(n)**", "Every element moves up one index"],
          ],
        },
        { type: "h", text: "Why shift() is O(n) — and an O(1) queue" },
        {
          type: "p",
          text: "An array is a block of numbered slots. The spec says `shift()` must return element `0` and then make the old element `1` the new `0`, `2` the new `1`, and so on: on an array of 50,000 leads, that's 49,999 moves for *one* dequeue. Engines sometimes cheat for small arrays, but on large ones (V8 in Chrome and Node included) the cost is real. Do it in a loop and your O(n) BFS silently becomes O(n²).",
        },
        {
          type: "p",
          text: "The fix is simple: never move anything. Keep a `head` index that points at the front, and only advance it. Run this to measure the difference on your machine:",
        },
        {
          type: "run",
          title: "shift() vs a head-index queue",
          code: `class Queue {
  constructor() { this.items = []; this.head = 0; }
  enqueue(x) { this.items.push(x); }
  dequeue() {
    if (this.head === this.items.length) return undefined;
    const x = this.items[this.head];
    this.items[this.head] = undefined; // let the garbage collector free it
    this.head++;
    // compact once the dead prefix is large, so memory doesn't grow forever
    if (this.head > 1024 && this.head * 2 > this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    return x;
  }
  peek() { return this.items[this.head]; }
  get size() { return this.items.length - this.head; }
}

const N = 20000;

// 1) plain array + shift()
let arr = Array.from({ length: N }, (_, i) => "lead-" + i);
let t0 = performance.now();
while (arr.length) arr.shift();
console.log("array.shift():", (performance.now() - t0).toFixed(1), "ms");

// 2) head-index queue
const q = new Queue();
for (let i = 0; i < N; i++) q.enqueue("lead-" + i);
t0 = performance.now();
while (q.size) q.dequeue();
console.log("Queue.dequeue():", (performance.now() - t0).toFixed(1), "ms");

// FIFO order check
const support = new Queue();
support.enqueue("ticket #101");
support.enqueue("ticket #102");
support.enqueue("ticket #103");
console.log(support.dequeue(), support.dequeue(), "| still waiting:", support.size);`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "In interviews",
          text: "For small inputs `shift()` is fine and everyone uses it. When the input can reach 10⁵ items, say out loud \"shift is O(n), so I'll use a head pointer\" — it's a cheap way to show you understand what the array is doing.",
        },
        { type: "h", text: "Worked example: matching brackets" },
        {
          type: "p",
          text: "Is `{[()]}` balanced? Every closer must match the **most recent** unmatched opener — \"most recent\" is the stack signal. Push openers; on a closer, pop and check it matches.",
        },
        {
          type: "table",
          rows: [
            ["Char", "Action", "Stack after"],
            ["`{`", "opener → push", "`{`"],
            ["`[`", "opener → push", "`{ [`"],
            ["`(`", "opener → push", "`{ [ (`"],
            ["`)`", "pop `(` — matches ✓", "`{ [`"],
            ["`]`", "pop `[` — matches ✓", "`{`"],
            ["`}`", "pop `{` — matches ✓", "(empty)"],
            ["end", "stack empty → balanced", ""],
          ],
        },
        {
          type: "run",
          title: "reference implementation with tracing",
          code: `function isBalanced(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      const top = stack.pop();
      if (top !== pairs[ch]) {
        console.log("  " + ch + " does not match " + top + " → unbalanced");
        return false;
      }
    }
    console.log("  after " + ch + ": [" + stack.join(" ") + "]");
  }
  return stack.length === 0; // leftovers = openers never closed
}

for (const input of ["{[()]}", "([)]", "(("]) {
  console.log(input);
  console.log("→", isBalanced(input));
}`,
        },
        {
          type: "compare",
          left: {
            label: "Brute force — O(n²) time",
            lang: "js",
            code: `// Repeatedly delete "()", "[]", "{}" until
// nothing changes. Each pass is O(n) and
// there can be n/2 passes.
function isValid(s) {
  let prev;
  do {
    prev = s;
    s = s.replace("()", "")
         .replace("[]", "")
         .replace("{}", "");
  } while (s !== prev);
  return s === "";
}`,
          },
          right: {
            label: "Stack — O(n) time, O(n) space",
            lang: "js",
            code: `// One pass. Each char is pushed and
// popped at most once.
function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (!(ch in pairs)) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
          },
        },
        {
          type: "challenge",
          title: "Valid Parentheses",
          difficulty: "easy",
          tags: ["stack", "string"],
          prompt: "Given a string `s` made only of the characters `()[]{}`, return `true` if every bracket is closed by the same type of bracket, in the correct order, and every closer has a matching opener. Otherwise return `false`.",
          examples: [
            { input: 's = "()[]{}"', output: "true" },
            { input: 's = "([)]"', output: "false", explanation: "`)` arrives while `[` is the most recent opener." },
            { input: 's = "{[]}"', output: "true" },
          ],
          constraints: ["1 <= s.length <= 10^5", "s contains only ()[]{}"],
          complexity: "O(n) time, O(n) space",
          starter: `function isValid(s) {
  // your code here
}`,
          solution: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (!(ch in pairs)) stack.push(ch);
    else if (stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}`,
          tests: [
            { name: 'example: "()[]{}" → true', code: 'return isValid("()[]{}") === true;' },
            { name: 'wrong order: "([)]" → false', code: 'return isValid("([)]") === false;' },
            { name: 'nested: "{[]}" → true', code: 'return isValid("{[]}") === true;' },
            { name: 'unclosed opener "((" and lonely closer "]" → false', code: 'return isValid("((") === false && isValid("]") === false;' },
            {
              name: "fast on 100,000 nested brackets (O(n) needed)",
              code: `const s = "(".repeat(50000) + ")".repeat(50000);
const t0 = performance.now();
const ok = isValid(s) === true && isValid(s + "(") === false;
return ok && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Push every opener. When you see a closer, the stack's top must be its matching opener. At the end, is anything left on the stack?",
        },
        {
          type: "p",
          text: "Next twist: a stack that also knows its minimum in O(1). The insight: the minimum only changes when you push or pop, so **store the minimum-so-far alongside each element**. When you pop, the previous minimum is right there underneath.",
        },
        {
          type: "challenge",
          title: "Min Stack",
          difficulty: "medium",
          tags: ["stack", "design"],
          prompt: "Design a class `MinStack` with `push(val)`, `pop()` (removes the top, returns nothing), `top()` (returns the top value) and `getMin()` (returns the smallest value currently in the stack). **Every method must run in O(1).** `pop`, `top` and `getMin` are only called on a non-empty stack.",
          examples: [
            {
              input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()",
              output: "-3, 0, -2",
              explanation: "After popping -3, the minimum goes back to -2.",
            },
          ],
          constraints: ["-2^31 <= val <= 2^31 - 1", "up to 10^5 calls"],
          complexity: "O(1) per operation, O(n) space",
          starter: `class MinStack {
  constructor() {
    // your code here
  }
  push(val) {}
  pop() {}
  top() {}
  getMin() {}
}`,
          solution: `class MinStack {
  constructor() {
    this.stack = []; // each entry: [value, minimum so far]
  }
  push(val) {
    const min = this.stack.length ? Math.min(val, this.getMin()) : val;
    this.stack.push([val, min]);
  }
  pop() {
    this.stack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1][0];
  }
  getMin() {
    return this.stack[this.stack.length - 1][1];
  }
}`,
          tests: [
            {
              name: "example: push -2, 0, -3 → min -3; pop → top 0, min -2",
              code: `const s = new MinStack();
s.push(-2); s.push(0); s.push(-3);
const a = s.getMin();
s.pop();
return a === -3 && s.top() === 0 && s.getMin() === -2;`,
            },
            {
              name: "duplicate minimums survive a pop",
              code: `const s = new MinStack();
s.push(1); s.push(1); s.push(2);
s.pop(); s.pop();
return s.getMin() === 1 && s.top() === 1;`,
            },
            {
              name: "single element is both top and min",
              code: "const s = new MinStack(); s.push(42); return s.top() === 42 && s.getMin() === 42;",
            },
            {
              name: "fast: 50,000 pushes and pops with getMin after each (O(1) needed)",
              code: `const s = new MinStack();
const n = 50000;
const t0 = performance.now();
let ok = true;
for (let i = n; i > 0; i--) { s.push(i); if (s.getMin() !== i) ok = false; }
for (let i = 1; i < n; i++) { s.pop(); if (s.getMin() !== i + 1) ok = false; }
return ok && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Store pairs `[value, minSoFar]`. The min-so-far for a new element is `Math.min(val, current min)`.",
        },
        {
          type: "p",
          text: "Stacks also evaluate expressions. In **Reverse Polish Notation** the operator comes *after* its two operands: `3 4 +` means `3 + 4`. Push numbers; when you meet an operator, pop two values, compute, push the result. Watch the order: the first pop is the **right** operand.",
        },
        {
          type: "challenge",
          title: "Evaluate Reverse Polish Notation",
          difficulty: "medium",
          tags: ["stack", "math"],
          prompt: "You get an array of string `tokens` forming a valid Reverse Polish Notation expression with the operators `+`, `-`, `*` and `/`. Return its integer value. Division between two integers **truncates toward zero** (so `7 / -2` is `-3`). Numbers can be negative, like `\"-11\"`.",
          examples: [
            { input: 'tokens = ["2","1","+","3","*"]', output: "9", explanation: "(2 + 1) * 3" },
            { input: 'tokens = ["4","13","5","/","+"]', output: "6", explanation: "4 + (13 / 5) = 4 + 2" },
          ],
          constraints: ["1 <= tokens.length <= 10^4", "the expression is always valid", "no division by zero"],
          complexity: "O(n) time, O(n) space",
          starter: `function evalRPN(tokens) {
  // your code here
}`,
          solution: `function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if (t === "+" || t === "-" || t === "*" || t === "/") {
      const b = stack.pop(); // right operand comes off first
      const a = stack.pop();
      if (t === "+") stack.push(a + b);
      else if (t === "-") stack.push(a - b);
      else if (t === "*") stack.push(a * b);
      else stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}`,
          tests: [
            { name: '["2","1","+","3","*"] → 9', code: 'return evalRPN(["2","1","+","3","*"]) === 9;' },
            { name: '["4","13","5","/","+"] → 6', code: 'return evalRPN(["4","13","5","/","+"]) === 6;' },
            {
              name: "long example with a negative number → 22",
              code: 'return evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) === 22;',
            },
            { name: 'division truncates toward zero: ["7","-2","/"] → -3', code: 'return evalRPN(["7","-2","/"]) === -3;' },
            { name: 'operand order matters: ["5","8","-"] → -3', code: 'return evalRPN(["5","8","-"]) === -3;' },
            { name: 'a single number: ["42"] → 42', code: 'return evalRPN(["42"]) === 42;' },
          ],
          hint: "Pop `b` first, then `a`, and compute `a op b`. `Math.floor` rounds -3.5 down to -4 — which function rounds toward zero instead?",
        },
        {
          type: "p",
          text: "Here's the classic trick to build an amortized O(1) queue from two stacks: push into an `in` stack; to dequeue, pop from an `out` stack, and **only when `out` is empty** pour everything from `in` into it (which reverses the order — oldest on top). Each element is moved at most once, so n operations cost O(n) total.",
        },
        {
          type: "challenge",
          title: "Implement Queue using Stacks",
          difficulty: "easy",
          tags: ["stack", "queue", "design"],
          prompt: "Implement a FIFO queue `MyQueue` using only stack operations on arrays (`push`, `pop`, `length`, reading the last element). Methods: `push(x)` adds to the back, `pop()` removes and returns the front, `peek()` returns the front without removing it, `empty()` returns `true` if the queue is empty. `pop` and `peek` are only called when the queue is non-empty.",
          examples: [
            { input: "push(1), push(2), peek(), pop(), empty()", output: "1, 1, false" },
          ],
          constraints: ["1 <= x <= 9", "at most 100 calls (but aim for amortized O(1))"],
          complexity: "amortized O(1) per operation",
          starter: `class MyQueue {
  constructor() {
    // your code here
  }
  push(x) {}
  pop() {}
  peek() {}
  empty() {}
}`,
          solution: `class MyQueue {
  constructor() {
    this.in = [];
    this.out = [];
  }
  push(x) {
    this.in.push(x);
  }
  #refill() {
    if (this.out.length === 0) {
      while (this.in.length) this.out.push(this.in.pop());
    }
  }
  pop() {
    this.#refill();
    return this.out.pop();
  }
  peek() {
    this.#refill();
    return this.out[this.out.length - 1];
  }
  empty() {
    return this.in.length === 0 && this.out.length === 0;
  }
}`,
          tests: [
            {
              name: "example: push 1, 2 → peek 1, pop 1, not empty",
              code: `const q = new MyQueue();
q.push(1); q.push(2);
return q.peek() === 1 && q.pop() === 1 && q.empty() === false;`,
            },
            {
              name: "a new queue is empty",
              code: "return new MyQueue().empty() === true;",
            },
            {
              name: "interleaved: push 1, 2, pop, push 3, pop, pop → 1, 2, 3",
              code: `const q = new MyQueue();
q.push(1); q.push(2);
const a = q.pop();
q.push(3);
const b = q.pop(), c = q.pop();
return a === 1 && b === 2 && c === 3 && q.empty() === true;`,
            },
            {
              name: "peek does not remove",
              code: "const q = new MyQueue(); q.push(7); q.peek(); q.peek(); return q.pop() === 7 && q.empty() === true;",
            },
          ],
          hint: "Two arrays: `in` and `out`. Only move items from `in` to `out` when `out` is empty — popping them one by one reverses their order.",
        },
        { type: "h", text: "The monotonic stack" },
        {
          type: "p",
          text: "\"For each item, find the next item to its right that is bigger\" — brute force checks everything to the right: O(n²). The trick: keep a stack of items **still waiting** for their answer, kept in decreasing order. When a bigger item arrives, it *is* the answer for every smaller item on top of the stack: pop them all and record it. Each index is pushed once and popped at most once → O(n).",
        },
        {
          type: "p",
          text: "Trace with daily temperatures `[73, 74, 75, 71, 69, 72, 76, 73]`, where we want \"how many days until a warmer one\". The stack holds indices (shown as `index(temp)`).",
        },
        {
          type: "table",
          rows: [
            ["i", "temp", "pops (answer = i − popped index)", "stack after"],
            ["0", "73", "—", "0(73)"],
            ["1", "74", "0 → ans[0] = 1", "1(74)"],
            ["2", "75", "1 → ans[1] = 1", "2(75)"],
            ["3", "71", "—", "2(75) 3(71)"],
            ["4", "69", "—", "2(75) 3(71) 4(69)"],
            ["5", "72", "4 → ans[4] = 1, 3 → ans[3] = 2", "2(75) 5(72)"],
            ["6", "76", "5 → ans[5] = 1, 2 → ans[2] = 4", "6(76)"],
            ["7", "73", "—", "6(76) 7(73)"],
            ["end", "", "leftovers never found a warmer day → 0", "answer: [1,1,4,2,1,1,0,0]"],
          ],
        },
        {
          type: "run",
          title: "next greater invoice amount (monotonic stack)",
          code: `// For each invoice, what is the next LARGER invoice amount? (-1 if none)
function nextGreater(amounts) {
  const answer = new Array(amounts.length).fill(-1);
  const waiting = []; // indices, amounts decreasing from bottom to top
  for (let i = 0; i < amounts.length; i++) {
    while (waiting.length && amounts[waiting[waiting.length - 1]] < amounts[i]) {
      const j = waiting.pop();
      answer[j] = amounts[i];
      console.log("  " + amounts[i] + " resolves index " + j + " (" + amounts[j] + ")");
    }
    waiting.push(i);
    console.log("i=" + i + " stack: [" + waiting.map((k) => amounts[k]).join(", ") + "]");
  }
  return answer;
}

console.log(nextGreater([1200, 800, 950, 3000, 500, 700]));`,
        },
        {
          type: "challenge",
          title: "Daily Temperatures",
          difficulty: "medium",
          tags: ["stack", "monotonic stack", "array"],
          prompt: "Given an array `temperatures` of daily temperatures, return an array `answer` where `answer[i]` is the number of days you have to wait after day `i` to get a **strictly warmer** temperature. If no future day is warmer, `answer[i]` is `0`.",
          examples: [
            { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
            { input: "temperatures = [30,40,50,60]", output: "[1,1,1,0]" },
            { input: "temperatures = [30,60,90]", output: "[1,1,0]" },
          ],
          constraints: ["1 <= temperatures.length <= 10^5", "30 <= temperatures[i] <= 100"],
          complexity: "O(n) time, O(n) space",
          starter: `function dailyTemperatures(temperatures) {
  // your code here
}`,
          solution: `function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const stack = []; // indices of days still waiting for a warmer day
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`,
          tests: [
            { name: "example 1 → [1,1,4,2,1,1,0,0]", code: "return deepEqual(dailyTemperatures([73,74,75,71,69,72,76,73]), [1,1,4,2,1,1,0,0]);" },
            { name: "always warming → [1,1,1,0]", code: "return deepEqual(dailyTemperatures([30,40,50,60]), [1,1,1,0]);" },
            { name: "always cooling → all zeros", code: "return deepEqual(dailyTemperatures([90,80,70]), [0,0,0]);" },
            { name: "equal is not warmer: [50,50,51] → [2,1,0]", code: "return deepEqual(dailyTemperatures([50,50,51]), [2,1,0]);" },
            {
              name: "fast on 60,000 equal days (O(n) needed)",
              code: `const temps = new Array(60000).fill(50);
const t0 = performance.now();
const r = dailyTemperatures(temps);
return r.length === 60000 && r.every((x) => x === 0) && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Keep a stack of indices whose answer isn't known yet. When today is warmer than the day on top, today is that day's answer: pop it and record `i - j`.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Same idea, harder question",
          text: "In the histogram problem below, we want for each bar how far it can stretch left and right while staying the shortest bar. The **next smaller** bar on each side is the boundary — so this time the stack stays *increasing*, and popping a bar is the moment we know both its boundaries: the bar that pops it (right) and the bar beneath it on the stack (left).",
        },
        {
          type: "challenge",
          title: "Largest Rectangle in Histogram",
          difficulty: "hard",
          tags: ["stack", "monotonic stack", "array"],
          prompt: "Given an array `heights` of bar heights in a histogram where every bar has width 1, return the area of the largest rectangle that fits entirely inside the histogram. (Think: the biggest rectangular banner you can lay over a bar chart of monthly sales.)",
          examples: [
            { input: "heights = [2,1,5,6,2,3]", output: "10", explanation: "Bars 5 and 6 give height 5 × width 2." },
            { input: "heights = [2,4]", output: "4" },
          ],
          constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
          complexity: "O(n) time, O(n) space",
          starter: `function largestRectangleArea(heights) {
  // your code here
}`,
          solution: `function largestRectangleArea(heights) {
  const stack = []; // indices with increasing heights
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i]; // a 0 at the end flushes the stack
    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}`,
          tests: [
            { name: "example [2,1,5,6,2,3] → 10", code: "return largestRectangleArea([2,1,5,6,2,3]) === 10;" },
            { name: "[2,4] → 4", code: "return largestRectangleArea([2,4]) === 4;" },
            { name: "single bar [7] → 7 and zero bars [0,0] → 0", code: "return largestRectangleArea([7]) === 7 && largestRectangleArea([0,0]) === 0;" },
            { name: "increasing [1,2,3,4,5] → 9 (3 × 3)", code: "return largestRectangleArea([1,2,3,4,5]) === 9;" },
            { name: "two adjacent tall bars beat the wide short one: [6,1,6,6,1,6] → 12", code: "return largestRectangleArea([6,1,6,6,1,6]) === 12;" },
            {
              name: "fast on 100,000 equal bars (O(n) needed)",
              code: `const h = new Array(100000).fill(3);
const t0 = performance.now();
return largestRectangleArea(h) === 300000 && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Keep indices in increasing height. When a shorter bar arrives, pop: the popped bar's rectangle ends just before `i` and starts just after the new stack top. Append a virtual bar of height 0 to flush everything at the end.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where these live in your stack",
          text: "Your JavaScript engine runs your code on a **call stack** (the next lesson on recursion makes it visible). The event loop pulls callbacks from a **task queue** in FIFO order. Undo/redo in a rich-text editor is two stacks. Background jobs you push from a Next.js route to a worker on Railway — emails, Shopify syncs — wait in a **queue**, usually Redis-backed, and a good queue library never uses `shift()` on a big array.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You call `queue.shift()` once per item to process 100,000 items in a plain array. What's the total cost?",
              options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
              answer: 2,
              why: "Each `shift()` moves every remaining element down one slot, so n dequeues cost about n²/2 moves. A head index (or two stacks) brings it back to O(n).",
            },
            {
              q: "A problem asks: \"for each day, how many days until the price drops below today's price?\" Which pattern fits best?",
              options: ["Monotonic stack", "Binary search", "Two nested loops is optimal", "A queue with shift()"],
              answer: 0,
              why: "\"Next smaller/greater element to the right\" is the monotonic stack signal: each index is pushed and popped once, O(n).",
            },
            {
              q: "In the two-stack queue, why is `pop()` amortized O(1) even though one call can move n elements?",
              options: [
                "JavaScript arrays move elements in O(1)",
                "Each element is moved from `in` to `out` at most once over its whole life",
                "The `out` stack is always empty",
                "It isn't — it's O(n) per call",
              ],
              answer: 1,
              why: "Spread over all operations, every element is pushed to `in` once, moved once, popped from `out` once: constant work per element.",
            },
            {
              q: "In Min Stack, why store the minimum next to *each* element instead of one `min` variable?",
              options: [
                "It uses less memory",
                "To make push faster",
                "Because JavaScript has no Math.min",
                "After a pop, you need the previous minimum back in O(1) — a single variable forgets it",
              ],
              answer: 3,
              why: "If the minimum is popped, a single variable would need an O(n) rescan. Storing min-so-far per level keeps every answer ready.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Binary search
    // ─────────────────────────────────────────────────────────────
    {
      slug: "binary-search",
      title: "Binary search",
      summary: "Halve the search space every step with one invariant-based template — on sorted arrays, on rotated arrays, and on the answer itself.",
      minutes: 55,
      blocks: [
        {
          type: "p",
          text: "Looking up a client in a sorted list of 1,000,000 names by checking each one takes up to 1,000,000 steps. Opening the list in the middle, deciding which half the name is in, and repeating takes at most **20** (2²⁰ ≈ 1,000,000). That's binary search: O(log n). The idea is easy; the bugs are all in the details — `<` vs `<=`, `mid` vs `mid + 1`, infinite loops. So instead of memorising variants, we'll use **one template backed by an invariant**.",
        },
        { type: "h", text: "Signals that it's a binary search problem" },
        {
          type: "list",
          items: [
            "The input is **sorted** (or sorted then rotated), and the problem demands O(log n).",
            "\"Find the **first** / **last** position where…\" — a yes/no question that flips exactly once as you move right.",
            "\"Find the **minimum** speed / capacity / days such that it's still possible\" — the answer itself lives in a sorted range, and feasibility is monotonic. That's **binary search on the answer**.",
            "Constraints like `values up to 10^9` where trying every value is impossible but `log₂(10^9) ≈ 30` steps is nothing.",
          ],
        },
        { type: "h", text: "The template: find the first index where a condition becomes true" },
        {
          type: "p",
          text: "Picture the array as a row of answers to a yes/no question that looks like `false false false true true true`. We want the first `true`. Keep two indices with this **invariant**: everything left of `lo` is known `false`, everything from `hi` onward is known `true`. The unknown zone is `[lo, hi)`. Shrink it until it's empty — then `lo === hi` is the answer.",
        },
        {
          type: "code",
          lang: "js",
          title: "lower bound — the only template you need",
          code: `// first index i in [0, n] where isOk(i) is true (n if never true)
function firstTrue(n, isOk) {
  let lo = 0, hi = n;                  // unknown zone: [lo, hi)
  while (lo < hi) {                    // stop when the zone is empty
    const mid = Math.floor((lo + hi) / 2);
    if (isOk(mid)) hi = mid;           // mid is true → answer is mid or left of it
    else lo = mid + 1;                 // mid is false → answer is right of mid
  }
  return lo;                           // lo === hi: the first true
}`,
        },
        {
          type: "list",
          items: [
            "`hi = n` (not `n - 1`) means \"maybe nothing is true\" is a valid answer — no special case.",
            "`mid` is always `< hi`, so `hi = mid` always shrinks the zone; `lo = mid + 1` too. No infinite loop is possible.",
            "To search for an exact value: find the first index where `nums[i] >= target`, then check whether `nums[lo] === target`.",
          ],
        },
        {
          type: "p",
          text: "Trace: the first index where `nums[i] >= 7` in `[1, 3, 5, 7, 9, 11]`.",
        },
        {
          type: "table",
          rows: [
            ["lo", "hi", "mid", "nums[mid]", ">= 7?", "move"],
            ["0", "6", "3", "7", "yes", "hi = 3"],
            ["0", "3", "1", "3", "no", "lo = 2"],
            ["2", "3", "2", "5", "no", "lo = 3"],
            ["3", "3", "—", "—", "—", "zone empty → answer 3"],
          ],
        },
        {
          type: "run",
          title: "lower bound with tracing",
          code: `function lowerBound(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const ok = nums[mid] >= target;
    console.log("lo=" + lo + " hi=" + hi + " mid=" + mid + " nums[mid]=" + nums[mid] + (ok ? " → hi=mid" : " → lo=mid+1"));
    if (ok) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

const invoiceTotals = [120, 340, 340, 560, 900, 1500, 4200];
console.log("first >= 560:", lowerBound(invoiceTotals, 560));
console.log("first >= 341:", lowerBound(invoiceTotals, 341));
console.log("first >= 9999:", lowerBound(invoiceTotals, 9999), "(= length: none)");

// count of invoices in [340, 1500): two lower bounds
console.log("count in [340, 1500):", lowerBound(invoiceTotals, 1500) - lowerBound(invoiceTotals, 340));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Classic off-by-one bugs",
          text: "Mixing templates: `while (lo <= hi)` with `hi = mid` loops forever when `lo === hi`. Forgetting to floor: `(lo + hi) / 2` is `2.5`, and `nums[2.5]` is `undefined`. And a JS-specific one: `(lo + hi) >> 1` is popular, but `>>` converts to a 32-bit integer, so it breaks once `lo + hi` exceeds 2³¹ − 1 ≈ 2.1 billion. When searching over huge numeric ranges, use `Math.floor((lo + hi) / 2)` or `lo + Math.floor((hi - lo) / 2)`.",
        },
        {
          type: "compare",
          left: {
            label: "Linear scan — O(n)",
            lang: "js",
            code: `function search(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}
// 1,000,000 items → up to 1,000,000 checks`,
          },
          right: {
            label: "Binary search — O(log n)",
            lang: "js",
            code: `function search(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return nums[lo] === target ? lo : -1;
}
// 1,000,000 items → about 20 checks`,
          },
        },
        {
          type: "challenge",
          title: "Binary Search",
          difficulty: "easy",
          tags: ["binary search", "array"],
          prompt: "Given an array `nums` of **distinct** integers sorted in ascending order and an integer `target`, return the index of `target`, or `-1` if it isn't there. Your algorithm must run in O(log n).",
          examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "all values are distinct and sorted ascending"],
          complexity: "O(log n) time, O(1) space",
          starter: `function search(nums, target) {
  // your code here
}`,
          solution: `function search(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return nums[lo] === target ? lo : -1;
}`,
          tests: [
            { name: "example: 9 is at index 4", code: "return search([-1,0,3,5,9,12], 9) === 4;" },
            { name: "missing value 2 → -1", code: "return search([-1,0,3,5,9,12], 2) === -1;" },
            { name: "first and last elements", code: "return search([-1,0,3,5,9,12], -1) === 0 && search([-1,0,3,5,9,12], 12) === 5;" },
            { name: "single element, present and absent", code: "return search([5], 5) === 0 && search([5], -5) === -1;" },
            { name: "larger than everything → -1", code: "return search([1,2,3], 4) === -1;" },
            {
              name: "fast: 20,000 lookups in 200,000 items (O(log n) needed)",
              code: `const nums = Array.from({ length: 200000 }, (_, i) => i * 2);
const t0 = performance.now();
let ok = true;
for (let k = 0; k < 20000; k++) {
  const v = 399998 - k * 2;
  if (search(nums, v) !== v / 2 || search(nums, v + 1) !== -1) ok = false;
}
return ok && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Use the template: find the first index where `nums[i] >= target`, then check if that index actually holds `target` (it might be out of range).",
        },
        {
          type: "challenge",
          title: "Search Insert Position",
          difficulty: "easy",
          tags: ["binary search", "array"],
          prompt: "Given a sorted array of distinct integers `nums` and a `target`, return the index of `target` if found; otherwise return the index where it **would be inserted** to keep the array sorted. O(log n) required. (Think: where does a new booking slot go in a sorted calendar?)",
          examples: [
            { input: "nums = [1,3,5,6], target = 5", output: "2" },
            { input: "nums = [1,3,5,6], target = 2", output: "1" },
            { input: "nums = [1,3,5,6], target = 7", output: "4" },
          ],
          constraints: ["1 <= nums.length <= 10^4", "distinct values, sorted ascending"],
          complexity: "O(log n) time, O(1) space",
          starter: `function searchInsert(nums, target) {
  // your code here
}`,
          solution: `function searchInsert(nums, target) {
  let lo = 0, hi = nums.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          tests: [
            { name: "found: 5 → 2", code: "return searchInsert([1,3,5,6], 5) === 2;" },
            { name: "insert in the middle: 2 → 1", code: "return searchInsert([1,3,5,6], 2) === 1;" },
            { name: "insert at the end: 7 → 4", code: "return searchInsert([1,3,5,6], 7) === 4;" },
            { name: "insert at the start: 0 → 0", code: "return searchInsert([1,3,5,6], 0) === 0;" },
            { name: "single element [1], target 2 → 1", code: "return searchInsert([1], 2) === 1;" },
          ],
          hint: "This *is* the lower-bound template, with no extra check. Why does `hi = nums.length` handle the \"insert at the end\" case for free?",
        },
        {
          type: "p",
          text: "Binary search doesn't need an array at all — only a yes/no question that flips once. In the next problem, the \"array\" is version numbers `1..n` and the question is an API call.",
        },
        {
          type: "challenge",
          title: "First Bad Version",
          difficulty: "easy",
          tags: ["binary search", "interactive"],
          prompt: "Your team shipped versions `1` to `n` of a client app. One version introduced a bug and every version after it is also bad. You get a function `isBadVersion(version)` that returns `true` or `false` (each call is a slow CI run — minimise calls). Return the first bad version. `firstBadVersion(n, isBadVersion)` receives the checker as a parameter.",
          examples: [
            { input: "n = 5, first bad = 4", output: "4", explanation: "isBadVersion(3) → false, isBadVersion(5) → true, isBadVersion(4) → true." },
            { input: "n = 1, first bad = 1", output: "1" },
          ],
          constraints: ["1 <= first bad <= n <= 2^31 - 1"],
          complexity: "O(log n) calls",
          starter: `function firstBadVersion(n, isBadVersion) {
  // your code here
}`,
          solution: `function firstBadVersion(n, isBadVersion) {
  let lo = 1, hi = n; // the answer is guaranteed to be in [1, n]
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          tests: [
            { name: "n = 5, first bad 4 → 4", code: "return firstBadVersion(5, (v) => v >= 4) === 4;" },
            { name: "n = 1 → 1", code: "return firstBadVersion(1, (v) => v >= 1) === 1;" },
            { name: "every version is bad → 1", code: "return firstBadVersion(100, () => true) === 1;" },
            { name: "only the last version is bad → n", code: "return firstBadVersion(100, (v) => v >= 100) === 100;" },
            {
              name: "n = 2^31 - 1 with at most 40 calls (watch for 32-bit overflow!)",
              code: `let calls = 0;
const bad = 1702766719;
const r = firstBadVersion(2147483647, (v) => {
  if (++calls > 100) throw new Error("too many isBadVersion calls");
  return v >= bad;
});
return r === bad && calls <= 40;`,
            },
          ],
          hint: "Same template over versions 1..n. The answer always exists, so `hi = n` is fine. If you used `(lo + hi) >> 1`, the last test will tell you why that's dangerous.",
        },
        { type: "h", text: "Rotated sorted arrays" },
        {
          type: "p",
          text: "Take `[0,1,2,4,5,6,7]` and rotate it: `[4,5,6,7,0,1,2]`. It's no longer sorted, but it's two sorted runs. Key fact: pick any `mid` — **at least one half is fully sorted**, and comparing `nums[mid]` with an endpoint tells you which. For the minimum: if `nums[mid] > nums[hi]`, the drop (and so the minimum) is to the right of `mid`; otherwise it's at `mid` or to its left.",
        },
        {
          type: "challenge",
          title: "Find Minimum in Rotated Sorted Array",
          difficulty: "medium",
          tags: ["binary search", "array"],
          prompt: "An array of **unique** integers was sorted ascending, then rotated between 1 and n times. Return its minimum element in O(log n).",
          examples: [
            { input: "nums = [3,4,5,1,2]", output: "1" },
            { input: "nums = [4,5,6,7,0,1,2]", output: "0" },
            { input: "nums = [11,13,15,17]", output: "11", explanation: "Rotated n times = back to sorted." },
          ],
          constraints: ["1 <= nums.length <= 10^5", "all values unique"],
          complexity: "O(log n) time, O(1) space",
          starter: `function findMin(nums) {
  // your code here
}`,
          solution: `function findMin(nums) {
  let lo = 0, hi = nums.length - 1; // the minimum is always in [lo, hi]
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] > nums[hi]) lo = mid + 1; // the drop is right of mid
    else hi = mid;                          // mid could be the minimum
  }
  return nums[lo];
}`,
          tests: [
            { name: "[3,4,5,1,2] → 1", code: "return findMin([3,4,5,1,2]) === 1;" },
            { name: "[4,5,6,7,0,1,2] → 0", code: "return findMin([4,5,6,7,0,1,2]) === 0;" },
            { name: "not rotated at all: [11,13,15,17] → 11", code: "return findMin([11,13,15,17]) === 11;" },
            { name: "two elements [2,1] → 1, single [5] → 5", code: "return findMin([2,1]) === 1 && findMin([5]) === 5;" },
            {
              name: "reads at most 100 elements of a 100,000-item array (O(log n) needed)",
              code: `const base = Array.from({ length: 100000 }, (_, i) => i * 3);
const rotated = base.slice(61234).concat(base.slice(0, 61234));
let reads = 0;
const nums = new Proxy(rotated, {
  get(t, k) { if (typeof k === "string" && String(Number(k)) === k) reads++; return t[k]; },
});
return findMin(nums) === 0 && reads <= 100;`,
            },
          ],
          hint: "Compare `nums[mid]` with `nums[hi]`, not `nums[lo]`. If `nums[mid] > nums[hi]`, the rotation point is strictly to the right.",
        },
        {
          type: "challenge",
          title: "Search in Rotated Sorted Array",
          difficulty: "medium",
          tags: ["binary search", "array"],
          prompt: "A sorted array of **distinct** integers was possibly rotated at some unknown pivot. Given `nums` and `target`, return the index of `target` or `-1`, in O(log n).",
          examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4" },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1" },
            { input: "nums = [1], target = 0", output: "-1" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "all values distinct"],
          complexity: "O(log n) time, O(1) space",
          starter: `function searchRotated(nums, target) {
  // your code here
}`,
          solution: `function searchRotated(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) {
      // left half [lo, mid] is sorted
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else {
      // right half [mid, hi] is sorted
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`,
          tests: [
            { name: "[4,5,6,7,0,1,2], 0 → 4", code: "return searchRotated([4,5,6,7,0,1,2], 0) === 4;" },
            { name: "[4,5,6,7,0,1,2], 3 → -1", code: "return searchRotated([4,5,6,7,0,1,2], 3) === -1;" },
            { name: "[1], 0 → -1 and [1], 1 → 0", code: "return searchRotated([1], 0) === -1 && searchRotated([1], 1) === 0;" },
            { name: "target in the left run: [5,1,3], 5 → 0", code: "return searchRotated([5,1,3], 5) === 0;" },
            { name: "two elements [3,1], 1 → 1", code: "return searchRotated([3,1], 1) === 1;" },
            {
              name: "3 searches read at most 400 elements of a 100,000-item array (O(log n) needed)",
              code: `const base = Array.from({ length: 100000 }, (_, i) => i * 2);
const rotated = base.slice(40000).concat(base.slice(0, 40000));
let reads = 0;
const nums = new Proxy(rotated, {
  get(t, k) { if (typeof k === "string" && String(Number(k)) === k) reads++; return t[k]; },
});
const a = searchRotated(nums, 79998); // at index 99999
const b = searchRotated(nums, 80000); // at index 0
const c = searchRotated(nums, 7);     // odd → absent
return a === 99999 && b === 0 && c === -1 && reads <= 400;`,
            },
          ],
          hint: "At each step, decide which half is sorted (`nums[lo] <= nums[mid]` means the left half is). Then check if `target` lies inside that sorted half's range; if yes go there, otherwise go to the other half.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Why the template changed",
          text: "Searching for an *exact* value with early exit (`return mid`) reads more naturally with the closed interval `lo <= hi` and `hi = mid - 1`. That's fine — what matters is that you know your invariant: here \"if target exists, it's in `[lo, hi]`\". Pick one template per invariant and never mix them.",
        },
        { type: "h", text: "Binary search on the answer" },
        {
          type: "p",
          text: "Some problems don't give you a sorted array — they ask for the **smallest value that works**. If \"speed `k` works\" implies \"speed `k + 1` also works\", then the answers form `false … false true … true` over the range of possible values, and the template finds the first `true`. You only need a function `canDo(k)` that checks one candidate.",
        },
        {
          type: "p",
          text: "Trace for Koko below with `piles = [3,6,7,11]`, `h = 8`. Hours at speed `k` = sum of `ceil(pile / k)`.",
        },
        {
          type: "table",
          rows: [
            ["lo", "hi", "mid (speed)", "hours needed", "<= 8?", "move"],
            ["1", "11", "6", "1+1+2+2 = 6", "yes", "hi = 6"],
            ["1", "6", "3", "1+2+3+4 = 10", "no", "lo = 4"],
            ["4", "6", "5", "1+2+2+3 = 8", "yes", "hi = 5"],
            ["4", "5", "4", "1+2+2+3 = 8", "yes", "hi = 4"],
            ["4", "4", "—", "—", "—", "answer: 4"],
          ],
        },
        {
          type: "challenge",
          title: "Koko Eating Bananas",
          difficulty: "medium",
          tags: ["binary search", "binary search on answer"],
          prompt: "There are `piles[i]` bananas in each pile, and the guards return in `h` hours. Each hour Koko picks one pile and eats `k` bananas from it (if the pile has fewer than `k`, she finishes it and waits for the next hour). Return the **minimum integer speed `k`** that lets her eat everything within `h` hours.",
          examples: [
            { input: "piles = [3,6,7,11], h = 8", output: "4" },
            { input: "piles = [30,11,23,4,20], h = 5", output: "30" },
            { input: "piles = [30,11,23,4,20], h = 6", output: "23" },
          ],
          constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9", "1 <= piles[i] <= 10^9"],
          complexity: "O(n log M) time where M = max pile, O(1) space",
          starter: `function minEatingSpeed(piles, h) {
  // your code here
}`,
          solution: `function minEatingSpeed(piles, h) {
  const hoursAt = (k) => {
    let hours = 0;
    for (const p of piles) hours += Math.ceil(p / k);
    return hours;
  };
  let lo = 1, hi = Math.max(...piles); // speed max(piles) always works
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hoursAt(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
          tests: [
            { name: "[3,6,7,11], h = 8 → 4", code: "return minEatingSpeed([3,6,7,11], 8) === 4;" },
            { name: "[30,11,23,4,20], h = 5 → 30", code: "return minEatingSpeed([30,11,23,4,20], 5) === 30;" },
            { name: "[30,11,23,4,20], h = 6 → 23", code: "return minEatingSpeed([30,11,23,4,20], 6) === 23;" },
            { name: "one huge pile: [312884470], h = 312884469 → 2", code: "return minEatingSpeed([312884470], 312884469) === 2;" },
            {
              name: "fast: 10,000 piles of 10^9 bananas (trying speeds one by one is impossible)",
              code: `const piles = new Array(10000).fill(1000000000);
const t0 = performance.now();
return minEatingSpeed(piles, 20000) === 500000000 && performance.now() - t0 < 500;`,
            },
          ],
          hint: "The answer is between 1 and `max(piles)`. Write `hoursAt(k)`; it only goes down as `k` goes up. Find the first `k` with `hoursAt(k) <= h`.",
        },
        {
          type: "p",
          text: "Last one, and it's a famous hard problem. Merging two sorted arrays to find the median is O(m + n). To get O(log(min(m, n))), binary search on **how many elements the left half takes from the shorter array**: if it takes `i` from `a`, it must take `j = half - i` from `b`. The split is correct when everything on the left is `<=` everything on the right.",
        },
        {
          type: "challenge",
          title: "Median of Two Sorted Arrays (optional)",
          difficulty: "hard",
          tags: ["binary search", "array", "divide and conquer"],
          prompt: "Given two sorted arrays `a` and `b` (sizes m and n), return the median of all their values combined. The overall run time must be O(log(m + n)) — merging is not allowed. If the total count is even, the median is the average of the two middle values.",
          examples: [
            { input: "a = [1,3], b = [2]", output: "2" },
            { input: "a = [1,2], b = [3,4]", output: "2.5", explanation: "(2 + 3) / 2" },
          ],
          constraints: ["0 <= m, n <= 10^5", "1 <= m + n"],
          complexity: "O(log(min(m, n))) time, O(1) space",
          starter: `function findMedianSortedArrays(a, b) {
  // your code here
}`,
          solution: `function findMedianSortedArrays(a, b) {
  if (a.length > b.length) [a, b] = [b, a]; // binary search the shorter one
  const m = a.length, n = b.length;
  const half = Math.floor((m + n + 1) / 2);  // size of the left half
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2); // taken from a
    const j = half - i;                  // taken from b
    const aLeft = i > 0 ? a[i - 1] : -Infinity;
    const aRight = i < m ? a[i] : Infinity;
    const bLeft = j > 0 ? b[j - 1] : -Infinity;
    const bRight = j < n ? b[j] : Infinity;
    if (aLeft <= bRight && bLeft <= aRight) {
      if ((m + n) % 2 === 1) return Math.max(aLeft, bLeft);
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    }
    if (aLeft > bRight) hi = i - 1; // took too many from a
    else lo = i + 1;                // took too few from a
  }
}`,
          tests: [
            { name: "[1,3] + [2] → 2", code: "return findMedianSortedArrays([1,3], [2]) === 2;" },
            { name: "[1,2] + [3,4] → 2.5", code: "return findMedianSortedArrays([1,2], [3,4]) === 2.5;" },
            { name: "one array empty: [] + [1] → 1 and [2,3] + [] → 2.5", code: "return findMedianSortedArrays([], [1]) === 1 && findMedianSortedArrays([2,3], []) === 2.5;" },
            { name: "interleaved with duplicates: [1,1,3,3] + [1,1,3,3] → 2", code: "return findMedianSortedArrays([1,1,3,3], [1,1,3,3]) === 2;" },
            { name: "all of one array is smaller: [1,2,3] + [10,11,12,13] → 10", code: "return findMedianSortedArrays([1,2,3], [10,11,12,13]) === 10;" },
            {
              name: "reads at most 200 elements of two 100,000-item arrays (no merging)",
              code: `let reads = 0;
const watch = (arr) => new Proxy(arr, {
  get(t, k) { if (typeof k === "string" && String(Number(k)) === k) reads++; return t[k]; },
});
const a = watch(Array.from({ length: 100000 }, (_, i) => i * 2));     // evens
const b = watch(Array.from({ length: 100001 }, (_, i) => i * 2 + 1)); // odds
return findMedianSortedArrays(a, b) === 100000 && reads <= 200;`,
            },
          ],
          hint: "Binary search `i` = how many of the shorter array go in the left half. Use `-Infinity`/`Infinity` for the missing neighbours at the edges. Too big `a[i-1]` → move left; too big `b[j-1]` → move right.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Binary search in your stack",
          text: "Postgres (and so Supabase) uses **B-tree indexes** — a generalisation of binary search over disk pages — which is why `where email = $1` on an indexed column stays fast at millions of rows, and why a missing index turns it into a linear scan. `git bisect` is literally First Bad Version: it binary-searches your commit history for the commit that broke the build.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "With `lo = 0, hi = n` and `while (lo < hi)`, what's the right update when `isOk(mid)` is true?",
              options: ["hi = mid - 1", "lo = mid", "hi = mid", "lo = mid + 1"],
              answer: 2,
              why: "`mid` itself might be the first true, so it must stay in the zone `[lo, hi)`: `hi = mid`. `mid - 1` could skip the answer.",
            },
            {
              q: "\"Find the minimum truck capacity to ship all orders within D days.\" Which approach fits?",
              options: [
                "Binary search on the capacity, with a function that checks one capacity in O(n)",
                "Sort the orders and take the D largest",
                "Monotonic stack",
                "Try every capacity from 1 upward",
              ],
              answer: 0,
              why: "If capacity c works, c + 1 works too — a monotonic yes/no over a numeric range. That's binary search on the answer: O(n log(sum of weights)).",
            },
            {
              q: "Why can `(lo + hi) >> 1` give a wrong `mid` in JavaScript?",
              options: [
                "`>>` rounds up",
                "`>>` converts to a 32-bit signed integer, so sums above 2³¹ − 1 wrap to negative numbers",
                "It is slower than Math.floor",
                "It only works on even numbers",
              ],
              answer: 1,
              why: "Bitwise operators work on 32-bit integers. With `n = 2³¹ − 1`, `lo + hi` overflows that range. `Math.floor((lo + hi) / 2)` is safe up to 2⁵³.",
            },
            {
              q: "How many steps does binary search need, at most, on 1,000,000 sorted items?",
              options: ["1,000", "500,000", "1,000,000", "About 20"],
              answer: 3,
              why: "Each step halves the zone: log₂(1,000,000) ≈ 19.9.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Linked lists
    // ─────────────────────────────────────────────────────────────
    {
      slug: "linked-lists",
      title: "Linked lists",
      summary: "Nodes and pointers: reverse, merge, detect cycles and find middles in place — plus the dummy-head and fast/slow-pointer tricks, and an LRU cache.",
      minutes: 55,
      blocks: [
        {
          type: "p",
          text: "An array keeps its items in numbered, side-by-side slots. A **linked list** scatters them anywhere in memory and has each node hold a **pointer** to the next one. You lose instant access by index (finding item 500 means walking 500 nodes), but you gain O(1) insertion and removal *once you're at a node* — nothing needs to shift. Linked list problems are rarely about speed, though: they test whether you can rewire pointers without losing half the list.",
        },
        {
          type: "code",
          lang: "js",
          title: "the node (predefined in this track)",
          code: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;    // the data
    this.next = next;  // pointer to the next node, or null at the end
  }
}

// 10 → 20 → 30 → null
const head = new ListNode(10, new ListNode(20, new ListNode(30)));
// same thing with the helper:
const head2 = toList([10, 20, 30]);
fromList(head2); // [10, 20, 30]`,
        },
        {
          type: "table",
          rows: [
            ["Operation", "Array", "Linked list"],
            ["read item i", "O(1)", "O(i) — walk from the head"],
            ["insert/remove at the front", "O(n) (everything shifts)", "O(1)"],
            ["insert/remove after a node you hold", "O(n)", "O(1)"],
            ["find a value", "O(n)", "O(n)"],
            ["memory", "compact", "one extra pointer per node"],
          ],
        },
        { type: "h", text: "Rewiring pointers: reversing a list, step by step" },
        {
          type: "p",
          text: "Reversing `1 → 2 → 3` means making every arrow point backward. You walk the list with three variables: `prev` (the already-reversed part), `curr` (the node being flipped) and `next` (saved *before* flipping, otherwise you'd lose the rest of the list).",
        },
        {
          type: "steps",
          items: [
            { title: "Start", text: "`prev = null`, `curr = 1`. List: `1 → 2 → 3 → null`." },
            { title: "Flip node 1", text: "Save `next = 2`. Point `1.next = prev` (null). Move: `prev = 1`, `curr = 2`. Reversed so far: `1 → null`; rest: `2 → 3`." },
            { title: "Flip node 2", text: "Save `next = 3`. Point `2.next = 1`. Move: `prev = 2`, `curr = 3`. Reversed: `2 → 1 → null`." },
            { title: "Flip node 3", text: "Save `next = null`. Point `3.next = 2`. Move: `prev = 3`, `curr = null`. Reversed: `3 → 2 → 1 → null`." },
            { title: "Done", text: "`curr` is null, so the loop ends. `prev` is the new head." },
          ],
        },
        {
          type: "run",
          title: "reverse in place, with tracing",
          code: `function reverse(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next; // 1. save the rest
    curr.next = prev;       // 2. flip the arrow
    prev = curr;            // 3. advance both
    curr = next;
    console.log("reversed:", fromList(prev).join(" → "), "| rest:", fromList(curr).join(" → ") || "∅");
  }
  return prev;
}

const pipeline = toList(["lead", "qualified", "proposal", "won"]);
console.log(fromList(reverse(pipeline)));`,
        },
        { type: "h", text: "Two tricks you'll use constantly" },
        {
          type: "list",
          items: [
            "**Dummy head**: create `const dummy = new ListNode(0, head)` and work from it. The real head is no longer special (removing it or inserting before it is the same code as anywhere else). Return `dummy.next`.",
            "**Fast & slow pointers**: move `slow` one step and `fast` two steps. When `fast` hits the end, `slow` is in the middle. If there's a cycle, `fast` laps `slow` and they meet. Give `fast` a head start of n nodes and `slow` stops n from the end.",
          ],
        },
        {
          type: "compare",
          left: {
            label: "Copy to an array — O(n) extra space",
            lang: "js",
            code: `// Middle of the list via an array
function middleNode(head) {
  const nodes = [];
  for (let n = head; n; n = n.next) nodes.push(n);
  return nodes[Math.floor(nodes.length / 2)];
}
// Works, but allocates n slots.
// Interviewers will ask for O(1) space.`,
          },
          right: {
            label: "Fast & slow — O(1) extra space",
            lang: "js",
            code: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;       // 1 step
    fast = fast.next.next;  // 2 steps
  }
  return slow; // fast ran twice as far
}
// One pass, two pointers, no allocation.`,
          },
        },
        {
          type: "challenge",
          title: "Reverse Linked List",
          difficulty: "easy",
          tags: ["linked list"],
          prompt: "Given the `head` of a singly linked list, reverse it in place and return the new head.",
          examples: [
            { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
            { input: "head = [1,2]", output: "[2,1]" },
            { input: "head = []", output: "[]" },
          ],
          constraints: ["0 <= number of nodes <= 5000"],
          complexity: "O(n) time, O(1) space",
          starter: `function reverseList(head) {
  // your code here
}`,
          solution: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
          tests: [
            { name: "[1,2,3,4,5] → [5,4,3,2,1]", code: "return deepEqual(fromList(reverseList(toList([1,2,3,4,5]))), [5,4,3,2,1]);" },
            { name: "[1,2] → [2,1]", code: "return deepEqual(fromList(reverseList(toList([1,2]))), [2,1]);" },
            { name: "empty list → null", code: "return reverseList(null) === null;" },
            { name: "single node → itself", code: "const h = toList([7]); return reverseList(h) === h && h.next === null;" },
            {
              name: "reuses the same nodes (no copies)",
              code: "const h = toList([1,2,3]); const tail = h.next.next; const r = reverseList(h); return r === tail && r.next.next === h && h.next === null;",
            },
          ],
          hint: "Three variables: `prev`, `curr`, `next`. Save `curr.next` before you overwrite it.",
        },
        {
          type: "challenge",
          title: "Merge Two Sorted Lists",
          difficulty: "easy",
          tags: ["linked list", "dummy head", "two pointers"],
          prompt: "Given the heads of two sorted linked lists `list1` and `list2`, splice their nodes together into one sorted list and return its head. Reuse the existing nodes.",
          examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
            { input: "list1 = [], list2 = []", output: "[]" },
            { input: "list1 = [], list2 = [0]", output: "[0]" },
          ],
          constraints: ["0 <= nodes in each list <= 50", "both lists sorted ascending"],
          complexity: "O(m + n) time, O(1) space",
          starter: `function mergeTwoLists(list1, list2) {
  // your code here
}`,
          solution: `function mergeTwoLists(list1, list2) {
  const dummy = new ListNode();
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
    else { tail.next = list2; list2 = list2.next; }
    tail = tail.next;
  }
  tail.next = list1 || list2; // attach whatever is left
  return dummy.next;
}`,
          tests: [
            { name: "[1,2,4] + [1,3,4] → [1,1,2,3,4,4]", code: "return deepEqual(fromList(mergeTwoLists(toList([1,2,4]), toList([1,3,4]))), [1,1,2,3,4,4]);" },
            { name: "both empty → null", code: "return mergeTwoLists(null, null) === null;" },
            { name: "one empty: [] + [0] → [0]", code: "return deepEqual(fromList(mergeTwoLists(null, toList([0]))), [0]);" },
            { name: "negatives and unequal lengths", code: "return deepEqual(fromList(mergeTwoLists(toList([-5,10]), toList([-7,-6,0,11,12]))), [-7,-6,-5,0,10,11,12]);" },
          ],
          hint: "Start from a dummy node and keep a `tail` pointer. Attach the smaller head each time; when one list runs out, attach the rest of the other in one move.",
        },
        {
          type: "p",
          text: "A list with a **cycle** never reaches `null`: some node's `next` points back to an earlier node, so a plain `while (node)` loops forever. Floyd's tortoise and hare: if there's a loop, the fast pointer gains one node per step on the slow one inside it, so it must eventually land on it.",
        },
        {
          type: "challenge",
          title: "Linked List Cycle",
          difficulty: "easy",
          tags: ["linked list", "fast and slow pointers"],
          prompt: "Given `head`, return `true` if the list contains a cycle (some node can be reached again by following `next`), otherwise `false`. Try for O(1) extra memory.",
          examples: [
            { input: "head = [3,2,0,-4], tail connects to index 1", output: "true" },
            { input: "head = [1,2], tail connects to index 0", output: "true" },
            { input: "head = [1], no cycle", output: "false" },
          ],
          constraints: ["0 <= nodes <= 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function hasCycle(head) {
  // your code here
}`,
          solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
          tests: [
            {
              name: "[3,2,0,-4] with tail → index 1 → true",
              code: `const head = toList([3,2,0,-4]);
const tail = head.next.next.next;
tail.next = head.next; // build the cycle
return hasCycle(head) === true;`,
            },
            {
              name: "[1,2] with tail → head → true",
              code: "const head = toList([1,2]); head.next.next = head; return hasCycle(head) === true;",
            },
            { name: "single node, no cycle → false", code: "return hasCycle(toList([1])) === false;" },
            { name: "empty list → false", code: "return hasCycle(null) === false;" },
            { name: "a node pointing to itself → true", code: "const n = new ListNode(1); n.next = n; return hasCycle(n) === true;" },
            { name: "long list of 10,000 nodes without cycle → false", code: "return hasCycle(toList(Array.from({ length: 10000 }, (_, i) => i))) === false;" },
          ],
          hint: "Move one pointer 1 step and another 2 steps. If they're ever the same node, there's a cycle. If the fast one reaches null, there isn't.",
        },
        {
          type: "challenge",
          title: "Middle of the Linked List",
          difficulty: "easy",
          tags: ["linked list", "fast and slow pointers"],
          prompt: "Return the middle **node** of a non-empty linked list. If there are two middle nodes, return the second one.",
          examples: [
            { input: "head = [1,2,3,4,5]", output: "node 3 (list from it: [3,4,5])" },
            { input: "head = [1,2,3,4,5,6]", output: "node 4 (list from it: [4,5,6])" },
          ],
          constraints: ["1 <= nodes <= 100"],
          complexity: "O(n) time, O(1) space",
          starter: `function middleNode(head) {
  // your code here
}`,
          solution: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
          tests: [
            { name: "odd length [1,2,3,4,5] → [3,4,5]", code: "return deepEqual(fromList(middleNode(toList([1,2,3,4,5]))), [3,4,5]);" },
            { name: "even length [1,2,3,4,5,6] → second middle [4,5,6]", code: "return deepEqual(fromList(middleNode(toList([1,2,3,4,5,6]))), [4,5,6]);" },
            { name: "single node → itself", code: "const h = toList([9]); return middleNode(h) === h;" },
            { name: "returns the actual node, not a copy", code: "const h = toList([1,2,3]); return middleNode(h) === h.next;" },
          ],
          hint: "Fast and slow pointers. Check the loop condition on a 2-node list: you want `slow` to end on the second node.",
        },
        {
          type: "challenge",
          title: "Remove Nth Node From End of List",
          difficulty: "medium",
          tags: ["linked list", "fast and slow pointers", "dummy head"],
          prompt: "Given `head` and `n`, remove the n-th node **from the end** of the list and return the head. Do it in one pass.",
          examples: [
            { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]" },
            { input: "head = [1], n = 1", output: "[]" },
            { input: "head = [1,2], n = 1", output: "[1]" },
          ],
          constraints: ["1 <= nodes <= 30", "1 <= n <= number of nodes"],
          complexity: "O(n) time, O(1) space",
          starter: `function removeNthFromEnd(head, n) {
  // your code here
}`,
          solution: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  for (let i = 0; i < n; i++) fast = fast.next; // n-node head start
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next; // slow sits just before the target
  return dummy.next;
}`,
          tests: [
            { name: "[1,2,3,4,5], n = 2 → [1,2,3,5]", code: "return deepEqual(fromList(removeNthFromEnd(toList([1,2,3,4,5]), 2)), [1,2,3,5]);" },
            { name: "remove the only node → empty", code: "return fromList(removeNthFromEnd(toList([1]), 1)).length === 0;" },
            { name: "remove the tail: [1,2], n = 1 → [1]", code: "return deepEqual(fromList(removeNthFromEnd(toList([1,2]), 1)), [1]);" },
            { name: "remove the head: [1,2], n = 2 → [2]", code: "return deepEqual(fromList(removeNthFromEnd(toList([1,2]), 2)), [2]);" },
          ],
          hint: "Start both pointers on a dummy node. Move `fast` n steps ahead, then move both until `fast.next` is null: `slow` is right before the node to delete. The dummy handles deleting the head.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Combining the tools",
          text: "The next problem is three things you already know glued together: find the middle (fast/slow), reverse the second half (reverse), then weave the two halves (merge). Many \"medium\" linked list problems are exactly this kind of combo.",
        },
        {
          type: "challenge",
          title: "Reorder List",
          difficulty: "medium",
          tags: ["linked list", "fast and slow pointers", "reverse"],
          prompt: "Given a list `L0 → L1 → … → Ln-1 → Ln`, reorder it **in place** to `L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`. Change the nodes' `next` pointers, not their values. The function returns nothing.",
          examples: [
            { input: "head = [1,2,3,4]", output: "[1,4,2,3]" },
            { input: "head = [1,2,3,4,5]", output: "[1,5,2,4,3]" },
          ],
          constraints: ["1 <= nodes <= 5 * 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function reorderList(head) {
  // your code here
}`,
          solution: `function reorderList(head) {
  if (!head || !head.next) return;
  // 1. find the end of the first half
  let slow = head, fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // 2. reverse the second half
  let prev = null, curr = slow.next;
  slow.next = null;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  // 3. weave: first, second, first, second...
  let first = head, second = prev;
  while (second) {
    const n1 = first.next, n2 = second.next;
    first.next = second;
    second.next = n1;
    first = n1;
    second = n2;
  }
}`,
          tests: [
            { name: "[1,2,3,4] → [1,4,2,3]", code: "const h = toList([1,2,3,4]); reorderList(h); return deepEqual(fromList(h), [1,4,2,3]);" },
            { name: "[1,2,3,4,5] → [1,5,2,4,3]", code: "const h = toList([1,2,3,4,5]); reorderList(h); return deepEqual(fromList(h), [1,5,2,4,3]);" },
            { name: "single node and two nodes stay the same", code: "const a = toList([1]); reorderList(a); const b = toList([1,2]); reorderList(b); return deepEqual(fromList(a), [1]) && deepEqual(fromList(b), [1,2]);" },
            {
              name: "moves nodes, not values (node identity preserved)",
              code: "const h = toList([1,2,3]); const third = h.next.next; reorderList(h); return h.next === third && third.val === 3 && fromList(h).length === 3;",
            },
            {
              name: "50,000 nodes, in place",
              code: `const n = 50000;
const h = toList(Array.from({ length: n }, (_, i) => i));
const t0 = performance.now();
reorderList(h);
const out = fromList(h);
return out[0] === 0 && out[1] === n - 1 && out[2] === 1 && out[3] === n - 2 && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Middle with fast/slow, cut the list there, reverse the second half, then alternate one node from each half.",
        },
        { type: "h", text: "Design: an LRU cache" },
        {
          type: "p",
          text: "A **Least Recently Used** cache holds at most `capacity` entries; when full, it evicts the entry that was used longest ago. Both `get` and `put` must be O(1). The textbook design is a hash map (key → node) plus a **doubly linked list** ordered by recency: touching an entry unlinks its node and moves it to the front in O(1); evicting removes the tail.",
        },
        {
          type: "p",
          text: "In JavaScript there's a shortcut: a `Map` **remembers insertion order**, and `delete` + `set` moves a key to the end. So the *first* key in the map is always the least recently used one, and `map.keys().next().value` gives it in O(1). Under the hood, that's the hash map + linked list combo, built into the engine.",
        },
        {
          type: "run",
          title: "Map keeps insertion order",
          code: `const recent = new Map();
recent.set("client:acme", "Acme Inc.");
recent.set("client:bolt", "Bolt Studio");
recent.set("client:cafe", "Café Lumen");
console.log([...recent.keys()]);

// "use" acme: delete and re-insert → it moves to the end
const v = recent.get("client:acme");
recent.delete("client:acme");
recent.set("client:acme", v);
console.log([...recent.keys()]);

// least recently used = the first key
console.log("evict:", recent.keys().next().value);`,
        },
        {
          type: "challenge",
          title: "LRU Cache",
          difficulty: "medium",
          tags: ["design", "hash map", "linked list"],
          prompt: "Design `LRUCache`: `new LRUCache(capacity)`; `get(key)` returns the value if present (and marks it as most recently used), else `-1`; `put(key, value)` inserts or updates the key (marking it most recently used) and, if the cache now holds more than `capacity` keys, evicts the least recently used one. Both operations must be O(1) on average.",
          examples: [
            {
              input: "cap 2: put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)",
              output: "get results: 1, -1, -1, 3, 4",
              explanation: "put(3,3) evicts key 2 (key 1 was just used). put(4,4) evicts key 1.",
            },
          ],
          constraints: ["1 <= capacity <= 3000", "up to 2 * 10^5 calls"],
          complexity: "O(1) per operation, O(capacity) space",
          starter: `class LRUCache {
  constructor(capacity) {
    // your code here
  }
  get(key) {}
  put(key, value) {}
}`,
          solution: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // oldest first, newest last
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);   // move to the end = most recent
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      this.map.delete(this.map.keys().next().value); // evict the oldest
    }
  }
}`,
          tests: [
            {
              name: "example sequence with capacity 2",
              code: `const c = new LRUCache(2);
c.put(1, 1); c.put(2, 2);
const a = c.get(1);
c.put(3, 3);
const b = c.get(2);
c.put(4, 4);
return a === 1 && b === -1 && c.get(1) === -1 && c.get(3) === 3 && c.get(4) === 4;`,
            },
            {
              name: "updating a key refreshes it (put counts as use)",
              code: `const c = new LRUCache(2);
c.put("a", 1); c.put("b", 2);
c.put("a", 10);   // a is now the most recent
c.put("c", 3);    // evicts b
return c.get("b") === -1 && c.get("a") === 10 && c.get("c") === 3;`,
            },
            {
              name: "capacity 1 keeps only the last key",
              code: "const c = new LRUCache(1); c.put(1, 1); c.put(2, 2); return c.get(1) === -1 && c.get(2) === 2;",
            },
            {
              name: "missing key → -1",
              code: "return new LRUCache(3).get(42) === -1;",
            },
            {
              name: "fast: 80,000 operations with capacity 30,000 (O(1) needed)",
              code: `const c = new LRUCache(30000);
const t0 = performance.now();
let hits = 0;
for (let i = 0; i < 40000; i++) {
  c.put(i, i);
  if (i >= 1000 && c.get(i - 1000) === i - 1000) hits++;
}
return hits === 39000 && c.get(0) === -1 && c.get(39999) === 39999 && performance.now() - t0 < 500;`,
            },
          ],
          hint: "A `Map` iterates in insertion order. To mark a key as recent, delete it and set it again. To evict, delete `map.keys().next().value`.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Linked structures in the tools you use",
          text: "React's internal **fiber tree** is a linked structure: each fiber points to its `child`, its next `sibling` and its parent (`return`), so React can pause and resume rendering by just remembering one pointer. And LRU caches are everywhere: the popular `lru-cache` npm package, and Next.js's in-memory cache on a self-hosted server (sized by `cacheMaxMemorySize`) evicts least-recently-used entries when it fills up.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Why does a dummy head node simplify \"remove the n-th node\"?",
              options: [
                "It makes the list doubly linked",
                "It sorts the list",
                "Removing the real head becomes the same code as removing any other node",
                "It doubles the speed",
              ],
              answer: 2,
              why: "Every node, including the real head, now has a predecessor. You always do `prev.next = prev.next.next` and return `dummy.next`.",
            },
            {
              q: "What's the time to access the 1000th node of a linked list?",
              options: ["O(1)", "O(log n)", "O(n) — walk 1000 nodes from the head", "O(n²)"],
              answer: 2,
              why: "There are no indices: you follow `next` pointers one by one.",
            },
            {
              q: "In Floyd's cycle detection, why must the fast pointer eventually meet the slow one inside a cycle?",
              options: [
                "Inside the loop, the gap between them shrinks by exactly one node each step",
                "Because the fast pointer stops",
                "Because JavaScript detects infinite loops",
                "It doesn't always; you also need a Set",
              ],
              answer: 0,
              why: "Fast moves 2, slow moves 1: relative speed 1. The gap goes k, k−1, …, 0 — they can't jump over each other.",
            },
            {
              q: "In the Map-based LRU cache, which key is evicted?",
              options: [
                "The last key in iteration order",
                "A random key",
                "The key with the smallest value",
                "The first key in iteration order — the least recently set",
              ],
              answer: 3,
              why: "Every use deletes and re-inserts a key, pushing it to the end. The first key is the one untouched for the longest time.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Recursion
    // ─────────────────────────────────────────────────────────────
    {
      slug: "recursion",
      title: "Recursion",
      summary: "Functions that call themselves: base case, recursive case, the call stack made visible, and a first taste of memoization and backtracking.",
      minutes: 45,
      blocks: [
        {
          type: "p",
          text: "Some data is **self-similar**: a product category contains sub-categories, which contain sub-categories; a comment has replies, which have replies; a folder contains folders. A **recursive** function mirrors that shape: it solves a big problem by solving a smaller copy of the same problem, then combining. Trees (next two lessons), backtracking and dynamic programming are all built on this, so it's worth getting rock solid.",
        },
        { type: "h", text: "The two parts every recursive function needs" },
        {
          type: "list",
          items: [
            "**Base case**: an input small enough to answer directly, without recursing (`n <= 1`, empty array, `null` node). Without it, the function never stops.",
            "**Recursive case**: call yourself on a *strictly smaller* input, and trust the result (the \"leap of faith\"), then combine it into your answer.",
            "**Progress**: every call must move toward a base case. `f(n)` calling `f(n)` or `f(n + 1)` never ends.",
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "count the products in nested categories",
          code: `// { name, products: number, children: [...categories] }
function countProducts(category) {
  let total = category.products;               // this level
  for (const child of category.children) {
    total += countProducts(child);             // trust: it counts the whole subtree
  }
  return total;                                // base case is implicit: no children → no recursion
}`,
        },
        { type: "h", text: "Seeing the call stack" },
        {
          type: "p",
          text: "Every call gets its own **stack frame** holding its parameters and local variables. A recursive call pushes a new frame on top; when it returns, its frame is popped and the caller continues exactly where it paused. Indenting the logs by depth makes the stack visible:",
        },
        {
          type: "run",
          title: "trace factorial with indentation",
          code: `function factorial(n, depth = 0) {
  const pad = "  ".repeat(depth);
  console.log(pad + "factorial(" + n + ") called");
  if (n <= 1) {
    console.log(pad + "base case → return 1");
    return 1;
  }
  const smaller = factorial(n - 1, depth + 1); // this frame waits here
  const result = n * smaller;
  console.log(pad + "return " + n + " * " + smaller + " = " + result);
  return result;
}

console.log("answer:", factorial(5));`,
        },
        {
          type: "steps",
          items: [
            { title: "Winding", text: "`factorial(5)` calls `factorial(4)`, which calls `factorial(3)`… Five frames are stacked, each paused on the line with the recursive call." },
            { title: "Base case", text: "`factorial(1)` returns `1` without recursing. Its frame is popped." },
            { title: "Unwinding", text: "`factorial(2)` resumes with `smaller = 1` and returns 2; then `factorial(3)` returns 6, `factorial(4)` returns 24…" },
            { title: "Done", text: "`factorial(5)` returns 120 to whoever called it. The stack is back to where it started." },
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Maximum call stack size exceeded",
          text: "The stack is limited (roughly 10,000 frames in browsers and Node, depending on frame size). A missing base case, or recursing 100,000 levels deep on a long linked list, throws `RangeError: Maximum call stack size exceeded`. JavaScript engines don't do tail-call optimisation in practice (only Safari implements it), so for very deep inputs, convert to a loop with an explicit stack.",
        },
        {
          type: "run",
          title: "blowing the stack on purpose",
          code: `function depth(n) {
  return n === 0 ? 0 : 1 + depth(n - 1);
}

console.log(depth(1000)); // fine

try {
  depth(1_000_000);
} catch (e) {
  console.log(e.name + ": " + e.message);
}

// The same thing as a loop: no stack growth at all
function depthLoop(n) {
  let d = 0;
  while (n > 0) { d++; n--; }
  return d;
}
console.log(depthLoop(1_000_000));`,
        },
        {
          type: "compare",
          left: {
            label: "Recursive — mirrors the definition",
            lang: "js",
            code: `// sum of an array = first + sum of the rest
function sum(nums, i = 0) {
  if (i === nums.length) return 0;  // base
  return nums[i] + sum(nums, i + 1); // recursive
}
// O(n) time, O(n) stack space`,
          },
          right: {
            label: "Iterative — a loop",
            lang: "js",
            code: `function sum(nums) {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}
// O(n) time, O(1) space
// For flat data, the loop is simpler.
// For trees and nesting, recursion wins.`,
          },
        },
        { type: "h", text: "Memoization preview: don't solve the same subproblem twice" },
        {
          type: "p",
          text: "Fibonacci: `fib(n) = fib(n - 1) + fib(n - 2)`, with `fib(0) = 0`, `fib(1) = 1`. Written naively, `fib(5)` computes `fib(3)` twice, `fib(2)` three times… the call tree doubles at each level: O(2ⁿ). Caching each answer the first time (**memoization**) makes every `fib(k)` computed once: O(n). This is the seed of dynamic programming, which gets its own track.",
        },
        {
          type: "run",
          title: "count the calls",
          code: `let calls = 0;
function fibNaive(n) {
  calls++;
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}
console.log("naive fib(25) =", fibNaive(25), "in", calls, "calls");

calls = 0;
function fibMemo(n, memo = new Map()) {
  calls++;
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, value);
  return value;
}
console.log("memo  fib(25) =", fibMemo(25), "in", calls, "calls");`,
        },
        {
          type: "compare",
          left: {
            label: "Naive — O(2ⁿ) time",
            lang: "js",
            code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
// fib(50): ~40 billion calls. Hours.`,
          },
          right: {
            label: "Memoized — O(n) time, O(n) space",
            lang: "js",
            code: `function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));
}
// fib(50): 99 calls. Instant.`,
          },
        },
        {
          type: "challenge",
          title: "Fibonacci Number",
          difficulty: "easy",
          tags: ["recursion", "memoization"],
          prompt: "Return the n-th Fibonacci number: `fib(0) = 0`, `fib(1) = 1`, and `fib(n) = fib(n - 1) + fib(n - 2)`. It must be fast for `n` up to 70 — so the naive version won't do.",
          examples: [
            { input: "n = 2", output: "1" },
            { input: "n = 10", output: "55" },
          ],
          constraints: ["0 <= n <= 70 (results stay below 2^53)"],
          complexity: "O(n) time, O(n) space",
          starter: `function fib(n) {
  // your code here
}`,
          solution: `function fib(n, memo = new Map()) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, value);
  return value;
}`,
          tests: [
            { name: "base cases: fib(0) = 0, fib(1) = 1", code: "return fib(0) === 0 && fib(1) === 1;" },
            { name: "fib(2) = 1 and fib(10) = 55", code: "return fib(2) === 1 && fib(10) === 55;" },
            { name: "fib(30) = 832040", code: "return fib(30) === 832040;" },
            {
              name: "fast: fib(70) = 190392490709135 (naive recursion would take hours)",
              code: "const t0 = performance.now(); return fib(70) === 190392490709135 && performance.now() - t0 < 200;",
            },
          ],
          hint: "Keep a `Map` (or object) from `n` to its answer. Check it before recursing, fill it after. Pass it down as a parameter so every call shares it.",
        },
        {
          type: "p",
          text: "Recursion can also *halve* a problem instead of shrinking it by one. `x¹⁰ = (x⁵)²`, and `x⁵ = x · (x²)²`. Each step halves the exponent, so `x` to the power of two billion takes about 31 multiplications instead of two billion. That's **fast exponentiation** — and halving is why it's O(log n), just like binary search.",
        },
        {
          type: "challenge",
          title: "Pow(x, n)",
          difficulty: "medium",
          tags: ["recursion", "math", "divide and conquer"],
          prompt: "Implement `myPow(x, n)` which returns `x` raised to the integer power `n` (n can be negative or zero), **without** using `Math.pow` or `**`. It must run in O(log |n|).",
          examples: [
            { input: "x = 2, n = 10", output: "1024" },
            { input: "x = 2.1, n = 3", output: "9.261 (approximately)" },
            { input: "x = 2, n = -2", output: "0.25", explanation: "2^-2 = 1 / 2^2" },
          ],
          constraints: ["-100 < x < 100", "-2^31 <= n <= 2^31 - 1", "x is not 0 when n < 0"],
          complexity: "O(log n) time, O(log n) stack",
          starter: `function myPow(x, n) {
  // your code here
}`,
          solution: `function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / myPow(x, -n);
  const half = myPow(x, Math.floor(n / 2)); // not n >> 1: 2^31 doesn't fit in 32 bits
  return n % 2 === 0 ? half * half : half * half * x;
}`,
          tests: [
            { name: "2^10 = 1024", code: "return myPow(2, 10) === 1024;" },
            { name: "2.1^3 ≈ 9.261", code: "return Math.abs(myPow(2.1, 3) - 9.261) < 1e-9;" },
            { name: "negative exponent: 2^-2 = 0.25", code: "return myPow(2, -2) === 0.25;" },
            { name: "anything^0 = 1, and 1^-2147483648 = 1", code: "return myPow(7.5, 0) === 1 && myPow(1, -2147483648) === 1;" },
            {
              name: "fast: 1.0000001^(2^31 - 1) without a two-billion-step loop",
              code: `const t0 = performance.now();
const r = myPow(1.0000001, 2147483647);
const expected = Math.exp(2147483647 * Math.log(1.0000001));
return Math.abs(r - expected) / expected < 1e-6 && performance.now() - t0 < 100;`,
            },
          ],
          hint: "Compute `half = myPow(x, floor(n / 2))` once, then return `half * half` (times one extra `x` if n is odd). Handle `n < 0` with `1 / myPow(x, -n)`.",
        },
        {
          type: "p",
          text: "Recursion shines on **nested data of unknown depth**. When you meet an element, ask: is it the simple kind (append it) or a smaller copy of the whole problem (recurse on it)?",
        },
        {
          type: "challenge",
          title: "Flatten a Nested Array",
          difficulty: "easy",
          tags: ["recursion", "array"],
          prompt: "A Shopify export gives you product SKUs grouped in arrays nested to any depth. Write `flatten(arr)` that returns a new flat array with every non-array value, in order. Don't use the built-in `Array.prototype.flat`.",
          examples: [
            { input: '["tee-s", ["tee-m", ["tee-l", ["tee-xl"]]], "cap"]', output: '["tee-s","tee-m","tee-l","tee-xl","cap"]' },
            { input: "[[[]], []]", output: "[]" },
          ],
          constraints: ["nesting depth <= 1000"],
          complexity: "O(total elements) time",
          starter: `function flatten(arr) {
  // your code here
}`,
          solution: `function flatten(arr) {
  const out = [];
  const walk = (items) => {
    for (const item of items) {
      if (Array.isArray(item)) walk(item); // a smaller copy of the problem
      else out.push(item);                 // the simple kind
    }
  };
  walk(arr);
  return out;
}`,
          tests: [
            {
              name: "deeply nested SKUs keep their order",
              code: 'return deepEqual(flatten(["tee-s", ["tee-m", ["tee-l", ["tee-xl"]]], "cap"]), ["tee-s","tee-m","tee-l","tee-xl","cap"]);',
            },
            { name: "only empty arrays → []", code: "return deepEqual(flatten([[[]], []]), []);" },
            { name: "already flat stays the same", code: "return deepEqual(flatten([1, 2, 3]), [1, 2, 3]);" },
            { name: "keeps falsy values like 0, '' and null", code: 'return deepEqual(flatten([0, ["", [null]], false]), [0, "", null, false]);' },
            {
              name: "does not use the built-in .flat()",
              code: `const original = Array.prototype.flat;
Array.prototype.flat = function () { throw new Error("no .flat() allowed"); };
try {
  return deepEqual(flatten([1, [2, [3]]]), [1, 2, 3]);
} finally {
  Array.prototype.flat = original;
}`,
            },
          ],
          hint: "Loop over the items. `Array.isArray(item)` → recurse into it; otherwise push it into a shared output array.",
        },
        { type: "h", text: "Preview: generating every possibility (backtracking)" },
        {
          type: "p",
          text: "To list every subset of `[a, b, c]`, make one decision per element: **take it or skip it**. That's a binary tree of choices with 2³ = 8 leaves, and recursion walks it naturally: decide for element `i`, recurse on `i + 1`, then *undo* the choice and try the other branch. That \"choose → explore → un-choose\" rhythm is **backtracking**, which a later track covers in depth.",
        },
        {
          type: "run",
          title: "take-or-skip decision tree",
          code: `function subsetsTraced(items) {
  const result = [];
  const current = [];
  function explore(i, depth) {
    const pad = "  ".repeat(depth);
    if (i === items.length) {
      console.log(pad + "→ [" + current.join(", ") + "]");
      result.push([...current]); // copy! current keeps changing
      return;
    }
    console.log(pad + "take " + items[i]);
    current.push(items[i]);     // choose
    explore(i + 1, depth + 1);
    current.pop();              // un-choose
    console.log(pad + "skip " + items[i]);
    explore(i + 1, depth + 1);
  }
  explore(0, 0);
  return result;
}

const addOns = ["SEO", "Ads", "Hosting"];
console.log(subsetsTraced(addOns).length, "possible packages");`,
        },
        {
          type: "challenge",
          title: "Subsets",
          difficulty: "medium",
          tags: ["recursion", "backtracking"],
          prompt: "Given an array `nums` of **distinct** integers, return all possible subsets (the power set). No duplicate subsets; any order is fine, for both the list and the items inside each subset.",
          examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" },
            { input: "nums = [0]", output: "[[],[0]]" },
          ],
          constraints: ["0 <= nums.length <= 10", "all values distinct"],
          complexity: "O(n · 2ⁿ) time",
          starter: `function subsets(nums) {
  // your code here
}`,
          solution: `function subsets(nums) {
  const result = [];
  const current = [];
  function explore(i) {
    if (i === nums.length) {
      result.push([...current]);
      return;
    }
    current.push(nums[i]); // take
    explore(i + 1);
    current.pop();         // skip
    explore(i + 1);
  }
  explore(0);
  return result;
}`,
          tests: [
            {
              name: "[1,2,3] → all 8 subsets",
              code: `const norm = (list) => list.map((s) => [...s].sort((a, b) => a - b));
return sameMembers(norm(subsets([1,2,3])), norm([[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]));`,
            },
            { name: "[0] → [[], [0]]", code: "return sameMembers(subsets([0]), [[], [0]]);" },
            { name: "empty input → [[]] (one subset: the empty one)", code: "return deepEqual(subsets([]), [[]]);" },
            {
              name: "10 elements → 1024 distinct subsets",
              code: `const r = subsets([1,2,3,4,5,6,7,8,9,10]);
const keys = new Set(r.map((s) => [...s].sort((a, b) => a - b).join(",")));
return r.length === 1024 && keys.size === 1024;`,
            },
          ],
          hint: "For each index, branch twice: once with `nums[i]` added to the current subset, once without. When you reach the end, push a **copy** of the current subset.",
        },
        {
          type: "p",
          text: "Last one: spot the Fibonacci in disguise. To reach step `n`, your final move was either 1 step (from `n - 1`) or 2 steps (from `n - 2`). So `ways(n) = ways(n - 1) + ways(n - 2)` — the same recursion, with the same exponential trap.",
        },
        {
          type: "challenge",
          title: "Climbing Stairs",
          difficulty: "easy",
          tags: ["recursion", "memoization", "dynamic programming"],
          prompt: "You're climbing a staircase of `n` steps. Each move climbs 1 or 2 steps. In how many distinct ways can you reach the top?",
          examples: [
            { input: "n = 2", output: "2", explanation: "1+1 or 2" },
            { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
          ],
          constraints: ["1 <= n <= 45"],
          complexity: "O(n) time",
          starter: `function climbStairs(n) {
  // your code here
}`,
          solution: `function climbStairs(n, memo = new Map()) {
  if (n <= 2) return n; // 1 way for 1 step, 2 ways for 2 steps
  if (memo.has(n)) return memo.get(n);
  const ways = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  memo.set(n, ways);
  return ways;
}`,
          tests: [
            { name: "n = 2 → 2", code: "return climbStairs(2) === 2;" },
            { name: "n = 3 → 3", code: "return climbStairs(3) === 3;" },
            { name: "n = 1 → 1", code: "return climbStairs(1) === 1;" },
            { name: "n = 5 → 8", code: "return climbStairs(5) === 8;" },
            {
              name: "fast: n = 45 → 1836311903",
              code: "const t0 = performance.now(); return climbStairs(45) === 1836311903 && performance.now() - t0 < 200;",
            },
          ],
          hint: "`ways(n) = ways(n - 1) + ways(n - 2)` with `ways(1) = 1`, `ways(2) = 2`. Memoize — or loop with two variables.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Recursion in your stack",
          text: "React renders recursively: a component returns elements, React renders their components, and so on down the tree. A **nested comments** component that renders `<Comment>` inside `<Comment>` for replies is recursion in JSX — its base case is \"no replies\". With Supabase, a self-referencing table (`categories.parent_id`) is usually queried with a recursive CTE (`WITH RECURSIVE`) — same base case / recursive case idea, in SQL.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What happens if a recursive function has no reachable base case?",
              options: [
                "It returns undefined",
                "It runs until the call stack overflows: RangeError: Maximum call stack size exceeded",
                "JavaScript turns it into a loop",
                "It returns 0",
              ],
              answer: 1,
              why: "Each call pushes a frame; without a base case nothing ever pops, and the engine throws once the stack limit is reached.",
            },
            {
              q: "Naive recursive `fib(n)` is O(2ⁿ). What does memoization bring it to?",
              options: ["O(log n)", "O(n²)", "O(n)", "Still O(2ⁿ)"],
              answer: 2,
              why: "Each `fib(k)` for k ≤ n is computed once and then read from the cache: n computations of O(1) each.",
            },
            {
              q: "Why is fast exponentiation O(log n)?",
              options: [
                "Each recursive call halves the exponent",
                "It uses Math.pow internally",
                "It caches results",
                "Multiplication is O(1)",
              ],
              answer: 0,
              why: "`x^n` is computed from `x^(n/2)`, so the depth is the number of times you can halve n: log₂ n.",
            },
            {
              q: "In the subsets backtracking, why push `[...current]` rather than `current`?",
              options: [
                "Spread is faster",
                "To sort the subset",
                "Arrays can't be pushed into arrays",
                "`current` keeps being mutated; without a copy, every saved subset would be the same (finally empty) array",
              ],
              answer: 3,
              why: "Pushing `current` stores a reference to one shared array. After all the pops it's `[]`, so you'd get 2ⁿ references to the same empty array.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. Trees: DFS
    // ─────────────────────────────────────────────────────────────
    {
      slug: "trees-dfs",
      title: "Trees: depth-first search",
      summary: "Tree vocabulary, the three DFS orders (recursive and iterative), and the 'return info up the tree' pattern behind depth, diameter, path sums and BST validation.",
      minutes: 60,
      blocks: [
        {
          type: "p",
          text: "A **tree** is a linked list where each node can point to several children. Binary trees — at most a `left` and a `right` child — are the interview favourite. Almost every tree problem is solved the same way: **ask each child for something, combine the answers at the current node, return something to your parent.** That's depth-first search (DFS) with recursion, and once it clicks, a whole category of problems becomes 5–10 lines.",
        },
        {
          type: "table",
          rows: [
            ["Term", "Meaning"],
            ["root", "The top node (no parent)"],
            ["leaf", "A node with no children"],
            ["depth of a node", "Number of edges from the root down to it (root = 0)"],
            ["height / max depth of a tree", "Number of nodes on the longest root-to-leaf path (LeetCode counts nodes: a single node has max depth 1)"],
            ["subtree", "A node plus all its descendants — itself a tree"],
            ["binary search tree (BST)", "For every node: all values in the left subtree are smaller, all in the right subtree are larger"],
            ["balanced", "Left and right heights differ by at most 1 at every node, so height is O(log n)"],
          ],
        },
        {
          type: "p",
          text: "Tests and examples use LeetCode's **level-order** array format: values row by row, `null` for a missing child. `toTree([3,9,20,null,null,15,7])` builds this tree (`fromTree` turns it back into the array):",
        },
        {
          type: "code",
          lang: "text",
          title: "toTree([3,9,20,null,null,15,7])",
          code: `        3
       / \\
      9   20
         /  \\
        15   7

TreeNode { val, left, right }   // predefined, like ListNode`,
        },
        { type: "h", text: "The three depth-first orders" },
        {
          type: "p",
          text: "DFS goes as deep as possible down one branch before backing up. The only question is *when* you handle the current node relative to its children:",
        },
        {
          type: "table",
          rows: [
            ["Order", "Visit", "On the tree above", "Typical use"],
            ["preorder", "node → left → right", "3, 9, 20, 15, 7", "Copy/serialise a tree; pass info *down* (path so far)"],
            ["inorder", "left → node → right", "9, 3, 15, 20, 7", "On a BST, yields values in **sorted** order"],
            ["postorder", "left → right → node", "9, 15, 7, 20, 3", "Compute from children's answers: height, sizes, deleting a tree"],
          ],
        },
        {
          type: "run",
          title: "recursive and iterative traversals",
          code: `const root = toTree([3, 9, 20, null, null, 15, 7]);

// Recursive: the order of three lines is the only difference
function preorder(node, out = []) {
  if (!node) return out;
  out.push(node.val);
  preorder(node.left, out);
  preorder(node.right, out);
  return out;
}
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}
function postorder(node, out = []) {
  if (!node) return out;
  postorder(node.left, out);
  postorder(node.right, out);
  out.push(node.val);
  return out;
}
console.log("pre ", preorder(root));
console.log("in  ", inorder(root));
console.log("post", postorder(root));

// Iterative preorder: an explicit stack replaces the call stack.
// Push right first so left is popped (visited) first.
function preorderIter(root) {
  const out = [], stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return out;
}

// Iterative inorder: go left as far as possible, then visit, then go right once.
function inorderIter(root) {
  const out = [], stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }
  return out;
}
console.log("pre  (iterative)", preorderIter(root));
console.log("in   (iterative)", inorderIter(root));`,
        },
        {
          type: "compare",
          left: {
            label: "Recursive — O(n) time, O(h) stack",
            lang: "js",
            code: `function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out);
  out.push(node.val);
  inorder(node.right, out);
  return out;
}
// Short and obvious. Uses the call stack:
// depth h (≈ log n balanced, n worst case).`,
          },
          right: {
            label: "Iterative — O(n) time, O(h) explicit stack",
            lang: "js",
            code: `function inorder(root) {
  const out = [], stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    out.push(node.val);
    node = node.right;
  }
  return out;
}
// Same complexity, but survives a 100,000-deep
// skewed tree that would overflow the call stack.`,
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: "The recipe for (almost) every tree problem",
          text: "1) What should my function return for an empty tree (`null`)? That's the base case. 2) If I magically had the answer for `node.left` and `node.right`, how do I build the answer for `node`? 3) Does the global answer differ from what I return to my parent? If so, keep a separate `best` variable (see Diameter).",
        },
        {
          type: "challenge",
          title: "Maximum Depth of Binary Tree",
          difficulty: "easy",
          tags: ["tree", "dfs", "recursion"],
          prompt: "Return the maximum depth of a binary tree: the number of nodes on the longest path from the root down to a leaf. An empty tree has depth 0.",
          examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3" },
            { input: "root = [1,null,2]", output: "2" },
          ],
          constraints: ["0 <= nodes <= 10^4"],
          complexity: "O(n) time, O(h) space",
          starter: `function maxDepth(root) {
  // your code here
}`,
          solution: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
          tests: [
            { name: "[3,9,20,null,null,15,7] → 3", code: "return maxDepth(toTree([3,9,20,null,null,15,7])) === 3;" },
            { name: "[1,null,2] → 2", code: "return maxDepth(toTree([1,null,2])) === 2;" },
            { name: "empty tree → 0", code: "return maxDepth(null) === 0;" },
            { name: "single node → 1", code: "return maxDepth(toTree([1])) === 1;" },
          ],
          hint: "Empty → 0. Otherwise 1 (this node) + the deeper of the two subtrees.",
        },
        {
          type: "challenge",
          title: "Invert Binary Tree",
          difficulty: "easy",
          tags: ["tree", "dfs", "recursion"],
          prompt: "Mirror a binary tree: swap the left and right child of **every** node. Return the root.",
          examples: [
            { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" },
            { input: "root = [2,1,3]", output: "[2,3,1]" },
          ],
          constraints: ["0 <= nodes <= 100"],
          complexity: "O(n) time, O(h) space",
          starter: `function invertTree(root) {
  // your code here
}`,
          solution: `function invertTree(root) {
  if (!root) return null;
  const left = invertTree(root.left);
  root.left = invertTree(root.right);
  root.right = left;
  return root;
}`,
          tests: [
            { name: "[4,2,7,1,3,6,9] → [4,7,2,9,6,3,1]", code: "return deepEqual(fromTree(invertTree(toTree([4,2,7,1,3,6,9]))), [4,7,2,9,6,3,1]);" },
            { name: "[2,1,3] → [2,3,1]", code: "return deepEqual(fromTree(invertTree(toTree([2,1,3]))), [2,3,1]);" },
            { name: "empty tree → null", code: "return invertTree(null) === null;" },
            { name: "uneven tree [1,2,null,3] → [1,null,2,null,3]", code: "return deepEqual(fromTree(invertTree(toTree([1,2,null,3]))), [1,null,2,null,3]);" },
          ],
          hint: "Invert both subtrees, then swap them. Careful not to overwrite `root.left` before you've used it.",
        },
        {
          type: "challenge",
          title: "Same Tree",
          difficulty: "easy",
          tags: ["tree", "dfs", "recursion"],
          prompt: "Given the roots of two binary trees `p` and `q`, return `true` if they have exactly the same shape and the same values at every position.",
          examples: [
            { input: "p = [1,2,3], q = [1,2,3]", output: "true" },
            { input: "p = [1,2], q = [1,null,2]", output: "false" },
            { input: "p = [1,2,1], q = [1,1,2]", output: "false" },
          ],
          constraints: ["0 <= nodes in each tree <= 100"],
          complexity: "O(n) time, O(h) space",
          starter: `function isSameTree(p, q) {
  // your code here
}`,
          solution: `function isSameTree(p, q) {
  if (!p && !q) return true;          // both empty
  if (!p || !q) return false;         // only one empty
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
          tests: [
            { name: "[1,2,3] vs [1,2,3] → true", code: "return isSameTree(toTree([1,2,3]), toTree([1,2,3])) === true;" },
            { name: "different shape: [1,2] vs [1,null,2] → false", code: "return isSameTree(toTree([1,2]), toTree([1,null,2])) === false;" },
            { name: "different values: [1,2,1] vs [1,1,2] → false", code: "return isSameTree(toTree([1,2,1]), toTree([1,1,2])) === false;" },
            { name: "two empty trees → true; empty vs [0] → false", code: "return isSameTree(null, null) === true && isSameTree(null, toTree([0])) === false;" },
          ],
          hint: "Handle the null cases first (both null / exactly one null), then compare values and recurse on both sides.",
        },
        {
          type: "p",
          text: "Here the recipe's step 3 matters. The longest path between two nodes might bend at any node, not just the root. At each node, the longest path *through* it is `leftHeight + rightHeight` edges — but what you return to your parent is the height, because a path going up can only continue down **one** side. Keep a global `best` for the first, return the second.",
        },
        {
          type: "challenge",
          title: "Diameter of Binary Tree",
          difficulty: "easy",
          tags: ["tree", "dfs", "recursion"],
          prompt: "Return the length of the **diameter** of a binary tree: the number of edges on the longest path between any two nodes. The path may or may not pass through the root.",
          examples: [
            { input: "root = [1,2,3,4,5]", output: "3", explanation: "Path 4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3)." },
            { input: "root = [1,2]", output: "1" },
          ],
          constraints: ["1 <= nodes <= 10^4"],
          complexity: "O(n) time, O(h) space",
          starter: `function diameterOfBinaryTree(root) {
  // your code here
}`,
          solution: `function diameterOfBinaryTree(root) {
  let best = 0;
  function height(node) {
    if (!node) return 0;
    const l = height(node.left);
    const r = height(node.right);
    best = Math.max(best, l + r); // longest path bending at this node
    return 1 + Math.max(l, r);    // what the parent can extend
  }
  height(root);
  return best;
}`,
          tests: [
            { name: "[1,2,3,4,5] → 3", code: "return diameterOfBinaryTree(toTree([1,2,3,4,5])) === 3;" },
            { name: "[1,2] → 1", code: "return diameterOfBinaryTree(toTree([1,2])) === 1;" },
            { name: "single node → 0", code: "return diameterOfBinaryTree(toTree([1])) === 0;" },
            {
              name: "longest path skips the root: [1,2,null,3,4,5,null,null,6] → 4",
              code: "return diameterOfBinaryTree(toTree([1,2,null,3,4,5,null,null,6])) === 4;",
            },
          ],
          hint: "Write a helper that returns the height of a subtree, and as a side effect updates `best` with `leftHeight + rightHeight`.",
        },
        {
          type: "p",
          text: "Sometimes information flows **down** instead of up: pass what's left of the target to each child (preorder style). The trap is the definition of a leaf — a node with one child is *not* the end of a path.",
        },
        {
          type: "challenge",
          title: "Path Sum",
          difficulty: "easy",
          tags: ["tree", "dfs", "recursion"],
          prompt: "Given a binary tree and an integer `targetSum`, return `true` if there's a **root-to-leaf** path whose values add up to `targetSum`. A leaf is a node with no children.",
          examples: [
            { input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22", output: "true", explanation: "5 → 4 → 11 → 2" },
            { input: "root = [1,2,3], targetSum = 5", output: "false" },
            { input: "root = [], targetSum = 0", output: "false", explanation: "An empty tree has no paths." },
          ],
          constraints: ["0 <= nodes <= 5000", "-1000 <= node.val <= 1000", "-1000 <= targetSum <= 1000"],
          complexity: "O(n) time, O(h) space",
          starter: `function hasPathSum(root, targetSum) {
  // your code here
}`,
          solution: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  const remaining = targetSum - root.val;
  if (!root.left && !root.right) return remaining === 0; // a leaf
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}`,
          tests: [
            { name: "example tree, 22 → true", code: "return hasPathSum(toTree([5,4,8,11,null,13,4,7,2,null,null,null,1]), 22) === true;" },
            { name: "[1,2,3], 5 → false", code: "return hasPathSum(toTree([1,2,3]), 5) === false;" },
            { name: "empty tree, 0 → false", code: "return hasPathSum(null, 0) === false;" },
            { name: "root with one child is not a leaf: [1,2], 1 → false", code: "return hasPathSum(toTree([1,2]), 1) === false;" },
            { name: "negative values: [-2,null,-3], -5 → true", code: "return hasPathSum(toTree([-2,null,-3]), -5) === true;" },
          ],
          hint: "Subtract the node's value from the target and pass the remainder down. Only at a real leaf (no left AND no right) check if it's 0.",
        },
        {
          type: "p",
          text: "A **BST** gives you a superpower: at each node you know which side a value lives on, so you only walk one path — O(h) instead of O(n). For the lowest common ancestor of `p` and `q`: if both are smaller than the node, it's on the left; both larger, on the right; otherwise they split here, so this node *is* the answer.",
        },
        {
          type: "challenge",
          title: "Lowest Common Ancestor of a BST",
          difficulty: "medium",
          tags: ["tree", "binary search tree"],
          prompt: "Given a binary **search** tree and two of its nodes `p` and `q`, return their lowest common ancestor: the deepest node that has both `p` and `q` as descendants (a node counts as a descendant of itself). Return the node itself.",
          examples: [
            { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8", output: "6" },
            { input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4", output: "2", explanation: "2 is an ancestor of 4, and of itself." },
          ],
          constraints: ["2 <= nodes <= 10^5", "all values unique", "p and q exist in the tree"],
          complexity: "O(h) time, O(1) space",
          starter: `function lowestCommonAncestor(root, p, q) {
  // your code here
}`,
          solution: `function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node; // they split here (or one of them is this node)
  }
  return null;
}`,
          tests: [
            {
              name: "p = 2, q = 8 → 6 (the root)",
              code: `const root = toTree([6,2,8,0,4,7,9,null,null,3,5]);
const find = (n, v) => (n.val === v ? n : find(v < n.val ? n.left : n.right, v));
return lowestCommonAncestor(root, find(root, 2), find(root, 8)) === root;`,
            },
            {
              name: "p = 2, q = 4 → 2 (a node is its own descendant)",
              code: `const root = toTree([6,2,8,0,4,7,9,null,null,3,5]);
const find = (n, v) => (n.val === v ? n : find(v < n.val ? n.left : n.right, v));
return lowestCommonAncestor(root, find(root, 2), find(root, 4)) === find(root, 2);`,
            },
            {
              name: "deep pair: p = 3, q = 5 → 4",
              code: `const root = toTree([6,2,8,0,4,7,9,null,null,3,5]);
const find = (n, v) => (n.val === v ? n : find(v < n.val ? n.left : n.right, v));
return lowestCommonAncestor(root, find(root, 3), find(root, 5))?.val === 4;`,
            },
            {
              name: "two-node tree [2,1], p = 2, q = 1 → 2",
              code: "const root = toTree([2,1]); return lowestCommonAncestor(root, root, root.left) === root;",
            },
          ],
          hint: "Walk down from the root. Both values smaller → go left. Both larger → go right. Anything else → you're at the split point.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "The classic BST validation bug",
          text: "Checking only `node.left.val < node.val < node.right.val` at each node is **wrong**: in `[5,4,6,null,null,3,7]`, every parent/child pair looks fine, but `3` sits in the right subtree of `5`. Every node must respect *all* its ancestors. Pass down an allowed range `(low, high)` — or use the fact that an inorder traversal of a valid BST is strictly increasing.",
        },
        {
          type: "challenge",
          title: "Validate Binary Search Tree",
          difficulty: "medium",
          tags: ["tree", "dfs", "binary search tree"],
          prompt: "Return `true` if the binary tree is a valid BST: for every node, all values in its left subtree are **strictly** smaller and all values in its right subtree are **strictly** larger, and both subtrees are BSTs too.",
          examples: [
            { input: "root = [2,1,3]", output: "true" },
            { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "4 is in 5's right subtree but smaller than 5." },
          ],
          constraints: ["1 <= nodes <= 10^4", "-2^31 <= values <= 2^31 - 1"],
          complexity: "O(n) time, O(h) space",
          starter: `function isValidBST(root) {
  // your code here
}`,
          solution: `function isValidBST(root, low = -Infinity, high = Infinity) {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
}`,
          tests: [
            { name: "[2,1,3] → true", code: "return isValidBST(toTree([2,1,3])) === true;" },
            { name: "[5,1,4,null,null,3,6] → false", code: "return isValidBST(toTree([5,1,4,null,null,3,6])) === false;" },
            { name: "grandchild breaks the rule: [5,4,6,null,null,3,7] → false", code: "return isValidBST(toTree([5,4,6,null,null,3,7])) === false;" },
            { name: "duplicates are not allowed: [1,1] → false", code: "return isValidBST(toTree([1,1])) === false;" },
            { name: "extreme values: [2147483647] and [-2147483648,null,2147483647] → true", code: "return isValidBST(toTree([2147483647])) === true && isValidBST(toTree([-2147483648,null,2147483647])) === true;" },
          ],
          hint: "Give each recursive call the open interval `(low, high)` its values must fall into. Going left, `high` becomes the node's value; going right, `low` does. Start with `-Infinity` and `Infinity`.",
        },
        {
          type: "p",
          text: "The final boss combines everything: like Diameter, the best path can bend at any node (track a global best), and like Path Sum it's about values. New twist: values can be negative, so a child's contribution is only worth taking if it's positive — `Math.max(0, gain)`.",
        },
        {
          type: "challenge",
          title: "Binary Tree Maximum Path Sum",
          difficulty: "hard",
          tags: ["tree", "dfs", "recursion"],
          prompt: "A **path** is any sequence of nodes where each adjacent pair is connected by an edge; a node appears at most once and the path doesn't have to pass through the root. It contains at least one node. Return the maximum sum of node values over all paths.",
          examples: [
            { input: "root = [1,2,3]", output: "6", explanation: "2 → 1 → 3" },
            { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "15 → 20 → 7" },
          ],
          constraints: ["1 <= nodes <= 3 * 10^4", "-1000 <= node.val <= 1000"],
          complexity: "O(n) time, O(h) space",
          starter: `function maxPathSum(root) {
  // your code here
}`,
          solution: `function maxPathSum(root) {
  let best = -Infinity;
  // best sum of a path that starts at node and goes down one side
  function gain(node) {
    if (!node) return 0;
    const left = Math.max(0, gain(node.left));   // drop negative branches
    const right = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + left + right); // path bending here
    return node.val + Math.max(left, right);        // parent can only extend one side
  }
  gain(root);
  return best;
}`,
          tests: [
            { name: "[1,2,3] → 6", code: "return maxPathSum(toTree([1,2,3])) === 6;" },
            { name: "[-10,9,20,null,null,15,7] → 42 (skips the root)", code: "return maxPathSum(toTree([-10,9,20,null,null,15,7])) === 42;" },
            { name: "single negative node [-3] → -3", code: "return maxPathSum(toTree([-3])) === -3;" },
            { name: "all negative [-1,-2,-3] → -1", code: "return maxPathSum(toTree([-1,-2,-3])) === -1;" },
            { name: "drop a negative child: [2,-1] → 2", code: "return maxPathSum(toTree([2,-1])) === 2;" },
            { name: "bigger tree [5,4,8,11,null,13,4,7,2,null,null,null,1] → 48", code: "return maxPathSum(toTree([5,4,8,11,null,13,4,7,2,null,null,null,1])) === 48;" },
          ],
          hint: "Helper `gain(node)` = the best downward path starting at `node` (only one side). At each node, update the global best with `val + max(0, leftGain) + max(0, rightGain)`. Start `best` at `-Infinity`, not 0.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Trees in your stack",
          text: "The DOM and React's component tree are trees; React reconciles them depth-first. The Next.js App Router turns your `app/` folder tree into nested layouts: rendering `/dashboard/invoices` wraps the page in every `layout.tsx` along the root-to-leaf path. And the Postgres indexes behind Supabase are B-trees — search trees with many children per node, kept balanced so lookups stay O(log n).",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which traversal of a valid BST returns the values in sorted order?",
              options: ["Preorder", "Postorder", "Level order", "Inorder"],
              answer: 3,
              why: "Inorder visits the left subtree (all smaller), then the node, then the right subtree (all larger).",
            },
            {
              q: "What's the space complexity of recursive DFS on a tree of height h?",
              options: ["O(1)", "O(h) — one stack frame per level of the current path", "O(n²)", "O(2ⁿ)"],
              answer: 1,
              why: "Only the frames on the current root-to-node path are on the stack at once. Balanced: O(log n). A degenerate (linked-list-like) tree: O(n).",
            },
            {
              q: "In Diameter of Binary Tree, why does the helper return the height instead of the diameter?",
              options: [
                "Because the parent can only extend a path down one side; the bent path is recorded separately in `best`",
                "Because heights are faster to compute",
                "Because the diameter always passes through the root",
                "It's a bug; it should return the diameter",
              ],
              answer: 0,
              why: "A path that continues to the parent can't use both children. So you return the one-sided length and keep the two-sided maximum in a global.",
            },
            {
              q: "You need the sum of all values in each subtree. Which order fits naturally?",
              options: ["Preorder", "Inorder", "Postorder", "Any order needs a queue"],
              answer: 2,
              why: "A subtree's sum needs both children's sums first: left, right, then the node — postorder.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Trees: BFS
    // ─────────────────────────────────────────────────────────────
    {
      slug: "trees-bfs",
      title: "Trees: breadth-first search",
      summary: "Walk a tree level by level with a queue: level order, right side view, minimum depth, zigzag — and turning a tree into a string and back.",
      minutes: 45,
      blocks: [
        {
          type: "p",
          text: "DFS dives down one branch at a time. **Breadth-first search** (BFS) does the opposite: it visits the root, then every node at depth 1, then every node at depth 2… like ripples spreading out. The tool for \"process things in the order you discovered them\" is a **queue** (lesson 1). Whenever a problem talks about **levels**, rows, \"nearest\", \"minimum number of steps\", or what you'd see from the side of the tree, think BFS.",
        },
        {
          type: "steps",
          items: [
            { title: "Start", text: "Queue: `[3]`. On the tree `[3,9,20,null,null,15,7]`." },
            { title: "Level 0", text: "The queue holds 1 node → this level has 1 node. Take `3`, enqueue its children `9`, `20`. Level: `[3]`. Queue: `[9, 20]`." },
            { title: "Level 1", text: "The queue holds 2 nodes → take exactly 2. `9` has no children; `20` adds `15`, `7`. Level: `[9, 20]`. Queue: `[15, 7]`." },
            { title: "Level 2", text: "Take 2: `15`, `7`, no children. Level: `[15, 7]`. Queue empty → done: `[[3], [9, 20], [15, 7]]`." },
          ],
        },
        {
          type: "p",
          text: "The key trick is in the steps above: **snapshot the queue's size at the start of each level**. Those are exactly the nodes of the current level; anything enqueued while you process them belongs to the next one. A simple way to avoid `shift()` entirely: keep the current level in one array and build the next level in another.",
        },
        {
          type: "run",
          title: "level-order BFS, two styles",
          code: `const root = toTree([3, 9, 20, null, null, 15, 7]);

// Style 1: one queue + size snapshot (head index instead of shift)
function levelsWithQueue(root) {
  const result = [];
  const queue = root ? [root] : [];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head; // nodes in this level
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    console.log("level", result.length, "→", level);
    result.push(level);
  }
  return result;
}

// Style 2: current level array → next level array
function levelsWithArrays(root) {
  const result = [];
  let level = root ? [root] : [];
  while (level.length) {
    result.push(level.map((n) => n.val));
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return result;
}

console.log(levelsWithQueue(root));
console.log(levelsWithArrays(root));`,
        },
        {
          type: "compare",
          left: {
            label: "DFS with a depth parameter",
            lang: "js",
            code: `// Also O(n), and works for level order too:
function levelOrder(root) {
  const result = [];
  (function dfs(node, depth) {
    if (!node) return;
    (result[depth] ??= []).push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  })(root, 0);
  return result;
}
// But it can't stop early, and it
// recurses as deep as the tree is tall.`,
          },
          right: {
            label: "BFS with a queue",
            lang: "js",
            code: `function levelOrder(root) {
  const result = [];
  let level = root ? [root] : [];
  while (level.length) {
    result.push(level.map((n) => n.val));
    level = level.flatMap((n) =>
      [n.left, n.right].filter(Boolean)
    );
  }
  return result;
}
// O(n) time, O(width) space. Can stop at the
// first level where a condition holds.`,
          },
        },
        {
          type: "challenge",
          title: "Binary Tree Level Order Traversal",
          difficulty: "medium",
          tags: ["tree", "bfs", "queue"],
          prompt: "Return the values of a binary tree level by level, left to right: an array of arrays, one per level.",
          examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
            { input: "root = [1]", output: "[[1]]" },
            { input: "root = []", output: "[]" },
          ],
          constraints: ["0 <= nodes <= 2000"],
          complexity: "O(n) time, O(n) space",
          starter: `function levelOrder(root) {
  // your code here
}`,
          solution: `function levelOrder(root) {
  const result = [];
  const queue = root ? [root] : [];
  let head = 0;
  while (head < queue.length) {
    const size = queue.length - head;
    const level = [];
    for (let i = 0; i < size; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
          tests: [
            { name: "[3,9,20,null,null,15,7] → [[3],[9,20],[15,7]]", code: "return deepEqual(levelOrder(toTree([3,9,20,null,null,15,7])), [[3],[9,20],[15,7]]);" },
            { name: "single node → [[1]]", code: "return deepEqual(levelOrder(toTree([1])), [[1]]);" },
            { name: "empty tree → []", code: "return deepEqual(levelOrder(null), []);" },
            { name: "gaps in the tree: [1,2,3,4,null,null,5] → [[1],[2,3],[4,5]]", code: "return deepEqual(levelOrder(toTree([1,2,3,4,null,null,5])), [[1],[2,3],[4,5]]);" },
          ],
          hint: "Queue the root. While the queue isn't empty: note its size, take exactly that many nodes into one level array, and enqueue their children.",
        },
        {
          type: "p",
          text: "Once you have levels, many problems are \"level order, then keep one thing per level\". Standing on the right side of the tree, you see the **last** node of each level — even if it's on a left branch, when the right branch is shorter.",
        },
        {
          type: "challenge",
          title: "Binary Tree Right Side View",
          difficulty: "medium",
          tags: ["tree", "bfs"],
          prompt: "Imagine standing to the right of a binary tree. Return the values of the nodes you can see, from top to bottom.",
          examples: [
            { input: "root = [1,2,3,null,5,null,4]", output: "[1,3,4]" },
            { input: "root = [1,2,3,4]", output: "[1,3,4]", explanation: "Node 4 is on the left, but nothing on level 2 hides it." },
            { input: "root = []", output: "[]" },
          ],
          constraints: ["0 <= nodes <= 100"],
          complexity: "O(n) time, O(n) space",
          starter: `function rightSideView(root) {
  // your code here
}`,
          solution: `function rightSideView(root) {
  const view = [];
  let level = root ? [root] : [];
  while (level.length) {
    view.push(level[level.length - 1].val); // last node of the level
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
  }
  return view;
}`,
          tests: [
            { name: "[1,2,3,null,5,null,4] → [1,3,4]", code: "return deepEqual(rightSideView(toTree([1,2,3,null,5,null,4])), [1,3,4]);" },
            { name: "left node visible on a deeper level: [1,2,3,4] → [1,3,4]", code: "return deepEqual(rightSideView(toTree([1,2,3,4])), [1,3,4]);" },
            { name: "[1,null,3] → [1,3]", code: "return deepEqual(rightSideView(toTree([1,null,3])), [1,3]);" },
            { name: "empty tree → []", code: "return deepEqual(rightSideView(null), []);" },
          ],
          hint: "Do level order; for each level, keep only the last node's value.",
        },
        {
          type: "p",
          text: "BFS's real superpower: it reaches nodes in order of distance from the root. So the **first leaf** BFS meets is the shallowest one, and you can stop right there — DFS would have to explore the entire tree to be sure.",
        },
        {
          type: "challenge",
          title: "Minimum Depth of Binary Tree",
          difficulty: "easy",
          tags: ["tree", "bfs"],
          prompt: "Return the minimum depth of a binary tree: the number of nodes along the shortest path from the root down to the nearest **leaf** (a node with no children). An empty tree has depth 0.",
          examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "2", explanation: "3 → 9, and 9 is a leaf." },
            { input: "root = [2,null,3,null,4,null,5,null,6]", output: "5" },
          ],
          constraints: ["0 <= nodes <= 10^5"],
          complexity: "O(n) time worst case, stops at the first leaf",
          starter: `function minDepth(root) {
  // your code here
}`,
          solution: `function minDepth(root) {
  if (!root) return 0;
  let level = [root];
  let depth = 1;
  while (level.length) {
    const next = [];
    for (const node of level) {
      if (!node.left && !node.right) return depth; // first leaf = shallowest
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
    depth++;
  }
  return depth;
}`,
          tests: [
            { name: "[3,9,20,null,null,15,7] → 2", code: "return minDepth(toTree([3,9,20,null,null,15,7])) === 2;" },
            { name: "a chain [2,null,3,null,4,null,5,null,6] → 5", code: "return minDepth(toTree([2,null,3,null,4,null,5,null,6])) === 5;" },
            { name: "empty tree → 0", code: "return minDepth(null) === 0;" },
            { name: "a root with one child is not a leaf: [1,2] → 2", code: "return minDepth(toTree([1,2])) === 2;" },
            {
              name: "stops early: a leaf at depth 2 next to a 100,000-node chain",
              code: `let chain = null;
for (let i = 0; i < 100000; i++) chain = new TreeNode(i, chain, null);
const root = new TreeNode(0, chain, new TreeNode(1));
const t0 = performance.now();
return minDepth(root) === 2 && performance.now() - t0 < 50;`,
            },
          ],
          hint: "BFS level by level and return the depth as soon as you dequeue a node with no children. Careful: `minDepth` is not just `1 + min(left, right)` when one side is empty.",
        },
        {
          type: "challenge",
          title: "Average of Levels in Binary Tree",
          difficulty: "easy",
          tags: ["tree", "bfs"],
          prompt: "Return an array with the average value of the nodes on each level of a (non-empty) binary tree. Think: average order value per row of a referral tree.",
          examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[3,14.5,11]" },
            { input: "root = [3,9,20,15,7]", output: "[3,14.5,11]" },
          ],
          constraints: ["1 <= nodes <= 10^4", "-2^31 <= values <= 2^31 - 1"],
          complexity: "O(n) time, O(n) space",
          starter: `function averageOfLevels(root) {
  // your code here
}`,
          solution: `function averageOfLevels(root) {
  const averages = [];
  let level = root ? [root] : [];
  while (level.length) {
    let sum = 0;
    const next = [];
    for (const node of level) {
      sum += node.val;
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    averages.push(sum / level.length);
    level = next;
  }
  return averages;
}`,
          tests: [
            { name: "[3,9,20,null,null,15,7] → [3,14.5,11]", code: "return deepEqual(averageOfLevels(toTree([3,9,20,null,null,15,7])), [3,14.5,11]);" },
            { name: "[3,9,20,15,7] → [3,14.5,11]", code: "return deepEqual(averageOfLevels(toTree([3,9,20,15,7])), [3,14.5,11]);" },
            { name: "single node → [value]", code: "return deepEqual(averageOfLevels(toTree([-4])), [-4]);" },
            { name: "huge values don't overflow: [2147483647,2147483647,2147483647]", code: "return deepEqual(averageOfLevels(toTree([2147483647,2147483647,2147483647])), [2147483647,2147483647]);" },
          ],
          hint: "Level order again; sum each level and divide by its size.",
        },
        {
          type: "challenge",
          title: "Binary Tree Zigzag Level Order Traversal",
          difficulty: "medium",
          tags: ["tree", "bfs"],
          prompt: "Return the level order traversal, but alternate direction: level 0 left to right, level 1 right to left, level 2 left to right, and so on.",
          examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" },
            { input: "root = [1]", output: "[[1]]" },
          ],
          constraints: ["0 <= nodes <= 2000"],
          complexity: "O(n) time, O(n) space",
          starter: `function zigzagLevelOrder(root) {
  // your code here
}`,
          solution: `function zigzagLevelOrder(root) {
  const result = [];
  let level = root ? [root] : [];
  let leftToRight = true;
  while (level.length) {
    const values = level.map((n) => n.val);
    if (!leftToRight) values.reverse(); // only the output flips, not the traversal
    result.push(values);
    const next = [];
    for (const node of level) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    level = next;
    leftToRight = !leftToRight;
  }
  return result;
}`,
          tests: [
            { name: "[3,9,20,null,null,15,7] → [[3],[20,9],[15,7]]", code: "return deepEqual(zigzagLevelOrder(toTree([3,9,20,null,null,15,7])), [[3],[20,9],[15,7]]);" },
            { name: "single node → [[1]]", code: "return deepEqual(zigzagLevelOrder(toTree([1])), [[1]]);" },
            { name: "empty tree → []", code: "return deepEqual(zigzagLevelOrder(null), []);" },
            { name: "four levels: [1,2,3,4,5,6,7,8,9] → [[1],[3,2],[4,5,6,7],[9,8]]", code: "return deepEqual(zigzagLevelOrder(toTree([1,2,3,4,5,6,7,8,9])), [[1],[3,2],[4,5,6,7],[9,8]]);" },
          ],
          hint: "Traverse every level left to right as usual, and reverse the *values array* of every other level before saving it.",
        },
        {
          type: "p",
          text: "Last, a design problem: turn a tree into a string (to save it in a database column or send it over the network) and rebuild the exact same tree from it. The level-order format you've been reading all along is one valid answer — `null` markers make the shape unambiguous. A preorder string with `#` for null works too.",
        },
        {
          type: "challenge",
          title: "Serialize and Deserialize Binary Tree (optional)",
          difficulty: "hard",
          tags: ["tree", "bfs", "design", "string"],
          prompt: "Write `serialize(root)` that turns a binary tree into a **string**, and `deserialize(data)` that rebuilds an identical tree from that string. Any format works, as long as `deserialize(serialize(tree))` has the same shape and values. Don't use the `toTree`/`fromTree` helpers — that's the exercise!",
          examples: [
            { input: "root = [1,2,3,null,null,4,5]", output: "a tree equal to [1,2,3,null,null,4,5]", explanation: "e.g. via the string \"1,2,3,#,#,4,5,#,#,#,#\"" },
            { input: "root = []", output: "[]" },
          ],
          constraints: ["0 <= nodes <= 10^4", "-1000 <= node.val <= 1000"],
          complexity: "O(n) time and space for both",
          starter: `function serialize(root) {
  // your code here
}

function deserialize(data) {
  // your code here
}`,
          solution: `function serialize(root) {
  const out = [];
  const queue = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (!node) { out.push("#"); continue; }
    out.push(String(node.val));
    queue.push(node.left, node.right);
  }
  return out.join(",");
}

function deserialize(data) {
  const tokens = data.split(",");
  if (tokens[0] === "#") return null;
  const root = new TreeNode(Number(tokens[0]));
  const queue = [root];
  let i = 1;
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (tokens[i] !== "#") queue.push((node.left = new TreeNode(Number(tokens[i]))));
    i++;
    if (tokens[i] !== "#") queue.push((node.right = new TreeNode(Number(tokens[i]))));
    i++;
  }
  return root;
}`,
          tests: [
            {
              name: "round trip [1,2,3,null,null,4,5]",
              code: `const s = serialize(toTree([1,2,3,null,null,4,5]));
return typeof s === "string" && deepEqual(fromTree(deserialize(s)), [1,2,3,null,null,4,5]);`,
            },
            {
              name: "round trip of an empty tree",
              code: `const s = serialize(null);
return typeof s === "string" && deserialize(s) === null;`,
            },
            {
              name: "negative and multi-digit values survive",
              code: `const s = serialize(toTree([-10,200,null,-1000,7]));
return typeof s === "string" && deepEqual(fromTree(deserialize(s)), [-10,200,null,-1000,7]);`,
            },
            {
              name: "a 2,000-node skewed chain keeps its shape",
              code: `let root = null;
for (let i = 1999; i >= 0; i--) root = new TreeNode(i % 7, null, root);
const s = serialize(root);
return typeof s === "string" && deepEqual(fromTree(deserialize(s)), fromTree(root));`,
            },
          ],
          hint: "BFS over the tree, writing each node's value or `#` for null, joined by commas. To rebuild, read tokens in the same order: each dequeued node consumes the next two tokens as its left and right child.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "BFS beyond trees",
          text: "BFS works on any graph, not just trees — you'll add a `visited` Set to avoid revisiting. \"How many introductions separate two users\" in a Supabase `follows` table, the fewest clicks between two pages of a client's site (a crawler), or rendering a comment thread one depth at a time are all BFS. And the serialize problem is what `JSON.stringify` does for you on every API response from a Next.js route handler.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which structure drives BFS?",
              options: ["A queue (FIFO)", "A stack (LIFO)", "A heap", "A hash map"],
              answer: 0,
              why: "BFS processes nodes in the order they were discovered, which is first-in-first-out. Swap the queue for a stack and you get DFS.",
            },
            {
              q: "Why is BFS a better fit than DFS for Minimum Depth?",
              options: [
                "BFS uses less memory on every tree",
                "DFS can't find leaves",
                "BFS meets nodes in order of depth, so the first leaf found is the answer and it can stop immediately",
                "BFS is O(log n)",
              ],
              answer: 2,
              why: "DFS might explore a huge deep branch before finding a shallow leaf elsewhere; BFS never looks deeper than the answer's level + 1.",
            },
            {
              q: "In level-order BFS, why record `queue.length` before processing a level?",
              options: [
                "To sort the level",
                "Children enqueued during the loop belong to the next level; the snapshot tells you where the current level ends",
                "To avoid shift()",
                "It's only needed for zigzag",
              ],
              answer: 1,
              why: "The queue mixes the end of one level with the start of the next. The size snapshot is the boundary.",
            },
            {
              q: "What's the extra space of BFS on a complete binary tree with n nodes?",
              options: ["O(1)", "O(log n)", "O(n²)", "O(n) — the last level holds about n/2 nodes"],
              answer: 3,
              why: "The queue holds up to one full level, and the bottom level of a complete tree has roughly half the nodes.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Heaps & priority queues
    // ─────────────────────────────────────────────────────────────
    {
      slug: "heaps",
      title: "Heaps & priority queues",
      summary: "Build a MinHeap from scratch with sift up / sift down, then use it for top-k, k-way merges and running medians.",
      minutes: 60,
      blocks: [
        {
          type: "p",
          text: "A **priority queue** answers one question fast, over and over: *what's the smallest (or largest) item right now?* — while items keep arriving. Think of a support inbox where the most urgent ticket must always be handled next, or a scheduler that always runs the job due soonest. Sorting after every insert costs O(n log n) each time. A **binary heap** does insert and remove-min in O(log n), and peek in O(1).",
        },
        {
          type: "table",
          rows: [
            ["Structure", "insert", "get min (peek)", "remove min"],
            ["unsorted array", "O(1)", "O(n)", "O(n)"],
            ["sorted array", "O(n) (shift to make room)", "O(1)", "O(1) from the end / O(n) from the front"],
            ["**binary heap**", "**O(log n)**", "**O(1)**", "**O(log n)**"],
          ],
        },
        { type: "h", text: "Signals that you need a heap" },
        {
          type: "list",
          items: [
            "\"**k** largest / smallest / closest / most frequent\" — keep a heap of size k.",
            "\"Merge **k** sorted lists/streams\" — a heap of the k current heads.",
            "\"Repeatedly take the two largest/smallest and…\" — simulation with a heap.",
            "\"**Running** median\", \"schedule the next task\", shortest paths (Dijkstra).",
          ],
        },
        { type: "h", text: "A tree hiding in an array" },
        {
          type: "p",
          text: "A min-heap is a **complete** binary tree (every level full except maybe the last, filled left to right) with one rule: **every parent is ≤ its children**. So the minimum is always at the root. Because the tree is complete, it packs perfectly into an array with no pointers at all — the shape is implied by the indices:",
        },
        {
          type: "code",
          lang: "text",
          title: "the heap [1, 3, 2, 7, 4]",
          code: `index:  0  1  2  3  4
value: [1, 3, 2, 7, 4]

          1            i = 0
        /   \\
       3     2         i = 1, 2
      / \\
     7   4             i = 3, 4

parent(i) = Math.floor((i - 1) / 2)
left(i)   = 2 * i + 1
right(i)  = 2 * i + 2`,
        },
        {
          type: "p",
          text: "Note the heap is **not sorted**: `3` comes before `2`. It only promises parent ≤ child. That weaker promise is exactly what makes it cheap to maintain. Two operations restore the rule after a change:",
        },
        {
          type: "steps",
          items: [
            { title: "push(0) — append at the end", text: "`[1, 3, 2, 7, 4, 0]`. The new 0 sits at index 5; its parent is index 2 (value 2). The rule is broken." },
            { title: "sift up", text: "0 < 2 → swap: `[1, 3, 0, 7, 4, 2]`. Now at index 2, parent index 0 (value 1). 0 < 1 → swap: `[0, 3, 1, 7, 4, 2]`. At the root → stop. At most one swap per level: O(log n)." },
            { title: "pop() — take the root", text: "The answer is the root, 0. To fill the hole, move the **last** element (2) to the root: `[2, 3, 1, 7, 4]`. Removing the last slot is O(1), and the tree stays complete." },
            { title: "sift down", text: "At index 0, value 2, children 3 and 1. Swap with the **smaller** child (1): `[1, 3, 2, 7, 4]`. Index 2 has no children → stop. Again at most one swap per level: O(log n)." },
          ],
        },
        {
          type: "run",
          title: "a reusable Heap with a comparator",
          code: `class Heap {
  // compare(a, b) < 0 means a should come out first.
  // (a, b) => a - b → min-heap;  (a, b) => b - a → max-heap
  constructor(compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare;
  }
  size() { return this.data.length; }
  peek() { return this.data[0]; }
  push(value) {
    const a = this.data;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {                                   // sift up
      const p = Math.floor((i - 1) / 2);
      if (this.compare(a[i], a[p]) >= 0) break;       // parent is fine → stop
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    if (a.length === 0) return undefined;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {                                  // sift down
        const l = 2 * i + 1, r = l + 1;
        let best = i;
        if (l < a.length && this.compare(a[l], a[best]) < 0) best = l;
        if (r < a.length && this.compare(a[r], a[best]) < 0) best = r;
        if (best === i) break;
        [a[i], a[best]] = [a[best], a[i]];
        i = best;
      }
    }
    return top;
  }
}

// Support tickets: lowest priority number = most urgent
const inbox = new Heap((x, y) => x.priority - y.priority);
inbox.push({ id: "T-101", priority: 3, title: "Typo on About page" });
inbox.push({ id: "T-102", priority: 1, title: "Checkout is down" });
inbox.push({ id: "T-103", priority: 2, title: "Slow product search" });
inbox.push({ id: "T-104", priority: 1, title: "Login loop on Clerk" });
console.log("internal array:", inbox.data.map((t) => t.priority));
while (inbox.size()) {
  const t = inbox.pop();
  console.log("handle", t.id, "(p" + t.priority + ")", t.title);
}

// Heapsort in two lines: push everything, pop everything
const h = new Heap();
[42, 7, 19, 3, 88, 3].forEach((x) => h.push(x));
const sorted = [];
while (h.size()) sorted.push(h.pop());
console.log(sorted);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Heaps are not stable",
          text: "Items with equal priority can come out in any order (`T-102` and `T-104` above). If order matters among ties, compare a second key in your comparator, e.g. `(a, b) => a.priority - b.priority || a.createdAt - b.createdAt`.",
        },
        {
          type: "callout",
          tone: "info",
          title: "No built-in priority queue in JavaScript",
          text: "Python has `heapq`, Java has `PriorityQueue`; JavaScript has nothing built in. LeetCode's JS environment happens to bundle the `@datastructures-js/priority-queue` package, but interviewers frequently ask you to write the heap yourself — and in this track there's no such package. In the problems below, **paste your own heap class into your solution**.",
        },
        {
          type: "challenge",
          title: "Implement a MinHeap",
          difficulty: "medium",
          tags: ["heap", "design"],
          prompt: "Implement a class `MinHeap` storing numbers, with: `push(val)` — add a value in O(log n); `pop()` — remove and return the smallest value in O(log n), or `undefined` if empty; `peek()` — return the smallest value without removing it (`undefined` if empty); `size()` — the number of values. Use an array and sift up / sift down; don't sort.",
          examples: [
            { input: "push(5), push(1), push(3), peek(), pop(), pop(), size()", output: "1, 1, 3, 1" },
          ],
          constraints: ["up to 10^5 operations", "values may repeat and be negative"],
          complexity: "O(log n) push/pop, O(1) peek/size",
          starter: `class MinHeap {
  constructor() {
    this.data = [];
  }
  push(val) {}
  pop() {}
  peek() {}
  size() {}
}`,
          solution: `class MinHeap {
  constructor() {
    this.data = [];
  }
  push(val) {
    const a = this.data;
    a.push(val);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p] <= a[i]) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    if (a.length === 0) return undefined;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let smallest = i;
        if (l < a.length && a[l] < a[smallest]) smallest = l;
        if (r < a.length && a[r] < a[smallest]) smallest = r;
        if (smallest === i) break;
        [a[i], a[smallest]] = [a[smallest], a[i]];
        i = smallest;
      }
    }
    return top;
  }
  peek() {
    return this.data[0];
  }
  size() {
    return this.data.length;
  }
}`,
          tests: [
            {
              name: "example: push 5, 1, 3 → peek 1, pop 1, pop 3, size 1",
              code: `const h = new MinHeap();
h.push(5); h.push(1); h.push(3);
return h.peek() === 1 && h.pop() === 1 && h.pop() === 3 && h.size() === 1;`,
            },
            {
              name: "popping everything returns values in sorted order (duplicates and negatives)",
              code: `const h = new MinHeap();
const input = [8, -2, 5, 5, 0, 13, -7, 1, 5, 2];
for (const x of input) h.push(x);
const out = [];
while (h.size() > 0) out.push(h.pop());
return deepEqual(out, [...input].sort((a, b) => a - b));`,
            },
            {
              name: "empty heap: pop and peek return undefined, size is 0",
              code: "const h = new MinHeap(); return h.pop() === undefined && h.peek() === undefined && h.size() === 0;",
            },
            {
              name: "peek does not remove",
              code: "const h = new MinHeap(); h.push(4); h.push(2); h.peek(); h.peek(); return h.size() === 2 && h.pop() === 2;",
            },
            {
              name: "fast: 100,000 random pushes then pops, sorted (O(log n) per op)",
              code: `const h = new MinHeap();
const n = 100000;
let seed = 7;
const t0 = performance.now();
for (let i = 0; i < n; i++) { seed = (seed * 48271) % 2147483647; h.push(seed % 100000); }
let prev = -Infinity, ok = h.size() === n;
for (let i = 0; i < n; i++) { const v = h.pop(); if (v < prev) ok = false; prev = v; }
return ok && h.size() === 0 && performance.now() - t0 < 600;`,
            },
          ],
          hint: "push: append, then swap with the parent `Math.floor((i - 1) / 2)` while smaller. pop: save `data[0]`, move the last element to index 0, then swap with the smaller child (`2i + 1`, `2i + 2`) while bigger. Watch the size-1 case when popping.",
        },
        { type: "h", text: "Top-k: keep a small heap, not a big sort" },
        {
          type: "p",
          text: "To find the k largest of n numbers, keep a **min-heap of size k**: it holds the k largest seen so far, and its root is the smallest of them — the current k-th largest. Each new number either beats the root (pop the root, push the newcomer) or is ignored. Counterintuitive but key: **largest → min-heap**, because you need fast access to the weakest member of your top-k club to kick it out.",
        },
        {
          type: "compare",
          left: {
            label: "Sort everything — O(n log n) time, O(n) space",
            lang: "js",
            code: `function kthLargest(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}
// Fine for small n. Sorts all n items
// even when k = 3.`,
          },
          right: {
            label: "Min-heap of size k — O(n log k) time, O(k) space",
            lang: "js",
            code: `function kthLargest(nums, k) {
  const heap = new MinHeap();
  for (const x of nums) {
    heap.push(x);
    if (heap.size() > k) heap.pop(); // drop the smallest
  }
  return heap.peek();
}
// Works on a stream too: you never need
// all n items in memory at once.`,
          },
        },
        {
          type: "challenge",
          title: "Kth Largest Element in an Array",
          difficulty: "medium",
          tags: ["heap", "top-k"],
          prompt: "Given an integer array `nums` and an integer `k`, return the k-th largest element (in sorted order, not the k-th distinct). Solve it with a heap rather than sorting the whole array — include your heap class in your solution.",
          examples: [
            { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" },
            { input: "nums = [3,2,3,1,2,4,5,5,6], k = 4", output: "4" },
          ],
          constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
          complexity: "O(n log k) time, O(k) space",
          starter: `function findKthLargest(nums, k) {
  // your code here
}`,
          solution: `class MinHeap {
  constructor() { this.data = []; }
  size() { return this.data.length; }
  peek() { return this.data[0]; }
  push(val) {
    const a = this.data;
    a.push(val);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (a[p] <= a[i]) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let s = i;
        if (l < a.length && a[l] < a[s]) s = l;
        if (r < a.length && a[r] < a[s]) s = r;
        if (s === i) break;
        [a[i], a[s]] = [a[s], a[i]];
        i = s;
      }
    }
    return top;
  }
}

function findKthLargest(nums, k) {
  const heap = new MinHeap(); // the k largest so far; root = k-th largest
  for (const x of nums) {
    heap.push(x);
    if (heap.size() > k) heap.pop();
  }
  return heap.peek();
}`,
          tests: [
            { name: "[3,2,1,5,6,4], k = 2 → 5", code: "return findKthLargest([3,2,1,5,6,4], 2) === 5;" },
            { name: "duplicates count: [3,2,3,1,2,4,5,5,6], k = 4 → 4", code: "return findKthLargest([3,2,3,1,2,4,5,5,6], 4) === 4;" },
            { name: "single element, k = 1", code: "return findKthLargest([-1], 1) === -1;" },
            { name: "k = n returns the minimum", code: "return findKthLargest([7, -3, 12, 0], 4) === -3;" },
            {
              name: "100,000 numbers, k = 100",
              code: `let seed = 42;
const nums = Array.from({ length: 100000 }, () => { seed = (seed * 48271) % 2147483647; return (seed % 20001) - 10000; });
const expected = [...nums].sort((a, b) => b - a)[99];
const t0 = performance.now();
const r = findKthLargest(nums, 100);
return r === expected && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Min-heap capped at size k: push each number, pop whenever the size exceeds k. The root is the answer.",
        },
        {
          type: "p",
          text: "Need a **max**-heap? Either flip the comparison in your heap, or push negated numbers into a min-heap (`push(-x)`, and negate what you pop). Both are common in interviews; a comparator is cleaner when items are objects.",
        },
        {
          type: "challenge",
          title: "Last Stone Weight",
          difficulty: "easy",
          tags: ["heap", "simulation"],
          prompt: "You have stones with weights `stones[i]`. Each turn, take the two **heaviest** stones `x <= y` and smash them: if `x === y` both are destroyed; otherwise `x` is destroyed and `y` becomes `y - x`. When at most one stone remains, return its weight (or `0` if none).",
          examples: [
            { input: "stones = [2,7,4,1,8,1]", output: "1", explanation: "8,7 → 1; 4,2 → 2; 2,1 → 1; 1,1 → 0; one stone of weight 1 left." },
            { input: "stones = [1]", output: "1" },
          ],
          constraints: ["1 <= stones.length <= 30", "1 <= stones[i] <= 1000"],
          complexity: "O(n log n) time, O(n) space",
          starter: `function lastStoneWeight(stones) {
  // your code here
}`,
          solution: `class Heap {
  constructor(compare) { this.data = []; this.compare = compare; }
  size() { return this.data.length; }
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.compare(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let b = i;
        if (l < a.length && this.compare(a[l], a[b]) < 0) b = l;
        if (r < a.length && this.compare(a[r], a[b]) < 0) b = r;
        if (b === i) break;
        [a[i], a[b]] = [a[b], a[i]];
        i = b;
      }
    }
    return top;
  }
}

function lastStoneWeight(stones) {
  const heap = new Heap((a, b) => b - a); // max-heap
  for (const s of stones) heap.push(s);
  while (heap.size() > 1) {
    const y = heap.pop(); // heaviest
    const x = heap.pop(); // second heaviest
    if (y !== x) heap.push(y - x);
  }
  return heap.size() === 1 ? heap.pop() : 0;
}`,
          tests: [
            { name: "[2,7,4,1,8,1] → 1", code: "return lastStoneWeight([2,7,4,1,8,1]) === 1;" },
            { name: "single stone [1] → 1", code: "return lastStoneWeight([1]) === 1;" },
            { name: "equal stones destroy each other: [2,2] → 0", code: "return lastStoneWeight([2,2]) === 0;" },
            { name: "[10,4,2,10] → 2", code: "return lastStoneWeight([10,4,2,10]) === 2;" },
          ],
          hint: "Max-heap of all stones. While more than one remains: pop two, push the difference if it's not 0.",
        },
        {
          type: "challenge",
          title: "K Closest Points to Origin",
          difficulty: "medium",
          tags: ["heap", "top-k", "geometry"],
          prompt: "Given an array of `points` where `points[i] = [x, y]` (say, client offices on a map, with the agency at `[0, 0]`), return the `k` points closest to the origin by Euclidean distance. Any order is fine; the answer is unique.",
          examples: [
            { input: "points = [[1,3],[-2,2]], k = 1", output: "[[-2,2]]", explanation: "Squared distances: 10 vs 8." },
            { input: "points = [[3,3],[5,-1],[-2,4]], k = 2", output: "[[3,3],[-2,4]]" },
          ],
          constraints: ["1 <= k <= points.length <= 10^4", "-10^4 <= x, y <= 10^4"],
          complexity: "O(n log k) time, O(k) space",
          starter: `function kClosest(points, k) {
  // your code here
}`,
          solution: `class Heap {
  constructor(compare) { this.data = []; this.compare = compare; }
  size() { return this.data.length; }
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.compare(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let b = i;
        if (l < a.length && this.compare(a[l], a[b]) < 0) b = l;
        if (r < a.length && this.compare(a[r], a[b]) < 0) b = r;
        if (b === i) break;
        [a[i], a[b]] = [a[b], a[i]];
        i = b;
      }
    }
    return top;
  }
}

function kClosest(points, k) {
  const dist = ([x, y]) => x * x + y * y; // squared: no need for Math.sqrt
  const heap = new Heap((a, b) => dist(b) - dist(a)); // max-heap: farthest on top
  for (const p of points) {
    heap.push(p);
    if (heap.size() > k) heap.pop(); // evict the farthest
  }
  return heap.data;
}`,
          tests: [
            { name: "[[1,3],[-2,2]], k = 1 → [[-2,2]]", code: "return sameMembers(kClosest([[1,3],[-2,2]], 1), [[-2,2]]);" },
            { name: "[[3,3],[5,-1],[-2,4]], k = 2 → [[3,3],[-2,4]]", code: "return sameMembers(kClosest([[3,3],[5,-1],[-2,4]], 2), [[3,3],[-2,4]]);" },
            { name: "k = n returns every point", code: "return sameMembers(kClosest([[0,1],[1,0],[2,2]], 3), [[0,1],[1,0],[2,2]]);" },
            { name: "the origin itself is the closest", code: "return sameMembers(kClosest([[5,5],[0,0],[-1,-1]], 1), [[0,0]]);" },
          ],
          hint: "Compare squared distances. Keep a **max**-heap of size k: when it grows past k, pop the farthest point. What's left are the k closest.",
        },
        {
          type: "challenge",
          title: "Top K Frequent Elements (heap version)",
          difficulty: "medium",
          tags: ["heap", "hash map", "top-k"],
          prompt: "Given an array `nums` (say, product IDs from a day of orders) and an integer `k`, return the `k` most frequent values, in any order. The answer is guaranteed to be unique. Use a hash map to count, then a heap of size k.",
          examples: [
            { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
            { input: "nums = [1], k = 1", output: "[1]" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "k is between 1 and the number of distinct values"],
          complexity: "O(n log k) time, O(n) space",
          starter: `function topKFrequent(nums, k) {
  // your code here
}`,
          solution: `class Heap {
  constructor(compare) { this.data = []; this.compare = compare; }
  size() { return this.data.length; }
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.compare(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let b = i;
        if (l < a.length && this.compare(a[l], a[b]) < 0) b = l;
        if (r < a.length && this.compare(a[r], a[b]) < 0) b = r;
        if (b === i) break;
        [a[i], a[b]] = [a[b], a[i]];
        i = b;
      }
    }
    return top;
  }
}

function topKFrequent(nums, k) {
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);
  const heap = new Heap((a, b) => a[1] - b[1]); // min-heap on count
  for (const entry of counts) {               // entry = [value, count]
    heap.push(entry);
    if (heap.size() > k) heap.pop();           // drop the least frequent
  }
  return heap.data.map(([value]) => value);
}`,
          tests: [
            { name: "[1,1,1,2,2,3], k = 2 → [1,2]", code: "return sameMembers(topKFrequent([1,1,1,2,2,3], 2), [1,2]);" },
            { name: "[1], k = 1 → [1]", code: "return sameMembers(topKFrequent([1], 1), [1]);" },
            { name: "negative values: [4,4,-1,-1,-1,2], k = 1 → [-1]", code: "return sameMembers(topKFrequent([4,4,-1,-1,-1,2], 1), [-1]);" },
            {
              name: "100,000 orders over 20,000 products, k = 3",
              code: `const nums = [];
for (let i = 0; i < 94000; i++) nums.push(i % 20000);   // every product ~4-5 times
for (let i = 0; i < 2000; i++) nums.push(777, 31337, 5); // three best-sellers
const t0 = performance.now();
const r = topKFrequent(nums, 3);
return sameMembers(r, [777, 31337, 5]) && performance.now() - t0 < 500;`,
            },
          ],
          hint: "Count with a `Map`. Then push `[value, count]` pairs into a min-heap ordered by count, popping whenever it holds more than k.",
        },
        {
          type: "p",
          text: "Merging k sorted lists is where heaps really pay off. At any moment, the next node of the output is the smallest among the k current heads. Put the heads in a min-heap: pop the smallest, append it, push its `next`. Each of the N nodes goes in and out of a heap of size ≤ k once: **O(N log k)**.",
        },
        {
          type: "challenge",
          title: "Merge k Sorted Lists",
          difficulty: "hard",
          tags: ["heap", "linked list", "divide and conquer"],
          prompt: "You're given an array of `k` linked lists, each sorted ascending (`lists[i]` is a head, possibly `null`). Merge them all into one sorted linked list and return its head.",
          examples: [
            { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
            { input: "lists = []", output: "[]" },
            { input: "lists = [[]]", output: "[]" },
          ],
          constraints: ["0 <= k <= 10^4", "total nodes N <= 10^5", "each list sorted ascending"],
          complexity: "O(N log k) time, O(k) extra space",
          starter: `function mergeKLists(lists) {
  // your code here
}`,
          solution: `class Heap {
  constructor(compare) { this.data = []; this.compare = compare; }
  size() { return this.data.length; }
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.compare(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let b = i;
        if (l < a.length && this.compare(a[l], a[b]) < 0) b = l;
        if (r < a.length && this.compare(a[r], a[b]) < 0) b = r;
        if (b === i) break;
        [a[i], a[b]] = [a[b], a[i]];
        i = b;
      }
    }
    return top;
  }
}

function mergeKLists(lists) {
  const heap = new Heap((a, b) => a.val - b.val);
  for (const head of lists) if (head) heap.push(head);
  const dummy = new ListNode();
  let tail = dummy;
  while (heap.size() > 0) {
    const node = heap.pop();      // smallest current head
    tail.next = node;
    tail = node;
    if (node.next) heap.push(node.next);
  }
  tail.next = null;
  return dummy.next;
}`,
          tests: [
            { name: "[[1,4,5],[1,3,4],[2,6]] → [1,1,2,3,4,4,5,6]", code: "return deepEqual(fromList(mergeKLists([toList([1,4,5]), toList([1,3,4]), toList([2,6])])), [1,1,2,3,4,4,5,6]);" },
            { name: "no lists → null", code: "return mergeKLists([]) === null;" },
            { name: "only empty lists → null", code: "return mergeKLists([null, null]) === null;" },
            { name: "one empty, one not: [[], [1]] → [1]", code: "return deepEqual(fromList(mergeKLists([null, toList([1])])), [1]);" },
            {
              name: "fast: 5,000 lists × 20 nodes (O(N log k) needed)",
              code: `const k = 5000, len = 20;
const lists = [];
for (let i = 0; i < k; i++) lists.push(toList(Array.from({ length: len }, (_, j) => j * k + i)));
const t0 = performance.now();
let node = mergeKLists(lists);
const ms = performance.now() - t0;
let count = 0, prev = -Infinity, sorted = true;
while (node) { if (node.val < prev) sorted = false; prev = node.val; count++; node = node.next; }
return sorted && count === k * len && ms < 400;`,
            },
          ],
          hint: "Push every non-null head into a min-heap keyed on `node.val`. Pop the smallest, attach it to your result, and push its `next` if there is one. A dummy head keeps the attaching simple.",
        },
        {
          type: "p",
          text: "Finally, a design classic. To track the median of a growing stream, split the numbers into two halves: a **max-heap** for the smaller half and a **min-heap** for the larger half, with sizes equal or the low half one bigger. The median is then sitting right on top: either the low half's max, or the average of both tops.",
        },
        {
          type: "table",
          rows: [
            ["add", "low (max-heap)", "high (min-heap)", "median"],
            ["5", "[5]", "[]", "5"],
            ["15", "[5]", "[15]", "(5 + 15) / 2 = 10"],
            ["1", "[5, 1]", "[15]", "5"],
            ["3", "[3, 1]", "[5, 15]", "(3 + 5) / 2 = 4"],
          ],
        },
        {
          type: "challenge",
          title: "Find Median from Data Stream",
          difficulty: "hard",
          tags: ["heap", "design", "two heaps"],
          prompt: "Design `MedianFinder`: `addNum(num)` adds an integer from the stream; `findMedian()` returns the median of everything added so far (the average of the two middle values when the count is even). Think: live median order value on a sales dashboard. `addNum` must be O(log n) and `findMedian` O(1). `findMedian` is only called after at least one `addNum`.",
          examples: [
            { input: "addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", output: "1.5, 2" },
          ],
          constraints: ["-10^5 <= num <= 10^5", "up to 1.5 * 10^5 calls"],
          complexity: "O(log n) addNum, O(1) findMedian",
          starter: `class MedianFinder {
  constructor() {
    // your code here
  }
  addNum(num) {}
  findMedian() {}
}`,
          solution: `class Heap {
  constructor(compare) { this.data = []; this.compare = compare; }
  size() { return this.data.length; }
  peek() { return this.data[0]; }
  push(v) {
    const a = this.data;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.compare(a[i], a[p]) >= 0) break;
      [a[i], a[p]] = [a[p], a[i]];
      i = p;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let b = i;
        if (l < a.length && this.compare(a[l], a[b]) < 0) b = l;
        if (r < a.length && this.compare(a[r], a[b]) < 0) b = r;
        if (b === i) break;
        [a[i], a[b]] = [a[b], a[i]];
        i = b;
      }
    }
    return top;
  }
}

class MedianFinder {
  constructor() {
    this.low = new Heap((a, b) => b - a);  // max-heap: smaller half
    this.high = new Heap((a, b) => a - b); // min-heap: larger half
  }
  addNum(num) {
    // route through low so every value in low stays <= every value in high
    this.low.push(num);
    this.high.push(this.low.pop());
    // rebalance: low may hold at most one extra element
    if (this.high.size() > this.low.size()) this.low.push(this.high.pop());
  }
  findMedian() {
    if (this.low.size() > this.high.size()) return this.low.peek();
    return (this.low.peek() + this.high.peek()) / 2;
  }
}`,
          tests: [
            {
              name: "example: 1, 2 → 1.5; then 3 → 2",
              code: `const m = new MedianFinder();
m.addNum(1); m.addNum(2);
const a = m.findMedian();
m.addNum(3);
return a === 1.5 && m.findMedian() === 2;`,
            },
            {
              name: "single number is its own median",
              code: "const m = new MedianFinder(); m.addNum(-7); return m.findMedian() === -7;",
            },
            {
              name: "the table above: 5, 15, 1, 3 → 5, 10, 5, 4",
              code: `const m = new MedianFinder();
const out = [];
for (const x of [5, 15, 1, 3]) { m.addNum(x); out.push(m.findMedian()); }
return deepEqual(out, [5, 10, 5, 4]);`,
            },
            {
              name: "decreasing stream with negatives",
              code: `const m = new MedianFinder();
const out = [];
for (const x of [0, -1, -2, -3, -4]) { m.addNum(x); out.push(m.findMedian()); }
return deepEqual(out, [0, -0.5, -1, -1.5, -2]);`,
            },
            {
              name: "fast: 150,000 adds with findMedian after each (O(log n) needed)",
              code: `const m = new MedianFinder();
let seed = 1, ok = true;
const t0 = performance.now();
for (let i = 1; i <= 150000; i++) {
  seed = (seed * 48271) % 2147483647;
  m.addNum((seed % 200001) - 100000);
  const med = m.findMedian();
  if (typeof med !== "number" || Number.isNaN(med)) ok = false;
}
m.addNum(1e9); m.addNum(1e9); // pushes the median up but keeps it finite
return ok && Number.isFinite(m.findMedian()) && performance.now() - t0 < 600;`,
            },
          ],
          hint: "Two heaps: a max-heap `low` and a min-heap `high`. On add: push into `low`, move `low`'s top to `high`, and if `high` became bigger, move its top back. The median is `low`'s top, or the average of both tops.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Priority queues in production",
          text: "Job queues on Railway workers (e.g. BullMQ on Redis) support job **priorities** — a Redis sorted set playing the role of the heap. Node.js's own timers keep pending `setTimeout`s in a priority queue ordered by due time (its internal module is literally `internal/priority_queue`). And \"top 10 products by revenue\" over a big stream of Shopify orders is a size-10 min-heap, not a full sort.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In the array `[1, 3, 2, 7, 4]` used as a heap, what is the parent index of index 4?",
              options: ["2", "1", "0", "3"],
              answer: 1,
              why: "parent(i) = Math.floor((i − 1) / 2) = Math.floor(3 / 2) = 1, the node with value 3 — and indeed 3 ≤ 4.",
            },
            {
              q: "To keep the k LARGEST items of a stream, which heap of size k do you maintain?",
              options: ["A max-heap", "Either; it doesn't matter", "No heap; sort at the end", "A min-heap — its root is the weakest of the top k, the one to evict"],
              answer: 3,
              why: "You need O(1) access to the smallest of your current top-k so you can compare and replace it. That's a min-heap's root.",
            },
            {
              q: "What's the complexity of merging k sorted lists with N nodes in total using a heap?",
              options: ["O(N log k)", "O(N k)", "O(N²)", "O(k log N)"],
              answer: 0,
              why: "Each of the N nodes is pushed and popped once on a heap that never holds more than k items: O(log k) each.",
            },
            {
              q: "Why does pop() move the LAST array element to the root before sifting down?",
              options: [
                "Because the last element is always the largest",
                "To sort the array",
                "It's the only element that can be removed in O(1) while keeping the tree complete",
                "It isn't needed; you could shift() instead",
              ],
              answer: 2,
              why: "Removing the last slot keeps the shape a complete tree with no gaps. Sift down then repairs the order in O(log n). `shift()` would be O(n) and scramble every parent/child relationship.",
            },
          ],
        },
      ],
    },
  ],
};
