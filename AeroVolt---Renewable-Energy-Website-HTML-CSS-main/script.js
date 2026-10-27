/* AeroVolt interactions: section navigation, the two sliders and the footer subscribe form. */

(() => {
  const findElement = (selector, parent = document) =>
    parent.querySelector(selector);
  const findElements = (selector, parent = document) => [
    ...parent.querySelectorAll(selector),
  ];

  function scrollToSection(sectionId) {
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addKeyboardActivation(element, callback) {
    element.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      callback();
    });
  }

  findElements("[data-href]").forEach((element) => {
    const navigate = () => scrollToSection(element.dataset.href);
    element.addEventListener("click", navigate);
    addKeyboardActivation(element, navigate);
  });

  // Mobile navigation: the hamburger button opens the existing link list as a dropdown (<= 1100px).
  const menuToggle = findElement(".nav-toggle");
  const menuPanel = findElement("#primary-menu");
  const navBar = findElement(".home-nav");

  if (menuToggle && menuPanel && navBar) {
    const compactNav = window.matchMedia("(max-width: 1100px)");

    function setMenuOpen(isOpen, { returnFocus = false } = {}) {
      menuPanel.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      if (!isOpen && returnFocus) menuToggle.focus();
    }

    menuToggle.addEventListener("click", () =>
      setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true"),
    );

    // Choosing a link closes the menu (the link's own scroll handler still runs).
    findElements("[data-href]", menuPanel).forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
      link.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuPanel.classList.contains("is-open")) {
        setMenuOpen(false, { returnFocus: true });
      }
    });

    // Tapping outside the header, or tabbing out of it, closes the menu.
    document.addEventListener("click", (event) => {
      if (!navBar.contains(event.target)) setMenuOpen(false);
    });
    navBar.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !navBar.contains(event.relatedTarget)) setMenuOpen(false);
    });

    // Back to the desktop layout: reset the menu state.
    compactNav.addEventListener("change", (event) => {
      if (!event.matches) setMenuOpen(false);
    });
  }

  // One entry per card (data-card="<id>"): image, heading and paragraph are rendered together.
  const SLIDES = {
    g1: {
      engineering: {
        image: "assets/images/Gemini_Generated_Image_m7pflmm7pflmm7pf (2).jpg",
        alt: "Wind turbines and sun-tracking solar dishes linked by a glowing power cable",
        heading: "Innovative Turbine Engineering",
        text: "Aerodynamic blade and drivetrain design that turns more wind into steady, clean power.",
      },
      team: {
        image:
          "assets/images/Green-engineering_-Innovations-in-sustainable-technology-solutions-scaled-2.jpg",
        alt: "Hands holding a miniature landscape with a wind turbine and solar panels",
        heading: "Global Team of Energy Specialists",
        text: "Engineers and field experts across continents, from site surveys to long-term support.",
      },
    },
    g2: {
      onshore: {
        image: "assets/images/Gemini_Generated_Image_rzdrj6rzdrj6rzdr.jpg",
        alt: "Tall onshore wind turbine on a green hillside under dramatic clouds",
        heading: "Onshore Wind Turbines",
        text: "Proven land-based turbines that deliver reliable clean power at competitive cost.",
      },
      offshore: {
        image: "assets/images/images.jpg",
        alt: "Floating offshore wind turbine and lattice platform at sea",
        heading: "Offshore Wind Turbines",
        text: "Floating and fixed-bottom systems built to capture strong, steady winds at sea.",
        position: "85% center", // keep the turbine in view in the tall frame
      },
      small: {
        image:
          "assets/images/Green-engineering_-Innovations-in-sustainable-technology-solutions-scaled-2.jpg",
        alt: "Hands holding a small wind turbine and solar panels on a miniature green landscape",
        heading: "Small Turbine Systems",
        text: "Compact turbines and solar for homes, farms and businesses that want local power.",
      },
      utility: {
        image: "assets/images/Gemini_Generated_Image_m7pflmm7pflmm7pf (2).jpg",
        alt: "Wind turbines and large solar arrays feeding a glowing power line across a valley",
        heading: "Utility-Scale Energy Solutions",
        text: "Grid-connected wind and solar farms engineered to power entire communities.",
      },
    },
  };

  // Cards are ordered by their position on the page (works for the 1920 canvas and the reflowed layout).
  function getLayerPosition(element) {
    const { left, top } = element.getBoundingClientRect();
    return left + top;
  }

  // At 1920px and wider the page is the original absolute canvas; below that it is reflowed.
  const canvasLayout = window.matchMedia("(min-width: 1920px)");

  function initializeSlider(sliderGroup) {
    const groupId = sliderGroup.dataset.group;
    const slideData = SLIDES[groupId] || {};
    const cards = findElements("[data-card]", sliderGroup).sort(
      (firstCard, secondCard) =>
        getLayerPosition(firstCard) - getLayerPosition(secondCard),
    );

    if (cards.length === 0) return;

    const fadeLayer = findElement("[data-fade]", sliderGroup);
    const imageFrame = findElement(`[data-slide-image="${groupId}"]`);
    const progressThumb = findElement(`[data-thumb="${groupId}"]`);
    const previousButton = findElement(`[data-prev="${groupId}"]`);
    const nextButton = findElement(`[data-next="${groupId}"]`);

    // Reuse the design's highlight shadow for whichever card is active.
    let activeCardShadow = "none";
    cards.forEach((card) => {
      const cardRectangle = findElement("[data-rect]", card);
      if (!cardRectangle) return;

      const shadow = getComputedStyle(cardRectangle).boxShadow;
      if (shadow && shadow !== "none") activeCardShadow = shadow;
    });

    // One image per card, with card text filled from the same data.
    const images = cards.map((card) => {
      const slide = slideData[card.dataset.card];
      if (!slide) return null;

      const heading = findElement("[data-card-heading]", card);
      const text = findElement("[data-card-text]", card);
      if (heading) heading.textContent = slide.heading;
      if (text) text.textContent = slide.text;

      const image = document.createElement("img");
      image.src = encodeURI(slide.image);
      image.alt = slide.alt;
      if (slide.position) image.style.objectPosition = slide.position;
      return image;
    });

    if (imageFrame && images.every(Boolean)) imageFrame.replaceChildren(...images);
    const slideImages = imageFrame ? images.filter(Boolean) : [];

    // The progress thumb moves along the X or Y axis depending on the slider.
    const positionProperty = progressThumb?.dataset.axis === "y" ? "top" : "left";
    const travelDistance =
      Number.parseFloat(progressThumb?.dataset.travel) || 0;

    let activeIndex = 0;

    function showCard(index) {
      activeIndex = (index + cards.length) % cards.length;
      if (fadeLayer) fadeLayer.style.display = "none";

      cards.forEach((card, cardIndex) => {
        const isActive = cardIndex === activeIndex;
        card.style.opacity = isActive ? "1" : "0.5";
        if (isActive) card.setAttribute("aria-current", "true");
        else card.removeAttribute("aria-current");

        const rectangle = findElement("[data-rect]", card);
        if (rectangle)
          rectangle.style.boxShadow = isActive ? activeCardShadow : "none";
      });

      slideImages.forEach((image, imageIndex) => {
        const isActive = imageIndex === activeIndex;
        image.classList.toggle("is-active", isActive);
        image.setAttribute("aria-hidden", isActive ? "false" : "true");
      });

      updateThumb();
    }

    function updateThumb() {
      if (!progressThumb || cards.length < 2) return;
      const fraction = activeIndex / (cards.length - 1);
      progressThumb.style.setProperty("--progress", fraction);

      if (canvasLayout.matches) {
        // Original canvas: offset in px from the thumb's own CSS starting position.
        // (Transition is paused so the computed value is the CSS value, not a mid-animation one.)
        progressThumb.style.transition = "none";
        progressThumb.style[positionProperty] = "";
        const startingPosition =
          Number.parseFloat(getComputedStyle(progressThumb)[positionProperty]) || 0;
        progressThumb.style.transition = "";
        progressThumb.style[positionProperty] = `${startingPosition + travelDistance * fraction}px`;
      } else {
        // Reflowed layout: responsive.css positions the thumb from --progress.
        progressThumb.style[positionProperty] = "";
      }
    }

    function bindArrow(button, direction) {
      if (!button) return;
      const move = () => showCard(activeIndex + direction);
      button.addEventListener("click", move);
      addKeyboardActivation(button, move);
    }

    bindArrow(previousButton, -1);
    bindArrow(nextButton, 1);
    canvasLayout.addEventListener("change", updateThumb);
    showCard(0);
  }

  findElements("[data-group]").forEach(initializeSlider);

  // Footer email form: validate the address, send it through EmailJS, show a confirmation.
  const emailInput = findElement("[data-email]");
  const subscribeButton = findElement("[data-subscribe]");
  const sendIcon = findElement("[data-send]");

  if (emailInput && subscribeButton) {
    if (typeof emailjs !== "undefined") {
      emailjs.init({ publicKey: "61B5elNRTOnIEdImB" });
    }

    const buttonLabel = findElement("p", subscribeButton);
    const originalLabel = buttonLabel?.textContent || "";
    let isSending = false;

    const toast = (text, background) =>
      Toastify({
        text,
        duration: 3000,
        gravity: "top",
        position: "center",
        style: { background },
      }).showToast();

    async function subscribe() {
      if (isSending) return;

      const emailAddress = emailInput.value.trim();
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailAddress);

      if (!isValidEmail) {
        emailInput.focus();
        emailInput.placeholder = "Please enter a valid email";
        toast("Please enter a valid email address!", "#dc2626");
        return;
      }

      isSending = true;
      if (buttonLabel) buttonLabel.textContent = "SENDING...";

      try {
        const response = await emailjs.send(
          "service_iochriw",
          "template_22gb4tl",
          {
            email: emailAddress,
            notes: "Thanks for subscribing!",
          },
        );
        console.log("SUCCESS!", response.status, response.text);

        if (buttonLabel) buttonLabel.textContent = "SUBSCRIBED";
        toast("Successfully subscribed!", "#16a34a");
        emailInput.value = "";
        emailInput.placeholder = "Enter Your Email...";
      } catch (error) {
        console.error("FAILED...", error);
        if (buttonLabel) buttonLabel.textContent = originalLabel;
        toast("Something went wrong. Please try again.", "#dc2626");
      } finally {
        window.setTimeout(() => {
          if (buttonLabel) buttonLabel.textContent = originalLabel;
          isSending = false;
        }, 2200);
      }
    }

    subscribeButton.addEventListener("click", subscribe);
    addKeyboardActivation(subscribeButton, subscribe);

    emailInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") subscribe();
    });

    sendIcon?.addEventListener("click", subscribe);
  }
})();