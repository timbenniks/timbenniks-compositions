import { contentfulModelConverter } from "./contentful/contentfulModelConverter";
import { contentfulRichTextToHtmlEnhancer } from "./contentful/contentfulRichTextToHtmlEnhancer";

export function asDay(date) {
  const day = new Date(date).getDate().toString();
  return day.padStart(2, "0");
}

export function asMonth(date) {
  return new Date(date).toLocaleString("en-us", { month: "short" }).toString();
}

export function asYear(date) {
  return new Date(date).getFullYear().toString();
}

export function isDateBeforeToday(date) {
  return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

export function enhanceItemOutsideEnhancers(item) {
  const entryWithRichText = contentfulRichTextToHtmlEnhancer({
    parameter: { value: item },
  });

  const entry = contentfulModelConverter({
    parameter: { value: entryWithRichText },
  });

  return entry;
}
