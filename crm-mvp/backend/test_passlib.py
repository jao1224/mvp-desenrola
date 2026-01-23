from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    print("Hashing '123'...")
    h = pwd_context.hash("123")
    print(f"Hash: {h}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
