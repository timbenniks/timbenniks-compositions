import { getClient } from "../enhancers/contentful/client";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const client = getClient();
  const writings = await client.getEntries({
    content_type: "blog",
    limit: 200,
  });

  const paths = writings.items.map((video) => {
    return `/writings/${video.fields.slug}`;
  });

  res.end(JSON.stringify({ paths }));
};
