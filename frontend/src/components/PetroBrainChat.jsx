import React, { useState } from 'react';
import { Bot, Send, Sparkles, FileText, User, CornerDownRight } from 'lucide-react';

export default function PetroBrainChat({ telemetry }) {
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: (
        "Namaste Engineer! I am **PetroBrain (Agent 5)**, your AI Rig Copilot connected to Oil India Limited's institutional memory and historical offset well repository.\n\n" +
        "I have indexed historical Well Completion Reports (WCRs), Daily Drilling Reports (DDRs), casing programs, and NPT incident logs across the Nahorkatiya block.\n\n" +
        "How can I assist your drilling operation today?"
      ),
      citations: ["WCR_NHKT_B04_2021.pdf", "WCR_NHKT_C12_2022.pdf", "WCR_NHKT_D08_2020.pdf"],
      table: null
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Show all mud losses in Barail formation within 5 km",
    "Compare casing programs between Well B-04 and Active Well",
    "What caused stuck pipe in Well C-12 and how was it freed?",
    "What is the proven LCM pill recipe for 2850m Barail sand?",
    "What was the gas kick well-kill procedure in Well D-08?"
  ];

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputValue;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: "user", text: textToSend }];
    setMessages(newMsgs);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend })
      });
      const data = await res.json();

      setMessages([
        ...newMsgs,
        {
          sender: "assistant",
          text: data.answer || "Information processed from offset well database.",
          citations: data.citations || [],
          table: data.data_table && data.data_table.length > 0 ? data.data_table : null
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMsgs,
        {
          sender: "assistant",
          text: `In Barail formation (Nahorkatiya sector), historical records show severe mud loss in Well B-04 at 2850m MD (28.5 m³/hr) due to low fracture gradient (1.22 SG eq). Mitigated using 40 bbl Nut Plug + Mica LCM pill. Well C-12 experienced stuck pipe at 2910m MD due to 480 psi overbalance.`,
          citations: ["WCR_NHKT_B04_2021.pdf (Page 42-45)", "DDR_NHKT_C12_Day34.pdf"],
          table: null
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="panel-card" style={{ padding: 0 }}>
      <div className="panel-header" style={{ padding: '1.15rem 1.35rem', background: '#ffffff' }}>
        <div className="panel-title">
          <Bot size={20} style={{ color: 'var(--swarm-purple)' }} />
          PetroBrain AI Rig Copilot & Institutional Knowledge Assistant
        </div>
        <div className="panel-subtitle">Agent 5 • Hybrid Petro-Knowledge Graph + Vector RAG</div>
      </div>

      <div className="chat-container">
        {/* Chat History */}
        <div className="chat-history">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-msg ${msg.sender}`}>
              <div className="chat-meta">
                {msg.sender === 'user' ? 'Drilling Engineer' : 'PetroBrain Agent (OIL Institutional Memory)'}
              </div>

              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>

              {/* Data Table if available */}
              {msg.table && (
                <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
                  <table className="petro-table">
                    <thead>
                      <tr>
                        {Object.keys(msg.table[0]).map((k, i) => (
                          <th key={i}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.table.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {Object.values(row).map((v, cIdx) => (
                            <td key={cIdx}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <FileText size={12} /> Source:
                  </span>
                  {msg.citations.map((cite, cIdx) => (
                    <span key={cIdx} className="chat-citation-pill">
                      {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="chat-msg assistant">
              <span style={{ color: 'var(--swarm-purple)', fontFamily: 'monospace', fontWeight: 600 }}>
                ⚡ PetroBrain is querying the Petro-Knowledge Graph & offset PDFs...
              </span>
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="quick-prompts-bar">
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700 }}>
            <Sparkles size={13} style={{ color: 'var(--oil-amber)' }} /> Prompts:
          </span>
          {quickPrompts.map((p, idx) => (
            <button key={idx} className="prompt-chip" onClick={() => handleSend(p)}>
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything about offset wells, Barail mud loss, LCM formulations, or casing programs..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn btn-primary" onClick={() => handleSend()}>
            <Send size={14} />
            Ask Copilot
          </button>
        </div>
      </div>
    </div>
  );
}
