/**
 * Função de teste para verificar se as variáveis de ambiente estão chegando
 * Acesse: GET /.netlify/functions/test-env
 */
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Verificar TODAS as variáveis de ambiente relacionadas a DeepSeek
  const envVars = {};
  Object.keys(process.env).forEach(key => {
    if (key.includes('DEEP') || key.includes('SEEK') || key.includes('API') || key.includes('KEY')) {
      const value = process.env[key];
      envVars[key] = value ? `${value.substring(0, 3)}...${value.slice(-5)}` : null;
    }
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      envVars: {
        DEEPSEEK_API_KEY_exists: !!process.env.DEEPSEEK_API_KEY,
        DEEPSEEK_API_KEY_length: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.length : 0,
        DEEPSEEK_API_KEY_preview: process.env.DEEPSEEK_API_KEY 
          ? `${process.env.DEEPSEEK_API_KEY.substring(0, 3)}...${process.env.DEEPSEEK_API_KEY.slice(-5)}`
          : null,
        all_related_vars: envVars
      },
      nodeVersion: process.version,
      runtime: 'Netlify Functions'
    })
  };
};