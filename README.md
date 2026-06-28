# AKMServive

Site de vente et location de véhicule d'occasion. Fondé par Akesse Kamlan Justin et développé par CODERS 3W.

## 📋 Description

AKMServive propose des véhicules premium vérifiés partout en Côte d'Ivoire, avec un siège à San Pedro et un contact direct via WhatsApp.

## 🚀 Fonctionnalités

- **Catalogue dynamique** : 6 véhicules avec filtrage en temps réel
- **Pages détails produit** : Images, spécifications, couleurs disponibles
- **Articles/Actualités** : Section blog avec chargement JSON
- **Design réactif** : Mobile-first, optimisé pour tous les écrans
- **Contact WhatsApp** : Intégration directe pour les demandes
- **Performance** : Images optimisées, lazy loading, caching

## 📁 Structure du projet

```
akmservive/
├── index.html           # Page d'accueil
├── produit.html         # Détails d'un véhicule
├── articles.html        # Page actualités
├── about.html           # À propos
├── privacy.html         # Politique de confidentialité
├── terms.html           # Conditions d'utilisation
├── style.css            # Styles globaux
├── script.js            # Logique page d'accueil
├── produit.js           # Logique détails produit (CORRIGÉ)
├── articles.js          # Logique articles
├── data.js              # Données véhicules et promotions
├── articles.json        # Contenu articles
├── netlify.toml         # Configuration Netlify
├── .gitignore           # Fichiers ignorés Git
└── img/                 # Images (ATimg.jpeg, etc.)
```

## 🛠️ Technologie

- **Frontend** : HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript
- **Statique** : Aucune dépendance backend requise
- **Déploiement** : Netlify (CI/CD automatique)

## 🚀 Déploiement sur Netlify

### Connexion automatique via GitHub

1. Accédez à [netlify.com](https://netlify.com)
2. Cliquez "Add new site" → "Import an existing project"
3. Sélectionnez le dépôt `akmservive-officiel/akmservive`
4. Netlify détecte automatiquement la configuration
5. Votre site est en ligne ! 🎉

### Configuration personnalisée

Le fichier `netlify.toml` gère :
- **Pas de build** : Site statique pur
- **Routing** : Redirige vers index.html (SPA support)
- **Headers de sécurité** : X-Frame-Options, X-XSS-Protection, etc.
- **Caching** : Images/CSS/JS en cache 1 an

### Variables d'environnement Netlify

Pour activer les exemples de fonctions serverless dans `netlify/functions/`, ajoutez ces variables dans Netlify :
- `NETLIFY_TOKEN` : token d'accès Netlify (personal access token) avec les scopes appropriés.
- `SITE_ID` : ID du site Netlify à cibler.

Pour la gestion d'identité, les scopes recommandés sont : `identity:read`, `sites:read` et `identity:write` si vous supprimez ou modifiez des utilisateurs.

## 🔧 Développement local

### Serveur de développement

```bash
# Python 3
python3 -m http.server 3000

# Node.js (http-server)
npx http-server -p 3000

# Avec Live Reload
npx live-server --port=3000
```

Accédez à `http://localhost:3000`

## 📝 Maintenance

### Ajouter un véhicule

Mettez à jour `data.js` :

```javascript
const products = [
  {
    id: 7,
    name: "Nouveau modèle",
    price: 49990,
    oldPrice: 54990,
    category: "Sport",
    keywords: ["sport", "turbo"],
    images: ["img/new1.jpeg", "img/new2.jpeg"],
    description: "Description du véhicule",
    specs: { engine: "V6", power: "300 ch" },
    colors: ["Noir", "Gris"],
    inStock: true
  }
];
```

### Ajouter un article

Mettez à jour `articles.json` :

```json
{
  "articles": [
    {
      "title": "Titre de l'article",
      "summary": "Résumé court",
      "date": "2026-06-27",
      "image": "img/article1.jpeg",
      "body": "Contenu markdown de l'article"
    }
  ]
}
```

## 🐛 Dépannage

### Erreur: "Cannot read properties of undefined (reading 'get')"

✅ **Corrigée** dans `produit.js` (v1.1)
- Vérification de `window.location` avant utilisation
- Vérification que `data.js` est chargé
- Messages d'erreur dans la console

### Images ne s'affichent pas

- Vérifiez que le dossier `img/` existe
- Vérifiez les chemins relatifs dans `data.js`
- Consultez la console (F12) pour les erreurs 404

### Article ne charge pas

- Vérifiez que `articles.json` existe et est valide
- Ouvrez la console (F12) pour voir l'erreur fetch
- Assurez-vous que le JSON est bien formé

## 📞 Contact

- **WhatsApp** : +225 07 88 52 30 67
- **Email** : contact@akmservive.com
- **Localisation** : San Pedro, Côte d'Ivoire

## 📄 Licence

© 2026 AKMServive. Tous droits réservés.

Développé et maintenu par **CODERS 3W**.
