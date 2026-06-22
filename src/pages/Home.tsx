import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfessorPixelArt from '../components/ProfessorPixelArt';

// ── Cute 6-frame SVG Sprite Sheet ──
// Frame width: 32px, height: 32px. Total canvas: 192x32.
// Cute professor: round face, big eyes, rosy cheeks, mini mortarboard hat, tiny smile.
const SPRITE_SHEET_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 32" width="192" height="32" shape-rendering="crispEdges">

  <!-- ═══ SHARED HELPERS (macros drawn inline per frame) ═══
       Head skin: #fde9c9   Hair: #5c3a1e   Hat: #1a1a2e  Hat band: #e8d44d
       Coat: #2d3561        Cheeks: #f4a0a0  Eyes: #1a1a1a  Highlight: #ffffff
       Legs: #1a1a2e        Shoes: #2a1a0a
  -->

  <!-- ════ FRAME 0: Walk-A (left foot forward) ════ -->
  <g transform="translate(0,0)">
    <!-- mortarboard brim -->
    <rect x="9" y="3" width="14" height="1" fill="#1a1a2e"/>
    <!-- cap top -->
    <rect x="11" y="1" width="10" height="3" fill="#1a1a2e"/>
    <!-- hat band -->
    <rect x="11" y="3" width="10" height="1" fill="#e8d44d"/>
    <!-- tassel -->
    <rect x="21" y="1" width="1" height="3" fill="#e8d44d"/>
    <rect x="22" y="3" width="1" height="2" fill="#e8d44d"/>
    <!-- round head -->
    <rect x="10" y="4" width="12" height="9" fill="#fde9c9"/>
    <rect x="9"  y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="22" y="5" width="1"  height="7" fill="#fde9c9"/>
    <!-- big left eye (2x2) -->
    <rect x="11" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="11" y="6" width="1" height="1" fill="#ffffff"/>
    <!-- big right eye -->
    <rect x="18" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="18" y="6" width="1" height="1" fill="#ffffff"/>
    <!-- rosy cheeks -->
    <rect x="10" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="20" y="9" width="2" height="1" fill="#f4a0a0"/>
    <!-- tiny smile -->
    <rect x="13" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="14" y="12" width="4" height="1" fill="#c87070"/>
    <rect x="18" y="11" width="1" height="1" fill="#c87070"/>
    <!-- body / coat -->
    <rect x="10" y="13" width="12" height="10" fill="#2d3561"/>
    <!-- collar accent -->
    <rect x="13" y="13" width="6" height="2" fill="#e8d44d"/>
    <!-- left arm down -->
    <rect x="8"  y="14" width="2" height="7" fill="#2d3561"/>
    <!-- right arm down -->
    <rect x="22" y="14" width="2" height="7" fill="#2d3561"/>
    <!-- legs walk-A -->
    <rect x="11" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="17" y="23" width="4" height="4" fill="#1a1a2e"/>
    <!-- shoes -->
    <rect x="10" y="28" width="5" height="2" fill="#2a1a0a"/>
    <rect x="17" y="27" width="4" height="2" fill="#2a1a0a"/>
  </g>

  <!-- ════ FRAME 1: Stand (neutral) ════ -->
  <g transform="translate(32,0)">
    <rect x="9" y="3" width="14" height="1" fill="#1a1a2e"/>
    <rect x="11" y="1" width="10" height="3" fill="#1a1a2e"/>
    <rect x="11" y="3" width="10" height="1" fill="#e8d44d"/>
    <rect x="21" y="1" width="1" height="3" fill="#e8d44d"/>
    <rect x="22" y="3" width="1" height="2" fill="#e8d44d"/>
    <rect x="10" y="4" width="12" height="9" fill="#fde9c9"/>
    <rect x="9"  y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="22" y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="11" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="11" y="6" width="1" height="1" fill="#ffffff"/>
    <rect x="18" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="18" y="6" width="1" height="1" fill="#ffffff"/>
    <rect x="10" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="20" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="13" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="14" y="12" width="4" height="1" fill="#c87070"/>
    <rect x="18" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="10" y="13" width="12" height="10" fill="#2d3561"/>
    <rect x="13" y="13" width="6" height="2" fill="#e8d44d"/>
    <rect x="8"  y="14" width="2" height="7" fill="#2d3561"/>
    <rect x="22" y="14" width="2" height="7" fill="#2d3561"/>
    <!-- legs stand -->
    <rect x="11" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="17" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="10" y="28" width="5" height="2" fill="#2a1a0a"/>
    <rect x="17" y="28" width="5" height="2" fill="#2a1a0a"/>
  </g>

  <!-- ════ FRAME 2: Walk-B (right foot forward) ════ -->
  <g transform="translate(64,0)">
    <rect x="9" y="3" width="14" height="1" fill="#1a1a2e"/>
    <rect x="11" y="1" width="10" height="3" fill="#1a1a2e"/>
    <rect x="11" y="3" width="10" height="1" fill="#e8d44d"/>
    <rect x="21" y="1" width="1" height="3" fill="#e8d44d"/>
    <rect x="22" y="3" width="1" height="2" fill="#e8d44d"/>
    <rect x="10" y="4" width="12" height="9" fill="#fde9c9"/>
    <rect x="9"  y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="22" y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="11" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="11" y="6" width="1" height="1" fill="#ffffff"/>
    <rect x="18" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="18" y="6" width="1" height="1" fill="#ffffff"/>
    <rect x="10" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="20" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="13" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="14" y="12" width="4" height="1" fill="#c87070"/>
    <rect x="18" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="10" y="13" width="12" height="10" fill="#2d3561"/>
    <rect x="13" y="13" width="6" height="2" fill="#e8d44d"/>
    <rect x="8"  y="14" width="2" height="7" fill="#2d3561"/>
    <rect x="22" y="14" width="2" height="7" fill="#2d3561"/>
    <!-- legs walk-B (mirrored) -->
    <rect x="11" y="23" width="4" height="4" fill="#1a1a2e"/>
    <rect x="17" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="11" y="27" width="4" height="2" fill="#2a1a0a"/>
    <rect x="17" y="28" width="5" height="2" fill="#2a1a0a"/>
  </g>

  <!-- ════ FRAME 3: Stand (same as F1) ════ -->
  <g transform="translate(96,0)">
    <rect x="9" y="3" width="14" height="1" fill="#1a1a2e"/>
    <rect x="11" y="1" width="10" height="3" fill="#1a1a2e"/>
    <rect x="11" y="3" width="10" height="1" fill="#e8d44d"/>
    <rect x="21" y="1" width="1" height="3" fill="#e8d44d"/>
    <rect x="22" y="3" width="1" height="2" fill="#e8d44d"/>
    <rect x="10" y="4" width="12" height="9" fill="#fde9c9"/>
    <rect x="9"  y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="22" y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="11" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="11" y="6" width="1" height="1" fill="#ffffff"/>
    <rect x="18" y="6" width="3" height="3" fill="#1a1a2e"/>
    <rect x="18" y="6" width="1" height="1" fill="#ffffff"/>
    <rect x="10" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="20" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="13" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="14" y="12" width="4" height="1" fill="#c87070"/>
    <rect x="18" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="10" y="13" width="12" height="10" fill="#2d3561"/>
    <rect x="13" y="13" width="6" height="2" fill="#e8d44d"/>
    <rect x="8"  y="14" width="2" height="7" fill="#2d3561"/>
    <rect x="22" y="14" width="2" height="7" fill="#2d3561"/>
    <rect x="11" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="17" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="10" y="28" width="5" height="2" fill="#2a1a0a"/>
    <rect x="17" y="28" width="5" height="2" fill="#2a1a0a"/>
  </g>

  <!-- ════ FRAME 4: Read-A (holding book, looking down) ════ -->
  <g transform="translate(128,0)">
    <rect x="9" y="3" width="14" height="1" fill="#1a1a2e"/>
    <rect x="11" y="1" width="10" height="3" fill="#1a1a2e"/>
    <rect x="11" y="3" width="10" height="1" fill="#e8d44d"/>
    <rect x="21" y="1" width="1" height="3" fill="#e8d44d"/>
    <rect x="22" y="3" width="1" height="2" fill="#e8d44d"/>
    <rect x="10" y="4" width="12" height="9" fill="#fde9c9"/>
    <rect x="9"  y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="22" y="5" width="1"  height="7" fill="#fde9c9"/>
    <!-- eyes looking down (shifted 1px lower) -->
    <rect x="11" y="7" width="3" height="3" fill="#1a1a2e"/>
    <rect x="11" y="7" width="1" height="1" fill="#ffffff"/>
    <rect x="18" y="7" width="3" height="3" fill="#1a1a2e"/>
    <rect x="18" y="7" width="1" height="1" fill="#ffffff"/>
    <rect x="10" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="20" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="13" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="14" y="12" width="4" height="1" fill="#c87070"/>
    <rect x="18" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="10" y="13" width="12" height="10" fill="#2d3561"/>
    <rect x="13" y="13" width="6" height="2" fill="#e8d44d"/>
    <!-- left arm raised holding book -->
    <rect x="7"  y="13" width="3" height="5" fill="#2d3561"/>
    <rect x="22" y="14" width="2" height="7" fill="#2d3561"/>
    <!-- book closed (red) -->
    <rect x="7"  y="17" width="8" height="5" fill="#ef4444"/>
    <rect x="13" y="17" width="1" height="5" fill="#e8d44d"/>
    <rect x="7"  y="17" width="8" height="1" fill="#c03030"/>
    <!-- stand legs -->
    <rect x="11" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="17" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="10" y="28" width="5" height="2" fill="#2a1a0a"/>
    <rect x="17" y="28" width="5" height="2" fill="#2a1a0a"/>
  </g>

  <!-- ════ FRAME 5: Read-B (open book) ════ -->
  <g transform="translate(160,0)">
    <rect x="9" y="3" width="14" height="1" fill="#1a1a2e"/>
    <rect x="11" y="1" width="10" height="3" fill="#1a1a2e"/>
    <rect x="11" y="3" width="10" height="1" fill="#e8d44d"/>
    <rect x="21" y="1" width="1" height="3" fill="#e8d44d"/>
    <rect x="22" y="3" width="1" height="2" fill="#e8d44d"/>
    <rect x="10" y="4" width="12" height="9" fill="#fde9c9"/>
    <rect x="9"  y="5" width="1"  height="7" fill="#fde9c9"/>
    <rect x="22" y="5" width="1"  height="7" fill="#fde9c9"/>
    <!-- eyes looking down -->
    <rect x="11" y="7" width="3" height="3" fill="#1a1a2e"/>
    <rect x="11" y="7" width="1" height="1" fill="#ffffff"/>
    <rect x="18" y="7" width="3" height="3" fill="#1a1a2e"/>
    <rect x="18" y="7" width="1" height="1" fill="#ffffff"/>
    <rect x="10" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="20" y="9" width="2" height="1" fill="#f4a0a0"/>
    <rect x="13" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="14" y="12" width="4" height="1" fill="#c87070"/>
    <rect x="18" y="11" width="1" height="1" fill="#c87070"/>
    <rect x="10" y="13" width="12" height="10" fill="#2d3561"/>
    <rect x="13" y="13" width="6" height="2" fill="#e8d44d"/>
    <rect x="7"  y="13" width="3" height="5" fill="#2d3561"/>
    <rect x="22" y="14" width="2" height="7" fill="#2d3561"/>
    <!-- open book -->
    <rect x="6"  y="18" width="10" height="4" fill="#ef4444"/>
    <rect x="7"  y="17" width="4" height="4" fill="#fffef0"/>
    <rect x="11" y="17" width="4" height="4" fill="#fffef0"/>
    <rect x="8"  y="18" width="2" height="1" fill="#aaaaaa"/>
    <rect x="12" y="18" width="2" height="1" fill="#aaaaaa"/>
    <rect x="8"  y="20" width="2" height="1" fill="#aaaaaa"/>
    <rect x="12" y="20" width="2" height="1" fill="#aaaaaa"/>
    <!-- stand legs -->
    <rect x="11" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="17" y="23" width="4" height="5" fill="#1a1a2e"/>
    <rect x="10" y="28" width="5" height="2" fill="#2a1a0a"/>
    <rect x="17" y="28" width="5" height="2" fill="#2a1a0a"/>
  </g>

