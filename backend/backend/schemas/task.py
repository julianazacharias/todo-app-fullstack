from pydantic import BaseModel, ConfigDict

from backend.database.enums import TaskPriority
from backend.schemas.filters import FilterPage


class TaskSchema(BaseModel):
    title: str
    description: str
    done: bool
    priority: TaskPriority
    user_id: int


class TaskPublic(BaseModel):
    id: int
    title: str
    description: str
    done: bool
    priority: TaskPriority
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class TaskPatch(BaseModel):
    title: str | None = None
    description: str | None = None
    done: bool | None = None
    priority: TaskPriority | None = None


class TaskList(BaseModel):
    tasks: list[TaskPublic]


class FilterTask(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: TaskPriority | None = None
    done: bool | None = None


class FilterTaskPagination(FilterPage):
    priority: TaskPriority | None = None
    done: bool | None = None
