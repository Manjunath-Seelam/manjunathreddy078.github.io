/**
 * Spatial 3D Parallax & Glassmorphic Tilt Engine
 * High-performance 60fps cursor-driven 3D perspective and dynamic glare reflection.
 */
(function() {
  'use strict';

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouchDevice || prefersReducedMotion) {
    return; // Touch devices and reduced-motion users get crisp static glassmorphism
  }

  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach((card) => {
    // Add specular glare overlay if not present
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    let bounds = null;
    let isHovered = false;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let animFrame = null;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      isHovered = true;
      card.classList.add('is-tilting');
      render();
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;

      const px = (x / bounds.width - 0.5) * 2; // -1 to 1
      const py = (y / bounds.height - 0.5) * 2; // -1 to 1

      // Max tilt degrees
      const maxTilt = 12;
      targetRotateX = -py * maxTilt;
      targetRotateY = px * maxTilt;

      // Update glare spot coordinates
      card.style.setProperty('--glare-x', `${(x / bounds.width) * 100}%`);
      card.style.setProperty('--glare-y', `${(y / bounds.height) * 100}%`);
      card.style.setProperty('--glare-opacity', '0.75');
    }

    function onMouseLeave() {
      isHovered = false;
      targetRotateX = 0;
      targetRotateY = 0;
      card.style.setProperty('--glare-opacity', '0');
      card.classList.remove('is-tilting');
    }

    function render() {
      currentRotateX += (targetRotateX - currentRotateX) * 0.12;
      currentRotateY += (targetRotateY - currentRotateY) * 0.12;

      card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      if (isHovered || Math.abs(currentRotateX) > 0.05 || Math.abs(currentRotateY) > 0.05) {
        animFrame = requestAnimationFrame(render);
      } else {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }

    card.addEventListener('mouseenter', onMouseEnter, { passive: true });
    card.addEventListener('mousemove', onMouseMove, { passive: true });
    card.addEventListener('mouseleave', onMouseLeave, { passive: true });
  });
})();
