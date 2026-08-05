import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildTagIndex,
  getDescendantIds,
  getTagBreadcrumb,
  loadTaxonomyFromString,
  resolveTaxonomy,
  tagIdToHref,
  TaxonomyError,
  type Taxonomy,
  type TaggedPost,
} from "./index.js";

const sample: Taxonomy = {
  tags: [
    {
      id: "microsoft",
      label: "Microsoft",
      children: [
        {
          id: "microsoft/feedback-hub",
          label: "Feedback Hub",
          description: "Feedback Hub filings",
        },
      ],
    },
    { id: "apis", label: "APIs" },
  ],
};

test("resolveTaxonomy builds tree and map", () => {
  const { roots, byId } = resolveTaxonomy(sample);
  assert.equal(roots.length, 2);
  assert.equal(byId.get("microsoft/feedback-hub")?.parentId, "microsoft");
  assert.equal(byId.get("microsoft/feedback-hub")?.depth, 1);
});

test("duplicate ids throw", () => {
  assert.throws(
    () =>
      resolveTaxonomy({
        tags: [
          { id: "a", label: "A", children: [{ id: "a", label: "Dup" }] },
        ],
      }),
    TaxonomyError,
  );
});

test("buildTagIndex validates and includes descendants", () => {
  const posts: TaggedPost[] = [
    {
      id: "p1",
      title: "API ask",
      href: "/blog/p1",
      tags: ["microsoft/feedback-hub", "apis"],
    },
  ];
  const index = buildTagIndex(sample, posts);
  assert.equal(index.postsByTag.get("microsoft/feedback-hub")?.length, 1);
  assert.equal(index.postsByTag.get("microsoft")?.length, 1);
  assert.equal(index.postsByTag.get("apis")?.length, 1);
  assert.throws(
    () =>
      buildTagIndex(sample, [
        { id: "x", title: "x", href: "/x", tags: ["nope"] },
      ]),
    TaxonomyError,
  );
});

test("slug helpers", () => {
  assert.equal(tagIdToHref("microsoft/feedback-hub"), "/tags/microsoft/feedback-hub");
});

test("descendants and breadcrumb", () => {
  const { byId } = resolveTaxonomy(sample);
  assert.deepEqual(getDescendantIds(byId, "microsoft"), [
    "microsoft/feedback-hub",
  ]);
  assert.deepEqual(
    getTagBreadcrumb(byId, "microsoft/feedback-hub").map((t) => t.id),
    ["microsoft", "microsoft/feedback-hub"],
  );
});

test("loadTaxonomyFromString", () => {
  const t = loadTaxonomyFromString(JSON.stringify(sample));
  assert.equal(t.tags.length, 2);
});
