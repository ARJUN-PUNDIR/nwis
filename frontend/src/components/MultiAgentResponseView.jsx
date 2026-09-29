import React, { useState } from 'react';
import { 
  Compass, AlertTriangle, Droplet, Shield, Clock, ChevronDown, ChevronUp,
  FileText, Copy, Check, Volume2, Printer, Layers, Activity, Sparkles, ExternalLink
} from 'lucide-react';
import InteractiveWellGraph from './InteractiveWellGraph';

export default function MultiAgentResponseView({ data, onOpenDocument }) {
  const [activeTab, setActiveTab] = useState('verdict');
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Destructure multi-agent data
  const {
    direct_verdict = [],
    agent_pills = [],
    agents_data = {},
    collision_matrix = [],
    execution_trace = [],
    citations = [],
    well_graph = null,
    answer = ""
  } = data || {};

  const { geostratum, lithoguard, mudsmith, casingpro, nptsentry } = agents_data || {};

  // Copy Executive Verdict to clipboard
  const handleCopyVerdict = () => {
    const text = direct_verdict.join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Text-to-Speech for Rig Cabin Hands-free audio briefing
  const handleSpeakBriefing = () => {
    if (!('speechSynthesis' in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const plainText = direct_verdict.join('. ').replace(/\*\*/g, '');
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // 1-Click Printable Pre-Spud Risk Briefing
  const handlePrintBriefing = () => {
    window.print();
  };

  const totalLatencyMs = execution_trace.reduce((acc, t) => acc + (t.latency_ms || 15), 0);

  return (
    <div className="multi-agent-response-container">
      {/* 1. Five Specialized Agent Horizon Pills */}
      {agent_pills && agent_pills.length > 0 && (
        <div className="agent-horizon-pills">
          {agent_pills.map((agent) => (
            <div 
              key={agent.id}
              className={`agent-mini-pill ${agent.color || 'green'} ${activeTab === agent.id ? 'active' : ''}`}
              onClick={() => setActiveTab(agent.id)}
              title={`Click to inspect ${agent.name} technical details`}
            >
              <div className="pill-top-row">
                <span className="pill-agent-name">{agent.name}</span>
                <span className={`pill-badge ${agent.color || 'green'}`}>{agent.badge || 'VERIFIED'}</span>
              </div>
              <span className={`pill-status-text ${agent.color || 'green'}`}>
                {agent.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 2. Executive Drilling Verdict & Action Directive (Clean Highlight Card) */}
      <div className="executive-verdict-card">
        <div className="verdict-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="verdict-pulse-dot"></span>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ⚡ Executive Drilling Verdict &amp; Mitigation Directives
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #fde68a' }}>
            Nahorkatiya South Asset • Sector B
          </span>
        </div>

        <div className="verdict-bullets">
          {direct_verdict && direct_verdict.length > 0 ? (
            direct_verdict.map((bullet, idx) => (
              <div key={idx} className="verdict-bullet-item">
                <span className="bullet-num">{idx + 1}</span>
                <span 
                  className="bullet-text"
                  dangerouslySetInnerHTML={{ 
                    __html: bullet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                  }}
                />
              </div>
            ))
          ) : (
            <div className="verdict-bullet-item">
              <span className="bullet-num">1</span>
              <span className="bullet-text">
                Barail Sand top projected at 2815m MD (+35m dip). Offset Well B-04 suffered severe mud loss at 2850m. Trim mud weight to 1.15-1.17 SG and keep 40 bbl LCM pill on standby.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Multi-Agent Deep-Dive Tabs */}
      <div className="agent-tabs-header">
        <button 
          className={`agent-tab-btn ${activeTab === 'verdict' ? 'active' : ''}`}
          onClick={() => setActiveTab('verdict')}
        >
          <Activity size={14} />
          <span>Cross-Well Matrix</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'geostratum' ? 'active' : ''}`}
          onClick={() => setActiveTab('geostratum')}
        >
          <span>🌍</span>
          <span>GeoStratum</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'lithoguard' ? 'active' : ''}`}
          onClick={() => setActiveTab('lithoguard')}
        >
          <span>⚠️</span>
          <span>LithoGuard</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'mudsmith' ? 'active' : ''}`}
          onClick={() => setActiveTab('mudsmith')}
        >
          <span>🛠️</span>
          <span>MudSmith</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'casingpro' ? 'active' : ''}`}
          onClick={() => setActiveTab('casingpro')}
        >
          <span>📐</span>
          <span>CasingPro</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'nptsentry' ? 'active' : ''}`}
          onClick={() => setActiveTab('nptsentry')}
        >
          <span>⏱️</span>
          <span>NptSentry</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'narrative' ? 'active' : ''}`}
          onClick={() => setActiveTab('narrative')}
        >
          <Sparkles size={14} style={{ color: 'var(--oil-amber)' }} />
          <span>AI Narrative</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="agent-tab-content-box">
        {/* Tab 0: Cross-Well Risk Matrix (The eye-catching table inspired by sih26) */}
        {activeTab === 'verdict' && (
          <div>
            <div className="matrix-title-row">
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                ⚡ Cross-Well Formation &amp; Incident Collision Matrix
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Comparing Active Well A-01 against 4 Offset Wells
              </span>
            </div>

            <div className="matrix-table-wrapper">
              <table className="matrix-table">
                <thead>
                  <tr>
                    <th>Well &amp; Sector</th>
                    <th>Distance &amp; Bearing</th>
                    <th>Formation / Target Depth</th>
                    <th>Recorded Incident / Risk</th>
                    <th>Proven Remedial Action</th>
                  </tr>
                </thead>
                <tbody>
                  {collision_matrix && collision_matrix.map((row, idx) => (
                    <tr key={idx} className={row.well.includes("Active") ? "active-well-row" : ""}>
                      <td style={{ fontWeight: 700 }}>
                        {row.well.includes("Active") && <span className="active-well-indicator">🎯 ACTIVE</span>}
                        {row.well}
                      </td>
                      <td>{row.proximity}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{row.formation_depth}</td>
                      <td>
                        <span className={`matrix-status-chip ${row.color || 'yellow'}`}>
                          {row.hazard_status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>{row.remediation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 1: GeoStratum (Geology & Dip) */}
        {activeTab === 'geostratum' && geostratum && (
          <div className="agent-detail-grid">
            <div className="detail-stat-card">
              <span className="stat-label">Active Depth (MD / TVD)</span>
              <span className="stat-value">{geostratum.active_depth_md}m / {geostratum.active_depth_tvd}m</span>
              <span className="stat-sub">Measured Depth vs True Vertical Depth</span>
            </div>
            <div className="detail-stat-card">
              <span className="stat-label">Next Target Formation</span>
              <span className="stat-value" style={{ color: 'var(--active-blue)' }}>{geostratum.next_formation}</span>
              <span className="stat-sub">Top anticipated at {geostratum.target_entry_md}m MD ({geostratum.look_ahead_distance_m}m ahead)</span>
            </div>
            <div className="detail-stat-card full-width">
              <span className="stat-label">Structural Dip Correlation</span>
              <span className="stat-value-text">{geostratum.structural_dip}</span>
              <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {geostratum.lithology_summary}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: LithoGuard (Hazard & Prediction) */}
        {activeTab === 'lithoguard' && lithoguard && (
          <div>
            <div className="hazard-gauges-row">
              <div className="hazard-gauge-card red">
                <span className="gauge-title">Mud Loss Risk</span>
                <span className="gauge-number red">{lithoguard.loss_risk_percentage}%</span>
                <span className="gauge-sub">Critical Corridor: {lithoguard.critical_loss_interval}</span>
              </div>
              <div className="hazard-gauge-card yellow">
                <span className="gauge-title">Differential Sticking Risk</span>
                <span className="gauge-number yellow">{lithoguard.stuck_pipe_risk_percentage}%</span>
                <span className="gauge-sub">Permeable Barail Sand @ 2910m</span>
              </div>
              <div className="hazard-gauge-card green">
                <span className="gauge-title">Gas Kick Risk</span>
                <span className="gauge-number green">{lithoguard.kick_risk_percentage}%</span>
                <span className="gauge-sub">Kopili Shale Transition @ 3290m</span>
              </div>
            </div>

            <div className="hazard-indicators-box">
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#dc2626', display: 'block', marginBottom: '0.35rem' }}>
                🚨 Real-Time Warning Signs to Monitor on Rig Floor:
              </span>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                {lithoguard.early_indicators.map((ind, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>{ind}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: MudSmith (Fluids & LCM Recipe) */}
        {activeTab === 'mudsmith' && mudsmith && (
          <div>
            <div className="agent-detail-grid">
              <div className="detail-stat-card">
                <span className="stat-label">Recommended Mud Weight</span>
                <span className="stat-value" style={{ color: '#059669' }}>{mudsmith.recommended_mw_window}</span>
                <span className="stat-sub">Fracture gradient limit: {mudsmith.fracture_gradient_sg} SG</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Max Dynamic ECD Ceiling</span>
                <span className="stat-value" style={{ color: '#d97706' }}>&lt; {mudsmith.max_allowable_ecd} SG</span>
                <span className="stat-sub">Flow rate capped at {mudsmith.flow_rate_limit_lpm} LPM</span>
              </div>
            </div>

            <div className="lcm-recipe-card">
              <div className="lcm-recipe-head">
                <Droplet size={16} style={{ color: 'var(--oil-amber)' }} />
                <span>Proven 40 bbl Heavy Thixotropic LCM Pill Standby Formulation</span>
              </div>
              <div className="lcm-recipe-grid">
                <div className="recipe-item">
                  <span className="r-label">Coarse Ground Walnut Shells</span>
                  <span className="r-val">{mudsmith.lcm_pill_standby_recipe.nut_plug_ppb} ppb</span>
                </div>
                <div className="recipe-item">
                  <span className="r-label">Medium Flake Mica</span>
                  <span className="r-val">{mudsmith.lcm_pill_standby_recipe.mica_flake_ppb} ppb</span>
                </div>
                <div className="recipe-item">
                  <span className="r-label">Sized CaCO3 (Safecarb 250)</span>
                  <span className="r-val">{mudsmith.lcm_pill_standby_recipe.caco3_ppb} ppb</span>
                </div>
                <div className="recipe-item">
                  <span className="r-label">Total Volume &amp; Soak Time</span>
                  <span className="r-val">{mudsmith.lcm_pill_standby_recipe.volume_bbl} bbl ({mudsmith.lcm_pill_standby_recipe.soak_time_hrs} hrs)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CasingPro (Casing & Cementing) */}
        {activeTab === 'casingpro' && casingpro && (
          <div>
            <div className="agent-detail-grid">
              <div className="detail-stat-card">
                <span className="stat-label">Active Intermediate Shoe</span>
                <span className="stat-value">{casingpro.intermediate_shoe_casing}</span>
                <span className="stat-sub">Seated at {casingpro.intermediate_shoe_md}m MD</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">Open Hole Section</span>
                <span className="stat-value">{casingpro.open_hole_size_in} inch</span>
                <span className="stat-sub">Drilling towards 7" liner at 3400m</span>
              </div>
            </div>

            <div style={{ marginTop: '0.8rem', background: '#f8fafc', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem' }}>
                Offset Intermediate Shoe Benchmarking:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {casingpro.offset_shoe_comparison.map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.35rem 0.5rem', background: '#ffffff', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 600 }}>{c.well}: {c.shoe_depth}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{c.notes}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: NptSentry (Economics & Checklist) */}
        {activeTab === 'nptsentry' && nptsentry && (
          <div>
            <div className="agent-detail-grid">
              <div className="detail-stat-card">
                <span className="stat-label">Rig Operating Cost</span>
                <span className="stat-value">₹{nptsentry.rig_hourly_cost_lakhs} Lakhs/hr</span>
                <span className="stat-sub">Rig-14 2000 HP CyberRig</span>
              </div>
              <div className="detail-stat-card">
                <span className="stat-label">NPT Avoided Savings</span>
                <span className="stat-value" style={{ color: '#059669' }}>₹{nptsentry.estimated_cost_savings_lakhs} Lakhs</span>
                <span className="stat-sub">{nptsentry.avoided_npt_hours} hours downtime saved</span>
              </div>
            </div>

            <div className="checklist-box">
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1e3a8a', display: 'block', marginBottom: '0.4rem' }}>
                📋 Look-Ahead Operational Checklist for Driller &amp; Mud Engineer:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {nptsentry.look_ahead_checklist.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                    <span style={{ color: '#059669', fontWeight: 800 }}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Full NVIDIA Nemotron Synthesized Narrative */}
        {activeTab === 'narrative' && (
          <div className="narrative-content">
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.88rem', lineHeight: '1.7', color: 'var(--text-body)' }}>
              {answer}
            </div>
          </div>
        )}
      </div>

      {/* 4. Embedded Interactive Well Graph (Visual Map / Proximity Toggle) */}
      {well_graph && (
        <div style={{ marginTop: '1rem' }}>
          <InteractiveWellGraph graphData={well_graph} />
        </div>
      )}

      {/* 5. Authentic Document Citations (Clickable Pills) */}
      {citations && citations.length > 0 && (
        <div className="citations-tray">
          <span className="citations-tray-label">Authentic OIL Grounding:</span>
          {citations.map((c) => (
            <button
              key={c.doc_id}
              className="citation-pill-btn"
              onClick={() => onOpenDocument(c)}
              title="Click to view authentic Oil India Limited completion log excerpt"
            >
              <FileText size={13} style={{ color: 'var(--oil-amber)' }} />
              <span>{c.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* 6. Multi-Agent Execution Trace (Collapsible like sih26) */}
      {execution_trace && execution_trace.length > 0 && (
        <div className="execution-trace-container">
          <div 
            className="trace-header-bar" 
            onClick={() => setIsTraceOpen(!isTraceOpen)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="trace-icon-badge">⚡</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Multi-Agent StateGraph Execution Trace ({execution_trace.length} Nodes Synchronized)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="trace-total-ms">{totalLatencyMs}ms</span>
              {isTraceOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </div>

          {isTraceOpen && (
            <div className="trace-body">
              {execution_trace.map((step, idx) => (
                <div key={idx} className="trace-step-row">
                  <div className="trace-step-dot"></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-mono)' }}>
                        {step.node}
                      </span>
                      <span className="trace-node-ms">{step.latency_ms}ms</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {step.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Action Toolbar */}
      <div className="response-action-bar">
        <button 
          className="action-pill-btn" 
          onClick={handlePrintBriefing}
          title="Print or Save Pre-Spud Risk Report as PDF"
        >
          <Printer size={14} />
          <span>Export Pre-Spud Risk Briefing (PDF)</span>
        </button>

        <button 
          className="action-pill-btn" 
          onClick={handleCopyVerdict}
          title="Copy Executive Verdict to clipboard"
        >
          {copied ? <Check size={14} style={{ color: 'var(--alert-success)' }} /> : <Copy size={14} />}
          <span>{copied ? "Copied!" : "Copy Verdict"}</span>
        </button>

        <button 
          className={`action-pill-btn ${isSpeaking ? 'active' : ''}`}
          onClick={handleSpeakBriefing}
          title="Read directive via speech synthesizer for hands-free rig cabin operation"
        >
          <Volume2 size={14} />
          <span>{isSpeaking ? "Stop Audio" : "Rig Audio Briefing"}</span>
        </button>
      </div>
    </div>
  );
}
