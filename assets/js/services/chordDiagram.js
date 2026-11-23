export function renderSignalNetwork(projects, isEnglish, escapeHtml) {
  const featured = projects.filter((project) => project.featured);
  const technologyCounts = new Map();
  for (const project of featured) {
    for (const technology of new Set(project.technologies)) {
      technologyCounts.set(technology, (technologyCounts.get(technology) || 0) + 1);
    }
  }
  const technologies = [...technologyCounts].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const point = (angle, radius) => {
    const radians = angle * Math.PI / 180;
    return [250 + radius * Math.cos(radians), 225 + radius * Math.sin(radians)];
  };
  const nodes = (items, start, sweep, prefix) => items.map((item, index) => {
    const step = sweep / items.length;
    return { item, key: prefix + index, angle: start + step * (index + .5), half: step / 2 - 2 };
  });
  const cases = nodes(featured, 105, 150, 'p');
  const tools = nodes(technologies, -75, 150, 't');
  const connections = cases.flatMap((source) => tools
    .filter(({ item }) => source.item.technologies.includes(item[0]))
    .map((target) => {
      const d = `M${point(source.angle, 151)} C${point(source.angle, 43)} ${point(target.angle, 43)} ${point(target.angle, 151)}`;
      return `<path class="chord-edge" data-from="${source.key}" data-to="${target.key}" d="${d}"/>`;
    }));
  const renderNode = (node, projectSide) => {
    const fullLabel = projectSide ? node.item.title : node.item[0];
    const label = fullLabel.length > 16 ? fullLabel.slice(0, 14).trimEnd() + '…' : fullLabel;
    const [x, y] = point(node.angle, 169);
    const action = projectSide ? 'data-open-case' : 'data-tech-query';
    const value = projectSide ? node.item.id : fullLabel;
    const d = `M${point(node.angle - node.half, 157)} A157 157 0 0 1 ${point(node.angle + node.half, 157)}`;
    return `<g class="chord-node chord-${node.key[0]}" tabindex="0" role="button" aria-label="${escapeHtml(fullLabel)}" data-chord-node="${node.key}" ${action}="${escapeHtml(value)}"><title>${escapeHtml(fullLabel)}</title><path class="chord-arc-hit" d="${d}"/><path class="chord-arc" d="${d}"/><text x="${x}" y="${y}" transform="rotate(${projectSide ? node.angle - 180 : node.angle} ${x} ${y})" text-anchor="${projectSide ? 'end' : 'start'}" dominant-baseline="middle">${escapeHtml(label)}</text></g>`;
  };
  return `<div class="signal-network chord-network" data-network-scene>
    <div class="chord-legend"><span>${isEnglish ? 'Selected projects' : 'Seçili projeler'}</span><span>${isEnglish ? 'Technologies' : 'Teknolojiler'}</span></div>
    <svg viewBox="0 0 500 450" role="group" aria-label="${isEnglish ? 'Project and technology relationships' : 'Proje ve teknoloji ilişkileri'}">
      <circle class="chord-guide" cx="250" cy="225" r="140"/>
      <g aria-hidden="true">${connections.join('')}<circle class="chord-signal" r="3" hidden/></g>
      ${cases.map((node) => renderNode(node, true)).join('')}
      ${tools.map((node) => renderNode(node, false)).join('')}
    </svg>
    <p class="chord-detail" aria-hidden="true">${isEnglish ? 'Select an arc to explore' : 'Keşfetmek için bir yay seç'}</p>
  </div>`;
}
