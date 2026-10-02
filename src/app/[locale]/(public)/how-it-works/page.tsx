import { useTranslations } from "next-intl";

import { SimplePublicPage } from "@/components/simple-public-page";

export default function HowItWorksPage() {
  const t =
    useTranslations("InfoPages");

  return (
    <SimplePublicPage
      title={t(
        "howItWorksTitle",
      )}
      description={t(
        "howItWorksDescription",
      )}
    />
  );
}