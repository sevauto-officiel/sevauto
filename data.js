let products = [];
let promotions = [];

async function fetchJson(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function loadSiteData() {
  try {
    const data = await fetchJson('data.json');
    products = Array.isArray(data.products) ? data.products : [];

    // Les promotions ont leur propre fichier ; repli sur data.json pour rester compatible.
    try {
      const promoData = await fetchJson('promotions.json');
      promotions = Array.isArray(promoData.promotions) ? promoData.promotions : [];
    } catch (error) {
      promotions = Array.isArray(data.promotions) ? data.promotions : [];
    }
  } catch (error) {
    console.error('Impossible de charger les données du site', error);
    products = [];
    promotions = [];
  }

  // Identifiants attribués automatiquement selon la position : uniques, sans doublon,
  // et réindexés tout seuls dès qu'un véhicule est ajouté ou supprimé.
  products.forEach((product, index) => { product.id = index + 1; });

  return { products, promotions };
}

function addProduct(newProduct) {
  products.push({ ...newProduct });
  products.forEach((product, index) => { product.id = index + 1; });
  return products;
}

// Construit le lien d'une promotion : à partir du véhicule choisi (menu déroulant)
// ou, à défaut, de l'ancien champ « lien » saisi manuellement.
function promoLink(promo) {
  if (promo && promo.linkVehicle) {
    const index = products.findIndex(product => product.name === promo.linkVehicle);
    if (index >= 0) return `produit.html?id=${index + 1}`;
  }
  return promo && promo.link ? promo.link : 'index.html#catalog';
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
