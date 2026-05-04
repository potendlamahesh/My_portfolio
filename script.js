/* ═══════════════════════════════════════════════
   ALEX CARTER — PORTFOLIO  |  script.js
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {


  /* ── 2. NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active nav link
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
    });
    navLinks.forEach(l => {
      l.classList.remove('active');
      if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });

    // Back to top
    const bt = document.getElementById('backTop');
    if (window.scrollY > 400) bt.classList.add('show');
    else bt.classList.remove('show');
  });

  document.getElementById('backTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ── 3. HAMBURGER ── */
  const ham = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');
  ham.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
    ham.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinksList.classList.remove('open')));


  /* ── 4. REVEAL ON SCROLL ── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i % 4) * 0.08 + 's';
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObs.observe(el));


  /* ── 5. STAT COUNTER ── */
  const statNums = document.querySelectorAll('.stat-num');
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.target;
        let current = 0;
        const inc = target / 60;
        const timer = setInterval(() => {
          current += inc;
          if (current >= target) { el.textContent = target; clearInterval(timer); }
          else el.textContent = Math.floor(current);
        }, 24);
        statsObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(n => statsObs.observe(n));


  /* ── 6. SKILL BARS ── */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        skillsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  skillFills.forEach(f => skillsObs.observe(f));


  /* ── 7. SKILL TABS ── */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      // re-animate skill bars
      document.querySelectorAll('.skill-fill').forEach(f => {
        f.style.width = '0';
        setTimeout(() => { f.style.width = f.dataset.w + '%'; }, 50);
      });
    });
  });


  /* ── 8. PROJECT FILTER ── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp .5s both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ── 9. TESTIMONIAL SLIDER ── */
  /* ── 10. RADAR CHART (Canvas) ── */
  const canvas = document.getElementById('radarChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const SIZE = 320;
    const cx = SIZE / 2, cy = SIZE / 2, R = 110;
    const labels = ['Python', 'Machine Learning', 'NLP', 'FastAPI', 'AI Projects', 'Database'];
    const values = [0.95, 0.90, 0.88, 0.82, 0.85, 0.80];
    const colors = { blue: '#1a6cf5', orange: '#ff6b1a' };
    let progress = 0;

    function drawRadar(prog) {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const n = labels.length;
      const angles = labels.map((_, i) => (Math.PI * 2 * i / n) - Math.PI / 2);

      // Grid circles
      for (let r = 1; r <= 5; r++) {
        ctx.beginPath();
        angles.forEach((a, i) => {
          const x = cx + Math.cos(a) * R * r / 5;
          const y = cy + Math.sin(a) * R * r / 5;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.strokeStyle = '#e4e9f5';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Spokes
      angles.forEach(a => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.strokeStyle = '#e4e9f5';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Data polygon
      ctx.beginPath();
      angles.forEach((a, i) => {
        const r = R * values[i] * prog;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.closePath();

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      grad.addColorStop(0, 'rgba(26,108,245,0.5)');
      grad.addColorStop(1, 'rgba(255,107,26,0.25)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = colors.blue;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Dots
      angles.forEach((a, i) => {
        const r = R * values[i] * prog;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors.orange;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Labels
      ctx.font = '600 12px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      angles.forEach((a, i) => {
        const labelR = R + 22;
        const x = cx + Math.cos(a) * labelR;
        const y = cy + Math.sin(a) * labelR;
        ctx.fillStyle = '#0f1623';
        ctx.fillText(labels[i], x, y);
        // percentage
        ctx.font = '500 10px DM Sans, sans-serif';
        ctx.fillStyle = colors.blue;
        ctx.fillText(Math.round(values[i] * 100) + '%', x, y + 14);
        ctx.font = '600 12px DM Sans, sans-serif';
      });
    }

    // Animate on reveal
    const radarObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        let start = null;
        function animate(ts) {
          if (!start) start = ts;
          progress = Math.min((ts - start) / 1200, 1);
          drawRadar(progress);
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        radarObs.disconnect();
      }
    }, { threshold: 0.3 });
    radarObs.observe(canvas);
  }


  /* ── 11. CONTACT FORM ── */
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
      btn.disabled = false;
      this.reset();
      const success = document.getElementById('formSuccess');
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 4000);
    }, 1800);
  });


  /* ── 12. DOWNLOAD CV (demo) ── */
  document.getElementById("downloadCV").addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = "Mahesh_Resume.pdf";
  link.download = "Mahesh_Resume.pdf";
  link.click();
});


  /* ── 13. PARALLAX HERO SHAPES ── */


  /* ── 14. TYPED HERO SUBTITLE ── */
  const subLine = document.querySelector('.sub-line');
  const words = ['AI Developer', 'Machine Learning Engineer', 'Python Developer', 'Full Stack Developer'];
  let wi = 0, ci = 0, typing = true;

  function typeLoop() {
    const word = words[wi];
    if (typing) {
      subLine.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { typing = false; setTimeout(typeLoop, 2000); return; }
    } else {
      subLine.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { typing = true; wi = (wi + 1) % words.length; }
    }
    setTimeout(typeLoop, typing ? 80 : 40);
  }
  setTimeout(typeLoop, 1500);


  /* ── 15. SCROLL PROGRESS BAR ── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; z-index: 2000;
    background: linear-gradient(to right, #1a6cf5, #ff6b1a);
    width: 0%; transition: width .1s;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = pct + '%';
  });


  /* ── 16. SMOOTH SECTION HIGHLIGHT ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ── 17. FLOATING TECH BADGE TILT ── */
  const avatarFrame = document.querySelector('.avatar-frame');
  if (avatarFrame) {
    avatarFrame.addEventListener('mousemove', e => {
      const rect = avatarFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 15;
      const y = (e.clientY - rect.top - rect.height / 2) / 15;
      avatarFrame.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg)`;
    });
    avatarFrame.addEventListener('mouseleave', () => {
      avatarFrame.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg)';
      avatarFrame.style.transition = 'transform .6s ease';
    });
  }


  /* ── 18. PROJECT CARD TILT ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 20;
      const y = (e.clientY - rect.top - rect.height / 2) / 20;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s ease, box-shadow .4s ease';
    });
  });


  /* ── 19. DARK / LIGHT TOGGLE ── */
  const toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '🌙';
  toggleBtn.title = 'Toggle dark mode';
  toggleBtn.style.cssText = `
    position: fixed; bottom: 90px; right: 32px;
    width: 48px; height: 48px; border-radius: 50%;
    border: 2px solid #e4e9f5; background: #fff;
    font-size: 1.2rem; cursor: pointer; z-index: 900;
    box-shadow: 0 4px 20px rgba(0,0,0,.12);
    transition: all .3s; display: flex; align-items: center; justify-content: center;
  `;
  document.body.appendChild(toggleBtn);

  let dark = false;
  toggleBtn.addEventListener('click', () => {
    dark = !dark;
    if (dark) {
      document.documentElement.style.setProperty('--white', '#111827');
      document.documentElement.style.setProperty('--bg', '#0f1623');
      document.documentElement.style.setProperty('--surface', '#1c2536');
      document.documentElement.style.setProperty('--text', '#f1f5fd');
      document.documentElement.style.setProperty('--text-muted', '#8893b2');
      document.documentElement.style.setProperty('--border', '#2a3550');
      document.documentElement.style.setProperty('--blue-light', 'rgba(26,108,245,.15)');
      document.documentElement.style.setProperty('--orange-light', 'rgba(255,107,26,.12)');
      toggleBtn.innerHTML = '☀️';
    } else {
      document.documentElement.style.setProperty('--white', '#ffffff');
      document.documentElement.style.setProperty('--bg', '#f8f9fc');
      document.documentElement.style.setProperty('--surface', '#ffffff');
      document.documentElement.style.setProperty('--text', '#0f1623');
      document.documentElement.style.setProperty('--text-muted', '#6b7692');
      document.documentElement.style.setProperty('--border', '#e4e9f5');
      document.documentElement.style.setProperty('--blue-light', '#e8f0fe');
      document.documentElement.style.setProperty('--orange-light', '#fff0e8');
      toggleBtn.innerHTML = '🌙';
    }
  });


  

  console.log('%c👋 Welcome to Mahesh Portfolio!', 'font-size:24px;color:#1a6cf5;font-weight:bold');
  console.log('%c AI Developer | Python | Machine Learning', 'color:#ff6b1a;');

});
