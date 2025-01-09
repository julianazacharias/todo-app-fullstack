from fastapi import APIRouter

from backend.schemas.message import Message
from backend.schemas.task import TaskList, TaskPatch, TaskPublic, TaskSchema
from backend.services.task import (
    activate_task_service,
    create_task_service,
    deactivate_task_service,
    delete_task_service,
    done_task_service,
    list_tasks_service,
    patch_task_service,
    read_task_service,
)
from backend.utils.dependencies import (
    CurrentUser,
    FilterTaskPage,
    Session,
)

router = APIRouter()

router = APIRouter(prefix='/tasks', tags=['tasks'])


@router.post('/', response_model=TaskPublic)
def create_task(
    task: TaskSchema,
    session: Session,
    current_user: CurrentUser,
):
    task = create_task_service(task, session, current_user)
    return task


@router.get('/', response_model=TaskList)
def list_tasks(
    session: Session,
    current_user: CurrentUser,
    task_filter: FilterTaskPage,
):
    list = list_tasks_service(session, current_user, task_filter)

    return list


@router.get('/{task_id}', response_model=TaskPublic)
def read_task(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
):
    task = read_task_service(task_id, session, current_user)
    return task


@router.patch('/{task_id}', response_model=TaskPublic)
def patch_task(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
    task: TaskPatch,
):
    task = patch_task_service(task_id, session, current_user, task)
    return task


@router.patch('/done/{task_id}', response_model=TaskPublic)
def done_task(
    task_id: int,
    session: Session,
    current_user: CurrentUser,
):
    task = done_task_service(task_id, session, current_user)
    return task


@router.patch('/deactivate/{task_id}', response_model=TaskPublic)
def deactivate_task(task_id: int, session: Session, current_user: CurrentUser):
    task = deactivate_task_service(task_id, session, current_user)
    return task


@router.patch('/activate/{task_id}', response_model=TaskPublic)
def activate_task(task_id: int, session: Session):
    task = activate_task_service(task_id, session)
    return task


@router.delete('/{task_id}', response_model=Message)
def delete_task(task_id: int, session: Session, current_user: CurrentUser):
    task = delete_task_service(task_id, session, current_user)
    return task
