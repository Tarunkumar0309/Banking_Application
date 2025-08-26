from flask import Blueprint, request, jsonify
from models import db, Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from utils import get_account, update_account_balance
from config import Config

txn_bp = Blueprint("txn_bp", __name__)

@txn_bp.route("/deposit", methods=["POST"])
@jwt_required()
def deposit():
    data = request.get_json() or {}
    account_id = data.get("account_id"); amount = float(data.get("amount", 0))
    if amount <= 0:
        return jsonify({"error":"invalid amount"}), 400

    # get account
    r = get_account(account_id)
    if r.status_code != 200:
        return jsonify({"error":"account not found"}), 404
    acc = r.json()
    if acc.get("status") != "ACTIVE":
        return jsonify({"error":"account not active"}), 400

    new_balance = float(acc["balance"]) + amount
    r2 = update_account_balance(account_id, new_balance)
    if r2.status_code != 200:
        # create failed txn
        txn = Transaction(account_id=account_id, type="DEPOSIT", amount=amount, status="FAILED")
        db.session.add(txn); db.session.commit()
        return jsonify({"error":"failed to update balance"}), 500

    txn = Transaction(account_id=account_id, type="DEPOSIT", amount=amount, status="SUCCESS")
    db.session.add(txn); db.session.commit()
    return jsonify({"msg":"deposit successful","new_balance":new_balance, "transaction_id": txn.transaction_id})

@txn_bp.route("/withdraw", methods=["POST"])
@jwt_required()
def withdraw():
    data = request.get_json() or {}
    account_id = data.get("account_id"); amount = float(data.get("amount", 0))
    if amount <= 0:
        return jsonify({"error":"invalid amount"}), 400

    r = get_account(account_id)
    if r.status_code != 200:
        return jsonify({"error":"account not found"}), 404
    acc = r.json()
    if float(acc["balance"]) < amount:
        txn = Transaction(account_id=account_id, type="WITHDRAW", amount=amount, status="FAILED")
        db.session.add(txn); db.session.commit()
        return jsonify({"error":"insufficient funds"}), 400

    new_balance = float(acc["balance"]) - amount
    r2 = update_account_balance(account_id, new_balance)
    if r2.status_code != 200:
        txn = Transaction(account_id=account_id, type="WITHDRAW", amount=amount, status="FAILED")
        db.session.add(txn); db.session.commit()
        return jsonify({"error":"failed to update balance"}), 500

    txn = Transaction(account_id=account_id, type="WITHDRAW", amount=amount, status="SUCCESS")
    db.session.add(txn); db.session.commit()
    return jsonify({"msg":"withdraw successful","new_balance":new_balance, "transaction_id": txn.transaction_id})

@txn_bp.route("/transfer", methods=["POST"])
@jwt_required()
def transfer():
    data = request.get_json() or {}
    from_account = data.get("from_account"); to_account = data.get("to_account")
    amount = float(data.get("amount", 0))
    if amount <= 0:
        return jsonify({"error":"invalid amount"}), 400
    # check source
    r_from = get_account(from_account)
    if r_from.status_code != 200:
        return jsonify({"error":"source account not found"}), 404
    src = r_from.json()
    if float(src["balance"]) < amount:
        txn = Transaction(account_id=from_account, type="TRANSFER", amount=amount, status="FAILED", meta=f"to:{to_account}")
        db.session.add(txn); db.session.commit()
        return jsonify({"error":"insufficient funds in source"}), 400

    r_to = get_account(to_account)
    if r_to.status_code != 200:
        return jsonify({"error":"destination account not found"}), 404
    dst = r_to.json()

    # update balances
    ok1 = update_account_balance(from_account, float(src["balance"]) - amount)
    ok2 = update_account_balance(to_account, float(dst["balance"]) + amount)

    status = "SUCCESS" if ok1.status_code == 200 and ok2.status_code == 200 else "FAILED"
    txn = Transaction(account_id=from_account, type="TRANSFER", amount=amount, status=status, meta=f"to:{to_account}")
    db.session.add(txn); db.session.commit()

    if status != "SUCCESS":
        return jsonify({"error":"transfer failed during balance update"}), 500
    return jsonify({"msg":"transfer successful", "transaction_id": txn.transaction_id})

@txn_bp.route("/<int:account_id>", methods=["GET"])
@jwt_required()
def history(account_id):
    # user can only fetch own account txns — identity check is required if user association exists
    txns = Transaction.query.filter_by(account_id=account_id).order_by(Transaction.timestamp.desc()).all()
    return jsonify([{"transaction_id":t.transaction_id, "type": t.type, "amount": t.amount, "timestamp": t.timestamp.isoformat(), "status": t.status, "meta": t.meta} for t in txns])

@txn_bp.route("", methods=["GET"])
@jwt_required()
def all_txns():
    claims = get_jwt()
    if claims.get("role") != "ADMIN":
        return jsonify({"error":"admin only"}), 403
    txns = Transaction.query.order_by(Transaction.timestamp.desc()).all()
    return jsonify([{"transaction_id":t.transaction_id,"account_id":t.account_id,"type":t.type,"amount":t.amount,"status":t.status} for t in txns])
