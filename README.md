# Seelam Manjunath Reddy - Immersive 3D Portfolio

**Live Website:** [https://manjunathreddy078.github.io/](https://manjunathreddy078.github.io/)

A modern, high-performance, single-page 3D personal portfolio website engineered specifically for **GitHub Pages**. Features spatial 3D card tilt, real-time WebGL constellation backdrop, and instant certificate search with zero build overhead.

---

## 🚀 Key Highlights & Architecture

- **Zero-Build Pipeline:** Pure vanilla HTML5, modern CSS3, and ES6 JavaScript. No Node.js build step or CI/CD compilation required—push to `main` and GitHub Pages deploys in seconds.
- **Immersive 3D WebGL Backdrop:** Lightweight Three.js procedural particle galaxy and floating geometric crystals synchronized to mouse movements and scroll depth.
- **Spatial 3D Glassmorphic Cards:** High-efficiency 60 FPS cursor-driven card tilt engine with dynamic specular glare/reflection tracking.
- **Dynamic Search & Filtering:** Instant keyword search and category filtering across 30+ completed technical certifications.
- **Performance & Battery Optimized:** Caps pixel ratio on retina screens, pauses WebGL rendering loops when the browser tab is hidden, and fully supports `prefers-reduced-motion`.
- **Mobile Responsive & Accessible:** Responsive single-page design with semantic HTML and keyboard navigation.

---

## 📁 Project Structure

```text
manjunathreddy078.github.io/
├── index.html                 # Main Single-Page 3D Portfolio
├── projects.html              # Seamless redirect to index.html#projects
├── certificates.html          # Seamless redirect to index.html#certificates
├── .gitignore                 # Standard clean ignore file
├── README.md                  # Documentation & deployment guide
└── assets/
    ├── css/
    │   └── style.css          # Glassmorphism, 3D tilt effects, responsive layouts
    ├── js/
    │   ├── 3d-scene.js        # Three.js WebGL scene & scroll camera engine
    │   ├── card-tilt.js       # 60 FPS spatial tilt & specular glare engine
    │   ├── app.js             # Navigation observer, search & filter interactions
    │   └── script.js          # Backward-compatibility module
    ├── docs/
    │   └── Seelam_Manjunath_Reddy_Resume.pdf   # Active resume document
    └── images/
        ├── favicon.svg        # Modern vector monogram favicon
        └── profile.jpg        # Profile headshot
```

---

## 💻 Local Development & Preview

Because this project uses pure static assets, you can run it locally with any lightweight HTTP server:

### Using Python:
```powershell
python -m http.server 5500
```
Open `http://localhost:5500/index.html` in your browser.

### Using VS Code Live Server:
Right-click `index.html` and select **Open with Live Server**.

---

## 🚢 GitHub Pages Deployment

This site is pre-configured for GitHub Pages from the repository root:

1. Commit your changes:
   ```powershell
   git add .
   git commit -m "Update portfolio with 3D glassmorphic experience"
   ```
2. Push to GitHub:
   ```powershell
   git push origin main
   ```
3. GitHub Pages automatically publishes updates to [https://manjunathreddy078.github.io/](https://manjunathreddy078.github.io/).

---

## 📬 Contact & Socials

- **Email:** [seelammanjunathreddy6@gmail.com](mailto:seelammanjunathreddy6@gmail.com)
- **LinkedIn:** [https://www.linkedin.com/in/manjunath-seelam/](https://www.linkedin.com/in/manjunath-seelam/)
- **GitHub:** [https://github.com/ManjunathReddy078](https://github.com/ManjunathReddy078)
