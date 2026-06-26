document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));

  if (!productId) {
    window.location.href = 'index.html#catalog';
    return;
  }

  const product = getProductById(productId);
  const detail = document.getElementById('product-detail');

  if (!product) {
    detail.innerHTML = '<div class="empty-state">Véhicule introuvable. <a href="index.html#catalog">Retour au catalogue</a></div>';
    return;
  }

  renderProductDetail(product);
  renderRelatedProducts(product);
});

const productMoney = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
});

function renderProductDetail(product) {
  document.title = `${product.name} - SevAuto`;
  setText('product-name', product.name);
  setText('product-category', product.category);
  setText('product-price', productMoney.format(product.price));
  setText('product-description', product.description);
  setText('stock-indicator', product.inStock ? 'En stock' : 'Sur commande');

  const mainImage = document.getElementById('main-image');
  mainImage.src = product.images[0];
  mainImage.alt = product.name;

  const whatsapp = document.getElementById('whatsapp-product-link');
  const message = encodeURIComponent('Bonjour, je suis intéressé par ' + product.name);
  whatsapp.href = `https://wa.me/2250788523067?text=${message}`;

  renderThumbnails(product, mainImage);
  renderSpecs(product.specs);
  renderColors(product.colors);
}

function renderThumbnails(product, mainImage) {
  const container = document.getElementById('colors-container');
  container.innerHTML = product.images.map((image, index) => `
    <button class="thumb-btn ${index === 0 ? 'is-active' : ''}" type="button" data-image="${image}" aria-label="Afficher l'image ${index + 1}">
      <img src="${image}" alt="${product.name} - vue ${index + 1}" width="120" height="90" loading="lazy" decoding="async">
    </button>
  `).join('');

  container.addEventListener('click', event => {
    const button = event.target.closest('.thumb-btn');
    if (!button) return;
    mainImage.src = button.dataset.image;
    container.querySelectorAll('.thumb-btn').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
  });
}

function renderSpecs(specs) {
  const container = document.getElementById('specs-container');
  container.innerHTML = Object.entries(specs).map(([key, value]) => `
    <div class="spec-item">
      <strong>${formatSpecLabel(key)}</strong>
      <span>${value}</span>
    </div>
  `).join('');
}

function renderColors(colors) {
  const container = document.getElementById('colors-container-btn');
  container.innerHTML = colors.map((color, index) => `
    <button class="color-chip ${index === 0 ? 'is-active' : ''}" type="button">${color}</button>
  `).join('');

  container.addEventListener('click', event => {
    const button = event.target.closest('.color-chip');
    if (!button) return;
    container.querySelectorAll('.color-chip').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
  });
}

function renderRelatedProducts(currentProduct) {
  const container = document.getElementById('related-products');
  const note = document.getElementById('related-note');
  if (!container) return;

  const sameCategory = products.filter(product =>
    product.id !== currentProduct.id && product.category === currentProduct.category
  );
  const fallback = products.filter(product =>
    product.id !== currentProduct.id && product.category !== currentProduct.category
  );
  const related = [...sameCategory, ...fallback].slice(0, 3);

  if (note) {
    note.textContent = sameCategory.length
      ? `D'autres véhicules de la catégorie ${currentProduct.category}, ainsi que des alternatives proches.`
      : 'Aucun autre modèle dans cette catégorie pour le moment : voici des alternatives recommandées.';
  }

  if (!related.length) {
    container.innerHTML = '<div class="empty-state">Aucune suggestion disponible pour le moment.</div>';
    return;
  }

  container.innerHTML = related.map(product => {
    const discount = product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;
    const whatsappText = encodeURIComponent(`Bonjour, je suis intéressé par ${product.name}`);

    return `
      <article class="vehicle-card">
        <a class="vehicle-media" href="produit.html?id=${product.id}" aria-label="Voir ${product.name}">
          <img src="${product.images[0]}" alt="${product.name}" width="520" height="388" loading="lazy" decoding="async">
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
            <strong>${productMoney.format(product.price)}</strong>
            ${product.oldPrice ? `<span>${productMoney.format(product.oldPrice)}</span>` : ''}
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

function formatSpecLabel(key) {
  const labels = {
    engine: 'Moteur',
    power: 'Puissance'
  };
  return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}
