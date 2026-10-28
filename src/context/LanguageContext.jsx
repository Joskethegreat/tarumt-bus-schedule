import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

const LANGUAGES = ["en", "ms", "zh"];
const STORAGE_KEY = "tarumt-bus-language";

// First supported language in the browser's preference list, e.g. "zh-CN" -> "zh".
function detectLanguage() {
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const pref of prefs) {
    const base = pref?.toLowerCase().split("-")[0];
    if (LANGUAGES.includes(base)) return base;
  }
  return "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable: fall back to detection
    }
    return LANGUAGES.includes(saved) ? saved : detectLanguage();
  });

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-Hans" : language;
  }, [language]);

  // Only an explicit choice is saved, so the detected language keeps following the system until then.
  function cycleLanguage() {
    setLanguage((prev) => {
      const next = LANGUAGES[(LANGUAGES.indexOf(prev) + 1) % LANGUAGES.length];
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage unavailable: switch for this visit only
      }
      return next;
    });
  }

  function t(key) {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  }

  return (
    <LanguageContext.Provider value={{ language, cycleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
