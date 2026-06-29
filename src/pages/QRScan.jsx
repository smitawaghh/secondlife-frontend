import { useEffect, useMemo, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQrString } from "../api/qr.js";
import { getLotById, updateLot } from "../api/storage.js";
import { getUser } from "../auth/auth.js";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function QRScan() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  const user = getUser();
  const navigate = useNavigate();

  const regionId = "qr-reader-region";
  const qrRef = useRef(null);

  const canStartScan = useMemo(() => typeof window !== "undefined", []);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startScan() {
    setError("");
    setResult(null);

    if (!canStartScan) return setError("Scanner not supported in this environment.");
    if (scanning) return;

    try {
      if (!qrRef.current) {
        qrRef.current = new Html5Qrcode(regionId);
      }

      setScanning(true);

      await qrRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        async (decodedText) => {
          // Stop scanning immediately after first read
          await stopScan();
          setInput(decodedText);
          await verifyAndPickup(decodedText);
        },
        () => {
          // ignore scan errors per frame
        }
      );
    } catch (e) {
      setScanning(false);
      setError(e?.message || "Could not start camera. Allow camera permission and try again.");
    }
  }

  async function stopScan() {
    try {
      if (qrRef.current && scanning) {
        await qrRef.current.stop();
        await qrRef.current.clear();
      }
    } catch {
      // ignore
    } finally {
      setScanning(false);
    }
  }

  async function verifyAndPickup(token) {
    setError("");
    setResult(null);

    try {
      const payload = await verifyQrString(token);
      const lot = getLotById(payload.lotId);
      if (!lot) throw new Error("Lot not found");

      const now = new Date().toISOString();

      const updated = updateLot(lot.id, (cur) => {
        const custody = cur.custody || [];
        const alreadyPicked = custody.some((e) => e.type === "PICKED_UP");
        if (alreadyPicked) return cur;

        return {
          ...cur,
          status: "IN_TRANSIT",
          custody: [
            ...custody,
            {
              type: "PICKED_UP",
              at: now,
              by: user?.name || "Delivery Partner",
              note: "QR verified at pickup",
            },
          ],
        };
      });

      if (!updated) throw new Error("Failed to update lot");

      setResult({ payload, lot: updated });
    } catch (e) {
      setError(e?.message || "Verification failed");
    }
  }

  async function onManualVerify() {
    await verifyAndPickup(input);
  }

  return (
    <div className="stack">
      <PageHeader
        eyebrow="Custody Verification"
        title="QR Verify"
        subtitle="Scan using camera or paste the token to verify and log pickup."
      />

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Camera scanner</h2>
            <p className="card-subtitle">Use your webcam to scan the donor QR.</p>
          </div>

          <div
            id={regionId}
            style={{
              width: "100%",
              minHeight: 320,
              borderRadius: 16,
              border: "1px solid rgba(15,31,20,0.10)",
              background: "rgba(47,191,113,0.06)",
              overflow: "hidden",
            }}
          />

          <div className="row">
            {!scanning ? (
              <button className="btn" onClick={startScan}>
                Start scan
              </button>
            ) : (
              <button className="btn ghost" onClick={stopScan}>
                Stop scan
              </button>
            )}
          </div>

          <div className="muted small">
            If camera doesn’t start, allow permission in browser settings and reload.
          </div>
        </div>

        <div className="card form">
          <div className="card-header">
            <h2 className="card-title">Manual verification</h2>
            <p className="card-subtitle">Paste token as fallback.</p>
          </div>

          <div className="field">
            <label>QR Token</label>
            <textarea
              rows={6}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="slf1.<payload>.<signature>"
            />
          </div>

          <div className="row">
            <button className="btn" onClick={onManualVerify} disabled={!input.trim()}>
              Verify & Pickup
            </button>
            <button
              className="btn ghost"
              onClick={() => {
                setInput("");
                setResult(null);
                setError("");
              }}
            >
              Clear
            </button>
          </div>

          {error ? <div className="error">{error}</div> : null}

          {result ? (
            <div className="card" style={{ marginTop: 12 }}>
              <div className="card-header">
                <h2 className="card-title">Verified</h2>
                <span className="pill good">IN_TRANSIT</span>
              </div>

              <div className="kv">
                <div><span>Lot</span><b>#{result.lot.id}</b></div>
                <div><span>Food</span><b>{result.lot.foodName}</b></div>
                <div><span>Category</span><b>{result.lot.category}</b></div>
                <div><span>Pickup</span><b>Confirmed</b></div>
              </div>

              <div className="row">
                <button className="btn ghost" onClick={() => navigate(`/transparency/${result.lot.id}`)}>
                  Open transparency
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}