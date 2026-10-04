import type {
  WorkedExampleDefinition,
} from "@/domain/learning/worked-example";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BeamStaticsWorkedExample } from "@/features/learning/worked-examples/beam-statics-worked-example";

interface WorkedExampleHostProps {
  readonly definition:
    WorkedExampleDefinition;

  readonly locale:
    SupportedLocale;
}

export function WorkedExampleHost({
  definition,
  locale,
}: WorkedExampleHostProps) {
  return (
    <BeamStaticsWorkedExample
      definition={
        definition
      }
      locale={
        locale
      }
    />
  );
}