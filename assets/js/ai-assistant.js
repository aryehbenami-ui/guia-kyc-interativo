// CONFIGURAÇÃO - Ativar integração quando estiver pronto
const AI_CONFIG = {
  ENABLE_DEEPSEEK_INTEGRATION: true, // Mudar para true após configurar API
  API_ENDPOINT: '/.netlify/functions/ai-assistant',
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 2
};

// Base de conhecimento KYC (usada quando API não está disponível)
const KYC_KNOWLEDGE_BASE = {
  articles: [
    {
      id: 'camera-permission',
      title: 'Permissão da Câmera',
      keywords: ['câmera', 'camera', 'permissão', 'acesso', 'preta', 'não carrega'],
      content: {
        intro: 'Problemas relacionados ao acesso à câmera.',
        identification: [
          'Tela fica preta ou não carrega',
          'Mensagem de câmera indisponível',
          'Usuário relata que "não aparece nada"'
        ],
        android: [
          'Nas configurações do dispositivo, acesse Configurações > Apps > Chrome > Permissões > Câmera e selecione Permitir.',
          'Feche o navegador e abra novamente.',
          'Feche todos os aplicativos em execução para liberar a câmera.',
          'Se houver muitas abas abertas, feche-as para liberar recursos.',
          'Tente refazer o processo de validação.'
        ],
        ios: [
          'Nas configurações do dispositivo, acesse Ajustes > Safari > Câmera e selecione Permitir.',
          'Feche o navegador e abra novamente.',
          'Feche todos os aplicativos em execução para liberar a câmera.',
          'Se houver muitas abas abertas, feche-as para liberar recursos.',
          'Tente refazer o processo de validação.'
        ],
        notes: 'No iOS, todos os navegadores utilizam o WebKit. Mesmo usando Chrome, as permissões seguem as regras do Safari.',
        escalation: 'Caso o erro persista após seguir todas as orientações, reportar para análise junto ao fornecedor de validação.'
      }
    },
    {
      id: 'location-sharing',
      title: 'Compartilhamento de Localização',
      keywords: ['localização', 'localizacao', 'gps', 'local', 'geolocalização'],
      content: {
        intro: 'Solicitação e bloqueio de acesso à localização.',
        identification: [
          'Usuário não consegue compartilhar localização',
          'Mensagem de permissão negada',
          'Usuário relata que não avança na tela onde pede a localização'
        ],
        android: [
          'Nas configurações do dispositivo, acesse Configurações > Apps > Chrome > Permissões > Localização e selecione Permitir.',
          'Feche o navegador e abra novamente.',
          'Se houver muitas abas abertas, feche-as para liberar recursos.',
          'Tente refazer o processo de validação.',
          'Se persistir, reinicie o celular.'
        ],
        ios: [
          'Nas configurações do dispositivo, acesse Ajustes > Safari > Localização e selecione Permitir.',
          'Feche o navegador e abra novamente.',
          'Se houver muitas abas abertas, feche-as para liberar recursos.',
          'Tente refazer o processo de validação.'
        ],
        notes: 'A localização auxilia na análise antifraude e na validação do ambiente de acesso.',
        escalation: 'Caso persista, verificar se o GPS do dispositivo está funcionando corretamente.'
      }
    },
    {
      id: 'face-match-low',
      title: 'Face Match com baixa similaridade',
      keywords: ['face match', 'similaridade', 'selfie', 'documento', 'score', '0.69', '0.75'],
      content: {
        intro: 'Falha na comparação facial entre a selfie e o documento.',
        identification: [
          'Score de Face Match abaixo do mínimo exigido',
          'Exemplo: Score 0.69 / Threshold 0.75',
          'Validação facial reprovada automaticamente'
        ],
        steps: [
          'Tire a selfie em um local bem iluminado, com a luz de frente para o rosto.',
          'Posicione-se de forma que não haja sombras nem reflexos no rosto.',
          'Mantenha o rosto centralizado e totalmente visível na câmera.',
          'Não utilize óculos escuros, boné, touca ou qualquer acessório.',
          'Segure o celular na altura do rosto e evite inclinar a cabeça.'
        ],
        notes: 'A reprovação pode ocorrer quando a foto do documento é muito antiga ou quando a selfie é tirada em ângulo diferente, com pouca iluminação ou interferências visuais.',
        escalation: 'Caso o problema persista mesmo após uma nova tentativa, o caso deve ser reportado junto ao fornecedor de validação.'
      }
    },
    {
      id: 'selfie-camera-error',
      title: 'Erro na Câmera no Envio da Selfie',
      keywords: ['selfie', 'câmera', 'erro', 'trava', 'liveness', 'não envia'],
      content: {
        intro: 'Falha na captura ou no envio da selfie durante o processo de validação facial.',
        identification: [
          'Tela da selfie não abre ou fica preta.',
          'Mensagem de erro ao tentar capturar a selfie.',
          'Selfie não carrega ou não é enviada para validação.',
          'Processo trava na etapa de liveness.',
          'No painel do fornecedor constará "Erro na câm."'
        ],
        android: [
          'Feche o navegador Chrome e abra novamente.',
          'Nas configurações do celular, vá em Configurações > Apps > Chrome > Permissões e permita o acesso à Câmera.',
          'Feche todos os aplicativos em execução para liberar a câmera.',
          'Tente novamente utilizando uma boa conexão de internet.',
          'Reinicie o celular caso a câmera continue travada.'
        ],
        ios: [
          'Feche o navegador ou aplicativo e abra novamente.',
          'Nas configurações do celular, vá em Ajustes > Safari > Câmera e permita o acesso à Câmera.',
          'Feche todos os aplicativos em execução para liberar a câmera.',
          'Tente novamente utilizando uma boa conexão de internet.',
          'Reinicie o celular caso a câmera continue travada.'
        ],
        escalation: 'Caso o erro persista, reportar o caso para análise junto ao fornecedor de validação facial.'
      }
    },
    {
      id: 'document-ocr-failed',
      title: 'Documento Ilegível / Falha no OCR',
      keywords: ['documento', 'ocr', 'ilegível', 'não reconhece', 'foto', 'imagem'],
      content: {
        intro: 'O sistema não conseguiu identificar ou ler corretamente as informações do documento.',
        identification: [
          'Mensagem de erro: OCR failed',
          'Mensagem de erro: document type unknown',
          'Documento não reconhecido automaticamente',
          'Processo não avança após o envio da foto do documento'
        ],
        steps: [
          'Tire o documento do plástico de proteção (se houver).',
          'Coloque o documento sobre uma superfície plana, como uma mesa.',
          'Tire a foto do documento em um local bem iluminado, evitando sombras e reflexos.',
          'Centralize o documento na câmera, garantindo que todas as bordas estejam visíveis.',
          'Evite usar zoom ou cortar partes do documento na foto.'
        ],
        notes: 'A falha no OCR ocorre quando o sistema não consegue ler os dados do documento, geralmente por reflexos, baixa iluminação, imagem cortada ou qualidade insuficiente.',
        escalation: 'Caso o erro continue, encaminhar para análise junto ao fornecedor de validação de documentos.'
      }
    },
    {
      id: 'liveness-failed',
      title: 'Liveness Falhou / Rosto Não Detectado',
      keywords: ['liveness', 'rosto', 'face', 'detectado', 'aproximar', 'afastar'],
      content: {
        intro: 'O sistema não conseguiu identificar corretamente o rosto durante a validação de liveness.',
        identification: [
          'Mensagem de erro: Liveness failed',
          'Mensagem de erro: face not detected',
          'Processo trava ou reprova na etapa de liveness',
          'Câmera ativa, mas o rosto não é reconhecido',
          'Usuário não consegue avançar na etapa de aproximar e afastar o rosto'
        ],
        steps: [
          'Vá para um local bem iluminado, com luz natural de frente para o rosto.',
          'Mantenha o rosto centralizado na tela.',
          'Remova boné, chapéu, óculos escuros ou máscara.',
          'Segure o celular na altura do rosto.',
          'Se necessário, limpe a câmera do dispositivo.',
          'Refaça o processo desde o início.'
        ],
        notes: 'Esse erro ocorre quando o rosto fica fora do enquadramento, está parcialmente coberto ou quando a iluminação é insuficiente.',
        escalation: 'Caso o erro continue, encaminhar para análise junto ao fornecedor de validação de liveness.'
      }
    },
    {
      id: 'loading-loop',
      title: 'Loading em Loop ao Iniciar o Liveness',
      keywords: ['loading', 'loop', 'carregando', 'infinito', 'iniciar', 'não inicia'],
      content: {
        intro: 'A tela de validação facial fica carregando continuamente e o liveness não inicia.',
        identification: [
          'Tela de liveness fica apenas carregando (loading infinito)',
          'Câmera não é aberta',
          'Usuário não consegue avançar no processo',
          'O problema ocorre ao clicar em "Iniciar validação"'
        ],
        android: [
          'Feche o navegador e abra novamente.',
          'Nas configurações do celular, acesse Configurações > Apps > Chrome > Permissões e confirme que a permissão de Câmera está habilitada.',
          'Limpe o cache do navegador (Configurações > Apps > Chrome > Limpar dados > Limpar cache).',
          'Use uma conexão Wi-Fi estável.',
          'Evite usar VPN ou modo economia de dados.',
          'Se persistir, faça o teste por uma aba anônima.',
          'Caso necessário, reinicie o dispositivo.'
        ],
        ios: [
          'Feche o navegador e abra novamente.',
          'Nas configurações do celular, acesse Ajustes > Safari > Câmera e confirme que a permissão de Câmera está habilitada.',
          'Limpe o cache do navegador (Ajustes > Safari > Avançado > Dados dos Sites).',
          'Use uma conexão Wi-Fi estável.',
          'Evite usar VPN ou modo economia de dados.',
          'Se persistir, faça o teste por uma aba anônima.',
          'Caso necessário, reinicie o dispositivo.'
        ],
        escalation: 'Se o problema continuar, reportar para análise junto ao fornecedor de liveness.'
      }
    },
    {
      id: 'black-screen',
      title: 'Tela Preta sem Renderização',
      keywords: ['tela preta', 'preta', 'não renderiza', 'nada aparece', 'vazio'],
      content: {
        intro: 'A tela fica totalmente preta e nenhum componente do processo de validação é exibido.',
        identification: [
          'Tela preta ao iniciar o fluxo de validação',
          'Nenhum botão, câmera ou mensagem aparece',
          'Página parece carregada, mas sem conteúdo visível',
          'Usuário não consegue interagir com a tela'
        ],
        android: [
          'Limpe o cache do navegador (Configurações > Apps > Chrome > Limpar dados > Limpar cache).',
          'Feche o navegador e abra novamente.',
          'Se possível, use uma conexão Wi-Fi estável.',
          'Se persistir, faça o teste por uma aba anônima.',
          'Teste em outros navegadores (Edge, Firefox).',
          'Reinicie o navegador ou tente em outro dispositivo.'
        ],
        ios: [
          'Limpe o cache do navegador (Ajustes > Safari > Avançado > Dados dos Sites).',
          'Feche o navegador e abra novamente.',
          'Se possível, use uma conexão Wi-Fi estável.',
          'Se persistir, faça o teste por uma aba anônima.',
          'Teste em outros navegadores (Chrome, Edge, Firefox).',
          'Reinicie o navegador ou tente em outro dispositivo.'
        ],
        escalation: 'Caso nenhuma ação resolva, verificar com o fornecedor de validação.'
      }
    },
    {
      id: 'connection-failed',
      title: 'Falha de Conexão ao Iniciar a Validação',
      keywords: ['conexão', 'internet', 'rede', 'wi-fi', 'dados', 'instabilidade'],
      content: {
        intro: 'O usuário recebe uma mensagem de erro informando falha de conexão ao tentar iniciar o processo de validação KYC.',
        identification: [
          'Mensagem de erro indicando falha de conexão',
          'Validação não inicia após clicar em "Começar"',
          'Tela exibe aviso de instabilidade ou conexão indisponível',
          'Usuário relata que a internet funciona em outros aplicativos'
        ],
        android: [
          'Verifique se o celular está conectado à internet (desative e reative).',
          'Dê preferência para uma conexão Wi-Fi estável.',
          'Desative VPN, proxy ou aplicativos de rede segura.',
          'Evite alternar entre Wi-Fi e dados móveis durante o processo.',
          'Feche o navegador e abra novamente.',
          'Se necessário, reinicie o dispositivo.',
          'Tente iniciar a validação novamente.'
        ],
        ios: [
          'Confirme se o iPhone está conectado à internet.',
          'Prefira utilizar uma rede Wi-Fi estável.',
          'Desative VPN ou apps que alterem a conexão.',
          'Evite trocar de rede durante a validação.',
          'Feche o Safari e abra novamente.',
          'Se necessário, reinicie o dispositivo.',
          'Tente iniciar a validação novamente.'
        ],
        escalation: 'Caso o erro persista mesmo em rede estável, oriente tentar novamente mais tarde ou em outro dispositivo.'
      }
    },
    {
      id: 'internal-rejection',
      title: 'Reprovação Interna na Jornada KYC',
      keywords: ['reprovado', 'reprovação', 'interna', 'dados', 'cadastro', 'perfil'],
      content: {
        intro: 'A jornada de KYC é reprovada internamente, sem exibir registros ou eventos no painel do fornecedor de validação.',
        identification: [
          'KYC aparece como reprovado',
          'Não há tentativa registrada no painel do fornecedor',
          'Usuário relata que não conseguiu concluir a validação',
          'Fluxo é interrompido antes do envio para o fornecedor'
        ],
        steps: [
          'Acesse o menu Perfil no aplicativo ou site.',
          'Entre em Dados da Conta.',
          'Verifique se todos os campos estão preenchidos corretamente.',
          'Atualize ou complete os dados que estiverem faltando.',
          'Salve as alterações antes de tentar novamente.',
          'Após isso, retorne e refaça a validação KYC.'
        ],
        notes: 'Esse tipo de reprovação ocorre when regras internas identificam dados obrigatórios ausentes ou inconsistentes.',
        escalation: 'Caso todos os dados estejam corretos e persista o problema, reportar com gravação de tela para análise da equipe técnica.'
      }
    },
    {
      id: 'approved-no-action',
      title: 'Validação aprovada, mas sem ação seguinte',
      keywords: ['aprovado', 'saque', 'liberado', 'não avança', 'próxima etapa'],
      content: {
        intro: 'O usuário conclui a validação com status aprovado, mas a jornada não avança para a próxima etapa esperada.',
        identification: [
          'O procedimento foi realizado pelo aplicativo externo do fornecedor.',
          'Liveness para saque aprovado, mas sem registro de saque após aprovação.'
        ],
        steps: [
          'Abra o processo de validação diretamente pelo navegador (Chrome no Android, Safari no iOS).',
          'Nas configurações, permita acesso à Câmera e Localização.',
          'Feche completamente o navegador e abra novamente.',
          'Certifique-se de que nenhum outro app esteja usando a câmera.',
          'Refaça todo o processo de validação pelo navegador.'
        ],
        notes: 'Esse comportamento ocorre porque, ao usar o app externo, o fluxo de retorno nem sempre é sincronizado corretamente.',
        escalation: 'Caso persista, reportar com gravação de tela mostrando a situação.'
      }
    }
  ]
};

