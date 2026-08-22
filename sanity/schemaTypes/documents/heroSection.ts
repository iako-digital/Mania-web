import { defineType, defineField } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "localeText",
    }),
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Video loop", value: "video" },
          { title: "Photo", value: "image" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "video",
      title: "Hero video",
      description:
        "Pre-compress before upload: H.264 MP4, web-optimized, seamless loop, no audio needed.",
      type: "file",
      options: { accept: "video/mp4" },
      hidden: ({ document }) => document?.mediaType !== "video",
    }),
    defineField({
      name: "image",
      title: "Hero photo",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType !== "image",
    }),
    defineField({
      name: "posterImage",
      title: "Video poster frame",
      description: "Shown while the video loads, and as its fallback on mobile data-saver mode.",
      type: "image",
      options: { hotspot: true },
      hidden: ({ document }) => document?.mediaType !== "video",
    }),
  ],
  preview: {
    select: { title: "headline.en", media: "image" },
    prepare: ({ title, media }) => ({
      title: title || "Hero Section",
      subtitle: "Singleton",
      media,
    }),
  },
});
