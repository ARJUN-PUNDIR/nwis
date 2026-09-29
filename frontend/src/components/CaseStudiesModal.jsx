import React from 'react';
import { BookOpen, AlertTriangle, ArrowRight, DollarSign, Clock } from 'lucide-react';

export default function CaseStudiesModal({ isOpen, onClose, onSelectCase }) {
  if (!isOpen) return null;

  const cases = [
    {
      id: "CS-01",
      title: "Well B-04 Severe Lost Circulation",
      depth: "2850m MD",
      formation: "Barail Arenaceous Sand Member",
      hazard: "Mud Loss (28.5 m³/hr)",
      npt: "16.5 hrs",
      cost: "₹38.5 Lakhs",
      summary: "Induced hydraulic fracturing due to excessive ECD (1.20 SG). Successfully mitigated by spotting 40 bbl heavy thixotropic LCM pill (25 ppb Nut Plug + 20 ppb Mica + 15 ppb CaCO3) and capping mud weight at 1.15 SG."
    },
    {
      id: "CS-02",
      title: "Well C-12 Differential Stuck Pipe",
      depth: "2910m MD",
      formation: "Depleted Permeable Barail Sand",
      hazard: "Differential Sticking (85k lbs overpull)",
      npt: "24.0 hrs",
      cost: "₹56.0 Lakhs",
      summary: "High mud weight (1.24 SG) created 480 psi differential overbalance during static connection. Freed using 50 bbl lubricant soak and 140 upward jars with 120,000 lbs pull over 19 hours."
    },
    {
      id: "CS-03",
      title: "Well D-08 High-Pressure Gas Kick",
      depth: "3000m MD",
      formation: "Kopili Overpressured Marine Shale",
      hazard: "Gas Influx / Kick (+3.5 m³ Pit Gain)",
      npt: "31.0 hrs",
      cost: "₹72.0 Lakhs",
      summary: "Steep pore pressure transition at Kopili boundary. Annular BOP shut-in (SIDPP 340 psi, SICP 510 psi). Killed well using Driller's Method with 1.29 SG heavy barite mud."
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={20} style={{ color: 'var(--oil-amber)' }} />
            OIL Institutional Memory • Curated Case Studies
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Select a verified historical case study from the Upper Assam Basin to explore root causes, engineering mitigations, and lessons learned.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {cases.map((c) => (
            <div 
              key={c.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '1.15rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
              onClick={() => {
                onSelectCase(`Consult case study: ${c.title} (${c.depth} in ${c.formation}). Explain root causes and exact proven solutions.`);
                onClose();
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{c.title}</strong>
                <span style={{ fontSize: '0.72rem', background: 'var(--alert-danger-bg)', color: 'var(--alert-danger)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 800 }}>
                  {c.hazard}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Depth: <strong>{c.depth}</strong> • Formation: <strong>{c.formation}</strong>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', marginTop: '0.45rem', lineHeight: 1.5 }}>
                {c.summary}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                <span>NPT Incurred: <strong style={{ color: 'var(--alert-danger)' }}>{c.npt}</strong> ({c.cost})</span>
                <span style={{ color: 'var(--active-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Load into Chat <ArrowRight size={13} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
