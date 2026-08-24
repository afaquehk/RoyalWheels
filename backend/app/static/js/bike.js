function parsePrice(card) {
  const priceText = card.querySelector(".car-price")?.textContent || "0";
  const normalized = priceText.replace(/,/g, "");
  const match = normalized.match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function parseRating(card) {
  const specs = card.querySelectorAll(".car-specs .spec");
  for (const spec of specs) {
    const text = spec.textContent || "";
    const match = text.match(/([0-5](\.[0-9]+)?)/);
    if (match && text.includes(".")) {
      return Number(match[1]);
    }
  }
  return 0;
}

function getVehicleFromCard(card, type) {
  const vehicleId = Number(card.getAttribute("data-vehicle-id") || "0");
  const vehicle = card.querySelector(".car-name")?.textContent?.trim() || "Vehicle";
  const image = card.querySelector(".car-img")?.getAttribute("src") || "../assets/hunter.png";
  const pricePerDay = parsePrice(card);
  return { vehicleId, vehicle, image, pricePerDay, type };
}

function attachNavbarActions() {
  const adminBtn = document.querySelector(".nav-actions .btn-outline");
  const loginBtn = document.querySelector(".nav-actions .btn-primary");

  adminBtn?.addEventListener("click", () => {
    window.location.href = "/admin-login/";
  });

  loginBtn?.addEventListener("click", () => {
    window.location.href = "/login.html";
  });
}

function attachSearch(cards) {
  const searchInput = document.querySelector(".search-bar input");
  if (!searchInput) {
    return;
  }

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    cards.forEach((card) => {
      const name = card.querySelector(".car-name")?.textContent?.toLowerCase() || "";
      const subtitle = card.querySelector(".car-subtitle")?.textContent?.toLowerCase() || "";
      const show = name.includes(q) || subtitle.includes(q) || q === "";
      card.style.display = show ? "" : "none";
    });
  });
}

function attachSort(cards) {
  const parent = document.querySelector(".cars-row");
  const sortSelect = document.getElementById("sortSelect");
  if (!parent || !sortSelect) {
    return;
  }

  sortSelect.addEventListener("change", () => {
    const sorted = [...cards];
    if (sortSelect.value === "priceLow") {
      sorted.sort((a, b) => parsePrice(a) - parsePrice(b));
    } else if (sortSelect.value === "priceHigh") {
      sorted.sort((a, b) => parsePrice(b) - parsePrice(a));
    } else if (sortSelect.value === "rating") {
      sorted.sort((a, b) => parseRating(b) - parseRating(a));
    }

    sorted.forEach((card) => parent.appendChild(card));
  });
}

function ensureCanBook() {
  const activeRole = localStorage.getItem("activeRole");
  if (!activeRole) {
    alert("Please login first to book a vehicle.");
    window.location.href = "/login.html";
    return false;
  }
  if (activeRole === "admin") {
    alert("Admin account cannot create customer bookings. Please login as user.");
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  attachNavbarActions();

  const cards = Array.from(document.querySelectorAll(".cars-row .car-card"));
  if (cards.length === 0) {
    return;
  }

  attachSearch(cards);
  attachSort(cards);

  cards.forEach((card) => {
    const button = card.querySelector(".book-btn");
    button?.addEventListener("click", (event) => {
      event.preventDefault();
      if (!ensureCanBook()) {
        return;
      }
      const selectedVehicle = getVehicleFromCard(card, "Bike");
      localStorage.setItem("selectedVehicle", JSON.stringify(selectedVehicle));
      window.location.href = "/Book_now.html";
    });
  });
});
