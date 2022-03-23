export const CANVAS_CLOUDINARY_PARAMETER_TYPES = "cloudinary-parameter";

export const cloudinaryEnhancer = ({ parameter }) => {
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
};
