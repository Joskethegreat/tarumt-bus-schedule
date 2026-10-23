// Language switching for the Terms, Privacy and Credits pages.
// Shares the app's saved language, so switching here also switches the app.
(function () {
  var KEY = "tarumt-bus-language";
  var LANGS = ["en", "ms", "zh"];
  var HTML_LANG = { en: "en", ms: "ms", zh: "zh-Hans" };
  var UI = {
    en: { back: "Bus Schedule", terms: "Terms of Use", privacy: "Privacy Policy", credits: "Credits" },
    ms: { back: "Jadual Bas", terms: "Terma Penggunaan", privacy: "Dasar Privasi", credits: "Penghargaan" },
    zh: { back: "巴士时刻表", terms: "使用条款", privacy: "隐私政策", credits: "致谢" },
  };

  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return LANGS.indexOf(v) >= 0 ? v : "en";
    } catch (e) {
      return "en";
    }
  }

  function apply(lang) {
    document.documentElement.lang = HTML_LANG[lang];
    document.querySelectorAll("article[data-lang]").forEach(function (a) {
      a.hidden = a.getAttribute("data-lang") !== lang;
    });
    document.querySelectorAll(".langs button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-set") === lang));
    });
    document.querySelectorAll("[data-ui]").forEach(function (el) {
      el.textContent = UI[lang][el.getAttribute("data-ui")];
    });
    var page = document.body.getAttribute("data-page");
    document.title = UI[lang][page] + " · TARUMT Bus Schedule (Unofficial)";
  }

  document.querySelectorAll(".langs button").forEach(function (b) {
    b.addEventListener("click", function () {
      var lang = b.getAttribute("data-set");
      try {
        localStorage.setItem(KEY, lang);
      } catch (e) {
        // storage unavailable: switch for this visit only
      }
      apply(lang);
    });
  });

  apply(saved());
})();
