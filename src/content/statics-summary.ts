import type {
  EntityId,
  LocalizedText,
} from "@/domain/shared/types";

export interface StaticsSummaryItem {
  readonly id:
    EntityId;

  readonly text:
    LocalizedText;
}

export interface StaticsSummaryDefinition {
  readonly activityId:
    EntityId;

  readonly capabilities:
    readonly StaticsSummaryItem[];

  readonly assumptions:
    readonly StaticsSummaryItem[];

  readonly limitations:
    readonly StaticsSummaryItem[];

  readonly sourceIds:
    readonly EntityId[];
}

export const staticsSummaryDefinition:
  StaticsSummaryDefinition =
  {
    activityId:
      "activity-ssb-06",

    capabilities: [
      {
        id:
          "summary-capability-reactions",

        text: {
          tr:
            "Basit mesnetli bir kirişte mesnet tepkilerini kuvvet ve moment dengesiyle hesaplayabilirsin.",

          en:
            "You can calculate support reactions of a simply supported beam using force and moment equilibrium.",
        },
      },

      {
        id:
          "summary-capability-load-position",

        text: {
          tr:
            "Noktasal yükün konumu değiştiğinde sol ve sağ mesnet tepkilerinin neden yeniden dağıldığını açıklayabilirsin.",

          en:
            "You can explain why the left and right support reactions redistribute when the point-load position changes.",
        },
      },

      {
        id:
          "summary-capability-shear",

        text: {
          tr:
            "Kesme kuvveti diyagramındaki sabit bölgeleri ve noktasal yükte oluşan sıçramayı oluşturup yorumlayabilirsin.",

          en:
            "You can construct and interpret the constant regions and the jump at the point load in the shear-force diagram.",
        },
      },

      {
        id:
          "summary-capability-moment",

        text: {
          tr:
            "Eğilme momenti diyagramını oluşturabilir, maksimum momenti ve oluştuğu konumu belirleyebilirsin.",

          en:
            "You can construct the bending-moment diagram and identify the maximum moment and its location.",
        },
      },
    ],

    assumptions: [
      {
        id:
          "summary-assumption-2d",

        text: {
          tr:
            "Kiriş ve tüm yükleme iki boyutlu bir düzlemde modellenir.",

          en:
            "The beam and loading are modeled in a two-dimensional plane.",
        },
      },

      {
        id:
          "summary-assumption-supports",

        text: {
          tr:
            "Sol mesnet mafsal, sağ mesnet makara olarak modellenir.",

          en:
            "The left support is modeled as a pin and the right support as a roller.",
        },
      },

      {
        id:
          "summary-assumption-single-load",

        text: {
          tr:
            "Yalnızca mesnetler arasında bulunan tek bir aşağı yönlü noktasal yük kullanılır.",

          en:
            "Only one downward point load located between the supports is considered.",
        },
      },

      {
        id:
          "summary-assumption-determinate",

        text: {
          tr:
            "Sistem statikçe belirlidir; mesnet tepkileri yalnız denge denklemlerinden bulunabilir.",

          en:
            "The system is statically determinate; the support reactions can be obtained from equilibrium equations alone.",
        },
      },

      {
        id:
          "summary-assumption-self-weight",

        text: {
          tr:
            "Kirişin kendi ağırlığı bu modelde ihmal edilir.",

          en:
            "The self-weight of the beam is neglected in this model.",
        },
      },
    ],

    limitations: [
      {
        id:
          "summary-limit-distributed-load",

        text: {
          tr:
            "Yayılı yükler, birden fazla noktasal yük ve dışarıdan uygulanan çift momentler bu sürümde modellenmez.",

          en:
            "Distributed loads, multiple point loads, and externally applied couples are not modeled in this version.",
        },
      },

      {
        id:
          "summary-limit-horizontal-load",

        text: {
          tr:
            "Yatay veya eksenel yükleme bu öğrenme modelinin kapsamı dışındadır.",

          en:
            "Horizontal or axial loading is outside the scope of this learning model.",
        },
      },

      {
        id:
          "summary-limit-material",

        text: {
          tr:
            "Bu modül denge ve iç kuvvetlere odaklanır; gerilme, malzeme davranışı ve sehim hesabı burada yapılmaz.",

          en:
            "This module focuses on equilibrium and internal actions; stress, material behavior, and deflection are not calculated here.",
        },
      },

      {
        id:
          "summary-limit-load-support",

        text: {
          tr:
            "Etkileşimli modelde noktasal yük doğrudan mesnet üzerine yerleştirilmez; yük konumu 0 < a < L aralığında tutulur.",

          en:
            "In the interactive model, the point load is not placed directly on a support; its position is restricted to 0 < a < L.",
        },
      },

      {
        id:
          "summary-limit-generalization",

        text: {
          tr:
            "Bu sonuçlar yalnız tanımlanan basit mesnetli, tek noktasal yüklü kiriş modeli için geçerlidir; daha karmaşık kiriş sistemlerine doğrudan genellenmemelidir.",

          en:
            "These results apply to the defined simply supported beam with a single point load and should not be directly generalized to more complex beam systems.",
        },
      },
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],
  };