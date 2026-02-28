export function suggestionForCategory(category) {
  if (category === "Frozen") return "Frozen: store safely for longer, redistribute when scheduled.";
  if (category === "Semi-perishable") return "Semi-perishable: redistribute quickly, short pickup windows.";
  return "Perishable: immediate processing into animal feed pathway.";
}

export function computeImpact(lots) {
  const totalKg = lots.reduce((sum, l) => sum + Number(l.quantityKg || 0), 0);

  // Demo placeholders (replace with research-backed formulas later)
  const co2Kg = Math.round(totalKg * 2.3);
  const animalsFed = lots
    .filter((l) => l.route === "Animal feed")
    .reduce((sum, l) => sum + Math.round(Number(l.quantityKg || 0) * 3), 0);

  const points = lots
    .filter((l) => l.route === "Animal feed")
    .reduce((sum, l) => sum + Math.round(Number(l.quantityKg || 0) * 2), 0);

  return { totalKg, co2Kg, animalsFed, points };
}

export function statusPillClass(status) {
  if (status === "CREATED") return "pill warn";
  if (status === "IN_TRANSIT") return "pill warn";
  if (status === "RECEIVED") return "pill good";
  if (status === "PROCESSED") return "pill good";
  return "pill";
}