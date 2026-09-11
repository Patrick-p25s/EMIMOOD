# Plateforme de Partage de Documents Universitaires (EMIMOOD)

Application permettant aux etudiants d'une universite de partager, organiser et retrouver facilement des documents de cours (cours, TD, examens, corriges), avec un systeme de moderation par classe et des annonces ciblees.

## Fonctionnalites

### Etudiant

- Acces a tous les documents publics de sa classe, organises par matiere
- Upload de ses propres documents : prives (usage perso) ou proposes a la validation publique
- Sauvegarde de documents publics dans son propre espace, avec favoris
- Consultation des annonces de sa classe et des annonces globales

### Moderateur

- Gere une seule classe (assignee par un administrateur)
- Valide ou rejette les documents proposes par les etudiants de sa classe, avec motif de rejet
- Upload directement des documents publics (cours, corrections)
- Redige des annonces visibles par sa classe
- Gere les etudiants de sa classe

### Administrateur

- Acces total a toutes les classes et tous les utilisateurs
- Cree les classes, les annees universitaires, et assigne les moderateurs
- Redige des annonces globales, visibles par toute l'application
- Supervise et modere sur n'importe quelle classe, memes droits que le moderateur sans restriction de perimetre

## Stack technique

### Backend

- FastAPI (async) avec SQLAlchemy (AsyncSession)
- Architecture modulaire par domaine : repository, service, schema, router
- PostgreSQL, via les types Uuid et Enum natifs de SQLAlchemy
- Stockage des fichiers en local (uploads), migration cloud prevue plus tard

### Frontend

- React avec shadcn/ui (Tailwind)
- Authentification via localStorage en v1, migration prevue vers cookies httpOnly
- Application mobile envisagee apres stabilisation du backend web

## Modele de donnees (apercu)

```
YearUniv (annee universitaire)
  Classe (mention, niveau, code_invitation)
    Subject / Matiere (nom, coefficient, semestre)
      Document (titre, statut, type_document)
    Users (etudiants, classe assignee)
    Annonce (globale si classe_id est nul)

Document
  owner : Users, qui a uploade le document
  validated_by : Users, qui a valide ou rejete le document
  DocumentSauvegarde : user, favori, masque

Annonce
  AnnonceLecture : suivi de lecture par utilisateur
```

Statuts de document : prive, en_attente, public, rejete (avec motif_rejet si rejete)

## Structure du projet

```
EMIMOOD/
  .gitignore
  README.md

  backend/
    .venv/
    .env
    alembic.ini
    alembic/
      versions/
      env.py
    uploads/

    app/
      main.py

      core/
        base_model.py
        bootstrap_db.py
        config.py
        database.py
        dependencies.py
        limiter.py
        logging.py
        normalised_id.py
        pagination.py
        security.py

      modules/
        auth/
          router.py
          schema.py
          service.py

        users/
          model.py
          repository.py
          schema.py
          service.py
          router.py

        years/
          model.py
          repository.py
          schema.py
          service.py
          router.py

        classes/
          model.py
          repository.py
          schema.py
          service.py
          router.py

        matiere/
          model.py
          repository.py
          schema.py
          service.py
          router.py

        documents/
          model.py
          repository.py
          schema.py
          service.py
          router.py

        folder/
          model.py
          repository.py
          schema.py
          service.py
          router.py

        annonce/
          model.py
          repository.py
          schema.py
          service.py
          router.py

  frontend/
    .env
    index.html
    vite.config.js

    src/
      main.jsx
      App.jsx
      App.css

      api/
        client.js
        auth.js
        documents.js
        annonces.js
        classes.js

      assets/

      components/
        ui/
        form/
        moderator/
        admin/

      context/
        AuthContext.jsx

      hooks/
        useAuth.js
        useClasse.js
        useMatiere.js
        useDocument.js

      layout/
        ModeratorLayout.jsx
        AdminLayout.jsx
        UserLayout.jsx

      lib/
        utils.js

      mocks/

      page/
        LandingPage.jsx
        LoginPage.jsx
        admin/
          Dashboard.jsx
        connected/
        moderator/
          Dashboard.jsx

      route/
        AppRoutes.jsx
```

## Installation

### Backend

```
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env

alembic upgrade head

uvicorn app.main:app --reload
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Roles et permissions

| Action                              | Etudiant | Moderateur     | Admin                  |
| ----------------------------------- | -------- | -------------- | ---------------------- |
| Voir documents publics de sa classe | Oui      | Oui            | Oui, toutes classes    |
| Uploader un document prive          | Oui      | Oui            | Oui                    |
| Proposer un document en validation  | Oui      | Non            | Non                    |
| Valider ou rejeter un document      | Non      | Oui, sa classe | Oui, toutes classes    |
| Ecrire une annonce                  | Non      | Oui, sa classe | Oui, globale ou ciblee |
| Creer une classe                    | Non      | Non            | Oui                    |
| Assigner un moderateur              | Non      | Non            | Oui                    |

## Roadmap

- Finaliser le module documents : upload, validation, sauvegarde
- Systeme d'annonces avec suivi de lecture
- Authentification par cookies httpOnly, en remplacement de localStorage
- Telechargement de documents pour acces hors ligne
- Application mobile en React Native
- Migration du stockage des fichiers vers le cloud

## Licence

A definir.
