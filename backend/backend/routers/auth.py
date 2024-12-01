from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select

from backend.auth.security import (
    create_access_token,
    get_current_user,
    get_password_hash,
    verify_password,
)
from backend.database.models import User
from backend.schemas.auth import LoginInfo, Token
from backend.schemas.user import UserSchema
from backend.utils.dependencies import OAuth2Form, Session

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/register_and_login', response_model=LoginInfo)
def register_and_login(user: UserSchema, session: Session):
    db_user = session.scalar(
        select(User).where(
            (User.username == user.username) | (User.email == user.email)
        )
    )

    if db_user:
        if db_user.username == user.username:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail='Username already exists',
            )
        elif db_user.email == user.email:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail='Email already exists',
            )

    hashed_password = get_password_hash(user.password)

    db_user = User(
        email=user.email,
        username=user.username,
        password=hashed_password,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    form_data = OAuth2PasswordRequestForm(
        username=user.email, password=user.password
    )

    user_from_db = session.scalar(
        select(User).where(User.email == form_data.username, User.is_active)
    )

    access_token = create_access_token(data={'sub': user_from_db.email})

    return {
        'username': user_from_db.username,
        'email': user_from_db.email,
        'access_token': access_token,
    }


@router.post('/login', response_model=LoginInfo)
def login_for_access_token(form_data: OAuth2Form, session: Session):
    user = session.scalar(
        select(User).where(User.email == form_data.username, User.is_active)
    )

    if not user:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Incorrect email or password',
        )

    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Incorrect email or password',
        )

    access_token = create_access_token(data={'sub': user.email})

    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'access_token': access_token,
    }


@router.post('/refresh_token', response_model=Token)
def refresh_access_token(
    user: User = Depends(get_current_user),
):
    new_access_token = create_access_token(data={'sub': user.email})

    return {'access_token': new_access_token, 'token_type': 'bearer'}
