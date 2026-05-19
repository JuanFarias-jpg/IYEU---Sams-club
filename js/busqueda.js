/* SAM'S CLUB REDESIGN - BÚSQUEDA / PRODUCTOS JS */

document.addEventListener('DOMContentLoaded', () => {
  initPills();
  initPriceSlider();
});

/* =============================================
   SUBCATEGORY PILLS
   ============================================= */
function initPills() {
  document.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
    });
  });
}

/* =============================================
   DUAL RANGE SLIDER — FILTRO DE PRECIO
   =============================================
   Hay dos <input type="range"> superpuestos:
   #range-min y #range-max.
   En cada evento 'input' se comparan sus valores
   para saber cuál es el mínimo real y cuál el máximo,
   se actualiza la barra de progreso (fill) y las
   etiquetas de precio.
   applyPriceFilter() oculta/muestra los .product-card
   según su atributo data-price.
   ============================================= */
function initPriceSlider() {
  const rangeMin = document.getElementById('range-min');
  const rangeMax = document.getElementById('range-max');
  if (!rangeMin || !rangeMax) return;

  // Actualiza fill y labels cada vez que se mueve cualquier pulgar
  [rangeMin, rangeMax].forEach(input => {
    input.addEventListener('input', () => {
      syncSlider();
      applyPriceFilter();   // filtro en tiempo real al arrastrar
    });
  });

  syncSlider(); // estado inicial
}

/* Sincroniza la barra de color y los labels con los valores actuales */
function syncSlider() {
  const rangeMin = document.getElementById('range-min');
  const rangeMax = document.getElementById('range-max');
  const fill     = document.getElementById('price-slider-fill');
  const labelMin = document.getElementById('price-min-label');
  const labelMax = document.getElementById('price-max-label');
  if (!rangeMin || !rangeMax) return;

  const min  = parseInt(rangeMin.min);
  const max  = parseInt(rangeMin.max);
  let   valA = parseInt(rangeMin.value);
  let   valB = parseInt(rangeMax.value);

  // Si los pulgares se cruzan, intercambiarlos suavemente
  if (valA > valB) {
    [rangeMin.value, rangeMax.value] = [valB, valA];
    [valA, valB] = [valB, valA];
  }

  // Porcentajes para posicionar el fill
  const pctLeft  = ((valA - min) / (max - min)) * 100;
  const pctRight = ((valB - min) / (max - min)) * 100;

  if (fill) {
    fill.style.left  = pctLeft  + '%';
    fill.style.width = (pctRight - pctLeft) + '%';
  }

  // Actualizar etiquetas con formato de peso mexicano
  if (labelMin) labelMin.textContent = formatMXN(valA);
  if (labelMax) labelMax.textContent = formatMXN(valB);
}

/* Muestra u oculta tarjetas según el rango activo */
function applyPriceFilter() {
  const rangeMin = document.getElementById('range-min');
  const rangeMax = document.getElementById('range-max');
  if (!rangeMin || !rangeMax) return;

  let valA = parseInt(rangeMin.value);
  let valB = parseInt(rangeMax.value);
  const minPrice = Math.min(valA, valB);
  const maxPrice = Math.max(valA, valB);

  const cards     = document.querySelectorAll('.product-card');
  const noResults = document.getElementById('no-results');
  let   visible   = 0;

  cards.forEach(card => {
    const price = parseInt(card.dataset.price || '0');
    const show  = price >= minPrice && price <= maxPrice;

    // Transición suave al aparecer/desaparecer
    if (show) {
      card.style.display = '';
      // Pequeño reflow para que la animación funcione
      requestAnimationFrame(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; });
      visible++;
    } else {
      card.style.opacity   = '0';
      card.style.transform = 'scale(0.97)';
      setTimeout(() => { if (card.style.opacity === '0') card.style.display = 'none'; }, 200);
    }
  });

  if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
}

/* Restablece el slider al rango completo */
function resetPriceFilter() {
  const rangeMin = document.getElementById('range-min');
  const rangeMax = document.getElementById('range-max');
  if (rangeMin) rangeMin.value = rangeMin.min;
  if (rangeMax) rangeMax.value = rangeMax.max;
  syncSlider();

  // Mostrar todas las tarjetas
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display  = '';
    card.style.opacity  = '1';
    card.style.transform = 'scale(1)';
  });
  const noResults = document.getElementById('no-results');
  if (noResults) noResults.style.display = 'none';
}

/* =============================================
   SIDEBAR DE FILTROS (MÓVIL)
   ============================================= */
function toggleFiltersSidebar() {
  const sidebar = document.getElementById('filters-sidebar');
  const overlay = document.querySelector('.overlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('mobile-open');
  overlay?.classList.toggle('on', isOpen);
}

/* Permite cerrar el sidebar al tocar el overlay */
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      document.getElementById('filters-sidebar')?.classList.remove('mobile-open');
      overlay.classList.remove('on');
    });
  }
});

/* =============================================
   ACORDEÓN DE GRUPOS DE FILTROS
   ============================================= */
function toggleFilterGroup(btn) {
  const body     = btn.nextElementSibling;
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!expanded));
  if (body) {
    body.style.maxHeight = expanded ? '0' : body.scrollHeight + 'px';
    body.style.overflow  = 'hidden';
    body.style.transition = 'max-height .25s ease';
  }
  btn.querySelector('.filter-group__caret')?.classList.toggle('rotated', !expanded);
}

/* =============================================
   UTILIDADES
   ============================================= */
function formatMXN(n) {
  return '$' + n.toLocaleString('es-MX');
}

/* === SORT CHANGE === */
function handleSort(select) {
  showToast('Ordenando por: ' + select.value);
}