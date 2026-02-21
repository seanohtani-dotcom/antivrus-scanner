# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

SecureGuard implements multiple security layers:

### Backend Security
- ✅ **Helmet.js** - Security headers (XSS, clickjacking protection)
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **CORS Protection** - Configurable allowed origins
- ✅ **File Size Limits** - 50MB maximum upload size
- ✅ **Input Validation** - All user inputs sanitized
- ✅ **Path Traversal Prevention** - No directory traversal attacks
- ✅ **Safe File Names** - Sanitized filenames on upload
- ✅ **Temp File Cleanup** - Automatic cleanup after scanning

### Frontend Security
- ✅ **Content Security Policy** - XSS protection
- ✅ **HTTPS Required** - For PWA features
- ✅ **Input Sanitization** - Client-side validation
- ✅ **Error Handling** - No sensitive data in errors

### Data Security
- ✅ **In-Memory Database** - No persistent sensitive data
- ✅ **Quarantine Isolation** - Infected files isolated
- ✅ **Secure File Handling** - Safe file operations

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: security@secureguard.com (or your email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Time
- Initial response: Within 48 hours
- Status update: Within 7 days
- Fix timeline: Depends on severity

### Severity Levels

**Critical**: Immediate fix required
- Remote code execution
- Authentication bypass
- Data breach

**High**: Fix within 7 days
- XSS vulnerabilities
- SQL injection
- Privilege escalation

**Medium**: Fix within 30 days
- CSRF vulnerabilities
- Information disclosure
- Denial of service

**Low**: Fix when possible
- Minor information leaks
- UI issues
- Non-security bugs

## Security Best Practices

### For Deployment

1. **Use HTTPS**
   ```bash
   # Never deploy without HTTPS
   # Use Let's Encrypt for free SSL
   ```

2. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com
   MAX_FILE_SIZE=52428800
   ```

3. **Enable Rate Limiting**
   - Already configured (100 req/15min)
   - Adjust in server/src/index.js if needed

4. **Regular Updates**
   ```bash
   npm audit
   npm audit fix
   ```

5. **Database Security**
   - Use PostgreSQL/MongoDB in production
   - Enable authentication
   - Use connection pooling
   - Regular backups

6. **File Upload Security**
   - Scan all uploaded files
   - Limit file types if needed
   - Store in isolated directory
   - Clean up temp files

### For Users

1. **Keep Updated**
   - Always use the latest version
   - Check for security updates

2. **Secure Deployment**
   - Use strong passwords
   - Enable firewall
   - Limit network access
   - Monitor logs

3. **Threat Signatures**
   - Keep threat database updated
   - Add custom signatures carefully
   - Verify signature sources

## Known Limitations

1. **In-Memory Database**
   - Data lost on restart
   - Not suitable for production
   - Migrate to PostgreSQL/MongoDB

2. **File System Access**
   - Limited to server file system
   - Cannot scan remote files
   - Requires proper permissions

3. **Threat Detection**
   - Signature-based only
   - No heuristic analysis
   - No machine learning

## Security Roadmap

Planned security enhancements:

- [ ] User authentication (JWT)
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Two-factor authentication
- [ ] API key authentication
- [ ] Encrypted database
- [ ] Secure WebSocket (WSS)
- [ ] File type validation
- [ ] Virus total integration
- [ ] Sandboxed scanning

## Compliance

This software is provided as-is for educational and demonstration purposes. For production use:

- Conduct security audit
- Implement authentication
- Use encrypted connections
- Follow OWASP guidelines
- Comply with local regulations

## Contact

For security concerns:
- Email: security@secureguard.com
- GitHub: Open a private security advisory

---

Last updated: 2026-02-21
