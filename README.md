# AZO.OS // Engineering Portfolio


> A systems-oriented engineering workspace for Azo15 — spanning AI, computer vision, embedded systems, and full-stack software.

**Live portfolio:** https://azo15.github.io/portfolio/

AZO.OS is a custom-built, responsive portfolio presented as an engineering console. It is implemented with semantic HTML, modular CSS, and native ES modules, with no build step or framework runtime.

## System map

```text
portfolio/
├── index.html
├── assets/
│   ├── css/
│   │   ├── variables.css      # Cyber-obsidian palette, typography, tokens
│   │   ├── layout.css         # Responsive shell and view layout
│   │   ├── components.css     # Cards, navigation, filters, dialogs
│   │   ├── animations.css     # Motion and reduced-motion behavior
│   │   └── style.css          # CSS entry point
│   ├── images/azo-mark.svg
│   └── js/
│       ├── app.js             # Rendering, navigation, search, interactions
│       ├── data/              # Profile, 30 projects, resume, article topics
│       └── services/          # GitHub telemetry and contact utilities
└── README.md
```

## Features

- **Ctrl+K Command Palette** for view navigation and project lookup.
- **Live GitHub telemetry** with cached public profile statistics and recently updated public repositories.
- **30 audited case studies** with documented engineering goals, architecture notes, stack tags, and repository visibility.
- **Dynamic SVG blueprints** generated deterministically for project cards.
- **Flagship architecture pipelines** that visualize four-stage system flows in case study dialogs.
- **Project discovery** with category and featured filters, live text search, and technology tags.
- **TR / EN interface switcher**, with the selected language remembered in local storage.
- **Resume, engineering notes, and contact views**, including structured email drafting and copy support.
- Responsive glassmorphism UI, keyboard controls, accessible focus states, and reduced-motion support.

## Run locally

The app uses ES modules, so serve the repository over HTTP instead of opening `index.html` directly.

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). You can also use any static HTTP server or an editor's Live Server extension.

## Data and privacy

Project records and profile content are maintained in `assets/js/data/`. GitHub telemetry reads public profile and repository data from the GitHub API and caches responses in the browser session. Contact details are assembled in the visitor's own email client; the portfolio does not send form submissions to a backend. Private repository case studies point to the public profile and do not expose private source URLs.

## Deployment

GitHub Pages serves the static site from the `main` branch root. No build command is required. Changes pushed to `main` are published by Pages after its deployment completes.

---

**AZO.OS** · Personal engineering system · [GitHub / Azo15](https://github.com/Azo15)
