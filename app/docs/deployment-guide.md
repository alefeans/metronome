# 🚀 Metronome Web App - Deployment Guide

## 🏆 Recommended Option: **GitHub Pages**

**Best for beginners** - Free, simple, and works in under 5 minutes!

---

## 📊 Quick Comparison Table

| Platform | Setup Time | Custom Domain | HTTPS | Build Required | Bandwidth Limit | Best For |
|----------|-----------|---------------|-------|----------------|-----------------|----------|
| **GitHub Pages** | 2 min | ✅ Free | ✅ Auto | ❌ No | 100GB/month | Beginners, Simple sites |
| **Netlify** | 3 min | ✅ Free | ✅ Auto | ✅ Yes | 100GB/month | Teams, CI/CD |
| **Vercel** | 3 min | ✅ Free | ✅ Auto | ✅ Yes | 100GB/month | React/Next.js apps |
| **Cloudflare Pages** | 4 min | ✅ Free | ✅ Auto | ✅ Yes | Unlimited | High traffic sites |
| **Surge.sh** | 2 min | ✅ Free | ✅ Auto | ❌ No | Unlimited | Quick prototypes |

---

## 🎯 Top 3 Deployment Options

### 1️⃣ GitHub Pages (RECOMMENDED - Easiest!)

**Perfect for:** Beginners, static HTML/CSS/JS sites

**Pros:**
- ✅ 100% free forever
- ✅ No build process needed
- ✅ Automatic HTTPS
- ✅ Free custom domain support
- ✅ Works directly from your GitHub repo
- ✅ Zero configuration

**Steps:**

```bash
# 1. Initialize git repository (if not already done)
cd /Users/alefesilva/dev/metronome
git init
git add .
git commit -m "Initial commit: Metronome app"

# 2. Create GitHub repository
# Go to: https://github.com/new
# Name: metronome (or any name)
# DO NOT initialize with README

# 3. Push your code
git remote add origin https://github.com/YOUR-USERNAME/metronome.git
git branch -M main
git push -u origin main

# 4. Enable GitHub Pages
# Go to: Repository Settings → Pages
# Source: Deploy from a branch
# Branch: main → /app folder (or root if app is in root)
# Click Save

# 5. Wait 1-2 minutes, then visit:
# https://YOUR-USERNAME.github.io/metronome/
```

**That's it! Your app is live! 🎉**

---

### 2️⃣ Netlify

**Perfect for:** Teams, continuous deployment, form handling

**Pros:**
- ✅ Drag-and-drop deployment option
- ✅ Automatic builds from Git
- ✅ Form handling (for feedback forms)
- ✅ Serverless functions support
- ✅ Instant rollbacks
- ✅ 100GB bandwidth/month

**Steps:**

```bash
# Option A: Drag & Drop (Fastest)
# 1. Go to: https://app.netlify.com/drop
# 2. Drag your /app folder
# 3. Done! (Instant deployment)

# Option B: Git Integration (Recommended)
# 1. Go to: https://app.netlify.com/start
# 2. Click "Import from Git"
# 3. Connect your GitHub account
# 4. Select your repository
# 5. Build settings:
#    - Base directory: app
#    - Build command: (leave empty for static sites)
#    - Publish directory: . (current directory)
# 6. Click "Deploy site"

# Your site is live at: https://random-name-12345.netlify.app
# You can customize the subdomain in Site Settings
```

**Custom Domain:**
```bash
# In Netlify dashboard:
# Site settings → Domain management → Add custom domain
# Follow DNS instructions (add CNAME record)
```

---

### 3️⃣ Vercel

**Perfect for:** React apps, Next.js, modern frameworks

**Pros:**
- ✅ Lightning-fast edge network
- ✅ Automatic preview deployments for PRs
- ✅ Built-in analytics
- ✅ Serverless functions
- ✅ 100GB bandwidth/month
- ✅ Best performance

**Steps:**

