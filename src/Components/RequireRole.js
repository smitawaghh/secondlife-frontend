import { Navigate, useLocation } from "react-router-dom";
import "./RequireRole.css";
import { getUser } from "../auth/auth.js";

function normRole(role) {
  return String(role || "").trim().toUpperCase();
}

export default function RequireRole({ allowed = [], children }) {
  const user = getUser();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const role = normRole(user.role);
  const allowedNorm = allowed.map(normRole);

  if (allowedNorm.length && !allowedNorm.includes(role)) {
    // Always send to dashboard if forbidden. Simple and predictable.
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}
