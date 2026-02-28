import { useMemo, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { authenticate, getDemoAccounts } from "../auth/auth.js";

const ROLE_TO_LABEL = {
  ADMIN:    "Admin",
  DONOR:    "Donor",
  PARTNER:  "Delivery Partner",
  RECEIVER: "Receiver",
};

const ROLE_META = {
  ADMIN:    { icon: <AdminIcon />,    desc: "Manage donations, NGOs & platform activity"  },
  DONOR:    { icon: <DonorIcon />,    desc: "Create and track your food lot donations"     },
  PARTNER:  { icon: <PartnerIcon />,  desc: "Manage pickups, deliveries and routes"        },
  RECEIVER: { icon: <ReceiverIcon />, desc: "View incoming lots and shelter inventory"     },
};

// ── SVG ROLE ICONS ───────────────────────────────────────────
function AdminIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function DonorIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function PartnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <rect x="1" y="3" width="15" height="13" rx="1"/>
      <path d="M16 8h4l3 3v5h-7V8z"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}
function ReceiverIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}

// ── EYE ICON ─────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// ── LEFT PANEL STATS ─────────────────────────────────────────
const STATS = [
  { value: "38T",   label: "Food diverted monthly" },
  { value: "6,620", label: "Animals fed this month" },
  { value: "32",    label: "Verified NGO partners"  },
];

// ── TICKER ───────────────────────────────────────────────────
const TICKS = [
  "🐾 4,200 dogs fed","🐱 1,800 cats helped","🐦 620 birds nourished",
  "🌿 38T diverted","💛 112 donors","🏠 6 shelters",
  "🐾 4,200 dogs fed","🐱 1,800 cats helped","🌿 38T diverted",
];

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function Login() {
  const navigate  = useNavigate();
  const demo      = useMemo(() => getDemoAccounts(), []);

  const [role,     setRole]     = useState("ADMIN");
  const [email,    setEmail]    = useState("admin@slf.com");
  const [password, setPassword] = useState("Admin@123");
  const [err,      setErr]      = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  const roleLabel = ROLE_TO_LABEL[role] || role;

  function pickRole(nextRole) {
    setErr("");
    setRole(nextRole);
    const preset = demo.find((d) => d.role === nextRole);
    if (preset) { setEmail(preset.email); setPassword(preset.password); }
    else        { setEmail(""); setPassword(""); }
  }

  function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const cleanEmail = String(email || "").trim();
    const cleanPass  = String(password || "");
    if (!cleanEmail) return setErr("Email is required.");
    if (!cleanPass)  return setErr("Password is required.");

    setLoading(true);
    setTimeout(() => {
      try {
        authenticate({ email: cleanEmail, password: cleanPass, role });
        navigate("/", { replace: true });
      } catch (ex) {
        setErr(ex?.message || "Invalid credentials for selected role.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="lg-wrap">

      {/* ── LEFT PANEL ── */}
      <div className="lg-left">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80&auto=format&fit=crop"
          alt="nature"
          className="lg-left__bg"
        />
        <div className="lg-left__overlay" />

        <div className="lg-left__content">
          {/* Brand */}
          <a href="/" className="lg-brand">
            <div className="lg-brand__logo">
              <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 13H8v-1c0-2.67 5.33-4 8-4v5z" />
              </svg>
            </div>
            <span className="lg-brand__name">SecondLife <strong>Foods</strong></span>
          </a>

          {/* Hero copy */}
          <div className="lg-hero">
            <div className="lg-hero__eyebrow">
              <span className="lg-hero__dot" />
              Secure Portal
            </div>
            <h1 className="lg-hero__title">
              Your surplus is<br /><em>their survival.</em>
            </h1>
            <p className="lg-hero__sub">
              Every expired packet you donate becomes a meal for a stray dog,
              a shelter cat, or a rescued bird. Safe. Verified. Life-changing.
            </p>
          </div>

          {/* Stats */}
          <div className="lg-stats">
            {STATS.map((s) => (
              <div key={s.label} className="lg-stat">
                <div className="lg-stat__value">{s.value}</div>
                <div className="lg-stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker */}
        <div className="lg-ticker-wrap">
          <div className="lg-ticker">
            {TICKS.map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lg-right">
        <div className="lg-form-wrap">

          {/* Top label */}
          <div className="lg-form__eyebrow">Welcome back</div>
          <h2 className="lg-form__title">Sign in to your account</h2>
          <p className="lg-form__sub">Select your role, then enter your credentials.</p>

          {/* Role pills */}
          <div className="lg-roles">
            {Object.keys(ROLE_TO_LABEL).map((r) => (
              <button
                key={r}
                type="button"
                className={`lg-role ${role === r ? "lg-role--active" : ""}`}
                onClick={() => pickRole(r)}
              >
                <span className={`lg-role__icon ${role === r ? "lg-role__icon--active" : ""}`}>
                  {ROLE_META[r].icon}
                </span>
                <span className="lg-role__label">{ROLE_TO_LABEL[r]}</span>
              </button>
            ))}
          </div>

          {/* Role description */}
          <div className="lg-role-desc">
            <span className="lg-role-desc__icon">{ROLE_META[role].icon}</span>
            <span>{ROLE_META[role].desc}</span>
          </div>

          {/* Error */}
          {err && (
            <div className="lg-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="15" height="15">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {err}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="lg-form">

            <div className="lg-field">
              <label className="lg-label">Email address</label>
              <div className="lg-input-wrap">
                <span className="lg-input__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/>
                  </svg>
                </span>
                <input
                  className="lg-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@slf.com"
                  autoComplete="username"
                  type="email"
                />
              </div>
            </div>

            <div className="lg-field">
              <div className="lg-label-row">
                <label className="lg-label">Password</label>
                <a href="/forgot" className="lg-forgot">Forgot password?</a>
              </div>
              <div className="lg-input-wrap">
                <span className="lg-input__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input
                  className="lg-input lg-input--pw"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lg-pw-toggle"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <button
              className={`lg-submit ${loading ? "lg-submit--loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="lg-spinner" />
              ) : (
                <>
                  Sign in as {roleLabel}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

          </form>

          <div className="lg-footer-note">
            Demo login — frontend only. Pick a role to autofill credentials.
          </div>

          <div className="lg-signup">
            Don't have an account?&nbsp;
            <a href="/signup">Create one →</a>
          </div>

        </div>
      </div>
    </div>
  );
}
