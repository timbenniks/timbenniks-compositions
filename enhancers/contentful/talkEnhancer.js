import { isDateBeforeToday, asDay, asMonth, asYear } from "../helpers";
import { getClient } from "./client";

export const talkEnhancer = async (parameter) => {
  const client = getClient();
  const entries = await client.getEntries({
    skip: 0,
    limit: parameter.component.parameters.amount.value || 4,
    order: "-fields.date",
    content_type: "talk",
  });

  const talks = entries.items.map((talk) => {
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

  return talks;
};
