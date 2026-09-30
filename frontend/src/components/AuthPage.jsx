import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Shield
} from 'lucide-react';
import { authService } from '../api';

export function AuthPage({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanUser = username.trim();
    if (!cleanUser || !password) {
      setError('Please provide both username and password.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const data = await authService.login(cleanUser, password);
        if (onAuthSuccess) {
          onAuthSuccess(data);
        }
      } else {
        const data = await authService.signup(cleanUser, password, role);
        setSuccessMsg(data.message || 'Account created successfully! You can now log in.');
        setIsLogin(true);
        setConfirmPassword('');
      }
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Authentication error';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError(null);
    setSuccessMsg('Demo credentials filled: "admin" / "admin123"');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* Header with Mainframe Badge */}
        <div className="auth-header">
          <div className="auth-badge">
            <span className="badge-pulse"></span>
            <ShieldCheck size={13} style={{ marginRight: '2px' }} />
            IBM z/OS SECURE GATEWAY
          </div>
          <h1 className="auth-title">Fraud Detection System</h1>
          <p className="auth-subtitle">
            Enterprise JWT Authentication & Mainframe Spool Guard
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setSuccessMsg(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setSuccessMsg(null);
            }}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="auth-alert error-alert">
            <AlertCircle size={16} className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="auth-alert success-alert">
            <CheckCircle2 size={16} className="alert-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="auth-username">Operator ID / Username</label>
            <input
              id="auth-username"
              type="text"
              placeholder="e.g. jdoe or admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Security Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
          </div>

          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="auth-confirm-password">Confirm Password</label>
                <input
                  id="auth-confirm-password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-role">System Authorization Role</label>
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">Operator (Standard Access)</option>
                  <option value="admin">Mainframe Auditor (Admin Access)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                {isLogin ? 'Verifying Credentials...' : 'Registering Account...'}
              </span>
            ) : isLogin ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <LogIn size={16} /> Sign In to Mainframe Gateway
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={16} /> Register New Operator
              </span>
            )}
          </button>
        </form>

        {/* Demo Account Helper */}
        {isLogin && (
          <div className="demo-helper">
            <span>First time testing?</span>
            <button
              type="button"
              className="demo-btn"
              onClick={handleQuickDemo}
            >
              <Sparkles size={13} style={{ marginRight: '4px' }} />
              Fill Default Demo Account (admin)
            </button>
          </div>
        )}

        <div className="auth-footer">
          <small>
            Protected by SQLite Local Vault & PyJWT HS256. Web credentials are never stored in mainframe VSAM data sets.
          </small>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
