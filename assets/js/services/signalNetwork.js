export function bindSignalNetwork() {
  const scene = document.querySelector('[data-network-scene]');
  if (!scene) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onPointerMove = (event) => {
    if (reduceMotion.matches || event.pointerType !== 'mouse') return;
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    scene.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
    scene.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
    scene.style.setProperty('--tilt-x', `${((x - .5) * 4).toFixed(2)}deg`);
    scene.style.setProperty('--tilt-y', `${((.5 - y) * 3).toFixed(2)}deg`);
  };
  const resetPointer = () => {
    scene.style.setProperty('--pointer-x', '50%');
    scene.style.setProperty('--pointer-y', '50%');
    scene.style.setProperty('--tilt-x', '0deg');
    scene.style.setProperty('--tilt-y', '0deg');
  };

  const nodes = [...scene.querySelectorAll('[data-chord-node]')];
  const edges = [...scene.querySelectorAll('.chord-edge')];
  const detail = scene.querySelector('.chord-detail');
  const hint = detail.textContent;

  const highlight = (node) => {
    const key = node?.dataset.chordNode;
    const related = new Set(key ? [key] : []);
    for (const edge of edges) {
      const { from, to } = edge.dataset;
      const matches = from === key || to === key;
      edge.classList.toggle('is-related', matches);
      if (matches) {
        related.add(from);
        related.add(to);
      }
    }
    for (const item of nodes) {
      item.classList.toggle('is-related', related.has(item.dataset.chordNode));
    }
    scene.classList.toggle('is-exploring', Boolean(node));
    detail.textContent = node?.getAttribute('aria-label') || hint;
  };

  for (const node of nodes) {
    node.addEventListener('pointerenter', () => highlight(node));
    node.addEventListener('pointerleave', () => highlight(nodes.find((item) => item.matches(':focus-visible'))));
    node.addEventListener('focus', () => highlight(node));
    node.addEventListener('blur', () => highlight(null));
    node.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  }

  scene.addEventListener('pointermove', onPointerMove, { passive: true });
  scene.addEventListener('pointerleave', resetPointer, { passive: true });
}

export function updateSignalNetworkProgress(progress) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const network = document.querySelector('[data-network-scene]');
  const signal = network?.querySelector('.chord-signal');
  const edges = network?.querySelectorAll('.chord-edge');
  if (!signal || !edges?.length) return;

  const position = Math.max(0, Math.min(1, progress)) * edges.length;
  const index = Math.min(edges.length - 1, Math.floor(position));
  const edge = edges[index];
  const point = edge.getPointAtLength(edge.getTotalLength() * (position - index));
  signal.removeAttribute('hidden');
  signal.setAttribute('cx', point.x.toFixed(1));
  signal.setAttribute('cy', point.y.toFixed(1));
}
