# AI/ML-Enabled Nearby Wells Intelligence System (NWIS) for Oil India Limited (OIL)
## SIH Problem Statement 26121 — Enterprise-Grade Multi-Agent Implementation Plan

---

## 1. Executive Summary & Winning Proposition

### 1.1 The Challenge
Oil India Limited (OIL) monitors active drilling operations via **eRTMAC** (real-time telemetry: ROP, WOB, Torque, Mud Flow, Pressure, Gas), but drilling decisions in complex Assam-Arakan basins (e.g., Barail, Tipam, Girujan formations) lack institutional memory. Decades of invaluable drilling lessons, mud losses, stuck pipe incidents, well kicks, and casing/cementing practices are trapped in unstructured PDFs (WCRs, DDRs, mud logs) and veterans' minds.

### 1.2 The Winning Vision: NWIS as an Autonomous Multi-Agent Co-Pilot
**NWIS** is not a static dashboard or a simple PDF chatbot. It is a **real-time, predictive multi-agent decision support platform** operating alongside eRTMAC that:
1. **Correlates 3D Spatial + Stratigraphic Reality**: Correlates wells not just by surface radius ($km$), but by **True Vertical Depth (TVD)** and **Stratigraphic Formation Tops** (accounting for formation dip and faulting).
2. **Predicts Before It Happens ("Look-Ahead Horizon")**: Uses real-time telemetry changes (ROP $\downarrow$, Torque $\uparrow$, SPP $\uparrow$) matched against historical pre-incident offset signatures to trigger predictive alerts 50–100m *before* entering risky zones.
3. **Synthesizes Institutional Memory**: Employs an intelligent **Petro-Knowledge Graph** linking Wells $\rightarrow$ Formations $\rightarrow$ Incidents $\rightarrow$ Mitigations $\rightarrow$ NPT saved.
4. **Field-Ready for Remote OIL Assets**: Designed with offline edge-cache considerations for Assam fields (Duliajan, Moran, Nahorkatiya).

---

## 2. High-Level Architecture Topology

