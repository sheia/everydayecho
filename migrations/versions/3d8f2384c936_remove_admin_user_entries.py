"""remove_admin_user_entries

Revision ID: 3d8f2384c936
Revises: 8cae5609ee40
Create Date: 2024-11-26 15:19:19.405548

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = '3d8f2384c936'
down_revision = '8cae5609ee40'
branch_labels = None
depends_on = None


def upgrade():
    # Get database connection
    connection = op.get_bind()
    
    # Find the admin user
    result = connection.execute(
        text("SELECT id FROM \"user\" WHERE email = 'admin@example.com'")
    )
    admin_user = result.fetchone()
    
    if admin_user:
        admin_id = admin_user[0]
        # Delete journal entries associated with admin user
        connection.execute(
            text("DELETE FROM journal_entry WHERE user_id = :user_id"),
            {"user_id": admin_id}
        )
        # Delete the admin user
        connection.execute(
            text("DELETE FROM \"user\" WHERE id = :user_id"),
            {"user_id": admin_id}
        )


def downgrade():
    # We cannot restore deleted entries
    pass
