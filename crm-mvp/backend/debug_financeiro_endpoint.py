import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000/api"

def check(url):
    print(f"Checking {url}...")
    try:
        with urllib.request.urlopen(f"{BASE_URL}{url}") as response:
            print(f"Status: {response.status}")
            data = json.loads(response.read().decode())
            print("Data sample keys:", list(data.keys()) if isinstance(data, dict) else "List length: " + str(len(data)))
    except urllib.error.HTTPError as e:
        print(f"Error {e.code}: {e.read().decode()}")
    except Exception as e:
        print(f"Exception: {e}")

def run():
    check("/financeiro/fluxo-caixa?meses=6")
    check("/financeiro")
    check("/clientes")

if __name__ == "__main__":
    run()
