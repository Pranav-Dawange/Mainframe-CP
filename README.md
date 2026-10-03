# LifeVault & Mainframe Auto-Reversal System

**LifeVault** is a modern, enterprise-grade personal document management and warranty intelligence platform, seamlessly integrated with a powerful **IBM z/OS Mainframe Backend** via **Zowe CLI**.

This project demonstrates a unique hybrid architecture where a cutting-edge React frontend (LifeVault) communicates with a FastAPI backend that handles both standard database operations (SQLite) and protected, high-security legacy mainframe job executions (Zowe).

## 🌟 Key Features

### LifeVault (Frontend Application)
* **Smart Document Management:** Upload, organize, and view invoices, warranties, certificates, and personal records.
* **Intelligent Warranty Tracking:** Auto-tracking of warranty periods and document expiry dates with status indicators (Active, Expiring Soon, Expired).
* **AI Extraction Simulation:** Intelligent extraction of metadata like Purchase Date, Amount, and Invoice Numbers from documents.
* **Notification System:** Receive alerts for upcoming expiries and background system processing.
* **Activity Audit Log:** Complete transparency with a logged history of all user actions.
* **Responsive SaaS UI:** Built with React, Tailwind CSS v4, and Lucide Icons for a premium enterprise feel.

### Backend Infrastructure (FastAPI + Zowe)
* **Secure Authentication:** JWT Bearer token-based authentication with bcrypt password hashing.
* **Protected Zowe Integration:** Executes secure mainframe batch jobs (`Z72771.JCL(RPTGEN)`) via Zowe CLI endpoints, fully protected behind JWT authentication.
* **Relational Database:** SQLite with SQLAlchemy ORM handling `Users`, `Documents`, `Activities`, and `Notifications`.
* **RESTful API:** Clean, well-structured API endpoints supporting both LifeVault workflows and Mainframe execution.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, Vite, React Router DOM v7, Tailwind CSS v4, Lucide React, Axios.
* **Backend:** Python 3.12, FastAPI, SQLAlchemy, Uvicorn, Python-Jose (JWT), Passlib (Bcrypt).
* **Mainframe Integration:** Zowe CLI.
* **Database:** SQLite.

---

## 📂 Project Structure

```text
C:\Mainframe\project\
│
├── frontend/                   # React/Vite Frontend Application
│   ├── src/
│   │   ├── api/                # Axios API service layer (JWT interceptors)
│   │   ├── components/         # Reusable UI components (Sidebar, Navbar)
│   │   ├── context/            # Global state (AuthContext)
│   │   ├── layouts/            # Public and Protected routing layouts
│   │   ├── pages/              # App screens (Dashboard, Documents, Settings, etc.)
│   │   ├── index.css           # Tailwind v4 entry & custom component classes
│   │   └── main.jsx            # React entry point
│   ├── tailwind.config.js      # Tailwind theme configuration
│   └── package.json
│
├── main.py                     # FastAPI Application Entry & Endpoints
├── models.py                   # SQLAlchemy Database Models
├── schemas.py                  # Pydantic validation schemas
├── auth.py                     # JWT Authentication & Password Hashing
├── database.py                 # SQLite connection setup
└── uploads/                    # Secure local document storage directory
```

---

## 🚀 Installation and Setup

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)
* **Zowe CLI** configured and authenticated to your z/OS environment (User: `z73897`).

### 1. Backend Setup

Open a terminal and navigate to the project root:

```bash
cd c:\Mainframe\project

# Install required Python dependencies
pip install fastapi uvicorn sqlalchemy passlib python-jose[cryptography] python-multipart

# Start the FastAPI Server (runs on http://localhost:8000)
uvicorn main:app --reload
```

*Note: The SQLite database (`sqlite.db`) is automatically initialized, and a default admin user (`admin` / `admin123`) is seeded on the first run.*

### 2. Frontend Setup

Open a **new terminal window** and navigate to the frontend directory:

```bash
cd c:\Mainframe\project\frontend

# Install Node dependencies
npm install

# Start the Vite Development Server (runs on http://localhost:5173)
npm run dev
```

---

## 🔒 Authentication & Default Credentials

To access the application, navigate to `http://localhost:5173` and log in using the pre-configured admin account, or create a new user via the Sign Up page.

* **Username:** `admin`
* **Password:** `admin123`

---

## 🔌 API Architecture

The FastAPI backend runs on `http://localhost:8000` and provides the following primary routes:

### Authentication
* `POST /api/signup` - Register a new user.
* `POST /api/login` - Authenticate and receive a JWT.
* `GET /api/me` - Validate session and retrieve user profile.

### LifeVault Data
* `GET /api/documents` - Fetch all user documents.
* `POST /api/documents` - Upload a new document (Multipart Form).
* `GET /api/documents/{id}` - Fetch specific document details.
* `DELETE /api/documents/{id}` - Delete a document.
* `GET /api/warranties` - Fetch documents with associated warranty data.
* `GET /api/notifications` - Fetch user notifications.
* `GET /api/activity` - Fetch the user's activity audit log.
* `GET /api/search?q=` - Global search across documents.

### Mainframe Integration
* `POST /api/submit-transaction` - **[PROTECTED]** Takes `account_num` and `amount` and securely executes a Zowe CLI batch job on the z/OS mainframe.

---

## 🛡️ Mainframe & Zowe Integration Notes

The existing `POST /api/submit-transaction` endpoint is treated as a **Protected Service Layer**. It relies on your host machine's Zowe CLI configuration.

The backend automatically executes the following underlying command when a transaction is submitted:
```bash
zowe jobs submit data-set "Z72771.JCL(RPTGEN)" --view-all-spool-content
```
If you encounter timeout or connectivity errors, ensure that your Zowe CLI default profile is active, and the z/OS host is reachable from your network.
