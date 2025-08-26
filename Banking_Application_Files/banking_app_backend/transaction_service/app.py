from flask import Flask
from config import Config
from models import db
from routes import txn_bp
from flask_jwt_extended import JWTManager  # ✅ import

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ JWT Configuration
    if not app.config.get("JWT_SECRET_KEY"):
        app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Replace with a secure key
    if not app.config.get("JWT_TOKEN_LOCATION"):
        app.config["JWT_TOKEN_LOCATION"] = ["headers"]


     # further security config
    app.config["JWT_HEADER_TYPE"] = "Bearer"  


    # ✅ Initialize JWT
    jwt = JWTManager(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()

    app.register_blueprint(txn_bp, url_prefix="/transactions")
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5002, debug=True)
