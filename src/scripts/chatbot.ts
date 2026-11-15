/**
 * Chatbot with quick replies only: each reply adds the question and the
 * answer, with a link to its section. A non-modal panel on desktop and a
 * modal bottom sheet on the phone; Escape and the close button close it and
 * return focus to the toggle.
 */
const toggle = document.querySelector<HTMLButtonElement>('[data-chatbot-toggle]');
const dialog = document.querySelector<HTMLDialogElement>('#chatbot');
const log = dialog?.querySelector<HTMLElement>('[data-chatbot-log]');

if (toggle && dialog && log) {
  const desktop = window.matchMedia('(min-width: 40rem)');

  const open = () => {
    if (desktop.matches) dialog.show();
    else dialog.showModal();
    dialog.querySelector<HTMLButtonElement>('[data-chatbot-reply]')?.focus();
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const sync = () => {
    toggle.setAttribute('aria-expanded', String(dialog.open));
    toggle.setAttribute(
      'aria-label',
      (dialog.open ? toggle.dataset.labelClose : toggle.dataset.labelOpen) ?? '',
    );
  };

  const bubble = (text: string, from: 'bot' | 'user') => {
    const p = document.createElement('p');
    p.className =
      from === 'bot'
        ? 'max-w-[82%] self-start rounded-card bg-secondary px-3.5 py-2.5'
        : 'max-w-[82%] self-end rounded-card bg-primary px-3.5 py-2.5 text-primary-foreground';
    p.textContent = text;
    return p;
  };

  toggle.addEventListener('click', () => (dialog.open ? close() : open()));
  dialog.querySelector('[data-chatbot-close]')?.addEventListener('click', close);

  dialog.addEventListener('close', () => {
    sync();
    toggle.focus();
  });
  dialog.addEventListener('keydown', (event) => {
    // Modal dialogs close on Escape natively; the desktop panel is not modal.
    if (event.key === 'Escape' && !dialog.matches(':modal')) {
      event.preventDefault();
      close();
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && dialog.matches(':modal')) close(); // backdrop
    if (event.target instanceof Element && event.target.closest('[data-chatbot-log] a')) close();
  });

  for (const reply of dialog.querySelectorAll<HTMLButtonElement>('[data-chatbot-reply]')) {
    reply.addEventListener('click', () => {
      const answer = bubble(reply.dataset.answer ?? '', 'bot');
      const link = document.createElement('a');
      link.href = reply.dataset.href ?? '#';
      link.className = 'mt-1.5 block font-semibold text-primary underline underline-offset-4';
      link.textContent = reply.dataset.linkLabel ?? '';
      answer.append(link);
      log.append(bubble(reply.textContent?.trim() ?? '', 'user'), answer);
      log.scrollTop = log.scrollHeight;
    });
  }

  // Opening it as the other kind when the viewport crosses the breakpoint.
  desktop.addEventListener('change', close);
  dialog.addEventListener('toggle', sync);
}
