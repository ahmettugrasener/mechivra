import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { ContentBlockRenderer } from "@/features/learning/content-block-renderer";

interface DesignActivityRendererProps {
  readonly activity:
    LearningActivity;

  readonly locale:
    SupportedLocale;
}

export function DesignActivityRenderer({
  activity,
  locale,
}: DesignActivityRendererProps) {
  return (
    <section
      data-activity-renderer="design"
      data-activity-type={
        activity.type
      }
    >
      <ContentBlockRenderer
        blocks={
          activity.contentBlocks
        }
        locale={
          locale
        }
      />
    </section>
  );
}