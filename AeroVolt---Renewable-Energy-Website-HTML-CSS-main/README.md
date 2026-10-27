# AeroVolt — Renewable Energy Website

A static, single-page marketing website for **AeroVolt**, a renewable energy brand. It is built with plain HTML, CSS and JavaScript, with no build step and no dependencies.

The page is designed on a fixed **1920px** canvas (1920 × 7853) and is made responsive by a dedicated stylesheet that re-flows the layout on smaller screens.

## Table of Contents

- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Responsive Behavior](#responsive-behavior)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Customization](#customization)
- [Known Limitations](#known-limitations)

## Key Features

- **Pixel-positioned desktop layout** — at 1920px and wider, the original absolute-positioned canvas is used unchanged.
- **Responsive re-flow** — below 1920px, `responsive.css` adapts the layout (see [Responsive Behavior](#responsive-behavior)).
- **Hamburger navigation menu** — enabled at 1100px and below.
- **Two content sliders** — the About and Solutions sliders each show a card with an image, alt text, heading and paragraph. Arrow controls update all parts of the card together and wrap around at both ends.
- **Footer subscribe form** — handled in `script.js`.
- **Testimonials section** — uses an illustrated avatar.
- **Project block** — a poster image with a play button.
- **Partner logos** — displayed from `assets/logos/`.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Markup | HTML |
| Styling | CSS (`style.css` for the base layout, `responsive.css` for responsiveness) |
| Behavior | Vanilla JavaScript (`script.js`) |
| Build tooling | None |
| Dependencies | None |

## Responsive Behavior

| Viewport width | Layout |
| --- | --- |
| 1920px and above | Original absolute-positioned canvas, unchanged |
| Below 1920px | Fluid desktop layout |
| 1100px and below | Stacked tablet layout, hamburger menu enabled |
| 700px and below | Phone layout |

## Project Structure

```text
.
├── index.html        # Markup; every element is a `.positioned-layer`
├── style.css         # One rule per element with left/top/width/height in px
├── responsive.css    # Responsive layer and hamburger menu styles (below 1920px only)
├── script.js         # Navigation, the two sliders, footer subscribe form
└── assets/
    ├── images/       # Photos and an illustrated avatar for the testimonials
    └── logos/        # Partner logos
```

## Getting Started

No installation or build step is required.

1. Clone or download this repository.
2. Open `index.html` in a web browser, **or** serve the folder with the VS Code *Live Server* extension.

For the intended desktop layout, view the page in a browser window that is 1920px wide or larger.

## Customization

### Slider content

The About and Solutions sliders are driven by the `SLIDES` object in `script.js`. Each card defines:

- an image
- alt text
- a heading
- a paragraph

Edit the entries in `SLIDES` to change what the sliders display.

### Testimonial avatar

The testimonial avatars use an illustration, `alicia-ribong-illustration.svg`, not a photograph. Replace that file to use a real portrait.

## Known Limitations

- The "Project" block is a poster image with a play button. **No video file is included**, so there is nothing to play.
- Because the base layout positions every element with fixed pixel values (`left`, `top`, `width`, `height`), layout changes to `style.css` should be checked against `responsive.css` at each breakpoint.
