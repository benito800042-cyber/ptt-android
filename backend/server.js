/* PTT signaling only: media stays peer-to-peer (WebRTC). Put behind HTTPS/WSS and a reverse proxy. */
'use strict';
const http = require('http');
const { WebSocketServer } = require('ws');
const port = Number(process.env.PORT || 8080);
const host = process.env.HOST || '0.0.0.0';
const token = process.env.PTT_SHARED_TOKEN;
// Demo mode is deliberately opt-in, public, and capped. Keep it disabled for production.
const demoMode = process.env.PTT_DEMO_MODE === 'true';
const DEMO_MAX_CLIENTS = 8;
if (!token && !demoMode) console.warn('PTT_SHARED_TOKEN is not set and demo mode is disabled; connections will be rejected.');
if (demoMode) console.warn('PTT_DEMO_MODE is enabled: public demo channel, max 8 clients, no authentication.');
const clients = new Map();
let speaker = null;
const publicProfile = c => ({ id:c.id, name:c.profile.name, taxi:c.profile.taxi, online:true });
const send = (c, m) => { if (c.ws.readyState === 1) c.ws.send(JSON.stringify(m)); };
const broadcast = m => clients.forEach(c => send(c,m));
function presence(){ broadcast({type:'presence', demo:demoMode, participants:[...clients.values()].map(publicProfile), speaker:speaker && publicProfile(speaker)}); }
const server=http.createServer((req,res)=>{
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if(pathname==='/healthz'){
    res.writeHead(200,{'content-type':'application/json; charset=utf-8','cache-control':'no-store'});
    return res.end(JSON.stringify({ok:true,clients:clients.size,speaker:!!speaker,demo:demoMode}));
  }
  res.writeHead(404);res.end();
});
const wss=new WebSocketServer({server});
wss.on('connection',(ws)=>{
  let c=null;
  ws.on('message', raw=>{
    let m; try {m=JSON.parse(raw)} catch {return;}
    if(!c){
      const validProfile=m.profile && m.profile.name && m.profile.taxi && m.profile.phone;
      // Demo clients send mode=demo and no secret. Production still requires the secret.
      const authorized=(demoMode && m.mode==='demo' && !m.token) || (Boolean(token) && m.mode!=='demo' && m.token===token);
      if(!authorized || !validProfile){ws.close(1008,'authentication/profile required');return;}
      if(demoMode && m.mode==='demo' && clients.size>=DEMO_MAX_CLIENTS){ws.close(1013,'demo channel full');return;}
      c={ws,id:cryptoRandom(),profile:{name:String(m.profile.name).slice(0,40),taxi:String(m.profile.taxi).slice(0,12),phone:String(m.profile.phone).slice(0,24)}}; clients.set(c.id,c);
      send(c,{type:'welcome',demo:demoMode && m.mode==='demo',id:c.id,participants:[...clients.values()].map(publicProfile),speaker:speaker&&publicProfile(speaker)}); presence(); return;
    }
    if(m.type==='claim'){ if(!speaker){speaker=c; broadcast({type:'speaker',speaker:publicProfile(c)}); send(c,{type:'claim_ack',ok:true});} else send(c,{type:'claim_ack',ok:false,reason:'busy'}); return; }
    if(m.type==='release'){if(speaker===c){speaker=null;broadcast({type:'speaker',speaker:null});}return;}
    if(m.type==='signal' && typeof m.to==='string' && ['offer','answer','ice'].includes(m.signalType)){const dest=clients.get(m.to);if(dest && (speaker===c || speaker===dest))send(dest,{type:'signal',from:c.id,signalType:m.signalType,data:m.data});}
  });
  ws.on('close',()=>{if(!c)return;clients.delete(c.id);if(speaker===c){speaker=null;broadcast({type:'speaker',speaker:null});}presence();});
});
function cryptoRandom(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}
server.listen(port,host,()=>console.log('PTT signaling listening on '+host+':'+port));
