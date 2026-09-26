/*!
 * MOTOshop.UA — кастомні покращення поверх теми Хорошоп.
 * Підключення: Налаштування → Загальні налаштування → Скрипти → «перед тегом </body>»
 *   <script src="https://link.motoshop.ua/siteScript/ms-custom.js" defer></script>
 * Працює і з десктопним, і з мобільним шаблоном (у Хорошопа це різний HTML).
 * Кожен модуль вмикається/вимикається в CONFIG.modules.
 */
(function () {
  'use strict';

  var CONFIG = {
    modules: {
      homeUsp: true,          // смуга переваг під першим банером
      homeTiles: true,        // банери 2..N → сітка плиток категорій
      homeTypes: true,        // «Оберіть свій тип» — швидкі посилання на фільтр типу
      homeBrands: true,       // смуга брендів
      fixBannerLinks: true,   // виправлення посилань банерів (краще виправити в адмінці)
      catalogTypeChips: true, // чіпи типу над сіткою категорії
      cardSpecs: true,        // к.с. · см³ · кг у картках (дані з link.motoshop.ua/api/specs.php)
      productKeySpecs: true,  // ключові характеристики біля ціни
      productTrust: true,     // блок довіри під кнопками
      productSpecsFirst: true,// характеристики відкриті й вище за опис
      productCollapseDesc: true, // згортання довгого опису
      productStickyBar: true  // липка панель «Купити»
    },
    // window.MS_SPECS_URL — статичний JSON {url: specs} для демо без PHP (GitHub Pages)
    specsEndpoint: window.MS_SPECS_URL || (location.hostname === 'localhost' ? 'http://127.0.0.1:8081/api/specs.php' : 'https://link.motoshop.ua/api/specs.php'),
    phone: '+380442212121',
    phoneLabel: '044 221 21 21',
    // Ключові характеристики: назва в таблиці Хорошопа → підпис і одиниця на плитці
    keySpecs: [
      { match: /^Потужність/i, label: { uk: 'Потужність', ru: 'Мощность', en: 'Power' }, unit: { uk: 'к.с.', ru: 'л.с.', en: 'hp' } },
      { match: /^Об.?єм|^Объем|^Engine/i, label: { uk: "Об'єм", ru: 'Объём', en: 'Displacement' }, unit: { uk: 'см³', ru: 'см³', en: 'cc' } },
      { match: /^Вага|^Вес|^Weight/i, label: { uk: 'Вага', ru: 'Вес', en: 'Weight' }, unit: { uk: 'кг', ru: 'кг', en: 'kg' } },
      { match: /^Висота сидіння|^Высота сиденья|^Seat/i, label: { uk: 'Висота сидіння', ru: 'Высота сиденья', en: 'Seat height' }, unit: { uk: 'мм', ru: 'мм', en: 'mm' } },
      { match: /^Макс\.? швидкість|^Макс\.? скорость|^Top speed/i, label: { uk: 'Макс. швидкість', ru: 'Макс. скорость', en: 'Top speed' }, unit: { uk: 'км/год', ru: 'км/ч', en: 'km/h' } }
    ],
    // Типи мотоциклів для головної — SEO-лендинги Хорошопа (на них редиректить фільтр «Тип»)
    homeTypes: [
      { url: '/category/dorozhnye/', uk: 'Дорожні', ru: 'Дорожные', en: 'Street' },
      { url: '/category/turisticheskie_1f/', uk: 'Туристичні', ru: 'Туристические', en: 'Touring' },
      { url: '/category/enduro/', uk: 'Ендуро', ru: 'Эндуро', en: 'Enduro' },
      { url: '/category/motocross/', uk: 'Мотокрос', ru: 'Мотокросс', en: 'Motocross' },
      { url: '/category/supermoto/', uk: 'Супермото', ru: 'Супермото', en: 'Supermoto' },
      { url: '/category/sportivnye/', uk: 'Спортивні', ru: 'Спортивные', en: 'Sport' },
      { url: '/category/pit-bike/', uk: 'Пітбайки', ru: 'Питбайки', en: 'Pit bikes' }
    ]
  };

  // ---------- мова та тексти ----------
  // window.MS_DEMO_PATH — шлях оригінальної сторінки для демо на іншому домені (GitHub Pages)
  var path = window.MS_DEMO_PATH || location.pathname;
  var lang = /^\/uk(\/|$)/.test(path) ? 'uk' : /^\/en(\/|$)/.test(path) ? 'en' : 'ru';
  var prefix = lang === 'ru' ? '' : '/' + lang;

  var T = {
    uk: {
      usp: [
        ['shield', 'Офіційний дилер', 'KTM · Husqvarna · GASGAS'],
        ['badge', 'Гарантія виробника', 'Офіційне сервісне обслуговування'],
        ['swap', 'Trade-in', 'Обмін старого мотоцикла на новий'],
        ['wrench', 'Власний сервіс', 'Підготовка та ТО у Києві'],
        ['truck', 'Доставка по Україні', 'Самовивіз із двох салонів']
      ],
      types: 'Оберіть свій тип', brands: 'Офіційні бренди', all: 'Усі мотоцикли',
      specsAll: 'Усі характеристики', readMore: 'Читати повністю', readLess: 'Згорнути',
      buy: 'Купити', call: 'Подзвонити', allTypes: 'Усі',
      trust: [
        ['badge', 'Офіційна гарантія{w}'],
        ['wrench', 'Передпродажна підготовка та сервіс'],
        ['swap', 'Trade-in: зарахуємо ваш мотоцикл', '/trade-in/'],
        ['truck', 'Доставка по Україні або самовивіз у Києві']
      ],
      months: ' — {n} міс.'
    },
    ru: {
      usp: [
        ['shield', 'Официальный дилер', 'KTM · Husqvarna · GASGAS'],
        ['badge', 'Гарантия производителя', 'Официальное сервисное обслуживание'],
        ['swap', 'Trade-in', 'Обмен старого мотоцикла на новый'],
        ['wrench', 'Собственный сервис', 'Подготовка и ТО в Киеве'],
        ['truck', 'Доставка по Украине', 'Самовывоз из двух салонов']
      ],
      types: 'Выберите свой тип', brands: 'Официальные бренды', all: 'Все мотоциклы',
      specsAll: 'Все характеристики', readMore: 'Читать полностью', readLess: 'Свернуть',
      buy: 'Купить', call: 'Позвонить', allTypes: 'Все',
      trust: [
        ['badge', 'Официальная гарантия{w}'],
        ['wrench', 'Предпродажная подготовка и сервис'],
        ['swap', 'Trade-in: зачтём ваш мотоцикл', '/trade-in/'],
        ['truck', 'Доставка по Украине или самовывоз в Киеве']
      ],
      months: ' — {n} мес.'
    },
    en: {
      usp: [
        ['shield', 'Official dealer', 'KTM · Husqvarna · GASGAS'],
        ['badge', 'Manufacturer warranty', 'Official service support'],
        ['swap', 'Trade-in', 'Swap your old bike for a new one'],
        ['wrench', 'Own service centre', 'Pre-delivery & maintenance in Kyiv'],
        ['truck', 'Delivery across Ukraine', 'Pickup from two showrooms']
      ],
      types: 'Choose your type', brands: 'Official brands', all: 'All motorcycles',
      specsAll: 'All specifications', readMore: 'Read more', readLess: 'Collapse',
      buy: 'Buy', call: 'Call', allTypes: 'All',
      trust: [
        ['badge', 'Official warranty{w}'],
        ['wrench', 'Pre-delivery preparation & service'],
        ['swap', 'Trade-in: we accept your bike', '/trade-in/'],
        ['truck', 'Delivery across Ukraine or pickup in Kyiv']
      ],
      months: ' — {n} mo.'
    }
  }[lang];

  // Лінійні іконки (stroke = currentColor), щоб не тягнути бібліотеку
  var ICONS = {
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    badge: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 7 5-3 5 3-1.5-7"/>',
    swap: '<path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L4 16.7 7.3 20l5.3-5.3a4 4 0 0 0 5.1-5.4l-2.5 2.5-2.4-.6-.6-2.4 2.5-2.5z"/>',
    truck: '<path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>'
  };
  function icon(name) {
    return '<svg class="ms-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  // ---------- утиліти ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function once(key) { if (document.documentElement.hasAttribute('data-ms-' + key)) return false; document.documentElement.setAttribute('data-ms-' + key, ''); return true; }
  function run(name, fn) {
    if (!CONFIG.modules[name] || !once(name)) return;
    try { fn(); } catch (e) { if (window.console) console.warn('[ms] ' + name, e); }
  }

  // Хорошоп збирає блоки товару (акордеон тощо) у своєму INIT на DOMContentLoaded —
  // стартуємо після нього, інакше тема перезапише наші зміни.
  function main() {
    var isMobileTpl = !!$('.product-card__body, .mm-panel, #mm-menu') || !$('.header__bottom');
    var page =
      $('.j-product-right-column, .product-card__body') ? 'product' :
      $('.catalog-grid, .catalog__content, .goods--cards') ? 'catalog' :
      /^\/(uk\/|en\/)?$/.test(path) ? 'home' : 'other';
    document.documentElement.classList.add('ms', 'ms-page-' + page, isMobileTpl ? 'ms-mobile' : 'ms-desktop');

    // Таблиця характеристик Хорошопа → [{name, value}]
    function readFeatures() {
      return $$('.product-features__row').map(function (r) {
        // десктоп: <th><span.cell-title>…</th><td>…; мобільний: <td.data--h>…<td.data--b>…
      var th = $('.product-features__cell-title, th, .product-features__data--h', r);
      var td = $('.product-features__data--b', r) || $('td:not(.product-features__data--h)', r);
        return th && td ? { name: th.textContent.trim(), value: td.textContent.replace(/\s+/g, ' ').trim() } : null;
      }).filter(Boolean);
    }

    // ======================================================================
    // ГОЛОВНА
    // ======================================================================
    if (page === 'home') {
      // десктоп: .banners--cover, мобільний: .banners--wide
      var bannerSections = $$('main .banners-group > .banners');

      run('fixBannerLinks', function () {
        // Trade-in банер веде в загальний каталог, «Мотоцикли» — теж. Краще виправити в адмінці.
        bannerSections.forEach(function (sec) {
          var a = $('.banner-a', sec), txt = sec.textContent.toLowerCase();
          if (!a) return;
          if (/trade-in/.test(txt)) a.setAttribute('href', prefix + '/trade-in/');
          else if (/мотоцикл|motorcycl/.test(txt) && /katalog\/?$/.test(a.getAttribute('href'))) a.setAttribute('href', prefix + '/category/motocikly-novye/');
          // Кнопка всередині банера — javascript:void(0); робимо її справжнім посиланням
          var btn = $('.bannerMagic-price-btn', sec);
          if (btn) btn.setAttribute('href', a.getAttribute('href'));
        });
      });

      run('homeTiles', function () {
        if (bannerSections.length < 3) return;
        var grid = el('<section class="ms-tiles" aria-label="Категорії"><div class="ms-wrap ms-tiles__grid"></div></section>');
        var inner = $('.ms-tiles__grid', grid);
        bannerSections.slice(1).forEach(function (sec) {
          var layout = $('.bannerMagic-layout', sec), a = $('.banner-a', sec);
          var title = $('.bannerMagic-txt.__size_xl', sec) || $('.bannerMagic-heading', sec);
          if (!layout || !a || !title) return;
          var bg = layout.style.backgroundImage;
          inner.appendChild(el(
            '<a class="ms-tile" href="' + esc(a.getAttribute('href')) + '">' +
              '<span class="ms-tile__img" style="background-image:' + esc(bg) + '"></span>' +
              '<span class="ms-tile__body"><span class="ms-tile__title">' + esc(title.textContent.trim()) + '</span>' +
              '<span class="ms-tile__more">' + icon('arrow') + '</span></span></a>'
          ));
          sec.classList.add('ms-hidden');
        });
        if (!inner.children.length) return;
        var firstGroup = bannerSections[0].closest('.banners-group') || bannerSections[0];
        firstGroup.parentNode.insertBefore(grid, firstGroup.nextSibling);
        // Порожні групи банерів ховаємо
        $$('main .banners-group').forEach(function (g) {
          if (!$('.banners:not(.ms-hidden)', g)) g.classList.add('ms-hidden');
        });
      });

      run('homeUsp', function () {
        var first = bannerSections[0];
        if (!first) return;
        var html = T.usp.map(function (u) {
          return '<li class="ms-usp__item">' + icon(u[0]) + '<span><b>' + esc(u[1]) + '</b><small>' + esc(u[2]) + '</small></span></li>';
        }).join('');
        var usp = el('<section class="ms-usp"><ul class="ms-wrap ms-usp__list">' + html + '</ul></section>');
        first.parentNode.insertBefore(usp, first.nextSibling);
      });

      run('homeTypes', function () {
        var promo = $('main .promo') || $('main .storefront') || $('main .front-news') || $('main .news');
        if (!promo) return;
        var chips = CONFIG.homeTypes.map(function (t) {
          return '<a class="ms-chip" href="' + prefix + t.url + '">' + esc(t[lang]) + '</a>';
        }).join('') + '<a class="ms-chip ms-chip--accent" href="' + prefix + '/category/motocikly-novye/">' + esc(T.all) + ' ' + icon('arrow') + '</a>';
        promo.parentNode.insertBefore(el(
          '<section class="ms-types"><div class="ms-wrap"><h2 class="ms-h2">' + esc(T.types) + '</h2><div class="ms-chips">' + chips + '</div></div></section>'
        ), promo);
      });

      run('homeBrands', function () {
        // Логотипи беремо з шапки, щоб не дублювати контент
        var links = $$('.header a').filter(function (a) {
          var img = $('img', a);
          return img && /\/content\/uploads\/images\/[a-z]+\.png/.test(img.getAttribute('src') || '');
        });
        if (!links.length) return;
        var seen = {};
        var items = links.filter(function (a) { var h = a.getAttribute('href'); return seen[h] ? false : (seen[h] = true); })
          .map(function (a) {
            return '<a class="ms-brand" href="' + esc(a.getAttribute('href')) + '"><img src="' + esc($('img', a).getAttribute('src')) + '" alt="" loading="lazy"></a>';
          }).join('');
        var anchor = $('main .front-news') || $('main .news') || $('main .top-reviews') || $('main .recent-reviews');
        if (!anchor) return;
        anchor.parentNode.insertBefore(el(
          '<section class="ms-brands"><div class="ms-wrap"><h2 class="ms-h2">' + esc(T.brands) + '</h2><div class="ms-brands__row">' + items + '</div></div></section>'
        ), anchor);
      });
    }

    // ======================================================================
    // КАТЕГОРІЯ
    // ======================================================================
    if (page === 'catalog') {
      run('catalogTypeChips', function () {
        // десктоп: .j-filter-section > .filter__name; мобільний: .j-filter-group > (заголовок) + .filter-group__body
        var section = $$('.j-filter-section, .j-filter-group').filter(function (s) {
          var n = $('.filter__name', s) || s.firstElementChild;
          return n && /^(Тип|Type)$/i.test(n.textContent.trim());
        })[0];
        var grid = $('.catalog-grid') || $('.goods--cards');
        if (!section || !grid) return;
        var links = $$('.filter__link, .filter-item__link', section).map(function (a) {
          var name = $('.j-filter-title', a), cnt = $('.filter__units, .filter-item__quantity', a);
          var n = cnt ? parseInt(cnt.textContent, 10) : 0;
          var li = a.closest('.filter__item, .filter-item');
          var active = li && /active|checked/.test(li.className);
          return name && (n > 0 || active) ? { href: a.getAttribute('href'), name: name.textContent.trim(), n: n, active: active } : null;
        }).filter(Boolean);
        if (links.length < 2) return;
        var html = links.map(function (l) {
          return '<a class="ms-chip' + (l.active ? ' is-active' : '') + '" rel="nofollow" href="' + esc(l.href) + '">' + esc(l.name) + ' <sup>' + l.n + '</sup></a>';
        }).join('');
        grid.parentNode.insertBefore(el('<nav class="ms-chips ms-chips--catalog" aria-label="Тип">' + html + '</nav>'), grid);
      });
    }

    // ======================================================================
    // КАРТКИ ТОВАРІВ (категорія + вітрини на головній)
    // ======================================================================
    if (page === 'catalog' || page === 'home') {
      run('cardSpecs', function () {
        var units = {
          power: { uk: 'к.с.', ru: 'л.с.', en: 'hp' }, cc: { uk: 'см³', ru: 'см³', en: 'cc' }, weight: { uk: 'кг', ru: 'кг', en: 'kg' }
        };
        function cards() {
          return $$('.catalogCard, .catalog-card').filter(function (c) { return !c.hasAttribute('data-ms-specs'); });
        }
        function load() {
          var list = cards(), byUrl = {};
          list.forEach(function (c) {
            var a = $('.catalogCard-title a, .catalog-card__title a, a.catalog-card__title', c) || $('a[href]', c);
            var href = a && a.getAttribute('href');
            if (!href || href.charAt(0) !== '/') return;
            c.setAttribute('data-ms-specs', '');
            // рядок резервуємо одразу, щоб ціни в сітці не «стрибали» після завантаження
            var title = $('.catalogCard-title, .catalog-card__title', c);
            if (title) title.parentNode.insertBefore(el('<div class="ms-cardspecs"></div>'), title.nextSibling);
            (byUrl[href] = byUrl[href] || []).push(c);
          });
          var urls = Object.keys(byUrl);
          if (!urls.length) return;
          var qs = urls.map(function (u) { return 'u[]=' + encodeURIComponent(u); }).join('&');
          var isStatic = /\.json(\?|$)/.test(CONFIG.specsEndpoint);
          fetch(isStatic ? CONFIG.specsEndpoint : CONFIG.specsEndpoint + '?' + qs).then(function (r) { return r.ok ? r.json() : {}; }).then(function (data) {
            Object.keys(data).forEach(function (u) {
              var d = data[u];
              var parts = ['power', 'cc', 'weight'].filter(function (k) { return d[k]; }).map(function (k) {
                return '<span>' + esc(d[k]) + ' ' + esc(units[k][lang]) + '</span>';
              });
              if (parts.length < 2) return;
              (byUrl[u] || []).forEach(function (c) {
                var box = $('.ms-cardspecs', c);
                if (box) box.innerHTML = parts.join('');
              });
            });
          }).catch(function () {});
        }
        load();
        // Хорошоп довантажує товари («Показати ще», пагінація AJAX) — підхоплюємо нові картки
        var root = $('.catalog-grid, .goods--cards');
        if (root && 'MutationObserver' in window) {
          var t;
          new MutationObserver(function () { clearTimeout(t); t = setTimeout(load, 300); }).observe(root, { childList: true, subtree: true });
        }
      });
    }

    // ======================================================================
    // ТОВАР
    // ======================================================================
    if (page === 'product') {
      var features = readFeatures();
      var buyBtn = $('.j-buy-button-add');
      var orderBox = $('.product__section--order') || $('.product-card__order-box');
      var priceBox = $('.product__section--price') || $('.product-card__price-box');
      var specsDetails = $$('details.product__group-item').filter(function (d) {
        var s = $('summary', d);
        return s && /Характеристики|Specifications|Characteristics/i.test(s.textContent);
      })[0];

      function openSpecs(scroll) {
        if (!specsDetails) return;
        specsDetails.open = true;
        if (scroll) specsDetails.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      run('productKeySpecs', function () {
        if (!priceBox || !features.length) return;
        var tiles = CONFIG.keySpecs.map(function (k) {
          var f = features.filter(function (f) { return k.match.test(f.name); })[0];
          if (!f || !f.value) return '';
          return '<li class="ms-spec"><b>' + esc(f.value) + '<small>' + esc(k.unit[lang]) + '</small></b><span>' + esc(k.label[lang]) + '</span></li>';
        }).filter(Boolean);
        if (tiles.length < 2) return;
        var block = el('<div class="ms-specs"><ul class="ms-specs__list">' + tiles.join('') + '</ul>' +
          (specsDetails ? '<button type="button" class="ms-link">' + esc(T.specsAll) + ' ' + icon('arrow') + '</button>' : '') + '</div>');
        var btn = $('.ms-link', block);
        if (btn) btn.addEventListener('click', function () { openSpecs(true); });
        priceBox.parentNode.insertBefore(block, priceBox);
      });

      run('productTrust', function () {
        if (!orderBox) return;
        var w = features.filter(function (f) { return /гарант|warrant/i.test(f.name); })[0];
        var wText = w && /^\d+$/.test(w.value) ? T.months.replace('{n}', w.value) : '';
        var items = T.trust.map(function (t) {
          var text = esc(t[1].replace('{w}', wText));
          var inner = icon(t[0]) + '<span>' + text + '</span>';
          return '<li>' + (t[2] ? '<a href="' + prefix + t[2] + '">' + inner + '</a>' : inner) + '</li>';
        }).join('');
        orderBox.parentNode.insertBefore(el('<ul class="ms-trust">' + items + '</ul>'), orderBox.nextSibling);
      });

      run('productSpecsFirst', function () {
        if (!specsDetails) return;
        specsDetails.open = true;
        // Групу з характеристиками ставимо перед описом (природний порядок — через редактор дизайну)
        var group = specsDetails.closest('.product__group');
        var descBlock = ($('.product-description') || $('.product__block--description'));
        var descItem = descBlock && (descBlock.closest('.product__column-item') || descBlock.closest('.product__block') || descBlock);
        var groupItem = group && (group.closest('.product__column-item') || group);
        if (descItem && groupItem && descItem.parentNode === groupItem.parentNode && groupItem !== descItem) {
          descItem.parentNode.insertBefore(groupItem, descItem);
        }
      });

      run('productCollapseDesc', function () {
        var text = $('.product-description .text') || $('.product__block--description .j-product-block-title + div') || $('.product__block--description > div:last-child');
        if (!text || text.scrollHeight < 1600) return;
        text.classList.add('ms-collapse');
        var btn = el('<button type="button" class="ms-collapse__btn">' + esc(T.readMore) + '</button>');
        btn.addEventListener('click', function () {
          var open = text.classList.toggle('is-open');
          btn.textContent = open ? T.readLess : T.readMore;
          if (!open) text.scrollIntoView({ block: 'start' });
        });
        text.parentNode.insertBefore(btn, text.nextSibling);
      });

      run('productStickyBar', function () {
        if (!buyBtn || !orderBox) return;
        var title = ($('h1') || {}).textContent || '';
        var priceEl = $('.product-price__item, .product-card__price');
        var price = priceEl ? priceEl.textContent.replace(/\s+/g, ' ').trim() : '';
        var img = $('.product__section--gallery img, .product-card img, .gallery img');
        var bar = el(
          '<div class="ms-sticky" aria-hidden="true">' +
            '<div class="ms-sticky__in">' +
              (img ? '<img class="ms-sticky__img" src="' + esc(img.currentSrc || img.src) + '" alt="">' : '') +
              '<div class="ms-sticky__info"><div class="ms-sticky__title">' + esc(title.trim()) + '</div><div class="ms-sticky__price">' + esc(price) + '</div></div>' +
              '<a class="ms-sticky__call" href="tel:' + CONFIG.phone + '" aria-label="' + esc(T.call) + '">' + icon('phone') + '<span>' + esc(CONFIG.phoneLabel) + '</span></a>' +
              '<button type="button" class="ms-sticky__buy">' + esc(T.buy) + '</button>' +
            '</div></div>'
        );
        $('.ms-sticky__buy', bar).addEventListener('click', function () { ($('.j-buy-button-add') || buyBtn).click(); });
        document.body.appendChild(bar);
        // Мобільний шаблон перемальовує блок покупки після ініціалізації, тому не тримаємо
        // посилання на вузол (IntersectionObserver стежив би за відірваним елементом),
        // а щоразу беремо актуальний.
        var ticking = false;
        function update() {
          ticking = false;
          var box = $('.product__section--order') || $('.product-card__order-box');
          var hidden = !!box && box.getBoundingClientRect().bottom < 0;
          if (bar.classList.contains('is-visible') === hidden) return;
          bar.classList.toggle('is-visible', hidden);
          bar.setAttribute('aria-hidden', hidden ? 'false' : 'true');
          document.documentElement.classList.toggle('ms-sticky-on', hidden);
        }
        window.addEventListener('scroll', function () {
          if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
      });
    }
  }

  function boot() { setTimeout(main, 0); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
