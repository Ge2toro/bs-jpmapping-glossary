@echo off
cd /d "%~dp0"
python make_dictionary.py
if %errorlevel% neq 0 (
    echo ！？
    pause
)
exit