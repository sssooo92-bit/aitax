@echo off
setlocal

REM Windows-friendly demo launcher for ai세금
REM - Installs dependencies if needed
REM - Starts demo (build -> start) and opens browser automatically

echo.
echo [ai세금] 데모 실행을 시작합니다...
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js가 설치되어 있지 않습니다.
  echo https://nodejs.org 에서 LTS를 설치한 뒤 다시 실행해 주세요.
  exit /b 1
)

call npm install
if errorlevel 1 exit /b 1

call npm run demo
endlocal

