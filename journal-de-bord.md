# Journal de bord — P4 : Rendre la pensée visible

**Cours :** 420-TT4 — Tendances technologiques
**Projet :** Rendre la pensée visible

## 1. Objectif du projet

L'objectif de ce projet est de créer une application web qui aide les visiteurs à exprimer leurs observations, leurs idées et leurs questions grâce à des routines de pensée inspirées de Harvard Project Zero.

L'application permet de remplir un formulaire en plusieurs étapes, d'enregistrer une réflexion, de consulter les contributions dans une galerie et d'exporter les réflexions dans un fichier Markdown.

## 2. Tests réalisés

### 2.1. Vérification de l'application

J'ai ouvert l'application et vérifié que la page d'accueil s'affichait correctement. J'ai également vérifié que les différents éléments de l'interface étaient accessibles.

### 2.2. Test de la première routine

J'ai utilisé la routine « Voir – Penser – Se demander » avec le sujet « Une salle de serveurs allumée la nuit ».

J'ai répondu aux trois questions, soumis ma réflexion et vérifié qu'elle apparaissait dans la galerie.

### 2.3. Test des deux routines sur un même sujet

J'ai testé les deux routines avec le sujet « Deux personnes qui programment devant le même écran ».

Avec la routine « Voir – Penser – Se demander », j'ai décrit la situation, proposé une interprétation et formulé des questions.

Avec la routine « Avant je pensais… Maintenant je pense… », j'ai expliqué comment ma compréhension du travail en équipe pouvait évoluer.

Les deux réflexions ont été enregistrées avec succès. Ce test m'a permis de constater que deux routines différentes peuvent aider à réfléchir sur un même sujet de façons complémentaires.

### 2.4. Test de l'exportation

J'ai exporté le journal au format Markdown et ouvert le fichier `journal-pensee.md` pour vérifier son contenu.

J'ai vérifié que les réflexions enregistrées avec les deux routines figuraient dans l'exportation.

### 2.5. Test d'une réponse trop courte

J'ai envoyé directement à l'API une réflexion contenant une réponse de moins de 10 caractères.

L'API a refusé la demande et a renvoyé un message indiquant que le champ devait contenir au moins 10 caractères.

Ce test confirme que la validation est également effectuée côté serveur.

### 2.6. Test lorsque l'API est arrêtée

J'ai arrêté temporairement l'API, puis j'ai essayé de soumettre une réflexion depuis l'interface.

L'envoi a échoué et le navigateur a affiché un message d'erreur. J'ai vérifié que mes réponses restaient visibles dans le formulaire après cet échec.

J'ai ensuite redémarré l'API et vérifié qu'elle répondait de nouveau correctement.

### 2.7. Vérification de l'avis de confidentialité

J'ai vérifié que l'application affichait un avis précisant que les réflexions enregistrées pouvaient être consultées par les autres visiteurs, que le prénom était facultatif et qu'il fallait éviter de saisir des informations personnelles ou confidentielles.

## 3. Ce que j'ai compris

J'ai compris qu'un formulaire en plusieurs étapes peut guider progressivement une personne dans sa réflexion.

La routine « Voir – Penser – Se demander » aide à distinguer l'observation de l'interprétation et des questions. La routine « Avant je pensais… Maintenant je pense… » permet de comparer ses idées initiales avec sa compréhension actuelle et d'expliquer ce qui a fait évoluer sa pensée.

J'ai également compris l'importance de la validation des données côté client et côté serveur, du stockage des réflexions dans une base de données et de la gestion des erreurs lorsque l'API n'est pas disponible.

Enfin, la galerie et l'exportation Markdown permettent de conserver une trace des réflexions et de les consulter après l'activité.

## 4. Réflexion sur mon apprentissage

**Avant, je pensais :** une application de réflexion servait principalement à saisir des réponses dans un formulaire.

**Maintenant, je pense :** une application peut aussi accompagner une démarche d'apprentissage en organisant les idées, en encourageant les questions et en conservant une trace des réflexions.

**Ce qui a changé :** les tests réalisés m'ont permis de constater que le parcours en plusieurs étapes, les deux routines, la galerie et l'exportation contribuent à rendre la pensée visible. Les tests techniques m'ont aussi montré qu'une application doit valider les données et prévoir les erreurs pour être plus fiable.

## 5. Tests restant à effectuer

* Faire tester l'interface à deux personnes extérieures au cours, sans leur expliquer son fonctionnement au préalable.
* Observer si ces personnes comprennent facilement les routines et peuvent utiliser l'application de façon autonome.
* Demander à une personne qui ne connaît pas le projet de lire le journal exporté et de vérifier si son contenu est compréhensible.
* Finaliser la vérification de tous les fichiers du dossier de remise.
