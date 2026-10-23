import { useState, useEffect } from "react";
import { periods } from "./data/periods";
import { routes } from "./data/routes";
import RouteSelect from "./components/RouteSelect";
import DirectionSelect from "./components/DirectionSelect";
import PeriodSelect from "./components/PeriodSelect";
import ScheduleResults from "./components/ScheduleResults";
import ShareButtons from "./components/ShareButtons";
import LanguageToggle from "./components/LanguageToggle";
import FeedbackButton from "./components/FeedbackButton";
import HelpButton from "./components/HelpButton";
import CoffeeButton from "./components/CoffeeButton";
import Disclaimer from "./components/Disclaimer";
import { getVisitCount } from "./utils/visitCount";
import { useLanguage } from "./context/LanguageContext";
import "./App.css";
import logo from "./assets/bus-logo.png";

function App() {
  const { t } = useLanguage();

  // These hold the student's current selections.
  const [routeId, setRouteId] = useState("");
  const [direction, setDirection] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [visits, setVisits] = useState(null);

  useEffect(() => {
    getVisitCount().then(setVisits);
  }, []);

  // Look up the full objects for whichever ids are selected,
  // so ScheduleResults can display labels without re-searching.
  const routeMeta = routes.find((r) => r.id === routeId);
  const periodMeta = periods.find((p) => p.id === periodId);

  // Only show results once all three choices are made.
  const showResults = routeId && direction && periodId;

  return (
    <>
      <svg className="glass-filter" aria-hidden="true">
        <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" seed="3" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="2" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <LanguageToggle />
      <FeedbackButton />
      <HelpButton />
      <CoffeeButton />
      <div className="app">
      <img
        src={logo}
        alt="TARUMT Logo"
        className="bus-logo"
      />
      <h1>TARUMT</h1>
      <h2>{t("appSubtitle")}</h2>
      <br></br>
      <p>
        {t("introText")}
      </p>
      <Disclaimer />
      <div style={{ height: "20px" }}></div> 

      <RouteSelect routes={routes} value={routeId} onChange={setRouteId} />
      <DirectionSelect value={direction} onChange={setDirection} />
      <PeriodSelect periods={periods} value={periodId} onChange={setPeriodId} />

      {showResults && (
        <ScheduleResults
          periodId={periodId}
          routeId={routeId}
          direction={direction}
          periodMeta={periodMeta}
          routeMeta={routeMeta}
        />
      )}

      {showResults && <ShareButtons visits={visits} />}

      <footer className="app-footer">
        <p className="footer-text">
          {t("footerDesigned")}
        </p>

        <p className="footer-text">{t("footerContactPrefix")} <i>joshuahaojie@gmail.com</i> {t("footerContactSuffix")}</p>
        <p className="footer-text"><i>{t("footerLastUpdated")} 23 Oct 2026</i></p>
      </footer>
      </div>
    </>
  );
}

export default App;