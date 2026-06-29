import React, { useState } from "react";
import "./QRScanner.css";

const STEPS = [
  {
    number: "1",
    icon: "📋",
    title: "Get Slip",
    desc: "Ask donor for their donation receipt with QR code printed on it.",
    visual: "slip",
  },
  {
    number: "2",
    icon: "📷",
    title: "Scan Code",
    desc: "Point camera at the QR code and hold steady until detected.",
    visual: "scan",
  },
  {
    number: "3",
    icon: "✅",
    title: "Confirm Pickup",
    desc: "Green checkmark means verified. Lot moves to transit automatically.",
    visual: "confirm",
  },
];

function SlipVisual() {
  return (
    <div className="qrs-visual-slip">
      <div className="qrs-slip-card">
        <div className="qrs-slip-header">
          <div className="qrs-slip-dot" />
          <div className="qrs-slip-lines">
            <div className="qrs-slip-line qrs-slip-line--wide" />
            <div className="qrs-slip-line qrs-slip-line--short" />
          </div>
        </div>
        <div className="qrs-slip-qr">
          <div className="qrs-mini-qr">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`qrs-mini-cell ${[0,1,2,4,5,6,8,11,13,14,15,3,7,12].includes(i) ? "qrs-mini-cell--on" : ""}`} />
            ))}
          </div>
        </div>
        <div className="qrs-slip-footer">
          <div className="qrs-slip-line qrs-slip-line--mid" />
        </div>
      </div>
    </div>
  );
}

