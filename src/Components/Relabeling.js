import { useEffect, useMemo, useState } from "react";
import "./Relabeling.css";
import { useLocation, useNavigate } from "react-router-dom";
import { loadLots, updateLot } from "../api/storage.js";

export default function Relabeling() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const lotId = new URLSearchParams(search).get("lotId");

  const [lots, setLots] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");

  function refresh() {
    setLots(loadLots());
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (lotId) setSelectedId(lotId);
  }, [lotId]);

  const selectedLot = useMemo(() => lots.find((l) => l.id === selectedId) || null, [lots, selectedId]);

  function addRelabel() {
    if (!selectedId) return;
    const now = new Date().toISOString();

    updateLot(selectedId, (old) => {
      const relabels = old.relabels || [];
      const custody = [...(old.custody || []), { type: "RELABEL", at: now, by: "QA", note: note || "Relabeled" }];
      return { ...old, relabels: [{ at: now, note: note || "Relabeled" }, ...relabels], custody };
    });

    setNote("");
    refresh();
  }

  return (
    <div className="stack">
      <div className="card-header">
        <div>
          <h1 className="page-title">Relabeling</h1>
          <p className="page-subtitle">Record relabel events on a lot (MVP).</p>
        </div>

        {selectedId ? (
          <button className="btn ghost" onClick={() => navigate(`/lots/${selectedId}`)}>
            Back to Lot
          </button>
        ) : null}
      </div>

      <div className="card form">
        <div className="grid-2">
          <div className="field">
            <label>Select lot</label>
            <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Select...</option>
              {lots.map((l) => (
                <option key={l.id} value={l.id}>
                  #{String(l.id).slice(-5)} - {l.foodName}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Relabel note</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What changed on label?" />
          </div>
        </div>

        <div className="row">
          <button className="btn" type="button" onClick={addRelabel} disabled={!selectedId}>
            Add relabel event
          </button>
          <button className="btn ghost" type="button" onClick={refresh}>
            Refresh
          </button>
        </div>
      </div>

      {selectedLot ? (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Relabel history for #{String(selectedLot.id).slice(-5)}</h2>
            <span className="pill good">{selectedLot.foodName}</span>
          </div>

          {!selectedLot.relabels?.length ? (
            <div className="muted" style={{ marginTop: 10 }}>No relabel events yet.</div>
          ) : (
            <div className="table">
              <div className="trow thead" style={{ gridTemplateColumns: "1.2fr 2.8fr 0.2fr 0.2fr" }}>
                <div>Time</div><div>Note</div><div></div><div></div>
              </div>
              {selectedLot.relabels.map((r, idx) => (
                <div className="trow" key={idx} style={{ gridTemplateColumns: "1.2fr 2.8fr 0.2fr 0.2fr" }}>
                  <div className="muted small">{new Date(r.at).toLocaleString()}</div>
                  <div>{r.note}</div>
                  <div></div><div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
