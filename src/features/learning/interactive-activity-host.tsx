import type {
  InteractiveActivityDefinition,
} from "@/domain/learning/interactive";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { BeamStaticsPointLoadExplorer } from "@/features/learning/interactives/beam-statics-point-load-explorer";

interface InteractiveActivityHostProps {
  readonly definition:
    InteractiveActivityDefinition;

  readonly locale:
    SupportedLocale;
}

export function InteractiveActivityHost({
  definition,
  locale,
}: InteractiveActivityHostProps) {
  return (
    <BeamStaticsPointLoadExplorer
      definition={
        definition
      }
      locale={
        locale
      }
    />
  );
}