/**
 * Hierarchical content-tags core: taxonomy load, validate, index, slugs.
 */

export type TagDefinition = {
  id: string;
  label: string;
  description?: string;
  children?: TagDefinition[];
};

export type Taxonomy = {
  tags: TagDefinition[];
};

export type ResolvedTag = TagDefinition & {
  parentId: string | null;
  depth: number;
  pathIds: string[];
  children: ResolvedTag[];
};

export type TaggedPost = {
  id: string;
  title: string;
  href: string;
  tags: string[];
  pubDate?: Date | string;
};

export type TagIndex = {
  taxonomy: Taxonomy;
  byId: Map<string, ResolvedTag>;
  roots: ResolvedTag[];
  postsByTag: Map<string, TaggedPost[]>;
  tagsByPost: Map<string, ResolvedTag[]>;
};

export class TaxonomyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TaxonomyError";
  }
}

const ID_RE = /^[a-z0-9]+(?:[/-][a-z0-9]+)*$/;

function assertId(id: string, ctx: string): void {
  if (!ID_RE.test(id)) {
    throw new TaxonomyError(
      `Invalid tag id "${id}" (${ctx}): use lowercase path-like ids (a-z, 0-9, /, -)`,
    );
  }
}

function walkDefine(
  nodes: TagDefinition[],
  parentId: string | null,
  depth: number,
  pathIds: string[],
  byId: Map<string, ResolvedTag>,
): ResolvedTag[] {
  const out: ResolvedTag[] = [];
  for (const node of nodes) {
    assertId(node.id, "taxonomy");
    if (!node.label?.trim()) {
      throw new TaxonomyError(`Tag "${node.id}" is missing a label`);
    }
    if (byId.has(node.id)) {
      throw new TaxonomyError(`Duplicate tag id "${node.id}"`);
    }
    const nextPath = [...pathIds, node.id];
    const resolved: ResolvedTag = {
      id: node.id,
      label: node.label,
      description: node.description,
      parentId,
      depth,
      pathIds: nextPath,
      children: [],
    };
    byId.set(node.id, resolved);
    resolved.children = walkDefine(
      node.children ?? [],
      node.id,
      depth + 1,
      nextPath,
      byId,
    );
    out.push(resolved);
  }
  return out;
}

/** Validate raw taxonomy and build a flat id map + resolved tree. */
export function resolveTaxonomy(taxonomy: Taxonomy): {
  roots: ResolvedTag[];
  byId: Map<string, ResolvedTag>;
} {
  if (!taxonomy || !Array.isArray(taxonomy.tags)) {
    throw new TaxonomyError("Taxonomy must have a tags array");
  }
  const byId = new Map<string, ResolvedTag>();
  const roots = walkDefine(taxonomy.tags, null, 0, [], byId);
  return { roots, byId };
}

/** Parse JSON or JSON5 text into a Taxonomy object (caller may pass JSON5.parse). */
export function parseTaxonomyObject(raw: unknown): Taxonomy {
  if (!raw || typeof raw !== "object") {
    throw new TaxonomyError("Taxonomy root must be an object");
  }
  const tags = (raw as { tags?: unknown }).tags;
  if (!Array.isArray(tags)) {
    throw new TaxonomyError("Taxonomy must have a tags array");
  }
  return { tags: tags as TagDefinition[] };
}

export type LoadTaxonomyOptions = {
  /** Parse function; default JSON.parse. Pass JSON5.parse for comments/trailing commas. */
  parse?: (text: string) => unknown;
};

export function loadTaxonomyFromString(
  text: string,
  options: LoadTaxonomyOptions = {},
): Taxonomy {
  const parse = options.parse ?? JSON.parse;
  let raw: unknown;
  try {
    raw = parse(text);
  } catch (e) {
    throw new TaxonomyError(
      `Failed to parse taxonomy: ${e instanceof Error ? e.message : String(e)}`,
    );
  }
  const taxonomy = parseTaxonomyObject(raw);
  resolveTaxonomy(taxonomy); // validate eagerly
  return taxonomy;
}

