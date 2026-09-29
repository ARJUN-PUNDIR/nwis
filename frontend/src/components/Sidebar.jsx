import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Camera, 
  BookOpen, 
  Compass, 
  History, 
  Trash2,
  Activity, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function Sidebar({ 
  onNewChat, 
  onOpenGeoTag, 
  onOpenCaseStudies, 
  onOpenWellGraph, 
  chatHistory = [], 
  onSelectHistory, 
  onDeleteHistory,
  activeChatId 
}) {
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
        
        <div className="nav-item active" onClick={onNewChat} title="Start clean conversational rig inquiry">
          <MessageSquare size={16} style={{ color: 'var(--active-blue)' }} />
          <span>Rig AI Copilot</span>
        </div>

        <div className="nav-item" onClick={onOpenGeoTag} title="Upload photo or enter coordinates to resolve offset wells">
          <Camera size={16} style={{ color: 'var(--oil-amber)' }} />
          <span>Geo-Tag Site Inquiry</span>
        </div>

        <div className="nav-item" onClick={onOpenCaseStudies} title="Inspect verified historical mud loss, stuck pipe, and kick case studies">
          <BookOpen size={16} style={{ color: 'var(--swarm-purple)' }} />
          <span>Historical Case Studies</span>
        </div>

        <div className="nav-item" onClick={onOpenWellGraph} title="Explore interactive 2D hub-and-spoke wellbore network without firing queries">
          <Compass size={16} style={{ color: 'var(--alert-success)' }} />
          <span>Interactive Well Graph</span>
        </div>
      </div>

      {/* History Section */}
      <div className="sidebar-section" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', padding: '0 0.5rem' }}>
          <span className="sidebar-section-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <History size={13} />
            Consultation History
          </span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
            {chatHistory.length} saved
          </span>
        </div>

        <div className="history-list" style={{ overflowY: 'auto', flex: 1 }}>
          {chatHistory.length === 0 ? (
            <div style={{ padding: '0.75rem', fontSize: '0.76rem', color: 'var(--text-dim)', textAlign: 'center' }}>
              No previous consultations yet. Ask a question to save.
            </div>
          ) : (
            chatHistory.map((item) => (
              <div 
                key={item.id} 
                className={`history-item ${activeChatId === item.id ? 'active' : ''}`}
                onClick={() => onSelectHistory(item)}
                title={item.title}
                style={{ position: 'relative' }}
              >
                <MessageSquare size={13} style={{ flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {item.title}
                </span>

                {onDeleteHistory && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistory(item.id);
                    }}
                    className="history-delete-btn"
                    title="Delete saved consultation"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div className="model-dot"></div>
          <span>eRTMAC &amp; Nemotron-3</span>
        </div>
        <span style={{ fontSize: '0.68rem', fontFamily: 'monospace' }}>v3.5</span>
      </div>
    </aside>
  );
}
