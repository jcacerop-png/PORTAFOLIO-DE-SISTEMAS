"use strict";
/* =========================================================
   NEXUS PAY · Panel Administrador Exclusivo de Cashea (Sin Login)
   - Datos 100% ficticios de demostración (nombres, cédulas 123... y
     facturas FAC-0001 / CSH-1001 falsas para evitar cualquier problema legal).
   - Consulta automática de la Tasa Oficial BCV en vivo resaltada
     en verde brillante (#00FF88).
   ========================================================= */

const STORAGE_DEMO_VENTAS = "nx_cashea_demo_ventas_v3";
const STORAGE_DEMO_CIERRES = "nx_cashea_demo_cierres_v3";

// Limpiar versiones previas de localStorage para que no quede ningún dato real antiguo
try {
  localStorage.removeItem("mo_cashea_demo_ventas_v1");
  localStorage.removeItem("mo_cashea_demo_cierres_v1");
  localStorage.removeItem("nx_cashea_demo_ventas_v2");
  localStorage.removeItem("nx_cashea_demo_cierres_v2");
} catch { /* noop */ }

const adm = {
  usuaria: "Administrador Demo",
  modoDemo: true,
  tasaBcvVivo: 46.85,
  tasaBcvFecha: "Actualizada hoy",
  cashea: [],
  cierres: [],
  calcAplicado: null,
  tab: "inicio",
};

const kpi = (titulo, valor, extra = "") => `<div class="card kpi" ${extra}><small>${titulo}</small><strong>${valor}</strong></div>`;

/* ---------- Tasa BCV Automática en Vivo ---------- */
async function obtenerTasaBcvAutomatica() {
  try {
    const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", { cache: "no-store" });
    if (!res.ok) throw new Error("API no disponible");
    const data = await res.json();
    const promedio = Number(data && data.promedio);
    if (promedio && promedio > 0) {
      adm.tasaBcvVivo = Math.round(promedio * 100) / 100;
      const fechaApi = data.fechaActualizacion ? new Date(data.fechaActualizacion) : new Date();
      adm.tasaBcvFecha = fechaApi.toLocaleDateString("es-VE", { day: "2-digit", month: "2-digit", year: "numeric" });
      try {
        localStorage.setItem("bcv_tasa_cache", JSON.stringify({ valor: adm.tasaBcvVivo, fecha: adm.tasaBcvFecha }));
      } catch { /* noop */ }
    }
  } catch {
    try {
      const cache = JSON.parse(localStorage.getItem("bcv_tasa_cache") || "null");
      if (cache && Number(cache.valor) > 0) {
        adm.tasaBcvVivo = Number(cache.valor);
        adm.tasaBcvFecha = cache.fecha || "Oficial BCV";
      }
    } catch { /* noop */ }
  }
  pintarBadgeBcv();
  // Si la calculadora aún no tiene tasa escrita, pre-cargar la tasa BCV automática
  if (typeof calc !== "undefined" && !calc.tasa && adm.tasaBcvVivo > 0) {
    calc.tasa = formatoBs(adm.tasaBcvVivo);
    const inputTasa = document.getElementById("calcTasa");
    if (inputTasa) inputTasa.value = calc.tasa;
    if (typeof pintarTotalesCalc === "function") pintarTotalesCalc();
  }
}

function pintarBadgeBcv() {
  const txt = `Bs ${numeroVE(adm.tasaBcvVivo)}`;
  document.querySelectorAll("[data-bcv-valor]").forEach(el => {
    el.textContent = txt;
  });
  document.querySelectorAll("[data-bcv-fecha]").forEach(el => {
    el.textContent = adm.tasaBcvFecha;
  });
}