/** URL slug segments for a tag id (`microsoft/feedback-hub` → `['microsoft','feedback-hub']`). */
export function tagIdToSlugParts(tagId: string): string[] {
  return tagId.split("/").filter(Boolean);
}

/** Join slug parts back to a tag id. */
export function slugPartsToTagId(parts: string | string[]): string {
  const arr = Array.isArray(parts) ? parts : parts.split("/").filter(Boolean);
  return arr.join("/");
}

/** Encode tag id for use in a path under `/tags/...`. */
export function tagIdToHref(tagId: string, base = "/tags"): string {
  const parts = tagIdToSlugParts(tagId).map(encodeURIComponent);
  return `${base.replace(/\/$/, "")}/${parts.join("/")}`;
}

export function getDescendantIds(
  byId: Map<string, ResolvedTag>,
  tagId: string,
): string[] {
  const node = byId.get(tagId);
  if (!node) return [];
  const ids: string[] = [];
  const stack = [...node.children];
  while (stack.length) {
    const n = stack.pop()!;
    ids.push(n.id);
    stack.push(...n.children);
  }
  return ids;
}

export function getAncestorIds(
  byId: Map<string, ResolvedTag>,
  tagId: string,
): string[] {
  const node = byId.get(tagId);
  if (!node) return [];
  return node.pathIds.slice(0, -1);
}

export type BuildIndexOptions = {
  /** When true (default), a tag page includes posts tagged on descendants. */
  includeDescendants?: boolean;
};

/**
 * Validate every post tag exists; build bidirectional indexes.
 */
export function buildTagIndex(
  taxonomy: Taxonomy,
  posts: TaggedPost[],
  options: BuildIndexOptions = {},
): TagIndex {
  const includeDescendants = options.includeDescendants ?? true;
  const { roots, byId } = resolveTaxonomy(taxonomy);
  const postsByTag = new Map<string, TaggedPost[]>();
  const tagsByPost = new Map<string, ResolvedTag[]>();

  for (const id of byId.keys()) {
    postsByTag.set(id, []);
  }

  for (const post of posts) {
    const resolvedTags: ResolvedTag[] = [];
    for (const tagId of post.tags) {
      const tag = byId.get(tagId);
      if (!tag) {
        throw new TaxonomyError(
          `Post "${post.id}" references unknown tag "${tagId}"`,
        );
      }
      resolvedTags.push(tag);
      const bucket = postsByTag.get(tagId)!;
      if (!bucket.some((p) => p.id === post.id)) {
        bucket.push(post);
      }
    }
    tagsByPost.set(post.id, resolvedTags);
  }

  if (includeDescendants) {
    for (const [tagId] of byId) {
      const descendantIds = getDescendantIds(byId, tagId);
      const seen = new Set((postsByTag.get(tagId) ?? []).map((p) => p.id));
      const merged = [...(postsByTag.get(tagId) ?? [])];
      for (const d of descendantIds) {
        for (const p of postsByTag.get(d) ?? []) {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            merged.push(p);
          }
        }
      }
      postsByTag.set(tagId, merged);
    }
  }

  return { taxonomy, byId, roots, postsByTag, tagsByPost };
}

export function listAllTagIds(byId: Map<string, ResolvedTag>): string[] {
  return [...byId.keys()];
}

export function getPostsForTag(
  index: TagIndex,
  tagId: string,
): TaggedPost[] {
  return index.postsByTag.get(tagId) ?? [];
}

export function getTagsForPost(
  index: TagIndex,
  postId: string,
): ResolvedTag[] {
  return index.tagsByPost.get(postId) ?? [];
}

/** Breadcrumb from root to tag (inclusive). */
export function getTagBreadcrumb(
  byId: Map<string, ResolvedTag>,
  tagId: string,
): ResolvedTag[] {
  const node = byId.get(tagId);
  if (!node) return [];
  return node.pathIds
    .map((id) => byId.get(id))
    .filter((t): t is ResolvedTag => Boolean(t));
}
