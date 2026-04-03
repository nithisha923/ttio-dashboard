from sqlalchemy import Column, String, Text
import uuid

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="faculty")
    department = Column(String(255), nullable=True)


class Invention(Base):
    __tablename__ = "inventions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    problem = Column(Text)
    inventor = Column(String(255))
    department = Column(String(255))
    faculty_email = Column(String(255), nullable=True)
    status = Column(String(100), default="Submitted")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    original_filename = Column(String(255), nullable=False)
    blob_name = Column(String(500), nullable=False)
    blob_url = Column(String(1000), nullable=False)
    content_type = Column(String(255))
    uploaded_by_email = Column(String(255))
    invention_id = Column(String(36))