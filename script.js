/* =============================================
   PROJECT: ASK HER OUT — MAIN SCRIPT
   =============================================
   ⚙ EASY CUSTOMIZATION — change these ↓       */

const HER_NAME     = "Shruti";
const MOVIE_DATE   = "March 26";
const THEATER_NAME = "PVR IMAX";

/* ============================================= */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

/* ---------- DOM ---------- */
const cursorDot      = $('#cursorDot');
const cursorRing     = $('#cursorRing');
const scrollProgress = $('#scrollProgress');
const starfield      = $('#starfield');
const preloader      = $('#preloader');
const preloaderText  = $('#preloaderText');
const preloaderBar   = $('#preloaderBar');
const mainContent    = $('#mainContent');
const beginBtn       = $('#beginMission');
const tealLine       = $('#tealLine');
const btnYes         = $('#btnYes');
const btnNo          = $('#btnNo');
const askContent     = $('#askContent');
const askButtons     = $('#askButtons');
const confettiCvs    = $('#confettiCanvas');
const acceptedMsg    = $('#acceptedMsg');
const rockyFloat     = $('#rockyFloat');
const sparkleCvs     = $('#sparkleCanvas');

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Dynamic text
  $('#askDateDisplay').textContent = `📅 ${MOVIE_DATE}`;
  $('#footerTheater').textContent = THEATER_NAME;
  if ($('#footerYear')) $('#footerYear').textContent = new Date().getFullYear();
  if ($('#acceptedTheater')) $('#acceptedTheater').textContent = `📍 ${THEATER_NAME} · ${MOVIE_DATE}`;

  // Calculate countdown
  calcCountdown();

  // Systems
  initStarfield();
  initCursor();
  initPreloader();
});

/* =============================================
   COUNTDOWN — days until movie date
   ============================================= */
function calcCountdown() {
  const el = $('#countdownDays');
  if (!el) return;
  try {
    const now = new Date();
    let target = new Date(`${MOVIE_DATE} ${now.getFullYear()}`);
    if (target < now) target.setFullYear(now.getFullYear() + 1);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    el.dataset.target = diff;
    el.textContent = '—';
  } catch (e) { el.textContent = '?'; }
}

/* =============================================
   PRELOADER
   ============================================= */
function initPreloader() {
  const messages = ['LOADING MISSION...', 'CREW: 1 → 2', 'DESTINATION: UNSTOPPABLE'];
  let msgIdx = 0;
  let charIdx = 0;
  let progress = 0;

  function typewrite() {
    if (msgIdx >= messages.length) {
      setTimeout(() => {
        preloader.classList.add('hidden');
        mainContent.classList.remove('main-hidden');
        mainContent.classList.add('main-visible');
        document.body.classList.add('loaded');
        startExperience();
      }, 600);
      return;
    }

    const msg = messages[msgIdx];
    if (charIdx <= msg.length) {
      preloaderText.textContent = msg.substring(0, charIdx);
      charIdx++;
      setTimeout(typewrite, 55);
    } else {
      msgIdx++;
      charIdx = 0;
      setTimeout(typewrite, 600);
    }
  }

  const progInterval = setInterval(() => {
    progress += 0.9;
    if (progress > 100) progress = 100;
    preloaderBar.style.width = progress + '%';
    if (progress >= 100) clearInterval(progInterval);
  }, 30);

  setTimeout(typewrite, 400);
}

/* =============================================
   START EXPERIENCE — called after preloader
   ============================================= */
function startExperience() {
  initScrollProgress();
  initSectionObserver();
  initParallax();
  initTealLine();
  initAskButtons();
  initAskTypewriter();
  initSparkleTrail();
  initConfettiResize();
  initShootingStars();
  initPageTitles();
  initKeyboardShortcuts();
  initBtnPillScrollHide();
  initRockyTooltipAutoShow();
  initAudioToggle();
  initRockyEasterEgg();
  initSoundEffects();

  beginBtn.addEventListener('click', () => {
    document.getElementById('distance').scrollIntoView({ behavior: 'smooth' });
    startAmbientAudio();
    const toggleBtn = $('#audioToggle');
    if (toggleBtn) setTimeout(() => toggleBtn.classList.add('visible'), 1500);
  });
}

