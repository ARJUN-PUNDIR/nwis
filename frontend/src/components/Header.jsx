import React from 'react';
import { Activity, ShieldAlert, Compass, Layers, Radio } from 'lucide-react';

export default function Header({ snapshot, radius, onRadiusChange }) {
  const telemetry = snapshot?.telemetry || {};
  const activeWell = snapshot?.active_well_info || {};
  const dominantHazard = snapshot?.risk_matrix?.dominant_hazard || {};
  const alertLevel = snapshot?.sentinel_assessment?.alert_level || 'NOMINAL';

  const getAlertBadgeClass = () => {
    if (alertLevel === 'CRITICAL') return 'chip-value critical';
    if (alertLevel === 'ADVISORY') return 'chip-value warning';
    return 'chip-value';
  };

  return (
    <header className="header-bar">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Activity size={24} />
        </div>
        <div className="brand-text">
          <h1>
            OIL INDIA LIMITED
            <span className="brand-badge">NWIS v2.0</span>
          </h1>
          <p className="brand-subtext">Nearby Wells Intelligence & Decision-Support System</p>
        </div>
      </div>

      <div className="active-well-chips">
        <div className="chip-item">
          <span className="chip-label">Active Well</span>
          <span className="chip-value">{activeWell.name || 'NHKT-A01'}</span>
        </div>

        <div className="chip-item">
          <span className="chip-label">Current Depth</span>
          <span className="chip-value">
            {telemetry.measured_depth_m ? `${telemetry.measured_depth_m.toFixed(1)} m MD` : '2740.0 m'}
          </span>
        </div>

        <div className="chip-item">
          <span className="chip-label">Active Formation</span>
          <span className="chip-value" style={{ color: 'var(--active-blue)' }}>
            {telemetry.formation || 'Tipam Sandstone'}
          </span>
        </div>

        <div className="chip-item">
          <span className="chip-label">Hazard Status</span>
          <span className={getAlertBadgeClass()}>
            {alertLevel === 'CRITICAL' ? '🔴 CRITICAL RISK' : alertLevel === 'ADVISORY' ? '🟡 ADVISORY ZONE' : '🟢 NOMINAL'}
          </span>
        </div>

        <div className="ertmac-status-badge">
          <div className="pulse-dot"></div>
          <span>eRTMAC WITSML LIVE</span>
        </div>
      </div>
    </header>
  );
}
