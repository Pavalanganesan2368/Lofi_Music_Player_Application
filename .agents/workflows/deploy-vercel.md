---
description: How to deploy the LoFocus React application to Vercel
---

# Deploying to Vercel

### 1. Simple CLI Deployment
1. Open your terminal in the project directory.
2. Install the Vercel CLI: `npm install -g vercel`.
3. Run `vercel` to start the setup process.
4. Run `vercel --prod` to deploy the production version.

### 2. GitHub Integrated Deployment (Recommended)
1. Initialize a git repo: `git init`.
2. Commit your changes: `git add . && git commit -m "ready for deploy"`.
3. Push to a new GitHub repository.
4. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
5. Click **Add New** -> **Project**.
6. Import your GitHub repository.
7. Click **Deploy**.

### Project Specific Settings
- **Framework**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
