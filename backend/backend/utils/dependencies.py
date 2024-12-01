from typing import Annotated

from fastapi import Depends, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from backend.auth.security import get_current_user
from backend.database.database import get_session
from backend.database.models import User
from backend.schemas.filters import FilterPage
from backend.schemas.task import FilterTask, FilterTaskPagination

CurrentUser = Annotated[User, Depends(get_current_user)]
OAuth2Form = Annotated[OAuth2PasswordRequestForm, Depends()]
Session = Annotated[Session, Depends(get_session)]
Filter = Annotated[FilterPage, Query()]
FilterTaskPage = Annotated[FilterTaskPagination, Query()]
FilterTaskQuery = Annotated[FilterTask, Query()]
