
document.querySelectorAll('.topic-card .topic-toggle')
  .forEach(title => {
    title.addEventListener('click', () => {
      const card = title.closest('.topic-card');
      card.classList.toggle('open');
    });
  });

