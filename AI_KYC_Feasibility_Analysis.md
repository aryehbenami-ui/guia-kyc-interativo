# Análise de Viabilidade Técnica: Sistema de IA Contextual para Apoio Operacional KYC

## 1. Visão Geral do Projeto Atual

### Estrutura Existente
O projeto "Guia KYC" é uma aplicação web estática com:
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Hospedagem**: Compatível com Netlify (estático)
- **Conteúdo**: 10 seções de troubleshooting KYC bem estruturadas
- **Funcionalidades**: Tabs Android/iOS, collapsible sections, copy-to-clipboard

### Conteúdo KYC Disponível
O guia contém procedimentos para:
1. Permissão da Câmera
2. Compartilhamento de Localização
3. Face Match com baixa similaridade
4. Erro na Câmera no Envio da Selfie
5. Documento Ilegível / Falha no OCR
6. Liveness Falhou / Rosto Não Detectado
7. Loading em Loop ao Iniciar o Liveness
8. Tela Preta sem Renderização
9. Falha de Conexão ao Iniciar a Validação
10. Reprovação Interna na Jornada KYC
11. Validação aprovada, mas sem ação seguinte

---

## 2. Viabilidade da API DeepSeek

### 2.1 Custo-Benefício Atual

| Modelo | Preço (input) | Preço (output) | Context Window |
|--------|---------------|----------------|----------------|
| DeepSeek-V3 | $0.14/1M tokens | $0.28/1M tokens | 128K tokens |
| DeepSeek-Coder | $0.14/1M tokens | $0.28/1M tokens | 128K tokens |

**Comparativo com concorrentes:**
- GPT-4 Turbo: $10/1M input, $30/1M output
- Claude 3.5 Sonnet: $3/1M input, $15/1M output
- Gemini 1.5 Pro: $3.50/1M input, $10.50/1M output

**✅ DeepSeek é ~20-70x mais barato que alternativas**

### 2.2 Qualidade para Suporte Operacional KYC

**Pontos fortes:**
- Excelente em raciocínio lógico e troubleshooting
- Bom suporte a português (treinado em múltiplos idiomas)
- Context window de 128K permite incluir todo o guia KYC
- Performance comparável a GPT-4 em benchmarks de raciocínio

**Limitações:**
- Menos conhecido em produção corporativa (risco percebido)
- Suporte empresarial menos estabelecido que OpenAI/Anthropic
- Possíveis restrições de compliance para dados financeiros

### 2.3 Latência e Estabilidade

- **Latência média**: 500ms - 2s para respostas
- **Rate limits**: 100 requests/minute (plano gratuito), personalizável
- **Uptime**: ~99.5% (dados públicos)
- **API madura**: SDKs disponíveis para Python, Node.js, etc.

### 2.4 Riscos e Considerações

| Risco | Nível | Mitigação |
|-------|-------|-----------|
| Dados sensíveis enviados para API externa | Médio | Anonimizar dados, não enviar PII |
| Dependência de fornecedor chinês | Médio | Ter fallback para outra API |
| Alucinações/respostas incorretas | Baixo-Médio | Prompt engineering, validação de saída |
| Mudanças na API/preços | Baixo | Contrato empresarial, monitoramento |

### 2.5 Veredict DeepSeek

**✅ VIÁVEL** - Excelente custo-benefício para MVP e produção inicial. Recomenda-se:
- Começar com DeepSeek-V3
- Implementar fallback para OpenAI/Anthropic se necessário
- Estabelecer políticas claras de uso de dados

---

## 3. Viabilidade com Netlify

### 3.1 Hospedagem Frontend

**✅ Totalmente viável** - O projeto atual já é estático e compatível.

### 3.2 Netlify Functions (Backend Serverless)

**Capacidades:**
- Funções serverless Node.js/Go
- 125K requests/mês no plano gratuito
- Timeout máximo: 10 segundos (Hobby), 60 segundos (Pro)
- Integração nativa com API DeepSeek

**Limitações:**
- Timeout de 10s pode ser insuficiente para chamadas API + processamento
- Memória limitada (1024MB no free, 3008MB no Pro)

### 3.3 Arquitetura Recomendada para Netlify

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Netlify Function    │────▶│   DeepSeek API  │
│   (index.html)  │◀────│  (/api/ai-assistant) │◀────│                 │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌──────────────────────┐
                       │   KYC Knowledge Base │
                       │   (JSON/Markdown)    │
                       └──────────────────────┘
