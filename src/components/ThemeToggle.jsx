import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { applyTheme, currentTheme } from "../utils/theme";
import "../styles/ThemeToggle.css";
import "../styles/glass.css";

// Button under the coffee button that flips light and dark mode (icon shows the current mode).
export default function ThemeToggle() {
  const { t } = useLanguage();
  const [theme, setTheme] = useState(currentTheme);

  function flip() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  const label = theme === "dark" ? t("themeToLight") : t("themeToDark");

  return (
    <button
      type="button"
      className="theme-toggle glass"
      onClick={flip}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true">{theme === "dark" ? "🌙" : "☀️"}</span>
    </button>
  );
}
