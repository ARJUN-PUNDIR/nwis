import React from 'react';
import { Layers, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StratigraphicCrossSection({ stratigraphicCorrelation }) {
  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <Layers size={19} style={{ color: 'var(--oil-amber)' }} />
          Stratigraphic TVD Alignment & Structural Dip Correlation Engine
        </div>
        <div className="panel-subtitle">
          Nahorkatiya Anticline Fault Block • Regional Dip: ~1.4° South-East
        </div>
      </div>

      <div style={{ background: 'var(--oil-amber-bg)', border: '1px solid var(--oil-amber-border)', padding: '0.95rem 1.15rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--oil-amber-text)', lineHeight: 1.55 }}>
        <strong>Why Stratigraphic TVD Normalization Wins over Simple 2D Distance:</strong>
        <br />
        Formations in Upper Assam are not flat. Due to structural dip, the high-risk <strong>Barail Sandstone Top</strong> lies at 
        <strong> 2780m</strong> in Well B-04 (West), but drops to <strong>2815m</strong> in Active Well A (+35m dip shift). 
        NWIS dynamically normalizes the 2850m mud loss in Well B to its formation-relative depth (70m below Barail top), preventing premature false alarms and accurately targeting the true fracture corridor!
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginTop: '0.5rem' }}>
        {/* Well B Column */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--alert-danger)' }}>Well B-04 (1.24 km West)</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>Up-Dip Structural Block</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Girujan Top: <strong>1160m</strong>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Tipam Top: <strong>1975m</strong>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--alert-danger-bg)', border: '1.5px solid var(--alert-danger-border)', borderRadius: '4px' }}>
              <strong style={{ color: 'var(--alert-danger-text)' }}>Barail Top: 2780m</strong>
              <div style={{ color: 'var(--alert-danger)', marginTop: '0.25rem', fontSize: '0.74rem', fontWeight: 700 }}>
                💥 2850m: Severe Mud Loss (28.5 m³/hr)
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Kopili Top: <strong>3260m</strong>
            </div>
          </div>
        </div>

        {/* Active Well A Column */}
        <div style={{ background: '#ffffff', border: '2px solid var(--active-blue)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-glow-blue)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--active-blue)' }}>★ Active Well A (NHKT-A01)</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>Current Drilling Active</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Girujan Top: <strong>1180m (+20m)</strong>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Tipam Top: <strong>2010m (+35m)</strong>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--active-blue-bg)', border: '1.5px solid var(--active-blue-border)', borderRadius: '4px' }}>
              <strong style={{ color: '#0369a1' }}>Barail Top: 2815m (+35m dip)</strong>
              <div style={{ color: 'var(--active-blue)', marginTop: '0.25rem', fontSize: '0.74rem', fontWeight: 700 }}>
                🎯 Target Hazard Corridor: 2840m - 2870m
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Kopili Prognosis: <strong>3290m (+30m)</strong>
            </div>
          </div>
        </div>

        {/* Well C Column */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: '8px', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--oil-amber)' }}>Well C-12 (2.08 km North-East)</div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 500 }}>Down-Dip Structural Block</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Girujan Top: <strong>1195m (+35m)</strong>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Tipam Top: <strong>2025m (+50m)</strong>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--oil-amber-bg)', border: '1.5px solid var(--oil-amber-border)', borderRadius: '4px' }}>
              <strong style={{ color: 'var(--oil-amber-text)' }}>Barail Top: 2825m</strong>
              <div style={{ color: 'var(--oil-amber)', marginTop: '0.25rem', fontSize: '0.74rem', fontWeight: 700 }}>
                ⚠️ 2910m: Differential Stuck Pipe (24h NPT)
              </div>
            </div>
            <div style={{ padding: '0.5rem', background: 'var(--bg-subtle)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
              Kopili Top: <strong>3310m</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
