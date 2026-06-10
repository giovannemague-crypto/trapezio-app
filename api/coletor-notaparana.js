// /api/coletor-notaparana.js
// Cron: coleta preços do Nota Paraná (SEFAZ-PR) pros seus postos do PR.
//
// Estratégia:
// - 4 combustíveis (GC, GA, ET, DS) × ~33 postos do PR = ~132 buscas por coleta
// - Cada busca ~800ms (300ms API + 500ms pausa educada) → ~1m45s total
// - Como o Vercel Hobby tem timeout de 60s, dividimos em LOTES de 15 postos
// - Cada lote roda em ~50s (15 postos × 4 combustíveis × 800ms = 48s)
// - 3 lotes cobrem todos os postos do PR
//
// Cron schedule (configurado no vercel.json):
//   - 10:00 UTC (07h BR): lote 1
//   - 10:01 UTC (07h01 BR): lote 2
//   - 10:02 UTC (07h02 BR): lote 3
// (Repetir pra 12h, 16h, 20h Brasília)
//
// Variáveis de ambiente:
//   SUPABASE_URL
//   SUPABASE_SERVICE_KEY
//   CRON_SECRET

const NOTAPR_API = 'https://menorpreco.notaparana.pr.gov.br/api/v1/produtos';
const RAIO_KM = 3;
const LOTE_SIZE = 15;          // postos por execução
const PAUSA_MS = 500;          // entre requisições, pra não sobrecarregar SEFAZ
const FONTE = 'notaparana_pr';

// Combustíveis a coletar — chave nossa + cdanp da SEFAZ + termo de busca
const COMBUSTIVEIS = [
  { key: 'gc',  cdanp: '320102001', termo: 'gasolina',  filtro: ['comum'] },
  { key: 'ga',  cdanp: '320102002', termo: 'gasolina',  filtro: ['aditiv', 'duramais', 'ipimax', 'original'] },
  { key: 'et',  cdanp: '320101001', termo: 'etanol',    filtro: [] },
  { key: 'ds',  cdanp: '320105001', termo: 'diesel s10', filtro: ['s10', 's-10'] },
];

// ─── Geohash encoder (não precisa biblioteca) ────────────────
function encodeGeohash(lat, lng, precision = 9) {
  const base32 = '0123456789bcdefghjkmnpqrstuvwxyz';
  let latRange = [-90, 90], lngRange = [-180, 180];
  let geohash = '', bits = 0, bit = 0, even = true;
  while (geohash.length < precision) {
    if (even) {
      const mid = (lngRange[0] + lngRange[1]) / 2;
      if (lng >= mid) { bits = (bits << 1) | 1; lngRange[0] = mid; }
      else { bits = bits << 1; lngRange[1] = mid; }
    } else {
      const mid = (latRange[0] + latRange[1]) / 2;
      if (lat >= mid) { bits = (bits << 1) | 1; latRange[0] = mid; }
      else { bits = bits << 1; latRange[1] = mid; }
    }
    even = !even;
    if (++bit === 5) { geohash += base32[bits]; bits = 0; bit = 0; }
  }
  return geohash;
}

// ─── Helpers Supabase ────────────────────────────────────────
async function sb(path, opts = {}) {
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!r.ok) throw new Error(`Supabase ${path}: ${r.status} ${await r.text()}`);
  const txt = await r.text();
  if (!txt) return null;
  try { return JSON.parse(txt); } catch { return null; }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ─── Normaliza descrição da SEFAZ pra nosso combustível ──────
function classificarCombustivel(desc, cdanp) {
  const d = (desc || '').toLowerCase();
  // Tenta primeiro pelo cdanp (mais confiável)
  for (const c of COMBUSTIVEIS) {
    if (c.cdanp === cdanp) {
      // Mesmo cdanp serve pra comum e aditivada (320102001/002). Refina por descrição.
      if (c.key === 'gc' && /aditiv|duramais|ipimax|original/i.test(d)) return 'ga';
      if (c.key === 'ga' && !/aditiv|duramais|ipimax|original/i.test(d)) return 'gc';
      return c.key;
    }
  }
  // Fallback por descrição
  if (/diesel.*s.?10/i.test(d)) return 'ds';
  if (/etanol/i.test(d)) return 'et';
  if (/aditiv|duramais|ipimax|original/i.test(d) && /gasolina/i.test(d)) return 'ga';
  if (/gasolina/i.test(d)) return 'gc';
  return null;
}

