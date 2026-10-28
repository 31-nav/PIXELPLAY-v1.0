# PixelPlay - Deployment Guide

## 1. Hosting Requirements
PixelPlay is a 100% static client-side web application. It requires:
- An HTTP/HTTPS web server (Node/Express, Python, Apache, Nginx, GitHub Pages, or Netlify).
- HTTPS in production to enable Service Worker registration (per modern browser security specifications). Localhost is exempt from HTTPS requirements for development.

## 2. GitHub Pages Deployment
1. Initialize a git repository and commit all workspace files:
   ```bash
   git init
   git add .
   git commit -m "feat: release PixelPlay v1.0"
   ```
2. Push to your GitHub repository.
3. In GitHub, go to **Settings** -> **Pages**.
4. Set **Source** to `Deploy from a branch`, choose branch `main` and folder `/ (root)`.
5. GitHub Pages automatically enables HTTPS and serves PixelPlay. All relative asset paths and hash routes work out of the box.

## 3. Netlify Deployment
1. Connect your repository to Netlify.
2. In build settings:
   - **Build command**: Leave completely empty (no build tools).
   - **Publish directory**: `.` (root directory).
3. Click **Deploy Site**. Netlify provides an automatic HTTPS certificate.

## 4. Hash Routing Compatibility
PixelPlay uses hash routes (`#/`, `#/games`, `#/play/:gameId`). Hash routes are never sent to the web server, which guarantees that reloading any URL on static hosts (like GitHub Pages or Netlify) will never throw a 404 error.
