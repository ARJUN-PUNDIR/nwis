import React from 'react';
import { Printer, X, ShieldAlert, CheckCircle2, FileText, Compass, Droplet, AlertTriangle } from 'lucide-react';

export default function TourSheetModal({ isOpen = true, onClose, data }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '820px', 
          maxHeight: '92vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: '#ffffff'
        }}
      >
        {/* Header with Print Action */}
        <div className="modal-header" style={{ paddingBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box" style={{ background: '#fef3c7', borderColor: '#fde68a' }}>
              <FileText size={20} style={{ color: 'var(--oil-amber)' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                Rig Pre-Spud &amp; Look-Ahead Operational Tour Sheet
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.74rem' }}>
                Oil India Limited • Rig-14 • Nahorkatiya South Asset • Sector B
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button"
              className="btn-primary" 
              onClick={handlePrint}
              style={{ height: '34px', padding: '0 12px', fontSize: '0.78rem' }}
            >
              <Printer size={14} />
              <span>Print / Save PDF</span>
            </button>
            <button className="close-modal-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Printable Tour Sheet Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          border: '1.5px solid #0f172a', 
          borderRadius: '6px', 
          padding: '1.25rem',
          background: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Official Document Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.5px' }}>
                OIL INDIA LIMITED (A Govt. of India Enterprise)
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
                DRILLING SERVICES DIVISION • DAILY HAZARD PROGNOSIS
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                DOCUMENT REF: OIL/DSD/NHKT/2026/09
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Well Identification & Rig Parameters Table */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Well ID &amp; Location:</span>
              <strong style={{ color: '#0f172a' }}>NHKT-A01 (27.285°N, 95.321°E)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Current Depth:</span>
              <strong style={{ color: '#0284c7' }}>2820.0 m MD (2785.0m TVD)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Active Mud Weight:</span>
              <strong style={{ color: '#059669' }}>1.16 SG (ECD max: 1.18 SG)</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Casing Shoe:</span>
              <strong style={{ color: '#0f172a' }}>9-5/8" @ 2750.0 m MD</strong>
            </div>
          </div>

          {/* Section 1: Look-Ahead Geological Horizon */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
              1. Stratigraphic Correlation &amp; Target Horizon (Next 100m)
            </h4>
            <div style={{ fontSize: '0.78rem', color: '#1e293b', lineHeight: '1.45' }}>
              Bit is currently penetrating base Tipam Sandstone and entering <strong>Barail Arenaceous Sand Member</strong> at <strong>2815m MD</strong> (+35m structural up-dip towards North-East relative to Offset Well B-04). Lithology consists of high-permeability porous sands alternating with carbonaceous shales.
            </div>
          </div>

          {/* Section 2: Critical Offset Hazard Precedents */}
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px' }}>
              2. Offset Wells Hazard Corridor &amp; Early Indicators
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', marginBottom: '0.5rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1.5px solid #cbd5e1' }}>
                  <th style={{ padding: '4px 6px' }}>Offset Well</th>
                  <th style={{ padding: '4px 6px' }}>Distance / Azimuth</th>
                  <th style={{ padding: '4px 6px' }}>Depth Interval</th>
                  <th style={{ padding: '4px 6px' }}>Hazard Encountered</th>
                  <th style={{ padding: '4px 6px' }}>Impact / Remediation</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '4px 6px', fontWeight: 700 }}>Well NHKT-B04</td>
                  <td style={{ padding: '4px 6px' }}>1.24 km West (263°)</td>
                  <td style={{ padding: '4px 6px' }}>2850m MD</td>
                  <td style={{ padding: '4px 6px', color: '#dc2626', fontWeight: 700 }}>Severe Mud Loss (28.5 m³/hr)</td>
                  <td style={{ padding: '4px 6px' }}>Spotted 40 bbl Nut Plug + Mica pill; 16.5h NPT</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '4px 6px', fontWeight: 700 }}>Well NHKT-C12</td>
                  <td style={{ padding: '4px 6px' }}>2.08 km NE (038°)</td>
                  <td style={{ padding: '4px 6px' }}>2910m MD</td>
                  <td style={{ padding: '4px 6px', color: '#d97706', fontWeight: 700 }}>Differential Sticking</td>
                  <td style={{ padding: '4px 6px' }}>50 bbl lubricant soak + 140 jars; 24h NPT</td>
                </tr>
                <tr>
                  <td style={{ padding: '4px 6px', fontWeight: 700 }}>Well NHKT-D08</td>
                  <td style={{ padding: '4px 6px' }}>3.44 km South (182°)</td>
                  <td style={{ padding: '4px 6px' }}>3000m MD</td>
                  <td style={{ padding: '4px 6px', color: '#dc2626', fontWeight: 700 }}>Kopili Gas Kick (SIDPP 340 psi)</td>
                  <td style={{ padding: '4px 6px' }}>Driller's Method kill with 1.29 SG mud; 31h NPT</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Actionable Rig Floor Directives */}
          <div style={{ marginBottom: '1rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '4px', padding: '0.65rem 0.85rem' }}>
            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.82rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
              3. Mandatory Rig Floor Operational Directives
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.76rem', color: '#78350f' }}>
              <div>
                <strong>A. Mud Weight Window:</strong> Maintain active density strictly between 1.15 - 1.17 SG. Cap flow rate at 1250 LPM to prevent exceeding 1.18 SG ECD.
              </div>
              <div>
                <strong>B. Standby LCM Pill:</strong> Pre-mix 40 bbl heavy thixotropic pill in slug pit (25 ppb Nut Plug, 20 ppb Mica, 15 ppb CaCO3).
              </div>
              <div>
                <strong>C. Differential Sticking Control:</strong> Rotate and reciprocate drill string continuously during all connections.
              </div>
              <div>
                <strong>D. Pit Volume Alarms:</strong> Set mud logger active pit alarm thresholds at +/- 0.5 m³ deviation.
              </div>
            </div>
          </div>

          {/* Section 4: Operational Sign-Off */}
          <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1.5px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              4. Verification Sign-Off &amp; Toolbox Meeting Endorsement:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center', fontSize: '0.74rem' }}>
              <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px' }}>
                <strong>Drilling Superintendent</strong>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Oil India Limited</div>
              </div>
              <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px' }}>
                <strong>Rig Toolpusher</strong>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>OIL Rig-14 Crew A</div>
              </div>
              <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px' }}>
                <strong>Lead Mud Engineer</strong>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Fluids Engineering Dept</div>
              </div>
              <div style={{ borderTop: '1px solid #0f172a', paddingTop: '4px' }}>
                <strong>Wellsite Geologist</strong>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Subsurface Asset Group</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-actions" style={{ marginTop: '0.65rem', paddingTop: '0.5rem' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button type="button" className="btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print Tour Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
}
