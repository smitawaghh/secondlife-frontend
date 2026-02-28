export default function CustodyTimeline({ events = [] }) {
import "./CustodyTimeline.css";
  if (!events.length) return <div className="muted">No events yet.</div>;

  return (
    <div className="timeline">
      {events.map((e, idx) => (
        <div className="timeline-item" key={idx}>
          <div className="dot" />
          <div className="timeline-content">
            <div className="timeline-top">
              <b>{e.type}</b>
              <span className="muted small">{new Date(e.at).toLocaleString()}</span>
            </div>
            <div className="muted">By: {e.by}</div>
            <div className="small">{e.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
