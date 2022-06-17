export const CANVAS_CLOUDINARY_PARAMETER_TYPES = "cloudinary-media-selector";

function createSrcSet(
  baseUrl,
  version,
  baseOptions,
  widths,
  ratio,
  transformation
) {
  const result = [];

  widths.split(",").forEach((width) => {
    let transforms = `${
      transformation ? transformation : baseOptions
    },w_${width}`;

    if (ratio) {
      transforms = `${
        transformation ? transformation : baseOptions
      },ar_${ratio},c_fill,w_${width}`;
    }

    const url = baseUrl.replace(`v${version}`, transforms);

    result.push(`${url} ${width}w`);
  });

  return result.join(",");
}

export const cloudinaryEnhancer = ({ parameter }) => {
  const result = parameter.value.map((media) => {
    return {
      width: media.width,
      height: media.height,
      rawurl: media.url,
      baseurl: media.url.replace(`v${media.version}`, media.options || ""),
      transdormedurl: media.transformation
        ? media.url.replace(`v${media.version}`, media.transformation)
        : null,
      alt: media.alt,
      caption: media.caption,
      srcset: media.widths
        ? createSrcSet(
            media.url,
            media.version,
            media.options,
            media.widths,
            media.ratio || false,
            media.transformation || false
          )
        : null,
    };
  });

  parameter.value = result;

  return parameter.value;
};
