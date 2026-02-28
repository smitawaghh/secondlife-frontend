import { useMemo, useState } from "react";
import "./LotDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { getLotById, updateLot } from "../api/storage.js";
import { getUser } from "../auth/auth.js";

function formatPickup(lot) {
  // Supports both pickupAddress (string) and pickup object
  if (lot?.pickupAddress) return lot.pickupAddress;
  const p = lot?.pickup || {};
  const parts = [p.line1, p.city, p.state, p.pincode].filter(Boolean);
  return parts.length ? parts.join(", ") : "-";
}

function normalizeLot(raw) {
  if (!raw) return null;

  const quantityKg =
    raw.quantityKg ?? raw.qtyKg ?? raw.quantity ?? raw.qty ?? 0;

  const custody = Array.isArray(raw.custody) ? raw.custody : [];
  const normCustody = custody.map((e) => ({
    type: e.type || e.event || "UPDATE",
    at: e.at || e.time || raw.updatedAt || raw.createdAt,
    by: e.by || e.actor || "System",
    note: e.note || "",
  }));

  return {
    ...raw,
    quantityKg,
    pickupAddress: formatPickup(raw),
    custody: normCustody,
    expiryDate: raw.expiryDate || raw.expiry || "-",
    route: raw.route || raw.routing || "HUMAN_REDIS",
    status: raw.status || "UNKNOWN",
  };
}

export default function LotDetails() {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const role = user?.role || "ADMIN";

  const [tick, setTick] = useState(0);

  const raw = useMemo(() => getLotById(lotId), [lotId, tick]);
  const lot = useMemo(() => normalizeLot(raw), [raw]);

  if (!lot) {
    return (
      <div className="stack">
        <h1 className="page-title">Lot not found</h1>
        <button className="btn" onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  const canSeeQr = role === "ADMIN" || role === "DONOR";
  const canConfirmReceived = role === "ADMIN" || role === "RECEIVER";

  function copyQr() {
    navigator.clipboard.writeText(lot.qr || "");
  }

  function printQr() {
    const w = window.open("", "_blank", "width=520,height=640");
    if (!w) return;

    // Simple print view (QR is already visible on main page too)
    w.document.write(`
      <html>
        <head><title>SecondLifeFood QR</title></head>
        <body style="font-family:Arial; padding:24px;">
          <h2>SecondLifeFood</h2>
          <p><b>Lot ID:</b> ${lot.id}</p>
          <p><b>Food:</b> ${lot.foodName || "-"}</p>
          <p><b>Quantity:</b> ${lot.quantityKg} kg</p>
          <p style="margin-top:12px; font-size:12px; color:#555;">
            Scan this code at pickup to verify custody.
          </p>
          <div style="margin-top:14px; padding:14px; border:1px solid #ddd; border-radius:12px; width: fit-content;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              lot.qr || ""
            )}" />
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  }

  function confirmReceived() {
    if (lot.status !== "IN_TRANSIT") return;

    const now = new Date().toISOString();
    updateLot(lot.id, (cur) => {
      const custody = Array.isArray(cur.custody) ? cur.custody : [];
      return {
        ...cur,
        status: "RECEIVED",
        updatedAt: now,
        custody: [
          ...custody,
          // Write BOTH keys so old/new UI both work
          { type: "RECEIVED", event: "RECEIVED", at: now, by: user?.name || "Receiver", note: "Received and verified" },
        ],
      };
    });

    setTick((x) => x + 1);
  }

  return (
    <div className="stack">
      <div className="card-header">
        <div>
          <h1 className="page-title">Lot #{lot.id}</h1>
          <p className="page-subtitle">
            Status: <span className="pill good">{String(lot.status).replaceAll("_", " ")}</span>
          </p>
        </div>

      
      </div>

      <div className="card">
        <div className="kv">
          <div><span>Food</span><b>{lot.foodName || "-"}</b></div>
          <div><span>Category</span><b>{lot.category || "-"}</b></div>
          <div><span>Quantity</span><b>{Number(lot.quantityKg || 0)} kg</b></div>
          <div><span>Expiry</span><b>{lot.expiryDate || "-"}</b></div>
          <div><span>Route</span><b>{String(lot.route || "-").replaceAll("_", " ")}</b></div>
          <div><span>Pickup</span><b>{lot.pickupAddress}</b></div>
        </div>
      </div>

      {canSeeQr ? (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">QR for pickup verification</h2>
              <p className="card-subtitle">Delivery partner scans this at pickup.</p>
            </div>

            <div className="row" style={{ marginTop: 0 }}>
              <button className="btn ghost" onClick={copyQr}>Copy token</button>
              <button className="btn ghost" onClick={printQr}>Print</button>
            </div>
          </div>

          <div style={{ background: "#fff", padding: 14, borderRadius: 14, border: "1px solid rgba(15,31,20,0.10)", width: "fit-content" }}>
            <QRCode value={lot.qr || ""} size={160} />
          </div>

          <div className="muted small" style={{ marginTop: 10, wordBreak: "break-all" }}>
            Token: {lot.qr || "-"}
          </div>
        </div>
      ) : null}

      {canConfirmReceived ? (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Receiver confirmation</h2>
              <p className="card-subtitle">After delivery, confirm receipt to close custody chain.</p>
            </div>
            <div className="row" style={{ marginTop: 0 }}>
              <button className="btn primary" onClick={confirmReceived} disabled={lot.status !== "IN_TRANSIT"}>
                Confirm Received
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Custody timeline</h2>
        </div>

        <div className="timeline">
          {(lot.custody || []).map((e, idx) => (
            <div className="timeline-item" key={idx}>
              <div className="dot"></div>
              <div>
                <div className="timeline-top">
                  <b>{String(e.type).replaceAll("_", " ")}</b>
                  <span className="muted small">
                    {e.at ? new Date(e.at).toLocaleString() : "-"}
                  </span>
                </div>
                <div className="timeline-content">
                  <div className="muted">By: {e.by}</div>
                  {e.note ? <div className="small">{e.note}</div> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
