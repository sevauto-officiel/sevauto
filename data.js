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

const SEVAUTO_WHATSAPP = '2250788523067';

const whatsappMoney = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  maximumFractionDigits: 0
});

// Construit un message WhatsApp professionnel reprenant les infos du véhicule.
function vehicleWhatsappLink(product) {
  if (!product) {
    return `https://wa.me/${SEVAUTO_WHATSAPP}?text=${encodeURIComponent('Bonjour SevAuto, je souhaite obtenir des renseignements sur vos véhicules.')}`;
  }

  let pageUrl = `produit.html?id=${product.id}`;
  try {
    pageUrl = new URL(pageUrl, window.location.href).href;
  } catch (error) {
    /* on garde l'URL relative en cas d'échec */
  }

  const lines = [
    'Bonjour SevAuto,',
    '',
    'Je souhaite obtenir plus de renseignements sur ce véhicule :',
    '',
    `🚗 Modèle : ${product.name}`
  ];

  if (product.category) lines.push(`🏷️ Catégorie : ${product.category}`);
  if (product.price) lines.push(`💰 Prix affiché : ${whatsappMoney.format(product.price)}`);
  if (product.specs && product.specs.engine) lines.push(`⚙️ Moteur : ${product.specs.engine}`);
  if (product.specs && product.specs.power) lines.push(`🐎 Puissance : ${product.specs.power}`);
  lines.push(`🔗 Fiche : ${pageUrl}`);
  lines.push('');
  lines.push('Pourriez-vous me préciser la disponibilité, les modalités de paiement et de livraison, ainsi que les conditions ? Merci d\'avance.');

  return `https://wa.me/${SEVAUTO_WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
}
