"""
documents_data.py - Simulated Well Completion Reports (WCR), Daily Drilling Reports (DDR),
and Mud Engineering Records for Oil India Limited (OIL).
Contains raw text, OCR artifacts, and structured metadata for Agent 1 (DocuStratum).
"""

from typing import List, Dict, Any

RAW_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "doc_id": "DOC-WCR-B04",
        "title": "Well Completion Report - NHKT-B04",
        "doc_type": "WCR",
        "well_id": "NHKT-B04",
        "field": "Nahorkatiya",
        "year": 2021,
        "page_count": 84,
        "content_excerpt": """
OIL INDIA LIMITED
DRILLING SERVICES DIVISION - DULIAJAN, ASSAM
WELL COMPLETION REPORT: NHKT-B04 (WELL NO. 4, SECTOR B)

1.0 WELL SUMMARY:
Spud Date: 12-APR-2021 | Completion Date: 18-JUN-2021 | Rig: OIL E-2000
Target Formation: Barail / Kopili | Total Depth: 3380 m MD / 3260 m TVD
Status: Oil Producer (Barail Main Sand)

2.0 STRATIGRAPHIC TOPS:
Alluvium: 0 - 340m
Dhekiajuli Sandstone: 340 - 1160m
Girujan Clay: 1160 - 1975m (Reactive shales, minor washouts)
Tipam Sandstone: 1975 - 2780m
Barail Group: 2780 - 3260m
Kopili Formation: 3260 - 3380m (TD reached)

3.0 MAJOR OPERATIONAL PROBLEMS & UNPLANNED EVENTS:
At depth 2850 m MD while drilling 8-1/2" hole with 1.20 SG KCl-Polymer mud, severe partial-to-total loss of circulation was encountered in upper Barail Arenaceous member.
- Standpipe pressure abruptly dropped by 180 psi.
- Active pit volume loss: 28.5 m3/hr.
- Drilling immediately suspended. String pulled 30m off bottom to 2820m.
- Remedial Action: Mixed and pumped 40 bbl heavy thixotropic LCM pill comprising:
  * 25 ppb Coarse Ground Walnut Shells (Nut Plug)
  * 20 ppb Medium Flake Mica
  * 15 ppb Sized Calcium Carbonate (Safecarb 250)
- Pill spotted across 2850-2820m interval and allowed to soak for 3 hours.
- Reduced circulating density from 1.20 SG to 1.15 SG to stay below formation fracture pressure (estimated at 1.22 SG equivalent).
- Drilling resumed with stabilized mud levels; residual seepage < 0.5 m3/hr.
Total NPT incurred: 16.5 hours. Estimated cost of lost mud and rig downtime: Rs 38.5 Lakhs.

4.0 RECOMMENDATION FOR FUTURE OFFSET WELLS:
The Barail sand at 2840-2870m in this structural block is sub-normally pressured and naturally micro-fractured.
Keep ECD strictly below 1.18 SG. Ensure 30 ppb sized LCM pre-treated in active system prior to entering Barail top at 2780m.
""",
        "keywords": ["mud loss", "lost circulation", "Barail", "2850m", "LCM pill", "Nut Plug", "Mica", "1.15 SG", "NPT"]
    },
    {
        "doc_id": "DOC-DDR-C12",
        "title": "Daily Drilling Report - NHKT-C12 (Day 34)",
        "doc_type": "DDR",
        "well_id": "NHKT-C12",
        "field": "Nahorkatiya",
        "year": 2022,
        "page_count": 4,
        "content_excerpt": """
OIL INDIA LIMITED - DAILY DRILLING REPORT (DDR #34)
RIG: OIL-14 | WELL: NHKT-C12 | DATE: 18-FEB-2022
CURRENT DEPTH: 2910 m MD | 24-HR PROGRESS: 18 m

TIME BREAKDOWN & OPERATIONS SUMMARY:
00:00 - 06:30: Drilling 8-1/2" hole from 2892m to 2910m. WOB: 14 tons, RPM: 110, Torque: 18-20 kNm, ROP: 3.2 m/hr.
06:30 - 07:15: Made connection at 2910m. Attempted to rotate and reciprocate string; string stuck tight.
07:15 - 12:00: Identified as DIFFERENTIAL STUCK PIPE across depleted Barail permeable sand (Porosity 22%, Perm 180 mD).
Active mud weight: 1.24 SG (Estimated reservoir pore pressure: 1.05 SG; Overbalance = 480 psi).
Pull up to 85,000 lbs overpull above string weight; zero movement. Torque stalled at 38 kNm.
12:00 - 18:30: Mixed 50 bbl pipe-freeing lubricant soak pill (Invert emulsion with glycol lubricant). Displaced around BHA and drill collars at 2910m.
18:30 - 06:00: Soaked pill for 6 hours. Engaged hydraulic fishing jars upward with 120,000 lbs pull. After 140 jars and continuous torque pulsing, string jarred free at 03:45 hrs.
Conditioned mud and reduced weight to 1.16 SG.
Total NPT: 24.0 hours.

LESSONS LEARNED:
Never allow static pipe across permeable Barail sandstone intervals when overbalance exceeds 250 psi. Maintain pipe rotation during all survey/connection operations.
""",
        "keywords": ["stuck pipe", "differential sticking", "2910m", "overbalance", "jarring", "pipe-freeing soak", "24 hr NPT"]
    },
    {
        "doc_id": "DOC-WCR-D08",
        "title": "Well Completion Report - NHKT-D08",
        "doc_type": "WCR",
        "well_id": "NHKT-D08",
        "field": "Nahorkatiya",
        "year": 2020,
        "page_count": 96,
        "content_excerpt": """
OIL INDIA LIMITED - DULIAJAN
WELL COMPLETION REPORT: NHKT-D08
SECTION 4: WELL CONTROL EVENT RECORD

Depth: 3000 m MD / 2930 m TVD | Formation: Kopili Shale Overpressured Transition
Date of Incident: 22-SEP-2020 | Rig: OIL-08

SEQUENCE OF EVENTS:
- At 2998m, abrupt drilling break recorded: ROP jumped from 5.5 m/hr to 24 m/hr.
- Flow sensors triggered: Pit gain of +3.5 m3 in 8 minutes. Gas units increased from 15 units to 340 units (Peak C1/C2 ratio: 12.8).
- Flow check positive with pumps off.
- Executed hard shut-in procedure: Closed Annular Preventer, opened HCR valve to choke manifold.
- Stabilized Shut-in Pressures:
  * SIDPP (Shut-in Drill Pipe Pressure): 340 psi
  * SICP (Shut-in Casing Pressure): 510 psi
- Influx calculated as formation methane gas with trace condensate.
- Formation pore pressure calculated at 1.26 SG equivalent (vs current mud weight of 1.15 SG).
- Killed well using Driller's Method:
  * 1st Circulation: Pumped out gas kick volume holding drillpipe pressure constant.
  * 2nd Circulation: Displaced hole with 1.29 SG heavy barite-weighted kill mud.
- Well controlled successfully without underground blowout or casing shoe rupture.
NPT: 31.0 hours.

CRITICAL DIRECTIVE:
Southern flank of Nahorkatiya structure features an elevated Kopili formation overpressure boundary starting at 2980m MD. Wells drilling into this sector must maintain 1.25+ SG mud weight prior to drilling past 2975m.
""",
        "keywords": ["well kick", "gas influx", "3000m", "Kopili", "shut-in", "Driller's Method", "kill mud", "1.29 SG", "SIDPP", "31 hr NPT"]
    }
]
