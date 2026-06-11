// CONFIGURAÇÃO - Ativar integração quando estiver pronto
const AI_CONFIG = {
  ENABLE_DEEPSEEK_INTEGRATION: true, // Mudar para true após configurar API
  API_ENDPOINT: '/.netlify/functions/ai-assistant',
  TIMEOUT_MS: 30000,
  MAX_RETRIES: 2
};

// ============================================================================
// CATEGORIAS DE TROUBLESHOOTING (Reutilizáveis entre artigos)
// ============================================================================
const TROUBLESHOOTING_CATEGORIES = {
  connectivity: {
    id: 'connectivity',
    title: 'Conectividade',
    icon: 'bi-wifi',
    description: 'Verificações relacionadas à conexão com a internet.',
    steps: {
      android: [
        'Verifique se o celular está conectado à internet (desative e reative).',
        'Dê preferência para uma conexão Wi-Fi estável.',
        'Troque entre Wi-Fi e dados móveis para testar.',
        'Desative VPN, proxy ou aplicativos de rede segura.',
        'Evite alternar entre Wi-Fi e dados móveis durante o processo.',
        'Reinicie o roteador se possível.',
        'Se necessário, reinicie o dispositivo.'
      ],
      ios: [
        'Confirme se o iPhone está conectado à internet.',
        'Prefira utilizar uma rede Wi-Fi estável.',
        'Troque entre Wi-Fi e dados móveis para testar.',
        'Desative VPN ou apps que alterem a conexão.',
        'Evite trocar de rede durante a validação.',
        'Reinicie o roteador se possível.',
        'Se necessário, reinicie o dispositivo.'
      ]
    },
    checks: [
      'Internet está funcionando em outros apps?',
      'Sinal de Wi-Fi/dados está estável?',
      'VPN ou Proxy estão desativados?'
    ]
  },
  browser: {
    id: 'browser',
    title: 'Navegador',
    icon: 'bi-browser-chrome',
    description: 'Verificações e ações relacionadas ao navegador.',
    steps: {
      android: [
        'Feche o navegador Chrome e abra novamente.',
        'Limpe o cache do navegador (Configurações > Apps > Chrome > Limpar dados > Limpar cache).',
        'Limpe os cookies (Configurações > Apps > Chrome > Limpar dados > Cookies).',
        'Atualize o Chrome para a versão mais recente na Play Store.',
        'Teste abrir em uma aba anônima.',
        'Teste em outros navegadores (Edge, Firefox).',
        'Desative extensões ou modos de economia de dados.'
      ],
      ios: [
        'Feche o Safari e abra novamente.',
        'Limpe o cache (Ajustes > Safari > Avançado > Dados dos Sites > Remover Todos os Dados).',
        'Atualize o Safari/iOS para a versão mais recente.',
        'Teste abrir em uma aba anônima (Privada).',
        'Teste em outros navegadores (Chrome, Edge, Firefox).',
        'Desative o modo de economia de dados.'
      ]
    },
    checks: [
      'Navegador está atualizado?',
      'Cache e cookies foram limpos?',
      'Testou em aba anônima?'
    ]
  },
  permissions: {
    id: 'permissions',
    title: 'Permissões',
    icon: 'bi-shield-check',
    description: 'Verificação de permissões necessárias no dispositivo.',
    steps: {
      android: [
        'Nas configurações do dispositivo, acesse Configurações > Apps > Chrome > Permissões.',
        'Verifique se a permissão de Câmera está definida como "Permitir".',
        'Verifique se a permissão de Localização está definida como "Permitir".',
        'Verifique se a permissão de Microfone está definida como "Permitir" (se aplicável).',
        'Após ajustar permissões, feche e reabra o navegador.'
      ],
      ios: [
        'Nas configurações do dispositivo, acesse Ajustes > Safari.',
        'Verifique se a permissão de Câmera está definida como "Permitir".',
        'Verifique se a permissão de Localização está definida como "Durante o uso".',
        'Verifique se a permissão de Microfone está definida como "Permitir" (se aplicável).',
        'Após ajustar permissões, feche e reabra o navegador.'
      ]
    },
    checks: [
      'Câmera habilitada?',
      'Localização habilitada?',
      'Microfone habilitado (se aplicável)?'
    ],
    notes: 'No iOS, todos os navegadores utilizam o WebKit. Mesmo usando Chrome, as permissões seguem as regras do Safari.'
  },
  device: {
    id: 'device',
    title: 'Dispositivo',
    icon: 'bi-phone',
    description: 'Verificações e ações relacionadas ao dispositivo.',
    steps: {
      generic: [
        'Reinicie o aparelho.',
        'Feche todos os aplicativos em execução para liberar recursos.',
        'Feche abas extras do navegador.',
        'Verifique se há armazenamento disponível (mínimo recomendado: 500MB).',
        'Verifique se o sistema operacional está atualizado.',
        'Limpe a câmera do dispositivo com um pano macio (microfibra).',
        'Evite usar o dispositivo enquanto carrega.'
      ]
    },
    checks: [
      'Dispositivo foi reiniciado recentemente?',
      'Apps em segundo plano foram fechados?',
      'Há armazenamento suficiente disponível?',
      'Sistema operacional está atualizado?'
    ]
  },
  evidence: {
    id: 'evidence',
    title: 'Coleta de Evidências',
    icon: 'bi-camera',
    description: 'Informações importantes para coleta ao reportar problemas.',
    checklist: [
      'Print da tela de erro',
      'Gravação de tela do problema',
      'Modelo do dispositivo (ex: Samsung Galaxy A54, iPhone 13)',
      'Versão do sistema operacional (ex: Android 13, iOS 16.5)',
      'Navegador utilizado e versão (ex: Chrome 120, Safari 16)',
      'Data e horário da tentativa',
      'Tipo de conexão (Wi-Fi, 4G, 5G)',
      'Mensagem de erro exata (se houver)'
    ]
  }
};

