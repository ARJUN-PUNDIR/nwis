import React from 'react';
import { Compass, X, Sliders, Info, MessageSquare } from 'lucide-react';
import InteractiveWellGraph from './InteractiveWellGraph';

export default function WellGraphModal({ isOpen = true, onClose, graphData, onConsultWell }) {
  if (!isOpen) return null;

  // Realistic default graph data if not provided
  const defaultGraphData = graphData || {
    nodes: [
      {
        id: "current-well",
        name: "Active Well A-01 (NHKT-A01)",
        code: "NHKT-A01",
        is_center: true,
        depth_md: 2740.0,
        status: "DRILLING_ACTIVE",
        formation: "Tipam Sandstone -> Barail Transition",
        mud_sg: 1.17,
        distance_km: 0.0,
        lat: 27.2850,
        lon: 95.3210
      },
      {
        id: "NHKT-B04",
        name: "Nahorkatiya B-04 (Offset Well B)",
        code: "B-04",
        is_center: false,
        distance_km: 1.24,
        bearing_deg: 263.0,
        status: "PRODUCING",
        incident: "MUD_LOSS",
        incident_depth: 2850.0,
        severity: "CRITICAL",
        npt_hours: 16.5,
        mitigation: "Spotted 40 bbl heavy LCM pill (25 ppb Nut Plug, 20 ppb Mica, 15 ppb CaCO3). Reduced mud weight to 1.15 SG.",
        casing: "20\" @ 140m | 13-3/8\" @ 1140m | 9-5/8\" @ 2760m | 7\" @ 3350m",
        doc_ref: "WCR_NHKT_B04_2021.pdf (Page 42)",
        lat: 27.2838,
        lon: 95.3085
      },
      {
        id: "NHKT-C12",
        name: "Nahorkatiya C-12 (Offset Well C)",
        code: "C-12",
        is_center: false,
        distance_km: 2.08,
        bearing_deg: 38.0,
        status: "PRODUCING",
        incident: "STUCK_PIPE",
        incident_depth: 2910.0,
        severity: "HIGH",
        npt_hours: 24.0,
        mitigation: "Pumped 50 bbl lubricant soak pill. Jarred 140 times upward with 120,000 lbs overpull over 19 hrs.",
        casing: "20\" @ 150m | 13-3/8\" @ 1180m | 9-5/8\" @ 2810m | 7\" @ 3390m",
        doc_ref: "DDR_NHKT_C12_2022.pdf (Page 18)",
        lat: 27.2995,
        lon: 95.3340
      },
      {
        id: "NHKT-D08",
        name: "Nahorkatiya D-08 (Offset Well D)",
        code: "D-08",
        is_center: false,
        distance_km: 3.44,
        bearing_deg: 182.0,
        status: "SHUT_IN",
        incident: "WELL_KICK",
        incident_depth: 3000.0,
        severity: "CRITICAL",
        npt_hours: 31.0,
        mitigation: "Annular BOP shut-in (SIDPP 340 psi, SICP 510 psi). Killed using Driller's Method with 1.29 SG mud.",
        casing: "20\" @ 135m | 13-3/8\" @ 1120m | 9-5/8\" @ 2740m | 7\" @ 3500m",
        doc_ref: "WCR_NHKT_D08_2020.pdf (Page 88)",
        lat: 27.2540,
        lon: 95.3200
      },
      {
        id: "NHKT-E02",
        name: "Nahorkatiya E-02 (Offset Well E)",
        code: "E-02",
        is_center: false,
        distance_km: 4.14,
        bearing_deg: 312.0,
        status: "PRODUCING",
        incident: "MUD_LOSS",
        incident_depth: 2870.0,
        severity: "MODERATE",
        npt_hours: 6.5,
        mitigation: "Pumped 15 ppb Fine CaCO3 sweep directly into suction tank. Mud weight trimmed to 1.16 SG.",
        casing: "20\" @ 145m | 13-3/8\" @ 1160m | 9-5/8\" @ 2790m | 7\" @ 3300m",
        doc_ref: "WCR_NHKT_E02_2023.pdf",
        lat: 27.3120,
        lon: 95.2950
      }
    ],
    edges: []
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '860px', maxHeight: '90vh' }}>
        <div className="modal-header">
          <div className="modal-title">
            <Compass size={20} style={{ color: 'var(--alert-success)' }} />
            <span>Interactive Offset Wellbore Graph &amp; Spatial Horizon</span>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
            Visual hub-and-spoke projection centered on <strong>Active Well NHKT-A01</strong> (27.2850°N, 95.3210°E). Click nodes to inspect casing profiles or adjust depth slider.
          </p>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--alert-success)', background: '#ecfdf5', padding: '3px 8px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
            ● 5 Offset Wells Linked
          </span>
        </div>

        {/* Embedded Interactive Well Graph */}
        <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
          <InteractiveWellGraph graphData={defaultGraphData} />
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Radius: 5.0 km • Asset: Nahorkatiya South Sector B
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-secondary" onClick={onClose}>
              Close Viewer
            </button>
            <button 
              className="send-btn" 
              onClick={() => {
                if (onConsultWell) {
                  onConsultWell("What are the casing programs and loss risks across all 4 offset wells in Nahorkatiya Sector B?");
                }
                onClose();
              }}
              style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <MessageSquare size={14} />
              <span>Ask Copilot about Offset Wells</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
