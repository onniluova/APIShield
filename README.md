# Vahti - Uptime Monitor

Vahti is a custom API monitoring tool designed to track endpoint availability and performance. Unlike basic uptime monitors, it includes a custom latency anomaly detection engine that flags endpoints performing significantly worse than their historical average.

This project was built to demonstrate a full production pipeline: from a Python backend developed on Arch Linux to a deployed cloud architecture using Render and Vercel.

## Live Demo

**URL:** https://vahti-web.vercel.app

> **Note:** The backend is hosted on Render's free tier. The server spins down after inactivity, so the first request may take 30-50 seconds to process.

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Axios.
* **Backend:** Python 3.11, Flask (MVC Architecture), Gunicorn.
* **Database:** PostgreSQL.
* **Security:** JWT Authentication, zxcvbn (password strength estimation), BCrypt hashing.
* **DevOps:** Render (Backend), Vercel (Frontend), Git.

<img width="1392" height="862" alt="image" src="https://github.com/user-attachments/assets/94da953c-7b07-4864-addf-47fe729fc9f5" />

# Architeture Diagram
![ArchitectureDiagram](https://github.com/user-attachments/assets/7619d905-2358-479e-b0be-d55930846c3c)

## Key Features

* **Secure Authentication:** JWT-based login and signup flow. Includes robust password strength enforcement using Dropbox's `zxcvbn` library to prevent weak credentials.
* **Endpoint Management:** Full CRUD operations for adding, monitoring, and deleting API targets.
* **Real-time Checks:** Manual trigger to verify status code and latency (ms) instantly.
* **Anomaly Detection:** Statistical analysis engine that compares the current request latency against the moving average of the last 10 checks. It flags performance degradation before the service goes offline.
* **Responsive UI:** Dashboard built with Tailwind CSS, fully responsive for desktop and mobile.

## Project Structure

The project is managed as a Mono-repo to streamline development.

```
/
├── run.py              # Application entry point
├── requirements.txt    # Python dependencies (pinned for Render)
├── /app                # Backend Core (MVC)
│   ├── /models         # Database Models (SQLAlchemy/Psycopg2)
│   ├── /routes         # API Blueprints (Auth, Endpoints, Checks)
│   └── /services       # Business Logic (Anomaly detection, Scheduler)
│
└── /frontend           # React Client
    ├── /src
    │   ├── /components # Reusable UI components
    │   ├── /pages      # Route views
    │   └── /services   # Axios API configurations
```

## Setup Instructions

### 1. Prerequisites

* Python 3.11 or newer
* Node.js & npm
* PostgreSQL (Local service or Docker)

### 2. Backend Setup

```
# Clone the repository
git clone [https://github.com/onniluova/Vahti.git](https://github.com/onniluova/Vahti.git)
cd Vahti

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the root directory with the following variables:

```
DB_NAME=vahti
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
SECRET_KEY=your_secret_key
```

Run the server:

```
python run.py
# Server runs at http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal session:

```
cd frontend
npm install
npm run dev
# Client runs at http://localhost:5173
```

## Database Schema

The project uses a relational schema with cascading deletes to ensure data integrity. Run the following SQL commands to initialize the tables:

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE endpoints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    name VARCHAR(100)
);

CREATE TABLE checks (
    id SERIAL PRIMARY KEY,
    endpoint_id INTEGER REFERENCES endpoints(id) ON DELETE CASCADE,
    status_code INTEGER,
    latency_ms INTEGER,
    is_up BOOLEAN,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Roadmap

* [x] Refactor backend to MVC structure.
* [x] Implement JWT Authentication & Password Strength Check.
* [x] Deploy to Production (Render/Vercel).
* [x] Implement APScheduler for background interval monitoring (1min/5min checks).
* [x] Visualize historical latency data with Recharts.
=======
# APIShield - Full Stack Uptime Monitor

This is a custom API monitoring tool I'm building. It's basically a lightweight alternative to things like Uptime Kuma or Postman, but with some custom features I wanted, like latency anomaly detection.

# DEMO LINK: [https://apishield-web.vercel.app]

The goal is to have a clean dashboard where I can track my API endpoints and get flagged if they start responding slower than usual.

## Tech Stack
* **Backend:** Python (Flask) using a proper MVC structure.
* **Frontend:** React + Vite and Tailwind CSS
* **Database:** PostgreSQL.
* **Site deployment:** Render (Backend) Vercel (Frontend)

## Features right now
* **User Auth:** Simple JWT-based login/signup to keep things secure.
* **Endpoint Management:** Add, view, and delete the URLs you want to track.
* **Manual Checks:** Hit an endpoint instantly to check its status code and latency.
* **Anomaly Detection:** Looks at the last 10 checks for an endpoint and flags it if the current latency is significantly slower (3x) than the average.
* **Modern UI:** Currently building out a responsive frontend with Tailwind.

<img width="986" height="656" alt="image" src="https://github.com/user-attachments/assets/6d254590-6c8c-4cd4-bc05-b88336889f78" />

<img width="1478" height="672" alt="image" src="https://github.com/user-attachments/assets/82beb5b6-267d-46dd-bb5d-e4a9fdc3daa5" />

---

## Project Structure
I'm running this as a Mono-repo so I can manage both backend and frontend easily.

```
/
├── run.py              # The entry point to start the Flask server
├── /app                # Backend logic (Refactored to MVC)
│   ├── /models         # SQL queries
│   ├── /routes         # API endpoints (Blueprints)
│   └── /services       # Heavy logic (like the anomaly math)
│
└── /frontend           # React side
    ├── /src
    │   ├── /components
    │   ├── /pages
    │   └── /services

```

---

## How to run it

### 1. Prerequisites

You need **Python 3**, **Node.js**, and **PostgreSQL** installed.

### 2. Backend Setup

First, get the Flask server running.

```
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

```

Create a `.env` file in the **root** folder with your DB credentials:

```
DB_NAME=your_db_name
DB_USER=postgres
DB_PASSWORD=password
SECRET_KEY=somesecretkey

```

Run it:

```
python run.py

```

It runs on `http://localhost:5000`.

### 3. Frontend Setup

Open a **new terminal tab** (leave the backend running) and go to the frontend folder.

```
cd frontend
npm install
npm run dev

```

The UI runs on `http://localhost:5173`.

---

## Database Setup

I haven't added migrations like Alembic yet, so you'll need to create these tables manually in Postgres for now:

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE endpoints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    url TEXT NOT NULL,
    name VARCHAR(100)
);

CREATE TABLE checks (
    id SERIAL PRIMARY KEY,
    endpoint_id INTEGER REFERENCES endpoints(id),
    status_code INTEGER,
    latency_ms INTEGER,
    is_up BOOLEAN,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

---

## API Routes

### Auth

* `POST /auth/register` - Create a new user.
* `POST /auth/login` - Get your JWT token.

### Endpoints

* `POST /endpoints/addEndpoint` - Save a URL to monitor.
* `POST /endpoints/runUrl` - Manually trigger a check for a saved endpoint.

### Analysis

* `POST /checks/latencyAnomalyCheck` - The math logic. Compares current latency vs the average of the last 10 checks.

---

## Roadmap / To-Do

* [x] Refactor backend to proper MVC structure
* [x] Initialize React Frontend + Tailwind
* [x] Connect Frontend to Backend (Axios + CORS).
* [ ] Build the Dashboard UI to visualize charts.
* [ ] Add a background scheduler (APScheduler) so I don't have to check URLs manually.
* [ ] Add JSON schema validation to ensure APIs aren't just "up" but returning correct data.

>>>>>>> Stashed changes
