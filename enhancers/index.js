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
import { contentfulQueryModelConverter } from "./contentful/contentfulQueryModelConverter";
import { prismicEnhancer } from "./prismic/prismicEnhancer";

export const enhancers = new EnhancerBuilder()
  .parameterType(CANVAS_BIGCOMMERCE_PARAMETER_TYPES, bigCommerceEnhancer())
  .parameterType(CANVAS_PRISMIC_PARAMETER_TYPES, prismicEnhancer())
  .parameterType(
    CANVAS_CONTENTFUL_QUERY_PARAMETER_TYPES,
    compose(contentfulQueryEnhancer(), contentfulQueryModelConverter)
  )
  .parameterType(
    CANVAS_CONTENTFUL_PARAMETER_TYPES,
    compose(contentfulEnhancer(), contentfulQueryModelConverter)
  )
  .parameterType("cloudinary-parameter", ({ parameter }) => {
    const result = parameter.value.map((media) => {
      const transformation =
        media.transformation !== "" ? media.transformation : media.options;

      return {
        width: media.width,
        height: media.height,
        url: media.url.replace(`v${media.version}`, transformation),
        alt: media.alt,
      };
    });

    parameter.value = result;

    return parameter.value;
  });
