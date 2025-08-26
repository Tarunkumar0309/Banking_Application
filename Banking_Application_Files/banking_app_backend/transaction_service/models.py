from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Transaction(db.Model):
    __tablename__ = "transaction"
    transaction_id = db.Column(db.Integer, primary_key=True)
    account_id = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(20), nullable=False)  # DEPOSIT/WITHDRAW/TRANSFER
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="SUCCESS")
    meta = db.Column(db.String(255))  # optional notes like transfer to account
