from sqlmodel import SQLModel, Session, create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ["DATABASE_URL"]

engine = create_engine(DATABASE_URL, echo=True)
session_local = sessionmaker(
    class_=Session, autocommit=False, autoflush=False, bind=engine
)
SQLModel.metadata.create_all(bind=engine)


# Dependency to get the database session
def get_db():
    database = session_local()
    try:
        yield database
    finally:
        database.close()
