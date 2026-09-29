import React from 'react';
import { Play, Pause, FastForward, RotateCcw, AlertTriangle, AlertCircle, Compass } from 'lucide-react';

export default function SimulatorControls({ 
  snapshot, 
  onStep, 
  onJump, 
  onReset, 
  onToggleAuto, 
  radius, 
  onRadiusChange 
}) {
  const isSimulating = snapshot?.telemetry?.is_simulating || false;
  const currentDepth = snapshot?.telemetry?.measured_depth_m || 2740.0;
  const radii = [1, 3, 5, 10, 15];

  return (
    <div className="sim-controls-bar">
      <div className="sim-actions">
        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginRight: '0.4rem' }}>
          DRILL SIMULATOR:
        </span>

        <button 
          className={`btn ${isSimulating ? 'btn-hazard' : 'btn-primary'}`}
          onClick={onToggleAuto}
          title="Toggle continuous drilling simulation"
        >
          {isSimulating ? <Pause size={14} /> : <Play size={14} />}
          {isSimulating ? 'Pause Auto-Drill' : 'Start Auto-Drill'}
        </button>

        <button 
          className="btn"
          onClick={() => onStep(0.5)}
          title="Drill forward 0.5 meters"
        >
          <FastForward size={14} />
          Step (+0.5m)
        </button>

        <button 
          className="btn btn-advisory"
          onClick={() => onJump(2820.0)}
          title="Jump directly to 2820m to trigger Advisory Look-Ahead"
        >
          <AlertTriangle size={14} />
          Demo Advisory (2820m)
        </button>

        <button 
          className="btn btn-hazard"
          onClick={() => onJump(2848.0)}
          title="Jump directly to 2848m to trigger Critical Mud Loss Anomaly"
        >
          <AlertCircle size={14} />
          Demo Hazard Anomaly (2848m)
        </button>

        <button 
          className="btn"
          onClick={onReset}
          title="Reset simulator back to 2740m"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="radius-filter-group">
        <Compass size={14} style={{ color: '#06b6d4' }} />
        <span>Offset Radius:</span>
        {radii.map((r) => (
          <button
            key={r}
            className={`radius-btn ${radius === r ? 'active' : ''}`}
            onClick={() => onRadiusChange(r)}
          >
            {r} km
          </button>
        ))}
      </div>
    </div>
  );
}
