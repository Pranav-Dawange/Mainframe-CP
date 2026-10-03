import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Grid, List as ListIcon, FileText, AlertTriangle, Trash2, Eye, Download } from 'lucide-react';
import { documentApi } from '../api/api';

const TYPE_FILTERS = ['All', 'Invoice', 'Warranty', 'Insurance', 'Certificate', 'Bill', 'Other'];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Name A-Z', value: 'name' },
  { label: 'Expiry Date', value: 'expiry' },
];

const getTypeColor = (type) => {
  const colors = {
    Invoice: 'bg-blue-100 text-blue-700',
    Warranty: 'bg-green-100 text-green-700',
    Insurance: 'bg-purple-100 text-purple-700',
    Certificate: 'bg-yellow-100 text-yellow-700',
    Bill: 'bg-orange-100 text-orange-700',
    Other: 'bg-gray-100 text-gray-700',
  };
  return colors[type] || 'bg-gray-100 text-gray-700';
};

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const res = await documentApi.getAll();
      setDocuments(res.data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load documents. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await documentApi.delete(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch {
      alert('Failed to delete document. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const sorted = [...documents]
    .filter(doc => typeFilter === 'All' || doc.type === typeFilter)
    .filter(doc => doc.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.upload_date) - new Date(a.upload_date);
      if (sortBy === 'oldest') return new Date(a.upload_date) - new Date(b.upload_date);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'expiry') return new Date(a.expiry_date || a.warranty_end_date || 0) - new Date(b.expiry_date || b.warranty_end_date || 0);
      return 0;
    });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const formatSize = (bytes) => bytes ? `${(bytes / 1024).toFixed(0)} KB` : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Documents</h1>
          <p className="text-sm text-gray-500 mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''} stored</p>
        </div>
        <Link to="/documents/upload" className="btn-primary flex items-center gap-2">
          + Upload Document
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        {/* Search + View toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              className="pl-9 input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              className="input-field py-2 text-sm w-40"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                typeFilter === f
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mr-3"></div>
          <p className="text-gray-500">Loading documents...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 card p-8">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchDocuments} className="btn-secondary">Retry</button>
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || typeFilter !== 'All' ? 'No matching documents' : 'Your vault is empty'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            {searchQuery || typeFilter !== 'All'
              ? 'Try adjusting your search or filter.'
              : 'Upload your first document to get started.'}
          </p>
          {!searchQuery && typeFilter === 'All' && (
            <Link to="/documents/upload" className="btn-primary">Upload Document</Link>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.map(doc => (
            <div key={doc.id} className="card hover:shadow-md transition-shadow group">
              <Link to={`/documents/${doc.id}`} className="block">
                <div className="h-32 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-b border-gray-100">
                  <FileText className="w-14 h-14 text-blue-200 group-hover:text-accent transition-colors" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary text-sm truncate" title={doc.name}>{doc.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(doc.type)}`}>{doc.type || 'Other'}</span>
                    <span className="text-xs text-gray-400">{formatDate(doc.upload_date)}</span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4 flex gap-2">
                <Link to={`/documents/${doc.id}`} className="flex-1 btn-secondary text-xs py-1.5 flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> View
                </Link>
                <button
                  onClick={(e) => handleDelete(e, doc.id, doc.name)}
                  disabled={deletingId === doc.id}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date Added</th>
                <th className="px-6 py-4 font-medium">Size</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-primary text-sm truncate max-w-xs">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(doc.type)}`}>
                      {doc.type || 'Other'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(doc.upload_date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatSize(doc.file_size)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/documents/${doc.id}`} className="p-1.5 text-gray-400 hover:text-accent hover:bg-blue-50 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <a href={`http://localhost:8000/${doc.file_path}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={(e) => handleDelete(e, doc.id, doc.name)}
                        disabled={deletingId === doc.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Documents;
