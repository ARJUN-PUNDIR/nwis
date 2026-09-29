import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Eye, 
  AlertTriangle, 
  Layers, 
  Info, 
  ArrowRight, 
  RotateCcw, 
  Maximize2, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Table,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function GeospatialMap({ nearbyWells, radius, onRadiusChange }) {
  const [selectedWell, setSelectedWell] = useState(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview'); // 'overview' | 'compare' | 'incidents' | 'documents'
  const [isZoomed, setIsZoomed] = useState(false);

  // Canvas center
  const centerX = 360;
  const centerY = 240;
  const scale = 20; // 1 km = 20px

  const activeWellData = {
    well_id: "NHKT-A01",
    name: "Active Well A (NHKT-A01)",
    field: "Nahorkatiya South",
    rig: "OIL CyberRig-14",
    current_depth: "2740.0 m MD",
    tvd: "2690.0 m TVD",
    formation: "Tipam Sandstone (entering Barail)",
    mud_density: "1.17 SG",
    casing: "20\" @ 145m | 13-3/8\" @ 1150m | 9-5/8\" @ 2750m | 7\" Liner (Planned)",
    status: "Drilling Active"
  };

  const allWells = [
    {
      well_id: "NHKT-B04",
      name: "Well B-04 (Sector B)",
      distance_km: 1.24,
      bearing_deg: 263.0,
      direction: "West",
      incident: "Severe Mud Loss @ 2850m (28.5 m³/hr)",
      severity: "CRITICAL",
      color: "#dc2626", // Red
      bgColor: "#fef2f2",
      casing: "20\" @ 140m | 13-3/8\" @ 1140m | 9-5/8\" @ 2760m | 7\" @ 3350m",
      td: "3380 m MD / 3260 m TVD",
      spud_date: "12-Apr-2021",
      comp_date: "18-Jun-2021",
      mud_density: "1.20 → 1.15 SG",
      npt: "16.5 hrs",
      cost_lost: "₹38.5 Lakhs",
      status: "Oil Producer (Barail Sand)",
      root_cause: "High ECD exceeding low fracture gradient (1.22 SG eq) in micro-fractured Barail Sand.",
      mitigation_formula: "Mixed & spotted 40 bbl heavy thixotropic LCM pill: 25 ppb Coarse Nut Plug + 20 ppb Medium Flake Mica + 15 ppb CaCO3. Trimmed mud weight to 1.15 SG.",
      doc_ref: "WCR_NHKT_B04_2021.pdf (Page 42-45)",
      ocr_conf: "98.5%"
    },
    {
      well_id: "NHKT-C12",
      name: "Well C-12 (Sector C)",
      distance_km: 2.08,
      bearing_deg: 38.0,
      direction: "North-East",
      incident: "Differential Stuck Pipe @ 2910m (24 hr NPT)",
      severity: "HIGH",
      color: "#d97706", // Amber
      bgColor: "#fffbeb",
      casing: "20\" @ 150m | 13-3/8\" @ 1180m | 9-5/8\" @ 2810m | 7\" @ 3390m",
      td: "3410 m MD / 3295 m TVD",
      spud_date: "15-Jan-2022",
      comp_date: "29-Mar-2022",
      mud_density: "1.24 → 1.16 SG",
      npt: "24.0 hrs",
      cost_lost: "₹56.0 Lakhs",
      status: "Oil Producer",
      root_cause: "Excessive mud overbalance (480 psi) across depleted permeable sand during static pipe connection.",
      mitigation_formula: "Spotted 50 bbl pipe-freeing lubricant soak. Delivered 140 upward jars with 120,000 lbs pull over 19 hours until freed.",
      doc_ref: "DDR_NHKT_C12_Day34.pdf (Page 2)",
      ocr_conf: "99.1%"
    },
    {
      well_id: "NHKT-D08",
      name: "Well D-08 (Sector D)",
      distance_km: 3.44,
      bearing_deg: 182.0,
      direction: "South",
      incident: "Well Kick / Gas Influx @ 3000m (31 hr NPT)",
      severity: "CRITICAL",
      color: "#7c3aed", // Purple
      bgColor: "#f5f3ff",
      casing: "20\" @ 135m | 13-3/8\" @ 1120m | 9-5/8\" @ 2740m | 7\" @ 3500m",
      td: "3550 m MD / 3420 m TVD",
      spud_date: "10-Aug-2020",
      comp_date: "04-Nov-2020",
      mud_density: "1.15 → 1.29 SG (Kill Mud)",
      npt: "31.0 hrs",
      cost_lost: "₹72.0 Lakhs",
      status: "Shut-in (Observation)",
      root_cause: "Abnormal overpressure ramp in Kopili marine shale transition entered at 2980m.",
      mitigation_formula: "Annular BOP shut-in (SIDPP: 340 psi, SICP: 510 psi). Killed well using Driller's Method over 2 full circulations with 1.29 SG barite mud.",
      doc_ref: "WCR_NHKT_D08_2020.pdf (Page 88-94)",
      ocr_conf: "97.8%"
    },
    {
      well_id: "NHKT-E02",
      name: "Well E-02 (Sector A)",
      distance_km: 4.14,
      bearing_deg: 312.0,
      direction: "North-West",
      incident: "Seepage Mud Loss @ 2870m (6.5 hr NPT)",
      severity: "MODERATE",
      color: "#ea580c", // Orange
      bgColor: "#fff7ed",
      casing: "20\" @ 145m | 13-3/8\" @ 1160m | 9-5/8\" @ 2790m | 7\" @ 3300m",
      td: "3320 m MD",
      spud_date: "01-Mar-2023",
      comp_date: "10-May-2023",
      mud_density: "1.16 SG",
      npt: "6.5 hrs",
      cost_lost: "₹15.2 Lakhs",
      status: "Oil Producer",
      root_cause: "Micro-fracture seepage in upper Barail sand bed.",
      mitigation_formula: "15 ppb Fine CaCO3 sweep pumped into suction tank. Mud weight reduced to 1.16 SG.",
      doc_ref: "WCR_NHKT_E02_2023.pdf (Page 29)",
      ocr_conf: "98.9%"
    },
    {
      well_id: "NHKT-F15",
      name: "Well F-15 (Sector E)",
      distance_km: 6.82,
      bearing_deg: 87.0,
      direction: "East",
      incident: "Poor Cement Bond @ 2810m Casing Shoe",
      severity: "MODERATE",
      color: "#2563eb", // Blue
      bgColor: "#eff6ff",
      casing: "20\" @ 150m | 13-3/8\" @ 1170m | 9-5/8\" @ 2810m | 7\" @ 3450m",
      td: "3480 m MD",
      spud_date: "05-Nov-2019",
      comp_date: "20-Jan-2020",
      mud_density: "1.14 SG",
      npt: "18.0 hrs",
      cost_lost: "₹42.0 Lakhs",
      status: "Oil Producer",
      root_cause: "Lost circulation during cement displacement across weak zone.",
      mitigation_formula: "Perforated casing and conducted block squeeze cementing with micro-fine cement slurry.",
      doc_ref: "WCR_NHKT_F15_2019.pdf (Page 55)",
      ocr_conf: "98.2%"
    }
  ];

  // Calculate pixel positions from distance and bearing
  const getWellPosition = (distKm, bearingDeg) => {
    const angleRad = (bearingDeg - 90) * (Math.PI / 180);
    const x = centerX + distKm * scale * Math.cos(angleRad);
    const y = centerY + distKm * scale * Math.sin(angleRad);
    return { x, y };
  };

  const handleSelectWell = (well) => {
    setSelectedWell(well);
    setIsZoomed(true);
    setActiveDrawerTab('overview');
  };

  const handleResetZoom = () => {
    setSelectedWell(null);
    setIsZoomed(false);
  };

  // Determine SVG viewBox for smooth zooming
  let viewBox = "0 0 720 480";
  if (isZoomed && selectedWell) {
    const targetPos = getWellPosition(selectedWell.distance_km, selectedWell.bearing_deg);
    // Focus midpoint between Center Active Well and Selected Well
    const midX = (centerX + targetPos.x) / 2;
    const midY = (centerY + targetPos.y) / 2;
    const zoomWidth = 420;
    const zoomHeight = 280;
    viewBox = `${midX - zoomWidth / 2} ${midY - zoomHeight / 2} ${zoomWidth} ${zoomHeight}`;
  }

  return (
    <div className="panel-card" style={{ gap: '1rem' }}>
      {/* Header bar */}
      <div className="panel-header">
        <div className="panel-title">
          <Compass size={20} style={{ color: 'var(--active-blue)' }} />
          Connected-Edge Hub-and-Spoke Intelligence Map
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {isZoomed && (
            <button className="btn" onClick={handleResetZoom}>
              <RotateCcw size={14} />
              Reset Zoom (Show All Wells)
            </button>
          )}

          <div className="radius-filter-group">
            <Compass size={14} style={{ color: 'var(--active-blue)' }} />
            <span>Search Radius:</span>
            {[1, 3, 5, 10, 15].map((r) => (
              <button
                key={r}
                className={`radius-btn ${radius === r ? 'active' : ''}`}
                onClick={() => onRadiusChange(r)}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Hub-and-Spoke Map on Left, Action Drawer on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedWell ? '1.15fr 1fr' : '1fr', gap: '1.25rem' }}>
        
        {/* Hub-and-Spoke SVG Map Canvas */}
        <div className="hub-spoke-container">
          <div className="map-control-overlay">
            <Info size={14} style={{ color: 'var(--active-blue)' }} />
            <span>Click any offset well to zoom & open side-by-side comparison suite</span>
          </div>

          <svg 
            className="hub-spoke-svg" 
            viewBox={viewBox} 
            style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {/* Soft Grid Lines */}
            <line x1="20" y1={centerY} x2="700" y2={centerY} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
            <line x1={centerX} y1="20" x2={centerX} y2="460" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />

            {/* Concentric Range Rings */}
            {[1, 2, 5, 10].map((r) => {
              const ringRadius = r * scale;
              const isSelectedRadius = r === radius;
              return (
                <g key={r}>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={ringRadius}
                    fill={isSelectedRadius ? 'rgba(2, 132, 199, 0.03)' : 'none'}
                    stroke={isSelectedRadius ? '#0284c7' : '#cbd5e1'}
                    strokeWidth={isSelectedRadius ? '1.5' : '1'}
                    strokeDasharray={isSelectedRadius ? 'none' : '3 3'}
                  />
                  <text
                    x={centerX + 6}
                    y={centerY - ringRadius + 14}
                    fill={isSelectedRadius ? '#0284c7' : '#94a3b8'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {r} km
                  </text>
                </g>
              );
            })}

            {/* Connected Edges (Spokes from Center Well A to Offset Wells) */}
            {allWells.map((well) => {
              const pos = getWellPosition(well.distance_km, well.bearing_deg);
              const isSelected = selectedWell?.well_id === well.well_id;
              const isInRadius = well.distance_km <= radius;

              // Midpoint for distance tag
              const midX = (centerX + pos.x) / 2;
              const midY = (centerY + pos.y) / 2;

              return (
                <g 
                  key={`edge-${well.well_id}`}
                  style={{ cursor: 'pointer', opacity: isInRadius ? 1 : 0.25 }}
                  onClick={() => handleSelectWell(well)}
                >
                  {/* Spoke Line */}
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={pos.x}
                    y2={pos.y}
                    stroke={isSelected ? well.color : '#94a3b8'}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                  />

                  {/* Flow animation pulse on selected edge */}
                  {isSelected && (
                    <circle r="4" fill={well.color}>
                      <animateMotion
                        path={`M ${centerX} ${centerY} L ${pos.x} ${pos.y}`}
                        dur="1.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Distance Badge on Edge */}
                  <rect
                    x={midX - 22}
                    y={midY - 9}
                    width="44"
                    height="18"
                    rx="4"
                    fill="#ffffff"
                    stroke={isSelected ? well.color : '#cbd5e1'}
                    strokeWidth="1"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                  />
                  <text
                    x={midX}
                    y={midY + 3.5}
                    textAnchor="middle"
                    fill={isSelected ? well.color : '#475569'}
                    fontSize="9.5"
                    fontFamily="monospace"
                    fontWeight="700"
                  >
                    {well.distance_km}km
                  </text>
                </g>
              );
            })}

            {/* Center Anchor: ACTIVE WELL A */}
            <g>
              <circle cx={centerX} cy={centerY} r="26" fill="rgba(2, 132, 199, 0.12)" />
              <circle cx={centerX} cy={centerY} r="16" fill="rgba(2, 132, 199, 0.2)" />
              <circle cx={centerX} cy={centerY} r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              
              <text 
                x={centerX} 
                y={centerY + 24} 
                textAnchor="middle" 
                fill="#0f172a" 
                fontSize="11" 
                fontWeight="800" 
                fontFamily="sans-serif"
              >
                ★ ACTIVE WELL A
              </text>
              <text 
                x={centerX} 
                y={centerY + 36} 
                textAnchor="middle" 
                fill="#64748b" 
                fontSize="9" 
                fontFamily="monospace"
              >
                NHKT-A01 (2740m)
              </text>
            </g>

            {/* Offset Well Nodes */}
            {allWells.map((well) => {
              const pos = getWellPosition(well.distance_km, well.bearing_deg);
              const isSelected = selectedWell?.well_id === well.well_id;
              const isInRadius = well.distance_km <= radius;

              return (
                <g 
                  key={`node-${well.well_id}`}
                  style={{ cursor: 'pointer', opacity: isInRadius ? 1 : 0.3 }}
                  onClick={() => handleSelectWell(well)}
                >
                  {/* Outer halo */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? '18' : '12'}
                    fill={well.bgColor}
                    stroke={well.color}
                    strokeWidth={isSelected ? '2' : '1'}
                  />

                  {/* Core Node */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? '9' : '6.5'}
                    fill={well.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />

                  {/* Well Label */}
                  <rect
                    x={pos.x + 12}
                    y={pos.y - 12}
                    width={well.name.length * 6.5 + 16}
                    height="20"
                    rx="4"
                    fill="#ffffff"
                    stroke={isSelected ? well.color : '#e2e8f0'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                  />
                  <text
                    x={pos.x + 20}
                    y={pos.y + 1.5}
                    fill={isSelected ? well.color : '#1e293b'}
                    fontSize="10"
                    fontWeight={isSelected ? '800' : '600'}
                    fontFamily="sans-serif"
                  >
                    {well.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Action & Comparison Suite Drawer (Light Theme) */}
        {selectedWell ? (
          <div className="offset-action-drawer">
            {/* Drawer Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {selectedWell.name}
                  </h3>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 800, 
                    background: selectedWell.color, 
                    color: '#ffffff', 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '4px' 
                  }}>
                    {selectedWell.severity}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Connected Edge Distance: <strong>{selectedWell.distance_km} km</strong> ({selectedWell.direction} • {selectedWell.bearing_deg}°)
                </p>
              </div>

              <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={handleResetZoom}>
                ✕ Close
              </button>
            </div>

            {/* Action Tabs Row */}
            <div className="drawer-tab-row">
              <button 
                className={`drawer-tab-btn ${activeDrawerTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('overview')}
              >
                <Info size={13} />
                Dossier
              </button>

              <button 
                className={`drawer-tab-btn ${activeDrawerTab === 'compare' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('compare')}
              >
                <Scale size={13} />
                Compare vs Active Well
              </button>

              <button 
                className={`drawer-tab-btn ${activeDrawerTab === 'incidents' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('incidents')}
              >
                <AlertTriangle size={13} />
                Incidents & Solutions
              </button>

              <button 
                className={`drawer-tab-btn ${activeDrawerTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveDrawerTab('documents')}
              >
                <FileText size={13} />
                WCR/DDR Source
              </button>
            </div>

            {/* Tab 1: Overview & Technical Dossier */}
            {activeDrawerTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: '6px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>Total Depth: <strong>{selectedWell.td}</strong></div>
                    <div>Status: <strong style={{ color: 'var(--alert-success)' }}>{selectedWell.status}</strong></div>
                    <div>Spud Date: <strong>{selectedWell.spud_date}</strong></div>
                    <div>Completion: <strong>{selectedWell.comp_date}</strong></div>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                    Casing Program Architecture
                  </span>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                    {selectedWell.casing}
                  </div>
                </div>

                <div style={{ background: selectedWell.bgColor, border: `1px solid ${selectedWell.color}`, borderRadius: '6px', padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: selectedWell.color }}>
                    Historical Incident Summary
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {selectedWell.incident}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Non-Productive Time (NPT): <strong>{selectedWell.npt}</strong> • Downtime Cost: <strong>{selectedWell.cost_lost}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Compare Side-by-Side vs Active Well A */}
            {activeDrawerTab === 'compare' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Side-by-side engineering comparison between <strong>Active Well A</strong> and <strong>{selectedWell.name}</strong>:
                </span>

                <table className="petro-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th style={{ color: 'var(--active-blue)' }}>Active Well A</th>
                      <th style={{ color: selectedWell.color }}>{selectedWell.well_id}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Current Depth</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>2740.0 m MD</td>
                      <td style={{ fontFamily: 'monospace' }}>TD: {selectedWell.td}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Formation Top (Barail)</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--active-blue)', fontWeight: 700 }}>2815 m MD (+35m dip)</td>
                      <td style={{ fontFamily: 'monospace' }}>2780 m MD</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Intermediate Casing Shoe</td>
                      <td style={{ fontFamily: 'monospace' }}>9-5/8" @ 2750m</td>
                      <td style={{ fontFamily: 'monospace' }}>9-5/8" @ {selectedWell.well_id === 'NHKT-B04' ? '2760m' : '2810m'}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Mud Density across Sand</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--alert-success)', fontWeight: 700 }}>1.17 SG</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--alert-danger)', fontWeight: 700 }}>{selectedWell.mud_density}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Historical NPT Incurred</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--alert-success)' }}>0.0 hrs</td>
                      <td style={{ fontFamily: 'monospace', color: 'var(--alert-danger)', fontWeight: 700 }}>{selectedWell.npt}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ background: 'var(--active-blue-bg)', border: '1px solid var(--active-blue-border)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem', color: '#0369a1' }}>
                  <strong>Crucial Difference Identified:</strong> In {selectedWell.well_id}, mud density exceeded the safe fracture window, triggering downtime. In Active Well A, maintaining mud weight at 1.15–1.17 SG will avoid this failure mode.
                </div>
              </div>
            )}

            {/* Tab 3: Incidents & Proven Solutions */}
            {activeDrawerTab === 'incidents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.85rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#991b1b', fontWeight: 800 }}>
                    Root Cause Analysis (From Historical Post-Mortem)
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#7f1d1d', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {selectedWell.root_cause}
                  </p>
                </div>

                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.85rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#065f46', fontWeight: 800 }}>
                    Proven Engineering Remediation (What Worked)
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#064e3b', marginTop: '0.25rem', lineHeight: 1.5 }}>
                    {selectedWell.mitigation_formula}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-subtle)', padding: '0.65rem 0.85rem', borderRadius: '6px', fontSize: '0.78rem' }}>
                  <span>Total NPT: <strong>{selectedWell.npt}</strong></span>
                  <span>Financial Rig Cost: <strong style={{ color: 'var(--alert-danger)' }}>{selectedWell.cost_lost}</strong></span>
                </div>
              </div>
            )}

            {/* Tab 4: Verified Document Proof */}
            {activeDrawerTab === 'documents' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Original Historical Document Excerpt
                  </span>
                  <span style={{ fontSize: '0.7rem', background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '0.15rem 0.45rem', borderRadius: '4px', fontFamily: 'monospace', fontWeight: 700 }}>
                    OCR: {selectedWell.ocr_conf} (Verified)
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Document Reference: <strong>{selectedWell.doc_ref}</strong>
                </div>

                <pre style={{ 
                  background: '#f8fafc', 
                  border: '1px solid var(--border-subtle)', 
                  padding: '0.85rem', 
                  borderRadius: '6px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  color: 'var(--text-body)', 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.55 
                }}>
                  {`OIL INDIA LIMITED - ARCHIVAL DRILLING SERVICES
WELL: ${selectedWell.well_id} (${selectedWell.name})
FIELD: NAHORKATIYA (SECTOR B)

EXCERPT FROM LOG RECORD:
Event: ${selectedWell.incident}
Depth: ${selectedWell.td.split('/')[0]}
Root Cause: ${selectedWell.root_cause}
Action Taken: ${selectedWell.mitigation_formula}
Downtime Incurred: ${selectedWell.npt} (${selectedWell.cost_lost})

Status: RECORD AUDITED & VERIFIED FOR NWIS INSTITUTIONAL MEMORY`}
                </pre>
              </div>
            )}

          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', justifyContent: 'center' }}>
            <div style={{ background: '#ffffff', border: '1px dashed var(--border-medium)', borderRadius: '8px', padding: '2rem 1.5rem', textAlign: 'center' }}>
              <Compass size={32} style={{ color: 'var(--active-blue)', margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                No Offset Well Selected
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '320px', margin: '0.35rem auto 0 auto' }}>
                Click on any connected offset well node (e.g. <strong>Well B-04</strong> or <strong>Well C-12</strong>) on the map to zoom in, view its technical dossier, and compare casing programs side-by-side with Active Well A.
              </p>
            </div>

            {/* Quick Well Selector Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
              {allWells.slice(0, 4).map((w) => (
                <div 
                  key={w.well_id}
                  style={{ 
                    background: '#ffffff', 
                    border: '1px solid var(--border-subtle)', 
                    borderLeft: `4px solid ${w.color}`,
                    borderRadius: '6px', 
                    padding: '0.65rem',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleSelectWell(w)}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>{w.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{w.distance_km} km • {w.direction}</div>
                  <div style={{ fontSize: '0.68rem', color: w.color, fontWeight: 700, marginTop: '0.25rem' }}>{w.severity}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
