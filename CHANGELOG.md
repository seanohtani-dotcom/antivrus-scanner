# Changelog

All notable changes to SecureGuard will be documented in this file.

## [1.0.0] - 2026-02-21

### Added
- File upload and scan functionality
- Real-time file monitoring with Chokidar
- Threat signature database management
- Automatic quarantine system
- WebSocket-based real-time updates
- System health monitoring dashboard
- Scan history tracking
- Dark-themed responsive UI
- In-memory database (easily swappable)

### Features
- **Scanner**: Upload files for immediate scanning
- **Monitor**: Real-time directory monitoring with automatic threat detection
- **Threats**: Manage threat signatures with severity levels
- **Quarantine**: View and manage quarantined files
- **Dashboard**: System health and statistics overview

### Technical
- React 18 frontend with Vite
- Node.js + Express backend
- WebSocket for real-time communication
- File upload support with express-fileupload
- Chokidar for file system monitoring
- Crypto for file hashing
