import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Sliders, 
  List, 
  Network, 
  FileText, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';

export default function InteractiveWellGraph({ graphData, depth, onDepthChange, onAskWell, onOpenDocument }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('network'); // 'network' | 'list'
  const [simDepth, setSimDepth] = useState(depth || 2820);

  // Sync internal state if external depth changes
  useEffect(() => {
    if (depth && depth !== simDepth) {
      setSimDepth(depth);
    }
  }, [depth]);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return null;
  }

  const centerNode = graphData.nodes.find(n => n.is_center) || graphData.nodes[0];
  const offsetNodes = graphData.nodes.filter(n => !n.is_center);

  // Auto-select first offset well if none selected
  const activeWell = selectedNode || offsetNodes[0];

  // Handle depth slider change
  const handleDepthSlider = (val) => {
    const num = Number(val);
    setSimDepth(num);
    if (onDepthChange) {
      onDepthChange(num);
    }
  };

  // Dynamic Risk Level based on Depth Slider
  const getRiskAtDepth = (d) => {
    if (d >= 2835 && d <= 2865) {
      return { 
        level: "CRITICAL RISK", 
        text: "Loss Corridor Active (Matches Well B-04 @ 2850m)", 
        color: "#dc2626", 
        bg: "#fef2f2",
        barailDist: Math.max(0, 2815 - d)
      };
    }
    if (d >= 2810 && d < 2835) {
      return { 
        level: "ADVISORY ALERT", 
        text: "Entering Barail Sand (Prepare LCM Pill on Standby)", 
        color: "#d97706", 
        bg: "#fffbeb",
        barailDist: Math.max(0, 2815 - d)
      };
    }
    if (d > 2865) {
      return { 
        level: "MODERATE RISK", 
        text: "Permeable Sandstone Fairway (Watch Differential Sticking)", 
        color: "#ea580c", 
        bg: "#fff7ed",
        barailDist: 0
      };
    }
    return { 
      level: "NOMINAL DRILLING", 
      text: "Stable Upper Hole Section (Tipam Formations)", 
      color: "#059669", 
      bg: "#ecfdf5",
      barailDist: 2815 - d
    };
  };

  const currentRisk = getRiskAtDepth(simDepth);

  const getNodeColor = (severity) => {
    if (severity === 'CRITICAL') return '#dc2626';
    if (severity === 'HIGH') return '#ea580c';
    if (severity === 'MODERATE') return '#d97706';
    return '#059669';
  };

  // Node relative positions in clean layout
  const nodePositions = [
    { id: "NHKT-B04", x: 75, y: 110, align: "left" },
    { id: "NHKT-C12", x: 380, y: 55, align: "right" },
    { id: "NHKT-D08", x: 230, y: 220, align: "center" },
    { id: "NHKT-E02", x: 85, y: 35, align: "left" },
    { id: "NHKT-F15", x: 395, y: 175, align: "right" }
  ];

  return (
    <div style={{
      marginTop: '1.25rem',
      background: '#ffffff',
      border: '1.5px solid #cbd5e1',
      borderRadius: '12px',
      padding: '1.35rem',
      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)'
    }}>
      {/* Header with View Toggle & Live Depth Horizon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Compass size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Nearby Offset Wells &amp; Incident Corridors
            </h4>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
              Nahorkatiya South Asset • 5.0 km Look-Ahead Radial Horizon • Synchronized with Response View
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '3px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
          <button
            onClick={() => setViewMode('network')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '5px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: viewMode === 'network' ? '#ffffff' : 'transparent',
              color: viewMode === 'network' ? '#0284c7' : '#64748b',
              boxShadow: viewMode === 'network' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Network size={14} />
            Visual Hub &amp; Spoke
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '5px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              background: viewMode === 'list' ? '#ffffff' : 'transparent',
              color: viewMode === 'list' ? '#0284c7' : '#64748b',
              boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <List size={14} />
            Offset Wells List ({offsetNodes.length})
          </button>
        </div>
      </div>

      {/* Real-Time Interactive Depth Pointer / Look-Ahead Horizon Slider */}
      <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '9px', padding: '0.85rem 1.15rem', marginTop: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sliders size={16} style={{ color: '#0284c7' }} />
            Dynamic Drilling Depth Pointer (Updates Answer &amp; Map in Real-Time):
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.98rem', fontFamily: 'monospace', fontWeight: 900, color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px', border: '1px solid #bae6fd' }}>
              {simDepth} m MD
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              (TVD: {simDepth - 35}m)
            </span>
          </div>
        </div>

        <input 
          type="range" 
          min="2740" 
          max="2920" 
          step="5"
          value={simDepth}
          onChange={(e) => handleDepthSlider(e.target.value)}
          style={{ width: '100%', height: '8px', accentColor: '#0284c7', cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.45rem', fontSize: '0.76rem' }}>
          <span style={{ color: '#64748b', fontWeight: 600 }}>2740m (Surface Section)</span>
          <div style={{ 
            background: currentRisk.bg, 
            color: currentRisk.color, 
            padding: '0.25rem 0.75rem', 
            borderRadius: '5px', 
            fontWeight: 800,
            fontSize: '0.78rem',
            border: `1.5px solid ${currentRisk.color}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            <Activity size={13} />
            <span>{currentRisk.level}: {currentRisk.text}</span>
          </div>
          <span style={{ color: '#64748b', fontWeight: 600 }}>2920m (Barail Fairway)</span>
        </div>
      </div>

      {/* VIEW MODE 1: Clean Minimalist Visual Network */}
      {viewMode === 'network' && (
        <div style={{ position: 'relative', width: '100%', height: '260px', background: '#ffffff', borderRadius: '10px', marginTop: '0.9rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 480 260">
            {/* Range Rings (1km, 3km, 5km) */}
            <circle cx="240" cy="125" r="55" fill="none" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="240" cy="125" r="105" fill="none" stroke="#f1f5f9" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="240" y="75" textAnchor="middle" fontSize="7" fill="#94a3b8">1.5 km</text>
            <text x="240" y="25" textAnchor="middle" fontSize="7" fill="#94a3b8">3.5 km</text>

            {/* Center Anchor: Active Well A */}
            <g transform="translate(240, 125)">
              <circle r="26" fill="rgba(2, 132, 199, 0.08)" />
              <circle r="16" fill="rgba(2, 132, 199, 0.18)" />
              <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              <text y="32" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
                ★ ACTIVE WELL A-01
              </text>
              <text y="43" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="700" fill="#0284c7">
                {simDepth}m MD
              </text>
            </g>

            {/* Connecting Spokes and Offset Nodes */}
            {offsetNodes.map((w, idx) => {
              const pos = nodePositions[idx] || { x: 100, y: 100 };
              const isSelected = activeWell?.id === w.id;
              const nodeColor = getNodeColor(w.severity);
              const depthDelta = w.incident_depth ? (w.incident_depth - simDepth) : null;
              const isNearHazard = depthDelta !== null && Math.abs(depthDelta) <= 25;

              return (
                <g key={w.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedNode(w)}>
                  {/* Subtle connection line */}
                  <line 
                    x1="240" 
                    y1="125" 
                    x2={pos.x} 
                    y2={pos.y} 
                    stroke={isSelected ? nodeColor : (isNearHazard ? '#ef4444' : '#cbd5e1')} 
                    strokeWidth={isSelected ? '2.5' : (isNearHazard ? '2' : '1.2')}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                  />

                  {/* Offset Node circle */}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={isSelected ? '14' : (isNearHazard ? '11' : '9')} 
                    fill={nodeColor} 
                    stroke="#ffffff" 
                    strokeWidth="2.5"
                    filter={isSelected ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.2))' : 'none'}
                  />

                  {/* Clean Pill Tag with Real-Time Proximity */}
                  <rect 
                    x={pos.x > 240 ? pos.x + 14 : pos.x - 90} 
                    y={pos.y - 12} 
                    width="82" 
                    height="24" 
                    rx="5" 
                    fill="#ffffff" 
                    stroke={isSelected ? nodeColor : '#94a3b8'} 
                    strokeWidth={isSelected ? '2' : '1'}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
                  />
                  <text 
                    x={pos.x > 240 ? pos.x + 55 : pos.x - 49} 
                    y={pos.y + 1} 
                    textAnchor="middle" 
                    fontSize="9.5" 
                    fontWeight="800" 
                    fill={isSelected ? nodeColor : '#0f172a'}
                  >
                    {w.code || w.id}
                  </text>
                  <text 
                    x={pos.x > 240 ? pos.x + 55 : pos.x - 49} 
                    y={pos.y + 9} 
                    textAnchor="middle" 
                    fontSize="7" 
                    fontWeight="700" 
                    fill={depthDelta !== null && depthDelta <= 0 ? '#dc2626' : '#64748b'}
                  >
                    {w.distance_km}k • {depthDelta !== null ? `${depthDelta > 0 ? '+' + depthDelta + 'm' : depthDelta + 'm'}` : 'Nominal'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* VIEW MODE 2: Clean Proximity Cards List */}
      {viewMode === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.9rem' }}>
          {offsetNodes.map((w) => {
            const isSelected = activeWell?.id === w.id;
            const nodeColor = getNodeColor(w.severity);
            const depthDelta = w.incident_depth ? (w.incident_depth - simDepth) : null;
            return (
              <div 
                key={w.id}
                onClick={() => setSelectedNode(w)}
                style={{
                  background: isSelected ? '#f0f9ff' : '#ffffff',
                  border: isSelected ? `2px solid ${nodeColor}` : '1.5px solid #e2e8f0',
                  borderRadius: '9px',
                  padding: '0.85rem 1rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 3px 8px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{w.name}</strong>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: nodeColor, color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    {w.distance_km} km
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: nodeColor, fontWeight: 800, marginTop: '0.35rem' }}>
                  {w.incident} @ {w.incident_depth}m
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Horizon Delta: <strong>{depthDelta !== null ? (depthDelta > 0 ? `${depthDelta}m ahead` : `${Math.abs(depthDelta)}m passed`) : 'N/A'}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED OFFSET WELL: EXPANDED, HIGH-READABILITY COMPREHENSIVE DOSSIER */}
      {activeWell && (
        <div style={{
          marginTop: '1.1rem',
          background: '#f8fafc',
          border: '1.5px solid #cbd5e1',
          borderLeft: `6px solid ${getNodeColor(activeWell.severity)}`,
          borderRadius: '10px',
          padding: '1.25rem 1.4rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Header Row: Well Title, Distance, Bearing, Severity Badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.65rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  {activeWell.name} ({activeWell.code || activeWell.id})
                </h3>
                <span style={{ 
                  fontSize: '0.76rem', 
                  fontWeight: 900, 
                  background: getNodeColor(activeWell.severity), 
                  color: '#ffffff', 
                  padding: '3px 8px', 
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  {activeWell.severity} RISK
                </span>
              </div>
              <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '0.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span>📍 Distance: <strong>{activeWell.distance_km} km</strong></span>
                <span>🧭 Azimuth Bearing: <strong>{activeWell.bearing_deg}°</strong></span>
                <span>🌍 Coordinates: <strong>{activeWell.lat}°N, {activeWell.lon}°E</strong></span>
              </div>
            </div>

            {/* Document Citation Button */}
            {activeWell.doc_ref && (
              <button
                onClick={() => onOpenDocument && onOpenDocument({
                  doc_id: `DOC-${activeWell.code || activeWell.id}`,
                  title: activeWell.doc_ref,
                  section: `Historical Offset Log for ${activeWell.name}`,
                  excerpt: `${activeWell.incident} recorded at ${activeWell.incident_depth}m MD. Mitigation: ${activeWell.mitigation}`
                })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  cursor: 'pointer'
                }}
              >
                <FileText size={14} style={{ color: '#0284c7' }} />
                <span>Verify {activeWell.doc_ref}</span>
              </button>
            )}
          </div>

          {/* 4-Column Detailed Parameter Grid with Large Fonts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem', marginTop: '0.9rem' }}>
            {/* Box 1: Geological Formation & Horizon */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Geological Stratum at Event
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                {activeWell.formation || 'Barail Group (Upper Arenaceous Sand)'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                Event Depth: <strong style={{ color: getNodeColor(activeWell.severity) }}>{activeWell.incident_depth}m MD</strong>
              </div>
            </div>

            {/* Box 2: Recorded Hazard & Influx/Loss Metrics */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Hazard Classification &amp; Rate
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: getNodeColor(activeWell.severity) }}>
                {activeWell.incident}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                {activeWell.loss_rate ? `Loss/Influx Rate: ${activeWell.loss_rate} m³/hr` : 'Differential Sticking / Pressure Trap'}
              </div>
            </div>

            {/* Box 3: Casing Shoe & Wellbore Geometry */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Casing Shoe Architecture
              </span>
              <div style={{ fontSize: '0.92rem', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
                {activeWell.casing}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '2px' }}>
                Hole Size: <strong>8-1/2" bit section</strong>
              </div>
            </div>

            {/* Box 4: Operational NPT & Direct Cost Savings */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 0.9rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Rig Downtime &amp; Savings
              </span>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={15} />
                <span>{activeWell.npt_hours} Hours NPT Incurred</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 800, marginTop: '2px' }}>
                Preventive Value: {activeWell.cost_saved || '₹38.5 Lakhs'}
              </div>
            </div>
          </div>

          {/* Pre-Event Early Warning Signs */}
          {activeWell.pre_event_indicators && (
            <div style={{ marginTop: '0.85rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={15} />
                Early Real-Time Indicators Recorded Prior to Incident:
              </span>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.86rem', color: '#78350f', lineHeight: '1.5' }}>
                {activeWell.pre_event_indicators}
              </p>
            </div>
          )}

          {/* Detailed Step-by-Step Proven Field Mitigation */}
          <div style={{ marginTop: '0.85rem', background: '#ffffff', border: '1.5px solid #bae6fd', borderRadius: '8px', padding: '0.85rem 1.15rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              Verified Oil India Limited Field Remediation Procedure:
            </span>
            <p style={{ margin: '0.45rem 0 0 0', fontSize: '0.92rem', color: '#0f172a', lineHeight: '1.6', fontWeight: 500 }}>
              {activeWell.mitigation}
            </p>
          </div>

          {/* Lessons Learned & Safe Operating Window for Active Well A */}
          {activeWell.lessons_learned && (
            <div style={{ marginTop: '0.85rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={15} />
                Institutional Takeaway &amp; Directive for Current Depth ({simDepth}m MD):
              </span>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.88rem', color: '#064e3b', lineHeight: '1.5', fontWeight: 600 }}>
                {activeWell.lessons_learned}
              </p>
            </div>
          )}

          {/* Action Bar */}
          {onAskWell && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.65rem' }}>
              <button 
                onClick={() => onAskWell(`Explain the detailed root cause, early warning indicators, and exact remediation procedure used in ${activeWell.name} (${activeWell.code || activeWell.id}) at ${activeWell.incident_depth}m depth, and how we should safeguard Active Well A-01 right now.`)}
                style={{
                  background: '#0284c7',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.55rem 1.15rem',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>Ask Multi-Agent Engine About {activeWell.code || activeWell.name}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
