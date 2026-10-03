from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)

    documents = relationship("Document", back_populates="owner")
    activities = relationship("Activity", back_populates="user")
    notifications = relationship("Notification", back_populates="user")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    type = Column(String, index=True)
    upload_date = Column(DateTime, default=datetime.utcnow)
    purchase_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=True)
    warranty_end_date = Column(DateTime, nullable=True)
    amount = Column(Float, nullable=True)
    status = Column(String, default="Active")
    file_path = Column(String)
    file_size = Column(Integer, default=0)
    invoice_number = Column(String, nullable=True)
    extracted_text = Column(String, nullable=True)

    owner = relationship("User", back_populates="documents")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(DateTime, default=datetime.utcnow)
    action = Column(String)
    details = Column(String)

    user = relationship("User", back_populates="activities")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)
    date = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    type = Column(String)

    user = relationship("User", back_populates="notifications")
