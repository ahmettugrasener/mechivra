export const OTTO_SUMMARY_VERSION =
  "1.0.0" as const;

export interface OttoSummaryLocalizedText {
  readonly tr:
    string;

  readonly en:
    string;
}

export interface OttoSummarySource {
  readonly id:
    "source-mit-otto-cycle";

  readonly title:
    string;

  readonly organization:
    string;

  readonly usageNote:
    OttoSummaryLocalizedText;

  readonly permissionStatus:
    string;
}

export const OTTO_SUMMARY_CAPABILITIES:
  readonly OttoSummaryLocalizedText[] =
  [
    {
      tr:
        "İdeal Otto çevrimindeki dört termodinamik durumun sıcaklık, mutlak basınç ve özgül hacim değerlerini ilişkilendirebilirsin.",

      en:
        "You can relate temperature, absolute pressure, and specific volume across the four thermodynamic states of the ideal Otto cycle.",
    },

    {
      tr:
        "1 → 2 ve 3 → 4 izentropik süreçlerini; 2 → 3 ve 4 → 1 sabit hacimli süreçlerini birbirinden ayırabilirsin.",

      en:
        "You can distinguish the 1 → 2 and 3 → 4 isentropic processes from the 2 → 3 and 4 → 1 constant-volume processes.",
    },

    {
      tr:
        "Özgül ısı girişini, özgül ısı atımını ve net özgül işi enerji dengesiyle bağlayabilirsin.",

      en:
        "You can connect specific heat input, specific heat rejection, and net specific work through the cycle energy balance.",
    },

    {
      tr:
        "İdeal ısıl verimi hem enerji dengesinden hem de sabit γ Otto verim bağıntısından kontrol edebilirsin.",

      en:
        "You can check ideal thermal efficiency using both the energy balance and the constant-γ Otto efficiency relation.",
    },

    {
      tr:
        "Sıkıştırma oranı r ile ideal verim arasındaki ilişkiyi ve qin değişiminin aynı r ve γ altında farklı etkisini yorumlayabilirsin.",

      en:
        "You can interpret the relationship between compression ratio r and ideal efficiency, and distinguish it from the effect of changing qin at fixed r and γ.",
    },
  ];

export const OTTO_SUMMARY_ASSUMPTIONS:
  readonly OttoSummaryLocalizedText[] =
  [
    {
      tr:
        "Çalışan akışkan kapalı çevrim boyunca sabit kütleli hava-standardı sistem olarak modellenir.",

      en:
        "The working fluid is modeled as a fixed-mass air-standard system throughout the closed cycle.",
    },

    {
      tr:
        "Gaz ideal gaz olarak kabul edilir.",

      en:
        "The gas is treated as an ideal gas.",
    },

    {
      tr:
        "Özgül ısılar sabittir; ilk modelde R, cp, cv ve γ tutarlı tek bir özellik setinden gelir.",

      en:
        "Specific heats are constant; in the first model, R, cp, cv, and γ come from one internally consistent property set.",
    },

    {
      tr:
        "1 → 2 izentropik sıkıştırma, 2 → 3 sabit hacimde ısı eklenmesi, 3 → 4 izentropik genleşme ve 4 → 1 sabit hacimde ısı atılması olarak modellenir.",

      en:
        "Processes are modeled as 1 → 2 isentropic compression, 2 → 3 constant-volume heat addition, 3 → 4 isentropic expansion, and 4 → 1 constant-volume heat rejection.",
    },

    {
      tr:
        "Sıcaklıklar mutlak sıcaklık olarak Kelvin, basınçlar mutlak basınç olarak kullanılır.",

      en:
        "Temperatures are absolute temperatures in kelvin and pressures are absolute pressures.",
    },
  ];

