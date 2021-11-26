import {
  asDay,
  asMonth,
  asYear,
  isDateBeforeToday,
  enhanceItemOutsideEnhancers,
} from "../helpers";
import { getClient } from "./client";

export const listEnhancer = async (parameter) => {
  const client = getClient();
  const type = parameter.component.parameters?.type?.value || "video"; // or blog, talk
  const tag = parameter.component.parameters?.activeTag?.value || false;

  const queryOptions = {
    skip: parameter.component.parameters?.withoutLatest?.value ? 1 : 0,
    limit: Number(parameter.component.parameters?.amount?.value) || 4,
    order: type === "talk" ? "-fields.date" : "-fields.publicationDate",
    content_type: type,
  };

  if (tag) {
    queryOptions["metadata.tags.sys.id[all]"] = tag;
  }

  const entries = await client.getEntries(queryOptions);
  let items = [];

  if (type === "talk") {
    items = entries.items.map((talk) => {
      return {
        slug: talk.fields.slug,
        date: {
          day: asDay(talk.fields.date),
          month: asMonth(talk.fields.date),
          year: asYear(talk.fields.date),
          upcoming: !isDateBeforeToday(new Date(talk.fields.date)),
        },
        conference: talk.fields.conference,
        talk: talk.fields.talk,
        location: talk.fields.location,
        link: talk.fields.link,
      };
    });
  } else {
    items = entries.items.map((item) => enhanceItemOutsideEnhancers(item));
  }

  const tagData = await client.getTags();
  const tags = tagData.items.map((item) => {
    return item.sys.id;
  });

  return {
    tags,
    items,
    tag,
  };
};
