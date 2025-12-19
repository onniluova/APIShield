import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": "localhost"
}

def get_db_connection():
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

@app.route('/')
def home():
    return "Backend is running on port 5000"

@app.route('/users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute('SELECT id, username, role FROM user;')
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

    query = ("SELECT password FROM users WHERE username = %s;", (u_name, ))
    result = cur.fetchone()

    cur.close()
    conn.close()

    if result:
        stored_hash = result[0]

        if check_password_hash(stored_hash, u_pass):
            return jsonify({"message": "Login succesfull"}), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

if __name__ == '__main__':
    app.run(debug=True)