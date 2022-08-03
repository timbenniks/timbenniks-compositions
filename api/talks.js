import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const client = getClient();

  let entries = [];

  entries = await client.getEntries({
    content_type: "talk",
    order: "-fields.date",
  });

  const items = entries.items.map((item) => enhanceItemOutsideEnhancers(item));

  res.end(JSON.stringify({ items }));
};
