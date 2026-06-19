# Grocery App (Frontend on Vercel, Backend on Render)

Hungarian grocery list app (**Kamra**) with an active shopping list, saved presets, and **store zones** so the Megvenni list follows walk order in the store.

This repo is split into:
- `frontend/` (Vite + React) deployed to **Vercel**
- `backend/` (Node + Express + MongoDB) deployed to **Render**

## Store zones (Megvenni)

Each item has a `storeZone` for layout while shopping:

| Zone | `storeZone` | Label (HU) | Row tint |
| ---- | ----------- | ---------- | -------- |
| Front | `front` | Elöl | Light neutral |
| Middle | `middle` | Középen | Light yellow |
| Back | `back` | Hátul | Light green |
| Unassigned | `na` | N/A | None (default row) |

**Behavior:**
- **Default zone:** `na` for new items and for legacy data without `storeZone`
- **Add row:** zone selector (session-only; pre-selects last choice)
- **Row ⋯ menu:** Elöl / Középen / Hátul / N/A + Törlés (rename via double-click)
- **List order:** active Megvenni (zone-sorted) → kosár (needed + bought, zone-sorted) → Már megvan
- **Drag-and-drop:** reorder within the same zone and same segment only
- **Presets (💾 Mentés):** save `{ name, storeZone }[]`; old string presets still load as `na`

**Persistence:** the active list **autosaves** on every edit (`PUT /api/global`). Presets use a separate API (`POST/PUT /api/presets`).

Detailed design: [docs/kamra-store-zones-plan.md](docs/kamra-store-zones-plan.md)

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

Deploy **backend before frontend** when schema or validation changes (e.g. new `storeZone` values).

## Local development

```bash
bash run.sh back   # backend on :5000
bash run.sh front  # Vite dev server
```

Restart the backend after pulling API changes. If port 5000 is in use, stop the old `node api/server.js` process first.

## Data model

### Active list (`GlobalState`)

Each item in `items[]`:

```json
{
  "id": "item_…",
  "name": "Tej",
  "needed": true,
  "bought": false,
  "storeZone": "na"
}
```

- `items[]` **order = screen order** (autosaved as-is)
- `storeZone`: `na` | `front` | `middle` | `back` (default `na`)
- Legacy `itemsNames: string[]` on old documents is still read; entries map to `storeZone: "na"`

### Presets (`Preset.itemsNames`)

Mixed array — backward compatible:

- Legacy: `"Tej"` (string)
- Rich: `{ "name": "Tej", "storeZone": "front" }`

Presets do **not** store `id`, `needed`, or `bought`.

### Key frontend modules

- `frontend/src/utils/storeZones.js` — zones, normalize, walk-order helpers
- `frontend/src/App.jsx` — autosave, zone change, DnD guards

## Feature docs & workflow

| Path | Purpose |
| ---- | ------- |
| [docs/kamra-store-zones-plan.md](docs/kamra-store-zones-plan.md) | Architecture, invariants, changelog |
| [docs/kamra-store-zones-phases.md](docs/kamra-store-zones-phases.md) | Implementation phases (1–8) |
| [context/current-feature.md](context/current-feature.md) | Current feature status / handoff |
| [context/phase-close-out.md](context/phase-close-out.md) | ~2 min checklist when a phase finishes |
