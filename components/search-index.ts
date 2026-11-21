import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

export type SearchEntry = { href: string; page: string; title: string; text: string };

const contentDir = join(process.cwd(), "content");

async function mdxFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return mdxFiles(path);
    return entry.name.endsWith(".mdx") ? [path] : [];
  }));
  return nested.flat();
}

const slug = (heading: string) => heading.toLowerCase().replace(/[`*_]/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");

/**
 * Built from the MDX sources at export time, so search always matches the
 * pages that shipped. A hand-written list is what let the old search advertise
 * pages and features that no longer existed.
 */
export async function searchIndex(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];
  for (const file of (await mdxFiles(contentDir)).sort()) {
    const source = await readFile(file, "utf8");
    const route = relative(contentDir, file).replace(/\.mdx$/, "").replace(/(^|\/)index$/, "");
    const href = `/${route}`;
    const front = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? "";
    const field = (name: string) => new RegExp(`^${name}:\\s*(.+)$`, "m").exec(front)?.[1]?.trim().replace(/^"(.*)"$/, "$1");
    const page = field("title") ?? route;
    const description = field("description") ?? "";
    entries.push({ href, page, title: page, text: description });
    // Headings outside fenced code blocks become their own results.
    const body = source.replace(/```[\s\S]*?```/g, "").replace(/^import .*$/gm, "").replace(/<\/?[A-Za-z][^>]*>/g, "");
    for (const match of body.matchAll(/^#{2,3}\s+(.+)$/gm)) {
      const heading = match[1]!.trim();
      const after = body.slice(match.index! + match[0].length).split(/\n#{1,3}\s/)[0] ?? "";
      const text = after.replace(/[`*_>#|[\]()]/g, "").replace(/\s+/g, " ").trim().slice(0, 140);
      entries.push({ href: `${href}#${slug(heading)}`, page, title: heading.replace(/`/g, ""), text });
    }
  }
  return entries;
}
