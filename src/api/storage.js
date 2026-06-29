// src/api/storage.js
const KEY = "slf_lots_v1";

export function loadLots() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLots(lots) {
  localStorage.setItem(KEY, JSON.stringify(lots));
}

export function clearAll() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("slf:lots-updated"));
}

export function addLot(lot) {
  const lots = loadLots();
  lots.unshift(lot);
  saveLots(lots);
  window.dispatchEvent(new Event("slf:lots-updated"));
}

export function getLotById(lotId) {
  const lots = loadLots();
  return lots.find((l) => String(l.id) === String(lotId)) || null;
}

export function updateLot(lotId, updater) {
  const lots = loadLots();
  const idx = lots.findIndex((l) => String(l.id) === String(lotId));
  if (idx === -1) return null;

  const current = lots[idx];
  const next = typeof updater === "function" ? updater(current) : updater;

  lots[idx] = next;
  saveLots(lots);
  window.dispatchEvent(new Event("slf:lots-updated"));
  return next;
}