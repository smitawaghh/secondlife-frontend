import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./AppLayout.css";
import { useEffect, useMemo, useState } from "react";
import { getUser, logout as doLogout } from "../auth/auth.js";

function buildNav(role) {
  const base = [{ type: "link", to: "/", label: "Dashboard" }];

  if (role === "DONOR") {
    return [
      ...base,
      {
        type: "menu",
        label: "Lots",
        items: [
          { to: "/lots/new", label: "Create Lot" },
          { to: "/lots", label: "Lot Register" },
        ],
      },
      { type: "link", to: "/reports", label: "Reports" },
    ];
  }

  if (role === "PARTNER") {
    return [...base, { type: "link", to: "/qr-scan", label: "QR Verify" }];
  }

  if (role === "RECEIVER") {
    return [
      ...base,
      { type: "link", to: "/compliance", label: "Compliance" },
      { type: "link", to: "/reports", label: "Reports" },
    ];
  }

  // ADMIN
  return [
    ...base,
    {
      type: "menu",
      label: "Lots",
      items: [
        { to: "/lots/new", label: "Create Lot" },
        { to: "/lots", label: "Lot Register" },
      ],
    },
    { type: "link", to: "/qr-scan", label: "QR" },
    { type: "link", to: "/reports", label: "Reports" },
    {
      type: "menu",
      label: "Operations",
      items: [
        { to: "/compliance", label: "Compliance" },
        { to: "/relabeling", label: "Relabeling" },
        { to: "/recalls", label: "Recalls" },
        { to: "/report-misuse", label: "Report Misuse" },
      ],
    },
  ];
}

function NavItemLink({ to, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
      {label}
    </NavLink>
  );
}

function Dropdown({ label, items, closeAll }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      const el = e.target;
      if (el.closest && el.closest(".nav-dd")) return;
      setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  return (
    <div className="nav-dd">
      <button
        className={open ? "navbtn active" : "navbtn"}
        onClick={() => setOpen((x) => !x)}
        type="button"
      >
        {label}
        <span className="chev" aria-hidden="true" />
      </button>

      {open ? (
        <div className="navmenu">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) => (isActive ? "navmenu-item active" : "navmenu-item")}
              onClick={() => {
                setOpen(false);
                closeAll?.();
              }}
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AppLayout() {
  const user = getUser();
  const role = user?.role || "ADMIN";
  const name = user?.name || "User";

  const nav = useMemo(() => buildNav(role), [role]);
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setProfileOpen(false);
  }, [location.pathname]);

  function logout() {
    doLogout();
    navigate("/login");
  }

  function closeAll() {
    setProfileOpen(false);
  }

  return (
    <div className="app-shell">
      <header className="topnav">
        <div className="topnav-inner">
          <div className="topnav-left">
            <button className="brandbtn" onClick={() => navigate("/")} type="button">
              <span className="brandmark">SLF</span>
              <span className="brandtext">
                <span className="brandtitle">SecondLifeFood</span>
                <span className="brandsub">{role}</span>
              </span>
            </button>
          </div>

          <nav className="topnav-center">
            {nav.map((item) => {
              if (item.type === "link") return <NavItemLink key={item.to} to={item.to} label={item.label} />;
              return <Dropdown key={item.label} label={item.label} items={item.items} closeAll={closeAll} />;
            })}
          </nav>

          <div className="topnav-right">
            <div className="profilewrap">
              <button
                className={profileOpen ? "profilebtn active" : "profilebtn"}
                onClick={() => setProfileOpen((x) => !x)}
                type="button"
              >
                <span className="avatar">{(name || "U").slice(0, 1).toUpperCase()}</span>
                <span className="profilename">{name}</span>
                <span className="chev" aria-hidden="true" />
              </button>

              {profileOpen ? (
                <div className="profilemenu">
                  <div className="profilemeta">
                    <div className="pname">{name}</div>
                    <div className="prole">{role}</div>
                  </div>
                  <button className="pmenu" onClick={() => navigate("/login")} type="button">
                    Switch user
                  </button>
                  <button className="pmenu danger" onClick={logout} type="button">
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
