// 味潭龙韵 · 主交互脚本

document.addEventListener('DOMContentLoaded', () => {

  // ===== 导航滚动效果 =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ===== 汉堡菜单 =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('active');
    });
  });

  // ===== 菜品分类切换 =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      menuCards.forEach(card => {
        if (card.dataset.category === target) {
          card.style.display = 'block';
          card.classList.remove('fade-up');
          void card.offsetWidth;
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== 滚动入场动画 =====
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  fadeEls.forEach(el => observer.observe(el));

  // ===== 自动给各 section 内容添加 fade-up =====
  const animTargets = document.querySelectorAll(
    '.section-header, .about-text, .about-logo-area, .seasonal-card, .menu-card, .room-card, .contact-card, .stat'
  );
  animTargets.forEach((el, i) => {
    el.classList.add('fade-up');
    el.dataset.delay = (i % 4) * 80;
    observer.observe(el);
  });

  // ===== 浮动粒子背景 (Hero) =====
  createParticles();

  // ===== 平滑滚动到锚点 =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#meituan-link') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// ===== 浮动粒子 =====
function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
  hero.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // 粒子类型：小圆点 + 菱形
  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speed = Math.random() * 0.5 + 0.15;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.drift = (Math.random() - 0.5) * 0.3;
      this.type = Math.random() > 0.7 ? 'diamond' : 'circle';
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = Math.random() > 0.5 ? '#E8B84B' : '#C9980A';
      if (this.type === 'diamond') {
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-this.size, -this.size, this.size * 2, this.size * 2);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.opacity += (Math.random() - 0.5) * 0.01;
      this.opacity = Math.max(0.05, Math.min(0.6, this.opacity));
      if (this.y < -10) this.reset(false);
    }
  }

  for (let i = 0; i < 70; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
}
