# Banking App Backend (2 microservices)

Services:
- account_service (port 5001)
- transaction_service (port 5002)
- api_gateway (optional stub, port 5000)

Requirements:
- Python 3.9+
- Use virtualenv for each service or a shared venv.

Setup & Run (example):
1. Install dependencies:
   - `pip install -r account_service/requirements.txt`
   - `pip install -r transaction_service/requirements.txt`

2. Run Account Service:
   - `cd account_service`
   - `python app.py`  (runs on 5001)

3. Run Transaction Service:
   - `cd ../transaction_service`
   - `python app.py`  (runs on 5002)

4. Optional API gateway:
   - `cd ../api_gateway`
   - `pip install -r requirements.txt`
   - `python app.py` (runs on 5000)

Testing (Postman):
- Register: POST http://127.0.0.1:5001/auth/register
- Login: POST http://127.0.0.1:5001/auth/login -> get access_token
- Open account: POST http://127.0.0.1:5001/accounts  (Authorization: Bearer <token>)
- Me accounts: GET http://127.0.0.1:5001/accounts/me (Bearer token)
- Deposit: POST http://127.0.0.1:5002/transactions/deposit (Bearer token)
- Withdraw, transfer, history follow the same pattern.

Notes:
- Internal account balance endpoints `/accounts/<id>` and `/accounts/<id>/balance` are intentionally left public for the Transaction Service to call.
- For production, secure service-to-service calls (mTLS/signed tokens).
