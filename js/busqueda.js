/* SAM'S CLUB REDESIGN — BÚSQUEDA / PRODUCTOS JS */

document.addEventListener('DOMContentLoaded', () => {
  initPills();
  initFiltersToggle();
});

/* === SUBCATEGORY PILLS === */
function initPills() {
  document.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
    });
  });
}

/* === MOBILE FILTERS TOGGLE === */
function initFiltersToggle() {
  const sidebar = document.getElementById('filters-sidebar');
  const overlay = document.querySelector('.overlay');
  if (!sidebar) return;

  const toggleBtn = document.querySelector('.filter-toggle-mobile');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      overlay?.classList.toggle('on');
    });
  }

  // Close filters on overlay click
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
    });
  }
}

/* === SORT CHANGE === */
function handleSort(select) {
  const val = select.value;
  showToast('Ordenando por: ' + val);
  // Here you would re-sort the products grid
}

/* === VIEW TOGGLE (grid/list) === */
function setView(mode) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  document.querySelectorAll('.view-toggle__btn').forEach(b => b.classList.remove('active'));
  event.target.closest('.view-toggle__btn')?.classList.add('active');

  if (mode === 'list') {
    grid.style.gridTemplateColumns = '1fr';
  } else {
    grid.style.gridTemplateColumns = '';
  }
}

/* === FILTER OPTION TOGGLE === */
function toggleFilter(el) {
  el.classList.toggle('active');
  const checkbox = el.querySelector('.filter-checkbox');
  if (checkbox) {
    checkbox.innerHTML = el.classList.contains('active') ? '✓' : '';
  }
}