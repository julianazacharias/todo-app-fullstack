import json

from sqlalchemy import select
from sqlalchemy.sql import func

from backend.database.models import Location, Task, User
from backend.schemas.location import (
    TaskLocationSchema,
    UserLocationSchema,
)
from backend.utils.dependencies import (
    CurrentUser,
    Session,
)
from backend.utils.exceptions import (
    TaskLocationExistsException,
    TaskLocationNotFoundException,
    TaskNotFoundException,
    UserLocationExistsException,
    UserLocationNotFoundException,
    UserNotFoundException,
)


def create_user_location_service(
    location: UserLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )
    if not db_user:
        raise UserNotFoundException

    existing_location = session.scalar(
        select(Location).where(Location.user_id == current_user.id)
    )

    if existing_location:
        raise UserLocationExistsException

    db_location = Location(
        place_id=location.place_id,
        display_name=location.display_name,
        name=location.name,
        lat=location.lat,
        lon=location.lon,
        geom=func.ST_SetSRID(
            func.ST_MakePoint(location.lon, location.lat), 4326
        ),
        user_id=current_user.id,
        task_id=None,
    )
    session.add(db_location)
    session.commit()
    session.refresh(db_location)

    return {
        **db_location.__dict__,
        'geom': json.loads(
            session.scalar(func.ST_AsGeoJSON(db_location.geom))
        ),
    }


def create_task_location_service(
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
        raise TaskNotFoundException

    existing_location = (
        session.query(Location).filter(Location.task_id == db_task.id).first()
    )

    if existing_location:
        raise TaskLocationExistsException

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
        user_id=None,
    )

    session.add(db_location)
    session.commit()
    session.refresh(db_location)

    return {
        **db_location.__dict__,
        'geom': json.loads(
            session.scalar(func.ST_AsGeoJSON(db_location.geom))
        ),
    }


def update_user_location_service(
    location: UserLocationSchema,
    session: Session,
    current_user: CurrentUser,
):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise UserNotFoundException

    db_location = session.scalar(
        select(Location).where(Location.user_id == current_user.id)
    )

    if not db_location:
        raise UserLocationNotFoundException

    db_location.place_id = location.place_id
    db_location.display_name = location.display_name
    db_location.name = location.name
    db_location.lat = location.lat
    db_location.lon = location.lon
    db_location.geom = func.ST_SetSRID(
        func.ST_MakePoint(location.lon, location.lat), 4326
    )
    db_location.user_id = current_user.id
    db_location.task_id = None

    session.commit()
    session.refresh(db_location)

    return {
        **db_location.__dict__,
        'geom': json.loads(
            session.scalar(func.ST_AsGeoJSON(db_location.geom))
        ),
    }


def update_task_location_service(
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
        raise TaskNotFoundException

    db_location = session.scalar(
        select(Location).where(Location.task_id == task_id)
    )

    if not db_location:
        raise TaskLocationNotFoundException

    db_location.place_id = location.place_id
    db_location.display_name = location.display_name
    db_location.name = location.name
    db_location.lat = location.lat
    db_location.lon = location.lon
    db_location.geom = func.ST_SetSRID(
        func.ST_MakePoint(location.lon, location.lat), 4326
    )
    db_location.task_id = task_id
    db_location.user_id = None

    session.commit()
    session.refresh(db_location)

    return {
        **db_location.__dict__,
        'geom': json.loads(
            session.scalar(func.ST_AsGeoJSON(db_location.geom))
        ),
    }


def read_user_location_service(
    session: Session,
    current_user: CurrentUser,
):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise UserNotFoundException

    db_location = session.scalar(
        select(Location).where(Location.user_id == current_user.id)
    )

    if not db_location:
        raise UserLocationNotFoundException
    return {
        **db_location.__dict__,
        'geom': json.loads(
            session.scalar(func.ST_AsGeoJSON(db_location.geom))
        ),
    }


def read_task_location_service(
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
        raise TaskNotFoundException

    db_location = session.scalar(
        select(Location).where(Location.task_id == task_id)
    )

    if not db_location:
        raise TaskLocationNotFoundException

    return {
        **db_location.__dict__,
        'geom': json.loads(
            session.scalar(func.ST_AsGeoJSON(db_location.geom))
        ),
    }


def delete_user_location_service(session: Session, current_user: CurrentUser):
    db_user = session.scalar(
        select(User).where(User.id == current_user.id, User.is_active)
    )

    if not db_user:
        raise UserNotFoundException

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


def delete_task_location_service(
    task_id: int, session: Session, current_user: CurrentUser
):
    db_task = session.scalar(
        select(Task).where(Task.user_id == current_user.id, Task.id == task_id)
    )

    if not db_task:
        raise TaskNotFoundException

    db_location = session.scalar(
        select(Location).where(Location.task_id == task_id)
    )

    session.delete(db_location)
    session.commit()

    return {
        'message': 'The location of this task has been successfully deleted.'
    }
