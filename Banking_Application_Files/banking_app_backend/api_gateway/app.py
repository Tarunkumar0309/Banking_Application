from flask import Flask, request, jsonify
from flask_cors import CORS   # ✅ Import
from config import Config
import requests

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Enable CORS (allow frontend calls)
    CORS(app, resources={r"/*": {"origins": "*"}})

    ACCOUNT_URL = app.config["ACCOUNT_SERVICE_URL"]
    TXN_URL = app.config["TRANSACTION_SERVICE_URL"]
    AUTH_URL = ACCOUNT_URL.replace('/accounts', '/auth')

    # Health check
    @app.route("/")
    def index():
        return jsonify({
            "msg": "API Gateway running",
            "account_service": ACCOUNT_URL,
            "transaction_service": TXN_URL
        })

    # ------------------ ACCOUNT SERVICE PROXY ------------------
    @app.route("/auth", methods=["GET", "POST", "PATCH", "DELETE"])
    def auth_proxy_root():
        url = f"{AUTH_URL}"
        try:
            resp = requests.request(
                method=request.method,
                url=url,
                headers={key: value for key, value in request.headers if key != "Host"},
                params=request.args,
                json=request.get_json(silent=True),
                timeout=5
            )
            return (resp.content, resp.status_code, resp.headers.items())
        except requests.RequestException as e:
            return jsonify({"error": f"Account Auth unavailable: {str(e)}"}), 503

    @app.route("/auth/<path:path>", methods=["GET", "POST", "PATCH", "DELETE"])
    def auth_proxy(path):
        url = f"{AUTH_URL}/{path}"
        try:
            resp = requests.request(
                method=request.method,
                url=url,
                headers={key: value for key, value in request.headers if key != "Host"},
                params=request.args,
                json=request.get_json(silent=True),
                timeout=5
            )
            return (resp.content, resp.status_code, resp.headers.items())
        except requests.RequestException as e:
            return jsonify({"error": f"Account Auth unavailable: {str(e)}"}), 503
    @app.route("/accounts", methods=["GET", "POST", "PATCH", "DELETE"])
    def accounts_proxy_root():
        url = f"{ACCOUNT_URL}"
        try:
            resp = requests.request(
                method=request.method,
                url=url,
                headers={key: value for key, value in request.headers if key != "Host"},
                params=request.args,
                json=request.get_json(silent=True),
                timeout=5
            )
            return (resp.content, resp.status_code, resp.headers.items())
        except requests.RequestException as e:
            return jsonify({"error": f"Account Service unavailable: {str(e)}"}), 503

    @app.route("/accounts/<path:path>", methods=["GET", "POST", "PATCH", "DELETE"])
    def accounts_proxy(path):
        url = f"{ACCOUNT_URL}/{path}"
        try:
            resp = requests.request(
                method=request.method,
                url=url,
                headers={key: value for key, value in request.headers if key != "Host"},
                params=request.args,
                json=request.get_json(silent=True),
                timeout=5
            )
            return (resp.content, resp.status_code, resp.headers.items())
        except requests.RequestException as e:
            return jsonify({"error": f"Account Service unavailable: {str(e)}"}), 503

    # ------------------ TRANSACTION SERVICE PROXY ------------------
    @app.route("/transactions", methods=["GET", "POST", "PATCH", "DELETE"])
    def txn_proxy_root():
        url = f"{TXN_URL}"
        try:
            resp = requests.request(
                method=request.method,
                url=url,
                headers={key: value for key, value in request.headers if key != "Host"},
                params=request.args,
                json=request.get_json(silent=True),
                timeout=5
            )
            return (resp.content, resp.status_code, resp.headers.items())
        except requests.RequestException as e:
            return jsonify({"error": f"Transaction Service unavailable: {str(e)}"}), 503

    @app.route("/transactions/<path:path>", methods=["GET", "POST", "PATCH", "DELETE"])
    def txn_proxy(path):
        url = f"{TXN_URL}/{path}"
        try:
            resp = requests.request(
                method=request.method,
                url=url,
                headers={key: value for key, value in request.headers if key != "Host"},
                params=request.args,
                json=request.get_json(silent=True),
                timeout=5
            )
            return (resp.content, resp.status_code, resp.headers.items())
        except requests.RequestException as e:
            return jsonify({"error": f"Transaction Service unavailable: {str(e)}"}), 503

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5000, debug=True)
