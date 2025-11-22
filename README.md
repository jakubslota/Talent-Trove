# Talent Trove

Full-stack web application built with **React (TypeScript)** and **Django REST Framework**, designed to connect IT specialists (workers) with recruiters.  

The project implements separate views and flows for guests, workers and recruiters, including registration, login, browsing candidate profiles and managing invitations.

---

## Features

### User roles

- **Guest**
  - Public landing page
  - Basic information about the platform
  - Access to selected views (e.g. list of workers) in read-only mode

- **Worker**
  - Registration and login
  - Creating and editing a personal profile (basic data, city, specialization)
  - Adding programming languages and skills
  - Viewing and managing invitations from recruiters
  - Managing own visibility and profile details

- **Recruiter**
  - Registration and login
  - Browsing the list of workers
  - Filtering workers by city, specialization and programming languages
  - Marking workers as favourites
  - Sending invitations to workers and managing their status

---

## Tech stack

**Frontend**

- React (TypeScript)
- React Router
- Functional components and hooks
- Context for navigation and API refresh handling

**Backend**

- Python / Django
- Django REST Framework
- Custom apps:
  - `siteAuth` – authentication and user management
  - `talentTrove` – domain logic (workers, recruiters, invitations, visits, etc.)
- JSON seed files for initial data:
  - cities, programming languages, specializations, users, workers, visits

**Other**

- REST API communication between frontend and backend
- Class diagram available as `Class.png` in the repository root

---

## Architecture

The project is split into two separate parts: `backend/` (Django) and `frontend/` (React).

```text
Talent-Trove/
  backend/
    backend/              # Django project settings, URLs, WSGI/ASGI
    siteAuth/             # Authentication, serializers, views, URLs
    talentTrove/          # Core domain models and logic
    seeds/                # JSON files with initial data
    templates/docs.html   # Simple API documentation page
    manage.py
    requirements.txt

  frontend/
    src/
      components/
        Guest/            # Public views (home, employee grid, info)
        Recruiter/        # Recruiter dashboard and lists
        Worker/           # Worker dashboard and profile management
        Register/         # Registration flows
        Shared/           # Navbar, footer, layout, helpers
      context/            # Navigation & API refresh helpers
      models/             # TypeScript models (Worker, Recruiter)
      App.tsx
      index.tsx
    package.json
    tsconfig.json

  .gitignore
  Class.png               # Class diagram
