import type { Track } from "../types";

export const track: Track = {
  slug: "algorithms-advanced",
  order: 4.3,
  title: "Graphs, Backtracking & DP",
  tagline: "The patterns behind LeetCode mediums and hards",
  outcome:
    "Recognise and solve backtracking, graph (BFS/DFS, topological sort, Dijkstra, union-find), dynamic programming, greedy and bit-manipulation problems, and explain their Big-O in an interview.",
  badge: "DP",
  color: "#f97316",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. Backtracking
    // ─────────────────────────────────────────────────────────────
    {
      slug: "backtracking",
      title: "Backtracking: choose, explore, un-choose",
      summary: "Generate every valid combination, permutation or arrangement by walking a decision tree and undoing each choice on the way back.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Some problems don't ask for *one* answer, they ask for **all** of them: every subset, every ordering, every way to place pieces on a board. There's no clever formula; you have to explore the possibilities. **Backtracking** is the disciplined way to do it: build a candidate one decision at a time, and the moment a partial candidate can't lead anywhere, step back and try the next option.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Helpers in this track",
          text: "Like on LeetCode, `ListNode` and `TreeNode` are predefined in every code block, together with `toList`, `fromList`, `toTree`, `fromTree`, `deepEqual(a, b)` and `sameMembers(a, b)` (same items in any order). The tests use them; you can too.",
        },
        { type: "h", text: "Recognise it" },
        {
          type: "list",
          items: [
            "The statement says **all**, **every**, **generate**, **list the possible**…: subsets, permutations, combinations, partitions.",
            "Constraints are tiny: `n <= 10`, `n <= 15`, a 6×6 board. Exponential output means exponential time is expected.",
            "A placement puzzle with rules (\"no two queens attack\", \"each digit once per row\"): try, check, undo.",
            "A path must be found letter by letter or cell by cell, and cells can't be reused (Word Search).",
          ],
        },
        { type: "h", text: "The template" },
        {
          type: "code",
          lang: "js",
          title: "backtracking skeleton",
          code: `function solve(input) {
  const results = [];
  const path = [];                 // the partial candidate we are building

  function backtrack(/* where we are */) {
    if (/* path is a complete answer */ false) {
      results.push([...path]);     // record a COPY
      return;
    }
    for (const choice of /* options from here */ []) {
      if (/* choice breaks a rule */ false) continue; // prune
      path.push(choice);           // 1. choose
      backtrack(/* next position */); // 2. explore
      path.pop();                  // 3. un-choose
    }
  }

  backtrack();
  return results;
}`,
        },
        {
          type: "p",
          text: "Everything interesting lives in three questions: *what are my choices at this point?*, *when is the candidate complete?*, and *which choices can I reject early?* (pruning). The `push` / recurse / `pop` rhythm guarantees that when a call returns, `path` is exactly as it was before, so the next loop iteration starts from a clean state.",
        },
        { type: "h", text: "The decision tree, step by step" },
        {
          type: "p",
          text: "Say a client can pick **2** of our 3 services `[\"web\", \"seo\", \"ads\"]` for a bundle. Every call of `backtrack(start)` is a node in a tree; `start` stops us from picking an earlier service again (so `seo+web` isn't produced after `web+seo`).",
        },
        {
          type: "steps",
          items: [
            { title: "root: path = []", text: "Choices from index 0: web, seo, ads. Choose **web**." },
            { title: "path = [web]", text: "Choices from index 1: seo, ads. Choose **seo** → path `[web, seo]` has 2 items: record it, return, **pop** seo." },
            { title: "path = [web] again", text: "Next choice: **ads** → record `[web, ads]`, pop. No choices left: return and **pop** web." },
            { title: "path = []", text: "Next choice at the root: **seo**. From index 2 only ads remains → record `[seo, ads]`, pop, pop." },
            { title: "path = [] → ads", text: "Choose **ads**: no services after it, the path can never reach 2 items. Return (a smarter version would prune this branch up front)." },
            { title: "done", text: "Results: `[web, seo]`, `[web, ads]`, `[seo, ads]`: C(3, 2) = 3 bundles, each produced exactly once." },
          ],
        },
        {
          type: "run",
          title: "combinations of k services (with a trace)",
          code: `function combine(items, k) {
  const results = [];
  const path = [];

  function backtrack(start, depth) {
    const pad = "  ".repeat(depth);
    if (path.length === k) {
      console.log(pad + "✔ record [" + path.join(", ") + "]");
      results.push([...path]);
      return;
    }
    // prune: not enough items left to fill the path
    const needed = k - path.length;
    for (let i = start; i <= items.length - needed; i++) {
      path.push(items[i]);                 // choose
      console.log(pad + "choose " + items[i] + " → [" + path.join(", ") + "]");
      backtrack(i + 1, depth + 1);         // explore
      path.pop();                          // un-choose
    }
  }

  backtrack(0, 0);
  return results;
}

const bundles = combine(["web", "seo", "ads", "crm"], 2);
console.log(bundles.length, "bundles:", bundles);`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Push a copy, not the path",
          text: "`results.push(path)` stores a reference to the *same* array you keep mutating; at the end every result is `[]`. Always `results.push([...path])` (or `path.slice()`, or `path.join(\"\")` for strings).",
        },
        { type: "h", text: "Generate-then-filter vs backtracking" },
        {
          type: "compare",
          left: {
            label: "Brute force: build everything, filter after",
            lang: "js",
            code: `// services whose prices add up exactly to the budget
function bundlesForBudget(prices, budget) {
  const all = [];
  const n = prices.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    const pick = [];
    for (let i = 0; i < n; i++)
      if (mask & (1 << i)) pick.push(prices[i]);
    all.push(pick);               // 2^n arrays built
  }
  return all.filter(
    (p) => p.reduce((a, b) => a + b, 0) === budget
  );
}
// O(n · 2^n) time AND O(n · 2^n) memory, always`,
          },
          right: {
            label: "Backtracking: prune dead branches",
            lang: "js",
            code: `function bundlesForBudget(prices, budget) {
  const sorted = [...prices].sort((a, b) => a - b);
  const results = [];
  const path = [];
  function backtrack(start, sum) {
    if (sum === budget) results.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      if (sum + sorted[i] > budget) break; // prune
      path.push(sorted[i]);
      backtrack(i + 1, sum + sorted[i]);
      path.pop();
    }
  }
  backtrack(0, 0);
  return results;
}
// O(n · 2^n) worst case, usually far less;
// O(n) extra memory besides the output`,
          },
        },
        {
          type: "p",
          text: "Backtracking doesn't change the worst case (the answer itself can be exponential), but pruning means you never build candidates that are already doomed, and you keep only *one* path in memory. Time to practise: the problems below go from the pure template to a hard constraint puzzle.",
        },
        {
          type: "challenge",
          title: "Subsets",
          difficulty: "medium",
          tags: ["backtracking", "array"],
          prompt: "Given an array `nums` of **distinct** integers, return every possible subset (the power set), including the empty subset. No duplicate subsets; the subsets can be in any order, and inside a subset keep the elements in the order they appear in `nums`.",
          examples: [
            { input: "nums = [1,2,3]", output: "[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]" },
            { input: "nums = [0]", output: "[[],[0]]" },
          ],
          constraints: ["0 <= nums.length <= 10", "all values are distinct"],
          complexity: "O(n · 2^n) time, O(n) extra space besides the output",
          starter: `function subsets(nums) {
  // your code here
}`,
          solution: `function subsets(nums) {
  const result = [];
  const path = [];
  function backtrack(start) {
    result.push([...path]);       // every node of the tree is a subset
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return result;
}`,
          tests: [
            {
              name: "[1,2,3] → all 8 subsets",
              code: "return sameMembers(subsets([1,2,3]), [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]);",
            },
            { name: "[0] → [[], [0]]", code: "return sameMembers(subsets([0]), [[],[0]]);" },
            { name: "empty array → only the empty subset", code: "return sameMembers(subsets([]), [[]]);" },
            {
              name: "10 numbers → 1024 distinct subsets",
              code: "const r = subsets([1,2,3,4,5,6,7,8,9,10]); return r.length === 1024 && new Set(r.map((s) => [...s].sort((a,b)=>a-b).join(','))).size === 1024;",
            },
          ],
          hint: "Unlike the bundle example, you don't wait for a fixed size: *every* node of the decision tree is a valid subset, so record the path at the start of each call.",
        },
        {
          type: "p",
          text: "Subsets use a `start` index because order doesn't matter: `[1,2]` and `[2,1]` are the same subset. **Permutations** are the opposite: order is the whole point. Instead of `start`, you track which elements are already *used*.",
        },
        {
          type: "challenge",
          title: "Permutations",
          difficulty: "medium",
          tags: ["backtracking", "array"],
          prompt: "Given an array `nums` of **distinct** integers, return all possible orderings (permutations). The permutations can be returned in any order.",
          examples: [
            { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
            { input: "nums = [0,1]", output: "[[0,1],[1,0]]" },
          ],
          constraints: ["1 <= nums.length <= 8", "all values are distinct"],
          complexity: "O(n · n!) time, O(n) extra space besides the output",
          starter: `function permute(nums) {
  // your code here
}`,
          solution: `function permute(nums) {
  const result = [];
  const path = [];
  const used = new Array(nums.length).fill(false);
  function backtrack() {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }
  backtrack();
  return result;
}`,
          tests: [
            {
              name: "[1,2,3] → 6 permutations",
              code: "return sameMembers(permute([1,2,3]), [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]);",
            },
            { name: "[0,1] → [[0,1],[1,0]]", code: "return sameMembers(permute([0,1]), [[0,1],[1,0]]);" },
            { name: "single element → one permutation", code: "return sameMembers(permute([7]), [[7]]);" },
            {
              name: "7 numbers → 5040 distinct permutations",
              code: "const r = permute([1,2,3,4,5,6,7]); return r.length === 5040 && new Set(r.map((p) => p.join(','))).size === 5040 && r.every((p) => p.length === 7);",
            },
          ],
          hint: "At each level, any element that isn't already in the path is a valid choice. Keep a `used` boolean array, and un-mark it when you pop.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Reuse = recurse on i, not i + 1",
          text: "In the next problem, a coin (candidate) may be used many times. The only change to the subsets template: after choosing `nums[i]`, recurse with `start = i` (you may pick it again) instead of `i + 1`. Sorting first lets you `break` as soon as a candidate overshoots the target.",
        },
        {
          type: "challenge",
          title: "Combination Sum",
          difficulty: "medium",
          tags: ["backtracking", "pruning"],
          prompt: "Given an array of **distinct** positive integers `candidates` and a positive `target`, return every unique combination of candidates whose sum is `target`. The same candidate may be used any number of times. Two combinations are the same if they use the same numbers with the same counts. Return combinations in any order (numbers inside a combination in any order too).",
          examples: [
            { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
            { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" },
            { input: "candidates = [2], target = 1", output: "[]" },
          ],
          constraints: ["1 <= candidates.length <= 30", "1 <= candidates[i] <= 40", "1 <= target <= 40"],
          complexity: "O(n^(t/m)) time in the worst case (t = target, m = smallest candidate), O(t/m) recursion depth",
          starter: `function combinationSum(candidates, target) {
  // your code here
}`,
          solution: `function combinationSum(candidates, target) {
  const nums = [...candidates].sort((a, b) => a - b);
  const result = [];
  const path = [];
  function backtrack(start, remaining) {
    if (remaining === 0) {
      result.push([...path]);
      return;
    }
    for (let i = start; i < nums.length; i++) {
      if (nums[i] > remaining) break;      // sorted: every later one is too big too
      path.push(nums[i]);
      backtrack(i, remaining - nums[i]);   // i, not i + 1: reuse allowed
      path.pop();
    }
  }
  backtrack(0, target);
  return result;
}`,
          tests: [
            {
              name: "[2,3,6,7], 7 → [[2,2,3],[7]]",
              code: "const norm = (r) => r.map((c) => [...c].sort((a,b)=>a-b)); return sameMembers(norm(combinationSum([2,3,6,7], 7)), [[2,2,3],[7]]);",
            },
            {
              name: "[2,3,5], 8 → [[2,2,2,2],[2,3,3],[3,5]]",
              code: "const norm = (r) => r.map((c) => [...c].sort((a,b)=>a-b)); return sameMembers(norm(combinationSum([2,3,5], 8)), [[2,2,2,2],[2,3,3],[3,5]]);",
            },
            { name: "no combination possible → []", code: "const r = combinationSum([2], 1); return Array.isArray(r) && r.length === 0;" },
            {
              name: "unsorted input, no duplicates like [2,3,2] and [3,2,2]",
              code: "const r = combinationSum([7,3,2], 18).map((c) => [...c].sort((a,b)=>a-b).join(',')); return r.length === 7 && new Set(r).size === 7;",
            },
          ],
          hint: "Sort the candidates, keep a `start` index so you never go back to a smaller candidate (that's what kills duplicates), and recurse with the same `i` to allow reuse.",
        },
        {
          type: "p",
          text: "The choices at each level don't have to come from one array. In the next problem, the choices at position `i` are the letters printed on the `i`-th phone key, and the candidate is complete when it has one letter per digit.",
        },
        {
          type: "challenge",
          title: "Letter Combinations of a Phone Number",
          difficulty: "medium",
          tags: ["backtracking", "string"],
          prompt: "On an old phone keypad, `2` maps to `abc`, `3` to `def`, `4` to `ghi`, `5` to `jkl`, `6` to `mno`, `7` to `pqrs`, `8` to `tuv` and `9` to `wxyz`. Given a string `digits` (only `2`–`9`), return every letter string it could represent, in any order. An empty input returns `[]`.",
          examples: [
            { input: "digits = \"23\"", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]" },
            { input: "digits = \"\"", output: "[]" },
            { input: "digits = \"2\"", output: "[\"a\",\"b\",\"c\"]" },
          ],
          constraints: ["0 <= digits.length <= 4", "digits[i] is in '2'..'9'"],
          complexity: "O(4^n · n) time, O(n) recursion depth",
          starter: `function letterCombinations(digits) {
  // your code here
}`,
          solution: `function letterCombinations(digits) {
  if (digits.length === 0) return [];
  const keys = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };
  const result = [];
  const path = [];
  function backtrack(i) {
    if (i === digits.length) {
      result.push(path.join(""));
      return;
    }
    for (const letter of keys[digits[i]]) {
      path.push(letter);
      backtrack(i + 1);
      path.pop();
    }
  }
  backtrack(0);
  return result;
}`,
          tests: [
            {
              name: "\"23\" → 9 combinations",
              code: "return sameMembers(letterCombinations('23'), ['ad','ae','af','bd','be','bf','cd','ce','cf']);",
            },
            { name: "empty string → []", code: "const r = letterCombinations(''); return Array.isArray(r) && r.length === 0;" },
            { name: "\"2\" → [a, b, c]", code: "return sameMembers(letterCombinations('2'), ['a','b','c']);" },
            {
              name: "\"79\" uses the 4-letter keys → 16 combinations",
              code: "const r = letterCombinations('79'); return r.length === 16 && r.includes('pw') && r.includes('sz') && new Set(r).size === 16;",
            },
          ],
          hint: "Position `i` of the path picks one letter from the key for `digits[i]`. When `i === digits.length`, join the path into a string and record it.",
        },
        {
          type: "p",
          text: "So far, every branch led to a valid answer. In **Generate Parentheses**, most branches are invalid, and the art is to never enter them: you may add `(` while you still have some left, and `)` only if it closes something already open. Pruning *by construction* beats generating all 2^(2n) strings and checking them.",
        },
        {
          type: "challenge",
          title: "Generate Parentheses",
          difficulty: "medium",
          tags: ["backtracking", "string", "pruning"],
          prompt: "Given `n` pairs of parentheses, return every string of `n` opening and `n` closing parentheses that is **well-formed** (every `)` closes an earlier `(`). Any order.",
          examples: [
            { input: "n = 3", output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]" },
            { input: "n = 1", output: "[\"()\"]" },
          ],
          constraints: ["1 <= n <= 8"],
          complexity: "O(4^n / √n) time (the n-th Catalan number of results), O(n) depth",
          starter: `function generateParenthesis(n) {
  // your code here
}`,
          solution: `function generateParenthesis(n) {
  const result = [];
  const path = [];
  function backtrack(open, close) {
    if (path.length === 2 * n) {
      result.push(path.join(""));
      return;
    }
    if (open < n) {
      path.push("(");
      backtrack(open + 1, close);
      path.pop();
    }
    if (close < open) {
      path.push(")");
      backtrack(open, close + 1);
      path.pop();
    }
  }
  backtrack(0, 0);
  return result;
}`,
          tests: [
            {
              name: "n = 3 → 5 strings",
              code: "return sameMembers(generateParenthesis(3), ['((()))','(()())','(())()','()(())','()()()']);",
            },
            { name: "n = 1 → [\"()\"]", code: "return sameMembers(generateParenthesis(1), ['()']);" },
            {
              name: "n = 4 → 14 distinct well-formed strings",
              code: "const r = generateParenthesis(4); const ok = (s) => { let d = 0; for (const c of s) { d += c === '(' ? 1 : -1; if (d < 0) return false; } return d === 0 && s.length === 8; }; return r.length === 14 && new Set(r).size === 14 && r.every(ok);",
            },
            { name: "n = 8 → 1430 strings (Catalan number)", code: "return generateParenthesis(8).length === 1430;" },
          ],
          hint: "Track how many `(` and `)` you've used. Adding `(` is legal while `open < n`; adding `)` is legal while `close < open`.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Backtracking on a grid",
          text: "In Word Search the \"path\" is a sequence of cells. *Choose* = mark the cell as used (overwrite it with `#`), *explore* = try the 4 neighbours for the next letter, *un-choose* = put the original letter back. Restoring the board is the backtracking step; forget it and later starting points see a corrupted grid.",
        },
        {
          type: "challenge",
          title: "Word Search",
          difficulty: "medium",
          tags: ["backtracking", "grid", "dfs"],
          prompt: "Given an `m × n` grid of letters `board` and a string `word`, return `true` if `word` can be spelled by a path of horizontally or vertically adjacent cells, using each cell at most once. Otherwise return `false`.",
          examples: [
            { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" },
            { input: "same board, word = \"SEE\"", output: "true" },
            { input: "same board, word = \"ABCB\"", output: "false", explanation: "the path would have to reuse the B" },
          ],
          constraints: ["1 <= m, n <= 6", "1 <= word.length <= 15", "letters only"],
          complexity: "O(m · n · 3^L) time (L = word length), O(L) recursion depth",
          starter: `function exist(board, word) {
  // your code here
}`,
          solution: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (board[r][c] !== word[i]) return false;
    const saved = board[r][c];
    board[r][c] = "#";                        // choose: mark as used
    const found =
      dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = saved;                      // un-choose: restore
    return found;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,
          tests: [
            {
              name: "\"ABCCED\" is on the board → true",
              code: "const b = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]; return exist(b, 'ABCCED') === true;",
            },
            {
              name: "\"SEE\" is on the board → true",
              code: "const b = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]; return exist(b, 'SEE') === true;",
            },
            {
              name: "\"ABCB\" would reuse a cell → false",
              code: "const b = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]; return exist(b, 'ABCB') === false;",
            },
            {
              name: "a cell can't be used twice: [[a,a]] cannot spell \"aaa\"",
              code: "return exist([['a','a']], 'aaa') === false && exist([['a','a']], 'aa') === true;",
            },
            {
              name: "the board is restored after searching",
              code: "const b = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]; exist(b, 'ABCB'); exist(b, 'ABCCED'); return deepEqual(b, [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']]);",
            },
          ],
          hint: "Write `dfs(r, c, i)`: does `word.slice(i)` start at cell (r, c)? Check bounds and the letter, mark the cell, recurse into the 4 neighbours with `i + 1`, then restore the cell.",
        },
        {
          type: "p",
          text: "Last one, a classic hard. The key insight is how to check \"is this square attacked?\" in **O(1)**: queens on the same column share `c`, on the same `\\` diagonal share `r - c`, and on the same `/` diagonal share `r + c`. Keep three `Set`s and place one queen per row.",
        },
        {
          type: "challenge",
          title: "N-Queens (count the solutions)",
          difficulty: "hard",
          tags: ["backtracking", "hash set"],
          prompt: "Place `n` chess queens on an `n × n` board so that no two attack each other (no two share a row, a column or a diagonal). Return the **number** of distinct ways to do it.",
          examples: [
            { input: "n = 4", output: "2" },
            { input: "n = 1", output: "1" },
            { input: "n = 3", output: "0", explanation: "every placement has two queens on a diagonal" },
          ],
          constraints: ["1 <= n <= 10"],
          complexity: "O(n!) time in the worst case, O(n) space",
          starter: `function totalNQueens(n) {
  // your code here
}`,
          solution: `function totalNQueens(n) {
  const cols = new Set();
  const diag = new Set();      // r - c
  const anti = new Set();      // r + c
  let count = 0;
  function place(r) {
    if (r === n) {
      count++;
      return;
    }
    for (let c = 0; c < n; c++) {
      if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
      cols.add(c); diag.add(r - c); anti.add(r + c);
      place(r + 1);
      cols.delete(c); diag.delete(r - c); anti.delete(r + c);
    }
  }
  place(0);
  return count;
}`,
          tests: [
            { name: "n = 4 → 2", code: "return totalNQueens(4) === 2;" },
            { name: "n = 1 → 1 (a single queen)", code: "return totalNQueens(1) === 1;" },
            { name: "n = 2 and n = 3 → 0", code: "return totalNQueens(2) === 0 && totalNQueens(3) === 0;" },
            { name: "n = 8 → 92 (the classic chessboard)", code: "return totalNQueens(8) === 92;" },
            { name: "n = 10 → 724, fast thanks to O(1) attack checks", code: "const t0 = performance.now(); return totalNQueens(10) === 724 && performance.now() - t0 < 1000;" },
          ],
          hint: "One queen per row: `place(r)` tries every column `c` of row `r`. A square is safe if `c`, `r - c` and `r + c` are all absent from their sets. Add, recurse, delete.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Where you'll meet this outside LeetCode",
          text: "Backtracking is how a scheduling feature finds a valid booking grid (\"3 consultants, 5 slots, nobody double-booked\"), how a form builder enumerates variant combinations (a Shopify product with sizes × colours × materials is literally the cartesian product), and how a test generator lists every combination of feature flags. Keep inputs small: exponential is fine at n = 10, fatal at n = 40.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Why do backtracking solutions call `path.pop()` after the recursive call?",
              options: [
                "To free memory early",
                "To restore the state so the next choice starts from the same partial candidate",
                "Because JavaScript arrays can't hold more than n items",
                "To avoid recording duplicate results",
              ],
              answer: 1,
              why: "The un-choose step undoes the choose step, so when the call returns, the shared `path` is back to how it was and the loop can try the next option.",
            },
            {
              q: "What is the time complexity of generating all subsets of n elements?",
              options: ["O(n²)", "O(n log n)", "O(2^n)", "O(n · 2^n)"],
              answer: 3,
              why: "There are 2^n subsets and copying each one into the result costs up to O(n).",
            },
            {
              q: "A problem says \"return all ways to split the string into dictionary words\" and `s.length <= 20`. Which pattern fits first?",
              options: ["Backtracking", "Sliding window", "Binary search", "Union-find"],
              answer: 0,
              why: "\"Return all ways\" means enumerating every valid candidate: that's backtracking (often with memoization if only a count is needed).",
            },
            {
              q: "In Combination Sum, what does recursing with `start = i` instead of `i + 1` allow?",
              options: [
                "Returning combinations in sorted order",
                "Using the same candidate more than once",
                "Skipping duplicate candidates",
                "Stopping when the sum exceeds the target",
              ],
              answer: 1,
              why: "Staying at index `i` lets the next level pick the same number again; moving to `i + 1` would allow each number only once.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Graphs: representation & traversal
    // ─────────────────────────────────────────────────────────────
    {
      slug: "graph-traversal",
      title: "Graphs: representation & traversal",
      summary: "Turn edge lists and grids into adjacency lists, then explore them with BFS and DFS without visiting anything twice.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "A **graph** is a set of things (*nodes* or *vertices*) and connections between them (*edges*). Clients referring other clients, pages linking to pages, npm packages depending on packages, cells in a grid touching their neighbours: all graphs. Edges can be **undirected** (A–B goes both ways, like a friendship) or **directed** (A → B, like \"A depends on B\"), and **weighted** (a cost or distance) or not.",
        },
        { type: "h", text: "Recognise it" },
        {
          type: "list",
          items: [
            "Input is a list of pairs: `edges = [[0,1],[1,2]]`, `prerequisites`, `flights`, `tickets`, `[from, to, cost]`.",
            "Words like **connected**, **reachable**, **islands**, **regions**, **network**, **spread**, **neighbours**.",
            "A 2D grid where you move up/down/left/right: each cell is a node, each move is an edge.",
            "Objects that point at each other (`node.neighbors`) and you must copy or explore them.",
          ],
        },
        { type: "h", text: "Step 1: build an adjacency list" },
        {
          type: "p",
          text: "Problems usually hand you an **edge list**. Scanning that list every time you need a node's neighbours is slow, so the first move is almost always to build an **adjacency list**: for each node, the array of nodes it connects to.",
        },
        {
          type: "table",
          rows: [
            ["Representation", "Memory", "Neighbours of v", "Is (u, v) an edge?", "Use when"],
            ["Edge list `[[u, v], …]`", "O(E)", "O(E) scan", "O(E)", "it's the input format; Kruskal / union-find"],
            ["Adjacency list `adj[u] = [v, …]`", "O(V + E)", "O(deg v)", "O(deg u)", "almost always (BFS, DFS, topo sort)"],
            ["Adjacency matrix `m[u][v]`", "O(V²)", "O(V)", "O(1)", "small dense graphs, V ≤ ~1000"],
          ],
        },
        {
          type: "code",
          lang: "js",
          title: "edge list → adjacency list",
          code: `// n nodes labelled 0..n-1, undirected edges
const adj = Array.from({ length: n }, () => []);
for (const [u, v] of edges) {
  adj[u].push(v);
  adj[v].push(u);   // drop this line for a directed graph
}

// labels that aren't 0..n-1 (emails, slugs…)? use a Map
const graph = new Map();
for (const [u, v] of edges) {
  if (!graph.has(u)) graph.set(u, []);
  if (!graph.has(v)) graph.set(v, []);
  graph.get(u).push(v);
  graph.get(v).push(u);
}`,
        },
        { type: "h", text: "Step 2: BFS and DFS" },
        {
          type: "p",
          text: "**BFS** (breadth-first search) uses a **queue**: it visits the start, then everything 1 edge away, then 2 edges away… like ripples. **DFS** (depth-first search) uses a **stack** (or recursion, which is the call stack): it follows one path as deep as possible before backing up. Both visit every reachable node once, in **O(V + E)**, as long as you keep a `visited` set.",
        },
        {
          type: "p",
          text: "Trace of BFS from node `0` on the edges `0–1, 0–2, 1–3, 2–3, 3–4`:",
        },
        {
          type: "table",
          rows: [
            ["Step", "Dequeue", "New neighbours enqueued", "Queue after", "Visited"],
            ["0", "–", "start: 0", "[0]", "{0}"],
            ["1", "0", "1, 2", "[1, 2]", "{0,1,2}"],
            ["2", "1", "3 (0 already seen)", "[2, 3]", "{0,1,2,3}"],
            ["3", "2", "none (0 and 3 seen)", "[3]", "{0,1,2,3}"],
            ["4", "3", "4", "[4]", "{0,1,2,3,4}"],
            ["5", "4", "none", "[]", "done"],
          ],
        },
        {
          type: "run",
          title: "BFS and DFS (iterative and recursive) on the same graph",
          code: `const n = 5;
const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
const adj = Array.from({ length: n }, () => []);
for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
console.log("adjacency list:", adj);

function bfs(start) {
  const order = [];
  const visited = new Set([start]);  // mark when ENQUEUED
  const queue = [start];
  let head = 0;                      // index pointer: O(1) dequeue
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const next of adj[node]) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return order;
}

function dfsRecursive(node, visited = new Set(), order = []) {
  visited.add(node);
  order.push(node);
  for (const next of adj[node]) {
    if (!visited.has(next)) dfsRecursive(next, visited, order);
  }
  return order;
}

function dfsIterative(start) {
  const order = [];
  const visited = new Set();
  const stack = [start];
  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) continue;   // may be pushed twice: skip
    visited.add(node);
    order.push(node);
    // push in reverse so we visit neighbours in list order
    for (let i = adj[node].length - 1; i >= 0; i--) {
      if (!visited.has(adj[node][i])) stack.push(adj[node][i]);
    }
  }
  return order;
}

console.log("BFS from 0:          ", bfs(0));
console.log("DFS recursive from 0:", dfsRecursive(0));
console.log("DFS iterative from 0:", dfsIterative(0));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Two classic BFS bugs",
          text: "1) Marking a node visited when you *dequeue* it instead of when you *enqueue* it: the same node gets queued many times (correct but slow, sometimes exponentially). 2) `queue.shift()` is O(n) on big arrays in the worst case; use a `head` index pointer like above when the queue can hold tens of thousands of items.",
        },
        { type: "h", text: "Grids are graphs" },
        {
          type: "p",
          text: "A grid problem rarely says \"graph\", but each cell `(r, c)` is a node whose neighbours are `(r+1, c)`, `(r-1, c)`, `(r, c+1)`, `(r, c-1)` when they're inside the grid. You don't build an adjacency list; you compute neighbours on the fly with a directions array. And instead of a `visited` set you can often **mutate the grid** (turn `\"1\"` into `\"0\"`) when the problem allows it.",
        },
        {
          type: "code",
          lang: "js",
          title: "grid neighbours",
          code: `const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
for (const [dr, dc] of DIRS) {
  const nr = r + dr, nc = c + dc;
  if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue; // off the grid
  // ...visit (nr, nc)
}`,
        },
        { type: "h", text: "Brute force vs adjacency list" },
        {
          type: "compare",
          left: {
            label: "Scan the edge list for every node",
            lang: "js",
            code: `function reachable(n, edges, start) {
  const seen = new Set([start]);
  const queue = [start];
  while (queue.length) {
    const node = queue.shift();
    for (const [u, v] of edges) {      // whole list, every time
      const next = u === node ? v : v === node ? u : -1;
      if (next !== -1 && !seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen.size;
}
// O(V · E) time`,
          },
          right: {
            label: "Build adjacency once, then BFS",
            lang: "js",
            code: `function reachable(n, edges, start) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const seen = new Set([start]);
  const queue = [start];
  for (let h = 0; h < queue.length; h++) {
    for (const next of adj[queue[h]]) {
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return seen.size;
}
// O(V + E) time, O(V + E) space`,
          },
        },
        {
          type: "p",
          text: "Let's start with the gentlest grid traversal: change the colour of a connected region, like the paint-bucket tool in Figma.",
        },
        {
          type: "challenge",
          title: "Flood Fill",
          difficulty: "easy",
          tags: ["grid", "bfs", "dfs"],
          prompt: "An image is an `m × n` grid of integers (pixel colours). Starting from pixel `(sr, sc)`, recolour that pixel and every pixel connected to it **4-directionally** that has the same original colour, to `color`. Return the modified image.",
          examples: [
            { input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2", output: "[[2,2,2],[2,2,0],[2,0,1]]", explanation: "the bottom-right 1 isn't connected to the start" },
            { input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0", output: "[[0,0,0],[0,0,0]]" },
          ],
          constraints: ["1 <= m, n <= 50", "0 <= colours < 2^16"],
          complexity: "O(m · n) time, O(m · n) space for the queue",
          starter: `function floodFill(image, sr, sc, color) {
  // your code here
}`,
          solution: `function floodFill(image, sr, sc, color) {
  const original = image[sr][sc];
  if (original === color) return image;   // nothing to do (and avoids an infinite loop)
  const rows = image.length, cols = image[0].length;
  const queue = [[sr, sc]];
  image[sr][sc] = color;
  for (let h = 0; h < queue.length; h++) {
    const [r, c] = queue[h];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= rows || nc >= cols) continue;
      if (image[nr][nc] !== original) continue;
      image[nr][nc] = color;              // recolouring doubles as "visited"
      queue.push([nr, nc]);
    }
  }
  return image;
}`,
          tests: [
            {
              name: "example 1: diagonal pixel stays untouched",
              code: "return deepEqual(floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2), [[2,2,2],[2,2,0],[2,0,1]]);",
            },
            {
              name: "new colour equals old colour → unchanged (no infinite loop)",
              code: "return deepEqual(floodFill([[0,0,0],[0,0,0]], 0, 0, 0), [[0,0,0],[0,0,0]]);",
            },
            { name: "single pixel", code: "return deepEqual(floodFill([[5]], 0, 0, 9), [[9]]);" },
            {
              name: "only the connected region changes",
              code: "return deepEqual(floodFill([[3,3,0,3],[0,3,0,3],[3,0,0,3]], 0, 0, 7), [[7,7,0,3],[0,7,0,3],[3,0,0,3]]);",
            },
          ],
          hint: "Remember the starting colour, then BFS or DFS from `(sr, sc)` into neighbours that still have that colour. Recolouring a pixel marks it as visited. What if `color` already equals the starting colour?",
        },
        {
          type: "p",
          text: "Now the most famous grid problem. The trick: loop over every cell; each time you find unvisited land, that's a **new island**: count it, then flood-fill it so you never count its cells again. It's Flood Fill inside a loop.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Recursion depth on big grids",
          text: "A recursive DFS on a 300×300 grid that is all land can go 90,000 calls deep. LeetCode's JavaScript runtime usually survives that; a browser or a Web Worker may throw `RangeError: Maximum call stack size exceeded`. An explicit stack or queue never has that problem, which is why the reference solutions here are iterative.",
        },
        {
          type: "challenge",
          title: "Number of Islands",
          difficulty: "medium",
          tags: ["grid", "bfs", "dfs"],
          prompt: "Given an `m × n` grid of strings where `\"1\"` is land and `\"0\"` is water, return the number of islands. An island is a group of land cells connected horizontally or vertically (not diagonally). Everything outside the grid is water. You may modify the grid.",
          examples: [
            { input: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]", output: "1" },
            { input: "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", output: "3" },
          ],
          constraints: ["1 <= m, n <= 300", "grid[i][j] is \"0\" or \"1\""],
          complexity: "O(m · n) time, O(m · n) space in the worst case",
          starter: `function numIslands(grid) {
  // your code here
}`,
          solution: `function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let islands = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== "1") continue;
      islands++;
      grid[r][c] = "0";                 // sink it so we never count it again
      const stack = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop();
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] !== "1") continue;
          grid[nr][nc] = "0";
          stack.push([nr, nc]);
        }
      }
    }
  }
  return islands;
}`,
          tests: [
            {
              name: "example 1: one big island",
              code: "return numIslands([['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]) === 1;",
            },
            {
              name: "example 2: three islands",
              code: "return numIslands([['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]) === 3;",
            },
            { name: "all water → 0", code: "return numIslands([['0','0'],['0','0']]) === 0;" },
            { name: "diagonal land cells are separate islands", code: "return numIslands([['1','0'],['0','1']]) === 2 && numIslands([['1']]) === 1;" },
            {
              name: "200×200 checkerboard → 20,000 islands, fast",
              code: "const g = Array.from({length: 200}, (_, r) => Array.from({length: 200}, (_, c) => (r + c) % 2 === 0 ? '1' : '0')); const t0 = performance.now(); return numIslands(g) === 20000 && performance.now() - t0 < 500;",
            },
          ],
          hint: "Scan every cell. On a `\"1\"`, increment the count and sink the whole island (turn its cells into `\"0\"`) with a BFS/DFS so the scan never counts it again.",
        },
        {
          type: "p",
          text: "Same traversal, different question: instead of counting islands, **measure** each one while you sink it and keep the maximum. Whatever the traversal visits can be counted, summed or collected.",
        },
        {
          type: "challenge",
          title: "Max Area of Island",
          difficulty: "medium",
          tags: ["grid", "dfs"],
          prompt: "Given an `m × n` grid of numbers where `1` is land and `0` is water, return the area (number of cells) of the largest island (4-directionally connected land). Return `0` if there is no land.",
          examples: [
            { input: "grid = [[1,1,0,0],[1,0,0,1],[0,0,1,1],[0,0,1,1]]", output: "5", explanation: "the bottom-right island has 5 cells" },
            { input: "grid = [[0,0,0]]", output: "0" },
          ],
          constraints: ["1 <= m, n <= 50"],
          complexity: "O(m · n) time and space",
          starter: `function maxAreaOfIsland(grid) {
  // your code here
}`,
          solution: `function maxAreaOfIsland(grid) {
  const rows = grid.length, cols = grid[0].length;
  let best = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== 1) continue;
      let area = 0;
      grid[r][c] = 0;
      const stack = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop();
        area++;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = cr + dr, nc = cc + dc;
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] !== 1) continue;
          grid[nr][nc] = 0;
          stack.push([nr, nc]);
        }
      }
      best = Math.max(best, area);
    }
  }
  return best;
}`,
          tests: [
            { name: "largest of three islands is 5", code: "return maxAreaOfIsland([[1,1,0,0],[1,0,0,1],[0,0,1,1],[0,0,1,1]]) === 5;" },
            { name: "no land → 0", code: "return maxAreaOfIsland([[0,0,0]]) === 0;" },
            { name: "the whole grid is one island", code: "return maxAreaOfIsland([[1,1],[1,1]]) === 4;" },
            {
              name: "diagonals don't connect",
              code: "return maxAreaOfIsland([[1,0,1],[0,1,0],[1,0,1]]) === 1;",
            },
          ],
          hint: "Copy your Number of Islands loop; while sinking an island, count how many cells you pop. Keep the max.",
        },
        {
          type: "p",
          text: "Traversal isn't only for counting; it's how you **copy** a graph. The key structure is a map from *old node* to *new copy*: it doubles as your visited set and stops you from copying a node twice when there are cycles.",
        },
        {
          type: "challenge",
          title: "Clone Graph (adjacency list version)",
          difficulty: "medium",
          tags: ["graph", "bfs", "hash map"],
          prompt: "A referral network is given as a `Map` from a client id to the array of client ids it is connected to. Return a **new** `Map` containing only the clients reachable from `start` (including `start`), each with a **new** array of its neighbours (same ids, same order). The original map and its arrays must not be shared with or modified by the copy.",
          examples: [
            { input: "graph = {1: [2, 4], 2: [1, 3], 3: [2, 4], 4: [1, 3], 5: [6], 6: [5]}, start = 1", output: "{1: [2, 4], 2: [1, 3], 3: [2, 4], 4: [1, 3]}", explanation: "5 and 6 are not reachable from 1" },
            { input: "graph = {7: []}, start = 7", output: "{7: []}" },
          ],
          constraints: ["0 <= number of clients <= 100", "neighbour lists are symmetric (undirected)", "start is a key of graph"],
          complexity: "O(V + E) time and space",
          starter: `function cloneGraph(graph, start) {
  // your code here
}`,
          solution: `function cloneGraph(graph, start) {
  const copy = new Map();
  const queue = [start];
  copy.set(start, [...graph.get(start)]);
  for (let h = 0; h < queue.length; h++) {
    for (const next of graph.get(queue[h])) {
      if (copy.has(next)) continue;      // the copy map is our visited set
      copy.set(next, [...graph.get(next)]);
      queue.push(next);
    }
  }
  return copy;
}`,
          tests: [
            {
              name: "copies only the reachable component",
              code: "const g = new Map([[1,[2,4]],[2,[1,3]],[3,[2,4]],[4,[1,3]],[5,[6]],[6,[5]]]); return deepEqual(cloneGraph(g, 1), new Map([[1,[2,4]],[2,[1,3]],[3,[2,4]],[4,[1,3]]]));",
            },
            { name: "single client with no connections", code: "return deepEqual(cloneGraph(new Map([[7, []]]), 7), new Map([[7, []]]));" },
            {
              name: "neighbour arrays are new arrays, not shared",
              code: "const g = new Map([[1,[2]],[2,[1]]]); const c = cloneGraph(g, 1); c.get(1).push(99); return c.get(1) !== g.get(1) && c.get(2) !== g.get(2) && deepEqual(g.get(1), [2]);",
            },
            {
              name: "cycles don't loop forever: 3-node triangle",
              code: "const g = new Map([['a',['b','c']],['b',['a','c']],['c',['a','b']]]); const c = cloneGraph(g, 'b'); return c.size === 3 && deepEqual(c.get('c'), ['a','b']);",
            },
          ],
          hint: "BFS from `start`. Use the result `Map` itself as the visited check: before enqueueing a neighbour, see whether it already has a copy. Copy arrays with `[...arr]`.",
        },
        {
          type: "p",
          text: "Sometimes the BFS has **several starting points at once**. In Rotting Oranges, every rotten orange infects its neighbours each minute. Put *all* rotten oranges in the queue at time 0 and process the queue level by level: each level is one minute. That's **multi-source BFS**.",
        },
        {
          type: "challenge",
          title: "Rotting Oranges",
          difficulty: "medium",
          tags: ["grid", "bfs", "multi-source"],
          prompt: "In an `m × n` grid, `0` is an empty cell, `1` a fresh orange and `2` a rotten orange. Every minute, each fresh orange 4-directionally adjacent to a rotten one becomes rotten. Return the minimum number of minutes until no fresh orange is left, or `-1` if some fresh orange can never rot.",
          examples: [
            { input: "grid = [[2,1,1],[1,1,0],[0,1,1]]", output: "4" },
            { input: "grid = [[2,1,1],[0,1,1],[1,0,1]]", output: "-1", explanation: "the bottom-left orange is never reached" },
            { input: "grid = [[0,2]]", output: "0", explanation: "no fresh orange at minute 0" },
          ],
          constraints: ["1 <= m, n <= 200", "grid[i][j] is 0, 1 or 2"],
          complexity: "O(m · n) time and space",
          starter: `function orangesRotting(grid) {
  // your code here
}`,
          solution: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  let queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);   // every source at minute 0
      else if (grid[r][c] === 1) fresh++;
    }
  let minutes = 0;
  while (queue.length && fresh > 0) {
    const nextLevel = [];
    for (const [r, c] of queue) {
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2;
        fresh--;
        nextLevel.push([nr, nc]);
      }
    }
    queue = nextLevel;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,
          tests: [
            { name: "example 1 → 4 minutes", code: "return orangesRotting([[2,1,1],[1,1,0],[0,1,1]]) === 4;" },
            { name: "unreachable fresh orange → -1", code: "return orangesRotting([[2,1,1],[0,1,1],[1,0,1]]) === -1;" },
            { name: "no fresh oranges → 0", code: "return orangesRotting([[0,2]]) === 0 && orangesRotting([[0]]) === 0;" },
            { name: "two sources spread at the same time: [[2,1,1,1,2]] → 2", code: "return orangesRotting([[2,1,1,1,2]]) === 2;" },
            { name: "fresh orange with no rotten one at all → -1", code: "return orangesRotting([[1]]) === -1;" },
            {
              name: "200×200 grid rotting from one corner → 398 minutes, fast",
              code: "const g = Array.from({length: 200}, () => new Array(200).fill(1)); g[0][0] = 2; const t0 = performance.now(); return orangesRotting(g) === 398 && performance.now() - t0 < 500;",
            },
          ],
          hint: "Count the fresh oranges and enqueue every rotten one. Process the queue one level (one minute) at a time; each newly rotten orange decrements the fresh count. At the end, fresh must be 0.",
        },
        {
          type: "p",
          text: "Final grid problem, and a great example of **thinking backwards**. Asking \"can water from this cell reach the ocean?\" for every cell means one search per cell: O((m·n)²). Instead, start *from the oceans* and walk **uphill** (to neighbours that are at least as high). Every cell you reach can drain to that ocean. Do it once per ocean and intersect.",
        },
        {
          type: "challenge",
          title: "Pacific Atlantic Water Flow",
          difficulty: "medium",
          tags: ["grid", "bfs", "reverse search"],
          prompt: "An island is an `m × n` grid of heights. The **Pacific** touches the top and left edges, the **Atlantic** the bottom and right edges. Rain water flows from a cell to a 4-directional neighbour whose height is **less than or equal** to it, and from edge cells into the adjacent ocean. Return the coordinates `[r, c]` of every cell from which water can reach **both** oceans, in any order.",
          examples: [
            {
              input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
              output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
            },
            { input: "heights = [[1]]", output: "[[0,0]]" },
          ],
          constraints: ["1 <= m, n <= 200", "0 <= heights[r][c] <= 10^5"],
          complexity: "O(m · n) time and space",
          starter: `function pacificAtlantic(heights) {
  // your code here
}`,
          solution: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  function reach(starts) {
    const seen = Array.from({ length: rows }, () => new Array(cols).fill(false));
    const queue = [];
    for (const [r, c] of starts) {
      if (!seen[r][c]) { seen[r][c] = true; queue.push([r, c]); }
    }
    for (let h = 0; h < queue.length; h++) {
      const [r, c] = queue[h];
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || seen[nr][nc]) continue;
        if (heights[nr][nc] < heights[r][c]) continue;  // water can't flow up to us
        seen[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
    return seen;
  }
  const pacificStarts = [], atlanticStarts = [];
  for (let r = 0; r < rows; r++) { pacificStarts.push([r, 0]); atlanticStarts.push([r, cols - 1]); }
  for (let c = 0; c < cols; c++) { pacificStarts.push([0, c]); atlanticStarts.push([rows - 1, c]); }
  const pac = reach(pacificStarts), atl = reach(atlanticStarts);
  const result = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (pac[r][c] && atl[r][c]) result.push([r, c]);
  return result;
}`,
          tests: [
            {
              name: "example 1: 7 cells reach both oceans",
              code: "return sameMembers(pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]), [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]);",
            },
            { name: "single cell touches both oceans", code: "return sameMembers(pacificAtlantic([[1]]), [[0,0]]);" },
            {
              name: "a valley in the middle drains nowhere useful",
              code: "return sameMembers(pacificAtlantic([[3,3,3],[3,1,3],[3,3,3]]), [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]);",
            },
            {
              name: "200×200 flat island → every cell, fast (one search per ocean)",
              code: "const g = Array.from({length: 200}, () => new Array(200).fill(7)); const t0 = performance.now(); const r = pacificAtlantic(g); return r.length === 40000 && performance.now() - t0 < 500;",
            },
          ],
          hint: "Run two BFS: one seeded with every Pacific edge cell, one with every Atlantic edge cell. From a cell, move to neighbours that are **higher or equal** (reverse of water flow). Return the cells both searches reached.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Graphs in your stack",
          text: "Your bundler (Turbopack in Next.js) builds a **module graph** from `import` edges and walks it with DFS to find what to ship to the client; `\"use client\"` marks where the walk crosses the server/client boundary. Postgres foreign keys in Supabase form a graph too: following `client → projects → invoices` is a traversal. And `structuredClone` copying an object with circular references uses exactly the \"map from original to copy\" trick from Clone Graph.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What is the time complexity of BFS or DFS over an adjacency list?",
              options: ["O(V²)", "O(V + E)", "O(E log V)", "O(V · E)"],
              answer: 1,
              why: "Each vertex is visited once and each edge is looked at once (twice for undirected): O(V + E).",
            },
            {
              q: "In BFS, when should a node be marked visited to avoid enqueueing it several times?",
              options: ["When it is dequeued", "When the search ends", "When it is enqueued", "It doesn't matter"],
              answer: 2,
              why: "Marking on enqueue guarantees each node enters the queue at most once. Marking on dequeue lets several neighbours enqueue the same node before it's processed.",
            },
            {
              q: "Rotting Oranges starts from every rotten orange at once. What is this technique called?",
              options: ["Bidirectional search", "Topological sort", "Backtracking", "Multi-source BFS"],
              answer: 3,
              why: "Seeding the queue with all sources at distance 0 gives, for each cell, the distance to the *nearest* source in a single O(m·n) pass.",
            },
            {
              q: "Why does Pacific Atlantic search from the oceans instead of from each cell?",
              options: [
                "Two searches of O(m·n) beat m·n searches of O(m·n) each",
                "Water can only flow downhill",
                "BFS doesn't work from inner cells",
                "To use less memory per cell",
              ],
              answer: 0,
              why: "Reversing the direction turns m·n separate searches (O((m·n)²)) into two multi-source searches (O(m·n)).",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 3. Graphs: shortest paths & ordering
    // ─────────────────────────────────────────────────────────────
    {
      slug: "graph-shortest-paths",
      title: "Graphs: shortest paths & ordering",
      summary: "BFS for shortest paths in unweighted graphs, Kahn's algorithm for dependency order and cycle detection, Dijkstra when edges have weights.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Traversal answers \"what can I reach?\". This lesson answers the two follow-up questions interviews love: \"**how far** is it?\" (shortest path) and \"**in what order** can I do these things?\" (topological sort). Both are small twists on the BFS you already know.",
        },
        { type: "h", text: "Recognise it" },
        {
          type: "table",
          rows: [
            ["Signal in the statement", "Tool"],
            ["minimum number of steps / moves / transformations, every move costs the same", "BFS (level by level)"],
            ["prerequisites, dependencies, \"must happen before\", build order", "Topological sort (Kahn's algorithm)"],
            ["\"is it possible to finish all…\", \"detect a circular dependency\"", "Kahn's: leftover nodes ⇒ cycle"],
            ["edges have different costs (time, latency, price), all ≥ 0", "Dijkstra"],
          ],
        },
        { type: "h", text: "Why BFS finds shortest paths" },
        {
          type: "p",
          text: "BFS processes nodes in **layers**: first everything at distance 1, then distance 2, and so on. So the first time BFS reaches a node, it has reached it by a path with the fewest possible edges. Record `dist[next] = dist[node] + 1` when you enqueue, and you have every shortest distance from the source in O(V + E). This only holds when every edge costs the same; with weights, a 3-edge path can be cheaper than a 1-edge path, and you need Dijkstra.",
        },
        { type: "h", text: "Topological sort with Kahn's algorithm" },
        {
          type: "p",
          text: "A **topological order** lists the nodes of a directed graph so that every edge `a → b` has `a` before `b`. It exists only if the graph has **no cycle** (a DAG). Kahn's idea: a node with **in-degree 0** (no unmet prerequisites) can go now. Output it, \"remove\" its outgoing edges by decrementing its neighbours' in-degrees, and repeat with the nodes that drop to 0.",
        },
        {
          type: "p",
          text: "Onboarding a new dev at the agency. Edges: `git → next`, `js → ts`, `js → react`, `ts → next`, `react → next`.",
        },
        {
          type: "table",
          rows: [
            ["Step", "Queue (in-degree 0)", "Output", "In-degree changes"],
            ["start", "[git, js]", "[]", "git 0, js 0, ts 1, react 1, next 3"],
            ["1", "[js]", "[git]", "next 3 → 2"],
            ["2", "[ts, react]", "[git, js]", "ts 1 → 0, react 1 → 0"],
            ["3", "[react]", "[git, js, ts]", "next 2 → 1"],
            ["4", "[next]", "[git, js, ts, react]", "next 1 → 0"],
            ["5", "[]", "[git, js, ts, react, next]", "5 of 5 output: no cycle ✔"],
          ],
        },
        {
          type: "run",
          title: "Kahn's algorithm with cycle detection",
          code: `function topoSort(nodes, edges) {
  const adj = new Map(nodes.map((n) => [n, []]));
  const indegree = new Map(nodes.map((n) => [n, 0]));
  for (const [from, to] of edges) {
    adj.get(from).push(to);
    indegree.set(to, indegree.get(to) + 1);
  }
  const queue = nodes.filter((n) => indegree.get(n) === 0);
  const order = [];
  for (let h = 0; h < queue.length; h++) {
    const node = queue[h];
    order.push(node);
    for (const next of adj.get(node)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
    console.log("take", node.padEnd(6), "queue now:", queue.slice(h + 1));
  }
  if (order.length < nodes.length) {
    const stuck = nodes.filter((n) => indegree.get(n) > 0);
    console.log("cycle! never reached in-degree 0:", stuck);
    return null;
  }
  return order;
}

const skills = ["git", "js", "ts", "react", "next"];
console.log(topoSort(skills, [["git", "next"], ["js", "ts"], ["js", "react"], ["ts", "next"], ["react", "next"]]));

console.log("--- with a circular dependency ---");
console.log(topoSort(["auth", "billing", "emails"], [["auth", "billing"], ["billing", "emails"], ["emails", "auth"]]));`,
        },
        {
          type: "callout",
          tone: "info",
          title: "The DFS alternative",
          text: "You can also detect cycles with DFS and three colours: *white* (unvisited), *grey* (on the current recursion path), *black* (finished). Meeting a grey node means you followed an edge back into your own path: a cycle. Reversing the order in which nodes turn black gives a topological order. Kahn's is usually easier to get right, and it's iterative.",
        },
        { type: "h", text: "Brute force vs Kahn's" },
        {
          type: "compare",
          left: {
            label: "Repeatedly scan for a ready node",
            lang: "js",
            code: `function order(n, prerequisites) {
  const done = new Set();
  const result = [];
  while (result.length < n) {
    let progressed = false;
    for (let c = 0; c < n; c++) {
      if (done.has(c)) continue;
      const ready = prerequisites.every(
        ([course, pre]) => course !== c || done.has(pre)
      );
      if (ready) { done.add(c); result.push(c); progressed = true; }
    }
    if (!progressed) return []; // cycle
  }
  return result;
}
// O(V² · E) time in the worst case`,
          },
          right: {
            label: "Kahn's: in-degrees + queue",
            lang: "js",
            code: `function order(n, prerequisites) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    indeg[course]++;
  }
  const queue = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
  for (let h = 0; h < queue.length; h++)
    for (const next of adj[queue[h]])
      if (--indeg[next] === 0) queue.push(next);
  return queue.length === n ? queue : [];
}
// O(V + E) time and space`,
          },
        },
        {
          type: "challenge",
          title: "Course Schedule",
          difficulty: "medium",
          tags: ["graph", "topological sort", "cycle detection"],
          prompt: "There are `numCourses` courses labelled `0` to `numCourses - 1`. Each pair `[a, b]` in `prerequisites` means you must take course `b` before course `a`. Return `true` if it's possible to finish every course, `false` otherwise.",
          examples: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
            { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "0 needs 1 and 1 needs 0: a cycle" },
          ],
          constraints: ["1 <= numCourses <= 5000", "0 <= prerequisites.length <= 10^4", "pairs are distinct"],
          complexity: "O(V + E) time and space",
          starter: `function canFinish(numCourses, prerequisites) {
  // your code here
}`,
          solution: `function canFinish(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    indegree[course]++;
  }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);
  let taken = 0;
  for (let h = 0; h < queue.length; h++) {
    taken++;
    for (const next of adj[queue[h]]) {
      if (--indegree[next] === 0) queue.push(next);
    }
  }
  return taken === numCourses;   // anything left over is stuck in a cycle
}`,
          tests: [
            { name: "[[1,0]] → true", code: "return canFinish(2, [[1,0]]) === true;" },
            { name: "two courses requiring each other → false", code: "return canFinish(2, [[1,0],[0,1]]) === false;" },
            { name: "no prerequisites at all → true", code: "return canFinish(3, []) === true;" },
            { name: "a course requiring itself → false", code: "return canFinish(1, [[0,0]]) === false;" },
            {
              name: "longer cycle hidden after valid courses → false",
              code: "return canFinish(5, [[1,0],[2,1],[3,2],[4,3],[2,4]]) === false;",
            },
            {
              name: "5000 courses, 10,000 prerequisites → fast",
              code: "const n = 5000; const pre = []; for (let i = 1; i < n; i++) { pre.push([i, i - 1]); if (i > 1) pre.push([i, i - 2]); } const t0 = performance.now(); const ok = canFinish(n, pre) === true; pre.push([0, n - 1]); return ok && canFinish(n, pre) === false && performance.now() - t0 < 500;",
            },
          ],
          hint: "Build `adj[pre] → course` and count in-degrees. Run Kahn's algorithm and count how many courses you manage to take. All of them ⇔ no cycle.",
        },
        {
          type: "p",
          text: "Same algorithm, but now the order itself is the answer. The queue in Kahn's algorithm *is* a valid order, as long as every course made it in.",
        },
        {
          type: "challenge",
          title: "Course Schedule II",
          difficulty: "medium",
          tags: ["graph", "topological sort"],
          prompt: "Same setup as Course Schedule: `numCourses` courses and pairs `[a, b]` meaning `b` must come before `a`. Return **an** ordering of all the courses that respects every prerequisite. If several exist, return any of them; if it's impossible, return `[]`.",
          examples: [
            { input: "numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]", output: "[0,1,2,3] or [0,2,1,3]" },
            { input: "numCourses = 1, prerequisites = []", output: "[0]" },
            { input: "numCourses = 2, prerequisites = [[0,1],[1,0]]", output: "[]" },
          ],
          constraints: ["1 <= numCourses <= 2000", "pairs are distinct"],
          complexity: "O(V + E) time and space",
          starter: `function findOrder(numCourses, prerequisites) {
  // your code here
}`,
          solution: `function findOrder(numCourses, prerequisites) {
  const adj = Array.from({ length: numCourses }, () => []);
  const indegree = new Array(numCourses).fill(0);
  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    indegree[course]++;
  }
  const order = [];
  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) order.push(i);
  for (let h = 0; h < order.length; h++) {
    for (const next of adj[order[h]]) {
      if (--indegree[next] === 0) order.push(next);
    }
  }
  return order.length === numCourses ? order : [];
}`,
          tests: [
            {
              name: "diamond: 0 → {1, 2} → 3 gives a valid order",
              code: "const pre = [[1,0],[2,0],[3,1],[3,2]]; const o = findOrder(4, pre); return Array.isArray(o) && o.length === 4 && new Set(o).size === 4 && pre.every(([a, b]) => o.indexOf(b) < o.indexOf(a));",
            },
            { name: "single course → [0]", code: "return deepEqual(findOrder(1, []), [0]);" },
            { name: "cycle → []", code: "return deepEqual(findOrder(2, [[0,1],[1,0]]), []);" },
            {
              name: "no prerequisites → any permutation of all courses",
              code: "const o = findOrder(3, []); return Array.isArray(o) && sameMembers(o, [0,1,2]);",
            },
            {
              name: "partial cycle still means [] (courses 1 and 2 are stuck)",
              code: "return deepEqual(findOrder(4, [[1,0],[2,1],[1,2],[3,0]]), []);",
            },
          ],
          hint: "Exactly Kahn's algorithm. Collect nodes as they leave the queue; if you collected fewer than `numCourses`, there's a cycle, so return `[]`.",
        },
        {
          type: "p",
          text: "Back to BFS as a distance-finder. A grid where you can move in **8 directions** is still an unweighted graph; the first time BFS reaches the bottom-right corner is the shortest path.",
        },
        {
          type: "challenge",
          title: "Shortest Path in Binary Matrix",
          difficulty: "medium",
          tags: ["grid", "bfs", "shortest path"],
          prompt: "Given an `n × n` grid of `0` (open) and `1` (blocked), return the length of the shortest **clear path** from the top-left cell to the bottom-right cell, or `-1` if none exists. A clear path only visits `0` cells, and moves between cells that are **8-directionally** adjacent (they share an edge or a corner). The length is the number of cells visited, including both ends.",
          examples: [
            { input: "grid = [[0,1],[1,0]]", output: "2" },
            { input: "grid = [[0,0,0],[1,1,0],[1,1,0]]", output: "4" },
            { input: "grid = [[1,0,0],[1,1,0],[1,1,0]]", output: "-1", explanation: "the start cell is blocked" },
          ],
          constraints: ["1 <= n <= 200", "grid[i][j] is 0 or 1"],
          complexity: "O(n²) time and space",
          starter: `function shortestPathBinaryMatrix(grid) {
  // your code here
}`,
          solution: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;
  const dist = Array.from({ length: n }, () => new Array(n).fill(0)); // 0 = unvisited
  dist[0][0] = 1;
  const queue = [[0, 0]];
  for (let h = 0; h < queue.length; h++) {
    const [r, c] = queue[h];
    if (r === n - 1 && c === n - 1) return dist[r][c];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
        if (grid[nr][nc] !== 0 || dist[nr][nc] !== 0) continue;
        dist[nr][nc] = dist[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return -1;
}`,
          tests: [
            { name: "diagonal move: [[0,1],[1,0]] → 2", code: "return shortestPathBinaryMatrix([[0,1],[1,0]]) === 2;" },
            { name: "example 2 → 4", code: "return shortestPathBinaryMatrix([[0,0,0],[1,1,0],[1,1,0]]) === 4;" },
            { name: "blocked start → -1", code: "return shortestPathBinaryMatrix([[1,0,0],[1,1,0],[1,1,0]]) === -1;" },
            { name: "blocked end → -1, single open cell → 1", code: "return shortestPathBinaryMatrix([[0,0],[0,1]]) === -1 && shortestPathBinaryMatrix([[0]]) === 1;" },
            { name: "wall with no gap → -1", code: "return shortestPathBinaryMatrix([[0,1,0],[0,1,0],[0,1,0]]) === -1;" },
            {
              name: "open 200×200 grid → 200 (straight diagonal), fast",
              code: "const g = Array.from({length: 200}, () => new Array(200).fill(0)); const t0 = performance.now(); return shortestPathBinaryMatrix(g) === 200 && performance.now() - t0 < 500;",
            },
          ],
          hint: "BFS from (0, 0) with distance 1, trying all 8 neighbours (`dr` and `dc` each in -1, 0, 1). Return the distance as soon as you dequeue the bottom-right cell.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Implicit graphs",
          text: "In Word Ladder nobody gives you edges. Two words are connected if they differ by one letter, and you **generate** neighbours on demand: for each position, try the 26 letters and keep the candidates that are in the dictionary `Set`. That's O(L · 26) per word instead of comparing every pair of words (O(N² · L)).",
        },
        {
          type: "challenge",
          title: "Word Ladder",
          difficulty: "hard",
          tags: ["bfs", "implicit graph", "hash set"],
          prompt: "A transformation sequence from `beginWord` to `endWord` changes **one letter at a time**, and every intermediate word (and `endWord`) must be in `wordList`. `beginWord` itself doesn't need to be in the list. Return the **number of words** in the shortest such sequence (counting `beginWord` and `endWord`), or `0` if there is none. All words have the same length and use lowercase letters.",
          examples: [
            {
              input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
              output: "5",
              explanation: "hit → hot → dot → dog → cog",
            },
            { input: "same, but wordList without \"cog\"", output: "0" },
          ],
          constraints: ["1 <= word length <= 10", "1 <= wordList.length <= 10^4", "beginWord !== endWord"],
          complexity: "O(N · L · 26) time (N words of length L), O(N · L) space",
          starter: `function ladderLength(beginWord, endWord, wordList) {
  // your code here
}`,
          solution: `function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  const visited = new Set([beginWord]);
  let level = [beginWord];
  let length = 1;
  while (level.length) {
    const next = [];
    for (const word of level) {
      if (word === endWord) return length;
      for (let i = 0; i < word.length; i++) {
        for (let code = 97; code <= 122; code++) {
          const candidate = word.slice(0, i) + String.fromCharCode(code) + word.slice(i + 1);
          if (words.has(candidate) && !visited.has(candidate)) {
            visited.add(candidate);
            next.push(candidate);
          }
        }
      }
    }
    level = next;
    length++;
  }
  return 0;
}`,
          tests: [
            {
              name: "hit → cog in 5 words",
              code: "return ladderLength('hit', 'cog', ['hot','dot','dog','lot','log','cog']) === 5;",
            },
            { name: "endWord not in the list → 0", code: "return ladderLength('hit', 'cog', ['hot','dot','dog','lot','log']) === 0;" },
            { name: "one-letter words: a → c in 2", code: "return ladderLength('a', 'c', ['a','b','c']) === 2;" },
            { name: "lead → load → goad → gold is 4; no bridge (cat, [cot, dog]) → 0", code: "return ladderLength('lead', 'gold', ['load','goad','gold']) === 4 && ladderLength('cat', 'dog', ['cot','dog']) === 0;" },
            {
              name: "8000-word dictionary → 4, fast (no pairwise comparisons)",
              code: "const L = 'abcdefghijklmnopqrst'; const list = []; for (const a of L) for (const b of L) for (const c of L) list.push(a + b + c); const t0 = performance.now(); return ladderLength('aaa', 'ttt', list) === 4 && performance.now() - t0 < 800;",
            },
          ],
          hint: "BFS level by level from `beginWord`, counting levels. To find neighbours, replace each position with each letter a–z and check the `Set`. Mark words visited when you enqueue them.",
        },
        { type: "h", text: "Weighted edges: Dijkstra" },
        {
          type: "p",
          text: "When edges have **non-negative** weights, BFS's \"first arrival is shortest\" breaks. **Dijkstra** fixes it by always expanding the *closest unfinished* node next. When a node is taken out it's final: any other route would go through a node that is at least as far already. Two ways to find \"the closest unfinished node\":",
        },
        {
          type: "list",
          items: [
            "**Linear scan** over a `dist` array: O(V) per pick, **O(V²)** total. Simple, and actually the best choice for dense graphs.",
            "**Min-heap** of `[distance, node]`: O(log V) per operation, **O((V + E) log V)** total. JavaScript has no built-in priority queue (neither does LeetCode's JS), so you write a small one.",
          ],
        },
        {
          type: "run",
          title: "Dijkstra with a tiny min-heap (latency between servers)",
          code: `class MinHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(item) {                         // item = [priority, value]
    const a = this.a;
    a.push(item);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

function dijkstra(graph, source) {
  const dist = new Map([[source, 0]]);
  const heap = new MinHeap();
  heap.push([0, source]);
  while (heap.size) {
    const [d, node] = heap.pop();
    if (d > dist.get(node)) continue;          // stale entry: skip
    console.log("finalise", node, "at", d, "ms");
    for (const [next, w] of graph[node] ?? []) {
      const nd = d + w;
      if (nd < (dist.get(next) ?? Infinity)) {
        dist.set(next, nd);
        heap.push([nd, next]);
      }
    }
  }
  return dist;
}

// Montréal edge → other regions, weights = latency in ms
const network = {
  yul: [["yyz", 12], ["iad", 30], ["cdg", 85]],
  yyz: [["iad", 14], ["ord", 15]],
  iad: [["cdg", 80], ["ord", 18]],
  ord: [["sfo", 45]],
  cdg: [],
};
console.log(dijkstra(network, "yul"));`,
        },
        {
          type: "callout",
          tone: "warn",
          title: "Negative weights break Dijkstra",
          text: "Dijkstra assumes a finalised node can never get cheaper. A negative edge (a \"refund\") violates that. For negative weights use Bellman-Ford (relax every edge V − 1 times, O(V · E)), which also detects negative cycles.",
        },
        {
          type: "challenge",
          title: "Network Delay Time",
          difficulty: "medium",
          tags: ["graph", "dijkstra", "shortest path"],
          prompt: "A network has `n` servers labelled `1` to `n`. `times[i] = [u, v, w]` means a signal sent from `u` reaches `v` after `w` ms (directed). A signal starts at server `k`. Return the time it takes for **all** `n` servers to receive it, or `-1` if some server never does. Use Dijkstra (heap or O(V²) scan, your choice).",
          examples: [
            { input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", output: "2" },
            { input: "times = [[1,2,1]], n = 2, k = 1", output: "1" },
            { input: "times = [[1,2,1]], n = 2, k = 2", output: "-1", explanation: "edges are one-way" },
          ],
          constraints: ["1 <= n <= 1000", "0 <= w <= 100", "no duplicate (u, v) pairs"],
          complexity: "O(V² + E) with a linear scan, or O((V + E) log V) with a heap",
          starter: `function networkDelayTime(times, n, k) {
  // your code here
}`,
          solution: `function networkDelayTime(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);
  const dist = new Array(n + 1).fill(Infinity);
  const done = new Array(n + 1).fill(false);
  dist[k] = 0;
  for (let round = 0; round < n; round++) {
    // pick the closest unfinished server: O(V) scan
    let u = -1;
    for (let i = 1; i <= n; i++) {
      if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (dist[u] === Infinity) break;          // the rest is unreachable
    done[u] = true;
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let slowest = 0;
  for (let i = 1; i <= n; i++) slowest = Math.max(slowest, dist[i]);
  return slowest === Infinity ? -1 : slowest;
}`,
          tests: [
            { name: "example 1 → 2", code: "return networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) === 2;" },
            { name: "one edge → 1", code: "return networkDelayTime([[1,2,1]], 2, 1) === 1;" },
            { name: "edges are directed: unreachable → -1", code: "return networkDelayTime([[1,2,1]], 2, 2) === -1;" },
            {
              name: "a detour beats the direct edge (1→3→2 = 3, not 10)",
              code: "return networkDelayTime([[1,2,10],[1,3,1],[3,2,2]], 3, 1) === 3;",
            },
            { name: "single server → 0", code: "return networkDelayTime([], 1, 1) === 0;" },
            {
              name: "1000 servers → 999 ms, fast",
              code: "const n = 1000; const t = []; for (let i = 1; i < n; i++) { t.push([i, i + 1, 1]); if (i + 2 <= n) t.push([i, i + 2, 3]); } const t0 = performance.now(); return networkDelayTime(t, n, 1) === 999 && performance.now() - t0 < 500;",
            },
          ],
          hint: "Build `adj[u] = [[v, w], …]`. Keep `dist` (Infinity except `dist[k] = 0`). Repeatedly finalise the closest unfinished server and relax its outgoing edges. The answer is the largest finite distance, or -1 if any is Infinity.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Topological order is everywhere in your tooling",
          text: "`npm`/`pnpm` install and build workspace packages in dependency order; Turborepo's `dependsOn` and GitHub Actions' `needs:` define a DAG and refuse cycles; Supabase migrations run in a fixed order because later tables reference earlier ones. When a tool reports a \"circular dependency\", it ran something very close to Kahn's algorithm and found nodes whose in-degree never reached 0.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Why does BFS give shortest paths in an unweighted graph but not in a weighted one?",
              options: [
                "BFS visits nodes in order of number of edges, which equals cost only when every edge costs the same",
                "BFS can't handle cycles in weighted graphs",
                "Weighted graphs must be directed",
                "BFS needs a heap for weighted graphs",
              ],
              answer: 0,
              why: "BFS orders by hop count. With weights, a path with more hops can be cheaper, so the first arrival isn't necessarily the cheapest.",
            },
            {
              q: "Kahn's algorithm outputs only 7 of 10 nodes. What does that tell you?",
              options: ["The graph is disconnected", "There are 3 isolated nodes", "The graph contains a cycle", "The graph is undirected"],
              answer: 2,
              why: "Nodes on (or downstream of) a cycle never reach in-degree 0, so they never enter the queue. Disconnected nodes are fine: they start at in-degree 0.",
            },
            {
              q: "What is the complexity of Dijkstra with a binary heap?",
              options: ["O(V + E)", "O(V · E)", "O(E²)", "O((V + E) log V)"],
              answer: 3,
              why: "Each edge can push one entry into the heap and each push/pop costs O(log V).",
            },
            {
              q: "Word Ladder asks for the *fewest* transformations. Which pattern fits best?",
              options: ["DFS with backtracking", "BFS over an implicit graph", "Union-find", "Dynamic programming on prefixes"],
              answer: 1,
              why: "\"Fewest steps\" where every step costs 1 is BFS. The graph is implicit: neighbours are generated by changing one letter.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Union-Find
    // ─────────────────────────────────────────────────────────────
    {
      slug: "union-find",
      title: "Union-Find (disjoint sets)",
      summary: "Track groups that keep merging, and answer \"are these two connected?\" in near-constant time with path compression and union by rank.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Imagine the CRM merging duplicate contacts: \"these two records are the same person\", \"these two as well\"… and at any moment you want to know \"are A and C the same person?\" or \"how many distinct people are there?\". You could re-run a DFS after every merge, but **Union-Find** (also called *disjoint set union*, DSU) does each merge and each query in almost O(1).",
        },
        { type: "h", text: "Recognise it" },
        {
          type: "list",
          items: [
            "**Connectivity** questions: \"number of connected components\", \"are x and y in the same group\", \"how many provinces / friend circles\".",
            "Edges arrive **one at a time** and you need an answer after each (\"the first edge that creates a cycle\").",
            "Things are merged by a shared attribute: accounts with a common email, people with a common phone number.",
            "Kruskal's minimum spanning tree (sort edges by weight, add the ones that join two different sets).",
          ],
        },
        { type: "h", text: "The idea: a forest of parent pointers" },
        {
          type: "p",
          text: "Each element points to a **parent**; following parents leads to the **root**, which is the representative (the \"id\") of the set. Initially everyone is their own parent. `find(x)` walks to the root. `union(a, b)` finds both roots and hangs one under the other. Two optimisations make it fast:",
        },
        {
          type: "list",
          items: [
            "**Path compression**: after finding the root of `x`, point every node on that path directly at the root, so the next `find` is one hop.",
            "**Union by rank** (or by size): hang the *shorter* tree under the *taller* one, so trees stay shallow.",
          ],
        },
        {
          type: "p",
          text: "With both, a sequence of m operations costs O(m · α(n)), where α is the inverse Ackermann function: at most 4 for any n you'll ever see. In interviews you say \"amortised nearly O(1)\".",
        },
        {
          type: "steps",
          items: [
            { title: "init(5)", text: "`parent = [0, 1, 2, 3, 4]`, `rank = [0, 0, 0, 0, 0]`. Five sets: {0} {1} {2} {3} {4}." },
            { title: "union(0, 1)", text: "Roots 0 and 1, equal ranks: hang 1 under 0 and bump rank[0] to 1. `parent = [0, 0, 2, 3, 4]`." },
            { title: "union(2, 3)", text: "Same thing: hang 3 under 2, rank[2] = 1. `parent = [0, 0, 2, 2, 4]`. Sets: {0,1} {2,3} {4}." },
            { title: "union(1, 3)", text: "find(1) = 0, find(3) = 2. Equal ranks (1 and 1): hang 2 under 0, rank[0] = 2. `parent = [0, 0, 0, 2, 4]`." },
            { title: "find(3)", text: "Path 3 → 2 → 0: root is 0. Path compression re-points 3 directly at 0: `parent = [0, 0, 0, 0, 4]`." },
            { title: "connected(1, 3)?", text: "find(1) = 0 and find(3) = 0: same root, so yes. Two sets remain: {0,1,2,3} and {4}." },
          ],
        },
        {
          type: "run",
          title: "Union-Find with path compression + union by rank",
          code: `class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.count = n;                        // number of disjoint sets
  }
  find(x) {
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root];
    // path compression: point every node on the path at the root
    while (this.parent[x] !== root) {
      const next = this.parent[x];
      this.parent[x] = root;
      x = next;
    }
    return root;
  }
  union(a, b) {
    let ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;           // already together
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;                  // shorter tree under taller
    if (this.rank[ra] === this.rank[rb]) this.rank[ra]++;
    this.count--;
    return true;
  }
}

const uf = new UnionFind(5);
for (const [a, b] of [[0, 1], [2, 3], [1, 3]]) {
  uf.union(a, b);
  console.log("union(" + a + ", " + b + ") parent =", uf.parent, "sets =", uf.count);
}
console.log("find(3) =", uf.find(3), "→ parent after compression:", uf.parent);
console.log("1 and 3 connected?", uf.find(1) === uf.find(3));
console.log("1 and 4 connected?", uf.find(1) === uf.find(4));
console.log("union(0, 2) again returns", uf.union(0, 2), "(same set: that edge would make a cycle)");`,
        },
        { type: "h", text: "Naive vs optimised" },
        {
          type: "compare",
          left: {
            label: "Naive: no rank, no compression",
            lang: "js",
            code: `const parent = [...Array(n).keys()];
function find(x) {
  while (parent[x] !== x) x = parent[x];
  return x;
}
function union(a, b) {
  parent[find(a)] = find(b); // may build a long chain
}
// union(0,1), union(0,2), union(0,3)…
// makes 0 → 1 → 2 → 3 → … : find(0) is O(n)
// O(n) per operation, O(n²) for n operations`,
          },
          right: {
            label: "Path compression + union by rank",
            lang: "js",
            code: `function find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}
function union(a, b) {
  let ra = find(a), rb = find(b);
  if (ra === rb) return false;
  if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
  parent[rb] = ra;
  if (rank[ra] === rank[rb]) rank[ra]++;
  return true;
}
// O(α(n)) amortised per operation ≈ O(1)`,
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: "Union-find or DFS?",
          text: "For a **static** graph, counting components with DFS or union-find are both O(V + E). Union-find shines when edges **stream in** and you need answers along the way, when the question is \"which edge first creates a cycle\", or when you merge by keys (emails) without building an adjacency list.",
        },
        {
          type: "challenge",
          title: "Number of Connected Components",
          difficulty: "medium",
          tags: ["union-find", "graph"],
          prompt: "You have `n` nodes labelled `0` to `n - 1` and a list of undirected `edges`. Return the number of connected components.",
          examples: [
            { input: "n = 5, edges = [[0,1],[1,2],[3,4]]", output: "2" },
            { input: "n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", output: "1" },
          ],
          constraints: ["1 <= n <= 10^5", "0 <= edges.length <= 10^5", "no duplicate edges, no self-loops"],
          complexity: "O(n + E · α(n)) time, O(n) space",
          starter: `function countComponents(n, edges) {
  // your code here
}`,
          solution: `function countComponents(n, edges) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  function find(x) {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];   // path halving: a compact form of compression
      x = parent[x];
    }
    return x;
  }
  let components = n;
  for (const [a, b] of edges) {
    let ra = find(a), rb = find(b);
    if (ra === rb) continue;
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    if (rank[ra] === rank[rb]) rank[ra]++;
    components--;                      // every successful union merges two sets
  }
  return components;
}`,
          tests: [
            { name: "two groups: {0,1,2} and {3,4}", code: "return countComponents(5, [[0,1],[1,2],[3,4]]) === 2;" },
            { name: "a single chain → 1", code: "return countComponents(5, [[0,1],[1,2],[2,3],[3,4]]) === 1;" },
            { name: "no edges → every node alone", code: "return countComponents(4, []) === 4;" },
            { name: "a cycle doesn't reduce the count twice", code: "return countComponents(4, [[0,1],[1,2],[2,0]]) === 2;" },
            {
              name: "100,000-node star → 1, fast (needs balanced trees)",
              code: "const n = 100000; const e = []; for (let i = 1; i < n; i++) e.push([0, i]); const t0 = performance.now(); return countComponents(n, e) === 1 && performance.now() - t0 < 500;",
            },
          ],
          hint: "Start with `n` components. Each union that joins two *different* roots reduces the count by one.",
        },
        {
          type: "p",
          text: "A **tree** is a connected graph with no cycle. With `n` nodes, that's equivalent to: exactly `n - 1` edges **and** no union ever finds both ends already connected. Check the cheap condition first.",
        },
        {
          type: "challenge",
          title: "Graph Valid Tree",
          difficulty: "medium",
          tags: ["union-find", "graph"],
          prompt: "Given `n` nodes labelled `0` to `n - 1` and a list of undirected `edges`, return `true` if the edges form a valid tree (connected and acyclic), `false` otherwise.",
          examples: [
            { input: "n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]", output: "true" },
            { input: "n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]", output: "false", explanation: "1–2–3 forms a cycle" },
          ],
          constraints: ["1 <= n <= 2000", "no duplicate edges, no self-loops"],
          complexity: "O(n · α(n)) time, O(n) space",
          starter: `function validTree(n, edges) {
  // your code here
}`,
          solution: `function validTree(n, edges) {
  if (edges.length !== n - 1) return false;   // too few: disconnected; too many: a cycle
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const [a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra === rb) return false;             // already connected: this edge closes a cycle
    parent[ra] = rb;
  }
  return true;
}`,
          tests: [
            { name: "example 1 is a tree", code: "return validTree(5, [[0,1],[0,2],[0,3],[1,4]]) === true;" },
            { name: "example 2 has a cycle", code: "return validTree(5, [[0,1],[1,2],[2,3],[1,3],[1,4]]) === false;" },
            { name: "single node, no edges → true", code: "return validTree(1, []) === true;" },
            { name: "disconnected forest → false", code: "return validTree(4, [[0,1],[2,3]]) === false;" },
            {
              name: "n - 1 edges but a cycle plus an isolated node → false",
              code: "return validTree(4, [[0,1],[1,2],[2,0]]) === false;",
            },
          ],
          hint: "A tree on `n` nodes has exactly `n - 1` edges. If that holds, it's a tree unless some edge joins two nodes that are already connected.",
        },
        {
          type: "p",
          text: "That \"union returns false when both ends already share a root\" check is precisely how you find the edge that *creates* a cycle. Process edges in order, and the first one whose union fails is the culprit.",
        },
        {
          type: "challenge",
          title: "Redundant Connection",
          difficulty: "medium",
          tags: ["union-find", "cycle detection"],
          prompt: "A tree with `n` nodes labelled `1` to `n` got **one extra edge**. You're given all `n` edges as `edges[i] = [a, b]` (undirected). Return an edge that can be removed so the result is a tree again. If several answers are possible, return the one that appears **last** in `edges`.",
          examples: [
            { input: "edges = [[1,2],[1,3],[2,3]]", output: "[2,3]" },
            { input: "edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]", output: "[1,4]" },
          ],
          constraints: ["3 <= n <= 10^5", "edges.length === n", "the graph is connected, no duplicate edges"],
          complexity: "O(n · α(n)) time, O(n) space",
          starter: `function findRedundantConnection(edges) {
  // your code here
}`,
          solution: `function findRedundantConnection(edges) {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const rank = new Array(n + 1).fill(0);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (const [a, b] of edges) {
    let ra = find(a), rb = find(b);
    if (ra === rb) return [a, b];   // first edge closing a cycle = last edge of that cycle in the input
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    if (rank[ra] === rank[rb]) rank[ra]++;
  }
  return [];
}`,
          tests: [
            { name: "triangle → [2,3]", code: "return deepEqual(findRedundantConnection([[1,2],[1,3],[2,3]]), [2,3]);" },
            { name: "example 2 → [1,4]", code: "return deepEqual(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]]), [1,4]);" },
            { name: "cycle closed by the last edge → [3,1]", code: "return deepEqual(findRedundantConnection([[1,2],[2,3],[3,1]]), [3,1]);" },
            {
              name: "the extra edge is in the middle of the list",
              code: "return deepEqual(findRedundantConnection([[1,2],[2,3],[1,3],[3,4],[4,5]]), [1,3]);",
            },
            {
              name: "100,000-node star + one extra edge, fast",
              code: "const n = 100000; const e = []; for (let i = 2; i <= n; i++) e.push([1, i]); e.push([2, 3]); const t0 = performance.now(); return deepEqual(findRedundantConnection(e), [2,3]) && performance.now() - t0 < 500;",
            },
          ],
          hint: "Union the edges in order. The first edge whose two ends already have the same root is the answer.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Union by key",
          text: "Nodes don't have to be numbers given up front. In Accounts Merge, union the *accounts* (indices) and use a `Map` from email → first account that had it. When an email shows up again, union the two accounts. At the end, group emails by the root of their account.",
        },
        {
          type: "challenge",
          title: "Accounts Merge",
          difficulty: "medium",
          tags: ["union-find", "hash map", "sorting"],
          prompt: "Each entry of `accounts` is `[name, email1, email2, …]`. Two accounts belong to the same person if they share **at least one email** (directly or through a chain of accounts). Two accounts with the same name may be different people. Merge them and return one entry per person: `[name, ...emails]` with the emails **sorted** and **unique**. The accounts can be returned in any order.",
          examples: [
            {
              input: "[[\"Marie\",\"marie@lumen.ca\",\"marie.t@gmail.com\"],[\"Marie\",\"marie@lumen.ca\",\"billing@lumen.ca\"],[\"Marie\",\"marie.c@hotmail.com\"],[\"Luc\",\"luc@pixelbay.ca\"]]",
              output: "[[\"Marie\",\"billing@lumen.ca\",\"marie.t@gmail.com\",\"marie@lumen.ca\"],[\"Marie\",\"marie.c@hotmail.com\"],[\"Luc\",\"luc@pixelbay.ca\"]]",
              explanation: "the first two share marie@lumen.ca; the third Marie is another person",
            },
          ],
          constraints: ["1 <= accounts.length <= 1000", "2 <= accounts[i].length <= 10", "emails sort with the default string order"],
          complexity: "O(N · α(N) + E log E) time where E = total emails, O(E) space",
          starter: `function accountsMerge(accounts) {
  // your code here
}`,
          solution: `function accountsMerge(accounts) {
  const parent = accounts.map((_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const owner = new Map();                 // email → first account index that had it
  accounts.forEach((account, i) => {
    for (let j = 1; j < account.length; j++) {
      const email = account[j];
      if (owner.has(email)) parent[find(i)] = find(owner.get(email));
      else owner.set(email, i);
    }
  });
  const groups = new Map();                // root account → its emails
  for (const [email, i] of owner) {
    const root = find(i);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(email);
  }
  return [...groups].map(([root, emails]) => [accounts[root][0], ...emails.sort()]);
}`,
          tests: [
            {
              name: "example: two Maries merge, the third stays separate",
              code: "const r = accountsMerge([['Marie','marie@lumen.ca','marie.t@gmail.com'],['Marie','marie@lumen.ca','billing@lumen.ca'],['Marie','marie.c@hotmail.com'],['Luc','luc@pixelbay.ca']]); return sameMembers(r, [['Marie','billing@lumen.ca','marie.t@gmail.com','marie@lumen.ca'],['Marie','marie.c@hotmail.com'],['Luc','luc@pixelbay.ca']]);",
            },
            {
              name: "a third account bridges the first two (chain merge)",
              code: "const r = accountsMerge([['Nadia','n1@x.ca','n2@x.ca'],['Nadia','n3@x.ca','n4@x.ca'],['Nadia','n2@x.ca','n3@x.ca']]); return sameMembers(r, [['Nadia','n1@x.ca','n2@x.ca','n3@x.ca','n4@x.ca']]);",
            },
            {
              name: "same name, no shared email → two people",
              code: "const r = accountsMerge([['Sam','sam@a.ca'],['Sam','sam@b.ca']]); return sameMembers(r, [['Sam','sam@a.ca'],['Sam','sam@b.ca']]);",
            },
            {
              name: "duplicate email inside one account appears once",
              code: "return sameMembers(accountsMerge([['Ana','b@x.ca','a@x.ca','b@x.ca']]), [['Ana','a@x.ca','b@x.ca']]);",
            },
          ],
          hint: "Union-find over account indices. Map each email to the first account that had it; on a repeat, union the two accounts. Then group every email under `find(owner)`, sort, and prepend the name.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "This is your CRM dedupe job",
          text: "Merging leads that came in from a Meta form, a Shopify checkout and a contact form, when any of email or phone matches, is Accounts Merge. In a Next.js route handler you'd load the rows from Supabase, run union-find in memory, and write one `contact_id` per group back in a single upsert, rather than issuing a query per pair.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What does path compression do?",
              options: [
                "Merges the two smallest sets first",
                "Makes every node on a find path point directly at the root",
                "Removes duplicate edges",
                "Stores sets as sorted arrays",
              ],
              answer: 1,
              why: "After finding the root, nodes on the path are re-pointed at it, so future finds on them take one hop.",
            },
            {
              q: "With path compression and union by rank, what is the amortised cost per operation?",
              options: ["O(log n)", "O(n)", "O(α(n)), effectively constant", "O(1) exactly, in the worst case"],
              answer: 2,
              why: "The inverse Ackermann function α(n) grows so slowly it's ≤ 4 for any realistic n. It's amortised, not a per-operation worst-case guarantee.",
            },
            {
              q: "Edges arrive one at a time and you must report the first one that creates a cycle. Best tool?",
              options: ["Union-find", "BFS from every node after each edge", "Topological sort", "Dijkstra"],
              answer: 0,
              why: "`union(a, b)` returning \"already connected\" is exactly \"this edge closes a cycle\", in near O(1) per edge.",
            },
            {
              q: "An undirected graph with n nodes has n − 1 edges. What else must hold for it to be a tree?",
              options: ["It must be directed", "Every node must have degree ≤ 2", "It must have a node of degree n − 1", "It must be connected (equivalently: acyclic)"],
              answer: 3,
              why: "With exactly n − 1 edges, connected ⇔ acyclic ⇔ tree. Checking either one is enough.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 5. Dynamic programming 1D
    // ─────────────────────────────────────────────────────────────
    {
      slug: "dp-1d",
      title: "Dynamic programming in 1D",
      summary: "Turn an exponential recursion into a linear loop: recursion → memoization → tabulation → constant space.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "**Dynamic programming** (DP) sounds intimidating, but it's one idea: when a recursive solution keeps solving the **same subproblems** over and over, solve each one **once** and reuse the answer. It applies when the problem has *optimal substructure* (the best answer for `n` is built from best answers for smaller inputs) and *overlapping subproblems* (those smaller inputs repeat).",
        },
        { type: "h", text: "Recognise it" },
        {
          type: "list",
          items: [
            "The question asks for a **count** (\"how many ways\"), a **min/max** (\"fewest coins\", \"maximum profit\"), or **yes/no** (\"can it be segmented\").",
            "Each step is a **choice** (take it or skip it, 1 step or 2 steps, which coin) and choices affect what's possible later.",
            "A brute-force recursion is easy to write but its tree branches exponentially, with repeated arguments.",
            "Constraints like `n <= 10^4` rule out exponential: you need O(n) or O(n²).",
          ],
        },
        { type: "h", text: "One problem, four versions" },
        {
          type: "p",
          text: "Fibonacci: `fib(0) = 0`, `fib(1) = 1`, `fib(n) = fib(n-1) + fib(n-2)`. The direct recursion recomputes `fib(n-2)` inside `fib(n-1)` *and* again on its own; the call tree doubles at each level.",
        },
        {
          type: "steps",
          items: [
            { title: "1. Recursion", text: "Write the recurrence literally. Correct, but O(2^n): `fib(40)` makes about 330 million calls." },
            { title: "2. Memoization (top-down)", text: "Same recursion, plus a cache: before computing `fib(k)`, check the `Map`; after computing, store it. Each `k` is computed once: O(n) time, O(n) space (cache + call stack)." },
            { title: "3. Tabulation (bottom-up)", text: "Flip the direction: fill an array `dp[0..n]` from the base cases upward, so every value you need is already computed. O(n) time, O(n) space, no recursion depth limit." },
            { title: "4. Space-optimised", text: "`dp[i]` only reads `dp[i-1]` and `dp[i-2]`, so keep two variables instead of the array. O(n) time, **O(1)** space." },
          ],
        },
        {
          type: "table",
          rows: [
            ["i", "dp[i-2]", "dp[i-1]", "dp[i] = dp[i-1] + dp[i-2]"],
            ["0", "–", "–", "0 (base case)"],
            ["1", "–", "–", "1 (base case)"],
            ["2", "0", "1", "1"],
            ["3", "1", "1", "2"],
            ["4", "1", "2", "3"],
            ["5", "2", "3", "5"],
            ["6", "3", "5", "8"],
          ],
        },
        {
          type: "run",
          title: "the four versions, with a call counter",
          code: `let calls = 0;
function fibNaive(n) {
  calls++;
  return n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2);
}

function fibMemo(n, memo = new Map()) {
  calls++;
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, value);
  return value;
}

function fibTab(n) {
  if (n < 2) return n;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}

function fibConstant(n) {
  let prev = 0, curr = 1;               // fib(0), fib(1)
  for (let i = 0; i < n; i++) [prev, curr] = [curr, prev + curr];
  return prev;
}

const n = 27;
calls = 0;
console.log("naive   ", fibNaive(n), "calls:", calls);
calls = 0;
console.log("memo    ", fibMemo(n), "calls:", calls);
console.log("tab     ", fibTab(n));
console.log("O(1)    ", fibConstant(n));
console.log("fib(90) ", fibConstant(90), "(still exact: below 2^53)");`,
        },
        { type: "h", text: "The recipe" },
        {
          type: "list",
          ordered: true,
          items: [
            "**Define the state in words**: \"`dp[i]` = the number of ways to reach step `i`\". If you can't say it in one sentence, you're not ready to code.",
            "**Write the recurrence**: how does `dp[i]` depend on smaller states? This is where the choice lives.",
            "**Base cases**: the smallest states you know directly (`dp[0]`, sometimes `dp[1]`).",
            "**Order**: fill states so dependencies are ready (usually increasing `i`).",
            "**Answer**: which state holds it (`dp[n]`, or the max over all `dp[i]`)?",
            "**Optimise space** if each state only looks a fixed distance back.",
          ],
        },
        {
          type: "compare",
          left: {
            label: "Plain recursion",
            lang: "js",
            code: `function ways(n) {
  if (n <= 1) return 1;
  return ways(n - 1) + ways(n - 2);
}
// O(2^n) time: ways(45) ≈ 3.7 billion calls
// O(n) call-stack space`,
          },
          right: {
            label: "Tabulation, space-optimised",
            lang: "js",
            code: `function ways(n) {
  let a = 1, b = 1;          // ways(0), ways(1)
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
// O(n) time, O(1) space`,
          },
        },
        {
          type: "challenge",
          title: "Climbing Stairs",
          difficulty: "easy",
          tags: ["dp", "1d"],
          prompt: "You're climbing a staircase with `n` steps. Each move climbs either 1 or 2 steps. In how many distinct ways can you reach the top?",
          examples: [
            { input: "n = 2", output: "2", explanation: "1+1 or 2" },
            { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
          ],
          constraints: ["1 <= n <= 45"],
          complexity: "O(n) time, O(1) space",
          starter: `function climbStairs(n) {
  // your code here
}`,
          solution: `function climbStairs(n) {
  // dp[i] = dp[i-1] (last move was 1 step) + dp[i-2] (last move was 2 steps)
  let twoBack = 1, oneBack = 1;      // dp[0], dp[1]
  for (let i = 2; i <= n; i++) {
    const current = oneBack + twoBack;
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}`,
          tests: [
            { name: "n = 2 → 2", code: "return climbStairs(2) === 2;" },
            { name: "n = 3 → 3", code: "return climbStairs(3) === 3;" },
            { name: "n = 1 → 1", code: "return climbStairs(1) === 1;" },
            { name: "n = 5 → 8", code: "return climbStairs(5) === 8;" },
            {
              name: "n = 45 → 1836311903, instantly (plain recursion would take ages)",
              code: "const t0 = performance.now(); return climbStairs(45) === 1836311903 && performance.now() - t0 < 200;",
            },
          ],
          hint: "To stand on step `i`, your last move came from `i - 1` or from `i - 2`. So `ways(i) = ways(i-1) + ways(i-2)`. Look familiar?",
        },
        {
          type: "p",
          text: "Counting ways adds the options; optimising **picks the best** option. Same shape, `+` becomes `Math.min`, and each state adds the cost of the step you land on.",
        },
        {
          type: "challenge",
          title: "Min Cost Climbing Stairs",
          difficulty: "easy",
          tags: ["dp", "1d"],
          prompt: "`cost[i]` is what you pay when you step **on** stair `i`. After paying, you can climb 1 or 2 stairs. You may start on stair `0` or stair `1`. Return the minimum total cost to reach the top, which is just **past** the last stair (index `cost.length`).",
          examples: [
            { input: "cost = [10,15,20]", output: "15", explanation: "start on stair 1, pay 15, climb 2 to the top" },
            { input: "cost = [1,100,1,1,1,100,1,1,100,1]", output: "6" },
          ],
          constraints: ["2 <= cost.length <= 10^5", "0 <= cost[i] <= 999"],
          complexity: "O(n) time, O(1) space",
          starter: `function minCostClimbingStairs(cost) {
  // your code here
}`,
          solution: `function minCostClimbingStairs(cost) {
  // dp[i] = cheapest way to stand on i (before paying cost[i])
  let twoBack = 0, oneBack = 0;          // dp[0], dp[1]: starting there is free
  for (let i = 2; i <= cost.length; i++) {
    const current = Math.min(oneBack + cost[i - 1], twoBack + cost[i - 2]);
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;                         // dp[n] = the top
}`,
          tests: [
            { name: "[10,15,20] → 15", code: "return minCostClimbingStairs([10,15,20]) === 15;" },
            { name: "[1,100,1,1,1,100,1,1,100,1] → 6", code: "return minCostClimbingStairs([1,100,1,1,1,100,1,1,100,1]) === 6;" },
            { name: "two free stairs → 0", code: "return minCostClimbingStairs([0,0]) === 0;" },
            { name: "[5,1] → 1 (start on stair 1)", code: "return minCostClimbingStairs([5,1]) === 1;" },
            {
              name: "100,000 stairs of cost 1 → 50,000, fast",
              code: "const c = new Array(100000).fill(1); const t0 = performance.now(); return minCostClimbingStairs(c) === 50000 && performance.now() - t0 < 300;",
            },
          ],
          hint: "Let `dp[i]` be the cheapest cost to *stand* on stair `i`. `dp[0] = dp[1] = 0`, and `dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])`. The answer is `dp[n]`.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Take it or skip it",
          text: "House Robber introduces the most reusable DP choice: for each item, either **skip** it (keep the best so far, `dp[i-1]`) or **take** it (its value plus the best that doesn't touch its neighbour, `dp[i-2] + nums[i]`). Knapsack, scheduling and stock problems are variations of this.",
        },
        {
          type: "challenge",
          title: "House Robber",
          difficulty: "medium",
          tags: ["dp", "1d"],
          prompt: "Houses along a street hold `nums[i]` dollars. You can't rob two **adjacent** houses (the alarms are linked). Return the maximum amount you can rob.",
          examples: [
            { input: "nums = [1,2,3,1]", output: "4", explanation: "rob houses 0 and 2: 1 + 3" },
            { input: "nums = [2,7,9,3,1]", output: "12", explanation: "rob houses 0, 2 and 4: 2 + 9 + 1" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 400"],
          complexity: "O(n) time, O(1) space",
          starter: `function rob(nums) {
  // your code here
}`,
          solution: `function rob(nums) {
  let twoBack = 0, oneBack = 0;          // best up to i-2, best up to i-1
  for (const money of nums) {
    const current = Math.max(oneBack, twoBack + money); // skip vs take
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}`,
          tests: [
            { name: "[1,2,3,1] → 4", code: "return rob([1,2,3,1]) === 4;" },
            { name: "[2,7,9,3,1] → 12", code: "return rob([2,7,9,3,1]) === 12;" },
            { name: "single house → its money", code: "return rob([5]) === 5;" },
            { name: "[2,1,1,2] → 4 (skipping two in a row can be best)", code: "return rob([2,1,1,2]) === 4;" },
            {
              name: "50,000 houses → 50,000, fast",
              code: "const h = Array.from({length: 50000}, (_, i) => i % 2 === 0 ? 2 : 1); const t0 = performance.now(); return rob(h) === 50000 && performance.now() - t0 < 300;",
            },
          ],
          hint: "`best(i) = max(best(i-1), best(i-2) + nums[i])`. You only need the last two values.",
        },
        {
          type: "p",
          text: "Decode Ways is Climbing Stairs in disguise: at each position you take a 1-digit step or a 2-digit step, but some steps are **illegal** (`\"0\"` alone, or a pair above `26`). Each `dp[i]` adds only the legal options.",
        },
        {
          type: "challenge",
          title: "Decode Ways",
          difficulty: "medium",
          tags: ["dp", "1d", "string"],
          prompt: "A message of letters was encoded with `A → \"1\"`, `B → \"2\"`, …, `Z → \"26\"`. Given the digit string `s`, return the number of ways to decode it. A group can't have a leading zero (`\"06\"` is not a letter), and `\"0\"` alone is invalid. If no decoding exists, return `0`.",
          examples: [
            { input: "s = \"12\"", output: "2", explanation: "\"AB\" (1 2) or \"L\" (12)" },
            { input: "s = \"226\"", output: "3", explanation: "2 2 6, 22 6, 2 26" },
            { input: "s = \"06\"", output: "0" },
          ],
          constraints: ["1 <= s.length <= 100", "s contains only digits", "the answer fits in a 32-bit integer"],
          complexity: "O(n) time, O(1) space",
          starter: `function numDecodings(s) {
  // your code here
}`,
          solution: `function numDecodings(s) {
  // dp[i] = ways to decode the first i characters
  let twoBack = 1;                          // dp[0]: the empty prefix
  let oneBack = s[0] === "0" ? 0 : 1;       // dp[1]
  for (let i = 2; i <= s.length; i++) {
    let current = 0;
    if (s[i - 1] !== "0") current += oneBack;           // one-digit step
    const pair = Number(s.slice(i - 2, i));
    if (pair >= 10 && pair <= 26) current += twoBack;   // two-digit step
    twoBack = oneBack;
    oneBack = current;
  }
  return oneBack;
}`,
          tests: [
            { name: "\"12\" → 2", code: "return numDecodings('12') === 2;" },
            { name: "\"226\" → 3", code: "return numDecodings('226') === 3;" },
            { name: "leading zero \"06\" → 0", code: "return numDecodings('06') === 0 && numDecodings('0') === 0;" },
            { name: "zeros must pair: \"10\" → 1, \"2101\" → 1, \"11106\" → 2", code: "return numDecodings('10') === 1 && numDecodings('2101') === 1 && numDecodings('11106') === 2;" },
            { name: "\"27\" → 1 and \"100\" → 0", code: "return numDecodings('27') === 1 && numDecodings('100') === 0;" },
            {
              name: "forty 1s → 165,580,141 ways, fast",
              code: "const t0 = performance.now(); return numDecodings('1'.repeat(40)) === 165580141 && performance.now() - t0 < 200;",
            },
          ],
          hint: "`dp[i]` = ways for the first `i` digits. Add `dp[i-1]` if digit `i-1` isn't `0`; add `dp[i-2]` if the two digits ending at `i-1` form 10..26.",
        },
        {
          type: "p",
          text: "Until now each state looked back a **fixed** distance. In Coin Change, `dp[a]` looks back by every coin value: \"the fewest coins for amount `a` is 1 + the fewest for `a - coin`, for the best coin\". Unreachable amounts stay at `Infinity`.",
        },
        {
          type: "challenge",
          title: "Coin Change",
          difficulty: "medium",
          tags: ["dp", "1d", "unbounded knapsack"],
          prompt: "Given coin denominations `coins` (unlimited supply of each) and an `amount`, return the **fewest** coins that add up to exactly `amount`, or `-1` if it can't be done.",
          examples: [
            { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "5 + 5 + 1" },
            { input: "coins = [2], amount = 3", output: "-1" },
            { input: "coins = [1], amount = 0", output: "0" },
          ],
          constraints: ["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"],
          complexity: "O(amount · coins) time, O(amount) space",
          starter: `function coinChange(coins, amount) {
  // your code here
}`,
          solution: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);   // dp[a] = fewest coins for a
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const coin of coins) {
      if (coin <= a && dp[a - coin] + 1 < dp[a]) dp[a] = dp[a - coin] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
          tests: [
            { name: "[1,2,5], 11 → 3", code: "return coinChange([1,2,5], 11) === 3;" },
            { name: "impossible: [2], 3 → -1", code: "return coinChange([2], 3) === -1;" },
            { name: "amount 0 → 0 coins", code: "return coinChange([1], 0) === 0;" },
            { name: "greedy fails here: [1,3,4], 6 → 2 (3+3), not 3 (4+1+1)", code: "return coinChange([1,3,4], 6) === 2;" },
            {
              name: "[186,419,83,408], 6249 → 20, fast",
              code: "const t0 = performance.now(); return coinChange([186,419,83,408], 6249) === 20 && performance.now() - t0 < 300;",
            },
          ],
          hint: "`dp[0] = 0`, everything else `Infinity`. For each amount `a` from 1 up, try every coin: `dp[a] = min(dp[a], dp[a - coin] + 1)`.",
        },
        {
          type: "p",
          text: "Word Break is a yes/no DP over **prefixes**: `dp[i]` is `true` if the first `i` characters can be split into dictionary words. It's true when some earlier split point `j` is true *and* `s.slice(j, i)` is a word.",
        },
        {
          type: "challenge",
          title: "Word Break",
          difficulty: "medium",
          tags: ["dp", "1d", "string", "hash set"],
          prompt: "Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be split into a sequence of one or more dictionary words (words can be reused), `false` otherwise.",
          examples: [
            { input: "s = \"clientinvoice\", wordDict = [\"client\",\"invoice\"]", output: "true" },
            { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true", explanation: "words may be reused" },
            { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false" },
          ],
          constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "lowercase letters"],
          complexity: "O(n² · L) time with string slicing (L = max word length), O(n) space",
          starter: `function wordBreak(s, wordDict) {
  // your code here
}`,
          solution: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);   // dp[i]: s.slice(0, i) is breakable
  dp[0] = true;                                      // the empty prefix
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i; j++) {
      if (dp[j] && words.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}`,
          tests: [
            { name: "\"clientinvoice\" → true", code: "return wordBreak('clientinvoice', ['client','invoice']) === true;" },
            { name: "reuse words: \"applepenapple\" → true", code: "return wordBreak('applepenapple', ['apple','pen']) === true;" },
            { name: "\"catsandog\" → false", code: "return wordBreak('catsandog', ['cats','dog','sand','and','cat']) === false;" },
            { name: "greedy longest-match fails here: \"aaaab\" with [aaaa, aaa, ab] → true (aaa + ab)", code: "return wordBreak('aaaab', ['aaaa','aaa','ab']) === true;" },
            { name: "\"aaaaab\" with [aaaa, aa, b] → false (five a's can't be built from 4s and 2s)", code: "return wordBreak('aaaaab', ['aaaa','aa','b']) === false;" },
            {
              name: "300 a's then b, with [a, aa, aaa, aaaa] → false, fast (no exponential retries)",
              code: "const t0 = performance.now(); return wordBreak('a'.repeat(300) + 'b', ['a','aa','aaa','aaaa']) === false && performance.now() - t0 < 500;",
            },
          ],
          hint: "`dp[0] = true`. For each end `i`, look for a split `j < i` with `dp[j]` true and `s.slice(j, i)` in the `Set`.",
        },
        {
          type: "p",
          text: "Last, a DP where the answer isn't in `dp[n]`. In Longest Increasing Subsequence, define `dp[i]` = length of the longest increasing subsequence **ending at** index `i`. It extends the best `dp[j]` with `j < i` and `nums[j] < nums[i]`. The answer is the max over all `i`.",
        },
        {
          type: "challenge",
          title: "Longest Increasing Subsequence",
          difficulty: "medium",
          tags: ["dp", "1d"],
          prompt: "Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence. A subsequence keeps the original order but may skip elements.",
          examples: [
            { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "for example [2,3,7,101]" },
            { input: "nums = [0,1,0,3,2,3]", output: "4" },
            { input: "nums = [7,7,7,7]", output: "1" },
          ],
          constraints: ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
          complexity: "O(n²) time, O(n) space (O(n log n) possible, see below)",
          starter: `function lengthOfLIS(nums) {
  // your code here
}`,
          solution: `function lengthOfLIS(nums) {
  const dp = new Array(nums.length).fill(1);   // dp[i]: LIS ending exactly at i
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}`,
          tests: [
            { name: "[10,9,2,5,3,7,101,18] → 4", code: "return lengthOfLIS([10,9,2,5,3,7,101,18]) === 4;" },
            { name: "[0,1,0,3,2,3] → 4", code: "return lengthOfLIS([0,1,0,3,2,3]) === 4;" },
            { name: "all equal → 1 (strictly increasing)", code: "return lengthOfLIS([7,7,7,7]) === 1;" },
            { name: "single element and decreasing array → 1", code: "return lengthOfLIS([42]) === 1 && lengthOfLIS([5,4,3,2,1]) === 1;" },
            {
              name: "3000 numbers (0..999 three times) → 1000, fast",
              code: "const a = Array.from({length: 3000}, (_, i) => i % 1000); const t0 = performance.now(); return lengthOfLIS(a) === 1000 && performance.now() - t0 < 500;",
            },
          ],
          hint: "`dp[i]` starts at 1 (just `nums[i]`). For every earlier `j` with a smaller value, `dp[i] = max(dp[i], dp[j] + 1)`. Return the largest `dp[i]`.",
        },
        {
          type: "callout",
          tone: "info",
          title: "Follow-up: LIS in O(n log n)",
          text: "Keep an array `tails` where `tails[k]` is the smallest possible last value of an increasing subsequence of length `k + 1`. For each number, binary-search the first tail `>=` it and replace it (or append if none). `tails.length` is the answer. It's not obvious, so interviewers accept O(n²) first and ask for this as a follow-up.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Memoization in React and Next.js",
          text: "Memoization is DP's top-down half, and you use it daily: `useMemo` caches a computed value by its dependencies, `React.cache` dedupes a data fetch per request in Server Components, and Next.js caches `fetch` results. The rule is the same as in DP: caching is only correct when the output depends **only** on the inputs you key the cache by. Forget a dependency and you get stale answers, exactly like a DP state that's missing a dimension.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What's the difference between memoization and tabulation?",
              options: [
                "Memoization is top-down recursion with a cache; tabulation fills a table bottom-up with loops",
                "Memoization is always faster",
                "Tabulation only works for 2D problems",
                "They solve different kinds of problems",
              ],
              answer: 0,
              why: "Both compute each subproblem once. Memoization keeps the recursive shape (and its stack depth); tabulation orders the computations explicitly and often allows O(1) space.",
            },
            {
              q: "What's the time complexity of Coin Change with the bottom-up DP?",
              options: ["O(amount)", "O(2^amount)", "O(amount · number of coins)", "O(amount²)"],
              answer: 2,
              why: "There are `amount + 1` states and each tries every coin.",
            },
            {
              q: "In LIS, why is the answer `max(dp)` and not `dp[n - 1]`?",
              options: [
                "Because the array must be sorted first",
                "Because dp[i] is the best subsequence ending exactly at i, and the best one may end anywhere",
                "Because dp[n - 1] is always 1",
                "It's a micro-optimisation",
              ],
              answer: 1,
              why: "The state is \"ending at i\". The longest increasing subsequence doesn't have to end on the last element.",
            },
            {
              q: "Which phrase most strongly suggests DP over backtracking?",
              options: ["\"Return all combinations\"", "\"List every path\"", "\"Print each valid board\"", "\"Return the number of ways\""],
              answer: 3,
              why: "Counting (or min/max) only needs a number per subproblem, which DP can cache. Listing every answer needs backtracking because the output itself is exponential.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Dynamic programming 2D
    // ─────────────────────────────────────────────────────────────
    {
      slug: "dp-2d",
      title: "Dynamic programming in 2D",
      summary: "Grids and two-sequence problems: when one index isn't enough, the state becomes dp[i][j].",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "Some problems need **two** numbers to describe a subproblem: a row and a column in a grid, or \"the first `i` characters of one string and the first `j` of another\". The DP recipe doesn't change; the table just becomes 2D, and the order of filling becomes \"row by row, left to right\" so that the cells above and to the left are ready.",
        },
        { type: "h", text: "Recognise it" },
        {
          type: "list",
          items: [
            "**Grid paths**: move only right/down, count paths or minimise cost. State: `dp[r][c]`.",
            "**Two strings or arrays**: common subsequence, edit distance, interleaving, matching. State: `dp[i][j]` for prefixes `a.slice(0, i)` and `b.slice(0, j)`.",
            "**Items + capacity** (knapsack): \"using the first `i` items, can I reach sum `s`?\". State: `dp[i][s]`, usually compressed to 1D.",
            "**Intervals of one string**: palindromes, burst balloons. State: `dp[i][j]` for the substring from `i` to `j`.",
          ],
        },
        { type: "h", text: "A grid DP, traced" },
        {
          type: "p",
          text: "Count the paths from the top-left to the bottom-right of a grid, moving only right or down, avoiding obstacles (`1`). The last move into `(r, c)` came from above or from the left, so `dp[r][c] = dp[r-1][c] + dp[r][c-1]`, and an obstacle cell has `0` paths. For a 3×3 grid with an obstacle in the centre:",
        },
        {
          type: "table",
          rows: [
            ["dp", "col 0", "col 1", "col 2"],
            ["row 0", "1 (start)", "1", "1"],
            ["row 1", "1", "0 (obstacle)", "1 + 0 = 1"],
            ["row 2", "1", "0 + 1 = 1", "1 + 1 = **2**"],
          ],
        },
        {
          type: "run",
          title: "unique paths with obstacles, printing the table",
          code: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) dp[r][c] = 0;            // blocked
      else if (r === 0 && c === 0) dp[r][c] = 1;     // start
      else dp[r][c] = (r > 0 ? dp[r - 1][c] : 0) + (c > 0 ? dp[r][c - 1] : 0);
    }
  }
  for (const row of dp) console.log(row.map((v) => String(v).padStart(3)).join(""));
  return dp[rows - 1][cols - 1];
}

console.log("answer:", uniquePathsWithObstacles([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
]));
console.log("answer:", uniquePathsWithObstacles([
  [0, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 0, 1],
  [1, 0, 0, 0],
]));`,
        },
        {
          type: "compare",
          left: {
            label: "Recursion without memo",
            lang: "js",
            code: `function paths(r, c) {
  if (r === 0 || c === 0) return 1;
  return paths(r - 1, c) + paths(r, c - 1);
}
// the same (r, c) is recomputed through
// many routes: O(2^(m+n)) time`,
          },
          right: {
            label: "Table, one row at a time",
            lang: "js",
            code: `function paths(m, n) {
  const row = new Array(n).fill(1);   // first row
  for (let r = 1; r < m; r++)
    for (let c = 1; c < n; c++)
      row[c] += row[c - 1];  // above (old row[c]) + left
  return row[n - 1];
}
// O(m · n) time, O(n) space`,
          },
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rolling rows",
          text: "When `dp[r][c]` only reads the current row and the previous one, keep a single 1D array: before you overwrite `row[c]` it still holds the value from the row above, and `row[c - 1]` already holds the current row's left neighbour. That turns O(m·n) space into O(n).",
        },
        {
          type: "challenge",
          title: "Unique Paths",
          difficulty: "medium",
          tags: ["dp", "2d", "grid"],
          prompt: "A robot starts at the top-left of an `m × n` grid and can only move **right** or **down**. How many distinct paths lead to the bottom-right corner?",
          examples: [
            { input: "m = 3, n = 7", output: "28" },
            { input: "m = 3, n = 2", output: "3", explanation: "right-down-down, down-right-down, down-down-right" },
          ],
          constraints: ["1 <= m, n <= 100", "the answer fits in a safe integer for the tested sizes"],
          complexity: "O(m · n) time, O(n) space",
          starter: `function uniquePaths(m, n) {
  // your code here
}`,
          solution: `function uniquePaths(m, n) {
  const row = new Array(n).fill(1);       // row 0: one way to reach each cell
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      row[c] += row[c - 1];               // from above + from the left
    }
  }
  return row[n - 1];
}`,
          tests: [
            { name: "3 × 7 → 28", code: "return uniquePaths(3, 7) === 28;" },
            { name: "3 × 2 → 3", code: "return uniquePaths(3, 2) === 3;" },
            { name: "1 × 1 → 1, 1 × 10 → 1", code: "return uniquePaths(1, 1) === 1 && uniquePaths(1, 10) === 1;" },
            {
              name: "18 × 18 → 2,333,606,220, fast (recursion would make billions of calls)",
              code: "const t0 = performance.now(); return uniquePaths(18, 18) === 2333606220 && performance.now() - t0 < 200;",
            },
          ],
          hint: "The first row and first column have exactly 1 path each. Every other cell: paths from above + paths from the left.",
        },
        {
          type: "challenge",
          title: "Minimum Path Sum",
          difficulty: "medium",
          tags: ["dp", "2d", "grid"],
          prompt: "Given an `m × n` grid of non-negative numbers, find a path from the top-left to the bottom-right (moving only right or down) that minimises the **sum** of the numbers along it, including both corners. Return that sum.",
          examples: [
            { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", output: "7", explanation: "1 → 3 → 1 → 1 → 1" },
            { input: "grid = [[1,2,3],[4,5,6]]", output: "12" },
          ],
          constraints: ["1 <= m, n <= 200", "0 <= grid[i][j] <= 200"],
          complexity: "O(m · n) time, O(n) space",
          starter: `function minPathSum(grid) {
  // your code here
}`,
          solution: `function minPathSum(grid) {
  const rows = grid.length, cols = grid[0].length;
  const dp = new Array(cols).fill(Infinity);   // dp[c]: best sum to reach (r, c)
  dp[0] = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const fromLeft = c > 0 ? dp[c - 1] : Infinity;
      dp[c] = Math.min(dp[c], fromLeft) + grid[r][c];  // dp[c] still holds "from above"
    }
  }
  return dp[cols - 1];
}`,
          tests: [
            { name: "example 1 → 7", code: "return minPathSum([[1,3,1],[1,5,1],[4,2,1]]) === 7;" },
            { name: "example 2 → 12", code: "return minPathSum([[1,2,3],[4,5,6]]) === 12;" },
            { name: "single cell → its value", code: "return minPathSum([[5]]) === 5;" },
            { name: "single column → the sum of the column", code: "return minPathSum([[1],[2],[3]]) === 6;" },
            {
              name: "200 × 200 grid of 1s → 399, fast",
              code: "const g = Array.from({length: 200}, () => new Array(200).fill(1)); const t0 = performance.now(); return minPathSum(g) === 399 && performance.now() - t0 < 300;",
            },
          ],
          hint: "Same table as Unique Paths, but `dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])`. Watch the first row and column: they have only one neighbour.",
        },
        { type: "h", text: "Two sequences: dp[i][j] over prefixes" },
        {
          type: "p",
          text: "For two strings `a` and `b`, let `dp[i][j]` be the answer for the prefixes `a.slice(0, i)` and `b.slice(0, j)`. Make the table `(a.length + 1) × (b.length + 1)` so row 0 and column 0 represent the **empty prefix**, which gives clean base cases. Then compare the last characters, `a[i-1]` and `b[j-1]`: if they match, extend the diagonal `dp[i-1][j-1]`; if not, take the best of dropping one character from either side, `dp[i-1][j]` or `dp[i][j-1]`.",
        },
        {
          type: "challenge",
          title: "Longest Common Subsequence",
          difficulty: "medium",
          tags: ["dp", "2d", "string"],
          prompt: "Given two strings `text1` and `text2`, return the length of their longest **common subsequence** (characters appearing in both, in the same order, not necessarily contiguous). Return `0` if there is none.",
          examples: [
            { input: "text1 = \"abcde\", text2 = \"ace\"", output: "3", explanation: "\"ace\"" },
            { input: "text1 = \"abc\", text2 = \"def\"", output: "0" },
          ],
          constraints: ["1 <= text1.length, text2.length <= 1000", "lowercase letters"],
          complexity: "O(m · n) time, O(n) space",
          starter: `function longestCommonSubsequence(text1, text2) {
  // your code here
}`,
          solution: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  let prev = new Array(n + 1).fill(0);           // row i-1
  for (let i = 1; i <= m; i++) {
    const curr = new Array(n + 1).fill(0);       // row i (curr[0] = empty prefix)
    for (let j = 1; j <= n; j++) {
      curr[j] = text1[i - 1] === text2[j - 1]
        ? prev[j - 1] + 1                        // match: extend the diagonal
        : Math.max(prev[j], curr[j - 1]);        // drop a char from one side
    }
    prev = curr;
  }
  return prev[n];
}`,
          tests: [
            { name: "\"abcde\" / \"ace\" → 3", code: "return longestCommonSubsequence('abcde', 'ace') === 3;" },
            { name: "identical strings → full length", code: "return longestCommonSubsequence('abc', 'abc') === 3;" },
            { name: "nothing in common → 0", code: "return longestCommonSubsequence('abc', 'def') === 0;" },
            { name: "order matters: \"abc\" / \"cba\" → 1", code: "return longestCommonSubsequence('abc', 'cba') === 1;" },
            {
              name: "two 1000-char strings → 999, fast",
              code: "const t0 = performance.now(); return longestCommonSubsequence('ab'.repeat(500), 'ba'.repeat(500)) === 999 && performance.now() - t0 < 500;",
            },
          ],
          hint: "If `text1[i-1] === text2[j-1]`, `dp[i][j] = dp[i-1][j-1] + 1`; else `max(dp[i-1][j], dp[i][j-1])`. Row and column 0 are all zeros.",
        },
        {
          type: "p",
          text: "Palindromes are an *interval* DP: `s[i..j]` is a palindrome when `s[i] === s[j]` and `s[i+1..j-1]` is one. You could fill that `n × n` boolean table, but there's a lighter way built on the same insight: every palindrome has a **centre** (a character, or a gap between two equal characters). Expand outward from each of the `2n - 1` centres while the ends match. Same O(n²) time, O(1) space.",
        },
        {
          type: "challenge",
          title: "Longest Palindromic Substring",
          difficulty: "medium",
          tags: ["dp", "string", "expand around center"],
          prompt: "Given a string `s`, return its longest **contiguous** substring that reads the same forwards and backwards. If several have the maximum length, return any of them.",
          examples: [
            { input: "s = \"babad\"", output: "\"bab\"", explanation: "\"aba\" is also accepted" },
            { input: "s = \"cbbd\"", output: "\"bb\"" },
          ],
          constraints: ["1 <= s.length <= 3000", "letters and digits"],
          complexity: "O(n²) time, O(1) extra space",
          starter: `function longestPalindrome(s) {
  // your code here
}`,
          solution: `function longestPalindrome(s) {
  let start = 0, bestLen = 1;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    const len = right - left - 1;                 // the loop overshot by one on each side
    if (len > bestLen) {
      bestLen = len;
      start = left + 1;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);        // odd length: centre on a character
    expand(i, i + 1);    // even length: centre between two characters
  }
  return s.slice(start, start + bestLen);
}`,
          tests: [
            { name: "\"babad\" → \"bab\" or \"aba\"", code: "const r = longestPalindrome('babad'); return r === 'bab' || r === 'aba';" },
            { name: "even-length centre: \"cbbd\" → \"bb\"", code: "return longestPalindrome('cbbd') === 'bb';" },
            { name: "single character", code: "return longestPalindrome('a') === 'a';" },
            { name: "no repeats: \"ac\" → \"a\" or \"c\"", code: "const r = longestPalindrome('ac'); return r === 'a' || r === 'c';" },
            { name: "palindrome in the middle: \"forgeeksskeegfor\" → \"geeksskeeg\"", code: "return longestPalindrome('forgeeksskeegfor') === 'geeksskeeg';" },
            {
              name: "3000 chars \"abab…\" → a 2999-char palindrome, fast",
              code: "const s = 'ab'.repeat(1500); const t0 = performance.now(); const r = longestPalindrome(s); return r.length === 2999 && s.includes(r) && r === [...r].reverse().join('') && performance.now() - t0 < 500;",
            },
          ],
          hint: "For each index, expand around `(i, i)` and `(i, i + 1)` while the characters at both ends match. Track the longest window you saw.",
        },
        {
          type: "p",
          text: "**0/1 knapsack**: each item can be used **at most once** and you ask which sums (or values) are reachable. The full table is `dp[i][s]` = \"can the first `i` numbers make sum `s`?\". Row `i` only reads row `i - 1`, so you keep one boolean array, and iterate `s` **downwards** so that `dp[s - x]` still refers to the previous row (iterating upwards would let you use the same item twice, which is the *unbounded* knapsack from Coin Change).",
        },
        {
          type: "challenge",
          title: "Partition Equal Subset Sum",
          difficulty: "medium",
          tags: ["dp", "0/1 knapsack"],
          prompt: "Given an array of positive integers `nums`, return `true` if it can be split into two groups with **equal sums**, `false` otherwise. Every number goes in exactly one group.",
          examples: [
            { input: "nums = [1,5,11,5]", output: "true", explanation: "[1,5,5] and [11]" },
            { input: "nums = [1,2,3,5]", output: "false" },
          ],
          constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
          complexity: "O(n · sum) time, O(sum) space",
          starter: `function canPartition(nums) {
  // your code here
}`,
          solution: `function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) return false;            // odd totals can't split evenly
  const target = total / 2;
  const reachable = new Array(target + 1).fill(false);
  reachable[0] = true;                          // the empty group
  for (const x of nums) {
    for (let s = target; s >= x; s--) {         // downwards: each number used once
      if (reachable[s - x]) reachable[s] = true;
    }
  }
  return reachable[target];
}`,
          tests: [
            { name: "[1,5,11,5] → true", code: "return canPartition([1,5,11,5]) === true;" },
            { name: "[1,2,3,5] → false (even total, no split)", code: "return canPartition([1,2,3,5]) === false;" },
            { name: "single number → false; [1,1] → true", code: "return canPartition([2]) === false && canPartition([1,1]) === true;" },
            { name: "each number at most once: [1,2,5] → false", code: "return canPartition([1,2,5]) === false;" },
            {
              name: "200 numbers → true and false cases, fast",
              code: "const yes = Array.from({length: 200}, (_, i) => (i % 100) + 1); const no = new Array(199).fill(3).concat([1]); const t0 = performance.now(); return canPartition(yes) === true && canPartition(no) === false && performance.now() - t0 < 500;",
            },
          ],
          hint: "It's \"can some subset reach `total / 2`?\". Keep `reachable[s]` booleans; for each number `x`, for `s` from the target **down** to `x`, `reachable[s] ||= reachable[s - x]`.",
        },
        {
          type: "p",
          text: "The final boss of two-sequence DP. To turn `word1` into `word2` you can insert, delete or replace a character. Comparing the last characters of the prefixes: if equal, no operation needed (`dp[i-1][j-1]`); otherwise pay 1 and take the cheapest of **replace** (`dp[i-1][j-1]`), **delete** from word1 (`dp[i-1][j]`) or **insert** into word1 (`dp[i][j-1]`). Base cases: turning a prefix into the empty string costs its length.",
        },
        {
          type: "challenge",
          title: "Edit Distance",
          difficulty: "hard",
          tags: ["dp", "2d", "string"],
          prompt: "Given two strings `word1` and `word2`, return the minimum number of operations needed to convert `word1` into `word2`. Allowed operations: insert a character, delete a character, replace a character.",
          examples: [
            { input: "word1 = \"horse\", word2 = \"ros\"", output: "3", explanation: "horse → rorse (replace h) → rose (delete r) → ros (delete e)" },
            { input: "word1 = \"intention\", word2 = \"execution\"", output: "5" },
          ],
          constraints: ["0 <= word1.length, word2.length <= 500", "lowercase letters"],
          complexity: "O(m · n) time, O(n) space",
          starter: `function minDistance(word1, word2) {
  // your code here
}`,
          solution: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);   // "" → word2 prefix: j inserts
  for (let i = 1; i <= m; i++) {
    const curr = [i];                                      // word1 prefix → "": i deletes
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        curr[j] = prev[j - 1];                             // free
      } else {
        curr[j] = 1 + Math.min(
          prev[j - 1],   // replace
          prev[j],       // delete from word1
          curr[j - 1],   // insert into word1
        );
      }
    }
    prev = curr;
  }
  return prev[n];
}`,
          tests: [
            { name: "\"horse\" → \"ros\" in 3", code: "return minDistance('horse', 'ros') === 3;" },
            { name: "\"intention\" → \"execution\" in 5", code: "return minDistance('intention', 'execution') === 5;" },
            { name: "empty strings: \"\" → \"abc\" is 3 inserts, \"abc\" → \"\" is 3 deletes", code: "return minDistance('', 'abc') === 3 && minDistance('abc', '') === 3 && minDistance('', '') === 0;" },
            { name: "same word → 0; kitten → sitting → 3", code: "return minDistance('same', 'same') === 0 && minDistance('kitten', 'sitting') === 3;" },
            {
              name: "two 500-char strings → 500, fast",
              code: "const t0 = performance.now(); return minDistance('a'.repeat(500), 'b'.repeat(500)) === 500 && performance.now() - t0 < 500;",
            },
          ],
          hint: "Table `(m+1) × (n+1)`. Row 0 is `0..n`, column 0 is `0..m`. Equal last chars → copy the diagonal; otherwise `1 + min(diagonal, up, left)`.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Diffs, fuzzy search and React",
          text: "`git diff` is built on a longest-common-subsequence-style algorithm (Myers' diff) over lines. Typo-tolerant client search (\"Did you mean *Boulangerie Rhéa*?\") is edit distance: Supabase's Postgres ships the `fuzzystrmatch` extension with a `levenshtein()` function. And React's reconciliation deliberately *avoids* a full tree edit distance (O(n³)); it uses heuristics plus your `key` props to stay O(n). That's why stable keys matter.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "In LCS, why is the table (m + 1) × (n + 1) instead of m × n?",
              options: [
                "To avoid off-by-one errors in JavaScript arrays",
                "Row and column 0 represent empty prefixes, giving base cases of 0 without special-casing",
                "Because JavaScript arrays start at 1",
                "To store the final answer separately",
              ],
              answer: 1,
              why: "`dp[0][j]` and `dp[i][0]` compare against an empty string, so they're 0 (LCS) or j / i (edit distance). The recurrence then works for every other cell.",
            },
            {
              q: "In the 1D 0/1 knapsack, why must the inner loop over sums go downwards?",
              options: [
                "It's faster",
                "To process larger sums first for an early exit",
                "So that dp[s - x] still holds the previous item's row and each item is used at most once",
                "It doesn't matter",
              ],
              answer: 2,
              why: "Going upwards would read a `dp[s - x]` already updated with the current item, allowing the item twice (that's the unbounded variant).",
            },
            {
              q: "What's the time complexity of Edit Distance for strings of lengths m and n?",
              options: ["O(m + n)", "O(3^(m+n))", "O(m · n · log n)", "O(m · n)"],
              answer: 3,
              why: "There are (m + 1)(n + 1) states and each is computed in O(1) from three neighbours.",
            },
            {
              q: "You need the number of right/down paths through an m × n grid. What does dp[r][c] depend on?",
              options: ["dp[r-1][c] and dp[r][c-1]", "dp[r+1][c] and dp[r][c+1]", "All cells in row r", "Only dp[r-1][c-1]"],
              answer: 0,
              why: "The last move into (r, c) came from above or from the left.",
            },
          ],
        },
      ],
    },
    // ─────────────────────────────────────────────────────────────
    // 7. Greedy & bit manipulation (+ interview playbook)
    // ─────────────────────────────────────────────────────────────
    {
      slug: "greedy-and-bits",
      title: "Greedy, bit manipulation & the interview playbook",
      summary: "When the locally best choice is globally best, how to prove it, the bit tricks interviewers love, and a cheat sheet to pick the right pattern fast.",
      minutes: 15,
      blocks: [
        {
          type: "p",
          text: "A **greedy** algorithm makes the choice that looks best *right now* and never reconsiders it. When it works, it's usually the simplest and fastest solution (often one pass, O(n)). The catch: it only works for problems with the right structure, and you need a reason to believe it before you code it.",
        },
        { type: "h", text: "When does greedy work?" },
        {
          type: "p",
          text: "The standard argument is the **exchange argument**: take any optimal solution that *differs* from the greedy one at the first choice, and show you can swap in the greedy choice without making it worse. Repeat, and the optimal solution becomes the greedy one, so greedy is optimal. If you can't make that argument, or you can find a small counter-example, use DP.",
        },
        {
          type: "run",
          title: "greedy coin change: right for some coin systems, wrong for others",
          code: `function greedyCoins(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a);   // biggest first
  const used = [];
  for (const coin of sorted) {
    while (amount >= coin) {
      amount -= coin;
      used.push(coin);
    }
  }
  return amount === 0 ? used : null;
}

function dpCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount];
}

// Canadian coins (in cents): greedy is optimal for this system
console.log("CAD 65¢ greedy:", greedyCoins([5, 10, 25, 100, 200], 65), "| DP count:", dpCoins([5, 10, 25, 100, 200], 65));

// A weird coin system: greedy grabs the 4 and gets stuck with 1 + 1
console.log("[1,3,4] for 6 greedy:", greedyCoins([1, 3, 4], 6), "| DP count:", dpCoins([1, 3, 4], 6), "(3 + 3)");`,
        },
        {
          type: "table",
          rows: [
            ["Problem", "Greedy choice", "Why it's safe"],
            ["Maximum Subarray (Kadane)", "drop the running sum when it goes negative", "a negative prefix can only lower any sum that extends it"],
            ["Jump Game", "track the farthest index reachable so far", "any index ≤ farthest is reachable; nothing else matters"],
            ["Interval scheduling (max meetings)", "pick the meeting that ends earliest", "exchange: ending earlier never blocks more meetings"],
            ["Coin change, arbitrary coins", "biggest coin first", "**not** safe: [1,3,4] for 6 is a counter-example → DP"],
          ],
        },
        { type: "h", text: "Kadane's algorithm, traced" },
        {
          type: "p",
          text: "For the best subarray sum, keep `current` = the best sum of a subarray **ending here**. At each number, either extend the previous subarray or start fresh: `current = max(x, current + x)`. That's a one-variable DP whose choice is greedy: a negative running sum is never worth keeping.",
        },
        {
          type: "table",
          rows: [
            ["i", "x", "current = max(x, current + x)", "best"],
            ["0", "-2", "-2", "-2"],
            ["1", "1", "max(1, -1) = 1 (restart)", "1"],
            ["2", "-3", "max(-3, -2) = -2", "1"],
            ["3", "4", "max(4, 2) = 4 (restart)", "4"],
            ["4", "-1", "3", "4"],
            ["5", "2", "5", "5"],
            ["6", "1", "6", "**6**"],
            ["7", "-5", "1", "6"],
            ["8", "4", "5", "6"],
          ],
        },
        {
          type: "compare",
          left: {
            label: "Brute force: every subarray",
            lang: "js",
            code: `function maxSubArray(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}
// O(n²) time, O(1) space`,
          },
          right: {
            label: "Kadane: extend or restart",
            lang: "js",
            code: `function maxSubArray(nums) {
  let current = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);
    best = Math.max(best, current);
  }
  return best;
}
// O(n) time, O(1) space`,
          },
        },
        {
          type: "challenge",
          title: "Maximum Subarray",
          difficulty: "medium",
          tags: ["greedy", "kadane", "dp"],
          prompt: "Given an integer array `nums` (daily profit and loss of a campaign, say), return the largest sum of a **non-empty contiguous** subarray.",
          examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1]" },
            { input: "nums = [5,4,-1,7,8]", output: "23" },
            { input: "nums = [-3,-1,-2]", output: "-1", explanation: "the subarray can't be empty" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function maxSubArray(nums) {
  // your code here
}`,
          solution: `function maxSubArray(nums) {
  let current = nums[0];
  let best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    current = Math.max(nums[i], current + nums[i]);  // extend or restart
    best = Math.max(best, current);
  }
  return best;
}`,
          tests: [
            { name: "[-2,1,-3,4,-1,2,1,-5,4] → 6", code: "return maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) === 6;" },
            { name: "everything positive-ish: [5,4,-1,7,8] → 23", code: "return maxSubArray([5,4,-1,7,8]) === 23;" },
            { name: "all negative → the largest single number", code: "return maxSubArray([-3,-1,-2]) === -1;" },
            { name: "single element", code: "return maxSubArray([1]) === 1 && maxSubArray([-7]) === -7;" },
            {
              name: "100,000 numbers → 6, fast (O(n²) would time out)",
              code: "const a = Array.from({length: 100000}, (_, i) => (i % 7) - 3); const t0 = performance.now(); return maxSubArray(a) === 6 && performance.now() - t0 < 300;",
            },
          ],
          hint: "Keep the best sum of a subarray ending at the current index. If adding the current number to it is worse than the number alone, start over at this number.",
        },
        {
          type: "p",
          text: "In Jump Game, you don't need to know *how* you reach an index, only *whether* you can. Walk left to right keeping `farthest`, the furthest index reachable so far. If you ever stand on an index beyond `farthest`, you're stuck.",
        },
        {
          type: "challenge",
          title: "Jump Game",
          difficulty: "medium",
          tags: ["greedy", "array"],
          prompt: "You start at index `0` of `nums`. `nums[i]` is the **maximum** jump length from index `i` (you may jump fewer). Return `true` if you can reach the last index, `false` otherwise.",
          examples: [
            { input: "nums = [2,3,1,1,4]", output: "true", explanation: "0 → 1 → 4" },
            { input: "nums = [3,2,1,0,4]", output: "false", explanation: "every route lands on index 3, whose max jump is 0" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 10^5"],
          complexity: "O(n) time, O(1) space",
          starter: `function canJump(nums) {
  // your code here
}`,
          solution: `function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;              // can't even stand here
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}`,
          tests: [
            { name: "[2,3,1,1,4] → true", code: "return canJump([2,3,1,1,4]) === true;" },
            { name: "[3,2,1,0,4] → false", code: "return canJump([3,2,1,0,4]) === false;" },
            { name: "single index → true (already there)", code: "return canJump([0]) === true;" },
            { name: "stuck at the start: [0,1] → false", code: "return canJump([0,1]) === false;" },
            {
              name: "50,000 huge jumps → true, fast (marking every reachable cell is O(n²))",
              code: "const a = new Array(50000).fill(50000); a[a.length - 1] = 0; const b = new Array(50000).fill(1); b[25000] = 0; const t0 = performance.now(); return canJump(a) === true && canJump(b) === false && performance.now() - t0 < 300;",
            },
          ],
          hint: "One variable: the farthest index you can reach. Update it with `i + nums[i]` as you walk. If `i` ever exceeds it, return false.",
        },
        {
          type: "p",
          text: "Jump Game II asks for the **minimum number of jumps**. Think of it as BFS without a queue: the indices reachable with `k` jumps form a contiguous window. While scanning the current window, track how far the *next* window reaches; when you hit the end of the current window, you must jump: `jumps++`, and the next window begins.",
        },
        {
          type: "challenge",
          title: "Jump Game II",
          difficulty: "medium",
          tags: ["greedy", "bfs levels"],
          prompt: "Same rules as Jump Game, but now the last index is guaranteed to be reachable. Return the **minimum number of jumps** needed to reach it from index `0`.",
          examples: [
            { input: "nums = [2,3,1,1,4]", output: "2", explanation: "0 → 1 → 4" },
            { input: "nums = [2,3,0,1,4]", output: "2" },
          ],
          constraints: ["1 <= nums.length <= 10^5", "0 <= nums[i] <= 1000", "the last index is reachable"],
          complexity: "O(n) time, O(1) space",
          starter: `function jump(nums) {
  // your code here
}`,
          solution: `function jump(nums) {
  let jumps = 0;
  let windowEnd = 0;     // farthest index reachable with \`jumps\` jumps
  let farthest = 0;      // farthest index reachable with one more jump
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === windowEnd) {          // must jump to go any further
      jumps++;
      windowEnd = farthest;
      if (windowEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}`,
          tests: [
            { name: "[2,3,1,1,4] → 2", code: "return jump([2,3,1,1,4]) === 2;" },
            { name: "[2,3,0,1,4] → 2", code: "return jump([2,3,0,1,4]) === 2;" },
            { name: "already at the end → 0", code: "return jump([0]) === 0;" },
            { name: "all ones: [1,1,1,1] → 3", code: "return jump([1,1,1,1]) === 3;" },
            {
              name: "100,000 cells with jumps of 1000 → 100, fast",
              code: "const a = new Array(100000).fill(1000); const t0 = performance.now(); return jump(a) === 100 && performance.now() - t0 < 300;",
            },
          ],
          hint: "Track `windowEnd` (end of what you can reach with the current number of jumps) and `farthest` (best reach seen inside that window). When `i` reaches `windowEnd`, count a jump and move `windowEnd` to `farthest`.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Two greedy facts for Gas Station",
          text: "1) If total gas ≥ total cost, a valid start **exists**. 2) If you start at `s` and run dry arriving at station `i`, then *no* station between `s` and `i` can be the start either (each would arrive at `i` with even less fuel), so jump the candidate straight to `i + 1`. One pass, O(n).",
        },
        {
          type: "challenge",
          title: "Gas Station",
          difficulty: "medium",
          tags: ["greedy", "array"],
          prompt: "Stations are arranged in a **circle**. Station `i` gives you `gas[i]` fuel, and driving from station `i` to station `i + 1` costs `cost[i]`. Your tank starts empty and has no limit. Return the index of the station where you can start and drive around the full circle once, or `-1` if impossible. If a solution exists, it's unique.",
          examples: [
            { input: "gas = [1,2,3,4,5], cost = [3,4,5,1,2]", output: "3" },
            { input: "gas = [2,3,4], cost = [3,4,3]", output: "-1" },
          ],
          constraints: ["1 <= n <= 10^5", "0 <= gas[i], cost[i] <= 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function canCompleteCircuit(gas, cost) {
  // your code here
}`,
          solution: `function canCompleteCircuit(gas, cost) {
  let total = 0;     // overall surplus: decides IF a start exists
  let tank = 0;      // fuel since the current candidate start
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {        // can't reach i + 1 from start, nor from anything in between
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}`,
          tests: [
            { name: "example 1 → start at 3", code: "return canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]) === 3;" },
            { name: "not enough gas overall → -1", code: "return canCompleteCircuit([2,3,4], [3,4,3]) === -1;" },
            { name: "single station with enough gas → 0", code: "return canCompleteCircuit([5], [4]) === 0;" },
            { name: "start must wrap around: [3,1,1], [1,2,2] → 0", code: "return canCompleteCircuit([3,1,1], [1,2,2]) === 0;" },
            {
              name: "100,000 stations, answer is the last one, fast",
              code: "const n = 100000; const gas = new Array(n).fill(1); const cost = new Array(n).fill(1); cost[n - 2] = 2; gas[n - 1] = 2; const t0 = performance.now(); return canCompleteCircuit(gas, cost) === n - 1 && performance.now() - t0 < 300;",
            },
          ],
          hint: "Keep a running `tank` from the current candidate start. When it goes negative at station `i`, the next candidate is `i + 1` and the tank resets. At the end, the total surplus decides between that candidate and -1.",
        },
        { type: "h", text: "Bit manipulation" },
        {
          type: "p",
          text: "Every integer is a row of bits, and bitwise operators work on all of them at once, in O(1). A handful of identities solve a surprising number of problems:",
        },
        {
          type: "table",
          rows: [
            ["Operator / trick", "Example", "Use"],
            ["`a & b` (AND)", "`6 & 3` → `2` (110 & 011 = 010)", "test a bit: `(n >> i) & 1`"],
            ["`a | b` (OR)", "`4 | 1` → `5`", "set a bit: `n | (1 << i)`"],
            ["`a ^ b` (XOR)", "`x ^ x` → `0`, `x ^ 0` → `x`", "cancel pairs, find the odd one out"],
            ["`~a` (NOT)", "`~5` → `-6`", "flip all 32 bits"],
            ["`n & (n - 1)`", "`12 & 11` → `8` (1100 → 1000)", "clear the lowest set bit; `=== 0` ⇔ power of two (for n > 0)"],
            ["`a << k`", "`1 << 3` → `8`", "multiply by 2^k (within 32 bits)"],
            ["`a >> k` vs `a >>> k`", "`-8 >> 1` → `-4`, `-8 >>> 1` → `2147483644`", "signed vs **unsigned** right shift"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "JavaScript's 32-bit surprise",
          text: "JS numbers are 64-bit floats, but every bitwise operator first converts its operands to **32-bit signed** integers. So `1 << 31` is `-2147483648`, and `4294967295 | 0` is `-1`. Only `>>>` produces an **unsigned** result, which is why `x >>> 0` is the idiom to read a 32-bit pattern as an unsigned number. LeetCode's \"unsigned integer\" problems in JS live and die by this.",
        },
        {
          type: "run",
          title: "bits in JavaScript",
          code: `const bin = (n) => (n >>> 0).toString(2).padStart(8, "0");

console.log("6 & 3 =", 6 & 3, "  ", bin(6), "&", bin(3));
console.log("5 ^ 5 =", 5 ^ 5, " 5 ^ 0 =", 5 ^ 0);
console.log("12 & 11 =", 12 & 11, "(lowest set bit of 12 cleared)");
console.log("is 64 a power of two?", 64 > 0 && (64 & 63) === 0);

console.log("--- 32-bit signed surprises ---");
console.log("1 << 31        =", 1 << 31);
console.log("(1 << 31) >>> 0 =", (1 << 31) >>> 0);
console.log("4294967295 | 0 =", 4294967295 | 0);
console.log("-1 >>> 0       =", -1 >>> 0);
console.log("-8 >> 1 =", -8 >> 1, " but -8 >>> 1 =", -8 >>> 1);

// XOR cancels pairs: the client ID that appears once
const ids = [42, 7, 42, 13, 7];
console.log("odd one out:", ids.reduce((acc, id) => acc ^ id, 0));`,
        },
        {
          type: "challenge",
          title: "Single Number",
          difficulty: "easy",
          tags: ["bit manipulation", "xor"],
          prompt: "In a non-empty array of integers, every element appears **twice** except one, which appears once. Return that one. Aim for O(n) time and O(1) extra space.",
          examples: [
            { input: "nums = [2,2,1]", output: "1" },
            { input: "nums = [4,1,2,1,2]", output: "4" },
          ],
          constraints: ["1 <= nums.length <= 3 · 10^4", "-3 · 10^4 <= nums[i] <= 3 · 10^4"],
          complexity: "O(n) time, O(1) space",
          starter: `function singleNumber(nums) {
  // your code here
}`,
          solution: `function singleNumber(nums) {
  let result = 0;
  for (const n of nums) result ^= n;   // pairs cancel out: x ^ x = 0
  return result;
}`,
          tests: [
            { name: "[2,2,1] → 1", code: "return singleNumber([2,2,1]) === 1;" },
            { name: "[4,1,2,1,2] → 4", code: "return singleNumber([4,1,2,1,2]) === 4;" },
            { name: "single element", code: "return singleNumber([1]) === 1;" },
            { name: "negative numbers: [-3,7,7] → -3", code: "return singleNumber([-3,7,7]) === -3 && singleNumber([5,-1,5]) === -1;" },
          ],
          hint: "XOR is commutative and `x ^ x = 0`. XOR everything together.",
        },
        {
          type: "challenge",
          title: "Number of 1 Bits",
          difficulty: "easy",
          tags: ["bit manipulation"],
          prompt: "Given a non-negative integer `n` that fits in **32 unsigned bits** (so it can be as large as `4294967295`), return how many `1` bits its binary representation has (its *Hamming weight*).",
          examples: [
            { input: "n = 11", output: "3", explanation: "1011" },
            { input: "n = 128", output: "1", explanation: "10000000" },
            { input: "n = 4294967293", output: "31", explanation: "11111111111111111111111111111101" },
          ],
          constraints: ["0 <= n <= 2^32 - 1"],
          complexity: "O(number of set bits) time, O(1) space",
          starter: `function hammingWeight(n) {
  // your code here
}`,
          solution: `function hammingWeight(n) {
  let count = 0;
  while (n !== 0) {
    n &= n - 1;     // clears the lowest set bit (works on the 32-bit pattern, even when it reads as negative)
    count++;
  }
  return count;
}`,
          tests: [
            { name: "11 (1011) → 3", code: "return hammingWeight(11) === 3;" },
            { name: "128 → 1, 0 → 0", code: "return hammingWeight(128) === 1 && hammingWeight(0) === 0;" },
            { name: "2147483645 → 30", code: "return hammingWeight(2147483645) === 30;" },
            {
              name: "above 2^31 (the sign bit is set): 4294967293 → 31, 4294967295 → 32",
              code: "return hammingWeight(4294967293) === 31 && hammingWeight(4294967295) === 32;",
            },
          ],
          hint: "`n & (n - 1)` removes exactly one `1` bit; count how many times you can do it. If you shift instead, use `>>>`: with `>>` a number above 2^31 becomes negative and never reaches 0.",
        },
        {
          type: "p",
          text: "Bits and DP combine nicely: `i >> 1` is `i` with its last bit dropped, a smaller number whose answer you've **already computed**. So `bits[i] = bits[i >> 1] + (i & 1)`.",
        },
        {
          type: "challenge",
          title: "Counting Bits",
          difficulty: "easy",
          tags: ["bit manipulation", "dp"],
          prompt: "Given `n`, return an array `ans` of length `n + 1` where `ans[i]` is the number of `1` bits in the binary representation of `i`. Aim for O(n), without counting each number's bits from scratch.",
          examples: [
            { input: "n = 2", output: "[0,1,1]" },
            { input: "n = 5", output: "[0,1,1,2,1,2]" },
          ],
          constraints: ["0 <= n <= 10^5"],
          complexity: "O(n) time, O(n) space for the output",
          starter: `function countBits(n) {
  // your code here
}`,
          solution: `function countBits(n) {
  const ans = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    ans[i] = ans[i >> 1] + (i & 1);   // drop the last bit, add it back if it was 1
  }
  return ans;
}`,
          tests: [
            { name: "n = 2 → [0,1,1]", code: "return deepEqual(countBits(2), [0,1,1]);" },
            { name: "n = 5 → [0,1,1,2,1,2]", code: "return deepEqual(countBits(5), [0,1,1,2,1,2]);" },
            { name: "n = 0 → [0]", code: "return deepEqual(countBits(0), [0]);" },
            {
              name: "n = 100,000: correct spot checks, fast",
              code: "const t0 = performance.now(); const r = countBits(100000); return r.length === 100001 && r[65535] === 16 && r[65536] === 1 && r[99999] === 10 && performance.now() - t0 < 300;",
            },
          ],
          hint: "`ans[i] = ans[i >> 1] + (i & 1)`. The smaller index is always already filled in.",
        },
        {
          type: "challenge",
          title: "Missing Number",
          difficulty: "easy",
          tags: ["bit manipulation", "math"],
          prompt: "`nums` contains `n` **distinct** numbers taken from the range `0..n` (so exactly one number of that range is missing). Return the missing number, in O(n) time and O(1) extra space.",
          examples: [
            { input: "nums = [3,0,1]", output: "2" },
            { input: "nums = [0,1]", output: "2", explanation: "the range is 0..2" },
            { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
          ],
          constraints: ["1 <= n <= 10^5", "all numbers are distinct"],
          complexity: "O(n) time, O(1) space",
          starter: `function missingNumber(nums) {
  // your code here
}`,
          solution: `function missingNumber(nums) {
  let x = nums.length;                 // start with n, the index nums can't hold
  for (let i = 0; i < nums.length; i++) {
    x ^= i ^ nums[i];                  // every present number cancels with its index
  }
  return x;
}`,
          tests: [
            { name: "[3,0,1] → 2", code: "return missingNumber([3,0,1]) === 2;" },
            { name: "the top of the range is missing: [0,1] → 2", code: "return missingNumber([0,1]) === 2;" },
            { name: "[9,6,4,2,3,5,7,0,1] → 8", code: "return missingNumber([9,6,4,2,3,5,7,0,1]) === 8;" },
            { name: "zero is missing: [1] → 0", code: "return missingNumber([1]) === 0;" },
            {
              name: "100,000 numbers in reverse order, fast (no includes() in a loop)",
              code: "const n = 100000; const a = []; for (let i = n; i >= 0; i--) if (i !== 31415) a.push(i); const t0 = performance.now(); return missingNumber(a) === 31415 && performance.now() - t0 < 300;",
            },
          ],
          hint: "XOR all indices `0..n` with all values; everything present cancels out. (The sum formula `n(n+1)/2 - sum` works too.)",
        },
        {
          type: "p",
          text: "Last problem, and the one where JavaScript's 32-bit rules bite hardest. Build the result bit by bit: shift the result left, OR in the lowest bit of `n`, then shift `n` right **unsigned**. At the end the top bit may be set, so the value reads as negative: convert with `>>> 0`.",
        },
        {
          type: "challenge",
          title: "Reverse Bits",
          difficulty: "easy",
          tags: ["bit manipulation"],
          prompt: "Given a 32-bit **unsigned** integer `n` (as a JS number between `0` and `4294967295`), reverse its 32 bits (bit 0 becomes bit 31, and so on) and return the result as an **unsigned** number (never negative).",
          examples: [
            { input: "n = 43261596", output: "964176192", explanation: "00000010100101000001111010011100 → 00111001011110000010100101000000" },
            { input: "n = 4294967293", output: "3221225471", explanation: "11111111111111111111111111111101 → 10111111111111111111111111111111" },
          ],
          constraints: ["0 <= n <= 2^32 - 1"],
          complexity: "O(32) = O(1) time and space",
          starter: `function reverseBits(n) {
  // your code here
}`,
          solution: `function reverseBits(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1);   // append n's lowest bit
    n >>>= 1;                           // unsigned shift: no sign bit dragged in
  }
  return result >>> 0;                  // read the 32 bits as unsigned
}`,
          tests: [
            { name: "43261596 → 964176192", code: "return reverseBits(43261596) === 964176192;" },
            { name: "4294967293 → 3221225471", code: "return reverseBits(4294967293) === 3221225471;" },
            { name: "0 → 0", code: "return reverseBits(0) === 0;" },
            { name: "1 → 2147483648 (unsigned, not -2147483648)", code: "return reverseBits(1) === 2147483648;" },
            { name: "reversing twice gives back the input", code: "return [5, 123456789, 4000000000].every((x) => reverseBits(reverseBits(x)) === x);" },
          ],
          hint: "Loop 32 times: `result = (result << 1) | (n & 1)`, then `n >>>= 1`. Return `result >>> 0`.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "Bits and greed in real code",
          text: "Bit flags are everywhere: Unix file modes (`chmod 644` is `rw-r--r--`, three 3-bit groups), Discord-style permission integers, and packing several booleans into one Postgres `integer` column (Postgres has `&`, `|`, `#` for XOR). Greedy shows up in rate limiting and scheduling: a booking system that always assigns the consultant who frees up earliest is the interval-scheduling greedy.",
        },
        { type: "h", text: "Interview playbook" },
        {
          type: "p",
          text: "You now have the full toolbox from the three algorithm tracks. In an interview, the hard part is often **choosing** the tool in the first two minutes. Read the statement for signals:",
        },
        {
          type: "table",
          rows: [
            ["Signal in the problem", "Reach for"],
            ["sorted array, pair/triplet with a target, \"in place\"", "two pointers, binary search"],
            ["\"subarray\" / \"substring\", longest/shortest window with a condition", "sliding window; prefix sums (+ hash map) for sums with negatives"],
            ["\"have we seen it?\", counts, duplicates, complements", "hash map / set"],
            ["\"top k\", \"k-th largest\", merge k sorted things, running median", "heap (priority queue)"],
            ["next greater/smaller element, matching brackets", "monotonic stack / stack"],
            ["tree depth, paths, \"for every node\"", "DFS recursion (BFS for level order)"],
            ["\"all combinations / permutations / subsets\", tiny n", "backtracking"],
            ["\"fewest steps\" with equal step cost, grids, word transformations", "BFS"],
            ["\"min / max / number of ways\", choices that affect the future", "dynamic programming"],
            ["dependencies, prerequisites, build order", "topological sort (Kahn's)"],
            ["connectivity, groups, \"are x and y connected\", edges arriving one by one", "union-find (or DFS)"],
            ["weighted shortest path, non-negative weights", "Dijkstra"],
            ["locally best choice provably safe (intervals, reach, Kadane)", "greedy"],
            ["\"appears once\", powers of two, O(1) space on integers", "bit manipulation (XOR, `n & (n-1)`)"],
          ],
        },
        {
          type: "p",
          text: "The constraints tell you the target complexity before you've designed anything (roughly 10^8 simple operations per second):",
        },
        {
          type: "table",
          rows: [
            ["n up to", "Target complexity", "Typical pattern"],
            ["10–12", "O(n!) or O(n · 2^n)", "permutations, backtracking"],
            ["20–25", "O(2^n)", "subsets, bitmask DP"],
            ["500", "O(n³)", "interval DP, triple loops"],
            ["5,000", "O(n²)", "2D DP, all pairs"],
            ["10^5 – 10^6", "O(n log n) or O(n)", "sorting, heap, two pointers, hashing, greedy"],
            ["10^9 or more", "O(log n) or O(1)", "binary search on the answer, math"],
          ],
        },
        {
          type: "steps",
          items: [
            { title: "Clarify (2–3 min)", text: "Restate the problem, ask about input size, duplicates, negatives, empty input, and what to return in edge cases." },
            { title: "Examples", text: "Walk one normal example and one edge case by hand. This is where you often spot the pattern." },
            { title: "Brute force out loud", text: "State the obvious solution and its Big-O. It proves you understand the problem and gives you a fallback." },
            { title: "Optimise", text: "Ask: what work is repeated (DP, hashing)? What's sorted (two pointers, binary search)? What structure answers my question in O(1) or O(log n)?" },
            { title: "Code", text: "Name variables clearly, talk while you type, keep helpers small." },
            { title: "Test and analyse", text: "Trace your code on the example and the edge cases, then state time and space complexity." },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Say the pattern's name",
          text: "\"This is a shortest path with equal costs, so BFS\" or \"overlapping subproblems on prefixes, so a DP over i\" tells the interviewer you're recognising, not guessing. If you're unsure between two patterns, say both and explain which signal tips it.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "JavaScript gotchas in interviews",
          text: "`arr.sort()` sorts **as strings** (`[10, 9, 1].sort()` → `[1, 10, 9]`): always pass `(a, b) => a - b`. `queue.shift()` can be O(n): use a head index. There's no built-in heap. Bitwise ops are 32-bit signed. Recursion depth is limited (~10k frames): prefer iterative BFS/DFS on big inputs. And `new Array(n).fill([])` shares **one** inner array: use `Array.from({ length: n }, () => [])`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Greedy \"biggest coin first\" gives 3 coins for amount 6 with coins [1, 3, 4]. What's the lesson?",
              options: [
                "Greedy is always wrong for coin problems",
                "Sort the coins ascending instead",
                "Greedy needs a proof (exchange argument); a counter-example means you need DP",
                "Coin change can't be solved efficiently",
              ],
              answer: 2,
              why: "3 + 3 uses 2 coins. Greedy happens to work for standard currency systems, but not in general; the DP from the previous lesson always works.",
            },
            {
              q: "In JavaScript, what does `1 << 31` evaluate to?",
              options: ["2147483648", "-2147483648", "0", "Infinity"],
              answer: 1,
              why: "Bitwise operators work on 32-bit signed integers, so bit 31 is the sign bit. Use `(1 << 31) >>> 0` to read it as 2147483648.",
            },
            {
              q: "A problem says \"return the k most frequent products\" with n up to 10^5. Which pattern fits best?",
              options: ["Hash map counts + heap (or bucket sort)", "Backtracking", "Union-find", "2D dynamic programming"],
              answer: 0,
              why: "\"Top k\" is the heap signal; counting frequencies first is a hash map. O(n log k) overall.",
            },
            {
              q: "With n up to 5,000, which time complexity is the realistic target?",
              options: ["O(2^n)", "O(n³)", "O(n!)", "O(n²)"],
              answer: 3,
              why: "5,000² = 25 million operations, comfortably fast. n³ would be 125 billion.",
            },
          ],
        },
      ],
    },
  ],
};
