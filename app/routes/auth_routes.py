from flask import Blueprint, request, jsonify
from app.models.auth_model import AuthModel
from app.db_conn import get_db_connection
from app.auth import tokenRequired
from werkzeug.security import check_password_hash
from app.auth import createToken
from zxcvbn import zxcvbn
import os
import requests

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/user', methods=['GET'])
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

@auth_bp.route('/auth/register', methods=['POST'])
def def_createUser():
    data = request.get_json()

    u_name = data.get('username')
    u_pass = data.get('password')      

    if not u_name or  not u_pass:
        return jsonify({"error": "Please enter valid credentials"}), 500

    results = zxcvbn(u_pass)

    if results["score"] < 3:
        feedback = results["feedback"]

        return jsonify({"error": feedback}), 400

    try:
        new_id = AuthModel.create_user(u_name, u_pass)

        return jsonify({
            "message": "User created succesfully",
            "user_id": new_id,
        }), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    u_name = data.get('username')
    u_pass = data.get('password')

    user = AuthModel.login(u_name, u_pass)

    if user:
        user_id = user[0]
        stored_hash = user[1]
        role = user[2]
        settings = user[3]

        if check_password_hash(stored_hash, u_pass):
            token = createToken(user_id, role)

            return jsonify({
                "message": "Login successful",
                "token": token,
                "role": role,
                "user_id": user_id,
                'settings': settings
            }), 200
    
    return jsonify({"error": "Invalid username or password"}), 401

@auth_bp.route('/auth/<int:id>/delete', methods=['DELETE'])
@tokenRequired
def delete(current_user, id):
    
    if int(id) != int(current_user["user_id"]):
        return jsonify({"error": "Unauthorized deletion"}), 403

    deleted_user = AuthModel.delete_user(id)

    return jsonify({
        "message": "Delete succesful",
        "user": deleted_user
    }), 200

@auth_bp.route('/auth/settings', methods=['PUT'])
@tokenRequired
def update_settings(current_user):
    new_settings = request.get_json()

    if not new_settings:
        return jsonify({"error": "No settings data provided"}), 400

    try:
        updated_settings = AuthModel.update_user_settings(current_user['user_id'], new_settings) 

        return jsonify({
            "message": "Settings updated successfully",
            "settings": updated_settings
        }), 200
    except Exception as e:
        print(f"Settings update failed: {e}")
        return jsonify({"error": "Failed to update settings"}), 500

@auth_bp.route('/auth/google', methods=['POST'])
def google_login():
    data = request.get_json()
    access_token = data.get('token')

    if not access_token:
        return jsonify({"error": "Missing token"}), 400

    try:
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        
        if google_response.status_code != 200:
             return jsonify({"error": "Invalid Google Token"}), 401
             
        user_info = google_response.json()

        google_id = user_info['sub']
        email = user_info.get('email')
        name = user_info.get('name')

        user = AuthModel.get_or_create_google_user(google_id, email, name)

        app_token = createToken(user['id'], user['role'])

        return jsonify({
            "message": "Login successful",
            "token": app_token,
            "role": user['role'],
            "user_id": user['id'],
            "username": user['username'],
            "settings": user.get('settings', {})
        }), 200

    except Exception as e:
        print(f"Google Login Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500