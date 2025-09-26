// Toggle barra lateral
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggle-btn");

toggleBtn.addEventListener("click", () => {
  if (sidebar.style.width === "200px") {
    sidebar.style.width = "60px";
  } else {
    sidebar.style.width = "200px";
  }
});

// Placeholder: lógica para el juego en canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#e87722";
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = "#3c2f2f";
ctx.font = "20px Arial";
ctx.fillText("Juego", 200, 200);