import { useEffect, useMemo, useRef, useState } from "react";
import "./QRScan.css";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQrString } from "../api/qr.js";
import { getLotById, updateLot } from "../api/storage.js";
import { getUser } from "../auth/auth.js";
import { useNavigate, useLocation } from "react-router-dom";

/* ── QR code visual pattern (decorative) ── */
const QR_PATTERN = [
  1,1,1,0,1,1,1,
  1,0,1,0,1,0,1,
  1,0,1,1,1,0,1,
  0,0,0,1,0,0,0,
  1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,
  1,1,1,0,1,1,1,
];

/* ── NAV LINKS with their routes ── */
const NAV_LINKS = [
  { label: "Home",            path: "/home" },
  { label: "Donor Dashboard", path: "/dash" },
  { label: "Create Lot",      path: "/create" },
  { label: "QR Scanner",      path: "/qr" },
  { label: "Admin Panel",     path: "/admin" },
  { label: "Testing Screen",  path: "/testing" },
];

/* ── ICONS ── */
const LogoIcon = () => (
  <svg width="34" height="34" viewBox="0 0 38 38" fill="none">
    <rect width="38" height="38" rx="9" fill="#2D6A4F"/>
    <path d="M19 8C19 8 11 14.5 11 22.5a8 8 0 0016 0C27 14.5 19 8 19 8z" fill="white" opacity="0.92"/>
    <path d="M19 13C19 13 14 18 14 23a5 5 0 0010 0C24 18 19 13 19 13z" fill="#B7E4C7"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#52B788" strokeWidth="1.7"/>
    <path d="M2 7l10 7 10-7" stroke="#52B788" strokeWidth="1.7" strokeLinecap="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2C8.6 21 3 15.4 3 6a2 2 0 012-2z" stroke="#52B788" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" stroke="#52B788" strokeWidth="1.6"/>
    <circle cx="12" cy="9" r="2.5" fill="#52B788"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const TwitterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="2" stroke="white" strokeWidth="1.8"/>
  </svg>
);

