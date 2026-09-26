/* Демо-оболонка: перемикач варіантів/сторінок, перехоплення посилань.
 * На сторінці задано window.MS_DEMO = { site, variant, page, mobile, variants, pages, map } (див. tools/build-demo.mjs). */
(function () {
  'use strict';
  var D = window.MS_DEMO;
  if (!D) return;

  function pageUrl(variant, page, mobile) {
    return D.site + 'demo/' + variant + '/' + (mobile ? 'm/' : '') + page + '.html';
  }

  // Посилання: сторінки з демо — всередині демо, решта — підказка з посиланням на живий сайт
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.closest('.msd')) return;
    var href = a.getAttribute('href') || '';
    if (/^(#|javascript:|tel:|mailto:)/i.test(href)) return;
    var u;
    try { u = new URL(a.href); } catch (err) { return; }
    if (!/(^|\.)motoshop\.ua$/.test(u.hostname)) return; // соцмережі тощо — як є
    e.preventDefault();
    var path = u.pathname.replace(/^\/(ru|en)\//, '/uk/');
    var target = D.map[path];
    if (target) { location.href = pageUrl(D.variant, target, D.mobile); return; }
    toast(u.href);
  }, true);

  // форми (пошук, фільтр, кошик) у демо не працюють
  document.addEventListener('submit', function (e) {
    if (e.target.closest('.msd')) return;
    e.preventDefault();
    toast('https://www.motoshop.ua' + (D.path || '/uk/'));
  }, true);

  var toastEl;
  function toast(liveUrl) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'msd-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<b>Це демо.</b> Тут доступні головна, каталог KTM і сторінка KTM 790 DUKE. ' +
      '<a href="' + liveUrl + '" target="_blank" rel="noopener">Відкрити на живому сайті ↗</a>';
    toastEl.classList.add('is-on');
    clearTimeout(toast.t);
    toast.t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 4500);
  }

  // Плашка перемикання
  var names = { '0': 'Зараз', a: 'A · Еволюція', b: 'B · Night Ride', c: 'C · Showroom' };
  var pageNames = { home: 'Головна', catalog: 'Каталог', product: 'Товар' };
  var bar = document.createElement('div');
  bar.className = 'msd' + (D.mobile ? ' msd--m' : '');
  var variants = D.variants.map(function (v) {
    return '<a class="msd-chip' + (v === D.variant ? ' is-on' : '') + '" href="' + pageUrl(v, D.page, D.mobile) + '">' + (v === '0' ? 'Зараз' : v.toUpperCase()) + '</a>';
  }).join('');
  var pages = D.pages.map(function (p) {
    return '<a class="msd-link' + (p === D.page ? ' is-on' : '') + '" href="' + pageUrl(D.variant, p, D.mobile) + '">' + pageNames[p] + '</a>';
  }).join('');
  bar.innerHTML =
    '<button type="button" class="msd-toggle" aria-expanded="false"><span class="msd-dot"></span>Демо · ' + names[D.variant] + '</button>' +
    '<div class="msd-panel">' +
      '<div class="msd-row"><span class="msd-label">Варіант</span>' + variants + '</div>' +
      '<div class="msd-row"><span class="msd-label">Сторінка</span>' + pages + '</div>' +
      '<div class="msd-row msd-row--foot"><a class="msd-back" href="' + D.site + '#varianty">← До пропозиції</a>' +
      '<a class="msd-dev" href="' + pageUrl(D.variant, D.page, !D.mobile) + '?' + (D.mobile ? 'desktop' : 'mobile') + '=1">' + (D.mobile ? 'Десктоп-версія' : 'Мобільна версія') + '</a></div>' +
    '</div>';
  var toggle = bar.querySelector('.msd-toggle');
  function setOpen(open) {
    bar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  toggle.addEventListener('click', function () { setOpen(!bar.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  function mount() {
    document.body.appendChild(bar);
    // на десктопі панель відкрита при першому показі (згортається при першій прокрутці), на телефоні — згорнута
    setOpen(!D.mobile);
    if (!D.mobile) window.addEventListener('scroll', function once() {
      if (window.scrollY < 120) return;
      setOpen(false); window.removeEventListener('scroll', once);
    }, { passive: true });
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
