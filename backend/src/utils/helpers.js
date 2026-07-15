// ============================================================
// utils/helpers.js — Utility varie (IP locale/pubblico)
// ============================================================
const os = require("os");
const https = require("https");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

function getPublicIP() {
  return new Promise((resolve) => {
    https
      .get("https://api.ipify.org", (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data.trim()));
      })
      .on("error", () => resolve("non disponibile"));
  });
}

module.exports = { getLocalIP, getPublicIP };
