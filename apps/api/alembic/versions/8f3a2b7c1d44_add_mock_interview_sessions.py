"""Add mock interview sessions."""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "8f3a2b7c1d44"
down_revision = "7d4f1c9e2a31"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "mock_interview_sessions",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            nullable=False,
        ),
        sa.Column("subject", sa.String(length=50), nullable=False),
        sa.Column("difficulty", sa.String(length=20), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_mock_interview_sessions_user_id",
        "mock_interview_sessions",
        ["user_id"],
    )

    op.create_index(
        "ix_mock_interview_sessions_user_status",
        "mock_interview_sessions",
        ["user_id", "status"],
    )


def downgrade():
    op.drop_index(
        "ix_mock_interview_sessions_user_status",
        table_name="mock_interview_sessions",
    )
    op.drop_index(
        "ix_mock_interview_sessions_user_id",
        table_name="mock_interview_sessions",
    )
    op.drop_table("mock_interview_sessions")
