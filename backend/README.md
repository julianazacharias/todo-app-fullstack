# Todo Application - Backend

A REST API built with FastAPI Sync to create tasks with location.
This API allows users to perform operations such as adding, updating, and retrieving tasks and its locations.

## Technologies used:

<div>
    <a><img src="https://img.shields.io/badge/Python-3776AB.svg?style=for-the-badge&logo=Python&logoColor=white" target="_blank">
    <a><img src="https://img.shields.io/badge/Poetry-60A5FA.svg?style=for-the-badge&logo=Poetry&logoColor=white" target="_blank">
    <a><img src="https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=FastAPI&logoColor=white" target="_blank">
    <a><img src="https://img.shields.io/badge/Pydantic-E92063.svg?style=for-the-badge&logo=Pydantic&logoColor=white" target="_blank">
    <a><img src="https://img.shields.io/badge/SQLAlchemy-D71F00.svg?style=for-the-badge&logo=SQLAlchemy&logoColor=white" target="_blank">
    <a><img src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white" target="_blank">        
    <a><img src="https://img.shields.io/badge/JSON%20Web%20Tokens-000000.svg?style=for-the-badge&logo=JSON-Web-Tokens&logoColor=white" target="_blank">
    <a><img src="https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white" target="_blank">
</div>
   <br/>

## How to run the project

### Requirements

- [Python](https://www.python.org/) ^3.12

### With poetry

1. Install the dependencies:

```bash
poetry install
```

2. Activate the virtual environment:

```bash
poetry shell
```

3. Run the application:

```bash
task run
```

4. Run the tests:

```bash
task test
```

### With Docker

1. Build the image:

```bash
docker-compose build
```

2. Run the application:

```bash
docker-compose up
```

2. Stop the application:

```bash
docker-compose down
```

### .ENV file:

Insert your API KEY value on **.env** file:

- DATABASE_URL=""
- SECRET_KEY=""
- ALGORITHM=""
- ACCESS_TOKEN_EXPIRE_MINUTES=30

## Link to websites useds in this project

- [Python](https://www.python.org/) for the backend programming language.
- [FastAPI](https://fastapi.tiangolo.com/) for building the REST API.
- [SQLAlchemy](https://www.sqlalchemy.org/) for ORM (Object Relational Mapping).
- [GeoAlchemy](https://geoalchemy-2.readthedocs.io/) for geodata management.
- [JWT](https://jwt.io/) for user authentication.
- [Pydantic](https://pydantic-docs.helpmanual.io/) for data validation.
- [Alembic](https://alembic.sqlalchemy.org/en/latest/) for database migrations.
- [PostgreSQL](https://www.postgresql.org/) with [PostGIS](https://postgis.net/) extension for geospatial data management.
- [Poetry](https://python-poetry.org/) for dependency management.
- [Docker](https://www.docker.com/) for containerized setup.
- [Docker Compose](https://docs.docker.com/compose/) for container management.
