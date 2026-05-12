const express = require("express");
const path    = require("path");
const app     = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/ping", (req, res) => res.json({ ts: Date.now() }));

app.get("/api/download", (req, res) => {
  const SIZE=10*1024*1024, CHUNK=64*1024;
  res.setHeader("Content-Type","application/octet-stream");
  res.setHeader("Content-Length",SIZE);
  res.setHeader("Cache-Control","no-store");
  const buf=Buffer.alloc(CHUNK);
  let sent=0;
  function send(){
    if(sent>=SIZE){res.end();return;}
    const slice=buf.slice(0,Math.min(CHUNK,SIZE-sent));
    const ok=res.write(slice);
    sent+=slice.length;
    if(ok)setImmediate(send); else res.once("drain",send);
  }
  send();
});

app.post("/api/upload",(req,res)=>{
  let n=0;
  req.on("data",c=>{n+=c.length;});
  req.on("end",()=>res.json({received:n}));
});

app.get("/api/myip",(req,res)=>{
  const ip=(req.headers["x-forwarded-for"]||req.socket.remoteAddress||"")
    .split(",")[0].replace(/^::ffff:/,"").trim();
  res.json({ip});
});

app.use((req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));

app.listen(3000,()=>{
  console.log("\n====================================");
  console.log("  NetPulse Analyzer is RUNNING!");
  console.log("  Open Chrome and go to:");
  console.log("  http://localhost:3000");
  console.log("====================================\n");
});
