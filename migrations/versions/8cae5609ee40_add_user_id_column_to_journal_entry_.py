"""Add user_id column to journal_entry table

Revision ID: 8cae5609ee40
Revises: 
Create Date: 2024-11-26 15:14:33.614913

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text


# revision identifiers, used by Alembic.
revision = '8cae5609ee40'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Add user_id column as nullable first
    with op.batch_alter_table('journal_entry', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'user', ['user_id'], ['id'])

    # Create a default user if none exists and update existing entries
    connection = op.get_bind()
    
    # Check if we have any users
    result = connection.execute(text("SELECT id FROM \"user\" LIMIT 1"))
    user_exists = result.fetchone() is not None
    
    if not user_exists:
        # Create a default user
        result = connection.execute(
            text("INSERT INTO \"user\" (email, password_hash, created_at) VALUES ('admin@example.com', 'placeholder', CURRENT_TIMESTAMP) RETURNING id")
        )
    
    # Get the first user's id
    result = connection.execute(text("SELECT id FROM \"user\" ORDER BY id LIMIT 1"))
    default_user_id = result.fetchone()[0]
    
    # Update all existing journal entries to use the default user
    connection.execute(
        text(f"UPDATE journal_entry SET user_id = :user_id WHERE user_id IS NULL"),
        {"user_id": default_user_id}
    )
    
    # Now make the column NOT NULL
    with op.batch_alter_table('journal_entry', schema=None) as batch_op:
        batch_op.alter_column('user_id', nullable=False)


def downgrade():
    with op.batch_alter_table('journal_entry', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('user_id')
