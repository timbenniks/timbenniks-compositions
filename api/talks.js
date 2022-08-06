import * as url from "url";

import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const limit = params.get("limit") || "";

  const client = getClient();

  let entries = [];

  entries = await client.getEntries({
    content_type: "talk",
    order: "-fields.date",
    limit: limit ? limit : 100,
  });

  const items = entries.items.map((item) => enhanceItemOutsideEnhancers(item));

  res.end(JSON.stringify({ items }));
};
