import { asDay, asMonth, asYear } from "../helpers";

export const contentfulModelConverter = ({ parameter }) => {
  const entry = parameter.value;

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
      else if (fieldKey === "publicationDate") {
        content.date = {
          day: asDay(content[fieldKey]),
          month: asMonth(content[fieldKey]),
          year: asYear(content[fieldKey]),
        };
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
  return parameter.value;
};

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
