import { isDateBeforeToday, asDay, asMonth, asYear } from "../helpers";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";

export const contentfulQueryModelConverter = ({ parameter }) => {
  const entries = parameter.value;
  let result = null;

  if (entries.fields) {
    result = transformContentfulFields(entries);
  } else {
    result = [];
    entries.forEach((entry) => {
      result.push(transformContentfulFields(entry));
    });
  }

  parameter.value = result;

  return parameter.value;
};

function transformContentfulFields(entry) {
  if (entry) {
    const content = { ...entry.fields };

    // eslint-disable-next-line
    Object.keys(content).map((fieldKey) => {
      if (
        Array.isArray(content[fieldKey]) &&
        content[fieldKey].length > 0 &&
        content[fieldKey][0]?.sys?.type === "Asset"
      ) {
        const transformedImages = content[fieldKey].map((asset) =>
          transformContentfulImage(asset)
        );
        content[fieldKey] = transformedImages;
      }

      // reference field
      else if (Array.isArray(content[fieldKey])) {
        const flattenedFields = content[fieldKey].map((entry) => {
          return { ...entry.fields };
        });
        content[fieldKey] = flattenedFields;
      }
      // contentful asset field transformation into a uniform model
      else if (content[fieldKey]?.sys?.type === "Asset") {
        content[fieldKey] = transformContentfulImage(content[fieldKey]);
      }
      // add date model
      else if (fieldKey === "publicationDate" || fieldKey === "date") {
        content.date = {
          day: asDay(content[fieldKey]),
          month: asMonth(content[fieldKey]),
          year: asYear(content[fieldKey]),
          date: content[fieldKey],
          upcoming: !isDateBeforeToday(new Date(content[fieldKey])),
        };
        // rich text
      } else if (content[fieldKey]?.nodeType === "document") {
        const html = documentToHtmlString(content[fieldKey], {
          renderNode: {
            [BLOCKS.LIST_ITEM]: (node, next) =>
              `<li>${next(node.content).replace(/<[^>]*>/g, "")}</li>`,
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
        content[fieldKey] = html;
      }
    });

    if (entry.metadata?.tags) {
      content.tags =
        entry.metadata?.tags.map((tag) => {
          return tag.sys.id;
        }) || [];
    }

    return content;
  }
}

function transformContentfulImage(imageField) {
  let imageUrl = imageField?.fields?.file?.url;
  if (imageUrl.startsWith("//")) {
    imageUrl = imageUrl.replace("//", "https://");
  }
  return {
    src: imageUrl,
    alt: imageField?.fields?.title,
    width: imageField?.fields?.file?.details?.image?.width,
    height: imageField?.fields?.file?.details?.image?.height,
    ratio: `${imageField?.fields?.file?.details?.image?.width}:${imageField?.fields?.file?.details?.image?.height}`,
  };
}
