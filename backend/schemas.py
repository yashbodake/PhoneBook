from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import re


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    username: str
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    phone_number: str
    email: Optional[str] = None
    address: Optional[str] = None

    @classmethod
    def validate_phone(cls, v):
        # Basic phone number validation (you can enhance this)
        if not re.match(r'^\+?[1-9]\d{1,14}$', v.replace('-', '').replace(' ', '')):
            raise ValueError('Invalid phone number format')
        # Normalize phone number (remove spaces, dashes, etc.)
        return v.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')


class ContactCreate(ContactBase):
    pass


class ContactUpdate(ContactBase):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone_number: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None


class ContactResponse(ContactBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None