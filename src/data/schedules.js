// src/data/schedules.js
//
// This is where the ACTUAL BUS TIMES live.
// Structure: schedules[periodId][routeId][direction][dayGroup] = array of times
//
// - periodId: must match an "id" from periods.js
// - routeId: must match an "id" from routes.js
// - direction: "toCampus" or "fromCampus"
// - dayGroup: "monThu", "friday", or "saturday"
// - each time entry: { time: "7:10 AM", note: "" }
//     note is optional — use it for things like "(LRT)" or "(PV10)" tags
//     seen in the original PDF, e.g. { time: "7:10 AM", note: "LRT" }
//
// IMPORTANT: keep times as 12-hour strings for now ("7:10 AM") — simplest
// for you to type in directly from the PDF without conversion mistakes.

export const schedules = {
  "normal-sem-2026-1": {
    "wangsa-maju": {
      toCampus: {
        monThu: [
          { time: "7:10 AM", note: "LRT" },
          { time: "7:20 AM" },
          { time: "7:30 AM" },
          { time: "7:45 AM" },
          { time: "8:00 AM" },
          { time: "8:15 AM" },
          { time: "8:30 AM" },
          { time: "8:45 AM" },
          { time: "9:00 AM" },
          { time: "9:15 AM" },
          { time: "9:30 AM" },
          { time: "9:45 AM" },
          { time: "10:00 AM" },
          // TODO: continue filling in the rest of the Wangsa Maju
          // "TO CAMPUS" Mon-Thu times from the schedule image.
        ],
        friday: [
          { time: "7:20 AM" },
          { time: "7:35 AM" },
          { time: "7:45 AM" },
          // TODO: fill in remaining Friday "TO CAMPUS" times
        ],
      },
      fromCampus: {
        monThu: [
          { time: "10:15 AM" },
          { time: "10:30 AM" },
          { time: "10:45 AM" },
          { time: "11:00 AM" },
          { time: "11:15 AM" },
          { time: "11:30 AM" },
          // TODO: continue filling in remaining Mon-Thu "FROM CAMPUS" times
        ],
        friday: [
          { time: "10:00 AM" },
          { time: "10:20 AM" },
          { time: "10:30 AM" },
          { time: "10:40 AM" },
          // TODO: fill in remaining Friday "FROM CAMPUS" times
        ],
      },
    },

    "melati-utama": {
      toCampus: {
        monThu: [
          // TODO: fill in from the "MELATI UTAMA" column, Normal Semester, Mon-Thu, To Campus
        ],
        friday: [
          // TODO
        ],
      },
      fromCampus: {
        monThu: [
          // TODO
        ],
        friday: [
          // TODO
        ],
      },
    },

    "pv18-teratai": {
      toCampus: { monThu: [/* TODO */], friday: [/* TODO */] },
      fromCampus: { monThu: [/* TODO */], friday: [/* TODO */] },
    },

    "pv10-12-15-16": {
      toCampus: { monThu: [/* TODO */], friday: [/* TODO */] },
      fromCampus: { monThu: [/* TODO */], friday: [/* TODO */] },
    },
  },

  // TODO: repeat this whole pattern for every other period in periods.js —
  // "orientation-week-2026", "study-leave-may-2026", "exam-may-06-07-11", etc.
  // Copy the "normal-sem-2026-1" block above, rename the key, and fill in
  // times from the matching PDF page. Leave empty arrays [] for combinations
  // that don't exist (e.g. Saturday for a period with hasSaturday: false —
  // you can just omit that dayGroup entirely).
};