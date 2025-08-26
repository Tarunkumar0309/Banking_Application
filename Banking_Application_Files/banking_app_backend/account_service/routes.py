from flask import Blueprint, request, jsonify
from models import db, User, Account
from utils import hash_password, verify_password
from schemas import validate_register
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from sqlalchemy.exc import IntegrityError

auth_bp = Blueprint("auth_bp", __name__)
account_bp = Blueprint("account_bp", __name__)

# Auth routes
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    ok, err = validate_register(data)
    if not ok:
        return jsonify({"error": err}), 400
    hashed = hash_password(data["password"])
    user = User(
        username=data["username"],
        password=hashed,
        role=data.get("role", "USER"),
        name=data.get("name"),
        address=data.get("address"),
        phoneno=data.get("phoneno"),
        email=data.get("email")
    )
    db.session.add(user)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "username or email already exists"}), 400
    return jsonify({"msg": "user created", "user_id": user.user_id}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username"); password = data.get("password")
    if not username or not password:
        return jsonify({"error":"username and password required"}), 400
    user = User.query.filter_by(username=username).first()
    if not user or not verify_password(password, user.password):
        return jsonify({"error":"invalid credentials"}), 401
    additional_claims = {"role": user.role}
    token = create_access_token(identity=str(user.user_id), additional_claims=additional_claims)
    return jsonify({"access_token": token, "user_id": user.user_id, "role": user.role})


# Account routes
@account_bp.route("", methods=["POST"])
@jwt_required()
def open_account():
    identity = get_jwt_identity()
    new_acc = Account(user_id=identity, balance=request.json.get("initial_deposit", 0.0), status="ACTIVE")
    db.session.add(new_acc)
    db.session.commit()
    return jsonify({"msg":"account opened", "account_id": new_acc.account_id, "balance": new_acc.balance}), 201

@account_bp.route("/me", methods=["GET"])
@jwt_required()
def my_accounts():
    identity = get_jwt_identity()
    accounts = Account.query.filter_by(user_id=identity).all()
    return jsonify([{"account_id":a.account_id,"balance":a.balance,"status":a.status} for a in accounts])

@account_bp.route("", methods=["GET"])
@jwt_required()
def get_all_accounts():
    claims = get_jwt()
    if claims.get("role") != "ADMIN":
        return jsonify({"error":"admin only"}), 403
    accounts = Account.query.all()
    return jsonify([{"account_id":a.account_id,"user_id":a.user_id,"balance":a.balance,"status":a.status} for a in accounts])

@account_bp.route("/<int:acc_id>", methods=["DELETE"])
@jwt_required()
def close_account(acc_id):
    claims = get_jwt()
    if claims.get("role") != "ADMIN":
        return jsonify({"error":"admin only"}), 403
    acc = Account.query.get(acc_id)
    if not acc:
        return jsonify({"error":"account not found"}), 404
    acc.status = "CLOSED"
    db.session.commit()
    return jsonify({"msg":"account closed"})

# Public/internal endpoints used by Transaction Service:
@account_bp.route("/<int:acc_id>", methods=["GET"])
def check_account(acc_id):
    acc = Account.query.get(acc_id)
    if not acc:
        return jsonify({"error":"account not found"}), 404
    return jsonify({"account_id": acc.account_id, "user_id": acc.user_id, "balance": acc.balance, "status": acc.status})

@account_bp.route("/<int:acc_id>/balance", methods=["PATCH"])
def update_balance(acc_id):
    data = request.get_json() or {}
    if "balance" not in data:
        return jsonify({"error":"balance required"}), 400
    acc = Account.query.get(acc_id)
    if not acc:
        return jsonify({"error":"account not found"}), 404
    acc.balance = float(data["balance"])
    db.session.commit()
    return jsonify({"msg":"balance updated", "account_id":acc.account_id, "balance":acc.balance})
