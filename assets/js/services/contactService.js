export function showToast(message, type = 'success') {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

export function buildContactMessage({ name, email, topic, message }) {
  return `From: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`;
}

export function bindContactForm(form, emailAddress) {
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    const body = buildContactMessage(data);
    const subject = `[Azo.OS] ${data.topic}: ${data.name}`;

    try {
      await navigator.clipboard.writeText(body);
      showToast('Mesaj panoya kopyalandı. E-posta uygulamanız açılıyor.');
    } catch {
      showToast('E-posta uygulamanız açılıyor.');
    }

    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    form.reset();
  });
}
