import type { ComponentType } from "react";
import type { StructureResolver } from "sanity/structure";
import { PlayIcon } from "@sanity/icons/Play";
import { ImagesIcon } from "@sanity/icons/Images";
import { TagIcon } from "@sanity/icons/Tag";
import { SyncIcon } from "@sanity/icons/Sync";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { UserIcon } from "@sanity/icons/User";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { CogIcon } from "@sanity/icons/Cog";

const singleton = (
  S: Parameters<StructureResolver>[0],
  typeName: string,
  title: string,
  icon?: ComponentType,
) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Mania Vashakidze — Content")
    .items([
      singleton(S, "heroSection", "Hero Section", PlayIcon),
      S.divider(),
      S.listItem()
        .title("Portfolio")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Portfolio")
            .items([
              S.listItem()
                .title("Projects")
                .icon(ImagesIcon)
                .child(
                  S.documentTypeList("portfolioItem")
                    .title("Projects")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Categories")
                .icon(TagIcon)
                .child(
                  S.documentTypeList("category")
                    .title("Categories")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),
      S.listItem()
        .title("Expertise")
        .icon(SyncIcon)
        .child(
          S.list()
            .title("Expertise")
            .items([
              S.listItem()
                .title("Workflow Steps")
                .icon(SyncIcon)
                .child(
                  S.documentTypeList("workflowStep")
                    .title("Workflow Steps")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
              S.listItem()
                .title("Skills")
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentTypeList("skill")
                    .title("Skills")
                    .defaultOrdering([{ field: "order", direction: "asc" }]),
                ),
            ]),
        ),
      singleton(S, "aboutPage", "About Page", UserIcon),
      S.divider(),
      S.listItem()
        .title("Messages")
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList("contactMessage")
            .title("Messages")
            .defaultOrdering([{ field: "receivedAt", direction: "desc" }]),
        ),
      S.divider(),
      singleton(S, "siteSettings", "Site Settings", CogIcon),
    ]);
