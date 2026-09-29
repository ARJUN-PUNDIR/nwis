import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Camera, 
  BookOpen, 
  Compass, 
  History, 
  Activity, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function Sidebar({ 
  onNewChat, 
  onOpenGeoTag, 
  onOpenCaseStudies, 
  onTriggerWellGraph, 
  chatHistory, 
  onSelectHistory, 
  activeChatId 
}) {
  const defaultHistory = [
    { id: "h1", title: "Barail Mud Loss Mitigation @ 2820m", depth: "2820m" },
    { id: "h2", title: "Well B-04 40 bbl LCM Formulation", depth: "2850m" },
    { id: "h3", title: "Well C-12 Differential Sticking Soak", depth: "2910m" },
    { id: "h4", title: "Kopili Gas Kick Driller's Method Kill", depth: "3000m" },
    { id: "h5", title: "Nahorkatiya Sector B Casing Shoes", depth: "2750m" }
  ];

  const historyItems = chatHistory && chatHistory.length > 0 ? chatHistory : defaultHistory;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-box">OIL</div>
          <div>
            <div className="brand-title">NWIS Assistant</div>
            <div className="brand-sub">Oil India Limited</div>
          </div>
        </div>
      </div>

      {/* New Consultation Button */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <Plus size={16} />
        New Consultation
      </button>

      {/* Core Tools Section */}
      <div className="sidebar-section">
        <span className="sidebar-section-title">Drilling Intelligence Tools</span>
        
        <div className="nav-item active" onClick={onNewChat}>
          <MessageSquare size={16} style={{ color: 'var(--active-blue)' }} />
          <span>Rig AI Copilot</span>
        </div>

        <div className="nav-item" onClick={onOpenGeoTag}>
          <Camera size={16} style={{ color: 'var(--oil-amber)' }} />
          <span>Geo-Tag Site Inquiry</span>
        </div>

        <div className="nav-item" onClick={onOpenCaseStudies}>
          <BookOpen size={16} style={{ color: 'var(--swarm-purple)' }} />
          <span>Historical Case Studies</span>
        </div>

        <div className="nav-item" onClick={onTriggerWellGraph}>
          <Compass size={16} style={{ color: 'var(--alert-success)' }} />
          <span>Interactive Well Graph</span>
        </div>
      </div>

      {/* History Section */}
      <div className="sidebar-section" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <span className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <History size={13} />
          Consultation History
        </span>

        <div className="history-list">
          {historyItems.map((item) => (
            <div 
              key={item.id} 
              className={`history-item ${activeChatId === item.id ? 'active' : ''}`}
              onClick={() => onSelectHistory(item)}
              title={item.title}
            >
              <MessageSquare size={13} style={{ flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="model-dot"></div>
          <span>eRTMAC & Nemotron-3</span>
        </div>
        <span style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>v3.0</span>
      </div>
    </aside>
  );
}
