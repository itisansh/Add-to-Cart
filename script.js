document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCart = document.getElementById("empty-cart");
  const cartTotal = document.getElementById("cart-total");
  const totalPrice = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  const products = [
    { id: 1, item: "Product 1", price: 29.99 },
    { id: 2, item: "Product 2", price: 19.99 },
    { id: 3, item: "Product 3", price: 59.99 },
  ];
  const cart = JSON.parse(localStorage.getItem("cartArray")) || [];

  renderCart(cart);
  totalCartPrice(cart);

  products.forEach((p) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    const price = p.price.toFixed(2);
    productDiv.innerHTML = `<span> ${p.item} - $${price}</span> <button data-id="${p.id}" >add</button>`;
    productList.appendChild(productDiv);
  });

  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const btn = e.target;
      const dataId = parseInt(btn.getAttribute("data-id"));

      products.forEach((p) => {
        if (p.id === dataId) {
          cart.push(p);
          renderCart(cart);
          totalCartPrice(cart);
          saveProducts();
        }
      });
    }
  });

  function renderCart(cart) {

    cartItems.textContent = "";
    if (cart.length > 0) {
      cartTotal.classList.remove("hidden");

      cart.forEach((cartProduct) => {
        const product = document.createElement("div");
        product.classList.add("cart-container");
        product.innerHTML = `
        <span> ${cartProduct.item} - $${cartProduct.price}</span> 
        <button data-id="${cartProduct.id}" > delete </button>`;
        cartItems.appendChild(product);
      });
      
    } else {
      cartItems.innerHTML = `<p id="empty-cart">Your cart is empty.</p>`;
    }
    console.log(cartItems);
  }

  cartItems.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const btn = e.target;

      const productIdToRemove = parseInt(btn.getAttribute("data-id"));

      e.target.closest(".cart-container").remove();
      const indexToRemove = cart.findIndex(
        (cartProduct) => cartProduct.id === productIdToRemove
      );

      if (indexToRemove !== -1) {

        cart.splice(indexToRemove, 1);

        console.log(
          `Removed product at index ${indexToRemove}. New cart length: ${cart.length}`
        );

        totalCartPrice(cart);
        saveProducts();
        renderCart(cart);
      }
    }
  });

  function totalCartPrice(cart) {
    let total = 0;
    cart.forEach((product) => {
      total += product.price;
    });

    totalPrice.textContent = `$${total.toFixed(2)}`;
  }

  checkoutBtn.addEventListener("click", () => {
    cart.length = 0;
    cartTotal.classList.add("hidden");
    renderCart(cart);
    totalCartPrice(cart);
    alert("Checkout Successful");
    saveProducts();
  });

  function saveProducts() {
    localStorage.setItem("cartArray", JSON.stringify(cart));
  }
});

