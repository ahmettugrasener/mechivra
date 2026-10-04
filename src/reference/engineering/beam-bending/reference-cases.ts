import type {
  BeamBendingReferenceCase,
  BeamBendingReferenceTolerances,
} from "@/reference/engineering/beam-bending/types";

export const beamBendingReferenceTolerances:
  BeamBendingReferenceTolerances =
  {
    maximumMomentNm: {
      absolute:
        1e-8,

      relative:
        1e-12,
    },

    secondMomentAreaM4: {
      absolute:
        1e-14,

      relative:
        1e-10,
    },

    elasticSectionModulusM3: {
      absolute:
        1e-14,

      relative:
        1e-10,
    },

    stressPa: {
      absolute:
        1e-3,

      relative:
        1e-10,
    },

    deflectionM: {
      absolute:
        1e-12,

      relative:
        1e-9,
    },

    positionM: {
      absolute:
        1e-12,

      relative:
        1e-10,
    },
  };

export const centeredPointLoadReference:
  BeamBendingReferenceCase =
  {
    id:
      "bending-ref-centered-01",

    description:
      "Centered 10 kN point load on a 4 m simply supported rectangular beam.",

    referenceMethod:
      "Closed-form hand benchmark: Mmax = PL/4, I = bh^3/12, sigma = Mc/I, delta_max = PL^3/(48EI).",

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    input: {
      spanM:
        4,

      pointLoadN:
        10_000,

      loadPositionM:
        2,

      sectionWidthM:
        0.1,

      sectionHeightM:
        0.2,

      elasticModulusPa:
        200e9,

      allowableBendingStressPa:
        20e6,

      allowableDeflectionM:
        0.0005,
    },

    expected: {
      maximumMomentNm:
        10_000,

      secondMomentAreaM4:
        0.00006666666666666668,

      elasticSectionModulusM3:
        0.0006666666666666668,

      topFiberStressPa:
        -15_000_000,

      bottomFiberStressPa:
        15_000_000,

      maximumAbsoluteStressPa:
        15_000_000,

      maximumAbsoluteDeflectionM:
        0.001,

      signedDeflectionAtMaximumM:
        -0.001,

      maximumDeflectionPositionM:
        2,

      bendingStressCriterion:
        "satisfied",

      deflectionCriterion:
        "not_satisfied",
    },

    tolerance:
      beamBendingReferenceTolerances,
  };

export const eccentricPointLoadReference:
  BeamBendingReferenceCase =
  {
    id:
      "bending-ref-eccentric-01",

    description:
      "10 kN point load located 1 m from the left support on a 4 m beam.",

    referenceMethod:
      "Closed-form hand benchmark using equilibrium moment, elementary bending stress, and the general piecewise simply supported point-load deflection solution.",

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    input: {
      spanM:
        4,

      pointLoadN:
        10_000,

      loadPositionM:
        1,

      sectionWidthM:
        0.1,

      sectionHeightM:
        0.2,

      elasticModulusPa:
        200e9,

      allowableBendingStressPa:
        null,

      allowableDeflectionM:
        null,
    },

    expected: {
      maximumMomentNm:
        7_500,

      secondMomentAreaM4:
        0.00006666666666666668,

      elasticSectionModulusM3:
        0.0006666666666666668,

      topFiberStressPa:
        -11_250_000,

      bottomFiberStressPa:
        11_250_000,

      maximumAbsoluteStressPa:
        11_250_000,

      maximumAbsoluteDeflectionM:
        0.0006987712429686842,

      signedDeflectionAtMaximumM:
        -0.0006987712429686842,

      maximumDeflectionPositionM:
        1.7639320225002102,

      bendingStressCriterion:
        "undetermined",

      deflectionCriterion:
        "undetermined",
    },

    tolerance:
      beamBendingReferenceTolerances,
  };

export const reducedElasticModulusReference:
  BeamBendingReferenceCase =
  {
    id:
      "bending-ref-elastic-modulus-01",

    description:
      "Centered reference beam with elastic modulus reduced from 200 GPa to 100 GPa.",

    referenceMethod:
      "Closed-form benchmark demonstrating that force-controlled statically determinate moment and bending stress remain unchanged while deflection varies inversely with E.",

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    input: {
      spanM:
        4,

      pointLoadN:
        10_000,

      loadPositionM:
        2,

      sectionWidthM:
        0.1,

      sectionHeightM:
        0.2,

      elasticModulusPa:
        100e9,

      allowableBendingStressPa:
        null,

      allowableDeflectionM:
        null,
    },

    expected: {
      maximumMomentNm:
        10_000,

      secondMomentAreaM4:
        0.00006666666666666668,

      elasticSectionModulusM3:
        0.0006666666666666668,

      topFiberStressPa:
        -15_000_000,

      bottomFiberStressPa:
        15_000_000,

      maximumAbsoluteStressPa:
        15_000_000,

      maximumAbsoluteDeflectionM:
        0.002,

      signedDeflectionAtMaximumM:
        -0.002,

      maximumDeflectionPositionM:
        2,

      bendingStressCriterion:
        "undetermined",

      deflectionCriterion:
        "undetermined",
    },

    tolerance:
      beamBendingReferenceTolerances,
  };

export const deepSectionReference:
  BeamBendingReferenceCase =
  {
    id:
      "bending-ref-deep-section-01",

    description:
      "Centered reference beam with rectangular section height doubled from 0.2 m to 0.4 m.",

    referenceMethod:
      "Closed-form benchmark using I proportional to h^3, section modulus proportional to h^2, elementary bending stress, and centered-load deflection.",

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    input: {
      spanM:
        4,

      pointLoadN:
        10_000,

      loadPositionM:
        2,

      sectionWidthM:
        0.1,

      sectionHeightM:
        0.4,

      elasticModulusPa:
        200e9,

      allowableBendingStressPa:
        5e6,

      allowableDeflectionM:
        0.0002,
    },

    expected: {
      maximumMomentNm:
        10_000,

      secondMomentAreaM4:
        0.0005333333333333335,

      elasticSectionModulusM3:
        0.002666666666666667,

      topFiberStressPa:
        -3_750_000,

      bottomFiberStressPa:
        3_750_000,

      maximumAbsoluteStressPa:
        3_750_000,

      maximumAbsoluteDeflectionM:
        0.000125,

      signedDeflectionAtMaximumM:
        -0.000125,

      maximumDeflectionPositionM:
        2,

      bendingStressCriterion:
        "satisfied",

      deflectionCriterion:
        "satisfied",
    },

    tolerance:
      beamBendingReferenceTolerances,
  };

export const beamBendingReferenceCases:
  readonly BeamBendingReferenceCase[] =
  [
    centeredPointLoadReference,

    eccentricPointLoadReference,

    reducedElasticModulusReference,

    deepSectionReference,
  ];