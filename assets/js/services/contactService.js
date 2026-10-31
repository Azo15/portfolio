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

async function copyContactMessage(form) {
  if (!form.reportValidity()) return false;
  const body = buildContactMessage(Object.fromEntries(new FormData(form)));
  try {
    await navigator.clipboard.writeText(body);
    showToast('Structured message copied to clipboard.');
    return true;
  } catch {
    showToast('Clipboard access is unavailable in this browser.', 'error');
    return false;
  }
}

export function bindContactForm(form, emailAddress) {
  if (!form) return;

  form.querySelector('[data-copy-message]')?.addEventListener('click', () => copyContactMessage(form));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));
    const body = buildContactMessage(data);
    const subject = `[Azo.OS] ${data.topic}: ${data.name}`;

    showToast('Opening your email application…');
    window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
