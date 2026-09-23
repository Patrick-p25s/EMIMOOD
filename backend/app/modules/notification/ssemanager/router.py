from fastapi import APIRouter, Depends, Request
from sse_starlette.sse import EventSourceResponse

from app.core.dependencies import get_current_user
from app.modules.users.model import Users

from .service import (
    SSEConnectionService,
    SSEService,
    notification_store,
)


sse_connection_service = SSEConnectionService(notification_store)

sse_service_instance = SSEService(sse_connection_service)


def get_sse_service() -> SSEService:
    return sse_service_instance


router = APIRouter(
    prefix="/alerte_notifications",
    tags=["Alerte_Notifications"],
)


@router.get("/stream")
async def notification_stream(
    request: Request,
    sse_service: SSEService = Depends(get_sse_service),
    current_user: Users = Depends(get_current_user),
):
    return EventSourceResponse(
        sse_service.stream(
            user_id=current_user.id,
            classe_id=current_user.classe_id,
            request=request,
        ),
        headers={
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