</svg>`;

const SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(SPRITE_SHEET_SVG)}`;

export default function Home() {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Roaming Sprite States
  const [positionX, setPositionX] = useState(100);
  const [isWalking, setIsWalking] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [containerWidth, setContainerWidth] = useState(896);

  const heroRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(100);
  const directionRef = useRef<'left' | 'right'>('right');

  const fullText = "Dear Professor Jenkins,\n\nI recently read your paper on Sparse Attention via Dynamic Token Clustering and was struck by how your cluster-based routing approach could extend to vision-language transformers.\n\nMy thesis work on adversarial robustness of quantized LLMs at BRAC University gave me hands-on experience with Qwen2.5 and Pythia under INT8 and 4-bit precision — I believe there is a meaningful overlap with your efficiency research. I would love to discuss potential research directions. Would you be available for a brief call next week?";

  // Typing simulator effect
  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 18);
      return () => clearInterval(typingInterval);
    }, 500);
    return () => clearTimeout(startTimeout);
  }, []);

  // Update container width on mount and resize
  useEffect(() => {
    if (heroRef.current) {
      setContainerWidth(heroRef.current.clientWidth);
    }
    const handleResize = () => {
      if (heroRef.current) {
        setContainerWidth(heroRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync direction state changes to ref
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // physics loop for horizontal roaming
  useEffect(() => {
    if (!isWalking) return;
    let animationFrameId: number;

    const updatePhysics = () => {
      const speed = 1.0; // walking speed in px per frame
      let nextX = positionRef.current + (directionRef.current === 'right' ? speed : -speed);

      if (nextX <= 0) {
        nextX = 0;
        setDirection('right');
        directionRef.current = 'right';
      } else if (nextX >= containerWidth - 64) {
        nextX = containerWidth - 64;
        setDirection('left');
        directionRef.current = 'left';
      }

      positionRef.current = nextX;
      setPositionX(nextX);
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isWalking, containerWidth]);

  // Interval timer for switching walk vs. read state
  useEffect(() => {
    let timerId: any;

    const tick = () => {
      if (isWalking) {
        // Walk for 5-8 seconds, then switch to reading
        const delay = Math.random() * 3000 + 5000;
        timerId = setTimeout(() => {
          setIsWalking(false);
        }, delay);
      } else {
        // Read for 3-4 seconds, then switch to walking
        const delay = Math.random() * 1000 + 3000;
        timerId = setTimeout(() => {
          setIsWalking(true);
        }, delay);
      }
    };

    tick();
    return () => clearTimeout(timerId);
  }, [isWalking]);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-28 text-center">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor-blink {
          animation: cursor-blink 1s step-end infinite;
        }
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .hero-glow {
          animation: hero-glow-pulse 4s ease-in-out infinite;
        }

        /* ── Sprite Animations ── */
        @keyframes walk-cycle {
          from { background-position-x: 0px; }
          to { background-position-x: -256px; }
        }
        @keyframes read-cycle {
          from { background-position-x: -256px; }
          to { background-position-x: -384px; }
        }
        .sprite-char {
          width: 64px;
          height: 64px;
          background-size: 384px 64px;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          background-repeat: no-repeat;
        }
        .sprite-walk {
          animation: walk-cycle 0.8s steps(4) infinite;
        }
        .sprite-read {
          animation: read-cycle 1.0s steps(2) infinite;
        }
        /* smooth vertical bob — applied to WRAPPER, never the sprite element */
        @keyframes sprite-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        .sprite-bob-wrapper {
          animation: sprite-bob 2.4s ease-in-out infinite;
        }
      `}} />

      {/* Hero Section — no relative positioning on outer div so sprite can't overlap children */}
      <div ref={heroRef} className="mb-16 relative">

        {/* Radial glow behind SVG — absolutely positioned so it doesn't affect flow */}
        <div
          className="hero-glow pointer-events-none absolute left-1/2 -translate-x-1/2 w-[480px] h-[480px] -top-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,212,77,0.05) 0%, transparent 70%)',
          }}
        />

        {/* Professor SVG — centered above headline */}
        <div className="relative z-10 flex justify-center mb-8">
          <ProfessorPixelArt />
        </div>

        <h1 className="text-[56px] font-[800] tracking-tight text-[#e8e2d3] leading-[1.1] mb-6">
          Cold emails that<br />actually get replies
        </h1>
        <p className="text-[18px] text-[#888888] font-medium max-w-lg mx-auto leading-relaxed mb-10">
          Paste a professor's lab page. Get a personalized email in seconds.
        </p>
        <button
          onClick={() => navigate('/app')}
          className="px-10 py-4 bg-[#e8d44d] hover:bg-[#f0dc55] text-black font-bold text-[15px] tracking-wide rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          style={{ boxShadow: '0 4px 24px rgba(232,212,77,0.2)' }}
        >
          Start Writing
        </button>

        {/* Roaming lane — sits BELOW the button, character bobs inside wrapper */}
        <div className="relative w-full mt-6" style={{ height: '80px', overflow: 'visible' }}>
          {/* Outer wrapper: handles X position + direction flip + vertical bob */}
          <div
            className="absolute top-0 sprite-bob-wrapper"
            style={{
              left: `${positionX}px`,
              transform: `scaleX(${direction === 'left' ? -1 : 1})`,
              transition: 'transform 0.15s linear',
              width: '64px',
              height: '64px',
            }}
          >
            {/* Inner element: only the sprite sheet frame animation */}
            <div
              className={`sprite-char ${isWalking ? 'sprite-walk' : 'sprite-read'}`}
              style={{ backgroundImage: `url("${SVG_DATA_URI}")` }}
            />
          </div>
        </div>
      </div>

      {/* Animated Email Client Window Preview Card */}
      <div
        className="max-w-[860px] mx-auto text-left bg-[#0f0f0f] border border-[#333333] rounded-2xl relative overflow-hidden"
        style={{ boxShadow: '0 0 80px rgba(232, 212, 77, 0.12), 0 40px 80px rgba(0,0,0,0.7)' }}
      >
        {/* macOS Window Title Bar */}
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3.5 h-3.5 rounded-full bg-[#28ca41]"></div>
          </div>
          <span className="text-[#666666] text-sm font-sans tracking-widest uppercase font-medium">
            New Message — Draft
          </span>
          <div className="w-16"></div>
        </div>

        {/* Email Headers & Body Panel */}
        <div className="p-8">
          <div className="space-y-3 mb-6 text-sm font-mono border-b border-[#222222] pb-5 text-[#cdc7af]/70">
            <div className="flex items-center">
              <span className="w-20 text-[#555555] uppercase tracking-wider text-xs">To</span>
              <span className="text-[#e8e2d3] font-medium">prof.sarah.jenkins@university.edu</span>
            </div>
            <div className="flex items-start">
              <span className="w-20 text-[#555555] uppercase tracking-wider text-xs pt-0.5">Subject</span>
              <span className="text-[#e2c23d] font-semibold text-sm">
                Inquiry about ML Research - Scaling Attention Mechanisms
              </span>
            </div>
          </div>

          <div className="min-h-[320px] text-base text-[#e8e2d3] leading-[1.8] font-sans whitespace-pre-wrap">
            {displayText}
            {showCursor && (
              <span className="inline-block w-2 h-5 bg-[#e8d44d] ml-1 align-middle animate-cursor-blink"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

