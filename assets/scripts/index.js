---
---

/**
 * Element.closest polyfill
 * element-closest | CC0-1.0 | github.com/jonathantneal/closest
 */
(function (ElementProto) {
  if (typeof ElementProto.matches !== 'function') {
    ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
      var element = this;
      var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
      var index = 0;

      while (elements[index] && elements[index] !== element) {
        ++index;
      }

      return Boolean(elements[index]);
    };
  }

  if (typeof ElementProto.closest !== 'function') {
    ElementProto.closest = function closest(selector) {
      var element = this;

      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }

        element = element.parentNode;
      }

      return null;
    };
  }
})(window.Element.prototype);

/**
 * All JS for the site.
 */
let site = {
  // Starts the party.
  init() {
    console.log('🥂 Welcome! 🎉');

    // Set the user agent as a data attr so we can target via CSS
    document.documentElement.setAttribute('data-useragent', navigator.userAgent);

    document.addEventListener("DOMContentLoaded", function(){
      site.intro();
      site.modalController();
      site.animationController();
    });

  },
  intro() {
    console.log('🥁 Introducing... 🥁');

    // Show circle wipe animation
    document.querySelector('.js-intro-wipe').classList.add('introduced');

    // Only show the pointer finger if user doesn't scroll
    let hasScrolled = false;
    window.addEventListener('scroll', () => {
      hasScrolled = true;
    });

    setTimeout(() => {
      if(!hasScrolled) {
        document.querySelector('.js-hello-finger').classList.add('is-active');
      }
    }, 6000);
  },
  /**
   * animationController()
   * Contains the code that disables animations site wide. It disables them by
   * adding a class to the body of the page.
   * TODO Re-enable animations? This will cause them all to play again...
   */
  animationController() {

    const animationToggleButtons = document.querySelectorAll('.js-toggle-animation');
    const body = document.querySelector('body');
    for(let i = 0; i < animationToggleButtons.length; i++) {
      animationToggleButtons[i].addEventListener('click', () => {
        console.log('🚶‍ Toggling animations... 🕴');

        if(body.classList.contains('no-animation')) {
          body.classList.remove('no-animation');
        } else {
          body.classList.add('no-animation');
        }
      });
    }
  },
  /**
   * modalController()
   * Controls the showing/hiding of the modals, and toggling their attributes.
   * Adapted from a Codepen I made here: https://codepen.io/carlinscuderi/pen/VPXqzV
   * TODO Trap focus inside modal on tab/shift tab
   */
  modalController() {
    const body = document.querySelector('body');
    const modalOpeners = document.querySelectorAll('.js-work-link');
    const modalClosers = document.querySelectorAll('.js-modal-close-button, .js-work-modal-screen');
    let trigger = '';
    let modal = '';

    // Calls showModal() or hideModal() based on if a modal is showing or not
    function toggleModal(modal) {
      if(modal.classList.contains('is-transitioning')) {
        return false;
      }

      if(modal.classList.contains('is-hidden')) {
        showModal(modal);
      } else {
        hideModal(modal);
      }
    }

    // Shows the modal
    function showModal(modal) {

      let transitionEndProperties = (event) => {
        if(event.propertyName === 'opacity') {
          modal.removeEventListener('transitionend', transitionEndProperties, false);
          modal.addEventListener('keydown', focusManager);
          modal.setAttribute('aria-hidden', false);
          modal.setAttribute('tabindex', "0");
          modal.classList.remove('is-transitioning');
          modal.focus();
        }
      };

      body.classList.add('modal-open');
      modal.classList.remove('is-hidden');
      modal.addEventListener('transitionend', transitionEndProperties);

      setTimeout(() => {
        modal.classList.add('is-visible', 'is-transitioning');
      }, 10);
    }

    // Hides the modal
    function hideModal(modal) {

      let transitionEndProperties = (event) => {
        if(event.propertyName === 'opacity') {
          modal.removeEventListener('transitionend', transitionEndProperties, false);
          modal.removeEventListener('keydown', focusManager, false);
          modal.setAttribute('aria-hidden', true);
          modal.setAttribute('tabindex', "-1");
          modal.classList.remove('is-transitioning');
          modal.classList.add('is-hidden');
          body.classList.remove('modal-open');
          trigger.focus();
        }
      };

      modal.classList.add('is-transitioning');
      modal.classList.remove('is-visible');
      modal.addEventListener('transitionend', transitionEndProperties);
    }

    // Listens for tabbing and keypresses inside modal
    function focusManager(event) {

      // Find all focusable children
      const focusableElementsString = 'a[href], button:not([disabled]), [tabindex="0"]';
      let focusableElements = modal.querySelectorAll(focusableElementsString);

      // Convert NodeList to Array
      focusableElements = Array.prototype.slice.call(focusableElements);

      const firstTabStop = focusableElements[0];
      const lastTabStop = focusableElements[focusableElements.length - 1];

      // Escape key (close modal)
      if (event.keyCode === 27 && body.classList.contains('modal-open')) {
        hideModal(modal);
      }

      // Check for tab key press
      // Trap tab focus within modal while open
      if (event.keyCode === 9) {

        // Shift + tab
        if (event.shiftKey) {
          if (document.activeElement === firstTabStop) {
            event.preventDefault();
            lastTabStop.focus();
          }

        // Tab
        } else {
          if (document.activeElement === lastTabStop) {
            event.preventDefault();
            firstTabStop.focus();
          }
        }
      }
    }

    // Add toggle modal listeners
    for (let i = 0; i < modalOpeners.length; i++) {
      modalOpeners[i].addEventListener('click', e => {
        e.preventDefault();
        trigger = e.target.closest('.js-work-link');
        modal = trigger.parentNode.nextElementSibling;
        toggleModal(modal);
        return false;
      });
    }

    // Add close listeners to buttons, screens, etc.
    for(let i = 0; i < modalClosers.length; i++) {
      modalClosers[i].addEventListener('click', e => {
        e.preventDefault();
        hideModal(modal);
        return false;
      });
    }
  }
};

  site.init();
