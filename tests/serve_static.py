"""Local read-only HTTP server with byte ranges for browser audio-clock tests."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import re
from threading import Thread
ROOT = Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, *args):
        pass
    def do_GET(self):
        path = Path(self.translate_path(self.path))
        match = re.fullmatch(r'bytes=(\d+)-(\d*)', self.headers.get('Range', ''))
        if match and path.is_file():
            data = path.read_bytes()
            start = int(match[1])
            end = min(int(match[2]) if match[2] else len(data)-1, len(data)-1)
            if start > end:
                self.send_error(416)
                return
            self.send_response(206)
            self.send_header('Content-type', self.guess_type(str(path)))
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {start}-{end}/{len(data)}')
            self.send_header('Content-Length', str(end-start+1))
            self.end_headers()
            self.wfile.write(data[start:end+1])
            return
        super().do_GET()
def start_server():
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    Thread(target=server.serve_forever, daemon=True).start()
    return server, f'http://127.0.0.1:{server.server_port}/'
