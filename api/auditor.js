// /api/auditor.js
// Cron noturno: analisa registros do dia e cria alertas via Claude.
// Variáveis de ambiente necessárias na Vercel:
//   ANTHROPIC_API_KEY      -> sk-ant-...
//   SUPABASE_URL           -> https://rpuiptwlmomwbjcmnwbd.supabase.co
//   SUPABASE_SERVICE_KEY   -> service_role key (NÃO a publishable!)
//   CRON_SECRET            -> string aleatória pra proteger a rota

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';
const LOTE = 50; // registros por chamada ao Claude

const COMBS = ['gc','ga','et','eta','ds','ds500','dsa'];
const COMB_LABEL = {
  gc:'Gasolina Comum', ga:'Gasolina Aditivada',
  et:'Etanol', eta:'Etanol Aditivado',
  ds:'Diesel S10', ds500:'Diesel S500', dsa:'Diesel S10 Aditivado'
};

// ─── Helpers Supabase ────────────────────────────────────────
async function sb(path, opts = {}) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/${path}`;
  const r = await fetch(url, {
    ...opts,
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Supabase ${path}: ${r.status} ${txt}`);
  }
  return r.status === 204 ? null : r.json();
}

// ─── Análise determinística (regras baratas) ─────────────────
// Roda antes da IA. Pega o que dá pra pegar sem token.
function regrasDeterministicas(registros) {
  const alertas = [];

  // 1) Agrupa por posto
  const porPosto = {};
  for (const r of registros) {
    (porPosto[r.posto_id] ||= []).push(r);
  }

  for (const [postoId, regs] of Object.entries(porPosto)) {
    const concorrentes = regs.filter(r => !r.is_proprio_posto);
    const proprio = regs.find(r => r.is_proprio_posto);

    // 1.1) Bateu meta de 7 mas não tem painel próprio
    if (concorrentes.length >= 7 && !proprio) {
      alertas.push({
        posto_id: postoId,
        tipo: 'meta_nao_cumprida',
        severidade: 'media',
        mensagem: `Posto bateu meta de ${concorrentes.length} concorrentes mas não registrou painel próprio.`,
        detalhes: { concorrentes: concorrentes.length },
      });
    }

    // 1.2) Registros muito rápidos (<5min entre o 1º e o 7º)
    if (concorrentes.length >= 7) {
      const ordenados = [...concorrentes].sort((a,b) => new Date(a.criado_em) - new Date(b.criado_em));
      const dtMin = (new Date(ordenados[6].criado_em) - new Date(ordenados[0].criado_em)) / 60000;
      if (dtMin < 5) {
        alertas.push({
          posto_id: postoId,
          tipo: 'padrao_suspeito',
          severidade: 'alta',
          mensagem: `7 concorrentes registrados em ${dtMin.toFixed(1)} minutos — improvável visitar tantos postos tão rápido.`,
          detalhes: { minutos: dtMin, primeiro: ordenados[0].criado_em, setimo: ordenados[6].criado_em },
        });
      }
    }

    // 1.3) GPS idêntico em todos os concorrentes
    const comGps = concorrentes.filter(r => r.lat && r.lng);
    if (comGps.length >= 3) {
      const todosIguais = comGps.every(r =>
        Math.abs(parseFloat(r.lat) - parseFloat(comGps[0].lat)) < 0.0005 &&
        Math.abs(parseFloat(r.lng) - parseFloat(comGps[0].lng)) < 0.0005
      );
      if (todosIguais) {
        alertas.push({
          posto_id: postoId,
          tipo: 'padrao_suspeito',
          severidade: 'alta',
          mensagem: `${comGps.length} concorrentes registrados com GPS praticamente idêntico — gerente provavelmente não saiu do posto.`,
          detalhes: { lat: comGps[0].lat, lng: comGps[0].lng },
        });
      }
    }
  }

  return alertas;
}

