import { useTranslations } from "next-intl";

import { SimplePublicPage } from "@/components/simple-public-page";

export default function SupportPage() {
  const t =
    useTranslations("InfoPages");

  return (
    <SimplePublicPage
      title={t(
        "supportTitle",
      )}
      description={t(
        "supportDescription",
      )}
    />
  );
}