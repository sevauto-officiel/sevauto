let products = [];
let promotions = [];

async function loadSiteData() {
  try {
    const response = await fetch('data.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    promotions = Array.isArray(data.promotions) ? data.promotions : [];
    products = Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    console.error('Impossible de charger data.json', error);
    promotions = [];
    products = [];
  }
  return { products, promotions };
}

function addProduct(newProduct) {
  const id = products.length ? Math.max(...products.map(product => product.id)) + 1 : 1;
  products.push({ ...newProduct, id });
  return products;
}

function getProductById(id) {
  return products.find(product => product.id === id);
}

function filterProducts(category) {
  if (category === 'all') return products;
  return products.filter(product => product.category === category);
}
