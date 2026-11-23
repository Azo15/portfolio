const SECTOR_CONFIG = {
  'AI & Computer Vision': {
    id: 'ai',
    code: '01 / AI & VISION',
    shortCode: '01 / AI',
    labelEn: 'AI & COMPUTER VISION',
    labelTr: 'YAPAY ZEKÂ & GÖRÜNTÜ İŞLEME',
    color: '#00f0ff'
  },
  'Embedded & Robotics': {
    id: 'embedded',
    code: '02 / SILICON & IOT',
    shortCode: '02 / EMB',
    labelEn: 'EMBEDDED & ROBOTICS',
    labelTr: 'GÖMÜLÜ SİSTEMLER & ROBOTİK',
    color: '#10b981'
  },
  'Web & Full-Stack': {
    id: 'web',
    code: '03 / FULL-STACK',
    shortCode: '03 / WEB',
    labelEn: 'WEB & BACKEND ARCHITECTURE',
    labelTr: 'WEB & BACKEND MİMARİSİ',
    color: '#8b5cf6'
  },
  'Automation & Systems': {
    id: 'auto',
    code: '04 / AUTOMATION',
    shortCode: '04 / SYS',
    labelEn: 'AUTOMATION & WORKFLOWS',
    labelTr: 'OTOMASYON & SİSTEM ARAÇLARI',
    color: '#f59e0b'
  }
};

const CURATED_PROJECT_IDS = [
  'software-health-technical-debt-analyzer',
  'hospital-ai-no-show-risk-analysis',
  'coin-detection-currency-prototype',
  'smart-driver-monitoring-system',
  'face-recognition-matching',
  'laravel-library-management-system',
  'modern-blog-spa-cms',
  'omnibrain-ai-assistant',
  'planet-knowledge-base-fca'
];

const SHORT_NAMES = {
  'software-health-technical-debt-analyzer': 'Software Debt AI',
  'hospital-ai-no-show-risk-analysis': 'Hospital Risk AI',
  'coin-detection-currency-prototype': 'Coin Vision CV',
  'smart-driver-monitoring-system': 'Smart Driver IoT',
  'face-recognition-matching': 'Face Recognition',
  'laravel-library-management-system': 'Laravel 11 Library',
  'modern-blog-spa-cms': '.NET 9 Enterprise',
  'omnibrain-ai-assistant': 'OmniBrain n8n AI',
  'planet-knowledge-base-fca': 'Prolog FCA Engine'
};

const PRIMARY_SECTOR_OVERRIDE = {
  'smart-driver-monitoring-system': 'Embedded & Robotics',
  'face-recognition-matching': 'Embedded & Robotics'
};

