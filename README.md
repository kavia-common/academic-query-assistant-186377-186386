# Academic Query Assistant (Workspace 186377-186386)

This workspace contains the frontend (React). The backend runs in a separate workspace/container.

## Quick start

- Backend (FastAPI): run on port 3001 and ensure CORS allows the frontend origin(s).
  - Required env: `OPENAI_API_KEY` (set in backend environment).
- Frontend (React, this folder):
  - `cd study_assistant_frontend`
  - `npm install`
  - `npm start` -> http://localhost:3000

## Frontend-backend integration

- The frontend calls the backend directly (no proxy). Base URL is set in `study_assistant_frontend/src/api.js` to `http://localhost:3001`.
- If using a preview backend URL, update `BASE_URL` accordingly.

## Testing

- Frontend tests: `cd study_assistant_frontend && npm test`
- Backend tests: run within the backend container/workspace.

## CORS reminder

Backend must include the frontend origin (e.g., http://localhost:3000 and any preview URL) in allowed origins for CORS, otherwise the browser will block API calls.

## MVP storage model

For the MVP, the backend uses an in-memory, thread-safe session store. No database setup is required. Session histories reset when the backend restarts, which is acceptable for the current scope focused on functionality and tests.