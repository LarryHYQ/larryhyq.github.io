/* Scale the high-resolution provider widget without reloading its visitor tracker. */
(() => {
  const frame = document.querySelector('[data-visitor-map-frame]');
  if (!frame) return;

  const mapWidth = Number(frame.dataset.mapWidth);
  const fit = width => {
    frame.style.setProperty('--visitor-map-scale', String(width / mapWidth));
    // A map initialized inside closed Follow needs its canvas measured on reveal.
    const canvas = frame.querySelector('.jvectormap-container');
    if (width > 0 && canvas && window.vmap_jq) {
      window.vmap_jq(canvas).data('mapObject')?.updateSize();
    }
  };
  const measure = () => fit(frame.clientWidth);
  measure();

  if ('ResizeObserver' in window) {
    new ResizeObserver(entries => fit(entries[0].contentRect.width)).observe(frame);
  } else {
    // Re-measure after the Follow button changes a hidden popover's layout.
    window.addEventListener('resize', measure);
    document.querySelector('.author__urls-wrapper > button')?.addEventListener('click', () => {
      window.requestAnimationFrame(measure);
    });
  }
})();