export function renderSignalNetwork(projects, isEnglish, escapeHtml) {
  const curated = CURATED_PROJECT_IDS
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);

  const selectedProjects = curated.length >= 6 ? curated : projects.filter((project) => project.featured);

  const techFreq = new Map();
  const techSector = new Map();
  for (const project of selectedProjects) {
    const sectorName = PRIMARY_SECTOR_OVERRIDE[project.id] || project.category;
    for (const tech of project.technologies.slice(0, 5)) {
      techFreq.set(tech, (techFreq.get(tech) || 0) + 1);
      if (!techSector.has(tech)) techSector.set(tech, sectorName);
    }
  }

  const topTechs = [...techFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({
      name,
      count,
      sector: techSector.get(name) || 'AI & Computer Vision'
    }));

  // High-definition wide coordinate system (960 x 560) for crisp vector & typography rendering
  const cx = 480;
  const cy = 278;
  const outerR = 202;
  const innerR = 132;
  const coreR = 72;

  const polar = (angleDeg, radius) => {
    const rad = (angleDeg * Math.PI) / 180;
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };

  const arcPath = (startAngle, endAngle, radius) => {
    const [x1, y1] = polar(startAngle, radius);
    const [x2, y2] = polar(endAngle, radius);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${radius} ${radius} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };

  const buildArcNodes = (items, startDeg, totalSweep, radius, prefix) => {
    const step = totalSweep / items.length;
    return items.map((item, idx) => {
      const center = startDeg + step * (idx + 0.5);
      const half = Math.max(3.5, step * 0.41);
      return {
        item,
        key: `${prefix}${idx}`,
        angle: center,
        start: center - half,
        end: center + half,
        radius
      };
    });
  };

  const projectNodes = buildArcNodes(selectedProjects, 104, 152, outerR, 'p');
  const techNodes = buildArcNodes(topTechs, -76, 152, outerR, 't');

  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = i * 7.5;
    const isMajor = i % 4 === 0;
    const [x1, y1] = polar(a, innerR - 6);
    const [x2, y2] = polar(a, innerR + (isMajor ? 7 : 3));
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="telemetry-tick${isMajor ? ' is-major' : ''}"/>`;
  }).join('');

  const edges = [];
  for (const pNode of projectNodes) {
    const sectorName = PRIMARY_SECTOR_OVERRIDE[pNode.item.id] || pNode.item.category;
    const sector = SECTOR_CONFIG[sectorName] || SECTOR_CONFIG['AI & Computer Vision'];
    const [sx, sy] = polar(pNode.angle, outerR - 10);
    const [c1x, c1y] = polar(pNode.angle, coreR + 22);

    for (const tNode of techNodes) {
      if (!pNode.item.technologies.includes(tNode.item.name)) continue;
      const [tx, ty] = polar(tNode.angle, outerR - 10);
      const [c2x, c2y] = polar(tNode.angle, coreR + 22);
      const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`;
      edges.push(
        `<path class="chord-edge" data-from="${pNode.key}" data-to="${tNode.key}" data-sector="${sector.id}" style="--edge-color:${sector.color}" d="${d}"/>`
      );
    }
  }

  const renderNode = (node, isProject) => {
    const sectorName = isProject
      ? (PRIMARY_SECTOR_OVERRIDE[node.item.id] || node.item.category)
      : node.item.sector;
    const sector = SECTOR_CONFIG[sectorName] || SECTOR_CONFIG['AI & Computer Vision'];
    const fullTitle = isProject ? node.item.title : node.item.name;
    const shortTitle = isProject ? (SHORT_NAMES[node.item.id] || fullTitle.slice(0, 18)) : fullTitle;
    const codeTag = isProject ? `SYS_${String(Number(node.key.slice(1)) + 1).padStart(2, '0')} // ${sector.shortCode}` : `TECH // ${sector.shortCode}`;
    const summary = isProject
      ? (isEnglish ? node.item.descriptionEn : node.item.description)
      : (isEnglish
          ? `Core technology node connected across ${node.item.count} flagship systems in the Azo.OS architecture.`
          : `Azo.OS mimarisindeki ${node.item.count} amiral gemisi sistemde aktif görev yapan çekirdek teknoloji düğümü.`);
    const pipelineStr = isProject && node.item.pipeline ? node.item.pipeline.join(' → ') : (isProject ? node.item.technologies.join(' · ') : '');

    const d = arcPath(node.start, node.end, node.radius);
    const [dotX, dotY] = polar(node.angle, innerR);
    const [spokeX, spokeY] = polar(node.angle, outerR - 9);
    const [elbowX, elbowY] = polar(node.angle, outerR + 18);
    const isLeft = Math.cos((node.angle * Math.PI) / 180) < 0;
    const labelX = elbowX + (isLeft ? -22 : 22);
    const labelY = elbowY;

    const actionAttr = isProject
      ? `data-node-kind="project" data-node-action="${escapeHtml(node.item.id)}"`
      : `data-node-kind="tech" data-node-action="${escapeHtml(fullTitle)}"`;

    const badgeWidth = Math.min(204, Math.max(124, shortTitle.length * 8.6 + 28));
    const badgeHeight = 30;
    const badgeX = isLeft ? labelX - badgeWidth : labelX;

    return `<g class="chord-node chord-${isProject ? 'p' : 't'}" tabindex="0" role="button"
      aria-label="${escapeHtml(fullTitle)}"
      data-chord-node="${node.key}"
      data-sector="${sector.id}"
      data-node-title="${escapeHtml(fullTitle)}"
      data-node-code="${escapeHtml(sector.code)}"
      data-node-summary="${escapeHtml(summary)}"
      data-node-pipeline="${escapeHtml(pipelineStr)}"
      data-node-color="${sector.color}"
      ${actionAttr}
      style="--arc:${sector.color}">
      <title>${escapeHtml(fullTitle)}</title>
      <line class="chord-spoke" x1="${dotX.toFixed(1)}" y1="${dotY.toFixed(1)}" x2="${spokeX.toFixed(1)}" y2="${spokeY.toFixed(1)}"/>
      <circle class="chord-inner-node" cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="4"/>
      <path class="chord-arc-hit" d="${d}"/>
      <path class="chord-arc" d="${d}"/>
      <polyline class="chord-leader" points="${spokeX.toFixed(1)},${spokeY.toFixed(1)} ${elbowX.toFixed(1)},${elbowY.toFixed(1)} ${labelX.toFixed(1)},${labelY.toFixed(1)}"/>
      <circle class="chord-leader-joint" cx="${elbowX.toFixed(1)}" cy="${elbowY.toFixed(1)}" r="2.3"/>
      <rect class="chord-label-pill" x="${badgeX.toFixed(1)}" y="${(labelY - badgeHeight / 2).toFixed(1)}" width="${badgeWidth.toFixed(1)}" height="${badgeHeight}" rx="8"/>
      <text class="chord-label-text" x="${(isLeft ? labelX - 12 : labelX + 12).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="${isLeft ? 'end' : 'start'}" dominant-baseline="central">${escapeHtml(shortTitle)}</text>
      <text class="chord-code-tag" x="${(isLeft ? badgeX + 8 : badgeX + badgeWidth - 8).toFixed(1)}" y="${(labelY - badgeHeight / 2 - 5).toFixed(1)}" text-anchor="${isLeft ? 'start' : 'end'}">${escapeHtml(codeTag)}</text>
    </g>`;
  };

  const sectorButtons = [
    { id: 'all', label: isEnglish ? 'ALL SECTORS' : 'TÜM SEKTÖRLER', color: '#00f0ff' },
    { id: 'ai', label: '01 / AI & VISION', color: '#00f0ff' },
    { id: 'embedded', label: '02 / EMBEDDED & IOT', color: '#10b981' },
    { id: 'web', label: '03 / FULL-STACK', color: '#8b5cf6' },
    { id: 'auto', label: '04 / AUTOMATION', color: '#f59e0b' }
  ];

  return `<div class="signal-network chord-network" data-network-scene>
    <div class="telemetry-wheel-bar">
      <div class="wheel-sector-pills" role="tablist" aria-label="${isEnglish ? 'Filter telemetry sectors' : 'Telemetri sektörlerini filtrele'}">
        ${sectorButtons.map((btn, idx) => `<button type="button" class="wheel-sector-pill${idx === 0 ? ' is-active' : ''}" data-wheel-sector="${btn.id}" style="--pill-color:${btn.color}">${escapeHtml(btn.label)}</button>`).join('')}
      </div>
      <div class="wheel-toolbar-right">
        <span class="wheel-side-hint">← ${isEnglish ? 'SYSTEMS' : 'SİSTEMLER'} · ${isEnglish ? 'TECH STACK' : 'TEKNOLOJİLER'} →</span>
        <button type="button" class="wheel-autoscan-btn is-active" data-wheel-autoscan aria-pressed="true" title="${isEnglish ? 'Toggle autonomous neural scan' : 'Otonom nöral taramayı aç/kapat'}">
          <span class="autoscan-dot" aria-hidden="true"></span>
          <span>${isEnglish ? 'AUTO-SCAN' : 'OTO-TARAMA'}</span>
        </button>
      </div>
    </div>

    <svg class="telemetry-wheel-svg" viewBox="0 0 960 556" role="group" aria-label="${isEnglish ? 'AZO.OS Neural-Silicon Telemetry Wheel' : 'AZO.OS Nöral-Silikon Telemetri Çarkı'}">
      <defs>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(0, 240, 255, 0.24)"/>
          <stop offset="55%" stop-color="rgba(16, 185, 129, 0.07)"/>
          <stop offset="100%" stop-color="rgba(6, 12, 24, 0)"/>
        </radialGradient>
      </defs>

      <!-- Corner HUD Brackets -->
      <g class="hud-corner-brackets" aria-hidden="true">
        <path d="M 22 44 V 20 H 54"/>
        <path d="M 938 44 V 20 H 906"/>
        <path d="M 22 512 V 536 H 54"/>
        <path d="M 938 512 V 536 H 906"/>
      </g>

      <!-- Ambient Radar & Dual Concentric Rings -->
      <circle cx="${cx}" cy="${cy}" r="${outerR + 36}" fill="url(#core-glow)" pointer-events="none"/>
      <circle class="chord-guide-outer" cx="${cx}" cy="${cy}" r="${outerR}"/>
      <circle class="chord-guide" cx="${cx}" cy="${cy}" r="${innerR}"/>
      <circle class="chord-radar-sweep" cx="${cx}" cy="${cy}" r="${(outerR + innerR) / 2}"/>
      <g class="telemetry-ticks" aria-hidden="true">${ticks}</g>

      <!-- Synaptic Edges & Animated Signal Packets -->
      <g class="chord-edges-layer" aria-hidden="true">
        ${edges.join('')}
        <circle class="chord-signal" r="4.5" hidden/>
        <circle class="chord-signal chord-signal-secondary" r="3.6" hidden/>
      </g>

      <!-- Center AZO.OS Core Reactor HUD -->
      <g class="azo-core-reactor" data-core-reactor transform="translate(${cx}, ${cy})">
        <circle class="core-outer-ring" r="${coreR}"/>
        <circle class="core-spin-ring" r="${coreR - 8}"/>
        <circle class="core-inner-disc" r="${coreR - 15}"/>
        <text class="core-hud-eyebrow" data-core-code y="-20" text-anchor="middle">AZO.OS // CORE</text>
        <text class="core-hud-title" data-core-title y="4" text-anchor="middle">${isEnglish ? 'NEURAL BUS' : 'NÖRAL AĞ'}</text>
        <text class="core-hud-sub" data-core-links y="25" text-anchor="middle">${edges.length} ${isEnglish ? 'SYNAPSES' : 'SİNAPS'}</text>
      </g>

      <!-- Left Flagship System Nodes & Right Tech Nodes -->
      ${projectNodes.map((node) => renderNode(node, true)).join('')}
      ${techNodes.map((node) => renderNode(node, false)).join('')}
    </svg>

    <!-- Bottom Interactive Telemetry HUD Console -->
    <div class="wheel-hud-console" data-wheel-console>
      <div class="wheel-hud-info">
        <div class="wheel-hud-top">
          <span class="wheel-hud-badge" data-hud-code>AZO.OS // TELEMETRY</span>
          <span class="wheel-hud-lock" data-hud-lock hidden>${isEnglish ? 'PINNED NODE' : 'SABİTLENDİ'}</span>
          <span class="wheel-hud-pipeline" data-hud-pipeline></span>
        </div>
        <h3 class="wheel-hud-title" data-hud-title>${isEnglish ? 'Select or hover any system node to inspect its architecture' : 'Mimari akışı incelemek için çark üzerinden bir sistem veya teknoloji seçin'}</h3>
        <p class="wheel-hud-desc" data-hud-desc>${isEnglish ? 'Autonomous radar is scanning flagship systems on the left and lighting up their connected technology stack on the right.' : 'Otonom radar soldaki amiral gemisi sistemleri tarıyor ve sağdaki bağlı teknoloji düğümlerini gerçek zamanlı ateşliyor.'}</p>
      </div>
      <div class="wheel-hud-actions">
        <button type="button" class="button wheel-hud-cta" data-hud-cta hidden>
          <span data-hud-cta-label>${isEnglish ? 'Inspect Architecture' : 'Mimariyi Aç'}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  </div>`;
}
