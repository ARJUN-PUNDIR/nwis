import React, { useState } from 'react';
import { Database, FileText, CheckCircle, Search, Eye, BookOpen, ExternalLink } from 'lucide-react';

export default function DocuStratumRepository() {
  const [selectedDoc, setSelectedDoc] = useState(null);

  const docs = [
    {
      doc_id: "DOC-WCR-B04",
      title: "Well Completion Report - NHKT-B04",
      type: "WCR (Well Completion Report)",
      well: "Well B-04 (Offset 1.24 km)",
      year: 2021,
      pages: 84,
      ocrConfidence: "98.5%",
      entitiesExtracted: 18,
      keyEvents: "2850m Mud Loss (28.5 m³/hr), Barail Upper Sand, 40 bbl Nut Plug + Mica LCM Pill",
      excerpt: `OIL INDIA LIMITED - DRILLING SERVICES DIVISION
WELL COMPLETION REPORT: NHKT-B04 (WELL NO. 4, SECTOR B)
At depth 2850 m MD while drilling 8-1/2" hole with 1.20 SG KCl-Polymer mud, severe partial-to-total loss of circulation was encountered in upper Barail Arenaceous member. Standpipe pressure abruptly dropped by 180 psi. Active pit volume loss: 28.5 m3/hr.
Mitigation: Spotted 40 bbl heavy thixotropic LCM pill (25 ppb Coarse Nut Plug, 20 ppb Medium Flake Mica, 15 ppb CaCO3). Reduced active mud weight to 1.15 SG. Total NPT: 16.5 hrs.`
    },
    {
      doc_id: "DOC-DDR-C12",
      title: "Daily Drilling Report - NHKT-C12 (Day 34)",
      type: "DDR (Daily Drilling Report)",
      well: "Well C-12 (Offset 2.08 km)",
      year: 2022,
      pages: 4,
      ocrConfidence: "99.1%",
      entitiesExtracted: 12,
      keyEvents: "2910m Differential Sticking, 480 psi Overbalance, 50 bbl Lubricant Soak, 140 Jars",
      excerpt: `OIL INDIA LIMITED - DAILY DRILLING REPORT (DDR #34)
RIG: OIL-14 | WELL: NHKT-C12 | CURRENT DEPTH: 2910 m MD
Made connection at 2910m. Attempted to rotate and reciprocate string; string stuck tight. Identified as DIFFERENTIAL STUCK PIPE across depleted Barail permeable sand. Active mud weight 1.24 SG (overbalance = 480 psi).
Mitigation: Mixed 50 bbl pipe-freeing lubricant soak pill. Soaked for 6 hours, delivered 140 upward jars with 120,000 lbs pull. Released after 19 hours. Total NPT: 24.0 hrs.`
    },
    {
      doc_id: "DOC-WCR-D08",
      title: "Well Completion Report - NHKT-D08 (Well Control Event)",
      type: "WCR (Well Completion Report)",
      well: "Well D-08 (Offset 3.44 km)",
      year: 2020,
      pages: 96,
      ocrConfidence: "97.8%",
      entitiesExtracted: 24,
      keyEvents: "3000m Kopili Gas Kick, +3.5 m³ Pit Gain, SIDPP 340 psi, Driller's Method Kill 1.29 SG",
      excerpt: `OIL INDIA LIMITED - DULIAJAN
WELL COMPLETION REPORT: NHKT-D08 - SECTION 4: WELL CONTROL EVENT RECORD
Depth: 3000 m MD / 2930 m TVD | Formation: Kopili Shale Overpressured Transition
Abrupt drilling break recorded: ROP jumped from 5.5 to 24 m/hr. Pit gain of +3.5 m3 in 8 minutes. Gas units jumped from 15 to 340 units.
Mitigation: Hard shut-in performed via Annular BOP. SIDPP = 340 psi, SICP = 510 psi. Executed Driller's Method well kill over 2 circulations with 1.29 SG heavy barite kill mud. Total NPT: 31.0 hrs.`
    },
    {
      doc_id: "DOC-WCR-E02",
      title: "Well Completion Report - NHKT-E02",
      type: "WCR",
      well: "Well E-02 (Offset 4.14 km)",
      year: 2023,
      pages: 62,
      ocrConfidence: "98.9%",
      entitiesExtracted: 14,
      keyEvents: "2870m Seepage Mud Loss (7.8 m³/hr), 15 ppb CaCO3 Sweep, 6.5 hr NPT",
      excerpt: `OIL INDIA LIMITED - NAHORKATIYA FIELD
WELL COMPLETION REPORT: NHKT-E02
Depth: 2870 m MD | Barail Formation Seepage
Seepage loss of 7.8 m3/hr treated immediately with 15 ppb Fine Calcium Carbonate sweep into suction tank. Mud density reduced to 1.16 SG. Losses healed without major downtime. NPT: 6.5 hrs.`
    }
  ];

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <Database size={19} style={{ color: 'var(--active-blue)' }} />
          DocuStratum Document Ingestion & Institutional Memory Repository
        </div>
        <div className="panel-subtitle">Agent 1: OCR + Schema Extraction Engine • 4 Technical Reports Ingested</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 1fr' : '1fr', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {docs.map((doc) => (
            <div 
              key={doc.doc_id}
              className="panel-card"
              style={{ 
                background: selectedDoc?.doc_id === doc.doc_id ? 'var(--active-blue-bg)' : '#ffffff',
                border: selectedDoc?.doc_id === doc.doc_id ? '2px solid var(--active-blue)' : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                padding: '1.15rem'
              }}
              onClick={() => setSelectedDoc(doc)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={17} style={{ color: 'var(--active-blue)' }} />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{doc.title}</strong>
                </div>
                <span style={{ fontSize: '0.72rem', background: 'var(--alert-success-bg)', color: 'var(--alert-success-text)', border: '1px solid var(--alert-success-border)', padding: '0.2rem 0.55rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
                  OCR: {doc.ocrConfidence} (Verified)
                </span>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
                {doc.type} • {doc.well} • Year: {doc.year} • {doc.pages} Pages
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--oil-amber-text)', marginTop: '0.4rem', background: 'var(--oil-amber-bg)', padding: '0.45rem 0.75rem', borderRadius: '4px', border: '1px solid var(--oil-amber-border)' }}>
                <strong>Key Incident Extracted:</strong> {doc.keyEvents}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Document Full Detail */}
        {selectedDoc && (
          <div className="panel-card" style={{ background: '#ffffff', border: '1.5px solid var(--active-blue)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--active-blue)' }}>
                Document Viewer: {selectedDoc.doc_id}
              </strong>
              <button 
                className="btn" 
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => setSelectedDoc(null)}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
              <strong>Title:</strong> {selectedDoc.title}
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Extracted Entities:</strong> {selectedDoc.entitiesExtracted} Structured Attributes (Formation Tops, Casing Seats, ECD, Loss Rates, Jars, Mud Weights).
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                Verified OCR Text Transcript
              </span>
              <pre style={{ 
                marginTop: '0.45rem', 
                background: 'var(--bg-subtle)', 
                border: '1px solid var(--border-subtle)',
                padding: '0.95rem', 
                borderRadius: '6px', 
                fontFamily: 'monospace', 
                fontSize: '0.78rem', 
                color: 'var(--text-body)', 
                whiteSpace: 'pre-wrap', 
                lineHeight: 1.55,
                maxHeight: '340px',
                overflowY: 'auto'
              }}>
                {selectedDoc.excerpt}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
