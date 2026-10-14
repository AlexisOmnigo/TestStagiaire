import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page">
      <h1>404 — lesson not found</h1>
      <p className="lead">That page doesn&apos;t exist (yet).</p>
      <Link href="/" className="btn">
        Back to the path
      </Link>
    </div>
  );
}
