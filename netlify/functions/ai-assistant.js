

// Configuração - Mudar para true após configurar API key
const ENABLE_DEEPSEEK = true;

// URL da API DeepSeek
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * Handler principal da função
 */
exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Apenas POST é permitido
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
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

Enquanto isso, utilize o modo offline do assistente que já está funcionando no frontend.

**Para ativar a integração:**
1. Configure a API key no Netlify
2. Atualize a configuração para habilitar a API`,
          mode: 'offline',
          enabled: false
        })
      };
    }

    // Verificar se API key está configurada
    const apiKey = process.env.DEESEEK_API_KEY;
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

    // Construir prompt com contexto KYC
    const messages = [
      {
        role: 'system',
        content: systemPrompt || buildDefaultSystemPrompt()
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
        temperature: 0.3,        // Baixa temperatura para consistência
        max_tokens: 1024,        // Limite de tokens
        top_p: 0.9,
        frequency_penalty: 0.1,  // Reduz repetição
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DeepSeek API Error:', response.status, errorData);
      
      return {
        statusCode: response.status === 401 ? 401 : 500,
        headers,
        body: JSON.stringify({
          error: 'Failed to get response from AI',
          message: response.status === 401 
            ? 'Invalid API key' 
            : `API error: ${response.status}`
        })
      };
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar sua solicitação.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: aiResponse,
        mode: 'online',
        enabled: true,
        model: 'deepseek-chat',
        usage: data.usage || null
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
 * Constrói o system prompt padrão
 */
function buildDefaultSystemPrompt() {
  return `Você é um assistente especializado em procedimentos KYC (Know Your Customer).
Sua função é ajudar analistas a resolver problemas operacionais durante atendimentos.

REGRAS IMPORTANTES:
1. Baseie suas respostas APENAS nos artigos e procedimentos fornecidos no contexto
2. Se não encontrar informação nos documentos, diga claramente "Não encontrei informação específica nos procedimentos KYC"
3. Cite sempre a seção/artigo de referência
4. Mantenha respostas objetivas e operacionais
5. Não invente procedimentos, thresholds ou regras
6. Não forneça informações sobre casos específicos de usuários
7. Mantenha foco em troubleshooting operacional

FORMATO DE RESPOSTA:
- Identifique o problema principal
- Liste passos de troubleshooting de forma clara e numerada
- Indique quando escalar para equipe técnica ou fornecedor
- Cite artigos relacionados quando relevante

TOM DE VOZ:
- Profissional e direto
- Empático com o analista
- Focado em solução prática`;
}

/**
 * Health check endpoint
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
      hasApiKey: !!process.env.DEESEEK_API_KEY,
      timestamp: new Date().toISOString()
    })
  };
};
