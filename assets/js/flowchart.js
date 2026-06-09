/**
 * ============================================================================
 * INTERACTIVE KNOWLEDGE CENTER - Flowchart Engine
 * Decision Tree & Operational Flowcharts for Support Agents
 * ============================================================================
 */

// ============================================================================
// FLOW DEFINITIONS - All themes with decision trees
// ============================================================================

const FLOW_DEFINITIONS = {
  // ======================== KYC ========================
  kyc: {
    id: 'kyc',
    title: 'KYC - Validação de Identidade',
    icon: 'bi-person-check',
    category: 'validation',
    description: 'Fluxo completo de validação de identidade (Know Your Customer)',
    tags: ['validação', 'identidade', 'documento', 'selfie', 'liveness'],
    nodes: [
      {
        id: 'kyc-start',
        type: 'start',
        title: 'Iniciar Validação KYC',
        description: 'Usuário inicia o processo de validação de identidade',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['kyc-check-1']
      },
      {
        id: 'kyc-check-1',
        type: 'question',
        title: 'O usuário conseguiu iniciar o fluxo?',
        description: 'Verificar se o processo de KYC foi iniciado com sucesso',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['kyc-permissions', 'kyc-connection-error'],
        branches: [
          { label: 'Sim', target: 'kyc-permissions' },
          { label: 'Não', target: 'kyc-connection-error' }
        ]
      },
      {
        id: 'kyc-connection-error',
        type: 'decision',
        title: 'Erro de Conexão',
        description: 'Verificar problemas de conectividade',
        icon: 'bi-wifi-off',
        x: 350,
        y: 200,
        expanded: {
          troubleshooting: [
            'Verificar se o usuário está em rede estável (Wi-Fi ou 4G/5G)',
            'Solicitar que desative VPN ou Proxy',
            'Pedir para alternar entre Wi-Fi e dados móveis',
            'Reiniciar o roteador se estiver em Wi-Fi',
            'Limpar cache do navegador'
          ],
          customerMessage: 'Por favor, verifique sua conexão com a internet. Tente alternar entre Wi-Fi e dados móveis ou reinicie seu roteador.'
        },
        connections: ['kyc-permissions', 'kyc-error-500']
      },
      {
        id: 'kyc-permissions',
        type: 'action',
        title: 'Verificar Permissões',
        description: 'Câmera, localização e microfone devem estar habilitadas',
        icon: 'bi-shield-check',
        x: 50,
        y: 350,
        expanded: {
          checks: [
            'Câmera habilitada no navegador',
            'Localização habilitada',
            'Microfone habilitado (se aplicável)'
          ],
          androidSteps: [
            'Configurações > Apps > Chrome > Permissões',
            'Habilitar Câmera, Localização e Microfone'
          ],
          iosSteps: [
            'Ajustes > Safari > Câmera/Microfone/Localização',
            'Definir como "Permitir" ou "Durante o uso"'
          ]
        },
        connections: ['kyc-document']
      },
      {
        id: 'kyc-document',
        type: 'question',
        title: 'Documento enviado com sucesso?',
        description: 'Verificar se a foto do documento foi capturada e enviada',
        icon: 'bi-question-circle',
        x: 50,
        y: 500,
        connections: ['kyc-ocr-check', 'kyc-document-error'],
        branches: [
          { label: 'Sim', target: 'kyc-ocr-check' },
          { label: 'Não', target: 'kyc-document-error' }
        ]
      },
      {
        id: 'kyc-document-error',
        type: 'decision',
        title: 'Erro no Documento',
        description: 'Problemas com captura ou leitura do documento',
        icon: 'bi-file-earmark-x',
        x: 350,
        y: 500,
        expanded: {
          troubleshooting: [
            'Verificar se o documento está dentro do plástico de proteção',
            'Orientar sobre iluminação adequada',
            'Solicitar que coloque o documento em superfície plana',
            'Verificar se todas as bordas estão visíveis',
            'Checar se o documento está dentro da validade'
          ],
          customerMessage: 'Por favor, retire o documento do plástico, coloque-o sobre uma mesa bem iluminada e certifique-se de que todas as bordas estejam visíveis na foto.'
        },
        connections: ['kyc-document']
      },
      {
        id: 'kyc-ocr-check',
        type: 'question',
        title: 'OCR realizou a leitura?',
        description: 'Verificar se os dados do documento foram extraídos',
        icon: 'bi-question-circle',
        x: 50,
        y: 650,
        connections: ['kyc-selfie', 'kyc-ocr-failed'],
        branches: [
          { label: 'Sim', target: 'kyc-selfie' },
          { label: 'Não', target: 'kyc-ocr-failed' }
        ]
      },
      {
        id: 'kyc-ocr-failed',
        type: 'info',
        title: 'Falha no OCR',
        description: 'Sistema não conseguiu ler o documento',
        icon: 'bi-info-circle',
        x: 350,
        y: 650,
        expanded: {
          causes: [
            'Reflexos na foto do documento',
            'Baixa iluminação',
            'Documento cortado ou bordas não visíveis',
            'Plástico de proteção causando reflexo',
            'Documento expirado ou inválido'
          ],
          solution: 'Orientar o usuário a refazer a foto seguindo as boas práticas de captura.'
        },
        connections: ['kyc-document-error']
      },
      {
        id: 'kyc-selfie',
        type: 'action',
        title: 'Iniciar Validação Facial',
        description: 'Usuário deve realizar a captura da selfie e liveness',
        icon: 'bi-camera',
        x: 50,
        y: 800,
        expanded: {
          instructions: [
            'Ambiente bem iluminado com luz de frente',
            'Rosto centralizado e totalmente visível',
            'Sem acessórios (óculos escuros, boné, máscara)',
            'Seguir instruções de aproximar/afastar o rosto'
          ]
        },
        connections: ['kyc-liveness-check']
      },
      {
        id: 'kyc-liveness-check',
        type: 'question',
        title: 'Liveness aprovado?',
        description: 'Verificar se a validação de prova de vida foi bem-sucedida',
        icon: 'bi-question-circle',
        x: 50,
        y: 950,
        connections: ['kyc-facematch-check', 'kyc-liveness-failed'],
        branches: [
          { label: 'Sim', target: 'kyc-facematch-check' },
          { label: 'Não', target: 'kyc-liveness-failed' }
        ]
      },
      {
        id: 'kyc-liveness-failed',
        type: 'decision',
        title: 'Liveness Falhou',
        description: 'Rosto não detectado ou validação de prova de vida reprovada',
        icon: 'bi-x-circle',
        x: 350,
        y: 950,
        expanded: {
          troubleshooting: [
            'Verificar iluminação do ambiente',
            'Confirmar que o rosto está centralizado',
            'Solicitar remoção de acessórios',
            'Limpar a câmera do dispositivo',
            'Verificar permissão da câmera'
          ],
          customerMessage: 'Por favor, vá para um local mais iluminado, remova óculos escuros ou boné, e mantenha o rosto centralizado na câmera.'
        },
        connections: ['kyc-selfie']
      },
      {
        id: 'kyc-facematch-check',
        type: 'question',
        title: 'Face Match aprovado?',
        description: 'Verificar similaridade entre selfie e foto do documento',
        icon: 'bi-question-circle',
        x: 50,
        y: 1100,
        connections: ['kyc-approved', 'kyc-facematch-low'],
        branches: [
          { label: 'Sim', target: 'kyc-approved' },
          { label: 'Não', target: 'kyc-facematch-low' }
        ]
      },
      {
        id: 'kyc-facematch-low',
        type: 'info',
        title: 'Baixa Similaridade Facial',
        description: 'Score de Face Match abaixo do threshold (0.75)',
        icon: 'bi-info-circle',
        x: 350,
        y: 1100,
        expanded: {
          causes: [
            'Foto do documento muito antiga',
            'Ângulo diferente entre selfie e documento',
            'Iluminação inadequada na selfie',
            'Acessórios ou mudanças na aparência',
            'Expressão facial muito diferente'
          ],
          solution: 'Orientar sobre as condições ideais para captura da selfie.'
        },
        connections: ['kyc-selfie']
      },
      {
        id: 'kyc-approved',
        type: 'end',
        title: 'KYC Aprovado ✓',
        description: 'Validação de identidade concluída com sucesso',
        icon: 'bi-check-circle',
        x: 50,
        y: 1250,
        expanded: {
          nextSteps: [
            'Verificar se a jornada avançou para a próxima etapa',
            'Confirmar se há ações pendentes (ex: liberação de saque)',
            'Orientar usuário sobre próximos passos no aplicativo'
          ]
        },
        connections: []
      }
    ]
  },

  // ======================== SELFIE ========================
  selfie: {
    id: 'selfie',
    title: 'Selfie - Validação Facial',
    icon: 'bi-camera',
    category: 'validation',
    description: 'Fluxo de troubleshooting para problemas com selfie e validação facial',
    tags: ['selfie', ' facial', 'liveness', 'câmera'],
    nodes: [
      {
        id: 'selfie-start',
        type: 'start',
        title: 'Problema com Selfie',
        description: 'Iniciar troubleshooting de selfie',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['selfie-check-1']
      },
      {
        id: 'selfie-check-1',
        type: 'question',
        title: 'A câmera abre?',
        description: 'Verificar se a interface da câmera é exibida',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['selfie-permission', 'selfie-black-screen'],
        branches: [
          { label: 'Sim', target: 'selfie-permission' },
          { label: 'Não', target: 'selfie-black-screen' }
        ]
      },
      {
        id: 'selfie-black-screen',
        type: 'decision',
        title: 'Tela Preta / Câmera não abre',
        description: 'A câmera não inicia ou tela fica preta',
        icon: 'bi-x-circle',
        x: 350,
        y: 200,
        expanded: {
          troubleshooting: [
            'Verificar permissão da câmera nas configurações',
            'Fechar outros apps que podem estar usando a câmera',
            'Reiniciar o navegador',
            'Reiniciar o dispositivo',
            'Limpar cache do navegador'
          ],
          customerMessage: 'Por favor, verifique se o Chrome/Safari tem permissão para usar sua câmera em Configurações. Feche outros aplicativos e tente novamente.'
        },
        connections: ['selfie-permission']
      },
      {
        id: 'selfie-permission',
        type: 'action',
        title: 'Verificar Permissão da Câmera',
        description: 'Confirmar que a permissão está habilitada',
        icon: 'bi-shield-check',
        x: 50,
        y: 350,
        expanded: {
          androidSteps: [
            'Configurações > Apps > Chrome > Permissões > Câmera',
            'Selecionar "Permitir"'
          ],
          iosSteps: [
            'Ajustes > Safari > Câmera',
            'Selecionar "Permitir"'
          ],
          note: 'No iOS, todos os navegadores usam WebKit. As permissões seguem as regras do Safari.'
        },
        connections: ['selfie-check-2']
      },
      {
        id: 'selfie-check-2',
        type: 'question',
        title: 'O rosto é detectado?',
        description: 'Verificar se o sistema identifica o rosto do usuário',
        icon: 'bi-question-circle',
        x: 50,
        y: 500,
        connections: ['selfie-liveness', 'selfie-face-not-detected'],
        branches: [
          { label: 'Sim', target: 'selfie-liveness' },
          { label: 'Não', target: 'selfie-face-not-detected' }
        ]
      },
      {
        id: 'selfie-face-not-detected',
        type: 'decision',
        title: 'Rosto Não Detectado',
        description: 'Sistema não consegue identificar o rosto',
        icon: 'bi-x-circle',
        x: 350,
        y: 500,
        expanded: {
          troubleshooting: [
            'Verificar iluminação (luz deve vir de frente)',
            'Confirmar que o rosto está centralizado',
            'Solicitar remoção de óculos escuros, boné, máscara',
            'Pedir para segurar o celular na altura do rosto',
            'Limpar a câmera frontal'
          ],
          customerMessage: 'Por favor, vá para um local bem iluminado, remova acessórios do rosto e mantenha o rosto centralizado na tela.'
        },
        connections: ['selfie-check-2']
      },
      {
        id: 'selfie-liveness',
        type: 'action',
        title: 'Realizar Liveness',
        description: 'Usuário segue instruções de movimento para prova de vida',
        icon: 'bi-camera-video',
        x: 50,
        y: 650,
        expanded: {
          instructions: [
            'Aproximar e afastar o rosto conforme solicitado',
            'Manter movimento suave e contínuo',
            'Não sair do enquadramento',
            'Manter olhos abertos e visíveis'
          ]
        },
        connections: ['selfie-end']
      },
      {
        id: 'selfie-end',
        type: 'end',
        title: 'Selfie Concluída',
        description: 'Processo de validação facial finalizado',
        icon: 'bi-check-circle',
        x: 50,
        y: 800,
        connections: []
      }
    ]
  },

  // ======================== DOCUMENTO ========================
  documento: {
    id: 'documento',
    title: 'Documento - Validação',
    icon: 'bi-file-earmark-text',
    category: 'validation',
    description: 'Fluxo de troubleshooting para problemas com documento',
    tags: ['documento', 'OCR', 'RG', 'CNH', 'validade'],
    nodes: [
      {
        id: 'doc-start',
        type: 'start',
        title: 'Problema com Documento',
        description: 'Iniciar troubleshooting de documento',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['doc-check-1']
      },
      {
        id: 'doc-check-1',
        type: 'question',
        title: 'Consegue acessar a câmera?',
        description: 'Verificar se a câmera para documento está acessível',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['doc-capture', 'doc-camera-issue'],
        branches: [
          { label: 'Sim', target: 'doc-capture' },
          { label: 'Não', target: 'doc-camera-issue' }
        ]
      },
      {
        id: 'doc-camera-issue',
        type: 'decision',
        title: 'Problema com Câmera',
        description: 'Câmera não está acessível para captura do documento',
        icon: 'bi-x-circle',
        x: 350,
        y: 200,
        expanded: {
          troubleshooting: [
            'Verificar permissão da câmera',
            'Fechar outros apps usando a câmera',
            'Reiniciar o navegador',
            'Testar em outro navegador'
          ]
        },
        connections: ['doc-capture']
      },
      {
        id: 'doc-capture',
        type: 'action',
        title: 'Capturar Documento',
        description: 'Orientar sobre a captura da foto do documento',
        icon: 'bi-camera',
        x: 50,
        y: 350,
        expanded: {
          instructions: [
            'Retirar documento do plástico de proteção',
            'Colocar em superfície plana e escura',
            'Usar boa iluminação (luz natural ou de frente)',
            'Enquadrar todo o documento com bordas visíveis',
            'Evitar reflexos e sombras',
            'Manter o celular estável'
          ]
        },
        connections: ['doc-ocr-check']
      },
      {
        id: 'doc-ocr-check',
        type: 'question',
        title: 'OCR conseguiu ler?',
        description: 'Verificar se os dados foram extraídos do documento',
        icon: 'bi-question-circle',
        x: 50,
        y: 500,
        connections: ['doc-validity-check', 'doc-ocr-failed'],
        branches: [
          { label: 'Sim', target: 'doc-validity-check' },
          { label: 'Não', target: 'doc-ocr-failed' }
        ]
      },
      {
        id: 'doc-ocr-failed',
        type: 'decision',
        title: 'Falha no OCR',
        description: 'Sistema não conseguiu ler os dados do documento',
        icon: 'bi-x-circle',
        x: 350,
        y: 500,
        expanded: {
          causes: [
            'Reflexos na superfície do documento',
            'Baixa iluminação',
            'Bordas cortadas ou documento incompleto',
            'Plástico de proteção causando reflexo',
            'Documento danificado ou ilegível'
          ],
          customerMessage: 'Por favor, retire o documento do plástico, coloque sobre uma mesa bem iluminada e certifique-se de que todas as bordas estejam visíveis.'
        },
        connections: ['doc-capture']
      },
      {
        id: 'doc-validity-check',
        type: 'question',
        title: 'Documento está válido?',
        description: 'Verificar se o documento está dentro da validade',
        icon: 'bi-question-circle',
        x: 50,
        y: 650,
        connections: ['doc-type-check', 'doc-expired'],
        branches: [
          { label: 'Sim', target: 'doc-type-check' },
          { label: 'Não', target: 'doc-expired' }
        ]
      },
      {
        id: 'doc-expired',
        type: 'end',
        title: 'Documento Expirado',
        description: 'Documento fora do prazo de validade',
        icon: 'bi-x-circle',
        x: 350,
        y: 650,
        expanded: {
          acceptedDocuments: [
            'RG (dentro da validade ou emitido há menos de 10 anos)',
            'CNH (dentro da validade)',
            'RNE/CRNM (dentro da validade)',
            'Passaporte brasileiro (dentro da validade)'
          ],
          customerMessage: 'Seu documento está expirado. Por favor, utilize um documento válido dentro do prazo de validade. Aceitamos RG, CNH, RNE ou Passaporte.'
        },
        connections: []
      },
      {
        id: 'doc-type-check',
        type: 'question',
        title: 'Tipo de documento aceito?',
        description: 'Verificar se o documento é do tipo aceito (RG, CNH, RNE/CRNM e Passaporte brasileiro)',
        icon: 'bi-question-circle',
        x: 50,
        y: 800,
        connections: ['doc-end', 'doc-type-rejected'],
        branches: [
          { label: 'Sim', target: 'doc-end' },
          { label: 'Não', target: 'doc-type-rejected' }
        ]
      },
      {
        id: 'doc-type-rejected',
        type: 'info',
        title: 'Documento Não Aceito',
        description: 'Tipo de documento não é aceito no fluxo',
        icon: 'bi-info-circle',
        x: 350,
        y: 800,
        expanded: {
          acceptedDocuments: [
            'RG (Carteira de Identidade)',
            'CNH (Carteira Nacional de Habilitação)',
            'RNE/CRNM (Registro Nacional de Estrangeiro)',
            'Passaporte brasileiro'
          ],
          rejectedDocuments: [
            'Carteira de Trabalho (física)',
            'Título de Eleitor',
            'CPF',
            'Certificado de Reservista',
            'Documentos estrangeiros (exceto RNE)'
          ]
        },
        connections: ['doc-capture']
      },
      {
        id: 'doc-end',
        type: 'end',
        title: 'Documento Validado ✓',
        description: 'Documento aceito e dados extraídos com sucesso',
        icon: 'bi-check-circle',
        x: 50,
        y: 950,
        connections: []
      }
    ]
  },

  // ======================== VPN/PROXY ========================
  vpn: {
    id: 'vpn',
    title: 'VPN / Proxy',
    icon: 'bi-shield-exclamation',
    category: 'connectivity',
    description: 'Fluxo para identificar e resolver problemas com VPN e Proxy',
    tags: ['VPN', 'proxy', 'DNS', 'localização', 'conexão'],
    nodes: [
      {
        id: 'vpn-start',
        type: 'start',
        title: 'Problema com VPN/Proxy',
        description: 'Iniciar verificação de VPN e Proxy',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['vpn-check-1']
      },
      {
        id: 'vpn-check-1',
        type: 'question',
        title: 'Validação não inicia ou trava?',
        description: 'Verificar sintomas de bloqueio por VPN/Proxy',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['vpn-android-check', 'vpn-ios-check'],
        branches: [
          { label: 'Sim', target: 'vpn-android-check' },
          { label: 'Não', target: 'vpn-ios-check' }
        ]
      },
      {
        id: 'vpn-android-check',
        type: 'action',
        title: 'Verificar VPN no Android',
        description: 'Checar configurações de VPN e Proxy no Android',
        icon: 'bi-android2',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Configurações > Rede e Internet > VPN',
            'Verificar se há VPN ativa e desconectar',
            'Configurações > Rede e Internet > Proxy',
            'Confirmar que não há Proxy configurado',
            'Configurações > Rede e Internet > DNS Privado',
            'Deixar como Automático ou Desativado'
          ],
          customerMessage: 'Por favor, acesse Configurações > Rede e Internet > VPN e desconecte qualquer VPN ativa. Verifique também as configurações de Proxy e DNS Privado.'
        },
        connections: ['vpn-verify']
      },
      {
        id: 'vpn-ios-check',
        type: 'action',
        title: 'Verificar VPN no iOS',
        description: 'Checar configurações de VPN e Proxy no iPhone',
        icon: 'bi-apple',
        x: 350,
        y: 350,
        expanded: {
          steps: [
            'Ajustes > Geral > VPN e Gerenciamento de Dispositivo',
            'Desconectar VPN se estiver ativa',
            'Ajustes > Wi-Fi > [rede] > Configurar Proxy',
            'Deixar como Desativado',
            'Fechar apps de VPN instalados'
          ],
          customerMessage: 'Por favor, acesse Ajustes > Geral > VPN e desconecte qualquer VPN ativa. Verifique também as configurações de Proxy no Wi-Fi.'
        },
        connections: ['vpn-verify']
      },
      {
        id: 'vpn-verify',
        type: 'question',
        title: 'VPN/Proxy desativados?',
        description: 'Confirmar que VPN e Proxy foram desativados',
        icon: 'bi-question-circle',
        x: 200,
        y: 500,
        connections: ['vpn-restart', 'vpn-still-active'],
        branches: [
          { label: 'Sim', target: 'vpn-restart' },
          { label: 'Não', target: 'vpn-still-active' }
        ]
      },
      {
        id: 'vpn-still-active',
        type: 'decision',
        title: 'VPN/Proxy ainda ativos',
        description: 'Necessário desativar completamente',
        icon: 'bi-x-circle',
        x: 350,
        y: 500,
        expanded: {
          troubleshooting: [
            'Fechar aplicativos de VPN (ProtonVPN, NordVPN, etc.)',
            'Desativar VPN nas configurações do sistema',
            'Desativar Proxy nas configurações de rede',
            'Desativar DNS Privado',
            'Reiniciar o dispositivo se necessário'
          ]
        },
        connections: ['vpn-android-check', 'vpn-ios-check']
      },
      {
        id: 'vpn-restart',
        type: 'action',
        title: 'Reiniciar Validação',
        description: 'Reiniciar o processo de validação após desativar VPN',
        icon: 'bi-arrow-counterclockwise',
        x: 200,
        y: 650,
        expanded: {
          steps: [
            'Fechar completamente o navegador',
            'Abrir nova aba/navegador',
            'Acessar o link de validação',
            'Iniciar o processo de KYC'
          ]
        },
        connections: ['vpn-success']
      },
      {
        id: 'vpn-success',
        type: 'end',
        title: 'VPN Resolvido ✓',
        description: 'Validação deve funcionar sem VPN/Proxy',
        icon: 'bi-check-circle',
        x: 200,
        y: 800,
        connections: []
      }
    ]
  },

  // ======================== ERRO 500 ========================
  error500: {
    id: 'error500',
    title: 'Erro 500',
    icon: 'bi-exclamation-triangle',
    category: 'errors',
    description: 'Fluxo para resolver erro interno do servidor (500)',
    tags: ['erro 500', 'servidor', 'internal server error'],
    nodes: [
      {
        id: 'e500-start',
        type: 'start',
        title: 'Erro 500 Detectado',
        description: 'Erro interno do servidor durante validação',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['e500-check-1']
      },
      {
        id: 'e500-check-1',
        type: 'question',
        title: 'Primeira tentativa?',
        description: 'Verificar se é a primeira ocorrência do erro',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['e500-refresh', 'e500-persistent'],
        branches: [
          { label: 'Sim', target: 'e500-refresh' },
          { label: 'Não', target: 'e500-persistent' }
        ]
      },
      {
        id: 'e500-refresh',
        type: 'action',
        title: 'Atualizar Página',
        description: 'Tentar novamente com refresh da página',
        icon: 'bi-arrow-clockwise',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Pressionar F5 ou puxar a tela para baixo (mobile)',
            'Aguardar recarregamento completo',
            'Tentar iniciar a validação novamente'
          ]
        },
        connections: ['e500-check-2']
      },
      {
        id: 'e500-check-2',
        type: 'question',
        title: 'Erro persiste?',
        description: 'Verificar se o erro 500 continua após refresh',
        icon: 'bi-question-circle',
        x: 50,
        y: 500,
        connections: ['e500-cache', 'e500-end'],
        branches: [
          { label: 'Sim', target: 'e500-cache' },
          { label: 'Não', target: 'e500-end' }
        ]
      },
      {
        id: 'e500-cache',
        type: 'action',
        title: 'Limpar Cache',
        description: 'Limpar cache e cookies do navegador',
        icon: 'bi-trash',
        x: 50,
        y: 650,
        expanded: {
          androidSteps: [
            'Configurações > Apps > Chrome > Limpar dados',
            'Selecionar "Limpar cache" e "Limpar cookies"',
            'Confirmar limpeza'
          ],
          iosSteps: [
            'Ajustes > Safari > Avançado',
            'Dados dos Sites > Remover Todos os Dados',
            'Confirmar'
          ]
        },
        connections: ['e500-browser-check']
      },
      {
        id: 'e500-browser-check',
        type: 'question',
        title: 'Navegador atualizado?',
        description: 'Verificar se o navegador está na versão mais recente',
        icon: 'bi-question-circle',
        x: 50,
        y: 800,
        connections: ['e500-network-check', 'e500-update'],
        branches: [
          { label: 'Sim', target: 'e500-network-check' },
          { label: 'Não', target: 'e500-update' }
        ]
      },
      {
        id: 'e500-update',
        type: 'action',
        title: 'Atualizar Navegador',
        description: 'Instalar atualização disponível do navegador',
        icon: 'bi-download',
        x: 350,
        y: 800,
        expanded: {
          steps: [
            'Android: Play Store > Chrome > Atualizar',
            'iOS: App Store > Atualizações > Safari/Chrome',
            'Reiniciar o navegador após atualização'
          ]
        },
        connections: ['e500-network-check']
      },
      {
        id: 'e500-network-check',
        type: 'question',
        title: 'Rede estável?',
        description: 'Verificar qualidade da conexão de internet',
        icon: 'bi-question-circle',
        x: 200,
        y: 950,
        connections: ['e500-wait', 'e500-switch-network'],
        branches: [
          { label: 'Sim', target: 'e500-wait' },
          { label: 'Não', target: 'e500-switch-network' }
        ]
      },
      {
        id: 'e500-switch-network',
        type: 'action',
        title: 'Trocar Rede',
        description: 'Alternar entre Wi-Fi e dados móveis',
        icon: 'bi-wifi',
        x: 350,
        y: 950,
        expanded: {
          steps: [
            'Desativar Wi-Fi e usar dados móveis',
            'Ou conectar em Wi-Fi se estiver em dados',
            'Testar a validação na nova rede'
          ]
        },
        connections: ['e500-persistent']
      },
      {
        id: 'e500-persistent',
        type: 'decision',
        title: 'Erro Persistente',
        description: 'Erro 500 continua após todas as tentativas',
        icon: 'bi-exclamation-circle',
        x: 200,
        y: 1100,
        expanded: {
          action: 'Coletar evidências e escalar para equipe técnica',
          evidence: [
            'Print da tela de erro 500',
            'Gravação de tela do problema',
            'Horário exato da ocorrência',
            'Modelo do dispositivo e versão do SO',
            'Navegador e versão utilizados',
            'Tipo de conexão (Wi-Fi/4G/5G)'
          ]
        },
        connections: ['e500-wait']
      },
      {
        id: 'e500-wait',
        type: 'info',
        title: 'Aguardar e Tentar Novamente',
        description: 'Erro 500 pode ser temporário - aguardar alguns minutos',
        icon: 'bi-clock',
        x: 200,
        y: 1250,
        expanded: {
          recommendation: 'Aguardar 5-10 minutos antes de nova tentativa. Se o erro persistir, escalar para análise técnica com as evidências coletadas.'
        },
        connections: ['e500-refresh']
      },
      {
        id: 'e500-end',
        type: 'end',
        title: 'Erro 500 Resolvido ✓',
        description: 'Validação funcionando normalmente',
        icon: 'bi-check-circle',
        x: 350,
        y: 500,
        connections: []
      }
    ]
  },

  // ======================== ERRO 404 ========================
  error404: {
    id: 'error404',
    title: 'Erro 404',
    icon: 'bi-file-earmark-x',
    category: 'errors',
    description: 'Fluxo para resolver erro de página não encontrada (404)',
    tags: ['erro 404', 'página não encontrada', 'link inválido'],
    nodes: [
      {
        id: 'e404-start',
        type: 'start',
        title: 'Erro 404 Detectado',
        description: 'Página não encontrada ao acessar validação',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['e404-check-1']
      },
      {
        id: 'e404-check-1',
        type: 'question',
        title: 'Link foi copiado corretamente?',
        description: 'Verificar integridade do link de validação',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['e404-new-link', 'e404-verify'],
        branches: [
          { label: 'Não', target: 'e404-new-link' },
          { label: 'Sim', target: 'e404-verify' }
        ]
      },
      {
        id: 'e404-new-link',
        type: 'action',
        title: 'Gerar Novo Link',
        description: 'Solicitar novo link de validação',
        icon: 'bi-link-45deg',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Acessar o aplicativo/site principal',
            'Iniciar novo processo de validação',
            'Copiar o novo link gerado',
            'Abrir em nova aba do navegador'
          ],
          customerMessage: 'Por favor, acesse o aplicativo e solicite um novo link de validação. Evite usar links antigos salvos.'
        },
        connections: ['e404-end']
      },
      {
        id: 'e404-verify',
        type: 'action',
        title: 'Verificar Link',
        description: 'Confirmar que o link está completo e correto',
        icon: 'bi-search',
        x: 350,
        y: 200,
        expanded: {
          checks: [
            'Link começa com https://',
            'Não há quebras de linha no meio do link',
            'Não há caracteres estranhos adicionados',
            'Link foi aberto diretamente no navegador (não por app de mensagem)'
          ]
        },
        connections: ['e404-browser-check']
      },
      {
        id: 'e404-browser-check',
        type: 'question',
        title: 'Abrindo no navegador correto?',
        description: 'Verificar se está usando navegador compatível',
        icon: 'bi-question-circle',
        x: 350,
        y: 350,
        connections: ['e404-open-browser', 'e404-expired'],
        branches: [
          { label: 'Não', target: 'e404-open-browser' },
          { label: 'Sim', target: 'e404-expired' }
        ]
      },
      {
        id: 'e404-open-browser',
        type: 'action',
        title: 'Abrir no Navegador',
        description: 'Usar Chrome (Android) ou Safari (iOS)',
        icon: 'bi-browser-chrome',
        x: 350,
        y: 500,
        expanded: {
          steps: [
            'Copiar o link de validação',
            'Abrir Chrome ou Safari',
            'Colar o link na barra de endereços',
            'Acessar a página'
          ]
        },
        connections: ['e404-expired']
      },
      {
        id: 'e404-expired',
        type: 'decision',
        title: 'Link Expirado?',
        description: 'Links de validação têm tempo limitado de validade',
        icon: 'bi-clock',
        x: 200,
        y: 650,
        expanded: {
          info: 'Links de validação expiram após um período de tempo por segurança. Se o link estiver expirado, é necessário gerar um novo.',
          customerMessage: 'Seu link de validação pode ter expirado. Por favor, solicite um novo link através do aplicativo.'
        },
        connections: ['e404-new-link']
      },
      {
        id: 'e404-end',
        type: 'end',
        title: 'Erro 404 Resolvido ✓',
        description: 'Link de validação funcionando',
        icon: 'bi-check-circle',
        x: 200,
        y: 800,
        connections: []
      }
    ]
  },

  // ======================== ERRO 116 ========================
  error116: {
    id: 'error116',
    title: 'Erro 116',
    icon: 'bi-wifi-off',
    category: 'errors',
    description: 'Fluxo para resolver erro de conexão 116',
    tags: ['erro 116', 'conexão', 'rede', 'instabilidade'],
    nodes: [
      {
        id: 'e116-start',
        type: 'start',
        title: 'Erro 116 Detectado',
        description: 'Erro de conexão durante validação',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['e116-check-1']
      },
      {
        id: 'e116-check-1',
        type: 'question',
        title: 'Internet está funcionando?',
        description: 'Verificar se há conexão ativa',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['e116-toggle', 'e116-quality'],
        branches: [
          { label: 'Não', target: 'e116-toggle' },
          { label: 'Sim', target: 'e116-quality' }
        ]
      },
      {
        id: 'e116-toggle',
        type: 'action',
        title: 'Reiniciar Conexão',
        description: 'Desativar e reativar a conexão de internet',
        icon: 'bi-arrow-repeat',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Ativar Modo Avião por 10 segundos',
            'Desativar Modo Avião',
            'Aguardar reconexão (20 segundos)',
            'Testar internet em outro app'
          ]
        },
        connections: ['e116-quality']
      },
      {
        id: 'e116-quality',
        type: 'question',
        title: 'Sinal está forte?',
        description: 'Verificar qualidade do sinal de rede',
        icon: 'bi-question-circle',
        x: 200,
        y: 500,
        connections: ['e116-move', 'e116-check-vpn'],
        branches: [
          { label: 'Não', target: 'e116-move' },
          { label: 'Sim', target: 'e116-check-vpn' }
        ]
      },
      {
        id: 'e116-move',
        type: 'action',
        title: 'Mudar de Local',
        description: 'Buscar local com melhor sinal de conexão',
        icon: 'bi-geo-alt',
        x: 350,
        y: 500,
        expanded: {
          tips: [
            'Aproximar-se do roteador Wi-Fi',
            'Ir para área aberta se estiver em dados móveis',
            'Evitar subsolos ou áreas fechadas',
            'Verificar se há obstáculos bloqueando o sinal'
          ]
        },
        connections: ['e116-check-vpn']
      },
      {
        id: 'e116-check-vpn',
        type: 'question',
        title: 'VPN ou Proxy ativos?',
        description: 'Verificar se há VPN ou Proxy interferindo',
        icon: 'bi-question-circle',
        x: 200,
        y: 650,
        connections: ['e116-disable-vpn', 'e116-switch-network'],
        branches: [
          { label: 'Sim', target: 'e116-disable-vpn' },
          { label: 'Não', target: 'e116-switch-network' }
        ]
      },
      {
        id: 'e116-disable-vpn',
        type: 'action',
        title: 'Desativar VPN/Proxy',
        description: 'Remover interferências de rede',
        icon: 'bi-shield-x',
        x: 350,
        y: 650,
        expanded: {
          steps: [
            'Desconectar VPN nas configurações',
            'Fechar apps de VPN',
            'Desativar Proxy se configurado',
            'Desativar DNS Privado'
          ]
        },
        connections: ['e116-switch-network']
      },
      {
        id: 'e116-switch-network',
        type: 'action',
        title: 'Trocar Tipo de Rede',
        description: 'Alternar entre Wi-Fi e dados móveis',
        icon: 'bi-wifi',
        x: 200,
        y: 800,
        expanded: {
          steps: [
            'Se estiver no Wi-Fi, usar dados móveis',
            'Se estiver em dados, conectar no Wi-Fi',
            'Testar validação na nova conexão'
          ]
        },
        connections: ['e116-restart']
      },
      {
        id: 'e116-restart',
        type: 'action',
        title: 'Reiniciar Validação',
        description: 'Iniciar nova tentativa de validação',
        icon: 'bi-arrow-clockwise',
        x: 200,
        y: 950,
        expanded: {
          steps: [
            'Fechar completamente o navegador',
            'Abrir nova aba',
            'Acessar link de validação',
            'Iniciar processo'
          ]
        },
        connections: ['e116-end']
      },
      {
        id: 'e116-end',
        type: 'end',
        title: 'Erro 116 Resolvido ✓',
        description: 'Conexão estabilizada para validação',
        icon: 'bi-check-circle',
        x: 200,
        y: 1100,
        connections: []
      }
    ]
  },

  // ======================== SAQUE ========================
  saque: {
    id: 'saque',
    title: 'Saque - Liberação',
    icon: 'bi-cash-coin',
    category: 'operations',
    description: 'Fluxo para problemas relacionados a saques após validação',
    tags: ['saque', 'withdrawal', 'liberação', 'pix'],
    nodes: [
      {
        id: 'saque-start',
        type: 'start',
        title: 'Problema com Saque',
        description: 'Saque não liberado após validação KYC',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['saque-check-1']
      },
      {
        id: 'saque-check-1',
        type: 'question',
        title: 'KYC foi aprovado?',
        description: 'Verificar status da validação de identidade',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['saque-verify-status', 'saque-pending'],
        branches: [
          { label: 'Sim', target: 'saque-verify-status' },
          { label: 'Não', target: 'saque-pending' }
        ]
      },
      {
        id: 'saque-pending',
        type: 'info',
        title: 'KYC Pendente',
        description: 'Validação ainda não foi concluída',
        icon: 'bi-info-circle',
        x: 350,
        y: 200,
        expanded: {
          info: 'O saque só é liberado após aprovação do KYC. O usuário precisa completar a validação de identidade primeiro.',
          customerMessage: 'Seu saque será liberado após a aprovação da validação de identidade (KYC). Por favor, complete o processo de validação.'
        },
        connections: []
      },
      {
        id: 'saque-verify-status',
        type: 'action',
        title: 'Verificar Status no Painel',
        description: 'Consultar status no painel do fornecedor',
        icon: 'bi-bar-chart',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Acessar painel do fornecedor de validação',
            'Buscar pelo usuário/CPF',
            'Verificar status do liveness',
            'Checar se há registros da validação'
          ]
        },
        connections: ['saque-check-2']
      },
      {
        id: 'saque-check-2',
        type: 'question',
        title: 'Validação aparece no painel?',
        description: 'Verificar se há registro da validação',
        icon: 'bi-question-circle',
        x: 50,
        y: 500,
        connections: ['saque-sync-wait', 'saque-app-check'],
        branches: [
          { label: 'Sim', target: 'saque-sync-wait' },
          { label: 'Não', target: 'saque-app-check' }
        ]
      },
      {
        id: 'saque-app-check',
        type: 'decision',
        title: 'Validação foi pelo App externo?',
        description: 'Verificar se usuário usou app do fornecedor',
        icon: 'bi-phone',
        x: 350,
        y: 500,
        expanded: {
          issue: 'Quando a validação é feita pelo app externo do fornecedor, a sincronização com o sistema interno pode falhar.',
          solution: 'Orientar usuário a refazer a validação pelo navegador.',
          customerMessage: 'Para garantir que seu saque seja liberado corretamente, por favor refaça a validação diretamente pelo navegador, não pelo aplicativo externo.'
        },
        connections: ['saque-redo']
      },
      {
        id: 'saque-redo',
        type: 'action',
        title: 'Refazer Validação pelo Navegador',
        description: 'Orientar usuário a usar o navegador',
        icon: 'bi-browser-chrome',
        x: 350,
        y: 650,
        expanded: {
          steps: [
            'Abrir Chrome (Android) ou Safari (iOS)',
            'Habilitar permissões de câmera e localização',
            'Acessar o link de validação',
            'Completar todo o fluxo pelo navegador'
          ]
        },
        connections: ['saque-sync-wait']
      },
      {
        id: 'saque-sync-wait',
        type: 'info',
        title: 'Aguardar Sincronização',
        description: 'Sistema pode levar alguns minutos para sincronizar',
        icon: 'bi-clock',
        x: 200,
        y: 800,
        expanded: {
          info: 'Após aprovação do KYC, o sistema pode levar de 1 a 5 minutos para liberar o saque automaticamente.',
          recommendation: 'Aguardar alguns minutos e verificar se o saque foi liberado.'
        },
        connections: ['saque-check-3']
      },
      {
        id: 'saque-check-3',
        type: 'question',
        title: 'Saque liberado?',
        description: 'Verificar se o saque está disponível',
        icon: 'bi-question-circle',
        x: 200,
        y: 950,
        connections: ['saque-end', 'saque-escalate'],
        branches: [
          { label: 'Sim', target: 'saque-end' },
          { label: 'Não', target: 'saque-escalate' }
        ]
      },
      {
        id: 'saque-escalate',
        type: 'decision',
        title: 'Escalar para Equipe Técnica',
        description: 'Saque não liberado mesmo com KYC aprovado',
        icon: 'bi-exclamation-circle',
        x: 350,
        y: 950,
        expanded: {
          evidence: [
            'Print do status aprovado no painel do fornecedor',
            'Print da tela de saque bloqueado',
            'CPF do usuário',
            'Horário da validação',
            'Gravação de tela se possível'
          ]
        },
        connections: ['saque-end']
      },
      {
        id: 'saque-end',
        type: 'end',
        title: 'Saque Resolvido ✓',
        description: 'Saque liberado com sucesso',
        icon: 'bi-check-circle',
        x: 200,
        y: 1100,
        connections: []
      }
    ]
  },

  
  // ======================== LOGIN ========================
  login: {
    id: 'login',
    title: 'Login',
    icon: 'bi-box-arrow-in-right',
    category: 'access',
    description: 'Fluxo para problemas de acesso e login',
    tags: ['login', 'acesso', 'senha', 'conta'],
    nodes: [
      {
        id: 'login-start',
        type: 'start',
        title: 'Problema de Login',
        description: 'Usuário não consegue acessar a conta',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['login-check-1']
      },
      {
        id: 'login-check-1',
        type: 'question',
        title: 'Credenciais corretas?',
        description: 'Verificar se email e senha estão corretos',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['login-forgot-password', 'login-check-2'],
        branches: [
          { label: 'Não lembra', target: 'login-forgot-password' },
          { label: 'Sim', target: 'login-check-2' }
        ]
      },
      {
        id: 'login-forgot-password',
        type: 'action',
        title: 'Recuperar Senha',
        description: 'Iniciar processo de recuperação de senha',
        icon: 'bi-key',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Clicar em "Esqueci minha senha"',
            'Inserir email cadastrado',
            'Verificar caixa de entrada e spam',
            'Clicar no link de recuperação',
            'Criar nova senha forte'
          ]
        },
        connections: ['login-end']
      },
      {
        id: 'login-check-2',
        type: 'question',
        title: 'Conta está bloqueada?',
        description: 'Verificar se há bloqueio na conta',
        icon: 'bi-question-circle',
        x: 350,
        y: 200,
        connections: ['login-unlock', 'login-check-3'],
        branches: [
          { label: 'Sim', target: 'login-unlock' },
          { label: 'Não', target: 'login-check-3' }
        ]
      },
      {
        id: 'login-unlock',
        type: 'decision',
        title: 'Conta Bloqueada',
        description: 'Conta bloqueada por segurança',
        icon: 'bi-lock',
        x: 350,
        y: 350,
        expanded: {
          reasons: [
            'Múltiplas tentativas de login falhas',
            'Atividade suspeita detectada',
            'Solicitação do próprio usuário',
            'Pendências de validação KYC'
          ],
          solution: 'Contatar suporte para desbloqueio ou aguardar período de bloqueio temporário.'
        },
        connections: ['login-end']
      },
      {
        id: 'login-check-3',
        type: 'question',
        title: 'Navegador/App atualizado?',
        description: 'Verificar versão do navegador ou aplicativo',
        icon: 'bi-question-circle',
        x: 200,
        y: 500,
        connections: ['login-update', 'login-clear-data'],
        branches: [
          { label: 'Não', target: 'login-update' },
          { label: 'Sim', target: 'login-clear-data' }
        ]
      },
      {
        id: 'login-update',
        type: 'action',
        title: 'Atualizar Navegador/App',
        description: 'Instalar versão mais recente',
        icon: 'bi-download',
        x: 350,
        y: 500,
        expanded: {
          steps: [
            'Play Store/App Store > Buscar app',
            'Clicar em Atualizar',
            'Reiniciar o app após atualização'
          ]
        },
        connections: ['login-clear-data']
      },
      {
        id: 'login-clear-data',
        type: 'action',
        title: 'Limpar Cache/Dados',
        description: 'Remover dados armazenados que podem causar conflito',
        icon: 'bi-trash',
        x: 200,
        y: 650,
        expanded: {
          androidSteps: [
            'Configurações > Apps > [App] > Armazenamento',
            'Limpar Cache e Limpar Dados'
          ],
          iosSteps: [
            'Ajustes > Geral > Armazenamento do iPhone',
            'Selecionar app > Desinstalar App (mantém dados)',
            'Ou: Ajustes > [App] > Redefinir'
          ]
        },
        connections: ['login-end']
      },
      {
        id: 'login-end',
        type: 'end',
        title: 'Login Resolvido ✓',
        description: 'Acesso à conta restaurado',
        icon: 'bi-check-circle',
        x: 200,
        y: 800,
        connections: []
      }
    ]
  },

  // ======================== CÂMERA ========================
  camera: {
    id: 'camera',
    title: 'Câmera',
    icon: 'bi-camera-video',
    category: 'technical',
    description: 'Fluxo para problemas técnicos com câmera',
    tags: ['câmera', 'camera', 'preta', 'não abre', 'trava'],
    nodes: [
      {
        id: 'cam-start',
        type: 'start',
        title: 'Problema com Câmera',
        description: 'Câmera não funciona durante validação',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['cam-check-1']
      },
      {
        id: 'cam-check-1',
        type: 'question',
        title: 'Câmera abre em outros apps?',
        description: 'Testar câmera em outro aplicativo',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['cam-permission', 'cam-hardware'],
        branches: [
          { label: 'Sim', target: 'cam-permission' },
          { label: 'Não', target: 'cam-hardware' }
        ]
      },
      {
        id: 'cam-hardware',
        type: 'decision',
        title: 'Problema de Hardware',
        description: 'Câmera com defeito ou indisponível',
        icon: 'bi-x-circle',
        x: 350,
        y: 200,
        expanded: {
          troubleshooting: [
            'Reiniciar o dispositivo',
            'Verificar se há apps usando a câmera em segundo plano',
            'Testar câmera no app nativo de fotos',
            'Se persistir, pode ser defeito de hardware'
          ],
          recommendation: 'Se a câmera não funciona em nenhum app, o usuário precisa consertar o dispositivo.'
        },
        connections: ['cam-permission']
      },
      {
        id: 'cam-permission',
        type: 'action',
        title: 'Verificar Permissão',
        description: 'Confirmar permissão da câmera no navegador',
        icon: 'bi-shield-check',
        x: 50,
        y: 350,
        expanded: {
          androidSteps: [
            'Configurações > Apps > Chrome > Permissões',
            'Câmera > Permitir'
          ],
          iosSteps: [
            'Ajustes > Safari > Câmera',
            'Selecionar Permitir'
          ]
        },
        connections: ['cam-check-2']
      },
      {
        id: 'cam-check-2',
        type: 'question',
        title: 'Há outras abas/apps usando câmera?',
        description: 'Verificar conflito de uso da câmera',
        icon: 'bi-question-circle',
        x: 50,
        y: 500,
        connections: ['cam-close-apps', 'cam-check-3'],
        branches: [
          { label: 'Sim', target: 'cam-close-apps' },
          { label: 'Não', target: 'cam-check-3' }
        ]
      },
      {
        id: 'cam-close-apps',
        type: 'action',
        title: 'Fechar Outros Apps',
        description: 'Liberar câmera fechando apps concorrentes',
        icon: 'bi-x-square',
        x: 350,
        y: 500,
        expanded: {
          steps: [
            'Fechar apps de vídeo chamada (Zoom, Meet, etc.)',
            'Fechar apps de câmera/foto',
            'Fechar redes sociais em segundo plano',
            'Reiniciar o navegador'
          ]
        },
        connections: ['cam-check-3']
      },
      {
        id: 'cam-check-3',
        type: 'question',
        title: 'Cache foi limpo?',
        description: 'Verificar se o cache do navegador foi limpo',
        icon: 'bi-question-circle',
        x: 200,
        y: 650,
        connections: ['cam-clear-cache', 'cam-restart'],
        branches: [
          { label: 'Não', target: 'cam-clear-cache' },
          { label: 'Sim', target: 'cam-restart' }
        ]
      },
      {
        id: 'cam-clear-cache',
        type: 'action',
        title: 'Limpar Cache',
        description: 'Remover cache do navegador',
        icon: 'bi-trash',
        x: 350,
        y: 650,
        expanded: {
          androidSteps: [
            'Configurações > Apps > Chrome > Armazenamento',
            'Limpar Cache'
          ],
          iosSteps: [
            'Ajustes > Safari > Avançado',
            'Dados dos Sites > Remover Todos os Dados'
          ]
        },
        connections: ['cam-restart']
      },
      {
        id: 'cam-restart',
        type: 'action',
        title: 'Reiniciar Dispositivo',
        description: 'Reiniciar celular para liberar recursos',
        icon: 'bi-power',
        x: 200,
        y: 800,
        expanded: {
          steps: [
            'Manter botão power pressionado',
            'Selecionar "Reiniciar"',
            'Aguardar inicialização completa',
            'Testar câmera novamente'
          ]
        },
        connections: ['cam-end']
      },
      {
        id: 'cam-end',
        type: 'end',
        title: 'Câmera Funcionando ✓',
        description: 'Câmera operacional para validação',
        icon: 'bi-check-circle',
        x: 200,
        y: 950,
        connections: []
      }
    ]
  },

  // ======================== PERMISSÕES ========================
  permissoes: {
    id: 'permissoes',
    title: 'Permissões',
    icon: 'bi-shield-check',
    category: 'technical',
    description: 'Fluxo para gerenciamento de permissões do dispositivo',
    tags: ['permissões', 'câmera', 'localização', 'microfone'],
    nodes: [
      {
        id: 'perm-start',
        type: 'start',
        title: 'Gerenciar Permissões',
        description: 'Verificar e ajustar permissões necessárias',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['perm-check-1']
      },
      {
        id: 'perm-check-1',
        type: 'question',
        title: 'Qual permissão verificar?',
        description: 'Selecionar tipo de permissão',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['perm-camera', 'perm-location'],
        branches: [
          { label: 'Câmera', target: 'perm-camera' },
          { label: 'Localização', target: 'perm-location' }
        ]
      },
      {
        id: 'perm-camera',
        type: 'action',
        title: 'Permissão de Câmera',
        description: 'Habilitar acesso à câmera',
        icon: 'bi-camera',
        x: 50,
        y: 350,
        expanded: {
          androidSteps: [
            'Configurações > Apps > Chrome > Permissões',
            'Câmera > Selecionar "Permitir"',
            'Reiniciar o navegador'
          ],
          iosSteps: [
            'Ajustes > Safari > Câmera',
            'Ativar a permissão',
            'Reiniciar o Safari'
          ],
          note: 'No iOS, todos os navegadores seguem as permissões do Safari.'
        },
        connections: ['perm-verify']
      },
      {
        id: 'perm-location',
        type: 'action',
        title: 'Permissão de Localização',
        description: 'Habilitar acesso à localização',
        icon: 'bi-geo-alt',
        x: 350,
        y: 350,
        expanded: {
          androidSteps: [
            'Configurações > Apps > Chrome > Permissões',
            'Localização > Selecionar "Permitir"',
            'Ativar GPS no dispositivo'
          ],
          iosSteps: [
            'Ajustes > Safari > Localização',
            'Selecionar "Durante o uso"',
            'Ativar Serviços de Localização'
          ],
          note: 'A localização é necessária para análise antifraude.'
        },
        connections: ['perm-verify']
      },
      {
        id: 'perm-verify',
        type: 'action',
        title: 'Verificar Permissões',
        description: 'Confirmar que permissões estão ativas',
        icon: 'bi-check2-square',
        x: 200,
        y: 500,
        expanded: {
          steps: [
            'Reiniciar o navegador após alterar permissões',
            'Testar a validação novamente',
            'Verificar se não há mensagens de permissão negada'
          ]
        },
        connections: ['perm-end']
      },
      {
        id: 'perm-end',
        type: 'end',
        title: 'Permissões Configuradas ✓',
        description: 'Todas as permissões necessárias habilitadas',
        icon: 'bi-check-circle',
        x: 200,
        y: 650,
        connections: []
      }
    ]
  },

  // ======================== TWA ========================
  twa: {
    id: 'twa',
    title: 'TWA - Trusted Web Activity',
    icon: 'bi-phone',
    category: 'technical',
    description: 'Fluxo para problemas com TWA (Android)',
    tags: ['TWA', 'android', 'app', 'navegador'],
    nodes: [
      {
        id: 'twa-start',
        type: 'start',
        title: 'Problema com TWA',
        description: 'Issues com Trusted Web Activity no Android',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['twa-check-1']
      },
      {
        id: 'twa-check-1',
        type: 'question',
        title: 'Está usando TWA ou navegador?',
        description: 'Identificar se está em TWA ou navegador padrão',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['twa-switch', 'twa-check-2'],
        branches: [
          { label: 'TWA', target: 'twa-switch' },
          { label: 'Navegador', target: 'twa-check-2' }
        ]
      },
      {
        id: 'twa-switch',
        type: 'action',
        title: 'Usar Navegador Padrão',
        description: 'TWA pode ter limitações - usar Chrome diretamente',
        icon: 'bi-browser-chrome',
        x: 50,
        y: 350,
        expanded: {
          recommendation: 'TWA (Trusted Web Activity) pode ter limitações de permissões e recursos. Recomendamos usar o Chrome diretamente.',
          steps: [
            'Copiar o link de validação',
            'Abrir Chrome',
            'Colar o link e acessar'
          ]
        },
        connections: ['twa-check-2']
      },
      {
        id: 'twa-check-2',
        type: 'question',
        title: 'Chrome está atualizado?',
        description: 'Verificar versão do Chrome',
        icon: 'bi-question-circle',
        x: 200,
        y: 500,
        connections: ['twa-update', 'twa-end'],
        branches: [
          { label: 'Não', target: 'twa-update' },
          { label: 'Sim', target: 'twa-end' }
        ]
      },
      {
        id: 'twa-update',
        type: 'action',
        title: 'Atualizar Chrome',
        description: 'Instalar versão mais recente',
        icon: 'bi-download',
        x: 350,
        y: 500,
        expanded: {
          steps: [
            'Play Store > Pesquisar Chrome',
            'Clicar em Atualizar',
            'Abrir Chrome após atualização'
          ]
        },
        connections: ['twa-end']
      },
      {
        id: 'twa-end',
        type: 'end',
        title: 'TWA Resolvido ✓',
        description: 'Navegador configurado corretamente',
        icon: 'bi-check-circle',
        x: 200,
        y: 650,
        connections: []
      }
    ]
  },

  // ======================== NAVEGADORES ========================
  navegadores: {
    id: 'navegadores',
    title: 'Navegadores',
    icon: 'bi-browser-chrome',
    category: 'technical',
    description: 'Fluxo para problemas específicos de navegadores',
    tags: ['navegador', 'chrome', 'safari', 'firefox', 'edge'],
    nodes: [
      {
        id: 'nav-start',
        type: 'start',
        title: 'Problema com Navegador',
        description: 'Troubleshooting específico por navegador',
        icon: 'bi-play-circle',
        x: 50,
        y: 50,
        connections: ['nav-check-1']
      },
      {
        id: 'nav-check-1',
        type: 'question',
        title: 'Qual navegador está usando?',
        description: 'Identificar navegador para troubleshooting',
        icon: 'bi-question-circle',
        x: 50,
        y: 200,
        connections: ['nav-chrome', 'nav-safari'],
        branches: [
          { label: 'Chrome', target: 'nav-chrome' },
          { label: 'Safari', target: 'nav-safari' }
        ]
      },
      {
        id: 'nav-chrome',
        type: 'action',
        title: 'Troubleshooting Chrome',
        description: 'Soluções específicas para Chrome',
        icon: 'bi-browser-chrome',
        x: 50,
        y: 350,
        expanded: {
          steps: [
            'Limpar cache: Configurações > Apps > Chrome > Limpar dados > Limpar cache',
            'Limpar cookies: Configurações > Apps > Chrome > Limpar dados > Cookies',
            'Desativar modo economia de dados',
            'Desativar extensões',
            'Testar em aba anônima',
            'Atualizar para versão mais recente'
          ],
          note: 'Chrome é o navegador mais compatível com validação KYC.'
        },
        connections: ['nav-test']
      },
      {
        id: 'nav-safari',
        type: 'action',
        title: 'Troubleshooting Safari',
        description: 'Soluções específicas para Safari (iOS)',
        icon: 'bi-compass',
        x: 350,
        y: 350,
        expanded: {
          steps: [
            'Limpar cache: Ajustes > Safari > Avançado > Dados dos Sites > Remover Todos os Dados',
            'Verificar permissões: Ajustes > Safari > Câmera/Localização',
            'Desativar Bloqueador de Conteúdo',
            'Testar em aba Privada',
            'Atualizar iOS para versão mais recente'
          ],
          note: 'No iOS, todos os navegadores usam WebKit, então Safari é a base.'
        },
        connections: ['nav-test']
      },
      {
        id: 'nav-test',
        type: 'action',
        title: 'Testar Validação',
        description: 'Verificar se o problema foi resolvido',
        icon: 'bi-play-circle',
        x: 200,
        y: 500,
        expanded: {
          steps: [
            'Reiniciar o navegador',
            'Acessar link de validação',
            'Testar todo o fluxo'
          ]
        },
        connections: ['nav-end']
      },
      {
        id: 'nav-end',
        type: 'end',
        title: 'Navegador OK ✓',
        description: 'Navegador configurado corretamente',
        icon: 'bi-check-circle',
        x: 200,
        y: 650,
        connections: []
      }
    ]
  }
};

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

