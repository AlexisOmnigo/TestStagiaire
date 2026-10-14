import Link from "next/link";
import { allLessons, totalMinutes, tracks } from "@/content";
import { ContinueLink, ResetProgress, TrackMeter } from "@/components/ProgressBits";

/** The layers of a typical client project, and which track explains each one. */
const STACK = [
  {
    layer: "Browser",
    note: "What the visitor's device runs",
    items: [
      { name: "HTML & CSS", track: "foundations" },
      { name: "JavaScript", track: "javascript-basics" },
      { name: "DOM & fetch", track: "javascript-browser" },
      { name: "React", track: "react" },
      { name: "Tailwind", track: "your-stack" },
    ],
  },
  {
    layer: "App server",
    note: "Your code, running on Vercel",
    items: [
      { name: "Next.js", track: "nextjs" },
      { name: "Node.js", track: "nodejs" },
      { name: "TypeScript", track: "typescript" },
      { name: "Vercel", track: "your-stack" },
    ],
  },
  {
    layer: "Services",
    note: "Things your server talks to",
    items: [
      { name: "Supabase (Postgres)", track: "your-stack" },
      { name: "Clerk (auth)", track: "your-stack" },
      { name: "Shopify API", track: "your-stack" },
      { name: "Railway workers", track: "your-stack" },
    ],
  },
  {
    layer: "Problem solving",
    note: "Thinking like an engineer",
    items: [
      { name: "Big-O & patterns", track: "algorithms-patterns" },
      { name: "Data structures", track: "data-structures" },
      { name: "Graphs & DP", track: "algorithms-advanced" },
    ],
  },
  {
    layer: "Workflow",
    note: "How code gets there",
    items: [
      { name: "Terminal", track: "dev-environment" },
      { name: "Git & GitHub", track: "dev-environment" },
      { name: "npm", track: "dev-environment" },
    ],
  },
];

export default function Home() {
  const titles = Object.fromEntries(allLessons.map(({ track, lesson }) => [`${track.slug}/${lesson.slug}`, lesson.title]));
  const first = allLessons[0];
  const challenges = allLessons.reduce((n, { lesson }) => n + lesson.blocks.filter((b) => b.type === "challenge").length, 0);
  const playgrounds = allLessons.reduce((n, { lesson }) => n + lesson.blocks.filter((b) => b.type === "run").length, 0);

  return (
    <div className="page home">
      <section className="hero">
        <p className="eyebrow">From first variable to production app</p>
        <h1>
          Understand the tools you code with, <span className="accent">from start to finish.</span>
        </h1>
        <p className="lead">
          One path, in order: how the web works, JavaScript from the ground up, what happens under the hood, Node.js, TypeScript,
          React, Next.js, and the services around them — Supabase, Clerk, Vercel, Railway, GitHub, Shopify. Every lesson has code
          you can run right here, challenges graded by tests, and a quiz.
        </p>
        <div className="hero-actions">
          {first && <ContinueLink titles={titles} first={`${first.track.slug}/${first.lesson.slug}`} />}
          <Link href="/practice" className="btn btn-lg btn-secondary">
            Practice problems
          </Link>
        </div>
        <div className="stats">
          <span>{tracks.length} tracks</span>
          <span>{allLessons.length} lessons</span>
          <span>{playgrounds} playgrounds</span>
          <span>{challenges} challenges</span>
          <span>~{Math.round(totalMinutes / 60)} hours</span>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">How it all fits together</h2>
        <p className="muted">
          Every client app you build is the same few layers. Each box links to the track that explains it.
        </p>
        <div className="stack-map">
          {STACK.map((row) => (
            <div key={row.layer} className="stack-row">
              <div className="stack-layer">
                <strong>{row.layer}</strong>
                <span className="muted small">{row.note}</span>
              </div>
              <div className="stack-items">
                {row.items.map((item) => (
                  <Link key={item.name} href={`/learn/${item.track}`} className="stack-item">
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="path">
        <div className="section-row">
          <h2 className="section-title">The path</h2>
          <ResetProgress />
        </div>
        <ol className="path">
          {tracks.map((t, i) => {
            const minutes = t.lessons.reduce((s, l) => s + l.minutes, 0);
            return (
              <li key={t.slug} className="path-item">
                <span className="path-rail" style={{ "--c": t.color } as React.CSSProperties}>
                  <span className="path-node">{String(i).padStart(2, "0")}</span>
                </span>
                <Link href={`/learn/${t.slug}`} className="path-card">
                  <div className="path-card-head">
                    <span className="badge" style={{ "--c": t.color } as React.CSSProperties}>
                      {t.badge}
                    </span>
                    <div>
                      <h3>{t.title}</h3>
                      <p className="muted">{t.tagline}</p>
                    </div>
                  </div>
                  <p className="path-lessons">{t.lessons.map((l) => l.title).join(" · ")}</p>
                  <div className="path-foot">
                    <span className="muted small">
                      {t.lessons.length} lessons · ~{Math.round(minutes / 5) * 5} min
                    </span>
                    <TrackMeter ids={t.lessons.map((l) => `${t.slug}/${l.slug}`)} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="section how">
        <h2 className="section-title">How to use this</h2>
        <div className="how-grid">
          <div>
            <strong>Run everything</strong>
            <p className="muted">Playgrounds run in your browser. Change the code, break it, press Run (Ctrl/⌘ + Enter).</p>
          </div>
          <div>
            <strong>Solve the challenges</strong>
            <p className="muted">Tests check your code. The solution unlocks after your first attempt.</p>
          </div>
          <div>
            <strong>Go in order</strong>
            <p className="muted">Each track builds on the previous one. Skim what you know, but do the challenges.</p>
          </div>
          <div>
            <strong>Progress is saved</strong>
            <p className="muted">Completed lessons and code drafts are stored in this browser only.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
