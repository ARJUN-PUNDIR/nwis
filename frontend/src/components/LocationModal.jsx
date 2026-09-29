import React, { useState } from 'react';
import { MapPin, Navigation, Edit3, CheckCircle2, Compass, AlertCircle, Sparkles, Layers } from 'lucide-react';

export default function LocationModal({ isOpen = true, onClose, currentLocation, onSelectLocation }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'gps' | 'custom'
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [detectedGps, setDetectedGps] = useState(null);

  // Custom location form state
  const [customName, setCustomName] = useState(currentLocation?.name || 'Custom Rig Asset');
  const [customWell, setCustomWell] = useState(currentLocation?.well || 'Active Well (Rig-Custom)');
  const [customLat, setCustomLat] = useState(currentLocation?.lat?.toString() || '27.2850');
  const [customLon, setCustomLon] = useState(currentLocation?.lon?.toString() || '95.3210');
  const [customDepth, setCustomDepth] = useState(currentLocation?.depth?.toString() || '2820');

  // Default Presets as requested by user
  const presets = [
    {
      id: 'nhkt-south',
      name: 'Nahorkatiya South Asset (Sector B)',
      well: 'Active Well: NHKT-A01 (Rig-14)',
      lat: 27.2850,
      lon: 95.3210,
      depth: 2820.0,
      isDefault: true,
      description: 'Primary Upper Assam high-risk corridor approaching Barail sand with known offset mud losses (B-04).'
    },
    {
      id: 'moran-central',
      name: 'Moran Field Central Sector',
      well: 'Active Well: MRN-C04 (Rig-09)',
      lat: 27.1950,
      lon: 94.9350,
      depth: 2950.0,
      isDefault: false,
      description: 'Permeable sandstone fairway with differential sticking history and 450 psi reservoir overbalance.'
    },
    {
      id: 'digboi-shelf',
      name: 'Digboi Shelf (Borpukhuri Block)',
      well: 'Active Well: DGB-102 (Rig-06)',
      lat: 27.3820,
      lon: 95.6310,
      depth: 2650.0,
      isDefault: false,
      description: 'Shallow Tipam/Girujan transition zone with micro-fracture seepage loss patterns.'
    },
    {
      id: 'kumchai-hp',
      name: 'Kumchai High-Pressure Corridor',
      well: 'Active Well: KM-02 (Rig-12)',
      lat: 27.4210,
      lon: 95.8120,
      depth: 3100.0,
      isDefault: false,
      description: 'Abnormal geopressure ramp requiring strict kill mud standby and BOP continuous monitoring.'
    }
  ];

  // GPS auto-detection handler
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser/device.");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(4));
        const lon = parseFloat(pos.coords.longitude.toFixed(4));
        setDetectedGps({
          lat,
          lon,
          accuracy: Math.round(pos.coords.accuracy)
        });
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(`Unable to retrieve GPS coordinates: ${err.message}. You can enter them manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleApplyGps = () => {
    if (!detectedGps) return;
    onSelectLocation({
      name: `Field Asset (GPS Detected)`,
      well: `Rig Position: ${detectedGps.lat}°N, ${detectedGps.lon}°E`,
      lat: detectedGps.lat,
      lon: detectedGps.lon,
      depth: 2820.0
    });
    onClose();
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const latNum = parseFloat(customLat) || 27.2850;
    const lonNum = parseFloat(customLon) || 95.3210;
    const depthNum = parseFloat(customDepth) || 2820.0;

    onSelectLocation({
      name: customName.trim() || 'Custom Rig Asset',
      well: customWell.trim() || 'Active Well (Rig-Custom)',
      lat: latNum,
      lon: lonNum,
      depth: depthNum
    });
    onClose();
  };

  const handleApplyPreset = (p) => {
    onSelectLocation({
      name: p.name,
      well: p.well,
      lat: p.lat,
      lon: p.lon,
      depth: p.depth
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '680px', maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
              <MapPin size={20} style={{ color: '#059669' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                Select Operational Rig Location &amp; Asset
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.76rem' }}>
                Configure the active coordinates and well profile that the entire OIL NWIS prototype operates on
              </p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* 3 Tab Options: Presets / GPS / Custom */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.65rem', marginTop: '0.4rem' }}>
          <button
            onClick={() => setActiveTab('presets')}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: activeTab === 'presets' ? 'var(--active-blue)' : 'var(--border-subtle)',
              background: activeTab === 'presets' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'presets' ? 'var(--active-blue)' : 'var(--text-body)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Compass size={14} />
            <span>Default Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('gps')}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: activeTab === 'gps' ? '#059669' : 'var(--border-subtle)',
              background: activeTab === 'gps' ? '#ecfdf5' : '#ffffff',
              color: activeTab === 'gps' ? '#059669' : 'var(--text-body)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Navigation size={14} />
            <span>Current GPS Location</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            style={{
              flex: 1,
              padding: '0.55rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: activeTab === 'custom' ? 'var(--oil-amber)' : 'var(--border-subtle)',
              background: activeTab === 'custom' ? '#fffbeb' : '#ffffff',
              color: activeTab === 'custom' ? '#b45309' : 'var(--text-body)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={14} />
            <span>Write Custom Location</span>
          </button>
        </div>

        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Choose from validated Upper Assam Basin oilfield presets:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
              {presets.map((p) => {
                const isSelected = currentLocation?.name === p.name || (p.isDefault && !currentLocation?.name);
                return (
                  <div
                    key={p.id}
                    onClick={() => handleApplyPreset(p)}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--active-blue)' : '1px solid var(--border-medium)',
                      background: isSelected ? '#f0f9ff' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                          {p.name}
                        </strong>
                        {p.isDefault && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#e0e7ff', color: '#4338ca', padding: '1px 6px', borderRadius: '4px' }}>
                            DEFAULT
                          </span>
                        )}
                        {isSelected && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--active-blue)', fontWeight: 600 }}>
                        {p.well}
                      </div>
                      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        {p.description}
                      </p>
                      <div style={{ marginTop: '0.4rem', fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                        Coords: {p.lat}°N, {p.lon}°E • Depth: {p.depth}m MD
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyPreset(p);
                      }}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '5px',
                        border: 'none',
                        background: isSelected ? 'var(--active-blue)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#334155',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isSelected ? 'Selected' : 'Use Preset'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CURRENT GPS LOCATION */}
        {activeTab === 'gps' && (
          <div style={{ marginTop: '0.85rem', padding: '1.25rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <Navigation size={24} />
            </div>

            <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Auto-Detect Rig Coordinates via GPS
            </h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
              Queries your browser / rig cabin device sensor to automatically lock onto your real-time surface coordinates.
            </p>

            {gpsError && (
              <div style={{ padding: '0.65rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '0.76rem', marginBottom: '0.85rem' }}>
                {gpsError}
              </div>
            )}

            {detectedGps ? (
              <div style={{ background: '#ffffff', border: '1.5px solid #16a34a', borderRadius: '8px', padding: '1rem', maxWidth: '380px', margin: '0 auto 1rem auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#16a34a', fontWeight: 800, fontSize: '0.88rem' }}>
                  <CheckCircle2 size={16} />
                  GPS Signal Locked
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 800, color: '#0f172a' }}>
                  {detectedGps.lat}° N, {detectedGps.lon}° E
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Signal Accuracy: ±{detectedGps.accuracy} meters
                </div>

                <button
                  onClick={handleApplyGps}
                  style={{
                    marginTop: '0.85rem',
                    width: '100%',
                    padding: '0.55rem',
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Apply &amp; Run Prototype with Current GPS
                </button>
              </div>
            ) : (
              <button
                onClick={handleDetectGps}
                disabled={gpsLoading}
                style={{
                  padding: '0.65rem 1.4rem',
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: gpsLoading ? 'wait' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Navigation size={15} />
                <span>{gpsLoading ? 'Acquiring Rig Satellites...' : 'Detect Current GPS Location'}</span>
              </button>
            )}
          </div>
        )}

        {/* TAB 3: WRITE CUSTOM LOCATION */}
        {activeTab === 'custom' && (
          <form onSubmit={handleApplyCustom} style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Manually type any rig location or asset coordinates to simulate:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Asset / Field Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Moran Oilfield Sector D"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Active Well &amp; Rig ID
                </label>
                <input
                  type="text"
                  value={customWell}
                  onChange={(e) => setCustomWell(e.target.value)}
                  placeholder="e.g. Active Well: MRN-D05 (Rig-08)"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Latitude (°N)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                  placeholder="27.2850"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Longitude (°E)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={customLon}
                  onChange={(e) => setCustomLon(e.target.value)}
                  placeholder="95.3210"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Drilling Depth (m MD)
                </label>
                <input
                  type="number"
                  step="1"
                  value={customDepth}
                  onChange={(e) => setCustomDepth(e.target.value)}
                  placeholder="2820"
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    fontFamily: 'monospace'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '0.55rem 1.25rem',
                  background: 'var(--active-blue)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Apply Custom Location
              </button>
            </div>
          </form>
        )}

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Active: <strong>{currentLocation?.name || 'Nahorkatiya South Asset (Sector B)'}</strong>
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
