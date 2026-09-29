import React, { useState } from 'react';
import { Cpu, X, Zap, Layers, GitBranch, ArrowRight, ShieldCheck, CheckCircle2, Database, Sliders } from 'lucide-react';

export default function ArchitectureModal({ isOpen = true, onClose }) {
  if (!isOpen) return null;

  const [selectedNode, setSelectedNode] = useState("geostratum");

  const nodeDetails = {
    docustratum: {
      title: "Node 1: DocuStratumEngine (Document Ingestion & OCR)",
      role: "Statutory Memory Extraction",
      latency: "14ms",
      inputs: "Scanned Well Completion Reports (WCR), Daily Drilling Reports (DDR), Mud Logs (PDF/TIFF).",
      logic: "Extracts formation entry depths, lost circulation intervals, BHA jarring events, mud density histories, and casing shoe seats. Builds structured vector embeddings with page citations.",
      outputs: "Standardized Offset Knowledge Graph (B-04, C-12, D-08, E-02, F-15)."
    },
    geostratum: {
      title: "Node 2: GeoStratumNode (Stratigraphy & Dip Correlation)",
      role: "Geological Horizon Look-Ahead",
      latency: "18ms",
      inputs: "Active Well MD (2740m), TVD (2690m), surface coordinates (27.285°N, 95.321°E), offset well tops.",
      logic: "Applies 3D structural dip alignment (+35m up-dip towards NE relative to Well B-04). Projects remaining distance to weak Barail Arenaceous member (top at 2815m MD).",
      outputs: "Formation boundary prognosis, lithology transition markers, TVD look-ahead vector."
    },
    lithoguard: {
      title: "Node 3: LithoGuardNode (Predictive Hazard & Incident Modeling)",
      role: "Multi-Hazard Risk Engine",
      latency: "22ms",
      inputs: "Historical offset incidents, fracture gradients, pore pressure curves, pit volume thresholds.",
      logic: "Calculates predictive probabilities: 88% Mud Loss Risk at 2850m (Well B-04 corridor), 45% Differential Sticking Risk (Well C-12), and gas kick overpressure warning (Well D-08).",
      outputs: "Dominant hazard classification, early warning indicator thresholds (ROP breaks, torque chatter, pit delta)."
    },
    mudsmith: {
      title: "Node 4: MudSmithNode (Drilling Fluids & Thixotropic LCM Engineering)",
      role: "Rheology & Loss Circulation Design",
      latency: "16ms",
      inputs: "Active mud weight (1.17 SG), fracture gradient (1.22 SG), pore pressure (1.14 SG), flow rates.",
      logic: "Determines safe mud weight window (1.15-1.17 SG) and maximum ECD ceiling (<1.18 SG). Formulates field-proven 40 bbl heavy thixotropic LCM standby recipe.",
      outputs: "Exact LCM pill recipe (25 ppb Nut Plug, 20 ppb Mica, 15 ppb Safecarb 250), pump rate limit (1250 LPM)."
    },
    casingpro: {
      title: "Node 5: CasingProNode (Well Architecture & Casing/Cementing)",
      role: "Wellbore Integrity & Barrier Architecture",
      latency: "15ms",
      inputs: "Active casing program (20\", 13-3/8\", 9-5/8\" @ 2750m), offset shoe depths.",
      logic: "Benchmarks intermediate shoe seating against nearby wells; validates open hole exposure (65m to Barail top); designs gas-tight micro-silica cement slurry (1.58 SG).",
      outputs: "Shoe seat comparison matrix, casing wear limits, cement bond standards (OISD-174)."
    },
    nptsentry: {
      title: "Node 6: NptSentryNode (Rig Economics & Operational NPT)",
      role: "Financial Risk & Look-Ahead Sentry",
      latency: "12ms",
      inputs: "Rig-14 day rate (₹56 Lakhs/day), offset NPT logs (16.5h B-04, 24h C-12, 31h D-08).",
      logic: "Quantifies avoided NPT (16.5 hours) and direct operational cost savings (₹38.5 Lakhs). Generates actionable 4-step look-ahead checklist for driller & mud engineer.",
      outputs: "NPT avoidance ledger, monetary savings metric, pre-spud look-ahead checklist."
    },
    nemotron: {
      title: "Node 7: LLMSynthesisNode (LLM)",
      role: "Deterministic AI Reasoning Engine",
      latency: "340ms",
      inputs: "Multi-agent structured state, institutional memory, system prompt with negative constraints.",
      logic: "Executes deep petroleum engineering reasoning. Emits high-impact operational narrative, grounded strictly on real offset data with zero text-based LLM disclaimers.",
      outputs: "Executive Drilling Verdict, Cross-Well Collision Matrix, Official WCR Citations."
    }
  };

  const activeNode = nodeDetails[selectedNode] || nodeDetails["geostratum"];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '920px', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box" style={{ background: '#f5f3ff', borderColor: '#ddd6fe' }}>
              <Zap size={20} style={{ color: '#7c3aed' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                ⚡ Multi-Agent StateGraph Architecture (7 Nodes, Synchronized Swarm)
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.76rem' }}>
                Oil India Limited NWIS Decision-Support Engine • Powered by Enterprise Drilling LLM (LLM)
              </p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Visual Interactive SVG Architecture Diagram */}
        <div style={{ background: '#0f172a', borderRadius: '10px', padding: '16px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span>
              <span>Click any node in the diagram below to inspect inputs, logic, and output artifacts</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: '#10b981', background: '#064e3b', padding: '2px 8px', borderRadius: '9999px', fontFamily: 'monospace' }}>
              Deterministic StateGraph • 0 LLM Hallucination
            </span>
          </div>

          <svg viewBox="0 0 820 230" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <marker id="arr-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8"/>
              </marker>
              <marker id="arr-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#fbbf24"/>
              </marker>
              <marker id="arr-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#34d399"/>
              </marker>
              <marker id="arr-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#c084fc"/>
              </marker>
            </defs>

            {/* Input Node */}
            <g style={{ cursor: 'pointer' }}>
              <rect x="10" y="90" width="95" height="42" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
              <text x="57" y="108" fill="#e2e8f0" fontSize="10" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Rig Query</text>
              <text x="57" y="122" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">eRTMAC 2740m</text>
            </g>

            {/* Path to DocuStratum */}
            <path d="M 105 111 L 135 111" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr-blue)"/>

            {/* Node 1: DocuStratum */}
            <g onClick={() => setSelectedNode("docustratum")} style={{ cursor: 'pointer' }}>
              <rect x="135" y="85" width="125" height="52" rx="8" fill={selectedNode === "docustratum" ? "#1e3a8a" : "#1e293b"} stroke="#38bdf8" strokeWidth={selectedNode === "docustratum" ? 2.5 : 1.5}/>
              <text x="197" y="105" fill="#f0f9ff" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">1. DocuStratum</text>
              <text x="197" y="121" fill="#7dd3fc" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">WCR / DDR OCR (14ms)</text>
            </g>

            {/* Fan-Out Paths to 5 Agents */}
            <path d="M 260 111 C 285 111, 280 28, 305 28" stroke="#34d399" strokeWidth="1.5" fill="none" markerEnd="url(#arr-emerald)"/>
            <path d="M 260 111 C 285 111, 280 70, 305 70" stroke="#f87171" strokeWidth="1.5" fill="none" markerEnd="url(#arr-emerald)"/>
            <path d="M 260 111 C 285 111, 280 111, 305 111" stroke="#fbbf24" strokeWidth="1.5" fill="none" markerEnd="url(#arr-emerald)"/>
            <path d="M 260 111 C 285 111, 280 152, 305 152" stroke="#38bdf8" strokeWidth="1.5" fill="none" markerEnd="url(#arr-emerald)"/>
            <path d="M 260 111 C 285 111, 280 194, 305 194" stroke="#c084fc" strokeWidth="1.5" fill="none" markerEnd="url(#arr-emerald)"/>

            {/* 5 Parallel Agents */}
            {/* Agent 1: GeoStratum */}
            <g onClick={() => setSelectedNode("geostratum")} style={{ cursor: 'pointer' }}>
              <rect x="305" y="10" width="165" height="36" rx="6" fill={selectedNode === "geostratum" ? "#064e3b" : "#0f172a"} stroke="#34d399" strokeWidth={selectedNode === "geostratum" ? 2.5 : 1.5}/>
              <text x="387" y="27" fill="#d1fae5" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">🌍 2. GeoStratum (+35m Dip)</text>
              <text x="387" y="39" fill="#a7f3d0" fontSize="8" textAnchor="middle" fontFamily="monospace">Barail Top @ 2815m (18ms)</text>
            </g>

            {/* Agent 2: LithoGuard */}
            <g onClick={() => setSelectedNode("lithoguard")} style={{ cursor: 'pointer' }}>
              <rect x="305" y="52" width="165" height="36" rx="6" fill={selectedNode === "lithoguard" ? "#7f1d1d" : "#0f172a"} stroke="#f87171" strokeWidth={selectedNode === "lithoguard" ? 2.5 : 1.5}/>
              <text x="387" y="69" fill="#fee2e2" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">⚠️ 3. LithoGuard (88% Loss)</text>
              <text x="387" y="81" fill="#fca5a5" fontSize="8" textAnchor="middle" fontFamily="monospace">Well B-04 Corridor (22ms)</text>
            </g>

            {/* Agent 3: MudSmith */}
            <g onClick={() => setSelectedNode("mudsmith")} style={{ cursor: 'pointer' }}>
              <rect x="305" y="93" width="165" height="36" rx="6" fill={selectedNode === "mudsmith" ? "#78350f" : "#0f172a"} stroke="#fbbf24" strokeWidth={selectedNode === "mudsmith" ? 2.5 : 1.5}/>
              <text x="387" y="110" fill="#fef3c7" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">🛠️ 4. MudSmith (40 bbl LCM)</text>
              <text x="387" y="122" fill="#fde68a" fontSize="8" textAnchor="middle" fontFamily="monospace">1.15-1.17 SG Mud (16ms)</text>
            </g>

            {/* Agent 4: CasingPro */}
            <g onClick={() => setSelectedNode("casingpro")} style={{ cursor: 'pointer' }}>
              <rect x="305" y="134" width="165" height="36" rx="6" fill={selectedNode === "casingpro" ? "#075985" : "#0f172a"} stroke="#38bdf8" strokeWidth={selectedNode === "casingpro" ? 2.5 : 1.5}/>
              <text x="387" y="151" fill="#e0f2fe" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">📐 5. CasingPro (Shoe Depth)</text>
              <text x="387" y="163" fill="#bae6fd" fontSize="8" textAnchor="middle" fontFamily="monospace">9-5/8" Shoe @ 2750m (15ms)</text>
            </g>

            {/* Agent 5: NptSentry */}
            <g onClick={() => setSelectedNode("nptsentry")} style={{ cursor: 'pointer' }}>
              <rect x="305" y="176" width="165" height="36" rx="6" fill={selectedNode === "nptsentry" ? "#581c87" : "#0f172a"} stroke="#c084fc" strokeWidth={selectedNode === "nptsentry" ? 2.5 : 1.5}/>
              <text x="387" y="193" fill="#f3e8ff" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">⏱️ 6. NptSentry (₹38.5L Saved)</text>
              <text x="387" y="205" fill="#e9d5ff" fontSize="8" textAnchor="middle" fontFamily="monospace">16.5h NPT Avoided (12ms)</text>
            </g>

            {/* Fan-In Paths to Nemotron Synthesis */}
            <path d="M 470 28 C 495 28, 490 111, 515 111" stroke="#34d399" strokeWidth="1.5" fill="none"/>
            <path d="M 470 70 C 495 70, 490 111, 515 111" stroke="#f87171" strokeWidth="1.5" fill="none"/>
            <path d="M 470 111 L 515 111" stroke="#fbbf24" strokeWidth="1.5"/>
            <path d="M 470 152 C 495 152, 490 111, 515 111" stroke="#38bdf8" strokeWidth="1.5" fill="none"/>
            <path d="M 470 194 C 495 194, 490 111, 515 111" stroke="#c084fc" strokeWidth="1.5" fill="none" markerEnd="url(#arr-purple)"/>

            {/* Node 7: LLM Synthesis */}
            <g onClick={() => setSelectedNode("nemotron")} style={{ cursor: 'pointer' }}>
              <rect x="525" y="85" width="145" height="52" rx="8" fill={selectedNode === "nemotron" ? "#4c1d95" : "#1e1b4b"} stroke="#a855f7" strokeWidth={selectedNode === "nemotron" ? 2.5 : 1.5}/>
              <text x="597" y="105" fill="#faf5ff" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">7. Synthesis (LLM)</text>
              <text x="597" y="121" fill="#d8b4fe" fontSize="8.5" textAnchor="middle" fontFamily="sans-serif">Enterprise LLM (340ms)</text>
            </g>

            {/* Path to Output */}
            <path d="M 670 111 L 695 111" stroke="#a855f7" strokeWidth="2" markerEnd="url(#arr-purple)"/>

            {/* Output Node */}
            <g style={{ cursor: 'pointer' }}>
              <rect x="705" y="78" width="105" height="66" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5"/>
              <text x="757" y="96" fill="#a7f3d0" fontSize="9.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Output Horizon</text>
              <text x="757" y="110" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontFamily="sans-serif">• Exec Verdict</text>
              <text x="757" y="123" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontFamily="sans-serif">• Collision Matrix</text>
              <text x="757" y="136" fill="#e2e8f0" fontSize="8" textAnchor="middle" fontFamily="sans-serif">• 2D Well Graph</text>
            </g>
          </svg>
        </div>

        {/* Selected Node Technical Inspection Card */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 14px', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {activeNode.title}
              </span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#eff6ff', color: 'var(--active-blue)', padding: '2px 7px', borderRadius: '4px', border: '1px solid #bfdbfe' }}>
                {activeNode.role}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '9999px', border: '1px solid #a7f3d0' }}>
              Latency: {activeNode.latency}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Inputs / Telemetry:
              </span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: '1.4' }}>
                {activeNode.inputs}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Execution Logic &amp; Constraints:
              </span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: '1.4' }}>
                {activeNode.logic}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Emitted Artifacts:
              </span>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: '1.4' }}>
                {activeNode.outputs}
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Specifications Table */}
        <div style={{ marginTop: '0.5rem', background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px 10px', fontWeight: 700, width: '22%', background: '#f8fafc', color: 'var(--text-muted)' }}>Core Foundation Model</td>
                <td style={{ padding: '6px 10px', color: 'var(--text-body)', fontFamily: 'monospace' }}>Enterprise Drilling LLM (LLM)</td>
                <td style={{ padding: '6px 10px', fontWeight: 700, width: '20%', background: '#f8fafc', color: 'var(--text-muted)' }}>Spatial Geodesic Engine</td>
                <td style={{ padding: '6px 10px', color: 'var(--text-body)' }}>Haversine 5.0 km Radial Filter</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '6px 10px', fontWeight: 700, background: '#f8fafc', color: 'var(--text-muted)' }}>StateGraph Topology</td>
                <td style={{ padding: '6px 10px', color: 'var(--text-body)' }}>7 Synchronized Nodes, 10 Directed Edges</td>
                <td style={{ padding: '6px 10px', fontWeight: 700, background: '#f8fafc', color: 'var(--text-muted)' }}>Hallucination Defense</td>
                <td style={{ padding: '6px 10px', color: '#059669', fontWeight: 600 }}>Deterministic WCR Grounding + Zero System Limitation Filter</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            OIL India Limited • Problem Statement 26121 • Real-Time + Offset Memory Synergy
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Close Architecture
          </button>
        </div>
      </div>
    </div>
  );
}
