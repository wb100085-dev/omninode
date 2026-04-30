/* =================== Custom cursor =================== */
(function(){
  const c = document.querySelector('.cursor');
  const r = document.querySelector('.cursor-ring');
  if(!c) return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e=>{
    mx=e.clientX;my=e.clientY;
    c.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function loop(){
    rx += (mx-rx)*.18;
    ry += (my-ry)*.18;
    r.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  // hover targets
  const hov = () => {
    document.querySelectorAll('a, button, [data-cursor], input, textarea, select').forEach(el=>{
      el.addEventListener('mouseenter', ()=>{
        if(el.matches('input, textarea, select')) document.body.classList.add('cursor-text');
        else document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', ()=>document.body.classList.remove('cursor-hover','cursor-text'));
    });
  };
  hov();
  // re-attach when content changes
  window.__rehover = hov;
})();

/* =================== Scroll progress =================== */
const scrollProg = document.getElementById('scrollProg');
let lastScroll = 0;
const nav = document.getElementById('nav');
window.addEventListener('scroll', ()=>{
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const p = Math.min(100, (window.scrollY / h) * 100);
  scrollProg.style.width = p + '%';
  // hide nav on scroll down
  if(window.scrollY > 200){
    if(window.scrollY > lastScroll + 8){nav.classList.add('hidden');}
    else if(window.scrollY < lastScroll - 8){nav.classList.remove('hidden');}
  }
  nav.classList.toggle('scrolled', window.scrollY > 20);
  lastScroll = window.scrollY;
}, {passive:true});

/* =================== Smooth scroll =================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if(href.length < 2) return;
    const t = document.querySelector(href);
    if(t){ e.preventDefault(); window.scrollTo({top:t.offsetTop - 60, behavior:'smooth'}); }
  });
});

/* =================== Reveal on scroll =================== */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      const eb = entry.target.querySelector('.eyebrow');
      if(eb) eb.classList.add('in');
    }
  });
},{threshold:.15, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('.eyebrow').forEach(el => io.observe(el));

/* =================== Hero word-by-word =================== */
(function(){
  const t = document.getElementById('heroTitle');
  // skip — already animated via reveal d1
})();

/* =================== Hero panel bars trigger =================== */
const pcMain = document.getElementById('pcMain');
new IntersectionObserver(es=>es.forEach(en=>en.isIntersecting&&en.target.classList.add('in')),{threshold:.2}).observe(pcMain);

/* =================== Hero parallax (mouse + scroll) =================== */
(function(){
  const visual = document.getElementById('heroVisual');
  if(!visual) return;
  const cards = visual.querySelectorAll('[data-depth]');
  const main = visual.querySelector('.pc-main');
  const hero = document.getElementById('hero');

  visual.addEventListener('mousemove', e=>{
    const r = visual.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - .5;
    const py = (e.clientY - r.top)/r.height - .5;
    cards.forEach(c=>{
      const d = parseFloat(c.dataset.depth || .2);
      c.style.transform = `translate3d(${-px*d*40}px, ${-py*d*40}px, 0)`;
    });
    if(main){
      main.style.transform = `perspective(1000px) rotateY(${px*6}deg) rotateX(${-py*6}deg)`;
    }
  });
  visual.addEventListener('mouseleave', ()=>{
    cards.forEach(c=>c.style.transform='');
    if(main) main.style.transform='';
  });

  // scroll parallax for hero bg
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > window.innerHeight) return;
    const y = window.scrollY * .3;
    const grid = hero.querySelector('.grid-bg');
    if(grid) grid.style.transform = `translateY(${y}px)`;
  }, {passive:true});
})();

/* =================== Hero particles =================== */
(function(){
  const el = document.getElementById('particles');
  if(!el) return;
  for(let i=0;i<14;i++){
    const s = document.createElement('span');
    s.style.left = Math.random()*100 + '%';
    s.style.top = (60 + Math.random()*40) + '%';
    s.style.animationDuration = (8+Math.random()*8) + 's';
    s.style.animationDelay = (-Math.random()*8) + 's';
    s.style.setProperty('--dx', (Math.random()*60-30) + 'px');
    s.style.setProperty('--dy', (-100 - Math.random()*200) + 'px');
    s.style.opacity = (.2 + Math.random()*.3);
    s.style.width = s.style.height = (3 + Math.random()*5) + 'px';
    el.appendChild(s);
  }
})();

