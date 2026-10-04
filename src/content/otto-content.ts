export const OTTO_CONTENT_VERSION =
  "1.1.0" as const;

export interface OttoLocalizedText {
  readonly tr:
    string;

  readonly en:
    string;
}

export interface OttoHeadingContentBlock {
  readonly id:
    string;

  readonly type:
    "heading";

  readonly level:
    2 | 3 | 4;

  readonly text:
    OttoLocalizedText;
}

export interface OttoParagraphContentBlock {
  readonly id:
    string;

  readonly type:
    "paragraph";

  readonly text:
    OttoLocalizedText;
}

export interface OttoEquationContentBlock {
  readonly id:
    string;

  readonly type:
    "equation";

  readonly expression:
    string;

  readonly description?:
    OttoLocalizedText;
}

export interface OttoCalloutContentBlock {
  readonly id:
    string;

  readonly type:
    "callout";

  readonly tone:
    "info" |
    "engineering" |
    "warning";

  readonly text:
    OttoLocalizedText;
}

export type OttoContentBlock =
  | OttoHeadingContentBlock
  | OttoParagraphContentBlock
  | OttoEquationContentBlock
  | OttoCalloutContentBlock;

export interface OttoActivityContentDefinition {
  readonly activityId:
    string;

  readonly version:
    typeof OTTO_CONTENT_VERSION;

  readonly sourceIds:
    readonly string[];

  readonly blocks:
    readonly OttoContentBlock[];
}

const SOURCE_IDS = [
  "source-mit-otto-cycle",
] as const;

