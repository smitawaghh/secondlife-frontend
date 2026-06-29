import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUser, logout as doLogout } from "../auth/auth.js";

function buildSideNav(role) {
  const base = [{ to: "/", label: "Dashboard", end: true }];

  if (role === "DONOR") return [
    ...base,
    { to: "/lots/new", label: "Create Lot" },
    { to: "/reports",  label: "My Lots" },
  ];
  if (role === "PARTNER") return [
    ...base,
    { to: "/qr-scan", label: "QR Scan" },
  ];
  if (role === "RECEIVER") return [
    ...base,
    { to: "/compliance", label: "Compliance" },
    { to: "/reports",    label: "Reports" },
  ];
  return [
    ...base,
    { to: "/lots/new",      label: "Create Lot" },
    { to: "/qr-scan",      label: "QR Scan" },
    { to: "/reports",      label: "Reports" },
    { to: "/compliance",   label: "Compliance" },
    { to: "/relabeling",   label: "Relabeling" },
    { to: "/recalls",      label: "Recalls" },
    { to: "/report-misuse", label: "Report Misuse" },
  ];
}

export default function AppLayout() {
  const user  = getUser();
  const role  = user?.role  || "ADMIN";
  const name  = user?.name  || "User";
  const email = user?.email || "";

  const sideNav = buildSideNav(role);
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!profileOpen) return;
    function handler(e) {
      if (e.target.closest?.(".slf-profile")) return;
      setProfileOpen(false);
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [profileOpen]);

  function logout() {
    doLogout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      {/* ── Minimal top bar: logo + avatar only ── */}
      <nav className="slf-nav">
        <button
          className="slf-nav__burger"
          onClick={() => setSidebarOpen((x) => !x)}
          type="button"
          aria-label="Toggle navigation"
        >
          <span /><span /><span />
        </button>

        <button className="slf-nav__brand" onClick={() => navigate("/")} type="button">
          <div className="slf-nav__logo">
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M17 8C8 10 5.9 16.17 3.82 19.12 2.96 20.26 2.07 21 1 21h22c-3-3-5.5-7-7-13z" />
            </svg>
          </div>
          <span className="slf-nav__name">SecondLife <strong>Foods</strong></span>
        </button>

        <div className="slf-nav__spacer" />

        <div className="slf-profile">
          <button
            className="slf-nav__avatar"
            onClick={() => setProfileOpen((x) => !x)}
            type="button"
            aria-label="Profile menu"
          >
            {name.slice(0, 1).toUpperCase()}
          </button>

          {profileOpen && (
            <div className="slf-profile__menu">
              <div className="slf-profile__meta">
                <div className="slf-profile__uname">{name}</div>
                <div className="slf-profile__urole">{role}</div>
                {email && <div className="slf-profile__uemail">{email}</div>}
              </div>
              <button
                className="slf-profile__item"
                onClick={() => { navigate("/home"); setProfileOpen(false); }}
                type="button"
              >
                Home page
              </button>
              <button
                className="slf-profile__item"
                onClick={() => { navigate("/login"); setProfileOpen(false); }}
                type="button"
              >
                Switch user
              </button>
              <button
                className="slf-profile__item slf-profile__item--danger"
                onClick={logout}
                type="button"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Content row ── */}
      <div className="app-content">
        {sidebarOpen && (
          <div className="app-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`app-sidebar${sidebarOpen ? " app-sidebar--open" : ""}`}>
          {/* User identity */}
          <div className="app-sidebar__user">
            <div className="app-sidebar__avatar">{name.slice(0, 1).toUpperCase()}</div>
            <div className="app-sidebar__user-info">
              <div className="app-sidebar__name">{name}</div>
              <div className="app-sidebar__email">{role.charAt(0) + role.slice(1).toLowerCase()}</div>
            </div>
          </div>

          {/* Primary action */}
          {(role === "ADMIN" || role === "DONOR") && (
            <div className="app-sidebar__newlot-wrap">
              <button
                className="app-sidebar__newlot"
                onClick={() => { navigate("/lots/new"); setSidebarOpen(false); }}
                type="button"
              >
                + New Lot
              </button>
            </div>
          )}

          {/* Navigation */}
          <nav className="app-sidebar__nav">
            {sideNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "app-sidebar__link app-sidebar__link--active" : "app-sidebar__link"
                }
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="app-main">
          <Outlet />
          <footer className="app-footer">
            <span>© 2026 SecondLife Foods</span>
            <span>Reducing food waste · SDG 12 Compliant</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
