@echo off
setlocal
net session >nul 2>&1
if %errorlevel% neq 0 (
  echo Requesting administrator rights...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

netsh advfirewall firewall add rule name="Zadachnik 3101" dir=in action=allow protocol=TCP localport=3101 profile=private
echo.
echo Firewall rule is ready. You can close this window.
pause
