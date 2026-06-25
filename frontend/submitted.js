window.addEventListener("DOMContentLoaded", () => {

  // booking id
  const bookingId =
    localStorage.getItem("bookingId");

  document.getElementById("bookingId")
    .textContent = bookingId || "N/A";

  // booking data
  const bookingData =
    JSON.parse(
      localStorage.getItem("bookingData")
    );

  // ✅ FIX: USE ONLY pendingBooking (IMPORTANT)
  const customer =
    JSON.parse(
      localStorage.getItem("pendingBooking")
    );

  // display customer info
  if (customer) {

    document.getElementById("customerName")
      .textContent =
      customer.name || "N/A";

    document.getElementById("customerEmail")
      .textContent =
      customer.email || "N/A";

    document.getElementById("customerPhone")
      .textContent =
      "+63" + (customer.phone || "");

    document.getElementById("emailMessage")
      .textContent =
      "A confirmation email has been sent to "
      + (customer.email || "");
  }

  // booking schedule
  if (bookingData) {

    document.getElementById("bookingDate")
      .textContent =
      bookingData.date || "N/A";

    if (
      bookingData.slots &&
      bookingData.slots.length > 0
    ) {

      document.getElementById("courtSchedule")
        .innerHTML =
        bookingData.slots
          .map(slot => `• ${slot.time}`)
          .join("<br>");

      let total = 0;

      bookingData.slots.forEach(slot => {
        total += Number(slot.price ?? 200);
      });

      document.getElementById("basePrice")
        .textContent =
        `₱${total.toFixed(2)}`;

      document.getElementById("totalPaid")
        .textContent =
        `₱${total.toFixed(2)}`;
    }
  }

});

/* =========================================
   DOWNLOAD PDF RECEIPT
========================================= */

function downloadReceipt() {
  const element = document.getElementById("receipt");

  html2pdf()
    .set({
      margin: 0.3,
      filename: "booking-receipt.pdf",

      image: {
        type: "jpeg",
        quality: 0.8
      },

      html2canvas: {
        scale: 1.2,
        scrollY: 0
      },

      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      }
    })
    .from(element)
    .outputPdf("blob")
    .then((blob) => {
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "booking-receipt.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    });
}

// SHARE RECEIPT
function shareReceipt() {

  const bookingId =
    document.getElementById("bookingId").innerText;

  const customerName =
    document.getElementById("customerName").innerText;

  const totalPaid =
    document.getElementById("totalPaid").innerText;

  const message =
    `Booking Receipt

Booking ID: ${bookingId}
Customer: ${customerName}
Total Paid: ${totalPaid}`;

  // MOBILE SHARE SUPPORT
  if (navigator.share) {

    navigator.share({
      title: "Booking Receipt",
      text: message,
      url: window.location.href
    })

      .then(() => {
        console.log("Receipt shared successfully");
      })

      .catch((error) => {
        console.log("Error sharing:", error);
      });

  } else {

    // FALLBACK IF SHARE NOT SUPPORTED
    navigator.clipboard.writeText(message);

    alert("Receipt info copied to clipboard!");
  }
}