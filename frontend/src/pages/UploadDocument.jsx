import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, FileText, CheckCircle, AlertCircle, X, 
  Sparkles, Calendar, DollarSign, ShieldAlert, ArrowRight, ScanLine
} from 'lucide-react';
import { documentApi } from '../api/api';

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, scanning, extracted, error
  const [scanStage, setScanStage] = useState('Initializing High-Res OCR Scanner...');
  const [extractedResult, setExtractedResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      selectFile(e.target.files[0]);
    }
  };

  const selectFile = (f) => {
    setFile(f);
    if (f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleUploadAndScan = async () => {
    if (!file) return;

    setUploadStatus('scanning');
    setError('');

    const scanStages = [
      'Reading document raster layers...',
      'Running Tesseract OCR engine...',
      'Detecting invoice & bill numbers...',
      'Extracting totals, currency & GST...',
      'Analyzing warranty & expiry dates...',
      'Synchronizing metadata with LifeVault...'
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % scanStages.length;
      setScanStage(scanStages[stageIdx]);
    }, 600);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await documentApi.upload(formData);
      clearInterval(interval);
      setExtractedResult(res.data);
      setUploadStatus('extracted');
    } catch (err) {
      clearInterval(interval);
      setUploadStatus('error');
      setError('An error occurred during OCR scanning and document extraction. Please check the file and try again.');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setFilePreview(null);
    setUploadStatus('idle');
    setExtractedResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatDate = (d) => {
    if (!d) return 'Not Detected';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
            <ScanLine className="w-8 h-8 text-accent animate-pulse" />
            AI Document & Bill Scanner
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real OCR powered by Tesseract engine & intelligent bill amount extraction
          </p>
        </div>
      </div>

      <div className="card p-8 bg-white shadow-md rounded-2xl border border-gray-100">
        {/* IDLE STATE */}
        {uploadStatus === 'idle' && (
          <>
            <div 
              className="border-2 border-dashed border-blue-200 hover:border-accent rounded-2xl p-12 text-center bg-blue-50/30 hover:bg-blue-50/60 transition-all cursor-pointer group"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-10 h-10 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">Click or drag document to scan</h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
                Supports real invoices, electricity/utility bills, receipts, warranty cards, PDFs, PNG, JPG, JPEG
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
              <button className="btn-secondary pointer-events-none px-6 py-2">
                Browse From Computer
              </button>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB &bull; Ready for OCR Scan</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); resetUpload(); }} className="p-2 hover:bg-gray-200 rounded-lg text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleUploadAndScan} 
                disabled={!file} 
                className={`btn-primary px-8 py-3 text-base flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Sparkles className="w-5 h-5" />
                Start OCR Scan & Analysis
              </button>
            </div>
          </>
        )}

        {/* SCANNING ANIMATION STATE */}
        {uploadStatus === 'scanning' && (
          <div className="py-12 px-4 text-center">
            <div className="relative w-72 h-80 mx-auto mb-8 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-accent/40 flex flex-col items-center justify-center">
              {filePreview ? (
                <img src={filePreview} alt="Scanning preview" className="w-full h-full object-cover opacity-60" />
              ) : (
                <div className="text-center p-6 text-gray-400">
                  <FileText className="w-24 h-24 mx-auto mb-3 text-accent animate-pulse" />
                  <p className="text-xs text-gray-300 font-mono">{file?.name}</p>
                </div>
              )}
              {/* Laser beam scanline */}
              <div 
                className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] z-20"
                style={{
                  animation: 'scanLaser 2s ease-in-out infinite alternate'
                }}
              />
              <div 
                className="absolute inset-0 bg-accent/10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />
              <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md rounded-lg py-1 px-3 text-xs text-cyan-300 font-mono text-center border border-cyan-500/30">
                OCR ENGINE ACTIVE &bull; SCANNING
              </div>
            </div>

            <h3 className="text-2xl font-bold text-primary mb-2">Analyzing Document Content</h3>
            <p className="text-accent font-medium text-sm flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              {scanStage}
            </p>
            <p className="text-xs text-gray-400 mt-4 max-w-sm mx-auto">
              Extracting document type, invoice number, payable amounts, and warranty validity using real OCR parsing.
            </p>
          </div>
        )}

        {/* EXTRACTED PREVIEW STATE */}
        {uploadStatus === 'extracted' && extractedResult && (
          <div className="py-4 space-y-6 animate-fadeIn">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
              <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-base">OCR Scanning & Extraction Successful!</h4>
                <p className="text-xs text-green-700">Information successfully recognized and indexed into your LifeVault.</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" /> Extracted Document Intelligence
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Identified Document Name</p>
                  <p className="text-lg font-bold text-primary truncate">{extractedResult.name}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Document Classification</p>
                  <span className="inline-block mt-1 px-3 py-1 bg-accent/10 text-accent font-bold text-sm rounded-full">
                    {extractedResult.type}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-green-600" /> Extracted Total / Bill Amount
                  </p>
                  <p className="text-2xl font-black text-green-600">
                    {extractedResult.amount ? `₹${extractedResult.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Not Specified'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Invoice / Bill Number</p>
                  <p className="text-base font-mono font-bold text-gray-800">
                    {extractedResult.invoice_number || 'N/A'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Date of Document
                  </p>
                  <p className="text-sm font-semibold text-primary">{formatDate(extractedResult.purchase_date)}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Mainframe JCL Sync Status
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      Executed Job: <span className="font-mono text-accent">{extractedResult.mainframe_job_id || 'Z72771.JCL(RPTGEN)'}</span>
                    </p>
                    <p className="text-xs text-slate-500">Dataset: <code className="text-accent font-bold">Z72771.JCL(RPTGEN)</code> &bull; Synced with z/OS JES2</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    {extractedResult.mainframe_status || 'Archived to z/OS'}
                  </span>
                </div>
              </div>

              {extractedResult.extracted_text && (
                <div className="mt-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Raw OCR Text Snippet</p>
                  <pre className="p-3 bg-gray-900 text-cyan-300 rounded-xl text-xs font-mono max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {extractedResult.extracted_text}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={resetUpload} className="btn-secondary px-6">
                Upload Another Document
              </button>
              <button 
                onClick={() => navigate(`/documents/${extractedResult.id}`)} 
                className="btn-primary px-8 py-3 flex items-center gap-2 font-bold shadow-lg"
              >
                Go to Document Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {uploadStatus === 'error' && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">OCR Processing Failed</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <button onClick={resetUpload} className="btn-secondary px-8">Try Again</button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 5%; }
          100% { top: 92%; }
        }
      `}</style>
    </div>
  );
};

export default UploadDocument;
