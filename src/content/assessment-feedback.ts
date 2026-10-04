import type {
  AssessmentFeedbackDescriptor,
  AssessmentFeedbackReason,
  AssessmentFeedbackTone,
} from "@/domain/assessment/feedback";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

export interface LocalizedAssessmentFeedbackText {
  readonly title:
    string;

  readonly message:
    string;
}

export interface AssessmentFeedbackCatalogEntry
  extends AssessmentFeedbackDescriptor {
  readonly text: {
    readonly tr:
      LocalizedAssessmentFeedbackText;

    readonly en:
      LocalizedAssessmentFeedbackText;
  };
}

function entry(
  code:
    string,

  reason:
    AssessmentFeedbackReason,

  tone:
    AssessmentFeedbackTone,

  retryable:
    boolean,

  trTitle:
    string,

  trMessage:
    string,

  enTitle:
    string,

  enMessage:
    string,
): AssessmentFeedbackCatalogEntry {
  return {
    code,
    reason,
    tone,
    retryable,

    text: {
      tr: {
        title:
          trTitle,

        message:
          trMessage,
      },

      en: {
        title:
          enTitle,

        message:
          enMessage,
      },
    },
  };
}

export const ASSESSMENT_FEEDBACK_CATALOG:
  readonly AssessmentFeedbackCatalogEntry[] =
  [
    entry(
      "assessment.result.correct",
      "correct",
      "success",
      false,
      "Doğru",
      "Değerlendirilen bütün yanıtlar doğru.",
      "Correct",
      "All evaluated responses are correct.",
    ),

    entry(
      "assessment.result.partially-correct",
      "partial",
      "guidance",
      true,
      "Kısmen doğru",
      "Yanıtın bazı bölümleri doğru. Hatalı veya eksik kalan alanları ayrı ayrı kontrol et.",
      "Partially correct",
      "Some parts of your response are correct. Review the incorrect or incomplete items separately.",
    ),

    entry(
      "assessment.result.incorrect",
      "incorrect",
      "guidance",
      true,
      "Tekrar kontrol et",
      "Değerlendirilen yanıt doğru değil. Girdileri, yöntemi ve ilgili fiziksel ilişkiyi yeniden kontrol et.",
      "Check again",
      "The evaluated response is not correct. Review the inputs, method, and relevant physical relationship.",
    ),

    entry(
      "assessment.result.invalid",
      "invalid_input",
      "warning",
      true,
      "Yanıt değerlendirilemedi",
      "En az bir yanıt eksik veya geçersiz olduğu için değerlendirme tamamlanamadı.",
      "Response could not be evaluated",
      "At least one response is missing or invalid, so the evaluation could not be completed.",
    ),

    entry(
      "assessment.result.not-evaluated",
      "not_evaluated",
      "info",
      false,
      "Henüz değerlendirilmedi",
      "Bu yanıt henüz değerlendirilmedi.",
      "Not evaluated yet",
      "This response has not been evaluated yet.",
    ),

    entry(
      "assessment.item.correct",
      "correct",
      "success",
      false,
      "Doğru",
      "Bu yanıt doğru.",
      "Correct",
      "This response is correct.",
    ),

    entry(
      "assessment.item.incorrect",
      "incorrect",
      "guidance",
      true,
      "Yanıtı yeniden kontrol et",
      "Bu yanıt doğru değil. İlgili hesap veya kavramsal ilişkiyi yeniden kontrol et.",
      "Review this response",
      "This response is not correct. Review the relevant calculation or conceptual relationship.",
    ),

    entry(
      "assessment.item.invalid",
      "invalid_input",
      "warning",
      true,
      "Geçersiz yanıt",
      "Bu alan değerlendirilebilir bir yanıt içermiyor.",
      "Invalid response",
      "This field does not contain an evaluable response.",
    ),

    entry(
      "assessment.numeric.missing",
      "missing_input",
      "warning",
      true,
      "Eksik sayısal yanıt",
      "Bu alanı doldurmadan sayısal değerlendirme tamamlanamaz.",
      "Missing numerical response",
      "The numerical evaluation cannot be completed until this field is filled in.",
    ),

    entry(
      "assessment.numeric.invalid",
      "invalid_input",
      "warning",
      true,
      "Sayısal giriş geçersiz",
      "Bu giriş geçerli ve sonlu bir sayı olarak yorumlanamadı.",
      "Invalid numerical input",
      "This input could not be interpreted as a valid finite number.",
    ),

    entry(
      "assessment.numeric.outside-tolerance",
      "outside_tolerance",
      "guidance",
      true,
      "Sayısal sonucu kontrol et",
      "Sonuç kabul edilen tolerans aralığında değil. Birimi, işareti, kullanılan bağıntıyı ve ara hesabı kontrol et.",
      "Check the numerical result",
      "The result is outside the accepted tolerance. Check the unit, sign, equation, and intermediate calculation.",
    ),

    entry(
      "assessment.choice.missing",
      "missing_input",
      "warning",
      true,
      "Bir seçenek seç",
      "Değerlendirmeden önce bir yanıt seçmelisin.",
      "Choose an option",
      "Select a response before submitting the assessment.",
    ),

    entry(
      "assessment.choice.wrong-concept",
      "wrong_concept",
      "guidance",
      true,
      "Kavramsal ilişkiyi yeniden düşün",
      "Seçimin hedeflenen fiziksel veya kavramsal ilişkiyle uyuşmuyor. İlgili değişkenlerin nasıl bağlı olduğunu yeniden incele.",
      "Reconsider the conceptual relationship",
      "Your choice does not match the targeted physical or conceptual relationship. Review how the relevant variables are connected.",
    ),

    entry(
      "assessment.criterion.wrong",
      "wrong_criterion",
      "guidance",
      true,
      "Ölçüt kararını yeniden kontrol et",
      "Hesaplanan sonuçtan ölçüt kararına geçişi yeniden kontrol et. Sağlandı, sağlanmadı, belirlenemedi ve değerlendirilmedi durumlarını birbirine karıştırma.",
      "Review the criterion decision",
      "Review how the calculated result maps to the criterion. Keep satisfied, not satisfied, undetermined, and not evaluated distinct.",
    ),

    entry(
      "assessment.unit.mismatch",
      "unit_mismatch",
      "guidance",
      true,
      "Birimi kontrol et",
      "Sayısal değer uygun görünse bile kullanılan veya girilen birim beklenen nicelikle uyuşmuyor.",
      "Check the unit",
      "Even if the numerical value appears plausible, the supplied unit does not match the expected quantity.",
    ),

    entry(
      "assessment.model.limit",
      "model_limit",
      "info",
      false,
      "Model sınırı",
      "Bu değerlendirme mevcut mühendislik modelinin tanımlı kapsamının dışında. Sistem desteklemediği bir sonucu doğruymuş gibi üretmemelidir.",
      "Model limit",
      "This assessment is outside the defined scope of the current engineering model. The system must not invent an unsupported result.",
    ),
  ];

export function getAssessmentFeedbackEntry(
  code:
    string,
): AssessmentFeedbackCatalogEntry |
  undefined {
  return ASSESSMENT_FEEDBACK_CATALOG.find(
    (
      candidate,
    ) =>
      candidate.code ===
      code,
  );
}

export function getAssessmentFeedbackText(
  code:
    string,

  locale:
    SupportedLocale,
): LocalizedAssessmentFeedbackText |
  undefined {
  return getAssessmentFeedbackEntry(
    code,
  )?.text[
    locale
  ];
}