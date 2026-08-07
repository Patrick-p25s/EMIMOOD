import uuid
from pathlib import Path

from app.core.config import setting
from fastapi import HTTPException, UploadFile, status

UPLOAD_DIR = Path(setting.UPLOAD_DIR)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_UPLOAD_SIZE = setting.MAX_UPLOAD_SIZE_MB * 1024 * 1024
CHUNK_SIZE = 1024 * 1024  # 1 Mo


async def save_upload_file(file: UploadFile) -> tuple[str, int]:
    extension = Path(file.filename or "").suffix
    unique_name = f"{uuid.uuid4()}{extension}"
    destination = UPLOAD_DIR / unique_name

    total_size = 0
    with open(destination, "wb") as buffer:
        while chunk := await file.read(CHUNK_SIZE):
            total_size += len(chunk)
            if total_size > MAX_UPLOAD_SIZE:
                buffer.close()
                destination.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Fichier trop volumineux (max {setting.MAX_UPLOAD_SIZE_MB} Mo)",
                )
            buffer.write(chunk)

    return str(destination), total_size
