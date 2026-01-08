// Utilities
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));
    const globalSearch = qs('#globalSearch');
    const sideSearch = qs('#sideSearch');
    const clearBtn = qs('#clearBtn');
    const showAllBtn = qs('#showAllBtn');
    const sections = qsa('[data-section]');
    const indexList = qs('#indexList');

    // Focus shortcut: press / to focus search
    window.addEventListener('keydown', (e) => {
      if (e.key === '/') {
        if (document.activeElement.tagName.toLowerCase() !== 'input' && document.activeElement.tagName.toLowerCase() !== 'textarea') {
          e.preventDefault();
          globalSearch.focus();
        }
      }
      if (e.key === 'Escape') {
        clearSearch();
      }
    });

    // Sync side search with top search
    sideSearch.addEventListener('input', (ev) => {
      globalSearch.value = ev.target.value;
      handleSearch(ev.target.value);
    });

    globalSearch.addEventListener('input', (ev) => {
      sideSearch.value = ev.target.value;
      handleSearch(ev.target.value);
    });

    clearBtn.addEventListener('click', () => { clearSearch(); });

    showAllBtn.addEventListener('click', () => {
      globalSearch.value = '';
      sideSearch.value = '';
      handleSearch('');
      // scroll to top main area
      window.scrollTo({top:0, behavior:'smooth'});
    });

    function clearSearch() {
      globalSearch.value = '';
      sideSearch.value = '';
      handleSearch('');
      globalSearch.focus();
    }

    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightMatches(node, query) {
      // Remove previous highlights
      const prev = node.querySelectorAll('.match-highlight');
      prev.forEach(p => {
        const parent = p.parentNode;
        parent.replaceChild(document.createTextNode(p.textContent), p);
        parent.normalize();
      });

      if (!query) return;

      const regex = new RegExp('(' + escapeRegExp(query) + ')', 'ig');

      // Walk text nodes and replace matches
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      while(walker.nextNode()) textNodes.push(walker.currentNode);

      textNodes.forEach(tn => {
        if (!tn.nodeValue.trim()) return;
        if (regex.test(tn.nodeValue)) {
          const span = document.createElement('span');
          span.innerHTML = tn.nodeValue.replace(regex, '<span class="match-highlight">$1</span>');
          tn.parentNode.replaceChild(span, tn);
        }
      });
    }

    function handleSearch(query) {
      const q = (query||'').trim().toLowerCase();

      // If empty - show all
      if (!q) {
        sections.forEach(s => {
          s.classList.remove('hidden');
          s.classList.add('reveal');
          // remove highlights
          const prev = s.querySelectorAll('.match-highlight');
          prev.forEach(p => {
            const parent = p.parentNode;
            parent.replaceChild(document.createTextNode(p.textContent), p);
            parent.normalize();
          });
        });
        updateIndexVisibility('');
        return;
      }

      // For each section, check if includes query in textContent or id/title
      sections.forEach(s => {
        const text = (s.textContent || s.innerText || '').toLowerCase();
        const id = s.id || '';
        const title = (s.querySelector('h2, h3') ? (s.querySelector('h2, h3').innerText || '') : '').toLowerCase();
        const match = text.includes(q) || id.includes(q) || title.includes(q);

        if (match) {
          s.classList.remove('hidden');
          s.classList.add('reveal');
          // highlight inside visible section
          highlightMatches(s, q);
          // scroll first matched section into view
        } else {
          s.classList.add('hidden');
          // remove previous highlights (if any)
          const prev = s.querySelectorAll('.match-highlight');
          prev.forEach(p => {
            const parent = p.parentNode;
            parent.replaceChild(document.createTextNode(p.textContent), p);
            parent.normalize();
          });
        }
      });

      updateIndexVisibility(q);

      // scroll to first visible section
      const first = document.querySelector('[data-section]:not(.hidden)');
      if (first) first.scrollIntoView({behavior:'smooth', block:'start'});
    }

    function updateIndexVisibility(q) {
      // hide index entries that don't match
      const links = Array.from(indexList.querySelectorAll('a'));
      links.forEach(a => {
        const targetId = a.getAttribute('href').slice(1);
        const section = document.getElementById(targetId);
        if (!section) return;
        const text = (section.textContent || '').toLowerCase();
        if (!q) {
          a.parentElement.style.display = '';
        } else {
          a.parentElement.style.display = text.includes(q) ? '' : 'none';
        }
      });
    }

    // Initialize: attach click to index to smooth scroll and focus highlight removal
    indexList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({behavior:'smooth', block:'start'});
          // briefly flash
          el.classList.add('reveal');
          setTimeout(()=>el.classList.remove('reveal'), 700);
        }
      });
    });

    // Accessibility: focus search on load
    // globalSearch.focus();

