const promotions = [
  {
    title: "Offre privilège sur la SevAuto GT",
    subtitle: "Remise immédiate et accompagnement prioritaire jusqu'au 30 juin.",
    image: "img/ATimg.jpeg",
    link: "produit.html?id=1"
  },
  {
    title: "SUV familial disponible en stock",
    subtitle: "Un modèle spacieux, robuste et prêt à être livré à San Pedro.",
    image: "img/ATimg1.jpeg",
    link: "produit.html?id=6"
  },
  {
    title: "Sélection prestige pour clients WhatsApp",
    subtitle: "Des conditions exclusives pour les demandes confirmées rapidement.",
    image: "img/ATimg2.jpeg",
    link: "produit.html?id=5"
  }
];

const products = [
  {
    id: 1,
    name: "SevAuto GT Signature",
    price: 79990,
    oldPrice: 89990,
    category: "Luxe",
    keywords: ["premium", "v8", "grand tourisme", "GT", "signature"],
    images: ["img/ATimg.jpeg", "img/ATimg4.jpeg"],
    description: "Grand tourisme haut de gamme avec intérieur raffiné, conduite souple et présence élégante sur route.",
    specs: {
      engine: "V8 biturbo",
      power: "520 ch"
    },
    colors: ["Noir profond", "Gris métal", "Bleu nuit"],
    inStock: true
  },
  {
    id: 2,
    name: "SevAuto RS Performance",
    price: 59990,
    oldPrice: 67990,
    category: "Sport",
    keywords: ["sport", "turbo", "accélération", "performance", "RS"],
    images: ["img/ATimg1.jpeg", "img/ATimg2.jpeg"],
    description: "Modèle sportif pensé pour les conducteurs qui veulent une accélération franche et un style affirmé.",
    specs: {
      engine: "V6 turbo",
      power: "380 ch"
    },
    colors: ["Rouge intense", "Noir profond"],
    inStock: true
  },
  {
    id: 3,
    name: "SevAuto Urban Plus",
    price: 49990,
    oldPrice: 54990,
    category: "Urbain",
    keywords: ["compact", "ville", "maniable", "citadine", "urbain"],
    images: ["img/ATimg3.jpeg", "img/ATimg1.jpeg"],
    description: "Véhicule compact, maniable et confortable, idéal pour les trajets quotidiens en ville.",
    specs: {
      engine: "4 cylindres turbo",
      power: "280 ch"
    },
    colors: ["Blanc nacré", "Gris métal", "Noir profond"],
    inStock: true
  },
  {
    id: 4,
    name: "SevAuto City Access",
    price: 39990,
    oldPrice: 42990,
    category: "Économique",
    keywords: ["budget", "fiable", "pratique", "économie", "access"],
    images: ["img/ATimg4.jpeg"],
    description: "Une solution fiable et accessible pour rouler sereinement, sans compromis sur l'essentiel.",
    specs: {
      engine: "4 cylindres essence",
      power: "160 ch"
    },
    colors: ["Argent", "Bleu océan"],
    inStock: false
  },
  {
    id: 5,
    name: "SevAuto Elite Prestige",
    price: 89990,
    oldPrice: 99990,
    category: "Luxe",
    keywords: ["prestige", "technologie", "v12", "haut de gamme", "elite"],
    images: ["img/ATimg2.jpeg", "img/ATimg3.jpeg"],
    description: "Finition prestige, équipements avancés et confort supérieur pour une expérience de conduite exclusive.",
    specs: {
      engine: "V12 biturbo",
      power: "650 ch"
    },
    colors: ["Noir profond", "Blanc perle", "Or champagne"],
    inStock: true
  },
  {
    id: 6,
    name: "SevAuto SUV Premium",
    price: 69990,
    oldPrice: 74990,
    category: "SUV",
    keywords: ["suv", "spacieux", "robuste", "familial", "premium"],
    images: ["img/ATimg1.jpeg", "img/ATimg2.jpeg"],
    description: "SUV spacieux et robuste, parfait pour la famille, les longs trajets et les routes exigeantes.",
    specs: {
      engine: "V6 diesel",
      power: "320 ch"
    },
    colors: ["Noir profond", "Gris graphite", "Brun moka"],
    inStock: true
  }
];

function addProduct(newProduct) {
  const id = Math.max(...products.map(product => product.id)) + 1;
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