export default function QRScan() {
  const [input, setInput]       = useState("");
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
  const [scanning, setScanning] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsEmail, setNewsEmail]   = useState("");

  const user     = getUser();
  const navigate = useNavigate();
  const location = useLocation();
  const regionId = "qr-reader-region";
  const qrRef    = useRef(null);
  const canScan  = useMemo(() => typeof window !== "undefined", []);

  useEffect(() => () => stopScan(), []);

  async function startScan() {
    setError(""); setResult(null);
    if (!canScan) return setError("Scanner not supported.");
    if (scanning) return;
    try {
      if (!qrRef.current) qrRef.current = new Html5Qrcode(regionId);
      setScanning(true);
      await qrRef.current.start(
        { facingMode: "environment" },
        { fps: 12, qrbox: { width: 220, height: 220 } },
        async (decodedText) => {
          await stopScan();
          setInput(decodedText);
          await verifyAndPickup(decodedText);
        }
      );
    } catch {
      setScanning(false);
      setError("Camera permission required. Please allow camera access and try again.");
    }
  }

  async function stopScan() {
    try {
      if (qrRef.current && scanning) {
        await qrRef.current.stop();
        await qrRef.current.clear();
      }
    } catch {}
    setScanning(false);
  }

  async function verifyAndPickup(token) {
    try {
      const payload = await verifyQrString(token);
      const lot = getLotById(payload.lotId);
      if (!lot) throw new Error("Lot not found");
      const updated = updateLot(lot.id, (cur) => ({ ...cur, status: "IN_TRANSIT" }));
      setResult({ payload, lot: updated });
    } catch {
      setError("Verification failed. Please check the QR token and try again.");
    }
  }

  function reset() { setInput(""); setResult(null); setError(""); }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="qr-root">

      {/* ═══════════════════════════════════════
          NAVBAR — logo left · links center-right · no donate btn
      ═══════════════════════════════════════ */}
      <nav className="qr-nav">
        {/* Logo — left */}
        <button className="qr-nav-logo" onClick={() => navigate("/home")}>
          <LogoIcon />
          <span className="qr-nav-brand">SecondLife <strong>Foods</strong></span>
        </button>

        {/* Nav links — center/right (like screenshot) */}
        <ul className="qr-nav-links">
          {NAV_LINKS.map(({ label, path }) => (
            <li key={label}>
              <button
                className={`qr-nav-link ${isActive(path) ? "active" : ""}`}
                onClick={() => { navigate(path); setMobileOpen(false); }}>
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right — avatar only */}
        <div className="qr-nav-right">
          <div className="qr-nav-avatar" title={user?.name || "User"}>
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          {/* Hamburger */}
          <button
            className="qr-nav-hamburger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`qr-nav-drawer ${mobileOpen ? "open" : ""}`}>
        {NAV_LINKS.map(({ label, path }) => (
          <button
            key={label}
            className={`qr-drawer-link ${isActive(path) ? "active" : ""}`}
            onClick={() => { navigate(path); setMobileOpen(false); }}>
            {label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════
          PAGE CONTENT
      ═══════════════════════════════════════ */}
      <div className="qr-page">

        {/* ── HERO ── */}
        <section className="qr-hero">

          {/* LEFT */}
          <div className="qr-hero-left">
            <div className="qr-kicker">
              <div className="qr-kicker-dot" />
              SecondLife Foods · Verification
            </div>

            <h1 className="qr-hero-title">
              Scan QR Code<br />
              <em>Verification</em>
            </h1>

            <p className="qr-hero-desc">
              Verify donor QR at pickup and move food lots into transit.
              Designed for controlled traceability and prevention of misuse
              across the supply chain.
            </p>

            <div className="qr-stats">
              {[
                { num: "3",    txt: "Steps to confirm" },
                { num: "1",    txt: "Scan updates lot" },
                { num: "100%", txt: "Traceable" },
              ].map((s, i) => (
                <div key={i} className="qr-stat">
                  <div className="qr-stat-num">{s.num}</div>
                  <div className="qr-stat-txt">{s.txt}</div>
                </div>
              ))}
            </div>

            <div className="qr-hero-btns">
              {!scanning ? (
                <button className="qr-btn-primary" onClick={startScan}>
                  ▶ Start Scanning
                </button>
              ) : (
                <button className="qr-btn-outline" onClick={stopScan}>
                  ⏹ Stop Scanning
                </button>
              )}
              <button className="qr-btn-outline" onClick={reset}>Reset</button>
            </div>

            {error && <div className="qr-error">{error}</div>}

            <div className="qr-tip">
              💡 Use good lighting and keep QR code flat for faster detection.
            </div>
          </div>

          {/* RIGHT — phone visual */}
          <div className="qr-hero-right">
            <div className="qr-blob" />
            <div className="qr-phone-wrap">
              <div className="qr-phone">
                <div className="qr-phone-screen">
                  <div className={`qr-phone-cam ${scanning ? "scanning" : ""}`}>
                    <div id={regionId} className="qr-phone-cam-inner" />
                    <div className="qr-overlay">
                      <div className="qr-frame">
                        <div className="c tl" /><div className="c tr" />
                        <div className="c bl" /><div className="c br" />
                        <div className="qr-scanline" />
                      </div>
                    </div>
                  </div>
                  <div className="qr-phone-bar">
                    <span className="qr-phone-bar-status">{scanning ? "SCANNING" : "READY"}</span>
                    <span className="qr-phone-bar-txt">{scanning ? "Align QR in frame" : "Tap Start Scanning"}</span>
                    {scanning && (
                      <div className="qr-scan-dot">
                        <div className="qr-scan-pulse" /> LIVE
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="qr-float-card">
                <div className="qr-float-label">Sample QR</div>
                <div className="qr-code-visual">
                  {QR_PATTERN.map((on, i) => (
                    <div key={i} className={`qr-cell ${on ? "on" : "off"}`} />
                  ))}
                </div>
                <div className="qr-scan-dot">
                  <div className="qr-scan-pulse" /> Scanning...
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MANUAL VERIFY + RESULT ── */}
        <section className="qr-section">
          <div className="qr-section-label">Manual Entry</div>
          <h2 className="qr-section-title">Manual Verification</h2>
          <p className="qr-section-sub">
            If camera isn't available, paste the signed token printed on the lot label below.
          </p>

          <div className="qr-cards-row">
            <div className="qr-card">
              <div className="qr-card-title">Enter Token</div>
              <div className="qr-card-sub">
                Paste the token from the QR label. Format: <code>slf1.&lt;payload&gt;.&lt;sig&gt;</code>
              </div>
              <textarea
                className="qr-textarea"
                rows={5}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="slf1.<payload>.<signature>"
              />
              <div className="qr-btn-row">
                <button className="qr-btn-primary" onClick={() => verifyAndPickup(input)} disabled={!input.trim()}>
                  Verify &amp; Pickup
                </button>
                <button className="qr-btn-outline" onClick={reset}>Clear</button>
              </div>
            </div>

            {result ? (
              <div className="qr-card">
                <div className="qr-result-head">
                  <div>
                    <div className="qr-card-title">✅ Verification Successful</div>
                    <div className="qr-card-sub">Lot moved to transit for delivery.</div>
                  </div>
                  <span className="qr-status-pill">IN_TRANSIT</span>
                </div>
                <div className="qr-kv">
                  {[
                    ["Lot ID",    `#${result.lot.id}`],
                    ["Food Item", result.lot.foodName || "Lot Item"],
                    ["Category",  result.lot.category || "—"],
                    ["Pickup",    "Confirmed ✓"],
                  ].map(([k, v], i) => (
                    <div key={i} className="qr-kv-row">
                      <span>{k}</span><b>{v}</b>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18 }}>
                  <button className="qr-btn-outline"
                    onClick={() => navigate(`/transparency/${result.lot.id}`)}>
                    View Transparency →
                  </button>
                </div>
              </div>
            ) : (
              <div className="qr-card qr-card-empty">
                <div style={{ fontSize: "2.5rem" }}>⬛</div>
                <div className="qr-empty-title">Result will appear here</div>
                <div className="qr-empty-sub">
                  Scan a QR code or verify a token to see lot details.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="qr-steps">
          <div className="qr-section-label">Process</div>
          <h2 className="qr-section-title">How QR Verification Works</h2>
          <p className="qr-section-sub">
            Three simple steps to confirm pickup and update lot status in real time.
          </p>

          <div className="qr-steps-grid">
            {[
              { n: "1", title: "Scan the Label",      desc: "Open camera scan and align the QR code in the frame for an instant read. Works with any printed lot label." },
              { n: "2", title: "Signature Verified",  desc: "The token is cryptographically verified before any lot status is updated — no tampering possible." },
              { n: "3", title: "Status Updated",      desc: "Lot becomes IN_TRANSIT and is immediately visible across operations, tracking, and the dashboard." },
            ].map((s, i) => (
              <div key={i} className="qr-step-card">
                <div className="qr-step-num">{s.n}</div>
                <div className="qr-step-title">{s.title}</div>
                <div className="qr-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          <div className="qr-strip">
            <div className="qr-strip-inner">
              {[
                {
                  title: "Why This Matters",
                  content: <p>Expired packaged food can be repurposed for approved non-human use. Verification ensures the supply chain stays controlled and auditable end-to-end.</p>
                },
                {
                  title: "Best Scanning Tips",
                  content: <ul><li>Use bright, even lighting</li><li>Keep QR flat — not curved</li><li>Hold camera steady for 1–2 sec</li><li>Avoid glare on labels</li></ul>
                },
                {
                  title: "Security Notes",
                  content: <ul><li>Tokens are cryptographically signed</li><li>No update without valid verification</li><li>Duplicate pickup is blocked</li></ul>
                },
              ].map((s, i) => (
                <div key={i} className="qr-strip-card">
                  <div className="qr-strip-title">{s.title}</div>
                  {s.content}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>{/* end qr-page */}

      {/* ═══════════════════════════════════════
          FOOTER — matches screenshot exactly
      ═══════════════════════════════════════ */}
      <footer className="qr-footer-full">
        <div className="qr-footer-main">

          {/* Brand col */}
          <div className="qr-footer-brand">
            <div className="qr-footer-logo">
              <LogoIcon />
              <span className="qr-footer-logo-text">SecondLife <strong>Foods</strong></span>
            </div>
            <p className="qr-footer-tagline">
              Transforming expired, packaged goods into valuable resources to reduce food waste and nourish animals.
            </p>
            <div className="qr-footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="qr-social-btn"><FacebookIcon /></a>
              <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="qr-social-btn"><TwitterIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="qr-social-btn"><LinkedInIcon /></a>
            </div>
          </div>

          {/* Contact col */}
          <div className="qr-footer-col">
            <h4 className="qr-footer-col-title">Contact</h4>
            <ul className="qr-footer-contact">
              <li><MailIcon /><a href="mailto:contact@secondlifefoods.org">contact@secondlifefoods.org</a></li>
              <li><PhoneIcon /><a href="tel:+11234567890">+1 (123) 456-7890</a></li>
              <li><PinIcon /><span>123 Green St.<br />Cityname, ST 12345</span></li>
            </ul>
          </div>

          {/* Quick Links col */}
          <div className="qr-footer-col">
            <h4 className="qr-footer-col-title">Quick Links</h4>
            <ul className="qr-footer-links">
              <li><button onClick={() => navigate("/home")}>Home</button></li>
              <li><button onClick={() => navigate("/create-lot")}>Donate Food Lot</button></li>
              <li><button onClick={() => navigate("/create")}>Create Lot</button></li>
              <li><button onClick={() => navigate("/track")}>Track Lot</button></li>
            </ul>
          </div>

          {/* Resources col */}
          <div className="qr-footer-col">
            <h4 className="qr-footer-col-title">Resources</h4>
            <ul className="qr-footer-links">
              <li><button onClick={() => navigate("/knowledge")}>Knowledge Pocket</button></li>
              <li><button onClick={() => navigate("/qr")}>QR Scanner</button></li>
              <li><button onClick={() => navigate("/admin")}>Admin Panel</button></li>
              <li><button onClick={() => navigate("/testing")}>Testing Screen</button></li>
            </ul>
          </div>

          {/* Newsletter col */}
          <div className="qr-footer-col">
            <h4 className="qr-footer-col-title">Newsletter</h4>
            <p className="qr-footer-news-desc">Subscribe to our newsletter</p>
            <form className="qr-footer-news-form"
              onSubmit={e => { e.preventDefault(); setNewsEmail(""); }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={newsEmail}
                onChange={e => setNewsEmail(e.target.value)}
                required />
              <button type="submit">Subscribe</button>
            </form>
          </div>

        </div>

        <div className="qr-footer-bottom">
          <p>© 2024 <strong>SecondLife Foods.</strong> All rights reserved.</p>
          <div className="qr-footer-bottom-links">
            <button onClick={() => navigate("/privacy")}>Privacy Policy</button>
            <span>|</span>
            <button onClick={() => navigate("/terms")}>Terms of Service</button>
          </div>
        </div>
      </footer>

    </div>
  );
}