// /api/seed-concorrentes.js
// Roda manualmente ou mensalmente via cron. Faz 3 coisas:
//   1) Geocoda os 64 postos via Nominatim (1 req/s) e popula tabela `postos`
//   2) Pra cada posto, busca concorrentes (amenity=fuel) num raio via Overpass
//   3) Persiste em `concorrentes_alvo`, filtrando os próprios postos Trapézio
//
// Variáveis de ambiente:
//   SUPABASE_URL
//   SUPABASE_SERVICE_KEY
//   CRON_SECRET

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const OVERPASS  = 'https://overpass-api.de/api/interpreter';
const UA = 'TrapezioPostos/1.0 (contato: ti@grupo-trapezio.com.br)'; // ATUALIZE com email real

// ─── Capitais brasileiras → raio menor ───────────────────────
const CAPITAIS = new Set([
  'Curitiba','Porto Alegre','Florianópolis','São Paulo','Rio de Janeiro',
  'Belo Horizonte','Brasília','Salvador','Fortaleza','Recife','Manaus',
  'Belém','Goiânia','São Luís','Maceió','Natal','Teresina','João Pessoa',
  'Aracaju','Cuiabá','Campo Grande','Vitória','Macapá','Rio Branco',
  'Porto Velho','Boa Vista','Palmas',
]);

// Cidades médias da sua rede (>200k hab aproximadas) — raio 5km
const CIDADES_MEDIAS = new Set([
  'São José Dos Pinhais','Canoas','Joinville','Maringá','Piracicaba',
  'Novo Hamburgo','Gravataí','Campinas','Colombo','São Leopoldo',
]);

function classificarPorte(cidade) {
  if (CAPITAIS.has(cidade)) return { porte:'capital', raio: 3 };
  if (CIDADES_MEDIAS.has(cidade)) return { porte:'media', raio: 5 };
  return { porte:'pequena', raio: 7 };
}

