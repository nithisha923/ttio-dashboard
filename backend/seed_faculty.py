from faker import Faker
from passlib.context import CryptContext

from app.db import SessionLocal
from app.models import User

fake = Faker()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

departments = [
    "Computer Science",
    "Information Systems",
    "Cybersecurity",
    "Biology",
    "Chemistry",
    "Mathematics",
    "Physics",
    "Engineering Technology",
    "Business",
    "Nursing",
]

db = SessionLocal()

default_password = "Bowie@123"
hashed_password = pwd_context.hash(default_password)

created_users = set()

while len(created_users) < 100:
    first = fake.first_name().lower()
    last = fake.last_name().lower()

    email = f"{first[0]}{last}@bowie.edu"

    if email in created_users:
        continue

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        continue

    user = User(
        full_name=f"Dr. {first.capitalize()} {last.capitalize()}",
        email=email,
        hashed_password=hashed_password,
        role="faculty",
        department=fake.random_element(elements=departments),
    )

    db.add(user)
    created_users.add(email)

db.commit()
db.close()

print("100 realistic Bowie faculty users created.")
print("Default password for all seeded users: Bowie@123")