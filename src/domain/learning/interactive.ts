import type {
  EntityId,
  LocalizedText,
} from "@/domain/shared/types";

export interface InteractiveNumericControl {
  readonly label:
    LocalizedText;

  readonly minimum: number;
  readonly maximum: number;
  readonly step: number;
  readonly initial: number;

  readonly unitSymbol:
    string;
}

export interface BeamStaticsPointLoadExplorerDefinition {
  readonly id:
    EntityId;

  readonly activityId:
    EntityId;

  readonly kind:
    "beam_statics_point_load_explorer";

  /**
   * Stable Engineering Core model identifier.
   */
  readonly engineeringModelId:
    EntityId;

  readonly title:
    LocalizedText;

  readonly instructions:
    LocalizedText;

  readonly configuration: {
    readonly spanM: number;

    readonly pointLoad:
      InteractiveNumericControl;

    readonly loadPosition:
      InteractiveNumericControl;
  };

  readonly labels: {
    readonly fixedSpan:
      LocalizedText;

    readonly leftReaction:
      LocalizedText;

    readonly rightReaction:
      LocalizedText;

    readonly maximumMoment:
      LocalizedText;
  };
}

export type InteractiveActivityDefinition =
  BeamStaticsPointLoadExplorerDefinition;

export interface InteractiveEngagement {
  readonly hasMeaningfulInteraction:
    boolean;

  readonly interactionCount:
    number;
}

export function createInteractiveEngagement():
  InteractiveEngagement {
  return {
    hasMeaningfulInteraction:
      false,

    interactionCount: 0,
  };
}

export function recordMeaningfulInteraction(
  current:
    InteractiveEngagement,
): InteractiveEngagement {
  return {
    hasMeaningfulInteraction:
      true,

    interactionCount:
      current.interactionCount +
      1,
  };
}