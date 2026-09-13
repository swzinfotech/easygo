// Progressive enhancement: all comparison topics remain readable without JS.
document.querySelectorAll('[data-house-explorer]').forEach(explorer => {
  const buttons = [...explorer.querySelectorAll('[data-house-topic]')];
  const panels = [...explorer.querySelectorAll('[data-house-panel]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let transition;
  function select(index) {
    transition?.cancel();
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    if (!reducedMotion.matches) transition = panels[index].animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 280, easing: 'ease-out' }
    );
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      buttons[next].focus();
      select(next);
    });
  });
  explorer.classList.add('is-interactive');
  select(0);
});

// One official LINE destination is shared by the desktop header and mobile shortcut.
(() => {
  const lineProfileUrl = 'https://linevoom.line.me/user/_dbH3Ce6MhVuriSjEwakFIpOkiSy2cQiqDNBrozk?&utm_medium=windows&utm_source=desktop&utm_campaign=OA_Profile';
  const facebookPageUrl = 'https://www.facebook.com/jenwagroup/?locale=zh_TW';
  const desktopLine = document.querySelector('.header-social a[aria-label="LINE"]');
  const desktopFacebook = document.querySelector('.header-social a[aria-label="Facebook"]');
  if (desktopLine) desktopLine.href = lineProfileUrl;
  if (desktopFacebook) desktopFacebook.href = facebookPageUrl;

  const mobileLine = document.createElement('a');
  mobileLine.className = 'mobile-line-float';
  mobileLine.href = lineProfileUrl;
  mobileLine.target = '_blank';
  mobileLine.rel = 'noopener noreferrer';
  mobileLine.setAttribute('aria-label', '前往易立構 LINE 官方頁');
  mobileLine.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 10.2c0-3.7-3.9-6.7-8.8-6.7s-8.8 3-8.8 6.7c0 3.3 3.1 6.1 7.3 6.6.3.1.7.2.8.4.1.2.1.6.1.8l-.1.8c0 .2-.2 1 .8.5a28 28 0 0 0 6.8-5c1.3-1.3 2-2.6 2-4.1ZM8.3 13.4H6.5c-.3 0-.5-.2-.5-.5V8c0-.3.2-.5.5-.5s.5.2.5.5v4.4h1.3c.3 0 .5.2.5.5s-.2.5-.5.5Zm2.1-.5c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8c0-.3.2-.5.5-.5s.5.2.5.5v4.9Zm5.1 0c0 .2-.1.4-.3.5h-.2c-.2 0-.3-.1-.4-.2l-2.2-3v2.7c0 .3-.2.5-.5.5s-.5-.2-.5-.5V8c0-.2.1-.4.3-.5h.2c.2 0 .3.1.4.2l2.2 3V8c0-.3.2-.5.5-.5s.5.2.5.5v4.9Zm2.4-4.4h-1.3v1h1.3c.3 0 .5.2.5.5s-.2.5-.5.5h-1.3v1h1.3c.3 0 .5.2.5.5s-.2.5-.5.5h-1.8c-.3 0-.5-.2-.5-.5V8c0-.3.2-.5.5-.5h1.8c.3 0 .5.2.5.5s-.2.5-.5.5Z"/></svg>';
  document.body.append(mobileLine);

  const mobileFacebook = document.createElement('a');
  mobileFacebook.className = 'mobile-facebook-float';
  mobileFacebook.href = facebookPageUrl;
  mobileFacebook.target = '_blank';
  mobileFacebook.rel = 'noopener noreferrer';
  mobileFacebook.setAttribute('aria-label', '前往易立構 Facebook 粉絲專頁');
  mobileFacebook.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V4a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.4Z"/></svg>';
  document.body.append(mobileFacebook);
})();

