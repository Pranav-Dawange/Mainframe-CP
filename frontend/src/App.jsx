import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  BarChart3, 
  Lock, 
  Send, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Trash2, 
  LogOut, 
  Server, 
  Database, 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  AlertCircle,
  Terminal,
  Activity
} from 'lucide-react';
import { authService, mainframeService } from './api';
import AuthPage from './components/AuthPage';

// Simple Error Boundary component to prevent blank screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '60px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h2 style={{ color: '#c53030', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertCircle size={22} /> System UI Error Encountered
          </h2>
          <p style={{ color: '#4a5568', marginBottom: '20px', fontSize: '14px' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ background: '#005A9C', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Clear Cache & Reset Session
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainframeDashboard() {
  const [user, setUser] = useState(() => authService.getStoredUser());
  const [token, setToken] = useState(() => authService.getToken());
  
  // Transaction & Report state
  const [accountNum, setAccountNum] = useState('1000000002');
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [copied, setCopied] = useState(false);

  // Validate session on load
  useEffect(() => {
    // If token exists but user info is missing or corrupted, reset
    if (token && (!user || !user.username)) {
      handleLogout();
      return;
    }

    if (token) {
      authService.getCurrentUser()
        .then((userData) => {
          if (userData && userData.username) {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        })
        .catch(() => {
          // Token expired or invalid
          handleLogout();
        });
    }

    const handleUnauthorized = () => {
      handleLogout();
      setNotification({ type: 'warning', text: 'Session expired. Please log in again.' });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  // Flash notification helper
  const showToast = (text, type = 'info') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleAuthSuccess = (loginResponse) => {
    if (!loginResponse || !loginResponse.access_token) return;
    setToken(loginResponse.access_token);
    setUser({
      username: loginResponse.username || 'Operator',
      role: loginResponse.role || 'user'
    });
    setError(null);
    showToast(`Welcome back, ${loginResponse.username || 'Operator'}! Mainframe session established.`, 'success');
  };

  const handleLogout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setOutput(null);
    setError(null);
  };

  // Feature 1: Process Transaction via Axios (Protected)
  const handleTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutput(null);
    setError(null);

    try {
      await mainframeService.submitTransaction(accountNum, amount);
      setOutput(`[BATCH QUEUE CONFIRMATION]\nTimestamp: ${new Date().toISOString()}\nTarget VSAM Account: ${accountNum}\nAmount: ₹${amount}.00\nStatus: Transaction successfully queued for batch verification.\nSecurity: Signed by Operator [${user?.username || 'Authenticated'}] via JWT HS256.`);
      showToast('Transaction successfully submitted to batch queue!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to submit transaction';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Feature 2: Generate Report via Axios (Protected)
  const handleGenerateReport = async () => {
    setReportLoading(true);
    setOutput(null);
    setError(null);

    try {
      const data = await mainframeService.generateReport();
      setOutput(data);
      showToast('Mainframe audit spool retrieved successfully!', 'success');
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to generate audit report';
      setError(msg);
    } finally {
      setReportLoading(false);
    }
  };

  // Feature 3: Download SYSOUT spool receipt
  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `Mainframe_Audit_Receipt_${dateStr}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Spool receipt downloaded to your system.', 'info');
  };

  // Feature 4: Copy Spool output
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    showToast('Terminal spool copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const isAuthenticated = Boolean(token && user && user.username);

  // If not logged in, render the Login/Signup page
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const safeUsername = user?.username || 'Operator';
  const safeRole = user?.role || 'user';

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>
          <span className="toast-dot"></span>
          <span>{notification.text}</span>
          <button className="toast-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      {/* Top Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <div className="brand-logo">
            <span className="logo-pulse"></span>
            <Terminal size={17} className="brand-icon" />
            <span className="logo-symbol">z/OS</span>
          </div>
          <div>
            <h1 className="navbar-title">
              Multi-Channel Transaction Fraud Detection & Auto-Reversal
            </h1>
            <p className="navbar-subtitle">
              IBM z/OS Mainframe Batch & VSAM Telemetry Bridge
            </p>
          </div>
        </div>

        {/* User Session Profile & Logout */}
        <div className="navbar-actions">
          <div className="user-profile-badge">
            <div className="user-avatar">
              {safeUsername.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <span className="user-name">{safeUsername}</span>
              <span className={`role-badge role-${safeRole}`}>
                {safeRole.toUpperCase()}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Sign out of Mainframe Gateway">
            <LogOut size={14} className="logout-icon" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Telemetry Status Bar */}
      <section className="status-grid">
        <div className="status-card">
          <div className="status-header">
            <span className="status-label">Mainframe Target</span>
            <Server size={15} className="status-icon-blue" />
          </div>
          <span className="status-value highlight-blue">IBM z/OS v2.5</span>
          <span className="status-sub">Dataset: Z72771.JCL(RPTGEN)</span>
        </div>
        <div className="status-card">
          <div className="status-header">
            <span className="status-label">Master Storage</span>
            <Database size={15} className="status-icon-green" />
          </div>
          <span className="status-value highlight-green">VSAM KSDS Active</span>
          <span className="status-sub">Auto-Reversal Log Synchronized</span>
        </div>
        <div className="status-card">
          <div className="status-header">
            <span className="status-label">Security Gateway</span>
            <ShieldCheck size={15} className="status-icon-purple" />
          </div>
          <span className="status-value highlight-purple">JWT Bearer (HS256)</span>
          <span className="status-sub">Local SQLite Vault Guarded</span>
        </div>
        <div className="status-card">
          <div className="status-header">
            <span className="status-label">Operator Authority</span>
            <UserCheck size={15} className="status-icon-orange" />
          </div>
          <span className="status-value highlight-orange">
            {safeRole === 'admin' ? 'Auditor / Full Access' : 'Operator / Standard'}
          </span>
          <span className="status-sub">Session Validated via FastAPI</span>
        </div>
      </section>

      {/* Main Operations Grid */}
      <main className="main-content">
        <div className="panels-row">
          
          {/* LEFT PANEL: Point of Sale Simulator */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title-group">
                <div className="panel-icon-badge badge-blue">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="panel-title">Point of Sale (Input Channel)</h2>
                  <p className="panel-desc">Transmit transactional debit requests to the batch staging queue</p>
                </div>
              </div>
              <span className="secure-badge">
                <Lock size={12} className="lock-icon" /> JWT Protected
              </span>
            </div>

            <form onSubmit={handleTransaction} className="panel-form">
              <div className="input-group">
                <label htmlFor="account-num">
                  Target Account (VSAM 10-Digit Key):
                </label>
                <div className="input-with-prefix">
                  <span className="field-prefix">ACC#</span>
                  <input
                    id="account-num"
                    type="text"
                    value={accountNum}
                    onChange={(e) => setAccountNum(e.target.value)}
                    required
                    placeholder="1000000002"
                    pattern="[0-9]{10}"
                    title="10-digit numeric account number"
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="txn-amount">
                  Withdrawal Amount (₹ INR):
                </label>
                <div className="input-with-prefix">
                  <span className="field-prefix">₹</span>
                  <input
                    id="txn-amount"
                    type="number"
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="1000"
                  />
                </div>

                {/* Preset Chips */}
                <div className="preset-chips">
                  <span>Quick Presets:</span>
                  {['250', '1000', '5000', '15000'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`preset-btn ${amount === preset ? 'active' : ''}`}
                      onClick={() => setAmount(preset)}
                    >
                      <span>₹{Number(preset).toLocaleString()}</span>
                      {preset === '15000' && (
                        <AlertTriangle size={12} className="preset-alert-icon" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="vsam-helper-box">
                <span className="code-tag">VSAM 80B Layout:</span>
                <code>{accountNum.padEnd(10, ' ')}W{String(Math.floor(Number(amount) || 0)).padStart(5, '0')}00...</code>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-btn primary-btn"
              >
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Submitting to Batch Queue...
                  </span>
                ) : (
                  <span className="btn-content">
                    <Send size={15} />
                    Transmit Transaction via Protected API
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT PANEL: Auditor & Compliance */}
          <div className="panel-card">
            <div className="panel-header">
              <div className="panel-title-group">
                <div className="panel-icon-badge badge-emerald">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2 className="panel-title">Auditor & Compliance Hub</h2>
                  <p className="panel-desc">Execute RPTGEN batch reconciliation against VSAM Master and Reversal logs</p>
                </div>
              </div>
              <span className="secure-badge">
                <Lock size={12} className="lock-icon" /> JWT Protected
              </span>
            </div>

            <div className="audit-content">
              <div className="audit-card-info">
                <h3>Batch Job Specification</h3>
                <ul>
                  <li><strong>Target Dataset:</strong> <code>Z72771.JCL(RPTGEN)</code></li>
                  <li><strong>Execution Mode:</strong> Synchronous Spool Fetch (<code>--view-all-spool-content</code>)</li>
                  <li><strong>COBOL Logic:</strong> Rule-based fraud detection & auto-reversal ledger audit</li>
                  <li><strong>Timeout:</strong> 30 seconds safety cut-off</li>
                </ul>
              </div>

              <p className="compliance-note">
                Notice: Triggering this action dispatches an authorized command to the IBM z/OS server. Unauthenticated requests are immediately denied by FastAPI security policies.
              </p>

              <button
                type="button"
                onClick={handleGenerateReport}
                disabled={reportLoading}
                className="submit-btn success-btn"
              >
                {reportLoading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Executing RPTGEN on Mainframe...
                  </span>
                ) : (
                  <span className="btn-content">
                    <FileText size={15} />
                    Generate Compliance Audit Report
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="error-banner">
            <div className="error-title">
              <AlertCircle size={18} />
              <strong>Security / Mainframe Error Encountered:</strong>
            </div>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Mainframe SYSOUT Spool Terminal Window */}
        {output && (
          <div className="terminal-container">
            <div className="terminal-header">
              <div className="terminal-left">
                <div className="terminal-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <Terminal size={14} className="terminal-feed-icon" />
                <span className="terminal-title">
                  IBM z/OS SPOOL OUTPUT (SYSOUT) — RPTGEN AUDIT STREAM
                </span>
                <span className="terminal-live-badge">ONLINE</span>
              </div>

              <div className="terminal-actions">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="terminal-btn"
                  title="Copy terminal contents"
                >
                  {copied ? <Check size={13} className="btn-inline-icon" /> : <Copy size={13} className="btn-inline-icon" />}
                  {copied ? 'Copied' : 'Copy Output'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="terminal-btn terminal-btn-download"
                  title="Download audit receipt as text file"
                >
                  <Download size={13} className="btn-inline-icon" />
                  Download Receipt (.TXT)
                </button>
                <button
                  type="button"
                  onClick={() => setOutput(null)}
                  className="terminal-btn terminal-btn-clear"
                  title="Clear terminal window"
                >
                  <Trash2 size={13} className="btn-inline-icon" />
                  Clear
                </button>
              </div>
            </div>

            <div className="terminal-body">
              <pre className="terminal-pre">
                {output}
              </pre>
            </div>

            <div className="terminal-footer">
              <span>Spool lines: {output.split('\n').length} | Char count: {output.length}</span>
              <span>Protected Session: {safeUsername} | Role: {safeRole}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainframeDashboard />
    </ErrorBoundary>
  );
}