// ─── Coleta UM combustível pra UM posto ──────────────────────
async function coletarPostoCombustivel(posto, comb, log) {
  const geohash = encodeGeohash(parseFloat(posto.lat), parseFloat(posto.lng), 9);
  const url = `${NOTAPR_API}?local=${geohash}&termo=${encodeURIComponent(comb.termo)}&categoria=17&offset=0&raio=${RAIO_KM}&data=-1&ordem=0`;

  let resp;
  try {
    const r = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; TrapezioBot/1.0)',
      },
    });
    if (!r.ok) {
      log.push(`  ✗ ${posto.id} ${comb.termo}: HTTP ${r.status}`);
      return 0;
    }
    resp = await r.json();
  } catch (e) {
    log.push(`  ✗ ${posto.id} ${comb.termo}: ${e.message}`);
    return 0;
  }

  const produtos = resp.produtos || [];
  let inseridos = 0;
  const linhas = [];

  for (const p of produtos) {
    const combNorm = classificarCombustivel(p.desc, p.cdanp);
    if (!combNorm) continue;  // ignora produtos que não conseguimos classificar
    if (combNorm !== comb.key) continue;  // só os do combustível atual

    const valor = parseFloat(p.valor);
    if (!valor || isNaN(valor)) continue;

    const est = p.estabelecimento || {};
    const endereco = [est.tp_logr, est.nm_logr, est.nr_logr].filter(Boolean).join(' ');

    linhas.push({
      posto_id: posto.id,
      fonte: FONTE,
      estabelecimento_codigo: est.codigo,
      estabelecimento_nome: est.nm_fan || est.nm_emp || 'Sem nome',
      estabelecimento_endereco: endereco || null,
      estabelecimento_bairro: est.bairro || null,
      estabelecimento_municipio: est.mun || null,
      estabelecimento_uf: est.uf || null,
      combustivel: combNorm,
      descricao_original: p.desc,
      cdanp: p.cdanp,
      valor,
      datahora_nota: p.datahora,
      distancia_km: parseFloat(p.distkm) || null,
      lat: null,  // a SEFAZ não devolve GPS do estabelecimento
      lng: null,
    });
  }

  if (linhas.length > 0) {
    try {
      await sb('precos_externos?on_conflict=estabelecimento_codigo,combustivel,datahora_nota', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(linhas),
      });
      inseridos = linhas.length;
    } catch (e) {
      log.push(`  ✗ ${posto.id} insert: ${e.message.slice(0, 100)}`);
    }
  }
  return inseridos;
}

// ─── Handler principal ───────────────────────────────────────
export default async function handler(req, res) {
  const auth = req.headers['authorization'] || '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Qual lote rodar? Vem na query (?lote=1) ou no path do cron
  const lote = parseInt(req.query?.lote || '1', 10);
  if (lote < 1 || lote > 10) return res.status(400).json({ error: 'lote inválido (1-10)' });

  const log = [];
  const t0 = Date.now();

  try {
    // Pega todos os postos do PR ordenados por id, e seleciona o lote
    const todos = await sb('postos?estado=eq.PR&lat=not.is.null&select=id,nome,lat,lng&order=id.asc');
    const inicio = (lote - 1) * LOTE_SIZE;
    const postos = todos.slice(inicio, inicio + LOTE_SIZE);

    if (postos.length === 0) {
      return res.status(200).json({
        ok: true,
        mensagem: `Lote ${lote} vazio. Total PR: ${todos.length}.`,
      });
    }

    log.push(`=== Lote ${lote}: ${postos.length} postos (${postos[0].id} a ${postos[postos.length-1].id}) ===`);

    let totalInseridos = 0;
    for (const posto of postos) {
      let postoTotal = 0;
      for (const comb of COMBUSTIVEIS) {
        const n = await coletarPostoCombustivel(posto, comb, log);
        postoTotal += n;
        await sleep(PAUSA_MS);
      }
      log.push(`✓ ${posto.id} ${posto.nome}: ${postoTotal} preços`);
      totalInseridos += postoTotal;
    }

    const segundos = ((Date.now() - t0) / 1000).toFixed(1);
    log.push(`\nTotal: ${totalInseridos} preços inseridos em ${segundos}s`);

    return res.status(200).json({
      ok: true,
      lote,
      postos_processados: postos.length,
      precos_inseridos: totalInseridos,
      duracao_segundos: segundos,
      log,
    });
  } catch (e) {
    console.error('Coletor falhou:', e);
    return res.status(500).json({ error: e.message, log });
  }
}
