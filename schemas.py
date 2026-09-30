from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username between 3 and 50 characters")
    password: str = Field(..., min_length=4, max_length=100, description="Password of at least 4 characters")
    role: Optional[str] = Field("user", description="User role ('user' or 'admin')")

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    role: str

class MessageResponse(BaseModel):
    message: str
    username: Optional[str] = None
    role: Optional[str] = None
