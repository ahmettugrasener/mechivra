export const rawCourses = [
  {
    id: "course-statics",
    version: "1.0.0",
    slug: "statics",

    title: {
      tr: "Statik",
      en: "Statics",
    },

    description: {
      tr: "Kuvvet, moment ve denge ilişkilerini mühendislik sistemleri üzerinden inceleyen temel mekanik alanı.",
      en: "A foundational mechanics course focused on forces, moments, and equilibrium in engineering systems.",
    },

    moduleIds: [
      "module-simply-supported-beam",
    ],

    status: "draft",
  },

  {
    id: "course-mechanics-of-materials",
    version: "1.0.0",
    slug: "mechanics-of-materials",

    title: {
      tr: "Mukavemet",
      en: "Mechanics of Materials",
    },

    description: {
      tr: "Yükler altında malzeme ve yapı elemanlarının gerilme, şekil değiştirme ve deformasyon davranışını inceler.",
      en: "Examines stress, strain, and deformation of materials and structural members under load.",
    },

    moduleIds: [
      "module-bending",
    ],

    status: "draft",
  },

  {
    id: "course-thermodynamics",
    version: "1.0.0",
    slug: "thermodynamics",

    title: {
      tr: "Termodinamik",
      en: "Thermodynamics",
    },

    description: {
      tr: "Enerji, ısı, iş ve termodinamik durum değişkenlerinin mühendislik sistemlerindeki ilişkilerini inceler.",
      en: "Examines relationships among energy, heat, work, and thermodynamic state variables in engineering systems.",
    },

    moduleIds: [
      "module-ideal-otto-cycle",
    ],

    status: "draft",
  },
] as const;

