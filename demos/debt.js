const files = [
  { name: 'services/checkout.py', scores: [29, 41, 55, 63, 78, 87], finding: 'Fiyat hesaplama ve sipariş doğrulamayı ayrı işlevlere taşı. İndirim kurallarına bağımsız testler ekle.' },
  { name: 'reports/monthly.py', scores: [52, 56, 63, 58, 49, 44], finding: 'Tekrarlanan veri dönüştürme adımlarını tek bir işlevde topla.' },
  { name: 'utils/dates.py', scores: [12, 14, 17, 19, 16, 15], finding: 'Zaman dilimi ve ay sonu sınırları için regresyon testleri ekle.' }
];

const fileList = document.querySelector('#files');
const buttons = files.map((file) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = file.name;
  button.addEventListener('click', () => selectFile(file));
  fileList.append(button);
  return button;
});

function selectFile(file) {
  for (const [index, button] of buttons.entries()) {
    button.setAttribute('aria-pressed', String(files[index] === file));
  }
  document.querySelector('#file-title').textContent = file.name;
  document.querySelector('#score').textContent = `Son skor: ${file.scores.at(-1)} / 100`;
  document.querySelector('#finding').textContent = file.finding;
  const bars = file.scores.map((score, index) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.style.height = `${score}%`;
    fill.textContent = score;
    const label = document.createElement('small');
    label.textContent = `C${index + 1}`;
    bar.append(fill, label);
    return bar;
  });
  document.querySelector('#bars').replaceChildren(...bars);
}

selectFile(files[0]);
