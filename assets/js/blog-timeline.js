/* Shared archive/section navigation; no dependency on the global JS bundle. */
(() => {
  const archive = document.querySelector('[data-blog-archive], [data-section-archive]');
  if (!archive) return;

  // Build from rendered content so new papers and Interest headings join the
  // index automatically, without a second list of titles to maintain.
  if (archive.hasAttribute('data-section-archive')) {
    const content = archive.querySelector('[data-timeline-content]');
    const title = archive.dataset.timelineTitle;
    const nav = document.createElement('nav');
    nav.className = 'blog-timeline';
    nav.setAttribute('aria-label', `${title} navigation`);
    const track = document.createElement('div');
    track.className = 'blog-timeline__track';
    track.dataset.timelineTrack = '';
    nav.append(track);
    const makeLink = (className, target, label) => {
      const link = document.createElement('a');
      link.className = className;
      link.href = `#${target.id}`;
      link.textContent = label;
      return link;
    };
    const pageTitle = archive.closest('.archive').querySelector('.page__title');
    pageTitle.id ||= 'page-timeline-top';
    const header = makeLink('blog-timeline__year', pageTitle, title);
    header.dataset.timelineYear = title;
    track.append(header);
    let group = '';
    content.querySelectorAll(':scope > h2, :scope > h3, :scope > [data-timeline-entry]').forEach((entry, index) => {
      entry.id ||= `rail-entry-${index}`;
      if (entry.tagName === 'H2') {
        group = entry.id;
        const link = makeLink('blog-timeline__month', entry, entry.textContent.trim());
        if (title === 'Publication') {
          // Apply one wrapping rule to all present and future paper categories.
          link.setAttribute('aria-label', entry.textContent.trim());
          link.textContent = entry.textContent.trim().split(/\s+/).join('\n');
          link.classList.add('blog-timeline__month--stacked');
        }
        link.dataset.timelineMonth = group;
        track.append(link);
      } else {
        const heading = entry.querySelector('.archive__item-title') || entry;
        const label = heading.textContent.trim().replace(/:\s*$/, '');
        const link = makeLink('blog-timeline__tick', entry, '');
        link.dataset.timelinePost = entry.id;
        link.dataset.timelineLabel = label;
        link.setAttribute('aria-label', label);
        // Text is deliberately kept out of the compact rail, on both viewports.
        track.append(link);
      }
      entry.dataset.blogPost = '';
      entry.dataset.month = group;
      entry.dataset.year = title;
    });
    archive.append(nav);
  }

  const posts = Array.from(archive.querySelectorAll('[data-blog-post]'));
  const track = archive.querySelector('[data-timeline-track]');
  const monthLinks = archive.querySelectorAll('[data-timeline-month]');
  const yearLinks = archive.querySelectorAll('[data-timeline-year]');
  const monthById = new Map(Array.from(monthLinks).map(link => [link.dataset.timelineMonth, link]));
  const timeline = archive.querySelector('.blog-timeline');
  const mobile = window.matchMedia('(max-width: 767px)');
  const tickById = new Map(Array.from(archive.querySelectorAll('[data-timeline-post]'))
    .map(link => [link.dataset.timelinePost, link]));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const container = archive.closest('.archive');
  const masthead = document.querySelector('.masthead');
  const pageHeading = container.querySelector('.page__title') || archive;
  if (!timeline || !posts.length) return;

  // A fixed tooltip avoids clipping long titles inside the scrollable rail.
  const tooltip = document.createElement('div');
  tooltip.className = 'blog-timeline__tooltip';
  tooltip.hidden = true;
  if (archive.hasAttribute('data-section-archive')) timeline.append(tooltip);
  const hideTooltip = () => { tooltip.hidden = true; };
  const showTooltip = event => {
    const link = event.target.closest('[data-timeline-label]');
    if (!link || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    tooltip.textContent = link.dataset.timelineLabel;
    tooltip.hidden = false;
    const rect = link.getBoundingClientRect();
    tooltip.style.left = `${Math.max(8, rect.left - tooltip.offsetWidth - 12)}px`;
    tooltip.style.top = `${Math.max(8, Math.min(window.innerHeight - tooltip.offsetHeight - 8, rect.top + (rect.height - tooltip.offsetHeight) / 2))}px`;
  };
  timeline.addEventListener('pointerover', showTooltip);
  timeline.addEventListener('focusin', showTooltip);
  timeline.addEventListener('pointerout', hideTooltip);
  timeline.addEventListener('focusout', hideTooltip);

  // The small rail opens through an explicit click, never through page scroll.
  let mobileExpanded = false;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'blog-timeline__toggle';
  toggle.textContent = '≡';
  toggle.setAttribute('aria-label', '展开定位轴');
  track.id ||= 'blog-timeline-track';
  toggle.setAttribute('aria-controls', track.id);
  timeline.insertBefore(toggle, track);
  const trackLinks = Array.from(track.querySelectorAll('a'));
  const syncMobileState = () => {
    const compact = mobile.matches && !mobileExpanded;
    timeline.classList.toggle('is-compact', compact);
    toggle.setAttribute('aria-expanded', String(mobile.matches && mobileExpanded));
    if (compact) track.setAttribute('aria-hidden', 'true');
    else track.removeAttribute('aria-hidden');
    trackLinks.forEach(link => {
      if (compact) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  };
  syncMobileState();

  let positions = [];
  let activePost = null;
  let scheduled = false;
  let hideTimer;
  let hovered = false;
  let mobileScrollStarted = false;
  let collapseContentTimer;
  let swipe = null;
  let suppressClickUntil = 0;
  const pointers = new Set();

  const canShowMobileTimeline = () => mobileScrollStarted &&
    pageHeading.getBoundingClientRect().top <= (masthead?.getBoundingClientRect().bottom || 0) + 16;
  const hideTimeline = () => {
    window.clearTimeout(hideTimer);
    timeline.classList.remove('is-visible');
  };

  // Keep the rail available throughout a touch gesture or keyboard interaction.
  const hideWhenIdle = () => {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(() => {
      if (!hovered && !pointers.size && (mobile.matches || !timeline.contains(document.activeElement))) {
        timeline.classList.remove('is-visible');
      }
    }, mobile.matches ? 3000 : 1400);
  };
  const showTimeline = () => {
    if (mobile.matches && !canShowMobileTimeline()) {
      hideTimeline();
      return;
    }
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
    if (mobile.matches && !canShowMobileTimeline()) hideTimeline();
    if (track.getClientRects().length) {
      const top = parseFloat(window.getComputedStyle(timeline).top);
      if (mobile.matches) {
        // Explicit pixel endpoints let both width and height animate in Safari.
        // Expanded content keeps its original density and half-screen maximum.
        const naturalHeight = track.scrollHeight + 24;
        const desired = mobileExpanded ? Math.min(window.innerHeight * 0.5, naturalHeight) : window.innerHeight * 0.25;
        const height = Math.max(40, Math.min(desired, window.innerHeight - top - 24));
        timeline.style.setProperty('--mobile-rail-height', `${height}px`);
        track.style.maxHeight = '';
      } else {
        timeline.style.removeProperty('--mobile-rail-height');
        const bottom = Math.min(window.innerHeight - 24, archive.getBoundingClientRect().bottom);
        const padding = timeline.offsetHeight - track.offsetHeight;
        const height = `${Math.max(80, Math.min(window.innerHeight * 0.5 - padding, bottom - top - padding))}px`;
        if (track.style.maxHeight !== height) track.style.maxHeight = height;
      }
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
      revealTick(tickById.get(post.id) || monthById.get(post.dataset.month));
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
    monthLinks.forEach(link => link.classList.toggle('is-active', link.dataset.timelineMonth === post.dataset.month));
    yearLinks.forEach(link => link.classList.toggle('is-active', link.dataset.timelineYear === post.dataset.year));

    revealTick(tick || monthById.get(post.dataset.month));
  };

  const scheduleUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };

  const setMobileExpanded = (expanded, restoreFocus = false) => {
    const wasHidden = !timeline.classList.contains('is-visible');
    const collapsing = mobile.matches && mobileExpanded && !expanded && !wasHidden && !reducedMotion.matches;
    window.clearTimeout(collapseContentTimer);
    timeline.classList.toggle('is-collapsing', collapsing);
    mobileExpanded = mobile.matches && expanded;
    if (!mobileExpanded && timeline.contains(document.activeElement)) document.activeElement.blur();
    syncMobileState();
    hideTooltip();
    if (wasHidden) {
      update();
      // Commit the new size while invisible so a revealed compact rail never
      // flashes the previously expanded frame.
      timeline.getBoundingClientRect();
    }
    showTimeline();
    scheduleUpdate();
    if (collapsing) {
      // Keep the old labels in place while they fade, then fade in compact ticks.
      collapseContentTimer = window.setTimeout(() => {
        timeline.classList.remove('is-collapsing');
        scheduleUpdate();
      }, 120);
    }
    if (!restoreFocus && timeline.contains(document.activeElement)) document.activeElement.blur();
    if (restoreFocus) {
      const target = mobileExpanded ?
        tickById.get(activePost?.id) || monthById.get(activePost?.dataset.month) || trackLinks[0] : toggle;
      target?.focus({ preventScroll: true });
    }
  };

  const navigate = event => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (mobile.matches && !mobileExpanded) {
      event.preventDefault();
      event.stopPropagation();
      setMobileExpanded(true, event.detail === 0);
      return;
    }
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    // The theme also attaches a smooth-scroll handler to every anchor.
    event.stopPropagation();
    if (mobile.matches) setMobileExpanded(false);
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    if (window.location.hash !== link.hash) window.history.pushState(null, '', link.hash);
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    showTimeline();
  };

  timeline.addEventListener('click', navigate, true);
  timeline.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = true;
    showTimeline();
  });
  timeline.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    hovered = false;
    hideWhenIdle();
  });
  timeline.addEventListener('pointerdown', event => {
    suppressClickUntil = 0;
    swipe = mobile.matches && mobileExpanded && event.pointerType === 'touch' && event.isPrimary ?
      { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
    pointers.add(event.pointerId);
    showTimeline();
  });
  window.addEventListener('pointermove', event => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (Math.abs(dy) > 12 && Math.abs(dy) >= Math.abs(dx)) {
      swipe = null;
      return;
    }
    if (Math.abs(dx) >= 24 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      // Swiping over an anchor must not activate it through a compatibility click.
      suppressClickUntil = performance.now() + 500;
      swipe = null;
      if (event.cancelable) event.preventDefault();
      if (dx > 0) setMobileExpanded(false);
    }
  }, { passive: false });
  const releasePointer = event => {
    if (swipe?.id === event.pointerId) swipe = null;
    if (pointers.delete(event.pointerId)) hideWhenIdle();
  };
  window.addEventListener('pointerup', releasePointer, { passive: true });
  window.addEventListener('pointercancel', releasePointer, { passive: true });
  timeline.addEventListener('focusin', showTimeline);
  timeline.addEventListener('focusout', hideWhenIdle);
  track.addEventListener('scroll', () => { hideTooltip(); showTimeline(); }, { passive: true });
  timeline.addEventListener('wheel', showTimeline, { passive: true });
  document.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) &&
        !event.target.closest('input, textarea, select, [contenteditable="true"]')) {
      mobileScrollStarted = true;
    }
    if (event.key === 'Tab') showTimeline();
    if (event.key === 'Escape') {
      if (mobile.matches) {
        setMobileExpanded(false, mobileExpanded || timeline.contains(document.activeElement));
        return;
      }
      if (timeline.contains(document.activeElement) && activePost) {
        activePost.setAttribute('tabindex', '-1');
        activePost.focus({ preventScroll: true });
      }
      timeline.classList.remove('is-visible');
    }
  });
  document.addEventListener('pointerdown', event => {
    if (mobile.matches && mobileExpanded && !timeline.contains(event.target)) setMobileExpanded(false);
  }, { passive: true });
  const notePageScroll = event => {
    if (mobile.matches && !timeline.contains(event.target)) mobileScrollStarted = true;
  };
  // Initial layout, hash restoration and directory auto-scroll do not reveal the
  // mobile rail. A page scrolling gesture is required, then the title threshold.
  window.addEventListener('touchmove', notePageScroll, { passive: true });
  window.addEventListener('wheel', notePageScroll, { passive: true });
  window.addEventListener('scroll', () => {
    if (mobile.matches) {
      if (mobileExpanded || timeline.contains(document.activeElement)) setMobileExpanded(false);
    }
    hideTooltip();
    showTimeline();
    scheduleUpdate();
  }, { passive: true });
  mobile.addEventListener('change', () => {
    window.clearTimeout(collapseContentTimer);
    timeline.classList.remove('is-collapsing');
    swipe = null;
    mobileExpanded = false;
    syncMobileState();
    measure();
    showTimeline();
    scheduleUpdate();
  });
  timeline.addEventListener('transitionend', event => {
    if (event.target === timeline && (event.propertyName === 'height' || event.propertyName === 'width')) scheduleUpdate();
  });
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
  // Images and responsive embeds can change section positions after DOM ready.
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(() => { measure(); scheduleUpdate(); });
    observer.observe(archive.querySelector('.blog-archive__posts'));
  }
  document.fonts?.ready.then(() => { measure(); scheduleUpdate(); });
  measure();
  update();
})();