```
                   ┌────────────────────────────────────────┐
                   │    eRTMAC / WITSML Streaming Feed      │
                   │ (Active Well A: Depth, ROP, Torque...) │
                   └───────────────────┬────────────────────┘
                                       │ WebSocket / MQTT
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           NWIS MULTI-AGENT SWARM                                │
│                                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │               Master Orchestrator Agent (RigCommander)                 │   │
│   │             Coordinates sub-agents, manages alert priority              │   │
│   └──────┬──────────────┬───────────────────┬─────────────────┬─────────────┘   │
│          │              │                   │                 │                 │
│          ▼              ▼                   ▼                 ▼                 │
│   ┌─────────────┐ ┌─────────────┐    ┌─────────────┐   ┌─────────────┐          │
│   │  Agent 1:   │ │  Agent 2:   │    │  Agent 3:   │   │  Agent 4:   │          │
│   │ DocuStratum │ │GeoCorrelator│    │ LithoGuard  │   │  RigSentinel│          │
│   │  (OCR/NLP   │ │ (Spatial &  │    │ (Predictive │   │(Real-Time Look│         │
│   │ Ingestion)  │ │Stratigraphy)│    │ Risk Model) │   │ Ahead Alert)│          │
│   └──────┬──────┘ └──────┬──────┘    └──────┬──────┘   └──────┬──────┘          │
│          │               │                  │                 │                 │
│          ▼               ▼                  ▼                 ▼                 │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                Agent 5: PetroBrain (Conversational RAG)                 │   │
│   │     Semantic Search + Hybrid Knowledge Graph (Wells/Formations/NPT)     │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────┬──────────────────────────────────────────┘
                                       │ Real-time State & REST API
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    HIGH-IMPACT MISSION CONTROL UI (Next.js)                     │
│  ┌───────────────────────┐ ┌────────────────────────┐ ┌──────────────────────┐  │
│  │ 2D/3D Geospatial Map  │ │  Real-time Log Tracks  │ │  Look-Ahead Horizon  │  │
│  │  (Radius / Strata)    │ │ (Gamma, ROP, Torque)   │ │  Risk Heatmap Radar  │  │
│  └───────────────────────┘ └────────────────────────┘ └──────────────────────┘  │
│  ┌───────────────────────┐ ┌────────────────────────┐ ┌──────────────────────┐  │
│  │ Proactive Alert Cards │ │ Offset Well Comparison │ │ Interactive PetroBot │  │
│  │ (Evidence + Action)   │ │  (Casing & Mud Specs)  │ │ (Voice/Chat Copilot) │  │
│  └───────────────────────┘ └────────────────────────┘ └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The Multi-Agent Swarm Specification (5 Independent Agents)

To impress SIH evaluators, modular multi-agent orchestration (using LangGraph / Python StateGraph) provides clear separation of concerns, deterministic failovers, and explainability.

### Agent 1: `DocuStratum Agent` (Document & Knowledge Ingestion)
* **Mission**: Automatically extract, normalize, and vectorize unstructured drilling documentation.
* **Inputs**: Scanned WCRs (Well Completion Reports), DDRs (Daily Drilling Reports), Mud Logging Sheets, Cement Evaluation Logs (CBL/VDL), Bit records.
* **Techniques**:
  - OCR Engine (Tesseract / EasyOCR / PyMuPDF) with table recognition.
  - LLM Information Extraction with structured Pydantic schemas:
    - Formation Tops (Formation Name, Top MD, Base MD, Lithology).
    - Casing Programs (Hole size, Casing OD, Shoe Depth, Cement Top).
    - Operational Incident Log (Depth, Timestamp, Incident Type: Mud Loss/Kick/Stuck Pipe/Tight Hole, Severity, NPT Hours, Action Taken, Outcome).
  - Normalization: Converts localized OIL nomenclature (e.g., "loss of circ @ Girujan clays") into standardized IADC/SPE ontology.
* **Output**: Structured SQL records + Vector Embeddings + Knowledge Graph Triples (`Well` -[:ENCOUNTERED_EVENT]-> `Event` -[:TREATED_WITH]-> `Mitigation`).

### Agent 2: `GeoCorrelator Agent` (Spatial & Stratigraphic Depth Aligner)
* **Mission**: Bridge the gap between 2D geographic distance and geological 3D depth truth.
* **Why this is a Game Changer**:
  - *Standard approach (Amateur)*: Search offset wells within 5 km and compare strictly at depth $2850\text{ m}$.
  - *Petroleum Engineering Reality (Winner)*: Formations dip and fault! Formation Barail Top might be at $2700\text{ m}$ in Well B, but at $2820\text{ m}$ in Well A due to an anticline or fault block.
* **Capabilities**:
  - **Dynamic Radius Filter**: User-adjustable radius ($1\text{ km} \rightarrow 25\text{ km}$) with Haversine & UTM coordinate calculations.
  - **Stratigraphic Cross-Section Alignment**: Maps Measured Depth (MD) $\rightarrow$ True Vertical Depth (TVD) $\rightarrow$ Relative Formation Stratigraphy.
  - **Formation Top Interpolator**: Computes predicted formation entry depths for the active well based on offset wells' structural dip.

### Agent 3: `LithoGuard Agent` (Predictive Drilling Risk Analytics)
* **Mission**: Calculate quantitative risk probabilities for major drilling hazards.
* **Hazards Covered**:
  1. **Lost Circulation / Mud Loss**: Risk score ($0 - 100\%$) based on offset loss rates, fracture gradient margin, and ECD (Equivalent Circulating Density).
  2. **Differential / Mechanical Stuck Pipe**: Risk score based on torque-and-drag buildup, dogleg severity, overbalance pressure, and high-permeability sands.
  3. **Well Kick / Influx**: Risk score based on offset pore-pressure anomalies and gas unit surges.
  4. **Cementing Channeling / Poor Bond**: Risk based on offset lost circulation during cementing and washouts.
* **Algorithm**:
  - Hybrid ensemble: Bayesian Risk Prior (historical event frequency within formation) $\times$ Real-time Geomechanical Likelihood (deviation from normal ROP/Torque baseline).

### Agent 4: `RigSentinel Agent` (Real-Time Look-Ahead & Proactive Alerting)
* **Mission**: Continuous real-time look-ahead engine monitoring active eRTMAC telemetry.
* **Capabilities**:
  - **Look-Ahead Window (Virtual Radar)**: Scans $50\text{ m} - 150\text{ m}$ ahead of current bit depth.
  - **Multi-Level Alert System**:
    - 🟢 **Normal / Info**: Nominal drilling parameters, no offset incidents within $100\text{ m}$.
    - 🟡 **Advisory (Look-Ahead Warning)**: Approaching high-risk formation/depth where offset wells experienced incidents (e.g., "Well B had 25 m³/hr mud loss at 2850m; current depth 2800m").
    - 🔴 **Critical (Active Pattern Match)**: Telemetry anomaly detected (ROP drop + Torque spike + SPP surge) matching offset pre-incident signature within 30m of hazard depth.
  - **Prescriptive Recommendation Generation**: Recommends proven historical solutions (e.g., "Deploy 25 ppb coarse calcium carbonate LCM pills; adjust mud weight to 1.18 SG; prepare high-viscosity sweep").

### Agent 5: `PetroBrain Agent` (Natural Language Rig Copilot & RAG)
* **Mission**: Enable engineers to query institutional knowledge in plain English/Hinglish.
* **Capabilities**:
  - **Hybrid Search**: Combines Dense Vector Search + Sparse BM25 + SQL Table queries + Graph queries.
  - **Supported Queries**:
    - *"What casing grade and shoe depth were used in Well B and Well C across Barail formation?"*
    - *"Show all stuck pipe incidents within 5 km radius and what fishing tools were required."*
    - *"What was the total NPT cost of lost circulation in this block over the last 5 years?"*
    - *"Generate a pre-spud risk briefing for interval 2800m – 3100m."*
  - **Citations**: Returns exact page numbers, document links, and historical well IDs for total transparency (Explainable AI).

---

## 4. Key Differentiators to Win SIH (Judges' Wow Factors)

| Feature | Standard Competitor Project | **Our Winning NWIS Platform** |
| :--- | :--- | :--- |
| **Geospatial Model** | Flat 2D map with pins | **Interactive Geospatial Map + 3D Wellbore Trajectory & Stratigraphic Layers** |
| **Depth Correlation** | Raw depth comparison (MD only) | **True Vertical Depth (TVD) + Stratigraphic Formation Top Normalization** |
| **Telemetry Integration**| Static dummy table | **Live eRTMAC WITSML Simulator with Interactive Playback & Variable ROP** |
| **Predictive Alerting** | Alerts only *after* parameter threshold breaks | **Look-Ahead Horizon (alerts 50m in advance using historical offset memory)** |
| **Knowledge Retrieval** | Basic PDF chunking with standard RAG | **Knowledge Graph (Wells $\rightarrow$ Formations $\rightarrow$ Events $\rightarrow$ LCM Mitigations)** |
| **Engineering Value** | Generic chat responses | **Operational Drilling Recommendations with Mud Weight, Casing & NPT figures** |
| **Operational Readiness**| Online only, slow API | **Instant client-side caching & offline-ready Edge Architecture** |

---

## 5. Technical Stack

### Backend & AI Pipeline
* **Language & Framework**: Python 3.11+, FastAPI (Async, high-throughput WebSockets for telemetry)
* **Multi-Agent Orchestration**: LangGraph / LangChain
* **Vector Database**: Qdrant / ChromaDB (for fast semantic search over reports)
* **Graph Database**: NetworkX / Neo4j (for formation $\leftrightarrow$ well $\leftrightarrow$ event topology)
* **ML / Risk Engine**: Scikit-Learn, XGBoost, SciPy (for spatial distance & trend analytics)
* **Document Extraction**: PyMuPDF, pdfplumber, Tesseract OCR, Pydantic v2

### Frontend & Data Visualization
* **Core**: Modern React (Vite / Next.js) with TypeScript
* **Styling**: Sleek dark-mode enterprise UI (Tailwind CSS, Glassmorphic cards, Oil & Gas industrial theme: deep charcoal `#0B0F19`, high-contrast amber `#F59E0B`, emerald `#10B981`, and crimson `#EF4444`)
* **Mapping**: Leaflet / Mapbox GL (with customizable radius rings, offset well markers, and tooltip cards)
* **Telemetry Visuals**: Plotly.js / Canvas-based multi-track strip charts (Gamma Ray, ROP, Torque, Mud Pressure, Bit Depth)
* **Live Simulator**: Built-in Drilling Simulator controls (Play, Pause, Speed up, Inject Kick / Loss)

