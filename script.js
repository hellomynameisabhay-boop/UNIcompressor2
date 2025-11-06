// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
  });
}

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Particles background (Canvas) with parallax
(function () {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let width, height, particles, mouse = { x: 0, y: 0 };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initParticles();
  }

  function initParticles() {
    const count = Math.min(140, Math.floor(width * height / 15000));
    particles = new Array(count).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.6 + 0.4,
      h: Math.random() * 360
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    const mx = (mouse.x / width - 0.5) * 2;
    const my = (mouse.y / height - 0.5) * 2;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx + mx * 0.2;
      p.y += p.vy + my * 0.2;
      if (p.x < -5) p.x = width + 5; if (p.x > width + 5) p.x = -5;
      if (p.y < -5) p.y = height + 5; if (p.y > height + 5) p.y = -5;
      p.h += 0.3; if (p.h > 360) p.h -= 360;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.h}, 80%, 60%, 0.6)`;
      ctx.fill();
    }

    // Soft linking lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.strokeStyle = `rgba(140,160,255,${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  });
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(step);
})();

// Hero headline entrance
window.addEventListener('DOMContentLoaded', () => {
  const lines = document.querySelectorAll('.hero h1 .line');
  lines.forEach((el, i) => {
    el.animate([
      { transform: 'translateY(24px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ], {
      duration: 700,
      delay: 150 + i * 150,
      easing: 'cubic-bezier(.2,.8,.2,1)',
      fill: 'forwards'
    });
  });
});

// Scroll reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
  });
}, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

document.querySelectorAll('.feature-card, .chart').forEach(el => observer.observe(el));

// Animate chart bars when visible
const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const bar = entry.target.querySelector('.chart-bar');
    if (!bar) return;
    const value = Number(bar.dataset.value || '0');
    bar.style.setProperty('--w', value + '%');
    bar.animate([
      { width: '0%' },
      { width: value + '%' }
    ], { duration: 1200, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
  });
}, { threshold: 0.35 });

document.querySelectorAll('.chart').forEach(el => chartObserver.observe(el));

// Hero mockup parallax tilt
(() => {
  const win = document.getElementById('productWindow');
  if (!win) return;
  const parent = win.parentElement;
  function onMove(e) {
    const rect = parent.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    win.style.transform = `rotateX(${-(y)*10}deg) rotateY(${x*14}deg)`;
  }
  function reset() { win.style.transform = ''; }
  parent.addEventListener('mousemove', onMove);
  parent.addEventListener('mouseleave', reset);
})();

// Confetti on download + persistent counter (works across pages even without confetti canvas)
(() => {
  const btns = [document.getElementById('downloadBtn'), document.getElementById('downloadBtn2')].filter(Boolean);
  if (btns.length === 0) return;

  // Confetti setup if canvas exists
  const canvas = document.getElementById('confetti');
  const hasCanvas = Boolean(canvas);
  let ctx, dpr = 1, width = 0, height = 0, pieces = [], raf;
  const colors = ['#7C4DFF', '#18FFFF', '#A8FF60', '#FFD15C', '#FF6F91'];
  if (hasCanvas) {
    ctx = canvas.getContext('2d');
    dpr = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();
  }
  function burst(x, y) {
    if (!hasCanvas) return;
    for (let i = 0; i < 160; i++) {
      pieces.push({
        x, y,
        vx: (Math.random()*2-1)*6,
        vy: Math.random()*-8 - 4,
        g: Math.random()*0.3 + 0.18,
        s: Math.random()*6 + 2,
        r: Math.random()*Math.PI,
        vr: (Math.random()*2-1)*0.2,
        c: colors[(Math.random()*colors.length)|0],
        life: 180
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function loop() {
    if (!hasCanvas) return;
    ctx.clearRect(0,0,width,height);
    pieces.forEach(p => {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s/2, -p.s/2, p.s, p.s*0.6);
      ctx.restore();
    });
    pieces = pieces.filter(p => p.life > 0 && p.y < height + 40);
    if (pieces.length) raf = requestAnimationFrame(loop); else { cancelAnimationFrame(raf); raf = null; }
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const rect = btn.getBoundingClientRect();
      burst(rect.left + rect.width/2, rect.top + rect.height/2);
      // persistent download counter
      try {
        const key = 'downloadCount';
        const base = 57; // non-zero seed
        const prev = Number(localStorage.getItem(key) || base);
        const next = prev + 1;
        localStorage.setItem(key, String(next));
        document.querySelectorAll('[data-download-count]').forEach(el => el.textContent = String(next));
      } catch {}
    });
  });
})();

// Initialize persistent download counter on page load
(() => {
  try {
    const key = 'downloadCount';
    const base = 57;
    const value = Number(localStorage.getItem(key) || base);
    if (!localStorage.getItem(key)) localStorage.setItem(key, String(value));
    document.querySelectorAll('[data-download-count]').forEach(el => el.textContent = String(value));
  } catch {}
})();
// 3D scene camera tilt and gentle drift
(() => {
  const camera = document.getElementById('camera3d');
  const scene = document.getElementById('scene3d');
  if (!camera || !scene) return;
  let width = 0, height = 0;
  let targetRX = -6, targetRY = 8; // initial tilt
  let rx = targetRX, ry = targetRY;
  let vx = 0, vy = 0; // angular velocities for spring motion
  const stiffness = 0.08; // spring factor
  const damping = 0.12;   // friction
  let raf;
  let idle = true, t = 0, turbo = false;

  function resize() {
    const rect = scene.getBoundingClientRect();
    width = rect.width; height = rect.height;
  }

  function onMove(e) {
    const rect = scene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    targetRY = (x - 0.5) * 22; // yaw
    targetRX = -(y - 0.5) * 12; // pitch
  }

  function loop() {
    // critically damped-ish spring
    vx += (targetRX - rx) * stiffness; vx *= (1 - damping); rx += vx;
    vy += (targetRY - ry) * stiffness; vy *= (1 - damping); ry += vy;
    camera.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    // per-layer subtle parallax in X/Y via CSS variables (preserve base transforms)
    const layers = camera.querySelectorAll('.layer');
    layers.forEach((el) => {
      const depth = Number(el.getAttribute('data-depth') || '0');
      const intensity = turbo ? 3.2 : 2;
      const px = -ry * depth * intensity; // based on yaw
      const py = rx * depth * intensity;  // based on pitch
      el.style.setProperty('--px', px + 'px');
      el.style.setProperty('--py', py + 'px');
    });
    // idle orbit
    if (idle) {
      t += 0.008 * (turbo ? 2 : 1);
      targetRY = Math.sin(t) * 10;
      targetRX = Math.cos(t * 0.8) * 6 - 4;
    }
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  scene.addEventListener('mousemove', onMove);
  scene.addEventListener('mouseenter', () => { idle = false; });
  scene.addEventListener('mouseleave', () => { idle = true; });
  scene.addEventListener('dblclick', () => { turbo = !turbo; scene.classList.toggle('turbo', turbo); });
  resize();
  raf = requestAnimationFrame(loop);

  // Mobile tilt support
  window.addEventListener('deviceorientation', (e) => {
    if (e.beta == null || e.gamma == null) return;
    targetRX = Math.max(-14, Math.min(14, (e.beta - 45) * 0.35));
    targetRY = Math.max(-22, Math.min(22, e.gamma * 0.7));
  });

  // Cleanup on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(loop);
  });
})();