// ============================================================================
// BASE DE CONHECIMENTO KYC
// ============================================================================
const KYC_KNOWLEDGE_BASE = {
  articles: [
    {
      id: 'camera-permission',
      title: 'Permissão da Câmera',
      keywords: ['câmera', 'camera', 'permissão', 'acesso', 'preta', 'não carrega'],
      // Categorias de troubleshooting aplicáveis
      troubleshooting: ['permissions', 'browser', 'device'],
      content: {
        intro: 'Problemas relacionados ao acesso à câmera.',
        identification: [
          'Tela fica preta ou não carrega',
          'Mensagem de câmera indisponível',
          'Usuário relata que "não aparece nada"'
        ],
        // Passos específicos do problema (além das categorias)
        specificSteps: [
          'Após ajustar permissões, teste refazer o processo de validação.'
        ],
        notes: 'No iOS, todos os navegadores utilizam o WebKit. Mesmo usando Chrome, as permissões seguem as regras do Safari.',
        escalation: 'Caso o erro persista após seguir todas as orientações, reportar para análise junto ao fornecedor de validação.'
      }
    },
    {
      id: 'location-sharing',
      title: 'Compartilhamento de Localização',
      keywords: ['localização', 'localizacao', 'gps', 'local', 'geolocalização'],
      troubleshooting: ['permissions', 'device'],
      content: {
        intro: 'Solicitação e bloqueio de acesso à localização.',
        identification: [
          'Usuário não consegue compartilhar localização',
          'Mensagem de permissão negada',
          'Usuário relata que não avança na tela onde pede a localização'
        ],
        specificSteps: [
          'Após ajustar permissões, teste refazer o processo de validação.'
        ],
        notes: 'A localização auxilia na análise antifraude e na validação do ambiente de acesso.',
        escalation: 'Caso persista, verificar se o GPS do dispositivo está funcionando corretamente.'
      }
    },
    {
      id: 'face-match-low',
      title: 'Face Match com baixa similaridade',
      keywords: ['face match', 'similaridade', 'selfie', 'documento', 'score', '0.69', '0.75'],
      troubleshooting: ['device'],
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
      troubleshooting: ['permissions', 'browser', 'connectivity', 'device'],
      content: {
        intro: 'Falha na captura ou no envio da selfie durante o processo de validação facial.',
        identification: [
          'Tela da selfie não abre ou fica preta.',
          'Mensagem de erro ao tentar capturar a selfie.',
          'Selfie não carrega ou não é enviada para validação.',
          'Processo trava na etapa de liveness.',
          'No painel do fornecedor constará "Erro na câm."'
        ],
        escalation: 'Caso o erro persista, reportar o caso para análise junto ao fornecedor de validação facial.'
      }
    },
    {
      id: 'document-ocr-failed',
      title: 'Documento Ilegível / Falha no OCR',
      keywords: ['documento', 'ocr', 'ilegível', 'não reconhece', 'foto', 'imagem'],
      troubleshooting: ['device'],
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
      troubleshooting: ['device', 'permissions'],
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
      troubleshooting: ['browser', 'permissions', 'connectivity', 'device'],
      content: {
        intro: 'A tela de validação facial fica carregando continuamente e o liveness não inicia.',
        identification: [
          'Tela de liveness fica apenas carregando (loading infinito)',
          'Câmera não é aberta',
          'Usuário não consegue avançar no processo',
          'O problema ocorre ao clicar em "Iniciar validação"'
        ],
        escalation: 'Se o problema continuar, reportar para análise junto ao fornecedor de liveness.'
      }
    },
    {
      id: 'black-screen',
      title: 'Tela Preta sem Renderização',
      keywords: ['tela preta', 'preta', 'não renderiza', 'nada aparece', 'vazio'],
      troubleshooting: ['browser', 'connectivity', 'device'],
      content: {
        intro: 'A tela fica totalmente preta e nenhum componente do processo de validação é exibido.',
        identification: [
          'Tela preta ao iniciar o fluxo de validação',
          'Nenhum botão, câmera ou mensagem aparece',
          'Página parece carregada, mas sem conteúdo visível',
          'Usuário não consegue interagir com a tela'
        ],
        escalation: 'Caso nenhuma ação resolva, verificar com o fornecedor de validação.'
      }
    },
    {
      id: 'connection-failed',
      title: 'Falha de Conexão ao Iniciar a Validação',
      keywords: ['conexão', 'internet', 'rede', 'wi-fi', 'dados', 'instabilidade'],
      troubleshooting: ['connectivity', 'browser', 'device'],
      content: {
        intro: 'O usuário recebe uma mensagem de erro informando falha de conexão ao tentar iniciar o processo de validação KYC.',
        identification: [
          'Mensagem de erro indicando falha de conexão',
          'Validação não inicia após clicar em "Começar"',
          'Tela exibe aviso de instabilidade ou conexão indisponível',
          'Usuário relata que a internet funciona em outros aplicativos'
        ],
        escalation: 'Caso o erro persista mesmo em rede estável, oriente tentar novamente mais tarde ou em outro dispositivo.'
      }
    },
    {
      id: 'internal-rejection',
      title: 'Reprovação Interna na Jornada KYC',
      keywords: ['reprovado', 'reprovação', 'interna', 'dados', 'cadastro', 'perfil'],
      troubleshooting: ['evidence'],
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
      troubleshooting: ['browser', 'permissions', 'device'],
      content: {
        intro: 'O usuário conclui a validação com status aprovado, mas a jornada não avança para a próxima etapa esperada.',
        identification: [
          'O procedimento foi realizado pelo aplicativo externo do fornecedor.',
          'Liveness para saque aprovado, mas sem registro de saque após aprovação.'
        ],
        notes: 'Esse comportamento ocorre porque, ao usar o app externo, o fluxo de retorno nem sempre é sincronizado corretamente.',
        escalation: 'Caso persista, reportar com gravação de tela mostrando a situação.'
      }
    },
    {
      id: 'vpn-proxy-location',
      title: 'VPN ou Proxy impedindo validação',
      keywords: [
        'vpn',
        'proxy',
        'dns privado',
        'localização',
        'carregando',
        'não inicia',
        'erro genérico',
        'não avança',
        'compartilhar localização'
      ],
      troubleshooting: ['connectivity'],
      content: {
        intro: 'O usuário não consegue iniciar corretamente o fluxo de validação de identidade, geralmente devido ao uso de VPN, Proxy ou serviços que mascaram a localização do dispositivo.',
        identification: [
          'A tela de validação fica carregando continuamente.',
          'O fluxo não passa da etapa de compartilhamento de localização.',
          'Mensagem genérica de erro ao iniciar a validação.',
          'Erro relacionado à localização, segurança ou inconsistência de acesso.',
          'Uso de aplicativos de VPN ativos no aparelho.',
          'Navegador ou aparelho configurado com Proxy ou DNS privado.'
        ],
        specificSteps: [
          'Desative qualquer VPN ativa no aparelho.',
          'Feche aplicativos de VPN instalados no dispositivo.',
          'Verifique se não há Proxy configurado na rede utilizada.',
          'Desative o DNS Privado, caso esteja habilitado.',
          'Feche completamente o navegador e abra novamente.',
          'Refaça o processo utilizando uma conexão comum de internet.'
        ],
        notes: 'VPNs, Proxys e serviços de mascaramento de conexão podem ocultar ou alterar informações importantes de localização e segurança necessárias para o processo de validação.',
        escalation: 'Caso o erro persista mesmo após a desativação da VPN/Proxy, encaminhar para análise com gravação de tela demonstrando o comportamento apresentado.'
      }
    },
    {
      id: 'error-500',
      title: 'Erro 500 durante a validação',
      keywords: [
        'erro 500',
        '500',
        'erro interno',
        'internal server error',
        'falha servidor'
      ],
      troubleshooting: ['browser', 'connectivity', 'evidence'],
      content: {
        intro: 'O usuário encontra o erro 500 ao tentar iniciar ou concluir o processo de validação.',
        identification: [
          'Mensagem "Erro 500" exibida na tela.',
          'Tela em branco após iniciar a validação.',
          'Falha repentina durante o carregamento da jornada.',
          'O erro ocorre mesmo após atualizar a página.'
        ],
        escalation: 'Caso o erro persista, coletar evidências (print ou gravação de tela) e encaminhar para análise.'
      }
    },
    {
      id: 'error-404',
      title: 'Erro 404 durante a validação',
      keywords: [
        'erro 404',
        '404',
        'página não encontrada',
        'link inválido',
        'not found'
      ],
      troubleshooting: ['evidence'],
      content: {
        intro: 'O usuário encontra o erro 404 ao acessar o fluxo de validação.',
        identification: [
          'Mensagem "404 - Página não encontrada".',
          'O link de validação não abre corretamente.',
          'A página é exibida como indisponível ou inexistente.',
          'O erro ocorre imediatamente ao acessar o link.'
        ],
        specificSteps: [
          'Solicite ao usuário que gere um novo acesso ao fluxo de validação.',
          'Oriente a abrir o link diretamente pelo navegador.',
          'Verifique se o link foi copiado ou compartilhado corretamente.',
          'Peça para evitar links antigos salvos em favoritos ou histórico.',
          'Realize uma nova tentativa utilizando o link atualizado.'
        ],
        notes: 'O erro 404 geralmente ocorre quando o endereço acessado não existe mais, expirou ou foi gerado incorretamente.',
        escalation: 'Caso um novo link apresente o mesmo comportamento, encaminhar para análise com evidências.'
      }
    },
    {
      id: 'error-116',
      title: 'Erro 116 durante a validação',
      keywords: [
        'erro 116',
        '116',
        'erro de conexão',
        'instabilidade',
        'rede'
      ],
      troubleshooting: ['connectivity', 'browser', 'evidence'],
      content: {
        intro: 'O usuário encontra o erro 116 durante o carregamento ou execução da validação de identidade.',
        identification: [
          'Mensagem contendo "Erro 116".',
          'Carregamento interrompido durante a validação.',
          'Falha de comunicação com os serviços de validação.',
          'O problema ocorre principalmente em determinadas redes.'
        ],
        escalation: 'Caso persista após as validações de conectividade, encaminhar para análise com gravação de tela e informação da rede utilizada.'
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
    // Esconder o botão inicialmente - chat só aparece com atalho
    this.button.style.display = 'none';
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

    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
      // Ctrl + Alt + C para abrir/fechar o chat
      if (e.ctrlKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        this.toggle();
      }
      // Esc para fechar
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
    this.button.style.display = 'none';
    this.modal.classList.remove('open');
    this.overlay.classList.remove('visible');
  }

  addWelcomeMessage() {
    const welcomeMsg = `Olá! Sou o assistente de IA do Guia KYC.
    
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
      this.addMessage('assistant', '⚠️ Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.');
    }
  }

  async callDeepSeekAPI(query) {
    // Construir contexto com artigos relevantes e categorias de troubleshooting
    const relevantArticles = this.findRelevantArticles(query, 3);
    
    // Construir contexto completo com artigos e suas categorias
    const context = relevantArticles.map(article => {
      let articleContext = `ARTIGO: ${article.title}\n`;
      articleContext += `ID: ${article.id}\n`;
      
      if (article.troubleshooting && article.troubleshooting.length > 0) {
        articleContext += `CATEGORIAS DE TROUBLESHOOTING: ${article.troubleshooting.join(', ')}\n`;
      }
      
      articleContext += `CONTEÚDO:\n${JSON.stringify(article.content, null, 2)}`;
      return articleContext;
    }).join('\n\n');

    // Construir contexto das categorias de troubleshooting
    const categoriesContext = Object.entries(TROUBLESHOOTING_CATEGORIES).map(([key, cat]) => {
      return `${key.toUpperCase()}: ${cat.title}\n${cat.description}\n${JSON.stringify(cat, null, 2)}`;
    }).join('\n\n');

    // System prompt alinhado com a nova abordagem de categorias de troubleshooting
    const systemPrompt = `Você é um assistente especializado em procedimentos KYC com conhecimento técnico avançado.

SUA FUNÇÃO PRINCIPAL:
Ajudar analistas a resolver problemas operacionais de forma prática e organizada, utilizando categorias de troubleshooting estruturadas.

BASE DE CONHECIMENTO DO GUIA KYC:
${context || '(nenhum artigo do guia disponível no momento)'}

CATEGORIAS DE TROUBLESHOOTING DISPONÍVEIS:
${categoriesContext}

CONHECIMENTO TÉCNICO KYC (use para enriquecer quando o guia não for suficiente):
- Regulamentação: KYC é exigido pelo Banco Central e COAF (Lei 9.613/1998, Circular BCB 3.978/2020, Resolução COAF nº 39/2022)
- Documentos válidos no Brasil: RG, CNH, RNE, Passaporte brasileiro, Carteira de Trabalho Digital
- Biometria facial: threshold mínimo de 0.75 (75% similaridade); fatores que reduzem: idade da foto, ângulo, iluminação, acessórios
- Problemas comuns: câmera não abre (90% é permissão negada), OCR falha (reflexo/baixa iluminação), loading infinito (limpar cache resolve 70%), erro de conexão (verificar VPN/proxy)
- PEP: Pessoas Politicamente Expostas exigem EDD (Due Diligence Reforçada)
- Boas práticas: sempre validar identidade, documentar interações, escalar suspeitas de fraude

DIRETRIZES DE RESPOSTA:

1. **ESTRUTURA ORGANIZADA POR CATEGORIAS:**
   - Identifique o problema principal
   - Organize a solução pelas categorias relevantes (Conectividade, Navegador, Permissões, Dispositivo)
   - Inclua checklist de verificação rápida para cada categoria
   - Forneça passos específicos para Android e iOS quando aplicável

2. **QUANDO O GUIA TIVER INFORMAÇÃO SUFICIENTE:**
   - Use as categorias de troubleshooting do artigo
   - Responda de forma estruturada e clara
   - Mencione o artigo do guia naturalmente na resposta

3. **QUANDO O GUIA NÃO FOR SUFICIENTE:**
   - Enriqueça com conhecimento técnico relevante
   - Seja explícito: "O guia não aborda especificamente este caso, mas com base no conhecimento técnico de KYC..."
   - Ofereça alternativas e contexto adicional

4. **QUANDO NÃO ENCONTRAR INFORMAÇÃO:**
   - Seja honesto: "Não encontrei informação específica nos procedimentos KYC"
   - Sugira caminhos alternativos

ESTILO: Direto, claro, organizado. Prático e focado na solução. Técnico quando necessário, mas acessível. Use formatação markdown para melhor legibilidade.`;

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
      
      // Armazenar metadados da resposta para exibição
      this.lastResponseMetadata = {
        usedGuide: data.usedGuide || false,
        usedTechnicalKnowledge: data.usedTechnicalKnowledge || false,
        model: data.model || 'deepseek-chat'
      };
      
      return data.response || 'Desculpe, não consegui processar sua solicitação.';
    } catch (error) {
      if (error.name === 'AbortError') {
        return 'A requisição demorou muito. Por favor, tente novamente.';
      }
      throw error;
    }
  }

  /**
   * Gera resposta organizada por categorias de troubleshooting
   */
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
    
    // Seção: Como identificar
    if (article.content.identification) {
      response += `**🔍 Como identificar:**\n`;
      response += article.content.identification.map(item => `• ${item}`).join('\n');
    }
    
    // Seção: Troubleshooting por categorias
    if (article.troubleshooting && article.troubleshooting.length > 0) {
      response += `\n\n**🛠️ Troubleshooting organizado:**\n`;
      
      article.troubleshooting.forEach((categoryId, index) => {
        const category = TROUBLESHOOTING_CATEGORIES[categoryId];
        if (category) {
          const icon = category.icon ? `<i class="bi ${category.icon}"></i>` : '🔧';
          response += `\n**${index + 1}. ${icon} ${category.title}**\n`;
          
          if (category.description) {
            response += `_${category.description}_\n`;
          }
          
          // Checklist de verificação rápida
          if (category.checks && category.checks.length > 0) {
            response += `\n**Verificações rápidas:**\n`;
            category.checks.forEach(check => {
              response += `☐ ${check}\n`;
            });
          }
          
          // Passos de ação (Android/iOS ou genérico)
          if (category.steps) {
            if (category.steps.android || category.steps.ios) {
              // Passos específicos por plataforma
              if (category.steps.android) {
                response += `\n**Android:**\n`;
                category.steps.android.forEach((step, i) => {
                  response += `${i + 1}. ${step}\n`;
                });
              }
              if (category.steps.ios) {
                response += `\n**iOS:**\n`;
                category.steps.ios.forEach((step, i) => {
                  response += `${i + 1}. ${step}\n`;
                });
              }
            } else if (category.steps.generic) {
              // Passos genéricos (aplicáveis a ambos)
              response += `\n**Passos:**\n`;
              category.steps.generic.forEach((step, i) => {
                response += `${i + 1}. ${step}\n`;
              });
            }
          }
        }
      });
    }
    
    // Passos específicos do artigo (além das categorias)
    if (article.content.steps) {
      response += `\n\n**📝 Orientações específicas:**\n`;
      article.content.steps.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`;
      });
    }
    
    // Passos específicos adicionais
    if (article.content.specificSteps) {
      response += `\n\n**📝 Passos adicionais:**\n`;
      article.content.specificSteps.forEach((step, i) => {
        response += `${i + 1}. ${step}\n`;
      });
    }

    // Observações
    if (article.content.notes) {
      response += `\n\n**⚠️ Observação:** ${article.content.notes}`;
    }
    
    // Notas das categorias (ex: nota sobre WebKit no iOS)
    const categoryNotes = [];
    if (article.troubleshooting) {
      article.troubleshooting.forEach(categoryId => {
        const category = TROUBLESHOOTING_CATEGORIES[categoryId];
        if (category && category.notes && !categoryNotes.includes(category.notes)) {
          categoryNotes.push(category.notes);
        }
      });
    }
    if (categoryNotes.length > 0) {
      response += `\n\n**📌 Notas importantes:**\n`;
      categoryNotes.forEach(note => {
        response += `• ${note}\n`;
      });
    }

    // Quando escalar
    if (article.content.escalation) {
      response += `\n\n**🚨 Quando escalar:** ${article.content.escalation}`;
    }
    
    // Coleta de evidências (se aplicável)
    if (article.troubleshooting && article.troubleshooting.includes('evidence')) {
      const evidenceCategory = TROUBLESHOOTING_CATEGORIES.evidence;
      if (evidenceCategory && evidenceCategory.checklist) {
        response += `\n\n**📸 Coleta de evidências para escalation:**\n`;
        evidenceCategory.checklist.forEach(item => {
          response += `• ${item}\n`;
        });
      }
    }

    // Artigos relacionados
    if (relevantArticles.length > 1) {
      response += `\n\n**📚 Artigos relacionados:**\n`;
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

    // Adicionar indicador de fonte da resposta (guia vs conhecimento técnico)
    if (type === 'assistant' && this.lastResponseMetadata) {
      const sourceDiv = document.createElement('div');
      sourceDiv.className = 'ai-message-source';
      
      let sourceText = '';
      if (this.lastResponseMetadata.usedGuide && this.lastResponseMetadata.usedTechnicalKnowledge) {
        sourceText = '📚 Guia KYC + Conhecimento Técnico';
        sourceDiv.classList.add('combined');
      } else if (this.lastResponseMetadata.usedGuide) {
        sourceText = '📖 Baseado no Guia KYC';
        sourceDiv.classList.add('guide-only');
      } else if (this.lastResponseMetadata.usedTechnicalKnowledge) {
        sourceText = '🧠 Conhecimento Técnico KYC';
        sourceDiv.classList.add('technical-only');
      }
      
      if (sourceText) {
        sourceDiv.textContent = sourceText;
        div.appendChild(sourceDiv);
      }
      
      // Limpar metadados após uso
      this.lastResponseMetadata = null;
    }

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

// Chat de IA desativado temporariamente para redução de custos
// Inicializar quando DOM estiver pronto
// document.addEventListener('DOMContentLoaded', () => {
//   // Verificar se já não foi inicializado
//   if (!window.kycAIAssistant) {
//     window.kycAIAssistant = new KYCAIAssistant();
//   }
// });

// Exportar para uso global (caso necessário)
window.KYCAIAssistant = KYCAIAssistant;