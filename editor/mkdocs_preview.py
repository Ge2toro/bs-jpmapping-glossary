"""Manage only the loopback MkDocs process started by this editor."""
import importlib.util
import os
from pathlib import Path
import shutil
import socket
import subprocess
import sys
import threading
import time
import urllib.request


class MkDocsPreview:
    def __init__(self, root):
        self.root = Path(root).resolve()
        self.process = None
        self.url = None
        self.lock = threading.Lock()

    def start(self):
        with self.lock:
            if self.process is not None and self.process.poll() is None:
                return self.url
            python = os.environ.get('GLOSSARY_MKDOCS_PYTHON')
            if not python and importlib.util.find_spec('mkdocs'):
                python = sys.executable
            if not python:
                command = shutil.which('mkdocs')
                candidate = Path(command).parent.parent / 'python.exe' if command else None
                if candidate and candidate.is_file():
                    python = str(candidate)
            if not python:
                raise ValueError('MkDocsが見つかりません。mkdocs-material と mkdocs-glightbox を入れたPythonでエディターを起動してください。GLOSSARY_MKDOCS_PYTHONでも指定できます。')
            with socket.socket() as listener:
                listener.bind(('127.0.0.1', 0))
                port = listener.getsockname()[1]
            self.url = 'http://127.0.0.1:' + str(port) + '/'
            log = self.root / 'data/mkdocs-preview.log'
            environment = dict(os.environ, PYTHONIOENCODING='utf-8', PYTHONDONTWRITEBYTECODE='1')
            with log.open('wb') as output:
                self.process = subprocess.Popen([python, '-B', '-m', 'mkdocs', 'serve', '--dev-addr', '127.0.0.1:' + str(port), '--config-file', str(self.root.parent / 'mkdocs.yml')], cwd=str(self.root.parent), env=environment, stdin=subprocess.DEVNULL, stdout=output, stderr=subprocess.STDOUT, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
            deadline = time.monotonic() + 30
            while time.monotonic() < deadline:
                if self.process.poll() is not None:
                    break
                try:
                    with urllib.request.urlopen(self.url, timeout=.5) as response:
                        if response.status == 200:
                            return self.url
                except OSError:
                    pass
                threading.Event().wait(.2)
            self.stop()
            detail = log.read_text(encoding='utf-8', errors='replace')[-3500:]
            raise ValueError('MkDocsの起動に失敗しました。\n' + detail)

    def stop(self):
        if self.process is not None and self.process.poll() is None:
            self.process.terminate()
            try:
                self.process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=5)
