function getNavbarUser() {
  return JSON.parse(localStorage.getItem("loggedCustomer") || "null");
}

function setupNavbarProfileAvatar() {
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  const user = getNavbarUser();
  const loginBtn = navActions.querySelector(".btn-primary");
  const existingAvatar = navActions.querySelector(".nav-avatar-link");

  if (!user) {
    // User not logged in - show login button, hide avatar
    if (existingAvatar) existingAvatar.remove();
    if (loginBtn) {
      loginBtn.style.display = "";
      loginBtn.style.visibility = "visible";
    }
    return;
  }

  // User is logged in - hide login button, show avatar
  if (loginBtn) {
    loginBtn.style.display = "none";
    loginBtn.style.visibility = "hidden";
  }

  // Create or update avatar link
  let avatarLink = existingAvatar;
  if (!avatarLink) {
    avatarLink = document.createElement("a");
    avatarLink.className = "nav-avatar-link";
    navActions.appendChild(avatarLink);
  }

  avatarLink.href = "profile.html";
  avatarLink.title = user.name || "My Profile";
  avatarLink.setAttribute("aria-label", "Open profile");

  // Create or update avatar image
  let avatarImg = avatarLink.querySelector("img");
  if (!avatarImg) {
    avatarImg = document.createElement("img");
    avatarLink.appendChild(avatarImg);
  }

  avatarImg.className = "nav-avatar";
  avatarImg.alt = user.name || "Profile";
  
  // Use profile photo or default avatar
  const defaultAvatar = "../assets/logo.jpg"; // Using logo as default circular avatar
  avatarImg.src = user.profilePhoto || defaultAvatar;
  
  // Handle image load errors
  avatarImg.onerror = function() {
    this.src = defaultAvatar;
  };
}

// Run on page load
document.addEventListener("DOMContentLoaded", setupNavbarProfileAvatar);

// Also run after a short delay to catch dynamically loaded navbars
setTimeout(setupNavbarProfileAvatar, 100);

// --- Navbar search + animated placeholder ---
function setupNavbarSearch() {
  const searchInput = document.querySelector('.navbar .search-wrapper input');
  if (!searchInput) return;

  // Typing-placeholder animation
  const phrases = ['Search vehicles', 'e.g. Royal Enfield', 'e.g. BMW X7', 'e.g. Hunter 350'];
  let pIndex = 0;
  let charIndex = 0;
  let typing = true;
  let animDelay = 80;
  let loopDelay = 1200;
  let animTimer = null;

  function startAnimation() {
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(tick, animDelay);
  }

  function tick() {
    const phrase = phrases[pIndex];
    if (typing) {
      charIndex++;
      searchInput.placeholder = phrase.slice(0, charIndex);
      if (charIndex >= phrase.length) {
        typing = false;
        animTimer = setTimeout(tick, loopDelay);
        return;
      }
    } else {
      charIndex--;
      searchInput.placeholder = phrase.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        typing = true;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    animTimer = setTimeout(tick, animDelay);
  }

  // Pause animation when user focuses or types
  function pauseAnimation() {
    if (animTimer) { clearTimeout(animTimer); animTimer = null; }
  }

  function resumeAnimation() {
    if (!animTimer && !searchInput.value) startAnimation();
  }

  searchInput.addEventListener('focus', pauseAnimation);
  searchInput.addEventListener('input', pauseAnimation);
  searchInput.addEventListener('blur', resumeAnimation);

  // Start only if input empty
  if (!searchInput.value) startAnimation();

  // Enter key: run simple search redirect
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      const q = searchInput.value.trim();
      if (!q) return;
      const ql = q.toLowerCase();
      const bikeKeys = ['bike','bikes','enfield','hunter','pulser','splendor','royal'];
      const carKeys = ['car','cars','bmw','audi','mercedes','sedan','x7','x5'];
      const isBike = bikeKeys.some(k => ql.includes(k));
      const isCar = carKeys.some(k => ql.includes(k));
      if (isCar && !isBike) {
        window.location.href = 'Car.html?q=' + encodeURIComponent(q);
      } else {
        // default to Bikes page for general queries
        window.location.href = 'Bikes.html?q=' + encodeURIComponent(q);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', setupNavbarSearch);
setTimeout(setupNavbarSearch, 120);
