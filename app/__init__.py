from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from flask import jsonify
from app.db_conn import init_db_pool

load_dotenv()


def create_app():
    app = Flask(__name__)

    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://vahti-web.vercel.app",
        "https://apishield.vercel.app"
    ]

    CORS(app, 
         resources={r"/*": {"origins": allowed_origins}}, 
         supports_credentials=True, 
         allow_headers=["Content-Type", "Authorization"]
    )

    with app.app_context():
        init_db_pool()
    
    from app.routes.auth_routes import auth_bp
    from app.routes.endpoint_routes import endpoints_bp
    from app.routes.checks_routes import checks_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(endpoints_bp)
    app.register_blueprint(checks_bp)

    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "alive", "message": "server health: ok"}), 200
    
    return app