const CONFIG = {
  SUPABASE_URL: 'https://rpuiptwlmomwbjcmnwbd.supabase.co',
  SUPABASE_KEY: 'sb_publishable_SL_hHlR1S1nFDAlMUN7Fzg_qvuWcmmW',
  ANTHROPIC_KEY: '',
  N8N_WEBHOOK: 'https://SEU_N8N/webhook/trapezio',
};

const POSTOS = [
  {id:'001',nome:'Posto Alfa',endereco:'Est Da Graciosa, 3253',cidade:'Colombo',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'002',nome:'Posto Almirante Filial 02',endereco:'R Antonio Kaesemodel, 2339',cidade:'São Bento Do Sul',estado:'SC',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'003',nome:'Posto Almirante Filial 03',endereco:'Av. Getúlio Vargas, 2130',cidade:'São Leopoldo',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'004',nome:'Posto Almirante Filial 04',endereco:'Av. Borges De Medeiros, 2205',cidade:'Porto Alegre',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'005',nome:'Posto Almirante Filial 05',endereco:'Av. Primeiro De Marco, 4600',cidade:'Novo Hamburgo',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'006',nome:'Posto Almirante Filial 06',endereco:'Av. Santos Ferreira, 2700',cidade:'Canoas',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'007',nome:'Posto Almirante Filial 07',endereco:'Av. Do Nazario, 1024',cidade:'Canoas',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'008',nome:'Posto Almirante Filial 08',endereco:'Av. Dorival Candido, 1460',cidade:'Gravataí',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'009',nome:'Posto Almirante Filial 09',endereco:'Av. Luiz Pasteur, 4799',cidade:'Sapucaia Do Sul',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'011',nome:'Posto Almirante Filial 11',endereco:'Av. Rui Barbosa, 4791',cidade:'São José Dos Pinhais',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'012',nome:'Posto Almirante Filial 12',endereco:'Rod RS 240, 5280',cidade:'Portão',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'013',nome:'Posto Almirante Filial 13 (São Dimas)',endereco:'Rua Presidente Faria, 116',cidade:'Colombo',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'014',nome:'Posto Almirante Filial 14 (Rosas)',endereco:'Avenida Ely Correa, 5600',cidade:'Gravataí',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'015',nome:'Posto Almirante Filial 15 (Gravo)',endereco:'Rua Porto Palmeira, 2509',cidade:'Araricá',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'017',nome:'Posto Almirante Filial 17 (Gravi)',endereco:'R Jose Appelonio Da Costa, 2160',cidade:'Araricá',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'018',nome:'Posto Almirante Filial 18 (Sapucaia)',endereco:'Av. Coronel Theodomiro, 885',cidade:'Sapucaia Do Sul',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'019',nome:'Posto Almirante Filial 19 (San Michael)',endereco:'R. João Bettega, 3015',cidade:'Curitiba',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'024a',nome:'Posto Almirante Filial 24 (Oceano)',endereco:'R Carlos Dietzsch, 1115',cidade:'Curitiba',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'020',nome:'Posto Almirante Matriz',endereco:'Almirante Alexandrino, 1526',cidade:'São José Dos Pinhais',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'021',nome:'Posto América',endereco:'Av. Marginal Jose de Anchieta, 956',cidade:'Colombo',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'022',nome:'Posto Beira Rio',endereco:'Av. Armando de Sales Oliveira, 1101',cidade:'Porto Feliz',estado:'SP',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'023',nome:'Posto Brasil',endereco:'AV. Brasil, 846',cidade:'Fazenda Rio Grande',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'025',nome:'Posto Cisne',endereco:'Avenida Portugal, 3205',cidade:'Fazenda Rio Grande',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'026',nome:'Posto Dom Afonso',endereco:'R. Dom Afonso, 680',cidade:'Balneário Camboriú',estado:'SC',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'027',nome:'Posto Duque De Caxias',endereco:'Rodovia Duque De Caxias, SC301',cidade:'São Francisco Do Sul',estado:'SC',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'028',nome:'Posto Estaiada',endereco:'Av. Cristovao Colombo, 2935',cidade:'Piracicaba',estado:'SP',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'029',nome:'Posto Izaac',endereco:'Rua Izaac Ferreira Da Cruz, 1497',cidade:'Curitiba',estado:'PR',bandeira:'Trapézio',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'030',nome:'Posto Linha Verde Filial 02',endereco:'Av. Marechal Floriano Peixoto, 7825',cidade:'Curitiba',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'031',nome:'Posto Linha Verde Filial 03 (Palmares)',endereco:'Av. Dos Palmares, 20',cidade:'Maringá',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'032',nome:'Posto Linha Verde Filial 04',endereco:'Av. Dos Estados, 2435',cidade:'Campo Bom',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'033',nome:'Posto Linha Verde Filial 05',endereco:'Av. Sen. Salgado Filho, 7277',cidade:'Viamão',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'034',nome:'Posto Linha Verde Filial 06 (Makiolka)',endereco:'Rua Theodoro Makiolka, 3115',cidade:'Curitiba',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'035',nome:'Posto Linha Verde Filial 07 (Borda)',endereco:'Rua Estela Mari Rezende, 10789',cidade:'São José Dos Pinhais',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'036',nome:'Posto Linha Verde Filial 10 (Petrus)',endereco:'Rua Das Carmelitas, 2963',cidade:'Curitiba',estado:'PR',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'037',nome:'Posto Linha Verde Filial 11',endereco:'Av. Dorival Cândido, 2029',cidade:'Gravataí',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'038',nome:'Posto Linha Verde Filial 13 (Gonçales)',endereco:'Rua Uirapuru, 1901',cidade:'Arapongas',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'039',nome:'Posto Linha Verde Filial 14 (Marques)',endereco:'Rua Marques De Olinda, 2385',cidade:'Joinville',estado:'SC',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'040',nome:'Posto Linha Verde Filial 15 (Lustosa)',endereco:'Rua Duque De Caxias, 399',cidade:'Curitiba',estado:'PR',bandeira:'Trapézio',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'041',nome:'Posto Linha Verde Filial 16 (Bairro Novo)',endereco:'R. Tijucas Do Sul, 1963',cidade:'Curitiba',estado:'PR',bandeira:'Trapézio',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'042',nome:'Posto Linha Verde Filial 18 (4Z)',endereco:'Av. Farrapos, 858',cidade:'Porto Alegre',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'043',nome:'Posto Linha Verde Filial 20 (3Z)',endereco:'Av. Saturnino De Brito, 1018',cidade:'Porto Alegre',estado:'RS',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'044',nome:'Posto Linha Verde Filial 21 (BV)',endereco:'Est. João Oliveira Remião, 7810',cidade:'Viamão',estado:'RS',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'045',nome:'Posto Linha Verde Filial 22 (Trapézio)',endereco:'Rua Raul Pompeia, 1350',cidade:'Curitiba',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'046',nome:'Posto Linha Verde Filial 23 (Angra Batel)',endereco:'Av. Sete De Setembro, 4814',cidade:'Curitiba',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'047',nome:'Posto Linha Verde Filial 24 (Branquinha)',endereco:'Est. Bérico José Bernardes, 142',cidade:'Viamão',estado:'RS',bandeira:'Trapézio',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'048',nome:'Posto Linha Verde Filial 25',endereco:'Av. São Borja, 2035',cidade:'São Leopoldo',estado:'RS',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'049',nome:'Posto Linha Verde Filial 26',endereco:'RS-240, 8092',cidade:'Portão',estado:'RS',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'050',nome:'Posto Linha Verde Filial 27',endereco:'R Visconde De São Leopoldo, 620',cidade:'São Leopoldo',estado:'RS',bandeira:'Trapézio',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'051',nome:'Posto Linha Verde Filial 28 (RDP)',endereco:'Rua das Neves, 2112',cidade:'São Bento do Sul',estado:'SC',bandeira:'RDP',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'052',nome:'Posto Linha Verde Matriz',endereco:'Km 79 BR-116',cidade:'Curitiba',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'053',nome:'Posto Marechal',endereco:'Av. Manoel Ribas, 8051',cidade:'Curitiba',estado:'PR',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'054',nome:'Posto Mirante Piracicaba',endereco:'Av. Barão De Serra Negra, 101',cidade:'Piracicaba',estado:'SP',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'055',nome:'Posto Neninha',endereco:'Av. das Amoreiras, 2062',cidade:'Campinas',estado:'SP',bandeira:'Trapézio',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'056',nome:'Posto NSA',endereco:'Rua Sao Romualdo, 778',cidade:'Fazenda Rio Grande',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'057',nome:'Posto Premiere',endereco:'Rua Prof. Pedro Viriato P Souza, 1846',cidade:'Curitiba',estado:'PR',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'058',nome:'Posto Rio Verde',endereco:'Avenida Argentina, 324',cidade:'Colombo',estado:'PR',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'059',nome:'Posto Tijucas',endereco:'Rua Izaac Ferreira Da Cruz, 2920',cidade:'Curitiba',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'060',nome:'Posto TOF',endereco:'Av. dos Esportes, 1092',cidade:'Valinhos',estado:'SP',bandeira:'TOF',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'061',nome:'Posto Triangulo',endereco:'Rua Sao Salvador, 360',cidade:'Curitiba',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'062',nome:'Posto TS',endereco:'Av. Anita Garibaldi, 1305',cidade:'Curitiba',estado:'PR',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'063',nome:'Posto Via Torres',endereco:'Comendador Franco, 3133',cidade:'Curitiba',estado:'PR',bandeira:'BR',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'064',nome:'Posto Vila Resende',endereco:'Av. Dona Francisca, 549',cidade:'Piracicaba',estado:'SP',bandeira:'Shell',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'065',nome:'Posto WC',endereco:'Rod BR-101, 8600',cidade:'Criciúma',estado:'SC',bandeira:'Ipiranga',precos:{gc:0,ga:0,et:0,ds:0}},
  {id:'066',nome:'Auto Posto Alphaville',endereco:'Estrada da Graciosa, 554, Atuba',cidade:'Pinhais',estado:'PR',bandeira:'Petrobras',precos:{gc:0,ga:0,et:0,ds:0}},
];

