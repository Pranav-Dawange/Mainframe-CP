import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import { warrantyApi } from '../api/api';

const getWarrantyStatus = (warranty_end_date) => {
  if (!warranty_end_date) return 'Unknown';
  const today = new Date();
  const end = new Date(warranty_end_date);
  const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= 30) return 'Expiring Soon';
  return 'Active';
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Expiring Soon': return 'bg-orange-100 text-orange-800';
    case 'Expired': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const StatusIcon = ({ status }) => {
  if (status === 'Active') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (status === 'Expiring Soon') return <Clock className="w-4 h-4 text-orange-500" />;
  if (status === 'Expired') return <XCircle className="w-4 h-4 text-red-500" />;
  return null;
};

const WarrantyTracker = () => {
  const [warranties, setWarranties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const res = await warrantyApi.getAll();
        setWarranties(res.data || []);
      } catch (err) {
        setError('Unable to load warranties. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarranties();
  }, []);

  const enriched = warranties.map(w => ({
    ...w,
    computedStatus: getWarrantyStatus(w.warranty_end_date),
  }));

  const filtered = enriched
    .filter(w => w.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(w => filterStatus === 'All' || w.computedStatus === filterStatus);

  const counts = {
    All: enriched.length,
    Active: enriched.filter(w => w.computedStatus === 'Active').length,
    'Expiring Soon': enriched.filter(w => w.computedStatus === 'Expiring Soon').length,
    Expired: enriched.filter(w => w.computedStatus === 'Expired').length,
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

  const getDaysLeft = (d) => {
    if (!d) return null;
    const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return `${Math.abs(days)} days ago`;
    if (days === 0) return 'Today';
    return `${days} days left`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-accent" />
          Warranty Tracker
        </h1>
        <Link to="/documents/upload" className="btn-primary">+ Upload Document with Warranty</Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-accent text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status} <span className="ml-1 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search warranties by document name..."
            className="pl-10 input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading warranties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 card p-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-secondary">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
          <ShieldAlert className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No warranties found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            {searchQuery ? 'Try adjusting your search.' : 'Upload documents with warranty information to track them automatically.'}
          </p>
          <Link to="/documents/upload" className="btn-primary">Upload Document</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4 font-medium">Product / Document</th>
                <th className="px-6 py-4 font-medium">Purchase Date</th>
                <th className="px-6 py-4 font-medium">Warranty Expiry</th>
                <th className="px-6 py-4 font-medium">Time Remaining</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(w => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4 text-accent" />
                      </div>
                      <span className="font-medium text-primary">{w.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{formatDate(w.purchase_date)}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm font-medium">{formatDate(w.warranty_end_date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{getDaysLeft(w.warranty_end_date)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(w.computedStatus)}`}>
                      <StatusIcon status={w.computedStatus} />
                      {w.computedStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link to={`/documents/${w.id}`} className="text-sm text-accent hover:underline font-medium">View</Link>
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

export default WarrantyTracker;
