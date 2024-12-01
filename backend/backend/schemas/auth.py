from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class LoginInfo(BaseModel):
    id: int
    username: str
    email: str
    access_token: str
