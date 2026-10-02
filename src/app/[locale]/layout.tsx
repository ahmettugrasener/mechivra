import type { Metadata } from "next";
import {
  hasLocale,
  NextIntlClientProvider,
} from "next-intl";
import {
  getMessages,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { routing } from "@/i18n/routing";

import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mechivra",
    template: "%s | Mechivra",
  },
  description:
    "Interactive Mechanical Engineering",
};

interface LocaleLayoutProps {
  readonly children: ReactNode;

  readonly params: Promise<{
    locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map(
    (locale) => ({
      locale,
    }),
  );
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } =
    await params;

  if (
    !hasLocale(
      routing.locales,
      locale,
    )
  ) {
    notFound();
  }

  setRequestLocale(locale);

  const messages =
    await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
    >
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}