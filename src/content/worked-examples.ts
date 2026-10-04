import type {
  WorkedExampleDefinition,
} from "@/domain/learning/worked-example";

import type {
  EntityId,
} from "@/domain/shared/types";

const workedExampleDefinitions:
  readonly WorkedExampleDefinition[] =
  [
    {
      id:
        "worked-example-ssb-eccentric-load",

      activityId:
        "activity-ssb-02",

      kind:
        "beam_statics_worked_example",

      title: {
        tr:
          "Çözümlü örnek: Merkez dışı noktasal yük",

        en:
          "Worked example: Eccentric point load",
      },

      introduction: {
        tr:
          "Şimdi denge denklemlerini merkezden uzakta uygulanan bir yük için adım adım kullanalım. Amaç yalnızca sonucu bulmak değil; mesnet tepkileri, kesme kuvveti ve eğilme momentinin aynı fiziksel durumdan nasıl çıktığını görmek.",

        en:
          "Now apply the equilibrium equations step by step to a load placed away from midspan. The goal is not only to obtain the answer, but to see how support reactions, shear force, and bending moment arise from the same physical state.",
      },

      input: {
        spanM: 4,
        pointLoadKN: 10,
        loadPositionM: 1,
      },

      steps: [
        {
          id:
            "worked-example-ssb-step-01",

          kind:
            "given",

          title: {
            tr:
              "1. Verilenleri tanımla",

            en:
              "1. Identify the given quantities",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-01-p01",

              type:
                "paragraph",

              text: {
                tr:
                  "Kiriş açıklığı 4 m, aşağı yönlü noktasal yük 10 kN ve yükün sol mesnetten uzaklığı 1 m'dir.",

                en:
                  "The beam span is 4 m, the downward point load is 10 kN, and the load is located 1 m from the left support.",
              },
            },

            {
              id:
                "worked-example-ssb-step-01-e01",

              type:
                "equation",

              expression:
                "L = 4\\ \\mathrm{m},\\qquad P = 10\\ \\mathrm{kN},\\qquad a = 1\\ \\mathrm{m}",

              description: {
                tr:
                  "Problemin kanonik geometrik ve yük verileri.",

                en:
                  "Canonical geometric and loading data for the problem.",
              },
            },
          ],
        },

        {
          id:
            "worked-example-ssb-step-02",

          kind:
            "free_body",

          title: {
            tr:
              "2. Serbest cisim diyagramını düşün",

            en:
              "2. Think through the free-body diagram",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-02-p01",

              type:
                "paragraph",

              text: {
                tr:
                  "Sol mesnetteki düşey tepkiyi RA, sağ mesnetteki düşey tepkiyi RB olarak tanımlayalım. Her iki tepki için yukarı yönü pozitif kabul ediyoruz. Uygulanan P yükü aşağı yönlüdür.",

                en:
                  "Let the vertical reaction at the left support be RA and the vertical reaction at the right support be RB. Take upward as positive for both reactions. The applied load P acts downward.",
              },
            },

            {
              id:
                "worked-example-ssb-step-02-c01",

              type:
                "callout",

              tone:
                "engineering",

              title: {
                tr:
                  "Neden önce moment dengesi?",

                en:
                  "Why start with moment equilibrium?",
              },

              body: {
                tr:
                  "A noktasına göre moment aldığımızda RA'nın moment kolu sıfır olur. Böylece denklemde yalnız RB ve P kalır ve RB doğrudan bulunabilir.",

                en:
                  "Taking moments about point A eliminates RA because its moment arm is zero. The equation then contains only RB and P, allowing RB to be found directly.",
              },
            },
          ],
        },

        {
          id:
            "worked-example-ssb-step-03",

          kind:
            "equilibrium",

          title: {
            tr:
              "3. A noktasına göre moment dengesini yaz",

            en:
              "3. Write moment equilibrium about A",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-03-e01",

              type:
                "equation",

              expression:
                "\\sum M_A = 0",

              description: {
                tr:
                  "Statik dengede herhangi bir noktaya göre net moment sıfırdır.",

                en:
                  "For static equilibrium, the net moment about any point is zero.",
              },
            },

            {
              id:
                "worked-example-ssb-step-03-e02",

              type:
                "equation",

              expression:
                "R_B(4) - 10(1) = 0",
            },

            {
              id:
                "worked-example-ssb-step-03-e03",

              type:
                "equation",

              expression:
                "R_B = \\frac{10(1)}{4} = 2.5\\ \\mathrm{kN}",
            },

            {
              id:
                "worked-example-ssb-step-03-p01",

              type:
                "paragraph",

              text: {
                tr:
                  "Sağ mesnet tepkisi 2.5 kN'dur. Yük sol mesnete daha yakın olduğu için sağ mesnet toplam yükün daha küçük bir bölümünü taşır.",

                en:
                  "The right support reaction is 2.5 kN. Because the load is closer to the left support, the right support carries the smaller share of the total load.",
              },
            },
          ],
        },

        {
          id:
            "worked-example-ssb-step-04",

          kind:
            "equilibrium",

          title: {
            tr:
              "4. Düşey kuvvet dengesinden RA'yı bul",

            en:
              "4. Find RA from vertical-force equilibrium",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-04-e01",

              type:
                "equation",

              expression:
                "\\sum F_y = R_A + R_B - P = 0",
            },

            {
              id:
                "worked-example-ssb-step-04-e02",

              type:
                "equation",

              expression:
                "R_A + 2.5 - 10 = 0",
            },

            {
              id:
                "worked-example-ssb-step-04-e03",

              type:
                "equation",

              expression:
                "R_A = 7.5\\ \\mathrm{kN}",
            },

            {
              id:
                "worked-example-ssb-step-04-c01",

              type:
                "callout",

              tone:
                "engineering",

              title: {
                tr:
                  "Fiziksel yorum",

                en:
                  "Physical interpretation",
              },

              body: {
                tr:
                  "Yük sol mesnete yakın olduğu için RA, RB'den büyüktür. Ancak denge gereği iki reaksiyonun toplamı yine 10 kN olmalıdır.",

                en:
                  "Because the load is closer to the left support, RA is larger than RB. Equilibrium still requires the two reactions to sum to 10 kN.",
              },
            },
          ],
        },

        {
          id:
            "worked-example-ssb-step-05",

          kind:
            "shear",

          title: {
            tr:
              "5. Kesme kuvveti V(x)'i oluştur",

            en:
              "5. Construct the shear force V(x)",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-05-p01",

              type:
                "paragraph",

              text: {
                tr:
                  "A mesnedinden hemen sonra kesme kuvveti +7.5 kN'dur. Yük noktasına kadar başka düşey kuvvet olmadığı için bu değer sabit kalır.",

                en:
                  "Immediately to the right of support A, the shear force is +7.5 kN. With no other vertical force before the point load, this value remains constant.",
              },
            },

            {
              id:
                "worked-example-ssb-step-05-e01",

              type:
                "equation",

              expression:
                "V(x) = +7.5\\ \\mathrm{kN},\\qquad 0 < x < 1\\ \\mathrm{m}",
            },

            {
              id:
                "worked-example-ssb-step-05-p02",

              type:
                "paragraph",

              text: {
                tr:
                  "x = 1 m noktasında 10 kN'luk aşağı yönlü yük nedeniyle kesme diyagramı 10 kN aşağı sıçrar.",

                en:
                  "At x = 1 m, the 10 kN downward point load causes the shear diagram to jump downward by 10 kN.",
              },
            },

            {
              id:
                "worked-example-ssb-step-05-e02",

              type:
                "equation",

              expression:
                "V(x) = 7.5 - 10 = -2.5\\ \\mathrm{kN},\\qquad 1 < x < 4\\ \\mathrm{m}",
            },

            {
              id:
                "worked-example-ssb-step-05-p03",

              type:
                "paragraph",

              text: {
                tr:
                  "B mesnedindeki +2.5 kN tepki, kesme kuvvetini tekrar sıfıra getirir.",

                en:
                  "The +2.5 kN reaction at support B returns the shear force to zero.",
              },
            },
          ],
        },

        {
          id:
            "worked-example-ssb-step-06",

          kind:
            "moment",

          title: {
            tr:
              "6. Eğilme momenti M(x)'i oluştur",

            en:
              "6. Construct the bending moment M(x)",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-06-p01",

              type:
                "paragraph",

              text: {
                tr:
                  "Sol bölgede yalnız RA katkı verir. Bu nedenle moment x ile doğrusal artar.",

                en:
                  "In the left region, only RA contributes. The bending moment therefore increases linearly with x.",
              },
            },

            {
              id:
                "worked-example-ssb-step-06-e01",

              type:
                "equation",

              expression:
                "M(x) = 7.5x,\\qquad 0 \\le x \\le 1\\ \\mathrm{m}",
            },

            {
              id:
                "worked-example-ssb-step-06-p02",

              type:
                "paragraph",

              text: {
                tr:
                  "Yük noktasından sonra P yükünün moment etkisi de denkleme girer.",

                en:
                  "Beyond the load point, the moment contribution of P must also be included.",
              },
            },

            {
              id:
                "worked-example-ssb-step-06-e02",

              type:
                "equation",

              expression:
                "M(x) = 7.5x - 10(x-1),\\qquad 1 \\le x \\le 4\\ \\mathrm{m}",
            },

            {
              id:
                "worked-example-ssb-step-06-p03",

              type:
                "paragraph",

              text: {
                tr:
                  "Kesme kuvveti yükün solunda pozitif, sağında negatif olduğu için moment yük noktasına kadar artar ve sonrasında azalır. Bu nedenle maksimum moment x = 1 m'de oluşur.",

                en:
                  "Because shear is positive to the left of the load and negative to the right, moment increases up to the load point and then decreases. The maximum moment therefore occurs at x = 1 m.",
              },
            },

            {
              id:
                "worked-example-ssb-step-06-e03",

              type:
                "equation",

              expression:
                "M_{\\max} = M(1) = 7.5\\ \\mathrm{kN\\cdot m}",
            },
          ],
        },

        {
          id:
            "worked-example-ssb-step-07",

          kind:
            "verification",

          title: {
            tr:
              "7. Sonucu kontrol et",

            en:
              "7. Verify the result",
          },

          contentBlocks: [
            {
              id:
                "worked-example-ssb-step-07-e01",

              type:
                "equation",

              expression:
                "R_A + R_B = 7.5 + 2.5 = 10\\ \\mathrm{kN} = P",
            },

            {
              id:
                "worked-example-ssb-step-07-e02",

              type:
                "equation",

              expression:
                "M(0)=0,\\qquad M(4)=0",
            },

            {
              id:
                "worked-example-ssb-step-07-c01",

              type:
                "callout",

              tone:
                "info",

              title: {
                tr:
                  "Hızlı mühendislik kontrolü",

                en:
                  "Quick engineering check",
              },

              body: {
                tr:
                  "Tepkilerin toplamı uygulanan yüke eşit ve basit mesnetlerde eğilme momenti sıfır. Bu iki kontrol, çözümde temel bir denge veya işaret hatası olup olmadığını hızlıca gösterir.",

                en:
                  "The reactions sum to the applied load and bending moment is zero at the simple supports. These two checks quickly reveal many equilibrium or sign-convention errors.",
              },
            },
          ],
        },
      ],
    },
  ];

export function getWorkedExampleDefinition(
  activityId:
    EntityId,
):
  | WorkedExampleDefinition
  | undefined {
  return workedExampleDefinitions.find(
    (definition) =>
      definition.activityId ===
      activityId,
  );
}

export function getWorkedExampleDefinitions():
  readonly WorkedExampleDefinition[] {
  return workedExampleDefinitions;
}