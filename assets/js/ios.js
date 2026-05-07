
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
      const text = buildCopyText(panel);

      navigator.clipboard.writeText(text).then(() => {
        panel.classList.add('copied');

        setTimeout(() => {
          panel.classList.remove('copied');
        }, 1500);
      });
    });
  });

  function buildCopyText(panel) {
    const lines = [];
    panel.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'ol') {
        Array.from(node.querySelectorAll('li')).forEach((li, index) => {
          const text = li.innerText.trim().replace(/\s+/g, ' ');
          lines.push(`${index + 1} - ${text}`);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const text = node.innerText.trim();
        if (text) lines.push(text);
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) lines.push(text);
      }
    });
    return lines.join('\n');
  }