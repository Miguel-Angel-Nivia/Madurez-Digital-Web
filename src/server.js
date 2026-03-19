require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const respuestasRouter = require("./routes/respuestas");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Archivos estáticos (el HTML del cuestionario va en /public)
app.use(express.static(path.join(__dirname, "../public")));

// Rutas API
app.use("/api/respuestas", respuestasRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Iniciar servidor
async function start() {
  try {
    await db.connect();
    console.log("✅ Conectado a PostgreSQL");
    await db.initSchema();
    console.log("✅ Esquema de base de datos listo");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error al iniciar el servidor:", err.message);
    process.exit(1);
  }
}

start();
