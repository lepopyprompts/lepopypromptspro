
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SEED=window.LOJA_CONFIG;
const KEY='lepopy_loja_v1';
let S=(()=>{try{const l=JSON.parse(localStorage.getItem(KEY));if(l&&l.cats&&l.set&&(l.t||0)>(SEED.t||0))return l}catch(e){}return JSON.parse(JSON.stringify(SEED))})();
let tab='c',fails=0,lock=0;

function sha256(a){function r(v,n){return(v>>>n)|(v<<(32-n))}var M=Math.pow(2,32),res='',w=[],L=a.length*8,h=sha256.h=sha256.h||[],k=sha256.k=sha256.k||[],pc=k.length,comp={},i,j;
for(var c=2;pc<64;c++){if(!comp[c]){for(i=0;i<313;i+=c)comp[i]=c;h[pc]=(Math.pow(c,.5)*M)|0;k[pc++]=(Math.pow(c,1/3)*M)|0}}
a+='\x80';while(a.length%64-56)a+='\x00';
for(i=0;i<a.length;i++){j=a.charCodeAt(i);w[i>>2]|=j<<((3-i)%4)*8}
w[w.length]=((L/M)|0);w[w.length]=L;
for(j=0;j<w.length;){var x=w.slice(j,j+=16),old=h;h=h.slice(0,8);
for(i=0;i<64;i++){var w15=x[i-15],w2=x[i-2],A=h[0],E=h[4];
var t1=h[7]+(r(E,6)^r(E,11)^r(E,25))+((E&h[5])^((~E)&h[6]))+k[i]+(x[i]=(i<16)?x[i]:(x[i-16]+(r(w15,7)^r(w15,18)^(w15>>>3))+x[i-7]+(r(w2,17)^r(w2,19)^(w2>>>10)))|0);
var t2=(r(A,2)^r(A,13)^r(A,22))+((A&h[1])^(A&h[2])^(h[1]&h[2]));
h=[(t1+t2)|0].concat(h);h[4]=(h[4]+t1)|0}
for(i=0;i<8;i++)h[i]=(h[i]+old[i])|0}
for(i=0;i<8;i++)for(j=3;j+1;j--){var b=(h[i]>>(j*8))&255;res+=((b<16)?0:'')+b.toString(16)}return res}
const H=(u,p)=>sha256(unescape(encodeURIComponent(u.toLowerCase().trim()+':'+p)));

