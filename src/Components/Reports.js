import { useMemo } from "react";
import "./Reports.css";
import { loadLots } from "../api/storage.js";
import BarChart from "./BarChart";

function groupCount(lots, keyFn) {
  const m = new Map();
  for (const l of lots) {
    const k = keyFn(l);
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].map(([label, value]) => ({ label, value }));
}

function groupKg(lots, keyFn) {
  const m = new Map();
  for (const l of lots) {
    const k = keyFn(l);
    const kg = Number(l.qtyKg ?? l.quantityKg ?? 0);
    m.set(k, (m.get(k) || 0) + kg);
  }
  return [...m.entries()].map(([label, value]) => ({ label, value }));
}

export default function Reports() {
  const lots = loadLots();

  const totals = useMemo(() => {
    const totalLots = lots.length;
    const totalKg = lots.reduce((s, l) => s + Number(l.qtyKg ?? l.quantityKg ?? 0), 0);
    const created = lots.filter((l) => (l.status || "") === "CREATED").length;
    const inTransit = lots.filter((l) => (l.status || "") === "IN_TRANSIT").length;
    const received = lots.filter((l) => (l.status || "") === "RECEIVED").length;
    return { totalLots, totalKg, created, inTransit, received };
  }, [lots]);

  const statusData = useMemo(() => {
    const order = ["CREATED", "IN_TRANSIT", "RECEIVED", "RECALLED"];
    const counts = groupCount(lots, (l) => l.status || "UNKNOWN");
    counts.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
    return counts;
  }, [lots]);

  const categoryKg = useMemo(() => {
    const kg = groupKg(lots, (l) => l.category || "Unknown");
    kg.sort((a, b) => b.value - a.value);
    return kg;
  }, [lots]);

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Analytics view of lots, movement, and workload.</p>
      </div>

      <div className="grid-4">
        <div className="card">
          <div className="stat-label">Total lots</div>
          <div className="stat-value">{totals.totalLots}</div>
          <div className="muted">All time</div>
        </div>
        <div className="card">
          <div className="stat-label">Total weight</div>
          <div className="stat-value">{Math.round(totals.totalKg * 10) / 10} kg</div>
          <div className="muted">All time</div>
        </div>
        <div className="card">
          <div className="stat-label">In transit</div>
          <div className="stat-value">{totals.inTransit}</div>
          <div className="muted">Currently moving</div>
        </div>
        <div className="card">
          <div className="stat-label">Received</div>
          <div className="stat-value">{totals.received}</div>
          <div className="muted">Completed custody</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Lots by status</h2>
              <p className="card-subtitle">Counts across statuses.</p>
            </div>
          </div>
          <div className="chart-wrap chart-tall">
            <BarChart points={statusData} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Kg by category</h2>
              <p className="card-subtitle">Where volume is coming from.</p>
            </div>
          </div>
          <div className="chart-wrap chart-tall">
            <BarChart points={categoryKg} />
          </div>
        </div>
      </div>
    </div>
  );
}
