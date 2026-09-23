from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class ClasseResponse(BaseModel):
    mention: str
    niveau: str
    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    matricule: str
    email: EmailStr
    password: str
    code_invitation: str


class ModeratorCreate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    matricule: str
    email: EmailStr
    password: str


class UpdateProfile(BaseModel):
    first_name: str
    last_name: str
    phone_number: str
    email: EmailStr


class UpdatePassword(BaseModel):
    password: str
    new_password: str


class UserOut(BaseModel):
    id: UUID
    first_name: str | None
    last_name: str | None
    phone_number: str | None
    matricule: str | None
    avatar_url: str | None
    email: EmailStr
    role: str
    classe: ClasseResponse | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserRead(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    phone_number: str | None = None
    email: EmailStr
    role: str
    matricule: str | None
    avatar_url: str | None
    classe_id: UUID | None = None
    classe: ClasseResponse | None = None
    model_config = {"from_attributes": True}
