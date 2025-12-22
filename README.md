# APIShield - Full Stack Uptime Monitor

This is a custom API monitoring tool I'm building. It's basically a lightweight alternative to things like Uptime Kuma or Postman, but with some custom features I wanted, like latency anomaly detection.

# DEMO LINK: [https://apishield-web.vercel.app]

The goal is to have a clean dashboard where I can track my API endpoints and get flagged if they start responding slower than usual.

## Tech Stack
* **Backend:** Python (Flask) using a proper MVC structure.
* **Frontend:** React + Vite and Tailwind CSS
* **Database:** PostgreSQL.

## Features right now
* **User Auth:** Simple JWT-based login/signup to keep things secure.
* **Endpoint Management:** Add, view, and delete the URLs you want to track.
* **Manual Checks:** Hit an endpoint instantly to check its status code and latency.
* **Anomaly Detection:** Looks at the last 10 checks for an endpoint and flags it if the current latency is significantly slower (3x) than the average.
* **Modern UI:** Currently building out a responsive frontend with Tailwind.

<img width="986" height="656" alt="image" src="https://github.com/user-attachments/assets/6d254590-6c8c-4cd4-bc05-b88336889f78" />

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