// Group the material notes by the part of the structure shown in the diagram above.
(() => {
  const grid = document.querySelector('.structure-detail-grid');
  if (!grid) return;
  const cards = [...grid.children];
  const zones = [
    ['01', '屋頂與排水', '對照圖面上方：屋頂平台、防水與排水系統', 'roof.png', 0, 5],
    ['02', '鋼構與配管', '對照圖面中段：主結構框與預留配管空間', 'steal.png', 5, 7],
    ['03', '樓板與防潮', '對照圖面下方：樓板、隔潮與地表完成面', 'floor.png', 7, 12],
    ['04', '牆體與填充', '對照圖面側面：外牆板、保溫與隔音填充', 'wall.png', 12, 16]
  ];
  grid.classList.add('is-zoned');
  zones.forEach(([number, title, note, image, start, end]) => {
    const zone = document.createElement('section');
    zone.className = 'structure-zone';
    zone.innerHTML = `<header><span>${number}</span><div><h4>${title}</h4><p>${note}</p></div></header><figure class="structure-zone-visual"><img src="assets/product/${image}" alt="${title}結構圖對照" loading="lazy" decoding="async"></figure><div class="structure-zone-cards"></div>`;
    const zoneCards = zone.querySelector('.structure-zone-cards');
    cards.slice(start, end).forEach(card => zoneCards.append(card));
    grid.append(zone);
  });
})();

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); menu.textContent = '選單 ☰'; }
menu.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded', String(open)); menu.textContent = open ? '關閉 ×' : '選單 ☰'; });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); } });
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('[data-category]').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  document.querySelector('#filter-status').textContent = `顯示 ${document.querySelectorAll('[data-category]:not([hidden])').length} 個空間提案`;
}));
// Case gallery: photos stay local to the site and can be browsed without leaving the page.
(() => {
  const gallery = document.querySelector('.case-gallery');
  if (!gallery) return;
  const image = gallery.querySelector('[data-gallery-image]');
  const caption = gallery.querySelector('[data-gallery-caption]');
  const title = gallery.querySelector('[data-gallery-title]');
  const thumbnails = gallery.querySelector('[data-gallery-thumbnails]');
  let images = [], label = '', current = 0;
  const render = () => {
    image.src = images[current];
    image.alt = `${label}，照片 ${current + 1}`;
    caption.textContent = `${current + 1} / ${images.length}`;
    thumbnails.innerHTML = images.map((src, index) => `<button type="button" data-gallery-index="${index}" aria-label="查看第 ${index + 1} 張照片" aria-current="${index === current}"><img src="${src}" alt=""></button>`).join('');
    thumbnails.querySelectorAll('[data-gallery-index]').forEach(button => button.addEventListener('click', () => {
      current = Number(button.dataset.galleryIndex);
      render();
    }));
  };
  const move = direction => { current = (current + direction + images.length) % images.length; render(); };
  document.querySelectorAll('[data-gallery-images]').forEach(button => button.addEventListener('click', () => {
    images = button.dataset.galleryImages.split('|');
    label = button.dataset.galleryLabel;
    title.textContent = `${label} / PHOTO GALLERY`;
    current = 0;
    render();
    gallery.showModal();
  }));
  gallery.querySelector('.gallery-close').addEventListener('click', () => gallery.close());
  gallery.querySelector('.gallery-previous')?.addEventListener('click', () => move(-1));
  gallery.querySelector('.gallery-next')?.addEventListener('click', () => move(1));
  gallery.addEventListener('click', event => { if (event.target === gallery) gallery.close(); });
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
})();

