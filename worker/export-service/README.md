# Export Worker

Separate export service for PDF/PNG generation. Deploy independently from the Vercel-hosted Next.js app.

## Endpoints

- `GET /health` — Health check
- `POST /export/pdf` — HTML to PDF (Puppeteer)
- `POST /export/png` — HTML to PNG screenshot

## Environment

- `PORT` — Server port (default 3100)
- `WORKER_API_KEY` — Optional bearer token for auth

## Deploy

```bash
cd worker/export-service
npm install
npm start
```

Set `EXPORT_WORKER_URL` in the main app's `.env`.
