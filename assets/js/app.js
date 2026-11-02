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
const translations = {
  'Overview': 'Genel Bakış', 'Projects': 'Projeler', 'Resume': 'Özgeçmiş', 'Articles': 'Yazılar', 'Contact': 'İletişim',
  'Live GitHub telemetry': 'Canlı GitHub verileri', 'PUBLIC REPOS': 'AÇIK DEPOLAR', 'FOLLOWERS': 'TAKİPÇİLER',
  'View engineering resume': 'Mühendislik özgeçmişini görüntüle', 'Open contact console': 'İletişim panelini aç', 'Recently updated': 'Son güncellenenler',
  'Connecting to GitHub API…': 'GitHub API bağlantısı kuruluyor…', 'Loading public repositories…': 'Açık depolar yükleniyor…',
  'Engineering at the edge of ': 'Mühendislik, ', 'intelligence': 'zekâ', ' and silicon.': ' ile donanımın kesişiminde.',
  'Explore engineering work ': 'Projeleri keşfet ', 'Start a conversation': 'İletişime geç', 'Engineering disciplines': 'Mühendislik alanları',
  'Tech stack matrix': 'Teknoloji yığını', 'SELECT A CHIP TO FILTER PROJECTS': 'PROJELERİ FİLTRELEMEK İÇİN BİR ETİKET SEÇ',
  'GITHUB REPOSITORIES': 'GITHUB DEPOLARI', ' PUBLIC REPOS · LIVE': ' AÇIK DEPO · CANLI', 'AUDITED PROJECTS IN THE SHOWCASE': 'VİTRİNDE İNCELENMİŞ PROJE', 'ENGINEERING DISCIPLINES': 'MÜHENDİSLİK ALANI',
  'Repository intelligence / 30 case files': 'Depo kataloğu / 30 vaka dosyası', 'Engineering showcase': 'Mühendislik vitrini',
  'Audited projects across perception, applications, embedded systems and automation. Search by project or technology; open a case file for its documented architecture.': 'Algılama, uygulama, gömülü sistem ve otomasyon alanlarında incelenmiş projeler. Proje veya teknoloji ara; belgelenen mimariyi görmek için vaka dosyasını aç.',
  'Search projects, descriptions, technologies…': 'Proje, açıklama veya teknoloji ara…', 'PROJECTS': 'PROJE', 'All': 'Tümü',
  'No project matches this query. Try another technology or category.': 'Bu aramayla eşleşen proje yok. Başka bir teknoloji veya kategori dene.',
  'Featured': 'Öne Çıkanlar', 'FLAGSHIP': 'AMİRAL GEMİSİ', 'System Architecture Pipeline': 'Sistem Mimari Akışı',
  'Inspect / Architecture': 'İncele / Mimari', 'Profile ↗': 'Profil ↗', 'GitHub ↗': 'GitHub ↗', 'Private case study': 'Özel vaka incelemesi',
  'Problem / engineering goal': 'Problem / mühendislik hedefi', 'Architecture / documented approach': 'Mimari / belgelenen yaklaşım', 'Technology stack': 'Teknoloji yığını', 'Repository access': 'Depo erişimi',
  'Public repository.': 'Açık depo.', 'Private repository; this portfolio links to the GitHub profile without exposing the private source URL.': 'Özel depo; kaynak bağlantısını açığa çıkarmadan GitHub profiline yönlendirir.',
  'Education / research / system capabilities': 'Eğitim / araştırma / sistem yetkinlikleri', 'Engineering resume': 'Mühendislik özgeçmişi', 'Academic work, research programs and project-based engineering experience.': 'Akademik çalışmalar, araştırma programları ve proje tabanlı mühendislik deneyimi.',
  'Education': 'Eğitim', 'Research & experience': 'Araştırma ve deneyim', 'Technical telemetry': 'Teknik yetkinlikler', 'SELF-ASSESSMENT': 'ÖZ DEĞERLENDİRME', 'Bars are a self-assessed snapshot, not an external certification.': 'Çubuklar öz değerlendirmeyi gösterir; harici sertifika değildir.',
  'Medium / technical writing': 'Medium / teknik yazılar', 'Engineering notes': 'Mühendislik notları', 'Writing tracks for technical articles. These topic cards are not presented as published posts; use the Medium profile to see published writing.': 'Teknik yazı konu başlıkları. Bu kartlar yayımlanmış makale değildir; yayımlanan yazılar için Medium profilini ziyaret et.', 'Open Medium profile ↗': 'Medium profilini aç ↗', 'Visit @azo-dev ↗': '@azo-dev profilini ziyaret et ↗',
  'Contact protocol / encrypted by your mail client': 'İletişim protokolü / e-posta uygulamanız üzerinden', 'Open a channel': 'İletişim kanalı aç', 'Choose a topic to generate a structured message. Copy it or hand it to your email application.': 'Düzenli bir ileti oluşturmak için konu seç. Kopyala veya e-posta uygulamana aktar.',
  'NAME': 'AD', 'EMAIL': 'E-POSTA', 'TOPIC': 'KONU', 'MESSAGE': 'MESAJ', 'Your name': 'Adınız', 'Select a topic': 'Bir konu seçin', 'Embedded Systems & Robotics': 'Gömülü Sistemler ve Robotik', 'Full-Stack Engineering': 'Full-Stack Mühendislik', 'Research / Collaboration': 'Araştırma / İş Birliği', 'Other': 'Diğer', 'Share a little context…': 'Kısaca bağlamı paylaşın…', 'Open email draft ↗': 'E-posta taslağı aç ↗', 'Copy structured message': 'Düzenli iletiyi kopyala', 'Direct channels': 'Doğrudan iletişim',
  'Navigate to view': 'Görünüme git', 'Navigate or search projects…': 'Görünüme git veya proje ara…', 'No matching view or project.': 'Eşleşen görünüm veya proje yok.', 'Close case study': 'Vaka incelemesini kapat', 'Close command palette': 'Komut paletini kapat',
  'Live API · updated now': 'Canlı API · şimdi güncellendi', 'Refreshing live API…': 'Canlı API yenileniyor…', 'Recent public repositories unavailable.': 'Son açık depolar kullanılamıyor.'
};
const reverseTranslations = Object.fromEntries(Object.entries(translations).map(([english, turkish]) => [turkish, english]));
let language = localStorage.getItem('azo-os-language') || (navigator.language?.toLowerCase().startsWith('tr') ? 'tr' : 'en');

