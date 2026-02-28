import { useEffect, useMemo, useState } from "react";
import "./Compliance.css";
import { useLocation, useNavigate } from "react-router-dom";
import { loadLots } from "../api/storage.js";

function runChecks(lot) {
  const checks = [
    { rule: "Expiry date provided", pass: !!lot.expiryDate },
    { rule: "Quantity > 0", pass: Number(lot.quantityKg || 0) > 0 },
    { rule: "Pickup address present", pass: !!lot.pickupAddress?.trim() },
    { rule: "Perishable must be fast-route", pass: lot.category !== "Perishable" || lot.route === "Animal feed" },
  ];

  const fails = checks.filter((c) => !c.pass).length;
  const risk = fails === 0 ? "LOW" : fails <= 1 ? "MEDIUM" : "HIGH";
  return { checks, risk };
}

export default function Compliance() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const lotId = new URLSearchParams(search).get("lotId");

  const [lots, setLots] = useState([]);

  useEffect(() => setLots(loadLots()), []);

  const visibleLots = useMemo(() => {
    if (!lotId) return lots;
    return lots.filter((l) => l.id === lotId);
  }, [lots, lotId]);

  return (
    <div className="stack">
      <div className="card-header">
        <div>
          <h1 className="page-title">Compliance</h1>
          <p className="page-subtitle">Rule-based checks per lot (MVP).</p>
        </div>

        {lotId ? (
          <button className="btn ghost" onClick={() => navigate(`/lots/${lotId}`)}>
            Back to Lot
          </button>
        ) : null}
      </div>

      {!visibleLots.length ? (
        <div className="card">No lots found. Create a lot first.</div>
      ) : (
        visibleLots.slice(0, 8).map((lot) => {
          const result = runChecks(lot);
          const pill = result.risk === "LOW" ? "pill good" : result.risk === "MEDIUM" ? "pill warn" : "pill bad";

          return (
            <div className="card" key={lot.id}>
              <div className="card-header">
                <h2 className="card-title">
                  Lot #{String(lot.id).slice(-5)}: {lot.foodName}
                </h2>
                <span className={pill}>RISK: {result.risk}</span>
              </div>

              <div className="table" style={{ marginTop: 10 }}>
                <div className="trow thead" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                  <div>Rule</div><div>Result</div><div></div><div></div>
                </div>
                {result.checks.map((c) => (
                  <div className="trow" key={c.rule} style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                    <div>{c.rule}</div>
                    <div><span className={c.pass ? "pill good" : "pill bad"}>{c.pass ? "PASS" : "FAIL"}</span></div>
                    <div></div><div></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