// ─── POSTOS da rede (mesma lista do front) ───────────────────
// Mantenha em sincronia! Idealmente, isso vira a fonte de verdade futuramente.
const POSTOS = [
  { id:'001', nome:'Posto Alfa', endereco:'Est Da Graciosa, 3253', cidade:'Colombo', estado:'PR', bandeira:'Ipiranga' },
  { id:'002', nome:'Posto Almirante Filial 02', endereco:'R Antonio Kaesemodel, 2339', cidade:'São Bento Do Sul', estado:'SC', bandeira:'Ipiranga' },
  { id:'003', nome:'Posto Almirante Filial 03', endereco:'Av. Getúlio Vargas, 2130', cidade:'São Leopoldo', estado:'RS', bandeira:'Ipiranga' },
  { id:'004', nome:'Posto Almirante Filial 04', endereco:'Av. Borges De Medeiros, 2205', cidade:'Porto Alegre', estado:'RS', bandeira:'Ipiranga' },
  { id:'005', nome:'Posto Almirante Filial 05', endereco:'Av. Primeiro De Marco, 4600', cidade:'Novo Hamburgo', estado:'RS', bandeira:'Ipiranga' },
  { id:'006', nome:'Posto Almirante Filial 06', endereco:'Av. Santos Ferreira, 2700', cidade:'Canoas', estado:'RS', bandeira:'Ipiranga' },
  { id:'007', nome:'Posto Almirante Filial 07', endereco:'Av. Do Nazario, 1024', cidade:'Canoas', estado:'RS', bandeira:'Ipiranga' },
  { id:'008', nome:'Posto Almirante Filial 08', endereco:'Av. Dorival Candido, 1460', cidade:'Gravataí', estado:'RS', bandeira:'Ipiranga' },
  { id:'009', nome:'Posto Almirante Filial 09', endereco:'Av. Luiz Pasteur, 4799', cidade:'Sapucaia Do Sul', estado:'RS', bandeira:'Ipiranga' },
  { id:'011', nome:'Posto Almirante Filial 11', endereco:'Av. Rui Barbosa, 4791', cidade:'São José Dos Pinhais', estado:'PR', bandeira:'Ipiranga' },
  { id:'012', nome:'Posto Almirante Filial 12', endereco:'Rod RS 240, 5280', cidade:'Portão', estado:'RS', bandeira:'Ipiranga' },
  { id:'013', nome:'Posto Almirante Filial 13 (São Dimas)', endereco:'Rua Presidente Faria, 116', cidade:'Colombo', estado:'PR', bandeira:'BR' },
  { id:'014', nome:'Posto Almirante Filial 14 (Rosas)', endereco:'Avenida Ely Correa, 5600', cidade:'Gravataí', estado:'RS', bandeira:'Ipiranga' },
  { id:'015', nome:'Posto Almirante Filial 15 (Gravo)', endereco:'Rua Porto Palmeira, 2509', cidade:'Araricá', estado:'RS', bandeira:'Ipiranga' },
  { id:'017', nome:'Posto Almirante Filial 17 (Gravi)', endereco:'R Jose Appelonio Da Costa, 2160', cidade:'Araricá', estado:'RS', bandeira:'Ipiranga' },
  { id:'018', nome:'Posto Almirante Filial 18 (Sapucaia)', endereco:'Av. Coronel Theodomiro, 885', cidade:'Sapucaia Do Sul', estado:'RS', bandeira:'Ipiranga' },
  { id:'019', nome:'Posto Almirante Filial 19 (San Michael)', endereco:'R. João Bettega, 3015', cidade:'Curitiba', estado:'PR', bandeira:'Ipiranga' },
  { id:'024a', nome:'Posto Almirante Filial 24 (Oceano)', endereco:'R Carlos Dietzsch, 1115', cidade:'Curitiba', estado:'PR', bandeira:'Ipiranga' },
  { id:'020', nome:'Posto Almirante Matriz', endereco:'Almirante Alexandrino, 1526', cidade:'São José Dos Pinhais', estado:'PR', bandeira:'Ipiranga' },
  { id:'021', nome:'Posto América', endereco:'Av. Marginal Jose de Anchieta, 956', cidade:'Colombo', estado:'PR', bandeira:'Ipiranga' },
  { id:'022', nome:'Posto Beira Rio', endereco:'Av. Armando de Sales Oliveira, 1101', cidade:'Porto Feliz', estado:'SP', bandeira:'BR' },
  { id:'023', nome:'Posto Brasil', endereco:'AV. Brasil, 846', cidade:'Fazenda Rio Grande', estado:'PR', bandeira:'Ipiranga' },
  { id:'025', nome:'Posto Cisne', endereco:'Avenida Portugal, 3205', cidade:'Fazenda Rio Grande', estado:'PR', bandeira:'BR' },
  { id:'026', nome:'Posto Dom Afonso', endereco:'R. Dom Afonso, 680', cidade:'Balneário Camboriú', estado:'SC', bandeira:'Ipiranga' },
  { id:'027', nome:'Posto Duque De Caxias', endereco:'Rodovia Duque De Caxias, SC301', cidade:'São Francisco Do Sul', estado:'SC', bandeira:'Ipiranga' },
  { id:'028', nome:'Posto Estaiada', endereco:'Av. Cristovao Colombo, 2935', cidade:'Piracicaba', estado:'SP', bandeira:'Shell' },
  { id:'029', nome:'Posto Izaac', endereco:'Rua Izaac Ferreira Da Cruz, 1497', cidade:'Curitiba', estado:'PR', bandeira:'Trapézio' },
  { id:'030', nome:'Posto Linha Verde Filial 02', endereco:'Av. Marechal Floriano Peixoto, 7825', cidade:'Curitiba', estado:'PR', bandeira:'Ipiranga' },
  { id:'031', nome:'Posto Linha Verde Filial 03 (Palmares)', endereco:'Av. Dos Palmares, 20', cidade:'Maringá', estado:'PR', bandeira:'Ipiranga' },
  { id:'032', nome:'Posto Linha Verde Filial 04', endereco:'Av. Dos Estados, 2435', cidade:'Campo Bom', estado:'RS', bandeira:'Ipiranga' },
  { id:'033', nome:'Posto Linha Verde Filial 05', endereco:'Av. Sen. Salgado Filho, 7277', cidade:'Viamão', estado:'RS', bandeira:'Ipiranga' },
  { id:'034', nome:'Posto Linha Verde Filial 06 (Makiolka)', endereco:'Rua Theodoro Makiolka, 3115', cidade:'Curitiba', estado:'PR', bandeira:'BR' },
  { id:'035', nome:'Posto Linha Verde Filial 07 (Borda)', endereco:'Rua Estela Mari Rezende, 10789', cidade:'São José Dos Pinhais', estado:'PR', bandeira:'Ipiranga' },
  { id:'036', nome:'Posto Linha Verde Filial 10 (Petrus)', endereco:'Rua Das Carmelitas, 2963', cidade:'Curitiba', estado:'PR', bandeira:'Shell' },
  { id:'037', nome:'Posto Linha Verde Filial 11', endereco:'Av. Dorival Cândido, 2029', cidade:'Gravataí', estado:'RS', bandeira:'Ipiranga' },
  { id:'038', nome:'Posto Linha Verde Filial 13 (Gonçales)', endereco:'Rua Uirapuru, 1901', cidade:'Arapongas', estado:'PR', bandeira:'Ipiranga' },
  { id:'039', nome:'Posto Linha Verde Filial 14 (Marques)', endereco:'Rua Marques De Olinda, 2385', cidade:'Joinville', estado:'SC', bandeira:'Shell' },
  { id:'040', nome:'Posto Linha Verde Filial 15 (Lustosa)', endereco:'Rua Duque De Caxias, 399', cidade:'Curitiba', estado:'PR', bandeira:'Trapézio' },
  { id:'041', nome:'Posto Linha Verde Filial 16 (Bairro Novo)', endereco:'R. Tijucas Do Sul, 1963', cidade:'Curitiba', estado:'PR', bandeira:'Trapézio' },
  { id:'042', nome:'Posto Linha Verde Filial 18 (4Z)', endereco:'Av. Farrapos, 858', cidade:'Porto Alegre', estado:'RS', bandeira:'Ipiranga' },
  { id:'043', nome:'Posto Linha Verde Filial 20 (3Z)', endereco:'Av. Saturnino De Brito, 1018', cidade:'Porto Alegre', estado:'RS', bandeira:'Ipiranga' },
  { id:'044', nome:'Posto Linha Verde Filial 21 (BV)', endereco:'Est. João Oliveira Remião, 7810', cidade:'Viamão', estado:'RS', bandeira:'Shell' },
  { id:'045', nome:'Posto Linha Verde Filial 22 (Trapézio)', endereco:'Rua Raul Pompeia, 1350', cidade:'Curitiba', estado:'PR', bandeira:'BR' },
  { id:'046', nome:'Posto Linha Verde Filial 23 (Angra Batel)', endereco:'Av. Sete De Setembro, 4814', cidade:'Curitiba', estado:'PR', bandeira:'Ipiranga' },
  { id:'047', nome:'Posto Linha Verde Filial 24 (Branquinha)', endereco:'Est. Bérico José Bernardes, 142', cidade:'Viamão', estado:'RS', bandeira:'Trapézio' },
  { id:'048', nome:'Posto Linha Verde Filial 25', endereco:'Av. São Borja, 2035', cidade:'São Leopoldo', estado:'RS', bandeira:'BR' },
  { id:'049', nome:'Posto Linha Verde Filial 26', endereco:'RS-240, 8092', cidade:'Portão', estado:'RS', bandeira:'Shell' },
  { id:'050', nome:'Posto Linha Verde Filial 27', endereco:'R Visconde De São Leopoldo, 620', cidade:'São Leopoldo', estado:'RS', bandeira:'Trapézio' },
  { id:'051', nome:'Posto Linha Verde Filial 28 (RDP)', endereco:'Rua das Neves, 2112', cidade:'São Bento do Sul', estado:'SC', bandeira:'RDP' },
  { id:'052', nome:'Posto Linha Verde Matriz', endereco:'Km 79 BR-116', cidade:'Curitiba', estado:'PR', bandeira:'Ipiranga' },
  { id:'053', nome:'Posto Marechal', endereco:'Av. Manoel Ribas, 8051', cidade:'Curitiba', estado:'PR', bandeira:'Shell' },
  { id:'054', nome:'Posto Mirante Piracicaba', endereco:'Av. Barão De Serra Negra, 101', cidade:'Piracicaba', estado:'SP', bandeira:'Shell' },
  { id:'055', nome:'Posto Neninha', endereco:'Av. das Amoreiras, 2062', cidade:'Campinas', estado:'SP', bandeira:'Trapézio' },
  { id:'056', nome:'Posto NSA', endereco:'Rua Sao Romualdo, 778', cidade:'Fazenda Rio Grande', estado:'PR', bandeira:'Ipiranga' },
  { id:'057', nome:'Posto Premiere', endereco:'Rua Prof. Pedro Viriato P Souza, 1846', cidade:'Curitiba', estado:'PR', bandeira:'Shell' },
  { id:'058', nome:'Posto Rio Verde', endereco:'Avenida Argentina, 324', cidade:'Colombo', estado:'PR', bandeira:'Ipiranga' },
  { id:'059', nome:'Posto Tijucas', endereco:'Rua Izaac Ferreira Da Cruz, 2920', cidade:'Curitiba', estado:'PR', bandeira:'BR' },
  { id:'060', nome:'Posto TOF', endereco:'Av. dos Esportes, 1092', cidade:'Valinhos', estado:'SP', bandeira:'TOF' },
  { id:'061', nome:'Posto Triangulo', endereco:'Rua Sao Salvador, 360', cidade:'Curitiba', estado:'PR', bandeira:'BR' },
  { id:'062', nome:'Posto TS', endereco:'Av. Anita Garibaldi, 1305', cidade:'Curitiba', estado:'PR', bandeira:'Shell' },
  { id:'063', nome:'Posto Via Torres', endereco:'Comendador Franco, 3133', cidade:'Curitiba', estado:'PR', bandeira:'BR' },
  { id:'064', nome:'Posto Vila Resende', endereco:'Av. Dona Francisca, 549', cidade:'Piracicaba', estado:'SP', bandeira:'Shell' },
  { id:'065', nome:'Posto WC', endereco:'Rod BR-101, 8600', cidade:'Criciúma', estado:'SC', bandeira:'Ipiranga' },
];

