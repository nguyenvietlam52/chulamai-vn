@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Tool don danh ba Zalo
where node >nul 2>nul
if errorlevel 1 (
  echo Dang cai Node.js...
  winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
  echo.
  echo DA CAI XONG NODE. Hay DONG cua so nay va bam dup CHAY-TOOL.bat lan nua.
  pause
  exit /b
)
where openzca >nul 2>nul
if errorlevel 1 (
  echo Dang cai openzca...
  call npm i -g openzca
)
call openzca --profile default auth status >nul 2>nul
if errorlevel 1 (
  echo Dang nhap Zalo: quet ma QR bang dien thoai.
  start "" cmd /c "for /l %%i in (1,1,20) do (if exist qr.png (start qr.png & exit) else timeout /t 2 >nul)"
  call openzca --profile default auth login
)
call openzca --profile default auth status >nul 2>nul
if errorlevel 1 (
  echo Chua dang nhap Zalo duoc. Chay lai file nay va quet QR.
  pause
  exit /b
)
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :23388 ^| findstr LISTENING') do taskkill /f /pid %%p >nul 2>nul
set ZALO_PROFILE=default
start "" http://127.0.0.1:23388
node server.mjs
pause
