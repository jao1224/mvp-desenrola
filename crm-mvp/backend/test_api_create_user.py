import requests

def test_flow():
    base_url = "http://localhost:8000/api/auth"
    
    # 1. Login
    print("Logging in as Admin...")
    resp = requests.post(f"{base_url}/login", json={"email": "admin@admin.com", "password": "admin"})
    if resp.status_code != 200:
        print(f"Login Failed: {resp.status_code} - {resp.text}")
        return
        
    token = resp.json()["access_token"]
    print("Login Success. Token received.")
    
    # 2. Create User
    print("Creating New User...")
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "name": "API Test User",
        "email": "apitest@demo.com",
        "password": "password123",
        "role": "colaborador"
    }
    
    resp = requests.post(f"{base_url}/users", json=payload, headers=headers)
    print(f"Create User Status: {resp.status_code}")
    print(f"Response Body: {resp.text}")

if __name__ == "__main__":
    test_flow()