// FAQ accordion toggle
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const parent = btn.parentElement;
    parent.classList.toggle("open");
  });
});

  
/* ============================
   Tooltips automáticos (case-insensitive)
   ============================ */

// 1. Ler dicionário
const dict = {};
document.querySelectorAll("#conceitos table tbody tr").forEach(row => {
  const term = row.children[0].innerText.trim();
  const meaning = row.children[1].innerText.trim();
  dict[term] = meaning;
});

// Cria um array de termos ordenados por tamanho (evita conflito entre termos)
const terms = Object.keys(dict).sort((a, b) => b.length - a.length);

// 2. Função para processar um texto e envolver termos
function processTextNode(node) {
  let text = node.nodeValue;
  let replaced = false;

  terms.forEach(term => {
    const meaning = dict[term];

    // regex case-insensitive, word-boundaries
    const regex = new RegExp(`\\b(${term})\\b`, "gi");

    if (regex.test(text)) {
      text = text.replace(regex, match => {
        // match = forma original (maiúsculas/minúsculas)
        return `<span class="tooltip" data-tooltip="${meaning}">${match}</span>`;
      });
      replaced = true;
    }
  });

  if (replaced) {
    const span = document.createElement("span");
    span.innerHTML = text;
    node.replaceWith(span);
  }
}

// 3. Evita processar o próprio dicionário
function applyTooltips() {
  const contentNodes = document.querySelectorAll("main *:not(#conceitos *)");

  contentNodes.forEach(el => {
    // processa apenas nós de texto
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node);
      }
    });
  });
}

// 4. Aplicar tooltips após carregamento
applyTooltips();




(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const indexList = document.getElementById("indexList");
    if (!indexList) {
      console.warn("⚠ indexList não encontrado!");
      return;
    }

   // === 1) Blacklist rápida de IDs===
    const BLACKLIST_IDS = new Set([
      'conceitos', 'intro', 'fluxo', 'casos', 'prompt', // Ex.: esconder o dicionário
      // adicione outros ids que quer ocultar temporariamente
    ]);

    const nodes = Array.from(document.querySelectorAll("section.card[data-section], article[data-section]"));
    let autoCounter = 1;

    nodes.forEach(node => {
      if (node.getAttribute('data-index') === 'false') return;

      let ancestor = node.parentElement;
      while (ancestor) {
        if (ancestor.getAttribute && ancestor.getAttribute('data-index') === 'false') return;
        ancestor = ancestor.parentElement;
      }

      if (node.id && BLACKLIST_IDS.has(node.id)) return;

      if (!node.id || node.id.trim() === '') {
        node.id = 'auto-' + autoCounter++;
      }

      // ==== NOVA LÓGICA DE TÍTULO ====
      let title =
        node.getAttribute('data-title') ||                        // 1) Título curto definido pelo analista
        node.querySelector('.shortTitle')?.innerText?.trim() ||   // 2) Título curto oculto
        node.querySelector('.sectionTitle')?.innerText?.trim() || // 3) Título padrão
        node.querySelector('h2')?.innerText?.trim() ||
        node.querySelector('h3')?.innerText?.trim();

      if (!title) return;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + node.id;
      a.textContent = title;
      li.appendChild(a);
      indexList.appendChild(li);
    });
  });
  function selectDevice(device) {
  console.log("Dispositivo selecionado:", device);

  document.getElementById("deviceSelector").style.display = "none";
  document.getElementById("homeBtn").classList.remove("hidden");

  document.querySelectorAll("[data-device]").forEach(el => {
    const allowed = el.dataset.device;
    el.style.display =
      allowed === device || allowed === "both"
        ? ""
        : "none";
  });
}

function goHome() {
  document.getElementById("deviceSelector").style.display = "flex";
  document.getElementById("homeBtn").classList.add("hidden");

  document.querySelectorAll("[data-device]").forEach(el => {
    el.style.display = "none";
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Estado inicial: esconder tudo
document.querySelectorAll("[data-device]").forEach(el => {
  el.style.display = "none";
});


})();


