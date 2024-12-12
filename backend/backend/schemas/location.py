from geoalchemy2.shape import to_shape
from pydantic import BaseModel, ConfigDict, field_serializer
from shapely.geometry import mapping


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
    task_id: int


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

    @field_serializer('geom')
    def serialize_geom(self, geom):
        if geom:
            shape = to_shape(geom)  # Convert to a Shapely geometry
            return mapping(shape)  # Change to `mapping(shape)` for GeoJSON
        return None


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

    @field_serializer('geom')
    def serialize_geom(self, geom):
        if geom:
            shape = to_shape(geom)  # Convert to a Shapely geometry
            return mapping(shape)  # Change to `mapping(shape)` for GeoJSON
        return None


class LocationList(BaseModel):
    locations: list[TaskLocationPublic]