/* =============================================
   SPACE AMBIENT AUDIO — Web Audio API drone
   ============================================= */
let ambientStarted = false;
let ambientGain = null;
let ambientCtx = null;
let audioMuted = false;
function startAmbientAudio() {
  if (ambientStarted) return;
  ambientStarted = true;
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    ambientCtx = ac;
    const gain = ac.createGain();
    ambientGain = gain;
    gain.gain.value = 0;
    gain.connect(ac.destination);
  } catch (e) { /* silent */ }

  const bgMusic = $('#bgMusic');
  if (bgMusic) {
    bgMusic.muted = audioMuted;
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
  }
}

/* =============================================
   WHOOSH SOUND — No button dodge
   ============================================= */
function playWhoosh() {
  if (audioMuted || !ambientCtx) return;
  try {
    const size = ambientCtx.sampleRate * 0.15;
    const buf = ambientCtx.createBuffer(1, size, ambientCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size) ** 2;
    const src = ambientCtx.createBufferSource();
    src.buffer = buf;
    const f = ambientCtx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1200;
    f.Q.value = 1.5;
    const g = ambientCtx.createGain();
    g.gain.value = 0.3;
    src.connect(f);
    f.connect(g);
    g.connect(ambientCtx.destination);
    src.start();
  } catch (e) { /* silent */ }
}

/* =============================================
   UI SOUND EFFECTS — Synthesis
   ============================================= */
const canPlaySfx = () => !audioMuted && ambientCtx;

function playHoverBlip() {
  if (!canPlaySfx()) return;
  try {
    const osc = ambientCtx.createOscillator();
    const g = ambientCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, ambientCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ambientCtx.currentTime + 0.05);
    g.gain.setValueAtTime(0.04, ambientCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ambientCtx.currentTime + 0.05);
    osc.connect(g);
    g.connect(ambientCtx.destination);
    osc.start();
    osc.stop(ambientCtx.currentTime + 0.05);
  } catch(e){}
}

function playTypewriterThud() {
  if (!canPlaySfx()) return;
  try {
    const osc = ambientCtx.createOscillator();
    const g = ambientCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, ambientCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, ambientCtx.currentTime + 0.03);
    g.gain.setValueAtTime(0.08, ambientCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.001, ambientCtx.currentTime + 0.03);
    osc.connect(g);
    g.connect(ambientCtx.destination);
    osc.start();
    osc.stop(ambientCtx.currentTime + 0.03);
  } catch(e){}
}

function playPop() {
  if (!canPlaySfx()) return;
  try {
    const osc = ambientCtx.createOscillator();
    const g = ambientCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ambientCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ambientCtx.currentTime + 0.1);
    g.gain.setValueAtTime(0, ambientCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.15, ambientCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ambientCtx.currentTime + 0.1);
    osc.connect(g);
    g.connect(ambientCtx.destination);
    osc.start(ambientCtx.currentTime);
    osc.stop(ambientCtx.currentTime + 0.1);
  } catch(e){}
}

function playSuccessChime() {
  if (!canPlaySfx()) return;
  try {
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    freqs.forEach((f, i) => {
      const osc = ambientCtx.createOscillator();
      const g = ambientCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, ambientCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.15, ambientCtx.currentTime + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ambientCtx.currentTime + 2.5 + i*0.4);
      osc.connect(g);
      g.connect(ambientCtx.destination);
      osc.start();
      osc.stop(ambientCtx.currentTime + 4);
    });
  } catch(e){}
}

function initSoundEffects() {
  document.body.addEventListener('mouseenter', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
      playHoverBlip();
    }
  }, true);
}

/* =============================================
   CUSTOM CURSOR
   ============================================= */
function initCursor() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('button, a, .rocky-float-img')) {
      cursorRing.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('button, a, .rocky-float-img')) {
      cursorRing.classList.remove('hovering');
    }
  });
}

/* =============================================
   STARFIELD (300 stars + shooting stars)
   ============================================= */
let starfieldCtx, stars, starScrollY = 0;

