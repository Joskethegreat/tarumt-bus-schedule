// Dropdown for choosing direction: To Campus or From Campus.

export default function DirectionSelect({ value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="direction-select">Route Type</label>
      <select
        id="direction-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Route Type</option>
        <option value="toCampus">To Campus</option>
        <option value="fromCampus">From Campus</option>
      </select>
    </div>
  );
}