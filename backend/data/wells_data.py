"""
wells_data.py - Realistic Geological & Offset Well Database for Oil India Limited (OIL)
Operational Region: Upper Assam Basin (Nahorkatiya / Moran / Duliajan Fields)
"""

from typing import List, Dict, Any

# Regional Formations Stratigraphic Column
STRATIGRAPHIC_COLUMN = [
    {
        "formation": "Alluvium",
        "lithology": "Unconsolidated sands, gravels, and clays",
        "typical_top_md": 0,
        "typical_base_md": 350,
        "hazard_type": "Surface washouts, gravel packing issues"
    },
    {
        "formation": "Dhekiajuli",
        "lithology": "Coarse to fine sandstones with minor clay bands",
        "typical_top_md": 350,
        "typical_base_md": 1150,
        "hazard_type": "Loss of circulation in coarse unconsolidated beds"
    },
    {
        "formation": "Girujan Clay",
        "lithology": "Mottled clay, shales, silty claystones",
        "typical_top_md": 1150,
        "typical_base_md": 1980,
        "hazard_type": "Reactive shale swelling, bit balling, tight hole, pack-offs"
    },
    {
        "formation": "Tipam Sandstone",
        "lithology": "Massive medium to coarse grained sandstone with intercalated shales",
        "typical_top_md": 1980,
        "typical_base_md": 2780,
        "hazard_type": "Differential sticking across thick permeable sand bodies"
    },
    {
        "formation": "Barail Group (Main Coal-Shale / Sand)",
        "lithology": "Alternating sandstones, carbonaceous shales, and sub-bituminous coal seams",
        "typical_top_md": 2780,
        "typical_base_md": 3250,
        "hazard_type": "HIGH RISK: Sub-normal pore pressure zones, natural micro-fractures, severe mud losses (15-40 m3/hr), coal sloughing, torque spikes"
    },
    {
        "formation": "Kopili Shale",
        "lithology": "Dark grey to black fissile marine shales with calcareous bands",
        "typical_top_md": 3250,
        "typical_base_md": 3600,
        "hazard_type": "CRITICAL RISK: Abnormal overpressure ramps, gas influx / kicks, hole collapse"
    }
]

# Active Well Profile (Currently Drilling)
ACTIVE_WELL = {
    "well_id": "NHKT-A01",
    "name": "Nahorkatiya South A-01",
    "status": "DRILLING_ACTIVE",
    "field": "Nahorkatiya",
    "rig_name": "OIL CyberRig-14 (2000 HP)",
    "operator": "Oil India Limited (OIL)",
    "latitude": 27.2850,
    "longitude": 95.3210,
    "target_td_md": 3450.0,
    "target_td_tvd": 3310.0,
    "current_depth_md": 2740.0,
    "current_depth_tvd": 2690.0,
    "formation_entry_depths": {
        "Girujan Clay": 1180.0,
        "Tipam Sandstone": 2010.0,
        "Barail Group": 2815.0,  # Note structural dip: starts at ~2815m MD
        "Kopili Shale": 3290.0
    },
    "casing_program": [
        {"section": "Conductor", "hole_size_in": 26.0, "casing_od_in": 20.0, "shoe_depth_md": 145.0, "status": "SET_CEMENTED"},
        {"section": "Surface", "hole_size_in": 17.5, "casing_od_in": 13.375, "shoe_depth_md": 1150.0, "status": "SET_CEMENTED"},
        {"section": "Intermediate", "hole_size_in": 12.25, "casing_od_in": 9.625, "shoe_depth_md": 2750.0, "status": "SET_CEMENTED"},
        {"section": "Production Liner (Planned)", "hole_size_in": 8.5, "casing_od_in": 7.0, "shoe_depth_md": 3400.0, "status": "PLANNED"}
    ],
    "current_mud_properties": {
        "mud_type": "KCl-Polymer Glycol Water-Based Mud",
        "density_sg": 1.17,
        "funnel_viscosity_sec": 48,
        "plastic_viscosity_cp": 19,
        "yield_point_lb_100ft2": 24,
        "ph": 9.4,
        "chlorides_mg_l": 24000
    }
}

