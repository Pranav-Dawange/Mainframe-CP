import React, { useState } from 'react';
import { Bell, Lock, Download, Trash2, Moon, Globe, User, Shield, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Toggle = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between py-4">
    <div>
      <p className="font-medium text-primary text-sm">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
    </label>
  </div>
);

const sections = ['Account', 'Notifications', 'Security', 'Preferences'];

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('Account');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    warrantyReminders: true,
    expiryReminders: true,
    uploadCompleted: false,
  });
  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'English',
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {sections.map(section => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section
                  ? 'bg-accent text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              {section}
            </button>
          ))}
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
          >
            Sign Out
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">

          {/* Account Section */}
          {activeSection === 'Account' && (
            <>
              <div className="card p-6">
                <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-accent" /> Personal Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Username</label>
                    <div className="input-field bg-gray-50 text-gray-600">{user?.username || '—'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Account Role</label>
                    <div className="input-field bg-gray-50 text-gray-600 capitalize">{user?.role || 'user'}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Account ID</label>
                    <div className="input-field bg-gray-50 text-gray-600">#{user?.id || '—'}</div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-accent" /> Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Current Password</label>
                    <input type="password" className="input-field" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">New Password</label>
                    <input type="password" className="input-field" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Confirm New Password</label>
                    <input type="password" className="input-field" placeholder="Confirm new password" />
                  </div>
                  <div className="flex justify-end">
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-red-100">
                <h3 className="text-base font-bold text-red-600 mb-4 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Danger Zone
                </h3>
                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-red-700">Delete Account</p>
                    <p className="text-sm text-red-500">This action is permanent and cannot be undone.</p>
                  </div>
                  <button
                    className="btn-danger"
                    onClick={() => window.confirm('Are you sure? This will permanently delete your account and all data.') && logout()}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Notifications Section */}
          {activeSection === 'Notifications' && (
            <div className="card p-6">
              <h3 className="text-base font-bold text-primary mb-2 flex items-center gap-2">
                <Bell className="w-4 h-4 text-accent" /> Notification Preferences
              </h3>
              <p className="text-sm text-gray-500 mb-4">Control which notifications LifeVault sends you.</p>
              <div className="divide-y divide-gray-100">
                <Toggle
                  label="Email Notifications"
                  description="Receive updates and alerts via email"
                  checked={notifications.emailNotifications}
                  onChange={() => toggleNotification('emailNotifications')}
                />
                <Toggle
                  label="Warranty Reminders"
                  description="Get notified when warranties are about to expire"
                  checked={notifications.warrantyReminders}
                  onChange={() => toggleNotification('warrantyReminders')}
                />
                <Toggle
                  label="Document Expiry Reminders"
                  description="Get notified before documents expire"
                  checked={notifications.expiryReminders}
                  onChange={() => toggleNotification('expiryReminders')}
                />
                <Toggle
                  label="Upload Completed"
                  description="Get notified when document processing is complete"
                  checked={notifications.uploadCompleted}
                  onChange={() => toggleNotification('uploadCompleted')}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button className="btn-primary">Save Preferences</button>
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'Security' && (
            <>
              <div className="card p-6">
                <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent" /> Security Overview
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Authentication', value: 'JWT Bearer Token', icon: Lock },
                    { label: 'Session', value: 'Stored in localStorage', icon: Eye },
                    { label: 'Access Control', value: 'Role-based (user / admin)', icon: Shield },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-primary">{item.label}</span>
                      </div>
                      <span className="text-sm text-gray-500">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent" /> Active Sessions
                </h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800 text-sm">Current Session</p>
                    <p className="text-xs text-green-600 mt-0.5">This device — Active now</p>
                  </div>
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">Active</span>
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={logout} className="btn-danger">Sign Out of All Devices</button>
                </div>
              </div>
            </>
          )}

          {/* Preferences Section */}
          {activeSection === 'Preferences' && (
            <div className="card p-6">
              <h3 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-accent" /> App Preferences
              </h3>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-primary text-sm flex items-center gap-2">
                      <Moon className="w-4 h-4 text-gray-400" /> Dark Mode
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Toggle dark mode interface (coming soon)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-50">
                    <input type="checkbox" className="sr-only peer" disabled />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium text-primary text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" /> Language
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Supported: English, मराठी, हिंदी</p>
                  </div>
                  <select
                    className="input-field w-36 py-1.5 text-sm"
                    value={preferences.language}
                    onChange={e => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  >
                    <option>English</option>
                    <option>मराठी</option>
                    <option>हिंदी</option>
                    <option>தமிழ்</option>
                    <option>తెలుగు</option>
                    <option>বাংলা</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button className="btn-primary">Save Preferences</button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-1">Export Your Data</h4>
                <p className="text-xs text-blue-600 mb-3">Download a copy of all your documents and extracted metadata.</p>
                <button className="flex items-center gap-2 btn-secondary text-sm">
                  <Download className="w-4 h-4" /> Export Data
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