export const rawModules = [
  {
    id: "module-simply-supported-beam",
    version: "1.0.0",

    courseId: "course-statics",
    slug: "simply-supported-beam",

    title: {
      tr: "Basit Mesnetli Kiriş",
      en: "Simply Supported Beam",
    },

    description: {
      tr: "Tek düşey noktasal yük altındaki basit mesnetli bir kiriş üzerinden denge, mesnet tepkileri, kesme kuvveti ve eğilme momentini öğren.",
      en: "Learn equilibrium, support reactions, shear force, and bending moment through a simply supported beam under a single vertical point load.",
    },

    learningOutcomeIds: [
      "outcome-ssb-01",
      "outcome-ssb-02",
      "outcome-ssb-03",
      "outcome-ssb-04",
    ],

    prerequisiteConceptIds: [
      "concept-force",
      "concept-moment",
    ],

    conceptIds: [
      "concept-force",
      "concept-moment",
      "concept-static-equilibrium",
      "concept-support-reaction",
      "concept-shear-force",
      "concept-bending-moment",
    ],

    activityIds: [
      "activity-ssb-01",
      "activity-ssb-02",
      "activity-ssb-03",
      "activity-ssb-04",
      "activity-ssb-05",
      "activity-ssb-06",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "module-bending",
    version: "1.0.0",

    courseId:
      "course-mechanics-of-materials",

    slug: "bending",

    title: {
      tr: "Eğilme",
      en: "Bending",
    },

    description: {
      tr: "Kiriş eğilmesinde kesit geometrisi, eğilme momenti, normal gerilme, elastisite modülü ve sehim arasındaki ilişkileri incele.",
      en: "Explore relationships among section geometry, bending moment, normal stress, elastic modulus, and deflection in beam bending.",
    },

    learningOutcomeIds: [
      "outcome-bending-01",
      "outcome-bending-02",
      "outcome-bending-03",
      "outcome-bending-04",
      "outcome-bending-05",
    ],

    prerequisiteConceptIds: [
      "concept-bending-moment",
    ],

    conceptIds: [
      "concept-bending-moment",
      "concept-second-moment-area",
      "concept-bending-stress",
      "concept-elastic-modulus",
      "concept-deflection",
    ],

    activityIds: [
      "activity-bending-01",
      "activity-bending-02",
      "activity-bending-03",
      "activity-bending-04",
      "activity-bending-05",
      "activity-bending-06",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    status: "draft",
  },

  {
    id: "module-ideal-otto-cycle",
    version: "1.0.0",

    courseId: "course-thermodynamics",
    slug: "ideal-otto-cycle",

    title: {
      tr: "İdeal Otto Çevrimi",
      en: "Ideal Otto Cycle",
    },

    description: {
      tr: "İdeal hava-standardı Otto çevriminde basınç, sıcaklık, özgül hacim, ısı, iş ve sıkıştırma oranı arasındaki ilişkileri incele.",
      en: "Explore relationships among pressure, temperature, specific volume, heat, work, and compression ratio in the ideal air-standard Otto cycle.",
    },

    learningOutcomeIds: [
      "outcome-otto-01",
      "outcome-otto-02",
      "outcome-otto-03",
      "outcome-otto-04",
      "outcome-otto-05",
    ],

    prerequisiteConceptIds: [
      "concept-ideal-gas",
      "concept-energy-balance",
    ],

    conceptIds: [
      "concept-compression-ratio",
      "concept-isentropic-process",
      "concept-constant-volume-process",
      "concept-thermal-efficiency",
      "concept-energy-balance",
      "concept-ideal-gas",
      "concept-specific-heat",
    ],

    activityIds: [
      "activity-otto-01",
      "activity-otto-02",
      "activity-otto-03",
      "activity-otto-04",
      "activity-otto-05",
      "activity-otto-06",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },
] as const;

export const rawLearningOutcomes = [
  {
    id: "outcome-ssb-01",
    version: "1.0.0",
    moduleId:
      "module-simply-supported-beam",
    code: "M01-LO1",

    description: {
      tr: "Basit mesnetli kirişte mesnet tepkilerini denge denklemleri kullanarak hesaplar.",
      en: "Calculates support reactions of a simply supported beam using equilibrium equations.",
    },
  },

  {
    id: "outcome-ssb-02",
    version: "1.0.0",
    moduleId:
      "module-simply-supported-beam",
    code: "M01-LO2",

    description: {
      tr: "Yük konumu değiştiğinde mesnet tepkilerinin neden ve nasıl değiştiğini açıklar.",
      en: "Explains why and how support reactions change as the load position changes.",
    },
  },

  {
    id: "outcome-ssb-03",
    version: "1.0.0",
    moduleId:
      "module-simply-supported-beam",
    code: "M01-LO3",

    description: {
      tr: "Kesme kuvveti diyagramını oluşturur ve yorumlar.",
      en: "Constructs and interprets the shear force diagram.",
    },
  },

  {
    id: "outcome-ssb-04",
    version: "1.0.0",
    moduleId:
      "module-simply-supported-beam",
    code: "M01-LO4",

    description: {
      tr: "Eğilme momenti diyagramını oluşturur, maksimum momenti belirler ve fiziksel anlamını açıklar.",
      en: "Constructs the bending moment diagram, identifies the maximum moment, and explains its physical meaning.",
    },
  },

  {
    id: "outcome-bending-01",
    version: "1.0.0",
    moduleId: "module-bending",
    code: "M02-LO1",

    description: {
      tr: "Kesit geometrisinin alan atalet momentine etkisini açıklar.",
      en: "Explains how cross-section geometry affects the second moment of area.",
    },
  },

  {
    id: "outcome-bending-02",
    version: "1.0.0",
    moduleId: "module-bending",
    code: "M02-LO2",

    description: {
      tr: "Eğilme momenti ile normal gerilme dağılımı arasındaki ilişkiyi açıklar.",
      en: "Explains the relationship between bending moment and normal stress distribution.",
    },
  },

  {
    id: "outcome-bending-03",
    version: "1.0.0",
    moduleId: "module-bending",
    code: "M02-LO3",

    description: {
      tr: "Elastisite modülünün gerilme ve sehim üzerindeki farklı etkilerini ayırt eder.",
      en: "Distinguishes the different effects of elastic modulus on stress and deflection.",
    },
  },

  {
    id: "outcome-bending-04",
    version: "1.0.0",
    moduleId: "module-bending",
    code: "M02-LO4",

    description: {
      tr: "Kesit geometrisi, malzeme ve yük koşullarının sehim üzerindeki etkilerini değerlendirir.",
      en: "Evaluates how section geometry, material, and loading conditions affect deflection.",
    },
  },

  {
    id: "outcome-bending-05",
    version: "1.0.0",
    moduleId: "module-bending",
    code: "M02-LO5",

    description: {
      tr: "Tanımlı gerilme ve sehim ölçütleri altında alternatif kesitleri karşılaştırır.",
      en: "Compares alternative sections under defined stress and deflection criteria.",
    },
  },

  {
    id: "outcome-otto-01",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",
    code: "M03-LO1",

    description: {
      tr: "İdeal Otto çevriminin dört ideal termodinamik sürecini ayırt eder.",
      en: "Distinguishes the four ideal thermodynamic processes of the ideal Otto cycle.",
    },
  },

  {
    id: "outcome-otto-02",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",
    code: "M03-LO2",

    description: {
      tr: "Durum noktaları arasındaki basınç, sıcaklık ve özgül hacim ilişkilerini hesaplar.",
      en: "Calculates pressure, temperature, and specific-volume relationships between state points.",
    },
  },

  {
    id: "outcome-otto-03",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",
    code: "M03-LO3",

    description: {
      tr: "Isı girişi, ısı atımı, net iş ve ideal ısıl verim arasındaki enerji ilişkisini açıklar.",
      en: "Explains the energy relationship among heat input, heat rejection, net work, and ideal thermal efficiency.",
    },
  },

  {
    id: "outcome-otto-04",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",
    code: "M03-LO4",

    description: {
      tr: "Sıkıştırma oranının ideal Otto çevrimi verimine etkisini açıklar.",
      en: "Explains how compression ratio affects ideal Otto-cycle efficiency.",
    },
  },

  {
    id: "outcome-otto-05",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",
    code: "M03-LO5",

    description: {
      tr: "İdeal Otto çevrimi ile gerçek dört zamanlı motor çevrimi arasındaki farkı açıklar.",
      en: "Explains the distinction between the ideal Otto cycle and a real four-stroke engine cycle.",
    },
  },
] as const;

export const rawConcepts = [
  {
    id: "concept-force",
    version: "1.0.0",
    slug: "force",

    title: {
      tr: "Kuvvet",
      en: "Force",
    },

    shortDefinition: {
      tr: "Bir cismin hareketini veya mekanik etkileşimini değiştirebilen vektörel büyüklük.",
      en: "A vector quantity capable of changing the motion or mechanical interaction of a body.",
    },

    requires: [],
    relatedTo: [
      "concept-moment",
    ],
    usedIn: [
      "concept-moment",
      "concept-static-equilibrium",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-moment",
    version: "1.0.0",
    slug: "moment",

    title: {
      tr: "Moment",
      en: "Moment",
    },

    shortDefinition: {
      tr: "Bir kuvvetin seçilen bir nokta veya eksen etrafındaki döndürme etkisi.",
      en: "The rotational effect of a force about a selected point or axis.",
    },

    requires: [
      "concept-force",
    ],

    relatedTo: [
      "concept-static-equilibrium",
    ],

    usedIn: [
      "concept-static-equilibrium",
      "concept-bending-moment",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-static-equilibrium",
    version: "1.0.0",
    slug: "static-equilibrium",

    title: {
      tr: "Statik Denge",
      en: "Static Equilibrium",
    },

    shortDefinition: {
      tr: "Bir sistemde kuvvet ve moment dengelerinin sağlandığı mekanik durum.",
      en: "A mechanical condition in which force and moment equilibrium requirements are satisfied.",
    },

    requires: [
      "concept-force",
      "concept-moment",
    ],

    relatedTo: [
      "concept-support-reaction",
    ],

    usedIn: [
      "concept-support-reaction",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-support-reaction",
    version: "1.0.0",
    slug: "support-reaction",

    title: {
      tr: "Mesnet Tepkisi",
      en: "Support Reaction",
    },

    shortDefinition: {
      tr: "Mesnetlerin yapıya uyguladığı ve denge koşullarından belirlenen kuvvet veya moment.",
      en: "A force or moment exerted by a support on a structure and determined from equilibrium.",
    },

    requires: [
      "concept-static-equilibrium",
    ],

    relatedTo: [
      "concept-shear-force",
      "concept-bending-moment",
    ],

    usedIn: [
      "concept-shear-force",
      "concept-bending-moment",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-shear-force",
    version: "1.0.0",
    slug: "shear-force",

    title: {
      tr: "Kesme Kuvveti",
      en: "Shear Force",
    },

    shortDefinition: {
      tr: "Bir kesitin bir tarafındaki dış yüklerin dengelenmesiyle ortaya çıkan iç kesme etkisi.",
      en: "The internal shear action associated with equilibrium of external loads on one side of a section.",
    },

    requires: [
      "concept-support-reaction",
    ],

    relatedTo: [
      "concept-bending-moment",
    ],

    usedIn: [],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-bending-moment",
    version: "1.0.0",
    slug: "bending-moment",

    title: {
      tr: "Eğilme Momenti",
      en: "Bending Moment",
    },

    shortDefinition: {
      tr: "Bir kesitte eğilme etkisini temsil eden iç moment.",
      en: "The internal moment representing the bending action at a section.",
    },

    requires: [
      "concept-moment",
      "concept-support-reaction",
    ],

    relatedTo: [
      "concept-shear-force",
      "concept-bending-stress",
      "concept-deflection",
    ],

    usedIn: [
      "concept-bending-stress",
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    status: "draft",
  },

  {
    id: "concept-second-moment-area",
    version: "1.0.0",
    slug: "second-moment-area",

    title: {
      tr: "Alan Atalet Momenti",
      en: "Second Moment of Area",
    },

    shortDefinition: {
      tr: "Kesit geometrisinin eğilmeye karşı geometrik etkisini ifade eden kesit özelliği.",
      en: "A geometric section property describing how area is distributed relative to an axis for bending.",
    },

    requires: [],

    relatedTo: [
      "concept-bending-stress",
      "concept-deflection",
    ],

    usedIn: [
      "concept-bending-stress",
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-mechanics-lecture-13",
    ],

    status: "draft",
  },

  {
    id: "concept-bending-stress",
    version: "1.0.0",
    slug: "bending-stress",

    title: {
      tr: "Eğilme Gerilmesi",
      en: "Bending Stress",
    },

    shortDefinition: {
      tr: "Eğilme momenti nedeniyle kesitte oluşan boyuna normal gerilme dağılımı.",
      en: "The longitudinal normal stress distribution produced by bending moment.",
    },

    requires: [
      "concept-bending-moment",
      "concept-second-moment-area",
    ],

    relatedTo: [
      "concept-deflection",
    ],

    usedIn: [],

    sourceIds: [
      "source-mit-mechanics-lecture-13",
    ],

    status: "draft",
  },

  {
    id: "concept-elastic-modulus",
    version: "1.0.0",
    slug: "elastic-modulus",

    title: {
      tr: "Elastisite Modülü",
      en: "Elastic Modulus",
    },

    shortDefinition: {
      tr: "Doğrusal elastik bölgede normal gerilme ile birim şekil değiştirme arasındaki oransal ilişkiyi ifade eden malzeme özelliği.",
      en: "A material property describing the proportional relationship between normal stress and strain in the linear elastic region.",
    },

    requires: [],

    relatedTo: [
      "concept-deflection",
    ],

    usedIn: [
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-deflection",
    version: "1.0.0",
    slug: "deflection",

    title: {
      tr: "Sehim",
      en: "Deflection",
    },

    shortDefinition: {
      tr: "Bir yapı elemanının yük altında başlangıç konumuna göre yer değiştirmesi.",
      en: "The displacement of a structural member from its original position under load.",
    },

    requires: [
      "concept-bending-moment",
      "concept-second-moment-area",
      "concept-elastic-modulus",
    ],

    relatedTo: [
      "concept-bending-stress",
    ],

    usedIn: [],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    status: "draft",
  },

  {
    id: "concept-compression-ratio",
    version: "1.0.0",
    slug: "compression-ratio",

    title: {
      tr: "Sıkıştırma Oranı",
      en: "Compression Ratio",
    },

    shortDefinition: {
      tr: "Otto çevriminde maksimum ve minimum silindir hacimleri arasındaki oran.",
      en: "The ratio between maximum and minimum cylinder volumes in the Otto cycle.",
    },

    requires: [],

    relatedTo: [
      "concept-thermal-efficiency",
    ],

    usedIn: [
      "concept-thermal-efficiency",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },

  {
    id: "concept-isentropic-process",
    version: "1.0.0",
    slug: "isentropic-process",

    title: {
      tr: "İzentropik Süreç",
      en: "Isentropic Process",
    },

    shortDefinition: {
      tr: "İdeal modelde entropinin sabit kaldığı tersinir adyabatik süreç.",
      en: "A reversible adiabatic process in which entropy remains constant in the ideal model.",
    },

    requires: [
      "concept-ideal-gas",
    ],

    relatedTo: [
      "concept-compression-ratio",
      "concept-thermal-efficiency",
    ],

    usedIn: [
      "concept-thermal-efficiency",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },

  {
    id: "concept-constant-volume-process",
    version: "1.0.0",
    slug: "constant-volume-process",

    title: {
      tr: "Sabit Hacimli Süreç",
      en: "Constant-Volume Process",
    },

    shortDefinition: {
      tr: "Hacmin süreç boyunca değişmediği ideal termodinamik süreç.",
      en: "An ideal thermodynamic process in which volume remains constant.",
    },

    requires: [
      "concept-ideal-gas",
    ],

    relatedTo: [
      "concept-specific-heat",
      "concept-energy-balance",
    ],

    usedIn: [
      "concept-energy-balance",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },

  {
    id: "concept-thermal-efficiency",
    version: "1.0.0",
    slug: "thermal-efficiency",

    title: {
      tr: "Isıl Verim",
      en: "Thermal Efficiency",
    },

    shortDefinition: {
      tr: "Bir çevrimde net iş çıktısının ısı girdisine oranı.",
      en: "The ratio of net work output to heat input for a cycle.",
    },

    requires: [
      "concept-energy-balance",
    ],

    relatedTo: [
      "concept-compression-ratio",
      "concept-isentropic-process",
    ],

    usedIn: [],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },

  {
    id: "concept-energy-balance",
    version: "1.0.0",
    slug: "energy-balance",

    title: {
      tr: "Enerji Dengesi",
      en: "Energy Balance",
    },

    shortDefinition: {
      tr: "Bir sistemde enerji girişleri, çıkışları ve enerji değişimi arasındaki korunum ilişkisi.",
      en: "The conservation relationship among energy entering, leaving, and changing within a system.",
    },

    requires: [],

    relatedTo: [
      "concept-thermal-efficiency",
      "concept-constant-volume-process",
    ],

    usedIn: [
      "concept-thermal-efficiency",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },

  {
    id: "concept-ideal-gas",
    version: "1.0.0",
    slug: "ideal-gas",

    title: {
      tr: "İdeal Gaz",
      en: "Ideal Gas",
    },

    shortDefinition: {
      tr: "Termodinamik özellikleri ideal gaz bağıntısıyla temsil edilen basitleştirilmiş gaz modeli.",
      en: "A simplified gas model whose thermodynamic properties are represented using the ideal-gas relation.",
    },

    requires: [],

    relatedTo: [
      "concept-specific-heat",
      "concept-isentropic-process",
    ],

    usedIn: [
      "concept-isentropic-process",
      "concept-constant-volume-process",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },

  {
    id: "concept-specific-heat",
    version: "1.0.0",
    slug: "specific-heat",

    title: {
      tr: "Özgül Isı",
      en: "Specific Heat",
    },

    shortDefinition: {
      tr: "Birim kütlenin sıcaklığını değiştirmek için gereken enerjiyle ilişkili termodinamik özellik.",
      en: "A thermodynamic property related to the energy required to change the temperature of a unit mass.",
    },

    requires: [],

    relatedTo: [
      "concept-ideal-gas",
      "concept-constant-volume-process",
    ],

    usedIn: [
      "concept-constant-volume-process",
      "concept-thermal-efficiency",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    status: "draft",
  },
] as const;

export const rawLearningActivities = [
  {
    id: "activity-ssb-01",
    version: "1.1.0",
    moduleId:
      "module-simply-supported-beam",

    type: "problem_context",
    order: 1,

    title: {
      tr: "Bir kiriş yükü nasıl taşır?",
      en: "How does a beam carry load?",
    },

    learningOutcomeIds: [
      "outcome-ssb-02",
    ],

    conceptIds: [
      "concept-force",
      "concept-moment",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    contentBlocks: [
      {
        id: "block-ssb-01-heading-model",
        type: "heading",
        level: 2,

        text: {
          tr: "Önce sistemi idealize et",
          en: "First, idealize the system",
        },
      },

      {
        id: "block-ssb-01-paragraph-context",
        type: "paragraph",

        text: {
          tr: "Bir kiriş dışarıdan uygulanan yükleri mesnetlerine aktarır. Statik analizde ilk adım, gerçek sistemi çözebileceğimiz bir mekanik modele dönüştürmektir. Bu modülde sol uçta mafsal, sağ uçta makara bulunan basit mesnetli bir kiriş ve iki mesnet arasında aşağı doğru etkiyen tek bir noktasal yük kullanacağız.",
          en: "A beam transfers externally applied loads to its supports. The first step in a statics analysis is to idealize the real system as a solvable mechanical model. In this module, we use a simply supported beam with a pin at the left end, a roller at the right end, and one downward point load acting between the supports.",
        },
      },

      {
        id: "block-ssb-01-callout-fbd",
        type: "callout",
        tone: "engineering",

        title: {
          tr: "Serbest cisim diyagramını düşün",
          en: "Think in terms of a free-body diagram",
        },

        body: {
          tr: "Kirişi çevresinden ayırdığında dış etkiler; uygulanan yük P ile mesnetlerin kirişe uyguladığı tepkilerdir. Bu MVP probleminde yatay dış yük yoktur; bu nedenle yatay tepki denge açısından sıfırdır ve düşey tepkiler RA ile RB üzerinde odaklanırız.",
          en: "When the beam is isolated from its surroundings, the external actions are the applied load P and the reactions exerted by the supports. In this MVP problem there is no external horizontal load, so the horizontal reaction is zero by equilibrium and we focus on the vertical reactions RA and RB.",
        },
      },

      {
        id: "block-ssb-01-heading-equilibrium",
        type: "heading",
        level: 3,

        text: {
          tr: "Denge neyi garanti eder?",
          en: "What does equilibrium guarantee?",
        },
      },

      {
        id: "block-ssb-01-paragraph-equilibrium",
        type: "paragraph",

        text: {
          tr: "Kiriş durgun ve dengedeyse net kuvvet ve net moment sıfır olmalıdır. Düşey kuvvet dengesi bize iki mesnet tepkisinin toplamının uygulanan yüke eşit olduğunu söyler; fakat yükün iki mesnet arasında nasıl paylaşıldığını belirlemek için moment dengesine de ihtiyaç vardır.",
          en: "If the beam is stationary and in equilibrium, the net force and net moment must both be zero. Vertical force equilibrium tells us that the two support reactions must add up to the applied load, but moment equilibrium is also required to determine how that load is shared between the supports.",
        },
      },

      {
        id: "block-ssb-01-equation-force-balance",
        type: "equation",
        expression: "R_A + R_B = P",

        description: {
          tr: "Düşey kuvvet dengesinin bu problem için sadeleştirilmiş biçimi.",
          en: "The simplified vertical force equilibrium relation for this problem.",
        },
      },

      {
        id: "block-ssb-01-callout-key-question",
        type: "callout",
        tone: "info",

        body: {
          tr: "Ana soru şudur: Aynı toplam yük korunurken, yükün kiriş üzerindeki konumu RA ile RB arasındaki paylaşımı nasıl değiştirir?",
          en: "The key question is: while the same total load is preserved, how does the load position change the way that load is shared between RA and RB?",
        },
      },
    ],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-ssb-02",
    version: "1.1.0",
    moduleId:
      "module-simply-supported-beam",

    type: "concept",
    order: 2,

    title: {
      tr: "Denge ve mesnet tepkileri",
      en: "Equilibrium and support reactions",
    },

    learningOutcomeIds: [
      "outcome-ssb-01",
    ],

    conceptIds: [
      "concept-static-equilibrium",
      "concept-support-reaction",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    contentBlocks: [
      {
        id: "block-ssb-02-heading-equations",
        type: "heading",
        level: 2,

        text: {
          tr: "İki denge denklemini birlikte kullan",
          en: "Use the two equilibrium equations together",
        },
      },

      {
        id: "block-ssb-02-paragraph-sign",
        type: "paragraph",

        text: {
          tr: "Kiriş açıklığını L, yük büyüklüğünü P ve yükün sol mesnet A'dan uzaklığını a ile gösterelim. Yukarı yönü pozitif kabul edelim. A noktasına göre moment alırsak RA moment denkleminden çıkar; böylece önce RB doğrudan bulunur.",
          en: "Let the beam span be L, the load magnitude be P, and the distance of the load from the left support A be a. Take upward as positive. If moments are summed about A, RA drops out of the moment equation, allowing RB to be found directly.",
        },
      },

      {
        id: "block-ssb-02-equation-force",
        type: "equation",
        expression: "\\sum F_y = R_A + R_B - P = 0",

        description: {
          tr: "Düşey kuvvet dengesi.",
          en: "Vertical force equilibrium.",
        },
      },

      {
        id: "block-ssb-02-equation-moment-a",
        type: "equation",
        expression: "\\sum M_A = R_B L - P a = 0",

        description: {
          tr: "A mesnedine göre moment dengesi.",
          en: "Moment equilibrium about support A.",
        },
      },

      {
        id: "block-ssb-02-equation-rb",
        type: "equation",
        expression: "R_B = \\frac{P a}{L}",

        description: {
          tr: "Sağ mesnet tepkisi.",
          en: "Right support reaction.",
        },
      },

      {
        id: "block-ssb-02-equation-ra",
        type: "equation",
        expression: "R_A = P - R_B = \\frac{P(L-a)}{L}",

        description: {
          tr: "Sol mesnet tepkisi.",
          en: "Left support reaction.",
        },
      },

      {
        id: "block-ssb-02-callout-check",
        type: "callout",
        tone: "engineering",

        title: {
          tr: "Hızlı denge kontrolü",
          en: "Quick equilibrium check",
        },

        body: {
          tr: "Hesap sonunda RA + RB mutlaka P'ye eşit olmalıdır. Bu kontrol, tepki kuvvetlerinin büyüklüklerinde veya işaretlerinde yapılan birçok hatayı hemen yakalar.",
          en: "At the end of the calculation, RA + RB must equal P. This check immediately catches many magnitude or sign errors in the support reactions.",
        },
      },

      {
        id: "block-ssb-02-heading-example",
        type: "heading",
        level: 3,

        text: {
          tr: "Kısa örnek",
          en: "Short example",
        },
      },

      {
        id: "block-ssb-02-paragraph-example",
        type: "paragraph",

        text: {
          tr: "L = 4 m olan bir kirişte P = 10 kN yük tam ortada, yani a = 2 m konumunda olsun. Geometri simetrik olduğu için iki tepkinin eşit çıkmasını bekleriz. Denge denklemleri de RA = 5 kN ve RB = 5 kN verir.",
          en: "Consider a beam with L = 4 m and a P = 10 kN load at midspan, so a = 2 m. Because the geometry is symmetric, we expect equal reactions. The equilibrium equations give RA = 5 kN and RB = 5 kN.",
        },
      },

      {
        id: "block-ssb-02-callout-units",
        type: "callout",
        tone: "info",

        body: {
          tr: "Denklemlerde birimleri tutarlı kullan. Mechivra hesap çekirdeği değerleri kanonik SI birimlerine dönüştürür; ekranda kN ve kN·m gibi daha okunabilir birimler gösterilebilir.",
          en: "Use consistent units in the equations. The Mechivra calculation core converts values to canonical SI units internally, while the interface may display more readable units such as kN and kN·m.",
        },
      },
    ],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-ssb-03",
    version: "1.1.0",
    moduleId:
      "module-simply-supported-beam",

    type: "prediction",
    order: 3,

    title: {
      tr: "Yük sağa giderse ne olur?",
      en: "What happens when the load moves right?",
    },

    learningOutcomeIds: [
      "outcome-ssb-02",
    ],

    conceptIds: [
      "concept-support-reaction",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    contentBlocks: [
      {
        id: "block-ssb-03-heading-predict",
        type: "heading",
        level: 2,

        text: {
          tr: "Hesaplamadan önce tahmin et",
          en: "Predict before calculating",
        },
      },

      {
        id: "block-ssb-03-paragraph-setup",
        type: "paragraph",

        text: {
          tr: "Kiriş açıklığı L ve yük büyüklüğü P sabit kalsın. Yalnızca yükün sol mesnetten uzaklığı a artsın; yani yük sağ mesnete doğru hareket etsin. Sayısal hesap yapmadan önce RA ve RB'nin nasıl değişeceğine karar ver.",
          en: "Keep the beam span L and load magnitude P fixed. Change only the distance a from the left support, so the load moves toward the right support. Before doing any numerical calculation, decide how RA and RB should change.",
        },
      },

      {
        id: "block-ssb-03-callout-clue",
        type: "callout",
        tone: "info",

        title: {
          tr: "İki ipucu",
          en: "Two clues",
        },

        body: {
          tr: "Birincisi, düşey denge nedeniyle RA + RB toplamı P olarak kalır. İkincisi, yükün her mesnete göre moment kolu konum değiştikçe değişir. Tahminini bu iki bilgiyi birlikte düşünerek yap.",
          en: "First, vertical equilibrium keeps RA + RB equal to P. Second, the load's moment arm about each support changes as its position changes. Use both ideas when making your prediction.",
        },
      },

      {
        id: "block-ssb-03-callout-commit",
        type: "callout",
        tone: "engineering",

        body: {
          tr: "Seçimini yaptıktan sonra değiştiremezsin. Amaç ilk düşünceni kaydetmek ve ardından geri bildirimle fiziksel ilişkiyi karşılaştırmaktır; yanlış tahmin yapmak bu etkinliği geçersiz kılmaz.",
          en: "Once submitted, your choice is locked. The purpose is to record your initial reasoning and then compare it with the physical relationship through feedback; an incorrect prediction does not invalidate the activity.",
        },
      },
    ],

    completionRule: {
      type: "submitted_prediction",
    },

    status: "draft",
  },

  {
    id: "activity-ssb-04",
    version: "1.1.0",
    moduleId:
      "module-simply-supported-beam",

    type: "interactive",
    order: 4,

    title: {
      tr: "Kirişi etkileşimli incele",
      en: "Explore the beam interactively",
    },

    learningOutcomeIds: [
      "outcome-ssb-02",
      "outcome-ssb-03",
      "outcome-ssb-04",
    ],

    conceptIds: [
      "concept-support-reaction",
      "concept-shear-force",
      "concept-bending-moment",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    contentBlocks: [
      {
        id: "block-ssb-04-heading-explore",
        type: "heading",
        level: 2,

        text: {
          tr: "Bir değişkeni değiştir, sistemi izle",
          en: "Change one variable and observe the system",
        },
      },

      {
        id: "block-ssb-04-paragraph-purpose",
        type: "paragraph",

        text: {
          tr: "Aşağıdaki etkileşimli model, aynı basit mesnetli kiriş için doğrulanmış Statik hesap çekirdeğini kullanır. Yük büyüklüğünü veya yük konumunu değiştirdiğinde mesnet tepkileri ve maksimum eğilme momenti aynı fiziksel durumdan yeniden hesaplanır.",
          en: "The interactive model below uses the verified Statics calculation core for the same simply supported beam. When you change the load magnitude or load position, the support reactions and maximum bending moment are recalculated from the same physical state.",
        },
      },

      {
        id: "block-ssb-04-callout-method",
        type: "callout",
        tone: "engineering",

        title: {
          tr: "Deney gibi düşün",
          en: "Treat it like an experiment",
        },

        body: {
          tr: "Önce yalnız yük konumunu değiştir ve RA ile RB'yi izle. Sonra konumu tekrar orta noktaya getirip yalnız yük büyüklüğünü değiştir. Tek seferde bir değişkeni değiştirmek, neden-sonuç ilişkisini daha açık görmeni sağlar.",
          en: "First change only the load position and observe RA and RB. Then return the load to midspan and change only the load magnitude. Changing one variable at a time makes the cause-and-effect relationship easier to see.",
        },
      },

      {
        id: "block-ssb-04-heading-observe",
        type: "heading",
        level: 3,

        text: {
          tr: "Üç sonucu birlikte izle",
          en: "Track three results together",
        },
      },

      {
        id: "block-ssb-04-paragraph-observe",
        type: "paragraph",

        text: {
          tr: "RA ve RB yükün mesnetler arasında nasıl paylaşıldığını gösterir. Maksimum eğilme momenti ise kiriş içindeki eğilme etkisinin en büyük olduğu değeri temsil eder. Bu üç büyüklüğün yük konumu ve yük büyüklüğüyle birlikte nasıl değiştiğini karşılaştır.",
          en: "RA and RB show how the applied load is shared between the supports. The maximum bending moment represents the largest bending action within the beam. Compare how all three quantities change with load position and load magnitude.",
        },
      },
    ],

    completionRule: {
      type: "meaningful_interaction",
    },

    status: "draft",
  },

  {
    id: "activity-ssb-05",
    version: "1.1.0",
    moduleId:
      "module-simply-supported-beam",

    type: "problem",
    order: 5,

    title: {
      tr: "Yeni bir kiriş problemi çöz",
      en: "Solve a new beam problem",
    },

    learningOutcomeIds: [
      "outcome-ssb-01",
      "outcome-ssb-03",
      "outcome-ssb-04",
    ],

    conceptIds: [
      "concept-static-equilibrium",
      "concept-shear-force",
      "concept-bending-moment",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    contentBlocks: [
      {
        id: "block-ssb-05-heading-problem",
        type: "heading",
        level: 2,

        text: {
          tr: "Yeni durum: çözümü sen kur",
          en: "New case: build the solution yourself",
        },
      },

      {
        id: "block-ssb-05-paragraph-problem",
        type: "paragraph",

        text: {
          tr: "Basit mesnetli bir kirişin açıklığı L = 6 m'dir. Aşağı doğru P = 12 kN noktasal yük, sol mesnet A'dan a = 2 m uzaklıkta uygulanmaktadır. Kiriş öz ağırlığını ihmal et.",
          en: "A simply supported beam has a span of L = 6 m. A downward point load P = 12 kN is applied at a = 2 m from the left support A. Neglect the beam self-weight.",
        },
      },

      {
        id: "block-ssb-05-heading-tasks",
        type: "heading",
        level: 3,

        text: {
          tr: "Bulman gerekenler",
          en: "What you need to determine",
        },
      },

      {
        id: "block-ssb-05-paragraph-tasks",
        type: "paragraph",

        text: {
          tr: "Önce RA ve RB mesnet tepkilerini hesapla. Ardından yükün solunda ve sağında kesme kuvvetinin sabit değerlerini belirle. Son olarak maksimum eğilme momentini ve bu maksimumun kiriş üzerindeki konumunu bul.",
          en: "First calculate the support reactions RA and RB. Then determine the constant shear-force values to the left and right of the point load. Finally, find the maximum bending moment and its location along the beam.",
        },
      },

      {
        id: "block-ssb-05-callout-order",
        type: "callout",
        tone: "engineering",

        title: {
          tr: "Önerilen çözüm sırası",
          en: "Recommended solution order",
        },

        body: {
          tr: "1) Serbest cisim diyagramını düşün. 2) ΣM_A = 0 ile RB'yi bul. 3) ΣF_y = 0 ile RA'yı kontrol et. 4) Yük noktasındaki kesme sıçramasını değerlendir. 5) Momentin yük noktasında sürekli olduğunu kullanarak Mmax'ı belirle.",
          en: "1) Think through the free-body diagram. 2) Use ΣM_A = 0 to find RB. 3) Use ΣF_y = 0 to determine and check RA. 4) Evaluate the shear jump at the point load. 5) Use the continuity of moment at the load position to determine Mmax.",
        },
      },

      {
        id: "block-ssb-05-callout-check",
        type: "callout",
        tone: "info",

        body: {
          tr: "Sonuçlarını göndermeden önce iki kontrol yap: RA + RB = 12 kN olmalı ve basit mesnetlerde eğilme momenti sıfır olmalıdır.",
          en: "Before submitting your results, make two checks: RA + RB should equal 12 kN, and the bending moment should be zero at both simple supports.",
        },
      },
    ],

    completionRule: {
      type: "submitted_attempt",
    },

    status: "draft",
  },

  {
    id: "activity-ssb-06",
    version: "1.1.0",
    moduleId:
      "module-simply-supported-beam",

    type: "summary",
    order: 6,

    title: {
      tr: "Özet ve model sınırları",
      en: "Summary and model limits",
    },

    learningOutcomeIds: [
      "outcome-ssb-01",
      "outcome-ssb-02",
      "outcome-ssb-03",
      "outcome-ssb-04",
    ],

    conceptIds: [
      "concept-static-equilibrium",
      "concept-support-reaction",
      "concept-shear-force",
      "concept-bending-moment",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
    ],

    contentBlocks: [
      {
        id: "block-ssb-06-heading-summary",
        type: "heading",
        level: 2,

        text: {
          tr: "Bu modelden çıkarman gereken ana ilişkiler",
          en: "Key relationships to take from this model",
        },
      },

      {
        id: "block-ssb-06-paragraph-summary",
        type: "paragraph",

        text: {
          tr: "Basit mesnetli bir kirişte mesnet tepkileri yalnız toplam yükten değil, yükün konumundan da etkilenir. Düşey kuvvet dengesi RA + RB = P koşulunu korurken moment dengesi bu toplamın iki mesnet arasında nasıl paylaşılacağını belirler.",
          en: "For a simply supported beam, the support reactions depend not only on the total load but also on its position. Vertical force equilibrium preserves RA + RB = P, while moment equilibrium determines how that total is shared between the two supports.",
        },
      },

      {
        id: "block-ssb-06-equation-reactions",
        type: "equation",
        expression: "R_A = \\frac{P(L-a)}{L}, \\qquad R_B = \\frac{Pa}{L}",

        description: {
          tr: "Tek noktasal yüklü basit mesnetli kiriş için düşey mesnet tepkileri.",
          en: "Vertical support reactions for the simply supported beam with one point load.",
        },
      },

      {
        id: "block-ssb-06-paragraph-shear-moment",
        type: "paragraph",

        text: {
          tr: "Bu modelde kesme kuvveti yük bulunmayan bölgelerde sabittir ve noktasal yükte P kadar sıçrama yapar. Eğilme momenti ise yük noktasında süreklidir; her bölgede doğrusal değişir ve P > 0 için maksimum değeri yükün uygulandığı kesitte alır.",
          en: "In this model, shear force is constant in regions without applied loads and changes by P across the point load. Bending moment remains continuous at the load position, varies linearly within each region, and for P > 0 reaches its maximum at the section where the load is applied.",
        },
      },

      {
        id: "block-ssb-06-equation-mmax",
        type: "equation",
        expression: "M_{\\max} = \\frac{P a(L-a)}{L}",

        description: {
          tr: "Maksimum eğilme momenti; P > 0 için x = a konumunda oluşur.",
          en: "Maximum bending moment; for P > 0 it occurs at x = a.",
        },
      },

      {
        id: "block-ssb-06-heading-limits",
        type: "heading",
        level: 3,

        text: {
          tr: "Model sınırlarını unutma",
          en: "Do not forget the model limits",
        },
      },

      {
        id: "block-ssb-06-callout-limits",
        type: "callout",
        tone: "warning",

        title: {
          tr: "Bu sonuçlar hangi problem için geçerli?",
          en: "For which problem are these results valid?",
        },

        body: {
          tr: "Bu MVP modeli iki boyutlu, sol ucu mafsallı ve sağ ucu makaralı, iki mesnet arasında tek bir statik düşey noktasal yük taşıyan kiriş içindir. Kiriş öz ağırlığı ihmal edilir. Yayılı yükler, birden fazla yük, uygulanan çift momentler, konsol veya çıkmalı geometriler, dinamik etkiler ve bu statik modelde tanımlanmayan diğer yükleme durumları kapsam dışıdır.",
          en: "This MVP model applies to a two-dimensional beam with a pin at the left support, a roller at the right support, and one static downward point load located between the supports. Beam self-weight is neglected. Distributed loads, multiple loads, applied couples, cantilever or overhanging geometries, dynamic effects, and other loading cases not defined by this statics model are outside its scope.",
        },
      },

      {
        id: "block-ssb-06-callout-next",
        type: "callout",
        tone: "engineering",

        body: {
          tr: "Statik burada kuvvetleri ve iç tesirleri belirler; tek başına gerilme veya sehim hesabı yapmaz. Bir sonraki Eğilme modülünde aynı kiriş durumu, kesit geometrisi ve malzeme özellikleriyle birleştirilerek gerilme ve deformasyon davranışına geçilir.",
          en: "Statics determines forces and internal actions here; by itself it does not calculate stress or deflection. In the following Bending module, the same beam state is combined with section geometry and material properties to study stress and deformation.",
        },
      },
    ],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-bending-01",
    version: "1.0.0",
    moduleId: "module-bending",

    type: "problem_context",
    order: 1,

    title: {
      tr: "Statikten eğilmeye",
      en: "From statics to bending",
    },

    learningOutcomeIds: [
      "outcome-bending-02",
    ],

    conceptIds: [
      "concept-bending-moment",
    ],

    sourceIds: [
      "source-mit-mechanics-lecture-13",
    ],

    contentBlocks: [],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-bending-02",
    version: "1.0.0",
    moduleId: "module-bending",

    type: "concept",
    order: 2,

    title: {
      tr: "Kesit ve eğilme davranışı",
      en: "Section geometry and bending behavior",
    },

    learningOutcomeIds: [
      "outcome-bending-01",
      "outcome-bending-02",
    ],

    conceptIds: [
      "concept-second-moment-area",
      "concept-bending-stress",
    ],

    sourceIds: [
      "source-mit-mechanics-lecture-13",
    ],

    contentBlocks: [],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-bending-03",
    version: "1.0.0",
    moduleId: "module-bending",

    type: "prediction",
    order: 3,

    title: {
      tr: "Kesit yüksekliği artarsa ne olur?",
      en: "What happens when section height increases?",
    },

    learningOutcomeIds: [
      "outcome-bending-01",
      "outcome-bending-03",
      "outcome-bending-04",
    ],

    conceptIds: [
      "concept-second-moment-area",
      "concept-elastic-modulus",
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    contentBlocks: [],

    completionRule: {
      type: "submitted_prediction",
    },

    status: "draft",
  },

  {
    id: "activity-bending-04",
    version: "1.0.0",
    moduleId: "module-bending",

    type: "interactive",
    order: 4,

    title: {
      tr: "Eğilmeyi etkileşimli incele",
      en: "Explore bending interactively",
    },

    learningOutcomeIds: [
      "outcome-bending-02",
      "outcome-bending-03",
      "outcome-bending-04",
      "outcome-bending-05",
    ],

    conceptIds: [
      "concept-bending-moment",
      "concept-bending-stress",
      "concept-elastic-modulus",
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    contentBlocks: [],

    completionRule: {
      type: "meaningful_interaction",
    },

    status: "draft",
  },

  {
    id: "activity-bending-05",
    version: "1.0.0",
    moduleId: "module-bending",

    type: "problem",
    order: 5,

    title: {
      tr: "Kesit ve sehim problemi çöz",
      en: "Solve a section and deflection problem",
    },

    learningOutcomeIds: [
      "outcome-bending-01",
      "outcome-bending-02",
      "outcome-bending-04",
      "outcome-bending-05",
    ],

    conceptIds: [
      "concept-second-moment-area",
      "concept-bending-stress",
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    contentBlocks: [],

    completionRule: {
      type: "submitted_attempt",
    },

    status: "draft",
  },

  {
    id: "activity-bending-06",
    version: "1.0.0",
    moduleId: "module-bending",

    type: "summary",
    order: 6,

    title: {
      tr: "Özet ve model sınırları",
      en: "Summary and model limits",
    },

    learningOutcomeIds: [
      "outcome-bending-01",
      "outcome-bending-02",
      "outcome-bending-03",
      "outcome-bending-04",
      "outcome-bending-05",
    ],

    conceptIds: [
      "concept-bending-stress",
      "concept-elastic-modulus",
      "concept-deflection",
    ],

    sourceIds: [
      "source-mit-beam-displacements",
      "source-mit-mechanics-lecture-13",
    ],

    contentBlocks: [],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-otto-01",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",

    type: "problem_context",
    order: 1,

    title: {
      tr: "İdeal Otto çevrimine giriş",
      en: "Introduction to the ideal Otto cycle",
    },

    learningOutcomeIds: [
      "outcome-otto-05",
    ],

    conceptIds: [
      "concept-compression-ratio",
      "concept-thermal-efficiency",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    contentBlocks: [],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-otto-02",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",

    type: "concept",
    order: 2,

    title: {
      tr: "Dört ideal termodinamik süreç",
      en: "The four ideal thermodynamic processes",
    },

    learningOutcomeIds: [
      "outcome-otto-01",
      "outcome-otto-02",
    ],

    conceptIds: [
      "concept-isentropic-process",
      "concept-constant-volume-process",
      "concept-ideal-gas",
      "concept-specific-heat",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    contentBlocks: [],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },

  {
    id: "activity-otto-03",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",

    type: "prediction",
    order: 3,

    title: {
      tr: "Sıkıştırma oranı artarsa ne olur?",
      en: "What happens when compression ratio increases?",
    },

    learningOutcomeIds: [
      "outcome-otto-04",
    ],

    conceptIds: [
      "concept-compression-ratio",
      "concept-thermal-efficiency",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    contentBlocks: [],

    completionRule: {
      type: "submitted_prediction",
    },

    status: "draft",
  },

  {
    id: "activity-otto-04",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",

    type: "interactive",
    order: 4,

    title: {
      tr: "Çevrimi etkileşimli incele",
      en: "Explore the cycle interactively",
    },

    learningOutcomeIds: [
      "outcome-otto-02",
      "outcome-otto-03",
      "outcome-otto-04",
    ],

    conceptIds: [
      "concept-compression-ratio",
      "concept-isentropic-process",
      "concept-constant-volume-process",
      "concept-thermal-efficiency",
      "concept-energy-balance",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    contentBlocks: [],

    completionRule: {
      type: "meaningful_interaction",
    },

    status: "draft",
  },

  {
    id: "activity-otto-05",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",

    type: "problem",
    order: 5,

    title: {
      tr: "Yeni bir Otto çevrimi problemi çöz",
      en: "Solve a new Otto-cycle problem",
    },

    learningOutcomeIds: [
      "outcome-otto-02",
      "outcome-otto-03",
      "outcome-otto-04",
    ],

    conceptIds: [
      "concept-energy-balance",
      "concept-thermal-efficiency",
      "concept-compression-ratio",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    contentBlocks: [],

    completionRule: {
      type: "submitted_attempt",
    },

    status: "draft",
  },

  {
    id: "activity-otto-06",
    version: "1.0.0",
    moduleId:
      "module-ideal-otto-cycle",

    type: "summary",
    order: 6,

    title: {
      tr: "Özet ve ideal-gerçek ayrımı",
      en: "Summary and ideal-versus-real distinction",
    },

    learningOutcomeIds: [
      "outcome-otto-01",
      "outcome-otto-02",
      "outcome-otto-03",
      "outcome-otto-04",
      "outcome-otto-05",
    ],

    conceptIds: [
      "concept-compression-ratio",
      "concept-thermal-efficiency",
      "concept-energy-balance",
    ],

    sourceIds: [
      "source-mit-otto-cycle",
    ],

    contentBlocks: [],

    completionRule: {
      type: "reached_end",
    },

    status: "draft",
  },
] as const;

export const rawSources = [
  {
    id: "source-mit-beam-displacements",
    version: "1.0.0",

    title: "Beam Displacements",

    authors: [
      "David Roylance",
    ],

    organization:
      "MIT OpenCourseWare",

    year: 2000,

    usageTypes: [
      "scientific_reference",
      "engineering_model",
      "content_reference",
    ],

    relatedEntityIds: [
      "module-simply-supported-beam",
      "module-bending",
      "concept-moment",
      "concept-static-equilibrium",
      "concept-support-reaction",
      "concept-shear-force",
      "concept-bending-moment",
      "concept-elastic-modulus",
      "concept-deflection",
    ],

    permissionStatus:
      "Scientific reference only; reuse rights for specific external material must be reviewed separately.",

    status: "technical_review",
  },

  {
    id: "source-mit-mechanics-lecture-13",
    version: "1.0.0",

    title:
      "3.11 Mechanics of Materials — Lecture 13",

    authors: [
      "C. Ortiz",
    ],

    organization:
      "Massachusetts Institute of Technology",

    year: 2003,

    usageTypes: [
      "scientific_reference",
      "engineering_model",
      "content_reference",
    ],

    relatedEntityIds: [
      "module-bending",
      "concept-bending-moment",
      "concept-second-moment-area",
      "concept-bending-stress",
    ],

    permissionStatus:
      "Scientific reference only; reuse rights for specific external material must be reviewed separately.",

    status: "technical_review",
  },

  {
    id: "source-mit-otto-cycle",
    version: "1.0.0",

    title:
      "Thermodynamics Notes — The Otto Cycle",

    authors: [],

    organization:
      "MIT Unified Engineering",

    usageTypes: [
      "scientific_reference",
      "engineering_model",
      "content_reference",
    ],

    relatedEntityIds: [
      "module-ideal-otto-cycle",
      "concept-compression-ratio",
      "concept-isentropic-process",
      "concept-constant-volume-process",
      "concept-thermal-efficiency",
      "concept-energy-balance",
      "concept-ideal-gas",
      "concept-specific-heat",
    ],

    permissionStatus:
      "Scientific reference only; reuse rights for specific external material must be reviewed separately.",

    status: "technical_review",
  },
] as const;
