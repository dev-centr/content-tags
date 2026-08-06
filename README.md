<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<div align="center">
  <h1>content-tags</h1>
  <p>Hierarchical content tagging: taxonomy registry, Astro/Solid/React/Next adapters.</p>
  <p>
    <a href="https://github.com/dev-centr/content-tags/issues">Report Bug</a>
    ·
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

## Installation

```bash
pnpm install
pnpm build
pnpm test
```

## Usage

See `docs/` for the taxonomy format and framework integration.

## License

MIT

## Contact

DevCentr.org - support@devcentr.org

Project Link: https://github.com/dev-centr/content-tags

Site: https://devcentr.org

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/dev-centr/content-tags.svg?style=for-the-badge
[contributors-url]: https://github.com/dev-centr/content-tags/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dev-centr/content-tags.svg?style=for-the-badge
[forks-url]: https://github.com/dev-centr/content-tags/network/members
[stars-shield]: https://img.shields.io/github/stars/dev-centr/content-tags.svg?style=for-the-badge
[stars-url]: https://github.com/dev-centr/content-tags/stargazers
[issues-shield]: https://img.shields.io/github/issues/dev-centr/content-tags.svg?style=for-the-badge
[issues-url]: https://github.com/dev-centr/content-tags/issues
[license-shield]: https://img.shields.io/github/license/dev-centr/content-tags.svg?style=for-the-badge
[license-url]: https://github.com/dev-centr/content-tags/blob/main/LICENSE
