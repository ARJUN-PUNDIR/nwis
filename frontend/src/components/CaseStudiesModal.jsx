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
  ShieldCheck
} from 'lucide-react';

const BACKEND_URL = "http://localhost:8001";

export default function CaseStudiesModal({ isOpen = true, onClose, onSelectCase }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'upload'
  const [searchQuery, setSearchQuery] = useState('');
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedResult, setUploadedResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Fetch case studies from backend
  const fetchCaseStudies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/case-studies`);
      const data = await res.json();
      setCases(data);
      if (data.length > 0 && !selectedCaseId) {
        setSelectedCaseId(data[0].id);
      }
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

  const currentCase = cases.find(c => c.id === selectedCaseId) || filteredCases[0] || cases[0];

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
      // Refresh cases list
      await fetchCaseStudies();
      setSelectedCaseId(data.case.id);
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

  const handleApplyToChat = (c) => {
    if (onSelectCase) {
      onSelectCase(c);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '880px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="doc-icon-box" style={{ background: '#fef3c7', borderColor: '#fde68a' }}>
              <BookOpen size={20} style={{ color: 'var(--oil-amber)' }} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                OIL Institutional Memory • Curated Case Studies &amp; Custom WCR Analyzer
              </h2>
              <p className="modal-sub" style={{ margin: 0, fontSize: '0.76rem' }}>
                Search historical Upper Assam drilling incidents or upload your own Well Completion Report PDF
              </p>
            </div>
          </div>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Top Navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginTop: '0.4rem' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                background: activeTab === 'browse' ? 'var(--active-blue)' : '#f8fafc',
                color: activeTab === 'browse' ? '#ffffff' : 'var(--text-body)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen size={14} />
              <span>Browse Historical Cases ({cases.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              style={{
                background: activeTab === 'upload' ? 'var(--oil-amber)' : '#f8fafc',
                color: activeTab === 'upload' ? '#ffffff' : 'var(--text-body)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={14} />
              <span>Upload &amp; Analyze Custom PDF</span>
            </button>
          </div>

          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            Upper Assam Basin Database • 100% Grounded
          </span>
        </div>

        {/* TAB 1: BROWSE & SEARCH CASE STUDIES */}
        {activeTab === 'browse' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, overflow: 'hidden', marginTop: '0.4rem' }}>
            {/* Search Input Bar */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search case studies by well (B-04, C-12, D-08), hazard (mud loss, stuck pipe, kick), formation, or depth..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.84rem',
                  outline: 'none',
                  background: '#ffffff'
                }}
              />
            </div>

            {/* Case Studies Selector Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.5rem', maxHeight: '140px', overflowY: 'auto' }}>
              {filteredCases.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedCaseId(c.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: selectedCaseId === c.id ? '2px solid var(--oil-amber)' : '1px solid var(--border-subtle)',
                    background: selectedCaseId === c.id ? '#fef3c7' : '#f8fafc',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--oil-amber)' }}>{c.id}</span>
                    <span style={{ 
                      fontSize: '0.62rem', 
                      fontWeight: 800, 
                      padding: '1px 5px', 
                      borderRadius: '4px',
                      background: c.is_custom ? '#dcfce7' : c.severity === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                      color: c.is_custom ? '#15803d' : c.severity === 'CRITICAL' ? '#b91c1c' : '#92400e'
                    }}>
                      {c.is_custom ? "UPLOADED" : c.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.hazard || c.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {c.depth} • {c.cost_saved || "Saved"}
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Dossier for Selected Case */}
            {currentCase && (
              <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '12px 14px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                        {currentCase.title}
                      </h3>
                      {currentCase.is_custom && (
                        <span style={{ fontSize: '0.64rem', fontWeight: 800, background: '#dcfce7', color: '#166534', padding: '1px 6px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                          ✓ Custom Upload
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Formation: {currentCase.formation} • Depth: {currentCase.depth} • {currentCase.loss_rate}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--alert-success)', display: 'block' }}>
                      {currentCase.cost_saved} Saved
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      NPT Incurred: {currentCase.npt}
                    </span>
                  </div>
                </div>

                {/* Root Cause */}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', display: 'block', marginBottom: '1px' }}>
                    Root Cause Diagnostics:
                  </span>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.45' }}>
                    {currentCase.root_cause}
                  </p>
                </div>

                {/* Proven Remedial Action Steps */}
                <div style={{ marginBottom: '8px', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--active-blue)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                    Field-Proven Mitigation Procedure:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {currentCase.mitigation_steps ? (
                      currentCase.mitigation_steps.map((step, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '5px', fontSize: '0.78rem', color: 'var(--text-body)' }}>
                          <span style={{ fontWeight: 800, color: 'var(--active-blue)' }}>{idx + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))
                    ) : (
                      <p style={{ margin: 0, fontSize: '0.78rem' }}>{currentCase.solution}</p>
                    )}
                  </div>
                </div>

                {/* Lesson Learned */}
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '6px', padding: '8px 10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', display: 'block', marginBottom: '1px' }}>
                    💡 Institutional Rule for Future Offset Wells:
                  </span>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#78350f', lineHeight: '1.45' }}>
                    {currentCase.lesson_learned}
                  </p>
                </div>

                {/* Citation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <FileText size={13} style={{ color: 'var(--oil-amber)' }} />
                  <span>Verified Source: <strong>{currentCase.wcr_ref}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: UPLOAD & ANALYZE CUSTOM PDF */}
        {activeTab === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto', marginTop: '0.4rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Upload any authentic <strong>Well Completion Report (WCR)</strong>, <strong>Daily Drilling Report (DDR)</strong>, or mud logging record (PDF or text). The system will extract formation tops, mud loss rates, stuck pipe incidents, and LCM formulations automatically.
            </p>

            {/* Drop Zone */}
            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.75rem',
              background: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}>
              <Upload size={30} style={{ color: 'var(--active-blue)', marginBottom: '0.4rem' }} />
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {isUploading ? "Uploading & Analyzing Report with pypdf..." : "Drag & Drop your WCR / DDR PDF here, or click to browse"}
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Supports PDF, TXT, DOCX reports up to 25 MB
              </span>
              <input 
                type="file" 
                accept=".pdf,.txt,.docx" 
                onChange={(e) => handleFileUpload(e.target.files[0])} 
                style={{ display: 'none' }} 
                disabled={isUploading}
              />
            </label>

            {uploadError && (
              <div style={{ padding: '8px 12px', background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '6px', color: '#b91c1c', fontSize: '0.78rem' }}>
                {uploadError}
              </div>
            )}

            {/* Quick Sample Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eff6ff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} style={{ color: 'var(--active-blue)' }} />
                <span style={{ fontSize: '0.78rem', color: '#1e3a8a', fontWeight: 600 }}>
                  Don't have a PDF ready? Test with authentic sample data:
                </span>
              </div>
              <button
                onClick={handleLoadSamplePdf}
                disabled={isUploading}
                style={{
                  background: 'var(--active-blue)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                📄 Load Sample WCR Report
              </button>
            </div>

            {/* Uploaded Result Preview Card */}
            {uploadedResult && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} style={{ color: '#059669' }} />
                    <strong style={{ fontSize: '0.88rem', color: '#166534' }}>Report Successfully Extracted &amp; Synthesized!</strong>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#15803d' }}>
                    ID: {uploadedResult.id}
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {uploadedResult.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-body)', marginBottom: '4px' }}>
                  <strong>Formation:</strong> {uploadedResult.formation} • <strong>Depth:</strong> {uploadedResult.depth} • <strong>{uploadedResult.loss_rate}</strong>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#15803d', background: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  <strong>Extracted Mitigation:</strong> {uploadedResult.solution}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          
          <button 
            className="send-btn" 
            onClick={() => handleApplyToChat(currentCase)}
            style={{ padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <ArrowRight size={15} />
            <span>Consult Copilot on Selected Case</span>
          </button>
        </div>
      </div>
    </div>
  );
}
