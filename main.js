/* Reformed Hope Foundation — main.js
   Sole responsibility: the mobile navigation toggle.
   No libraries, no dependencies, no build step. */
(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  // The toggle is only meaningful once JS is running, and CSS hides it above
  // the 60rem breakpoint where the full nav is always visible.
  function setOpen(open) {
    nav.setAttribute("data-open", open ? "true" : "false");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  setOpen(false);

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes the menu and returns focus to the control that opened it.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset state when resizing up into the desktop layout, so the menu is not
  // left in a stale "open" state behind a hidden toggle.
  var mq = window.matchMedia("(min-width: 60.0625rem)");
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);
})();
