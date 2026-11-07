import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';
import { RealisticCatGuard } from '../components/RealisticCatGuard';
import { catAudio } from '../utils/catAudio';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTypingPassword, setIsTypingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState('normal'); // 'normal', 'wrong', 'correct'
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePasswordFocus = () => {
    setIsTypingPassword(true);
    if (soundEnabled) catAudio.play('neutral', 0.55);
  };

  const handlePasswordBlur = () => {
    // Keep covering if there's password text, unless cleared
    if (!password) {
      setIsTypingPassword(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setIsTypingPassword(true);
    if (soundEnabled && e.target.value.length % 3 === 0) {
      catAudio.play('neutral', 0.5);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ username, password });
      setLoginState('correct');
      if (soundEnabled) catAudio.play('excited', 0.75);

      // Brief celebratory delay so user can enjoy the cats dancing
      setTimeout(() => {
        navigate('/dashboard');
      }, 1400);

    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || 'Invalid username or password. Please try again.');
      setLoginState('wrong');
      if (soundEnabled) catAudio.play('sad', 0.7);

      // Reset sad face back to normal after 3.5s
      setTimeout(() => {
        setLoginState('normal');
      }, 3500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-slate-900 text-slate-100">
      {/* Sound toggle button */}
      <button 
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed top-4 right-4 z-40 p-2.5 bg-slate-800/90 backdrop-blur-md rounded-full shadow-lg text-slate-200 hover:bg-slate-700 border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-medium"
        title="Toggle Cat Audio"
      >
        {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        <span className="hidden sm:inline">{soundEnabled ? 'Cat Audio On' : 'Audio Muted'}</span>
      </button>

      {/* LEFT SIDE: PHOTOREALISTIC CAT GUARD */}
      <div className="lg:w-7/12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col justify-center items-center px-6 py-10 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        <div className="max-w-lg w-full text-center mb-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full text-slate-300 font-semibold text-xs mb-2.5 border border-slate-700 shadow-sm">
            🐾 Realistic Sentinel Cats &bull; Studio Lighting
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Protected by Our Watchful Whiskers
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Photorealistic felines reacting to your keystrokes — covering their eyes with anatomical paws, while the mischievous ginger cat subtly peeks through the gap!
          </p>
        </div>

        {/* PHOTOREALISTIC CAT ANIMATION */}
        <div className="w-full z-10">
          <RealisticCatGuard 
            isTypingPassword={isTypingPassword} 
            loginState={loginState} 
          />
        </div>
        {/* Floating paw prints background deco */}
        <div className="absolute top-6 left-8 text-4xl opacity-15 rotate-12 pointer-events-none">🐾</div>
        <div className="absolute bottom-10 left-12 text-5xl opacity-10 -rotate-12 pointer-events-none">🐾</div>
        <div className="absolute top-1/2 right-6 text-3xl opacity-15 rotate-45 pointer-events-none">🐾</div>
      </div>


      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 sm:px-12 bg-white">
        <div className="max-w-md w-full p-8 rounded-3xl border border-gray-100 shadow-xl bg-white/90">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-white mb-3 shadow-lg shadow-amber-500/20 text-2xl font-bold">
              🐱
            </div>
            <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
            <p className="mt-1 text-sm text-gray-500">
              Access your safe personal vault & warranty intel
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3.5 rounded-xl mb-6 text-sm text-center border border-red-200 font-medium animate-shake flex items-center justify-center gap-2">
              <span>😿</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                className="input-field bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 text-sm font-medium py-3"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => {
                  if (!password) setIsTypingPassword(false);
                }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <a href="#" className="text-xs text-accent hover:underline font-semibold">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="input-field bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 text-sm font-medium py-3 pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" id="remember" className="rounded border-gray-300 text-amber-500 focus:ring-amber-400" />
                <span>Remember this device</span>
              </label>
              <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-mono">
                Audio SFX Active 🔊
              </span>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full py-3.5 rounded-xl font-bold text-white text-sm transition-all shadow-lg shadow-amber-500/25 ${
                loginState === 'correct' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {isLoading ? 'Verifying Credentials...' : loginState === 'correct' ? '🎉 Authenticated!' : 'Sign In to LifeVault'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-accent hover:underline font-bold">
              Create an account
            </Link>
          </div>

          <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-center text-xs text-amber-800">
            Demo account: <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-bold">admin</code> / <code className="bg-white px-1.5 py-0.5 rounded border border-amber-200 font-bold">admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