```

### 3.4 Segurança da API Key

**✅ Seguro com Netlify Functions:**
```javascript
// netlify/functions/ai-assistant.js
const DEEPSEEK_API_KEY = process.env.DEESEEK_API_KEY; // Environment variable

exports.handler = async (event) => {
  // API key nunca exposta no frontend
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` }
  });
  // ...
};
```

### 3.5 Configuração CORS

Netlify Functions gerencia CORS automaticamente:
```javascript
exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Ou domínio específico
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST'
    },
    body: JSON.stringify(response)
  };
};
```

### 3.6 Veredict Netlify

**✅ VIÁVEL** - Netlify Functions é adequado para MVP. Para produção em escala:
- Considerar upgrade para plano Pro (timeout 60s)
- Ou migrar para AWS Lambda/Cloudflare Workers se necessário

---

## 4. Arquitetura Recomendada

### 4.1 Estrutura de Arquivos Sugerida

```
guia-kyc-ai/
├── index.html                    # Guia KYC existente
├── assets/
│   ├── css/
│   │   └── ai-assistant.css      # Estilos do chat IA
│   └── js/
│       ├── ios.js                # Scripts existentes
│       └── ai-assistant.js       # Novo: integração IA
├── netlify/
│   └── functions/
│       ├── ai-assistant.js       # Endpoint principal IA
│       └── search-kyc.js         # Busca na base KYC
├── knowledge-base/
│   ├── kyc-articles.json         # Artigos indexados
│   ├── procedures.json           # Procedimentos
│   └── embeddings/               # (Fase 2: vetores)
├── .env                          # Variáveis de ambiente
├── netlify.toml                  # Configuração Netlify
└── package.json                  # Dependências
```

### 4.2 Fluxo de Integração

```
1. Analista clica "Consultar IA"
2. Modal/chat abre no canto da tela
3. Analista descreve situação
4. Frontend envia para /api/ai-assistant
5. Netlify Function:
   a. Busca artigos KYC relevantes
   b. Monta prompt contextualizado
   c. Chama DeepSeek API
   d. Retorna resposta formatada
6. Resposta exibida no chat
```

---

## 5. Abordagens de Contextualização

### 5.1 Comparativo de Abordagens

| Abordagem | Complexidade | Custo | Qualidade | Recomendado |
|-----------|--------------|-------|-----------|-------------|
| Prompt Engineering simples | Baixa | $ | Boa | **MVP (Fase 1)** |
| Contexto manual (seleção) | Baixa | $ | Média | MVP |
| Busca por palavras-chave | Média | $ | Boa | Fase 1.5 |
| Embeddings + Similaridade | Alta | $$ | Excelente | Fase 2 |
| RAG completo | Alta | $$$ | Excelente | Fase 3 |
| Fine-tuning | Muito Alta | $$$$ | Variável | Não recomendado |

### 5.2 MVP Recomendado (Fase 1): Prompt Engineering + Contexto Manual

**Vantagens:**
- Implementação em horas, não semanas
- Custo mínimo
- Fácil manutenção
- Sem dependência de ML/vecotores

**Implementação:**
```javascript
// Prompt system para DeepSeek
const systemPrompt = `
Você é um assistente especializado em procedimentos KYC.
Sua função é ajudar analistas a resolver problemas operacionais.

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
`;
```

### 5.3 Fase 2: Embeddings + Busca Semântica

**Quando implementar:**
- Após validação do MVP
- Quando a base de conhecimento crescer (>50 artigos)
- Quando precisar de buscas mais precisas

**Stack recomendada:**
- OpenAI embeddings ou HuggingFace (gratuito)
- Pinecone ou Supabase pgvector para busca vetorial
- Ou solução simples com similarity search em JSON

### 5.4 Veredict Contextualização

**✅ Começar com Prompt Engineering simples**
- Inclua todo o conteúdo KYC no prompt (cabe no context window de 128K)
- Use system prompt bem estruturado
- Adicione instruções de citação de fontes

---

## 6. Roadmap de Implementação

### Fase 1: MVP (1-2 semanas)
```
[ ] Configurar Netlify Functions
[ ] Criar endpoint /api/ai-assistant
[ ] Implementar prompt engineering com contexto KYC
[ ] Criar UI do chat/modal "Consultar IA"
[ ] Integração frontend-backend
[ ] Testes com analistas
```

### Fase 2: Melhoria de Busca (2-4 semanas)
```
[ ] Indexar artigos KYC em JSON estruturado
[ ] Implementar busca por palavras-chave
[ ] Adicionar sugestões de artigos relacionados
[ ] Melhorar formatação de respostas
```

### Fase 3: RAG Básico (4-8 semanas)
```
[ ] Implementar embeddings para artigos
[ ] Busca semântica por similaridade
[ ] Sistema de feedback das respostas
[ ] Analytics de uso
```

### Fase 4: Produção (8+ semanas)
```
[ ] Autenticação de usuários
[ ] Logs e auditoria
[ ] Dashboard de métricas
[ ] Integração com sistemas internos
```

---

## 7. Armazenamento do Conhecimento KYC

### 7.1 Estrutura JSON Recomendada

```json
{
  "articles": [
    {
      "id": "camera-permission",
      "title": "Permissão da Câmera",
      "icon": "bi-camera",
      "category": "troubleshooting",
      "tags": ["câmera", "permissão", "android", "ios", "acesso"],
      "content": {
        "intro": "Problemas relacionados ao acesso à câmera.",
        "identification": ["Tela fica preta ou não carrega", ...],
        "android_steps": [...],
        "ios_steps": [...],
        "notes": "No iOS, todos os navegadores utilizam o WebKit...",
        "escalation": "Caso o erro persista..."
      }
    },
    // ... mais artigos
  ]
}
```

### 7.2 Veredict Armazenamento

**✅ JSON estruturado para MVP**
- Fácil de manter
- Pode ser versionado no Git
- Simples de converter para embeddings depois
- Compatível com qualquer backend

---

## 8. Controle de Qualidade das Respostas

### 8.1 Estratégias Anti-Alucinação

```javascript
// System prompt reforçado
const systemPrompt = `
IMPORTANTE: Você DEVE seguir estas regras:

1. BASE DE CONHECIMENTO LIMITADA:
   - Responda APENAS com base nos artigos KYC fornecidos
   - Se a informação não estiver nos artigos, diga claramente
   - Nunca invente procedimentos, thresholds ou regras

2. CITAÇÃO OBRIGATÓRIA:
   - Sempre cite qual artigo/seção está usando
   - Exemplo: "Conforme o artigo 'Permissão da Câmera'..."

3. LIMITES CLAROS:
   - Se não tiver certeza, recomende escalation
   - Não dê informações sobre casos específicos de usuários
   - Mantenha foco em troubleshooting operacional

4. FORMATO PADRÃO:
   - Problema identificado: [descrição]
   - Passos recomendados: [lista numerada]
   - Artigo de referência: [nome do artigo]
   - Quando escalar: [condições]
`;
```

### 8.2 Parâmetros da API DeepSeek

```javascript
const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery }
    ],
    temperature: 0.3,        // Baixa para consistência
    max_tokens: 1024,        // Limite razoável
    top_p: 0.9,
    frequency_penalty: 0.1,  // Reduz repetição
    presence_penalty: 0.1
  })
});
```

### 8.3 Fallback para "Não Sei"

```javascript
// Se a resposta não citar artigos ou parecer genérica
if (!response.includes('artigo') && !response.includes('seção')) {
  return "Não encontrei informações específicas nos procedimentos KYC sobre este caso. Recomendo consultar um supervisor ou escalar para a equipe técnica.";
}
```

---

## 9. UI/UX Recomendada

### 9.1 Componente "Consultar IA"

```html
<!-- Botão flutuante -->
<button id="ai-assistant-btn" class="ai-btn">
  <i class="bi bi-robot"></i>
  <span>Consultar IA</span>
</button>

<!-- Modal/Chat lateral -->
<div id="ai-chat-modal" class="ai-modal">
  <div class="ai-modal-header">
    <h3>Assistente KYC</h3>
    <button class="close-btn">&times;</button>
  </div>
  <div class="ai-chat-messages">
    <!-- Mensagens aqui -->
  </div>
  <div class="ai-chat-input">
    <textarea placeholder="Descreva a situação do usuário..."></textarea>
    <button>Enviar</button>
  </div>
</div>
```

### 9.2 Features de UX

- **Sugestões rápidas**: "Câmera não abre", "Liveness falhou", "Documento não lê"
- **Links para artigos**: Clique para abrir seção relevante do guia
- **Copy resposta**: Botão para copiar orientação
- **Feedback**: 👍/👎 para qualidade da resposta
- **Loading indicator**: Mostrando "Consultando procedimentos KYC..."

---

## 10. Segurança e Compliance

### 10.1 Proteção de Dados

**✅ Boas práticas:**
- Nunca enviar dados pessoais (nome, CPF, email) para a IA
- Anonimizar casos antes de enviar
- Exemplo: Em vez de "Usuário João Silva, CPF 123...", usar "Usuário relatou..."

### 10.2 LGPD Considerations

| Requisito | Implementação |
|-----------|---------------|
| Minimização de dados | Enviar apenas contexto operacional |
| Finalidade definida | Apenas suporte a analistas |
| Segurança | API keys em environment variables |
| Retenção | Não armazenar prompts/respostas (ou anonimizar) |
| Transparência | Informar que é IA, não humano |

### 10.3 Logs e Auditoria

```javascript
// Log mínimo necessário (opcional)
const auditLog = {
  timestamp: new Date().toISOString(),
  analystId: 'anon-' + Math.random().toString(36).substr(2, 9),
  query: 'câmera não abre', // Sem dados sensíveis
  responseTime: 1234,
  articlesReferenced: ['camera-permission']
};
```

---

## 11. Métricas de Impacto

### 11.1 KPIs Recomendados

| Métrica | Como medir | Meta |
|---------|------------|------|
| Redução de TMA | Tempo médio de atendimento antes/depois | -20% |
| Redução de escalonamentos | % de casos escalados | -30% |
| Consistência | Variação de respostas entre analistas | -50% |
| Satisfação analistas | Survey NPS interno | >7 |
| Precisão IA | % de respostas úteis (feedback 👍) | >85% |

### 11.2 Coleta de Métricas

```javascript
// No frontend
const metrics = {
  queryId: uuid(),
  timestamp: Date.now(),
  helpful: null, // null, true, false
  timeToResolve: null,
  escalated: false
};
```

---

## 12. Custos Estimados

### 12.1 MVP (Fase 1)

| Item | Custo Mensal |
|------|--------------|
| DeepSeek API (1000 consultas/dia) | ~$15-30 |
| Netlify (Hobby) | $0 |
| Domínio (se necessário) | $10/ano |
| **Total** | **~$30/mês** |

### 12.2 Produção (Fase 3+)

| Item | Custo Mensal |
|------|--------------|
| DeepSeek API (5000 consultas/dia) | ~$75-150 |
| Netlify Pro | $19 |
| Vector DB (Supabase) | $25 |
| **Total** | **~$120-200/mês** |

---

## 13. Conclusão e Recomendações

### ✅ VIABILIDADE: **ALTA**

O projeto é **totalmente viável** tecnicamente e financeiramente.

### 🎯 Recomendação Principal

**Comece com MVP simples (Fase 1):**
1. Prompt engineering com todo conteúdo KYC no context
2. Netlify Functions para esconder API key
3. UI simples de chat/modal
4. Foco em 3-5 cenários principais primeiro

### 📋 Próximos Passos Imediatos

1. **Criar conta na DeepSeek** e obter API key
2. **Configurar Netlify Functions** no projeto
3. **Extrair conteúdo KYC** para JSON estruturado
4. **Implementar endpoint** `/api/ai-assistant`
5. **Criar UI do chat** no index.html
6. **Testar com 2-3 analistas** e coletar feedback

### ⚠️ Riscos a Monitorar

1. **Qualidade das respostas** - Implementar feedback loop
2. **Dependência de fornecedor** - Ter fallback para OpenAI
3. **Compliance** - Revisar com equipe jurídica
4. **Custo em escala** - Monitorar uso da API

### 🚀 Timeline Realista

- **MVP funcional**: 1-2 semanas
- **Piloto com analistas**: 2-3 semanas
- **Produção inicial**: 4-6 semanas
- **RAG avançado**: 8-12 semanas

---

## 14. Código de Exemplo para MVP

### 14.1 Netlify Function (`netlify/functions/ai-assistant.js`)

```javascript
const DEEPSEEK_API_KEY = process.env.DEESEEK_API_KEY;

// Base de conhecimento KYC (pode ser carregada de arquivo JSON)
const kycKnowledgeBase = `
ARTIGO: Permissão da Câmera
- Problema: Tela fica preta ou não carrega
- Android: Configurações > Apps > Chrome > Permissões > Câmera > Permitir
- iOS: Ajustes > Safari > Câmera > Permitir
- Observação: No iOS, todos navegadores usam WebKit

ARTIGO: Liveness Falhou
- Problema: Rosto não detectado
- Solução: Local bem iluminado, remover acessórios, centralizar rosto
- Escalar se persistir após 3 tentativas

[... resto dos artigos ...]
`;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { query } = JSON.parse(event.body);

  const systemPrompt = `
Você é um assistente especializado em procedimentos KYC.
Baseie suas respostas APENAS nos artigos fornecidos abaixo.
Sempre cite o artigo de referência.
Se não encontrar informação, diga claramente.

CONTEÚDO KYC DISPONÍVEL:
${kycKnowledgeBase}
  `;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.3,
        max_tokens: 1024
      })
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ response: aiResponse })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao consultar IA' })
    };
  }
};
```

### 14.2 Frontend (`assets/js/ai-assistant.js`)

```javascript
class KYCAIAssistant {
  constructor() {
    this.modal = null;
    this.messages = [];
    this.init();
  }

  init() {
    this.createButton();
    this.createModal();
    this.bindEvents();
  }

  createButton() {
    const btn = document.createElement('button');
    btn.id = 'ai-assistant-btn';
    btn.className = 'ai-btn';
    btn.innerHTML = '<i class="bi bi-robot"></i><span>Consultar IA</span>';
    document.body.appendChild(btn);
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'ai-chat-modal';
    modal.className = 'ai-modal';
    modal.innerHTML = `
      <div class="ai-modal-header">
        <h3><i class="bi bi-robot"></i> Assistente KYC</h3>
        <button class="close-btn">&times;</button>
      </div>
      <div class="ai-chat-messages"></div>
      <div class="ai-chat-input">
        <textarea placeholder="Descreva a situação do usuário..."></textarea>
        <button class="send-btn"><i class="bi bi-send"></i></button>
      </div>
    `;
    document.body.appendChild(modal);
    this.modal = modal;
  }

  bindEvents() {
    document.getElementById('ai-assistant-btn').addEventListener('click', () => {
      this.modal.classList.toggle('open');
    });

    this.modal.querySelector('.close-btn').addEventListener('click', () => {
      this.modal.classList.remove('open');
    });

    this.modal.querySelector('.send-btn').addEventListener('click', () => {
      this.sendMessage();
    });

    this.modal.querySelector('textarea').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  async sendMessage() {
    const textarea = this.modal.querySelector('textarea');
    const query = textarea.value.trim();
    if (!query) return;

    // Adicionar mensagem do usuário
    this.addMessage('user', query);
    textarea.value = '';

    // Mostrar loading
    const loadingId = this.addMessage('loading', 'Consultando procedimentos KYC...');

    try {
      const response = await fetch('/.netlify/functions/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      
      // Remover loading e adicionar resposta
      this.removeMessage(loadingId);
      this.addMessage('assistant', data.response);
    } catch (error) {
      this.removeMessage(loadingId);
      this.addMessage('error', 'Erro ao consultar IA. Tente novamente.');
    }
  }

  addMessage(type, content) {
    const messagesContainer = this.modal.querySelector('.ai-chat-messages');
    const id = 'msg-' + Date.now();
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.id = id;
    div.innerHTML = `
      <div class="message-content">${this.formatResponse(content)}</div>
    `;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return id;
  }

  removeMessage(id) {
    const msg = document.getElementById(id);
    if (msg) msg.remove();
  }

  formatResponse(text) {
    // Formatar quebras de linha e negritos
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new KYCAIAssistant();
});
```

### 14.3 CSS (`assets/css/ai-assistant.css`)

```css
.ai-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 24px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  transition: transform 0.2s;
}

.ai-btn:hover {
  transform: scale(1.05);
}

.ai-modal {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 380px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transform: translateY(20px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s;
}

.ai-modal.open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: all;
}

.ai-modal-header {
  padding: 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.ai-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.message {
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.message-user {
  background: #0066cc;
  color: white;
  margin-left: 40px;
}

.message-assistant {
  background: #f5f5f5;
  margin-right: 40px;
}

.message-loading {
  background: #f0f0f0;
  color: #666;
  font-style: italic;
}

.ai-chat-input {
  padding: 12px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
}

.ai-chat-input textarea {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  resize: none;
  height: 40px;
  font-family: inherit;
}

.send-btn {
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 16px;
  cursor: pointer;
}
```

---

**Documento criado para análise completa de viabilidade técnica.**