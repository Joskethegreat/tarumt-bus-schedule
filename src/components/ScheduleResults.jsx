import { useState } from "react";
import { schedules } from "../data/schedules";

// Shows the filtered bus times, with a Mon-Thu / Friday / Saturday toggle
// if the selected period has more than one day-group available.

export default function ScheduleResults({ periodId, routeId, direction, periodMeta, routeMeta }) {
  const [dayGroup, setDayGroup] = useState("monThu");

  // Look up the actual times from the nested schedules object.
  // Optional chaining (?.) prevents errors if data hasn't been filled in yet.
  const times = schedules?.[periodId]?.[routeId]?.[direction]?.[dayGroup] || [];

  // Figure out which day-group tabs to show, based on period metadata.
  const availableDayGroups = ["monThu"];
  if (periodMeta?.hasFriday) availableDayGroups.push("friday");
  if (periodMeta?.hasSaturday) availableDayGroups.push("saturday");

  const dayGroupLabels = {
    monThu: "Monday - Thursday",
    friday: "Friday",
    saturday: "Saturday",
  };

  return (
    <div className="results">
      <div className="route-info">
        <p><strong>Bus Route:</strong> {routeMeta?.label} ({direction === "toCampus" ? "To Campus" : "From Campus"})</p>
        <p><strong>Semester Type:</strong> {periodMeta?.label}</p>
      </div>

      {/* Only show day-group tabs if there's more than one option */}
      {availableDayGroups.length > 1 && (
        <div className="tabs">
          {availableDayGroups.map((dg) => (
            <button
              key={dg}
              className={dg === dayGroup ? "tab active" : "tab"}
              onClick={() => setDayGroup(dg)}
            >
              {dayGroupLabels[dg]}
            </button>
          ))}
        </div>
      )}

      <h3>Time:</h3>
      {times.length === 0 ? (
        <p className="no-data">
          No schedule data entered yet for this combination.
        </p>
      ) : (
        <ul className="time-list">
          {times.map((entry, index) => (
            <li key={index}>
              {entry.time}
              {entry.note ? <span className="note"> ({entry.note})</span> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}