// /api/coletor-notaparana-orchestrator.js
// Endpoint disparado pelo cron 4x/dia. Chama os 3 lotes do coletor em paralelo.
//
// Por que assim? Cada lote demora ~50s. Se chamássemos em SEQUÊNCIA aqui,
// estouraríamos o limite de 60s do Vercel Hobby. Chamando em PARALELO via fire-and-forget,
// este endpoint retorna em <1s e os 3 lotes rodam isoladamente.

export default async function handler(req, res) {
  const auth = req.headers['authorization'] || '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  const base = `https://${req.headers.host}`;
  const promises = [];

  // Dispara lotes 1, 2 e 3 em paralelo (cobre 45 postos do PR)
  for (let lote = 1; lote <= 3; lote++) {
    const url = `${base}/api/coletor-notaparana?lote=${lote}`;
    // fire-and-forget: não esperamos a resposta
    fetch(url, {
      headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET}` },
    }).catch(e => console.error(`Lote ${lote} falhou:`, e.message));
    promises.push(lote);
  }

  return res.status(200).json({
    ok: true,
    mensagem: `Disparados ${promises.length} lotes em paralelo`,
    timestamp: new Date().toISOString(),
  });
}
