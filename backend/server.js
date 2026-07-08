// ============================================================
// server.js — Avvio del server
// ============================================================
const app = require("./app");
const config = require("./config");
const { getLocalIP, getPublicIP } = require("./utils/helpers");

async function avvia() {
  const localIP = getLocalIP();
  const publicIP = await getPublicIP();

  app.listen(config.port, "0.0.0.0", () => {
    console.log(`\n🚀 T-DS — server avviato!`);
    console.log(`🌐 IP Pubblico: http://${publicIP}:${config.port}`);
    console.log(`🏠 IP Locale:   http://${localIP}:${config.port}`);
    console.log(`📍 Localhost:   http://localhost:${config.port}`);
    console.log(`\n--------------------------------------`);
  });
}

avvia();
