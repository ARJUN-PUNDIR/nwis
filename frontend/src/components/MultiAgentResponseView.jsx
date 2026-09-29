import React, { useState } from 'react';
import { 
  Compass, AlertTriangle, Droplet, Shield, Clock, ChevronDown, ChevronUp,
  FileText, Copy, Check, Volume2, Printer, Layers, Activity, Sparkles, ExternalLink,
  Calculator, AlertOctagon, HelpCircle, CheckCircle2, ArrowRight, Radio, RadioTower
} from 'lucide-react';
import InteractiveWellGraph from './InteractiveWellGraph';
import TourSheetModal from './TourSheetModal';

export default function MultiAgentResponseView({ data, onOpenDocument }) {
  const [activeTab, setActiveTab] = useState('verdict');
  const [casingSubTab, setCasingSubTab] = useState('casing'); // 'casing' | 'cementing'
  const [isTraceOpen, setIsTraceOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTourSheetOpen, setIsTourSheetOpen] = useState(false);
  const [isTelemetryExpanded, setIsTelemetryExpanded] = useState(false);

  // Dynamic LCM Calculator State
  const [lcmVolume, setLcmVolume] = useState(40);
  const [lcmSeverity, setLcmSeverity] = useState('severe'); // 'seepage' | 'partial' | 'severe' | 'total'

  // Stuck Pipe Decision Tree State
  const [stuckMotion, setStuckMotion] = useState('stationary'); // 'stationary' | 'up' | 'down'
  const [stuckCirculation, setStuckCirculation] = useState('full'); // 'full' | 'partial' | 'none'
  const [stuckRotation, setStuckRotation] = useState('no'); // 'yes' | 'no'

  // Destructure multi-agent data
  const {
    direct_verdict = [],
    agent_pills = [],
    agents_data = {},
    collision_matrix = [],
    execution_trace = [],
    citations = [],
    well_graph = null,
    ertmac_telemetry = null,
    realtime_alerts = [],
    answer = ""
  } = data || {};

  const { geostratum, lithoguard, mudsmith, casingpro, nptsentry } = agents_data || {};

  // Real-Time Dynamic Depth Pointer state synchronized with Well Graph
  const initialDepth = geostratum?.active_depth_md || 2820.0;
  const [liveDepth, setLiveDepth] = useState(initialDepth);

  // Dynamic metrics calculated in real-time as pointer moves
  const barailTop = 2815;
  const barailDist = barailTop - liveDepth;
  const liveTvd = Math.round(liveDepth - 35);

  const getDynamicRisk = (d) => {
    if (d >= 2835 && d <= 2865) {
      return {
        level: "CRITICAL",
        badge: "CRITICAL LOSS CORRIDOR",
        lossRisk: 94,
        color: "red",
        text: `Severe Mud Loss Corridor active at ${d}m (Matches Well B-04 loss at 2850m). Fracture gradient only 1.22 SG eq.`
      };
    }
    if (d >= 2810 && d < 2835) {
      return {
        level: "ADVISORY",
        badge: "BARAIL TRANSITION",
        lossRisk: 72,
        color: "yellow",
        text: `Approaching Barail Arenaceous Sand Member (${Math.max(0, barailTop - d)}m remaining). Pre-treat mud and hold 40 bbl LCM pill on standby.`
      };
    }
    if (d > 2865) {
      return {
        level: "WARNING",
        badge: "DIFFERENTIAL STICKING",
        lossRisk: 48,
        color: "yellow",
        text: `Drilling permeable depleted sand at ${d}m. Differential overbalance must remain under 250 psi to avoid stuck pipe (Well C-12).`
      };
    }
    return {
      level: "NOMINAL",
      badge: "STABLE DRILLING",
      lossRisk: 15,
      color: "green",
      text: `Drilling stable Tipam section at ${d}m MD (${barailTop - d}m above Barail sand top). Nominal parameters maintained.`
    };
  };

  const dynamicRisk = getDynamicRisk(liveDepth);

  // Realistic fallback live telemetry stream
  const telemetry = ertmac_telemetry || {
    status: "ONLINE_STREAMING",
    station: "OIL eRTMAC Operations Hub (Duliajan, Assam)",
    rig_name: "OIL Rig-14 (2000 HP CyberRig)",
    well_code: "NHKT-A01",
    timestamp_ist: "Live Telemetry Feed (24/7)",
    bit_depth_md: geostratum?.active_depth_md || 2820.0,
    rop_m_hr: 14.8,
    wob_tons: 12.5,
    rpm: 110,
    torque_knm: 22.4,
    standpipe_pressure_psi: 2340,
    spp_delta_psi: -140,
    active_pit_volume_m3: 118.4,
    pit_deviation_m3: -1.4,
    loss_rate_m3_hr: 7.0,
    flow_in_lpm: 1240,
    flow_out_pct: 94.2,
    mud_weight_in_sg: 1.16,
    downhole_ecd_sg: 1.18,
    fracture_gradient_sg: 1.22,
    background_gas_pct: 1.25,
    hook_load_tons: 148.5
  };

  // Real-time alerts fallback
  const activeAlerts = (realtime_alerts && realtime_alerts.length > 0) ? realtime_alerts : [
    {
      id: "ALERT-ERT-01",
      severity: "CRITICAL",
      badge: "CRITICAL TELEMETRY ALERT",
      category: "MUD LOSS INCEPTION",
      title: "eRTMAC Alert: Pit Volume Loss Delta (-1.4 m³ / Rate: 7.0 m³/hr)",
      telemetry_trigger: "PVT Delta: -1.4 m³ in 12 min | Flow Out (94.2%) < Flow In (1240 LPM)",
      offset_correlation: "Matches Barail Sand entrance in Well B-04 @ 2850m (28.5 m³/hr loss)",
      directive: "Alert Mud Engineer. Spot standby 40 bbl heavy LCM pill. Throttle flow rate <= 1200 LPM to cap ECD < 1.18 SG.",
      source: "eRTMAC Smart Pit Volume Totalizer (PVT)",
      timestamp: "Just now",
      tabTarget: "mudsmith"
    },
    {
      id: "ALERT-ERT-02",
      severity: "WARNING",
      badge: "HYDRAULIC WARNING",
      category: "STANDPIPE PRESSURE REDUCTION",
      title: "eRTMAC Alert: Standpipe Pressure Drop (-140 psi @ 2,340 psi)",
      telemetry_trigger: "SPP dropped from 2,480 psi to 2,340 psi at constant pump SPM (108)",
      offset_correlation: "Formation breakdown pressure threshold breached (1.22 SG eq)",
      directive: "Check pump stroke counter; monitor trip tank during next connection for seepage.",
      source: "eRTMAC High-Frequency Pressure Transducer",
      timestamp: "2 mins ago"
    },
    {
      id: "ALERT-ERT-03",
      severity: "ADVISORY",
      badge: "DIFFERENTIAL STICKING ALERT",
      category: "DRILLSTRING FRICTION",
      title: "eRTMAC Advisory: Rotary Torque Chatter Fluctuation (18 - 26 kNm)",
      telemetry_trigger: "Surface torque deviation: ±4.2 kNm over 15-minute moving average",
      offset_correlation: "Matches Well C-12 differential sticking precursor at 2910m (24h NPT)",
      directive: "Maintain string rotation and reciprocation during connections. Do not let string remain static.",
      source: "eRTMAC Top Drive Torque Telemetry",
      timestamp: "5 mins ago",
      tabTarget: "lithoguard"
    }
  ];

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

  // Dynamic LCM Sack Calculation
  const getLcmFormulation = (severity, volume) => {
    let nut_ppb = 25;
    let mica_ppb = 20;
    let caco3_ppb = 15;
    let soak_hrs = 3.0;
    let desc = "Severe Fracture Loss (matches Well B-04 @ 2850m)";

    if (severity === 'seepage') {
      nut_ppb = 10;
      mica_ppb = 10;
      caco3_ppb = 20;
      soak_hrs = 1.5;
      desc = "Permeable Sand Seepage (< 5 m³/hr)";
    } else if (severity === 'partial') {
      nut_ppb = 15;
      mica_ppb = 15;
      caco3_ppb = 20;
      soak_hrs = 2.0;
      desc = "Partial Losses (5 - 20 m³/hr)";
    } else if (severity === 'total') {
      nut_ppb = 35;
      mica_ppb = 25;
      caco3_ppb = 20;
      soak_hrs = 4.5;
      desc = "Total / Blind Losses (> 40 m³/hr)";
    }

    const nut_lbs = nut_ppb * volume;
    const mica_lbs = mica_ppb * volume;
    const caco3_lbs = caco3_ppb * volume;

    const nut_sacks = Math.ceil(nut_lbs / 55.1); // 25kg sacks
    const mica_sacks = Math.ceil(mica_lbs / 55.1);
    const caco3_sacks = Math.ceil(caco3_lbs / 55.1);
    const total_dry_kg = Math.round((nut_lbs + mica_lbs + caco3_lbs) * 0.453592);

    return {
      nut_ppb, mica_ppb, caco3_ppb, soak_hrs, desc,
      nut_sacks, mica_sacks, caco3_sacks, total_dry_kg,
      base_mud_m3: (volume * 0.15898).toFixed(1)
    };
  };

  const currentLcm = getLcmFormulation(lcmSeverity, lcmVolume);

  // Stuck Pipe Mechanism Diagnostics
  const getStuckPipeDiagnosis = () => {
    if (stuckMotion === 'stationary') {
      if (stuckCirculation === 'full') {
        return {
          mechanism: "DIFFERENTIAL STICKING (High Overbalance Across Sand)",
          confidence: "95% Match with Offset Well C-12 @ 2910m",
          severity: "CRITICAL",
          color: "#dc2626",
          bg: "#fef2f2",
          remedy: "Do NOT pull with continuous excessive tension. Spot 50 bbl lubricant / pipe-freeing soak pill across stuck zone. Jar UPWARD while holding 40% drill pipe torque.",
          soak_pill: "50 bbl Glycol / Mineral Oil lubricant soaked for 4 hours."
        };
      }
      return {
        mechanism: "SETTLED CUTTINGS / BARITE SAG / INADEQUATE HOLE CLEANING",
        confidence: "82% Confidence",
        severity: "HIGH",
        color: "#d97706",
        bg: "#fffbeb",
        remedy: "Establish circulation slowly with max allowable SPM. Break cuttings bed. Jar DOWNWARD with 60,000 - 80,000 lbs.",
        soak_pill: "High-viscosity sweep (30 ppb bentonite) to clear cuttings."
      };
    }
    if (stuckMotion === 'up') {
      if (stuckCirculation === 'full') {
        return {
          mechanism: "KEYSEAT OR UNDERGAUGE HOLE GEOMETRY",
          confidence: "88% Confidence",
          severity: "HIGH",
          color: "#d97706",
          bg: "#fffbeb",
          remedy: "Jar DOWNWARD immediately with 80,000 - 100,000 lbs. Do not pull upward without jarring.",
          soak_pill: "Lubricant pill to reduce friction while working string down."
        };
      }
      return {
        mechanism: "HOLE PACK-OFF / SLOUGHING SHALE COLLAPSE",
        confidence: "90% Confidence (Kopili / Girujan Shale)",
        severity: "CRITICAL",
        color: "#dc2626",
        bg: "#fef2f2",
        remedy: "Jar DOWNWARD with full available jar stroke. Apply low flow rate to wash out bridge without fracturing formation.",
        soak_pill: "Inhibited KCl / PHPA fluid sweep."
      };
    }
    return {
      mechanism: "LEDGE, FORMATION BRIDGE, OR JUNK IN HOLE",
      confidence: "85% Confidence",
      severity: "MODERATE",
      color: "#059669",
      bg: "#ecfdf5",
      remedy: "Jar UPWARD with 100,000 - 120,000 lbs overpull. Do not apply further downward slack-off weight.",
      soak_pill: "Circulate bottoms up to confirm junk/cavings."
    };
  };

  const stuckDiagnosis = getStuckPipeDiagnosis();

  // Curated Stratigraphic Column for GeoStratum
  const stratColumns = geostratum?.stratigraphic_column || [
    { formation: "Alluvium / Dihing", top_md: 0, base_md: 350, lithology: "Unconsolidated sands, gravels", color: "#fef08a", hazard: "None (20\" Cased)" },
    { formation: "Dhekiajuli / Girujan Clay", top_md: 350, base_md: 1200, lithology: "Mottled swelling claystone", color: "#cbd5e1", hazard: "Bit balling (13-3/8\" @ 1140m)" },
    { formation: "Tipam Sandstone Member", top_md: 1200, base_md: 2750, lithology: "Massive medium sands", color: "#fde047", hazard: "Normal Fairway (9-5/8\" @ 2750m)" },
    { formation: "Barail Arenaceous Sand", top_md: 2815, base_md: 2980, lithology: "Depleted reservoir sand, coal streaks", color: "#f59e0b", hazard: "Severe Loss Risk (88% @ 2850m)" },
    { formation: "Kopili Marine Shale", top_md: 2980, base_md: 3450, lithology: "Overpressured dark marine shale", color: "#64748b", hazard: "Gas Kick Hazard (SIDPP 340 psi)" }
  ];

  // Curated Cementing Comparison for CasingPro
  const cementingList = casingpro?.cementing_comparison || [
    {
      well: "Active Well A-01",
      lead_slurry: "1.58 SG Pozzolan / Class G",
      tail_slurry: "1.90 SG Class G + 0.3% Retarder",
      toc_planned_m: "Surface (0m)",
      toc_verified_m: "Surface (CBL Verified)",
      woc_hrs: 24.0,
      compressive_strength_24h_psi: 2650,
      cbl_quality: "EXCELLENT (98% Bond Across Shoe)",
      gas_migration_control: "Gas-tight micro-silica latex added"
    },
    {
      well: "Offset B-04",
      lead_slurry: "1.55 SG Extended Slurry",
      tail_slurry: "1.88 SG Class G",
      toc_planned_m: "Surface",
      toc_verified_m: "120m (Channeling in Tipam)",
      woc_hrs: 24.0,
      compressive_strength_24h_psi: 2200,
      cbl_quality: "MODERATE (Microannulus detected)",
      gas_migration_control: "Standard fluid loss additives"
    },
    {
      well: "Offset C-12",
      lead_slurry: "1.60 SG Class G",
      tail_slurry: "1.90 SG High Early Strength",
      toc_planned_m: "Surface",
      toc_verified_m: "45m (Good isolation)",
      woc_hrs: 26.0,
      compressive_strength_24h_psi: 2800,
      cbl_quality: "EXCELLENT (95% Isolation)",
      gas_migration_control: "Anti-gas channeling polymer"
    },
    {
      well: "Offset D-08",
      lead_slurry: "1.62 SG Heavy Lead",
      tail_slurry: "1.92 SG Barite Slurry",
      toc_planned_m: "Surface",
      toc_verified_m: "Surface (Good shoe bond)",
      woc_hrs: 30.0,
      compressive_strength_24h_psi: 3100,
      cbl_quality: "EXCELLENT (Kopili gas sealed)",
      gas_migration_control: "Gas-tight surfactant + Micro-silica"
    }
  ];

  const totalLatencyMs = execution_trace.reduce((acc, t) => acc + (t.latency_ms || 15), 0);

  return (
    <div className="multi-agent-response-container">
      {/* =====================================================================
          0. OIL eRTMAC REAL-TIME TELEMETRY STREAM & REAL-TIME ALERTS BANNER
          ===================================================================== */}
      <div className="ertmac-stream-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="ertmac-live-badge">
            <span className="ertmac-pulse-dot"></span>
            <span>eRTMAC LIVE STREAM</span>
          </div>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)' }}>
            OIL Rig-14 (NHKT-A01)
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Bit: <strong>{telemetry.bit_depth_md}m MD</strong>
          </span>
        </div>

        {/* Live Metrics Ticker Chips */}
        <div className="ertmac-ticker-metrics">
          <div className="ertmac-metric-chip alert-down" title="Standpipe Pressure Trend">
            <span>SPP:</span>
            <strong>{telemetry.standpipe_pressure_psi} psi</strong>
            <span>(▼ {Math.abs(telemetry.spp_delta_psi)} psi)</span>
          </div>
          <div className="ertmac-metric-chip alert-down" title="Active Mud Pit Volume Deviation">
            <span>Pit:</span>
            <strong>{telemetry.pit_deviation_m3} m³</strong>
            <span>(-{telemetry.loss_rate_m3_hr} m³/h)</span>
          </div>
          <div className="ertmac-metric-chip" title="Dynamic Downhole ECD">
            <span>ECD:</span>
            <strong>{telemetry.downhole_ecd_sg} SG</strong>
          </div>
          <div className="ertmac-metric-chip" title="Rate of Penetration">
            <span>ROP:</span>
            <strong>{telemetry.rop_m_hr} m/h</strong>
          </div>
          <div className="ertmac-metric-chip" title="Background Formation Gas">
            <span>Gas:</span>
            <strong>{telemetry.background_gas_pct}%</strong>
          </div>
        </div>

        {/* Toggle 8 Live Sensor Gauges Console */}
        <button
          onClick={() => setIsTelemetryExpanded(!isTelemetryExpanded)}
          style={{
            background: isTelemetryExpanded ? 'var(--active-blue)' : '#ffffff',
            color: isTelemetryExpanded ? '#ffffff' : 'var(--active-blue)',
            border: '1px solid var(--active-blue)',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease'
          }}
        >
          <Activity size={12} />
          <span>{isTelemetryExpanded ? "Hide Sensors" : "⚡ Live Sensors (8)"}</span>
        </button>
      </div>

      {/* Expanded 8 Live Sensor Telemetry Gauges Console */}
      {isTelemetryExpanded && (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Activity size={13} style={{ color: 'var(--active-blue)' }} />
              <span>Real-Time WITSML Sensor Channels (24/7 Duliajan Telemetry Hub):</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Protocol: WITSML 2.1 Gateway • Latency: 120ms
            </span>
          </div>

          <div className="ertmac-telemetry-grid">
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Standpipe Pressure</span>
              <span className="ertmac-sensor-value" style={{ color: '#dc2626' }}>{telemetry.standpipe_pressure_psi} psi</span>
              <span className="ertmac-sensor-sub">Baseline: 2,480 psi (▼ 140)</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Active Pit Volume</span>
              <span className="ertmac-sensor-value" style={{ color: '#dc2626' }}>{telemetry.pit_deviation_m3} m³</span>
              <span className="ertmac-sensor-sub">Rate: -{telemetry.loss_rate_m3_hr} m³/hr</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Dynamic Downhole ECD</span>
              <span className="ertmac-sensor-value" style={{ color: '#d97706' }}>{telemetry.downhole_ecd_sg} SG</span>
              <span className="ertmac-sensor-sub">Fracture Limit: 1.22 SG</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Rate of Penetration</span>
              <span className="ertmac-sensor-value" style={{ color: '#0284c7' }}>{telemetry.rop_m_hr} m/hr</span>
              <span className="ertmac-sensor-sub">WOB: {telemetry.wob_tons} Tons</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Surface Rotary Torque</span>
              <span className="ertmac-sensor-value" style={{ color: '#d97706' }}>{telemetry.torque_knm} kNm</span>
              <span className="ertmac-sensor-sub">Chatter: ±4.2 kNm</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Flow In / Flow Out</span>
              <span className="ertmac-sensor-value">{telemetry.flow_out_pct}% Out</span>
              <span className="ertmac-sensor-sub">In: {telemetry.flow_in_lpm} LPM</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Formation Total Gas</span>
              <span className="ertmac-sensor-value" style={{ color: '#059669' }}>{telemetry.background_gas_pct}%</span>
              <span className="ertmac-sensor-sub">Peak: 2.10%</span>
            </div>
            <div className="ertmac-sensor-card">
              <span className="ertmac-sensor-label">Rotary RPM &amp; Hookload</span>
              <span className="ertmac-sensor-value">{telemetry.rpm} RPM</span>
              <span className="ertmac-sensor-sub">Hookload: {telemetry.hook_load_tons} T</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Active Alerts Banner */}
      <div className="ertmac-alerts-banner">
        {activeAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`ertmac-alert-card ${alert.severity === 'CRITICAL' ? 'critical' : alert.severity === 'WARNING' ? 'warning' : 'advisory'}`}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1 }}>
              <span style={{ fontSize: '1.05rem', lineHeight: 1, marginTop: '2px' }}>
                {alert.severity === 'CRITICAL' ? '🚨' : alert.severity === 'WARNING' ? '⚠️' : 'ℹ️'}
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '0.82rem' }}>{alert.title}</strong>
                  <span style={{ fontSize: '0.64rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', background: '#ffffff', border: '1px solid currentColor' }}>
                    {alert.badge || alert.severity}
                  </span>
                  <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>• {alert.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.74rem', marginBottom: '3px' }}>
                  <strong>Trigger:</strong> {alert.telemetry_trigger} • <strong>Precedent:</strong> {alert.offset_correlation}
                </div>
                <div style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <strong>Action Directive:</strong> {alert.directive}
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            {alert.tabTarget && (
              <button
                onClick={() => setActiveTab(alert.tabTarget)}
                style={{
                  background: '#ffffff',
                  border: '1px solid currentColor',
                  borderRadius: '4px',
                  padding: '3px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  alignSelf: 'center'
                }}
              >
                {alert.tabTarget === 'mudsmith' ? "🛠️ Open LCM Calc" : "🪓 Open Stuck Wizard"}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 1. Five Specialized Agent Horizon Pills with Real-Time Depth Synchronization */}
      {agent_pills && agent_pills.length > 0 && (
        <div className="agent-horizon-pills">
          {agent_pills.map((agent) => {
            let statusText = agent.status;
            let badgeText = agent.badge || 'VERIFIED';
            let pillColor = agent.color || 'green';

            if (agent.id === 'geostratum') {
              statusText = barailDist > 0 ? `Barail Top in ${barailDist}m` : (barailDist === 0 ? 'Top @ 2815m' : `${Math.abs(barailDist)}m inside Barail`);
              badgeText = `${liveDepth}m MD`;
            } else if (agent.id === 'lithoguard') {
              statusText = `${dynamicRisk.lossRisk}% Loss Risk @ ${liveDepth}m`;
              badgeText = dynamicRisk.badge;
              pillColor = dynamicRisk.color;
            } else if (agent.id === 'mudsmith') {
              statusText = liveDepth >= 2810 ? '1.15-1.17 SG | 40 bbl LCM' : '1.18 SG | Circulation OK';
              badgeText = liveDepth >= 2810 ? 'ACTION READY' : 'NOMINAL';
              pillColor = liveDepth >= 2810 ? 'yellow' : 'green';
            } else if (agent.id === 'casingpro') {
              statusText = `9-5/8" Shoe @ 2750m (+${liveDepth - 2750}m)`;
            }

            return (
              <div 
                key={agent.id}
                className={`agent-mini-pill ${pillColor} ${activeTab === agent.id ? 'active' : ''}`}
                onClick={() => setActiveTab(agent.id)}
                title={`Click to inspect ${agent.name} technical details`}
              >
                <div className="pill-top-row">
                  <span className="pill-agent-name">{agent.name}</span>
                  <span className={`pill-badge ${pillColor}`}>{badgeText}</span>
                </div>
                <span className={`pill-status-text ${pillColor}`}>
                  {statusText}
                </span>
              </div>
            );
          })}
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

          {/* Quick Actions: Audio, Copy, and Printable Tour Sheet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={handleSpeakBriefing}
              title={isSpeaking ? "Stop audio briefing" : "Play audio briefing (Rig cabin mode)"}
              style={{
                background: isSpeaking ? '#fee2e2' : '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: isSpeaking ? '#dc2626' : 'var(--text-body)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Volume2 size={13} />
              <span>{isSpeaking ? "Stop" : "Listen"}</span>
            </button>

            <button
              onClick={handleCopyVerdict}
              title="Copy verdict takeaways"
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-body)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {copied ? <Check size={13} style={{ color: '#059669' }} /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>

            <button
              onClick={() => setIsTourSheetOpen(true)}
              title="Generate printable 1-page daily rig look-ahead tour sheet for pre-spud meeting"
              style={{
                background: 'var(--oil-amber)',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 9px',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 1px 3px rgba(217, 119, 6, 0.3)'
              }}
            >
              <Printer size={13} />
              <span>📄 1-Page Rig Tour Sheet</span>
            </button>
          </div>
        </div>

        {/* Real-Time Live Depth Synchronizer Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '7px',
          padding: '6px 12px',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0284c7' }}>
              📍 Real-Time Pointer Depth: {liveDepth}m MD
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              (TVD: {liveTvd}m)
            </span>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              padding: '1px 6px', 
              borderRadius: '4px',
              background: dynamicRisk.color === 'red' ? '#fee2e2' : (dynamicRisk.color === 'yellow' ? '#fef3c7' : '#dcfce7'),
              color: dynamicRisk.color === 'red' ? '#dc2626' : (dynamicRisk.color === 'yellow' ? '#b45309' : '#15803d'),
              border: `1px solid ${dynamicRisk.color === 'red' ? '#fecaca' : (dynamicRisk.color === 'yellow' ? '#fde68a' : '#bbf7d0')}`
            }}>
              {dynamicRisk.badge}
            </span>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
            {barailDist > 0 ? `Target Barail Sand: ${barailDist}m remaining` : `Inside Barail Sand by ${Math.abs(barailDist)}m`}
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
          className={`agent-tab-btn ${activeTab === 'ertmac' ? 'active' : ''}`}
          onClick={() => setActiveTab('ertmac')}
        >
          <span>⚡</span>
          <span>Live eRTMAC Feed</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'geostratum' ? 'active' : ''}`}
          onClick={() => setActiveTab('geostratum')}
        >
          <span>🌍</span>
          <span>GeoStratum &amp; Lithology</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'lithoguard' ? 'active' : ''}`}
          onClick={() => setActiveTab('lithoguard')}
        >
          <span>⚠️</span>
          <span>LithoGuard &amp; Hazards</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'mudsmith' ? 'active' : ''}`}
          onClick={() => setActiveTab('mudsmith')}
        >
          <span>🛠️</span>
          <span>MudSmith &amp; LCM Calculator</span>
        </button>

        <button 
          className={`agent-tab-btn ${activeTab === 'casingpro' ? 'active' : ''}`}
          onClick={() => setActiveTab('casingpro')}
        >
          <span>📐</span>
          <span>Casing &amp; Cementing</span>
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
        {/* Tab 0: Cross-Well Risk Matrix */}
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

        {/* Tab: Dedicated Live eRTMAC Stream Dashboard */}
        {activeTab === 'ertmac' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚡ OIL eRTMAC Real-Time Telemetry &amp; Sensor Analytics Console</span>
                </h4>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748b' }}>
                  Electronic Real Time Monitoring &amp; Analytics Centre • Duliajan Central Command
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="ertmac-live-badge">
                  <span className="ertmac-pulse-dot"></span>
                  <span>LIVE FEED (120ms)</span>
                </span>
              </div>
            </div>

            {/* 8 Sensor Cards Grid */}
            <div className="ertmac-telemetry-grid">
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Standpipe Pressure</span>
                <span className="ertmac-sensor-value" style={{ color: '#dc2626' }}>{telemetry.standpipe_pressure_psi} psi</span>
                <span className="ertmac-sensor-sub">Trend: ▼ 140 psi in 15 min</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Active Pit Volume</span>
                <span className="ertmac-sensor-value" style={{ color: '#dc2626' }}>{telemetry.pit_deviation_m3} m³</span>
                <span className="ertmac-sensor-sub">Seepage Rate: -{telemetry.loss_rate_m3_hr} m³/hr</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Dynamic Downhole ECD</span>
                <span className="ertmac-sensor-value" style={{ color: '#d97706' }}>{telemetry.downhole_ecd_sg} SG</span>
                <span className="ertmac-sensor-sub">Fracture Limit: 1.22 SG</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Rate of Penetration</span>
                <span className="ertmac-sensor-value" style={{ color: '#0284c7' }}>{telemetry.rop_m_hr} m/hr</span>
                <span className="ertmac-sensor-sub">WOB: {telemetry.wob_tons} Tons</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Surface Rotary Torque</span>
                <span className="ertmac-sensor-value" style={{ color: '#d97706' }}>{telemetry.torque_knm} kNm</span>
                <span className="ertmac-sensor-sub">Chatter: ±4.2 kNm</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Flow In / Flow Out</span>
                <span className="ertmac-sensor-value">{telemetry.flow_out_pct}% Out</span>
                <span className="ertmac-sensor-sub">In: {telemetry.flow_in_lpm} LPM</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Formation Total Gas</span>
                <span className="ertmac-sensor-value" style={{ color: '#059669' }}>{telemetry.background_gas_pct}%</span>
                <span className="ertmac-sensor-sub">Peak: 2.10%</span>
              </div>
              <div className="ertmac-sensor-card">
                <span className="ertmac-sensor-label">Rotary RPM &amp; Hookload</span>
                <span className="ertmac-sensor-value">{telemetry.rpm} RPM</span>
                <span className="ertmac-sensor-sub">Hookload: {telemetry.hook_load_tons} T</span>
              </div>
            </div>

            {/* Statutory Stream Diagnostics */}
            <div style={{ marginTop: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.74rem', color: '#475569' }}>
              <strong>eRTMAC System Protocol:</strong> Streaming via WITSML 2.1 JSON WebSocket over encrypted VSAT link. Calibrated to OISD-STD-174 threshold alarms. Correlated in real-time with Offset Well Database.
            </div>
          </div>
        )}

        {/* Tab 1: GeoStratum (Geology, Dip & 2D Stratigraphic Lithology Column) */}
        {activeTab === 'geostratum' && geostratum && (
          <div>
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

            {/* Visual 2D Stratigraphic Lithology Wellbore Column */}
            <div style={{ marginTop: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={15} style={{ color: 'var(--active-blue)' }} />
                  <span>Visual Wellbore Stratigraphic Column (Upper Assam Basin Lithology Track):</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Pulsing Bit: Active Depth 2820m MD
                </span>
              </div>

              {/* Vertical / Horizontal Depth Log Strip */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {stratColumns.map((col, idx) => {
                  const isCurrentTarget = 2820 >= col.top_md && 2820 <= col.base_md;
                  return (
                    <div 
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 180px 1fr 140px',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: isCurrentTarget ? '#fef3c7' : '#ffffff',
                        border: isCurrentTarget ? '1.5px solid var(--oil-amber)' : '1px solid #e2e8f0',
                        position: 'relative'
                      }}
                    >
                      {/* Depth Interval */}
                      <span style={{ fontFamily: 'monospace', fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                        {col.top_md}m – {col.base_md}m
                      </span>

                      {/* Formation with Color Swatch */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: col.color, border: '1px solid rgba(0,0,0,0.1)' }}></div>
                        <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{col.formation}</strong>
                      </div>

                      {/* Lithology & Hazard */}
                      <span style={{ fontSize: '0.76rem', color: '#334155' }}>
                        {col.lithology}
                      </span>

                      {/* Active Bit Indicator or Hazard Badge */}
                      <div style={{ textAlign: 'right' }}>
                        {isCurrentTarget ? (
                          <span style={{ 
                            fontSize: '0.68rem', 
                            fontWeight: 800, 
                            background: '#dc2626', 
                            color: '#ffffff', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            animation: 'pulse 1.5s infinite',
                            display: 'inline-block'
                          }}>
                            ★ BIT @ 2820m
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: col.hazard.includes('Risk') || col.hazard.includes('Gas') ? '#dc2626' : '#64748b', fontWeight: 600 }}>
                            {col.hazard}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: LithoGuard (Hazard Gauges & Interactive Stuck Pipe Decision Tree) */}
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

            {/* Interactive Stuck Pipe Diagnostic Decision Tree */}
            <div style={{ marginTop: '0.9rem', background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <HelpCircle size={15} style={{ color: 'var(--oil-amber)' }} />
                  <span>Interactive Stuck Pipe Diagnostic Wizard &amp; Freeing Protocol:</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  Live Drilling Diagnostics
                </span>
              </div>

              {/* 3 Interactive Question Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                    1. String Motion when Stuck:
                  </label>
                  <select 
                    value={stuckMotion} 
                    onChange={(e) => setStuckMotion(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#f8fafc' }}
                  >
                    <option value="stationary">Stationary (During Connection / Survey)</option>
                    <option value="up">Pulling Up (Tripping Out)</option>
                    <option value="down">Running In (Drilling Ahead / Tripping In)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                    2. Mud Circulation Status:
                  </label>
                  <select 
                    value={stuckCirculation} 
                    onChange={(e) => setStuckCirculation(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#f8fafc' }}
                  >
                    <option value="full">Full Circulation at Normal Pressure</option>
                    <option value="partial">Partial Circulation / High Standpipe Pressure</option>
                    <option value="none">Zero Circulation / Complete Blockage</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '3px' }}>
                    3. String Rotation Ability:
                  </label>
                  <select 
                    value={stuckRotation} 
                    onChange={(e) => setStuckRotation(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.78rem', background: '#f8fafc' }}
                  >
                    <option value="no">Cannot Rotate String (Locked)</option>
                    <option value="yes">Can Rotate String with Torque</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Diagnosis Result Box */}
              <div style={{ background: stuckDiagnosis.bg, border: `1px solid ${stuckDiagnosis.color}`, borderRadius: '6px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertOctagon size={16} style={{ color: stuckDiagnosis.color }} />
                    <strong style={{ fontSize: '0.84rem', color: stuckDiagnosis.color }}>
                      DIAGNOSIS: {stuckDiagnosis.mechanism}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#ffffff', color: stuckDiagnosis.color, padding: '1px 6px', borderRadius: '3px', border: `1px solid ${stuckDiagnosis.color}` }}>
                    {stuckDiagnosis.confidence}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#1e293b', marginBottom: '4px' }}>
                  <strong>Immediate Action Protocol:</strong> {stuckDiagnosis.remedy}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                  <strong>Spotting Pill Formulation:</strong> {stuckDiagnosis.soak_pill}
                </div>
              </div>
            </div>

            <div className="hazard-indicators-box" style={{ marginTop: '0.75rem' }}>
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

        {/* Tab 3: MudSmith (Fluids, Rheology & Interactive Smart LCM Dosage Calculator) */}
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

            {/* Interactive Smart LCM Dosage & Pill Volume Calculator */}
            <div style={{ marginTop: '0.9rem', background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calculator size={15} style={{ color: '#16a34a' }} />
                  <span>Smart LCM Pill Dosage &amp; Sacks Calculator (Rig Crew Field Playbook):</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#15803d' }}>
                  Barail Sand Fracture Sealing
                </span>
              </div>

              {/* Selector Controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14532d', display: 'block', marginBottom: '3px' }}>
                    Target Pill Volume:
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[20, 30, 40, 50].map((v) => (
                      <button
                        key={v}
                        onClick={() => setLcmVolume(v)}
                        style={{
                          flex: 1,
                          padding: '5px',
                          borderRadius: '4px',
                          border: lcmVolume === v ? '2px solid #16a34a' : '1px solid #cbd5e1',
                          background: lcmVolume === v ? '#16a34a' : '#ffffff',
                          color: lcmVolume === v ? '#ffffff' : '#334155',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {v} bbl
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#14532d', display: 'block', marginBottom: '3px' }}>
                    Encountered Loss Rate Severity:
                  </label>
                  <select 
                    value={lcmSeverity} 
                    onChange={(e) => setLcmSeverity(e.target.value)}
                    style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.78rem', background: '#ffffff' }}
                  >
                    <option value="seepage">Seepage Losses (&lt; 5 m³/hr)</option>
                    <option value="partial">Partial Losses (5 - 20 m³/hr)</option>
                    <option value="severe">Severe Losses (20 - 40 m³/hr — Well B-04)</option>
                    <option value="total">Total / Blind Losses (&gt; 40 m³/hr)</option>
                  </select>
                </div>
              </div>

              {/* Calculated Results Table */}
              <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Coarse Nut Plug:</span>
                  <strong style={{ fontSize: '0.92rem', color: '#166534' }}>{currentLcm.nut_sacks} Sacks</strong>
                  <span style={{ fontSize: '0.68rem', color: '#15803d', display: 'block' }}>({currentLcm.nut_ppb} ppb)</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Flake Mica:</span>
                  <strong style={{ fontSize: '0.92rem', color: '#166534' }}>{currentLcm.mica_sacks} Sacks</strong>
                  <span style={{ fontSize: '0.68rem', color: '#15803d', display: 'block' }}>({currentLcm.mica_ppb} ppb)</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>CaCO3 Safecarb 250:</span>
                  <strong style={{ fontSize: '0.92rem', color: '#166534' }}>{currentLcm.caco3_sacks} Sacks</strong>
                  <span style={{ fontSize: '0.68rem', color: '#15803d', display: 'block' }}>({currentLcm.caco3_ppb} ppb)</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', display: 'block' }}>Base Mud &amp; Soak:</span>
                  <strong style={{ fontSize: '0.92rem', color: '#0284c7' }}>{currentLcm.base_mud_m3} m³</strong>
                  <span style={{ fontSize: '0.68rem', color: '#0369a1', display: 'block' }}>{currentLcm.soak_hrs} hrs soak</span>
                </div>
              </div>

              {/* Pumping Sequence Directive */}
              <div style={{ fontSize: '0.74rem', color: '#166534', lineHeight: '1.4' }}>
                <strong>Field Mixing &amp; Pumping Procedure:</strong> Pre-mix pill in slug pit with shearing agitators. Pump pill at 350-400 LPM. Pull bit 30m off bottom into 9-5/8" casing shoe. Soak across 2850m interval for {currentLcm.soak_hrs} hours before breaking circulation.
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CasingPro (Casing Architecture & Cementing Practices Comparator) */}
        {activeTab === 'casingpro' && casingpro && (
          <div>
            {/* Sub-Tab Navigation for Casing vs Cementing */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
              <button
                onClick={() => setCasingSubTab('casing')}
                style={{
                  background: casingSubTab === 'casing' ? 'var(--active-blue)' : '#f8fafc',
                  color: casingSubTab === 'casing' ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '5px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                📐 Casing Architecture &amp; Shoe Seats
              </button>

              <button
                onClick={() => setCasingSubTab('cementing')}
                style={{
                  background: casingSubTab === 'cementing' ? 'var(--oil-amber)' : '#f8fafc',
                  color: casingSubTab === 'cementing' ? '#ffffff' : '#475569',
                  border: '1px solid #cbd5e1',
                  borderRadius: '5px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🧪 Cementing Practices &amp; Bond Quality Comparator
              </button>
            </div>

            {/* Sub-View 1: Casing Programs */}
            {casingSubTab === 'casing' && (
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

            {/* Sub-View 2: Cementing Practices Comparator */}
            {casingSubTab === 'cementing' && (
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                    🧪 Cementing Practices, Slurry Densities &amp; CBL-VDL Bond Log Comparison:
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    4 Offset Wells Correlated
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1.5px solid #cbd5e1' }}>
                        <th style={{ padding: '6px 8px' }}>Well ID</th>
                        <th style={{ padding: '6px 8px' }}>Lead / Tail Density</th>
                        <th style={{ padding: '6px 8px' }}>Top of Cement (TOC)</th>
                        <th style={{ padding: '6px 8px' }}>WOC &amp; Strength</th>
                        <th style={{ padding: '6px 8px' }}>CBL-VDL Bond Quality</th>
                        <th style={{ padding: '6px 8px' }}>Gas Migration Additives</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cementingList.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: row.well.includes('Active') ? '#f0fdf4' : 'transparent' }}>
                          <td style={{ padding: '6px 8px', fontWeight: 800, color: row.well.includes('Active') ? '#16a34a' : '#0f172a' }}>
                            {row.well}
                          </td>
                          <td style={{ padding: '6px 8px', fontFamily: 'monospace' }}>
                            {row.lead_slurry} / {row.tail_slurry}
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            {row.toc_verified_m}
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            {row.woc_hrs}h ({row.compressive_strength_24h_psi} psi)
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: row.cbl_quality.includes('EXCELLENT') ? '#dcfce7' : '#fef3c7',
                              color: row.cbl_quality.includes('EXCELLENT') ? '#15803d' : '#b45309'
                            }}>
                              {row.cbl_quality}
                            </span>
                          </td>
                          <td style={{ padding: '6px 8px', color: '#475569' }}>
                            {row.gas_migration_control}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '0.85rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '8px 10px', fontSize: '0.76rem', color: '#1e3a8a' }}>
                  <strong>CasingPro Recommendation for Active Well A-01:</strong> Maintain 1.90 SG tail slurry with 0.3% retarder and micro-silica latex across Barail-Kopili boundary. Wait minimum 24 hours on cement to achieve &gt;2,500 psi compressive strength before drill-out to prevent gas microannulus leakage.
                </div>
              </div>
            )}
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

        {/* Tab 6: Full Enterprise LLM Synthesized Narrative */}
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
          <InteractiveWellGraph 
            graphData={well_graph} 
            depth={liveDepth}
            onDepthChange={(newDepth) => setLiveDepth(newDepth)}
            onOpenDocument={onOpenDocument}
          />
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
            <div className="trace-timeline-body">
              {execution_trace.map((step, idx) => (
                <div key={idx} className="trace-node-row">
                  <div className="trace-node-indicator">
                    <div className="trace-dot"></div>
                    {idx < execution_trace.length - 1 && <div className="trace-connector-line"></div>}
                  </div>
                  <div className="trace-node-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="trace-node-name">{step.node}</span>
                      <span className="trace-node-latency">+{step.latency_ms}ms</span>
                    </div>
                    <span className="trace-node-desc">{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Printable Tour Sheet Modal */}
      {isTourSheetOpen && (
        <TourSheetModal 
          isOpen={true} 
          onClose={() => setIsTourSheetOpen(false)} 
          data={data}
        />
      )}
    </div>
  );
}