function initStarfield() {
  starfieldCtx = starfield.getContext('2d');
  stars = [];
  const NUM = 300;

  function resize() {
    starfield.width  = window.innerWidth;
    starfield.height = window.innerHeight;
    generate();
  }

  function generate() {
    stars = [];
    for (let i = 0; i < NUM; i++) {
      stars.push({
        x:  Math.random() * starfield.width,
        y:  Math.random() * starfield.height,
        r:  Math.random() * 1.8 + 0.2,
        a:  Math.random(),
        da: (Math.random() * 0.012) + 0.002,
        up: Math.random() > 0.5,
        depth: Math.random() * 0.5 + 0.5,
      });
    }
  }

  window.addEventListener('scroll', () => { starScrollY = window.scrollY; }, { passive: true });
  window.addEventListener('resize', resize);

  function draw() {
    starfieldCtx.clearRect(0, 0, starfield.width, starfield.height);

    for (const s of stars) {
      if (s.up) { s.a += s.da; if (s.a >= 1) { s.a = 1; s.up = false; } }
      else      { s.a -= s.da; if (s.a <= 0.08) { s.a = 0.08; s.up = true; } }

      const yOff = (starScrollY * s.depth * 0.04) % starfield.height;
      const drawY = (s.y - yOff + starfield.height) % starfield.height;

      starfieldCtx.beginPath();
      starfieldCtx.arc(s.x, drawY, s.r, 0, Math.PI * 2);
      starfieldCtx.fillStyle = `rgba(240,240,240,${s.a})`;
      starfieldCtx.fill();
    }

    drawShootingStars(starfieldCtx);
    requestAnimationFrame(draw);
  }

  resize();
  draw();
}

/* =============================================
   SHOOTING STARS — every 8–12 seconds
   ============================================= */
let shootingStars = [];

function initShootingStars() {
  function spawn() {
    const angle = (15 + Math.random() * 30) * Math.PI / 180;
    const speed = 12 + Math.random() * 10;
    shootingStars.push({
      x: Math.random() * starfield.width * 0.7,
      y: Math.random() * starfield.height * 0.4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.015 + Math.random() * 0.01,
      len: 40 + Math.random() * 60,
    });
    setTimeout(spawn, (8 + Math.random() * 4) * 1000);
  }
  setTimeout(spawn, 3000);
}

