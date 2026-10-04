export {
  ASSESSMENT_RESULT_VERSION,
  AssessmentResultError,
  createAssessmentResult,
} from "@/domain/assessment/result";

export type {
  AssessmentEvaluationStatus,
  AssessmentItemResult,
  AssessmentItemStatus,
  AssessmentResult,
} from "@/domain/assessment/result";

export {
  ASSESSMENT_ATTEMPT_VERSION,
  AssessmentAttemptError,
  createAssessmentAttempt,
  evaluateAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/domain/assessment/attempt";

export type {
  AssessmentAttempt,
  AssessmentAttemptIdentity,
  AssessmentAttemptStatus,
  CreateAssessmentAttemptInput,
} from "@/domain/assessment/attempt";

export {
  createAssessmentRevision,
} from "@/domain/assessment/revision";

export type {
  CreateAssessmentRevisionInput,
} from "@/domain/assessment/revision";

export {
  ASSESSMENT_ATTEMPT_HISTORY_VERSION,
  AssessmentAttemptHistoryError,
  appendAssessmentAttempt,
  createAssessmentAttemptHistory,
  getLatestAssessmentAttempt,
  replaceLatestAssessmentAttempt,
} from "@/domain/assessment/attempt-history";

export type {
  AssessmentAttemptHistory,
} from "@/domain/assessment/attempt-history";

export {
  summarizeAssessmentAttemptHistory,
} from "@/domain/assessment/attempt-history-summary";

export type {
  AssessmentAttemptHistorySummary,
} from "@/domain/assessment/attempt-history-summary";

export {
  getAssessmentCompletionSnapshot,
} from "@/domain/assessment/completion";

export type {
  AssessmentCompletionSnapshot,
} from "@/domain/assessment/completion";

export {
  NumericToleranceError,
  evaluateNumericTolerance,
  validateNumericTolerance,
} from "@/domain/assessment/numeric-tolerance";

export type {
  NumericTolerance,
  NumericToleranceEvaluation,
} from "@/domain/assessment/numeric-tolerance";

export {
  NUMERIC_ASSESSMENT_VERSION,
  NumericAssessmentError,
  evaluateNumericAssessment,
} from "@/domain/assessment/numeric-evaluation";

export type {
  NumericAssessmentEvaluation,
  NumericAssessmentItemDefinition,
  NumericAssessmentItemEvaluation,
  NumericAssessmentResponse,
} from "@/domain/assessment/numeric-evaluation";

export {
  parseNumericAssessmentInput,
} from "@/domain/assessment/numeric-input";

export type {
  NumericInputLocale,
  NumericInputParseResult,
} from "@/domain/assessment/numeric-input";

export {
  CHOICE_ASSESSMENT_VERSION,
  ChoiceAssessmentError,
  evaluateChoiceAssessment,
} from "@/domain/assessment/choice-evaluation";

export type {
  ChoiceAssessmentDefinition,
  ChoiceAssessmentEvaluation,
  ChoiceAssessmentKind,
  ChoiceAssessmentOptionDefinition,
  ChoiceAssessmentResponse,
} from "@/domain/assessment/choice-evaluation";

export {
  evaluatePredictionAssessment,
} from "@/domain/assessment/prediction-evaluation";

export type {
  PredictionAssessmentDefinition,
  PredictionAssessmentEvaluation,
  PredictionAssessmentResponse,
} from "@/domain/assessment/prediction-evaluation";

export {
  ENGINEERING_PROBLEM_EVALUATION_VERSION,
  EngineeringProblemEvaluationError,
  evaluateEngineeringProblem,
} from "@/domain/assessment/engineering-problem-evaluation";

export type {
  EngineeringChoiceRole,
  EngineeringProblemChoiceEvaluation,
  EngineeringProblemChoiceItemDefinition,
  EngineeringProblemChoiceResponse,
  EngineeringProblemDefinition,
  EngineeringProblemEvaluation,
  EngineeringProblemResponse,
} from "@/domain/assessment/engineering-problem-evaluation";

export {
  ENGINEERING_CRITERION_OPTION_IDS,
  createEngineeringCriterionOptions,
  isEngineeringCriterionStatus,
} from "@/domain/assessment/criterion";

export type {
  EngineeringCriterionStatus,
} from "@/domain/assessment/criterion";

export {
  ASSESSMENT_FEEDBACK_VERSION,
  AssessmentFeedbackError,
  createAssessmentFeedbackPlan,
} from "@/domain/assessment/feedback";

export type {
  AssessmentFeedbackDescriptor,
  AssessmentFeedbackLookup,
  AssessmentFeedbackPlan,
  AssessmentFeedbackReason,
  AssessmentFeedbackTone,
  AssessmentItemFeedbackReference,
} from "@/domain/assessment/feedback";