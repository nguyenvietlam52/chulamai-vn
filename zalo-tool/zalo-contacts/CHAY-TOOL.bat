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
if not exist "%USERPROFILE%\.openzca\profiles\default" (
  echo Dang nhap Zalo: quet ma QR bang dien thoai.
  call openzca --profile default auth login
)
set ZALO_PROFILE=default
start "" http://127.0.0.1:23388
node server.mjs
pause
