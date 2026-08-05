from fastapi import APIRouter


router = APIRouter(prefix="/documents", tags=["Route sauvegardé"])


@router.get("/{id}")
async def get_document_by_id(id: str):
    return {"Message": "Message"}
