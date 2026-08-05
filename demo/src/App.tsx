import {
  buildTagIndex,
  type Taxonomy,
  type TaggedPost,
} from "@content-tags/core";
import { TagTree, TagList } from "@content-tags/react";

const taxonomy: Taxonomy = {
  tags: [
    {
      id: "microsoft",
      label: "Microsoft",
      children: [
        {
          id: "microsoft/feedback-hub",
          label: "Feedback Hub",
          description: "Product feedback filed via Feedback Hub",
        },
      ],
    },
    { id: "apis", label: "APIs" },
  ],
};

const posts: TaggedPost[] = [
  {
    id: "feedback-api",
    title: "Access Feedback from API and clearweb",
    href: "#feedback-api",
    tags: ["microsoft/feedback-hub", "apis"],
  },
];

const index = buildTagIndex(taxonomy, posts);

export function App() {
  return (
    <main className="page">
      <h1>content-tags demo</h1>
      <p>Hierarchical taxonomy with post counts.</p>
      <section>
        <h2>Tag tree</h2>
        <TagTree
          nodes={index.roots}
          postsByTag={index.postsByTag}
          showCounts
          className="tree"
          linkClassName="link"
          countClassName="count"
        />
      </section>
      <section>
        <h2>Post tags</h2>
        <TagList
          tags={index.tagsByPost.get("feedback-api") ?? []}
          className="list"
          linkClassName="link"
        />
      </section>
    </main>
  );
}
