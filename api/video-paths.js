import { getClient } from "../enhancers/contentful/client";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const client = getClient();
  const videos = await client.getEntries({
    content_type: "video",
    limit: 200,
  });

  const paths = videos.items.map((video) => {
    return `/videos/${video.fields.slug}`;
  });

  res.end(JSON.stringify({ paths }));
};
