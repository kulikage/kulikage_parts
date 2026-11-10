/* Kulikage Parts — site script. No dependencies. */
(function () {
  'use strict';

  /* Form endpoint (Formspree). The same endpoint the current wholesale form uses. */
  var FORM_ENDPOINT = 'https://formspree.io/f/xkobvoba';

  /* ---------------------------------------------------------------
     Vehicle finder data: make -> model -> engine -> where to go.
     page: a page on this site; sku: no page yet, open the order form for that kit.
     Add vehicles here as product pages appear.
     --------------------------------------------------------------- */
  var VEHICLES = {
    'Dacia': {
      'Duster II': {
        '1.5 dCi · K9K 858': { page: 'vehicle-dacia-duster-ii-k9k-858.html' }
      },
      'Logan II': {
        '1.5 dCi · K9K 858': { page: 'product-k9k-858-seal-kit.html' }
      },
      'Sandero II': {
        '1.5 dCi · K9K 858': { page: 'product-k9k-858-seal-kit.html' }
      },
      'Duster (90 hp)': {
        '1.5 dCi · K9K 884': { sku: 'K2288440S' }
      },
      'Dokker / Lodgy': {
        '1.5 dCi · K9K 884': { sku: 'K2288440S' }
      }
    },
    'Renault': {
      'Megane III / Scenic III': {
        '1.5 dCi · K9K 646 / 636': { sku: 'K2564640S' }
      },
      'Megane IV': {
        '1.5 dCi · K9K 836': { sku: 'K2283660S' },
        '1.5 dCi · K9K 646 / 636': { sku: 'K2564640S' }
      },
      'Scenic IV': {
        '1.5 dCi · K9K 836': { sku: 'K2283660S' }
      },
      'Talisman': {
        '1.5 dCi · K9K 836': { sku: 'K2283660S' }
      },
      'Koleos': {
        '2.0 dCi · M9R': { sku: 'K22M9R40S' }
      }
    },
    'Nissan': {
      'Qashqai J11': {
        '1.5 dCi · K9K 646 / 636': { sku: 'K2564640S' }
      }
    },
    'Chevrolet': {
      'Equinox (2018)': {
        '1.5L Turbo · LYX': { page: 'product-equinox-intake.html' },
        '2.0L Turbo · LTG': { page: 'product-equinox-intake.html' }
      },
      'Blazer (2021)': {
        'All engines': { soon: true }
      }
    }
  };

  /* OEM / part-number search: normalized number -> destination. */
  var PART_NUMBERS = {
    '144601FE0C': { page: 'product-k9k-858-seal-kit.html' },
    '7701071156': { page: 'product-k9k-858-seal-kit.html' },
    'K2285850S': { page: 'product-k9k-858-seal-kit.html' },
    'K2288440S': { sku: 'K2288440S' },
    'K2283660S': { sku: 'K2283660S' },
    '144602443R': { sku: 'K2283660S' },
    'K2564640S': { sku: 'K2564640S' },
    '14460BB30A': { sku: 'K2564640S' },
    'K22M9R40S': { sku: 'K22M9R40S' },
    '8200551943': { sku: 'K22M9R40S' },
    '144602507R': { sku: 'K22M9R40S' }
  };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }
  function setMsg(el, text, kind, html) {
    if (!el) return;
    el.className = 'form-msg' + (kind ? ' is-' + kind : '');
    if (html) { el.innerHTML = html; } else { el.textContent = text; }
  }
  function orderUrl(sku, extra) {
    return 'order.html?sku=' + encodeURIComponent(sku) + (extra || '');
  }

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      $all('.nav, .header-actions').forEach(function (el) { el.classList.toggle('is-open', open); });
    });
  }

  /* ---------- Region / currency ---------- */
  var region = $('#region');
  function applyRegion(value) {
    var cur = value === 'US' ? '$' : '€';
    $all('[data-cur]').forEach(function (el) { el.textContent = cur; });
  }
  if (region) {
    var saved = store('kp-region');
    if (saved === 'US' || saved === 'EU') region.value = saved;
    applyRegion(region.value);
    region.addEventListener('change', function () {
      store('kp-region', region.value);
      applyRegion(region.value);
    });
  }

  /* ---------- Vehicle finder ---------- */
  var finder = $('#finder');
  if (finder) {
    var mk = $('#f-make', finder), md = $('#f-model', finder), en = $('#f-engine', finder), fmsg = $('#finder-msg');
    function fill(select, values) {
      select.innerHTML = '';
      values.forEach(function (v) {
        var o = document.createElement('option');
        o.value = v; o.textContent = v;
        select.appendChild(o);
      });
    }
    function onMake() { fill(md, Object.keys(VEHICLES[mk.value] || {})); onModel(); }
    function onModel() { fill(en, Object.keys((VEHICLES[mk.value] || {})[md.value] || {})); setMsg(fmsg, ''); }
    fill(mk, Object.keys(VEHICLES));
    onMake();
    mk.addEventListener('change', onMake);
    md.addEventListener('change', onModel);
    en.addEventListener('change', function () { setMsg(fmsg, ''); });
    finder.addEventListener('submit', function (e) {
      e.preventDefault();
      var hit = ((VEHICLES[mk.value] || {})[md.value] || {})[en.value];
      if (!hit) return;
      if (hit.page) { window.location.href = hit.page; return; }
      if (hit.sku) {
        setMsg(fmsg, '', 'info', 'Seal kit <span class="mono">' + hit.sku + '</span> fits this engine. Its product page is coming — <a href="' + orderUrl(hit.sku) + '">order or ask about it here</a>.');
        return;
      }
      setMsg(fmsg, '', 'info', 'Parts for this car are in development. <a href="product-equinox-intake.html">See the build log</a> or <a href="mailto:sales@kulikage.parts">email us</a>.');
    });
  }

  /* ---------- Part-number search ---------- */
  var oem = $('#oem-form');
  if (oem) {
    var omsg = $('#oem-msg');
    oem.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = $('#oem-search', oem).value || '';
      var key = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!key) { setMsg(omsg, 'Type an OEM or Kulikage part number.', 'info'); return; }
      var hit = PART_NUMBERS[key];
      if (hit && hit.page) { window.location.href = hit.page; return; }
      if (hit && hit.sku) {
        setMsg(omsg, '', 'info', 'Matches kit <span class="mono">' + hit.sku + '</span>. <a href="' + orderUrl(hit.sku) + '">Order or ask about it</a>.');
        return;
      }
      setMsg(omsg, '', 'info', 'No match for <span class="mono">' + key.replace(/[<>&]/g, '') + '</span> yet. <a href="mailto:sales@kulikage.parts?subject=Part%20number%20' + encodeURIComponent(key) + '">Send it to us</a> and we will check.');
    });
  }

  /* ---------- Vehicle page filters ---------- */
  $all('[data-filter]').forEach(function (box) {
    box.addEventListener('change', function () {
      var onlyStock = $('#f-stock') && $('#f-stock').checked;
      var active = $all('[data-filter]').filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
      $all('.part-row[data-cat]').forEach(function (row) {
        var show = active.indexOf(row.getAttribute('data-cat')) !== -1;
        if (onlyStock && row.getAttribute('data-stock') !== 'yes') show = false;
        row.hidden = !show;
      });
    });
  });
  var stockBox = $('#f-stock');
  if (stockBox) stockBox.addEventListener('change', function () {
    var first = $('[data-filter]');
    if (first) first.dispatchEvent(new Event('change'));
  });

  /* ---------- Product page: quantity + add-on -> order link ---------- */
  var orderLink = $('[data-order-link]');
  if (orderLink) {
    var qty = $('#qty'), addon = $('#addon');
    function update() {
      var n = Math.max(1, parseInt(qty && qty.value, 10) || 1);
      if (qty) qty.value = n;
      var sku = addon && addon.checked ? orderLink.getAttribute('data-set-sku') : orderLink.getAttribute('data-sku');
      orderLink.href = orderUrl(sku, '&qty=' + n);
    }
    $all('[data-qty]').forEach(function (b) {
      b.addEventListener('click', function () {
        qty.value = Math.max(1, (parseInt(qty.value, 10) || 1) + parseInt(b.getAttribute('data-qty'), 10));
        update();
      });
    });
    if (qty) qty.addEventListener('input', update);
    if (addon) addon.addEventListener('change', update);
    update();
  }

  /* ---------- Upgrade page: engine buttons ---------- */
  $all('.engine-pick button').forEach(function (b, i, all) {
    b.addEventListener('click', function () {
      all.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var field = $('#notify-engine');
      if (field) field.value = b.getAttribute('data-engine');
    });
  });

  /* ---------- Order page: prefill from the link ---------- */
  var orderForm = $('#order-form');
  if (orderForm) {
    var params = new URLSearchParams(window.location.search);
    var sku = params.get('sku'), q = params.get('qty');
    var sel = $('#o-sku', orderForm);
    if (sku && sel) {
      var match = $all('option', sel).filter(function (o) { return o.value === sku; })[0];
      if (match) sel.value = sku;
    }
    if (q && $('#o-qty', orderForm)) $('#o-qty', orderForm).value = Math.max(1, parseInt(q, 10) || 1);
    if (params.get('trade') === '1' && $('#o-trade', orderForm)) $('#o-trade', orderForm).checked = true;
  }

  /* ---------- Forms -> Formspree ---------- */
  $all('form[data-ajax]').forEach(function (form) {
    form.setAttribute('action', FORM_ENDPOINT);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = $('.form-msg', form);
      var btn = $('button[type="submit"]', form);
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      fetch(FORM_ENDPOINT, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            setMsg(msg, form.getAttribute('data-ok') || 'Thank you — we got it and will reply within 24 hours.', 'ok');
            form.reset();
          } else {
            return r.json().then(function (data) {
              var text = data && data.errors ? data.errors.map(function (x) { return x.message; }).join(', ') : 'Something went wrong. Please email sales@kulikage.parts.';
              setMsg(msg, text, 'error');
            });
          }
        })
        .catch(function () { setMsg(msg, 'No connection. Please try again or email sales@kulikage.parts.', 'error'); })
        .then(function () { if (btn) { btn.disabled = false; btn.textContent = label; } });
    });
  });

  /* ---------- Footer year ---------- */
  $all('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
