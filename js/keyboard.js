/* SAM'S CLUB REDESIGN - KEYBOARD NAVIGATION */

document.addEventListener('DOMContentLoaded', () => {
  initKeyboardNavigation();
  initCarouselKeyboard();
  initProductGridKeyboard();
  initMenuKeyboard();
  initAccordionKeyboard();
});

/**
 * GLOBAL KEYBOARD SHORTCUTS
 * - Escape: Cerrar menús/modales abiertos
 * - / (slash): Ir al buscador
 * - ? : Mostrar ayuda
 */
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Escape para cerrar menús/modales
    if (e.key === 'Escape') {
      closeOpenMenus();
    }

    // "/" para ir al buscador (si no estamos en un input)
    if (e.key === '/' && !isInInput(e.target)) {
      e.preventDefault();
      const search = document.querySelector('.search-wrap input[type="search"]');
      if (search) {
        search.focus();
        search.select();
      }
    }

    // "?" para mostrar ayuda (si no estamos en un input)
    if (e.key === '?' && !isInInput(e.target)) {
      e.preventDefault();
      showKeyboardHelp();
    }

    // Alt + H: Ir a Inicio
    if (e.altKey && e.key.toLowerCase() === 'h') {
      window.location.href = document.querySelector('.logo')?.href || '/';
    }

    // Alt + C: Ir a Carrito
    if (e.altKey && e.key.toLowerCase() === 'c') {
      const cartLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Carrito'));
      if (cartLink) window.location.href = cartLink.href;
    }

    // Alt + L: Iniciar sesión
    if (e.altKey && e.key.toLowerCase() === 'l') {
      const loginLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Iniciar sesión'));
      if (loginLink) window.location.href = loginLink.href;
    }
  });
}

/**
 * CAROUSEL KEYBOARD NAVIGATION
 * - Left/Right arrows: Navegar entre slides
 * - Enter: Abrir detalle del producto
 */
function initCarouselKeyboard() {
  // Carruseles de productos
  document.querySelectorAll('.products-scroll, .promo-carousel__track').forEach(carousel => {
    const parent = carousel.closest('.promo-carousel, [class*="carousel"]');
    if (!parent) return;

    const prevBtn = parent.querySelector('[class*="prev"]');
    const nextBtn = parent.querySelector('[class*="next"]');

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevBtn?.click();
        carousel.focus();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextBtn?.click();
        carousel.focus();
      }
    });

    // Hacer scroll accesible por teclado
    carousel.setAttribute('tabindex', '0');
    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Carrusel de productos');
  });

  // Botones de navegación del carrusel
  document.querySelectorAll('.promo-carousel__arrow').forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Dots del carrusel
  document.querySelectorAll('.promo-carousel__dot').forEach(dot => {
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dot.click();
      }
    });
  });
}

/**
 * PRODUCT GRID KEYBOARD NAVIGATION
 * - Arrow keys: Navegar entre productos
 * - Enter: Abrir producto
 */
function initProductGridKeyboard() {
  const grids = document.querySelectorAll('.products-grid, .cat-discount-grid, [class*="product"][class*="grid"]');

  grids.forEach(grid => {
    const products = grid.querySelectorAll('article, a[class*="card"]');
    
    products.forEach((product, idx) => {
      // Hacer navegable por teclado
      if (!product.getAttribute('tabindex')) {
        product.setAttribute('tabindex', '0');
      }

      product.addEventListener('keydown', (e) => {
        const currentIdx = Array.from(products).indexOf(product);

        // Flecha arriba/izquierda
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIdx = currentIdx > 0 ? currentIdx - 1 : products.length - 1;
          products[prevIdx].focus();
        }

        // Flecha abajo/derecha
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIdx = currentIdx < products.length - 1 ? currentIdx + 1 : 0;
          products[nextIdx].focus();
        }

        // Enter para activar
        if (e.key === 'Enter') {
          const link = product.querySelector('a');
          if (link) {
            link.click();
          } else if (product.onclick) {
            product.onclick(e);
          }
        }

        // Space para agregar al carrito
        if (e.key === ' ') {
          const addBtn = product.querySelector('.add-btn');
          if (addBtn) {
            e.preventDefault();
            addBtn.click();
          }
        }
      });
    });
  });
}

/**
 * MENU/DROPDOWN KEYBOARD NAVIGATION
 * - ArrowDown/ArrowUp: Navegar entre opciones
 * - Enter/Space: Seleccionar opción
 * - Escape: Cerrar menú
 */
function initMenuKeyboard() {
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.header-nav__link--dropdown');
    const panel = dropdown.querySelector('.nav-dropdown__panel');
    const items = panel?.querySelectorAll('a');

    if (!trigger || !panel || !items) return;

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        dropdown.classList.add('nav-dropdown--open');
        items[0]?.focus();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        dropdown.classList.remove('nav-dropdown--open');
        trigger.focus();
      }
    });

    items.forEach((item, idx) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIdx = idx < items.length - 1 ? idx + 1 : 0;
          items[nextIdx].focus();
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIdx = idx > 0 ? idx - 1 : items.length - 1;
          items[prevIdx].focus();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          dropdown.classList.remove('nav-dropdown--open');
          trigger.focus();
        }
        if (e.key === 'Enter') {
          item.click();
        }
      });
    });
  });

  // Mobile menu
  document.querySelectorAll('.mobile-menu .mm-item').forEach((item, idx, items) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = idx < items.length - 1 ? idx + 1 : 0;
        items[nextIdx].focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = idx > 0 ? idx - 1 : items.length - 1;
        items[prevIdx].focus();
      }
    });
  });
}

/**
 * ACCORDION KEYBOARD NAVIGATION (FAQ, beneficios)
 * - ArrowUp/ArrowDown: Navegar entre items
 * - Enter/Space: Expandir/Contraer
 */
