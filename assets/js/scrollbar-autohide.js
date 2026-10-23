/* Desktop only: reveal a scrollbar while its area is scrolling, hide it when idle. */
(function () {
  var HIDE_DELAY = 800;
  var desktopQuery = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : null;

  if (!desktopQuery || !desktopQuery.matches) return;

  function autoHide(scroller, classTarget) {
    var hideTimer = null;
    scroller.addEventListener(
      "scroll",
      function () {
        classTarget.classList.add("is-scrolling");
        window.clearTimeout(hideTimer);
        hideTimer = window.setTimeout(function () {
          classTarget.classList.remove("is-scrolling");
        }, HIDE_DELAY);
      },
      { passive: true }
    );
  }

  // Page scrollbar
  autoHide(window, document.documentElement);

  // Sidebar scrollbar (the sidebar is fixed and scrolls independently on desktop)
  var sidebar = document.querySelector(".sidebar");
  if (sidebar) autoHide(sidebar, sidebar);
})();