/**
 * Classe principal do Assistente IA
 */
class KYCAIAssistant {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.messageId = 0;
    this.init();
  }

  init() {
    this.createOverlay();
    this.createButton();
    this.createModal();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  createButton() {
    const btn = document.createElement('button');
    btn.id = 'ai-assistant-btn';
    btn.className = 'ai-assistant-btn';
    btn.innerHTML = '<i class="bi bi-robot"></i><span>Consultar IA</span>';
    btn.setAttribute('aria-label', 'Abrir assistente de IA para KYC');
    document.body.appendChild(btn);
    this.button = btn;
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-chat-modal';
    modal.className = 'ai-chat-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Assistente de IA KYC');
    
    modal.innerHTML = `
      <div class="ai-chat-header">
        <h3><i class="bi bi-robot"></i> Assistente KYC</h3>
        <button class="ai-chat-close" aria-label="Fechar chat">&times;</button>
      </div>
      <div class="ai-chat-messages" role="log" aria-live="polite"></div>
      <div class="ai-chat-input-area">
        <div class="ai-quick-suggestions">
          <button class="ai-suggestion-chip" data-query="Câmera não abre">📷 Câmera não abre</button>
          <button class="ai-suggestion-chip" data-query="Liveness falhou">👤 Liveness falhou</button>
          <button class="ai-suggestion-chip" data-query="Documento não lê">📄 Documento não lê</button>
          <button class="ai-suggestion-chip" data-query="Erro de conexão">🌐 Erro de conexão</button>
        </div>
        <div class="ai-input-container">
          <textarea 
            class="ai-chat-input" 
            placeholder="Descreva a situação do usuário..."
            rows="1"
            aria-label="Digite sua pergunta"
          ></textarea>
          <button class="ai-send-btn" aria-label="Enviar mensagem">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
        <div class="ai-disclaimer">
          IA em fase de testes. Sempre valide as informações.
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.modal = modal;
    this.messagesContainer = modal.querySelector('.ai-chat-messages');
    this.input = modal.querySelector('.ai-chat-input');
    this.sendBtn = modal.querySelector('.ai-send-btn');
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'ai-chat-overlay';
    overlay.id = 'ai-chat-overlay';
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  bindEvents() {
    // Abrir/fechar modal
    this.button.addEventListener('click', () => this.toggle());
    this.modal.querySelector('.ai-chat-close').addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());

    // Enviar mensagem
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    
    // Enter para enviar (Shift+Enter para nova linha)
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Auto-resize do textarea
    this.input.addEventListener('input', () => {
      this.input.style.height = 'auto';
      this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
    });

    // Sugestões rápidas
    this.modal.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        this.input.value = query;
        this.sendMessage();
      });
    });

    // Esc para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.button.style.display = 'none';
    this.modal.classList.add('open');
    this.overlay.classList.add('visible');
    setTimeout(() => this.input.focus(), 300);
  }

  close() {
    this.isOpen = false;
    this.button.style.display = 'flex';
    this.modal.classList.remove('open');
    this.overlay.classList.remove('visible');
  }

  addWelcomeMessage() {
    const welcomeMsg = `Olá! Sou o assistente de IA do Guia KYC. 🤖

Posso ajudar com dúvidas sobre:
• Permissão de câmera e localização
• Problemas com liveness e face match
• Erros de OCR e documentos
• Falhas de conexão
• E outros troubleshooting KYC

**Como posso ajudar hoje?**`;
    
    this.addMessage('assistant', welcomeMsg);
  }

  async sendMessage() {
    const query = this.input.value.trim();
    if (!query) return;

    // Adicionar mensagem do usuário
    this.addMessage('user', query);
    this.input.value = '';
    this.input.style.height = 'auto';

    // Mostrar loading
    const loadingId = this.addLoadingMessage();

    try {
      let response;

      if (AI_CONFIG.ENABLE_DEEPSEEK_INTEGRATION) {
        // Integração com DeepSeek API
        response = await this.callDeepSeekAPI(query);
      } else {
        // Modo offline - usa base de conhecimento local
        await this.simulateDelay();
        response = this.findRelevantAnswer(query);
      }

      // Remover loading e mostrar resposta
      this.removeMessage(loadingId);
      this.addMessage('assistant', response);

    } catch (error) {
      console.error('Erro no assistente IA:', error);
      this.removeMessage(loadingId);
      this.addMessage('assistant', '⚠️ Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.');
    }
  }

  async callDeepSeekAPI(query) {
    // Construir contexto com artigos relevantes
    const relevantArticles = this.findRelevantArticles(query, 3);
    const context = relevantArticles.map(article => {
      return `ARTIGO: ${article.title}\n${JSON.stringify(article.content, null, 2)}`;
    }).join('\n\n');

    const systemPrompt = `Você é um assistente especializado em procedimentos KYC. Sua função é ajudar analistas a resolver problemas operacionais.

REGRAS IMPORTANTES:
1. Baseie suas respostas APENAS nos artigos e procedimentos fornecidos
2. Se não encontrar informação nos documentos, diga "Não encontrei informação específica nos procedimentos KYC"
3. Cite sempre a seção/artigo de referência
4. Mantenha respostas objetivas e operacionais
5. Não invente procedimentos ou regras

FORMATO DE RESPOSTA:
- Identifique o problema principal
- Liste passos de troubleshooting
- Indique quando escalar
- Cite artigos relacionados

CONTEÚDO KYC DISPONÍVEL:
${context}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(AI_CONFIG.API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          systemPrompt,
          context: relevantArticles
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      return data.response || 'Desculpe, não consegui processar sua solicitação.';
    } catch (error) {
      if (error.name === 'AbortError') {
        return 'A requisição demorou muito. Por favor, tente novamente.';
      }
      throw error;
    }
  }

  findRelevantAnswer(query) {
    const relevantArticles = this.findRelevantArticles(query, 2);
    
    if (relevantArticles.length === 0) {
      return `Não encontrei informações específicas nos procedimentos KYC sobre este caso. 

Recomendo:
• Consultar um supervisor
• Escalar para a equipe técnica
• Verificar se há atualizações recentes nos procedimentos`;
    }

    const article = relevantArticles[0];
    let response = `📋 **Problema identificado:** ${article.title}\n\n`;
    response += `**Como identificar:**\n`;
    response += article.content.identification.map(item => `• ${item}`).join('\n');
    
    if (article.content.steps) {
      response += `\n\n**Orientação ao usuário:**\n`;
      response += article.content.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
    } else if (article.content.android) {
      response += `\n\n**Orientação (Android):**\n`;
      response += article.content.android.map((step, i) => `${i + 1}. ${step}`).join('\n');
      if (article.content.ios) {
        response += `\n\n**Orientação (iOS):**\n`;
        response += article.content.ios.map((step, i) => `${i + 1}. ${step}`).join('\n');
      }
    }

    if (article.content.notes) {
      response += `\n\n**Observação:** ${article.content.notes}`;
    }

    if (article.content.escalation) {
      response += `\n\n**Quando escalar:** ${article.content.escalation}`;
    }

    // Se houver mais artigos relevantes
    if (relevantArticles.length > 1) {
      response += `\n\n**Artigos relacionados:**\n`;
      relevantArticles.slice(1).forEach(a => {
        response += `• ${a.title}\n`;
      });
    }

    return response;
  }

  findRelevantArticles(query, maxResults = 3) {
    const queryLower = query.toLowerCase();
    const scored = KYC_KNOWLEDGE_BASE.articles.map(article => {
      let score = 0;
      
      // Pontuar por título
      if (article.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }
      
      // Pontuar por keywords
      article.keywords.forEach(keyword => {
        if (queryLower.includes(keyword)) {
          score += 5;
        }
      });
      
      // Pontuar por conteúdo
      const contentStr = JSON.stringify(article.content).toLowerCase();
      const queryWords = queryLower.split(/\s+/);
      queryWords.forEach(word => {
        if (word.length > 2 && contentStr.includes(word)) {
          score += 1;
        }
      });
      
      return { article, score };
    });

    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.article);
  }

  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  }

  addMessage(type, content) {
    const id = ++this.messageId;
    const div = document.createElement('div');
    div.className = `ai-message ai-message-${type}`;
    div.id = `msg-${id}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'ai-message-content';
    contentDiv.innerHTML = this.formatMessage(content);
    
    div.appendChild(contentDiv);

    // Adicionar botões de feedback para mensagens do assistente
    if (type === 'assistant') {
      const feedbackDiv = document.createElement('div');
      feedbackDiv.className = 'ai-feedback';
      feedbackDiv.innerHTML = `
        <button class="ai-feedback-btn" data-feedback="up" title="Útil" aria-label="Resposta útil">👍</button>
        <button class="ai-feedback-btn" data-feedback="down" title="Não útil" aria-label="Resposta não útil">👎</button>
      `;
      
      feedbackDiv.querySelectorAll('.ai-feedback-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const feedback = e.currentTarget.dataset.feedback;
          this.recordFeedback(id, feedback);
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.2)';
        });
      });
      
      div.appendChild(feedbackDiv);
    }

    this.messagesContainer.appendChild(div);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    this.messages.push({ id, type, content });
    
    return id;
  }

  addLoadingMessage() {
    const id = ++this.messageId;
    const div = document.createElement('div');
    div.className = 'ai-message ai-message-loading';
    div.id = `msg-${id}`;
    div.innerHTML = `
      <span>Consultando procedimentos</span>
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    this.messagesContainer.appendChild(div);
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    return id;
  }

  removeMessage(id) {
    const msg = document.getElementById(`msg-${id}`);
    if (msg) {
      msg.style.opacity = '0';
      msg.style.transform = 'translateY(-10px)';
      setTimeout(() => msg.remove(), 300);
    }
  }

  formatMessage(text) {
    if (!text) return '';
    
    // Escapar HTML primeiro
    let formatted = text
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>');
    
    // Negrito
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Listas
    formatted = formatted.replace(/^•\s+(.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/^(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
    
    // Quebras de linha
    formatted = formatted.replace(/\n/g, '<br>');
    
    return formatted;
  }

  recordFeedback(messageId, feedback) {
    // Aqui você pode implementar o envio do feedback para analytics
    console.log(`Feedback para mensagem ${messageId}: ${feedback}`);
    
    // Futuramente: enviar para API de analytics
    // fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ messageId, feedback }) });
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se já não foi inicializado
  if (!window.kycAIAssistant) {
    window.kycAIAssistant = new KYCAIAssistant();
  }
});

// Exportar para uso global (caso necessário)
window.KYCAIAssistant = KYCAIAssistant;