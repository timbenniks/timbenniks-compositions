import * as url from "url";
import fetch from "isomorphic-unfetch";
import { CanvasClient, CANVAS_DRAFT_STATE, enhance } from "@uniformdev/canvas";
import { enhancers } from "../enhancers";

module.exports = async (req, res) => {
  const client = new CanvasClient({
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_API_HOST,
    projectId: process.env.UNIFORM_PROJECT_ID,
    fetch,
  });

  const dev = process.env.NODE_ENV === "development";
  const link = `${dev ? "http://" : "https://"}${req.headers.host}${req.url}`;
  const parsedLink = new url.URL(link);
  const params = parsedLink.searchParams;
  const slug = params.get("slug") || "/";
  const skipEnhance = Boolean(params.get("skipEnhance")) || false;
  const state = Number(params.get("state")) || CANVAS_DRAFT_STATE;

  const canvasResult = await client.getCompositionBySlug({
    slug,
    skipEnhance,
    state,
  });

  const context = {
    preview: false,
  };

  await enhance({
    composition: canvasResult.composition,
    enhancers,
    context,
  });

  res.end(JSON.stringify(canvasResult));
};
