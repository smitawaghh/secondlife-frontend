import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth/auth.js";

const LS_KEY = "slf_lots_v1";

function loadLots() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function statusLabel(s) { return String(s || "UNKNOWN").toUpperCase(); }

function formatShortDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getLastUpdated(lot) {
  return lot.updatedAt || lot.createdAt || (lot.custody?.[0]?.at ?? null);
}

function getLotKg(lot) {
  const v = lot.qtyKg ?? lot.quantityKg ?? 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function StatusPill({ status }) {
  const s = statusLabel(status);
  let cls = "status-pill";
  if (s === "RECEIVED" || s === "PROCESSED" || s === "DELIVERED") cls += " ok";
  else if (s === "SCREENING" || s === "CREATED" || s === "IN_TRANSIT") cls += " mid";
  else if (s === "RECALLED") cls += " bad";
  else cls += " neutral";
  return <span className={cls}>{s.replaceAll("_", " ")}</span>;
}

function buildNotifications(lots) {
  const out = [];
  for (const lot of lots) {
    for (const e of (lot.custody || []).slice(0, 2)) {
      out.push({ at: e.at, event: e.event || e.type || "UPDATED", lotId: lot.id });
    }
  }
  return out
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 4);
}

function pickNextPickup(lots) {
  return lots
    .filter((l) => statusLabel(l.status) === "CREATED" && l.pickup?.date)
    .map((l) => ({ lot: l, t: new Date(`${l.pickup.date}T${l.pickup.start || "09:00"}`).getTime() }))
    .filter((x) => !Number.isNaN(x.t))
    .sort((a, b) => a.t - b.t)[0]?.lot || null;
}

function buildMonthlyKgSeries(lots, months = 6) {
  const now = new Date();
  const keys = [], labels = [];
  const map = new Map();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    keys.push(k);
    labels.push(d.toLocaleDateString(undefined, { month: "short" }));
    map.set(k, 0);
  }
  for (const lot of lots) {
    const dt = new Date(getLastUpdated(lot) || 0);
    if (Number.isNaN(dt.getTime())) continue;
    const k = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
    if (map.has(k)) map.set(k, map.get(k) + getLotKg(lot));
  }
  return { labels, values: keys.map((k) => map.get(k) || 0) };
}

