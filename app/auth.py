import jwt
from datetime import datetime, timedelta, timezone
import os
import jwt
from functools import wraps
from flask import request, jsonify

SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret')
REFRESH_SECRET_KEY = os.getenv('REFRESH_SECRET_KEY')

def create_access_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.now(timezone.utc) + timedelta(minutes=30)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def create_refresh_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
        'type': 'refresh'
    }
    return jwt.encode(payload, REFRESH_SECRET_KEY, algorithm='HS256')

def tokenRequired(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']

            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'error': 'Token is missing'}), 401
            
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

            current_user = {
                "user_id": data["user_id"],
                "role": data['role'],
            }
        
        except Exception as e:
            return jsonify({'error': 'Token on viallinen tai vanhentunut'}), 401

        return f(current_user, *args, **kwargs)
    return decorated