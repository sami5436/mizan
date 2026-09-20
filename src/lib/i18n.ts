export type Language = "en" | "ar";

export const LANGUAGES: Language[] = ["en", "ar"];

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "ar";
}

export function direction(language: Language): "ltr" | "rtl" {
  return language === "ar" ? "rtl" : "ltr";
}

const en = {
  "brand.name": "Mizan",
  "brand.tagline": "Gold jewelry price breakdown",
  "brand.subtitle": "See exactly what you pay for metal, workmanship, and everything else.",

  "nav.fair": "Fair price",
  "nav.compare": "Compare shops",
  "nav.reverse": "Reverse check",

  "rates.title": "Gold rates",
  "rates.perGram": "Per gram",
  "rates.marketLabel": "24K market price per gram",
  "rates.hint": "Set today's 24K price. Lower karats are derived from purity.",
  "rates.fetch": "Fetch live price",
  "rates.fetching": "Fetching",
  "rates.source.manual": "Entered manually",
  "rates.source.live": "Live rate",
  "rates.updated": "Updated",
  "rates.error": "Live rate unavailable. Keep entering the price manually.",
  "rates.purity": "purity",
  "rates.selected": "Selected",

  "form.details": "Item details",
  "form.karat": "Karat",
  "form.weight": "Weight",
  "form.weightUnit": "grams",
  "form.pricePerGram": "Gold price per gram",
  "form.pricePerGramHint": "Follows the rate table. Type to override.",
  "form.pricePerGramOverride": "Overriding the rate table.",
  "form.relink": "Use rate",
  "form.charges": "Charges",
  "form.making": "Making charge",
  "form.makingPerGram": "Per gram",
  "form.makingPercent": "% of gold",
  "form.tax": "Tax or added fees",
  "form.quoted": "Shop quoted total",
  "form.optional": "optional",
  "form.quotedHint": "Add a quote to compare it against the calculated total.",

  "results.title": "Breakdown",
  "results.expected": "Expected fair price",
  "results.goldValue": "Raw gold value",
  "results.making": "Making charge",
  "results.subtotal": "Subtotal",
  "results.tax": "Tax and fees",
  "results.quoted": "Shop quoted price",
  "results.difference": "Difference vs expected",
  "results.markupAmount": "Markup above gold value",
  "results.markupPercent": "Total markup",
  "results.allInPerGram": "Price per gram, all in",
  "results.expectedPerGram": "Expected price per gram",
  "results.ofGold": "of gold value",
  "results.empty": "Enter a weight and a gold price to see the breakdown.",

  "status.title": "Quote check",
  "status.none": "Enter a shop quote to compare it against these numbers.",
  "status.below": "Below the calculated total",
  "status.close": "Close to the calculated total",
  "status.moderate": "Moderately above the calculated total",
  "status.high": "Significantly above the calculated total",
  "status.disclaimer":
    "This is a mathematical comparison of the values you entered. It is not financial advice.",

  "compare.title": "Shop comparison",
  "compare.hint":
    "Every shop is scored against the same weight, karat, and rate from the fair price tab.",
  "compare.storeName": "Shop name",
  "compare.storePlaceholder": "Shop",
  "compare.quotedTotal": "Quoted total",
  "compare.making": "Stated making charge",
  "compare.perGram": "Effective per gram",
  "compare.vsGold": "vs gold value",
  "compare.vsExpected": "vs expected",
  "compare.add": "Add shop",
  "compare.remove": "Remove",
  "compare.best": "Lowest quote",
  "compare.empty": "Add a shop to start comparing.",
  "compare.context": "Compared against",

  "reverse.title": "Reverse check",
  "reverse.hint":
    "Enter what the shop is charging and see the premium sitting on top of the metal.",
  "reverse.total": "Shop total price",
  "reverse.includedTax": "Tax already included in that total",
  "reverse.premium": "Implied premium",
  "reverse.premiumPerGram": "Implied making charge per gram",
  "reverse.premiumPercent": "Premium over gold value",
  "reverse.goldValue": "Raw gold value",
  "reverse.preTax": "Total before tax",
  "reverse.taxPortion": "Tax portion",
  "reverse.goldShare": "Gold share of the total",
  "reverse.effectivePerGram": "You pay per gram",
  "reverse.empty": "Enter a weight and a shop total to see the implied premium.",

  "actions.reset": "Reset",
  "actions.demo": "Demo values",
  "actions.language": "العربية",

  "footer.note":
    "Mizan runs entirely in your browser. Nothing you type is stored on a server.",
  "footer.disclaimer": "Calculations only, not financial advice.",

  "validation.weight": "Weight must be greater than zero.",
  "validation.price": "Gold price must be greater than zero.",
  "validation.percent": "Enter a value between 0 and 100.",
  "validation.max": "That value looks too large.",
} as const;

export type TranslationKey = keyof typeof en;

