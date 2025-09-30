const sidebar = document.getElementById("sidebar");

// Mostrar barra si el ratón toca el borde izquierdo (0–10px)
document.addEventListener("mousemove", (e) => {
  if (e.clientX <= 10) {
    sidebar.classList.add("expanded");
  }
});

// Ocultar barra al salir de ella
sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.remove("expanded");
});

// Placeholder para el juego
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#e87722";
ctx.fillRect(50, 50, 100, 100);

ctx.fillStyle = "#3c2f2f";
ctx.font = "20px Open Sans";
ctx.fillText("Aquí irá tu juego", 200, 200);
