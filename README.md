# APIShield - Uptime Monitor Backend

This is the backend for a custom API monitoring tool I'm building. It's basically a lightweight alternative to things like Uptime Kuma or Postman, but with some custom features like latency anomaly detection.

Built with Python (Flask) and PostgreSQL.

## Features right now
* **User Auth:** simple JWT-based login and signup.
* **Endpoint Management:** Save URLs you want to track.
* **Manual Checks:** Hit an endpoint to check status code and latency.
* **Anomaly Detection:** Checks the last 10 runs and flags if the current latency is significantly slower (3x) than average.

## How to run it

### 1. Prerequisites
You need Python and PostgreSQL installed.

### 2. Setup
Clone the repo and create a virtual environment:

```
bash
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 3. Environment Variables
Create a .env file in the root and add your DB details:
```
Ini, TOML

DB_NAME=your_db_name
DB_USER=postgres
DB_PASSWORD=password
SECRET_KEY=somesecretkey
```

### 4. Database Setup
You'll need to create the tables manually for now (I haven't added migrations yet, will add later).
```
users (id, username, password, role)

endpoints (id, user_id, url, name)

checks (id, endpoint_id, status_code, latency_ms, is_up, checked_at)
```

### 5. Run the server
Bash

python app.py

It runs on http://localhost:5000.
API Routes

### Auth

```
POST /create - Create a new user.

POST /login - Get your JWT token.
```

### Endpoints
```
POST /addEndpoint - Save a URL to monitor.

POST /runUrl - Manually trigger a check for a saved endpoint.
```

### Analysis

```
POST /latencyAnomalyCheck - compares current latency vs the average of the last 10 checks.
```

### Goals / To-Do

[ ] Add a background scheduler (APScheduler) so I don't have to check URLs manually.

[ ] Build a simple frontend dashboard.

[ ] Add JSON schema validation to ensure APIs aren't just "up" but returning correct data.

[ ] Clean up the database connection logic (maybe add connection pooling).

Note: This is still a WIP, so might break if the DB isn't set up exactly right.
