import { profile } from './data/profile.js?v=20261103-dock-radar';
import { projects } from './data/projects.js?v=20261103-dock-radar';
import { resume } from './data/resume.js?v=20261103-dock-radar';
import { articles, articlesProfileUrl } from './data/articles.js?v=20261103-dock-radar';
import { getGitHubStats } from './services/githubService.js?v=20261104-telemetry';
import { bindContactForm, showToast } from './services/contactService.js?v=20261103-dock-radar';

const views = ['overview', 'projects', 'resume', 'articles', 'contact'];
const categories = ['AI & Computer Vision', 'Embedded & Robotics', 'Web & Full-Stack', 'Automation & Systems'];
const viewLabels = { overview: 'Overview', projects: 'Projects', resume: 'Resume', articles: 'Articles', contact: 'Contact' };
const blueprintColors = { 'AI & Computer Vision': '#00f0ff', 'Embedded & Robotics': '#10b981', 'Web & Full-Stack': '#8b5cf6', 'Automation & Systems': '#38bdf8' };
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const textKey = (value = '') => String(value).trim().toLocaleLowerCase('en');
const byId = (id) => document.getElementById(id);
const translations = {
  'Overview': 'Genel Bakış', 'Projects': 'Projeler', 'Resume': 'Özgeçmiş', 'Articles': 'Yazılar', 'Contact': 'İletişim',
  'Core architecture radar': 'Mimari odak radarı', 'Flagship systems': 'Amiral gemisi sistemler',
  'View engineering resume': 'Mühendislik özgeçmişini görüntüle', 'Open contact console': 'İletişim panelini aç',
  'Engineering at the edge of ': 'Mühendislik, ', 'intelligence': 'zekâ', ' and silicon.': ' ile donanımın kesişiminde.',
  'Explore engineering work ': 'Projeleri keşfet ', 'Start a conversation': 'İletişime geç', 'Engineering disciplines': 'Mühendislik alanları',
  'Tech stack matrix': 'Teknoloji yığını', 'SELECT A CHIP TO FILTER PROJECTS': 'PROJELERİ FİLTRELEMEK İÇİN BİR ETİKET SEÇ',
  'END-TO-END ARCHITECTURES': 'UÇTAN UCA MİMARİLER', 'AI, EMBEDDED & FULL-STACK': 'YAPAY ZEKÂ, GÖMÜLÜ & WEB', 'RESEARCH & PRODUCTION': 'ARAŞTIRMA & ÜRETİM', 'TÜBİTAK 2209-A & INTERNSHIPS': 'TÜBİTAK 2209-A & STAJLAR', 'ENGINEERING DISCIPLINES': 'MÜHENDİSLİK ALANI',
  'Repository intelligence / 30 case files': 'Depo kataloğu / 30 vaka dosyası', 'Engineering showcase': 'Mühendislik vitrini',
  'Audited projects across perception, applications, embedded systems and automation. Search by project or technology; open a case file for its documented architecture.': 'Algılama, uygulama, gömülü sistem ve otomasyon alanlarında incelenmiş projeler. Proje veya teknoloji ara; belgelenen mimariyi görmek için vaka dosyasını aç.',
  'Search projects, descriptions, technologies…': 'Proje, açıklama veya teknoloji ara…', 'PROJECTS': 'PROJE', 'All': 'Tümü',
  'No project matches this query. Try another technology or category.': 'Bu aramayla eşleşen proje yok. Başka bir teknoloji veya kategori dene.',
  'Reset active filters & show all projects': 'Aktif filtreleri sıfırla ve tüm projeleri göster',
  'Clear filter': 'Filtreyi temizle',
  'ACTIVE FILTER:': 'AKTİF FİLTRE:',
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
let liveRepoIndex = {};
let githubTelemetry = null;

function matchesProjectQuery(project, rawQuery) {
  const query = textKey(rawQuery);
  if (!query) return true;
  const searchable = textKey(`${project.title} ${project.area} ${project.description} ${project.descriptionEn} ${project.architecture} ${project.technologies.join(' ')}`);
  if (searchable.includes(query)) return true;
  const aliasEntry = Object.entries(profile.techAliases ?? {}).find(([key]) => textKey(key) === query);
  if (aliasEntry) {
    return aliasEntry[1].some((alias) => searchable.includes(textKey(alias)));
  }
  const tokens = query.split(/\s+/).filter((token) => token.length >= 2);
  return tokens.length > 1 && tokens.every((token) => searchable.includes(token));
}

function getRepoTelemetry(project) {
  if (!project.repository) return null;
  return liveRepoIndex[String(project.repository).toLowerCase()] ?? null;
}

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
  const repoMeta = getRepoTelemetry(project);
  const telemetryBadge = repoMeta
    ? `<span class="repo-telemetry-badge" title="Live GitHub repository telemetry">${escapeHtml(repoMeta.language || project.code)}${repoMeta.stars ? ` · ★ ${repoMeta.stars}` : ''}</span>`
    : '';
  return `<article class="project-card${project.featured ? ' is-featured' : ''}" data-project-card data-card-case="${escapeHtml(project.id)}" tabindex="0" role="button" aria-label="${escapeHtml(project.title)} — Inspect architecture" data-search="${escapeHtml(`${project.title} ${project.description} ${project.technologies.join(' ')}`)}" data-categories="${escapeHtml(project.categories.join('|'))}">
    <div class="blueprint" style="--blueprint-accent:${blueprintColors[project.category] ?? '#00f0ff'}" aria-label="Engineering blueprint for ${escapeHtml(project.title)}">
      ${blueprintSvg(project)}<span class="blueprint-label">AZO.OS / ${escapeHtml(project.category.toUpperCase())}</span><span class="blueprint-symbol">${escapeHtml(project.code)}</span><span class="blueprint-code">CASE_${escapeHtml(project.id.slice(0, 8).toUpperCase())}</span>
    </div>
    <div class="project-card-body">
      <div class="project-title-row"><h3>${escapeHtml(project.title)}</h3><div class="project-badges">${project.featured ? '<span class="flagship-badge">★ FLAGSHIP</span>' : ''}${telemetryBadge}<span class="visibility-badge${privateCase ? ' private' : ''}">${escapeHtml(project.visibility)}</span></div></div>
      <p class="project-area">${escapeHtml(project.area)}</p>
      <p class="project-description">${escapeHtml(description)}</p>
      <div class="project-tags">${project.technologies.map((technology) => `<button class="project-tag" type="button" data-tech-query="${escapeHtml(technology)}" title="Filter by ${escapeHtml(technology)}">${escapeHtml(technology)}</button>`).join('')}</div>
      <div class="project-actions"><button class="project-action" type="button" data-open-case="${escapeHtml(project.id)}">Inspect / Architecture</button><a class="project-action" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${privateCase ? 'Profile ↗' : 'GitHub ↗'}</a></div>
    </div>
  </article>`;
}

