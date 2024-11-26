"""remove_all_journal_entries

Revision ID: remove_all_journal_entries
Revises: 3d8f2384c936
Create Date: 2024-11-26 15:50:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = 'remove_all_journal_entries'
down_revision = '3d8f2384c936'
branch_labels = None
depends_on = None


def upgrade():
    # Get database connection
    connection = op.get_bind()
    
    # Remove all journal entries while keeping the table structure
    connection.execute(
        text("TRUNCATE TABLE journal_entry")
    )


def downgrade():
    # We cannot restore deleted entries
    pass
