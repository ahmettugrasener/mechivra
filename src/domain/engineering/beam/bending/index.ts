export {
  BENDING_CONFIGURATION_VERSION,
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

export type {
  BeamBendingConfiguration,
  BeamBendingConfigurationInput,
  BeamBendingConfigurationResult,
  BendingConfigurationIssue,
  BendingConfigurationIssueCode,
  BendingDesignCriteriaState,
  LinearElasticMaterialState,
  RectangularSectionState,
} from "@/domain/engineering/beam/bending/state";

export {
  createRectangularSectionProperties,
  RectangularSectionGeometryError,
} from "@/domain/engineering/beam/bending/section";

export type {
  RectangularSectionProperties,
} from "@/domain/engineering/beam/bending/section";

export {
  BENDING_STRESS_SIGN_CONVENTION,
  calculateBendingNormalStressPa,
  createRectangularBendingStressDistribution,
  BendingStressCalculationError,
} from "@/domain/engineering/beam/bending/stress";

export type {
  RectangularBendingStressDistribution,
} from "@/domain/engineering/beam/bending/stress";

export {
  BEAM_BENDING_STRESS_MODEL_ID,
  BEAM_BENDING_STRESS_MODEL_VERSION,
  beamBendingStressModel,
  evaluateBeamBendingStress,
} from "@/domain/engineering/beam/bending/model";

export type {
  BeamBendingStressEvaluation,
  BeamBendingStressValues,
  BeamStaticsStateForBending,
  BendingStressExecutionStatus,
} from "@/domain/engineering/beam/bending/model";

export {
  BEAM_DEFLECTION_SIGN_CONVENTION,
  BeamDeflectionCalculationError,
  calculateSimplySupportedPointLoadDeflectionAtX,
  createSimplySupportedPointLoadDeflection,
} from "@/domain/engineering/beam/bending/deflection";

export type {
  DeflectionMaximumLocation,
  SimplySupportedPointLoadDeflectionInput,
  SimplySupportedPointLoadDeflectionResult,
} from "@/domain/engineering/beam/bending/deflection";

export {
  EngineeringCriterionEvaluationError,
  evaluateBeamBendingCriteria,
  evaluateUpperBoundCriterion,
} from "@/domain/engineering/beam/bending/criteria";

export type {
  BeamBendingCriteriaEvaluation,
  EngineeringCriterionStatus,
  UpperBoundCriterionAssessment,
} from "@/domain/engineering/beam/bending/criteria";

export {
  BEAM_BENDING_MODEL_ID,
  BEAM_BENDING_MODEL_VERSION,
  beamBendingModel,
  evaluateBeamBending,
} from "@/domain/engineering/beam/bending/analysis";

export type {
  BeamBendingAnalysisResult,
  BeamBendingAnalysisValues,
  BeamBendingExecutionStatus,
} from "@/domain/engineering/beam/bending/analysis";