@echo off
setlocal
cd /d "%~dp0"
python --version
python -B editor\server.py --open
if errorlevel 1 pause
endlocal
