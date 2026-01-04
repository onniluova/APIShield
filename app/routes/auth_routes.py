from flask import Blueprint, request, jsonify, make_response
from app.models.auth_model import AuthModel
from app.db_conn import get_db_connection
from app.auth import tokenRequired
from werkzeug.security import check_password_hash
from app.auth import create_access_token
from zxcvbn import zxcvbn
import os
import requests
from app.auth import tokenRequired, create_access_token, create_refresh_token 
import jwt

auth_bp = Blueprint('auth', __name__)

is_prod = os.getenv('FLASK_ENV') == 'production'

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
            access_token = create_access_token(user_id, role)
            refresh_token = create_refresh_token(user_id)

            AuthModel.save_refresh_token(user_id, refresh_token)

            response = make_response(jsonify({
                "message": "Login successful",
                "accessToken": access_token,
                "role": role,
                "user_id": user_id,
                'settings': settings
            }))

            response.set_cookie(
                'refreshToken', 
                refresh_token, 
                httponly=True,
                secure=is_prod,
                samesite='None' if is_prod else 'Lax',
                max_age=7 * 24 * 60 * 60 
            )

            return response, 200
    
    return jsonify({"error": "Invalid username or password"}), 401

@auth_bp.route('/auth/refresh', methods=['POST'])
def refresh_token():
    refresh_token = request.cookies.get('refreshToken')

    if not refresh_token:
        return jsonify({"error": "Refresh token missing"}), 401

    try:
        payload = jwt.decode(refresh_token, os.getenv('REFRESH_SECRET_KEY', os.getenv('SECRET_KEY')), algorithms=['HS256'])
        user_id = payload['user_id']

        stored_token = AuthModel.get_stored_refresh_token(user_id)
        if stored_token != refresh_token:
            return jsonify({"error": "Invalid refresh token"}), 401

        role = "user"

        new_access_token = create_access_token(user_id, role)

        return jsonify({
            "accessToken": new_access_token
        }), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    refresh_token = request.cookies.get('refreshToken')
    
    if refresh_token:
        try:
            secret = os.getenv('REFRESH_SECRET_KEY', 'dev-refresh-secret')
            payload = jwt.decode(refresh_token, secret, algorithms=['HS256'])
            
            user_id = payload.get('user_id')
            if user_id:
                AuthModel.clear_refresh_token(user_id)
                print(f"Token cleared for user {user_id}")
        except Exception as e:
            print(f"Logout error: {e}")
            pass

    response = make_response(jsonify({"message": "Logged out successfully"}))
    
    response.set_cookie('refreshToken', '', expires=0, httponly=True, samesite='None' if is_prod else 'Lax', secure=is_prod)
    return response, 200

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

        access_token = create_access_token(user['id'], user['role'])
        refresh_token = create_refresh_token(user['id'])
        
        AuthModel.save_refresh_token(user['id'], refresh_token)

        response = make_response(jsonify({
            "message": "Login successful",
            "accessToken": access_token,
            "role": user['role'],
            "user_id": user['id'],
            "username": user['username'],
            "settings": user.get('settings', {})
        }))

        response.set_cookie(
            'refreshToken', 
            refresh_token, 
            httponly=True, 
            secure=is_prod,
            samesite='None' if is_prod else 'Lax',
            max_age=7 * 24 * 60 * 60
        )
        return response, 200

    except Exception as e:
        print(f"Google Login Error: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500