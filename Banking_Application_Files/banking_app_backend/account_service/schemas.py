# Simple input schemas (not using marshmallow to keep dependencies light)
def validate_register(data):
    required = ["username", "password"]
    for r in required:
        if r not in data or not data[r]:
            return False, f"{r} required"
    return True, None
