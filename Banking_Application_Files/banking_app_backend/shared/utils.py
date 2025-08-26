def ok_resp(msg, data=None):
    payload = {"msg": msg}
    if data is not None:
        payload.update(data)
    return payload
