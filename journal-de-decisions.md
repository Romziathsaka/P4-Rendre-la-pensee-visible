Journal de décisions — P4 : Rendre la pensée visible

Cours : 420-TT4 — Tendances technologiques
Projet : Rendre la pensée visible

Décision 1 — Utiliser un formulaire en plusieurs étapes

Contexte : Les visiteurs doivent répondre à plusieurs questions pour exprimer leur réflexion.

Options envisagées :

Afficher toutes les questions sur une seule page.
Afficher une seule question à la fois.

Décision : Utiliser un formulaire en plusieurs étapes.

Justification : Cette organisation guide progressivement le visiteur et lui permet de se concentrer sur une question à la fois.

Conséquences : L'interface est plus structurée. Il faut toutefois gérer la progression entre les étapes et conserver les réponses déjà saisies.

Décision 2 — Proposer deux routines de pensée

Contexte : Le projet doit aider les visiteurs à réfléchir et à prendre conscience de leurs idées.

Options envisagées :

Proposer une seule routine.
Proposer deux routines différentes.

Décision : Proposer les routines « Voir – Penser – Se demander » et « Avant je pensais… Maintenant je pense… ».

Justification : La première routine aide à observer, interpréter et formuler des questions. La deuxième aide à réfléchir à l'évolution de ses idées.

Conséquences : Les visiteurs disposent de deux façons de structurer leur réflexion.

Décision 3 — Utiliser React pour l'interface

Contexte : L'application doit afficher les questions progressivement et mettre à jour les réponses au fur et à mesure de la saisie.

Décision : Utiliser React pour construire l'interface.

Justification : React permet de gérer l'état du formulaire et d'afficher l'étape appropriée.

Conséquences : Il faut gérer les réponses et la progression avec l'état de l'application.

Décision 4 — Utiliser PostgreSQL et JSONB pour stocker les réflexions

Contexte : Les deux routines ne comportent pas exactement les mêmes champs de réponse.

Options envisagées :

Créer des colonnes distinctes pour toutes les réponses possibles.
Stocker les réponses dans une colonne JSONB.

Décision : Utiliser une colonne JSONB pour les réponses.

Justification : Ce choix permet de conserver des réponses de structures différentes dans une même table.

Conséquences : Le stockage est flexible. En revanche, certaines recherches précises sur les réponses peuvent être moins simples que dans une structure avec des colonnes dédiées.

Décision 5 — Vérifier les réponses avant de les enregistrer

Contexte : Une réflexion doit contenir des réponses suffisamment développées.

Décision : Exiger au moins 10 caractères pour chaque réponse et vérifier les données dans l'interface ainsi que sur le serveur.

Justification : Cette validation encourage les visiteurs à développer leurs idées et évite de faire confiance uniquement au navigateur.

Conséquences : Les réponses trop courtes doivent être corrigées avant l'enregistrement.

Décision 6 — Proposer une galerie et une exportation Markdown

Contexte : Les réflexions doivent pouvoir être consultées et conservées.

Options envisagées :

Afficher uniquement les réflexions dans l'application.
Afficher les réflexions et permettre leur exportation.

Décision : Proposer une galerie et une fonctionnalité d'exportation en Markdown.

Justification : La galerie permet de consulter les contributions, tandis que l'exportation facilite leur conservation et leur partage.

Conséquences : Un fichier journal-pensee.md peut être téléchargé pour servir d'annexe au dossier.

Décision 7 — Informer les visiteurs sur la confidentialité

Contexte :** Les visiteurs peuvent enregistrer des réflexions qui seront visibles dans la galerie. Il est donc important de les informer de l'utilisation de leurs contributions.

Options envisagées :**

Ne pas afficher d'avis de confidentialité.
Afficher un avis précisant la visibilité des réflexions et les précautions à prendre.

Décision :** Afficher un avis de confidentialité dans l'interface.

Justification :** Les visiteurs doivent savoir que leurs réflexions enregistrées peuvent être consultées par d'autres personnes. Le prénom reste facultatif et les visiteurs sont invités à ne pas saisir d'informations personnelles ou confidentielles.

Conséquences :** Les visiteurs sont mieux informés avant de soumettre leurs réponses. Cet avis ne remplace toutefois pas une politique complète de gestion et de conservation des données.

Conclusion

Les décisions de conception visent à rendre la réflexion accessible, à conserver les réponses et à faciliter la documentation des apprentissages. Elles associent des choix pédagogiques à des solutions techniques.