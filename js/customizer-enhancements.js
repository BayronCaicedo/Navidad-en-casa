// Mejoras finales del configurador: total dinámico y resumen claro

document.addEventListener("DOMContentLoaded", () => {
  const formatCOP = (value) => new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

  const getCurrentProduct = () => {
    const modal = document.querySelector("#appModal");
    const title = modal?.querySelector("#modalTitle")?.textContent?.trim();
    if (!title) return null;

    return [...document.querySelectorAll(".product-card")].find(
      (card) => card.dataset.name === title,
    );
  };

  const refreshCustomizerFooter = () => {
    const modal = document.querySelector("#appModal");
    if (!modal?.classList.contains("show")) return;

    const productCard = getCurrentProduct();
    if (!productCard) return;

    const price = Number(productCard.dataset.price || 0);
    const quantity = Number(modal.querySelector("#qtyValue")?.textContent || 1);
    const size = modal.querySelector('[data-variant="size"].selected')?.dataset.value || "";
    const color = modal.querySelector('[data-variant="color"].selected')?.dataset.value || "";
    const design = modal.querySelector('[data-variant="design"].selected')?.dataset.value || "";
    const summary = modal.querySelector("#customizerSummary");
    const addButton = modal.querySelector("#modalAddCart");

    if (summary) {
      summary.innerHTML = `
        <div class="selection-summary-line"><strong>${size}</strong><span>${color}</span><span>${design}</span></div>
        <div class="selection-total-line"><span>${quantity} ${quantity === 1 ? "unidad" : "unidades"} × ${formatCOP(price)}</span><strong>${formatCOP(price * quantity)}</strong></div>
      `;
    }

    if (addButton) {
      addButton.textContent = `Agregar ${quantity} ${quantity === 1 ? "unidad" : "unidades"} al carrito · ${formatCOP(price * quantity)}`;
    }
  };

  document.addEventListener("click", (event) => {
    if (
      event.target.closest(".variant-option") ||
      event.target.closest("#qtyMinus") ||
      event.target.closest("#qtyPlus") ||
      event.target.closest(".open-product")
    ) {
      window.setTimeout(refreshCustomizerFooter, 0);
    }
  });

  const observer = new MutationObserver(() => {
    if (document.querySelector("#appModal.show #modalAddCart")) {
      refreshCustomizerFooter();
    }
  });

  const modalContent = document.querySelector("#modalContent");
  if (modalContent) observer.observe(modalContent, { childList: true, subtree: true });
});
