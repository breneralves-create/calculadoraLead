export default async function handler(req, res) {
  // Habilitar CORS se necessário (opcional para Vercel na mesma URL)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas método POST é permitido' });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Mensagens não fornecidas' });
  }

  try {
    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
      }),
    });

    const data = await openAiRes.json();
    
    if (!openAiRes.ok) {
      console.error('Erro na OpenAI:', data);
      return res.status(openAiRes.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Erro no servidor:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
