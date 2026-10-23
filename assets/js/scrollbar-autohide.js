/* Desktop only: reveal a scrollbar while its area is scrolling, hide it when idle. */
(function () {
  var HIDE_DELAY = 800;
  var RESIZE_GRACE = 250;
  var desktopQuery = window.matchMedia
    ? window.matchMedia("(hover: hover) and (pointer: fine)")
    : null;

  if (!desktopQuery || !desktopQuery.matches) return;

  var resizingUntil = 0;

  function autoHide(scroller, classTarget) {
    var hideTimer = null;
    scroller.addEventListener(
      "scroll",
      function () {
        // A window resize reflows the page and can fire scroll events; do not
        // flash the scrollbars while the user is only resizing the window.
        if (Date.now() < resizingUntil) {
          classTarget.classList.remove("is-scrolling");
          return;
        }
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

  window.addEventListener(
    "resize",
    function () {
      resizingUntil = Date.now() + RESIZE_GRACE;
      document.documentElement.classList.remove("is-scrolling");
      if (sidebar) sidebar.classList.remove("is-scrolling");
    },
    { passive: true }
  );
})();
