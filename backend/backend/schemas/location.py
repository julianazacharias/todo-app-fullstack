from pydantic import BaseModel, ConfigDict


class UserLocationSchema(BaseModel):
    place_id: int
    display_name: str
    name: str
    lat: float
    lon: float
    user_id: int


class TaskLocationSchema(BaseModel):
    place_id: int
    display_name: str
    name: str
    lat: float
    lon: float


class UserLocationPublic(BaseModel):
    id: int
    place_id: int
    display_name: str
    name: str
    lat: float
    lon: float
    geom: dict
    user_id: int
    model_config = ConfigDict(from_attributes=True)


class TaskLocationPublic(BaseModel):
    id: int
    place_id: int
    display_name: str
    name: str
    lat: float
    lon: float
    geom: dict
    task_id: int
    model_config = ConfigDict(from_attributes=True)


class LocationList(BaseModel):
    locations: list[TaskLocationPublic]