function renderTelemetryDashboard(data) {
  const isEnglish = language === 'en';
  const metrics = [
    { value: data?.publicRepos ?? '—', label: isEnglish ? 'PUBLIC REPOSITORIES' : 'AÇIK DEPO', note: isEnglish ? 'GitHub account' : 'GitHub hesabı' },
    { value: data?.followers ?? '—', label: isEnglish ? 'FOLLOWERS' : 'TAKİPÇİ', note: isEnglish ? 'Community reach' : 'Topluluk erişimi' },
    { value: data?.totalStars ?? '—', label: isEnglish ? 'REPOSITORY STARS' : 'DEPO YILDIZI', note: isEnglish ? 'Across public repos' : 'Açık depolar toplamı' }
  ];
  const metricMount = document.querySelector('[data-live-metrics]');
  if (metricMount) metricMount.innerHTML = metrics.map((metric, index) => `<article class="telemetry-metric"><span class="telemetry-index">0${index + 1} / LIVE</span><strong data-count-up="${escapeHtml(metric.value)}">${escapeHtml(metric.value)}</strong><span class="telemetry-label">${escapeHtml(metric.label)}</span><small>${escapeHtml(metric.note)}</small></article>`).join('');

  const categoryColors = ['#00F0FF', '#8B7CFF', '#10B981', '#F6B95F'];
  const projectMix = document.querySelector('[data-project-mix]');
  const categoryRows = categories.map((category, index) => ({
    category,
    count: projects.filter((project) => project.categories.includes(category)).length,
    color: categoryColors[index]
  }));
  const projectTotal = categoryRows.reduce((sum, item) => sum + item.count, 0) || 1;
  let angle = 0;
  const stops = categoryRows.map((item) => {
    const from = angle;
    angle += item.count / projectTotal * 360;
    return `${item.color} ${from.toFixed(1)}deg ${angle.toFixed(1)}deg`;
  }).join(', ');
  if (projectMix) projectMix.innerHTML = `<div class="mix-donut" role="img" aria-label="${isEnglish ? 'Distribution of audited projects by engineering track' : 'İncelenen projelerin mühendislik alanlarına göre dağılımı'}" style="--mix-stops:${stops}"><div><strong>${projects.length}</strong><span>${isEnglish ? 'CASE FILES' : 'VAKA'}</span></div></div><ul class="mix-legend">${categoryRows.map((item) => `<li><button type="button" data-discipline-filter="${escapeHtml(item.category)}"><i style="--legend-color:${item.color}"></i><span>${escapeHtml(isEnglish ? item.category : ({ 'AI & Computer Vision': 'Yapay Zekâ & Görüntü', 'Embedded & Robotics': 'Gömülü & Robotik', 'Web & Full-Stack': 'Web & Full-Stack', 'Automation & Systems': 'Otomasyon & Sistemler' }[item.category] ?? item.category))}</span><strong>${item.count}</strong></button></li>`).join('')}</ul>`;

  const languageMount = document.querySelector('[data-language-bars]');
  const languages = (data?.languages ?? []).slice(0, 6);
  const maxCount = Math.max(1, ...languages.map((item) => item.count));
  if (languageMount) languageMount.innerHTML = languages.length
    ? languages.map((item, index) => `<div class="language-row"><div class="language-row-heading"><span><i class="language-swatch" style="--language-color:${categoryColors[index % categoryColors.length]}"></i>${escapeHtml(item.name)}</span><strong>${item.count}</strong></div><div class="language-track"><i style="--bar-size:${Math.max(8, item.count / maxCount * 100)}%;--language-color:${categoryColors[index % categoryColors.length]}"></i></div></div>`).join('')
    : `<p class="telemetry-empty">${isEnglish ? 'Live language data will appear when GitHub responds.' : 'GitHub yanıt verdiğinde dil verileri burada görünecek.'}</p>`;
}

