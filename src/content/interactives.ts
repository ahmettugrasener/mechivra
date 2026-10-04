import {
  BEAM_STATICS_MODEL_ID,
} from "@/domain/engineering";

import type {
  InteractiveActivityDefinition,
} from "@/domain/learning/interactive";

import type {
  EntityId,
} from "@/domain/shared/types";

const interactiveDefinitions:
  readonly InteractiveActivityDefinition[] =
  [
    {
      id:
        "interactive-ssb-point-load",

      activityId:
        "activity-ssb-04",

      kind:
        "beam_statics_point_load_explorer",

      engineeringModelId:
        BEAM_STATICS_MODEL_ID,

      title: {
        tr:
          "Kiriş üzerindeki yükü değiştir",

        en:
          "Change the load on the beam",
      },

      instructions: {
        tr:
          "Yükün büyüklüğünü ve konumunu değiştir. Mesnet tepkileri ile maksimum eğilme momentinin nasıl değiştiğini gözlemle.",

        en:
          "Change the load magnitude and position. Observe how the support reactions and maximum bending moment respond.",
      },

      configuration: {
        spanM: 4,

        pointLoad: {
          label: {
            tr:
              "Noktasal yük",

            en:
              "Point load",
          },

          minimum: 1,
          maximum: 20,
          step: 1,
          initial: 10,

          unitSymbol:
            "kN",
        },

        loadPosition: {
          label: {
            tr:
              "Yükün soldan konumu",

            en:
              "Load position from the left",
          },

          minimum: 0.2,
          maximum: 3.8,
          step: 0.1,
          initial: 2,

          unitSymbol:
            "m",
        },
      },

      labels: {
        fixedSpan: {
          tr:
            "Kiriş açıklığı",

          en:
            "Beam span",
        },

        leftReaction: {
          tr:
            "Sol mesnet tepkisi",

          en:
            "Left support reaction",
        },

        rightReaction: {
          tr:
            "Sağ mesnet tepkisi",

          en:
            "Right support reaction",
        },

        maximumMoment: {
          tr:
            "Maksimum eğilme momenti",

          en:
            "Maximum bending moment",
        },
      },
    },
  ];

function validateInteractiveDefinitions():
  void {
  const definitionIds =
    new Set<string>();

  const activityIds =
    new Set<string>();

  for (
    const definition
    of interactiveDefinitions
  ) {
    if (
      definitionIds.has(
        definition.id,
      )
    ) {
      throw new Error(
        `Duplicate interactive definition ID: ${definition.id}`,
      );
    }

    definitionIds.add(
      definition.id,
    );

    if (
      activityIds.has(
        definition.activityId,
      )
    ) {
      throw new Error(
        `Multiple interactive definitions reference activity "${definition.activityId}".`,
      );
    }

    activityIds.add(
      definition.activityId,
    );

    const {
      pointLoad,
      loadPosition,
    } =
      definition.configuration;

    for (
      const control
      of [
        pointLoad,
        loadPosition,
      ]
    ) {
      if (
        !Number.isFinite(
          control.minimum,
        ) ||
        !Number.isFinite(
          control.maximum,
        ) ||
        !Number.isFinite(
          control.step,
        ) ||
        !Number.isFinite(
          control.initial,
        )
      ) {
        throw new Error(
          `Interactive definition "${definition.id}" contains a non-finite control value.`,
        );
      }

      if (
        control.maximum <=
        control.minimum
      ) {
        throw new Error(
          `Interactive definition "${definition.id}" contains an invalid control range.`,
        );
      }

      if (
        control.step <= 0
      ) {
        throw new Error(
          `Interactive definition "${definition.id}" contains a non-positive control step.`,
        );
      }

      if (
        control.initial <
          control.minimum ||
        control.initial >
          control.maximum
      ) {
        throw new Error(
          `Interactive definition "${definition.id}" contains an initial value outside its control range.`,
        );
      }
    }
  }
}

validateInteractiveDefinitions();

export function getInteractiveDefinition(
  activityId:
    EntityId,
):
  | InteractiveActivityDefinition
  | undefined {
  return interactiveDefinitions.find(
    (definition) =>
      definition.activityId ===
      activityId,
  );
}

export function getInteractiveDefinitions():
  readonly InteractiveActivityDefinition[] {
  return interactiveDefinitions;
}