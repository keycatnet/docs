import { useMDXComponents as getThemeMDXComponents } from "nextra-theme-docs";
import type { MDXComponents } from "nextra/mdx-components";

// The theme's own wrapper renders the table of contents, breadcrumbs and
// previous/next links. Replacing it, as an earlier version did, left pages as
// bare text with none of the docs layout.
export function useMDXComponents(components: MDXComponents = {}) {
  return getThemeMDXComponents(components);
}
