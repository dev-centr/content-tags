# content-tags

Hierarchical content tagging for static and app sites.

Site-owned taxonomy (JSON5 tree) + article frontmatter tag IDs → validated indexes, hierarchy pages, and UI adapters for Astro, Solid, React, and Next.js.

## Packages

| Package | Role |
| --- | --- |
| `@content-tags/core` | Load/validate taxonomy, resolve nodes, index posts↔tags, slug helpers |
| `@content-tags/astro` | Zod helpers + `getStaticPaths` builders |
| `@content-tags/solid` | `<TagList>`, `<TagTree>` |
| `@content-tags/react` | `<TagList>`, `<TagTree>` |
| `@content-tags/next` | App Router `generateStaticParams` helpers |

## Quick start

```bash
pnpm install
pnpm build
pnpm test
```

See `docs/` for the taxonomy format and framework integration.

## License

MIT
