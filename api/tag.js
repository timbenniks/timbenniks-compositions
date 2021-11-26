import * as url from "url";
import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const tag = params.get("tag") || "";

  const client = getClient();

  let entries = [];

  if (tag !== "") {
    entries = await client.getEntries({
      "metadata.tags.sys.id[all]": tag,
      order: "-sys.createdAt",
    });
  } else {
    entries = await client.getEntries({
      "sys.contentType.sys.id[in]": "video,blog",
      order: "-sys.createdAt",
    });
  }

  const items = entries.items.map((item) => enhanceItemOutsideEnhancers(item));

  const tagData = await client.getTags();
  const tags = tagData.items.map((item) => {
    return item.sys.id;
  });

  res.end(JSON.stringify({ items, tags, tag }));
};
