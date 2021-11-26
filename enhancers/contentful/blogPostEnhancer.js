import { enhanceItemOutsideEnhancers } from "../helpers";
import { getClient } from "./client";

export const blogPostEnhancer = async (parameter) => {
  const client = getClient();
  const amount = parameter.component.parameters?.amount?.value || 4;
  const entries = await client.getEntries({
    skip: 0,
    limit: amount,
    order: "-fields.publicationDate",
    content_type: "blog",
  });

  const blogPosts = entries.items.map((item) =>
    enhanceItemOutsideEnhancers(item)
  );

  return blogPosts;
};
