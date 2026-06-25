/* =========================================================
   🚀 HAMBURGER MENU
========================================================= */
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

/* =========================================================
   📞 PHONE INPUT WITH COUNTRY CODE (+63)
========================================================= */
const phoneInput = document.querySelector("#phone");

if (phoneInput && window.intlTelInput) {
  window.intlTelInput(phoneInput, {
    initialCountry: "ph",
    preferredCountries: ["ph"],
    separateDialCode: true,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.0/build/js/utils.js",
  });

  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");

    if (this.value.startsWith("0")) {
      this.value = this.value.substring(1);
    }

    this.value = this.value.substring(0, 10);
  });
}

/* =========================================================
   🚀 SUBMIT BOOKING (FIXED - NO FILE LOSS)
========================================================= */
function submitBooking() {

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const fileInput = document.getElementById("paymentScreenshot");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const errorMsg = document.getElementById("error-msg");

  let isValid = true;

  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
  if (errorMsg) errorMsg.textContent = "";

  const namePattern = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com)$/;

  if (!namePattern.test(firstName.value.trim())) {
    nameError.textContent = "Invalid first name";
    nameError.style.color = "red";
    firstName.style.border = "2px solid red";
    isValid = false;
  }

  if (!namePattern.test(lastName.value.trim())) {
    nameError.textContent = "Invalid last name";
    nameError.style.color = "red";
    lastName.style.border = "2px solid red";
    isValid = false;
  }

  if (!emailPattern.test(email.value.trim())) {
    emailError.textContent = "Only Gmail | Yahoo allowed";
    emailError.style.color = "red";
    email.style.border = "2px solid red";
    isValid = false;
  }

  if (!/^9\d{9}$/.test(phone.value.trim())) {
    phoneError.textContent = "Invalid PH number";
    phoneError.style.color = "red";
    phone.style.border = "2px solid red";
    isValid = false;
  }

  if (!fileInput || !fileInput.files.length) {
    if (errorMsg) errorMsg.textContent = "Upload payment screenshot";
      errorMsg.style.color = "red";
      isValid = false;
  }

  if (!isValid) return;

  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (!bookingData || !bookingData.slots?.length) {
    alert("Missing booking data");
    return;
  }

  // SAVE BOOKING INFO
  const payload = {
    name: `${firstName.value.trim()} ${lastName.value.trim()}`,
    email: email.value.trim(),
    phone: phone.value.trim(),
    date: bookingData.date,
    slots: bookingData.slots
  };

  localStorage.setItem("pendingBooking", JSON.stringify(payload));
  console.log("BOOKING SAVED SUCCESSFULLY:", payload);

  // ✅ SAVE FILE SAFE ACROSS PAGES
  const file = fileInput.files[0];

  const reader = new FileReader();

  reader.onload = function () {
    sessionStorage.setItem("paymentScreenshot", reader.result);

    // GO TO WAIVER PAGE AFTER FILE IS SAVED
    window.location.href = "waiver-terms.html";
  };

  reader.readAsDataURL(file);
}

/* =========================================================
   📁 FILE NAME DISPLAY
========================================================= */
const fileInput = document.getElementById("paymentScreenshot");
const fileName = document.getElementById("file-name");

if (fileInput) {
  fileInput.addEventListener("change", function () {
    fileName.textContent =
      this.files?.[0]?.name || "No file chosen";
  });
}

/* =========================================================
   📦 LOAD BOOKING DATA
========================================================= */
window.addEventListener("DOMContentLoaded", () => {

  const bookingData = JSON.parse(localStorage.getItem("bookingData"));

  if (!bookingData) return;

  document.getElementById("venueName").textContent =
    bookingData.venue || "Cøurtify";

  document.getElementById("bookingDate").textContent =
    bookingData.date;

  const bookingDetails = document.getElementById("bookingDetails");
  bookingDetails.innerHTML = "";

  let total = 0;

  bookingData.slots.forEach(slot => {
    bookingDetails.innerHTML += `
      <div class="booking-item">
        <div><strong>Schedule Time</strong><br>${slot.time}</div>
        <div>₱${slot.price}</div>
      </div>
    `;
    total += Number(slot.price ?? 199);
  });

  document.getElementById("totalPrice").textContent =
    `₱${total.toFixed(2)}`;
});