/* ---------- Comprobante SVG de demostración ---------- */
function generarFacturaDemoSvg(fiscal, casheaNum, cliente, montoUsd) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="600" height="450" fill="#090B0E"/>
    <rect x="24" y="24" width="552" height="402" rx="18" fill="#11151C" stroke="#222934" stroke-width="2"/>
    <text x="50" y="75" fill="#00FF88" font-family="Arial, sans-serif" font-size="20" font-weight="bold">COMPROBANTE DE DEMOSTRACIÓN · CASHEA</text>
    <line x1="50" y1="95" x2="550" y2="95" stroke="#222934" stroke-width="2"/>
    <text x="50" y="140" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="18">Factura Fiscal (Ficticia): <tspan font-weight="bold" fill="#00FF88">${fiscal}</tspan></text>
    <text x="50" y="175" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="18">Orden Cashea (Ficticia): <tspan font-weight="bold" fill="#00FF88">${casheaNum}</tspan></text>
    <text x="50" y="215" fill="#94A3B8" font-family="Arial, sans-serif" font-size="16">Cliente Demo: ${cliente}</text>
    <text x="50" y="255" fill="#F8FAFC" font-family="Arial, sans-serif" font-size="24" font-weight="bold">Monto Total: $${Number(montoUsd).toFixed(2)} USD</text>
    <rect x="50" y="310" width="250" height="42" rx="10" fill="rgba(0,255,136,0.12)" stroke="#00FF88"/>
    <text x="72" y="336" fill="#00FF88" font-family="Arial, sans-serif" font-size="14" font-weight="bold">DATO FICTICIO DE PRUEBA</text>
  </svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

/* ---------- Ventas 100% Ficticias para Demo (Nombres, Cédulas 123... y Facturas Falsas) ---------- */
function obtenerVentasDemoIniciales() {
  const tasaRef = adm.tasaBcvVivo || 46.85;
  const base = [
    {
      id: "demo-01",
      factura: "FAC-0001",
      factura_fiscal: "FAC-0001",
      factura_cashea: "CSH-10001",
      fecha: "2026-11-24",
      tienda: "merceria",
      nombre: "Cliente Demo",
      apellido: "Uno",
      cedula: "V-00000123",
      monto_total_usd: 50.00,
      tasa: tasaRef,
      pct_inicial: 40,
      pct_comision: 4,
      pct_adelanto: 4,
      metodo_pago: "Pago móvil",
      estado: "pendiente",
      registrado_por: "Admin Demo",
      creado_en: "2026-11-24T18:30:00Z",
    },
    {
      id: "demo-02",
      factura: "FAC-0002",
      factura_fiscal: "FAC-0002",
      factura_cashea: "CSH-10002",
      fecha: "2026-11-24",
      tienda: "merceria",
      nombre: "Usuario Prueba",
      apellido: "Dos",
      cedula: "V-00000456",
      monto_total_usd: 80.00,
      tasa: tasaRef,
      pct_inicial: 50,
      pct_comision: 4,
      pct_adelanto: 4,
      metodo_pago: "Punto de venta",
      estado: "pendiente",
      registrado_por: "Admin Demo",
      creado_en: "2026-11-24T17:15:00Z",
    },
    {
      id: "demo-03",
      factura: "FAC-0003",
      factura_fiscal: "FAC-0003",
      factura_cashea: "CSH-10003",
      fecha: "2026-11-23",
      tienda: "decocintas",
      nombre: "Comprador Ficticio",
      apellido: "Tres",
      cedula: "V-00000789",
      monto_total_usd: 120.00,
      tasa: tasaRef,
      pct_inicial: 40,
      pct_comision: 4,
      pct_adelanto: 4,
      metodo_pago: "Efectivo USD",
      estado: "pendiente",
      registrado_por: "Admin Demo",
      creado_en: "2026-11-23T16:00:00Z",
    },
    {
      id: "demo-04",
      factura: "FAC-0004",
      factura_fiscal: "FAC-0004",
      factura_cashea: "CSH-10004",
      fecha: "2026-11-22",
      tienda: "caracas",
      nombre: "Persona Ejemplo",
      apellido: "Cuatro",
      cedula: "V-12345678",
      monto_total_usd: 65.00,
      tasa: tasaRef,
      pct_inicial: 60,
      pct_comision: 4,
      pct_adelanto: 4,
      metodo_pago: "Biopago",
      estado: "cobrada",
      liq_recibido_bs: Math.round(65 * 0.32 * tasaRef * 100) / 100,
      liq_tasa: tasaRef,
      liq_fecha: "2026-11-23",
      liq_comprobado_por: "Admin Demo",
      cobrada_en: "2026-11-23T19:00:00Z",
      registrado_por: "Admin Demo",
      creado_en: "2026-11-22T14:20:00Z",
    },
    {
      id: "demo-05",
      factura: "FAC-0005",
      factura_fiscal: "FAC-0005",
      factura_cashea: "CSH-10005",
      fecha: "2026-11-21",
      tienda: "merceria",
      nombre: "Cliente Simulado",
      apellido: "Cinco",
      cedula: "V-11111222",
      monto_total_usd: 95.00,
      tasa: tasaRef,
      pct_inicial: 40,
      pct_comision: 4,
      pct_adelanto: 4,
      metodo_pago: "Transferencia",
      estado: "pendiente",
      registrado_por: "Admin Demo",
      creado_en: "2026-11-21T12:10:00Z",
    },
    {
      id: "demo-06",
      factura: "FAC-0006",
      factura_fiscal: "FAC-0006",
      factura_cashea: "CSH-10006",
      fecha: "2026-11-20",
      tienda: "decocintas",
      nombre: "Registro Prueba",
      apellido: "Seis",
      cedula: "V-99999000",
      monto_total_usd: 40.00,
      tasa: tasaRef,
      pct_inicial: 40,
      pct_comision: 4,
      pct_adelanto: 4,
      metodo_pago: "Pago móvil",
      estado: "anulada",
      anulada_en: "2026-11-20T18:00:00Z",
      registrado_por: "Admin Demo",
      creado_en: "2026-11-20T11:00:00Z",
    },
  ];
  return base.map(v => ({
    ...v,
    factura_foto: generarFacturaDemoSvg(v.factura_fiscal, v.factura_cashea, `${v.nombre} ${v.apellido}`, v.monto_total_usd),
  }));
}