/* =================== Hero: char split for title =================== */
(function(){
  const t = document.getElementById('heroTitle');
  if(!t) return;
  // Walk text nodes; wrap each visible char in a span.char with stagger delay
  let idx = 0;
  const wrap = (node) => {
    [...node.childNodes].forEach(child => {
      if(child.nodeType === 3){
        const text = child.textContent;
        if(!text.trim()){ return; }
        const frag = document.createDocumentFragment();
        for(const ch of text){
          if(ch === ' '){ frag.appendChild(document.createTextNode(' ')); continue; }
          const s = document.createElement('span');
          s.className = 'char';
          s.textContent = ch;
          s.style.transitionDelay = (idx * 0.025 + 0.1) + 's';
          idx++;
          frag.appendChild(s);
        }
        child.replaceWith(frag);
      } else if(child.nodeType === 1 && !child.classList.contains('rotating')){
        // Recurse into spans like .underline, .accent — but skip the rotating ticker
        wrap(child);
      }
    });
  };
  wrap(t);
})();


/* =================== Hero: typing question + cycling Q1/Q2/Q3 =================== */
(function(){
  const questions = [
    {
      title: '신제품 <span class="hl">"AI 가상패널"</span> 컨셉에 얼마나 매력을 느끼시나요?',
      labels: ['매우 매력적','매력적','보통','비매력적','전혀'],
      values: [.42,.31,.16,.08,.03]
    },
    {
      title: '월 <span class="hl">19,900원</span> 가격대에 대한 구매 의향은?',
      labels: ['반드시 구매','구매할 것','고민','구매 안 함','전혀'],
      values: [.28,.39,.22,.08,.03]
    },
    {
      title: '리서치 도구 선택 시 <span class="hl">가장 중요한 기준</span>은?',
      labels: ['속도','정확도','가격','신뢰도','UX'],
      values: [.31,.29,.18,.16,.06]
    }
  ];
  const typer = document.getElementById('pcTyper');
  const qNum = document.getElementById('qNum');
  const bars = document.querySelectorAll('#panelBars .pbar');
  const tabs = document.querySelectorAll('#pcTabs button');
  const pcQ = document.getElementById('pcQuestion');
  const pcMain = document.getElementById('pcMain');

  let qi = 0, typing = null;

  function setBars(values, labels){
    bars.forEach((b,i)=>{
      const lbl = b.querySelector('[data-l]');
      const fill = b.querySelector('.fill');
      const pct = b.querySelector('.pct');
      lbl.textContent = labels[i];
      fill.style.setProperty('--w', values[i]);
      // animate count
      const startV = parseInt(pct.textContent) || 0;
      const endV = Math.round(values[i]*100);
      const t0 = performance.now();
      const dur = 900;
      const step = (t)=>{
        const p = Math.min(1,(t-t0)/dur);
        const e = 1 - Math.pow(1-p,3);
        pct.textContent = Math.round(startV + (endV-startV)*e) + '%';
        if(p<1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      b.classList.remove('bump');
      void b.offsetWidth;
      setTimeout(()=>b.classList.add('bump'), 200 + i*80);
    });
  }

  function typeText(html, done){
    // Convert html to a sequence preserving inline tags as-is at boundaries
    // Strip and re-emit char-by-char for plain text, but inject <span class="hl"> markup at chunks
    pcQ.classList.remove('done');
    typer.innerHTML = '';
    // split by tags
    const parts = html.split(/(<[^>]+>)/g).filter(Boolean);
    let buf = '';
    let i = 0, j = 0;
    clearTimeout(typing);
    const tick = () => {
      if(i >= parts.length){ pcQ.classList.add('done'); typer.innerHTML = html; if(done) done(); return; }
      const part = parts[i];
      if(part.startsWith('<')){
        buf += part;
        i++; j = 0;
        typer.innerHTML = buf;
        typing = setTimeout(tick, 10);
        return;
      }
      if(j < part.length){
        buf += part[j++];
        typer.innerHTML = buf;
        typing = setTimeout(tick, 22 + Math.random()*30);
      } else {
        i++; j = 0;
        typing = setTimeout(tick, 30);
      }
    };
    tick();
  }

  function setQ(idx, animate=true){
    qi = idx;
    qNum.textContent = 'Q' + String(idx+1).padStart(2,'0');
    tabs.forEach((t,i)=>t.classList.toggle('active', i===idx));
    const q = questions[idx];
    if(animate){
      typeText(q.title, ()=> setBars(q.values, q.labels));
    } else {
      typer.innerHTML = q.title;
      pcQ.classList.add('done');
      setBars(q.values, q.labels);
    }
  }

  // tabs
  tabs.forEach((t,i)=>t.addEventListener('click', ()=>{
    clearInterval(autoQ);
    setQ(i, true);
    autoQ = setInterval(cycle, 7500);
  }));

  let autoQ = null;
  function cycle(){ setQ((qi+1) % questions.length, true); }

  // start when card visible
  new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in');
      setTimeout(()=>setQ(0, true), 600);
      autoQ = setInterval(cycle, 7500);
    } else {
      clearInterval(autoQ);
    }
  }),{threshold:.2}).observe(pcMain);
})();

