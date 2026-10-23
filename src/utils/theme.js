// Theme is stored on <html data-theme>. index.html sets it before first paint.
export const THEME_KEY = "tarumt-bus-theme";

export function currentTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage unavailable: theme still applies for this visit
  }
}