// Inquiry form: submits to the Azure Function that notifies the LINE bot (03_AzureFunction).
// The consultation sheet download stays available and remains entirely local.
(() => {
  const form = document.querySelector('#inquiry-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  const endpoint = document.querySelector('meta[name="inquiry-api"]')?.content || '';
  const labels = {name:'姓名',phone:'聯絡電話',email:'電子信箱',location:'基地縣市／地區',purpose:'規劃用途',message:'需求說明'};
  // How long the visitor spent on the form; the server treats an instant submit as automated.
  const openedAt = performance.now();
  const setStatus = (text, state) => { status.textContent = text; if (state) status.dataset.state = state; else delete status.dataset.state; };

  form.querySelector('[data-download]')?.addEventListener('click', () => {
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const text = ['易立構｜場勘諮詢單', '此檔案由您自行保存，尚未送出申請。', '', ...Object.entries(labels).map(([key,label]) => `${label}：${data.get(key) || '未填寫'}`)].join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF',text], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a'); link.href = url; link.download = '易立構-場勘諮詢單.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus('諮詢單已產生，請保存下載檔案。此動作不會送出資料；要預約場勘請按「送出場勘諮詢」。');
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!endpoint) { setStatus('目前無法送出，請改按「下載諮詢單」保存需求。', 'error'); return; }
    const data = new FormData(form);
    const payload = {elapsed: Math.round(performance.now() - openedAt)};
    for (const key of [...Object.keys(labels), 'company_url']) payload[key] = (data.get(key) || '').toString().trim();

    const submit = form.querySelector('button[type="submit"]');
    const label = submit.innerHTML;
    submit.disabled = true; submit.textContent = '送出中…';
    setStatus('正在送出您的需求…');
    try {
      const response = await fetch(endpoint, {method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)});
      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        form.reset();
        setStatus('已收到您的諮詢，我們會盡快與您聯繫確認場勘時間。', 'ok');
      } else {
        setStatus(result.error || '送出失敗，請稍後再試，或改按「下載諮詢單」保存需求。', 'error');
      }
    } catch (error) {
      // fetch rejects identically for an offline network and for a blocked CORS response,
      // so log the real cause: a wrong Origin is otherwise indistinguishable from being offline.
      console.error('諮詢表單送出失敗', endpoint, error);
      setStatus('目前無法連線，請稍後再試，或改按「下載諮詢單」保存需求。', 'error');
    } finally {
      submit.disabled = false; submit.innerHTML = label;
    }
  });
})();