// ─── Helpers ─────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

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
  return r.status === 204 ? null : r.json();
}

function distanciaKm(lat1, lng1, lat2, lng2) {
  const toRad = x => x * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Normaliza nome para detectar postos Trapézio (evitar listar como concorrente)
function normalizar(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
}

function ehPostoProprio(nome, latC, lngC, postosProprios) {
  const norm = normalizar(nome);
  // 1) Match por nome
  for (const p of postosProprios) {
    if (norm && norm.includes(normalizar(p.nome).slice(0, 12))) return true;
  }
  // 2) Match por GPS muito próximo (< 100m) — provavelmente é o próprio
  for (const p of postosProprios) {
    if (!p.lat || !p.lng) continue;
    if (distanciaKm(latC, lngC, parseFloat(p.lat), parseFloat(p.lng)) < 0.1) return true;
  }
  return false;
}

// ─── Geocoding via Nominatim ─────────────────────────────────
async function geocodar(posto) {
  // Query: "endereco, cidade, estado, Brasil"
  const q = `${posto.endereco}, ${posto.cidade}, ${posto.estado}, Brasil`;
  const url = `${NOMINATIM}?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=br`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR' } });
  if (!r.ok) throw new Error(`Nominatim ${r.status}`);
  const arr = await r.json();
  if (!arr.length) {
    // Fallback: tenta sem o endereço, só cidade+estado
    const url2 = `${NOMINATIM}?q=${encodeURIComponent(posto.cidade + ', ' + posto.estado + ', Brasil')}&format=json&limit=1&countrycodes=br`;
    const r2 = await fetch(url2, { headers: { 'User-Agent': UA, 'Accept-Language': 'pt-BR' } });
    const arr2 = await r2.json();
    if (!arr2.length) return null;
    return { lat: parseFloat(arr2[0].lat), lng: parseFloat(arr2[0].lon), aproximado: true };
  }
  return { lat: parseFloat(arr[0].lat), lng: parseFloat(arr[0].lon), aproximado: false };
}

// ─── Busca concorrentes via Overpass ─────────────────────────
async function buscarConcorrentes(lat, lng, raioKm) {
  const raioM = Math.round(raioKm * 1000);
  // Query Overpass QL: postos de gasolina num raio
  const ql = `
    [out:json][timeout:25];
    (
      node["amenity"="fuel"](around:${raioM},${lat},${lng});
      way["amenity"="fuel"](around:${raioM},${lat},${lng});
    );
    out center tags;
  `;

  // Tenta até 3x (Overpass às vezes responde 504/timeout)
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const r = await fetch(OVERPASS, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain', 'User-Agent': UA },
        body: ql,
      });
      if (!r.ok) {
        if (tentativa < 3) { await sleep(2000 * tentativa); continue; }
        throw new Error(`Overpass ${r.status}`);
      }
      const data = await r.json();
      return data.elements || [];
    } catch (e) {
      if (tentativa < 3) { await sleep(2000 * tentativa); continue; }
      throw e;
    }
  }
  return [];
}

