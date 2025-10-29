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
    { id: 3, item: "Product 3", price: 59.999 },
  ];
  // ye 59.999 dikkat deta hai jab cart to render karte hai kyuki toFixed(2) hamne sirf product list me lagaya hai na ki array me stored item pe
  const cart = JSON.parse(localStorage.getItem("cartArray")) || [];

  renderCart(cart);
  totalCartPrice(cart);

  products.forEach((p) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    const price = p.price.toFixed(2);
    productDiv.innerHTML = `<span> ${p.item} - $${price}</span> <button data-id="${p.id}" >add</button>`;
    //The blunt answer is that the product.id is written inside double quotes ("") because it is being inserted as the value of an HTML attribute, and all HTML attribute values must be enclosed in quotes.
    productList.appendChild(productDiv);
  });

  // Add to Cart btn
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

      // Use parseInt() as your IDs are numbers
      const productIdToRemove = parseInt(btn.getAttribute("data-id"));

      //DOM removal of that product from cart-items
      e.target.closest(".cart-container").remove();

      // 🛑 CRITICAL DATA FIX: Use findIndex() and splice()
      // MUSkil code hai dhya rakho splice aur findIndex use karna seekho
      // Find the index of the FIRST product object in the array
      // that matches the ID we want to delete.
      const indexToRemove = cart.findIndex(
        (cartProduct) => cartProduct.id === productIdToRemove
      );

      if (indexToRemove !== -1) {
        // Use splice() to remove only ONE element at that found index
        cart.splice(indexToRemove, 1);

        console.log(
          `Removed product at index ${indexToRemove}. New cart length: ${cart.length}`
        );

        // 3. Update the UI and Storage
        totalCartPrice(cart);
        saveProducts();
        renderCart(cart); // Rerender to show empty message if needed
      }
    }
  });

  function totalCartPrice(cart) {
    // Calculates total from the current state of the 'cart' array
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
    alert("madarchod");
    saveProducts();
  });

  function saveProducts() {
    localStorage.setItem("cartArray", JSON.stringify(cart));
  }
});
