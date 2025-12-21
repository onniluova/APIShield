from flask import Blueprint, request, jsonify
from app.models.auth_model import AuthModel
from app.db_conn import get_db_connection
from app.auth import tokenRequired
from werkzeug.security import check_password_hash
from app.auth import createToken

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/users', methods=['GET'])
@tokenRequired
def get_users(current_user):
    try:
        users = AuthModel.get_users()

        return jsonify({
            "message": "Users fetched succesfully",
            "users": new_id,
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/register', methods=['POST'])
def def_createUser():
    data = request.get_json()

    u_name = data.get('username')
    u_pass = data.get('password')

    if not u_name or  not u_pass:
        return jsonify({"error": "Please enter valid credentials"}), 500

    try:
        new_id = AuthModel.create_user(u_name, u_pass)

        return jsonify({
            "message": "User created succesfully",
            "user_id": new_id,
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
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
                "role": role
            }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401