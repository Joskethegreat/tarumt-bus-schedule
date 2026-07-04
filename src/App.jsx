import { useState } from "react";
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

  // Look up the full objects for whichever ids are selected,
  // so ScheduleResults can display labels without re-searching.
  const routeMeta = routes.find((r) => r.id === routeId);
  const periodMeta = periods.find((p) => p.id === periodId);

  // Only show results once all three choices are made.
  const showResults = routeId && direction && periodId;

  return (
    <div className="app">
      <img src={logo} alt="TARUMT Logo" className="bus-logo" />
      <h1>TARUMT</h1>
      <h2>Bus Schedule</h2>
      <br></br>
      <p>
        Search your bus schedule easily. <br></br> <i>(Disclaimer: This is not an official TARUMT website; schedules may not be up to date!)</i><br></br>
      </p>
      

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
      <p style={{ color: "#585858" }}>
        Designed by Joshua Lau.
        
      </p>

      <p><br></br>Please contact <i>joshuahaojie@gmail.com</i> to report any issues or suggestions.</p>
      <p><br></br><i>Last updated: 7 Jul 2026</i><br></br></p>
    </div>
  );
}

export default App;