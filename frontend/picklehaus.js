/*
========================================
START
========================================
*/


/*
========================================
START HAMBURGER MENU
========================================
*/

/*
========================================
HAMBURGER MENU
Handles mobile menu toggle
========================================
*/
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

/*
========================================
END HAMBURGER MENU
========================================
*/


/*
========================================
START PICKLEBALL BOOKING SYSTEM
========================================
*/

/*
========================================
PICKLEBALL BOOKING SYSTEM
========================================
*/

/* Available time slots */
const times = [
  "05:AM-06:AM", "06:AM-07:AM", "07:AM-08:AM", "08:AM-09:AM",
  "09:AM-10:AM", "10:AM-11:AM", "11:AM-12:PM", "12:PM-01:PM",
  "01:PM-02:PM", "02:PM-03:PM", "03:PM-04:PM", "04:PM-05:PM",
  "05:PM-06:PM", "06:PM-07:PM", "07:PM-08:PM", "08:PM-09:PM",
  "09:PM-10:PM", "10:PM-11:PM", "11:PM-12:AM", "12:AM-01:AM",
  "01:AM-02:AM", "02:AM-03:AM", "03:AM-04:AM", "04:AM-05:AM"
];


/*
========================================
START DYNAMIC BOOKING EXPIRATION
========================================
*/

/*
========================================
DYNAMIC BOOKING EXPIRATION
========================================
*/

function getExpirationTime(dateString) {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const bookingDate = new Date(dateString);
  bookingDate.setHours(0, 0, 0, 0);

  const diffTime =
    bookingDate.getTime() - today.getTime();

  const diffDays =
    Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  /* ========================================
  FIX ADDED:
  CURRENT DATE SHOULD NOT EXPIRE IMMEDIATELY
  ======================================== */

  if (diffDays <= 0) {
    return 24 * 60 * 60 * 1000;
  }

  return diffDays * 24 * 60 * 60 * 1000;
}


/*
========================================
START BOOKINGS PER DATE (DEFAULT DATA)
========================================
*/

/*
========================================
BOOKINGS PER DATE (DEFAULT DATA)
========================================
*/

const bookingsByDate = {

  "2025-06-10": {

    "6PM-7PM": {
      name: "Maria",
      createdAt: Date.now()
    },

    "7PM-8PM": {
      name: "Maria",
      createdAt: Date.now()
    },

    "5PM-6PM": {
      name: "Mariel",
      createdAt: Date.now()
    },

    "6PM-7PM": {
      name: "Mariel",
      createdAt: Date.now()
    },

    "7PM-8PM": {
      name: "Mariel",
      createdAt: Date.now()
    }
  },

  "2025-06-11": {

    "6AM-7AM": {
      name: "John",
      createdAt: Date.now()
    }

  }
};


/*
========================================
START GET SAVED BOOKINGS
========================================
*/

/* =========================================================
   🟢 GET SAVED BOOKINGS FROM LOCALSTORAGE
========================================================= */

let allBookings = bookingsByDate;

/*
========================================
LOAD BOOKINGS FROM BACKEND (MONGODB)
========================================
*/
async function loadBookingsFromServer() {
  try {

    const res = await fetch("http://localhost:3000/bookings");
    const data = await res.json();

    console.log("BOOKINGS FROM DB:", data); // 🔥 optional debug

    allBookings = data || {};

    buildTable();

  } catch (err) {
    console.error("Failed loading bookings:", err);
  }
}

// END PICKLEBALL BOOKING SYSTEM

window.addEventListener("DOMContentLoaded", () => {
  loadBookingsFromServer();
});


/*
========================================
START AUTO SET CURRENT DATE
========================================
*/

/* ========================================
AUTO SET CURRENT DATE
I changed this here
======================================== */

const currentDate = new Date();

