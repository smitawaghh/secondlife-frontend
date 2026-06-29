import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute.jsx";
import RequireRole from "../components/RequireRole.jsx";
import AppLayout from "../components/AppLayout.jsx";

import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import CreateLot from "../pages/CreateLot.jsx";
import LotDetails from "../pages/LotDetails.jsx";
import QRScan from "../pages/QRScan.jsx";
import Reports from "../pages/Reports.jsx";

import Compliance from "../pages/Compliance.jsx";
import Recalls from "../pages/Recalls.jsx";
import Relabeling from "../pages/Relabeling.jsx";
import Transparency from "../pages/Transparency.jsx";
import ReportMisuse from "../pages/ReportMisuse.jsx";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/transparency/:lotId" element={<Transparency />} />

      {/* Protected shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Lots */}
        <Route
          path="lots/new"
          element={
            <RequireRole allowed={["ADMIN", "DONOR"]}>
              <CreateLot />
            </RequireRole>
          }
        />
        <Route
          path="lots/:lotId"
          element={
            <RequireRole allowed={["ADMIN", "DONOR", "RECEIVER"]}>
              <LotDetails />
            </RequireRole>
          }
        />

        {/* QR */}
        <Route
          path="qr-scan"
          element={
            <RequireRole allowed={["ADMIN", "PARTNER"]}>
              <QRScan />
            </RequireRole>
          }
        />

        {/* Reports */}
        <Route
          path="reports"
          element={
            <RequireRole allowed={["ADMIN"]}>
              <Reports />
            </RequireRole>
          }
        />

        {/* Operations */}
        <Route
          path="compliance"
          element={
            <RequireRole allowed={["ADMIN", "RECEIVER"]}>
              <Compliance />
            </RequireRole>
          }
        />
        <Route
          path="relabeling"
          element={
            <RequireRole allowed={["ADMIN"]}>
              <Relabeling />
            </RequireRole>
          }
        />
        <Route
          path="recalls"
          element={
            <RequireRole allowed={["ADMIN"]}>
              <Recalls />
            </RequireRole>
          }
        />
        <Route
          path="report-misuse"
          element={
            <RequireRole allowed={["ADMIN"]}>
              <ReportMisuse />
            </RequireRole>
          }
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}