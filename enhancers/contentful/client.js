import { createClient } from "contentful";

export const getClient = () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT,
    accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN,
  });

  return client;
};
