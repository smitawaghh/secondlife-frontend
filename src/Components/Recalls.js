import { useMemo, useState } from "react";
import "./Recalls.css";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth/auth.js";

const LS_KEY = "slf_lots_v1";

function loadLots() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLots(lots) {
  localStorage.setItem(LS_KEY, JSON.stringify(lots));
}

function nowISO() {
  return new Date().toISOString();
}

function formatDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function StatusPill({ status }) {
  const s = (status || "UNKNOWN").toUpperCase();
  const cls =
    s === "RECEIVED" || s === "PROCESSED"
      ? "pill good"
      : s === "IN_TRANSIT" || s === "CREATED"
      ? "pill warn"
      : s === "RECALLED"
      ? "pill bad"
      : "pill";
  return <span className={cls}>{s}</span>;
}

export default function Recalls() {
  const navigate = useNavigate();
  const user = getUser();
  const role = user?.role || "ADMIN";
  const actor = user?.name || "User";

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL");
  const [onlyRecalled, setOnlyRecalled] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  const [reason, setReason] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [err, setErr] = useState("");

  const lots = useMemo(() => loadLots(), []);
  const [data, setData] = useState(lots);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return data
      .filter((l) => {
        if (onlyRecalled) return (l.status || "").toUpperCase() === "RECALLED";
        return true;
      })
      .filter((l) => {
        if (status === "ALL") return true;
        return (l.status || "").toUpperCase() === status;
      })
      .filter((l) => {
        if (!text) return true;
        const hay =
          `${l.id} ${l.foodName} ${l.category} ${l.donorName} ${l.pickup?.city} ${l.pickup?.pincode}`.toLowerCase();
        return hay.includes(text);
      });
  }, [data, q, status, onlyRecalled]);

  const canFlag = role === "ADMIN";

  function refresh() {
    setData(loadLots());
  }

  function applyRecall() {
    setErr("");
    if (!canFlag) {
      setErr("Only admin can flag recalls.");
      return;
    }
    if (!selectedId) {
      setErr("Select a lot to flag.");
      return;
    }
    if (!reason.trim()) {
      setErr("Recall reason is required.");
      return;
    }

    const lotsNow = loadLots();
    const idx = lotsNow.findIndex((x) => String(x.id) === String(selectedId));
    if (idx === -1) {
      setErr("Lot not found. Refresh and try again.");
      return;
    }

    const lot = lotsNow[idx];

    const recallEvent = {
      at: nowISO(),
      event: "RECALLED",
      by: actor,
      note: `Severity: ${severity}. ${reason.trim()}`,
    };

    const updated = {
      ...lot,
      status: "RECALLED",
      updatedAt: nowISO(),
      recall: {
        flaggedAt: recallEvent.at,
        flaggedBy: actor,
        severity,
        reason: reason.trim(),
      },
      custody: Array.isArray(lot.custody) ? [recallEvent, ...lot.custody] : [recallEvent],
    };

    lotsNow[idx] = updated;
    saveLots(lotsNow);

    setData(lotsNow);
    setSelectedId("");
    setReason("");
    setSeverity("Medium");
  }

  function clearRecall(lotId) {
    setErr("");
    if (!canFlag) return;

    const ok = window.confirm("Clear recall status for this lot?");
    if (!ok) return;

    const lotsNow = loadLots();
    const idx = lotsNow.findIndex((x) => String(x.id) === String(lotId));
    if (idx === -1) return;

    const lot = lotsNow[idx];

    const clearEvent = {
      at: nowISO(),
      event: "RECALL_CLEARED",
      by: actor,
      note: "Recall cleared",
    };

    const updated = {
      ...lot,
      status: lot?.statusBeforeRecall || "CREATED",
      updatedAt: nowISO(),
      recall: null,
      custody: Array.isArray(lot.custody) ? [clearEvent, ...lot.custody] : [clearEvent],
    };

    lotsNow[idx] = updated;
    saveLots(lotsNow);
    setData(lotsNow);
  }

  const hasLots = data.length > 0;

  return (
    <div className="stack">
      <div className="pagehead">
        <div>
          <h1 className="page-title">Recalls</h1>
          <p className="page-subtitle">
            Flag lots for recall to prevent distribution and trace affected custody chains.
          </p>
        </div>
        <div className="pagehead-actions">
          <button className="btn ghost" onClick={refresh}>Refresh</button>
          <button className="btn primary" onClick={() => navigate("/lots/new")}>Create Lot</button>
        </div>
      </div>

      {!hasLots ? (
        <div className="card">
          <h2 className="card-title">No lots found</h2>
          <p className="card-subtitle" style={{ marginTop: 8 }}>
            Create a lot first to enable recall workflows and traceability.
          </p>
          <div className="row">
            <button className="btn primary" onClick={() => navigate("/lots/new")}>Create Lot</button>
            <button className="btn ghost" onClick={() => navigate("/")}>Go to Dashboard</button>
          </div>
        </div>
      ) : (
        <>
          {/* Admin recall tool */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Flag a lot for recall</h2>
                <p className="card-subtitle">Admin only. Adds a RECALL event and sets status to RECALLED.</p>
              </div>
              <span className={canFlag ? "pill good" : "pill"}>{canFlag ? "Admin" : "Read only"}</span>
            </div>

            <div className="grid-2" style={{ marginTop: 12 }}>
              <div className="field">
                <label>Lot</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  disabled={!canFlag}
                >
                  <option value="">Select a lot</option>
                  {data.map((l) => (
                    <option key={l.id} value={l.id}>
                      #{l.id} • {l.foodName} • {String(l.status || "").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Severity</label>
                <select value={severity} onChange={(e) => setSeverity(e.target.value)} disabled={!canFlag}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Recall reason</label>
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Example: Packaging breach reported. Potential contamination risk."
                  disabled={!canFlag}
                />
              </div>
            </div>

            {err ? <div className="error">{err}</div> : null}

            <div className="wizard-footer">
              <div className="left">
                <button className="btn ghost" onClick={() => { setSelectedId(""); setReason(""); setSeverity("Medium"); setErr(""); }}>
                  Reset
                </button>
              </div>
              <div className="right">
                <button className="btn primary" onClick={applyRecall} disabled={!canFlag}>
                  Flag Recall
                </button>
              </div>
            </div>
          </div>

          {/* Filters + register */}
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recall register</h2>
                <p className="card-subtitle">Search and filter lots. Click a lot to view full custody.</p>
              </div>
            </div>

            <div className="grid-3" style={{ marginTop: 12 }}>
              <div className="field">
                <label>Search</label>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Lot ID, food, donor, city, pincode"
                />
              </div>

              <div className="field">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="ALL">All</option>
                  <option value="CREATED">CREATED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="RECEIVED">RECEIVED</option>
                  <option value="PROCESSED">PROCESSED</option>
                  <option value="RECALLED">RECALLED</option>
                </select>
              </div>

              <div className="field">
                <label>View</label>
                <select
                  value={onlyRecalled ? "RECALLED_ONLY" : "ALL_LOTS"}
                  onChange={(e) => setOnlyRecalled(e.target.value === "RECALLED_ONLY")}
                >
                  <option value="ALL_LOTS">All lots</option>
                  <option value="RECALLED_ONLY">Recalled only</option>
                </select>
              </div>
            </div>

            <div className="table" style={{ marginTop: 14 }}>
              <div className="trow thead">
                <div>Lot</div>
                <div>Food</div>
                <div>Pickup</div>
                <div>Status</div>
              </div>

              {filtered.length === 0 ? (
                <div className="trow">
                  <div style={{ gridColumn: "1 / -1" }} className="muted">
                    No matching lots. Try clearing filters.
                  </div>
                </div>
              ) : (
                filtered.map((l) => (
                  <button
                    key={l.id}
                    className="trow tbtn"
                    onClick={() => navigate(`/lots/${l.id}`)}
                    type="button"
                  >
                    <div>
                      <div style={{ fontWeight: 900 }}>#{l.id}</div>
                      <div className="small muted">{formatDate(l.createdAt)}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{l.foodName}</div>
                      <div className="small muted">{l.category} • {l.qtyKg} kg</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{l.pickup?.city || "-"}</div>
                      <div className="small muted">{l.pickup?.pincode || "-"}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between" }}>
                      <StatusPill status={l.status} />
                      {canFlag && String(l.status || "").toUpperCase() === "RECALLED" ? (
                        <button
                          className="btn ghost"
                          onClick={(e) => { e.stopPropagation(); clearRecall(l.id); }}
                          type="button"
                        >
                          Clear
                        </button>
                      ) : null}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
