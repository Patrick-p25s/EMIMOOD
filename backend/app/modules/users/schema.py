from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr
    password: str
    code_invitation: str


class UpdateProfile(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr


class UpdatePassword(BaseModel):
    password: str
    new_password: str


class UserOut(UserCreate):
    id: UUID
    role: str
    create_at: datetime
    update_at: datetime

    model_config = {"from_attributes": True}


class UserRead(BaseModel):
    first_name: str
    last_name: str
    phone_number: str | str = None
    email: EmailStr
    model_config = {"from_attributes": True}
