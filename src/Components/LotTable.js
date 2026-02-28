import { useNavigate } from "react-router-dom";
import "./LotTable.css";
import { statusPillClass } from "../api/logic.js";

export default function LotTable({ lots = [] }) {
  const navigate = useNavigate();

  if (!lots.length) {
    return <div className="muted" style={{ padding: 12 }}>No lots yet. Go to Create Lot.</div>;
  }

  return (
    <div className="table">
      <div className="trow thead">
        <div>Lot</div>
        <div>Food</div>
        <div>Category</div>
        <div>Status</div>
      </div>

      {lots.slice(0, 10).map((l) => (
        <button
          key={l.id}
          className="trow tbtn"
          onClick={() => navigate(`/lots/${l.id}`)}
        >
          <div>#{String(l.id).slice(-5)}</div>
          <div>{l.foodName}</div>
          <div>{l.category}</div>
          <div><span className={statusPillClass(l.status)}>{l.status}</span></div>
        </button>
      ))}
    </div>
  );
}