function renderOverview() {
  const mount = byId('view-overview');
  const isEnglish = language === 'en';
  mount.innerHTML = `<header class="hero-panel glass-panel">
    <div class="hero-intro"><span class="eyebrow">${isEnglish ? 'AZO.ISMAIL / SOFTWARE ENGINEERING' : 'AZO.İSMAİL / YAZILIM MÜHENDİSLİĞİ'}</span><h1>${isEnglish ? 'I build systems that' : 'Algılayan, düşünen ve'} <span>${isEnglish ? 'see, think' : 'harekete geçen'}</span>${isEnglish ? ' and act.' : ' sistemler geliştiriyorum.'}</h1><p class="hero-copy">${escapeHtml(isEnglish ? profile.summaryEn : profile.summary)}</p><div class="button-row"><button class="button" type="button" data-view-target="projects">${isEnglish ? 'Explore selected work' : 'Projelerimi keşfet'} <span>→</span></button><button class="button secondary" type="button" data-view-target="contact">${isEnglish ? 'Get in touch' : 'İletişime geç'}</button></div><div class="hero-signature"><span class="status-pulse" aria-hidden="true"></span>${isEnglish ? 'Currently building AI & embedded systems' : 'Şu anda yapay zekâ ve gömülü sistemler geliştiriyor'}</div></div>
    <aside class="hero-aside"><div class="hero-aside-heading"><span class="mono">AZO.OS / SYSTEM MAP</span><span class="hero-live"><i aria-hidden="true"></i> ${isEnglish ? 'ACTIVE' : 'AKTİF'}</span></div><div class="system-map"><img src="./assets/images/azo-system-map.svg" alt="${isEnglish ? 'Diagram linking perception, intelligence, and embedded systems' : 'Algılama, yapay zekâ ve gömülü sistemleri birbirine bağlayan sistem diyagramı'}" width="640" height="440" fetchpriority="high"><span class="system-map-label map-label-vision">01 / ${isEnglish ? 'PERCEPTION' : 'ALGILAMA'}</span><span class="system-map-label map-label-ai">02 / AI</span><span class="system-map-label map-label-embedded">03 / ${isEnglish ? 'EMBEDDED' : 'GÖMÜLÜ'}</span><span class="system-map-core">A/OS</span></div><p class="system-map-caption">${isEnglish ? 'From signal to decision, from software to the physical world.' : 'Sinyalden karara, yazılımdan fiziksel dünyaya.'}</p></aside>
  </header>
  <section class="telemetry-dashboard" aria-labelledby="telemetry-title"><div class="telemetry-heading"><div><span class="eyebrow">${isEnglish ? 'PUBLIC SIGNAL / LIVE DATA' : 'AÇIK SİNYAL / CANLI VERİ'}</span><h2 id="telemetry-title">${isEnglish ? 'Engineering at a glance' : 'Mühendisliğe genel bakış'}</h2></div><span class="telemetry-source"><i></i> ${isEnglish ? 'GITHUB + CASE STUDIES' : 'GITHUB + VAKA DOSYALARI'}</span></div><div class="telemetry-metrics" data-live-metrics></div><div class="insight-grid"><section class="insight-panel project-mix-panel"><div class="insight-panel-heading"><div><span class="mono">01 / PORTFOLIO MIX</span><h3>${isEnglish ? 'Where I build' : 'Çalışma alanlarım'}</h3></div><span class="insight-caption">${isEnglish ? 'AUDITED PROJECTS' : 'İNCELENEN PROJELER'}</span></div><div class="project-mix" data-project-mix></div></section><section class="insight-panel language-panel"><div class="insight-panel-heading"><div><span class="mono">02 / GITHUB SIGNAL</span><h3>${isEnglish ? 'Languages in public repos' : 'Açık depolardaki diller'}</h3></div><span class="insight-caption">${isEnglish ? 'BY REPOSITORY' : 'DEPO SAYISINA GÖRE'}</span></div><div class="language-bars" data-language-bars><p class="telemetry-empty">${isEnglish ? 'Connecting to GitHub…' : 'GitHub’a bağlanılıyor…'}</p></div></section></div></section>
  <div class="section-heading"><h2>Engineering disciplines</h2><span>01—04 / SYSTEMS MAP</span></div>
  <div class="discipline-grid">${profile.disciplines.map((discipline) => {
    return `<button class="discipline-card is-interactive" type="button" data-discipline-filter="${escapeHtml(discipline.category)}"><div class="discipline-card-top"><span class="discipline-code">${escapeHtml(discipline.code)}</span><span class="discipline-count">${isEnglish ? 'EXPLORE TRACK ↗' : 'ALANI İNCELE ↗'}</span></div><h3>${escapeHtml(discipline.title)}</h3><p>${escapeHtml(discipline.description)}</p></button>`;
  }).join('')}</div>
  <div class="section-heading"><h2>Tech stack matrix</h2><span>SELECT A CHIP TO FILTER PROJECTS</span></div>
  <div class="tech-matrix">${profile.techStack.map((group) => `<section class="tech-card"><h3>${escapeHtml(group.category)}</h3><div class="tech-chips">${group.items.map((item) => {
    const isSelected = textKey(projectQuery) === textKey(item);
    return `<button class="tech-chip${isSelected ? ' is-active' : ''}" type="button" data-tech-query="${escapeHtml(item)}"><span>${escapeHtml(item)}</span></button>`;
  }).join('')}</div></section>`).join('')}</div>`;
  renderTelemetryDashboard(githubTelemetry);
}

