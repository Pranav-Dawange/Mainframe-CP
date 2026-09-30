import os
import subprocess
from datetime import timedelta
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException, status, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from models import User
from schemas import Token, MessageResponse, UserResponse
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
    title="Mainframe Fraud Detection & Auto-Reversal API",
    description="FastAPI backend with JWT Authentication protecting Zowe Mainframe Batch Jobs and VSAM operations.",
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

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Mainframe Fraud Detection API",
        "auth": "JWT Bearer Token Required for Mainframe Endpoints",
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