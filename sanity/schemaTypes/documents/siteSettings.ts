import { defineType, defineField } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "contact", title: "Contact", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      initialValue: "Mania Vashakidze",
      group: "contact",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localeString",
      group: "contact",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
      group: "contact",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "Default SEO title",
      type: "localeString",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO description",
      type: "localeText",
      group: "seo",
    }),
    defineField({
      name: "ogImage",
      title: "Default social share image",
      type: "image",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings", subtitle: "Singleton" }),
  },
});
