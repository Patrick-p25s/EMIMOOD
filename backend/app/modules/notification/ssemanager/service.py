import asyncio
import json
from uuid import UUID

from fastapi import Request


class ConnectionStore:
    def __init__(self):
        self._connections: dict[UUID, list[asyncio.Queue]] = {}
        self._class_connections: dict[UUID, list[asyncio.Queue]] = {}

    def add(
        self,
        user_id: UUID,
        queue: asyncio.Queue,
        classe_id: UUID | None = None,
    ):
        if user_id not in self._connections:
            self._connections[user_id] = []

        self._connections[user_id].append(queue)

        if classe_id is not None:
            if classe_id not in self._class_connections:
                self._class_connections[classe_id] = []

            self._class_connections[classe_id].append(queue)

    def remove(
        self,
        user_id: UUID,
        queue: asyncio.Queue,
        classe_id: UUID | None = None,
    ):
        user_connections = self._connections.get(user_id)

        if user_connections and queue in user_connections:
            user_connections.remove(queue)

            if not user_connections:
                del self._connections[user_id]

        if classe_id is not None:
            class_connections = self._class_connections.get(classe_id)

            if class_connections and queue in class_connections:
                class_connections.remove(queue)

                if not class_connections:
                    del self._class_connections[classe_id]

    def get(self, user_id: UUID) -> list[asyncio.Queue]:
        return self._connections.get(user_id, [])

    def get_by_class(self, classe_id: UUID) -> list[asyncio.Queue]:
        return self._class_connections.get(classe_id, [])


notification_store = ConnectionStore()


class SSEConnectionService:
    def __init__(self, store: ConnectionStore):
        self.store = store

    async def connect(
        self,
        user_id: UUID,
        classe_id: UUID | None = None,
    ):
        queue = asyncio.Queue()

        self.store.add(
            user_id=user_id,
            queue=queue,
            classe_id=classe_id,
        )

        return queue

    async def disconnect(
        self,
        user_id: UUID,
        queue: asyncio.Queue,
        classe_id: UUID | None = None,
    ) -> None:
        self.store.remove(
            user_id=user_id,
            queue=queue,
            classe_id=classe_id,
        )


class SSEService:
    def __init__(self, manager: SSEConnectionService):
        self.manager = manager

    async def stream(
        self,
        user_id: UUID,
        classe_id: UUID | None,
        request: Request,
    ):
        queue = await self.manager.connect(
            user_id=user_id,
            classe_id=classe_id,
        )

        try:
            while True:
                if await request.is_disconnected():
                    break

                try:
                    data = await asyncio.wait_for(
                        queue.get(),
                        timeout=15,
                    )

                    yield {
                        "event": "notification",
                        "data": json.dumps(data),
                    }

                except asyncio.TimeoutError:
                    yield {
                        "event": "ping",
                        "data": "keep-alive",
                    }

        finally:
            await self.manager.disconnect(
                user_id=user_id,
                queue=queue,
                classe_id=classe_id,
            )