function translateText(value) {
  const dictionary = language === 'tr' ? translations : reverseTranslations;
  const normalized = value.trim();
  if (dictionary[normalized]) return value.replace(normalized, dictionary[normalized]);
  const entries = Object.entries(dictionary).sort((left, right) => right[0].length - left[0].length);
  return entries.reduce((text, [source, target]) => text.replaceAll(source, target), value);
}

function applyLanguage() {
  document.documentElement.lang = language;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) walker.currentNode.nodeValue = translateText(walker.currentNode.nodeValue);
  document.querySelectorAll('[placeholder]').forEach((element) => { element.placeholder = translateText(element.placeholder); });
  const current = document.querySelector('[data-language-current]');
  const next = document.querySelector('[data-language-next]');
  if (current) current.textContent = language.toUpperCase();
  if (next) next.textContent = language === 'tr' ? 'EN' : 'TR';
  document.querySelector('[data-lang-toggle]')?.setAttribute('aria-pressed', String(language === 'tr'));
}

let currentView = 'overview';
let activeCategory = 'All';
let featuredOnly = false;
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
  const description = language === 'en' ? project.descriptionEn : project.description;
  return `<article class="project-card${project.featured ? ' is-featured' : ''}" data-project-card data-search="${escapeHtml(`${project.title} ${project.description} ${project.technologies.join(' ')}`)}" data-categories="${escapeHtml(project.categories.join('|'))}">
    <div class="blueprint" style="--blueprint-accent:${blueprintColors[project.category] ?? '#00f0ff'}" aria-label="Engineering blueprint for ${escapeHtml(project.title)}">
      ${blueprintSvg(project)}<span class="blueprint-label">AZO.OS / ${escapeHtml(project.category.toUpperCase())}</span><span class="blueprint-symbol">${escapeHtml(project.code)}</span><span class="blueprint-code">CASE_${escapeHtml(project.id.slice(0, 8).toUpperCase())}</span>
    </div>
    <div class="project-card-body">
      <div class="project-title-row"><h3>${escapeHtml(project.title)}</h3><div class="project-badges">${project.featured ? '<span class="flagship-badge">★ FLAGSHIP</span>' : ''}<span class="visibility-badge${privateCase ? ' private' : ''}">${escapeHtml(project.visibility)}</span></div></div>
      <p class="project-area">${escapeHtml(project.area)}</p>
      <p class="project-description">${escapeHtml(description)}</p>
      <div class="project-tags">${project.technologies.map((technology) => `<span class="project-tag">${escapeHtml(technology)}</span>`).join('')}</div>
      <div class="project-actions"><button class="project-action" type="button" data-open-case="${escapeHtml(project.id)}">Inspect / Architecture</button><a class="project-action" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${privateCase ? 'Profile ↗' : 'GitHub ↗'}</a></div>
    </div>
  </article>`;
}

