// ============================================================
// Northwood Public School — site interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu after choosing a link
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Bell button ---------- */
  const bellBtn = document.getElementById('bellBtn');
  const bellToast = document.getElementById('bellToast');
  let toastTimer = null;

  bellBtn.addEventListener('click', () => {
    bellBtn.classList.remove('is-ringing');
    // force reflow so the animation can restart on repeat clicks
    void bellBtn.offsetWidth;
    bellBtn.classList.add('is-ringing');

    bellToast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      bellToast.classList.remove('is-visible');
    }, 2600);
  });

  /* ---------- Academics tabs ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      tabPanels.forEach(panel => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });
    });
  });

  /* ---------- Inquiry form validation ---------- */
  const form = document.getElementById('inquiryForm');
  const successMsg = document.getElementById('formSuccess');

  const showFieldError = (fieldName, message) => {
    const errorEl = form.querySelector(`[data-error-for="${fieldName}"]`);
    const row = errorEl ? errorEl.closest('.form-row') : null;
    if (errorEl) errorEl.textContent = message;
    if (row) row.classList.toggle('has-error', Boolean(message));
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMsg.textContent = '';

    const name = form.parentName.value.trim();
    const email = form.parentEmail.value.trim();
    const grade = form.gradeInterest.value;

    let valid = true;

    if (!name) {
      showFieldError('parentName', 'Let us know who to call back.');
      valid = false;
    } else {
      showFieldError('parentName', '');
    }

    if (!email) {
      showFieldError('parentEmail', 'We need an email to reach you.');
      valid = false;
    } else if (!isValidEmail(email)) {
      showFieldError('parentEmail', 'That email doesn\u2019t look quite right.');
      valid = false;
    } else {
      showFieldError('parentEmail', '');
    }

    if (!grade) {
      showFieldError('gradeInterest', 'Pick the grade you\u2019re asking about.');
      valid = false;
    } else {
      showFieldError('gradeInterest', '');
    }

    if (!valid) return;

    // No backend here — this simulates a successful submission.
    successMsg.textContent = `Thanks, ${name.split(' ')[0]} — the office will call you within two school days.`;
    form.reset();
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main, section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    let currentId = '';
    document.querySelectorAll('section[id]').forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        currentId = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-current', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

  /* ---------- Scroll reveal for cards ---------- */
  const revealTargets = document.querySelectorAll(
    '.value-card, .life-card, .pin-note, .subject-list'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = entry.target.classList.contains('pin-note')
            ? entry.target.style.transform
            : 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(el => {
      if (!el.classList.contains('pin-note')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(14px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      }
      observer.observe(el);
    });
  }
});
