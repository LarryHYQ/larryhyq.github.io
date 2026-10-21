/*
* Greedy Navigation
*
* http://codepen.io/lukejacksonn/pen/PwmwWV
*
*/

var $nav = $('#site-nav');
var $btn = $('#site-nav button');
var $vlinks = $('#site-nav .visible-links');
var $vlinks_persist_tail = $vlinks.children("*.persist.tail");
var $hlinks = $('#site-nav .hidden-links');
var $sectionItems = $vlinks.children(':not(.persist)');
var $currentSection = $sectionItems.filter('.masthead__menu-item--current');
var compactNav = window.matchMedia('(max-width: 767px)');
var wasCompact = false;

var breaks = [];

function updateNav() {

  if (compactNav.matches !== wasCompact) {
    // Restore the source order before switching between the two layouts.
    $sectionItems.insertBefore($vlinks_persist_tail);
    breaks = [];
    $hlinks.addClass('hidden');
    $btn.removeClass('close');
  }

  if (compactNav.matches) {
    // Keep the actual current section visible, rather than the first link.
    $sectionItems.not($currentSection).appendTo($hlinks);
    $currentSection.insertBefore($vlinks_persist_tail);
    $btn.removeClass('hidden');
  } else {

    var availableSpace = $btn.hasClass('hidden') ? $nav.width() : $nav.width() - $btn.width() - 30;

    // The visible list is overflowing the nav
    if ($vlinks.width() > availableSpace) {

      while ($vlinks.width() > availableSpace && $vlinks.children("*:not(.persist)").length > 0) {
        // Record the width of the list
        breaks.push($vlinks.width());

        // Move item to the hidden list
        $vlinks.children("*:not(.persist)").last().prependTo($hlinks);

        availableSpace = $btn.hasClass("hidden") ? $nav.width() : $nav.width() - $btn.width() - 30;

        // Show the dropdown btn
        $btn.removeClass("hidden");
      }

      // The visible list is not overflowing
    } else {

      // There is space for another item in the nav
      while (breaks.length > 0 && availableSpace > breaks[breaks.length - 1]) {
        // Move the item to the visible list
        if ($vlinks_persist_tail.children().length > 0) {
          $hlinks.children().first().insertBefore($vlinks_persist_tail);
        } else {
          $hlinks.children().first().appendTo($vlinks);
        }
        breaks.pop();
      }

      // Hide the dropdown btn if hidden list is empty
      if (breaks.length < 1) {
        $btn.addClass('hidden');
        $btn.removeClass('close');
        $hlinks.addClass('hidden');
      }
    }

  }

  wasCompact = compactNav.matches;
  $btn.attr('count', $hlinks.children().length);
  $btn.attr('aria-expanded', !$hlinks.hasClass('hidden'));

  // update masthead height and the body/sidebar top padding
  var mastheadHeight = $('.masthead').height();
  $('body').css('padding-top', mastheadHeight + 'px');
  if ($(".author__urls-wrapper button").is(":visible")) {
    $(".sidebar").css("padding-top", "");
  } else {
    $(".sidebar").css("padding-top", mastheadHeight + "px");
  }

}

// Window listeners

$(window).on('resize', function () {
  updateNav();
});
if (screen.orientation) screen.orientation.addEventListener('change', updateNav);

$btn.on('click', function () {
  $hlinks.toggleClass('hidden');
  $(this).toggleClass('close');
  $(this).attr('aria-expanded', !$hlinks.hasClass('hidden'));
});

$(document).on('keydown', function (event) {
  if (event.key === 'Escape' && !$hlinks.hasClass('hidden')) {
    $hlinks.addClass('hidden');
    $btn.removeClass('close').attr('aria-expanded', 'false').trigger('focus');
  }
});

updateNav();
