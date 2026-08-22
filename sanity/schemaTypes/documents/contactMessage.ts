import { defineType, defineField } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

export const contactMessage = defineType({
  name: "contactMessage",
  title: "Message",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Message", type: "text", rows: 6, readOnly: true }),
    defineField({
      name: "receivedAt",
      title: "Received",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "handled",
      title: "Handled",
      description: "Mark once you've replied to this inquiry.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "receivedDesc",
      by: [{ field: "receivedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "email", handled: "handled" },
    prepare: ({ title, subtitle, handled }) => ({
      title,
      subtitle: `${subtitle}${handled ? " · Handled" : ""}`,
    }),
  },
});
