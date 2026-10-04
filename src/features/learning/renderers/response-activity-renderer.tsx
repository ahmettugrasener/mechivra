import {
  getBendingActivityContentBlocks,
} from "@/content/bending-content";

import {
  getOttoActivityContentBlocks,
} from "@/content/otto-content";

import {
  getPredictionDefinition,
} from "@/content/predictions";

import {
  getNumericProblemDefinition,
} from "@/content/statics-problems";

import type {
  LearningActivity,
} from "@/domain/learning/types";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BendingHeightPrediction } from "@/features/learning/bending/bending-height-prediction";

import { BendingProblemActivity } from "@/features/learning/bending/bending-problem-activity";

import { ContentBlockRenderer } from "@/features/learning/content-block-renderer";

import { OttoCompressionRatioPrediction } from "@/features/learning/otto/otto-compression-ratio-prediction";

import { OttoContentBlockRenderer } from "@/features/learning/otto/otto-content-block-renderer";

import { OttoProblemActivity } from "@/features/learning/otto/otto-problem-activity";

import { PredictionActivity } from "@/features/learning/prediction-activity";

import { ProblemActivityHost } from "@/features/learning/problem-activity-host";

interface ResponseActivityRendererProps {
  readonly activity:
    LearningActivity;

  readonly locale:
    SupportedLocale;
}

export function ResponseActivityRenderer({
  activity,
  locale,
}: ResponseActivityRendererProps) {
  const predictionDefinition =
    getPredictionDefinition(
      activity.id,
    );

  const problemDefinition =
    getNumericProblemDefinition(
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

  const isBendingPrediction =
    activity.id ===
    "activity-bending-03";

  const isBendingProblem =
    activity.id ===
    "activity-bending-05";

  const isOttoPrediction =
    activity.id ===
    "activity-otto-03";

  const isOttoProblem =
    activity.id ===
    "activity-otto-05";

  return (
    <section
      data-activity-renderer="response"
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

      {isBendingPrediction ? (
        <BendingHeightPrediction
          locale={
            locale
          }
        />
      ) : isOttoPrediction ? (
        <OttoCompressionRatioPrediction
          locale={
            locale
          }
        />
      ) : predictionDefinition ? (
        <PredictionActivity
          definition={
            predictionDefinition
          }
          locale={
            locale
          }
        />
      ) : null}

      {isBendingProblem ? (
        <BendingProblemActivity
          locale={
            locale
          }
        />
      ) : isOttoProblem ? (
        <OttoProblemActivity
          locale={
            locale
          }
        />
      ) : problemDefinition ? (
        <ProblemActivityHost
          definition={
            problemDefinition
          }
          locale={
            locale
          }
        />
      ) : null}
    </section>
  );
}