export {
  beamStaticsModel,
  createSimplySupportedBeamState,
  createSimplySupportedBeamStateFromDisplayInput,
  evaluateBeamMomentNm,
  evaluateBeamShearN,
  BEAM_STATICS_MODEL_ID,
  BEAM_STATICS_MODEL_VERSION,
  SIMPLY_SUPPORTED_BEAM_STATE_VERSION,
  SIMPLY_SUPPORTED_BEAM_TYPE,
  validateSimplySupportedBeamStateInput,
} from "@/domain/engineering/beam";

export type {
  BeamForceInput,
  BeamLengthInput,
  BeamMaximumMoment,
  BeamMaximumMomentIntervalLocation,
  BeamMaximumMomentLocation,
  BeamMaximumMomentPointLocation,
  BeamMomentSegment,
  BeamShearEvaluationSide,
  BeamShearSegment,
  BeamStateCreationResult,
  BeamStaticsValues,
  BeamSupportConfiguration,
  BeamVerticalLoadDirection,
  SimplySupportedBeamDisplayInput,
  SimplySupportedBeamState,
  SimplySupportedBeamStateInput,
} from "@/domain/engineering/beam";

export type {
  EngineeringExecutionStatus,
  EngineeringIssueParameter,
  EngineeringModel,
  EngineeringResult,
  EngineeringValidity,
  EngineeringValidityIssue,
  EngineeringWarning,
} from "@/domain/engineering/contracts";

export {
  createInvalidEngineeringResult,
  createValidEngineeringResult,
  collectValidityIssues,
  validateExclusiveRange,
  validateFiniteNumber,
  validateGreaterThan,
  validateGreaterThanOrEqual,
} from "@/domain/engineering/model";

export {
  UnitConversionError,
  canonicalUnitByQuantity,
  convertUnit,
  createQuantity,
  formatUnitSymbol,
  fromSI,
  getCanonicalUnit,
  isUnitCompatible,
  toSI,
  unitDefinitions,
} from "@/domain/engineering/units";

export type {
  QuantityKind,
  QuantityValue,
  UnitDefinition,
  UnitId,
} from "@/domain/engineering/units";