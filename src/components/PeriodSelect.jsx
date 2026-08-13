// Dropdown for choosing which semester/exam/holiday period applies.

import { useLanguage } from "../context/LanguageContext";

export default function PeriodSelect({ periods, value, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="field">
      <label htmlFor="period-select">{t("semesterTypeLabel")}</label>
      <select
        id="period-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{t("selectDate")}</option>
        {periods.map((period) => (
          <option key={period.id} value={period.id}>
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
}