// ─── Handler ─────────────────────────────────────────────────
export default async function handler(req, res) {
  const auth = req.headers['authorization'] || '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  // Modo: 'full' refaz tudo, 'novos' só faz postos sem lat/lng
  const modo = (req.query?.modo || 'novos').toString();

  const log = [];
  const stats = { geocoded: 0, concorrentes_inseridos: 0, erros: 0 };

  try {
    // 1) GEOCODING ──────────────────────────────────────────
    log.push('=== Etapa 1: geocoding ===');

    // Carrega o que já existe no banco
    const existentes = await sb('postos?select=id,lat,lng');
    const mapaExist = {};
    for (const p of existentes) mapaExist[p.id] = p;

    const postosFinais = [];

    for (const posto of POSTOS) {
      const existe = mapaExist[posto.id];
      const { porte, raio } = classificarPorte(posto.cidade);

      // Pula se já tem lat/lng e modo=novos
      if (modo === 'novos' && existe && existe.lat && existe.lng) {
        postosFinais.push({ ...posto, lat: parseFloat(existe.lat), lng: parseFloat(existe.lng), porte, raio });
        continue;
      }

      try {
        const geo = await geocodar(posto);
        if (!geo) {
          log.push(`✗ ${posto.id} ${posto.nome}: não geocodou`);
          stats.erros++;
          // Persiste mesmo sem lat/lng pra registrar tentativa
          await sb('postos', {
            method: 'POST',
            headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
            body: JSON.stringify({
              id: posto.id, nome: posto.nome, endereco: posto.endereco,
              cidade: posto.cidade, estado: posto.estado, bandeira: posto.bandeira,
              porte_cidade: porte, raio_busca_km: raio,
            }),
          });
          await sleep(1100); // respeita rate limit mesmo em falha
          continue;
        }

        log.push(`✓ ${posto.id} ${posto.nome} → ${geo.lat.toFixed(5)}, ${geo.lng.toFixed(5)}${geo.aproximado?' (aprox)':''}`);
        stats.geocoded++;

        await sb('postos', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify({
            id: posto.id, nome: posto.nome, endereco: posto.endereco,
            cidade: posto.cidade, estado: posto.estado, bandeira: posto.bandeira,
            lat: geo.lat, lng: geo.lng,
            porte_cidade: porte, raio_busca_km: raio,
            geocoded_em: new Date().toISOString(),
          }),
        });

        postosFinais.push({ ...posto, lat: geo.lat, lng: geo.lng, porte, raio });

        await sleep(1100); // 1 req/segundo conforme política do Nominatim
      } catch (e) {
        log.push(`✗ ${posto.id}: ${e.message}`);
        stats.erros++;
        await sleep(1100);
      }
    }

    // 2) BUSCA DE CONCORRENTES ──────────────────────────────
    log.push('');
    log.push('=== Etapa 2: descoberta de concorrentes ===');

    for (const p of postosFinais) {
      if (!p.lat || !p.lng) continue;

      try {
        const elementos = await buscarConcorrentes(p.lat, p.lng, p.raio);
        let inseridos = 0;

        for (const el of elementos) {
          const elLat = el.lat ?? el.center?.lat;
          const elLng = el.lon ?? el.center?.lon;
          if (!elLat || !elLng) continue;

          const tags = el.tags || {};
          const nome = tags.name || tags.brand || tags['operator'] || 'Posto sem nome';
          const marca = tags.brand || null;
          const endereco = [
            tags['addr:street'],
            tags['addr:housenumber'],
            tags['addr:suburb'],
            tags['addr:city'],
          ].filter(Boolean).join(', ') || null;

          // Filtra próprios postos
          if (ehPostoProprio(nome, elLat, elLng, postosFinais)) continue;

          const dist = distanciaKm(p.lat, p.lng, elLat, elLng);

          try {
            await sb('concorrentes_alvo?on_conflict=posto_id,osm_id,osm_type', {
              method: 'POST',
              headers: { 'Prefer': 'resolution=merge-duplicates,return=minimal' },
              body: JSON.stringify({
                posto_id: p.id,
                nome, marca, endereco,
                lat: elLat, lng: elLng,
                distancia_km: +dist.toFixed(2),
                osm_id: el.id || null,
                osm_type: el.type || null,
                atualizado_em: new Date().toISOString(),
              }),
            });
            inseridos++;
            stats.concorrentes_inseridos++;
          } catch (e) {
            // duplicata silencia
          }
        }

        log.push(`✓ ${p.id} ${p.nome} (${p.raio}km): ${inseridos} concorrentes`);

        // Overpass não tem rate limit estrito mas vamos ser educados
        await sleep(1500);
      } catch (e) {
        log.push(`✗ ${p.id} busca falhou: ${e.message}`);
        stats.erros++;
        await sleep(3000); // backoff maior em erro
      }
    }

    return res.status(200).json({ ok: true, stats, log });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message, log });
  }
}
