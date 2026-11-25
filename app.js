/* ==========================================================================
   PORTAFOLIO JULIO ACERO · Sincronización BCV + Traducción ES / EN (app.js)
   Consulta la tasa oficial del BCV en tiempo real y permite cambiar todo el
   portafolio entre Español (ES) e Inglés (EN).
   ========================================================================== */
"use strict";

const BCV_CACHE_KEY = "portafolio_bcv_tasa_oficial";
const BCV_FALLBACK = 919.82;
const LANG_KEY = "portafolio_lang";

const I18N = {
  es: {
    nav_home: "01. Inicio",
    nav_systems: "02. Sistemas en Venta",
    nav_pricing: "03. Precios Estándar",
    nav_contact: "04. Contacto",
    bcv_today: "BCV Hoy:",
    s1_step: "Sección 01 • Presentación",
    s1_title: "Sistemas web administrativos y catálogos digitales listos para tu negocio",
    s1_sub: "Desarrollo herramientas prácticas para comercios: control de ventas por Cashea, conversión automática a tasa oficial del BCV, inventario en tiempo real y reportes contables en Excel. Entra directamente a cada sistema para probarlo completo.",
    s1_btn_demos: "Ver Sistemas y Entrar a las Demos",
    s1_btn_prices: "Ver Precios Estándar",
    s1_h1_title: "Tasa BCV Automática",
    s1_h1_desc: "Todos los sistemas consultan la tasa oficial del BCV en vivo y calculan montos en USD y Bs.",
    s1_h2_title: "Adaptados a PC y Teléfono",
    s1_h2_desc: "Botones y tablas optimizados para usarse cómodamente desde cualquier pantalla sin desbordes.",
    mock_sales: "Ventas",
    mock_down: "Inicial",
    mock_bcv: "Tasa BCV hoy",
    mock_verified: "Pago comprobado",
    mock_close: "Cierre del mes",
    s2_step: "Sección 02 • Sistemas en Venta",
    s2_title: "Elige un sistema e ingresa para probarlo",
    s2_desc: "Cada proyecto se abre en pantalla completa con datos ficticios de demostración y tasa oficial BCV activa para que evalúes su funcionamiento real.",
    p1_badge: "Proyecto 01 • Gestión Cashea",
    p1_folder: "Sistema Cashea",
    p1_title: "Nexus Pay • Administrador Cashea & Calculadora BCV",
    p1_desc: "Controla las ventas financiadas con Cashea: inicial, monto financiado y comisión del 8%.",
    p1_f1: "<strong>Calculadora BCV:</strong> precios en USD, IVA 16% e inicial editable.",
    p1_f2: "<strong>Multisucursal:</strong> Factura Fiscal y Factura Cashea por sede.",
    p1_f3: "<strong>Cierre en Excel:</strong> comprueba pagos y exporta el cierre mensual.",
    p1_btn1: "Entrar al Admin Cashea",
    p1_btn2: "Abrir Calculadora BCV",
    p2_badge: "Proyecto 02 • E-Commerce + POS",
    p2_folder: "Catálogo + Panel Admin",
    p2_title: "Nova Atelier • Catálogo Web + Panel Admin de Ropa",
    p2_desc: "Catálogo público para clientes y panel admin para inventario, ventas y caja.",
    p2_f1: "<strong>Catálogo:</strong> tallas, colores y pedido directo por WhatsApp.",
    p2_f2: "<strong>Panel admin:</strong> POS, inventario por variantes y caja.",
    p2_f3: "<strong>Analítica:</strong> gráficas de ventas y cierre mensual en Excel.",
    p2_btn1: "Entrar al Catálogo Web",
    p2_btn2: "Entrar al Panel Admin",
    s3_step: "Sección 03 • Precios Estándar",
    s3_title: "Inversión clara según el sistema que necesites",
    s3_desc: "Precios comerciales accesibles de pago único para negocios y emprendimientos. Incluyen adaptación de nombre, colores de tu marca y capacitación de uso.",
    price_once: "USD / pago único",
    pl1_tag: "Sistema Individual",
    pl1_name: "Módulo Cashea & Calculadora BCV",
    pl1_sub: "Ideal para comercios que necesitan ordenar sus ventas financiadas y cuadrar liquidaciones.",
    pl1_f1: "Calculadora de Venta con tasa BCV en vivo e inicial editable.",
    pl1_f2: "Panel de Facturas Fiscales y Cashea hasta para 3 sucursales.",
    pl1_f3: "Comprobador de pagos recibidos y Cierre de Mes en Excel.",
    pl1_f4: "Personalización con el nombre y colores de tu negocio.",
    pl2_tag: "Más Solicitado",
    pl2_name: "Catálogo Web + Panel Admin Tienda",
    pl2_sub: "Solución completa para tiendas de ropa o calzado con catálogo público e inventario sincronizado.",
    pl2_f1: "Catálogo Web público con selector de talla/color y carrito a WhatsApp.",
    pl2_f2: "Panel Administrativo de 8 módulos (POS, Inventario, Tandas y Caja BCV).",
    pl2_f3: "Precios automáticos en USD y Bolívares con tasa oficial BCV.",
    pl2_f4: "Gráficas de rendimiento y reportes contables en Excel.",
    pl3_tag: "Pack Completo",
    pl3_name: "Suite Comercial Completa (Todo en Uno)",
    pl3_sub: "Combina el Catálogo Web + Panel Admin de Inventario + Módulo Especializado Cashea.",
    pl3_f1: "Incluye los 3 sistemas integrados bajo la identidad de tu marca.",
    pl3_f2: "Configuración y puesta en marcha. El costo de dominio y hosting corre por cuenta del comercio.",
    pl3_f3: "Una ronda de ajustes iniciales incluida. Cambios adicionales se cotizan aparte.",
    pl3_f4: "30 días de garantía: soporte por errores de código durante ese periodo.",
    btn_request: "Solicitar este sistema",
    btn_quote_suite: "Cotizar Suite Completa",
    price_note: "Precios en dólares (USD), pago único. Incluyen 30 días de garantía por errores de código. Dominio, hosting y funciones nuevas no están incluidos y se cotizan aparte.",
    s4_step: "Sección 04 • Contacto",
    s4_title: "¿Te interesa implementar alguno de estos sistemas?",
    s4_desc: "Ya puedes probar las demostraciones completas arriba. Si deseas adaptarlos con el nombre, logo y catálogo real de tu negocio, contáctame directamente por WhatsApp o correo electrónico para coordinar la entrega.",
    contact_email_lbl: "Correo:",
    btn_whatsapp: "Escribir por WhatsApp",
    btn_email: "Escribir por Correo",
    btn_back_sys: "Volver a los Sistemas",
    footer_rights: "Portafolio de Sistemas Comerciales",
  },
  en: {
    nav_home: "01. Home",
    nav_systems: "02. Systems for Sale",
    nav_pricing: "03. Standard Pricing",
    nav_contact: "04. Contact",
    bcv_today: "BCV Today:",
    s1_step: "Section 01 • Overview",
    s1_title: "Administrative web systems and digital catalogs ready for your business",
    s1_sub: "I build practical software tools for retail businesses: Cashea installment sales tracking, automatic official BCV exchange rate conversion, real-time inventory, and Excel accounting reports. Enter any system directly to test the full demo.",
    s1_btn_demos: "View Systems & Enter Live Demos",
    s1_btn_prices: "View Standard Pricing",
    s1_h1_title: "Automatic BCV Exchange Rate",
    s1_h1_desc: "All systems fetch the live official BCV rate and calculate totals in both USD and Bs.",
    s1_h2_title: "Desktop & Mobile Ready",
    s1_h2_desc: "Buttons and tables are optimized to fit comfortably on any screen without overflow.",
    mock_sales: "Sales",
    mock_down: "Initial",
    mock_bcv: "BCV Rate Today",
    mock_verified: "Payment Verified",
    mock_close: "Month Close",
    s2_step: "Section 02 • Systems for Sale",
    s2_title: "Choose a system and enter to test it live",
    s2_desc: "Each project opens in full screen with safe demo data and the live official BCV exchange rate so you can evaluate its real workflow.",
    p1_badge: "Project 01 • Cashea Management",
    p1_folder: "Cashea System",
    p1_title: "Nexus Pay • Cashea Admin & BCV Calculator",
    p1_desc: "Track Cashea financed sales: down payment, financed balance, and 8% platform fee.",
    p1_f1: "<strong>BCV Calculator:</strong> USD prices, 16% VAT, and editable down payment %.",
    p1_f2: "<strong>Multi-branch:</strong> Fiscal Invoice and Cashea Invoice per store branch.",
    p1_f3: "<strong>Excel Closing:</strong> verify received payouts and export monthly closing.",
    p1_btn1: "Enter Cashea Admin",
    p1_btn2: "Open BCV Calculator",
    p2_badge: "Project 02 • E-Commerce + POS",
    p2_folder: "Catalog + Admin Panel",
    p2_title: "Nova Atelier • Web Catalog + Clothing Admin Panel",
    p2_desc: "Public catalog for shoppers and full admin panel for inventory, POS sales, and cash flow.",
    p2_f1: "<strong>Web Catalog:</strong> sizes, colors, and direct WhatsApp checkout.",
    p2_f2: "<strong>Admin Panel:</strong> POS quick sale, variant stock matrix, and cash register.",
    p2_f3: "<strong>Analytics:</strong> sales charts and monthly accounting closing in Excel.",
    p2_btn1: "Enter Web Catalog",
    p2_btn2: "Enter Admin Panel",
    s3_step: "Section 03 • Standard Pricing",
    s3_title: "Clear investment tailored to the system you need",
    s3_desc: "Accessible one-time payment commercial pricing for businesses and entrepreneurs. Includes brand name customization, color adaptation, and training.",
    price_once: "USD / one-time payment",
    pl1_tag: "Single System",
    pl1_name: "Cashea Module & BCV Calculator",
    pl1_sub: "Ideal for stores that need to organize financed sales and reconcile settlements.",
    pl1_f1: "Sales Calculator with live BCV rate and editable down payment %.",
    pl1_f2: "Fiscal and Cashea invoice panel for up to 3 store branches.",
    pl1_f3: "Payout verification tool and Monthly Closing export in Excel.",
    pl1_f4: "Customized with your business name and brand colors.",
    pl2_tag: "Most Popular",
    pl2_name: "Web Catalog + Store Admin Panel",
    pl2_sub: "Complete solution for clothing or footwear stores with public catalog and synced inventory.",
    pl2_f1: "Public Web Catalog with size/color selector and WhatsApp cart.",
    pl2_f2: "8-module Admin Panel (POS, Inventory, Batches, and BCV Cash Flow).",
    pl2_f3: "Automatic prices in USD and Bolívares at the official BCV rate.",
    pl2_f4: "Performance charts and Excel accounting reports.",
    pl3_tag: "Full Bundle",
    pl3_name: "Complete Commercial Suite (All-in-One)",
    pl3_sub: "Combines the Web Catalog + Inventory Admin Panel + Specialized Cashea Module.",
    pl3_f1: "Includes all 3 systems integrated under your brand identity.",
    pl3_f2: "Setup and deployment included. Domain and hosting costs are covered by the business.",
    pl3_f3: "One round of initial adjustments included. Additional custom changes quoted separately.",
    pl3_f4: "30-day warranty: support for code bugs during that period.",
    btn_request: "Request this system",
    btn_quote_suite: "Quote Complete Suite",
    price_note: "Prices in US Dollars (USD), one-time payment. Includes a 30-day warranty for code bugs. Domain, hosting, and new custom features are not included and are quoted separately.",
    s4_step: "Section 04 • Contact",
    s4_title: "Interested in implementing one of these systems?",
    s4_desc: "You can test the full live demos above. If you'd like to customize them with your business name, logo, and real catalog, contact me directly via WhatsApp or email to coordinate delivery.",
    contact_email_lbl: "Email:",
    btn_whatsapp: "Message on WhatsApp",
    btn_email: "Send an Email",
    btn_back_sys: "Back to Systems",
    footer_rights: "Commercial Software Portfolio",
  },
};

