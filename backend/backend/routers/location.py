from fastapi import APIRouter

from backend.schemas.location import (
    TaskLocationPublic,
    TaskLocationSchema,
    UserLocationPublic,
    UserLocationSchema,
)
from backend.schemas.message import Message
from backend.services.location import (
    create_task_location_service,
    create_user_location_service,
    delete_task_location_service,
    delete_user_location_service,
    read_task_location_service,
    read_user_location_service,
    update_task_location_service,
    update_user_location_service,
)
from backend.utils.dependencies import (
    CurrentUser,
    Session,
)

router = APIRouter()

router = APIRouter(prefix='/locations', tags=['locations'])


@router.post('/user', response_model=UserLocationPublic)
def create_user_location(
    location: UserLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    user_location = create_user_location_service(
        location, session, current_user
    )
    return user_location


@router.post('/task', response_model=TaskLocationPublic)
def create_task_location(
    task_id: int,
    location: TaskLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    task_location = create_task_location_service(
        location, session, current_user, task_id
    )
    return task_location


@router.put('/user/{user_id}', response_model=UserLocationPublic)
def update_user_location(
    location: UserLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    user_location = update_user_location_service(
        location, session, current_user
    )
    return user_location


@router.put('/task/{task_id}', response_model=TaskLocationPublic)
def update_task_location(
    task_id: int,
    location: TaskLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    task_location = update_task_location_service(
        task_id, location, session, current_user
    )
    return task_location


@router.get('/user/{user_id}', response_model=UserLocationPublic)
def read_user_location(
    session: Session,
    current_user: CurrentUser,
):
    user_location = read_user_location_service(session, current_user)
    return user_location


@router.get('/task/{task_id}', response_model=TaskLocationPublic)
def read_task_location(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
):
    task_location = read_task_location_service(task_id, session, current_user)
    return task_location


@router.delete('/user/{user_id}', response_model=Message)
def delete_user_location(session: Session, current_user: CurrentUser):
    user_location = delete_user_location_service(session, current_user)
    return user_location


@router.delete('/task/{task_id}', response_model=Message)
def delete_task_location(
    task_id: int, session: Session, current_user: CurrentUser
):
    task_location = delete_task_location_service(
        task_id, session, current_user
    )
    return task_location
