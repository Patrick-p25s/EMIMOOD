from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr
    password: str


class UpdateProfile(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr


class UpdatePassword(BaseModel):
    new_password: str


class UserOut(UserCreate):
    id: UUID
    role: str
    create_at: datetime
    update_at: datetime

    model_config = {"from_attributes": True}
