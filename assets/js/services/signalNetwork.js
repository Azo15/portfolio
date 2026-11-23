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

  scene.addEventListener('pointermove', onPointerMove, { passive: true });
  scene.addEventListener('pointerleave', resetPointer, { passive: true });
}

export function updateSignalNetworkProgress(progress) {
  const network = document.querySelector('[data-network-scene]');
  const signal = network?.querySelector('[data-network-signal]');
  if (!network || !signal) return;

  const point = progress < .5
    ? { x: 145 + (340 - 145) * progress * 2, y: 120 + (240 - 120) * progress * 2 }
    : { x: 340 + (145 - 340) * (progress - .5) * 2, y: 240 + (360 - 240) * (progress - .5) * 2 };
  signal.setAttribute('cx', point.x.toFixed(1));
  signal.setAttribute('cy', point.y.toFixed(1));
}
