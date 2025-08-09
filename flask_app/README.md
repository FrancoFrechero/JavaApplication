# Flask App

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -r requirements.txt
python app.py
```

App will be available at http://127.0.0.1:8000

Health check: http://127.0.0.1:8000/api/health