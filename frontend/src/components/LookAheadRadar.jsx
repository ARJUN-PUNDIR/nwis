import React from 'react';
import { Radar, AlertTriangle, ArrowDownCircle, Layers } from 'lucide-react';

export default function LookAheadRadar({ telemetry, sentinel }) {
  const currentDepth = telemetry?.measured_depth_m || 2740.0;
  const minDepth = 2740.0;
  const maxDepth = 2880.0;
  const depthRange = maxDepth - minDepth;

  // Percentage position of the drill bit on track
  const bitPercent = Math.min(100, Math.max(0, ((currentDepth - minDepth) / depthRange) * 100));

  // Hazard zone: 2838m - 2865m
  const hazardTopPct = ((2838.0 - minDepth) / depthRange) * 100;
  const hazardHeightPct = ((2865.0 - 2838.0) / depthRange) * 100;

  const upcomingHazards = sentinel?.upcoming_hazards || [];

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <Radar size={19} style={{ color: 'var(--active-blue)' }} />
          Look-Ahead Virtual Radar (100m Predictive Horizon)
        </div>
        <div className="panel-subtitle">
          Scanning ahead: {currentDepth.toFixed(1)}m → {(currentDepth + 75).toFixed(1)}m MD
        </div>
      </div>

      <div className="look-ahead-container">
        {/* Vertical Depth Track */}
        <div className="depth-track-visual">
          <span>2740m</span>

          {/* Hazard Shaded Zone */}
          <div 
            className="hazard-zone-shade"
            style={{ 
              top: `${hazardTopPct}%`, 
              height: `${hazardHeightPct}%` 
            }}
            title="Historical Loss Hazard Zone (2838m - 2865m)"
          />

          {/* Current Drill Bit Position */}
          <div 
            className="bit-marker"
            style={{ top: `${bitPercent}%` }}
          />

          <span>2810m</span>
          <span style={{ color: 'var(--alert-danger)', fontWeight: 'bold' }}>2850m</span>
          <span>2880m</span>
        </div>

        {/* Hazard Callout Cards */}
        <div className="look-ahead-cards">
          {upcomingHazards.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.84rem', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '6px' }}>
              ✓ Nominal drilling interval: No historical offset drilling hazards recorded in the current 75m look-ahead window.
            </div>
          ) : (
            upcomingHazards.map((hazard, idx) => (
              <div 
                key={idx} 
                className={`hazard-callout-card ${hazard.status === 'IMMEDIATE_ZONE' ? 'critical' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                    <AlertTriangle size={15} style={{ color: hazard.status === 'IMMEDIATE_ZONE' ? 'var(--alert-danger)' : 'var(--alert-warning)' }} />
                    {hazard.incident_type} in {hazard.offset_well}
                  </strong>
                  <span style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.74rem', 
                    color: hazard.distance_ahead_m <= 15 ? 'var(--alert-danger)' : 'var(--alert-warning)',
                    fontWeight: 800
                  }}>
                    {hazard.distance_ahead_m > 0 ? `${hazard.distance_ahead_m}m Ahead` : 'CURRENT DEPTH'}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Encountered at <strong>{hazard.depth_md}m MD</strong> ({hazard.distance_km} km offset distance).
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-body)', marginTop: '0.35rem', background: 'var(--bg-subtle)', padding: '0.4rem 0.65rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--active-blue)', fontWeight: 700 }}>Historical Fix: </span>
                  {hazard.mitigation_used}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
