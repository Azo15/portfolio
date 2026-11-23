let autoScanTimer = 0;
let packetAnimFrame = 0;

export function bindSignalNetwork() {
  const scene = document.querySelector('[data-network-scene]');
  if (!scene) return;

  if (autoScanTimer) clearInterval(autoScanTimer);
  if (packetAnimFrame) cancelAnimationFrame(packetAnimFrame);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = [...scene.querySelectorAll('[data-chord-node]')];
  const projectNodes = nodes.filter((node) => node.dataset.nodeKind === 'project');
  const edges = [...scene.querySelectorAll('.chord-edge')];

  const coreCode = scene.querySelector('[data-core-code]');
  const coreTitle = scene.querySelector('[data-core-title]');
  const coreLinks = scene.querySelector('[data-core-links]');
  const coreReactor = scene.querySelector('[data-core-reactor]');

  const hudCode = scene.querySelector('[data-hud-code]');
  const hudLock = scene.querySelector('[data-hud-lock]');
  const hudPipeline = scene.querySelector('[data-hud-pipeline]');
  const hudTitle = scene.querySelector('[data-hud-title]');
  const hudDesc = scene.querySelector('[data-hud-desc]');
  const hudCta = scene.querySelector('[data-hud-cta]');
  const hudCtaLabel = scene.querySelector('[data-hud-cta-label]');

  const defaultCoreCode = coreCode?.textContent || 'AZO.OS // CORE';
  const defaultCoreTitle = coreTitle?.textContent || 'NEURAL BUS';
  const defaultCoreLinks = coreLinks?.textContent || `${edges.length} SYNAPSES`;
  const defaultHudCode = hudCode?.textContent || 'AZO.OS // TELEMETRY';
  const defaultHudTitle = hudTitle?.textContent || '';
  const defaultHudDesc = hudDesc?.textContent || '';

  const isTr = document.documentElement.lang === 'tr';

  let lockedNode = null;
  let activeNode = null;
  let autoScanEnabled = !reduceMotion.matches;
  let autoScanIndex = 0;
  let pointerInside = false;
  let activeSector = 'all';

  const applyCtaForNode = (node) => {
    if (!hudCta || !node) {
      if (hudCta) hudCta.hidden = true;
      return;
    }
    const kind = node.dataset.nodeKind;
    const actionVal = node.dataset.nodeAction;
    hudCta.hidden = false;
    if (kind === 'project') {
      hudCta.removeAttribute('data-tech-query');
      hudCta.setAttribute('data-open-case', actionVal);
      if (hudCtaLabel) hudCtaLabel.textContent = isTr ? 'Mimariyi Aç' : 'Inspect Architecture';
    } else {
      hudCta.removeAttribute('data-open-case');
      hudCta.setAttribute('data-tech-query', actionVal);
      if (hudCtaLabel) hudCtaLabel.textContent = isTr ? 'Bu Teknolojiyi Filtrele' : 'Filter by Technology';
    }
  };

  const highlight = (node, { isLocked = false } = {}) => {
    activeNode = node;
    const key = node?.dataset.chordNode;
    const related = new Set(key ? [key] : []);
    let matchCount = 0;

    for (const edge of edges) {
      const { from, to, sector } = edge.dataset;
      const sectorMatch = activeSector === 'all' || sector === activeSector;
      const matches = key ? (from === key || to === key) : false;
      edge.classList.toggle('is-related', matches);
      edge.classList.toggle('is-sector-dimmed', !key && !sectorMatch);
      if (matches) {
        related.add(from);
        related.add(to);
        matchCount++;
      }
    }

    for (const item of nodes) {
      const itemSector = item.dataset.sector;
      const sectorMatch = activeSector === 'all' || itemSector === activeSector;
      item.classList.toggle('is-related', related.has(item.dataset.chordNode));
      item.classList.toggle('is-pinned', isLocked && item === node);
      item.classList.toggle('is-sector-dimmed', !key && !sectorMatch);
    }

    scene.classList.toggle('is-exploring', Boolean(node));

    if (node) {
      const title = node.dataset.nodeTitle || '';
      const code = node.dataset.nodeCode || 'AZO.OS';
      const summary = node.dataset.nodeSummary || '';
      const pipeline = node.dataset.nodePipeline || '';
      const color = node.dataset.nodeColor || '#00f0ff';
      const shortCore = title.length > 15 ? title.slice(0, 14).trimEnd() + '…' : title;

      if (coreReactor) coreReactor.style.setProperty('--core-accent', color);
      if (coreCode) coreCode.textContent = code;
      if (coreTitle) coreTitle.textContent = shortCore;
      if (coreLinks) coreLinks.textContent = `${matchCount} ${isTr ? 'BAĞLANTI' : 'LINKS'}`;

      if (hudCode) {
        hudCode.textContent = code;
        hudCode.style.setProperty('--hud-accent', color);
      }
      if (hudLock) hudLock.hidden = !isLocked;
      if (hudPipeline) hudPipeline.textContent = pipeline ? `// ${pipeline}` : '';
      if (hudTitle) hudTitle.textContent = title;
      if (hudDesc) hudDesc.textContent = summary;
      applyCtaForNode(node);
    } else {
      if (coreReactor) coreReactor.style.removeProperty('--core-accent');
      if (coreCode) coreCode.textContent = defaultCoreCode;
      if (coreTitle) coreTitle.textContent = defaultCoreTitle;
      if (coreLinks) coreLinks.textContent = defaultCoreLinks;

      if (hudCode) {
        hudCode.textContent = defaultHudCode;
        hudCode.style.removeProperty('--hud-accent');
      }
      if (hudLock) hudLock.hidden = true;
      if (hudPipeline) hudPipeline.textContent = '';
      if (hudTitle) hudTitle.textContent = defaultHudTitle;
      if (hudDesc) hudDesc.textContent = defaultHudDesc;
      if (hudCta) hudCta.hidden = true;
    }
  };

  for (const node of nodes) {
    node.addEventListener('pointerenter', () => {
      if (lockedNode) return;
      highlight(node, { isLocked: false });
    });

    node.addEventListener('pointerleave', () => {
      if (lockedNode) return;
      highlight(null);
    });

    node.addEventListener('focus', () => {
      if (lockedNode) return;
      highlight(node, { isLocked: false });
    });

    node.addEventListener('blur', () => {
      if (lockedNode) return;
      highlight(null);
    });

    node.addEventListener('click', (event) => {
      event.stopPropagation();
      if (lockedNode === node) {
        // Second click on pinned node triggers its primary action (open case study or filter tech)
        const kind = node.dataset.nodeKind;
        const val = node.dataset.nodeAction;
        if (kind === 'project' && hudCta) {
          hudCta.click();
        } else if (kind === 'tech' && hudCta) {
          hudCta.click();
        }
        return;
      }
      lockedNode = node;
      highlight(node, { isLocked: true });
    });

    node.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      node.click();
    });
  }

  // Sector filter pills
  const sectorBtns = [...scene.querySelectorAll('[data-wheel-sector]')];
  for (const btn of sectorBtns) {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      activeSector = btn.dataset.wheelSector || 'all';
      lockedNode = null;
      sectorBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      const candidate = activeSector === 'all'
        ? null
        : projectNodes.find((n) => n.dataset.sector === activeSector) || null;
      highlight(candidate, { isLocked: false });
    });
  }

  // Auto-scan toggle button
  const autoScanBtn = scene.querySelector('[data-wheel-autoscan]');
  if (autoScanBtn) {
    autoScanBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      autoScanEnabled = !autoScanEnabled;
      autoScanBtn.classList.toggle('is-active', autoScanEnabled);
      autoScanBtn.setAttribute('aria-pressed', String(autoScanEnabled));
      if (!autoScanEnabled && !lockedNode) highlight(null);
    });
  }

  // Clicking empty background inside the SVG unlocks pinned node
  const svgEl = scene.querySelector('svg');
  svgEl?.addEventListener('click', (event) => {
    if (!event.target.closest('[data-chord-node]') && lockedNode) {
      lockedNode = null;
      highlight(null);
    }
  });

  // 3D Parallax tilt
  const onPointerMove = (event) => {
    if (reduceMotion.matches || event.pointerType !== 'mouse') return;
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    scene.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
    scene.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
    scene.style.setProperty('--tilt-x', `${((x - 0.5) * 3.5).toFixed(2)}deg`);
    scene.style.setProperty('--tilt-y', `${((0.5 - y) * 2.8).toFixed(2)}deg`);
  };

  const resetPointer = () => {
    scene.style.setProperty('--pointer-x', '50%');
    scene.style.setProperty('--pointer-y', '50%');
    scene.style.setProperty('--tilt-x', '0deg');
    scene.style.setProperty('--tilt-y', '0deg');
  };

  scene.addEventListener('pointerenter', () => { pointerInside = true; }, { passive: true });
  scene.addEventListener('pointerleave', () => {
    pointerInside = false;
    resetPointer();
  }, { passive: true });
  scene.addEventListener('pointermove', onPointerMove, { passive: true });

  // Autonomous Radar Cycle every 3.2 seconds when idle
  if (projectNodes.length > 0) {
    highlight(projectNodes[0], { isLocked: false });
    autoScanTimer = window.setInterval(() => {
      if (!autoScanEnabled || pointerInside || lockedNode || document.hidden) return;
      const pool = activeSector === 'all'
        ? projectNodes
        : projectNodes.filter((n) => n.dataset.sector === activeSector);
      if (!pool.length) return;
      autoScanIndex = (autoScanIndex + 1) % pool.length;
      highlight(pool[autoScanIndex], { isLocked: false });
    }, 3200);
  }

  // Continuous Traveling Signal Packets along active synaptic edges
  const primarySignal = scene.querySelector('.chord-signal:not(.chord-signal-secondary)');
  const secondarySignal = scene.querySelector('.chord-signal-secondary');
  let phase = 0;

  const animatePackets = () => {
    if (reduceMotion.matches || !document.body.contains(scene)) return;
    phase = (phase + 0.012) % 1;
    const activeEdges = edges.filter((e) => e.classList.contains('is-related'));
    const pool = activeEdges.length ? activeEdges : edges;

    if (pool.length && primarySignal) {
      const e1 = pool[Math.floor((phase * pool.length)) % pool.length];
      const len1 = e1.getTotalLength();
      const pt1 = e1.getPointAtLength(len1 * ((phase * 2) % 1));
      primarySignal.removeAttribute('hidden');
      primarySignal.setAttribute('cx', pt1.x.toFixed(1));
      primarySignal.setAttribute('cy', pt1.y.toFixed(1));
    }

    if (pool.length > 1 && secondarySignal) {
      const e2 = pool[(Math.floor(phase * pool.length) + 1) % pool.length];
      const len2 = e2.getTotalLength();
      const pt2 = e2.getPointAtLength(len2 * (1 - ((phase * 1.7) % 1)));
      secondarySignal.removeAttribute('hidden');
      secondarySignal.setAttribute('cx', pt2.x.toFixed(1));
      secondarySignal.setAttribute('cy', pt2.y.toFixed(1));
    }

    packetAnimFrame = requestAnimationFrame(animatePackets);
  };

  if (!reduceMotion.matches) {
    packetAnimFrame = requestAnimationFrame(animatePackets);
  }
}

export function updateSignalNetworkProgress(progress) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const network = document.querySelector('[data-network-scene]');
  const sweep = network?.querySelector('.chord-radar-sweep');
  if (!sweep) return;
  const deg = Math.round(Math.max(0, Math.min(1, progress)) * 360);
  sweep.style.transform = `rotate(${deg}deg)`;
}
