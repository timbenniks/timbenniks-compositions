import * as url from "url";
import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const slug = params.get("slug") || "/";

  const client = getClient();

  const videoItems = await client.getEntries({
    content_type: "video",
    "fields.slug[match]": slug,
  });

  const video = enhanceItemOutsideEnhancers(videoItems.items[0]);
  const selectedTags = video.tags.join(",");

  const videosForTagsData = await client.getEntries({
    content_type: "video",
    "metadata.tags.sys.id[all]": video.tags[0],
    "sys.id[nin]": videoItems.items[0].sys.id,
    limit: 3,
  });

  const relatedVideos = videosForTagsData.items.map((item) =>
    enhanceItemOutsideEnhancers(item)
  );

  res.end(JSON.stringify({ video, selectedTags, relatedVideos }));
};
