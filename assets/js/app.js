/**
 * Portfolio Interactive Controller
 * Handles SPA navigation, IntersectionObserver active links, and certificate filtering.
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Navigation Active State Observer
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // 2. Mobile Nav Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.querySelector('.nav-links');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-open');
    });

    // Close menu on link click
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Certificates Toggle & Real-time Filter
  const toggleCertBtn = document.getElementById('toggleCertificates');
  const allCertificatesSection = document.getElementById('allCertificates');
  const certSearchInput = document.getElementById('certSearch');
  const certFilterPills = document.querySelectorAll('.filter-pill');
  const certCards = document.querySelectorAll('.catalogue-card');

  if (toggleCertBtn && allCertificatesSection) {
    toggleCertBtn.addEventListener('click', () => {
      const isHidden = allCertificatesSection.classList.contains('hidden');
      allCertificatesSection.classList.toggle('hidden');
      toggleCertBtn.textContent = isHidden ? 'Hide Additional Certificates' : 'Explore All 30+ Certificates';
      toggleCertBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');

      if (isHidden) {
        allCertificatesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Certificate filtering function
  function filterCertificates() {
    const query = certSearchInput ? certSearchInput.value.toLowerCase().trim() : '';
    const activePill = document.querySelector('.filter-pill.active');
    const selectedCategory = activePill ? activePill.dataset.category : 'all';

    certCards.forEach((card) => {
      const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
      const items = Array.from(card.querySelectorAll('li')).map(li => li.textContent.toLowerCase()).join(' ');
      const category = card.dataset.category || '';

      const matchesQuery = !query || title.includes(query) || items.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

      if (matchesQuery && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (certSearchInput) {
    certSearchInput.addEventListener('input', filterCertificates);
  }

  if (certFilterPills.length > 0) {
    certFilterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        certFilterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        filterCertificates();
      });
    });
  }

  // 4. Subtle Profile Glow Effect on Scroll
  const profilePhoto = document.querySelector('.profile-photo');
  if (profilePhoto) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 600) {
        profilePhoto.style.transform = `scale(${1 + scrollY * 0.0002}) rotate(${scrollY * 0.015}deg)`;
      }
    }, { passive: true });
  }
});
