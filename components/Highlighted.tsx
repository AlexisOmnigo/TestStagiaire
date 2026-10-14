import { highlight } from "@/lib/highlight";

/** Syntax-highlighted code as spans (no wrapper), usable on server or client. */
export function Highlighted({ code, lang }: { code: string; lang: string }) {
  return (
    <>
      {highlight(code, lang).map((t, i) =>
        t.kind === "plain" ? t.text : <span key={i} className={`tok-${t.kind}`}>{t.text}</span>,
      )}
    </>
  );
}
