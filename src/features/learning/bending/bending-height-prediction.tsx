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

interface BendingHeightPredictionProps {
  readonly locale:
    SupportedLocale;
}

const ACTIVITY_ID:
  EntityId =
  "activity-bending-03";

export function BendingHeightPrediction({
  locale,
}: BendingHeightPredictionProps) {
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
        submissionMode="immediate"
        testId="bending-height-prediction"
      />
    </div>
  );
}