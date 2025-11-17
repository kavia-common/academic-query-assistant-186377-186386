# Academic Query Assistant — Frontend (React)

This frontend provides a lightweight chat UI that communicates with the backend API.

## Run locally

- Backend: ensure the backend is running on http://localhost:3001 (or your preview URL).
- Frontend:
  - Install deps: `npm install`
  - Start dev server: `npm start`
  - Open http://localhost:3000

The API base URL is configured in `src/api.js` and defaults to `http://localhost:3001`. If your backend runs elsewhere, update that constant or introduce an environment variable mapping.

## Tests

- Run unit tests: `npm test`
- The app includes tests for rendering core UI elements.

## Environment variables

- Backend requires OPENAI_API_KEY (see backend README). The frontend does not require it directly.

## CORS

Your backend must allow the frontend origin (e.g., http://localhost:3000) via CORS. If using FastAPI + CORSMiddleware, include `http://localhost:3000` (and any preview URL) in `allow_origins`.

## Notes for customization

Colors and component styles are in `src/App.css`. The UI is pure React + CSS (no UI framework).
