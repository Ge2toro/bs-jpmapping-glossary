@echo off
setlocal
cd /d "%~dp0"
if /I "%~1"=="--excel" (
    python -B make_dictionary.py
) else (
    python -B editor\publish.py
)
if errorlevel 1 pause
endlocal
