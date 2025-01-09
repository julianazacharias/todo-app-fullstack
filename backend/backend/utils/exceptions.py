from http import HTTPStatus

from fastapi import HTTPException

UserNotFoundException = HTTPException(
    status_code=HTTPStatus.NOT_FOUND, detail='User not found'
)

UsernameExistsException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Username already exists',
)

EmailExistsException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Username already exists',
)
IncorrectLoginException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Incorrect email or password',
)
NoPermissionException = HTTPException(
    status_code=HTTPStatus.FORBIDDEN, detail='Not enough permissions'
)

TaskNotFoundException = HTTPException(
    status_code=HTTPStatus.NOT_FOUND, detail='Task not found'
)

TaskExistsException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Task title already exists',
)

UserLocationExistsException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Location already exists for this user',
)

TaskLocationExistsException = HTTPException(
    status_code=HTTPStatus.BAD_REQUEST,
    detail='Location already exists for this task',
)

UserLocationNotFoundException = HTTPException(
    status_code=HTTPStatus.NOT_FOUND,
    detail='Could not find this user location',
)

TaskLocationNotFoundException = HTTPException(
    status_code=HTTPStatus.NOT_FOUND,
    detail='Task does not have a location yet',
)