function drawShootingStars(ctx) {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;

    if (s.life <= 0) { shootingStars.splice(i, 1); continue; }

    const angle = Math.atan2(s.vy, s.vx);
    const tailX = s.x - Math.cos(angle) * s.len;
    const tailY = s.y - Math.sin(angle) * s.len;

    const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
    grad.addColorStop(0, 'rgba(240,240,244,0)');
    grad.addColorStop(1, `rgba(240,240,244,${s.life * 0.8})`);

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(s.x, s.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240,240,244,${s.life})`;
    ctx.fill();
    ctx.restore();
  }
}

/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
function initScrollProgress() {
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }, { passive: true });
}

/* =============================================
   IntersectionObserver — Section animations
   ============================================= */
function initSectionObserver() {
  const els = $$('.anim-section');

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = (e.target.dataset.delay || 0) * 0.2;
          e.target.style.transitionDelay = delay + 's';
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => obs.observe(el));

  // Counter animation for stat numbers
  const statNums = $$('.stat-number[data-target]');
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCounter(e.target, parseInt(e.target.dataset.target));
          counterObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNums.forEach((el) => counterObs.observe(el));
}

function animateCounter(el, target) {
  let current = 0;
  const duration = 1200;
  const steps = 40;
  const stepVal = target / steps;
  let step = 0;

  const interval = setInterval(() => {
    step++;
    current = Math.min(Math.round(stepVal * step), target);
    el.textContent = current;
    if (step >= steps) {
      el.textContent = target;
      clearInterval(interval);
    }
  }, duration / steps);
}

/* =============================================
   PARALLAX
   ============================================= */
function initParallax() {
  const bgs = $$('.parallax-bg');

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      bgs.forEach((bg) => {
        const rect = bg.closest('.section').getBoundingClientRect();
        const yOff = rect.top * 0.25;
        bg.style.transform = `translateY(${yOff}px)`;
      });
    });
  }, { passive: true });
}

/* =============================================
   TEAL LINE DRAW
   ============================================= */
function initTealLine() {
  if (!tealLine) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tealLine.classList.add('drawn');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  obs.observe(tealLine);
}

/* =============================================
   DYNAMIC PAGE TITLES — changes per section
   ============================================= */
function initPageTitles() {
  const titles = {
    'hero': 'Project: Ask Her Out 🚀',
    'distance': '40 Light Years · Project Hail Mary',
    'transmission': 'Mission Log · Entry 001',
    'meetRocky': 'Meet Rocky · Tau Ceti',
    'theAsk': `${HER_NAME}? · Priority Alpha`,
    'footer': 'Mission Complete 🌟',
  };

  const sections = Object.keys(titles)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          document.title = titles[e.target.id];
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((s) => obs.observe(s));
}

/* =============================================
   KEYBOARD SHORTCUTS — Y key accepts mission
   ============================================= */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'y' || e.key === 'Y') && !acceptedMsg.classList.contains('show')) {
      const ask = document.getElementById('theAsk');
      const rect = ask.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        $('#btnYes').click();
      }
    }
  });
}

/* =============================================
   BTN-PILL SCROLL HIDE — hide after hero
   ============================================= */
function initBtnPillScrollHide() {
  const pill = $('#beginMission');
  const hero = document.getElementById('hero');
  window.addEventListener('scroll', () => {
    if (hero.getBoundingClientRect().bottom < 0) {
      pill.classList.add('hidden-scroll');
    } else {
      pill.classList.remove('hidden-scroll');
    }
  }, { passive: true });
}

/* =============================================
   ROCKY TOOLTIP AUTO-SHOW — brief flash on enter
   ============================================= */
function initRockyTooltipAutoShow() {
  const tooltip = $('#rockyTooltip');
  const section = document.getElementById('meetRocky');
  if (!tooltip || !section) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          obs.unobserve(e.target);
          setTimeout(() => {
            tooltip.classList.add('auto-show');
            setTimeout(() => {
              tooltip.classList.remove('auto-show');
            }, 2500);
          }, 1200);
        }
      });
    },
    { threshold: 0.4 }
  );
  obs.observe(section);
}

/* =============================================
   ASK HEADING — TYPEWRITER EFFECT
   ============================================= */
function initAskTypewriter() {
  const line1El = $('#typewriterLine1');
  const line2El = $('#typewriterLine2');
  const nameEl  = $('#askNameDisplay');
  const heading = $('#askHeading');

  const lines = [
    { el: line1El, text: 'Will you join me' },
    { el: line2El, text: 'on this mission,' },
    { el: nameEl,  text: `${HER_NAME}?` },
  ];

  let started = false;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          obs.unobserve(e.target);
          runTypewriter(lines);
        }
      });
    },
    { threshold: 0.15 }
  );
  obs.observe(heading);
}

function runTypewriter(lines) {
  let lineIdx = 0;
  let charIdx = 0;
  let cursor = null;

  function createCursor(parentEl) {
    if (cursor) cursor.remove();
    cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    parentEl.appendChild(cursor);
  }

  function type() {
    if (lineIdx >= lines.length) {
      if (cursor) cursor.remove();
      $('#askNameDisplay').classList.add('glowing');
      return;
    }

    const { el, text } = lines[lineIdx];

    if (charIdx === 0) {
      createCursor(el);
    }

    if (charIdx <= text.length) {
      el.textContent = '';
      el.appendChild(document.createTextNode(text.substring(0, charIdx)));
      el.appendChild(cursor);
      playTypewriterThud();
      charIdx++;
      setTimeout(type, 50 + Math.random() * 30);
    } else {
      if (cursor) cursor.remove();
      el.textContent = text;
      lineIdx++;
      charIdx = 0;
      setTimeout(type, 300);
    }
  }

  type();
}

/* =============================================
   SPARKLE TRAIL — teal particles near Rocky
   ============================================= */
function initSparkleTrail() {
  if (!sparkleCvs || window.matchMedia('(max-width: 768px)').matches) return;

  const rockySection = $('#meetRocky');
  const ctx = sparkleCvs.getContext('2d');
  const sparkles = [];

  function resize() {
    sparkleCvs.width  = rockySection.offsetWidth;
    sparkleCvs.height = rockySection.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  rockySection.addEventListener('mousemove', (e) => {
    const rect = rockySection.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    for (let i = 0; i < 3; i++) {
      sparkles.push({
        x: mx + (Math.random() - 0.5) * 20,
        y: my + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        r: Math.random() * 3 + 1,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
      });
    }
  });

  function draw() {
    ctx.clearRect(0, 0, sparkleCvs.width, sparkleCvs.height);

    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
      s.r *= 0.98;

      if (s.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = s.life;
      ctx.fillStyle = '#00f5d4';
      ctx.shadowColor = '#00f5d4';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

/* =============================================
   CONFETTI CANVAS — ResizeObserver
   ============================================= */
function initConfettiResize() {
  if (!confettiCvs || typeof ResizeObserver === 'undefined') return;
  const section = confettiCvs.closest('.section');
  const ro = new ResizeObserver(() => {
    confettiCvs.width  = section.offsetWidth;
    confettiCvs.height = section.offsetHeight;
  });
  ro.observe(section);
}

/* =============================================
   ASK BUTTONS — ESCALATING CHAOS
   ============================================= */
function initAskButtons() {
  let noAttempts = 0;
  let noDodging = false;
  const spawnContainer = $('#spawnedButtons');

  const noMessages = [
    'Maybe not...',
    'Are you sure? \uD83E\uDD14',
    'Really though?? \uD83D\uDE33',
    'You can\'t escape! \uD83D\uDE02',
    'RESISTANCE IS FUTILE \uD83D\uDE08',
    'Last chance...',
    'Fine, I\'ll go \uD83D\uDE24',
  ];

  const yesTexts = [
    'Please? \uD83E\uDD7A', 'Pretty please? \uD83D\uDE4F', 'Say yes! \u2728',
    'Come onnn \uD83D\uDE80', 'You know you want to \uD83D\uDE0F', 'Rocky says yes! \uD83E\uDEA8',
    'Do it for science! \uD83D\uDD2C', 'YESSS \uD83D\uDCAB', 'Just click me! \uD83C\uDFAC',
    'Yes yes yes! \uD83C\uDF89', 'One small click... \uD83C\uDF19', 'Houston says yes! \uD83D\uDEF8',
    'For Rocky! \uD83D\uDC7D', 'SAY YES \uD83D\uDD25', 'click me click me! \u2B50',
    'YES \uD83D\uDE80', 'yes? \uD83E\uDD7A', 'YES! \uD83C\uDF1F', 'yesyesyes', 'Y E S',
    'DO IT \uD83D\uDCAA', 'Accept mission! \uD83D\uDC68\u200D\uD83D\uDE80', 'Tap here! \uD83D\uDC46',
  ];

  function spawnYesButtons(count, floating) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const btn = document.createElement('button');
        btn.className = floating ? 'spawned-yes floating' : 'spawned-yes';
        btn.textContent = yesTexts[Math.floor(Math.random() * yesTexts.length)];
        btn.style.animationDelay = (i * 0.08) + 's';
        btn.addEventListener('click', triggerYes);

        if (floating) {
          btn.style.left = (10 + Math.random() * 75) + 'vw';
          btn.style.top = (10 + Math.random() * 75) + 'vh';
          btn.style.fontSize = (14 + Math.random() * 10) + 'px';
          document.body.appendChild(btn);
        } else {
          spawnContainer.appendChild(btn);
        }
        playPop();
      }, i * 100);
    }
  }

  let dodgeCooldown = false;

  function handleNoProximity(e) {
    if (noDodging || dodgeCooldown) return;
    const rect = btnNo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 80) {
      dodgeCooldown = true;
      dodgeNo();
      setTimeout(() => { dodgeCooldown = false; }, 800);
    }
  }

  function dodgeNo() {
    noAttempts++;
    playWhoosh();

    // Stage 7+: Transform into surrender button
    if (noAttempts >= 7) {
      noDodging = true;
      btnNo.classList.remove('dodging', 'shrinking', 'tiny');
      btnNo.style = '';
      btnNo.textContent = 'Fine, I\'ll go \uD83D\uDE24';
      btnNo.style.background = 'var(--teal)';
      btnNo.style.color = 'var(--black)';
      btnNo.style.borderColor = 'var(--teal)';
      btnNo.style.fontSize = '20px';
      btnNo.style.minWidth = '250px';
      
      // Return it to the button container
      const container = $('#askButtons');
      if (container) container.appendChild(btnNo);
      
      btnNo.onclick = () => triggerYes();
      document.removeEventListener('mousemove', handleNoProximity);
      return;
    }

    // Dodge the button (append to body so fixed positioning ignores ancestor transforms)
    if (btnNo.parentElement !== document.body) {
      document.body.appendChild(btnNo);
    }
    btnNo.classList.add('dodging');
    const pad = 20;
    const w = btnNo.offsetWidth;
    const h = btnNo.offsetHeight;
    const maxX = window.innerWidth - w - pad;
    const maxY = window.innerHeight - h - pad;
    btnNo.style.left = Math.max(pad, Math.random() * maxX) + 'px';
    btnNo.style.top  = Math.max(pad, Math.random() * maxY) + 'px';

    // Update text
    btnNo.textContent = noMessages[Math.min(noAttempts, noMessages.length - 1)];

    // Escalation stages
    if (noAttempts === 2) {
      // Spawn 3 inline yes buttons
      spawnYesButtons(3, false);
    } else if (noAttempts === 3) {
      // Spawn 5 more + screen shake
      spawnYesButtons(5, false);
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    } else if (noAttempts === 4) {
      // Spawn 4 floating buttons around the screen
      btnNo.classList.add('shrinking');
      spawnYesButtons(4, true);
    } else if (noAttempts === 5) {
      // Even more floating chaos
      btnNo.classList.add('tiny');
      spawnYesButtons(6, true);
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    } else if (noAttempts === 6) {
      // MAXIMUM CHAOS — flood the screen
      spawnYesButtons(10, true);
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 600);
    }
  }

  document.addEventListener('mousemove', handleNoProximity);

  // Mobile: click dodge
  btnNo.addEventListener('click', () => {
    if (noDodging) return;
    dodgeNo();
  });

  // YES
  btnYes.addEventListener('click', triggerYes);

  function triggerYes() {
    // White flash
    const flash = document.createElement('div');
    flash.className = 'flash-overlay';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);

    // Hide ask content
    askContent.style.opacity = '0';
    askContent.style.pointerEvents = 'none';

    playSuccessChime();

    // Remove dodge button if floating
    btnNo.style.display = 'none';

    // Remove all spawned buttons
    document.querySelectorAll('.spawned-yes').forEach(b => b.remove());
    if (spawnContainer) spawnContainer.innerHTML = '';

    // Show accepted message
    setTimeout(() => {
      acceptedMsg.classList.add('show');

      // Animate countdown
      const cdEl = $('#countdownDays');
      if (cdEl && cdEl.dataset.target) {
        animateCounter(cdEl, parseInt(cdEl.dataset.target));
      }
    }, 400);

    // Confetti
    launchConfetti();

    // Warp speed starfield
    warpSpeed();

    // Clean up
    noDodging = true;
    document.removeEventListener('mousemove', handleNoProximity);
    document.removeEventListener('mousemove', handleNoProximity);
  }
}

/* =============================================
   CONFETTI + STARS
   ============================================= */
function launchConfetti() {
  const section = confettiCvs.closest('.section');
  const ctx = confettiCvs.getContext('2d');
  confettiCvs.width  = section.offsetWidth;
  confettiCvs.height = section.offsetHeight;

  const COLORS = ['#ffd700', '#00f5d4', '#f0f0f0', '#ffe89a', '#38d9a9', '#ffd96a'];
  const particles = [];

  for (let i = 0; i < 200; i++) {
    const isStar = Math.random() > 0.5;
    particles.push({
      x: confettiCvs.width / 2 + (Math.random() - 0.5) * 100,
      y: confettiCvs.height / 2 + (Math.random() - 0.5) * 100,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 5,
      w: isStar ? 0 : Math.random() * 10 + 4,
      h: isStar ? 0 : Math.random() * 6 + 2,
      r: isStar ? Math.random() * 3 + 1 : 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 15,
      alpha: 1,
      isStar,
      grav: 0.1 + Math.random() * 0.08,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, confettiCvs.width, confettiCvs.height);
    let alive = false;

    for (const p of particles) {
      p.x += p.vx;
      p.vy += p.grav;
      p.y += p.vy;
      p.vx *= 0.98;
      p.rot += p.rotV;
      p.alpha -= 0.003;
      if (p.alpha <= 0) continue;
      alive = true;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);

      if (p.isStar) {
        drawStar(ctx, 0, 0, 5, p.r * 2.5, p.r, p.color);
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    }

    frame++;
    if (alive && frame < 500) requestAnimationFrame(draw);
  }

  draw();
}

function drawStar(ctx, cx, cy, spikes, outerR, innerR, color) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/* =============================================
   WARP SPEED EFFECT
   ============================================= */
function warpSpeed() {
  const ctx = starfield.getContext('2d');
  const cx = starfield.width / 2;
  const cy = starfield.height / 2;
  const warpStars = [];

  for (let i = 0; i < 300; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 50;
    warpStars.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: Math.cos(angle) * (3 + Math.random() * 8),
      vy: Math.sin(angle) * (3 + Math.random() * 8),
      len: Math.random() * 20 + 10,
      alpha: 1,
    });
  }

  let frame = 0;
  const maxFrames = 120;

  function draw() {
    ctx.fillStyle = 'rgba(3, 0, 8, 0.15)';
    ctx.fillRect(0, 0, starfield.width, starfield.height);

    for (const s of warpStars) {
      s.x += s.vx;
      s.y += s.vy;
      s.vx *= 1.03;
      s.vy *= 1.03;

      const angle = Math.atan2(s.vy, s.vx);
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      const lineLen = Math.min(speed * 2, 60);

      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
      ctx.strokeStyle = '#f0f0f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(angle) * lineLen, s.y - Math.sin(angle) * lineLen);
      ctx.stroke();
      ctx.restore();
    }

    frame++;
    if (frame < maxFrames) requestAnimationFrame(draw);
  }

  draw();
}

/* =============================================
   AUDIO TOGGLE
   ============================================= */
function initAudioToggle() {
  const btn = $('#audioToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    audioMuted = !audioMuted;

    const iconOn = $('#audioIconOn');
    const iconOff = $('#audioIconOff');

    if (audioMuted) {
      if (ambientGain && ambientCtx) {
        ambientGain.gain.linearRampToValueAtTime(0, ambientCtx.currentTime + 0.3);
      }
      if ($('#bgMusic')) $('#bgMusic').muted = true;
      iconOn.classList.add('hidden');
      iconOff.classList.remove('hidden');
    } else {
      if (ambientGain && ambientCtx) {
        ambientGain.gain.linearRampToValueAtTime(0.15, ambientCtx.currentTime + 0.3);
      }
      if ($('#bgMusic')) $('#bgMusic').muted = false;
      iconOn.classList.remove('hidden');
      iconOff.classList.add('hidden');
    }
  });
}

/* =============================================
   ROCKY EASTER EGG — click 5 times
   ============================================= */
function initRockyEasterEgg() {
  const rocky = $('#rockyFloat');
  if (!rocky) return;

  let clickCount = 0;
  const messages = [
    'Rocky noticed you! \uD83D\uDC40',
    'Rocky is curious... \uD83E\uDD14',
    'Rocky likes you! \u2B50',
    'Rocky is impressed! \uD83C\uDF1F',
    '\u2728 ROCKY APPROVES THIS MISSION! \u2728',
  ];

  rocky.addEventListener('click', () => {
    clickCount++;

    rocky.classList.remove('spin-crazy');
    void rocky.offsetWidth;
    rocky.classList.add('spin-crazy');
    setTimeout(() => rocky.classList.remove('spin-crazy'), 500);

    if (clickCount <= messages.length) {
      const existing = document.querySelector('.rocky-secret-msg');
      if (existing) existing.remove();

      const msg = document.createElement('div');
      msg.className = 'rocky-secret-msg';
      msg.textContent = messages[clickCount - 1];
      rocky.closest('.rocky-float-wrapper').appendChild(msg);

      setTimeout(() => msg.remove(), 2500);
    }

    if (clickCount >= messages.length) {
      setTimeout(() => { clickCount = 0; }, 3000);
    }
  });
}