function cargarDatosDemoLocal() {
  try {
    const rawV = localStorage.getItem(STORAGE_DEMO_VENTAS);
    const rawC = localStorage.getItem(STORAGE_DEMO_CIERRES);
    adm.cashea = rawV ? JSON.parse(rawV) : obtenerVentasDemoIniciales();
    adm.cierres = rawC ? JSON.parse(rawC) : [];
    if (!rawV) guardarDatosDemoLocal();
  } catch {
    adm.cashea = obtenerVentasDemoIniciales();
    adm.cierres = [];
  }
}

function guardarDatosDemoLocal() {
  try {
    localStorage.setItem(STORAGE_DEMO_VENTAS, JSON.stringify(adm.cashea || []));
    localStorage.setItem(STORAGE_DEMO_CIERRES, JSON.stringify(adm.cierres || []));
  } catch { /* navegador sin espacio */ }
}

function restaurarDemoLocal() {
  adm.cashea = obtenerVentasDemoIniciales();
  adm.cierres = [];
  guardarDatosDemoLocal();
  pintarInicio();
  if (typeof pintarCashea === "function") pintarCashea();
  if (typeof pintarCierre === "function") pintarCierre();
  toast("Datos ficticios de demostración restaurados ✔");
}

async function asegurarSesion() {
  return { demo: true };
}

function esErrorDeSesion() {
  return false;
}

/* ---------- Carga y pintado ---------- */
async function cargar() {
  if (typeof refrescarCashea === "function") {
    await refrescarCashea();
  }
  pintarInicio();
  pintarBadgeBcv();
}

