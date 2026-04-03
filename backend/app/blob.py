from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
from datetime import datetime, timedelta
import os
import uuid

connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
container_name = "ttio-documents"

blob_service_client = BlobServiceClient.from_connection_string(connection_string)


def upload_file_to_blob(file):
    unique_name = f"{uuid.uuid4()}-{file.filename}"
    blob_name = f"inventions/{unique_name}"

    blob_client = blob_service_client.get_blob_client(
        container=container_name,
        blob=blob_name
    )

    file.file.seek(0)
    blob_client.upload_blob(file.file, overwrite=True)

    blob_url = (
        f"https://{blob_service_client.account_name}.blob.core.windows.net/"
        f"{container_name}/{blob_name}"
    )

    return {
        "original_filename": file.filename,
        "blob_name": blob_name,
        "blob_url": blob_url,
        "content_type": file.content_type,
    }


def generate_secure_url(blob_name):
    sas_token = generate_blob_sas(
        account_name=blob_service_client.account_name,
        container_name=container_name,
        blob_name=blob_name,
        account_key=blob_service_client.credential.account_key,
        permission=BlobSasPermissions(read=True),
        expiry=datetime.utcnow() + timedelta(hours=1)
    )

    url = (
        f"https://{blob_service_client.account_name}.blob.core.windows.net/"
        f"{container_name}/{blob_name}?{sas_token}"
    )

    return url