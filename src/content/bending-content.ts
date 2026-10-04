import type {
  LearningContentBlock,
} from "@/domain/learning/types";

import type {
  EntityId,
} from "@/domain/shared/types";

export const BENDING_CONTENT_VERSION =
  "1.1.0" as const;

export interface BendingActivityContentDefinition {
  readonly activityId:
    EntityId;

  readonly contentVersion:
    typeof BENDING_CONTENT_VERSION;

  readonly sourceIds:
    readonly EntityId[];

  readonly contentBlocks:
    readonly LearningContentBlock[];
}

const bendingActivityContentDefinitions:
  readonly BendingActivityContentDefinition[] =
  [
    {
      activityId:
        "activity-bending-01",

      contentVersion:
        BENDING_CONTENT_VERSION,

      sourceIds: [
        "source-mit-mechanics-lecture-13",
      ],

      contentBlocks: [
        {
          id:
            "block-bending-01-heading-transition",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Statik nerede bitti, mukavemet nerede başlıyor?",

            en:
              "Where does statics end and mechanics of materials begin?",
          },
        },

        {
          id:
            "block-bending-01-paragraph-moment",

          type:
            "paragraph",

          text: {
            tr:
              "Statik modülünde dış yüklerden mesnet tepkilerine, kesme kuvvetine ve eğilme momentine ulaştın. Mukavemet modülünde aynı fiziksel kiriş durumunu bir adım ileri taşıyoruz: bulunan eğilme momentinin kesitte nasıl normal gerilme oluşturduğunu ve kirişin ne kadar sehim yaptığını inceleyeceğiz.",

            en:
              "In the Statics module, you moved from external loading to support reactions, shear force, and bending moment. In this module, we carry the same physical beam state one step further: we examine how the resulting bending moment produces normal stress in the cross-section and how much the beam deflects.",
          },
        },

        {
          id:
            "block-bending-01-callout-shared-state",

          type:
            "callout",

          tone:
            "engineering",

          title: {
            tr:
              "Aynı moment, aynı fiziksel durum",

            en:
              "Same moment, same physical state",
          },

          body: {
            tr:
              "Mechivra eğilme momentini Mukavemet tarafında yeniden hesaplamaz. Statik Engineering Core tarafından bulunan moment sonucu doğrudan Eğilme modelinin girdisi olur.",

            en:
              "Mechivra does not recalculate bending moment inside the Mechanics of Materials model. The moment obtained from the Statics Engineering Core becomes an input to the Bending model.",
          },
        },

        {
          id:
            "block-bending-01-paragraph-question",

          type:
            "paragraph",

          text: {
            tr:
              "Aynı eğilme momentine maruz kalan iki kirişin gerilmesi ve sehimi aynı olmak zorunda değildir. Kesit genişliği, kesit yüksekliği ve elastisite modülü yapısal cevabı değiştirir. Bu modülün ana sorusu budur: yük aynıyken geometri ve malzeme davranışı sonucu nasıl değiştirir?",

            en:
              "Two beams subjected to the same bending moment do not necessarily have the same stress or deflection. Section width, section height, and elastic modulus change the structural response. This is the central question of the module: with the same loading, how do geometry and material behavior change the result?",
          },
        },
      ],
    },

    {
      activityId:
        "activity-bending-02",

      contentVersion:
        BENDING_CONTENT_VERSION,

      sourceIds: [
        "source-mit-beam-displacements",
        "source-mit-mechanics-lecture-13",
      ],

      contentBlocks: [
        {
          id:
            "block-bending-02-heading-section",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Dikdörtgen kesitte geometrinin rolü",

            en:
              "The role of geometry in a rectangular section",
          },
        },

        {
          id:
            "block-bending-02-paragraph-i",

          type:
            "paragraph",

          text: {
            tr:
              "Dikdörtgen bir kesitin eğilmeye karşı geometrik davranışını belirleyen temel büyüklüklerden biri alan atalet momentidir. Genişliği b, yüksekliği h olan kesit için nötr eksene göre alan atalet momenti aşağıdaki bağıntıyla hesaplanır.",

            en:
              "One of the key geometric quantities governing the bending response of a rectangular section is the second moment of area. For a section of width b and height h, the second moment of area about the neutral axis is calculated as follows.",
          },
        },

        {
          id:
            "block-bending-02-equation-i",

          type:
            "equation",

          expression:
            "I = \\frac{b h^3}{12}",

          description: {
            tr:
              "Dikdörtgen kesitin nötr eksene göre alan atalet momenti.",

            en:
              "Second moment of area of the rectangular section about its neutral axis.",
          },
        },

        {
          id:
            "block-bending-02-callout-height",

          type:
            "callout",

          tone:
            "engineering",

          title: {
            tr:
              "b ile h eşdeğer değildir",

            en:
              "b and h are not equivalent",
          },

          body: {
            tr:
              "I, genişlikle doğrusal; yükseklikle kübik değişir. Bu nedenle kesiti yalnızca 'daha büyük' yapmak değil, hangi boyutu artırdığın da önemlidir.",

            en:
              "I varies linearly with width but with the cube of height. Therefore, it matters not only that a section becomes larger, but which dimension is increased.",
          },
        },

        {
          id:
            "block-bending-02-heading-stress",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Eğilme momentinden normal gerilmeye",

            en:
              "From bending moment to normal stress",
          },
        },

        {
          id:
            "block-bending-02-paragraph-stress",

          type:
            "paragraph",

          text: {
            tr:
              "Doğrusal elastik temel kiriş eğilmesi modelinde boyuna normal gerilme, nötr eksene olan y uzaklığıyla doğrusal değişir. Nötr eksende gerilme sıfırdır; mutlak değer en dış liflerde en büyüktür.",

            en:
              "In the elementary linear-elastic beam-bending model, longitudinal normal stress varies linearly with distance y from the neutral axis. Stress is zero at the neutral axis and reaches its largest absolute value at the extreme fibers.",
          },
        },

        {
          id:
            "block-bending-02-equation-stress",

          type:
            "equation",

          expression:
            "\\sigma_x = -\\frac{M y}{I}",

          description: {
            tr:
              "Mechivra işaret kuralında pozitif y nötr eksenden yukarı yönü gösterir.",

            en:
              "In the Mechivra sign convention, positive y is upward from the neutral axis.",
          },
        },

        {
          id:
            "block-bending-02-equation-max-stress",

          type:
            "equation",

          expression:
            "|\\sigma|_{\\max} = \\frac{|M| (h/2)}{I}",

          description: {
            tr:
              "Dikdörtgen kesitte maksimum normal gerilme büyüklüğü dış liflerde oluşur.",

            en:
              "For a rectangular section, the maximum normal-stress magnitude occurs at the extreme fibers.",
          },
        },

        {
          id:
            "block-bending-02-callout-sign",

          type:
            "callout",

          tone:
            "info",

          title: {
            tr:
              "İşaret kuralı",

            en:
              "Sign convention",
          },

          body: {
            tr:
              "Pozitif sagging eğilme momentinde üst lifler basma, alt lifler çekme gerilmesindedir. Mechivra'da çekme pozitif, basma negatif normal gerilme olarak gösterilir.",

            en:
              "For a positive sagging bending moment, the top fibers are in compression and the bottom fibers are in tension. Mechivra displays tensile normal stress as positive and compressive normal stress as negative.",
          },
        },

        {
          id:
            "block-bending-02-heading-e",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Elastisite modülü neden gerilmeyi değiştirmiyor?",

            en:
              "Why does elastic modulus not change the bending stress here?",
          },
        },

        {
          id:
            "block-bending-02-paragraph-e",

          type:
            "paragraph",

          text: {
            tr:
              "Bu modüldeki homojen, kuvvet kontrollü ve statikçe belirli kirişte mesnet tepkileri ve eğilme momenti denge tarafından belirlenir. Aynı yük ve aynı kesit geometrisi korunurken E'yi değiştirmek M veya eğilme gerilmesini doğrudan değiştirmez. Ancak eğilme rijitliği EI değiştiği için sehim değişir.",

            en:
              "For the homogeneous, force-controlled, statically determinate beam used in this module, support reactions and bending moment are determined by equilibrium. If loading and section geometry remain unchanged, changing E does not directly change M or the bending stress. It does change flexural rigidity EI, so deflection changes.",
          },
        },

        {
          id:
            "block-bending-02-equation-centered-deflection",

          type:
            "equation",

          expression:
            "|\\delta|_{\\max} = \\frac{P L^3}{48 E I}",

          description: {
            tr:
              "Bu ifade yalnız ortasından noktasal yüklenen basit mesnetli kirişin özel durumudur.",

            en:
              "This expression is the special case for a simply supported beam with a point load at midspan.",
          },
        },

        {
          id:
            "block-bending-02-warning-deflection",

          type:
            "callout",

          tone:
            "warning",

          title: {
            tr:
              "Özel formülü genelleme",

            en:
              "Do not generalize the special-case formula",
          },

          body: {
            tr:
              "Yük orta noktadan ayrıldığında PL³/(48EI) bağıntısı kullanılmaz. Mechivra bu durumda tek noktasal yük için genel parçalı sehim çözümünü kullanır.",

            en:
              "When the load moves away from midspan, PL³/(48EI) is not used. Mechivra instead uses the general piecewise deflection solution for a single point load.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-bending-03",

      contentVersion:
        BENDING_CONTENT_VERSION,

      sourceIds: [
        "source-mit-beam-displacements",
        "source-mit-mechanics-lecture-13",
      ],

      contentBlocks: [
        {
          id:
            "block-bending-03-heading-predict",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Önce tahmin et",

            en:
              "Predict before calculating",
          },
        },

        {
          id:
            "block-bending-03-paragraph-predict",

          type:
            "paragraph",

          text: {
            tr:
              "Aynı açıklık, aynı noktasal yük, aynı yük konumu, aynı kesit genişliği ve aynı malzeme korunuyor. Yalnız dikdörtgen kesitin yüksekliği artırılıyor. Alan atalet momentinin, maksimum eğilme gerilmesinin ve maksimum sehimin hangi yönde değişeceğini hesaplamadan önce tahmin et.",

            en:
              "Keep the same span, point load, load position, section width, and material. Only increase the height of the rectangular section. Before calculating, predict the direction of change in second moment of area, maximum bending stress, and maximum deflection.",
          },
        },

        {
          id:
            "block-bending-03-callout-no-calculation",

          type:
            "callout",

          tone:
            "engineering",

          title: {
            tr:
              "Henüz sayı hesaplama",

            en:
              "Do not calculate yet",
          },

          body: {
            tr:
              "Bu adımda amaç formüle sayı koymak değil, geometrik değişikliğin fiziksel sonucu hakkında bir öngörü oluşturmaktır. Tahminini yaptıktan sonra etkileşimli modelle sınayacaksın.",

            en:
              "The goal at this stage is not to substitute numbers into equations, but to form a physical prediction about the effect of the geometric change. You will test that prediction with the interactive model.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-bending-04",

      contentVersion:
        BENDING_CONTENT_VERSION,

      sourceIds: [
        "source-mit-beam-displacements",
        "source-mit-mechanics-lecture-13",
      ],

      contentBlocks: [
        {
          id:
            "block-bending-04-heading-explore",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Tek değişkeni değiştir, sonucu izle",

            en:
              "Change one variable and observe the result",
          },
        },

        {
          id:
            "block-bending-04-paragraph-height",

          type:
            "paragraph",

          text: {
            tr:
              "Önce yalnız kesit yüksekliğini değiştir. I, maksimum eğilme gerilmesi ve maksimum sehim değerlerini birlikte izle. Yük ve malzeme aynı kalırken geometrinin etkisini ayırmaya çalış.",

            en:
              "First change only the section height. Observe I, maximum bending stress, and maximum deflection together. With loading and material held constant, isolate the effect of geometry.",
          },
        },

        {
          id:
            "block-bending-04-paragraph-width",

          type:
            "paragraph",

          text: {
            tr:
              "Ardından başlangıç durumuna dön ve yalnız kesit genişliğini değiştir. Aynı miktardaki genişlik ve yükseklik değişikliklerinin neden aynı sonucu vermediğini karşılaştır.",

            en:
              "Then return to the initial state and change only the section width. Compare why equal changes in width and height do not produce the same result.",
          },
        },

        {
          id:
            "block-bending-04-paragraph-e",

          type:
            "paragraph",

          text: {
            tr:
              "Son olarak yalnız elastisite modülünü değiştir. Eğilme momenti, gerilme ve sehim değerlerinden hangilerinin değiştiğine özellikle dikkat et.",

            en:
              "Finally, change only the elastic modulus. Pay particular attention to which of bending moment, stress, and deflection actually change.",
          },
        },

        {
          id:
            "block-bending-04-callout-location",

          type:
            "callout",

          tone:
            "engineering",

          title: {
            tr:
              "Maksimum moment ve maksimum sehim aynı nokta mı?",

            en:
              "Do maximum moment and maximum deflection occur at the same location?",
          },

          body: {
            tr:
              "Yük orta noktadaysa iki konum çakışabilir. Yük merkezden uzaklaştığında ise maksimum eğilme momentinin konumu ile maksimum sehim konumu aynı olmak zorunda değildir. Yük konumunu değiştirirken iki işareti ayrı izle.",

            en:
              "For a midspan load, the two locations may coincide. When the load moves away from midspan, the location of maximum bending moment and the location of maximum deflection do not have to be the same. Track the two markers separately as the load position changes.",
          },
        },

        {
          id:
            "block-bending-04-warning-criteria",

          type:
            "callout",

          tone:
            "warning",

          title: {
            tr:
              "Kriter sonucu, genel güvenlik hükmü değildir",

            en:
              "A criterion result is not a general safety verdict",
          },

          body: {
            tr:
              "Gerilme veya sehim sınırının sağlanması yalnız o tanımlı ölçütün sonucudur. Plastikleşme, yorulma, burkulma, birleşimler, yerel gerilme yığılmaları ve diğer hasar türleri bu modelde değerlendirilmez.",

            en:
              "Satisfying a stress or deflection limit is only a result for that defined criterion. Plasticity, fatigue, buckling, connections, local stress concentrations, and other failure modes are not evaluated by this model.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-bending-05",

      contentVersion:
        BENDING_CONTENT_VERSION,

      sourceIds: [
        "source-mit-beam-displacements",
        "source-mit-mechanics-lecture-13",
      ],

      contentBlocks: [
        {
          id:
            "block-bending-05-heading-problem",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Yeni bir kiriş durumunu değerlendir",

            en:
              "Evaluate a new beam case",
          },
        },

        {
          id:
            "block-bending-05-paragraph-problem",

          type:
            "paragraph",

          text: {
            tr:
              "Aşağıdaki kiriş, önceki çözümlü örnekten farklı bir fiziksel durumdur. Kiriş basit mesnetlidir ve orta noktasında aşağı yönlü tek bir noktasal yük taşır. Kesit homojen, prizmatik ve dikdörtgendir.",

            en:
              "The beam below is a different physical case from the worked example. It is simply supported and carries one downward point load at midspan. The section is homogeneous, prismatic, and rectangular.",
          },
        },

        {
          id:
            "block-bending-05-equation-givens",

          type:
            "equation",

          expression:
            "L=3\\ \\mathrm{m},\\quad P=8\\ \\mathrm{kN},\\quad a=1.5\\ \\mathrm{m}",

          description: {
            tr:
              "Kiriş ve yük verileri.",

            en:
              "Beam and loading data.",
          },
        },

        {
          id:
            "block-bending-05-equation-section",

          type:
            "equation",

          expression:
            "b=80\\ \\mathrm{mm},\\quad h=160\\ \\mathrm{mm},\\quad E=70\\ \\mathrm{GPa}",

          description: {
            tr:
              "Kesit ve elastik malzeme verileri.",

            en:
              "Section and elastic-material data.",
          },
        },

        {
          id:
            "block-bending-05-equation-limits",

          type:
            "equation",

          expression:
            "|\\sigma|_{\\mathrm{limit}}=20\\ \\mathrm{MPa},\\quad |\\delta|_{\\mathrm{limit}}=2.0\\ \\mathrm{mm}",

          description: {
            tr:
              "Bu problem için tanımlanan iki ayrı değerlendirme sınırı.",

            en:
              "The two independent evaluation limits defined for this problem.",
          },
        },

        {
          id:
            "block-bending-05-paragraph-tasks",

          type:
            "paragraph",

          text: {
            tr:
              "Alan atalet momentini I, maksimum eğilme momentini, maksimum eğilme gerilmesini ve maksimum sehimi hesapla. Ardından gerilme ölçütünün ve sehim ölçütünün ayrı ayrı sağlanıp sağlanmadığını belirle.",

            en:
              "Calculate the second moment of area I, maximum bending moment, maximum bending stress, and maximum deflection. Then determine separately whether the stress criterion and the deflection criterion are satisfied.",
          },
        },

        {
          id:
            "block-bending-05-callout-no-global-verdict",

          type:
            "callout",

          tone:
            "info",

          title: {
            tr:
              "İki kriteri ayrı tut",

            en:
              "Keep the two criteria separate",
          },

          body: {
            tr:
              "Bir ölçütün sağlanması diğerinin de sağlandığı anlamına gelmez. Sonucu tek bir 'güvenli/güvensiz' etiketine indirgeme.",

            en:
              "Satisfying one criterion does not imply that the other is also satisfied. Do not reduce the result to a single 'safe/unsafe' label.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-bending-06",

      contentVersion:
        BENDING_CONTENT_VERSION,

      sourceIds: [
        "source-mit-beam-displacements",
        "source-mit-mechanics-lecture-13",
      ],

      contentBlocks: [
        {
          id:
            "block-bending-06-heading-summary",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Eğilme davranışını tek zincirde düşün",

            en:
              "Think of bending behavior as one connected chain",
          },
        },

        {
          id:
            "block-bending-06-paragraph-chain",

          type:
            "paragraph",

          text: {
            tr:
              "Bu modülde dış yükten başlayan fiziksel zinciri Statik sonucuna, kesit geometrisine, normal gerilmeye ve sehime bağladın. Yükleme M(x)'i belirler; kesit geometrisi I'yi belirler; M ve I gerilme dağılımını etkiler; E ve I ise sehim davranışında birlikte rol oynar.",

            en:
              "In this module, you connected the physical chain from external loading to the Statics result, cross-section geometry, normal stress, and deflection. Loading determines M(x); section geometry determines I; M and I influence the stress distribution; and E and I act together in the deflection response.",
          },
        },

        {
          id:
            "block-bending-06-callout-key-distinction",

          type:
            "callout",

          tone:
            "engineering",

          title: {
            tr:
              "Ana kavramsal ayrım",

            en:
              "Key conceptual distinction",
          },

          body: {
            tr:
              "Bu statikçe belirli, kuvvet kontrollü modelde E'yi değiştirmek aynı yük ve geometri için eğilme momentini veya eğilme gerilmesini değiştirmez; sehimi değiştirir. Kesit geometrisini değiştirmek ise hem gerilme hem sehim üzerinde etkili olabilir.",

            en:
              "In this statically determinate, force-controlled model, changing E does not change bending moment or bending stress for the same loading and geometry; it changes deflection. Changing the section geometry can affect both stress and deflection.",
          },
        },

        {
          id:
            "block-bending-06-heading-assumptions",

          type:
            "heading",

          level:
            2,

          text: {
            tr:
              "Bu model hangi çerçevede geçerli?",

            en:
              "Within what framework is this model valid?",
          },
        },

        {
          id:
            "block-bending-06-paragraph-assumptions",

          type:
            "paragraph",

          text: {
            tr:
              "İlk sürüm; homojen, prizmatik, sabit dikdörtgen kesitli, doğrusal elastik ve küçük deformasyonlu kiriş davranışını temsil eder. Tek düşey noktasal yüklü basit mesnetli kiriş kullanılır. Temel sehim modeli Euler–Bernoulli yaklaşımına dayanır.",

            en:
              "The first version represents a homogeneous, prismatic beam with a constant rectangular section, linear-elastic behavior, and small deformation. It uses a simply supported beam carrying one vertical point load. The elementary deflection model follows the Euler–Bernoulli approach.",
          },
        },

        {
          id:
            "block-bending-06-warning-limits",

          type:
            "callout",

          tone:
            "warning",

          title: {
            tr:
              "Model sınırlarını aşma",

            en:
              "Do not exceed the model limits",
          },

          body: {
            tr:
              "Plastik analiz, yorulma, burkulma, birleşimler, yerel gerilme yığılmaları ve diğer hasar türleri bu modelin kapsamı dışındadır. Bir gerilme veya sehim kriterinin sağlanması, yapının genel olarak güvenli olduğu anlamına gelmez.",

            en:
              "Plastic analysis, fatigue, buckling, connections, local stress concentrations, and other failure modes are outside this model. Satisfying a stress or deflection criterion does not establish that the structure is generally safe.",
          },
        },

        {
          id:
            "block-bending-06-warning-special-formula",

          type:
            "callout",

          tone:
            "info",

          title: {
            tr:
              "Merkez yük formülünü hatırla",

            en:
              "Remember the midspan-load formula limitation",
          },

          body: {
            tr:
              "PL³/(48EI) yalnız orta noktadaki noktasal yük için özel bir sonuçtur. Yük konumu değiştiğinde genel sehim çözümü kullanılmalıdır. Ayrıca merkez dışı yükte maksimum moment ve maksimum sehim farklı x konumlarında oluşabilir.",

            en:
              "PL³/(48EI) is a special result for a point load at midspan. When the load position changes, the general deflection solution must be used. For an off-center load, maximum moment and maximum deflection can also occur at different x-locations.",
          },
        },
      ],
    },
  ];

export function getBendingActivityContentDefinition(
  activityId:
    EntityId,
):
  | BendingActivityContentDefinition
  | undefined {
  return bendingActivityContentDefinitions.find(
    (definition) =>
      definition.activityId ===
      activityId,
  );
}

export function getBendingActivityContentBlocks(
  activityId:
    EntityId,
):
  readonly LearningContentBlock[] {
  return (
    getBendingActivityContentDefinition(
      activityId,
    )?.contentBlocks ??
    []
  );
}

export function getBendingActivityContentDefinitions():
  readonly BendingActivityContentDefinition[] {
  return bendingActivityContentDefinitions;
}