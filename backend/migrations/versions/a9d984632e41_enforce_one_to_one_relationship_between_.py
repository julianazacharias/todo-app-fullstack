"""Enforce one-to-one relationship between User, Task, and Location

Revision ID: a9d984632e41
Revises: 6aa9c6fffbe3
Create Date: 2024-12-11 19:53:01.275446

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a9d984632e41'
down_revision: Union[str, None] = '6aa9c6fffbe3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'locations', ['task_id'])
    op.create_unique_constraint(None, 'locations', ['user_id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'locations', type_='unique')
    op.drop_constraint(None, 'locations', type_='unique')
    # ### end Alembic commands ###
