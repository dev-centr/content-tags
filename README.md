<a id="readme-top"></a>
<div align="center">
  <a href="https://github.com/dev-centr/content-tags/graphs/contributors"><img src="https://img.shields.io/github/contributors/dev-centr/content-tags.svg?style=for-the-badge" alt="Contributors"></a>
  <a href="https://github.com/dev-centr/content-tags/network/members"><img src="https://img.shields.io/github/forks/dev-centr/content-tags.svg?style=for-the-badge" alt="Forks"></a>
  <a href="https://github.com/dev-centr/content-tags/stargazers"><img src="https://img.shields.io/github/stars/dev-centr/content-tags.svg?style=for-the-badge" alt="Stargazers"></a>
  <a href="https://github.com/dev-centr/content-tags/issues"><img src="https://img.shields.io/github/issues/dev-centr/content-tags.svg?style=for-the-badge" alt="Issues"></a>
  <a href="https://github.com/dev-centr/content-tags/blob/main/LICENSE"><img src="https://img.shields.io/github/license/dev-centr/content-tags.svg?style=for-the-badge" alt="License"></a>

  <h3 align="center">content-tags</h3>
  <p align="center">
    Hierarchical content tagging: taxonomy registry, Astro/Solid/React/Next adapters.
    <br />
    <a href="https://github.com/dev-centr/content-tags/issues">Report Bug</a>
    &middot;
    <a href="https://github.com/dev-centr/content-tags/issues">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Hierarchical content tagging for static and app sites.

Site-owned taxonomy (JSON5 tree) + article frontmatter tag IDs → validated indexes, hierarchy pages, and UI adapters for Astro, Solid, React, and Next.js.

### Packages

| Package | Role |
| --- | --- |
| `@content-tags/core` | Load/validate taxonomy, resolve nodes, index posts↔tags, slug helpers |
| `@content-tags/astro` | Zod helpers + `getStaticPaths` builders |
| `@content-tags/solid` | `<TagList>`, `<TagTree>` |
| `@content-tags/react` | `<TagList>`, `<TagTree>` |
| `@content-tags/next` | App Router `generateStaticParams` helpers |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Installation

```bash
pnpm install
pnpm build
pnpm test
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

See `docs/` for the taxonomy format and framework integration.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

DevCentr.org — support@devcentr.org

Project Link: [https://github.com/dev-centr/content-tags](https://github.com/dev-centr/content-tags)

Site: [https://devcentr.org](https://devcentr.org)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