const COMBUSTIVEIS=[
  {key:'gc',label:'Gasolina Comum'},
  {key:'ga',label:'Gasolina Aditivada'},
  {key:'et',label:'Etanol'},
  {key:'eta',label:'Etanol Aditivado'},
  {key:'ds',label:'Diesel S10'},
  {key:'ds500',label:'Diesel S500'},
  {key:'dsa',label:'Diesel S10 Aditivado'},
];

const BANDEIRAS=['Ipiranga','Shell','BR','Petrobras','Raízen','Bandeira Branca','Outros'];
const BANDEIRA_BADGE={
  'Ipiranga':'badge-ipiranga','Shell':'badge-shell','BR':'badge-br',
  'Petrobras':'badge-br','Raízen':'badge-br',
  'Bandeira Branca':'badge-branca','Outros':'badge-outros'
};

// Estado global
let state={
  tela:'selector',posto:null,registros:[],
  form:{nome:'',bandeira:'Bandeira Branca',gc:'',ga:'',et:'',eta:'',ds:'',ds500:'',dsa:'',
    obs:'',imgPreview:null,imgFile:null,iaUsada:false,erroIA:false,loading:false,
    dropOpen:false,lat:'',lng:'',locStatus:'',precosIA:{},camposEditados:{},
    fotoProprioPreview:null},
};
let _fotoFile=null;
let _fotoProprioFile=null;

