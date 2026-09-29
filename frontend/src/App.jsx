import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  Bot, 
  Mic,
  MicOff,
  Compass, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Database,
  MapPin,
  ChevronDown
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import MultiAgentResponseView from './components/MultiAgentResponseView';
import DocumentModal from './components/DocumentModal';
import GeoTagModal from './components/GeoTagModal';
import CaseStudiesModal from './components/CaseStudiesModal';
import WellGraphModal from './components/WellGraphModal';
import SourcesModal from './components/SourcesModal';
import ArchitectureModal from './components/ArchitectureModal';
import LocationModal from './components/LocationModal';

const BACKEND_URL = "http://localhost:8001";
const STORAGE_KEY = "oil_nwis_saved_consultations_v3";

// Initial realistic consultations with complete multi-agent datasets
const INITIAL_DEMO_CHATS = [
  {
    id: "session-barail-loss",
    title: "Barail Mud Loss Mitigation @ 2820m",
    messages: [
      {
        role: "user",
        content: "I am at Nahorkatiya South (27.285°N, 95.321°E), drilling at 2820m MD. What risks should I expect ahead?"
      },
      {
        role: "assistant",
        content: "### Petroleum Engineering Look-Ahead Briefing (2820m MD):\n\nThe active drill string is within **5m** of piercing the depleted **Barail Arenaceous Sand Member** (top projected at 2815m MD due to +35m structural up-dip relative to Well B-04).\n\n**Offset Incident Correlation:**\n- **Well B-04 (1.24 km West):** Encountered severe lost circulation (28.5 m³/hr) at 2850m MD due to hydraulic fracture breach at 1.22 SG equivalent. Remediated with 40 bbl Nut Plug + Mica pill; incurred 16.5h NPT.\n- **Well C-12 (2.08 km North-East):** Suffered differential sticking at 2910m MD across permeable sand due to 480 psi overbalance (1.24 SG mud); freed after 19h of jarring.\n\n**Actionable Directives:**\n1. **Fluids:** Keep active mud weight strictly between **1.15 – 1.17 SG**; keep ECD below 1.18 SG.\n2. **LCM Standby:** Pre-mix 40 bbl heavy thixotropic LCM pill (25 ppb Coarse Nut Plug, 20 ppb Medium Flake Mica, 15 ppb CaCO3).\n3. **Drillstring Practices:** Maintain pipe rotation and reciprocation during connections to mitigate differential sticking.",
        data: {
          direct_verdict: [
            "Barail Sand top projected at 2815m MD (+35m dip vs prognosis). Active depth 2820m is entering depleted sand fairway.",
            "High Lost Circulation Risk (88% probability) between 2820m - 2865m based on 28.5 m³/hr loss in Well B-04.",
            "Immediate Fluids Directive: Trim active mud weight to 1.15 - 1.17 SG; keep 40 bbl heavy LCM pill on standby.",
            "Differential Sticking Alert: Well C-12 was stuck at 2910m (24h NPT) due to overbalance; maintain pipe rotation during connections."
          ],
          agent_pills: [
            { id: "geostratum", name: "🌍 GeoStratum", role: "Stratigraphy", status: "Barail Top @ 2815m (+35m Dip)", color: "green", badge: "CORRELATED" },
            { id: "lithoguard", name: "⚠️ LithoGuard", role: "Hazards", status: "88% Severe Loss Risk @ 2850m", color: "red", badge: "CRITICAL RISK" },
            { id: "mudsmith", name: "🛠️ MudSmith", role: "Fluids & LCM", status: "1.15-1.17 SG | 40 bbl LCM Ready", color: "yellow", badge: "ACTION READY" },
            { id: "casingpro", name: "📐 CasingPro", role: "Casing", status: "9-5/8\" Shoe @ 2750m", color: "green", badge: "INTEGRITY OK" },
            { id: "nptsentry", name: "⏱️ NptSentry", role: "Economics", status: "16.5h / ₹38.5L NPT Mitigated", color: "blue", badge: "SAVED ₹38.5L" }
          ],
          agents_data: {
            geostratum: {
              active_depth_md: 2820,
              active_depth_tvd: 2785,
              next_formation: "Barail Arenaceous Sand Member",
              target_entry_md: 2815,
              look_ahead_distance_m: 0,
              structural_dip: "+35m structural up-dip towards NE relative to Well B-04",
              lithology_summary: "High-permeability, unconsolidated sand channels with alternating carbonaceous shales. Depleted reservoir pressure (1.05 SG eq)."
            },
            lithoguard: {
              loss_risk_percentage: 88,
              stuck_pipe_risk_percentage: 45,
              kick_risk_percentage: 15,
              critical_loss_interval: "2820m - 2865m MD",
              early_indicators: [
                "Sudden ROP increase followed by torque chatter (18-28 kNm)",
                "Pump standpipe pressure reduction of 150-180 psi",
                "Pit level drop detector alert threshold set at -0.5 m³"
              ]
            },
            mudsmith: {
              recommended_mw_window: "1.15 - 1.17 SG",
              fracture_gradient_sg: 1.22,
              max_allowable_ecd: 1.18,
              flow_rate_limit_lpm: 1250,
              lcm_pill_standby_recipe: {
                nut_plug_ppb: 25,
                mica_flake_ppb: 20,
                caco3_ppb: 15,
                volume_bbl: 40,
                soak_time_hrs: 3.0
              }
            },
            casingpro: {
              intermediate_shoe_casing: "9-5/8 inch (40 lb/ft, L-80)",
              intermediate_shoe_md: 2750,
              open_hole_size_in: 8.5,
              offset_shoe_comparison: [
                { well: "Active Well A-01", shoe_depth: "2750m MD", notes: "Leaves 65m open hole to Barail top" },
                { well: "Offset B-04", shoe_depth: "2760m MD", notes: "Exposed 90m before 2850m loss zone" },
                { well: "Offset C-12", shoe_depth: "2810m MD", notes: "Higher shoe depth, tight clearance" }
              ]
            },
            nptsentry: {
              rig_hourly_cost_lakhs: 2.33,
              avoided_npt_hours: 16.5,
              estimated_cost_savings_lakhs: 38.5,
              look_ahead_checklist: [
                "Confirm 40 bbl heavy LCM pill pre-mixed and circulating in slug pit.",
                "Verify mud logging pit gain/loss alarms configured to +/- 0.5 m³ sensitivity.",
                "Cap mud weight at 1.16 SG; keep flow rate <= 1250 LPM to control ECD < 1.18 SG.",
                "Reciprocate and rotate drillstring during every connection to prevent differential sticking."
              ]
            }
          },
          collision_matrix: [
            { well: "Active Well A-01", proximity: "0.0 km (Active)", formation_depth: "Tipam -> Barail (2815m)", hazard_status: "Approaching Depleted Sand", remediation: "Cap MW @ 1.16 SG, Pre-treat with 20 ppb CaCO3", color: "yellow" },
            { well: "Offset B-04", proximity: "1.24 km West", formation_depth: "Barail Sand @ 2850m", hazard_status: "Severe Mud Loss (28.5 m³/hr)", remediation: "40 bbl Nut Plug + Mica LCM Pill (16.5h NPT)", color: "red" },
            { well: "Offset C-12", proximity: "2.08 km North-East", formation_depth: "Barail Sand @ 2910m", hazard_status: "Differential Stuck Pipe (24h NPT)", remediation: "50 bbl Lubricant Soak + 140 Jars", color: "red" },
            { well: "Offset D-08", proximity: "3.44 km South", formation_depth: "Kopili Transition @ 3000m", hazard_status: "Gas Kick (SIDPP 340 psi)", remediation: "Driller's Method Kill (1.29 SG, 31h NPT)", color: "red" }
          ],
          execution_trace: [
            { node: "DocuStratumNode", latency_ms: 14, description: "Indexed 5 historical WCR/DDR completion logs & verified offset records." },
            { node: "GeoStratumNode", latency_ms: 18, description: "Calculated +35m structural dip & correlated Barail Sand top to 2815m MD." },
            { node: "LithoGuardNode", latency_ms: 22, description: "Evaluated 1.22 SG fracture gradient; identified 88% severe loss risk corridor at 2850m." },
            { node: "MudSmithNode", latency_ms: 16, description: "Formulated 40 bbl LCM pill recipe and specified ECD ceiling < 1.18 SG." },
            { node: "CasingProNode", latency_ms: 15, description: "Validated 9-5/8\" intermediate casing shoe at 2750m MD across sector." },
            { node: "NptSentryNode", latency_ms: 12, description: "Estimated 16.5 hrs NPT mitigation (₹38.5 Lakhs rig operating savings)." },
            { node: "LLMSynthesisNode", latency_ms: 340, description: "Enterprise Drilling LLM synthesized grounded petroleum engineering briefing." }
          ],
          citations: [
            { doc_id: "DOC-WCR-B04", title: "WCR_NHKT_B04_2021.pdf (p.42-45)", section: "Sec 3.2: Severe Lost Circulation Remediation & 40 bbl LCM Recipe", excerpt: "Severe partial-to-total loss (28.5 m3/hr) encountered in upper Barail Arenaceous member at 2850m. Mitigated by spotting 40 bbl heavy LCM pill (25 ppb Nut Plug, 20 ppb Mica, 15 ppb Safecarb) and reducing mud weight to 1.15 SG." },
            { doc_id: "DOC-DDR-C12", title: "DDR_NHKT_C12_2022.pdf (p.18)", section: "Day 34: Differential Stuck Pipe & 140 Jars", excerpt: "Differential sticking occurred at 2910m across permeable Barail sand due to 480 psi overbalance. Displaced 50 bbl lubricant soak; freed after 19 hrs jarring (140 upward jars)." }
          ],
          well_graph: {
            nodes: [
              { id: "current-well", name: "Active Well A-01", code: "NHKT-A01", is_center: true, distance_km: 0.0, depth_md: 2820.0, mud_sg: 1.17, status: "DRILLING_ACTIVE", formation: "Barail Transition" },
              { id: "NHKT-B04", name: "Nahorkatiya B-04", code: "B-04", is_center: false, distance_km: 1.24, bearing_deg: 263, severity: "CRITICAL", incident: "MUD_LOSS", incident_depth: 2850, npt_hours: 16.5, mitigation: "40 bbl Nut Plug + Mica pill", casing: "9-5/8\" @ 2760m", doc_ref: "WCR_NHKT_B04_2021.pdf" },
              { id: "NHKT-C12", name: "Nahorkatiya C-12", code: "C-12", is_center: false, distance_km: 2.08, bearing_deg: 38, severity: "HIGH", incident: "STUCK_PIPE", incident_depth: 2910, npt_hours: 24.0, mitigation: "50 bbl lubricant soak + 140 jars", casing: "9-5/8\" @ 2810m", doc_ref: "DDR_NHKT_C12_2022.pdf" },
              { id: "NHKT-D08", name: "Nahorkatiya D-08", code: "D-08", is_center: false, distance_km: 3.44, bearing_deg: 182, severity: "CRITICAL", incident: "WELL_KICK", incident_depth: 3000, npt_hours: 31.0, mitigation: "Driller's Method kill with 1.29 SG mud", casing: "9-5/8\" @ 2740m", doc_ref: "WCR_NHKT_D08_2020.pdf" }
            ],
            edges: []
          },
          answer: "Barail Sand look-ahead analysis generated from historical offset wells."
        }
      }
    ]
  },
  {
    id: "session-lcm-recipe",
    title: "Well B-04 40 bbl LCM Formulation",
    messages: [
      {
        role: "user",
        content: "What was the exact LCM formulation used in Well B-04 for the 2850m mud loss?"
      },
      {
        role: "assistant",
        content: "### Well B-04 Proven LCM Formulation (2850m Loss Zone):\n\nWhen Well B-04 experienced total mud loss (28.5 m³/hr) in Barail Sand, the following 40 bbl thixotropic pill was pumped:\n\n- **25 ppb Coarse Ground Walnut Shells (Nut Plug)** (large fracture bridging)\n- **20 ppb Medium Flake Mica** (permeable matrix sealing)\n- **15 ppb Sized Calcium Carbonate (Safecarb 250)** (micro-pore bridging)\n\n**Outcome:** Pill soaked across 2850–2820m interval for 3 hours. Active mud weight trimmed from 1.20 SG to 1.15 SG. Losses brought down to < 0.5 m³/hr. (Citation: WCR_NHKT_B04_2021.pdf Page 42).",
        data: {
          direct_verdict: [
            "Exact LCM Recipe: 25 ppb Coarse Nut Plug + 20 ppb Medium Flake Mica + 15 ppb CaCO3 Safecarb 250 in 40 bbl volume.",
            "Soak Period: String pulled 30m off bottom; pill soaked across 2850m-2820m for 3.0 hours.",
            "Mud Density Reduction: Circulating density lowered from 1.20 SG to 1.15 SG to stay below 1.22 SG fracture gradient.",
            "Saved ₹38.5 Lakhs in rig downtime and cured total loss to <0.5 m³/hr residual seepage."
          ],
          agent_pills: [
            { id: "mudsmith", name: "🛠️ MudSmith", role: "Fluids & LCM", status: "40 bbl Thixotropic Pill Ready", color: "yellow", badge: "STANDBY" },
            { id: "geostratum", name: "🌍 GeoStratum", role: "Stratigraphy", status: "Barail Arenaceous Sand (2850m)", color: "green", badge: "VERIFIED" },
            { id: "lithoguard", name: "⚠️ LithoGuard", role: "Hazards", status: "Induced Hydraulic Fracture (1.22 SG)", color: "red", badge: "CURED" }
          ],
          agents_data: {
            mudsmith: {
              recommended_mw_window: "1.15 SG",
              fracture_gradient_sg: 1.22,
              max_allowable_ecd: 1.18,
              flow_rate_limit_lpm: 1200,
              lcm_pill_standby_recipe: {
                nut_plug_ppb: 25,
                mica_flake_ppb: 20,
                caco3_ppb: 15,
                volume_bbl: 40,
                soak_time_hrs: 3.0
              }
            }
          },
          citations: [
            { doc_id: "DOC-WCR-B04", title: "WCR_NHKT_B04_2021.pdf (p.42-45)", section: "Section 3.0: Major Operational Problems & LCM Formulations", excerpt: "Mixed and pumped 40 bbl heavy thixotropic LCM pill comprising 25 ppb Nut Plug, 20 ppb Mica, 15 ppb Safecarb. Reduced circulating density to 1.15 SG." }
          ],
          answer: "Detailed formulation extracted from WCR_NHKT_B04_2021.pdf."
        }
      }
    ]
  },
  {
    id: "session-gas-kick",
    title: "Kopili Gas Kick Driller's Method Kill",
    messages: [
      {
        role: "user",
        content: "How was the gas kick controlled in Well D-08 at 3000m depth?"
      },
      {
        role: "assistant",
        content: "### Well D-08 Gas Kick Control (Kopili Marine Shale @ 3000m MD):\n\n- **Pre-Event Warning:** Sudden ROP increase from 6 to 24 m/hr; background gas surged to 18.5%; pit gain of +3.5 m³ in 8 minutes.\n- **Shut-in:** Hard shut-in using Annular BOP; SIDPP = 340 psi, SICP = 510 psi.\n- **Kill Operation:** Driller's Method executed over 2 full circulations. First circulation evacuated gas influx while holding drill pipe pressure constant. Second circulation displaced hole with 1.29 SG barite-weighted kill mud.\n- **Outcome:** Well killed safely without borehole collapse or shoe fracture. Avoided catastrophic blowout. (Citation: WCR_NHKT_D08_2020.pdf Page 88).",
        data: {
          direct_verdict: [
            "Shut-In Pressures: SIDPP 340 psi, SICP 510 psi, Pit Volume Gain +3.5 m³.",
            "Kill Method: Two-circulation Driller's Method using 1.29 SG barite kill fluid.",
            "Formation Hazard: Steep abnormal pore pressure transition at Kopili shale boundary.",
            "Incurred 31.0 hours NPT but prevented catastrophic well blowout."
          ],
          agent_pills: [
            { id: "lithoguard", name: "⚠️ LithoGuard", role: "Hazards", status: "Kopili Gas Kick Controlled", color: "green", badge: "RESOLVED" },
            { id: "mudsmith", name: "🛠️ MudSmith", role: "Fluids", status: "Kill Mud: 1.29 SG Barite", color: "yellow", badge: "PUMPED" }
          ],
          citations: [
            { doc_id: "DOC-WCR-D08", title: "WCR_NHKT_D08_2020.pdf (p.88-94)", section: "Section 4.1: Well Control Execution Log", excerpt: "SIDPP = 340 psi, SICP = 510 psi. Executed Driller's Method well kill over 2 circulations. Raised kill mud weight from 1.15 SG to 1.29 SG." }
          ],
          answer: "Well D-08 well kill procedures extracted from official completion log."
        }
      }
    ]
  }
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState("session-current");

  // Modals state
  const [isGeoTagOpen, setIsGeoTagOpen] = useState(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [isWellGraphOpen, setIsWellGraphOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Active Rig Location & Operational Well State
  const [activeLocation, setActiveLocation] = useState({
    name: "Nahorkatiya South Asset (Sector B)",
    well: "Active Well: NHKT-A01 (Rig-14)",
    lat: 27.2850,
    lon: 95.3210,
    depth: 2820.0
  });

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);

  // Load chat history from localStorage or fallback to initial realistic demo consultations
  const [chatHistory, setChatHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read chat history from localStorage", e);
    }
    return INITIAL_DEMO_CHATS;
  });

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Persist chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    } catch (e) {
      console.error("Could not save to localStorage", e);
    }
  }, [chatHistory]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Web Speech Recognition Setup for Rig Cabin Hands-Free Operation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => (prev ? prev + " " + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge or type your question.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Could not start speech recognition:", err);
      }
    }
  };

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
          history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          latitude: activeLocation.lat,
          longitude: activeLocation.lon,
          current_depth: activeLocation.depth
        })
      });

      const data = await res.json();

      const assistantMsg = {
        role: "assistant",
        content: data.answer,
        data: data
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      // Save into active chat session in chatHistory
      setChatHistory((prevHistory) => {
        const existingIndex = prevHistory.findIndex(h => h.id === activeChatId);
        const title = prevHistory[existingIndex]?.title || (query.length > 38 ? query.substring(0, 38) + "..." : query);
        const updatedItem = {
          id: activeChatId,
          title: title,
          messages: finalMessages
        };

        if (existingIndex >= 0) {
          const next = [...prevHistory];
          next[existingIndex] = updatedItem;
          return next;
        } else {
          return [updatedItem, ...prevHistory];
        }
      });
    } catch (err) {
      console.error("Chat API error:", err);
      // Fallback assistant response
      const fallbackAssistantMsg = {
        role: "assistant",
        content: "Nahorkatiya South Asset look-ahead analysis generated from historical offset wells.",
        data: {
          direct_verdict: [
            "Barail Sand top projected at 2815m MD (+35m dip vs Well B-04).",
            "High Mud Loss Risk (88% probability) at 2850m based on 28.5 m³/hr loss in Well B-04.",
            "Immediate Fluids Directive: Trim active mud weight to 1.15 - 1.17 SG; pre-mix 40 bbl heavy LCM pill on standby."
          ],
          agent_pills: [
            { id: "geostratum", name: "🌍 GeoStratum", status: "Barail Top @ 2815m", color: "green", badge: "CORRELATED" },
            { id: "lithoguard", name: "⚠️ LithoGuard", status: "88% Loss Risk @ 2850m", color: "red", badge: "CRITICAL" },
            { id: "mudsmith", name: "🛠️ MudSmith", status: "1.15-1.17 SG | 40 bbl LCM Ready", color: "yellow", badge: "ACTION READY" }
          ],
          collision_matrix: [
            { well: "Active Well A-01", proximity: "0.0 km", formation_depth: "Barail (2815m)", hazard_status: "Depleted Sand", remediation: "Cap MW @ 1.16 SG", color: "yellow" },
            { well: "Offset B-04", proximity: "1.24 km W", formation_depth: "Barail (2850m)", hazard_status: "Severe Loss (28.5 m³/hr)", remediation: "40 bbl LCM Pill", color: "red" }
          ],
          citations: [
            { doc_id: "DOC-WCR-B04", title: "WCR_NHKT_B04_2021.pdf (p.42)", section: "Lost Circulation Remediation", excerpt: "Severe partial-to-total loss (28.5 m3/hr) encountered in upper Barail member." }
          ],
          answer: "Nahorkatiya South look-ahead evaluation."
        }
      };

      setMessages([...updatedMessages, fallbackAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a consultation from sidebar history: directly restores conversation without re-querying!
  const handleSelectHistory = (historyItem) => {
    setActiveChatId(historyItem.id);
    if (historyItem.messages && historyItem.messages.length > 0) {
      setMessages(historyItem.messages);
    } else {
      setMessages([]);
    }
  };

  // Delete a consultation from sidebar history
  const handleDeleteHistory = (sessionId) => {
    const nextHistory = chatHistory.filter(h => h.id !== sessionId);
    setChatHistory(nextHistory);
    if (activeChatId === sessionId) {
      handleNewChat();
    }
  };

  // When Geo-Tag photo or coordinates are uploaded
  const handleGeoTagResolved = (data) => {
    const lat = data.coordinates?.lat || 27.2850;
    const lon = data.coordinates?.lon || 95.3210;
    const userMsg = { role: "user", content: `📍 Location Geo-Tag Uploaded: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E (Nahorkatiya Sector B)` };
    const assistantMsg = {
      role: "assistant",
      content: data.summary || "Geo-tag analysis complete.",
      data: data
    };

    const finalMessages = [...messages, userMsg, assistantMsg];
    setMessages(finalMessages);

    // Save in history
    setChatHistory((prev) => [
      {
        id: `geotag-${Date.now()}`,
        title: `Geo-Tag (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
        messages: finalMessages
      },
      ...prev
    ]);
  };

  // When a case study is selected from CaseStudiesModal
  const handleSelectCaseStudy = (caseItem) => {
    const prompt = `Explain the root cause and engineering remediation for ${caseItem.title} at ${caseItem.depth} in Nahorkatiya Field.`;
    handleSendMessage(prompt);
  };

  // Easy, simple, non-jargon language starter examples as requested in Point 3
  const examplePrompts = [
    {
      icon: "🔍",
      title: "What Problems Happened Ahead?",
      prompt: "I am currently drilling at 2820m. What drilling problems happened in nearby wells at this depth?",
      desc: "Checks nearby offset wells to alert you of gas kicks, stuck pipe, or mud losses before you reach them."
    },
    {
      icon: "🧪",
      title: "What To Do If Mud Starts Leaking?",
      prompt: "What should I do if drilling mud starts leaking into the ground? Give me the exact recipe to stop it.",
      desc: "Gives you the exact mixture and mud weight to quickly seal rock cracks and stop mud loss."
    },
    {
      icon: "📏",
      title: "Is My Pipe Casing Depth Safe?",
      prompt: "Compare my steel casing pipe depth with nearby offset wells to make sure it is safe.",
      desc: "Checks if your protective steel pipe shoe is set at the right depth compared to past wells."
    },
    {
      icon: "🛑",
      title: "How Was The Past Gas Leak Stopped?",
      prompt: "How did Well D-08 stop the dangerous high-pressure gas leak when they were at 3000m depth?",
      desc: "Step-by-step simple explanation of how past drillers killed high gas pressure safely."
    }
  ];

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat}
        onOpenGeoTag={() => setIsGeoTagOpen(true)}
        onOpenCaseStudies={() => setIsCaseStudiesOpen(true)}
        onOpenWellGraph={() => setIsWellGraphOpen(true)}
        chatHistory={chatHistory}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={handleDeleteHistory}
        activeChatId={activeChatId}
      />

      {/* Main Chat Interface */}
      <main className="main-chat">
        {/* Top Header with Upper Action Buttons */}
        <header className="chat-top-header">
          {/* Interactive Rig Location Selector Button (Point 2) */}
          <button 
            className="header-location-btn"
            onClick={() => setIsLocationModalOpen(true)}
            title="Click to change rig location: current GPS, write custom location, or presets"
          >
            <div className="location-pin-box">
              <MapPin size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {activeLocation.name}
                </span>
                <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {activeLocation.well} • {activeLocation.lat}°N, {activeLocation.lon}°E
              </span>
            </div>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* 1. Sources Directory Button */}
            <button 
              className="header-top-btn"
              onClick={() => setIsSourcesOpen(true)}
              title="Verified Statutory & Real-Time Sources Directory"
            >
              <Database size={14} style={{ color: 'var(--oil-amber)' }} />
              <span>📚 Sources</span>
            </button>

            {/* 2. Architecture StateGraph Button */}
            <button 
              className="header-top-btn"
              onClick={() => setIsArchitectureOpen(true)}
              title="Multi-Agent StateGraph Architecture (7 Nodes)"
            >
              <Zap size={14} style={{ color: '#7c3aed' }} />
              <span>⚡ Architecture</span>
            </button>

            {/* Model Badge */}
            <div className="model-badge">
              <div className="model-dot"></div>
              <span>Enterprise Drilling LLM</span>
            </div>
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
                Ask any drilling question, choose your rig location, or upload a wellsite photo to trigger multi-agent offset analysis powered by Enterprise Drilling LLM.
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
                    <div className="assistant-content" style={{ width: '100%', maxWidth: '920px' }}>
                      {/* Render sih26-style multi-agent response view */}
                      <MultiAgentResponseView 
                        data={msg.data || { answer: msg.content }} 
                        onOpenDocument={(doc) => setSelectedDocument(doc)}
                      />
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontWeight: 600, fontSize: '0.85rem' }}>
                    <Sparkles size={16} style={{ color: 'var(--oil-amber)' }} />
                    Synchronizing 5 Drilling Agents (GeoStratum, LithoGuard, MudSmith, CasingPro, NptSentry)...
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

            {/* Microphone Voice Button for Rig Cabin Hands-Free Operation */}
            <button 
              className={`input-icon-btn ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              style={{ color: isListening ? '#dc2626' : undefined }}
              title={isListening ? "Listening... click to stop" : "Rig Cabin Voice Mode (Speech Recognition)"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Main Textarea Input */}
            <textarea
              ref={textareaRef}
              rows={1}
              className="chat-textarea"
              placeholder={isListening ? "Listening... Speak your question..." : "Ask NWIS anything or enter your rig location / coordinates..."}
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
              title="Send to Enterprise LLM Engine"
            >
              <Send size={16} />
            </button>
          </div>

          <div className="input-footnote">
            Nearby Wells Intelligence System (NWIS) • Problem Statement 26121 • Oil India Limited
          </div>
        </div>
      </main>

      {/* Modals */}
      {isGeoTagOpen && (
        <GeoTagModal 
          isOpen={true}
          onClose={() => setIsGeoTagOpen(false)}
          onResolve={handleGeoTagResolved}
        />
      )}

      {isCaseStudiesOpen && (
        <CaseStudiesModal 
          isOpen={true}
          onClose={() => setIsCaseStudiesOpen(false)}
          onSelectCase={handleSelectCaseStudy}
        />
      )}

      {isWellGraphOpen && (
        <WellGraphModal 
          isOpen={true}
          onClose={() => setIsWellGraphOpen(false)}
          onConsultWell={(query) => handleSendMessage(query)}
        />
      )}

      {isSourcesOpen && (
        <SourcesModal 
          isOpen={true}
          onClose={() => setIsSourcesOpen(false)}
          onSelectSource={(doc) => setSelectedDocument(doc)}
        />
      )}

      {isArchitectureOpen && (
        <ArchitectureModal 
          isOpen={true}
          onClose={() => setIsArchitectureOpen(false)}
        />
      )}

      {/* Rig Location Selector Modal */}
      {isLocationModalOpen && (
        <LocationModal 
          isOpen={true}
          onClose={() => setIsLocationModalOpen(false)}
          currentLocation={activeLocation}
          onSelectLocation={(newLoc) => {
            setActiveLocation(newLoc);
          }}
        />
      )}

      {selectedDocument && (
        <DocumentModal 
          doc={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}
