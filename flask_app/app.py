from __future__ import annotations

import os
import json
from typing import Optional


def _get_port() -> int:
    try:
        return int(os.environ.get("PORT", "8000"))
    except ValueError:
        return 8000


def run_with_flask() -> bool:
    try:
        from flask import Flask, render_template
    except Exception:
        return False

    app = Flask(__name__)

    @app.get("/api/health")
    def health() -> tuple[dict[str, str], int]:
        return {"status": "ok"}, 200

    @app.get("/")
    def index() -> str:
        return render_template("index.html")

    port = _get_port()
    app.run(host="0.0.0.0", port=port)
    return True


def run_with_stdlib() -> None:
    from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
    from urllib.parse import urlparse
    from pathlib import Path

    project_root = Path(__file__).resolve().parent
    templates_dir = project_root / "templates"
    static_dir = project_root / "static"

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:  # noqa: N802 (BaseHTTPRequestHandler API)
            parsed = urlparse(self.path)
            if parsed.path == "/api/health":
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok"}).encode("utf-8"))
                return

            if parsed.path == "/" or parsed.path == "/index.html":
                index_file = templates_dir / "index.html"
                if index_file.exists():
                    content = index_file.read_bytes()
                    self.send_response(200)
                    self.send_header("Content-Type", "text/html; charset=utf-8")
                    self.send_header("Content-Length", str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                else:
                    self.send_error(404, "Index not found")
                return

            if parsed.path.startswith("/static/"):
                rel_path = parsed.path[len("/static/"):]
                file_path = (static_dir / rel_path).resolve()
                try:
                    if not str(file_path).startswith(str(static_dir.resolve())):
                        self.send_error(403, "Forbidden")
                        return
                    if not file_path.exists() or not file_path.is_file():
                        self.send_error(404, "Not Found")
                        return
                    content = file_path.read_bytes()
                    if file_path.suffix == ".css":
                        content_type = "text/css; charset=utf-8"
                    elif file_path.suffix == ".js":
                        content_type = "application/javascript; charset=utf-8"
                    elif file_path.suffix in {".png", ".jpg", ".jpeg", ".gif", ".svg"}:
                        # Very minimal mapping
                        content_type = {
                            ".png": "image/png",
                            ".jpg": "image/jpeg",
                            ".jpeg": "image/jpeg",
                            ".gif": "image/gif",
                            ".svg": "image/svg+xml",
                        }[file_path.suffix]
                    else:
                        content_type = "application/octet-stream"
                    self.send_response(200)
                    self.send_header("Content-Type", content_type)
                    self.send_header("Content-Length", str(len(content)))
                    self.end_headers()
                    self.wfile.write(content)
                except Exception:
                    self.send_error(500, "Internal Server Error")
                return

            self.send_error(404, "Not Found")

        def log_message(self, format: str, *args) -> None:  # noqa: A003
            # Reduce noise; could be redirected to a file if needed
            return

    port = _get_port()
    with ThreadingHTTPServer(("0.0.0.0", port), Handler) as httpd:
        httpd.serve_forever()


if __name__ == "__main__":
    if not run_with_flask():
        run_with_stdlib()