/* Home page (A′ layout): keep education lines on a single row and keep the
   research-interest pills in exactly two states (one row of three / three rows).
   Uses a shrink-to-fit approach so no heading or advisor line ever wraps. */
(function () {
  var root = document.querySelector(".home-page");
  if (!root) return;

  var MIN_FS = 6.8;

  function textWidth(el, fs) {
    var clone = el.cloneNode(true);
    clone.style.cssText =
      "position:absolute;visibility:hidden;left:-9999px;top:0;display:inline-block;" +
      "width:auto;max-width:none;white-space:nowrap;font-size:" + fs + "px;";
    el.parentNode.appendChild(clone);
    var width = clone.getBoundingClientRect().width;
    clone.parentNode.removeChild(clone);
    return width;
  }

  function fitLine(el) {
    var base = parseFloat(el.dataset.baseFs || getComputedStyle(el).fontSize);
    if (!el.dataset.baseFs) el.dataset.baseFs = base;
    el.style.whiteSpace = "nowrap";
    var avail = el.clientWidth;
    var size = base;
    while (size > MIN_FS && textWidth(el, size) > avail + 1) size -= 0.4;
    el.style.fontSize = Math.round(size * 10) / 10 + "px";
  }

  function fitLines() {
    [].forEach.call(root.querySelectorAll(".edu-title, .edu-note"), fitLine);
  }

  function layoutInterests() {
    var wrap = root.querySelector(".home-interests");
    if (!wrap) return;
    var items = [].slice.call(wrap.children);
    if (!items.length) return;
    wrap.classList.remove("is-row", "is-stacked");
    wrap.classList.add("is-row");
    var gap = 10;
    var total = gap * (items.length - 1);
    items.forEach(function (item) {
      total += item.getBoundingClientRect().width;
    });
    if (total > wrap.clientWidth + 1) {
      wrap.classList.remove("is-row");
      wrap.classList.add("is-stacked");
    }
  }

  function reflow() {
    fitLines();
    layoutInterests();
  }

  reflow();
  window.addEventListener("load", reflow);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(reflow);

  var timer = null;
  window.addEventListener("resize", function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(reflow, 120);
  });
})();
