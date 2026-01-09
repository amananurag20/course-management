# Fixes Applied to Course Management Electron App

## 1. Production Environment Variables
- **Issue**: The application was unable to read environment variables (like `VITE_API_URL`) in the production build, causing login failures.
- **Fix**: 
  - Updated `electron.vite.config.mjs` to properly load `.env` files using `dotenv`.
  - Configured `electron-vite` to inject `import.meta.env.VITE_API_URL` into the renderer process during build using the `define` plugin.
  - Ensured `.env` and `.env.production` files are valid and contain the correct API URL.

## 2. Single Instance Lock
- **Issue**: Opening the application again when it was already running (minimized to tray) would create a new instance instead of focusing the existing one.
- **Fix**:
  - Implemented `app.requestSingleInstanceLock()` in `src/main/index.js`.
  - Added logic to focus, restore, and show the existing window if a second instance is attempted.
  - Ensures only one instance of the application runs at a time.

## 3. YouTube Playback (Fixed)
- **Issue**: YouTube videos were stuck loading indefinitely in the Electron app (showing spinner) while working fine in the website version.
- **Root Causes**:
  1. The `origin` parameter in `VideoPlayer.jsx` used `window.location.origin` which returns `file://` in Electron, causing YouTube to reject the embed.
  2. The `pointerEvents: "none"` setting on the iframe blocked player initialization.
  3. The CSP (Content Security Policy) was too restrictive and didn't allow all required Google/YouTube domains.
- **Fixes Applied**:
  1. Removed `origin` and `widget_referrer` parameters from YouTube player configuration.
  2. Removed `pointerEvents = "none"` from the iframe.
  3. Expanded CSP in `src/main/index.js` to include all required domains: `*.youtube.com`, `*.google.com`, `*.googlevideo.com`, `*.ytimg.com`, `*.gstatic.com`.
  4. Added `script-src`, `child-src`, and expanded `connect-src` directives.

## Next Steps
- Run `npm run build:win` (or appropriate build script) to create a new production release with these fixes.
