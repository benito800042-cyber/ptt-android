# Render deployment

Create or update the Web Service from `benito800042-cyber/ptt-android` with root directory `backend`. Use Node runtime, build `npm install --omit=dev`, start `npm start`, and health check `/healthz`.

**Important for the existing `ptt-android` service:** the repository root is already the repository root. Set Render's Root Directory to exactly `backend` (not `PTT-Android/backend`), and do not create a second service from the Blueprint. The service URL remains `https://ptt-android.onrender.com` (WebSocket URL `wss://ptt-android.onrender.com`).

Render provides HTTPS/WSS. Keep `PTT_SHARED_TOKEN` as a generated secret environment variable; never commit it or put it in an APK/URL. The backend listens on `0.0.0.0` and `/healthz?probe=1` is equivalent to `/healthz`.

If a deploy is red/Failed, inspect the first build/start error. A valid deployment must show `PTT signaling listening on 0.0.0.0:<PORT>` and pass the health check. In the existing service settings use:

- Build Command: `npm install --omit=dev`
- Start Command: `npm start`
- Health Check Path: `/healthz`
- Root Directory: `backend`
- Node: 22 (the package engine is `>=22 <23`)

Verify after deployment:

```sh
curl -fsS https://ptt-android.onrender.com/healthz
curl -fsS 'https://ptt-android.onrender.com/healthz?probe=1'
```

Do not claim two-device audio until two physical devices connect and one transmits while the other receives.
