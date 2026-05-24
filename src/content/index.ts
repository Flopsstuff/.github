// Long-form project page bodies, authored as Markdown, one file per project:
//   src/content/<slug>.md
//
// Files are loaded eagerly as raw strings at build time via Vite's import.meta.glob.
// Keeping each project in its own file lets multiple authors work in parallel
// without colliding in a single source module.
//
// See docs/content-authoring.md for the section structure every page should follow.

const modules = import.meta.glob("./*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const bySlug: Record<string, string> = {};
for (const [path, raw] of Object.entries(modules)) {
  const slug = path.replace(/^\.\//, "").replace(/\.md$/, "");
  bySlug[slug] = raw;
}

/** Returns the Markdown body for a project, or undefined if no page has been written yet. */
export function getProjectContent(slug: string): string | undefined {
  const body = bySlug[slug];
  return body && body.trim().length > 0 ? body : undefined;
}
