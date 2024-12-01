from pydantic import BaseModel


class FilterPage(BaseModel):
    offset: int = 0
    limit: int = 100
