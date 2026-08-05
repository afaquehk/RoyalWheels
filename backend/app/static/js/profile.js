const defaultAvatar = "../assets/Mountain.jpg";

function getActiveUser() {
  return JSON.parse(localStorage.getItem("loggedCustomer") || localStorage.getItem("customer") || "null");
}

function saveActiveUser(user) {
  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const normalizedEmail = String(user?.email || "").trim().toLowerCase();
  const normalizedLpu = String(user?.lpuId || "").trim().toLowerCase();
  const index = customers.findIndex((customer) => {
    const email = String(customer?.email || "").trim().toLowerCase();
    const lpu = String(customer?.lpuId || "").trim().toLowerCase();
    return (normalizedEmail && email === normalizedEmail) || (normalizedLpu && lpu === normalizedLpu);
  });
  if (index >= 0) {
    customers[index] = user;
  } else {
    customers.push(user);
  }
  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.setItem("customer", JSON.stringify(user));
  localStorage.setItem("loggedCustomer", JSON.stringify(user));
}

function customerBookingKey(customer) {
  const lpu = String(customer?.lpuId || "").trim().toLowerCase();
  const email = String(customer?.email || "").trim().toLowerCase();
  return lpu || email;
}

function loadStats() {
  const user = getActiveUser();
  const key = customerBookingKey(user || {});
  const bookings = JSON.parse(localStorage.getItem(key ? `confirmedBookings:${key}` : "confirmedBookings") || "[]");
  let carCount = 0;
  let bikeCount = 0;

  bookings.forEach((booking) => {
    if ((booking.type || "").toLowerCase() === "bike") {
      bikeCount += 1;
    } else {
      carCount += 1;
    }
  });

  document.getElementById("carBookingsCount").textContent = String(carCount);
  document.getElementById("bikeBookingsCount").textContent = String(bikeCount);
}

function loadProfile() {
  const user = getActiveUser();
  if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("profileName").textContent = user.name || "Guest User";
  document.getElementById("profileEmail").textContent = user.email || "";
  document.getElementById("name").value = user.name || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("age").value = user.age || "";
  document.getElementById("address").value = user.address || "";
  document.getElementById("lpuId").value = user.lpuId || "";
  document.getElementById("license").value = user.license || "";

  const photoUrl = user.profilePhoto || defaultAvatar;
  document.getElementById("profileImage").src = photoUrl;
}

function setupProfileUpdate() {
  const form = document.getElementById("profileForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = getActiveUser();
    if (!user) return;

    user.name = document.getElementById("name").value.trim();
    user.email = document.getElementById("email").value.trim();
    user.phone = document.getElementById("phone").value.trim();
    user.age = document.getElementById("age").value.trim();
    user.address = document.getElementById("address").value.trim();
    user.lpuId = document.getElementById("lpuId").value.trim();
    user.license = document.getElementById("license").value.trim();

    saveActiveUser(user);
    document.getElementById("profileName").textContent = user.name || "Guest User";
    document.getElementById("profileEmail").textContent = user.email || "";
    alert("Profile updated successfully.");
  });
}

function setupPasswordUpdate() {
  const form = document.getElementById("passwordForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const user = getActiveUser();
    if (!user) return;

    const current = document.getElementById("currentPassword").value;
    const next = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (current !== user.password) {
      alert("Current password is incorrect.");
      return;
    }

    if (next.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (next !== confirm) {
      alert("New password and confirm password do not match.");
      return;
    }

    user.password = next;
    saveActiveUser(user);
    form.reset();
    alert("Password updated successfully.");
  });
}

function setupPhotoUpload() {
  const photoInput = document.getElementById("profilePhotoInput");
  photoInput.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const user = getActiveUser();
      if (!user) return;

      user.profilePhoto = result;
      saveActiveUser(user);
      document.getElementById("profileImage").src = result;
      alert("Profile photo updated.");
    };
    reader.readAsDataURL(file);
  });
}

function setupDocumentUpload() {
  const form = document.getElementById("documentsForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const user = getActiveUser();
    if (!user) {
      alert("Please login first.");
      window.location.href = "/login.html";
      return;
    }

    const licenseFile = document.getElementById("licenseDoc").files?.[0];
    const collegeFile = document.getElementById("collegeDoc").files?.[0];

    if (!licenseFile || !collegeFile) {
      alert("Please select both Driving License and College ID Card.");
      return;
    }

    const toDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("File read failed."));
        reader.readAsDataURL(file);
      });

    try {
      user.drivingLicenseDoc = await toDataUrl(licenseFile);
      user.studentIdDoc = await toDataUrl(collegeFile);
      user.drivingLicenseDocName = licenseFile.name;
      user.studentIdDocName = collegeFile.name;
      saveActiveUser(user);
      alert("Documents uploaded successfully.");
    } catch (error) {
      alert("Unable to upload documents. Please try again.");
    }
  });
}

function setupLogout() {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loggedCustomer");
    localStorage.removeItem("activeRole");
    localStorage.removeItem("pendingBooking");
    localStorage.removeItem("selectedVehicle");
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadStats();
  setupProfileUpdate();
  setupPasswordUpdate();
  setupPhotoUpload();
  setupDocumentUpload();
  setupLogout();
});