# Historical Offset Wells
OFFSET_WELLS: List[Dict[str, Any]] = [
    {
        "well_id": "NHKT-B04",
        "name": "Nahorkatiya B-04 (Offset Well B)",
        "latitude": 27.2838,
        "longitude": 95.3085,
        "distance_km": 1.24,
        "bearing_deg": 263.0,
        "total_depth_md": 3380.0,
        "spud_date": "2021-04-12",
        "completion_date": "2021-06-18",
        "status": "PRODUCING",
        "formation_tops": {
            "Girujan Clay": 1160.0,
            "Tipam Sandstone": 1975.0,
            "Barail Group": 2780.0,
            "Kopili Shale": 3260.0
        },
        "incidents": [
            {
                "event_id": "INC-B04-01",
                "type": "MUD_LOSS",
                "severity": "CRITICAL",
                "depth_md": 2850.0,
                "depth_tvd": 2795.0,
                "formation": "Barail Group (Upper Sand member)",
                "loss_rate_m3_hr": 28.5,
                "total_loss_m3": 142.0,
                "npt_hours": 16.5,
                "pre_event_indicators": "Sudden ROP drop from 18 m/hr to 4 m/hr, torque erratic oscillation (15-28 kNm), pump pressure dropped by 180 psi, pit volume loss detected (-4.2 m3 in 10 mins)",
                "mitigation": "Pulled bit 30m off bottom. Mixed and spotted 40 bbl heavy LCM pill (25 ppb Coarse Nut Plug, 20 ppb Medium Flake Mica, 15 ppb CaCO3). Reduced active mud weight from 1.20 SG to 1.15 SG. Circulated slowly at 1200 LPM. Losses mitigated to 0.5 m3/hr.",
                "lessons_learned": "Barail sand in this structural fault block has fracture gradient of only 1.22 SG equivalent. Any mud weight exceeding 1.18 SG with high ECD causes immediate induced hydraulic fracturing.",
                "wcr_doc_reference": "WCR_NHKT_B04_2021.pdf (Page 42-45)",
                "ddr_reference": "DDR_NHKT_B04_Day28.pdf"
            }
        ],
        "casing_summary": "20in @ 140m | 13-3/8in @ 1140m | 9-5/8in @ 2760m | 7in @ 3350m"
    },
    {
        "well_id": "NHKT-C12",
        "name": "Nahorkatiya C-12 (Offset Well C)",
        "latitude": 27.2995,
        "longitude": 95.3340,
        "distance_km": 2.08,
        "bearing_deg": 38.0,
        "total_depth_md": 3410.0,
        "spud_date": "2022-01-15",
        "completion_date": "2022-03-29",
        "status": "PRODUCING",
        "formation_tops": {
            "Girujan Clay": 1195.0,
            "Tipam Sandstone": 2025.0,
            "Barail Group": 2825.0,
            "Kopili Shale": 3310.0
        },
        "incidents": [
            {
                "event_id": "INC-C12-01",
                "type": "STUCK_PIPE",
                "severity": "HIGH",
                "depth_md": 2910.0,
                "depth_tvd": 2840.0,
                "formation": "Barail Group (High Permeability Sand Member)",
                "loss_rate_m3_hr": 0.0,
                "total_loss_m3": 0.0,
                "npt_hours": 24.0,
                "pre_event_indicators": "Drilling stalled during connection at 2910m. Overpull on elevators exceeded 75,000 lbs. Rotary torque maxed out at 38 kNm. High mud weight (1.24 SG) created 450 psi overbalance on depleted sand.",
                "mitigation": "Pumped 50 bbl pipe-freeing lubricant soak (Asphaltic blend). Cocked hydraulic fishing jars and delivered 140 upward jars while reciprocating string. String released after 19 hours of jarring. Reconditioned mud to 1.16 SG.",
                "lessons_learned": "Avoid stationary pipe during connections across permeable Barail intervals. Keep pipe rotating and reciprocated. Limit overbalance pressure < 250 psi.",
                "wcr_doc_reference": "WCR_NHKT_C12_2022.pdf (Page 67-71)",
                "ddr_reference": "DDR_NHKT_C12_Day34.pdf"
            }
        ],
        "casing_summary": "20in @ 150m | 13-3/8in @ 1180m | 9-5/8in @ 2810m | 7in @ 3390m"
    },
    {
        "well_id": "NHKT-D08",
        "name": "Nahorkatiya D-08 (Offset Well D)",
        "latitude": 27.2540,
        "longitude": 95.3200,
        "distance_km": 3.44,
        "bearing_deg": 182.0,
        "total_depth_md": 3550.0,
        "spud_date": "2020-08-10",
        "completion_date": "2020-11-04",
        "status": "SHUT_IN",
        "formation_tops": {
            "Girujan Clay": 1150.0,
            "Tipam Sandstone": 1960.0,
            "Barail Group": 2760.0,
            "Kopili Shale": 2980.0
        },
        "incidents": [
            {
                "event_id": "INC-D08-01",
                "type": "WELL_KICK",
                "severity": "CRITICAL",
                "depth_md": 3000.0,
                "depth_tvd": 2930.0,
                "formation": "Kopili Overpressured Shale Transition",
                "loss_rate_m3_hr": 0.0,
                "total_loss_m3": 0.0,
                "npt_hours": 31.0,
                "pre_event_indicators": "Drilling break: ROP surged from 6 to 24 m/hr. Background gas jumped from 1.2% to 18.5%. Active pit volume gained +3.5 m3 in 8 minutes. Flow detected with pumps stopped.",
                "mitigation": "Hard shut-in performed via Annular BOP. SIDPP = 340 psi, SICP = 510 psi. Executed Driller's Method well kill over 2 circulations. Raised kill mud weight from 1.15 SG to 1.29 SG to balance formation pore pressure.",
                "lessons_learned": "Kopili shale transition has steep pore pressure ramp (up to 1.26 SG equivalent). Transition depth in this southern fault block rises by nearly 180m compared to north.",
                "wcr_doc_reference": "WCR_NHKT_D08_2020.pdf (Page 88-94)",
                "ddr_reference": "DDR_NHKT_D08_Day48.pdf"
            }
        ],
        "casing_summary": "20in @ 135m | 13-3/8in @ 1120m | 9-5/8in @ 2740m | 7in @ 3500m"
    },
    {
        "well_id": "NHKT-E02",
        "name": "Nahorkatiya E-02 (Offset Well E)",
        "latitude": 27.3120,
        "longitude": 95.2950,
        "distance_km": 4.14,
        "bearing_deg": 312.0,
        "total_depth_md": 3320.0,
        "spud_date": "2023-03-01",
        "completion_date": "2023-05-10",
        "status": "PRODUCING",
        "formation_tops": {
            "Girujan Clay": 1175.0,
            "Tipam Sandstone": 1990.0,
            "Barail Group": 2805.0,
            "Kopili Shale": 3280.0
        },
        "incidents": [
            {
                "event_id": "INC-E02-01",
                "type": "MUD_LOSS",
                "severity": "MODERATE",
                "depth_md": 2870.0,
                "depth_tvd": 2810.0,
                "formation": "Barail Group (Upper Sand member)",
                "loss_rate_m3_hr": 7.8,
                "total_loss_m3": 38.0,
                "npt_hours": 6.5,
                "pre_event_indicators": "Pit level decline detected (-1.5 m3/hr). Pump pressure steady.",
                "mitigation": "Added 15 ppb Fine Calcium carbonate sweep directly into suction tank. Mud weight trimmed to 1.16 SG.",
                "lessons_learned": "Seepage losses in Barail can be quickly healed if treated immediately with fine particulate bridging agents before fractures widen.",
                "wcr_doc_reference": "WCR_NHKT_E02_2023.pdf (Page 29)",
                "ddr_reference": "DDR_NHKT_E02_Day22.pdf"
            }
        ],
        "casing_summary": "20in @ 145m | 13-3/8in @ 1160m | 9-5/8in @ 2790m | 7in @ 3300m"
    },
    {
        "well_id": "NHKT-F15",
        "name": "Nahorkatiya F-15 (Offset Well F - 6.8 km)",
        "latitude": 27.2880,
        "longitude": 95.3900,
        "distance_km": 6.82,
        "bearing_deg": 87.0,
        "total_depth_md": 3480.0,
        "spud_date": "2019-11-05",
        "completion_date": "2020-01-20",
        "status": "PRODUCING",
        "formation_tops": {
            "Girujan Clay": 1185.0,
            "Tipam Sandstone": 2010.0,
            "Barail Group": 2810.0,
            "Kopili Shale": 3320.0
        },
        "incidents": [
            {
                "event_id": "INC-F15-01",
                "type": "POOR_CEMENT_BOND",
                "severity": "MODERATE",
                "depth_md": 2810.0,
                "depth_tvd": 2760.0,
                "formation": "Barail Casing Shoe Interval",
                "loss_rate_m3_hr": 0.0,
                "total_loss_m3": 0.0,
                "npt_hours": 18.0,
                "pre_event_indicators": "Lost circulation occurred during displacement of lead cement slurry across 2810m sand.",
                "mitigation": "Perforated casing at 2795m and executed block squeeze cementing with micro-fine cement.",
                "lessons_learned": "Use thixotropic lightweight slurry across Barail transition to avoid hydrostatic overload during cement job.",
                "wcr_doc_reference": "WCR_NHKT_F15_2019.pdf (Page 55)",
                "ddr_reference": "DDR_NHKT_F15_Day30.pdf"
            }
        ],
        "casing_summary": "20in @ 150m | 13-3/8in @ 1170m | 9-5/8in @ 2810m | 7in @ 3450m"
    }
]
