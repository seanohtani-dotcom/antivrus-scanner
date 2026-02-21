# PWA Installation Guide

SecureGuard is now a Progressive Web App (PWA)! You can install it on your mobile device or desktop for a native app experience.

## Features

✅ Install on home screen (iOS & Android)
✅ Works offline
✅ Push notifications for threat alerts
✅ Fast loading with caching
✅ Native app experience
✅ No app store needed

## Installation Instructions

### On Android (Chrome/Edge)

1. Open https://your-domain.com in Chrome or Edge
2. Tap the menu (⋮) in the top right
3. Select "Install app" or "Add to Home screen"
4. Tap "Install"
5. The app icon will appear on your home screen

### On iOS (Safari)

1. Open https://your-domain.com in Safari
2. Tap the Share button (□↑) at the bottom
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. The app icon will appear on your home screen

### On Desktop (Chrome/Edge)

1. Open https://your-domain.com in Chrome or Edge
2. Look for the install icon (⊕) in the address bar
3. Click "Install"
4. The app will open in its own window

## Mobile Features

### File Upload on Mobile
- Tap "Choose File" to select files from your device
- Works with photos, documents, and downloads
- Instant scanning after selection

### Responsive Design
- Optimized for small screens
- Touch-friendly buttons (44px minimum)
- Horizontal scrolling for tables
- Collapsible navigation on mobile

### Offline Support
- View scan history offline
- Access threat database offline
- Dashboard works without internet
- Syncs when connection returns

### Push Notifications
- Get instant alerts for detected threats
- Real-time monitoring notifications
- Works even when app is closed
- Requires notification permission

## Technical Details

### Service Worker
- Caches app for offline use
- Network-first strategy for API calls
- Automatic updates when online

### Manifest
- App name: SecureGuard Antivirus
- Theme color: #2563eb (blue)
- Display: Standalone (full screen)
- Orientation: Portrait on mobile

### Browser Support
- ✅ Chrome/Edge (Android & Desktop)
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Android)
- ✅ Samsung Internet
- ❌ iOS Chrome (uses Safari engine)

## Deployment

To deploy as PWA:

1. Build the app:
```bash
npm run build
```

2. Serve with HTTPS (required for PWA):
```bash
# Using a static server
npx serve -s client/dist -p 3000
```

3. Or deploy to:
   - Vercel
   - Netlify
   - GitHub Pages
   - Any static hosting with HTTPS

## Testing PWA Features

### Test Installation
1. Open Chrome DevTools
2. Go to Application tab
3. Check "Manifest" section
4. Verify all icons load
5. Test "Add to home screen"

### Test Service Worker
1. Open Chrome DevTools
2. Go to Application > Service Workers
3. Check "Offline" mode
4. Reload page - should work offline

### Test Notifications
1. Allow notifications when prompted
2. Trigger a threat alert
3. Should receive push notification
4. Click notification to open app

## Troubleshooting

### App Won't Install
- Ensure you're using HTTPS
- Check manifest.json is accessible
- Verify service worker is registered
- Try clearing browser cache

### Offline Mode Not Working
- Check service worker is active
- Verify cache is populated
- Test with DevTools offline mode

### Notifications Not Working
- Check notification permissions
- Ensure HTTPS is enabled
- Test in supported browser
- Verify service worker is active

## Future Enhancements

Planned PWA features:
- [ ] Background sync for scans
- [ ] Periodic background updates
- [ ] File system access API
- [ ] Share target (scan shared files)
- [ ] Shortcuts (quick scan, monitor)
- [ ] Badge API (threat count)

---

Enjoy SecureGuard as a native app! 🛡️📱
