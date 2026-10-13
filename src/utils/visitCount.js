// Free hosted counter (abacus). Counts one visit per browser session;
// returns null if the service is unreachable so the UI can simply hide it.
const BASE = "https://abacus.jasoncameron.dev";
const KEY = "joskethegreat-tarumt-bus-schedule/visits";
const FLAG = "tarumt-bus-counted";

export async function getVisitCount() {
  let counted = false;
  try {
    counted = sessionStorage.getItem(FLAG) === "1";
  } catch {
    // storage unavailable: treat as a new visit
  }
  try {
    const res = await fetch(`${BASE}/${counted ? "get" : "hit"}/${KEY}`);
    const data = await res.json();
    if (typeof data.value !== "number") return null;
    try {
      sessionStorage.setItem(FLAG, "1");
    } catch {
      // ignore
    }
    return data.value;
  } catch {
    return null;
  }
}
