/**
 * Netlify Function - AI Assistant para Guia KYC
 * 
 * INTEGRAÇÃO COM DEEPSEEK API + BASE DE CONHECIMENTO TÉCNICO
 * 
 * Funcionalidades:
 * 1. Responde baseado no guia KYC (prioritário)
 * 2. Usa conhecimento técnico KYC quando o guia não é suficiente
 * 3. Salva respostas úteis em JSON para base futura
 */

// Configuração
const ENABLE_DEEPSEEK = true;
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const SAVE_LEARNING = true; // Salvar respostas para base de conhecimento

// Base de conhecimento técnico KYC (além do guia)
const KYC_TECHNICAL_KNOWLEDGE = `
CONHECIMENTO TÉCNICO KYC - INFORMAÇÕES COMPLEMENTARES:

1. REGULAMENTAÇÃO E COMPLIANCE:
   - KYC é exigido pelo Banco Central e COAF no Brasil
   - Lei 9.613/1998 (Lei de Lavagem de Dinheiro)
   - Circular BCB 3.978/2020 (Dispõe sobre a política de relacionamento com clientes)
   - Resolução COAF nº 39/2022 (Obrigações de KYC para instituições financeiras)

2. NÍVEIS DE KYC:
   - KYC Simplificado: Para operações de baixo valor/risco
   - KYC Padrão: Para maioria das operações financeiras
   - KYC Reforçado (EDD - Enhanced Due Diligence): Para PEPs, alto valor, jurisdições de risco

3. DOCUMENTOS VÁLIDOS NO BRASIL:
   - RG (Carteira de Identidade) - todos os estados
   - CNH (Carteira Nacional de Habilitação) - modelo atual
   - RNE (Registro Nacional de Estrangeiro)
   - Passaporte brasileiro (página da foto)
   - Carteira de Trabalho Digital (modelo atual)

4. VALIDAÇÃO DE DOCUMENTOS:
   - Verificar autenticidade através de bases governamentais quando possível
   - Checar consistência dos dados (nome, data nascimento, filiação)
   - Validar se documento não está vencido (exceto RG que não vence)
   - Atenção para sinais de adulteração: fontes diferentes, cores inconsistentes

5. BIOMETRIA FACIAL:
   - Threshold mínimo recomendado: 0.75 (75% similaridade)
   - Fatores que reduzem similaridade: idade da foto, ângulo, iluminação, acessórios
   - Liveness detection previne ataques com fotos/vídeos
   - Importante: fotos muito antigas (>5 anos) podem exigir validação adicional

6. PROBLEMAS COMUNS E SOLUÇÕES:
   - Câmera não abre: 90% dos casos é permissão negada no navegador
   - OCR falha: geralmente por reflexo, baixa iluminação ou documento fora do enquadramento
   - Face match baixo: orientar boa iluminação frontal, remover acessórios
   - Loading infinito: limpar cache do navegador resolve 70% dos casos
   - Erro de conexão: verificar VPN/proxy bloqueando requisições

7. PEP (Pessoa Politicamente Exposta):
   - Definição: pessoas que exercem ou exerceram funções públicas importantes
   - Inclui: políticos, juízes, diretores de estatais, militares de alto escalão
   - Familiares até 2º grau e pessoas próximas também são considerados PEP
   - Exige EDD (Due Diligence Reforçada)

8. SANÇÕES E LISTAS RESTRITIVAS:
   - Listas consultadas: OFAC, UN, EU, CEIS, CNJ
   - Verificação deve ser feita antes de estabelecer relacionamento
   - Match parcial exige análise manual (homônimos são comuns)

9. LIMITES OPERACIONAIS (exemplos comuns):
   - Pix sem KYC completo: até R$ 200/dia (varia por instituição)
   - Transferências TED: exigem KYC completo independentemente do valor
   - Saques: limites variam conforme nível de KYC

10. BOAS PRÁTICAS DE ATENDIMENTO:
    - Sempre validar identidade antes de fornecer informações sensíveis
    - Documentar todas as interações no sistema
    - Em caso de suspeita de fraude, escalar imediatamente
    - Manter sigilo absoluto sobre dados do cliente
`;

