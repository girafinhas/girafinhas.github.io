(function(){
  var WA_NUM='553141123690';
  function wa(text){return 'https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(text)}

  var nav=document.getElementById('nav'),mb=document.getElementById('menuBtn');
  mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}});

  document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){
    var t=b.dataset.copy;
    function sel(){var s=getSelection(),rg=document.createRange();rg.selectNodeContents(document.getElementById(b.dataset.target||'fone'));s.removeAllRanges();s.addRange(rg);b.textContent='Selecionado'}
    try{navigator.clipboard.writeText(t).then(function(){b.textContent='Copiado'},sel)}catch(e){sel()}
  })});

  /* ---------- agendamento ---------- */
  var HOURS=['08:30','09:30','10:30','14:00','15:00','16:00','17:00'];
  var WD=['dom','seg','ter','qua','qui','sex','sáb'];
  var MES=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  function pad(n){return String(n).padStart(2,'0')}
  function iso(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
  var WDL=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
  var MESL=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  function fmtLong(s){var p=s.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]);return WDL[d.getDay()]+', '+p[2]+' de '+MESL[p[1]-1]}
  function fmt(s){var p=s.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]);return WD[d.getDay()]+', '+p[2]+' de '+MES[p[1]-1]}
  var days=[];(function(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+1);while(days.length<15){if(d.getDay()>0&&d.getDay()<6)days.push(new Date(d));d.setDate(d.getDate()+1)}})();
  var selDay=iso(days[0]),selHour=null;
  var daysEl=document.getElementById('days'),slotsEl=document.getElementById('slots'),btn=document.getElementById('bookBtn'),msg=document.getElementById('bookMsg');
  function renderDays(){daysEl.innerHTML='';days.forEach(function(d){var b=document.createElement('button');b.type='button';b.className='day';b.setAttribute('aria-pressed',iso(d)===selDay);b.innerHTML='<small>'+WD[d.getDay()]+'</small><b>'+d.getDate()+'</b><small>'+MES[d.getMonth()]+'</small>';b.onclick=function(){selDay=iso(d);selHour=null;renderDays();renderSlots()};daysEl.appendChild(b)})}
  function renderSlots(){slotsEl.innerHTML='';HOURS.forEach(function(h){var b=document.createElement('button');b.type='button';b.className='slot';b.textContent=h;b.setAttribute('aria-pressed',selHour===h);b.onclick=function(){selHour=h;renderSlots()};slotsEl.appendChild(b)});
    btn.disabled=!selHour;msg.className='msg';msg.textContent=selHour?fmt(selDay)+' às '+selHour:'Escolha um dia e um horário.'}
  if(daysEl){renderDays();renderSlots();}
  document.querySelectorAll('#bookForm input,#bookForm select').forEach(function(el){el.addEventListener('input',function(){el.classList.remove('invalid');el.removeAttribute('aria-invalid')});el.addEventListener('change',function(){el.classList.remove('invalid')})});
  (function(){var nv=document.getElementById('nextVisit');if(!nv)return;var d=days[0],t=new Date();t.setHours(0,0,0,0);t.setDate(t.getDate()+1);
    nv.textContent=(d.getTime()===t.getTime()?'Amanhã, ':'')+WD[d.getDay()]+' '+d.getDate()+' de '+MES[d.getMonth()]+' · '+HOURS[0]})();

  var bookForm=document.getElementById('bookForm');
  if(bookForm)bookForm.addEventListener('submit',function(e){
    e.preventDefault();if(!selHour)return;
    function v(id){return document.getElementById(id).value.trim()}
    var nome=v('bNome'),fone=v('bFone');
    var checks=[['bNome',nome.length>=2,'seu nome'],['bFone',fone.replace(/\D/g,'').length>=10,'um WhatsApp com DDD'],['bCrianca',v('bCrianca').length>=2,'o nome da criança'],['bIdade',!!v('bIdade'),'a idade da criança'],['bOrigem',!!v('bOrigem'),'como conheceu a escola']];
    var faltam=[];checks.forEach(function(c){var el=document.getElementById(c[0]);el.classList.toggle('invalid',!c[1]);el.setAttribute('aria-invalid',!c[1]);if(!c[1])faltam.push(c[2])});
    if(faltam.length){msg.className='msg err';msg.textContent='Falta preencher: '+faltam.join(', ')+'.';var first=document.querySelector('#bookForm .invalid');if(first)first.focus();return}
    var modoEl=document.querySelector('input[name="bModo"]:checked'),online=modoEl&&modoEl.value==='online';
    var sala='https://meet.jit.si/Girafinhas-'+selDay.replace(/-/g,'')+'-'+selHour.replace(':','')+'-'+Math.random().toString(36).slice(2,7);
    var resumo='Olá, equipe Girafinhas! 🦒\n'+
      (online?'Gostaria de agendar uma *reunião on-line com a direção* para conhecer a escola e conversar sobre a matrícula do meu filho(a).\n\n'
             :'Gostaria de *agendar uma visita* para conhecer a escola e conversar sobre a matrícula do meu filho(a).\n\n')+
      (online?'💻 *Formato:* reunião on-line por vídeo\n🔗 *Link da reunião:* '+sala+'\n':'🏫 *Formato:* visita presencial na escola\n')+
      '📅 *Dia:* '+fmtLong(selDay)+'\n'+
      '🕐 *Horário:* '+selHour+'\n\n'+
      '👤 *Responsável:* '+nome+'\n'+
      '📱 *WhatsApp:* '+fone+'\n'+
      '🧒 *Criança:* '+(v('bCrianca')?v('bCrianca')+' · ':'')+v('bIdade')+'\n'+
      '💬 *Conheci a escola por:* '+v('bOrigem')+
      (v('bObs')?'\n📝 *Observações:* '+v('bObs'):'')+
      (online?'\n\nNo horário, é só abrir o link: funciona no celular ou no computador, sem cadastro.':'')+
      '\n\nFico no aguardo da confirmação. Obrigado(a)!';
    var link=wa(resumo);
    var done=document.getElementById('bookDone');done.innerHTML='';
    var big=document.createElement('div');big.className='big';big.textContent=online?'Reunião on-line pronta!':'Agendamento pronto!';
    var p=document.createElement('p');p.style.color='var(--ink-2)';p.textContent='Abrimos o WhatsApp da escola com o seu agendamento. Toque em enviar por lá, e a coordenação confirma o horário com você.';
    var sm=document.createElement('div');sm.className='summary';sm.textContent=resumo;
    var acts=document.createElement('div');acts.style.cssText='display:flex;gap:10px;flex-wrap:wrap';
    var a=document.createElement('a');a.className='btn btn-wa';a.href=link;a.textContent='Abrir o WhatsApp de novo';
    var again=document.createElement('button');again.type='button';again.className='btn btn-ghost';again.textContent='Escolher outro horário';again.onclick=function(){done.hidden=true;bookForm.hidden=false;selHour=null;renderSlots()};
    acts.append(a,again);done.append(big,p,sm,acts);
    bookForm.hidden=true;done.hidden=false;
    window.location.href=link;
  });

  /* ---------- depoimentos ---------- */
  var nota=5,rateEl=document.getElementById('dNota');
  function renderRate(){rateEl.innerHTML='';for(var i=1;i<=5;i++)(function(i){var b=document.createElement('button');b.type='button';b.textContent='★';b.className=i<=nota?'on':'';b.setAttribute('role','radio');b.setAttribute('aria-checked',i===nota);b.setAttribute('aria-label',i+' estrela'+(i>1?'s':''));b.onclick=function(){nota=i;renderRate()};rateEl.appendChild(b)})(i)}
  var depForm=document.getElementById('depForm');
  if(rateEl)renderRate();
  if(depForm)depForm.addEventListener('submit',function(e){
    e.preventDefault();var m=document.getElementById('depMsg');function g(id){return document.getElementById(id).value.trim()}
    if(!g('dNome')||!g('dTexto')){m.className='msg err';m.textContent='Preencha seu nome e o depoimento.';return}
    var txt='Olá, equipe Girafinhas! 🦒\n'+
      'Quero deixar um *depoimento para o site*.\n\n'+
      '👤 *Nome:* '+g('dNome')+'\n'+
      '👨‍👩‍👧 *Sou:* '+g('dRel')+'\n'+
      '⭐ *Nota:* '+'★'.repeat(nota)+' ('+nota+'/5)\n\n'+
      '💛 *Depoimento:*\n"'+g('dTexto')+'"\n\n'+
      'Autorizo a publicação no site da escola.';
    window.open(wa(txt),'_blank','noopener');
    m.className='msg';m.textContent='Obrigado! Se o WhatsApp não abriu, ';
    var a=document.createElement('a');a.href=wa(txt);a.target='_blank';a.rel='noopener';a.textContent='toque aqui para enviar';a.style.color='var(--accent)';m.appendChild(a);
  });

  /* ---------- mural ---------- */
  var posts=document.getElementById('posts'),items=window.MURAL||[];
  if(posts&&items.length){posts.innerHTML='';items.forEach(function(x){
    var a=document.createElement('article');a.className='post';
    var meta=document.createElement('div');meta.className='meta';
    var tipo=['evento','urgente'].indexOf(x.tipo)>=0?x.tipo:'comunicado';
    var pill=document.createElement('span');pill.className='pill '+tipo;pill.textContent=tipo;meta.appendChild(pill);
    if(x.data){var w=document.createElement('span');w.textContent=fmt(x.data);meta.appendChild(w)}
    var h=document.createElement('h3');h.textContent=x.titulo||'';var p=document.createElement('p');p.textContent=x.texto||'';
    a.append(meta,h,p);posts.appendChild(a)})}

  /* voltar ao topo + atalho ativo */
  var sn=document.querySelectorAll('.subnav a');
  var setOn=function(id){sn.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)})};
  if(sn.length&&'IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setOn(e.target.id)})},{rootMargin:'-40% 0px -55% 0px'});
    sn.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t);a.addEventListener('click',function(){setTimeout(function(){setOn(a.getAttribute('href').slice(1))},600)})})}
  if(sn.length){var last=sn[sn.length-1].getAttribute('href').slice(1);
    addEventListener('scroll',function(){if(innerHeight+scrollY>=document.documentElement.scrollHeight-8)setOn(last)},{passive:true})}


})();
