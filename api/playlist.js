import * as url from "url";
import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";

module.exports = async (req, res) => {
  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const playlist = params.get("playlist") || "";

  const client = getClient();

  let entries = [];
  let videos = [];

  if (playlist !== "") {
    entries = await client.getEntries({
      "fields.slug[match]": playlist,
      content_type: "playlist",
    });
  } else {
    entries = await client.getEntries({
      content_type: "playlist",
    });
  }
  const items = entries.items.map((item) => enhanceItemOutsideEnhancers(item));

  if (playlist) {
    videos = items[0].videos.map((video) => {
      return enhanceItemOutsideEnhancers({ fields: video });
    });
  }

  res.end(JSON.stringify({ items, videos }));
};
