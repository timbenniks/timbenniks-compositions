import {
  createBigCommerceClient,
  createBigCommerceEnhancer,
} from "@uniformdev/canvas-bigcommerce";

export const bigCommerceClient = createBigCommerceClient({
  storeHash: process.env.BIGCOMMERCE_STORE_HASH,
  token: process.env.BIGCOMMERCE_API_TOKEN,
});

export const bigCommerceEnhancer = () =>
  createBigCommerceEnhancer({
    client: bigCommerceClient,
    createProductOptions: () => {
      return {
        include_fields: ["id", "name", "price", "description"],
      };
    },
    createProductQueryOptions: () => {
      return {
        include_fields: ["id", "name", "price", "description"],
      };
    },
  });
