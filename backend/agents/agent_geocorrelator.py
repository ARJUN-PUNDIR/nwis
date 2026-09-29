"""
agent_geocorrelator.py - Agent 2: Spatial & Stratigraphic Depth Aligner (GeoCorrelator)
Calculates spatial proximity (Haversine distance & azimuth) and performs
Stratigraphic Cross-Section Alignment (TVD vs MD, Structural Dip Correction,
and Formation Relative Depth Mapping).
"""

import math
from typing import List, Dict, Any
from backend.data.wells_data import ACTIVE_WELL, OFFSET_WELLS, STRATIGRAPHIC_COLUMN

class GeoCorrelatorAgent:
    """
    GeoCorrelator Agent bridges surface geospatial distance (km) with 3D subsurface
    stratigraphic reality (TVD, structural dip, and formation tops).
    """
    def __init__(self):
        self.name = "GeoCorrelator Agent (Agent 2)"
        self.role = "Geospatial & Stratigraphic Correlation"
        self.active_well = ACTIVE_WELL
        self.offset_wells = OFFSET_WELLS

    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates surface distance in kilometers using the Haversine formula"""
        R = 6371.0  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    @staticmethod
    def calculate_bearing(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculates azimuth bearing in degrees from point 1 to point 2"""
        lat1_rad = math.radians(lat1)
        lat2_rad = math.radians(lat2)
        dlon_rad = math.radians(lon2 - lon1)
        
        y = math.sin(dlon_rad) * math.cos(lat2_rad)
        x = math.cos(lat1_rad) * math.sin(lat2_rad) - math.sin(lat1_rad) * math.cos(lat2_rad) * math.cos(dlon_rad)
        initial_bearing = math.atan2(y, x)
        compass_bearing = (math.degrees(initial_bearing) + 360) % 360
        return round(compass_bearing, 1)

    def get_nearby_wells(self, radius_km: float = 5.0) -> List[Dict[str, Any]]:
        """Filters offset wells within the specified radius from Active Well A"""
        act_lat = self.active_well["latitude"]
        act_lon = self.active_well["longitude"]
        
        nearby = []
        for well in self.offset_wells:
            dist = self.calculate_haversine_distance(act_lat, act_lon, well["latitude"], well["longitude"])
            bearing = self.calculate_bearing(act_lat, act_lon, well["latitude"], well["longitude"])
            
            if dist <= radius_km:
                well_copy = dict(well)
                well_copy["calculated_distance_km"] = dist
                well_copy["calculated_bearing_deg"] = bearing
                nearby.append(well_copy)
                
        # Sort by proximity
        nearby.sort(key=lambda x: x["calculated_distance_km"])
        return nearby

    def correlate_formation_depths(self, current_md: float) -> Dict[str, Any]:
        """
        Stratigraphic Alignment Engine:
        Maps active well depth to offset well horizons using Structural Dip Correction.
        Crucial: Barail top in Well B is 2780m, but in Well A it is 2815m.
        Therefore, an incident at 2850m in Well B (70m below Barail top) corresponds
        to 2815 + 70 = 2885m equivalent in Well A!
        """
        active_barail_top = self.active_well["formation_entry_depths"].get("Barail Group", 2815.0)
        
        correlated_events = []
        for well in self.offset_wells:
            offset_barail_top = well["formation_tops"].get("Barail Group", 2780.0)
            dip_shift = active_barail_top - offset_barail_top  # e.g., +35m structural down-dip
            
            for inc in well.get("incidents", []):
                event_md = inc["depth_md"]
                # Stratigraphically correlated equivalent depth in Active Well
                equiv_md_in_active = event_md + dip_shift
                depth_delta = equiv_md_in_active - current_md
                
                correlated_events.append({
                    "offset_well_id": well["well_id"],
                    "offset_well_name": well["name"],
                    "distance_km": well["distance_km"],
                    "event_type": inc["type"],
                    "severity": inc["severity"],
                    "historical_event_md": event_md,
                    "stratigraphic_equivalent_md_active_well": round(equiv_md_in_active, 1),
                    "current_bit_md": round(current_md, 1),
                    "depth_to_event_corridor_m": round(depth_delta, 1),
                    "formation": inc["formation"],
                    "mitigation": inc["mitigation"],
                    "doc_reference": inc["wcr_doc_reference"]
                })
                
        return {
            "current_active_depth_md": current_md,
            "active_formation_tops": self.active_well["formation_entry_depths"],
            "correlated_events": sorted(correlated_events, key=lambda x: abs(x["depth_to_event_corridor_m"]))
        }

    def get_stratigraphic_cross_section(self) -> Dict[str, Any]:
        """Provides structural cross-section layers across Well B -> Well A -> Well C"""
        cross_section_wells = [
            {
                "well_id": "NHKT-B04",
                "name": "Well B (West)",
                "distance_km": -1.24,
                "tops": {"Tipam": 1975, "Barail": 2780, "Kopili": 3260},
                "incident_marker": {"depth": 2850, "type": "MUD_LOSS", "label": "Severe Mud Loss 28.5 m3/hr"}
            },
            {
                "well_id": "NHKT-A01",
                "name": "Well A (Active)",
                "distance_km": 0.0,
                "tops": {"Tipam": 2010, "Barail": 2815, "Kopili": 3290},
                "incident_marker": None
            },
            {
                "well_id": "NHKT-C12",
                "name": "Well C (North-East)",
                "distance_km": 2.08,
                "tops": {"Tipam": 2025, "Barail": 2825, "Kopili": 3310},
                "incident_marker": {"depth": 2910, "type": "STUCK_PIPE", "label": "Differential Stuck Pipe (24 hr NPT)"}
            }
        ]
        return {
            "formation_layers": STRATIGRAPHIC_COLUMN,
            "cross_section_wells": cross_section_wells,
            "basin_structural_trend": "Regional dip 1.4 deg towards South-East; structural faults between Sector B and Sector C"
        }

geocorrelator_agent = GeoCorrelatorAgent()