/* =================== Hero: respondent toast popups =================== */
(function(){
  const wrap = document.getElementById('heroToasts');
  if(!wrap) return;
  const PEOPLE = [
    {av:'서', name:'P_4291', meta:'30대 · 여성 · 서울'},
    {av:'부', name:'P_8812', meta:'40대 · 남성 · 부산'},
    {av:'인', name:'P_0214', meta:'20대 · 여성 · 인천'},
    {av:'대', name:'P_5523', meta:'50대 · 남성 · 대구'},
    {av:'광', name:'P_7791', meta:'30대 · 남성 · 광주'},
    {av:'경', name:'P_2103', meta:'20대 · 여성 · 경기'},
    {av:'울', name:'P_6644', meta:'40대 · 여성 · 울산'},
    {av:'제', name:'P_3057', meta:'30대 · 남성 · 제주'},
  ];
  let i = 0;
  function spawn(){
    if(document.hidden) return;
    const p = PEOPLE[i++ % PEOPLE.length];
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `
      <div class="av">${p.av}</div>
      <div>
        <div><strong>${p.name}</strong> 응답 완료</div>
        <div class="meta">${p.meta}</div>
      </div>
    `;
    wrap.appendChild(t);
    setTimeout(()=>t.remove(), 5200);
    // keep max 3
    while(wrap.children.length > 3){ wrap.firstChild.remove(); }
  }
  // start after a delay
  let toastTimer = null;
  function start(){
    if(toastTimer) return;
    setTimeout(spawn, 2400);
    toastTimer = setInterval(spawn, 3800);
  }
  function stop(){ clearInterval(toastTimer); toastTimer = null; }
  // Only run while hero is visible
  const hero = document.getElementById('hero');
  new IntersectionObserver(es=>es.forEach(en=>{
    if(en.isIntersecting) start(); else stop();
  }),{threshold:.2}).observe(hero);
})();

/* =================== Cursor trail =================== */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  let last = 0;
  document.addEventListener('mousemove', e=>{
    const now = performance.now();
    if(now - last < 60) return;
    last = now;
    const d = document.createElement('span');
    d.className = 'trail-dot';
    d.style.left = e.clientX + 'px';
    d.style.top = e.clientY + 'px';
    document.body.appendChild(d);
    setTimeout(()=>d.remove(), 720);
  });
})();

