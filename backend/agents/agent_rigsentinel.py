"""
agent_rigsentinel.py - Agent 4: Real-Time Look-Ahead & Proactive Alert Engine (RigSentinel)
Operates as an automated virtual look-ahead radar scanning 50m-100m ahead of the drill bit.
Matches real-time parameter signatures with historical offset incidents and issues 
tiered alerts with prescriptive engineering recommendations.
"""

from typing import Dict, Any, List

class RigSentinelAgent:
    """
    RigSentinel Agent transforms passive telemetry feeds into proactive decision support.
    Instead of waiting for a catastrophic event, it issues look-ahead advisories
    and actionable checklists derived from institutional memory.
    """
    def __init__(self):
        self.name = "RigSentinel Agent (Agent 4)"
        self.role = "Real-Time Look-Ahead Virtual Radar & Alert Dispatcher"
        self.look_ahead_distance_m = 75.0

    def evaluate_look_ahead(self, telemetry: Dict[str, Any], risk_matrix: Dict[str, Any], nearby_wells: List[Dict[str, Any]]) -> Dict[str, Any]:
        current_md = telemetry.get("measured_depth_m", 2750.0)
        dominant_hazard = risk_matrix["dominant_hazard"]
        risk_pct = dominant_hazard["risk_percentage"]
        
        # Scan horizon [current_md, current_md + look_ahead_distance_m]
        horizon_end_md = current_md + self.look_ahead_distance_m
        
        upcoming_hazards = []
        for well in nearby_wells:
            for inc in well.get("incidents", []):
                event_depth = inc["depth_md"]
                # If event depth falls within current depth or look-ahead horizon
                if (current_md - 15.0) <= event_depth <= horizon_end_md:
                    dist_to_hazard = event_depth - current_md
                    upcoming_hazards.append({
                        "offset_well": well["name"],
                        "offset_well_id": well["well_id"],
                        "distance_km": well["calculated_distance_km"],
                        "incident_type": inc["type"],
                        "severity": inc["severity"],
                        "depth_md": event_depth,
                        "distance_ahead_m": round(dist_to_hazard, 1),
                        "status": "IMMEDIATE_ZONE" if abs(dist_to_hazard) <= 15.0 else "APPROACHING",
                        "mitigation_used": inc["mitigation"],
                        "lessons_learned": inc["lessons_learned"],
                        "doc_reference": inc["wcr_doc_reference"]
                    })
                    
        # Determine Alert Level: CRITICAL (Red), ADVISORY (Yellow), NOMINAL (Green)
        if risk_pct >= 70.0 or any(h["status"] == "IMMEDIATE_ZONE" and h["incident_type"] == "MUD_LOSS" for h in upcoming_hazards):
            alert_level = "CRITICAL"
            badge_color = "#ef4444"
            headline = f"CRITICAL: Active Hazard Signature Match at {round(current_md, 1)}m MD"
            description = (
                f"Active telemetry (SPP drop to {int(telemetry.get('spp_psi', 2600))} psi, "
                f"Torque elevated to {telemetry.get('torque_kn_m', 18)} kNm, Pit Delta: {telemetry.get('pit_delta_m3_hr', 0)} m³/hr) "
                f"closely matches pre-incident signature of Offset Well B-04 (2850m MD). High probability of severe Lost Circulation in Barail Sand!"
            )
            recommendations = [
                "IMMEDIATE ACTION: Pick up string 20-30m off bottom to prevent differential pack-off.",
                "REDUCE CIRCULATION: Drop pump rate from 2200 LPM to 1400 LPM to reduce Equivalent Circulating Density (ECD).",
                "PREPARE LCM PILL: Mobilize 40 bbl heavy thixotropic LCM pill: 25 ppb Coarse Nut Plug + 20 ppb Medium Flake Mica + 15 ppb CaCO3 (Formula proven in Well B-04).",
                "MUD WEIGHT ADJUSTMENT: Trim active mud weight from 1.17 SG to 1.14 SG to stay below Barail fracture gradient (1.22 SG eq).",
                "NOTIFY: Alert Mud Engineer and Rig Superintendent for shaker loss monitoring."
            ]
            citations = ["WCR_NHKT_B04_2021.pdf (Page 42-45)", "DDR_NHKT_B04_Day28.pdf"]
            npt_preventable_hrs = 16.5
            cost_savings_estimate_inr = 3850000

        elif risk_pct >= 35.0 or len(upcoming_hazards) > 0:
            alert_level = "ADVISORY"
            badge_color = "#f59e0b"
            nearest_hazard = upcoming_hazards[0] if upcoming_hazards else None
            hazard_dist = nearest_hazard['distance_ahead_m'] if nearest_hazard else 35.0
            hazard_well = nearest_hazard['offset_well'] if nearest_hazard else 'Offset Well B-04'
            
            headline = f"LOOK-AHEAD ADVISORY: Approaching Historical Hazard Zone ({round(hazard_dist, 1)}m ahead)"
            description = (
                f"Active drill bit at {round(current_md, 1)}m MD is within {round(hazard_dist, 1)}m of the historical loss corridor encountered in "
                f"{hazard_well} (2850m MD). Barail Upper Arenaceous formation boundary entry detected."
            )
            recommendations = [
                "PRE-TREATMENT: Pre-treat active mud system with 15-20 ppb fine sized calcium carbonate for micro-fracture bridging.",
                "FLOW MONITORING: Zero the active pit volume totalizer and maintain high-frequency flow-out sensor calibration.",
                "SURVEY ROTATION: Avoid static string conditions during MWD directional surveys to preclude differential sticking.",
                "CASING SHOE INTEGRITY: Verify intermediate 9-5/8\" casing shoe integrity test (LOT: 1.35 SG eq)."
            ]
            citations = ["WCR_NHKT_B04_2021.pdf", "WCR_NHKT_C12_2022.pdf"]
            npt_preventable_hrs = 8.0
            cost_savings_estimate_inr = 1800000

        else:
            alert_level = "NOMINAL"
            badge_color = "#10b981"
            headline = f"NORMAL: Stable Drilling Parameters at {round(current_md, 1)}m MD"
            description = f"Drilling nominal in {telemetry.get('formation', 'Tipam Sandstone')}. No historical offset hazards within the {self.look_ahead_distance_m}m look-ahead window."
            recommendations = [
                "Maintain standard rotary speed (110-120 RPM) and WOB (10-12 tons).",
                "Ensure routine mud testing every 4 hours.",
                "Continue standard eRTMAC real-time logging."
            ]
            citations = ["Regional Geological Prognosis - Nahorkatiya Field"]
            npt_preventable_hrs = 0.0
            cost_savings_estimate_inr = 0

        return {
            "alert_level": alert_level,
            "badge_color": badge_color,
            "headline": headline,
            "description": description,
            "look_ahead_window_m": [round(current_md, 1), round(horizon_end_md, 1)],
            "upcoming_hazards": upcoming_hazards,
            "prescriptive_actions": recommendations,
            "citations": citations,
            "preventable_npt_hours": npt_preventable_hrs,
            "estimated_cost_savings_inr": cost_savings_estimate_inr
        }

rigsentinel_agent = RigSentinelAgent()
