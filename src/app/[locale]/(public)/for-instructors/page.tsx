import { useTranslations } from "next-intl";

import { SimplePublicPage } from "@/components/simple-public-page";

export default function ForInstructorsPage() {
  const t =
    useTranslations("InfoPages");

  return (
    <SimplePublicPage
      title={t(
        "forInstructorsTitle",
      )}
      description={t(
        "forInstructorsDescription",
      )}
    />
  );
}