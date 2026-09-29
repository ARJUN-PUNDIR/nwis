import React, { useState } from 'react';
import { Compass, AlertTriangle, ShieldCheck, Layers, ArrowRight, Sliders, List, Network } from 'lucide-react';

export default function InteractiveWellGraph({ graphData, onAskWell }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [viewMode, setViewMode] = useState('network'); // 'network' | 'list'
  const [simDepth, setSimDepth] = useState(2740);

  if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
    return null;
  }

  const centerNode = graphData.nodes.find(n => n.is_center) || graphData.nodes[0];
  const offsetNodes = graphData.nodes.filter(n => !n.is_center);

  // Auto-select first offset well if none selected
  const activeWell = selectedNode || offsetNodes[0];

  // Dynamic Risk Level based on Depth Slider
  const getRiskAtDepth = (depth) => {
    if (depth >= 2835 && depth <= 2865) {
      return { level: "CRITICAL", text: "Loss Corridor Active (Matches Well B-04 @ 2850m)", color: "#dc2626", bg: "#fef2f2" };
    }
    if (depth >= 2810 && depth < 2835) {
      return { level: "ADVISORY", text: "Entering Barail Sand (Prepare LCM Pill)", color: "#d97706", bg: "#fffbeb" };
    }
    return { level: "NOMINAL", text: "Stable Drilling Window", color: "#059669", bg: "#ecfdf5" };
  };

  const currentRisk = getRiskAtDepth(simDepth);

  const getNodeColor = (severity) => {
    if (severity === 'CRITICAL') return '#dc2626';
    if (severity === 'HIGH') return '#d97706';
    if (severity === 'MODERATE') return '#ea580c';
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
      border: '1.5px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)'
    }}>
      {/* Header with View Toggle & Depth Slider */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
            <Compass size={16} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>Nearby Offset Wells Map</h4>
            <p style={{ fontSize: '0.72rem', color: '#64748b' }}>Nahorkatiya South Sector • 5 km Radius</p>
          </div>
        </div>

        {/* View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '3px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setViewMode('network')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 600,
              background: viewMode === 'network' ? '#ffffff' : 'transparent',
              color: viewMode === 'network' ? '#0284c7' : '#64748b',
              boxShadow: viewMode === 'network' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Network size={12} />
            Visual Map
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '4px',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 600,
              background: viewMode === 'list' ? '#ffffff' : 'transparent',
              color: viewMode === 'list' ? '#0284c7' : '#64748b',
              boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <List size={12} />
            Proximity List
          </button>
        </div>
      </div>

      {/* Interactive Depth Look-Ahead Slider */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 1rem', marginTop: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sliders size={13} style={{ color: '#0284c7' }} />
            Simulate Drilling Depth (Look-Ahead Horizon):
          </span>
          <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
            {simDepth} m MD
          </span>
        </div>

        <input 
          type="range" 
          min="2740" 
          max="2900" 
          step="5"
          value={simDepth}
          onChange={(e) => setSimDepth(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#0284c7', cursor: 'pointer' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', fontSize: '0.72rem' }}>
          <span style={{ color: '#64748b' }}>2740m (Surface/Tipam)</span>
          <span style={{ 
            background: currentRisk.bg, 
            color: currentRisk.color, 
            padding: '0.15rem 0.55rem', 
            borderRadius: '4px', 
            fontWeight: 800,
            border: `1px solid ${currentRisk.color}`
          }}>
            {currentRisk.level}: {currentRisk.text}
          </span>
          <span style={{ color: '#64748b' }}>2900m (Barail Sand)</span>
        </div>
      </div>

      {/* VIEW MODE 1: Clean Minimalist Visual Network */}
      {viewMode === 'network' && (
        <div style={{ position: 'relative', width: '100%', height: '240px', background: '#ffffff', borderRadius: '8px', marginTop: '0.85rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 480 240">
            {/* Center Anchor: Active Well A */}
            <g transform="translate(240, 115)">
              <circle r="22" fill="rgba(2, 132, 199, 0.08)" />
              <circle r="14" fill="rgba(2, 132, 199, 0.18)" />
              <circle r="7" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <text y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill="#0f172a">
                ★ ACTIVE WELL A
              </text>
              <text y="38" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#64748b">
                {simDepth}m MD
              </text>
            </g>

            {/* Connecting Spokes and Offset Nodes */}
            {offsetNodes.map((w, idx) => {
              const pos = nodePositions[idx] || { x: 100, y: 100 };
              const isSelected = activeWell?.id === w.id;
              const nodeColor = getNodeColor(w.severity);

              return (
                <g key={w.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedNode(w)}>
                  {/* Subtle connection line */}
                  <line 
                    x1="240" 
                    y1="115" 
                    x2={pos.x} 
                    y2={pos.y} 
                    stroke={isSelected ? nodeColor : '#e2e8f0'} 
                    strokeWidth={isSelected ? '2' : '1.2'}
                    strokeDasharray={isSelected ? 'none' : '3 3'}
                  />

                  {/* Offset Node */}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={isSelected ? '12' : '8'} 
                    fill={nodeColor} 
                    stroke="#ffffff" 
                    strokeWidth="2"
                    filter={isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none'}
                  />

                  {/* Clean Pill Tag */}
                  <rect 
                    x={pos.x > 240 ? pos.x + 12 : pos.x - 78} 
                    y={pos.y - 10} 
                    width="68" 
                    height="20" 
                    rx="4" 
                    fill="#ffffff" 
                    stroke={isSelected ? nodeColor : '#cbd5e1'} 
                    strokeWidth="1"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.05))"
                  />
                  <text 
                    x={pos.x > 240 ? pos.x + 46 : pos.x - 44} 
                    y={pos.y + 3.5} 
                    textAnchor="middle" 
                    fontSize="8.5" 
                    fontWeight="700" 
                    fill={isSelected ? nodeColor : '#1e293b'}
                  >
                    {w.code} ({w.distance_km}k)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* VIEW MODE 2: Clean Proximity Cards List */}
      {viewMode === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem', marginTop: '0.85rem' }}>
          {offsetNodes.map((w) => {
            const isSelected = activeWell?.id === w.id;
            const nodeColor = getNodeColor(w.severity);
            return (
              <div 
                key={w.id}
                onClick={() => setSelectedNode(w)}
                style={{
                  background: isSelected ? '#f0f9ff' : '#ffffff',
                  border: isSelected ? `1.5px solid ${nodeColor}` : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>{w.name}</strong>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, background: nodeColor, color: '#ffffff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>
                    {w.distance_km} km
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: nodeColor, fontWeight: 700, marginTop: '0.25rem' }}>
                  {w.incident}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Well Quick Detail Box (Clean 3-Point Takeaway) */}
      {activeWell && (
        <div style={{
          marginTop: '0.85rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderLeft: `4px solid ${getNodeColor(activeWell.severity)}`,
          borderRadius: '8px',
          padding: '0.85rem 1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
              {activeWell.name} — {activeWell.distance_km} km Away ({activeWell.bearing_deg}° Bearing)
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Reference: {activeWell.doc_ref}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginTop: '0.5rem', fontSize: '0.78rem' }}>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Recorded Hazard: </span>
              <strong style={{ color: getNodeColor(activeWell.severity) }}>{activeWell.incident} @ {activeWell.incident_depth}m MD</strong>
            </div>
            <div>
              <span style={{ color: '#64748b', fontWeight: 600 }}>Casing Shoe: </span>
              <span style={{ fontFamily: 'monospace' }}>{activeWell.casing}</span>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.78rem' }}>
            <strong style={{ color: '#0284c7' }}>Proven Historical Mitigation: </strong>
            <span style={{ color: '#1e293b' }}>{activeWell.mitigation}</span>
          </div>

          {onAskWell && (
            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => onAskWell(`Analyze risks and historical incidents for ${activeWell.name} (${activeWell.code}) and how it impacts Active Well A-01.`)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #0284c7',
                  borderRadius: '5px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => { e.target.style.background = '#0284c7'; e.target.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.target.style.background = '#ffffff'; e.target.style.color = '#0284c7'; }}
              >
                <span>💬 Ask Copilot about {activeWell.code || activeWell.name}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
