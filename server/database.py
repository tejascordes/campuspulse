import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase

import os

raw_db_url = os.environ.get("DATABASE_URL")

if raw_db_url:
    # Ensure correct async driver prefixes if standard URLs are passed
    if raw_db_url.startswith("postgres://"):
        DATABASE_URL = raw_db_url.replace("postgres://", "postgresql+asyncpg://", 1)
    elif raw_db_url.startswith("postgresql://"):
        DATABASE_URL = raw_db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    elif raw_db_url.startswith("sqlite://") and not raw_db_url.startswith("sqlite+aiosqlite://"):
        DATABASE_URL = raw_db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
    else:
        DATABASE_URL = raw_db_url
else:
    # If running in Vercel or AWS Lambda serverless environment, write SQLite DB to /tmp
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        DATABASE_URL = "sqlite+aiosqlite:////tmp/campus_pulse.db"
    else:
        DATABASE_URL = "sqlite+aiosqlite:///./campus_pulse.db"

engine = create_async_engine(DATABASE_URL, echo=False)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
