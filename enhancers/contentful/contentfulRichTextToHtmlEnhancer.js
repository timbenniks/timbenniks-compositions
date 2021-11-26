import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";

export const contentfulRichTextToHtmlEnhancer = ({ parameter }) => {
  if (typeof parameter.value?.fields !== "object") {
    return parameter.value;
  }

  Object.entries(parameter.value?.fields ?? {}).forEach(([key, value]) => {
    if (
      typeof value === "object" &&
      "nodeType" in value &&
      value.nodeType === "document"
    ) {
      parameter.value.fields[key] = documentToHtmlString(value, {
        renderNode: {
          [BLOCKS.LIST_ITEM]: (node, next) =>
            `<li>${next(node.content).replace(/<[^>]*>/g, "")}</li>`,

          // [INLINES.HYPERLINK]: (node, next) => {
          //   const url = node.data.uri

          //   if (url.includes('youtube.com')) {
          //     return `
          //       <div class="relative video-embed" style="padding-bottom: 56.25%">
          //         <iframe
          //           src=${url.replace('watch?v=', 'embed/')}
          //           frameBorder="0"
          //           width="100%"
          //           height="100%"
          //           allowFullScreen
          //           class="absolute top-0 left-0 w-full h-full"
          //         />
          //       </div>
          //     `
          //   } else {
          //     return `
          //       <a href="${url}" rel="noopener" rel="noreferrer">
          //         ${next(node.content)}
          //       </a>
          //     `
          //   }
          // },
        },
        renderMark: {
          [MARKS.CODE]: (text) => {
            const breaks = (text.match(/\n/g) || []).length;
            if (breaks > 0) {
              return `<pre><code>${text}</code></pre>`;
            } else {
              return `<code>${text}</code>`;
            }
          },
        },
      });
    }
  });

  return parameter.value;
};
