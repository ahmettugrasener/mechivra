import type {
  EntityId,
} from "@/domain/shared/types";

import type {
  PredictionDefinition,
} from "@/domain/learning/prediction";

const predictionDefinitions:
  readonly PredictionDefinition[] =
  [
    {
      activityId:
        "activity-ssb-03",

      prompt: {
        tr:
          "Noktasal yükün büyüklüğü ve kiriş açıklığı değişmeden, yük sağ mesnete doğru hareket ederse mesnet tepkilerinin nasıl değişeceğini tahmin et.",

        en:
          "Keeping the point-load magnitude and beam span unchanged, predict how the support reactions change as the load moves toward the right support.",
      },

      options: [
        {
          id:
            "prediction-ssb-reactions-a",

          label: {
            tr:
              "Sol mesnet tepkisi artar, sağ mesnet tepkisi azalır.",

            en:
              "The left reaction increases and the right reaction decreases.",
          },

          feedback: {
            tr:
              "Yük sağa hareket ettikçe sağ mesnete göre moment kolu küçülür. Bu nedenle sol mesnet tepkisi artmaz; azalır.",

            en:
              "As the load moves right, its moment arm about the right support becomes smaller. Therefore, the left reaction does not increase; it decreases.",
          },
        },

        {
          id:
            "prediction-ssb-reactions-b",

          label: {
            tr:
              "Sol mesnet tepkisi azalır, sağ mesnet tepkisi artar.",

            en:
              "The left reaction decreases and the right reaction increases.",
          },

          feedback: {
            tr:
              "Doğru ilişki budur. Yük sağa hareket ettikçe RA azalır ve RB artar. Toplamları yine uygulanan düşey yüke eşittir.",

            en:
              "This is the correct relationship. As the load moves right, RA decreases and RB increases. Their sum still equals the applied vertical load.",
          },
        },

        {
          id:
            "prediction-ssb-reactions-c",

          label: {
            tr:
              "İki mesnet tepkisi de değişmez.",

            en:
              "Both support reactions remain unchanged.",
          },

          feedback: {
            tr:
              "Toplam düşey tepki sabit kalır ancak yükün konumu moment dengesini değiştirir. Bu nedenle yük sağa hareket ederken iki mesnet tepkisi aynı kalmaz.",

            en:
              "The total vertical reaction remains constant, but moving the load changes moment equilibrium. Therefore, the two support reactions do not remain unchanged.",
          },
        },
      ],

      correctOptionId:
        "prediction-ssb-reactions-b",
    },

    {
      activityId:
        "activity-bending-03",

      prompt: {
        tr:
          "b, E, yük ve açıklık aynı kalırken yalnız h iki katına çıkarılıyor. I, maksimum eğilme gerilmesi ve maksimum sehim nasıl değişir?",

        en:
          "Keep b, E, load, and span unchanged while doubling only h. How do I, maximum bending stress, and maximum deflection change?",
      },

      options: [
        {
          id:
            "option-a",

          label: {
            tr:
              "I iki katına çıkar; maksimum gerilme yarıya, maksimum sehim dörtte bire iner.",

            en:
              "I doubles; maximum stress halves and maximum deflection becomes one quarter.",
          },

          feedback: {
            tr:
              "Kesit yüksekliği I bağıntısında birinci kuvvette değil, üçüncü kuvvette yer alır. h'nin I üzerindeki etkisini tekrar düşün.",

            en:
              "Section height does not appear to the first power in I; it appears to the third power. Reconsider the effect of h on I.",
          },
        },

        {
          id:
            "option-b",

          label: {
            tr:
              "I sekiz katına çıkar; maksimum gerilme dörtte bire, maksimum sehim sekizde bire iner.",

            en:
              "I increases by a factor of eight; maximum stress becomes one quarter and maximum deflection becomes one eighth.",
          },

          feedback: {
            tr:
              "Doğru. h iki katına çıktığında I ∝ h³ nedeniyle I sekiz katına çıkar. Dış lif uzaklığı da iki katına çıktığı için |σ|max dörtte bire; sehim ise EI ile ters orantılı olduğundan sekizde bire iner.",

            en:
              "Correct. Doubling h increases I by a factor of eight because I ∝ h³. Since the extreme-fiber distance also doubles, |σ|max becomes one quarter, while deflection becomes one eighth because it is inversely proportional to EI.",
          },
        },

        {
          id:
            "option-c",

          label: {
            tr:
              "I sekiz katına çıkar; maksimum gerilme değişmez, maksimum sehim sekizde bire iner.",

            en:
              "I increases by a factor of eight; maximum stress remains unchanged and maximum deflection becomes one eighth.",
          },

          feedback: {
            tr:
              "I için yön doğru; ancak kesit yüksekliği eğilme gerilmesini de değiştirir. |σ|max = |M|(h/2)/I bağıntısında hem h/2 hem de I değişmektedir.",

            en:
              "The change in I is correct, but section height also changes bending stress. In |σ|max = |M|(h/2)/I, both h/2 and I change.",
          },
        },
      ],

      correctOptionId:
        "option-b",
    },

    {
      activityId:
        "activity-otto-03",

      prompt: {
        tr:
          "T₁ = 300 K, p₁ = 100 kPa, qin = 800 kJ/kg ve γ = 1,4 sabit kalsın. Yalnız sıkıştırma oranını r = 8'den r = 10'a çıkarırsak ideal çevrimde ne beklersin?",

        en:
          "Keep T₁ = 300 K, p₁ = 100 kPa, qin = 800 kJ/kg, and γ = 1.4 fixed. If only the compression ratio increases from r = 8 to r = 10, what do you expect in the ideal cycle?",
      },

      options: [
        {
          id:
            "a",

          label: {
            tr:
              "İdeal verim azalır; T₂ ve p₂ azalır, v₂ artar.",

            en:
              "Ideal efficiency decreases; T₂ and p₂ decrease, while v₂ increases.",
          },

          feedback: {
            tr:
              "Bu tahmin model bağıntılarıyla uyuşmuyor. İzentropik sıkıştırmada T₂ = T₁r^(γ−1), p₂ = p₁r^γ ve v₂ = v₁/r ilişkilerini birlikte düşün.",

            en:
              "This prediction does not match the model relations. Consider T₂ = T₁r^(γ−1), p₂ = p₁r^γ, and v₂ = v₁/r together for isentropic compression.",
          },
        },

        {
          id:
            "b",

          label: {
            tr:
              "İdeal verim artar; T₂ ve p₂ artar, v₂ azalır.",

            en:
              "Ideal efficiency increases; T₂ and p₂ increase, while v₂ decreases.",
          },

          feedback: {
            tr:
              "Doğru. Sabit γ kullanılan ideal Otto modelinde r arttıkça ideal ısıl verim artar. Aynı başlangıç durumunda sıkıştırma sonu sıcaklığı ve basıncı yükselirken özgül hacim azalır.",

            en:
              "Correct. In the constant-γ ideal Otto model, ideal thermal efficiency increases as r increases. For the same initial state, end-of-compression temperature and pressure rise while specific volume decreases.",
          },
        },

        {
          id:
            "c",

          label: {
            tr:
              "İdeal verim değişmez; yalnız T₂ ve p₂ değişir.",

            en:
              "Ideal efficiency remains unchanged; only T₂ and p₂ change.",
          },

          feedback: {
            tr:
              "Bu tahmin model bağıntılarıyla uyuşmuyor. İzentropik sıkıştırmada T₂ = T₁r^(γ−1), p₂ = p₁r^γ ve v₂ = v₁/r ilişkilerini birlikte düşün.",

            en:
              "This prediction does not match the model relations. Consider T₂ = T₁r^(γ−1), p₂ = p₁r^γ, and v₂ = v₁/r together for isentropic compression.",
          },
        },
      ],

      correctOptionId:
        "b",
    },
  ];

