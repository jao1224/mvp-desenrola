
import requests
import json

# Setup data
url = "http://127.0.0.1:8000/api/auth/login"
# We need an auth token first. Assuming we have a test user or can use the dev server's bypass if available.
# Actually, the quickest way is to inspect `app.core.security` to see if we can generate a token or mock auth, 
# but simply sending a request will tell us if it 404s or 401s. 401 means endpoint exists. 404 means route issue.

endpoint = "http://127.0.0.1:8000/api/contratos/preview"

try:
    print(f"Testing connectivity to {endpoint}...")
    # Sending empty body with NO auth should return 401 Unauthorized if endpoint exists
    resp = requests.post(endpoint, json={})
    print(f"Status Code: {resp.status_code}")
    print(f"Response: {resp.text}")
    
    if resp.status_code == 404:
        print("FAIL: Endpoint returning 404 Not Found. Router not registered correctly.")
    elif resp.status_code == 401:
        print("SUCCESS: Endpoint exists (returned 401 Unauthorized).")
    else:
        print(f"Unexpected status: {resp.status_code}")

except Exception as e:
    print(f"Connection Error: {e}")
