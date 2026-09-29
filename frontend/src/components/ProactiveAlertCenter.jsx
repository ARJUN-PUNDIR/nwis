import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, ShieldAlert, FileText, DollarSign, Clock } from 'lucide-react';

export default function ProactiveAlertCenter({ sentinel, riskMatrix, telemetry }) {
  const s = sentinel || {};
  const alertLevel = s.alert_level || 'NOMINAL';
  const prescriptiveActions = s.prescriptive_actions || [];
  const citations = s.citations || [];

  return (
    <div className={`proactive-alert-box ${alertLevel}`}>
      <div className="alert-top">
        <span className={`alert-level-tag ${alertLevel}`}>
          {alertLevel === 'CRITICAL' ? <AlertOctagon size={15} /> : alertLevel === 'ADVISORY' ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
          {alertLevel === 'CRITICAL' ? 'CRITICAL OPERATIONAL HAZARD' : alertLevel === 'ADVISORY' ? 'LOOK-AHEAD PROACTIVE ADVISORY' : 'NOMINAL DRILLING STATUS'}
        </span>

        {s.preventable_npt_hours > 0 && (
          <div className="economic-impact-pill">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', fontSize: '0.8rem' }}>
              <Clock size={14} style={{ color: 'var(--alert-success)' }} />
              NPT Avoidance: <strong className="economic-highlight">{s.preventable_npt_hours} hrs</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', marginLeft: '1rem', fontSize: '0.8rem' }}>
              <DollarSign size={14} style={{ color: 'var(--oil-amber)' }} />
              Rig Cost Saved: <strong className="economic-highlight" style={{ color: 'var(--oil-amber)' }}>₹{(s.estimated_cost_savings_inr / 100000).toFixed(1)} Lakhs</strong>
            </span>
          </div>
        )}
      </div>

      <div className="alert-headline">{s.headline}</div>
      <p className="alert-desc">{s.description}</p>

      {/* Prescriptive Checklist */}
      {prescriptiveActions.length > 0 && (
        <div className="prescriptive-actions-card">
          <div className="prescriptive-title">
            <ShieldAlert size={15} />
            AI Prescriptive Checklist (Derived from Historical Offset Solutions)
          </div>
          <ul className="action-list">
            {prescriptiveActions.map((action, idx) => (
              <li key={idx} className="action-item">
                <span className="action-bullet">▶</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations Footer */}
      {citations.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
            <FileText size={13} /> Institutional Source Citations:
          </span>
          {citations.map((cite, idx) => (
            <span key={idx} className="chat-citation-pill">
              {cite}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
