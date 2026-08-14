// Interacciones principales - Navidad en Casa

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const searchInput = document.getElementById("searchInput");
  const productCards = [...document.querySelectorAll(".product-card")];
  const addCartButtons = document.querySelectorAll(".add-cart");
  const cartCount = document.getElementById("cartCount");
  const toast = document.getElementById("toast");
  const currentYear = document.getElementById("currentYear");

  const getCart = () => JSON.parse(localStorage.getItem("navidadEnCasaCart")) || [];

  const saveCart = (cart) => {
    localStorage.setItem("navidadEnCasaCart", JSON.stringify(cart));
  };

  const updateCartCount = () => {
    const cart = getCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
  };

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const term = event.target.value.trim().toLowerCase();

      productCards.forEach((card) => {
        const name = card.dataset.name.toLowerCase();
        card.classList.toggle("hidden", term && !name.includes(term));
      });
    });
  }

  addCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.dataset.product;
      const cart = getCart();
      const existingItem = cart.find((item) => item.name === productName);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ name: productName, quantity: 1 });
      }

      saveCart(cart);
      updateCartCount();
      showToast(`${productName} agregado al carrito`);
    });
  });

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  updateCartCount();
});
