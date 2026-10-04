export type IdealOttoStatePointId =
  1 | 2 | 3 | 4;

export type IdealOttoProcessId =
  | "process-1-2"
  | "process-2-3"
  | "process-3-4"
  | "process-4-1";

export type IdealOttoProcessKind =
  | "isentropic_compression"
  | "constant_volume_heat_addition"
  | "isentropic_expansion"
  | "constant_volume_heat_rejection";

export interface IdealOttoProcessDefinition {
  readonly id:
    IdealOttoProcessId;

  readonly fromState:
    IdealOttoStatePointId;

  readonly toState:
    IdealOttoStatePointId;

  readonly kind:
    IdealOttoProcessKind;
}

export const IDEAL_OTTO_PROCESS_SEQUENCE:
  readonly IdealOttoProcessDefinition[] =
  [
    {
      id:
        "process-1-2",

      fromState:
        1,

      toState:
        2,

      kind:
        "isentropic_compression",
    },

    {
      id:
        "process-2-3",

      fromState:
        2,

      toState:
        3,

      kind:
        "constant_volume_heat_addition",
    },

    {
      id:
        "process-3-4",

      fromState:
        3,

      toState:
        4,

      kind:
        "isentropic_expansion",
    },

    {
      id:
        "process-4-1",

      fromState:
        4,

      toState:
        1,

      kind:
        "constant_volume_heat_rejection",
    },
  ];

export function getIdealOttoProcessDefinition(
  id:
    IdealOttoProcessId,
): IdealOttoProcessDefinition {
  const definition =
    IDEAL_OTTO_PROCESS_SEQUENCE.find(
      (process) =>
        process.id ===
        id,
    );

  if (!definition) {
    throw new Error(
      `Unknown Ideal Otto process "${id}".`,
    );
  }

  return definition;
}