function renderOverview() {
  const mount = byId('view-overview');
  mount.innerHTML = `<header class="hero-panel glass-panel">
    <div><span class="eyebrow">Azo İsmail / Software Engineering</span><h1>Engineering at the edge of <span>intelligence</span> and silicon.</h1><p class="hero-copy">${escapeHtml(language === 'en' ? profile.summaryEn : profile.summary)}</p><div class="button-row"><button class="button" type="button" data-view-target="projects">Explore engineering work <span>→</span></button><button class="button secondary" type="button" data-view-target="contact">Start a conversation</button></div></div>
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
    <section class="category-console" aria-label="Project categories"><div class="category-console-heading"><span>${language === 'tr' ? 'PROJE KATEGORİLERİ' : 'PROJECT CATEGORIES'}</span><span>${language === 'tr' ? 'BİR ALAN SEÇ' : 'SELECT A TRACK'}</span></div><div class="filter-tabs" data-project-filters></div></section><div class="project-grid" data-project-grid></div>`;
  const filterMount = mount.querySelector('[data-project-filters]');
  const categoryInfo = {
    All: { code: '00', icon: '⌘', title: language === 'tr' ? 'Tüm projeler' : 'All projects', note: language === 'tr' ? '30 vaka dosyasına göz at' : 'Browse all case studies', className: 'all' },
    'AI & Computer Vision': { code: '01', icon: '◉', title: language === 'tr' ? 'Yapay Zekâ' : 'AI & Vision', note: language === 'tr' ? 'Algılama ve makine öğrenmesi' : 'Perception and machine learning', className: 'ai' },
    'Embedded & Robotics': { code: '02', icon: '⌁', title: language === 'tr' ? 'Gömülü Sistemler' : 'Embedded', note: language === 'tr' ? 'Donanım ve gerçek zamanlı sistemler' : 'Hardware and real-time systems', className: 'embedded' },
    'Web & Full-Stack': { code: '03', icon: '▱', title: language === 'tr' ? 'Web ve Full-Stack' : 'Web & Full-Stack', note: language === 'tr' ? 'Uygulamalar ve servisler' : 'Applications and services', className: 'web' },
    'Automation & Systems': { code: '04', icon: '⟳', title: language === 'tr' ? 'Otomasyon' : 'Automation', note: language === 'tr' ? 'İş akışları ve sistem araçları' : 'Workflows and system tools', className: 'automation' }
  };
  const filterButton = ({ value, featured = false, info, count, active }) => `<button class="filter-tab category-filter category-${info.className}${active ? ' is-active' : ''}" type="button" ${featured ? 'data-featured-filter' : `data-project-filter="${escapeHtml(value)}"`} aria-pressed="${active}"><span class="filter-index">${info.code}</span><span class="filter-icon" aria-hidden="true">${info.icon}</span><span class="filter-copy"><span class="filter-name">${escapeHtml(info.title)}</span><span class="filter-description">${escapeHtml(info.note)}</span></span><span class="filter-count">${count}</span><span class="filter-arrow" aria-hidden="true">↗</span></button>`;
  const featuredInfo = { code: '★', icon: '✦', title: language === 'tr' ? 'Öne Çıkanlar' : 'Featured', note: language === 'tr' ? 'Amiral gemisi sistemler' : 'Flagship engineering work', className: 'featured' };
  filterMount.innerHTML = filterButton({ value: 'Featured', featured: true, info: featuredInfo, count: projects.filter((project) => project.featured).length, active: featuredOnly }) + ['All', ...categories].map((category) => {
    const info = categoryInfo[category] ?? { code: '05', icon: '•', title: category, note: '', className: 'all' };
    const count = category === 'All' ? projects.length : projects.filter((project) => project.categories.includes(category)).length;
    return filterButton({ value: category, info, count, active: !featuredOnly && category === activeCategory });
  }).join('');
  const search = mount.querySelector('[data-project-search]');
  search.value = projectQuery;
  search.addEventListener('input', () => { projectQuery = search.value; applyProjectFilters(); });
  applyProjectFilters();
  applyLanguage();
}

