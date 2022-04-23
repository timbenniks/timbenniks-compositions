import * as url from "url";
import fetch from "isomorphic-unfetch";

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
    slug: "/video",
    skipEnhance,
    state,
  });

  const ctfClient = getClient();

  const videoItems = await ctfClient.getEntries({
    content_type: "video",
    "fields.slug[match]": slug,
  });

  const video = enhanceItemOutsideEnhancers(videoItems.items[0]);
  const selectedTags = video.tags.join(",");

  const videosForTagsData = await ctfClient.getEntries({
    content_type: "video",
    "metadata.tags.sys.id[all]": video.tags[0],
    "sys.id[nin]": videoItems.items[0].sys.id,
    limit: 3,
  });

  const relatedVideos = videosForTagsData.items.map((item) =>
    enhanceItemOutsideEnhancers(item)
  );

  const enhancers = new EnhancerBuilder()
    .data("selectedTags", () => {
      return selectedTags;
    })
    .component("videopage", (videoPageVideo) =>
      videoPageVideo.data("metadata", () => {
        return {
          type: "video",
          title: video.title,
          description: video.description,
          image: video.poster.src,
          publicationDate: video.date.date,
          canonical: `https://timbenniks.dev/videos/${slug}`,
          structuredData: {
            "@context": "http://schema.org",
            "@type": "VideoObject",
            name: video.title,
            description: video.description,
            thumbnailUrl: [video.poster.src],
            embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
            contentUrl: `https://timbenniks.dev/videos/slug/${slug}`,
            uploadDate: video.date.date,
          },
        };
      })
    )
    .component("videoPageVideo", (videoPageVideo) =>
      videoPageVideo.data("video", () => {
        return video;
      })
    )
    .component("videoPageRelatedVideos", (videoPageRelatedVideos) =>
      videoPageRelatedVideos.data("relatedVideos", () => {
        return relatedVideos;
      })
    );

  await enhance({
    composition,
    enhancers,
  });

  res.end(JSON.stringify({ composition }));
};
