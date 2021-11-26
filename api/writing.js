import * as url from "url";
import { RichText } from "prismic-dom";
import Prismic from "@prismicio/client";
import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";
import linkResolver from "../enhancers/prismic/linkresolver";
import htmlSerializer from "../enhancers/prismic/htmlserializer";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const slug = params.get("slug") || "/";

  const ctfClient = getClient();
  const prismicClient = await Prismic.getApi(
    `https://${process.env.PRISMIC_REPOSITORY_ID}.prismic.io/api/v2`,
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  );

  const writingItems = await ctfClient.getEntries({
    content_type: "blog",
    "fields.slug[match]": slug,
  });

  const writing = enhanceItemOutsideEnhancers(writingItems.items[0]);
  const selectedTags = writing.tags.join(",");

  const prismicWriting = await prismicClient.getByUID("writing", slug);
  const prismicContent = RichText.asHtml(
    prismicWriting.data.content,
    linkResolver,
    htmlSerializer
  );

  const writingForTagsData = await ctfClient.getEntries({
    content_type: "blog",
    "metadata.tags.sys.id[all]": writing.tags[0],
    "sys.id[nin]": writingItems.items[0].sys.id,
    limit: 3,
  });

  const relatedWriting = writingForTagsData.items.map((item) =>
    enhanceItemOutsideEnhancers(item)
  );

  writing.content = prismicContent;

  res.end(JSON.stringify({ writing, selectedTags, relatedWriting }));
};
