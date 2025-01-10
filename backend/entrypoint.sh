#!/bin/sh

# Executa as migrações do banco de dados
poetry run alembic upgrade head

# Inicia a aplicação
poetry run fastapi run backend/app.py --host 0.0.0.0