export const OTTO_SUMMARY_LIMITATIONS:
  readonly OttoSummaryLocalizedText[] =
  [
    {
      tr:
        "Gerçek yanma kimyası modellenmez.",

      en:
        "Real combustion chemistry is not modeled.",
    },

    {
      tr:
        "Emme ve egzoz sırasında gerçek gaz değişimi modellenmez.",

      en:
        "Real intake and exhaust gas exchange is not modeled.",
    },

    {
      tr:
        "Sürtünme ve diğer mekanik kayıplar modellenmez.",

      en:
        "Friction and other mechanical losses are not modeled.",
    },

    {
      tr:
        "Vuruntu ve gerçek motor sıkıştırma oranı sınırları değerlendirilmez.",

      en:
        "Knock and real-engine compression-ratio limits are not evaluated.",
    },

    {
      tr:
        "Sıcaklığa bağlı özgül ısılar ve gerçek gaz özellikleri bu ilk modelde kullanılmaz.",

      en:
        "Temperature-dependent specific heats and real-gas properties are not used in this first model.",
    },

    {
      tr:
        "Model gerçek motor gücü, yakıt tüketimi, emisyonu veya gerçek motor verimini tahmin etmez.",

      en:
        "The model does not predict real-engine power, fuel consumption, emissions, or real-engine efficiency.",
    },

    {
      tr:
        "Yüksek sıcaklıklarda sabit özgül ısı yaklaşımının kullanım sınırı ayrıca değerlendirilmelidir. Bu sürümde uzman onaylı sayısal bir üst sıcaklık sınırı henüz kodlanmamıştır.",

      en:
        "The applicability of the constant-specific-heat approximation at high temperatures requires separate evaluation. This version does not yet encode an expert-approved numerical upper-temperature limit.",
    },
  ];

export const OTTO_SUMMARY_INTERPRETATION_RULES:
  readonly OttoSummaryLocalizedText[] =
  [
    {
      tr:
        "Dört ideal termodinamik süreç, gerçek dört zamanlı motorun emme–sıkıştırma–iş–egzoz zamanlarıyla bire bir aynı değildir.",

      en:
        "The four ideal thermodynamic processes are not identical to the intake–compression–power–exhaust strokes of a real four-stroke engine.",
    },

    {
      tr:
        "4 → 1 sürecini doğrudan 'egzoz zamanı' olarak adlandırma; bu kapalı ideal çevrimde sabit hacimde ısı atılmasıdır.",

      en:
        "Do not label process 4 → 1 directly as the exhaust stroke; in this closed ideal cycle it is constant-volume heat rejection.",
    },

    {
      tr:
        "Grafikte v kullanılıyorsa büyüklük özgül hacimdir ve diyagram p–v olarak adlandırılmalıdır.",

      en:
        "When v is used on the graph, the quantity is specific volume and the diagram must be identified as p–v.",
    },

    {
      tr:
        "qin, qout ve wnet özgül enerji büyüklükleridir. kJ/kg cinsinden net özgül işi kW cinsinden güç olarak yorumlama.",

      en:
        "qin, qout, and wnet are specific-energy quantities. Do not interpret net specific work in kJ/kg as power in kW.",
    },

    {
      tr:
        "Sabit γ modelinde r arttığında ideal verimin artması, gerçek motorda r'nin sınırsız artırılabileceğini göstermez.",

      en:
        "An increase in ideal efficiency with r in the constant-γ model does not imply that r can be increased without limit in a real engine.",
    },

    {
      tr:
        "Aynı r ve γ için qin değiştiğinde sıcaklıklar, qout ve wnet değişebilir; ideal Otto verimi değişmez.",

      en:
        "At fixed r and γ, changing qin can change temperatures, qout, and wnet while the ideal Otto efficiency remains unchanged.",
    },

    {
      tr:
        "Enerji dengesinin ve iki verim hesabının uyuşması model içi tutarlılık kontrolüdür; gerçek motorun deneysel validasyonu değildir.",

      en:
        "Agreement of the energy balance and the two efficiency calculations is an internal model-consistency check, not experimental validation of a real engine.",
    },
  ];

export const OTTO_SUMMARY_SOURCES:
  readonly OttoSummarySource[] =
  [
    {
      id:
        "source-mit-otto-cycle",

      title:
        "Thermodynamics Notes — The Otto Cycle",

      organization:
        "MIT Unified Engineering",

      usageNote: {
        tr:
          "İdeal Otto süreçleri, izentropik bağıntılar ve sabit özgül ısılı ideal verim ilişkisi için bilimsel referans.",

        en:
          "Scientific reference for the ideal Otto processes, isentropic relations, and constant-specific-heat ideal-efficiency relation.",
      },

      permissionStatus:
        "Scientific reference only; reuse rights for specific external material must be reviewed separately.",
    },
  ];