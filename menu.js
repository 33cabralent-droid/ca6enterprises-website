/*
 * menu.js: phone-width menu toggle for ca6enterprises.com (index.html).
 * Loaded from <head> as a same-origin file so the Content-Security-Policy can stay script-src 'self'
 * (no 'unsafe-inline'). No dependencies, no build step.
 *
 * It adds class "js" to <html> right away; the CSS only collapses the menu behind the button when
 * that class is present, so visitors without JavaScript still see every link.
 */
(function () {
  'use strict';

  var rootElement = document.documentElement;
  rootElement.classList.add('js');

  function initMenu() {
    var toggleButton = document.querySelector('.menu-toggle');
    var menuList = document.getElementById('site-menu');
    if (!toggleButton || !menuList) {
      // A page without the menu markup must not end up with hidden links, so undo the collapse.
      rootElement.classList.remove('js');
      return;
    }

    function isOpen() {
      return toggleButton.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(shouldOpen) {
      toggleButton.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      menuList.classList.toggle('open', shouldOpen);
    }

    toggleButton.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Following an in-page link should reveal the section, not leave the menu covering it.
    menuList.addEventListener('click', function (event) {
      if (event.target && event.target.closest && event.target.closest('a')) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
        toggleButton.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }
})();
