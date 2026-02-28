import React from "react";
import "./Admin.css";

const Admin = () => {
  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <span className="admin-tag">CONTROL CENTER</span>
        <h1 className="admin-title">
          Platform <em>Administration</em>
        </h1>
        <p className="admin-subtitle">
          Monitor food lots, verify compliance, and oversee redistribution
          activity across the SecondLife Foods ecosystem.
        </p>
      </div>

      {/* STATS */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <h3>Total Lots</h3>
          <p>128</p>
        </div>

        <div className="admin-stat-card">
          <h3>Pending Approvals</h3>
          <p>14</p>
        </div>

        <div className="admin-stat-card">
          <h3>Active Transfers</h3>
          <p>22</p>
        </div>

        <div className="admin-stat-card">
          <h3>Completed Donations</h3>
          <p>341</p>
        </div>
      </div>

      {/* MANAGEMENT SECTION */}
      <div className="admin-actions">
        <h2 className="admin-section-title">Management Actions</h2>

        <div className="admin-action-grid">
          <a href="/create" className="admin-action-card">
            <h4>Create Lot</h4>
            <p>Add and verify a new donated lot.</p>
          </a>

          <a href="/track" className="admin-action-card">
            <h4>Track Transfers</h4>
            <p>View real-time QR traceability logs.</p>
          </a>

          <a href="/compliance" className="admin-action-card">
            <h4>Compliance Review</h4>
            <p>Approve chemical stability checks.</p>
          </a>

          <a href="/reports" className="admin-action-card">
            <h4>System Reports</h4>
            <p>Analyze redistribution performance.</p>
          </a>
        </div>
      </div>

    </div>
  );
};

export default Admin;