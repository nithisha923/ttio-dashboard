from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import User

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/signup")
def signup(user: dict):
    db: Session = SessionLocal()

    email = user.get("email", "").strip().lower()
    password = user.get("password", "")
    full_name = user.get("full_name", "")
    department = user.get("department", "")

    if not email.endswith("@bowie.edu"):
        db.close()
        raise HTTPException(status_code=400, detail="Only @bowie.edu email addresses are allowed")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = pwd_context.hash(password)

    new_user = User(
        full_name=full_name,
        email=email,
        hashed_password=hashed_password,
        role="faculty",
        department=department,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()

    return {
        "message": "User created successfully",
        "id": str(new_user.id),
        "email": new_user.email,
        "full_name": new_user.full_name,
        "department": new_user.department,
        "role": new_user.role,
    }


@router.post("/login")
def login(user: dict):
    db: Session = SessionLocal()

    email = user.get("email", "").strip().lower()
    password = user.get("password", "")

    existing_user = db.query(User).filter(User.email == email).first()

    if not existing_user:
        db.close()
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not pwd_context.verify(password, existing_user.hashed_password):
        db.close()
        raise HTTPException(status_code=401, detail="Invalid email or password")

    db.close()

    return {
        "message": "Login successful",
        "email": existing_user.email,
        "full_name": existing_user.full_name,
        "department": existing_user.department,
        "role": existing_user.role,
    }