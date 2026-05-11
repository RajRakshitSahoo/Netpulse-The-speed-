/**
 * NetPulse Analyzer — Real Speed Test Backend
 * Run: node server.js
 * Then open: http://localhost:3000
 */

const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app  = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ============================================================
   1. DOWNLOAD TEST — streams 10MB of zeros, browser times it
   ============================================================ */
app.get("/api/download", (req, res) => {
  const SIZE  = 10 * 1024 * 1024;
  const CHUNK = 64  * 1024;
  res.setHeader("Content-Type",   "application/octet-stream");
  res.setHeader("Content-Length", SIZE);
  res.setHeader("Cache-Control",  "no-store");
  const buf = Buffer.alloc(CHUNK, 0x00);
  let sent = 0;
  function send() {
    if (sent >= SIZE) { res.end(); return; }
    const rem   = SIZE - sent;
    const slice = rem < CHUNK ? buf.slice(0, rem) : buf;
    const ok    = res.write(slice);
    sent += slice.length;
    if (ok) setImmediate(send);
    else res.once("drain", send);
  }
  send();
});

/* ============================================================
   2. UPLOAD TEST — receives bytes and discards them
   ============================================================ */
app.post("/api/upload", (req, res) => {
  let received = 0;
  req.on("data",  c => { received += c.length; });
  req.on("end",   ()  => res.json({ received }));
  req.on("error", ()  => res.status(500).end());
});

/* ============================================================
   3. PING — returns server timestamp for RTT measurement
   ============================================================ */
app.get("/api/ping", (req, res) => {
  res.json({ ts: Date.now() });
});

/* ============================================================
   4. SERVER IP — returns the detected client IP
   ============================================================ */
app.get("/api/myip", (req, res) => {
  const raw = req.headers["x-forwarded-for"]?.split(",")[0].trim()
            || req.socket.remoteAddress
            || "127.0.0.1";
  res.json({ ip: raw.replace(/^::ffff:/, "") });
});

/* ============================================================
   SERVE FRONTEND
   ============================================================ */
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n⚡ NetPulse Analyzer → http://localhost:${PORT}\n`);
});