function alEntrarTab(tab) {
  if (tab === "inicio") pintarInicio();
  if (tab === "calculadora" && typeof pintarCalculadora === "function") pintarCalculadora();
  if (tab.startsWith("cashea") && typeof refrescarCashea === "function") {
    if (typeof fijarTiendaCashea === "function") fijarTiendaCashea(tab);
    refrescarCashea();
  }
  if (tab === "cierre" && typeof refrescarCashea === "function") refrescarCashea();
}

const VISTA_DE_TAB = { "cashea-merceria": "cashea", "cashea-decocintas": "cashea", "cashea-caracas": "cashea" };

function irA(tab) {
  adm.tab = tab;
  const vista = VISTA_DE_TAB[tab] || tab;
  $$("[data-view]").forEach(v => (v.hidden = v.dataset.view !== vista));
  $$("[data-tab]").forEach(b => b.classList.toggle("on", b.dataset.tab === tab));
  window.scrollTo(0, 0);
  alEntrarTab(tab);
}

function pintarInicio() {
  const saludoEl = $("#saludo");
  if (saludoEl) saludoEl.textContent = "Panel de Control · Nexus Pay";
  const kpisEl = $("#kpis");
  const bajosEl = $("#bajos");
  const feedEl = $("#feed");
  if (!kpisEl || typeof calculoCashea !== "function") return;

  const ventas = adm.cashea || [];
  const activas = ventas.filter(v => v.estado !== "anulada").map(v => ({ v, c: calculoCashea(v), r: compararCashea(v) }));
  const pendientes = activas.filter(x => x.v.estado === "pendiente" && !x.r);
  const delMes = activas.filter(x => x.r && esDelMesActual(x.v.liq_fecha));
  const sumar = (arr, f) => arr.reduce((s, x) => s + (Number(f(x)) || 0), 0);

  const porCobrarUsd = redondeo2(sumar(pendientes, x => x.c.liquidacionUsd));
  const porCobrarBs = redondeo2(sumar(pendientes, x => x.c.liquidacionBsVenta));
  const recibidoMesBs = redondeo2(sumar(delMes, x => x.r.recibidoBs));

  kpisEl.innerHTML = [
    kpi("Ventas activas registradas", activas.length, 'data-tab="cashea" style="cursor:pointer" title="Ir a Cashea total"'),
    kpi("Por cobrar a Cashea (USD)", usd(porCobrarUsd), 'data-tab="cashea" style="cursor:pointer" title="Ir a Cashea total"'),
    kpi("Por cobrar a Cashea (Bs)", bsTxt(porCobrarBs), 'data-tab="cashea" style="cursor:pointer" title="Ir a Cashea total"'),
    kpi("Recibido este mes (Bs)", bsTxt(recibidoMesBs), 'data-tab="cierre" style="cursor:pointer" title="Ir a Cierre de mes"'),
  ].join("");

  if (bajosEl) {
    bajosEl.innerHTML = pendientes.slice(0, 10).map(({ v, c }) => `
      <li class="linea">
        <div>
          <b>Fiscal: ${esc(facturaFiscalDe(v))} · ${esc(v.nombre)} ${esc(v.apellido)}</b>
          <small>${esc(TIENDAS_CASHEA[v.tienda] || v.tienda)} · Cédula: ${esc(v.cedula)} · ${esc(fechaTxt(v.fecha))}</small>
        </div>
        <div class="linea-r">
          <strong>${usd(c.liquidacionUsd)}</strong>
          <button type="button" class="btn ghost sm" data-cashea="comprobar" data-id="${esc(v.id)}">Comprobar</button>
        </div>
      </li>`).join("")
      || `<li class="muted">No hay ventas pendientes por comprobar.</li>`;
  }

  if (feedEl) {
    feedEl.innerHTML = ventas.slice(0, 10).map(v => `
      <li class="linea">
        <div>
          <b>Fiscal: ${esc(facturaFiscalDe(v))}${facturaCasheaDe(v) ? ` · Cashea: ${esc(facturaCasheaDe(v))}` : ""}</b>
          <small>${esc(v.nombre)} ${esc(v.apellido)} (${esc(v.cedula)}) · ${esc(TIENDAS_CASHEA[v.tienda] || v.tienda)}</small>
        </div>
        <div class="linea-r">
          <strong>${usd(v.monto_total_usd)}</strong>
          <span class="pill-estado ${esc(v.estado)}">${ESTADOS_CASHEA[v.estado] || esc(v.estado)}</span>
          <button type="button" class="btn ghost sm" data-cashea="detalle" data-id="${esc(v.id)}">Detalle</button>
        </div>
      </li>`).join("")
      || `<li class="muted">Aún no hay ventas registradas.</li>`;
  }
}

