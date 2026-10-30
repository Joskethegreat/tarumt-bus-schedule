import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../context/LanguageContext";
import { HelpIcon } from "./Icons";
import "../styles/RouteTypeInfo.css";

// Small "?" next to the Route Type label; opens a popup explaining To Campus / From Campus.
export default function RouteTypeInfo() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="info-btn"
        onClick={() => setOpen(true)}
        aria-label={t("routeTypeInfoOpen")}
        title={t("routeTypeInfoOpen")}
      >
        <HelpIcon size={18} />
      </button>

      {open &&
        createPortal(
          <div className="disclaimer-overlay" onClick={() => setOpen(false)}>
            <div
              className="disclaimer-card info-card"
              role="dialog"
              aria-modal="true"
              aria-label={t("routeTypeInfoTitle")}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="info-title">{t("routeTypeInfoTitle")}</h3>

              <div className="info-item">
                <h4>{t("toCampus")}</h4>
                <p>{t("toCampusInfo")}</p>
              </div>
              <div className="info-item">
                <h4>{t("fromCampus")}</h4>
                <p>{t("fromCampusInfo")}</p>
              </div>

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
