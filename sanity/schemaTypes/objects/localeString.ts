import { defineType, defineField } from "sanity";

export const localeString = defineType({
  name: "localeString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({ name: "ka", title: "ქართული", type: "string" }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
  preview: {
    select: { title: "ka" },
  },
});
