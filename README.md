# PTT Android · Canal de taxis

APK independiente del prototipo PTT local para taxis. Está hecha para móvil con una interfaz WebView que empaqueta `index.html`, `styles.css` y `app.js` dentro de la aplicación.

## Qué incluye (v0.2.0)
- Identidad editable (nombre, teléfono y taxi), guardada localmente; el teléfono no se publica a otros participantes.
- Configuración opcional de servidor WSS y token compartido desde ⚙.
- Señalización/presencia y lease de un único hablante mediante `backend/server.js`.
- PTT de pulsación mantenida; WebRTC envía el micrófono del hablante a los participantes cuando hay servidor configurado. Sin servidor queda explícitamente en modo local.

> **Estado verificado:** el código de cliente y backend están preparados, pero no se puede afirmar audio entre móviles hasta desplegar el backend detrás de TLS y probar dos dispositivos. El backend no guarda ni retransmite audio.

## Backend
Consulta `backend/README.md` y `backend/RENDER_DEPLOY.md`. Hace falta Node.js 22+, una URL pública `wss://` y `PTT_SHARED_TOKEN`. En Render, el repositorio es `ptt-android` y el root directory correcto es `backend` (no `PTT-Android/backend`).

## Compilar
En GitHub Actions: ejecutar manualmente el workflow **Build APK** o crear una etiqueta `v*`. El workflow compila y, para etiquetas, publica el APK debug en una release pública.
