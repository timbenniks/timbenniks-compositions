import Prismic from "@prismicio/client";
import {
  PrismicClientList,
  createPrismicEnhancer,
} from "@uniformdev/canvas-prismic";

export const prismicEnhancer = () => {
  if (!process.env.PRISMIC_REPOSITORY_ID) {
    throw new Error("PRISMIC_REPOSITORY_ID env not set.");
  }

  const prismicApiUrl = `https://${process.env.PRISMIC_REPOSITORY_ID}.cdn.prismic.io/api/v2`;
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

  const client = Prismic.client(prismicApiUrl, {
    accessToken,
  });

  return createPrismicEnhancer({
    clients: new PrismicClientList([{ source: "default", client }]),
    useBatching: true,
  });
};
