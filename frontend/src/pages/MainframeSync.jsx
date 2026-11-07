import React, { useState, useEffect } from 'react';
import { Terminal, Database, Server, RefreshCw, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { mainframeApi } from '../api/api';

const MainframeSync = () => {
  const [status, setStatus] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountNum, setAccountNum] = useState('1000000003');
  const [amount, setAmount] = useState('500');
  const [jobOutput, setJobOutput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMainframeInfo();
  }, []);

  const fetchMainframeInfo = async () => {
    setLoading(true);
    try {
      const [statusRes, datasetsRes] = await Promise.all([
        mainframeApi.getStatus(),
        mainframeApi.getDatasets()
      ]);
      setStatus(statusRes.data);
      setDatasets(datasetsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteBatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setJobOutput('');
    try {
      const formData = new URLSearchParams();
      formData.append('account_num', accountNum);
      formData.append('amount', amount);

      const res = await mainframeApi.submitTransaction(formData);
      setJobOutput(res.data);
    } catch (err) {
      setJobOutput(err?.response?.data || err.message || 'Failed to trigger Zowe batch execution.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Server className="w-7 h-7 text-accent" />
            z/OS Mainframe &amp; Zowe Integration
          </h1>
          <p className="text-sm text-slate-500">
            Real-time bridge connecting LifeVault to IBM z/OS via Zowe CLI and z/OSMF
          </p>
        </div>
        <button 
          onClick={fetchMainframeInfo} 
          disabled={loading}
          className="btn-secondary text-xs flex items-center gap-1.5 py-2 px-3"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Connection
        </button>
      </div>

      {/* Connection Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 bg-white border border-slate-200">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">z/OSMF Host IP</p>
          <p className="text-lg font-mono font-bold text-slate-800">204.90.115.200</p>
          <p className="text-xs text-slate-500 mt-1">Port: 10443 (HTTPS)</p>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Zowe User Account</p>
          <p className="text-lg font-mono font-bold text-accent">z73897</p>
          <p className="text-xs text-slate-500 mt-1">TSO Logon: IZUFPROC &bull; Acct: FB3</p>
        </div>

        <div className="card p-5 bg-white border border-slate-200">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-1">Bridge Link State</p>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-600">
              {status?.connected ? 'Online & Authenticated' : 'Profile Configured'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 truncate">{status?.details || 'z/OSMF Profile Linked'}</p>
        </div>
      </div>

      {/* Mainframe Datasets Table */}
      <div className="card p-6 bg-white border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-accent" />
          Mapped z/OS Datasets (Storage Files)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Dataset Name</th>
                <th className="py-3 px-4">Organization Type</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {datasets.map((ds) => (
                <tr key={ds.name} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-accent">{ds.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-sans">{ds.type}</td>
                  <td className="py-3 px-4 text-slate-600 font-sans">{ds.description}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      {ds.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIFEVAULT DEDICATED JCL PANEL */}
      <div className="card p-6 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border border-blue-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent text-white uppercase tracking-wider">
              LifeVault Native JCL
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              Batch Store &amp; Retrieve Documents via <code className="text-accent font-mono">Z73897.JCL(LVAULT)</code>
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Executes a batch job on z/OS to format your vault records into 80-byte sequential cards, store them into <code className="bg-white px-1 rounded font-bold">Z73897.OUTPUT(LVAULTO)</code>, and retrieve the JES2 spool output.
            </p>
          </div>

          <button
            onClick={async () => {
              setSubmitting(true);
              setJobOutput('');
              try {
                const res = await mainframeApi.syncLifeVaultJcl();
                if (res.data.success) {
                  setJobOutput(
                    `=== LIFEVAULT JCL EXECUTION SUCCESS ===\n` +
                    `Assigned Job: ${res.data.job_id}\n` +
                    `JCL Dataset:  ${res.data.jcl_dataset}\n` +
                    `Target Store: ${res.data.output_dataset}\n` +
                    `Records Synced: ${res.data.records_archived}\n\n` +
                    `--- z/OS SPOOL OUTPUT (JES2) ---\n` +
                    res.data.spool_output
                  );
                } else {
                  setJobOutput(res.data.error || 'Execution failed');
                }
              } catch (e) {
                setJobOutput(e.message || 'Error executing LifeVault JCL');
              } finally {
                setSubmitting(false);
              }
            }}
            disabled={submitting}
            className="btn-primary text-xs font-bold py-3 px-6 flex items-center gap-2 flex-shrink-0 shadow-lg shadow-blue-500/20"
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Execute LifeVault JCL (LVAULT)
          </button>
        </div>
      </div>

      {/* Interactive Mainframe Job Submission */}
      <div className="card p-6 bg-white border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent" />
          Legacy Job Runner: <code className="font-mono text-accent">Z72771.JCL(RPTGEN)</code>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Runs batch jobs on z/OS and inspects spool logs.
        </p>

        <form onSubmit={handleExecuteBatch} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Mainframe Account Number
            </label>
            <input
              type="text"
              value={accountNum}
              onChange={(e) => setAccountNum(e.target.value)}
              className="input-field font-mono text-xs"
              placeholder="1000000003"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Transaction Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field font-mono text-xs"
              placeholder="500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Executing on z/OS...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Submit to Mainframe (Zowe)
                </>
              )}
            </button>
          </div>
        </form>

        {jobOutput && (
          <div className="mt-4">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <span>Mainframe Spool Output</span>
              <span className="text-[10px] text-slate-400 font-normal">(JES2 Job Log)</span>
            </p>
            <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
              {jobOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainframeSync;