/* ---------- Visor de inspección de imágenes y Traducción ES / EN ---------- */
function abrirVisorCashea(src, nombre = "") {
  if (!src) return;
  const visor = $("#visorCashea");
  const img = $("#visorCasheaImg");
  const nom = $("#visorCasheaNombre");
  if (!visor || !img) return;
  img.src = src;
  img.alt = nombre || "Factura";
  if (nom) nom.textContent = nombre || "";
  visor.hidden = false;
  document.body.classList.add("lock");
  const btn = $("#visorCasheaCerrar");
  if (btn) btn.focus();
}

function cerrarVisorCashea() {
  const visor = $("#visorCashea");
  if (!visor || visor.hidden) return;
  visor.hidden = true;
  const img = $("#visorCasheaImg");
  if (img) img.src = "";
  const modalAbierto = $("#modal") && !$("#modal").hidden;
  if (!modalAbierto) document.body.classList.remove("lock");
}

const CASHEA_LANG_KEY = "portafolio_lang";
const CASHEA_PAIRS = [
  ["Gestión Cashea & BCV", "Cashea & BCV Management"],
  ["Inicio", "Home"],
  ["Calculadora de venta", "Sales Calculator"],
  ["Calculadora", "Calculator"],
  ["Cashea total", "Cashea Total"],
  ["Sede Principal", "Main Branch"],
  ["Sucursal Norte", "North Branch"],
  ["Sucursal Centro", "Downtown Branch"],
  ["Cierre de mes", "Month Close"],
  ["Cierre", "Closing"],
  ["Tasa BCV Oficial", "Official BCV Rate"],
  ["☀ Tema claro", "☀ Light theme"],
  ["🌙 Tema oscuro", "🌙 Dark theme"],
  ["Restaurar demo", "Reset demo"],
  ["Sistema Administrador Cashea", "Cashea Management System"],
  ["Panel de Control · Nexus Pay", "Control Panel · Nexus Pay"],
  ["Panel de Control Cashea", "Cashea Control Panel"],
  ["Control centralizado de ventas Cashea Express, calculadora con tasa BCV e inicial editable, comprobación de pagos y cierre mensual por sucursal.", "Centralized tracking of Cashea Express sales, calculator with live BCV rate and editable down payment, payout verification, and monthly branch closing."],
  ["+ Nueva venta Cashea", "+ New Cashea Sale"],
  ["Ir a Calculadora", "Go to Calculator"],
  ["Suma productos, IVA 16% e inicial (40% o editable)", "Sum products, 16% VAT & down payment (40% or editable)"],
  ["Todas las sucursales consolidadas y exportación Excel", "All branches consolidated & Excel export"],
  ["Ventas Cashea de Sede Principal", "Main Branch Cashea sales"],
  ["Ventas Cashea de Sucursal Norte", "North Branch Cashea sales"],
  ["Ventas Cashea de Sucursal Centro", "Downtown Branch Cashea sales"],
  ["Totales por sucursal y reporte Excel contable", "Branch totals & accounting Excel report"],
  ["Resumen general de Cashea", "Cashea General Overview"],
  ["Ventas activas registradas", "Active Recorded Sales"],
  ["Por cobrar a Cashea (USD)", "Receivable from Cashea (USD)"],
  ["Por cobrar a Cashea (Bs)", "Receivable from Cashea (Bs)"],
  ["Por cobrar a Cashea (Bs · liquidación)", "Receivable from Cashea (Bs · settlement)"],
  ["Recibido este mes (Bs)", "Received This Month (Bs)"],
  ["Recibido de Cashea este mes (Bs)", "Received from Cashea This Month (Bs)"],
  ["Con diferencia", "With Difference"],
  ["Ventas pendientes por comprobar", "Pending Sales to Verify"],
  ["Últimas ventas registradas", "Latest Recorded Sales"],
  ["Sumatoria de productos", "Products Sum"],
  ["+ Agregar precio", "+ Add price"],
  ["Resultado de la suma", "Subtotal"],
  ["Monto total", "Total amount"],
  ["Configuración de venta", "Sale Configuration"],
  ["Seleccionar tienda", "Select branch"],
  ["Fecha de venta", "Sale date"],
  ["Método de pago de la inicial", "Down payment method"],
  ["Conversión de divisa", "Currency Conversion"],
  ["Tasa de cambio (1 USD = XX Bs)", "Exchange rate (1 USD = XX Bs)"],
  ["Monto total en USD", "Total amount in USD"],
  ["Monto total en Bs", "Total amount in Bs"],
  ["Porcentaje personalizado (%)", "Custom percentage (%)"],
  ["Listo", "Done"],
  ["Monto total e inicial calculados automáticamente en base al total de productos.", "Total amount and down payment calculated automatically from product sum."],
  ["Fotos de la factura", "Invoice Photos"],
  ["+ Subir fotos", "+ Upload photos"],
  ["✔ APLICAR TASA Y TIENDA", "✔ APPLY RATE & BRANCH"],
  ["LIMPIAR CALCULADORA", "CLEAR CALCULATOR"],
  ["Cashea · Demo con Datos Ficticios", "Cashea · Safe Fake Demo Data"],
  ["Todos los nombres, cédulas (123...) y facturas son datos ficticios de prueba. La inicial (40% o editable) se cobra en caja y Cashea liquida el resto menos 8%.", "All names, IDs (123...) and invoices are fictional demo records. Down payment (40% or editable) is collected at register and Cashea settles the rest minus 8%."],
  ["+ Nueva venta", "+ New sale"],
  ["Todas", "All"],
  ["Pendientes", "Pending"],
  ["Cobradas", "Collected"],
  ["Anuladas", "Voided"],
  ["Exportar Excel", "Export Excel"],
  ["Facturas", "Invoices"],
  ["Día", "Date"],
  ["Tienda", "Branch"],
  ["Cliente", "Customer"],
  ["Cédula", "ID"],
  ["Total", "Total"],
  ["Inicial en caja", "Down Payment"],
  ["Financiado", "Financed"],
  ["Liquidación esperada", "Expected Payout"],
  ["Pago de Cashea", "Cashea Payout"],
  ["Estado", "Status"],
  ["Acciones", "Actions"],
  ["Pendiente", "Pending"],
  ["Cobrada", "Collected"],
  ["Anulada", "Voided"],
  ["Detalle", "Details"],
  ["Comprobar", "Verify"],
  ["Marcar cobrada", "Mark paid"],
  ["Editar", "Edit"],
  ["Anular", "Void"],
  ["Sin comprobar", "Unverified"],
  ["Cuadra", "Matches"],
  ["Exportar ventas mensuales por caja", "Export Monthly Sales by Branch"],
  ["Cerrar mes", "Close month"],
  ["Ventas por caja", "Sales by Branch"],
  ["Meses cerrados", "Closed Months"],
];

