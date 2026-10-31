import { profile } from './data/profile.js';
import { projects } from './data/projects.js';
import { resume } from './data/resume.js';
import { articles, articlesProfileUrl } from './data/articles.js';
import { getGitHubStats } from './services/githubService.js';
import { bindContactForm, showToast } from './services/contactService.js';

const views = ['overview', 'projects', 'resume', 'articles', 'contact'];
const categories = ['AI & Computer Vision', 'Embedded & Robotics', 'Web & Full-Stack', 'Automation & Systems'];
const viewLabels = { overview: 'Overview', projects: 'Projects', resume: 'Resume', articles: 'Articles', contact: 'Contact' };
const blueprintColors = { 'AI & Computer Vision': '#00f0ff', 'Embedded & Robotics': '#10b981', 'Web & Full-Stack': '#8b5cf6', 'Automation & Systems': '#38bdf8' };
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const textKey = (value = '') => String(value).trim().toLocaleLowerCase('en');
const byId = (id) => document.getElementById(id);

let currentView = 'overview';
let activeCategory = 'All';
let projectQuery = '';
let paletteSelection = 0;

function blueprintSvg(project) {
  const accent = blueprintColors[project.category] ?? '#00f0ff';
  let seed = [...project.id].reduce((total, char) => (total * 31 + char.charCodeAt(0)) >>> 0, 7);
  const points = Array.from({ length: 7 }, (_, index) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return { x: 42 + (seed % 520), y: 34 + ((seed >>> 8) % 166) };
  });
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const gridId = `grid-${project.id}`;
  return `<svg style="--blueprint-accent:${accent}" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><pattern id="${gridId}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(125,211,252,.13)" stroke-width=".6"/></pattern></defs>
    <rect width="600" height="240" fill="url(#${gridId})"/>
    <path d="${path}" fill="none" stroke="rgba(0,240,255,.58)" stroke-width="1.5" stroke-dasharray="4 5"/>
    ${points.map((point, index) => `<circle cx="${point.x}" cy="${point.y}" r="${index === 0 || index === points.length - 1 ? 5 : 3}" fill="#060911" stroke="${index % 2 ? 'rgba(139,92,246,.8)' : accent}" stroke-width="1.5"/>`).join('')}
    <path d="M 30 210 H 120 M 480 28 H 568 M 515 44 V 76" stroke="rgba(148,163,184,.28)" stroke-width="1"/>
  </svg>`;
}

function projectCard(project) {
  const privateCase = project.visibility !== 'Public';
  return `<article class="project-card" data-project-card data-search="${escapeHtml(`${project.title} ${project.description} ${project.technologies.join(' ')}`)}" data-categories="${escapeHtml(project.categories.join('|'))}">
    <div class="blueprint" style="--blueprint-accent:${blueprintColors[project.category] ?? '#00f0ff'}" aria-label="Engineering blueprint for ${escapeHtml(project.title)}">
      ${blueprintSvg(project)}<span class="blueprint-label">AZO.OS / ${escapeHtml(project.category.toUpperCase())}</span><span class="blueprint-symbol">${escapeHtml(project.code)}</span><span class="blueprint-code">CASE_${escapeHtml(project.id.slice(0, 8).toUpperCase())}</span>
    </div>
    <div class="project-card-body">
      <div class="project-title-row"><h3>${escapeHtml(project.title)}</h3><span class="visibility-badge${privateCase ? ' private' : ''}">${escapeHtml(project.visibility)}</span></div>
      <p class="project-area">${escapeHtml(project.area)}</p>
      <p class="project-description">${escapeHtml(project.description)}</p>
      <div class="project-tags">${project.technologies.map((technology) => `<span class="project-tag">${escapeHtml(technology)}</span>`).join('')}</div>
      <div class="project-actions"><button class="project-action" type="button" data-open-case="${escapeHtml(project.id)}">Inspect / Architecture</button><a class="project-action" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${privateCase ? 'Profile ↗' : 'GitHub ↗'}</a></div>
    </div>
  </article>`;
}

