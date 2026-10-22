/* Revenue Phoenix site script. Vanilla JS, no dependencies. */
(function(){
  'use strict';
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var REDUCE=false;try{REDUCE=window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
  function toast(m){var t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('on')},1800)}

  /* ---------- header ---------- */
  var hdr=$('#hdr'),burger=$('#burger'),drop=$('#drop');
  if(hdr){var sc=function(){hdr.classList.toggle('scrolled',window.scrollY>10)};sc();window.addEventListener('scroll',sc,{passive:true})}
  if(burger&&drop){burger.addEventListener('click',function(){var o=drop.classList.toggle('open');burger.classList.toggle('open',o);burger.setAttribute('aria-expanded',o)})}

  /* ---------- clicks: FAQ, copy, filters ---------- */
  function fallbackCopy(t){var i=document.createElement('textarea');i.value=t;i.style.position='fixed';i.style.opacity='0';document.body.appendChild(i);i.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(i)}
  document.addEventListener('click',function(e){
    var fq=e.target.closest('.fq > button');
    if(fq){var box=fq.parentNode,open=box.getAttribute('data-open')!=='true';box.setAttribute('data-open',open);fq.setAttribute('aria-expanded',open);return}
    var cp=e.target.closest('[data-copy]');
    if(cp){var txt=cp.getAttribute('data-copy'),ok=function(){toast('Copied '+txt)};
      try{navigator.clipboard.writeText(txt).then(ok,function(){fallbackCopy(txt);ok()})}catch(err){fallbackCopy(txt);ok()}return}
    var wf=e.target.closest('#work-filters .fbtn');
    if(wf){var f=wf.getAttribute('data-f');$$('#work-filters .fbtn').forEach(function(b){b.setAttribute('aria-pressed',b===wf)});
      $$('#work-list .pbig').forEach(function(a){a.hidden=!(f==='all'||a.getAttribute('data-type')===f)});return}
    var kt=e.target.closest('#kw-tabs [data-kt]');
    if(kt){var k=kt.getAttribute('data-kt');$$('#kw-tabs button').forEach(function(x){x.setAttribute('aria-selected',x===kt)});$$('#kw-cities .kw-l').forEach(function(l){l.hidden=l.getAttribute('data-kl')!==k});return}
  });

  /* ---------- blog filter + search ---------- */
  var grid=$('#blog-grid');
  if(grid){
    var B={cat:'All',q:''};
    var feat=$('#blog-feat .feat'),featCard=$('.post[data-feat]',grid);
    var render=function(){
      var q=B.q.trim().toLowerCase(),filtering=B.cat!=='All'||!!q,shown=0;
      if(feat){feat.parentNode.hidden=filtering}
      $$('.post',grid).forEach(function(p){
        var isF=p.hasAttribute('data-feat');
        var match=(B.cat==='All'||p.getAttribute('data-cat')===B.cat)&&(!q||(p.getAttribute('data-q')||'').indexOf(q)>=0);
        var vis=isF?(filtering&&match):match;
        p.hidden=!vis;if(vis)shown++;
      });
      $$('#blog-cats .fbtn').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-c')===B.cat)});
      var em=$('#blog-empty');if(em)em.hidden=!(filtering&&shown===0);
    };
    document.addEventListener('click',function(e){var b=e.target.closest('#blog-cats .fbtn');if(b){B.cat=b.getAttribute('data-c');render()}});
    var qi=$('#blog-q');if(qi)qi.addEventListener('input',function(e){B.q=e.target.value;render()});
    try{var m=/[?&]cat=([^&]+)/.exec(location.search);if(m){B.cat=decodeURIComponent(m[1].replace(/\+/g,' '));if(!$$('#blog-cats .fbtn').some(function(b){return b.getAttribute('data-c')===B.cat}))B.cat='All'}}catch(e){}
    render();
  }

  /* ---------- clocks ---------- */
  function fmt(tz){
    try{var now=new Date();
      return {t:new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',hour12:false}).format(now),d:new Intl.DateTimeFormat('en-GB',{timeZone:tz,weekday:'long'}).format(now)};
    }catch(e){return {t:'--:--',d:''}}
  }
  function tick(){
    $$('[data-tz]').forEach(function(n){n.textContent=fmt(n.getAttribute('data-tz')).t});
    $$('[data-day]').forEach(function(n){n.textContent=fmt(n.getAttribute('data-day')).d});
  }
  if($('[data-tz]')){tick();setInterval(tick,20000)}

  /* ---------- greeting ticker (order follows the visitor's timezone) ---------- */
  (function(){
    var el=$('[data-ticker="hello"]');if(!el)return;
    var z='';try{z=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
    var s=2;
    if(/^Asia\/(Calcutta|Kolkata)/.test(z))s=0;
    else if(/^Asia\/(Dubai|Muscat|Qatar|Riyadh|Kuwait|Bahrain)/.test(z))s=1;
    else if(/^America\/(Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina)/.test(z))s=3;
    else if(/^America\//.test(z))s=2;
    else if(/^(Australia|Pacific\/Auckland)/.test(z))s=4;
    var w=['Namaste','Marhaba','Hello','Bonjour',"G'day"];w=w.slice(s).concat(w.slice(0,s));
    var one='<span class="w">'+w.map(function(x,i){return (i%2?'<i>'+x+'</i>':x)+'<svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>'}).join('')+'</span>';
    el.innerHTML='<div class="tick-in">'+one+one+one+one+'</div>';
  })();

  /* ---------- scroll reveal + count-up ---------- */
  var RV_SEL='.head-row,.proj,.pbig,.row,.rev,.ctry,.fq,.post,.val,.step,.fact,.pt,.founder,.feat,.ptx,.cc,.form,.cta-box,.kw-g,.mem,.person,.stat,.story > *,.live,.reel';
  var io=null,cio=null;
  try{io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.remove('pre');x.target.classList.add('in-v');io.unobserve(x.target)}})},{threshold:.08,rootMargin:'0px 0px -5% 0px'})}catch(e){}
  try{cio=new IntersectionObserver(function(en){en.forEach(function(x){if(!x.isIntersecting)return;cio.unobserve(x.target);
    var el=x.target,n=+el.getAttribute('data-n'),s=el.getAttribute('data-s'),pf=el.getAttribute('data-p')||'',t0=null;
    (function step(ts){t0=t0||ts;var p=Math.min(1,(ts-t0)/1300),e=1-Math.pow(1-p,3);el.textContent=pf+Math.round(n*e)+s;if(p<1)requestAnimationFrame(step)})(performance.now());
  })},{threshold:.5})}catch(e){}
  function reveal(){
    var vh=window.innerHeight;
    if(!REDUCE&&cio){$$('[data-n]').forEach(function(el){var r=el.getBoundingClientRect();if(r.top>vh*.9){el.textContent=(el.getAttribute('data-p')||'')+'0'+el.getAttribute('data-s');cio.observe(el)}})}
    if(REDUCE||!io)return;
    $$(RV_SEL).forEach(function(el){
      if(el.hidden)return;
      var r=el.getBoundingClientRect();
      if(r.top>vh*.92){
        var sib=Array.prototype.indexOf.call(el.parentNode.children,el);
        el.style.setProperty('--d',(Math.min(sib,5)*0.07)+'s');
        el.classList.add('pre');io.observe(el);
      }
    });
  }
  reveal();

  /* ---------- contact form (opens WhatsApp with the message) ---------- */
  var send=$('#c-send');
  if(send){
    var g=function(id){return ($('#'+id).value||'').trim()};
    send.addEventListener('click',function(e){
      var err=$('#c-err');
      if(!g('c-name')){e.preventDefault();err.textContent='Please add your name.';$('#c-name').focus();return}
      if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g('c-email'))){e.preventDefault();err.textContent='Please enter a valid email address.';$('#c-email').focus();return}
      if(!g('c-need')){e.preventDefault();err.textContent='Please choose what you need.';$('#c-need').focus();return}
      err.textContent='';
      var t='Hi Revenue Phoenix, I am '+g('c-name')+(g('c-brand')?' from '+g('c-brand'):'')+' ('+g('c-country')+').\nI need: '+g('c-need')+'.\n'+(g('c-msg')?g('c-msg')+'\n':'')+'Email: '+g('c-email');
      this.setAttribute('href','https://wa.me/918218690055?text='+encodeURIComponent(t));
    });
    var cf=$('#cform');if(cf)cf.addEventListener('submit',function(e){e.preventDefault()});
  }

  /* ---------- before / after slider ---------- */
  (function(){
    var ba=$('#ba'),knob=$('#knob');if(!ba||!knob)return;
    var dragging=false,touched=false;
    function setPos(p){p=Math.max(4,Math.min(96,p));ba.style.setProperty('--pos',p+'%');knob.setAttribute('aria-valuenow',Math.round(p))}
    function fromEvent(e){var r=ba.getBoundingClientRect();setPos((e.clientX-r.left)/r.width*100)}
    ba.addEventListener('pointerdown',function(e){dragging=touched=true;try{ba.setPointerCapture(e.pointerId)}catch(x){}fromEvent(e)});
    ba.addEventListener('pointermove',function(e){if(dragging)fromEvent(e)});
    ['pointerup','pointercancel'].forEach(function(t){ba.addEventListener(t,function(){dragging=false})});
    knob.addEventListener('keydown',function(e){var v=parseFloat(getComputedStyle(ba).getPropertyValue('--pos'))||50;
      if(e.key==='ArrowLeft'){setPos(v-5);e.preventDefault()}if(e.key==='ArrowRight'){setPos(v+5);e.preventDefault()}});
    if(!REDUCE&&'IntersectionObserver' in window){
      var o=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){o.disconnect();var t0=null;
        (function step(ts){if(touched)return;t0=t0||ts;var t=(ts-t0)/1800;if(t>=1){setPos(36);return}setPos(36+16*Math.sin(t*Math.PI*2)*(1-t*.3));requestAnimationFrame(step)})(performance.now())}})},{threshold:.6});
      o.observe(ba);
    }
  })();

  /* ---------- cursor + spark bursts ---------- */
  (function(){
    var fine=false;try{fine=window.matchMedia('(hover: hover) and (pointer: fine)').matches}catch(e){}
    var COLS=['#F5531C','#6B1030','#DDD0F7','#FBCDB8','#CFE5C0','#FFB899'];
    function burst(x,y,n){
      if(REDUCE||!document.body.animate)return;
      for(var i=0;i<n;i++){
        var el=document.createElement('div'),s=10+Math.random()*12,sp=Math.random()>.35;
        el.className='pf'+(sp?'':' dot');el.style.width=el.style.height=(sp?s+6:s*.6)+'px';el.style.color=COLS[(Math.random()*COLS.length)|0];
        if(sp)el.innerHTML='<svg viewBox="0 0 24 24"><use href="#i-spark"/></svg>';
        document.body.appendChild(el);
        var a=Math.random()*Math.PI*2,d=34+Math.random()*58,dx=Math.cos(a)*d,dy=Math.sin(a)*d-12,r=(Math.random()*240-120)|0;
        var an=el.animate([{transform:'translate('+x+'px,'+y+'px) scale(.4) rotate(0deg)',opacity:1},{transform:'translate('+(x+dx)+'px,'+(y+dy)+'px) scale(1.1) rotate('+r+'deg)',opacity:1,offset:.45},{transform:'translate('+(x+dx*1.25)+'px,'+(y+dy*1.25+18)+'px) scale(.3) rotate('+(r*1.4|0)+'deg)',opacity:0}],{duration:620+Math.random()*260,easing:'cubic-bezier(.2,.8,.3,1)'});
        an.onfinish=(function(e){return function(){if(e.parentNode)e.parentNode.removeChild(e)}})(el);
      }
    }
    document.addEventListener('click',function(e){
      var big=e.target.closest&&e.target.closest('a,button,[role=slider],.card,.fq');
      burst(e.clientX,e.clientY,big?14:6);
    },true);
    if(!fine||REDUCE)return;
    var cur=$('#cur'),ring=$('#curring'),lab=$('#curlab');if(!cur||!ring)return;
    document.documentElement.classList.add('has-cur');
    var mx=-100,my=-100,rx=-100,ry=-100,seen=false;
    var LAB=[['.ba','Drag'],['.card','Explore'],['.post','Read'],['.feat','Read'],['.proj','Visit'],['.pbig','Visit'],['.ctry','Open'],['.mem','Hi!'],['.reel','Watch']];
    var INT='a,button,[role=slider],.fbtn,label,summary';
    (function frame(){rx+=(mx-rx)*.2;ry+=(my-ry)*.2;cur.style.transform='translate3d('+mx+'px,'+my+'px,0)';ring.style.transform='translate3d('+rx+'px,'+ry+'px,0)';requestAnimationFrame(frame)})();
    document.addEventListener('mousemove',function(e){
      mx=e.clientX;my=e.clientY;
      if(!seen){seen=true;rx=mx;ry=my;cur.classList.add('show');ring.classList.add('show')}
      var t=e.target,txt=t.closest&&t.closest('input,textarea,select');
      cur.classList.toggle('hide',!!txt);ring.classList.toggle('hide',!!txt);
      var l='';for(var i=0;i<LAB.length;i++){if(t.closest&&t.closest(LAB[i][0])){l=LAB[i][1];break}}
      var hov=!!(t.closest&&t.closest(INT));
      ring.classList.toggle('lab',!!l);ring.classList.toggle('hov',hov&&!l);cur.classList.toggle('lab-on',!!l);
      if(lab&&lab.textContent!==l)lab.textContent=l;
    },{passive:true});
    document.addEventListener('mousedown',function(){cur.classList.add('down');ring.classList.add('down')});
    document.addEventListener('mouseup',function(){cur.classList.remove('down');ring.classList.remove('down')});
    document.addEventListener('mouseleave',function(){cur.classList.remove('show');ring.classList.remove('show')});
    document.addEventListener('mouseenter',function(){if(seen){cur.classList.add('show');ring.classList.add('show')}});
  })();
})();
