let bookings = [];

const container = document.getElementById("bookingsContainer");
const sortSelect = document.getElementById("sortSelect");

function getActiveCustomer() {
  return JSON.parse(localStorage.getItem("loggedCustomer") || "null");
}

function customerBookingKey(customer) {
  const lpu = String(customer?.lpuId || "").trim().toLowerCase();
  const email = String(customer?.email || "").trim().toLowerCase();
  return lpu || email;
}

function renderBookings() {
  container.innerHTML = "";

  if (bookings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No Bookings Yet</h2>
        <p>You haven't made any bookings yet.</p>
        <a href="Car.html">Explore Vehicles</a>
      </div>
    `;
    return;
  }

  bookings.forEach((booking) => {
    const bookingVehicle = String(booking.vehicle || "");
    const type = booking.type || (bookingVehicle.toLowerCase().includes("bike") ? "Bike" : "Car");
    const image =
      booking.image ||
      booking.vehicle_image_url ||
      booking.display_image_url ||
      "/static/assets/logo.jpg";
    const pickup = booking.pickup || booking.start_date || "-";
    const returnDate = booking.returnDate || booking.end_date || "-";
    const pickupTime = booking.pickupTime || booking.start_time || "";
    const returnTime = booking.returnTime || booking.end_time || "";
    const rentalUnit = booking.rental_unit || booking.rentalUnit || "day";
    const pickupDisplay = pickupTime ? `${pickup} ${pickupTime}` : pickup;
    const returnDisplay = returnTime ? `${returnDate} ${returnTime}` : returnDate;
    const rentPerDay = Number(booking.rent_per_day || booking.pricePerDay || 0);
    const start = pickup && pickup !== "-" ? new Date(pickupTime ? `${pickup}T${pickupTime}` : pickup) : null;
    const end = returnDate && returnDate !== "-" ? new Date(returnTime ? `${returnDate}T${returnTime}` : returnDate) : null;
    const days = start && end ? Math.max(Math.ceil((end - start) / (1000 * 60 * 60 * 24)), 0) : 0;
    const computedTotal = rentPerDay && rentalUnit !== "hour" && days ? rentPerDay * days : null;
    const total = computedTotal ?? booking.total ?? booking.total_price ?? 0;
    const status = String(booking.status || "pending");
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

    const bookingCard = `
      <div class="booking-card">
        <div class="left-section">
          <img src="${image}" class="booking-image" alt="${bookingVehicle}">
          <div class="booking-info">
            <h2>${bookingVehicle}</h2>
            <p><strong>Rental:</strong> ${pickupDisplay} to ${returnDisplay}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Plan:</strong> ${rentalUnit === "hour" ? "Hourly" : "Daily"}</p>
          </div>
        </div>
        <div class="right-section">
          <p class="price">Rs ${total}</p>
          <p class="status">${statusLabel}</p>
        </div>
      </div>
    `;

    container.innerHTML += bookingCard;
  });
}

function sortBookings(value) {
  if (value === "price") {
    bookings.sort((a, b) => Number(a.total || a.total_price || 0) - Number(b.total || b.total_price || 0));
  }

  if (value === "date") {
    bookings.sort((a, b) => new Date(a.pickup || a.start_date) - new Date(b.pickup || b.start_date));
  }

  if (value === "name") {
    bookings.sort((a, b) => String(a.vehicle || "").localeCompare(String(b.vehicle || "")));
  }

  if (value === "type") {
    bookings.sort((a, b) => {
      const typeA = String(a.type || "").toLowerCase();
      const typeB = String(b.type || "").toLowerCase();
      return typeA.localeCompare(typeB);
    });
  }

  renderBookings();
}

async function loadBookings() {
  const activeRole = localStorage.getItem("activeRole");
  const customer = getActiveCustomer();
  if (activeRole !== "customer" || !customer) {
    alert("Please login first to view your bookings.");
    window.location.href = "/login.html";
    return;
  }

  const key = customerBookingKey(customer);
  if (!key) {
    bookings = [];
    renderBookings();
    return;
  }

  const emailKey = String(customer.email || "").trim().toLowerCase();
  const lpuKey = String(customer.lpuId || "").trim().toLowerCase();

  try {
    const response = await fetch("/api/bookings/");
    if (!response.ok) {
      throw new Error("Unable to fetch bookings");
    }

    const payload = await response.json();
    const allBookings = Array.isArray(payload.results) ? payload.results : [];
    bookings = allBookings
      .filter((booking) => {
        const bookingEmail = String(booking.customer_email || "").trim().toLowerCase();
        const bookingLpu = String(booking.customer_lpu_id || "").trim().toLowerCase();
        return (emailKey && bookingEmail === emailKey) || (lpuKey && bookingLpu === lpuKey);
      })
      .map((booking) => ({
        ...booking,
        pickup: booking.start_date,
        returnDate: booking.end_date,
        pickupTime: booking.start_time,
        returnTime: booking.end_time,
        total: booking.total_price,
        rent_per_day: booking.rent_per_day,
      }));

    localStorage.setItem(`confirmedBookings:${key}`, JSON.stringify(bookings));
    renderBookings();
  } catch (error) {
    bookings = JSON.parse(localStorage.getItem(`confirmedBookings:${key}`) || "[]");
    renderBookings();
  }
}

sortSelect?.addEventListener("change", function () {
  sortBookings(this.value);
});

loadBookings();
