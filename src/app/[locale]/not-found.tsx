import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t =
    useTranslations("NotFound");

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-sm font-medium text-brand">
        {t("code")}
      </p>

      <h1 className="mt-3 text-4xl font-semibold">
        {t("title")}
      </h1>

      <p className="mt-4 text-muted-strong">
        {t("description")}
      </p>

      <Link
        href="/"
        className="mt-8 inline-block font-medium text-brand hover:underline"
      >
        {t("returnHome")}
      </Link>
    </main>
  );
}