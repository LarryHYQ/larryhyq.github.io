/* Date navigation for the Blog archive; no dependency on the global JS bundle. */
(() => {
  const archive = document.querySelector('[data-blog-archive]');
  if (!archive) return;

  const posts = Array.from(archive.querySelectorAll('[data-blog-post]'));
  const track = archive.querySelector('[data-timeline-track]');
  const currentDate = archive.querySelector('[data-timeline-current]');
  const monthLinks = document.querySelectorAll('[data-timeline-month]');
  const yearLinks = archive.querySelectorAll('[data-timeline-year]');
  const timeline = archive.querySelector('.blog-timeline');
  const mobile = window.matchMedia('(max-width: 767px)');
  const tickById = new Map(Array.from(archive.querySelectorAll('[data-timeline-post]'))
    .map(link => [link.dataset.timelinePost, link]));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const container = archive.closest('.archive--blog');
  const masthead = document.querySelector('.masthead');
  let positions = [];
  let activePost = null;
  let scheduled = false;
  let hideTimer;
  const pointers = new Set();

  // Keep the rail available throughout a touch gesture or keyboard interaction.
  const hideWhenIdle = () => {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (!pointers.size && !timeline.contains(document.activeElement)) {
        timeline.classList.remove('is-visible');
      }
    }, 1400);
  };
  const showTimeline = () => {
    if (!mobile.matches) return;
    timeline.classList.add('is-visible');
    hideWhenIdle();
  };
  timeline.classList.add('is-enhanced');

  const measure = () => {
    if (masthead) container.style.setProperty('--blog-masthead-height', `${masthead.getBoundingClientRect().height}px`);
    positions = posts.map(post => post.getBoundingClientRect().top + window.scrollY);
  };

  const revealTick = tick => {
    if (!tick || !track.clientHeight) return;
    const bounds = track.getBoundingClientRect();
    const yearHeader = track.querySelector('.blog-timeline__year.is-active');
    const visibleTop = bounds.top + (yearHeader?.offsetHeight || 0) + 8;
    const tickBounds = tick.getBoundingClientRect();
    if (tickBounds.top < visibleTop || tickBounds.bottom > bounds.bottom) {
      // Scroll only the index, never its document ancestors.
      track.scrollTop += tickBounds.top - visibleTop - (bounds.bottom - visibleTop - tickBounds.height) / 2;
    }
  };

  const update = () => {
    scheduled = false;
    if (track.getClientRects().length) {
      const top = parseFloat(window.getComputedStyle(track.parentElement).top);
      const bottom = mobile.matches ? window.innerHeight - 24 : Math.min(window.innerHeight - 24, archive.getBoundingClientRect().bottom);
      const available = bottom - top - track.offsetTop;
      // Keep the year/date header visible as the footer enters the viewport.
      const height = `${Math.max(80, mobile.matches ? Math.min(window.innerHeight * 0.48, available) : available)}px`;
      if (track.style.maxHeight !== height) track.style.maxHeight = height;
    }
    const threshold = window.scrollY + Math.min(window.innerHeight * 0.25, 160);
    let index = 0;
    for (let i = 0; i < positions.length; i += 1) {
      if (positions[i] > threshold) break;
      index = i;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      index = posts.length - 1;
    }
    const post = posts[index];
    if (!post) return;
    if (post === activePost) {
      revealTick(tickById.get(post.id));
      return;
    }

    if (activePost) {
      const previous = tickById.get(activePost.id);
      previous?.classList.remove('is-active');
      previous?.removeAttribute('aria-current');
    }
    activePost = post;
    const tick = tickById.get(post.id);
    tick?.classList.add('is-active');
    tick?.setAttribute('aria-current', 'location');
    currentDate.textContent = post.dataset.date;
    currentDate.dateTime = post.dataset.date;
    monthLinks.forEach(link => link.classList.toggle('is-active', link.dataset.timelineMonth === post.dataset.month));
    yearLinks.forEach(link => link.classList.toggle('is-active', link.dataset.timelineYear === post.dataset.year));

    revealTick(tick);
  };

  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };

  const navigate = event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    // The theme also attaches a smooth-scroll handler to every anchor.
    event.stopPropagation();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    showTimeline();
  };

  timeline.addEventListener('click', navigate, true);
  timeline.addEventListener('pointerdown', event => {
    pointers.add(event.pointerId);
    showTimeline();
  });
  const releasePointer = event => {
    if (pointers.delete(event.pointerId)) hideWhenIdle();
  };
  window.addEventListener('pointerup', releasePointer, { passive: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true });
  timeline.addEventListener('focusin', showTimeline);
  timeline.addEventListener('focusout', hideWhenIdle);
  track.addEventListener('scroll', showTimeline, { passive: true });
  timeline.addEventListener('wheel', showTimeline, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') showTimeline();
    if (event.key === 'Escape' && mobile.matches) {
      if (timeline.contains(document.activeElement) && activePost) {
        activePost.setAttribute('tabindex', '-1');
        activePost.focus({ preventScroll: true });
      }
      timeline.classList.remove('is-visible');
    }
  });
  window.addEventListener('scroll', () => { showTimeline(); scheduleUpdate(); }, { passive: true });
  window.addEventListener('resize', () => { measure(); scheduleUpdate(); });
  window.addEventListener('load', () => { measure(); scheduleUpdate(); });
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('popstate', scheduleUpdate);
  window.addEventListener('pageshow', event => {
    const navigation = window.performance.getEntriesByType('navigation')[0];
    if (event.persisted || navigation?.type === 'back_forward') return;
    // The theme adds footer spacing after DOM ready. Restore a direct link once
    // that layout has settled, including links near the end of the archive.
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      let id;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target || !archive.contains(target)) return;
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      measure();
      update();
    }));
  });
  document.fonts?.ready.then(() => { measure(); scheduleUpdate(); });
  measure();
  update();
})();
