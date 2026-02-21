@echo off
echo Starting SecureGuard in background...
start /B npm run dev
echo.
echo SecureGuard is now running in the background!
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo To stop the server, close all Node.js processes from Task Manager
echo or run: taskkill /F /IM node.exe
pause
