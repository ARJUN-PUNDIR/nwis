import React, { useState } from 'react';
import { Compass, X, Sliders, Info, MessageSquare, Send, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import InteractiveWellGraph from './InteractiveWellGraph';

export default function WellGraphModal({ isOpen = true, onClose, graphData, onConsultWell }) {
  if (!isOpen) return null;

  const [customQuery, setCustomQuery] = useState("");

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

  const handleSendQuery = (text) => {
    const q = text || customQuery;
    if (!q.trim()) return;
    if (onConsultWell) {
      onConsultWell(q);
    }
    onClose();
  };

  const quickChips = [
    { label: "⚠️ Loss risk at 2850m", query: "What is the mud loss history at 2850m in Well B-04 and what LCM recipe was used?" },
    { label: "⚖️ Compare Casing Shoes", query: "Compare intermediate casing shoe depths across Active Well A-01, B-04, and C-12." },
    { label: "🚨 Kopili Gas Kick Pressure", query: "How was the gas kick in Well D-08 at 3000m controlled and what were the shut-in pressures?" },
    { label: "🛠️ 40 bbl LCM Recipe", query: "What is the standby 40 bbl LCM pill formulation recommended for entering Barail Sand?" }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '1040px', 
          width: '95vw', 
          maxHeight: '94vh', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '1.25rem 1.4rem'
        }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <Compass size={20} style={{ color: 'var(--alert-success)' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.08rem', margin: 0 }}>
                Interactive Offset Wellbore Graph &amp; Spatial Horizon
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.76rem' }}>
                Center: Active Well NHKT-A01 (27.2850°N, 95.3210°E) • 5 Offset Wells Linked Within 5.0 km
              </p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Scrollable Modal Body: Full visibility and smooth scrolling for well map & detailed dossier */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          paddingRight: '6px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.85rem' 
        }}>
          {/* Embedded Interactive Well Graph */}
          <InteractiveWellGraph 
            graphData={defaultGraphData} 
            onAskWell={(q) => handleSendQuery(q)}
            isModal={true}
          />

          {/* Interactive Query Input Bar (Directly inside Well Graph Modal!) */}
          <div style={{ 
            background: '#f8fafc', 
            padding: '12px 14px', 
            borderRadius: '8px', 
            border: '1.5px solid var(--border-medium)',
            marginTop: '0.5rem'
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} style={{ color: 'var(--oil-amber)' }} />
              <span>Ask NWIS AI Copilot about this Wellbore Network:</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Type any query or click a quick prompt chip
            </span>
          </div>

          {/* Quick Prompt Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '6px' }}>
            {quickChips.map((c, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(c.query)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '9999px',
                  padding: '3px 9px',
                  fontSize: '0.73rem',
                  fontWeight: 600,
                  color: 'var(--text-body)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => e.target.style.borderColor = 'var(--active-blue)'}
                onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-medium)'}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Custom Query Input Box */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text"
              placeholder="Write your custom query here (e.g., What are the loss risks at 2850m? Compare casing shoes)..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendQuery();
                }
              }}
              style={{
                flex: 1,
                padding: '0.5rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                fontSize: '0.84rem',
                outline: 'none',
                background: '#ffffff'
              }}
            />
            <button 
              type="button"
              className="btn-primary" 
              onClick={() => handleSendQuery()}
              disabled={!customQuery.trim()}
              style={{ height: '36px', padding: '0 1.1rem' }}
            >
              <span>Ask Copilot</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Radius: 5.0 km • Asset: Nahorkatiya South Sector B (OIL Rig-14)
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Close Graph
          </button>
        </div>
      </div>
    </div>
  );
}
