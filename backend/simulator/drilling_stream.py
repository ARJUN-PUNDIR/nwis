"""
drilling_stream.py - Real-Time eRTMAC Telemetry Simulator for Active Well A (NHKT-A01)
Simulates WITSML streaming data: Depth, ROP, WOB, Torque, RPM, Standpipe Pressure (SPP),
Mud Flow Rate, Pit Volume Delta, and Gas Units.
"""

import asyncio
import math
import random
import time
from typing import Dict, Any, Optional

class DrillingSimulator:
    def __init__(self, start_depth: float = 2740.0, end_depth: float = 2880.0):
        self.start_depth = start_depth
        self.end_depth = end_depth
        self.current_depth = start_depth
        self.is_running = False
        self.step_size = 0.5  # meters per tick
        self.interval_sec = 1.0  # seconds between ticks
        self.last_tick_time = time.time()
        self.tick_count = 0
        
        # Base nominal parameters
        self.wob = 11.5  # metric tons
        self.rpm = 120   # rpm
        self.mud_weight = 1.17  # SG
        
    def get_formation(self, depth: float) -> str:
        if depth < 1180.0:
            return "Dhekiajuli Sandstone"
        elif depth < 2010.0:
            return "Girujan Clay"
        elif depth < 2815.0:
            return "Tipam Sandstone"
        elif depth < 3290.0:
            return "Barail Group (Upper Sand/Coal)"
        else:
            return "Kopili Shale"

    def compute_telemetry(self, depth: float) -> Dict[str, Any]:
        """
        Calculates realistic drilling telemetry at a specific depth,
        faithfully reflecting physical phenomena:
        - Nominal drilling at 2740-2810m
        - Approaching Barail sand formation boundary at 2815m
        - Severe mud loss anomaly signature at 2840-2860m (matching Well B)
        """
        formation = self.get_formation(depth)
        
        # Calculate True Vertical Depth (slight directional inclination ~8 deg)
        tvd = depth * 0.982
        
        # Base values with minor realistic stochastic vibration
        noise = random.uniform(-0.3, 0.3)
        noise_torque = random.uniform(-0.8, 0.8)
        
        if depth < 2815.0:
            # Tipam Sandstone: clean, nominal drilling
            rop = 14.5 + random.uniform(-1.5, 1.5)
            torque = 17.2 + noise_torque
            spp = 2620 + random.uniform(-25, 25)
            mud_flow = 2200 + random.uniform(-15, 15)
            pit_gain_loss = random.uniform(-0.1, 0.1)
            gas_units = 18 + random.uniform(-3, 3)
            ecd = 1.20
            vibration = 1.8 + noise
            anomaly_detected = False
            anomaly_desc = "Nominal drilling parameters in Tipam Sandstone"
            
        elif 2815.0 <= depth < 2838.0:
            # Entering Barail Group transition: increased drag, lithology change
            dist_into_barail = depth - 2815.0
            rop = max(8.0, 13.0 - (dist_into_barail * 0.35) + random.uniform(-1.0, 1.0))
            torque = 18.5 + (dist_into_barail * 0.25) + noise_torque
            spp = 2650 + (dist_into_barail * 2.5) + random.uniform(-30, 30)
            mud_flow = 2195 + random.uniform(-20, 20)
            pit_gain_loss = random.uniform(-0.2, 0.1)
            gas_units = 25 + (dist_into_barail * 0.6) + random.uniform(-4, 4)
            ecd = 1.21
            vibration = 2.4 + noise
            anomaly_detected = False
            anomaly_desc = "Transitioning into Barail Group; slight torque elevation"
            
        elif 2838.0 <= depth <= 2862.0:
            # BARIAL FRACTURE ZONE (Matches Well B incident at 2850m)
            # Physical signature: abrupt ROP drop, severe torque spikes, SPP loss, negative flow delta
            proximity_to_fault = 1.0 - (abs(depth - 2850.0) / 15.0)
            proximity_to_fault = max(0.0, min(1.0, proximity_to_fault))
            
            rop = max(3.2, 11.0 - (proximity_to_fault * 7.5) + random.uniform(-0.8, 0.8))
            torque = 20.0 + (proximity_to_fault * 11.5) + random.uniform(-2.5, 3.5)
            spp = 2620 - (proximity_to_fault * 160.0) + random.uniform(-30, 30)
            mud_flow = 2200 - (proximity_to_fault * 280.0)  # Downhole fluid loss
            pit_gain_loss = - (proximity_to_fault * 4.8)    # Pit volume dropping rapidly!
            gas_units = 15 + random.uniform(-2, 4)
            ecd = 1.16  # Dropping hydrostatic column
            vibration = 4.2 + (proximity_to_fault * 2.1) + noise
            anomaly_detected = True
            anomaly_desc = f"SIGNATURE MATCH: Rapid SPP drop ({int(spp)} psi) & Torque spike ({round(torque, 1)} kNm). Severe Lost Circulation Anomaly!"
            
        else:
            # Past 2862m: Post-incident or controlled zone
            rop = 7.5 + random.uniform(-1.0, 1.0)
            torque = 21.0 + noise_torque
            spp = 2540 + random.uniform(-20, 20)
            mud_flow = 2100 + random.uniform(-15, 15)
            pit_gain_loss = -0.4
            gas_units = 28 + random.uniform(-3, 3)
            ecd = 1.18
            vibration = 2.5 + noise
            anomaly_detected = False
            anomaly_desc = "Slow controlled drilling in lower Barail unit"

        return {
            "timestamp": time.time(),
            "well_id": "NHKT-A01",
            "measured_depth_m": round(depth, 2),
            "true_vertical_depth_m": round(tvd, 2),
            "formation": formation,
            "rop_m_hr": round(rop, 2),
            "wob_tons": round(self.wob + random.uniform(-0.4, 0.4), 1),
            "torque_kn_m": round(torque, 1),
            "rpm": self.rpm + int(random.uniform(-3, 3)),
            "spp_psi": round(spp, 1),
            "mud_flow_lpm": round(mud_flow, 1),
            "pit_delta_m3_hr": round(pit_gain_loss, 2),
            "gas_units": round(gas_units, 1),
            "ecd_sg": round(ecd, 2),
            "vibration_g": round(vibration, 1),
            "anomaly_detected": anomaly_detected,
            "anomaly_desc": anomaly_desc,
            "is_simulating": self.is_running
        }

    def step(self, distance: Optional[float] = None) -> Dict[str, Any]:
        """Advance drilling by a step"""
        increment = distance if distance is not None else self.step_size
        self.current_depth = min(self.end_depth, self.current_depth + increment)
        return self.compute_telemetry(self.current_depth)

    def jump_to(self, depth: float) -> Dict[str, Any]:
        """Jump directly to a specific depth (e.g. 2820m or 2845m)"""
        self.current_depth = max(self.start_depth, min(self.end_depth, depth))
        return self.compute_telemetry(self.current_depth)

    def reset(self) -> Dict[str, Any]:
        """Reset simulator back to start depth"""
        self.current_depth = self.start_depth
        self.is_running = False
        return self.compute_telemetry(self.current_depth)

# Global simulator instance
simulator = DrillingSimulator(start_depth=2740.0, end_depth=2880.0)
