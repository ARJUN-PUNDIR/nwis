import React from 'react';
import { Cpu, CheckCircle, AlertCircle, Bot, Database, Compass, ShieldCheck } from 'lucide-react';

export default function AgentSwarmMonitor({ agentTrace }) {
  const trace = agentTrace || [];

  const getAgentIcon = (agentId) => {
    if (agentId.includes('DocuStratum')) return <Database size={16} style={{ color: 'var(--active-blue)' }} />;
    if (agentId.includes('GeoCorrelator')) return <Compass size={16} style={{ color: 'var(--alert-success)' }} />;
    if (agentId.includes('LithoGuard')) return <ShieldCheck size={16} style={{ color: 'var(--oil-amber)' }} />;
    if (agentId.includes('RigSentinel')) return <Cpu size={16} style={{ color: 'var(--alert-danger)' }} />;
    return <Bot size={16} style={{ color: 'var(--swarm-purple)' }} />;
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <Cpu size={19} style={{ color: 'var(--swarm-purple)' }} />
          Multi-Agent Swarm Autonomous Consensus (5 Independent Agents)
        </div>
        <div className="panel-subtitle">Orchestrator: RigCommander • Latency: &lt; 24ms</div>
      </div>

      <div className="agent-swarm-grid">
        {trace.map((item, idx) => (
          <div key={idx} className="agent-mini-card">
            <div className="agent-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                {getAgentIcon(item.agent_id)}
                <span className="agent-name">{item.agent_id}</span>
              </div>
              <span className={`agent-state-pill ${item.status}`}>
                {item.status}
              </span>
            </div>
            <p className="agent-summary">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