let selectedDate =
`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;


/* Selected slots */
let selectedSlots = [];

/* Table body */
const tableBody = document.getElementById("tableBody");


/*
========================================
START BUILD TABLE
========================================
*/

/*
========================================
BUILD TABLE
========================================
*/

function buildTable() {

  tableBody.innerHTML = "";

  const currentBookings =
    allBookings[selectedDate] || {};

  times.forEach(time => {

    const row = document.createElement("tr");

    const timeCell = document.createElement("td");
    timeCell.classList.add("time");
    timeCell.textContent = time;

    row.appendChild(timeCell);

    for (let court = 1; court <= 1; court++) {
       
      const cell = document.createElement("td");

      const key = `${time}-${court}`;

      cell.classList.add("slot");

      if (currentBookings[key]) {

        const booking = currentBookings[key];

        const now = Date.now();

        const expirationTime =
          getExpirationTime(selectedDate);

        if (
          now - booking.createdAt >= expirationTime
        ) {

          delete currentBookings[key];

          localStorage.setItem(
            "allBookings",
            JSON.stringify(allBookings)
          );

          cell.textContent = "Available";

        } else {

          // cell.classList.add("booked");

          // cell.textContent =
          //   `Reserved (${booking.name})`;

            cell.classList.add("booked");
            cell.style.pointerEvents = "none";
            cell.textContent =
            `Reserved (${booking.name})`;
         }

      } else {

        cell.textContent = "Available";

        cell.addEventListener("click", () => {

          const exists = selectedSlots.find(
            s => s.time === time && s.court === court
          );

          if (exists) {

            selectedSlots = selectedSlots.filter(
              s => !(s.time === time && s.court === court)
            );

            cell.classList.remove("selected");

            cell.textContent = "Available";

          } else {

            selectedSlots.push({
              time,
              court,
              price: 199
            });

            cell.classList.add("selected");

            cell.textContent = "Selected";
          }

          updateBookingPanel();
        });
      }

      row.appendChild(cell);
    }

    tableBody.appendChild(row);
  });
}


/*
========================================
START BOOKING SUMMARY
========================================
*/

/*
========================================
BOOKING SUMMARY
========================================
*/

function updateBookingPanel() {

  const panel =
    document.getElementById("bookingPanel");

  const summary =
    document.getElementById("summaryContent");

  const totalPrice =
    document.getElementById("totalPrice");

  if (selectedSlots.length === 0) {

    panel.classList.add("hidden");

    return;
  }

  panel.classList.remove("hidden");

  summary.innerHTML = "";

  let total = 0;

  selectedSlots.forEach(slot => {

    const div = document.createElement("div");

    div.classList.add("summary-item");

    const price =
      slot.court === 1 ? 199 : 199;

    total += price;

    div.innerHTML =
  `${slot.time} - ₱${price}`;

    summary.appendChild(div);
  });

  totalPrice.textContent = `₱${total}`;
}


/*
========================================
START INIT TABLE
========================================
*/

/*
========================================
INIT TABLE
========================================
*/

buildTable();


/*
========================================
START AUTO REFRESH TABLE
========================================
*/

/*
========================================
AUTO REFRESH TABLE EVERY 1 MINUTE
========================================
*/

setInterval(() => {
  buildTable();
}, 60000);


/*
========================================
START CONFIRM BOOKING BUTTON
========================================
*/

/*
========================================
CONFIRM BOOKING
========================================
*/

const bookBtn =
  document.getElementById("bookBtn");

if (bookBtn) {
  bookBtn.addEventListener(
    "click",
    confirmBooking
  );
}


/*
========================================
START CONFIRM BOOKING FUNCTION
========================================
*/

/*
========================================
CONFIRM BOOKING FUNCTION
========================================
*/

function confirmBooking() {

  if (selectedSlots.length === 0) {

    alert("No selected slots");

    return;
  }

  /* ========================================
  FIX ADDED:
  CREATE DATE OBJECT IF WALA PA
  ======================================== */

  if (!allBookings[selectedDate]) {
    allBookings[selectedDate] = {};
  }

  

  /* ========================================
  FIX ADDED:
  SAVE BOOKINGS TO LOCALSTORAGE
  ======================================== */

  localStorage.setItem(
    "allBookings",
    JSON.stringify(allBookings)
  );

  localStorage.setItem(
    "bookingData",

    JSON.stringify({
      date: selectedDate,
      slots: selectedSlots
    })
  );

  selectedSlots = [];

  document.getElementById("bookingPanel")
    .classList.add("hidden");

  window.location.href =
    "registration.html";
}


/*
========================================
START CALENDAR SYSTEM
========================================
*/

/*
========================================
CALENDAR SYSTEM
========================================
*/

const todayBtn =
  document.getElementById("calendarBtn");

const calendar =
  document.getElementById("calendar");

const dates =
  document.getElementById("dates");

const monthYear =
  document.getElementById("monthYear");

const prev =
  document.getElementById("prev");

const next =
  document.getElementById("next");

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const today = new Date();

let currentMonth =
  today.getMonth();

let currentYear =
  today.getFullYear();

if (todayBtn) {

  todayBtn.addEventListener("click", () => {

    calendar.style.display =
      calendar.style.display === "block"
        ? "none"
        : "block";
  });
}

function renderCalendar() {

  dates.innerHTML = "";

  monthYear.textContent =
    months[currentMonth] +
    " " +
    currentYear;

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  const lastDate =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  for (let i = 0; i < firstDay; i++) {

    dates.appendChild(
      document.createElement("div")
    );
  }

  for (let day = 1; day <= lastDate; day++) {

    const date =
      document.createElement("div");

    date.classList.add("date");

    date.textContent = day;

    const fullDate =
      new Date(
        currentYear,
        currentMonth,
        day
      );

    fullDate.setHours(0, 0, 0, 0);

    const currentToday = new Date();

    currentToday.setHours(0, 0, 0, 0);

    if (fullDate < currentToday) {

      date.classList.add("locked");

      date.style.opacity = "0.4";

      date.style.cursor =
        "not-allowed";

    } else {

      if (
        day === today.getDate() &&
        currentMonth === today.getMonth() &&
        currentYear === today.getFullYear()
      ) {

        date.classList.add("today");
      }

      date.addEventListener("click", () => {

        selectedDate =
          `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        todayBtn.textContent =
          months[currentMonth] +
          " " +
          day +
          ", " +
          currentYear;

        calendar.style.display = "none";

        selectedSlots = [];

        updateBookingPanel();

        buildTable();
      });
    }

    dates.appendChild(date);
  }
}

