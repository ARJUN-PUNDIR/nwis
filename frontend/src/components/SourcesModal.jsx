import React, { useState } from 'react';
import { BookOpen, Search, FileText, Activity, Shield, ExternalLink, CheckCircle2, Database, Layers } from 'lucide-react';

export default function SourcesModal({ isOpen = true, onClose, onSelectSource }) {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const sourcesList = [
    {
      id: "SRC-01",
      category: "realtime",
      title: "OIL eRTMAC Real-Time Telemetry Stream",
      authority: "Oil India Limited • Digital Services Division, Duliajan",
      type: "Live WITSML / JSON Sensor Feed",
      badge: "Real-Time 24/7",
      badgeColor: "green",
      description: "Direct real-time monitoring and analytics system streaming active rig surface sensors (ROP, Hook Load, Standpipe Pressure, Active Pit Volume, Mud Weight In/Out, ECD).",
      coverage: "Rig-14 (Nahorkatiya South A-01)",
      doc_id: "DOC-ERTMAC"
    },
    {
      id: "SRC-02",
      category: "wcr",
      title: "WCR_NHKT_B04_2021.pdf (Well Completion Report)",
      authority: "Oil India Limited • Central Drilling Archives",
      type: "Statutory Completion Report (84 Pages)",
      badge: "Verified Archive",
      badgeColor: "blue",
      description: "Comprehensive well completion log documenting severe lost circulation (28.5 m³/hr) at 2850m MD in Barail Sand, fracture gradient calibration (1.22 SG), and 40 bbl LCM pill remediation.",
      coverage: "Nahorkatiya Sector B (Offset 1.24 km West)",
      doc_id: "DOC-WCR-B04"
    },
    {
      id: "SRC-03",
      category: "ddr",
      title: "DDR_NHKT_C12_2022.pdf (Daily Drilling Report)",
      authority: "Oil India Limited • Operations Division",
      type: "Daily Drilling Log (Day 34-36)",
      badge: "Verified Log",
      badgeColor: "blue",
      description: "Detailed operational tour sheets recording differential stuck pipe incident at 2910m MD, 480 psi differential overbalance, 50 bbl lubricant soak, and 140 upward jars execution.",
      coverage: "Nahorkatiya North-East (Offset 2.08 km NE)",
      doc_id: "DOC-DDR-C12"
    },
    {
      id: "SRC-04",
      category: "wcr",
      title: "WCR_NHKT_D08_2020.pdf (Well Completion Report)",
      authority: "Oil India Limited • Central Drilling Archives",
      type: "Statutory Completion Report (112 Pages)",
      badge: "Verified Archive",
      badgeColor: "blue",
      description: "Official record of overpressured Kopili marine shale gas kick (+3.5 m³ pit gain, SIDPP 340 psi), Annular BOP shut-in, and Driller's Method well kill using 1.29 SG barite mud.",
      coverage: "Nahorkatiya South Sector (Offset 3.44 km South)",
      doc_id: "DOC-WCR-D08"
    },
    {
      id: "SRC-05",
      category: "wcr",
      title: "WCR_NHKT_E02_2023.pdf (Well Completion Report)",
      authority: "Oil India Limited • Central Drilling Archives",
      type: "Statutory Completion Report (76 Pages)",
      badge: "Verified Archive",
      badgeColor: "blue",
      description: "Seepage loss history (7.8 m³/hr) across Upper Barail micro-fractured sand at 2870m MD. Cured using 15 ppb Fine CaCO3 sweep and density trimming to 1.16 SG.",
      coverage: "Nahorkatiya Sector B (Offset 4.14 km NW)",
      doc_id: "DOC-WCR-E02"
    },
    {
      id: "SRC-06",
      category: "standards",
      title: "OISD-STD-174: Well Control Procedures",
      authority: "Oil Industry Safety Directorate (Govt. of India)",
      type: "Statutory Mandatory Standard",
      badge: "Govt. Standard",
      badgeColor: "amber",
      description: "Mandatory technical guidelines on BOP testing, pit level alarm sensitivities (±0.5 m³), kill mud density calculations, and trip tank monitoring procedures for high-risk zones.",
      coverage: "All Indian Upstream Petroleum Wells",
      doc_id: "DOC-OISD-174"
    },
    {
      id: "SRC-07",
      category: "standards",
      title: "DGH Upstream Well Safety Guidelines",
      authority: "Directorate General of Hydrocarbons (DGH India)",
      type: "National Regulatory Directive",
      badge: "Regulatory Mandate",
      badgeColor: "amber",
      description: "DGH regulatory framework specifying minimum intermediate casing shoe setting depths above weak depleted sands and barrier envelope validation.",
      coverage: "National Offshore & Onshore Petroleum Operations",
      doc_id: "DOC-DGH-RULES"
    },
    {
      id: "SRC-08",
      category: "geology",
      title: "Upper Assam Basin Regional Stratigraphic Atlas",
      authority: "Geological Survey of India & OIL Exploration",
      type: "Geological Memoir & Fault Database",
      badge: "Geological Baseline",
      badgeColor: "purple",
      description: "Master lithological and structural dip atlas for Alluvium, Dhekiajuli, Girujan Clay, Tipam, Barail Main Coal-Shale, and Kopili formations across Nahorkatiya and Moran fields.",
      coverage: "Upper Assam Shelf (Dibrurgarh / Tinsukia / Sivasagar)",
      doc_id: "DOC-STRAT-ATLAS"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Project Sources (8)', icon: '📚' },
    { id: 'realtime', label: 'Live eRTMAC Stream', icon: '⚡' },
    { id: 'wcr', label: 'Well Completion Reports (WCR)', icon: '📜' },
    { id: 'ddr', label: 'Daily Drilling Reports (DDR)', icon: '📋' },
    { id: 'standards', label: 'DGH / OISD Standards', icon: '🏛️' },
    { id: 'geology', label: 'Stratigraphic Atlas', icon: '🌍' }
  ];

  const filteredSources = sourcesList.filter(s => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.authority.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '880px', maxHeight: '88vh' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box">
              <Database size={20} style={{ color: 'var(--oil-amber)' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                📚 Verified Project Sources &amp; Institutional Memory Directory
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.76rem' }}>
                Oil India Limited (OIL) • Digital Real-Time &amp; Historical Engineering Archives
              </p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginTop: '0.4rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search statutory reports, eRTMAC feeds, WCR logs, or DGH guidelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.75rem 0.55rem 2.3rem',
              borderRadius: '8px',
              border: '1px solid var(--border-medium)',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                border: activeCategory === c.id ? '1px solid var(--active-blue)' : '1px solid var(--border-subtle)',
                background: activeCategory === c.id ? 'var(--active-blue)' : '#f8fafc',
                color: activeCategory === c.id ? '#ffffff' : 'var(--text-body)',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ marginRight: '4px' }}>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Sources Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', overflowY: 'auto', maxHeight: '52vh', paddingRight: '4px' }}>
          {filteredSources.map((s) => (
            <div 
              key={s.id}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 800, 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    background: s.badgeColor === 'green' ? '#ecfdf5' : s.badgeColor === 'amber' ? '#fef3c7' : '#eff6ff',
                    color: s.badgeColor === 'green' ? '#059669' : s.badgeColor === 'amber' ? '#b45309' : '#0284c7',
                    border: `1px solid ${s.badgeColor === 'green' ? '#a7f3d0' : s.badgeColor === 'amber' ? '#fde68a' : '#bfdbfe'}`
                  }}>
                    {s.badge}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                    {s.id}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 4px 0', lineHeight: '1.3' }}>
                  {s.title}
                </h4>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {s.authority}
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: '1.45', margin: 0 }}>
                  {s.description}
                </p>
              </div>

              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {s.coverage}
                </span>
                <button
                  onClick={() => {
                    if (onSelectSource) {
                      onSelectSource({
                        doc_id: s.doc_id,
                        title: s.title,
                        field: "Nahorkatiya",
                        section: s.type,
                        content_excerpt: s.description
                      });
                    }
                  }}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--active-blue)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FileText size={12} />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            All 8 data sources ground NVIDIA Nemotron-3 Ultra deterministic answers.
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
