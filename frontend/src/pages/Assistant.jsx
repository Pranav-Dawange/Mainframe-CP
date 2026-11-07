import React, { useState, useRef, useEffect } from 'react';
import { Send, Key, Sparkles, RefreshCw } from 'lucide-react';
import { assistantApi } from '../api/api';

// Animated Cute Cat Component with emotions
const CuteCatBot = ({ emotion = 'happy', isThinking = false }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Cat SVG with lively emotion morphing and tail animation */}
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
          {/* Animated Tail */}
          <path
            d="M 28 85 C 10 95 5 70 12 55 C 15 48 24 55 20 65 C 16 75 22 80 32 82 Z"
            fill="#fbbf24"
            className="origin-bottom-right"
            style={{
              transformOrigin: '28px 85px',
              animation: emotion === 'celebrating' ? 'catTailFast 0.6s infinite ease-in-out' : 'catTail 2.4s infinite ease-in-out'
            }}
          />

          {/* Cat Body */}
          <ellipse cx="60" cy="80" rx="34" ry="26" fill="#f59e0b" />
          <ellipse cx="60" cy="82" rx="22" ry="18" fill="#fef3c7" />

          {/* Left Ear */}
          <polygon points="36,40 28,14 50,28" fill="#f59e0b" />
          <polygon points="36,36 32,18 46,28" fill="#f43f5e" />

          {/* Right Ear */}
          <polygon points="84,40 92,14 70,28" fill="#f59e0b" />
          <polygon points="84,36 88,18 74,28" fill="#f43f5e" />

          {/* Cat Head */}
          <circle cx="60" cy="50" r="30" fill="#f59e0b" />

          {/* Cheeks blush */}
          <ellipse cx="44" cy="58" rx="5" ry="3" fill="#fda4af" opacity="0.8" />
          <ellipse cx="76" cy="58" rx="5" ry="3" fill="#fda4af" opacity="0.8" />

          {/* Whiskers */}
          <line x1="28" y1="52" x2="14" y2="48" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="28" y1="56" x2="12" y2="58" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="52" x2="106" y2="48" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <line x1="92" y1="56" x2="108" y2="58" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />

          {/* Eyes depending on Emotion */}
          {emotion === 'celebrating' ? (
            // Joyful curved happy squint eyes (^^)
            <g>
              <path d="M 43 48 Q 48 40 53 48" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M 67 48 Q 72 40 77 48" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          ) : emotion === 'curious' ? (
            // Wide curious big anime eyes
            <g>
              <circle cx="48" cy="46" r="7" fill="#1e293b" />
              <circle cx="50" cy="44" r="2.5" fill="#ffffff" />
              <circle cx="72" cy="46" r="7" fill="#1e293b" />
              <circle cx="74" cy="44" r="2.5" fill="#ffffff" />
            </g>
          ) : isThinking ? (
            // Looking up thinking eyes
            <g>
              <ellipse cx="48" cy="44" rx="6" ry="6" fill="#1e293b" />
              <circle cx="46" cy="42" r="2" fill="#ffffff" />
              <ellipse cx="72" cy="44" rx="6" ry="6" fill="#1e293b" />
              <circle cx="70" cy="42" r="2" fill="#ffffff" />
            </g>
          ) : (
            // Friendly default blinking eyes
            <g>
              <ellipse cx="48" cy="46" rx="5.5" ry="6" fill="#1e293b" />
              <circle cx="50" cy="44" r="2" fill="#ffffff" />
              <ellipse cx="72" cy="46" rx="5.5" ry="6" fill="#1e293b" />
              <circle cx="74" cy="44" r="2" fill="#ffffff" />
            </g>
          )}

          {/* Nose */}
          <polygon points="60,54 57,51 63,51" fill="#f43f5e" />

          {/* Mouth */}
          {emotion === 'celebrating' ? (
            <path d="M 54 56 Q 60 66 66 56" fill="#f43f5e" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <path d="M 54 55 Q 57 58 60 55 Q 63 58 66 55" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Paws */}
          <ellipse cx="46" cy="94" rx="7" ry="5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <ellipse cx="74" cy="94" rx="7" ry="5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>

        {/* Emotion sparkle badge */}
        {emotion === 'celebrating' && (
          <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</span>
        )}
        {emotion === 'curious' && (
          <span className="absolute -top-1 -right-1 text-2xl animate-pulse">🐾</span>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full shadow-sm">
          {isThinking ? 'Paw-sing to think...' : emotion === 'celebrating' ? 'Purring with joy! ✨' : emotion === 'curious' ? 'Curious Cat 🐾' : 'NekoVault AI'}
        </span>
      </div>
    </div>
  );
};

const Assistant = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Meow! 🐱 I am NekoVault, your feline intelligence assistant for LifeVault! 🐾\nI can read your OCR scanned documents, summarize your utility bills, calculate total spending, or check when your product warranties expire! Meow, what should we search today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [catEmotion, setCatEmotion] = useState('happy');
  const [activeEngine, setActiveEngine] = useState('auto'); // auto, gemini, groq
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [geminiKey, setGeminiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [groqKey, setGroqKey] = useState(localStorage.getItem('groq_api_key') || '');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const saveKeys = () => {
    localStorage.setItem('gemini_api_key', geminiKey);
    localStorage.setItem('groq_api_key', groqKey);
    setShowKeyModal(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCatEmotion('curious');

    try {
      const res = await assistantApi.ask(
        userMessage, 
        geminiKey ? geminiKey.trim() : null, 
        groqKey ? groqKey.trim() : null
      );
      
      const reply = res.data.answer || 'Meow! I found nothing matching in your records.';
      const engine = res.data.engine || 'local_cat';
      const emotion = res.data.emotion || 'happy';

      setActiveEngine(engine);
      setCatEmotion(emotion);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, engine }]);
    } catch (err) {
      setCatEmotion('happy');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Purr~ I had a slight hiccup connecting to the server. But don\'t worry, try asking me again or check your document list!' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col max-w-5xl mx-auto space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-inner">
            🐱
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary flex items-center gap-2">
              NekoVault Cat Bot
              <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-mono">
                Gemini + Groq Backup
              </span>
            </h1>
            <p className="text-xs text-gray-500">
              Active engine: <span className="font-semibold text-accent capitalize">{activeEngine.replace('_', ' ')}</span> &bull; Full document intelligence
            </p>
          </div>
        </div>

        <button 
          onClick={() => setShowKeyModal(true)}
          className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-1.5"
        >
          <Key className="w-3.5 h-3.5 text-amber-600" />
          API Keys (Gemini & Groq)
        </button>
      </div>

      {/* Main chat layout */}
      <div className="flex-1 card flex overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
        {/* Left Side: Animated Cat Mascot */}
        <div className="hidden md:flex w-56 bg-gradient-to-b from-amber-50/60 to-orange-50/30 border-r border-amber-100/80 flex-col items-center justify-between p-4">
          <CuteCatBot emotion={catEmotion} isThinking={isLoading} />
          
          <div className="w-full bg-white/80 rounded-xl p-3 border border-amber-100 text-center shadow-xs">
            <p className="text-xs font-semibold text-amber-900 mb-1">🐾 Quick Prompts</p>
            <div className="space-y-1.5 text-xs text-gray-600">
              <button 
                onClick={() => setInput('What are my upcoming warranties?')}
                className="w-full text-left p-1.5 rounded hover:bg-amber-100/60 transition-colors truncate"
              >
                &bull; Warranties list
              </button>
              <button 
                onClick={() => setInput('How much have I spent on bills?')}
                className="w-full text-left p-1.5 rounded hover:bg-amber-100/60 transition-colors truncate"
              >
                &bull; Total bill spend
              </button>
              <button 
                onClick={() => setInput('Show my latest uploaded documents')}
                className="w-full text-left p-1.5 rounded hover:bg-amber-100/60 transition-colors truncate"
              >
                &bull; All my docs
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="flex-1 flex flex-col bg-gray-50/50">
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                  msg.role === 'user' ? 'bg-primary text-white shadow' : 'bg-amber-500 text-white shadow'
                }`}>
                  {msg.role === 'user' ? '👤' : '🐱'}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.engine && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-gray-400">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Engine: {msg.engine}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex-shrink-0 flex items-center justify-center font-bold shadow">
                  🐱
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="text-xs text-gray-500 mr-2">NekoVault is reviewing your documents...</span>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about bills, warranties, extracted OCR totals, or documents..."
                className="w-full pl-5 pr-14 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm transition-all"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className={`absolute right-2 p-2.5 rounded-lg ${
                  input.trim() && !isLoading ? 'bg-amber-500 text-white hover:bg-amber-600 shadow' : 'bg-gray-200 text-gray-400'
                } transition-colors`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* API Key Modal for Gemini & Groq */}
      {showKeyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                Configure AI Engines
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              NekoVault uses <strong>Google Gemini</strong> as primary, and <strong>Groq Cloud</strong> as an instant backup. If no keys are provided, it operates via its built-in local vault rule engine!
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Google Gemini API Key (Primary)
                </label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Groq API Key (Backup)
                </label>
                <input
                  type="password"
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="input-field text-sm"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowKeyModal(false)} className="btn-secondary text-sm">
                Cancel
              </button>
              <button onClick={saveKeys} className="btn-primary text-sm px-5 bg-amber-500 hover:bg-amber-600">
                Save & Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SVG tail keyframes */}
      <style>{`
        @keyframes catTail {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(14deg); }
        }
        @keyframes catTailFast {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(25deg); }
        }
      `}</style>
    </div>
  );
};

export default Assistant;
