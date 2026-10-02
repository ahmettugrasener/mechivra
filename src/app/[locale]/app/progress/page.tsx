import { useTranslations } from "next-intl";

export default function ProgressPage() {
  const t =
    useTranslations("Progress");

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