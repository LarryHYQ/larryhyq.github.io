/* Desktop only: reveal the page scrollbar while scrolling and hide it when idle. */
(function () {
  var root = document.documentElement;
  var hideTimer = null;
  var HIDE_DELAY = 800;
  var desktopQuery = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : null;

  function onScroll() {
    root.classList.add("is-scrolling");
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(function () {
      root.classList.remove("is-scrolling");
    }, HIDE_DELAY);
  }

  if (!desktopQuery || !desktopQuery.matches) return;

  window.addEventListener("scroll", onScroll, { passive: true });
})();
