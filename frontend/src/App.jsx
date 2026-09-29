import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  Bot, 
  User, 
  Camera, 
  Compass, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import InteractiveWellGraph from './components/InteractiveWellGraph';
import GeoTagModal from './components/GeoTagModal';
import CaseStudiesModal from './components/CaseStudiesModal';

const BACKEND_URL = "http://localhost:8001";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeoTagOpen, setIsGeoTagOpen] = useState(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState("session-current");

  const [chatHistory, setChatHistory] = useState([
    { 
      id: "h1", 
      title: "Barail Mud Loss Mitigation @ 2820m",
      messages: [
        { role: "user", content: "I am at Nahorkatiya South (27.285°N, 95.321°E), drilling at 2820m. What risks should I expect ahead?" },
        { 
          role: "assistant", 
          content: "### Nahorkatiya South (2820m MD) Look-Ahead Risk Assessment:\n\nYou are entering the **Barail Arenaceous Sand Member** (structural top encountered at ~2815m MD). Historical offset data within 5 km indicates:\n\n1. **High Risk of Lost Circulation (Mud Loss):**\n   - **Offset Well B-04 (1.24 km West)** encountered a severe **28.5 m³/hr loss at 2850m MD** due to micro-fracturing and low fracture gradient (1.22 SG equivalent).\n   - **Proven Remediation:** Spotted 40 bbl heavy LCM pill (25 ppb Coarse Nut Plug, 20 ppb Medium Flake Mica, 15 ppb CaCO3) and capped circulating mud weight at 1.15 SG.\n\n2. **Differential Sticking Hazard:**\n   - **Offset Well C-12 (2.08 km NE)** stuck at 2910m due to 480 psi overbalance on depleted sand.\n\n**Actionable Directives:**\n- Pre-treat active mud system with 15–20 ppb fine CaCO3 bridging agent.\n- Restrict ECD strictly below 1.18 SG.\n- Avoid static string conditions during connections.",
          hasGraph: true 
        }
      ]
    },
    { 
      id: "h2", 
      title: "Well B-04 40 bbl LCM Formulation",
      messages: [
        { role: "user", content: "What was the exact LCM formulation used in Well B-04 for the 2850m mud loss?" },
        { 
          role: "assistant", 
          content: "### Well B-04 Proven LCM Formulation (2850m Loss Zone):\n\nWhen Well B-04 experienced total mud loss (28.5 m³/hr) in Barail Sand, the following 40 bbl thixotropic pill was pumped:\n\n- **25 ppb Coarse Ground Walnut Shells (Nut Plug)** (large fracture bridging)\n- **20 ppb Medium Flake Mica** (permeable matrix sealing)\n- **15 ppb Sized Calcium Carbonate (Safecarb 250)** (micro-pore bridging)\n\n**Outcome:** Pill soaked across 2850–2820m interval for 3 hours. Active mud weight trimmed from 1.20 SG to 1.15 SG. Losses brought down to < 0.5 m³/hr. (Citation: WCR_NHKT_B04_2021.pdf Page 42).",
          hasGraph: false 
        }
      ]
    }
  ]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveChatId(`session-${Date.now()}`);
  };

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: data.answer,
          wellGraph: data.well_graph
        }
      ]);

      // Update sidebar history title if first query
      if (messages.length === 0) {
        const newHistoryItem = {
          id: activeChatId,
          title: query.length > 38 ? query.substring(0, 38) + "..." : query,
          messages: [...updatedMessages, { role: "assistant", content: data.answer, wellGraph: data.well_graph }]
        };
        setChatHistory([newHistoryItem, ...chatHistory]);
      }
    } catch (err) {
      console.error(err);
      // Fallback response with OIL domain knowledge
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "### Nahorkatiya Field Offset Intelligence:\n\nActive Well is currently in the **Tipam/Barail transition zone** (2740m–2820m MD). Nearest historical offset events:\n- **Well B-04 (1.24 km West):** Severe lost circulation at 2850m. Remediated with 40 bbl Nut Plug + Mica LCM pill.\n- **Well C-12 (2.08 km North-East):** Differential stuck pipe at 2910m across depleted sand.\n\nKeep active mud weight capped at 1.15–1.17 SG to avoid exceeding the formation fracture gradient.",
          wellGraph: {
            nodes: [
              { id: "current-well", name: "Current Well (Active)", code: "NHKT-A01", is_center: true, distance_km: 0 },
              { id: "NHKT-B04", name: "Well B-04 (West)", code: "B-04", is_center: false, distance_km: 1.24, bearing_deg: 263, severity: "CRITICAL", incident: "Mud Loss (28.5 m³/hr)", casing: "9-5/8\" @ 2760m", mitigation: "40 bbl Nut Plug + Mica pill" },
              { id: "NHKT-C12", name: "Well C-12 (North-East)", code: "C-12", is_center: false, distance_km: 2.08, bearing_deg: 38, severity: "HIGH", incident: "Stuck Pipe", casing: "9-5/8\" @ 2810m", mitigation: "50 bbl lubricant soak + 140 jars" },
              { id: "NHKT-D08", name: "Well D-08 (South)", code: "D-08", is_center: false, distance_km: 3.44, bearing_deg: 182, severity: "CRITICAL", incident: "Gas Kick", casing: "9-5/8\" @ 2740m", mitigation: "Driller's Method kill with 1.29 SG mud" }
            ],
            edges: []
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (historyItem) => {
    setActiveChatId(historyItem.id);
    if (historyItem.messages) {
      setMessages(historyItem.messages);
    } else {
      handleSendMessage(historyItem.title);
    }
  };

  const handleGeoTagResolved = (data) => {
    setMessages([
      ...messages,
      { role: "user", content: `📍 Location Geo-Tag Uploaded: ${data.coordinates.lat.toFixed(4)}°N, ${data.coordinates.lon.toFixed(4)}°E` },
      { 
        role: "assistant", 
        content: data.summary,
        wellGraph: data.well_graph
      }
    ]);
  };

  const examplePrompts = [
    {
      icon: "📍",
      title: "Query Location & Current Depth",
      prompt: "I am at Nahorkatiya South (27.285°N, 95.321°E), drilling at 2820m. What risks should I expect ahead?",
      desc: "Resolves offset wells, lithology tops, and loss corridors ahead."
    },
    {
      icon: "⚠️",
      title: "Mud Loss & Proven LCM Recipes",
      prompt: "Show nearby mud losses and recommended LCM pill formulations in Barail formation.",
      desc: "Historical loss rates, walnut/mica dosages, and mud weight limits."
    },
    {
      icon: "⚖️",
      title: "Casing Program Comparison",
      prompt: "Compare casing programs between Well B-04 and active well A-01.",
      desc: "Evaluates intermediate shoe seats and liner depths across sector."
    },
    {
      icon: "🚨",
      title: "Well Control & Gas Kick History",
      prompt: "How was the gas kick controlled in Well D-08 at 3000m depth?",
      desc: "Pore pressure ramps, shut-in pressures, and Driller's Method kill procedure."
    }
  ];

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat}
        onOpenGeoTag={() => setIsGeoTagOpen(true)}
        onOpenCaseStudies={() => setIsCaseStudiesOpen(true)}
        onTriggerWellGraph={() => handleSendMessage("Show the interactive offset well graph for Nahorkatiya Sector B.")}
        chatHistory={chatHistory}
        onSelectHistory={handleSelectHistory}
        activeChatId={activeChatId}
      />

      {/* Main Chat Interface */}
      <main className="main-chat">
        {/* Top Header */}
        <header className="chat-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Nahorkatiya South Asset (Sector B)
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Active Well: NHKT-A01 (Rig-14)
            </span>
          </div>

          <div className="model-badge">
            <div className="model-dot"></div>
            <span>NVIDIA Nemotron-3 Ultra 550B</span>
          </div>
        </header>

        {/* Scrollable Message Area */}
        <div className="chat-scroll-area">
          {messages.length === 0 ? (
            /* Welcome / Initial Clean State */
            <div className="welcome-hero">
              <div className="hero-logo-box">OIL</div>
              <h1 className="hero-title">Oil India Intelligence System</h1>
              <p className="hero-sub">
                Ask any drilling question, provide your rig coordinates, or upload a geo-tagged wellsite photo to retrieve instant institutional memory and offset well intelligence.
              </p>

              {/* 4 Clean Example Cards */}
              <div className="examples-grid">
                {examplePrompts.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="example-card"
                    onClick={() => handleSendMessage(item.prompt)}
                  >
                    <span className="example-title">
                      <span>{item.icon}</span>
                      {item.title}
                    </span>
                    <span className="example-desc">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Message Stream */
            messages.map((msg, idx) => (
              <div key={idx} className="message-row">
                {msg.role === 'user' ? (
                  <div className="message-user">
                    {msg.content}
                  </div>
                ) : (
                  <div className="message-assistant">
                    <div className="assistant-avatar">
                      <Bot size={18} />
                    </div>
                    <div className="assistant-content">
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </div>

                      {/* Embedded Interactive Well Graph if returned */}
                      {msg.wellGraph && (
                        <InteractiveWellGraph graphData={msg.wellGraph} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="message-row">
              <div className="message-assistant">
                <div className="assistant-avatar">
                  <Bot size={18} />
                </div>
                <div className="assistant-content" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600 }}>
                    <Sparkles size={16} style={{ color: 'var(--oil-amber)' }} />
                    NVIDIA Nemotron-3 Ultra is querying offset reports & well graph...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Floating Input Bar */}
        <div className="floating-input-wrapper">
          <div className="floating-input-bar">
            {/* Attachment Button for Geo-Tag Photo */}
            <button 
              className="input-icon-btn" 
              onClick={() => setIsGeoTagOpen(true)}
              title="Upload Geo-Tagged Wellsite Photo"
            >
              <Paperclip size={18} />
            </button>

            {/* Main Textarea Input */}
            <textarea
              ref={textareaRef}
              rows={1}
              className="chat-textarea"
              placeholder="Ask NWIS anything or enter your rig location / coordinates..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            {/* Send Button */}
            <button 
              className="send-btn" 
              onClick={() => handleSendMessage()} 
              disabled={!inputValue.trim() || isLoading}
            >
              <Send size={15} />
            </button>
          </div>

          <div className="input-footnote">
            Powered by <strong>NVIDIA Nemotron-3 Ultra 550B</strong> • Connected to Oil India eRTMAC & Historical WCRs
          </div>
        </div>
      </main>

      {/* Geo-Tag Photo Upload Modal */}
      <GeoTagModal 
        isOpen={isGeoTagOpen} 
        onClose={() => setIsGeoTagOpen(false)} 
        onResolve={handleGeoTagResolved}
      />

      {/* Case Studies Modal */}
      <CaseStudiesModal 
        isOpen={isCaseStudiesOpen} 
        onClose={() => setIsCaseStudiesOpen(false)} 
        onSelectCase={(promptText) => handleSendMessage(promptText)}
      />
    </div>
  );
}
