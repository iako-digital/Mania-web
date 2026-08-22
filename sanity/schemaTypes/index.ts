import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { heroSection } from "./documents/heroSection";
import { portfolioItem } from "./documents/portfolioItem";
import { category } from "./documents/category";
import { skill } from "./documents/skill";
import { workflowStep } from "./documents/workflowStep";
import { aboutPage } from "./documents/aboutPage";
import { siteSettings } from "./documents/siteSettings";
import { contactMessage } from "./documents/contactMessage";

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  // documents
  heroSection,
  portfolioItem,
  category,
  skill,
  workflowStep,
  aboutPage,
  siteSettings,
  contactMessage,
];
