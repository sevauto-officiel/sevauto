document.addEventListener('DOMContentLoaded', async () => {
  await loadSiteData();
  renderPromotions(promotions);
  renderCatalog(products);
  setupInteractions();
  if (window.refreshReveals) window.refreshReveals();
});

const money = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0
});

function renderCatalog(productList) {
  const container = document.getElementById('catalog-container');
  if (!container) return;

  if (!productList.length) {
    container.innerHTML = '<div class="empty-state">Aucun véhicule trouvé. Essayez une autre recherche.</div>';
    return;
  }

  container.innerHTML = productList.map((product, index) => {
    const discount = product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;
    const whatsappHref = vehicleWhatsappLink(product);

    return `
      <article class="vehicle-card" data-product-id="${product.id}">
        <a class="vehicle-media" href="produit.html?id=${product.id}" aria-label="Voir ${product.name}">
          <img src="${product.images[0]}" alt="${product.name}" width="520" height="388" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async">
          <span class="stock-pill ${product.inStock ? '' : 'off'}">${product.inStock ? 'En stock' : 'Sur commande'}</span>
        </a>
        <div class="vehicle-body">
          <div class="vehicle-meta">
            <span class="category-pill">${product.category}</span>
            ${discount > 0 ? `<span class="discount-pill">-${discount}%</span>` : ''}
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="vehicle-price">
            <strong>${money.format(product.price)}</strong>
            ${product.oldPrice ? `<span>${money.format(product.oldPrice)}</span>` : ''}
          </div>
          <div class="vehicle-actions">
            <a class="btn btn-dark" href="produit.html?id=${product.id}">Détails</a>
            <a class="btn btn-light" href="${whatsappHref}" target="_blank" rel="noreferrer">Contact</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function promoSlideMarkup(promo, index, clone) {
  return `
    <a href="${promo.link}" class="promo-slide-item"${clone ? ' aria-hidden="true" tabindex="-1"' : ''}>
      <img src="${promo.image}" alt="${promo.title}" width="900" height="520" loading="${index === 0 && !clone ? 'eager' : 'lazy'}" decoding="async">
      <div class="promo-copy">
        <p class="eyebrow compact">Promotion</p>
        <h3>${promo.title}</h3>
        <p>${promo.subtitle}</p>
        <span class="btn btn-light">Voir l'offre</span>
      </div>
    </a>
  `;
}

function renderPromotions(promoList) {
  const slider = document.getElementById('promoSlider');
  if (!slider) return;

  // Slides d'origine + une copie clonée pour une boucle infinie sans saut.
  const originals = promoList.map((promo, index) => promoSlideMarkup(promo, index, false));
  const clones = promoList.length > 1
    ? promoList.map((promo, index) => promoSlideMarkup(promo, index, true))
    : [];
  slider.innerHTML = originals.concat(clones).join('');
}

function setupInteractions() {
  const searchInput = document.getElementById('productSearch');

  function filteredProducts(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter(product => {
      const keywords = Array.isArray(product.keywords) ? product.keywords.join(' ') : '';
      return `${product.name} ${product.category} ${product.description} ${keywords}`.toLowerCase().includes(normalized);
    });
  }

  searchInput?.addEventListener('input', event => {
    renderCatalog(filteredProducts(event.target.value));
  });

  setupPromoCarousel();
}

function setupPromoCarousel() {
  const promoSlider = document.getElementById('promoSlider');
  const promoFrame = promoSlider?.closest('.promo-frame');
  const nextBtn = document.getElementById('nextPromo');
  const prevBtn = document.getElementById('prevPromo');
  if (!promoSlider) return;

  const count = promotions.length;
  const loop = count > 1; // les clones existent uniquement si plusieurs promos
  const AUTOPLAY_MS = 4200;
  const ANIM_MS = 620;

  let index = 0;
  let timer = null;
  let resetTimer = null;

  function slideWidth() {
    const first = promoSlider.querySelector('.promo-slide-item');
    if (!first) return 0;
    const gap = parseFloat(getComputedStyle(promoSlider).gap || '0');
    return first.getBoundingClientRect().width + gap;
  }

  function apply(animate) {
    promoSlider.style.transition = animate ? '' : 'none';
    promoSlider.style.transform = `translateX(-${index * slideWidth()}px)`;
    if (!animate) {
      // Force le navigateur à appliquer la position avant de réactiver l'animation.
      void promoSlider.offsetWidth;
      promoSlider.style.transition = '';
    }
    revealVisible();
  }

  // Affiche progressivement les slides visibles dans le cadre.
  function revealVisible() {
    const slides = promoSlider.querySelectorAll('.promo-slide-item');
    const frameRect = promoFrame.getBoundingClientRect();
    slides.forEach(slide => {
      const r = slide.getBoundingClientRect();
      const visible = r.right > frameRect.left + 40 && r.left < frameRect.right - 40;
      slide.classList.toggle('promo-in', visible);
    });
  }

  // Avance toujours vers la droite (slide suivante), avec boucle sans saut.
  function goNext() {
    if (!loop) return;
    index += 1;
    apply(true);
    if (index >= count) {
      clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        index = 0;
        apply(false);
      }, ANIM_MS);
    }
  }

  function goPrev() {
    if (!loop) return;
    if (index <= 0) {
      index = count; // saute sur le clone sans animation
      apply(false);
    }
    index -= 1;
    apply(true);
  }

  function startAutoplay() {
    if (!loop) return;
    stopAutoplay();
    timer = window.setInterval(goNext, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Relance l'autoplay après une interaction manuelle.
  function restartAutoplay() {
    stopAutoplay();
    window.setTimeout(startAutoplay, 800);
  }

  nextBtn?.addEventListener('click', () => { goNext(); restartAutoplay(); });
  prevBtn?.addEventListener('click', () => { goPrev(); restartAutoplay(); });

  // Contrôle au glisser (souris / tactile).
  let startX = 0;
  let dragging = false;
  promoSlider.addEventListener('pointerdown', event => {
    startX = event.clientX;
    dragging = true;
    stopAutoplay();
  });
  promoSlider.addEventListener('pointerup', event => {
    if (!dragging) return;
    dragging = false;
    const delta = event.clientX - startX;
    if (Math.abs(delta) >= 48) {
      if (delta < 0) goNext();
      else goPrev();
    }
    restartAutoplay();
  });

  promoSlider.addEventListener('transitionend', revealVisible);

  // Pause au survol pour laisser le temps de lire.
  promoFrame?.addEventListener('mouseenter', stopAutoplay);
  promoFrame?.addEventListener('mouseleave', startAutoplay);

  // Pause quand l'onglet n'est pas visible.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  window.addEventListener('resize', () => apply(false));

  apply(false);
  startAutoplay();
}
