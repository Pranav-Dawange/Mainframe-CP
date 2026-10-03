import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldAlert, Clock, HardDrive, AlertTriangle, UploadCloud } from 'lucide-react';
import { documentApi, warrantyApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

const getWarrantyStatus = (warranty_end_date) => {
  if (!warranty_end_date) return 'Unknown';
  const daysLeft = Math.ceil((new Date(warranty_end_date) - new Date()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'Expired';
  if (daysLeft <= 30) return 'Expiring Soon';
  return 'Active';
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ documents: 0, warranties: 0, expiring: 0, storage: '0 KB' });
  const [recentDocs, setRecentDocs] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [docsRes, warrRes] = await Promise.all([
          documentApi.getAll(),
          warrantyApi.getAll(),
        ]);

        const docs = docsRes.data || [];
        const warranties = warrRes.data || [];

        const enrichedWarranties = warranties.map(w => ({
          ...w,
          computedStatus: getWarrantyStatus(w.warranty_end_date),
        }));

        const activeCount = enrichedWarranties.filter(w => w.computedStatus === 'Active').length;
        const expiringCount = enrichedWarranties.filter(w => w.computedStatus === 'Expiring Soon').length;

        const totalBytes = docs.reduce((sum, d) => sum + (d.file_size || 0), 0);
        const storageStr = totalBytes > 1024 * 1024
          ? `${(totalBytes / 1024 / 1024).toFixed(1)} MB`
          : `${(totalBytes / 1024).toFixed(0)} KB`;

        setStats({
          documents: docs.length,
          warranties: activeCount,
          expiring: expiringCount,
          storage: storageStr,
        });

        setRecentDocs(docs.slice(0, 5));

        // Show upcoming: not yet expired, sorted by soonest expiry
        const upcoming = enrichedWarranties
          .filter(w => w.computedStatus !== 'Expired')
          .sort((a, b) => new Date(a.warranty_end_date) - new Date(b.warranty_end_date))
          .slice(0, 5);
        setExpiringItems(upcoming);

      } catch (err) {
        setError('Unable to connect to LifeVault service. Please ensure the backend is running.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500">Loading your vault...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <AlertTriangle className="w-14 h-14 text-red-400 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-primary mb-2">Unable to Connect</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{error}</p>
      <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Welcome back, <span className="text-accent">{user?.username}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Here's an overview of your vault.</p>
        </div>
        <Link to="/documents/upload" className="btn-primary flex items-center gap-2">
          <UploadCloud className="w-4 h-4" /> Upload Document
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Documents', value: stats.documents, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50', link: '/documents' },
          { label: 'Active Warranties', value: stats.warranties, icon: ShieldAlert, color: 'text-green-500', bg: 'bg-green-50', link: '/warranties' },
          { label: 'Expiring Soon', value: stats.expiring, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', link: '/warranties' },
          { label: 'Storage Used', value: stats.storage, icon: HardDrive, color: 'text-purple-500', bg: 'bg-purple-50', link: '#' },
        ].map((stat, idx) => (
          <Link key={idx} to={stat.link} className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
              <p className="text-2xl font-bold text-primary mt-0.5">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Expiries */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-primary flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" /> Upcoming Expiries
            </h2>
            <Link to="/warranties" className="text-xs text-accent hover:underline font-medium">View All →</Link>
          </div>
          {expiringItems.length === 0 ? (
            <div className="p-10 text-center">
              <ShieldAlert className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No upcoming expiries. You're all clear!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {expiringItems.map((w) => {
                const expiryDate = w.warranty_end_date || w.expiry_date;
                const daysLeft = expiryDate ? Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                const isUrgent = daysLeft !== null && daysLeft <= 30;
                return (
                  <div key={w.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isUrgent ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                      <span className="font-medium text-sm text-primary truncate">{w.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className="text-xs text-gray-400">
                        {expiryDate ? new Date(expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isUrgent ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {daysLeft !== null ? `${daysLeft}d` : 'Active'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Documents */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-primary flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Recent Documents
            </h2>
            <Link to="/documents" className="text-xs text-accent hover:underline font-medium">View All →</Link>
          </div>
          {recentDocs.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-4">No documents yet. Upload your first!</p>
              <Link to="/documents/upload" className="btn-primary text-sm">Upload Document</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentDocs.map((doc) => (
                <Link key={doc.id} to={`/documents/${doc.id}`} className="flex items-center px-6 py-3.5 hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    <FileText className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{doc.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doc.type || 'Document'} · {doc.upload_date ? new Date(doc.upload_date).toLocaleDateString('en-IN') : '—'}
                    </p>
                  </div>
                  <span className="text-xs text-gray-300 group-hover:text-accent transition-colors ml-2">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
