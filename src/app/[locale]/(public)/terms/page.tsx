import { useTranslations } from "next-intl";

import { SimplePublicPage } from "@/components/simple-public-page";

export default function TermsPage() {
  const t =
    useTranslations("InfoPages");

  return (
    <SimplePublicPage
      title={t("termsTitle")}
      description={t(
        "termsDescription",
      )}
    />
  );
}