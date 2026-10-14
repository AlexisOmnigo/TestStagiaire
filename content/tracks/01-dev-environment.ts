import type { Track } from "../types";

export const track: Track = {
  slug: "dev-environment",
  order: 1,
  title: "Dev Environment & Git",
  tagline: "The terminal, your editor, Git, GitHub and npm — the workbench every project sits on",
  outcome:
    "Move around confidently in a terminal, set up VS Code and Node properly, version your work with Git, collaborate through GitHub pull requests, manage dependencies with npm/pnpm, and debug errors methodically.",
  badge: "GIT",
  color: "#f05032",
  lessons: [
    // ─────────────────────────────────────────────────────────────
    // 1. The terminal
    // ─────────────────────────────────────────────────────────────
    {
      slug: "the-terminal",
      title: "The terminal: shell, paths & commands",
      summary: "Talk to your computer in text: navigate folders, run programs, chain commands and understand PATH.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Almost every tool in your stack is driven from a terminal: `npm run dev` starts your Next.js app, `git commit` saves your work, `npx supabase` runs migrations, `vercel` and `railway` deploy. Buttons in an app are convenient, but the terminal is **precise, scriptable and repeatable** — you can paste a command into a README and a colleague gets exactly the same result.",
        },
        { type: "h", text: "Terminal vs shell" },
        {
          type: "p",
          text: "The **terminal** is the window (macOS Terminal, iTerm2, Windows Terminal, the panel inside VS Code). The **shell** is the program running inside it that reads what you type and executes it. On macOS the default shell is `zsh`, on most Linux machines it is `bash`, and on Windows it is PowerShell. The commands in this course are for `bash`/`zsh`.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "On Windows?",
          text: "Install **WSL2** (Windows Subsystem for Linux) and do your web development inside it. Node, Git and most tutorials assume a Unix-like shell, and file watching is faster when your project lives inside the Linux filesystem (`~/code/...`), not under `/mnt/c/`.",
        },
        {
          type: "code",
          lang: "bash",
          title: "anatomy of a prompt",
          code: `alexis@macbook ~/code/client-portal (main) $ ls -la src
#  user   machine  current folder    git branch  ← the prompt
#                                                  ls -la src ← what you type`,
        },
        { type: "h", text: "Where am I? Paths and the current directory" },
        {
          type: "p",
          text: "Your shell is always *inside* one folder: the **current working directory** (cwd). Every relative path you type is resolved from there. `pwd` prints it, `cd` changes it.",
        },
        {
          type: "table",
          rows: [
            ["Path", "Meaning", "Example"],
            ["`/`", "The root of the filesystem", "`/usr/bin/git`"],
            ["`~`", "Your home folder", "`~/code` → `/Users/alexis/code`"],
            ["`.`", "The current folder", "`./scripts/seed.js`"],
            ["`..`", "The parent folder", "`cd ..` goes up one level"],
            ["`src/app`", "Relative: starts from the cwd", "depends on where you are"],
            ["`/Users/alexis/code`", "Absolute: starts with `/`", "same result from anywhere"],
          ],
        },
        {
          type: "code",
          lang: "bash",
          title: "moving around",
          code: `pwd                      # /Users/alexis
cd code/client-portal    # relative: from where I am
pwd                      # /Users/alexis/code/client-portal
cd ..                    # up one level → /Users/alexis/code
cd ~/code/voltix-site    # ~ always means my home folder
cd -                     # jump back to the previous folder
cd                       # no argument: go home`,
        },
        { type: "h", text: "The essential commands" },
        {
          type: "table",
          rows: [
            ["Command", "Does", "Useful forms"],
            ["`ls`", "List files", "`ls -la` (all, incl. hidden, with details)"],
            ["`cd`", "Change directory", "`cd ..`, `cd ~`, `cd -`"],
            ["`pwd`", "Print working directory", "—"],
            ["`mkdir`", "Make a folder", "`mkdir -p src/lib/shopify` (creates parents)"],
            ["`touch`", "Create an empty file", "`touch .env.local`"],
            ["`cat`", "Print a file", "`cat package.json`"],
            ["`cp`", "Copy", "`cp .env.example .env.local`, `cp -r a b` for folders"],
            ["`mv`", "Move or rename", "`mv old-name.ts new-name.ts`"],
            ["`rm`", "Delete (no trash!)", "`rm file`, `rm -r folder`"],
            ["`grep`", "Search text", "`grep -rn \"TODO\" src`"],
            ["`which`", "Where is a program?", "`which node`"],
            ["`clear`", "Clear the screen", "or `Ctrl + L`"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "rm is forever",
          text: "`rm` does not move files to the trash — they are gone. Be extra careful with `rm -rf` (recursive + force, no confirmation), especially with variables or `..` in the path. Read the command twice before pressing Enter.",
        },
        { type: "h", text: "Command, flags and arguments" },
        {
          type: "p",
          text: "A command line is split on spaces into words. The first word is the **program**. Words starting with `-` are **flags** (options that change behaviour): short ones like `-l` can be combined (`-la`), long ones look like `--force`. Everything else is an **argument** — usually what the command acts on. Quotes keep a value with spaces together: `git commit -m \"Fix invoice totals\"`.",
        },
        {
          type: "run",
          title: "how a shell sees a command (simplified)",
          code: `function parseCommand(line) {
  const [program, ...words] = line.trim().split(/ +/);
  const flags = [];
  const args = [];
  for (const word of words) {
    if (word.startsWith("--")) flags.push(word);
    else if (word.startsWith("-")) flags.push(...[...word.slice(1)].map((c) => "-" + c));
    else args.push(word);
  }
  return { program, flags, args };
}

console.log(parseCommand("ls -la src/app"));
console.log(parseCommand("rm -rf .next node_modules"));
console.log(parseCommand("npm install --save-dev prettier"));
// Real shells also handle quotes, escapes, variables and globs like *.ts`,
        },
        { type: "h", text: "Pipes, redirection and chaining" },
        {
          type: "p",
          text: "Small commands become powerful when combined. `|` (pipe) sends the output of one command into the next. `>` writes output to a file (overwriting), `>>` appends. `&&` runs the next command only if the previous one succeeded.",
        },
        {
          type: "code",
          lang: "bash",
          code: `# How many leads come from Montréal?
cat leads.csv | grep "Montréal" | wc -l

# Save the list of installed packages to a file
npm ls --depth=0 > deps.txt

# Install, then start the dev server — only if install worked
npm install && npm run dev

# Find every TODO in the app folder, with line numbers
grep -rn "TODO" src/app`,
        },
        { type: "h", text: "Environment variables and PATH" },
        {
          type: "p",
          text: "Every program receives a set of **environment variables**: named strings like `HOME`, `USER` or `NODE_ENV`. You read them with `$NAME`, set them for one command by prefixing it, or for the whole session with `export`.",
        },
        {
          type: "code",
          lang: "bash",
          code: `echo $HOME                    # /Users/alexis
PORT=4000 npm run dev         # PORT exists only for this one command
export NODE_ENV=production    # set for the rest of this terminal session
echo $PATH                    # /opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin`,
        },
        {
          type: "p",
          text: "`PATH` is the most important one. It is a `:`-separated list of folders. When you type `node`, the shell looks for an executable named `node` in each folder **in order** and runs the first one it finds. That is why `command not found` usually means the tool isn't installed or its folder isn't on your PATH — and why two different Node versions can fight each other.",
        },
        {
          type: "run",
          title: "simulating `which`",
          code: `const PATH = "/Users/alexis/.fnm/node-versions/v22/bin:/opt/homebrew/bin:/usr/bin:/bin";

// What each folder contains (pretend filesystem)
const disk = {
  "/Users/alexis/.fnm/node-versions/v22/bin": ["node", "npm", "npx"],
  "/opt/homebrew/bin": ["node", "git", "gh"],
  "/usr/bin": ["git", "ssh", "curl"],
  "/bin": ["ls", "cat", "rm", "mkdir"],
};

function which(cmd) {
  for (const dir of PATH.split(":")) {
    if (disk[dir]?.includes(cmd)) return dir + "/" + cmd; // first match wins
  }
  return null;
}

for (const cmd of ["node", "git", "ls", "railway"]) {
  console.log(cmd.padEnd(8), "→", which(cmd) ?? "command not found");
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "In your projects",
          text: "Next.js reads `.env.local` and exposes those values to your server code as environment variables — that's where your `SUPABASE_SERVICE_ROLE_KEY` or `CLERK_SECRET_KEY` live locally. On Vercel and Railway you set the same variables in the project dashboard. Same idea, different place.",
        },
        { type: "h", text: "Keyboard survival kit" },
        {
          type: "list",
          items: [
            "`Ctrl + C` — stop the running program (e.g. your dev server). It does **not** copy in most terminals.",
            "`Tab` — autocomplete file names and commands. Press it constantly; it prevents typos.",
            "`↑` / `↓` — browse previous commands. `Ctrl + R` searches your history.",
            "`Ctrl + A` / `Ctrl + E` — jump to the start / end of the line.",
            "`q` — quit a pager such as `git log` or `man ls`.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Port 3000 already in use?",
          text: "You probably have another dev server running in a forgotten terminal tab. Find it and `Ctrl + C` it, or on macOS/Linux find the process with `lsof -i :3000`. Next.js will otherwise fall back to port 3001.",
        },
        {
          type: "challenge",
          title: "Resolve a path like the shell does",
          prompt:
            "Write `resolvePath(cwd, target, home)` that returns the absolute path you would end up in after `cd target` from `cwd`. Rules: a target starting with `/` is absolute; a target starting with `~` starts from `home`; otherwise start from `cwd`. Then handle each segment: `.` means stay, `..` means go up (but never above `/`), empty segments (from `//`) are ignored. The result starts with `/` and has no trailing slash (except the root `/` itself).",
          starter: `function resolvePath(cwd, target, home) {
  // naive: just glue them together
  return cwd + "/" + target;
}`,
          solution: `function resolvePath(cwd, target, home) {
  let base = cwd;
  let rest = target;
  if (target.startsWith("/")) {
    base = "/";
  } else if (target.startsWith("~")) {
    base = home;
    rest = target.slice(1);
  }

  const parts = base.split("/").filter(Boolean);
  for (const segment of rest.split("/")) {
    if (segment === "" || segment === ".") continue;
    if (segment === "..") parts.pop(); // pop() on [] is harmless: can't go above /
    else parts.push(segment);
  }
  return "/" + parts.join("/");
}`,
          tests: [
            {
              name: "relative path from the cwd",
              code: `return resolvePath("/Users/alexis/code", "client-portal/src", "/Users/alexis") === "/Users/alexis/code/client-portal/src";`,
            },
            {
              name: ".. goes up and . stays put",
              code: `return resolvePath("/Users/alexis/code/voltix", "../omnigo/./app", "/Users/alexis") === "/Users/alexis/code/omnigo/app";`,
            },
            {
              name: "absolute target ignores the cwd",
              code: `return resolvePath("/Users/alexis/code", "/usr/local/bin/", "/Users/alexis") === "/usr/local/bin";`,
            },
            {
              name: "~ expands to the home folder",
              code: `return resolvePath("/tmp", "~/code//clients", "/Users/alexis") === "/Users/alexis/code/clients" && resolvePath("/tmp", "~", "/Users/alexis") === "/Users/alexis";`,
            },
            {
              name: "edge case: can't go above the root",
              code: `return resolvePath("/Users", "../../../..", "/Users/alexis") === "/";`,
            },
          ],
          hint: "Split the starting folder into segments with `split(\"/\").filter(Boolean)`, then walk the target's segments with a stack: `push` names, `pop` on `..`, skip `.` and empty strings. Join with `/` and prefix a `/`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You are in `/Users/alexis/code/client-portal`. Where does `cd ../voltix` take you?",
              options: [
                "`/Users/alexis/code/client-portal/voltix`",
                "`/Users/alexis/code/voltix`",
                "`/voltix`",
                "`/Users/alexis/voltix`",
              ],
              answer: 1,
              why: "`..` goes up one level to `/Users/alexis/code`, then `voltix` goes into that folder.",
            },
            {
              q: "You type `pnpm` and get `command not found`, but a colleague's machine runs it fine. What's the most likely cause?",
              options: [
                "pnpm isn't installed on your machine, or its folder isn't on your `PATH`",
                "Your project has the wrong package.json",
                "You need to run `cd ..` first",
              ],
              answer: 0,
              why: "The shell searches the folders listed in `PATH`. If no folder contains a `pnpm` executable, you get `command not found` — regardless of the project.",
            },
            {
              q: "What does `npm install && npm run dev` do if `npm install` fails?",
              options: [
                "Runs `npm run dev` anyway",
                "Retries `npm install`",
                "Stops: `npm run dev` doesn't run",
              ],
              answer: 2,
              why: "`&&` only runs the right-hand command if the left-hand one exited successfully (exit code 0). Use `;` to run regardless.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 2. Editor & tooling
    // ─────────────────────────────────────────────────────────────
    {
      slug: "editor-and-tooling",
      title: "Your editor & Node toolchain",
      summary: "VS Code habits, the extensions that matter, formatter vs linter, and what node, npm and npx really are.",
      minutes: 11,
      blocks: [
        {
          type: "p",
          text: "You'll spend thousands of hours in your editor. Ten minutes setting it up properly — auto-formatting, inline lint errors, Tailwind autocomplete, the right Node version — pays back every single day. Most of the agency uses **VS Code** or one of its forks (Cursor, Windsurf), so everything below applies to all of them.",
        },
        { type: "h", text: "VS Code shortcuts worth learning first" },
        {
          type: "table",
          rows: [
            ["Action", "macOS", "Windows / Linux"],
            ["Command palette (do anything)", "`Cmd + Shift + P`", "`Ctrl + Shift + P`"],
            ["Quick open a file by name", "`Cmd + P`", "`Ctrl + P`"],
            ["Toggle the panel (terminal)", "`Cmd + J`", "`Ctrl + J`"],
            ["Go to definition", "`F12` or `Cmd + click`", "`F12` or `Ctrl + click`"],
            ["Rename a symbol everywhere", "`F2`", "`F2`"],
            ["Select next occurrence (multi-cursor)", "`Cmd + D`", "`Ctrl + D`"],
            ["Toggle line comment", "`Cmd + /`", "`Ctrl + /`"],
            ["Search across the project", "`Cmd + Shift + F`", "`Ctrl + Shift + F`"],
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rename, don't find-and-replace",
          text: "`F2` (Rename Symbol) understands your code: renaming `getInvoice` updates every import and call site, but leaves the word *getInvoice* inside unrelated strings alone. Find-and-replace doesn't know the difference.",
        },
        { type: "h", text: "The extensions that matter" },
        {
          type: "list",
          items: [
            "**ESLint** — shows lint problems (likely bugs, bad patterns) as squiggles while you type.",
            "**Prettier** — formats your code (indentation, quotes, line breaks) on save, so nobody argues about style.",
            "**Tailwind CSS IntelliSense** — autocompletes class names, shows the CSS behind `px-4`, flags typos.",
            "**GitLens** (optional) — who changed this line and when, right in the editor.",
            "**Error Lens** (optional) — prints errors inline at the end of the line instead of only on hover.",
          ],
        },
        {
          type: "code",
          lang: "json",
          title: ".vscode/settings.json",
          code: `{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}`,
        },
        {
          type: "p",
          text: "Committing a `.vscode/settings.json` to the repo means everyone on the project formats the same way automatically.",
        },
        { type: "h", text: "Formatter vs linter" },
        {
          type: "p",
          text: "They are often confused, but they do different jobs. A **formatter** (Prettier, Biome) only changes *how code looks* — never what it does. A **linter** (ESLint, Biome) reads your code looking for *likely mistakes*: unused variables, missing `await`, `==` instead of `===`, React hooks called conditionally.",
        },
        {
          type: "compare",
          left: {
            label: "Formatter fixes this (style)",
            lang: "js",
            code: `const total=items.reduce((s,i)=>s+i.price,0)
if(total>100){applyDiscount( total )}`,
          },
          right: {
            label: "Linter catches this (bugs)",
            lang: "js",
            code: `const unused = 42;          // no-unused-vars
if (status == "0") {}       // eqeqeq
useEffect(() => { ... });   // react-hooks/exhaustive-deps
fetchLeads();               // floating promise: no await`,
          },
        },
        {
          type: "run",
          title: "why linters flag == (loose equality)",
          code: `// == converts types before comparing. The results are surprising:
console.log('"0" == 0      →', "0" == 0);
console.log('"" == 0       →', "" == 0);
console.log('[] == false   →', [] == false);
console.log('null == undefined →', null == undefined);

// === compares type AND value. No surprises:
console.log('"0" === 0     →', "0" === 0);

// A real bug: a form sends quantity as the string "0"
const quantity = "0";
if (quantity == false) console.log("Bug: treated '0' as empty!");`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "ESLint in Next.js",
          text: "`create-next-app` sets up ESLint with Next's rules (`eslint-config-next`) in an `eslint.config.mjs` (the flat config format of ESLint 9). Since Next.js 16 the old `next lint` command is gone: run `eslint .` directly, usually through an npm script like `\"lint\": \"eslint .\"`. Add `prettier-plugin-tailwindcss` to Prettier to auto-sort Tailwind classes.",
        },
        { type: "h", text: "node, npm and npx" },
        {
          type: "list",
          items: [
            "**`node`** — the JavaScript runtime. `node script.js` runs a file outside the browser (more in the Node.js track).",
            "**`npm`** — the package manager that ships with Node. Installs libraries and runs your `package.json` scripts (`npm run dev`).",
            "**`npx`** — runs a package's command without installing it globally: `npx create-next-app@latest`, `npx prisma migrate dev`. If the package is in your project, it uses that version; otherwise it downloads it temporarily.",
          ],
        },
        {
          type: "code",
          lang: "bash",
          code: `node -v                     # v22.x.x — which Node am I running?
npm -v                      # npm comes bundled with Node
node -e "console.log(1+1)"  # run a one-liner
npx create-next-app@latest client-portal   # scaffold without a global install`,
        },
        { type: "h", text: "Use a Node version manager" },
        {
          type: "p",
          text: "Different client projects need different Node versions, and installing Node from the website gives you exactly one. A **version manager** like `fnm` (fast, cross-platform) or `nvm` lets you install several and switch per project. Use an even-numbered **LTS** release (Node 22 or 24 at the time of writing) — odd versions are short-lived.",
        },
        {
          type: "code",
          lang: "bash",
          code: `fnm install --lts       # or: nvm install --lts
fnm use 22              # or: nvm use 22
node -v > .nvmrc        # pin the project's version in a file
fnm use                 # later: reads .nvmrc and switches automatically`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Same Node locally and in production",
          text: "Vercel lets you choose the Node version in Project Settings, and an `engines.node` field in `package.json` overrides it. Railway also reads `engines` / `.nvmrc`. Keeping these aligned with your local version avoids the classic *works on my machine* build failure.",
        },
        {
          type: "challenge",
          title: "Write a tiny linter",
          prompt:
            "Write `lint(source)` that takes source code as a string and returns an array of problems `{ line, rule }` (line numbers start at 1). Rule `\"no-var\"`: the line (ignoring leading spaces) starts with `var `. Rule `\"eqeqeq\"`: the line contains a loose `==` or `!=` that is not part of `===` / `!==`. Skip lines that start with `//` (comments). One line can produce both problems — report `no-var` first.",
          starter: `function lint(source) {
  const problems = [];
  source.split("\\n").forEach((text, i) => {
    if (text.includes("var")) problems.push({ line: i + 1, rule: "no-var" });
  });
  return problems;
}`,
          solution: `function lint(source) {
  const problems = [];
  source.split("\\n").forEach((text, i) => {
    const code = text.trimStart();
    if (code.startsWith("//")) return;
    if (code.startsWith("var ")) problems.push({ line: i + 1, rule: "no-var" });
    // == or != not preceded by =, ! , <, > and not followed by =
    if (/(^|[^=!<>])[=!]=(?!=)/.test(code)) problems.push({ line: i + 1, rule: "eqeqeq" });
  });
  return problems;
}`,
          tests: [
            {
              name: "flags var declarations",
              code: `const r = lint("const a = 1;\\nvar total = 0;");
return r.length === 1 && r[0].line === 2 && r[0].rule === "no-var";`,
            },
            {
              name: "flags loose == and !=",
              code: `const r = lint("if (qty == 0) {}\\nif (status != 'paid') {}");
return r.length === 2 && r.every((p) => p.rule === "eqeqeq") && r[1].line === 2;`,
            },
            {
              name: "does not flag === or !==",
              code: `return lint("if (a === b && c !== d) {}").length === 0;`,
            },
            {
              name: "ignores comments and words like 'invariant'",
              code: `return lint("// var old = x == y\\nconst invariant = true;").length === 0;`,
            },
            {
              name: "one line can have both problems, no-var first",
              code: `const r = lint("  var isFree = price == 0;");
return r.length === 2 && r[0].rule === "no-var" && r[1].rule === "eqeqeq" && r[0].line === 1;`,
            },
          ],
          hint: "Use `text.trimStart()` before `startsWith`. For `eqeqeq`, a regex like `/(^|[^=!<>])[=!]=(?!=)/` matches `==` or `!=` that isn't glued to another `=`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which tool would catch a variable you declared but never used?",
              options: ["Prettier (formatter)", "ESLint (linter)", "npx", "The Node version manager"],
              answer: 1,
              why: "Detecting unused variables is a code-quality check — that's a linter's job (`no-unused-vars`). A formatter only changes layout.",
            },
            {
              q: "What does `npx create-next-app@latest` do?",
              options: [
                "Installs create-next-app globally forever",
                "Adds create-next-app to your package.json",
                "Downloads the latest create-next-app temporarily and runs its command",
              ],
              answer: 2,
              why: "`npx` executes a package's binary, fetching it on the fly if it's not in your project — no global install, nothing added to `package.json`.",
            },
            {
              q: "Why commit an `.nvmrc` file to a project?",
              options: [
                "So everyone (and tools like `fnm use`) switch to the same Node version for that project",
                "It makes Node run faster",
                "npm refuses to install without it",
              ],
              answer: 0,
              why: "`.nvmrc` pins the expected Node version. Version managers read it, and it documents the requirement for teammates and hosting platforms.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 3. Git fundamentals
    // ─────────────────────────────────────────────────────────────
    {
      slug: "git-fundamentals",
      title: "Git fundamentals: commits & the staging area",
      summary: "Why version control exists, the three areas of Git, and the status → add → commit loop you'll run every day.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "Without version control, projects end up as `site-final-v2-REAL.zip` in someone's Downloads folder. **Git** records snapshots of your project over time so you can see exactly what changed, when, why and by whom — and go back if something breaks. It also lets several developers work on the same codebase without overwriting each other's work.",
        },
        { type: "h", text: "The three areas" },
        {
          type: "p",
          text: "This is the mental model that makes Git click. Your files live in three places at once:",
        },
        {
          type: "steps",
          items: [
            {
              title: "Working tree",
              text: "The actual files on disk that you edit in VS Code. Changes here are invisible to Git's history until you stage them.",
            },
            {
              title: "Staging area (the index)",
              text: "A draft of your *next* commit. `git add` copies the current version of a file into it. This lets you commit only part of your changes — e.g. the invoice fix, not the debug logs.",
            },
            {
              title: "Repository (.git folder)",
              text: "`git commit` takes the staging area and saves it as a permanent snapshot (a **commit**) with a message, an author, a date and a unique hash like `a1b2c3d`.",
            },
          ],
        },
        {
          type: "code",
          lang: "bash",
          title: "the daily loop",
          code: `git init                      # once: turn a folder into a repo (creates .git/)
git status                    # what changed? what's staged? (run it constantly)
git diff                      # changes in working tree NOT yet staged
git add src/lib/invoices.ts   # stage one file
git add .                     # stage everything in this folder (check status first!)
git diff --staged             # what WILL be in the next commit
git commit -m "fix: round taxes to 2 decimals on invoices"
git log --oneline             # history, newest first`,
        },
        {
          type: "code",
          lang: "text",
          title: "git status output",
          code: `On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   src/lib/invoices.ts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
        modified:   src/app/page.tsx

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        src/lib/taxes.ts`,
        },
        {
          type: "p",
          text: "Notice that Git tells you the next command in parentheses. **Read `git status` output** — it's the most helpful screen in Git.",
        },
        { type: "h", text: "See the model in action" },
        {
          type: "run",
          title: "a 25-line Git",
          code: `const working = {}; // files on disk
let index = {};     // staging area = the proposed next snapshot
let head = {};      // snapshot of the last commit
const log = [];

const edit = (file, content) => { working[file] = content; };
const add = (file) => { index = { ...index, [file]: working[file] }; };
const commit = (message) => {
  head = { ...index };
  log.unshift(crypto.randomUUID().slice(0, 7) + " " + message);
};
function status(label) {
  console.log("── git status (" + label + ")");
  for (const f of Object.keys(working)) {
    if (!(f in index)) console.log("   untracked:  ", f);
    else {
      if (index[f] !== head[f]) console.log("   staged:     ", f);
      if (working[f] !== index[f]) console.log("   not staged: ", f);
    }
  }
}

edit("invoices.ts", "total = sum");
edit("README.md", "# Client portal");
status("two new files");

add("invoices.ts");
add("README.md");
commit("chore: initial commit");
status("after commit — clean");

edit("invoices.ts", "total = round(sum * 1.14975)");
add("invoices.ts");
edit("invoices.ts", "total = round(sum * 1.14975) // TODO");
status("staged, then edited again");

console.log(log);`,
        },
        {
          type: "p",
          text: "The last status shows the same file as both *staged* and *not staged*: the index holds the version you added, and the working tree has a newer one. `git commit` would save only the staged version. This surprises everyone once — now you know why.",
        },
        { type: "h", text: "Undoing things (safely)" },
        {
          type: "code",
          lang: "bash",
          code: `git restore src/app/page.tsx          # discard unstaged edits to a file (careful: gone)
git restore --staged src/app/page.tsx # unstage, keep your edits
git commit --amend -m "better message" # fix the LAST commit (only if not pushed yet)
git show a1b2c3d                       # see what a commit changed`,
        },
        { type: "h", text: "Writing good commit messages" },
        {
          type: "p",
          text: "Future you (and your reviewer) reads history to answer *why did this change?*. A good message is a short imperative summary of **what** the commit does, optionally followed by a blank line and the **why**. Many teams use the **Conventional Commits** prefix: `type(scope): summary`.",
        },
        {
          type: "compare",
          left: {
            label: "❌ Unhelpful",
            lang: "text",
            code: `fix
wip
changes
asdf
Updated stuff for client`,
          },
          right: {
            label: "✅ Useful",
            lang: "text",
            code: `fix(invoices): round TPS/TVQ to 2 decimals
feat(bookings): send SMS reminder 24h before
refactor(shopify): extract product query helper
docs: explain Supabase local setup
chore: bump next to 16.4`,
          },
        },
        {
          type: "table",
          rows: [
            ["Type", "Use for"],
            ["`feat`", "A new feature for the user"],
            ["`fix`", "A bug fix"],
            ["`refactor`", "Code change that neither fixes a bug nor adds a feature"],
            ["`docs`", "Documentation only"],
            ["`chore`", "Tooling, dependencies, config"],
            ["`test`", "Adding or fixing tests"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Never commit secrets",
          text: "`git add .` happily stages `.env.local` with your Stripe or Supabase service keys if it isn't ignored. Once pushed, assume a secret is leaked — removing it in a later commit doesn't erase it from history. Always check `git status` before committing; we'll set up `.gitignore` in the next lesson.",
        },
        {
          type: "callout",
          tone: "tip",
          title: "Small commits",
          text: "Commit one logical change at a time. Small commits are easy to review, easy to describe, and easy to revert if they break production.",
        },
        {
          type: "challenge",
          title: "Parse git log --oneline",
          prompt:
            "Write `parseLog(text)` that turns `git log --oneline` output into an array of `{ hash, type, scope, subject }`. The hash is everything before the first space. If the message follows Conventional Commits (`type: subject`, `type(scope): subject`, optionally with `!` before the colon for breaking changes), fill `type`, `scope` (or `null`) and `subject`. Otherwise use `type: \"other\"`, `scope: null` and the whole message as `subject`. Ignore blank lines.",
          starter: `function parseLog(text) {
  return text.split("\\n").map((line) => {
    const [hash, ...rest] = line.split(" ");
    return { hash, type: "other", scope: null, subject: rest.join(" ") };
  });
}`,
          solution: `function parseLog(text) {
  return text
    .split("\\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const space = line.indexOf(" ");
      const hash = line.slice(0, space);
      const message = line.slice(space + 1);
      const m = message.match(/^([a-z]+)(?:\\(([^)]+)\\))?!?: (.+)$/);
      if (!m) return { hash, type: "other", scope: null, subject: message };
      return { hash, type: m[1], scope: m[2] ?? null, subject: m[3] };
    });
}`,
          tests: [
            {
              name: "parses type, scope and subject",
              code: `const [c] = parseLog("a1b2c3d feat(invoices): add PDF export");
return c.hash === "a1b2c3d" && c.type === "feat" && c.scope === "invoices" && c.subject === "add PDF export";`,
            },
            {
              name: "scope is null when absent",
              code: `const [c] = parseLog("9f8e7d6 fix: round taxes (TPS/TVQ)");
return c.type === "fix" && c.scope === null && c.subject === "round taxes (TPS/TVQ)";`,
            },
            {
              name: "non-conventional messages become type 'other'",
              code: `const [c] = parseLog("4c5d6e7 Update README: add setup steps");
return c.type === "other" && c.scope === null && c.subject === "Update README: add setup steps";`,
            },
            {
              name: "breaking-change marker ! is accepted",
              code: `const [c] = parseLog("0aa11bb feat(api)!: rename /leads to /contacts");
return c.type === "feat" && c.scope === "api" && c.subject === "rename /leads to /contacts";`,
            },
            {
              name: "edge case: blank lines and trailing newline are ignored",
              code: `const list = parseLog("\\na1b2c3d chore: init\\n\\nb2c3d4e docs: readme\\n");
return list.length === 2 && list[1].hash === "b2c3d4e";`,
            },
          ],
          hint: "`line.indexOf(\" \")` gives the end of the hash. For the message, a regex like `/^([a-z]+)(?:\\(([^)]+)\\))?!?: (.+)$/` captures type, optional scope and subject. Don't forget `.filter(Boolean)` for blank lines.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "You edited 3 files but only want to commit the fix in `invoices.ts`. What do you do?",
              options: [
                "`git commit -m \"fix\"` — Git figures it out",
                "`git add .` then `git commit`",
                "`git add src/lib/invoices.ts` then `git commit`",
                "Delete the other two files first",
              ],
              answer: 2,
              why: "The staging area exists exactly for this: stage only the file(s) you want, then commit. The other edits stay in your working tree.",
            },
            {
              q: "What does `git diff --staged` show?",
              options: [
                "The changes that will go into the next commit",
                "Unstaged changes in your working tree",
                "The difference between your branch and GitHub",
              ],
              answer: 0,
              why: "`--staged` compares the index with the last commit — i.e. what `git commit` would record right now. Plain `git diff` shows unstaged changes.",
            },
            {
              q: "Which commit message is most useful?",
              options: ["`update`", "`fix bug`", "`WIP friday`", "`fix(bookings): prevent double booking on same slot`"],
              answer: 3,
              why: "It says what changed and where, in the imperative, and follows a convention your team (and changelog tools) can rely on.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 4. Branches & merging
    // ─────────────────────────────────────────────────────────────
    {
      slug: "branches-and-merging",
      title: "Branches, merging & conflicts",
      summary: "Branches are just movable pointers. Learn to branch, merge, rebase, resolve conflicts and ignore files.",
      minutes: 14,
      blocks: [
        {
          type: "p",
          text: "You're building a new pricing page for a client when an urgent bug comes in on the live site. Without branches, your half-finished pricing work is tangled with the fix. With branches, you park the feature, fix the bug on its own branch, ship it, and come back. **Branches let several lines of work exist side by side.**",
        },
        { type: "h", text: "A branch is just a pointer" },
        {
          type: "p",
          text: "Each commit stores a snapshot plus a link to its **parent** commit, forming a chain. A **branch** is nothing more than a name pointing at one commit (it's literally a tiny file containing a hash). When you commit on a branch, the pointer moves forward. `HEAD` is a pointer to *the branch you're currently on*. Creating a branch is instant and free.",
        },
        {
          type: "code",
          lang: "bash",
          code: `git branch                          # list local branches (* = current)
git switch -c feat/pricing-page     # create a branch here and switch to it
git switch main                     # go back to main
git branch -d feat/pricing-page     # delete a merged branch
git log --oneline --graph --all     # draw the history`,
        },
        {
          type: "callout",
          tone: "info",
          title: "switch vs checkout",
          text: "Older tutorials use `git checkout -b name`. `git switch` (and `git restore`) were added in Git 2.23 to split `checkout`'s many jobs into clearer commands. Both work; prefer `switch`.",
        },
        {
          type: "run",
          title: "branches as pointers",
          code: `const commits = {};               // hash → { msg, parents }
const branches = { main: null };   // branch name → hash
let HEAD = "main";
let n = 0;

function commit(msg) {
  const hash = "c" + ++n;
  const parent = branches[HEAD];
  commits[hash] = { msg, parents: parent ? [parent] : [] };
  branches[HEAD] = hash; // the current branch pointer moves forward
}
const switchCreate = (name) => { branches[name] = branches[HEAD]; HEAD = name; };
const switchTo = (name) => { HEAD = name; };

function isAncestor(a, b) { // is commit a in b's history?
  if (!b) return false;
  if (a === b) return true;
  return commits[b].parents.some((p) => isAncestor(a, p));
}
function merge(other) {
  const ours = branches[HEAD], theirs = branches[other];
  if (isAncestor(theirs, ours)) return console.log("Already up to date.");
  if (isAncestor(ours, theirs)) {
    branches[HEAD] = theirs;
    return console.log("Fast-forward: " + HEAD + " → " + theirs);
  }
  const hash = "c" + ++n;
  commits[hash] = { msg: "Merge " + other, parents: [ours, theirs] };
  branches[HEAD] = hash;
  console.log("Merge commit " + hash + " with parents", [ours, theirs]);
}

commit("init");
commit("home page");
switchCreate("feat/pricing");
commit("pricing table");
commit("pricing FAQ");
console.log("branches:", branches);

switchTo("main");
merge("feat/pricing");           // main hadn't moved → fast-forward

switchCreate("fix/footer");
commit("fix footer link");
switchTo("main");
commit("update hero copy");      // main moved too → histories diverged
merge("fix/footer");             // → real merge commit
console.log("branches:", branches);`,
        },
        { type: "h", text: "Merge vs rebase" },
        {
          type: "p",
          text: "When your branch and `main` have both moved, there are two ways to combine them. **Merge** creates a merge commit with two parents — honest history, but it can get noisy. **Rebase** replays your commits *on top of* the latest `main`, as if you'd started from there — linear history, but it rewrites your commits (new hashes).",
        },
        {
          type: "compare",
          left: {
            label: "merge",
            lang: "bash",
            code: `git switch feat/pricing
git merge main
# history:
#   A──B──────E (main)
#       \\      \\
#        C──D──M (feat/pricing)`,
          },
          right: {
            label: "rebase",
            lang: "bash",
            code: `git switch feat/pricing
git rebase main
# history:
#   A──B──E (main)
#          \\
#           C'──D' (feat/pricing)`,
          },
        },
        {
          type: "callout",
          tone: "warn",
          title: "The golden rule of rebasing",
          text: "Only rebase commits that **nobody else has based work on** — typically your own feature branch. Rebasing rewrites hashes; if you rebase a shared branch like `main` and force-push, everyone else's history breaks. After rebasing a branch you already pushed, use `git push --force-with-lease`, never plain `--force`.",
        },
        { type: "h", text: "Conflicts (don't panic)" },
        {
          type: "p",
          text: "A conflict happens when both sides changed **the same lines** of the same file. Git can't guess who is right, so it pauses and writes both versions into the file with markers:",
        },
        {
          type: "code",
          lang: "ts",
          title: "src/lib/plans.ts (during a merge)",
          code: `export const plans = {
<<<<<<< HEAD
  starter: 49,
=======
  starter: 59,
  growth: 149,
>>>>>>> feat/new-pricing
};`,
        },
        {
          type: "steps",
          items: [
            { title: "See what's conflicted", text: "`git status` lists files under *both modified*." },
            {
              title: "Edit the file",
              text: "Between `<<<<<<< HEAD` and `=======` is **your current branch** (ours); between `=======` and `>>>>>>>` is the **incoming** branch (theirs). Keep one side, the other, or a combination — then delete all three marker lines. VS Code shows *Accept Current / Incoming / Both* buttons above each block.",
            },
            { title: "Check it still works", text: "Run the app or tests. A conflict-free file can still be logically wrong." },
            {
              title: "Mark resolved and continue",
              text: "`git add src/lib/plans.ts`, then `git commit` (for a merge) or `git rebase --continue` (for a rebase). Changed your mind? `git merge --abort` / `git rebase --abort` returns to before.",
            },
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Fewer conflicts",
          text: "Keep branches short-lived (days, not weeks) and pull `main` into them often. Big, long-running branches are where painful conflicts come from.",
        },
        { type: "h", text: ".gitignore: what Git should never track" },
        {
          type: "code",
          lang: "text",
          title: ".gitignore",
          code: `# dependencies — reinstalled from package.json + lockfile
node_modules/

# build output — regenerated by next build
.next/
out/
dist/

# secrets — never in Git
.env
.env*.local
!.env.example

# tooling / OS noise
.vercel
.DS_Store
*.log`,
        },
        {
          type: "p",
          text: "`!` re-includes a file: `.env.example` (variable names, no real values) should be committed so teammates know which variables to set.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Already committed it?",
          text: "Adding a file to `.gitignore` doesn't untrack it. Run `git rm --cached .env.local`, commit, and — if it contained secrets that were pushed — **rotate those keys** in Supabase/Clerk/Stripe. They're still in the history.",
        },
        {
          type: "challenge",
          title: "Resolve conflict markers",
          prompt:
            "Write `resolveConflicts(text, strategy)` that removes Git conflict markers. `strategy` is `\"ours\"` (keep the HEAD side), `\"theirs\"` (keep the incoming side) or `\"both\"` (ours, then theirs). A block starts with a line beginning `<<<<<<<`, the separator is a line beginning `=======`, and it ends with a line beginning `>>>>>>>`. Lines outside blocks are kept unchanged. A file can contain several blocks.",
          starter: `function resolveConflicts(text, strategy) {
  // just drops the marker lines... but keeps BOTH sides every time
  return text
    .split("\\n")
    .filter((l) => !l.startsWith("<<<<<<<") && !l.startsWith("=======") && !l.startsWith(">>>>>>>"))
    .join("\\n");
}`,
          solution: `function resolveConflicts(text, strategy) {
  const out = [];
  let mode = null; // null | "ours" | "theirs"
  let ours = [];
  let theirs = [];
  for (const line of text.split("\\n")) {
    if (line.startsWith("<<<<<<<")) {
      mode = "ours";
      ours = [];
      theirs = [];
    } else if (mode === "ours" && line.startsWith("=======")) {
      mode = "theirs";
    } else if (mode === "theirs" && line.startsWith(">>>>>>>")) {
      if (strategy === "ours" || strategy === "both") out.push(...ours);
      if (strategy === "theirs" || strategy === "both") out.push(...theirs);
      mode = null;
    } else if (mode === "ours") {
      ours.push(line);
    } else if (mode === "theirs") {
      theirs.push(line);
    } else {
      out.push(line);
    }
  }
  return out.join("\\n");
}`,
          tests: [
            {
              name: "ours keeps the HEAD side",
              code: `const file = ["export const plans = {", "<<<<<<< HEAD", "  starter: 49,", "=======", "  starter: 59,", "  growth: 149,", ">>>>>>> feat/new-pricing", "};"].join("\\n");
return resolveConflicts(file, "ours") === ["export const plans = {", "  starter: 49,", "};"].join("\\n");`,
            },
            {
              name: "theirs keeps the incoming side",
              code: `const file = ["export const plans = {", "<<<<<<< HEAD", "  starter: 49,", "=======", "  starter: 59,", "  growth: 149,", ">>>>>>> feat/new-pricing", "};"].join("\\n");
return resolveConflicts(file, "theirs") === ["export const plans = {", "  starter: 59,", "  growth: 149,", "};"].join("\\n");`,
            },
            {
              name: "both keeps ours then theirs",
              code: `const file = ["<<<<<<< HEAD", "import { auth } from '@clerk/nextjs/server';", "=======", "import { createClient } from '@/lib/supabase';", ">>>>>>> feat/db"].join("\\n");
return resolveConflicts(file, "both") === "import { auth } from '@clerk/nextjs/server';\\nimport { createClient } from '@/lib/supabase';";`,
            },
            {
              name: "handles several conflict blocks in one file",
              code: `const file = ["a", "<<<<<<< HEAD", "b1", "=======", "b2", ">>>>>>> x", "c", "<<<<<<< HEAD", "d1", "=======", "d2", ">>>>>>> x", "e"].join("\\n");
return resolveConflicts(file, "theirs") === "a\\nb2\\nc\\nd2\\ne";`,
            },
            {
              name: "edge case: a file with no conflict is unchanged",
              code: `const file = "const tps = 0.05;\\nconst tvq = 0.09975;";
return resolveConflicts(file, "ours") === file;`,
            },
          ],
          hint: "Walk the lines with a small state machine: `mode` is `null` outside a block, `\"ours\"` after `<<<<<<<`, `\"theirs\"` after `=======`. Collect each side in its own array and decide what to push into the output when you hit `>>>>>>>`.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What is a Git branch, technically?",
              options: [
                "A full copy of the project folder",
                "A movable pointer to a commit",
                "A separate repository on GitHub",
              ],
              answer: 1,
              why: "A branch is just a name that points at a commit hash. That's why creating one is instant, and why committing simply moves the pointer forward.",
            },
            {
              q: "In a conflict block, which part is the branch you are merging *into* (your current branch)?",
              options: [
                "Between `<<<<<<< HEAD` and `=======`",
                "Between `=======` and `>>>>>>>`",
                "The lines after `>>>>>>>`",
              ],
              answer: 0,
              why: "`HEAD` is where you are. The top half is *ours* (current branch), the bottom half is *theirs* (incoming).",
            },
            {
              q: "You committed `.env.local` with a Supabase service-role key and pushed it. What's the right fix?",
              options: [
                "Add it to `.gitignore`, that removes it from history",
                "Delete the file and push again — done",
                "Rename the variable",
                "Untrack it (`git rm --cached`), ignore it, and rotate the key in Supabase",
              ],
              answer: 3,
              why: "The secret remains in Git history even after deletion, so it must be considered leaked: rotate it. Then untrack and ignore the file so it doesn't happen again.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 5. GitHub & pull requests
    // ─────────────────────────────────────────────────────────────
    {
      slug: "github-and-pull-requests",
      title: "GitHub, pull requests & CI",
      summary: "Remotes, push/pull/fetch, the pull-request workflow, code review, GitHub Actions and Vercel preview deployments.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Git works entirely on your machine. **GitHub** hosts a shared copy of the repository so the team can exchange commits, review each other's code, run automated checks and trigger deployments. Your laptop's repo and GitHub's repo are two separate copies that you keep in sync on purpose.",
        },
        { type: "h", text: "Remotes" },
        {
          type: "p",
          text: "A **remote** is a named URL of another copy of the repo. When you clone, Git names it `origin`. Git also keeps **remote-tracking branches** like `origin/main`: your local, read-only memory of where `main` was on GitHub *the last time you talked to it*.",
        },
        {
          type: "code",
          lang: "bash",
          code: `git clone git@github.com:omnigo/client-portal.git   # copy a repo (sets up origin)
git remote -v                                       # list remotes

git fetch                    # download new commits → updates origin/*; your files are untouched
git pull                     # fetch + merge origin/main into your current branch
git push                     # upload your commits
git push -u origin feat/booking-reminders   # first push of a new branch (-u = remember upstream)`,
        },
        {
          type: "run",
          title: "fetch vs pull, simulated",
          code: `const github = { main: ["init", "home page", "fix footer (Samuel)"] };
const local = { main: ["init", "home page"], "origin/main": ["init", "home page"] };

function fetch() {
  local["origin/main"] = [...github.main]; // only the remote-tracking copy changes
}
function pull() {
  fetch();
  local.main = [...local["origin/main"]];  // then integrate into your branch
}
function status() {
  const behind = local["origin/main"].length - local.main.length;
  console.log(behind > 0 ? "Your branch is behind 'origin/main' by " + behind + " commit(s)." : "Your branch is up to date with 'origin/main'.");
}

status();          // looks up to date... but it's stale information!
fetch();
status();          // now Git knows you're behind
console.log("main:", local.main);
pull();
status();
console.log("main:", local.main);`,
        },
        {
          type: "callout",
          tone: "info",
          title: "Authentication",
          text: "GitHub no longer accepts your account password over HTTPS. Use an **SSH key** (URLs like `git@github.com:...`) or the GitHub CLI: `gh auth login` configures everything for you.",
        },
        { type: "h", text: "The pull-request workflow" },
        {
          type: "p",
          text: "Nobody pushes directly to `main`. Every change goes through a **pull request (PR)**: a request to merge your branch into `main`, with a page where teammates review the diff, automated checks run, and a preview of the site is deployed.",
        },
        {
          type: "steps",
          items: [
            { title: "Start from fresh main", text: "`git switch main && git pull` — so your branch begins from the latest code." },
            { title: "Create a branch", text: "`git switch -c feat/booking-reminders`. Name it after the work: `feat/…`, `fix/…`, `chore/…`." },
            { title: "Commit in small steps", text: "`git add` + `git commit` as you go, with clear messages." },
            { title: "Push the branch", text: "`git push -u origin feat/booking-reminders`." },
            {
              title: "Open the PR",
              text: "On GitHub (it suggests it right after you push) or with `gh pr create --fill`. Describe **what** and **why**, how to test, and add screenshots for UI changes. Link the Asana task.",
            },
            {
              title: "Checks run",
              text: "GitHub Actions runs lint, type-check and tests. Vercel builds a **preview deployment** and comments with its URL.",
            },
            {
              title: "Review",
              text: "A teammate comments or approves. You push more commits to the same branch to address feedback — the PR updates automatically.",
            },
            {
              title: "Merge & clean up",
              text: "Usually **Squash and merge** (one tidy commit on `main`). Delete the branch. The merge to `main` triggers the production deployment.",
            },
          ],
        },
        {
          type: "table",
          rows: [
            ["Merge button", "Result on main", "When"],
            ["Create a merge commit", "All branch commits + a merge commit", "You want full history"],
            ["Squash and merge", "One single commit", "Most feature PRs — clean history"],
            ["Rebase and merge", "Branch commits replayed, no merge commit", "Commits are already clean and meaningful"],
          ],
        },
        { type: "h", text: "Code review, both sides" },
        {
          type: "list",
          items: [
            "As an **author**: keep PRs small (under ~400 changed lines), review your own diff first, explain decisions in the description, and never take comments personally — they're about the code.",
            "As a **reviewer**: look for correctness, security (secrets? missing auth checks?), and clarity. Ask questions instead of giving orders (*What happens if the client has no email?*). Approve when it's good enough, not perfect.",
            "Use **suggestions** (the ± button in a review comment) for small fixes the author can apply in one click.",
          ],
        },
        {
          type: "callout",
          tone: "tip",
          title: "Protect main",
          text: "In the repo's **Settings → Rules** (rulesets) or branch protection, require a pull request with at least one approval and passing status checks before merging into `main`, and block force-pushes. Then *it's impossible* to ship untested code by accident.",
        },
        { type: "h", text: "GitHub Actions: CI in one file" },
        {
          type: "p",
          text: "**Continuous Integration (CI)** means every push is automatically checked. GitHub Actions reads YAML workflow files from `.github/workflows/` and runs them on GitHub's machines.",
        },
        {
          type: "code",
          lang: "text",
          title: ".github/workflows/ci.yml",
          code: `name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5        # get the code
      - uses: actions/setup-node@v5      # install Node
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci                      # exact install from the lockfile
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}   # from repo Settings → Secrets`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Vercel and Railway deploy from GitHub",
          text: "Once a repo is connected to Vercel, every push to a non-production branch builds a **Preview deployment** with its own URL (and the Vercel bot comments it on the PR), using your *Preview* environment variables. Merging into `main` builds **Production**. Railway works the same way for your backend services and can spin up **PR environments**. So a green PR with a working preview is your best signal that `main` will deploy fine.",
        },
        {
          type: "challenge",
          title: "Ahead, behind or diverged?",
          prompt:
            "Write `branchStatus(local, remote)`. Both arguments are arrays of commit hashes from oldest to newest (`remote` is `origin/main`, possibly empty if never pushed). Count the shared prefix; `ahead` = local commits after it, `behind` = remote commits after it. Return `{ ahead, behind, state }` where `state` is `\"up-to-date\"`, `\"ahead\"` (you should push), `\"behind\"` (you should pull) or `\"diverged\"` (both).",
          starter: `function branchStatus(local, remote) {
  const ahead = local.length - remote.length;
  return { ahead, behind: 0, state: ahead > 0 ? "ahead" : "up-to-date" };
}`,
          solution: `function branchStatus(local, remote) {
  let common = 0;
  while (common < local.length && common < remote.length && local[common] === remote[common]) {
    common++;
  }
  const ahead = local.length - common;
  const behind = remote.length - common;
  let state = "up-to-date";
  if (ahead && behind) state = "diverged";
  else if (ahead) state = "ahead";
  else if (behind) state = "behind";
  return { ahead, behind, state };
}`,
          tests: [
            {
              name: "same commits → up-to-date",
              code: `const s = branchStatus(["a", "b"], ["a", "b"]);
return s.ahead === 0 && s.behind === 0 && s.state === "up-to-date";`,
            },
            {
              name: "two local commits not pushed → ahead 2",
              code: `const s = branchStatus(["a", "b", "c", "d"], ["a", "b"]);
return s.ahead === 2 && s.behind === 0 && s.state === "ahead";`,
            },
            {
              name: "a teammate pushed → behind 1",
              code: `const s = branchStatus(["a", "b"], ["a", "b", "x"]);
return s.ahead === 0 && s.behind === 1 && s.state === "behind";`,
            },
            {
              name: "both moved → diverged (even with equal lengths)",
              code: `const s = branchStatus(["a", "b", "c"], ["a", "b", "x"]);
return s.ahead === 1 && s.behind === 1 && s.state === "diverged";`,
            },
            {
              name: "edge case: never pushed (empty remote)",
              code: `const s = branchStatus(["a", "b", "c"], []);
return s.ahead === 3 && s.behind === 0 && s.state === "ahead";`,
            },
          ],
          hint: "Comparing lengths isn't enough: two branches with 3 commits each can still differ. Walk both arrays from the start while the hashes are equal — that index is the shared history.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "What's the difference between `git fetch` and `git pull`?",
              options: [
                "They are aliases",
                "`fetch` uploads, `pull` downloads",
                "`fetch` only downloads and updates `origin/*`; `pull` fetches and then merges into your branch",
              ],
              answer: 2,
              why: "`fetch` is always safe — it never touches your files. `pull` = `fetch` + integrate (merge, or rebase if configured).",
            },
            {
              q: "You push 3 more commits to a branch that already has an open PR. What happens?",
              options: [
                "The PR updates with the new commits, checks and the Vercel preview re-run",
                "You must close the PR and open a new one",
                "The commits go directly to main",
              ],
              answer: 0,
              why: "A PR tracks a branch. New commits on that branch appear in the PR automatically, and CI + preview deployments run again.",
            },
            {
              q: "Where do GitHub Actions workflow files live?",
              options: ["`.github/workflows/*.yml`", "`package.json` scripts", "`.vercel/`", "`.git/hooks/`"],
              answer: 0,
              why: "GitHub looks for YAML files in `.github/workflows/`. They often *call* your package.json scripts (`npm run lint`), but the workflow itself lives there.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 6. Package managers
    // ─────────────────────────────────────────────────────────────
    {
      slug: "package-managers",
      title: "Package managers, package.json & semver",
      summary: "npm, pnpm, yarn and bun; dependencies vs devDependencies, scripts, version ranges and lockfiles.",
      minutes: 13,
      blocks: [
        {
          type: "p",
          text: "Nobody writes a date library, an auth SDK or a Shopify client from scratch. You install **packages** — code published by others to the **npm registry** — and a **package manager** downloads them, along with *their* dependencies, into `node_modules/`. The whole system rests on one file: `package.json`.",
        },
        {
          type: "code",
          lang: "json",
          title: "package.json",
          code: `{
  "name": "client-portal",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "16.4.0",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "@clerk/nextjs": "^6.30.0",
    "@supabase/supabase-js": "^2.75.0",
    "zod": "^4.1.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "eslint": "^9.36.0",
    "prettier": "^3.6.0",
    "@types/node": "^22.0.0"
  }
}`,
        },
        {
          type: "table",
          rows: [
            ["Field", "What it's for"],
            ["`scripts`", "Named commands: `npm run dev`, `npm run lint`. `npm start` and `npm test` work without `run`."],
            ["`dependencies`", "Needed by the app at runtime: Next, React, Supabase client, Zod."],
            ["`devDependencies`", "Only needed while developing/building: TypeScript, ESLint, Prettier, type definitions."],
            ["`engines`", "Which Node versions the project supports (hosting platforms read it)."],
            ["`private: true`", "Prevents accidentally publishing the client's app to the public registry."],
          ],
        },
        {
          type: "code",
          lang: "bash",
          code: `npm install                       # install everything listed in package.json
npm install @supabase/supabase-js # add a dependency
npm install -D prettier           # add a devDependency (-D = --save-dev)
npm uninstall moment              # remove one
npm run dev                       # run a script
npm outdated                      # what has newer versions?`,
        },
        { type: "h", text: "Semantic versioning" },
        {
          type: "p",
          text: "Package versions follow **semver**: `MAJOR.MINOR.PATCH`, e.g. `2.75.3`. A **patch** (2.75.**4**) fixes bugs, a **minor** (2.**76**.0) adds features without breaking anything, and a **major** (**3**.0.0) may break your code — read the migration guide. Versions are compared **number by number**: `1.10.0` is newer than `1.9.0`.",
        },
        {
          type: "table",
          rows: [
            ["Range", "Means", "Would accept"],
            ["`1.4.2`", "Exactly this version", "1.4.2 only"],
            ["`^1.4.2`", ">=1.4.2 <2.0.0 (same major)", "1.4.9, 1.12.0 — not 2.0.0"],
            ["`~1.4.2`", ">=1.4.2 <1.5.0 (same minor)", "1.4.9 — not 1.5.0"],
            ["`^0.4.2`", ">=0.4.2 <0.5.0 (0.x: minor acts as major)", "0.4.7 — not 0.5.0"],
            ["`*` or `latest`", "Anything", "Avoid in real projects"],
          ],
        },
        {
          type: "run",
          title: "comparing versions correctly",
          code: `// Comparing version strings directly is a classic bug:
console.log('"1.10.0" > "1.9.0" →', "1.10.0" > "1.9.0"); // false! compares character by character

const parse = (v) => v.split(".").map(Number);
function compare(a, b) {
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) {
    if (x[i] !== y[i]) return x[i] - y[i];
  }
  return 0;
}

console.log("compare(1.10.0, 1.9.0) →", compare("1.10.0", "1.9.0")); // positive: newer
const versions = ["2.1.0", "1.10.0", "1.9.3", "1.9.12", "0.9.0"];
console.log(versions.sort(compare));`,
        },
        { type: "h", text: "Lockfiles: the exact versions" },
        {
          type: "p",
          text: "`^2.75.0` is a *range*. Without more information, two developers installing a week apart could get different versions. The **lockfile** (`package-lock.json`, `pnpm-lock.yaml`…) records the **exact** version of every package in the tree, including dependencies of dependencies. Commit it. Always.",
        },
        {
          type: "list",
          items: [
            "`npm install` — resolves ranges, may update the lockfile. Use while developing.",
            "`npm ci` — deletes `node_modules` and installs *exactly* what the lockfile says; fails if `package.json` and the lockfile disagree. Use in CI and when something feels broken.",
            "`node_modules/` — never committed (it's huge and rebuilt from the lockfile). If things get weird: delete it and reinstall.",
          ],
        },
        { type: "h", text: "npm, pnpm, yarn, bun" },
        {
          type: "table",
          rows: [
            ["", "npm", "pnpm", "yarn", "bun"],
            ["Comes with Node", "Yes", "No", "No", "No (own runtime)"],
            ["Lockfile", "`package-lock.json`", "`pnpm-lock.yaml`", "`yarn.lock`", "`bun.lock`"],
            ["Add a package", "`npm install x`", "`pnpm add x`", "`yarn add x`", "`bun add x`"],
            ["Run a script", "`npm run dev`", "`pnpm dev`", "`yarn dev`", "`bun dev`"],
            ["Run a one-off CLI", "`npx x`", "`pnpm dlx x`", "`yarn dlx x`", "`bunx x`"],
            ["Strength", "Default, universal", "Fast, disk-efficient, strict", "Workspaces, legacy projects", "Very fast installs"],
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "One project, one package manager",
          text: "If a repo has `pnpm-lock.yaml`, use `pnpm` — running `npm install` there creates a second lockfile and versions drift apart. Look at which lockfile exists before you install anything.",
        },
        {
          type: "callout",
          tone: "stack",
          title: "How hosting picks the package manager",
          text: "Vercel detects the package manager from the lockfile in your repo and runs the matching install command (e.g. `pnpm install` if it finds `pnpm-lock.yaml`), then your `build` script. A missing or out-of-date lockfile is one of the most common causes of *works locally, fails on Vercel*.",
        },
        {
          type: "callout",
          tone: "warn",
          title: "Supply-chain safety",
          text: "Packages can run install scripts on your machine, and popular packages have been hijacked to steal tokens. Before adding a dependency, check its weekly downloads, maintainers and last publish date; prefer fewer, well-known packages; run `npm audit`. pnpm (v10+) doesn't run dependencies' install scripts unless you allow them.",
        },
        {
          type: "challenge",
          title: "Does this version satisfy the range?",
          prompt:
            "Write `satisfies(version, range)` for simplified semver (plain `MAJOR.MINOR.PATCH`, no pre-release tags). A range without a prefix means *exactly that version*. A caret range `^X.Y.Z` means: at least `X.Y.Z`, and — if `X > 0`, same major; if `X === 0` and `Y > 0`, same `0.Y`; if both are 0, exactly `0.0.Z`.",
          starter: `function satisfies(version, range) {
  // naive: only checks the major number
  const major = (v) => v.replace("^", "").split(".")[0];
  return major(version) === major(range);
}`,
          solution: `function satisfies(version, range) {
  const parse = (v) => v.split(".").map(Number);
  const compare = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  const v = parse(version);

  if (!range.startsWith("^")) return compare(v, parse(range)) === 0;

  const min = parse(range.slice(1));
  if (compare(v, min) < 0) return false; // below the minimum
  const [major, minor] = min;
  if (major > 0) return v[0] === major;
  if (minor > 0) return v[0] === 0 && v[1] === minor;
  return compare(v, min) === 0; // ^0.0.Z → exactly 0.0.Z
}`,
          tests: [
            {
              name: "^2.75.0 accepts newer minor/patch, rejects next major",
              code: `return satisfies("2.75.0", "^2.75.0") && satisfies("2.80.3", "^2.75.0") && !satisfies("3.0.0", "^2.75.0");`,
            },
            {
              name: "rejects versions below the minimum",
              code: `return !satisfies("2.74.9", "^2.75.0") && !satisfies("2.75.0", "^2.75.1");`,
            },
            {
              name: "compares numerically (1.10.0 is newer than 1.9.0)",
              code: `return satisfies("1.10.0", "^1.9.0") && !satisfies("1.9.0", "^1.10.0");`,
            },
            {
              name: "0.x: caret locks the minor",
              code: `return satisfies("0.4.7", "^0.4.2") && !satisfies("0.5.0", "^0.4.2") && !satisfies("1.0.0", "^0.4.2");`,
            },
            {
              name: "edge cases: ^0.0.Z and exact versions",
              code: `return satisfies("0.0.3", "^0.0.3") && !satisfies("0.0.4", "^0.0.3") && satisfies("16.4.0", "16.4.0") && !satisfies("16.4.1", "16.4.0");`,
            },
          ],
          hint: "Parse both sides into number arrays with `split(\".\").map(Number)`. First check `version >= min` with a numeric compare, then decide the upper bound based on the first non-zero number of the range.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "Which belongs in `devDependencies`?",
              options: ["`@supabase/supabase-js`", "`react`", "`typescript`", "`next`"],
              answer: 2,
              why: "TypeScript is only needed to type-check/compile during development and builds. The others run as part of your app.",
            },
            {
              q: "`\"zod\": \"^4.1.0\"` — which version could `npm install` pick?",
              options: ["4.0.9", "4.3.2", "5.0.0", "3.23.8"],
              answer: 1,
              why: "`^4.1.0` means >=4.1.0 and <5.0.0. 4.3.2 fits; 4.0.9 is too old; 5.0.0 is a new major; 3.x is a different major.",
            },
            {
              q: "Why commit the lockfile?",
              options: [
                "It's required by Git",
                "So every machine and every deployment installs the exact same dependency versions",
                "It makes `node_modules` smaller",
              ],
              answer: 1,
              why: "Ranges in package.json allow drift; the lockfile pins exact versions of the whole tree, making installs reproducible locally, in CI and on Vercel.",
            },
          ],
        },
      ],
    },

    // ─────────────────────────────────────────────────────────────
    // 7. Debugging habits
    // ─────────────────────────────────────────────────────────────
    {
      slug: "debugging-habits",
      title: "Debugging habits",
      summary: "Read error messages and stack traces, use console and the debugger well, and debug methodically instead of guessing.",
      minutes: 12,
      blocks: [
        {
          type: "p",
          text: "Most of a developer's time isn't spent writing code — it's spent figuring out why code doesn't do what you expected. Good debuggers aren't smarter; they're **more methodical**. They read the error fully, form a hypothesis, test it, and narrow down. Bad debugging is changing random things until it works.",
        },
        { type: "h", text: "Read the error. All of it." },
        {
          type: "p",
          text: "A JavaScript error has three parts: a **name** (the kind of error), a **message** (what went wrong), and a **stack trace** (where it happened, and how the program got there — most recent call first).",
        },
        {
          type: "code",
          lang: "text",
          title: "terminal running next dev",
          code: `TypeError: Cannot read properties of undefined (reading 'email')
    at sendReceipt (src/lib/email.ts:18:31)          ← where it crashed
    at createInvoice (src/lib/invoices.ts:42:9)      ← who called it
    at async POST (src/app/api/invoices/route.ts:12:5) ← who called that
    at async node_modules/next/dist/server/...       ← framework internals`,
        },
        {
          type: "steps",
          items: [
            { title: "Name + message", text: "`TypeError` reading `email` of `undefined`: something you expected to be an object (probably `client` or `client.contact`) is `undefined`." },
            { title: "First frame in YOUR code", text: "Skip `node_modules` and `node:` internals. `src/lib/email.ts` line 18, column 31 is where to look." },
            { title: "Walk up the stack", text: "Who passed the bad value? `createInvoice` at `invoices.ts:42`. That's often where the real bug is." },
            { title: "Form a hypothesis and test it", text: "*The client has no contact in Supabase.* Log the value, or set a breakpoint, to confirm before changing code." },
          ],
        },
        {
          type: "table",
          rows: [
            ["Error", "Usually means"],
            ["`TypeError: x is not a function`", "Wrong import, typo, or the value isn't what you think"],
            ["`TypeError: Cannot read properties of undefined`", "Accessing a property on something missing (data not loaded, wrong key)"],
            ["`ReferenceError: x is not defined`", "Variable not declared / out of scope, or a browser-only global used on the server"],
            ["`SyntaxError`", "Code (or JSON) that can't be parsed: missing bracket, invalid JSON response"],
            ["`RangeError: Maximum call stack size exceeded`", "Infinite recursion (or an infinite re-render loop)"],
          ],
        },
        {
          type: "run",
          title: "inspect an error",
          code: `function getClientEmail(client) {
  return client.contact.email;
}

try {
  getClientEmail({ name: "Voltix" }); // no contact!
} catch (err) {
  console.log("name:   ", err.name);
  console.log("message:", err.message);
  console.log("stack (first lines):");
  console.log(err.stack.split("\\n").slice(0, 3).join("\\n"));
}

// Wrap low-level errors with context, keep the original as cause:
async function loadInvoice(id) {
  try {
    JSON.parse("{ invalid json"); // pretend this came from an API
  } catch (err) {
    throw new Error("Could not load invoice " + id, { cause: err });
  }
}

try {
  await loadInvoice("INV-2026-031");
} catch (err) {
  console.log(err.message, "← caused by →", err.cause.name + ": " + err.cause.message);
}`,
        },
        {
          type: "callout",
          tone: "stack",
          title: "Two consoles in a Next.js app",
          text: "Server Components, Server Actions and route handlers run on the **server**: their `console.log` and errors appear in the **terminal** running `next dev` (and in Vercel/Railway logs in production). Client Components run in the **browser**: look in DevTools → Console. Half of *my log isn't showing up* bugs are looking in the wrong one.",
        },
        { type: "h", text: "console, beyond console.log" },
        {
          type: "code",
          lang: "js",
          code: `console.log({ client, total });   // wrap in {} to see variable NAMES with values
console.table(leads);             // arrays of objects as a table
console.error("Payment failed", err); // red, and shows up as an error in logs
console.warn("Deprecated plan id", planId);`,
        },
        { type: "h", text: "The debugger: pause and look around" },
        {
          type: "p",
          text: "`console.log` makes you guess in advance what to print. A **debugger** pauses the program on a line so you can inspect *every* variable, step line by line, and see the call stack. Set a breakpoint by clicking left of a line number (VS Code or browser DevTools → Sources), or write `debugger;` in your code — it pauses there when DevTools is open.",
        },
        {
          type: "code",
          lang: "js",
          code: `function applyDiscount(cart, code) {
  debugger; // execution stops here when DevTools is open
  const pct = discounts[code];
  return cart.total * (1 - pct);
}`,
        },
        {
          type: "callout",
          tone: "tip",
          title: "Debug Node code too",
          text: "VS Code's **JavaScript Debug Terminal** (command palette → *Debug: JavaScript Debug Terminal*) attaches the debugger to anything you run in it — `npm run dev` included — so breakpoints in server code just work.",
        },
        { type: "h", text: "Habits that save hours" },
        {
          type: "list",
          items: [
            "**Reproduce first.** Find exact steps that trigger the bug every time. A bug you can't reproduce, you can't confirm fixed.",
            "**Change one thing at a time**, then re-test. Changing five things teaches you nothing.",
            "**Binary search.** Comment out half, or log at the midpoint, to find which half holds the bug. `git bisect` does this across commits to find the one that broke things.",
            "**Rubber duck.** Explain the problem out loud, line by line, to a colleague (or a rubber duck). You'll often spot it mid-sentence.",
            "**Read the docs and the actual error**, then search the exact message (in quotes) — before asking an AI to guess.",
            "**Check your assumptions.** Is the env var actually set? Is it the file you think it is? Did the server restart? Is the browser cache stale?",
          ],
        },
        {
          type: "callout",
          tone: "warn",
          title: "Don't swallow errors",
          text: "`catch (err) {}` with nothing inside hides the bug and leaves you debugging blind later. At minimum log it with `console.error`, or re-throw with context.",
        },
        {
          type: "challenge",
          title: "Find the first frame in your code",
          prompt:
            "Write `firstAppFrame(stack)` that takes a V8-style stack trace string and returns the first frame that is **your** code as `{ fn, file, line, col }` (line and col as numbers). Frames look like `    at fnName (file:line:col)` or `    at file:line:col` (anonymous — use `fn: \"<anonymous>\"`). Skip the first line (the error message), frames whose file contains `node_modules`, and frames whose file starts with `node:`. Strip a leading `async ` from the function name. Return `null` if there's no app frame.",
          starter: `function firstAppFrame(stack) {
  const line = stack.split("\\n")[1];
  const fn = line.trim().split(" ")[1];
  return { fn, file: null, line: 0, col: 0 };
}`,
          solution: `function firstAppFrame(stack) {
  const frames = stack.split("\\n").slice(1);
  for (const raw of frames) {
    const m = raw.match(/^\\s*at (?:(.+?) \\()?(.+):(\\d+):(\\d+)\\)?$/);
    if (!m) continue;
    const file = m[2];
    if (file.includes("node_modules") || file.startsWith("node:")) continue;
    const fn = (m[1] ?? "<anonymous>").replace(/^async /, "");
    return { fn, file, line: Number(m[3]), col: Number(m[4]) };
  }
  return null;
}`,
          tests: [
            {
              name: "reads a named frame",
              code: `const stack = "TypeError: Cannot read properties of undefined (reading 'email')\\n    at sendReceipt (/app/src/lib/email.ts:18:31)\\n    at createInvoice (/app/src/lib/invoices.ts:42:9)";
const f = firstAppFrame(stack);
return f.fn === "sendReceipt" && f.file === "/app/src/lib/email.ts" && f.line === 18 && f.col === 31;`,
            },
            {
              name: "skips node_modules and node: internals, strips async",
              code: `const stack = [
  "Error: Request failed with status 401",
  "    at Object.request (/app/node_modules/@shopify/admin-api-client/dist/index.js:88:13)",
  "    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)",
  "    at async getProducts (/app/src/lib/shopify.ts:12:20)",
].join("\\n");
const f = firstAppFrame(stack);
return f.fn === "getProducts" && f.file === "/app/src/lib/shopify.ts" && f.line === 12 && f.col === 20;`,
            },
            {
              name: "anonymous frames get fn '<anonymous>'",
              code: `const f = firstAppFrame("Error: boom\\n    at /app/scripts/import-leads.js:7:9");
return f.fn === "<anonymous>" && f.file === "/app/scripts/import-leads.js" && f.line === 7 && f.col === 9;`,
            },
            {
              name: "edge case: only library frames → null",
              code: `return firstAppFrame("Error: x\\n    at run (/app/node_modules/lib/index.js:1:1)\\n    at node:internal/main:5:3") === null;`,
            },
          ],
          hint: "Split on `\\n`, skip the first line, and match each frame with a regex such as `/^\\s*at (?:(.+?) \\()?(.+):(\\d+):(\\d+)\\)?$/` — group 1 is the optional function name, then file, line, column.",
        },
        {
          type: "quiz",
          questions: [
            {
              q: "A Server Action logs `console.log(order)`, but you see nothing in the browser console. Why?",
              options: [
                "console.log is disabled in production",
                "It ran on the server — the log is in the terminal running `next dev`",
                "Server Actions can't log",
              ],
              answer: 1,
              why: "Server-side code logs to the server process (your terminal locally, Vercel/Railway logs in production). Only Client Component code logs to the browser console.",
            },
            {
              q: "In a stack trace, which frame should you usually look at first?",
              options: [
                "The last line",
                "Any frame inside `node_modules`",
                "The error name only",
                "The first frame that points to your own code",
              ],
              answer: 3,
              why: "Frames are listed most-recent first. Library internals rarely contain the bug; the first frame in your code is where your code made the failing call.",
            },
            {
              q: "`TypeError: Cannot read properties of undefined (reading 'id')` most likely means…",
              options: [
                "You accessed `.id` on a value that is `undefined`",
                "The variable `id` was never declared",
                "There's a syntax error in the file",
              ],
              answer: 0,
              why: "The error is about the object you read `.id` from — it's `undefined` (e.g. data not loaded, wrong key, empty query result). An undeclared variable would be a `ReferenceError`.",
            },
          ],
        },
      ],
    },
  ],
};