function validatePredictionDefinitions(): void {
  const activityIds =
    new Set<string>();

  for (
    const definition
    of predictionDefinitions
  ) {
    if (
      activityIds.has(
        definition.activityId,
      )
    ) {
      throw new Error(
        `Duplicate prediction activity ID: ${definition.activityId}`,
      );
    }

    activityIds.add(
      definition.activityId,
    );

    if (
      definition.options.length <
      2
    ) {
      throw new Error(
        `Prediction "${definition.activityId}" must contain at least two options.`,
      );
    }

    const optionIds =
      new Set<string>();

    for (
      const option
      of definition.options
    ) {
      if (
        optionIds.has(
          option.id,
        )
      ) {
        throw new Error(
          `Duplicate option "${option.id}" in prediction "${definition.activityId}".`,
        );
      }

      optionIds.add(
        option.id,
      );
    }

    if (
      !optionIds.has(
        definition.correctOptionId,
      )
    ) {
      throw new Error(
        `Prediction "${definition.activityId}" references unknown correct option "${definition.correctOptionId}".`,
      );
    }
  }
}

validatePredictionDefinitions();

export function getPredictionDefinition(
  activityId:
    EntityId,
): PredictionDefinition | undefined {
  return predictionDefinitions.find(
    (definition) =>
      definition.activityId ===
      activityId,
  );
}

export function getPredictionDefinitions():
  readonly PredictionDefinition[] {
  return predictionDefinitions;
}