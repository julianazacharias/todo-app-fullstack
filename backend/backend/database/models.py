from datetime import datetime
from typing import Optional

from geoalchemy2 import Geometry
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, registry, relationship

from .enums import TaskPriority

table_registry = registry()


@table_registry.mapped_as_dataclass
class User:
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    is_active: Mapped[bool] = mapped_column(init=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )
    update_at: Mapped[Optional[datetime]] = mapped_column(
        init=False, onupdate=func.now()
    )
    tasks: Mapped[list['Task']] = relationship(
        init=False, back_populates='user', cascade='all, delete-orphan'
    )
    location: Mapped[Optional['Location']] = relationship(
        init=False,
        back_populates='user',
        uselist=False,
        cascade='all, delete-orphan',
    )


@table_registry.mapped_as_dataclass
class Task:
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    title: Mapped[str]
    description: Mapped[str]
    done: Mapped[bool] = mapped_column(default=False)
    priority: Mapped[TaskPriority] = mapped_column(default=TaskPriority.medium)
    is_active: Mapped[bool] = mapped_column(init=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )
    update_at: Mapped[Optional[datetime]] = mapped_column(
        init=False, onupdate=func.now()
    )
    user: Mapped['User'] = relationship(init=False, back_populates='tasks')
    location: Mapped[Optional['Location']] = relationship(
        init=False,
        back_populates='task',
        uselist=False,
        cascade='all, delete-orphan',
    )


@table_registry.mapped_as_dataclass
class Location:
    __tablename__ = 'locations'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey('users.id'))
    task_id: Mapped[Optional[int]] = mapped_column(ForeignKey('tasks.id'))
    place_id: Mapped[str]
    display_name: Mapped[str]
    name: Mapped[str]
    lat: Mapped[float]
    lon: Mapped[float]
    geom: Mapped[Geometry] = mapped_column(
        Geometry(geometry_type='POINT', srid=4326, spatial_index=True)
    )
    created_at: Mapped[datetime] = mapped_column(
        init=False, server_default=func.now()
    )
    update_at: Mapped[Optional[datetime]] = mapped_column(
        init=False, onupdate=func.now()
    )
    user: Mapped[Optional['User']] = relationship(
        init=False, back_populates='location'
    )
    task: Mapped[Optional['Task']] = relationship(
        init=False, back_populates='location'
    )
