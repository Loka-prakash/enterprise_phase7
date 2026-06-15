# Mini Enterprise Collaboration Workflow - Backend

FastAPI backend for enterprise task and workflow management.

## Features

* JWT Authentication
* Role Based Access (Admin, Manager, Employee)
* Task Management
* Comments and Internal Notes
* Multi-Level Approvals
* Document Upload and Download
* Notifications
* Audit Logs
* Dashboard Analytics
* WebSocket Real-Time Updates
* SaaS Subscription Plans
* Razorpay Payment Integration

## Tech Stack

* FastAPI
* SQLAlchemy
* MySQL
* Alembic
* Redis
* Razorpay
* WebSockets

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/workflow_db

SECRET_KEY=your_secret_key
ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

FRONTEND_URL=http://localhost:5173

REDIS_URL=redis://localhost:6379/0

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 4. Run Database Migration

```bash
alembic upgrade head
```

### 5. Start Backend Server

```bash
uvicorn app.main:app --reload
```

Swagger API:

```text
http://127.0.0.1:8000/docs
```

## Main Modules

### Authentication

* Register
* Login
* Refresh Token
* Password Reset
* Google OAuth

### Tasks

* Create Task
* Update Task
* Assign Task
* Delete Task
* Status Tracking

### Approvals

* Create Approval Request
* Approve / Reject / Hold
* Approval History

### Documents

* Upload Documents
* Download Documents
* Version Tracking

### Notifications

* User Notifications
* Mark as Read

### Dashboard

* Analytics
* Task Summary
* AI Workflow Summary
* Smart Assignment

### SaaS & Payments

* Organizations
* Subscription Plans
* Credits
* Razorpay Payments

## Important APIs

```text
POST /auth/login
POST /auth/register

GET /tasks/
POST /tasks/

GET /approvals/
POST /approvals/

POST /documents/upload

GET /dashboard/analytics

POST /payments/create-payment
POST /payments/verify-razorpay
```

## Roles

### Admin

* Full Access

### Manager

* Manage Team Tasks
* Review Approvals
* Access Team Documents

### Employee

* Manage Assigned Tasks
* Create Approval Requests
* Upload Documents


