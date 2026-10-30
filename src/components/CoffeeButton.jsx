import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import qr from "../assets/coffee-qr.png";
import { CoffeeIcon } from "./Icons";
import "../styles/Coffee.css";
import "../styles/glass.css";

// "Buy me a coffee": opens a panel with an open-amount DuitNow / TNG QR.
export default function CoffeeButton() {
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

  return (
    <div className="coffee" ref={rootRef}>
      <button
        type="button"
        className="pill-btn coffee-toggle glass"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <CoffeeIcon size={18} />
        {t("coffeeLabel")}
      </button>

      {open && (
        <div className="coffee-panel glass" role="dialog" aria-label={t("coffeeLabel")}>
          <h3 className="coffee-title">{t("coffeeTitle")}</h3>
          <p className="coffee-text">{t("coffeeText")}</p>

          <img className="coffee-qr" src={qr} alt={t("coffeeQrAlt")} />
          <p className="coffee-hint">{t("coffeeScan")}</p>
        </div>
      )}
    </div>
  );
}
