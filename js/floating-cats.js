// Floating cats with WEBP image support (side spawn + wandering)
(function(){
  // Use your provided webp filenames in img/
  const CAT_WEBPS = [
    'gif1.webp',
    'gif2.webp',
    'gif3.webp',
    'gif4.webp',
    'gif5.webp',
    'gif6.webp',
    'gif7.webp'
  ];
  const EMOJI_FALLBACK = ['🐱','😸','😹','😺','😻','😼','🙀','😿','😾','🐈','🐈\u200d⬛'];

  const MIN_DELAY = 3000;
  const MAX_DELAY = 4200;
  const MAX_ACTIVE = 5;
  const LIFESPAN = 10000; // ms wandering
  const EDGE_MARGIN = 40;

  function rand(min,max){ return Math.random()*(max-min)+min; }
  function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  const active = new Set();
  let rafId = null;
  let enabled = true;

  function makeCatElement(){
    const el = document.createElement('div');
    el.className = 'floating-cat';
    // Always use webp images since we have them
    const img = document.createElement('img');
    img.decoding = 'async';
    img.loading = 'lazy';
    const file = pick(CAT_WEBPS);
    img.src = 'img/' + file;
    img.alt = 'Cat';
    
    // Debug logging
    console.log('Trying to load:', img.src);
    
    img.onload = function() {
      console.log('Successfully loaded:', img.src);
    };
    
    img.onerror = function() {
      // If image fails to load, fallback to emoji
      console.log('Failed to load:', img.src, '- falling back to emoji');
      el.innerHTML = pick(EMOJI_FALLBACK);
      sizeVariant(el);
    };
    // random size scaling
    const base = rand(56, 100);
    el.style.setProperty('--w', base + 'px');
    el.style.setProperty('--h', Math.round(base * rand(0.8,1.2)) + 'px');
    el.appendChild(img);
    return el;
  }

  function spawn(){
    if (!enabled) return;
    if (document.hidden){ schedule(); return; }
    if (active.size >= MAX_ACTIVE){ schedule(); return; }

    const el = makeCatElement();
    const fromLeft = Math.random() < 0.5;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let x = fromLeft ? -70 : vw + 70;
    let y = rand(EDGE_MARGIN, vh - EDGE_MARGIN);

    let speed = rand(40, 120);
    let angle = rand(-60, 60) * (Math.PI/180);
    let vx = Math.cos(angle) * speed * (fromLeft ? 1 : -1);
    let vy = Math.sin(angle) * speed;

    const catState = { el, x, y, vx, vy, born: performance.now(), removing:false };
    active.add(catState);

    el.style.transform = `translate(${x}px, ${y}px)`;
    document.body.appendChild(el);
    requestAnimationFrame(()=> el.classList.add('show'));

    setTimeout(()=> fadeOut(catState), LIFESPAN);
    ensureLoop();
    schedule();
  }

  function sizeVariant(el){
    const r = Math.random();
    if (r < .25) el.classList.add('small'); 
    else if (r > .8 && r <= .95) el.classList.add('large'); 
    else if (r > .95) el.classList.add('extra-large');
  }

  function fadeOut(state){
    if (state.removing) return;
    state.removing = true;
    state.el.classList.remove('show');
    setTimeout(()=> {
      if (state.el.parentNode) state.el.remove();
      active.delete(state);
    }, 400);
  }

  function loop(ts){
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    active.forEach(state => {
      if (state.removing) return;
      if(!state.last) state.last = ts;
      const dt = (ts - state.last)/1000;
      state.last = ts;

      state.vx += rand(-10,10) * dt;
      state.vy += rand(-10,10) * dt;

      state.x += state.vx * dt;
      state.y += state.vy * dt;

      const minX = EDGE_MARGIN;
      const maxX = vw - EDGE_MARGIN - 60;
      const minY = EDGE_MARGIN;
      const maxY = vh - EDGE_MARGIN - 60;

      if (state.x < minX){ state.x = minX; state.vx = Math.abs(state.vx); }
      if (state.x > maxX){ state.x = maxX; state.vx = -Math.abs(state.vx); }
      if (state.y < minY){ state.y = minY; state.vy = Math.abs(state.vy); }
      if (state.y > maxY){ state.y = maxY; state.vy = -Math.abs(state.vy); }

      state.el.style.transform = `translate(${Math.round(state.x)}px, ${Math.round(state.y)}px)`;
    });

    if (active.size > 0 && enabled){
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  function ensureLoop(){ if (!rafId) rafId = requestAnimationFrame(loop); }

  function schedule(){ if (!enabled) return; setTimeout(spawn, rand(MIN_DELAY, MAX_DELAY)); }

  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'c') {
      enabled = !enabled;
      if (!enabled){ active.forEach(st => fadeOut(st)); }
      else { schedule(); ensureLoop(); }
    }
  });

  window.addEventListener('DOMContentLoaded', schedule);
})();