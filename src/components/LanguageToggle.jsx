import { useLanguage } from "../context/LanguageContext";

const CODES = { en: "EN", ms: "BM", zh: "CH" };
const NAMES = { en: "English", ms: "Bahasa Melayu", zh: "中文" };

export default function LanguageToggle() {
  const { language, cycleLanguage } = useLanguage();

  return (
    <button
      type="button"
      className="language-toggle glass"
      onClick={cycleLanguage}
      aria-label={`Switch language (current: ${NAMES[language]})`}
      title={NAMES[language]}
    >
      <span aria-hidden="true">{CODES[language]}</span>
    </button>
  );
}
