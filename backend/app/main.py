from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

from app.routes.inventions import router as inventions_router
from app.routes.auth import router as auth_router
from app.db import Base, engine, SessionLocal
from app.blob import upload_file_to_blob
from app.models import Document
from app import models

app = FastAPI(title="TTIO Dashboard API")

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(inventions_router)
app.include_router(auth_router)


@app.get("/")
def read_root():
    return {"message": "TTIO Dashboard API is running"}


@app.post("/upload-test")
async def upload_test(
    file: UploadFile = File(...),
    invention_id: str = Form(None)
):
    result = upload_file_to_blob(file)

    db = SessionLocal()

    new_doc = Document(
        original_filename=result["original_filename"],
        blob_name=result["blob_name"],
        blob_url=result["blob_url"],
        content_type=result["content_type"],
        uploaded_by_email=None,
        invention_id=invention_id
    )

    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    db.close()

    return {
        "message": "File uploaded and linked successfully",
        "document_id": new_doc.id,
        "original_filename": new_doc.original_filename,
        "blob_url": new_doc.blob_url,
        "invention_id": new_doc.invention_id
    }