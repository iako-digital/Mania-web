import { defineType, defineField } from "sanity";

export const localeText = defineType({
  name: "localeText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({ name: "ka", title: "ქართული", type: "text", rows: 5 }),
    defineField({ name: "en", title: "English", type: "text", rows: 5 }),
  ],
  preview: {
    select: { title: "ka" },
  },
});
