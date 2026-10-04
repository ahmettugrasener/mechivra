import type {
  EntityId,
} from "@/domain/shared/types";

export interface LocalizedSummaryText {
  readonly tr:
    string;

  readonly en:
    string;
}

export interface BendingSummarySource {
  readonly sourceId:
    EntityId;

  readonly title:
    string;

  readonly authors:
    readonly string[];

  readonly organization:
    string;

  readonly year:
    number;

  readonly role:
    LocalizedSummaryText;
}

export interface BendingModuleSummary {
  readonly capabilities:
    readonly LocalizedSummaryText[];

  readonly assumptions:
    readonly LocalizedSummaryText[];

  readonly limitations:
    readonly LocalizedSummaryText[];

  readonly interpretationRules:
    readonly LocalizedSummaryText[];

  readonly sources:
    readonly BendingSummarySource[];
}

export const bendingModuleSummary:
  BendingModuleSummary =
  {
    capabilities: [
      {
        tr:
          "Statik Engineering Core'dan gelen eğilme momentini kesit davranışına bağlayabilirsin.",

        en:
          "You can connect the bending moment produced by the Statics Engineering Core to cross-section behavior.",
      },

      {
        tr:
          "Dikdörtgen kesitte I = bh³/12 bağıntısını kullanabilir ve genişlik ile yüksekliğin farklı etkilerini açıklayabilirsin.",

        en:
          "You can use I = bh³/12 for a rectangular section and explain why width and height have different effects.",
      },

      {
        tr:
          "σx = -My/I bağıntısıyla nötr eksen, çekme, basma ve maksimum eğilme gerilmesini yorumlayabilirsin.",

        en:
          "You can interpret the neutral axis, tension, compression, and maximum bending stress using σx = -My/I.",
      },

      {
        tr:
          "Bu statikçe belirli kuvvet kontrollü modelde E'nin moment ve gerilmeden farklı olarak sehimi etkilediğini ayırt edebilirsin.",

        en:
          "In this force-controlled statically determinate model, you can distinguish how E affects deflection differently from moment and stress.",
      },

      {
        tr:
          "Maksimum eğilme momenti ile maksimum sehimin her zaman aynı x konumunda oluşmadığını açıklayabilirsin.",

        en:
          "You can explain why maximum bending moment and maximum deflection do not always occur at the same x-location.",
      },

      {
        tr:
          "Tanımlı eğilme gerilmesi ve sehim ölçütlerini birbirinden bağımsız değerlendirebilirsin.",

        en:
          "You can evaluate defined bending-stress and deflection criteria independently.",
      },
    ],

    assumptions: [
      {
        tr:
          "Kiriş basit mesnetlidir: solda mafsal, sağda makara mesnet bulunur.",

        en:
          "The beam is simply supported, with a pin at the left and a roller at the right.",
      },

      {
        tr:
          "Kiriş üzerinde mesnetler arasında tek bir düşey aşağı yönlü noktasal yük vardır.",

        en:
          "The beam carries one vertically downward point load between the supports.",
      },

      {
        tr:
          "Kiriş homojen ve prizmatiktir; kesit geometrisi açıklık boyunca sabittir.",

        en:
          "The beam is homogeneous and prismatic, with constant cross-section geometry along the span.",
      },

      {
        tr:
          "Kesit dikdörtgendir ve eğilme hesabında I = bh³/12 kullanılır.",

        en:
          "The cross-section is rectangular and I = bh³/12 is used for bending calculations.",
      },

      {
        tr:
          "Malzeme doğrusal elastik davranır ve elastisite modülü E açıklık boyunca sabittir.",

        en:
          "The material behaves linearly elastically and elastic modulus E is constant along the span.",
      },

      {
        tr:
          "Deformasyonların küçük olduğu kabul edilir.",

        en:
          "Deformations are assumed to be small.",
      },

      {
        tr:
          "Sehim hesabı temel Euler–Bernoulli kiriş yaklaşımıyla temsil edilir.",

        en:
          "Deflection is represented using the elementary Euler–Bernoulli beam approach.",
      },

      {
        tr:
          "Kirişin öz ağırlığı ve modelde tanımlanmayan diğer yükler hesaba katılmaz.",

        en:
          "Beam self-weight and loads not explicitly defined by the model are neglected.",
      },
    ],

    limitations: [
      {
        tr:
          "Dağıtılmış yükler, birden fazla noktasal yük, uygulanan çift momentler ve farklı mesnet düzenleri bu sürümde çözülmez.",

        en:
          "Distributed loads, multiple point loads, applied couples, and alternative support arrangements are not solved in this version.",
      },

      {
        tr:
          "Plastik davranış ve plastik moment kapasitesi değerlendirilmez.",

        en:
          "Plastic behavior and plastic moment capacity are not evaluated.",
      },

      {
        tr:
          "Yorulma ve tekrarlı yük etkileri değerlendirilmez.",

        en:
          "Fatigue and repeated-loading effects are not evaluated.",
      },

      {
        tr:
          "Burkulma ve stabilite sınır durumları değerlendirilmez.",

        en:
          "Buckling and stability limit states are not evaluated.",
      },

      {
        tr:
          "Birleşimler, delikler, çentikler ve yerel gerilme yığılmaları modellenmez.",

        en:
          "Connections, holes, notches, and local stress concentrations are not modeled.",
      },

      {
        tr:
          "Genel hasar, kırılma veya yapı güvenliği değerlendirmesi yapılmaz.",

        en:
          "The model does not perform a general failure, fracture, or structural-safety assessment.",
      },

      {
        tr:
          "İnce-kiriş yaklaşımının hangi geometrik oranlarda yeterli olduğu yayın öncesi uzman incelemesinde ayrıca sınırlandırılmalıdır.",

        en:
          "The geometric range over which the slender-beam approximation is adequate must be bounded separately during expert review before release.",
      },
    ],

    interpretationRules: [
      {
        tr:
          "Bir gerilme ölçütünün sağlanması, sehim ölçütünün de sağlandığı anlamına gelmez.",

        en:
          "Satisfying a stress criterion does not imply that the deflection criterion is also satisfied.",
      },

      {
        tr:
          "Bir sehim veya gerilme ölçütünün sağlanması tek başına 'kiriş güvenlidir' sonucunu vermez.",

        en:
          "Satisfying a deflection or stress criterion alone does not establish that the beam is 'safe'.",
      },

      {
        tr:
          "PL³/(48EI) yalnız orta noktadan tek noktasal yüklenen basit mesnetli kiriş için kullanılan özel sonuçtur.",

        en:
          "PL³/(48EI) is a special result for a simply supported beam carrying one point load at midspan.",
      },

      {
        tr:
          "Yük orta noktadan ayrıldığında genel tek noktasal yük sehim çözümü kullanılmalıdır.",

        en:
          "When the load moves away from midspan, the general single-point-load deflection solution must be used.",
      },

      {
        tr:
          "Sehim çizimi görsel olarak büyütülür ve normalize edilir; nicel yorumda hesaplanan uzunluk değeri esas alınır.",

        en:
          "The deflected shape is visually exaggerated and normalized; quantitative interpretation must use the calculated displacement value.",
      },

      {
        tr:
          "Gerilme dağılımı görselinin yatay ölçeği göreli temsildir; nicel yorumda MPa değerleri esas alınır.",

        en:
          "The horizontal scale of the stress-distribution graphic is a relative representation; quantitative interpretation must use the MPa values.",
      },
    ],

    sources: [
      {
        sourceId:
          "source-mit-mechanics-lecture-13",

        title:
          "3.11 Mechanics of Materials — Lecture 13",

        authors: [
          "C. Ortiz",
        ],

        organization:
          "Massachusetts Institute of Technology",

        year:
          2003,

        role: {
          tr:
            "Kesit geometrisi, eğilme momenti ve eğilme gerilmesi ilişkileri için bilimsel referans.",

          en:
            "Scientific reference for cross-section geometry, bending moment, and bending-stress relationships.",
        },
      },

      {
        sourceId:
          "source-mit-beam-displacements",

        title:
          "Beam Displacements",

        authors: [
          "David Roylance",
        ],

        organization:
          "MIT OpenCourseWare",

        year:
          2000,

        role: {
          tr:
            "Elastik kiriş yer değiştirmeleri, eğilme rijitliği ve sehim modeli için bilimsel referans.",

          en:
            "Scientific reference for elastic beam displacement, flexural rigidity, and the deflection model.",
        },
      },
    ],
  };