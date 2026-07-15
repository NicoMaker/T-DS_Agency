// ============================================================
// app.js — Configurazione dell'applicazione Express
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const config = require("./config");
const contattiRoutes = require("./routes/contatti");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// ── Middleware ──
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

// ── File statici (frontend) ──
app.use(express.static(path.join(__dirname, "../../frontend")));

// ── API ──
app.use("/api", contattiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "online" });
});

// ── Gestione errori centralizzata (sempre per ultima) ──
app.use(errorHandler);

module.exports = app;
