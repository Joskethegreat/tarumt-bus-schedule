// Dropdown for choosing direction: To Campus or From Campus.

import { useLanguage } from "../context/LanguageContext";

export default function DirectionSelect({ value, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="field">
      <label htmlFor="direction-select">{t("routeTypeLabel")}</label>
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
