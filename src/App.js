import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import QRScan from "./Components/QRScan";
import CreateLot from "./Components/CreateLot";
import LotDetails from "./Components/LotDetails";
import Login from "./Components/Login";
import Compliance from "./Components/Compliance";
import Reports from "./Components/Reports";
import Recalls from "./Components/Recalls";
import Relabeling from "./Components/Relabeling";
import ReportMisuse from "./Components/ReportMisuse";
import Transparency from "./Components/Transparency";
import Donation from "./Components/Donation";
import TrackLot from "./Components/Tracklot";
import Testing from "./Components/Testing";
import Admin from "./Components/Admin";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Main pages */}
        <Route path="/testing" element={<Testing />} />
        <Route path="/create-lot" element={<Donation />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/track" element={<TrackLot />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/qr" element={<QRScan />} />
        <Route path="/create" element={<CreateLot />} />
        <Route path="/lot/:id" element={<LotDetails />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Compliance & governance */}
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/recalls" element={<Recalls />} />
        <Route path="/relabel" element={<Relabeling />} />
        <Route path="/misuse" element={<ReportMisuse />} />
        <Route path="/transparency" element={<Transparency />} />
      </Routes>
    </Router>
  );
}

export default App;