from flask import Flask, jsonify
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    @app.route("/")
    def index():
        return jsonify({
            "msg": "API Gateway (dev stub). Start account_service and transaction_service separately.",
            "account_service": app.config.get("ACCOUNT_SERVICE_URL"),
            "transaction_service": app.config.get("TRANSACTION_SERVICE_URL")
        })

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000, debug=True)
