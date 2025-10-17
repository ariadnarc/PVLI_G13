/* Barra lateral */ 
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

/* Sección Home */ 

document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".logo");
  const playBtn = document.querySelector(".play-btn");

  // Paso 1: mostrar logo
  setTimeout(() => {
    logo.classList.add("show");
  }, 300);

  // Paso 2: mostrar botón después
  setTimeout(() => {
    playBtn.classList.add("show");
  }, 1500);

  // Paso 3: reducimos tamaño del Logo
  setTimeout(() => {
    logo.classList.add("shrink");
  }, 3000);
});

document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById('playBtn');
  const target = document.getElementById('game');

  if (!playBtn || !target) return;

  playBtn.addEventListener('click', (e) => {
    // Opcional: animaciones antes de scrollear (por ejemplo cerrar splash, encoger logo...)
    // logo.classList.add('shrink');

    // Scroll suave al elemento
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Sección Juego */

// Placeholder para el juego
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#e87722";
ctx.fillRect(10, 10, 1180, 580);

ctx.font = "40px Comfortaa";
ctx.fillStyle = "#3c2f2f";

// Centrar horizontalmente
ctx.textAlign = "center"; // puede ser 'left', 'right', 'center', 'start', 'end'

// Centrar verticalmente
ctx.textBaseline = "middle"; // puede ser 'top', 'middle', 'bottom', 'alphabetic', etc.

// Coordenadas del centro
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

// Dibujar el texto centrado
ctx.fillText("Juego en mantenimiento... Cargando nada", centerX, centerY);

// Crear objeto de imagen
const img = new Image();
img.src = "assets/identidad-visual/Icono-basico-sin-fondo.png";

// Cuando la imagen cargue, dibujarla en el canvas
img.onload = function() {
    // Dibujar la imagen centrada
    const imgX = (canvas.width - 320) / 2;
    const imgY = (canvas.height - 180 + 250) / 2;

    ctx.drawImage(img, imgX, imgY, 320, 180);
};