function initAccordionKeyboard() {
  document.querySelectorAll('.faq-question, [class*="accordion"]').forEach((question, idx, questions) => {
    if (!question.getAttribute('tabindex')) {
      question.setAttribute('tabindex', '0');
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');
    }

    question.addEventListener('keydown', (e) => {
      // ArrowUp
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = idx > 0 ? idx - 1 : questions.length - 1;
        questions[prevIdx].focus();
      }

      // ArrowDown
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = idx < questions.length - 1 ? idx + 1 : 0;
        questions[nextIdx].focus();
      }

      // Enter o Space para expandir
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const faqItem = question.closest('.faq-item');
        if (faqItem) {
          faqItem.classList.toggle('open');
          question.setAttribute('aria-expanded', faqItem.classList.contains('open'));
        } else {
          question.click();
        }
      }
    });
  });
}

/**
 * PILL/TAB KEYBOARD NAVIGATION
 * - Arrow keys: Navegar entre tabs
 * - Enter: Seleccionar tab
 */
function initTabKeyboard() {
  document.querySelectorAll('[role="tablist"], .subcategory-pills, .listas-tabs').forEach(tabList => {
    const tabs = tabList.querySelectorAll('[role="tab"], .pill, .listas-tab');

    tabs.forEach((tab, idx) => {
      tab.setAttribute('tabindex', idx === 0 ? '0' : '-1');
      tab.setAttribute('role', 'tab');

      tab.addEventListener('keydown', (e) => {
        let newIdx = idx;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          newIdx = idx < tabs.length - 1 ? idx + 1 : 0;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          newIdx = idx > 0 ? idx - 1 : tabs.length - 1;
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIdx = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          newIdx = tabs.length - 1;
        }

        tabs.forEach(t => {
          t.setAttribute('tabindex', '-1');
          t.classList.remove('active');
        });
        tabs[newIdx].setAttribute('tabindex', '0');
        tabs[newIdx].classList.add('active');
        tabs[newIdx].focus();
        tabs[newIdx].click();
      });
    });
  });
}

/**
 * FORM KEYBOARD NAVIGATION
 * - Tab natural
 * - Enter para submit
 * - Escape para cancelar
 */
function initFormKeyboard() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const cancelBtn = form.querySelector('[type="reset"], .btn-cancel');
        if (cancelBtn) cancelBtn.click();
        else form.reset();
      }

      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.click();
      }
    });
  });
}

/**
 * UTILITY FUNCTIONS
 */

function isInInput(target) {
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || target.contentEditable === 'true';
}

function closeOpenMenus() {
  // Cerrar dropdowns
  document.querySelectorAll('.nav-dropdown--open').forEach(dropdown => {
    dropdown.classList.remove('nav-dropdown--open');
  });

  // Cerrar mobile menu
  const mobileMenu = document.querySelector('.mobile-menu');
  if (mobileMenu?.classList.contains('open')) {
    mobileMenu.classList.remove('open');
  }

  // Cerrar overlay
  document.querySelector('.overlay')?.classList.remove('on', 'show');

  // Cerrar modales
  document.querySelectorAll('.modal-overlay.show').forEach(modal => {
    modal.classList.remove('show');
  });
}

function showKeyboardHelp() {
  const helpText = `
    ⌨️ ATAJOS DE TECLADO - Sam's Club
    
    NAVEGACIÓN GLOBAL:
    / = Ir al buscador
    ? = Mostrar esta ayuda
    Esc = Cerrar menús/modales
    
    ATAJOS RÁPIDOS:
    Alt + H = Ir a Inicio
    Alt + C = Ir a Carrito
    Alt + L = Iniciar sesión
    
    NAVEGACIÓN EN GRILLAS:
    ↑↓←→ = Navegar entre productos
    Enter = Abrir producto
    Space = Agregar al carrito
    
    CARRUSELES:
    ←→ = Navegar slides
    
    MENÚS:
    ↓ = Abrir/navegar menú
    ↑ = Ir hacia atrás
    
    FAQ/ACORDEONES:
    ↑↓ = Navegar items
    Enter/Space = Expandir/Contraer
    
    FORMULARIOS:
    Ctrl + Enter = Enviar
    Esc = Cancelar
  `;

  // Crear modal de ayuda si no existe
  let helpModal = document.getElementById('keyboard-help-modal');
  if (!helpModal) {
    helpModal = document.createElement('div');
    helpModal.id = 'keyboard-help-modal';
    helpModal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      padding: 16px;
    `;
    helpModal.innerHTML = `
      <div style="
        background: var(--bg-card);
        border-radius: 12px;
        padding: 32px 24px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        color: var(--text);
        font-family: var(--font);
      ">
        <h2 style="margin-bottom: 16px; font-size: 1.25rem; font-weight: 700;">Atajos de teclado</h2>
        <pre style="
          white-space: pre-wrap;
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-2);
          font-family: 'Roboto Mono', monospace;
          margin-bottom: 16px;
        ">${helpText}</pre>
        <button onclick="this.closest('#keyboard-help-modal').remove()" style="
          background: var(--sams-blue);
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          width: 100%;
        ">Cerrar (Esc)</button>
      </div>
    `;
    document.body.appendChild(helpModal);
  } else {
    helpModal.style.display = 'flex';
  }

  // Cerrar con Escape
  const closeHandler = (e) => {
    if (e.key === 'Escape') {
      helpModal.remove();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);

  // Cerrar con click en background
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      helpModal.remove();
    }
  });
}

// Inicializar tabs cuando esté disponible
document.addEventListener('DOMContentLoaded', () => {
  initTabKeyboard();
  initFormKeyboard();
});
