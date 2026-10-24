/* Back to top: appears while scrolling and fades out when idle, matching the
   reveal rhythm of the page/sidebar scrollbars (see _scrollbar.scss).
   Desktop returns to the top of the page; on phones it returns to the
   current chapter title, i.e. where the scrollable content starts. */
(function () {
  "use strict";

  if (document.querySelector(".to-top")) return;

  // Phones mirror the narrow timeline rail: it appears/disappears together with
  // the rail (see blog-timeline.js). Wider viewports align the button with the
  // right-hand navigation column instead.
  var railQuery = window.matchMedia("(max-width: 767px)");
  var alignQuery = window.matchMedia("(min-width: 768px)");
  var SHOW_AFTER = 80;
  var HIDE_DELAY = 1500;
  var HIDE_DELAY_MOBILE = 3000;
  var COLUMN_SELECTORS = [".blog-timeline", ".sidebar__right"];
  var MAIN_PADDING = 18;

  var button = document.createElement("button");
  button.type = "button";
  button.className = "to-top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(button);

  var hideTimer = null;
  var rail = null;
  var observedRail = null;
  var railInsertObserver = null;

  function getRail() {
    // The section timelines are created by blog-timeline.js (deferred), so look
    // the element up lazily instead of caching a miss.
    if (!rail) rail = document.querySelector(".blog-timeline");
    return rail;
  }

  function mirrorRail() {
    return railQuery.matches && !!getRail();
  }

  function syncRail() {
    var element = getRail();
    if (!element) return;
    button.classList.toggle("is-visible", element.classList.contains("is-visible"));
  }

  function watchRail() {
    var element = getRail();
    if (!element || element === observedRail || typeof MutationObserver === "undefined") return;
    observedRail = element;
    new MutationObserver(function () {
      if (mirrorRail()) syncRail();
    }).observe(element, { attributes: true, attributeFilter: ["class"] });
  }

  // Section timelines are appended by the deferred blog-timeline.js, so the
  // alignment is recalculated as soon as the rail enters the document.
  function watchForRail() {
    if (getRail() || railInsertObserver || typeof MutationObserver === "undefined") return;
    railInsertObserver = new MutationObserver(function () {
      if (!getRail()) return;
      railInsertObserver.disconnect();
      railInsertObserver = null;
      settle();
    });
    railInsertObserver.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(function () {
      if (railInsertObserver) {
        railInsertObserver.disconnect();
        railInsertObserver = null;
      }
    }, 10000);
  }

  function settle() {
    if (railInsertObserver) {
      railInsertObserver.disconnect();
      railInsertObserver = null;
    }
    place();
    window.requestAnimationFrame(place);
    window.setTimeout(place, 400);
    watchRail();
    syncRail();
  }

  function translateX(element) {
    var transform = window.getComputedStyle(element).transform;
    if (!transform || transform === "none") return 0;
    var matrix = transform.match(/matrix\(([^)]+)\)/);
    if (!matrix) return 0;
    var values = matrix[1].split(",");
    return parseFloat(values[4]) || 0;
  }

  function gutterAxis() {
    for (var i = 0; i < COLUMN_SELECTORS.length; i++) {
      var column = document.querySelector(COLUMN_SELECTORS[i]);
      if (!column) continue;
      var columnRect = column.getBoundingClientRect();
      // Pages such as Interests also contain an in-flow, full-width table of
      // contents; only narrow gutter columns define the alignment axis.
      if (!(columnRect.width > 0 && columnRect.width <= 200)) continue;
      var track = column.querySelector(".blog-timeline__track");
      if (track) {
        var trackRect = track.getBoundingClientRect();
        var paddingRight = parseFloat(window.getComputedStyle(track).paddingRight) || 0;
        // The rail slides 4px while hidden; measure its resting position.
        var shift = translateX(column) + translateX(track);
        return trackRect.right - paddingRight - shift;
      }
      return columnRect.right - translateX(column);
    }
    var main = document.getElementById("main");
    if (!main) return null;
    // Pages without a navigation column: align with the same content edge so
    // the button keeps one horizontal position across pages.
    return main.getBoundingClientRect().right - MAIN_PADDING;
  }

  function place() {
    if (!alignQuery.matches) {
      button.style.right = "";
      return;
    }
    var axis = gutterAxis();
    if (axis === null) {
      button.style.right = "";
      return;
    }
    button.style.right = Math.round(document.documentElement.clientWidth - axis) + "px";
  }

  // Pages without a timeline rail (Home / Honors …) still have to hide the
  // button once the reader scrolls back up to the profile / title area, just
  // like rail pages do: the rail only appears after the page title has passed
  // under the masthead (see blog-timeline.js canShowMobileTimeline()).
  function titleGateOpen() {
    if (!railQuery.matches) return true;
    var title = document.querySelector(".page__title, #main h1");
    if (!title) return window.scrollY > SHOW_AFTER;
    var masthead = document.querySelector(".masthead");
    var mastheadBottom = masthead ? masthead.getBoundingClientRect().bottom : 0;
    return title.getBoundingClientRect().top <= mastheadBottom + 16;
  }

  function show() {
    if (!titleGateOpen()) {
      window.clearTimeout(hideTimer);
      button.classList.remove("is-visible");
      return;
    }
    if (window.scrollY > SHOW_AFTER) button.classList.add("is-visible");
  }

  function scheduleHide() {
    if (mirrorRail()) return;
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(function () {
      if (button.matches(":hover") || button.matches(":focus-visible")) return;
      button.classList.remove("is-visible");
    }, railQuery.matches ? HIDE_DELAY_MOBILE : HIDE_DELAY);
  }

  function onScroll() {
    if (mirrorRail()) {
      syncRail();
      return;
    }
    show();
    scheduleHide();
  }

  function targetTop() {
    if (!railQuery.matches) return 0;
    var title = document.querySelector(".page__title, #main h1");
    if (!title) return 0;
    var masthead = document.querySelector(".masthead");
    var offset = (masthead ? masthead.offsetHeight : 70) + 8;
    return Math.max(0, title.getBoundingClientRect().top + window.scrollY - offset);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    place();
    watchRail();
    if (mirrorRail()) syncRail();
  }, { passive: true });
  window.addEventListener("load", function () {
    settle();
    watchForRail();
  });
  window.addEventListener("orientationchange", place, { passive: true });

  button.addEventListener("mouseenter", function () {
    window.clearTimeout(hideTimer);
  });
  button.addEventListener("mouseleave", scheduleHide);
  button.addEventListener("focus", function () {
    window.clearTimeout(hideTimer);
  });
  button.addEventListener("blur", scheduleHide);
  button.addEventListener("click", function () {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var top = targetTop();
    button.classList.remove("is-visible");
    window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
  });

  place();
  watchRail();
  watchForRail();
})();
