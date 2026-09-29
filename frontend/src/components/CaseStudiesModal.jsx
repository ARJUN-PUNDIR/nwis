import React, { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight, DollarSign, Clock, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function CaseStudiesModal({ isOpen = true, onClose, onSelectCase }) {
  const [selectedCaseId, setSelectedCaseId] = useState("CS-01");

  const cases = [
    {
      id: "CS-01",
      title: "Well NHKT-B04: Severe Lost Circulation Remediation",
      depth: "2850m MD",
      formation: "Barail Arenaceous Sand Member",
      hazard: "Mud Loss (28.5 m³/hr)",
      severity: "CRITICAL",
      npt: "16.5 hrs",
      cost_saved: "₹38.5 Lakhs",
      wcr_ref: "WCR_NHKT_B04_2021.pdf (Page 42-45)",
      root_cause: "Sub-normally pressured Barail sand penetrated with excessive dynamic ECD (1.20 SG vs 1.22 SG fracture gradient), causing induced hydraulic fracture.",
      mitigation_steps: [
        "Bit pulled 30m off bottom immediately upon detecting 4.2 m³ pit volume drop.",
        "Mixed and spotted 40 bbl heavy thixotropic LCM pill: 25 ppb Coarse Nut Plug, 20 ppb Medium Flake Mica, 15 ppb Safecarb 250.",
        "Soaked pill across 2850m-2820m interval for 3.0 hours without circulation.",
        "Reduced circulating mud weight from 1.20 SG to 1.15 SG; resumed slow circulation at 1200 LPM with residual seepage < 0.5 m³/hr."
      ],
      lesson_learned: "Pre-treat active mud system with 20 ppb sized CaCO3 bridging material prior to drilling Barail top at 2815m. Restrict ECD below 1.18 SG."
    },
    {
      id: "CS-02",
      title: "Well NHKT-C12: Differential Stuck Pipe Release via Lubricant Soak",
      depth: "2910m MD",
      formation: "Depleted Permeable Barail Sand",
      hazard: "Differential Sticking (85k lbs overpull)",
      severity: "HIGH",
      npt: "24.0 hrs",
      cost_saved: "₹56.0 Lakhs",
      wcr_ref: "WCR_NHKT_C12_2022.pdf (Page 67-71)",
      root_cause: "High mud weight (1.24 SG) created 480 psi differential overbalance during static pipe connection across thick permeable filter cake.",
      mitigation_steps: [
        "Displaced 50 bbl pipe-freeing lubricant soak (asphaltic blend) across stuck interval.",
        "Cocked hydraulic fishing jars with 120,000 lbs overpull.",
        "Delivered 140 upward jars while reciprocating string over 19 hours until string released.",
        "Reconditioned mud density from 1.24 SG down to 1.16 SG before resuming drilling."
      ],
      lesson_learned: "Avoid stationary pipe during connections in Barail formation. Maintain string rotation and limit overbalance pressure < 250 psi."
    },
    {
      id: "CS-03",
      title: "Well NHKT-D08: Kopili Shale Overpressured Gas Kick Control",
      depth: "3000m MD",
      formation: "Kopili Overpressured Marine Shale Transition",
      hazard: "Gas Influx / Kick (+3.5 m³ Pit Gain)",
      severity: "CRITICAL",
      npt: "31.0 hrs",
      cost_saved: "₹72.0 Lakhs",
      wcr_ref: "WCR_NHKT_D08_2020.pdf (Page 88-94)",
      root_cause: "Steep abnormal pore pressure ramp upon piercing Kopili marine shale transition zone. Gas surged into wellbore during drilling break.",
      mitigation_steps: [
        "Immediate hard shut-in executed via Annular BOP. SIDPP stabilized at 340 psi, SICP at 510 psi.",
        "Executed Driller's Method well kill over 2 complete circulations.",
        "Raised kill mud weight from 1.15 SG to 1.29 SG barite-weighted mud to balance formation pore pressure.",
        "Monitored choke pressure continuously to prevent casing shoe breakdown."
      ],
      lesson_learned: "Kopili transition depth in southern sector rises by 180m compared to north. Set intermediate casing shoe as close as possible to top of Kopili."
    }
  ];

  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleApplyToChat = (c) => {
    if (onSelectCase) {
      onSelectCase(c);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '820px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <BookOpen size={20} style={{ color: 'var(--oil-amber)' }} />
            <span>OIL Institutional Memory • Curated Historical Case Studies</span>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
          Explore authentic historical drilling incidents from the Upper Assam Basin (Nahorkatiya &amp; Moran Fields). Each case documents verified root causes, field-proven mitigations, and lessons learned.
        </p>

        {/* Case Studies Selector Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
          {cases.map((c) => (
            <div 
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                border: selectedCaseId === c.id ? '2px solid var(--oil-amber)' : '1px solid var(--border-subtle)',
                background: selectedCaseId === c.id ? 'var(--oil-amber-bg)' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--oil-amber)' }}>{c.id}</span>
                <span style={{ 
                  fontSize: '0.62rem', 
                  fontWeight: 800, 
                  padding: '1px 5px', 
                  borderRadius: '4px',
                  background: c.severity === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                  color: c.severity === 'CRITICAL' ? '#b91c1c' : '#92400e'
                }}>
                  {c.severity}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.3' }}>
                {c.hazard}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {c.depth} • {c.cost_saved}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Case Dossier */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '14px', marginTop: '0.5rem', overflowY: 'auto', maxHeight: '50vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                {currentCase.title}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Formation: {currentCase.formation} • Depth: {currentCase.depth}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--alert-success)', display: 'block' }}>
                {currentCase.cost_saved} Saved
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                NPT Incurred: {currentCase.npt}
              </span>
            </div>
          </div>

          {/* Root Cause */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Root Cause Diagnostics:
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
              {currentCase.root_cause}
            </p>
          </div>

          {/* Proven Remedial Action Steps */}
          <div style={{ marginBottom: '10px', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--active-blue)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Field-Proven Mitigation Procedure:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentCase.mitigation_steps.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--text-body)' }}>
                  <span style={{ fontWeight: 800, color: 'var(--active-blue)' }}>{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lesson Learned */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '10px 12px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              💡 Institutional Rule for Future Offset Wells:
            </span>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350f', lineHeight: '1.5' }}>
              {currentCase.lesson_learned}
            </p>
          </div>

          {/* Official Document Reference */}
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <FileText size={14} style={{ color: 'var(--oil-amber)' }} />
            <span>Verified Source: <strong>{currentCase.wcr_ref}</strong> (OIL Central Archives, Duliajan)</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button 
            className="send-btn" 
            onClick={() => handleApplyToChat(currentCase)}
            style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <ArrowRight size={15} />
            <span>Consult Copilot on this Case Study</span>
          </button>
        </div>
      </div>
    </div>
  );
}
