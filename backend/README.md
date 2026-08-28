# PTT signaling backend (v0.2)

Servidor mínimo de señalización/presencia y lease de un único hablante para PTT taxis. No procesa ni almacena audio: WebRTC transporta el audio directamente entre móviles.

## Despliegue

Requiere Node.js 22 y un endpoint HTTPS con WebSocket (`wss://`). En Render, usa el repositorio `ptt-android`, root directory `backend`, `npm install --omit=dev` y `npm start`. Configura `PTT_SHARED_TOKEN` como variable secreta generada por Render; nunca la incluyas en el repositorio, APK pública o URL.

El servidor escucha en `0.0.0.0` y expone `GET /healthz` (también acepta query strings, por ejemplo `/healthz?probe=1`) para comprobación. La respuesta esperada es `{"ok":true,"clients":0,"speaker":false}`.

El cliente debe usar la URL `wss://<servicio>.onrender.com` y el mismo token. No se afirma audio entre móviles hasta probar dos dispositivos físicos.
