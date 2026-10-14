# Dev Path

An interactive course that takes you from your first JavaScript variable to a production
Next.js app, and explains every tool along the way: how the web works, the terminal and Git,
JavaScript (basics, modern syntax, what happens under the hood, the browser), Node.js,
TypeScript, React, Next.js, and the services around them (Tailwind, Supabase, Clerk, Vercel,
Railway, Shopify's API).

Every lesson has:

- **Playgrounds**: editable JavaScript/TypeScript that runs in your browser (in a Web Worker,
  so an infinite loop can be stopped).
- **Challenges** graded by tests. The solution unlocks after your first attempt.
- **A quiz** with an explanation for every answer.

Progress and code drafts are saved in your browser (localStorage). No account needed.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Script                  | What it does                                                         |
| ----------------------- | -------------------------------------------------------------------- |
| `npm run build`         | Production build (every page is statically generated)                |
| `npm run start`         | Serve the production build                                           |
| `npm run typecheck`     | TypeScript check                                                     |
| `npm run check:content` | Runs every playground, and checks each challenge's solution and starter against its tests |

Deploys to Vercel as-is (import the repo, no settings needed).

## How it's built

The app is itself a small example of the stack it teaches: Next.js App Router + TypeScript,
with no UI libraries.

```
app/                       routes (App Router)
  page.tsx                 home: the path + how the stack fits together
  learn/[track]/page.tsx   track overview
  learn/[track]/[lesson]/  a lesson
components/                lesson blocks, playground, challenge, quiz, sidebar
content/
  types.ts                 the lesson schema (blocks: p, code, run, challenge, quiz…)
  tracks/NN-*.ts           one file per track — all course content is plain data
lib/
  runner.ts                runs learner code in a Web Worker (TS is stripped with sucrase)
  highlight.ts             tiny syntax highlighter
  progress.ts              localStorage progress store (useSyncExternalStore)
scripts/check-content.ts   content validator
```

### Adding or editing a lesson

1. Edit (or add) a file in `content/tracks/`. Lessons are arrays of blocks. See `content/types.ts`.
2. For a new track file, register it in `content/index.ts`.
3. Run `npm run check:content` to make sure every snippet runs and every challenge is solvable.
