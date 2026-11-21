import Link from "next/link";

export default function NotFound() {
  return (
    <main className="docs-not-found" style={{ maxWidth: "40rem", margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Page not found</h1>
      <p style={{ marginTop: ".75rem", opacity: 0.7 }}>That page doesn&apos;t exist. It may have moved when the docs were reorganised.</p>
      <p style={{ marginTop: "2rem" }}><Link href="/" style={{ color: "hsl(211 100% 50%)", fontWeight: 600 }}>Go to the docs home</Link></p>
    </main>
  );
}
