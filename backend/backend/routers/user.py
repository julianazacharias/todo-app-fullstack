from http import HTTPStatus

from fastapi import APIRouter

from backend.schemas.message import Message
from backend.schemas.user import (
    UserList,
    UserPatch,
    UserPublic,
    UserSchema,
)
from backend.services.user import (
    activate_user_service,
    create_user_service,
    deactivate_user_service,
    delete_user_service,
    list_users_service,
    patch_user_service,
    read_user_service,
    update_user_service,
)
from backend.utils.dependencies import CurrentUser, Filter, Session

router = APIRouter(prefix='/users', tags=['users'])


@router.post('/', status_code=HTTPStatus.CREATED, response_model=UserPublic)
def create_user(user: UserSchema, session: Session):
    user = create_user_service(user, session)
    return user


@router.get('/', response_model=UserList)
def list_users(session: Session, filter: Filter):
    list = list_users_service(session, filter)
    return list


@router.get('/{user_id}', response_model=UserPublic)
def read_user(user_id: int, session: Session):
    user = read_user_service(user_id, session)
    return user


@router.put('/{user_id}', response_model=UserPublic)
def update_user(
    user_id: int,
    user: UserSchema,
    session: Session,
    current_user: CurrentUser,
):
    user = update_user_service(user_id, user, session, current_user)

    return user


@router.patch('/{user_id}', response_model=UserPublic)
def patch_user(
    user_id: int,
    user: UserPatch,
    session: Session,
    current_user: CurrentUser,
):
    user = patch_user_service(user_id, user, session, current_user)

    return user


@router.patch('/deactivate/{user_id}', response_model=UserPublic)
def deactivate_user(
    user_id: int,
    session: Session,
    current_user: CurrentUser,
):
    user = deactivate_user_service(user_id, session, current_user)

    return user


@router.patch('/activate/{user_id}', response_model=UserPublic)
def activate_user(user_id: int, session: Session):
    user = activate_user_service(user_id, session)
    return user


@router.delete('/{user_id}', response_model=Message)
def delete_user(
    user_id: int,
    session: Session,
    current_user: CurrentUser,
):
    user = delete_user_service(user_id, session, current_user)
    return user
