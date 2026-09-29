import React, { useState } from 'react';
import { Camera, MapPin, Upload, X, CheckCircle, Navigation } from 'lucide-react';

export default function GeoTagModal({ isOpen, onClose, onResolve }) {
  const [lat, setLat] = useState('27.2850');
  const [lon, setLon] = useState('95.3210');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Simulate EXIF extraction from sample wellhead photo
      setLat('27.2850');
      setLon('95.3210');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const res = await fetch('http://localhost:8001/api/geotag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          lat: lat,
          lon: lon
        })
      });
      const data = await res.json();
      onResolve(data);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Camera size={20} style={{ color: 'var(--active-blue)' }} />
            Geo-Tag Site Photo & Coordinate Inquiry
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Upload a wellsite photo with GPS metadata, or enter rig coordinates to automatically resolve nearby offset wells, formation boundaries, and historical drilling hazards.
        </p>

        {/* Upload Drop Area */}
        <label style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '1.75rem', 
          background: 'var(--bg-subtle)', 
          border: '1.5px dashed var(--border-medium)', 
          borderRadius: '8px', 
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}>
          <Upload size={28} style={{ color: 'var(--active-blue)', marginBottom: '0.5rem' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {fileName ? `Attached: ${fileName}` : 'Drop wellsite photo or click to browse'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            Supports JPEG, PNG with EXIF GPS tags
          </span>
          <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>

        {/* Manual Coordinates Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Or Enter Rig Coordinates
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Latitude (°N)</label>
              <input 
                type="text" 
                value={lat} 
                onChange={(e) => setLat(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.2rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Longitude (°E)</label>
              <input 
                type="text" 
                value={lon} 
                onChange={(e) => setLon(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-medium)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '0.2rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isUploading}>
            <Navigation size={14} />
            {isUploading ? 'Resolving Offset Intelligence...' : 'Resolve Offset Intelligence'}
          </button>
        </div>
      </div>
    </div>
  );
}
