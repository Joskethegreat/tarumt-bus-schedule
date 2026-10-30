// Dropdown for choosing direction: To Campus or From Campus.

import { useLanguage } from "../context/LanguageContext";
import RouteTypeInfo from "./RouteTypeInfo";

export default function DirectionSelect({ value, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="field">
      <div className="label-row">
        <label htmlFor="direction-select">{t("routeTypeLabel")}</label>
        <RouteTypeInfo />
      </div>
      <select
        id="direction-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t("selectRouteType")}</option>
        <option value="toCampus">{t("toCampus")}</option>
        <option value="fromCampus">{t("fromCampus")}</option>
      </select>
    </div>
  );
}
