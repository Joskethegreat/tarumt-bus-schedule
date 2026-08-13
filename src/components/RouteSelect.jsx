// A simple dropdown for choosing a bus route.
// Props:
//  - routes: array from routes.js
//  - value: currently selected route id
//  - onChange: function to call when user picks a new route

import { useLanguage } from "../context/LanguageContext";

export default function RouteSelect({ routes, value, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="field">
      <label htmlFor="route-select">{t("busRouteLabel")}</label>
      <select
        id="route-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t("selectRoute")}</option>
        {routes.map((route) => (
          <option key={route.id} value={route.id}>
            {route.label}
          </option>
        ))}
      </select>
    </div>
  );
}