---

## 6. Implementation Roadmap & Phases

### Phase 1: Data Modeling & Synthetic Rig Dataset Creation
1. Build realistic datasets representing Upper Assam Basin (Oil India operational area: Moran / Nahorkatiya / Duliajan fields).
2. Curate 5 representative wells:
   - **Active Well A**: Current drilling at 2700m $\rightarrow$ 2850m.
   - **Offset Well B (1.2 km away)**: Experienced severe mud loss at 2850m in Barail Formation (Loss rate: 25 m³/hr, NPT: 14 hrs, Mitigated with LCM pill).
   - **Offset Well C (2.0 km away)**: Experienced differential stuck pipe at 2910m (High torque & drag, NPT: 22 hrs, Mitigated by back-reaming & pipe jarring).
   - **Offset Well D (3.5 km away)**: Experienced high pore pressure gas kick at 3000m (Mud weight increased from 1.15 to 1.28 SG).
   - **Offset Well E (4.1 km away)**: Minor seepage losses at 2870m in Barail.
3. Generate realistic sample PDFs (Well Completion Reports, Daily Drilling Reports with authentic header formats and log excerpts).

### Phase 2: Core Multi-Agent Backend Engine
1. **DocuStratum**: Pipeline to parse sample WCR/DDR PDFs into structured JSON and vector index.
2. **GeoCorrelator**: Geospatial radius calculation and stratigraphic formation mapper.
3. **LithoGuard**: Risk prediction algorithm computing Mud Loss, Stuck Pipe, and Kick risk indices.
4. **RigSentinel**: Telemetry stream listener computing real-time anomaly delta and look-ahead alerts.
5. **PetroBrain**: Query parser answering domain questions with direct source attribution.