// Histórico de concorrentes
function getHistorico(postoId){
  try{const h=localStorage.getItem('hist_'+postoId);return h?JSON.parse(h):[]}catch(e){return[]}
}
function salvarHistorico(postoId,nome,bandeira){
  try{
    const h=getHistorico(postoId);
    if(!h.find(c=>c.nome===nome)){
      h.unshift({nome,bandeira});
      if(h.length>20)h.pop();
      localStorage.setItem('hist_'+postoId,JSON.stringify(h));
    }
  }catch(e){}
}

// Helpers
function slugify(s){
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}
function getPostoFromURL(){
  const p=new URLSearchParams(location.search).get('posto');
  if(!p)return null;
  return POSTOS.find(x=>x.id===p)||POSTOS.find(x=>slugify(x.nome)===p)||null;
}
function calcStatus(nosso,deles){
  const d=nosso-deles;
  if(d>0.05)return{label:`+R$ ${d.toFixed(2)} acima`,cls:'badge-red',cor:'#a32d2d'};
  if(d<-0.05)return{label:`R$ ${Math.abs(d).toFixed(2)} abaixo`,cls:'badge-green',cor:'#3b6d11'};
  return{label:'Na média',cls:'badge-amber',cor:'#854f0b'};
}
function hoje(){return new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'})}
function hora(){return new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}
function render(){document.getElementById('app').innerHTML=views[state.tela]()}

// Validação de preços
function validarPrecos(f){
  const alertas=[];
  const gc=parseFloat(f.gc)||0,ga=parseFloat(f.ga)||0;
  const et=parseFloat(f.et)||0,eta=parseFloat(f.eta)||0;
  if(et>0&&gc>0&&et>=gc) alertas.push('Etanol (R$'+et.toFixed(2)+') deveria ser mais barato que Gasolina Comum (R$'+gc.toFixed(2)+')');
  if(ga>0&&gc>0&&ga<gc) alertas.push('Gasolina Aditivada (R$'+ga.toFixed(2)+') deveria ser ≥ Gasolina Comum (R$'+gc.toFixed(2)+')');
  if(eta>0&&et>0&&eta<et) alertas.push('Etanol Aditivado (R$'+eta.toFixed(2)+') deveria ser ≥ Etanol Comum (R$'+et.toFixed(2)+')');
  if(eta>0&&et>0&&Math.abs(eta-et)>0.50) alertas.push('Etanol Aditivado (R$'+eta.toFixed(2)+') parece distante do Etanol Comum (R$'+et.toFixed(2)+')');
  return alertas;
}

// Melhora imagem
async function melhorarImagem(file){
  return new Promise(res=>{
    const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{
      const canvas=document.createElement('canvas');
      const esc=Math.min(1200/img.width,1200/img.height,2);
      canvas.width=img.width*esc;canvas.height=img.height*esc;
      const ctx=canvas.getContext('2d');
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const id=ctx.getImageData(0,0,canvas.width,canvas.height),d=id.data;
      let tb=0;
      for(let i=0;i<d.length;i+=16)tb+=(d[i]+d[i+1]+d[i+2])/3;
      const bm=tb/(d.length/16);
      if(bm<80){for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,d[i]*2+40);d[i+1]=Math.min(255,d[i+1]*2+40);d[i+2]=Math.min(255,d[i+2]*2+40)}}
      else if(bm<120){for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,d[i]*1.4+15);d[i+1]=Math.min(255,d[i+1]*1.4+15);d[i+2]=Math.min(255,d[i+2]*1.4+15)}}
      else if(bm>200){for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,Math.max(0,(d[i]-128)*1.4+100));d[i+1]=Math.min(255,Math.max(0,(d[i+1]-128)*1.4+100));d[i+2]=Math.min(255,Math.max(0,(d[i+2]-128)*1.4+100))}}
      else if(bm>160){for(let i=0;i<d.length;i+=4){d[i]=Math.min(255,Math.max(0,(d[i]-128)*1.2+110));d[i+1]=Math.min(255,Math.max(0,(d[i+1]-128)*1.2+110));d[i+2]=Math.min(255,Math.max(0,(d[i+2]-128)*1.2+110))}}
      ctx.putImageData(id,0,0);
      URL.revokeObjectURL(url);
      canvas.toBlob(blob=>res(blob||file),'image/jpeg',0.92);
    };
    img.onerror=()=>res(file);
    img.src=url;
  });
}

