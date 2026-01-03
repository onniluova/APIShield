<img width="1024" height="434" alt="unnamed2-Photoroom" src="https://github.com/user-attachments/assets/dc7c038a-71cd-43cf-9296-25ad35064d78" />

Vahti is a custom API monitoring tool designed to track endpoint availability and performance. Unlike basic uptime monitors, it includes a custom latency anomaly detection engine that flags endpoints performing significantly worse than their historical average.

This project was built to demonstrate a full production pipeline: from a Python backend developed on Arch Linux to a deployed cloud architecture using Render and Vercel.

## Live Demo

# **URL:** https://vahti-web.vercel.app

> **Note:** The backend is hosted on Render's free tier. The server spins down after inactivity, so the first request may take 30-50 seconds to process.

## Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Axios.
* **Backend:** Python 3.11, Flask (MVC Architecture), Gunicorn.
* **Database:** PostgreSQL.
* **Security:** JWT Authentication, zxcvbn (password strength estimation), BCrypt hashing.
* **DevOps:** Render (Backend), Vercel (Frontend), Git.

<img width="1392" height="862" alt="image" src="https://github.com/user-attachments/assets/94da953c-7b07-4864-addf-47fe729fc9f5" />

## Architeture Diagram
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

## Database Schema

<img width="500" height="210" alt="image" src="https://github.com/user-attachments/assets/b1276e4a-e6ea-441f-a402-06cb6b268608" />

## Roadmap

* [x] Refactor backend to MVC structure.
* [x] Implement JWT Authentication & Password Strength Check.
* [x] Deploy to Production (Render/Vercel).
* [x] Implement APScheduler for background interval monitoring (1min/5min checks).
* [x] Visualize historical latency data with Recharts.
* [x] Add timeline selection to charts.
* [ ] Implement settings menu.
* [ ] Implement profile page.
* [ ] Administration tools for user and endpoint monitoring.





