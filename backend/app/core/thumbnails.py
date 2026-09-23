import asyncio
import subprocess
import uuid
from pathlib import Path

import fitz
from PIL import Image

THUMBNAIL_DIR = Path("uploads/thumbnails")
THUMBNAIL_SIZE = (400, 400)


def _generate_pdf_thumbnail(
    file_path: Path,
    output_path: Path,
) -> None:
    with fitz.open(file_path) as doc:
        if not doc.page_count:
            raise ValueError("PDF vide")

        page = doc.load_page(0)
        pix = page.get_pixmap(
            matrix=fitz.Matrix(1.5, 1.5),
            alpha=False,
        )
        pix.save(str(output_path))


def _generate_image_thumbnail(
    file_path: Path,
    output_path: Path,
) -> None:
    with Image.open(file_path) as img:
        img = img.convert("RGB")
        img.thumbnail(THUMBNAIL_SIZE)
        img.save(
            output_path,
            format="JPEG",
            quality=80,
            optimize=True,
        )


def _generate_video_thumbnail(
    file_path: Path,
    output_path: Path,
) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-ss",
            "00:00:01",
            "-i",
            str(file_path),
            "-frames:v",
            "1",
            "-vf",
            "scale=400:-1",
            "-q:v",
            "4",
            str(output_path),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )


def _generate_sync(
    file_path: str,
    mime_type: str,
) -> str | None:

    THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)

    thumbnail_name = f"{uuid.uuid4()}.jpg"
    output_path = THUMBNAIL_DIR / thumbnail_name

    path = Path(file_path)

    try:
        if mime_type == "application/pdf":
            _generate_pdf_thumbnail(path, output_path)

        elif mime_type.startswith("image/"):
            _generate_image_thumbnail(path, output_path)

        elif mime_type.startswith("video/"):
            _generate_video_thumbnail(path, output_path)

        else:
            return None

        return f"thumbnails/{thumbnail_name}"

    except Exception:
        output_path.unlink(missing_ok=True)
        return None


async def generate_thumbnail(
    file_path: str,
    mime_type: str,
) -> str | None:
    return await asyncio.to_thread(
        _generate_sync,
        file_path,
        mime_type,
    )
