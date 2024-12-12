from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config.settings import Settings
from backend.routers import auth, location, task, user

settings = Settings()

app = FastAPI()

origins = [settings.FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=[
        '*'
    ],  # ["Origin", "Content-Type", "Accept", "Authorization"]
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(task.router)
app.include_router(location.router)


@app.get('/')
def read_root():
    return {'message': 'Hello World!'}
