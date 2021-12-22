import { compose, EnhancerBuilder } from "@uniformdev/canvas";
import {
  CANVAS_CONTENTFUL_PARAMETER_TYPES,
  CANVAS_CONTENTFUL_QUERY_PARAMETER_TYPES,
} from "@uniformdev/canvas-contentful";
import { CANVAS_BIGCOMMERCE_PARAMETER_TYPES } from "@uniformdev/canvas-bigcommerce";
import { CANVAS_PRISMIC_PARAMETER_TYPES } from "@uniformdev/canvas-prismic";
import { bigCommerceEnhancer } from "./bigCommerce/bigCommerceEnhancer";
import { contentfulEnhancer } from "./contentful/contentfulEnhancer";
import { contentfulQueryEnhancer } from "./contentful/contentfulQueryEnhancer";
import { blogPostEnhancer } from "./contentful/blogPostEnhancer";
import { talkEnhancer } from "./contentful/talkEnhancer";
import { listEnhancer } from "./contentful/listEnhancer";
import { latestItemEnhancer } from "./contentful/latestItemEnhancer";
import { contentfulQueryModelConverter } from "./contentful/contentfulQueryModelConverter";
import { prismicEnhancer } from "./prismic/prismicEnhancer";

export const enhancers = new EnhancerBuilder()
  .component("latestBlogposts", (latestBlogposts) =>
    latestBlogposts.data("posts", blogPostEnhancer)
  )
  .component("latestTalks", (latestTalks) =>
    latestTalks.data("talks", talkEnhancer)
  )
  .component("latestThing", (latestThing) =>
    latestThing.data("item", latestItemEnhancer)
  )
  .component("list", (list) => list.data("list", listEnhancer))
  .parameterType(CANVAS_BIGCOMMERCE_PARAMETER_TYPES, bigCommerceEnhancer())
  .parameterType(CANVAS_PRISMIC_PARAMETER_TYPES, prismicEnhancer())

  .parameterType(
    CANVAS_CONTENTFUL_QUERY_PARAMETER_TYPES,
    compose(contentfulQueryEnhancer(), contentfulQueryModelConverter)
  )

  .parameterType(
    CANVAS_CONTENTFUL_PARAMETER_TYPES,
    compose(contentfulEnhancer(), contentfulQueryModelConverter)
  );
