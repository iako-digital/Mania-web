"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { StudioLogo } from "./sanity/components/StudioLogo";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  title: "Mania Vashakidze — Studio",
  schema: {
    types: schemaTypes,
  },
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  plugins: [
    structureTool({ structure }),
    // Only expose the GROQ playground in development
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
});
