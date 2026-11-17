@echo off
set ZALO_PROFILE=%1
if "%ZALO_PROFILE%"=="" set ZALO_PROFILE=default
node server.mjs
