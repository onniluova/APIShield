from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization"])
    
    from app.routes.auth_routes import auth_bp
    from app.routes.endpoint_routes import endpoints_bp
    from app.routes.checks_routes import checks_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(endpoints_bp)
    app.register_blueprint(checks_bp)
    
    return app