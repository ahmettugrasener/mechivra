import type {
  LearningContentBlock,
} from "@/domain/learning/types";

import type {
  EntityId,
  LocalizedText,
} from "@/domain/shared/types";

export type WorkedExampleStepKind =
  | "given"
  | "free_body"
  | "equilibrium"
  | "shear"
  | "moment"
  | "verification";

export interface WorkedExampleStep {
  readonly id:
    EntityId;

  readonly kind:
    WorkedExampleStepKind;

  readonly title:
    LocalizedText;

  readonly contentBlocks:
    readonly LearningContentBlock[];
}

export interface BeamStaticsWorkedExampleDefinition {
  readonly id:
    EntityId;

  readonly activityId:
    EntityId;

  readonly kind:
    "beam_statics_worked_example";

  readonly title:
    LocalizedText;

  readonly introduction:
    LocalizedText;

  readonly input: {
    readonly spanM:
      number;

    readonly pointLoadKN:
      number;

    readonly loadPositionM:
      number;
  };

  readonly steps:
    readonly WorkedExampleStep[];
}

export type WorkedExampleDefinition =
  BeamStaticsWorkedExampleDefinition;