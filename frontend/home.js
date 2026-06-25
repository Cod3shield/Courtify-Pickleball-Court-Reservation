// =========================
// HAMBURGER MENU
// =========================
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("show");
  }
}


// =========================
// SEARCH FUNCTION (HTML CARDS ONLY)
// =========================
function searchItems() {

  const input = document.getElementById("searchInput");
  const noResults = document.getElementById("noResults");

  if (!input) return;

  const value = input.value.toLowerCase();
  const cards = document.querySelectorAll(".venue-card");

  let found = false;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(value)) {
      card.style.display = "";
      found = true;
    } else {
      card.style.display = "none";
    }
  });

  if (noResults) {
    noResults.style.display = found ? "none" : "block";
  }
}


// =========================
// CAROUSEL
// =========================
function initCarousel() {

  const wrapper = document.querySelector(".carouselWrapper");
  if (!wrapper) return;

  const topPics = wrapper.querySelectorAll(".top");
  const bottomPics = wrapper.querySelectorAll(".bottom");

  const gap = 150;
  const speed = 2;
  const containerWidth = wrapper.offsetWidth;

  let topX = [];
  let bottomX = [];

  topPics.forEach((p, i) => topX[i] = i * gap + 50);
  bottomPics.forEach((p, i) => bottomX[i] = i * gap + 50);

  function animate() {

    topPics.forEach((p, i) => {
      topX[i] += speed;
      p.style.left = topX[i] + "px";
      p.style.top = "60px";

      if (topX[i] > containerWidth) {
        topX[i] = Math.min(...topX) - gap;
      }
    });

    bottomPics.forEach((p, i) => {
      bottomX[i] -= speed;
      p.style.left = bottomX[i] + "px";
      p.style.top = "220px";

      if (bottomX[i] < -120) {
        bottomX[i] = Math.max(...bottomX) + gap;
      }
    });
  }

  setInterval(animate, 20);
}


// =========================
// START EVERYTHING
// =========================
initCarousel();