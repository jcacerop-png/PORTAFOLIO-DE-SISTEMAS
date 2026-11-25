/* =========================================================
   NOVA ATELIER · Lógica del Catálogo Público (con Visor de Imágenes + ES/EN)
   Lee las prendas publicadas desde data.js (almacenamiento local
   compartido con admin.html) y actualiza en tiempo real.
   ========================================================= */
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "584248901496";
  const CART_KEY = "na_catalogo_carrito_v1";
  const LANG_KEY = "portafolio_lang";
  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

  const SIN_FOTO = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">' +
    '<rect width="600" height="800" fill="#11151C"/>' +
    '<rect x="40" y="40" width="520" height="720" rx="24" fill="#171C26" stroke="#00FF88" stroke-width="2" stroke-opacity="0.35"/>' +
    '<text x="300" y="390" font-family="DM Sans, sans-serif" font-size="38" font-weight="bold" fill="#00FF88" text-anchor="middle">NOVA ATELIER</text>' +
    '<text x="300" y="440" font-family="DM Sans, sans-serif" font-size="18" fill="#94A3B8" text-anchor="middle">Collection Piece</text></svg>'
  );

  const COLOR_HEX = {
    negro: "#141414", blanco: "#f4f6f5", vinotinto: "#7a1f2b", rojo: "#b3262e", "rosa pastel": "#f3c6d3",
    rosa: "#e88aa6", "azul oscuro": "#1f2d4d", azul: "#3b6fb6", marron: "#7b5438", "marrón": "#7b5438",
    beige: "#d9c6a5", verde: "#00FF88", gris: "#8b9490", crema: "#f5ecd2",
  };

  const CAT_MAP_EN = {
    Vestidos: "Dresses",
    Chaquetas: "Jackets",
    Blusas: "Blouses",
    Tops: "Tops",
    Pantalones: "Pants",
    Bodys: "Bodysuits",
    Conjuntos: "Sets",
  };

  const COLOR_MAP_EN = {
    Verde: "Green",
    Negro: "Black",
    Blanco: "White",
    Beige: "Beige",
    Crema: "Cream",
    Gris: "Gray",
    Marrón: "Brown",
    Marron: "Brown",
    Azul: "Blue",
    Rosa: "Pink",
    Rojo: "Red",
    Vinotinto: "Burgundy",
  };

  const I18N = {
    es: {
      ann_bar: "Envíos a nivel nacional • Pedidos directos por WhatsApp • Nueva Colección Emerald",
      nav_home: "Inicio",
      nav_collection: "Colección",
      nav_about: "Nosotros",
      nav_styling: "Asesoría",
      nav_faq: "Preguntas",
      nav_admin: "Admin",
      nav_cart: "Carrito",
      hero_eye: "Colección Contemporánea • Edición 2026",
      hero_title: "Tu outfit<br>perfecto<br><em>está aquí</em>",
      hero_desc: "Prendas de diseño minimalista para acompañarte todos los días. Explora nuestra selección en tiempo real, elige tu talla y arma tu look ideal.",
      hero_btn1: "Explorar la colección",
      hero_btn2: "Abrir Panel Admin",
      hero_note_t: "Estilo contemporáneo",
      hero_note_d: "Cortes limpios, texturas suaves y stock sincronizado en vivo.",
      btn_inspect: "Inspeccionar",
      tick_1: "Stock Sincronizado en Tiempo Real",
      tick_2: "Atención Personalizada por WhatsApp",
      tick_3: "Fotografías Libres de Derechos",
      tick_4: "Conectado al Panel Administrativo",
      col_eye: "Piezas seleccionadas",
      col_title: "La colección",
      search_ph: "Buscar por nombre, categoría o color...",
      sort_lbl: "Ordenar",
      sort_all: "Todos",
      sort_feat: "Destacados",
      sort_asc: "Menor precio",
      sort_desc: "Mayor precio",
      story_eye: "Hola, somos Nova Atelier",
      story_title: "Descubre<br>nuestra tienda",
      story_desc: "Somos un estudio de moda contemporánea enfocado en prendas versátiles, cortes modernos y una experiencia de compra digital conectada directamente con nuestro inventario en vivo.",
      story_btn: "Conócenos un poco más",
      srv_eye: "Estamos para ayudarte",
      srv_title: "Asesoría Nova Atelier",
      srv1_t: "Asesoría de estilo",
      srv1_d: "¿No sabes qué combinación elegir? Escríbenos y te ayudamos a seleccionar las piezas que mejor se adaptan a tu estilo.",
      srv2_t: "Encuentra tu talla",
      srv2_d: "Si estás entre dos tallas, cuéntanos cómo prefieres el ajuste de cada prenda y te recomendamos la medida exacta.",
      srv3_t: "Un look completo",
      srv3_d: "Armamos combinaciones completas de vestidos, chaquetas, blusas y pantalones listas para cualquier ocasión.",
      srv_btn: "Ver prendas disponibles",
      faq_eye: "Lo que necesitas saber",
      faq_title: "Preguntas frecuentes",
      faq_sub: '¿Deseas administrar las prendas, precios o existencias de este catálogo? Entra al <a href="admin.html">Panel Administrativo sin login</a>.',
      faq1_q: "¿Cómo se sincroniza el catálogo con el panel administrativo?",
      faq1_a: "Todas las prendas, tallas, colores, precios y fotos se administran desde el Panel Admin. Al publicar o editar una prenda allí, el catálogo se actualiza al instante.",
      faq2_q: "¿Puedo elegir talla y color antes de comprar?",
      faq2_a: "¡Sí! Al tocar cualquier prenda verás únicamente los colores y tallas con existencias reales disponibles para agregar a tu carrito.",
      faq3_q: "¿Cómo finalizo mi pedido?",
      faq3_a: 'Desde el carrito puedes revisar el subtotal y pulsar "Comprar por WhatsApp" para enviar el pedido detallado con prendas, tallas, colores y cantidades.',
      faq4_q: "¿Qué métodos de pago aceptan?",
      faq4_a: "Aceptamos Pago Móvil a tasa BCV, transferencias, efectivo y divisas.",
      footer_txt: "Catálogo digital sincronizado con Panel de Gestión • Imágenes libres de derechos de autor.",
      footer_admin: "Panel Admin",
      footer_help: "Ayuda",
      cart_title: "Tu carrito",
      cart_sub: "Subtotal",
      cart_note: "El pedido se envía formateado con tallas, colores y subtotal directo a WhatsApp.",
      cart_checkout: "Comprar por WhatsApp",
      mod_eye: "Nova Atelier • Disponible",
      mod_color: "Color:",
      mod_size: "Talla:",
      mod_add: "Agregar al carrito",
      mod_err: "Selecciona una talla antes de agregar este producto al carrito.",
      tag_featured: "Destacado",
      btn_select_size: "Seleccionar talla",
      chip_all: "Todos",
      chip_featured: "Destacados",
      size_one: "Talla única",
      choose_size: "Elige una talla",
      no_sizes: "No hay tallas disponibles en este color.",
      empty_cart: "Tu carrito está vacío.",
      explore_col: "Explorar la colección ↗",
      remove: "Quitar",
      size_lbl: "Talla",
      added_toast: "se agregó al carrito ✔",
      pick_size_toast: "Selecciona una talla antes de agregar al carrito",
      no_results: "No encontramos prendas con esos criterios. Prueba otra búsqueda o categoría.",
      no_published: "No hay prendas publicadas en este momento. Publícalas desde el Panel Admin.",
      wa_intro: "Hola Nova Atelier, quisiera realizar este pedido:",
      mod_desc_suffix: "de la colección contemporánea Nova Atelier. Corte de alta confección y texturas suaves.",
    },
    en: {
      ann_bar: "Nationwide shipping • Direct orders via WhatsApp • New Emerald Collection",
      nav_home: "Home",
      nav_collection: "Collection",
      nav_about: "About Us",
      nav_styling: "Styling",
      nav_faq: "FAQ",
      nav_admin: "Admin",
      nav_cart: "Bag",
      hero_eye: "Contemporary Collection • 2026 Edition",
      hero_title: "Your perfect<br>outfit<br><em>is here</em>",
      hero_desc: "Minimalist designer garments for everyday wear. Explore our real-time selection, choose your size, and build your ideal look.",
      hero_btn1: "Explore Collection",
      hero_btn2: "Open Admin Panel",
      hero_note_t: "Contemporary Style",
      hero_note_d: "Clean cuts, soft textures, and live synced inventory.",
      btn_inspect: "Inspect",
      tick_1: "Real-Time Synced Inventory",
      tick_2: "Personalized WhatsApp Attention",
      tick_3: "Royalty-Free Fashion Photography",
      tick_4: "Connected to Admin Panel",
      col_eye: "Curated Pieces",
      col_title: "The Collection",
      search_ph: "Search by name, category, or color...",
      sort_lbl: "Sort",
      sort_all: "All",
      sort_feat: "Featured",
      sort_asc: "Price: Low to High",
      sort_desc: "Price: High to Low",
      story_eye: "Hello, we are Nova Atelier",
      story_title: "Discover<br>our store",
      story_desc: "We are a contemporary fashion studio focused on versatile pieces, modern cuts, and a digital shopping experience directly connected to our live inventory.",
      story_btn: "Learn more about us",
      srv_eye: "Here to help you",
      srv_title: "Nova Atelier Styling",
      srv1_t: "Style Consulting",
      srv1_d: "Not sure which combination to pick? Message us and we'll help you choose the pieces that best fit your style.",
      srv2_t: "Find Your Size",
      srv2_d: "Between two sizes? Tell us how you prefer the fit and we'll recommend the exact measurement.",
      srv3_t: "A Complete Look",
      srv3_d: "We put together complete combinations of dresses, jackets, blouses, and pants ready for any occasion.",
      srv_btn: "View available garments",
      faq_eye: "What you need to know",
      faq_title: "Frequently Asked Questions",
      faq_sub: 'Want to manage the garments, prices, or stock of this catalog? Enter the <a href="admin.html">No-Login Admin Panel</a>.',
      faq1_q: "How does the catalog sync with the admin panel?",
      faq1_a: "All garments, sizes, colors, prices, and photos are managed from the Admin Panel. When you publish or edit an item there, the catalog updates immediately.",
      faq2_q: "Can I choose size and color before buying?",
      faq2_a: "Yes! When you tap any garment you'll see only the colors and sizes with real available stock to add to your bag.",
      faq3_q: "How do I complete my order?",
      faq3_a: 'From the bag drawer you can review the subtotal and tap "Order via WhatsApp" to send the detailed order with items, sizes, colors, and quantities.',
      faq4_q: "What payment methods do you accept?",
      faq4_a: "We accept Mobile Payment at official BCV rate, bank transfers, cash, and foreign currency.",
      footer_txt: "Digital catalog synced with Management Panel • Royalty-free photography.",
      footer_admin: "Admin Panel",
      footer_help: "Help",
      cart_title: "Your Bag",
      cart_sub: "Subtotal",
      cart_note: "Your order is sent formatted with sizes, colors, and subtotal directly to WhatsApp.",
      cart_checkout: "Order via WhatsApp",
      mod_eye: "Nova Atelier • In Stock",
      mod_color: "Color:",
      mod_size: "Size:",
      mod_add: "Add to Bag",
      mod_err: "Please select a size before adding this item to your bag.",
      tag_featured: "Featured",
      btn_select_size: "Select size",
      chip_all: "All",
      chip_featured: "Featured",
      size_one: "One size",
      choose_size: "Choose a size",
      no_sizes: "No sizes available in this color.",
      empty_cart: "Your bag is empty.",
      explore_col: "Explore the collection ↗",
      remove: "Remove",
      size_lbl: "Size",
      added_toast: "was added to your bag ✔",
      pick_size_toast: "Select a size before adding to bag",
      no_results: "No garments matched your search. Try another keyword or category.",
      no_published: "No garments are published right now. Publish them from the Admin Panel.",
      wa_intro: "Hello Nova Atelier, I would like to place this order:",
      mod_desc_suffix: "from the Nova Atelier contemporary collection. Tailored cut and soft textures.",
    },
  };

  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const normalize = text => String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const fmtMoney = amount => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
  const fmtBs = usd => {
    const tasa = typeof tasaBcvActual === "function" ? tasaBcvActual() : 919.82;
    const bs = (Number(usd) || 0) * tasa;
    return "Bs. " + bs.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const colorHex = name => COLOR_HEX[normalize(name).trim()] || "#00FF88";

  const getLang = () => (localStorage.getItem(LANG_KEY) === "en" ? "en" : "es");
  const tr = key => (I18N[getLang()] && I18N[getLang()][key]) || I18N.es[key] || key;
  const trCat = cat => (getLang() === "en" ? (CAT_MAP_EN[cat] || cat) : cat);
  const trColor = col => (getLang() === "en" ? (COLOR_MAP_EN[col] || col) : col);
  const sizeLabel = size => (size === "Única" ? tr("size_one") : size);
  const sizeRank = size => { const i = SIZE_ORDER.indexOf(size); return i === -1 ? 100 : i; };
  const whatsappUrl = message => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const photoOf = product => product.photo || SIN_FOTO;

  const store = {
    products: [],
    loaded: false,
    filter: "all",
    query: "",
    sort: "all",
    openId: null,
    color: "",
    photoIndex: 0,
    size: "",
    cart: [],
    toastTimer: 0,
  };

  function applyLanguage(lang) {
    const idioma = lang === "en" ? "en" : "es";
    localStorage.setItem(LANG_KEY, idioma);
    document.documentElement.lang = idioma;
    const dict = I18N[idioma];

    $$("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (dict[k] !== undefined) el.textContent = dict[k];
    });
    $$("[data-i18n-html]").forEach(el => {
      const k = el.getAttribute("data-i18n-html");
      if (dict[k] !== undefined) el.innerHTML = dict[k];
    });
    $$("[data-i18n-placeholder]").forEach(el => {
      const k = el.getAttribute("data-i18n-placeholder");
      if (dict[k] !== undefined) el.setAttribute("placeholder", dict[k]);
    });

    const lbl = $("#lang-label");
    if (lbl) lbl.textContent = idioma === "es" ? "EN" : "ES";

    if (store.loaded) {
      renderChips();
      renderProducts();
      renderCart();
      if (store.openId && currentProduct()) renderModalOptions();
    }
  }

  /* ---------- Visor de Inspección de Imágenes ---------- */
  function openInspector(src, caption = "") {
    if (!src) return;
    const inspector = $("#image-inspector");
    const img = $("#inspector-img");
    const cap = $("#inspector-caption");
    if (!inspector || !img) return;
    img.src = src;
    img.alt = caption || "Imagen inspeccionada";
    if (cap) cap.textContent = caption || "";
    inspector.hidden = false;
    syncBody();
    const closeBtn = $("#close-inspector");
    if (closeBtn) closeBtn.focus();
  }

  function closeInspector() {
    const inspector = $("#image-inspector");
    if (!inspector || inspector.hidden) return;
    inspector.hidden = true;
    const img = $("#inspector-img");
    if (img) img.src = "";
    syncBody();
  }

  // Convierte una prenda del inventario administrativo (data.js) a prenda de tienda pública
  function fromInventoryRow(row) {
    const photos = Array.isArray(row.fotos) && row.fotos.length
      ? row.fotos.filter(Boolean).slice(0, 5)
      : (row.foto_url ? [row.foto_url] : []);

    const dispVariants = (Array.isArray(row.variantes) ? row.variantes : [])
      .filter(v => v && v.talla && v.color && Number(v.stock) > 0)
      .map(v => ({ talla: String(v.talla), color: String(v.color), stock: Number(v.stock) }));

    return {
      id: String(row.id),
      name: String(row.nombre || "Prenda"),
      category: String(row.categoria || "Colección").trim(),
      featured: Boolean(row.destacado),
      published: row.publicado !== false,
      price: Number(row.precio) || 0,
      photo: photos[0] || SIN_FOTO,
      photos: photos.length ? photos : [SIN_FOTO],
      variants: dispVariants,
      colors: [...new Set(dispVariants.map(v => v.color))],
    };
  }

  const currentProduct = () => store.products.find(p => p.id === store.openId) || null;
  const sizesFor = (product, color) => [...new Set(product.variants.filter(v => v.color === color).map(v => v.talla))]
    .sort((a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b, "es"));
  const variantExists = (product, color, size) => product.variants.some(v => v.color === color && v.talla === size);

  /* ---------- Carrito ---------- */
  function loadCartStored() {
    try {
      const list = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(list)) return [];
      return list
        .filter(l => l && l.id && l.color && l.size && Number(l.quantity) > 0)
        .map(l => ({ id: String(l.id), color: String(l.color), size: String(l.size), quantity: Math.min(99, Math.floor(Number(l.quantity))) }));
    } catch {
      return [];
    }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(store.cart)); } catch { /* noop */ }
  }
  function syncCart() {
    store.cart = store.cart.filter(l => {
      const p = store.products.find(x => x.id === l.id);
      return p && variantExists(p, l.color, l.size);
    });
    saveCart();
  }
  function cartLines() {
    return store.cart
      .map(l => {
        const p = store.products.find(x => x.id === l.id);
        return p ? { ...l, name: p.name, price: p.price, photo: photoOf(p) } : null;
      })
      .filter(Boolean);
  }
  function addToCart(id, color, size) {
    const line = store.cart.find(l => l.id === id && l.color === color && l.size === size);
    if (line) line.quantity = Math.min(99, line.quantity + 1);
    else store.cart.push({ id, color, size, quantity: 1 });
    saveCart();
    renderCart();
    const p = store.products.find(x => x.id === id);
    toast(`${p ? p.name : "Item"} ${tr("added_toast")}`);
  }
  function changeLine(id, color, size, delta) {
    const line = store.cart.find(l => l.id === id && l.color === color && l.size === size);
    if (!line) return;
    line.quantity = Math.max(0, Math.min(99, line.quantity + delta));
    if (line.quantity === 0) store.cart = store.cart.filter(l => l !== line);
    saveCart();
    renderCart();
  }
  function removeLine(id, color, size) {
    store.cart = store.cart.filter(l => !(l.id === id && l.color === color && l.size === size));
    saveCart();
    renderCart();
  }

  /* ---------- Renderizado ---------- */
  function showGridMessage(message) {
    const grid = $("#product-grid");
    if (grid) grid.innerHTML = `<p class="catalog-empty">${esc(message)}</p>`;
  }

  function renderChips() {
    const box = $("#category-chips");
    if (!box) return;
    const cats = [...new Set(store.products.map(p => p.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "es"));
    if (store.filter.startsWith("cat:") && !cats.includes(store.filter.slice(4))) store.filter = "all";
    const chips = [["all", tr("chip_all")], ["featured", tr("chip_featured")], ...cats.map(c => ["cat:" + c, trCat(c)])];
    box.innerHTML = chips.map(([key, label]) => {
      const on = key === store.filter;
      return `<button class="category-chip${on ? " active" : ""}" type="button" data-filter="${esc(key)}" aria-pressed="${on}">${esc(label)}</button>`;
    }).join("");
  }

  function visibleProducts() {
    const q = normalize(store.query).trim();
    const list = store.products.filter(p => {
      if (store.filter === "featured" && !p.featured) return false;
      if (store.filter.startsWith("cat:") && p.category !== store.filter.slice(4)) return false;
      if (!q) return true;
      return normalize([p.name, p.category, trCat(p.category), ...p.colors, ...p.colors.map(trColor)].join(" ")).includes(q);
    });
    if (store.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (store.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (store.sort === "featured") list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }

  function renderProducts() {
    const grid = $("#product-grid");
    if (!grid || !store.loaded) return;
    const list = visibleProducts();
    if (!list.length) {
      showGridMessage(store.products.length ? tr("no_results") : tr("no_published"));
      return;
    }
    grid.innerHTML = list.map(p => `
      <article class="product-card" data-product-id="${esc(p.id)}" tabindex="0" aria-label="${esc(p.name)}">
        <div class="product-image">
          <img src="${esc(photoOf(p))}" alt="${esc(p.name)}" data-inspect-src="${esc(photoOf(p))}" data-inspect-caption="${esc(p.name)}" loading="lazy" decoding="async" onerror="this.src='${SIN_FOTO}'">
          ${p.featured ? `<span class="product-tag">${esc(tr("tag_featured"))}</span>` : ""}
          <button type="button" class="product-zoom-btn" data-inspect-src="${esc(photoOf(p))}" data-inspect-caption="${esc(p.name)}" aria-label="${esc(tr("btn_inspect"))} ${esc(p.name)}" title="${esc(tr("btn_inspect"))}">🔍</button>
        </div>
        <div class="product-info">
          <p class="product-category">${esc(trCat(p.category || "Colección Nova"))}</p>
          <h3 class="product-name">${esc(p.name)}</h3>
          <div class="product-price"><span>${fmtMoney(p.price)}</span><small class="price-bs">${fmtBs(p.price)}</small></div>
          <p class="product-colors">${p.colors.map(c => esc(trColor(c))).join(" · ")}</p>
          <button class="product-add" data-quick="${esc(p.id)}" type="button">${esc(tr("btn_select_size"))}</button>
        </div>
      </article>`).join("");
  }

  function renderCart() {
    const lines = cartLines();
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
    $("#bag-count").textContent = count;
    $("#cart-title-count").textContent = `(${count})`;
    $("#cart-items").innerHTML = lines.length
      ? lines.map(l => {
          const attrs = `data-id="${esc(l.id)}" data-color="${esc(l.color)}" data-size="${esc(l.size)}"`;
          return `
      <div class="cart-line">
        <img src="${esc(l.photo)}" alt="${esc(l.name)}" data-inspect-src="${esc(l.photo)}" data-inspect-caption="${esc(l.name)}" title="${esc(tr("btn_inspect"))}" onerror="this.src='${SIN_FOTO}'">
        <div>
          <h3>${esc(l.name)}</h3>
          <p>${esc(trColor(l.color))} · ${esc(tr("size_lbl"))} ${esc(sizeLabel(l.size))}</p>
          <div class="quantity">
            <button type="button" data-change="-1" ${attrs} aria-label="-">−</button>
            <span>${l.quantity}</span>
            <button type="button" data-change="1" ${attrs} aria-label="+">+</button>
          </div>
          <button type="button" class="text-link" data-remove ${attrs}>${esc(tr("remove"))}</button>
        </div>
        <div class="cart-line-price">${fmtMoney(l.price * l.quantity)}</div>
      </div>`;
        }).join("")
      : `<p class="empty-cart">${esc(tr("empty_cart"))}<br><a class="text-link" href="#coleccion" data-close-cart>${esc(tr("explore_col"))}</a></p>`;
    $("#cart-bottom").hidden = !lines.length;
    $("#cart-subtotal").textContent = `${fmtMoney(subtotal)} (${fmtBs(subtotal)})`;
    const checkout = $("#checkout");
    checkout.href = lines.length ? whatsappUrl(orderMessage(lines, subtotal)) : "#";
  }

  function orderMessage(lines, subtotal) {
    return [
      tr("wa_intro"),
      ...lines.map(l => `- ${l.name} (${trColor(l.color)}, ${tr("size_lbl").toLowerCase()} ${sizeLabel(l.size)}) x${l.quantity}: ${fmtMoney(l.price * l.quantity)}`),
      `Subtotal: ${fmtMoney(subtotal)} (${fmtBs(subtotal)} BCV)`,
    ].join("\n");
  }

  /* ---------- Modal de Detalle ---------- */
  function openProduct(id) {
    const p = store.products.find(x => x.id === id);
    if (!p) return;
    store.openId = id;
    store.color = p.colors[0] || "";
    store.size = "";
    store.photoIndex = 0;
    $("#modal-name").textContent = p.name;
    $("#modal-price").innerHTML = `${fmtMoney(p.price)} <span class="price-bs">· ${fmtBs(p.price)}</span>`;
    $("#modal-description").textContent = `${trCat(p.category)} ${tr("mod_desc_suffix")}`;
    hideSizeError();
    renderModalOptions();
    $("#product-modal").classList.add("open");
    syncBody();
    $("#close-modal").focus();
  }

  function renderModalOptions() {
    const p = currentProduct();
    if (!p) return;
    if (!p.colors.includes(store.color)) store.color = p.colors[0] || "";
    const sizes = sizesFor(p, store.color);
    if (store.size && !sizes.includes(store.size)) store.size = "";

    $("#modal-price").innerHTML = `${fmtMoney(p.price)} <span class="price-bs">· ${fmtBs(p.price)}</span>`;
    $("#modal-description").textContent = `${trCat(p.category)} ${tr("mod_desc_suffix")}`;
    $("#selected-color-name").textContent = trColor(store.color);
    $("#color-options").innerHTML = p.colors.map(c => `
      <button class="color-option${c === store.color ? " active" : ""}" type="button" data-color="${esc(c)}"
        aria-label="${esc(trColor(c))}" aria-pressed="${c === store.color}" title="${esc(trColor(c))}">
        <span style="background:${colorHex(c)}"></span>
      </button>`).join("");

    $("#size-options").innerHTML = sizes.length
      ? sizes.map(s => `<button class="size-option${s === store.size ? " active" : ""}" type="button" data-size="${esc(s)}" aria-pressed="${s === store.size}">${esc(sizeLabel(s))}</button>`).join("")
      : `<p class="muted small">${esc(tr("no_sizes"))}</p>`;
    $("#selected-size-name").textContent = store.size ? sizeLabel(store.size) : tr("choose_size");
    $("#modal-add").disabled = sizes.length === 0;

    renderGallery();
  }

  function renderGallery() {
    const p = currentProduct();
    if (!p) return;
    const photos = p.photos.length ? p.photos : [SIN_FOTO];
    if (store.photoIndex >= photos.length) store.photoIndex = 0;
    const main = $("#modal-image");
    main.setAttribute("src", photos[store.photoIndex]);
    main.onerror = () => { main.src = SIN_FOTO; };
    main.alt = `${p.name} (${trColor(store.color)})`;
    $("#modal-thumbnails").innerHTML = photos.length > 1
      ? photos.map((u, i) => `<button class="thumbnail${i === store.photoIndex ? " active" : ""}" type="button" data-photo="${i}" aria-label="Foto ${i + 1}"><img src="${esc(u)}" alt=""></button>`).join("")
      : "";
  }

  function closeProduct() {
    $("#product-modal").classList.remove("open");
    store.openId = null;
    syncBody();
  }

  function showSizeError() {
    $("#size-options").classList.add("has-error");
    $("#size-error").hidden = false;
    toast(tr("pick_size_toast"));
    const first = $("#size-options .size-option");
    if (first) first.focus();
  }
  function hideSizeError() {
    $("#size-options").classList.remove("has-error");
    $("#size-error").hidden = true;
  }

  function openCart() {
    $("#cart-overlay").classList.add("open");
    $("#cart-drawer").classList.add("open");
    $("#cart-drawer").setAttribute("aria-hidden", "false");
    syncBody();
    $("#close-cart").focus();
  }
  function closeCart() {
    $("#cart-overlay").classList.remove("open");
    $("#cart-drawer").classList.remove("open");
    $("#cart-drawer").setAttribute("aria-hidden", "true");
    syncBody();
  }
  function syncBody() {
    const inspectorOpen = $("#image-inspector") && !$("#image-inspector").hidden;
    const open = inspectorOpen || $("#cart-drawer").classList.contains("open") || $("#product-modal").classList.contains("open");
    document.body.style.overflow = open ? "hidden" : "";
  }

  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(store.toastTimer);
    store.toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- Carga de Datos desde data.js ---------- */
  async function loadCatalog() {
    try {
      const rawProducts = await DB.productos();
      store.products = (rawProducts || [])
        .map(fromInventoryRow)
        .filter(p => p.published && p.variants.length > 0);
      store.loaded = true;
      syncCart();
      renderChips();
      renderProducts();
      renderCart();
      if (store.openId) {
        if (currentProduct()) renderModalOptions();
        else closeProduct();
      }
      const sitio = await DB.sitioImagenes();
      const urlOf = clave => {
        const row = (sitio || []).find(r => r.clave === clave);
        return row && row.url ? row.url : SIN_FOTO;
      };
      const imgInicio = $("#foto-inicio");
      const imgNosotros = $("#foto-nosotros");
      if (imgInicio) {
        imgInicio.src = urlOf("inicio");
        imgInicio.onerror = () => { imgInicio.src = SIN_FOTO; };
      }
      if (imgNosotros) {
        imgNosotros.src = urlOf("nosotros");
        imgNosotros.onerror = () => { imgNosotros.src = SIN_FOTO; };
      }
    } catch (err) {
      console.error("Error cargando catálogo:", err);
      showGridMessage("No se pudo cargar la colección.");
    }
  }

  function wireEvents() {
    $("#product-search").addEventListener("input", e => { store.query = e.target.value; renderProducts(); });
    $("#product-sort").addEventListener("change", e => { store.sort = e.target.value; renderProducts(); });

    const langBtn = $("#lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        applyLanguage(getLang() === "es" ? "en" : "es");
      });
    }

    $("#category-chips").addEventListener("click", e => {
      const b = e.target.closest("[data-filter]");
      if (!b) return;
      store.filter = b.dataset.filter;
      renderChips();
      renderProducts();
    });

    // Delegación global para inspeccionar cualquier imagen del catálogo y cerrar con ✕
    document.addEventListener("click", e => {
      const closeBtn = e.target.closest("[data-close-inspector], #close-inspector");
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        return closeInspector();
      }
      if (e.target.id === "image-inspector") {
        return closeInspector();
      }
      const targetBtn = e.target.closest("[data-inspect-target]");
      if (targetBtn) {
        e.preventDefault();
        e.stopPropagation();
        const imgEl = $(targetBtn.getAttribute("data-inspect-target"));
        if (imgEl && imgEl.src) openInspector(imgEl.src, imgEl.alt || "Nova Atelier");
        return;
      }
      const srcEl = e.target.closest("[data-inspect-src]");
      if (srcEl) {
        e.preventDefault();
        e.stopPropagation();
        openInspector(srcEl.getAttribute("data-inspect-src"), srcEl.getAttribute("data-inspect-caption") || srcEl.alt || "");
        return;
      }
      if (e.target.matches && e.target.matches(".inspectable-img")) {
        e.preventDefault();
        e.stopPropagation();
        openInspector(e.target.src, e.target.alt || "Nova Atelier");
        return;
      }
    });

    const grid = $("#product-grid");
    grid.addEventListener("click", e => {
      if (e.target.closest("[data-inspect-src]")) return;
      const el = e.target.closest("[data-quick], [data-product-id]");
      if (el) openProduct(el.dataset.quick || el.dataset.productId);
    });
    grid.addEventListener("keydown", e => {
      if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("product-card")) {
        e.preventDefault();
        openProduct(e.target.dataset.productId);
      }
    });

    $("#close-modal").addEventListener("click", closeProduct);
    $("#product-modal").addEventListener("click", e => { if (e.target.id === "product-modal") closeProduct(); });
    $("#modal-thumbnails").addEventListener("click", e => {
      const b = e.target.closest("[data-photo]");
      if (!b) return;
      store.photoIndex = Number(b.dataset.photo);
      renderGallery();
    });
    $("#color-options").addEventListener("click", e => {
      const b = e.target.closest("[data-color]");
      if (!b) return;
      store.color = b.dataset.color;
      store.size = "";
      hideSizeError();
      renderModalOptions();
    });
    $("#size-options").addEventListener("click", e => {
      const b = e.target.closest("[data-size]");
      if (!b) return;
      store.size = b.dataset.size;
      hideSizeError();
      renderModalOptions();
    });
    $("#modal-add").addEventListener("click", () => {
      const p = currentProduct();
      if (!p) return;
      if (!store.size) return showSizeError();
      if (!variantExists(p, store.color, store.size)) {
        toast(tr("no_sizes"));
        renderModalOptions();
        return;
      }
      addToCart(p.id, store.color, store.size);
      closeProduct();
      openCart();
    });

    $("#open-cart").addEventListener("click", openCart);
    $("#close-cart").addEventListener("click", closeCart);
    $("#cart-overlay").addEventListener("click", closeCart);
    $("#cart-items").addEventListener("click", e => {
      if (e.target.closest("[data-inspect-src]")) return;
      const ch = e.target.closest("[data-change]");
      if (ch) return changeLine(ch.dataset.id, ch.dataset.color, ch.dataset.size, Number(ch.dataset.change));
      const rm = e.target.closest("[data-remove]");
      if (rm) return removeLine(rm.dataset.id, rm.dataset.color, rm.dataset.size);
      if (e.target.closest("[data-close-cart]")) closeCart();
    });

    $$(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const answer = btn.nextElementSibling;
        const expanded = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!expanded));
        btn.querySelector("span:last-child").textContent = expanded ? "+" : "−";
        answer.hidden = expanded;
      });
    });

    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      if ($("#image-inspector") && !$("#image-inspector").hidden) closeInspector();
      else if ($("#product-modal").classList.contains("open")) closeProduct();
      else if ($("#cart-drawer").classList.contains("open")) closeCart();
    });

    // Sincronización automática cuando se hacen cambios en admin.html o se actualiza la tasa BCV
    window.addEventListener("storage", e => {
      if (e.key === LANG_KEY) applyLanguage(getLang());
      if (e.key && e.key.startsWith("na_")) loadCatalog();
    });
    window.addEventListener("bcv-actualizada", () => {
      renderProducts();
      renderCart();
      const p = currentProduct();
      if (p && $("#modal-price")) {
        $("#modal-price").innerHTML = `${fmtMoney(p.price)} <span class="price-bs">· ${fmtBs(p.price)}</span>`;
      }
    });
  }

  store.cart = loadCartStored();
  applyLanguage(getLang());
  renderCart();
  wireEvents();
  loadCatalog();
})();