/* =================== Magnetic CTA buttons =================== */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      btn.style.transform = `translate(${x*0.18}px, ${y*0.28}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = ''; });
    // ripple on click
    btn.addEventListener('click', e=>{
      const r = btn.getBoundingClientRect();
      const rip = document.createElement('span');
      rip.className = 'ripple';
      const size = Math.max(r.width, r.height);
      rip.style.width = rip.style.height = size + 'px';
      rip.style.left = (e.clientX - r.left - size/2) + 'px';
      rip.style.top = (e.clientY - r.top - size/2) + 'px';
      btn.appendChild(rip);
      setTimeout(()=>rip.remove(), 720);
    });
  });
})();

/* =================== Hero stat number scramble on reveal =================== */
(function(){
  const els = document.querySelectorAll('.hero-stat [data-count]');
  const chars = '0123456789';
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count, 10);
      // Phase 1: scramble for ~700ms with random digits
      let frame = 0;
      const dur = 38; // frames at ~16ms = ~600ms
      const startW = String(target).length;
      const tick = () => {
        if(frame < dur){
          let s = '';
          for(let i=0;i<startW;i++) s += chars[Math.floor(Math.random()*10)];
          el.textContent = s;
          frame++;
          requestAnimationFrame(tick);
        } else {
          // count up smoothly
          const t0 = performance.now();
          const cd = 700;
          const up = (t)=>{
            const p = Math.min(1,(t-t0)/cd);
            const e = 1 - Math.pow(1-p,3);
            el.textContent = Math.round(target * e);
            if(p<1) requestAnimationFrame(up);
            else el.textContent = target;
          };
          requestAnimationFrame(up);
        }
      };
      el.classList.add('scramble');
      tick();
      obs.unobserve(el);
    });
  },{threshold:.6});
  els.forEach(el => obs.observe(el));
  // remove the existing data-count count-up so it doesn't fight us
  els.forEach(el => el.removeAttribute('data-count'));
})();

/* =================== Tilt cards on hover (tech, paper, person, feat, pain) =================== */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const sel = '.tech-card, .paper, .person, .feat, .pain-card';
  document.querySelectorAll(sel).forEach(card=>{
    card.style.transformStyle = 'preserve-3d';
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - .5;
      const py = (e.clientY - r.top)/r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${px*4}deg) rotateX(${-py*4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });
})();

/* =================== How steps trigger =================== */
const howSteps = document.getElementById('howSteps');
new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      en.target.classList.add('in');
      en.target.querySelectorAll('.step').forEach((s,i)=>{
        setTimeout(()=>s.classList.add('in'), 200 + i*300);
      });
    }
  });
},{threshold:.3}).observe(howSteps);

/* =================== Count up =================== */
const statIo = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      if(isNaN(target)){ statIo.unobserve(el); return; }
      const dur = 1400; const start = performance.now();
      const decimals = (el.dataset.count.split('.')[1]||'').length;
      const tick = (t) => {
        const p = Math.min(1,(t-start)/dur);
        const eased = 1 - Math.pow(1-p,3);
        const v = (target * eased).toFixed(decimals);
        el.textContent = Number(v).toLocaleString('ko-KR');
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      statIo.unobserve(el);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el => statIo.observe(el));

/* =================== Live counter (Hero) =================== */
(function(){
  const cnt = document.getElementById('liveCount');
  const dlt = document.getElementById('liveDelta');
  if(!cnt) return;
  let n = 2847;
  let d = 124;
  setInterval(()=>{
    if(document.hidden) return;
    const inc = 1 + Math.floor(Math.random()*4);
    n += inc;
    d = Math.max(80, Math.min(220, d + Math.floor(Math.random()*7)-3));
    cnt.textContent = n.toLocaleString('ko-KR');
    dlt.textContent = d;
  }, 1800);
})();

/* =================== Progress dots & active section =================== */
const dots = document.querySelectorAll('.progress button');
dots.forEach(d => d.addEventListener('click', ()=>{
  const t = document.querySelector(d.dataset.target);
  if(t) window.scrollTo({top:t.offsetTop - 60, behavior:'smooth'});
}));
const sectionIds = ['#hero','#problem','#solution','#tech','#features','#how','#cases','#research','#story','#team','#compare','#contact'];
const sections = sectionIds.map(s=>document.querySelector(s));
const navAnchors = {
  '#problem': document.querySelector('.nav-links a[href="#problem"]'),
  '#solution': document.querySelector('.nav-links a[href="#solution"]'),
  '#tech': document.querySelector('.nav-links a[href="#tech"]'),
  '#how': document.querySelector('.nav-links a[href="#how"]'),
  '#cases': document.querySelector('.nav-links a[href="#cases"]'),
  '#research': document.querySelector('.nav-links a[href="#research"]'),
  '#story': document.querySelector('.nav-links a[href="#story"]'),
  '#team': document.querySelector('.nav-links a[href="#team"]'),
};
const progIo = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const idx = sections.indexOf(en.target);
      const id = sectionIds[idx];
      dots.forEach((d,i)=>d.classList.toggle('active', i===idx));
      Object.entries(navAnchors).forEach(([k,a])=>{ if(a) a.classList.toggle('active', k===id); });
    }
  });
},{threshold:.4});
sections.forEach(s => s && progIo.observe(s));

/* =================== Pain card mouse glow =================== */
document.querySelectorAll('.pain-card, .feat').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width)*100 + '%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height)*100 + '%');
  });
});

/* =================== Use cases =================== */
const caseData = [
  {
    label: 'FOR STARTUPS',
    title: '아이디어를 출시 전에 검증하세요.',
    desc: '신제품 컨셉, 가격, 메시지, 패키징—론칭 전에 빠르게 시장 반응을 시뮬레이션합니다. 한정된 자원을 가장 가능성 높은 방향에 집중할 수 있습니다.',
    bullets:['신제품 컨셉 테스트 & 가격 민감도 분석','브랜드 네이밍·메시지 A/B 검증','타겟 페르소나 발견 & 시장 사이징','PMF 가설 빠른 반복 검증'],
    stats:[{l:'평균 검증 기간', v:'15', u:'분'},{l:'주요 의사결정 비용', v:'-90', u:'%'},{l:'반복 검증 횟수', v:'10', u:'+회/월'}]
  },
  {
    label: 'FOR PUBLIC SECTOR',
    title: '시민 의견을 정책에 반영하세요.',
    desc: '주민 설문, 정책 수용도 조사, 공공 캠페인 메시지 검증. 표본 모집의 한계 없이 인구통계를 정확히 반영한 패널로 정책 근거를 마련합니다.',
    bullets:['정책 수용도 사전 진단','공공 캠페인 메시지·크리에이티브 테스트','지역별·계층별 인식 격차 분석','예산 집행 전 효과 시뮬레이션'],
    stats:[{l:'커버 인구통계', v:'100', u:'%'},{l:'리서치 단가', v:'1/10', u:''},{l:'결과 도출 시간', v:'당일', u:''}]
  },
  {
    label: 'FOR INCUBATORS · LABS',
    title: '연구와 창업보육에 데이터를 더하세요.',
    desc: '입주기업의 시장 검증, 창업 아이템 평가, 학술 연구의 사전 조사·예비 조사 단계를 지원합니다. 보육 프로그램 차별화 포인트를 만듭니다.',
    bullets:['입주·예비 창업팀 시장 검증 지원','창업 아이템 사업화 가능성 평가','연구 논문 사전조사·예비조사','데모데이 IR 자료 데이터 보강'],
    stats:[{l:'팀당 검증 단가', v:'무료', u:''},{l:'동시 지원 가능', v:'무제한', u:''},{l:'데이터 활용 보고서', v:'PDF', u:'/CSV'}]
  }
];
const renderCase = (i) => {
  const c = caseData[i];
  const cc = document.getElementById('caseContent');
  cc.classList.remove('switching');
  void cc.offsetWidth;
  cc.classList.add('switching');
  cc.innerHTML = `
    <div class="label">${c.label}</div>
    <h3>${c.title}</h3>
    <p>${c.desc}</p>
    <ul class="case-list">
      ${c.bullets.map(b=>`<li>${b}</li>`).join('')}
    </ul>
  `;
  document.getElementById('caseSide').innerHTML = c.stats.map(s=>`
    <div class="case-stat">
      <div class="l">${s.l}</div>
      <div class="v">${s.v}<small>${s.u}</small></div>
    </div>
  `).join('');
  if(window.__rehover) window.__rehover();
};
renderCase(0);
let caseAuto = null;
let currentCase = 0;
const startCaseAuto = () => {
  clearInterval(caseAuto);
  caseAuto = setInterval(()=>{
    currentCase = (currentCase + 1) % caseData.length;
    document.querySelectorAll('#caseTabs .case-tab').forEach((x,i)=>x.classList.toggle('active', i===currentCase));
    renderCase(currentCase);
  }, 6500);
};
document.querySelectorAll('#caseTabs .case-tab').forEach(t=>{
  t.addEventListener('click', ()=>{
    clearInterval(caseAuto);
    document.querySelectorAll('#caseTabs .case-tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    currentCase = parseInt(t.dataset.case,10);
    renderCase(currentCase);
    startCaseAuto();
  });
});
// only auto-rotate when section is visible
const casesSection = document.getElementById('cases');
new IntersectionObserver((es)=>{
  es.forEach(e=>{ if(e.isIntersecting) startCaseAuto(); else clearInterval(caseAuto); });
},{threshold:.3}).observe(casesSection);

/* =================== Compare slider toggle =================== */
const cmpMode = document.getElementById('cmpMode');
const cmpTable = document.getElementById('cmpTable');
const cmpVisual = document.getElementById('cmpVisual');
cmpMode.querySelectorAll('button').forEach(b=>{
  b.addEventListener('click', ()=>{
    cmpMode.querySelectorAll('button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    const m = b.dataset.mode;
    cmpTable.style.display = m==='table'?'':'none';
    cmpVisual.style.display = m==='visual'?'':'none';
  });
});

/* =================== Compare slider drag =================== */
(function(){
  const slider = document.getElementById('cmpSlider');
  const handle = document.getElementById('cmpHandle');
  const after = document.getElementById('cmpAfter');
  if(!slider) return;
  let dragging = false;
  const setX = (x) => {
    const r = slider.getBoundingClientRect();
    const p = Math.max(4, Math.min(96, ((x - r.left)/r.width)*100));
    handle.style.left = p + '%';
    after.style.setProperty('--clip', p + '%');
  };
  const start = (e) => { dragging = true; e.preventDefault(); };
  const move = (e) => {
    if(!dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setX(x);
  };
  const end = () => dragging = false;
  handle.addEventListener('mousedown', start);
  handle.addEventListener('touchstart', start, {passive:false});
  slider.addEventListener('mousedown', e=>{ start(e); setX(e.clientX); });
  document.addEventListener('mousemove', move);
  document.addEventListener('touchmove', move, {passive:true});
  document.addEventListener('mouseup', end);
  document.addEventListener('touchend', end);

  // animate handle when slider becomes visible
  new IntersectionObserver((es)=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        let dir = 1, p = 50;
        const tick = () => {
          if(dragging) return;
          p += dir * .2;
          if(p>=70||p<=30) dir*=-1;
          handle.style.left = p + '%';
          after.style.setProperty('--clip', p + '%');
        };
        const id = setInterval(tick, 30);
        // stop after 4 seconds (let user take over)
        setTimeout(()=>clearInterval(id), 4000);
      }
    });
  },{threshold:.5}).observe(slider);
})();

/* =================== Form: validate + success =================== */
function submitContact(e){
  e.preventDefault();
  const success = document.getElementById('formSuccess');
  success.classList.add('show');
  setTimeout(()=>{
    success.classList.remove('show');
    e.target.reset();
    document.querySelectorAll('.field').forEach(f=>f.classList.remove('valid'));
  }, 3200);
  return false;
}
// live validate
document.querySelectorAll('#contactForm input, #contactForm select').forEach(inp=>{
  const check = () => {
    const f = inp.closest('.field');
    if(!f) return;
    let ok = false;
    if(inp.type==='email'){ ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value); }
    else if(inp.tagName==='SELECT'){ ok = inp.value !== ''; }
    else { ok = inp.value.trim().length >= 2; }
    f.classList.toggle('valid', ok);
  };
  inp.addEventListener('input', check);
  inp.addEventListener('change', check);
});

/* =================== Theme toggle =================== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
const sunIcon = `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>`;
const setTheme = (t) => {
  document.documentElement.setAttribute('data-theme', t);
  themeIcon.innerHTML = t==='dark' ? sunIcon : moonIcon;
  try{ localStorage.setItem('omninode-theme', t); }catch(e){}
};
themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur==='dark'?'light':'dark');
});
try{
  const saved = localStorage.getItem('omninode-theme');
  if(saved) setTheme(saved);
}catch(e){}

/* =================== Keyboard shortcuts =================== */
const kbdHint = document.getElementById('kbdHint');
setTimeout(()=>kbdHint.classList.add('show'), 2500);
setTimeout(()=>kbdHint.classList.remove('show'), 8000);

document.addEventListener('keydown', e=>{
  if(e.target.matches('input, textarea, select')) return;
  const k = e.key.toLowerCase();
  if(k>='1' && k<='8'){
    const idx = parseInt(k,10)-1;
    const t = sections[idx];
    if(t) window.scrollTo({top:t.offsetTop - 60, behavior:'smooth'});
  } else if(k==='t'){
    themeToggle.click();
  } else if(k==='?'){
    kbdHint.classList.toggle('show');
  }
});

/* =================== Init nav state =================== */
nav.classList.toggle('scrolled', window.scrollY > 20);