/**
 * Handler principal da função
 */
exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET para health check, POST para chat
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Health check via GET
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'ok',
          enabled: ENABLE_DEEPSEEK,
          hasApiKey: !!process.env.DEEPSEEK_API_KEY,
          saveLearning: SAVE_LEARNING,
          timestamp: new Date().toISOString()
        })
      };
    }

    // Parse do body
    const { query, systemPrompt, context: articlesContext } = JSON.parse(event.body);

    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Query is required' })
      };
    }

    // Se DeepSeek não estiver habilitado, retorna erro amigável
    if (!ENABLE_DEEPSEEK) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          response: `⚠️ **Integração com IA ainda não configurada**

A integração com a DeepSeek API estará disponível em breve.

Enquanto isso, utilize o modo offline do assistente que já está funcionando no frontend.`,
          mode: 'offline',
          enabled: false
        })
      };
    }

    // Verificar se API key está configurada
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'DeepSeek API key not configured',
          message: 'Configure a variável de ambiente DEEPSEEK_API_KEY no Netlify'
        })
      };
    }

    // Construir contexto com artigos do guia (se disponíveis)
    let guideContext = '';
    if (articlesContext && articlesContext.length > 0) {
      guideContext = articlesContext.map(article => {
        return `ARTIGO DO GUIA: ${article.title}\n${JSON.stringify(article.content, null, 2)}`;
      }).join('\n\n');
    }

    // System prompt híbrido: guia + conhecimento técnico
    const hybridSystemPrompt = systemPrompt || buildHybridSystemPrompt(guideContext);

    // Construir messages
    const messages = [
      {
        role: 'system',
        content: hybridSystemPrompt
      },
      {
        role: 'user',
        content: query
      }
    ];

    // Chamada à API DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.4,        // Um pouco mais alto para criatividade controlada
        max_tokens: 1500,        // Mais tokens para respostas completas
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Response is not JSON
      }
      console.error('DeepSeek API Error:', response.status, errorData);
      
      return {
        statusCode: response.status === 401 ? 401 : 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to get response from AI',
          message: response.status === 401 
            ? 'Invalid API key' 
            : `API error: ${response.status}`,
          details: errorData
        })
      };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';

    // Salvar aprendizado (se habilitado e resposta for útil)
    if (SAVE_LEARNING && aiResponse && !aiResponse.includes('Não encontrei')) {
      await saveLearning({
        query: query,
        response: aiResponse,
        timestamp: new Date().toISOString(),
        model: 'deepseek-chat',
        usage: data.usage || null,
        context: articlesContext ? articlesContext.map(a => a.title) : []
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        mode: 'online',
        enabled: true,
        model: 'deepseek-chat',
        usage: data.usage || null,
        usedGuide: articlesContext && articlesContext.length > 0,
        usedTechnicalKnowledge: true
      })
    };

  } catch (error) {
    console.error('Error in AI Assistant function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'An error occurred while processing your request'
      })
    };
  }
};

/**
 * Constrói system prompt híbrido (guia + conhecimento técnico)
 * Foco em respostas diretas em estilo de prosa, com enriquecimento técnico quando necessário
 */
