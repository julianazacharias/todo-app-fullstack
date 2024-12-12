from http import HTTPStatus

from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from backend.database.models import Task
from backend.schemas.message import Message
from backend.schemas.task import TaskList, TaskPatch, TaskPublic, TaskSchema
from backend.utils.dependencies import (
    CurrentUser,
    FilterTaskPage,
    Session,
)
from backend.utils.sanitize import sanitize

router = APIRouter()

router = APIRouter(prefix='/tasks', tags=['tasks'])


@router.post('/', response_model=TaskPublic)
def create_task(
    task: TaskSchema,
    session: Session,
    current_user: CurrentUser,
):
    db_task = Task(
        title=sanitize(task.title),
        description=sanitize(task.description),
        done=task.done,
        priority=task.priority,
        user_id=current_user.id,
    )

    existing_task = (
        session.query(Task)
        .filter(Task.user_id == current_user.id, Task.title == task.title)
        .first()
    )

    if existing_task:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail='Task title already exists',
        )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.get('/', response_model=TaskList)
def list_tasks(
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


@router.get('/{task_id}', response_model=TaskPublic)
def read_task(
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

    return db_task


@router.patch('/{task_id}', response_model=TaskPublic)
def patch_task(
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
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found.'
        )

    for key, value in task.model_dump(exclude_unset=True).items():
        sanitized_value = value
        if key in {'title', 'description'}:
            sanitized_value = sanitize(value)

        setattr(db_task, key, sanitized_value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.patch('/done/{task_id}', response_model=TaskPublic)
def done_task(
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
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found.'
        )

    if db_task.done:
        db_task.done = False
    else:
        db_task.done = True

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.patch('/deactivate/{task_id}', response_model=TaskPublic)
def deactivate_task(task_id: int, session: Session, current_user: CurrentUser):
    db_task = session.scalar(
        select(Task).where(Task.user_id == current_user.id, Task.id == task_id)
    )

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found.'
        )

    db_task.is_active = False

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.patch('/activate/{task_id}', response_model=TaskPublic)
def activate_task(task_id: int, session: Session):
    db_task = session.scalar(select(Task).where(Task.id == task_id))

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found'
        )

    db_task.is_active = True

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.delete('/{task_id}', response_model=Message)
def delete_task(task_id: int, session: Session, current_user: CurrentUser):
    db_task = session.scalar(
        select(Task).where(Task.user_id == current_user.id, Task.id == task_id)
    )

    if not db_task:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail='Task not found.'
        )

    session.delete(db_task)
    session.commit()

    return {'message': 'Task has been deleted successfully.'}
