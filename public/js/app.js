const products = [
  {
    id: "p1",
    name: "Arc Desk Lamp",
    category: "Home",
    price: 129,
    rating: 4.8,
    stock: 18,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    description: "Dimmable aluminum task light with wireless charging in the base.",
    review: "Bright, solid, and compact enough for a focused workspace."
  },
  {
    id: "p2",
    name: "Transit Weekender",
    category: "Travel",
    price: 248,
    rating: 4.7,
    stock: 7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "Weather-resistant carryall with shoe storage and padded laptop sleeve.",
    review: "The compartments make short trips feel unusually organized."
  },
  {
    id: "p3",
    name: "Studio Headphones",
    category: "Tech",
    price: 319,
    rating: 4.9,
    stock: 22,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Noise-canceling headphones tuned for clear calls and rich music.",
    review: "Excellent battery life and a clean, balanced sound profile."
  },
  {
    id: "p4",
    name: "Brew Pro Kettle",
    category: "Kitchen",
    price: 156,
    rating: 4.6,
    stock: 4,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
    description: "Precision electric kettle with five presets and hold-temperature mode.",
    review: "A reliable upgrade for tea, pour-over coffee, and daily use."
  },
  {
    id: "p5",
    name: "Ergo Work Chair",
    category: "Office",
    price: 699,
    rating: 4.5,
    stock: 11,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80",
    description: "Adjustable mesh chair with lumbar support and a compact footprint.",
    review: "Supportive without looking bulky in a home office."
  },
  {
    id: "p6",
    name: "Ceramic Dinner Set",
    category: "Kitchen",
    price: 184,
    rating: 4.4,
    stock: 16,
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    description: "Sixteen-piece glazed dinnerware set with dishwasher-safe finish.",
    review: "Simple, sturdy pieces that dress up weeknight meals."
  },
  {
    id: "p7",
    name: "Smart Fitness Watch",
    category: "Tech",
    price: 389,
    rating: 4.7,
    stock: 6,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    description: "Health tracking, GPS workouts, notifications, and seven-day battery.",
    review: "The dashboard is clear and the band feels light all day."
  },
  {
    id: "p8",
    name: "Linen Throw Set",
    category: "Home",
    price: 96,
    rating: 4.3,
    stock: 28,
    image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80",
    description: "Two textured throws in breathable cotton-linen blend.",
    review: "Soft texture and easy color pairing across rooms."
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("cart") || "{}"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  orders: JSON.parse(localStorage.getItem("orders") || "[]"),
  filters: {
    category: "All",
    rating: 0,
    price: 900,
    query: "",
    sort: "featured"
  }
};

const productGrid = document.querySelector("#productGrid");
const categoryFilters = document.querySelector("#categoryFilters");
const ratingFilters = document.querySelector("#ratingFilters");
const searchInput = document.querySelector("#searchInput");
const priceRange = document.querySelector("#priceRange");
const priceValue = document.querySelector("#priceValue");
const sortSelect = document.querySelector("#sortSelect");
const resultCount = document.querySelector("#resultCount");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutModal = document.querySelector("#checkoutModal");
const toast = document.querySelector("#toast");

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function saveState() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
  localStorage.setItem("orders", JSON.stringify(state.orders));
  if (state.user) {
    localStorage.setItem("user", JSON.stringify(state.user));
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function getFilteredProducts() {
  const query = state.filters.query.toLowerCase();
  const sorted = products.filter((product) => {
    const matchesCategory = state.filters.category === "All" || product.category === state.filters.category;
    const matchesRating = product.rating >= state.filters.rating;
    const matchesPrice = product.price <= state.filters.price;
    const matchesQuery = [product.name, product.category, product.description].join(" ").toLowerCase().includes(query);
    return matchesCategory && matchesRating && matchesPrice && matchesQuery;
  });

  return sorted.sort((a, b) => {
    if (state.filters.sort === "price-low") return a.price - b.price;
    if (state.filters.sort === "price-high") return b.price - a.price;
    if (state.filters.sort === "rating") return b.rating - a.rating;
    return products.indexOf(a) - products.indexOf(b);
  });
}

function renderFilterButtons() {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  categoryFilters.innerHTML = categories.map((category) => (
    `<button class="${state.filters.category === category ? "active" : ""}" data-category="${category}">${category}</button>`
  )).join("");

  ratingFilters.innerHTML = [0, 4.5, 4.7].map((rating) => (
    `<button class="${state.filters.rating === rating ? "active" : ""}" data-rating="${rating}">${rating ? `${rating}+` : "Any"}</button>`
  )).join("");
}

function renderProducts() {
  const visibleProducts = getFilteredProducts();
  resultCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"}`;

  productGrid.innerHTML = visibleProducts.length ? visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="badge">${product.category}</span>
      </div>
      <div class="product-body">
        <div class="product-title-row">
          <h3>${product.name}</h3>
          <span class="price">${money(product.price)}</span>
        </div>
        <p>${product.description}</p>
        <div class="meta-row">
          <span class="rating">★ ${product.rating}</span>
          <span>${product.stock} in stock</span>
        </div>
        <div class="product-actions">
          <button data-add="${product.id}">Add to cart</button>
          <button class="review-button" data-review="${product.id}" aria-label="Read review for ${product.name}">Review</button>
        </div>
      </div>
    </article>
  `).join("") : `<div class="empty-state">No products match the current filters.</div>`;
}

function cartEntries() {
  return Object.entries(state.cart).map(([id, quantity]) => ({
    product: products.find((item) => item.id === id),
    quantity
  })).filter((entry) => entry.product);
}

function renderCart() {
  const entries = cartEntries();
  const totalItems = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = money(total);

  cartItems.innerHTML = entries.length ? entries.map(({ product, quantity }) => `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <strong>${product.name}</strong>
        <div>${money(product.price)}</div>
      </div>
      <div class="qty-controls" aria-label="Quantity controls for ${product.name}">
        <button data-decrease="${product.id}" aria-label="Decrease quantity">−</button>
        <span>${quantity}</span>
        <button data-increase="${product.id}" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join("") : `<div class="empty-state">Your cart is ready when you are.</div>`;

  saveState();
  renderAdmin();
  renderProfile();
}

function addToCart(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  state.cart[id] = Math.min((state.cart[id] || 0) + 1, product.stock);
  renderCart();
  showToast(`${product.name} added to cart.`);
}

function updateQuantity(id, delta) {
  state.cart[id] = (state.cart[id] || 0) + delta;
  if (state.cart[id] <= 0) {
    delete state.cart[id];
  }
  renderCart();
}

function renderTracking(orderNumber = "CP-1048") {
  const order = state.orders.find((item) => item.number.toLowerCase() === orderNumber.toLowerCase());
  const steps = ["Confirmed", "Packed", "Shipped", "Out for delivery", "Delivered"];
  const completeThrough = order ? order.step : 2;

  document.querySelector("#timeline").innerHTML = steps.map((step, index) => `
    <div class="timeline-step ${index <= completeThrough ? "done" : ""}">
      <span class="timeline-dot"></span>
      <strong>${step}</strong>
      <span>${index <= completeThrough ? "Complete" : "Pending"}</span>
    </div>
  `).join("");
}

function renderProfile() {
  const entries = cartEntries();
  const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const profile = document.querySelector("#profileSummary");
  const email = state.user?.email || "Guest customer";

  profile.innerHTML = `
    <div>
      <p class="eyebrow">Account</p>
      <h2>${email}</h2>
    </div>
    <div class="profile-stat"><span>Saved cart value</span><strong>${money(total)}</strong></div>
    <div class="profile-stat"><span>Tracked orders</span><strong>${state.orders.length}</strong></div>
    <div class="profile-stat"><span>Loyalty tier</span><strong>${state.orders.length > 2 ? "Gold" : "Standard"}</strong></div>
  `;
}

function renderAdmin() {
  const entries = cartEntries();
  const cartTotalValue = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const totalSales = state.orders.reduce((sum, order) => sum + order.total, 0) + cartTotalValue;

  document.querySelector("#salesTotal").textContent = money(totalSales);
  document.querySelector("#openOrders").textContent = Math.max(3, state.orders.length + 3);
  document.querySelector("#lowStock").textContent = products.filter((product) => product.stock <= 7).length;
  document.querySelector("#customerCount").textContent = state.user ? 128 : 127;

  document.querySelector("#inventoryTable").innerHTML = products.map((product) => {
    const low = product.stock <= 7;
    return `
      <tr>
        <td><strong>${product.name}</strong></td>
        <td>${product.category}</td>
        <td>${product.stock}</td>
        <td>${money(product.price)}</td>
        <td><span class="status-pill ${low ? "status-low" : "status-ok"}">${low ? "Low stock" : "Available"}</span></td>
        <td><button data-restock="${product.id}">Restock</button></td>
      </tr>
    `;
  }).join("");
}

function placeOrder() {
  const entries = cartEntries();
  if (!entries.length) {
    showToast("Add an item before checkout.");
    return false;
  }

  const total = entries.reduce((sum, entry) => sum + entry.product.price * entry.quantity, 0);
  const number = `CP-${Math.floor(1000 + Math.random() * 9000)}`;
  state.orders.unshift({ number, total, step: 1, createdAt: new Date().toISOString() });
  state.cart = {};
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  renderCart();
  renderTracking(number);
  showToast(`Order ${number} placed securely.`);
  return true;
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;

  if (target.dataset.add) addToCart(target.dataset.add);
  if (target.dataset.review) {
    const product = products.find((item) => item.id === target.dataset.review);
    showToast(product.review);
  }
  if (target.dataset.increase) updateQuantity(target.dataset.increase, 1);
  if (target.dataset.decrease) updateQuantity(target.dataset.decrease, -1);
  if (target.dataset.restock) {
    const product = products.find((item) => item.id === target.dataset.restock);
    product.stock += 5;
    renderProducts();
    renderAdmin();
    showToast(`${product.name} inventory updated.`);
  }
});

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.filters.category = button.dataset.category;
  renderFilterButtons();
  renderProducts();
});

ratingFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-rating]");
  if (!button) return;
  state.filters.rating = Number(button.dataset.rating);
  renderFilterButtons();
  renderProducts();
});

searchInput.addEventListener("input", (event) => {
  state.filters.query = event.target.value;
  renderProducts();
});

priceRange.addEventListener("input", (event) => {
  state.filters.price = Number(event.target.value);
  priceValue.textContent = money(state.filters.price);
  renderProducts();
});

sortSelect.addEventListener("change", (event) => {
  state.filters.sort = event.target.value;
  renderProducts();
});

document.querySelector("#cartToggle").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
});

document.querySelector("#closeCart").addEventListener("click", () => {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!cartEntries().length) {
    showToast("Your cart is empty.");
    return;
  }
  checkoutModal.classList.add("open");
  checkoutModal.setAttribute("aria-hidden", "false");
});

document.querySelector("#closeCheckout").addEventListener("click", () => {
  checkoutModal.classList.remove("open");
  checkoutModal.setAttribute("aria-hidden", "true");
});

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  placeOrder();
});

document.querySelector("#trackForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderTracking(document.querySelector("#orderInput").value || "CP-1048");
  showToast("Tracking status refreshed.");
});

document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#emailInput").value;
  state.user = { email, joinedAt: new Date().toISOString() };
  saveState();
  renderProfile();
  showToast(`Welcome, ${email}.`);
});

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

renderFilterButtons();
renderProducts();
renderCart();
renderTracking();
renderProfile();
renderAdmin();
