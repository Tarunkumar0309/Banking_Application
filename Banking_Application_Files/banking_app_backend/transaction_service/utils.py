from config import Config
import requests

def get_account(account_id):
    url = f"{Config.ACCOUNT_SERVICE_URL}/{account_id}"
    r = requests.get(url, timeout=5)
    return r

def update_account_balance(account_id, new_balance):
    url = f"{Config.ACCOUNT_SERVICE_URL}/{account_id}/balance"
    r = requests.patch(url, json={"balance": new_balance}, timeout=5)
    return r
