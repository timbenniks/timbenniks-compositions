import fetch from "isomorphic-unfetch";
import { CanvasClient, CANVAS_DRAFT_STATE } from "@uniformdev/canvas";

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const client = new CanvasClient({
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_API_HOST,
    projectId: process.env.UNIFORM_PROJECT_ID,
    fetch,
  });

  const pages = await client.getCompositionList({
    state: CANVAS_DRAFT_STATE,
  });

  const paths = pages.compositions
    .map((c) => c.composition._slug)
    .filter((slug) => slug);

  res.end(JSON.stringify({ paths }));
};
