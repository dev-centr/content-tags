import type { ReactNode } from "react";
import type { ResolvedTag, TaggedPost } from "@content-tags/core";
import { tagIdToHref } from "@content-tags/core";

export type TagListProps = {
  tags: ResolvedTag[];
  basePath?: string;
  className?: string;
  linkClassName?: string;
};

export function TagList(props: TagListProps) {
  const base = props.basePath ?? "/tags";
  return (
    <ul className={props.className} data-content-tags="list">
      {props.tags.map((tag) => (
        <li key={tag.id}>
          <a className={props.linkClassName} href={tagIdToHref(tag.id, base)}>
            {tag.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export type TagTreeProps = {
  nodes: ResolvedTag[];
  postsByTag?: Map<string, TaggedPost[]>;
  basePath?: string;
  className?: string;
  linkClassName?: string;
  countClassName?: string;
  showCounts?: boolean;
};

function TagTreeNodes(props: TagTreeProps): ReactNode {
  const base = props.basePath ?? "/tags";
  return (
    <ul className={props.className} data-content-tags="tree">
      {props.nodes.map((node) => {
        const count = props.showCounts
          ? (props.postsByTag?.get(node.id)?.length ?? 0)
          : undefined;
        return (
          <li key={node.id}>
            <a className={props.linkClassName} href={tagIdToHref(node.id, base)}>
              {node.label}
            </a>
            {props.showCounts ? (
              <span className={props.countClassName}> ({count})</span>
            ) : null}
            {node.children.length > 0 ? (
              <TagTreeNodes
                nodes={node.children}
                postsByTag={props.postsByTag}
                basePath={base}
                className={props.className}
                linkClassName={props.linkClassName}
                countClassName={props.countClassName}
                showCounts={props.showCounts}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function TagTree(props: TagTreeProps) {
  return <TagTreeNodes {...props} />;
}

export { tagIdToHref } from "@content-tags/core";
export type { ResolvedTag, TaggedPost } from "@content-tags/core";
