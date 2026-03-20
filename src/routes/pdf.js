const express = require("express");
const router  = express.Router();
const puppeteer = require("puppeteer-core");

const SECTION_COLORS = {
  infra: "#378ADD",
  mkt:   "#639922",
  ops:   "#EF9F27",
  cx:    "#7F77DD",
  cult:  "#D4537E",
  strat: "#D85A30",
  int:   "#1D9E75",
};

const SECTION_TITLES = {
  infra: "Infraestructura y tecnologia",
  mkt:   "Presencia digital y marketing",
  ops:   "Operaciones y procesos internos",
  cx:    "Experiencia del cliente",
  cult:  "Cultura digital y formacion",
  strat: "Estrategia y liderazgo digital",
  int:   "Integracion y sistemas",
};

const SECTION_QUESTIONS = {
  infra:  ["Capacidad tecnologica","Adopcion de nube e IA","Seguridad y gobernanza","Preparacion para IA generativa","Continuidad y resiliencia"],
  mkt:    ["Presencia digital coherente","Estrategias de marketing","Analisis de datos","Personalizacion con IA","Medicion de impacto digital"],
  ops:    ["Automatizacion inteligente","Datos en tiempo real","Colaboracion digital","IA en operaciones","Mejora continua"],
  cx:     ["Canales digitales de atencion","Continuidad del servicio","Retroalimentacion continua","IA y autoservicio","Vision 360 del cliente"],
  cult:   ["Cultura de adopcion digital","Formacion continua","Innovacion y adaptabilidad","Alfabetizacion en IA","Gestion del cambio"],
  strat:  ["Vision digital clara","Inversion en IA","Liderazgo digital","Estrategia de datos e IA","Alineacion digital-negocio"],
  int:    ["Interoperabilidad","ERP y CRM","Flexibilidad y escalabilidad","IA integrada en sistemas","Calidad y gobierno del dato"],
};

const RESP_LABELS = ["","Totalmente en desacuerdo","En desacuerdo","Neutral","De acuerdo","Totalmente de acuerdo"];

function getLevel(s) {
  if(s < 25) return { name:"Etapa Inicial",  bg:"#fee2e2", color:"#991b1b" };
  if(s < 50) return { name:"En Desarrollo",  bg:"#fef3c7", color:"#92400e" };
  if(s < 75) return { name:"En Camino",      bg:"#ffedd5", color:"#9a3412" };
  return               { name:"Lider Digital", bg:"#ccfbf1", color:"#065f46" };
}

