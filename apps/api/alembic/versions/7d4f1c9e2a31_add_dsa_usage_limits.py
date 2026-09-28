
"""add dsa usage limits

Revision ID: 7d4f1c9e2a31
Revises: 5acc4e4176f6
Create Date: 2026-09-25
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "7d4f1c9e2a31"
down_revision: Union[str, Sequence[str], None] = "5acc4e4176f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "dsa_usage",
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
        sa.Column(
            "question_id",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "company",
            sa.String(length=120),
            nullable=False,
        ),
        sa.Column(
            "kind",
            sa.String(length=32),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id",
            "question_id",
            "kind",
            name="uq_dsa_usage_user_question_kind",
        ),
    )

    op.create_index(
        "ix_dsa_usage_user_id",
        "dsa_usage",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        "ix_dsa_usage_user_kind",
        "dsa_usage",
        ["user_id", "kind"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_dsa_usage_user_kind",
        table_name="dsa_usage",
    )
    op.drop_index(
        "ix_dsa_usage_user_id",
        table_name="dsa_usage",
    )
    op.drop_table("dsa_usage")
