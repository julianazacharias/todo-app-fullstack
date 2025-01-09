from fastapi import APIRouter, Depends

from backend.auth.security import (
    create_access_token,
    get_current_user,
)
from backend.database.models import User
from backend.schemas.auth import LoginInfo, Token
from backend.services.auth import generate_access_token
from backend.utils.dependencies import OAuth2Form, Session

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/login', response_model=LoginInfo)
def login_for_access_token(form_data: OAuth2Form, session: Session):
    user = generate_access_token(form_data, session)
    return user


@router.post('/refresh_token', response_model=Token)
def refresh_access_token(
    user: User = Depends(get_current_user),
):
    new_access_token = create_access_token(data={'sub': user.email})

    return {'access_token': new_access_token, 'token_type': 'bearer'}
