from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import Invention, Document
from app.blob import generate_secure_url

router = APIRouter()


@router.post("/inventions")
def create_invention(invention: dict):
    print("Incoming data:", invention)

    db: Session = SessionLocal()

    try:
        new_invention = Invention(
            title=invention.get("title"),
            description=invention.get("description"),
            problem=invention.get("problem"),
            inventor=invention.get("inventor"),
            department=invention.get("department"),
            faculty_email=invention.get("faculty_email"),
            status=invention.get("status", "Submitted"),
        )

        db.add(new_invention)
        db.commit()
        db.refresh(new_invention)

        response_data = {
            "message": "Invention saved successfully",
            "id": str(new_invention.id),
            "title": new_invention.title,
            "description": new_invention.description,
            "problem": new_invention.problem,
            "inventor": new_invention.inventor,
            "department": new_invention.department,
            "faculty_email": new_invention.faculty_email,
            "status": new_invention.status,
        }

        return response_data

    finally:
        db.close()


@router.get("/inventions")
def get_inventions():
    db: Session = SessionLocal()

    try:
        inventions = db.query(Invention).all()
        results = []

        for inv in inventions:
            linked_documents = (
                db.query(Document)
                .filter(Document.invention_id == inv.id)
                .all()
            )

            documents_data = []

            for doc in linked_documents:
                secure_view_url = None

                try:
                    secure_view_url = generate_secure_url(doc.blob_name)
                except Exception as e:
                    print(f"Error generating secure URL for document {doc.id}: {e}")

                documents_data.append(
                    {
                        "id": str(doc.id),
                        "original_filename": doc.original_filename,
                        "blob_name": doc.blob_name,
                        "blob_url": doc.blob_url,
                        "content_type": doc.content_type,
                        "uploaded_by_email": doc.uploaded_by_email,
                        "invention_id": doc.invention_id,
                        "secure_view_url": secure_view_url,
                    }
                )

            results.append(
                {
                    "id": str(inv.id),
                    "title": inv.title,
                    "description": inv.description,
                    "problem": inv.problem,
                    "inventor": inv.inventor,
                    "department": inv.department,
                    "faculty_email": inv.faculty_email,
                    "status": inv.status,
                    "documents": documents_data,
                }
            )

        return results

    finally:
        db.close()


@router.put("/inventions/{invention_id}/status")
def update_invention_status(invention_id: str, data: dict):
    db: Session = SessionLocal()

    try:
        invention = db.query(Invention).filter(Invention.id == invention_id).first()

        if not invention:
            return {"error": "Invention not found"}

        invention.status = data.get("status", invention.status)
        db.commit()
        db.refresh(invention)

        return {
            "message": "Status updated successfully",
            "id": str(invention.id),
            "new_status": invention.status,
        }

    finally:
        db.close()