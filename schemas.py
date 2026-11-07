from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

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

class DocumentResponse(BaseModel):
    id: int
    name: str
    type: str
    upload_date: datetime
    purchase_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    warranty_end_date: Optional[datetime] = None
    amount: Optional[float] = None
    status: str
    file_path: str
    file_size: int
    invoice_number: Optional[str] = None
    extracted_text: Optional[str] = None
    mainframe_job_id: Optional[str] = None
    mainframe_status: Optional[str] = None
    
    class Config:
        from_attributes = True

class ActivityResponse(BaseModel):
    id: int
    date: datetime
    action: str
    details: str

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: int
    message: str
    date: datetime
    is_read: bool
    type: str

    class Config:
        from_attributes = True

class AssistantRequest(BaseModel):
    query: str
    gemini_key: Optional[str] = None
    groq_key: Optional[str] = None

class AssistantResponse(BaseModel):
    answer: str
    engine: Optional[str] = "local_cat"
    emotion: Optional[str] = "happy"
