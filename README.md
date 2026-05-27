# PharmaConnect Mobile

Front mobile React Native/Expo pour une application de reservation et precommande en pharmacie.

## Parcours couverts

- Connexion et inscription client.
- Recherche par medicament ou par pharmacie.
- Pharmacies proches avec geolocalisation.
- Fiche pharmacie et disponibilite des produits.
- Panier, quantites et mode de paiement en ligne ou sur place.
- Upload d'ordonnance et demande de devis a une pharmacie.
- Suivi de commande avec code de retrait.

## Organisation du code

```txt
src/
  app/              Shell principal et logique temporaire du prototype
  features/         Ecrans et composants par domaine metier
  mocks/            Donnees locales avant branchement backend
  navigation/       Configuration et barre de navigation
  shared/           Composants UI, styles, types et utilitaires partages
```

`App.tsx` reste volontairement minimal. La logique d'etat actuelle est dans
`src/app/usePharmaConnectApp.ts` en attendant le backend Node.js/PostgreSQL.

## Lancer le projet

```bash
cd C:\Users\leand\Project\pharma-connect-mobile
npm install
npm run start
```

Le backend pourra ensuite exposer les entites principales suivantes : `users`, `pharmacies`, `medicines`, `inventory`, `prescriptions`, `orders`, `order_items`, `payments`.
