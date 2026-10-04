import {
  getBendingActivityContentBlocks,
} from "@/content/bending-content";

import {
  getInteractiveDefinition,
} from "@/content/interactives";

import {
  getOttoActivityContentBlocks,
} from "@/content/otto-content";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BendingInteractiveExplorer } from "@/features/learning/bending/bending-interactive-explorer";

import { ContentBlockRenderer } from "@/features/learning/content-block-renderer";

import { InteractiveActivityHost } from "@/features/learning/interactive-activity-host";

import { OttoContentBlockRenderer } from "@/features/learning/otto/otto-content-block-renderer";

import { OttoInteractiveExplorer } from "@/features/learning/otto/otto-interactive-explorer";

interface InteractiveActivityRendererProps {
  readonly activity:
    LearningActivity;

  readonly locale:
    SupportedLocale;
}

export function InteractiveActivityRenderer({
  activity,
  locale,
}: InteractiveActivityRendererProps) {
  const interactiveDefinition =
    getInteractiveDefinition(
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

  const isBendingInteractive =
    activity.id ===
    "activity-bending-04";

  const isOttoInteractive =
    activity.id ===
    "activity-otto-04";

  return (
    <section
      data-activity-renderer="interactive"
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

      {isBendingInteractive ? (
        <BendingInteractiveExplorer
          locale={
            locale
          }
        />
      ) : isOttoInteractive ? (
        <OttoInteractiveExplorer
          locale={
            locale
          }
        />
      ) : interactiveDefinition ? (
        <InteractiveActivityHost
          definition={
            interactiveDefinition
          }
          locale={
            locale
          }
        />
      ) : null}
    </section>
  );
}