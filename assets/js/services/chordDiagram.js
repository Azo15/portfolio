export function renderSignalNetwork(projects, isEnglish, escapeHtml) {
  const featured = projects.filter((project) => project.featured);
  const technologyCounts = new Map();
  for (const project of featured) {
    for (const technology of new Set(project.technologies)) {
      technologyCounts.set(technology, (technologyCounts.get(technology) || 0) + 1);
    }
  }
  const technologies = [...technologyCounts].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const cases = featured.map((project, index) => ({
    key: 'p' + index, label: project.title, value: project.id, technologies: project.technologies
  }));
  const tools = technologies.map(([label], index) => ({ key: 't' + index, label, value: label }));
  const row = (index, count) => (index + .5) * 400 / count;
  const connections = cases.flatMap((source, index) => tools.flatMap((target, targetIndex) => {
    if (!source.technologies.includes(target.label)) return [];
    const from = row(index, cases.length);
    const to = row(targetIndex, tools.length);
    const track = 66 + (index % 3) * 26;
    const direction = Math.sign(to - from);
    const bend = Math.min(14, Math.abs(to - from) / 2);
    const d = `M0 ${from} H${track - bend} Q${track} ${from} ${track} ${from + bend * direction} V${to - bend * direction} Q${track} ${to} ${track + bend} ${to} H240`;
    return `<path class="chord-edge" data-from="${source.key}" data-to="${target.key}" d="${d}"/>`;
  }));
  const renderNode = (node, action) => `<button type="button" class="chord-node chord-${node.key[0]}" data-chord-node="${node.key}" ${action}="${escapeHtml(node.value)}" aria-label="${escapeHtml(node.label)}">${escapeHtml(node.label)}</button>`;
  return `<div class="signal-network chord-network" data-network-scene>
    <div class="chord-legend"><span>${isEnglish ? 'Selected projects' : 'Seçili projeler'}</span><span>${isEnglish ? 'Technologies' : 'Teknolojiler'}</span></div>
    <div class="circuit-board">
      <div class="circuit-rail">${cases.map((node) => renderNode(node, 'data-open-case')).join('')}</div>
      <div class="circuit-wiring"><svg viewBox="0 0 240 400" preserveAspectRatio="none" aria-hidden="true">
        ${connections.join('')}<circle class="chord-signal" r="4" hidden/>
      </svg></div>
      <div class="circuit-rail">${tools.map((node) => renderNode(node, 'data-tech-query')).join('')}</div>
    </div>
    <p class="chord-detail" aria-hidden="true">${isEnglish ? 'Select a project or technology to explore' : 'Keşfetmek için bir proje veya teknoloji seç'}</p>
  </div>`;
}
