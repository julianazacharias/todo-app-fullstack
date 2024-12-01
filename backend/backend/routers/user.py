from http import HTTPStatus

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from backend.auth.security import (
    get_password_hash,
)
from backend.database.models import User
from backend.schemas.message import Message
from backend.schemas.user import (
    UserList,
    UserPatch,
    UserPublic,
    UserSchema,
)
from backend.utils.dependencies import CurrentUser, Filter, Session
from backend.utils.sanitize import sanitize_email, sanitize_username

router = APIRouter(prefix='/users', tags=['users'])


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(user: UserSchema, session: Session):
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
        email=sanitize_email(user.email),
        username=sanitize_username(user.username),
        password=hashed_password,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.get('/', response_model=UserList)
def list_users(session: Session, filter: Filter):
    query = (
        select(User)
        .offset(filter.offset)
        .limit(filter.limit)
        .where(User.is_active)
    )

    users = session.scalars(query).all()

    return {'users': users}


@router.get('/{user_id}', response_model=UserPublic)
def read_user(user_id: int, session: Session):
    db_user = session.scalar(
        select(User).where(User.id == user_id, User.is_active)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='user not found'
        )

    return db_user


@router.put('/{user_id}', response_model=UserPublic)
def update_user(
    user_id: int,
    user: UserSchema,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    current_user.email = sanitize_email(user.email)
    current_user.username = sanitize_username(user.username)
    current_user.password = get_password_hash(user.password)

    session.commit()
    session.refresh(current_user)

    return current_user


@router.patch('/{user_id}', response_model=UserPublic)
def patch_user(
    user_id: int,
    user: UserPatch,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)

    session.commit()
    session.refresh(current_user)

    return current_user


@router.patch('/{user_id}/deactivate', response_model=UserPublic)
def deactivate_user(
    user_id: int,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    current_user.is_active = False

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return current_user


@router.patch('/{user_id}/activate', response_model=UserPublic)
def activate_user(user_id: int, session: Session):
    db_user = session.scalar(select(User).where(User.id == user_id))

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='user not found'
        )

    db_user.is_active = True

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


@router.delete('/{user_id}', response_model=Message)
def delete_user(
    user_id: int,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
        )

    session.delete(current_user)
    session.commit()

    return {'message': 'User deleted'}
