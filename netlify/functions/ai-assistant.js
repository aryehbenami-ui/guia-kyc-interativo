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
 */
function buildHybridSystemPrompt(guideContext) {
  let prompt = `Você é um assistente especializado em procedimentos KYC (Know Your Customer) com conhecimento técnico avançado.

SUA FUNÇÃO:
- Ajudar analistas a resolver problemas operacionais durante atendimentos
- Fornecer informações técnicas sobre KYC quando o guia não for suficiente
- Explicar regulamentações, melhores práticas e soluções para casos complexos

BASE DE CONHECIMENTO:
1. GUIA KYC (prioritário quando disponível):
${guideContext || '(nenhum artigo do guia disponível)'}

2. CONHECIMENTO TÉCNICO KYC:
${KYC_TECHNICAL_KNOWLEDGE}

REGRAS IMPORTANTES:
1. PRIORIZE o guia KYC quando ele tiver informação relevante sobre o problema
2. Se o guia NÃO tiver informação suficiente, use o conhecimento técnico para complementar
3. Sempre indique claramente se está usando o guia ou conhecimento técnico
4. Se não encontrar informação em nenhuma fonte, diga claramente "Não encontrei informação específica"
5. Mantenha respostas objetivas e operacionais
6. Não invente procedimentos, thresholds ou regras
7. Para casos de possível fraude, sempre oriente a escalar para equipe especializada

FORMATO DE RESPOSTA:
- Comece identificando se o problema está coberto pelo guia
- Se estiver: cite o artigo e siga os procedimentos do guia
- Se não estiver: use conhecimento técnico e indique "Baseado em conhecimento técnico KYC"
- Liste passos de troubleshooting de forma clara e numerada
- Indique quando escalar para equipe técnica ou fornecedor
- Inclua referências a regulamentações quando relevante

TOM DE VOZ:
- Profissional e direto
- Empático com o analista
- Focado em solução prática
- Técnico quando necessário, mas acessível`;

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