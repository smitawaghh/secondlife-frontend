import { useMemo, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { authenticate, getDemoAccounts } from "../auth/auth.js";

const ROLE_TO_LABEL = {
  ADMIN: "Admin",
  DONOR: "Donor",
  PARTNER: "Delivery Partner",
  RECEIVER: "Receiver",
};

export default function Login() {
  const navigate = useNavigate();
  const demo = useMemo(() => getDemoAccounts(), []);

  const [role, setRole] = useState("ADMIN");
  const [email, setEmail] = useState("admin@slf.com");
  const [password, setPassword] = useState("Admin@123");
  const [err, setErr] = useState("");

  const roleLabel = ROLE_TO_LABEL[role] || role;

  function pickRole(nextRole) {
    setErr("");
    setRole(nextRole);

    const preset = demo.find((d) => d.role === nextRole);
    if (preset) {
      setEmail(preset.email);
      setPassword(preset.password);
    } else {
      setEmail("");
      setPassword("");
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    setErr("");

    const cleanEmail = String(email || "").trim();
    const cleanPass = String(password || "");

    if (!cleanEmail) return setErr("Email is required.");
    if (!cleanPass) return setErr("Password is required.");

    try {
      authenticate({ email: cleanEmail, password: cleanPass, role });
      navigate("/", { replace: true });
    } catch (ex) {
      setErr(ex?.message || "Invalid credentials for selected role.");
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-badge">SLF</div>
          <div className="auth-brandtext">
            <div className="auth-title">SecondLifeFood</div>
            <div className="auth-sub">Secure redistribution + custody traceability</div>
          </div>
        </div>

        <div className="auth-roles">
          {Object.keys(ROLE_TO_LABEL).map((r) => (
            <button
              key={r}
              type="button"
              className={role === r ? "auth-role active" : "auth-role"}
              onClick={() => pickRole(r)}
            >
              {ROLE_TO_LABEL[r]}
            </button>
          ))}
        </div>

        {err ? <div className="error">{err}</div> : null}

        <form onSubmit={onSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@slf.com"
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
            />
          </div>

          <button className="btn primary auth-submit" type="submit">
            Sign in as {roleLabel}
          </button>

          <div className="auth-foot muted">
            Demo login (frontend-only). Pick a role to autofill credentials.
          </div>
        </form>
      </div>
    </div>
  );
}
