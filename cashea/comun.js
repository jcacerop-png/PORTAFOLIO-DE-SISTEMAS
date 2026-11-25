"use strict";
/* =========================================================
   Utilidades compartidas por el panel administrador de Cashea.
   Requiere config.js (cargado antes).
   ========================================================= */

const CONFIGURADO = !CONFIG.SUPABASE_URL.includes("PEGA_AQUI");

// Con persistSession y autoRefreshToken activos: la sesión se renueva sola y no expira en segundo plano
const sb = (CONFIGURADO && window.supabase)
  ? window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: "mo_cashea_admin_auth",
      },
    })
  : null;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = n => "$" + (Number(n) || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* Precios: el teclado numérico del iPhone solo tiene coma, así que se acepta coma o punto.
   leerPrecio devuelve un número con 2 decimales, o null si el texto no es un precio válido. */
const leerPrecio = v => {
  const s = String(v ?? "").trim().replace(/\s/g, "").replace(",", ".");
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
};
const escribirPrecio = v => (v === "" || v === null || v === undefined ? "" : String(v).replace(".", ","));

function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 3200);
}

function abrirModal() {
  $("#modal").hidden = false;
  document.body.classList.add("lock");
}

function cerrarModal() {
  $("#modal").hidden = true;
  $("#modal .sheet").innerHTML = "";
  document.body.classList.remove("lock");
}

/* ---------- Tema claro / oscuro (recordado en el navegador, claro por defecto como en las capturas) ---------- */
function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  try { localStorage.setItem("nx_cashea_tema", tema); } catch { /* navegador sin almacenamiento */ }
  $$("[data-tema]").forEach(b => {
    b.textContent = tema === "oscuro" ? "☀ Tema claro" : "🌙 Tema oscuro";
  });
}

function alternarTema() {
  aplicarTema(document.documentElement.dataset.theme === "oscuro" ? "claro" : "oscuro");
}

/* ---------- Validar y reducir fotos antes de subirlas ---------- */
const EXTENSIONES_IMAGEN = /\.(png|jpe?g|jfif|webp|gif|bmp|avif|svg|heic|heif)$/i;

function esArchivoImagen(file) {
  if (!file) return false;
  const tipo = String(file.type || "").toLowerCase();
  const nombre = String(file.name || "");
  return tipo.startsWith("image/") || EXTENSIONES_IMAGEN.test(nombre);
}

function uuidSeguro() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function dibujarEnCanvas(fuente, w, h, max) {
  const s = Math.min(1, max / Math.max(w, h, 1));
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w * s));
  c.height = Math.max(1, Math.round(h * s));
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("No se pudo iniciar el procesador de imagen");
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(fuente, 0, 0, c.width, c.height);
  return new Promise((resolve, reject) => {
    c.toBlob(b => {
      c.width = 0;
      c.height = 0;
      if (b) resolve(b);
      else reject(new Error("No se pudo procesar la foto"));
    }, "image/jpeg", 0.86);
  });
}

async function comprimir(file, max = 1000) {
  if (!file) throw new Error("No se seleccionó ninguna imagen");
  try {
    return await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        URL.revokeObjectURL(url);
        if (!w || !h) return reject(new Error("Dimensiones de imagen no válidas"));
        dibujarEnCanvas(img, w, h, max).then(resolve, reject);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se pudo decodificar la imagen"));
      };
      img.src = url;
    });
  } catch (err1) {
    if (typeof createImageBitmap === "function") {
      try {
        const bmp = await createImageBitmap(file);
        const blob = await dibujarEnCanvas(bmp, bmp.width, bmp.height, max);
        if (typeof bmp.close === "function") bmp.close();
        return blob;
      } catch { /* continúa al respaldo */ }
    }
    if (esArchivoImagen(file) && file.size > 0 && file.size <= 25 * 1024 * 1024) {
      const buffer = await file.arrayBuffer();
      return new Blob([buffer], { type: file.type && file.type.startsWith("image/") ? file.type : "image/jpeg" });
    }
    throw new Error(err1 && err1.message ? err1.message : "Imagen no válida");
  }
}

/* Convierte un Blob en DataURL (usado en Modo Demo para persistir fotos de facturas localmente) */
function blobADataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("No se pudo leer la imagen"));
    reader.readAsDataURL(blob);
  });
}

/* ---------- Visor de foto grande: tocar la foto para acercarla ---------- */
function crearVisor() {
  const v = document.createElement("div");
  v.id = "visor";
  v.className = "visor";
  v.hidden = true;
  v.innerHTML = `
    <button class="visor-x" type="button" aria-label="Cerrar foto">✕</button>
    <div class="visor-marco"><img alt=""></div>
    <p class="visor-ayuda">Toca la foto para acercarla · Esc para cerrar</p>`;
  document.body.appendChild(v);
  v.addEventListener("click", e => {
    if (e.target.closest(".visor-x")) return cerrarZoom();
    if (e.target.tagName === "IMG") return v.classList.toggle("cerca");
    if (!v.classList.contains("cerca")) cerrarZoom();
  });
  return v;
}

function abrirZoom(src, texto = "") {
  const v = $("#visor") || crearVisor();
  const img = $("img", v);
  img.src = src;
  img.alt = texto;
  v.classList.remove("cerca");
  v.hidden = false;
  document.body.classList.add("lock");
}

function cerrarZoom() {
  const v = $("#visor");
  if (!v || v.hidden) return;
  v.hidden = true;
  v.classList.remove("cerca");
  $("img", v).removeAttribute("src");
  const modal = $("#modal");
  if (!modal || modal.hidden) document.body.classList.remove("lock");
}

/* ---------- Eventos comunes ---------- */
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-tema]")) return alternarTema();
  const zoom = e.target.closest("[data-zoom]");
  if (zoom) return abrirZoom(zoom.dataset.zoom, zoom.getAttribute("alt") || "");
  if (e.target.closest("[data-cerrar]") || e.target.id === "modal") return cerrarModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const v = $("#visor");
  if (v && !v.hidden) return cerrarZoom();
  if (!$("#modal").hidden) cerrarModal();
});

aplicarTema(localStorage.getItem("nx_cashea_tema") === "claro" ? "claro" : "oscuro");

// Texto sin tildes ni mayúsculas, para buscar y comparar
const normaTexto = s => String(s ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
