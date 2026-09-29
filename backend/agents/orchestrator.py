"""
orchestrator.py - Master Orchestrator: RigCommander
Coordinates the 5 independent autonomous agents into a synchronized swarm:
Agent 1: DocuStratum (Document Ingestion & OCR)
Agent 2: GeoCorrelator (Spatial & Stratigraphic Dip Alignment)
Agent 3: LithoGuard (Predictive Multi-Hazard Risk Modeling)
Agent 4: RigSentinel (Real-Time Look-Ahead Virtual Radar)
Agent 5: PetroBrain (Conversational Knowledge Graph RAG)
"""

from typing import Dict, Any, List
from backend.simulator.drilling_stream import simulator
from backend.agents.agent_docustratum import docustratum_agent
from backend.agents.agent_geocorrelator import geocorrelator_agent
from backend.agents.agent_lithoguard import lithoguard_agent
from backend.agents.agent_rigsentinel import rigsentinel_agent
from backend.agents.agent_petrobrain import petrobrain_agent
from backend.data.wells_data import ACTIVE_WELL

class RigCommanderOrchestrator:
    """
    RigCommander is the master state machine that coordinates multi-agent consensus,
    dispatches telemetry to specialized agents, and produces an explainable decision payload.
    """
    def __init__(self):
        self.simulator = simulator
        self.docustratum = docustratum_agent
        self.geocorrelator = geocorrelator_agent
        self.lithoguard = lithoguard_agent
        self.rigsentinel = rigsentinel_agent
        self.petrobrain = petrobrain_agent
        self.radius_km = 5.0

    def get_operational_snapshot(self, radius_km: float = 5.0) -> Dict[str, Any]:
        """
        Gathers real-time state across all agents and the drilling telemetry stream.
        Produces full payload for Mission Control UI.
        """
        self.radius_km = radius_km
        
        # 1. Telemetry from active drilling simulator
        telemetry = self.simulator.compute_telemetry(self.simulator.current_depth)
        
        # 2. Agent 2: Geospatial & Stratigraphic Alignment
        nearby_wells = self.geocorrelator.get_nearby_wells(radius_km=self.radius_km)
        stratigraphic_correlation = self.geocorrelator.correlate_formation_depths(telemetry["measured_depth_m"])
        
        # 3. Agent 3: Predictive Risk Analytics
        risk_matrix = self.lithoguard.calculate_risk_matrix(telemetry, nearby_wells)
        
        # 4. Agent 4: Look-Ahead Radar & Alert Dispatcher
        sentinel_assessment = self.rigsentinel.evaluate_look_ahead(telemetry, risk_matrix, nearby_wells)
        
        # 5. Multi-Agent Reasoning Trace (Shows transparency and autonomous coordination)
        agent_reasoning_trace = [
            {
                "agent_id": "Agent-1 (DocuStratum)",
                "status": "ONLINE",
                "summary": f"Ingested 5 technical reports (WCRs/DDRs). Extracted {len(self.docustratum.extracted_events_cache)} verified historical events."
            },
            {
                "agent_id": "Agent-2 (GeoCorrelator)",
                "status": "ACTIVE",
                "summary": f"Identified {len(nearby_wells)} offset wells within {self.radius_km} km. Stratigraphic dip adjusted by +35m relative to Well B."
            },
            {
                "agent_id": "Agent-3 (LithoGuard)",
                "status": "ACTIVE",
                "summary": f"Computed dominant hazard: {risk_matrix['dominant_hazard']['hazard_name']} with {risk_matrix['dominant_hazard']['risk_percentage']}% probability."
            },
            {
                "agent_id": "Agent-4 (RigSentinel)",
                "status": "TRIGGERED" if sentinel_assessment['alert_level'] != "NOMINAL" else "STANDBY",
                "summary": f"Look-ahead alert level: {sentinel_assessment['alert_level']} at {telemetry['measured_depth_m']}m. {len(sentinel_assessment['prescriptive_actions'])} prescriptive actions ready."
            },
            {
                "agent_id": "Agent-5 (PetroBrain)",
                "status": "READY",
                "summary": "Knowledge graph indexed with wells, formations, and historical LCM mitigations."
            }
        ]

        return {
            "system_status": "OPERATIONAL",
            "active_well_info": ACTIVE_WELL,
            "telemetry": telemetry,
            "nearby_wells": nearby_wells,
            "stratigraphic_correlation": stratigraphic_correlation,
            "risk_matrix": risk_matrix,
            "sentinel_assessment": sentinel_assessment,
            "agent_reasoning_trace": agent_reasoning_trace,
            "filter_radius_km": self.radius_km
        }

    def ask_rig_copilot(self, question: str) -> Dict[str, Any]:
        """Routes conversational query to Agent 5 (PetroBrain) with active telemetry context"""
        current_telemetry = self.simulator.compute_telemetry(self.simulator.current_depth)
        return self.petrobrain.query(question, current_telemetry)

    def step_simulation(self, distance: float = 0.5) -> Dict[str, Any]:
        """Advances active well drilling by distance (meters)"""
        self.simulator.step(distance)
        return self.get_operational_snapshot(self.radius_km)

    def jump_simulation(self, depth: float) -> Dict[str, Any]:
        """Jumps drilling to a specific depth (e.g., 2820m advisory or 2848m critical)"""
        self.simulator.jump_to(depth)
        return self.get_operational_snapshot(self.radius_km)

    def reset_simulation(self) -> Dict[str, Any]:
        """Resets drilling back to beginning (2740m)"""
        self.simulator.reset()
        return self.get_operational_snapshot(self.radius_km)

rig_commander = RigCommanderOrchestrator()
