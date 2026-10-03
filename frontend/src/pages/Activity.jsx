import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, UploadCloud, Eye, Trash2, Bot, Search, ShieldAlert } from 'lucide-react';
import { activityApi } from '../api/api';

const getIcon = (action) => {
  const a = action?.toLowerCase() || '';
  if (a.includes('upload')) return <UploadCloud className="w-4 h-4 text-blue-500" />;
  if (a.includes('view')) return <Eye className="w-4 h-4 text-gray-500" />;
  if (a.includes('delete')) return <Trash2 className="w-4 h-4 text-red-500" />;
  if (a.includes('assistant') || a.includes('query')) return <Bot className="w-4 h-4 text-purple-500" />;
  if (a.includes('search')) return <Search className="w-4 h-4 text-teal-500" />;
  return <ActivityIcon className="w-4 h-4 text-gray-500" />;
};

const groupByDate = (activities) => {
  const groups = {};
  activities.forEach(act => {
    const day = new Date(act.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!groups[day]) groups[day] = [];
    groups[day].push(act);
  });
  return groups;
};

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await activityApi.getAll();
        setActivities(res.data || []);
      } catch (err) {
        setError('Unable to load activity log.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const grouped = groupByDate(activities);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ActivityIcon className="w-6 h-6 text-accent" />
          Activity Log
        </h1>
        <p className="text-sm text-gray-500">{activities.length} total events</p>
      </div>

      <div className="card p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mr-3"></div>
            <p className="text-gray-500">Loading activity...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 btn-secondary">Retry</button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16">
            <ActivityIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-500">Your actions within LifeVault will appear here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([day, acts]) => (
              <div key={day}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">{day}</p>
                <div className="relative border-l border-gray-200 ml-3 space-y-6 py-2">
                  {acts.map((act) => (
                    <div key={act.id} className="relative pl-8">
                      <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                        {getIcon(act.action)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">{act.action}</p>
                        <p className="text-sm text-gray-600">{act.details}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(act.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
