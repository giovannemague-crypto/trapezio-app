module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.ANTHROPIC_KEY;
  if (!key) {
    return res.status(500).json({ error: 'ANTHROPIC_KEY nao configurada' });
  }

  const { image, mediaType } = req.body || {};
  if (!image) return res.status(400).json({ error: 'Imagem nao enviada' });

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType || 'image/jpeg', data: image } },
          { type: 'text', text: 'Analise esta imagem de um painel de precos de posto de gasolina. Retorne SOMENTE um JSON valido, sem texto extra, sem markdown: {"gc":"0.00","ga":"0.00","et":"0.00","ds":"0.00"}. gc=gasolina comum, ga=gasolina aditivada, et=etanol, ds=diesel s10. Use ponto decimal. Use "" se nao encontrar.' }
        ]}]
      })
    });

    const text = await resp.text();
    console.log('Anthropic resposta:', text.slice(0, 300));

    let data;
    try { data = JSON.parse(text); }
    catch(e) { return res.status(500).json({ error: 'Resposta invalida', raw: text.slice(0, 200) }); }

    if (data.error) return res.status(500).json({ error: data.error.message });

    const txt = (data.content || []).map(b => b.text || '').join('').trim();
    const precos = JSON.parse(txt.replace(/```json|```/g, '').trim());
    return res.status(200).json(precos);

  } catch (e) {
    console.error('Erro:', e.message);
    return res.status(500).json({ error: e.message });
  }
};

module.exports.config = { api: { bodyParser: { sizeLimit: '10mb' } } };
