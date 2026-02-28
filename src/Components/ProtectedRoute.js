import { Navigate } from "react-router-dom";
import "./ProtectedRoute.css";
import { getUser } from "../auth/auth.js";

export default function ProtectedRoute({ children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
