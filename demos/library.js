const catalog = [
  { title: 'Kürk Mantolu Madonna', author: 'Sabahattin Ali' },
  { title: 'Saatleri Ayarlama Enstitüsü', author: 'Ahmet Hamdi Tanpınar' },
  { title: 'Tutunamayanlar', author: 'Oğuz Atay' }
];
const requests = new Map();
const search = document.querySelector('#search');
const message = document.querySelector('#message');
const bookList = document.querySelector('#books');
const requestList = document.querySelector('#requests');

function row(title, detail, action, handler) {
  const item = document.createElement('li');
  item.className = 'book';
  const heading = document.createElement('strong');
  const subtitle = document.createElement('small');
  heading.textContent = title;
  subtitle.textContent = detail;
  item.append(heading, subtitle);
  if (handler) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = action;
    button.addEventListener('click', handler);
    item.append(button);
  }
  return item;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase('tr');
  const books = catalog.filter((book) => `${book.title} ${book.author}`.toLocaleLowerCase('tr').includes(query));
  bookList.replaceChildren(...books.map((book) => {
    const state = requests.get(book.title);
    const detail = state === 'approved' ? 'Ödünçte' : state === 'pending' ? 'Onay bekliyor' : 'Stokta';
    return row(book.title, `${book.author} · ${detail}`, 'Ödünç iste', state ? null : () => {
      requests.set(book.title, 'pending');
      message.textContent = `${book.title} için istek oluşturuldu.`;
      render();
    });
  }));
  if (!books.length) bookList.append(row('Sonuç bulunamadı', 'Başka bir kitap ya da yazar ara.'));
  requestList.replaceChildren(...Array.from(requests, ([title, state]) =>
    row(title, state === 'approved' ? 'Onaylandı' : 'Onay bekliyor', 'Yönetici olarak onayla', state === 'pending' ? () => {
      requests.set(title, 'approved');
      message.textContent = `${title} için ödünç alma onaylandı.`;
      render();
    } : null)
  ));
}

search.addEventListener('input', render);
document.querySelector('#reset').addEventListener('click', () => {
  requests.clear();
  search.value = '';
  message.textContent = 'Demo sıfırlandı.';
  render();
});
render();
