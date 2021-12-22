import { contentfulQueryModelConverter } from "./contentful/contentfulQueryModelConverter";
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
  const entry = contentfulQueryModelConverter({
    parameter: { value: item },
  });

  return entry;
}
