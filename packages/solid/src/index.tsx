import type { JSX } from "solid-js";
import { For, Show } from "solid-js";
import type { ResolvedTag, TaggedPost } from "@content-tags/core";
import { tagIdToHref } from "@content-tags/core";

export type TagListProps = {
  tags: ResolvedTag[];
  basePath?: string;
  class?: string;
  linkClass?: string;
};

export function TagList(props: TagListProps) {
  const base = () => props.basePath ?? "/tags";
  return (
    <ul class={props.class} data-content-tags="list">
      <For each={props.tags}>
        {(tag) => (
          <li>
            <a class={props.linkClass} href={tagIdToHref(tag.id, base())}>
              {tag.label}
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}

export type TagTreeNodeProps = {
  nodes: ResolvedTag[];
  postsByTag?: Map<string, TaggedPost[]>;
  basePath?: string;
  class?: string;
  linkClass?: string;
  countClass?: string;
  showCounts?: boolean;
};

function TagTreeNodes(props: TagTreeNodeProps): JSX.Element {
  const base = () => props.basePath ?? "/tags";
  return (
    <ul class={props.class} data-content-tags="tree">
      <For each={props.nodes}>
        {(node) => {
          const count = () =>
            props.showCounts
              ? (props.postsByTag?.get(node.id)?.length ?? 0)
              : undefined;
          return (
            <li>
              <a class={props.linkClass} href={tagIdToHref(node.id, base())}>
                {node.label}
              </a>
              <Show when={props.showCounts}>
                <span class={props.countClass}> ({count()})</span>
              </Show>
              <Show when={node.children.length > 0}>
                <TagTreeNodes
                  nodes={node.children}
                  postsByTag={props.postsByTag}
                  basePath={base()}
                  class={props.class}
                  linkClass={props.linkClass}
                  countClass={props.countClass}
                  showCounts={props.showCounts}
                />
              </Show>
            </li>
          );
        }}
      </For>
    </ul>
  );
}

export type TagTreeProps = TagTreeNodeProps;

export function TagTree(props: TagTreeProps) {
  return <TagTreeNodes {...props} />;
}

export { tagIdToHref } from "@content-tags/core";
export type { ResolvedTag, TaggedPost } from "@content-tags/core";
