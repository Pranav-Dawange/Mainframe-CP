import React, { useState, useEffect } from 'react';
import { Bell, Clock, ShieldAlert, FileText, CheckCircle2, Info } from 'lucide-react';
import { notificationApi } from '../api/api';

const getIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'expiry': return <Clock className="w-5 h-5 text-orange-500" />;
    case 'warranty': return <ShieldAlert className="w-5 h-5 text-red-500" />;
    case 'document': return <FileText className="w-5 h-5 text-blue-500" />;
    case 'system': return <Info className="w-5 h-5 text-purple-500" />;
    default: return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await notificationApi.getAll();
        setNotifications(res.data || []);
      } catch (err) {
        setError('Unable to load notifications.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Bell className="w-6 h-6 text-accent" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-accent text-white rounded-full">{unreadCount}</span>
          )}
        </h1>
        {unreadCount > 0 && <button className="text-sm text-accent hover:underline font-medium">Mark all as read</button>}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-500">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <ShieldAlert className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 btn-secondary">Retry</button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">You're all caught up!</h3>
            <p className="text-gray-500">No new notifications at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-5 flex gap-4 hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-blue-50/40' : ''}`}
              >
                <div className={`mt-0.5 p-2 rounded-xl h-fit flex-shrink-0 ${!notif.is_read ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm ${!notif.is_read ? 'font-semibold text-primary' : 'font-medium text-gray-700'}`}>
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(notif.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{notif.type || 'Notification'}</p>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