const CATEGORIES = {
  all: { id: 'all', title: 'Todos', icon: 'bi-grid' },
  validation: { id: 'validation', title: 'Validação', icon: 'bi-check2-circle' },
  errors: { id: 'errors', title: 'Erros', icon: 'bi-exclamation-triangle' },
  operations: { id: 'operations', title: 'Operações', icon: 'bi-arrow-repeat' },
  access: { id: 'access', title: 'Acesso', icon: 'bi-box-arrow-in-right' },
  technical: { id: 'technical', title: 'Técnico', icon: 'bi-gear' },
  connectivity: { id: 'connectivity', title: 'Conectividade', icon: 'bi-wifi' }
};

// ============================================================================
// FLOWCHART ENGINE CLASS
// ============================================================================

class FlowchartEngine {
  constructor() {
    this.currentFlow = null;
    this.currentNode = null;
    this.visitedNodes = new Set();
    this.path = [];
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.canvasOffset = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.createContainer();
    this.bindEvents();
    // Don't show theme selection on init - wait for user to click Flowchart button
  }

  createContainer() {
    // Create main container
    this.container = document.createElement('div');
    this.container.className = 'flowchart-container';
    this.container.id = 'flowchart-container';

    this.container.innerHTML = `
      <div class="theme-selection" id="theme-selection">
        <button class="fc-home-btn" id="fc-home-btn" title="Voltar para a página principal">
          <i class="bi bi-house"></i>
        </button>
      </div>
      <div class="flowchart-view" id="flowchart-view" style="display: none;">
        <div class="flowchart-header">
          <div class="flowchart-header-left">
            <button class="flowchart-back-btn" id="fc-back-btn">
              <i class="bi bi-arrow-left"></i>
              <span>Voltar</span>
            </button>
            <h2 class="flowchart-title" id="fc-title">Fluxo</h2>
          </div>
          <div class="flowchart-header-right">
            <div class="flowchart-actions">
              <button class="flowchart-action-btn" id="fc-reset-view" title="Resetar visualização">
                <i class="bi bi-arrows-fullscreen"></i>
              </button>
              <button class="flowchart-action-btn" id="fc-toggle-grid" title="Mostrar grade" class="active">
                <i class="bi bi-grid"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="flowchart-breadcrumbs" id="fc-breadcrumbs">
          <ul class="breadcrumb-list" id="breadcrumb-list"></ul>
        </div>
        <div class="flowchart-canvas" id="fc-canvas">
          <div class="flowchart-canvas-inner" id="fc-canvas-inner">
            <div class="flowchart-grid" id="fc-grid"></div>
            <svg class="flowchart-connections" id="fc-connections"></svg>
            <div class="flowchart-nodes" id="fc-nodes"></div>
          </div>
        </div>
      </div>
      <div class="zoom-controls" id="zoom-controls" style="display: none;">
        <button class="zoom-btn" id="zoom-in" title="Aumentar zoom">+</button>
        <div class="zoom-level" id="zoom-level">100%</div>
        <button class="zoom-btn" id="zoom-out" title="Diminuir zoom">−</button>
        <div class="zoom-separator"></div>
        <button class="zoom-btn" id="zoom-reset" title="Resetar zoom">
          <i class="bi bi-123"></i>
        </button>
      </div>
      <div class="flowchart-side-panel" id="fc-side-panel">
        <div class="side-panel-header">
          <h3 class="side-panel-title" id="side-panel-title">Detalhes</h3>
          <button class="side-panel-close" id="side-panel-close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="side-panel-content" id="side-panel-content"></div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Cache DOM elements
    this.themeSelection = this.container.querySelector('#theme-selection');
    this.flowchartView = this.container.querySelector('#flowchart-view');
    this.canvas = this.container.querySelector('#fc-canvas');
    this.canvasInner = this.container.querySelector('#fc-canvas-inner');
    this.nodesContainer = this.container.querySelector('#fc-nodes');
    this.connectionsSvg = this.container.querySelector('#fc-connections');
    this.grid = this.container.querySelector('#fc-grid');
    this.title = this.container.querySelector('#fc-title');
    this.breadcrumbList = this.container.querySelector('#breadcrumb-list');
    this.sidePanel = this.container.querySelector('#fc-side-panel');
    this.sidePanelTitle = this.container.querySelector('#side-panel-title');
    this.sidePanelContent = this.container.querySelector('#side-panel-content');
    this.zoomControls = this.container.querySelector('#zoom-controls');
    this.zoomLevel = this.container.querySelector('#zoom-level');
    this.miniMap = this.container.querySelector('#mini-map');
  }

  bindEvents() {
    // Back button
    this.container.querySelector('#fc-back-btn').addEventListener('click', () => {
      this.showThemeSelection();
    });

    // Reset view
    this.container.querySelector('#fc-reset-view').addEventListener('click', () => {
      this.resetView();
    });

    // Toggle grid
    this.container.querySelector('#fc-toggle-grid').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      btn.classList.toggle('active');
      this.grid.style.display = btn.classList.contains('active') ? 'block' : 'none';
    });

    // Zoom controls
    this.container.querySelector('#zoom-in').addEventListener('click', () => this.zoom(0.1));
    this.container.querySelector('#zoom-out').addEventListener('click', () => this.zoom(-0.1));
    this.container.querySelector('#zoom-reset').addEventListener('click', () => this.resetView());

    // Side panel close
    this.container.querySelector('#side-panel-close').addEventListener('click', () => {
      this.sidePanel.classList.remove('open');
    });

    // Canvas panning
    this.canvas.addEventListener('mousedown', (e) => this.startPan(e));
    document.addEventListener('mousemove', (e) => this.pan(e));
    document.addEventListener('mouseup', () => this.endPan());

    // Touch panning
    this.canvas.addEventListener('touchstart', (e) => this.startPan(e));
    document.addEventListener('touchmove', (e) => this.pan(e));
    document.addEventListener('touchend', () => this.endPan());

    // Mouse wheel zoom
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      this.zoom(delta);
    });

    // Home button - return to main page
    this.container.querySelector('#fc-home-btn').addEventListener('click', () => {
      this.close();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (!this.container.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        if (this.sidePanel.classList.contains('open')) {
          this.sidePanel.classList.remove('open');
        } else {
          this.showThemeSelection();
        }
      }
    });
  }

  showThemeSelection() {
    if (this.flowchartView) this.flowchartView.style.display = 'none';
    if (this.zoomControls) this.zoomControls.style.display = 'none';
    if (this.miniMap) this.miniMap.style.display = 'none';
    if (this.themeSelection) this.themeSelection.style.display = 'flex';
    if (this.sidePanel) this.sidePanel.classList.remove('open');
    if (this.container) this.container.classList.add('active');

    // Show AI assistant button and modal again when returning to theme selection
    const aiBtn = document.getElementById('ai-assistant-btn');
    const aiModal = document.getElementById('ai-chat-modal');
    const aiOverlay = document.getElementById('ai-chat-overlay');
    if (aiBtn) aiBtn.style.display = 'flex';
    if (aiModal) aiModal.style.display = '';
    if (aiOverlay) aiOverlay.style.display = '';

    // Hide theme toggle button and flowchart button when viewing Central de Conhecimento
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.style.display = 'none';
    const flowchartToggle = document.getElementById('flowchartToggle');
    if (flowchartToggle) flowchartToggle.style.display = 'none';

    this.renderThemeSelection();
  }

  showFlowchart(flowId) {
    const flow = FLOW_DEFINITIONS[flowId];
    if (!flow) return;

    this.currentFlow = flow;
    this.currentNode = null;
    this.visitedNodes.clear();
    this.path = [];
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;

    if (this.themeSelection) this.themeSelection.style.display = 'none';
    if (this.flowchartView) this.flowchartView.style.display = 'flex';
    if (this.zoomControls) this.zoomControls.style.display = 'flex';
    if (this.miniMap) this.miniMap.style.display = 'block';
    if (this.container) this.container.classList.add('active');

    // Hide AI assistant button and modal when flowchart is open
    const aiBtn = document.getElementById('ai-assistant-btn');
    const aiModal = document.getElementById('ai-chat-modal');
    const aiOverlay = document.getElementById('ai-chat-overlay');
    if (aiBtn) aiBtn.style.display = 'none';
    if (aiModal) aiModal.style.display = 'none';
    if (aiOverlay) aiOverlay.style.display = 'none';

    // Hide theme toggle button and flowchart button when viewing flowchart
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.style.display = 'none';
    const flowchartToggle = document.getElementById('flowchartToggle');
    if (flowchartToggle) flowchartToggle.style.display = 'none';

    if (this.title) this.title.textContent = flow.title;
    this.updateBreadcrumb();
    this.renderFlowchart();
    this.updateZoomDisplay();
  }

  renderThemeSelection() {
    const flows = Object.values(FLOW_DEFINITIONS);
    const categories = Object.values(CATEGORIES);

    this.themeSelection.innerHTML = `
      <button class="fc-home-btn" id="fc-home-btn" title="Voltar para a página principal">
        <i class="bi bi-house"></i>
      </button>
      <div class="theme-selection-header">
        <h1 class="theme-selection-title">Central de Conhecimento</h1>
        <p class="theme-selection-subtitle">Selecione um tema para visualizar o fluxograma interativo</p>
      </div>
      
      <div class="theme-search-container">
        <div class="theme-search">
          <i class="bi bi-search"></i>
          <input type="text" id="theme-search-input" placeholder="Buscar fluxos..." autocomplete="off">
        </div>
      </div>

      <div class="theme-filters" id="theme-filters">
        ${categories.map(cat => `
          <button class="theme-filter-btn ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
            <i class="bi ${cat.icon}"></i>
            ${cat.title}
          </button>
        `).join('')}
      </div>

      <div class="theme-cards-container">
        <div class="theme-cards-grid" id="theme-cards-grid"></div>
        <div class="no-themes-found" id="no-themes-found" style="display: none;">
          <div class="no-themes-found-icon">🔍</div>
          <p>Nenhum fluxo encontrado para sua busca.</p>
        </div>
      </div>
    `;

    // Bind search
    this.themeSelection.querySelector('#theme-search-input').addEventListener('input', (e) => {
      this.filterThemes(e.target.value, this.getActiveCategory());
    });

    // Bind filters
    this.themeSelection.querySelectorAll('.theme-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.themeSelection.querySelectorAll('.theme-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterThemes(
          this.themeSelection.querySelector('#theme-search-input').value,
          btn.dataset.category
        );
      });
    });

    // Initial render
    this.renderThemeCards(flows);

    // Re-bind home button event (since innerHTML was replaced)
    this.themeSelection.querySelector('#fc-home-btn').addEventListener('click', () => {
      this.close();
    });
  }

  getActiveCategory() {
    const activeBtn = this.themeSelection?.querySelector('.theme-filter-btn.active');
    return activeBtn?.dataset.category || 'all';
  }

  filterThemes(searchTerm, category) {
    const flows = Object.values(FLOW_DEFINITIONS);
    const term = searchTerm.toLowerCase();

    let filtered = flows.filter(flow => {
      const matchesSearch = !term || 
        flow.title.toLowerCase().includes(term) ||
        flow.description.toLowerCase().includes(term) ||
        flow.tags.some(tag => tag.toLowerCase().includes(term));
      
      const matchesCategory = category === 'all' || flow.category === category;
      
      return matchesSearch && matchesCategory;
    });

    this.renderThemeCards(filtered);

    // Show/hide no results
    const noResults = this.themeSelection.querySelector('#no-themes-found');
    const grid = this.themeSelection.querySelector('#theme-cards-grid');
    
    if (filtered.length === 0) {
      noResults.style.display = 'block';
      grid.style.display = 'none';
    } else {
      noResults.style.display = 'none';
      grid.style.display = 'grid';
    }
  }

  renderThemeCards(flows) {
    const grid = this.themeSelection.querySelector('#theme-cards-grid');
    if (!grid) return;

    grid.innerHTML = flows.map(flow => `
      <div class="theme-card" data-flow="${flow.id}">
        <div class="theme-card-header">
          <div class="theme-card-icon">
            <i class="bi ${flow.icon}"></i>
          </div>
          <div class="theme-card-info">
            <h3 class="theme-card-title">${flow.title}</h3>
            <span class="theme-card-count">${flow.nodes.length} etapas</span>
          </div>
        </div>
        <p class="theme-card-description">${flow.description}</p>
        <div class="theme-card-tags">
          ${flow.tags.slice(0, 4).map(tag => `<span class="theme-card-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Bind click events
    grid.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        this.showFlowchart(card.dataset.flow);
      });
    });
  }

  renderFlowchart() {
    if (!this.currentFlow) return;

    console.log('[Flowchart] renderFlowchart started');

    this.nodesContainer.innerHTML = '';
    this.connectionsSvg.innerHTML = '';

    const nodes = this.currentFlow.nodes;
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Calculate canvas size based on node positions
    let maxX = 0, maxY = 0;
    let minX = Infinity, minY = Infinity;
    nodes.forEach(node => {
      maxX = Math.max(maxX, node.x + 220); // node width
      maxY = Math.max(maxY, node.y + 120); // node height with some padding
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
    });

    // Add padding around the flowchart
    const padding = 80;
    const canvasWidth = maxX - minX + padding * 2;
    const canvasHeight = maxY - minY + padding * 2;

    this.canvasInner.style.width = `${canvasWidth}px`;
    this.canvasInner.style.height = `${canvasHeight}px`;

    console.log(`[Flowchart] Canvas inner size: ${canvasWidth}x${canvasHeight}`);
    console.log(`[Flowchart] Node bounds: minX=${minX}, minY=${minY}, maxX=${maxX}, maxY=${maxY}`);

    // Create nodes with adjusted positions (relative to canvas inner)
    nodes.forEach((node, index) => {
      const nodeEl = this.createNodeElement(node, minX, minY);
      nodeEl.style.animationDelay = `${index * 0.05}s`;
      nodeEl.classList.add('animate-in');
      this.nodesContainer.appendChild(nodeEl);
    });

    // Draw connections
    this.drawConnections(nodes, nodeMap);

    // Center view after DOM has updated
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Debug: log container dimensions
        const canvasRect = this.canvas.getBoundingClientRect();
        console.log('[Flowchart] Canvas rect:', {
          width: canvasRect.width,
          height: canvasRect.height,
          top: canvasRect.top,
          left: canvasRect.left
        });
        console.log('[Flowchart] Canvas computed styles:', {
          position: getComputedStyle(this.canvas).position,
          display: getComputedStyle(this.canvas).display,
          overflow: getComputedStyle(this.canvas).overflow
        });
        
        // Focus on the start of the flowchart (top-left area) instead of centering everything
        this.focusOnFlowStart();
        console.log('[Flowchart] focusOnFlowStart called after DOM update');
      });
    });
  }

  createNodeElement(node, minX = 0, minY = 0) {
    const el = document.createElement('div');
    el.className = `fc-node fc-node--${node.type}`;
    el.id = `node-${node.id}`;
    // Adjust position relative to canvas inner (accounting for padding and min bounds)
    const padding = 80;
    const adjustedX = node.x - minX + padding;
    const adjustedY = node.y - minY + padding;
    el.style.left = `${adjustedX}px`;
    el.style.top = `${adjustedY}px`;
    el.dataset.nodeId = node.id;
    // Store original and adjusted positions for later use
    el.dataset.originalX = node.x;
    el.dataset.originalY = node.y;
    el.dataset.adjustedX = adjustedX;
    el.dataset.adjustedY = adjustedY;

    el.innerHTML = `
      <div class="fc-node-header">
        <div class="fc-node-icon">
          <i class="bi ${node.icon}"></i>
        </div>
        <div class="fc-node-title">${node.title}</div>
      </div>
      <div class="fc-node-body">${node.description}</div>
    `;

    // Click to navigate - always open side panel
    el.addEventListener('click', () => {
      this.selectNode(node);
    });

    return el;
  }

  copyToClipboard(btn) {
    const text = btn.dataset.copy || btn.closest('.fc-node-expand-content')?.querySelector('p')?.textContent;
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = '<i class="bi bi-check2"></i> Copiado!';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<i class="bi bi-clipboard"></i> Copiar mensagem';
        }, 2000);
      });
    }
  }

  drawConnections(nodes, nodeMap) {
    const svg = this.connectionsSvg;

    // Calculate bounds for position adjustment
    let maxX = 0, maxY = 0;
    let minX = Infinity, minY = Infinity;
    nodes.forEach(node => {
      maxX = Math.max(maxX, node.x + 220);
      maxY = Math.max(maxY, node.y + 120);
      minX = Math.min(minX, node.x);
      minY = Math.min(minY, node.y);
    });

    const padding = 80;

    nodes.forEach(node => {
      if (!node.connections || node.connections.length === 0) return;

      // Use adjusted positions (same calculation as createNodeElement)
      const sourceX = node.x - minX + padding + 220; // node width
      const sourceY = node.y - minY + padding + 50; // approximate center

      node.connections.forEach(targetId => {
        const target = nodeMap.get(targetId);
        if (!target) return;

        const targetX = target.x - minX + padding;
        const targetY = target.y - minY + padding + 50;

        // Create curved path
        const midX = sourceX + 40;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const d = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`;
        path.setAttribute('d', d);
        path.setAttribute('data-from', node.id);
        path.setAttribute('data-to', targetId);

        svg.appendChild(path);
      });
    });
  }

  selectNode(node) {
    // Mark as visited
    this.visitedNodes.add(node.id);

    // Update path
    if (this.path.length === 0 || this.path[this.path.length - 1] !== node.id) {
      this.path.push(node.id);
    }

    // Update visual state
    this.nodesContainer.querySelectorAll('.fc-node').forEach(el => {
      el.classList.remove('active');
      if (this.visitedNodes.has(el.dataset.nodeId)) {
        el.classList.add('visited');
      }
    });

    const nodeEl = this.container.querySelector(`#node-${node.id}`);
    if (nodeEl) {
      nodeEl.classList.add('active');
    }

    // Update connections
    this.updateConnections();

    // Update breadcrumb
    this.updateBreadcrumb();

    // Center on node
    this.centerOnNode(node);

    // Show side panel
    this.showNodeDetails(node);

    // Note: Node expansion removed - all details shown in side panel only
  }

  updateConnections() {
    const paths = this.connectionsSvg.querySelectorAll('path');
    paths.forEach(path => {
      const from = path.dataset.from;
      const to = path.dataset.to;
      
      if (this.visitedNodes.has(from) && this.visitedNodes.has(to)) {
        path.classList.add('traversed');
      } else if (this.currentNode?.id === from) {
        path.classList.add('active');
      } else {
        path.classList.remove('active', 'traversed');
      }
    });
  }

  updateBreadcrumb() {
    if (!this.currentFlow) return;

    const flowTitle = this.currentFlow.title;
    
    let html = `
      <li class="breadcrumb-item">
        <button class="breadcrumb-link" data-node="root">${flowTitle}</button>
      </li>
    `;

    this.path.forEach((nodeId, index) => {
      const node = this.currentFlow.nodes.find(n => n.id === nodeId);
      if (!node) return;

      const isLast = index === this.path.length - 1;
      html += `
        <li class="breadcrumb-item">
          <button class="breadcrumb-link ${isLast ? 'current' : ''}" data-node="${nodeId}">
            ${node.title}
          </button>
        </li>
      `;
    });

    this.breadcrumbList.innerHTML = html;

    // Bind click events
    this.breadcrumbList.querySelectorAll('.breadcrumb-link').forEach(link => {
      link.addEventListener('click', () => {
        const nodeId = link.dataset.node;
        if (nodeId === 'root') {
          // Reset to start
          this.visitedNodes.clear();
          this.path = [];
          this.nodesContainer.querySelectorAll('.fc-node').forEach(el => {
            el.classList.remove('active', 'visited');
          });
          this.connectionsSvg.querySelectorAll('path').forEach(p => {
            p.classList.remove('active', 'traversed');
          });
        } else {
          const node = this.currentFlow.nodes.find(n => n.id === nodeId);
          if (node) {
            this.selectNode(node);
          }
        }
      });
    });
  }

  showNodeDetails(node) {
    this.currentNode = node;
    this.sidePanelTitle.textContent = node.title;
    
    let content = '';

    // Description
    content += `
      <div class="side-panel-section">
        <h4 class="side-panel-section-title">Descrição</h4>
        <div class="side-panel-section-content">
          <p>${node.description}</p>
        </div>
      </div>
    `;

    // Type info
    const typeLabels = {
      start: '🟢 Início',
      question: '❓ Decisão',
      action: '⚡ Ação',
      decision: '⚠️ Decisão Técnica',
      info: 'ℹ️ Informação',
      end: '✅ Conclusão'
    };

    content += `
      <div class="side-panel-section">
        <h4 class="side-panel-section-title">Tipo de Nó</h4>
        <div class="side-panel-section-content">
          <p>${typeLabels[node.type] || node.type}</p>
        </div>
      </div>
    `;

    // Expanded content
    if (node.expanded) {
      if (node.expanded.troubleshooting) {
        content += `
          <div class="side-panel-section">
            <h4 class="side-panel-section-title">🔧 Troubleshooting</h4>
            <div class="side-panel-section-content">
              <ul>${node.expanded.troubleshooting.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          </div>
        `;
      }

      if (node.expanded.customerMessage) {
        content += `
          <div class="side-panel-section">
            <h4 class="side-panel-section-title">💬 Mensagem para o Cliente</h4>
            <div class="side-panel-section-content">
              <p style="font-style: italic; padding: 12px; background: var(--fc-bg-node); border-radius: 8px;">
                "${node.expanded.customerMessage}"
              </p>
              <button class="copy-btn" data-copy="${node.expanded.customerMessage.replace(/"/g, '"')}" style="margin-top: 8px;">
                <i class="bi bi-clipboard"></i> Copiar
              </button>
            </div>
          </div>
        `;
      }

      if (node.expanded.steps || node.expanded.androidSteps || node.expanded.iosSteps) {
        content += `
          <div class="side-panel-section">
            <h4 class="side-panel-section-title">📝 Procedimentos</h4>
            <div class="side-panel-section-content">
        `;
        if (node.expanded.steps) {
          content += `<ol>${node.expanded.steps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        }
        if (node.expanded.androidSteps) {
          content += `<h5 style="margin: 12px 0 6px; font-size: 13px;">Android:</h5>`;
          content += `<ol>${node.expanded.androidSteps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        }
        if (node.expanded.iosSteps) {
          content += `<h5 style="margin: 12px 0 6px; font-size: 13px;">iOS:</h5>`;
          content += `<ol>${node.expanded.iosSteps.map(s => `<li>${s}</li>`).join('')}</ol>`;
        }
        content += `</div></div>`;
      }

      if (node.expanded.causes) {
        content += `
          <div class="side-panel-section">
            <h4 class="side-panel-section-title">⚠️ Causas Possíveis</h4>
            <div class="side-panel-section-content">
              <ul>${node.expanded.causes.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          </div>
        `;
      }

      if (node.expanded.evidence) {
        content += `
          <div class="side-panel-section">
            <h4 class="side-panel-section-title">📸 Evidências para Coletar</h4>
            <div class="side-panel-section-content">
              <ul>${node.expanded.evidence.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          </div>
        `;
      }
    }

    // Connections info
    if (node.connections && node.connections.length > 0) {
      const targetNodes = node.connections.map(id => {
        const n = this.currentFlow.nodes.find(n => n.id === id);
        return n ? n.title : id;
      });

      content += `
        <div class="side-panel-section">
          <h4 class="side-panel-section-title">🔗 Próximos Passos</h4>
          <div class="side-panel-section-content">
            <ul>${targetNodes.map(t => `<li>${t}</li>`).join('')}</ul>
          </div>
        </div>
      `;
    }

    this.sidePanelContent.innerHTML = content;

    // Bind copy button
    this.sidePanelContent.querySelector('.copy-btn')?.addEventListener('click', (e) => {
      this.copyToClipboard(e.target.closest('.copy-btn'));
    });

    this.sidePanel.classList.add('open');
  }

  // Pan and zoom
  startPan(e) {
    if (e.target.closest('.fc-node') || e.target.closest('.fc-node-action-btn')) return;
    
    this.isDragging = true;
    this.dragStart = {
      x: e.clientX || e.touches?.[0]?.clientX || 0,
      y: e.clientY || e.touches?.[0]?.clientY || 0
    };
    this.canvas.style.cursor = 'grabbing';
  }

  pan(e) {
    if (!this.isDragging) return;

    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

    const dx = clientX - this.dragStart.x;
    const dy = clientY - this.dragStart.y;

    this.panX += dx;
    this.panY += dy;

    this.dragStart = { x: clientX, y: clientY };

    this.applyTransform();
  }

  endPan() {
    this.isDragging = false;
    this.canvas.style.cursor = 'grab';
  }

  zoom(delta) {
    const newScale = Math.max(0.3, Math.min(2, this.scale + delta));
    this.scale = newScale;
    this.applyTransform();
    this.updateZoomDisplay();
  }

  applyTransform() {
    this.canvasInner.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
  }

  updateZoomDisplay() {
    this.zoomLevel.textContent = `${Math.round(this.scale * 100)}%`;
  }

  resetView() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
    this.updateZoomDisplay();
    this.centerView();
  }

  centerView() {
    const canvasRect = this.canvas.getBoundingClientRect();
    const innerWidth = parseFloat(this.canvasInner.style.width) || 800;
    const innerHeight = parseFloat(this.canvasInner.style.height) || 600;

    this.panX = (canvasRect.width - innerWidth * this.scale) / 2;
    this.panY = (canvasRect.height - innerHeight * this.scale) / 2;

    this.applyTransform();
  }

  centerOnNode(node) {
    const canvasRect = this.canvas.getBoundingClientRect();
    
    // Calculate bounds for position adjustment (same as renderFlowchart)
    let maxX = 0, maxY = 0;
    let minX = Infinity, minY = Infinity;
    this.currentFlow.nodes.forEach(n => {
      maxX = Math.max(maxX, n.x + 220);
      maxY = Math.max(maxY, n.y + 120);
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
    });

    const padding = 80;
    // Use adjusted position (same calculation as createNodeElement)
    const adjustedX = node.x - minX + padding;
    const adjustedY = node.y - minY + padding;
    
    // Center on the adjusted node position (node width = 220, so center at +110)
    this.panX = canvasRect.width / 2 - (adjustedX + 110) * this.scale;
    this.panY = canvasRect.height / 2 - (adjustedY + 50) * this.scale;

    this.applyTransform();
  }

  /**
   * Fit the entire flowchart within the viewport
   * This ensures all nodes are visible when the flowchart loads
   */
  fitView() {
    const canvasRect = this.canvas.getBoundingClientRect();
    
    if (!this.currentFlow || !this.currentFlow.nodes.length) {
      this.centerView();
      return;
    }

    // Calculate bounds of all nodes
    let maxX = 0, maxY = 0;
    let minX = Infinity, minY = Infinity;
    this.currentFlow.nodes.forEach(n => {
      maxX = Math.max(maxX, n.x + 220);
      maxY = Math.max(maxY, n.y + 120);
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
    });

    const padding = 80;
    const flowWidth = maxX - minX + padding * 2;
    const flowHeight = maxY - minY + padding * 2;

    // Account for UI elements that reduce visible canvas area
    // Header (~60px) + Breadcrumbs (~45px) = ~105px total
    const uiOffsetTop = 110;
    const uiOffsetBottom = 20;
    const uiOffsetLeft = 20;
    const uiOffsetRight = 20;

    const availableWidth = canvasRect.width - uiOffsetLeft - uiOffsetRight;
    const availableHeight = canvasRect.height - uiOffsetTop - uiOffsetBottom;

    // Calculate the scale needed to fit the flowchart
    const scaleX = availableWidth / flowWidth;
    const scaleY = availableHeight / flowHeight;
    
    // Use the smaller scale, but don't zoom in more than 1.0 (no upscaling)
    // and don't zoom out less than 0.3
    let targetScale = Math.min(scaleX, scaleY, 1.0);
    targetScale = Math.max(0.3, targetScale);

    this.scale = targetScale;

    // Calculate the center of the flow in adjusted coordinates
    const flowCenterX = (minX + maxX) / 2;
    const flowCenterY = (minY + maxY) / 2;
    
    // Adjusted position (relative to canvas inner)
    const adjustedCenterX = flowCenterX - minX + padding;
    const adjustedCenterY = flowCenterY - minY + padding;

    // Calculate pan to center the flowchart in the available area
    // Offset the Y position to show more of the top (start) of the flow
    const verticalOffset = -50; // Shift up slightly to show more of the beginning
    
    this.panX = availableWidth / 2 + uiOffsetLeft - adjustedCenterX * this.scale;
    this.panY = availableHeight / 2 + uiOffsetTop + verticalOffset - adjustedCenterY * this.scale;

    // Ensure we're not showing too much empty space at the top
    // If the first node would be above the visible area, adjust
    const firstNodeAdjustedY = minY - minY + padding;
    const firstNodeScreenY = firstNodeAdjustedY * this.scale + this.panY;
    if (firstNodeScreenY < uiOffsetTop) {
      this.panY += uiOffsetTop - firstNodeScreenY + 20;
    }

    this.applyTransform();
    this.updateZoomDisplay();
    this.updateMiniMap();

    console.log(`[Flowchart] fitView: scale=${this.scale.toFixed(2)}, pan=(${this.panX.toFixed(0)}, ${this.panY.toFixed(0)})`);
    console.log(`[Flowchart] fitView: flow=${flowWidth.toFixed(0)}x${flowHeight.toFixed(0)}, available=${availableWidth.toFixed(0)}x${availableHeight.toFixed(0)}`);
  }

  /**
   * Focus on the start of the flowchart (top-left area)
   * This ensures the first nodes are visible when the flowchart loads
   */
  focusOnFlowStart() {
    // Use fitView for better overall framing
    this.fitView();
  }

  /**
   * Update the minimap to reflect current viewport
   */
  updateMiniMap() {
    if (!this.miniMap || !this.currentFlow) return;

    const canvasRect = this.canvas.getBoundingClientRect();
    const innerWidth = parseFloat(this.canvasInner.style.width) || 800;
    const innerHeight = parseFloat(this.canvasInner.style.height) || 600;
    
    const mapWidth = 180;
    const mapHeight = 120;
    const scaleX = mapWidth / innerWidth;
    const scaleY = mapHeight / innerHeight;

    // Calculate viewport rectangle on minimap
    const viewportX = Math.max(0, -this.panX / this.scale * scaleX);
    const viewportY = Math.max(0, -this.panY / this.scale * scaleY);
    const viewportW = Math.min(mapWidth, canvasRect.width / this.scale * scaleX);
    const viewportH = Math.min(mapHeight, canvasRect.height / this.scale * scaleY);

    this.miniMap.innerHTML = `
      <svg width="${mapWidth}" height="${mapHeight}" style="background: var(--fc-bg-node);">
        <!-- Draw simplified flowchart overview -->
        ${this.currentFlow.nodes.map(node => {
          const nx = (node.x + 80) * scaleX;
          const ny = (node.y + 80) * scaleY;
          const nw = 220 * scaleX;
          const nh = 40 * scaleY;
          const color = node.type === 'start' ? 'var(--fc-node-start)' : 
                       node.type === 'end' ? 'var(--fc-node-end)' : 'var(--fc-border)';
          return `<rect x="${nx}" y="${ny}" width="${Math.max(nw, 4)}" height="${Math.max(nh, 3)}" fill="${color}" rx="2"/>`;
        }).join('')}
        <!-- Viewport indicator -->
        <rect x="${viewportX}" y="${viewportY}" width="${viewportW}" height="${viewportH}" 
              fill="var(--fc-accent-light)" stroke="var(--fc-accent)" stroke-width="1.5" rx="2"/>
      </svg>
    `;
  }

  // Public API
  open() {
    this.container.classList.add('active');
    this.showThemeSelection();
  }

  close() {
    this.container.classList.remove('active');
    
    // Show theme toggle button and flowchart button when closing flowchart
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.style.display = '';
    const flowchartToggle = document.getElementById('flowchartToggle');
    if (flowchartToggle) flowchartToggle.style.display = '';
  }

  toggle() {
    if (this.container.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

let flowchartEngine = null;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for theme to be set
  setTimeout(() => {
    flowchartEngine = new FlowchartEngine();
  }, 100);
});

// Export for external access
window.FlowchartEngine = FlowchartEngine;
window.getFlowchartEngine = () => flowchartEngine;