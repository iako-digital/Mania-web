import { defineType, defineField } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

export const portfolioItem = defineType({
  name: "portfolioItem",
  title: "Portfolio Project",
  type: "document",
  icon: ImagesIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Details" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: { source: "title.en" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
      group: "content",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "video",
      title: "Video clip (optional)",
      description:
        "Pre-compress before upload: H.264 MP4, web-optimized, short loop.",
      type: "file",
      group: "media",
      options: { accept: "video/mp4" },
    }),
    defineField({
      name: "featured",
      title: "Featured on Home",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      group: "meta",
      initialValue: 0,
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "meta",
    }),
    defineField({
      name: "occasion",
      title: "Occasion / Client",
      description: "e.g. \"Wedding commission\", \"Runway collection\"",
      type: "localeString",
      group: "meta",
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "category.title.en",
      media: "coverImage",
    },
  },
});
