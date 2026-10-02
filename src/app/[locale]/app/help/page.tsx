import { useTranslations } from "next-intl";

export default function HelpPage() {
  const t =
    useTranslations("Help");

  return (
    <div>
      <h1 className="text-3xl font-semibold">
        {t("title")}
      </h1>

      <p className="mt-3">
        {t("description")}
      </p>
    </div>
  );
}