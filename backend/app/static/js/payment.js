function ensureCustomerSession() {
  const activeRole = localStorage.getItem("activeRole");
  const customer = JSON.parse(localStorage.getItem("loggedCustomer") || "null");
  if (activeRole !== "customer" || !customer) {
    alert("Please login as user before booking.");
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

function customerBookingKey(customer) {
  const lpu = String(customer?.lpuId || "").trim().toLowerCase();
  const email = String(customer?.email || "").trim().toLowerCase();
  return lpu || email;
}

const hasSession = ensureCustomerSession();
const booking = hasSession ? JSON.parse(localStorage.getItem("pendingBooking") || "null") : null;
const activeCustomer = hasSession ? JSON.parse(localStorage.getItem("loggedCustomer") || "null") : null;

if (hasSession && !booking) {
  alert("No booking found.");
  window.location.href = "/Car.html";
}

if (hasSession && booking) {
  document.getElementById("vehicleName").innerText = booking.vehicle || "";
  const isHourly = booking.rentalUnit === "hour";
  document.getElementById("pickup").innerText = isHourly
    ? `${booking.pickup || ""} ${booking.pickupTime || ""}`.trim()
    : booking.pickup || "";
  document.getElementById("return").innerText = isHourly
    ? `${booking.returnDate || ""} ${booking.returnTime || ""}`.trim()
    : booking.returnDate || "";

  let computedTotal = booking.total || 0;
  if (isHourly) {
    const start = booking.pickup && booking.pickupTime ? new Date(`${booking.pickup}T${booking.pickupTime}`) : null;
    const end = booking.returnDate && booking.returnTime ? new Date(`${booking.returnDate}T${booking.returnTime}`) : null;
    const hours = start && end ? (end - start) / (1000 * 60 * 60) : 0;
    const billedHours = hours > 0 ? Math.ceil(hours) : 0;
    if (billedHours && booking.pricePerHour) {
      computedTotal = billedHours * Number(booking.pricePerHour);
    }
  } else {
    const pickupDate = booking.pickup ? new Date(booking.pickup) : null;
    const returnDate = booking.returnDate ? new Date(booking.returnDate) : null;
    const days = pickupDate && returnDate ? (returnDate - pickupDate) / (1000 * 60 * 60 * 24) : 0;
    const safeDays = days > 0 ? days : 0;
    if (safeDays && booking.pricePerDay) {
      computedTotal = safeDays * Number(booking.pricePerDay);
    }
  }

  booking.total = computedTotal;
  document.getElementById("total").innerText = String(computedTotal);
  document.getElementById("bookingType").innerText = isHourly ? "Hourly" : "Daily";
  document.getElementById("vehicleImage").src = booking.image || "";
}

function processPayment() {
  if (!hasSession || !booking) {
    return;
  }

  const method = document.querySelector("input[name='method']:checked");
  if (!method) {
    alert("Select a payment method.");
    return;
  }

  fetch("/api/bookings/create/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vehicle_id: booking.vehicleId,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      customer_email: booking.customerEmail,
      customer_address: booking.customerAddress,
      customer_lpu_id: booking.customerLpuId,
      customer_license_number: booking.customerLicenseNumber,
      customer_age: booking.customerAge,
      driving_license_doc: booking.drivingLicenseDoc,
      student_id_doc: booking.studentIdDoc,
      rental_unit: booking.rentalUnit || "day",
      start_date: booking.pickup,
      end_date: booking.returnDate,
      start_time: booking.pickupTime || "",
      end_time: booking.returnTime || "",
      total_price: booking.total
    })
  })
    .then(async (res) => {
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Booking failed");
      }
      return text ? JSON.parse(text) : {};
    })
    .then((result) => {
      const userKey = customerBookingKey(activeCustomer || {});
      const cacheKey = userKey ? `confirmedBookings:${userKey}` : "confirmedBookings";
      const confirmedBookings = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      confirmedBookings.push({
        ...booking,
        id: result.id,
        status: "pending"
      });
      localStorage.setItem(cacheKey, JSON.stringify(confirmedBookings));
      localStorage.removeItem("pendingBooking");
      alert("Booking placed successfully. Awaiting admin approval.");
      window.location.href = "/MyBooking.html";
    })
    .catch((error) => {
      alert(`Unable to place booking: ${error.message}`);
    });
}