// OCR
async function lerFotoComIA(file){
  const otimizada=await melhorarImagem(file);
  const b64=await new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result.split(',')[1]);
    r.onerror=rej;
    r.readAsDataURL(otimizada);
  });
  const resp=await fetch('/api/ocr',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:b64,mediaType:file.type||'image/jpeg'})});
  const data=await resp.json();
  if(data.error)throw new Error(data.error);
  return data;
}

// Upload foto
async function uploadFoto(file,postoId,tipo){
  try{
    const ext=file.type==='image/png'?'png':'jpg';
    const nome=`${postoId}/${tipo}_${Date.now()}.${ext}`;
    const resp=await fetch(`${CONFIG.SUPABASE_URL}/storage/v1/object/fotos/${nome}`,{
      method:'POST',
      headers:{'Authorization':`Bearer ${CONFIG.SUPABASE_KEY}`,'apikey':CONFIG.SUPABASE_KEY,'Content-Type':file.type,'x-upsert':'true'},
      body:file,
    });
    const result=await resp.json();
    if(!resp.ok)throw new Error(JSON.stringify(result));
    return`${CONFIG.SUPABASE_URL}/storage/v1/object/public/fotos/${nome}`;
  }catch(e){console.error('Upload erro:',e);return null}
}

// Supabase
async function salvarSupabase(registro){
  try{
    await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/registros`,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':CONFIG.SUPABASE_KEY,'Authorization':`Bearer ${CONFIG.SUPABASE_KEY}`,'Prefer':'return=minimal'},
      body:JSON.stringify({
        posto_id:state.posto.id,
        concorrente_nome:registro.nome,
        concorrente_bandeira:registro.bandeira,
        gc:registro.gc?parseFloat(registro.gc):null,
        ga:registro.ga?parseFloat(registro.ga):null,
        et:registro.et?parseFloat(registro.et):null,
        eta:registro.eta?parseFloat(registro.eta):null,
        ds:registro.ds?parseFloat(registro.ds):null,
        ds500:registro.ds500?parseFloat(registro.ds500):null,
        dsa:registro.dsa?parseFloat(registro.dsa):null,
        observacoes:registro.obs||null,
        ia_usada:registro.iaUsada||false,
        lat:registro.lat||null,
        lng:registro.lng||null,
        foto_url:registro.fotoUrl||null,
        foto_proprio_url:registro.fotoProprioUrl||null,
        campos_editados:registro.camposEditados?Object.keys(registro.camposEditados).join(','):null,
      }),
    });
    console.log('Salvo!');
  }catch(e){console.warn('Supabase erro:',e)}
}

// Busca posto próximo
async function buscarPostoProximo(lat,lng){
  try{
    const q=`[out:json][timeout:10];node(around:300,${lat},${lng})[amenity=fuel];out body 3;`;
    const resp=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:q});
    const data=await resp.json();
    if(!data.elements||!data.elements.length)return null;
    const tags=data.elements[0].tags||{};
    const nome=tags.name||tags.brand||tags.operator||null;
    const marca=(tags.brand||tags.name||'').toLowerCase();
    const map={'ipiranga':'Ipiranga','shell':'Shell','br ':'BR','petrobras':'Petrobras','raizen':'Raízen','raízen':'Raízen'};
    let bandeira=null;
    for(const[k,v]of Object.entries(map)){if(marca.includes(k)){bandeira=v;break}}
    return{nome,bandeira};
  }catch(e){return null}
}

// Views
const views={
  selector(){
    return`<div class="header">
      <div class="label">Grupo Trapézio</div>
      <div class="title">Selecione seu posto</div>
      <div class="sub">Na versão final, seu link já abre direto aqui</div>
    </div>
    <div class="alert-blue">Use o link do WhatsApp para acessar direto no seu posto.</div>
    ${POSTOS.map(p=>`
      <button class="reg-card" style="width:100%;text-align:left;cursor:pointer;display:flex;justify-content:space-between;align-items:center;" onclick="selecionarPosto('${p.id}')">
        <div>
          <div style="font-weight:500;font-size:14px;margin-bottom:2px;">${p.nome}</div>
          <div class="sub">${p.cidade}, ${p.estado}</div>
          <div class="sub" style="font-size:11px;">${p.endereco}</div>
        </div>
        <span class="badge ${BANDEIRA_BADGE[p.bandeira]||'badge-outros'}">${p.bandeira}</span>
      </button>`).join('')}`;
  },

  lista(){
    const p=state.posto,regs=state.registros,meta=regs.length>=7;
    return`<div class="header">
      <div class="card" style="margin-bottom:1.25rem;">
        <div class="header-row">
          <div>
            <div class="label">${p.estado} · ${p.cidade}</div>
            <div class="title">${p.nome}</div>
            <div class="sub">${hoje()}</div>
          </div>
          <div style="text-align:right;">
            <span class="badge ${BANDEIRA_BADGE[p.bandeira]||'badge-outros'}">${p.bandeira}</span>
            <br><button class="btn-small" style="margin-top:6px;" onclick="trocarPosto()">trocar</button>
          </div>
        </div>
      </div>
    </div>
    <div class="status-bar">
      <div class="card-gray">
        <div class="label">Registrados</div>
        <div style="font-size:22px;font-weight:500;">${regs.length} <span style="font-size:13px;font-weight:400;color:${meta?'#3b6d11':'#9c9a92'};">/ 7+</span></div>
      </div>
      <div class="card-gray" style="${meta?'background:#eaf3de;border:0.5px solid #639922;':''}">
        <div class="label" style="${meta?'color:#3b6d11;':''}">Status</div>
        <div style="font-size:15px;font-weight:500;color:${meta?'#3b6d11':'#1a1a18'};">${regs.length===0?'Aguardando':meta?'Meta atingida':'Em andamento'}</div>
      </div>
    </div>
    ${regs.length===0
      ?`<div class="empty">Nenhum concorrente registrado ainda hoje.<br><span style="font-size:12px;color:#9c9a92;">Toque no botão abaixo para começar.</span></div>`
      :regs.map(r=>`
        <div class="reg-card">
          <div class="reg-header">
            <div>
              <div style="font-weight:500;font-size:14px;">${r.nome}</div>
              <div class="sub">${r.hora} · <span class="badge ${BANDEIRA_BADGE[r.bandeira]||'badge-outros'}" style="font-size:10px;">${r.bandeira}</span></div>
            </div>
            ${r.imgPreview?`<img src="${r.imgPreview}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;">`:''}
          </div>
          <div class="reg-tags">
            ${COMBUSTIVEIS.filter(c=>r[c.key]).map(c=>`<span class="badge badge-gray" style="font-size:10px;">${c.label.replace('Gasolina ','Gás.')}: R$ ${parseFloat(r[c.key]).toFixed(2)}</span>`).join('')}
          </div>
          ${r.obs?`<div style="margin-top:6px;font-size:12px;color:#73726c;font-style:italic;">"${r.obs}"</div>`:''}
        </div>`).join('')}
    <button class="btn-primary" onclick="irColeta()">+ Registrar concorrente</button>
    ${regs.length>0?`<button class="btn-secondary" onclick="irResumo()">Ver relatório do dia →</button>`:''}`;
  },

  coleta(){
    const f=state.form,posto=state.posto;
    const hist=getHistorico(posto.id);
    const sugestoes=f.nome
      ?[...hist.filter(h=>h.nome.toLowerCase().includes(f.nome.toLowerCase())).map(h=>h.nome).slice(0,5),
         ...BANDEIRAS.filter(b=>b.toLowerCase().includes(f.nome.toLowerCase())&&!hist.find(h=>h.nome===b)).slice(0,3)]
      :hist.slice(0,8).map(h=>h.nome);

    const campos=COMBUSTIVEIS.map(({key,label})=>{
      const val=f[key],nosso=posto.precos[key];
      const st=val&&!isNaN(parseFloat(val))&&nosso>0?calcStatus(nosso,parseFloat(val)):null;
      const editado=f.camposEditados&&f.camposEditados[key];
      return`<div class="price-field">
        <label>${label}${editado?` <span style="font-size:9px;color:#854f0b;">editado</span>`:''}</label>
        <div class="price-row">
          <span>R$</span>
          <input type="number" step="0.01" placeholder="0,00" value="${val}"
            style="${st?`border-color:${st.cls==='badge-red'?'#e24b4a':st.cls==='badge-green'?'#639922':'#ba7517'};`:''}"
            oninput="setPreco('${key}',this.value)"/>
        </div>
        ${st?`<div class="price-status" style="color:${st.cor};">${st.label} do nosso</div>`:''}
      </div>`;
    }).join('');

    const alertas=validarPrecos(f);
    const podeSalvar=f.nome.trim()&&f.imgPreview;

    return`<div style="display:flex;align-items:center;gap:10px;margin-bottom:1.25rem;">
      <button class="btn-back" onclick="irLista()">←</button>
      <div style="flex:1;">
        <div class="label">${posto.cidade} · ${posto.estado}</div>
        <div class="title">Registrar concorrente</div>
      </div>
      <div id="loc-status">
        ${f.locStatus==='ok'?`<span class="badge badge-green" style="font-size:10px;">GPS ✓</span>`:
          f.locStatus==='erro'?`<span class="badge badge-gray" style="font-size:10px;">Sem GPS</span>`:
          `<span class="badge badge-gray" style="font-size:10px;">Buscando...</span>`}
      </div>
    </div>
    <input type="file" id="fileInput" accept="image/*" style="display:none;" onchange="handleFoto(this)">
    <input type="file" id="fileInputProprio" accept="image/*" style="display:none;" onchange="handleFotoProprio(this)">

    <div class="card">
      <div class="label" style="margin-bottom:6px;">Nome do posto concorrente</div>
      <div class="input-wrap">
        <input type="text" placeholder="Ex: Ipiranga Av. Brasil" value="${f.nome}"
          oninput="setNome(this.value)" onfocus="setDrop(true)" onblur="setTimeout(()=>setDrop(false),200)"/>
        ${f.dropOpen&&sugestoes.length>0?`<div class="dropdown">
          ${f.nome===''?'<div class="dropdown-recente">Recentes</div>':''}
          ${sugestoes.map(b=>`<div class="dropdown-item" onmousedown="escolherSugestao('${b.replace(/'/g,"\\'")}')">${b}</div>`).join('')}
        </div>`:''}
      </div>
      <div style="margin-top:12px;">
        <div class="label" style="margin-bottom:6px;">Bandeira</div>
        <select onchange="setBandeira(this.value)">
          ${BANDEIRAS.map(b=>`<option value="${b}" ${f.bandeira===b?'selected':''}>${b}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="card">
      <div class="label" style="margin-bottom:8px;">Foto do painel de preços <span style="color:#a32d2d;">*</span></div>
      ${f.imgPreview
        ?`<div class="foto-preview">
            <img src="${f.imgPreview}" alt="foto">
            <div class="foto-overlay">${f.iaUsada?'<span class="badge badge-blue" style="font-size:10px;">Lido pela IA</span>':''}</div>
            <div class="foto-change"><button class="btn-small" onclick="trocarFoto()">Trocar</button></div>
          </div>`
        :`<button class="foto-btn" onclick="document.getElementById('fileInput').click()">
            Tirar foto ou selecionar da galeria<br>
            <span style="font-size:11px;color:#9c9a92;">A IA lê os preços automaticamente</span>
          </button>`}
      ${f.loading?`<div class="spinner-wrap"><div class="spinner"></div><div style="font-size:13px;color:#73726c;">Lendo preços...</div></div>`:''}
      ${f.erroIA?`<div class="alert-amber" style="margin-top:10px;">Não foi possível ler automaticamente. Preencha os preços abaixo.</div>`:''}
    </div>

    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div class="label">Preços observados</div>
        ${f.iaUsada?'<span style="font-size:11px;color:#185fa5;">Preenchido pela IA — confira</span>':''}
      </div>
      <div class="price-grid">${campos}</div>
      <div class="hint">Deixe em branco os combustíveis que o posto não vende.</div>
      ${alertas.length>0?`<div class="alerta-preco">
        <div style="font-size:11px;font-weight:500;color:#854f0b;margin-bottom:4px;">⚠️ Verifique os preços:</div>
        ${alertas.map(a=>`<div style="font-size:11px;color:#854f0b;margin-top:2px;">· ${a}</div>`).join('')}
      </div>`:''}
    </div>

    <div class="card">
      <div class="label" style="margin-bottom:6px;">Observações (opcional)</div>
      <textarea rows="3" placeholder="Ex: Promoção no etanol até sexta..." oninput="setObs(this.value)">${f.obs}</textarea>
    </div>

    <div class="card">
      <div class="label" style="margin-bottom:8px;">Foto do seu posto (preço atual) <span style="color:#a32d2d;">*</span></div>
      ${f.fotoProprioPreview
        ?`<div class="foto-preview">
            <img src="${f.fotoProprioPreview}" alt="foto proprio">
            <div class="foto-change"><button class="btn-small" onclick="trocarFotoProprio()">Trocar</button></div>
          </div>`
        :`<button class="foto-btn" onclick="document.getElementById('fileInputProprio').click()">
            Tirar foto do seu painel de preços<br>
            <span style="font-size:11px;color:#9c9a92;">Para comparação com o concorrente</span>
          </button>`}
    </div>

    <button class="btn-primary" id="btn-salvar" onclick="salvar()" ${!podeSalvar?'disabled':''}>Salvar registro</button>
    ${!f.imgPreview?`<div style="font-size:11px;color:#a32d2d;text-align:center;margin-top:4px;">⚠️ Foto do painel do concorrente é obrigatória</div>`:''}`;
  },

  resumo(){
    const p=state.posto,regs=state.registros;
    const tabelas=COMBUSTIVEIS.map(({key,label})=>{
      const vals=regs.filter(r=>r[key]).map(r=>parseFloat(r[key]));
      if(!vals.length)return'';
      const media=(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
      const menor=Math.min(...vals).toFixed(2);
      const nosso=p.precos[key];
      const st=nosso>0?calcStatus(nosso,parseFloat(media)):{label:'Sem preço cadastrado',cls:'badge-gray'};
      return`<div class="card" style="margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-weight:500;">${label}</div>
          <span class="badge ${st.cls}">${st.label}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px;">
          <div class="card-gray"><div class="label">Nosso</div><div style="font-size:14px;font-weight:500;color:#185fa5;">R$ ${nosso>0?nosso.toFixed(2):'—'}</div></div>
          <div class="card-gray"><div class="label">Média</div><div style="font-size:14px;font-weight:500;">R$ ${media}</div></div>
          <div class="card-gray"><div class="label">Menor</div><div style="font-size:14px;font-weight:500;">R$ ${menor}</div></div>
        </div>
        <table class="resumo-table">
          <thead><tr><th>Posto</th><th>Bandeira</th><th style="text-align:right;">Preço</th></tr></thead>
          <tbody>${regs.filter(r=>r[key]).map(r=>`
            <tr>
              <td>${r.nome}</td>
              <td><span class="badge ${BANDEIRA_BADGE[r.bandeira]||'badge-outros'}" style="font-size:10px;">${r.bandeira}</span></td>
              <td style="text-align:right;">R$ ${parseFloat(r[key]).toFixed(2)}</td>
            </tr>`).join('')}</tbody>
        </table>
      </div>`;
    }).join('');
    return`<div style="display:flex;align-items:center;gap:10px;margin-bottom:1.25rem;">
      <button class="btn-back" onclick="irLista()">←</button>
      <div><div class="label">Relatório · ${p.nome}</div><div class="title">Comparativo do dia</div></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.25rem;">
      <div class="card-gray"><div class="label">Posto</div><div style="font-size:13px;font-weight:500;">${p.nome}</div></div>
      <div class="card-gray"><div class="label">Cidade</div><div style="font-size:13px;font-weight:500;">${p.cidade}</div></div>
      <div class="card-gray"><div class="label">Concorrentes</div><div style="font-size:13px;font-weight:500;">${regs.length}</div></div>
    </div>
    ${tabelas}
    <button class="btn-secondary" onclick="irLista()">Voltar e adicionar mais</button>`;
  },
};

// Ações
function selecionarPosto(id){state.posto=POSTOS.find(p=>p.id===id);state.tela='lista';render()}
function trocarPosto(){state.tela='selector';render()}
function irLista(){state.tela='lista';render()}
function irResumo(){state.tela='resumo';render()}

function irColeta(){
  state.form={nome:'',bandeira:'Bandeira Branca',gc:'',ga:'',et:'',eta:'',ds:'',ds500:'',dsa:'',
    obs:'',imgPreview:null,imgFile:null,iaUsada:false,erroIA:false,loading:false,
    dropOpen:false,lat:'',lng:'',locStatus:'buscando',precosIA:{},camposEditados:{},
    fotoProprioPreview:null};
  _fotoFile=null;_fotoProprioFile=null;
  state.tela='coleta';render();
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos=>{
      state.form.lat=pos.coords.latitude.toFixed(6);
      state.form.lng=pos.coords.longitude.toFixed(6);
      state.form.locStatus='ok';
      const el=document.getElementById('loc-status');
      if(el)el.innerHTML=`<span class="badge badge-green" style="font-size:10px;">GPS ✓</span>`;
      buscarPostoProximo(state.form.lat,state.form.lng).then(p=>{
        if(p&&p.nome&&!state.form.nome){
          state.form.nome=p.nome;
          if(p.bandeira)state.form.bandeira=p.bandeira;
          const inp=document.querySelector('input[type=text]');
          if(inp)inp.value=p.nome;
        }
      });
    },()=>{state.form.locStatus='erro';const el=document.getElementById('loc-status');if(el)el.innerHTML=`<span class="badge badge-gray" style="font-size:10px;">Sem GPS</span>`},
    {enableHighAccuracy:true,timeout:10000});
  }
}

function setNome(v){state.form.nome=v;atualizarBotao()}
function setBandeira(v){state.form.bandeira=v}
function setPreco(k,v){
  state.form[k]=v;
  if(state.form.precosIA[k]!==undefined&&v!==state.form.precosIA[k])
    state.form.camposEditados[k]=true;
  else delete state.form.camposEditados[k];
  atualizarBotao();
}
function setObs(v){state.form.obs=v}
function setDrop(v){state.form.dropOpen=v}

function atualizarBotao(){
  const btn=document.getElementById('btn-salvar');
  if(!btn)return;
  btn.disabled=!state.form.nome.trim()||!state.form.imgPreview;
}

function escolherSugestao(nome){
  const h=getHistorico(state.posto.id).find(x=>x.nome===nome);
  state.form.nome=nome;
  if(h&&h.bandeira)state.form.bandeira=h.bandeira;
  state.form.dropOpen=false;
  render();
}

function trocarFoto(){
  _fotoFile=null;state.form.imgPreview=null;
  state.form.iaUsada=false;state.form.erroIA=false;
  COMBUSTIVEIS.forEach(c=>{state.form[c.key]=''});
  state.form.precosIA={};state.form.camposEditados={};
  render();
}

function trocarFotoProprio(){
  _fotoProprioFile=null;state.form.fotoProprioPreview=null;render();
}

async function handleFoto(input){
  const file=input.files[0];if(!file)return;
  _fotoFile=file;
  state.form.imgPreview=URL.createObjectURL(file);
  state.form.loading=true;state.form.iaUsada=false;state.form.erroIA=false;
  render();
  try{
    const exif=await exifr.parse(file,{gps:true});
    if(exif&&exif.latitude&&exif.longitude){
      state.form.lat=exif.latitude.toFixed(6);state.form.lng=exif.longitude.toFixed(6);
      state.form.locStatus='ok';
      const el=document.getElementById('loc-status');
      if(el)el.innerHTML=`<span class="badge badge-green" style="font-size:10px;">GPS da foto ✓</span>`;
      const p=await buscarPostoProximo(state.form.lat,state.form.lng);
      if(p&&p.nome&&!state.form.nome){state.form.nome=p.nome;if(p.bandeira)state.form.bandeira=p.bandeira}
    }
  }catch(e){}
  try{
    const precos=await lerFotoComIA(file);
    COMBUSTIVEIS.forEach(c=>{state.form[c.key]=precos[c.key]||''});
    if(precos.bandeira){
      const bv=['Ipiranga','Shell','BR','Petrobras','Raízen','Bandeira Branca'];
      const enc=bv.find(b=>b.toLowerCase()===precos.bandeira.toLowerCase());
      if(enc)state.form.bandeira=enc;
    }
    state.form.precosIA={...precos};
    state.form.camposEditados={};
    state.form.iaUsada=COMBUSTIVEIS.some(c=>precos[c.key]);
    state.form.erroIA=!state.form.iaUsada;
  }catch(e){state.form.erroIA=true}
  state.form.loading=false;render();
  setTimeout(()=>{
    COMBUSTIVEIS.forEach(c=>{
      if(!state.form[c.key])return;
      document.querySelectorAll('input[type=number]').forEach(inp=>{
        if((inp.getAttribute('oninput')||'').includes(`'${c.key}'`))inp.value=state.form[c.key];
      });
    });
  },100);
}

async function handleFotoProprio(input){
  const file=input.files[0];if(!file)return;
  _fotoProprioFile=file;
  state.form.fotoProprioPreview=URL.createObjectURL(file);
  render();
}

async function salvar(){
  const f=state.form;
  const btn=document.getElementById('btn-salvar');
  if(btn){btn.disabled=true;btn.textContent='Salvando...'}
  let fotoUrl=null,fotoProprioUrl=null;
  if(_fotoFile)fotoUrl=await uploadFoto(_fotoFile,state.posto.id,'conc');
  if(_fotoProprioFile)fotoProprioUrl=await uploadFoto(_fotoProprioFile,state.posto.id,'proprio');
  const reg={nome:f.nome,bandeira:f.bandeira,gc:f.gc,ga:f.ga,et:f.et,eta:f.eta,
    ds:f.ds,ds500:f.ds500,dsa:f.dsa,obs:f.obs,imgPreview:fotoUrl||f.imgPreview,
    iaUsada:f.iaUsada,hora:hora(),lat:f.lat,lng:f.lng,fotoUrl,fotoProprioUrl,
    camposEditados:f.camposEditados};
  state.registros.push(reg);
  salvarHistorico(state.posto.id,f.nome,f.bandeira);
  await salvarSupabase(reg);
  _fotoFile=null;_fotoProprioFile=null;
  irLista();
}

function init(){
  const p=getPostoFromURL();
  if(p){state.posto=p;state.tela='lista'}else{state.tela='selector'}
  render();
}
init();
