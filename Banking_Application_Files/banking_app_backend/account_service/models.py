from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # hashed
    role = db.Column(db.String(10), default="USER")  # USER / ADMIN
    name = db.Column(db.String(120))
    address = db.Column(db.String(250))
    phoneno = db.Column(db.String(30))
    email = db.Column(db.String(120), unique=True)

class Account(db.Model):
    __tablename__ = "account"
    account_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    balance = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default="ACTIVE")  # ACTIVE / CLOSED / PENDING
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
