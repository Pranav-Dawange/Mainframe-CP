import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Trash2, Download, AlertTriangle, Calendar, DollarSign, ShieldAlert, Hash } from 'lucide-react';
import { documentApi } from '../api/api';

const InfoRow = ({ label, value }) => (
  value ? (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-medium text-primary text-sm">{value}</p>
    </div>
  ) : null
);

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await documentApi.getById(id);
        setDoc(res.data);
      } catch (err) {
        setError('Unable to load document details. The document may not exist or you do not have access.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${doc?.name}"?`)) {
      try {
        await documentApi.delete(id);
        navigate('/documents');
      } catch (err) {
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading document...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">{error}</p>
      <button onClick={() => navigate('/documents')} className="btn-secondary">Back to Documents</button>
    </div>
  );

  if (!doc) return <div className="py-12 text-center text-gray-600">Document not found.</div>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;
  const formatAmount = (a) => a ? `₹${a.toLocaleString('en-IN')}` : null;

  const getStatusBadge = (status) => {
    const styles = { Active: 'bg-green-100 text-green-700', Expired: 'bg-red-100 text-red-700', 'Expiring Soon': 'bg-orange-100 text-orange-700' };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/documents')} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Documents
        </button>
        <div className="flex gap-3">
          <a
            href={`http://localhost:8000/${doc.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download
          </a>
          <button onClick={handleDelete} className="btn-danger flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Document Preview */}
        <div className="lg:col-span-2 card flex flex-col" style={{ minHeight: '500px' }}>
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-medium text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              {doc.name}
            </h2>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusBadge(doc.status)}`}>
              {doc.status || 'Active'}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full h-64 bg-white shadow-sm border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <FileText className="w-20 h-20 mb-4 text-gray-200" />
              <p className="text-sm font-medium">Document Preview</p>
              <p className="text-xs mt-1 text-gray-400">{doc.name}</p>
              <a
                href={`http://localhost:8000/${doc.file_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-sm text-accent hover:underline"
              >
                Open Original File
              </a>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b border-gray-100">Document Information</h3>
            <div className="space-y-4">
              <InfoRow label="File Name" value={doc.name} />
              <InfoRow label="Document Type" value={doc.type} />
              <InfoRow label="Upload Date" value={formatDate(doc.upload_date)} />
              <InfoRow label="File Size" value={doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : null} />
            </div>
          </div>

          <div className="card p-6 border-t-4 border-t-accent">
            <h3 className="text-base font-bold text-primary mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-accent" />
              Extracted Information
            </h3>
            <div className="space-y-4">
              {doc.purchase_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Purchase Date</p>
                    <p className="text-sm font-medium text-primary">{formatDate(doc.purchase_date)}</p>
                  </div>
                </div>
              )}
              {doc.amount && (
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Purchase Amount</p>
                    <p className="text-sm font-medium text-primary">{formatAmount(doc.amount)}</p>
                  </div>
                </div>
              )}
              {doc.invoice_number && (
                <div className="flex items-start gap-3">
                  <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Invoice Number</p>
                    <p className="text-sm font-medium text-primary">{doc.invoice_number}</p>
                  </div>
                </div>
              )}
              {doc.warranty_end_date && (
                <div className="flex items-start gap-3">
                  <ShieldAlert className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Warranty Expiry</p>
                    <p className="text-sm font-medium text-primary">{formatDate(doc.warranty_end_date)}</p>
                  </div>
                </div>
              )}
              {doc.expiry_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Document Expiry</p>
                    <p className="text-sm font-medium text-primary">{formatDate(doc.expiry_date)}</p>
                  </div>
                </div>
              )}
              {doc.extracted_text && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">OCR Scanned Text</p>
                  <pre className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 max-h-36 overflow-y-auto whitespace-pre-wrap">
                    {doc.extracted_text}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
