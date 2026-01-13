# Deployment Instructions

This Study Tracker app is designed to be deployed easily.

## 1. Backend Deployment (Render / Railway)

The backend is a Node.js/Express app found in the `backend/` folder.

### Steps:
1. **Push to GitHub**: Make sure your project is in a GitHub repository.
2. **Create New Web Service**: On Render or Railway, connect your repo.
3. **Build Command**: `npm install` (Root is `backend` or set Root Directory to `backend` in settings).
4. **Start Command**: `node server.js`
5. **Environment Variables**:
   Add the following secrets in the dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A long random string.
   - `NODE_ENV`: `production`

## 2. Frontend Deployment (Vercel)

The frontend is a Vite + React app found in the `frontend/` folder.

### Steps:
1. **Import Project**: In Vercel, import your GitHub repo.
2. **Framework Preset**: Select **Vite**.
3. **Root Directory**: Select `frontend`.
4. **Environment Variables**:
   - Vercel automatically handles the build.
   - **Important**: Since we are using a proxy in `vite.config.js` for local dev (`/api`), in production you need to point Axios to the real backend URL.
   
   **Update `frontend/vite.config.js` or `frontend/src/context/AuthContext.jsx` (and other API calls) to use the production URL?**
   
   *Better Approach for Vercel + Backend*:
   Create a `.env.production` in `frontend/` with:
   `VITE_API_URL=https://your-backend-url.onrender.com`
   
   And update your Axios calls to use this base URL.

### Quick Fix for Production API URL:
I have updated `AuthContext.js` and pages to use relative paths (`/api`). For Vercel deployment to work with a separate backend, you should configure a **Rewrite** in `vercel.json` OR use an environment variable for the base URL.

**Recommended: vercel.json in `frontend/`**
Create a `vercel.json` file in the `frontend` folder:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-service.onrender.com/api/$1"
    }
  ]
}
```
Replace the destination with your actual deployed backend URL.

## 3. MongoDB Atlas Setup
1. Create a Cluster (Free Tier).
2. Create a Database User (Username/Password).
3. Network Access: Allow Access from Anywhere (`0.0.0.0/0`) for cloud deployment.
4. Get Connection String (Driver Node.js) and put it in `MONGO_URI`.

## Local Development
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
