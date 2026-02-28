import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner container">
        <div className="brand">
          <div className="brand-badge">SLF</div>
          <div>
            <div className="brand-title">SecondLifeFood</div>
            <div className="brand-subtitle">Food Redistribution + Traceability</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
          <NavLink to="/lots/new" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Create Lot
          </NavLink>
          <NavLink to="/compliance" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Compliance
          </NavLink>
          <NavLink to="/relabeling" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Relabeling
          </NavLink>
          <NavLink to="/recalls" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Recalls
          </NavLink>
          <NavLink to="/qr-scan" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            QR
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Reports
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
