from sqlalchemy import select

from backend.database.models import Task
from backend.schemas.task import TaskPatch, TaskSchema
from backend.utils.dependencies import (
    CurrentUser,
    FilterTaskPage,
    Session,
)
from backend.utils.exceptions import TaskExistsException, TaskNotFoundException
from backend.utils.sanitize import sanitize


def create_task_service(
    task: TaskSchema,
    session: Session,
    current_user: CurrentUser,
):
    existing_task = (
        session.query(Task)
        .filter(Task.user_id == current_user.id, Task.title == task.title)
        .first()
    )

    if existing_task:
        raise TaskExistsException

    db_task = Task(
        title=sanitize(task.title),
        description=sanitize(task.description),
        done=task.done,
        priority=task.priority,
        user_id=current_user.id,
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def list_tasks_service(
    session: Session,
    current_user: CurrentUser,
    task_filter: FilterTaskPage,
):
    query = select(Task).where(Task.user_id == current_user.id, Task.is_active)

    if task_filter.priority:
        query = query.filter(Task.priority == task_filter.priority)

    if task_filter.done is not None:
        query = query.filter(Task.done == task_filter.done)

    tasks = session.scalars(
        query.offset(task_filter.offset).limit(task_filter.limit)
    ).all()

    return {'tasks': tasks}


def read_task_service(
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

    return db_task


def patch_task_service(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
    task: TaskPatch,
):
    db_task = session.scalar(
        select(Task).where(
            Task.user_id == current_user.id, Task.id == task_id, Task.is_active
        )
    )

    if not db_task:
        raise TaskNotFoundException

    for key, value in task.model_dump(exclude_unset=True).items():
        sanitized_value = value
        if key in {'title', 'description'}:
            sanitized_value = sanitize(value)

        setattr(db_task, key, sanitized_value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def done_task_service(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
):
    db_task = session.scalar(
        select(Task).where(
            Task.user_id == current_user.id, Task.id == task_id, Task.is_active
        )
    )

    if not db_task:
        raise TaskNotFoundException

    if db_task.done:
        db_task.done = False
    else:
        db_task.done = True

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def deactivate_task_service(
    task_id: int, session: Session, current_user: CurrentUser
):
    db_task = session.scalar(
        select(Task).where(Task.user_id == current_user.id, Task.id == task_id)
    )

    if not db_task:
        raise TaskNotFoundException

    db_task.is_active = False

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def activate_task_service(task_id: int, session: Session):
    db_task = session.scalar(select(Task).where(Task.id == task_id))

    if not db_task:
        raise TaskNotFoundException

    db_task.is_active = True

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


def delete_task_service(
    task_id: int, session: Session, current_user: CurrentUser
):
    db_task = session.scalar(
        select(Task).where(Task.user_id == current_user.id, Task.id == task_id)
    )

    if not db_task:
        raise TaskNotFoundException

    session.delete(db_task)
    session.commit()

    return {'message': 'Task has been deleted successfully.'}