function Sparkline({ labels, values }) {
  const w = 260, h = 80, padX = 10, padY = 14;
  const max = Math.max(1, ...values), min = Math.min(0, ...values);
  const xStep = values.length <= 1 ? 0 : (w - padX * 2) / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = padX + i * xStep;
    const t = (v - min) / (max - min || 1);
    const y = (h - padY) - t * (h - padY * 2);
    return { x, y };
  });
  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD = `${lineD} L${(padX + (values.length - 1) * xStep).toFixed(1)} ${h} L${padX} ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" aria-hidden="true">
      <path d={lineD} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d={areaD} fill="currentColor" opacity="0.12" />
      <g className="sparkline-axis">
        {labels.map((lab, i) => {
          const x = padX + i * xStep;
          if (i === 0 || i === labels.length - 1 || i === Math.floor(labels.length / 2)) {
            return <text key={lab + i} x={x} y="76" textAnchor="middle">{lab}</text>;
          }
          return null;
        })}
      </g>
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const role = user?.role || "ADMIN";
  const name = user?.name || role.charAt(0) + role.slice(1).toLowerCase();
  const firstName = name.split(" ")[0];

  const [query, setQuery] = useState("");

  const lotsRaw = useMemo(() => loadLots(), []);
  const lots = useMemo(
    () => [...lotsRaw].sort((a, b) =>
      new Date(getLastUpdated(b) || 0).getTime() - new Date(getLastUpdated(a) || 0).getTime()
    ),
    [lotsRaw]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lots.slice(0, 5);
    return lots.filter((l) =>
      `${l.id} ${l.foodName} ${l.category} ${l.status} ${l.pickup?.city || ""}`.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [lots, query]);

  const stats = useMemo(() => {
    const totalLots  = lots.length;
    const totalKg    = lots.reduce((a, l) => a + getLotKg(l), 0);
    const activeLots = lots.filter((l) => l.status === "CREATED" || l.status === "IN_TRANSIT").length;
    const completed  = lots.filter((l) => l.status === "RECEIVED" || l.status === "PROCESSED").length;
    return { totalLots, totalKg, activeLots, completed };
  }, [lots]);

  const notifications = useMemo(() => buildNotifications(lots), [lots]);
  const nextPickup    = useMemo(() => pickNextPickup(lots), [lots]);
  const spark         = useMemo(() => buildMonthlyKgSeries(lots, 6), [lots]);

  function handleSearchClick() {
    const q = query.trim();
    if (!q) return;
    const m = q.match(/(\d{3,})/);
    const id = m ? m[1] : null;
    if (!id) return;
    const found = lots.find((l) => String(l.id) === String(id));
    if (found) navigate(`/lots/${found.id}`);
  }

  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="stack">
      {/* ── Page header ── */}
      <div className="page-hdr">
        <div className="page-hdr__left">
          <div className="page-hdr__eyebrow">{role} · {dateStr}</div>
          <h1 className="page-hdr__title">{timeGreeting()}, {firstName}</h1>
          <p className="page-hdr__sub">
            Here&apos;s an overview of your food lots and platform activity.
          </p>
        </div>
        <div className="page-hdr__right">
          <div className="searchbar">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lots..."
              onKeyDown={(e) => { if (e.key === "Enter") handleSearchClick(); }}
            />
            <button className="btn primary" onClick={handleSearchClick} type="button">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI stat cards ── */}
      <div className="kpi-row">
        <div className="kpi-card">
          <div className="kpi-card__bar kpi-card__bar--green" />
          <div className="kpi-card__label">Total Lots</div>
          <div className="kpi-card__value">{stats.totalLots}</div>
          <div className="kpi-card__sub">All time</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__bar kpi-card__bar--dark" />
          <div className="kpi-card__label">Weight Diverted</div>
          <div className="kpi-card__value">{Math.round(stats.totalKg)}</div>
          <div className="kpi-card__sub">kilograms total</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__bar kpi-card__bar--yellow" />
          <div className="kpi-card__label">Active Lots</div>
          <div className="kpi-card__value">{stats.activeLots}</div>
          <div className="kpi-card__sub">Created or in transit</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card__bar kpi-card__bar--muted" />
          <div className="kpi-card__label">Completed</div>
          <div className="kpi-card__value">{stats.completed}</div>
          <div className="kpi-card__sub">Delivered lots</div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="dash2-grid">
        <div className="card dash2-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Recent Lots</h2>
              <p className="card-subtitle">Latest activity across the platform</p>
            </div>
            <button className="linkbtn" onClick={() => navigate("/reports")} type="button">
              View All →
            </button>
          </div>

          <div className="lots-table">
            <div className="lots-head">
              <div>Lot ID</div><div>Status</div><div>Quantity</div>
              <div>Destination</div><div>Updated</div>
            </div>
            {filtered.length === 0 ? (
              <div className="lots-empty">
                <div className="lots-empty-title">No lots yet</div>
                <div className="lots-empty-sub">Create a lot to start tracking and QR handoffs.</div>
                {(role === "ADMIN" || role === "DONOR") && (
                  <div className="row">
                    <button className="btn primary" onClick={() => navigate("/lots/new")} type="button">
                      Create First Lot
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filtered.map((l) => (
                <button
                  key={l.id} className="lots-row" type="button"
                  onClick={() => navigate(`/lots/${l.id}`)}
                >
                  <div className="lots-id">LP-{String(l.id).padStart(3, "0")}</div>
                  <div><StatusPill status={l.status} /></div>
                  <div>{getLotKg(l)} kg</div>
                  <div className="muted">{l.pickup?.city || "Processing Hub"}</div>
                  <div className="muted">{formatShortDate(getLastUpdated(l))}</div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="dash2-side">
          <div className="card dash2-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Activity</h2>
                <p className="card-subtitle">Recent updates</p>
              </div>
            </div>
            {notifications.length === 0 ? (
              <div className="muted" style={{ marginTop: 10 }}>No activity yet.</div>
            ) : (
              <div className="notif2">
                {notifications.map((n, idx) => (
                  <div key={idx} className="notif2-item">
                    <span className="notif2-dot" />
                    <div className="notif2-text">
                      <div className="notif2-title">
                        Lot LP-{String(n.lotId).padStart(3, "0")} {statusLabel(n.event).replaceAll("_", " ").toLowerCase()}
                      </div>
                      <div className="notif2-sub">{formatShortDate(n.at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card dash2-card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Next Pickup</h2>
                <p className="card-subtitle">Upcoming window</p>
              </div>
              {nextPickup && (
                <button className="btn ghost" onClick={() => navigate(`/lots/${nextPickup.id}`)} type="button">
                  View
                </button>
              )}
            </div>
            {!nextPickup ? (
              <div className="muted" style={{ marginTop: 10 }}>No upcoming pickups.</div>
            ) : (
              <>
                <div className="pickup2">
                  <div className="pickup2-name">{nextPickup.pickup?.city || "Pickup"}</div>
                  <div className="pickup2-sub">{nextPickup.pickup?.line1 || "-"}</div>
                  <div className="pickup2-sub">
                    {nextPickup.pickup?.date} · {nextPickup.pickup?.start || "--:--"} –{" "}
                    {nextPickup.pickup?.end || "--:--"}
                  </div>
                </div>
                <div className="spark-wrap">
                  <Sparkline labels={spark.labels} values={spark.values} />
                </div>
                <div className="row" style={{ marginTop: 10 }}>
                  {(role === "ADMIN" || role === "PARTNER") && (
                    <button className="btn primary" onClick={() => navigate("/qr-scan")} type="button">
                      QR Verify
                    </button>
                  )}
                  <button className="btn ghost" onClick={() => navigate(`/lots/${nextPickup.id}`)} type="button">
                    Open Lot
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Impact ── */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Impact Overview</h2>
            <p className="card-subtitle">Cumulative totals across all lots</p>
          </div>
          <span className="pill good">SDG 12 Compliant</span>
        </div>
        <div className="impact2">
          <div className="impact2-item">
            <div className="impact2-label">To Date</div>
            <div className="impact2-value">{stats.totalLots}</div>
            <div className="muted">Lots created</div>
          </div>
          <div className="impact2-item">
            <div className="impact2-label">This Month</div>
            <div className="impact2-value">{Math.round(stats.totalKg * 10) / 10}</div>
            <div className="muted">kg diverted</div>
          </div>
          <div className="impact2-item wide">
            <div className="impact2-label">Verified tracking + controlled redistribution</div>
            <div className="impact2-sub">
              QR handoffs, custody timeline, and recall readiness built in.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
