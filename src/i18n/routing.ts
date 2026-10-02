import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "en",

  localePrefix: "always",

  localeDetection: false,

  localeCookie: false,
});