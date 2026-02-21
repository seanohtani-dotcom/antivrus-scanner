# How to Start the Server

## Quick Start

Open your terminal in the project folder and run:

```bash
npm run dev
```

That's it! The server will start automatically.

## What This Does

The command starts both:
1. **Backend Server** (Port 5000) - Handles scanning, monitoring, and API
2. **Frontend App** (Port 3000) - The web interface you see in your browser

## Keep It Running

**Important:** Don't close the terminal! The server needs to stay running while you use the app.

You should see output like:
```
[0] Server running on port 5000
[1] Local: http://localhost:3000/
```

## Accessing the App

Once the server is running, open your browser and go to:
- **Main App**: http://localhost:3000
- **API**: http://localhost:5000/api/system/health

## Stopping the Server

To stop the server:
1. Go to the terminal where it's running
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)

## Troubleshooting

### "Can't reach this page" Error

This means the server isn't running. Solution:
1. Open terminal in project folder
2. Run `npm run dev`
3. Wait for "Server running" message
4. Try the link again

### Port Already in Use

If you see "Port 5000 is already in use":

**Option 1:** Stop the other process using port 5000
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

**Option 2:** Change the port
1. Edit `server/.env`
2. Change `PORT=5000` to `PORT=5001`
3. Restart server

### Dependencies Not Installed

If you see "Cannot find module" errors:
```bash
npm install
```

## Running in Background

### Windows
```bash
start /B npm run dev
```

### Mac/Linux
```bash
npm run dev &
```

### Using PM2 (Recommended for Production)
```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start npm --name "secureguard" -- run dev

# View logs
pm2 logs secureguard

# Stop server
pm2 stop secureguard
```

## Development vs Production

### Development (Current)
```bash
npm run dev
```
- Hot reload enabled
- Debug mode on
- Runs on localhost

### Production
```bash
# Build the app
npm run build

# Start production server
npm start
```
- Optimized build
- No hot reload
- Better performance

## Auto-Start on System Boot

### Windows (Task Scheduler)
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: At startup
4. Action: Start a program
5. Program: `cmd.exe`
6. Arguments: `/c cd C:\path\to\project && npm run dev`

### Mac (launchd)
Create file: `~/Library/LaunchAgents/com.secureguard.plist`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.secureguard</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/npm</string>
        <string>run</string>
        <string>dev</string>
    </array>
    <key>WorkingDirectory</key>
    <string>/path/to/project</string>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

Then:
```bash
launchctl load ~/Library/LaunchAgents/com.secureguard.plist
```

### Linux (systemd)
Create file: `/etc/systemd/system/secureguard.service`
```ini
[Unit]
Description=SecureGuard Antivirus
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/npm run dev
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable secureguard
sudo systemctl start secureguard
```

## Need Help?

If the server still won't start:
1. Check you're in the right folder
2. Make sure Node.js is installed: `node --version`
3. Make sure npm is installed: `npm --version`
4. Try deleting `node_modules` and running `npm install` again
5. Check the error message in the terminal

---

**Remember:** The server must be running for the app to work! Keep that terminal open! 🚀
