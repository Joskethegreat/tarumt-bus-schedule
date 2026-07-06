import { useState, useEffect, useRef } from "react";
import { periods } from "./data/periods";
import { routes } from "./data/routes";
import RouteSelect from "./components/RouteSelect";
import DirectionSelect from "./components/DirectionSelect";
import PeriodSelect from "./components/PeriodSelect";
import ScheduleResults from "./components/ScheduleResults";
import "./App.css";
import logo from "./assets/bus-logo.png";

function App() {
  // These hold the student's current selections.
  const [routeId, setRouteId] = useState("");
  const [direction, setDirection] = useState("");
  const [periodId, setPeriodId] = useState("");
  const [busOffset, setBusOffset] = useState(0);
  const [busOffsetBottom, setBusOffsetBottom] = useState(0);
  const busLogoRef = useRef(null);

  // Look up the full objects for whichever ids are selected,
  // so ScheduleResults can display labels without re-searching.
  const routeMeta = routes.find((r) => r.id === routeId);
  const periodMeta = periods.find((p) => p.id === periodId);

  // Only show results once all three choices are made.
  const showResults = routeId && direction && periodId;

  // Handle bus animation based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      const maxOffset = window.innerWidth;
      // Top bus: moves right as you scroll (0 to maxOffset)
      setBusOffset(scrollProgress * maxOffset);
      // Bottom bus: starts far left, moves to center (negative to 0)
      setBusOffsetBottom(-maxOffset + (scrollProgress * maxOffset));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="app">
      <img
        ref={busLogoRef}
        src={logo}
        alt="TARUMT Logo"
        className="bus-logo"
        style={{
          transform: `translateX(${busOffset/3}px)`,
        }}
      />
      <h1>TARUMT</h1>
      <h2>Bus Schedule Finder</h2>
      <br></br>
      <p>
        Search your bus schedule easily. 
      </p>
      <p>
        <i>(Disclaimer: This is not an official TARUMT website; schedules and routes may be inaccurate!)</i>
      </p>
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

      {showResults && (
        <img
          src={logo}
          alt="TARUMT Bus"
          className="bus-logo-bottom"
          style={{
            transform: `translateX(${busOffsetBottom/3}px)`,
          }}
        />
      )}

      <footer className="app-footer">
        <p className="footer-text">
          Designed by Joshua Lau.
        </p>

        <p className="footer-text">Please contact <i>joshuahaojie@gmail.com</i> to report any issues or suggestions.</p>
        <p className="footer-text"><i>Last updated: 7 Jul 2026</i></p>
      </footer>
      </div>
    </>
  );
}

export default App;