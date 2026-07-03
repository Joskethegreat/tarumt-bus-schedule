// Dropdown for choosing which semester/exam/holiday period applies.

export default function PeriodSelect({ periods, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="period-select">Semester Type</label>
      <select
        id="period-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Date</option>
        {periods.map((period) => (
          <option key={period.id} value={period.id}>
            {period.label}
          </option>
        ))}
      </select>
    </div>
  );
}