function ScanVisual() {
  return (
    <div className="qrs-visual-scan">
      <div className="qrs-camera-box">
        <div className="qrs-cam-corner qrs-cam-corner--tl" />
        <div className="qrs-cam-corner qrs-cam-corner--tr" />
        <div className="qrs-cam-corner qrs-cam-corner--bl" />
        <div className="qrs-cam-corner qrs-cam-corner--br" />
        <div className="qrs-cam-beam" />
        <div className="qrs-cam-inner">
          <div className="qrs-mini-qr">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`qrs-mini-cell ${[0,1,2,4,5,6,8,11,13,14,15,3,7,12].includes(i) ? "qrs-mini-cell--on" : ""}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmVisual() {
  return (
    <div className="qrs-visual-confirm">
      <div className="qrs-confirm-ring">
        <svg viewBox="0 0 56 56" width="56" height="56">
          <circle cx="28" cy="28" r="26" fill="#e8f5e8" stroke="#52b788" strokeWidth="2.5" />
          <path d="M 16 28 L 24 36 L 40 20" fill="none" stroke="#2d6a4f"
            strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="qrs-confirm-tag">Verified</div>
    </div>
  );
}

export default function QRScanner() {
  const [activeStep, setActiveStep] = useState(0);
  const [scanStatus, setScanStatus] = useState("idle");
  const [manualToken, setManualToken] = useState("");
  const [result, setResult] = useState(null);

  const handleStartScan = () => {
    setScanStatus("scanning");
    setActiveStep(1);
    setResult(null);
    setTimeout(() => {
      setScanStatus("success");
      setActiveStep(2);
      setResult({ type: "success", lot: "SLF-2024-0892", shelter: "John's Shelter", qty: "12 kg" });
    }, 2500);
  };

  const handleManualVerify = () => {
    if (!manualToken.trim()) return;
    if (manualToken.startsWith("slf1.")) {
      setScanStatus("success");
      setActiveStep(2);
      setResult({ type: "success", lot: "SLF-2024-0892", shelter: "John's Shelter", qty: "12 kg" });
    } else {
      setResult({ type: "error", msg: "Invalid token. Must start with 'slf1.'" });
    }
  };

  const handleReset = () => {
    setScanStatus("idle");
    setActiveStep(0);
    setManualToken("");
    setResult(null);
  };

  return (
    <div className="qrs-page">

      {/* ── Page Header ── */}
      <div className="qrs-page-header">
        <div className="qrs-page-header__left">
          <div className="qrs-page-label">OPERATIONS</div>
          <h1 className="qrs-page-title">QR Verify</h1>
          <p className="qrs-page-sub">Scan the donor QR to confirm pickup, or paste the token for manual verification.</p>
          <div className="qrs-tags">
            <span className="qrs-tag qrs-tag--green"><span className="qrs-tag__dot" />READY</span>
            <span className="qrs-tag qrs-tag--outline">Signed-in as <strong>Admin</strong></span>
          </div>
        </div>

        {/* Step tracker — matches current app style */}
        <div className="qrs-tracker">
          {STEPS.map((s, i) => (
            <div key={i} className={`qrs-tracker__item ${i === activeStep ? "qrs-tracker__item--active" : ""} ${i < activeStep ? "qrs-tracker__item--done" : ""}`}>
              <div className="qrs-tracker__num">{i < activeStep ? "✓" : s.number}</div>
              <div className="qrs-tracker__body">
                <div className="qrs-tracker__title">{s.title}</div>
                <div className="qrs-tracker__desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Visual How-To Guide ── */}
      <div className="qrs-guide-section">
        <div className="qrs-guide-section__label">How to Scan — Step by Step</div>
        <div className="qrs-guide-cards">
          {STEPS.map((s, i) => (
            <div key={i} className={`qrs-guide-card ${i === activeStep ? "qrs-guide-card--active" : ""} ${i < activeStep ? "qrs-guide-card--done" : ""}`}>
              <div className="qrs-guide-card__badge">{i < activeStep ? "✓" : s.number}</div>
              <div className="qrs-guide-card__visual">
                {s.visual === "slip" && <SlipVisual />}
                {s.visual === "scan" && <ScanVisual />}
                {s.visual === "confirm" && <ConfirmVisual />}
              </div>
              <div className="qrs-guide-card__icon">{s.icon}</div>
              <div className="qrs-guide-card__title">{s.title}</div>
              <div className="qrs-guide-card__desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Two-Col ── */}
      <div className="qrs-main-grid">

        {/* Left — Camera Scanner */}
        <div className="qrs-card">
          <div className="qrs-card__top">
            <div>
              <h3 className="qrs-card__title">Camera Scanner</h3>
              <p className="qrs-card__sub">Use your webcam or phone camera to scan the QR.</p>
            </div>
            <span className={`qrs-pill qrs-pill--${scanStatus}`}>
              {scanStatus === "idle" && "Idle"}
              {scanStatus === "scanning" && "Scanning…"}
              {scanStatus === "success" && "✓ Done"}
            </span>
          </div>

          {/* Viewport */}
          <div className={`qrs-viewport qrs-viewport--${scanStatus}`}>
            <span className="qrs-vp-c qrs-vp-c--tl" />
            <span className="qrs-vp-c qrs-vp-c--tr" />
            <span className="qrs-vp-c qrs-vp-c--bl" />
            <span className="qrs-vp-c qrs-vp-c--br" />

            {scanStatus === "idle" && (
              <div className="qrs-vp-idle">
                <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
                  <rect x="3" y="3" width="17" height="17" rx="2" stroke="#b7d9c4" strokeWidth="2.2"/>
                  <rect x="28" y="3" width="17" height="17" rx="2" stroke="#b7d9c4" strokeWidth="2.2"/>
                  <rect x="3" y="28" width="17" height="17" rx="2" stroke="#b7d9c4" strokeWidth="2.2"/>
                  <rect x="7" y="7" width="9" height="9" rx="1" fill="#b7d9c4"/>
                  <rect x="32" y="7" width="9" height="9" rx="1" fill="#b7d9c4"/>
                  <rect x="7" y="32" width="9" height="9" rx="1" fill="#b7d9c4"/>
                  <rect x="28" y="28" width="4" height="4" fill="#b7d9c4"/>
                  <rect x="34" y="28" width="4" height="4" fill="#b7d9c4"/>
                  <rect x="40" y="28" width="4" height="4" fill="#b7d9c4"/>
                  <rect x="28" y="34" width="4" height="4" fill="#b7d9c4"/>
                  <rect x="34" y="40" width="4" height="4" fill="#b7d9c4"/>
                  <rect x="40" y="34" width="4" height="4" fill="#b7d9c4"/>
                </svg>
                <div className="qrs-vp-idle__text">Ready to scan</div>
                <div className="qrs-vp-idle__sub">Click Start Scanning below</div>
              </div>
            )}

            {scanStatus === "scanning" && (
              <>
                <div className="qrs-vp-beam" />
                <div className="qrs-vp-label">Detecting QR code…</div>
              </>
            )}

            {scanStatus === "success" && (
              <div className="qrs-vp-success">
                <svg viewBox="0 0 64 64" width="60" height="60">
                  <circle cx="32" cy="32" r="30" fill="#e8f5e8" stroke="#52b788" strokeWidth="3" />
                  <path d="M 16 32 L 28 44 L 48 22" fill="none" stroke="#2d6a4f"
                    strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="qrs-vp-success__text">QR Detected</div>
              </div>
            )}
          </div>

          <div className="qrs-tip">
            <span>💡</span>
            <span>Hold the QR code 15–20 cm from the camera in good lighting for best results.</span>
          </div>

          <div className="qrs-card__actions">
            {scanStatus === "idle" && (
              <button className="qrs-btn qrs-btn--primary" onClick={handleStartScan}>Start Scanning</button>
            )}
            {scanStatus === "scanning" && (
              <button className="qrs-btn qrs-btn--ghost" onClick={handleReset}>Cancel</button>
            )}
            {scanStatus === "success" && (
              <button className="qrs-btn qrs-btn--ghost" onClick={handleReset}>↺ Scan Another</button>
            )}
          </div>
        </div>

        {/* Right — Manual Verification */}
        <div className="qrs-card">
          <div className="qrs-card__top">
            <div>
              <h3 className="qrs-card__title">Manual Verification</h3>
              <p className="qrs-card__sub">Paste token if camera is not available.</p>
            </div>
            <span className="qrs-pill qrs-pill--idle">Fallback</span>
          </div>

          {/* Result */}
          {result && (
            <div className={`qrs-result qrs-result--${result.type}`}>
              <div className="qrs-result__icon">{result.type === "success" ? "✅" : "❌"}</div>
              {result.type === "success" ? (
                <div className="qrs-result__body">
                  <div className="qrs-result__title">Pickup Confirmed</div>
                  <div className="qrs-result__rows">
                    {[["Lot ID", result.lot], ["Shelter", result.shelter], ["Quantity", result.qty]].map(([k, v]) => (
                      <div key={k} className="qrs-result__row"><span>{k}</span><strong>{v}</strong></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="qrs-result__body">
                  <div className="qrs-result__title">Verification Failed</div>
                  <div className="qrs-result__msg">{result.msg}</div>
                </div>
              )}
            </div>
          )}

          <div className="qrs-field__label">QR Token</div>
          <textarea
            className="qrs-textarea"
            placeholder="slf1.<payload>.<signature>"
            value={manualToken}
            onChange={e => setManualToken(e.target.value)}
            rows={5}
          />
          <div className="qrs-field__hint">
            It should start with <strong>slf1.</strong> and contain payload and signature.
          </div>

          <div className="qrs-card__actions qrs-card__actions--row">
            <button className="qrs-btn qrs-btn--primary" onClick={handleManualVerify}>Verify and Pickup</button>
            <button className="qrs-btn qrs-btn--ghost" onClick={() => { setManualToken(""); setResult(null); }}>Clear</button>
          </div>

          {/* Where to find */}
          <div className="qrs-where">
            <div className="qrs-where__title">Where is the QR code?</div>
            {[
              ["🧾", "On the printed donation receipt slip"],
              ["📧", "In the confirmation email after lot creation"],
              ["📱", "Under 'My Donations' in the app"],
            ].map(([icon, text], i) => (
              <div key={i} className="qrs-where__row">
                <span className="qrs-where__icon">{icon}</span>
                <span className="qrs-where__text">{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}