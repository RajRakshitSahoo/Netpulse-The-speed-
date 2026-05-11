# NetPulse Analyzer — Real Speed Test

## Quick Start (3 commands)

  npm install
  node server.js
  Open http://localhost:3000

## What it measures (100% real, not simulated)

- Download  : Fetches 10MB from local server, measures bytes/time via Fetch Streams
- Upload    : POSTs 5MB via XHR with live progress
- Ping      : 8 round trips to /api/ping, averaged
- Jitter    : Max minus min of ping samples
- Location  : Browser Geolocation API + Nominatim reverse geocode (no API key)
- IP        : Detected server-side from socket
- Battery   : navigator.getBattery()
- Net type  : navigator.connection API

## Project Structure

  server.js          Node.js + Express backend
  public/index.html  Full frontend (React 18 + Recharts)
  package.json       Dependencies

## API Endpoints

  GET  /api/download  Streams 10MB for download test
  POST /api/upload    Receives data for upload test
  GET  /api/ping      Returns timestamp for RTT
  GET  /api/myip      Returns your detected IP

## Stack

  Node.js, Express, React 18, Recharts, Fetch Streams API,
  Geolocation API, Battery API, Network Information API,
  Nominatim (OpenStreetMap) for reverse geocoding
