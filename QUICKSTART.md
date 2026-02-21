# Quick Start Guide

Get SecureGuard up and running in 3 minutes!

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/secureguard.git
cd secureguard

# 2. Install dependencies
npm install

# 3. Start the application
npm run dev
```

That's it! The application will start on:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## First Steps

### 1. Scan a File
1. Go to the **Scanner** page
2. Click "Choose File"
3. Select any file from your computer
4. File will be scanned immediately!

### 2. Add Threat Signatures
1. Go to the **Threats** page
2. Click "Add Threat"
3. Enter:
   - Name: e.g., "Test Virus"
   - Signature: e.g., "EICAR-STANDARD-ANTIVIRUS-TEST-FILE"
   - Severity: Choose from low, medium, high, critical
4. Click "Add Threat"

### 3. Monitor a Directory
1. Go to the **Monitor** page
2. Click "Add Monitor"
3. Enter a directory path (e.g., C:\Users\YourName\Desktop)
4. Click "Start Monitoring"
5. Any new or modified files will be scanned automatically!

### 4. View Dashboard
- Check the **Dashboard** for system health
- See total scans, threats, and quarantined files
- Monitor memory usage and uptime

## Testing

To test the antivirus:

1. Add the EICAR test signature:
   - Name: EICAR Test
   - Signature: `EICAR-STANDARD-ANTIVIRUS-TEST-FILE`
   - Severity: high

2. Create a test file with this content:
   ```
   X5O!P%@AP[4\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*
   ```

3. Scan the file - it should be detected as a threat!

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
```bash
# Edit server/.env
PORT=5001

# Edit client/vite.config.js
server: { port: 3001 }
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- View [CHANGELOG.md](CHANGELOG.md) for version history

## Support

Having issues? Open an issue on GitHub or check the documentation.

Happy scanning! 🛡️
