@echo off
REM AgroAssist Docker Setup Script for Windows
REM This script helps you set up and run the AgroAssist project with Docker

title AgroAssist Docker Setup

echo ================================================
echo    AgroAssist Docker Setup Script (Windows)
echo ================================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed
    echo Please install Docker Desktop from https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed
    echo Please install Docker Desktop which includes Docker Compose
    pause
    exit /b 1
)

echo [OK] Docker and Docker Compose are installed
echo.

:menu
echo Select an option:
echo 1. Build and start all services
echo 2. Start services (without rebuilding)
echo 3. Stop all services
echo 4. View logs
echo 5. Clean up (remove containers and volumes)
echo 6. Check service health
echo 7. Setup production environment
echo 8. Exit
echo.

set /p choice="Enter your choice: "
echo.

if "%choice%"=="1" goto build_start
if "%choice%"=="2" goto start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto cleanup
if "%choice%"=="6" goto health
if "%choice%"=="7" goto production
if "%choice%"=="8" goto end

echo Invalid choice. Please try again.
echo.
pause
goto menu

:build_start
echo Building and starting all services...
docker-compose up -d --build
echo.
echo [OK] All services are starting
echo.
echo Access the application at:
echo   - Frontend: http://localhost
echo   - Backend API: http://localhost:3000
echo   - Crop Recommendation: http://localhost:5000
echo   - Disease Detection: http://localhost:8000
echo.
pause
goto menu

:start
echo Starting all services...
docker-compose up -d
echo.
echo [OK] All services started
echo.
pause
goto menu

:stop
echo Stopping all services...
docker-compose down
echo.
echo [OK] All services stopped
echo.
pause
goto menu

:logs
echo Select service to view logs:
echo 1. All services
echo 2. Backend
echo 3. Frontend
echo 4. Crop Recommendation
echo 5. Disease Detection
echo 6. MongoDB
set /p log_choice="Enter choice: "

if "%log_choice%"=="1" docker-compose logs -f
if "%log_choice%"=="2" docker-compose logs -f backend
if "%log_choice%"=="3" docker-compose logs -f frontend
if "%log_choice%"=="4" docker-compose logs -f crop-recommendation
if "%log_choice%"=="5" docker-compose logs -f disease-detection
if "%log_choice%"=="6" docker-compose logs -f mongodb

goto menu

:cleanup
echo Warning: This will remove all containers and volumes!
set /p confirm="Are you sure? (yes/no): "

if /i "%confirm%"=="yes" (
    echo Cleaning up...
    docker-compose down -v
    echo.
    echo [OK] Cleanup complete
) else (
    echo Cleanup cancelled
)
echo.
pause
goto menu

:health
echo Checking service health...
echo.

curl -s http://localhost:3000/health >nul 2>&1
if errorlevel 1 (
    echo Backend: [FAIL] Unhealthy
) else (
    echo Backend: [OK] Healthy
)

curl -s http://localhost:5000/health >nul 2>&1
if errorlevel 1 (
    echo Crop Recommendation: [FAIL] Unhealthy
) else (
    echo Crop Recommendation: [OK] Healthy
)

curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo Disease Detection: [FAIL] Unhealthy
) else (
    echo Disease Detection: [OK] Healthy
)

echo.
pause
goto menu

:production
echo Setting up production environment...

if not exist .env (
    copy .env.example .env
    echo [OK] Created .env file
    echo Please edit .env file with your production credentials
    pause
)

echo Starting production deployment...
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
echo.
echo [OK] Production deployment complete
echo.
pause
goto menu

:end
echo Goodbye!
exit /b 0
