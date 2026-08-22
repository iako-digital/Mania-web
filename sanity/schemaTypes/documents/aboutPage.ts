import { defineType, defineField } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: UserIcon,
  groups: [
    { name: "content", title: "Narrative", default: true },
    { name: "media", title: "Portrait" },
  ],
  fields: [
    defineField({
      name: "portrait",
      title: "Professional portrait",
      type: "image",
      group: "media",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Bio / Introduction",
      description: "The core introduction narrative — also used, condensed, on the Home page.",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "careerNarrative",
      title: "Career narrative",
      description: "Mania fashion house, shows and collections, prior roles.",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "achievementsNarrative",
      title: "Achievements narrative",
      description: "Includes the Gerber AccuMark at 55 story.",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "programs",
      title: "Software & programs",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
      initialValue: ["Gerber AccuMark"],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page", subtitle: "Singleton" }),
  },
});
