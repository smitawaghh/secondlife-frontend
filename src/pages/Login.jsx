import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, getDemoAccounts } from "../auth/auth.js";

const DEMO_ROLES = [
  {
    key: "ADMIN",
    label: "Admin",
    desc: "Full access — lots, recalls, compliance, reports",
  },
  {
    key: "DONOR",
    label: "Donor",
    desc: "Create lots, track donations and impact",
  },
  {
    key: "PARTNER",
    label: "Delivery Partner",
    desc: "QR verify and log lot pickups",
  },
  {
    key: "RECEIVER",
    label: "Receiver NGO",
    desc: "View incoming lots and run compliance",
  },
];

const LOGO_SVG = (
  <svg viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M17 8C8 10 5.9 16.17 3.82 19.12 2.96 20.26 2.07 21 1 21h22c-3-3-5.5-7-7-13z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const demo = useMemo(() => getDemoAccounts(), []);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("ADMIN");
  const [err, setErr]           = useState("");

  function oneClickLogin(roleKey) {
    setErr("");
    const account = demo.find((d) => d.role === roleKey);
    if (!account) return setErr("Demo account not found.");
    try {
      authenticate({ email: account.email, password: account.password, role: roleKey });
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e?.message || "Login failed. Try again.");
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const cleanEmail = String(email || "").trim();
    const cleanPass  = String(password || "");
    if (!cleanEmail) return setErr("Email is required.");
    if (!cleanPass)  return setErr("Password is required.");
    try {
      authenticate({ email: cleanEmail, password: cleanPass, role });
      navigate("/", { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Invalid credentials for selected role.");
    }
  }

  return (
    <div className="auth-page">
      {/* ── Left panel ── */}
      <div className="auth-panel">
        {/* Brand */}
        <div className="auth-logo-row">
          <div className="auth-logomark">{LOGO_SVG}</div>
          <div>
            <div className="auth-app-name">SecondLife Foods</div>
            <div className="auth-app-tagline">Secure redistribution platform</div>
          </div>
        </div>

        <h1 className="auth-panel-title">Welcome back</h1>
        <p className="auth-panel-sub">
          Select a role below to enter with demo access, or sign in with your credentials.
        </p>

        {/* One-click demo access */}
        <div className="auth-demo-grid">
          {DEMO_ROLES.map((r) => (
            <button
              key={r.key}
              type="button"
              className="auth-role-card"
              onClick={() => oneClickLogin(r.key)}
            >
              <div className="auth-role-card__name">{r.label}</div>
              <div className="auth-role-card__desc">{r.desc}</div>
              <div className="auth-role-card__arrow">Enter →</div>
            </button>
          ))}
        </div>

        <div className="auth-divider"><span>or sign in with credentials</span></div>

        {/* Credential form */}
        <form onSubmit={onSubmit} className="auth-cred-form">
          <div className="field">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {DEMO_ROLES.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@slf.com"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <button className="btn primary" type="submit">Sign in</button>
          {err && <div className="auth-err">{err}</div>}
        </form>
      </div>

      {/* ── Right panel (brand visual) ── */}
      <div className="auth-visual">
        <div className="auth-visual__inner">
          <div className="auth-visual__eyebrow">SecondLife Foods · Animal Welfare</div>
          <h2 className="auth-visual__title">
            Your surplus is<br />
            <em>their survival.</em>
          </h2>
          <p className="auth-visual__desc">
            Every expired packet you donate becomes a meal for a stray dog, a shelter cat,
            or a rescued bird. Safe, verified, and life-changing.
          </p>
          <div className="auth-visual__stats">
            <div>
              <div className="auth-visual__stat-val">38T</div>
              <div className="auth-visual__stat-lab">Food diverted</div>
            </div>
            <div>
              <div className="auth-visual__stat-val">6,620</div>
              <div className="auth-visual__stat-lab">Animals fed</div>
            </div>
            <div>
              <div className="auth-visual__stat-val">6</div>
              <div className="auth-visual__stat-lab">Shelters</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