function buildHybridSystemPrompt(guideContext) {
  let prompt = `Você é um assistente especializado em procedimentos KYC (Know Your Customer) com conhecimento técnico avançado.

SUA FUNÇÃO PRINCIPAL:
Ajudar analistas a resolver problemas operacionais de forma prática e direta. Você deve fornecer respostas claras, em estilo de prosa (texto corrido e direto), evitando listas excessivas ou formatação muito estruturada quando não for necessário.

BASE DE CONHECIMENTO DISPONÍVEL:
1. GUIA KYC (conteúdo oficial do guia):
${guideContext || '(nenhum artigo do guia disponível no momento)'}

2. CONHECIMENTO TÉCNICO KYC (informações complementares):
${KYC_TECHNICAL_KNOWLEDGE}

DIRETRIZES DE RESPOSTA - COMO AGIR:

1. **Quando o guia tiver informação suficiente:**
   - Responda de forma direta e clara, explicando o procedimento em prosa
   - Mencione o artigo do guia de forma natural na resposta (ex: "Conforme o artigo sobre Face Match...")
   - Foque na solução prática

2. **Quando o guia NÃO for suficiente ou não abordar o problema:**
   - Enriqueça a resposta com conhecimento técnico relevante
   - Explique conceitos, regulamentações ou práticas que possam ajudar
   - Seja explícito: "O guia não aborda especificamente este caso, mas com base no conhecimento técnico de KYC..."
   - Use sua base técnica para oferecer alternativas e contexto adicional

3. **Quando não encontrar informação em nenhuma fonte:**
   - Seja honesto e direto: "Não encontrei informação específica sobre isso nos procedimentos KYC"
   - Sugira caminhos alternativos (consultar supervisor, escalar para equipe técnica, etc.)

ESTILO DE RESPOSTA - TOM E FORMATO:
- **Direto e claro**: Vá direto ao ponto, como em uma conversa profissional
- **Prosa natural**: Use parágrafos bem estruturados em vez de listas excessivas
- **Prático**: Foque no que o analista precisa fazer para resolver o problema
- **Empático**: Reconheça a situação do analista/usuário
- **Técnico quando necessário**: Use terminologia adequada, mas explique se for complexo

EXEMPLO DE ESTRUTURA DE RESPOSTA (em prosa):
"Entendi o problema. [Explicação direta do que está acontecendo]. 

[Se o guia aborda]: O guia KYC trata disso no artigo sobre [nome do artigo]. Basicamente, você precisa [explicação em prosa dos passos]. 

[Se o guia não aborda]: O guia não cobre especificamente essa situação, mas posso ajudar com base no conhecimento técnico. [Explicação técnica em prosa].

[Se houver necessidade de escalar]: Se após essas orientações o problema persistir, o próximo passo é [indicar escalonamento]."

REGRAS IMPORTANTES:
- Nunca invente procedimentos, thresholds ou regras
- Para casos de possível fraude, sempre oriente escalar para equipe especializada
- Mantenha o foco na solução prática do problema
- Seja transparente sobre a fonte da informação (guia vs conhecimento técnico)
- Em caso de dúvida sobre a precisão da informação, prefira ser conservador

LEMBRE-SE:
Seu objetivo é ser útil e prático. O analista precisa de uma resposta clara e acionável, não de uma aula teórica. Use o conhecimento técnico para enriquecer a resposta quando o guia não for suficiente, mas sempre mantenha o foco na resolução do problema.`;

  return prompt;
}

/**
 * Salva aprendizado em arquivo JSON (simulado via console.log para produção)
 * Em produção, isso poderia salvar em:
 * - AWS S3
 * - Banco de dados
 * - Arquivo JSON no repositório
 */
async function saveLearning(data) {
  // Em produção, isso salvaria em um banco de dados ou arquivo
  // Por enquanto, logamos para poder ser capturado pelos logs do Netlify
  console.log('=== APRENDIZADO SALVO ===');
  console.log(JSON.stringify({
    type: 'kyc_learning',
    timestamp: data.timestamp,
    query: data.query.substring(0, 100), // Preview da pergunta
    response_preview: data.response.substring(0, 200), // Preview da resposta
    usedGuide: data.context.length > 0,
    guideArticles: data.context,
    full_data: data // Dados completos para referência
  }, null, 2));
  console.log('=== FIM APRENDIZADO ===');
  
  // TODO: Em produção, implementar salvamento real:
  // 1. AWS S3: await s3.putObject({ Bucket: 'kyc-learning', Key: `learnings/${Date.now()}.json`, Body: JSON.stringify(data) }).promise();
  // 2. Banco de dados: await db.collection('learnings').insertOne(data);
  // 3. Arquivo local: await fs.appendFileSync('learnings.json', JSON.stringify(data) + '\n');
  
  return true;
}

/**
 * Health check endpoint (via GET no handler principal)
 */
exports.health = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'ok',
      enabled: ENABLE_DEEPSEEK,
      hasApiKey: !!process.env.DEEPSEEK_API_KEY,
      saveLearning: SAVE_LEARNING,
      timestamp: new Date().toISOString()
    })
  };
};