function applyProjectFilters() {
  const grid = document.querySelector('[data-project-grid]');
  if (!grid) return;
  const query = textKey(projectQuery);
  const filtered = projects.filter((project) => {
    const categoryMatch = activeCategory === 'All' || project.categories.includes(activeCategory);
    const searchable = textKey(`${project.title} ${project.description} ${project.descriptionEn} ${project.technologies.join(' ')}`);
    return categoryMatch && (!featuredOnly || project.featured) && searchable.includes(query);
  });
  grid.innerHTML = filtered.length ? filtered.map(projectCard).join('') : '<div class="empty-state">No project matches this query. Try another technology or category.</div>';
  const count = document.querySelector('[data-project-result-count]');
  if (count) count.textContent = `${filtered.length} / ${projects.length} PROJECTS`;
  document.querySelectorAll('[data-project-filter]').forEach((button) => {
    const active = !featuredOnly && button.dataset.projectFilter === activeCategory;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const featuredFilter = document.querySelector('[data-featured-filter]');
  featuredFilter?.classList.toggle('is-active', featuredOnly);
  featuredFilter?.setAttribute('aria-pressed', String(featuredOnly));
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
  const articleHeading = language === 'tr' ? 'Yayımlanmış makaleler' : 'Published articles';
  const articleIntro = language === 'tr' ? 'Medium’da yayımlanan seçili yazılar. Özgün yazıyı okumak için bir kartı aç.' : 'Selected articles published on Medium. Open a card to read the original story.';
  const articleEyebrow = language === 'tr' ? 'MEDIUM / YAYIMLANMIŞ YAZILAR' : 'MEDIUM / PUBLISHED WRITING';
  byId('view-articles').innerHTML = `<header class="view-header"><div><span class="eyebrow">${articleEyebrow}</span><h1>${articleHeading}</h1><p>${articleIntro}</p></div><a class="button ghost" href="${escapeHtml(articlesProfileUrl)}" target="_blank" rel="noopener noreferrer">${language === 'tr' ? 'Medium profilini aç ↗' : 'Open Medium profile ↗'}</a></header>
    <div class="article-grid">${articles.map((article) => {
      const title = language === 'tr' ? article.titleTr : article.title;
      const date = language === 'tr' ? article.publishedAtTr : article.publishedAt;
      const description = language === 'en' ? article.descriptionEn : article.description;
      const category = language === 'tr' ? article.categoryTr : article.category;
      const imageAlt = language === 'tr' ? article.imageAltTr ?? title : article.imageAlt ?? title;
      return `<article class="article-card"><a class="article-cover" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" aria-label="${language === 'tr' ? 'Medium makalesini oku: ' : 'Read Medium article: '}${escapeHtml(title)}"><img src="${escapeHtml(article.image)}" alt="${escapeHtml(imageAlt)}" loading="lazy" decoding="async"><span class="article-cover-mark" aria-hidden="true">M</span></a><div class="article-body"><div class="article-meta"><span class="article-status">MEDIUM / ${escapeHtml(date)}</span><span class="article-category">${escapeHtml(category)}</span></div><h3><a class="article-title-link" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></h3><p>${escapeHtml(description)}</p><a class="article-read-link" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">${language === 'tr' ? 'Makaleyi Medium’da oku' : 'Read article on Medium'} <span aria-hidden="true">↗</span></a></div></article>`;
    }).join('')}</div>`;
}

function renderContact() {
  byId('view-contact').innerHTML = `<header class="view-header"><div><span class="eyebrow">Contact protocol / encrypted by your mail client</span><h1>Open a channel</h1><p>Choose a topic to generate a structured message. Copy it or hand it to your email application.</p></div></header>
    <div class="contact-layout"><section class="contact-panel"><form data-contact-form><div class="form-grid">
      <div class="field"><label for="contact-name">NAME</label><input id="contact-name" name="name" required minlength="2" autocomplete="name" placeholder="Your name"></div>
      <div class="field"><label for="contact-email">EMAIL</label><input id="contact-email" name="email" type="email" required autocomplete="email" placeholder="you@example.com"></div>
      <div class="field full"><label for="contact-topic">TOPIC</label><select id="contact-topic" name="topic" required><option value="">Select a topic</option><option>AI &amp; Computer Vision</option><option>Embedded Systems &amp; Robotics</option><option>Full-Stack Engineering</option><option>Research / Collaboration</option><option>Other</option></select></div>
      <div class="field full"><label for="contact-message">MESSAGE</label><textarea id="contact-message" name="message" required minlength="12" placeholder="Share a little context…"></textarea></div>
      <div class="field full"><div class="button-row"><button class="button" type="submit">Open email draft ↗</button><button class="button secondary" type="button" data-copy-message>Copy structured message</button></div></div>
    </div></form></section><aside class="contact-panel contact-aside"><span class="eyebrow">Direct channels</span><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(language === 'en' ? profile.educationEn : profile.education)}<br>${escapeHtml(profile.location)}</p><div class="dock-links"><a class="dock-link" href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)} <span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.github)}" target="_blank" rel="noopener noreferrer">GitHub / Azo15 <span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a></div></aside></div>`;
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
  applyLanguage();
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
  const pipeline = project.pipeline?.length ? `<section class="case-section"><h3>System Architecture Pipeline</h3><ol class="architecture-pipeline">${project.pipeline.map((step, index) => `<li class="pipeline-step"><span class="pipeline-index">0${index + 1}</span><span>${escapeHtml(step)}</span></li>`).join('')}</ol></section>` : '';
  const problem = language === 'en' ? project.descriptionEn : project.problem;
  const architecture = language === 'en' ? `Engineering approach: ${project.descriptionEn} Technology stack: ${project.technologies.join(', ')}.` : project.architecture;
  document.querySelector('[data-case-body]').innerHTML = `${pipeline}<section class="case-section"><h3>Problem / engineering goal</h3><p>${escapeHtml(problem)}</p></section><section class="case-section"><h3>Architecture / documented approach</h3><p>${escapeHtml(architecture)}</p></section><section class="case-section"><h3>Technology stack</h3><div class="project-tags">${project.technologies.map((tag) => `<span class="project-tag">${escapeHtml(tag)}</span>`).join('')}</div></section><section class="case-section"><h3>Repository access</h3><p>${project.visibility === 'Public' ? 'Public repository.' : 'Private repository; this portfolio links to the GitHub profile without exposing the private source URL.'}</p><a class="button ghost" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.linkLabel)} ↗</a></section>`;
  applyLanguage();
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
  applyLanguage();
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
  if (target.matches('[data-project-filter]')) { activeCategory = target.dataset.projectFilter; featuredOnly = false; applyProjectFilters(); }
  if (target.matches('[data-featured-filter]')) { featuredOnly = !featuredOnly; applyProjectFilters(); }
  if (target.matches('[data-open-case]')) openCase(target.dataset.openCase);
  if (target.matches('[data-close-case]') || event.target === document.querySelector('[data-case-overlay]')) closeCase();
  if (target.matches('[data-open-palette]')) openPalette();
  if (target.matches('[data-close-palette]') || event.target === document.querySelector('[data-palette-overlay]')) closePalette();
  if (target.matches('[data-command-type]')) selectPaletteCommand(target);
  if (target.matches('[data-gh-refresh]')) updateGitHubTelemetry(true);
  if (target.matches('[data-lang-toggle]')) { language = language === 'tr' ? 'en' : 'tr'; localStorage.setItem('azo-os-language', language); renderAll(); navigate(currentView, { updateHash: false }); }
  if (target.matches('[data-tech-query]')) { projectQuery = target.dataset.techQuery; activeCategory = 'All'; featuredOnly = false; navigate('projects'); renderProjects(); }
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
