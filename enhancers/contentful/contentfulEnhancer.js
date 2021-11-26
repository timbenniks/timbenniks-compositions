import { createContentfulEnhancer } from "@uniformdev/canvas-contentful";
import { createClient } from "contentful";

export const contentfulEnhancer = () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN,
  });

  const previewClient = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    accessToken: process.env.CONTENTFUL_CPA_ACCESS_TOKEN,
    host: "preview.contentful.com",
  });

  return createContentfulEnhancer({
    client,
    previewClient,
    useBatching: false,
    createQuery: ({ defaultQuery }) => {
      return {
        ...defaultQuery,
        select: "fields,metadata.tags",
        include: 1,
      };
    },
  });
};
