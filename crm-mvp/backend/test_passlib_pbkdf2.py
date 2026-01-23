from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

try:
    print("Hashing '123' with pbkdf2_sha256...")
    h = pwd_context.hash("123")
    print(f"Hash: {h}")
    print("Verify:", pwd_context.verify("123", h))
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
