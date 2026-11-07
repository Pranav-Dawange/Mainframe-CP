import React, { useEffect, useState } from 'react';

/**
 * Photorealistic Realistic Cats Guard (Pack of 6 Distinct Cats with Complete Anatomy)
 * 
 * Anatomy:
 * - Full visible front legs (forelimbs) extending down to front paws with carpals & digit pads.
 * - Flank/haunch hindquarters and hind paws visible on seated posture.
 * - Dynamic jumping celebration physics on success (jumping up & down with joyous tail wagging).
 * - Sneaky Peeking Cat (Ginger Tabby):
 *     * Firmly covers its LEFT eye with its left paw.
 *     * Drops and separates its RIGHT paw (facing the login form on the right!)
 *     * Opens its RIGHT eye wide with a dilated, curious pupil staring directly toward the right-hand login form!
 */
export const RealisticCatGuard = ({
  isTypingPassword = false,
  loginState = 'normal' // 'normal', 'wrong', 'correct'
}) => {
  const [blink, setBlink] = useState(false);
  const [peekTwitch, setPeekTwitch] = useState(false);

  // Natural spontaneous blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Subtle curious ear/paw micro-twitch on the peeking ginger cat
  useEffect(() => {
    if (isTypingPassword) {
      const twitchInterval = setInterval(() => {
        setPeekTwitch(prev => !prev);
      }, 1400);
      return () => clearInterval(twitchInterval);
    }
  }, [isTypingPassword]);

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none py-2">
      {/* Status Bar */}
      <div className="mb-2 px-4 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-center gap-2 text-xs font-medium text-slate-200">
        <span className={`w-2 h-2 rounded-full ${
          loginState === 'correct' ? 'bg-emerald-400 animate-ping' :
          loginState === 'wrong' ? 'bg-rose-500 animate-pulse' :
          isTypingPassword ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />
        {loginState === 'wrong' ? (
          <span className="text-rose-300 font-bold">Verification Failed &bull; Cats are Sad (Plaintive Whimper)</span>
        ) : loginState === 'correct' ? (
          <span className="text-emerald-300 font-bold animate-bounce">🎉 SUCCESS! Cats are Jumping &amp; Celebrating Joyfully!</span>
        ) : isTypingPassword ? (
          <span className="text-amber-300 font-bold">Password Mode &bull; Ginger Cat Opened Right Eye Looking at Login Form!</span>
        ) : (
          <span>LifeVault Sentinel Squad &bull; 6 Realistic Felines</span>
        )}
      </div>

      {/* SVG Canvas Rendering 6 Realistic Cats with Full Legs */}
      <svg 
        viewBox="0 0 960 450" 
        className="w-full h-auto drop-shadow-2xl overflow-visible"
        style={{ filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.45))' }}
      >
        <defs>
          {/* Fur Texture Filter */}
          <filter id="fineFur6" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.14 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="textured" />
            <feBlend mode="multiply" in="textured" in2="SourceGraphic" />
          </filter>

          {/* Eye Iris Gradients */}
          <radialGradient id="greenIris6" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="65%" stopColor="#059669" />
            <stop offset="90%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#022c22" />
          </radialGradient>

          <radialGradient id="amberIris6" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          <radialGradient id="blueIris6" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="65%" stopColor="#0284c7" />
            <stop offset="90%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </radialGradient>

          <radialGradient id="copperIris6" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="65%" stopColor="#ea580c" />
            <stop offset="90%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#431407" />
          </radialGradient>

          {/* Fur Body Gradients */}
          <linearGradient id="calicoFur6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f1f5f9" />
            <stop offset="80%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="britishBlueFur6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="85%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="gingerFur6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdba74" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="75%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#9a3412" />
          </linearGradient>

          <linearGradient id="creamPointFur6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="80%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          <linearGradient id="tuxedoBlackFur6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="40%" stopColor="#1e293b" />
            <stop offset="80%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="brownTabbyFur6" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="45%" stopColor="#b45309" />
            <stop offset="80%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>

          <radialGradient id="floorShadow6" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#020617" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic Floor Shadow that contracts when cats jump */}
        <ellipse 
          cx="480" 
          cy="418" 
          rx={loginState === 'correct' ? 420 : 460} 
          ry={loginState === 'correct' ? 18 : 26} 
          fill="url(#floorShadow6)" 
          style={{
            animation: loginState === 'correct' ? 'shadowBounce 0.6s infinite alternate ease-in-out' : 'none'
          }}
        />

        {/* CONTAINER WITH JUMPING CELEBRATION WHEN SUCCESSFUL */}
        <g 
          id="all-cats-group"
          style={{
            transformOrigin: '480px 380px',
            animation: loginState === 'correct' ? 'celebrationJump 0.6s infinite alternate ease-in-out' : 'none'
          }}
        >

          {/* ========================================================================= */}
          {/* 1. CAT 1 (FAR LEFT): CHONKY CALICO CAT (With visible legs & paws)         */}
          {/* ========================================================================= */}
          <g id="cat1-calico" style={{ transformOrigin: '115px 380px', animation: loginState === 'correct' ? 'individualJump1 0.6s infinite alternate ease-in-out' : 'none' }}>
            {/* Animated Tail */}
            <path
              d="M 65 340 C 20 350 5 300 18 260 C 26 242 45 252 40 270 C 30 298 55 318 70 325 Z"
              fill="#ea580c"
              style={{
                transformOrigin: '65px 340px',
                animation: loginState === 'correct' ? 'wagFast 0.4s infinite alternate ease-in-out' : 'wag1 3.5s infinite alternate ease-in-out'
              }}
            />
            {/* Hind Legs & Haunches (Thighs) */}
            <path d="M 50 310 C 35 340 50 395 80 400 C 95 400 95 370 85 340 Z" fill="#cbd5e1" />
            <path d="M 175 310 C 190 340 175 395 145 400 C 130 400 130 370 140 340 Z" fill="#cbd5e1" />

            {/* Fat Torso */}
            <path d="M 50 260 C 40 310 60 385 140 385 C 190 385 195 310 170 260 C 150 215 70 215 50 260 Z" fill="url(#calicoFur6)" filter="url(#fineFur6)" />
            {/* Calico Patches */}
            <path d="M 60 270 Q 90 250 105 280 Q 80 330 60 300 Z" fill="#b45309" opacity="0.9" />
            <path d="M 140 280 Q 180 270 185 310 Q 150 350 140 310 Z" fill="#1e293b" opacity="0.95" />

            {/* Head */}
            <ellipse cx="115" cy="200" rx="46" ry="40" fill="url(#calicoFur6)" filter="url(#fineFur6)" />
            {/* Ears */}
            <polygon points="80,170 68,135 98,155" fill="#b45309" />
            <polygon points="83,166 74,142 94,156" fill="#fda4af" opacity="0.75" />
            <polygon points="132,155 162,135 150,170" fill="#1e293b" />
            <polygon points="136,156 156,142 147,166" fill="#fda4af" opacity="0.75" />

            {/* Eyes (Green) */}
            <ellipse cx="98" cy="195" rx="9" ry="7" fill="#ffffff" />
            <circle cx="98" cy="195" r="6.5" fill="url(#greenIris6)" />
            <ellipse cx="98" cy="195" rx={blink || loginState === 'wrong' ? 6.5 : 2.2} ry={blink ? 0.8 : 6} fill="#064e3b" />
            <circle cx="96" cy="193" r="1.5" fill="#ffffff" />

            <ellipse cx="132" cy="195" rx="9" ry="7" fill="#ffffff" />
            <circle cx="132" cy="195" r="6.5" fill="url(#greenIris6)" />
            <ellipse cx="132" cy="195" rx={blink || loginState === 'wrong' ? 6.5 : 2.2} ry={blink ? 0.8 : 6} fill="#064e3b" />
            <circle cx="130" cy="193" r="1.5" fill="#ffffff" />

            {/* Nose & Whiskers */}
            <polygon points="115,210 110,205 120,205" fill="#fda4af" />
            <g stroke="#ffffff" strokeWidth="1" opacity="0.8" strokeLinecap="round">
              <line x1="102" y1="210" x2="65" y2="205" />
              <line x1="102" y1="213" x2="62" y2="216" />
              <line x1="128" y1="210" x2="165" y2="205" />
              <line x1="128" y1="213" x2="168" y2="216" />
            </g>

            {/* FULL VISIBLE FRONT LEGS WITH CARPALS & PAW PADS */}
            {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
              // Raised Leg Action Covering Eyes
              <g style={{ animation: 'pawCoverReal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <path d="M 85 340 Q 65 260 96 195" stroke="#f1f5f9" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="96" cy="195" rx="13" ry="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                <circle cx="91" cy="194" r="2.8" fill="#cbd5e1" />
                <circle cx="96" cy="191" r="2.8" fill="#cbd5e1" />
                <circle cx="101" cy="194" r="2.8" fill="#cbd5e1" />

                <path d="M 145 340 Q 165 260 134 195" stroke="#f1f5f9" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="134" cy="195" rx="13" ry="11" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
                <circle cx="129" cy="194" r="2.8" fill="#cbd5e1" />
                <circle cx="134" cy="191" r="2.8" fill="#cbd5e1" />
                <circle cx="139" cy="194" r="2.8" fill="#cbd5e1" />
              </g>
            ) : (
              // Full Length Front Standing/Resting Legs
              <g>
                <path d="M 98 280 L 98 395" stroke="#f8fafc" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="98" cy="402" rx="15" ry="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="92" cy="402" r="2.8" fill="#cbd5e1" />
                <circle cx="98" cy="400" r="2.8" fill="#cbd5e1" />
                <circle cx="104" cy="402" r="2.8" fill="#cbd5e1" />

                <path d="M 132 280 L 132 395" stroke="#f8fafc" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="132" cy="402" rx="15" ry="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="126" cy="402" r="2.8" fill="#cbd5e1" />
                <circle cx="132" cy="400" r="2.8" fill="#cbd5e1" />
                <circle cx="138" cy="402" r="2.8" fill="#cbd5e1" />
              </g>
            )}
          </g>


          {/* ========================================================================= */}
          {/* 2. CAT 2 (FRONT-LEFT): CHONKY BRITISH SHORTHAIR (With visible legs)       */}
          {/* ========================================================================= */}
          <g id="cat2-british-blue" style={{ transformOrigin: '250px 380px', animation: loginState === 'correct' ? 'individualJump2 0.6s infinite alternate ease-in-out' : 'none' }}>
            {/* Tail */}
            <path
              d="M 215 350 C 180 370 160 320 170 280 C 176 265 192 272 188 288 C 180 310 200 335 220 338 Z"
              fill="#475569"
              style={{
                transformOrigin: '215px 350px',
                animation: loginState === 'correct' ? 'wagFast 0.45s infinite alternate ease-in-out' : 'wag2 2.8s infinite alternate ease-in-out'
              }}
            />
            {/* Hind Quarters */}
            <ellipse cx="205" cy="355" rx="28" ry="36" fill="#475569" />
            <ellipse cx="295" cy="355" rx="28" ry="36" fill="#475569" />

            {/* Fat Torso */}
            <ellipse cx="250" cy="315" rx="60" ry="52" fill="url(#britishBlueFur6)" filter="url(#fineFur6)" />
            {/* Big Round Head */}
            <circle cx="250" cy="225" r="48" fill="url(#britishBlueFur6)" filter="url(#fineFur6)" />
            {/* Ears */}
            <path d="M 215 190 C 205 160 225 150 238 180 Z" fill="#475569" />
            <path d="M 219 186 C 212 166 226 160 233 180 Z" fill="#fda4af" opacity="0.75" />
            <path d="M 262 180 C 275 150 295 160 285 190 Z" fill="#475569" />
            <path d="M 267 180 C 274 160 288 166 281 186 Z" fill="#fda4af" opacity="0.75" />

            {/* Eyes (Copper) */}
            <ellipse cx="232" cy="220" rx="10" ry="8.5" fill="#ffffff" />
            <circle cx="232" cy="220" r="7.5" fill="url(#copperIris6)" />
            <ellipse cx="232" cy="220" rx={blink || loginState === 'wrong' ? 7.5 : 2.5} ry={blink ? 0.8 : 7} fill="#431407" />
            <circle cx="230" cy="218" r="1.8" fill="#ffffff" />

            <ellipse cx="268" cy="220" rx="10" ry="8.5" fill="#ffffff" />
            <circle cx="268" cy="220" r="7.5" fill="url(#copperIris6)" />
            <ellipse cx="268" cy="220" rx={blink || loginState === 'wrong' ? 7.5 : 2.5} ry={blink ? 0.8 : 7} fill="#431407" />
            <circle cx="266" cy="218" r="1.8" fill="#ffffff" />

            {/* Nose & Whiskers */}
            <polygon points="250,235 244,230 256,230" fill="#fda4af" />
            <g stroke="#ffffff" strokeWidth="1.1" opacity="0.85" strokeLinecap="round">
              <line x1="238" y1="234" x2="195" y2="228" />
              <line x1="237" y1="237" x2="192" y2="240" />
              <line x1="262" y1="234" x2="305" y2="228" />
              <line x1="263" y1="237" x2="308" y2="240" />
            </g>

            {/* FULL FRONT LEGS */}
            {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
              <g style={{ animation: 'pawCoverReal 0.42s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <path d="M 215 350 Q 195 280 230 220" stroke="#64748b" strokeWidth="24" strokeLinecap="round" />
                <ellipse cx="230" cy="220" rx="14" ry="12" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                <circle cx="224" cy="218" r="3" fill="#475569" />
                <circle cx="230" cy="214" r="3" fill="#475569" />
                <circle cx="236" cy="218" r="3" fill="#475569" />

                <path d="M 285 350 Q 305 280 270 220" stroke="#64748b" strokeWidth="24" strokeLinecap="round" />
                <ellipse cx="270" cy="220" rx="14" ry="12" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
                <circle cx="264" cy="218" r="3" fill="#475569" />
                <circle cx="270" cy="214" r="3" fill="#475569" />
                <circle cx="276" cy="218" r="3" fill="#475569" />
              </g>
            ) : (
              <g>
                <path d="M 228 290 L 228 395" stroke="#64748b" strokeWidth="24" strokeLinecap="round" />
                <ellipse cx="228" cy="404" rx="16" ry="10" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
                <circle cx="222" cy="404" r="3" fill="#475569" />
                <circle cx="228" cy="402" r="3" fill="#475569" />
                <circle cx="234" cy="404" r="3" fill="#475569" />

                <path d="M 272 290 L 272 395" stroke="#64748b" strokeWidth="24" strokeLinecap="round" />
                <ellipse cx="272" cy="404" rx="16" ry="10" fill="#94a3b8" stroke="#475569" strokeWidth="1.2" />
                <circle cx="266" cy="404" r="3" fill="#475569" />
                <circle cx="272" cy="402" r="3" fill="#475569" />
                <circle cx="278" cy="404" r="3" fill="#475569" />
              </g>
            )}
          </g>


          {/* ========================================================================= */}
          {/* 3. CAT 3 (CENTER): SNEAKY PEEKING GINGER TABBY                            */}
          {/*    * LEFT EYE FIRMLY COVERED WITH LEFT PAW                                */}
          {/*    * RIGHT EYE WIDE OPEN LOOKING TO THE RIGHT AT THE LOGIN FORM!          */}
          {/*    * RIGHT PAW DELIBERATELY LOWERED/SEPARATED WITH A CLEAR GAP            */}
          {/* ========================================================================= */}
          <g id="cat3-ginger-peeking" style={{ transformOrigin: '480px 380px', animation: loginState === 'correct' ? 'individualJump3 0.6s infinite alternate ease-in-out' : 'none' }}>
            {/* Tail */}
            <path
              d="M 440 330 C 410 360 380 300 395 270 C 402 255 418 265 412 280 C 402 305 425 325 450 322 Z"
              fill="#c2410c"
              style={{
                transformOrigin: '440px 330px',
                animation: loginState === 'correct' ? 'wagFast 0.4s infinite alternate ease-in-out' : 'wag1 2.4s infinite alternate ease-in-out'
              }}
            />
            {/* Hind Legs & Haunches */}
            <ellipse cx="435" cy="350" rx="26" ry="34" fill="#c2410c" />
            <ellipse cx="525" cy="350" rx="26" ry="34" fill="#c2410c" />

            {/* Torso */}
            <path d="M 420 250 C 400 300 425 385 500 385 C 555 385 565 315 540 250 C 520 200 445 200 420 250 Z" fill="url(#gingerFur6)" filter="url(#fineFur6)" />
            <path d="M 450 240 Q 480 260 510 240" stroke="#9a3412" strokeWidth="4.5" fill="none" opacity="0.8" />
            <path d="M 445 270 Q 480 290 515 270" stroke="#9a3412" strokeWidth="4.5" fill="none" opacity="0.8" />
            <path d="M 450 300 Q 480 320 510 300" stroke="#9a3412" strokeWidth="4" fill="none" opacity="0.8" />

            {/* Head */}
            <ellipse cx="480" cy="190" rx="50" ry="44" fill="url(#gingerFur6)" filter="url(#fineFur6)" />
            {/* Forehead M Tabby mark */}
            <path d="M 468 160 L 474 172 L 480 162 L 486 172 L 492 160" fill="none" stroke="#9a3412" strokeWidth="2.8" strokeLinecap="round" />

            {/* Ears with micro-twitch */}
            <g style={{
              transformOrigin: '445px 145px',
              transform: peekTwitch ? 'rotate(-3deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              <path d="M 445 155 C 430 115 452 105 472 140 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="1.2" />
              <path d="M 450 150 C 440 125 455 118 465 142 Z" fill="#fda4af" opacity="0.8" />
            </g>
            <path d="M 488 140 C 508 105 530 115 515 155 Z" fill="#ea580c" stroke="#9a3412" strokeWidth="1.2" />
            <path d="M 495 142 C 505 118 520 125 510 150 Z" fill="#fda4af" opacity="0.8" />

            {/* EYES: LEFT EYE COVERED, RIGHT EYE WIDE OPEN STARING AT LOGIN FORM (RIGHT)! */}
            <g id="ginger-eyes-peeking-right">
              {/* Left Eye */}
              <ellipse cx="460" cy="188" rx="10.5" ry="8" fill="#ffffff" />
              <circle cx="460" cy="188" r="7.5" fill="url(#amberIris6)" />
              <ellipse cx="460" cy="188" rx={2.2} ry={blink ? 0.8 : 6.8} fill="#451a03" />

              {/* RIGHT EYE: DILATED CURIOUS PUPIL LOOKING DIRECTLY RIGHT TOWARDS LOGIN FORM! */}
              <ellipse cx="500" cy="188" rx="11" ry="8.5" fill="#ffffff" />
              <circle cx="500" cy="188" r="8" fill="url(#amberIris6)" />
              {/* Pupil shifted rightward and dilated in mischievous curiosity */}
              <ellipse cx={isTypingPassword ? 503 : 500} cy="188" rx={isTypingPassword ? 4.4 : 2.2} ry={blink ? 0.8 : 7.2} fill="#451a03" />
              <circle cx={isTypingPassword ? 505 : 498} cy="186" r="2" fill="#ffffff" />
            </g>

            {/* Nose & Whiskers */}
            <polygon points="480,202 474,196 486,196" fill="#fda4af" />
            <g stroke="#ffffff" strokeWidth="1.1" opacity="0.9" strokeLinecap="round">
              <line x1="468" y1="202" x2="425" y2="195" />
              <line x1="467" y1="205" x2="422" y2="208" />
              <line x1="492" y1="202" x2="535" y2="195" />
              <line x1="493" y1="205" x2="538" y2="208" />
            </g>

            {/* ========================================================================= */}
            {/* FULL LEGS & PAW MOVEMENT:                                                 */}
            {/* LEFT PAW FIRMLY COVERS LEFT EYE.                                          */}
            {/* RIGHT PAW SEPARATES AND LOWERS, EXPOSING RIGHT EYE DIRECTED AT LOGIN FORM!*/}
            {/* ========================================================================= */}
            {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
              <g>
                {/* Left Leg & Paw FIRMLY COVERING Left Eye */}
                <path d="M 450 330 Q 430 250 458 188" stroke="#ea580c" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="458" cy="188" rx="13" ry="11" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
                <circle cx="453" cy="186" r="2.8" fill="#ea580c" />
                <circle cx="458" cy="182" r="2.8" fill="#ea580c" />
                <circle cx="463" cy="186" r="2.8" fill="#ea580c" />

                {/* Right Leg & Paw: DROPPED & SEPARATED WITH A VISIBLE GAP LOOKING AT LOGIN FORM! */}
                <g style={{
                  transformOrigin: '510px 330px',
                  transform: peekTwitch ? 'translate(8px, 16px) rotate(6deg)' : 'translate(4px, 12px) rotate(2deg)',
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}>
                  <path d="M 510 330 Q 535 260 502 208" stroke="#ea580c" strokeWidth="22" strokeLinecap="round" />
                  {/* Paw clearly separated below the eye, leaving RIGHT EYE completely unobstructed */}
                  <ellipse cx="502" cy="208" rx="13" ry="11" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
                  <circle cx="496" cy="206" r="2.8" fill="#ea580c" />
                  <circle cx="502" cy="202" r="2.8" fill="#ea580c" />
                  <circle cx="508" cy="206" r="2.8" fill="#ea580c" />
                </g>
              </g>
            ) : (
              // Standing Front Legs
              <g>
                <path d="M 458 290 L 458 395" stroke="#ea580c" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="458" cy="402" rx="15" ry="9" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />
                <circle cx="452" cy="402" r="2.8" fill="#c2410c" />
                <circle cx="458" cy="400" r="2.8" fill="#c2410c" />
                <circle cx="464" cy="402" r="2.8" fill="#c2410c" />

                <path d="M 502 290 L 502 395" stroke="#ea580c" strokeWidth="22" strokeLinecap="round" />
                <ellipse cx="502" cy="402" rx="15" ry="9" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.2" />
                <circle cx="496" cy="402" r="2.8" fill="#c2410c" />
                <circle cx="502" cy="400" r="2.8" fill="#c2410c" />
                <circle cx="508" cy="402" r="2.8" fill="#c2410c" />
              </g>
            )}
          </g>


          {/* ========================================================================= */}
          {/* 4. CAT 4 (CENTER-RIGHT): CREAM SIAMESE / COLORPOINT (With full legs)     */}
          {/* ========================================================================= */}
          <g id="cat4-siamese" style={{ transformOrigin: '630px 380px', animation: loginState === 'correct' ? 'individualJump1 0.6s infinite alternate ease-in-out' : 'none' }}>
            {/* Tail */}
            <path
              d="M 640 330 C 670 355 690 310 680 270 C 672 255 658 265 664 280 C 672 305 650 325 630 322 Z"
              fill="#78350f"
              style={{
                transformOrigin: '640px 330px',
                animation: loginState === 'correct' ? 'wagFast 0.5s infinite alternate ease-in-out' : 'wag2 3.1s infinite alternate ease-in-out'
              }}
            />
            {/* Hind quarters */}
            <ellipse cx="590" cy="350" rx="24" ry="32" fill="#d97706" opacity="0.6" />
            <ellipse cx="670" cy="350" rx="24" ry="32" fill="#d97706" opacity="0.6" />

            {/* Torso */}
            <path d="M 580 260 C 565 305 580 385 645 385 C 695 385 710 320 685 260 C 665 210 600 210 580 260 Z" fill="url(#creamPointFur6)" filter="url(#fineFur6)" />
            {/* Head */}
            <ellipse cx="630" cy="195" rx="46" ry="42" fill="url(#creamPointFur6)" filter="url(#fineFur6)" />
            <ellipse cx="630" cy="200" rx="34" ry="28" fill="#78350f" opacity="0.9" />

            {/* Pointed Ears */}
            <polygon points="600,165 585,125 615,148" fill="#451a03" />
            <polygon points="603,162 592,132 612,150" fill="#fda4af" opacity="0.65" />
            <polygon points="645,148 675,125 660,165" fill="#451a03" />
            <polygon points="648,150 668,132 657,162" fill="#fda4af" opacity="0.65" />

            {/* Blue Siamese Eyes */}
            <ellipse cx="615" cy="192" rx="9" ry="7.5" fill="#ffffff" />
            <circle cx="615" cy="192" r="6.8" fill="url(#blueIris6)" />
            <ellipse cx="615" cy="192" rx={blink || loginState === 'wrong' ? 6.8 : 2.2} ry={blink ? 0.8 : 6} fill="#0c4a6e" />
            <circle cx="613" cy="190" r="1.6" fill="#ffffff" />

            <ellipse cx="645" cy="192" rx="9" ry="7.5" fill="#ffffff" />
            <circle cx="645" cy="192" r="6.8" fill="url(#blueIris6)" />
            <ellipse cx="645" cy="192" rx={blink || loginState === 'wrong' ? 6.8 : 2.2} ry={blink ? 0.8 : 6} fill="#0c4a6e" />
            <circle cx="643" cy="190" r="1.6" fill="#ffffff" />

            {/* Nose & Whiskers */}
            <polygon points="630,205 625,200 635,200" fill="#fda4af" />
            <g stroke="#ffffff" strokeWidth="1" opacity="0.9" strokeLinecap="round">
              <line x1="618" y1="205" x2="580" y2="200" />
              <line x1="618" y1="208" x2="578" y2="212" />
              <line x1="642" y1="205" x2="680" y2="200" />
              <line x1="642" y1="208" x2="682" y2="212" />
            </g>

            {/* FULL LEGS */}
            {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
              <g style={{ animation: 'pawCoverReal 0.44s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <path d="M 605 320 Q 590 250 613 192" stroke="#78350f" strokeWidth="18" strokeLinecap="round" />
                <ellipse cx="613" cy="192" rx="11" ry="9.5" fill="#451a03" stroke="#290e03" strokeWidth="1.2" />
                <circle cx="609" cy="190" r="2.2" fill="#290e03" />
                <circle cx="613" cy="187" r="2.2" fill="#290e03" />
                <circle cx="617" cy="190" r="2.2" fill="#290e03" />

                <path d="M 655 320 Q 670 250 647 192" stroke="#78350f" strokeWidth="18" strokeLinecap="round" />
                <ellipse cx="647" cy="192" rx="11" ry="9.5" fill="#451a03" stroke="#290e03" strokeWidth="1.2" />
                <circle cx="643" cy="190" r="2.2" fill="#290e03" />
                <circle cx="647" cy="187" r="2.2" fill="#290e03" />
                <circle cx="651" cy="190" r="2.2" fill="#290e03" />
              </g>
            ) : (
              <g>
                <path d="M 614 280 L 614 395" stroke="#78350f" strokeWidth="18" strokeLinecap="round" />
                <ellipse cx="614" cy="402" rx="13" ry="8" fill="#451a03" />
                <circle cx="609" cy="402" r="2.4" fill="#290e03" />
                <circle cx="614" cy="400" r="2.4" fill="#290e03" />
                <circle cx="619" cy="402" r="2.4" fill="#290e03" />

                <path d="M 646 280 L 646 395" stroke="#78350f" strokeWidth="18" strokeLinecap="round" />
                <ellipse cx="646" cy="402" rx="13" ry="8" fill="#451a03" />
                <circle cx="641" cy="402" r="2.4" fill="#290e03" />
                <circle cx="646" cy="400" r="2.4" fill="#290e03" />
                <circle cx="651" cy="402" r="2.4" fill="#290e03" />
              </g>
            )}
          </g>


          {/* ========================================================================= */}
          {/* 5. CAT 5 (RIGHT): ELEGANT TUXEDO CAT (With full limbs)                    */}
          {/* ========================================================================= */}
          <g id="cat5-tuxedo" style={{ transformOrigin: '755px 380px', animation: loginState === 'correct' ? 'individualJump2 0.6s infinite alternate ease-in-out' : 'none' }}>
            {/* Tail */}
            <path
              d="M 760 340 C 800 360 815 310 795 270 C 787 255 770 265 776 280 C 785 305 765 325 745 322 Z"
              fill="#0f172a"
              style={{
                transformOrigin: '760px 340px',
                animation: loginState === 'correct' ? 'wagFast 0.5s infinite alternate ease-in-out' : 'wag1 2.9s infinite alternate ease-in-out'
              }}
            />
            {/* Hind Quarters */}
            <ellipse cx="715" cy="350" rx="26" ry="34" fill="#0f172a" />
            <ellipse cx="795" cy="350" rx="26" ry="34" fill="#0f172a" />

            {/* Torso */}
            <path d="M 710 260 C 690 310 710 385 780 385 C 830 385 845 320 820 260 C 800 210 730 210 710 260 Z" fill="url(#tuxedoBlackFur6)" filter="url(#fineFur6)" />
            {/* White Bib */}
            <path d="M 740 250 Q 765 300 750 330 Q 780 290 775 250 Z" fill="#ffffff" />

            {/* Head */}
            <ellipse cx="755" cy="205" rx="46" ry="40" fill="url(#tuxedoBlackFur6)" filter="url(#fineFur6)" />
            <path d="M 755 190 L 748 215 L 762 215 Z" fill="#ffffff" />

            {/* Ears */}
            <polygon points="725,175 712,140 740,160" fill="#0f172a" />
            <polygon points="728,172 718,146 738,162" fill="#fda4af" opacity="0.7" />
            <polygon points="770,160 798,140 785,175" fill="#0f172a" />
            <polygon points="772,162 792,146 782,172" fill="#fda4af" opacity="0.7" />

            {/* Green Eyes */}
            <ellipse cx="738" cy="200" rx="9" ry="7.5" fill="#ffffff" />
            <circle cx="738" cy="200" r="6.8" fill="url(#greenIris6)" />
            <ellipse cx="738" cy="200" rx={blink || loginState === 'wrong' ? 6.8 : 2.2} ry={blink ? 0.8 : 6} fill="#064e3b" />
            <circle cx="736" cy="198" r="1.5" fill="#ffffff" />

            <ellipse cx="772" cy="200" rx="9" ry="7.5" fill="#ffffff" />
            <circle cx="772" cy="200" r="6.8" fill="url(#greenIris6)" />
            <ellipse cx="772" cy="200" rx={blink || loginState === 'wrong' ? 6.8 : 2.2} ry={blink ? 0.8 : 6} fill="#064e3b" />
            <circle cx="770" cy="198" r="1.5" fill="#ffffff" />

            {/* Nose & Whiskers */}
            <polygon points="755,212 750,208 760,208" fill="#fda4af" />
            <g stroke="#ffffff" strokeWidth="1.1" opacity="0.9" strokeLinecap="round">
              <line x1="745" y1="212" x2="705" y2="208" />
              <line x1="744" y1="215" x2="702" y2="220" />
              <line x1="765" y1="212" x2="805" y2="208" />
              <line x1="766" y1="215" x2="808" y2="220" />
            </g>

            {/* FULL LEGS & WHITE MITTENS */}
            {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
              <g style={{ animation: 'pawCoverReal 0.46s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <path d="M 730 330 Q 715 255 737 200" stroke="#0f172a" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="737" cy="200" rx="12" ry="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="732" cy="198" r="2.5" fill="#cbd5e1" />
                <circle cx="737" cy="195" r="2.5" fill="#cbd5e1" />
                <circle cx="742" cy="198" r="2.5" fill="#cbd5e1" />

                <path d="M 780 330 Q 795 255 773 200" stroke="#0f172a" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="773" cy="200" rx="12" ry="10" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="768" cy="198" r="2.5" fill="#cbd5e1" />
                <circle cx="773" cy="195" r="2.5" fill="#cbd5e1" />
                <circle cx="778" cy="198" r="2.5" fill="#cbd5e1" />
              </g>
            ) : (
              <g>
                <path d="M 738 290 L 738 395" stroke="#0f172a" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="738" cy="402" rx="14" ry="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="732" cy="402" r="2.6" fill="#cbd5e1" />
                <circle cx="738" cy="400" r="2.6" fill="#cbd5e1" />
                <circle cx="744" cy="402" r="2.6" fill="#cbd5e1" />

                <path d="M 772 290 L 772 395" stroke="#0f172a" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="772" cy="402" rx="14" ry="9" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
                <circle cx="766" cy="402" r="2.6" fill="#cbd5e1" />
                <circle cx="772" cy="400" r="2.6" fill="#cbd5e1" />
                <circle cx="778" cy="402" r="2.6" fill="#cbd5e1" />
              </g>
            )}
          </g>


          {/* ========================================================================= */}
          {/* 6. CAT 6 (FAR RIGHT): GOLDEN BROWN TABBY (With full limbs)                */}
          {/* ========================================================================= */}
          <g id="cat6-brown-tabby" style={{ transformOrigin: '880px 380px', animation: loginState === 'correct' ? 'individualJump3 0.6s infinite alternate ease-in-out' : 'none' }}>
            {/* Tail */}
            <path
              d="M 885 340 C 930 350 950 290 930 255 C 922 242 905 252 912 268 C 922 295 898 318 875 322 Z"
              fill="#78350f"
              style={{
                transformOrigin: '885px 340px',
                animation: loginState === 'correct' ? 'wagFast 0.5s infinite alternate ease-in-out' : 'wag2 3.3s infinite alternate ease-in-out'
              }}
            />
            {/* Hind Quarters */}
            <ellipse cx="840" cy="350" rx="26" ry="34" fill="#78350f" />
            <ellipse cx="920" cy="350" rx="26" ry="34" fill="#78350f" />

            {/* Torso */}
            <path d="M 835 260 C 820 310 840 385 910 385 C 955 385 965 325 940 260 C 920 215 855 215 835 260 Z" fill="url(#brownTabbyFur6)" filter="url(#fineFur6)" />
            <path d="M 860 255 Q 890 270 920 255" stroke="#451a03" strokeWidth="4" fill="none" opacity="0.8" />
            <path d="M 855 285 Q 890 300 925 285" stroke="#451a03" strokeWidth="4" fill="none" opacity="0.8" />
            <path d="M 860 315 Q 890 330 920 315" stroke="#451a03" strokeWidth="3.5" fill="none" opacity="0.8" />

            {/* Head */}
            <ellipse cx="880" cy="205" rx="46" ry="40" fill="url(#brownTabbyFur6)" filter="url(#fineFur6)" />
            <path d="M 872 178 L 876 188 L 880 180 L 884 188 L 888 178" fill="none" stroke="#451a03" strokeWidth="2.5" />

            {/* Ears */}
            <polygon points="852,175 840,142 866,162" fill="#78350f" />
            <polygon points="855,172 846,148 864,164" fill="#fda4af" opacity="0.7" />
            <polygon points="894,162 920,142 908,175" fill="#78350f" />
            <polygon points="896,164 914,148 905,172" fill="#fda4af" opacity="0.7" />

            {/* Amber Eyes */}
            <ellipse cx="865" cy="202" rx="9" ry="7.5" fill="#ffffff" />
            <circle cx="865" cy="202" r="6.8" fill="url(#amberIris6)" />
            <ellipse cx="865" cy="202" rx={blink || loginState === 'wrong' ? 6.8 : 2.2} ry={blink ? 0.8 : 6} fill="#451a03" />
            <circle cx="863" cy="200" r="1.5" fill="#ffffff" />

            <ellipse cx="895" cy="202" rx="9" ry="7.5" fill="#ffffff" />
            <circle cx="895" cy="202" r="6.8" fill="url(#amberIris6)" />
            <ellipse cx="895" cy="202" rx={blink || loginState === 'wrong' ? 6.8 : 2.2} ry={blink ? 0.8 : 6} fill="#451a03" />
            <circle cx="893" cy="200" r="1.5" fill="#ffffff" />

            {/* Nose & Whiskers */}
            <polygon points="880,214 875,210 885,210" fill="#fda4af" />
            <g stroke="#ffffff" strokeWidth="1" opacity="0.85" strokeLinecap="round">
              <line x1="870" y1="214" x2="835" y2="210" />
              <line x1="869" y1="217" x2="832" y2="222" />
              <line x1="890" y1="214" x2="925" y2="210" />
              <line x1="891" y1="217" x2="928" y2="222" />
            </g>

            {/* FULL LEGS */}
            {isTypingPassword && loginState !== 'correct' && loginState !== 'wrong' ? (
              <g style={{ animation: 'pawCoverReal 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                <path d="M 855 330 Q 840 255 864 202" stroke="#78350f" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="864" cy="202" rx="12" ry="10" fill="#b45309" stroke="#451a03" strokeWidth="1.2" />
                <circle cx="859" cy="200" r="2.5" fill="#451a03" />
                <circle cx="864" cy="197" r="2.5" fill="#451a03" />
                <circle cx="869" cy="200" r="2.5" fill="#451a03" />

                <path d="M 905 330 Q 920 255 896 202" stroke="#78350f" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="896" cy="202" rx="12" ry="10" fill="#b45309" stroke="#451a03" strokeWidth="1.2" />
                <circle cx="891" cy="200" r="2.5" fill="#451a03" />
                <circle cx="896" cy="197" r="2.5" fill="#451a03" />
                <circle cx="901" cy="200" r="2.5" fill="#451a03" />
              </g>
            ) : (
              <g>
                <path d="M 865 290 L 865 395" stroke="#78350f" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="865" cy="402" rx="14" ry="9" fill="#b45309" stroke="#451a03" strokeWidth="1.2" />
                <circle cx="859" cy="402" r="2.6" fill="#451a03" />
                <circle cx="865" cy="400" r="2.6" fill="#451a03" />
                <circle cx="871" cy="402" r="2.6" fill="#451a03" />

                <path d="M 895 290 L 895 395" stroke="#78350f" strokeWidth="20" strokeLinecap="round" />
                <ellipse cx="895" cy="402" rx="14" ry="9" fill="#b45309" stroke="#451a03" strokeWidth="1.2" />
                <circle cx="889" cy="402" r="2.6" fill="#451a03" />
                <circle cx="895" cy="400" r="2.6" fill="#451a03" />
                <circle cx="901" cy="402" r="2.6" fill="#451a03" />
              </g>
            )}
          </g>

        </g>
      </svg>

      {/* Physics Keyframe Animations including Dynamic Jumping Celebration */}
      <style>{`
        @keyframes wag1 {
          0% { transform: rotate(-4deg); }
          50% { transform: rotate(14deg); }
          100% { transform: rotate(-5deg); }
        }
        @keyframes wag2 {
          0% { transform: rotate(5deg); }
          50% { transform: rotate(-16deg); }
          100% { transform: rotate(7deg); }
        }
        @keyframes wagFast {
          0% { transform: rotate(-18deg); }
          100% { transform: rotate(26deg); }
        }
        @keyframes pawCoverReal {
          0% { transform: translateY(32px) scale(0.9); opacity: 0.5; }
          65% { transform: translateY(-3px) scale(1.02); }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        /* DYNAMIC JUMPING CELEBRATION ON SUCCESS */
        @keyframes celebrationJump {
          0% { transform: translateY(0px) scale(1, 1); }
          30% { transform: translateY(-32px) scale(0.96, 1.04); }
          60% { transform: translateY(-48px) scale(0.94, 1.06); }
          85% { transform: translateY(-10px) scale(1.02, 0.98); }
          100% { transform: translateY(0px) scale(1.04, 0.96); }
        }
        @keyframes individualJump1 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-22px) rotate(-1.5deg); }
        }
        @keyframes individualJump2 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-30px) rotate(1.8deg); }
        }
        @keyframes individualJump3 {
          0% { transform: translateY(0); }
          100% { transform: translateY(-36px); }
        }
        @keyframes shadowBounce {
          0% { transform: scale(1); opacity: 0.55; }
          100% { transform: scale(0.78); opacity: 0.22; }
        }
      `}</style>
    </div>
  );
};