// Homepage: dots on desktop and previous/next arrows on mobile.
(() => {
  const hero = document.querySelector('main > .hero');
  const img = hero?.querySelector('img');
  if (!img) return;
  const slides = ["assets/hero/064c6f25-f428-4624-90b1-db024db8bfd8-right.png", "assets/hero/53b711f2-6464-48be-8b0e-d01b4af01e80-right.png", "assets/hero/595aa949-f336-4101-ba1e-92ed74d235e0-right.png", "assets/hero/hero-blue-house.png", "assets/hero/hero-courtyard.png"];
  const slideCopy = [
    { eyebrow: 'BUILD A BETTER SPACE', title: '不只是建築，<br>而是更好的<br>空間解決方案。', mobileTitle: '更好的空間解決方案，<br>不只是建築。', description: '組合屋規劃・結構設計・空間配置<br>以專業，回應每一種生活需求。' },
    { eyebrow: 'SPACE FOR EVERYDAY', title: '為每一種生活，<br>找到合適的<br>空間尺度。', description: '從使用習慣出發，梳理動線與配置，<br>讓空間貼近日常的節奏。' },
    { eyebrow: 'DESIGNED TO LAST', title: '從結構開始，<br>讓自在的日常<br>慢慢發生。', description: '兼顧穩定、採光與生活細節，<br>打造可長久使用的建築空間。' },
    { eyebrow: 'FLEXIBLE BY DESIGN', title: '可彈性成長的<br>空間，回應<br>每一次改變。', description: '依基地、用途與未來需求，<br>規劃更有餘裕的空間方案。' },
    { eyebrow: 'MAKE ROOM FOR LIFE', title: '一座建築，<br>承接更好的<br>生活想像。', description: '讓結構、設計與生活彼此呼應，<br>成為專屬於你的理想場域。' }
  ];
  const caption = hero.querySelector('figcaption');
  const eyebrow = hero.querySelector('.hero-copy .eyebrow');
  const title = hero.querySelector('.hero-copy h1');
  const mobileTitle = hero.querySelector('.hero-mobile-title');
  const description = hero.querySelector('.hero-description');
  const bottom = hero.querySelector('.hero-bottom');
  const indexLabel = hero.querySelector('.hero-index > span');
  hero.classList.add('has-carousel');
  hero.setAttribute('aria-roledescription', '輪播');
  hero.setAttribute('aria-label', '生活空間主視覺');
  const controls = document.createElement('div');
  controls.className = 'hero-carousel-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', '選擇主視覺圖片');
  controls.innerHTML = `${slides.map((slide, i) => `<button class="hero-carousel-dot" type="button" data-slide="${i}" aria-label="第 ${i + 1} 張，共 5 張" aria-pressed="${i === 0}"></button>`).join('')}<button class="hero-carousel-arrow hero-carousel-prev" type="button" data-direction="previous" aria-label="上一張">‹</button><button class="hero-carousel-arrow hero-carousel-next" type="button" data-direction="next" aria-label="下一張">›</button>`;
  hero.append(controls);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 800px)');
  let current = 0, timer, hovering = false, request = 0, paused = reduced.matches;
  const syncTimer = () => {
    clearInterval(timer);
    if (!paused && !hovering && !document.hidden && !hero.contains(document.activeElement)) timer = setInterval(() => show(current + 1), 6000);
  };
  const render = () => {
    const copy = slideCopy[current];
    img.dataset.composition = 'right';
    img.src = slides[current];
    img.alt = `組合屋建築情境示意 ${current + 1}`;
    if (eyebrow) eyebrow.textContent = copy.eyebrow;
    if (title) title.innerHTML = copy.title;
    if (mobileTitle) { mobileTitle.innerHTML = copy.mobileTitle || copy.title; mobileTitle.classList.toggle('is-compact', Boolean(copy.mobileTitle)); }
    if (description) description.innerHTML = copy.description;
    const number = String(current + 1).padStart(2, '0');
    controls.querySelectorAll('[data-slide]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    if (indexLabel) indexLabel.textContent = `${number} — 05`;
    if (caption) caption.innerHTML = `<span>SPACE STUDY / ${number}</span><span>組合屋建築情境示意</span>`;
    if (bottom) bottom.innerHTML = `<span>${number} <span class="line"></span> THE WAY WE LIVE</span><span>組合屋建築情境示意<br>SCROLL TO EXPLORE ↓</span>`;
  };
  const show = async (next, direction = 1) => {
    const token = ++request;
    const target = (next + slides.length) % slides.length;
    const preload = new Image();
    preload.src = slides[target];
    try { await preload.decode(); } catch { return; }
    if (token !== request) return;
    current = target;
    render();
    if (!reduced.matches) {
      const start = `${direction * 100}%`;
      img.animate([{transform: `translateX(${start})`, opacity: .35}, {transform: 'translateX(0)', opacity: 1}], {duration: 420, easing: 'cubic-bezier(.22,.61,.36,1)'});
    }
    syncTimer();
  };
  controls.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
    paused = true;
    syncTimer();
    const target = Number(button.dataset.slide);
    const forward = (target - current + slides.length) % slides.length;
    const direction = forward === 0 || forward <= slides.length / 2 ? 1 : -1;
    show(target, direction);
  }));
  controls.querySelector('[data-direction="previous"]')?.addEventListener('click', () => {
    paused = true;
    show(current - 1, -1);
  });
  controls.querySelector('[data-direction="next"]')?.addEventListener('click', () => {
    paused = true;
    show(current + 1, 1);
  });
  const visual = hero.querySelector('.hero-visual');
  let touchStart;
  visual?.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  visual?.addEventListener('touchend', event => {
    if (!mobile.matches || !touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    touchStart = undefined;
    if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    paused = true;
    show(current + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
  }, { passive: true });
  controls.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const next = (Number(event.target.dataset.slide) + (event.key === 'ArrowLeft' ? -1 : 1) + slides.length) % slides.length;
      const button = controls.querySelector(`[data-slide="${next}"]`);
      button.focus();
      button.click();
    }
  });
  hero.addEventListener('mouseenter', () => { hovering = true; syncTimer(); });
  hero.addEventListener('mouseleave', () => { hovering = false; syncTimer(); });
  hero.addEventListener('focusin', syncTimer);
  hero.addEventListener('focusout', () => setTimeout(syncTimer, 0));
  document.addEventListener('visibilitychange', syncTimer);
  reduced.addEventListener('change', () => { paused = reduced.matches; syncTimer(); });
  render();
  syncTimer();
})();
