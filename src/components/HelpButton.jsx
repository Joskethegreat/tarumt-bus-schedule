import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Help.css";
import "../styles/glass.css";

// Turns "[text](url)" in an answer into a link.
function renderAnswer(text) {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    return m ? (
      <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer">
        {m[1]}
      </a>
    ) : (
      part
    );
  });
}

// "?" button under the feedback button; opens a panel of placeholder Q&A.
export default function HelpButton() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const items = t("helpItems");

  return (
    <div className="help" ref={rootRef}>
      <button
        type="button"
        className="help-toggle glass"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("helpOpen")}
        aria-expanded={open}
        title={t("helpOpen")}
      >
        <span aria-hidden="true">?</span>
      </button>

      {open && (
        <div className="help-panel glass" role="dialog" aria-label={t("helpTitle")}>
          <h3 className="help-title">{t("helpTitle")}</h3>
          {items.map((item) => (
            <details key={item.q} className="help-item">
              <summary>{item.q}</summary>
              <p>{renderAnswer(item.a)}</p>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