function obtenerIdiomaCashea() {
  return localStorage.getItem(CASHEA_LANG_KEY) === "en" ? "en" : "es";
}

function traducirDOMCashea(lang) {
  const esIngles = lang === "en";
  document.documentElement.lang = esIngles ? "en" : "es";
  $$("[data-lang-cashea]").forEach(el => { el.textContent = esIngles ? "ES" : "EN"; });

  const mapa = new Map(CASHEA_PAIRS.map(([es, en]) => (esIngles ? [es, en] : [en, es])));
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodos = [];
  while (walker.nextNode()) nodos.push(walker.currentNode);
  for (const n of nodos) {
    const limpio = n.nodeValue.trim();
    if (mapa.has(limpio)) {
      n.nodeValue = n.nodeValue.replace(limpio, mapa.get(limpio));
    }
  }

  const buscar = $("#buscarCashea");
  if (buscar) {
    buscar.placeholder = esIngles
      ? "Search invoice, first name or last name…"
      : "Buscar factura, nombre o apellido…";
  }
}

function toggleIdiomaCashea() {
  const nuevo = obtenerIdiomaCashea() === "es" ? "en" : "es";
  localStorage.setItem(CASHEA_LANG_KEY, nuevo);
  pintarInicio();
  if (typeof pintarCashea === "function") pintarCashea();
  if (typeof pintarCierre === "function") pintarCierre();
  traducirDOMCashea(nuevo);
}

