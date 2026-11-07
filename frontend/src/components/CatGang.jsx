import React from 'react';

/**
 * Animated SVG Cat Gang Component
 * Features:
 * - Bunch of cute cats (including chunky / fat cats)
 * - Animated tail wagging on all cats
 * - Eye-covering action when password input is focused / typing
 * - Exactly ONE sneaky cat that peeks through its paws
 * - Sad crying expression when wrong password
 * - Celebration party mode when password is correct
 */
export const CatGang = ({ 
  isTypingPassword = false, 
  loginState = 'normal' // 'normal', 'wrong', 'correct'
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none py-6">
      {/* Speech bubble / status from cats */}
      <div className="mb-4 bg-white/90 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-md border border-amber-200 text-xs font-bold text-amber-900 transition-all flex items-center gap-2">
        {loginState === 'wrong' ? (
          <span className="text-red-600 flex items-center gap-1 animate-bounce">
            😿 Meow... wrong password! Try again! 💔
          </span>
        ) : loginState === 'correct' ? (
          <span className="text-green-600 flex items-center gap-1 animate-bounce">
            🎉 YAAAY!! Welcome back to LifeVault! 🐾✨
          </span>
        ) : isTypingPassword ? (
          <span className="text-amber-700 flex items-center gap-1">
            🙈 We won't look... (except sneaky ginger kitty!) 🤫
          </span>
        ) : (
          <span className="text-amber-800 flex items-center gap-1">
            🐱 The LifeVault Cat Guard is keeping your records safe!
          </span>
        )}
      </div>

      {/* SVG Container holding the entire crew of cats */}
      <svg viewBox="0 0 540 280" className="w-full h-auto drop-shadow-xl overflow-visible">
        <defs>
          <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft shadow under the cats */}
        <ellipse cx="270" cy="255" rx="230" ry="22" fill="url(#groundShadow)" />

        {/* ========================================================= */}
        {/* CAT 1: FAT CHONKY CALICO CAT (Back-Left, Leftmost)       */}
        {/* ========================================================= */}
        <g id="fat-calico-cat">
          {/* Animated Tail */}
          <path
            d="M 60 210 C 25 210 15 170 30 150 C 36 142 46 150 42 162 C 34 176 44 195 64 195 Z"
            fill="#d97706"
            style={{
              transformOrigin: '60px 210px',
              animation: loginState === 'correct' ? 'wagFast 0.5s infinite alternate ease-in-out' : 'wag1 2.2s infinite alternate ease-in-out'
            }}
          />

          {/* Super Fat Round Body */}
          <ellipse cx="95" cy="195" rx="55" ry="46" fill="#fef3c7" stroke="#b45309" strokeWidth="2.5" />
          {/* Calico Spot */}
          <path d="M 60 170 Q 80 155 105 170 Q 95 200 65 195 Z" fill="#ea580c" />
          <path d="M 115 180 Q 135 175 145 195 Q 125 210 115 180 Z" fill="#334155" />

          {/* Head */}
          <ellipse cx="95" cy="140" rx="36" ry="30" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          {/* Ears */}
          <polygon points="68,124 55,95 82,112" fill="#ea580c" stroke="#b45309" strokeWidth="2" />
          <polygon points="122,124 135,95 108,112" fill="#334155" stroke="#b45309" strokeWidth="2" />

          {/* Facial features */}
          {loginState === 'correct' ? (
            // Big happy squint eyes
            <g>
              <path d="M 78 138 Q 85 130 92 138" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <path d="M 98 138 Q 105 130 112 138" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              <path d="M 90 148 Q 95 158 100 148" fill="#f43f5e" />
            </g>
          ) : loginState === 'wrong' ? (
            // Sad crying eyes with tears
            <g>
              <ellipse cx="85" cy="138" rx="4" ry="5" fill="#1e293b" />
              <ellipse cx="105" cy="138" rx="4" ry="5" fill="#1e293b" />
              <path d="M 90 152 Q 95 146 100 152" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
              {/* Tear drops */}
              <circle cx="82" cy="148" r="2.5" fill="#38bdf8" />
              <circle cx="108" cy="148" r="2.5" fill="#38bdf8" />
            </g>
          ) : (
            // Normal / Paws covering eyes
            <g>
              {!isTypingPassword && (
                <>
                  <circle cx="85" cy="138" r="4.5" fill="#1e293b" />
                  <circle cx="86" cy="136" r="1.5" fill="#ffffff" />
                  <circle cx="105" cy="138" r="4.5" fill="#1e293b" />
                  <circle cx="106" cy="136" r="1.5" fill="#ffffff" />
                  <polygon points="95,144 92,141 98,141" fill="#f43f5e" />
                  <path d="M 91 146 Q 95 149 99 146" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                </>
              )}
            </g>
          )}

          {/* Chubby Paws: cover eyes if typing password */}
          {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
            <g style={{ animation: 'pawCover 0.25s ease-out forwards' }}>
              <ellipse cx="84" cy="136" rx="9" ry="8" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
              <ellipse cx="106" cy="136" rx="9" ry="8" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            </g>
          ) : (
            <g>
              <ellipse cx="80" cy="225" rx="10" ry="7" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
              <ellipse cx="110" cy="225" rx="10" ry="7" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            </g>
          )}
        </g>


        {/* ========================================================= */}
        {/* CAT 2: THE SNEAKY PEEKING GINGER CAT (Center-Left)       */}
        {/* ========================================================= */}
        <g id="sneaky-peeking-cat">
          {/* Animated Tail */}
          <path
            d="M 210 200 C 185 220 180 180 170 160 C 176 150 186 160 182 170 C 188 185 198 195 215 190 Z"
            fill="#f97316"
            style={{
              transformOrigin: '210px 200px',
              animation: loginState === 'correct' ? 'wagFast 0.4s infinite alternate ease-in-out' : 'wag2 1.8s infinite alternate ease-in-out'
            }}
          />

          {/* Body */}
          <ellipse cx="230" cy="180" rx="42" ry="36" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <ellipse cx="230" cy="183" rx="26" ry="24" fill="#ffedd5" />

          {/* Head */}
          <circle cx="230" cy="125" r="32" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          {/* Ears */}
          <polygon points="206,108 196,78 222,96" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <polygon points="207,105 201,84 218,97" fill="#fda4af" />
          <polygon points="254,108 264,78 238,96" fill="#ea580c" stroke="#9a3412" strokeWidth="2" />
          <polygon points="253,105 259,84 242,97" fill="#fda4af" />

          {/* Whiskers */}
          <line x1="198" y1="128" x2="182" y2="124" stroke="#7c2d12" strokeWidth="2" />
          <line x1="198" y1="133" x2="180" y2="134" stroke="#7c2d12" strokeWidth="2" />
          <line x1="262" y1="128" x2="278" y2="124" stroke="#7c2d12" strokeWidth="2" />
          <line x1="262" y1="133" x2="280" y2="134" stroke="#7c2d12" strokeWidth="2" />

          {/* Nose and mouth */}
          <polygon points="230,132 227,129 233,129" fill="#f43f5e" />
          <path d="M 226 134 Q 230 137 234 134" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />

          {/* SNEAKY PEEKING ACTION WHEN PASSWORD TYPING */}
          {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
            <g>
              {/* Right eye covers completely */}
              <ellipse cx="243" cy="122" rx="9" ry="8" fill="#ffedd5" stroke="#9a3412" strokeWidth="2" />

              {/* Left paw is partially open with a gap to secretly peek through! */}
              <ellipse cx="217" cy="122" rx="8" ry="7" fill="#ffedd5" stroke="#9a3412" strokeWidth="2" />
              {/* ONE EYE SECRETLY PEEKING OUT THROUGH THE PAWS! */}
              <g style={{ animation: 'peekEye 1s infinite alternate' }}>
                <ellipse cx="218" cy="121" rx="5" ry="5.5" fill="#0f172a" />
                <circle cx="219.5" cy="119.5" r="1.8" fill="#ffffff" />
                <circle cx="216.5" cy="122" r="0.8" fill="#ffffff" />
              </g>
              {/* Little mischievous smirk */}
              <path d="M 230 134 Q 234 139 237 135" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : loginState === 'wrong' ? (
            // Sad ginger face
            <g>
              <ellipse cx="218" cy="122" rx="4" ry="5" fill="#1e293b" />
              <ellipse cx="242" cy="122" rx="4" ry="5" fill="#1e293b" />
              <path d="M 225 137 Q 230 132 235 137" fill="none" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
              <circle cx="215" cy="130" r="2.5" fill="#38bdf8" />
            </g>
          ) : loginState === 'correct' ? (
            // Big happy celebration face
            <g>
              <path d="M 213 122 Q 219 114 225 122" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
              <path d="M 235 122 Q 241 114 247 122" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
              <path d="M 225 134 Q 230 144 235 134" fill="#f43f5e" />
            </g>
          ) : (
            // Normal ginger face
            <g>
              <ellipse cx="218" cy="122" rx="4.5" ry="5" fill="#1e293b" />
              <circle cx="220" cy="120" r="1.5" fill="#ffffff" />
              <ellipse cx="242" cy="122" rx="4.5" ry="5" fill="#1e293b" />
              <circle cx="244" cy="120" r="1.5" fill="#ffffff" />
            </g>
          )}

          {/* Normal Paws sitting when not covering */}
          {(!isTypingPassword || loginState === 'correct' || loginState === 'wrong') && (
            <g>
              <ellipse cx="215" cy="214" rx="8" ry="6" fill="#ffedd5" stroke="#9a3412" strokeWidth="2" />
              <ellipse cx="245" cy="214" rx="8" ry="6" fill="#ffedd5" stroke="#9a3412" strokeWidth="2" />
            </g>
          )}
        </g>


        {/* ========================================================= */}
        {/* CAT 3: FAT WHITE & GREY CHUBBY CAT (Center-Right)        */}
        {/* ========================================================= */}
        <g id="fat-grey-cat">
          {/* Animated Tail */}
          <path
            d="M 390 205 C 420 225 435 185 420 160 C 412 150 405 160 410 172 C 418 190 400 200 385 195 Z"
            fill="#64748b"
            style={{
              transformOrigin: '390px 205px',
              animation: loginState === 'correct' ? 'wagFast 0.45s infinite alternate ease-in-out' : 'wag1 2.5s infinite alternate ease-in-out'
            }}
          />

          {/* Huge Fat Body */}
          <ellipse cx="345" cy="190" rx="52" ry="44" fill="#f1f5f9" stroke="#475569" strokeWidth="2.5" />
          {/* Grey tabby patches */}
          <path d="M 350 150 Q 380 155 390 180 Q 370 200 350 150 Z" fill="#94a3b8" />

          {/* Head */}
          <circle cx="345" cy="132" r="32" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
          {/* Ears */}
          <polygon points="322,114 310,85 336,102" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
          <polygon points="368,114 380,85 354,102" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />

          {/* Nose and Mouth */}
          <polygon points="345,138 342,135 348,135" fill="#f43f5e" />
          <path d="M 341 140 Q 345 143 349 140" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

          {/* State Faces */}
          {loginState === 'correct' ? (
            <g>
              <path d="M 328 128 Q 335 120 342 128" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
              <path d="M 348 128 Q 355 120 362 128" fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
              <path d="M 340 142 Q 345 150 350 142" fill="#f43f5e" />
            </g>
          ) : loginState === 'wrong' ? (
            <g>
              <ellipse cx="335" cy="128" rx="4" ry="5" fill="#0f172a" />
              <ellipse cx="355" cy="128" rx="4" ry="5" fill="#0f172a" />
              <path d="M 340 144 Q 345 139 350 144" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <circle cx="358" cy="138" r="2.5" fill="#38bdf8" />
            </g>
          ) : (
            <g>
              {!isTypingPassword && (
                <>
                  <ellipse cx="335" cy="128" rx="4" ry="5" fill="#0f172a" />
                  <circle cx="336.5" cy="126" r="1.5" fill="#ffffff" />
                  <ellipse cx="355" cy="128" rx="4" ry="5" fill="#0f172a" />
                  <circle cx="356.5" cy="126" r="1.5" fill="#ffffff" />
                </>
              )}
            </g>
          )}

          {/* Paws covering eyes completely */}
          {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
            <g style={{ animation: 'pawCover 0.25s ease-out forwards' }}>
              <ellipse cx="333" cy="128" rx="9" ry="8" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
              <ellipse cx="357" cy="128" rx="9" ry="8" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
            </g>
          ) : (
            <g>
              <ellipse cx="330" cy="225" rx="9" ry="7" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
              <ellipse cx="360" cy="225" rx="9" ry="7" fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
            </g>
          )}
        </g>


        {/* ========================================================= */}
        {/* CAT 4: SLEEK BLACK KITTY (Rightmost)                     */}
        {/* ========================================================= */}
        <g id="black-cat">
          {/* Animated Tail */}
          <path
            d="M 470 210 C 510 220 520 170 500 150 C 494 142 485 152 490 162 C 500 180 480 195 465 195 Z"
            fill="#1e293b"
            style={{
              transformOrigin: '470px 210px',
              animation: loginState === 'correct' ? 'wagFast 0.5s infinite alternate ease-in-out' : 'wag2 2s infinite alternate ease-in-out'
            }}
          />

          {/* Body */}
          <ellipse cx="445" cy="190" rx="36" ry="32" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

          {/* Head */}
          <circle cx="445" cy="138" r="28" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          {/* Ears */}
          <polygon points="426,122 416,96 438,112" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <polygon points="464,122 474,96 452,112" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />

          {/* Yellow eyes glow */}
          {loginState === 'correct' ? (
            <g>
              <path d="M 432 135 Q 437 127 442 135" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
              <path d="M 448 135 Q 453 127 458 135" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : loginState === 'wrong' ? (
            <g>
              <ellipse cx="437" cy="135" rx="4" ry="5" fill="#facc15" />
              <ellipse cx="453" cy="135" rx="4" ry="5" fill="#facc15" />
              <circle cx="433" cy="144" r="2" fill="#38bdf8" />
            </g>
          ) : (
            <g>
              {!isTypingPassword && (
                <>
                  <ellipse cx="437" cy="135" rx="4.5" ry="5.5" fill="#facc15" />
                  <ellipse cx="437" cy="135" rx="1.5" ry="4" fill="#0f172a" />
                  <ellipse cx="453" cy="135" rx="4.5" ry="5.5" fill="#facc15" />
                  <ellipse cx="453" cy="135" rx="1.5" ry="4" fill="#0f172a" />
                </>
              )}
            </g>
          )}

          {/* Nose and mouth */}
          <polygon points="445,142 443,140 447,140" fill="#f43f5e" />

          {/* Black paws covering eyes */}
          {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
            <g style={{ animation: 'pawCover 0.25s ease-out forwards' }}>
              <ellipse cx="435" cy="135" rx="8" ry="7" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <ellipse cx="455" cy="135" rx="8" ry="7" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            </g>
          ) : (
            <g>
              <ellipse cx="433" cy="218" rx="7" ry="5" fill="#334155" stroke="#0f172a" strokeWidth="2" />
              <ellipse cx="457" cy="218" rx="7" ry="5" fill="#334155" stroke="#0f172a" strokeWidth="2" />
            </g>
          )}
        </g>
      </svg>

      {/* Embedded CSS for Tail animations & Paw covers */}
      <style>{`
        @keyframes wag1 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(18deg); }
        }
        @keyframes wag2 {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-22deg); }
        }
        @keyframes wagFast {
          0% { transform: rotate(-15deg); }
          100% { transform: rotate(25deg); }
        }
        @keyframes peekEye {
          0% { transform: scale(0.9) translate(-1px, 0); }
          100% { transform: scale(1.1) translate(1px, 0); }
        }
        @keyframes pawCover {
          0% { transform: translateY(12px); opacity: 0.6; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
