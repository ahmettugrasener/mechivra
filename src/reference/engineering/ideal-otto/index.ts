export {
  IDEAL_OTTO_REFERENCE_TOLERANCES,
  alternateInitialStateReference,
  halfHeatInputReference,
  higherCompressionRatioReference,
  idealOttoReferenceCases,
  reportAppendixBReference,
} from "@/reference/engineering/ideal-otto/reference-cases";

export {
  isWithinIdealOttoReferenceTolerance,
} from "@/reference/engineering/ideal-otto/tolerance";

export type {
  IdealOttoReferenceBasis,
  IdealOttoReferenceCase,
  IdealOttoReferenceExpected,
  IdealOttoReferenceInput,
  IdealOttoReferenceStatePoint,
  IdealOttoReferenceTolerances,
  ReferenceTolerance,
} from "@/reference/engineering/ideal-otto/types";