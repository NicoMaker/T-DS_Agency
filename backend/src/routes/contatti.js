// ============================================================
// routes/contatti.js — Rotte API del form contatti
// ============================================================
const express = require("express");
const router = express.Router();

const contattiController = require("../controllers/contattiController");
const rateLimiter = require("../middlewares/rateLimiter");

router.post("/contatti", rateLimiter, contattiController.inviaFormContatti);

module.exports = router;
