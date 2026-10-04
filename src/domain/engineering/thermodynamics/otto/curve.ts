import type {
  IdealOttoProcessId,
  IdealOttoProcessKind,
} from "@/domain/engineering/thermodynamics/otto/processes";

import type {
  IdealOttoThermodynamicStatePoint,
} from "@/domain/engineering/thermodynamics/otto/state-point";

export interface IdealOttoStateSet {
  readonly state1:
    IdealOttoThermodynamicStatePoint;

  readonly state2:
    IdealOttoThermodynamicStatePoint;

  readonly state3:
    IdealOttoThermodynamicStatePoint;

  readonly state4:
    IdealOttoThermodynamicStatePoint;
}

export interface IdealOttoPvPoint {
  readonly specificVolumeM3PerKg:
    number;

  readonly pressurePa:
    number;
}

export interface IdealOttoPvProcessCurve {
  readonly processId:
    IdealOttoProcessId;

  readonly kind:
    IdealOttoProcessKind;

  readonly points:
    readonly IdealOttoPvPoint[];
}

export class IdealOttoCurveError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "IdealOttoCurveError";
  }
}

function assertFinitePositive(
  value:
    number,

  name:
    string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <= 0
  ) {
    throw new IdealOttoCurveError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

function assertState(
  state:
    IdealOttoThermodynamicStatePoint,
): void {
  assertFinitePositive(
    state.specificVolumeM3PerKg,
    "Specific volume",
  );

  assertFinitePositive(
    state.pressurePa,
    "Pressure",
  );
}

function toPvPoint(
  state:
    IdealOttoThermodynamicStatePoint,
): IdealOttoPvPoint {
  return {
    specificVolumeM3PerKg:
      state.specificVolumeM3PerKg,

    pressurePa:
      state.pressurePa,
  };
}

function createIsentropicCurve(
  start:
    IdealOttoThermodynamicStatePoint,

  end:
    IdealOttoThermodynamicStatePoint,

  gamma:
    number,

  sampleCount:
    number,
): readonly IdealOttoPvPoint[] {
  assertState(
    start,
  );

  assertState(
    end,
  );

  if (
    !Number.isFinite(
      gamma,
    ) ||
    gamma <= 1
  ) {
    throw new IdealOttoCurveError(
      "Specific-heat ratio gamma must be finite and greater than one.",
    );
  }

  if (
    !Number.isInteger(
      sampleCount,
    ) ||
    sampleCount < 2
  ) {
    throw new IdealOttoCurveError(
      "Isentropic curve sample count must be an integer greater than or equal to two.",
    );
  }

  const invariant =
    start.pressurePa *
    (
      start
        .specificVolumeM3PerKg **
      gamma
    );

  return Array.from(
    {
      length:
        sampleCount,
    },

    (
      _,
      index,
    ) => {
      /*
       * Preserve the verified thermodynamic state points
       * exactly at both ends of the visualization curve.
       *
       * Intermediate points are sampled from p v^gamma = C.
       */
      if (
        index === 0
      ) {
        return toPvPoint(
          start,
        );
      }

      if (
        index ===
        sampleCount -
          1
      ) {
        return toPvPoint(
          end,
        );
      }

      const ratio =
        index /
        (
          sampleCount -
          1
        );

      const specificVolumeM3PerKg =
        start.specificVolumeM3PerKg +
        (
          end.specificVolumeM3PerKg -
          start.specificVolumeM3PerKg
        ) *
          ratio;

      const pressurePa =
        invariant /
        (
          specificVolumeM3PerKg **
          gamma
        );

      return {
        specificVolumeM3PerKg,

        pressurePa,
      };
    },
  );
}

function createConstantVolumeCurve(
  start:
    IdealOttoThermodynamicStatePoint,

  end:
    IdealOttoThermodynamicStatePoint,
): readonly IdealOttoPvPoint[] {
  assertState(
    start,
  );

  assertState(
    end,
  );

  return [
    toPvPoint(
      start,
    ),

    toPvPoint(
      end,
    ),
  ];
}

export function createIdealOttoPvProcessCurves(
  states:
    IdealOttoStateSet,

  gamma:
    number,

  isentropicSampleCount:
    number = 41,
): readonly IdealOttoPvProcessCurve[] {
  return [
    {
      processId:
        "process-1-2",

      kind:
        "isentropic_compression",

      points:
        createIsentropicCurve(
          states.state1,
          states.state2,
          gamma,
          isentropicSampleCount,
        ),
    },

    {
      processId:
        "process-2-3",

      kind:
        "constant_volume_heat_addition",

      points:
        createConstantVolumeCurve(
          states.state2,
          states.state3,
        ),
    },

    {
      processId:
        "process-3-4",

      kind:
        "isentropic_expansion",

      points:
        createIsentropicCurve(
          states.state3,
          states.state4,
          gamma,
          isentropicSampleCount,
        ),
    },

    {
      processId:
        "process-4-1",

      kind:
        "constant_volume_heat_rejection",

      points:
        createConstantVolumeCurve(
          states.state4,
          states.state1,
        ),
    },
  ];
}