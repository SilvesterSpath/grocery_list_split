# Grocery App (Frontend on Vercel, Backend on Render)

This repo is split into:
- `frontend/` (Vite + React) deployed to **Vercel**
- `backend/` (Node + Express + MongoDB) deployed to **Render**

## Required environment variables

### Backend (`backend/`)

Create environment variables on Render (or locally) for:
- `MONGO_URI` (MongoDB connection string)
- `PORT` (optional, defaults to `5000`)
- `CORS_ORIGIN` (optional, defaults to `*`)

See: `backend/.env.example`

### Frontend (`frontend/`)

Set:
- `VITE_API_BASE_URL` to your Render backend origin

See: `frontend/.env.example`

## Backend deploy (Render)

1. Create a **Web Service** using the repo folder `backend/`.
2. Set the **Start Command** to:
   - `npm run start`
3. Set `MONGO_URI` and `CORS_ORIGIN` environment variables.

Backend health check:
- `GET /health`

## Frontend deploy (Vercel)

1. Create a Vercel Project using the repo folder `frontend/` as the **Root Directory**.
2. Vercel will run:
   - `npm run build`
3. In Vercel project settings, set `VITE_API_BASE_URL` to your Render backend origin.

## Notes on data model

- The backend stores **item names only** for now:
  - global list: `itemsNames: string[]`
  - presets: `Preset.itemsNames: string[]`
- The frontend maintains a richer UI model (`needed`, `bought`) and uses a mapping layer to convert to/from names-only persisted shape.

