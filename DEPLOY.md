# 🚀 MarketSage Deployment Guide

## ✅ Build Successful!

Your project is ready to deploy. Choose one of the following platforms:

---

## 1. 🔷 Vercel (Recommended - Easiest)

### Prerequisites:

- GitHub account
- Vercel account (free): https://vercel.com

### Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**:
    - Go to https://vercel.com
    - Click "New Project"
    - Import your GitHub repository
    - Add environment variable:
        - Name: `GOOGLE_GENAI_API_KEY`
        - Value: Your Gemini API key
    - Click "Deploy"

**That's it!** ✨ Your app will be live in 2-3 minutes.

---

## 2. 🟢 Netlify

### Steps:

1. **Push to GitHub** (see above)

2. **Deploy on Netlify**:
    - Go to https://netlify.com
    - Click "Add new site" → "Import an existing project"
    - Connect your GitHub repo
    - Build settings:
        - Build command: `npm run build`
        - Publish directory: `.next`
    - Add environment variable:
        - `GOOGLE_GENAI_API_KEY` = Your API key
    - Click "Deploy"

---

## 3. 🔴 Firebase Hosting

### Prerequisites:

```bash
npm install -g firebase-tools
```

### Steps:

1. **Initialize Firebase**:
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Configure**:
    - Select your Firebase project
    - Public directory: `.next`
    - Single-page app: Yes

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

4. **Set environment variable**:
   ```bash
   firebase functions:config:set google.api_key="YOUR_API_KEY"
   ```

---

## 4. 🐳 Docker (Self-hosted)

### Dockerfile already configured in `next.config.ts`

1. **Build Docker image**:
   ```bash
   docker build -t marketsage .
   ```

2. **Run container**:
   ```bash
   docker run -p 3000:3000 -e GOOGLE_GENAI_API_KEY="your_key" marketsage
   ```

---

## 📋 Pre-Deployment Checklist

- ✅ Build completed successfully
- ✅ Environment variables configured
- ✅ `.env.local` added to `.gitignore` (already done)
- ✅ API key secured (never commit to GitHub)
- ✅ Test locally: `npm run build && npm start`

---

## 🌍 Environment Variables

Your app needs this environment variable on the deployment platform:

```
GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
```

**Important:** Never commit `.env.local` to Git!

---

## 🔧 Local Production Test

To test the production build locally:

```bash
npm run build
npm start
```

Then visit: http://localhost:3000

---

## 📊 Build Output

Your production build is optimized:

- **Home page**: 40 kB (149 kB with JS)
- **404 page**: 977 B (102 kB with JS)
- **Total shared JS**: 101 kB

---

## 🎯 Quick Deploy Commands

### Vercel (quickest):

```bash
npm install -g vercel
vercel
```

### Netlify:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🔗 Useful Links

- Vercel: https://vercel.com
- Netlify: https://netlify.com
- Firebase: https://firebase.google.com
- Next.js Deployment: https://nextjs.org/docs/deployment

---

## 💡 Recommended Platform

**Vercel** is recommended because:

- ✅ Made by Next.js creators
- ✅ Zero configuration needed
- ✅ Automatic deployments from GitHub
- ✅ Free tier is generous
- ✅ Built-in analytics
- ✅ Edge functions support

---

## 🚀 Deploy Now!

1. Choose Vercel for easiest deployment
2. Push your code to GitHub
3. Connect GitHub to Vercel
4. Add your API key as environment variable
5. Deploy!

Your MarketSage app will be live in minutes! 🎉
