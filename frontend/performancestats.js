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

// ==========================
// DATA
// ==========================

const pickleballData = {
  labels: [],
  points: [],
  aces: []
};

// ==========================
// RANDOM NUMBER
// ==========================

function randomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ==========================
// TOTAL FUNCTION
// ==========================

function getTotal(array){
  let total = 0;

  for(let i = 0; i < array.length; i++){
    total += array[i];
  }

  return total;
}

// ==========================
// INITIAL DATA
// ==========================

for(let i = 1; i <= 7; i++){

  pickleballData.labels.push("Round " + i);

  pickleballData.points.push(randomNumber(20,100));

  pickleballData.aces.push(randomNumber(0,15));

}

// ==========================
// DISPLAY STATS
// ==========================

function displayStats(){

  const totalPoints = getTotal(pickleballData.points);
  const totalAces = getTotal(pickleballData.aces);
  const highestPoint = Math.max(...pickleballData.points);

  document.getElementById("stats").innerHTML = `
    <h2>Total Points: ${totalPoints}</h2>
    <h2>Total Aces: ${totalAces}</h2>
    <h2>Highest Points: ${highestPoint}</h2>
  `;
}

// ==========================
// CHART
// ==========================

const ctx = document.getElementById("chart");

const chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: pickleballData.labels,
    datasets: [
      {
        label: "Points",
        data: pickleballData.points,
        borderColor: "green",
        backgroundColor: "rgba(0,255,0,0.2)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Aces",
        data: pickleballData.aces,
        borderColor: "orange",
        backgroundColor: "rgba(255,165,0,0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  },
  options: {
    responsive: true
  }
});

// ==========================
// AUTO UPDATE
// ==========================

function autoUpdate(){

  const nextRound = "Round " + (pickleballData.labels.length + 1);

  pickleballData.labels.push(nextRound);
  pickleballData.points.push(randomNumber(20,100));
  pickleballData.aces.push(randomNumber(0,15));

  // limit data
  if(pickleballData.labels.length > 10){
    pickleballData.labels.shift();
    pickleballData.points.shift();
    pickleballData.aces.shift();
  }

  chart.update();
  displayStats();
}

// ==========================
// INIT
// ==========================

displayStats();

setInterval(autoUpdate, 2000);