function buildReportHTML(data) {
  const { nombre, empresa, cargo, answers, score100, secScores } = data;
  const level = getLevel(score100);
  const fecha = new Date().toLocaleDateString("es-CO", { year:"numeric", month:"long", day:"numeric" });
  const sections = Object.keys(SECTION_TITLES);

  let puntajesRows = "";
  sections.forEach(id => {
    const t     = secScores[id] || 0;
    const max   = 25;
    const pct   = Math.round((t / max) * 100);
    const color = SECTION_COLORS[id];
    puntajesRows += "<tr>"
      + "<td style='padding:9px 14px;font-size:12px;color:#1a1a18;width:38%;'>" + SECTION_TITLES[id] + "</td>"
      + "<td style='padding:9px 14px;width:46%;'>"
      + "<div style='background:#e5e7eb;border-radius:4px;height:9px;'>"
      + "<div style='background:" + color + ";height:9px;border-radius:4px;width:" + pct + "%;'></div>"
      + "</div></td>"
      + "<td style='padding:9px 14px;font-size:12px;font-weight:700;color:" + color + ";text-align:center;width:16%;'>" + t + "/25</td>"
      + "</tr>";
  });

  let pregRows = "";
  sections.forEach(id => {
    pregRows += "<tr>"
      + "<td colspan='3' style='background:#1a2f5a;padding:9px 14px;color:#2dd4bf;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;'>"
      + SECTION_TITLES[id]
      + "</td></tr>";
    const qs = SECTION_QUESTIONS[id] || [];
    qs.forEach(function(lbl, qi) {
      const key      = id + "_" + qi;
      const val      = answers[key] || "-";
      const respText = RESP_LABELS[val] || "";
      const rowBg    = qi % 2 === 0 ? "#fafafa" : "#ffffff";
      pregRows += "<tr style='background:" + rowBg + ";'>"
        + "<td style='padding:7px 14px;font-size:11px;color:#374151;font-weight:600;width:28%;border-bottom:1px solid #f0f0f0;'>" + lbl + "</td>"
        + "<td style='padding:7px 14px;font-size:11px;color:#6b7280;width:16%;text-align:center;border-bottom:1px solid #f0f0f0;'>" + val + "</td>"
        + "<td style='padding:7px 14px;font-size:11px;color:#374151;border-bottom:1px solid #f0f0f0;'>" + respText + "</td>"
        + "</tr>";
    });
  });

  return "<!DOCTYPE html>"
    + "<html lang='es'><head><meta charset='UTF-8'/>"
    + "<style>"
    + "* { box-sizing:border-box; margin:0; padding:0; }"
    + "body { font-family: Arial, sans-serif; background:#fff; color:#1a1a18; font-size:13px; }"
    + "table { border-collapse:collapse; width:100%; }"
    + "</style></head><body>"

    + "<div style='background:linear-gradient(135deg,#0d1b3e 0%,#1a2f5a 100%);padding:32px 40px;color:#fff;'>"
    + "<div style='display:flex;justify-content:space-between;align-items:center;'>"
    + "<div>"
    + "<div style='font-size:10px;color:#2dd4bf;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:8px;font-weight:700;'>Diagnostico de Madurez Digital 2026</div>"
    + "<div style='font-size:22px;font-weight:800;color:#fff;margin-bottom:4px;'>" + nombre + "</div>"
    + "<div style='font-size:13px;color:#94a3b8;'>" + cargo + (empresa ? " - " + empresa : "") + "</div>"
    + "</div>"
    + "<div style='text-align:right;'>"
    + "<div style='font-size:64px;font-weight:800;color:#2dd4bf;line-height:1;'>" + score100 + "</div>"
    + "<div style='font-size:11px;color:#94a3b8;margin-top:2px;'>de 100 puntos</div>"
    + "<div style='margin-top:8px;background:" + level.bg + ";color:" + level.color + ";padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;'>" + level.name + "</div>"
    + "</div></div>"
    + "<div style='font-size:10px;color:#4a5568;margin-top:16px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);'>"
    + "Generado el " + fecha + " - serviciosysolucionesip.com - comercialsys@serviciosysolucionesip.com"
    + "</div></div>"

    + "<div style='padding:28px 40px 20px;'>"
    + "<div style='font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin-bottom:14px;'>Puntaje por dimension</div>"
    + "<table><thead><tr style='background:#f5f7fa;'>"
    + "<th style='padding:9px 14px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;'>Dimension</th>"
    + "<th style='padding:9px 14px;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;'>Progreso</th>"
    + "<th style='padding:9px 14px;text-align:center;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;'>Puntaje</th>"
    + "</tr></thead><tbody>" + puntajesRows + "</tbody></table>"
    + "</div>"

    + "<div style='margin:0 40px;height:1px;background:#e5e7eb;'></div>"

    + "<div style='padding:20px 40px 32px;'>"
    + "<div style='font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;margin-bottom:14px;'>Respuestas por pregunta</div>"
    + "<table><thead><tr style='background:#f5f7fa;'>"
    + "<th style='padding:8px 14px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;'>Indicador</th>"
    + "<th style='padding:8px 14px;text-align:center;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;'>Valor</th>"
    + "<th style='padding:8px 14px;text-align:left;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;'>Respuesta</th>"
    + "</tr></thead><tbody>" + pregRows + "</tbody></table>"
    + "</div>"

    + "<div style='background:#0d1b3e;padding:14px 40px;display:flex;justify-content:space-between;align-items:center;'>"
    + "<span style='color:#4a5568;font-size:10px;'>2026 Servicios y Soluciones IP. Todos los derechos reservados.</span>"
    + "<span style='color:#2dd4bf;font-size:10px;'>+57 314 790 8645</span>"
    + "</div>"

    + "</body></html>";
}

router.post("/", async (req, res) => {
  const { nombre, empresa, cargo, answers } = req.body;

  if (!answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Se requieren las respuestas del cuestionario." });
  }

  const sections = Object.keys(SECTION_TITLES);
  let grandTotal = 0;
  const secScores = {};
  sections.forEach(function(id) {
    var t = 0;
    for (var i = 0; i < 5; i++) t += parseInt(answers[id + "_" + i]) || 0;
    secScores[id] = t;
    grandTotal += t;
  });
  const score100 = Math.round((grandTotal / 175) * 100);
  const html = buildReportHTML({ nombre, empresa, cargo, answers, score100, secScores });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: "/usr/bin/google-chrome",
      timeout: 30000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    const safeName = (nombre || "resultado").replace(/[^a-zA-Z0-9\s-]/g, "").replace(/\s+/g, "-");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=\"diagnostico-" + safeName + ".pdf\"");
    res.setHeader("Content-Length", pdf.length);
    res.end(pdf);

  } catch (err) {
    if (browser) await browser.close().catch(function(){});
    console.error("Error generando PDF:", err.message);
    res.status(500).json({ error: "Error al generar el PDF: " + err.message });
  }
});

module.exports = router;