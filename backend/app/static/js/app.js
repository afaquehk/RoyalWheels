const reveals = document.querySelectorAll(".reveal");
if (reveals.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((reveal) => observer.observe(reveal));
}

// Set minimum date to today for all date inputs
function setMinDateToToday() {
  const today = new Date().toISOString().split('T')[0];
  const allDateInputs = document.querySelectorAll('input[type="date"]');
  
  allDateInputs.forEach(input => {
    input.setAttribute('min', today);
  });
}

// Set return date minimum based on pickup date
function setupDateValidation() {
  const pickupInput = document.getElementById('pickupDate');
  const returnInput = document.getElementById('returnDate');
  
  if (pickupInput && returnInput) {
    pickupInput.addEventListener('change', () => {
      if (pickupInput.value) {
        // Set return date minimum to pickup date
        returnInput.setAttribute('min', pickupInput.value);
        
        // If return date is before pickup date, clear it
        if (returnInput.value && returnInput.value < pickupInput.value) {
          returnInput.value = '';
        }
      }
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set minimum dates
  setMinDateToToday();
  
  const searchBtn = document.querySelector(".search-btn");
  const vehicleSelect = document.querySelector(".search-field select");
  const dateInputs = document.querySelectorAll('.search-field input[type="date"]');

  if (searchBtn && vehicleSelect && dateInputs.length === 2) {
    setupDateValidation();
    
    searchBtn.addEventListener("click", () => {
      const vehicleType = vehicleSelect.value;
      const pickupDate = dateInputs[0].value;
      const returnDate = dateInputs[1].value;

      if (vehicleType === "Select vehicle type") {
        alert("Please select vehicle type");
        return;
      }

      if (!pickupDate || !returnDate) {
        alert("Please select pickup and return dates");
        return;
      }

      // Validate return date is after pickup date
      if (new Date(returnDate) <= new Date(pickupDate)) {
        alert("Return date must be after pickup date");
        return;
      }

      if (vehicleType === "Cars") {
        window.location.href = "/Car.html";
      } else if (vehicleType === "Bikes") {
        window.location.href = "/Bikes.html";
      }
    });
  }

  const viewAllBtn = document.querySelector(".view-all-btn");
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      window.location.href = "/AllPartners.html";
    });
  }
});
