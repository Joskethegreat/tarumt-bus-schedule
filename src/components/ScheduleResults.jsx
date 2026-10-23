import { useState } from "react";
import { schedules } from "../data/schedules";
import MapModal from "./MapModal";
import { useLanguage } from "../context/LanguageContext";
import { downloadSchedulePdf } from "../utils/schedulePdf";

// Shows the filtered bus times, with a Mon-Thu / Friday / Saturday toggle
// if the selected period has more than one day-group available.

export default function ScheduleResults({ periodId, routeId, direction, periodMeta, routeMeta }) {
  const { t } = useLanguage();
  const [dayGroup, setDayGroup] = useState("monThu");
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [saving, setSaving] = useState(false);

  async function savePdf() {
    setSaving(true);
    try {
      await downloadSchedulePdf({ periodMeta, routeMeta, direction, periodId, routeId });
    } finally {
      setSaving(false);
    }
  }

  // Look up the actual times from the nested schedules object.
  // Optional chaining (?.) prevents errors if data hasn't been filled in yet.
  const times = schedules?.[periodId]?.[routeId]?.[direction]?.[dayGroup] || [];

  // Figure out which day-group tabs to show, based on period metadata.
  const availableDayGroups = ["monThu"];
  if (periodMeta?.hasFriday) availableDayGroups.push("friday");
  if (periodMeta?.hasSaturday) availableDayGroups.push("saturday");

  const dayGroupLabels = {
    monThu: t("monThu"),
    friday: t("friday"),
    saturday: t("saturday"),
  };

  return (
    <div className="results">
      {/* Only show day-group tabs if there's more than one option */}
      {availableDayGroups.length > 1 && (
        <div className="tabs">
          {availableDayGroups.map((dg) => (
            <button
              key={dg}
              className={dg === dayGroup ? "tab active" : "tab"}
              onClick={() => setDayGroup(dg)}
              disabled={!schedules?.[periodId]?.[routeId]?.[direction]?.[dg]}
            >
              {dayGroupLabels[dg]}
            </button>
          ))}
        </div>
      )}

      <h3>{t("timeHeading")}</h3>
      {times.length === 0 ? (
        <p className="no-data">
          {t("noScheduleData")}
        </p>
      ) : (
        <ul className="time-list">
          {times.map((entry, index) => (
            <li key={index}>
              {entry.time}
              {entry.note ? (
                <>
                  <span className="note"> ({entry.note})</span>
                  {!entry.time && entry.note !== "Prayer break" && (
                    <div className="map-link-container">
                      <a
                        href="#"
                        className="map-link"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedNote(entry.note);
                          setMapOpen(true);
                        }}
                      >
                        {t("clickToViewRoute")}
                      </a>
                    </div>
                  )}
                </>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className="save-pdf"
        onClick={savePdf}
        disabled={saving}
        aria-label={t("savePdf")}
        title={t("savePdf")}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" />
        </svg>
      </button>

      <MapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}