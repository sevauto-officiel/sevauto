document.addEventListener('DOMContentLoaded', async () => {
  await loadSiteData();
  renderPromotions(promotions);
  renderCatalog(products);
  setupInteractions();
});

const money = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
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
    const whatsappText = encodeURIComponent(`Bonjour, je suis intéressé par ${product.name}`);

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
            <a class="btn btn-light" href="https://wa.me/2250788523067?text=${whatsappText}" target="_blank" rel="noreferrer">Contact</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderPromotions(promoList) {
  const slider = document.getElementById('promoSlider');
  if (!slider) return;

  slider.innerHTML = promoList.map((promo, index) => `
    <a href="${promo.link}" class="promo-slide-item">
      <img src="${promo.image}" alt="${promo.title}" width="900" height="520" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async">
      <div class="promo-copy">
        <p class="eyebrow compact">Promotion</p>
        <h3>${promo.title}</h3>
        <p>${promo.subtitle}</p>
        <span class="btn btn-light">Voir l'offre</span>
      </div>
    </a>
  `).join('');
}

function setupInteractions() {
  const searchInput = document.getElementById('productSearch');
  const nextBtn = document.getElementById('nextPromo');
  const promoSlider = document.getElementById('promoSlider');
  let promoIndex = 0;
  let startX = 0;

  function filteredProducts(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter(product => {
      const keywords = Array.isArray(product.keywords) ? product.keywords.join(' ') : '';
      return `${product.name} ${product.category} ${product.description} ${keywords}`.toLowerCase().includes(normalized);
    });
  }

  function slideWidth() {
    const firstSlide = promoSlider?.querySelector('.promo-slide-item');
    if (!firstSlide) return 0;
    const gap = parseFloat(getComputedStyle(promoSlider).gap || '0');
    return firstSlide.getBoundingClientRect().width + gap;
  }

  function updateSlider() {
    if (!promoSlider) return;
    promoSlider.style.transform = `translateX(-${promoIndex * slideWidth()}px)`;
  }

  searchInput?.addEventListener('input', event => {
    renderCatalog(filteredProducts(event.target.value));
  });

  nextBtn?.addEventListener('click', () => {
    promoIndex = (promoIndex + 1) % promotions.length;
    updateSlider();
  });

  promoSlider?.addEventListener('pointerdown', event => {
    startX = event.clientX;
  });

  promoSlider?.addEventListener('pointerup', event => {
    const delta = event.clientX - startX;
    if (Math.abs(delta) < 48) return;
    promoIndex = delta < 0
      ? (promoIndex + 1) % promotions.length
      : Math.max(0, promoIndex - 1);
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);

  if (promotions.length > 1) {
    window.setInterval(() => {
      promoIndex = (promoIndex + 1) % promotions.length;
      updateSlider();
    }, 6500);
  }
}
