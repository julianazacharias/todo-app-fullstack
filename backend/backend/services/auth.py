from sqlalchemy import select

from backend.auth.security import (
    create_access_token,
    verify_password,
)
from backend.database.models import User
from backend.utils.dependencies import OAuth2Form, Session
from backend.utils.exceptions import IncorrectLoginException


def generate_access_token(form_data: OAuth2Form, session: Session):
    user = session.scalar(
        select(User).where(User.email == form_data.username, User.is_active)
    )

    if not user:
        raise IncorrectLoginException
    if not verify_password(form_data.password, user.password):
        raise IncorrectLoginException

    access_token = create_access_token(data={'sub': user.email})

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'access_token': access_token,
    }
