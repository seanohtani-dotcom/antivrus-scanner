@echo off
echo Installing PM2 (if not already installed)...
call npm install -g pm2

echo.
echo Starting SecureGuard with PM2...
call pm2 start npm --name "secureguard" -- run dev

echo.
echo ========================================
echo SecureGuard is now running with PM2!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Useful PM2 Commands:
echo   pm2 status          - Check status
echo   pm2 logs            - View logs
echo   pm2 stop secureguard - Stop server
echo   pm2 restart secureguard - Restart server
echo   pm2 delete secureguard - Remove from PM2
echo.
pause
