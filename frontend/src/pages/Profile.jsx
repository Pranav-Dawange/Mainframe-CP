import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Profile</h1>

      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">{user?.username || 'User'}</h2>
            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
            }`}>
              {user?.role === 'admin' ? 'Administrator' : 'Active Account'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-primary mb-4">Account Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-primary font-medium">{user?.username || '—'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Account ID</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-primary font-medium">#{user?.id || '—'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-primary font-medium capitalize">{user?.role || 'user'}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Security</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-primary font-medium">Password</span>
                </div>
                <button className="text-sm text-accent hover:underline font-medium">Change</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
