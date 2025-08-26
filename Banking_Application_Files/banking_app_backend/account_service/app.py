from flask import Flask
from config import Config
from models import db
from routes import auth_bp, account_bp
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    
    # Load default config
    app.config.from_object(Config)

    # --- JWT Config Fix ---
    # Make sure JWT knows where to look for the token
    if not app.config.get("JWT_SECRET_KEY"):
        app.config["JWT_SECRET_KEY"] = "your-secret-key"  # secret for JWT encoding
    if not app.config.get("JWT_TOKEN_LOCATION"):
        app.config["JWT_TOKEN_LOCATION"] = ["headers"]    # look for token in headers

    # Initialize extensions with this app
    db.init_app(app)
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(account_bp, url_prefix="/accounts")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5001, debug=True)
