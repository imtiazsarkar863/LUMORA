import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import './App.css';

function App() {
  const [soundOn, setSoundOn] = useState(false);
  const [showFinale, setShowFinale] = useState(false);
  const whistleAudioRef = useRef(null);
  const boomAudioRef = useRef(null);
  const nextSectionRef = useRef(null);
  const cursorRef = useRef(null);
  const wickHitboxRef = useRef(null);
  const rocketSoundRef = useRef(null);
  const diwaliMusicRef = useRef(null);
  const searchParams = new URLSearchParams(window.location.search);
  const urlTo = searchParams.get('to') || '';
  const urlFrom = searchParams.get('from') || '';
  const urlMsg = searchParams.get('msg') || '';
  const isPersonalized = Boolean(urlTo || urlFrom);
  const [isDiyaLit, setIsDiyaLit] = useState(false);
  const [isInSection2, setIsInSection2] = useState(false);
  const [isDraggingMatch, setIsDraggingMatch] = useState(false);
  const [inputSender, setInputSender] = useState('');
  const [inputReceiver, setInputReceiver] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const scrollToLiveVideo = () => {
    document.getElementById('live-video')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  const handleShuffleWish = () => {
    const nextWish = festiveWishes[Math.floor(Math.random() * festiveWishes.length)];
    setInputMessage(nextWish);
  };



  const generatedShareLink = `${window.location.origin}${window.location.pathname}?to=${encodeURIComponent(inputReceiver.trim())}&from=${encodeURIComponent(inputSender.trim())}&msg=${encodeURIComponent(inputMessage.trim())}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedShareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };


  useEffect(() => {
    if (isDiyaLit) {
      setTimeout(() => {
        document.getElementById('golden-wishes')?.scrollIntoView({
          behavior: 'smooth',
          duration: 1000,
          block: 'start'
        });
      }, 300);
    }
  }, [isDiyaLit]);
  const handleShareWhatsApp = () => {
    const text = `✨ *Happy Diwali!* I have lit a sacred digital Diya especially for you.\n\nOpen your personal light dedication here:\n${generatedShareLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    scrollToLiveVideo();
    window.open(whatsappURL, '_blank');
  };
  const toggleSound = () => {
    if (!diwaliMusicRef.current) return;

    if (soundOn) {
      diwaliMusicRef.current.pause();
      setSoundOn(false);
    } else {
      diwaliMusicRef.current.volume = 0.5;

      diwaliMusicRef.current.play()
        .then(() => setSoundOn(true))
        .catch(err => console.log(err));
    }
  };
  const handleLightDiya = () => {
    if (isDiyaLit) return;
    setIsDiyaLit(true);
    setIsDraggingMatch(false);

    gsap.fromTo(
      '.flame-container',
      { scale: 0, y: 15 },
      { scale: 1, y: 0, duration: 0.6, ease: 'back.out(2)' }
    );
  };
  useEffect(() => {
    const finale = document.querySelector('.finale-section');

    if (!finale) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFinale(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(finale);

    return () => observer.disconnect();
  }, []);


  const palette = [
    { color: '#ffffff', glow: 'rgba(255, 255, 255, 1)' },
    { color: '#ffd15c', glow: 'rgba(255, 209, 92, 0.95)' },
    { color: '#ff8a24', glow: 'rgba(255, 138, 36, 0.9)' },
    { color: '#ff3d67', glow: 'rgba(255, 61, 103, 0.85)' },
    { color: '#d04aff', glow: 'rgba(208, 74, 255, 0.85)' },
    { color: '#27e87b', glow: 'rgba(39, 232, 123, 0.85)' }
  ];

  const rocketSparks = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    driftX: (Math.random() - 0.5) * 32
  }));

  const burstParticles = Array.from({ length: 120 }, (_, i) => {
    const angle = (i / 120) * Math.PI * 2 + (Math.random() - 0.5) * 0.12;
    const distance = 35 + Math.random() * 95;
    const colorObj = palette[i % palette.length];

    return {
      id: i,
      targetX: Math.cos(angle) * distance,
      targetY: Math.sin(angle) * distance,
      rotation: (angle * 180) / Math.PI + 90,
      length: 18 + Math.random() * 24,
      color: colorObj.color,
      glow: colorObj.glow
    };
  });

  const coreFlashSparks = Array.from({ length: 36 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 6 + Math.random() * 24;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      size: 2 + Math.random() * 2.5
    };
  });

  // Global mouse and touch tracker with precision wick hitbox
  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: clientX,
          y: clientY,
          duration: 0.06,
          ease: 'power2.out'
        });
      }
    };

    const checkWickCollision = (clientX, clientY) => {
      if (isDiyaLit) return;
      const wick = wickHitboxRef.current;
      if (wick) {
        const rect = wick.getBoundingClientRect();
        const wickCenterX = rect.left + rect.width / 2;
        const wickCenterY = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - wickCenterX, clientY - wickCenterY);

        if (distance <= 32) {
          handleLightDiya();
        }
      }
    };

    const handleMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
      if (isInSection2 && !isDiyaLit) {
        checkWickCollision(e.clientX, e.clientY);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        setIsDraggingMatch(true);
        const touch = e.touches[0];
        const offset = isInSection2 && !isDiyaLit ? 35 : 0;
        updatePosition(touch.clientX, touch.clientY - offset);
        if (isInSection2 && !isDiyaLit) {
          checkWickCollision(touch.clientX, touch.clientY - offset);
        }
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        if (isInSection2 && !isDiyaLit) {
          if (e.cancelable) e.preventDefault();
          const flameX = touch.clientX;
          const flameY = touch.clientY - 35;
          updatePosition(flameX, flameY);
          checkWickCollision(flameX, flameY);
        } else {
          updatePosition(touch.clientX, touch.clientY);
        }
      }
    };

    const handleTouchEnd = () => {
      setIsDraggingMatch(false);
    };

    const handleScroll = () => {
      if (!nextSectionRef.current) return;
      const rect = nextSectionRef.current.getBoundingClientRect();
      const inView = rect.top <= window.innerHeight * 0.55 && rect.bottom >= window.innerHeight * 0.35;
      setIsInSection2(inView);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isInSection2, isDiyaLit]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.set('.mandala-wrapper, .diwali-greeting, .ambient-flash, .blast-ring', {
        autoAlpha: 0,
        display: 'none'
      });
      tl.to(
        '.intro-text',
        {
          opacity: 0,
          y: -40,
          filter: 'blur(4px)',
          duration: 1.1,
          ease: 'power2.inOut'
        },
        '+=2.4'
      );


      tl.set('.firecracker', {
        autoAlpha: 1,
        display: 'block',
        y: -180
      });


      tl.to('.firecracker', {
        y: window.innerHeight * 0.5,
        duration: 1.15,
        ease: 'power3.in',
        onStart: () => {
          if (whistleAudioRef.current) {
            whistleAudioRef.current.currentTime = 0;
            whistleAudioRef.current.play().catch(() => { });
          }
        }
      });

      tl.fromTo(
        '.drop-spark',
        { autoAlpha: 1, scale: 1 },
        {
          autoAlpha: 0,
          scale: 0.2,
          duration: 0.35,
          stagger: 0.03,
          ease: 'power1.out'
        },
        '<0.1'
      );

      tl.set('.firecracker', {
        autoAlpha: 0,
        display: 'none'
      });

      tl.add(() => {
        if (rocketSoundRef.current) {
          rocketSoundRef.current.currentTime = 0;
          rocketSoundRef.current.play().catch(err => {
            console.log("Rocket audio error:", err);
          });
        }
        gsap.fromTo('.hero-section',
          { x: -5, y: 4 },
          { x: 0, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      });


      tl.set(
        '.blast-ring, .burst-streak, .core-burst-spark',
        {
          autoAlpha: 0,
          display: 'none'
        }
      );

      tl.set('.ambient-flash', {
        display: 'block',
        autoAlpha: 0
      });


      tl.to('.ambient-flash', {
        autoAlpha: 1,
        duration: 0.45,
        ease: 'power2.out'
      });

      tl.to('.ambient-flash', {
        autoAlpha: 1,
        duration: 0.7
      });


      tl.to('.ambient-flash', {
        autoAlpha: 0,
        duration: 1.4,
        ease: 'power2.inOut'
      });

      tl.set('.ambient-flash', {
        display: 'none'
      });
      tl.set('.hanging-lights-container', {
        autoAlpha: 1
      });
      tl.set('.mandala-wrapper', {
        display: 'flex',
        '--mask-inner': '50%',
        '--mask-outer': '72%',
        filter: 'blur(0px) drop-shadow(0 0 26px rgba(255, 185, 0, 0.3))'
      });

      tl.fromTo('.mandala-wrapper',
        {
          autoAlpha: 0,
          scale: 0.35,
          rotation: 0
        },
        {
          autoAlpha: 0.85,
          scale: 1.35,
          duration: 0.45,
          ease: 'power2.out'
        },
        '<'
      );


      tl.to('.mandala-wrapper', {
        rotation: 35,
        scale: 1.15,
        autoAlpha: 0,
        filter: 'blur(10px) drop-shadow(0 0 45px rgba(255, 180, 0, 0))',
        '--mask-inner': '0%',
        '--mask-outer': '35%',
        duration: 0.95,
        ease: 'power2.inOut'
      }, '+=0.02');

      tl.set('.mandala-wrapper', {
        display: 'none'
      });


      tl.set('.diwali-greeting', {
        display: 'block'
      });

      tl.fromTo(
        '.diwali-greeting',
        {
          autoAlpha: 0,
          y: 18,
          scale: 0.96
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',


        }
      );

      tl.call(() => {
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
      }, null, '+=0.5');

      tl.to(
        {},
        {
          duration: 2.4,
          ease: 'power2.inOut',
          onUpdate: function () {
            const progress = this.progress();
            const targetY = window.innerHeight;
            window.scrollTo(0, targetY * progress);
          }
        }
      );
    });

    return () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      ctx.revert();
    };
  }, []);

  const showMatchstick = isInSection2 && !isDiyaLit;

  return (
    <div className="page-wrapper">
      <button
        className="sound-toggle"
        onClick={toggleSound}
        type="button"
      >

        {soundOn ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#f5d77e"><path d="M14,20.73V18.68q2.25-0.65 3.63-2.5T19,11.98t-1.38-4.2Q16.25,5.93 14,5.27V3.22q3.1,0.7 5.05,3.14T21,11.98t-1.95,5.61T14,20.73ZM3,15V9H7l5-5V20L7,15H3Zm11,1V7.95Q15.18,8.5 15.84,9.6T16.5,12q0,1.27-0.66,2.36T14,16ZM10,8.85L7.85,11H5v2H7.85L10,15.15V8.85ZM7.5,12Z" /></svg>
        ) : (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="#f5d77e"><path d="M19.8,22.6l-3.02-3.03q-0.63,0.4-1.33,0.69T14,20.73V18.68q0.35-0.13 0.69-0.25q0.34-0.13 0.64-0.3L12,14.8V20L7,15H3V9H6.2L1.4,4.2L2.8,2.8L21.2,21.2l-1.4,1.4Zm-0.2-5.8l-1.45-1.45q0.42-0.78 0.64-1.63T19,11.98q0-2.35-1.38-4.2Q16.25,5.93 14,5.27V3.22q3.1,0.7 5.05,3.14T21,11.98q0,1.32-0。36,2。55T19。6,16。8Zm-3。35-3。35L14,11。2V7。95Q15。18,8。5 15。84,9。6T16。5,12q0,0。38-0。06,0。74t-0。１９,0。7１ZM１２,９。２L９。４,６。６L１２,４V９。２Zm-２,５。９５V１２。８L８。２,１１H５v２H７。８５L１０,１５。１５ZM９。１,１１。９Z" /></svg>
)}
      </button>
      <audio ref={whistleAudioRef} src="/firecracker-whistle.mp3" preload="auto" />
      <audio ref={boomAudioRef} src="/explosion.mp3" preload="auto" />
      <audio ref={rocketSoundRef} src="/rocket-burst.mp3" preload="auto" />
      <audio ref={diwaliMusicRef} src="/diwali_theme.mp3" preload="auto" loop />


      <div
        className={`custom-cursor-container ${showMatchstick ? 'mode-match' : 'mode-pointer'} ${isDraggingMatch ? 'active-drag' : ''}`}
        ref={cursorRef}
      >
        {showMatchstick ? (
          <div className="matchstick-cursor">
            <div className="matchstick-flame"></div>
            <div className="matchstick-head"></div>
            <div className="matchstick-stick"></div>
          </div>
        ) : (
          <div className="golden-cursor">
            <div className="golden-ring"></div>
            <div className="golden-dot"></div>
          </div>
        )}
      </div>


      <div className="ambient-flash"></div>


      <div className={`hanging-lights-container ${isDiyaLit ? 'lit' : ''} ${showFinale ? 'hidden' : 'waiting'}`}>        <div className="hanging-lamp lamp-1"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-2"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-3"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-4"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-5"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-6"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-7"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
        <div className="hanging-lamp lamp-8"><div className="lamp-chain"></div><div className="lamp-fixture"><div className="lamp-glow"></div><div className="lamp-flame"></div><div className="lamp-cap"></div><div className="lamp-body"></div></div></div>
      </div>

      <section className="hero-section">
        <div className="intro-text">
          <h1>LUMORA</h1>
          <br />
          <p>A FESTIVAL OF LIGHT</p>

        </div>


        <div className="firecracker">
          <div className="rocket-body">
            <div className="rocket-nozzle"></div>
          </div>
          <div className="firecracker-head">
            <div className="fuse-spark fuse-1"></div>
            <div className="fuse-spark fuse-2"></div>
            <div className="fuse-core"></div>
          </div>
          <div className="exhaust-stream">
            {rocketSparks.map((s) => (
              <span
                key={s.id}
                className="drop-spark"
                style={{
                  transform: `translateX(${s.driftX}px)`,
                  animationDelay: `${(s.id * 0.04)}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="explosion">


          <div className="mandala-wrapper">
            <img src="/mandala.png" alt="Diwali Rangoli Mandala" className="mandala-img" />
          </div>
        </div>


        <div className="diwali-greeting">
          {isPersonalized ? (
            <>
              <h1>HAPPY DIWALI{urlTo ? `, ${urlTo.toUpperCase()}` : ''}</h1>
              {urlFrom && (
                <p className="greeting-from-sub">A DEDICATION OF LIGHT FROM {urlFrom.toUpperCase()}</p>
              )}
            </>
          ) : (
            <h1>HAPPY DIWALI</h1>
          )}
        </div>
      </section>


      <section className={`next-section ${isDiyaLit ? 'diya-is-lit' : ''}`} ref={nextSectionRef}>


        <div className="sacred-altar-container">
          <div className={`diya-ambient-glow ${isDiyaLit ? 'lit' : ''}`}></div>

          <div className={`floor-rangoli ${isDiyaLit ? 'lit' : ''}`}>
            <img src="/mandala-floor.png" alt="Ceremonial Floor Rangoli" />
          </div>

          <div className={`diya-stage ${isDiyaLit ? 'is-lit' : ''}`}>
            <div className={`flame-container ${isDiyaLit ? 'lit' : ''}`}>
              <div className="flame-outer"></div>
              <div className="flame-inner"></div>
              <div className="flame-blue-base"></div>
            </div>


            <div className="wick-precision-target" ref={wickHitboxRef}></div>

            <svg className="diya-svg" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e5a93b" />
                  <stop offset="45%" stopColor="#8c5819" />
                  <stop offset="80%" stopColor="#4a2e0a" />
                  <stop offset="100%" stopColor="#211403" />
                </linearGradient>
                <linearGradient id="lipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffc86b" />
                  <stop offset="100%" stopColor="#693e0b" />
                </linearGradient>
              </defs>

              <ellipse cx="100" cy="108" rx="42" ry="7" fill="#140c03" />
              <path d="M72 104 C72 104, 82 96, 100 96 C118 96, 128 104, 128 104 L122 108 L78 108 Z" fill="url(#brassGrad)" />
              <path d="M25 50 Q100 125 175 50 Q180 44 165 42 Q100 52 35 42 Q20 44 25 50 Z" fill="url(#brassGrad)" />
              <ellipse cx="100" cy="46" rx="72" ry="12" fill="url(#lipGrad)" />
              <ellipse cx="100" cy="47" rx="64" ry="9" fill="#2d1704" />
              <path d="M98 47 Q100 30 100 24 Q100 30 102 47 Z" fill="#d9c5b2" />
              <circle cx="100" cy="24" r="2.5" fill="#402d24" />
            </svg>
          </div>

          {!isDiyaLit && (
            <div className="kindle-prompt">
              <span>✦</span> Drag Flame to the Wick to Kindle <span>✦</span>
            </div>
          )}
        </div>


        <div className={`blessing-text ${isDiyaLit ? 'lit' : ''}`}>
          {urlMsg && (
            <div className="personal-card">
              <div className="card-ornament-top">✦ ✧ ✦</div>
              <p className="personal-msg">“{urlMsg}”</p>
              <div className="card-ornament-bottom"></div>
            </div>
          )}
          <p className="shloka-sanskrit">तमसो मा ज्योतिर्गमय</p>
          <p className="shloka-english">From darkness, leading to light</p>
        </div>

        {isDiyaLit && (
          <div className="scroll-indicator">
            <span>Scroll to dedicate your own light</span>
            <div className="indicator-arrow">↓</div>
          </div>
        )}
      </section>


      <section id="golden-wishes" className="wishes-section">

        <div className="wishes-content">

          <p className="wishes-label">Dark nights, golden lights, endless vibes! </p>
          <br />
          <br />
          <br />
          <h1>
            Let the diyas glow, the sweets flow, and the magic unfold.
            <br />
            May your home shine with happiness, your heart overflow with love, and your year sparkle with endless possibilities.
          </h1>
          <br />
          <p>
            Wishing you and your loved ones a very Happy Diwali! ✨
          </p>
          <br />
          <span className="wishes-divider">↓ </span>

        </div>

      </section>


      <section className="forge-section">
        <div className="forge-container">
          <div className="forge-header">

            <h2>Send a Living Diya </h2>
            <br />
            <br /><br />
            <p>No filters needed when the whole night is glowing.</p>
            <br />
            <br /><br />

          </div>

          <div className="forge-form">
            <div className="form-row">
              <div className="input-group">
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav"
                  value={inputSender}
                  onChange={(e) => setInputSender(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Recipient's Name</label>
                <input
                  type="text"
                  placeholder="e.g. Riya"
                  value={inputReceiver}
                  onChange={(e) => setInputReceiver(e.target.value)}
                />
              </div>
            </div>
            <br />
            <div className="input-group">
              <div className="label-with-action">
                <label>Festive Blessing / Wish</label>
                {/* <button
                  type="button"
                  className="shuffle-wish-btn"
                  onClick={handleShuffleWish}
                >
                  ✨ Inspire Blessing
                </button> */}
              </div>
              <textarea
                rows="3"
                placeholder="Write your blessing, or tap 'Inspire Blessing' for traditional poetry..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
            </div>

            <div className="forge-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  handleCopyLink();
                  scrollToLiveVideo();
                }}
                disabled={!inputReceiver.trim() && !inputSender.trim()}
              >
                {copied ? '✓ Personal Link Copied!' : 'Copy Dedication Link'}
              </button>

              <button
                type="button"
                className="btn-whatsapp"
                onClick={handleShareWhatsApp}
                disabled={!inputReceiver.trim() && !inputSender.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="16px" width="16px" fill="#e3e3e3"><path d="M17,22q-1.25,0-2.13-0.88T14,19q0-0.15 0.08-0.7L7.05,14.2q-0.4,0.38-0.93,0.59T5,15q-1.25,0-2.13-0.88T2,12T2.88,9.88T5,9Q5.6,9 6.13,9.21T7.05,9.8l7.03-4.1q-0.05-0.18-0.06-0.34T14,5q0-1.25 0.88-2.13T17,2t2.13,0.88T20,5T19.13,7.13T17,8q-0.6,0-1.13-0.21T14.95,7.2L7.93,11.3q0.05,0.18 0.06,0.34T8,12T7.99,12.36T7.93,12.7l7.03,4.1q0.4-0.38 0.92-0.59T17,16q1.25,0 2.13,0.88T20,19t-0.88,2.13T17,22Zm0-2q0.43,0 0.71-0.29Q18,19.43 18,19t-0.29-0.71T17,18t-0.71,0.29T16,19t0.29,0.71T17,20ZM5,13q0.43,0 0.71-0.29Q6,12.43 6,12T5.71,11.29T5,11q-0.42,0-0.71,0.29T4,12t0.29,0.71T5,13ZM17.71,5.71Q18,5.43 18,5T17.71,4.29T17,4T16.29,4.29T16,5t0.29,0.71T17,6t0.71-0.29ZM17,19ZM5,12ZM17,5Z" /></svg> Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="live-video" className="finale-section">

        <video
          className="finale-video"
          src="/diwali-finale.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        <div className="finale-overlay">
          <p>AND THE NIGHT ENDS IN GOLD...</p>
          <h1>Until The Next Celebration ✨</h1>
        </div>

      </section>
    </div>
  );
}

export default App;