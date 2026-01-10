
document.querySelectorAll('.topic-card .topic-toggle')
  .forEach(title => {
    title.addEventListener('click', () => {
      const card = title.closest('.topic-card');
      card.classList.toggle('open');
    });
  });

  document.querySelectorAll('.platform-tabs').forEach(tabs => {
    const buttons = tabs.querySelectorAll('.tab-btn');
    const panels = tabs.querySelectorAll('.tab-panel');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        tabs.querySelector(`[data-content="${target}"]`).classList.add('active');
      });
    });
  });

 document.querySelectorAll('.tab-panel[data-copy]').forEach(panel => {
    panel.addEventListener('click', () => {
      const text = panel.innerText.trim();

      navigator.clipboard.writeText(text).then(() => {
        panel.classList.add('copied');

        setTimeout(() => {
          panel.classList.remove('copied');
        }, 1500);
      });
    });
  });