export const BENDING_CONFIGURATION_VERSION =
  "1.0.0" as const;

export interface RectangularSectionState {
  readonly kind:
    "rectangular";

  readonly widthM:
    number;

  readonly heightM:
    number;
}

export interface LinearElasticMaterialState {
  readonly kind:
    "linear_elastic";

  readonly elasticModulusPa:
    number;

  readonly allowableBendingStressPa:
    number | null;
}

export interface BendingDesignCriteriaState {
  readonly allowableDeflectionM:
    number | null;
}

export interface BeamBendingConfiguration {
  readonly configurationVersion:
    typeof BENDING_CONFIGURATION_VERSION;

  readonly section:
    RectangularSectionState;

  readonly material:
    LinearElasticMaterialState;

  readonly criteria:
    BendingDesignCriteriaState;
}

export interface BeamBendingConfigurationInput {
  readonly sectionWidthM:
    number;

  readonly sectionHeightM:
    number;

  readonly elasticModulusPa:
    number;

  readonly allowableBendingStressPa?:
    number | null;

  readonly allowableDeflectionM?:
    number | null;
}

export type BendingConfigurationIssueCode =
  | "invalid_section_width"
  | "invalid_section_height"
  | "invalid_elastic_modulus"
  | "invalid_allowable_bending_stress"
  | "invalid_allowable_deflection";

export interface BendingConfigurationIssue {
  readonly code:
    BendingConfigurationIssueCode;

  readonly path:
    string;

  readonly message:
    string;
}

export interface BeamBendingConfigurationResult {
  readonly configuration:
    BeamBendingConfiguration | null;

  readonly issues:
    readonly BendingConfigurationIssue[];
}

function isFinitePositive(
  value: number,
): boolean {
  return (
    Number.isFinite(value) &&
    value > 0
  );
}

function validateOptionalPositive(
  value: number | null,
): boolean {
  return (
    value === null ||
    isFinitePositive(value)
  );
}

export function createBeamBendingConfiguration(
  input:
    BeamBendingConfigurationInput,
): BeamBendingConfigurationResult {
  const issues:
    BendingConfigurationIssue[] =
    [];

  if (
    !isFinitePositive(
      input.sectionWidthM,
    )
  ) {
    issues.push({
      code:
        "invalid_section_width",

      path:
        "section.widthM",

      message:
        "Rectangular-section width must be finite and greater than zero.",
    });
  }

  if (
    !isFinitePositive(
      input.sectionHeightM,
    )
  ) {
    issues.push({
      code:
        "invalid_section_height",

      path:
        "section.heightM",

      message:
        "Rectangular-section height must be finite and greater than zero.",
    });
  }

  if (
    !isFinitePositive(
      input.elasticModulusPa,
    )
  ) {
    issues.push({
      code:
        "invalid_elastic_modulus",

      path:
        "material.elasticModulusPa",

      message:
        "Elastic modulus must be finite and greater than zero.",
    });
  }

  const allowableBendingStressPa =
    input.allowableBendingStressPa ??
    null;

  if (
    !validateOptionalPositive(
      allowableBendingStressPa,
    )
  ) {
    issues.push({
      code:
        "invalid_allowable_bending_stress",

      path:
        "material.allowableBendingStressPa",

      message:
        "Allowable bending stress must be null or a finite value greater than zero.",
    });
  }

  const allowableDeflectionM =
    input.allowableDeflectionM ??
    null;

  if (
    !validateOptionalPositive(
      allowableDeflectionM,
    )
  ) {
    issues.push({
      code:
        "invalid_allowable_deflection",

      path:
        "criteria.allowableDeflectionM",

      message:
        "Allowable deflection must be null or a finite value greater than zero.",
    });
  }

  if (
    issues.length >
    0
  ) {
    return {
      configuration:
        null,

      issues,
    };
  }

  return {
    configuration: {
      configurationVersion:
        BENDING_CONFIGURATION_VERSION,

      section: {
        kind:
          "rectangular",

        widthM:
          input.sectionWidthM,

        heightM:
          input.sectionHeightM,
      },

      material: {
        kind:
          "linear_elastic",

        elasticModulusPa:
          input.elasticModulusPa,

        allowableBendingStressPa,
      },

      criteria: {
        allowableDeflectionM,
      },
    },

    issues: [],
  };
}