import type { TagIndex } from "@content-tags/core";
import { listAllTagIds, tagIdToSlugParts, slugPartsToTagId } from "@content-tags/core";

export { TagList, TagTree } from "@content-tags/react";
export type { TagListProps, TagTreeProps } from "@content-tags/react";

/**
 * App Router `generateStaticParams` entries for a catch-all `[[...tag]]` or `[...tag]` segment.
 */
export function tagGenerateStaticParams(
  index: TagIndex,
): Array<{ tag: string[] }> {
  return listAllTagIds(index.byId).map((tagId) => ({
    tag: tagIdToSlugParts(tagId),
  }));
}

export function tagIdFromParams(tag: string[] | undefined): string {
  if (!tag?.length) return "";
  return slugPartsToTagId(tag);
}

export {
  buildTagIndex,
  loadTaxonomyFromString,
  resolveTaxonomy,
  tagIdToHref,
  getTagBreadcrumb,
  getPostsForTag,
  getTagsForPost,
  listAllTagIds,
} from "@content-tags/core";
export type {
  TagIndex,
  TaggedPost,
  Taxonomy,
  ResolvedTag,
} from "@content-tags/core";
