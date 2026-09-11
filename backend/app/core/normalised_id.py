from uuid import UUID


def normalized_id(id: UUID | str):
    return id if isinstance(UUID) else UUID(id)