function renderOverview() {
  const mount = byId('view-overview');
  mount.innerHTML = `<header class="hero-panel glass-panel">
    <div><span class="eyebrow">Azo İsmail / Software Engineering</span><h1>Engineering at the edge of <span>intelligence</span> and silicon.</h1><p class="hero-copy">${escapeHtml(profile.summary)}</p><div class="button-row"><button class="button" type="button" data-view-target="projects">Explore engineering work <span>→</span></button><button class="button secondary" type="button" data-view-target="contact">Start a conversation</button></div></div>
    <aside class="hero-aside"><span class="mono">$ system --profile</span><p>NAME&nbsp;&nbsp; ${escapeHtml(profile.name)}<br>EDU&nbsp;&nbsp;&nbsp; SOFTWARE_ENGINEERING<br>BASE&nbsp;&nbsp; ${escapeHtml(profile.location)}<br>FOCUS&nbsp; PERCEPTION / SYSTEMS<br>STATE&nbsp; BUILDING</p></aside>
  </header>
  <div class="metric-grid">
    <article class="metric-card"><div class="metric-value">85+<small>ACCOUNT</small></div><div class="metric-label">GITHUB REPOSITORIES</div><div class="metric-label"><span data-gh-stat="publicRepos">79</span> PUBLIC REPOS · LIVE</div></article>
    <article class="metric-card"><div class="metric-value">30<span>+</span></div><div class="metric-label">AUDITED PROJECTS IN THE SHOWCASE</div></article>
    <article class="metric-card"><div class="metric-value">4</div><div class="metric-label">ENGINEERING DISCIPLINES</div></article>
  </div>
  <div class="section-heading"><h2>Engineering disciplines</h2><span>01—04 / SYSTEMS MAP</span></div>
  <div class="discipline-grid">${profile.disciplines.map((discipline) => `<article class="discipline-card"><span class="discipline-code">${escapeHtml(discipline.code)}</span><h3>${escapeHtml(discipline.title)}</h3><p>${escapeHtml(discipline.description)}</p></article>`).join('')}</div>
  <div class="section-heading"><h2>Tech stack matrix</h2><span>SELECT A CHIP TO FILTER PROJECTS</span></div>
  <div class="tech-matrix">${profile.techStack.map((group) => `<section class="tech-card"><h3>${escapeHtml(group.category)}</h3><div class="tech-chips">${group.items.map((item) => `<button class="tech-chip" type="button" data-tech-query="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}</div></section>`).join('')}</div>`;
}

function renderProjects() {
  const mount = byId('view-projects');
  mount.innerHTML = `<header class="view-header"><div><span class="eyebrow">Repository intelligence / 30 case files</span><h1>Engineering showcase</h1><p>Audited projects across perception, applications, embedded systems and automation. Search by project or technology; open a case file for its documented architecture.</p></div></header>
    <div class="project-toolbar"><label class="search-field"><span>⌕</span><input type="search" data-project-search placeholder="Search projects, descriptions, technologies…" autocomplete="off"><span class="mono">/</span></label><span class="mono" data-project-result-count></span></div>
    <div class="filter-tabs" data-project-filters></div><div class="project-grid" data-project-grid></div>`;
  const filterMount = mount.querySelector('[data-project-filters]');
  filterMount.innerHTML = ['All', ...categories].map((category) => {
    const count = category === 'All' ? projects.length : projects.filter((project) => project.categories.includes(category)).length;
    const active = category === activeCategory ? ' is-active' : '';
    return `<button class="filter-tab${active}" type="button" data-project-filter="${escapeHtml(category)}">${escapeHtml(category)} <span>(${count})</span></button>`;
  }).join('');
  const search = mount.querySelector('[data-project-search]');
  search.value = projectQuery;
  search.addEventListener('input', () => { projectQuery = search.value; applyProjectFilters(); });
  applyProjectFilters();
}

function applyProjectFilters() {
  const grid = document.querySelector('[data-project-grid]');
  if (!grid) return;
  const query = textKey(projectQuery);
  const filtered = projects.filter((project) => {
    const categoryMatch = activeCategory === 'All' || project.categories.includes(activeCategory);
    const searchable = textKey(`${project.title} ${project.description} ${project.technologies.join(' ')}`);
    return categoryMatch && searchable.includes(query);
  });
  grid.innerHTML = filtered.length ? filtered.map(projectCard).join('') : '<div class="empty-state">No project matches this query. Try another technology or category.</div>';
  const count = document.querySelector('[data-project-result-count]');
  if (count) count.textContent = `${filtered.length} / ${projects.length} PROJECTS`;
  document.querySelectorAll('[data-project-filter]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.projectFilter === activeCategory);
  });
}

function timelineCard(item) {
  return `<article class="timeline-card"><span class="timeline-meta">${escapeHtml(item.period)}</span><h3>${escapeHtml(item.title)}</h3><h4>${escapeHtml(item.organization)}</h4><p>${escapeHtml(item.description)}</p></article>`;
}

function renderResume() {
  byId('view-resume').innerHTML = `<header class="view-header"><div><span class="eyebrow">Education / research / system capabilities</span><h1>Engineering resume</h1><p>Academic work, research programs and project-based engineering experience.</p></div></header>
    <div class="resume-layout"><div><div class="section-heading"><h2>Education</h2><span>FOUNDATION</span></div><div class="timeline">${resume.education.map(timelineCard).join('')}</div><div class="section-heading"><h2>Research &amp; experience</h2><span>FIELD NOTES</span></div><div class="timeline">${resume.experience.map(timelineCard).join('')}</div></div>
    <aside class="contact-panel"><div class="section-heading" style="margin-top:0"><h2>Technical telemetry</h2><span>SELF-ASSESSMENT</span></div>${resume.skills.map((group) => `<section class="skill-group"><h3>${escapeHtml(group.group)}</h3>${group.items.map((skill) => `<div class="skill-row"><span>${escapeHtml(skill.name)}</span><strong>${skill.level}%</strong><div class="skill-track"><div class="skill-fill" style="width:${skill.level}%"></div></div></div>`).join('')}</section>`).join('')}<p class="mono">Bars are a self-assessed snapshot, not an external certification.</p></aside></div>`;
}

function renderArticles() {
  byId('view-articles').innerHTML = `<header class="view-header"><div><span class="eyebrow">Medium / technical writing</span><h1>Engineering notes</h1><p>Writing tracks for technical articles. These topic cards are not presented as published posts; use the Medium profile to see published writing.</p></div><a class="button ghost" href="${escapeHtml(articlesProfileUrl)}" target="_blank" rel="noopener noreferrer">Open Medium profile ↗</a></header>
    <div class="article-grid">${articles.map((article) => `<article class="article-card"><span class="article-status">${escapeHtml(article.status)}</span><h3>${escapeHtml(article.title)}</h3><span class="mono">${escapeHtml(article.category)}</span><p>${escapeHtml(article.description)}</p><a class="project-action" href="${escapeHtml(articlesProfileUrl)}" target="_blank" rel="noopener noreferrer">Visit @azo-dev ↗</a></article>`).join('')}</div>`;
}

function renderContact() {
  byId('view-contact').innerHTML = `<header class="view-header"><div><span class="eyebrow">Contact protocol / encrypted by your mail client</span><h1>Open a channel</h1><p>Choose a topic to generate a structured message. Copy it or hand it to your email application.</p></div></header>
    <div class="contact-layout"><section class="contact-panel"><form data-contact-form><div class="form-grid">
      <div class="field"><label for="contact-name">NAME</label><input id="contact-name" name="name" required minlength="2" autocomplete="name" placeholder="Your name"></div>
      <div class="field"><label for="contact-email">EMAIL</label><input id="contact-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div>
      <div class="field full"><label for="contact-topic">TOPIC</label><select id="contact-topic" name="topic" required><option value="">Select a topic</option><option>AI &amp; Computer Vision</option><option>Embedded Systems &amp; Robotics</option><option>Full-Stack Engineering</option><option>Research / Collaboration</option><option>Other</option></select></div>
      <div class="field full"><label for="contact-message">MESSAGE</label><textarea id="contact-message" name="message" required minlength="12" placeholder="Share a little context…"></textarea></div>
      <div class="field full"><div class="button-row"><button class="button" type="submit">Open email draft ↗</button><button class="button secondary" type="button" data-copy-message>Copy structured message</button></div></div>
    </div></form></section><aside class="contact-panel contact-aside"><span class="eyebrow">Direct channels</span><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(profile.education)}<br>${escapeHtml(profile.location)}</p><div class="dock-links"><a class="dock-link" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)} <span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.github)}" target="_blank" rel="noopener noreferrer">GitHub / Azo15 <span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a></div></aside></div>`;
  bindContactForm(byId('view-contact').querySelector('[data-contact-form]'), profile.email);
}

