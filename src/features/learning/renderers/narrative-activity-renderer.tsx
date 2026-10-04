import {
  getBendingActivityContentBlocks,
} from "@/content/bending-content";

import {
  getOttoActivityContentBlocks,
} from "@/content/otto-content";

import {
  getWorkedExampleDefinition,
} from "@/content/worked-examples";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BendingConceptVisualizationPanel } from "@/features/learning/bending/bending-concept-visualization-panel";

import { BendingSummaryPanel } from "@/features/learning/bending/bending-summary-panel";

import { BendingWorkedExample } from "@/features/learning/bending/bending-worked-example";

import { ContentBlockRenderer } from "@/features/learning/content-block-renderer";

import { OttoConceptVisualizationPanel } from "@/features/learning/otto/otto-concept-visualization-panel";

import { OttoContentBlockRenderer } from "@/features/learning/otto/otto-content-block-renderer";

import { OttoSummaryPanel } from "@/features/learning/otto/otto-summary-panel";

import { OttoWorkedExample } from "@/features/learning/otto/otto-worked-example";

import { StaticsSummaryPanel } from "@/features/learning/statics/statics-summary-panel";

import { WorkedExampleHost } from "@/features/learning/worked-example-host";

interface NarrativeActivityRendererProps {
  readonly activity:
    LearningActivity;

  readonly locale:
    SupportedLocale;
}

export function NarrativeActivityRenderer({
  activity,
  locale,
}: NarrativeActivityRendererProps) {
  const workedExample =
    getWorkedExampleDefinition(
      activity.id,
    );

  const bendingContentBlocks =
    getBendingActivityContentBlocks(
      activity.id,
    );

  const ottoContentBlocks =
    getOttoActivityContentBlocks(
      activity.id,
    );

  const isOttoActivity =
    ottoContentBlocks.length >
    0;

  const genericContentBlocks =
    bendingContentBlocks.length >
    0
      ? bendingContentBlocks
      : activity.contentBlocks;

  const isStaticsSummary =
    activity.id ===
    "activity-ssb-06";

  const isBendingConcept =
    activity.id ===
    "activity-bending-02";

  const isBendingSummary =
    activity.id ===
    "activity-bending-06";

  const isOttoConcept =
    activity.id ===
    "activity-otto-02";

  const isOttoSummary =
    activity.id ===
    "activity-otto-06";

  return (
    <section
      data-activity-renderer="narrative"
      data-activity-type={
        activity.type
      }
    >
      {isOttoActivity ? (
        <OttoContentBlockRenderer
          blocks={
            ottoContentBlocks
          }
          locale={
            locale
          }
        />
      ) : (
        <ContentBlockRenderer
          blocks={
            genericContentBlocks
          }
          locale={
            locale
          }
        />
      )}

      {isBendingConcept ? (
        <>
          <BendingConceptVisualizationPanel
            locale={
              locale
            }
          />

          <BendingWorkedExample
            locale={
              locale
            }
          />
        </>
      ) : null}

      {isOttoConcept ? (
        <>
          <OttoConceptVisualizationPanel
            locale={
              locale
            }
          />

          <OttoWorkedExample
            locale={
              locale
            }
          />
        </>
      ) : null}

      {workedExample ? (
        <WorkedExampleHost
          definition={
            workedExample
          }
          locale={
            locale
          }
        />
      ) : null}

      {isStaticsSummary ? (
        <StaticsSummaryPanel
          locale={
            locale
          }
        />
      ) : null}

      {isBendingSummary ? (
        <BendingSummaryPanel
          locale={
            locale
          }
        />
      ) : null}

      {isOttoSummary ? (
        <OttoSummaryPanel
          locale={
            locale
          }
        />
      ) : null}
    </section>
  );
}