function save(){S.t=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Sem espaço no navegador. Use link (URL) nas imagens.')}}
function toast(m){const t=$('#toast');t.textContent=m;t.style.display='block';clearTimeout(toast.i);toast.i=setTimeout(()=>t.style.display='none',3200)}
function money(v){v=parseFloat(String(v).replace(/\./g,'').replace(',','.'));if(!isFinite(v)||v<=0)return'';return S.set.cur+' '+v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
function shrink(f,max,cb){const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.8))};i.src=r.result};r.readAsDataURL(f)}
function dl(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),2000)}
function src(v){v=(v||'').trim();if(!v)return'';if(/^(data:|https?:\/\/|\/\/)/i.test(v))return v;v=v.replace(/^\.?\//,'');if(!/^imagens\//i.test(v))v='imagens/'+v;return v.indexOf('%')<0?encodeURI(v):v}
function ph(el){const c=el.closest('.cover');if(c)c.innerHTML=`<div class="ph"><img src="${esc(src(S.set.logo))}" alt=""><b>${esc(el.alt.replace('Capa: ',''))}</b></div>`}
const uid=()=>'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const newCat=(n,p,l)=>({id:uid(),n:n||'Nova categoria',d:'',p:p||'',o:'',k:'100',img:'',l:l||'',on:1});

/* ---------- Loja ---------- */
function render(){const s=S.set,st=document.documentElement.style;document.title=s.name;st.setProperty('--cy',s.c1);st.setProperty('--yl',s.c2);
$('#app').innerHTML=`<header class="hero"><img src="${esc(src(s.logo))}" alt="${esc(s.name)}"><h1>${esc(s.title)}</h1><p>${esc(s.text)}</p><p class="tag">${esc(s.tag)}</p></header>
<div class="sr"><input id="q" type="search" placeholder="Buscar categoria" aria-label="Buscar categoria"></div><main class="grid" id="grid"></main>
<footer>${esc(s.foot)}<br><button data-act="open">Área restrita</button></footer>`;grid()}
function grid(){const q=($('#q')||{}).value||'',n=q.toLowerCase(),s=S.set;
const l=S.cats.filter(c=>c.on&&(c.n+' '+c.d).toLowerCase().includes(n));
$('#grid').innerHTML=l.map(c=>{const ok=/^https?:\/\//i.test(c.l||'');
return`<article class="card"><div class="cover">${c.img?`<img src="${esc(src(c.img))}" alt="Capa: ${esc(c.n)}" loading="lazy" onerror="ph(this)">`:`<div class="ph"><img src="${esc(src(s.logo))}" alt=""><b>${esc(c.n)}</b></div>`}</div>
<div class="bd"><h3>${esc(c.n)}</h3>${c.k?`<span class="chip">${esc(c.k)} prompts</span>`:''}<p>${esc(c.d)}</p>
<div class="buy"><div class="pr">${c.o&&money(c.o)?`<s>${money(c.o)}</s>`:''}<b>${money(c.p)}</b></div>${ok?`<a class="btn" href="${esc(c.l)}" target="_blank" rel="noopener noreferrer">${esc(s.btn)}</a>`:`<span class="btn off">Em breve</span>`}</div></div></article>`}).join('')||'<p style="grid-column:1/-1;text-align:center;color:var(--mu)">Nenhuma categoria encontrada.</p>'}

/* ---------- Painel ---------- */
function login(){const A=$('#adm');A.hidden=false;document.body.style.overflow='hidden';
A.innerHTML=`<div class="lg"><h2>Área restrita</h2><label>Usuário<input id="lu" autocomplete="username"></label><label>Senha<input id="lp" type="password" autocomplete="current-password"></label><p id="le"></p><div class="ra"><button class="btn" data-act="go">Entrar</button><button class="b2" data-act="view">Cancelar</button></div></div>`;$('#lu').focus()}
function go(){if(Date.now()<lock){$('#le').textContent='Aguarde alguns segundos.';return}
if(H($('#lu').value,$('#lp').value)===S.adm.h){sessionStorage.lp='1';fails=0;adm()}else{fails++;if(fails>=5){lock=Date.now()+30000;fails=0}$('#le').textContent='Usuário ou senha incorretos.'}}
function adm(){const A=$('#adm');A.hidden=false;document.body.style.overflow='hidden';
const T=[['c','Categorias'],['s','Página'],['a','Acesso'],['b','Publicar e backup']];
A.innerHTML=`<div class="top"><h2>Painel · ${esc(S.set.name)}</h2><div class="ra"><button class="b2" data-act="view">Ver página</button><button class="b2" data-act="out">Sair</button></div></div>
<nav class="tabs">${T.map(([k,t])=>`<button class="${tab==k?'on':''}" data-tab="${k}">${t}</button>`).join('')}</nav>
<div class="pane">${{c:pc,s:ps,a:pa,b:pb}[tab]()}</div>`}
function closeAdm(){$('#adm').hidden=true;document.body.style.overflow='';render()}
const inp=(k,v,l,x='')=>`<label ${x}>${l}<input data-s="${k}" value="${esc(v)}"></label>`;
function item(c){const dat=(c.img||'').startsWith('data:');
return`<details class="it" data-id="${c.id}"><summary><span class="th">${c.img?`<img src="${esc(src(c.img))}" alt="">`:''}</span><b>${esc(c.n||'Sem nome')}</b><em>${money(c.p)||'sem preço'} · ${c.l?'link ok':'sem link'}${c.on?'':' · oculta'}</em></summary>
<div class="f"><label class="w">Nome<input data-k="n" value="${esc(c.n)}"></label>
<label>Preço (ex.: 19,90)<input data-k="p" inputmode="decimal" value="${esc(c.p)}"></label>
<label>Preço antigo (opcional)<input data-k="o" inputmode="decimal" value="${esc(c.o)}"></label>
<label>Quantidade de prompts<input data-k="k" value="${esc(c.k)}"></label>
<label class="w">Descrição<textarea data-k="d" rows="2">${esc(c.d)}</textarea></label>
<label class="w">Link de compra (Eduzz)<input data-k="l" type="url" placeholder="https://..." value="${esc(c.l)}"></label>
<label class="w">Imagem da capa: nome do arquivo na pasta imagens (ex.: capa-lojas.jpg) ou link${dat?'<input value="Imagem embutida (antiga)" disabled>':`<input data-k="img" placeholder="capa-lojas.jpg" value="${esc(c.img)}">`}</label>
<div class="ra w"><label class="b2" style="cursor:pointer">Escolher arquivo<input type="file" accept="image/*" data-pick="1" hidden></label>${c.img?'<button class="b2" data-act="rmimg">Remover imagem</button>':''}
<label style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-k="on" ${c.on?'checked':''}> Visível na página</label></div>
<div class="ra w"><button class="b2" data-act="up">Subir</button><button class="b2" data-act="down">Descer</button><button class="b2" data-act="dup">Duplicar</button><button class="b2 dg" data-act="del">Excluir</button></div></div></details>`}
function pc(){return`<div class="bar"><button class="btn" data-act="add">Nova categoria</button><button class="b2" data-act="bulk">Adicionar em lote</button></div>
<div id="bulk" hidden class="pane"><p class="note">Uma categoria por linha. Opcional: Nome | preço | link</p><textarea id="bt" rows="6" placeholder="Padarias e confeitarias | 19,90 | https://sun.eduzz.com/..."></textarea><div><button class="btn" data-act="bulkok">Adicionar</button></div></div>
<p class="note">As capas ficam na pasta <b>imagens</b>, ao lado do index.html. Digite só o nome do arquivo (ex.: capa-lojas.jpg).</p><p class="note">${S.cats.length} categorias. As alterações valem neste navegador; para o público ver, use Publicar e backup.</p>${S.cats.map(item).join('')}`}
function ps(){const s=S.set;return`<div class="f" style="padding:0">${inp('name',s.name,'Nome da marca')}${inp('tag',s.tag,'Slogan')}${inp('title',s.title,'Título principal','class="w"')}${inp('text',s.text,'Texto de apoio','class="w"')}${inp('btn',s.btn,'Texto do botão')}${inp('cur',s.cur,'Moeda')}${inp('foot',s.foot,'Rodapé','class="w"')}
<label>Cor de destaque<input type="color" data-s="c1" value="${esc(s.c1)}"></label><label>Cor do botão<input type="color" data-s="c2" value="${esc(s.c2)}"></label>
<div class="ra w"><img src="${esc(src(s.logo))}" alt="" width="64" height="64" style="border-radius:12px"><label class="b2" style="cursor:pointer">Escolher logo<input type="file" accept="image/*" data-logo="1" hidden></label></div></div>`}
function pa(){return`<p class="note">Altere o usuário e a senha de acesso ao painel. Use ao menos 8 caracteres.</p><div class="f" style="padding:0"><label>Usuário<input id="nu" value="${esc(S.adm.u)}"></label><label>Nova senha<input id="np" type="password" autocomplete="new-password"></label><label>Repetir senha<input id="np2" type="password" autocomplete="new-password"></label></div><div><button class="btn" data-act="pw">Salvar acesso</button></div>`}
function pb(){return`<p class="note">Para os visitantes verem as mudanças: clique em Baixar configurações e envie o arquivo <b>config.js</b> para a pasta <b>dados</b> do GitHub (substitui o antigo). Capas e logo ficam na pasta <b>imagens</b>.</p>
<div class="bar"><button class="btn" data-act="bake">Baixar configurações (config.js)</button><button class="b2" data-act="exp">Exportar backup (.json)</button><label class="b2" style="cursor:pointer">Importar backup<input type="file" accept=".json,application/json" data-imp="1" hidden></label><button class="b2 dg" data-act="rst">Restaurar original</button></div>`}

function bakeCfg(){S.t=Date.now();save();return'window.LOJA_CONFIG='+JSON.stringify(S)+';\n'}
/* ---------- Eventos ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-act],[data-tab]');if(!t)return;
if(t.dataset.tab){tab=t.dataset.tab;adm();return}
const a=t.dataset.act,it=t.closest('[data-id]'),i=it?S.cats.findIndex(c=>c.id==it.dataset.id):-1,C=S.cats;
if(a=='open'){sessionStorage.lp=='1'?adm():login()}
else if(a=='go')go();
else if(a=='view')closeAdm();
else if(a=='out'){sessionStorage.removeItem('lp');closeAdm()}
else if(a=='add'){C.unshift(newCat());save();adm();$('.it').open=true}
else if(a=='bulk')$('#bulk').hidden=!$('#bulk').hidden;
else if(a=='bulkok'){const L=$('#bt').value.split('\n').map(x=>x.trim()).filter(Boolean);
L.forEach(x=>{const [n,p,l]=x.split('|').map(y=>y.trim());C.push(newCat(n,p,l))});save();adm();toast(L.length+' categorias adicionadas')}
else if(i<0){}
else if(a=='up'&&i>0){[C[i-1],C[i]]=[C[i],C[i-1]];save();adm()}
else if(a=='down'&&i<C.length-1){[C[i+1],C[i]]=[C[i],C[i+1]];save();adm()}
else if(a=='dup'){C.splice(i+1,0,Object.assign({},C[i],{id:uid(),n:C[i].n+' (cópia)'}));save();adm()}
else if(a=='del'){if(confirm('Excluir "'+C[i].n+'"?')){C.splice(i,1);save();adm()}}
else if(a=='rmimg'){C[i].img='';save();adm()}
if(a=='pw'){const u=$('#nu').value.trim(),p=$('#np').value;if(!u||p.length<8)return toast('Informe usuário e senha com 8+ caracteres.');if(p!==$('#np2').value)return toast('As senhas não coincidem.');S.adm={u:u.toLowerCase(),h:H(u,p)};save();toast('Acesso atualizado.');$('#np').value=$('#np2').value=''}
if(a=='exp')dl(new Blob([JSON.stringify(S)],{type:'application/json'}),'lepopy-backup.json');
if(a=='bake'){dl(new Blob([bakeCfg()],{type:'text/javascript'}),'config.js');toast('Baixado: envie o config.js para a pasta dados no GitHub.')}
if(a=='rst'&&confirm('Descartar as alterações deste navegador e voltar ao original do arquivo?')){localStorage.removeItem(KEY);S=JSON.parse(JSON.stringify(SEED));adm()}});

document.addEventListener('input',e=>{const t=e.target,it=t.closest('[data-id]');
if(it&&t.dataset.k){const c=S.cats.find(x=>x.id==it.dataset.id);if(!c)return;c[t.dataset.k]=t.type=='checkbox'?(t.checked?1:0):t.value;save();
const b=it.querySelector('summary b'),m=it.querySelector('summary em');b.textContent=c.n||'Sem nome';m.textContent=(money(c.p)||'sem preço')+' · '+(c.l?'link ok':'sem link')+(c.on?'':' · oculta')}
else if(t.dataset.s){S.set[t.dataset.s]=t.value;save()}
else if(t.id=='q')grid()});

document.addEventListener('change',e=>{const t=e.target,f=t.files&&t.files[0];if(!f)return;
if(t.dataset.pick){const it=t.closest('[data-id]'),c=S.cats.find(x=>x.id==it.dataset.id);c.img=f.name;save();adm();toast('Coloque o arquivo "'+f.name+'" na pasta imagens.')}
else if(t.dataset.logo){S.set.logo=f.name;save();adm();toast('Coloque "'+f.name+'" na pasta imagens.')}
else if(t.dataset.imp){const r=new FileReader();r.onload=()=>{try{const o=JSON.parse(r.result);if(!o.cats||!o.set||!o.adm)throw 0;S=o;save();adm();toast('Backup importado')}catch(x){toast('Arquivo de backup inválido.')}};r.readAsText(f)}});

document.addEventListener('keydown',e=>{if(e.key=='Enter'&&e.target.id=='lp')go()});
addEventListener('hashchange',()=>{if(location.hash=='#admin')sessionStorage.lp=='1'?adm():login()});
render();if(location.hash=='#admin')sessionStorage.lp=='1'?adm():login();
