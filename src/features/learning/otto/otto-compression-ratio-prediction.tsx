"use client";

import {
  getPredictionDefinition,
} from "@/content/predictions";

import type {
  EntityId,
  SupportedLocale,
} from "@/domain/shared/types";

import {
  PredictionActivity,
} from "@/features/learning/prediction-activity";

interface OttoCompressionRatioPredictionProps {
  readonly locale:
    SupportedLocale;
}

const ACTIVITY_ID:
  EntityId =
  "activity-otto-03";

export function OttoCompressionRatioPrediction({
  locale,
}: OttoCompressionRatioPredictionProps) {
  const definition =
    getPredictionDefinition(
      ACTIVITY_ID,
    );

  if (!definition) {
    throw new Error(
      `Missing prediction definition for "${ACTIVITY_ID}".`,
    );
  }

  return (
    <div className="mt-8">
      <PredictionActivity
        definition={
          definition
        }
        locale={
          locale
        }
        submissionMode="explicit"
        testId="otto-compression-ratio-prediction"
      />
    </div>
  );
}