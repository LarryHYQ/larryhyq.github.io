/* Back to top: appears while scrolling and fades out when idle, matching the
   reveal rhythm of the page/sidebar scrollbars (see _scrollbar.scss).
   Desktop returns to the top of the page; on phones it returns to the
   current chapter title, i.e. where the scrollable content starts. */
(function () {
  "use strict";

  if (document.querySelector(".to-top")) return;

  var desktopQuery = window.matchMedia("(min-width: 1024px)");
  var mobileQuery = window.matchMedia("(max-width: 767px)");
  var SHOW_AFTER = 80;
  var HIDE_DELAY = 1500;
  // Prefer the timeline / table of contents that actually sits in the right gutter.
  var COLUMN_SELECTORS = [".blog-timeline", ".sidebar__right"];
  var GUTTER_COLUMN_WIDTH = 96;
  var MAIN_PADDING = 18;

  var button = document.createElement("button");
  button.type = "button";
  button.className = "to-top";
  button.setAttribute("aria-label", "Back to top");
  button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(button);

  var hideTimer = null;

  function columnCenter() {
    for (var i = 0; i < COLUMN_SELECTORS.length; i++) {
      var column = document.querySelector(COLUMN_SELECTORS[i]);
      if (!column) continue;
      var columnRect = column.getBoundingClientRect();
      // Pages such as Interests also contain an in-flow, full-width table of
      // contents; only narrow gutter columns are used for alignment.
      if (columnRect.width > 0 && columnRect.width <= 200) {
        return columnRect.left + columnRect.width / 2;
      }
    }
    var main = document.getElementById("main");
    if (!main) return null;
    // Pages without a table of contents: use the same right-hand gutter so the
    // button keeps the same horizontal position across pages.
    var mainRect = main.getBoundingClientRect();
    return mainRect.right - MAIN_PADDING - GUTTER_COLUMN_WIDTH / 2;
  }

  function place() {
    if (!desktopQuery.matches) {
      button.style.right = "";
      return;
    }
    var center = columnCenter();
    if (center === null) {
      button.style.right = "";
      return;
    }
    var viewportWidth = document.documentElement.clientWidth;
    button.style.right = Math.round(viewportWidth - center - button.offsetWidth / 2) + "px";
  }

  function show() {
    if (window.scrollY > SHOW_AFTER) button.classList.add("is-visible");
  }

  function scheduleHide() {
    window.clearTimeout(hideTimer);
    hideTimer = window.setTimeout(function () {
      if (button.matches(":hover") || button.matches(":focus-visible")) return;
      button.classList.remove("is-visible");
    }, HIDE_DELAY);
  }

  function onScroll() {
    show();
    scheduleHide();
  }

  function targetTop() {
    if (!mobileQuery.matches) return 0;
    var title = document.querySelector(".page__title, #main h1");
    if (!title) return 0;
    var masthead = document.querySelector(".masthead");
    var offset = (masthead ? masthead.offsetHeight : 70) + 8;
    return Math.max(0, title.getBoundingClientRect().top + window.scrollY - offset);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", place, { passive: true });
  window.addEventListener("load", place);
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
})();
