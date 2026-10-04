import type {
  NumericProblemDefinition,
} from "@/domain/assessment/numeric-problem";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BeamStaticsProblemActivity } from "@/features/learning/problems/beam-statics-problem-activity";

interface ProblemActivityHostProps {
  readonly definition:
    NumericProblemDefinition;

  readonly locale:
    SupportedLocale;
}

export function ProblemActivityHost({
  definition,
  locale,
}: ProblemActivityHostProps) {
  return (
    <BeamStaticsProblemActivity
      definition={
        definition
      }
      locale={
        locale
      }
    />
  );
}