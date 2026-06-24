/* ========== NAVBAR SCROLL EFFECT ========== */
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  // Navbar background on scroll
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link based on scroll position
  let current = '';
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

/* ========== HAMBURGER MENU ========== */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksContainer.classList.toggle('open');
  // Lock body scroll when mobile menu is open
  document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
});

// Close menu when clicking a link
navLinksContainer.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ========== SCROLL REVEAL ANIMATION ========== */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ========== SKILL BAR ANIMATION ON SCROLL ========== */
const skillBars = document.querySelectorAll('.skill-progress');

const barObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Force reflow then set width via the existing CSS class
        const bar = entry.target;
        const width = window.getComputedStyle(bar).width;
        bar.style.width = '0';
        requestAnimationFrame(() => {
          bar.style.width = width;
        });
        barObserver.unobserve(bar);
      }
    });
  },
  { threshold: 0.3 }
);

skillBars.forEach((bar) => barObserver.observe(bar));

/* ========== CONTACT FORM - SUPABASE ========== */
const SUPABASE_URL = 'https://mlcalpcztrhgwmajnjyr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sY2FscGN6dHJoZ3dtYWpuanlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTc3MjUsImV4cCI6MjA5Njg3MzcyNX0.5l6w2Z-quNUN0RXybZxn560k_oY2cm9XISITOuVhdmA';

const contactForm = document.getElementById('contactForm');
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);

let toastTimeout;

function showToast(message, isError = false) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');
  if (isError) {
    toast.style.borderColor = '#ef4444';
  } else {
    toast.style.borderColor = 'var(--accent)';
  }
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = contactForm.querySelector('input[type="text"]').value.trim();
  const email = contactForm.querySelector('input[type="email"]').value.trim();
  const message = contactForm.querySelector('textarea').value.trim();

  if (!name || !email || !message) {
    showToast('⚠️ Harap isi semua bidang.', true);
    return;
  }

  // Disable button while sending
  const btn = contactForm.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  btn.disabled = true;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to send message');
    }

    showToast('✅ Pesan berhasil dikirim! Terima kasih!');
    contactForm.reset();
  } catch (err) {
    console.error('Supabase error:', err);
    if (err.message.includes('relation') || err.message.includes('does not exist')) {
      showToast('⚠️ Tabel database belum dibuat. Silakan buat tabel "contacts" di Supabase.', true);
    } else {
      showToast('⚠️ Gagal mengirim pesan. Silakan coba lagi nanti.', true);
    }
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
});

/* ========== CUSTOM CURSOR ========== */
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
  .custom-cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--accent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background 0.2s;
    mix-blend-mode: difference;
  }
  .custom-cursor.hover {
    width: 40px;
    height: 40px;
    background: rgba(124, 58, 237, 0.15);
    border-color: var(--primary);
  }
`;

document.head.appendChild(cursorStyle);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Hover effect on interactive elements
const interactiveEls = document.querySelectorAll(
  'a, button, .btn, .skill-card, .project-card, .contact-item'
);

interactiveEls.forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* Hide cursor on certain elements / touch devices */
if ('ontouchstart' in window) {
  cursor.style.display = 'none';
}

/* ========== PARALLAX TILT ON HERO AVATAR ========== */
const avatarBox = document.querySelector('.avatar-box');

if (avatarBox) {
  document.querySelector('.hero-visual').addEventListener('mousemove', (e) => {
    const rect = avatarBox.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = -(y / rect.height) * 20;
    const rotateY = (x / rect.width) * 20;
    avatarBox.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.querySelector('.hero-visual').addEventListener('mouseleave', () => {
    avatarBox.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
  });
}

/* ========== TYPED.JS TYPING EFFECT ========== */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    new Typed('.typing', {
      strings: [
        'Pengembang Kreatif',
        'UI/UX Designer',
        'Frontend Enthusiast',
        'Code Artist',
      ],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: '|',
    });
  }, 1500); // delay to let hero animation finish first
});

/* ========== FAQ ACCORDION ========== */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    // Close other items
    faqItems.forEach((other) => {
      if (other !== item && other.classList.contains('open')) {
        other.classList.remove('open');
      }
    });
    // Toggle current
    item.classList.toggle('open');
  });
});

console.log('🚀 Night02 Portfolio — Ready!');
