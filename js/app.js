// Interacciones principales - Navidad en Casa

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const formatCOP = (value) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const searchForm = $("#searchForm");
  const searchInput = $("#searchInput");
  const productCards = $$(".product-card");
  const categoryButtons = $$(".category-filter");
  const clearFilter = $("#clearFilter");
  const filterLabel = $("#filterLabel");
  const emptyResults = $("#emptyResults");
  const cartCount = $("#cartCount");
  const toast = $("#toast");
  const currentYear = $("#currentYear");

  const cartButton = $("#cartButton");
  const cartDrawer = $("#cartDrawer");
  const drawerBackdrop = $("#drawerBackdrop");
  const closeCart = $("#closeCart");
  const cartItems = $("#cartItems");
  const cartEmpty = $("#cartEmpty");
  const cartSummary = $("#cartSummary");
  const cartTotal = $("#cartTotal");
  const startShopping = $("#startShopping");
  const checkoutButton = $("#checkoutButton");

  const modal = $("#appModal");
  const modalBackdrop = $("#modalBackdrop");
  const modalContent = $("#modalContent");
  const closeModal = $("#closeModal");

  const variantCatalog = {
    "kit-sala": {
      material: "Textiles bordados y detalles decorativos",
      sizes: ["Compacto", "Mediano", "Completo"],
      colors: ["Beige y rojo", "Verde y rojo", "Tartán clásico"],
      designs: ["Santa", "Pascua", "Árboles"],
    },
    "camino-mesa": {
      material: "Lino texturizado y bordado artesanal",
      sizes: ["120 cm", "150 cm", "180 cm"],
      colors: ["Beige", "Rojo", "Verde"],
      designs: ["Flores de Pascua", "Renos", "Árboles"],
    },
    cojin: {
      material: "Lino y algodón con bordado decorativo",
      sizes: ["40 × 40 cm", "45 × 45 cm", "50 × 50 cm"],
      colors: ["Beige", "Rojo", "Verde"],
      designs: ["Árbol navideño", "Flores de Pascua", "Santa"],
    },
    silla: {
      material: "Textil decorativo, lazo y aplique artesanal",
      sizes: ["Pequeña", "Mediana", "Grande"],
      colors: ["Rojo", "Verde", "Tartán"],
      designs: ["Moño", "Estrella", "Corazón"],
    },
    corona: {
      material: "Follaje decorativo, piñas y lazo textil",
      sizes: ["35 cm", "45 cm", "55 cm"],
      colors: ["Tradicional", "Dorado", "Natural"],
      designs: ["Clásica", "Gran moño", "Piñas y frutos"],
    },
    cocina: {
      material: "Algodón y lino de uso decorativo",
      sizes: ["Pequeño", "Mediano", "Grande"],
      colors: ["Beige", "Rojo", "Tartán"],
      designs: ["Pascua", "Árbol", "Muñeco"],
    },
    bano: {
      material: "Algodón suave con bordado decorativo",
      sizes: ["Manos", "Mediana", "Baño"],
      colors: ["Beige", "Blanco", "Rojo"],
      designs: ["Árbol", "Pascua", "Copos"],
    },
    "pie-arbol": {
      material: "Tejido artesanal con borde decorativo",
      sizes: ["90 cm", "120 cm", "150 cm"],
      colors: ["Beige y rojo", "Verde y rojo", "Tartán"],
      designs: ["Pascua", "Renos", "Árboles"],
    },
  };

  const colorHex = {
    Beige: "#e8d7bd",
    Rojo: "#a31515",
    Verde: "#174d2b",
    Tartán: "#7b1f1f",
    "Beige y rojo": "#cfb79b",
    "Verde y rojo": "#31563a",
    "Tartán clásico": "#6f2a2a",
    Tradicional: "#8c1f24",
    Dorado: "#d4af37",
    Natural: "#9b7b54",
    Blanco: "#f7f3ec",
  };

  const products = productCards.map((card) => ({
    id: card.dataset.id,
    name: card.dataset.name,
    category: card.dataset.category,
    price: Number(card.dataset.price),
    image: card.dataset.image,
    variants: variantCatalog[card.dataset.id],
  }));

  const getCart = () => JSON.parse(localStorage.getItem("navidadEnCasaCart")) || [];
  const saveCart = (cart) => localStorage.setItem("navidadEnCasaCart", JSON.stringify(cart));

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2300);
  };

  const scrollToSection = (selector) => {
    const target = $(selector);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const updateNavActive = () => {
    const sections = ["inicio", "categorias", "productos", "promociones", "nosotros", "contacto"];
    let current = "inicio";
    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= 170) current = id;
    });
    $$(".nav-links a").forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  };

  $$(".js-scroll").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      event.preventDefault();
      scrollToSection(href);
      navLinks?.classList.remove("open");
    });
  });

  menuToggle?.addEventListener("click", () => navLinks?.classList.toggle("open"));
  window.addEventListener("scroll", updateNavActive, { passive: true });

  const applyProductFilter = ({ term = "", category = "" } = {}) => {
    const normalizedTerm = term.trim().toLowerCase();
    let visible = 0;

    productCards.forEach((card) => {
      const matchesTerm = !normalizedTerm || card.dataset.name.toLowerCase().includes(normalizedTerm) || card.dataset.category.includes(normalizedTerm);
      const matchesCategory = !category || card.dataset.category === category;
      const show = matchesTerm && matchesCategory;
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });

    emptyResults.classList.toggle("hidden", visible > 0);
    clearFilter.classList.toggle("hidden", !category && !normalizedTerm);

    if (category) filterLabel.textContent = `Mostrando productos relacionados con ${category}.`;
    else if (normalizedTerm) filterLabel.textContent = `Resultados para “${term.trim()}”.`;
    else filterLabel.textContent = "Una selección de nuestras creaciones artesanales.";
  };

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    applyProductFilter({ term: searchInput.value });
    scrollToSection("#productos");
    showToast(searchInput.value.trim() ? `Buscando “${searchInput.value.trim()}”` : "Mostrando todos los productos");
  });

  searchInput?.addEventListener("input", () => {
    if (!searchInput.value.trim()) applyProductFilter();
  });

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      searchInput.value = "";
      applyProductFilter({ category: button.dataset.category });
      scrollToSection("#productos");
      showToast(`Explorando ideas para ${button.textContent.trim()}`);
    });
  });

  clearFilter?.addEventListener("click", () => {
    searchInput.value = "";
    categoryButtons.forEach((item) => item.classList.remove("active"));
    applyProductFilter();
  });

  const openCart = () => {
    renderCart();
    cartDrawer.classList.add("open");
    drawerBackdrop.classList.add("show");
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const hideCart = () => {
    cartDrawer.classList.remove("open");
    drawerBackdrop.classList.remove("show");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  const variantKey = (item) => `${item.id}|${item.size}|${item.color}|${item.design}`;

  const updateCartCount = () => {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  };

  const addToCart = (product, selection, quantity = 1) => {
    const cart = getCart();
    const newItem = { ...product, ...selection, quantity };
    const key = variantKey(newItem);
    const existing = cart.find((item) => variantKey(item) === key);

    if (existing) existing.quantity += quantity;
    else cart.push(newItem);

    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} agregado al carrito`);
  };

  const removeFromCart = (key) => {
    saveCart(getCart().filter((item) => variantKey(item) !== key));
    updateCartCount();
    renderCart();
    showToast("Producto retirado del carrito");
  };

  const renderCart = () => {
    const cart = getCart();
    cartItems.innerHTML = "";
    const isEmpty = cart.length === 0;
    cartEmpty.classList.toggle("show", isEmpty);
    cartSummary.classList.toggle("hidden", isEmpty);

    cart.forEach((item) => {
      const key = variantKey(item);
      const element = document.createElement("article");
      element.className = "cart-item";
      element.innerHTML = `
        <div class="cart-item-art cart-thumb"><img src="${item.image}" alt="${item.name}"></div>
        <div>
          <h4>${item.name}</h4>
          <small>${item.quantity} × ${formatCOP(item.price)}</small>
          <span class="cart-variants">${item.size} · ${item.color}<br>${item.design}</span>
        </div>
        <button class="remove-item" type="button" data-remove="${key}" aria-label="Eliminar ${item.name}">×</button>`;
      cartItems.appendChild(element);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatCOP(total);
    $$('[data-remove]', cartItems).forEach((button) => button.addEventListener("click", () => removeFromCart(button.dataset.remove)));
  };

  cartButton?.addEventListener("click", openCart);
  closeCart?.addEventListener("click", hideCart);
  drawerBackdrop?.addEventListener("click", hideCart);
  startShopping?.addEventListener("click", () => { hideCart(); scrollToSection("#productos"); });

  const openModal = (html) => {
    modalContent.innerHTML = html;
    modal.classList.add("show");
    modalBackdrop.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const hideModal = () => {
    modal.classList.remove("show");
    modalBackdrop.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  closeModal?.addEventListener("click", hideModal);
  modalBackdrop?.addEventListener("click", hideModal);

  const createVariantButtons = (type, options, selected) => options.map((option) => {
    const swatch = type === "color" ? `<span class="color-swatch" style="background:${colorHex[option] || "#d4af37"}"></span>` : "";
    return `<button class="variant-option ${type === "color" ? "color-option" : ""} ${option === selected ? "selected" : ""}" type="button" data-variant="${type}" data-value="${option}">${swatch}${option}</button>`;
  }).join("");

  const openProductCustomizer = (product) => {
    const options = product.variants;
    const state = {
      size: options.sizes[0],
      color: options.colors[0],
      design: options.designs[0],
      quantity: 1,
    };

    openModal(`
      <div class="product-modal-grid">
        <div class="product-modal-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="product-modal-content">
          <p class="section-kicker">Producto artesanal</p>
          <h2 id="modalTitle">${product.name}</h2>
          <strong class="modal-price">${formatCOP(product.price)}</strong>
          <p class="product-modal-description">Cada pieza es elaborada a mano y puede personalizarse para adaptarse mejor a su hogar.</p>
          <ul class="product-features">
            <li>Hecho a mano</li>
            <li>${options.material}</li>
            <li>Disponible por encargo</li>
            <li>Acabado artesanal</li>
          </ul>

          <div class="variant-group">
            <div class="variant-title">Medida / tamaño <span id="selectedSize">${state.size}</span></div>
            <div class="variant-options" id="sizeOptions">${createVariantButtons("size", options.sizes, state.size)}</div>
          </div>

          <div class="variant-group">
            <div class="variant-title">Color <span id="selectedColor">${state.color}</span></div>
            <div class="variant-options" id="colorOptions">${createVariantButtons("color", options.colors, state.color)}</div>
          </div>

          <div class="variant-group">
            <div class="variant-title">Diseño <span id="selectedDesign">${state.design}</span></div>
            <div class="variant-options" id="designOptions">${createVariantButtons("design", options.designs, state.design)}</div>
          </div>

          <div class="quantity-row">
            <strong>Cantidad</strong>
            <div class="quantity-control"><button id="qtyMinus" type="button">−</button><span id="qtyValue">1</span><button id="qtyPlus" type="button">+</button></div>
          </div>

          <div class="customizer-summary" id="customizerSummary"></div>
          <button class="btn btn-primary full-width" id="modalAddCart" type="button">Agregar al carrito</button>
        </div>
      </div>`);

    const refreshSummary = () => {
      $("#selectedSize").textContent = state.size;
      $("#selectedColor").textContent = state.color;
      $("#selectedDesign").textContent = state.design;
      $("#qtyValue").textContent = state.quantity;
      $("#customizerSummary").innerHTML = `<strong>Su selección:</strong> ${state.size} · ${state.color} · ${state.design} · Cantidad ${state.quantity}`;
    };

    $$(".variant-option", modalContent).forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.dataset.variant;
        state[type] = button.dataset.value;
        $$(`[data-variant="${type}"]`, modalContent).forEach((option) => option.classList.remove("selected"));
        button.classList.add("selected");
        refreshSummary();
      });
    });

    $("#qtyMinus")?.addEventListener("click", () => { if (state.quantity > 1) state.quantity -= 1; refreshSummary(); });
    $("#qtyPlus")?.addEventListener("click", () => { if (state.quantity < 10) state.quantity += 1; refreshSummary(); });
    $("#modalAddCart")?.addEventListener("click", () => {
      addToCart(product, { size: state.size, color: state.color, design: state.design }, state.quantity);
      hideModal();
      openCart();
    });

    refreshSummary();
  };

  $$(".open-product").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const product = products.find((item) => item.id === card.dataset.id);
      if (product) openProductCustomizer(product);
    });
  });

  $("#accountButton")?.addEventListener("click", () => {
    openModal(`<p class="section-kicker">Mi cuenta</p><h2 id="modalTitle">Área de clientes</h2><p>Esta primera versión funciona como vitrina y carrito de compra. El registro de usuarios se contempla como una mejora futura del proyecto.</p><div class="order-box"><strong>¿Qué puede hacer ahora?</strong><p>Explorar productos, personalizarlos, agregarlos al carrito y generar un resumen de pedido.</p></div><div class="modal-actions"><button class="btn btn-primary" id="accountExplore" type="button">Explorar productos</button></div>`);
    $("#accountExplore")?.addEventListener("click", () => { hideModal(); scrollToSection("#productos"); });
  });

  $("#promoButton")?.addEventListener("click", () => {
    applyProductFilter();
    scrollToSection("#productos");
    showToast("Promoción activa: 10% en compras superiores a $150.000");
  });

  $("#storyButton")?.addEventListener("click", () => {
    openModal(`<p class="section-kicker">Nuestra historia</p><h2 id="modalTitle">Una Navidad hecha con las manos</h2><p>Navidad en Casa representa un emprendimiento familiar dedicado a crear decoraciones artesanales para diferentes espacios del hogar. Cada pieza nace de la creatividad, la paciencia y el trabajo manual.</p><p>La propuesta busca que cada producto tenga identidad propia y lleve al hogar esa sensación cálida y especial que caracteriza la temporada navideña.</p>`);
  });

  const helpContent = {
    faq: ["Preguntas frecuentes", "Los productos son elaborados a mano, por lo que pueden existir pequeñas variaciones entre una pieza y otra. Puede consultar disponibilidad antes de confirmar el pedido."],
    shipping: ["Políticas de envío", "Los pedidos se preparan cuidadosamente para proteger las piezas artesanales. El tiempo y costo de entrega dependerán de la ciudad y del tamaño del pedido."],
    returns: ["Cambios y devoluciones", "Si un producto llega con una novedad, el cliente podrá comunicarse con el emprendimiento para revisar el caso y acordar una solución."],
    terms: ["Términos y condiciones", "Los precios y disponibilidad mostrados corresponden a una versión académica del proyecto. En una implementación comercial serían administrados desde un sistema de inventario."],
  };

  $$(".info-link").forEach((button) => button.addEventListener("click", () => {
    const [title, text] = helpContent[button.dataset.info];
    openModal(`<p class="section-kicker">Información</p><h2 id="modalTitle">${title}</h2><p>${text}</p>`);
  }));

  $$(".coming-soon").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.label}: enlace disponible próximamente`)));
  $("#whatsappButton")?.addEventListener("click", () => showToast("WhatsApp se conectará al número real del emprendimiento en la versión final"));

  checkoutButton?.addEventListener("click", () => {
    const cart = getCart();
    if (!cart.length) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const lines = cart.map((item) => `<div class="order-line"><span>${item.quantity} × ${item.name}<small class="order-variant">${item.size} · ${item.color} · ${item.design}</small></span><strong>${formatCOP(item.price * item.quantity)}</strong></div>`).join("");
    hideCart();
    openModal(`<p class="section-kicker">Resumen del pedido</p><h2 id="modalTitle">Su selección navideña</h2><div class="order-box">${lines}<div class="order-line"><strong>Total</strong><strong>${formatCOP(total)}</strong></div></div><p>Este resumen conserva las opciones seleccionadas de cada producto.</p><div class="modal-actions"><button class="btn btn-primary" id="copyOrder" type="button">Copiar resumen</button></div>`);
    $("#copyOrder")?.addEventListener("click", async () => {
      const text = `Navidad en Casa\n${cart.map((item) => `${item.quantity} x ${item.name} | ${item.size} | ${item.color} | ${item.design} - ${formatCOP(item.price * item.quantity)}`).join("\n")}\nTotal: ${formatCOP(total)}`;
      try { await navigator.clipboard.writeText(text); showToast("Resumen copiado al portapapeles"); } catch { showToast("No fue posible copiar automáticamente el resumen"); }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { hideModal(); hideCart(); }
  });

  currentYear.textContent = new Date().getFullYear();
  updateCartCount();
  updateNavActive();
});
