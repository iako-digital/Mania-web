import { defineType, defineField } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "label",
      title: "Skill",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      initialValue: 0,
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
    select: { title: "label.en", subtitle: "label.ka" },
  },
});