/* ---------- Eventos ---------- */
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.id === "visorCashea" || t.closest("[data-visor-cashea-cerrar]") || t.closest("#visorCasheaCerrar")) {
    e.preventDefault();
    e.stopPropagation();
    return cerrarVisorCashea();
  }
  if (t.tagName === "IMG" && t.id !== "visorCasheaImg" && !t.closest(".foto-factura-quitar")) {
    e.preventDefault();
    e.stopPropagation();
    return abrirVisorCashea(t.src, t.alt || "Factura Cashea");
  }
  const abrirLink = t.closest(".foto-factura-abrir");
  if (abrirLink && abrirLink.href) {
    e.preventDefault();
    e.stopPropagation();
    return abrirVisorCashea(abrirLink.href, "Factura Cashea");
  }
  const inicioIr = t.closest("[data-inicio-ir]");
  if (inicioIr && inicioIr.dataset.inicioIr === "nueva-cashea") {
    irA("cashea-merceria");
    if (typeof abrirFormCashea === "function") abrirFormCashea(null);
    return;
  }
  if (t.closest("[data-usar-bcv]")) {
    if (typeof calc !== "undefined" && adm.tasaBcvVivo > 0) {
      calc.tasa = formatoBs(adm.tasaBcvVivo);
      const input = document.getElementById("calcTasa");
      if (input) input.value = calc.tasa;
      if (typeof pintarTotalesCalc === "function") pintarTotalesCalc();
      toast(`Tasa BCV oficial aplicada: Bs ${calc.tasa}`);
    }
    return;
  }
  const tab = t.closest("[data-tab]");
  if (tab) {
    irA(tab.dataset.tab);
    if (obtenerIdiomaCashea() === "en") setTimeout(() => traducirDOMCashea("en"), 20);
    return;
  }
  const btn = t.closest("[data-action]");
  if (btn && btn.dataset.action === "reset-demo") return restaurarDemoLocal();
  if (btn && btn.dataset.action === "idioma-cashea") return toggleIdiomaCashea();
  if (obtenerIdiomaCashea() === "en") setTimeout(() => traducirDOMCashea("en"), 30);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("#visorCashea") && !$("#visorCashea").hidden) {
    cerrarVisorCashea();
  }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = e.target.id;
  if (id === "formCashea") return guardarCashea(e);
  if (id === "formComprobar") return guardarComprobarCashea(e);
});

/* ---------- Arranque directo sin login ---------- */
window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const tabParam = params.get("tab") || "cashea";
  await obtenerTasaBcvAutomatica();
  await cargar();
  irA(tabParam);
  if (obtenerIdiomaCashea() === "en") {
    traducirDOMCashea("en");
  }
});

window.addEventListener("storage", (e) => {
  if (e.key === CASHEA_LANG_KEY) {
    const lang = obtenerIdiomaCashea();
    pintarInicio();
    if (typeof pintarCashea === "function") pintarCashea();
    if (typeof pintarCierre === "function") pintarCierre();
    traducirDOMCashea(lang);
  }
});
