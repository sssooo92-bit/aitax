# Windows-friendly demo launcher for ai세금
# Usage (PowerShell):
#   .\run-demo.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "[ai세금] 데모 실행을 시작합니다..."
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js가 설치되어 있지 않습니다."
  Write-Host "https://nodejs.org 에서 LTS를 설치한 뒤 다시 실행해 주세요."
  exit 1
}

npm install
npm run demo

