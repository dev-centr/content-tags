/**
 * Astro helpers for hierarchical content-tags.
 */
import type {
  TagIndex,
  TaggedPost,
  Taxonomy,
  ResolvedTag,
} from "@content-tags/core";
import {
  buildTagIndex,
  listAllTagIds,
  tagIdToSlugParts,
  slugPartsToTagId,
} from "@content-tags/core";

export type ZodLike = {
  array: (schema: unknown) => { default: (v: string[]) => unknown };
  string: () => unknown;
};

/** Build a Zod-compatible `tags` field: `z.array(z.string()).default([])`. */
export function tagsField(z: ZodLike) {
  return z.array(z.string()).default([]);
}

export type CollectionPostLike = {
  id: string;
  data: {
    title: string;
    tags?: string[];
    pubDate?: Date | string;
    draft?: boolean;
  };
};

export type MapPostsOptions = {
  /** Build href from collection entry id. Default: `/blog/posts/${id}` */
  hrefForId?: (id: string) => string;
  /** Skip drafts (default true). */
  skipDrafts?: boolean;
};

export function collectionEntriesToTaggedPosts(
  entries: CollectionPostLike[],
  options: MapPostsOptions = {},
): TaggedPost[] {
  const hrefForId = options.hrefForId ?? ((id) => `/blog/posts/${id}`);
  const skipDrafts = options.skipDrafts ?? true;
  return entries
    .filter((e) => !(skipDrafts && e.data.draft))
    .map((e) => ({
      id: e.id,
      title: e.data.title,
      href: hrefForId(e.id),
      tags: e.data.tags ?? [],
      pubDate: e.data.pubDate,
    }));
}

export function buildIndexFromCollection(
  taxonomy: Taxonomy,
  entries: CollectionPostLike[],
  options: MapPostsOptions = {},
): TagIndex {
  return buildTagIndex(
    taxonomy,
    collectionEntriesToTaggedPosts(entries, options),
  );
}

export type TagStaticPath = {
  params: { tag: string | string[] };
  props: {
    tagId: string;
    tag: ResolvedTag;
    posts: TaggedPost[];
    index: TagIndex;
  };
};

/**
 * Paths for Astro `getStaticPaths` on `/tags/[...tag].astro`.
 * Astro expects the rest param as a slash-joined string (not string[]).
 */
export function tagStaticPaths(
  index: TagIndex,
  options: { restParam?: boolean } = {},
): TagStaticPath[] {
  // restParam kept for API compatibility; Astro always wants a joined string.
  void options.restParam;
  return listAllTagIds(index.byId).map((tagId) => {
    const tag = index.byId.get(tagId)!;
    const parts = tagIdToSlugParts(tagId);
    return {
      params: { tag: parts.join("/") },
      props: {
        tagId,
        tag,
        posts: index.postsByTag.get(tagId) ?? [],
        index,
      },
    };
  });
}

export function tagIdFromRestParam(
  tag: string | string[] | undefined,
): string {
  if (tag == null) return "";
  return slugPartsToTagId(tag);
}

export type { TagIndex, TaggedPost, Taxonomy, ResolvedTag };
export {
  buildTagIndex,
  listAllTagIds,
  tagIdToSlugParts,
  slugPartsToTagId,
  tagIdToHref,
  loadTaxonomyFromString,
  resolveTaxonomy,
  getTagBreadcrumb,
  getPostsForTag,
  getTagsForPost,
} from "@content-tags/core";
