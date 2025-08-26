import os

BASE_URL = os.environ.get("ACCOUNT_SERVICE_URL", "http://127.0.0.1:5001/accounts")

class Config:
    SQLALCHEMY_DATABASE_URI = "sqlite:///transactions.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("TRANSACTION_JWT_SECRET", "txn_jwt_secret")
    ACCOUNT_SERVICE_URL = BASE_URL
