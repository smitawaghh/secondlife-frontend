import { useEffect, useState } from "react";
import "./Transparency.css";
import { useParams, Link } from "react-router-dom";
import { getLotById } from "../api/storage.js";

export default function Transparency() {
  const { lotId } = useParams();
  const [lot, setLot] = useState(null);

  useEffect(() => setLot(getLotById(lotId)), [lotId]);

  if (!lot) return <div className="card">Public lot not found.</div>;

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Transparency View</h1>
        <p className="page-subtitle">Public-safe view (no address, no sensitive info).</p>
      </div>

      <div className="card">
        <div className="kv">
          <div><span>Lot</span><b>#{String(lot.id).slice(-5)}</b></div>
          <div><span>Food</span><b>{lot.foodName}</b></div>
          <div><span>Category</span><b>{lot.category}</b></div>
          <div><span>Status</span><b>{lot.status}</b></div>
          <div><span>Route</span><b>{lot.route}</b></div>
        </div>

        <div className="row">
          <Link className="btn" to={`/lots/${lot.id}`}>Open internal view</Link>
          <Link className="btn ghost" to="/report-misuse">Report misuse</Link>
        </div>
      </div>
    </div>
  );
}
