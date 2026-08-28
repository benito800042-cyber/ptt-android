# Render deployment

Create or update the Web Service from `benito800042-cyber/ptt-android` with root directory `backend`. Use Node runtime, build `npm install --omit=dev`, start `npm start`, and health check `/healthz`.

Render provides HTTPS/WSS. Keep `PTT_SHARED_TOKEN` as a generated secret environment variable; never commit it or put it in an APK/URL. The backend listens on `0.0.0.0` and `/healthz?probe=1` is equivalent to `/healthz`.

Verify after deployment:

```sh
curl -fsS https://ptt-android.onrender.com/healthz
curl -fsS 'https://ptt-android.onrender.com/healthz?probe=1'
```

Do not claim two-device audio until two physical devices connect and one transmits while the other receives.
