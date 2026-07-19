# Vercel + Render Deployment Guide

## Backend (Render)

URL: `https://phonebook-st8l.onrender.com`

The backend is already deployed.

## Frontend (Vercel)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **Add New → Project**.
3. Import the `yashbodake/PhoneBook` GitHub repository.
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `frontend`
   - **Build Command**: *(leave empty)*
   - **Output Directory**: `.`
5. Click **Deploy**.

After deployment, Vercel will provide a URL like `https://phonebook-xxx.vercel.app`.

## Notes

- Vercel rewrites `/api/*` requests to `https://phonebook-st8l.onrender.com/*`.
- CORS is already enabled on the backend (`allow_origins=["*"]`).
- For production, restrict CORS to your Vercel domain in `backend/main.py`.
- Render free tier uses ephemeral storage; SQLite data resets on redeploy. Use Render PostgreSQL for persistent storage.
