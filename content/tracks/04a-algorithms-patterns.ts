import type { Track } from "../types";

export const track: Track = {
  slug: "algorithms-patterns",
  order: 4.1,
  title: "Problem Solving Patterns",
  tagline: "Big-O and the patterns behind most LeetCode problems",
  outcome: "Approach any array or string problem with a repeatable method, state its Big-O, and recognise when to reach for a hash map, two pointers, a sliding window, prefix sums or sort-and-sweep.",
  badge: "ALG",
  color: "#ec4899",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Method + Big-O
    // ─────────────────────────────────────────────────────────────
    {
      slug: "approach-and-big-o",
      title: "How to approach a problem & Big-O",
      summary: "A repeatable six-step method for any problem, and how to measure a solution's cost with Big-O — including the hidden costs of JS built-ins.",
      minutes: 35,
      blocks: [
        {
          type: "p",
          text: "Most people stare at a LeetCode problem waiting for inspiration. Strong solvers don't: they run the same **method** every time, and they know how to **measure** a solution before they write it. The method gets you unstuck; the measurement (Big-O) tells you whether your idea is good enough for the input size. Both carry over directly to client work — the loop that is \"fine\" on 50 test products and times out on a real 40,000-product Shopify catalogue is a Big-O problem.",
        },
        { type: "h", text: "A repeatable method" },
        {
          type: "steps",
          items: [
            {
              title: "1. Understand",
              text: "Restate the problem in one sentence. What exactly is the input (sorted? negatives? duplicates? empty?) and what is the output (indices or values? any order? in place?). Read the **constraints**: they tell you the target complexity.",
            },
            {
              title: "2. Examples",
              text: "Work 2–3 examples by hand, including edge cases: empty input, one element, all equal, negatives, the answer at the very start or end. Writing them down often reveals the algorithm.",
            },
            {
              title: "3. Brute force",
              text: "Say (or write) the most obvious correct solution, usually \"try every pair / every subarray\". State its Big-O. A correct slow answer beats a fast wrong one, and it gives you something to optimise.",
            },
            {
              title: "4. Optimise",
              text: "Find the **bottleneck**: what work is repeated? Typical fixes: remember things in a Set/Map (hash map), sort first, move two pointers instead of two nested loops, keep a running window or running total.",
            },
            {
              title: "5. Code",
              text: "Write it with clear names (`left`, `right`, `seen`, `count`). Handle the edge cases you found in step 2 explicitly.",
            },
            {
              title: "6. Test",
              text: "Trace your code on one small example line by line, then run the edge cases. Off-by-one errors live in loop bounds and in `<` vs `<=`.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Constraints are a hint",
          text: "A typical judge does around 10^8 simple operations per second. So `n <= 10^5` almost always means \"O(n log n) or better\", while `n <= 500` allows O(n²) or even O(n³), and `n <= 20` hints at trying every subset (O(2^n)).",
        },
        {
          type: "table",
          rows: [
            ["Constraint on n", "Usually acceptable", "Typical technique"],
            ["n <= 20", "O(2^n), O(n!)", "backtracking, try all subsets"],
            ["n <= 500", "O(n³)", "triple loops, small DP tables"],
            ["n <= 10^4", "O(n²)", "nested loops, 2D DP"],
            ["n <= 10^5 – 10^6", "O(n log n) or O(n)", "sorting, hash maps, two pointers, sliding window"],
            ["n up to 10^9+", "O(log n) or O(1)", "binary search, math"],
          ],
        },
        { type: "h", text: "Big-O: how work grows with the input" },
        {
          type: "p",
          text: "Big-O describes how the number of steps grows as the input size `n` grows, in the **worst case**, ignoring constant factors and smaller terms. A loop that does `3n + 7` steps is O(n): when `n` doubles, the work roughly doubles. Two nested loops over the same array are O(n²): when `n` doubles, the work quadruples. We drop constants because they depend on the machine; the *growth rate* is what decides whether your code survives 10× more data.",
        },
        {
          type: "p",
          text: "Rather than timing code (which depends on your laptop), let's **count** operations for the five complexities you will meet constantly:",
        },
        {
          type: "run",
          title: "Counting operations",
          code: `// Each function returns how many "steps" it performs for an input of size n.
function constant(n) {          // O(1): e.g. read nums[0] or look up a key in a Set
  return 1;
}
function logarithmic(n) {       // O(log n): halve the problem each step (binary search)
  let ops = 0;
  for (let size = n; size > 1; size = Math.floor(size / 2)) ops++;
  return ops;
}
function linear(n) {            // O(n): one pass over the data
  let ops = 0;
  for (let i = 0; i < n; i++) ops++;
  return ops;
}
function linearithmic(n) {      // O(n log n): a log n amount of work for each element (good sorts)
  let ops = 0;
  for (let i = 0; i < n; i++) ops += logarithmic(n);
  return ops;
}
function quadratic(n) {         // O(n²): every element against every element
  let ops = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) ops++;
  }
  return ops;
}

console.log("n".padStart(6), "O(1)".padStart(6), "O(log n)".padStart(9), "O(n)".padStart(7), "O(n log n)".padStart(11), "O(n²)".padStart(12));
for (const n of [10, 100, 1000, 10000]) {
  console.log(
    String(n).padStart(6),
    String(constant(n)).padStart(6),
    String(logarithmic(n)).padStart(9),
    String(linear(n)).padStart(7),
    String(linearithmic(n)).padStart(11),
    String(quadratic(n)).padStart(12),
  );
}
// Try adding 100000 to the list: O(n²) becomes 10 billion steps. Too slow to count!`,
        },
        {
          type: "table",
          rows: [
            ["Big-O", "Name", "Example", "Steps for n = 100,000"],
            ["O(1)", "constant", "`arr[i]`, `set.has(x)`, `map.get(k)`", "1"],
            ["O(log n)", "logarithmic", "binary search in a sorted array", "~17"],
            ["O(n)", "linear", "one loop, `arr.includes(x)`", "100,000"],
            ["O(n log n)", "linearithmic", "`arr.sort()`", "~1,700,000"],
            ["O(n²)", "quadratic", "nested loops over all pairs", "10,000,000,000"],
          ],
        },
        { type: "h", text: "Space complexity" },
        {
          type: "p",
          text: "Space complexity is the **extra** memory your algorithm uses as `n` grows, not counting the input itself (and, by convention, usually not the output). Swapping two variables is O(1) space. Copying the array, or putting every element in a Set, is O(n) space. Recursion also costs space: each pending call sits on the call stack, so recursing `n` levels deep is O(n) space. Most optimisations in this track trade **space for time**: we spend O(n) memory on a Set or Map to turn an O(n²) search into O(n).",
        },
        { type: "h", text: "The hidden cost of JavaScript built-ins" },
        {
          type: "p",
          text: "One line of JavaScript is not one step. A method that has to look at every element is a loop in disguise — and a loop inside your loop is O(n²), even if you only wrote one `for`.",
        },
        {
          type: "table",
          rows: [
            ["Operation", "Cost", "Why"],
            ["`arr[i]`, `arr.length`, `arr.push(x)`, `arr.pop()`", "O(1)", "direct index access; push is *amortised* O(1) (the array occasionally grows its storage)"],
            ["`arr.includes(x)`, `indexOf`, `find`, `some`, `filter`", "O(n)", "they scan the array from the start"],
            ["`arr.shift()`, `arr.unshift(x)`, `splice` in the middle", "O(n)", "every following element has to move one slot"],
            ["`arr.slice()`, `[...arr]`, `concat`, `Array.from`", "O(n)", "they copy every element"],
            ["`arr.sort(compare)`", "O(n log n)", "V8 uses TimSort; it also sorts in place"],
            ["`set.has/add/delete`, `map.get/set/has`", "O(1) average", "hash tables"],
            ["`str[i]`, `str.length`", "O(1)", "direct access"],
            ["`str.slice`, `split`, `str1 + str2`, `toLowerCase`", "O(length)", "strings are immutable, so a new string is built"],
            ["`Object.keys(obj)`, `JSON.stringify(obj)`", "O(size)", "they visit every property"],
          ],
        },
        {
          type: "run",
          title: "includes vs Set.has, shift vs an index",
          code: `const n = 20000;
const ids = Array.from({ length: n }, (_, i) => i * 2); // even numbers only
const idSet = new Set(ids);
const queries = Array.from({ length: n }, (_, i) => i);

let t0 = performance.now();
let hits = 0;
for (const q of queries) if (ids.includes(q)) hits++;     // O(n) per lookup → O(n²) total
console.log("array.includes:", hits, "hits in", Math.round(performance.now() - t0), "ms");

t0 = performance.now();
hits = 0;
for (const q of queries) if (idSet.has(q)) hits++;        // O(1) per lookup → O(n) total
console.log("set.has:       ", hits, "hits in", Math.round(performance.now() - t0), "ms");

// Using an array as a queue
const jobs = Array.from({ length: 40000 }, (_, i) => i);
t0 = performance.now();
const queue = [...jobs];
let processed = 0;
while (queue.length) { queue.shift(); processed++; }      // each shift moves everything left
console.log("shift():       ", processed, "jobs in", Math.round(performance.now() - t0), "ms");

t0 = performance.now();
let head = 0;
processed = 0;
while (head < jobs.length) { head++; processed++; }       // just move a read pointer
console.log("head index:    ", processed, "jobs in", Math.round(performance.now() - t0), "ms");`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "One-liners that are secretly O(n²)",
          text: "`items.filter((x, i) => items.indexOf(x) === i)` (dedupe), `a.filter((x) => b.includes(x))` (intersection) and `while (queue.length) queue.shift()` are all quadratic. Use `new Set(items)`, a Set built from `b`, and a head index instead.",
        },
        {
          type: "callout",
          tone: "info",
          title: "What about string += in a loop?",
          text: "In many languages, `s += piece` in a loop copies the whole string each time, which is O(n²). V8 is smarter: it builds a *rope* (a tree of pieces) and flattens it later, so `+=` is usually fine in practice. Pushing pieces into an array and calling `join(\"\")` once is still the portable, clearly-O(n) habit — and the one interviewers expect to hear about.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "This is real-world performance",
          text: "Matching 40,000 Shopify products against 5,000 \"featured\" IDs with `featured.includes(p.id)` is 200 million comparisons inside a Next.js route handler. `const featuredSet = new Set(featured)` makes it 40,000 cheap lookups. Same story for de-duplicating leads from a Supabase query: a `Set` of emails, not a nested loop.",
        },
        {
          type: "callout",
          tone: "info",
          title: "How the exercises in this track work",
          text: "Like on LeetCode, `ListNode` and `TreeNode` are predefined, along with helpers the tests use: `toList([1,2,3])` / `fromList(head)` for linked lists, `toTree([...])` / `fromTree(root)` for trees (LeetCode's level-order format), `deepEqual(a, b)` and `sameMembers(a, b)` (same items, any order). You can use them in your own code too. Some tests check speed on large inputs: a brute-force answer passes the small tests but fails those.",
        },
        { type: "h", text: "Warm-ups" },
        {
          type: "p",
          text: "Three easy problems to practise the method. Before coding each one, say its brute force and its Big-O out loud.",
        },
        {
          type: "challenge",
          title: "Find the Maximum",
          difficulty: "easy",
          tags: ["array", "linear scan"],
          prompt: "Given an array of numbers `nums`, return the largest value. If the array is empty, return `null`. Do it with a single pass, without sorting.",
          examples: [
            { input: "nums = [3, 7, 2, 9, 4]", output: "9" },
            { input: "nums = [-5, -2, -9]", output: "-2", explanation: "Starting your max at 0 would wrongly return 0." },
            { input: "nums = []", output: "null" },
          ],
          constraints: ["0 <= nums.length <= 10^6", "-10^9 <= nums[i] <= 10^9"],
          complexity: "O(n) time, O(1) space",
          starter: `function findMax(nums) {
  // your code here
}`,
          solution: `function findMax(nums) {
  if (nums.length === 0) return null;
  let max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] > max) max = nums[i];
  }
  return max;
}`,
          tests: [
            { name: "example: [3,7,2,9,4] → 9", code: "return findMax([3, 7, 2, 9, 4]) === 9;" },
            { name: "all negative: [-5,-2,-9] → -2", code: "return findMax([-5, -2, -9]) === -2;" },
            { name: "single element: [42] → 42", code: "return findMax([42]) === 42;" },
            { name: "empty array → null", code: "return findMax([]) === null;" },
            {
              name: "1,000,000 numbers (Math.max(...nums) would overflow the call stack)",
              code: `const big = Array.from({ length: 1000000 }, (_, i) => i % 1000);
big[654321] = 5000;
return findMax(big) === 5000;`,
            },
          ],
          hint: "Start `max` at the first element (not 0 — think negatives), then compare every other element once. `Math.max(...nums)` passes every element as a function argument and throws on very large arrays.",
        },
        {
          type: "compare",
          left: {
            label: "Brute force: compare every pair — O(n²) time, O(1) space",
            lang: "js",
            code: `function containsDuplicate(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }
  return false;
}`,
          },
          right: {
            label: "Optimal: remember what you've seen — O(n) time, O(n) space",
            lang: "js",
            code: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
          },
        },
        {
          type: "p",
          text: "Notice the move: the brute force asks \"is there an earlier element equal to this one?\" by **scanning**. The optimal version asks the same question of a Set, in O(1). We paid O(n) memory to save a whole factor of n in time. You'll see this trade in almost every lesson of this track. Now write it yourself — the last test will only pass with the fast version.",
        },
        {
          type: "challenge",
          title: "Contains Duplicate",
          difficulty: "easy",
          tags: ["array", "hash set"],
          prompt: "Given an array of integers `nums` (for example, invoice numbers imported from a CSV), return `true` if any value appears at least twice, and `false` if every value is distinct.",
          examples: [
            { input: "nums = [1, 2, 3, 1]", output: "true", explanation: "1 appears at index 0 and index 3." },
            { input: "nums = [1, 2, 3, 4]", output: "false" },
            { input: "nums = []", output: "false" },
          ],
          constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
          complexity: "O(n) time, O(n) space",
          starter: `function containsDuplicate(nums) {
  // your code here
}`,
          solution: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`,
          tests: [
            { name: "example: [1,2,3,1] → true", code: "return containsDuplicate([1, 2, 3, 1]) === true;" },
            { name: "all distinct: [1,2,3,4] → false", code: "return containsDuplicate([1, 2, 3, 4]) === false;" },
            { name: "empty array → false", code: "return containsDuplicate([]) === false;" },
            { name: "negatives: [-1, 5, -1] → true", code: "return containsDuplicate([-1, 5, -1]) === true;" },
            {
              name: "50,000 distinct numbers in under 300 ms (O(n) needed)",
              code: `const nums = Array.from({ length: 50000 }, (_, i) => i * 3 - 70000);
const t0 = performance.now();
const r = containsDuplicate(nums);
return r === false && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Walk the array once. Before adding a number to a `Set`, ask the Set whether it's already there. (One-liner alternative: compare `new Set(nums).size` with `nums.length`.)",
        },
        {
          type: "p",
          text: "Next, an **in-place** problem: you may not allocate a second array, so the space must be O(1). The classic trick is **two pointers** walking toward each other — a preview of lesson 4.",
        },
        {
          type: "table",
          rows: [
            ["Step", "left", "right", "chars after swap"],
            ["start", "0", "4", "h e l l o"],
            ["swap 0↔4", "1", "3", "o e l l h"],
            ["swap 1↔3", "2", "2", "o l l e h"],
            ["left >= right → stop", "", "", "o l l e h"],
          ],
        },
        {
          type: "challenge",
          title: "Reverse String In Place",
          difficulty: "easy",
          tags: ["two pointers", "in place"],
          prompt: "You are given an array of single characters `chars`. Reverse it **in place** — modify the given array, use O(1) extra memory, and don't return anything. Don't use the built-in `.reverse()`.",
          examples: [
            { input: 'chars = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 'chars = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
          ],
          constraints: ["0 <= chars.length <= 10^5", "chars[i] is a printable character"],
          complexity: "O(n) time, O(1) space",
          starter: `function reverseString(chars) {
  // modify chars directly, no return value
}`,
          solution: `function reverseString(chars) {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    const tmp = chars[left];
    chars[left] = chars[right];
    chars[right] = tmp;
    left++;
    right--;
  }
}`,
          tests: [
            {
              name: 'odd length: "hello" → "olleh"',
              code: `const s = ["h", "e", "l", "l", "o"];
reverseString(s);
return deepEqual(s, ["o", "l", "l", "e", "h"]);`,
            },
            {
              name: 'even length: "Hannah" → "hannaH"',
              code: `const s = ["H", "a", "n", "n", "a", "h"];
reverseString(s);
return deepEqual(s, ["h", "a", "n", "n", "a", "H"]);`,
            },
            {
              name: "single character and empty array stay the same",
              code: `const one = ["x"]; const none = [];
reverseString(one); reverseString(none);
return deepEqual(one, ["x"]) && deepEqual(none, []);`,
            },
            {
              name: "done by hand (no .reverse())",
              code: `const s = ["a", "b", "c"];
reverseString(s);
return deepEqual(s, ["c", "b", "a"]) && !String(reverseString).includes(".reverse(");`,
            },
          ],
          hint: "Put `left` at index 0 and `right` at the last index. Swap, move both inward, stop when they meet.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A problem says `1 <= nums.length <= 10^5`. Which complexity should you aim for?",
              options: ["O(n²) is fine", "O(n log n) or better", "O(2^n)", "O(n³)"],
              answer: 1,
              why: "10^5 squared is 10^10 steps — far beyond ~10^8 per second. O(n log n) is about 1.7 million steps.",
            },
            {
              q: "`for (const id of orderIds) if (refundedIds.includes(id)) count++;` — both arrays have n items. What is the time complexity?",
              options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
              answer: 2,
              why: "`includes` scans `refundedIds` (O(n)) once per order id (n times). Converting `refundedIds` to a Set first brings it to O(n).",
            },
            {
              q: "Reversing an array in place with two pointers uses how much extra space?",
              options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
              answer: 0,
              why: "Only a few variables (`left`, `right`, `tmp`) regardless of the array's size.",
            },
            {
              q: "Which operation is O(1) on average?",
              options: ["`arr.includes(x)`", "`arr.shift()`", "`arr.indexOf(x)`", "`set.has(x)`"],
              answer: 3,
              why: "Sets are hash tables: a lookup hashes the value and jumps to its bucket. The other three may touch every element.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 2. Arrays & strings
    // ─────────────────────────────────────────────────────────────
    {
      slug: "arrays-and-strings",
      title: "Arrays & strings: in-place edits and counting",
      summary: "Write pointers, swaps, reversals and frequency counts: the building blocks behind most array and string problems.",
      minutes: 40,
      blocks: [
        {
          type: "p",
          text: "Arrays and strings are the raw material of most interview problems, and the same handful of moves keeps coming back: **swap** two elements, keep a **write pointer** while you read, **reverse** a range, **count** characters, **build** a string from pieces. Learn them once and many \"easy\" problems become two-minute exercises — and the medium ones become combinations of them.",
        },
        { type: "h", text: "Why in place?" },
        {
          type: "p",
          text: "An array is a block of consecutive slots: reading `arr[i]` or writing to the end is O(1), but inserting or removing at the front or middle shifts every following element — O(n). So an algorithm that calls `splice` inside a loop is quietly O(n²). In-place algorithms instead **overwrite** slots as they go, using O(1) extra memory. Problems signal this with phrases like \"modify the array in place\", \"O(1) extra space\" or \"do not return anything\".",
        },
        {
          type: "p",
          text: "The most useful in-place tool is the **read/write pointer**: `read` visits every element, `write` marks where the next element you want to *keep* should go. Here it is moving every zero to the end of `[0, 1, 0, 3, 12]` while keeping the order of the other values:",
        },
        {
          type: "table",
          rows: [
            ["read", "nums[read]", "action", "write after", "array after"],
            ["0", "0", "skip (zero)", "0", "[0, 1, 0, 3, 12]"],
            ["1", "1", "swap with nums[0], write++", "1", "[1, 0, 0, 3, 12]"],
            ["2", "0", "skip (zero)", "1", "[1, 0, 0, 3, 12]"],
            ["3", "3", "swap with nums[1], write++", "2", "[1, 3, 0, 0, 12]"],
            ["4", "12", "swap with nums[2], write++", "3", "[1, 3, 12, 0, 0]"],
          ],
        },
        { type: "h", text: "Strings are immutable" },
        {
          type: "p",
          text: "You cannot change a character inside a JavaScript string: every \"edit\" creates a new string. For string problems you either **read** characters by index (O(1)), **count** them, or collect pieces in an array and `join` once at the end. When you need to edit in place, convert first: `const chars = [...str]`.",
        },
        {
          type: "run",
          title: "The array & string toolkit",
          code: `// 1. Strings can't be edited (strict mode even throws)
const name = "lead";
try {
  name[0] = "L";
} catch (e) {
  console.log("Error:", e.message);
}

// 2. Swap and reverse a range in place
function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}
function reverseRange(arr, lo, hi) {
  while (lo < hi) swap(arr, lo++, hi--);
}
const steps = ["brief", "design", "build", "test", "launch"];
reverseRange(steps, 1, 3);
console.log("reverse 1..3:", steps);

// 3. Frequency counting — with a Map (any characters)…
function countChars(str) {
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  return counts;
}
console.log(countChars("montréal"));

// …or with 26 slots when the input is only lowercase a–z
function countLetters(str) {
  const counts = new Array(26).fill(0);
  for (let i = 0; i < str.length; i++) counts[str.charCodeAt(i) - 97]++;
  return counts;
}
console.log("letters in 'banana':", countLetters("banana").slice(0, 14).join(","));

// 4. Building a string: collect pieces, join once
const parts = [];
for (const tag of ["seo", "ads", "web"]) parts.push(tag.toUpperCase());
console.log(parts.join(" | "));`,
        },
        {
          type: "challenge",
          title: "Valid Anagram",
          difficulty: "easy",
          tags: ["string", "frequency count"],
          prompt: "Given two strings `s` and `t` of lowercase English letters, return `true` if `t` is an anagram of `s` — that is, it uses exactly the same letters the same number of times, in any order — and `false` otherwise.",
          examples: [
            { input: 's = "anagram", t = "nagaram"', output: "true" },
            { input: 's = "rat", t = "car"', output: "false" },
          ],
          constraints: ["0 <= s.length, t.length <= 5 * 10^4", "s and t contain only a–z"],
          complexity: "O(n) time, O(1) space (26 counters)",
          starter: `function isAnagram(s, t) {
  // your code here
}`,
          solution: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++;
    counts[t.charCodeAt(i) - 97]--;
  }
  return counts.every((c) => c === 0);
}`,
          tests: [
            { name: 'example: "anagram" / "nagaram" → true', code: 'return isAnagram("anagram", "nagaram") === true;' },
            { name: 'example: "rat" / "car" → false', code: 'return isAnagram("rat", "car") === false;' },
            { name: 'different lengths: "ab" / "abc" → false', code: 'return isAnagram("ab", "abc") === false;' },
            { name: 'same letters, different counts: "aab" / "abb" → false', code: 'return isAnagram("aab", "abb") === false;' },
            { name: "two empty strings → true", code: 'return isAnagram("", "") === true;' },
          ],
          hint: "Count each letter of `s` up and each letter of `t` down. They are anagrams exactly when every count ends at zero. (Sorting both strings also works, in O(n log n).)",
        },
        {
          type: "p",
          text: "Now the read/write pointer from the table above. The key insight: you never need to *move zeroes* at all — you move the **non-zeroes** forward, and the zeroes end up at the back by themselves.",
        },
        {
          type: "challenge",
          title: "Move Zeroes",
          difficulty: "easy",
          tags: ["array", "two pointers", "in place"],
          prompt: "Given an array `nums`, move all `0`s to the end while keeping the relative order of the non-zero elements. Do it **in place** (modify `nums`, don't return anything).",
          examples: [
            { input: "nums = [0, 1, 0, 3, 12]", output: "[1, 3, 12, 0, 0]" },
            { input: "nums = [0]", output: "[0]" },
          ],
          constraints: ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
          complexity: "O(n) time, O(1) space",
          starter: `function moveZeroes(nums) {
  // modify nums directly
}`,
          solution: `function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      const tmp = nums[write];
      nums[write] = nums[read];
      nums[read] = tmp;
      write++;
    }
  }
}`,
          tests: [
            {
              name: "example: [0,1,0,3,12] → [1,3,12,0,0]",
              code: `const a = [0, 1, 0, 3, 12]; moveZeroes(a); return deepEqual(a, [1, 3, 12, 0, 0]);`,
            },
            { name: "single zero: [0] → [0]", code: `const a = [0]; moveZeroes(a); return deepEqual(a, [0]);` },
            { name: "no zeroes: unchanged", code: `const a = [4, 2, 7]; moveZeroes(a); return deepEqual(a, [4, 2, 7]);` },
            {
              name: "keeps order of negatives: [-1,0,-2,0,0,5] → [-1,-2,5,0,0,0]",
              code: `const a = [-1, 0, -2, 0, 0, 5]; moveZeroes(a); return deepEqual(a, [-1, -2, 5, 0, 0, 0]);`,
            },
            { name: "all zeroes stay zeroes", code: `const a = [0, 0, 0]; moveZeroes(a); return deepEqual(a, [0, 0, 0]);` },
          ],
          hint: "Keep a `write` index starting at 0. Each time you read a non-zero value, swap it into `nums[write]` and advance `write`.",
        },
        {
          type: "p",
          text: "Not every string problem needs counting. Sometimes you just compare characters **column by column** and stop at the first mismatch — that's vertical scanning.",
        },
        {
          type: "challenge",
          title: "Longest Common Prefix",
          difficulty: "easy",
          tags: ["string"],
          prompt: "Given an array of strings `strs` (say, product SKUs), return the longest prefix that **all** of them share. If they share nothing, return the empty string `\"\"`.",
          examples: [
            { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
            { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: "No common first letter." },
          ],
          constraints: ["1 <= strs.length <= 200", "0 <= strs[i].length <= 200"],
          complexity: "O(S) time where S is the total number of characters, O(1) extra space",
          starter: `function longestCommonPrefix(strs) {
  // your code here
}`,
          solution: `function longestCommonPrefix(strs) {
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const ch = first[i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) return first.slice(0, i);
    }
  }
  return first;
}`,
          tests: [
            { name: 'example: ["flower","flow","flight"] → "fl"', code: 'return longestCommonPrefix(["flower", "flow", "flight"]) === "fl";' },
            { name: 'no common prefix → ""', code: 'return longestCommonPrefix(["dog", "racecar", "car"]) === "";' },
            { name: 'one string → the whole string', code: 'return longestCommonPrefix(["shopify"]) === "shopify";' },
            { name: 'contains an empty string → ""', code: 'return longestCommonPrefix(["abc", "", "abd"]) === "";' },
            { name: 'one string is the prefix of the others: ["SKU-1","SKU-12","SKU-123"] → "SKU-1"', code: 'return longestCommonPrefix(["SKU-1", "SKU-12", "SKU-123"]) === "SKU-1";' },
          ],
          hint: "Take the first string as the candidate. For each index `i`, check that every other string has the same character at `i`; the first time one doesn't (or is too short), return `first.slice(0, i)`.",
        },
        { type: "h", text: "Reversal as a tool: rotating an array" },
        {
          type: "p",
          text: "Rotating `[1,2,3,4,5,6,7]` right by 3 gives `[5,6,7,1,2,3,4]`. Moving one element at a time is slow. The clever observation: rotation is just **three reversals**. Reverse everything (`7 6 5 4 3 2 1`), then reverse the first k (`5 6 7 | 4 3 2 1`), then the rest (`5 6 7 | 1 2 3 4`). Each reversal is O(n) and in place.",
        },
        {
          type: "compare",
          left: {
            label: "Brute force: move one element k times — O(n·k) time",
            lang: "js",
            code: `function rotate(nums, k) {
  k = k % nums.length;
  for (let step = 0; step < k; step++) {
    nums.unshift(nums.pop()); // unshift is O(n)
  }
}`,
          },
          right: {
            label: "Optimal: three reversals — O(n) time, O(1) space",
            lang: "js",
            code: `function rotate(nums, k) {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}`,
          },
        },
        {
          type: "challenge",
          title: "Rotate Array",
          difficulty: "medium",
          tags: ["array", "in place", "reversal"],
          prompt: "Given an array `nums`, rotate it to the right by `k` steps, **in place**: each element moves `k` positions to the right, and elements falling off the end wrap around to the front. `k` may be larger than the array's length.",
          examples: [
            { input: "nums = [1,2,3,4,5,6,7], k = 3", output: "[5,6,7,1,2,3,4]" },
            { input: "nums = [-1,-100,3,99], k = 2", output: "[3,99,-1,-100]" },
            { input: "nums = [1,2,3], k = 4", output: "[3,1,2]", explanation: "Rotating by 4 is the same as rotating by 4 % 3 = 1." },
          ],
          constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
          complexity: "O(n) time, O(1) space",
          starter: `function rotate(nums, k) {
  // modify nums directly
}`,
          solution: `function rotate(nums, k) {
  const n = nums.length;
  k = k % n;
  reverse(nums, 0, n - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, n - 1);
}

function reverse(arr, lo, hi) {
  while (lo < hi) {
    const tmp = arr[lo];
    arr[lo] = arr[hi];
    arr[hi] = tmp;
    lo++;
    hi--;
  }
}`,
          tests: [
            {
              name: "example: [1..7], k = 3 → [5,6,7,1,2,3,4]",
              code: `const a = [1, 2, 3, 4, 5, 6, 7]; rotate(a, 3); return deepEqual(a, [5, 6, 7, 1, 2, 3, 4]);`,
            },
            {
              name: "example: [-1,-100,3,99], k = 2 → [3,99,-1,-100]",
              code: `const a = [-1, -100, 3, 99]; rotate(a, 2); return deepEqual(a, [3, 99, -1, -100]);`,
            },
            { name: "k larger than length: [1,2,3], k = 4 → [3,1,2]", code: `const a = [1, 2, 3]; rotate(a, 4); return deepEqual(a, [3, 1, 2]);` },
            { name: "k = 0 and k = length leave it unchanged", code: `const a = [1, 2]; rotate(a, 0); const b = [1, 2]; rotate(b, 2); return deepEqual(a, [1, 2]) && deepEqual(b, [1, 2]);` },
            {
              name: "100,000 elements, k = 30,000, in under 300 ms",
              code: `const n = 100000;
const a = Array.from({ length: n }, (_, i) => i);
const t0 = performance.now();
rotate(a, 30000);
const ok = a[0] === n - 30000 && a[30000] === 0 && a[n - 1] === n - 30001;
return ok && performance.now() - t0 < 300;`,
            },
          ],
          hint: "First reduce `k` with `k % nums.length`. Then write a `reverse(arr, lo, hi)` helper and call it three times: whole array, first `k`, the rest.",
        },
        { type: "h", text: "Precomputing from both sides" },
        {
          type: "p",
          text: "Some problems need, for every index, information about **everything to its left and everything to its right**. Recomputing that for each index is O(n²). Instead, sweep once from the left storing a running result, then once from the right. For \"product of everything except me\" on `[1, 2, 3, 4]`:",
        },
        {
          type: "table",
          rows: [
            ["i", "nums[i]", "product of left side", "product of right side", "answer = left × right"],
            ["0", "1", "1 (nothing)", "2·3·4 = 24", "24"],
            ["1", "2", "1", "3·4 = 12", "12"],
            ["2", "3", "1·2 = 2", "4", "8"],
            ["3", "4", "1·2·3 = 6", "1 (nothing)", "6"],
          ],
        },
        {
          type: "challenge",
          title: "Product of Array Except Self",
          difficulty: "medium",
          tags: ["array", "prefix product"],
          prompt: "Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of every element of `nums` **except** `nums[i]`. You may **not** use division (it would also break on zeroes), and you must run in O(n) time.",
          examples: [
            { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
            { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
          ],
          constraints: ["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30", "every product fits in a safe integer"],
          complexity: "O(n) time, O(1) extra space (the output array doesn't count)",
          starter: `function productExceptSelf(nums) {
  // your code here
}`,
          solution: `function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n);
  let left = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = left;        // product of everything before i
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= right;      // times product of everything after i
    right *= nums[i];
  }
  return answer;
}`,
          tests: [
            {
              name: "example: [1,2,3,4] → [24,12,8,6]",
              code: `const r = productExceptSelf([1, 2, 3, 4]); const e = [24, 12, 8, 6];
return r.length === e.length && r.every((x, i) => x === e[i]);`,
            },
            {
              name: "one zero: [-1,1,0,-3,3] → [0,0,9,0,0]",
              code: `const r = productExceptSelf([-1, 1, 0, -3, 3]); const e = [0, 0, 9, 0, 0];
return r.length === e.length && r.every((x, i) => x === e[i]);`,
            },
            {
              name: "two zeroes: [0,4,0] → [0,0,0]",
              code: `const r = productExceptSelf([0, 4, 0]); const e = [0, 0, 0];
return r.length === e.length && r.every((x, i) => x === e[i]);`,
            },
            {
              name: "two elements: [5,7] → [7,5]",
              code: `const r = productExceptSelf([5, 7]); return r.length === 2 && r[0] === 7 && r[1] === 5;`,
            },
            {
              name: "20,000 elements in under 300 ms (O(n) needed)",
              code: `const n = 20000;
const nums = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 1 : -1));
nums[10] = 2;
const t0 = performance.now();
const r = productExceptSelf(nums);
const ms = performance.now() - t0;
// total product is 2 * (-1)^10000 = 2, so answer[i] = 2 / nums[i]
return r.length === n && r[10] === 1 && r[0] === 2 && r[1] === -2 && ms < 300;`,
            },
          ],
          hint: "First pass left → right: store in `answer[i]` the product of everything before `i`. Second pass right → left with a running `right` product: multiply it into `answer[i]`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Why is calling `nums.splice(i, 1)` inside a loop over `nums` a performance trap?",
              options: [
                "splice is not allowed in strict mode",
                "Each splice shifts all later elements, so the loop becomes O(n²)",
                "splice copies the whole array into a new one",
                "It isn't — splice is O(1)",
              ],
              answer: 1,
              why: "Removing from the middle moves every following element one slot left: O(n) per call, O(n²) across the loop. A write pointer does the same job in one pass.",
            },
            {
              q: "Rotating an array right by k in place with the three-reversal trick costs…",
              options: ["O(n) time, O(1) space", "O(n·k) time, O(1) space", "O(n) time, O(n) space", "O(n log n) time"],
              answer: 0,
              why: "Each reversal touches each element at most once and only swaps with a temporary variable.",
            },
            {
              q: "To count letters of a string known to contain only `a`–`z`, what's the simplest O(1)-space structure?",
              options: ["A sorted copy of the string", "A Set", "A nested loop", "An array of 26 counters indexed by `charCodeAt(i) - 97`"],
              answer: 3,
              why: "The alphabet size is fixed (26), so the counter array has constant size no matter how long the string is. A Set can't count.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 3. Hash maps & sets
    // ─────────────────────────────────────────────────────────────
    {
      slug: "hash-maps-and-sets",
      title: "Hash maps & sets",
      summary: "Trade a little memory for a lot of speed: remember what you've seen, count, group and look things up in O(1).",
      minutes: 45,
      blocks: [
        {
          type: "p",
          text: "If one pattern had to carry you through interviews, it would be this one. A **Set** answers \"have I seen X?\" and a **Map** answers \"what do I know about X?\" (its index, its count, its group) — both in O(1) on average. Whenever a brute force has an inner loop that *searches* for something, ask: could I have stored it in a Map on the way and just looked it up?",
        },
        { type: "h", text: "Signals in the problem statement" },
        {
          type: "list",
          items: [
            "**Pairs / complements**: \"two numbers that add up to…\", \"a pair with difference k\" → store what you've seen, look up `target - x`.",
            "**Duplicates / uniqueness**: \"appears twice\", \"distinct\", \"first unique\" → Set, or Map of counts.",
            "**Counting / frequency**: \"most frequent\", \"same letters\", \"at most k occurrences\" → Map value → count.",
            "**Grouping**: \"group the words that…\", \"bucket the orders by…\" → Map of key → array.",
            "**Mapping / consistency**: \"each character maps to exactly one…\" → one or two Maps.",
          ],
        },
        { type: "h", text: "Map vs plain object" },
        {
          type: "table",
          rows: [
            ["", "`Map`", "plain object `{}`"],
            ["Key types", "anything (numbers stay numbers, even objects)", "strings and symbols only (`1` becomes `\"1\"`)"],
            ["Size", "`map.size` — O(1)", "`Object.keys(obj).length` — O(n)"],
            ["Iteration order", "insertion order", "integer-like keys first (ascending), then insertion order"],
            ["Built-in keys", "none", "inherits `constructor`, `toString`… from the prototype"],
            ["Best for", "algorithms, counts, caches", "fixed-shape records, JSON"],
          ],
        },
        {
          type: "run",
          title: "Why algorithms prefer Map",
          code: `// Counting words from campaign keywords with a plain object…
const words = ["seo", "constructor", "seo", "ads"];
const objCounts = {};
for (const w of words) objCounts[w] = (objCounts[w] || 0) + 1;
console.log(objCounts.constructor);  // "function Object() { [native code] }1" — oops!

// …and with a Map
const counts = new Map();
for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
console.log(counts);                 // Map(3) { 'seo' => 2, 'constructor' => 1, 'ads' => 1 }

// Number keys stay numbers in a Map
const byId = new Map([[42, "Acme"], [7, "Voltix"]]);
console.log(byId.get(42), [...byId.keys()]);   // "Acme" [42, 7]

// Grouping: Map of key → array (or Object.groupBy / Map.groupBy in modern JS)
const orders = [
  { id: 1, client: "Acme" }, { id: 2, client: "Voltix" }, { id: 3, client: "Acme" },
];
const byClient = new Map();
for (const o of orders) {
  if (!byClient.has(o.client)) byClient.set(o.client, []);
  byClient.get(o.client).push(o.id);
}
console.log(byClient);              // Map(2) { 'Acme' => [1, 3], 'Voltix' => [2] }`,
        },
        { type: "h", text: "The complement trick: Two Sum" },
        {
          type: "p",
          text: "Find two numbers that add up to `target`. Brute force checks every pair: O(n²). The insight: when you are standing on `x`, you know exactly which number you need — `target - x`. So walk once, and for each number first ask a Map \"have I already seen my complement?\", then record yourself. Trace on `nums = [3, 2, 4]`, `target = 6`:",
        },
        {
          type: "table",
          rows: [
            ["i", "nums[i]", "need = 6 − nums[i]", "Map before (value → index)", "found?"],
            ["0", "3", "3", "{}", "no → store 3 → 0"],
            ["1", "2", "4", "{3 → 0}", "no → store 2 → 1"],
            ["2", "4", "2", "{3 → 0, 2 → 1}", "yes! return [1, 2]"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Look up before you store",
          text: "With `[3, 2, 4]` and target 6, storing `3` before checking would let `3` match itself and return `[0, 0]`. Checking first guarantees the two indices are different.",
        },
        {
          type: "run",
          title: "Two Sum, traced",
          code: `function twoSum(nums, target) {
  const indexOf = new Map(); // value → index where we saw it
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    console.log("i=" + i, "value=" + nums[i], "need=" + need, "seen:", [...indexOf.keys()]);
    if (indexOf.has(need)) return [indexOf.get(need), i];
    indexOf.set(nums[i], i);
  }
  return [];
}

console.log("→", twoSum([3, 2, 4], 6));
console.log("→", twoSum([2, 7, 11, 15], 9));`,
        },
        {
          type: "compare",
          left: {
            label: "Brute force: every pair — O(n²) time, O(1) space",
            lang: "js",
            code: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return [];
}`,
          },
          right: {
            label: "Hash map: one pass — O(n) time, O(n) space",
            lang: "js",
            code: `function twoSum(nums, target) {
  const indexOf = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (indexOf.has(need)) return [indexOf.get(need), i];
    indexOf.set(nums[i], i);
  }
  return [];
}`,
          },
        },
        {
          type: "challenge",
          title: "Two Sum",
          difficulty: "easy",
          tags: ["hash map", "array"],
          prompt: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Exactly one answer exists, and you may not use the same element twice. Return the two indices in any order.",
          examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
            { input: "nums = [3,3], target = 6", output: "[0,1]" },
          ],
          constraints: ["2 <= nums.length <= 10^5", "-10^9 <= nums[i], target <= 10^9", "exactly one valid answer"],
          complexity: "O(n) time, O(n) space",
          starter: `function twoSum(nums, target) {
  // your code here
}`,
          solution: `function twoSum(nums, target) {
  const indexOf = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (indexOf.has(need)) return [indexOf.get(need), i];
    indexOf.set(nums[i], i);
  }
  return [];
}`,
          tests: [
            { name: "example: [2,7,11,15], 9 → [0,1]", code: "return sameMembers(twoSum([2, 7, 11, 15], 9), [0, 1]);" },
            { name: "doesn't reuse an element: [3,2,4], 6 → [1,2]", code: "return sameMembers(twoSum([3, 2, 4], 6), [1, 2]);" },
            { name: "duplicates: [3,3], 6 → [0,1]", code: "return sameMembers(twoSum([3, 3], 6), [0, 1]);" },
            { name: "negatives: [-3,4,3,90], 0 → [0,2]", code: "return sameMembers(twoSum([-3, 4, 3, 90], 0), [0, 2]);" },
            {
              name: "50,000 numbers in under 300 ms (O(n) needed)",
              code: `const n = 50000;
const nums = Array.from({ length: n }, (_, i) => i);
const t0 = performance.now();
const r = twoSum(nums, 2 * n - 3);
return sameMembers(r, [n - 2, n - 1]) && performance.now() - t0 < 300;`,
            },
          ],
          hint: "For each number, which *other* number do you need? Keep a Map from value to index, and check it before inserting the current number.",
        },
        {
          type: "p",
          text: "Same \"have I seen it?\" idea, with a twist: now **where** you saw it matters. Instead of a Set, store each value's **last index** in a Map and compare distances.",
        },
        {
          type: "challenge",
          title: "Contains Duplicate II",
          difficulty: "easy",
          tags: ["hash map", "array"],
          prompt: "Given an integer array `nums` and an integer `k`, return `true` if there are two **different** indices `i` and `j` with `nums[i] === nums[j]` and `Math.abs(i - j) <= k`. Think: did the same customer book twice within k days?",
          examples: [
            { input: "nums = [1,2,3,1], k = 3", output: "true", explanation: "Indices 0 and 3, distance 3." },
            { input: "nums = [1,0,1,1], k = 1", output: "true", explanation: "Indices 2 and 3." },
            { input: "nums = [1,2,3,1,2,3], k = 2", output: "false", explanation: "Equal values are always 3 apart." },
          ],
          constraints: ["1 <= nums.length <= 10^5", "0 <= k <= 10^5"],
          complexity: "O(n) time, O(n) space",
          starter: `function containsNearbyDuplicate(nums, k) {
  // your code here
}`,
          solution: `function containsNearbyDuplicate(nums, k) {
  const lastIndex = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (lastIndex.has(nums[i]) && i - lastIndex.get(nums[i]) <= k) return true;
    lastIndex.set(nums[i], i);
  }
  return false;
}`,
          tests: [
            { name: "example: [1,2,3,1], k = 3 → true", code: "return containsNearbyDuplicate([1, 2, 3, 1], 3) === true;" },
            { name: "example: [1,0,1,1], k = 1 → true", code: "return containsNearbyDuplicate([1, 0, 1, 1], 1) === true;" },
            { name: "too far apart: [1,2,3,1,2,3], k = 2 → false", code: "return containsNearbyDuplicate([1, 2, 3, 1, 2, 3], 2) === false;" },
            { name: "k = 0 can never match: [5,5], 0 → false", code: "return containsNearbyDuplicate([5, 5], 0) === false;" },
            {
              name: "50,000 distinct numbers with a huge k, under 300 ms",
              code: `const nums = Array.from({ length: 50000 }, (_, i) => i);
const t0 = performance.now();
const r = containsNearbyDuplicate(nums, 100000);
return r === false && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Keep a Map from value to the **last** index where you saw it. At each index, if the value is in the Map and `i - lastIndex <= k`, you're done; either way, update the last index.",
        },
        {
          type: "p",
          text: "Maps can also enforce a **one-to-one rule**. A single Map catches \"one letter maps to two letters\" but not \"two letters map to the same letter\" — for that you need a second Map going the other way.",
        },
        {
          type: "challenge",
          title: "Isomorphic Strings",
          difficulty: "easy",
          tags: ["hash map", "string"],
          prompt: "Two strings `s` and `t` (same length) are *isomorphic* if you can replace characters in `s` to get `t`, where every occurrence of a character is replaced by the same character, and no two different characters map to the same character (a character may map to itself). Return `true` if they are isomorphic.",
          examples: [
            { input: 's = "egg", t = "add"', output: "true", explanation: "e → a, g → d" },
            { input: 's = "foo", t = "bar"', output: "false", explanation: "o would need to map to both a and r." },
            { input: 's = "badc", t = "baba"', output: "false", explanation: "b → b and d → b: two letters map to the same one." },
          ],
          constraints: ["0 <= s.length <= 5 * 10^4", "t.length === s.length"],
          complexity: "O(n) time, O(1) space (bounded alphabet)",
          starter: `function isIsomorphic(s, t) {
  // your code here
}`,
          solution: `function isIsomorphic(s, t) {
  const sToT = new Map();
  const tToS = new Map();
  for (let i = 0; i < s.length; i++) {
    const a = s[i];
    const b = t[i];
    if (sToT.has(a) && sToT.get(a) !== b) return false;
    if (tToS.has(b) && tToS.get(b) !== a) return false;
    sToT.set(a, b);
    tToS.set(b, a);
  }
  return true;
}`,
          tests: [
            { name: 'example: "egg" / "add" → true', code: 'return isIsomorphic("egg", "add") === true;' },
            { name: 'example: "foo" / "bar" → false', code: 'return isIsomorphic("foo", "bar") === false;' },
            { name: 'two letters can\'t share a target: "badc" / "baba" → false', code: 'return isIsomorphic("badc", "baba") === false;' },
            { name: '"paper" / "title" → true', code: 'return isIsomorphic("paper", "title") === true;' },
            { name: "empty strings → true", code: 'return isIsomorphic("", "") === true;' },
          ],
          hint: "Keep two Maps: `s` char → `t` char and `t` char → `s` char. At each position, if either Map already holds a *different* partner, return false.",
        },
        { type: "h", text: "Choosing a good key" },
        {
          type: "p",
          text: "Grouping problems are really about inventing the right **key**: two items belong together exactly when they produce the same key. For anagrams, \"eat\", \"tea\" and \"ate\" all sort to `\"aet\"`. Sorting each word costs O(L log L); a 26-letter count signature like `\"1#0#0#0#1#…\"` costs O(L) — both are fine here.",
        },
        {
          type: "challenge",
          title: "Group Anagrams",
          difficulty: "medium",
          tags: ["hash map", "string", "grouping"],
          prompt: "Given an array of lowercase strings `strs`, group the anagrams together. Return an array of groups; the groups and the words inside each group may be in any order.",
          examples: [
            { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
            { input: 'strs = [""]', output: '[[""]]' },
            { input: 'strs = ["a"]', output: '[["a"]]' },
          ],
          constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "only a–z"],
          complexity: "O(n · L log L) time with sorted keys (O(n · L) with count keys), O(n · L) space",
          starter: `function groupAnagrams(strs) {
  // your code here
}`,
          solution: `function groupAnagrams(strs) {
  const groups = new Map();
  for (const word of strs) {
    const key = [...word].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}`,
          tests: [
            {
              name: 'example: ["eat","tea","tan","ate","nat","bat"]',
              code: `const norm = (groups) => groups.map((g) => [...g].sort());
return sameMembers(norm(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])), norm([["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]));`,
            },
            {
              name: 'single empty string: [""] → [[""]]',
              code: `const norm = (groups) => groups.map((g) => [...g].sort());
return sameMembers(norm(groupAnagrams([""])), [[""]]);`,
            },
            {
              name: "repeated words stay in one group: [\"ab\",\"ba\",\"ab\"]",
              code: `const norm = (groups) => groups.map((g) => [...g].sort());
return sameMembers(norm(groupAnagrams(["ab", "ba", "ab"])), [["ab", "ab", "ba"]]);`,
            },
            {
              name: "no anagrams at all: every word alone",
              code: `const norm = (groups) => groups.map((g) => [...g].sort());
return sameMembers(norm(groupAnagrams(["abc", "abd", "xyz"])), [["abc"], ["abd"], ["xyz"]]);`,
            },
          ],
          hint: "Use a Map from a canonical key to an array of words. The key can be the word's letters sorted: `[...word].sort().join(\"\")`. Return `[...map.values()]`.",
        },
        { type: "h", text: "Bucket sort: sorting by frequency in O(n)" },
        {
          type: "p",
          text: "\"Top k most frequent\" sounds like it needs a sort of the counts (O(n log n)). But a count can only be between 1 and n, so you can make an array of n + 1 **buckets** where `buckets[f]` holds every value that appears exactly `f` times, then walk the buckets from high to low. For `[1,1,1,2,2,3]`:",
        },
        {
          type: "table",
          rows: [
            ["frequency f", "0", "1", "2", "3", "4", "5", "6"],
            ["buckets[f]", "[]", "[3]", "[2]", "[1]", "[]", "[]", "[]"],
          ],
        },
        {
          type: "p",
          text: "Walking from f = 6 down: bucket 3 gives `1`, bucket 2 gives `2` — for k = 2 the answer is `[1, 2]`.",
        },
        {
          type: "challenge",
          title: "Top K Frequent Elements",
          difficulty: "medium",
          tags: ["hash map", "bucket sort"],
          prompt: "Given an integer array `nums` and an integer `k`, return the `k` most frequent values (for example, the k best-selling product IDs). The answer is guaranteed to be unique, and may be returned in any order. Aim for better than O(n log n).",
          examples: [
            { input: "nums = [1,1,1,2,2,3], k = 2", output: "[1,2]" },
            { input: "nums = [1], k = 1", output: "[1]" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "1 <= k <= number of distinct values", "the answer is unique"],
          complexity: "O(n) time, O(n) space",
          starter: `function topKFrequent(nums, k) {
  // your code here
}`,
          solution: `function topKFrequent(nums, k) {
  const counts = new Map();
  for (const n of nums) counts.set(n, (counts.get(n) ?? 0) + 1);

  // buckets[f] = values that appear exactly f times
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, freq] of counts) buckets[freq].push(value);

  const result = [];
  for (let f = buckets.length - 1; f > 0 && result.length < k; f--) {
    for (const value of buckets[f]) {
      result.push(value);
      if (result.length === k) break;
    }
  }
  return result;
}`,
          tests: [
            { name: "example: [1,1,1,2,2,3], k = 2 → [1,2]", code: "return sameMembers(topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);" },
            { name: "single element: [1], k = 1 → [1]", code: "return sameMembers(topKFrequent([1], 1), [1]);" },
            { name: "negatives: [-1,-1,4,4,4,7,-1,-1], k = 1 → [-1]", code: "return sameMembers(topKFrequent([-1, -1, 4, 4, 4, 7, -1, -1], 1), [-1]);" },
            { name: "k = number of distinct values returns all of them", code: "return sameMembers(topKFrequent([5, 3, 5, 9, 3, 5], 3), [5, 3, 9]);" },
          ],
          hint: "Count with a Map. Then create `nums.length + 1` empty buckets, put each value in the bucket of its count, and collect from the highest bucket down until you have k values.",
        },
        {
          type: "p",
          text: "Last one, and a lesson in *amortised* analysis. A Set lets you ask \"is `x + 1` here?\" in O(1). The trap is starting a count from **every** number, which re-walks the same run over and over. Only start counting at the **beginning** of a run — a number whose `x - 1` is absent — and each number gets visited a constant number of times overall.",
        },
        {
          type: "challenge",
          title: "Longest Consecutive Sequence",
          difficulty: "medium",
          tags: ["hash set", "array"],
          prompt: "Given an unsorted array of integers `nums`, return the length of the longest run of consecutive integers (like 4, 5, 6, 7) that can be formed from its values. The values don't need to be adjacent in the array. Your algorithm must be O(n).",
          examples: [
            { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The run is 1, 2, 3, 4." },
            { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
            { input: "nums = []", output: "0" },
          ],
          constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
          complexity: "O(n) time, O(n) space",
          starter: `function longestConsecutive(nums) {
  // your code here
}`,
          solution: `function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;      // not the start of a run
    let length = 1;
    while (set.has(x + length)) length++;
    if (length > best) best = length;
  }
  return best;
}`,
          tests: [
            { name: "example: [100,4,200,1,3,2] → 4", code: "return longestConsecutive([100, 4, 200, 1, 3, 2]) === 4;" },
            { name: "example: [0,3,7,2,5,8,4,6,0,1] → 9", code: "return longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]) === 9;" },
            { name: "empty array → 0", code: "return longestConsecutive([]) === 0;" },
            { name: "duplicates and negatives: [1,-1,0,1,2,-3] → 4", code: "return longestConsecutive([1, -1, 0, 1, 2, -3]) === 4;" },
            {
              name: "10,000 numbers in one long run, under 300 ms",
              code: `const nums = Array.from({ length: 10000 }, (_, i) => 10000 - i);
const t0 = performance.now();
const r = longestConsecutive(nums);
return r === 10000 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Put everything in a Set. For each value `x` where `x - 1` is NOT in the Set, count upward `x + 1, x + 2, …` while they exist. Track the longest count.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Same pattern, real code",
          text: "Joining Supabase rows in JavaScript (say, attaching each `invoice` to its `client`) is a Two Sum-style lookup: build `new Map(clients.map((c) => [c.id, c]))` once, then `clientsById.get(invoice.client_id)` for each invoice — O(n + m) instead of an O(n·m) `find` inside `map`. React's `key` prop exists for the same reason: it lets React match old and new list items in a lookup table instead of comparing every pair.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "\"Given an **unsorted** array, find two values whose sum is `target`.\" Which approach is the standard O(n) one?",
              options: ["Nested loops", "Binary search", "One pass with a Map of value → index, looking up `target - x`", "Sort, then return the first two elements"],
              answer: 2,
              why: "The complement `target - x` is known at each step, so a Map lookup replaces the inner loop.",
            },
            {
              q: "Longest Consecutive Sequence has a `while` loop inside a `for` loop. Why is it still O(n)?",
              options: [
                "The `while` loop only runs from the start of each run, so every number is counted inside it at most once overall",
                "Set operations are O(log n)",
                "It isn't — it's O(n²)",
                "Because the input is sorted first",
              ],
              answer: 0,
              why: "Skipping numbers whose `x - 1` exists means each run is walked exactly once. Across the whole loop the `while` does at most n steps in total.",
            },
            {
              q: "Why can Top K Frequent use buckets indexed by frequency instead of sorting?",
              options: [
                "Because JavaScript sorts are slow",
                "Because k is always small",
                "Because Maps are ordered",
                "Because a frequency is an integer between 1 and n, so it can be used directly as an array index",
              ],
              answer: 3,
              why: "Bounded integer keys let you place items directly into their slot (a counting/bucket sort), which is O(n) instead of O(n log n).",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 4. Two pointers
    // ─────────────────────────────────────────────────────────────
    {
      slug: "two-pointers",
      title: "Two pointers",
      summary: "Two indices moving through the data — from both ends or in the same direction — replace nested loops with a single pass.",
      minutes: 50,
      blocks: [
        {
          type: "p",
          text: "A nested loop considers every pair `(i, j)`: O(n²). **Two pointers** considers pairs too, but cleverly: after looking at one pair, it can rule out a whole row or column of other pairs and move one pointer. Each pointer only moves forward (or only backward), so together they take at most n steps: O(n), usually with O(1) extra space. The trick only works when the data has **structure** that tells you which pointer to move — most often, the array is **sorted**.",
        },
        { type: "h", text: "The two shapes" },
        {
          type: "table",
          rows: [
            ["Shape", "How the pointers move", "Typical problems", "Signals"],
            ["Opposite ends", "`left = 0`, `right = n - 1`, move inward until they meet", "pair sum in a sorted array, palindromes, container with most water, 3Sum", "\"sorted\", \"pair / triplet\", \"palindrome\", \"from both sides\""],
            ["Same direction", "`slow` (write) and `fast` (read) both go left → right, fast never behind", "remove duplicates, move zeroes, compact in place, merge sorted arrays", "\"in place\", \"O(1) extra space\", \"return the new length\""],
          ],
        },
        { type: "h", text: "Opposite ends: why it's safe to discard" },
        {
          type: "p",
          text: "Take a **sorted** array and a target sum. Look at `nums[left] + nums[right]`. If it's too **big**, then `nums[right]` plus *anything* at or after `left` is also too big (everything there is ≥ `nums[left]`), so `right` can never be part of the answer: `right--`. If it's too **small**, symmetrically `left++`. One comparison eliminates a whole pointer position. Trace on `[2, 7, 11, 15]`, target `9`:",
        },
        {
          type: "table",
          rows: [
            ["left", "right", "nums[left] + nums[right]", "decision"],
            ["0 (2)", "3 (15)", "17", "too big → right--"],
            ["0 (2)", "2 (11)", "13", "too big → right--"],
            ["0 (2)", "1 (7)", "9", "found it"],
          ],
        },
        {
          type: "run",
          title: "Both shapes, traced",
          code: `// Opposite ends: pair with a given sum in a SORTED array of invoice amounts
function pairWithSum(sorted, target) {
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    console.log("left=" + left, "right=" + right, "sum=" + sum);
    if (sum === target) return [sorted[left], sorted[right]];
    if (sum < target) left++;
    else right--;
  }
  return null;
}
console.log("→", pairWithSum([120, 250, 300, 475, 600, 980], 775));

// Same direction: compact a sorted list of tag ids, removing repeats, in place
function compact(ids) {
  let write = 1; // ids[0] is always kept
  for (let read = 1; read < ids.length; read++) {
    if (ids[read] !== ids[write - 1]) {
      ids[write] = ids[read];
      write++;
    }
  }
  return write; // new length
}
const ids = [3, 3, 5, 8, 8, 8, 13];
const k = compact(ids);
console.log("unique count:", k, "→", ids.slice(0, k));`,
        },
        {
          type: "challenge",
          title: "Valid Palindrome",
          difficulty: "easy",
          tags: ["two pointers", "string"],
          prompt: "A phrase is a palindrome if, after lowercasing it and removing every character that isn't a letter or a digit, it reads the same forwards and backwards. Given a string `s`, return `true` if it is a palindrome. Try to do it without building a cleaned-up copy (O(1) extra space).",
          examples: [
            { input: 's = "A man, a plan, a canal: Panama"', output: "true", explanation: '"amanaplanacanalpanama" reads the same both ways.' },
            { input: 's = "race a car"', output: "false" },
            { input: 's = " "', output: "true", explanation: "Nothing left after cleaning: an empty string is a palindrome." },
          ],
          constraints: ["1 <= s.length <= 2 * 10^5", "s contains printable ASCII characters"],
          complexity: "O(n) time, O(1) space",
          starter: `function isPalindrome(s) {
  // your code here
}`,
          solution: `function isPalindrome(s) {
  const isAlnum = (ch) => /[a-z0-9]/i.test(ch);
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (!isAlnum(s[left])) { left++; continue; }
    if (!isAlnum(s[right])) { right--; continue; }
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
          tests: [
            { name: 'example: "A man, a plan, a canal: Panama" → true', code: 'return isPalindrome("A man, a plan, a canal: Panama") === true;' },
            { name: 'example: "race a car" → false', code: 'return isPalindrome("race a car") === false;' },
            { name: 'only punctuation/spaces: " .,! " → true', code: 'return isPalindrome(" .,! ") === true;' },
            { name: 'digits count: "0P" → false', code: 'return isPalindrome("0P") === false;' },
            { name: 'mixed case and digits: "No 1 x 1 on" → true', code: 'return isPalindrome("No 1 x 1 on") === true;' },
          ],
          hint: "Put pointers at both ends. Skip characters that aren't letters/digits (`/[a-z0-9]/i.test(ch)`), compare lowercased characters, move inward.",
        },
        {
          type: "p",
          text: "Now the same-direction shape. Because the array is sorted, duplicates sit next to each other: a value is new exactly when it differs from the **last value you kept**.",
        },
        {
          type: "challenge",
          title: "Remove Duplicates from Sorted Array",
          difficulty: "easy",
          tags: ["two pointers", "in place"],
          prompt: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in place** so each unique value appears once, keeping their order. Return `k`, the number of unique values; the first `k` slots of `nums` must hold them. What's left after index `k - 1` doesn't matter.",
          examples: [
            { input: "nums = [1,1,2]", output: "2, nums starts with [1,2]" },
            { input: "nums = [0,0,1,1,1,2,2,3,3,4]", output: "5, nums starts with [0,1,2,3,4]" },
          ],
          constraints: ["1 <= nums.length <= 3 * 10^4", "nums is sorted in non-decreasing order"],
          complexity: "O(n) time, O(1) space",
          starter: `function removeDuplicates(nums) {
  // your code here — return k
}`,
          solution: `function removeDuplicates(nums) {
  let write = 1;
  for (let read = 1; read < nums.length; read++) {
    if (nums[read] !== nums[write - 1]) {
      nums[write] = nums[read];
      write++;
    }
  }
  return write;
}`,
          tests: [
            { name: "example: [1,1,2] → 2, [1,2]", code: `const a = [1, 1, 2]; const k = removeDuplicates(a); return k === 2 && deepEqual(a.slice(0, k), [1, 2]);` },
            {
              name: "example: [0,0,1,1,1,2,2,3,3,4] → 5, [0,1,2,3,4]",
              code: `const a = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]; const k = removeDuplicates(a); return k === 5 && deepEqual(a.slice(0, k), [0, 1, 2, 3, 4]);`,
            },
            { name: "single element: [7] → 1", code: `const a = [7]; const k = removeDuplicates(a); return k === 1 && a[0] === 7;` },
            { name: "negatives: [-3,-3,-1,0,0] → 3, [-3,-1,0]", code: `const a = [-3, -3, -1, 0, 0]; const k = removeDuplicates(a); return k === 3 && deepEqual(a.slice(0, k), [-3, -1, 0]);` },
            { name: "all equal: [2,2,2,2] → 1", code: `const a = [2, 2, 2, 2]; const k = removeDuplicates(a); return k === 1 && a[0] === 2;` },
          ],
          hint: "`write` is where the next unique value goes (start at 1). Scan with `read`; when `nums[read]` differs from `nums[write - 1]`, copy it to `nums[write]` and advance `write`.",
        },
        {
          type: "challenge",
          title: "Two Sum II — Sorted Input",
          difficulty: "medium",
          tags: ["two pointers", "sorted array"],
          prompt: "Given a **1-indexed** array `numbers` sorted in non-decreasing order, find the two numbers that add up to `target` and return their positions `[index1, index2]` (1-based, `index1 < index2`). Exactly one solution exists. Use only O(1) extra space — no Map this time.",
          examples: [
            { input: "numbers = [2,7,11,15], target = 9", output: "[1,2]" },
            { input: "numbers = [2,3,4], target = 6", output: "[1,3]" },
            { input: "numbers = [-1,0], target = -1", output: "[1,2]" },
          ],
          constraints: ["2 <= numbers.length <= 3 * 10^4", "numbers is sorted", "exactly one solution"],
          complexity: "O(n) time, O(1) space",
          starter: `function twoSumSorted(numbers, target) {
  // your code here
}`,
          solution: `function twoSumSorted(numbers, target) {
  let left = 0;
  let right = numbers.length - 1;
  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}`,
          tests: [
            { name: "example: [2,7,11,15], 9 → [1,2]", code: "return deepEqual(twoSumSorted([2, 7, 11, 15], 9), [1, 2]);" },
            { name: "example: [2,3,4], 6 → [1,3]", code: "return deepEqual(twoSumSorted([2, 3, 4], 6), [1, 3]);" },
            { name: "negatives: [-1,0], -1 → [1,2]", code: "return deepEqual(twoSumSorted([-1, 0], -1), [1, 2]);" },
            { name: "duplicates: [1,3,3,8], 6 → [2,3]", code: "return deepEqual(twoSumSorted([1, 3, 3, 8], 6), [2, 3]);" },
            {
              name: "50,000 numbers in under 300 ms",
              code: `const n = 50000;
const numbers = Array.from({ length: n }, (_, i) => i);
const t0 = performance.now();
const r = twoSumSorted(numbers, 2 * n - 3);
return deepEqual(r, [n - 1, n]) && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Pointers at both ends. Sum too small → only moving `left` right can increase it. Too big → move `right` left. Remember to add 1 to both indices.",
        },
        {
          type: "p",
          text: "The \"discard what can't win\" argument also works when you are maximising. In Container With Most Water, the area is `width × min(height[left], height[right])`. Moving the **taller** line inward can only shrink the width without raising the minimum — so it can never help. Always move the **shorter** one.",
        },
        {
          type: "challenge",
          title: "Container With Most Water",
          difficulty: "medium",
          tags: ["two pointers", "greedy"],
          prompt: "You get an array `height` where `height[i]` is the height of a vertical line at position `i`. Choose two lines that, together with the x-axis, form a container; it holds `(j - i) * Math.min(height[i], height[j])` units of water. Return the maximum amount any container can hold.",
          examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 (8) and 8 (7): width 7 × height 7." },
            { input: "height = [1,1]", output: "1" },
          ],
          constraints: ["2 <= height.length <= 10^5", "0 <= height[i] <= 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function maxArea(height) {
  // your code here
}`,
          solution: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    if (area > best) best = area;
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}`,
          tests: [
            { name: "example: [1,8,6,2,5,4,8,3,7] → 49", code: "return maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]) === 49;" },
            { name: "two lines: [1,1] → 1", code: "return maxArea([1, 1]) === 1;" },
            { name: "outer walls win: [4,3,2,1,4] → 16", code: "return maxArea([4, 3, 2, 1, 4]) === 16;" },
            { name: "zero heights: [0,2,0] → 0", code: "return maxArea([0, 2, 0]) === 0;" },
            {
              name: "50,000 lines in under 300 ms",
              code: `const n = 50000;
const h = new Array(n).fill(1);
h[0] = 10000; h[n - 1] = 10000;
const t0 = performance.now();
const r = maxArea(h);
return r === 10000 * (n - 1) && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Start with the widest container (both ends). Record its area, then move the pointer at the shorter line inward — the shorter line is the one limiting the height.",
        },
        { type: "h", text: "Sort first, then two pointers" },
        {
          type: "p",
          text: "When the input isn't sorted but the order of the answer doesn't matter, **sorting** (O(n log n)) can unlock two pointers. 3Sum is the classic: fix the first number `nums[i]`, then the problem becomes \"Two Sum II on the rest with target `-nums[i]`\". Sorting also makes skipping duplicates easy: equal values are neighbours.",
        },
        {
          type: "compare",
          left: {
            label: "Brute force: every triple + a Set to dedupe — O(n³)",
            lang: "js",
            code: `function threeSum(nums) {
  const seen = new Set();
  const out = [];
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      for (let k = j + 1; k < nums.length; k++)
        if (nums[i] + nums[j] + nums[k] === 0) {
          const t = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = t.join(",");
          if (!seen.has(key)) { seen.add(key); out.push(t); }
        }
  return out;
}`,
          },
          right: {
            label: "Sort + two pointers — O(n²) time, O(1) extra (besides sorting)",
            lang: "js",
            code: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // same first value
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < 0) left++;
      else if (sum > 0) right--;
      else {
        out.push([nums[i], nums[left], nums[right]]);
        left++; right--;
        while (left < right && nums[left] === nums[left - 1]) left++;
      }
    }
  }
  return out;
}`,
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: "sort() without a comparator sorts as strings",
          text: "`[10, -1, 2].sort()` gives `[-1, 10, 2]` because the default compares text. For numbers, always pass `(a, b) => a - b`. More on comparators in lesson 7.",
        },
        {
          type: "challenge",
          title: "3Sum",
          difficulty: "medium",
          tags: ["two pointers", "sorting"],
          prompt: "Given an integer array `nums`, return every **unique** triplet `[a, b, c]` of values taken from three different positions such that `a + b + c === 0`. The result must not contain the same triplet twice. Triplets and the order inside them can be in any order.",
          examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
            { input: "nums = [0,1,1]", output: "[]" },
            { input: "nums = [0,0,0,0]", output: "[[0,0,0]]", explanation: "Only one distinct triplet even though there are four zeros." },
          ],
          constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
          complexity: "O(n²) time, O(1) extra space besides sorting",
          starter: `function threeSum(nums) {
  // your code here
}`,
          solution: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;                          // smallest is positive: no more zeros possible
    if (i > 0 && nums[i] === nums[i - 1]) continue;  // skip duplicate first values
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < 0) left++;
      else if (sum > 0) right--;
      else {
        out.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++; // skip duplicate second values
      }
    }
  }
  return out;
}`,
          tests: [
            {
              name: "example: [-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]",
              code: `const norm = (ts) => ts.map((t) => [...t].sort((a, b) => a - b));
return sameMembers(norm(threeSum([-1, 0, 1, 2, -1, -4])), [[-1, -1, 2], [-1, 0, 1]]);`,
            },
            { name: "no triplet: [0,1,1] → []", code: "return sameMembers(threeSum([0, 1, 1]), []);" },
            { name: "no duplicate triplets: [0,0,0,0] → [[0,0,0]]", code: "return sameMembers(threeSum([0, 0, 0, 0]), [[0, 0, 0]]);" },
            {
              name: "[-2,0,1,1,2] → [[-2,0,2],[-2,1,1]]",
              code: `const norm = (ts) => ts.map((t) => [...t].sort((a, b) => a - b));
return sameMembers(norm(threeSum([-2, 0, 1, 1, 2])), [[-2, 0, 2], [-2, 1, 1]]);`,
            },
            {
              name: "1,500 odd numbers (three odds never sum to 0) in under 300 ms",
              code: `const nums = [];
for (let v = -1499; v <= 1499; v += 2) nums.push(v);
const t0 = performance.now();
const r = threeSum(nums);
return Array.isArray(r) && r.length === 0 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Sort numerically. For each `i` (skipping a value equal to the previous one), run two pointers on `i + 1 … end` looking for `-nums[i]`. After a match, move both pointers and skip equal neighbours.",
        },
        { type: "h", text: "Hard: trapping rain water" },
        {
          type: "p",
          text: "Picture the bars of a chart filling with rain. The water above bar `i` is `min(tallest bar to its left, tallest bar to its right) - height[i]` (never negative). Precomputing both maxima arrays gives O(n) time and O(n) space. Two pointers get it down to O(1) space: keep `leftMax` and `rightMax`, and always process the side whose wall is **lower** — that side's water level is already decided, because the other side is guaranteed to have something at least as tall. Trace on `[4, 2, 0, 3, 2, 5]`:",
        },
        {
          type: "table",
          rows: [
            ["left", "right", "move", "leftMax", "water added", "total"],
            ["0 (4)", "5 (5)", "4 < 5 → process left", "4", "4 − 4 = 0", "0"],
            ["1 (2)", "5 (5)", "2 < 5 → process left", "4", "4 − 2 = 2", "2"],
            ["2 (0)", "5 (5)", "0 < 5 → process left", "4", "4 − 0 = 4", "6"],
            ["3 (3)", "5 (5)", "3 < 5 → process left", "4", "4 − 3 = 1", "7"],
            ["4 (2)", "5 (5)", "2 < 5 → process left", "4", "4 − 2 = 2", "9"],
          ],
        },
        {
          type: "challenge",
          title: "Trapping Rain Water",
          difficulty: "hard",
          tags: ["two pointers", "array"],
          prompt: "Given `n` non-negative integers `height` describing a bar chart where each bar has width 1, compute how many units of water are trapped between the bars after it rains.",
          examples: [
            { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
            { input: "height = [4,2,0,3,2,5]", output: "9" },
          ],
          constraints: ["0 <= height.length <= 2 * 10^4", "0 <= height[i] <= 10^5"],
          complexity: "O(n) time, O(1) space",
          starter: `function trap(height) {
  // your code here
}`,
          solution: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}`,
          tests: [
            { name: "example: [0,1,0,2,1,0,1,3,2,1,2,1] → 6", code: "return trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6;" },
            { name: "example: [4,2,0,3,2,5] → 9", code: "return trap([4, 2, 0, 3, 2, 5]) === 9;" },
            { name: "empty or one bar → 0", code: "return trap([]) === 0 && trap([3]) === 0;" },
            { name: "staircase holds nothing: [1,2,3,4] → 0", code: "return trap([1, 2, 3, 4]) === 0;" },
            {
              name: "30,000 bars in under 300 ms",
              code: `const n = 30000;
const h = new Array(n).fill(0);
h[0] = 1000; h[n - 1] = 1000;
const t0 = performance.now();
const r = trap(h);
return r === 1000 * (n - 2) && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Water over a bar = min(max to the left, max to the right) − its height. With two pointers, keep `leftMax`/`rightMax` and always advance the side with the smaller current bar, adding `max − height` for that bar.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where you'll meet it at work",
          text: "Merging two already-sorted lists — say, Supabase bookings sorted by `start_at` and Google Calendar events sorted by start time — is the same-direction pattern: one pointer per list, always take the smaller head. O(n + m), no re-sort needed. Databases do exactly this in a *merge join*.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which statement most strongly suggests opposite-end two pointers?",
              options: [
                "\"Given a sorted array, find a pair with sum equal to target\"",
                "\"Count how many times each word appears\"",
                "\"Find the k most frequent elements\"",
                "\"Group the strings that are anagrams\"",
              ],
              answer: 0,
              why: "Sorted + pair is the textbook signal: the order lets you decide which pointer to move. The other three are hash map problems.",
            },
            {
              q: "In Container With Most Water, why move the pointer at the **shorter** line?",
              options: [
                "Because it's closer to the middle",
                "Because moving the taller line can only shrink the width while the height stays limited by the shorter line",
                "To keep the array sorted",
                "Because the shorter line is always at the left",
              ],
              answer: 1,
              why: "The area is width × the shorter height. Moving the taller line inward reduces width and can't raise that minimum, so it can never produce a better container.",
            },
            {
              q: "What is the time complexity of 3Sum with sort + two pointers?",
              options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
              answer: 2,
              why: "Sorting is O(n log n), then for each of the n first values, a linear two-pointer scan: O(n²) dominates.",
            },
            {
              q: "Trapping Rain Water with two pointers uses how much extra space?",
              options: ["O(n) for prefix maxima", "O(n²)", "O(log n)", "O(1)"],
              answer: 3,
              why: "Only `left`, `right`, `leftMax`, `rightMax` and `water`. The prefix/suffix-max version is also O(n) time but uses O(n) space.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 5. Sliding window
    // ─────────────────────────────────────────────────────────────
    {
      slug: "sliding-window",
      title: "Sliding window",
      summary: "For contiguous subarrays and substrings: grow the window on the right, shrink it on the left, and never recompute from scratch.",
      minutes: 50,
      blocks: [
        {
          type: "p",
          text: "Many problems ask about a **contiguous** stretch of an array or string: the best 7-day revenue, the longest substring without repeats, the shortest span containing every keyword. Brute force checks every start and every end — O(n²) windows, often with O(n) work each. A **sliding window** keeps one window `[left, right]` and updates it incrementally: when an element enters on the right, add it; when one leaves on the left, remove it. Both edges only move forward, so the whole scan is O(n).",
        },
        { type: "h", text: "Signals" },
        {
          type: "list",
          items: [
            "The answer is a **contiguous** subarray or substring (not a subsequence — order *and* adjacency matter).",
            "Words like \"longest\", \"shortest\", \"maximum sum\", \"at most k\", \"containing all of\", \"of size k\".",
            "A brute force that recomputes a sum, a count or a set for every window.",
          ],
        },
        { type: "h", text: "Fixed-size window" },
        {
          type: "p",
          text: "When the window size `k` is given, slide it one step at a time: add the element entering on the right, subtract the one leaving on the left. Best 3-day revenue for `[2, 1, 5, 1, 3, 2]`:",
        },
        {
          type: "table",
          rows: [
            ["window", "enters", "leaves", "sum", "best"],
            ["[2, 1, 5]", "—", "—", "8", "8"],
            ["[1, 5, 1]", "1", "2", "8 + 1 − 2 = 7", "8"],
            ["[5, 1, 3]", "3", "1", "7 + 3 − 1 = 9", "9"],
            ["[1, 3, 2]", "2", "5", "9 + 2 − 5 = 6", "9"],
          ],
        },
        {
          type: "compare",
          left: {
            label: "Brute force: re-sum every window — O(n·k)",
            lang: "js",
            code: `function maxSum(nums, k) {
  let best = -Infinity;
  for (let start = 0; start + k <= nums.length; start++) {
    let sum = 0;
    for (let i = start; i < start + k; i++) sum += nums[i];
    best = Math.max(best, sum);
  }
  return best;
}`,
          },
          right: {
            label: "Sliding window: add one, remove one — O(n)",
            lang: "js",
            code: `function maxSum(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];
    best = Math.max(best, sum);
  }
  return best;
}`,
          },
        },
        { type: "h", text: "Variable-size window" },
        {
          type: "p",
          text: "When the size isn't given, the window **grows** on the right every step and **shrinks** on the left only while it breaks a rule (has a duplicate, has too many replacements, already contains everything we need…). The template is always the same:",
        },
        {
          type: "code",
          lang: "js",
          title: "variable window template",
          code: `let left = 0;
for (let right = 0; right < n; right++) {
  add(items[right]);                 // 1. grow: include the new element
  while (windowIsInvalid()) {        // 2. shrink until the rule holds again
    remove(items[left]);
    left++;
  }
  best = Math.max(best, right - left + 1); // 3. record (for "longest" problems)
}`,
        },
        {
          type: "run",
          title: "Longest stretch without a repeated character, traced",
          code: `function longestUnique(s) {
  const inWindow = new Set();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    while (inWindow.has(s[right])) {   // the new char would be a duplicate: shrink
      inWindow.delete(s[left]);
      left++;
    }
    inWindow.add(s[right]);
    best = Math.max(best, right - left + 1);
    console.log("right=" + right, "window='" + s.slice(left, right + 1) + "'", "best=" + best);
  }
  return best;
}

console.log("→", longestUnique("abcabcbb"));`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Why it's O(n) despite the inner while",
          text: "`left` only ever moves forward and can't pass `right`, so across the whole run the `while` body executes at most n times in total. Each element is added once and removed at most once: about 2n steps.",
        },
        { type: "h", text: "Practice" },
        {
          type: "p",
          text: "Warm-up: here the \"window\" is the span from the cheapest day so far to today. Whenever a new lowest price appears, the left edge jumps there.",
        },
        {
          type: "challenge",
          title: "Best Time to Buy and Sell Stock",
          difficulty: "easy",
          tags: ["sliding window", "array"],
          prompt: "`prices[i]` is a stock's price on day `i`. Choose one day to buy and a **later** day to sell to maximise profit. Return the maximum profit, or `0` if no profitable trade exists.",
          examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy at 1 (day 1), sell at 6 (day 4)." },
            { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only fall." },
          ],
          constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function maxProfit(prices) {
  // your code here
}`,
          solution: `function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;          // move the window's left edge
    else if (price - minPrice > best) best = price - minPrice;
  }
  return best;
}`,
          tests: [
            { name: "example: [7,1,5,3,6,4] → 5", code: "return maxProfit([7, 1, 5, 3, 6, 4]) === 5;" },
            { name: "falling prices: [7,6,4,3,1] → 0", code: "return maxProfit([7, 6, 4, 3, 1]) === 0;" },
            { name: "one day: [5] → 0", code: "return maxProfit([5]) === 0;" },
            { name: "can't sell before buying: [2,4,1] → 2", code: "return maxProfit([2, 4, 1]) === 2;" },
            {
              name: "50,000 falling prices in under 300 ms",
              code: `const prices = Array.from({ length: 50000 }, (_, i) => 50000 - i);
const t0 = performance.now();
return maxProfit(prices) === 0 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Walk once, tracking the lowest price seen so far. At each day, the best sale today is `price - minPrice`.",
        },
        {
          type: "challenge",
          title: "Maximum Sum Subarray of Size K",
          difficulty: "easy",
          tags: ["sliding window", "fixed window"],
          prompt: "Given an array of daily revenues `nums` (may be negative after refunds) and an integer `k`, return the largest sum of any `k` consecutive elements.",
          examples: [
            { input: "nums = [2,1,5,1,3,2], k = 3", output: "9", explanation: "[5,1,3]" },
            { input: "nums = [2,3,4,1,5], k = 2", output: "7", explanation: "[3,4]" },
            { input: "nums = [-1,-2,-3,-4], k = 2", output: "-3" },
          ],
          constraints: ["1 <= k <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function maxSumSubarray(nums, k) {
  // your code here
}`,
          solution: `function maxSumSubarray(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];
    if (sum > best) best = sum;
  }
  return best;
}`,
          tests: [
            { name: "example: [2,1,5,1,3,2], k = 3 → 9", code: "return maxSumSubarray([2, 1, 5, 1, 3, 2], 3) === 9;" },
            { name: "example: [2,3,4,1,5], k = 2 → 7", code: "return maxSumSubarray([2, 3, 4, 1, 5], 2) === 7;" },
            { name: "all negative: [-1,-2,-3,-4], k = 2 → -3", code: "return maxSumSubarray([-1, -2, -3, -4], 2) === -3;" },
            { name: "k equals the length: [1,2,3], k = 3 → 6", code: "return maxSumSubarray([1, 2, 3], 3) === 6;" },
            {
              name: "60,000 days with k = 30,000 in under 300 ms",
              code: `const n = 60000, k = 30000;
const nums = new Array(n).fill(1);
nums[n - 1] = 1000;
const t0 = performance.now();
const r = maxSumSubarray(nums, k);
return r === (k - 1) + 1000 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Sum the first k elements. Then for each new right edge, add `nums[right]` and subtract `nums[right - k]`. Start `best` from the first window, not 0 (negatives!).",
        },
        {
          type: "p",
          text: "Now a variable window. The run block above shrinks one step at a time with a Set; you can also store each character's **last index** in a Map and jump `left` straight past the previous occurrence. Careful: only jump forward — a stale index from before `left` must be ignored (try `\"abba\"`).",
        },
        {
          type: "challenge",
          title: "Longest Substring Without Repeating Characters",
          difficulty: "medium",
          tags: ["sliding window", "hash map", "string"],
          prompt: "Given a string `s`, return the length of the longest substring (contiguous!) that contains no repeated character.",
          examples: [
            { input: 's = "abcabcbb"', output: "3", explanation: '"abc"' },
            { input: 's = "bbbbb"', output: "1" },
            { input: 's = "pwwkew"', output: "3", explanation: '"wke" — "pwke" is a subsequence, not a substring.' },
          ],
          constraints: ["0 <= s.length <= 5 * 10^4", "letters, digits, symbols and spaces"],
          complexity: "O(n) time, O(min(n, alphabet)) space",
          starter: `function lengthOfLongestSubstring(s) {
  // your code here
}`,
          solution: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {
      left = lastSeen.get(ch) + 1;   // jump past the previous copy
    }
    lastSeen.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
          tests: [
            { name: 'example: "abcabcbb" → 3', code: 'return lengthOfLongestSubstring("abcabcbb") === 3;' },
            { name: 'example: "bbbbb" → 1', code: 'return lengthOfLongestSubstring("bbbbb") === 1;' },
            { name: 'example: "pwwkew" → 3', code: 'return lengthOfLongestSubstring("pwwkew") === 3;' },
            { name: 'empty string → 0', code: 'return lengthOfLongestSubstring("") === 0;' },
            { name: 'left never moves backwards: "abba" → 2', code: 'return lengthOfLongestSubstring("abba") === 2;' },
            { name: 'spaces count as characters: "a bc a" → 4', code: 'return lengthOfLongestSubstring("a bc a") === 4;' },
          ],
          hint: "Keep `left` and a Set (or a Map of last positions). When `s[right]` is already in the window, move `left` past its previous occurrence. The answer is the max of `right - left + 1`.",
        },
        {
          type: "p",
          text: "Sometimes the rule involves a **count**. A window can be turned into one repeated letter by replacing all the *other* letters — that's `windowLength - countOfMostFrequentLetter` replacements. The window is valid while that number is at most `k`.",
        },
        {
          type: "challenge",
          title: "Longest Repeating Character Replacement",
          difficulty: "medium",
          tags: ["sliding window", "frequency count"],
          prompt: "Given a string `s` of uppercase letters and an integer `k`, you may replace at most `k` characters with any other uppercase letter. Return the length of the longest substring that can be made of one repeated letter.",
          examples: [
            { input: 's = "ABAB", k = 2', output: "4", explanation: 'Replace both A\'s (or both B\'s).' },
            { input: 's = "AABABBA", k = 1', output: "4", explanation: 'Replace the A in "BABB" → "BBBB".' },
          ],
          constraints: ["1 <= s.length <= 10^5", "s contains only A–Z", "0 <= k <= s.length"],
          complexity: "O(n) time, O(1) space (26 letters)",
          starter: `function characterReplacement(s, k) {
  // your code here
}`,
          solution: `function characterReplacement(s, k) {
  const counts = new Map();
  let left = 0;
  let maxFreq = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    counts.set(c, (counts.get(c) ?? 0) + 1);
    maxFreq = Math.max(maxFreq, counts.get(c));
    // letters to replace = window length - most frequent letter
    while (right - left + 1 - maxFreq > k) {
      counts.set(s[left], counts.get(s[left]) - 1);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
          tests: [
            { name: 'example: "ABAB", k = 2 → 4', code: 'return characterReplacement("ABAB", 2) === 4;' },
            { name: 'example: "AABABBA", k = 1 → 4', code: 'return characterReplacement("AABABBA", 1) === 4;' },
            { name: 'single letter: "A", k = 0 → 1', code: 'return characterReplacement("A", 0) === 1;' },
            { name: 'no replacements allowed: "AAABBA", k = 0 → 3', code: 'return characterReplacement("AAABBA", 0) === 3;' },
            { name: 'all different: "ABCDE", k = 1 → 2', code: 'return characterReplacement("ABCDE", 1) === 2;' },
          ],
          hint: "Track letter counts in the window and the highest count seen (`maxFreq`). While `windowLength - maxFreq > k`, shrink from the left. (You never need to decrease `maxFreq`: only a bigger `maxFreq` can produce a longer answer.)",
        },
        {
          type: "p",
          text: "Back to a **fixed** window, this time carrying a frequency table instead of a sum. A permutation of `s1` is any window of `s2` with the same length and the same letter counts.",
        },
        {
          type: "challenge",
          title: "Permutation in String",
          difficulty: "medium",
          tags: ["sliding window", "frequency count"],
          prompt: "Given two lowercase strings `s1` and `s2`, return `true` if some permutation of `s1` appears as a contiguous substring of `s2`.",
          examples: [
            { input: 's1 = "ab", s2 = "eidbaooo"', output: "true", explanation: '"ba" is in s2.' },
            { input: 's1 = "ab", s2 = "eidboaoo"', output: "false" },
          ],
          constraints: ["1 <= s1.length, s2.length <= 10^5", "only a–z"],
          complexity: "O(26 · n) time, O(1) space",
          starter: `function checkInclusion(s1, s2) {
  // your code here
}`,
          solution: `function checkInclusion(s1, s2) {
  const m = s1.length;
  if (m > s2.length) return false;
  const need = new Array(26).fill(0);
  const win = new Array(26).fill(0);
  for (let i = 0; i < m; i++) {
    need[s1.charCodeAt(i) - 97]++;
    win[s2.charCodeAt(i) - 97]++;
  }
  const matches = () => need.every((v, i) => v === win[i]);
  if (matches()) return true;
  for (let right = m; right < s2.length; right++) {
    win[s2.charCodeAt(right) - 97]++;       // enters
    win[s2.charCodeAt(right - m) - 97]--;   // leaves
    if (matches()) return true;
  }
  return false;
}`,
          tests: [
            { name: 'example: "ab" in "eidbaooo" → true', code: 'return checkInclusion("ab", "eidbaooo") === true;' },
            { name: 'example: "ab" in "eidboaoo" → false', code: 'return checkInclusion("ab", "eidboaoo") === false;' },
            { name: 's1 longer than s2 → false', code: 'return checkInclusion("abc", "ab") === false;' },
            { name: 'match at the very end: "adc" in "dcda" → true', code: 'return checkInclusion("adc", "dcda") === true;' },
            {
              name: "1,000-letter pattern in a 100,000-letter text, under 300 ms",
              code: `const s1 = "a".repeat(500) + "b".repeat(500);
const s2 = "c".repeat(99000) + "b".repeat(500) + "a".repeat(500);
const t0 = performance.now();
return checkInclusion(s1, s2) === true && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Count the letters of `s1` (26 slots). Slide a window of exactly `s1.length` over `s2`, updating its counts by +1 for the entering letter and −1 for the leaving one, and compare the two count arrays.",
        },
        { type: "h", text: "Hard: shortest window that covers everything" },
        {
          type: "p",
          text: "For \"shortest\" problems the template flips: grow on the right until the window is **valid**, then shrink on the left **while it stays valid**, recording the best each time. To know in O(1) whether the window contains all of `t`, keep a counter `missing` = how many characters of `t` are still not covered.",
        },
        {
          type: "challenge",
          title: "Minimum Window Substring",
          difficulty: "hard",
          tags: ["sliding window", "hash map", "string"],
          prompt: "Given strings `s` and `t`, return the shortest substring of `s` that contains every character of `t`, **including duplicates** (if `t` has two `a`s, the window needs two `a`s). If no such window exists, return `\"\"`. The answer is unique when it exists.",
          examples: [
            { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
            { input: 's = "a", t = "a"', output: '"a"' },
            { input: 's = "a", t = "aa"', output: '""', explanation: "s has only one a." },
          ],
          constraints: ["1 <= s.length, t.length <= 10^5", "upper- and lowercase letters"],
          complexity: "O(|s| + |t|) time, O(alphabet) space",
          starter: `function minWindow(s, t) {
  // your code here
}`,
          solution: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);
  let missing = t.length;            // chars of t not yet covered by the window
  let left = 0;
  let bestStart = 0;
  let bestLen = Infinity;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need.has(c)) {
      if (need.get(c) > 0) missing--;
      need.set(c, need.get(c) - 1);  // may go negative: extra copies
    }
    while (missing === 0) {          // valid: try to shrink
      if (right - left + 1 < bestLen) {
        bestLen = right - left + 1;
        bestStart = left;
      }
      const d = s[left];
      if (need.has(d)) {
        need.set(d, need.get(d) + 1);
        if (need.get(d) > 0) missing++;
      }
      left++;
    }
  }
  return bestLen === Infinity ? "" : s.slice(bestStart, bestStart + bestLen);
}`,
          tests: [
            { name: 'example: "ADOBECODEBANC", "ABC" → "BANC"', code: 'return minWindow("ADOBECODEBANC", "ABC") === "BANC";' },
            { name: 'whole string: "a", "a" → "a"', code: 'return minWindow("a", "a") === "a";' },
            { name: 'not enough copies: "a", "aa" → ""', code: 'return minWindow("a", "aa") === "";' },
            { name: 'duplicates in t: "aaflslflsldkalskaaa", "aaa" → "aaa"', code: 'return minWindow("aaflslflsldkalskaaa", "aaa") === "aaa";' },
            { name: 'case-sensitive: "aBc", "b" → ""', code: 'return minWindow("aBc", "b") === "";' },
            {
              name: "14,000 filler characters, under 300 ms",
              code: `const s = "x".repeat(7000) + "CAB" + "x".repeat(7000);
const t0 = performance.now();
return minWindow(s, "ABC") === "CAB" && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Count what `t` needs in a Map and keep `missing = t.length`. Expanding: if the char is still needed (count > 0), `missing--`; always decrement its count. While `missing === 0`, record the window, then remove `s[left]` (increment its count; if it goes above 0, `missing++`) and move `left`.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Rolling windows in dashboards",
          text: "A \"7-day rolling revenue\" chart for a client's Shopify store, or a rate limiter that allows 100 requests per sliding minute in a Next.js route handler, is this exact pattern: add what enters, subtract what leaves. In SQL (Supabase/Postgres) the same idea is a window function: `SUM(total) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which problem is NOT a sliding window problem?",
              options: [
                "Longest substring with at most 2 distinct characters",
                "Maximum sum of 5 consecutive days",
                "Smallest substring containing all vowels",
                "Longest increasing *subsequence* (elements need not be adjacent)",
              ],
              answer: 3,
              why: "A window is contiguous. A subsequence can skip elements, which breaks the add-right / remove-left logic — that one is a dynamic programming problem.",
            },
            {
              q: "A variable window solution has a `while` that moves `left` inside a `for` over `right`. Its time complexity is…",
              options: ["O(n²)", "O(n)", "O(n log n)", "O(k · n)"],
              answer: 1,
              why: "Both pointers only move forward, and `left` never passes `right`, so the total number of moves is at most 2n.",
            },
            {
              q: "In Longest Repeating Character Replacement, when is the window `[left, right]` valid?",
              options: [
                "When `windowLength - maxFreq <= k`",
                "When it has no repeated letters",
                "When `maxFreq >= k`",
                "When the window length is exactly k",
              ],
              answer: 0,
              why: "Keep the most frequent letter and replace all the others; that's `windowLength - maxFreq` replacements, which must not exceed `k`.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 6. Prefix sums
    // ─────────────────────────────────────────────────────────────
    {
      slug: "prefix-sums",
      title: "Prefix sums",
      summary: "Precompute running totals once, then answer any range-sum question in O(1) — and combine them with a hash map to count subarrays.",
      minutes: 40,
      blocks: [
        {
          type: "p",
          text: "Suppose a client dashboard asks \"how many sign-ups between day 12 and day 40?\" a thousand times. Summing the range each time is O(n) per question. A **prefix sum** array stores the running total up to each position, built once in O(n). Then any range sum is a single subtraction: the total up to the end of the range minus the total before its start. O(1) per question.",
        },
        { type: "h", text: "The definition (and the off-by-one that saves you)" },
        {
          type: "p",
          text: "Use an array **one longer** than the input, with `prefix[0] = 0` and `prefix[i + 1] = prefix[i] + nums[i]`. So `prefix[i]` is the sum of the first `i` elements, and the sum of `nums[l..r]` (inclusive) is `prefix[r + 1] - prefix[l]`. The extra leading 0 means a range starting at index 0 needs no special case.",
        },
        {
          type: "table",
          rows: [
            ["i", "0", "1", "2", "3", "4", "5"],
            ["nums[i]", "3", "−1", "4", "2", "−5", ""],
            ["prefix[i]", "0", "3", "2", "6", "8", "3"],
          ],
        },
        {
          type: "p",
          text: "Sum of `nums[1..3]` = `-1 + 4 + 2` = 5, and indeed `prefix[4] - prefix[1]` = 8 − 3 = 5.",
        },
        {
          type: "run",
          title: "Build once, query many times",
          code: `const signups = [12, 7, 0, 15, 9, 22, 4, 18]; // daily sign-ups for a campaign

// Build: O(n)
const prefix = [0];
for (const x of signups) prefix.push(prefix[prefix.length - 1] + x);
console.log("prefix:", prefix);

// Query: O(1) — sum of days l..r inclusive
const rangeSum = (l, r) => prefix[r + 1] - prefix[l];
console.log("days 0..2:", rangeSum(0, 2));   // 12 + 7 + 0 = 19
console.log("days 3..5:", rangeSum(3, 5));   // 15 + 9 + 22 = 46
console.log("whole campaign:", rangeSum(0, signups.length - 1));

// The same idea with products (Product of Array Except Self, lesson 2):
const nums = [1, 2, 3, 4];
const leftProd = [1];
for (let i = 0; i < nums.length - 1; i++) leftProd.push(leftProd[i] * nums[i]);
const rightProd = new Array(nums.length).fill(1);
for (let i = nums.length - 2; i >= 0; i--) rightProd[i] = rightProd[i + 1] * nums[i + 1];
console.log("left products: ", leftProd);    // [1, 1, 2, 6]
console.log("right products:", rightProd);   // [24, 12, 4, 1]
console.log("except self:   ", leftProd.map((p, i) => p * rightProd[i])); // [24, 12, 8, 6]`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Product Except Self, revisited",
          text: "The lesson 2 solution *was* a prefix technique: a prefix product from the left times a suffix product from the right. Prefix sums generalise to any operation you can accumulate (sum, product, XOR, count of something) — and for sums, also *undo* with subtraction.",
        },
        {
          type: "compare",
          left: {
            label: "Brute force: re-sum each query — O(n) per query",
            lang: "js",
            code: `class NumArray {
  constructor(nums) {
    this.nums = nums;
  }
  sumRange(left, right) {
    let sum = 0;
    for (let i = left; i <= right; i++) sum += this.nums[i];
    return sum;
  }
}`,
          },
          right: {
            label: "Prefix sums: O(n) once, then O(1) per query",
            lang: "js",
            code: `class NumArray {
  constructor(nums) {
    this.prefix = [0];
    for (const x of nums) {
      this.prefix.push(this.prefix[this.prefix.length - 1] + x);
    }
  }
  sumRange(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}`,
          },
        },
        {
          type: "challenge",
          title: "Running Sum",
          difficulty: "easy",
          tags: ["prefix sum", "array"],
          prompt: "Given an array `nums` (daily sales), return a new array where element `i` is the sum of `nums[0]` through `nums[i]` (the running total).",
          examples: [
            { input: "nums = [1,2,3,4]", output: "[1,3,6,10]" },
            { input: "nums = [3,1,2,10,1]", output: "[3,4,6,16,17]" },
          ],
          constraints: ["0 <= nums.length <= 10^5", "-10^6 <= nums[i] <= 10^6"],
          complexity: "O(n) time, O(1) extra space besides the output",
          starter: `function runningSum(nums) {
  // your code here
}`,
          solution: `function runningSum(nums) {
  const out = [];
  let total = 0;
  for (const x of nums) {
    total += x;
    out.push(total);
  }
  return out;
}`,
          tests: [
            { name: "example: [1,2,3,4] → [1,3,6,10]", code: "return deepEqual(runningSum([1, 2, 3, 4]), [1, 3, 6, 10]);" },
            { name: "example: [3,1,2,10,1] → [3,4,6,16,17]", code: "return deepEqual(runningSum([3, 1, 2, 10, 1]), [3, 4, 6, 16, 17]);" },
            { name: "refunds (negatives): [5,-2,-3] → [5,3,0]", code: "return deepEqual(runningSum([5, -2, -3]), [5, 3, 0]);" },
            { name: "empty array → []", code: "return deepEqual(runningSum([]), []);" },
          ],
          hint: "Keep one variable `total`, add each element to it, push the total.",
        },
        {
          type: "challenge",
          title: "Range Sum Query",
          difficulty: "easy",
          tags: ["prefix sum", "design"],
          prompt: "Implement a class `NumArray` that is built from an integer array `nums` and answers many queries `sumRange(left, right)`: the sum of `nums[left]` through `nums[right]`, inclusive. Queries must be O(1).",
          examples: [
            {
              input: "nums = [-2,0,3,-5,2,-1]; sumRange(0,2), sumRange(2,5), sumRange(0,5)",
              output: "1, -1, -3",
              explanation: "-2 + 0 + 3 = 1; 3 - 5 + 2 - 1 = -1; the whole array = -3",
            },
          ],
          constraints: ["1 <= nums.length <= 10^5", "0 <= left <= right < nums.length", "up to 10^5 calls to sumRange"],
          complexity: "O(n) to build, O(1) per query, O(n) space",
          starter: `class NumArray {
  constructor(nums) {
    // your code here
  }

  sumRange(left, right) {
    // your code here
  }
}`,
          solution: `class NumArray {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  sumRange(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}`,
          tests: [
            {
              name: "example: [-2,0,3,-5,2,-1] → 1, -1, -3",
              code: `const a = new NumArray([-2, 0, 3, -5, 2, -1]);
return a.sumRange(0, 2) === 1 && a.sumRange(2, 5) === -1 && a.sumRange(0, 5) === -3;`,
            },
            {
              name: "single-element ranges",
              code: `const a = new NumArray([4, 9, -7]);
return a.sumRange(0, 0) === 4 && a.sumRange(1, 1) === 9 && a.sumRange(2, 2) === -7;`,
            },
            {
              name: "array of one element",
              code: `const a = new NumArray([42]); return a.sumRange(0, 0) === 42;`,
            },
            {
              name: "50,000 numbers and 20,000 full-range queries in under 300 ms",
              code: `const n = 50000;
const a = new NumArray(Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 3 : -1)));
const t0 = performance.now();
let ok = true;
for (let q = 0; q < 20000; q++) if (a.sumRange(0, n - 1) !== 50000) ok = false;
return ok && performance.now() - t0 < 300;`,
            },
          ],
          hint: "In the constructor, build `prefix` with `prefix[0] = 0` and `prefix[i + 1] = prefix[i] + nums[i]`. Then `sumRange` is `prefix[right + 1] - prefix[left]`.",
        },
        {
          type: "p",
          text: "Prefix sums also answer \"left side vs right side\" questions without a second array: if you know the **total**, the right sum at index `i` is `total - leftSum - nums[i]`.",
        },
        {
          type: "challenge",
          title: "Find Pivot Index",
          difficulty: "easy",
          tags: ["prefix sum", "array"],
          prompt: "Return the **leftmost** index `i` where the sum of everything strictly left of `i` equals the sum of everything strictly right of `i`. An empty side sums to 0. If no such index exists, return `-1`.",
          examples: [
            { input: "nums = [1,7,3,6,5,6]", output: "3", explanation: "Left: 1 + 7 + 3 = 11. Right: 5 + 6 = 11." },
            { input: "nums = [1,2,3]", output: "-1" },
            { input: "nums = [2,1,-1]", output: "0", explanation: "Left is empty (0); right is 1 + (-1) = 0." },
          ],
          constraints: ["1 <= nums.length <= 10^4", "-1000 <= nums[i] <= 1000"],
          complexity: "O(n) time, O(1) space",
          starter: `function pivotIndex(nums) {
  // your code here
}`,
          solution: `function pivotIndex(nums) {
  let total = 0;
  for (const x of nums) total += x;
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    if (leftSum === total - leftSum - nums[i]) return i;
    leftSum += nums[i];
  }
  return -1;
}`,
          tests: [
            { name: "example: [1,7,3,6,5,6] → 3", code: "return pivotIndex([1, 7, 3, 6, 5, 6]) === 3;" },
            { name: "no pivot: [1,2,3] → -1", code: "return pivotIndex([1, 2, 3]) === -1;" },
            { name: "pivot at index 0: [2,1,-1] → 0", code: "return pivotIndex([2, 1, -1]) === 0;" },
            { name: "single element is its own pivot: [9] → 0", code: "return pivotIndex([9]) === 0;" },
            { name: "returns the leftmost: [0,0,0] → 0", code: "return pivotIndex([0, 0, 0]) === 0;" },
            {
              name: "50,001 elements in under 300 ms",
              code: `const nums = new Array(50001).fill(1);
const t0 = performance.now();
return pivotIndex(nums) === 25000 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Compute the total first. Walk left to right keeping `leftSum`; at index `i`, the right sum is `total - leftSum - nums[i]`.",
        },
        { type: "h", text: "Prefix sums + hash map: counting subarrays" },
        {
          type: "p",
          text: "Here's the most important combination in this lesson. A subarray `nums[j..i]` sums to `k` exactly when `prefix[i + 1] - prefix[j] === k`, i.e. when an **earlier** prefix equals `currentPrefix - k`. So walk once, keep a Map from each prefix value to **how many times** it has occurred, and at each step add `seen.get(current - k)` to the answer. It's Two Sum, applied to prefix sums. Start the Map with `{0 → 1}`: the empty prefix, so subarrays starting at index 0 are counted. Trace on `[1, 2, 3]`, `k = 3`:",
        },
        {
          type: "table",
          rows: [
            ["i", "nums[i]", "running prefix", "look for prefix − k", "times seen", "count", "Map after"],
            ["—", "", "0", "", "", "0", "{0:1}"],
            ["0", "1", "1", "−2", "0", "0", "{0:1, 1:1}"],
            ["1", "2", "3", "0", "1 ([1,2])", "1", "{0:1, 1:1, 3:1}"],
            ["2", "3", "6", "3", "1 ([3])", "2", "{0:1, 1:1, 3:1, 6:1}"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Why not a sliding window?",
          text: "Sliding windows rely on \"growing the window increases the sum, shrinking decreases it\". With **negative numbers** (refunds, corrections) that's false, so you can't know which edge to move. Prefix sums + a hash map don't care about signs.",
        },
        {
          type: "challenge",
          title: "Subarray Sum Equals K",
          difficulty: "medium",
          tags: ["prefix sum", "hash map"],
          prompt: "Given an integer array `nums` (it may contain negatives and zeros) and an integer `k`, return the **number** of contiguous, non-empty subarrays whose sum equals `k`.",
          examples: [
            { input: "nums = [1,1,1], k = 2", output: "2", explanation: "[1,1] at indices 0–1 and 1–2." },
            { input: "nums = [1,2,3], k = 3", output: "2", explanation: "[1,2] and [3]." },
          ],
          constraints: ["1 <= nums.length <= 2 * 10^4", "-1000 <= nums[i] <= 1000", "-10^7 <= k <= 10^7"],
          complexity: "O(n) time, O(n) space",
          starter: `function subarraySum(nums, k) {
  // your code here
}`,
          solution: `function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]); // prefix value → how many times seen
  let prefix = 0;
  let count = 0;
  for (const x of nums) {
    prefix += x;
    count += seen.get(prefix - k) ?? 0;
    seen.set(prefix, (seen.get(prefix) ?? 0) + 1);
  }
  return count;
}`,
          tests: [
            { name: "example: [1,1,1], k = 2 → 2", code: "return subarraySum([1, 1, 1], 2) === 2;" },
            { name: "example: [1,2,3], k = 3 → 2", code: "return subarraySum([1, 2, 3], 3) === 2;" },
            { name: "negatives and zero: [1,-1,0], k = 0 → 3", code: "return subarraySum([1, -1, 0], 0) === 3;" },
            { name: "no match: [1,2,3], k = 7 → 0", code: "return subarraySum([1, 2, 3], 7) === 0;" },
            {
              name: "40,000 zeros with k = 0 (800,020,000 subarrays) in under 300 ms",
              code: `const n = 40000;
const nums = new Array(n).fill(0);
const t0 = performance.now();
return subarraySum(nums, 0) === (n * (n + 1)) / 2 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Keep a running prefix sum and a Map counting how many times each prefix has appeared (start with `0 → 1`). At each element, add the count of `prefix - k`, then record the current prefix.",
        },
        { type: "h", text: "Two dimensions" },
        {
          type: "p",
          text: "The same idea works on a grid (a heat map of clicks, a seat map, an image). Let `P[r][c]` be the sum of the rectangle from `(0,0)` to `(r-1, c-1)` — again with an extra row and column of zeros. Build it with inclusion–exclusion: `P[r+1][c+1] = m[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]` (the top-left block was added twice, so subtract it once). A rectangle `(r1,c1)–(r2,c2)` is then `P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]`.",
        },
        {
          type: "challenge",
          title: "Range Sum Query 2D",
          difficulty: "medium",
          tags: ["prefix sum", "matrix", "design"],
          prompt: "Implement a class `NumMatrix` built from a 2D array `matrix`, with a method `sumRegion(row1, col1, row2, col2)` that returns the sum of the rectangle whose top-left corner is `(row1, col1)` and bottom-right corner is `(row2, col2)`, inclusive. Each query must be O(1).",
          examples: [
            {
              input: "matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]; sumRegion(2,1,4,3)",
              output: "8",
              explanation: "Rows 2–4, columns 1–3: (2+0+1) + (1+0+1) + (0+3+0) = 8",
            },
            { input: "same matrix; sumRegion(1,1,2,2)", output: "11", explanation: "6 + 3 + 2 + 0" },
            { input: "same matrix; sumRegion(1,2,2,4)", output: "12" },
          ],
          constraints: ["1 <= rows, cols <= 300", "up to 10^4 calls to sumRegion"],
          complexity: "O(rows · cols) to build, O(1) per query",
          starter: `class NumMatrix {
  constructor(matrix) {
    // your code here
  }

  sumRegion(row1, col1, row2, col2) {
    // your code here
  }
}`,
          solution: `class NumMatrix {
  constructor(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    // P has an extra row and column of zeros
    this.P = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.P[r + 1][c + 1] = matrix[r][c] + this.P[r][c + 1] + this.P[r + 1][c] - this.P[r][c];
      }
    }
  }

  sumRegion(row1, col1, row2, col2) {
    const P = this.P;
    return P[row2 + 1][col2 + 1] - P[row1][col2 + 1] - P[row2 + 1][col1] + P[row1][col1];
  }
}`,
          tests: [
            {
              name: "examples: (2,1,4,3) → 8, (1,1,2,2) → 11, (1,2,2,4) → 12",
              code: `const m = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);
return m.sumRegion(2, 1, 4, 3) === 8 && m.sumRegion(1, 1, 2, 2) === 11 && m.sumRegion(1, 2, 2, 4) === 12;`,
            },
            {
              name: "single cell and the whole matrix (58)",
              code: `const m = new NumMatrix([[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]);
return m.sumRegion(0, 0, 0, 0) === 3 && m.sumRegion(4, 4, 4, 4) === 5 && m.sumRegion(0, 0, 4, 4) === 58;`,
            },
            {
              name: "one-row matrix with negatives",
              code: `const m = new NumMatrix([[2, -3, 4, -1]]);
return m.sumRegion(0, 1, 0, 2) === 1 && m.sumRegion(0, 0, 0, 3) === 2;`,
            },
            {
              name: "300×300 grid, 10,000 full-grid queries in under 300 ms",
              code: `const grid = Array.from({ length: 300 }, () => new Array(300).fill(1));
const t0 = performance.now();
const m = new NumMatrix(grid);
let ok = true;
for (let q = 0; q < 10000; q++) if (m.sumRegion(0, 0, 299, 299) !== 90000) ok = false;
return ok && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Allocate `(rows + 1) × (cols + 1)` zeros. Fill with `P[r+1][c+1] = m[r][c] + P[r][c+1] + P[r+1][c] - P[r][c]`. For a query, take the big rectangle, subtract the strip above and the strip to the left, add back the corner you subtracted twice.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Prefix sums in your stack",
          text: "A Postgres running total is `SUM(amount) OVER (ORDER BY created_at)`: a prefix sum computed by the database. For a Next.js analytics page, fetch daily totals from Supabase once, build the prefix array on the server, and every date-range filter the user picks becomes one subtraction instead of a new query.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "With `prefix[0] = 0` and `prefix[i + 1] = prefix[i] + nums[i]`, the sum of `nums[2..5]` (inclusive) is…",
              options: ["`prefix[5] - prefix[2]`", "`prefix[6] - prefix[1]`", "`prefix[6] - prefix[2]`", "`prefix[5] - prefix[1]`"],
              answer: 2,
              why: "`prefix[6]` covers indices 0–5 and `prefix[2]` covers 0–1; subtracting leaves exactly 2–5.",
            },
            {
              q: "In Subarray Sum Equals K, why does the Map start as `{0 → 1}`?",
              options: [
                "So that subarrays starting at index 0 are counted (their earlier prefix is the empty prefix, 0)",
                "Because k is never 0",
                "To avoid dividing by zero",
                "It's only an optimisation and can be removed",
              ],
              answer: 0,
              why: "If the prefix up to i equals k, the matching earlier prefix is the empty one (sum 0). Without that entry, those subarrays are missed.",
            },
            {
              q: "The array contains negative numbers and you must count subarrays with sum k. Which technique works?",
              options: ["Variable sliding window", "Two pointers from both ends", "Sorting then binary search", "Prefix sums + hash map"],
              answer: 3,
              why: "Negatives break the monotonic grow/shrink logic a sliding window needs. Prefix sums + a Map of counts handle any sign in O(n).",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 7. Sorting & intervals
    // ─────────────────────────────────────────────────────────────
    {
      slug: "sorting-and-intervals",
      title: "Sorting & intervals",
      summary: "Custom comparators, sorting objects, and the sort-then-sweep pattern behind every merge, booking and meeting-room problem.",
      minutes: 50,
      blocks: [
        {
          type: "p",
          text: "Sorting is the most underrated optimisation: O(n log n) once, and suddenly duplicates are neighbours, overlapping ranges are next to each other, and two pointers work. Interval problems — bookings, meetings, shifts, promo periods — are almost always solved the same way: **sort by start, then sweep left to right** keeping track of the current interval. But first you need to sort correctly in JavaScript, which has a famous trap.",
        },
        { type: "h", text: "Comparators" },
        {
          type: "p",
          text: "`arr.sort(compare)` calls `compare(a, b)` and expects a number: **negative** → `a` goes first, **positive** → `b` goes first, **0** → keep their current order. Without a comparator, JavaScript converts the elements to strings and sorts them as text, so `10` comes before `9`. `sort` mutates the array; `toSorted` (ES2023) returns a sorted copy. Both are **stable**: equal elements keep their original relative order, which lets you build multi-key sorts.",
        },
        {
          type: "run",
          title: "Sorting numbers, strings and objects",
          code: `// The default sort compares as strings
console.log([10, 9, 1, 100].sort());                  // [1, 10, 100, 9]
console.log([10, 9, 1, 100].sort((a, b) => a - b));   // ascending
console.log([10, 9, 1, 100].sort((a, b) => b - a));   // descending

const leads = [
  { name: "Élodie", score: 80, createdAt: "2026-03-02" },
  { name: "Zoé", score: 95, createdAt: "2026-01-15" },
  { name: "Alexandre", score: 80, createdAt: "2026-02-10" },
  { name: "émile", score: 60, createdAt: "2026-03-20" },
];

// Several keys: score descending, then name ascending.
// "||" moves on to the next key when the first comparison is 0 (a tie).
const ranked = leads.toSorted(
  (a, b) => b.score - a.score || a.name.localeCompare(b.name, "fr-CA"),
);
console.log(ranked.map((l) => l.score + " " + l.name));

// Plain string comparison puts accented letters after "Z"; localeCompare doesn't
const names = leads.map((l) => l.name);
console.log(names.toSorted());                                       // by UTF-16 code units
console.log(names.toSorted((a, b) => a.localeCompare(b, "fr-CA")));  // how a human expects

// ISO dates (YYYY-MM-DD) sort correctly as strings
console.log(leads.toSorted((a, b) => a.createdAt.localeCompare(b.createdAt)).map((l) => l.createdAt));

// toSorted left the original untouched
console.log("original first:", leads[0].name);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Comparator mistakes",
          text: "Returning a boolean (`(a, b) => a > b`) is wrong: `false` becomes 0 (\"equal\") and the result depends on the engine. Return a number. And never write `nums.sort()` for numbers in an interview — it sorts `[10, -2, -1]` as text into `[-1, -2, 10]`.",
        },
        { type: "h", text: "Intervals: sort, then sweep" },
        {
          type: "p",
          text: "An interval is a pair `[start, end]`. Once intervals are sorted by start, an interval can only overlap the ones right before it, so a single left-to-right pass is enough. Two sorted intervals `a` then `b` overlap when `b[0] <= a[1]` — or `b[0] < a[1]` if an interval that ends at 10 and one that starts at 10 should **not** count as overlapping (back-to-back meetings). Every interval problem states one convention or the other: read it carefully.",
        },
        {
          type: "table",
          rows: [
            ["Signal in the statement", "Typical approach"],
            ["\"merge overlapping…\", \"total covered time\"", "sort by start, extend the last merged interval or start a new one"],
            ["\"can one person attend all…\"", "sort by start, check each neighbour pair"],
            ["\"minimum rooms / servers / staff needed\"", "count how many intervals are active at once (sweep line or min-heap)"],
            ["\"remove the fewest to make them non-overlapping\"", "greedy: sort by **end**, keep whatever ends first"],
          ],
        },
        {
          type: "p",
          text: "Trace of merging `[[1,3],[2,6],[8,10],[15,18]]` (already sorted by start):",
        },
        {
          type: "table",
          rows: [
            ["current interval", "last merged", "overlap? (start <= last end)", "result so far"],
            ["[1,3]", "—", "first one", "[[1,3]]"],
            ["[2,6]", "[1,3]", "2 <= 3 → yes, end = max(3, 6)", "[[1,6]]"],
            ["[8,10]", "[1,6]", "8 <= 6 → no", "[[1,6],[8,10]]"],
            ["[15,18]", "[8,10]", "15 <= 10 → no", "[[1,6],[8,10],[15,18]]"],
          ],
        },
        {
          type: "compare",
          left: {
            label: "Brute force: merge any overlapping pair until none is left — O(n³) worst case",
            lang: "js",
            code: `function merge(intervals) {
  const list = intervals.map((x) => [...x]);
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i], b = list[j];
        if (a[0] <= b[1] && b[0] <= a[1]) {
          list[i] = [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
          list.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  return list.sort((a, b) => a[0] - b[0]);
}`,
          },
          right: {
            label: "Sort + sweep — O(n log n) time, O(n) space",
            lang: "js",
            code: `function merge(intervals) {
  const sorted = intervals.toSorted((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      out.push([start, end]);
    }
  }
  return out;
}`,
          },
        },
        {
          type: "challenge",
          title: "Meeting Rooms",
          difficulty: "easy",
          tags: ["intervals", "sorting"],
          prompt: "Given an array of meeting times `intervals` where `intervals[i] = [start, end]`, return `true` if one person could attend all of them. A meeting ending at time `t` and another starting at `t` do **not** conflict.",
          examples: [
            { input: "intervals = [[0,30],[5,10],[15,20]]", output: "false" },
            { input: "intervals = [[7,10],[2,4]]", output: "true" },
          ],
          constraints: ["0 <= intervals.length <= 10^4", "0 <= start < end <= 10^6"],
          complexity: "O(n log n) time, O(n) space for the sorted copy",
          starter: `function canAttendMeetings(intervals) {
  // your code here
}`,
          solution: `function canAttendMeetings(intervals) {
  const sorted = intervals.toSorted((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < sorted[i - 1][1]) return false;
  }
  return true;
}`,
          tests: [
            { name: "example: [[0,30],[5,10],[15,20]] → false", code: "return canAttendMeetings([[0, 30], [5, 10], [15, 20]]) === false;" },
            { name: "unsorted, no conflict: [[7,10],[2,4]] → true", code: "return canAttendMeetings([[7, 10], [2, 4]]) === true;" },
            { name: "back-to-back is fine: [[1,5],[5,10]] → true", code: "return canAttendMeetings([[1, 5], [5, 10]]) === true;" },
            { name: "unsorted overlap: [[10,20],[1,11]] → false", code: "return canAttendMeetings([[10, 20], [1, 11]]) === false;" },
            { name: "no meetings → true", code: "return canAttendMeetings([]) === true;" },
          ],
          hint: "Sort by start time, then compare each meeting's start with the previous meeting's end. Use `<` (not `<=`) because back-to-back is allowed.",
        },
        {
          type: "challenge",
          title: "Merge Intervals",
          difficulty: "medium",
          tags: ["intervals", "sorting"],
          prompt: "Given an array of intervals `[start, end]` (in any order), merge all overlapping intervals and return the result **sorted by start**. Intervals that touch (`[1,4]` and `[4,5]`) count as overlapping.",
          examples: [
            { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
            { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
          ],
          constraints: ["1 <= intervals.length <= 10^5", "0 <= start <= end <= 10^5"],
          complexity: "O(n log n) time, O(n) space",
          starter: `function merge(intervals) {
  // your code here
}`,
          solution: `function merge(intervals) {
  const sorted = intervals.toSorted((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      out.push([start, end]);
    }
  }
  return out;
}`,
          tests: [
            { name: "example: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]", code: "return deepEqual(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);" },
            { name: "touching intervals merge: [[1,4],[4,5]] → [[1,5]]", code: "return deepEqual(merge([[1, 4], [4, 5]]), [[1, 5]]);" },
            { name: "unsorted input: [[4,7],[1,4]] → [[1,7]]", code: "return deepEqual(merge([[4, 7], [1, 4]]), [[1, 7]]);" },
            { name: "one interval swallows others: [[1,10],[2,3],[4,5]] → [[1,10]]", code: "return deepEqual(merge([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);" },
            { name: "single interval: [[5,5]] → [[5,5]]", code: "return deepEqual(merge([[5, 5]]), [[5, 5]]);" },
            {
              name: "30,000 disjoint intervals in reverse order, under 300 ms",
              code: `const n = 30000;
const intervals = Array.from({ length: n }, (_, i) => [2 * (n - 1 - i), 2 * (n - 1 - i) + 1]);
const t0 = performance.now();
const r = merge(intervals);
const ms = performance.now() - t0;
return r.length === n && deepEqual(r[0], [0, 1]) && deepEqual(r[n - 1], [2 * n - 2, 2 * n - 1]) && ms < 300;`,
            },
          ],
          hint: "Sort a copy by start. Walk through it: if the current interval starts at or before the end of the last merged one, extend that end with `Math.max`; otherwise push a new interval.",
        },
        {
          type: "p",
          text: "When the list is **already sorted and non-overlapping**, inserting one more interval doesn't need a sort: it's three phases in one pass — copy everything that ends before the new interval, merge everything that overlaps it, copy the rest.",
        },
        {
          type: "challenge",
          title: "Insert Interval",
          difficulty: "medium",
          tags: ["intervals", "array"],
          prompt: "You get `intervals`, sorted by start and non-overlapping (a client's booked slots), and a `newInterval` `[start, end]`. Insert it, merging where necessary, and return the new sorted, non-overlapping list. Touching intervals merge. Do it in O(n), without sorting.",
          examples: [
            { input: "intervals = [[1,3],[6,9]], newInterval = [2,5]", output: "[[1,5],[6,9]]" },
            { input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", output: "[[1,2],[3,10],[12,16]]", explanation: "[4,8] overlaps [3,5], [6,7] and [8,10]." },
          ],
          constraints: ["0 <= intervals.length <= 10^4", "intervals is sorted by start and non-overlapping"],
          complexity: "O(n) time, O(n) space for the output",
          starter: `function insert(intervals, newInterval) {
  // your code here
}`,
          solution: `function insert(intervals, newInterval) {
  const out = [];
  let [start, end] = newInterval;
  let i = 0;
  const n = intervals.length;
  // 1. everything that ends before the new interval starts
  while (i < n && intervals[i][1] < start) out.push(intervals[i++]);
  // 2. everything that overlaps it: grow the new interval
  while (i < n && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  out.push([start, end]);
  // 3. everything after
  while (i < n) out.push(intervals[i++]);
  return out;
}`,
          tests: [
            { name: "example: [[1,3],[6,9]] + [2,5] → [[1,5],[6,9]]", code: "return deepEqual(insert([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);" },
            {
              name: "merges several: + [4,8] → [[1,2],[3,10],[12,16]]",
              code: "return deepEqual(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]]);",
            },
            { name: "empty list: [] + [5,7] → [[5,7]]", code: "return deepEqual(insert([], [5, 7]), [[5, 7]]);" },
            { name: "goes first: [[3,4]] + [1,2] → [[1,2],[3,4]]", code: "return deepEqual(insert([[3, 4]], [1, 2]), [[1, 2], [3, 4]]);" },
            { name: "goes last: [[1,2]] + [3,4] → [[1,2],[3,4]]", code: "return deepEqual(insert([[1, 2]], [3, 4]), [[1, 2], [3, 4]]);" },
            { name: "touching merges: [[1,5]] + [5,7] → [[1,7]]", code: "return deepEqual(insert([[1, 5]], [5, 7]), [[1, 7]]);" },
          ],
          hint: "Three while loops with one index: push intervals that end before `newInterval` starts; then, while an interval starts at or before `newInterval`'s end, widen `newInterval`; push it; push the rest.",
        },
        {
          type: "p",
          text: "A **greedy** twist: to keep as many intervals as possible (and so remove as few as possible), sort by **end** and always keep the interval that finishes first — it leaves the most room for everything after it. This is the classic activity-selection argument.",
        },
        {
          type: "challenge",
          title: "Non-overlapping Intervals",
          difficulty: "medium",
          tags: ["intervals", "greedy", "sorting"],
          prompt: "Given an array of intervals, return the **minimum number** of intervals to remove so that the rest don't overlap. Intervals that only touch (`[1,2]` and `[2,3]`) do not overlap.",
          examples: [
            { input: "intervals = [[1,2],[2,3],[3,4],[1,3]]", output: "1", explanation: "Remove [1,3]." },
            { input: "intervals = [[1,2],[1,2],[1,2]]", output: "2" },
            { input: "intervals = [[1,2],[2,3]]", output: "0" },
          ],
          constraints: ["1 <= intervals.length <= 10^5", "start < end"],
          complexity: "O(n log n) time, O(n) space for the sorted copy",
          starter: `function eraseOverlapIntervals(intervals) {
  // your code here
}`,
          solution: `function eraseOverlapIntervals(intervals) {
  const sorted = intervals.toSorted((a, b) => a[1] - b[1]);
  let removed = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of sorted) {
    if (start >= lastEnd) {
      lastEnd = end;      // keep it
    } else {
      removed++;          // overlaps the one we kept: drop it
    }
  }
  return removed;
}`,
          tests: [
            { name: "example: [[1,2],[2,3],[3,4],[1,3]] → 1", code: "return eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]) === 1;" },
            { name: "identical intervals: [[1,2],[1,2],[1,2]] → 2", code: "return eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]]) === 2;" },
            { name: "touching is fine: [[1,2],[2,3]] → 0", code: "return eraseOverlapIntervals([[1, 2], [2, 3]]) === 0;" },
            { name: "long interval should go: [[1,100],[11,22],[1,11],[2,12]] → 2", code: "return eraseOverlapIntervals([[1, 100], [11, 22], [1, 11], [2, 12]]) === 2;" },
            { name: "negative times: [[-5,-1],[-3,2],[0,4]] → 1", code: "return eraseOverlapIntervals([[-5, -1], [-3, 2], [0, 4]]) === 1;" },
          ],
          hint: "Sort by end time. Keep a `lastEnd` of the last interval you kept. If the next one starts at or after `lastEnd`, keep it; otherwise count it as removed.",
        },
        { type: "h", text: "Counting overlaps: the sweep line" },
        {
          type: "p",
          text: "\"How many rooms do we need?\" = the maximum number of meetings running **at the same moment**. Split every meeting into a start event and an end event, sort each list, and walk through time: a start before the earliest unfinished end needs a new room; otherwise a room has been freed and is reused. For `[[0,30],[5,10],[15,20]]`: starts `0, 5, 15`, ends `10, 20, 30`.",
        },
        {
          type: "table",
          rows: [
            ["next start", "earliest end not yet used", "decision", "rooms"],
            ["0", "10", "0 < 10 → new room", "1"],
            ["5", "10", "5 < 10 → new room", "2"],
            ["15", "10", "15 >= 10 → reuse the room freed at 10 (move to next end)", "2"],
          ],
        },
        {
          type: "challenge",
          title: "Meeting Rooms II",
          difficulty: "medium",
          tags: ["intervals", "sorting", "sweep line"],
          prompt: "Given meeting times `intervals[i] = [start, end]`, return the minimum number of conference rooms needed so that every meeting has a room. A room freed at time `t` can be used by a meeting starting at `t`.",
          examples: [
            { input: "intervals = [[0,30],[5,10],[15,20]]", output: "2" },
            { input: "intervals = [[7,10],[2,4]]", output: "1" },
          ],
          constraints: ["0 <= intervals.length <= 10^5", "0 <= start < end <= 10^6"],
          complexity: "O(n log n) time, O(n) space",
          starter: `function minMeetingRooms(intervals) {
  // your code here
}`,
          solution: `function minMeetingRooms(intervals) {
  const starts = intervals.map((m) => m[0]).sort((a, b) => a - b);
  const ends = intervals.map((m) => m[1]).sort((a, b) => a - b);
  let rooms = 0;
  let e = 0; // index of the earliest end not yet "used" to free a room
  for (let s = 0; s < starts.length; s++) {
    if (starts[s] >= ends[e]) {
      e++;        // a meeting finished: reuse its room
    } else {
      rooms++;    // everything is still busy: open a new room
    }
  }
  return rooms;
}`,
          tests: [
            { name: "example: [[0,30],[5,10],[15,20]] → 2", code: "return minMeetingRooms([[0, 30], [5, 10], [15, 20]]) === 2;" },
            { name: "example: [[7,10],[2,4]] → 1", code: "return minMeetingRooms([[7, 10], [2, 4]]) === 1;" },
            { name: "no meetings → 0", code: "return minMeetingRooms([]) === 0;" },
            { name: "back-to-back share a room: [[1,5],[5,10],[10,15]] → 1", code: "return minMeetingRooms([[1, 5], [5, 10], [10, 15]]) === 1;" },
            { name: "all overlapping: [[1,10],[2,9],[3,8]] → 3", code: "return minMeetingRooms([[1, 10], [2, 9], [3, 8]]) === 3;" },
            {
              name: "15,000 staggered meetings (10 at a time) in under 300 ms",
              code: `const intervals = Array.from({ length: 15000 }, (_, i) => [i, i + 10]);
const t0 = performance.now();
return minMeetingRooms(intervals) === 10 && performance.now() - t0 < 300;`,
            },
          ],
          hint: "Sort the start times and the end times separately. Walk the starts with one index and the ends with another: if a start is `>=` the current earliest end, a room frees up (advance the end index); otherwise you need one more room.",
        },
        {
          type: "callout",
          tone: "info",
          title: "The heap version",
          text: "Another classic solution sorts meetings by start and keeps a **min-heap** of end times of the rooms in use: pop when the earliest end is `<=` the new start, push the new end, and the heap's largest size is the answer. JavaScript has no built-in priority queue — you'll build one in the heaps lesson.",
        },
        { type: "h", text: "Sorting without sorting: Dutch national flag" },
        {
          type: "p",
          text: "When there are only **three** possible values, you can sort in one pass with three pointers: everything before `low` is 0, everything after `high` is 2, and `mid` scans the unknown middle. A 0 is swapped down to `low`, a 2 is swapped up to `high` (and **not** advanced past — the value swapped in hasn't been checked yet), a 1 just stays. Trace on `[2, 0, 2, 1, 1, 0]`:",
        },
        {
          type: "table",
          rows: [
            ["low", "mid", "high", "nums[mid]", "action", "array after"],
            ["0", "0", "5", "2", "swap mid↔high, high--", "[0, 0, 2, 1, 1, 2]"],
            ["0", "0", "4", "0", "swap low↔mid, low++, mid++", "[0, 0, 2, 1, 1, 2]"],
            ["1", "1", "4", "0", "swap low↔mid, low++, mid++", "[0, 0, 2, 1, 1, 2]"],
            ["2", "2", "4", "2", "swap mid↔high, high--", "[0, 0, 1, 1, 2, 2]"],
            ["2", "2", "3", "1", "mid++", "[0, 0, 1, 1, 2, 2]"],
            ["2", "3", "3", "1", "mid++ → mid > high, stop", "[0, 0, 1, 1, 2, 2]"],
          ],
        },
        {
          type: "challenge",
          title: "Sort Colors",
          difficulty: "medium",
          tags: ["two pointers", "sorting", "in place"],
          prompt: "An array `nums` contains only `0`, `1` and `2` (say, lead statuses: cold, warm, hot). Sort it **in place** so all 0s come first, then 1s, then 2s — in a single pass, with O(1) extra space, and without using `.sort()`.",
          examples: [
            { input: "nums = [2,0,2,1,1,0]", output: "[0,0,1,1,2,2]" },
            { input: "nums = [2,0,1]", output: "[0,1,2]" },
          ],
          constraints: ["1 <= nums.length <= 300", "nums[i] is 0, 1 or 2"],
          complexity: "O(n) time, one pass, O(1) space",
          starter: `function sortColors(nums) {
  // modify nums directly
}`,
          solution: `function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}`,
          tests: [
            { name: "example: [2,0,2,1,1,0] → [0,0,1,1,2,2]", code: "const a = [2, 0, 2, 1, 1, 0]; sortColors(a); return deepEqual(a, [0, 0, 1, 1, 2, 2]);" },
            { name: "example: [2,0,1] → [0,1,2]", code: "const a = [2, 0, 1]; sortColors(a); return deepEqual(a, [0, 1, 2]);" },
            { name: "single element: [1] → [1]", code: "const a = [1]; sortColors(a); return deepEqual(a, [1]);" },
            { name: "twos first: [2,2,0,0] → [0,0,2,2]", code: "const a = [2, 2, 0, 0]; sortColors(a); return deepEqual(a, [0, 0, 2, 2]);" },
            {
              name: "done without .sort()",
              code: `const a = [1, 2, 0, 1, 2, 0, 0];
sortColors(a);
return deepEqual(a, [0, 0, 0, 1, 1, 2, 2]) && !String(sortColors).includes(".sort(");`,
            },
          ],
          hint: "Three pointers: `low` (next slot for a 0), `mid` (scanner), `high` (next slot for a 2). On 0: swap with `low`, advance both. On 1: advance `mid`. On 2: swap with `high`, move `high` back only.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Intervals are everywhere in client apps",
          text: "A booking app checks a new reservation against existing ones with exactly the Meeting Rooms test. In Postgres (Supabase) you can even let the database enforce it: a `tstzrange` column with an exclusion constraint `EXCLUDE USING gist (room_id WITH =, during WITH &&)` (with the `btree_gist` extension enabled) rejects overlapping bookings. And when you sort in SQL (`order by score desc, name`), use `collate` for accent-aware order, the same problem `localeCompare` solves in JavaScript.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does `[10, 9, 1, 100].sort()` return?",
              options: ["[1, 9, 10, 100]", "[100, 10, 9, 1]", "[1, 10, 100, 9]", "It throws: numbers need a comparator"],
              answer: 2,
              why: "Without a comparator, elements are compared as strings, character by character: \"1\" < \"10\" < \"100\" < \"9\". Use `(a, b) => a - b` for numbers.",
            },
            {
              q: "To remove the fewest intervals so the rest don't overlap, the greedy keeps intervals sorted by…",
              options: ["start time", "end time", "length", "input order"],
              answer: 1,
              why: "Keeping the interval that ends earliest leaves the most room for the remaining ones (activity selection). Sorting by start can keep one long interval that blocks many short ones.",
            },
            {
              q: "Merging n intervals with sort + sweep costs…",
              options: ["O(n log n), dominated by the sort", "O(n), the sweep is linear", "O(n²)", "O(log n)"],
              answer: 0,
              why: "The sweep is O(n) but the sort is O(n log n), which dominates. (Insert Interval on an already-sorted list is O(n).)",
            },
            {
              q: "In the Dutch national flag algorithm, why don't we advance `mid` after swapping a 2 to `high`?",
              options: [
                "Because 2s must stay in the middle",
                "To make the algorithm two-pass",
                "Because `mid` must always equal `low`",
                "Because the value swapped into `mid` came from the unchecked region and still needs to be examined",
              ],
              answer: 3,
              why: "Everything between `mid` and `high` is unclassified. The element we just pulled from `high` could be a 0, 1 or 2, so we check it on the next iteration.",
            },
          ],
        },
      ],
    },
  ],
};
