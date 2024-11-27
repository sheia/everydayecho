"""update_plan_history

Revision ID: update_plan_history
Revises: remove_all_journal_entries
Create Date: 2024-11-27 10:05:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = 'update_plan_history'
down_revision = 'remove_all_journal_entries'
branch_labels = None
depends_on = None


def upgrade():
    """
    This migration serves as documentation that MERN migration steps were cancelled
    and we are continuing with the Flask implementation.
    No database changes are needed.
    """
    pass


def downgrade():
    """
    No changes to revert
    """
    pass
