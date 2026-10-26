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
  function fmt(s){var p=s.split('-').map(Number),d=new Date(p[0],p[1]-1,p[2]);return WD[d.getDay()]+', '+p[2]+' de '+MES[p[1]-1]}
  var days=[];(function(){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+1);while(days.length<15){if(d.getDay()>0&&d.getDay()<6)days.push(new Date(d));d.setDate(d.getDate()+1)}})();
  var selDay=iso(days[0]),selHour=null;
  var daysEl=document.getElementById('days'),slotsEl=document.getElementById('slots'),btn=document.getElementById('bookBtn'),msg=document.getElementById('bookMsg');
  function renderDays(){daysEl.innerHTML='';days.forEach(function(d){var b=document.createElement('button');b.type='button';b.className='day';b.setAttribute('aria-pressed',iso(d)===selDay);b.innerHTML='<small>'+WD[d.getDay()]+'</small><b>'+d.getDate()+'</b><small>'+MES[d.getMonth()]+'</small>';b.onclick=function(){selDay=iso(d);selHour=null;renderDays();renderSlots()};daysEl.appendChild(b)})}
  function renderSlots(){slotsEl.innerHTML='';HOURS.forEach(function(h){var b=document.createElement('button');b.type='button';b.className='slot';b.textContent=h;b.setAttribute('aria-pressed',selHour===h);b.onclick=function(){selHour=h;renderSlots()};slotsEl.appendChild(b)});
    btn.disabled=!selHour;msg.className='msg';msg.textContent=selHour?fmt(selDay)+' às '+selHour:'Escolha um dia e um horário.'}
  renderDays();renderSlots();

  document.getElementById('bookForm').addEventListener('submit',function(e){
    e.preventDefault();if(!selHour)return;
    function v(id){return document.getElementById(id).value.trim()}
    var nome=v('bNome'),fone=v('bFone');
    if(!nome||!fone){msg.className='msg err';msg.textContent='Preencha seu nome e WhatsApp.';return}
    var resumo='Olá! Gostaria de agendar uma visita ao Colégio Cristão Girafinhas.\n\n'+
      'Dia: '+fmt(selDay)+' às '+selHour+'\nResponsável: '+nome+' · '+fone+
      (v('bCrianca')?'\nCriança: '+v('bCrianca'):'')+' ('+v('bIdade')+')'+
      '\nConheci a escola por: '+v('bOrigem')+(v('bObs')?'\nObs.: '+v('bObs'):'');
    var done=document.getElementById('bookDone');done.innerHTML='';
    var big=document.createElement('div');big.className='big';big.textContent='Falta só enviar.';
    var p=document.createElement('p');p.style.color='var(--ink-2)';p.textContent='Toque no botão abaixo para enviar o pedido para a nossa equipe pelo WhatsApp. A coordenação confirma o horário com você.';
    var sm=document.createElement('div');sm.className='summary';sm.textContent=resumo;
    var acts=document.createElement('div');acts.style.cssText='display:flex;gap:10px;flex-wrap:wrap';
    var a=document.createElement('a');a.className='btn btn-wa';a.target='_blank';a.rel='noopener';a.href=wa(resumo);a.textContent='Enviar pelo WhatsApp';
    var again=document.createElement('button');again.type='button';again.className='btn btn-ghost';again.textContent='Escolher outro horário';again.onclick=function(){done.hidden=true;document.getElementById('bookForm').hidden=false;selHour=null;renderSlots()};
    acts.append(a,again);done.append(big,p,sm,acts);
    document.getElementById('bookForm').hidden=true;done.hidden=false;
    window.open(a.href,'_blank','noopener');
  });

  /* ---------- depoimentos ---------- */
  var nota=5,rateEl=document.getElementById('dNota');
  function renderRate(){rateEl.innerHTML='';for(var i=1;i<=5;i++)(function(i){var b=document.createElement('button');b.type='button';b.textContent='★';b.className=i<=nota?'on':'';b.setAttribute('role','radio');b.setAttribute('aria-checked',i===nota);b.setAttribute('aria-label',i+' estrela'+(i>1?'s':''));b.onclick=function(){nota=i;renderRate()};rateEl.appendChild(b)})(i)}
  renderRate();
  document.getElementById('depForm').addEventListener('submit',function(e){
    e.preventDefault();var m=document.getElementById('depMsg');function g(id){return document.getElementById(id).value.trim()}
    if(!g('dNome')||!g('dTexto')){m.className='msg err';m.textContent='Preencha seu nome e o depoimento.';return}
    var txt='Depoimento para o site do Girafinhas\n\n'+g('dNome')+' ('+g('dRel')+') · '+'★'.repeat(nota)+'\n"'+g('dTexto')+'"';
    window.open(wa(txt),'_blank','noopener');
    m.className='msg';m.textContent='Obrigado! Se o WhatsApp não abriu, ';
    var a=document.createElement('a');a.href=wa(txt);a.target='_blank';a.rel='noopener';a.textContent='toque aqui para enviar';a.style.color='var(--accent)';m.appendChild(a);
  });

  /* ---------- mural ---------- */
  var posts=document.getElementById('posts'),items=window.MURAL||[];
  if(items.length){posts.innerHTML='';items.forEach(function(x){
    var a=document.createElement('article');a.className='post';
    var meta=document.createElement('div');meta.className='meta';
    var tipo=['evento','urgente'].indexOf(x.tipo)>=0?x.tipo:'comunicado';
    var pill=document.createElement('span');pill.className='pill '+tipo;pill.textContent=tipo;meta.appendChild(pill);
    if(x.data){var w=document.createElement('span');w.textContent=fmt(x.data);meta.appendChild(w)}
    var h=document.createElement('h3');h.textContent=x.titulo||'';var p=document.createElement('p');p.textContent=x.texto||'';
    a.append(meta,h,p);posts.appendChild(a)})}
})();