// ─── Chamada ao Claude para análise contextual ───────────────
async function analisarComIA(loteRegistros, contextoMercado) {
  // contextoMercado: { gc: {min, max, media}, ga: {...}, ... } por estado
  const prompt = `Você é um auditor de uma rede de postos de combustível analisando registros de pesquisa de preços de concorrentes.

CONTEXTO DE MERCADO (média/mínimo/máximo por estado, dos registros de hoje):
${JSON.stringify(contextoMercado, null, 2)}

REGISTROS PARA AUDITAR (cada um é um preço observado num concorrente):
${JSON.stringify(loteRegistros.map(r => ({
  id: r.id,
  posto_id: r.posto_id,
  estado: r.estado,
  cidade: r.cidade,
  concorrente: r.concorrente_nome,
  bandeira: r.concorrente_bandeira,
  precos: COMBS.reduce((acc, k) => { if (r[k]) acc[k] = parseFloat(r[k]); return acc; }, {}),
  hora: r.criado_em,
  is_proprio: r.is_proprio_posto,
})), null, 2)}

TAREFA: Para cada registro suspeito, retorne um alerta. Considere suspeito:
- Preço muito fora da faixa de mercado do estado (>R$0,80 do mín/máx)
- Combinações impossíveis (ex: etanol mais caro que gasolina)
- Bandeira incompatível com faixa de preço típica
- Dados claramente errados

NÃO crie alertas para variações pequenas dentro da normalidade.

Responda APENAS com JSON válido, sem texto antes ou depois, no formato:
{"alertas":[{"registro_id":123,"posto_id":"045","tipo":"preco_outlier","severidade":"alta|media|baixa","mensagem":"texto curto explicando","detalhes":{"combustivel":"gc","valor":3.80,"esperado":"R$5,80-R$6,20"}}]}

Se nenhum registro for suspeito, retorne {"alertas":[]}.`;

  const r = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Anthropic ${r.status}: ${txt}`);
  }
  const data = await r.json();
  const texto = (data.content?.[0]?.text || '').trim();

  // Limpa cercas markdown se houver
  const limpo = texto.replace(/^```json\s*/i, '').replace(/```\s*$/,'').trim();

  try {
    const parsed = JSON.parse(limpo);
    return parsed.alertas || [];
  } catch (e) {
    console.error('JSON inválido da IA:', texto.slice(0, 500));
    return [];
  }
}

// ─── Calcula contexto de mercado por estado ──────────────────
function calcularContexto(registros) {
  const ctx = {}; // ctx[estado][combustivel] = {min, max, media, n}
  for (const r of registros) {
    if (r.is_proprio_posto) continue;
    const est = r.estado || 'XX';
    ctx[est] ||= {};
    for (const k of COMBS) {
      const v = parseFloat(r[k]);
      if (!v || isNaN(v) || v <= 0) continue;
      ctx[est][k] ||= { vals: [] };
      ctx[est][k].vals.push(v);
    }
  }
  // resume
  for (const est of Object.keys(ctx)) {
    for (const k of Object.keys(ctx[est])) {
      const vs = ctx[est][k].vals;
      ctx[est][k] = {
        min: Math.min(...vs),
        max: Math.max(...vs),
        media: +(vs.reduce((a,b)=>a+b,0) / vs.length).toFixed(2),
        n: vs.length,
      };
    }
  }
  return ctx;
}

// ─── Handler ─────────────────────────────────────────────────
export default async function handler(req, res) {
  // Proteção: só a Vercel Cron (ou quem tem o segredo) pode rodar
  const auth = req.headers['authorization'] || '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // Janela: últimas 24h
    const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Busca registros do período + dados do posto (cidade/estado vem de POSTOS local,
    // mas como o auditor não tem essa lista, vou usar os campos que estão em registros)
    const registros = await sb(
      `registros?criado_em=gte.${desde}&select=*&order=criado_em.asc`,
      { method: 'GET' }
    );

    if (!registros || registros.length === 0) {
      return res.status(200).json({ ok: true, mensagem: 'Sem registros no período.' });
    }

    // Enriquecer com estado/cidade a partir da tabela posto (se você tiver)
    // Como o seu schema atual não tem isso joined, deixo só com o que tem.
    // Se quiser join real, crie uma tabela `postos` no banco. Por ora, deduzir pelo posto_id
    // não dá. Vou enriquecer aqui com lookup simples (mantenha sincronizado com POSTOS do front):
    const POSTOS_INFO = await getPostosInfo();
    for (const r of registros) {
      const p = POSTOS_INFO[r.posto_id];
      if (p) { r.estado = p.estado; r.cidade = p.cidade; }
    }

    // 1) Regras determinísticas
    const alertasRegras = regrasDeterministicas(registros);

    // 2) IA em lotes
    const contexto = calcularContexto(registros);
    const alertasIA = [];

    // Só passa pra IA os registros NÃO próprios (concorrentes)
    const paraIA = registros.filter(r => !r.is_proprio_posto);

    for (let i = 0; i < paraIA.length; i += LOTE) {
      const lote = paraIA.slice(i, i + LOTE);
      try {
        const alertas = await analisarComIA(lote, contexto);
        alertasIA.push(...alertas);
      } catch (e) {
        console.error('Falha em lote IA:', e.message);
        // não aborta o cron inteiro
      }
    }

    // 3) Persistir alertas (regras + IA), evitando duplicar com upsert
    const todos = [...alertasRegras, ...alertasIA].filter(a => a && a.tipo && a.posto_id);

    if (todos.length > 0) {
      // Insere em batch. O índice UNIQUE em (registro_id, tipo, DATE(criado_em))
      // bloqueia duplicatas — usamos on_conflict resolution=ignore-duplicates
      await sb('alertas?on_conflict=registro_id,tipo', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify(todos),
      }).catch(err => console.error('Erro insert alertas:', err.message));
    }

    return res.status(200).json({
      ok: true,
      registros_analisados: registros.length,
      alertas_criados: todos.length,
      por_regras: alertasRegras.length,
      por_ia: alertasIA.length,
    });
  } catch (e) {
    console.error('Auditor falhou:', e);
    return res.status(500).json({ error: e.message });
  }
}

// ─── Tabela auxiliar de postos (id -> {estado, cidade}) ──────
// Mantenha esta lista sincronizada com a do front. Idealmente,
// migraria para uma tabela `postos` no Supabase no futuro.
async function getPostosInfo() {
  return {
    "001":{cidade:"Colombo",estado:"PR"},"002":{cidade:"São Bento Do Sul",estado:"SC"},
    "003":{cidade:"São Leopoldo",estado:"RS"},"004":{cidade:"Porto Alegre",estado:"RS"},
    "005":{cidade:"Novo Hamburgo",estado:"RS"},"006":{cidade:"Canoas",estado:"RS"},
    "007":{cidade:"Canoas",estado:"RS"},"008":{cidade:"Gravataí",estado:"RS"},
    "009":{cidade:"Sapucaia Do Sul",estado:"RS"},"011":{cidade:"São José Dos Pinhais",estado:"PR"},
    "012":{cidade:"Portão",estado:"RS"},"013":{cidade:"Colombo",estado:"PR"},
    "014":{cidade:"Gravataí",estado:"RS"},"015":{cidade:"Araricá",estado:"RS"},
    "017":{cidade:"Araricá",estado:"RS"},"018":{cidade:"Sapucaia Do Sul",estado:"RS"},
    "019":{cidade:"Curitiba",estado:"PR"},"024a":{cidade:"Curitiba",estado:"PR"},
    "020":{cidade:"São José Dos Pinhais",estado:"PR"},"021":{cidade:"Colombo",estado:"PR"},
    "022":{cidade:"Porto Feliz",estado:"SP"},"023":{cidade:"Fazenda Rio Grande",estado:"PR"},
    "025":{cidade:"Fazenda Rio Grande",estado:"PR"},"026":{cidade:"Balneário Camboriú",estado:"SC"},
    "027":{cidade:"São Francisco Do Sul",estado:"SC"},"028":{cidade:"Piracicaba",estado:"SP"},
    "029":{cidade:"Curitiba",estado:"PR"},"030":{cidade:"Curitiba",estado:"PR"},
    "031":{cidade:"Maringá",estado:"PR"},"032":{cidade:"Campo Bom",estado:"RS"},
    "033":{cidade:"Viamão",estado:"RS"},"034":{cidade:"Curitiba",estado:"PR"},
    "035":{cidade:"São José Dos Pinhais",estado:"PR"},"036":{cidade:"Curitiba",estado:"PR"},
    "037":{cidade:"Gravataí",estado:"RS"},"038":{cidade:"Arapongas",estado:"PR"},
    "039":{cidade:"Joinville",estado:"SC"},"040":{cidade:"Curitiba",estado:"PR"},
    "041":{cidade:"Curitiba",estado:"PR"},"042":{cidade:"Porto Alegre",estado:"RS"},
    "043":{cidade:"Porto Alegre",estado:"RS"},"044":{cidade:"Viamão",estado:"RS"},
    "045":{cidade:"Curitiba",estado:"PR"},"046":{cidade:"Curitiba",estado:"PR"},
    "047":{cidade:"Viamão",estado:"RS"},"048":{cidade:"São Leopoldo",estado:"RS"},
    "049":{cidade:"Portão",estado:"RS"},"050":{cidade:"São Leopoldo",estado:"RS"},
    "051":{cidade:"São Bento do Sul",estado:"SC"},"052":{cidade:"Curitiba",estado:"PR"},
    "053":{cidade:"Curitiba",estado:"PR"},"054":{cidade:"Piracicaba",estado:"SP"},
    "055":{cidade:"Campinas",estado:"SP"},"056":{cidade:"Fazenda Rio Grande",estado:"PR"},
    "057":{cidade:"Curitiba",estado:"PR"},"058":{cidade:"Colombo",estado:"PR"},
    "059":{cidade:"Curitiba",estado:"PR"},"060":{cidade:"Valinhos",estado:"SP"},
    "061":{cidade:"Curitiba",estado:"PR"},"062":{cidade:"Curitiba",estado:"PR"},
    "063":{cidade:"Curitiba",estado:"PR"},"064":{cidade:"Piracicaba",estado:"SP"},
    "065":{cidade:"Criciúma",estado:"SC"},
  };
}
