/* =========================================================
   NOVA ATELIER · Capa de Datos Compartida (Admin + Catálogo Web)
   - Almacenamiento local sincronizado en tiempo real entre
     admin.html y catalogo.html (index.html) sin requerir login.
   - Incluye catálogo precargado con fotografías de moda libres de
     derechos de autor (Unsplash) y respaldo visual SVG.
   ========================================================= */
"use strict";

const DEMO = true;
const MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const DEMO_VERSION = 10;

const USUARIAS = [
  { nombre: "Administración Nova", email: "admin@nova-atelier.com" },
];

// Fotografías de moda libres de derechos de autor (Unsplash) para la portada y sección "Nosotros"
const SITIO_SEED = [
  {
    clave: "inicio",
    url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85",
  },
  {
    clave: "nosotros",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85",
  },
];

// Catálogo inicial con imágenes de prueba libres de derechos de autor y stock real cargado
// [fotos[], nombre, categoría, precio, costo, destacado, variantes [talla, color, stock]]
const SEED = [
  [
    [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80"
    ],
    "Vestido Emerald Satin",
    "Vestidos",
    34,
    18,
    true,
    [["S", "Verde", 3], ["M", "Verde", 4], ["L", "Negro", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80"
    ],
    "Vestido Noir Minimal",
    "Vestidos",
    29,
    15,
    true,
    [["S", "Negro", 3], ["M", "Negro", 3], ["L", "Negro", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80"
    ],
    "Chaqueta Oversize Studio",
    "Chaquetas",
    42,
    24,
    true,
    [["S", "Negro", 2], ["M", "Negro", 3], ["L", "Beige", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80"
    ],
    "Blusa Silk Ivory",
    "Blusas",
    22,
    11,
    false,
    [["S", "Blanco", 4], ["M", "Blanco", 3], ["L", "Crema", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    "Top Urban Ribbed",
    "Tops",
    16,
    8,
    true,
    [["S", "Negro", 5], ["M", "Negro", 4], ["S", "Blanco", 3]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&w=900&q=80"
    ],
    "Blusa Atelier Olive",
    "Blusas",
    24,
    12,
    false,
    [["S", "Verde", 3], ["M", "Verde", 3], ["L", "Blanco", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80"
    ],
    "Pantalón Palazzo Tailored",
    "Pantalones",
    32,
    17,
    true,
    [["S", "Negro", 3], ["M", "Beige", 4], ["L", "Negro", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80"
    ],
    "Body Sculpt Essential",
    "Bodys",
    18,
    9,
    false,
    [["Única", "Negro", 5], ["Única", "Blanco", 4], ["Única", "Marrón", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=900&q=80"
    ],
    "Top Knit Minimalist",
    "Tops",
    19,
    9.5,
    false,
    [["S", "Crema", 3], ["M", "Crema", 3], ["M", "Negro", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    ],
    "Conjunto Monochrome",
    "Conjuntos",
    46,
    25,
    true,
    [["S", "Negro", 2], ["M", "Negro", 3], ["L", "Gris", 2]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
    ],
    "Vestido Breeze Midi",
    "Vestidos",
    31,
    16,
    false,
    [["S", "Blanco", 2], ["M", "Blanco", 3], ["L", "Verde", 1]]
  ],
  [
    [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=900&q=80"
    ],
    "Body Velvet Night",
    "Bodys",
    21,
    10.5,
    false,
    [["Única", "Negro", 4], ["Única", "Verde", 3]]
  ]
];

const EMPAQUES_SEED = [
  { id: "bolsa_mediana", nombre: "Bolsa mediana", tipo: "bolsa", cantidad: 28, costo_unit: 1.4 },
  { id: "bolsa_grande", nombre: "Bolsa grande", tipo: "bolsa", cantidad: 19, costo_unit: 1.6 },
  { id: "etiqueta", nombre: "Etiqueta / tarjeta de agradecimiento", tipo: "etiqueta", cantidad: 450, costo_unit: 0.02 },
];

/* ---------- Utilidades ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const money = n => "$" + (Number(n) || 0).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
const suma = (arr, f) => arr.reduce((a, x) => a + (Number(f(x)) || 0), 0);
const splitLista = s => [...new Set(String(s || "").split(",").map(x => x.trim()).filter(Boolean))];
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function leerNumero(valor) {
  let s = String(valor ?? "").trim().replace(/\s+/g, "").replace(/\$|usd|bs\.?/gi, "");
  if (s === "") return 0;
  const comas = (s.match(/,/g) || []).length, puntos = (s.match(/\./g) || []).length;
  if (comas && puntos) {
    const u = Math.max(s.lastIndexOf(","), s.lastIndexOf("."));
    s = s.slice(0, u).replace(/[.,]/g, "") + "." + s.slice(u + 1).replace(/[.,]/g, "");
  } else if (comas + puntos > 1) {
    s = s.replace(/[.,]/g, "");
  } else {
    s = s.replace(",", ".");
  }
  if (!/^-?\d*\.?\d*$/.test(s) || !/\d/.test(s)) return NaN;
  return Number(s);
}

function textoMovimiento(tipo, monto) {
  if (tipo === "capital") return `inyectó capital de afuera por ${money(monto)}`;
  if (tipo === "retiro") return `hizo un retiro de ${money(monto)}`;
  if (tipo === "mercancia") return `registró una compra de mercancía por ${money(monto)}`;
  return `registró un gasto por ${money(monto)}`;
}

function comprimir(file, max = 900) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * s);
      c.height = Math.round(img.height * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => (b ? resolve(b) : reject(new Error("No se pudo procesar la foto"))), "image/jpeg", 0.85);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Archivo de imagen no válido")); };
    img.src = url;
  });
}

/* ---------- Excel de cada tanda ---------- */
function generarXlsx(l) {
  const rows = [];
  const add = (...c) => { rows.push(c); return rows.length; };
  const fila = () => rows.length + 1;

  add("NOVA ATELIER · REGISTRO DE TANDA");
  add("Tanda", l.nombre);
  add("Fecha", new Date(l.creado_en).toLocaleString("es-VE"));
  add("Registrada por", l.usuaria);
  add();
  add("PRENDAS");
  add("Prenda", "Talla", "Color", "Cantidad", "Costo c/u (USD)", "Total (USD)");
  const ini = fila();
  for (const i of l.items) {
    const r = fila();
    add(i.nombre, i.talla === "Única" ? "Talla única" : i.talla, i.color, i.cantidad, i.costo_unit,
      { t: "n", f: `D${r}*E${r}`, v: i.cantidad * i.costo_unit });
  }
  const fin = rows.length;
  const rSub = add("", "", "", "", "Subtotal prendas",
    { t: "n", f: `SUM(F${ini}:F${fin})`, v: suma(l.items, i => i.cantidad * i.costo_unit) });
  add();
  add("EMPAQUES Y ENVÍO");
  add("Concepto", "", "", "Cantidad", "Costo c/u (USD)", "Total (USD)");
  const ini2 = fila();
  for (const e of l.empaques) {
    const r = fila();
    add(e.nombre, "", "", e.cantidad, e.costo_unit, { t: "n", f: `D${r}*E${r}`, v: e.cantidad * e.costo_unit });
  }
  if (l.costo_envio > 0) {
    const r = fila();
    add("Envío", "", "", 1, l.costo_envio, { t: "n", f: `D${r}*E${r}`, v: l.costo_envio });
  }
  const fin2 = rows.length;
  let rEmp = null;
  if (fin2 >= ini2) {
    const valEmp = suma(l.empaques, e => e.cantidad * e.costo_unit) + (l.costo_envio || 0);
    rEmp = add("", "", "", "", "Subtotal empaques y envío", { t: "n", f: `SUM(F${ini2}:F${fin2})`, v: valEmp });
  }
  add();
  const formulaTotal = rEmp ? `F${rSub}+F${rEmp}` : `F${rSub}`;
  add("", "", "", "", "TOTAL DE LA TANDA", { t: "n", f: formulaTotal, v: l.total });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws["!cols"] = [{ wch: 36 }, { wch: 14 }, { wch: 26 }, { wch: 12 }, { wch: 22 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Tanda");
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}

/* ---------- Almacenamiento Local Compartido (na_*) ---------- */
const LS = {
  get(k, def) {
    try { const v = localStorage.getItem("na_" + k); return v === null ? def : JSON.parse(v); }
    catch { return def; }
  },
  set(k, v) {
    try { localStorage.setItem("na_" + k, JSON.stringify(v)); } catch { /* noop */ }
  },
};

function seedDemo() {
  const ahora = new Date();
  const isoHoy = ahora.toISOString();
  const haceDias = d => new Date(ahora.getTime() - d * 86400000).toISOString();

  const productos = SEED.map(([fotos, nombre, categoria, precio, costo, destacado, variantes], idx) => ({
    id: `na-prod-${idx + 1}`,
    nombre,
    categoria,
    precio,
    costo,
    destacado,
    publicado: true,
    foto_url: fotos[0],
    fotos,
    variantes: variantes.map(([talla, color, stock]) => ({ talla, color, stock })),
    creado_en: isoHoy,
    actualizado_en: isoHoy,
  }));

  const ventas = [
    {
      id: "na-v-1",
      usuaria: "Administración Nova",
      items: [
        { producto_id: "na-prod-1", nombre: "Vestido Emerald Satin", talla: "M", color: "Verde", cantidad: 1, precio: 34, costo: 18 },
        { producto_id: "na-prod-5", nombre: "Top Urban Ribbed", talla: "S", color: "Negro", cantidad: 1, precio: 16, costo: 8 }
      ],
      total: 50,
      costo_total: 26,
      bolsa: "bolsa_mediana",
      etiquetas: 2,
      creado_en: isoHoy,
    },
    {
      id: "na-v-2",
      usuaria: "Administración Nova",
      items: [
        { producto_id: "na-prod-3", nombre: "Chaqueta Oversize Studio", talla: "M", color: "Negro", cantidad: 1, precio: 42, costo: 24 },
        { producto_id: "na-prod-7", nombre: "Pantalón Palazzo Tailored", talla: "M", color: "Beige", cantidad: 1, precio: 32, costo: 17 }
      ],
      total: 74,
      costo_total: 41,
      bolsa: "bolsa_mediana",
      etiquetas: 2,
      creado_en: haceDias(1),
    },
    {
      id: "na-v-3",
      usuaria: "Administración Nova",
      items: [
        { producto_id: "na-prod-10", nombre: "Conjunto Monochrome", talla: "S", color: "Negro", cantidad: 1, precio: 46, costo: 25 }
      ],
      total: 46,
      costo_total: 25,
      bolsa: "bolsa_mediana",
      etiquetas: 1,
      creado_en: haceDias(2),
    },
    {
      id: "na-v-4",
      usuaria: "Administración Nova",
      items: [
        { producto_id: "na-prod-2", nombre: "Vestido Noir Minimal", talla: "S", color: "Negro", cantidad: 2, precio: 29, costo: 15 }
      ],
      total: 58,
      costo_total: 30,
      bolsa: "bolsa_mediana",
      etiquetas: 2,
      creado_en: haceDias(3),
    },
    {
      id: "na-v-5",
      usuaria: "Administración Nova",
      items: [
        { producto_id: "na-prod-4", nombre: "Blusa Silk Ivory", talla: "S", color: "Blanco", cantidad: 1, precio: 22, costo: 11 },
        { producto_id: "na-prod-8", nombre: "Body Sculpt Essential", talla: "Única", color: "Negro", cantidad: 1, precio: 18, costo: 9 }
      ],
      total: 40,
      costo_total: 20,
      bolsa: "bolsa_mediana",
      etiquetas: 2,
      creado_en: haceDias(5),
    }
  ];

  const movimientos = [
    { id: "na-m-1", usuaria: "Administración Nova", tipo: "capital", concepto: "Fondo inicial de caja operativa", monto: 300, creado_en: haceDias(7) },
    { id: "na-m-2", usuaria: "Administración Nova", tipo: "mercancia", concepto: "Prendas · Tanda 1 · Colección Emerald", monto: 210, creado_en: haceDias(6) },
    { id: "na-m-3", usuaria: "Administración Nova", tipo: "gasto", concepto: "Bolsas y etiquetas personalizadas", monto: 28.5, creado_en: haceDias(4) },
  ];

  const lotes = [
    {
      id: "na-l-1",
      numero: 1,
      descripcion: "Colección Emerald",
      nombre: "Tanda 1 · Colección Emerald",
      usuaria: "Administración Nova",
      costo_envio: 15,
      items: [
        { producto_id: "na-prod-1", nombre: "Vestido Emerald Satin", talla: "M", color: "Verde", cantidad: 5, costo_unit: 18 },
        { producto_id: "na-prod-3", nombre: "Chaqueta Oversize Studio", talla: "M", color: "Negro", cantidad: 5, costo_unit: 24 }
      ],
      empaques: [
        { id: "bolsa_mediana", nombre: "Bolsa mediana", cantidad: 20, costo_unit: 1.4 }
      ],
      total: 253,
      creado_en: haceDias(6),
    }
  ];

  const tasas = [
    { fecha: ymd(ahora), valor: 919.82, usuaria: "Administración Nova", creado_en: isoHoy },
    { fecha: ymd(new Date(ahora.getTime() - 86400000)), valor: 918.50, usuaria: "Administración Nova", creado_en: haceDias(1) },
    { fecha: ymd(new Date(ahora.getTime() - 2 * 86400000)), valor: 917.10, usuaria: "Administración Nova", creado_en: haceDias(2) },
  ];

  const actividad = [
    { id: "na-a-1", usuaria: "Administración Nova", texto: "registró una venta por $50,00 (Vestido Emerald Satin + Top Urban Ribbed)", creado_en: isoHoy },
    { id: "na-a-2", usuaria: "Administración Nova", texto: "actualizó la tasa BCV a 919,82 Bs/USD", creado_en: isoHoy },
    { id: "na-a-3", usuaria: "Administración Nova", texto: "publicó 12 prendas en el catálogo web", creado_en: haceDias(1) },
  ];

  const recordatorios = [
    { id: "na-r-1", usuaria: "Administración Nova", tipo: "cobro", texto: "Cliente Valeria · Apartado Conjunto Monochrome", monto: 23, hecho: false, creado_en: haceDias(1) },
    { id: "na-r-2", usuaria: "Administración Nova", tipo: "pago", texto: "Proveedor de empaques y bolsas", monto: 35, hecho: false, creado_en: haceDias(2) },
  ];

  const notas = [
    { id: "na-n-1", usuaria: "Administración Nova", texto: "Tomar fotos de la nueva cápsula de chaquetas oversize", hecha: false, creado_en: isoHoy },
    { id: "na-n-2", usuaria: "Administración Nova", texto: "Verificar stock de tallas S y M para el fin de semana", hecha: true, creado_en: haceDias(1) },
  ];

  LS.set("productos", productos);
  LS.set("empaques", EMPAQUES_SEED);
  LS.set("lotes", lotes);
  LS.set("movimientos", movimientos);
  LS.set("ventas", ventas);
  LS.set("actividad", actividad);
  LS.set("recordatorios", recordatorios);
  LS.set("notas", notas);
  LS.set("tasas", tasas);
  LS.set("perfiles", [{ usuaria: "Administración Nova", emoji: "✨", color: "#00FF88", frase: "Diseño urbano y gestión inteligente en tiempo real." }]);
  LS.set("sitio", SITIO_SEED);
  LS.set("categorias", ["Vestidos", "Chaquetas", "Blusas", "Tops", "Pantalones", "Bodys", "Conjuntos"]);
  LS.set("cierres", []);
  LS.set("version", DEMO_VERSION);
}

// Garantiza que los datos iniciales existan desde la primera apertura (tanto en admin.html como en catalogo.html)
if (LS.get("version", 0) !== DEMO_VERSION || !Array.isArray(LS.get("productos", null)) || !LS.get("productos", []).length) {
  seedDemo();
}

function colAdd(k, row) { const arr = LS.get(k, []); arr.unshift(row); LS.set(k, arr); }
function colUpd(k, id, campos) { const arr = LS.get(k, []); const x = arr.find(y => y.id === id); if (x) Object.assign(x, campos); LS.set(k, arr); }
function colDel(k, id) { LS.set(k, LS.get(k, []).filter(y => y.id !== id)); }

const currentUserName = () => (typeof state !== "undefined" && state.usuaria ? state.usuaria.nombre : "Administración Nova");

function demoLog(texto) {
  const a = LS.get("actividad", []);
  a.unshift({ id: uid(), usuaria: currentUserName(), texto, creado_en: new Date().toISOString() });
  LS.set("actividad", a.slice(0, 200));
}

const DB = {
  async productos() { return LS.get("productos", []); },
  async ventas() { return LS.get("ventas", []); },
  async movs() { return LS.get("movimientos", []); },
  async act() { return LS.get("actividad", []); },
  async lotes() { return LS.get("lotes", []); },
  async empaques() { return LS.get("empaques", []); },
  async perfiles() { return LS.get("perfiles", []); },
  async sitioImagenes() { return LS.get("sitio", SITIO_SEED); },
  async categorias() { return LS.get("categorias", ["Vestidos", "Chaquetas", "Blusas", "Tops", "Pantalones", "Bodys", "Conjuntos"]); },
  async cierres() { return LS.get("cierres", []); },

  async guardarCategoria(nombre) {
    const arr = LS.get("categorias", []);
    if (!arr.includes(nombre)) { arr.push(nombre); LS.set("categorias", arr); }
  },

  async subirFotoSitio(clave, blob) {
    const url = await this.subirFoto(blob);
    const arr = LS.get("sitio", SITIO_SEED);
    const row = arr.find(x => x.clave === clave);
    if (row) row.url = url;
    else arr.push({ clave, url });
    LS.set("sitio", arr);
    demoLog(`actualizó la foto "${clave}" del catálogo web`);
    return url;
  },

  async guardarPerfil(usuaria, campos) {
    const arr = LS.get("perfiles", []);
    const x = arr.find(p => p.usuaria === usuaria);
    if (x) Object.assign(x, campos); else arr.push({ usuaria, ...campos });
    LS.set("perfiles", arr);
  },

  subirFotoPerfil(usuaria, blob) {
    return this.subirFoto(blob);
  },

  async recordatorios() { return LS.get("recordatorios", []); },
  async notas() { return LS.get("notas", []); },
  async tasas() { return LS.get("tasas", []); },

  async guardarRecordatorio(r) {
    colAdd("recordatorios", { id: uid(), usuaria: currentUserName(), tipo: r.tipo, texto: r.texto, monto: r.monto, hecho: false, creado_en: new Date().toISOString() });
  },
  async cambiarRecordatorio(id, campos) { colUpd("recordatorios", id, campos); },
  async borrarRecordatorio(id) { colDel("recordatorios", id); },
  async guardarNota(texto) {
    colAdd("notas", { id: uid(), usuaria: currentUserName(), texto, hecha: false, creado_en: new Date().toISOString() });
  },
  async cambiarNota(id, campos) { colUpd("notas", id, campos); },
  async borrarNota(id) { colDel("notas", id); },

  async guardarTasa(fecha, valor) {
    const arr = LS.get("tasas", []).filter(t => t.fecha !== fecha);
    arr.push({ fecha, valor, usuaria: currentUserName(), creado_en: new Date().toISOString() });
    LS.set("tasas", arr);
    demoLog(`actualizó la tasa BCV a ${valor} Bs/USD`);
  },

  async guardarProducto(p) {
    const arr = LS.get("productos", []);
    const i = p.id ? arr.findIndex(x => x.id === p.id) : -1;
    const ahora = new Date().toISOString();
    if (i >= 0) arr[i] = { ...arr[i], ...p, actualizado_en: ahora };
    else arr.unshift({ ...p, id: uid(), creado_en: ahora, actualizado_en: ahora });
    LS.set("productos", arr);
    demoLog(`${i >= 0 ? "editó" : "creó"} la prenda "${p.nombre}"`);
  },

  async actualizarCampos(id, campos) {
    const arr = LS.get("productos", []);
    const p = arr.find(x => x.id === id);
    if (p) Object.assign(p, campos, { actualizado_en: new Date().toISOString() });
    LS.set("productos", arr);
  },

  async borrarProducto(id) {
    LS.set("productos", LS.get("productos", []).filter(x => x.id !== id));
  },

  async ajustarInventario(productos, empaques) {
    const prods = LS.get("productos", []);
    const emp = LS.get("empaques", []);
    for (const p of productos) {
      const x = prods.find(y => y.id === p.id);
      if (!x) throw new Error("Una prenda ya no existe");
      p.stocks.forEach((s, i) => { if (x.variantes[i]) x.variantes[i].stock = Math.max(0, Number(s) || 0); });
    }
    for (const e of empaques) {
      const target = emp.find(y => y.id === e.id);
      if (target) target.cantidad = Math.max(0, Number(e.cantidad) || 0);
    }
    LS.set("productos", prods);
    LS.set("empaques", emp);
    demoLog("ajustó el inventario físico");
  },

  subirFoto(blob) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(new Error("No se pudo leer la foto"));
      r.readAsDataURL(blob);
    });
  },

  async venta(items, bolsa, etiquetas) {
    const prods = LS.get("productos", []);
    const emp = LS.get("empaques", []);
    const etq = Number(etiquetas) || 0;
    const lineas = [];
    let total = 0, costo = 0;
    for (const it of items) {
      const p = prods.find(x => x.id === it.producto_id);
      if (!p) throw new Error("Una prenda ya no existe");
      const v = p.variantes.find(x => x.talla === it.talla && x.color === it.color);
      if (!v) throw new Error(`La variante elegida no existe para ${p.nombre}`);
      if (v.stock < it.cantidad) throw new Error(`Sin existencias de ${p.nombre} (${it.talla} ${it.color}). Quedan ${v.stock}`);
      v.stock -= it.cantidad;
      total += p.precio * it.cantidad;
      costo += p.costo * it.cantidad;
      lineas.push({ producto_id: p.id, nombre: p.nombre, talla: it.talla, color: it.color, cantidad: it.cantidad, precio: p.precio, costo: p.costo });
    }
    if (bolsa) {
      const b = emp.find(x => x.id === bolsa);
      if (!b || b.cantidad < 1) throw new Error("No hay bolsas de ese tamaño disponibles");
      b.cantidad -= 1;
    }
    if (etq > 0) {
      const e = emp.find(x => x.id === "etiqueta");
      if (!e || e.cantidad < etq) throw new Error("No hay suficientes etiquetas");
      e.cantidad -= etq;
    }
    LS.set("productos", prods);
    LS.set("empaques", emp);
    const ventas = LS.get("ventas", []);
    ventas.unshift({ id: uid(), usuaria: currentUserName(), items: lineas, total, costo_total: costo, bolsa: bolsa || null, etiquetas: etq, creado_en: new Date().toISOString() });
    LS.set("ventas", ventas);
    demoLog(`registró una venta por ${money(total)}`);
  },

  async movimiento(tipo, concepto, monto) {
    if (!(["gasto", "mercancia", "retiro", "capital"].includes(tipo))) throw new Error("Tipo de movimiento inválido");
    if (!(monto > 0)) throw new Error("El monto debe ser mayor que cero");
    const arr = LS.get("movimientos", []);
    arr.unshift({ id: uid(), usuaria: currentUserName(), tipo, concepto, monto: Math.round(monto * 100) / 100, creado_en: new Date().toISOString() });
    LS.set("movimientos", arr);
    demoLog(textoMovimiento(tipo, monto));
  },

  async registrarLote(descripcion, envio, items, empaquesIn) {
    const desc = String(descripcion || "").trim().slice(0, 60);
    const env = Number(envio) || 0;
    if (env < 0) throw new Error("El envío no puede ser negativo");
    if (!items.length) throw new Error("La tanda no tiene prendas");
    const prods = LS.get("productos", []);
    const emp = LS.get("empaques", []);
    const lotes = LS.get("lotes", []);
    const numero = Math.max(0, ...lotes.map(l => Number(l.numero) || 0)) + 1;
    const nombre = `Tanda ${numero}` + (desc ? ` · ${desc}` : "");

    const lineas = [];
    let tPren = 0;
    for (const it of items) {
      if (!(it.cantidad > 0)) throw new Error("Cantidad inválida");
      if (!(it.costo_unit >= 0)) throw new Error("Costo inválido");
      const p = prods.find(x => x.id === it.producto_id);
      if (!p) throw new Error("Una prenda ya no existe");
      const v = p.variantes.find(x => x.talla === it.talla && x.color === it.color);
      if (v) v.stock += it.cantidad;
      else p.variantes.push({ talla: it.talla, color: it.color, stock: it.cantidad });
      p.costo = it.costo_unit;
      tPren += it.cantidad * it.costo_unit;
      lineas.push({ producto_id: p.id, nombre: p.nombre, talla: it.talla, color: it.color, cantidad: it.cantidad, costo_unit: it.costo_unit });
    }
    let tEmp = 0;
    const empl = [];
    for (const e of empaquesIn) {
      if (!(e.cantidad > 0)) continue;
      const x = emp.find(y => y.id === e.id);
      if (!x) throw new Error("Empaque no válido");
      x.cantidad += e.cantidad;
      x.costo_unit = e.costo_unit;
      tEmp += e.cantidad * e.costo_unit;
      empl.push({ id: x.id, nombre: x.nombre, cantidad: e.cantidad, costo_unit: e.costo_unit });
    }
    LS.set("productos", prods);
    LS.set("empaques", emp);

    const lote = {
      id: uid(), numero, descripcion: desc, nombre,
      usuaria: currentUserName(), costo_envio: env, items: lineas, empaques: empl,
      total: tPren + env + tEmp, creado_en: new Date().toISOString(),
    };
    lotes.unshift(lote);
    LS.set("lotes", lotes);

    const movs = LS.get("movimientos", []);
    const add = (tipo, concepto, monto) => movs.unshift({ id: uid(), usuaria: currentUserName(), tipo, concepto, monto: Math.round(monto * 100) / 100, creado_en: new Date().toISOString() });
    if (tPren > 0) add("mercancia", "Prendas · " + nombre, tPren);
    if (env > 0) add("gasto", "Envío · " + nombre, env);
    if (tEmp > 0) add("gasto", "Empaques · " + nombre, tEmp);
    LS.set("movimientos", movs);
    demoLog(`registró ${nombre} por ${money(lote.total)}`);
    return { id: lote.id, numero, nombre };
  },

  async archivarLote(id, blob) {
    const dataUrl = await new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = () => rej(new Error("No se pudo guardar el Excel"));
      r.readAsDataURL(blob);
    });
    const lotes = LS.get("lotes", []);
    const l = lotes.find(x => x.id === id);
    if (l) { l.archivo = dataUrl; LS.set("lotes", lotes); }
  },
  async archivoLote(l) {
    if (!l.archivo) return null;
    return (await fetch(l.archivo)).blob();
  },

  async cerrarPeriodoManual() {
    const cierres = LS.get("cierres", []);
    const ultimo = cierres.length ? cierres[0].hasta : "2000-01-01T00:00:00-04:00";
    const ahora = new Date();
    const hasta = ahora.toISOString();
    const tDesde = new Date(ultimo).getTime();
    const ventas = LS.get("ventas", []).filter(v => new Date(v.creado_en).getTime() > tDesde);
    const movs = LS.get("movimientos", []).filter(m => new Date(m.creado_en).getTime() > tDesde);
    const totalVentas = ventas.reduce((a, v) => a + Number(v.total), 0);
    const costoVentas = ventas.reduce((a, v) => a + Number(v.costo_total), 0);
    const gastos = movs.filter(m => m.tipo === "gasto").reduce((a, m) => a + Number(m.monto), 0);
    const periodo = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, "0")}`;
    const numero = cierres.filter(c => c.periodo === periodo).length + 1;
    const nuevo = {
      id: uid(),
      periodo,
      numero,
      tipo: "manual",
      desde: ultimo,
      hasta,
      creado_por: currentUserName(),
      cantidad_ventas: ventas.length,
      total_ventas: totalVentas,
      costo_ventas: costoVentas,
      gastos,
    };
    cierres.unshift(nuevo);
    LS.set("cierres", cierres);
    demoLog(`cerró manualmente el período ${periodo} (cierre ${numero})`);
    return nuevo;
  },

  async cerrarPendiente() {
    return false;
  },
};

/* ---------- Tasa Oficial BCV Automática en Tiempo Real ---------- */
function tasaBcvActual() {
  const cache = Number(localStorage.getItem("na_bcv_live"));
  if (cache > 0) return cache;
  const tasas = LS.get("tasas", []);
  if (Array.isArray(tasas) && tasas.length && Number(tasas[0].valor) > 0) {
    return Number(tasas[0].valor);
  }
  return 919.82;
}

function pintarBadgesBcv(valor) {
  const num = Number(valor) || tasaBcvActual();
  const fmt = num.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.querySelectorAll("[data-bcv-valor]").forEach(el => {
    el.textContent = `Bs. ${fmt}`;
  });
}

async function obtenerTasaBcvAutomatica() {
  pintarBadgesBcv(tasaBcvActual());
  try {
    const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const promedio = Number(data && data.promedio);
    if (promedio > 0) {
      const tasa = Math.round(promedio * 100) / 100;
      localStorage.setItem("na_bcv_live", String(tasa));
      const hoy = ymd(new Date());
      const arr = LS.get("tasas", []).filter(t => t.fecha !== hoy);
      arr.unshift({ fecha: hoy, valor: tasa, usuaria: "BCV Automático", creado_en: new Date().toISOString() });
      LS.set("tasas", arr);
      pintarBadgesBcv(tasa);
      window.dispatchEvent(new CustomEvent("bcv-actualizada", { detail: { tasa } }));
      return tasa;
    }
  } catch (_e) {
    // Usa caché o semilla local si no hay conexión
  }
  const fallback = tasaBcvActual();
  pintarBadgesBcv(fallback);
  return fallback;
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => obtenerTasaBcvAutomatica());
  } else {
    obtenerTasaBcvAutomatica();
  }
}

