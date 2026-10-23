import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/Disclaimer.css";

const SEEN_KEY = "tarumt-bus-disclaimer-seen";

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

// Small red button that shows the disclaimer text in a dismissible popup.
export default function Disclaimer() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(readSeen);

  function show() {
    setOpen(true);
    setSeen(true);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // storage unavailable: it just greys out for this visit
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className={seen ? "disclaimer-btn seen" : "disclaimer-btn"} onClick={show}>
        {t("disclaimerButton")}
      </button>

      {open &&
        createPortal(
          <div className="disclaimer-overlay" onClick={() => setOpen(false)}>
            <div
              className="disclaimer-card"
              role="dialog"
              aria-modal="true"
              aria-label={t("disclaimerButton")}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="disclaimer-title">{t("disclaimerButton")}</h3>
              <p className="disclaimer-body">{t("disclaimer")}</p>
              <button type="button" className="disclaimer-close" onClick={() => setOpen(false)}>
                {t("disclaimerDismiss")}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
