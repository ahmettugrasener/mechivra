import type {
  NumericProblemDefinition,
} from "@/domain/assessment/numeric-problem";

import type {
  EntityId,
} from "@/domain/shared/types";

const problemDefinitions:
  readonly NumericProblemDefinition[] =
  [
    {
      id:
        "problem-ssb-independent-case",

      activityId:
        "activity-ssb-05",

      kind:
        "beam_statics_numeric_problem",

      title: {
        tr:
          "Sonuçlarını kontrol et",

        en:
          "Check your results",
      },

      instructions: {
        tr:
          "Hesapladığın altı değeri gir. Küçük yuvarlama farkları kabul edilir. Yanlış bir sonuçta doğrudan cevap yerine hangi fiziksel ilişkiyi yeniden kontrol etmen gerektiğini göreceksin.",

        en:
          "Enter the six values you calculated. Small rounding differences are accepted. If a result is incorrect, you will receive a targeted hint about the physical relationship to revisit rather than the answer itself.",
      },

      input: {
        spanM: 6,
        pointLoadKN: 12,
        loadPositionM: 2,
      },

      fields: [
        {
          id:
            "problem-ssb-ra",

          answerRole:
            "left_reaction",

          label: {
            tr:
              "Sol mesnet tepkisi RA",

            en:
              "Left support reaction RA",
          },

          unitSymbol:
            "kN",

          tolerance: {
            absolute: 0.02,
            relative: 0.002,
          },

          hint: {
            tr:
              "Önce A noktasına göre moment dengesiyle RB'yi bul; ardından RA + RB = P düşey kuvvet dengesini kullan.",

            en:
              "First find RB from moment equilibrium about A, then use the vertical-force balance RA + RB = P.",
          },
        },

        {
          id:
            "problem-ssb-rb",

          answerRole:
            "right_reaction",

          label: {
            tr:
              "Sağ mesnet tepkisi RB",

            en:
              "Right support reaction RB",
          },

          unitSymbol:
            "kN",

          tolerance: {
            absolute: 0.02,
            relative: 0.002,
          },

          hint: {
            tr:
              "A noktasına göre moment al. Bu seçim RA'yı denklemden çıkarır: RB·L ile P·a momentlerini dengele.",

            en:
              "Take moments about A. This eliminates RA from the equation: balance the moments RB·L and P·a.",
          },
        },

        {
          id:
            "problem-ssb-v-left",

          answerRole:
            "left_shear",

          label: {
            tr:
              "Yükün solundaki kesme kuvveti",

            en:
              "Shear force to the left of the load",
          },

          unitSymbol:
            "kN",

          tolerance: {
            absolute: 0.02,
            relative: 0.002,
          },

          hint: {
            tr:
              "A mesnedinden hemen sağdaki kesitte hangi düşey kuvvetin etkili olduğunu düşün. Yük noktasına ulaşmadan önce başka düşey kuvvet yoktur.",

            en:
              "Consider which vertical force acts immediately to the right of support A. There is no other vertical force before reaching the point load.",
          },
        },

        {
          id:
            "problem-ssb-v-right",

          answerRole:
            "right_shear",

          label: {
            tr:
              "Yükün sağındaki kesme kuvveti",

            en:
              "Shear force to the right of the load",
          },

          unitSymbol:
            "kN",

          tolerance: {
            absolute: 0.02,
            relative: 0.002,
          },

          hint: {
            tr:
              "Noktasal yükte kesme diyagramı P kadar aşağı sıçrar. İşaret kuralını koruyarak Vsağ = Vsol − P ilişkisini kontrol et.",

            en:
              "At the point load, the shear diagram jumps downward by P. Keeping the sign convention consistent, check Vright = Vleft − P.",
          },
        },

        {
          id:
            "problem-ssb-mmax",

          answerRole:
            "maximum_moment",

          label: {
            tr:
              "Maksimum eğilme momenti",

            en:
              "Maximum bending moment",
          },

          unitSymbol:
            "kN·m",

          tolerance: {
            absolute: 0.05,
            relative: 0.002,
          },

          hint: {
            tr:
              "Kesme kuvvetinin işaret değiştirdiği noktayı belirle. Bu tek noktasal yük modelinde maksimum momenti o konumda M(x) bağıntısından hesapla.",

            en:
              "Identify where the shear force changes sign. For this single-point-load model, evaluate M(x) at that location to obtain the maximum moment.",
          },
        },

        {
          id:
            "problem-ssb-x-mmax",

          answerRole:
            "maximum_moment_position",

          label: {
            tr:
              "Maksimum momentin konumu",

            en:
              "Location of maximum moment",
          },

          unitSymbol:
            "m",

          tolerance: {
            absolute: 0.01,
            relative: 0.001,
          },

          hint: {
            tr:
              "V(x)'in pozitiften negatife geçtiği konumu bul. Bu modelde momentin tepe noktası kesme kuvvetinin işaret değiştirdiği yerdedir.",

            en:
              "Find the position where V(x) changes from positive to negative. In this model, the moment reaches its peak where the shear force changes sign.",
          },
        },
      ],

      ui: {
        answersHeading: {
          tr:
            "Hesapladığın değerler",

          en:
            "Your calculated values",
        },

        submitLabel: {
          tr:
            "Sonuçları kontrol et",

          en:
            "Check answers",
        },

        retryLabel: {
          tr:
            "Tekrar kontrol et",

          en:
            "Check again",
        },

        correctLabel: {
          tr:
            "Doğru",

          en:
            "Correct",
        },

        missingLabel: {
          tr:
            "Bir değer gir.",

          en:
            "Enter a value.",
        },

        invalidLabel: {
          tr:
            "Geçerli bir sayı gir.",

          en:
            "Enter a valid number.",
        },

        successMessage: {
          tr:
            "Altı sonuç da Engineering Core tarafından hesaplanan fiziksel durumla uyumlu. Reaksiyon, kesme ve moment sonuçların birbirleriyle tutarlı.",

          en:
            "All six results agree with the physical state calculated by the Engineering Core. Your reaction, shear, and moment results are mutually consistent.",
        },

        incorrectMessage: {
          tr:
            "Bazı sonuçlar henüz uyuşmuyor. Doğrudan cevabı vermeden, yeniden kontrol etmen gereken ilişkiyi her alanın altında gösterdim.",

          en:
            "Some results do not yet agree. Rather than revealing the answer, each field below shows the relationship you should revisit.",
        },
      },
    },
  ];

export function getNumericProblemDefinition(
  activityId:
    EntityId,
):
  | NumericProblemDefinition
  | undefined {
  return problemDefinitions.find(
    (definition) =>
      definition.activityId ===
      activityId,
  );
}

export function getNumericProblemDefinitions():
  readonly NumericProblemDefinition[] {
  return problemDefinitions;
}