function renderProjects() {
  const mount = byId('view-projects');
  mount.innerHTML = `<header class="view-header"><div><span class="eyebrow">${language === 'tr' ? 'MÜHENDİSLİK MİMARİLERİ & VAKA DOSYALARI' : 'ENGINEERING ARCHITECTURES & CASE FILES'}</span><h1>Engineering showcase</h1><p>Audited projects across perception, applications, embedded systems and automation. Search by project or technology; open a case file for its documented architecture.</p></div></header>
    <div class="project-toolbar"><label class="search-field"><span>⌕</span><input type="search" data-project-search placeholder="Search projects, descriptions, technologies…" autocomplete="off"><button class="search-clear" type="button" data-clear-search aria-label="Clear filter" hidden>×</button><span class="mono">/</span></label></div>
    <div class="active-filter-bar" data-active-filter-bar hidden></div>
    <section class="category-console" aria-label="Project categories"><div class="category-console-heading"><span>${language === 'tr' ? 'PROJE KATEGORİLERİ' : 'PROJECT CATEGORIES'}</span><span>${language === 'tr' ? 'BİR ALAN SEÇ' : 'SELECT A TRACK'}</span></div><div class="filter-tabs" data-project-filters></div></section><div class="project-grid" data-project-grid></div>`;
  const filterMount = mount.querySelector('[data-project-filters]');
  const categoryInfo = {
    All: { code: '00', icon: '⌘', title: language === 'tr' ? 'Tüm projeler' : 'All projects', note: language === 'tr' ? 'Tüm vaka dosyalarına göz at' : 'Browse all case studies', className: 'all' },
    'AI & Computer Vision': { code: '01', icon: '◉', title: language === 'tr' ? 'Yapay Zekâ' : 'AI & Vision', note: language === 'tr' ? 'Algılama ve makine öğrenmesi' : 'Perception and machine learning', className: 'ai' },
    'Embedded & Robotics': { code: '02', icon: '⌁', title: language === 'tr' ? 'Gömülü Sistemler' : 'Embedded', note: language === 'tr' ? 'Donanım ve gerçek zamanlı sistemler' : 'Hardware and real-time systems', className: 'embedded' },
    'Web & Full-Stack': { code: '03', icon: '▱', title: language === 'tr' ? 'Web ve Full-Stack' : 'Web & Full-Stack', note: language === 'tr' ? 'Uygulamalar ve servisler' : 'Applications and services', className: 'web' },
    'Automation & Systems': { code: '04', icon: '⟳', title: language === 'tr' ? 'Otomasyon' : 'Automation', note: language === 'tr' ? 'İş akışları ve sistem araçları' : 'Workflows and system tools', className: 'automation' }
  };
  const filterButton = ({ value, featured = false, info, active }) => `<button class="filter-tab category-filter category-${info.className}${active ? ' is-active' : ''}" type="button" ${featured ? 'data-featured-filter' : `data-project-filter="${escapeHtml(value)}"`} aria-pressed="${active}"><span class="filter-index">${info.code}</span><span class="filter-icon" aria-hidden="true">${info.icon}</span><span class="filter-copy"><span class="filter-name">${escapeHtml(info.title)}</span><span class="filter-description">${escapeHtml(info.note)}</span></span><span class="filter-arrow" aria-hidden="true">↗</span></button>`;
  const featuredInfo = { code: '★', icon: '✦', title: language === 'tr' ? 'Öne Çıkanlar' : 'Featured', note: language === 'tr' ? 'Amiral gemisi sistemler' : 'Flagship engineering work', className: 'featured' };
  filterMount.innerHTML = filterButton({ value: 'Featured', featured: true, info: featuredInfo, active: featuredOnly }) + ['All', ...categories].map((category) => {
    const info = categoryInfo[category] ?? { code: '05', icon: '•', title: category, note: '', className: 'all' };
    return filterButton({ value: category, info, active: !featuredOnly && category === activeCategory });
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
  const filtered = projects.filter((project) => {
    const categoryMatch = activeCategory === 'All' || project.categories.includes(activeCategory);
    return categoryMatch && (!featuredOnly || project.featured) && matchesProjectQuery(project, projectQuery);
  });
  grid.innerHTML = filtered.length
    ? filtered.map(projectCard).join('')
    : `<div class="empty-state"><p>No project matches this query. Try another technology or category.</p><button class="button secondary" type="button" data-reset-filters>Reset active filters &amp; show all projects</button></div>`;
  const clearBtn = document.querySelector('[data-clear-search]');
  if (clearBtn) clearBtn.hidden = !projectQuery.trim();
  const filterBar = document.querySelector('[data-active-filter-bar]');
  if (filterBar) {
    const pills = [];
    if (featuredOnly) pills.push(`<button class="active-filter-pill" type="button" data-clear-featured>★ Featured <span>×</span></button>`);
    if (!featuredOnly && activeCategory !== 'All') pills.push(`<button class="active-filter-pill" type="button" data-clear-category>${escapeHtml(activeCategory)} <span>×</span></button>`);
    if (projectQuery.trim()) pills.push(`<button class="active-filter-pill" type="button" data-clear-search>⌕ "${escapeHtml(projectQuery.trim())}" <span>×</span></button>`);
    filterBar.hidden = pills.length === 0;
    filterBar.innerHTML = pills.length ? `<span class="mono">ACTIVE FILTER:</span><div class="active-filter-pills">${pills.join('')}<button class="active-filter-reset" type="button" data-reset-filters>Clear filter</button></div>` : '';
  }
  document.querySelectorAll('[data-project-filter]').forEach((button) => {
    const active = !featuredOnly && button.dataset.projectFilter === activeCategory;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  const featuredFilter = document.querySelector('[data-featured-filter]');
  featuredFilter?.classList.toggle('is-active', featuredOnly);
  featuredFilter?.setAttribute('aria-pressed', String(featuredOnly));
  applyLanguage();
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
    </div></form></section><aside class="contact-panel contact-aside"><span class="eyebrow">Direct channels</span><h2>${escapeHtml(profile.name)}</h2><p>${escapeHtml(language === 'en' ? profile.educationEn : profile.education)}<br>${escapeHtml(profile.location)}</p><div class="dock-links"><a class="dock-link" href="mailto:${escapeHtml(profile.email)}"><span style="display:inline-flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>${escapeHtml(profile.email)}</span><span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.github)}" target="_blank" rel="noopener noreferrer"><span style="display:inline-flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.38-3.88-1.38-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.02 11.02 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>GitHub / Azo15</span><span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.linkedin)}" target="_blank" rel="noopener noreferrer"><span style="display:inline-flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg>LinkedIn</span><span>↗</span></a><a class="dock-link" href="${escapeHtml(profile.medium)}" target="_blank" rel="noopener noreferrer"><span style="display:inline-flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M4.28 7.3c.03-.27-.08-.54-.28-.72L2.12 4.3V4h5.84l4.52 9.9L16.45 4H22v.3l-1.6 1.54c-.14.1-.21.28-.18.45v11.42c-.03.17.04.35.18.45l1.57 1.54v.3h-7.88v-.3l1.62-1.58c.16-.16.16-.2.16-.45V8.44L11.34 19.9h-.61L5.48 8.44v7.67c-.04.32.07.65.29.88l2.11 2.56v.3H2v-.3l2.11-2.56c.22-.23.32-.56.27-.88V7.3Z"/></svg>Medium / @azo-dev</span><span>↗</span></a></div></aside></div>`;
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
  const repoMeta = getRepoTelemetry(project);
  const repoTelemetryLine = repoMeta
    ? `<p class="mono" style="margin-bottom:10px">LIVE TELEMETRY · Language: ${escapeHtml(repoMeta.language || 'Multi-language')} · Stars: ★ ${repoMeta.stars} · Forks: ${repoMeta.forks}</p>`
    : '';
  document.querySelector('[data-case-body]').innerHTML = `${pipeline}<section class="case-section"><h3>Problem / engineering goal</h3><p>${escapeHtml(problem)}</p></section><section class="case-section"><h3>Architecture / documented approach</h3><p>${escapeHtml(architecture)}</p></section><section class="case-section"><h3>Technology stack</h3><div class="project-tags">${project.technologies.map((tag) => `<button class="project-tag" type="button" data-tech-query="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join('')}</div></section><section class="case-section"><h3>Repository access</h3>${repoTelemetryLine}<p>${project.visibility === 'Public' ? 'Public repository.' : 'Private repository; this portfolio links to the GitHub profile without exposing the private source URL.'}</p><a class="button ghost" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(project.linkLabel)} ↗</a></section>`;
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
  const data = await getGitHubStats({ refresh });
  githubTelemetry = data;
  liveRepoIndex = data.repoIndex ?? {};
  renderTelemetryDashboard(data);
  applyProjectFilters();
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('button, a, [data-card-case], [data-case-overlay], [data-palette-overlay]');
  if (!target) return;

  if (target.matches('[data-view-target]')) { event.preventDefault(); navigate(target.dataset.viewTarget); return; }
  if (target.matches('[data-brand-home]')) { event.preventDefault(); navigate('overview'); return; }
  if (target.matches('[data-project-filter]')) {
    const selectedCategory = target.dataset.projectFilter;
    activeCategory = selectedCategory;
    featuredOnly = false;
    if (projectQuery.trim()) {
      const hasMatchesWithQuery = projects.some((project) => (selectedCategory === 'All' || project.categories.includes(selectedCategory)) && matchesProjectQuery(project, projectQuery));
      if (!hasMatchesWithQuery || selectedCategory === 'All') {
        projectQuery = '';
        const searchInput = document.querySelector('[data-project-search]');
        if (searchInput) searchInput.value = '';
      }
    }
    applyProjectFilters();
    return;
  }
  if (target.matches('[data-featured-filter]')) {
    featuredOnly = !featuredOnly;
    if (featuredOnly && projectQuery.trim()) {
      const hasFeaturedWithQuery = projects.some((project) => project.featured && matchesProjectQuery(project, projectQuery));
      if (!hasFeaturedWithQuery) {
        projectQuery = '';
        const searchInput = document.querySelector('[data-project-search]');
        if (searchInput) searchInput.value = '';
      }
    }
    applyProjectFilters();
    return;
  }
  if (target.matches('[data-reset-filters]')) {
    projectQuery = '';
    activeCategory = 'All';
    featuredOnly = false;
    const searchInput = document.querySelector('[data-project-search]');
    if (searchInput) searchInput.value = '';
    renderOverview();
    applyProjectFilters();
    return;
  }
  if (target.matches('[data-clear-search]')) {
    projectQuery = '';
    const searchInput = document.querySelector('[data-project-search]');
    if (searchInput) searchInput.value = '';
    renderOverview();
    applyProjectFilters();
    return;
  }
  if (target.matches('[data-clear-category]')) {
    activeCategory = 'All';
    applyProjectFilters();
    return;
  }
  if (target.matches('[data-clear-featured]')) {
    featuredOnly = false;
    applyProjectFilters();
    return;
  }
  if (target.matches('[data-discipline-filter]')) {
    activeCategory = target.dataset.disciplineFilter;
    featuredOnly = false;
    projectQuery = '';
    navigate('projects');
    renderProjects();
    return;
  }
  if (target.matches('[data-metric-action]')) {
    const action = target.dataset.metricAction;
    if (action === 'repos') { window.open(profile.github, '_blank', 'noopener,noreferrer'); return; }
    projectQuery = '';
    activeCategory = 'All';
    featuredOnly = action === 'featured';
    navigate('projects');
    renderProjects();
    return;
  }
  if (target.matches('[data-tech-query]')) {
    closeCase();
    projectQuery = target.dataset.techQuery;
    activeCategory = 'All';
    featuredOnly = false;
    renderOverview();
    navigate('projects');
    renderProjects();
    return;
  }
  if (target.matches('[data-open-case]')) { openCase(target.dataset.openCase); return; }
  if (target.matches('[data-card-case]') && !event.target.closest('a, button')) { openCase(target.dataset.cardCase); return; }
  if (target.matches('[data-close-case]') || event.target === document.querySelector('[data-case-overlay]')) { closeCase(); return; }
  if (target.matches('[data-open-palette]')) { openPalette(); return; }
  if (target.matches('[data-close-palette]') || event.target === document.querySelector('[data-palette-overlay]')) { closePalette(); return; }
  if (target.matches('[data-command-type]')) { selectPaletteCommand(target); return; }
  if (target.matches('[data-gh-refresh]')) { updateGitHubTelemetry(true); return; }
  if (target.matches('[data-lang-toggle]')) { language = language === 'tr' ? 'en' : 'tr'; localStorage.setItem('azo-os-language', language); renderAll(); navigate(currentView, { updateHash: false }); }
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
  if ((event.key === 'Enter' || event.key === ' ') && document.activeElement?.matches('[data-card-case]')) {
    event.preventDefault();
    openCase(document.activeElement.dataset.cardCase);
  }
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
