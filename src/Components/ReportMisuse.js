import { useState } from "react";
import "./ReportMisuse.css";

export default function ReportMisuse() {
  const [form, setForm] = useState({ lotId: "", reason: "", contact: "" });
  const [done, setDone] = useState(false);

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <div className="stack">
      <div>
        <h1 className="page-title">Report misuse</h1>
        <p className="page-subtitle">Report suspicious QR use or fraud (MVP).</p>
      </div>

      <form className="card form" onSubmit={submit}>
        <div className="grid-2">
          <div className="field">
            <label>Lot ID (optional)</label>
            <input value={form.lotId} onChange={(e) => update("lotId", e.target.value)} placeholder="e.g., 171234567" />
          </div>

          <div className="field">
            <label>Contact (optional)</label>
            <input value={form.contact} onChange={(e) => update("contact", e.target.value)} placeholder="email/phone" />
          </div>
        </div>

        <div className="field">
          <label>Reason</label>
          <textarea rows={4} value={form.reason} onChange={(e) => update("reason", e.target.value)} placeholder="Describe what happened..." />
        </div>

        <div className="row">
          <button className="btn" type="submit">Submit report</button>
          {done ? <span className="pill good">Submitted</span> : null}
        </div>
      </form>
    </div>
  );
}
