import React from 'react';
import { Gauge, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export default function TelemetryStrip({ telemetry }) {
  const t = telemetry || {};

  // Evaluation criteria
  const isRopLow = t.rop_m_hr !== undefined && t.rop_m_hr < 6.0;
  const isTorqueHigh = t.torque_kn_m !== undefined && t.torque_kn_m > 22.0;
  const isSppLow = t.spp_psi !== undefined && t.spp_psi < 2550;
  const isPitLoss = t.pit_delta_m3_hr !== undefined && t.pit_delta_m3_hr < -1.0;

  return (
    <div className="telemetry-strip-grid">
      {/* ROP */}
      <div className="gauge-box">
        <span className="gauge-title">Rate of Penetration</span>
        <div className="gauge-value" style={{ color: isRopLow ? 'var(--alert-danger)' : 'var(--text-main)' }}>
          {t.rop_m_hr !== undefined ? t.rop_m_hr.toFixed(1) : '14.5'}
          <span className="gauge-unit">m/hr</span>
        </div>
        <div className={`gauge-status ${isRopLow ? 'critical' : 'nominal'}`}>
          {isRopLow ? <TrendingDown size={13} /> : <CheckCircle size={13} />}
          <span>{isRopLow ? 'Drilling Stalled' : 'Nominal ROP'}</span>
        </div>
      </div>

      {/* Rotary Torque */}
      <div className="gauge-box">
        <span className="gauge-title">Rotary Torque</span>
        <div className="gauge-value" style={{ color: isTorqueHigh ? 'var(--alert-danger)' : 'var(--text-main)' }}>
          {t.torque_kn_m !== undefined ? t.torque_kn_m.toFixed(1) : '17.2'}
          <span className="gauge-unit">kN·m</span>
        </div>
        <div className={`gauge-status ${isTorqueHigh ? 'critical' : 'nominal'}`}>
          {isTorqueHigh ? <TrendingUp size={13} /> : <CheckCircle size={13} />}
          <span>{isTorqueHigh ? 'Torque Spike Anomaly' : 'Stable Torque'}</span>
        </div>
      </div>

      {/* Standpipe Pressure */}
      <div className="gauge-box">
        <span className="gauge-title">Standpipe Pressure</span>
        <div className="gauge-value" style={{ color: isSppLow ? 'var(--alert-warning)' : 'var(--text-main)' }}>
          {t.spp_psi !== undefined ? Math.round(t.spp_psi) : '2620'}
          <span className="gauge-unit">psi</span>
        </div>
        <div className={`gauge-status ${isSppLow ? 'warning' : 'nominal'}`}>
          {isSppLow ? <TrendingDown size={13} /> : <CheckCircle size={13} />}
          <span>{isSppLow ? 'Pressure Loss Delta' : 'Circulation Stable'}</span>
        </div>
      </div>

      {/* Mud Flow Rate */}
      <div className="gauge-box">
        <span className="gauge-title">Mud Flow Rate</span>
        <div className="gauge-value" style={{ color: 'var(--text-main)' }}>
          {t.mud_flow_lpm !== undefined ? Math.round(t.mud_flow_lpm) : '2200'}
          <span className="gauge-unit">LPM</span>
        </div>
        <div className="gauge-status nominal">
          <CheckCircle size={13} />
          <span>Pump 1 & 2 Online</span>
        </div>
      </div>

      {/* Pit Volume Delta */}
      <div className="gauge-box">
        <span className="gauge-title">Pit Volume Delta</span>
        <div className="gauge-value" style={{ color: isPitLoss ? 'var(--alert-danger)' : 'var(--text-main)' }}>
          {t.pit_delta_m3_hr !== undefined ? `${t.pit_delta_m3_hr > 0 ? '+' : ''}${t.pit_delta_m3_hr.toFixed(1)}` : '0.0'}
          <span className="gauge-unit">m³/hr</span>
        </div>
        <div className={`gauge-status ${isPitLoss ? 'critical' : 'nominal'}`}>
          {isPitLoss ? <AlertTriangle size={13} /> : <CheckCircle size={13} />}
          <span>{isPitLoss ? 'FLUID LOSS DETECTED' : 'Pit Balanced'}</span>
        </div>
      </div>

      {/* ECD */}
      <div className="gauge-box">
        <span className="gauge-title">Annular ECD</span>
        <div className="gauge-value" style={{ color: 'var(--active-blue)' }}>
          {t.ecd_sg !== undefined ? t.ecd_sg.toFixed(2) : '1.20'}
          <span className="gauge-unit">SG</span>
        </div>
        <div className="gauge-status nominal">
          <Zap size={13} />
          <span>Margin: 0.04 SG to Frac</span>
        </div>
      </div>
    </div>
  );
}
