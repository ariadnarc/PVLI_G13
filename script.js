const sidebar = document.getElementById("sidebar");

// Detecta cuando el ratón entra al borde izquierdo (0–10px de la pantalla)
document.addEventListener("mousemove", (e) => {
  if (e.clientX <= 10) {
    sidebar.classList.add("expanded");
  }
});

// Oculta la barra cuando el ratón sale de ella
sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.remove("expanded");
});

// Placeholder: lógica para el juego en canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#e87722";
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = "#3c2f2f";
ctx.font = "20px Arial";
ctx.fillText("Juego", 200, 200);