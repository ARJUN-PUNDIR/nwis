import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Upload, 
  FileText, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  Layers,
  ShieldCheck,
  Globe,
  Clock,
  ArrowLeft,
  ChevronRight,
  Sliders,
  DollarSign
} from 'lucide-react';

import { BACKEND_URL } from '../apiConfig';

export default function CaseStudiesModal({ isOpen = true, onClose, onSelectCase }) {
  if (!isOpen) return null;

  // View state: 'landing' (2 choices only) | 'upload' | 'browse'
  const [viewMode, setViewMode] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResult, setUploadedResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Internet case study search state
  const [webQuery, setWebQuery] = useState('');
  const [isWebSearching, setIsWebSearching] = useState(false);
  const [webResults, setWebResults] = useState([]);

  // Fetch default curated cases from backend
  const fetchCaseStudies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/case-studies`);
      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.error("Error fetching case studies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  // Filter case studies by search query
  const filteredCases = cases.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.title?.toLowerCase().includes(q) ||
      c.formation?.toLowerCase().includes(q) ||
      c.hazard?.toLowerCase().includes(q) ||
      c.depth?.toLowerCase().includes(q) ||
      c.root_cause?.toLowerCase().includes(q) ||
      c.solution?.toLowerCase().includes(q)
    );
  });

  // Upload handler for custom PDF
  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${BACKEND_URL}/api/case-studies/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      setUploadedResult(data.case);
      await fetchCaseStudies();
    } catch (err) {
      console.error("PDF upload error:", err);
      setUploadError("Could not parse file. Please verify file format (.pdf or .txt).");
    } finally {
      setIsUploading(false);
    }
  };

  // Sample WCR Quick-Loader
  const handleLoadSamplePdf = () => {
    const sampleText = `
OIL INDIA LIMITED - DRILLING SERVICES DIVISION
WELL COMPLETION REPORT: NHKT-G24 (SECTOR B EXTENSION)
Total Depth: 2890m MD / 2790m TVD
Target Formation: Barail Group (Arenaceous Sand Member)
Operational Event: Severe lost circulation of 22.4 m3/hr encountered at 2865m MD while drilling with 1.19 SG mud.
Pre-event indicators: Standpipe pressure drop of 160 psi, active pit volume loss (-3.8 m3).
Mitigation: Spotted 35 bbl heavy thixotropic LCM pill (25 ppb Coarse Nut Plug, 20 ppb Medium Flake Mica, 15 ppb CaCO3). Reduced active mud weight to 1.15 SG. Losses brought down to 0.4 m3/hr.
Total NPT: 14.5 hours. Estimated cost savings: Rs 34.0 Lakhs.
Recommendation: Pre-treat active mud system with 20 ppb CaCO3 before drilling 2820m.
`;
    const blob = new Blob([sampleText], { type: 'text/plain' });
    const sampleFile = new File([blob], "WCR_NHKT_G24_Barail_Loss.txt", { type: 'text/plain' });
    handleFileUpload(sampleFile);
  };

  // Search case studies from internet (SPE / Global databases)
  const handleSearchWebCases = async (e) => {
    if (e) e.preventDefault();
    if (!webQuery.trim()) return;

    setIsWebSearching(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/case-studies/search-web?q=${encodeURIComponent(webQuery)}`);
      const data = await res.json();
      setWebResults(data);
    } catch (err) {
      console.error("Web case study search error:", err);
    } finally {
      setIsWebSearching(false);
    }
  };

  const handleApplyToChat = (c) => {
    if (onSelectCase) {
      onSelectCase(c);
    }
    onClose();
  };

  const getSeverityBadge = (sev) => {
    const s = sev?.toUpperCase();
    if (s === 'CRITICAL') return { bg: '#fee2e2', color: '#dc2626', border: '#fecaca' };
    if (s === 'HIGH') return { bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '960px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box" style={{ background: '#fef3c7', borderColor: '#fde68a' }}>
              <BookOpen size={20} style={{ color: 'var(--oil-amber)' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.08rem', margin: 0 }}>
                OIL Institutional Memory • Case Studies &amp; Custom WCR Analyzer
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.76rem' }}>
                Access verified Upper Assam drilling incident archives or analyze custom Well Completion Report PDFs
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {viewMode !== 'landing' && (
              <button
                onClick={() => setViewMode('landing')}
                style={{
                  padding: '4px 10px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-medium)',
                  background: '#ffffff',
                  color: 'var(--text-body)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft size={13} />
                <span>Back to Options</span>
              </button>
            )}
            <button className="close-modal-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SCREEN 1: LANDING STATE - EXACTLY 2 PROMINENT CHOICES AS REQUESTED         */}
        {/* ========================================================================= */}
        {viewMode === 'landing' && (
          <div style={{ padding: '1.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0' }}>
                Choose Your Case Study Workflow
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
                Select whether you want to upload a new Well Completion Report (WCR) PDF or explore verified historical cases from Oil India Limited archives.
              </p>
            </div>

            <div className="case-studies-choice-grid">
              {/* CHOICE 1: UPLOAD & ANALYZE CUSTOM PDF */}
              <div
                onClick={() => setViewMode('upload')}
                style={{
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.75rem 1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--oil-amber)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(217, 119, 6, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
                }}
              >
                <div>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#fef3c7', color: 'var(--oil-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Upload size={28} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    1. Upload &amp; Analyze Custom PDF
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.55', margin: 0 }}>
                    Upload your own statutory Well Completion Report (WCR) or Daily Drilling Report (DDR) in PDF format. Automated OCR, page parsing, and multi-agent incident extraction.
                  </p>
                  <ul style={{ margin: '0.85rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#64748b', lineHeight: '1.6' }}>
                    <li>Instant text and table extraction via pypdf</li>
                    <li>Automatic extraction of loss rates, pressures &amp; depth</li>
                    <li>Generates grounded mitigation &amp; injects into chat</li>
                  </ul>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--oil-amber)' }}>
                    PDF / Text Parser Ready
                  </span>
                  <span style={{ 
                    padding: '0.45rem 1rem', 
                    borderRadius: '6px', 
                    background: 'var(--oil-amber)', 
                    color: '#ffffff', 
                    fontSize: '0.82rem', 
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>Open Uploader</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>

              {/* CHOICE 2: BROWSE HISTORICAL CASES (3) */}
              <div
                onClick={() => setViewMode('browse')}
                style={{
                  background: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.75rem 1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--active-blue)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(2, 132, 199, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 23, 42, 0.05)';
                }}
              >
                <div>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: '#e0f2fe', color: 'var(--active-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <BookOpen size={28} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                    2. Browse Historical Cases ({cases.length || 3})
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: '1.55', margin: 0 }}>
                    Access curated, statutory Oil India Limited incident case studies from Nahorkatiya and Moran fields. Includes global web search at the bottom to explore SPE / international cases.
                  </p>
                  <ul style={{ margin: '0.85rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.78rem', color: '#64748b', lineHeight: '1.6' }}>
                    <li>Well B-04: Severe Mud Loss (28.5 m³/hr) @ 2850m</li>
                    <li>Well C-12: Differential Stuck Pipe @ 2910m (140 jars)</li>
                    <li>Well D-08: Kopili Shale Gas Kick @ 3000m (Driller's Kill)</li>
                  </ul>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--active-blue)' }}>
                    Statutory WCR &amp; DDR Dossiers
                  </span>
                  <span style={{ 
                    padding: '0.45rem 1rem', 
                    borderRadius: '6px', 
                    background: 'var(--active-blue)', 
                    color: '#ffffff', 
                    fontSize: '0.82rem', 
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>Browse Cases</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: UPLOAD & ANALYZE CUSTOM PDF                                      */}
        {/* ========================================================================= */}
        {viewMode === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Upload &amp; Analyze Custom Well Completion Report (WCR)
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                  Upload any drilling report in PDF format to parse and correlate with active well telemetry
                </p>
              </div>

              <button
                onClick={handleLoadSamplePdf}
                disabled={isUploading}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--active-blue)',
                  cursor: isUploading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} />
                <span>Quick Load Authentic Sample WCR (NHKT-G24)</span>
              </button>
            </div>

            {/* Drag & Drop Upload Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              style={{
                border: '2px dashed var(--border-medium)',
                borderRadius: '10px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onClick={() => document.getElementById('pdf-file-input').click()}
            >
              <input
                id="pdf-file-input"
                type="file"
                accept=".pdf,.txt"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fffbeb', color: 'var(--oil-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                <Upload size={24} />
              </div>

              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0' }}>
                {isUploading ? "Extracting Text & Mining Offset Hazards..." : "Drop PDF here or click to browse"}
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                Supports Well Completion Reports (WCR), Daily Drilling Reports (DDR), and Field Incident Logs (.pdf, .txt)
              </p>
            </div>

            {uploadError && (
              <div style={{ padding: '0.65rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '0.78rem' }}>
                {uploadError}
              </div>
            )}

            {/* Extracted Case Study Dossier */}
            {uploadedResult && (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '8px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dcfce7', paddingBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                    <strong style={{ fontSize: '0.94rem', color: '#166534' }}>
                      {uploadedResult.title}
                    </strong>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#16a34a', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                    PARSED &amp; CORRELATED
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginTop: '0.75rem', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Formation &amp; Depth:</span>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{uploadedResult.formation} ({uploadedResult.depth})</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Identified Hazard:</span>
                    <div style={{ fontWeight: 700, color: '#dc2626' }}>{uploadedResult.hazard}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>NPT Avoidance:</span>
                    <div style={{ fontWeight: 700, color: '#b45309' }}>{uploadedResult.npt} (Savings: {uploadedResult.cost_saved})</div>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', background: '#ffffff', border: '1px solid #dcfce7', borderRadius: '6px', padding: '0.65rem 0.85rem' }}>
                  <strong style={{ fontSize: '0.8rem', color: '#15803d' }}>Synthesized Engineering Solution:</strong>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#14532d', lineHeight: '1.5' }}>
                    {uploadedResult.solution}
                  </p>
                </div>

                <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    onClick={() => handleApplyToChat(uploadedResult)}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1.1rem',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>Add to Active Consultation &amp; Query Copilot</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: BROWSE HISTORICAL CASES (3) - LIKE SOURCES BUTTON STYLE           */}
        {/* ========================================================================= */}
        {viewMode === 'browse' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
            {/* Search Input Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search historical cases by well (B-04, C-12, D-08), hazard (mud loss, stuck pipe, gas kick), or formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                  borderRadius: '7px',
                  border: '1.5px solid var(--border-medium)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
            </div>

            {/* Cases Grid - Formatted in SourcesModal 2-Column Clean Style */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '0.85rem' }}>
              {filteredCases.map((c) => {
                const badge = getSeverityBadge(c.severity);
                return (
                  <div
                    key={c.id}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '1.1rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      {/* Top Row: Authority/Well + Severity Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--active-blue)' }}>
                          {c.field} Field Archive • Year {c.year}
                        </span>
                        <span style={{ 
                          fontSize: '0.68rem', 
                          fontWeight: 800, 
                          background: badge.bg, 
                          color: badge.color, 
                          border: `1px solid ${badge.border}`, 
                          padding: '2px 7px', 
                          borderRadius: '4px' 
                        }}>
                          {c.severity}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.45rem 0', lineHeight: '1.4' }}>
                        {c.title}
                      </h4>

                      {/* Specs Row */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', fontSize: '0.75rem', color: '#475569', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', marginBottom: '0.65rem' }}>
                        <span>Depth: <strong>{c.depth}</strong></span>
                        <span>•</span>
                        <span>Formation: <strong>{c.formation}</strong></span>
                        <span>•</span>
                        <span>NPT: <strong>{c.npt}</strong></span>
                        <span>•</span>
                        <span style={{ color: '#16a34a', fontWeight: 700 }}>Saved: {c.cost_saved}</span>
                      </div>

                      {/* Root Cause */}
                      <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: '1.5', marginBottom: '0.5rem' }}>
                        <strong>Root Cause:</strong> {c.root_cause}
                      </div>

                      {/* Mitigation Solution */}
                      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: '0.55rem 0.75rem', fontSize: '0.78rem', color: '#0369a1', lineHeight: '1.5' }}>
                        <strong>Proven Field Mitigation:</strong> {c.solution}
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                        Ref: {c.wcr_ref || 'WCR Archive'}
                      </span>

                      <button
                        onClick={() => handleApplyToChat(c)}
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid var(--active-blue)',
                          borderRadius: '5px',
                          padding: '4px 10px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: 'var(--active-blue)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>Ask Copilot About This Case</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ========================================================================= */}
            {/* AT THE BOTTOM: SEARCH CASE STUDY FROM THE INTERNET                         */}
            {/* ========================================================================= */}
            <div style={{
              marginTop: '1rem',
              background: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              padding: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.45rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    🌐 Search Global Oilfield &amp; SPE Case Studies from Internet
                  </h4>
                  <p style={{ fontSize: '0.74rem', color: '#64748b', margin: 0 }}>
                    Query technical petroleum databases (SPE, IADC, Gulf of Mexico, North Sea, Middle East deep drilling archives)
                  </p>
                </div>
              </div>

              <form onSubmit={handleSearchWebCases} style={{ display: 'flex', gap: '8px', marginTop: '0.65rem' }}>
                <input
                  type="text"
                  placeholder="e.g. Barail sand loss SPE, differential sticking North Sea, high pressure gas kick kill method..."
                  value={webQuery}
                  onChange={(e) => setWebQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    background: '#ffffff'
                  }}
                />
                <button
                  type="submit"
                  disabled={isWebSearching || !webQuery.trim()}
                  style={{
                    padding: '0.55rem 1.15rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: isWebSearching ? 'wait' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Search size={14} />
                  <span>{isWebSearching ? "Searching Web..." : "Search Internet"}</span>
                </button>
              </form>

              {/* Web Search Results Display */}
              {webResults.length > 0 && (
                <div style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0284c7' }}>
                    Found {webResults.length} Global Technical Case Studies from Internet:
                  </span>

                  {webResults.map((wr) => (
                    <div 
                      key={wr.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #bae6fd',
                        borderRadius: '8px',
                        padding: '0.85rem 1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, background: '#e0f2fe', color: '#0284c7', padding: '1px 6px', borderRadius: '4px' }}>
                          🌐 {wr.source || 'SPE Global Archive'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {wr.field}
                        </span>
                      </div>

                      <h5 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0' }}>
                        {wr.title}
                      </h5>

                      <p style={{ margin: '0.2rem 0', fontSize: '0.78rem', color: '#334155', lineHeight: '1.5' }}>
                        <strong>Solution:</strong> {wr.solution}
                      </p>

                      <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          Ref: {wr.wcr_ref}
                        </span>
                        <button
                          onClick={() => handleApplyToChat(wr)}
                          style={{
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Add to Consultation →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Oil India Limited • Central Drilling Archives &amp; SPE Knowledge Base
          </span>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
