"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { SearchEntry } from "./search-index";

/**
 * Search over a build-time index of every page and section heading. It runs
 * entirely in the browser: the docs CSP allows no network search service and
 * no WebAssembly, which rules out Nextra's default Pagefind search.
 */
export function DocsSearch({ index }: { index: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase("en-US").split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return index
      .map((entry) => {
        const title = entry.title.toLocaleLowerCase("en-US");
        const haystack = `${title} ${entry.page.toLocaleLowerCase("en-US")} ${entry.text.toLocaleLowerCase("en-US")}`;
        if (!terms.every((term) => haystack.includes(term))) return null;
        return { entry, score: terms.filter((term) => title.includes(term)).length };
      })
      .filter((result): result is { entry: SearchEntry; score: number } => result !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((result) => result.entry);
  }, [index, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key === "/" && !target?.closest("input, textarea, [contenteditable]")) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => { window.location.assign(href); };

  return (
    <div className="docs-search">
      <input
        ref={input}
        type="search"
        role="combobox"
        aria-label="Search documentation"
        aria-expanded={results.length > 0}
        aria-controls={listId}
        aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
        value={query}
        placeholder="Search docs"
        onChange={(event) => { setQuery(event.target.value); setActive(0); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
          if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
          if (event.key === "Enter" && results[active]) go(results[active].href);
          if (event.key === "Escape") setQuery("");
        }}
      />
      <kbd aria-hidden>/</kbd>
      {query.trim() ? (
        <ul id={listId} role="listbox">
          {results.length ? results.map((result, position) => (
            <li key={result.href} id={`${listId}-${position}`} role="option" aria-selected={position === active}>
              <a href={result.href} onMouseEnter={() => setActive(position)}>
                <small>{result.page}</small>
                <b>{result.title}</b>
                {result.text ? <span>{result.text}</span> : null}
              </a>
            </li>
          )) : <li className="docs-search-empty">No results for “{query.trim()}”.</li>}
        </ul>
      ) : null}
    </div>
  );
}
