import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-center px-16">
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-10 h-10 text-accent-light" />
          <span className="text-3xl font-bold text-white">LifeVault</span>
        </div>
        <h2 className="text-4xl font-bold text-white mb-6">Your important documents, organized and protected.</h2>
        <p className="text-primary-400 text-lg">
          LifeVault securely stores and manages your personal documents, tracks warranties, and alerts you to expiries — all in one intelligent platform.
        </p>
        <div className="mt-12 space-y-3">
          {['Smart document management', 'AI-powered information extraction', 'Warranty & expiry tracking'].map(f => (
            <div key={f} className="flex items-center gap-3 text-primary-300">
              <div className="w-2 h-2 rounded-full bg-accent-light flex-shrink-0"></div>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Login Card */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-md w-full card p-8">
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <ShieldAlert className="w-8 h-8 text-accent" />
              <span className="text-xl font-bold text-primary">LifeVault</span>
            </div>
            <h2 className="text-3xl font-extrabold text-primary">Welcome back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-dark font-medium">
                Create account
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-accent hover:text-accent-dark">Forgot password?</a>
              </div>
              <input
                type="password"
                required
                className="input-field"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300 text-accent" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 text-base">
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-gray-400">
            Default demo account: <code className="bg-gray-100 px-1 rounded">admin</code> / <code className="bg-gray-100 px-1 rounded">admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