```bash
# 1. Install Vercel CLI (optional, but recommended)
npm install -g vercel

# 2. Deploy
cd /Users/alefesilva/dev/metronome/app
vercel

# Follow the prompts:
# - Login with GitHub
# - Set up and deploy: Y
# - Which scope: Your account
# - Link to existing project: N
# - Project name: metronome
# - Directory: ./
# - Override settings: N

# 3. Done! Your site is live at: https://metronome.vercel.app

# Alternative: Deploy via Git
# 1. Go to: https://vercel.com/new
# 2. Import your GitHub repository
# 3. Configure:
#    - Framework Preset: Other
#    - Root Directory: app
#    - Build Command: (leave empty)
#    - Output Directory: (leave empty)
# 4. Click Deploy
```

---

## 🌐 Honorable Mentions

### Cloudflare Pages
- **Best for:** High-traffic sites, unlimited bandwidth
- **Setup:** Similar to Netlify/Vercel
- **Link:** https://pages.cloudflare.com

### Surge.sh
- **Best for:** Quick prototypes, command-line deployment
- **Setup:**
  ```bash
  npm install -g surge
  cd /Users/alefesilva/dev/metronome/app
  surge
  ```

---

## ⚠️ Common Gotchas

### 1. File Paths
```javascript
// ❌ Wrong (will break on deployment)
<script src="/app/js/script.js"></script>

// ✅ Correct (relative paths work everywhere)
<script src="./js/script.js"></script>
<script src="js/script.js"></script>
```

### 2. Case Sensitivity
- GitHub Pages is case-sensitive!
- `index.html` ≠ `Index.html`
- Always use lowercase file names

### 3. 404 Errors
- Ensure `index.html` is in the root of your app folder
- Check that paths in HTML match actual file locations

### 4. CORS Issues
- If loading fonts/assets from CDN, ensure CORS headers are set
- Or host assets locally in your `/app` folder

### 5. HTTPS Mixed Content
- If using external resources, ensure they use `https://` not `http://`
- Modern browsers block mixed content

---

## 🎨 Custom Domain Setup

### For GitHub Pages:

1. **Add CNAME file:**
   ```bash
   echo "metronome.yourdomain.com" > /Users/alefesilva/dev/metronome/app/CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

2. **Update DNS (at your domain registrar):**
   ```
   Type: CNAME
   Name: metronome (or www)
   Value: YOUR-USERNAME.github.io
   ```

3. **Wait 24-48 hours for DNS propagation**

### For Netlify/Vercel:
- Go to site settings → Domains
- Click "Add custom domain"
- Follow the DNS instructions provided

---

## 🚀 Quick Start (5-Minute Deploy)

```bash
# 1. Choose GitHub Pages (simplest)
cd /Users/alefesilva/dev/metronome
git init
git add .
git commit -m "Deploy metronome app"

# 2. Create GitHub repo at: https://github.com/new

# 3. Push code
git remote add origin https://github.com/YOUR-USERNAME/metronome.git
git branch -M main
git push -u origin main

# 4. Enable Pages: Repo Settings → Pages → main branch → /app folder

# 5. Visit: https://YOUR-USERNAME.github.io/metronome/
```

**Your metronome is now live! 🎵**

---

## 📈 After Deployment

- ✅ Test on mobile devices
- ✅ Check all interactive features work
- ✅ Verify sound playback
- ✅ Test different browsers
- ✅ Share the link!

---

## 💡 Pro Tips

1. **Use GitHub Pages** if you just want to get it live quickly
2. **Use Netlify** if you plan to add forms or serverless functions later
3. **Use Vercel** if you might migrate to React/Next.js in the future
4. **Always test locally** before deploying (open `index.html` in browser)
5. **Enable HTTPS** (automatic on all platforms)

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 Error | Check file paths are relative, `index.html` exists |
| Site not updating | Clear browser cache, wait for build to complete |
| No sound | Check audio files are in correct folder, HTTPS enabled |
| Slow loading | Optimize images, minify CSS/JS |
| Mobile issues | Test viewport meta tag, responsive CSS |

---

**Need help?** Check the platform-specific documentation:
- [GitHub Pages Docs](https://docs.github.com/pages)
- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)

**Happy deploying! 🚀**
