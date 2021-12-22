import {
  createContentfulQueryEnhancer,
  ContentfulClientList,
} from "@uniformdev/canvas-contentful";
import { createClient } from "contentful";

export const contentfulQueryEnhancer = () => {
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

  const clientList = new ContentfulClientList({ client, previewClient });

  return createContentfulQueryEnhancer({
    clients: clientList,
    createQuery: ({ defaultQuery }) => {
      return {
        ...defaultQuery,
        select: "fields,metadata.tags",
      };
    },
  });
};