if (next) {

  next.addEventListener("click", () => {

    currentMonth++;

    if (currentMonth > 11) {

      currentMonth = 0;

      currentYear++;
    }

    renderCalendar();
  });
}

if (prev) {

  prev.addEventListener("click", () => {

    currentMonth--;

    if (currentMonth < 0) {

      currentMonth = 11;

      currentYear--;
    }

    renderCalendar();
  });
}

renderCalendar();


/*
========================================
START AUTO DISPLAY CURRENT DATE
========================================
*/

/* ========================================
AUTO DISPLAY CURRENT DATE
I ADDED THIS HERE
======================================== */

todayBtn.textContent =
months[currentMonth] +
" " +
today.getDate() +
", " +
currentYear;


/*
========================================
END AUTO DISPLAY CURRENT DATE
========================================
*/
console.log("ALL BOOKINGS:", allBookings);

/*
/* =========================================
   START: MEET THE CREATOR MODAL FUNCTIONALITY
========================================= */

const creatorBtn = document.getElementById("creatorBtn");
const creatorModal = document.getElementById("creatorModal");
const closeBtn = document.querySelector(".close");

if (creatorBtn && creatorModal && closeBtn) {

    creatorBtn.addEventListener("click", function(e){
        e.preventDefault();
        creatorModal.style.display = "flex";
    });

    closeBtn.addEventListener("click", function(){
        creatorModal.style.display = "none";
    });

    window.addEventListener("click", function(e){
        if(e.target === creatorModal){
            creatorModal.style.display = "none";
        }
    });

}

/* =========================================
   END: MEET THE CREATOR MODAL FUNCTIONALITY
========================================= */


/*
========================================
END
========================================
*/

