// src/data/routes.js
//
// Defines the bus routes (zones). Keep this separate from times so it's
// easy to see all routes at a glance. "stops" is just for display —
// it's the list of places the bus passes, shown to the student.z

export const routes = [
  {
    id: "wangsa-maju",
    label: "Wangsa Maju",
    stopsToCampus: [
      "Wangsa Maju Section 2",
      "Hospital ATM Tuanku Mizan",
      "Perhentian Bas Wangsa Metroview",
      "LRT Wangsa Maju",
      "Tarvilla",
      "Gate 7 TAR UMT",
      "East Campus",
    ],
    stopsFromCampus: [
      "South Entrance Drop Off 2",
      "Arena",
      "Tarvilla",
      "LRT Wangsa Maju",
      "Hospital ATM Tunku Mizan",
      "Bus Stop Metroview",
    ],
  },
  {
    id: "melati-utama",
    label: "Melati Utama",
    stopsToCampus: [
      "Melati Utama",
      "Junction MU",
      "DK Suites Apt",
      "PV10",
      "Gate 7 TAR UMT",
      "East Campus",
    ],
    stopsFromCampus: [
      "Bus Stop 3",
      "Melati Utama",
      "Junction MU",
      "DK Suites Apt",
      "PV12/10",
      "Gate 7 TAR UMT",
    ],
  },
  {
    id: "pv18-teratai",
    label: "PV18 / Teratai Residency / GK",
    stopsToCampus: [
      "PV18",
      "Teratai Residency Condo",
      "Prima Setapak",
      "Whole Fruit Market",
      "Setapak Central",
      "Gate 7 TAR UMT",
      "East Campus",
    ],
    stopsFromCampus: [
      "Bus Stop 4",
      "PV9",
      "DK Suite Apt",
      "PV12",
      "PV18",
      "Teratai Residency",
      "Prima Setapak",
      "The Nest",
      "Setapak Central",
    ],
  },
  {
    id: "pv10-12-15-16",
    label: "PV10 / 12 / 13 / 15 / 16",
    stopsToCampus: [
      "PV12/10",
      "Setapak Central",
      "Gate 7 TAR UMT",
      "East Campus",
    ],
    stopsFromCampus: [
      "Bus Stop 1",
      "Setapak Central",
      "PV12/10",
      "Gate 7 East Campus",
    ],
  },

  // TODO: adjust stop lists to match the PDFs exactly if you want more detail.
];