# Rappels client

Ces notes étaient des commentaires dans les pages HTML et dans `src/demande.js`. Elles restent ici pour le suivi. Ce dossier n’est pas copié dans `dist` et n’est pas publié sur GitHub Pages.

Ne pas remettre ces rappels dans le HTML, le CSS ou le JavaScript livrés. Le site sert le HTML tel quel : un commentaire y est visible avec « afficher le code source ».

## Période des chiffres

Accueil et page À propos (`/`, `/a-propos/`, `/en/`, `/en/about/`).

Ne pas afficher la période couverte par les chiffres (partenaires financiers, clients, financement, concessionnaires) avant confirmation du client.

EN: Period covered by these figures. Do not display it until the client confirms it.

## Délai de réponse et nom du conseiller

Formulaires de demande, sur les pages de service, l’accueil, la soumission, le contact et Vincent Lacasse, en français et en anglais.

Confirmer le délai de réponse et le nom du conseiller. Ne rien afficher tant que le client ne les a pas donnés.

EN: Confirm the reply time and the advisor name. Do not show either until the client provides them.

## Heures d’ouverture

Pages Contact (`/contact/`, `/en/contact/`).

Ne pas afficher d’heures ni de texte de remplacement tant que le client ne les a pas fournies.

EN: Opening hours. Do not show a placeholder until the client provides them.

## Biographie de Vincent Lacasse

Pages `/vincent-lacasse/` et `/en/vincent-lacasse/`.

La phrase actuelle est neutre, en attendant le texte du client.

EN: Biography of Vincent Lacasse. Neutral sentence until the client provides the text.

## Outil du formulaire de demande

Choisir l’outil de formulaire hébergé au Canada et renseigner `VITE_DEMANDE_ENDPOINT` au build.

Tant que cette variable est vide, le visiteur confirme sa demande, puis son logiciel de courriel s’ouvre vers info@versacapital.ca. Le comportement est dans `src/demande.js`.