const ar: Record<TranslationKey, string> = {
  "brand.name": "ميزان",
  "brand.tagline": "تفصيل سعر المشغولات الذهبية",
  "brand.subtitle": "اعرف بالضبط كم تدفع مقابل الذهب والمصنعية وباقي الرسوم.",

  "nav.fair": "السعر العادل",
  "nav.compare": "مقارنة المحلات",
  "nav.reverse": "الحساب العكسي",

  "rates.title": "أسعار الذهب",
  "rates.perGram": "لكل جرام",
  "rates.marketLabel": "سعر جرام عيار 24 في السوق",
  "rates.hint": "أدخل سعر عيار 24 اليوم، وتُحسب باقي العيارات حسب نسبة النقاء.",
  "rates.fetch": "جلب السعر المباشر",
  "rates.fetching": "جاري الجلب",
  "rates.source.manual": "مُدخل يدويًا",
  "rates.source.live": "سعر مباشر",
  "rates.updated": "آخر تحديث",
  "rates.error": "السعر المباشر غير متاح حاليًا، يمكنك إدخال السعر يدويًا.",
  "rates.purity": "نقاء",
  "rates.selected": "المختار",

  "form.details": "بيانات القطعة",
  "form.karat": "العيار",
  "form.weight": "الوزن",
  "form.weightUnit": "جرام",
  "form.pricePerGram": "سعر الجرام",
  "form.pricePerGramHint": "مرتبط بجدول الأسعار، ويمكنك تعديله يدويًا.",
  "form.pricePerGramOverride": "تم تجاوز جدول الأسعار.",
  "form.relink": "استخدام السعر",
  "form.charges": "الرسوم",
  "form.making": "المصنعية",
  "form.makingPerGram": "لكل جرام",
  "form.makingPercent": "٪ من قيمة الذهب",
  "form.tax": "الضريبة أو الرسوم الإضافية",
  "form.quoted": "السعر المعروض من المحل",
  "form.optional": "اختياري",
  "form.quotedHint": "أضف سعر المحل لمقارنته بالسعر المحسوب.",

  "results.title": "التفصيل",
  "results.expected": "السعر العادل المتوقع",
  "results.goldValue": "قيمة الذهب الخام",
  "results.making": "المصنعية",
  "results.subtotal": "المجموع الفرعي",
  "results.tax": "الضريبة والرسوم",
  "results.quoted": "سعر المحل",
  "results.difference": "الفرق عن المتوقع",
  "results.markupAmount": "الزيادة فوق قيمة الذهب",
  "results.markupPercent": "إجمالي نسبة الزيادة",
  "results.allInPerGram": "سعر الجرام شاملًا كل شيء",
  "results.expectedPerGram": "سعر الجرام المتوقع",
  "results.ofGold": "من قيمة الذهب",
  "results.empty": "أدخل الوزن وسعر الجرام لعرض التفصيل.",

  "status.title": "فحص السعر",
  "status.none": "أدخل سعر المحل لمقارنته بهذه الأرقام.",
  "status.below": "أقل من المجموع المحسوب",
  "status.close": "قريب من المجموع المحسوب",
  "status.moderate": "أعلى بدرجة متوسطة من المجموع المحسوب",
  "status.high": "أعلى بدرجة كبيرة من المجموع المحسوب",
  "status.disclaimer": "هذه مقارنة حسابية للقيم التي أدخلتها، وليست نصيحة مالية.",

  "compare.title": "مقارنة المحلات",
  "compare.hint": "تُقارن كل المحلات بنفس الوزن والعيار والسعر المستخدم في تبويب السعر العادل.",
  "compare.storeName": "اسم المحل",
  "compare.storePlaceholder": "محل",
  "compare.quotedTotal": "السعر المعروض",
  "compare.making": "المصنعية المعلنة",
  "compare.perGram": "السعر الفعلي للجرام",
  "compare.vsGold": "مقابل قيمة الذهب",
  "compare.vsExpected": "مقابل المتوقع",
  "compare.add": "إضافة محل",
  "compare.remove": "حذف",
  "compare.best": "أقل سعر",
  "compare.empty": "أضف محلًا لبدء المقارنة.",
  "compare.context": "المقارنة على أساس",

  "reverse.title": "الحساب العكسي",
  "reverse.hint": "أدخل سعر المحل النهائي لتعرف حجم الزيادة فوق قيمة الذهب.",
  "reverse.total": "السعر النهائي في المحل",
  "reverse.includedTax": "الضريبة المشمولة في هذا السعر",
  "reverse.premium": "الزيادة الضمنية",
  "reverse.premiumPerGram": "المصنعية الضمنية لكل جرام",
  "reverse.premiumPercent": "نسبة الزيادة فوق قيمة الذهب",
  "reverse.goldValue": "قيمة الذهب الخام",
  "reverse.preTax": "المجموع قبل الضريبة",
  "reverse.taxPortion": "قيمة الضريبة",
  "reverse.goldShare": "نسبة الذهب من السعر",
  "reverse.effectivePerGram": "ما تدفعه لكل جرام",
  "reverse.empty": "أدخل الوزن وسعر المحل لعرض الزيادة الضمنية.",

  "actions.reset": "إعادة تعيين",
  "actions.demo": "قيم تجريبية",
  "actions.language": "English",

  "footer.note": "يعمل ميزان داخل متصفحك بالكامل، ولا تُحفظ أي بيانات على خادم.",
  "footer.disclaimer": "حسابات فقط، وليست نصيحة مالية.",

  "validation.weight": "يجب أن يكون الوزن أكبر من صفر.",
  "validation.price": "يجب أن يكون سعر الجرام أكبر من صفر.",
  "validation.percent": "أدخل قيمة بين 0 و 100.",
  "validation.max": "هذه القيمة كبيرة جدًا.",
};

export const dictionaries: Record<Language, Record<TranslationKey, string>> = {
  en,
  ar,
};

export type Translator = (key: TranslationKey) => string;

export function createTranslator(language: Language): Translator {
  const dictionary = dictionaries[language];
  return (key) => dictionary[key] ?? key;
}
