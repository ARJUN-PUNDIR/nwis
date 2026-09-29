import React, { useState } from 'react';
import { Table, Filter, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function OffsetComparisonTable({ nearbyWells }) {
  const [filterType, setFilterType] = useState('ALL');

  const rows = [
    {
      well: "Active Well A (NHKT-A01)",
      dist: "0.0 km",
      interCasing: "9-5/8\" @ 2750m",
      prodCasing: "7\" (Plan 3400m)",
      mudDensity: "1.17 SG",
      npt: "0.0 hrs",
      incident: "None (Active Drilling)",
      category: "ACTIVE",
      lessons: "Intermediate casing set above Barail; requires LCM pre-treatment."
    },
    {
      well: "Offset Well B-04",
      dist: "1.24 km",
      interCasing: "9-5/8\" @ 2760m",
      prodCasing: "7\" @ 3350m",
      mudDensity: "1.20 → 1.15 SG",
      npt: "16.5 hrs",
      incident: "Severe Mud Loss @ 2850m (28.5 m³/hr)",
      category: "MUD_LOSS",
      lessons: "ECD > 1.18 SG caused induced fracturing. Solved with 40 bbl Nut Plug + Mica pill."
    },
    {
      well: "Offset Well C-12",
      dist: "2.08 km",
      interCasing: "9-5/8\" @ 2810m",
      prodCasing: "7\" @ 3390m",
      mudDensity: "1.24 → 1.16 SG",
      npt: "24.0 hrs",
      incident: "Differential Stuck Pipe @ 2910m",
      category: "STUCK_PIPE",
      lessons: "Excessive overbalance (480 psi). Solved with 50 bbl lubricant soak + 140 jars."
    },
    {
      well: "Offset Well D-08",
      dist: "3.44 km",
      interCasing: "9-5/8\" @ 2740m",
      prodCasing: "7\" @ 3500m",
      mudDensity: "1.15 → 1.29 SG",
      npt: "31.0 hrs",
      incident: "Well Kick / Gas Influx @ 3000m",
      category: "WELL_KICK",
      lessons: "Kopili shale transition overpressured. Driller's Method kill with 1.29 SG mud."
    },
    {
      well: "Offset Well E-02",
      dist: "4.14 km",
      interCasing: "9-5/8\" @ 2790m",
      prodCasing: "7\" @ 3300m",
      mudDensity: "1.16 SG",
      npt: "6.5 hrs",
      incident: "Seepage Mud Loss @ 2870m (7.8 m³/hr)",
      category: "MUD_LOSS",
      lessons: "Sealed early with 15 ppb Fine CaCO3 sweep."
    },
    {
      well: "Offset Well F-15",
      dist: "6.82 km",
      interCasing: "9-5/8\" @ 2810m",
      prodCasing: "7\" @ 3450m",
      mudDensity: "1.14 SG",
      npt: "18.0 hrs",
      incident: "Poor Cement Bond @ 2810m Casing Shoe",
      category: "CEMENTING",
      lessons: "Lost circulation during lead slurry. Remediated via block squeeze cementing."
    }
  ];

  const filtered = filterType === 'ALL' ? rows : rows.filter(r => r.category === filterType || r.category === 'ACTIVE');

  return (
    <div className="panel-card">
      <div className="panel-header">
        <div className="panel-title">
          <Table size={19} style={{ color: 'var(--active-blue)' }} />
          Cross-Well Parameter Correlation & Drilling Experience Matrix
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', 'MUD_LOSS', 'STUCK_PIPE', 'WELL_KICK', 'CEMENTING'].map((type) => (
            <button
              key={type}
              className={`radius-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="petro-table">
          <thead>
            <tr>
              <th>Well Name</th>
              <th>Distance</th>
              <th>Intermediate Shoe</th>
              <th>Production Liner</th>
              <th>Mud Density</th>
              <th>NPT Loss</th>
              <th>Encountered Incident</th>
              <th>Proven Mitigation / Lesson</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={idx} style={{ background: r.category === 'ACTIVE' ? 'var(--active-blue-bg)' : '#ffffff' }}>
                <td style={{ fontWeight: 700, color: r.category === 'ACTIVE' ? 'var(--active-blue)' : 'var(--text-main)' }}>
                  {r.well}
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{r.dist}</td>
                <td style={{ fontFamily: 'monospace' }}>{r.interCasing}</td>
                <td style={{ fontFamily: 'monospace' }}>{r.prodCasing}</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--oil-amber)', fontWeight: 700 }}>{r.mudDensity}</td>
                <td style={{ fontFamily: 'monospace', color: r.npt !== '0.0 hrs' ? 'var(--alert-danger)' : 'var(--alert-success)', fontWeight: 800 }}>
                  {r.npt}
                </td>
                <td style={{ color: r.category === 'ACTIVE' ? 'var(--active-blue)' : 'var(--alert-danger)', fontWeight: 600 }}>
                  {r.incident}
                </td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-body)', lineHeight: 1.45 }}>
                  {r.lessons}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
