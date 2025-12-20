import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from auth import createToken
import requests
import time
from datetime import datetime, UTC
from auth import tokenRequired
from checks import checkForLatencyAnomaly
from db_conn import get_db_connection

load_dotenv()

app = Flask(__name__)

@app.route('/')
def home():
    return "Backend is running on port 5000"

@app.route('/users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute('SELECT id, username, role FROM users;')
        users = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify(users)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/create', methods=['POST'])
def def_createUser():
    data = request.get_json()

    u_name = data.get('username')
    u_pass = data.get('password')

    hashed_password = generate_password_hash(u_pass)

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        query = ("INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;")

        cur.execute(query, (u_name, hashed_password))

        new_id = cur.fetchone()[0]
        conn.commit()

        cur.close()
        conn.close()

        return jsonify({"message": "User Created"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    u_name = data.get('username')
    u_pass = data.get('password')

    conn = get_db_connection()
    cur = conn.cursor()

    query = ("SELECT id, password, role FROM users WHERE username = %s;")
    cur.execute(query, (u_name,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if user:
        user_id = user[0]
        stored_hash = user[1]
        role = user[2]

        if check_password_hash(stored_hash, u_pass):
            token = createToken(user_id, role)

            return jsonify({
                "message": "Login successful",
                "token": token,
            }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/addEndpoint', methods=['POST'])
@tokenRequired
def addEndpoint(current_user):
    data = request.get_json()

    url = data.get('url')
    name = data.get('name')

    user_id = current_user['user_id']

    if not user_id or not url:
        return jsonify({"error": "Missing user_id or url"}), 400

    try:

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT name, url FROM endpoints WHERE name=%s AND url=%s", (name, url,))
        existing = cur.fetchone()

        if existing:
            cur.close()
            conn.close()
            return jsonify({"error": "This endpoint already exists."}), 400

        query=("""
        INSERT INTO endpoints (user_id, url, name)
        VALUES (%s, %s, %s)
        RETURNING id;
        """)

        cur.execute(query, (user_id, url, name))

        check = cur.fetchone()[0]

        conn.commit()
        
        cur.close()
        conn.close()

        return jsonify({
            "message": "Endpoint created successfully",
            "check_id": check,
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/runUrl', methods=['POST'])
@tokenRequired
def runUrl(current_user):
    data = request.get_json()

    url = data.get('url')
    endpoint_id = data.get('endpoint_id')

    if not url or not endpoint_id:
        return jsonify({"error": "Missing url or endpoint_id"}), 400

    conn = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute('SELECT user_id, url FROM endpoints WHERE id = %s', (endpoint_id, ))
        row = cur.fetchone()

        token_user_id = current_user.get('user_id')

        if not row or row[0] != int(token_user_id):
            return jsonify({"error": "Unauthorized access"}), 403
        
        url = row[1]
        
        # calculating the metrics
        start_time = time.time()
        response = requests.get(url, timeout=10)
        end_time = time.time()
        latency_ms = int((end_time - start_time) * 1000)
        status_code = response.status_code
        is_up = 200 <= status_code < 400
        checked_at = datetime.now(UTC)

        query = ("""
        INSERT INTO checks (endpoint_id, status_code, latency_ms, is_up, checked_at)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """)
        cur.execute(query, (endpoint_id, status_code, latency_ms, is_up, checked_at))

        check_id = cur.fetchone()[0]
        conn.commit()

        cur.close()
        conn.close()
    
        return jsonify({
            "message": "Check successful",
            "check_id": check_id,
            "status": status_code
        }), 200

    except Exception as e:
        if conn: conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            cur.close()
            conn.close()

@app.route('/latencyAnomalyCheck', methods=['POST'])
@tokenRequired
def runAnomalyCheck(current_user):
    return checkForLatencyAnomaly(current_user)

if __name__ == '__main__':
    app.run(debug=True)