function renderAll() {
  renderOverview();
  renderProjects();
  renderResume();
  renderArticles();
  renderContact();
  document.querySelector('[data-profile-name]').textContent = profile.name;
  document.querySelector('[data-profile-title]').textContent = profile.title;
  document.querySelector('[data-profile-status]').textContent = profile.status;
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
}

function navigate(view, { updateHash = true } = {}) {
  if (!views.includes(view)) return;
  currentView = view;
  document.querySelectorAll('[data-view]').forEach((section) => {
    const active = section.dataset.view === view;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  document.querySelectorAll('[data-view-target]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.viewTarget === view);
    button.setAttribute('aria-current', button.dataset.viewTarget === view ? 'page' : 'false');
  });
  if (updateHash) history.replaceState(null, '', `#${view}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openCase(projectId) {
  const project = projects.find((candidate) => candidate.id === projectId);
  if (!project) return;
  document.querySelector('[data-case-category]').textContent = `${project.category} / ${project.visibility}`;
  document.querySelector('[data-case-title]').textContent = project.title;
  document.querySelector('[data-case-body]').innerHTML = `<section class="case-section"><h3>Problem / engineering goal</h3><p>${escapeHtml(project.problem)}</p></section><section class="case-section"><h3>Architecture / documented approach</h3><p>${escapeHtml(project.architecture)}</p></section><section class="case-section"><h3>Technology stack</h3><div class="project-tags">${project.technologies.map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}</div></section><section class="case-section"><h3>Repository access</h3><p>${project.visibility === 'Public' ? 'Public repository.' : 'Private repository; this portfolio links to the GitHub profile without exposing the private source URL.'}</p><a class="button ghost" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.linkLabel)} ↗</a></section>`;
  const overlay = document.querySelector('[data-case-overlay]');
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  overlay.querySelector('[data-close-case]').focus();
}

function closeCase() {
  document.querySelector('[data-case-overlay]').hidden = true;
  document.body.style.overflow = '';
}

const paletteOverlay = document.querySelector('[data-palette-overlay]');
const paletteInput = document.querySelector('[data-palette-input]');
const paletteResults = document.querySelector('[data-palette-results]');

function paletteCommands(query = '') {
  const normalized = textKey(query);
  const navigation = views.map((view) => ({ type: 'view', value: view, title: viewLabels[view], meta: 'Navigate to view', code: 'VIEW' }));
  const matchingProjects = projects.filter((project) => textKey(`${project.title} ${project.technologies.join(' ')}`).includes(normalized)).slice(0, 8).map((project) => ({ type: 'project', value: project.id, title: project.title, meta: project.category, code: 'CASE' }));
  const navMatches = navigation.filter((item) => textKey(item.title).includes(normalized));
  return normalized ? [...navMatches, ...matchingProjects] : [...navigation, ...matchingProjects.slice(0, 5)];
}

function renderPalette() {
  const commands = paletteCommands(paletteInput.value);
  paletteSelection = 0;
  paletteResults.innerHTML = commands.length ? commands.map((command, index) => `<button class="command-result${index === 0 ? ' is-selected' : ''}" type="button" data-command-type="${command.type}" data-command-value="${escapeHtml(command.value)}"><code>${command.code}</code><span>${escapeHtml(command.title)}</span><small>${escapeHtml(command.meta)}</small></button>`).join('') : '<div class="empty-state">No matching view or project.</div>';
}

function openPalette() {
  paletteOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  paletteInput.value = '';
  renderPalette();
  paletteInput.focus();
}

function closePalette() {
  paletteOverlay.hidden = true;
  document.body.style.overflow = '';
}

function selectPaletteCommand(button) {
  if (!button) return;
  const type = button.dataset.commandType;
  const value = button.dataset.commandValue;
  closePalette();
  if (type === 'view') navigate(value);
  if (type === 'project') { navigate('projects'); openCase(value); }
}

async function updateGitHubTelemetry(refresh = false) {
  const status = document.querySelector('[data-gh-status]');
  if (status) status.textContent = refresh ? 'Refreshing live API…' : 'Connecting to GitHub API…';
  const data = await getGitHubStats({ refresh });
  document.querySelectorAll('[data-gh-stat="publicRepos"]').forEach((element) => { element.textContent = data.publicRepos; });
  document.querySelectorAll('[data-gh-stat="followers"]').forEach((element) => { element.textContent = data.followers; });
  if (status) status.textContent = data.source === 'live' ? 'Live API · updated now' : `${data.source} · public data`;
  const recent = document.querySelector('[data-recent-repos]');
  if (recent) recent.innerHTML = data.recentRepos.length ? data.recentRepos.slice(0, 4).map((repo) => `<a class="dock-link" href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(repo.name)}</span><span>↗</span></a>`).join('') : '<span class="dock-link">Recent public repositories unavailable.</span>';
  if (data.error) showToast('GitHub API is unavailable; showing cached/fallback public profile data.', 'error');
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('button, a, [data-case-overlay], [data-palette-overlay]');
  if (!target) return;

  if (target.matches('[data-view-target]')) { event.preventDefault(); navigate(target.dataset.viewTarget); }
  if (target.matches('[data-brand-home]')) { event.preventDefault(); navigate('overview'); }
  if (target.matches('[data-project-filter]')) { activeCategory = target.dataset.projectFilter; applyProjectFilters(); }
  if (target.matches('[data-open-case]')) openCase(target.dataset.openCase);
  if (target.matches('[data-close-case]') || event.target === document.querySelector('[data-case-overlay]')) closeCase();
  if (target.matches('[data-open-palette]')) openPalette();
  if (target.matches('[data-close-palette]') || event.target === document.querySelector('[data-palette-overlay]')) closePalette();
  if (target.matches('[data-command-type]')) selectPaletteCommand(target);
  if (target.matches('[data-gh-refresh]')) updateGitHubTelemetry(true);
  if (target.matches('[data-tech-query]')) { projectQuery = target.dataset.techQuery; activeCategory = 'All'; navigate('projects'); renderProjects(); }
});

paletteInput.addEventListener('input', renderPalette);
paletteResults.addEventListener('mousemove', (event) => {
  const button = event.target.closest('[data-command-type]');
  if (!button) return;
  paletteResults.querySelectorAll('.command-result').forEach((item) => item.classList.toggle('is-selected', item === button));
  paletteSelection = [...paletteResults.querySelectorAll('.command-result')].indexOf(button);
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openPalette(); }
  if (event.key === 'Escape') { closeCase(); closePalette(); }
  if (!paletteOverlay.hidden && ['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) {
    const items = [...paletteResults.querySelectorAll('.command-result')];
    if (event.key === 'Enter') { event.preventDefault(); selectPaletteCommand(items[paletteSelection]); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      paletteSelection = (paletteSelection + (event.key === 'ArrowDown' ? 1 : items.length - 1)) % Math.max(items.length, 1);
      items.forEach((item, index) => item.classList.toggle('is-selected', index === paletteSelection));
      items[paletteSelection]?.scrollIntoView({ block: 'nearest' });
    }
  }
});

window.addEventListener('hashchange', () => navigate(location.hash.slice(1), { updateHash: false }));

renderAll();
navigate(views.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'overview', { updateHash: false });
updateGitHubTelemetry();
