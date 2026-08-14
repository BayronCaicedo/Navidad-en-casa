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

  const products = productCards.map((card) => ({
    id: card.dataset.id,
    name: card.dataset.name,
    category: card.dataset.category,
    price: Number(card.dataset.price),
    art: card.dataset.art,
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

    if (category) {
      filterLabel.textContent = `Mostrando productos relacionados con ${category}.`;
    } else if (normalizedTerm) {
      filterLabel.textContent = `Resultados para “${term.trim()}”.`;
    } else {
      filterLabel.textContent = "Una selección de nuestras creaciones artesanales.";
    }
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

  const updateCartCount = () => {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
  };

  const addToCart = (product) => {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    saveCart(cart);
    updateCartCount();
    showToast(`${product.name} agregado al carrito`);
  };

  const removeFromCart = (id) => {
    saveCart(getCart().filter((item) => item.id !== id));
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
      const element = document.createElement("article");
      element.className = "cart-item";
      element.innerHTML = `<div class="cart-item-art">${item.art || "🎁"}</div><div><h4>${item.name}</h4><small>${item.quantity} × ${formatCOP(item.price)}</small></div><button class="remove-item" type="button" data-remove="${item.id}" aria-label="Eliminar ${item.name}">×</button>`;
      cartItems.appendChild(element);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = formatCOP(total);
    $$('[data-remove]', cartItems).forEach((button) => button.addEventListener("click", () => removeFromCart(button.dataset.remove)));
  };

  $$(".add-cart").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = button.closest(".product-card");
      const product = products.find((item) => item.id === card.dataset.id);
      addToCart(product);
    });
  });

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

  $$(".open-product").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const product = products.find((item) => item.id === card.dataset.id);
      openModal(`<div class="modal-hero">${product.art}</div><p class="section-kicker">Producto artesanal</p><h2 id="modalTitle">${product.name}</h2><strong class="modal-price">${formatCOP(product.price)}</strong><p>Cada pieza es elaborada manualmente. Los pequeños detalles pueden variar ligeramente, haciendo que cada producto sea único.</p><ul class="modal-list"><li>Elaboración artesanal.</li><li>Materiales seleccionados para decoración de temporada.</li><li>Ideal para regalar o ambientar el hogar.</li></ul><div class="modal-actions"><button class="btn btn-primary" id="modalAddCart" type="button">Agregar al carrito</button><button class="btn btn-light" id="modalCloseAction" type="button">Seguir mirando</button></div>`);
      $("#modalAddCart")?.addEventListener("click", () => { addToCart(product); hideModal(); });
      $("#modalCloseAction")?.addEventListener("click", hideModal);
    });
  });

  $("#accountButton")?.addEventListener("click", () => {
    openModal(`<p class="section-kicker">Mi cuenta</p><h2 id="modalTitle">Área de clientes</h2><p>Esta primera versión funciona como vitrina y carrito de compra. El registro de usuarios se contempla como una mejora futura del proyecto.</p><div class="order-box"><strong>¿Qué puede hacer ahora?</strong><p>Explorar productos, filtrar por espacios, agregar artículos al carrito y generar un resumen de pedido.</p></div><div class="modal-actions"><button class="btn btn-primary" id="accountExplore" type="button">Explorar productos</button></div>`);
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
    const lines = cart.map((item) => `<div class="order-line"><span>${item.quantity} × ${item.name}</span><strong>${formatCOP(item.price * item.quantity)}</strong></div>`).join("");
    hideCart();
    openModal(`<p class="section-kicker">Resumen del pedido</p><h2 id="modalTitle">Su selección navideña</h2><div class="order-box">${lines}<div class="order-line"><strong>Total</strong><strong>${formatCOP(total)}</strong></div></div><p>En la siguiente fase este resumen se conectará con el formulario de compra y WhatsApp.</p><div class="modal-actions"><button class="btn btn-primary" id="copyOrder" type="button">Copiar resumen</button></div>`);
    $("#copyOrder")?.addEventListener("click", async () => {
      const text = `Navidad en Casa\n${cart.map((item) => `${item.quantity} x ${item.name} - ${formatCOP(item.price * item.quantity)}`).join("\n")}\nTotal: ${formatCOP(total)}`;
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
