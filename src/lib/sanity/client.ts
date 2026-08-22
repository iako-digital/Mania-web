import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, isSanityConfigured } from "../../../sanity/env";

const stubClient = {
  fetch: async () => null,
} as unknown as SanityClient;

export const client: SanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : stubClient;

export const writeClient: SanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
      perspective: "raw",
    })
  : stubClient;
