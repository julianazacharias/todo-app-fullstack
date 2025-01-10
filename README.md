# Todo Application - Fullstack

A full-stack Todo application that allows users to create tasks with a location. The backend is built with FastAPI and the frontend is built with React. This application enables users to add, update, and retrieve tasks along with their location information.

## Project Structure

The project consists of two main folders:

- `frontend`: Contains the React application for the frontend.
- `backend`: Contains the FastAPI application for the backend.

## Technologies used

### Backend

- [Python](https://www.python.org/) for the backend programming language.
- [FastAPI](https://fastapi.tiangolo.com/) for building the REST API.
- [SQLAlchemy](https://www.sqlalchemy.org/) for ORM (Object Relational Mapping).
- [GeoAlchemy](https://geoalchemy-2.readthedocs.io/) for geodata management.
- [JWT](https://jwt.io/) for user authentication.
- [Pydantic](https://pydantic-docs.helpmanual.io/) for data validation.
- [Alembic](https://alembic.sqlalchemy.org/en/latest/) for database migrations.
- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](https://postgis.net/) extension for geospatial data management.
- [Poetry](https://python-poetry.org/) for dependency management.
- [Docker](https://www.docker.com/) for containerization.
- [Docker Compose](https://python-poetry.org/) for dependency management.

### Frontend

- [TypeScript](https://www.typescriptlang.org/) for type safety.
- [React](https://reactjs.org/) for building the user interface.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Vite](https://vitejs.dev/) for fast development server.
- [Leaflet](https://leafletjs.com/) for displaying maps with location data.
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles.

---

## How to Run the Project

Check README files on backend and frontend directories

### Prerequisites

Ensure you have the following tools installed:

- [Python 3.12](https://www.python.org/) for the backend.
- [Poetry](https://www.python.org/) for the backend.
- [Docker](https://www.docker.com/) for containerized setup.
- [Docker Compose](https://docs.docker.com/compose/install/) for container management.
- [Node.js](https://nodejs.org/) for the frontend.

---

### Backend

1. **Install Dependencies**

   If you're using Poetry, navigate to the backend folder and run:

   ```bash
   poetry install
   ```
