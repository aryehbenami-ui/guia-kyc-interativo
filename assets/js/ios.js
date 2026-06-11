// ===============================
// iOS/Android Tab Switching + Accordion + Search + Dark Mode
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAccordion();
  initSearch();
  initCopyPanels();
  initDarkMode();
  // Ensure home button is hidden on page load (especially on main page)
  updateHomeButtonVisibility();
});

// ===============================
// Tab Switching
// ===============================

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const tabsContainer = btn.closest('.platform-tabs');

      // Remove active from all tabs in this group
      tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      tabsContainer.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      // Activate clicked tab
      btn.classList.add('active');
      const panel = tabsContainer.querySelector(`[data-content="${tabId}"]`);
      if (panel) panel.classList.add('active');
    });
  });
}

// ===============================
// Accordion (Expand/Collapse)
// ===============================

function initAccordion() {
  document.querySelectorAll('.topic-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.topic-card');
      card.classList.toggle('open');
      updateHomeButtonVisibility();
    });
  });
}

// Show/hide home button based on whether any topic is open
// Note: Home button should only appear on Knowledge Center page, not on main Guia KYC page
function updateHomeButtonVisibility() {
  const homeButton = document.getElementById('homeButton');
  if (!homeButton) return;
  
  // Check if we're on the main page (index.html) - home button should not appear there
  const isMainPage = window.location.pathname.endsWith('/index.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname === '';
  
  if (isMainPage) {
    homeButton.style.display = 'none';
    return;
  }
  
  const anyOpen = document.querySelector('.topic-card.open');
  homeButton.style.display = anyOpen ? 'flex' : 'none';
}

// ===============================
// Copy Panels
// ===============================

function initCopyPanels() {
  document.querySelectorAll('.tab-panel[data-copy]').forEach(panel => {
    panel.addEventListener('click', async (e) => {
      // Don't copy if clicking a link
      if (e.target.closest('a')) return;

      const text = buildCopyText(panel);
      try {
        await navigator.clipboard.writeText(text);
        panel.classList.add('copied');
        setTimeout(() => panel.classList.remove('copied'), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
}

function buildCopyText(panel) {
  const lines = [];
  
  // Get all child nodes and process them
  panel.childNodes.forEach(node => {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'ol') {
      // Process ordered list with proper numbering
      Array.from(node.querySelectorAll('li')).forEach((li, index) => {
        const text = li.innerText.trim().replace(/\s+/g, ' ');
        lines.push(`${index + 1}. ${text}`);
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

// ===============================
// Real-time Search Filtering
// ===============================

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const clearBtn = document.getElementById('clearSearch');
  const searchInfo = document.querySelector('.search-info') || createSearchInfo();
  const noResults = document.querySelector('.no-results') || createNoResults();
  const cards = document.querySelectorAll('.topic-card[data-section]');

  if (!searchInput) return;

  // Track if we've created the elements
  let searchInfoEl = document.querySelector('.search-info');
  let noResultsEl = document.querySelector('.no-results');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Show/hide clear button
    if (clearBtn) {
      clearBtn.classList.toggle('visible', query.length > 0);
    }

    // Update search info
    updateSearchInfo(query, cards, searchInfoEl);

    // Filter cards
    filterCards(query, cards, noResultsEl);
  });

  // Clear search
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchInput.focus();
      clearBtn.classList.remove('visible');

      // Reset all cards
      cards.forEach(card => {
        card.classList.remove('hidden', 'highlight');
        removeHighlights(card);
      });

      // Hide no results
      if (noResultsEl) noResultsEl.classList.remove('visible');

      // Reset search info
      if (searchInfoEl) {
        searchInfoEl.textContent = `${cards.length} tópicos`;
      }
    });
  }
}

function updateSearchInfo(query, cards, searchInfoEl) {
  if (!searchInfoEl) return;

  if (query.length === 0) {
    searchInfoEl.textContent = `${cards.length} tópicos`;
    return;
  }

  let matchCount = 0;
  cards.forEach(card => {
    const text = getCardText(card).toLowerCase();
    if (text.includes(query)) matchCount++;
  });

  if (matchCount === 0) {
    searchInfoEl.textContent = 'Nenhum resultado encontrado';
  } else if (matchCount === 1) {
    searchInfoEl.textContent = '1 resultado encontrado';
  } else {
    searchInfoEl.textContent = `${matchCount} resultados encontrados`;
  }
}

function filterCards(query, cards, noResultsEl) {
  let hasResults = false;

  cards.forEach(card => {
    const text = getCardText(card).toLowerCase();

    if (query.length === 0 || text.includes(query)) {
      card.classList.remove('hidden');
      hasResults = true;

      // Highlight matching text
      if (query.length > 0) {
        card.classList.add('highlight');
        highlightText(card, query);
      } else {
        card.classList.remove('highlight');
        removeHighlights(card);
      }
    } else {
      card.classList.add('hidden');
      card.classList.remove('highlight');
      removeHighlights(card);
    }
  });

  // Show/hide no results message
  if (noResultsEl) {
    if (query.length > 0 && !hasResults) {
      noResultsEl.classList.add('visible');
    } else {
      noResultsEl.classList.remove('visible');
    }
  }
}

function getCardText(card) {
  // Get all text content from the card
  return card.innerText;
}

function highlightText(element, query) {
  if (query.length === 0) return;

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const nodes = [];
  let node;
  while (node = walker.nextNode()) {
    // Don't highlight inside script or style tags
    if (node.parentElement.tagName === 'SCRIPT' || 
        node.parentElement.tagName === 'STYLE' ||
        node.parentElement.tagName === 'MARK') {
      continue;
    }
    nodes.push(node);
  }

  nodes.forEach(node => {
    const text = node.textContent.toLowerCase();
    const index = text.indexOf(query.toLowerCase());

    if (index !== -1) {
      const before = node.textContent.substring(0, index);
      const match = node.textContent.substring(index, index + query.length);
      const after = node.textContent.substring(index + query.length);

      const fragment = document.createDocumentFragment();

      if (before) fragment.appendChild(document.createTextNode(before));

      const mark = document.createElement('mark');
      mark.textContent = match;
      fragment.appendChild(mark);

      if (after) {
        // Recursively highlight remaining occurrences
        const afterNode = document.createTextNode(after);
        fragment.appendChild(afterNode);
        // Note: This simple approach only highlights first occurrence per node
        // For multiple occurrences, we'd need a more complex recursive approach
      }

      node.parentElement.replaceChild(fragment, node);
    }
  });
}

function removeHighlights(element) {
  const marks = element.querySelectorAll('mark');
  marks.forEach(mark => {
    const parent = mark.parentElement;
    const text = document.createTextNode(mark.textContent);
    parent.replaceChild(text, mark);
    // Normalize to merge adjacent text nodes
    parent.normalize();
  });
}

function createSearchInfo() {
  const container = document.querySelector('.search-container');
  if (!container) return null;

  const info = document.createElement('div');
  info.className = 'search-info';
  const cards = document.querySelectorAll('.topic-card[data-section]');
  info.textContent = `${cards.length} tópicos`;
  container.appendChild(info);

  return info;
}

function createNoResults() {
  const content = document.querySelector('.content');
  if (!content) return null;

  const noResults = document.createElement('div');
  noResults.className = 'no-results';
  noResults.innerHTML = `
    <div class="no-results-icon">🔍</div>
    <p>Nenhum tópico encontrado para sua busca.</p>
    <p style="margin-top: 8px; font-size: 13px; color: #9ca3af;">Tente usar outros termos ou palavras-chave.</p>
  `;
  content.insertBefore(noResults, content.firstChild);

  return noResults;
}

// ===============================
// Dark Mode Toggle
// ===============================

function initDarkMode() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  
  if (!themeToggle || !themeIcon) return;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.className = 'bi bi-sun';
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      themeIcon.className = 'bi bi-moon';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.className = 'bi bi-sun';
      localStorage.setItem('theme', 'dark');
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'bi bi-sun';
      } else {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.className = 'bi bi-moon';
      }
    }
  });
}
