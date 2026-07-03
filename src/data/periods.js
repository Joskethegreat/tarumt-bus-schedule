// src/data/periods.js
//
// Each "period" represents one full schedule PDF/version.
// - id: unique short code, used to link to schedules.js later. DO NOT reuse an id.
// - label: what shows in the dropdown for students
// - type: "range" (valid between two dates) or "dates" (valid only on specific days)
// - validFrom / validTo: used when type is "range" (format: "YYYY-MM-DD")
// - validDates: used when type is "dates" — an array of exact dates
// - hasFriday: whether this period has a separate Friday schedule
// - hasSaturday: whether this period has a Saturday schedule

export const periods = [
  {
    id: "normal-sem-2026-1",
    label: "Normal Semester (15 Jun – 20 Sep 2026)",
    type: "range",
    validFrom: "2026-06-15",
    validTo: "2026-09-20",
    hasFriday: true,
    hasSaturday: false, // TODO: fill in true if Saturday schedule exists for this period
  },
  {
    id: "orientation-week-2026",
    label: "Orientation Week (8 Jun – 12 Jun 2026)",
    type: "range",
    validFrom: "2026-06-08",
    validTo: "2026-06-12",
    hasFriday: true,
    hasSaturday: false,
  },
  {
    id: "study-leave-may-2026",
    label: "Study Leave (4 May – 5 May 2026)",
    type: "range",
    validFrom: "2026-05-04",
    validTo: "2026-05-05",
    hasFriday: false, // TODO: check — was there a Friday in this range?
    hasSaturday: false,
  },
  {
    id: "exam-may-06-07-11",
    label: "May Exam — 06, 07 & 11 May 2026",
    type: "dates",
    validDates: ["2026-05-06", "2026-05-07", "2026-05-11"],
    hasFriday: false,
    hasSaturday: false,
  },
  {
    id: "exam-may-08-15-friday",
    label: "May Exam — Friday 08 & 15 May 2026",
    type: "dates",
    validDates: ["2026-05-08", "2026-05-15"],
    hasFriday: true, // this whole period IS a friday-only schedule
    hasSaturday: false,
  },
  {
    id: "exam-may-09-saturday",
    label: "May Exam — Saturday 09 May 2026",
    type: "dates",
    validDates: ["2026-05-09"],
    hasFriday: false,
    hasSaturday: true,
  },
  {
    id: "exam-may-12-13-14-18",
    label: "May Exam — 12, 13, 14 & 18 May 2026",
    type: "dates",
    validDates: ["2026-05-12", "2026-05-13", "2026-05-14", "2026-05-18"],
    hasFriday: false,
    hasSaturday: false,
  },
  {
    id: "exam-may-19",
    label: "May Exam — 19 May 2026",
    type: "dates",
    validDates: ["2026-05-19"],
    hasFriday: false,
    hasSaturday: false,
  },
  {
    id: "exam-may-20",
    label: "May Exam — 20 May 2026",
    type: "dates",
    validDates: ["2026-05-20"],
    hasFriday: false,
    hasSaturday: false,
  },
  {
    id: "sem-holiday-may-19-21",
    label: "Semester Holiday (until 21 May 2026)",
    type: "range",
    validFrom: "2026-05-19",
    validTo: "2026-05-21",
    hasFriday: false,
    hasSaturday: false,
  },
  {
    id: "sem-holiday-may-22-friday",
    label: "Semester Holiday — Friday 22 May 2026",
    type: "dates",
    validDates: ["2026-05-22"],
    hasFriday: true,
    hasSaturday: false,
  },
  {
    id: "sem-holiday-25may-05jun",
    label: "Semester Holiday (25 May – 5 Jun 2026, Mon–Fri)",
    type: "range",
    validFrom: "2026-05-25",
    validTo: "2026-06-05",
    hasFriday: true,
    hasSaturday: false,
  },

  // TODO: add any more periods you find in future schedule PDFs.
  // Just copy one of the blocks above and change the values.
];