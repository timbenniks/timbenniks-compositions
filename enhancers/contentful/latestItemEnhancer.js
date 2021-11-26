import { enhanceItemOutsideEnhancers } from "../helpers";
import { getClient } from "./client";

export const latestItemEnhancer = async (parameter) => {
  const client = getClient();
  const type = parameter.component.parameters?.type?.value || "video";
  const entries = await client.getEntries({
    skip: 0,
    limit: 1,
    order: "-fields.publicationDate",
    content_type: type,
  });

  return enhanceItemOutsideEnhancers(entries.items[0]);
};
