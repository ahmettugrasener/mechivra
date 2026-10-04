export {
  IDEAL_OTTO_GAS_PROPERTY_SET_VERSION,
  IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
  IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
  IdealGasPropertySetError,
  createConstantSpecificHeatIdealGasPropertySet,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

export type {
  ConstantSpecificHeatIdealGasPropertySet,
  ConstantSpecificHeatIdealGasPropertySetInput,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

export {
  IDEAL_OTTO_INPUT_STATE_VERSION,
  IDEAL_OTTO_MODEL_KIND,
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

export type {
  IdealOttoInputIssue,
  IdealOttoInputIssueCode,
  IdealOttoInputState,
  IdealOttoInputStateInput,
  IdealOttoInputStateResult,
} from "@/domain/engineering/thermodynamics/otto/state";

export {
  IDEAL_OTTO_PROCESS_SEQUENCE,
  getIdealOttoProcessDefinition,
} from "@/domain/engineering/thermodynamics/otto/processes";

export type {
  IdealOttoProcessDefinition,
  IdealOttoProcessId,
  IdealOttoProcessKind,
  IdealOttoStatePointId,
} from "@/domain/engineering/thermodynamics/otto/processes";

export {
  IdealOttoStatePointError,
  createIdealOttoThermodynamicStatePoint,
} from "@/domain/engineering/thermodynamics/otto/state-point";

export type {
  IdealOttoThermodynamicStatePoint,
  IdealOttoThermodynamicStatePointInput,
} from "@/domain/engineering/thermodynamics/otto/state-point";

export {
  IdealOttoProcessRelationError,
  calculateIdealGasSpecificVolumeM3PerKg,
  calculateIdealOttoState2,
  calculateIdealOttoState3,
  calculateIdealOttoState4,
  createIdealOttoState1,
} from "@/domain/engineering/thermodynamics/otto/relations";

export {
  IDEAL_OTTO_FOUR_STATE_MODEL_ID,
  IDEAL_OTTO_FOUR_STATE_MODEL_VERSION,
  evaluateIdealOttoFourStateCycle,
  idealOttoFourStateModel,
} from "@/domain/engineering/thermodynamics/otto/model";

export type {
  IdealOttoFourStateEvaluation,
  IdealOttoFourStateExecutionStatus,
  IdealOttoFourStateValues,
} from "@/domain/engineering/thermodynamics/otto/model";

export {
  IDEAL_OTTO_ENERGY_SIGN_CONVENTION,
  IdealOttoEnergyCalculationError,
  calculateIdealOttoEnergyPerformance,
  calculateIdealOttoHeatRejectedJPerKg,
  calculateIdealOttoThermalEfficiencyFromCompressionRatio,
} from "@/domain/engineering/thermodynamics/otto/energy";

export type {
  IdealOttoEnergyPerformance,
  IdealOttoEnergyPerformanceInput,
} from "@/domain/engineering/thermodynamics/otto/energy";

export {
  IDEAL_OTTO_ANALYSIS_MODEL_ID,
  IDEAL_OTTO_ANALYSIS_MODEL_VERSION,
  evaluateIdealOttoCycle,
  idealOttoAnalysisModel,
} from "@/domain/engineering/thermodynamics/otto/analysis";

export type {
  IdealOttoAnalysisEvaluation,
  IdealOttoAnalysisExecutionStatus,
  IdealOttoAnalysisValues,
} from "@/domain/engineering/thermodynamics/otto/analysis";

export {
  IdealOttoCurveError,
  createIdealOttoPvProcessCurves,
} from "@/domain/engineering/thermodynamics/otto/curve";

export type {
  IdealOttoPvPoint,
  IdealOttoPvProcessCurve,
  IdealOttoStateSet,
} from "@/domain/engineering/thermodynamics/otto/curve";