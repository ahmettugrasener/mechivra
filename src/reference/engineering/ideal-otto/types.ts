export interface ReferenceTolerance {
  readonly absolute:
    number;

  readonly relative:
    number;
}

export interface IdealOttoReferenceTolerances {
  readonly gasConstantJPerKgK:
    ReferenceTolerance;

  readonly gamma:
    ReferenceTolerance;

  readonly specificHeatJPerKgK:
    ReferenceTolerance;

  readonly temperatureK:
    ReferenceTolerance;

  readonly pressurePa:
    ReferenceTolerance;

  readonly specificVolumeM3PerKg:
    ReferenceTolerance;

  readonly specificEnergyJPerKg:
    ReferenceTolerance;

  readonly efficiency:
    ReferenceTolerance;
}

export interface IdealOttoReferenceInput {
  readonly compressionRatio:
    number;

  readonly initialTemperatureK:
    number;

  readonly initialPressurePa:
    number;

  readonly heatInputJPerKg:
    number;
}

export interface IdealOttoReferenceStatePoint {
  readonly temperatureK:
    number;

  readonly pressurePa:
    number;

  readonly specificVolumeM3PerKg:
    number;
}

export interface IdealOttoReferenceExpected {
  readonly gasProperties: {
    readonly gasConstantJPerKgK:
      number;

    readonly gamma:
      number;

    readonly cvJPerKgK:
      number;

    readonly cpJPerKgK:
      number;
  };

  readonly states: {
    readonly state1:
      IdealOttoReferenceStatePoint;

    readonly state2:
      IdealOttoReferenceStatePoint;

    readonly state3:
      IdealOttoReferenceStatePoint;

    readonly state4:
      IdealOttoReferenceStatePoint;
  };

  readonly energy: {
    readonly heatInputJPerKg:
      number;

    readonly heatRejectedJPerKg:
      number;

    readonly netWorkJPerKg:
      number;

    readonly thermalEfficiencyFromEnergyBalance:
      number;

    readonly thermalEfficiencyFromCompressionRatio:
      number;
  };
}

export type IdealOttoReferenceBasis =
  | "report_appendix_b_independent_recalculation"
  | "analytic_qa_derivation";

export interface IdealOttoReferenceCase {
  readonly id:
    string;

  readonly label:
    string;

  readonly basis:
    IdealOttoReferenceBasis;

  readonly sourceIds:
    readonly string[];

  readonly note:
    string;

  readonly input:
    IdealOttoReferenceInput;

  readonly expected:
    IdealOttoReferenceExpected;

  readonly tolerances:
    IdealOttoReferenceTolerances;
}