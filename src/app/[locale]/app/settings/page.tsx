import {
  useLocale,
  useTranslations,
} from "next-intl";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  ProgressDataSettings,
} from "@/features/learning/progress";

export default function SettingsPage() {
  const t =
    useTranslations(
      "Settings",
    );

  const locale =
    useLocale() as
      SupportedLocale;

  return (
    <div>
      <h1 className="text-3xl font-semibold">
        {
          t(
            "title",
          )
        }
      </h1>

      <p className="mt-3 max-w-3xl leading-7 text-muted-strong">
        {
          t(
            "description",
          )
        }
      </p>

      <ProgressDataSettings
        locale={
          locale
        }
      />
    </div>
  );
}