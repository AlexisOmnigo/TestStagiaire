import type { Metadata, Viewport } from "next";
import { Sidebar } from "@/components/Sidebar";
import { tracks } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Dev Path", template: "%s · Dev Path" },
  description:
    "An interactive path from JavaScript to TypeScript, Node.js, React, Next.js and the tools around them — with runnable code, challenges and quizzes.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0f12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Only the data the sidebar needs crosses to the client, not the full lesson content.
  const nav = tracks.map((t) => ({
    slug: t.slug,
    title: t.title,
    badge: t.badge,
    color: t.color,
    lessons: t.lessons.map((l) => ({ slug: l.slug, title: l.title })),
  }));
  return (
    <html lang="en">
      <body>
        <Sidebar tracks={nav} />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
