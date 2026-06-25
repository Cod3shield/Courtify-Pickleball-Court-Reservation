
// =========================================
// START: TERMS SCROLL VALIDATION
// =========================================
document.addEventListener("DOMContentLoaded", () => {

  const btn = document.querySelector(".agree");
  const box = document.querySelector(".terms-box");

  console.log("btn =", btn);
  console.log("box =", box);

  btn.disabled = true;

  box.addEventListener("scroll", () => {

    const bottom =
      Math.ceil(box.scrollTop + box.clientHeight) >=
      box.scrollHeight - 5;

    if (bottom) {
      btn.disabled = false;
      btn.onclick = acceptTerms; // FIXED (no duplicate listeners)
    }

  });

});
// =========================================
// END: TERMS SCROLL VALIDATION
// =========================================


// =========================================
// START: DECLINE TERMS FUNCTION
// =========================================
function declineTerms() {
  localStorage.removeItem("bookingData");
  localStorage.removeItem("bookingId");

  window.location.href = "picklehaus.html";
}
// =========================================
// END: DECLINE TERMS FUNCTION
// =========================================


// =========================================
// START: ACCEPT TERMS AND SUBMIT BOOKING
// =========================================
async function acceptTerms() {

  const payload = JSON.parse(localStorage.getItem("pendingBooking"));

  if (!payload) {
    alert("Missing booking data");
    return;
  }

  try {

    document.getElementById("loadingSpinner").style.display = "block";
    document.querySelector(".agree").disabled = true;
    document.querySelector(".decline").disabled = true;

    await new Promise(resolve => setTimeout(resolve, 2000));

    // ✔ GET FILE FROM SESSION STORAGE (FIXED)
    const dataURL = sessionStorage.getItem("paymentScreenshot");

    const dataURLtoFile = (dataurl, filename) => {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    };

    const file = dataURL ? dataURLtoFile(dataURL, "payment.jpg") : null;

    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    formData.append("phone", payload.phone);
    formData.append("date", payload.date);
    formData.append("slots", JSON.stringify(payload.slots));

    if (file) {
      formData.append("screenshot", file);
    }

    const res = await fetch("http://localhost:3000/book", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message);
    }

// 👉 IBUTANG NI DIRI
const bookingId =
  "BK-" +
  Math.floor(100000 + Math.random() * 900000);

localStorage.setItem("bookingId", bookingId);

sessionStorage.removeItem("paymentScreenshot");

window.location.href = "submitted.html";

  } catch (err) {

    console.error(err);

    document.getElementById("loadingSpinner").style.display = "none";
    document.querySelector(".agree").disabled = false;
    document.querySelector(".decline").disabled = false;

    alert("Server error or booking failed");
  }
}