from sqlalchemy import select

from backend.auth.security import (
    get_password_hash,
)
from backend.database.models import User
from backend.schemas.user import (
    UserPatch,
    UserSchema,
)
from backend.utils.dependencies import CurrentUser, Filter, Session
from backend.utils.exceptions import (
    EmailExistsException,
    NoPermissionException,
    UsernameExistsException,
    UserNotFoundException,
)
from backend.utils.sanitize import sanitize_email, sanitize_username


def create_user_service(user: UserSchema, session: Session):
    db_user = session.scalar(
        select(User).where(
            (User.username == user.username) | (User.email == user.email)
        )
    )

    if db_user:
        if db_user.username == user.username:
            raise UsernameExistsException

        elif db_user.email == user.email:
            raise EmailExistsException

    hashed_password = get_password_hash(user.password)

    db_user = User(
        email=sanitize_email(user.email),
        username=sanitize_username(user.username),
        password=hashed_password,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def list_users_service(session: Session, filter: Filter):
    query = (
        select(User)
        .offset(filter.offset)
        .limit(filter.limit)
        .where(User.is_active)
    )

    users = session.scalars(query).all()

    return {'users': users}


def read_user_service(user_id: int, session: Session):
    db_user = session.scalar(
        select(User).where(User.id == user_id, User.is_active)
    )

    if not db_user:
        raise UserNotFoundException

    return db_user


def update_user_service(
    user_id: int,
    user: UserSchema,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise NoPermissionException

    current_user.email = sanitize_email(user.email)
    current_user.username = sanitize_username(user.username)
    current_user.password = get_password_hash(user.password)

    session.commit()
    session.refresh(current_user)

    return current_user


def patch_user_service(
    user_id: int,
    user: UserPatch,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise NoPermissionException

    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)

    session.commit()
    session.refresh(current_user)

    return current_user


def deactivate_user_service(
    user_id: int,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise NoPermissionException

    current_user.is_active = False

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return current_user


def activate_user_service(user_id: int, session: Session):
    db_user = session.scalar(select(User).where(User.id == user_id))

    if not db_user:
        raise UserNotFoundException

    db_user.is_active = True

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user


def delete_user_service(
    user_id: int,
    session: Session,
    current_user: CurrentUser,
):
    if current_user.id != user_id:
        raise NoPermissionException

    session.delete(current_user)
    session.commit()

    return {'message': 'User deleted'}
