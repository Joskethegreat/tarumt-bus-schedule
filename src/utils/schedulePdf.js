import { schedules } from "../data/schedules";

const DAYS = [
  { key: "monThu", label: "Monday - Thursday", color: [143, 170, 150] }, // sage
  { key: "friday", label: "Friday", color: [196, 150, 150] }, // dusty rose
  { key: "saturday", label: "Saturday", color: [150, 150, 190] }, // soft lavender
];

const PAPER = [245, 242, 235]; // warm sand
const BAND = [120, 142, 165]; // dusty blue
const INK = [58, 63, 71];
const MUTED = [112, 118, 128];

const tint = ([r, g, b], amount) => [
  Math.round(r + (255 - r) * amount),
  Math.round(g + (255 - g) * amount),
  Math.round(b + (255 - b) * amount),
];

// Builds "Bus Schedule.pdf" for one route + direction + period, with each day
// group laid out as its own column. English-only: the built-in PDF fonts can't
// draw Chinese, and the schedule data itself is English.
export async function downloadSchedulePdf({ periodMeta, routeMeta, direction, periodId, routeId }) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 12;
  const gap = 5;
  const bottom = pageH - 16;
  const bandH = 32;

  const paintPage = (first) => {
    doc.setFillColor(...PAPER);
    doc.rect(0, 0, pageW, pageH, "F");
    if (first) {
      doc.setFillColor(...BAND);
      doc.rect(0, 0, pageW, bandH, "F");
    }
  };

  paintPage(true);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("TARUMT Bus Schedule", margin, 14);
  doc.setFontSize(11);
  doc.text(
    `${routeMeta?.label ?? routeId}  |  ${direction === "toCampus" ? "To Campus" : "From Campus"}`,
    margin,
    21
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(periodMeta?.label ?? periodId, margin, 27);

  const days = DAYS.filter((d) => schedules?.[periodId]?.[routeId]?.[direction]?.[d.key]?.length);

  if (days.length === 0) {
    doc.setTextColor(...INK);
    doc.setFontSize(11);
    doc.text("No schedule data entered yet for this combination.", margin, bandH + 12);
  }

  const usable = pageW - margin * 2;
  const colW = Math.min(88, (usable - gap * (days.length - 1)) / Math.max(days.length, 1));
  const startY = bandH + 8;

  // Each column keeps its own page + cursor, so a long day can continue on the
  // next page without disturbing the shorter ones.
  days.forEach((day, i) => {
    const x = margin + i * (colW + gap);
    const col = { page: 1, y: startY };

    const goTo = (needed) => {
      if (col.y + needed > bottom) {
        col.page += 1;
        while (doc.getNumberOfPages() < col.page) {
          doc.addPage();
          paintPage(false);
        }
        col.y = margin;
      }
      doc.setPage(col.page);
    };

    const header = () => {
      goTo(10);
      doc.setFillColor(...day.color);
      doc.roundedRect(x, col.y, colW, 8, 2, 2, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(day.label, x + colW / 2, col.y + 5.4, { align: "center" });
      col.y += 11;
    };

    doc.setPage(1);
    header();

    let stripe = 0;
    for (const entry of schedules[periodId][routeId][direction][day.key]) {
      if (!entry.time) {
        // Note-only row: a stop sequence or a break.
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        const lines = doc.splitTextToSize(entry.note, colW - 6);
        const h = lines.length * 3.3 + 3.5;
        goTo(h);
        doc.setFillColor(...tint(day.color, 0.72));
        doc.roundedRect(x, col.y, colW, h, 1.5, 1.5, "F");
        doc.setTextColor(...MUTED);
        doc.text(lines, x + 3, col.y + 4);
        col.y += h + 2;
        stripe = 0;
        continue;
      }

      goTo(6.4);
      if (stripe % 2 === 0) {
        doc.setFillColor(...tint(day.color, 0.85));
        doc.rect(x, col.y - 0.6, colW, 6.2, "F");
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...INK);
      doc.text(entry.time, x + colW / 2, col.y + 3.8, { align: "center" });
      if (entry.note) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(entry.note, x + colW - 3, col.y + 3.8, { align: "right", maxWidth: colW / 2 - 12 });
      }
      col.y += 6.2;
      stripe += 1;
    }
  });

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(
      "Not an official TARUMT document. Schedules and routes may be inaccurate.",
      margin,
      pageH - 8
    );
    doc.text(`${p} / ${pages}`, pageW - margin, pageH - 8, { align: "right" });
  }

  doc.save("Bus Schedule.pdf");
}
