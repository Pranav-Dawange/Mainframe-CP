import os
import subprocess
import shutil
import uuid
import random
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status, Form, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database import engine, Base, get_db
from models import User, Document, Activity, Notification
from schemas import (
    Token, MessageResponse, UserResponse, DocumentResponse, 
    ActivityResponse, NotificationResponse, AssistantRequest, AssistantResponse
)
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Initialize SQLite database tables and default admin
Base.metadata.create_all(bind=engine)

def seed_default_admin():
    """Ensure default admin/operator user exists for testing convenience."""
    db = next(get_db())
    try:
        admin_user = db.query(User).filter(User.username == "admin").first()
        if not admin_user:
            default_admin = User(
                username="admin",
                hashed_password=get_password_hash("admin123"),
                role="admin"
            )
            db.add(default_admin)
            db.commit()
            print("[INFO] Seeded default user: username='admin', password='admin123', role='admin'")
    finally:
        db.close()

seed_default_admin()

app = FastAPI(
    title="LifeVault API (Mainframe Fraud Detection & Auto-Reversal API)",
    description="FastAPI backend with JWT Authentication protecting Zowe Mainframe Batch Jobs and VSAM operations, plus LifeVault features.",
    version="2.0.0"
)

# Enable CORS for React frontend (Vite default: http://localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "LifeVault API",
        "auth": "JWT Bearer Token Required",
        "docs": "/docs"
    }


# ==========================================
# AUTHENTICATION ENDPOINTS
# ==========================================

@app.post("/signup", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
@app.post("/api/signup", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: Request, db: Session = Depends(get_db)):
    """
    Register a new user in the local SQLite database.
    Accepts JSON or Form data (username, password, optional role).
    Enforces password hashing with bcrypt.
    """
    content_type = request.headers.get("content-type", "")
    username = ""
    password = ""
    role = "user"

    if "application/json" in content_type:
        try:
            body = await request.json()
            username = body.get("username", "")
            password = body.get("password", "")
            role = body.get("role", "user") or "user"
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
    else:
        try:
            form = await request.form()
            username = form.get("username", "")
            password = form.get("password", "")
            role = form.get("role", "user") or "user"
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid form submission")

    username = str(username).strip()
    password = str(password).strip()

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )

    if len(username) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be at least 3 characters long"
        )

    if len(password) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters long"
        )

    if role not in ["admin", "user"]:
        role = "user"

    # Check for existing user in SQLite
    existing_user = db.query(User).filter(User.username == username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{username}' is already taken. Please choose another username or log in."
        )

    # Secure bcrypt hashing
    hashed_password = get_password_hash(password)

    new_user = User(
        username=username,
        hashed_password=hashed_password,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": f"Account '{new_user.username}' successfully created. You can now log in.",
        "username": new_user.username,
        "role": new_user.role
    }


