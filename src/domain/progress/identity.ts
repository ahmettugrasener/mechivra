import type {
  EntityId,
  VersionString,
} from "@/domain/shared/types";

export interface ModuleProgressIdentity {
  readonly moduleId:
    EntityId;

  readonly moduleVersion:
    VersionString;
}

export interface ActivityProgressIdentity
  extends ModuleProgressIdentity {
  readonly activityId:
    EntityId;

  readonly activityVersion:
    VersionString;
}

export interface AssessmentHistoryIdentity {
  readonly activityId:
    EntityId;

  readonly activityVersion:
    VersionString;

  readonly assessmentId:
    EntityId;

  readonly assessmentVersion:
    VersionString;
}

function assertNonEmpty(
  value:
    string,

  name:
    string,
): void {
  if (
    value.trim().length ===
    0
  ) {
    throw new Error(
      `${name} must not be empty.`,
    );
  }
}

export function createModuleProgressIdentity(
  moduleId:
    EntityId,

  moduleVersion:
    VersionString,
): ModuleProgressIdentity {
  assertNonEmpty(
    moduleId,
    "Module ID",
  );

  assertNonEmpty(
    moduleVersion,
    "Module version",
  );

  return {
    moduleId,
    moduleVersion,
  };
}

export function createActivityProgressIdentity(
  moduleId:
    EntityId,

  moduleVersion:
    VersionString,

  activityId:
    EntityId,

  activityVersion:
    VersionString,
): ActivityProgressIdentity {
  assertNonEmpty(
    moduleId,
    "Module ID",
  );

  assertNonEmpty(
    moduleVersion,
    "Module version",
  );

  assertNonEmpty(
    activityId,
    "Activity ID",
  );

  assertNonEmpty(
    activityVersion,
    "Activity version",
  );

  return {
    moduleId,
    moduleVersion,
    activityId,
    activityVersion,
  };
}

export function createAssessmentHistoryIdentity(
  activityId:
    EntityId,

  activityVersion:
    VersionString,

  assessmentId:
    EntityId,

  assessmentVersion:
    VersionString,
): AssessmentHistoryIdentity {
  assertNonEmpty(
    activityId,
    "Activity ID",
  );

  assertNonEmpty(
    activityVersion,
    "Activity version",
  );

  assertNonEmpty(
    assessmentId,
    "Assessment ID",
  );

  assertNonEmpty(
    assessmentVersion,
    "Assessment version",
  );

  return {
    activityId,
    activityVersion,
    assessmentId,
    assessmentVersion,
  };
}

export function isSameModuleProgressIdentity(
  left:
    ModuleProgressIdentity,

  right:
    ModuleProgressIdentity,
): boolean {
  return (
    left.moduleId ===
      right.moduleId &&
    left.moduleVersion ===
      right.moduleVersion
  );
}

export function isSameActivityProgressIdentity(
  left:
    ActivityProgressIdentity,

  right:
    ActivityProgressIdentity,
): boolean {
  return (
    isSameModuleProgressIdentity(
      left,
      right,
    ) &&
    left.activityId ===
      right.activityId &&
    left.activityVersion ===
      right.activityVersion
  );
}

export function isSameAssessmentHistoryIdentity(
  left:
    AssessmentHistoryIdentity,

  right:
    AssessmentHistoryIdentity,
): boolean {
  return (
    left.activityId ===
      right.activityId &&
    left.activityVersion ===
      right.activityVersion &&
    left.assessmentId ===
      right.assessmentId &&
    left.assessmentVersion ===
      right.assessmentVersion
  );
}