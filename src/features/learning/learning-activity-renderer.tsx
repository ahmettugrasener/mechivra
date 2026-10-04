import {
  getMvpCatalogItems,
} from "@/content/registry";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  SupportedLocale,
  VersionString,
} from "@/domain/shared/types";

import {
  getLearningActivityRendererKind,
} from "@/features/learning/activity-renderer-kind";

import {
  ActivityProgressBoundary,
} from "@/features/learning/progress/activity-progress-boundary";

import {
  DesignActivityRenderer,
} from "@/features/learning/renderers/design-activity-renderer";

import {
  InteractiveActivityRenderer,
} from "@/features/learning/renderers/interactive-activity-renderer";

import {
  NarrativeActivityRenderer,
} from "@/features/learning/renderers/narrative-activity-renderer";

import {
  ResponseActivityRenderer,
} from "@/features/learning/renderers/response-activity-renderer";

interface LearningActivityRendererProps {
  readonly activity:
    LearningActivity;

  readonly locale:
    SupportedLocale;

  /*
   * Optional explicit dependency for isolated rendering,
   * tests, previews, and future non-registry hosts.
   *
   * Normal application rendering does not need to supply it:
   * registered MVP activities resolve their real module
   * version from the content registry.
   */
  readonly moduleVersion?:
    VersionString;
}

function resolveModuleVersion(
  activity:
    LearningActivity,

  explicitModuleVersion:
    VersionString | undefined,
): VersionString {
  if (
    explicitModuleVersion
  ) {
    return explicitModuleVersion;
  }

  const catalogItem =
    getMvpCatalogItems().find(
      (
        item,
      ) =>
        item.module.id ===
        activity.moduleId,
    );

  if (
    catalogItem
  ) {
    return catalogItem
      .module
      .version;
  }

  /*
   * Registry-independent rendering is valid for isolated
   * unit tests, previews, and draft activity hosts.
   *
   * In that standalone case there is no independently
   * registered module version available, so the activity's
   * own version is used as the local persistence namespace.
   *
   * Production MVP activities still take the branch above
   * and therefore use the canonical registry module version.
   */
  return activity.version;
}

export function LearningActivityRenderer({
  activity,
  locale,
  moduleVersion:
    explicitModuleVersion,
}: LearningActivityRendererProps) {
  const rendererKind =
    getLearningActivityRendererKind(
      activity.type,
    );

  const moduleVersion =
    resolveModuleVersion(
      activity,
      explicitModuleVersion,
    );

  switch (
    rendererKind
  ) {
    case "narrative":
      return (
        <ActivityProgressBoundary
          activity={
            activity
          }
          moduleVersion={
            moduleVersion
          }
        >
          <NarrativeActivityRenderer
            activity={
              activity
            }
            locale={
              locale
            }
          />
        </ActivityProgressBoundary>
      );

    case "response":
      return (
        <ActivityProgressBoundary
          activity={
            activity
          }
          moduleVersion={
            moduleVersion
          }
        >
          <ResponseActivityRenderer
            activity={
              activity
            }
            locale={
              locale
            }
          />
        </ActivityProgressBoundary>
      );

    case "interactive":
      return (
        <ActivityProgressBoundary
          activity={
            activity
          }
          moduleVersion={
            moduleVersion
          }
        >
          <InteractiveActivityRenderer
            activity={
              activity
            }
            locale={
              locale
            }
          />
        </ActivityProgressBoundary>
      );

    case "design":
      return (
        <ActivityProgressBoundary
          activity={
            activity
          }
          moduleVersion={
            moduleVersion
          }
        >
          <DesignActivityRenderer
            activity={
              activity
            }
            locale={
              locale
            }
          />
        </ActivityProgressBoundary>
      );

    default:
      return assertNever(
        rendererKind,
      );
  }
}

function assertNever(
  value:
    never,
): never {
  throw new Error(
    `Unsupported learning activity renderer kind: ${String(
      value,
    )}`,
  );
}