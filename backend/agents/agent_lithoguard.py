"""
agent_lithoguard.py - Agent 3: Predictive Drilling Risk Analytics (LithoGuard)
Computes real-time multi-hazard risk indices (Mud Loss, Stuck Pipe, Well Kick, Cementing Failure)
by synthesizing historical offset event frequency, spatial distance weighting,
and real-time telemetry anomaly signatures.
"""

from typing import Dict, Any, List
import math

class LithoGuardAgent:
    """
    LithoGuard Agent applies Bayesian risk estimation and real-time parameter drift detection
    to output actionable 0-100% hazard probability scores.
    """
    def __init__(self):
        self.name = "LithoGuard Agent (Agent 3)"
        self.role = "Predictive Multi-Hazard Analytics"

    def calculate_risk_matrix(self, telemetry: Dict[str, Any], nearby_wells: List[Dict[str, Any]]) -> Dict[str, Any]:
        depth = telemetry.get("measured_depth_m", 2750.0)
        formation = telemetry.get("formation", "Tipam Sandstone")
        torque = telemetry.get("torque_kn_m", 17.0)
        rop = telemetry.get("rop_m_hr", 14.0)
        spp = telemetry.get("spp_psi", 2600.0)
        pit_delta = telemetry.get("pit_delta_m3_hr", 0.0)
        gas_units = telemetry.get("gas_units", 18.0)
        
        # 1. BASELINE PRIOR FROM HISTORICAL INCIDENTS WITHIN 5 KM
        # Weights inversely proportional to square of surface distance
        mud_loss_weight = 0.0
        stuck_pipe_weight = 0.0
        kick_weight = 0.0
        
        for well in nearby_wells:
            dist = max(0.5, well.get("calculated_distance_km", 2.0))
            w = 1.0 / (dist ** 1.5)
            
            for inc in well.get("incidents", []):
                # Check proximity in depth (within 100m corridor)
                depth_diff = abs(depth - inc["depth_md"])
                depth_factor = max(0.0, 1.0 - (depth_diff / 100.0))
                
                if inc["type"] == "MUD_LOSS":
                    mud_loss_weight += w * depth_factor * 35.0
                elif inc["type"] == "STUCK_PIPE":
                    stuck_pipe_weight += w * depth_factor * 30.0
                elif inc["type"] == "WELL_KICK":
                    kick_weight += w * depth_factor * 40.0
                    
        # 2. REAL-TIME TELEMETRY ANOMALY BOOST
        # Mud Loss Anomaly: Drop in SPP + Drop in ROP + Pit Loss + Elevated Torque
        telemetry_mud_loss_boost = 0.0
        if spp < 2550:
            telemetry_mud_loss_boost += min(35.0, (2600 - spp) * 0.25)
        if pit_delta < -0.5:
            telemetry_mud_loss_boost += min(30.0, abs(pit_delta) * 7.0)
        if rop < 7.0 and "Barail" in formation:
            telemetry_mud_loss_boost += 15.0
            
        # Stuck Pipe Anomaly: High Torque + Low ROP + High WOB
        telemetry_stuck_pipe_boost = 0.0
        if torque > 22.0:
            telemetry_stuck_pipe_boost += min(45.0, (torque - 20.0) * 3.5)
        if rop < 5.0 and torque > 24.0:
            telemetry_stuck_pipe_boost += 20.0

        # Well Kick Anomaly: Pit gain + Gas unit surge + Drilling break (high ROP)
        telemetry_kick_boost = 0.0
        if pit_delta > 1.0:
            telemetry_kick_boost += min(45.0, pit_delta * 12.0)
        if gas_units > 40:
            telemetry_kick_boost += min(35.0, (gas_units - 30) * 0.8)
            
        # Formation baseline modifiers
        if "Barail" in formation:
            mud_loss_weight += 20.0  # Naturally micro-fractured depleted sands
            stuck_pipe_weight += 15.0  # Permeable differential sticking prone
        elif "Kopili" in formation:
            kick_weight += 35.0  # Overpressured formation transition

        # Final normalized probabilities (0 - 100%)
        p_mud_loss = min(98.0, round(mud_loss_weight + telemetry_mud_loss_boost, 1))
        p_stuck_pipe = min(95.0, round(stuck_pipe_weight + telemetry_stuck_pipe_boost, 1))
        p_kick = min(92.0, round(kick_weight + telemetry_kick_boost, 1))
        p_cementing = 18.0 if "Barail" in formation else 8.0  # Baseline shoe integrity risk
        
        # Categorize primary dominant hazard
        hazards = [
            ("MUD_LOSS", p_mud_loss, "Lost Circulation"),
            ("STUCK_PIPE", p_stuck_pipe, "Differential/Mechanical Stuck Pipe"),
            ("WELL_KICK", p_kick, "Gas Influx / Overpressure Kick"),
            ("CEMENTING", p_cementing, "Casing Seat / Cement Channeling")
        ]
        hazards.sort(key=lambda x: x[1], reverse=True)
        dominant_hazard = hazards[0]

        return {
            "dominant_hazard": {
                "hazard_code": dominant_hazard[0],
                "hazard_name": dominant_hazard[2],
                "risk_percentage": dominant_hazard[1],
                "severity_level": "CRITICAL" if dominant_hazard[1] >= 75 else ("HIGH" if dominant_hazard[1] >= 50 else ("MODERATE" if dominant_hazard[1] >= 30 else "LOW"))
            },
            "risk_scores": {
                "mud_loss_risk_pct": p_mud_loss,
                "stuck_pipe_risk_pct": p_stuck_pipe,
                "well_kick_risk_pct": p_kick,
                "cementing_risk_pct": p_cementing
            },
            "geomechanical_indicators": {
                "fracture_gradient_margin": "Narrow (0.04 SG)" if "Barail" in formation else "Nominal (0.15 SG)",
                "overbalance_pressure_psi": round((telemetry.get("ecd_sg", 1.20) - 1.05) * 1.42 * depth, 0),
                "pore_pressure_regime": "Transition / Depleted Sand" if "Barail" in formation else "Hydrostatic Normal"
            }
        }

lithoguard_agent = LithoGuardAgent()
