from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

ADMIN_USERS = [
    {
        "full_name": "TTIO Admin 1",
        "email": "ttioadmin1@bowie.edu",
        "password": "Admin@123",
        "role": "admin",
        "department": "TTIO",
    },
    {
        "full_name": "TTIO Admin 2",
        "email": "ttioadmin2@bowie.edu",
        "password": "Admin@123",
        "role": "admin",
        "department": "TTIO",
    },
    {
        "full_name": "TTIO Admin 3",
        "email": "ttioadmin3@bowie.edu",
        "password": "Admin@123",
        "role": "admin",
        "department": "TTIO",
    },
]


def seed_admin_users():
    db: Session = SessionLocal()

    try:
        for admin in ADMIN_USERS:
            existing_user = db.query(User).filter(User.email == admin["email"]).first()

            if existing_user:
                existing_user.full_name = admin["full_name"]
                existing_user.hashed_password = pwd_context.hash(admin["password"])
                existing_user.role = admin["role"]
                existing_user.department = admin["department"]
                print(f"Updated existing admin user: {admin['email']}")
            else:
                new_user = User(
                    full_name=admin["full_name"],
                    email=admin["email"],
                    hashed_password=pwd_context.hash(admin["password"]),
                    role=admin["role"],
                    department=admin["department"],
                )
                db.add(new_user)
                print(f"Created new admin user: {admin['email']}")

        db.commit()
        print("TTIO admin seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding admin users: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin_users()