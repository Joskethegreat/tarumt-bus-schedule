// A simple dropdown for choosing a bus route.
// Props:
//  - routes: array from routes.js
//  - value: currently selected route id
//  - onChange: function to call when user picks a new route

export default function RouteSelect({ routes, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor="route-select">Bus Route</label>
      <select
        id="route-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a Route</option>
        {routes.map((route) => (
          <option key={route.id} value={route.id}>
            {route.label}
          </option>
        ))}
      </select>
    </div>
  );
}