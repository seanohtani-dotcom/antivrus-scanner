# SecureGuard - Antivirus Security Platform

A full-stack antivirus and security monitoring platform built with React, Node.js, and real-time file monitoring. Now available as a Progressive Web App (PWA) for mobile and desktop!

![SecureGuard](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PWA](https://img.shields.io/badge/PWA-enabled-blue.svg)

## Features

- **File Upload & Scanning**: Upload and scan files instantly
- **Real-time File Monitoring**: Automatically monitor directories and scan files as they're created/modified
- **Threat Database**: Manage threat signatures with severity levels (low, medium, high, critical)
- **Quarantine System**: Automatically isolate infected files
- **Real-time Updates**: WebSocket-based live scan progress and threat alerts
- **System Monitoring**: Track system health, memory usage, and resource utilization
- **Scan History**: View all past scans and their results
- **Modern UI**: Dark-themed, responsive interface
- **📱 PWA Support**: Install on mobile/desktop, works offline, push notifications

## Tech Stack

### Backend
- Node.js + Express
- In-memory database (easily swappable to PostgreSQL/SQLite)
- WebSocket for real-time updates
- Chokidar for file system monitoring
- Crypto for file hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Vite for build tooling
- Modern CSS with dark theme

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Windows, macOS, or Linux

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/secureguard.git
cd secureguard
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (optional):
```bash
cd server
copy .env.example .env
# Edit .env if needed
```

4. Start development servers:
```bash
npm run dev
```

This will start:
- Backend API on http://localhost:5000
- Frontend on http://localhost:3000

## Usage

### Scanning Files
1. Navigate to "Scanner" page
2. Choose scan type (file or directory)
3. Enter path or click "Browse" to select
4. Click "Start Scan"
5. View results and check quarantine if threats found

### Real-time Monitoring
1. Navigate to "Monitor" page
2. Click "Add Monitor"
3. Enter or browse for a directory path
4. Click "Start Monitoring"
5. Files will be automatically scanned when created/modified
6. Get instant alerts for detected threats

### Managing Threats
1. Navigate to "Threats" page
2. Click "Add Threat" to add new signatures
3. Enter threat name, signature (hash or pattern), and severity
4. View all known threats in the database

### System Dashboard
- View real-time system health metrics
- Monitor total scans, known threats, and quarantined files
- Check memory usage and system uptime

## Project Structure

```
secureguard/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── db/            # Database setup
│   │   └── index.js       # Server entry
│   └── package.json
└── package.json           # Root workspace config
```

## API Endpoints

### Scanning
- `POST /api/scan/file` - Scan a single file
- `POST /api/scan/directory` - Scan a directory
- `GET /api/scan/history` - Get scan history

### Monitoring
- `POST /api/monitor/start` - Start monitoring a directory
- `POST /api/monitor/stop/:id` - Stop a monitor
- `GET /api/monitor/active` - List active monitors
- `GET /api/monitor/list` - List all monitors
- `GET /api/monitor/:id/stats` - Get monitor statistics
- `GET /api/monitor/:id/events` - Get monitor events

### Threats
- `GET /api/threats` - List all threat signatures
- `POST /api/threats` - Add new threat signature
- `GET /api/threats/quarantine` - List quarantined files

### System
- `GET /api/system/health` - System health check
- `GET /api/system/stats` - Platform statistics

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

## Security Notes

This is a demonstration/educational project. For production use, consider:

- Implement proper authentication/authorization
- Add rate limiting and request validation
- Enhance threat detection algorithms with ML
- Add comprehensive file type validation
- Implement secure file handling and sandboxing
- Set up proper logging and monitoring
- Add database persistence (PostgreSQL/MongoDB)
- Implement backup and recovery systems
- Add SSL/TLS encryption
- Conduct security audits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