function obtenerIdioma() {
  const saved = localStorage.getItem(LANG_KEY);
  return saved === "en" ? "en" : "es";
}

function aplicarIdioma(lang) {
  const idioma = lang === "en" ? "en" : "es";
  localStorage.setItem(LANG_KEY, idioma);
  document.documentElement.lang = idioma;
  const dict = I18N[idioma];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  const lbl = document.getElementById("lang-label");
  if (lbl) lbl.textContent = idioma === "es" ? "EN" : "ES";
  actualizarVistaTasaBcv(obtenerTasaGuardada());
}

function obtenerTasaGuardada() {
  const n = Number(localStorage.getItem(BCV_CACHE_KEY));
  return n > 0 ? n : BCV_FALLBACK;
}

function formatearBs(valor) {
  return (Number(valor) || 0).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function actualizarVistaTasaBcv(tasa) {
  const valor = Number(tasa) > 0 ? Number(tasa) : obtenerTasaGuardada();
  const textoTasa = `Bs. ${formatearBs(valor)}`;

  document.querySelectorAll("[data-bcv-valor]").forEach((el) => {
    el.textContent = textoTasa;
  });

  const idioma = obtenerIdioma();
  document.querySelectorAll("[data-usd-price]").forEach((el) => {
    const usd = Number(el.getAttribute("data-usd-price")) || 0;
    const bs = usd * valor;
    el.textContent = idioma === "en"
      ? `≈ Bs. ${formatearBs(bs)} at official BCV rate`
      : `≈ Bs. ${formatearBs(bs)} a tasa BCV oficial`;
  });
}

async function sincronizarTasaBcvOficial() {
  actualizarVistaTasaBcv(obtenerTasaGuardada());
  try {
    const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const promedio = Number(data && data.promedio);
    if (promedio > 0) {
      const tasa = Math.round(promedio * 100) / 100;
      localStorage.setItem(BCV_CACHE_KEY, String(tasa));
      actualizarVistaTasaBcv(tasa);
      return tasa;
    }
  } catch (_err) {
    // Mantiene la última tasa oficial guardada si no hay conexión a internet
  }
  return obtenerTasaGuardada();
}

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  aplicarIdioma(obtenerIdioma());

  const btnLang = document.getElementById("lang-toggle");
  if (btnLang) {
    btnLang.addEventListener("click", () => {
      aplicarIdioma(obtenerIdioma() === "es" ? "en" : "es");
    });
  }

  sincronizarTasaBcvOficial();
});
