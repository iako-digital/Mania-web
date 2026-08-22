import { defineType, defineField } from "sanity";
import { SyncIcon } from "@sanity/icons/Sync";

export const workflowStep = defineType({
  name: "workflowStep",
  title: "Workflow Step",
  type: "document",
  icon: SyncIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localeText",
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
    select: { title: "title.en", subtitle: "title.ka" },
  },
});
