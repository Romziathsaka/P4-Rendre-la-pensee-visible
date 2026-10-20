# P4 — Rendre la pensée visible

## 1. Présentation du projet

Ce projet est une application web qui aide les utilisateurs à organiser leurs idées à l'aide de routines de pensée inspirées de **Harvard Project Zero**.

L'application propose deux routines :

* **Voir – Penser – Se demander** : observer une situation, interpréter ce que l'on voit et formuler des questions.
* **Avant je pensais… Maintenant je pense…** : comparer ses idées initiales avec sa compréhension actuelle et expliquer ce qui a fait évoluer sa pensée.

Les réflexions sont enregistrées dans une base de données et peuvent être consultées dans une galerie ou exportées au format Markdown.

## 2. Technologies utilisées

* **Frontend :** React, Vite et Tailwind CSS.
* **Backend :** Node.js et Express.
* **Base de données :** PostgreSQL.
* **Conteneurisation :** Docker Compose.

## 3. Installation et démarrage

### Prérequis

Installer Docker Desktop et démarrer Docker avant de lancer le projet.

### Lancer l'application

À partir du dossier racine du projet, exécuter :

```bash
docker compose up --build
```

L'application est accessible aux adresses suivantes :

* **Interface web :** http://localhost:5174
* **API :** http://localhost:4004
* **Vérification de l'API :** http://localhost:4004/api/health
* **Export du journal :** http://localhost:4004/api/export.md

Pour arrêter les services :

```bash
docker compose down
```

Pour les relancer en arrière-plan :

```bash
docker compose up -d
```

## 4. Fonctionnement de l'application

L'utilisateur suit les étapes suivantes :

1. Choisir une routine de pensée.
2. Indiquer le sujet de sa réflexion.
3. Répondre aux trois questions de la routine, une étape à la fois.
4. Relire ses réponses avant de les soumettre.
5. Enregistrer sa réflexion.
6. Consulter les réflexions dans la galerie.
7. Exporter le journal au format Markdown.

Les champs de réponse doivent contenir au moins 10 caractères. Cette règle est vérifiée dans l'interface et sur le serveur.

La galerie permet de consulter les réflexions enregistrées et de les filtrer.

## 5. De la pédagogie aux choix techniques

| Principe pédagogique                   | Choix technique                                    |
| -------------------------------------- | -------------------------------------------------- |
| Observer avant d'interpréter           | Une seule question est affichée à chaque étape.    |
| Accompagner l'expression des idées     | Des amorces de phrases sont proposées.             |
| Encourager la justification            | Une longueur minimale de 10 caractères est exigée. |
| Développer la métacognition            | Une étape de relecture précède l'envoi.            |
| Rendre la pensée visible               | Les réflexions sont présentées dans une galerie.   |
| Conserver une trace des apprentissages | Le journal peut être exporté au format Markdown.   |

## 6. Architecture technique

L'application suit une architecture en trois parties :

* **React :** affiche l'interface et guide l'utilisateur dans les étapes de réflexion.
* **Express :** reçoit les requêtes, valide les données et communique avec la base de données.
* **PostgreSQL :** conserve les réflexions enregistrées.

Les principales routes de l'API sont :

| Méthode | Route              | Fonction                                |
| ------- | ------------------ | --------------------------------------- |
| GET     | `/api/health`      | Vérifier que l'API fonctionne.          |
| POST    | `/api/reflections` | Enregistrer une réflexion.              |
| GET     | `/api/reflections` | Récupérer les réflexions.               |
| GET     | `/api/export.md`   | Exporter le journal au format Markdown. |

Les réponses sont stockées dans une structure JSONB afin de prendre en charge les champs propres aux différentes routines.

## 7. Confidentialité

Un avis de confidentialité est affiché dans l'application.

Le prénom est facultatif. Les visiteurs sont informés que leurs réflexions enregistrées peuvent être consultées par les autres visiteurs.

Il est recommandé de ne pas saisir de renseignements personnels ou confidentiels dans les réponses.

Pour une utilisation réelle, les contributions doivent être conservées et supprimées selon les règles définies pour l'activité.

## 8. Tests et vérifications

Les vérifications suivantes ont été réalisées :

* Démarrage des services avec Docker Compose.
* Vérification de la disponibilité de l'API.
* Soumission de réflexions avec les deux routines.
* Consultation des réflexions dans la galerie.
* Export du journal au format Markdown.
* Vérification du refus d'une réponse trop courte envoyée directement à l'API.
* Arrêt temporaire de l'API pour vérifier le comportement de l'interface en cas d'échec de l'envoi.
* Vérification que les réponses restent visibles dans le formulaire après cet échec.
* Vérification de l'affichage de l'avis de confidentialité.

**Test complémentaire recommandé :** demander à deux personnes qui ne connaissent pas le projet d'utiliser l'application sans explication préalable et noter leurs difficultés.

## 9. Questions de réflexion

* Pourquoi faut-il valider les réponses dans le navigateur et sur le serveur ?
* Pourquoi utiliser JSONB pour stocker les réponses de différentes routines ?
* Quelles données personnelles sont collectées et comment peut-on les minimiser ?
* Comment le README, le journal de bord et le journal de décisions contribuent-ils à documenter le projet ?

## 10. Pistes d'amélioration

* Ajouter une sauvegarde automatique des brouillons.
* Proposer une troisième routine de pensée.
* Ajouter une modération des contributions.
* Permettre la projection de la galerie en direct.
* Améliorer les fonctionnalités de filtrage et de recherche.
