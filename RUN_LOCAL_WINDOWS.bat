@echo off
echo ========================================
echo Workiffy Production Local Runner
echo ========================================
echo.

if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo Created .env from .env.example.
  echo Edit .env and verify MONGODB_URI and JWT_SECRET, then run this file again.
  pause
  exit /b 0
)

echo Installing dependencies...
call npm install
if errorlevel 1 (
  echo.
  echo npm install failed. Verify Node.js, internet access, and npm registry settings.
  pause
  exit /b 1
)

echo Running source checks...
call npm run check
if errorlevel 1 (
  echo Source validation failed.
  pause
  exit /b 1
)

echo.
echo Starting Workiffy on http://localhost:3000
echo Press Ctrl+C to stop.
call npm run dev