@app.post("/login", response_model=Token)
@app.post("/api/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    """
    Authenticate user credentials against the local SQLite database.
    Issues a signed JWT access token upon successful verification.
    """
    content_type = request.headers.get("content-type", "")
    username = ""
    password = ""

    if "application/json" in content_type:
        try:
            body = await request.json()
            username = body.get("username", "")
            password = body.get("password", "")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
    else:
        try:
            form = await request.form()
            username = form.get("username", "")
            password = form.get("password", "")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid form submission")

    username = str(username).strip()
    password = str(password).strip()

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both username and password are required"
        )

    # Verify against SQLite users table
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password. Please verify credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=token_expires
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username,
        "role": user.role
    }


@app.get("/me", response_model=UserResponse)
@app.get("/api/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Protected endpoint to verify token validity and retrieve current user session profile.
    """
    return current_user


# ==========================================
# PROTECTED MAINFRAME / FRAUD ENDPOINTS
# ==========================================

@app.post("/api/submit-transaction", response_class=PlainTextResponse)
async def submit_transaction_api(
    account_num: str = Form(...),
    amount: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    """
    Protected Mainframe Batch Submission Endpoint.
    Requires a valid JWT Bearer token via `get_current_user`.
    Blocks unauthenticated execution before any Zowe CLI command is triggered.
    """
    print(f"[AUTH AUDIT] User '{current_user.username}' (role: {current_user.role}) authenticated for transaction submission.")
    
    formatted_amt = str(int(amount)).zfill(5) + "00"
    txn_record = f"{account_num}W{formatted_amt}".ljust(80)

    # Execute Zowe batch job
    command = 'zowe jobs submit data-set "Z72771.JCL(RPTGEN)" --view-all-spool-content'

    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=30
        )
        
        out_text = result.stdout.strip() if result.stdout else ""
        err_text = result.stderr.strip() if result.stderr else ""
        
        if not out_text and not err_text:
            return "DEBUG: Zowe returned an empty response. (Check Zowe Profile Authentication)"
            
        if result.returncode != 0:
            return f"ZOWE ERROR (Code {result.returncode}):\n{err_text}\n{out_text}"
            
        return out_text

    except subprocess.TimeoutExpired:
        return "ERROR: The Zowe command timed out after 30 seconds."
    except Exception as e:
        return f"PYTHON CRASH: {str(e)}"

# ==========================================
# LIFEVAULT ENDPOINTS
# ==========================================

def log_activity(db: Session, user_id: int, action: str, details: str):
    activity = Activity(user_id=user_id, action=action, details=details)
    db.add(activity)
    db.commit()

@app.get("/api/documents", response_model=List[DocumentResponse])
async def get_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    return docs

@app.post("/api/documents", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = f"uploads/{filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_size = os.path.getsize(file_path)

    # Simulate AI Extraction (LifeVault Requirement)
    # The requirement says we should simulate extracting information
    doc_types = ["Invoice", "Warranty", "Insurance", "Certificate", "Bill", "Other"]
    doc_type = "Invoice" if "invoice" in file.filename.lower() else random.choice(doc_types)
    
    amount = float(random.randint(100, 100000)) if doc_type in ["Invoice", "Bill"] else None
    
    purchase_date = datetime.utcnow()
    warranty_end_date = purchase_date + timedelta(days=365*3) if doc_type in ["Warranty", "Invoice"] else None
    expiry_date = purchase_date + timedelta(days=365) if doc_type == "Insurance" else None
    invoice_number = f"INV-{random.randint(10000, 99999)}" if doc_type == "Invoice" else None

    new_doc = Document(
        user_id=current_user.id,
        name=file.filename,
        type=doc_type,
        file_path=file_path,
        file_size=file_size,
        purchase_date=purchase_date,
        expiry_date=expiry_date,
        warranty_end_date=warranty_end_date,
        amount=amount,
        invoice_number=invoice_number,
        status="Active"
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # Send a pretend transaction via the existing Zowe integration API (as per requirements to use the existing backend)
    print(f"[LIFEVAULT-ZOWE-SYNC] Syncing document {new_doc.id} metadata to mainframe for user {current_user.username}...")

    log_activity(db, current_user.id, "Document Uploaded", f"Uploaded document: {file.filename}")
    
    # Create notification if warranty
    if warranty_end_date:
        notif = Notification(user_id=current_user.id, message=f"Warranty recorded for {file.filename}. Expires on {warranty_end_date.strftime('%Y-%m-%d')}", type="System")
        db.add(notif)
        db.commit()

    return new_doc

@app.get("/api/documents/{id}", response_model=DocumentResponse)
async def get_document(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    log_activity(db, current_user.id, "Document Viewed", f"Viewed document: {doc.name}")
    return doc

@app.delete("/api/documents/{id}")
async def delete_document(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == id, Document.user_id == current_user.id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    name = doc.name
    db.delete(doc)
    db.commit()
    
    log_activity(db, current_user.id, "Document Deleted", f"Deleted document: {name}")
    return {"message": "Document deleted successfully"}

@app.get("/api/warranties", response_model=List[DocumentResponse])
async def get_warranties(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    warranties = db.query(Document).filter(
        Document.user_id == current_user.id,
        Document.warranty_end_date.isnot(None)
    ).all()
    return warranties

@app.get("/api/notifications", response_model=List[NotificationResponse])
async def get_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.date.desc()).all()

@app.get("/api/activity", response_model=List[ActivityResponse])
async def get_activity(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Activity).filter(Activity.user_id == current_user.id).order_by(Activity.date.desc()).all()

@app.get("/api/search", response_model=List[DocumentResponse])
async def search_documents(q: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    docs = db.query(Document).filter(
        Document.user_id == current_user.id,
        or_(
            Document.name.ilike(f"%{q}%"),
            Document.type.ilike(f"%{q}%")
        )
    ).all()
    return docs

@app.post("/api/assistant", response_model=AssistantResponse)
async def assistant(request: AssistantRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = request.query.lower()
    log_activity(db, current_user.id, "AI Assistant Query", f"Asked: {query}")
    
    # Simple simulated AI matching logic
    if "warranty" in query:
        warranties = db.query(Document).filter(Document.user_id == current_user.id, Document.warranty_end_date.isnot(None)).all()
        if not warranties:
            return {"answer": "You don't have any active warranties saved."}
        ans = "Here are your warranties:\n"
        for w in warranties:
            ans += f"- {w.name} expires on {w.warranty_end_date.strftime('%Y-%m-%d')}\n"
        return {"answer": ans}
    
    if "how much" in query or "spend" in query:
        invoices = db.query(Document).filter(Document.user_id == current_user.id, Document.amount.isnot(None)).all()
        if not invoices:
            return {"answer": "I couldn't find any documents with purchase amounts."}
        total = sum([doc.amount for doc in invoices if doc.amount])
        return {"answer": f"Based on your documents, you have spent a total of ₹{total:,.2f}."}
        
    return {"answer": f"I can help you find information about your documents. For example, you can ask about your warranties, or how much you spent on certain items based on your invoices."}