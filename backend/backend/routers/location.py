from http import HTTPStatus

from fastapi import APIRouter, HTTPException
from sqlalchemy import select
from sqlalchemy.sql import func

from backend.database.models import Location, Task, User
from backend.schemas.location import (
    TaskLocationPublic,
    TaskLocationSchema,
    UserLocationPublic,
    UserLocationSchema,
)
from backend.schemas.message import Message
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
    # Verify if the user exists and is active
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    # Create the location instance
    db_location = Location(
        place_id=location.place_id,
        display_name=location.display_name,
        name=location.name,
        lat=location.lat,
        lon=location.lon,
        geom=func.ST_SetSRID(
            func.ST_MakePoint(location.lon, location.lat), 4326
        ),  # Set the geom field
        user_id=current_user.id,
        task_id=None,
    )

    session.add(db_location)
    session.commit()
    session.refresh(db_location)

    return db_location


@router.post('/task', response_model=TaskLocationPublic)
def create_task_location(
    location: TaskLocationSchema,
    session: Session,
    current_user: CurrentUser,
    task_id: int,
):
    db_task = session.scalar(
        select(Task).where(
            Task.id == task_id, Task.user_id == current_user.id, Task.is_active
        )
    )

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found'
        )

    db_location = Location(
        place_id=location.place_id,
        display_name=location.display_name,
        name=location.name,
        lat=location.lat,
        lon=location.lon,
        geom=func.ST_SetSRID(
            func.ST_MakePoint(location.lon, location.lat), 4326
        ),
        task_id=task_id,
    )

    session.add(db_location)
    session.commit()
    session.refresh(db_location)

    return db_location


@router.put('/user/{user_id}', response_model=UserLocationPublic)
def update_user_location(
    location: UserLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    db_location = session.scalar(
        select(Location).where(Location.user_id == current_user.id)
    )

    if not db_location:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Could not find this user location',
        )

    db_location.place_id = ((location.place_id),)
    db_location.display_name = ((location.display_name),)
    db_location.name = ((location.name),)
    db_location.lat = ((location.lat),)
    db_location.lon = ((location.lon),)
    db_location.geom = (
        func.ST_SetSRID(func.ST_MakePoint(location.lon, location.lat), 4326),
    )
    db_location.user_id = current_user.id

    session.commit()
    session.refresh(db_location)

    return db_location


@router.put('/task/{task_id}', response_model=TaskLocationPublic)
def update_task_location(
    task_id: int,
    location: TaskLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    db_task = session.scalar(
        select(Task).where(
            Task.id == task_id, Task.user_id == current_user.id, Task.is_active
        )
    )

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='task not found'
        )

    db_location = session.scalar(
        select(Location).where(Location.task_id == task_id)
    )

    if not db_location:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Task does not have a location yet',
        )

    db_location.place_id = location.place_id
    db_location.display_name = location.display_name
    db_location.name = location.name
    db_location.lat = location.lat
    db_location.lon = location.lon
    db_location.geom = (
        func.ST_SetSRID(func.ST_MakePoint(location.lon, location.lat), 4326),
    )
    db_location.task_id = location.task_id

    session.commit()
    session.refresh(db_location)

    return db_location


@router.get('/user/{user_id}', response_model=UserLocationPublic)
def read_user_location(
    session: Session,
    current_user: CurrentUser,
):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    db_location = session.scalar(
        select(Location).where(Location.user_id == current_user.id)
    )

    if not db_location:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Could not find this user location',
        )


@router.get('/task/{task_id}', response_model=TaskLocationPublic)
def read_task_location(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
):
    db_task = session.scalar(
        select(Task).where(
            Task.id == task_id, Task.user_id == current_user.id, Task.is_active
        )
    )

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found'
        )

    db_location = session.scalar(
        select(Location).where(Location.task_id == task_id)
    )

    if not db_location:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail='Task does not have a location yet',
        )

    return db_location


@router.delete('/user/{user_id}', response_model=Message)
def delete_user_location(session: Session, current_user: CurrentUser):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='User not found'
        )

    db_location = session.scalar(
        select(Location).where(
            Location.user_id == current_user.id,
        )
    )

    session.delete(db_location)
    session.commit()

    return {
        'message': 'The location of this user has been successfully deleted.'
    }


@router.delete('/task/{task_id}', response_model=Message)
def delete_task_location(
    task_id: int, session: Session, current_user: CurrentUser
):
    db_task = session.scalar(
        select(Task).where(Task.user_id == current_user.id, Task.id == task_id)
    )

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found.'
        )

    db_location = session.scalar(
        select(Location).where(Location.task_id == task_id)
    )

    session.delete(db_location)
    session.commit()

    return {
        'message': 'The location of this task has been successfully deleted.'
    }
