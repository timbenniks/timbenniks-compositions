import * as url from "url";
import fetch from "isomorphic-unfetch";
import { RichText } from "prismic-dom";
import Prismic from "@prismicio/client";
import linkResolver from "../enhancers/prismic/linkresolver";
import htmlSerializer from "../enhancers/prismic/htmlserializer";
import { getClient } from "../enhancers/contentful/client";
import { enhanceItemOutsideEnhancers } from "../enhancers/helpers";
import {
  EnhancerBuilder,
  CanvasClient,
  CANVAS_DRAFT_STATE,
  enhance,
} from "@uniformdev/canvas";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const slug = params.get("slug") || "/";
  const skipEnhance = Boolean(params.get("skipEnhance")) || false;
  const state = Number(params.get("state")) || CANVAS_DRAFT_STATE;

  const client = new CanvasClient({
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_API_HOST,
    projectId: process.env.UNIFORM_PROJECT_ID,
    fetch,
  });

  const { composition } = await client.getCompositionBySlug({
    slug: "/blog",
    skipEnhance,
    state,
  });

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

  const relatedWriting = writingForTagsData.items
    .map((item) => enhanceItemOutsideEnhancers(item))
    .map((item) => {
      // remove content due to excessive size
      item.content = null;
      delete item.content;
      return {
        item,
      };
    });

  writing.content = prismicContent;

  const enhancers = new EnhancerBuilder()
    .data("selectedTags", () => {
      return selectedTags;
    })
    .component("blogPage", (blogPage) =>
      blogPage.data("metadata", () => {
        return {
          type: "blog",
          title: writing.title,
          description: writing.description,
          image: writing.poster.src,
          publicationDate: writing.publicationDate,
          canonical: `https://timbenniks.dev/writings/${slug}`,
          structuredData: {
            "@context": "http://schema.org",
            "@type": "BlogPosting",
            headline: writing.title,
            image: writing.poster.src,
            url: `https://timbenniks.dev/writings/${slug}`,
            datePublished: writing.publicationDate,
            dateCreated: writing.publicationDate,
            dateModified: writing.publicationDate,
            description: writing.description,
            publisher: {
              "@type": "Organization",
              name: "Tim Benniks",
              logo: {
                "@type": "ImageObject",
                url: writing.poster.src,
              },
            },
            author: { "@type": "Person", name: "Tim Benniks" },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://google.com/article",
            },
          },
        };
      })
    )
    .component("blogHero", (blogHero) =>
      blogHero.data("hero", () => {
        return {
          title: writing.title,
          poster: writing.poster,
          subTitle: writing.subTitle,
          tags: writing.tags,
        };
      })
    )
    .component("blogBody", (blogBody) =>
      blogBody.data("body", () => {
        return {
          content: writing.content,
        };
      })
    )
    .component("blogRelatedBlogs", (blogRelatedBlogs) =>
      blogRelatedBlogs.data("relatedBlo", () => {
        return relatedWriting;
      })
    );

  await enhance({
    composition,
    enhancers,
  });

  res.end(JSON.stringify({ composition }));
};