const definitions:
  readonly OttoActivityContentDefinition[] =
  [
    {
      activityId:
        "activity-otto-01",

      version:
        OTTO_CONTENT_VERSION,

      sourceIds:
        SOURCE_IDS,

      blocks: [
        {
          id:
            "block-otto-01-heading-model",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Bir motor resmi değil, ideal bir termodinamik model",

            en:
              "Not a picture of an engine, but an ideal thermodynamic model",
          },
        },

        {
          id:
            "block-otto-01-paragraph-purpose",

          type:
            "paragraph",

          text: {
            tr:
              "İdeal Otto çevrimi; sıcaklık, basınç, özgül hacim, ısı ve iş arasındaki ilişkileri kapalı bir çevrim üzerinde inceleyen basitleştirilmiş bir modeldir. Bu modülde amaç gerçek bir motorun bütün ayrıntılarını taklit etmek değil, temel termodinamik ilişkileri açık biçimde görmektir.",

            en:
              "The ideal Otto cycle is a simplified closed-cycle model used to examine relationships among temperature, pressure, specific volume, heat, and work. The purpose of this module is not to reproduce every detail of a real engine, but to make the fundamental thermodynamic relationships explicit.",
          },
        },

        {
          id:
            "block-otto-01-callout-real-engine",

          type:
            "callout",

          tone:
            "warning",

          text: {
            tr:
              "İdeal Otto çevriminin dört süreci, gerçek dört zamanlı motorun emme–sıkıştırma–iş–egzoz zamanlarıyla bire bir aynı değildir. Özellikle 4 → 1 sürecini doğrudan “egzoz zamanı” olarak yorumlama.",

            en:
              "The four processes of the ideal Otto cycle are not identical to the intake–compression–power–exhaust strokes of a real four-stroke engine. In particular, do not interpret process 4 → 1 simply as the exhaust stroke.",
          },
        },

        {
          id:
            "block-otto-01-heading-assumptions",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Bu ilk model hangi kabulleri yapıyor?",

            en:
              "What assumptions does this first model make?",
          },
        },

        {
          id:
            "block-otto-01-paragraph-assumptions",

          type:
            "paragraph",

          text: {
            tr:
              "Model sabit kütleli hava-standardı çevrim, ideal gaz ve sabit özgül ısı kabullerini kullanır. Gaz özellikleri tutarlı tek bir özellik setinden gelir; R, cp, cv ve γ birbirinden bağımsız kullanıcı girdileri değildir.",

            en:
              "The model uses a fixed-mass air-standard cycle, an ideal gas, and constant specific heats. Gas properties come from one internally consistent property set; R, cp, cv, and γ are not independent user inputs.",
          },
        },

        {
          id:
            "block-otto-01-callout-inputs",

          type:
            "callout",

          tone:
            "engineering",

          text: {
            tr:
              "İlk sürümün fiziksel girdileri: sıkıştırma oranı r, başlangıç mutlak sıcaklığı T₁, başlangıç mutlak basıncı p₁ ve özgül ısı girişi qin. Otto modeli mutlak sıcaklık ve mutlak basınç ister.",

            en:
              "The physical inputs of the first version are compression ratio r, initial absolute temperature T₁, initial absolute pressure p₁, and specific heat input qin. The Otto model requires absolute temperature and absolute pressure.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-otto-02",

      version:
        OTTO_CONTENT_VERSION,

      sourceIds:
        SOURCE_IDS,

      blocks: [
        {
          id:
            "block-otto-02-heading-processes",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Dört durum, dört ideal süreç",

            en:
              "Four states, four ideal processes",
          },
        },

        {
          id:
            "block-otto-02-paragraph-sequence",

          type:
            "paragraph",

          text: {
            tr:
              "Çevrim 1 → 2 izentropik sıkıştırma, 2 → 3 sabit hacimde ısı eklenmesi, 3 → 4 izentropik genleşme ve 4 → 1 sabit hacimde ısı atılması süreçlerinden oluşur.",

            en:
              "The cycle consists of 1 → 2 isentropic compression, 2 → 3 constant-volume heat addition, 3 → 4 isentropic expansion, and 4 → 1 constant-volume heat rejection.",
          },
        },

        {
          id:
            "block-otto-02-heading-state-12",

          type:
            "heading",

          level:
            4,

          text: {
            tr:
              "1 → 2: İzentropik sıkıştırma",

            en:
              "1 → 2: Isentropic compression",
          },
        },

        {
          id:
            "block-otto-02-equation-t2",

          type:
            "equation",

          expression:
            "T_2 = T_1 r^{\\gamma-1}",

          description: {
            tr:
              "Sıkıştırma oranı arttıkça, diğer kabuller sabitken sıkıştırma sonu sıcaklığı artar.",

            en:
              "As compression ratio increases, the end-of-compression temperature increases when the other assumptions are unchanged.",
          },
        },

        {
          id:
            "block-otto-02-equation-p2",

          type:
            "equation",

          expression:
            "p_2 = p_1 r^{\\gamma}",

          description: {
            tr:
              "İzentropik sıkıştırmada basınç da artar.",

            en:
              "Pressure also rises during isentropic compression.",
          },
        },

        {
          id:
            "block-otto-02-heading-state-23",

          type:
            "heading",

          level:
            4,

          text: {
            tr:
              "2 → 3: Sabit hacimde ısı eklenmesi",

            en:
              "2 → 3: Constant-volume heat addition",
          },
        },

        {
          id:
            "block-otto-02-equation-t3",

          type:
            "equation",

          expression:
            "T_3 = T_2 + \\frac{q_{in}}{c_v}",

          description: {
            tr:
              "Sabit cv modelinde eklenen özgül ısı, sıcaklık artışını belirler.",

            en:
              "In the constant-cv model, the specific heat input determines the temperature rise.",
          },
        },

        {
          id:
            "block-otto-02-equation-p3",

          type:
            "equation",

          expression:
            "p_3 = p_2 \\frac{T_3}{T_2}",

          description: {
            tr:
              "Özgül hacim sabitken ideal gaz bağıntısı nedeniyle basınç sıcaklıkla birlikte değişir.",

            en:
              "At constant specific volume, pressure changes with temperature according to the ideal-gas relation.",
          },
        },

        {
          id:
            "block-otto-02-heading-state-34",

          type:
            "heading",

          level:
            4,

          text: {
            tr:
              "3 → 4: İzentropik genleşme",

            en:
              "3 → 4: Isentropic expansion",
          },
        },

        {
          id:
            "block-otto-02-equation-t4",

          type:
            "equation",

          expression:
            "T_4 = \\frac{T_3}{r^{\\gamma-1}}",

          description: {
            tr:
              "Genleşme sırasında sıcaklık ve basınç düşerken özgül hacim artar.",

            en:
              "During expansion, temperature and pressure decrease while specific volume increases.",
          },
        },

        {
          id:
            "block-otto-02-heading-state-41",

          type:
            "heading",

          level:
            4,

          text: {
            tr:
              "4 → 1: Sabit hacimde ısı atılması",

            en:
              "4 → 1: Constant-volume heat rejection",
          },
        },

        {
          id:
            "block-otto-02-equation-qout",

          type:
            "equation",

          expression:
            "q_{out} = c_v\\left(T_4-T_1\\right)",

          description: {
            tr:
              "Buradaki qout çevrimden atılan özgül ısının pozitif büyüklüğü olarak kullanılır.",

            en:
              "Here qout is used as the positive magnitude of the specific heat rejected from the cycle.",
          },
        },

        {
          id:
            "block-otto-02-callout-specific-volume",

          type:
            "callout",

          tone:
            "engineering",

          text: {
            tr:
              "Bu modülde v özgül hacimdir ve birimi m³/kg'dır. Bu nedenle çevrim grafiği özgül hacim kullanıyorsa eksen p–v diye adlandırılmalıdır; P–V ile karıştırılmamalıdır.",

            en:
              "In this module, v is specific volume with units of m³/kg. Therefore, when the cycle graph uses specific volume, its axes must be labeled p–v and must not be confused with P–V.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-otto-03",

      version:
        OTTO_CONTENT_VERSION,

      sourceIds:
        SOURCE_IDS,

      blocks: [
        {
          id:
            "block-otto-03-heading-predict",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Önce tahmin et",

            en:
              "Predict before calculating",
          },
        },

        {
          id:
            "block-otto-03-paragraph-predict",

          type:
            "paragraph",

          text: {
            tr:
              "T₁, p₁, qin ve aynı sabit özellikli gaz modeli korunurken yalnız sıkıştırma oranı r artırılıyor. Hesaplamayı çalıştırmadan önce ideal ısıl verimin nasıl değişeceğini tahmin et.",

            en:
              "Keep T₁, p₁, qin, and the same constant-property gas model unchanged while increasing only compression ratio r. Before running the calculation, predict how the ideal thermal efficiency will change.",
          },
        },

        {
          id:
            "block-otto-03-callout-no-answer",

          type:
            "callout",

          tone:
            "info",

          text: {
            tr:
              "Bu adımda amaç formüle hemen sayı koymak değil, sıkıştırma oranı ile ideal çevrim performansı arasında beklediğin yönü belirlemektir.",

            en:
              "The purpose of this step is not to substitute numbers immediately, but to decide what direction of change you expect between compression ratio and ideal-cycle performance.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-otto-04",

      version:
        OTTO_CONTENT_VERSION,

      sourceIds:
        SOURCE_IDS,

      blocks: [
        {
          id:
            "block-otto-04-heading-explore",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Tek değişkeni değiştir, bütün çevrimi izle",

            en:
              "Change one variable and observe the whole cycle",
          },
        },

        {
          id:
            "block-otto-04-paragraph-r",

          type:
            "paragraph",

          text: {
            tr:
              "Önce yalnız sıkıştırma oranı r'yi değiştir. Durum 2 ve 3'teki sıcaklık ve basınç değişimlerini, özgül hacim oranını, net işi ve ideal ısıl verimi birlikte gözlemle.",

            en:
              "First change only compression ratio r. Observe together the temperature and pressure changes at states 2 and 3, the specific-volume ratio, net work, and ideal thermal efficiency.",
          },
        },

        {
          id:
            "block-otto-04-paragraph-qin",

          type:
            "paragraph",

          text: {
            tr:
              "Sonra r ve gaz özelliklerini sabit tutup yalnız qin değerini değiştir. Sıcaklıkların, ısı atımının ve net işin nasıl değiştiğini; ideal verimin ise hangi değişkene bağlı kaldığını karşılaştır.",

            en:
              "Then keep r and the gas properties fixed and change only qin. Compare how temperatures, rejected heat, and net work change, and identify which variable the ideal efficiency continues to depend on.",
          },
        },

        {
          id:
            "block-otto-04-equation-efficiency",

          type:
            "equation",

          expression:
            "\\eta_{Otto} = 1 - \\frac{1}{r^{\\gamma-1}}",

          description: {
            tr:
              "Bu bağıntı sabit özgül ısı kullanılan ideal hava-standardı Otto modeli içindir.",

            en:
              "This relation belongs to the constant-specific-heat ideal air-standard Otto model.",
          },
        },

        {
          id:
            "block-otto-04-callout-interpret",

          type:
            "callout",

          tone:
            "warning",

          text: {
            tr:
              "İdeal modelde r artınca verimin artması, gerçek motorda sıkıştırma oranının sınırsız artırılabileceği veya gerçek motor veriminin aynı bağıntıyla tahmin edilebileceği anlamına gelmez.",

            en:
              "An increase in efficiency with r in the ideal model does not mean that compression ratio can be increased without limit in a real engine or that real-engine efficiency can be predicted by the same relation.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-otto-05",

      version:
        OTTO_CONTENT_VERSION,

      sourceIds:
        SOURCE_IDS,

      blocks: [
        {
          id:
            "block-otto-05-heading-problem",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Yeni bir Otto çevrimi hesapla",

            en:
              "Calculate a new Otto cycle",
          },
        },

        {
          id:
            "block-otto-05-paragraph-data",

          type:
            "paragraph",

          text: {
            tr:
              "İdeal hava-standardı, sabit özgül ısı modelinde r = 6, T₁ = 320 K, p₁ = 120 kPa ve qin = 600 kJ/kg alınsın. Gaz özellik seti R = 287 J/(kg·K) ve γ = 1,4 değerlerini kullanıyor.",

            en:
              "For the ideal air-standard constant-specific-heat model, use r = 6, T₁ = 320 K, p₁ = 120 kPa, and qin = 600 kJ/kg. The gas property set uses R = 287 J/(kg·K) and γ = 1.4.",
          },
        },

        {
          id:
            "block-otto-05-paragraph-task",

          type:
            "paragraph",

          text: {
            tr:
              "Durum 2 ve 3 sıcaklıklarını, gerekli durum basınçlarını ve özgül hacimleri hesapla. Ardından özgül ısı atımını qout, net özgül işi wnet ve ideal ısıl verimi η belirle.",

            en:
              "Calculate the state-2 and state-3 temperatures together with the required state pressures and specific volumes. Then determine specific heat rejection qout, net specific work wnet, and ideal thermal efficiency η.",
          },
        },

        {
          id:
            "block-otto-05-callout-checks",

          type:
            "callout",

          tone:
            "engineering",

          text: {
            tr:
              "Sonucun sonunda iki kontrol yap: qin − qout = wnet enerji dengesini sağlamalı ve η = wnet/qin sonucu, η = 1 − 1/r^(γ−1) bağıntısıyla uyuşmalıdır.",

            en:
              "Finish with two checks: qin − qout = wnet must satisfy the energy balance, and η = wnet/qin must agree with η = 1 − 1/r^(γ−1).",
          },
        },

        {
          id:
            "block-otto-05-callout-no-answer",

          type:
            "callout",

          tone:
            "info",

          text: {
            tr:
              "Bu ekranda çözüm değeri verilmez. Hesaplandıktan sonra her sonuç kendi birimi ve toleransıyla değerlendirilecektir.",

            en:
              "No numerical solution is revealed on this screen. After submission, each result will be evaluated with its own unit and tolerance.",
          },
        },
      ],
    },

    {
      activityId:
        "activity-otto-06",

      version:
        OTTO_CONTENT_VERSION,

      sourceIds:
        SOURCE_IDS,

      blocks: [
        {
          id:
            "block-otto-06-heading-chain",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "Çevrimi tek bir enerji zinciri olarak düşün",

            en:
              "Think of the cycle as one energy chain",
          },
        },

        {
          id:
            "block-otto-06-paragraph-chain",

          type:
            "paragraph",

          text: {
            tr:
              "Sıkıştırma oranı ve başlangıç durumu, izentropik sıkıştırma sonundaki durumu belirler. Isı eklenmesi durum 3'ü oluşturur, izentropik genleşme durum 4'e götürür ve sabit hacimde ısı atımı çevrimi yeniden durum 1'e bağlar.",

            en:
              "Compression ratio and the initial state determine the end of isentropic compression. Heat addition creates state 3, isentropic expansion leads to state 4, and constant-volume heat rejection connects the cycle back to state 1.",
          },
        },

        {
          id:
            "block-otto-06-equation-energy",

          type:
            "equation",

          expression:
            "w_{net} = q_{in} - q_{out}",

          description: {
            tr:
              "Bütün terimler aynı özgül enerji temeliyle kullanılmalıdır.",

            en:
              "All terms must use the same specific-energy basis.",
          },
        },

        {
          id:
            "block-otto-06-equation-efficiency-energy",

          type:
            "equation",

          expression:
            "\\eta = \\frac{w_{net}}{q_{in}}",

          description: {
            tr:
              "Net özgül işin özgül ısı girişine oranı çevrimin ideal ısıl verimini verir.",

            en:
              "The ratio of net specific work to specific heat input gives the ideal thermal efficiency of the cycle.",
          },
        },

        {
          id:
            "block-otto-06-equation-efficiency-r",

          type:
            "equation",

          expression:
            "\\eta = 1 - \\frac{1}{r^{\\gamma-1}}",

          description: {
            tr:
              "Sabit özgül ısı kullanılan ideal Otto modelinde ikinci, bağımsız verim kontrolüdür.",

            en:
              "For the constant-specific-heat ideal Otto model, this provides a second independent efficiency check.",
          },
        },

        {
          id:
            "block-otto-06-heading-limits",

          type:
            "heading",

          level:
            3,

          text: {
            tr:
              "İdeal modelin sınırlarını unutma",

            en:
              "Do not forget the limits of the ideal model",
          },
        },

        {
          id:
            "block-otto-06-callout-limits",

          type:
            "callout",

          tone:
            "warning",

          text: {
            tr:
              "Bu model gerçek yanma kimyasını, emme ve egzoz gaz değişimini, sürtünmeyi, vuruntuyu veya gerçek motor performansını hesaplamaz. Sonuçlar ideal hava-standardı çevrim sonuçlarıdır.",

            en:
              "This model does not calculate real combustion chemistry, intake and exhaust gas exchange, friction, knock, or real-engine performance. The results belong to the ideal air-standard cycle.",
          },
        },

        {
          id:
            "block-otto-06-callout-validity",

          type:
            "callout",

          tone:
            "engineering",

          text: {
            tr:
              "Matematiksel olarak bir sonuç üretilebilmesi tek başına fiziksel geçerlilik kanıtı değildir. Özellikle yüksek sıcaklıklarda sabit özgül ısı yaklaşımının kullanım sınırı ayrıca değerlendirilmelidir; bu sürümde uzman onaylı sayısal üst sıcaklık sınırı henüz tanımlanmamıştır.",

            en:
              "The existence of a mathematical result is not by itself evidence of physical validity. In particular, the applicability of the constant-specific-heat approximation at high temperatures must be evaluated separately; this version does not yet encode an expert-approved numerical upper-temperature limit.",
          },
        },

        {
          id:
            "block-otto-06-callout-validation",

          type:
            "callout",

          tone:
            "info",

          text: {
            tr:
              "Enerji dengesinin ve iki verim hesabının birbiriyle uyuşması model içi tutarlılık kontrolüdür. Bu, gerçek bir motorun deneysel olarak doğrulandığı anlamına gelmez.",

            en:
              "Agreement of the energy balance and the two efficiency calculations is an internal model-consistency check. It does not constitute experimental validation of a real engine.",
          },
        },
      ],
    },
  ];

export function getOttoActivityContentDefinition(
  activityId:
    string,
):
  | OttoActivityContentDefinition
  | undefined {
  return definitions.find(
    (definition) =>
      definition.activityId ===
      activityId,
  );
}

export function getOttoActivityContentBlocks(
  activityId:
    string,
):
  readonly OttoContentBlock[] {
  return (
    getOttoActivityContentDefinition(
      activityId,
    )?.blocks ??
    []
  );
}

export function getOttoActivityContentDefinitions():
  readonly OttoActivityContentDefinition[] {
  return definitions;
}