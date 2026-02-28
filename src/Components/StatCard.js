export default function StatCard({ label, value, hint }) {
import "./StatCard.css";
  return (
    <div className="card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="muted">{hint}</div>
    </div>
  );
}