### Phase 3: High-Impact UI / Mission Control Dashboard
1. **Top Bar**: Active Well Summary (Well Name, Field, Current Depth, Bit Status, ROP, Rig Time, eRTMAC Status).
2. **Interactive Map Panel**:
   - Geospatial view centered on Active Well A.
   - Dynamic radius selector (1 km, 3 km, 5 km, 10 km).
   - Offset well pins colored by risk/incident status.
   - Formation cross-section popup.
3. **Real-Time Telemetry & Look-Ahead Strip Chart**:
   - Multi-track log (Depth vs ROP, Torque, SPP, Mud Flow).
   - 100m Look-Ahead shaded risk corridor.
4. **Proactive Alert & Recommendation Center**:
   - Real-time notification banners (Yellow Advisory $\rightarrow$ Red Critical).
   - Direct side-by-side comparison: *Current Well Indicators* vs *Historical Offset Incident (Well B)*.
   - Prescriptive action checklist for drilling engineer.
5. **Casing & Formation Comparison Matrix**:
   - Tabular and visual cross-well comparison of casing seats, mud weight windows, and formation boundaries.
6. **PetroBrain Copilot Drawer**:
   - Interactive AI chat with quick prompt suggestions ("Analyze Barail formation risks", "Compare casing designs", "Find offset LCM treatments").
7. **Drilling Simulator Controls**:
   - Step forward, Run Auto-Drill, Jump to 2820m (pre-incident zone), and Trigger Emergency Alert.

---

## 7. SIH Presentation & Pitch Strategy (Winning the Jury)

1. **The Hook (First 60 Seconds)**:
   - "Every day, millions of dollars are lost to Non-Productive Time (NPT) in drilling due to mud losses and stuck pipes. The tragedy is: *another well just 1.5 km away already suffered the exact same problem 3 years ago, but the solution was buried in page 142 of an archived PDF.*"
2. **The Live Demo (The Climax)**:
   - Start simulation at 2780m: Everything looks green on eRTMAC.
   - Advance to 2820m: NWIS triggers an **Amber Advisory** ("Look-ahead: Entering Barail sand where Well B had 25 m³/hr mud loss at 2850m").
   - Advance to 2840m: Active torque spikes and ROP slows. NWIS upgrades to **Red Critical Alert** with 89% Mud Loss Probability, cites Well B & Well E, and outputs exact LCM formulation to prevent NPT.
3. **The Engineering Depth**:
   - Show the judges the Stratigraphic TVD correlation (explaining how we handle formation dips).
   - Show the Petro-Knowledge Graph showing institutional memory preservation even when senior engineers retire.
4. **Impact Metrics**:
   - Estimated 20–30% reduction in drilling hazard NPT.
   - 90% faster offset well research time for well planners and drilling superintendents.
   - 100% preservation of institutional drilling knowledge for Oil India Limited.
